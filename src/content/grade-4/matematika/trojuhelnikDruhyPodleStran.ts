import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { ciselnaUloha, rnd, shuffle } from "./_mat";

// Přepsáno 2026-09-11 (audit 4. ročníku). L1 měla jen tři pevné úlohy
// (5-5-5, 6-6-4, 3-5-7), mezi druhy podle stran se míchal „pravoúhlý“
// (to je druh podle úhlů) a L3 měla šest faktů bez výpočtu. Teď:
// L1: druh trojúhelníku podle stran z náhodných délek
// L2: obvod trojúhelníku a strana rovnostranného z obvodu
// L3: lze trojúhelník sestrojit? rameno rovnoramenného z obvodu a základny.

type Druh = "rovnostranný" | "rovnoramenný" | "různostranný";
const DRUHY: Druh[] = ["rovnostranný", "rovnoramenný", "různostranný"];

function strany(druh: Druh): [number, number, number] {
  if (druh === "rovnostranný") { const a = rnd(2, 15); return [a, a, a]; }
  if (druh === "rovnoramenný") {
    const a = rnd(3, 15);
    let c = rnd(2, 2 * a - 1);
    while (c === a) c = rnd(2, 2 * a - 1);
    return [a, a, c];
  }
  for (;;) {
    const s = [rnd(2, 15), rnd(2, 15), rnd(2, 15)].sort((x, y) => x - y) as [number, number, number];
    if (s[0] !== s[1] && s[1] !== s[2] && s[0] + s[1] > s[2]) return s;
  }
}

const cm = (s: number[]) => s.map((x) => `${x} cm`).join(", ");

function druhUloha(): PracticeTask {
  const druh = DRUHY[rnd(0, 2)];
  const s = shuffle(strany(druh));
  const proc: Record<Druh, string> = {
    rovnostranný: "Rovnostranný trojúhelník má všechny tři strany stejně dlouhé.",
    rovnoramenný: "Rovnoramenný trojúhelník má právě dvě strany stejně dlouhé.",
    různostranný: "Různostranný trojúhelník má každou stranu jinak dlouhou.",
  };
  const optionFeedback: Record<string, string> = {};
  for (const d of DRUHY) if (d !== druh) optionFeedback[d] = `${proc[d]} Tady jsou strany ${cm(s)}.`;
  return {
    question: `Trojúhelník má strany ${cm(s)}. Jaký je podle stran?`,
    correctAnswer: druh,
    options: [...DRUHY],
    optionFeedback,
    hints: [
      `Které z délek ${cm(s)} jsou stejné?`,
      `Porovnej strany po dvou: ${s[0]} a ${s[1]}, ${s[1]} a ${s[2]}, ${s[0]} a ${s[2]}. Tři stejné strany, dvě stejné, nebo žádné stejné — každá možnost má svůj název.`,
    ],
    solutionSteps: [
      `Strany: ${cm(s)}.`,
      druh === "rovnostranný" ? "Všechny tři strany jsou stejné." : druh === "rovnoramenný" ? "Dvě strany jsou stejné, třetí je jiná." : "Žádné dvě strany nejsou stejné.",
      `Trojúhelník je ${druh}.`,
    ],
  };
}

function obvodUloha(): PracticeTask {
  const druh = DRUHY[rnd(0, 2)];
  const s = shuffle(strany(druh));
  const O = s[0] + s[1] + s[2];
  return ciselnaUloha(`Trojúhelník má strany ${cm(s)}. Jaký je jeho obvod?`, `${O} cm`, [
    { value: `${s[0] + s[1]} cm`, why: "Sečetly se jen dvě strany. Obvod je součet všech tří." },
    { value: `${s[0] * 3} cm`, why: `Tohle by platilo, jen kdyby byly všechny strany dlouhé ${s[0]} cm.` },
    { value: `${O + 1} cm`, why: "O 1 cm víc — chyba při sčítání." },
    { value: `${O - 1} cm`, why: "O 1 cm méně — chyba při sčítání." },
  ], [
    `Obvod je součet stran ${s.join(", ")}.`,
    `Sečti postupně: ${s[0]} + ${s[1]} = ${s[0] + s[1]} a k tomu přičti ještě třetí stranu ${s[2]}. Výsledek zapiš v centimetrech.`,
  ], [
    `o = ${s[0]} + ${s[1]} + ${s[2]}`,
    `o = ${O} cm`,
  ]);
}

