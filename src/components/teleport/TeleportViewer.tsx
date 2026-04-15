import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface TeleportViewerProps {
  sceneId: string;
  splatCount?: string;
  artworkTitle?: string;
}

export function TeleportViewer({ sceneId, splatCount, artworkTitle }: TeleportViewerProps) {
  const [tpOn, setTpOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleEnter = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      setTpOn(true);
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div style={{ borderRadius: "10px", border: "1px solid #1D9E75", overflow: "hidden", background: "#04342C" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 12px", borderBottom: "1px solid #0F6E56" }}>
        <div style={{ width: "16px", height: "16px", borderRadius: "3px", background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#9FE1CB" }} />
        </div>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#9FE1CB" }}>{t("teleport.varjo")}</span>
        {splatCount && (
          <span style={{ marginLeft: "auto", fontSize: "10px", padding: "2px 6px", borderRadius: "999px", background: "#0F6E56", color: "#9FE1CB" }}>
            {splatCount} {t("teleport.splats")}
          </span>
        )}
      </div>

      <div
        style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", cursor: tpOn ? "default" : "pointer", background: "#030f0a" }}
        onClick={!tpOn && !loading ? handleEnter : undefined}
      >
        {tpOn ? (
          <div style={{ textAlign: "center", padding: "16px" }}>
            <div style={{ color: "#9FE1CB", fontSize: "13px", marginBottom: "4px" }}>{artworkTitle}</div>
            <div style={{ color: "#5DCAA5", fontSize: "11px" }}>Scene: {sceneId}</div>
            <div style={{ color: "#1D9E75", fontSize: "10px", marginTop: "8px" }}>â— LIVE Â· Gaussian Splat</div>
          </div>
        ) : loading ? (
          <div style={{ color: "#5DCAA5", fontSize: "12px" }}>{t("teleport.loading")}</div>
        ) : error ? (
          <div style={{ color: "#E24B4A", fontSize: "12px" }}>{t("teleport.scene_unavailable")}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1.5px solid #5DCAA5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderLeft: "14px solid #9FE1CB", marginLeft: "3px" }} />
            </div>
            <span style={{ fontSize: "11px", color: "#5DCAA5", textAlign: "center" }}>
              {t("teleport.enter_space")}<br />
              <span style={{ opacity: 0.6, fontSize: "10px" }}>{sceneId}</span>
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: "7px 12px", borderTop: "1px solid #0F6E56", display: "flex", gap: "6px" }}>
        <button
          onClick={() => tpOn ? setTpOn(false) : handleEnter()}
          style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "6px", border: "1px solid #1D9E75", color: "#9FE1CB", background: tpOn ? "#1D9E75" : "transparent", cursor: "pointer" }}
        >
          {tpOn ? t("teleport.exit_space") : t("teleport.enter_space")}
        </button>
        <span style={{ marginLeft: "auto", fontSize: "10px", color: "#5DCAA5", alignSelf: "center" }}>
          {tpOn ? t("teleport.ready") : t("teleport.idle")}
        </span>
      </div>
    </div>
  );
}
