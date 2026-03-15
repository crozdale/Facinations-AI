export default function SlippageControl({ value, onChange }) {
  return (
    <div style={{ marginTop: "12px" }}>
      <label style={{ fontSize: "0.85rem" }}>
        Slippage Tolerance (%)
      </label>

      <input
        type="number"
        min="0"
        step="0.1"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ marginLeft: "10px", width: "80px" }}
      />
    </div>
  );
}
