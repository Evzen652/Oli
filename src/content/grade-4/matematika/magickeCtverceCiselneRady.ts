import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { ciselnaUloha, rnd, shuffle, type Chyba } from "./_mat";

// Přepsáno 2026-09-11 (audit 4. ročníku). Magický čtverec byl jen jeden
// (posunutý), takže úrovně měly 8–12 různých úloh, nápovědy byly obecné
// a řady v L3 (n², n³, Fibonacci, ×3) přesahovaly 4. ročník. Teď se čtverec
// otáčí a zrcadlí (8 podob) a řady jsou z učiva 4. ročníku:
// L1 čtverec se zadaným součtem (středy 5–8), další člen řady se stálým krokem
// L2 čtverec s většími čísly (středy 9–15), chybějící člen uvnitř řady (i klesající)
// L3 čtverec bez zadaného součtu (zjistí se z plného řádku), řady s měnícím se krokem.

const LO_SHU = [[2, 7, 6], [9, 5, 1], [4, 3, 8]];
const V_RADKU = ["prvním", "druhém", "třetím"];
const RADEK = ["První", "Druhý", "Třetí"];

function ctverec(stred: number): number[][] {
  let q = LO_SHU.map((r) => r.map((v) => v + stred - 5));
  const otoc = (m: number[][]) => m[0].map((_, c) => m.map((r) => r[c]).reverse());
  for (let i = rnd(0, 3); i > 0; i--) q = otoc(q);
  if (Math.random() < 0.5) q = q.map((r) => [...r].reverse());
  return q;
}

function magicky(stred: number, soucetZadan: boolean): PracticeTask {
  const q = ctverec(stred);
  const S = 3 * stred;
  const [r, c] = shuffle([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]])[0];
  const hledane = q[r][c];
  const [a, b] = q[r].filter((_, i) => i !== c);
  const plny = q[(r + 1) % 3];
  const sloupec = q.map((row) => row[c]);
  const [x, y] = sloupec.filter((_, i) => i !== r);
  const mrizka = q.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? "?" : String(v))).join(" | ")).join("\n");
  const chyby: Chyba[] = [
    { value: S - a, why: `Od součtu ${S} se odečetlo jen ${a}. V řádku je ještě ${b}.` },
    { value: S - b, why: `Od součtu ${S} se odečetlo jen ${b}. V řádku je ještě ${a}.` },
    { value: a + b, why: `${a} + ${b} je součet známých čísel. Hledané číslo je to, co jim chybí do ${S}.` },
    { value: hledane + 1, why: `Zkouška: ${a} + ${b} + ${hledane + 1} = ${a + b + hledane + 1}, ne ${S}.` },
  ];
  const otazka = soucetZadan
    ? `Magický čtverec: součet v každém řádku, sloupci i na úhlopříčkách je ${S}.\n${mrizka}\nJaké číslo patří místo otazníku?`
    : `Magický čtverec: součet v každém řádku, sloupci i na úhlopříčkách je stejný.\n${mrizka}\nJaké číslo patří místo otazníku?`;
  const hints: [string, string] = soucetZadan
    ? [
      `Otazník je v řádku s čísly ${a} a ${b} a ve sloupci s čísly ${x} a ${y}. Kolik chybí do ${S}?`,
      `Stačí jeden z nich: sečti ${a} + ${b} a výsledek odečti od ${S}. Pro kontrolu zkus totéž se sloupcem — ${x} + ${y} + otazník musí dát také ${S}.`,
    ]
    : [
      `Řádek ${plny.join(" | ")} je celý vyplněný a otazník stojí ve sloupci s čísly ${x} a ${y}. Kolik je součet celého řádku?`,
      `Součet celého řádku (${plny.join(" + ")}) je magický součet — stejný pro všechny řádky. V ${V_RADKU[r]} řádku jsou už čísla ${a} a ${b}; odečti je od magického součtu a výsledek ověř ve sloupci.`,
    ];
  return ciselnaUloha(otazka, hledane, chyby, hints, [
    ...(soucetZadan ? [] : [`Magický součet: ${plny.join(" + ")} = ${S}`]),
    `${RADEK[r]} řádek: ${a} + ${b} = ${a + b}`,
    `${S} − ${a + b} = ${hledane}`,
    `Zkouška ve sloupci: ${sloupec.join(" + ")} = ${S} ✓`,
  ]);
}

