import { useParams } from "react-router-dom";
import { useState } from "react";
import { buyFractions, sellFractions } from "../hooks/useFractionSwap";

export default function Swap() {
  const { vaultId } = useParams();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  async function handleBuy() {
    try {
      setStatus("Approving XER and buying fractions…");
      await buyFractions(vaultId, amount);
      setStatus("Buy complete");
    } catch (e) {
      console.error(e);
      setStatus("Buy failed");
    }
  }

  async function handleSell() {
    try {
      setStatus("Selling fractions…");
      await sellFractions(vaultId, amount);
      setStatus("Sell complete");
    } catch (e) {
      console.error(e);
      setStatus("Sell failed");
    }
  }

  return (
    <div className="max-w-xl mx-auto px-10 py-20 space-y-6">
      <h1 className="text-3xl font-serif">Swap Fractions</h1>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border px-4 py-2"
      />

      <div className="flex gap-4">
        <button
          onClick={handleBuy}
          className="flex-1 border py-2"
        >
          Buy Fractions
        </button>

        <button
          onClick={handleSell}
          className="flex-1 border py-2"
        >
          Sell Fractions
        </button>
      </div>

      {status && <div className="text-sm">{status}</div>}
    </div>
  );
}
