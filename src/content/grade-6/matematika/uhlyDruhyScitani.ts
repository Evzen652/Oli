/**
 * Matematika 6. ročník — Druhy úhlů, sčítání a odčítání úhlů.
 *
 * Stavba podle výpočetního vzoru `../fyzika/mereniDelky.ts`, helpery jen
 * z `./_shared.ts`. Téma emituje výhradně select_one: výsledek „47° 30′“ nejde
 * zadat do číselného pole, jako možnost ho vybrat lze.
 *
 *  • L1 — rozcvička: druh úhlu podle velikosti, převod stupně ↔ minuty,
 *    sčítání bez převodu minut. Znění „Jaký je to úhel…“, „Kolik minut…“,
 *    „Zapiš úhel…“, „Sečti úhly…“.
 *  • L2 — převod přes 60: sčítání s přenosem, odčítání s výpůjčkou, doplněk
 *    do 90° a do 180°. Znění „Vypočítej…“, „Kolik stupňů a minut chybí…“.
 *  • L3 — dva kroky a přenos: druh součtu těsně u hranice, třetí úhel do
 *    přímého úhlu, rozdíl od pravého úhlu zvětšeného o úhel, inverze.
 *
 * Každý úhel se v programu drží v CELÝCH MINUTÁCH (47° 30′ = 2 850). Každý
 * distraktor je výsledek konkrétní chyby spočítaný z týchž čísel: minuty jako
 * setiny (přenos/výpůjčka po 100), převedený stupeň se nepromítl do stupňů,
 * prohozené minuty, výpočet do jiné hranice, vynechaný krok. Distraktor
 * s nepřevedenými minutami (75′) se objeví jen na L1 a L2; na L3 mají všechny
 * možnosti minuty 0–59, aby klíč nešel poznat podle tvaru.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { form } from "@/lib/czechGrammar";
import { cis, uhel, rnd, pick, shuffle, buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

// ── Úhly a jejich zápis ─────────────────────────────────────────────────────
const PRAVY = 90 * 60;
const PRIMY = 180 * 60;

/** Stupně a minuty BEZ převodu — pro chybné výsledky typu „75° 75′“. */
function surovy(st: number, min: number): string {
  if (min === 0) return `${cis(st)}°`;
  if (st === 0) return `${cis(min)}′`;
  return `${cis(st)}° ${cis(min)}′`;
}

const st = (m: number): number => Math.floor(m / 60);
const mi = (m: number): number => m % 60;
const u = (st_: number, min: number): number => st_ * 60 + min;

type Druh = "ostrý" | "pravý" | "tupý" | "přímý";
const DRUHY: Druh[] = ["ostrý", "pravý", "tupý", "přímý"];

function druhUhlu(m: number): Druh {
  if (m < PRAVY) return "ostrý";
  if (m === PRAVY) return "pravý";
  if (m < PRIMY) return "tupý";
  return "přímý";
}

const DEFINICE: Record<Druh, string> = {
  ostrý: "Ostrý úhel je menší než 90°.",
  pravý: "Pravý úhel má přesně 90°.",
  tupý: "Tupý úhel je větší než 90° a menší než 180°.",
  přímý: "Přímý úhel má přesně 180°.",
};

/** Pravdivé tvrzení o poloze úhlu vůči hranicím 90° a 180°. */
function vztah(m: number): string {
  if (m < PRAVY) return "je menší než 90°";
  if (m === PRAVY) return "má přesně 90°";
  if (m < PRIMY) return "je větší než 90° a menší než 180°";
  return "má přesně 180°";
}

/** Poslední krok určení druhu: u hranice bez tautologie „90° má přesně 90°“. */
function krokDruhu(m: number, zapisM: string): string {
  if (m === PRAVY) return `${zapisM} je přesně 90° → pravý úhel`;
  if (m === PRIMY) return `${zapisM} je přesně 180° → přímý úhel`;
  return `${uhel(m)} ${vztah(m)} → ${druhUhlu(m)} úhel`;
}

const minut = (x: number): string => `${cis(x)} ${form(x, "MINUTA")}`;

/** Platný výsledek: kladný, nejvýš přímý úhel. */
const platny = (m: number): boolean => m > 0 && m <= PRIMY;

/**
 * Hotová úloha: klíč se nesmí objevit ve znění, v nápovědě ani mezi zadanými
 * úhly (jinak by šel opsat).
 */
function uloha(
  question: string,
  correct: string,
  dis: Distractor[],
  parts: { hints: string[]; solutionSteps: string[]; explanation: string },
): PracticeTask | null {
  const t = buildChoiceTask(question, correct, dis, parts);
  if (!t) return null;
  t.hints = napovedy(question, correct, parts.hints);
  if (t.question.includes(correct)) return null;
  if (t.hints?.some((h) => h.includes(correct))) return null;
  return t;
}

