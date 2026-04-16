import React from "react";
import { useTranslation } from "react-i18next";

interface HypsoverseViewerProps {
  sceneId?: string;
  splatCount?: string;
  artworkTitle?: string;
}

const IMMERSIVE_URL = "https://xervault.com/gallery";
const GALLERY_URL   = "https://xdale.net/Musee-crosdale/gallery";

export function HypsoverseViewer({ splatCount, artworkTitle }: HypsoverseViewerProps) {
  const { t } = useTranslation();

  return (
    <div style={{ borderRadius: "10px", border: "1px solid #1D9E75", overflow: "hidden", background: "#04342C" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 12px", borderBottom: "1px solid #0F6E56" }}>
        <div style={{ width: "16px", height: "16px", borderRadius: "3px", background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#9FE1CB" }} />
        </div>
        <span style={{ fontSize: "12px", fontWeight: 500, color: "#9FE1CB", fontFamily: "'Cinzel',serif", letterSpacing: "0.06em" }}>
          Hypsoverse
        </span>
        {splatCount && (
          <span style={{ marginLeft: "auto", fontSize: "10px", padding: "2px 6px", borderRadius: "999px", background: "#0F6E56", color: "#9FE1CB" }}>
            {splatCount} {t("teleport.splats")}
          </span>
        )}
      </div>

      {/* Preview */}
      <div style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", background: "#030f0a" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "16px", textAlign: "center" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", border: "1.5px solid #5DCAA5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: "16px solid #9FE1CB", marginLeft: "4px" }} />
          </div>
          {artworkTitle && (
            <span style={{ fontSize: "11px", color: "#9FE1CB", fontFamily: "'Cinzel',serif", letterSpacing: "0.08em" }}>
              {artworkTitle}
            </span>
          )}
          <span style={{ fontSize: "9px", color: "#5DCAA5", opacity: 0.6, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Cinzel',serif" }}>
            Gaussian Splat · Immersive 3D
          </span>
        </div>
      </div>

      {/* Two action buttons */}
      <div style={{ padding: "8px 12px", borderTop: "1px solid #0F6E56", display: "flex", gap: "6px", flexWrap: "wrap" }}>

        {/* Enter immersive space → xervault.com/gallery */}
        <a
          href={IMMERSIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, textAlign: "center",
            fontSize: "10px", padding: "5px 10px", borderRadius: "6px",
            border: "1px solid #1D9E75", color: "#9FE1CB",
            background: "rgba(29,158,117,0.18)", cursor: "pointer",
            textDecoration: "none", fontFamily: "'Cinzel',serif",
            letterSpacing: "0.07em", whiteSpace: "nowrap",
          }}
        >
          {t("hypsoverse.enter")}
        </a>

        {/* View gallery → xdale.net/Musee-crosdale/gallery */}
        <a
          href={GALLERY_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, textAlign: "center",
            fontSize: "10px", padding: "5px 10px", borderRadius: "6px",
            border: "1px solid #0F6E56", color: "#5DCAA5",
            background: "transparent", cursor: "pointer",
            textDecoration: "none", fontFamily: "'Cinzel',serif",
            letterSpacing: "0.07em", whiteSpace: "nowrap",
          }}
        >
          {t("galleryPanel.view_on_xdale")}
        </a>

      </div>

      {/* Powered by footer */}
      <div style={{ padding: "4px 12px 6px", display: "flex", justifyContent: "flex-end" }}>
        <span style={{ fontSize: "9px", color: "#1D9E75", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", opacity: 0.6 }}>
          {t("hypsoverse.powered_by")}
        </span>
      </div>

    </div>
  );
}


