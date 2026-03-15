export default function SwapHistory({ swaps }) {
  return (
    <div>
      <h3>Recent Swaps</h3>
      {swaps.map(s => (
        <div key={s.id}>
          <span>{s.user}</span>
          <span>{s.amountIn} → {s.amountOut}</span>
        </div>
      ))}
    </div>
  );
}
