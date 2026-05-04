import { useMemo } from "react";
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
  const data = getRestaurantData();
  const signatures = useMemo(() => data.items.filter((i) => i.category === "PIZZAS").slice(0, 3), [data]);

  return (
    <div>
      {/* ── HERO ─────────────────────────── */}
      <section
        style={{
          minHeight: "calc(100svh - 150px)",
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          backgroundImage: "linear-gradient(rgba(13, 13, 13, 0.6), rgba(13, 13, 13, 0.95)), url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "0 0 24px 24px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--color-cream)",
            marginBottom: 16,
            opacity: 0.8,
          }}
        >
          LOMÉ A FAIM.
        </p>

        <AnimatedTitle text={"LE FEU\nSOUS LA\nCROÛTE."} />

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 16,
            color: "var(--color-cream)",
            opacity: 0.6,
            maxWidth: 420,
            lineHeight: 1.6,
            marginTop: 16,
            marginBottom: 24,
          }}
        >
          {data.heroMessage}
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            to="/menu"
            className="press"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              background: "var(--color-fire)",
              color: "#0D0D0D",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              textDecoration: "none",
              borderRadius: "var(--radius-sm)",
              transition: "background 200ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-fire-dark)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-fire)")}
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
              gap: 8,
              padding: "14px 32px",
              background: "transparent",
              color: "var(--color-smoke)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              textDecoration: "none",
              borderRadius: "var(--radius-sm)",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "border-color 200ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-fire)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
          >
            <MessageCircle size={16} />
            Commander WhatsApp
          </a>
        </div>

        {/* Scroll arrow */}
        <div
          className="arrow-bob"
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            color: "var(--color-smoke)",
            opacity: 0.3,
          }}
        >
          <ArrowDown size={24} />
        </div>
      </section>

      {/* ── NOS SIGNATURES ──────────────── */}
      <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "var(--color-smoke)",
              marginTop: 0,
              marginBottom: 48,
            }}
          >
            Nos signatures
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {signatures.map((item, i) => (
            <Reveal key={item.id}>
              <div
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  transition: "transform 300ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div className="photo-wrap" style={{ height: 220 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="photo"
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <div style={{ padding: "20px 24px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "var(--color-smoke)",
                      margin: 0,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--color-cream)",
                      opacity: 0.6,
                      margin: "8px 0 12px",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.description}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "var(--color-fire)",
                      fontSize: 15,
                    }}
                  >
                    {formatFCFA(item.price)}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ───────────── */}
      <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "var(--color-smoke)",
              marginTop: 0,
              marginBottom: 48,
            }}
          >
            Comment ça marche
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 32,
          }}
        >
          {[
            { step: "01", title: "Choisir", desc: "Parcourez notre menu et choisissez vos plats préférés." },
            { step: "02", title: "WhatsApp", desc: "Envoyez votre commande en un clic via WhatsApp." },
            { step: "03", title: "Récupérer / Livré", desc: "Récupérez sur place ou faites-vous livrer." },
          ].map((s) => (
            <Reveal key={s.step}>
              <div
                style={{
                  padding: 32,
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-md)",
                  borderLeft: "3px solid var(--color-fire)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "2.5rem",
                    color: "var(--color-fire)",
                    opacity: 0.3,
                    lineHeight: 1,
                  }}
                >
                  {s.step}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "var(--color-smoke)",
                    textTransform: "uppercase",
                    margin: "16px 0 8px",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--color-cream)", opacity: 0.6, margin: 0, lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── POURQUOI MR. PIZZA ──────────── */}
      <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "var(--color-smoke)",
              marginTop: 0,
              marginBottom: 48,
            }}
          >
            Pourquoi Mr. Pizza
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          {[
            { title: "Sans additifs", desc: "Aucun conservateur, aucun colorant. Que du goût." },
            { title: "Ingrédients frais", desc: "Approvisionnement local et produits de qualité." },
            { title: "Cuisine ouverte", desc: "Voyez vos plats préparés sous vos yeux." },
          ].map((v) => (
            <Reveal key={v.title}>
              <div
                style={{
                  padding: 32,
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-md)",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--color-fire)",
                    textTransform: "uppercase",
                    margin: "0 0 12px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--color-cream)", opacity: 0.6, margin: 0, lineHeight: 1.6 }}>
                  {v.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────── */}
      <Reveal>
        <section
          style={{
            padding: "80px 32px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              textTransform: "uppercase",
              color: "var(--color-smoke)",
              marginTop: 0,
              marginBottom: 24,
            }}
          >
            Prêt à goûter le feu ?
          </h2>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/menu"
              className="press"
              style={{
                padding: "16px 40px",
                background: "var(--color-fire)",
                color: "#0D0D0D",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 14,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
                borderRadius: "var(--radius-sm)",
                transition: "background 200ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-fire-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-fire)")}
            >
              Voir le menu
            </Link>
            <a
              href="https://wa.me/22891599999"
              target="_blank"
              rel="noopener noreferrer"
              className="press"
              style={{
                padding: "16px 40px",
                background: "transparent",
                color: "var(--color-smoke)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 14,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
                borderRadius: "var(--radius-sm)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Commander
            </a>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
