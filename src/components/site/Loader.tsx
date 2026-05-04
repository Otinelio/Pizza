import { useEffect, useState } from "react";

export default function Loader() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("mrpizza_loader_shown")) return;
    setShown(true);
    sessionStorage.setItem("mrpizza_loader_shown", "1");
  }, []);

  if (!shown) return null;

  return (
    <div
      className="loader-screen"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0D0D0D",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      <span
        className="loader-mr"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(4rem, 12vw, 10rem)",
          color: "var(--color-smoke)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        MR.
      </span>
      <span
        className="loader-pizza"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(4rem, 12vw, 10rem)",
          color: "var(--color-fire)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        PIZZA
      </span>
      <div
        className="loader-line"
        style={{
          width: "120px",
          height: "3px",
          background: "var(--color-fire)",
          marginTop: "24px",
          borderRadius: "2px",
        }}
      />
    </div>
  );
}
