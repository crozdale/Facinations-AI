import { useState } from "react";
import { ethers } from "ethers";
import { useVaultEvents } from "../hooks/useVaultEvents";
import { useSwapEvents } from "../hooks/useSwapEvents";

export default function VaultActivityFeed({ vault }) {
  const [events, setEvents] = useState([]);

  useVaultEvents(vault.vaultContract, (e) => {
    setEvents(prev => [
      {
        type: "fractionalize",
        user: e.user,
        amount: ethers.formatUnits(e.amount, 18)
      },
      ...prev
    ]);
  });

  useSwapEvents(vault.swapContract, (e) => {
    setEvents(prev => [
      {
        type: "swap",
        user: e.user,
        in: ethers.formatUnits(e.amountIn, 18),
        out: ethers.formatUnits(e.amountOut, 18)
      },
      ...prev
    ]);
  });

  return (
    <section style={{ marginTop: "40px" }}>
      <h3>Live Activity</h3>

      {events.length === 0 && <p>No activity yet.</p>}

      {events.map((e, i) => (
        <div key={i} style={{ fontSize: "0.85rem", marginBottom: "8px" }}>
          {e.type === "fractionalize" && (
            <>
              <strong>{e.user.slice(0, 6)}…</strong>{" "}
              fractionalized{" "}
              <strong>{e.amount}</strong>
            </>
          )}

          {e.type === "swap" && (
            <>
              <strong>{e.user.slice(0, 6)}…</strong>{" "}
              swapped{" "}
              <strong>{e.in}</strong> →{" "}
              <strong>{e.out}</strong>
            </>
          )}
        </div>
      ))}
    </section>
  );
}
