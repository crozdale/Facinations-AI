import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GALLERY_ITEMS } from "../data/gallery";
import { TeleportViewer } from "./teleport";

type GalleryItem = typeof GALLERY_ITEMS[number];

export default function GalleryPanel() {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [showYoutube, setShowYoutube] = useState(false);

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GALLERY_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => { setSelected(item); setShowYoutube(false); }}
            style={{ cursor: "pointer" }}
            className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {item.image && (
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-4" />
            )}
            <h3 className="font-serif text-xl font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-black/70">{item.artist} · {item.year}</p>
            <p className="mt-3 text-sm text-black/60">{item.medium}</p>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)",
            zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#111", borderRadius: "16px", border: "1px solid rgba(212,175,55,0.2)",
              width: "100%", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto",
              padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ fontFamily: "'Cinzel',serif", color: "#f8f2e4", fontSize: "1.2rem", margin: 0 }}>
                  {selected.title}
                </h2>
                <p style={{ color: "#d4af37", fontSize: "0.85rem", margin: "4px 0 0", fontStyle: "italic" }}>
                  {selected.artist} · {selected.year} · {selected.medium}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", color: "#888", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {/* Image */}
            {selected.image && (
              <img src={selected.image} alt={selected.title}
                style={{ width: "100%", borderRadius: "10px", objectFit: "cover", maxHeight: "260px" }} />
            )}

            {/* Varjo Teleport */}
            {selected.sceneId && (
              <TeleportViewer
                sceneId={selected.sceneId}
                splatCount={selected.splatCount}
                artworkTitle={selected.title}
              />
            )}

            {/* YouTube Documentary */}
            {selected.youtubeUrl && (
              <div style={{ borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <button
                  onClick={() => setShowYoutube(!showYoutube)}
                  style={{
                    width: "100%", padding: "10px 14px", background: "#1a1a1a",
                    border: "none", borderBottom: showYoutube ? "1px solid rgba(255,255,255,0.1)" : "none",
                    color: "#f8f2e4", fontFamily: "'Cinzel',serif", fontSize: "0.8rem",
                    letterSpacing: "0.08em", cursor: "pointer", display: "flex",
                    alignItems: "center", gap: "8px", textAlign: "left",
                  }}
                >
                  <span style={{ color: "#FF0000", fontSize: "1rem" }}>▶</span>
                  {showYoutube ? "Hide" : "Watch"} Artist Documentary
                </button>
                {showYoutube && (
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                      src={selected.youtubeUrl}
                      title="Artist Documentary"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: "absolute", top: 0, left: 0,
                        width: "100%", height: "100%", border: "none",
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Links */}
            <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
              <a href={selected.externalUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: "0.8rem", color: "#d4af37", textDecoration: "underline" }}>
                View on XdaleGallery
              </a>
              <Link to={`/vault/${selected.id}`}
                style={{ fontSize: "0.8rem", color: "#d4af37", textDecoration: "underline" }}>
                Open Vault
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
