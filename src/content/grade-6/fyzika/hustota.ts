/**
 * Fyzika 6. ročník — Hustota (ρ = m/V). VRCHOL okruhu měření veličin.
 *
 * Staví na hmotnosti + objemu. Klíčová pedagogika: vztah mezi třemi veličinami
 * (ρ, m, V) a jejich jednotkami (g/cm³). Chybový model cílí na typické chyby:
 *  • záměna vzorce (V/m místo m/V),
 *  • násobení místo dělení (m·V),
 *  • zapomenutý převod jednotek (kg→g, dm³→cm³).
 *
 * select_one (žák vybírá) — vzorec se procvičí přes distraktory, ne volným psaním.
 * Reálné hustoty látek → úlohy mají fyzikální smysl (rubrika: realističnost).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { cz, pick, buildChoiceTask as task } from "./_shared";

/** Látky s reálnou hustotou (g/cm³) a hezkými hodnotami pro 6. ročník. */
const LATKY = [
  { nazev: "led", rho: 0.9 },
  { nazev: "dřevo (buk)", rho: 0.7 },
  { nazev: "hliník", rho: 2.7 },
  { nazev: "železo", rho: 7.8 },
  { nazev: "měď", rho: 8.9 },
  { nazev: "stříbro", rho: 10.5 },
];

// L1 — dáno m a V, spočítej hustotu ρ = m / V (hezký výsledek).
function genL1(): PracticeTask {
  const latka = pick(LATKY);
  const V = pick([10, 20, 50, 100]); // cm³ — násobek 10 → m vždy celé
  const m = +(latka.rho * V).toFixed(1);
  const rho = latka.rho;
  return task(
    `Těleso má hmotnost ${cz(m)} g a objem ${cz(V)} cm³. Jaká je jeho hustota?`,
    `${cz(rho)} g/cm³`,
    [
      {
        value: `${cz(+(V / m).toFixed(3))} g/cm³`,
        why: `Zaměnil jsi vzorec. Hustota = hmotnost ÷ objem (ρ = m/V), ne objem ÷ hmotnost.`,
      },
      {
        value: `${cz(m * V)} g/cm³`,
        why: `Hmotnost a objem se nenásobí. Hustota se počítá dělením: ρ = m ÷ V.`,
      },
      {
        value: `${cz(+(rho * 10).toFixed(1))} g/cm³`,
        why: `Chyba o řád při dělení. Zkontroluj, kam patří desetinná čárka: ${cz(m)} ÷ ${cz(V)} = ${cz(rho)}.`,
      },
    ],
    {
      hints: [
        `Krok 1: Napiš si vzorec pro hustotu — ρ = m / V (hmotnost dělená objemem).`,
        `Krok 2: Dosaď zadané hodnoty: hmotnost m = ${cz(m)} g a objem V = ${cz(V)} cm³.`,
        `Krok 3: Vyděl hmotnost objemem. Výsledek vyjde v g/cm³ — říká, kolik gramů váží 1 cm³.`,
      ],
      solutionSteps: [
        `ρ = m / V`,
        `ρ = ${cz(m)} ÷ ${cz(V)} = ${cz(rho)} g/cm³`,
      ],
      explanation: `Hustota říká, kolik gramů váží 1 cm³ látky. Spočítá se ρ = m / V = ${cz(m)} ÷ ${cz(V)} = ${cz(rho)} g/cm³.`,
    },
  );
}

