import React from "react";
import { useTranslation } from "react-i18next";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Skip-to-content link — visible on keyboard focus only */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = "1rem";
          e.currentTarget.style.top = "1rem";
          e.currentTarget.style.width = "auto";
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.zIndex = "9999";
          e.currentTarget.style.background = "#d4af37";
          e.currentTarget.style.color = "#050505";
          e.currentTarget.style.padding = "0.5rem 1rem";
          e.currentTarget.style.fontFamily = "'Cinzel', serif";
          e.currentTarget.style.fontSize = "0.7rem";
          e.currentTarget.style.letterSpacing = "0.15em";
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = "-9999px";
          e.currentTarget.style.width = "1px";
          e.currentTarget.style.height = "1px";
        }}
      >
        {t("common.skip_to_content")}
      </a>

      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}