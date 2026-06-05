import Reveal from "@/components/site/Reveal";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <section style={{ padding: "clamp(60px, 10vw, 100px) clamp(16px, 4vw, 32px) 60px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-fire)", marginBottom: 16 }}>Notre histoire</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 8vw, 4.5rem)", color: "var(--color-smoke)", margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1 }}>À propos</h1>
        </Reveal>
      </section>

      <section style={{ padding: "0 clamp(16px, 4vw, 32px) 60px", maxWidth: 700, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 18, color: "var(--color-cream)", opacity: 0.8, lineHeight: 1.8, textAlign: "center", margin: "0 0 32px" }}>
            La première vraie pizzeria populaire du Togo. Cuisine ouverte, ingrédients frais, sans additifs.
          </p>
        </Reveal>
        <Reveal>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-smoke)", opacity: 0.6, lineHeight: 1.8, textAlign: "center" }}>
            Fondée à Lomé, Mr. Pizza est née de la passion pour une cuisine honnête et accessible. Chaque pizza est préparée sous vos yeux, avec des produits frais. Pas de conservateurs — juste le feu sous la croûte.
          </p>
        </Reveal>
      </section>

      <section style={{ padding: "0 clamp(16px, 4vw, 32px) 60px", maxWidth: 900, margin: "0 auto" }}>
        <Reveal>
          <div className="photo-wrap" style={{ borderRadius: "var(--radius-md)", overflow: "hidden", height: "clamp(250px, 40vw, 450px)" }}>
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&h=450&fit=crop" alt="L'équipe Mr. Pizza" className="photo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </Reveal>
      </section>

      <section style={{ padding: "40px clamp(16px, 4vw, 32px) 80px", maxWidth: 1000, margin: "0 auto" }}>
        <Reveal><h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", textTransform: "uppercase", color: "var(--color-smoke)", textAlign: "center", marginTop: 0, marginBottom: 48 }}>Nos valeurs</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          {[
            { title: "Authenticité", desc: "Des recettes pensées à Lomé, pour Lomé." },
            { title: "Qualité", desc: "Ingrédients frais, pâte faite maison chaque jour." },
            { title: "Accessibilité", desc: "Une pizza de qualité ne devrait pas être un luxe." },
          ].map((v) => (
            <Reveal key={v.title}>
              <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-md)", padding: 32, textAlign: "center" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-fire)", margin: "0 0 12px" }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: "var(--color-cream)", opacity: 0.6, lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ padding: "40px clamp(16px, 4vw, 32px) 100px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <blockquote style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.25rem, 3vw, 1.75rem)", color: "var(--color-smoke)", fontStyle: "italic", borderLeft: "3px solid var(--color-fire)", paddingLeft: 24, margin: 0, textAlign: "left", lineHeight: 1.5 }}>
            "Le feu sous la croûte, c'est plus qu'un slogan — c'est une promesse."
          </blockquote>
        </Reveal>
      </section>
    </div>
  );
}
