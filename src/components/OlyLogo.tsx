import { useState } from "react";
import logoImg from "@/assets/oli-logo.png";

interface OlyLogoProps {
  size?: "sm" | "md";
  onClick?: () => void;
}

export function OlyLogo({ size = "md", onClick }: OlyLogoProps) {
  const [imgError, setImgError] = useState(false);
  const imgSize = size === "sm" ? "h-32" : "h-40";

  return (
    <button
      onClick={onClick}
      className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
      aria-label="Oli – zpět na úvod"
    >
      {!imgError ? (
        <img
          src={logoImg}
          alt="Oli"
          className={`${imgSize} object-contain mix-blend-multiply`}
          onError={() => setImgError(true)}
          style={{ background: "transparent" }}
        />
      ) : (
        <>
          <span className="text-lg">🦉</span>
          <span className="text-xl font-bold tracking-tight text-foreground ml-1.5">Oli</span>
        </>
      )}
    </button>
  );
}
