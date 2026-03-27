import { useTranslation } from "react-i18next";
import UpgradeCTA from "./UpgradeCTA";
import { getPremiumPending } from "../utils/premiumStatus";

/**
 * @param {boolean} isPremium - resolved from subgraph
 * @param {ReactNode} children - premium content
 */
export default function PremiumGate({ isPremium, children }) {
  const { t } = useTranslation();
  const pending = getPremiumPending();

  // 1. Paid, waiting for subgraph
  if (!isPremium && pending) {
    return (
      <div style={{ padding: "2rem", opacity: 0.8 }}>
        <h2>{t("premium.activating", "Activating Premium…")}</h2>
        <p>{t("premium.tx_confirmed", "Your transaction is confirmed.")}</p>
        <p>{t("premium.indexing", "Waiting for on-chain indexing.")}</p>
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
