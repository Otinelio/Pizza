import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { LogOut, LayoutDashboard, ChefHat, Info, QrCode, ToggleLeft, ToggleRight, Plus, Pencil, Trash2, X, Image as ImageIcon, Loader2, List, Search } from "lucide-react";
import { ADMIN_PASSWORD, getRestaurantData, saveRestaurantData, formatFCFA, type RestaurantData, type MenuItem, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability } from "@/lib/data";
import { uploadMenuImage, deleteMenuImage, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  if (!auth) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <form onSubmit={(e) => { e.preventDefault(); if (pw.trim() === ADMIN_PASSWORD) { setAuth(true); setErr(""); } else { setErr("Mot de passe incorrect"); } }} style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: "var(--color-smoke)", marginBottom: 8 }}>ADMIN</h1>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--color-fire)", marginBottom: 32 }}>MR. PIZZA</p>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Mot de passe" autoFocus style={{ width: "100%", height: 48, background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 14, padding: "0 16px", outline: "none", marginBottom: 12, boxSizing: "border-box" }} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-fire)")} onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
          {err && <p style={{ color: "#ef4444", fontSize: 13, margin: "0 0 12px" }}>{err}</p>}
          <button type="submit" className="press" style={{ width: "100%", height: 48, background: "var(--color-fire)", color: "#0D0D0D", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", cursor: "pointer" }}>Se connecter</button>
        </form>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => setAuth(false)} />;
}

const tabs = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "cuisine", label: "Cuisine", icon: ChefHat },
  { id: "categories", label: "Catégories", icon: List },
  { id: "infos", label: "Infos restaurant", icon: Info },
  { id: "qr", label: "Tables QR", icon: QrCode },
  { id: "status", label: "Statut", icon: ToggleLeft },
];

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState(getRestaurantData);
  useEffect(() => {
    import("@/lib/data").then(m => {
      m.fetchRestaurantData().then(d => setData(d));
    });
    const h = () => setData(getRestaurantData());
    window.addEventListener("mrpizza_data_changed", h);
    return () => window.removeEventListener("mrpizza_data_changed", h);
  }, []);
  const save = (d: RestaurantData) => { saveRestaurantData(d); setData(d); };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0D0D0D" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: "var(--color-surface)", padding: "24px 0", display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.05)", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--color-smoke)" }}>MR. PIZZA</span>
        </div>
        <nav style={{ flex: 1, padding: "16px 0" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", background: tab === t.id ? "rgba(255,77,28,0.1)" : "transparent", border: "none", borderLeft: tab === t.id ? "3px solid var(--color-fire)" : "3px solid transparent", color: tab === t.id ? "var(--color-fire)" : "var(--color-smoke)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", textAlign: "left", opacity: tab === t.id ? 1 : 0.6 }}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--color-smoke)", opacity: 0.5, fontFamily: "var(--font-display)", fontSize: 11, textTransform: "uppercase", cursor: "pointer" }}><LogOut size={14} /> Déconnexion</button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {!isSupabaseConfigured() && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--radius-md)", padding: "16px 24px", marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
            <Info size={24} color="#ef4444" />
            <div>
              <p style={{ margin: 0, color: "#ef4444", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>Supabase n'est pas configuré.</p>
              <p style={{ margin: "4px 0 0", color: "var(--color-cream)", opacity: 0.7, fontSize: 13 }}>Les modifications seront enregistrées localement (localStorage). L'upload d'images est désactivé.</p>
            </div>
          </div>
        )}
        {tab === "dashboard" && <TabDashboard data={data} />}
        {tab === "cuisine" && <TabCuisine data={data} />}
        {tab === "categories" && <TabCategories data={data} save={save} />}
        {tab === "infos" && <TabInfos data={data} save={save} />}
        {tab === "qr" && <TabQR />}
        {tab === "status" && <TabStatus data={data} save={save} />}
      </main>
    </div>
  );
}

