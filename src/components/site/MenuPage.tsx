import { useState, useEffect } from "react";
import { Plus, Clock, ChefHat, CheckCircle2, Search, X, Pizza, Coffee, IceCream, Utensils, Sandwich, CupSoda, Beef, Salad, Wine } from "lucide-react";
import { getRestaurantData, formatFCFA, type MenuItem, getOrders, type KitchenOrder } from "@/lib/data";

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("pizza")) return Pizza;
  if (cat.includes("boisson") || cat.includes("drink") || cat.includes("cocktail") || cat.includes("jus")) return CupSoda;
  if (cat.includes("dessert") || cat.includes("glace")) return IceCream;
  if (cat.includes("café") || cat.includes("coffee") || cat.includes("chaud") || cat.includes("thé")) return Coffee;
  if (cat.includes("sandwich") || cat.includes("burger") || cat.includes("panini") || cat.includes("croque")) return Sandwich;
  if (cat.includes("viande") || cat.includes("grill") || cat.includes("poulet")) return Beef;
  if (cat.includes("salade") || cat.includes("entrée") || cat.includes("entree")) return Salad;
  if (cat.includes("vin") || cat.includes("alcool")) return Wine;
  return Utensils;
};
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
  const [data, setData] = useState(getRestaurantData);
  const cart = useCart();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Listen for data changes and fetch initial async
  useEffect(() => {
    // Fetch async from Supabase
    import("@/lib/data").then(m => {
      m.fetchRestaurantData().then(d => setData(d));
    });

    const handler = () => setData(getRestaurantData());
    window.addEventListener("mrpizza_data_changed", handler);
    return () => window.removeEventListener("mrpizza_data_changed", handler);
  }, []);

  const filtered = data.items.filter((i) => 
    (activeCategory === "ALL" || i.category === activeCategory) &&
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (item: MenuItem) => {
    if (!item.available) return;
    cart.add(item);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* Table Modal has been removed */}

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
          Choisissez, on s'occupe du reste.
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
        {/* Order tracking has been removed for display-only scan menu */}
        
        {/* Category Filters & Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 32px" }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              scrollbarWidth: "none",
              flex: 1,
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
          
          <div style={{ display: "flex", alignItems: "center", background: "var(--color-surface)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", width: searchExpanded ? 240 : 44, transition: "width 300ms ease-in-out", flexShrink: 0 }}>
            <button onClick={() => setSearchExpanded(!searchExpanded)} style={{ background: "none", border: "none", color: "var(--color-cream)", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <Search size={18} />
            </button>
            <input 
              type="search" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", height: 44, background: "transparent", border: "none", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none", paddingRight: 12, opacity: searchExpanded ? 1 : 0, transition: "opacity 300ms ease-in-out" }} 
            />
          </div>
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
        {filtered.map((item) => {
          const CategoryIcon = getCategoryIcon(item.category);
          return (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              opacity: item.available ? 1 : 0.5,
              transition: "transform 300ms, box-shadow 300ms",
              position: "relative",
              cursor: "pointer",
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
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="photo"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(255,77,28,0.05) 0%, rgba(0,0,0,0.4) 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.03 }}>
                    <CategoryIcon size={120} color="var(--color-fire)" />
                  </div>
                  <CategoryIcon size={40} style={{ color: "var(--color-fire)", opacity: 0.4, filter: "drop-shadow(0 0 10px rgba(255,77,28,0.2))" }} />
                </div>
              )}
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
                {!scanMode && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {item.supplements && item.supplements.length > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                        className="press"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "8px 12px",
                          background: "rgba(255,77,28,0.1)",
                          color: "var(--color-fire)",
                          border: "1px solid rgba(255,77,28,0.2)",
                          borderRadius: "var(--radius-sm)",
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          cursor: "pointer",
                          transition: "all 200ms",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255,77,28,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255,77,28,0.1)";
                        }}
                      >
                        + Supplément
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAdd(item); }}
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
                )}
              </div>
            </div>
          </div>
        );})}
      </div>

      {/* Item Info Modal */}
      {selectedItem && (() => {
        const cartLinesOfItem = cart.lines.filter(l => l.item.id === selectedItem.id);
        const hasSupplements = selectedItem.supplements && selectedItem.supplements.length > 0;
        const ModalCategoryIcon = getCategoryIcon(selectedItem.category);

        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setSelectedItem(null)}>
            <div className="modal-in" onClick={(e) => e.stopPropagation()} style={{ background: "var(--color-surface)", borderRadius: "var(--radius-md)", width: "100%", maxWidth: 440, overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
              
              {/* Photo Area */}
              <div style={{ position: "relative", height: 200, background: "rgba(255,255,255,0.05)", flexShrink: 0 }}>
                {selectedItem.image ? (
                  <img src={selectedItem.image} alt={selectedItem.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(255,77,28,0.1) 0%, rgba(0,0,0,0.5) 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                     <div style={{ position: "absolute", top: -30, right: -30, opacity: 0.04 }}>
                       <ModalCategoryIcon size={200} color="var(--color-fire)" />
                     </div>
                     <ModalCategoryIcon size={64} style={{ color: "var(--color-fire)", opacity: 0.5, filter: "drop-shadow(0 0 15px rgba(255,77,28,0.3))" }} />
                  </div>
                )}
                <button onClick={() => setSelectedItem(null)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.5)", border: "none", color: "white", width: 32, height: 32, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}><X size={18} /></button>
              </div>

              {/* Content Area */}
              <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
                
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--color-smoke)", margin: 0, textTransform: "uppercase" }}>{selectedItem.name}</h3>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--color-fire)", whiteSpace: "nowrap", marginLeft: 16 }}>{formatFCFA(selectedItem.price)}</span>
                </div>
                
                {/* Description */}
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-cream)", opacity: 0.7, lineHeight: 1.5, margin: "0 0 20px" }}>
                  {selectedItem.description || "Aucune description disponible pour ce produit."}
                </p>

                {/* Section Suppléments si applicable */}
                {hasSupplements && (
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, marginTop: 16 }}>
                    
                    {scanMode ? (
                      <div>
                        <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", color: "var(--color-fire)", margin: "0 0 10px" }}>Suppléments disponibles :</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {selectedItem.supplements?.map((sup) => (
                            <div key={sup.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.05)" }}>
                              <span style={{ fontSize: 13, color: "var(--color-cream)" }}>{sup.name}</span>
                              <span style={{ fontSize: 12, color: "var(--color-fire)", fontWeight: 600 }}>+{formatFCFA(sup.price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : cartLinesOfItem.length === 0 ? (
                      <div>
                        <p style={{ color: "var(--color-cream)", opacity: 0.6, fontSize: 13, lineHeight: 1.5, marginBottom: 16, fontStyle: "italic" }}>
                          💡 Vous devez ajouter ce produit au panier avant de pouvoir lui ajouter des suppléments.
                        </p>
                        <button
                          onClick={() => { handleAdd(selectedItem); }}
                          disabled={!selectedItem.available}
                          className="press"
                          style={{ width: "100%", height: 48, background: selectedItem.available ? "var(--color-fire)" : "rgba(255,255,255,0.1)", color: selectedItem.available ? "#0D0D0D" : "var(--color-smoke)", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", cursor: selectedItem.available ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                        >
                          <Plus size={16} /> {selectedItem.available ? "Ajouter au panier" : "Indisponible actuellement"}
                        </button>

                        <div style={{ marginTop: 20 }}>
                          <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", color: "var(--color-fire)", margin: "0 0 10px" }}>Suppléments disponibles :</h4>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, opacity: 0.5 }}>
                            {selectedItem.supplements?.map((sup) => (
                              <div key={sup.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                <span style={{ fontSize: 13, color: "var(--color-cream)" }}>{sup.name}</span>
                                <span style={{ fontSize: 12, color: "var(--color-fire)", fontWeight: 600 }}>+{formatFCFA(sup.price)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", color: "var(--color-fire)", margin: "0 0 12px" }}>Personnalisez votre commande :</h4>
                        
                        {cartLinesOfItem.map((line, lineIdx) => (
                          <div key={line.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "var(--radius-sm)", padding: 16, marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 8 }}>
                              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--color-smoke)" }}>Option #{lineIdx + 1} {line.qty > 1 ? `(Qté: ${line.qty})` : ""}</span>
                              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--color-fire)" }}>
                                {formatFCFA(
                                  (line.item.price + line.selectedSupplements.reduce((sum, s) => sum + s.price, 0)) * line.qty
                                )}
                              </span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              {selectedItem.supplements?.map((sup) => {
                                const isSelected = line.selectedSupplements.some(s => s.name === sup.name);
                                return (
                                  <div key={sup.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: isSelected ? "rgba(255,77,28,0.05)" : "rgba(0,0,0,0.2)", borderRadius: "var(--radius-sm)", border: isSelected ? "1px solid rgba(255,77,28,0.2)" : "1px solid transparent", transition: "all 200ms" }}>
                                    <div>
                                      <span style={{ fontSize: 13, color: isSelected ? "var(--color-smoke)" : "var(--color-cream)", fontWeight: isSelected ? 600 : 400 }}>{sup.name}</span>
                                      <span style={{ fontSize: 11, color: "var(--color-fire)", marginLeft: 8 }}>+{formatFCFA(sup.price)}</span>
                                    </div>
                                    
                                    {isSelected ? (
                                      <button
                                        onClick={() => {
                                          const updated = line.selectedSupplements.filter(s => s.name !== sup.name);
                                          cart.updateLineSupplements(line.id, updated);
                                        }}
                                        style={{ background: "rgba(239,68,68,0.1)", border: "none", color: "#ef4444", borderRadius: 4, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15, fontWeight: 700 }}
                                      >
                                        -
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          const updated = [...line.selectedSupplements, sup];
                                          cart.updateLineSupplements(line.id, updated);
                                        }}
                                        style={{ background: "rgba(34,197,94,0.1)", border: "none", color: "#22c55e", borderRadius: 4, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15, fontWeight: 700 }}
                                      >
                                        +
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() => { cart.add(selectedItem); }}
                          className="press"
                          style={{ width: "100%", height: 42, background: "transparent", border: "1px dashed rgba(255,77,28,0.3)", borderRadius: "var(--radius-sm)", color: "var(--color-fire)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 }}
                        >
                          <Plus size={14} /> Ajouter une autre instance de ce produit
                        </button>
                      </div>
                    )}

                  </div>
                )}

                {/* Si pas de suppléments configurés, bouton classique d'ajout au panier */}
                {!hasSupplements && !scanMode && (
                  <button
                    onClick={() => { handleAdd(selectedItem); setSelectedItem(null); }}
                    disabled={!selectedItem.available}
                    className="press"
                    style={{ width: "100%", height: 48, background: selectedItem.available ? "var(--color-fire)" : "rgba(255,255,255,0.1)", color: selectedItem.available ? "#0D0D0D" : "var(--color-smoke)", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", cursor: selectedItem.available ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24 }}
                  >
                    <Plus size={18} /> {selectedItem.available ? "Ajouter à ma commande" : "Indisponible actuellement"}
                  </button>
                )}

              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
