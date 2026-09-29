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
    case "clock":
      return <Clock visual={visual} className={className} />;
    case "thermometer":
      return <Thermometer visual={visual} className={className} />;
    case "shape":
      return <Shape visual={visual} className={className} />;
    case "protractor":
      return <Protractor visual={visual} className={className} />;
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

// ── Hodiny ───────────────────────────────────────────────────────────────────

/**
 * Ciferník s ručičkami. Malá ručička stojí i mezi čísly (u „půl" v půlce
 * cesty), jak to na skutečných hodinách vypadá a jak to zadání popisuje —
 * právě na tom děti chybují („je mezi 7 a 8, tak je 8").
 */
function Clock({ visual, className }: { visual: Of<"clock">; className: string }) {
  const { hour, minute } = visual;
  if (!(hour >= 1 && hour <= 12 && minute >= 0 && minute < 60)) return null;
  const C = 100, R = 88;
  const at = (deg: number, r: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [C + r * Math.cos(a), C + r * Math.sin(a)];
  };
  const [hx, hy] = at(((hour % 12) + minute / 60) * 30, 46);
  const [mx, my] = at(minute * 6, 70);

  return (
    <svg role="img" aria-label="Hodiny s ciferníkem a dvěma ručičkami." viewBox="0 0 200 200"
      className={`w-full max-w-[220px] h-auto ${className}`}>
      <circle cx={C} cy={C} r={R + 6} className="fill-card stroke-foreground" strokeWidth={4} />
      {Array.from({ length: 60 }, (_, i) => {
        const [x1, y1] = at(i * 6, R);
        const [x2, y2] = at(i * 6, i % 5 === 0 ? R - 9 : R - 4);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-foreground" strokeWidth={i % 5 === 0 ? 2.5 : 1} />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = at((i + 1) * 30, R - 22);
        return <text key={i} x={x} y={y + 6} textAnchor="middle" className="fill-foreground" style={{ fontSize: 17, fontWeight: 700 }}>{i + 1}</text>;
      })}
      <line x1={C} y1={C} x2={hx} y2={hy} className="stroke-primary" strokeWidth={7} strokeLinecap="round" />
      <line x1={C} y1={C} x2={mx} y2={my} className="stroke-sky-600" strokeWidth={4} strokeLinecap="round" />
      <circle cx={C} cy={C} r={5} className="fill-foreground" />
    </svg>
  );
}

// ── Teploměr ─────────────────────────────────────────────────────────────────

/**
 * Svislý teploměr, stupnice vždy obsahuje nulu (o tu v úlohách jde). Jedna
 * zadaná teplota = sloupec rtuti; dvě = dvě značky, protože u rozdílu přes
 * nulu jde o oba údaje a sloupec by ukázal jen jeden. Výsledek na obrázku
 * nikdy není.
 */
