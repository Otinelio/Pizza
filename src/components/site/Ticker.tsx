export default function Ticker() {
  const text =
    "TOUJOURS CHAUDE · SANS ADDITIFS · PERSONNALISEZ VOTRE PIZZA · +228 91 59 99 99 · LOMÉ, TOGO · COMMANDEZ SUR WHATSAPP · ";
  const doubled = text + text;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: "32px",
        background: "var(--color-fire)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="marquee-track" style={{ display: "flex", whiteSpace: "nowrap" }}>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#0D0D0D",
            paddingRight: "0px",
          }}
        >
          {doubled}
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#0D0D0D",
            paddingRight: "0px",
          }}
        >
          {doubled}
        </span>
      </div>
    </div>
  );
}
