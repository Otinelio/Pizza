import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { LogOut, LayoutDashboard, ChefHat, Info, QrCode, ToggleLeft, ToggleRight, Plus, Pencil, Trash2, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { ADMIN_PASSWORD, getRestaurantData, saveRestaurantData, formatFCFA, type RestaurantData, type MenuItem, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability } from "@/lib/data";
import { uploadMenuImage, isSupabaseConfigured } from "@/lib/supabase";

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
  { id: "infos", label: "Infos restaurant", icon: Info },
  { id: "qr", label: "Tables QR", icon: QrCode },
  { id: "status", label: "Statut", icon: ToggleLeft },
];

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState(getRestaurantData);
  useEffect(() => { const h = () => setData(getRestaurantData()); window.addEventListener("mrpizza_data_changed", h); return () => window.removeEventListener("mrpizza_data_changed", h); }, []);
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

function TabCuisine({ data }: { data: RestaurantData }) {
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

      // Si un fichier est fourni et Supabase est configuré, on l'upload
      if (file && isSupabaseConfigured()) {
        imageUrl = await uploadMenuImage(file, item.id);
      }

      const finalItem = { ...item, image: imageUrl };

      const exists = data.items.find(i => i.id === item.id);
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-smoke)", margin: 0, textTransform: "uppercase" }}>Gestion de la cuisine</h2>
        <button disabled={isProcessing} onClick={() => { setEditItem({ id: `item-${Date.now()}`, name: "", description: "", price: 0, category: data.categories[0], image: "", available: true }); setShowAdd(true); }} className="press" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "var(--color-fire)", color: "#0D0D0D", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", cursor: isProcessing ? "wait" : "pointer", opacity: isProcessing ? 0.7 : 1 }}><Plus size={14} /> Ajouter un plat</button>
      </div>
      {data.categories.map(cat => {
        const items = data.items.filter(i => i.category === cat);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(form, file);
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
            <label style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-cream)", opacity: 0.6, marginBottom: 8, display: "block" }}>Image du plat</label>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        {Array.from({ length: count }, (_, i) => i + 1).map(n => (
          <div key={n} style={{ background: "var(--color-surface)", borderRadius: "var(--radius-md)", padding: 20, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--color-smoke)", margin: "0 0 12px" }}>Table {n}</p>
            <QRCodeSVG value={`${window.location.origin}/menu/scan?table=${n}`} size={120} bgColor="transparent" fgColor="#F8F8F8" />
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
