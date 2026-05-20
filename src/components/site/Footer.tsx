import { Instagram, Facebook } from "lucide-react";
import { useState, useEffect } from "react";
import { getRestaurantData } from "@/lib/data";

export default function Footer() {
  const [data, setData] = useState(getRestaurantData);

  useEffect(() => {
    import("@/lib/data").then(m => {
      m.fetchRestaurantData().then(d => setData(d));
    });
    
    const handler = () => setData(getRestaurantData());
    window.addEventListener("mrpizza_data_changed", handler);
    return () => window.removeEventListener("mrpizza_data_changed", handler);
  }, []);

  return (
    <footer
      style={{
        background: "var(--color-footer)",
        padding: "64px 32px 32px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "48px",
        }}
      >
        {/* Logo + tagline */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "var(--color-smoke)",
              marginBottom: "12px",
            }}
          >
            MR. PIZZA
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              color: "var(--color-cream)",
              opacity: 0.7,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {data.tagline}
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "12px",
              color: "var(--color-fire)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginTop: "16px",
            }}
          >
            Le feu sous la croûte
          </p>
        </div>

        {/* Adresse + horaires */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-smoke)",
              marginBottom: "16px",
              marginTop: 0,
            }}
          >
            Nous trouver
          </h4>
          <p style={{ fontSize: "14px", color: "var(--color-cream)", opacity: 0.7, lineHeight: 1.6, margin: "0 0 8px" }}>
            {data.address}
          </p>
          <p style={{ fontSize: "14px", color: "var(--color-cream)", opacity: 0.7, lineHeight: 1.6, margin: 0 }}>
            {data.hours}
          </p>
        </div>

        {/* Réseaux */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-smoke)",
              marginBottom: "16px",
              marginTop: 0,
            }}
          >
            Réseaux
          </h4>
          <div style={{ display: "flex", gap: "16px" }}>
            <a
              href={data.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-smoke)", opacity: 0.6, transition: "opacity 200ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            >
              <Instagram size={20} />
            </a>
            <a
              href={data.facebook}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-smoke)", opacity: 0.6, transition: "opacity 200ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            >
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "48px",
          paddingTop: "24px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          fontSize: "12px",
          color: "var(--color-smoke)",
          opacity: 0.3,
          fontFamily: "var(--font-body)",
        }}
      >
        © Mr. Pizza Lomé
      </div>
    </footer>
  );
}
