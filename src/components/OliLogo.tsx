import owlSrc from "@/assets/oli-owl.png";
import { cn } from "@/lib/utils";

export { owlSrc as logoNoText };

interface OliLogoProps {
  size?: "xs" | "sm" | "md";
  variant?: "text" | "notext";
  /**
   * Barevná varianta nápisu:
   *  - `ink` (default) — značková oranžová na světlém podkladu
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
 * Barva byla do 2026-09-01 značková oranžová `#F97316`, protože se shodovala
 * s tehdejší sovou. Po výměně kresby už neplatí: v nové sově se `#F97316`
 * nevyskytuje vůbec (změřeno — peří je `#C07848` a `#A86030`, obličej krémový,
 * brýle černé, knihy `#1890A8`), takže nápis vedle ní vyčníval jako cizí prvek.
 *
 * Nově `#1E293B` — tmavá barva brýlí, tedy nejvýraznějšího prvku kresby.
 * Na bílé měří **14,6:1** (oranžová měla 2,3:1), takže je to jediná varianta,
 * která projde WCAG AAA.
 *
 * Pozn.: brýle v kresbě jsou ve skutečnosti čistě černé (`#000000`, změřeno).
 * `#1E293B` je o stupeň měkčí a vedle teplé kresby nepůsobí tak tvrdě jako
 * plná čerň; čte se ale jako táž barva. Teplá alternativa, kdyby se to
 * revidovalo: `#9A3412` (7,38:1), leží v téže řadě jako peří `#A86030`.
 *
 * Pozor: `--primary` zůstává `#F97316` (tlačítka, odkazy) — logo se od ní
 * záměrně odchyluje, protože sousedí s kresbou, kdežto tlačítka ne.
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
            tone === "inverse" ? "text-white" : "text-[#1E293B]",
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