// L2 — převod jednotky (kg→g nebo dm³→cm³) + výpočet hustoty (dva kroky).
function genL2(): PracticeTask {
  const latka = pick([LATKY[2], LATKY[3], LATKY[4]]); // hliník/železo/měď (ρ ≥ 2,7)
  const V = pick([100, 200, 500]); // cm³
  const mG = +(latka.rho * V).toFixed(0);
  const mKg = +(mG / 1000).toFixed(3);
  const rho = latka.rho;
  return task(
    `Těleso má hmotnost ${cz(mKg)} kg a objem ${cz(V)} cm³. Jaká je jeho hustota v g/cm³?`,
    `${cz(rho)} g/cm³`,
    [
      {
        value: `${cz(+(mKg / V).toFixed(5))} g/cm³`,
        why: `Zapomněl jsi převést kg na g. Nejdřív ${cz(mKg)} kg = ${cz(mG)} g, teprve pak děl objemem.`,
      },
      {
        value: `${cz(+(V / mG).toFixed(4))} g/cm³`,
        why: `Zaměnil jsi vzorec. Hustota = hmotnost ÷ objem, ne objem ÷ hmotnost.`,
      },
      {
        value: `${cz(+(rho * 10).toFixed(1))} g/cm³`,
        why: `Chyba o řád při převodu nebo dělení. ${cz(mG)} g ÷ ${cz(V)} cm³ = ${cz(rho)} g/cm³.`,
      },
    ],
    {
      hints: [
        `Krok 1: Jednotky musí sedět. Hmotnost máš v kg, ale objem v cm³ — převeď kg na gramy (vynásob 1000).`,
        `Krok 2: Teď máš hmotnost v gramech. Napiš si vzorec ρ = m / V.`,
        `Krok 3: Vyděl hmotnost (v gramech) objemem ${cz(V)} cm³. Výsledek je v g/cm³.`,
      ],
      solutionSteps: [
        `Převod: ${cz(mKg)} kg = ${cz(mG)} g`,
        `ρ = ${cz(mG)} ÷ ${cz(V)} = ${cz(rho)} g/cm³`,
      ],
      explanation: `Jednotky musí sedět (g a cm³). Nejdřív ${cz(mKg)} kg = ${cz(mG)} g, pak ρ = ${cz(mG)} ÷ ${cz(V)} = ${cz(rho)} g/cm³.`,
    },
  );
}

// L3 — odvozený vzorec m = ρ · V, NEBO identifikace látky podle hustoty.
function genL3(): PracticeTask {
  if (Math.random() < 0.5) {
    // m = ρ · V (odvozený vzorec)
    const latka = pick(LATKY);
    const V = pick([10, 20, 30, 50]);
    const m = +(latka.rho * V).toFixed(1);
    return task(
      `${latka.nazev[0].toUpperCase()}${latka.nazev.slice(1)} má hustotu ${cz(latka.rho)} g/cm³. Jakou hmotnost má ${cz(V)} cm³ této látky?`,
      `${cz(m)} g`,
      [
        {
          value: `${cz(+(V / latka.rho).toFixed(2))} g`,
          why: `Zaměnil jsi vzorec. Z ρ = m/V plyne m = ρ · V (násobíš), ne V ÷ ρ.`,
        },
        {
          value: `${cz(latka.rho)} g`,
          why: `To je hustota (hmotnost 1 cm³). Pro ${cz(V)} cm³ musíš vynásobit: m = ρ · V.`,
        },
        {
          value: `${cz(+(m * 10).toFixed(1))} g`,
          why: `Chyba o řád. m = ρ · V = ${cz(latka.rho)} × ${cz(V)} = ${cz(m)} g.`,
        },
      ],
      {
        hints: [
          `Krok 1: Hledáš hmotnost, ne hustotu. Ze vztahu ρ = m / V vyjádři hmotnost: m = ρ · V.`,
          `Krok 2: Dosaď do vzorce hustotu a objem ze zadání (obě hodnoty máš v textu úlohy).`,
          `Krok 3: Vynásob hustotu objemem. Výsledek je hmotnost v gramech.`,
        ],
        solutionSteps: [
          `m = ρ · V`,
          `m = ${cz(latka.rho)} × ${cz(V)} = ${cz(m)} g`,
        ],
        explanation: `Hustota udává hmotnost 1 cm³. Pro ${cz(V)} cm³ je hmotnost m = ρ · V = ${cz(latka.rho)} × ${cz(V)} = ${cz(m)} g.`,
      },
    );
  }
  // identifikace látky podle vypočtené hustoty
  const latka = pick(LATKY);
  const V = pick([10, 20, 50]);
  const m = +(latka.rho * V).toFixed(1);
  const others = LATKY.filter((l) => l.nazev !== latka.nazev);
  const wrong1 = pick(others);
  const wrong2 = pick(others.filter((l) => l.nazev !== wrong1.nazev));
  return task(
    `Těleso má hmotnost ${cz(m)} g a objem ${cz(V)} cm³. Z které látky je? (ρ: led 0,9 · dřevo 0,7 · hliník 2,7 · železo 7,8 · měď 8,9 · stříbro 10,5 g/cm³)`,
    latka.nazev,
    [
      {
        value: wrong1.nazev,
        why: `Nejdřív spočítej hustotu: ρ = ${cz(m)} ÷ ${cz(V)} = ${cz(latka.rho)} g/cm³. To odpovídá látce „${latka.nazev}", ne „${wrong1.nazev}" (${cz(wrong1.rho)}).`,
      },
      {
        value: wrong2.nazev,
        why: `Spočítaná hustota je ${cz(latka.rho)} g/cm³ (${cz(m)} ÷ ${cz(V)}). „${wrong2.nazev}" má ${cz(wrong2.rho)} g/cm³ — to nesedí.`,
      },
    ],
    {
      hints: [
        `Krok 1: Nejdřív spočítej hustotu tělesa ze vztahu ρ = m / V.`,
        `Krok 2: Dosaď m = ${cz(m)} g a V = ${cz(V)} cm³ a vyděl hmotnost objemem.`,
        `Krok 3: Vypočítanou hustotu najdi v tabulce látek v zadání — u které látky sedí, ta je správná.`,
      ],
      solutionSteps: [
        `ρ = ${cz(m)} ÷ ${cz(V)} = ${cz(latka.rho)} g/cm³`,
        `${cz(latka.rho)} g/cm³ odpovídá látce „${latka.nazev}".`,
      ],
      explanation: `Hustota je vlastnost látky — spočítáš ji z m a V a porovnáš s tabulkou: ρ = ${cz(m)} ÷ ${cz(V)} = ${cz(latka.rho)} g/cm³ → ${latka.nazev}.`,
    },
  );
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 24; i++) {
    tasks.push(level === 1 ? genL1() : level === 2 ? genL2() : genL3());
  }
  return tasks;
}