/**
 * Vlastní „Čísla ze zadání“: sdílený filtr porovnává jen číselnou část
 * a vynechal by zadaných 33′, když klíč začíná 33°. Tady se vynechá jen číslo,
 * které se i s jednotkou shoduje se složkou klíče.
 */
const STRATEGIE_H = [
  "Nakonec si výsledek ověř zkouškou.",
  "Porovnej výsledek s odhadem: dává takové číslo smysl?",
  "Zkontroluj, na co přesně se otázka ptá, než vybereš odpověď.",
];
function napovedy(question: string, correct: string, hints: string[]): string[] {
  const [prvni, ...zbytek] = hints;
  const slozky = new Set(correct.split(" "));
  const cisla = [...new Set(question.match(/\d+[°′]?/g) ?? [])].filter((z) => !slozky.has(z));
  const h0 = cisla.length ? `${prvni} Čísla ze zadání: ${cisla.join("; ")}.` : prvni;
  let h1 = zbytek.join(" ") || prvni;
  for (const s of STRATEGIE_H) {
    if (h1.length >= h0.length * 1.2) break;
    if (!h1.includes(s)) h1 = `${h1} ${s}`;
  }
  return [h0, h1];
}

const HINT_SCITANI =
  "Nejdřív sečti zvlášť stupně a zvlášť minuty. Když minut vyjde 60 a víc, převeď je.";
const HINT_ODCITANI =
  "Odčítej zvlášť stupně a zvlášť minuty. Když je minut v prvním úhlu méně, půjč si 1° = 60′.";
const SETINY = "Minuty jsi počítal jako setiny. 1° má 60′, ne 100′.";
const NEPROMITL_SCIT = "Minuty máš správně, ale převedený 1° se do stupňů nepromítl.";
const NEPROMITL_ODC = "Minuty máš správně, ale vypůjčený 1° se do stupňů nepromítl: od stupňů ho musíš odečíst.";

// ── L1: druh úhlu, převod jednotek, sčítání bez převodu ────────────────────
function velikostL1(druh: Druh): number {
  switch (druh) {
    case "ostrý":
      return pick([
        u(rnd(10, 84), 0),
        u(pick([85, 86, 87, 88, 89]), 0),
        u(89, pick([15, 30, 45])),
      ]);
    case "tupý":
      return pick([
        u(rnd(95, 175), 0),
        u(pick([91, 92, 93, 178, 179]), 0),
        u(90, pick([15, 30, 45])),
        u(179, pick([15, 30, 45])),
      ]);
    case "pravý":
      return PRAVY;
    default:
      return PRIMY;
  }
}

function genL1Druh(): PracticeTask | null {
  const m = velikostL1(pick(DRUHY));
  const klic = druhUhlu(m);
  const z = uhel(m);
  const fakt =
    m === PRAVY
      ? "Zadaný úhel má přesně 90°, je tedy přesně na hranici — ani pod ní, ani nad ní."
      : m === PRIMY
        ? "Zadaný úhel má přesně 180°, tolik co dva pravé úhly dohromady."
        : `Zadaný úhel ${z} ${vztah(m)}.`;
  return uloha(
    pick([`Jaký je to úhel, když má velikost ${z}?`, `Jaký je to úhel, když měří ${z}?`]),
    klic,
    DRUHY.filter((d) => d !== klic).map((d) => ({ value: d, why: `${DEFINICE[d]} ${fakt}` })),
    {
      hints: [
        "Porovnej velikost úhlu se dvěma hranicemi: 90° a 180°.",
        `Zjisti, jestli je ${z} menší než 90°, přesně 90°, mezi 90° a 180°, nebo přesně 180°. Každé z těch čtyř možností odpovídá jeden druh úhlu.`,
      ],
      solutionSteps: [
        "Hranice: ostrý je menší než 90°, pravý má 90°, tupý leží mezi 90° a 180°, přímý má 180°.",
        krokDruhu(m, "Zadaný úhel"),
      ],
      explanation:
        m === PRAVY || m === PRIMY
          ? `${DEFINICE[klic]} Zadaný úhel má právě tuto velikost, proto je to ${klic} úhel.`
          : `${DEFINICE[klic]} Úhel ${z} ${vztah(m)}, proto je to ${klic} úhel.`,
    },
  );
}

