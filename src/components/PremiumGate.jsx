import UpgradeCTA from "./UpgradeCTA";
import { getPremiumPending } from "../utils/premiumStatus";

/**
 * @param {boolean} isPremium - resolved from subgraph
 * @param {ReactNode} children - premium content
 */
export default function PremiumGate({ isPremium, children }) {
  const pending = getPremiumPending();

  // 1. Paid, waiting for subgraph
  if (!isPremium && pending) {
    return (
      <div style={{ padding: "2rem", opacity: 0.8 }}>
        <h2>Activating Premium…</h2>
        <p>Your transaction is confirmed.</p>
        <p>Waiting for on-chain indexing.</p>
      </div>
    );
  }

  // 2. Not premium at all
  if (!isPremium) {
    return <UpgradeCTA />;
  }

  // 3. Premium confirmed
  return <>{children}</>;
}
