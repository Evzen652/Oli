import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

/**
 * Sčítání a odčítání desetinných čísel — 6. ročník ZŠ
 * RVP M-6-1
 *
 * Navazuje na decimalRead-5 (čtení desetinných ze 5. ročníku).
 * Input: number (napíšeš odpověď s čárkou).
 *
 * KLÍČOVÉ PRAVIDLO: zarovnáš desetinné čárky pod sebe, pak sčítáš/odčítáš
 * jako u celých čísel.
 */

function fmtDec(n: number, places: number): string {
  return n.toFixed(places).replace(".", ",");
}

function genDecimalOps(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  for (let i = 0; i < 60; i++) {
    const isAdd = Math.random() > 0.5;
    let places: number;
    let a: number;
    let b: number;

    if (level === 1) {
      // 1 desetinné místo, jednoduchá čísla
      places = 1;
      a = Math.round((Math.random() * 20 + 1) * 10) / 10;
      b = Math.round((Math.random() * 10 + 0.1) * 10) / 10;
    } else if (level === 2) {
      // 2 desetinná místa
      places = 2;
      a = Math.round((Math.random() * 50 + 1) * 100) / 100;
      b = Math.round((Math.random() * 30 + 0.5) * 100) / 100;
    } else {
      // Smíšené: 1 a 2 desetinná místa
      places = Math.random() > 0.5 ? 1 : 2;
      a = Math.round((Math.random() * 100 + 1) * 100) / 100;
      b = Math.round((Math.random() * 50 + 0.1) * 10) / 10;
    }

    // Zajisti, že u odčítání není záporný výsledek
    if (!isAdd && a < b) [a, b] = [b, a];

    const op = isAdd ? "+" : "−";
    const result = isAdd ? a + b : a - b;
    // Ulož jako řetězec se stabilním počtem míst (max z obou vstupů, ale min 1)
    const maxPlaces = Math.max(
      (String(a).split(".")[1] || "").length,
      (String(b).split(".")[1] || "").length,
      1,
    );
    const resultStr = fmtDec(Math.round(result * Math.pow(10, maxPlaces)) / Math.pow(10, maxPlaces), maxPlaces);

    // Distraktory
    const distractors = new Set<string>();
    distractors.add(fmtDec(result + 0.1, maxPlaces));
    distractors.add(fmtDec(Math.max(0, result - 0.1), maxPlaces));
    distractors.add(fmtDec(isAdd ? a - b : a + b, maxPlaces)); // opačná operace
    distractors.add(fmtDec(result + 1, maxPlaces));
    distractors.delete(resultStr);

    const filtered = [...distractors].slice(0, 3);
    while (filtered.length < 3) filtered.push(fmtDec(result + filtered.length + 2, maxPlaces));
    const options = [resultStr, ...filtered].sort(() => Math.random() - 0.5);

    tasks.push({
      question: `${fmtDec(a, maxPlaces)} ${op} ${fmtDec(b, maxPlaces)} =`,
      correctAnswer: resultStr,
      options,
      solutionSteps: [
        `Zarovnej desetinné čárky pod sebe.`,
        `Doplň nuly vpravo, aby obě čísla měla stejný počet desetinných míst.`,
        isAdd
          ? `Sčítej jako celá čísla, začni od posledního řádu.`
          : `Odečítej jako celá čísla, případně si „půjč“ z vyššího řádu.`,
        `Do výsledku napiš čárku na STEJNÉ místo jako ve vstupech.`,
        `Výsledek: ${resultStr}.`,
      ],
      hints: [
        `Zarovnej desetinné čárky. Doplň nuly vpravo, aby obě čísla byla „stejně dlouhá“.`,
        `Pak je to obyčejné sčítání/odčítání. Nezapomeň napsat čárku do výsledku.`,
      ],
    });
  }
  return tasks;
}

