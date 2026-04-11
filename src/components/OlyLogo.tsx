import { useState, useEffect } from "react";

interface OlyLogoProps {
  size?: "sm" | "md";
  onClick?: () => void;
}

const LOGO_URL = `https://frxjmwmslxdrdhgcjicn.supabase.co/storage/v1/object/public/app-assets/oli-logo.png`;

export function OlyLogo({ size = "md", onClick }: OlyLogoProps) {
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgSize = size === "sm" ? "h-32" : "h-40";
  const textSize = size === "sm" ? "text-lg" : "text-xl";
  const emojiSize = size === "sm" ? "text-base" : "text-lg";

  return (
    <button
      onClick={onClick}
      className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
      aria-label="Oli – zpět na úvod"
    >
      {!imgError ? (
        <img
          src={LOGO_URL}
          alt="Oli"
          className={`${imgSize} object-contain`}
          onError={() => setImgError(true)}
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.2s" }}
        />
      ) : (
        <>
          <span className={emojiSize}>🦉</span>
          <span className={`${textSize} font-bold tracking-tight text-foreground ml-1.5`}>Oli</span>
        </>
      )}
    </button>
  );
}
