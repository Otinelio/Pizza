import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle, Navigation } from "lucide-react";
import { useState, useEffect } from "react";
import { getRestaurantData } from "@/lib/data";
import Reveal from "@/components/site/Reveal";

export default function ContactPage() {
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
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <section style={{ padding: "clamp(60px, 10vw, 100px) clamp(16px, 4vw, 32px) 60px", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-fire)", marginBottom: 16 }}>Nous contacter</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 8vw, 4.5rem)", color: "var(--color-smoke)", margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em" }}>Contact</h1>
        </Reveal>
      </section>

      <section style={{ padding: "0 clamp(16px, 4vw, 32px) 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          <Reveal>
            <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-md)", padding: 32 }}>
              <MapPin size={20} style={{ color: "var(--color-fire)", marginBottom: 16 }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-smoke)", margin: "0 0 8px" }}>Adresse</h3>
              <p style={{ fontSize: 14, color: "var(--color-cream)", opacity: 0.7, lineHeight: 1.6, margin: 0 }}>{data.address}</p>
            </div>
          </Reveal>
          <Reveal>
            <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-md)", padding: 32 }}>
              <Clock size={20} style={{ color: "var(--color-fire)", marginBottom: 16 }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-smoke)", margin: "0 0 8px" }}>Horaires</h3>
              <p style={{ fontSize: 14, color: "var(--color-cream)", opacity: 0.7, lineHeight: 1.6, margin: 0 }}>{data.hours}</p>
            </div>
          </Reveal>
          <Reveal>
            <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-md)", padding: 32 }}>
              <Phone size={20} style={{ color: "var(--color-fire)", marginBottom: 16 }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-smoke)", margin: "0 0 8px" }}>WhatsApp</h3>
              <a href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, "")}`} style={{ fontSize: 14, color: "var(--color-fire)", textDecoration: "none" }}>{data.whatsapp}</a>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: "0 clamp(16px, 4vw, 32px) 40px", maxWidth: 900, margin: "0 auto", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <a href="https://maps.google.com/?q=Novissi+Lomé+Togo" target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "var(--color-fire)", color: "#0D0D0D", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none", borderRadius: "var(--radius-sm)" }}>
          <Navigation size={16} /> Itinéraire Google Maps
        </a>
        <a href="https://wa.me/22891599999" target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "transparent", color: "var(--color-smoke)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <MessageCircle size={16} /> WhatsApp
        </a>
      </section>

      <section style={{ padding: "0 clamp(16px, 4vw, 32px) 40px", maxWidth: 900, margin: "0 auto", display: "flex", gap: 16, justifyContent: "center" }}>
        <a href={data.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-smoke)", opacity: 0.6 }}><Instagram size={22} /></a>
        <a href={data.facebook} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-smoke)", opacity: 0.6 }}><Facebook size={22} /></a>
      </section>

      <section style={{ padding: "0 clamp(16px, 4vw, 32px) 100px", maxWidth: 900, margin: "0 auto" }}>
        <Reveal>
          <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", height: 350 }}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8!2d1.22!3d6.17!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNovissi%2C+Lom%C3%A9!5e0!3m2!1sfr!2stg!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mr. Pizza Lomé" />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
