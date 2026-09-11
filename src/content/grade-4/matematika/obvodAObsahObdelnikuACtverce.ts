import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { ciselnaUloha, rnd } from "./_mat";

// Přepsáno 2026-09-11 (audit 4. ročníku). Úlohy měly jedinou obecnou
// nápovědu („Obvod čtverce = 4 × a.“), žádnou zpětnou vazbu k chybným
// možnostem a klíč bez jednotek. Teď mají odpovědi jednotky (cm, cm²)
// a distraktory jsou typické chyby: záměna obvodu a obsahu, polovina
// obvodu, zapomenutá strana, špatná jednotka.
// L1 čtverec · L2 obdélník · L3 zpětné úlohy (strana z obvodu či obsahu).
// V nápovědách se za čísla nepíše „cm“ — „15 cm“ by obsahovalo klíč „5 cm“.

function ctverec(): PracticeTask {
  const a = rnd(3, 15);
  const o = 4 * a, s = a * a;
  if (Math.random() < 0.5) {
    return ciselnaUloha(`Čtverec má stranu ${a} cm. Jaký je jeho obvod?`, `${o} cm`, [
      { value: `${s} cm`, why: `${a} × ${a} je obsah, ne obvod. Obvod je délka čáry kolem čtverce.` },
      { value: `${2 * a} cm`, why: "Sečetly se jen dvě strany. Čtverec má strany čtyři." },
      { value: `${3 * a} cm`, why: "Chybí jedna strana. Čtverec má strany čtyři." },
      { value: `${o} cm²`, why: "Obvod je délka, měří se v centimetrech (cm). Čtvereční centimetry (cm²) patří k obsahu." },
    ], [
      `Čtverec má stranu ${a}. Kolik takových stran obejdeš dokola?`,
      `Obvod je délka čáry kolem celého čtverce. Obejdi ho dokola: čtyřikrát strana ${a}, tedy 4 × ${a}.`,
    ], [`Čtverec má čtyři stejné strany.`, `o = 4 · a = 4 · ${a} = ${o} cm`]);
  }
  return ciselnaUloha(`Čtverec má stranu ${a} cm. Jaký je jeho obsah?`, `${s} cm²`, [
    { value: `${o} cm²`, why: `4 × ${a} je obvod, ne obsah. Obsah je strana krát strana.` },
    { value: `${2 * a} cm²`, why: `${a} + ${a} je součet stran. Obsah je součin: ${a} × ${a}.` },
    { value: `${s} cm`, why: "Obsah je plocha, měří se ve čtverečních centimetrech (cm²)." },
    { value: `${s + a} cm²`, why: "O jednu řadu čtverečků víc. Obsah je přesně strana krát strana." },
  ], [
    `Kolik čtverečků 1 cm × 1 cm pokryje čtverec se stranou ${a}?`,
    `V jedné řadě je tolik čtverečků, kolik měří strana (${a}), a řad je stejně. Obsah je proto ${a} × ${a}.`,
  ], [`Obsah čtverce = strana × strana.`, `S = ${a} · ${a} = ${s} cm²`]);
}

function obdelnik(): PracticeTask {
  const a = rnd(5, 30);
  let b = rnd(3, 20);
  while (b === a) b = rnd(3, 20);
  const o = 2 * (a + b), s = a * b;
  if (Math.random() < 0.5) {
    return ciselnaUloha(`Obdélník má strany ${a} cm a ${b} cm. Jaký je jeho obvod?`, `${o} cm`, [
      { value: `${a + b} cm`, why: `${a} + ${b} je jen polovina obvodu — kolem obdélníku jsou dvě strany ${a} cm a dvě strany ${b} cm.` },
      { value: `${2 * a + b} cm`, why: `Chybí jedna strana ${b} cm. Obdélník má čtyři strany.` },
      { value: `${a + 2 * b} cm`, why: `Chybí jedna strana ${a} cm. Obdélník má čtyři strany.` },
      { value: `${s} cm`, why: `${a} × ${b} je obsah, ne obvod.` },
    ], [
      `Obejdi obdélník dokola: kolikrát půjdeš po straně ${a} a kolikrát po straně ${b}?`,
      `Kolem obdélníku jsou dvě strany ${a} a dvě strany ${b}. Nejdřív sečti ${a} + ${b} a výsledek vezmi dvakrát.`,
    ], [`o = 2 · (a + b)`, `o = 2 · (${a} + ${b}) = 2 · ${a + b} = ${o} cm`]);
  }
  return ciselnaUloha(`Obdélník má strany ${a} cm a ${b} cm. Jaký je jeho obsah?`, `${s} cm²`, [
    { value: `${o} cm²`, why: `2 × (${a} + ${b}) je obvod, ne obsah. Obsah je součin stran.` },
    { value: `${a + b} cm²`, why: "Strany se sečetly. Obsah je jejich součin." },
    { value: `${s} cm`, why: "Obsah je plocha, měří se ve čtverečních centimetrech (cm²)." },
    { value: `${s + a} cm²`, why: `O jednu řadu čtverečků víc — zkontroluj násobení ${a} × ${b}.` },
  ], [
    `Obsah obdélníku je plocha uvnitř. Jakou početní operaci použiješ se stranami ${a} a ${b}?`,
    `Obsah je počet čtverečků 1 cm × 1 cm, které obdélník pokryjí. Jedna řada je dlouhá jako strana ${a} a řad je tolik, kolik měří strana ${b}. Vynásob ${a} × ${b}.`,
  ], [`S = a · b`, `S = ${a} · ${b} = ${s} cm²`]);
}