function dalsiClen(): PracticeTask {
  const krok = rnd(2, 9), start = rnd(1, 30);
  const t = Array.from({ length: 5 }, (_, k) => start + k * krok);
  const posl = t[4], dalsi = posl + krok;
  return ciselnaUloha(`Číselná řada: ${t.join(", ")}, … Jaké číslo následuje?`, dalsi, [
    { value: posl + krok + 1, why: `Krok řady je ${krok}, ne ${krok + 1}. Zkontroluj rozdíl sousedních čísel.` },
    { value: posl + krok - 1, why: `Krok řady je ${krok}, ne ${krok - 1}. Zkontroluj rozdíl sousedních čísel.` },
    { value: posl + 2 * krok, why: "Tohle číslo přijde až o krok později — jedno se přeskočilo." },
    { value: posl - krok, why: "Řada roste, další číslo musí být větší než poslední." },
  ], [
    `O kolik se liší sousední čísla v řadě ${t.join(", ")}?`,
    `Spočítej rozdíl ${t[1]} − ${t[0]} a ověř ho i u dalších dvojic. Pak stejný krok přičti k poslednímu číslu ${posl}.`,
  ], [`Krok: ${t[1]} − ${t[0]} = ${krok}, platí pro všechny sousedy.`, `Další číslo: ${posl} + ${krok} = ${dalsi}`]);
}

function chybiUvnitr(): PracticeTask {
  const velikost = rnd(3, 12);
  const klesa = Math.random() < 0.3;
  const krok = klesa ? -velikost : velikost;
  const start = klesa ? rnd(5 * velikost + 1, 5 * velikost + 60) : rnd(1, 40);
  const t = Array.from({ length: 6 }, (_, k) => start + k * krok);
  const idx = rnd(1, 4);
  const hledane = t[idx];
  const shown = t.map((v, i) => (i === idx ? "?" : String(v))).join(", ");
  const zn = klesa ? "−" : "+";
  return ciselnaUloha(`Číselná řada: ${shown}. Jaké číslo patří místo otazníku?`, hledane, [
    { value: hledane + 1, why: `Zkouška: z ${t[idx - 1]} na ${hledane + 1} je krok ${Math.abs(hledane + 1 - t[idx - 1])}, ale ostatní sousedé se liší o ${velikost}.` },
    { value: hledane - 1, why: `Zkouška: z ${t[idx - 1]} na ${hledane - 1} je krok ${Math.abs(hledane - 1 - t[idx - 1])}, ale ostatní sousedé se liší o ${velikost}.` },
    { value: t[idx - 1] - krok, why: klesa ? `Řada klesá — číslo za ${t[idx - 1]} musí být menší.` : `Řada roste — číslo za ${t[idx - 1]} musí být větší.` },
  ], [
    `Najdi v řadě ${shown} dvě sousední čísla bez otazníku. O kolik se liší?`,
    `Z úplné dvojice sousedů zjistíš krok řady. Od čísla ${t[idx - 1]} udělej jeden krok — a ověř, že dalším krokem dojdeš na ${t[idx + 1]}.`,
  ], [
    `Krok řady: ${zn}${velikost}`,
    `${t[idx - 1]} ${zn} ${velikost} = ${hledane}`,
    `Kontrola: ${hledane} ${zn} ${velikost} = ${t[idx + 1]} ✓`,
  ]);
}

function menicimSeKrokem(): PracticeTask {
  for (;;) {
    const typ = rnd(0, 2);
    let t: number[], dalsi: number, popis: string, h1: string, chyby: Chyba[];
    if (typ === 0) {
      const k = rnd(1, 4), start = rnd(1, 20);
      t = [start];
      for (let i = 0; i < 4; i++) t.push(t[i] + k + i);
      dalsi = t[4] + k + 4;
      popis = `Kroky rostou vždy o jedna: +${k}, +${k + 1}, +${k + 2}, +${k + 3}, další je +${k + 4}.`;
      chyby = [
        { value: t[4] + k + 3, why: `Přičetl se stejný krok jako naposled (+${k + 3}). Kroky ale pokaždé o jedna rostou.` },
        { value: t[4] + k + 5, why: `Krok +${k + 5} je o jedna větší, než má být.` },
        { value: t[4] + k, why: `Přičetl se první krok (+${k}). Kroky ale rostou.` },
      ];
      h1 = "Rozdíly sousedních čísel nejsou stejné, ale mění se pravidelně — každý je o jedna větší než ten předchozí. Zjisti poslední rozdíl a udělej krok o jedna větší.";
    } else if (typ === 1) {
      const a = rnd(4, 9), b = rnd(1, a - 2), start = rnd(1, 20);
      t = [start];
      for (let i = 0; i < 5; i++) t.push(t[i] + (i % 2 === 0 ? a : -b));
      dalsi = t[5] - b;
      popis = `Kroky se střídají: +${a}, −${b}, +${a}, −${b}, +${a}, další je −${b}.`;
      chyby = [
        { value: t[5] + a, why: `Po posledním +${a} přijde −${b}, kroky se střídají.` },
        { value: t[5] - a, why: `Odečítá se ${b}, ne ${a}.` },
        { value: t[5] - b + a, why: "Tohle číslo přijde až o dva kroky později." },
      ];
      h1 = "Rozdíly se střídají: jednou se přičítá, jednou odečítá. Zjisti, o kolik se přičítá a o kolik odečítá, a podívej se, který krok byl poslední — teď přijde ten druhý.";
    } else {
      const start = rnd(1, 6);
      t = Array.from({ length: 5 }, (_, i) => start * 2 ** i);
      dalsi = t[4] * 2;
      popis = `Každé číslo je dvojnásobkem předchozího: ${t[4]} · 2 = ${dalsi}.`;
      chyby = [
        { value: t[4] + (t[4] - t[3]), why: "Přičetl se poslední rozdíl. Každé číslo je ale dvojnásobkem předchozího, rozdíly rostou." },
        { value: t[4] * 3, why: "Násobí se dvěma, ne třemi." },
        { value: t[4] + 2, why: "Řada nepřičítá stále stejné číslo — každé číslo je dvakrát větší než předchozí." },
      ];
      h1 = `Rozdíly rostou čím dál rychleji. Zkus, jestli každé číslo nevznikne z předchozího násobením — kolikrát je ${t[1]} větší než ${t[0]}?`;
    }
    if (t.includes(dalsi)) continue;
    return ciselnaUloha(`Číselná řada: ${t.join(", ")}, … Jaké číslo následuje?`, dalsi, chyby, [
      `Spočítej rozdíly sousedních čísel v řadě ${t.join(", ")}. Jsou pořád stejné?`,
      h1,
    ], [popis, `Další číslo: ${dalsi}`]);
  }
}

