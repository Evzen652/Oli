/**
 * Dějepis 6. ročník — Periodizace dějin, časová přímka, letopočet.
 *
 * ZLATÝ VZOR faktického tématu 2. stupně (most z výpočetního světa fyziky):
 * numericky ověřitelné, ale procvičuje HISTORICKÉ uvažování o čase.
 *
 * Demonstruje, že chybový model distraktorů funguje i na faktický předmět —
 * každá špatná možnost = konkrétní typický omyl s letopočtem:
 *  • L1 určení století: rok 1492 → 14. století (vzal číslo stovek místo +1).
 *  • L2 řazení / rozdíl př. n. l.: menší číslo = dřív (u př. n. l. je to obráceně).
 *  • L3 přes přelom letopočtu: zapomenutý rok 0 (mezi 1 př. n. l. a 1 n. l. je 1 rok).
 *
 * Žák VYBÍRÁ (select_one) — neuvádí volnou odpověď. Téma záměrně nemíchá typy
 * (vyhýbá se Cause C: select_one téma musí emitovat jen úlohy s `options`).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { pick, buildChoiceTask as choice } from "./_shared";

// Století, do kterého rok patří: počet celých stovek + 1
// (rok 1492 → 14 stovek + 1 = 15. století; obecně ceil(rok/100)).
const stoleti = (rok: number) => Math.ceil(rok / 100);

// ── Generátor ──────────────────────────────────────────────────────────────
function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 24; i++) {
    tasks.push(level === 1 ? genL1() : level === 2 ? genL2() : genL3());
  }
  return tasks;
}

// L1 — určení století roku n. l. (jeden krok: počet stovek + 1).
function genL1(): PracticeTask {
  // záměrně žádné násobky 100, ať počet stovek je odlišný distraktor
  const rok = pick([1492, 1805, 1648, 1212, 1789, 1066, 1415, 1356, 1781, 988]);
  const cent = stoleti(rok);
  const stovky = Math.floor(rok / 100);
  return choice(
    `Do kterého století patří rok ${rok} n. l.?`,
    `${cent}. století`,
    [
      {
        value: `${stovky}. století`,
        why: `Vzal jsi jen číslo stovek (${stovky}). Století se počítá o jedno výš — rok ${rok} patří do ${cent}. století. (Příklad: rok 1492 = 15. století, ne 14.)`,
      },
      {
        value: `${cent + 1}. století`,
        why: `Přidal jsi jedno století navíc. ${cent}. století končí až rokem ${cent * 100}, takže rok ${rok} do něj ještě spadá.`,
      },
      {
        value: `${cent}. století př. n. l.`,
        why: `Spletl sis éru. Rok ${rok} je v našem letopočtu (n. l.), ne před ním.`,
      },
    ],
    {
      hints: [
        "Století urči z počtu celých stovek v roce — ale pozor, počítá se o jedno výš.",
        `Rok ${rok}: kolik celých stovek obsahuje?`,
        "K počtu stovek přičti 1 — i začátek dalšího stovkového úseku už patří do vyššího století.",
      ],
      solutionSteps: [
        `Rok ${rok} obsahuje ${stovky} celých stovek.`,
        `${stovky} + 1 = ${cent}. století (trvá od roku ${(cent - 1) * 100 + 1} do ${cent * 100}).`,
      ],
      explanation: `Století se počítá tak, že k počtu celých stovek přičteš jedno: rok ${rok} má ${stovky} stovek, patří tedy do ${cent}. století (to trvá od roku ${(cent - 1) * 100 + 1} do ${cent * 100}).`,
    },
  );
}

// L2 — práce s letopočty př. n. l. (rozdíl, nebo řazení: větší = starší).
function genL2(): PracticeTask {
  if (Math.random() < 0.5) {
    // rozdíl dvou let př. n. l. (stejná éra → odečítání)
    const [a, b] = pick([
      [500, 200], [800, 300], [400, 100], [600, 150],
      [300, 50], [750, 250], [1000, 600], [450, 150],
    ]);
    const ans = a - b;
    return choice(
      `Jedna stavba vznikla roku ${a} př. n. l., druhá roku ${b} př. n. l. Kolik let je mezi nimi?`,
      pad(ans, "ROK"),
      [
        {
          value: pad(a + b, "ROK"),
          why: `Sčítal jsi. Obě data jsou př. n. l. (stejná éra), takže se odčítají: ${a} − ${b} = ${ans}.`,
        },
        {
          value: pad(a + b - 1, "ROK"),
          why: `Použil jsi pravidlo pro přelom letopočtu (− 1 za chybějící rok 0). Tady jsou ale obě data př. n. l. — jen se odečtou: ${a} − ${b}.`,
        },
        {
          value: pad(a, "ROK"),
          why: `To je jen první letopočet, ne rozdíl. Odečti od něj druhý: ${a} − ${b} = ${ans}.`,
        },
      ],
      {
        hints: [
          "Obě data jsou ve stejné éře (př. n. l.), takže rozdíl spočítáš odečtením.",
          `Od staršího (většího) letopočtu odečti mladší: ${a} − ${b}.`,
        ],
        explanation: `Obě události jsou před naším letopočtem, takže jde o jednu éru — rozdíl je prosté odečtení: ${a} − ${b} = ${pad(ans, "ROK")}. (Nesčítá se a neodečítá rok 0 — to platí jen přes přelom letopočtu.)`,
      },
    );
  }
  // řazení: která událost př. n. l. je nejstarší (větší číslo = starší)
  const roky = pick([
    [776, 509, 264], [753, 490, 146], [3000, 1200, 800],
    [2500, 1500, 600], [1000, 500, 100],
  ]);
  const max = Math.max(...roky);
  const ostatni = roky.filter((r) => r !== max);
  return choice(
    "Která událost je nejstarší? (všechny se staly před naším letopočtem)",
    `${max} př. n. l.`,
    ostatni.map((r) => ({
      value: `${r} př. n. l.`,
      why: `U let př. n. l. platí: čím větší číslo, tím dál v minulosti. ${max} př. n. l. bylo dřív než ${r} př. n. l.`,
    })),
    {
      hints: [
        "U letopočtů před naším letopočtem (př. n. l.) běží čas obráceně, do minulosti.",
        "Čím větší číslo př. n. l., tím starší událost — najdi tedy největší číslo.",
      ],
      explanation: `Před naším letopočtem se roky počítají směrem do minulosti, takže větší číslo = starší událost. Nejstarší je proto rok ${max} př. n. l.`,
    },
  );
}

// L3 — přes přelom letopočtu (rok 0 neexistuje), nebo řazení napříč érami.
function genL3(): PracticeTask {
  if (Math.random() < 0.5) {
    // doba trvání od X př. n. l. do Y n. l.: X + Y − 1 (rok 0 neexistuje)
    const a = pick([100, 200, 300, 500, 400, 750]);
    const b = pick([100, 200, 300, 500, 400]);
    const ans = a + b - 1;
    return choice(
      `Říše vznikla roku ${a} př. n. l. a zanikla roku ${b} n. l. Jak dlouho existovala? (Pozor: rok 0 neexistuje.)`,
      pad(ans, "ROK"),
      [
        {
          value: pad(a + b, "ROK"),
          why: `Zapomněl jsi, že rok 0 neexistuje — mezi 1 př. n. l. a 1 n. l. je jen 1 rok. Proto se po sečtení odečítá 1: ${a} + ${b} − 1 = ${ans}.`,
        },
        {
          value: pad(Math.abs(a - b), "ROK"),
          why: `Odečetl jsi, jako by obě data byla ve stejné éře. Přes přelom letopočtu se naopak sčítá (a odečte 1 za chybějící rok 0): ${a} + ${b} − 1.`,
        },
        {
          value: pad(a + b - 2, "ROK"),
          why: `Odečetl jsi 2, ale chybí jen jediný rok (rok 0). Správně ${a} + ${b} − 1 = ${ans}.`,
        },
      ],
      {
        hints: [
          "Data jsou ve dvou různých érách (př. n. l. a n. l.), takže se roky sčítají.",
          "Pozor na přelom: rok 0 neexistuje, hned po 1 př. n. l. následuje 1 n. l.",
          `Sečti oba letopočty a odečti 1 za chybějící rok 0: ${a} + ${b} − 1.`,
        ],
        solutionSteps: [
          `Přes přelom se letopočty sčítají: ${a} + ${b} = ${a + b}.`,
          `Rok 0 neexistuje, odečti 1: ${a + b} − 1 = ${ans}.`,
        ],
        explanation: `Události jsou ve dvou érách, proto se roky sčítají: ${a} + ${b} = ${a + b}. Protože rok 0 neexistuje (po 1 př. n. l. přijde rovnou 1 n. l.), odečteš 1: ${ans}.`,
      },
    );
  }
  // řazení napříč érami: nejstarší je vždy př. n. l., a tam větší číslo
  const sada = pick([
    [{ y: 300, bc: true }, { y: 200, bc: false }, { y: 50, bc: true }, { y: 400, bc: false }],
    [{ y: 500, bc: true }, { y: 100, bc: false }, { y: 150, bc: true }, { y: 300, bc: false }],
    [{ y: 250, bc: true }, { y: 50, bc: false }, { y: 800, bc: true }, { y: 200, bc: false }],
  ]);
  const label = (e: { y: number; bc: boolean }) => `${e.y} ${e.bc ? "př. n. l." : "n. l."}`;
  // nejstarší = největší rok mezi př. n. l.
  const bc = sada.filter((e) => e.bc);
  const nejstarsi = bc.reduce((m, e) => (e.y > m.y ? e : m));
  return choice(
    "Která událost je nejstarší?",
    label(nejstarsi),
    sada
      .filter((e) => e !== nejstarsi)
      .map((e) => ({
        value: label(e),
        why: e.bc
          ? `Vybral jsi správně letopočet př. n. l., ale větší číslo př. n. l. = starší. Nejstarší je ${label(nejstarsi)}`
          : `To je náš letopočet (n. l.). Vše před naším letopočtem se stalo dřív — nejstarší je ${label(nejstarsi)}`,
      })),
    {
      hints: [
        "Nejdřív rozliš éry: všechno před naším letopočtem je starší než cokoli z našeho letopočtu.",
        "Mezi lety př. n. l. je nejstarší to s největším číslem.",
      ],
      explanation: `Letopočty př. n. l. jsou vždy starší než n. l. Mezi nimi je nejstarší ten s největším číslem — proto ${label(nejstarsi)}`,
    },
  );
}

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
