export default function PrimaryButton({ children }) {
  return (
    <div
      style={{
        display: "inline-block",
        background: "#2563eb",
        color: "#ffffff",
        padding: "10px 18px",
        borderRadius: 10,
        fontSize: 16,
        fontWeight: 600,
        textAlign: "center",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
        transition: "background 0.15s ease, transform 0.1s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1d4ed8";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#2563eb";
        e.currentTarget.style.transform = "none";
      }}
    >
      {children}
    </div>
  );
}
