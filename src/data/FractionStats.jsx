export default function FractionStats({ fraction }) {
  if (!fraction) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Stat label="Symbol" value={fraction.symbol} />
      <Stat label="Price" value={`$${fraction.price.toFixed(2)}`} />
      <Stat label="Total Supply" value={fraction.totalSupply.toLocaleString()} />
      <Stat label="NAV" value={`$${fraction.nav.toLocaleString()}`} />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="text-sm text-black/60">{label}</div>
      <div className="text-lg font-medium">{value}</div>
    </div>
  );
}
