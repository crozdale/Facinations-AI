import { CHAINS } from "../chains/chains";
import { useChain } from "../hooks/useChain";

export default function ChainGuard({ children }) {
  const chainId = useChain();

  if (!chainId) return null;

  if (!CHAINS[chainId]) {
    return (
      <main className="app-main">
        <h2>Unsupported Network</h2>
        <p>Please switch to a supported chain.</p>
      </main>
    );
  }

  return children;
}
