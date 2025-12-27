export default function RedeemModal({ open, onClose, instrument, onConfirm, busy }) {
  if (!open || !instrument) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-gray-950 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-semibold text-white">Exchange for XER</div>
            <div className="text-sm text-white/70 mt-2">
              Exchange Instrument #{instrument.tokenId.toString()} for{" "}
              <span className="text-white">{instrument.redemptionAmountFmt} XER</span>.
            </div>
            <div className="text-sm text-white/70 mt-2">
              This action burns the instrument and cannot be undone.
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15"
          >
            Close
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/15"
            disabled={busy}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500"
            disabled={busy}
          >
            {busy ? "Processing..." : "Confirm Exchange"}
          </button>
        </div>
      </div>
    </div>
  );
}
