import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "À propos" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav
      className="hidden md:flex"
      style={{
        position: "sticky",
        top: "32px",
        zIndex: 90,
        background: "var(--color-bg)",
        padding: "20px 32px",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <Link
        to="/"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "1.25rem",
          color: "var(--color-smoke)",
          textDecoration: "none",
          letterSpacing: "-0.02em",
        }}
      >
        MR. PIZZA
      </Link>

      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              textDecoration: "none",
              color: pathname === l.to ? "var(--color-fire)" : "var(--color-smoke)",
              opacity: pathname === l.to ? 1 : 0.7,
              transition: "color 200ms, opacity 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-fire)";
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              if (pathname !== l.to) {
                e.currentTarget.style.color = "var(--color-smoke)";
                e.currentTarget.style.opacity = "0.7";
              }
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <a
        href="https://wa.me/22891599999"
        target="_blank"
        rel="noopener noreferrer"
        className="press"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          background: "var(--color-fire)",
          color: "#0D0D0D",
          padding: "10px 24px",
          borderRadius: "var(--radius-sm)",
          textDecoration: "none",
          transition: "background 200ms",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-fire-dark)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-fire)")}
      >
        Commander
      </a>
    </nav>
  );
}
