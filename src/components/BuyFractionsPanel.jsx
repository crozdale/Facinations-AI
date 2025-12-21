export default function BuyFractionsPanel() {
  return (
    <div className="border rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4">Buy Fractions</h3>

      <input
        disabled
        placeholder="Amount"
        className="w-full border rounded p-3 mb-4 bg-gray-100 cursor-not-allowed"
      />

      <button
        disabled
        className="w-full py-3 rounded bg-gray-200 text-gray-600 cursor-not-allowed"
      >
        Buy (coming soon)
      </button>

      <p className="text-sm text-black/60 mt-3">
        Fraction purchases activate once the vault is live on-chain.
      </p>
    </div>
  );
}