function TabDashboard({ data }: { data: RestaurantData }) {
  const active = data.items.filter(i => i.available).length;
  const stats = [
    { label: "Plats actifs", value: active },
    { label: "Catégories", value: data.categories.length },
    { label: "Statut", value: data.status === "open" ? "Ouvert" : "Fermé" },
  ];
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-smoke)", margin: "0 0 32px", textTransform: "uppercase" }}>Tableau de bord</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "var(--color-surface)", borderRadius: "var(--radius-md)", padding: 24 }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-cream)", opacity: 0.6, margin: "0 0 8px" }}>{s.label}</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: "var(--color-fire)", margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabCategories({ data, save }: { data: RestaurantData; save: (d: RestaurantData) => void }) {
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(false);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    setLoading(true);
    await save({ ...data, categories: [...data.categories, newCat.trim()] });
    setNewCat("");
    setLoading(false);
  };

  const deleteCategory = async (cat: string) => {
    if (confirm(`Voulez-vous vraiment supprimer la catégorie "${cat}" ?`)) {
      setLoading(true);
      await save({ ...data, categories: data.categories.filter(c => c !== cat) });
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-smoke)", margin: "0 0 32px", textTransform: "uppercase" }}>Gestion des Catégories</h2>

      <form onSubmit={addCategory} style={{ display: "flex", gap: 12, marginBottom: 32, maxWidth: 400 }}>
        <input required type="text" value={newCat} onChange={(e) => setNewCat(e.target.value)} disabled={loading} placeholder="Nouvelle catégorie" style={{ flex: 1, height: 40, background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 13, padding: "0 12px", outline: "none" }} />
        <button type="submit" disabled={loading} className="press" style={{ height: 40, padding: "0 20px", background: "var(--color-fire)", color: "#0D0D0D", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", cursor: loading ? "wait" : "pointer" }}>Ajouter</button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
        {data.categories.map((cat, i) => (
          <div key={`${cat}-${i}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--color-surface)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--color-smoke)" }}>{cat}</span>
            <button disabled={loading} onClick={() => deleteCategory(cat)} style={{ background: "none", border: "none", color: "#ef4444", cursor: loading ? "wait" : "pointer", opacity: 0.8 }}><Trash2 size={16} /></button>
          </div>
        ))}
        {data.categories.length === 0 && (
          <p style={{ color: "var(--color-cream)", opacity: 0.6, fontSize: 13 }}>Aucune catégorie.</p>
        )}
      </div>
    </div>
  );
}

function TabCuisine({ data }: { data: RestaurantData }) {
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);

  const toggleAvail = async (id: string, current: boolean) => {
    setIsProcessing(true);
    await toggleItemAvailability(id, !current);
    setIsProcessing(false);
  };

  const deleteItem = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce plat ?")) {
      setIsProcessing(true);
      await deleteMenuItem(id);
      setIsProcessing(false);
    }
  };

  const saveItem = async (item: MenuItem, file?: File | null) => {
    setIsProcessing(true);
    try {
      let imageUrl = item.image;
      const exists = data.items.find(i => i.id === item.id);

      if (file && isSupabaseConfigured()) {
        imageUrl = await uploadMenuImage(file, item.id);
      } else if (!imageUrl && exists?.image && isSupabaseConfigured()) {
        // L'utilisateur a supprimé l'image
        await deleteMenuImage(exists.image);
      }

      const finalItem = { ...item, image: imageUrl };

      if (exists) {
        await updateMenuItem(finalItem);
      } else {
        await addMenuItem(finalItem);
      }
      setEditItem(null);
      setShowAdd(false);
    } catch (err) {
      alert("Erreur lors de la sauvegarde : " + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div style={{ position: "sticky", top: -32, zIndex: 10, background: "var(--color-bg)", padding: "32px 0 16px", margin: "-32px 0 32px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-smoke)", margin: 0, textTransform: "uppercase" }}>Gestion de la cuisine</h2>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", background: "var(--color-surface)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", width: searchExpanded ? 240 : 44, transition: "width 300ms ease-in-out" }}>
              <button onClick={() => setSearchExpanded(!searchExpanded)} style={{ background: "none", border: "none", color: "var(--color-cream)", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <Search size={18} />
              </button>
              <input
                type="search"
                placeholder="Rechercher un plat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", height: 44, background: "transparent", border: "none", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none", paddingRight: 12, opacity: searchExpanded ? 1 : 0, transition: "opacity 300ms ease-in-out" }}
              />
            </div>

            <button disabled={isProcessing} onClick={() => { setEditItem({ id: `item-${Date.now()}`, name: "", description: "", price: 0, category: data.categories[0], image: "", available: true }); setShowAdd(true); }} className="press" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "var(--color-fire)", color: "#0D0D0D", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", cursor: isProcessing ? "wait" : "pointer", opacity: isProcessing ? 0.7 : 1, whiteSpace: "nowrap" }}>
              <Plus size={14} /> Ajouter un plat
            </button>
          </div>
        </div>
      </div>

      {data.categories.map(cat => {
        const items = data.items.filter(i =>
          i.category === cat &&
          i.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (!items.length) return null;
        return (
          <div key={cat} style={{ marginBottom: 32 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-fire)", marginBottom: 12 }}>{cat}</h3>
            {items.map(item => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", background: "var(--color-surface)", borderRadius: "var(--radius-sm)", marginBottom: 8, opacity: isProcessing ? 0.7 : 1 }}>
                {item.image ? (
                  <img src={item.image} alt="" style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)", objectFit: "cover", background: "rgba(255,255,255,0.05)" }} />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-cream)", opacity: 0.3 }}><ImageIcon size={20} /></div>
                )}
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--color-smoke)", display: "block" }}>{item.name}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--color-fire)", marginTop: 4, display: "block" }}>{formatFCFA(item.price)}</span>
                </div>
                <button disabled={isProcessing} onClick={() => toggleAvail(item.id, item.available)} style={{ background: "none", border: "none", cursor: isProcessing ? "wait" : "pointer", color: item.available ? "#22c55e" : "#ef4444" }}>{item.available ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}</button>
                <button disabled={isProcessing} onClick={() => setEditItem(item)} style={{ background: "none", border: "none", cursor: isProcessing ? "wait" : "pointer", color: "var(--color-smoke)", opacity: 0.5 }}><Pencil size={16} /></button>
                <button disabled={isProcessing} onClick={() => deleteItem(item.id)} style={{ background: "none", border: "none", cursor: isProcessing ? "wait" : "pointer", color: "#ef4444", opacity: 0.6 }}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        );
      })}
      {(editItem || showAdd) && editItem && <ItemModal item={editItem} categories={data.categories} onSave={saveItem} onClose={() => { setEditItem(null); setShowAdd(false); }} />}
    </div>
  );
}

function ItemModal({ item, categories, onSave, onClose }: { item: MenuItem; categories: string[]; onSave: (i: MenuItem, f: File | null) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState(item);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(item.image || "");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const objUrl = URL.createObjectURL(f);
      setPreview(objUrl);
    }
  };

  const addSupplementField = () => {
    const current = form.supplements || [];
    setForm({
      ...form,
      supplements: [...current, { name: "", price: 0 }]
    });
  };

  const updateSupplementField = (index: number, key: 'name' | 'price', value: any) => {
    const current = [...(form.supplements || [])];
    current[index] = {
      ...current[index],
      [key]: key === 'price' ? Number(value) : value
    };
    setForm({ ...form, supplements: current });
  };

  const removeSupplementField = (index: number) => {
    const current = (form.supplements || []).filter((_, i) => i !== index);
    setForm({ ...form, supplements: current });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Nettoyer les suppléments vides
    const cleanedSupplements = (form.supplements || []).filter(s => s.name.trim() !== "");
    await onSave({ ...form, supplements: cleanedSupplements }, file);
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="modal-in" style={{ background: "var(--color-surface)", borderRadius: "var(--radius-md)", padding: 32, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--color-smoke)", margin: 0 }}>{item.name ? "Modifier" : "Ajouter"} un plat</h3>
          <button onClick={onClose} disabled={loading} style={{ background: "none", border: "none", color: "var(--color-smoke)", cursor: "pointer", opacity: loading ? 0.3 : 1 }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Image Upload Area */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-cream)", opacity: 0.6, display: "block" }}>Image du plat</label>
              {preview && (
                <button type="button" onClick={() => { setPreview(""); setFile(null); setForm({ ...form, image: "" }); }} style={{ background: "none", border: "none", color: "#ef4444", fontSize: 11, fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", cursor: "pointer", opacity: 0.8 }}>Supprimer</button>
              )}
            </div>
            <div style={{ position: "relative", width: "100%", height: 160, background: "var(--color-bg)", borderRadius: "var(--radius-sm)", border: "1px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer" }}>
              {preview ? (
                <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--color-cream)", opacity: 0.5 }}>
                  <ImageIcon size={32} />
                  <span style={{ fontSize: 12, fontFamily: "var(--font-display)", textTransform: "uppercase", fontWeight: 600 }}>Cliquez pour ajouter</span>
                </div>
              )}
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} disabled={loading || !isSupabaseConfigured()} style={{ position: "absolute", inset: 0, opacity: 0, cursor: isSupabaseConfigured() && !loading ? "pointer" : "not-allowed" }} title={isSupabaseConfigured() ? "Changer l'image" : "Upload désactivé (Supabase requis)"} />
              {preview && isSupabaseConfigured() && (
                <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "white", padding: "4px 8px", borderRadius: "var(--radius-sm)", fontSize: 10, fontFamily: "var(--font-display)", fontWeight: 600, pointerEvents: "none" }}>MODIFIER</div>
              )}
            </div>
            {!isSupabaseConfigured() && (
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#ef4444" }}>L'upload d'images nécessite la configuration de Supabase.</p>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-cream)", opacity: 0.6, marginBottom: 4, display: "block" }}>Nom</label>
              <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={loading} style={{ width: "100%", height: 40, background: "var(--color-bg)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 13, padding: "0 12px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-cream)", opacity: 0.6, marginBottom: 4, display: "block" }}>Prix (FCFA)</label>
              <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} disabled={loading} style={{ width: "100%", height: 40, background: "var(--color-bg)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 13, padding: "0 12px", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-cream)", opacity: 0.6, marginBottom: 4, display: "block" }}>Description</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={loading} style={{ width: "100%", height: 40, background: "var(--color-bg)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 13, padding: "0 12px", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div>
            <label style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-cream)", opacity: 0.6, marginBottom: 4, display: "block" }}>Catégorie</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} disabled={loading} style={{ width: "100%", height: 40, background: "var(--color-bg)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 13, padding: "0 12px", outline: "none" }}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Hidden image URL field for manual edit if needed, or fallback */}
          {!isSupabaseConfigured() && (
            <div>
              <label style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-cream)", opacity: 0.6, marginBottom: 4, display: "block" }}>URL Image (Fallback)</label>
              <input type="url" value={form.image} onChange={(e) => { setForm({ ...form, image: e.target.value }); setPreview(e.target.value); }} disabled={loading} style={{ width: "100%", height: 40, background: "var(--color-bg)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 13, padding: "0 12px", outline: "none", boxSizing: "border-box" }} />
            </div>
          )}

          {/* Section Suppléments */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-fire)", margin: 0 }}>Suppléments</h4>
              <button
                type="button"
                onClick={addSupplementField}
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "none",
                  border: "none",
                  color: "var(--color-smoke)",
                  cursor: "pointer",
                  fontSize: 11,
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  opacity: 0.8,
                  padding: "6px 12px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "rgba(255,255,255,0.05)"
                }}
              >
                <Plus size={12} /> Ajouter
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflowY: "auto", paddingRight: 4 }}>
              {(form.supplements || []).map((sup, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    required
                    type="text"
                    placeholder="Nom du supplément (ex: Fromage)"
                    value={sup.name}
                    onChange={(e) => updateSupplementField(idx, "name", e.target.value)}
                    disabled={loading}
                    style={{ flex: 2, height: 38, background: "var(--color-bg)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 13, padding: "0 10px", outline: "none", boxSizing: "border-box" }}
                  />
                  <input
                    required
                    type="number"
                    placeholder="Prix"
                    value={sup.price || ""}
                    onChange={(e) => updateSupplementField(idx, "price", e.target.value)}
                    disabled={loading}
                    style={{ flex: 1, height: 38, background: "var(--color-bg)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 13, padding: "0 10px", outline: "none", boxSizing: "border-box" }}
                  />
                  <button
                    type="button"
                    onClick={() => removeSupplementField(idx)}
                    disabled={loading}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", opacity: 0.8, display: "flex", alignItems: "center", justifyContent: "center", padding: 6 }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {(form.supplements || []).length === 0 && (
                <p style={{ color: "var(--color-cream)", opacity: 0.5, fontSize: 12, margin: "4px 0 0", fontStyle: "italic" }}>Aucun supplément configuré pour ce produit.</p>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className="press" style={{ height: 44, background: "var(--color-fire)", color: "#0D0D0D", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", cursor: loading ? "wait" : "pointer", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Traitement...</> : "Sauvegarder"}
          </button>
        </form>
      </div>
    </div>
  );
}

function TabInfos({ data, save }: { data: RestaurantData; save: (d: RestaurantData) => void }) {
  const [form, setForm] = useState(data);
  const [loading, setLoading] = useState(false);
  const fields = [
    { key: "name", label: "Nom" }, { key: "tagline", label: "Tagline" }, { key: "whatsapp", label: "WhatsApp" },
    { key: "address", label: "Adresse" }, { key: "hours", label: "Horaires" }, { key: "instagram", label: "Instagram" },
    { key: "facebook", label: "Facebook" }, { key: "heroMessage", label: "Message hero" },
  ];
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-smoke)", margin: "0 0 32px", textTransform: "uppercase" }}>Infos restaurant</h2>
      <form onSubmit={async (e) => { e.preventDefault(); setLoading(true); await save({ ...data, ...form }); setLoading(false); }} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 500 }}>
        {fields.map(f => (
          <div key={f.key}>
            <label style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-cream)", opacity: 0.6, marginBottom: 4, display: "block" }}>{f.label}</label>
            <input type="text" value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} disabled={loading} style={{ width: "100%", height: 40, background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 13, padding: "0 12px", outline: "none", boxSizing: "border-box" }} />
          </div>
        ))}
        <button type="submit" disabled={loading} className="press" style={{ height: 44, background: "var(--color-fire)", color: "#0D0D0D", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
          {loading ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : "Sauvegarder"}
        </button>
      </form>
    </div>
  );
}

function TabQR() {
  const [count, setCount] = useState(5);
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-smoke)", margin: "0 0 24px", textTransform: "uppercase" }}>Tables QR</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <label style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-cream)" }}>Nombre de tables :</label>
        <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))} style={{ width: 80, height: 36, background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 14, textAlign: "center", outline: "none" }} />
        <button onClick={() => window.print()} className="press" style={{ padding: "8px 20px", background: "var(--color-fire)", color: "#0D0D0D", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", cursor: "pointer" }}>Imprimer</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
        {Array.from({ length: count }, (_, i) => i + 1).map(n => (
          <div
            key={n}
            style={{
              background: "linear-gradient(135deg, var(--color-surface) 0%, #151515 100%)",
              borderRadius: "var(--radius-md)",
              padding: "24px 20px",
              textAlign: "center",
              border: "1px solid rgba(255, 77, 28, 0.15)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Glowing top line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--color-fire) 0%, #ff883b 100%)" }} />

            {/* Background design accents */}
            <div style={{ position: "absolute", top: -20, left: -20, width: 60, height: 60, borderRadius: "50%", background: "var(--color-fire)", filter: "blur(40px)", opacity: 0.15, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -20, right: -20, width: 60, height: 60, borderRadius: "50%", background: "var(--color-fire)", filter: "blur(40px)", opacity: 0.15, pointerEvents: "none" }} />

            {/* Restaurant Branding Header */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--color-smoke)", display: "block", marginTop: 4 }}>
                Table {n}
              </span>
            </div>

            {/* Beautiful QR Code container with subtle glow */}
            <div style={{
              background: "#0D0D0D",
              padding: 16,
              borderRadius: "var(--radius-sm)",
              display: "inline-block",
              border: "1px solid rgba(255,77,28,0.1)",
              boxShadow: "0 4px 20px rgba(255,77,28,0.05)",
              position: "relative"
            }}>
              <QRCodeSVG
                value={`${window.location.origin}/menu/scan?table=${n}`}
                size={130}
                bgColor="#0D0D0D"
                fgColor="var(--color-fire)"
                level="H"
                imageSettings={{
                  src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'></svg>",
                  height: 32,
                  width: 32,
                  excavate: true
                }}
              />
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#0D0D0D",
                padding: "2px 6px",
                border: "1px solid var(--color-fire)",
                borderRadius: 4,
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: 8,
                color: "var(--color-fire)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap"
              }}>
                Mr. Pizza
              </div>
            </div>

            {/* Instruction Footer */}
            <div style={{ marginTop: 16 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-cream)", opacity: 0.6, display: "block", fontWeight: 500 }}>
                Scannez pour voir le menu
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabStatus({ data, save }: { data: RestaurantData; save: (d: RestaurantData) => void }) {
  const [loading, setLoading] = useState(false);
  const isOpen = data.status === "open";
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-smoke)", margin: "0 0 32px", textTransform: "uppercase" }}>Statut du restaurant</h2>
      <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-md)", padding: 32, display: "flex", alignItems: "center", gap: 24, maxWidth: 400 }}>
        <button disabled={loading} onClick={async () => { setLoading(true); await save({ ...data, status: isOpen ? "closed" : "open" }); setLoading(false); }} style={{ background: "none", border: "none", cursor: loading ? "wait" : "pointer", color: isOpen ? "#22c55e" : "#ef4444", opacity: loading ? 0.5 : 1 }}>{isOpen ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}</button>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--color-smoke)", margin: 0 }}>{isOpen ? "Ouvert" : "Fermé"}</p>
          <p style={{ fontSize: 13, color: "var(--color-cream)", opacity: 0.6, margin: "4px 0 0" }}>{isOpen ? "Le restaurant accepte les commandes" : "Le restaurant est fermé"}</p>
        </div>
      </div>
    </div>
  );
}