function genL1Prevod(): PracticeTask | null {
  if (Math.random() < 0.5) {
    // stupně → minuty
    const d = rnd(2, 12);
    const klic = `${cis(d * 60)}′`;
    const dis: Distractor[] = [
      { value: `${cis(d * 100)}′`, why: SETINY },
      { value: `${cis(d + 60)}′`, why: `Čísla jsi sečetl. Každý stupeň má 60′, takže počet stupňů musíš šedesáti vynásobit: ${cis(d)} · 60.` },
      { value: `${cis(d * 10)}′`, why: `Násobil jsi deseti. 1° má 60′, takže počet stupňů násob šedesáti.` },
    ];
    if (60 % d === 0) {
      dis.push({ value: `${cis(60 / d)}′`, why: `Dělil jsi. Stupeň je větší než minuta, takže minut musí vyjít víc: počet stupňů násob šedesáti.` });
    }
    return uloha(`Kolik minut má úhel ${cis(d)}°?`, klic, dis, {
      hints: [
        `Každý stupeň má ${minut(60)}.`,
        `Úhel ${cis(d)}° rozděl na jednotlivé stupně. Každý z nich má ${minut(60)}, takže minuty spočítáš dohromady násobením.`,
      ],
      solutionSteps: [`1° = 60′`, `${cis(d)}° = ${cis(d)} · 60′ = ${cis(d * 60)}′`],
      explanation: `Jeden stupeň má ${minut(60)}, a proto má ${cis(d)}° celkem ${cis(d)} · 60 = ${minut(d * 60)}.`,
    });
  }
  // minuty → stupně a minuty (násobek 15, aby šla ukázat chyba s desetinným číslem)
  const k = pick([7, 9, 10, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23, 25, 26, 27]);
  const m = 15 * k;
  const klic = uhel(m);
  const des = Math.round((mi(m) / 60) * 100);
  const podil = `${cis(st(m))},${des === 50 ? "5" : cis(des)}`;
  const dis: Distractor[] = [
    { value: surovy(Math.floor(m / 100), m % 100), why: `${SETINY} Stupňů je v ${cis(m)}′ tolik, kolikrát se do nich vejde 60′.` },
    {
      value: surovy(st(m), des),
      why: `Dělení ${cis(m)} : 60 = ${podil} dává část stupně jako desetinné číslo, ne jako minuty. Zbytek po dělení šedesáti je počet minut.`,
    },
    { value: surovy(st(m), 0), why: `Stupně máš správně, ale zapomněl jsi na minuty, které po dělení šedesáti zbyly.` },
  ];
  return uloha(`Zapiš úhel ${cis(m)}′ ve stupních a minutách.`, klic, dis, {
    hints: [
      `Zjisti, kolikrát se ${minut(60)} vejde do zadaného počtu minut.`,
      `Vyděl ${cis(m)} šedesáti se zbytkem. Podíl jsou celé stupně, zbytek po dělení jsou minuty, které do celého stupně nestačily.`,
    ],
    solutionSteps: [
      `${cis(m)} : 60 = ${cis(st(m))}, zbytek ${cis(mi(m))}`,
      `${cis(st(m))} · 60′ = ${cis(st(m) * 60)}′ a ${cis(m)}′ − ${cis(st(m) * 60)}′ = ${cis(mi(m))}′`,
      `${cis(m)}′ = ${klic}`,
    ],
    explanation: `Jeden stupeň má ${minut(60)}. Do ${cis(m)}′ se 60′ vejde ${cis(st(m))}krát a zbude ${cis(mi(m))}′, proto ${cis(m)}′ = ${klic}.`,
  });
}

function genL1Soucet(): PracticeTask | null {
  const d1 = rnd(10, 80), d2 = rnd(10, 80);
  const m1 = rnd(5, 50), m2 = rnd(5, 54 - m1 + 5);
  if (d1 === d2 || m1 === m2 || m1 + m2 > 59) return null;
  const a = u(d1, m1), b = u(d2, m2), s = a + b;
  if (s > u(170, 0)) return null;
  const dis: Distractor[] = [
    { value: surovy(d1, m1 + m2), why: `Minuty jsi sečetl správně, ale stupně jsi nechal jen z prvního úhlu. Sečti i ${cis(d1)}° a ${cis(d2)}°.` },
    { value: surovy(d1 + d2, m1), why: `Stupně jsi sečetl správně, ale minuty jsi opsal jen z prvního úhlu. Sečti i ${cis(m1)}′ a ${cis(m2)}′.` },
    { value: surovy(Math.abs(d1 - d2), Math.abs(m1 - m2)), why: `Tohle je rozdíl, ne součet. Stupně i minuty máš sečíst.` },
  ];
  if (m1 + d2 < 60) {
    dis.push({ value: surovy(d1 + m2, m1 + d2), why: `Sčítal jsi stupně s minutami. Stupně sečti jen se stupni a minuty jen s minutami.` });
  }
  return uloha(`Sečti úhly ${uhel(a)} a ${uhel(b)}.`, uhel(s), dis, {
    hints: [
      "Sečti zvlášť stupně a zvlášť minuty.",
      `Nejdřív sečti stupně ${cis(d1)}° a ${cis(d2)}°, potom minuty ${cis(m1)}′ a ${cis(m2)}′. Oba výsledky pak zapiš vedle sebe.`,
    ],
    solutionSteps: [
      `Stupně: ${cis(d1)}° + ${cis(d2)}° = ${cis(d1 + d2)}°`,
      `Minuty: ${cis(m1)}′ + ${cis(m2)}′ = ${cis(m1 + m2)}′`,
      `${uhel(a)} + ${uhel(b)} = ${uhel(s)}`,
    ],
    explanation: `Stupně se sčítají se stupni a minuty s minutami. Minut vyšlo ${cis(m1 + m2)}′, to je méně než 60′, takže nic převádět nemusíš: výsledek je ${uhel(s)}.`,
  });
}

