import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, MessageCircle } from "lucide-react";
import { getRestaurantData, formatFCFA } from "@/lib/data";
import Reveal from "@/components/site/Reveal";

/* ── Letter-drop animation helper ────── */
function AnimatedTitle({ text }: { text: string }) {
  const lines = text.split("\n");
  let globalIdx = 0;

  return (
    <h1
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: "clamp(2.5rem, 9vw, 8rem)",
        lineHeight: 0.95,
        margin: 0,
        color: "var(--color-smoke)",
        textTransform: "uppercase",
        letterSpacing: "-0.03em",
      }}
    >
      {lines.map((line, li) => (
        <span key={li} style={{ display: "block" }}>
          {line.split("").map((ch) => {
            const idx = globalIdx++;
            if (ch === " ") return <span key={idx}>&nbsp;</span>;
            return (
              <span key={idx} className="letter-mask">
                <span className="letter-inner" style={{ animationDelay: `${400 + idx * 60}ms` }}>
                  {ch}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export default function HomePage() {
  const [data, setData] = useState(getRestaurantData);

  useEffect(() => {
    import("@/lib/data").then(m => {
      m.fetchRestaurantData().then(d => setData(d));
    });
    
    const handler = () => setData(getRestaurantData());
    window.addEventListener("mrpizza_data_changed", handler);
    return () => window.removeEventListener("mrpizza_data_changed", handler);
  }, []);

  const signatures = useMemo(() => data.items.filter((i: any) => i.category === "PIZZAS").slice(0, 3), [data]);

  return (
    <div>
      {/* ── HERO ─────────────────────────── */}
      <section
        style={{
          minHeight: "calc(100svh - 140px)",
          padding: "48px 28px",
          display: "grid",
          gridTemplateColumns: "1.1fr minmax(320px, 420px)",
          gridTemplateRows: "auto auto",
          gap: "36px",
          alignItems: "center",
          backgroundImage: "linear-gradient(rgba(13, 13, 13, 0.72), rgba(13, 13, 13, 0.72)), url('/src/lib/images/Pizza.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "0 0 28px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 760, minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.24em", color: "#FFB18C", background: "rgba(255,77,28,0.14)", padding: "10px 18px", borderRadius: 999 }}>
              RAPIDE & SIMPLE
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-cream)", opacity: 0.9 }}>
              Une page claire, un menu rapide et un service qui assure.
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(3rem, 7vw, 5rem)",
              lineHeight: 0.95,
              color: "var(--color-smoke)",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "-0.04em",
            }}
          >
            Pizza rapide.
            <br />
            Choix clair.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 17,
              color: "var(--color-cream)",
              opacity: 0.8,
              maxWidth: 520,
              lineHeight: 1.75,
              marginTop: 24,
              marginBottom: 30,
            }}
          >
            {data.heroMessage}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, width: "100%" }}>
          <div style={{ width: "100%", maxWidth: 420, borderRadius: 28, overflow: "hidden", boxShadow: "0 26px 60px rgba(0,0,0,0.24)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <img
              src="/src/lib/images/Pizza1.jpg"
              alt={signatures[0]?.name || "Pizza"}
              style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover" }}
            />
            <div style={{ padding: 20, background: "rgba(13,13,13,0.9)" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--color-smoke)", margin: 0, textTransform: "uppercase" }}>
                {signatures[0]?.name}
              </p>
              <p style={{ fontSize: 13, color: "var(--color-cream)", opacity: 0.8, margin: "10px 0 0", lineHeight: 1.5 }}>
                {signatures[0]?.description}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14, width: "100%", maxWidth: 420 }}>
            {signatures.slice(1, 3).map((item: any) => (
              <div key={item.id} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 22, padding: 18 }}>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, margin: 0, color: "var(--color-smoke)", textTransform: "uppercase" }}>{item.name}</p>
                <p style={{ fontSize: 12, color: "var(--color-cream)", opacity: 0.78, margin: "8px 0 0", lineHeight: 1.5 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 10 }}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              to="/menu"
              className="press"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 38px",
                background: "var(--color-fire)",
                color: "#0D0D0D",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 14,
                textTransform: "uppercase",
                borderRadius: 999,
                textDecoration: "none",
                transition: "transform 200ms, background 200ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.background = "var(--color-fire-dark)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "var(--color-fire)";
              }}
            >
              Voir le menu
            </Link>
            <a
              href="https://wa.me/22891599999"
              target="_blank"
              rel="noopener noreferrer"
              className="press"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 38px",
                background: "rgba(255,255,255,0.08)",
                color: "var(--color-smoke)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 14,
                textTransform: "uppercase",
                borderRadius: 999,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            >
              Commander WhatsApp
            </a>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <span className="feature-pill">15 min maxi</span>
            <span className="feature-pill">Menu court</span>
            <span className="feature-pill">Fresh local</span>
          </div>
        </div>

        <div style={{ position: "absolute", top: "50%", right: "10%", width: 170, height: 170, borderRadius: "50%", background: "rgba(255,77,28,0.16)", filter: "blur(40px)", transform: "translateY(-50%)" }} />
      </section>

      {/* ── NOS COUPS DE COEUR ──────────── */}
      <section style={{ padding: "80px 28px", maxWidth: 1150, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em", color: "#FFB18C" }}>
              Choix du chef
            </span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", margin: 0, color: "var(--color-smoke)", lineHeight: 1.05 }}>
              Nos coups de cœur de la semaine
            </h2>
            <p style={{ fontSize: 15, color: "var(--color-cream)", opacity: 0.75, maxWidth: 680, lineHeight: 1.7, margin: 0 }}>
              Une sélection courte, claire et gourmande pour te faire gagner du temps et te mettre l’eau à la bouche.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {signatures.map((item: any) => (
            <Reveal key={item.id}>
              <div style={{ background: "var(--color-surface)", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", transition: "transform 200ms" }}>
                <div style={{ height: 200, overflow: "hidden" }}>
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "22px 20px" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, margin: 0, color: "var(--color-smoke)", textTransform: "uppercase" }}>{item.name}</h3>
                  <p style={{ fontSize: 14, color: "var(--color-cream)", opacity: 0.8, margin: "12px 0 16px", lineHeight: 1.6 }}>{item.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--color-fire)", fontSize: 15 }}>{formatFCFA(item.price)}</span>
                    <span style={{ fontSize: 12, color: "var(--color-cream)", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.12em" }}>Pizza star</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── POURQUOI NOUS ─────────────── */}
      <section style={{ padding: "0 28px 80px", maxWidth: 1150, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em", color: "#FFB18C" }}>
              Simple et pertinent
            </span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", margin: "16px 0 20px", color: "var(--color-smoke)", lineHeight: 1.05 }}>
              Pourquoi choisir Mr. Pizza ?
            </h2>
            <p style={{ fontSize: 15, color: "var(--color-cream)", opacity: 0.8, maxWidth: 520, lineHeight: 1.75, marginBottom: 32 }}>
              Rapide, frais, local. On garde une carte courte, des recettes claires et un service qui fait plaisir.
            </p>
            <div style={{ display: "grid", gap: 16 }}>
              {["Cuisine visible", "Ingrédients locaux", "Service rapide"].map((text) => (
                <div key={text} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--color-fire)" }} />
                  <span style={{ color: "var(--color-cream)", opacity: 0.85, fontSize: 15 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 24, padding: 22 }}>
              <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 13, color: "var(--color-fire)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Statut du restaurant</p>
              <p style={{ margin: "12px 0 0", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, color: "var(--color-smoke)" }}>{data.status === "open" ? "OUVERT" : "FERMÉ"}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 24, padding: 22 }}>
              <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 13, color: "var(--color-fire)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Adresse</p>
              <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--color-cream)", opacity: 0.9, lineHeight: 1.7 }}>{data.address}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