const HELP_DECIMAL_OPS: HelpData = {
  hint:
    "Sčítání a odčítání desetinných čísel — zarovnej čárky POD SEBE a počítej jako u celých čísel. Pak napiš čárku do výsledku na stejné místo.",
  steps: [
    "Napiš čísla pod sebe TAK, aby desetinné čárky byly pod sebou.",
    "Doplň nuly vpravo, aby obě čísla měla stejný počet desetinných míst.",
    "Sčítej (nebo odčítej) jako u celých čísel — od posledního řádu.",
    "Do výsledku napiš desetinnou čárku na STEJNÉM místě jako ve vstupech.",
  ],
  commonMistake:
    "NEZAPOMEŇ na čárku! Když 2,3 + 4,5 = 6,8 — čárka je v jedné pozici. NE 68, ani 6.8 bez čárky (používáme čárku v češtině).",
  example:
    "  2,50  ← doplnil jsem nulu\n+ 0,75\n─────\n  3,25\n\n  4,7   ← doplnil jsem nulu\n− 1,25\n─────\n  4,70\n − 1,25\n ─────\n  3,45",
  visualExamples: [
    {
      label: "Zarovnání čárek",
      illustration:
        "SPRÁVNĚ:           ŠPATNĚ:\n  2 , 5 0             2 , 5\n+ 0 , 7 5           + 0 , 7 5\n  ─────             ─────\n  3 , 2 5             ? ? ?\n\nČárky pod sebou!\nDoplň nulu, aby byly\nstejně dlouhé.",
      conclusion: "Bez zarovnání čárek vyjde nesmysl.",
    },
    {
      label: "Odčítání s výpůjčkou",
      illustration:
        "  5 , 0 0 \n− 2 , 7 5  \n─────────\n  2 , 2 5\n\nPůjčím z celé části:\n  5 = 4 + 1 = 4 + 10 desetin\n  5,00 = 4,9 + 0,10\n  ⇒ snadno 4,9−2,7 = 2,2 a 0,10−0,05 = 0,05\n  Dohromady: 2,25",
      conclusion: "Výpůjčka funguje stejně jako u celých čísel, jen v řádu desetin.",
    },
    {
      label: "Peníze jako příklad",
      illustration:
        "Máš 125,50 Kč. Koupíš za 38,20 Kč.\nKolik ti zbyde?\n\n   1 2 5 , 5 0\n −   3 8 , 2 0\n ─────────────\n    8 7 , 3 0\n\nZbyde ti 87,30 Kč.",
      conclusion: "Peníze v Kč s haléři = desetinná čísla v praxi.",
    },
  ],
};

export const DECIMAL_OPS_TOPICS: TopicMetadata[] = [
  {
    id: "math-decimal-ops-6",
    title: "Desetinná čísla: sčítání a odčítání",
    subject: "matematika",
    category: "Čísla a operace",
    topic: "Desetinná čísla",
    topicDescription: "Sčítání a odčítání desetinných čísel s přechodem přes čárku.",
    briefDescription:
      "Naučíš se sčítat a odčítat desetinná čísla. Klíč: zarovnat čárky pod sebe a doplnit nuly.",
    keywords: [
      "sčítání desetinných",
      "odčítání desetinných",
      "desetinná čárka",
      "desetinná čísla sčítání",
    ],
    goals: [
      "Sečteš dvě desetinná čísla písemně.",
      "Odečteš desetinné číslo od většího.",
      "Zarovnáš desetinné čárky pod sebe.",
      "Doplníš nuly vpravo pro stejnou délku.",
    ],
    boundaries: [
      "Pouze nezáporná desetinná čísla.",
      "Maximálně 3 desetinná místa.",
      "Žádné násobení/dělení (to je další dovednost).",
    ],
    gradeRange: [6, 7],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "number",
    generator: genDecimalOps,
    helpTemplate: HELP_DECIMAL_OPS,
    contentType: "algorithmic",
    prerequisites: ["math-decimal-read-5", "math-add-sub-10k-4"],
    rvpReference: "M-6-1-02",
  },
];