// ── L2: převod přes 60 ─────────────────────────────────────────────────────
function genL2Soucet(): PracticeTask | null {
  const d1 = rnd(15, 95), d2 = rnd(10, 80);
  const m1 = rnd(5, 58), m2 = rnd(5, 58);
  const M = m1 + m2, D = d1 + d2;
  if (M <= 60) return null;
  const a = u(d1, m1), b = u(d2, m2), s = a + b;
  if (s >= u(180, 0)) return null;
  const dis: Distractor[] = [
    { value: surovy(D, M), why: `Minuty jsi nepřevedl. 1° má 60′, takže ${cis(M)}′ = ${uhel(M)} a ten 1° patří ke stupňům.` },
    { value: surovy(D, M - 60), why: NEPROMITL_SCIT },
  ];
  if (M >= 100) dis.push({ value: surovy(D + 1, M - 100), why: SETINY });
  dis.push({ value: surovy(D + 1, M), why: `K stupňům jsi přičetl 1°, ale od minut jsi 60′ neodečetl.` });
  return uloha(`Vypočítej součet úhlů ${uhel(a)} a ${uhel(b)}.`, uhel(s), dis, {
    hints: [
      HINT_SCITANI,
      `Stupně ${cis(d1)}° a ${cis(d2)}° sečti zvlášť, minuty ${cis(m1)}′ a ${cis(m2)}′ také zvlášť. Z minut odeber 60′ a místo nich přičti ke stupňům 1°.`,
    ],
    solutionSteps: [
      `Stupně: ${cis(d1)}° + ${cis(d2)}° = ${cis(D)}°`,
      `Minuty: ${cis(m1)}′ + ${cis(m2)}′ = ${cis(M)}′`,
      `${cis(M)}′ = 60′ + ${cis(M - 60)}′ = 1° ${cis(M - 60)}′`,
      `${cis(D)}° + 1° ${cis(M - 60)}′ = ${uhel(s)}`,
    ],
    explanation: `Stupně a minuty se sčítají zvlášť. Minut vyšlo ${cis(M)}′, to je víc než 60′. Protože 1° = 60′, převedeš 60′ na 1° a zbude ${cis(M - 60)}′. Proto ${cis(D)}° + 1° ${cis(M - 60)}′ = ${uhel(s)}.`,
  });
}

/** Odčítání a − b s výpůjčkou; minuty a musí být menší než minuty b. */
function odcitaniDistraktory(a: number, b: number, prvni: string): Distractor[] {
  const [da, ma, db, mb] = [st(a), mi(a), st(b), mi(b)];
  const out: Distractor[] = [
    { value: surovy(da - db - 1, ma + 100 - mb), why: `${SETINY} Půjčuje se 1° = 60′.` },
    { value: surovy(da - db, ma + 60 - mb), why: NEPROMITL_ODC },
    {
      value: surovy(da - db, mb - ma),
      why: ma === 0
        ? `Úhel ${prvni} nemá žádné minuty navíc, minuty druhého úhlu proto nemůžeš jen opsat. Půjč si 1° = 60′.`
        : `Minuty prvního úhlu jsou menší, nemůžeš je prohodit. Půjč si 1° = 60′.`,
    },
    { value: surovy(da - db - 1, mb - ma), why: `Půjčil sis 1°, ale minuty jsi pak odečetl obráceně. Vypůjčených 60′ přičti k minutám prvního úhlu.` },
  ];
  return out;
}

function krokyOdcitani(a: number, b: number): string[] {
  const [da, ma, db, mb] = [st(a), mi(a), st(b), mi(b)];
  return [
    `${cis(ma)}′ je méně než ${cis(mb)}′ → půjč si 1° = 60′: ${uhel(a)} = ${cis(da - 1)}° ${cis(ma + 60)}′`,
    `Stupně: ${cis(da - 1)}° − ${cis(db)}° = ${cis(da - 1 - db)}°`,
    `Minuty: ${cis(ma + 60)}′ − ${cis(mb)}′ = ${cis(ma + 60 - mb)}′`,
    `${uhel(a)} − ${uhel(b)} = ${uhel(a - b)}`,
  ];
}