function Thermometer({ visual, className }: { visual: Of<"thermometer">; className: string }) {
  const { readings } = visual;
  if (readings.length < 1 || readings.length > 2 || !readings.every(Number.isFinite)) return null;
  const lo = Math.min(0, ...readings), hi = Math.max(0, ...readings);
  const min = Math.floor((lo - 3) / 5) * 5, max = Math.ceil((hi + 3) / 5) * 5;
  const span = max - min;
  if (span > 80) return null;
  const labelStep = span > 40 ? 10 : 5;
  const top = 20, H = 300, tubeX = 70, W = 190;
  const Y = (t: number) => top + ((max - t) / span) * H;
  const bulbY = top + H + 22;
  const font = { fontSize: 15, fontWeight: 700 };
  const cz = (t: number) => (t < 0 ? `−${-t}` : String(t));

  return (
    <svg role="img" aria-label="Teploměr se stupnicí ve stupních Celsia, vyznačená je teplota ze zadání."
      viewBox={`0 0 ${W} ${bulbY + 26}`} className={`w-full max-w-[170px] h-auto ${className}`}>
      <rect x={tubeX - 9} y={top - 10} width={18} height={bulbY - top + 10} rx={9} className="fill-card stroke-foreground" strokeWidth={2.5} />
      <circle cx={tubeX} cy={bulbY} r={17} className="fill-red-500 stroke-foreground" strokeWidth={2.5} />
      {readings.length === 1 && (
        <rect x={tubeX - 5} y={Y(readings[0])} width={10} height={bulbY - Y(readings[0])} className="fill-red-500" />
      )}
      {Array.from({ length: span + 1 }, (_, i) => {
        const t = min + i, big = t % labelStep === 0;
        return (
          <g key={t}>
            <line x1={tubeX + 11} x2={tubeX + (big ? 26 : t % 5 === 0 ? 21 : 17)} y1={Y(t)} y2={Y(t)}
              className="stroke-foreground" strokeWidth={t === 0 ? 3 : big ? 2 : 1} />
            {big && <text x={tubeX + 32} y={Y(t) + 5} className="fill-foreground" style={t === 0 ? { ...font, fontWeight: 900 } : font}>{cz(t)}</text>}
          </g>
        );
      })}
      {/* Jednotka vlevo nahoře: vpravo by se srazila s popiskem stupnice. Značky
          teplot jsou vlevo taky, ale nejvýš 3 °C pod vrcholem stupnice. */}
      <text x={tubeX - 16} y={top + 5} textAnchor="end" className="fill-muted-foreground" style={{ fontSize: 13, fontWeight: 700 }}>°C</text>
      {readings.length === 2 && readings.map((t, i) => (
        <g key={i}>
          <polygon points={`${tubeX - 12},${Y(t)} ${tubeX - 26},${Y(t) - 7} ${tubeX - 26},${Y(t) + 7}`} className="fill-sky-600" />
          <text x={tubeX - 30} y={Y(t) + 5} textAnchor="end" className="fill-sky-700" style={font}>{cz(t)}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Útvar s popsanými stranami ───────────────────────────────────────────────

/**
 * Obdélník, čtverec, trojúhelník nebo kvádr v poměru skutečných délek,
 * s popisky stran ze zadání. Kreslí se jen útvar ZADANÝ celými stranami:
 * u obrácených úloh („obvod je 30, jedna strana 5, kolik je druhá?") by
 * poměr stran prozradil odpověď, tam obrázek generátor nedává.
 *
 * Trojúhelník se dopočítá ze tří stran (kosinová věta). Značky stejných
 * stran schválně nekreslí — u „Jaký je podle stran?" by byly nápovědou.
 */
function Shape({ visual, className }: { visual: Of<"shape">; className: string }) {
  const { shape, sides, labels } = visual;
  const need = { rectangle: 2, square: 1, triangle: 3, cuboid: 3 }[shape];
  if (sides.length !== need || labels.length !== need || !sides.every((x) => x > 0 && Number.isFinite(x))) return null;

  const font = { fontSize: 17, fontWeight: 700 };
  const stroke = "stroke-foreground";
  const fill = "fill-primary/15";
  const PAD = 44, MAXW = 260, MAXH = 170;
  let body: JSX.Element;
  let W: number, H: number;
  let shiftX = 0;

  if (shape === "rectangle" || shape === "square") {
    const [a, b] = shape === "square" ? [sides[0], sides[0]] : sides;
    // Poměr se omezí, ať z tenkého obdélníku (20 × 2) nezbude čára.
    const k = Math.min(MAXW / a, MAXH / b);
    const w = a * k, h = Math.max(b * k, Math.min(w, MAXH) * 0.18);
    W = w + 2 * PAD; H = h + 2 * PAD;
    const x0 = PAD, y0 = PAD;
    body = (
      <g>
        <rect x={x0} y={y0} width={w} height={h} className={`${fill} ${stroke}`} strokeWidth={3} />
        <text x={x0 + w / 2} y={y0 + h + 26} textAnchor="middle" className="fill-foreground" style={font}>{labels[0]}</text>
        {shape === "rectangle" && (
          <text x={x0 + w + 10} y={y0 + h / 2 + 6} className="fill-foreground" style={font}>{labels[1]}</text>
        )}
      </g>
    );
    if (shape === "rectangle") W += 30;
  } else if (shape === "triangle") {
    const [c, b, a] = sides; // základna, levá, pravá
    if (!(a + b > c && a + c > b && b + c > a)) return null;
    const cx = (c * c + b * b - a * a) / (2 * c);
    const cy = Math.sqrt(Math.max(0, b * b - cx * cx));
    const minX = Math.min(0, cx), maxX = Math.max(c, cx);
    const k = Math.min(MAXW / (maxX - minX), MAXH / cy);
    const P = (x: number, y: number) => [PAD + (x - minX) * k, PAD + (cy - y) * k] as const;
    const A = P(0, 0), B = P(c, 0), C = P(cx, cy);
    W = (maxX - minX) * k + 2 * PAD; H = cy * k + 2 * PAD;
    const mid = (p: readonly number[], q: readonly number[]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const [lx, ly] = mid(A, C), [rx, ry] = mid(B, C);
    // Boční popisky u šikmých stran se do pevného okraje nevejdou vždy
    // (naměřeno 16 z 295 trojúhelníků). Rámec se proto rozšíří o odhadnutou
    // šířku popisků (≈ 0,6 × velikost písma na znak).
    const tw = (t: string) => t.length * font.fontSize * 0.6;
    shiftX = Math.max(0, tw(labels[1]) + 16 - lx);
    W = Math.max(W, rx + 10 + tw(labels[2]) + 6) + shiftX;
    body = (
      <g>
        <polygon points={`${A} ${B} ${C}`} className={`${fill} ${stroke}`} strokeWidth={3} strokeLinejoin="round" />
        <text x={(A[0] + B[0]) / 2} y={A[1] + 26} textAnchor="middle" className="fill-foreground" style={font}>{labels[0]}</text>
        <text x={lx - 10} y={ly} textAnchor="end" className="fill-foreground" style={font}>{labels[1]}</text>
        <text x={rx + 10} y={ry} className="fill-foreground" style={font}>{labels[2]}</text>
      </g>
    );
  } else {
    const [a, d, v] = sides; // délka, hloubka, výška
    const k = Math.min(MAXW / (a + d * 0.5), MAXH / (v + d * 0.5));
    const w = a * k, h = v * k, dx = d * k * 0.5, dy = d * k * 0.5;
    W = w + dx + 2 * PAD + 20; H = h + dy + 2 * PAD;
    const x0 = PAD, y0 = PAD + dy;
    const front = `${x0},${y0} ${x0 + w},${y0} ${x0 + w},${y0 + h} ${x0},${y0 + h}`;
    const top = `${x0},${y0} ${x0 + dx},${y0 - dy} ${x0 + w + dx},${y0 - dy} ${x0 + w},${y0}`;
    const side = `${x0 + w},${y0} ${x0 + w + dx},${y0 - dy} ${x0 + w + dx},${y0 + h - dy} ${x0 + w},${y0 + h}`;
    body = (
      <g strokeLinejoin="round">
        <line x1={x0} y1={y0 + h} x2={x0 + dx} y2={y0 + h - dy} className={stroke} strokeWidth={1.5} strokeDasharray="5 4" />
        <line x1={x0 + dx} y1={y0 + h - dy} x2={x0 + dx} y2={y0 - dy} className={stroke} strokeWidth={1.5} strokeDasharray="5 4" />
        <line x1={x0 + dx} y1={y0 + h - dy} x2={x0 + w + dx} y2={y0 + h - dy} className={stroke} strokeWidth={1.5} strokeDasharray="5 4" />
        <polygon points={front} className={`${fill} ${stroke}`} strokeWidth={3} />
        <polygon points={top} className={`fill-primary/25 ${stroke}`} strokeWidth={3} />
        <polygon points={side} className={`fill-primary/35 ${stroke}`} strokeWidth={3} />
        <text x={x0 + w / 2} y={y0 + h + 26} textAnchor="middle" className="fill-foreground" style={font}>{labels[0]}</text>
        <text x={x0 + w + dx / 2 + 8} y={y0 + h - dy / 2 + 18} className="fill-foreground" style={font}>{labels[1]}</text>
        <text x={x0 + w + dx + 8} y={y0 + h / 2 - dy / 2 + 6} className="fill-foreground" style={font}>{labels[2]}</text>
      </g>
    );
  }

  return (
    <svg role="img" aria-label="Útvar s popsanými délkami stran ze zadání." viewBox={`0 0 ${Math.ceil(W)} ${Math.ceil(H)}`}
      className={`w-full max-w-sm h-auto ${className}`}>
      <g transform={`translate(${shiftX} 0)`}>{body}</g>
    </svg>
  );
}

// ── Úhloměr ──────────────────────────────────────────────────────────────────

/**
 * Úhloměr se dvěma stupnicemi, které běží proti sobě (vnitřní má nulu
 * vpravo, vnější vlevo), a úhel s rameny ze zadání. Přesně to, na čem se
 * chybuje: čte se na té stupnici, která má u prvního ramene nulu. Obě
 * čísla u druhého ramene uvádí už zadání, obrázek tedy nic navíc neprozradí.
 */
function Protractor({ visual, className }: { visual: Of<"protractor">; className: string }) {
  const { arms, names } = visual;
  if (!arms.every((a) => a >= 0 && a <= 180)) return null;
  // Okraj 60 po stranách: písmeno ramene ležícího na základně je až o R + 36 od středu.
  const C = { x: 240, y: 215 }, R = 180;
  const at = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return [C.x + r * Math.cos(a), C.y - r * Math.sin(a)] as const;
  };
  const num = { fontSize: 13, fontWeight: 600 };
  const ticks = [];
  for (let d = 0; d <= 180; d += 5) {
    const [x1, y1] = at(d, R), [x2, y2] = at(d, d % 10 === 0 ? R - 14 : R - 8);
    ticks.push(<line key={`t${d}`} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-foreground" strokeWidth={d % 10 === 0 ? 1.8 : 1} />);
    if (d % 10 === 0) {
      const [ox, oy] = at(d, R - 26), [ix, iy] = at(d, R - 48);
      // Čísla na základně (0 a 180) zvednout nad ni — leží tam rameno a přes
      // nulu, na kterou se úloha ptá, by vedla čára.
      const up = d % 180 === 0 ? -10 : 4;
      ticks.push(<text key={`o${d}`} x={ox} y={oy + up} textAnchor="middle" className="fill-foreground" style={num}>{180 - d}</text>);
      ticks.push(<text key={`i${d}`} x={ix} y={iy + up} textAnchor="middle" className="fill-sky-700" style={num}>{d}</text>);
    }
  }
  const [a1, a2] = arms;
  const end = (deg: number) => at(deg, R + 22);
  const lbl = (deg: number) => at(deg, R + 36);
  const big = { fontSize: 18, fontWeight: 800 };

  return (
    <svg role="img" aria-label="Úhloměr s vnější a vnitřní stupnicí a úhel se dvěma rameny." viewBox="0 0 480 250"
      className={`w-full max-w-md h-auto ${className}`}>
      <path d={`M ${C.x - R} ${C.y} A ${R} ${R} 0 0 1 ${C.x + R} ${C.y} Z`} className="fill-amber-50 stroke-amber-400" strokeWidth={2} />
      <path d={`M ${C.x - R + 62} ${C.y} A ${R - 62} ${R - 62} 0 0 1 ${C.x + R - 62} ${C.y}`} className="fill-none stroke-amber-300" strokeWidth={1} />
      {ticks}
      {[a1, a2].map((deg, i) => {
        const [x, y] = end(deg), [lx, ly] = lbl(deg);
        return (
          <g key={i}>
            <line x1={C.x} y1={C.y} x2={x} y2={y} className="stroke-primary" strokeWidth={3.5} strokeLinecap="round" />
            <text x={lx} y={ly + 6} textAnchor="middle" className="fill-foreground" style={big}>{names[i + 1]}</text>
          </g>
        );
      })}
      <circle cx={C.x} cy={C.y} r={4.5} className="fill-foreground" />
      <text x={C.x} y={C.y + 26} textAnchor="middle" className="fill-foreground" style={big}>{names[0]}</text>
    </svg>
  );
}
