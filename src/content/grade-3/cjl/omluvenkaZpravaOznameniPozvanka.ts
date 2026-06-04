import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[] }[] = [
  { q: "Co musí obsahovat omluvenka?", a: "Koho omlouváme, proč, datum a podpis rodiče", opts: ["Koho omlouváme, proč, datum a podpis rodiče", "Jen datum", "Jen jméno žáka", "Básničku a přání"] },
  { q: "Komu píšeme omluvenku ze školy?", a: "Třídnímu učiteli / třídní učitelce", opts: ["Třídnímu učiteli / třídní učitelce", "Řediteli školy vždy", "Kamarádovi", "Nikому"] },
  { q: "Co je zpráva (SMS/vzkaz)?", a: "Krátké sdělení důležité informace", opts: ["Krátké sdělení důležité informace", "Dlouhý příběh", "Báseň", "Návodný text"] },
  { q: "Co musí obsahovat pozvánka?", a: "Co, kdy, kde a kdo zve", opts: ["Co, kdy, kde a kdo zve", "Jen datum", "Jen adresu", "Jen jméno hostů"] },
  { q: "Co je oznámení?", a: "Sdělení informace většímu počtu lidí (oznámení akce)", opts: ["Sdělení informace většímu počtu lidí (oznámení akce)", "Soukromý dopis", "Pohlednice", "Básnička"] },
  { q: "Omluvenka začíná:", a: "Oslovením: Vážená paní učitelko, / Vážený pane učiteli,", opts: ["Oslovením: Vážená paní učitelko, / Vážený pane učiteli,", "Ahoj,", "Datum a místo", "Podpisem"] },
  { q: "Kde najdeme datum v omluvenence?", a: "Na začátku nebo na konci", opts: ["Na začátku nebo na konci", "Uprostřed textu", "V oslovení", "V podpisu"] },
  { q: "Co napíšeme na konci omluvenky?", a: "S pozdravem + podpis rodiče", opts: ["S pozdravem + podpis rodiče", "S láskou", "Datum znovu", "Promiňte"] },
  { q: "Pozvánka na narozeninovou oslavu musí obsahovat:", a: "Datum, čas, místo a jméno oslavence", opts: ["Datum, čas, místo a jméno oslavence", "Jen datum", "Jen seznam dárků", "Jen místo"] },
  { q: "Jaký je rozdíl mezi zprávou a oznámením?", a: "Zpráva = soukromé (jednomu), oznámení = veřejné (všem)", opts: ["Zpráva = soukromé (jednomu), oznámení = veřejné (všem)", "Žádný rozdíl", "Zpráva je delší", "Oznámení je kratší"] },
  { q: "Proč píšeme omluvenku?", a: "Aby škola věděla, proč žák chyběl", opts: ["Aby škola věděla, proč žák chyběl", "Pro zábavu", "Aby měl žák volno", "Povinně každý týden"] },
  { q: "Vzkaz kamarádovi obsahuje:", a: "Kdo píše, co sděluje, případně kdy a kde", opts: ["Kdo píše, co sděluje, případně kdy a kde", "Jen básničku", "Omluvu vždy", "Velký příběh"] },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Omluvenka: kdo, proč, datum, podpis.", "Pozvánka: co, kdy, kde, kdo zve."],
    solutionSteps: [`Správná odpověď: ${a}`],
  }));
}

export const OMLUVENKAZPRAVA: TopicMetadata[] = [
  {
    id: "g3-cjl-omluvenka-zprava",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-slohova-vychova-omluvenka-zprava-oznameni-pozvanka",
    title: "Omluvenka, zpráva, oznámení, pozvánka",
    studentTitle: "Omluvenka a pozvánka",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se napsat omluvenku, vzkaz, pozvánku nebo oznámení.",
    keywords: ["omluvenka", "zpráva", "vzkaz", "pozvánka", "oznámení", "oslovení", "podpis"],
    goals: ["Napsat omluvenku se všemi náležitostmi.", "Rozlišit zprávu, oznámení a pozvánku.", "Správně oslovit adresáta."],
    boundaries: ["Základní slohové útvary pro 3. ročník."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Omluvenka: Vážená paní učitelko, omlouvám Petra Nováka... datum, podpis rodiče.",
      steps: ["Oslovení (Vážená…).", "Obsah (kdo, proč chyběl).", "Datum.", "Podpis."],
      commonMistake: "Omluvenka bez podpisu rodiče je neplatná.",
      example: "V Praze 1. 3. 2026 / Vážená paní učitelko, / omlouvám svého syna Petra z důvodu nemoci dne 28. 2. / S pozdravem Jana Nováková.",
    },
  },
];
