/**
 * Fyzika 6. ročník — Měření hmotnosti (jednotky, převody, aplikace).
 *
 * Stejný vzor jako Měření délky (převody jednotek + chybový model distraktorů
 * + optionFeedback), s jednotkami hmotnosti (mg, g, dkg, kg, t) a kontexty
 * vážení/nákupu. Prerekvizita pro Hustotu (ρ = m/V).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { cz, pick, buildChoiceTask as task } from "./_shared";

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 24; i++) {
    tasks.push(level === 1 ? genL1() : level === 2 ? genL2() : genL3());
  }
  return tasks;
}

// L1 — větší → menší jednotka (násobení jedním krokem).
function genL1(): PracticeTask {
  const conv = pick([
    { big: "kg", small: "g", factor: 1000 },
    { big: "t", small: "kg", factor: 1000 },
    { big: "kg", small: "dkg", factor: 100 },
    { big: "dkg", small: "g", factor: 10 },
    { big: "g", small: "mg", factor: 1000 },
  ]);
  const v = Math.floor(Math.random() * 8) + 2;
  const correctNum = v * conv.factor;
  return task(
    `Převeď ${cz(v)} ${conv.big} na ${conv.small}.`,
    `${cz(correctNum)} ${conv.small}`,
    [
      {
        value: `${cz(v)} ${conv.small}`,
        why: `Jen jsi vyměnil jednotku — číslo musíš převést. 1 ${conv.big} = ${conv.factor} ${conv.small}.`,
      },
      {
        value: `${cz(v * conv.factor * 10)} ${conv.small}`,
        why: `Posunul ses o jeden řád moc. 1 ${conv.big} = ${conv.factor} ${conv.small}, ne ${conv.factor * 10}.`,
      },
      {
        value: `${cz(v / conv.factor)} ${conv.small}`,
        why: `Převáděl jsi špatným směrem. Z větší jednotky na menší se NÁSOBÍ, ne dělí.`,
      },
    ],
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

// L2 — menší → větší (dělení) NEBO složená jednotka (kg + g → g).
function genL2(): PracticeTask {
  if (Math.random() < 0.5) {
    const conv = pick([
      { big: "kg", small: "g", factor: 1000 },
      { big: "t", small: "kg", factor: 1000 },
      { big: "kg", small: "dkg", factor: 100 },
      { big: "g", small: "mg", factor: 1000 },
    ]);
    const bigVal = pick([1.2, 2.5, 3, 4.5, 0.8, 1.5, 6, 2.4]);
    const smallVal = bigVal * conv.factor;
    return task(
      `Převeď ${cz(smallVal)} ${conv.small} na ${conv.big}.`,
      `${cz(bigVal)} ${conv.big}`,
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
  // složená jednotka kg + g → g
  const bigPart = Math.floor(Math.random() * 4) + 1; // 1–4 kg
  const smallPart = (Math.floor(Math.random() * 9) + 1) * 50; // 50–450 g
  const correctNum = bigPart * 1000 + smallPart;
  return task(
    `Pytel váží ${cz(bigPart)} kg a ${cz(smallPart)} g. Kolik je to v jednotce g?`,
    `${cz(correctNum)} g`,
    [
      {
        value: `${cz(bigPart + smallPart)} g`,
        why: `Sečetl jsi obě čísla bez převodu. Nejdřív převeď kg na g, pak přičti.`,
      },
      {
        value: `${cz(bigPart * 1000)} g`,
        why: `Zapomněl jsi přičíst ${cz(smallPart)} g. Převedl jsi jen kilogramy.`,
      },
      {
        value: `${cz(bigPart * 10000 + smallPart)} g`,
        why: `Posunul ses o řád při převodu kg. 1 kg = 1000 g.`,
      },
    ],
    {
      hints: [
        `Krok 1: Obě části musí být ve stejné jednotce. Převeď kilogramy na gramy (1 kg = 1000 g).`,
        `Krok 2: K hmotnosti v gramech přičti zbývajících ${cz(smallPart)} g.`,
      ],
      solutionSteps: [
        `${cz(bigPart)} kg = ${cz(bigPart * 1000)} g`,
        `${cz(bigPart * 1000)} + ${cz(smallPart)} = ${cz(correctNum)} g`,
      ],
      explanation: `Obě části musí být ve stejné jednotce: ${cz(bigPart)} kg = ${cz(bigPart * 1000)} g, plus ${cz(smallPart)} g = ${cz(correctNum)} g.`,
    },
  );
}

// L3 — aplikační slovní úloha (výpočet + převod jednotky).
function genL3(): PracticeTask {
  if (Math.random() < 0.5) {
    // balení → kg
    const packs = Math.floor(Math.random() * 4) + 2; // 2–5
    const packG = pick([125, 200, 250, 400, 500]);
    const totalG = packs * packG;
    const totalKg = totalG / 1000;
    return task(
      `Krabice obsahuje ${cz(packs)} balení mouky po ${cz(packG)} g. Kolik kilogramů váží celkem?`,
      `${cz(totalKg)} kg`,
      [
        {
          value: `${cz(totalG)} kg`,
          why: `Spočítal jsi gramy správně (${cz(totalG)} g), ale otázka je na kilogramy: ${cz(totalG)} g = ${cz(totalKg)} kg.`,
        },
        {
          value: `${cz(packG / 1000)} kg`,
          why: `Převedl jsi jen jedno balení. Nejdřív spočítej celkovou hmotnost: ${cz(packs)} × ${cz(packG)} g.`,
        },
        {
          value: `${cz(totalG / 100)} kg`,
          why: `Při převodu na kg se dělí 1000 (ne 100). 1 kg = 1000 g.`,
        },
      ],
      {
        hints: [
          `Krok 1: Nejdřív spočítej celkovou hmotnost v gramech — vynásob počet balení hmotností jednoho balení.`,
          `Krok 2: Výsledek máš v gramech, ale otázka chce kilogramy. Převeď ho dělením 1000 (z gramů na kilogramy).`,
        ],
        solutionSteps: [
          `Celkem: ${cz(packs)} × ${cz(packG)} = ${cz(totalG)} g`,
          `Na kg: ${cz(totalG)} ÷ 1000 = ${cz(totalKg)} kg`,
        ],
        explanation: `Nejdřív celková hmotnost ${cz(packs)} × ${cz(packG)} = ${cz(totalG)} g, pak převod 1 kg = 1000 g → ${cz(totalG)} ÷ 1000 = ${cz(totalKg)} kg.`,
      },
    );
  }
  // kolik chybí (recept: kg cíl − g již máš)
  const targetKg = pick([1, 1.5, 2]);
  const targetG = targetKg * 1000;
  const haveG = pick([300, 450, 600, 750, 800, 250]);
  const restG = targetG - haveG;
  return task(
    `Recept potřebuje ${cz(targetKg)} kg mouky. Máš ${cz(haveG)} g. Kolik gramů ti chybí?`,
    `${cz(restG)} g`,
    [
      {
        value: `${cz(targetG + haveG)} g`,
        why: `Sečetl jsi místo odečetl. Chybějící množství = potřeba − to, co máš.`,
      },
      {
        value: `${cz(targetKg - haveG / 1000)} g`,
        why: `Počítal jsi v kilogramech (${cz(targetKg)} − ${cz(haveG / 1000)} = ${cz(targetKg - haveG / 1000)} kg), ale odpověď má být v gramech: ${cz(restG)} g.`,
      },
      {
        value: `${cz(haveG)} g`,
        why: `To je množství, které už máš, ne to, co chybí. Odečti ho od potřeby.`,
      },
    ],
    {
      hints: [
        `Krok 1: Jednotky musí sedět. Převeď potřebné množství z kilogramů na gramy (1 kg = 1000 g).`,
        `Krok 2: Od potřeby v gramech odečti množství, které už máš.`,
      ],
      solutionSteps: [
        `Potřeba: ${cz(targetKg)} kg = ${cz(targetG)} g`,
        `Chybí: ${cz(targetG)} − ${cz(haveG)} = ${cz(restG)} g`,
      ],
      explanation: `Obě hodnoty musí být v gramech: ${cz(targetKg)} kg = ${cz(targetG)} g. Chybí = ${cz(targetG)} − ${cz(haveG)} = ${cz(restG)} g.`,
    },
  );
}

export const MERENI_HMOTNOSTI: TopicMetadata[] = [
  {
    id: "g6-fyz-mereni-hmotnosti-6",
    rvpNodeId: "g6-fyzika-mereni-fyzikalnich-velicin-delka-objem-hmotnost-hmotnost-jednotky-vazeni",
    displayName: "Měření hmotnosti",
    title: "Hmotnost – jednotky, vážení",
    studentTitle: "Měření hmotnosti",
    subject: "fyzika",
    category: "Měření fyzikálních veličin",
    topic: "Délka, objem, hmotnost",
    briefDescription: "Převedeš jednotky hmotnosti a použiješ je ve výpočtech.",
    keywords: [
      "hmotnost", "jednotky hmotnosti", "převod jednotek", "miligram", "gram",
      "dekagram", "kilogram", "tuna", "mg", "g", "dkg", "kg", "t", "vážení",
    ],
    goals: [
      "Převést mezi jednotkami hmotnosti (mg, g, dkg, kg, t) oběma směry.",
      "Rozlišit, kdy se při převodu násobí a kdy dělí.",
      "Použít převod hmotnosti ve víckrokové slovní úloze.",
    ],
    boundaries: [
      "Pouze hmotnostní jednotky.",
      "Hodnoty jsou hezká čísla, max 1 desetinné místo.",
      "Nezahrnuje výpočet hustoty (to je samostatné téma).",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-fyz-mereni-objemu-6", "g6-fyz-hustota-6"],
    generator: gen,
    helpTemplate: {
      hint: "Jednotky hmotnosti: 1 g = 1000 mg, 1 dkg = 10 g, 1 kg = 1000 g, 1 t = 1000 kg. Z větší jednotky na menší se násobí, z menší na větší dělí.",
      steps: [
        "Urči směr: z větší jednotky na menší (násobíš), nebo z menší na větší (dělíš).",
        "Připomeň si vztah mezi jednotkami (1 kg = 1000 g, 1 t = 1000 kg).",
        "U slovní úlohy nejdřív dopočítej hodnotu, pak převeď na požadovanou jednotku.",
      ],
      commonMistake: "Špatný směr (násobení místo dělení) nebo posun o jeden řád.",
      example: "2,5 kg = 2,5 × 1000 = 2500 g. Naopak 2500 g = 2500 ÷ 1000 = 2,5 kg.",
    },
  },
];
