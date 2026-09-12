import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { ciselnaUloha, fdec, fmt, pick, rnd, sada } from "./_mat";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy byly pevný seznam bez nápověd
// a bez vysvětlení chybných možností. Teď generátor s typickými chybami:
// obvod místo obsahu, sečtené strany, u převodů jednotek obsahu převod jako
// u délky (1 m² = 100 cm²).
// L1 obsah obdélníku a čtverce, počet čtverečků v síti · L2 složené obrazce
// (vystřižený roh, dva obdélníky) · L3 převody jednotek obsahu a strana
// z obsahu.

const JEDN = ["cm", "dm", "m"];

function sit(): PracticeTask | null {
  const r = rnd(2, 9), s = rnd(3, 12);
  if (r === s) return null;
  return ciselnaUloha(`Obdélník ve čtvercové síti má ${pad(r, "ŘÁDEK")} a v každém řádku ${pad(s, "ČTVEREČEK")}. Kolik čtverečků zabírá?`, r * s, [
    { value: r + s, why: "Počet řádků a čtverečků v řádku se sečetl. Řádků je víc, každý má stejně čtverečků — násob." },
    { value: 2 * (r + s), why: "To jsou čtverečky kolem okraje (obvod), ne celá plocha." },
    { value: r * s - s, why: `Chybí jeden řádek. Řádků je ${r}.` },
  ], [
    `Kolik čtverečků je v jednom řádku a kolik je řádků (${r})?`,
    "Obsah ve čtvercové síti = počet všech čtverečků uvnitř. Když jsou v řádcích stejně dlouhé řady, stačí vynásobit počet řádků počtem čtverečků v řádku.",
  ], [`${pad(r, "ŘÁDEK")} × ${pad(s, "ČTVEREČEK")} = ${r * s}`]);
}

function obdelnik(): PracticeTask | null {
  const a = rnd(3, 15), b = rnd(2, 12), u = pick(JEDN);
  if (a === b) return null;
  const S = (n: number) => `${fmt(n)} ${u}²`;
  return ciselnaUloha(`Obdélník má strany ${a} ${u} a ${b} ${u}. Jaký má obsah?`, S(a * b), [
    { value: S(2 * (a + b)), why: `${2 * (a + b)} je obvod (součet všech stran). Obsah je plocha uvnitř: délka × šířka.` },
    { value: S(a + b), why: "Strany se sečetly. Obsah se počítá násobením." },
    { value: S(a * b - b), why: `Zkouška: ${a} × ${b} = ${a * b}.` },
  ], [
    `Kolik čtverečků 1 ${u} × 1 ${u} by se vešlo do jedné řady podél strany ${a} ${u}? A kolik takových řad je?`,
    `Obsah obdélníku = délka × šířka. Výsledek je ve čtverečních jednotkách (${u}²), protože počítáš čtverečky, ne délku. Obvod (součet stran) je něco jiného.`,
  ], [`${a} × ${b} = ${a * b}`, `Obsah: ${S(a * b)}`]);
}

function ctverec(): PracticeTask | null {
  const a = rnd(3, 15), u = pick(JEDN);
  const S = (n: number) => `${fmt(n)} ${u}²`;
  return ciselnaUloha(`Čtverec má stranu ${a} ${u}. Jaký má obsah?`, S(a * a), [
    { value: S(4 * a), why: `${4 * a} je obvod (4 × strana). Obsah je strana × strana.` },
    { value: S(2 * a), why: "Strana se vynásobila dvěma. Obsah je strana × strana." },
    { value: S(a * a + a), why: `Zkouška: ${a} × ${a} = ${a * a}.` },
  ], [
    `Kolik čtverečků je v jedné řadě (${a}) a kolik je řad?`,
    `Obsah čtverce = strana × strana. Výsledek je v ${u}², protože počítáš čtverečky, ne délku. Pozor na záměnu s obvodem, ten je 4 × strana.`,
  ], [`${a} × ${a} = ${a * a}`, `Obsah: ${S(a * a)}`]);
}

function vystrizeny(): PracticeTask | null {
  const a = rnd(6, 15), b = rnd(5, 12), c = rnd(2, Math.min(a, b) - 2);
  const S = (n: number) => `${fmt(n)} cm²`;
  const v = a * b - c * c;
  return ciselnaUloha(`Z obdélníku ${a} cm × ${b} cm vystřihneme v rohu čtverec o straně ${c} cm. Jaký obsah má zbytek?`, S(v), [
    { value: S(a * b), why: "To je obsah celého obdélníku. Vystřižený čtverec se musí odečíst." },
    { value: S(a * b + c * c), why: "Čtverec se přičetl. Vystřižením plocha ubude." },
    { value: S(a * b - 4 * c), why: `Odečetl se obvod čtverce (${4 * c}). Odečítá se jeho obsah ${c} × ${c}.` },
  ], [
    `Jaký obsah má celý obdélník a jaký vystřižený čtverec o straně ${c} cm?`,
    "Obsah složeného obrazce spočítáš po částech: obsah celého obdélníku minus obsah té části, která chybí.",
  ], [`Obdélník: ${a} × ${b} = ${a * b}`, `Čtverec: ${c} × ${c} = ${c * c}`, `Zbytek: ${a * b} − ${c * c} = ${v} cm²`]);
}