function stranaCtverceZObvodu(): PracticeTask {
  const a = rnd(5, 25), o = 4 * a;
  return ciselnaUloha(`Čtverec má obvod ${o} cm. Jak dlouhá je jeho strana?`, `${a} cm`, [
    { value: `${o / 2} cm`, why: "Obvod se dělil dvěma. Čtverec má ale čtyři stejné strany — děl čtyřmi." },
    { value: `${o - 4} cm`, why: "Od obvodu se odečetla čtyřka. Obvod je čtyřikrát strana, proto se dělí čtyřmi." },
    { value: `${o} cm`, why: "To je celý obvod, tedy všechny čtyři strany dohromady." },
    { value: `${a + 1} cm`, why: `Zkouška: 4 × ${a + 1} = ${4 * (a + 1)}, ne ${o}.` },
  ], [
    `Obvod čtverce je součet čtyř stejných stran. Na kolik stejných dílů rozdělíš číslo ${o}?`,
    `Všechny čtyři strany čtverce jsou stejně dlouhé a dohromady dají obvod ${o}. Jednu stranu proto dostaneš dělením ${o} ÷ 4.`,
  ], [`o = 4 · a, takže a = o ÷ 4`, `a = ${o} ÷ 4 = ${a} cm`, `Zkouška: 4 · ${a} = ${o} ✓`]);
}

function stranaCtverceZObsahu(): PracticeTask {
  // 5 a 6 ne: „25 cm²“ a „36 cm²“ by obsahovaly klíč „5 cm“ / „6 cm“.
  const a = [3, 4, 7, 8, 9, 10][rnd(0, 5)], s = a * a;
  return ciselnaUloha(`Čtverec má obsah ${s} cm². Jak dlouhá je jeho strana?`, `${a} cm`, [
    ...(s % 4 === 0 ? [{ value: `${s / 4} cm`, why: "Dělení čtyřmi patří k obvodu. U obsahu hledáš číslo, které krát samo sebe dá obsah." }] : []),
    ...(s % 2 === 0 ? [{ value: `${s / 2} cm`, why: `Obsah není strana + strana. Hledej číslo, pro které platí ? × ? = ${s}.` }] : []),
    { value: `${a + 1} cm`, why: `Zkouška: ${a + 1} × ${a + 1} = ${(a + 1) * (a + 1)}, ne ${s}.` },
    { value: `${a - 1} cm`, why: `Zkouška: ${a - 1} × ${a - 1} = ${(a - 1) * (a - 1)}, ne ${s}.` },
    { value: `${s} cm`, why: "To je obsah, ne délka strany. Hledáš číslo, které krát samo sebe dá obsah." },
  ], [
    `Které číslo vynásobené samo sebou dá ${s}?`,
    `Obsah čtverce je strana × strana. Projdi násobilku a hledej číslo, které když vynásobíš jím samým, dostaneš ${s}.`,
  ], [`S = a · a`, `${a} · ${a} = ${s}, takže a = ${a} cm`]);
}

function druhaStranaZObvodu(): PracticeTask {
  const a = rnd(5, 20);
  let b = rnd(3, 15);
  while (b === a || String(b).endsWith(String(a)) || String(2 * (a + b)).endsWith(String(a))) b = rnd(3, 15);
  const o = 2 * (a + b);
  return ciselnaUloha(`Obdélník má obvod ${o} cm a jednu stranu ${b} cm. Jak dlouhá je druhá strana?`, `${a} cm`, [
    { value: `${o - b} cm`, why: `Strana ${b} cm se odečetla jen jednou. V obvodu je ale dvakrát.` },
    { value: `${o / 2} cm`, why: `To je součet dvou sousedních stran. Ještě od něj odečti ${b}.` },
    { value: `${o - 2 * b} cm`, why: "To jsou obě hledané strany dohromady. Jedna je polovina." },
    { value: `${a + 1} cm`, why: `Zkouška: 2 × (${a + 1} + ${b}) = ${2 * (a + 1 + b)}, ne ${o}.` },
  ], [
    `Kolik zbude z obvodu ${o}, když odečteš dvakrát ${b}?`,
    `${o} − 2 × ${b} = ${o - 2 * b} — to jsou obě hledané strany dohromady. Jedna strana je polovina z toho: ${o - 2 * b} ÷ 2.`,
  ], [`o = 2 · (a + b), známe b = ${b} cm`, `Obě neznámé strany: ${o} − 2 · ${b} = ${o - 2 * b} cm`, `Jedna strana: ${o - 2 * b} ÷ 2 = ${a} cm`]);
}

