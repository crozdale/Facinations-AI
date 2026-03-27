import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useWallet } from "../hooks/useWallet";
import { useSwapContract } from "../hooks/useSwapContract";
import { useSlippage } from "../hooks/useSlippage";
import SlippageControl from "./SlippageControl";
import { ethers } from "ethers";

export default function VaultSwap({ vault }) {
  const { t } = useTranslation();
  const { signer, address, connect } = useWallet();
  const swap = useSwapContract(vault.swapContract, signer);
  const { slippagePct, setSlippagePct, computeMinOut } = useSlippage(0.5);

  const [amountIn, setAmountIn] = useState("");
  const [quote, setQuote] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function fetchQuote() {
      if (!swap || !amountIn) {
        setQuote(null);
        return;
      }

      try {
        const out = await swap.getQuote(
          ethers.parseUnits(amountIn, 18)
        );
        setQuote(out);
      } catch {
        setQuote(null);
      }
    }

    fetchQuote();
  }, [amountIn, swap]);

  async function executeSwap() {
    if (!swap || !quote) return;

    try {
      const minOut = computeMinOut(
        Number(ethers.formatUnits(quote, 18))
      );

      if (!minOut || minOut <= 0) {
        setStatus(t("swap.invalid_slippage", "Invalid slippage configuration"));
        return;
      }

      setStatus(t("swap.submitting", "Submitting swap…"));

      const tx = await swap.swap(
        ethers.parseUnits(amountIn, 18),
        ethers.parseUnits(minOut.toString(), 18)
      );

      await tx.wait();
      setStatus(t("swap.complete", "Swap complete"));
    } catch {
      setStatus(t("swap.reverted", "Swap reverted (slippage exceeded)"));
    }
  }

  if (!address) {
    return <button onClick={connect}>{t("wallet.connect", "Connect Wallet")}</button>;
  }

  return (
    <section style={{ marginTop: "40px" }}>
      <h3>{t("swap.swap_fractions", "Swap Fractions")}</h3>

      <input
        type="number"
        placeholder={t("swap.amount_in_placeholder", "Amount in")}
        value={amountIn}
        onChange={e => setAmountIn(e.target.value)}
      />

      {quote && (
        <p>
          {t("swap.quote_label", "Quote:")}{"  "}
          <strong>
            {ethers.formatUnits(quote, 18)}
          </strong>
        </p>
      )}

      <SlippageControl
        value={slippagePct}
        onChange={setSlippagePct}
      />

      <button
        onClick={executeSwap}
        disabled={!amountIn || !quote}
      >
        Swap
      </button>

      {status && <p>{status}</p>}
    </section>
  );
}
