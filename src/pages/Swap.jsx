import { BRAND } from "../brand/brandAssets";
import SwapCard from "../components/SwapCard";
import { useXerSwap } from "../hooks/useXerSwap";

export default function Swap() {
  const {
    fromAmount,
    toAmount,
    onFromChange,
    swapDirection,
  } = useXerSwap();

  return (
    <div className="px-10 py-16 max-w-md mx-auto">
      {/* XER branding ONLY */}
      <div className="flex justify-center mb-8">
        <img
          src={BRAND.XER.SIGIL}
          alt=""
          aria-hidden="true"
          className="h-10"
        />
      </div>

      <h1 className="text-3xl font-bold text-center mb-8">
        Swap
      </h1>

      <div className="space-y-4">
        <SwapCard
          label="From"
          value={fromAmount}
          onChange={onFromChange}
          tokenLabel="XER"
        />

        <div className="flex justify-center">
          <button
            onClick={swapDirection}
            className="px-3 py-1 border rounded-full text-sm"
          >
            ⇅
          </button>
        </div>

        <SwapCard
          label="To"
          value={toAmount}
          tokenLabel="FRACTION"
        />
      </div>

      <button
        disabled
        className="mt-8 w-full py-3 rounded-lg bg-gray-200 text-gray-600 cursor-not-allowed"
      >
        Swap (coming soon)
      </button>
    </div>
  );
}