function dvaObdelniky(): PracticeTask | null {
  const a = rnd(3, 10), b = rnd(2, 8), c = rnd(2, 8), d = rnd(2, 8);
  if (a * b === c * d) return null;
  const S = (n: number) => `${fmt(n)} cm²`;
  const v = a * b + c * d;
  return ciselnaUloha(`Obrazec se skládá z obdélníku ${a} cm × ${b} cm a obdélníku ${c} cm × ${d} cm, které se jen dotýkají. Jaký má obsah?`, S(v), [
    { value: S((a + c) * (b + d)), why: "Rozměry se sečetly a vynásobily, jako by to byl jeden velký obdélník. Každý obdélník spočítej zvlášť." },
    { value: S(a + b + c + d), why: "Rozměry se jen sečetly. Obsah se počítá násobením." },
    { value: S(a * b), why: `To je jen první obdélník. Přičti i druhý (${c} × ${d}).` },
  ], [
    `Jaký obsah má první obdélník (${a} × ${b}) a jaký druhý (${c} × ${d})?`,
    "Obsah složeného obrazce = součet obsahů jeho částí. Spočítej každý obdélník zvlášť a výsledky sečti.",
  ], [`${a} × ${b} = ${a * b}`, `${c} × ${d} = ${c * d}`, `${a * b} + ${c * d} = ${v} cm²`]);
}

// [větší, menší, kolik menších je ve větší, 2. pád mn. č. menší, 2. pád mn. č. větší]
const PREVODY: [string, string, number, string, string][] = [
  ["m²", "dm²", 100, "čtverečních decimetrů", "čtverečních metrů"],
  ["dm²", "cm²", 100, "čtverečních centimetrů", "čtverečních decimetrů"],
  ["m²", "cm²", 10000, "čtverečních centimetrů", "čtverečních metrů"],
  ["ha", "m²", 10000, "čtverečních metrů", "hektarů"],
  ["km²", "ha", 100, "hektarů", "čtverečních kilometrů"],
];

function prevod(): PracticeTask | null {
  const [velka, mala, f, malaGen, velkaGen] = pick(PREVODY);
  const naMale = Math.random() < 0.5;
  const x = naMale ? rnd(2, 40) : rnd(2, 90) * (f / 10) + pick([0, f / 2]);
  const key = naMale ? x * f : x / f;
  const delkovy = f === 100 ? 10 : 100;
  const jed = naMale ? mala : velka;
  return ciselnaUloha(`Kolik ${naMale ? malaGen : velkaGen} je ${fmt(x)} ${naMale ? velka : mala}?`, `${fdec(key)} ${jed}`, [
    { value: `${fdec(naMale ? x * delkovy : x / delkovy)} ${jed}`, why: `Převádělo se jako délka. U obsahu se převodní číslo umocní: 1 ${velka} = ${fmt(f)} ${mala}.` },
    { value: `${fdec(naMale ? x / f : x * f)} ${jed}`, why: naMale ? "Na menší jednotku vyjde číslo větší — násob." : "Na větší jednotku vyjde číslo menší — děl." },
    { value: `${fdec(naMale ? x * f * 10 : x / f / 10)} ${jed}`, why: `1 ${velka} = ${fmt(f)} ${mala}, ne ${fmt(f * 10)} ${mala}.` },
  ], [
    `Kolik ${malaGen} je v jednom ${velka === "ha" ? "hektaru" : velka === "km²" ? "čtverečním kilometru" : velka === "dm²" ? "čtverečním decimetru" : "čtverečním metru"}? Bude číslo v odpovědi víc, nebo míň než ${fmt(x)}?`,
    `Čtverec 1 ${velka} má stranu, která je v ${mala.replace("²", "")} ${Math.sqrt(f) === 10 ? "desetkrát" : "stokrát"} delší — a obsah proto ${fmt(f)}krát. Na menší jednotky násob, na větší děl. Převodní číslo u obsahu je vždy druhou mocninou převodu délky.`.replace("v ha", "v m").replace("v m ", "v m "),
  ], [`1 ${velka} = ${fmt(f)} ${mala}`, `${fmt(x)} ${naMale ? `× ${fmt(f)}` : `: ${fmt(f)}`} = ${fdec(key)} ${jed}`]);
}

