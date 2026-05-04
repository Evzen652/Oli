import { useState } from "react";
import logoWithText from "@/assets/oli-logo-text.png";
import logoNoText from "@/assets/oli-logo-notext.png";

export { logoNoText };

interface OlyLogoProps {
  size?: "xs" | "sm" | "md";
  variant?: "text" | "notext";
  onClick?: () => void;
}

export function OlyLogo({ size = "md", variant = "text", onClick }: OlyLogoProps) {
  const [failed, setFailed] = useState(false);
  const imgSize = size === "xs" ? "h-14" : size === "sm" ? "h-20" : "h-32";
  const src = variant === "notext" ? logoNoText : logoWithText;

  return (
    <button
      onClick={onClick}
      className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
      aria-label="Oli – zpět na úvod"
    >
      {!failed ? (
        <img
          src={src}
          alt="Oli"
          className={`${imgSize} object-contain mix-blend-multiply`}
          onError={() => setFailed(true)}
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
