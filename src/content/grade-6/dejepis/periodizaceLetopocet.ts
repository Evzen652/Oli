/**
 * Dějepis 6. ročník — Periodizace dějin, časová přímka, letopočet (select_one).
 *
 * Přepsáno 2026-09-11 (audit 6. ročníku): L1 dřív jen deset pevných roků a
 * všechny úlohy měly stejnou malou nápovědu. Teď se roky generují a malá
 * nápověda pracuje s letopočty konkrétní úlohy; velká dá pravidlo.
 * Chybový model beze změny: vzít jen počet stovek, přidat století navíc,
 * splést éru; u př. n. l. „menší číslo = dřív“; přes přelom zapomenout, že rok 0
 * neexistuje.
 *  • L1 — století roku n. l.
 *  • L2 — letopočty př. n. l.: rozdíl ve stejné éře a nejstarší událost.
 *  • L3 — přes přelom letopočtu (rok 0 neexistuje) a řazení napříč érami.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { pick, pickN, buildChoiceTask as choice } from "./_shared";

const stoleti = (rok: number) => Math.ceil(rok / 100);
const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function gen(level: number): PracticeTask[] {
  const out = new Map<string, PracticeTask>();
  for (let i = 0; i < 200 && out.size < 24; i++) {
    const t = level === 1 ? genL1() : level === 2 ? genL2() : genL3();
    out.set(`${t.question}|${t.correctAnswer}`, t);
  }
  return [...out.values()];
}

// L1 — určení století roku n. l. (počet stovek + 1).
function genL1(): PracticeTask {
  let rok = rnd(101, 2099);
  if (rok % 100 === 0) rok += 1;
  const cent = stoleti(rok);
  const stovky = Math.floor(rok / 100);
  // Příklad z jiného století — v jeho číslech se nesmí objevit klíč ani jako konec („15.“ u klíče 5.).
  const vzor = [1492, 1805, 1212, 1648].find((v) => Math.floor(v / 100) !== cent && stoleti(v) !== cent
    && !`${stoleti(v)}.`.endsWith(`${cent}.`) && !String(Math.floor(v / 100)).endsWith(String(cent))) ?? 1805;
  return choice(
    `Do kterého století patří rok ${rok} n. l.?`,
    `${cent}. století`,
    [
      { value: `${stovky}. století`, why: `Vzal jsi jen číslo stovek (${stovky}). Století se počítá o jedno výš — rok ${rok} patří do ${cent}. století.` },
      { value: `${cent + 1}. století`, why: `Přidal jsi jedno století navíc. ${cent}. století končí až rokem ${cent * 100}, takže rok ${rok} do něj ještě spadá.` },
      { value: `${cent}. století př. n. l.`, why: `Spletl sis éru. Rok ${rok} je v našem letopočtu (n. l.), ne před ním.` },
    ],
    {
      hints: [
        `Rok ${rok}: kolik celých stovek v něm je? Z toho pak určíš století.`,
        `Století se počítá o jedno výš, než je počet celých stovek: spočítej celé stovky v roce ${rok} a přičti k nim 1, protože i začátek dalšího stovkového úseku už patří do vyššího století. Třeba rok ${vzor} má ${Math.floor(vzor / 100)} celých stovek a patří do ${stoleti(vzor)}. století.`,
      ],
      solutionSteps: [
        `Rok ${rok} obsahuje ${stovky} celých stovek.`,
        `${stovky} + 1 = ${cent}. století (trvá od roku ${(cent - 1) * 100 + 1} do ${cent * 100}).`,
      ],
      explanation: `Století se počítá tak, že k počtu celých stovek přičteš jedno: rok ${rok} má ${stovky} stovek, patří tedy do ${cent}. století (to trvá od roku ${(cent - 1) * 100 + 1} do ${cent * 100}).`,
    },
  );
}

// L2 — letopočty př. n. l. (rozdíl ve stejné éře, nebo nejstarší: větší = starší).
function genL2(): PracticeTask {
  if (Math.random() < 0.5) {
    const a = rnd(3, 20) * 50, b = rnd(1, a / 50 - 1) * 50;
    const ans = a - b;
    return choice(
      `Jedna stavba vznikla roku ${a} př. n. l., druhá roku ${b} př. n. l. Kolik let je mezi nimi?`,
      pad(ans, "ROK"),
      [
        { value: pad(a + b, "ROK"), why: `Sčítal jsi. Obě data jsou př. n. l. (stejná éra), takže se odčítají: ${a} − ${b} = ${ans}.` },
        { value: pad(a + b - 1, "ROK"), why: `Použil jsi pravidlo pro přelom letopočtu (− 1 za chybějící rok 0). Tady jsou ale obě data př. n. l. — jen se odečtou: ${a} − ${b}.` },
        { value: pad(a, "ROK"), why: `To je jen první letopočet, ne rozdíl. Odečti od něj druhý: ${a} − ${b} = ${ans}.` },
      ],
      {
        hints: [
          `Roky ${a} př. n. l. a ${b} př. n. l. jsou ve stejné éře. Který z nich je dál v minulosti?`,
          `Ve stejné éře se rozdíl počítá odečtením: od staršího (u př. n. l. většího) letopočtu odečti mladší, tedy ${a} − ${b}. Rok 0 tu nehraje roli, protože se nepřechází přes přelom letopočtu.`,
        ],
        explanation: `Obě události jsou před naším letopočtem, takže jde o jednu éru — rozdíl je prosté odečtení: ${a} − ${b} = ${pad(ans, "ROK")}. (Nesčítá se a neodečítá rok 0 — to platí jen přes přelom letopočtu.)`,
      },
    );
  }
  // Klíč se v malé nápovědě objevit nesmí (prozradil by ho), takže nápověda
  // jmenuje jen rozptylovače. Aby přesto byla pro každou úlohu jiná, je nejbližší
  // rozptylovač vždy o 50 let mladší než klíč — z největšího jmenovaného roku
  // tedy klíč jednoznačně plyne a dvě úlohy nemůžou dostat tutéž nápovědu.
  const max = 50 * rnd(6, 20);
  const blizky = max - 50;
  const dalsi = pickN(Array.from({ length: blizky / 50 - 2 }, (_, i) => 100 + 50 * i), 2);
  const ostatni = [blizky, ...dalsi].sort((a, b) => b - a);
  return choice(
    "Která událost je nejstarší? (všechny se staly před naším letopočtem)",
    `${max} př. n. l.`,
    ostatni.map((r) => ({
      value: `${r} př. n. l.`,
      why: `U let př. n. l. platí: čím větší číslo, tím dál v minulosti. ${max} př. n. l. bylo dřív než ${r} př. n. l.`,
    })),
    {
      hints: [
        `Vypiš si čísla všech čtyř možností — tři z nich jsou ${ostatni.join(", ")}. Které číslo znamená nejdál do minulosti?`,
        `U letopočtů před naším letopočtem běží čas obráceně, směrem do minulosti: čím větší číslo př. n. l., tím starší událost. Z dvojice ${ostatni[0]} př. n. l. a ${ostatni[1]} př. n. l. je proto starší ta s větším číslem. Stejně porovnej i zbylé možnosti a nakonec vyber tu s největším číslem.`,
      ],
      explanation: `Před naším letopočtem se roky počítají směrem do minulosti, takže větší číslo = starší událost. Nejstarší je proto rok ${max} př. n. l.`,
    },
  );
}

// L3 — přes přelom letopočtu (rok 0 neexistuje), nebo řazení napříč érami.
function genL3(): PracticeTask {
  if (Math.random() < 0.5) {
    const a = rnd(2, 16) * 50, b = rnd(1, 12) * 50;
    const ans = a + b - 1;
    return choice(
      `Říše vznikla roku ${a} př. n. l. a zanikla roku ${b} n. l. Jak dlouho existovala? (Pozor: rok 0 neexistuje.)`,
      pad(ans, "ROK"),
      [
        { value: pad(a + b, "ROK"), why: `Zapomněl jsi, že rok 0 neexistuje — mezi 1 př. n. l. a 1 n. l. je jen 1 rok. Proto se po sečtení odečítá 1: ${a} + ${b} − 1 = ${ans}.` },
        { value: pad(Math.abs(a - b) || 1, "ROK"), why: `Odečetl jsi, jako by obě data byla ve stejné éře. Přes přelom letopočtu se naopak sčítá (a odečte 1 za chybějící rok 0): ${a} + ${b} − 1.` },
        { value: pad(a + b - 2, "ROK"), why: `Odečetl jsi 2, ale chybí jen jediný rok (rok 0). Správně ${a} + ${b} − 1 = ${ans}.` },
      ],
      {
        hints: [
          `Rok ${a} př. n. l. a rok ${b} n. l. jsou v různých érách. Co s nimi uděláš — sečteš, nebo odečteš?`,
          "Přes přelom letopočtu se roky sčítají. Pozor ale na přelom: rok 0 neexistuje, hned po 1 př. n. l. následuje 1 n. l. — proto od součtu odečti 1.",
        ],
        solutionSteps: [
          `Přes přelom se letopočty sčítají: ${a} + ${b} = ${a + b}.`,
          `Rok 0 neexistuje, odečti 1: ${a + b} − 1 = ${ans}.`,
        ],
        explanation: `Události jsou ve dvou érách, proto se roky sčítají: ${a} + ${b} = ${a + b}. Protože rok 0 neexistuje (po 1 př. n. l. přijde rovnou 1 n. l.), odečteš 1: ${ans}.`,
      },
    );
  }
  // Stejný princip jako u L2: klíč v malé nápovědě být nesmí, takže nápověda
  // jmenuje jen rozptylovače. Druhý letopočet př. n. l. je proto vždy o 50 let
  // mladší než klíč a roky n. l. se s ním číselně nekryjí (jinak by se číslo
  // klíče objevilo v nápovědě u jiné éry a vypadalo jako prozrazení).
  const klicRok = 50 * rnd(3, 16);
  const druhyPr = klicRok - 50;
  const adRoky = pickN(
    Array.from({ length: 16 }, (_, i) => 50 + 50 * i).filter((r) => r !== klicRok && r !== druhyPr),
    2,
  );
  const label = (e: { y: number; bc: boolean }) => `${e.y} ${e.bc ? "př. n. l." : "n. l."}`;
  const nejstarsi = { y: klicRok, bc: true };
  const ostatni = [{ y: druhyPr, bc: true }, ...adRoky.map((y) => ({ y, bc: false }))];
  const nl = adRoky.map((y) => label({ y, bc: false }));
  return choice(
    "Která událost je nejstarší?",
    label(nejstarsi),
    ostatni.map((e) => ({
      value: label(e),
      why: e.bc
        ? `Vybral jsi správně letopočet př. n. l., ale větší číslo př. n. l. = starší. Nejstarší je ${label(nejstarsi)}.`
        : `To je náš letopočet (n. l.). Vše před naším letopočtem se stalo dřív — nejstarší je ${label(nejstarsi)}.`,
    })),
    {
      hints: [
        `Roztřiď možnosti podle éry: ${nl.join(" a ")} patří do našeho letopočtu, ${label(ostatni[0])} před něj. Která éra je starší?`,
        `Všechno před naším letopočtem je starší než cokoli z našeho letopočtu, takže ${nl.join(" ani ")} nejstarší být nemůže. Zbývají letopočty př. n. l. a mezi nimi je nejstarší ten s větším číslem — větší číslo př. n. l. totiž znamená dál do minulosti.`,
      ],
      explanation: `Letopočty př. n. l. jsou vždy starší než n. l. Mezi nimi je nejstarší ten s největším číslem — proto ${label(nejstarsi)}.`,
    },
  );
}

void pick;

// ── Topic ────────────────────────────────────────────────────────────────
export const PERIODIZACE_LETOPOCET: TopicMetadata[] = [
  {
    id: "g6-dej-periodizace-letopocet-6",
    rvpNodeId:
      "g6-dejepis-uvod-do-dejepisu-historie-a-historicke-prameny-periodizace-dejin-casova-primka-letopocet",
    displayName: "Letopočet a časová přímka",
    title: "Periodizace dějin, časová přímka, letopočet",
    studentTitle: "Letopočet",
    subject: "dejepis",
    category: "Úvod do dějepisu",
    topic: "Historie a historické prameny",
    briefDescription: "Naučíš se počítat se letopočty a určovat století na časové přímce.",
    keywords: [
      "letopočet", "století", "časová přímka", "periodizace", "před naším letopočtem",
      "našeho letopočtu", "př. n. l.", "n. l.", "datování", "chronologie",
    ],
    goals: [
      "Určit století, do kterého rok patří.",
      "Porovnat a seřadit letopočty př. n. l. (větší číslo = starší).",
      "Spočítat dobu trvání přes přelom letopočtu (rok 0 neexistuje).",
    ],
    boundaries: [
      "Jen práce s letopočty a stoletími (ne konkrétní dějinné události zpaměti).",
      "Čísla jsou hezká (celá století, žádné záporné výsledky).",
      "Přelom letopočtu se počítá jednoduchým pravidlem (− 1 za rok 0).",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Století = počet celých stovek + 1 (rok 1492 = 15. století). U letopočtů př. n. l. je větší číslo starší. Přes přelom letopočtu se roky sčítají a odečítá se 1 (rok 0 neexistuje).",
      steps: [
        "Pro století spočítej celé stovky v roce a přičti 1.",
        "U př. n. l. platí: čím větší číslo, tím dál v minulosti.",
        "Přes přelom letopočtu sečti oba letopočty a odečti 1 za chybějící rok 0.",
      ],
      commonMistake: "Vzít u století jen číslo stovek (1492 → 14. století), nebo zapomenout, že rok 0 neexistuje.",
      example: "Rok 1492 = 15. století. Od 100 př. n. l. do 100 n. l. je 100 + 100 − 1 = 199 let.",
    },
  },
];
