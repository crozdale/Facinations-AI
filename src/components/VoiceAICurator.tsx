// src/components/VoiceAICurator.tsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  context?: string;
}

async function askClaude(
  systemPrompt: string,
  userMsg: string,
  history: { role: string; content: string }[] = []
): Promise<string> {
  const res = await fetch("/api/claude/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 450,
      system: systemPrompt,
      messages: [...history, { role: "user", content: userMsg }],
    }),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw}`);
  const d = JSON.parse(raw);
  return d.content?.find((b: any) => b.type === "text")?.text ?? "No response.";
}

const css = `
  .voice-btn { display:flex; align-items:center; gap:0.5rem; padding:0.4rem 1rem; border:1px solid rgba(212,175,55,0.4); background:none; color:#d4af37; font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; transition:background 0.2s; }
  .voice-btn:hover, .voice-btn.speaking { background:rgba(212,175,55,0.08); }
  .voice-panel { position:absolute; right:0; top:calc(100% + 0.5rem); width:360px; border:1px solid rgba(212,175,55,0.2); background:#1c1c1c; box-shadow:0 8px 40px rgba(0,0,0,0.8); z-index:50; }
  .voice-panel-header { display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; border-bottom:1px solid rgba(212,175,55,0.1); }
  .voice-panel-title { font-family:'Cinzel',serif; font-size:0.75rem; color:#f8f2e4; letter-spacing:0.12em; }
  .voice-panel-actions { display:flex; align-items:center; gap:0.75rem; }
  .voice-close { background:none; border:none; color:#8a8278; cursor:pointer; font-size:1rem; line-height:1; padding:0; }
  .voice-close:hover { color:#d4af37; }
  .voice-mute { background:none; border:none; color:#8a8278; cursor:pointer; font-size:0.8rem; line-height:1; padding:0; transition:color 0.2s; }
  .voice-mute:hover, .voice-mute.active { color:#d4af37; }
  .voice-status-bar { padding:0.4rem 1rem; background:rgba(212,175,55,0.05); border-bottom:1px solid rgba(212,175,55,0.08); display:flex; align-items:center; gap:0.5rem; }
  .voice-status-dot { width:0.5rem; height:0.5rem; border-radius:50%; background:#d4af37; animation:pulse-dot 0.7s infinite alternate; }
  @keyframes pulse-dot { from { transform:scale(1); opacity:0.7; } to { transform:scale(1.4); opacity:1; } }
  .voice-status-text { font-size:0.72rem; color:#d4af37; font-family:'Cinzel',serif; letter-spacing:0.1em; }
  .voice-unsupported { padding:0.5rem 1rem; background:rgba(220,80,30,0.06); border-bottom:1px solid rgba(220,80,30,0.2); font-family:'Cormorant Garamond',serif; font-size:0.82rem; color:rgba(220,140,80,0.9); font-style:italic; line-height:1.5; }
  .voice-messages { height:256px; overflow-y:auto; padding:0.75rem 1rem; display:flex; flex-direction:column; gap:0.5rem; }
  .voice-msg { max-width:90%; padding:0.5rem 0.75rem; font-size:0.82rem; line-height:1.6; font-family:'Cormorant Garamond',serif; }
  .voice-msg-user { align-self:flex-end; background:rgba(212,175,55,0.12); color:#f2ece0; border:1px solid rgba(212,175,55,0.2); }
  .voice-msg-assistant { align-self:flex-start; background:#242424; color:#b8b0a4; font-style:italic; border:1px solid rgba(212,175,55,0.06); }
  .voice-typing { align-self:flex-start; font-size:0.78rem; color:rgba(212,175,55,0.4); font-style:italic; font-family:'Cormorant Garamond',serif; padding:0.25rem 0; }
  .voice-input-row { display:flex; gap:0.5rem; padding:0.75rem 1rem; border-top:1px solid rgba(212,175,55,0.1); }
  .voice-mic-btn { background:none; border:1px solid rgba(212,175,55,0.2); color:#8a8278; padding:0.4rem 0.6rem; cursor:pointer; font-size:0.9rem; transition:all 0.2s; flex-shrink:0; }
  .voice-mic-btn:hover, .voice-mic-btn.listening { border-color:#d4af37; color:#d4af37; background:rgba(212,175,55,0.08); }
  .voice-input { flex:1; background:#242424; border:1px solid rgba(212,175,55,0.15); color:#f2ece0; font-family:'Cormorant Garamond',serif; font-size:0.85rem; padding:0.4rem 0.6rem; }
  .voice-input:focus { outline:none; border-color:rgba(212,175,55,0.4); }
  .voice-input::placeholder { color:#333; }
  .voice-send { background:#d4af37; border:none; color:#141414; font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.15em; padding:0 0.75rem; cursor:pointer; flex-shrink:0; }
  .voice-send:disabled { background:#333; color:#666; cursor:not-allowed; }
`;

const SYSTEM_PROMPT = `You are SIA — the Synthetic Intelligence Analyst and voice curator at Musée-Crosdale, a luxury fine-art institution built on the Facinations protocol. You have deep expertise in art history, aesthetics, on-chain provenance, fractional ownership, XER token economics, and collector strategy.

Respond as SIA — elegant, precise, slightly poetic. Optimise for voice: short, flowing sentences under 2–3 spoken breaths. Speak as if narrating a private view. Never fabricate auction results or valuations.`;

export default function VoiceAICurator({ context = "" }: Props) {
  const { t } = useTranslation();
  const storageKey = `voice_msgs_${context || "default"}`;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [{ role: "assistant", content: t("sia.greeting") }];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [voiceUnsupported, setVoiceUnsupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(
    typeof window !== "undefined" ? window.speechSynthesis : null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { sessionStorage.setItem(storageKey, JSON.stringify(messages)); } catch {}
  }, [messages, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function speak(text: string) {
    if (muted || !synthRef.current) return;
    synthRef.current.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.pitch = 1.0;
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(
      (v) =>
        v.name.includes("Google UK English Female") ||
        v.name.includes("Samantha") ||
        v.lang === "en-GB"
    );
    if (preferred) utter.voice = preferred;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    synthRef.current.speak(utter);
  }

  function stopSpeaking() {
    synthRef.current?.cancel();
    setSpeaking(false);
  }

  function startListening() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceUnsupported(true);
      return;
    }
    setVoiceUnsupported(false);
    stopSpeaking();
    if (!open) setOpen(true);
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      setTimeout(() => sendMessage(transcript), 100);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setLoading(true);

    const systemPrompt = `${SYSTEM_PROMPT}${context ? `\nContext: ${context}` : ""}`;
    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    try {
      const reply = await askClaude(systemPrompt, msg, history);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      speak(reply);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: t("sia.error") },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{css}</style>

      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          className={`voice-btn${speaking ? " speaking" : ""}`}
          onClick={() => setOpen((o) => !o)}
        >
          {speaking ? "◉" : "✦"} SIA · Curator {open ? "▲" : "▼"}
        </button>

        {open && (
          <div className="voice-panel">
            <div className="voice-panel-header">
              <span className="voice-panel-title">{t("sia.panel_title")}</span>
              <div className="voice-panel-actions">
                <button
                  className={`voice-mute${muted ? " active" : ""}`}
                  onClick={() => { setMuted((m) => !m); if (speaking) stopSpeaking(); }}
                  title={muted ? "Unmute SIA" : "Mute SIA"}
                >
                  {muted ? "🔇" : "🔊"}
                </button>
                <button className="voice-close" onClick={() => setOpen(false)}>×</button>
              </div>
            </div>

            {voiceUnsupported && (
              <div className="voice-unsupported">
                {t("sia.voice_unsupported", "Voice input is not supported in this browser. Use Chrome, Safari, or Edge — or type below.")}
              </div>
            )}

            {(listening || speaking) && (
              <div className="voice-status-bar">
                <div className="voice-status-dot" />
                <span className="voice-status-text">
                  {listening ? t("sia.listening") : t("sia.speaking")}
                </span>
                {speaking && !listening && (
                  <button
                    onClick={stopSpeaking}
                    style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#8a8278", background: "none", border: "none", cursor: "pointer" }}
                  >
                    {t("sia.btn_stop")}
                  </button>
                )}
              </div>
            )}

            <div className="voice-messages">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`voice-msg ${m.role === "user" ? "voice-msg-user" : "voice-msg-assistant"}`}
                >
                  {m.content}
                </div>
              ))}
              {loading && <div className="voice-typing">{t("sia.typing")}</div>}
              <div ref={messagesEndRef} />
            </div>

            <div className="voice-input-row">
              <button
                className={`voice-mic-btn${listening ? " listening" : ""}`}
                onClick={listening ? stopListening : startListening}
                title={listening ? "Stop listening" : "Speak to SIA"}
              >
                {listening ? "✕" : "🎙"}
              </button>
              <input
                className="voice-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={t("sia.placeholder")}
              />
              <button
                className="voice-send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
              >
                {t("sia.btn_send")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
