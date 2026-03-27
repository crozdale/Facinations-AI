// src/components/GalleryCard.tsx
import React from "react";
import { useTranslation } from "react-i18next";

interface GalleryCardItem {
  image?: string;
  name: string;
  royaltyPercent?: number;
  royaltyReceiver?: string;
}

export default function GalleryCard({ item }: { item: GalleryCardItem }) {
  const { t } = useTranslation();
  return (
    <div style={{
      border: "1px solid rgba(212,175,55,0.12)",
      background: "#202020",
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    }}>
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          style={{ width: "100%", height: "220px", objectFit: "cover", opacity: 0.9 }}
        />
      )}
      <h3 style={{
        fontFamily: "'Cinzel',serif",
        fontSize: "0.95rem",
        fontWeight: 400,
        color: "#f8f2e4",
        letterSpacing: "0.06em",
        margin: 0,
      }}>
        {item.name}
      </h3>
      {item.royaltyPercent != null && (
        <p style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "0.85rem",
          color: "#d4af37",
          margin: 0,
          fontStyle: "italic",
        }}>
          {t("gallery.royalty", "Royalty: {{percent}}%", { percent: item.royaltyPercent })}
        </p>
      )}
      {item.royaltyReceiver && (
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.7rem",
          color: "#6a6258",
          margin: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {item.royaltyReceiver}
        </p>
      )}
    </div>
  );
}