function gen(level: number): PracticeTask[] {
  return Array.from({ length: 40 }, (_, i) => {
    if (level === 1) return i % 2 ? magicky(rnd(5, 8), true) : dalsiClen();
    if (level === 2) return i % 2 ? magicky(rnd(9, 15), true) : chybiUvnitr();
    return i % 2 ? magicky(rnd(5, 12), false) : menicimSeKrokem();
  });
}

export const MAGICKE_CTVERCE_RADY: TopicMetadata[] = [
  {
    id: "g4-mat-magicke-ctverce-ciselne-rady-4",
    rvpNodeId: "g4-matematika-nestandardni-aplikacni-ulohy-a-problemy-logicke-ulohy-magicke-ctverce-ciselne-rady",
    displayName: "Magické čtverce a řady",
    title: "Magické čtverce a číselné řady",
    studentTitle: "Magické čtverce",
    subject: "matematika",
    category: "Nestandardní aplikační úlohy a problémy",
    topic: "Logické úlohy",
    briefDescription: "Najdeš chybějící čísla a odhalíš tajemství číselné řady.",
    keywords: [
      "magický čtverec", "číselná řada", "vzor", "logická úloha",
      "aritmetická řada", "posloupnost", "extrapolace",
    ],
    goals: [
      "Doplnit chybějící číslo v magickém čtverci 3×3.",
      "Rozpoznat vzor číselné řady a určit chybějící nebo další člen.",
      "Extrapolovat řadu na vzdálený člen (7. člen).",
      "Procvičit logické myšlení a systematický postup.",
    ],
    boundaries: [
      "Pouze magické čtverce 3×3.",
      "Číselné řady: aritmetické, geometrické, čtverce, trojúhelníková čísla.",
      "Nezahrnuje sudoku ani jiné logické hry.",
      "L3 obsahuje enrichment (čtverce n², trojúhelníková čísla, Fibonacci) nad rámec běžného RVP 4. ročníku.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "mixed",
    recommendedNext: ["g4-mat-aritmeticky-prumer-4", "g4-mat-tabulky-diagramy-4"],
    generator: gen,
    helpTemplate: {
      hint: "Magický čtverec: každý řádek, sloupec i obě úhlopříčky mají stejný součet. Číselná řada: najdi, o kolik se každý člen mění (nebo jaký vzor tvoří).",
      steps: [
        "Magický čtverec: urči magickou sumu (zadána nebo odhadni ze známého řádku).",
        'Najdi řádek/sloupec s „?" a odečti součet ostatních čísel od magické sumy.',
        "Číselná řada: porovnej sousední členy — je rozdíl stejný? → aritmetická. Podíl stejný? → geometrická.",
        "Vzdálený člen: použij vzor a systematicky dopočítej krok za krokem.",
      ],
      commonMistake: "U číselných řad: předpoklad, že vzor je vždy +1 nebo +2 — může jít i o čtverce čísel, trojúhelníková čísla nebo geometrickou řadu.",
      example: "Magická suma 15, řádek: 2, 7, ? → 15 − 2 − 7 = 6. Číselná řada: 1, 4, 9, 16, ? → čtverce čísel → 25.",
    },
  },
];
