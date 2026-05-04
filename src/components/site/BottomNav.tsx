import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, Info, MapPin } from "lucide-react";

const items = [
  { to: "/", icon: Home, label: "Accueil" },
  { to: "/menu", icon: UtensilsCrossed, label: "Menu" },
  { to: "/about", icon: Info, label: "À propos" },
  { to: "/contact", icon: MapPin, label: "Contact" },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="flex md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 80,
        height: "56px",
        background: "var(--color-bg)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {items.map((it) => {
        const active = pathname === it.to;
        return (
          <Link
            key={it.to}
            to={it.to}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              textDecoration: "none",
              color: active ? "var(--color-fire)" : "var(--color-smoke)",
              opacity: active ? 1 : 0.4,
              transition: "opacity 200ms, color 200ms",
            }}
          >
            <it.icon size={20} strokeWidth={2} />
            <span
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontFamily: "var(--font-body)",
              }}
            >
              {it.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
