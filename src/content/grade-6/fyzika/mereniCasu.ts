/**
 * Fyzika 6. ročník — Měření času (jednotky h/min/s, převody, časová osa).
 *
 * Jiný charakter než hmotnost/objem: základ je 60 (a 24), NE 10. Chybový model
 * proto cílí především na „desítkový návyk":
 *  • násobení/dělení 100 místo 60,
 *  • ponechání minut nad 60 bez přenosu do hodin,
 *  • sečtení složeného času bez převodu jednotek.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, buildChoiceTask as task } from "./_shared";

const ri = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
/** Čas ve formátu H:MM (minuty vždy na dvě číslice). */
const hhmm = (h: number, m: number) => `${h}:${String(m).padStart(2, "0")}`;

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 24; i++) {
    tasks.push(level === 1 ? genL1() : level === 2 ? genL2() : genL3());
  }
  return tasks;
}

// L1 — převod větší → menší jednotka jedním krokem (× 60). Důraz: základ 60, ne 100.
function genL1(): PracticeTask {
  const conv = pick([
    { big: "h", small: "min" },
    { big: "min", small: "s" },
  ]);
  const v = ri(2, 9);
  const correct = v * 60;
  return task(
    `Převeď ${v} ${conv.big} na ${conv.small}.`,
    `${correct} ${conv.small}`,
    [
      {
        value: `${v * 100} ${conv.small}`,
        why: `1 ${conv.big} nemá 100 ${conv.small}, ale 60. Čas se nepočítá po stovkách — násob 60.`,
      },
      {
        value: `${v} ${conv.small}`,
        why: `Vyměnil jsi jen jednotku, číslo musíš převést: 1 ${conv.big} = 60 ${conv.small}.`,
      },
      {
        value: `${v * 6} ${conv.small}`,
        why: `Pozor na nulu: 1 ${conv.big} = 60 ${conv.small}, ne 6. Vynásob 60.`,
      },
    ],
    {
      hints: [
        `Krok 1: Jdeš z větší jednotky (${conv.big}) na menší (${conv.small}) — budeš násobit.`,
        `Krok 2: Pozor, čas nemá základ 10 ani 100. Platí 1 ${conv.big} = 60 ${conv.small}.`,
      ],
      solutionSteps: [
        `1 ${conv.big} = 60 ${conv.small}`,
        `${v} ${conv.big} = ${v} × 60 = ${correct} ${conv.small}`,
      ],
      explanation: `Čas se nepočítá po desítkách: 1 ${conv.big} = 60 ${conv.small}, proto ${v} × 60 = ${correct} ${conv.small}.`,
    },
  );
}

// L2 — opačný směr se zbytkem (min → h a min) NEBO složený čas na minuty (h a min → min).
function genL2(): PracticeTask {
  if (Math.random() < 0.5) {
    // min → h a min (dělení se zbytkem)
    const h0 = ri(2, 3);
    const r = pick([10, 15, 20, 25, 40, 45, 50]);
    const m = h0 * 60 + r;
    return task(
      `Kolik hodin a minut je ${m} min?`,
      `${h0} h ${r} min`,
      [
        {
          value: `${Math.floor(m / 100)} h ${m % 100} min`,
          why: `Dělil jsi 100 místo 60. Hodina má 60 minut, ne 100.`,
        },
        {
          value: `${m} min`,
          why: `Nepřevedl jsi na hodiny. Každých 60 minut je 1 hodina.`,
        },
        {
          value: `${h0} h`,
          why: `Zapomněl jsi zbývajících ${r} min, které se do celých hodin nevešly.`,
        },
      ],
      {
        hints: [
          `Krok 1: Zjisti, kolik celých hodin se vejde — kolikrát se do počtu minut vejde 60.`,
          `Krok 2: Zbytek (minuty, které do celé hodiny nezbyly) připiš za hodiny.`,
        ],
        solutionSteps: [
          `${m} ÷ 60 = ${h0} (celé hodiny), zbytek ${r} min`,
          `${m} min = ${h0} h ${r} min`,
        ],
        explanation: `Každých 60 minut je 1 hodina: ${m} ÷ 60 = ${h0} a zbyde ${r} min, tedy ${h0} h ${r} min.`,
      },
    );
  }
  // h a min → min (převod + součet)
  const h0 = ri(1, 3);
  const r = pick([10, 15, 20, 30, 40, 45]);
  const correct = h0 * 60 + r;
  return task(
    `Závod trval ${h0} h ${r} min. Kolik je to minut?`,
    `${correct} min`,
    [
      {
        value: `${h0 * 100 + r} min`,
        why: `Počítal jsi se 100 minutami v hodině. Hodina má jen 60 minut.`,
      },
      {
        value: `${h0 + r} min`,
        why: `Sečetl jsi čísla bez převodu. Nejdřív převeď ${h0} h na minuty (× 60), pak přičti.`,
      },
      {
        value: `${h0 * 60} min`,
        why: `Převedl jsi jen hodiny a zapomněl přičíst ${r} min.`,
      },
    ],
    {
      hints: [
        `Krok 1: Hodiny převeď na minuty — vynásob počet hodin 60.`,
        `Krok 2: K minutám z hodin přičti zbývajících ${r} min.`,
      ],
      solutionSteps: [
        `${h0} h = ${h0} × 60 = ${h0 * 60} min`,
        `${h0 * 60} + ${r} = ${correct} min`,
      ],
      explanation: `Nejdřív hodiny na minuty: ${h0} × 60 = ${h0 * 60} min, pak + ${r} min = ${correct} min.`,
    },
  );
}

