import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pevné datasety pro tabulkové úlohy
const TABULKY = [
  {
    nazev: "Počty zvířat v zoo",
    hlavicka: ["Zvíře", "Počet"],
    radky: [["Lev", "4"], ["Slon", "2"], ["Zebra", "7"], ["Opice", "12"]],
    otazky: [
      { q: "Kolik je slonů a lvů dohromady?", a: "6", d: ["6", "8", "5", "14"] },
      { q: "O kolik je opic víc než zebr?", a: "5", d: ["5", "4", "6", "19"] },
      { q: "Které zvíře je v zoo nejvíce?", a: "Opice", d: ["Opice", "Zebra", "Lev", "Slon"] },
    ],
  },
  {
    nazev: "Jízdní řád autobusu",
    hlavicka: ["Zastávka", "Odjezd"],
    radky: [["Náměstí", "8:00"], ["Škola", "8:10"], ["Pošta", "8:20"], ["Nádraží", "8:35"]],
    otazky: [
      { q: "V kolik hodin odjíždí autobus ze Školy?", a: "8:10", d: ["8:10", "8:00", "8:20", "8:35"] },
      { q: "Kolik minut jede autobus ze Školy na Poštu?", a: "10 minut", d: ["10 minut", "20 minut", "5 minut", "15 minut"] },
      { q: "Kolik stanic má jízdní řád?", a: "4", d: ["4", "3", "5", "2"] },
    ],
  },
  {
    nazev: "Prodané zmrzliny",
    hlavicka: ["Den", "Počet zmrzlin"],
    radky: [["Pondělí", "15"], ["Úterý", "8"], ["Středa", "20"], ["Čtvrtek", "12"]],
    otazky: [
      { q: "Který den se prodalo nejvíce zmrzlin?", a: "Středa", d: ["Středa", "Pondělí", "Čtvrtek", "Úterý"] },
      { q: "Kolik zmrzlin se prodalo v pondělí a úterý?", a: "23", d: ["23", "20", "25", "18"] },
      { q: "O kolik více se prodalo ve středu než v úterý?", a: "12", d: ["12", "8", "10", "28"] },
    ],
  },
];

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const tabulky = level <= 2 ? TABULKY.slice(0, 2) : TABULKY;

  for (let i = 0; i < 40; i++) {
    const tab = tabulky[i % tabulky.length];
    const otazka = tab.otazky[i % tab.otazky.length];
    const context = `Tabulka: ${tab.nazev}\n` +
      tab.hlavicka.join(" | ") + "\n" +
      tab.radky.map(r => r.join(" | ")).join("\n");

    tasks.push({
      question: `${context}\n\n${otazka.q}`,
      correctAnswer: otazka.a,
      options: shuffle([...otazka.d]),
      hints: ["Přečti si tabulku řádek po řádku.", "Hledej konkrétní hodnotu nebo proveď jednoduchý výpočet."],
      solutionSteps: [`Otázka: ${otazka.q}`, `Správná odpověď: ${otazka.a}`],
    });
  }
  return tasks;
}

export const TABULKYJIZDNIRADYDIAGRAMY: TopicMetadata[] = [
  {
    id: "g3-mat-tabulky-diagramy",
    rvpNodeId: "g3-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-tabulky-jizdni-rady-jednoduche-diagramy",
    title: "Tabulky, jízdní řády, jednoduché diagramy",
    studentTitle: "Čtení tabulek",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Přečteš data z tabulky nebo jízdního řádu a odpovíš na otázky.",
    keywords: ["tabulka", "jízdní řád", "diagram", "data", "čtení tabulek", "sloupcový graf"],
    goals: [
      "Číst data z jednoduché tabulky.",
      "Orientovat se v jízdním řádu.",
      "Porovnat hodnoty a provést jednoduchý výpočet z tabulky.",
    ],
    boundaries: ["Jednoduché tabulky, max 5 řádků.", "Bez složitých grafů."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Tabulka má řádky (vodorovně) a sloupce (svisle). Najdi správný řádek, pak správný sloupec.",
      steps: [
        "Přečti si nadpisy sloupců.",
        "Najdi řádek, který hledáš.",
        "Odečti hodnotu ze správného sloupce.",
        "Pro výpočty: sečti nebo odečti potřebné hodnoty.",
      ],
      commonMistake: "Záměna řádku a sloupce — vždy začni od nadpisu.",
      example: "V tabulce prodejů najdi středu a přečti číslo v sloupci 'Počet'.",
    },
  },
];
