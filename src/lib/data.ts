// ── Types ──────────────────────────────────
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
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
  categories: ["PIZZAS", "POULET", "COMBOS", "FRITES & SALADES", "BOISSONS"],
  items: [
    // PIZZAS
    {
      id: "pizza-1",
      name: "Pizza Classique Margherita",
      description: "Tomate, mozzarella, basilic frais",
      price: 3500,
      category: "PIZZAS",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
      available: true,
    },
    {
      id: "pizza-2",
      name: "Pizza Péri Péri Chicken",
      description: "Sauce pimentée, poulet grillé, oignons rouges",
      price: 4500,
      category: "PIZZAS",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
      available: true,
    },
    {
      id: "pizza-3",
      name: "Pizza Végétarienne",
      description: "Légumes frais de saison, sauce tomate",
      price: 3800,
      category: "PIZZAS",
      image: "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=600&h=400&fit=crop",
      available: true,
    },
    {
      id: "pizza-4",
      name: "Pizza Signature MR.",
      description: "Recette maison, épices locales",
      price: 5000,
      category: "PIZZAS",
      image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&h=400&fit=crop",
      available: true,
    },
    {
      id: "pizza-5",
      name: "Pizza Customisée",
      description: "Vous choisissez vos garnitures",
      price: 3000,
      category: "PIZZAS",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
      available: true,
    },
    // POULET
    {
      id: "poulet-1",
      name: "Péri Péri Chicken",
      description: "Poulet grillé sauce pimentée togolaise",
      price: 3500,
      category: "POULET",
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&h=400&fit=crop",
      available: true,
    },
    {
      id: "poulet-2",
      name: "Chicken Wings x6",
      description: "Ailes croustillantes, sauce maison",
      price: 2500,
      category: "POULET",
      image: "https://images.unsplash.com/photo-1608039829572-9b0190155690?w=600&h=400&fit=crop",
      available: true,
    },
    {
      id: "poulet-3",
      name: "Nuggets x8",
      description: "Croustillants, sauce au choix",
      price: 2000,
      category: "POULET",
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop",
      available: true,
    },
    // COMBOS
    {
      id: "combo-1",
      name: "Combo Étudiant",
      description: "1 pizza 25cm + 1 boisson",
      price: 4000,
      category: "COMBOS",
      image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600&h=400&fit=crop",
      available: true,
    },
    {
      id: "combo-2",
      name: "Combo Famille",
      description: "2 pizzas 30cm + 4 boissons + frites",
      price: 12000,
      category: "COMBOS",
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&h=400&fit=crop",
      available: true,
    },
    {
      id: "combo-3",
      name: "Combo Solo",
      description: "1 burger + frites + boisson",
      price: 3000,
      category: "COMBOS",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
      available: true,
    },
    // FRITES & SALADES
    {
      id: "side-1",
      name: "Frites Maison",
      description: "Dorées, croustillantes",
      price: 1000,
      category: "FRITES & SALADES",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop",
      available: true,
    },
    {
      id: "side-2",
      name: "Salade Fraîche",
      description: "Légumes, vinaigrette maison",
      price: 1500,
      category: "FRITES & SALADES",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
      available: true,
    },
    // BOISSONS
    {
      id: "drink-1",
      name: "Coca-Cola / Fanta / Sprite",
      description: "Boisson fraîche 33cl",
      price: 500,
      category: "BOISSONS",
      image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&h=400&fit=crop",
      available: true,
    },
    {
      id: "drink-2",
      name: "Jus local",
      description: "Jus de fruits frais 33cl",
      price: 700,
      category: "BOISSONS",
      image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&h=400&fit=crop",
      available: true,
    },
  ],
};

// ── Persistence helpers ────────────────────
const LS_KEY = "mrpizza_data";

export function getRestaurantData(): RestaurantData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as RestaurantData;
  } catch {
    /* ignore */
  }
  return structuredClone(DEFAULT_DATA);
}

export function saveRestaurantData(data: RestaurantData): void {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("mrpizza_data_changed"));
}

export function resetRestaurantData(): void {
  localStorage.removeItem(LS_KEY);
  window.dispatchEvent(new CustomEvent("mrpizza_data_changed"));
}

export function formatFCFA(n: number): string {
  return n.toLocaleString("fr-FR") + " FCFA";
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