function genL2Rozdil(): PracticeTask | null {
  let a: number, b: number;
  if (Math.random() < 0.3) {
    a = PRAVY;
    b = u(rnd(10, 80), rnd(5, 55));
  } else {
    const da = rnd(60, 179), ma = rnd(0, 50);
    const db = rnd(10, da - 10), mb = rnd(ma + 5, 59);
    a = u(da, ma);
    b = u(db, mb);
  }
  if (a - b < u(5, 0) || mi(a) >= mi(b)) return null;
  return uloha(`Vypočítej rozdíl úhlů ${uhel(a)} a ${uhel(b)}.`, uhel(a - b), odcitaniDistraktory(a, b, uhel(a)), {
    hints: [
      HINT_ODCITANI,
      `Minut v úhlu ${uhel(a)} je méně než v úhlu ${uhel(b)}. Proto od stupňů prvního úhlu uber 1° a jeho 60′ přidej k minutám. Teprve pak odčítej stupně od stupňů a minuty od minut.`,
    ],
    solutionSteps: krokyOdcitani(a, b),
    explanation: `Od ${cis(mi(a))}′ nejde odečíst ${cis(mi(b))}′, proto si půjčíš 1° a převedeš ho na 60′ (1° = 60′). Pak odečteš zvlášť stupně a zvlášť minuty a vyjde ${uhel(a - b)}.`,
  });
}

function genL2Chybi(hranice: typeof PRAVY | typeof PRIMY): PracticeTask | null {
  const pravy = hranice === PRAVY;
  const a = u(rnd(5, pravy ? 84 : 174), rnd(5, 58));
  const H = st(hranice);
  const [d, m] = [st(a), mi(a)];
  const jina = pravy ? PRIMY : PRAVY;
  const dis: Distractor[] = [
    { value: surovy(H - d, 60 - m), why: `${NEPROMITL_SCIT.replace("převedený", "vypůjčený")} ${cis(H)}° zapiš jako ${cis(H - 1)}° 60′.` },
    { value: surovy(H - 1 - d, 100 - m), why: SETINY },
    { value: surovy(H - d, m), why: `Minuty jsi jen opsal ze zadání. Od ${cis(H - 1)}° 60′ je musíš odečíst.` },
  ];
  if (platny(jina - a)) {
    dis.push({
      value: uhel(jina - a),
      why: pravy
        ? "Pravý úhel má 90°, ty jsi počítal do 180°, tedy do přímého úhlu."
        : "Přímý úhel má 180°, ty jsi počítal jen do 90°, tedy do pravého úhlu.",
    });
  }
  const klic = hranice - a;
  const nazev = pravy ? "pravého" : "přímého";
  return uloha(`Kolik stupňů a minut chybí úhlu ${uhel(a)} do ${nazev} úhlu?`, uhel(klic), shuffle(dis), {
    hints: [
      pravy
        ? "Chybějící úhel dostaneš, když zadaný úhel odečteš od 90°."
        : "Chybějící úhel dostaneš, když zadaný úhel odečteš od 180°.",
      `Úhel ${cis(H)}° nemá žádné minuty, a proto si ho zapiš jako ${cis(H - 1)}° 60′. Pak od něj odečti ${uhel(a)}: stupně od stupňů, minuty od minut.`,
    ],
    solutionSteps: [
      `${cis(H)}° = ${cis(H - 1)}° 60′`,
      `Stupně: ${cis(H - 1)}° − ${cis(d)}° = ${cis(H - 1 - d)}°`,
      `Minuty: 60′ − ${cis(m)}′ = ${cis(60 - m)}′`,
      `${cis(H)}° − ${uhel(a)} = ${uhel(klic)}`,
    ],
    explanation: `${pravy ? "Pravý" : "Přímý"} úhel má ${cis(H)}°, takže chybějící část je ${cis(H)}° − ${uhel(a)}. Od 0′ nejde odečíst ${cis(m)}′, proto se ${cis(H)}° přepíše na ${cis(H - 1)}° 60′ (1° = 60′). Vyjde ${uhel(klic)}.`,
  });
}

