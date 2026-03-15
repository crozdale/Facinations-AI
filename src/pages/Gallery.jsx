import { useState, useEffect, useRef, useCallback } from "react";
import MistralWidget from "../components/MistralWidget";
import { useTranslation } from "react-i18next";

// ───────────────────────── Image list ─────────────────────────
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

function getLabel(f) {
  return f
    .replace(/\.[^.]+$/, "")
    .replace(/-?\d{15,}(_n)?/g, "")
    .replace(/\.{3}\d+_\d+_\d+_\d+/g, "")
    .replace(/_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/g, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

function getRelated(filename, all, n = 4) {
  const tokens = getLabel(filename)
    .toLowerCase()
    .split(" ")
    .filter((w) => w.length > 3);
  const scored = all
    .filter((f) => f !== filename)
    .map((f) => ({
      f,
      score: tokens.filter((t) =>
        getLabel(f).toLowerCase().includes(t)
      ).length,
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

const SERIES = [
  { label: "All",         test: () => true },
  { label: "Derain",      test: (f) => /^derain/i.test(f) },
  { label: "Matisse",     test: (f) => /^matisse/i.test(f) },
  { label: "Medieval",    test: (f) => /^medieval/i.test(f) },
  { label: "Renaissance", test: (f) => /^renaissance/i.test(f) },
  { label: "Originals",   test: (f) => !/\d{15,}/.test(f) },
];

// ───────── AI via Claude (kept) ─────────
async function askClaude(system, userMsg, history = []) {
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
  return d.content?.find((b) => b.type === "text")?.text ?? "No response.";
}

// ───────── ZoomPane (with simple < > arrows) ─────────
const zoomBtnStyle = {
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

function ZoomPane({ src, alt, onClose, onPrev, onNext, index, total }) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const dragging = useRef(null);
  const pinchRef = useRef(null);
  const divRef = useRef(null);

  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { panRef.current = pan; }, [pan]);

  useEffect(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    scaleRef.current = 1;
    panRef.current = { x: 0, y: 0 };
  }, [src]);

  const attachWheel = useCallback((el) => {
    if (!el) return;
    divRef.current = el;
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const factor = e.deltaY < 0 ? 1.1 : 0.909;
      const next = Math.min(10, Math.max(1, scaleRef.current * factor));
      scaleRef.current = next;
      setScale(next);
    };
    el.addEventListener("wheel", handler, { passive: false });
    el._wheelCleanup = () => el.removeEventListener("wheel", handler);
  }, []);

  useEffect(() => () => divRef.current?._wheelCleanup?.(), []);

  const onMouseDown = (e) => {
    if (scaleRef.current <= 1) return;
    e.preventDefault();
    dragging.current = {
      sx: e.clientX - panRef.current.x,
      sy: e.clientY - panRef.current.y,
    };
  };
  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const p = {
      x: e.clientX - dragging.current.sx,
      y: e.clientY - dragging.current.sy,
    };
    panRef.current = p;
    setPan(p);
  };
  const onMouseUp = () => {
    dragging.current = null;
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      pinchRef.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else {
      dragging.current = {
        sx: e.touches[0].clientX - panRef.current.x,
        sy: e.touches[0].clientY - panRef.current.y,
      };
    }
  };
  const onTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchRef.current) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const next = Math.min(
        10,
        Math.max(1, scaleRef.current * (d / pinchRef.current))
      );
      pinchRef.current = d;
      scaleRef.current = next;
      setScale(next);
    } else if (dragging.current) {
      const p = {
        x: e.touches[0].clientX - dragging.current.sx,
        y: e.touches[0].clientY - dragging.current.sy,
      };
      panRef.current = p;
      setPan(p);
    }
  };
  const onTouchEnd = () => {
    dragging.current = null;
    pinchRef.current = null;
  };

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onNext, onPrev, onClose]);

  const reset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    scaleRef.current = 1;
    panRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={attachWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#060606",
        cursor: scale > 1 ? "grab" : "default",
        userSelect: "none",
      }}
    >
      <img
        key={src}
        src={src}
        alt={alt}
        draggable={false}
        style={{
          display: "block",
          maxWidth: "100%",
          maxHeight: "92vh",
          objectFit: "contain",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: dragging.current ? "none" : "transform 0.12s ease",
          pointerEvents: "none",
          border: "1px solid rgba(212,175,55,0.15)",
          animation: "lbIn 0.25s ease",
        }}
      />

      {/* +/- buttons */}
      <div
        style={{
          position: "absolute",
          bottom: "1.2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => {
            const n = Math.max(1, scaleRef.current * 0.8);
            scaleRef.current = n;
            setScale(n);
          }}
          style={zoomBtnStyle}
        >
          -
        </button>
        <span
          style={{
            color: scale > 1 ? "#d4af37" : "#333",
            fontFamily: "'Cinzel',serif",
            fontSize: "0.62rem",
            letterSpacing: "0.1em",
            minWidth: "3rem",
            textAlign: "center",
          }}
        >
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => {
            const n = Math.min(10, scaleRef.current * 1.25);
            scaleRef.current = n;
            setScale(n);
          }}
          style={zoomBtnStyle}
        >
          +
        </button>
        {scale > 1 && (
          <button
            onClick={reset}
            style={{
              ...zoomBtnStyle,
              fontSize: "0.55rem",
              padding: "0.3rem 0.6rem",
              width: "auto",
            }}
          >
            reset
          </button>
        )}
      </div>

      {/* hint */}
      <div
        style={{
          position: "absolute",
          top: "0.7rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#222",
          fontFamily: "'Cinzel',serif",
          fontSize: "0.58rem",
          letterSpacing: "0.08em",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        scroll · pinch · use +/- to zoom
      </div>

      {/* counter */}
      <div
        style={{
          position: "absolute",
          top: "0.7rem",
          right: "0.8rem",
          color: "#2a2a2a",
          fontFamily: "'Cinzel',serif",
          fontSize: "0.6rem",
          letterSpacing: "0.1em",
        }}
      >
        {index + 1} / {total}
      </div>

      {/* nav arrows < and > */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        style={{
          position: "absolute",
          top: "50%",
          left: "0.8rem",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(212,175,55,0.4)",
          color: "#d4af37",
          width: "2.8rem",
          height: "2.8rem",
          borderRadius: "50%",
          fontSize: "1.5rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {"<"}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        style={{
          position: "absolute",
          top: "50%",
          right: "0.8rem",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(212,175,55,0.4)",
          color: "#d4af37",
          width: "2.8rem",
          height: "2.8rem",
          borderRadius: "50%",
          fontSize: "1.5rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {">"}
      </button>
    </div>
  );
}

// ───────── simple Markdown ─────────
// ───────── Claude “Curator” panel ─────────
const SYSTEM = `You are a world-class art curator and critic for Facinations — a bold, emotionally charged contemporary gallery.
Write with authority, warmth, and poetic precision. Cover: subject/composition, palette and technique, mood and symbolism.
Keep responses under 120 words unless asked for more. Never mention filenames or numeric IDs.`;
function Markdown({ text }) {
  const html = text
    .replace(
      /^### (.+)$/gm,
      "<h4 style=\"color:#d4af37;font-family:'Cinzel',serif;font-size:0.7rem;letter-spacing:0.1em;margin:0.6rem 0 0.2rem\">$1</h4>"
    )
    .replace(
      /^## (.+)$/gm,
      "<h3 style=\"color:#d4af37;font-family:'Cinzel',serif;font-size:0.75rem;letter-spacing:0.1em;margin:0.6rem 0 0.2rem\">$1</h3>"
    )
    .replace(
      /^# (.+)$/gm,
      "<h3 style=\"color:#d4af37;font-family:'Cinzel',serif;font-size:0.78rem;letter-spacing:0.1em;margin:0 0 0.4rem\">$1</h3>"
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#d4c97a">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, " ");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function AiPanel({ filename, allImages, onJump }) {
  const label = getLabel(filename);
  const related = useRef(getRelated(filename, allImages)).current;

  const [status, setStatus] = useState("idle");
  const [analysis, setAnalysis] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    setStatus("idle");
    setAnalysis("");
    setErrMsg("");
    setChat([]);
    setInput("");
  }, [filename]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const invoke = async () => {
    setStatus("loading");
    try {
      const text = await askClaude(
        SYSTEM,
        `Describe and analyse the artwork titled "${label}". Cover composition, palette, technique, mood and what makes it unforgettable.`
      );
      setAnalysis(text);
      setStatus("done");
    } catch (e) {
      setErrMsg(e.message);
      setStatus("error");
    }
  };

  const send = async () => {
    if (!input.trim() || chatBusy) return;
    const msg = input.trim();
    setInput("");
    const next = [...chat, { role: "user", content: msg }];
    setChat(next);
    setChatBusy(true);
    try {
      const reply = await askClaude(
        `${SYSTEM}\nThe visitor is currently viewing "${label}".`,
        msg,
        chat
      );
      setChat((c) => [...c, { role: "assistant", content: reply }]);
    } catch (e) {
      setChat((c) => [
        ...c,
        { role: "assistant", content: `Error: ${e.message}` },
      ]);
    }
    setChatBusy(false);
  };

  return (
    <div
      style={{
        width: "320px",
        minWidth: "280px",
        flexShrink: 0,
        background: "#0c0c0c",
        borderLeft: "1px solid rgba(212,175,55,0.12)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem 1rem 0.6rem",
          borderBottom: "1px solid rgba(212,175,55,0.1)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            color: "#d4af37",
            fontSize: "0.68rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            lineHeight: 1.4,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "0.58rem",
            color: "#333",
            marginTop: "0.2rem",
          }}
        >
          AI Curator · Chat · Related
        </div>
      </div>

      {/* Curator */}
      <div
        style={{
          padding: "0.85rem 1rem",
          borderBottom: "1px solid rgba(212,175,55,0.07)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: "0.58rem",
            color: "#d4af37",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          Curator&apos;s Eye
        </div>

        {status === "idle" && (
          <button
            onClick={invoke}
            style={{
              width: "100%",
              padding: "0.55rem 0",
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.4)",
              color: "#d4af37",
              fontFamily: "'Cinzel',serif",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              cursor: "pointer",
              borderRadius: "2px",
            }}
          >
            ✦ Invoke AI Curator
          </button>
        )}

        {status === "loading" && (
          <div
            style={{
              color: "#333",
              fontSize: "0.8rem",
              fontStyle: "italic",
            }}
          >
            Analysing…
          </div>
        )}

        {status === "done" && (
          <div
            style={{
              color: "#b0a898",
              fontSize: "0.82rem",
              lineHeight: 1.65,
            }}
          >
            <Markdown text={analysis} />
          </div>
        )}

        {status === "error" && (
          <div>
            <div
              style={{
                color: "#a04040",
                fontSize: "0.75rem",
                marginBottom: "0.4rem",
              }}
            >
              Could not reach AI. Check DevTools Network tab for /api/claude
              errors.
            </div>
            <pre
              style={{
                color: "#664040",
                fontSize: "0.62rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                maxHeight: "80px",
                overflowY: "auto",
                background: "rgba(255,0,0,0.04)",
                padding: "0.4rem",
                borderRadius: "3px",
              }}
            >
              {errMsg}
            </pre>
            <button
              onClick={invoke}
              style={{
                marginTop: "0.5rem",
                padding: "0.3rem 0.7rem",
                background: "none",
                border: "1px solid rgba(212,175,55,0.3)",
                color: "#888",
                fontFamily: "'Cinzel',serif",
                fontSize: "0.6rem",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Chat */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.75rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            fontSize: "0.58rem",
            color: "#d4af37",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "0.1rem",
          }}
        >
          Ask the Curator
        </div>
        {chat.length === 0 && (
          <div
            style={{
              color: "#282828",
              fontSize: "0.75rem",
              fontStyle: "italic",
            }}
          >
            Ask anything about technique, history, symbolism…
          </div>
        )}
        {chat.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf:
                m.role === "user" ? "flex-end" : "flex-start",
              background:
                m.role === "user"
                  ? "rgba(212,175,55,0.09)"
                  : "rgba(255,255,255,0.03)",
              border: `1px solid ${
                m.role === "user"
                  ? "rgba(212,175,55,0.25)"
                  : "rgba(255,255,255,0.05)"
              }`,
              borderRadius: "5px",
              padding: "0.4rem 0.65rem",
              maxWidth: "93%",
              fontSize: "0.8rem",
              lineHeight: 1.55,
              color:
                m.role === "user" ? "#e8d89a" : "#aaa",
            }}
          >
            {m.role === "assistant" ? (
              <Markdown text={m.content} />
            ) : (
              m.content
            )}
          </div>
        ))}
        {chatBusy && (
          <div
            style={{
              color: "#2a2a2a",
              fontSize: "0.72rem",
              fontStyle: "italic",
            }}
          >
            thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "0.65rem 0.85rem",
          borderTop: "1px solid rgba(212,175,55,0.07)",
          display: "flex",
          gap: "0.4rem",
          flexShrink: 0,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything…"
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(212,175,55,0.18)",
            color: "#ccc",
            borderRadius: "3px",
            padding: "0.35rem 0.5rem",
            fontSize: "0.78rem",
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        <button
          onClick={send}
          style={{
            background: "rgba(212,175,55,0.1)",
            border: "1px solid rgba(212,175,55,0.35)",
            color: "#d4af37",
            borderRadius: "3px",
            padding: "0.35rem 0.6rem",
            cursor: "pointer",
            fontFamily: "'Cinzel',serif",
            fontSize: "0.72rem",
          }}
        >
          →
        </button>
      </div>

      {/* Related */}
      <div
        style={{
          padding: "0.7rem 0.85rem 0.9rem",
          borderTop: "1px solid rgba(212,175,55,0.07)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: "0.58rem",
            color: "#d4af37",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          Related Works
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3px",
          }}
        >
          {related.map((f) => (
            <div
              key={f}
              onClick={() => onJump(f)}
              title={getLabel(f)}
              style={{
                aspectRatio: "1/1",
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid rgba(212,175,55,0.08)",
                borderRadius: "1px",
              }}
            >
              <img
                src={`/images/${encodeURIComponent(f)}`}
                alt={getLabel(f)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────── Lightbox shell ─────────
function Lightbox({ filtered, index, setIndex, onClose }) {
  const file = filtered[index];
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + filtered.length) % filtered.length),
    [filtered.length, setIndex]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % filtered.length),
    [filtered.length, setIndex]
  );
  const jumpToFile = useCallback(
    (f) => {
      const i = filtered.indexOf(f);
      if (i !== -1) setIndex(i);
    },
    [filtered, setIndex]
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "row",
        background: "rgba(3,3,3,0.98)",
        animation: "lbFade 0.2s ease",
      }}
    >
      <style>{`
        @keyframes lbFade { from{opacity:0}to{opacity:1} }
        @keyframes lbIn   { from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)} }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Cinzel:wght@400;600&display=swap');
      `}</style>

      <ZoomPane
        src={`/images/${encodeURIComponent(file)}`}
        alt={getLabel(file)}
        onClose={onClose}
        onPrev={prev}
        onNext={next}
        index={index}
        total={filtered.length}
      />

      <AiPanel
        filename={file}
        allImages={filtered}
        onJump={jumpToFile}
      />

      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: "0.8rem",
          right: "328px",
          background: "rgba(0,0,0,0.7)",
          border: "1px solid rgba(212,175,55,0.28)",
          color: "#d4af37",
          width: "2rem",
          height: "2rem",
          borderRadius: "50%",
          fontSize: "0.85rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1010,
        }}
      >
        ×
      </button>
    </div>
  );
}

// ───────── Gallery page ─────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Cinzel:wght@400;600&display=swap');
  .g-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:2px;background:#1a1609}
  .g-item{position:relative;overflow:hidden;aspect-ratio:1/1;cursor:pointer;background:#111}
  .g-item img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.25,.46,.45,.94),filter .4s;filter:brightness(.88) saturate(.9)}
  .g-item:hover img{transform:scale(1.07);filter:brightness(1) saturate(1.1)}
  .g-item-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.75),transparent 55%);opacity:0;transition:opacity .35s;display:flex;align-items:flex-end;padding:1rem}
  .g-item:hover .g-item-ov{opacity:1}
  .g-lbl{color:#d4af37;font-family:'Cinzel',serif;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase}
  .g-div{width:60px;height:1px;background:linear-gradient(to right,transparent,#d4af37,transparent);margin:.75rem auto 0}
  .f-btn{background:none;border:1px solid rgba(212,175,55,.3);color:#888;font-family:'Cinzel',serif;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;padding:.35rem .9rem;cursor:pointer;transition:all .2s}
  .f-btn:hover,.f-btn.on{background:rgba(212,175,55,.15);border-color:#d4af37;color:#d4af37}
`;

export default function Gallery() {
  const { t } = useTranslation();
  const [lbIdx, setLbIdx] = useState(null);
  const [filter, setFilter] = useState(0);
  const filtered = images.filter(SERIES[filter].test);

  return (
    <section
      style={{
        padding: "2rem",
        color: "#e8e0d0",
        minHeight: "100vh",
        background: "#0a0a0a",
      }}
    >
      <style>{css}</style>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <h1
          style={{
            fontFamily: "'Cinzel',serif",
            color: "#d4af37",
            fontSize: "2rem",
            letterSpacing: "0.2em",
            marginBottom: "0.25rem",
          }}
        >
          {t("gallery.title")}
        </h1>
        <p
          style={{
            color: "#888",
            fontFamily: "'Cormorant Garamond',serif",
            fontStyle: "italic",
            fontSize: "1.05rem",
          }}
        >
          {t("gallery.subtitle")}
        </p>
        <div className="g-div" />
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          margin: "1.5rem 0",
          alignItems: "center",
        }}
      >
        {SERIES.map((s, i) => (
          <button
            key={s.label}
            className={`f-btn${filter === i ? " on" : ""}`}
            onClick={() => setFilter(i)}
          >
            {s.label}
          </button>
        ))}
        <span
          style={{
            marginLeft: "auto",
            color: "#444",
            fontFamily: "'Cinzel',serif",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
          }}
        >
          {filtered.length} works
        </span>
      </div>

      <div className="g-grid">
        {filtered.map((file, i) => (
          <div
            key={file}
            className="g-item"
            onClick={() => setLbIdx(i)}
          >
            <img
              src={`/images/${encodeURIComponent(file)}`}
              alt={getLabel(file)}
              loading="lazy"
            />
            <div className="g-item-ov">
              <span className="g-lbl">{getLabel(file)}</span>
            </div>
          </div>
        ))}
      </div>

      {lbIdx !== null && (
        <Lightbox
          filtered={filtered}
          index={lbIdx}
          setIndex={setLbIdx}
          onClose={() => setLbIdx(null)}
        />
      )}

      <div
        style={{
          marginTop: "3rem",
          borderTop: "1px solid rgba(212,175,55,0.15)",
          paddingTop: "2rem",
        }}
      >
        <MistralWidget context="gallery" />
      </div>
    </section>
  );
}
