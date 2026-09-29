import type { TaskVisual as TaskVisualData } from "@/lib/types";
import { phrase } from "@/lib/czechGrammar";

type Of<K extends TaskVisualData["kind"]> = Extract<TaskVisualData, { kind: K }>;

/**
 * Obrázek k úloze (`PracticeTask.visual`) — nahrazuje slovní popis
 * („úsečka na pravítku sahá od 0 do 16", „obdélník rozdělený na 4 díly")
 * tím, co dítě vidí v učebnici. Generátor vkládá jen čísla, která už má.
 *
 * Společné pravidlo všech druhů: obrázek NESMÍ nést odpověď. Proužek nemá
 * popisek zlomku, pravítko nepíše délku úsečky, osa má na hledaném místě
 * otazník.
 */
export function TaskVisual({ visual, className = "" }: { visual: TaskVisualData; className?: string }) {
  switch (visual.kind) {
    case "fraction_bar":
      return <FractionBar visual={visual} className={className} />;
    case "ruler":
      return <Ruler visual={visual} className={className} />;
    case "number_line":
      return <NumberLine visual={visual} className={className} />;
    default:
      return null;
  }
}

// ── Proužek zlomku ───────────────────────────────────────────────────────────

/**
 * Barvy skupin zleva: 1. skupina, 2. skupina (u sčítání druhý sčítanec).
 * Druhá musí být jiný ODSTÍN, ne tmavší oranžová (`bg-warning` byla od
 * `bg-primary` na tabletu k nerozeznání), a ne zelená — ta v appce znamená
 * „správně".
 */
const GROUP_COLORS = ["bg-primary", "bg-sky-500"];

/**
 * Proužek má PEVNOU celkovou šířku a díly se dělí rovným dílem.
 * `FractionBarVisual` z nápovědy kreslí díly pevné šířky, takže 1/2 tam je
 * kratší proužek než 1/10 — u porovnání zlomků by obrázek tvrdil opak pravdy.
 */
function FractionBar({ visual, className }: { visual: Of<"fraction_bar">; className: string }) {
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

// ── Pravítko ─────────────────────────────────────────────────────────────────

/** Šířka jednoho centimetru ve viewBoxu; SVG se pak škáluje do šířky karty. */
const CM = 40;
const PAD = 16;

/**
 * Pravítko s centimetry (čísla), půlcentimetry a milimetry (čárky) a nad ním
 * úsečka. Délka úsečky se nepíše — tu má dítě přečíst. Milimetrové čárky
 * jsou tu schválně: zpětná vazba k chybě „16 mm" vysvětluje právě je.
 * Čárky a čísla mají pevnou tmavou barvu, ne `foreground`: pravítko je
 * předmět se světlým tělem a v tmavém tématu by čísla na něm zmizela.
 */
function Ruler({ visual, className }: { visual: Of<"ruler">; className: string }) {
  const { from, to, length } = visual;
  if (!Number.isInteger(length) || length < 2 || length > 30) return null;
  if (!(from >= 0 && to > from && to <= length)) return null;

  const x = (cm: number) => PAD + cm * CM;
  const W = length * CM + 2 * PAD;
  // Písmo 26 při 40 jednotkách na cm: na mobilu (pravítko 18 cm v ~300 px)
  // vyjde ~12 px; se 17 to bylo 10 px, na druháka málo. Dvouciferné číslo
  // se do centimetru pořád vejde.
  const segY = 14, bodyY = 30, bodyH = 68;

  const ticks = [];
  for (let mm = 0; mm <= length * 10; mm++) {
    const h = mm % 10 === 0 ? 22 : mm % 5 === 0 ? 15 : 9;
    ticks.push(
      <line key={mm} x1={x(mm / 10)} x2={x(mm / 10)} y1={bodyY} y2={bodyY + h}
        className="stroke-stone-800" strokeWidth={mm % 10 === 0 ? 2 : 1} />,
    );
  }

  return (
    <svg
      role="img"
      aria-label={`Pravítko v centimetrech od 0 do ${length}, nad ním je vyznačená úsečka.`}
      viewBox={`0 0 ${W} ${bodyY + bodyH + 4}`}
      className={`w-full max-w-xl h-auto ${className}`}
    >
      <rect x={PAD / 2} y={bodyY} width={W - PAD} height={bodyH} rx={6}
        className="fill-amber-100 stroke-amber-400" strokeWidth={2} />
      {ticks}
      {Array.from({ length: length + 1 }, (_, cm) => (
        <text key={cm} x={x(cm)} y={bodyY + 55} textAnchor="middle"
          className="fill-stone-900" style={{ fontSize: 26, fontWeight: 700 }}>
          {cm}
        </text>
      ))}
      <line x1={x(from)} x2={x(to)} y1={segY} y2={segY}
        className="stroke-primary" strokeWidth={6} strokeLinecap="round" />
      {[from, to].map((cm) => (
        <line key={cm} x1={x(cm)} x2={x(cm)} y1={segY - 9} y2={bodyY}
          className="stroke-primary" strokeWidth={2.5} />
      ))}
    </svg>
  );
}

// ── Číselná osa ──────────────────────────────────────────────────────────────

/** Rozestup dílků ve viewBoxu. */
const TICK = 64;

/**
 * Číselná osa s dílky. Vypisuje jen čísla z `labeled` — u „hned za 68" je
 * to jen 68, jinak by osa odpověď rovnou ukázala. Hledané místo nese
 * otazník, výchozí číslo ze zadání tečku.
 */
function NumberLine({ visual, className }: { visual: Of<"number_line">; className: string }) {
  const { from, to, step, labeled, unknown, highlight } = visual;
  if (!(step > 0) || to <= from) return null;
  const n = Math.round((to - from) / step);
  if (n < 1 || n > 12 || from + n * step !== to) return null;
  if (unknown !== undefined && labeled.includes(unknown)) return null;

  const x = (v: number) => 30 + ((v - from) / step) * TICK;
  const W = n * TICK + 60;
  const axisY = 34;
  const values = Array.from({ length: n + 1 }, (_, i) => from + i * step);

  return (
    <svg
      role="img"
      aria-label="Číselná osa. Hledané číslo je na ose označené otazníkem."
      viewBox={`0 0 ${W} 84`}
      className={`w-full max-w-xl h-auto ${className}`}
    >
      <line x1={8} x2={W - 12} y1={axisY} y2={axisY} className="stroke-foreground" strokeWidth={2.5} />
      <polygon points={`${W - 4},${axisY} ${W - 16},${axisY - 7} ${W - 16},${axisY + 7}`} className="fill-foreground" />
      {values.map((v) => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={axisY - 10} y2={axisY + 10} className="stroke-foreground" strokeWidth={2} />
          {labeled.includes(v) && (
            <text x={x(v)} y={axisY + 34} textAnchor="middle" className="fill-foreground"
              style={{ fontSize: 20, fontWeight: 700 }}>{v}</text>
          )}
          {v === unknown && (
            <g>
              <circle cx={x(v)} cy={axisY + 27} r={15} className="fill-sky-100 stroke-sky-500" strokeWidth={2} />
              <text x={x(v)} y={axisY + 34} textAnchor="middle" className="fill-sky-700"
                style={{ fontSize: 20, fontWeight: 800 }}>?</text>
            </g>
          )}
          {v === highlight && <circle cx={x(v)} cy={axisY} r={7} className="fill-primary" />}
        </g>
      ))}
    </svg>
  );
}