function druhaStranaZObsahu(): PracticeTask {
  const a = rnd(3, 10);
  let b = rnd(2, 10);
  while (b === a || String(b).endsWith(String(a)) || String(a * b).endsWith(String(a))) b = rnd(2, 10);
  const s = a * b;
  return ciselnaUloha(`Obdélník má obsah ${s} cm² a jednu stranu ${b} cm. Jak dlouhá je druhá strana?`, `${a} cm`, [
    { value: `${s - b} cm`, why: `Obsah je součin stran, ne součet. Proto se neodečítá, ale dělí: ${s} ÷ ${b}.` },
    { value: `${b} cm`, why: `To je strana, kterou už znáš. Hledáš druhou: ${s} ÷ ${b}.` },
    { value: `${a + 1} cm`, why: `Zkouška: ${a + 1} × ${b} = ${(a + 1) * b}, ne ${s}.` },
    { value: `${a - 1} cm`, why: `Zkouška: ${a - 1} × ${b} = ${(a - 1) * b}, ne ${s}.` },
  ], [
    `Obsah = strana × strana. Kterým číslem musíš vynásobit ${b}, aby vyšlo ${s}?`,
    `Hledáš číslo, pro které platí ? × ${b} = ${s}. Najdeš ho dělením ${s} ÷ ${b} — pomůže ti násobilka čísla ${b}.`,
  ], [`S = a · b`, `a = ${s} ÷ ${b} = ${a} cm`, `Zkouška: ${a} · ${b} = ${s} ✓`]);
}

function gen(level: number): PracticeTask[] {
  const L3 = [stranaCtverceZObvodu, stranaCtverceZObsahu, druhaStranaZObvodu, druhaStranaZObsahu];
  return Array.from({ length: 40 }, (_, i) => (level === 1 ? ctverec() : level === 2 ? obdelnik() : L3[i % 4]()));
}

export const OBVOD_OBSAH: TopicMetadata[] = [
  {
    id: "g4-mat-obvod-obsah-obdelnik-ctverec-4",
    rvpNodeId: "g4-matematika-geometrie-v-rovine-a-v-prostoru-obvod-a-obsah-obvod-a-obsah-obdelniku-a-ctverce",
    displayName: "Obvod a obsah útvarů",
    title: "Obvod a obsah obdélníku a čtverce",
    studentTitle: "Obvod a obsah",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Obvod a obsah",
    briefDescription: "Spočítáš obvod a obsah čtverce i obdélníku.",
    keywords: [
      "obvod", "obsah", "obdélník", "čtverec", "strana",
      "cm", "cm²", "vzorec obvodu", "vzorec obsahu",
    ],
    goals: [
      "Vypočítat obvod čtverce (O = 4a) a obdélníku (O = 2(a+b)).",
      "Vypočítat obsah čtverce (S = a²) a obdélníku (S = a×b).",
      "Určit neznámý rozměr ze zadaného obvodu.",
    ],
    boundaries: [
      "Pouze čtverec a obdélník.",
      "Nezahrnuje trojúhelník, kruh ani jiné tvary.",
      "Rozměry jsou celá čísla.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-mat-trojuhelnik-druhy-stran-4", "g4-mat-rovnobezky-kolmice-4"],
    generator: gen,
    helpTemplate: {
      hint: "Obvod = součet všech stran. Obsah = délka × šířka. Čtverec: O = 4a, S = a×a. Obdélník: O = 2×(a+b), S = a×b.",
      steps: [
        "Urči, zda počítáš obvod nebo obsah.",
        "Čtverec: O = 4 × strana; S = strana × strana.",
        "Obdélník: O = 2 × (délka + šířka); S = délka × šířka.",
        "Dosaď číslice a spočítej.",
      ],
      commonMistake: "Záměna obvodu a obsahu — obvod je délka (cm), obsah je plocha (cm²).",
      example: "Obdélník 6 cm × 4 cm: O = 2×(6+4) = 20 cm; S = 6×4 = 24 cm².",
    },
  },
];
