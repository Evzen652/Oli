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
    case "grid":
      return <Grid visual={visual} className={className} />;
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

/** Porovnání s tolerancí — krok 0,1 dává v plovoucí čárce 3,1 + 0,1 ≠ 3,2. */
const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;

/** Český zápis čísla na ose: typografické mínus, desetinná čárka. */
function formatOsa(v: number): string {
  const r = Math.round(v * 1e6) / 1e6;
  const abs = String(Math.abs(r)).replace(".", ",");
  return r < 0 ? `−${abs}` : abs;
}

/**
 * Číselná osa s dílky. Vypisuje jen čísla z `labeled` — u „hned za 68" je
 * to jen 68, jinak by osa odpověď rovnou ukázala. Hledané místo nese
 * otazník, výchozí číslo ze zadání tečku, `range` zvýrazní úsek (u „které
 * číslo leží mezi −16 a −7" by otazník na jednom dílku prozradil odpověď).
 *
 * Delší osa (až 20 dílků) se ve viewBoxu roztáhne, takže by se písmo
 * při zmenšení do karty ztratilo — popisky se proto zvětšují úměrně (`u`).
 */
function NumberLine({ visual, className }: { visual: Of<"number_line">; className: string }) {
  const { from, to, step, labeled, unknown, highlight, range } = visual;
  if (!(step > 0) || to <= from) return null;
  const n = Math.round((to - from) / step);
  if (n < 1 || n > 20 || !same(from + n * step, to)) return null;
  if (unknown !== undefined && labeled.some((l) => same(l, unknown))) return null;

  const W = n * TICK + 60;
  const u = Math.max(1, W / 600);
  const x = (v: number) => 30 + ((v - from) / step) * TICK;
  const axisY = 34 * u;
  const values = Array.from({ length: n + 1 }, (_, i) => Math.round((from + i * step) * 1e6) / 1e6);
  const font = { fontSize: 20 * u, fontWeight: 700 };

  return (
    <svg
      role="img"
      aria-label={unknown !== undefined
        ? "Číselná osa. Hledané číslo je na ose označené otazníkem."
        : "Číselná osa se zvýrazněným úsekem."}
      viewBox={`0 0 ${W} ${84 * u}`}
      className={`w-full max-w-xl h-auto ${className}`}
    >
      <line x1={8} x2={W - 12} y1={axisY} y2={axisY} className="stroke-foreground" strokeWidth={2.5 * u} />
      <polygon points={`${W - 4},${axisY} ${W - 4 - 12 * u},${axisY - 7 * u} ${W - 4 - 12 * u},${axisY + 7 * u}`}
        className="fill-foreground" />
      {range && (
        <line x1={x(range[0])} x2={x(range[1])} y1={axisY} y2={axisY}
          className="stroke-primary" strokeWidth={8 * u} strokeLinecap="round" />
      )}
      {values.map((v) => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={axisY - 10 * u} y2={axisY + 10 * u} className="stroke-foreground" strokeWidth={2 * u} />
          {labeled.some((l) => same(l, v)) && (
            <text x={x(v)} y={axisY + 34 * u} textAnchor="middle" className="fill-foreground" style={font}>
              {formatOsa(v)}
            </text>
          )}
          {unknown !== undefined && same(v, unknown) && (
            <g>
              <circle cx={x(v)} cy={axisY + 27 * u} r={15 * u} className="fill-sky-100 stroke-sky-500" strokeWidth={2 * u} />
              <text x={x(v)} y={axisY + 34 * u} textAnchor="middle" className="fill-sky-700"
                style={{ ...font, fontWeight: 800 }}>?</text>
            </g>
          )}
          {highlight !== undefined && same(v, highlight) && (
            <circle cx={x(v)} cy={axisY} r={7 * u} className="fill-primary" />
          )}
        </g>
      ))}
    </svg>
  );
}

// ── Čtvercová síť ────────────────────────────────────────────────────────────

/** Velikost políčka ve viewBoxu. */
const CELL = 32;