// ── L3: dva kroky, druh součtu, inverze ────────────────────────────────────
/** Součet těsně u hranice: minuty se vždy převádějí. */
function genL3DruhSouctu(): PracticeTask | null {
  const cil = pick<Druh>(DRUHY);
  // D = součet stupňů (bez převodu), M = součet minut (60–99)
  let D: number, M: number;
  if (cil === "pravý") [D, M] = [89, 60];
  else if (cil === "přímý") [D, M] = [179, 60];
  else if (cil === "tupý") [D, M] = [89, rnd(61, 99)];
  else [D, M] = [pick([87, 88]), rnd(61, 99)];
  const m1 = rnd(Math.max(5, M - 58), Math.min(58, M - 5));
  const m2 = M - m1;
  const d1 = rnd(cil === "přímý" ? 60 : 20, D - 20);
  const d2 = D - d1;
  if (m2 < 5 || m2 > 58 || d2 < 5) return null;
  const a = u(d1, m1), b = u(d2, m2), s = a + b;
  const klic = druhUhlu(s);
  // Kdo minuty nepřevede, vidí jen D stupňů a „něco navíc“ — úhel mezi D° a (D+1)°.
  const spatne = druhUhlu(u(D, 1));
  const prevod = `Pozor na převod: ${cis(M)}′ = ${uhel(M)}, takže součet není ${cis(D)}° a kousek, ale ${uhel(s)}.`;
  const soucet =
    s === PRAVY || s === PRIMY
      ? `Součet je ${cis(D)}° ${cis(M)}′ = ${uhel(s)}, tedy přesně ${klic} úhel.`
      : `Součet úhlů je ${uhel(s)}. To je ${s < PRAVY ? "méně než 90°" : "víc než 90° a méně než 180°"}.`;
  const dis: Distractor[] = DRUHY.filter((x) => x !== klic).map((x) => ({
    value: x,
    why: x === spatne && spatne !== klic
      ? `${DEFINICE[x]} ${prevod}`
      : `${DEFINICE[x]} ${soucet}`,
  }));
  const q = `Úhel α = ${uhel(a)} a úhel β = ${uhel(b)}. Jaký úhel vznikne, když je sečteš?`;
  return uloha(q, klic, dis, {
    hints: [
      "Nejdřív oba úhly sečti — zvlášť stupně a zvlášť minuty. Když minut vyjde 60 a víc, převeď je. Teprve pak porovnávej.",
      `Sečti stupně ${cis(d1)}° a ${cis(d2)}° a minuty ${cis(m1)}′ a ${cis(m2)}′. Převedený stupeň přičti ke stupňům a hotový součet porovnej s hranicemi 90° a 180°.`,
    ],
    solutionSteps: [
      `Stupně: ${cis(d1)}° + ${cis(d2)}° = ${cis(D)}°`,
      `Minuty: ${cis(m1)}′ + ${cis(m2)}′ = ${cis(M)}′ = ${uhel(M)}`,
      `α + β = ${cis(D)}° + ${uhel(M)} = ${uhel(s)}`,
      krokDruhu(s, "Součet"),
    ],
    explanation: `Součet stupňů je jen ${cis(D)}°, ale minut vyšlo ${cis(M)}′, a protože 60′ = 1°, přibude ke stupňům 1°. Po převodu je součet ${uhel(s)}. ${DEFINICE[klic]} Proto vznikne ${klic} úhel.`,
  });
}

function genL3TretiUhel(): PracticeTask | null {
  const d1 = rnd(20, 90), d2 = rnd(20, 90);
  const m1 = rnd(10, 58), m2 = rnd(10, 58);
  const M = m1 + m2, D = d1 + d2;
  if (M <= 60) return null;
  const a1 = u(d1, m1), a2 = u(d2, m2), s = a1 + a2;
  if (s > u(170, 0)) return null;
  const klic = PRIMY - s;
  const [Dc, sm] = [st(s), mi(s)];
  const dis: Distractor[] = [
    { value: uhel(s), why: "To je jen součet dvou známých úhlů. Třetí úhel dostaneš, když tenhle součet ještě odečteš od 180°." },
    {
      value: uhel(klic + 60),
      why: `Při sčítání jsi ${cis(M)}′ převedl, ale převedený 1° jsi ke stupňům nepřičetl. Součet ti tak vyšel o 1° menší, a proto třetí úhel o 1° větší.`,
    },
    { value: surovy(179 - Dc, sm), why: "Minuty součtu jsi jen opsal. Od 180° = 179° 60′ je musíš odečíst." },
    { value: uhel(PRIMY - a1), why: `Od 180° jsi odečetl jen úhel ${uhel(a1)}. Musíš odečíst oba známé úhly.` },
  ];
  if (M < 100) {
    dis.push({
      value: surovy(179 - D, 100 - M),
      why: `Minuty jsi počítal jako setiny: ${cis(M)}′ jsi nepřevedl a při odčítání sis půjčil 100′. 1° má 60′.`,
    });
  }
  const q = pick([
    `Přímý úhel je rozdělený na tři menší úhly. Dva z nich mají ${uhel(a1)} a ${uhel(a2)}. Kolik stupňů a minut má třetí úhel?`,
    `Přímý úhel rozdělíme na tři menší úhly. Dva z nich měří ${uhel(a1)} a ${uhel(a2)}. Kolik měří třetí úhel?`,
  ]);
  return uloha(q, uhel(klic), shuffle(dis), {
    hints: [
      "Přímý úhel má 180° a tři menší úhly ho vyplní celý. Nejdřív sečti oba známé úhly, potom součet odečti od 180°.",
      `Sečti ${uhel(a1)} a ${uhel(a2)} a minuty převeď. Pak zapiš 180° jako 179° 60′ a odečti od něj součet — zvlášť stupně a zvlášť minuty.`,
    ],
    solutionSteps: [
      `Součet: ${cis(D)}° ${cis(M)}′ = ${uhel(s)} (${cis(M)}′ = 1° ${cis(M - 60)}′)`,
      `180° = 179° 60′`,
      `179° 60′ − ${uhel(s)} = ${cis(179 - Dc)}° ${cis(60 - sm)}′`,
      `Třetí úhel: ${uhel(klic)}`,
    ],
    explanation: `Tři menší úhly dohromady tvoří přímý úhel, tedy 180°. Známé úhly dají dohromady ${uhel(s)} (minut vyšlo ${cis(M)}′, proto 1° navíc). Třetí úhel je zbytek do 180°: 179° 60′ − ${uhel(s)} = ${uhel(klic)}.`,
  });
}

