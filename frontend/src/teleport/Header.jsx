export default function Header({ onNavigate }) {
  return (
    <header>
      <button onClick={() => onNavigate("/")}>Vaults</button>
      <button onClick={() => onNavigate("/governance")}>Governance</button>
    </header>
  );
}