/**
 * Čtvercová síť s počátkem vlevo dole (jako v učebnici i v zadání „políček
 * vpravo a nahoru od levého dolního rohu"). Kreslí jen ZADANÉ prvky — body,
 * osy, střed, vybarvené obdélníky. Hledaný bod ani osa na obrázku nejsou.
 */
function Grid({ visual, className }: { visual: Of<"grid">; className: string }) {
  const { cols, rows, fills = [], points = [], axes = [], center, numbered } = visual;
  if (![cols, rows].every((n) => Number.isInteger(n) && n >= 1 && n <= 16)) return null;
  const inside = (x: number, y: number) => x >= 0 && x <= cols && y >= 0 && y <= rows;
  if (!points.every((b) => inside(b.x, b.y)) || (center && !inside(center.x, center.y))) return null;

  // Síť 12 × 12 se na mobilu zmenší asi na 70 %: písmo 17 dá ~12 px.
  const left = numbered ? 36 : 8, bottom = numbered ? 30 : 8, top = 16, right = 16;
  const W = left + cols * CELL + right, H = top + rows * CELL + bottom;
  const X = (x: number) => left + x * CELL;
  const Y = (y: number) => top + (rows - y) * CELL;
  const num = { fontSize: 17, fontWeight: 600 };
  const lbl = { fontSize: 20, fontWeight: 800 };

  return (
    <svg
      role="img"
      aria-label="Čtvercová síť se zadanými body a osami."
      viewBox={`0 0 ${W} ${H}`}
      className={`w-full max-w-md h-auto ${className}`}
    >
      {fills.map(([x, y, w, h], i) => (
        <rect key={`f${i}`} x={X(x)} y={Y(y + h)} width={w * CELL} height={h * CELL} className="fill-primary/70" />
      ))}
      {Array.from({ length: cols + 1 }, (_, i) => (
        <line key={`v${i}`} x1={X(i)} x2={X(i)} y1={Y(0)} y2={Y(rows)} className="stroke-muted-foreground/40" strokeWidth={1} />
      ))}
      {Array.from({ length: rows + 1 }, (_, j) => (
        <line key={`h${j}`} x1={X(0)} x2={X(cols)} y1={Y(j)} y2={Y(j)} className="stroke-muted-foreground/40" strokeWidth={1} />
      ))}
      {numbered && Array.from({ length: cols + 1 }, (_, i) => (
        <text key={`nx${i}`} x={X(i)} y={Y(0) + 22} textAnchor="middle" className="fill-muted-foreground" style={num}>{i}</text>
      ))}
      {numbered && Array.from({ length: rows + 1 }, (_, j) => (
        <text key={`ny${j}`} x={X(0) - 8} y={Y(j) + 6} textAnchor="end" className="fill-muted-foreground" style={num}>{j}</text>
      ))}
      {axes.map((a, i) => a.dir === "vertical"
        ? <line key={`a${i}`} x1={X(a.at)} x2={X(a.at)} y1={Y(0) + 6} y2={Y(rows) - 6} className="stroke-sky-600" strokeWidth={3} strokeDasharray="10 6" />
        : <line key={`a${i}`} x1={X(0) - 6} x2={X(cols) + 6} y1={Y(a.at)} y2={Y(a.at)} className="stroke-sky-600" strokeWidth={3} strokeDasharray="10 6" />)}
      {center && (
        <g>
          <circle cx={X(center.x)} cy={Y(center.y)} r={6} className="fill-sky-600" />
          <text x={X(center.x) + 9} y={Y(center.y) - 8} className="fill-sky-700" style={lbl}>S</text>
        </g>
      )}
      {points.map((b, i) => (
        <g key={`p${i}`}>
          <circle cx={X(b.x)} cy={Y(b.y)} r={6} className="fill-primary stroke-background" strokeWidth={2} />
          {b.label && <text x={X(b.x) + 9} y={Y(b.y) - 8} className="fill-foreground" style={lbl}>{b.label}</text>}
        </g>
      ))}
    </svg>
  );
}
