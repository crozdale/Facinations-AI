export default function Home() {
  return (
    <section
      style={{
        minHeight: "100vh",
        paddingTop: "120px",
        background: "#000",
        color: "#ffd700",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <img
        src="/facinations-gold.png"
        alt="Facinations Sigil"
        style={{ width: "140px", marginBottom: "32px" }}
      />

      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "64px",
          letterSpacing: "0.06em",
          marginBottom: "24px",
          color: "#f2d88c",
        }}
      >
       
      </h1>

      <p
        style={{
          maxWidth: "900px",
          fontSize: "20px",
          lineHeight: "1.6",
          fontFamily: "'Inter', sans-serif",
          color: "#d8d6d0",
          letterSpacing: "0.03em",
        }}
      >
        This is a curated digital platform for presenting, managing, and
        interacting with high-value or conceptually significant works of art
        that may be tied to on-chain provenance or ownership.
      </p>
    </section>
  );
}
