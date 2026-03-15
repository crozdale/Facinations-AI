import PremiumUnlock from "./PremiumUnlock";

export default function PremiumGate({ allowed, children }) {
  if (!allowed) {
    return <PremiumUnlock />;
  }
  return children;
}