function stranaZObvodu(): PracticeTask {
  let a = rnd(4, 20);
  while (String(3 * a).endsWith(String(a))) a = rnd(4, 20); // „15 cm“ by obsahovalo klíč „5 cm“
  const O = 3 * a;
  return ciselnaUloha(`Rovnostranný trojúhelník má obvod ${O} cm. Jak dlouhá je jeho strana?`, `${a} cm`, [
    { value: `${O / 3 * 2} cm`, why: "To jsou dvě strany dohromady. Obvod se dělí třemi." },
    { value: `${O - 3} cm`, why: "Od obvodu se neodečítá, obvod tvoří tři stejné strany — děl třemi." },
    { value: `${O * 3} cm`, why: "Obvod se nenásobí, ale dělí třemi." },
  ], [
    `Na kolik stejných dílů rozdělíš obvod ${O}?`,
    `Obvod vznikl sečtením tří stejných stran. Rozděl ho proto na tři stejné díly: ${O} ÷ 3.`,
  ], [
    `o = 3 · a`,
    `a = ${O} ÷ 3 = ${a} cm`,
  ]);
}

function lzeSestrojit(): PracticeTask {
  let s: [number, number, number];
  const ok = Math.random() < 0.5;
  for (;;) {
    s = [rnd(1, 12), rnd(1, 12), rnd(1, 15)].sort((x, y) => x - y) as [number, number, number];
    if ((s[0] + s[1] > s[2]) === ok) break;
  }
  const [x, y, z] = s;
  const KLIC_ANO = "ano, dá se sestrojit";
  const KLIC_NE = "ne, dvě kratší dohromady nestačí";
  const key = ok ? KLIC_ANO : KLIC_NE;
  const moznosti = [KLIC_ANO, KLIC_NE, "ne, tyčky musí být stejně dlouhé", "ne, musí tam být pravý úhel"];
  const optionFeedback: Record<string, string> = {};
  for (const m of moznosti) if (m !== key) optionFeedback[m] = m === KLIC_ANO
    ? `Dvě kratší tyčky (${x} + ${y} = ${x + y}) nedosáhnou přes nejdelší (${z}), trojúhelník se neuzavře.`
    : m === KLIC_NE
      ? `${x} + ${y} = ${x + y}, to je víc než ${z} — trojúhelník se uzavře.`
      : "Takové pravidlo neplatí. Rozhoduje jen to, jestli jsou dvě kratší tyčky dohromady delší než ta nejdelší.";
  return {
    question: `Dá se ze tří tyček dlouhých ${x} cm, ${y} cm a ${z} cm složit trojúhelník?`,
    correctAnswer: key,
    options: shuffle(moznosti),
    optionFeedback,
    hints: [
      `Která z tyček ${x}, ${y} a ${z} je nejdelší a kolik měří zbylé dvě dohromady?`,
      `Sečti délky ${x} cm a ${y} cm. Trojúhelník se uzavře jen tehdy, když je tento součet větší než nejdelší tyčka (${z} cm).`,
    ],
    solutionSteps: [
      `Dvě kratší: ${x} + ${y} = ${x + y} cm, nejdelší: ${z} cm.`,
      ok ? `${x + y} > ${z}, trojúhelník se dá sestrojit.` : `${x + y} ≤ ${z}, kratší tyčky se nesetkají — trojúhelník nevznikne.`,
    ],
  };
}

