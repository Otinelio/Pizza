import { useEffect, useState } from "react";
import { ShoppingCart, X, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatFCFA } from "@/lib/data";

/* ── Floating Action Button ─────────────── */
export function CartFab() {
  const { count, setOpen } = useCart();
  const [popKey, setPopKey] = useState(0);

  useEffect(() => {
    if (count > 0) setPopKey((k) => k + 1);
  }, [count]);

  if (count === 0) return null;

  return (
    <button
      onClick={() => setOpen(true)}
      className="press"
      style={{
        position: "fixed",
        zIndex: 70,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "var(--color-fire)",
        color: "#0D0D0D",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 24px rgba(255,77,28,0.35)",
        right: "16px",
        bottom: "72px",
      }}
      id="cart-fab"
    >
      <style>{`
        @media (min-width: 768px) {
          #cart-fab { right: 24px !important; bottom: 24px !important; }
        }
      `}</style>
      <ShoppingCart size={24} />
      <span
        key={popKey}
        className="badge-pop"
        style={{
          position: "absolute",
          top: -4,
          right: -4,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "var(--color-cream)",
          color: "#0D0D0D",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "11px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {count}
      </span>
    </button>
  );
}

import { useSearchParams } from "react-router-dom";

/* ── Cart Drawer ────────────────────────── */
export function CartDrawer() {
  const { lines, count, total, inc, dec, remove, clear, open, setOpen, note, setNote } = useCart();
  const [isMobile, setIsMobile] = useState(false);
  const [params] = useSearchParams();
  const tableParam = params.get("table");
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  
  // also check local storage if MenuPage saved it
  const storedTable = localStorage.getItem("mrpizza_table");
  const tableNumber = tableParam ? parseInt(tableParam) : (storedTable ? parseInt(storedTable) : undefined);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const sendOrder = async () => {
    let msg = "";
    if (tableNumber) {
      const { getOrders, saveOrders } = await import("@/lib/data");
      const orderId = `ord-${Date.now()}`;
      const newOrder = {
        id: orderId,
        table: tableNumber,
        items: lines.map((l) => {
          const sups = l.selectedSupplements && l.selectedSupplements.length > 0
            ? ` (${l.selectedSupplements.map(s => s.name).join(", ")})`
            : "";
          const supsTotal = l.selectedSupplements?.reduce((sum, s) => sum + s.price, 0) || 0;
          return {
            name: `${l.item.name}${sups}`,
            qty: l.qty,
            price: l.item.price + supsTotal
          };
        }),
        note: note.trim(),
        total,
        status: "pending" as const,
        createdAt: Date.now(),
      };
      saveOrders([...getOrders(), newOrder]);
      localStorage.setItem("mrpizza_current_order", orderId);
      window.dispatchEvent(new Event("mrpizza_order_created"));
      clear();
      setOpen(false);
      return;
    } else {
      msg += "Bonjour Mr. Pizza Lomé !\n\nNOUVELLE COMMANDE :\n";
      msg += `Type : ${deliveryMethod === "pickup" ? "À emporter (Retrait sur place)" : "Livraison"}\n`;
      if (deliveryMethod === "delivery") {
        if (!deliveryAddress.trim()) {
          alert("Veuillez indiquer une adresse de livraison.");
          return;
        }
        msg += `Adresse : ${deliveryAddress.trim()}\n`;
      }
      msg += "\n";
    }
    lines.forEach((l) => {
      const sups = l.selectedSupplements && l.selectedSupplements.length > 0
        ? ` (${l.selectedSupplements.map(s => s.name).join(", ")})`
        : "";
      const supsTotal = l.selectedSupplements?.reduce((sum, s) => sum + s.price, 0) || 0;
      const lineSinglePrice = l.item.price + supsTotal;
      msg += `${l.item.name}${sups} x${l.qty} — ${formatFCFA(lineSinglePrice * l.qty)}\n`;
    });
    msg += `\nTOTAL : ${formatFCFA(total)}`;
    msg += `\nNote : ${note.trim() || "Aucune note"}`;

    window.open(`https://wa.me/22891599999?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Drawer */}
      <div
        className={isMobile ? "drawer-bottom" : "drawer-right"}
        style={{
          position: "fixed",
          zIndex: 201,
          background: "var(--color-bg)",
          display: "flex",
          flexDirection: "column",
          ...(isMobile
            ? { bottom: 0, left: 0, right: 0, height: "90vh", borderTopLeftRadius: 12, borderTopRightRadius: 12 }
            : { top: 0, right: 0, bottom: 0, width: 400 }),
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.25rem",
              margin: 0,
              color: "var(--color-smoke)",
            }}
          >
            Mon panier
          </h2>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-smoke)",
              cursor: "pointer",
              padding: 8,
              opacity: 0.6,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {count === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 16,
              }}
            >
              <ShoppingCart size={48} style={{ color: "var(--color-cream)", opacity: 0.15 }} />
              <p style={{ color: "var(--color-cream)", opacity: 0.5, fontSize: 14, margin: 0 }}>
                Votre panier est vide.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {lines.map((l) => {
                const supsTotal = l.selectedSupplements?.reduce((sum, s) => sum + s.price, 0) || 0;
                const linePrice = (l.item.price + supsTotal) * l.qty;

                return (
                  <div
                    key={l.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          fontSize: 14,
                          color: "var(--color-smoke)",
                        }}
                      >
                        {l.item.name}
                      </div>
                      {l.selectedSupplements && l.selectedSupplements.length > 0 && (
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-cream)", opacity: 0.6, marginTop: 2, fontStyle: "italic" }}>
                          + {l.selectedSupplements.map(s => s.name).join(", ")}
                        </div>
                      )}
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--color-fire)", marginTop: 4 }}>
                        {formatFCFA(linePrice)}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={() => dec(l.id)}
                        className="press"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          background: "transparent",
                          color: "var(--color-smoke)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 14,
                          minWidth: 20,
                          textAlign: "center",
                          color: "var(--color-smoke)",
                        }}
                      >
                        {l.qty}
                      </span>
                      <button
                        onClick={() => inc(l.id)}
                        className="press"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          background: "transparent",
                          color: "var(--color-smoke)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => remove(l.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-smoke)",
                        opacity: 0.3,
                        cursor: "pointer",
                        padding: 4,
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}

              {/* Note */}
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note pour la cuisine..."
                style={{
                  width: "100%",
                  minHeight: 60,
                  background: "var(--color-surface)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--color-smoke)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  padding: "10px 12px",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-fire)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />

              {!tableNumber && (
                <div style={{ background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.05)", marginTop: 16 }}>
                  <h4 style={{ margin: "0 0 12px", fontFamily: "var(--font-display)", fontSize: 13, color: "var(--color-smoke)", textTransform: "uppercase" }}>Option de commande</h4>
                  <div style={{ display: "flex", gap: 8, marginBottom: deliveryMethod === "delivery" ? 12 : 0 }}>
                    <button
                      onClick={() => setDeliveryMethod("pickup")}
                      style={{ flex: 1, padding: "10px", background: deliveryMethod === "pickup" ? "rgba(255,77,28,0.1)" : "transparent", border: deliveryMethod === "pickup" ? "1px solid var(--color-fire)" : "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: deliveryMethod === "pickup" ? "var(--color-fire)" : "var(--color-cream)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 200ms" }}
                    >
                      À emporter
                    </button>
                    <button
                      onClick={() => setDeliveryMethod("delivery")}
                      style={{ flex: 1, padding: "10px", background: deliveryMethod === "delivery" ? "rgba(255,77,28,0.1)" : "transparent", border: deliveryMethod === "delivery" ? "1px solid var(--color-fire)" : "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", color: deliveryMethod === "delivery" ? "var(--color-fire)" : "var(--color-cream)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 200ms" }}
                    >
                      Livraison
                    </button>
                  </div>
                  
                  {deliveryMethod === "delivery" && (
                    <input
                      type="text"
                      placeholder="Adresse complète (Quartier, rue...)"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      style={{ width: "100%", padding: "12px", background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--radius-sm)", color: "var(--color-smoke)", fontFamily: "var(--font-body)", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-fire)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {count > 0 && (
          <div
            style={{
              padding: "16px 24px 24px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-cream)", opacity: 0.7 }}>
                Sous-total
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-smoke)" }}>
                {formatFCFA(total)}
              </span>
            </div>

            <button
              onClick={sendOrder}
              className="press"
              style={{
                width: "100%",
                height: 56,
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 200ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-fire-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-fire)")}
            >
              <MessageCircle size={18} />
              Envoyer ma commande
            </button>

            <button
              onClick={clear}
              style={{
                width: "100%",
                height: 40,
                background: "transparent",
                color: "var(--color-smoke)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                opacity: 0.6,
                transition: "opacity 200ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </>
  );
}