function genL3OKolik(): PracticeTask | null {
  const db = rnd(5, 40), mb = rnd(20, 59);
  const da = rnd(90 + db + 6, 179), ma = rnd(0, mb - 1);
  const a = u(da, ma), b = u(db, mb);
  const zaklad = PRAVY + b;
  const klic = a - zaklad;
  if (klic < u(5, 0)) return null;
  const dr = da - 90 - db;
  const dis: Distractor[] = [
    { value: uhel(a - b), why: `Zapomněl jsi na pravý úhel. Od úhlu ${uhel(a)} musíš odečíst 90° i ${uhel(b)}.` },
    { value: surovy(dr, ma + 60 - mb), why: NEPROMITL_ODC },
    {
      value: surovy(dr, mb - ma),
      why: ma === 0
        ? `Úhel ${uhel(a)} nemá žádné minuty navíc, minuty ${cis(mb)}′ proto nemůžeš jen opsat. Půjč si 1° = 60′.`
        : "Minuty prvního úhlu jsou menší, nemůžeš je prohodit. Půjč si 1° = 60′.",
    },
    {
      value: uhel(a - PRAVY + b),
      why: `Pravý úhel se má o ${uhel(b)} zvětšit, ne zmenšit. Nejdřív sečti 90° + ${uhel(b)}, pak ten součet odečti.`,
    },
  ];
  if (ma + 100 - mb <= 59) dis.push({ value: surovy(dr - 1, ma + 100 - mb), why: `${SETINY} Půjčuje se 1° = 60′.` });
  return uloha(`Pravý úhel zvětšíme o ${uhel(b)}. O kolik je úhel ${uhel(a)} větší než takto vzniklý úhel?`, uhel(klic), shuffle(dis), {
    hints: [
      "Úloha má dva kroky: nejdřív zjisti, jak velký je pravý úhel po zvětšení, potom ho odečti od druhého zadaného úhlu.",
      `Pravý úhel má 90°. Přičti k němu ${uhel(b)}, pak výsledek odečti od ${uhel(a)}. Když minut v prvním úhlu nestačí, půjč si 1° = 60′.`,
    ],
    solutionSteps: [
      `90° + ${uhel(b)} = ${uhel(zaklad)}`,
      ...krokyOdcitani(a, zaklad),
    ],
    explanation: `„O kolik je větší“ znamená rozdíl. Vzniklý úhel je pravý úhel zvětšený o ${uhel(b)}, tedy ${uhel(zaklad)}. Od ${cis(ma)}′ nejde odečíst ${cis(mb)}′, proto si půjčíš 1° = 60′. ${uhel(a)} − ${uhel(zaklad)} = ${uhel(klic)}.`,
  });
}