function stranaCtverce(): PracticeTask | null {
  const s = rnd(3, 12);
  return ciselnaUloha(`Čtverec má obsah ${s * s} cm². Jak dlouhá je jeho strana?`, `${s} cm`, [
    { value: `${fdec((s * s) / 4)} cm`, why: "Obsah se vydělil čtyřmi, jako by to byl obvod. Obsah je strana × strana." },
    { value: `${fdec((s * s) / 2)} cm`, why: "Obsah se vydělil dvěma. Hledáš číslo, které vynásobené samo sebou dá obsah." },
    { value: `${s + 1} cm`, why: `Zkouška: ${s + 1} × ${s + 1} = ${(s + 1) * (s + 1)}, ne ${s * s}.` },
  ], [
    `Které číslo vynásobené samo sebou dá ${s * s}?`,
    "Obsah čtverce = strana × strana. Hledáš tedy číslo, jehož násobek se sebou samým je obsah — pomůže malá násobilka.",
  ], [`${s} × ${s} = ${s * s}`, `Strana: ${s} cm`]);
}

function druhaStrana(): PracticeTask | null {
  const a = rnd(3, 12), b = rnd(3, 12);
  if (a === b) return null;
  const S = a * b;
  return ciselnaUloha(`Obdélník má obsah ${S} cm² a jedna jeho strana měří ${a} cm. Jak dlouhá je druhá strana?`, `${b} cm`, [
    { value: `${S - a} cm`, why: "Strana se od obsahu odečetla. Obsah vznikl násobením, takže se musí dělit." },
    { value: `${fdec(S / 2 - a)} cm`, why: "Počítalo se jako s obvodem. Obsah = délka × šířka." },
    { value: `${b + 1} cm`, why: `Zkouška: ${a} × ${b + 1} = ${a * (b + 1)}, ne ${S}.` },
  ], [
    `Kolikrát musíš vzít ${a}, abys dostal nebo dostala ${S}?`,
    `Obsah obdélníku = délka × šířka. Když znáš obsah a jednu stranu, druhou dostaneš dělením: obsah ÷ známá strana.`,
  ], [`${S} ÷ ${a} = ${b}`, `Zkouška: ${a} × ${b} = ${S} ✓`]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) { const t = [sit, obdelnik, ctverec]; return sada(30, (i) => t[i % 3]()); }
  if (level === 2) return sada(30, (i) => (i % 2 ? dvaObdelniky() : vystrizeny()));
  const t = [prevod, prevod, stranaCtverce, druhaStrana];
  return sada(30, (i) => t[i % 4]());
}

export const OBSAHOBRAZCEVECTVERCOVESITIJEDNOTKYOBSAHU: TopicMetadata[] = [
  {
    id: "g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-obsah-obrazce-ve-ctvercove-siti-jednotky-obsahu",
    rvpNodeId: "g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-obsah-obrazce-ve-ctvercove-siti-jednotky-obsahu",
    title: "Obsah obrazce ve čtvercové síti, jednotky obsahu",
    studentTitle: "Obsah tvaru",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Konstrukce a obsah",
    briefDescription: "Zjistíš obsah obrazce ve čtvercové síti a jednotky obsahu.",
    keywords: ["obsah", "čtvercová síť", "plocha", "cm²", "m²", "km²", "převody jednotek"],
    goals: [
      "Zjistit obsah obrazce ve čtvercové síti počítáním čtverečků",
      "Vypočítat obsah obdélníku a čtverce",
      "Znát jednotky obsahu: cm², m², km²",
      "Převádět mezi jednotkami obsahu",
    ],
    boundaries: ["Bez obsahu trojúhelníku vzorcem", "Bez obsahu kruhu"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Obsah = počet čtverečků ve čtvercové síti. Pro obdélník: obsah = délka × šířka. Jednotky: 1 m² = 10 000 cm², 1 km² = 1 000 000 m².",
      steps: [
        "Spočítej, kolik čtverečků obrazec pokrývá.",
        "Každý čtvereček má obsah = 1 jednotka² (cm², m², ...).",
        "Pro obdélník: obsah = délka × šířka.",
        "Nezapomeň na správnou jednotku (cm², m², km²).",
      ],
      commonMistake: "Chyba: záměna obvodu (délka okraje) a obsahu (plocha uvnitř). Obsah je v čtvercových jednotkách (cm²).",
      example: "Obdélník 4 × 3 čtverečky: obsah = 4 × 3 = 12 čtverečků = 12 cm² (pokud je 1 čtvereček = 1 cm²).",
    },
  },
];
