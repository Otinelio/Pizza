import { supabase, isSupabaseConfigured } from "./supabase";

// ── Types ──────────────────────────────────
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  position?: number;
}

export interface RestaurantData {
  name: string;
  tagline: string;
  whatsapp: string;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
  heroMessage: string;
  status: "open" | "closed";
  categories: string[];
  items: MenuItem[];
}

// ── Credentials ────────────────────────────
export const ADMIN_PASSWORD = "mrpizza2025";
export const KITCHEN_PASSWORD = "cuisine2025";

// ── Default Data ───────────────────────────
export const DEFAULT_DATA: RestaurantData = {
  name: "Mr. Pizza Lomé",
  tagline: "Le meilleur goût à Lomé — Toujours chaude",
  whatsapp: "+22891599999",
  address: "Novissi, entre la station MRS et Jemima's Kitchen, Lomé, Togo",
  hours: "Mar–Ven : 12h–22h / Sam–Dim : 12h–23h",
  instagram: "https://instagram.com/mr.pizzatogo",
  facebook: "https://facebook.com/mr.pizzatg",
  heroMessage: "La meilleure pizza de la capitale — sans compromis, sans additifs.",
  status: "open",
  categories: [],
  items: [],
};

// ── Cache en mémoire ───────────────────────
let cachedData: RestaurantData | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 10_000; // 10 secondes

// ── Synchronous getter (pour compat existante) ──
export function getRestaurantData(): RestaurantData {
  if (cachedData) return cachedData;
  // Fallback localStorage puis default
  try {
    const raw = localStorage.getItem("mrpizza_data");
    if (raw) return JSON.parse(raw) as RestaurantData;
  } catch { /* ignore */ }
  return structuredClone(DEFAULT_DATA);
}

// ── Async fetch depuis Supabase ────────────
export async function fetchRestaurantData(): Promise<RestaurantData> {
  if (!isSupabaseConfigured()) return getRestaurantData();

  // Retourner le cache si encore frais
  if (cachedData && Date.now() - lastFetchTime < CACHE_TTL) return cachedData;

  try {
    // Charger la config restaurant
    const { data: configs } = await supabase
      .from("restaurant_config")
      .select("*")
      .limit(1);

    const config = configs?.[0];

    // Charger les catégories ordonnées
    const { data: cats } = await supabase
      .from("categories")
      .select("*")
      .order("position", { ascending: true });

    // Charger les items du menu
    const { data: items } = await supabase
      .from("menu_items")
      .select("*")
      .order("position", { ascending: true });

    if (!config || !cats || !items) {
      // Supabase accessible mais tables vides → utiliser les données par défaut
      return getRestaurantData();
    }

    const result: RestaurantData = {
      name: config.name || DEFAULT_DATA.name,
      tagline: config.tagline || DEFAULT_DATA.tagline,
      whatsapp: config.whatsapp || DEFAULT_DATA.whatsapp,
      address: config.address || DEFAULT_DATA.address,
      hours: config.hours || DEFAULT_DATA.hours,
      instagram: config.instagram || DEFAULT_DATA.instagram,
      facebook: config.facebook || DEFAULT_DATA.facebook,
      heroMessage: config.hero_message || DEFAULT_DATA.heroMessage,
      status: (config.status as "open" | "closed") || "open",
      categories: cats.map((c: { name: string }) => c.name),
      items: items.map((i: Record<string, unknown>) => ({
        id: i.id as string,
        name: i.name as string,
        description: (i.description as string) || "",
        price: i.price as number,
        category: i.category_name as string,
        image: (i.image_url as string) || "",
        available: i.available !== false,
        position: (i.position as number) || 0,
      })),
    };

    cachedData = result;
    lastFetchTime = Date.now();

    // Sync vers localStorage comme backup
    localStorage.setItem("mrpizza_data", JSON.stringify(result));
    window.dispatchEvent(new CustomEvent("mrpizza_data_changed"));

    return result;
  } catch (err) {
    console.warn("Supabase fetch failed, using local data:", err);
    return getRestaurantData();
  }
}