function genL3Inverze(): PracticeTask | null {
  const da = rnd(20, 80), ma = rnd(10, 59);
  const db = rnd(Math.max(da + 15, 91), 179), mb = rnd(0, ma - 1);
  const a = u(da, ma), b = u(db, mb);
  const klic = b - a;
  const dis: Distractor[] = [
    { value: surovy(db - da, mb + 60 - ma), why: NEPROMITL_ODC },
    {
      value: surovy(db - da, ma - mb),
      why: mb === 0
        ? `Úhel ${uhel(b)} nemá žádné minuty navíc, minuty ${cis(ma)}′ proto nemůžeš jen opsat. Půjč si 1° = 60′.`
        : `Minuty úhlu ${uhel(b)} jsou menší, nemůžeš je prohodit. Půjč si 1° = 60′.`,
    },
    { value: uhel(PRIMY - a), why: `To je úhel, který doplní ${uhel(a)} do přímého úhlu 180°. Tady má ale vzniknout ${uhel(b)}.` },
  ];
  if (platny(a + b)) {
    dis.push({ value: uhel(a + b), why: `Úhly jsi sečetl. Hledáš ale úhel, který s ${uhel(a)} dá dohromady ${uhel(b)}, takže musíš odčítat.` });
  }
  if (mb + 100 - ma <= 59) dis.push({ value: surovy(db - da - 1, mb + 100 - ma), why: `${SETINY} Půjčuje se 1° = 60′.` });
  return uloha(`Který úhel musíš přičíst k ${uhel(a)}, aby vznikl tupý úhel ${uhel(b)}?`, uhel(klic), shuffle(dis), {
    hints: [
      "Hledáš chybějící sčítanec: od výsledného úhlu odečti ten, který už máš.",
      `Od ${uhel(b)} odečti ${uhel(a)}: stupně od stupňů, minuty od minut. Když minut nestačí, půjč si 1° = 60′. Nakonec udělej zkoušku sčítáním.`,
    ],
    solutionSteps: [
      `Hledaný úhel = ${uhel(b)} − ${uhel(a)}`,
      ...krokyOdcitani(b, a),
      `Zkouška: ${uhel(a)} + ${uhel(klic)} = ${uhel(b)}`,
    ],
    explanation: `Když se k ${uhel(a)} něco přičte a vznikne ${uhel(b)}, je to chybějící sčítanec — dostaneš ho odčítáním. Od ${cis(mb)}′ nejde odečíst ${cis(ma)}′, proto si půjčíš 1° = 60′. Vyjde ${uhel(klic)}, což potvrdí zkouška sčítáním.`,
  });
}

// ── Generátor ──────────────────────────────────────────────────────────────
const SABLONY: Record<number, (() => PracticeTask | null)[]> = {
  1: [genL1Druh, genL1Prevod, genL1Soucet],
  2: [genL2Soucet, genL2Rozdil, () => genL2Chybi(PRAVY), () => genL2Chybi(PRIMY)],
  3: [genL3DruhSouctu, genL3TretiUhel, genL3OKolik, genL3Inverze],
};

/** Šablony se střídají dokola od náhodné, aby žádná nepřevážila. */
function gen(level: number): PracticeTask[] {
  const s = SABLONY[level] ?? SABLONY[1];
  let i = rnd(0, s.length - 1);
  return ruzneUlohy(() => losUlohy(s[i++ % s.length]));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const UHLY_DRUHY_SCITANI_TOPICS: TopicMetadata[] = [
  {
    id: "g6-mat-uhly-druhy-scitani-6",
    rvpNodeId: "g6-matematika-geometrie-v-rovine-a-v-prostoru-uhel-druhy-uhlu-ostry-pravy-tupy-primy-scitani-a-odcitani-uhlu",
    displayName: "Úhly: druhy, sčítání a odčítání",
    title: "Druhy úhlů, sčítání a odčítání úhlů",
    studentTitle: "Úhly: druhy, sčítání a odčítání",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Úhel",
    briefDescription: "Poznáš ostrý, pravý, tupý a přímý úhel a sečteš úhly.",
    keywords: [
      "úhel", "druhy úhlů", "ostrý úhel", "pravý úhel", "tupý úhel", "přímý úhel",
      "stupeň", "minuta", "sčítání úhlů", "odčítání úhlů",
    ],
    goals: [
      "Určit druh úhlu podle jeho velikosti.",
      "Převádět stupně a minuty (1° = 60′).",
      "Sčítat a odčítat úhly zapsané ve stupních a minutách s převodem přes 60′.",
      "Dopočítat chybějící úhel do pravého nebo přímého úhlu.",
    ],
    boundaries: [
      "Úhly nejvýš 180°, výsledky vždy kladné.",
      "Bez vteřin a bez úhlů větších než přímý úhel.",
      "Nulový a plný úhel nejsou klíčem.",
      "Žák vybírá ze čtyř možností, nepíše vlastní odpověď.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-mat-uhel-rysovani-mereni-6"],
    generator: gen,
    helpTemplate: {
      hint: "Stupně počítej se stupni, minuty s minutami. 1° má 60′.",
      steps: [
        "Druh úhlu urči porovnáním s 90° a 180°.",
        "Při sčítání sečti zvlášť stupně a zvlášť minuty; 60′ převeď na 1°.",
        "Při odčítání si v případě potřeby půjč 1° = 60′.",
      ],
      commonMistake: "Počítat minuty jako setiny (přenos po 100) nebo zapomenout převedený stupeň.",
      example: "35° 40′ + 20° 30′: stupně 55°, minuty 70′ = 1° 10′, výsledek 56° 10′.",
    },
  },
];
