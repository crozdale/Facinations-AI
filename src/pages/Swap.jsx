export default function Swap() {
  return (
    <div className="swap-card">
      <h1>Swap</h1>

      <label>From</label>
      <input placeholder="0.0" />
      <select>
        <option>ETH</option>
      </select>

      <label>Slippage (%)</label>
      <input defaultValue="0.5" />

      <div className="rate">1 ETH ≈ $2919.42</div>

      <button className="primary">Connect Wallet</button>
    </div>
  );
}