// L3 — aplikace: časová osa (odjezd + doba) NEBO převod hodin na sekundy (přes dva kroky).
function genL3(): PracticeTask {
  if (Math.random() < 0.5) {
    // časová osa s přenosem přes 60
    const startH = ri(8, 19);
    const startM = pick([30, 40, 45]);
    const durH = ri(1, 2);
    const durM = pick([30, 40, 45]);
    const startMin = startH * 60 + startM;
    const durMin = durH * 60 + durM;
    const endMin = startMin + durMin;
    const endH = Math.floor(endMin / 60);
    const endM = endMin % 60;
    const sumM = startM + durM; // ≥ 60 → přetéká do hodin
    return task(
      `Autobus odjíždí v ${hhmm(startH, startM)} a jede ${durH} h ${durM} min. V kolik přijede?`,
      hhmm(endH, endM),
      [
        {
          value: `${startH + durH}:${String(sumM).padStart(2, "0")}`,
          why: `Minut vyšlo přes 60 (${startM} + ${durM} = ${sumM} min). To je 1 h ${sumM - 60} min — tu hodinu musíš přičíst.`,
        },
        {
          value: hhmm(startH + Math.floor(sumM / 60), endM),
          why: `Zapomněl jsi přičíst ${durH} h jízdy. Přičti i celé hodiny doby jízdy.`,
        },
        {
          value: hhmm(Math.floor((startMin - durMin) / 60), (startMin - durMin) % 60),
          why: `Dobu jízdy k odjezdu přičítáš, ne odečítáš.`,
        },
      ],
      {
        hints: [
          `Krok 1: Přičti hodiny k hodinám a minuty k minutám.`,
          `Krok 2: Pokud minut vyjde 60 a víc, převeď je: každých 60 min přidá 1 hodinu.`,
        ],
        solutionSteps: [
          `Minuty: ${startM} + ${durM} = ${sumM} min = 1 h ${sumM - 60} min`,
          `Hodiny: ${startH} + ${durH} + 1 = ${endH}, zbyde ${endM} min → ${hhmm(endH, endM)}`,
        ],
        explanation: `Hodiny i minuty se sčítají zvlášť; ${sumM} min přeteče přes 60 a přidá 1 hodinu: výsledek ${hhmm(endH, endM)}.`,
      },
    );
  }
  // převod hodin na sekundy (h → min → s)
  const h = ri(1, 3);
  const correct = h * 3600;
  return task(
    `Kolik sekund je ${h} h?`,
    `${correct} s`,
    [
      {
        value: `${h * 60} s`,
        why: `To je počet minut, ne sekund. Každou minutu ještě vynásob 60: ${h * 60} × 60.`,
      },
      {
        value: `${h * 6000} s`,
        why: `Počítal jsi se stovkou (100 × 60). Hodina má 60 min, takže 60 × 60 = 3600 s.`,
      },
      {
        value: `${h * 360} s`,
        why: `Ztratila se ti nula: 1 h = 60 × 60 = 3600 s, ne 360 s.`,
      },
    ],
    {
      hints: [
        `Krok 1: Hodinu převeď přes minuty — 1 h = 60 min a 1 min = 60 s.`,
        `Krok 2: V jedné hodině je proto 60 × 60 sekund. Vynásob počtem hodin.`,
      ],
      solutionSteps: [
        `1 h = 60 min = 60 × 60 s`,
        `${h} h = ${h} × 3600 = ${correct} s`,
      ],
      explanation: `Hodina = 60 min a minuta = 60 s, takže 1 h = 3600 s; ${h} × 3600 = ${correct} s.`,
    },
  );
}

export const MERENI_CASU: TopicMetadata[] = [
  {
    id: "g6-fyz-mereni-casu-6",
    rvpNodeId:
      "g6-fyzika-mereni-fyzikalnich-velicin-hustota-teplota-cas-cas-jednotky-mereni-casu",
    displayName: "Měření času",
    title: "Čas – jednotky, převody, časová osa",
    studentTitle: "Měření času",
    subject: "fyzika",
    category: "Měření fyzikálních veličin",
    topic: "Hustota, teplota, čas",
    briefDescription: "Převádíš hodiny, minuty a sekundy se základem 60 a počítáš s časovou osou.",
    keywords: [
      "čas", "jednotky času", "hodina", "minuta", "sekunda", "h", "min", "s",
      "převod času", "časová osa", "60 minut", "základ šedesát",
    ],
    goals: [
      "Převést mezi hodinami, minutami a sekundami (základ 60).",
      "Rozložit počet minut na hodiny a minuty se zbytkem.",
      "Spočítat čas příjezdu z odjezdu a doby jízdy s přenosem přes 60.",
    ],
    boundaries: [
      "Jednotky h, min, s (základ 60); den/hodina jen okrajově.",
      "Časy v rámci jednoho dne, bez přechodu přes půlnoc.",
      "Hezká čísla, minuty po pěti.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-fyz-mereni-teploty-6"],
    generator: gen,
    helpTemplate: {
      hint: "Čas má základ 60, ne 10: 1 h = 60 min, 1 min = 60 s. Z větší jednotky na menší se násobí 60, z menší na větší dělí 60 (se zbytkem). Minuty nad 60 převeď na hodiny.",
      steps: [
        "Urči směr: z větší jednotky na menší násobíš 60, z menší na větší dělíš 60.",
        "Při dělení vznikne zbytek — to jsou minuty (nebo sekundy), které do celé jednotky nezbyly.",
        "U časové osy sčítej hodiny a minuty zvlášť a přetékající minuty (≥ 60) převeď na hodinu.",
      ],
      commonMistake: "Počítání se 100 místo 60, nebo ponechání minut nad 60 bez převodu na hodiny.",
      example: "3 h = 3 × 60 = 180 min. 150 min = 2 h 30 min. 10:45 + 1 h 30 min = 12:15.",
    },
  },
];
