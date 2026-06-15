/**
 * Fyzika 6. ročník — Měření objemu (jednotky, převody, ekvivalence cm³↔ml).
 *
 * Stejný převodový vzor jako délka/hmotnost, navíc KLÍČOVÁ ekvivalence
 * 1 cm³ = 1 ml a 1 dm³ = 1 l (prerekvizita pro Hustotu — žák tam míchá g/cm³
 * a kg/dm³). Chybový model cílí na běžnou mylnou představu „1 cm³ = 1000 ml".
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
    { big: "l", small: "ml", factor: 1000 },
    { big: "dm³", small: "cm³", factor: 1000 },
    { big: "l", small: "dl", factor: 10 },
    { big: "dl", small: "ml", factor: 100 },
    { big: "l", small: "cl", factor: 100 },
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

// L2 — menší → větší (dělení) NEBO ekvivalence cm³↔ml / dm³↔l (faktor 1).
function genL2(): PracticeTask {
  if (Math.random() < 0.5) {
    const conv = pick([
      { big: "l", small: "ml", factor: 1000 },
      { big: "dm³", small: "cm³", factor: 1000 },
      { big: "l", small: "dl", factor: 10 },
      { big: "dl", small: "ml", factor: 100 },
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
  // ekvivalence cm³ = ml NEBO dm³ = l (faktor 1, žádný posun)
  const eq = pick([
    { from: "cm³", to: "ml" },
    { from: "ml", to: "cm³" },
    { from: "dm³", to: "l" },
    { from: "l", to: "dm³" },
  ]);
  const v = Math.floor(Math.random() * 80) + 20; // 20–99
  return task(
    `Odměrným válcem jsi naměřil ${cz(v)} ${eq.from}. Kolik je to ${eq.to}?`,
    `${cz(v)} ${eq.to}`,
    [
      {
        value: `${cz(v * 1000)} ${eq.to}`,
        why: `Myslel sis, že je tam převod ×1000. Ale ${eq.from} a ${eq.to} jsou stejně velké: 1 ${eq.from} = 1 ${eq.to}.`,
      },
      {
        value: `${cz(v / 1000)} ${eq.to}`,
        why: `Dělil jsi zbytečně. ${eq.from} a ${eq.to} jsou stejně velké, hodnota se nemění.`,
      },
      {
        value: `${cz(v * 10)} ${eq.to}`,
        why: `Žádný převod tu není. 1 ${eq.from} = 1 ${eq.to}, číslo zůstává stejné.`,
      },
    ],
    {
      hints: [
        `Krok 1: Tady není žádný násobek ani dělení. Krychlové a objemové jednotky se kryjí.`,
        `Krok 2: Pravidlo: 1 cm³ = 1 ml a 1 dm³ = 1 l (stejně velký objem, jen jiný název).`,
        `Krok 3: Protože jsou jednotky stejně velké, číslo zůstává — jen vyměníš název jednotky.`,
      ],
      solutionSteps: [
        `1 ${eq.from} = 1 ${eq.to}`,
        `${cz(v)} ${eq.from} = ${cz(v)} ${eq.to}`,
      ],
      explanation: `${eq.from} a ${eq.to} označují stejně velký objem (1 cm³ = 1 ml, 1 dm³ = 1 l), proto se číslo nemění: ${cz(v)} ${eq.from} = ${cz(v)} ${eq.to}.`,
    },
  );
}

// L3 — aplikační slovní úloha (výpočet + převod jednotky).
function genL3(): PracticeTask {
  if (Math.random() < 0.5) {
    // balení → l
    const packs = Math.floor(Math.random() * 4) + 2; // 2–5
    const packMl = pick([200, 250, 300, 330, 500]);
    const totalMl = packs * packMl;
    const totalL = totalMl / 1000;
    return task(
      `Krabice obsahuje ${cz(packs)} balení nápoje po ${cz(packMl)} ml. Kolik litrů je to celkem?`,
      `${cz(totalL)} l`,
      [
        {
          value: `${cz(totalMl)} l`,
          why: `Spočítal jsi mililitry správně (${cz(totalMl)} ml), ale otázka je na litry: ${cz(totalMl)} ml = ${cz(totalL)} l.`,
        },
        {
          value: `${cz(packMl / 1000)} l`,
          why: `Převedl jsi jen jedno balení. Nejdřív spočítej celkový objem: ${cz(packs)} × ${cz(packMl)} ml.`,
        },
        {
          value: `${cz(totalMl / 100)} l`,
          why: `Při převodu na litry se dělí 1000 (ne 100). 1 l = 1000 ml.`,
        },
      ],
      {
        hints: [
          `Krok 1: Nejdřív spočítej celkový objem v mililitrech — vynásob počet balení objemem jednoho balení.`,
          `Krok 2: Výsledek máš v ml, ale otázka chce litry. Převeď ho dělením 1000 (z mililitrů na litry).`,
        ],
        solutionSteps: [
          `Celkem: ${cz(packs)} × ${cz(packMl)} = ${cz(totalMl)} ml`,
          `Na litry: ${cz(totalMl)} ÷ 1000 = ${cz(totalL)} l`,
        ],
        explanation: `Nejdřív celkový objem ${cz(packs)} × ${cz(packMl)} = ${cz(totalMl)} ml, pak převod 1 l = 1000 ml → ${cz(totalMl)} ÷ 1000 = ${cz(totalL)} l.`,
      },
    );
  }
  // kolik ml chybí do naplnění
  const targetL = pick([1, 1.5, 2]);
  const targetMl = targetL * 1000;
  const haveMl = pick([300, 450, 600, 750, 800, 250]);
  const restMl = targetMl - haveMl;
  return task(
    `Nádrž pojme ${cz(targetL)} l. Nalil jsi ${cz(haveMl)} ml. Kolik mililitrů ještě chybí?`,
    `${cz(restMl)} ml`,
    [
      {
        value: `${cz(targetMl + haveMl)} ml`,
        why: `Sečetl jsi místo odečetl. Chybějící objem = celá nádrž − už nalité.`,
      },
      {
        value: `${cz(targetL - haveMl / 1000)} ml`,
        why: `Počítal jsi v litrech (${cz(targetL)} − ${cz(haveMl / 1000)} = ${cz(targetL - haveMl / 1000)} l), ale odpověď má být v ml: ${cz(restMl)} ml.`,
      },
      {
        value: `${cz(haveMl)} ml`,
        why: `To je objem, který jsi už nalil, ne kolik chybí. Odečti ho od objemu nádrže.`,
      },
    ],
    {
      hints: [
        `Krok 1: Jednotky musí sedět. Převeď objem nádrže z litrů na mililitry (1 l = 1000 ml).`,
        `Krok 2: Od objemu nádrže v ml odečti objem, který jsi už nalil.`,
      ],
      solutionSteps: [
        `Nádrž: ${cz(targetL)} l = ${cz(targetMl)} ml`,
        `Chybí: ${cz(targetMl)} − ${cz(haveMl)} = ${cz(restMl)} ml`,
      ],
      explanation: `Obě hodnoty musí být v ml: ${cz(targetL)} l = ${cz(targetMl)} ml. Chybí = ${cz(targetMl)} − ${cz(haveMl)} = ${cz(restMl)} ml.`,
    },
  );
}

export const MERENI_OBJEMU: TopicMetadata[] = [
  {
    id: "g6-fyz-mereni-objemu-6",
    rvpNodeId: "g6-fyzika-mereni-fyzikalnich-velicin-delka-objem-hmotnost-objem-jednotky-mereni-odmernym-valcem",
    displayName: "Měření objemu",
    title: "Objem – jednotky, měření odměrným válcem",
    studentTitle: "Měření objemu",
    subject: "fyzika",
    category: "Měření fyzikálních veličin",
    topic: "Délka, objem, hmotnost",
    briefDescription: "Převedeš jednotky objemu a poznáš, že cm³ = ml.",
    keywords: [
      "objem", "jednotky objemu", "převod jednotek", "mililitr", "litr",
      "decilitr", "ml", "l", "dl", "cm³", "dm³", "odměrný válec", "krychlové jednotky",
    ],
    goals: [
      "Převést mezi jednotkami objemu (ml, dl, l) oběma směry.",
      "Použít ekvivalenci 1 cm³ = 1 ml a 1 dm³ = 1 l.",
      "Použít převod objemu ve víckrokové slovní úloze.",
    ],
    boundaries: [
      "Pouze objemové a krychlové jednotky.",
      "Hodnoty jsou hezká čísla, max 1 desetinné místo.",
      "Nezahrnuje výpočet objemu tělesa ze vzorce (jen měření/převod).",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-fyz-hustota-6"],
    generator: gen,
    helpTemplate: {
      hint: "Jednotky objemu: 1 l = 1000 ml, 1 l = 10 dl. Krychlové jednotky se kryjí: 1 cm³ = 1 ml, 1 dm³ = 1 l. Z větší jednotky na menší se násobí, z menší na větší dělí.",
      steps: [
        "Urči směr převodu (násobíš, nebo dělíš).",
        "U krychlových jednotek využij: 1 cm³ = 1 ml, 1 dm³ = 1 l (číslo se nemění).",
        "U slovní úlohy nejdřív dopočítej hodnotu, pak převeď na požadovanou jednotku.",
      ],
      commonMistake: "Mylná představa, že 1 cm³ = 1000 ml. Ve skutečnosti 1 cm³ = právě 1 ml.",
      example: "2,5 l = 2500 ml. A 250 cm³ = 250 ml (jednotky se kryjí).",
    },
  },
];
