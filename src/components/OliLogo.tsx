import owlSrc from "@/assets/oli-owl.png";
import { cn } from "@/lib/utils";

export { owlSrc as logoNoText };

interface OliLogoProps {
  size?: "xs" | "sm" | "md";
  variant?: "text" | "notext";
  /**
   * Barevná varianta nápisu:
   *  - `ink` (default) — tmavě oranžová na světlém podkladu (7,4:1 na bílé)
   *  - `inverse` — bílá pro tmavý/fotografický podklad
   */
  tone?: "ink" | "inverse";
  onClick?: () => void;
}

const SIZE = {
  xs: { owl: "h-9 w-9",  text: "text-2xl" },
  sm: { owl: "h-12 w-12", text: "text-3xl" },
  md: { owl: "h-20 w-20", text: "text-5xl" },
};

/**
 * Nápis je plnou barvou, ne gradientem. Dřív se kreslil přes
 * `-webkit-background-clip: text` + `-webkit-text-fill-color: transparent`
 * BEZ `color` fallbacku — jakmile se nestihl načíst font nebo prohlížeč
 * background-clip nepodpořil, nápis „Oli" **zmizel úplně** (průhledný text
 * nad průhledným pozadím). Značka se nesmí spoléhat na nepovinnou vlastnost.
 *
 * Tmavě oranžová `#9A3412` drží vazbu na sovu a přitom splňuje kontrast —
 * značková `#F97316` má na bílé jen 2,3:1 a jako text by byla nečitelná.
 */
export function OliLogo({ size = "md", variant = "text", tone = "ink", onClick }: OliLogoProps) {
  const s = SIZE[size];
  const content = (
    <>
      <img src={owlSrc} alt="" className={`${s.owl} object-contain`} />
      {variant === "text" && (
        <span
          className={cn(
            s.text,
            "font-extrabold leading-none select-none tracking-tight",
            tone === "inverse" ? "text-white" : "text-[#9A3412]",
          )}
        >
          Oli
        </span>
      )}
    </>
  );

  // Bez `onClick` je logo dekorace, ne ovládací prvek — <button>, který nic
  // nedělá, čte odečítač obrazovky jako klikatelný a mate klávesovou navigaci.
  if (!onClick) {
    return (
      <span className="flex items-center gap-1.5" aria-label="Oli">
        {content}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-md transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="Oli – zpět na úvod"
    >
      {content}
    </button>
  );
}
