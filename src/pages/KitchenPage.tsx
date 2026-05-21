import { useState, useEffect, useCallback } from "react";
import { LogOut, Plus, X, GripVertical } from "lucide-react";
import { KITCHEN_PASSWORD, getRestaurantData, getOrders, saveOrders, formatFCFA, type KitchenOrder, type MenuItem } from "@/lib/data";

const COLS = [
  { status: "pending" as const, label: "EN ATTENTE", bg: "#FEF3C7" },
  { status: "preparing" as const, label: "EN PRÉPARATION", bg: "#DBEAFE" },
  { status: "ready" as const, label: "PRÊT", bg: "#D1FAE5" },
  { status: "served" as const, label: "SERVI", bg: "#F3F4F6" },
];

export default function KitchenPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  if (!auth) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <form onSubmit={(e) => { e.preventDefault(); if (pw.trim() === KITCHEN_PASSWORD) { setAuth(true); setErr(""); } else setErr("Mot de passe incorrect"); }} style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
          <img 
            src="/src/lib/images/logopizza.png" 
            alt="Mr. Pizza" 
            style={{
              height: "80px",
              width: "auto",
              marginBottom: 16,
            }}
          />
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--color-fire)", marginBottom: 32 }}>CUISINE</p>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Mot de passe" autoFocus style={{ width: "100%", height: 48, background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 14, padding: "0 16px", outline: "none", marginBottom: 12, boxSizing: "border-box" }} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-fire)")} onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
          {err && <p style={{ color: "#ef4444", fontSize: 13, margin: "0 0 12px" }}>{err}</p>}
          <button type="submit" className="press" style={{ width: "100%", height: 48, background: "var(--color-fire)", color: "#0D0D0D", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", cursor: "pointer" }}>Accéder à la cuisine</button>
        </form>
      </div>
    );
  }

  return <KitchenDashboard onLogout={() => setAuth(false)} />;
}