function rameno(): PracticeTask {
  const r = rnd(4, 20);
  let z = rnd(2, 2 * r - 1);
  while (z === r || String(z).endsWith(String(r)) || String(2 * r + z).endsWith(String(r))) z = rnd(2, 2 * r - 1);
  const O = 2 * r + z;
  return ciselnaUloha(`Rovnoramenný trojúhelník má obvod ${O} cm a základnu ${z} cm. Jak dlouhé je jedno rameno?`, `${r} cm`, [
    { value: `${O - z} cm`, why: "To jsou obě ramena dohromady. Ramena jsou dvě, proto je ještě potřeba dělit dvěma." },
    { value: `${Math.round(O / 3)} cm`, why: "Obvod se nedělí třemi — strany nejsou všechny stejné." },
    { value: `${Math.round(O / 2)} cm`, why: "Nejdřív je potřeba od obvodu odečíst základnu." },
    { value: `${r + 1} cm`, why: "O 1 cm víc — chyba při dělení dvěma." },
  ], [
    `Obvod = rameno + rameno + základna. Kolik zbude, když od ${O} odečteš základnu ${z}?`,
    `${O} − ${z} = ${O - z} připadá na obě ramena dohromady. Ramena jsou stejně dlouhá, tak ${O - z} rozděl na dva stejné díly.`,
  ], [
    `Obě ramena: ${O} − ${z} = ${O - z} cm`,
    `Jedno rameno: ${O - z} ÷ 2 = ${r} cm`,
  ]);
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 40; i++) {
    if (level === 1) tasks.push(druhUloha());
    else if (level === 2) tasks.push(i % 3 === 2 ? stranaZObvodu() : obvodUloha());
    else tasks.push(i % 2 ? lzeSestrojit() : rameno());
  }
  return tasks;
}

export const TROJUHELNIK_DRUHY: TopicMetadata[] = [
  {
    id: "g4-mat-trojuhelnik-druhy-stran-4",
    rvpNodeId: "g4-matematika-geometrie-v-rovine-a-v-prostoru-rovinne-utvary-trojuhelnik-druhy-podle-stran",
    displayName: "Druhy trojúhelníků",
    title: "Trojúhelník — druhy podle stran",
    studentTitle: "Druhy trojúhelníků",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Rovinné útvary",
    briefDescription: "Rozlišíš trojúhelníky podle délek jejich stran.",
    keywords: [
      "trojúhelník", "rovnostranný", "rovnoramenný", "různostranný",
      "strany trojúhelníku", "obvod trojúhelníku",
    ],
    goals: [
      "Rozlišit trojúhelníky podle délek stran: rovnostranný, rovnoramenný, různostranný.",
      "Vypočítat obvod trojúhelníku.",
      "Určit počet os souměrnosti každého druhu trojúhelníku.",
    ],
    boundaries: [
      "Pouze třídění podle stran (ne podle úhlů).",
      "Nezahrnuje výpočet obsahu trojúhelníku.",
      "Nezahrnuje Pythagorovu větu.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-mat-osova-soumernost-4", "g4-mat-obvod-obsah-obdelnik-ctverec-4"],
    generator: gen,
    helpTemplate: {
      hint: "Rovnostranný = všechny 3 strany stejně dlouhé. Rovnoramenný = právě 2 strany stejné. Různostranný = všechny strany různé.",
      steps: [
        "Zapiš délky všech tří stran.",
        "Porovnej: jsou všechny 3 stejné? → Rovnostranný.",
        "Jsou právě 2 stejné? → Rovnoramenný.",
        "Jsou všechny různé? → Různostranný.",
      ],
      commonMistake: "Záměna rovnostranného a rovnoramenného — rovnostranný má VŠECHNY 3 strany stejné.",
      example: "Strany 5, 5, 5 cm → rovnostranný. Strany 7, 7, 4 cm → rovnoramenný. Strany 3, 5, 6 cm → různostranný.",
    },
  },
];
