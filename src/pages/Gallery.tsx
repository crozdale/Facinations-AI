import { useState, useEffect, useRef, useCallback } from "react";
import MistralWidget from "../components/MistralWidget";
import VoiceAICurator from "../components/VoiceAICurator";
import { useTranslation } from "react-i18next";
import { useMeta } from "../hooks/useMeta";
import { TeleportViewer } from "../components/teleport";

// -- VideoHero: tries mp4, falls back to a still image -------------------------
function VideoHero() {
  const [useFallback, setUseFallback] = useState(false);
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {useFallback ? (
        <img
          src="/images/Aurora.jpg"
          alt="Musée Crosdale"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
          onError={() => setUseFallback(true)}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}

// ------------------------- Image list -------------------------
const images = [
  "Abiaat.jpg","Angie-eye-_2023-01-11_17-29-08.jpg",
  "ARANCAME La VIDA-438093283_418377434483858_7953622244752444593_n.jpg",
  "Artist at work.jpg","Aurora.jpg",
  "Batty...481048416_10161569153917832_1809675633070816588_n.jpg",
  "BlackSwan...480756081_10161527251927832_7433280069563726588_n.jpg",
  "BLEAK-478920361_521121674333062_5337570630308014315_n.jpg",
  "BROTHER-in-LAW-438726226_418383784483223_782118711046810352_n.jpg",
  "CARO-439849863_418384127816522_612039854409452289_n.jpg",
  "CATBIRD SEAT-438162421_418376091150659_5909606873923684661_n.jpg",
  "Citroen.jpg","DAHli 1.jpg",
  "Derain-1-481045054_602919659303415_808298346858153755_n.jpg",
  "Derain-2-481077855_602919525970095_4568044901137127981_n.jpg",
  "Derain-3-480978451_602919845970063_3727040383585397217_n.jpg",
  "Derain-4-481900379_602919839303397_7203627158142952419_n.jpg",
  "Derain-6-481141813_602919865970061_5242746230744260178_n.jpg",
  "Derain-7-481050647_602919672636747_5184186138767498324_n.jpg",
  "Derain-8-481047819_602919835970064_3365815868378120193_n.jpg",
  "Dreamers.jpg","Duke of Guile.jpg",
  "EARTHLING-482267565_655514764103456_7642671013264123749_n.jpg",
  "ESTUARY-484093766_656745863980346_1712517066157130287_n.jpg",
  "FAGUS SILVATICA-482023995_655514407436825_7509779769599567628_n.jpg",
  "FAGUS SYLVATICA FLIP-480988554_641327592188840_5312420776247969695_n.jpg",
  "Fall Farewell.jpg",
  "FINGERS&TOES-484364399_659736517014614_2259291031623865068_n.jpg",
  "GOD SAVE BREXIT-438701178_418376737817261_8814746502412978905_n.jpg",
  "GOLFER-438098159_418381417816793_970923211456752752_n.jpg",
  "I.C.U-480991859_646504751671124_2643945034916005490_n.jpg",
  "Illegals-492095206_642500178678696_2534838601895814256_n.jpg",
  "INCUBUS-438799596_418376397817295_4958381452530676977_n.jpg",
  "Joshua 1-481078278_602919872636727_1008817184452563158_n.jpg",
  "KISS MI NECK-438814465_418377844483817_495188170270863057_n.jpg",
  "Klimt-1-481077338_602919612636753_2610112347362918058_n.jpg",
  "La Poseur.jpg","Les Sabreurs.jpg",
  "LOLA-438163439_418378554483746_8339595254062949200_n.jpg",
  "Manual...480874173_10161569151837832_8483766287309987814_n.jpg",
  "Matisse 5=481074455_602919572636757_9182884759071060286_n.jpg",
  "Matisse 6-480682704_602919825970065_8980030504421660881_n.jpg",
  "Matisse-10-481025123_602919412636773_8368894686202353071_n.jpg",
  "Matisse-11-481713502_602919415970106_4100954604850614834_n.jpg",
  "Matisse-12-481073927_602919425970105_7791321007394243476_n.jpg",
  "Matisse-13-480973330_602919429303438_8636849054986_n.jpg",
  "Matisse-480809526_602919522636762_8309883892474452539_n.jpg",
  "Matisse-8-481692945_602919679303413_1631226915702844752_n.jpg",
  "Matisse-9-481055942_602919422636772_3173064776944603159_n.jpg",
  "Matisse2-481077280_602919675970080_3546861560809530360_n.jpg",
  "Matisse3.jpg",
  "Medieval-1-482217629_602919819303399_7589644914636151308_n.jpg",
  "Medieval-2-480587568_602919605970087_3576950377889298214_n.jpg",
  "Medieval-3-480973330_602919595970088_8891979296672574797_n.jpg",
  "Medieval-4-480957623_602919579303423_7958542928222725468_n.jpg",
  "MILLENNIALS-483507251_655514630770136_6062852906407374833_n.jpg",
  "Monticello.jpg",
  "N-TANGLE-438745536_418377207817214_3842807292647448955_n.jpg",
  "O'KEEFE-_2023-01-11_17-29-14.jpg","Pale.jpg",
  "photo_2023-01-11_17-28-51.jpg",
  "Picasso-1-481793325_602919435970104_744441579574873157_n.jpg",
  "Reach...277104797_10159207523262832_2255265247780080387_n.jpg",
  "Renaissance-1-480748878_602919625970085_20980463648830724_n.jpg",
  "Renaissance-10-480969677_602919642636750_6360344833496389233_n.jpg",
  "Renaissance-11-482083923_602919439303437_161246547385126777_n.jpg",
  "Renaissance-12-481075184_602919809303400_1250588769295739313_n.jpg",
  "Renaissance-14-481071699_602919442636770_6662399972869075613_n.jpg",
  "Renaissance-15-480753950_602919402636774_7382633592106058785_n.jpg",
  "Renaissance-16-481023090_602919589303422_8662619435606681719_n.jpg",
  "Renaissance-2-480790901_602919539303427_1177836907940707771_n.jpg",
  "Renaissance-4-480750808_602919592636755_1570779721525397531_n.jpg",
  "Renaissance-6-481077855_602919815970066_5921349069260907708_n.jpg",
  "Renaissance-8-481024142_602919862636728_1131761008235980224_n.jpg",
  "Renaissance-9-480989073_602919619303419_3707951842830708042_n.jpg",
  "Reynolds-1-480912488_602919812636733_2618696979395155933_n.jpg",
  "Rothko1.jpg",
  "SECRETARIAT-438098809_418379874483614_5998542142450251952_n.jpg",
  "Squidivy-480889623_608133118782069_288098871095393719_n.jpg",
  "STILL LIFE  Coffee Table.jpg","Sydney Sheppie.jpg",
  "THE GRIN-438829673_418380111150257_3908969538079895231_n.jpg",
  "The Sprinter Front View.jpeg",
  "THE SURPRISE-481335782_655514787436787_7996127920156012199_n.jpg",
  "THEN AS NOW-438729410_418379387816996_4245718140883905556_n.jpg",
  "TIME TRAVELLER-491867843_640873872174660_3169334184252443207_n.jpg",
  "Turtleneck.jpg",
  "VORTEX-482128186_655514544103478_2126210507016773635_n.jpg",
];

function getLabel(f: string) {
  return f
    .replace(/\.[^.]+$/, "")
    .replace(/-?\d{15,}(_n)?/g, "")
    .replace(/\.{3}\d+_\d+_\d+_\d+/g, "")
    .replace(/_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/g, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

function getRelated(filename: string, all: string[], n = 4) {
  const tokens = getLabel(filename)
    .toLowerCase()
    .split(" ")
    .filter((w) => w.length > 3);
  const scored = all
    .filter((f) => f !== filename)
    .map((f) => ({
      f,
      score: tokens.filter((t) => getLabel(f).toLowerCase().includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score);
  const out = scored.slice(0, n).map((x) => x.f);
  if (out.length < n) {
    const rest = all
      .filter((f) => f !== filename && !out.includes(f))
      .sort(() => Math.random() - 0.5);
    out.push(...rest.slice(0, n - out.length));
  }
  return out;
}

const SERIES_TESTS = [
  () => true,
  (f: string) => /^derain/i.test(f),
  (f: string) => /^matisse/i.test(f),
  (f: string) => /^medieval/i.test(f),
  (f: string) => /^renaissance/i.test(f),
  (f: string) => !/\d{15,}/.test(f),
] as const;

// --------- AI via Claude ---------
async function askClaude(system: string, userMsg: string, history: {role:string;content:string}[] = []) {
  const res = await fetch("/api/claude/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 600,
      system,
      messages: [...history, { role: "user", content: userMsg }],
    }),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw}`);
  const d = JSON.parse(raw);
  return d.content?.find((b: {type:string;text?:string}) => b.type === "text")?.text ?? "No response.";
}

// --------- ZoomPane ---------
const zoomBtnStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.7)",
  border: "1px solid rgba(212,175,55,0.4)",
  color: "#d4af37",
  width: "2rem",
  height: "2rem",
  borderRadius: "50%",
  fontSize: "1rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "monospace",
};

function ZoomPane({ src, alt, onClose, onPrev, onNext, index, total }: {
  src: string; alt: string; onClose: ()=>void;
  onPrev: ()=>void; onNext: ()=>void; index: number; total: number;
}) {
  const { t } = useTranslation();
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const dragging = useRef<{sx:number;sy:number}|null>(null);
  const pinchRef = useRef<number|null>(null);
  const divRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { panRef.current = pan; }, [pan]);

  useEffect(() => {
    setScale(1); setPan({ x: 0, y: 0 });
    scaleRef.current = 1; panRef.current = { x: 0, y: 0 };
  }, [src]);

  const attachWheel = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    divRef.current = el;
    const handler = (e: WheelEvent) => {
      e.preventDefault(); e.stopPropagation();
      const factor = e.deltaY < 0 ? 1.1 : 0.909;
      const next = Math.min(10, Math.max(1, scaleRef.current * factor));
      scaleRef.current = next; setScale(next);
    };
    el.addEventListener("wheel", handler, { passive: false });
    (el as any)._wheelCleanup = () => el.removeEventListener("wheel", handler);
  }, []);

  useEffect(() => () => (divRef.current as any)?._wheelCleanup?.(), []);

  const onMouseDown = (e: React.MouseEvent) => {
    if (scaleRef.current <= 1) return;
    e.preventDefault();
    dragging.current = { sx: e.clientX - panRef.current.x, sy: e.clientY - panRef.current.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const p = { x: e.clientX - dragging.current.sx, y: e.clientY - dragging.current.sy };
    panRef.current = p; setPan(p);
  };
  const onMouseUp = () => { dragging.current = null; };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchRef.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else {
      dragging.current = { sx: e.touches[0].clientX - panRef.current.x, sy: e.touches[0].clientY - panRef.current.y };
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchRef.current) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const next = Math.min(10, Math.max(1, scaleRef.current * (d / pinchRef.current)));
      pinchRef.current = d; scaleRef.current = next; setScale(next);
    } else if (dragging.current) {
      const p = { x: e.touches[0].clientX - dragging.current.sx, y: e.touches[0].clientY - dragging.current.sy };
      panRef.current = p; setPan(p);
    }
  };
  const onTouchEnd = () => { dragging.current = null; pinchRef.current = null; };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onNext, onPrev, onClose]);

  const reset = () => {
    setScale(1); setPan({ x: 0, y: 0 });
    scaleRef.current = 1; panRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={attachWheel}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove}
      onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      style={{
        flex: 1, position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#181818", cursor: scale > 1 ? "grab" : "default", userSelect: "none",
      }}
    >
      <img
        key={src} src={src} alt={alt} draggable={false}
        style={{
          display: "block", maxWidth: "100%", maxHeight: "92vh", objectFit: "contain",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: dragging.current ? "none" : "transform 0.12s ease",
          pointerEvents: "none",
          border: "1px solid rgba(212,175,55,0.15)",
          animation: "lbIn 0.25s ease",
        }}
      />
      <div style={{ position: "absolute", bottom: "1.2rem", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "0.5rem", zIndex: 10 }}>
        <button onClick={() => { const n = Math.max(1, scaleRef.current * 0.8); scaleRef.current = n; setScale(n); }} style={zoomBtnStyle}>-</button>
        <span style={{ color: scale > 1 ? "#d4af37" : "#333", fontFamily: "'Cinzel',serif", fontSize: "0.62rem", letterSpacing: "0.1em", minWidth: "3rem", textAlign: "center" }}>
          {Math.round(scale * 100)}%
        </span>
        <button onClick={() => { const n = Math.min(10, scaleRef.current * 1.25); scaleRef.current = n; setScale(n); }} style={zoomBtnStyle}>+</button>
        {scale > 1 && (
          <button onClick={reset} style={{ ...zoomBtnStyle, fontSize: "0.55rem", padding: "0.3rem 0.6rem", width: "auto" }}>
            {t("gallery.zoom_reset")}
          </button>
        )}
      </div>
      <div style={{ position: "absolute", top: "0.7rem", left: "50%", transform: "translateX(-50%)", color: "#222", fontFamily: "'Cinzel',serif", fontSize: "0.58rem", letterSpacing: "0.08em", pointerEvents: "none", whiteSpace: "nowrap" }}>
        {t("gallery.zoom_hint")}
      </div>
      <div style={{ position: "absolute", top: "0.7rem", right: "0.8rem", color: "#8a8278", fontFamily: "'Cinzel',serif", fontSize: "0.6rem", letterSpacing: "0.1em" }}>
        {index + 1} / {total}
      </div>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} style={{ position: "absolute", top: "50%", left: "0.8rem", transform: "translateY(-50%)", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(212,175,55,0.4)", color: "#d4af37", width: "2.8rem", height: "2.8rem", borderRadius: "50%", fontSize: "1.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>{"<"}</button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} style={{ position: "absolute", top: "50%", right: "0.8rem", transform: "translateY(-50%)", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(212,175,55,0.4)", color: "#d4af37", width: "2.8rem", height: "2.8rem", borderRadius: "50%", fontSize: "1.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>{">"}</button>
    </div>
  );
}

// --------- Markdown ---------
function Markdown({ text }: { text: string }) {
  const html = text
    .replace(/^### (.+)$/gm, "<h4 style=\"color:#d4af37;font-family:'Cinzel',serif;font-size:0.7rem;letter-spacing:0.1em;margin:0.6rem 0 0.2rem\">$1</h4>")
    .replace(/^## (.+)$/gm,  "<h3 style=\"color:#d4af37;font-family:'Cinzel',serif;font-size:0.75rem;letter-spacing:0.1em;margin:0.6rem 0 0.2rem\">$1</h3>")
    .replace(/^# (.+)$/gm,   "<h3 style=\"color:#d4af37;font-family:'Cinzel',serif;font-size:0.78rem;letter-spacing:0.1em;margin:0 0 0.4rem\">$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#d4c97a">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, " ");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// --------- AI Curator panel ---------
const SYSTEM = `You are a world-class art curator and critic for Facinations — a bold, emotionally charged contemporary gallery.
Write with authority, warmth, and poetic precision. Cover: subject/composition, palette and technique, mood and symbolism.
Keep responses under 120 words unless asked for more. Never mention filenames or numeric IDs.`;

function AiPanel({ filename, allImages, onJump }: { filename: string; allImages: string[]; onJump: (f:string)=>void }) {
  const { t } = useTranslation();
  const label = getLabel(filename);
  const related = useRef(getRelated(filename, allImages)).current;
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error">("idle");
  const [analysis, setAnalysis] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [chat, setChat] = useState<{role:string;content:string}[]>([]);
  const [input, setInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setStatus("idle"); setAnalysis(""); setErrMsg(""); setChat([]); setInput(""); }, [filename]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const invoke = async () => {
    setStatus("loading");
    try {
      const text = await askClaude(SYSTEM, `Describe and analyse the artwork titled "${label}". Cover composition, palette, technique, mood and what makes it unforgettable.`);
      setAnalysis(text); setStatus("done");
    } catch (e: any) { setErrMsg(e.message); setStatus("error"); }
  };

  const send = async () => {
    if (!input.trim() || chatBusy) return;
    const msg = input.trim(); setInput("");
    const next = [...chat, { role: "user", content: msg }];
    setChat(next); setChatBusy(true);
    try {
      const reply = await askClaude(`${SYSTEM}\nThe visitor is currently viewing "${label}".`, msg, chat);
      setChat((c) => [...c, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setChat((c) => [...c, { role: "assistant", content: `Error: ${e.message}` }]);
    }
    setChatBusy(false);
  };

  return (
    <div style={{ width: "320px", minWidth: "280px", flexShrink: 0, background: "#242424", borderLeft: "1px solid rgba(212,175,55,0.12)", display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <div style={{ padding: "1rem 1rem 0.6rem", borderBottom: "1px solid rgba(212,175,55,0.1)", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Cinzel',serif", color: "#d4af37", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.4 }}>{label}</div>
        <div style={{ fontSize: "0.58rem", color: "#8a8278", marginTop: "0.2rem" }}>{t("gallery.ai_subtitle")}</div>
      </div>

      {/* Teleport 3D viewer */}
      <div style={{ padding: "0.75rem", borderBottom: "1px solid rgba(212,175,55,0.07)", flexShrink: 0 }}>
        <div style={{ fontSize: "0.58rem", color: "#d4af37", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.5rem" }}>3D Immersive</div>
        <TeleportViewer
          sceneId={`scene_${filename.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20)}`}
          artworkTitle={label}
        />
      </div>

      {/* Curator analysis */}
      <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid rgba(212,175,55,0.07)", flexShrink: 0 }}>
        <div style={{ fontSize: "0.58rem", color: "#d4af37", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{t("gallery.curators_eye")}</div>
        {status === "idle" && (
          <button onClick={invoke} style={{ width: "100%", padding: "0.55rem 0", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.4)", color: "#d4af37", fontFamily: "'Cinzel',serif", fontSize: "0.65rem", letterSpacing: "0.12em", cursor: "pointer", borderRadius: "2px" }}>
            {t("gallery.btn_invoke")}
          </button>
        )}
        {status === "loading" && <div style={{ color: "#8a8278", fontSize: "0.8rem", fontStyle: "italic" }}>{t("gallery.analysing")}</div>}
        {status === "done" && <div style={{ color: "#b0a898", fontSize: "0.82rem", lineHeight: 1.65 }}><Markdown text={analysis} /></div>}
        {status === "error" && (
          <div>
            <div style={{ color: "#a04040", fontSize: "0.75rem", marginBottom: "0.4rem" }}>{t("gallery.ai_error")}</div>
            <pre style={{ color: "#664040", fontSize: "0.62rem", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: "80px", overflowY: "auto", background: "rgba(255,0,0,0.04)", padding: "0.4rem", borderRadius: "3px" }}>{errMsg}</pre>
            <button onClick={invoke} style={{ marginTop: "0.5rem", padding: "0.3rem 0.7rem", background: "none", border: "1px solid rgba(212,175,55,0.3)", color: "#888", fontFamily: "'Cinzel',serif", fontSize: "0.6rem", cursor: "pointer" }}>{t("gallery.btn_retry")}</button>
          </div>
        )}
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ fontSize: "0.58rem", color: "#d4af37", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.1rem" }}>{t("gallery.ask_curator")}</div>
        {chat.length === 0 && <div style={{ color: "#282828", fontSize: "0.75rem", fontStyle: "italic" }}>{t("gallery.ask_hint")}</div>}
        {chat.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "rgba(212,175,55,0.09)" : "rgba(255,255,255,0.03)", border: `1px solid ${m.role === "user" ? "rgba(212,175,55,0.25)" : "rgba(255,255,255,0.05)"}`, borderRadius: "5px", padding: "0.4rem 0.65rem", maxWidth: "93%", fontSize: "0.8rem", lineHeight: 1.55, color: m.role === "user" ? "#e8d89a" : "#aaa" }}>
            {m.role === "assistant" ? <Markdown text={m.content} /> : m.content}
          </div>
        ))}
        {chatBusy && <div style={{ color: "#484848", fontSize: "0.72rem", fontStyle: "italic" }}>{t("gallery.thinking")}</div>}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "0.65rem 0.85rem", borderTop: "1px solid rgba(212,175,55,0.07)", display: "flex", gap: "0.4rem", flexShrink: 0 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={t("gallery.placeholder_ask")}
          style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.18)", color: "#ccc", borderRadius: "3px", padding: "0.35rem 0.5rem", fontSize: "0.78rem", fontFamily: "inherit", outline: "none" }} />
        <button onClick={send} style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.35)", color: "#d4af37", borderRadius: "3px", padding: "0.35rem 0.6rem", cursor: "pointer", fontFamily: "'Cinzel',serif", fontSize: "0.72rem" }}>?</button>
      </div>

      {/* Related works */}
      <div style={{ padding: "0.7rem 0.85rem 0.9rem", borderTop: "1px solid rgba(212,175,55,0.07)", flexShrink: 0 }}>
        <div style={{ fontSize: "0.58rem", color: "#d4af37", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{t("gallery.related_works")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px" }}>
          {related.map((f) => (
            <div key={f} onClick={() => onJump(f)} title={getLabel(f)} style={{ aspectRatio: "1/1", overflow: "hidden", cursor: "pointer", border: "1px solid rgba(212,175,55,0.08)", borderRadius: "1px" }}>
              <img src={`/images/${encodeURIComponent(f)}`} alt={getLabel(f)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --------- Lightbox ---------
function Lightbox({ filtered, index, setIndex, onClose }: { filtered: string[]; index: number; setIndex: React.Dispatch<React.SetStateAction<number|null>>; onClose: ()=>void }) {
  const file = filtered[index];
  const prev = useCallback(() => setIndex((i) => ((i as number) - 1 + filtered.length) % filtered.length), [filtered.length, setIndex]);
  const next = useCallback(() => setIndex((i) => ((i as number) + 1) % filtered.length), [filtered.length, setIndex]);
  const jumpToFile = useCallback((f: string) => { const i = filtered.indexOf(f); if (i !== -1) setIndex(i); }, [filtered, setIndex]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", flexDirection: "row", background: "rgba(3,3,3,0.98)", animation: "lbFade 0.2s ease" }}>
      <style>{`
        @keyframes lbFade { from{opacity:0}to{opacity:1} }
        @keyframes lbIn   { from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)} }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Cinzel:wght@400;600&display=swap');
      `}</style>
      <ZoomPane src={`/images/${encodeURIComponent(file)}`} alt={getLabel(file)} onClose={onClose} onPrev={prev} onNext={next} index={index} total={filtered.length} />
      <AiPanel filename={file} allImages={filtered} onJump={jumpToFile} />
      <button onClick={onClose} style={{ position: "fixed", top: "0.8rem", right: "328px", background: "rgba(0,0,0,0.7)", border: "1px solid rgba(212,175,55,0.28)", color: "#d4af37", width: "2rem", height: "2rem", borderRadius: "50%", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1010 }}>✕</button>
    </div>
  );
}

// --------- CSS ---------
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Cinzel:wght@400;600&display=swap');
  .g-marquee{overflow:hidden;width:100%;background:#111}
  .g-track{display:flex;gap:3px;width:max-content}
  .g-track.left{animation:gLeft 90s linear infinite}
  .g-track.right{animation:gRight 70s linear infinite}
  .g-marquee:hover .g-track{animation-play-state:paused}
  @keyframes gLeft{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes gRight{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
  .g-item{position:relative;width:260px;height:260px;flex-shrink:0;overflow:hidden;cursor:pointer;background:#111}
  .g-item img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.25,.46,.45,.94),filter .4s;filter:brightness(.88) saturate(.9)}
  .g-item:hover img{transform:scale(1.07);filter:brightness(1) saturate(1.1)}
  .g-item-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.75),transparent 55%);opacity:0;transition:opacity .35s;display:flex;align-items:flex-end;padding:1rem}
  .g-item:hover .g-item-ov{opacity:1}
  .g-lbl{color:#d4af37;font-family:'Cinzel',serif;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase}
  .g-div{width:60px;height:1px;background:linear-gradient(to right,transparent,#d4af37,transparent);margin:.75rem auto 0}
  .f-btn{background:none;border:1px solid rgba(212,175,55,.3);color:#888;font-family:'Cinzel',serif;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;padding:.35rem .9rem;cursor:pointer;transition:all .2s}
  .f-btn:hover,.f-btn.on{background:rgba(212,175,55,.15);border-color:#d4af37;color:#d4af37}
  .dion-section{margin:2rem auto;max-width:820px}
  .dion-header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:0.75rem}
  .dion-eyebrow{font-family:'Cinzel',serif;font-size:0.5rem;letter-spacing:0.38em;text-transform:uppercase;color:rgba(212,175,55,0.45)}
  .dion-title{font-family:'Cinzel',serif;font-size:0.82rem;letter-spacing:0.18em;color:rgba(212,175,55,0.75);font-weight:400;font-style:italic;margin:0}
  .dion-rule{width:100%;height:1px;background:linear-gradient(to right,rgba(212,175,55,0.25),transparent);margin-bottom:1rem}
  .dion-frame{position:relative;background:#0e0e0e;border:1px solid rgba(212,175,55,0.15);box-shadow:0 20px 60px rgba(0,0,0,0.9)}
  .dion-frame::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.45),transparent);z-index:1;pointer-events:none}
  .dion-corner{position:absolute;width:14px;height:14px;border-color:rgba(212,175,55,0.35);border-style:solid;z-index:2}
  .dion-corner.tl{top:-3px;left:-3px;border-width:1px 0 0 1px}
  .dion-corner.tr{top:-3px;right:-3px;border-width:1px 1px 0 0}
  .dion-corner.bl{bottom:-3px;left:-3px;border-width:0 0 1px 1px}
  .dion-corner.br{bottom:-3px;right:-3px;border-width:0 1px 1px 0}
  .dion-video{width:100%;display:block;max-height:520px;object-fit:contain;background:#0e0e0e}
  .dion-caption{display:flex;align-items:center;justify-content:space-between;margin-top:0.75rem;padding:0 0.1rem}
  .dion-caption-text{font-family:'Cormorant Garamond',serif;font-size:0.82rem;color:rgba(212,175,55,0.25);font-style:italic;margin:0;letter-spacing:0.04em}
  .dion-hint{font-family:'Cinzel',serif;font-size:0.44rem;letter-spacing:0.22em;color:rgba(212,175,55,0.18);text-transform:uppercase;white-space:nowrap}
`;

// --------- Gallery page ---------
export default function Gallery() {
  const { t } = useTranslation();
  useMeta({
    title: t("gallery.title"),
    description: "Browse the Musée-Crosdale collection — original works by Crosdale and invited artists, each with on-chain provenance secured by the Facinations protocol.",
    image: "/images/Alchemist-of-Light.jpg",
  });

  const SERIES = [
    { label: t("gallery.filter_all"),         test: SERIES_TESTS[0] },
    { label: t("gallery.filter_derain"),      test: SERIES_TESTS[1] },
    { label: t("gallery.filter_matisse"),     test: SERIES_TESTS[2] },
    { label: t("gallery.filter_medieval"),    test: SERIES_TESTS[3] },
    { label: t("gallery.filter_renaissance"), test: SERIES_TESTS[4] },
    { label: t("gallery.filter_originals"),   test: SERIES_TESTS[5] },
  ];

  const [lbIdx, setLbIdx] = useState<number|null>(null);
  const [filter, setFilter] = useState(0);
  const filtered = images.filter(SERIES[filter].test);
  const dionRef = useRef<HTMLVideoElement>(null);
  const [speed, setSpeed] = useState(1);

  const setPlaybackRate = (rate: number) => {
    setSpeed(rate);
    if (dionRef.current) dionRef.current.playbackRate = rate;
  };

  return (
    <section style={{ color: "#f2ece0", minHeight: "100vh", background: "#202020" }}>
      <style>{css}</style>

      <header style={{ textAlign: "center", padding: "4rem 2rem 3rem", position: "relative", borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,175,55,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#d4af37", marginBottom: "1rem", position: "relative" }}>
          {t("gallery.eyebrow", "Musée-Crosdale — Original Works")}
        </p>
        <h1 style={{ fontFamily: "'Cinzel',serif", color: "#f2ece0", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 400, letterSpacing: "0.15em", margin: 0, position: "relative" }}>
          {t("gallery.title")}
        </h1>
        <p style={{ color: "#b8b0a4", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "1.05rem", marginTop: "1rem", marginBottom: 0, position: "relative" }}>
          {t("gallery.subtitle")}
        </p>
        <div className="g-div" />
      </header>

      <div style={{ padding: "2rem" }}>
        <div style={{ margin: "1.5rem -2rem 0", position: "relative", width: "calc(100% + 4rem)", height: "480px", overflow: "hidden", background: "#000" }}>
          <VideoHero />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "1.5rem 0", alignItems: "center" }}>
          {SERIES.map((s, i) => (
            <button key={s.label} className={`f-btn${filter === i ? " on" : ""}`} onClick={() => setFilter(i)}>{s.label}</button>
          ))}
          <span style={{ marginLeft: "auto", color: "#8a8278", fontFamily: "'Cinzel',serif", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
            {t("gallery.works_count", { count: filtered.length })}
          </span>
        </div>

        <div className="dion-section">
          <div className="dion-header">
            <span className="dion-eyebrow">{t("home.moving_image", "Moving Image")}</span>
            <h2 className="dion-title">Dionysus</h2>
          </div>
          <div className="dion-rule" />
          <div className="dion-frame">
            <div className="dion-corner tl" /><div className="dion-corner tr" />
            <div className="dion-corner bl" /><div className="dion-corner br" />
            <video ref={dionRef} controls preload="metadata" playsInline className="dion-video">
              <source src="/Dionysus.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="dion-caption">
            <p className="dion-caption-text">{t("home.artwork_caption", "A work presented on Facinations")}</p>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <span className="dion-hint" style={{ marginRight: "0.5rem" }}>{t("gallery.speed", "Speed")}</span>
              {[0.25, 0.5, 1].map(r => (
                <button key={r} onClick={() => setPlaybackRate(r)} style={{ background: speed === r ? "rgba(212,175,55,0.15)" : "none", border: `1px solid ${speed === r ? "#d4af37" : "rgba(212,175,55,0.25)"}`, color: speed === r ? "#d4af37" : "rgba(212,175,55,0.35)", fontFamily: "'Cinzel',serif", fontSize: "0.5rem", letterSpacing: "0.1em", padding: "0.2rem 0.5rem", cursor: "pointer", transition: "all 0.2s" }}>
                  {r === 1 ? "1×" : `${r}×`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="g-marquee" key={`marquee-${filter}`}>
          <div className="g-track left" style={{ marginBottom: "3px" }}>
            {[...filtered, ...filtered].map((file, i) => (
              <div key={`r1-${i}`} className="g-item" onClick={() => setLbIdx(filtered.indexOf(file))}>
                <img src={`/images/${encodeURIComponent(file)}`} alt={getLabel(file)} />
                <div className="g-item-ov"><span className="g-lbl">{getLabel(file)}</span></div>
              </div>
            ))}
          </div>
          <div className="g-track right">
            {[...[...filtered].reverse(), ...[...filtered].reverse()].map((file, i) => (
              <div key={`r2-${i}`} className="g-item" onClick={() => setLbIdx(filtered.indexOf(file))}>
                <img src={`/images/${encodeURIComponent(file)}`} alt={getLabel(file)} />
                <div className="g-item-ov"><span className="g-lbl">{getLabel(file)}</span></div>
              </div>
            ))}
          </div>
        </div>

        {lbIdx !== null && (
          <Lightbox filtered={filtered} index={lbIdx} setIndex={setLbIdx} onClose={() => setLbIdx(null)} />
        )}

        <div style={{ marginTop: "3rem", borderTop: "1px solid rgba(212,175,55,0.15)", paddingTop: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <MistralWidget context="gallery" />
          <VoiceAICurator context="Musée-https://xervault.com/gallery — fine art collection by Crosdale" />
        </div>
      </div>
    </section>
  );
}