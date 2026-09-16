/**
 * Matematika 6. ročník — Logické úvahy, kombinační úsudek.
 *
 * Výpočetní select_one téma podle vzoru `fyzika/mereniDelky.ts`:
 *  • L1 — pravidlo součinu v jednom kroku (dvě nebo tři nezávislé skupiny).
 *  • L2 — počet voleb na jednotlivých místech: čísla z číslic (bez opakování,
 *    s opakováním, s nulou), obsazení prvních míst v závodě, kódy s podmínkou.
 *  • L3 — nezáleží na pořadí (podání ruky, zápasy každý s každým, dvojice),
 *    podmínka na posledním místě (sudá čísla, dělitelnost pěti), dvoukrokový
 *    výběr funkcí s podmínkou a tabulková hádanka s vylučováním. Typy se
 *    v sezení střídají pravidelně (viz `genL3Sezeni`).
 *
 * Každý distraktor je výsledek jedné konkrétní chyby spočítaný z těchže čísel
 * (součet místo součinu, dvojí započtení dvojice, zapomenutý zákaz opakování,
 * nula na prvním místě…). Test tématu počítá klíč hrubou silou výčtem, tedy
 * jinou cestou než generátor, který násobí počty voleb.
 *
 * Bez pojmů kombinační číslo, faktoriál a mocnina (SŠ a 8. ročník).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad, plural } from "@/lib/czechGrammar";
import {
  cis as f,
  rnd,
  pick,
  shuffle,
  buildChoiceTask as sestavUlohu,
  losUlohy,
  ruzneUlohy,
  type Distractor,
} from "./_shared";

/**
 * Jako sdílené `buildChoiceTask`, ale nápovědy zůstanou přesně, jak jsou
 * napsané. Sdílený doplněk („Čísla ze zadání…“, „ověř zkouškou“) v
 * kombinatorice nic neučí: čísla tu nápověda zapracuje do věty sama a
 * zkouška dosazením tu nemá smysl.
 */
function buildChoiceTask(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: [string, string]; solutionSteps: string[]; explanation: string },
): PracticeTask | null {
  const t = sestavUlohu(question, correct, distractors, parts);
  return t && { ...t, hints: [...parts.hints] };
}

type Tvary = [string, string, string];