export const HUSTOTA: TopicMetadata[] = [
  {
    id: "g6-fyz-hustota-6",
    rvpNodeId: "g6-fyzika-mereni-fyzikalnich-velicin-hustota-teplota-cas-hustota-vypocet-a-mereni",
    displayName: "Hustota",
    title: "Hustota – výpočet a měření",
    studentTitle: "Hustota",
    subject: "fyzika",
    category: "Měření fyzikálních veličin",
    topic: "Hustota, teplota, čas",
    briefDescription: "Spočítáš hustotu ze vztahu ρ = m/V a poznáš látku.",
    keywords: [
      "hustota", "ρ", "rho", "vzorec hustoty", "hmotnost", "objem",
      "g/cm³", "m/V", "výpočet hustoty", "látka",
    ],
    goals: [
      "Spočítat hustotu ze vztahu ρ = m / V.",
      "Vyjádřit hmotnost m = ρ · V z téhož vztahu.",
      "Sjednotit jednotky (g, cm³) před výpočtem a určit látku podle hustoty.",
    ],
    boundaries: [
      "Pouze hustota pevných látek v g/cm³.",
      "Hodnoty vedou na hezká čísla (max 1 desetinné místo).",
      "Nezahrnuje vztlakovou sílu ani plovoucí tělesa.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    prerequisites: ["g6-fyz-mereni-hmotnosti-6", "g6-fyz-mereni-objemu-6"],
    recommendedNext: ["g6-fyz-mereni-teploty-6"],
    generator: gen,
    helpTemplate: {
      hint: "Hustota ρ = hmotnost m ÷ objem V. Jednotka g/cm³ říká, kolik gramů váží 1 cm³. Ze vztahu plyne i m = ρ · V a V = m / ρ.",
      steps: [
        "Sjednoť jednotky: hmotnost v g, objem v cm³.",
        "Dosaď do ρ = m / V a vyděl.",
        "Hledáš-li hmotnost, použij m = ρ · V (násobíš).",
      ],
      commonMistake: "Záměna vzorce (objem ÷ hmotnost) nebo násobení místo dělení.",
      example: "m = 240 g, V = 30 cm³ → ρ = 240 ÷ 30 = 8 g/cm³ (železo).",
    },
  },
];
