export default function RAIInstrumentCard({ instrument, onRedeemClick }) {
  const { tokenId, owner, redemptionAmountFmt, redeemed } = instrument;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-white">Instrument #{tokenId.toString()}</div>
          <div className="text-sm text-white/70 mt-1">
            Fixed exchange: <span className="text-white">{redemptionAmountFmt} XER</span>
          </div>
          <div className="text-xs text-white/50 mt-1 break-all">
            Owner: {owner ?? "(burned / redeemed)"}
          </div>
        </div>

        <div className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/80">
          {redeemed ? "Redeemed" : "Active"}
        </div>
      </div>

      <div className="mt-4">
        <button
          disabled={redeemed}
          onClick={() => onRedeemClick(instrument)}
          className={[
            "w-full px-4 py-3 rounded-xl font-semibold",
            redeemed
              ? "bg-white/10 text-white/50 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-500",
          ].join(" ")}
        >
          Exchange for XER
        </button>
      </div>
    </div>
  );
}