/** Číslo + správný tvar podstatného jména (slova mimo rejstřík NOUNS). */
const pocet = (n: number, t: Tvary): string => `${f(n)} ${plural(n, t[0], t[1], t[2])}`;
const moz = (n: number): string => pad(n, "MOŽNOST");
const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** Výčet „2, 5, 7 a 8“ (spojka bez čárky). */
function vycet(items: string[], spojka = "a"): string {
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} ${spojka} ${items[items.length - 1]}`;
}

const JMENA_L1 = ["Anna", "Tomáš", "Jana", "Ondra", "Klára", "Vojta", "Ema", "Matěj", "Bára", "Filip"];

function gen(level: number): PracticeTask[] {
  if (level === 3) return genL3Sezeni();
  const tvor = level === 1 ? genL1 : genL2;
  return ruzneUlohy(() => losUlohy(tvor));
}

/** „ze 3 čepic“, ale „z 5 čepic“ (čte se „ze tří“, „z pěti“). */
const zCislem = (n: number): string => `${n >= 2 && n <= 4 ? "ze" : "z"} ${f(n)}`;

// ── L1 — pravidlo součinu v jednom kroku ──────────────────────────────────
type Skupina = {
  /** Název volby v 1. pádě („tričko“). */
  nom: string;
  /** „počet triček“ */
  gen: string;
  /** „Ke každému tričku“ */
  ke: string;
  /** „kterékoli tričko“ */
  any: string;
};

type SablonaL1 = {
  text: (jmeno: string, a: number, b: number) => string;
  g1: Skupina;
  g2: Skupina;
};

const L1_SABLONY: SablonaL1[] = [
  {
    text: (j, a, b) =>
      `${j} má ve skříni ${pad(a, "TRIČKO")} a ${pocet(b, ["pár kalhot", "páry kalhot", "párů kalhot"])}. Kolika různými způsoby se může obléct, když si vezme jedno tričko a jedny kalhoty?`,
    g1: { nom: "tričko", gen: "triček", ke: "Ke každému tričku", any: "kterékoli tričko" },
    g2: { nom: "kalhoty", gen: "párů kalhot", ke: "Ke každým kalhotám", any: "kterékoli kalhoty" },
  },
  {
    text: (j, a, b) =>
      `Na hory si ${j} bere ${pocet(a, ["čepici", "čepice", "čepic"])} a ${pocet(b, ["šálu", "šály", "šál"])}. Kolika různými způsoby si může vybrat jednu čepici a jednu šálu?`,
    g1: { nom: "čepice", gen: "čepic", ke: "Ke každé čepici", any: "kteroukoli čepici" },
    g2: { nom: "šála", gen: "šál", ke: "Ke každé šále", any: "kteroukoli šálu" },
  },
  {
    text: (j, a, b) =>
      `Školní jídelna nabízí ${pocet(a, ["polévku", "polévky", "polévek"])} a ${pocet(b, ["hlavní jídlo", "hlavní jídla", "hlavních jídel"])}. Kolik různých obědů z jedné polévky a jednoho hlavního jídla si může ${j} vybrat?`,
    g1: { nom: "polévka", gen: "polévek", ke: "Ke každé polévce", any: "kteroukoli polévku" },
    g2: { nom: "hlavní jídlo", gen: "hlavních jídel", ke: "Ke každému hlavnímu jídlu", any: "kterékoli hlavní jídlo" },
  },
  {
    text: (j, a, b) =>
      `Z chaty k rybníku ${plural(a, "vede", "vedou", "vede")} ${pocet(a, ["cesta", "cesty", "cest"])} a od rybníka k rozhledně ${pocet(b, ["cesta", "cesty", "cest"])}. Kolika různými trasami dojde ${j} od chaty kolem rybníka k rozhledně?`,
    g1: { nom: "cesta k rybníku", gen: "cest k rybníku", ke: "Ke každé cestě k rybníku", any: "kteroukoli cestu k rybníku" },
    g2: { nom: "cesta od rybníka", gen: "cest od rybníka", ke: "Ke každé cestě od rybníka", any: "kteroukoli cestu od rybníka" },
  },
  {
    text: (j, a, b) =>
      `Ve stánku mají ${pocet(a, ["příchuť", "příchutě", "příchutí"])} zmrzliny a ${pocet(b, ["druh", "druhy", "druhů"])} kornoutu. Kolik různých zmrzlin s jedním kopečkem si může ${j} koupit?`,
    g1: { nom: "příchuť", gen: "příchutí", ke: "Ke každé příchuti", any: "kteroukoli příchuť" },
    g2: { nom: "kornout", gen: "kornoutů", ke: "Ke každému kornoutu", any: "kterýkoli kornout" },
  },
  {
    text: (j, a, b) =>
      `${j} si vybírá sportovní tričko a obchod nabízí ${pocet(a, ["barvu", "barvy", "barev"])} a ${pocet(b, ["potisk", "potisky", "potisků"])}. Kolik různých triček s jednou barvou a jedním potiskem si může vybrat?`,
    g1: { nom: "barva", gen: "barev", ke: "Ke každé barvě", any: "kteroukoli barvu" },
    g2: { nom: "potisk", gen: "potisků", ke: "Ke každému potisku", any: "kterýkoli potisk" },
  },
];

function genL1(): PracticeTask | null {
  const j = pick(JMENA_L1);
  // Šest dvouskupinových šablon + dvě tříčlenné, vybírané rovnoměrně.
  const i = rnd(0, L1_SABLONY.length + L1_TRI.length - 1);
  if (i >= L1_SABLONY.length) return genL1Tri(j, L1_TRI[i - L1_SABLONY.length]);
  const s = L1_SABLONY[i];
  const a = rnd(2, 5);
  const b = rnd(2, 5);
  if (a + b === a * b) return null; // 2 a 2: součet by vyšel stejně jako součin
  const key = a * b;
  const { g1, g2 } = s;

  const dis: Distractor[] = [
    { value: f(a + b), why: `Tohle je součet počtů. ${g1.ke} ale můžeš vzít ${g2.any}, takže se počty násobí.` },
    ...shuffle<Distractor>([
      {
        value: f(key + a + b),
        why: `Tady jsou k úplným výběrům přičtené i samotné volby (jen ${g1.nom}, jen ${g2.nom}). Otázka se ale ptá jen na výběry, ve kterých je obojí.`,
      },
      { value: f(b), why: `Tohle je jen počet ${g2.gen}. ${g2.ke} ale jde vzít ještě ${g1.any}.` },
      { value: f(a), why: `Tohle je jen počet ${g1.gen}. ${g1.ke} ale jde vzít ještě ${g2.any}.` },
    ]),
  ];

  return buildChoiceTask(s.text(j, a, b), f(key), dis, {
    hints: [
      `Nakresli si stromeček: nejdřív se vybírá ${zCislem(a)} ${g1.gen}, potom ${zCislem(b)} ${g2.gen}.`,
      `${g1.ke} jde vzít ${g2.any}. Kolik větví vyroste z jedné první volby a kolik jich bude na konci celkem? Rozmysli si, jestli se počty sčítají, nebo násobí.`,
    ],
    solutionSteps: [
      `${cap(g1.nom)}: ${moz(a)}; ${g2.nom}: ${moz(b)}.`,
      `${g1.ke} jde vzít ${g2.any}, proto se počty násobí: ${f(a)} · ${f(b)} = ${f(key)}.`,
    ],
    explanation: `Pravidlo součinu: stromeček má ${pocet(a, ["větev", "větve", "větví"])} a z každé ${plural(b, "vyrůstá", "vyrůstají", "vyrůstá")} ${f(b)} ${plural(b, "další", "další", "dalších")}. Na konci je tedy ${f(a)} · ${f(b)} = ${f(key)} různých výběrů. Sčítání by spočítalo jen jednotlivé volby, ne jejich dvojice.`,
  });
}

/** Tři nezávislé výběry za sebou (stromeček se třemi patry). */
type SablonaTri = {
  text: (j: string, a: number, b: number, c: number) => string;
  /** Názvy pater v 1. pádě: „pečivo“, „nápoj“, „ovoce“. */
  patra: [string, string, string];
  soucet: string;
  bezTretiho: string;
  secteneDruheTreti: string;
  bezPrvniho: string;
  h0: string;
  h1: string;
  cil: string;
};

const druh: Tvary = ["druh", "druhy", "druhů"];
const cesta: Tvary = ["cesta", "cesty", "cest"];
const vede = (n: number) => plural(n, "vede", "vedou", "vede");

const L1_TRI: SablonaTri[] = [
  {
    text: (j, a, b, c) =>
      `${j} má doma ${pocet(a, druh)} pečiva, ${pocet(b, ["nápoj", "nápoje", "nápojů"])} a ${pocet(c, druh)} ovoce. Kolik různých snídaní z jednoho pečiva, jednoho nápoje a jednoho ovoce může sestavit?`,
    patra: ["pečivo", "nápoj", "ovoce"],
    soucet: "Tohle je součet počtů. K pečivu ale jde vzít kterýkoli nápoj a k té dvojici ještě kterýkoli druh ovoce, takže se počty násobí.",
    bezTretiho: "Tady chybí ovoce. Každou dvojici pečivo a nápoj jde doplnit ještě kterýmkoli druhem ovoce, takže se násobí i jeho počtem.",
    secteneDruheTreti: "Tady jsou počty nápojů a druhů ovoce sečtené. I každý nápoj ale jde spojit s každým druhem ovoce, takže se musí násobit.",
    bezPrvniho: "Tady chybí pečivo. Každou dvojici nápoj a ovoce jde doplnit ještě kterýmkoli druhem pečiva.",
    h0: "Představ si stromeček se třemi patry: pečivo, nápoj, ovoce.",
    h1: "Z každé větve jednoho patra vyrůstají všechny větve dalšího patra. Spočítej větve na konci stromečku.",
    cil: "Každá snídaně je jedna cesta stromečkem od pečiva přes nápoj k ovoci.",
  },
  {
    text: (j, a, b, c) =>
      `Z domu k náměstí ${vede(a)} ${pocet(a, cesta)}, odtud k parku ${f(b)} a od parku ke škole ${f(c)}. Kolika různými trasami může ${j} dojít do školy?`,
    patra: ["cesta k náměstí", "cesta k parku", "cesta ke škole"],
    soucet: "Tohle je součet počtů cest. Ke každé cestě k náměstí ale jde vzít kteroukoli cestu k parku a pak ještě kteroukoli cestu ke škole, takže se počty násobí.",
    bezTretiho: "Tady chybí poslední úsek. Trasa končí až u školy, takže každou cestu k parku jde doplnit ještě kteroukoli cestou ke škole.",
    secteneDruheTreti: "Tady jsou počty cest k parku a ke škole sečtené. I každou cestu k parku ale jde spojit s každou cestou ke škole, takže se musí násobit.",
    bezPrvniho: "Tady chybí první úsek. Trasa začíná doma, takže každé pokračování jde spojit ještě s kteroukoli cestou k náměstí.",
    h0: "Představ si stromeček se třemi patry: úsek k náměstí, úsek k parku a úsek ke škole.",
    h1: "Každou cestu k náměstí jde spojit s kteroukoli cestou k parku a každou takovou dvojici ještě s kteroukoli cestou ke škole. Spočítej větve na konci stromečku.",
    cil: "Každá trasa je jedna cesta stromečkem od domu přes náměstí a park ke škole.",
  },
];

function genL1Tri(j: string, s: SablonaTri): PracticeTask | null {
  const a = rnd(2, 4), b = rnd(2, 4), c = rnd(2, 4);
  const key = a * b * c;
  if (key > 30) return null;
  const dis: Distractor[] = [
    { value: f(a + b + c), why: s.soucet },
    ...shuffle<Distractor>([
      { value: f(a * b), why: s.bezTretiho },
      { value: f(a * (b + c)), why: s.secteneDruheTreti },
      { value: f(b * c), why: s.bezPrvniho },
    ]),
  ];
  const [p1, p2, p3] = s.patra;
  return buildChoiceTask(s.text(j, a, b, c), f(key), dis, {
    hints: [s.h0, s.h1],
    solutionSteps: [
      `${cap(p1)}: ${moz(a)}; ${p2}: ${moz(b)}; ${p3}: ${moz(c)}.`,
      `Nejdřív první dvě patra: ${f(a)} · ${f(b)} = ${pocet(a * b, ["dvojice", "dvojice", "dvojic"])}.`,
      `Ke každé dvojici jde přidat kteroukoli volbu z třetího patra: ${f(a * b)} · ${f(c)} = ${f(key)}.`,
    ],
    explanation: `U tří nezávislých výběrů se násobí všechny tři počty: ${f(a)} · ${f(b)} · ${f(c)} = ${f(key)}. ${s.cil}`,
  });
}

// ── L2 — počet voleb na jednotlivých místech ──────────────────────────────
const SOUCET_MIST =
  "Tohle je součet počtů voleb pro jednotlivá místa. Každou volbu na jednom místě ale jde spojit s každou volbou na dalším, proto se počty násobí.";

function genL2(): PracticeTask | null {
  switch (rnd(1, 5)) {
    case 1: return genL2BezOpakovani();
    case 2: return genL2SOpakovanim();
    case 3: return genL2Nula();
    case 4: return genL2Zavod();
    default: return genL2Kod();
  }
}

/** n různých číslic, vzestupně. */
function cifry(n: number, sNulou: boolean): number[] {
  const nenulove = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, sNulou ? n - 1 : n);
  return (sNulou ? [0, ...nenulove] : nenulove).sort((x, y) => x - y);
}

const otazkaCislic = (mist: "dvojmístných" | "trojmístných", c: number[], smi: boolean) =>
  `Kolik různých ${mist} čísel můžeš sestavit z číslic ${vycet(c.map(f))}, když se číslice v čísle ${smi ? "smějí" : "nesmějí"} opakovat?`;

/** Jednomístný klíč nesmí stát v zadání mezi číslicemi. */
const klicVZadani = (key: number, c: number[]) => key < 10 && c.includes(key);

const HINT_MISTA_2 = "Rozděl číslo na místo desítek a místo jednotek a u každého zjisti, kolik číslic tam může stát.";

function genL2BezOpakovani(): PracticeTask | null {
  const troj = Math.random() < 0.4;
  const n = troj ? rnd(4, 5) : rnd(3, 5);
  const c = cifry(n, false);
  const [d1, d2] = shuffle(c);
  if (troj) {
    const key = n * (n - 1) * (n - 2);
    const dis: Distractor[] = [
      {
        value: f(n * n * n),
        why: `Tady se číslice opakují, třeba ${d1}${d1}${d1}. Zadání opakování zakazuje, takže na každém dalším místě je o jednu volbu méně.`,
      },
      ...shuffle<Distractor>([
        { value: f(n * (n - 1)), why: "Tohle je jen počet dvojmístných začátků. Ke každému z nich se ještě vybírá číslice na místo jednotek." },
        { value: f(n + (n - 1) + (n - 2)), why: SOUCET_MIST },
      ]),
    ];
    return buildChoiceTask(otazkaCislic("trojmístných", c, false), f(key), dis, {
      hints: [
        "Rozděl číslo na stovky, desítky a jednotky a u každého místa zjisti, kolik číslic tam ještě může stát.",
        "Použitá číslice se už nesmí objevit na dalším místě. Počty voleb pro jednotlivá místa pak vynásob.",
      ],
      solutionSteps: [
        `Místo stovek: kterákoli zadaná číslice, tedy ${moz(n)}.`,
        `Místo desítek: jedna číslice je už použitá, tedy ${moz(n - 1)}. Místo jednotek: ${moz(n - 2)}.`,
        `${f(n)} · ${f(n - 1)} · ${f(n - 2)} = ${f(key)}.`,
      ],
      explanation: `Místa se obsazují postupně a každá použitá číslice ubere jednu volbu dalšímu místu. Proto ${f(n)} · ${f(n - 1)} · ${f(n - 2)} = ${f(key)}.`,
    });
  }
  const key = n * (n - 1);
  const dis: Distractor[] = [
    {
      value: f(n * n),
      why: `Tady jsou započítaná i čísla se dvěma stejnými číslicemi, třeba ${d1}${d1}. Zadání opakování zakazuje.`,
    },
    ...shuffle<Distractor>([
      { value: f(n), why: "Tohle je jen počet voleb pro místo desítek. Ke každé z nich se ještě vybírá číslice na místo jednotek." },
      {
        value: f((n * (n - 1)) / 2),
        why: `Tohle číslo bere ${d1}${d2} a ${d2}${d1} jako jedno. Jsou to ale dvě různá čísla, na pořadí číslic záleží.`,
      },
      { value: f(n + (n - 1)), why: SOUCET_MIST },
    ]),
  ];
  if (klicVZadani(key, c)) return null;
  return buildChoiceTask(otazkaCislic("dvojmístných", c, false), f(key), dis, {
    hints: [HINT_MISTA_2, "Číslice z desítek se už na místo jednotek použít nesmí. Počty voleb pro obě místa pak vynásob."],
    solutionSteps: [
      `Místo desítek: kterákoli zadaná číslice, tedy ${moz(n)}.`,
      `Místo jednotek: jedna číslice je už použitá, tedy ${moz(n - 1)}.`,
      `${f(n)} · ${f(n - 1)} = ${f(key)}.`,
    ],
    explanation: `Ke každé číslici na místě desítek jde přidat kteroukoli jinou číslici na místo jednotek. Protože se číslice nesmějí opakovat, zbývá pro jednotky o jednu méně: ${f(n)} · ${f(n - 1)} = ${f(key)}.`,
  });
}

function genL2SOpakovanim(): PracticeTask | null {
  const n = rnd(3, 6);
  const c = cifry(n, false);
  const d = pick(c);
  const key = n * n;
  if (klicVZadani(key, c)) return null;
  const dis = shuffle<Distractor>([
    { value: f(n * (n - 1)), why: `Tady chybí čísla se dvěma stejnými číslicemi, třeba ${d}${d}. Zadání opakování dovoluje.` },
    {
      value: f(n * n + n),
      why: `Tady jsou čísla se dvěma stejnými číslicemi, třeba ${d}${d}, započítaná dvakrát. Když se v nich číslice prohodí, nové číslo nevznikne.`,
    },
    { value: f(2 * n), why: SOUCET_MIST },
    { value: f(n), why: "Tohle je jen počet voleb pro místo desítek. Ke každé z nich se ještě vybírá číslice na místo jednotek." },
  ]);
  return buildChoiceTask(otazkaCislic("dvojmístných", c, true), f(key), dis, {
    hints: [HINT_MISTA_2, "Číslice se smí zopakovat, takže použitá číslice žádné místo neubírá. Počty voleb pro obě místa pak vynásob."],
    solutionSteps: [
      `Místo desítek: kterákoli zadaná číslice, tedy ${moz(n)}.`,
      `Místo jednotek: znovu kterákoli, i stejná, tedy ${moz(n)}.`,
      `${f(n)} · ${f(n)} = ${f(key)}.`,
    ],
    explanation: `Opakování je dovolené, proto má místo jednotek stejně voleb jako místo desítek. Mezi ${f(key)} čísly jsou i čísla se stejnými číslicemi, například ${d}${d}.`,
  });
}

function genL2Nula(): PracticeTask | null {
  const n = rnd(3, 5);
  const c = cifry(n, true);
  const d = pick(c.filter((x) => x !== 0));
  const smi = Math.random() < 0.5;
  const nulaNaZacatku = `Tady jsou započítaná i „čísla“ začínající nulou, třeba 0${d}. Dvojmístné číslo nulou začínat nemůže.`;
  const jenDesitky = "Tohle je jen počet voleb pro místo desítek. Ke každé z nich se ještě vybírá číslice na místo jednotek.";
  let key: number;
  let dis: Distractor[];
  let kroky: string[];
  if (!smi) {
    key = (n - 1) * (n - 1);
    dis = [
      { value: f(n * (n - 1)), why: nulaNaZacatku },
      ...shuffle<Distractor>([
        { value: f((n - 1) * (n - 2)), why: `Tady chybí čísla s nulou na místě jednotek, třeba ${d}0. Nula nesmí stát jen na začátku.` },
        { value: f(n - 1), why: jenDesitky },
        { value: f((n - 1) + (n - 1)), why: SOUCET_MIST },
        {
          value: f(n * n),
          why: "Tady jsou započítaná čísla se stejnými číslicemi i „čísla“ začínající nulou. Zadání opakování zakazuje a nula na začátku stát nemůže.",
        },
      ]),
    ];
    kroky = [
      `Místo desítek: nula tam stát nemůže, tedy ${moz(n - 1)}.`,
      `Místo jednotek: kterákoli jiná číslice včetně nuly, tedy ${moz(n - 1)}.`,
      `${f(n - 1)} · ${f(n - 1)} = ${f(key)}.`,
    ];
  } else {
    key = n * (n - 1);
    dis = [
      { value: f(n * n), why: nulaNaZacatku },
      ...shuffle<Distractor>([
        { value: f((n - 1) * (n - 1)), why: `Tady chybí čísla se dvěma stejnými číslicemi, třeba ${d}${d}. Zadání opakování dovoluje.` },
        { value: f((n - 1) + n), why: SOUCET_MIST },
        { value: f(n - 1), why: jenDesitky },
      ]),
    ];
    kroky = [
      `Místo desítek: nula tam stát nemůže, tedy ${moz(n - 1)}.`,
      `Místo jednotek: kterákoli zadaná číslice včetně nuly, i stejná, tedy ${moz(n)}.`,
      `${f(n - 1)} · ${f(n)} = ${f(key)}.`,
    ];
  }
  if (klicVZadani(key, c)) return null;
  return buildChoiceTask(otazkaCislic("dvojmístných", c, smi), f(key), dis, {
    hints: [
      "Začni místem desítek: může tam stát každá ze zadaných číslic?",
      `Dvojmístné číslo nulou nezačíná, na místě jednotek ale nula stát smí. ${smi ? "Číslice se smí opakovat." : "Použitou číslici už nepoužiješ."} Počty voleb pak vynásob.`,
    ],
    solutionSteps: kroky,
    explanation: `Omezené je místo desítek: nula na něm stát nemůže, proto se začíná právě tam. Na místě jednotek nula stát smí${
      smi ? " a číslice se smí opakovat" : ", jen ji nejde použít podruhé"
    }. Počty voleb se vynásobí: ${kroky[2]}`,
  });
}

type Zavodnik = { tvary: Tvary; jeden: string };
const ZAVODNICI: Zavodnik[] = [
  { tvary: ["běžec", "běžci", "běžců"], jeden: "jeden běžec" },
  { tvary: ["plavkyně", "plavkyně", "plavkyň"], jeden: "jedna plavkyně" },
  { tvary: ["cyklista", "cyklisté", "cyklistů"], jeden: "jeden cyklista" },
];

function genL2Zavod(): PracticeTask | null {
  const z = pick(ZAVODNICI);
  const tri = Math.random() < 0.5;
  const n = tri ? rnd(4, 6) : rnd(5, 10);
  const q = `Na startu závodu stojí ${pocet(n, z.tvary)}. Kolika různými způsoby mohou být obsazena první ${tri ? "tři" : "dvě"} místa?`;
  const vic = `V tomhle počtu může ${z.jeden} obsadit víc míst najednou. Kdo už místo obsadil, na další nemůže.`;
  if (tri) {
    const key = n * (n - 1) * (n - 2);
    const dis: Distractor[] = [
      { value: f(n * n * n), why: vic },
      { value: f(n * (n - 1)), why: "Tohle je počet obsazení jen prvních dvou míst. Ke každému z nich se ještě vybírá třetí místo." },
      { value: f(n + (n - 1) + (n - 2)), why: SOUCET_MIST },
    ];
    return buildChoiceTask(q, f(key), dis, {
      hints: [
        "Obsazuj místa postupně: kolik závodníků může být první a kolik jich pak zbývá na druhé a třetí místo?",
        "Kdo už na některém místě je, na další místo nemůže. Počty voleb pro jednotlivá místa vynásob.",
      ],
      solutionSteps: [
        `První místo: ${moz(n)}.`,
        `Druhé místo: ${moz(n - 1)}; třetí místo: ${moz(n - 2)}, protože nikdo nemůže obsadit dvě místa.`,
        `${f(n)} · ${f(n - 1)} · ${f(n - 2)} = ${f(key)}.`,
      ],
      explanation: `Na pořadí záleží, proto se místa obsazují jedno po druhém a každé další má o jednu volbu méně: ${f(n)} · ${f(n - 1)} · ${f(n - 2)} = ${f(key)}.`,
    });
  }
  const key = n * (n - 1);
  const dis: Distractor[] = [
    { value: f(n * n), why: vic },
    ...shuffle<Distractor>([
      {
        value: f((n * (n - 1)) / 2),
        why: "Tohle číslo bere jako stejný výsledek, když si dva závodníci místa prohodí. První a druhé místo jsou ale rozdílná, na pořadí záleží.",
      },
      { value: f(n + (n - 1)), why: SOUCET_MIST },
    ]),
  ];
  return buildChoiceTask(q, f(key), dis, {
    hints: [
      "Obsazuj místa postupně: kolik závodníků může být první a kolik jich pak zbývá na druhé místo?",
      "Vítěz už na druhé místo nemůže. Záleží tu na pořadí, takže prohozená dvojice je jiný výsledek. Počty voleb vynásob.",
    ],
    solutionSteps: [
      `První místo: ${moz(n)}.`,
      `Druhé místo: vítěz už je určený, tedy ${moz(n - 1)}.`,
      `${f(n)} · ${f(n - 1)} = ${f(key)}.`,
    ],
    explanation: `Na pořadí záleží: kdo vyhraje a kdo je druhý, jsou dvě různé informace. Proto se nedělí dvěma a výsledek je ${f(n)} · ${f(n - 1)} = ${f(key)}.`,
  });
}

type Podminka = {
  text: string;
  mn: string;
  vyhovuje: (c: number) => boolean;
  /** Typická chyba právě u této podmínky: počet číslic, se kterým žák počítá. */
  chyba?: { m: number; why: string };
};
const PODMINKY: Podminka[] = [
  { text: "lichá", mn: "liché", vyhovuje: (c) => c % 2 === 1 },
  { text: "sudá", mn: "sudé", vyhovuje: (c) => c % 2 === 0, chyba: { m: 4, why: "Tady chybí nula. I nula je sudá číslice." } },
  { text: "větší než 5", mn: "větší než 5", vyhovuje: (c) => c > 5, chyba: { m: 5, why: "Tady je započítaná i pětka. Ta ale není větší než 5." } },
  { text: "menší než 4", mn: "menší než 4", vyhovuje: (c) => c < 4, chyba: { m: 3, why: "Tady chybí nula. I nula je menší než 4." } },
];
const PISMENA = ["A", "B", "C", "D", "E"];

function genL2Kod(): PracticeTask | null {
  const p = pick(PODMINKY);
  const k = rnd(2, 5);
  const vyhovujici = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(p.vyhovuje);
  const m = vyhovujici.length;
  const key = k * m;
  const q = `Kód skříňky se skládá z jednoho písmene a jedné číslice za ním. Písmeno je ${vycet(PISMENA.slice(0, k), "nebo")} a číslice musí být ${p.text}. Kolik různých kódů je možných?`;
  const dis: Distractor[] = [
    ...(p.chyba ? [{ value: f(k * p.chyba.m), why: p.chyba.why }] : []),
    ...shuffle<Distractor>([
      { value: f(k * 10), why: `Tohle je počet kódů s jakoukoli číslicí. Zadání ale připouští jen číslice, které jsou ${p.mn}.` },
      { value: f(k + m), why: "Tohle je součet počtů. Ke každému písmenu ale jde připojit kteroukoli vyhovující číslici, takže se počty násobí." },
      { value: f(m), why: "Tohle je jen počet vyhovujících číslic. Každá z nich se ale může spojit s kterýmkoli z písmen." },
    ]),
  ];
  return buildChoiceTask(q, f(key), dis, {
    hints: [
      "Nejdřív spočítej, kolik písmen a kolik číslic vyhovuje zadání.",
      "Vypiš si všechny číslice od nuly do devítky a u každé rozhodni, jestli podmínku splňuje. Pak počty voleb pro písmeno a číslici vynásob.",
    ],
    solutionSteps: [
      `Písmeno: ${moz(k)}.`,
      `Číslice, které jsou ${p.mn}: ${vyhovujici.join(", ")}, tedy ${moz(m)}.`,
      `${f(k)} · ${f(m)} = ${f(key)}.`,
    ],
    explanation: `Ke každému písmenu jde připojit kteroukoli vyhovující číslici. Podmínka omezuje jen číslici, proto se nejdřív vypíšou číslice ${vyhovujici.join(", ")} a jejich počet se vynásobí počtem písmen.`,
  });
}

// ── L3 — nezáleží na pořadí, podmínka na konci, tabulková hádanka ────────
/**
 * L3 střídá typy pravidelně, ne náhodně: sezení bere prvních šest úloh a
 * náhodný výběr jednou dal čtyřikrát „každý s každým“. Pořadí typů je
 * zamíchané, jen „každý s každým“ jde v každém kole poslední — mezi prvními
 * šesti úlohami je tedy právě jednou.
 */
function genL3Sezeni(): PracticeTask[] {
  const typy = [...shuffle([genL3Hadanka, genL3Podminka, genL3Vybor]), genL3Dvojice];
  const bloky = typy.map((tvor) => ruzneUlohy(() => losUlohy(tvor), 6));
  const out: PracticeTask[] = [];
  for (let kolo = 0; kolo < 6; kolo++) {
    for (const b of bloky) if (b[kolo]) out.push(b[kolo]);
  }
  return out;
}

// ── L3 — dvoukrokový výběr s podmínkou ───────────────────────────────────
const DIVKY: Tvary = ["dívka", "dívky", "dívek"];
const CHLAPCI: Tvary = ["chlapec", "chlapci", "chlapců"];

function genL3Vybor(): PracticeTask | null {
  const dv = rnd(2, 5);
  const ch = rnd(2, 5);
  const holka = Math.random() < 0.5;
  const d = holka ? dv : ch; // skupina, ze které musí být předseda
  const o = holka ? ch : dv;
  const n = dv + ch;
  const key = d * (n - 1);
  const kdo = holka ? "dívka" : "chlapec";
  const jiny = holka ? "chlapec" : "dívka";
  const stejny = holka ? "další dívka" : "další chlapec";
  const q = `Výbor třídy tvoří ${pocet(dv, DIVKY)} a ${pocet(ch, CHLAPCI)}. Volí se předseda a místopředseda a každou funkci dostane jiný člen výboru. Předsedou musí být ${kdo}, místopředsedou může být kterýkoli jiný člen výboru. Kolika způsoby lze obě funkce obsadit?`;
  const dis: Distractor[] = [
    { value: f(n * (n - 1)), why: `Tady může být předsedou kdokoli. Zadání ale předsedu omezuje: musí to být ${kdo}.` },
    { value: f(d * o), why: `Tady je místopředsedou jen ${jiny}. Místopředsedou ale může být i ${stejny}.` },
    ...shuffle<Distractor>([
      { value: f(d * (d - 1)), why: `Tady je místopředsedou jen ${stejny}. Místopředsedou ale může být i ${jiny}.` },
      { value: f(d * n), why: "Tady může být předseda zároveň místopředsedou. Každou funkci ale dostane jiný člen výboru." },
      {
        value: f(d + (n - 1)),
        why: "Tohle je součet počtů voleb pro obě funkce. Ke každému předsedovi ale jde vybrat kteréhokoli z možných místopředsedů, proto se počty násobí.",
      },
    ]),
  ];
  return buildChoiceTask(q, f(key), dis, {
    hints: [
      "Obsazuj funkce postupně a začni tou, která má podmínku: kdo všechno může být předsedou?",
      `Místopředsedou může být kdokoli z výboru kromě už zvoleného předsedy, tedy i ${stejny}. Počty voleb pro obě funkce pak vynásob.`,
    ],
    solutionSteps: [
      `Předsedou může být jen ${kdo}, tedy ${moz(d)}.`,
      `Místopředsedou může být kterýkoli člen výboru kromě předsedy, ${jiny} i ${stejny}, tedy ${moz(n - 1)}.`,
      `${f(d)} · ${f(n - 1)} = ${f(key)}.`,
    ],
    explanation: `Nejdřív se obsadí funkce s podmínkou, tedy předseda. Místopředsedou pak může být kterýkoli jiný člen výboru, i ${stejny}, proto má vždy stejný počet voleb. Počty voleb se vynásobí: ${f(d)} · ${f(n - 1)} = ${f(key)}.`,
  });
}

type KontextDvojic = {
  otazka: (n: number) => string;
  dvakrat: string;
  sebou: string;
  jeden: string;
  /** „nový zápas / nové zápasy / nových zápasů“ — co přibývá při systematickém výpisu. */
  novych: Tvary;
  kazdy: string;
  kdo: string;
  jednotka: string;
  h0: string;
  h1: string;
};

const DVOJICE: KontextDvojic[] = [
  {
    otazka: (n) =>
      `Na oslavě se sešlo ${pocet(n, ["kamarád", "kamarádi", "kamarádů"])} a každý si s každým podal ruku právě jednou. Kolik podání ruky proběhlo?`,
    dvakrat: "Tohle číslo počítá každé podání ruky dvakrát: když si Ada podá ruku s Bárou, je to totéž podání jako Bára s Adou. Proto se musí dělit dvěma.",
    sebou: "V tomhle počtu si někdo podává ruku sám se sebou. To se nepočítá, každý podává ruku jen ostatním.",
    jeden: "Tolik podání ruky má za sebou jen jeden kamarád. Ruce si ale podávají i všichni ostatní mezi sebou.",
    novych: ["nové podání ruky", "nová podání ruky", "nových podání ruky"],
    kazdy: "Každý kamarád podá ruku všem ostatním a těch je",
    kdo: "kamaráda",
    jednotka: "podání ruky",
    h0: "Očísluj si kamarády a vypisuj podání ruky systematicky: první se všemi dalšími, druhý se všemi dalšími kromě prvního…",
    h1: "Když počítáš podání ruky u každého kamaráda zvlášť, je každé z nich započítané dvakrát. Nezapomeň to opravit a postup si ověř na malém případě: tři kamarádi si podají ruku třikrát.",
  },
  {
    otazka: (n) =>
      `Turnaje ve florbale se účastní ${pocet(n, ["družstvo", "družstva", "družstev"])}. Každé družstvo hraje s každým jiným právě jeden zápas. Kolik zápasů se odehraje?`,
    dvakrat: "Tohle číslo počítá každý zápas dvakrát: zápas Sokola s Orlem je tentýž jako zápas Orla se Sokolem. Proto se musí dělit dvěma.",
    sebou: "V tomhle počtu hraje některé družstvo samo se sebou. Takový zápas se nehraje.",
    jeden: "Tolik zápasů odehraje jen jedno družstvo. Zápasy mezi sebou ale hrají i všechna ostatní družstva.",
    novych: ["nový zápas", "nové zápasy", "nových zápasů"],
    kazdy: "Každé družstvo hraje se všemi ostatními a těch je",
    kdo: "družstva",
    jednotka: "zápasy",
    h0: "Očísluj si družstva a vypisuj zápasy systematicky: první družstvo se všemi dalšími, druhé se všemi dalšími kromě prvního…",
    h1: "Když počítáš zápasy u každého družstva zvlášť, je každý zápas započítaný dvakrát. Nezapomeň to opravit a postup si ověř na malém případě: tři družstva odehrají tři zápasy.",
  },
  {
    otazka: (n) =>
      `Ve skupince je ${pad(n, "ŽÁK")}. Učitelka z nich vybírá dvojici, která bude mít službu. Kolik různých dvojic může vybrat?`,
    dvakrat: "Tohle číslo počítá každou dvojici dvakrát: Ada a Bára je stejná dvojice jako Bára a Ada. Proto se musí dělit dvěma.",
    sebou: "V tomhle počtu je i „dvojice“, ve které je jeden žák dvakrát. Dvojici ale tvoří dva různí žáci.",
    jeden: "Tolik dvojic může vytvořit jen jeden žák. Dvojice spolu tvoří i ostatní žáci.",
    novych: ["nová dvojice", "nové dvojice", "nových dvojic"],
    kazdy: "Každý žák může být ve dvojici s kterýmkoli z ostatních a těch je",
    kdo: "žáka",
    jednotka: "dvojice",
    h0: "Očísluj si žáky a vypisuj dvojice systematicky: první žák se všemi dalšími, druhý se všemi dalšími kromě prvního…",
    h1: "Když počítáš dvojice u každého žáka zvlášť, je každá dvojice započítaná dvakrát. Nezapomeň to opravit a postup si ověř na malém případě: ze tří žáků jdou vybrat tři různé dvojice.",
  },
  {
    otazka: (n) =>
      `Na mapě je ${pocet(n, ["město", "města", "měst"])} a každá dvě z nich spojuje jedna přímá silnice. Kolik silnic je na mapě?`,
    dvakrat: "Tohle číslo počítá každou silnici dvakrát: silnice z města A do města B je tatáž jako z B do A. Proto se musí dělit dvěma.",
    sebou: "V tomhle počtu vede silnice i z města do téhož města. Takové silnice na mapě nejsou.",
    jeden: "Tolik silnic vede jen z jednoho města. Silnice spojují i ostatní města mezi sebou.",
    novych: ["nová silnice", "nové silnice", "nových silnic"],
    kazdy: "Z každého města vede silnice do všech ostatních a těch je",
    kdo: "města",
    jednotka: "silnice",
    h0: "Očísluj si města a vypisuj silnice systematicky: z prvního do všech dalších, z druhého do všech dalších kromě prvního…",
    h1: "Když počítáš silnice u každého města zvlášť, je každá silnice započítaná dvakrát. Nezapomeň to opravit a postup si ověř na malém případě: tři města spojují tři silnice.",
  },
];

function genL3Dvojice(): PracticeTask | null {
  const k = pick(DVOJICE);
  const n = rnd(5, 9);
  const s = n * (n - 1);
  const key = s / 2;
  // Dvojí započtení (větší než klíč) a počet u jednoho (menší) jsou v nabídce
  // vždy, klíč tak nikdy není krajní možnost.
  const dis: Distractor[] = [
    { value: f(s), why: k.dvakrat },
    { value: f(n - 1), why: k.jeden },
    ...shuffle<Distractor>([
      { value: f(n * n), why: k.sebou },
      {
        // Omyl o jedna při systematickém výpisu: 1 + 2 + … + n místo … + (n − 1).
        value: f((n * (n + 1)) / 2),
        why: `Tady je v součtu o jeden sčítanec navíc: 1 + 2 + … + ${f(n)}. Při systematickém výpisu ${plural(n - 1, "přibude", "přibudou", "přibude")} u prvního v pořadí jen ${pocet(n - 1, k.novych)}, u každého dalšího o 1 méně a u posledního už nic. Sčítá se tedy jen 1 + 2 + … + ${f(n - 1)}.`,
      },
    ]),
  ];
  return buildChoiceTask(k.otazka(n), f(key), dis, {
    hints: [k.h0, k.h1],
    solutionSteps: [
      `${k.kazdy} ${f(n - 1)}.`,
      `Když se ${k.jednotka} spočítají u každého ${k.kdo} zvlášť, vyjde ${f(n)} · ${f(n - 1)} = ${f(s)}.`,
      `Každá dvojice je tam ale dvakrát, jednou u každého z obou. Proto ${f(s)} : 2 = ${f(key)}.`,
    ],
    explanation: `Na pořadí tu nezáleží: dvojice A a B je totéž co B a A. Součin ${f(n)} · ${f(n - 1)} proto každou dvojici započítá dvakrát a správný počet je jeho polovina, ${f(key)}.`,
  });
}

function genL3Podminka(): PracticeTask | null {
  const smi = Math.random() < 0.5;
  const opak = smi ? "smějí" : "nesmějí";
  const dopln = (nula: boolean) =>
    `Pak zjisti, kolik číslic zbývá na místo desítek, a hlídej opakování${nula ? " i nulu na začátku" : ""}. Když může číslo končit více způsoby, spočítej každý zvlášť.`;
  if (Math.random() < 0.5) {
    // Sudá čísla z nenulových číslic
    const n = rnd(4, 5);
    const c = cifry(n, false);
    const sude = c.filter((x) => x % 2 === 0);
    const e = sude.length;
    if (e === 0 || e === n) return null;
    const d = pick(sude);
    const desitky = smi ? n : n - 1;
    const key = e * desitky;
    if (klicVZadani(key, c)) return null;
    const dis: Distractor[] = [
      smi
        ? { value: f(n * n), why: "Tohle je počet všech dvojmístných čísel z těchto číslic. Otázka ale chce jen sudá, a ta musí končit sudou číslicí." }
        : { value: f(n * (n - 1)), why: "Tohle je počet všech dvojmístných čísel bez opakování. Otázka ale chce jen sudá, a ta musí končit sudou číslicí." },
      ...shuffle<Distractor>([
        smi
          ? { value: f(e * (n - 1)), why: `Tady chybí čísla se dvěma stejnými číslicemi, třeba ${d}${d}. Zadání opakování dovoluje.` }
          : { value: f(e * n), why: `Tady jsou započítaná i čísla se dvěma stejnými číslicemi, třeba ${d}${d}. Zadání opakování zakazuje.` },
        { value: f(e), why: "Tohle je jen počet voleb pro místo jednotek. Ke každé sudé číslici se ještě vybírá číslice na místo desítek." },
        { value: f(e + desitky), why: SOUCET_MIST },
      ]),
    ];
    const q = `Kolik sudých dvojmístných čísel můžeš sestavit z číslic ${vycet(c.map(f))}, když se číslice v čísle ${opak} opakovat?`;
    return buildChoiceTask(q, f(key), dis, {
      hints: ["Začni místem, které má podmínku: jakou číslicí musí končit sudé číslo?", dopln(false)],
      solutionSteps: [
        `Místo jednotek musí obsadit sudá číslice (${vycet(sude.map(f))}), tedy ${moz(e)}.`,
        smi
          ? `Místo desítek: kterákoli zadaná číslice, i stejná, tedy ${moz(n)}.`
          : `Místo desítek: kterákoli jiná zadaná číslice, tedy ${moz(n - 1)}.`,
        `${f(e)} · ${f(desitky)} = ${f(key)}.`,
      ],
      explanation: `Nejdřív se obsadí místo s podmínkou: sudé číslo končí sudou číslicí. Pak se k ní vybírá číslice desítek${
        smi ? ", která se smí opakovat" : ", která už nesmí být stejná"
      }. Počty voleb se vynásobí: ${f(e)} · ${f(desitky)} = ${f(key)}.`,
    });
  }

  // Dělitelnost pěti: mezi číslicemi je nula i pětka
  const n = rnd(4, 6);
  const ostatni = shuffle([1, 2, 3, 4, 6, 7, 8, 9]).slice(0, n - 2);
  const c = [0, 5, ...ostatni].sort((x, y) => x - y);
  const naNulu = n - 1;
  const naPetku = smi ? n - 1 : n - 2;
  const key = naNulu + naPetku;
  if (klicVZadani(key, c)) return null;
  const jenNula = { value: f(naNulu), why: "Tohle jsou jen čísla končící nulou. Dělitelná pěti jsou i čísla končící pětkou." };
  // Jediná chyba: podmínka dělitelnosti chybí, nula na začátku je ale ohlídaná.
  const bezKonce = {
    value: f(smi ? (n - 1) * n : (n - 1) * (n - 1)),
    why: "Tohle je počet všech dvojmístných čísel z těchto číslic. Otázka ale chce jen čísla dělitelná pěti, a ta končí nulou nebo pětkou.",
  };
  const dis: Distractor[] = smi
    ? [
        { value: f(2 * n), why: "Tady jsou započítaná i „čísla“ 00 a 05. Dvojmístné číslo nulou začínat nemůže." },
        ...shuffle<Distractor>([
          { value: f(2 * n - 3), why: "Tady chybí čísla se dvěma stejnými číslicemi, třeba 55. Zadání opakování dovoluje." },
          jenNula,
          bezKonce,
        ]),
      ]
    : [
        { value: f(2 * n - 2), why: "Tady je započítané i „číslo“ 05. Dvojmístné číslo nulou začínat nemůže." },
        ...shuffle<Distractor>([
          jenNula,
          { value: f(n - 2), why: "Tohle jsou jen čísla končící pětkou. Dělitelná pěti jsou i čísla končící nulou." },
          bezKonce,
        ]),
      ];
  const q = `Kolik dvojmístných čísel dělitelných pěti můžeš sestavit z číslic ${vycet(c.map(f))}, když se číslice v čísle ${opak} opakovat?`;
  return buildChoiceTask(q, f(key), dis, {
    hints: ["Začni místem, které má podmínku: jakou číslicí může končit číslo dělitelné pěti?", dopln(true)],
    solutionSteps: [
      "Číslo dělitelné pěti končí nulou, nebo pětkou. Oba případy se spočítají zvlášť.",
      `Končí nulou: na místě desítek může stát kterákoli jiná číslice, tedy ${moz(naNulu)}.`,
      smi
        ? `Končí pětkou: na místě desítek může stát kterákoli číslice kromě nuly (i pětka), tedy ${moz(naPetku)}.`
        : `Končí pětkou: na místě desítek nesmí stát nula ani pětka, tedy ${moz(naPetku)}.`,
      `${f(naNulu)} + ${f(naPetku)} = ${f(key)}.`,
    ],
    explanation: `Omezené je místo jednotek: číslo dělitelné pěti končí nulou, nebo pětkou. Každý konec se spočítá zvlášť a výsledky se sečtou, protože číslo nemůže končit obojím zároveň. Na místě desítek nula stát nesmí${
      smi ? "" : " a použitá číslice se nesmí opakovat"
    }.`,
  });
}

// ── L3 — tabulková hádanka ────────────────────────────────────────────────
type Jmeno = { nom: string; zena: boolean };
const JMENA: Jmeno[] = [
  ...["Adam", "Petr", "Tomáš", "Filip", "Marek", "Ondřej"].map((nom) => ({ nom, zena: false })),
  ...["Eva", "Jana", "Klára", "Lucie", "Ema", "Tereza"].map((nom) => ({ nom, zena: true })),
];

type Kategorie = {
  uvod: string;
  /** „hraje jen jeden sport“ */
  jen: string;
  mn: string;
  verb: string;
  neg: string;
  items: string[];
  /** „Tenis hraje Eva“ / „Na housle hraje Eva“ (slovo `vlozka` za předmětem). */
  inv: (x: string, kdo: string, vlozka?: string) => string;
};

const KATEGORIE: Kategorie[] = [
  {
    uvod: "hraje jiný sport",
    jen: "hraje jen jeden sport",
    mn: "sporty",
    verb: "hraje",
    neg: "nehraje",
    items: ["fotbal", "tenis", "florbal", "volejbal", "basketbal", "hokej", "badminton"],
    inv: (x, kdo, v) => `${cap(x)}${v ? ` ${v}` : ""} hraje ${kdo}`,
  },
  {
    uvod: "má jiné zvíře",
    jen: "má jen jedno zvíře",
    mn: "zvířata",
    verb: "má",
    neg: "nemá",
    items: ["psa", "kočku", "morče", "křečka", "králíka", "papouška"],
    inv: (x, kdo, v) => `${cap(x)}${v ? ` ${v}` : ""} má ${kdo}`,
  },
  {
    uvod: "hraje na jiný nástroj",
    jen: "hraje jen na jeden nástroj",
    mn: "nástroje",
    verb: "hraje na",
    neg: "nehraje na",
    items: ["klavír", "kytaru", "flétnu", "housle", "trubku", "bicí"],
    inv: (x, kdo, v) => `Na ${x}${v ? ` ${v}` : ""} hraje ${kdo}`,
  },
];

/** Všechna přiřazení osoba → věc (perm[i] = index věci osoby i). */
function permutace(n: number): number[][] {
  if (n === 0) return [[]];
  const out: number[][] = [];
  for (const p of permutace(n - 1)) {
    for (let i = 0; i <= p.length; i++) out.push([...p.slice(0, i), n - 1, ...p.slice(i)]);
  }
  return out;
}
const PERM4 = permutace(4);

function genL3Hadanka(): PracticeTask | null {
  const kat = pick(KATEGORIE);
  const deti = shuffle(JMENA).slice(0, 4);
  const veci = shuffle(kat.items).slice(0, 4);
  const pravda = shuffle([0, 1, 2, 3]);
  const pp = rnd(0, 3);

  const kandidati: [number, number][] = [];
  for (let i = 0; i < 4; i++) {
    if (i === pp) continue;
    for (let j = 0; j < 4; j++) if (j !== pravda[pp] && j !== pravda[i]) kandidati.push([i, j]);
  }
  const negace = shuffle(kandidati).slice(0, 3);
  const vyhovuje = (perm: number[]) => perm[pp] === pravda[pp] && negace.every(([i, j]) => perm[i] !== j);
  if (PERM4.filter(vyhovuje).length !== 1) return null;

  // Hledaná věc: nesmí jít vyčíst z jediného výroku.
  const moznaX = [0, 1, 2, 3].filter((j) => {
    if (j === pravda[pp]) return false;
    const osoba = pravda.indexOf(j);
    return negace.filter((x) => x[1] === j).length <= 1 && negace.filter((x) => x[0] === osoba).length <= 1;
  });
  if (moznaX.length === 0) return null;
  const x = pick(moznaX);
  const klic = pravda.indexOf(x);

  // Výroky
  const posVeta = `${kat.inv(veci[pravda[pp]], deti[pp].nom)}.`;
  // Samé dívky → „ta, která“; jinak obecné „ten, kdo“.
  // Skryté výroky jsou jen vztahy, které si nemohou odporovat ani spolu, ani
  // s tím, že jsou děti kamarádi (žádní sourozenci, žádné „bydlí vedle“).
  // Jediný možný spor — kruh ve věku — hlídá kontrola níž.
  const holky = deti.every((d) => d.zena);
  const ten = holky ? "ta, která" : "ten, kdo";
  const toho = holky ? "té, která" : "toho, kdo";
  const SKRYTE = ["o věku", "o třídě", "o půjčeném sešitu"];
  const pouzite = new Set<number>();
  const starsi: [number, number][] = [];
  const negVety = negace.map(([i, j]) => {
    const P = deti[i];
    const v = veci[j];
    const forma = Math.random() < 0.4 ? 0 : rnd(1, 3);
    if (forma > 0) pouzite.add(forma);
    switch (forma) {
      case 1:
        starsi.push([pravda.indexOf(j), i]);
        return `${cap(ten)} ${kat.verb} ${v}, je starší než ${P.nom}.`;
      case 2: return `${P.nom} chodí do jiné třídy než ${ten} ${kat.verb} ${v}.`;
      case 3: return `${P.nom} si včera ${P.zena ? "půjčila" : "půjčil"} sešit od ${toho} ${kat.verb} ${v}.`;
      default: return `${P.nom} ${kat.neg} ${v}.`;
    }
  });
  // „A je starší než B“ a „B je starší než A“ (i přes prostředníka) nesmí nastat.
  const starsiNez = (a: number, b: number, hloubka = 0): boolean =>
    hloubka < 4 && starsi.some(([x, y]) => x === a && (y === b || starsiNez(y, b, hloubka + 1)));
  if ([0, 1, 2, 3].some((a) => starsiNez(a, a))) return null;
  const skryteTypy = [...pouzite].sort().map((k) => SKRYTE[k - 1]);
  const skryte = skryteTypy.length > 0;
  const vety = shuffle([posVeta, ...negVety]);

  // Řešení propagací (jen jisté kroky) — zdroj solutionSteps.
  const volne = [0, 1, 2, 3].map(() => [true, true, true, true]);
  const pevne = new Map<number, number>();
  const zafixuj = (i: number, j: number) => {
    pevne.set(i, j);
    for (let k = 0; k < 4; k++) {
      volne[i][k] = k === j;
      volne[k][j] = k === i;
    }
  };
  const kroky: string[] = [
    `Výrok „${posVeta}“ je jistá dvojice. V jejím řádku i sloupci se všechna ostatní políčka vyškrtnou: nikdo jiný ${kat.neg} ${veci[pravda[pp]]}.`,
  ];
  zafixuj(pp, pravda[pp]);
  for (const [i, j] of negace) volne[i][j] = false;
  kroky.push(
    `Z ostatních výroků plyne: ${vycet(negace.map(([i, j]) => `${deti[i].nom} ${kat.neg} ${veci[j]}`))}.`,
  );
  while (pevne.size < 4) {
    let krok = false;
    for (let i = 0; i < 4 && !krok; i++) {
      if (pevne.has(i)) continue;
      const zbyva = [0, 1, 2, 3].filter((j) => volne[i][j]);
      if (zbyva.length === 1) {
        zafixuj(i, zbyva[0]);
        kroky.push(`${deti[i].nom} tedy ${kat.verb} ${veci[zbyva[0]]}, ostatní možnosti už jsou vyškrtnuté.`);
        krok = true;
      }
    }
    for (let j = 0; j < 4 && !krok; j++) {
      if ([...pevne.values()].includes(j)) continue;
      const kdo = [0, 1, 2, 3].filter((i) => volne[i][j]);
      if (kdo.length === 1) {
        zafixuj(kdo[0], j);
        kroky.push(`${kat.inv(veci[j], deti[kdo[0]].nom, "tedy")}, nikdo jiný to už být nemůže.`);
        krok = true;
      }
    }
    if (!krok) return null;
  }
  if ([0, 1, 2, 3].some((i) => pevne.get(i) !== pravda[i])) return null;

  const optionFeedback: Record<string, string> = {};
  for (let i = 0; i < 4; i++) {
    if (i === klic) continue;
    const primo = negace.findIndex(([a, b]) => a === i && b === x);
    optionFeedback[deti[i].nom] =
      i === pp
        ? `Tahle možnost porušuje výrok „${posVeta}“ Každé dítě ${kat.jen}.`
        : primo >= 0
          ? `Tahle možnost porušuje výrok „${negVety[primo]}“`
          : `Přímo to žádný výrok nezakazuje, ale z výroků vyplývá, že ${deti[i].nom} ${kat.verb} ${veci[pravda[i]]}.`;
  }

  const question =`${vycet(deti.map((d) => d.nom))} jsou ${holky ? "kamarádky a každá" : "kamarádi a každý"} z nich ${kat.uvod}: ${vycet(veci, "nebo")}. ${vety.join(" ")} Kdo ${kat.verb} ${veci[x]}?`;
  return {
    question,
    correctAnswer: deti[klic].nom,
    options: shuffle(deti.map((d) => d.nom)),
    optionFeedback,
    hints: [
      `Nakresli si tabulku: jména do řádků, ${kat.mn} do sloupců. Hledáš, kdo ${kat.verb} ${veci[x]}; každý výrok zapiš jako jisté políčko nebo jako křížek.`,
      `Začni jistou dvojicí a vyškrtej zbytek jejího řádku i sloupce. ${
        skryte
          ? `Pozor, i věta ${vycet(skryteTypy, "nebo")} vylučuje jednu dvojici, protože mluví o dvou různých dětech.`
          : "Každý zápor ve výroku je jeden křížek."
      } Pak hledej řádek nebo sloupec s jediným volným políčkem.`,
    ],
    solutionSteps: kroky,
    explanation: `Výroky se nejlépe zpracují v tabulce. Nejdřív se zapíše jistá dvojice, pak se vyškrtají dvojice, které výroky zakazují${
      skryte ? ` (i ty skryté ve ${skryteTypy.length === 1 ? "větě" : "větách"} ${vycet(skryteTypy)})` : ""
    }. Kde v řádku nebo sloupci zbude jediné volné políčko, je rozhodnuto. Postupným vyškrtáváním vyjde, že ${kat.inv(veci[x], deti[klic].nom).replace(/^./, (c) => c.toLowerCase())}.`,
  };
}

// ── Topic ────────────────────────────────────────────────────────────────
export const LOGICKE_UVAHY_KOMBINACNI_USUDEK: TopicMetadata[] = [
  {
    id: "g6-mat-logicke-uvahy-kombinacni-usudek-6",
    rvpNodeId: "g6-matematika-nestandardni-aplikacni-ulohy-a-problemy-logicke-ulohy-logicke-uvahy-kombinacni-usudek",
    displayName: "Kombinační úsudek",
    title: "Logické úvahy, kombinační úsudek",
    studentTitle: "Kolik je možností?",
    subject: "matematika",
    category: "Nestandardní aplikační úlohy a problémy",
    topic: "Logické úlohy",
    briefDescription: "Počítáš všechny možnosti a řešíš logické hádanky krok za krokem.",
    keywords: [
      "kombinatorika", "kombinační úsudek", "pravidlo součinu", "stromeček", "počet možností",
      "dvojmístná čísla", "každý s každým", "podání ruky", "logická hádanka", "vylučování",
      "stupně vítězů", "systematický výpis",
    ],
    goals: [
      "Spočítat všechny výběry ze dvou nebo tří nezávislých skupin pravidlem součinu.",
      "Určit počet voleb na jednotlivých místech (bez opakování, s opakováním, s nulou) a vynásobit je.",
      "Rozlišit, kdy na pořadí nezáleží, a nezapočítat dvojici dvakrát; vyřešit logickou hádanku vylučováním.",
    ],
    boundaries: [
      "Bez pojmů kombinační číslo, faktoriál a mocnina (střední škola a 8. ročník).",
      "Výsledky nejvýš v řádu stovek, čísla nejvýš trojmístná.",
      "Tabulková hádanka má čtyři děti, čtyři možnosti a jediné řešení.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Když se vybírá postupně z více skupin nebo míst, počty voleb se násobí. Když na pořadí nezáleží, je v součinu každá dvojice dvakrát, proto se dělí dvěma.",
      steps: [
        "Urči, z čeho se vybírá: skupiny, místa v čísle, nebo dvojice.",
        "U každého místa zjisti počet voleb; nejdřív obsaď místo s podmínkou (nula, sudost, dělitelnost).",
        "Počty voleb vynásob. Pokud na pořadí nezáleží, výsledek vyděl dvěma.",
      ],
      commonMistake: "Počty voleb sečíst místo vynásobit, zapomenout na zákaz opakování nebo nulu na začátku a u podání ruky počítat každou dvojici dvakrát.",
      example: "Z číslic 0, 3, 5, 7 bez opakování: na místo desítek 3 volby (bez nuly), na místo jednotek 3 volby, tedy 3 · 3 = 9 dvojmístných čísel.",
    },
  },
];
