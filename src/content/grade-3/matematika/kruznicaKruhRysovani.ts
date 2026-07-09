import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * PED-3 kalibrace L1<L2<L3 a naplnění L3.
 *
 * Před: `pool = level <= 2 ? POOL_L1 : [...POOL_L1, ...POOL_L2]` → L1 a L2 měly
 * IDENTICKÝ obsah, L2 se v `getTierTasks` (rozdíl množin) vyprázdnila.
 * L3 mělo jen 5 nových otázek (POOL_L2). Audit reportoval `24/0/15 max L3
 * ⚠ chybí těžší`.
 *
 * Teď: disjunktní pooly L1/L2/L3 podle dovednosti:
 *   L1 — pojmy (kružnice vs kruh, poloměr, průměr, kružítko).
 *   L2 — vztahy a jednoduché převody (r = d÷2, tětiva, shodné/soustředné).
 *   L3 — aplikace: slovní výpočty s většími čísly, vztah k soustředným
 *        kružnicím, rozliš úlohy „poloměr → průměr" a naopak, odečtení
 *        průměru kružnic v dvojici.
 */

interface Item {
  q: string;
  a: string;
  opts: string[];
}

const POOL_L1: Item[] = [
  { q: "Co je kružnice?", a: "Čára, jejíž každý bod je stejně daleko od středu", opts: ["Čára, jejíž každý bod je stejně daleko od středu", "Vyplněný kulatý tvar", "Čtverec zaoblený", "Polovina koule"] },
  { q: "Co je kruh?", a: "Plocha ohraničená kružnicí (vyplněný)", opts: ["Plocha ohraničená kružnicí (vyplněný)", "Jen obvod kruhu", "Čtverec se zaoblenými rohy", "Polovina kružnice"] },
  { q: "Jaký nástroj použijeme k narýsování kružnice?", a: "Kružítko", opts: ["Kružítko", "Pravítko", "Úhloměr", "Šablonu"] },
  { q: "Co je poloměr kružnice?", a: "Vzdálenost od středu ke kružnici", opts: ["Vzdálenost od středu ke kružnici", "Délka celé kružnice", "Vzdálenost dvou bodů na kružnici", "Polovina kružnice"] },
  { q: "Co je průměr kružnice?", a: "Dvojnásobek poloměru (prochází středem)", opts: ["Dvojnásobek poloměru (prochází středem)", "Polovina poloměru", "Délka oblouku", "Vzdálenost středů dvou kružnic"] },
  { q: "Kružnice má poloměr 3 cm. Jaký je její průměr?", a: "6 cm", opts: ["6 cm", "3 cm", "9 cm", "1,5 cm"] },
  { q: "Kružnice má průměr 10 cm. Jaký je její poloměr?", a: "5 cm", opts: ["5 cm", "10 cm", "20 cm", "2 cm"] },
  { q: "Jak nastavíme kružítko pro kružnici s poloměrem 4 cm?", a: "Rozevřeme kružítko na 4 cm", opts: ["Rozevřeme kružítko na 4 cm", "Rozevřeme kružítko na 8 cm", "Rozevřeme kružítko na 2 cm", "Kružítko nenastavujeme"] },
];

const POOL_L2: Item[] = [
  { q: "Kolik středů může mít kružnice?", a: "Jeden", opts: ["Jeden", "Dva", "Tři", "Nekonečně mnoho"] },
  { q: "Jak se nazývá úsečka spojující dva body kružnice?", a: "Tětiva", opts: ["Tětiva", "Průměr", "Poloměr", "Oblouk"] },
  { q: "Průměr d = 14 cm. Poloměr r = ?", a: "7 cm", opts: ["7 cm", "14 cm", "28 cm", "3,5 cm"] },
  { q: "Co platí: průměr = ?", a: "2 × poloměr", opts: ["2 × poloměr", "poloměr ÷ 2", "3 × poloměr", "poloměr + 1"] },
  { q: "Kružnice o poloměru 5 cm a kružnice o poloměru 5 cm jsou:", a: "Stejně velké (shodné)", opts: ["Stejně velké (shodné)", "Různě velké", "Soustředné", "Různoběžné"] },
  { q: "Průměr d = 8 cm. Poloměr r = ?", a: "4 cm", opts: ["4 cm", "16 cm", "8 cm", "2 cm"] },
  { q: "Poloměr r = 9 cm. Průměr d = ?", a: "18 cm", opts: ["18 cm", "4,5 cm", "9 cm", "27 cm"] },
  { q: "Nejdelší tětiva v kružnici je:", a: "Průměr", opts: ["Průměr", "Poloměr", "Oblouk", "Tečna"] },
  { q: "Dvě kružnice se stejným středem, ale různým poloměrem, se nazývají:", a: "Soustředné", opts: ["Soustředné", "Shodné", "Různoběžné", "Souhlasné"] },
];

