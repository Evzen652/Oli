import type { TopicMetadata, PracticeTask } from "@/lib/types";

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  // level 1: čísla do 99 999 — porovnání (<, >, =)
  // level 2: čísla do 999 999 — určení hodnoty číslice v daném řádu
  // level 3: mix — slovní zápis ↔ číselný zápis + porovnání

  for (let i = 0; i < 40; i++) {
    const type = level === 1 ? "compare" : level === 2 ? "place_value" : (Math.random() < 0.5 ? "compare" : "word_to_number");

    if (type === "compare") {
      const max = level === 1 ? 99999 : 999999;
      const a = Math.floor(Math.random() * max) + 1;
      const b = Math.floor(Math.random() * max) + 1;
      const correct = a > b ? ">" : a < b ? "<" : "=";
      tasks.push({
        question: `Porovnej čísla: ${fmt(a)} vs ${fmt(b)}`,
        correctAnswer: correct,
        options: [">", "<", "="],
        hints: [
          `Porovnávej od nejvyššího řádu zleva.`,
          `Číslo s více číslicemi je větší, pokud jsou všechna čísla ve stejném řádu.`,
        ],
        solutionSteps: [
          `${fmt(a)} vs ${fmt(b)}`,
          a !== b
            ? `${a > b ? fmt(a) + " je větší" : fmt(b) + " je větší"} → ${correct}`
            : `Čísla jsou stejná → =`,
        ],
      });
    } else if (type === "place_value") {
      const n = Math.floor(Math.random() * 900000) + 100000; // 100 000–999 999
      const digits = String(n).split("").map(Number);
      const places = ["stotisíců", "desetitisíců", "tisíců", "stovek", "desítek", "jednotek"];
      const idx = Math.floor(Math.random() * 6);
      const correct = String(digits[idx]);
      const d1 = String(digits[(idx + 1) % 6]);
      const d2 = String(digits[(idx + 2) % 6]);
      const d3 = String((digits[idx] + 1) % 10);
      tasks.push({
        question: `Číslo ${fmt(n)}. Jaká číslice je na místě ${places[idx]}?`,
        correctAnswer: correct,
        options: shuffle([correct, d1, d2, d3].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4)),
        hints: [
          `Zapiš číslo a spočítej pozice zprava: jednotky, desítky, stovky, tisíce, desetitisíce, stotisíce.`,
        ],
        solutionSteps: [
          `${fmt(n)} → číslice na místě ${places[idx]} = ${correct}.`,
        ],
      });
    } else {
      // word_to_number
      const n = Math.floor(Math.random() * 900000) + 100000;
      const word = numberToWords(n);
      const correct = fmt(n);
      const d1 = fmt(n + 1000);
      const d2 = fmt(n - 1000);
      const d3 = fmt(n + 10000);
      tasks.push({
        question: `Zapiš číslicemi: „${word}"`,
        correctAnswer: correct,
        options: shuffle([correct, d1, d2, d3]),
        hints: [`Rozepiš postupně: kolik stotisíců, desetitisíců, tisíců, stovek, desítek, jednotek.`],
        solutionSteps: [`„${word}" = ${correct}.`],
      });
    }
  }

  return tasks;
}

function numberToWords(n: number): string {
  const ones = ["", "jedna", "dvě", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět"];
  const teens = ["deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct"];
  const tens = ["", "deset", "dvacet", "třicet", "čtyřicet", "padesát", "šedesát", "sedmdesát", "osmdesát", "devadesát"];

  if (n >= 1000000) return String(n);

  const parts: string[] = [];
  const stt = Math.floor(n / 100000);
  const dtt = Math.floor((n % 100000) / 10000);
  const tt = Math.floor((n % 10000) / 1000);
  const s = Math.floor((n % 1000) / 100);
  const d = Math.floor((n % 100) / 10);
  const j = n % 10;

  if (stt > 0) parts.push(`${ones[stt] || ""}${stt === 1 ? "sto" : stt < 5 ? "sta" : "set"}tisíc`);
  if (dtt > 0) parts.push(`${ones[dtt]}desettisíc`);
  if (tt > 0) parts.push(`${tt === 1 ? "" : ones[tt]}tisíc`);
  if (s > 0) parts.push(`${s === 1 ? "sto" : s < 5 ? ones[s] + "sta" : ones[s] + "set"}`);
  if (d === 1) {
    parts.push(teens[j]);
  } else {
    if (d > 0) parts.push(tens[d]);
    if (j > 0) parts.push(ones[j]);
  }

  return parts.join(" ") || String(n);
}

function fmt(n: number): string {
  return n.toLocaleString("cs-CZ").replace(/ /g, " ");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const CTENI_ZAPIS_POROVNAVANI: TopicMetadata[] = [
  {
    id: "g4-mat-cisla-do-milionu-4",
    rvpNodeId: "g4-matematika-cislo-a-pocetni-operace-ciselny-obor-0-1-000-000-cteni-zapis-a-porovnavani-cisel-do-milionu",
    displayName: "Čísla do milionu",
    title: "Čtení, zápis a porovnávání čísel do milionu",
    studentTitle: "Velká čísla",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–1 000 000",
    briefDescription: "Naučíš se číst a porovnávat čísla až do milionu.",
    keywords: [
      "čísla do milionu", "porovnávání čísel", "číselný zápis",
      "řády čísel", "stotisíce", "desetitisíce", "tisíce",
    ],
    goals: [
      "Přečíst a zapsat číslo do 1 000 000.",
      "Určit hodnotu číslice na daném místě (řádu).",
      "Porovnat dvě čísla pomocí <, >, =.",
    ],
    boundaries: [
      "Pouze přirozená čísla (celá, nezáporná).",
      "Nezahrnuje záporná čísla ani desetinná čísla.",
      "Rozsah: 0 až 1 000 000.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-mat-zaokrouhlovani-4", "g4-mat-pisemne-scitani-odcitani-4"],
    generator: gen,
    helpTemplate: {
      hint: "Porovnávej čísla od nejvyššího řádu zleva. Číslo s větší číslicí na prvním odlišném místě je větší.",
      steps: [
        "Zapiš obě čísla pod sebe (zarovnej řády).",
        "Porovnej od nejvyšší číslice vlevo.",
        "Najdi první místo, kde se číslice liší — větší číslice = větší číslo.",
        "Pokud jsou všechny číslice stejné → čísla jsou rovná.",
      ],
      commonMistake: "Porovnávání délky číslic bez ohledu na hodnotu — 9 999 vs 10 000: kratší (4 cifry) vs delší (5 číslic).",
      example: "456 789 > 456 700 (liší se na místě desítek: 8 > 0).",
    },
  },
];
