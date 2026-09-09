import { useState } from "react";

/**
 * Renders a crop's photo (imageUrl) in a fixed-size rounded thumbnail.
 * If no imageUrl is set, or the image fails to load, falls back to a
 * plant emoji on a soft sage background so the UI never shows a broken
 * image icon.
 */
export default function CropPhoto({ src, alt, size = 72 }) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  const style = {
    width: size,
    height: size,
    borderRadius: "var(--radius-md)",
    flexShrink: 0,
    objectFit: "cover",
    border: "1px solid var(--color-border)",
    background: "var(--color-sage)",
  };

  if (showFallback) {
    return (
      <div
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.42,
        }}
        role="img"
        aria-label={alt}
      >
        🌿
      </div>
    );
  }

  return <img src={src} alt={alt} style={style} onError={() => setFailed(true)} />;
}
