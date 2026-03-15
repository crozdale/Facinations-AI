import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import MistralWidget from "../components/MistralWidget";
import ABI from "../abi/FacinationsNFT.json";

const CONTRACT = "0x33d1de58274E55B391D8D105A8a9B469AA50157f";
const RPC = "https://ethereum-sepolia.core.chainstack.com/95e64965a9d6491c81dfaa88e63c7980";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400&display=swap');
  .vaults-root { background:#080808; min-height:100vh; font-family:'Cormorant Garamond',Georgia,serif; color:#e8e0d0; }
  .vaults-hero { text-align:center; padding:5rem 2rem 3rem; border-bottom:1px solid rgba(212,175,55,0.08); position:relative; }
  .vaults-hero::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(212,175,55,0.05) 0%,transparent 70%); pointer-events:none; }
  .vaults-eyebrow { font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.35em; text-transform:uppercase; color:#d4af37; margin-bottom:1rem; }
  .vaults-title { font-family:'Cinzel',serif; font-size:clamp(1.8rem,4vw,3rem); font-weight:400; color:#f0e8d0; letter-spacing:0.1em; margin:0; }
  .vaults-div { width:60px; height:1px; background:linear-gradient(to right,transparent,#d4af37,transparent); margin:1.5rem auto 0; }
  .vaults-stats { display:flex; justify-content:center; gap:3rem; padding:2rem; border-bottom:1px solid rgba(212,175,55,0.06); flex-wrap:wrap; }
  .vaults-stat-val { font-family:'Cinzel Decorative',serif; font-size:1.6rem; color:#d4af37; text-align:center; }
  .vaults-stat-label { font-family:'Cinzel',serif; font-size:0.48rem; letter-spacing:0.25em; color:#2a2a2a; text-transform:uppercase; text-align:center; margin-top:0.3rem; }
  .vaults-list { max-width:860px; margin:3rem auto; padding:0 1.5rem; display:flex; flex-direction:column; gap:1px; background:rgba(212,175,55,0.06); border:1px solid rgba(212,175,55,0.06); }
  .vault-row { background:#080808; padding:2rem; display:grid; grid-template-columns:1fr auto; gap:1.5rem; align-items:center; transition:background 0.3s; cursor:pointer; position:relative; }
  .vault-row::before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:#d4af37; transform:scaleY(0); transition:transform 0.3s ease; transform-origin:top; }
  .vault-row:hover { background:rgba(212,175,55,0.03); }
  .vault-row:hover::before { transform:scaleY(1); }
  .vault-id { font-family:'Cinzel Decorative',serif; font-size:1rem; color:#d4af37; letter-spacing:0.1em; margin-bottom:0.4rem; }
  .vault-meta { display:flex; flex-wrap:wrap; gap:1.5rem; margin-top:0.5rem; }
  .vault-meta-item { display:flex; flex-direction:column; gap:0.15rem; }
  .vault-meta-label { font-family:'Cinzel',serif; font-size:0.48rem; letter-spacing:0.25em; color:rgba(212,175,55,0.35); text-transform:uppercase; }
  .vault-meta-value { font-size:0.82rem; color:#8a8278; font-family:monospace; }
  .vault-status { display:inline-flex; align-items:center; gap:0.4rem; font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.2em; text-transform:uppercase; }
  .vault-status-dot { width:5px; height:5px; border-radius:50%; }
  .vault-legal { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.15em; color:#d4af37; text-decoration:none; border:1px solid rgba(212,175,55,0.25); padding:0.35rem 0.8rem; transition:all 0.2s; text-transform:uppercase; white-space:nowrap; }
  .vault-legal:hover { background:rgba(212,175,55,0.1); border-color:#d4af37; }
  .vaults-empty { text-align:center; padding:5rem 2rem; color:#2a2a2a; font-family:'Cinzel',serif; font-size:0.72rem; letter-spacing:0.2em; }
  .vaults-loading { text-align:center; padding:5rem 2rem; color:#3a3228; font-family:'Cinzel',serif; font-size:0.62rem; letter-spacing:0.25em; animation:pulse 1.5s ease-in-out infinite; }
  .vaults-error { text-align:center; padding:3rem 2rem; color:#8b3a3a; font-family:'Cinzel',serif; font-size:0.62rem; letter-spacing:0.2em; }
  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
`;

export default function Vaults() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalMinted, setTotalMinted] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(RPC);
        const contract = new ethers.Contract(CONTRACT, ABI, provider);
        const counter = await contract.tokenCounter();
        const total = Number(counter);
        setTotalMinted(total);
        const items = [];
        for (let i = 0; i < total; i++) {
          try {
            const owner = await contract.ownerOf(i);
            const uri = await contract.tokenURI(i);
            items.push({
              id: String(i),
              vaultId: `VAULT-${String(i).padStart(3, "0")}`,
              tokenId: i,
              contractAddress: CONTRACT,
              owner,
              tokenURI: uri,
              active: true,
            });
          } catch { /* burned token */ }
        }
        setVaults(items);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="vaults-root">
      <style>{css}</style>
      <div className="vaults-hero">
        <div className="vaults-eyebrow">Cultural Vaults · ERC-721</div>
        <h1 className="vaults-title">{t("vaults.title")}</h1>
        <div className="vaults-div" />
      </div>
      <div className="vaults-stats">
        <div>
          <div className="vaults-stat-val">{totalMinted ?? "—"}</div>
          <div className="vaults-stat-label">Total Minted</div>
        </div>
        <div>
          <div className="vaults-stat-val">{vaults.length}</div>
          <div className="vaults-stat-label">Active Vaults</div>
        </div>
        <div>
          <div className="vaults-stat-val">Sepolia</div>
          <div className="vaults-stat-label">Network</div>
        </div>
      </div>
      {loading && <div className="vaults-loading">Loading vaults from chain...</div>}
      {error && <div className="vaults-error">RPC error: {error}</div>}
      {!loading && !error && vaults.length === 0 && (
        <div className="vaults-empty">No vaults minted yet</div>
      )}
      {!loading && vaults.length > 0 && (
        <div className="vaults-list">
          {vaults.map(v => (
            <div key={v.id} className="vault-row" onClick={() => navigate(`/vaults/${v.id}`)}>
              <div>
                <div className="vault-id">{v.vaultId}</div>
                <div className="vault-meta">
                  <div className="vault-meta-item">
                    <span className="vault-meta-label">Token ID</span>
                    <span className="vault-meta-value">#{v.tokenId}</span>
                  </div>
                  <div className="vault-meta-item">
                    <span className="vault-meta-label">Owner</span>
                    <span className="vault-meta-value">{v.owner.slice(0, 6)}...{v.owner.slice(-4)}</span>
                  </div>
                  <div className="vault-meta-item">
                    <span className="vault-meta-label">Token URI</span>
                    <span className="vault-meta-value">{v.tokenURI.slice(0, 28)}...</span>
                  </div>
                  <div className="vault-meta-item">
                    <span className="vault-meta-label">Status</span>
                    <span className="vault-status">
                      <span className="vault-status-dot" style={{ background: "#d4af37" }} />
                      <span style={{ color: "#d4af37" }}>Active</span>
                    </span>
                  </div>
                </div>
              </div>
              <a
                href={`https://sepolia.etherscan.io/token/${CONTRACT}?a=${v.tokenId}`}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
                className="vault-legal"
              >
                Etherscan →
              </a>
            </div>
          ))}
        </div>
      )}
      <MistralWidget context="vaults" />
    </main>
  );
}
