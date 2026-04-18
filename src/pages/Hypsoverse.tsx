// src/pages/Hypsoverse.tsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMeta } from "../hooks/useMeta";
import SubscriptionGate from "../components/SubscriptionGate";

// ── Scene registry — add new Gaussian Splat scenes here ──────────────────────
const SCENES: Record<string, { title: string; src: string; description: string }> = {
  dionysus: {
    title: "Dionysus",
    src: "/Dionysus.mp4",
    description: "A Gaussian Splat environment captured and rendered for the Hypsoverse.",
  },
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Cinzel:wght@400;600&display=swap');

  .hv-root {
    position: fixed;
    inset: 0;
    background: #000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 100;
  }

  .hv-scene {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Top bar */
  .hv-topbar {
    position: absolute;
    top: 0; left: 0; right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.2rem 1.8rem;
    background: linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%);
    z-index: 10;
    pointer-events: none;
  }
  .hv-topbar > * { pointer-events: auto; }

  .hv-wordmark {
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: rgba(212,175,55,0.6);
  }

  .hv-title {
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    letter-spacing: 0.2em;
    color: rgba(212,175,55,0.85);
    font-weight: 400;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .hv-exit {
    background: rgba(0,0,0,0.6);
    border: 1px solid rgba(212,175,55,0.35);
    color: #d4af37;
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 0.45rem 1.1rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .hv-exit:hover {
    background: rgba(212,175,55,0.12);
    border-color: #d4af37;
  }

  /* Bottom bar */
  .hv-bottombar {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 1.5rem 1.8rem;
    background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%);
    z-index: 10;
    pointer-events: none;
  }
  .hv-bottombar > * { pointer-events: auto; }

  .hv-desc {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 0.85rem;
    color: rgba(212,175,55,0.35);
    max-width: 420px;
    line-height: 1.6;
  }

  .hv-badge {
    font-family: 'Cinzel', serif;
    font-size: 0.44rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(212,175,55,0.25);
    text-align: right;
    line-height: 1.8;
  }

  /* Corner decorations */
  .hv-corner {
    position: absolute;
    width: 18px;
    height: 18px;
    border-color: rgba(212,175,55,0.2);
    border-style: solid;
    z-index: 11;
    pointer-events: none;
  }
  .hv-corner.tl { top: 12px; left: 12px; border-width: 1px 0 0 1px; }
  .hv-corner.tr { top: 12px; right: 12px; border-width: 1px 1px 0 0; }
  .hv-corner.bl { bottom: 12px; left: 12px; border-width: 0 0 1px 1px; }
  .hv-corner.br { bottom: 12px; right: 12px; border-width: 0 1px 1px 0; }

  /* Scan line overlay */
  .hv-scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.03) 2px,
      rgba(0,0,0,0.03) 4px
    );
    pointer-events: none;
    z-index: 5;
  }

  /* Vignette */
  .hv-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%);
    pointer-events: none;
    z-index: 4;
  }

  /* Enter animation */
  .hv-root { animation: hvFadeIn 1.2s ease forwards; }
  @keyframes hvFadeIn { from { opacity: 0 } to { opacity: 1 } }

  /* 404 scene */
  .hv-notfound {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  .hv-notfound h2 {
    font-family: 'Cinzel', serif;
    color: rgba(212,175,55,0.5);
    font-size: 1rem;
    letter-spacing: 0.2em;
    font-weight: 400;
  }
  .hv-notfound p {
    font-family: 'Cormorant Garamond', serif;
    color: rgba(255,255,255,0.3);
    font-style: italic;
    font-size: 0.9rem;
  }

  /* Fullscreen toggle */
  .hv-fullscreen {
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(212,175,55,0.2);
    color: rgba(212,175,55,0.5);
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    transition: all 0.2s;
    margin-left: 0.5rem;
  }
  .hv-fullscreen:hover {
    border-color: rgba(212,175,55,0.5);
    color: #d4af37;
  }
`;

// ── HypsoverseScene ───────────────────────────────────────────────────────────
function HypsoverseScene({ sceneId }: { sceneId: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scene = SCENES[sceneId];

  // Escape key exits
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") navigate(-1); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [navigate]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!scene) {
    return (
      <div className="hv-root">
        <style>{css}</style>
        <div className="hv-notfound">
          <h2>Scene Not Found</h2>
          <p>This Hypsoverse environment has not yet been captured.</p>
          <button
            onClick={() => navigate("/gallery")}
            style={{ marginTop: "1rem", background: "none", border: "1px solid rgba(212,175,55,0.3)", color: "#d4af37", fontFamily: "'Cinzel',serif", fontSize: "0.6rem", letterSpacing: "0.15em", padding: "0.6rem 1.4rem", cursor: "pointer" }}
          >
            Return to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hv-root">
      <style>{css}</style>

      {/* Scene — Gaussian Splat video (replace with 3DGS engine when ready) */}
      <video
        ref={videoRef}
        className="hv-scene"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={scene.src} type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="hv-vignette" />
      <div className="hv-scanlines" />

      {/* Corner decorations */}
      <div className="hv-corner tl" />
      <div className="hv-corner tr" />
      <div className="hv-corner bl" />
      <div className="hv-corner br" />

      {/* Top bar */}
      <div className="hv-topbar">
        <span className="hv-wordmark">Musée-Crosdale · Hypsoverse</span>
        <span className="hv-title">{scene.title}</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button className="hv-fullscreen" onClick={toggleFullscreen} title="Toggle fullscreen">
            {isFullscreen ? "⛶" : "⛶"}
          </button>
          <button className="hv-exit" onClick={() => navigate(-1)}>
            ✕ {t("hypsoverse.exit", "Exit")}
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hv-bottombar">
        <p className="hv-desc">{scene.description}</p>
        <div className="hv-badge">
          <div>Hypsoverse</div>
          <div>Gaussian Splat Environment</div>
          <div>Facinations Protocol</div>
        </div>
      </div>
    </div>
  );
}

// ── Page — wrapped in SubscriptionGate ───────────────────────────────────────
export default function Hypsoverse() {
  const { sceneId = "dionysus" } = useParams<{ sceneId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useMeta({
    title: `Hypsoverse — ${SCENES[sceneId]?.title ?? "Scene"}`,
    description: "An immersive Gaussian Splat environment, part of the Musée-Crosdale Hypsoverse experience.",
  });

  return (
    <SubscriptionGate
      feature="hypsoverse"
      fallback={
        <div style={{
          position: "fixed", inset: 0, background: "#0a0a0a",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "1.5rem", zIndex: 100,
          fontFamily: "'Cormorant Garamond', serif",
        }}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Cinzel:wght@400;600&display=swap');`}</style>

          {/* Corner decorations */}
          <div style={{ position: "absolute", top: 16, left: 16, width: 18, height: 18, borderTop: "1px solid rgba(212,175,55,0.2)", borderLeft: "1px solid rgba(212,175,55,0.2)" }} />
          <div style={{ position: "absolute", top: 16, right: 16, width: 18, height: 18, borderTop: "1px solid rgba(212,175,55,0.2)", borderRight: "1px solid rgba(212,175,55,0.2)" }} />
          <div style={{ position: "absolute", bottom: 16, left: 16, width: 18, height: 18, borderBottom: "1px solid rgba(212,175,55,0.2)", borderLeft: "1px solid rgba(212,175,55,0.2)" }} />
          <div style={{ position: "absolute", bottom: 16, right: 16, width: 18, height: 18, borderBottom: "1px solid rgba(212,175,55,0.2)", borderRight: "1px solid rgba(212,175,55,0.2)" }} />

          <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.5rem", letterSpacing: "0.4em", color: "rgba(212,175,55,0.4)", textTransform: "uppercase" }}>
            Musée-Crosdale · Hypsoverse
          </div>

          <div style={{ width: 60, height: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)" }} />

          <h2 style={{ fontFamily: "'Cinzel',serif", color: "rgba(212,175,55,0.8)", fontSize: "clamp(1.2rem,3vw,1.8rem)", fontWeight: 400, letterSpacing: "0.15em", margin: 0, textAlign: "center" }}>
            Premium Access Required
          </h2>

          <p style={{ color: "rgba(184,176,164,0.7)", fontStyle: "italic", fontSize: "1rem", maxWidth: 420, textAlign: "center", lineHeight: 1.8, margin: 0, padding: "0 2rem" }}>
            The Hypsoverse is an exclusive immersive experience for Facinations premium collectors. Enter a Gaussian Splat environment and walk through a captured physical gallery.
          </p>

          <div style={{ width: 60, height: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)" }} />

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{ fontFamily: "'Cinzel',serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.85rem 2.2rem", background: "rgba(212,175,55,0.12)", border: "1px solid #d4af37", color: "#d4af37", cursor: "pointer", transition: "all 0.2s" }}
            >
              {t("hypsoverse.upgrade", "Upgrade to Premium")}
            </button>
            <button
              onClick={() => navigate(-1)}
              style={{ fontFamily: "'Cinzel',serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.85rem 2.2rem", background: "none", border: "1px solid rgba(212,175,55,0.25)", color: "rgba(212,175,55,0.5)", cursor: "pointer", transition: "all 0.2s" }}
            >
              {t("hypsoverse.back", "Return")}
            </button>
          </div>

          <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.42rem", letterSpacing: "0.25em", color: "rgba(212,175,55,0.18)", textTransform: "uppercase", marginTop: "1rem" }}>
            Powered by the Facinations Fine-Art Protocol
          </div>
        </div>
      }
    >
      <HypsoverseScene sceneId={sceneId} />
    </SubscriptionGate>
  );
}