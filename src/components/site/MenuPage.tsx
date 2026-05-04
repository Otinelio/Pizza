import { useState, useEffect } from "react";
import { Plus, Clock, ChefHat, CheckCircle2 } from "lucide-react";
import { getRestaurantData, formatFCFA, type MenuItem, getOrders, type KitchenOrder } from "@/lib/data";
import { useCart } from "@/lib/cart";

interface MenuPageProps {
  scanMode?: boolean;
  initialTable?: number;
}

function OrderStatusTracker() {
  const [order, setOrder] = useState<KitchenOrder | null>(null);

  useEffect(() => {
    const check = () => {
      const id = localStorage.getItem("mrpizza_current_order");
      if (!id) { setOrder(null); return; }
      const o = getOrders().find((x) => x.id === id);
      if (o && o.status !== "served") {
        setOrder(o);
      } else {
        setOrder(null);
        if (o?.status === "served") localStorage.removeItem("mrpizza_current_order");
      }
    };
    check();
    window.addEventListener("mrpizza_order_created", check);
    const iv = setInterval(check, 2000);
    return () => {
      window.removeEventListener("mrpizza_order_created", check);
      clearInterval(iv);
    };
  }, []);

  if (!order) return null;

  const statusConfig = {
    pending: { label: "En attente", color: "#F59E0B", icon: Clock },
    preparing: { label: "En préparation", color: "#3B82F6", icon: ChefHat },
    ready: { label: "Prêt", color: "#10B981", icon: CheckCircle2 },
    served: { label: "Servi", color: "#6B7280", icon: CheckCircle2 },
  };

  const current = statusConfig[order.status];
  const Icon = current.icon;

  return (
    <div
      style={{
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div>
        <p style={{ margin: 0, fontSize: 11, fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-smoke)", opacity: 0.5 }}>Table {order.table}</p>
        <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 500, color: "var(--color-smoke)" }}>Votre commande : <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>{formatFCFA(order.total)}</span></p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--color-bg)", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: `1px solid ${current.color}40` }}>
        <Icon size={16} color={current.color} />
        <span style={{ fontSize: 13, fontWeight: 600, color: current.color }}>{current.label}</span>
      </div>
    </div>
  );
}

export default function MenuPage({ scanMode = false, initialTable }: MenuPageProps) {
  const data = getRestaurantData();
  const cart = useCart();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [tableNumber, setTableNumber] = useState<number | null>(initialTable ?? null);
  const [showTableModal, setShowTableModal] = useState(scanMode && !initialTable);
  const [tableInput, setTableInput] = useState("");

  // Listen for data changes
  const [, setTick] = useState(0);
  useEffect(() => {
    if (initialTable) {
      localStorage.setItem("mrpizza_table", String(initialTable));
    }
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("mrpizza_data_changed", handler);
    return () => window.removeEventListener("mrpizza_data_changed", handler);
  }, [initialTable]);

  const filtered =
    activeCategory === "ALL" ? data.items : data.items.filter((i) => i.category === activeCategory);

  const handleAdd = (item: MenuItem) => {
    if (!item.available) return;
    cart.add(item);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* Table Modal */}
      {showTableModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            className="modal-in"
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-md)",
              padding: "32px",
              width: "100%",
              maxWidth: 360,
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "var(--color-smoke)",
                marginTop: 0,
                marginBottom: 8,
              }}
            >
              Bienvenue !
            </h2>
            <p style={{ fontSize: 14, color: "var(--color-cream)", opacity: 0.7, marginBottom: 24 }}>
              Quel est votre numéro de table ?
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const n = parseInt(tableInput);
                if (n > 0) {
                  setTableNumber(n);
                  localStorage.setItem("mrpizza_table", String(n));
                  setShowTableModal(false);
                }
              }}
            >
              <input
                type="number"
                min={1}
                max={50}
                value={tableInput}
                onChange={(e) => setTableInput(e.target.value)}
                placeholder="N° de table"
                autoFocus
                style={{
                  width: "100%",
                  height: 48,
                  background: "var(--color-bg)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--color-smoke)",
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  textAlign: "center",
                  outline: "none",
                  marginBottom: 16,
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-fire)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button
                type="submit"
                className="press"
                style={{
                  width: "100%",
                  height: 48,
                  background: "var(--color-fire)",
                  color: "#0D0D0D",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                }}
              >
                Valider
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={{ padding: "80px 32px 40px", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            color: "var(--color-smoke)",
            margin: 0,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
          }}
        >
          Notre Menu
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 16,
            color: "var(--color-cream)",
            opacity: 0.6,
            marginTop: 12,
          }}
        >
          {scanMode && tableNumber ? `Table ${tableNumber} — ` : ""}Choisissez, on s'occupe du reste.
        </p>
      </div>

      {/* Sticky Header: Tracker + Categories */}
      <div
        className={scanMode ? "top-[32px]" : "top-[32px] md:top-[92px]"}
        style={{
          position: "sticky",
          zIndex: 40,
          background: "var(--color-bg)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        {scanMode && <OrderStatusTracker />}
        
        {/* Category Filters */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "16px 32px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
        {["ALL", ...data.categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="press"
            style={{
              flexShrink: 0,
              padding: "8px 20px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid",
              borderColor: activeCategory === cat ? "var(--color-fire)" : "rgba(255,255,255,0.1)",
              background: activeCategory === cat ? "var(--color-fire)" : "transparent",
              color: activeCategory === cat ? "#0D0D0D" : "var(--color-smoke)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              cursor: "pointer",
              transition: "all 200ms",
              whiteSpace: "nowrap",
            }}
          >
            {cat === "ALL" ? "Tout" : cat}
          </button>
        ))}
      </div>
      </div>

      {/* Items Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24,
          padding: "0 32px 80px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              opacity: item.available ? 1 : 0.5,
              transition: "transform 300ms, box-shadow 300ms",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (item.available) {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Unavailable badge */}
            {!item.available && (
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  zIndex: 2,
                  background: "rgba(0,0,0,0.7)",
                  color: "var(--color-smoke)",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 10,
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Indisponible
              </div>
            )}

            {/* Photo */}
            <div className="photo-wrap" style={{ height: 180 }}>
              <img
                src={item.image}
                alt={item.name}
                className="photo"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>

            {/* Info */}
            <div style={{ padding: "16px 20px 20px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "var(--color-smoke)",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                {item.name}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--color-cream)",
                  opacity: 0.6,
                  margin: "6px 0 12px",
                  lineHeight: 1.4,
                }}
              >
                {item.description}
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--color-fire)",
                  }}
                >
                  {formatFCFA(item.price)}
                </span>
                <button
                  onClick={() => handleAdd(item)}
                  disabled={!item.available}
                  className="press"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "8px 16px",
                    background: item.available ? "var(--color-fire)" : "rgba(255,255,255,0.1)",
                    color: item.available ? "#0D0D0D" : "var(--color-smoke)",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    cursor: item.available ? "pointer" : "not-allowed",
                    transition: "background 200ms",
                  }}
                  onMouseEnter={(e) => {
                    if (item.available) e.currentTarget.style.background = "var(--color-fire-dark)";
                  }}
                  onMouseLeave={(e) => {
                    if (item.available) e.currentTarget.style.background = "var(--color-fire)";
                  }}
                >
                  <Plus size={14} />
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
