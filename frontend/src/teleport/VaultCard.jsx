export default function VaultCard({
  title,
  premiumRequired,
  onClick
}) {
  return (
    <div className="vault-card" onClick={onClick}>
      <h3>{title}</h3>
      {premiumRequired && <span>Premium</span>}
    </div>
  );
}