function KitchenDashboard({ onLogout }: { onLogout: () => void }) {
  const [orders, setOrders] = useState<KitchenOrder[]>(getOrders);
  const [showNew, setShowNew] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // Fetch menu data from Supabase for NewOrderModal
  useEffect(() => {
    import("@/lib/data").then(m => {
      m.fetchRestaurantData();
    });
  }, []);

  // Poll for new orders from localStorage
  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => t + 1);
      const latest = getOrders();
      if (JSON.stringify(latest) !== JSON.stringify(orders)) {
        setOrders(latest);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [orders]);

  const hasPending = orders.some(o => o.status === "pending");

  useEffect(() => {
    if (!hasPending) return;
    
    let ctx: AudioContext | null = null;
    let osc: OscillatorNode | null = null;
    let gain: GainNode | null = null;
    let interval: ReturnType<typeof setInterval>;

    const initAudio = () => {
      try {
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        osc = ctx.createOscillator();
        gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        
        osc.start();

        const beep = () => {
          if (ctx?.state === "suspended") ctx.resume();
          gain!.gain.setValueAtTime(0.5, ctx!.currentTime);
          gain!.gain.setValueAtTime(0, ctx!.currentTime + 0.2);
        };
        
        beep();
        interval = setInterval(beep, 2000);
      } catch (e) {
        console.error("Audio API error", e);
      }
    };

    initAudio();

    return () => {
      clearInterval(interval);
      if (osc) {
        try { osc.stop(); osc.disconnect(); } catch {}
      }
      if (gain) {
        try { gain.disconnect(); } catch {}
      }
      if (ctx) {
        try { ctx.close(); } catch {}
      }
    };
  }, [hasPending]);

  const persist = useCallback((o: KitchenOrder[]) => { setOrders(o); saveOrders(o); }, []);

  const moveOrder = (id: string, newStatus: KitchenOrder["status"]) => {
    persist(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const archiveOrder = (id: string) => persist(orders.filter(o => o.id !== id));

  const addOrder = (order: KitchenOrder) => { persist([...orders, order]); setShowNew(false); };

  const activeCount = orders.filter(o => o.status !== "served").length;
  const prepCount = orders.filter(o => o.status === "preparing").length;
  const sessionTotal = orders.reduce((s, o) => s + o.total, 0);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      {/* Topbar */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #E5E7EB", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#111", margin: 0, textTransform: "uppercase" }}>ESPACE CUISINE</h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "2px 0 0", textTransform: "capitalize" }}>{today}</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => setShowNew(true)} className="press" style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", background: "var(--color-fire)", color: "#FFF", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", cursor: "pointer", minHeight: 48 }}><Plus size={16} /> NOUVELLE COMMANDE</button>
          <button onClick={onLogout} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", padding: 8 }}><LogOut size={18} /></button>
        </div>
      </header>

      {/* Kanban */}
      <div style={{ flex: 1, padding: 24, overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(260px, 1fr))", gap: 0, minWidth: 1040 }}>
          {COLS.map((col, ci) => {
            const colOrders = orders.filter(o => o.status === col.status);
            return (
              <div
                key={col.status}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); if (dragId) moveOrder(dragId, col.status); setDragId(null); }}
                style={{ borderRight: ci < 3 ? "1px solid #E5E7EB" : "none", padding: "0 12px", minHeight: 400 }}
              >
                <div style={{ background: col.bg, borderRadius: "var(--radius-sm)", padding: "10px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "#111" }}>{col.label}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, background: "rgba(0,0,0,0.1)", borderRadius: 10, padding: "2px 8px", color: "#111" }}>{colOrders.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {colOrders.map(order => (
                    <OrderCard key={order.id} order={order} onMove={moveOrder} onArchive={archiveOrder} onDragStart={() => setDragId(order.id)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom stats */}
      <div style={{ borderTop: "1px solid #E5E7EB", padding: "12px 24px", display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap", background: "#F9FAFB" }}>
        <Stat label="Commandes actives" value={String(activeCount)} />
        <Stat label="En préparation" value={String(prepCount)} />
        <Stat label="Total session" value={formatFCFA(sessionTotal)} />
      </div>

      {showNew && <NewOrderModal onAdd={addOrder} onClose={() => setShowNew(false)} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280", margin: "0 0 2px", fontFamily: "var(--font-body)" }}>{label}</p>
      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#111", margin: 0 }}>{value}</p>
    </div>
  );
}

function OrderCard({ order, onMove, onArchive, onDragStart }: { order: KitchenOrder; onMove: (id: string, s: KitchenOrder["status"]) => void; onArchive: (id: string) => void; onDragStart: () => void }) {
  const elapsed = Math.floor((Date.now() - order.createdAt) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const timeColor = mins >= 20 ? "#EF4444" : mins >= 10 ? "#FF4D1C" : "#111";
  const pulse = mins >= 20;

  const nextAction: Record<string, { label: string; next: KitchenOrder["status"] } | null> = {
    pending: { label: "DÉMARRER", next: "preparing" },
    preparing: { label: "MARQUER PRÊT", next: "ready" },
    ready: { label: "MARQUER SERVI", next: "served" },
    served: null,
  };
  const action = nextAction[order.status];

  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; onDragStart(); }}
      style={{ background: "#FFF", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--color-fire)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", padding: 16, cursor: "grab", animation: pulse ? "kpulse 2s infinite" : undefined }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#111" }}>Table {order.table}</span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, color: timeColor }}>{timeStr}</span>
      </div>
      <div style={{ marginBottom: 8 }}>
        {order.items.map((it, i) => (
          <p key={i} style={{ fontSize: 13, color: "#374151", margin: "2px 0" }}>{it.qty} × {it.name}</p>
        ))}
      </div>
      {order.note && (
        <div style={{ background: "#FFF7ED", borderRadius: "var(--radius-sm)", padding: "6px 10px", marginBottom: 8 }}>
          <p style={{ fontSize: 12, color: "#92400E", fontStyle: "italic", margin: 0 }}>{order.note}</p>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "#111" }}>{formatFCFA(order.total)}</span>
        {action ? (
          <button onClick={() => onMove(order.id, action.next)} className="press" style={{ padding: "8px 16px", background: "var(--color-fire)", color: "#FFF", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", cursor: "pointer", minHeight: 48 }}>{action.label}</button>
        ) : (
          <button onClick={() => onArchive(order.id)} className="press" style={{ padding: "8px 16px", background: "#E5E7EB", color: "#374151", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", cursor: "pointer", minHeight: 48 }}>Archiver</button>
        )}
      </div>
    </div>
  );
}

function NewOrderModal({ onAdd, onClose }: { onAdd: (o: KitchenOrder) => void; onClose: () => void }) {
  const data = getRestaurantData();
  const [table, setTable] = useState("");
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");

  const toggle = (id: string, qty: number) => {
    if (qty <= 0) { const n = { ...selected }; delete n[id]; setSelected(n); }
    else setSelected({ ...selected, [id]: qty });
  };

  const items = Object.entries(selected).map(([id, qty]) => {
    const mi = data.items.find(i => i.id === id)!;
    return { name: mi.name, qty, price: mi.price };
  }).filter(Boolean);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="modal-in" style={{ background: "#FFF", borderRadius: "var(--radius-md)", width: "100%", maxWidth: 560, maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#111", margin: 0 }}>Nouvelle commande</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280" }}><X size={18} /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 4 }}>N° de table</label>
            <input type="number" min={1} value={table} onChange={(e) => setTable(e.target.value)} style={{ width: "100%", height: 44, border: "1px solid #D1D5DB", borderRadius: "var(--radius-sm)", fontSize: 16, padding: "0 12px", outline: "none", boxSizing: "border-box" }} />
          </div>
          {data.categories.map(cat => {
            const catItems = data.items.filter(i => i.category === cat && i.available);
            if (!catItems.length) return null;
            return (
              <div key={cat} style={{ marginBottom: 16 }}>
                <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-fire)", margin: "0 0 8px" }}>{cat}</h4>
                {catItems.map(item => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                    <input type="checkbox" checked={!!selected[item.id]} onChange={(e) => toggle(item.id, e.target.checked ? 1 : 0)} style={{ width: 18, height: 18, accentColor: "var(--color-fire)" }} />
                    <span style={{ flex: 1, fontSize: 14, color: "#111" }}>{item.name}</span>
                    <span style={{ fontSize: 13, color: "#6B7280" }}>{formatFCFA(item.price)}</span>
                    {selected[item.id] && (
                      <input type="number" min={1} value={selected[item.id]} onChange={(e) => toggle(item.id, parseInt(e.target.value) || 0)} style={{ width: 50, height: 32, border: "1px solid #D1D5DB", borderRadius: "var(--radius-sm)", textAlign: "center", fontSize: 14, outline: "none" }} />
                    )}
                  </div>
                ))}
              </div>
            );
          })}
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note pour la cuisine..." style={{ width: "100%", minHeight: 60, border: "1px solid #D1D5DB", borderRadius: "var(--radius-sm)", padding: "10px 12px", fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box", marginTop: 8 }} />
        </div>
        <div style={{ padding: "16px 24px", borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-fire)" }}>{formatFCFA(total)}</span>
          <button
            onClick={() => {
              if (!table || items.length === 0) return;
              onAdd({ id: `ord-${Date.now()}`, table: parseInt(table), items, note, total, status: "pending", createdAt: Date.now() });
            }}
            className="press"
            style={{ padding: "12px 32px", background: "var(--color-fire)", color: "#FFF", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", cursor: "pointer", minHeight: 48 }}
          >Créer la commande</button>
        </div>
      </div>
    </div>
  );
}
