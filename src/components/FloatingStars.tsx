/**
 * Plovoucí hvězdičky — dekorace hlavní karty.
 *
 * Sdílená komponenta, protože se používá na dětské i rodičovské straně a jsou
 * to tytéž dráhy (`oli-star-1..4` v `index.css`). Duplikovat šest absolutně
 * pozicovaných spanů na dvou místech by znamenalo, že se po první úpravě
 * rozejdou.
 *
 * Původně byly bílé na oranžovém heru. Po sjednocení karet do bílé musely
 * dostat barvu — jsou to dekorace, takže tlumený tint značky, ne plná barva.
 * `aria-hidden` + `pointer-events-none`: pro odečítač i myš neexistují.
 */
export function FloatingStars() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      <span className="absolute top-5 right-20 text-primary/40 text-3xl" style={{ animation: "oli-star-1 18s ease-in-out infinite" }}>✦</span>
      <span className="absolute top-8 right-7 text-primary/35 text-xl" style={{ animation: "oli-star-2 22s ease-in-out infinite", animationDelay: "-7s" }}>+</span>
      <span className="absolute top-1/2 right-12 text-primary/30 text-lg" style={{ animation: "oli-star-3 15s ease-in-out infinite", animationDelay: "-3s" }}>✦</span>
      <span className="absolute bottom-6 right-24 text-primary/40 text-2xl" style={{ animation: "oli-star-4 20s ease-in-out infinite", animationDelay: "-11s" }}>✦</span>
      <span className="absolute bottom-5 left-1/2 text-primary/30 text-base" style={{ animation: "oli-star-2 17s ease-in-out infinite", animationDelay: "-5s" }}>+</span>
      <span className="absolute top-3 left-1/3 text-primary/30 text-sm" style={{ animation: "oli-star-1 25s ease-in-out infinite", animationDelay: "-14s" }}>✦</span>
    </div>
  );
}