const POOL_L3: Item[] = [
  // Aplikace: kolo, cíl, koláč — reálný kontext + větší čísla
  { q: "Kolo má poloměr 30 cm. Jaký je průměr kola?", a: "60 cm", opts: ["60 cm", "15 cm", "90 cm", "45 cm"] },
  { q: "Průměr talíře je 24 cm. Jaký je jeho poloměr?", a: "12 cm", opts: ["12 cm", "24 cm", "48 cm", "6 cm"] },
  { q: "Terč má vnější kružnici s poloměrem 15 cm a vnitřní s poloměrem 5 cm. O kolik cm je vnější poloměr větší?", a: "10 cm", opts: ["10 cm", "20 cm", "5 cm", "15 cm"] },
  { q: "Kružnice A má průměr 18 cm, kružnice B poloměr 12 cm. Která má větší průměr?", a: "Kružnice B (24 cm > 18 cm)", opts: ["Kružnice B (24 cm > 18 cm)", "Kružnice A (18 cm > 12 cm)", "Jsou stejné", "Nelze porovnat"] },
  { q: "Řemínek k hodinkám tvoří kružnici s průměrem 6 cm. Jaký poloměr nastavíme kružítko, abychom ji narýsovali?", a: "3 cm", opts: ["3 cm", "6 cm", "12 cm", "1,5 cm"] },
  // Vztah středů — soustředné vs různé středy
  { q: "Dva pizzy mají různé středy a stejný poloměr. Jsou to kružnice…", a: "Shodné, ale ne soustředné", opts: ["Shodné, ale ne soustředné", "Soustředné a shodné", "Soustředné, ale ne shodné", "Různé v každé vlastnosti"] },
  { q: "V hodinách má malá ručička kružnici pohybu s poloměrem 2 cm, velká 3 cm. Jejich středy jsou:", a: "Stejné (soustředné)", opts: ["Stejné (soustředné)", "Různé", "Nelze určit", "Blíží se k sobě"] },
  // Slovní úloha se dvěma kroky
  { q: "Anička dvakrát narýsovala kružnici s poloměrem 7 cm. Jaký průměr má každá z nich?", a: "14 cm", opts: ["14 cm", "7 cm", "28 cm", "3,5 cm"] },
  { q: "Průměr kruhu je 20 cm. Kolik cm je jeho poloměr a jaká je vzdálenost středu k obvodu?", a: "10 cm (poloměr = vzdálenost)", opts: ["10 cm (poloměr = vzdálenost)", "20 cm (obvod)", "40 cm (dvojnásobek)", "5 cm (čtvrtina)"] },
  { q: "Ciferník má poloměr 8 cm. Střed je označen bodem S. Kolik cm musí kružítko projít od S k ciferníku?", a: "8 cm", opts: ["8 cm", "16 cm", "4 cm", "2 cm"] },
  // Tětiva a průměr — vazba
  { q: "V kružnici má tětiva délku rovnou průměru 10 cm. Kudy prochází?", a: "Přes střed kružnice", opts: ["Přes střed kružnice", "Jen po obvodu", "Mimo kružnici", "Kolmo na poloměr"] },
  { q: "Kružnice má poloměr 6 cm. Jak dlouhá je nejdelší tětiva?", a: "12 cm", opts: ["12 cm", "6 cm", "3 cm", "18 cm"] },
];

function pick(pool: Item[]): PracticeTask[] {
  return shuffle(pool).map((item) => ({
    question: item.q,
    correctAnswer: item.a,
    options: shuffle([...item.opts]),
    hints: [
      "Poloměr = polovina průměru (r = d ÷ 2). Průměr = 2 × poloměr (d = 2r).",
      "Kružnice je jen čára (obvod). Kruh je celá plocha uvnitř kružnice. Poloměr jde ze středu k obvodu.",
    ],
  }));
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return pick(pool);
}

export const KRUZNICAAKRUHRYSOVANI: TopicMetadata[] = [
  {
    id: "g3-mat-kruznice-kruh",
    rvpNodeId: "g3-matematika-geometrie-v-rovine-a-v-prostoru-rovinne-utvary-kruznice-a-kruh-rysovani",
    title: "Kružnice a kruh - rýsování",
    studentTitle: "Kružnice a kruh",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Rovinné útvary",
    briefDescription: "Poznáš rozdíl mezi kružnicí a kruhem a naučíš se je narýsovat.",
    keywords: ["kružnice", "kruh", "poloměr", "průměr", "střed", "kružítko", "rýsování"],
    goals: [
      "Rozlišit kružnici (čára) a kruh (plocha).",
      "Narýsovat kružnici kružítkem se zadaným poloměrem.",
      "Vypočítat průměr z poloměru a naopak.",
      "Použít vztah r = d÷2 v jednoduchých slovních úlohách.",
    ],
    boundaries: ["Bez výpočtu obvodu a obsahu kruhu."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Kružnice = jen obvod (jako drát ohnutý do kroužku). Kruh = vnitřek + obvod (jako mince). Poloměr r = vzdálenost od středu. Průměr d = 2 × r.",
      steps: [
        "Označ střed kružnice — bod S.",
        "Nastav kružítko na zadaný poloměr.",
        "Hrot kružítka vlož do středu S.",
        "Otočením kružítka narýsuj kružnici.",
      ],
      commonMistake: "Záměna kružnice a kruhu: kružnice je jen čára, kruh je vyplněná plocha.",
      example: "Poloměr r = 3 cm → průměr d = 6 cm. Nastav kružítko na 3 cm a narýsuj.",
    },
  },
];