// ── Save vers Supabase ─────────────────────
export async function saveRestaurantDataAsync(data: RestaurantData): Promise<void> {
  // Toujours sauvegarder en local
  localStorage.setItem("mrpizza_data", JSON.stringify(data));
  cachedData = data;
  lastFetchTime = Date.now();
  window.dispatchEvent(new CustomEvent("mrpizza_data_changed"));

  if (!isSupabaseConfigured()) return;

  try {
    // Sauvegarder la config restaurant
    const { data: existingConfigs } = await supabase
      .from("restaurant_config")
      .select("id")
      .limit(1);

    const configPayload = {
      name: data.name,
      tagline: data.tagline,
      whatsapp: data.whatsapp,
      address: data.address,
      hours: data.hours,
      instagram: data.instagram,
      facebook: data.facebook,
      hero_message: data.heroMessage,
      status: data.status,
      updated_at: new Date().toISOString(),
    };

    if (existingConfigs && existingConfigs.length > 0) {
      await supabase
        .from("restaurant_config")
        .update(configPayload)
        .eq("id", existingConfigs[0].id);
    } else {
      await supabase.from("restaurant_config").insert(configPayload);
    }

    // Sauvegarder les catégories
    await supabase.from("categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (data.categories.length > 0) {
      await supabase.from("categories").insert(
        data.categories.map((name, i) => ({ name, position: i }))
      );
    }

    // Sauvegarder les items (upsert)
    // D'abord on supprime les items qui ne sont plus dans la liste
    const currentIds = data.items.map(i => i.id);
    if (currentIds.length > 0) {
      await supabase.from("menu_items").delete().not("id", "in", `(${currentIds.join(",")})`);
    } else {
      await supabase.from("menu_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    }

    // Upsert les items
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      await supabase.from("menu_items").upsert({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category_name: item.category,
        image_url: item.image,
        available: item.available,
        position: i,
      });
    }
  } catch (err) {
    console.error("Supabase save failed:", err);
  }
}

// ── Compat wrapper synchrone ───────────────
export function saveRestaurantData(data: RestaurantData): void {
  saveRestaurantDataAsync(data);
}

export function resetRestaurantData(): void {
  localStorage.removeItem("mrpizza_data");
  cachedData = null;
  window.dispatchEvent(new CustomEvent("mrpizza_data_changed"));
}

export function formatFCFA(n: number): string {
  return n.toLocaleString("fr-FR") + " FCFA";
}

// ── Supabase Menu Item CRUD ────────────────
export async function addMenuItem(item: MenuItem): Promise<void> {
  const data = getRestaurantData();
  data.items.push(item);
  cachedData = data;
  localStorage.setItem("mrpizza_data", JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("mrpizza_data_changed"));

  if (!isSupabaseConfigured()) return;

  await supabase.from("menu_items").insert({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category_name: item.category,
    image_url: item.image,
    available: item.available,
    position: 999,
  });
}

export async function updateMenuItem(item: MenuItem): Promise<void> {
  const data = getRestaurantData();
  data.items = data.items.map(i => i.id === item.id ? item : i);
  cachedData = data;
  localStorage.setItem("mrpizza_data", JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("mrpizza_data_changed"));

  if (!isSupabaseConfigured()) return;

  await supabase.from("menu_items").update({
    name: item.name,
    description: item.description,
    price: item.price,
    category_name: item.category,
    image_url: item.image,
    available: item.available,
  }).eq("id", item.id);
}

export async function deleteMenuItem(id: string): Promise<void> {
  const data = getRestaurantData();
  data.items = data.items.filter(i => i.id !== id);
  cachedData = data;
  localStorage.setItem("mrpizza_data", JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("mrpizza_data_changed"));

  if (!isSupabaseConfigured()) return;

  await supabase.from("menu_items").delete().eq("id", id);
}

export async function toggleItemAvailability(id: string, available: boolean): Promise<void> {
  const data = getRestaurantData();
  data.items = data.items.map(i => i.id === id ? { ...i, available } : i);
  cachedData = data;
  localStorage.setItem("mrpizza_data", JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("mrpizza_data_changed"));

  if (!isSupabaseConfigured()) return;

  await supabase.from("menu_items").update({ available }).eq("id", id);
}

// ── Kitchen Orders ─────────────────────────
export interface KitchenOrder {
  id: string;
  table: number;
  items: { name: string; qty: number; price: number }[];
  note: string;
  total: number;
  status: "pending" | "preparing" | "ready" | "served";
  createdAt: number;
}

const ORDERS_KEY = "mrpizza_orders";

export function getOrders(): KitchenOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) return JSON.parse(raw) as KitchenOrder[];
  } catch {
    /* ignore */
  }
  return [];
}

export function saveOrders(orders: KitchenOrder[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// ── Initialisation des données Supabase ────
export async function initSupabaseData(): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    // Vérifier si la config existe déjà
    const { data: configs } = await supabase
      .from("restaurant_config")
      .select("id")
      .limit(1);

    if (configs && configs.length > 0) return; // Déjà initialisé

    // Insérer la config par défaut
    await supabase.from("restaurant_config").insert({
      name: DEFAULT_DATA.name,
      tagline: DEFAULT_DATA.tagline,
      whatsapp: DEFAULT_DATA.whatsapp,
      address: DEFAULT_DATA.address,
      hours: DEFAULT_DATA.hours,
      instagram: DEFAULT_DATA.instagram,
      facebook: DEFAULT_DATA.facebook,
      hero_message: DEFAULT_DATA.heroMessage,
      status: DEFAULT_DATA.status,
    });

    // Insérer les catégories
    await supabase.from("categories").insert(
      DEFAULT_DATA.categories.map((name, i) => ({ name, position: i }))
    );

    // Insérer les items
    await supabase.from("menu_items").insert(
      DEFAULT_DATA.items.map((item, i) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category_name: item.category,
        image_url: item.image,
        available: item.available,
        position: i,
      }))
    );

    console.log("✅ Supabase data initialized with defaults");
  } catch (err) {
    console.warn("Failed to initialize Supabase data:", err);
  }
}
