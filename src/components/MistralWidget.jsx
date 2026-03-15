import { useState, useRef, useEffect } from "react";

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;

const SYSTEM_PROMPTS = {
  gallery: "You are an expert fine art analyst and curator for Facades, a blockchain-based fractional art ownership platform. Help users understand artworks, cultural significance, provenance, and value. Be insightful and concise. Keep responses under 150 words.",
  studio: "You are a minting assistant for Facades Studio. Help artists mint NFTs on Ethereum, understand vault creation, ERC-721 standards, IPFS metadata, and studio tiers. Be practical. Keep responses under 150 words.",
  vaults: "You are a cultural asset valuation advisor for Facades. Help users understand fractional vault ownership, FAC tokens, reserve pricing, Swapp AMM, and governance. Never give financial advice. Keep responses under 150 words.",
};

export default function MistralWidget({ context = "gallery" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const placeholders = { gallery: "Ask about this artwork...", studio: "Ask about minting & vaults...", vaults: "Ask about valuation & tokens..." };
  const labels = { gallery: "Art Analyst", studio: "Mint Assistant", vaults: "Vault Advisor" };
  const contexts = { gallery: "artworks & provenance", studio: "minting & vaults", vaults: "vault valuation & tokens" };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${MISTRAL_API_KEY}` },
        body: JSON.stringify({ model: "mistral-small-latest", messages: [{ role: "system", content: SYSTEM_PROMPTS[context] }, ...next] }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || data.error?.message || JSON.stringify(data);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Error connecting to Mistral AI." }]);
    }
    setLoading(false);
  }

  const btnStyle = { position:"fixed", bottom:"2rem", right:"2rem", zIndex:1000, width:"52px", height:"52px", borderRadius:"50%", background:"linear-gradient(135deg,#d4af37,#a07c20)", border:"none", cursor:"pointer", boxShadow:"0 4px 24px rgba(212,175,55,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", color:"#000", fontWeight:"bold", transition:"transform 0.2s" };

  return (
    <>
      <button onClick={() => setOpen(o => !o)} title={"Ask " + labels[context]} style={btnStyle}
        onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
        {open ? "x" : "AI"}
      </button>

      {open && (
        <div style={{ position:"fixed", bottom:"5.5rem", right:"2rem", zIndex:1000, width:"340px", maxHeight:"480px", background:"#0d0d0d", border:"1px solid rgba(212,175,55,0.3)", borderRadius:"1rem", display:"flex", flexDirection:"column", boxShadow:"0 8px 48px rgba(0,0,0,0.6)", fontFamily:"Georgia,serif", overflow:"hidden" }}>
          <div style={{ padding:"0.85rem 1.1rem", borderBottom:"1px solid rgba(212,175,55,0.2)", background:"rgba(212,175,55,0.06)", display:"flex", alignItems:"center", gap:"0.6rem" }}>
            <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#d4af37" }}/>
            <div>
              <div style={{ color:"#d4af37", fontSize:"0.85rem", letterSpacing:"0.05em" }}>Facinations AI</div>
              <div style={{ color:"#666", fontSize:"0.7rem" }}>{labels[context]}</div>
            </div>
            <div style={{ marginLeft:"auto", width:"7px", height:"7px", borderRadius:"50%", background:"#34d399" }}/>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"1rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            {messages.length === 0 && (
              <div style={{ color:"#444", fontSize:"0.8rem", fontStyle:"italic", textAlign:"center", marginTop:"2rem" }}>
                {"Ask anything about " + contexts[context]}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf:m.role==="user"?"flex-end":"flex-start", maxWidth:"85%", background:m.role==="user"?"rgba(212,175,55,0.12)":"rgba(255,255,255,0.04)", border:m.role==="user"?"1px solid rgba(212,175,55,0.3)":"1px solid rgba(255,255,255,0.07)", borderRadius:m.role==="user"?"1rem 1rem 0.25rem 1rem":"1rem 1rem 1rem 0.25rem", padding:"0.6rem 0.85rem", color:m.role==="user"?"#d4af37":"#ccc", fontSize:"0.82rem", lineHeight:1.6 }}>
                {m.content}
              </div>
            ))}
            {loading && <div style={{ alignSelf:"flex-start", color:"#555", fontSize:"0.8rem", fontStyle:"italic" }}>thinking...</div>}
            <div ref={bottomRef}/>
          </div>

          <div style={{ padding:"0.75rem", borderTop:"1px solid rgba(212,175,55,0.15)", display:"flex", gap:"0.5rem" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()} placeholder={placeholders[context]}
              style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(212,175,55,0.2)", borderRadius:"0.5rem", padding:"0.5rem 0.75rem", color:"#ccc", fontSize:"0.8rem", outline:"none", fontFamily:"Georgia,serif" }}/>
            <button onClick={send} disabled={loading || !input.trim()}
              style={{ background:loading||!input.trim()?"rgba(212,175,55,0.2)":"linear-gradient(135deg,#d4af37,#a07c20)", border:"none", borderRadius:"0.5rem", padding:"0.5rem 0.85rem", color:"#000", cursor:loading||!input.trim()?"default":"pointer", fontSize:"0.85rem", fontWeight:"bold" }}>
              &gt;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
