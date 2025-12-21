export default function SwapCard({
  label,
  value,
  onChange,
  tokenLabel,
}) {
  return (
    <div className="border rounded-xl p-5">
      <div className="flex justify-between mb-2 text-sm text-black/60">
        <span>{label}</span>
        <span>{tokenLabel}</span>
      </div>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="0.0"
        className="w-full text-2xl outline-none"
      />
    </div>
  );
}
