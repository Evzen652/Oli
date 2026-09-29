import type { TaskVisual as TaskVisualData } from "@/lib/types";
import { phrase } from "@/lib/czechGrammar";

/**
 * Barvy skupin zleva: 1. skupina, 2. skupina (u sčítání druhý sčítanec).
 * Druhá musí být jiný ODSTÍN, ne tmavší oranžová (`bg-warning` byla od
 * `bg-primary` na tabletu k nerozeznání), a ne zelená — ta v appce znamená
 * „správně".
 */
const GROUP_COLORS = ["bg-primary", "bg-sky-500"];

/**
 * Obrázek k úloze (`PracticeTask.visual`) — nahrazuje slovní popis
 * „obdélník rozdělený na 4 díly" tím, co dítě v učebnici vidí.
 *
 * Proužek zlomku má PEVNOU celkovou šířku a díly se dělí rovným dílem.
 * `FractionBarVisual` z nápovědy kreslí díly pevné šířky, takže 1/2 tam je
 * kratší proužek než 1/10 — u porovnání zlomků by obrázek tvrdil opak pravdy.
 *
 * Záměrně BEZ popisků (žádné „3/5" ani „3 z 5"): úloha se často ptá právě
 * na ten zlomek a popisek by prozradil odpověď.
 */
export function TaskVisual({ visual, className = "" }: { visual: TaskVisualData; className?: string }) {
  if (visual.kind !== "fraction_bar") return null;
  const { parts, groups } = visual;
  if (!Number.isInteger(parts) || parts < 1 || parts > 24) return null;

  const colorOf: (string | null)[] = [];
  groups.forEach((count, g) => {
    for (let i = 0; i < count; i++) colorOf.push(GROUP_COLORS[g % GROUP_COLORS.length]);
  });
  const filled = colorOf.length;
  if (filled > parts) return null;

  // „zabarveno 3 díly" by byla chybná shoda (3 díly JSOU zabarveny, 5 dílů
  // JE zabarveno) — formulace s dvojtečkou se shodě vyhne.
  const label = `Celek rozdělený na ${phrase(parts, "STEJNÝ", "DÍL")}. Počet zabarvených dílů: ${filled}.`;

  return (
    <div role="img" aria-label={label} className={`flex h-12 w-full max-w-md gap-1 ${className}`}>
      {Array.from({ length: parts }, (_, i) => (
        <div
          key={i}
          className={`flex-1 rounded-md border-2 ${
            colorOf[i] ? `${colorOf[i]} border-foreground/20` : "bg-muted border-muted-foreground/40"
          }`}
        />
      ))}
    </div>
  );
}
