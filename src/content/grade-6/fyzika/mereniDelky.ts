/**
 * Fyzika 6. ročník — Měření délky (jednotky, převody, aplikace).
 *
 * ZLATÝ VZOR výpočetního tématu 2. stupně. Demonstruje:
 *  • Reálná gradace L1→L3 (jeden krok → opačný směr/složené → aplikace).
 *  • Chybový model distraktorů — KAŽDÁ špatná možnost = konkrétní typická chyba
 *    (špatný směr převodu, posun o řád, zapomenutý převod), ne náhodný posun.
 *  • optionFeedback — cílený diagnostický feedback per zvolená chyba.
 *  • Nápověda = METODA (převodní vztah), nikdy výsledek. solutionSteps = postup.
 *
 * Žák VYBÍRÁ (select_one) — neuvádí volnou odpověď. Možnosti nesou jednotku.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { cz, pick, buildChoiceTask as task } from "./_shared";

// ── Generátor ──────────────────────────────────────────────────────────────
function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 24; i++) {
    tasks.push(level === 1 ? genL1() : level === 2 ? genL2() : genL3());
  }
  return tasks;
}

// L1 — přímý převod větší → menší jednotka (násobení jedním krokem).
function genL1(): PracticeTask {
  // 1 [větší] = factor [menší]
  const conv = pick([
    { big: "m", small: "cm", factor: 100 },
    { big: "cm", small: "mm", factor: 10 },
    { big: "km", small: "m", factor: 1000 },
    { big: "m", small: "mm", factor: 1000 },
    { big: "dm", small: "cm", factor: 10 },
  ]);
  const v = Math.floor(Math.random() * 8) + 2; // 2–9 (hezká celá čísla)
  const correctNum = v * conv.factor;
  const correct = `${cz(correctNum)} ${conv.small}`;

  const distractors: { value: string; why: string }[] = [
    {
      value: `${cz(v)} ${conv.small}`,
      why: `Jen jsi vyměnil jednotku — číslo musíš převést. 1 ${conv.big} = ${conv.factor} ${conv.small}.`,
    },
    {
      value: `${cz(v * conv.factor * 10)} ${conv.small}`,
      why: `Posunul ses o jeden řád moc. 1 ${conv.big} = ${conv.factor} ${conv.small}, ne ${conv.factor * 10}.`,
    },
  ];
  // chyba „dělil místo násobil" (jen když dá hezké číslo)
  if (correctNum / (conv.factor * conv.factor) >= 0.001) {
    distractors.push({
      value: `${cz(v / conv.factor)} ${conv.small}`,
      why: `Převáděl jsi špatným směrem. Z větší jednotky na menší se NÁSOBÍ, ne dělí.`,
    });
  } else {
    distractors.push({
      value: `${cz(v * (conv.factor / 10))} ${conv.small}`,
      why: `Posunul ses o jeden řád málo. 1 ${conv.big} = ${conv.factor} ${conv.small}.`,
    });
  }

  return task(
    `Převeď ${cz(v)} ${conv.big} na ${conv.small}.`,
    correct,
    distractors,
    {
      hints: [
        `Krok 1: Jdeš z větší jednotky (${conv.big}) na menší (${conv.small}) — budeš násobit.`,
        `Krok 2: Připomeň si vztah mezi jednotkami: 1 ${conv.big} = ${conv.factor} ${conv.small}.`,
        `Krok 3: Vynásob zadané číslo ${conv.factor}× a dej pozor, kam patří desetinná čárka.`,
      ],
      solutionSteps: [
        `1 ${conv.big} = ${conv.factor} ${conv.small}`,
        `${cz(v)} ${conv.big} = ${cz(v)} × ${conv.factor} = ${cz(correctNum)} ${conv.small}`,
      ],
      explanation: `Menší jednotka = víc dílků, proto se z ${conv.big} na ${conv.small} násobí ${conv.factor}× : ${cz(v)} × ${conv.factor} = ${cz(correctNum)} ${conv.small}.`,
    },
  );
}

// L2 — opačný směr (menší → větší = dělení) NEBO složená jednotka.
function genL2(): PracticeTask {
  if (Math.random() < 0.5) {
    // menší → větší (dělení)
    const conv = pick([
      { big: "m", small: "cm", factor: 100 },
      { big: "km", small: "m", factor: 1000 },
      { big: "cm", small: "mm", factor: 10 },
      { big: "m", small: "mm", factor: 1000 },
    ]);
    const bigVal = pick([1.2, 2.5, 3, 4.5, 0.8, 1.5, 6, 2.4]);
    const smallVal = bigVal * conv.factor; // celé číslo v menší jednotce
    const correct = `${cz(bigVal)} ${conv.big}`;
    return task(
      `Převeď ${cz(smallVal)} ${conv.small} na ${conv.big}.`,
      correct,
      [
        {
          value: `${cz(smallVal * conv.factor)} ${conv.big}`,
          why: `Převáděl jsi špatným směrem. Z menší jednotky na větší se DĚLÍ, ne násobí.`,
        },
        {
          value: `${cz(bigVal * 10)} ${conv.big}`,
          why: `Posunul ses o jeden řád. 1 ${conv.big} = ${conv.factor} ${conv.small}.`,
        },
        {
          value: `${cz(smallVal)} ${conv.big}`,
          why: `Jen jsi vyměnil jednotku — číslo zůstalo stejné. ${conv.small} musíš převést na ${conv.big}.`,
        },
      ],
      {
        hints: [
          `Krok 1: Jdeš z menší jednotky (${conv.small}) na větší (${conv.big}) — budeš dělit.`,
          `Krok 2: Připomeň si vztah: 1 ${conv.big} = ${conv.factor} ${conv.small}.`,
          `Krok 3: Vyděl zadané číslo ${conv.factor}. Výsledek bude menší než původní číslo.`,
        ],
        solutionSteps: [
          `1 ${conv.big} = ${conv.factor} ${conv.small}`,
          `${cz(smallVal)} ${conv.small} = ${cz(smallVal)} ÷ ${conv.factor} = ${cz(bigVal)} ${conv.big}`,
        ],
        explanation: `Větší jednotka = méně dílků, proto se z ${conv.small} na ${conv.big} dělí ${conv.factor} : ${cz(smallVal)} ÷ ${conv.factor} = ${cz(bigVal)} ${conv.big}.`,
      },
    );
  }
  // složená jednotka → menší (m + cm → cm apod.)
  const combo = pick([
    { big: "m", small: "cm", factor: 100 },
    { big: "m", small: "cm", factor: 100 },
    { big: "cm", small: "mm", factor: 10 },
  ]);
  const bigPart = Math.floor(Math.random() * 4) + 1; // 1–4
  const smallPart = (Math.floor(Math.random() * 8) + 1) * (combo.factor === 100 ? 10 : 1); // hezké
  const correctNum = bigPart * combo.factor + smallPart;
  const correct = `${cz(correctNum)} ${combo.small}`;
  return task(
    `Tyč měří ${cz(bigPart)} ${combo.big} a ${cz(smallPart)} ${combo.small}. Kolik je to v jednotce ${combo.small}?`,
    correct,
    [
      {
        value: `${cz(bigPart + smallPart)} ${combo.small}`,
        why: `Sečetl jsi obě čísla bez převodu. Nejdřív převeď ${combo.big} na ${combo.small}, pak přičti.`,
      },
      {
        value: `${cz(bigPart * combo.factor)} ${combo.small}`,
        why: `Zapomněl jsi přičíst ${cz(smallPart)} ${combo.small}. Převedl jsi jen ${combo.big}.`,
      },
      {
        value: `${cz(bigPart * combo.factor * 10 + smallPart)} ${combo.small}`,
        why: `Posunul ses o řád při převodu ${combo.big}. 1 ${combo.big} = ${combo.factor} ${combo.small}.`,
      },
    ],
    {
      hints: [
        `Krok 1: Obě části musí být ve stejné jednotce. Převeď ${combo.big} na ${combo.small} (1 ${combo.big} = ${combo.factor} ${combo.small}).`,
        `Krok 2: K převedené hodnotě přičti zbývajících ${cz(smallPart)} ${combo.small}.`,
      ],
      solutionSteps: [
        `${cz(bigPart)} ${combo.big} = ${cz(bigPart * combo.factor)} ${combo.small}`,
        `${cz(bigPart * combo.factor)} + ${cz(smallPart)} = ${cz(correctNum)} ${combo.small}`,
      ],
      explanation: `Obě části musí být ve stejné jednotce: ${cz(bigPart)} ${combo.big} = ${cz(bigPart * combo.factor)} ${combo.small}, plus ${cz(smallPart)} ${combo.small} = ${cz(correctNum)} ${combo.small}.`,
    },
  );
}

// L3 — aplikační slovní úloha (víc kroků: výpočet + převod jednotky).
function genL3(): PracticeTask {
  if (Math.random() < 0.5) {
    // kola na dráze → km
    const laps = Math.floor(Math.random() * 4) + 2; // 2–5
    const lapM = pick([200, 250, 300, 400, 500]);
    const totalM = laps * lapM;
    const totalKm = totalM / 1000;
    const correct = `${cz(totalKm)} km`;
    return task(
      `Běžec uběhl ${pad(laps, "KOLO")} po ${cz(lapM)} m. Kolik kilometrů uběhl celkem?`,
      correct,
      [
        {
          value: `${cz(totalM)} km`,
          why: `Spočítal jsi metry správně (${cz(totalM)} m), ale otázka je na kilometry: ${cz(totalM)} m = ${cz(totalKm)} km.`,
        },
        {
          value: `${cz(lapM / 1000)} km`,
          why: `Převedl jsi jen jedno kolo. Nejdřív spočítej celkovou dráhu: ${cz(laps)} × ${cz(lapM)} m.`,
        },
        {
          value: `${cz(totalM / 100)} km`,
          why: `Při převodu na km se dělí 1000 (ne 100). 1 km = 1000 m.`,
        },
      ],
      {
        hints: [
          `Krok 1: Nejdřív spočítej celkovou dráhu v metrech — vynásob počet kol délkou jednoho kola.`,
          `Krok 2: Výsledek máš v metrech, ale otázka chce kilometry. Převeď ho dělením 1000 (z metrů na kilometry).`,
        ],
        solutionSteps: [
          `Celkem: ${cz(laps)} × ${cz(lapM)} = ${cz(totalM)} m`,
          `Na km: ${cz(totalM)} ÷ 1000 = ${cz(totalKm)} km`,
        ],
        explanation: `Nejdřív celková dráha ${cz(laps)} × ${cz(lapM)} = ${cz(totalM)} m, pak převod 1 km = 1000 m → ${cz(totalM)} ÷ 1000 = ${cz(totalKm)} km.`,
      },
    );
  }
  // kolik chybí do celku (m + převod)
  const targetM = pick([1000, 2000, 1500]);
  const doneM = pick([300, 450, 600, 750, 800, 250]);
  const restM = targetM - doneM;
  const correct = `${cz(restM)} m`;
  return task(
    `Trasa je dlouhá ${cz(targetM / 1000)} km. Ušel jsi ${cz(doneM)} m. Kolik metrů ti zbývá?`,
    correct,
    [
      {
        value: `${cz(targetM + doneM)} m`,
        why: `Sečetl jsi místo odečetl. Zbytek = celá trasa − už ušlé.`,
      },
      {
        value: `${cz(targetM / 1000 - doneM / 1000)} m`,
        why: `Počítal jsi v kilometrech (${cz(targetM / 1000)} − ${cz(doneM / 1000)} = ${cz(targetM / 1000 - doneM / 1000)} km), ale odpověď má být v metrech: ${cz(restM)} m.`,
      },
      {
        value: `${cz(doneM)} m`,
        why: `To je vzdálenost, kterou jsi už ušel, ne zbytek. Odečti ji od celé trasy.`,
      },
    ],
    {
      hints: [
        `Krok 1: Jednotky musí sedět. Převeď trasu z kilometrů na metry (1 km = 1000 m).`,
        `Krok 2: Od trasy v metrech odečti vzdálenost, kterou jsi už ušel.`,
      ],
      solutionSteps: [
        `Trasa: ${cz(targetM / 1000)} km = ${cz(targetM)} m`,
        `Zbývá: ${cz(targetM)} − ${cz(doneM)} = ${cz(restM)} m`,
      ],
      explanation: `Obě hodnoty musí být v metrech: ${cz(targetM / 1000)} km = ${cz(targetM)} m. Zbytek = ${cz(targetM)} − ${cz(doneM)} = ${cz(restM)} m.`,
    },
  );
}

// ── Topic ────────────────────────────────────────────────────────────────
export const MERENI_DELKY: TopicMetadata[] = [
  {
    id: "g6-fyz-mereni-delky-6",
    rvpNodeId: "g6-fyzika-mereni-fyzikalnich-velicin-delka-objem-hmotnost-delka-jednotky-mereni-delky",
    displayName: "Měření délky",
    title: "Délka – jednotky, měření délky",
    studentTitle: "Měření délky",
    subject: "fyzika",
    category: "Měření fyzikálních veličin",
    topic: "Délka, objem, hmotnost",
    briefDescription: "Převedeš jednotky délky a použiješ je ve výpočtech.",
    keywords: [
      "délka", "jednotky délky", "převod jednotek", "milimetr", "centimetr",
      "metr", "kilometr", "mm", "cm", "m", "km", "měření délky",
    ],
    goals: [
      "Převést mezi jednotkami délky (mm, cm, dm, m, km) oběma směry.",
      "Rozlišit, kdy se při převodu násobí a kdy dělí.",
      "Použít převod jednotek ve víckrokové slovní úloze.",
    ],
    boundaries: [
      "Pouze délkové jednotky (ne obsah ani objem).",
      "Hodnoty jsou hezká čísla, max 1 desetinné místo.",
      "Nezahrnuje převod plošných jednotek (cm² apod.).",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-fyz-mereni-hmotnosti-6", "g6-fyz-hustota-6"],
    generator: gen,
    helpTemplate: {
      hint: "Mezi sousedními jednotkami délky je vždy převod ×10, ×100 nebo ×1000. Z větší jednotky na menší se násobí, z menší na větší dělí.",
      steps: [
        "Urči, zda jdeš z větší jednotky na menší (násobíš), nebo z menší na větší (dělíš).",
        "Připomeň si vztah: 1 cm = 10 mm, 1 m = 100 cm, 1 km = 1000 m.",
        "U slovní úlohy nejdřív dopočítej hodnotu, pak převeď na požadovanou jednotku.",
      ],
      commonMistake: "Špatný směr (násobení místo dělení) nebo posun o jeden řád (×10 místo ×100).",
      example: "2,5 km = 2,5 × 1000 = 2500 m. Naopak 2500 m = 2500 ÷ 1000 = 2,5 km.",
    },
  },
];
