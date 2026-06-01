import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1 – jednodušší sekvence (4 události)
const POOL_L1: PracticeTask[] = [
  {
    question: "Seřaď chronologicky: začátek 1. světové války, atentát v Sarajevu, vznik Československa, konec války.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (28. 6. 1914)",
      "Začátek 1. světové války (srpen 1914)",
      "Konec 1. světové války (11. 11. 1918)",
      "Vznik Československa (28. 10. 1918)",
    ],
    hints: ["Atentát byl zápalníkem, vznik ČSR nastal těsně před koncem války."],
  },
  {
    question: "Seřaď chronologicky: vznik ČSR, TGM prvním prezidentem, atentát v Sarajevu, vstup USA do války.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Vstup USA do války (1917)",
      "Vznik ČSR (28. 10. 1918)",
      "TGM zvolen prvním prezidentem (1918)",
    ],
    hints: ["USA vstoupily do války roku 1917."],
  },
  {
    question: "Seřaď od nejdřívějšího: ruská revoluce, konec války, začátek války, vznik ČSR.",
    correctAnswer: "order",
    items: [
      "Začátek 1. světové války (1914)",
      "Ruská revoluce (1917)",
      "Vznik ČSR (28. 10. 1918)",
      "Konec války (11. 11. 1918)",
    ],
    hints: ["Ruská revoluce proběhla v roce 1917."],
  },
  {
    question: "Seřaď: Masaryk odchází do emigrace, vznik ČSR, atentát v Sarajevu, začátek 1. světové války.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (28. 6. 1914)",
      "Začátek války (srpen 1914)",
      "Masaryk odchází do emigrace (1915)",
      "Vznik ČSR (1918)",
    ],
    hints: ["Masaryk odešel do emigrace až po začátku války."],
  },
  {
    question: "Seřaď chronologicky: vznik Trojspolku, atentát na Františka Ferdinanda, vstup USA, vznik ČSR.",
    correctAnswer: "order",
    items: [
      "Vznik Trojspolku (1882)",
      "Atentát na Františka Ferdinanda (1914)",
      "Vstup USA do války (1917)",
      "Vznik Československa (1918)",
    ],
    hints: ["Trojspolek existoval dlouho před válkou."],
  },
  {
    question: "Seřaď: kapitulácia Trojspolku, vznik ČSR, bitva na Marně, atentát v Sarajevu.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Bitva na Marně (1914)",
      "Vznik ČSR (28. 10. 1918)",
      "Kapitulace Trojspolku (11. 11. 1918)",
    ],
    hints: ["Atentát byl první událostí."],
  },
  {
    question: "Seřaď chronologicky čtyři klíčové roky 1. světové války a vzniku ČSR.",
    correctAnswer: "order",
    items: [
      "Sarajevo — začátek války (1914)",
      "Rusko vystupuje z války (1917)",
      "Vznik Československa (1918)",
      "Versailleská mírová smlouva (1919)",
    ],
    hints: ["Versailleská smlouva byla až v roce 1919."],
  },
  {
    question: "Seřaď: legionáři bojují v Rusku, atentát v Sarajevu, vznik ČSR, TGM v USA.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Legionáři bojují v Rusku (1916–1917)",
      "TGM jedná v USA (1918)",
      "Vznik ČSR (28. 10. 1918)",
    ],
    hints: ["Legionáři bojovali v průběhu války."],
  },
  {
    question: "Seřaď od nejdřívějšího: konec Habsburků, vznik ČSR, atentát na Ferdinanda, Pražský defenzivní pakt.",
    correctAnswer: "order",
    items: [
      "Atentát na Františka Ferdinanda (28. 6. 1914)",
      "Vstup Itálie na stranu Dohody (1915)",
      "Vznik ČSR (28. 10. 1918)",
      "Rozpad Habsburské monarchie (1918)",
    ],
    hints: ["Atentát byl absolutně první."],
  },
  {
    question: "Seřaď: Masaryk dostává Washingtonskou deklaraci, začátek války, vstup USA, atentát.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Začátek války (srpen 1914)",
      "Vstup USA (1917)",
      "Washingtonská deklarace (18. 10. 1918)",
    ],
    hints: ["Washingtonská deklarace předcházela vzniku ČSR o 10 dní."],
  },
];

// Level 2 – středně těžké sekvence (5 událostí)
const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď chronologicky 5 klíčových událostí 1. světové války a vzniku ČSR.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (28. 6. 1914)",
      "Začátek 1. světové války (srpen 1914)",
      "Ruská revoluce (1917)",
      "Vstup USA do války (1917)",
      "Vznik Československa (28. 10. 1918)",
    ],
    hints: ["Atentát byl první, vznik ČSR poslední."],
  },
  {
    question: "Seřaď chronologicky: legionáři na frontách, Masaryk v exilu, vznik ČSR, Versailles, atentát.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Masaryk v exilu — diplomatická práce (1915–1918)",
      "Legionáři bojují ve Francii a Rusku (1916–1918)",
      "Vznik ČSR (28. 10. 1918)",
      "Versailleská mírová smlouva (1919)",
    ],
    hints: ["Versailleská smlouva formálně ukončila válku — až v 1919."],
  },
  {
    question: "Seřaď: Japonsko vstupuje, Ruská revoluce, atentát, USA vstupuje, vznik ČSR.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Japonsko vstupuje do války na stranu Dohody (1914)",
      "Ruská revoluce (1917)",
      "USA vstupuje do války (1917)",
      "Vznik Čínovlovenska (1918)",
    ],
    hints: ["Atentát byl absolutně první."],
  },
  {
    question: "Seřaď 5 klíčových okamžiků Masarykovy cesty k vzniku ČSR.",
    correctAnswer: "order",
    items: [
      "Masaryk přednáší v Londýně (1915)",
      "Masaryk jedná s francouzskou vládou (1916)",
      "Čs. Národní rada uznána Dohodou (1918)",
      "Washingtonská deklarace (18. 10. 1918)",
      "Vznik Čínovlovenska (28. 10. 1918)",
    ],
    hints: ["Masaryk pracoval postupně od Londýna ke Washingtonu."],
  },
  {
    question: "Seřaď chronologicky: vytvoření Československa, konec války, vstup USA, Ruská revoluce, atentát.",
    correctAnswer: "order",
    items: [
      "Atentát na Františka Ferdinanda (28. 6. 1914)",
      "Ruská revoluce (únor/říjen 1917)",
      "USA vstupuje do války (6. 4. 1917)",
      "Vznik Čs (28. 10. 1918)",
      "Konec 1. světové války (11. 11. 1918)",
    ],
    hints: ["Vznik ČSR byl ještě před koncem války."],
  },
  {
    question: "Seřaď: bitva u Verdunu, atentát, vstup USA, vznik ČSR, Versailles.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Bitva u Verdunu (1916)",
      "USA vstupuje (1917)",
      "Vznik ČSR (1918)",
      "Versailleská smlouva (1919)",
    ],
    hints: ["Bitva u Verdunu proběhla v roce 1916."],
  },
  {
    question: "Seřaď chronologicky: Masaryk jedná s Wilsonem, atentát, vznik legií, vstup USA, vznik ČSR.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Vznik Čs. legií (1914–1915)",
      "USA vstupuje (1917)",
      "Masaryk jedná s Wilsonem (1918)",
      "Vznik ČSR (1918)",
    ],
    hints: ["Legie vznikaly záhy po začátku války."],
  },
  {
    question: "Seřaď: konec Habsburků, legionáři u Zborova, atentát v Sarajevu, vznik ČSR, Versailles.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Bitva u Zborova — legionáři (1917)",
      "Konec Habsburků — Karel I. abdikuje (1918)",
      "Vznik ČSR (28. 10. 1918)",
      "Versailleská smlouva (1919)",
    ],
    hints: ["Bitva u Zborova (1917) posílila prestiž legionářů."],
  },
  {
    question: "Seřaď 5 událostí od vypuknutí války po formální uznání ČSR.",
    correctAnswer: "order",
    items: [
      "Vypuknutí 1. světové války (srpen 1914)",
      "Vznik Čs. Národní rady v Paříži (1916)",
      "USA vstupuje do války (1917)",
      "Vznik ČSR (28. 10. 1918)",
      "Versailleská smlouva uznává ČSR (1919)",
    ],
    hints: ["Čs. Národní rada vznikla v roce 1916."],
  },
  {
    question: "Seřaď: Masaryk odchází do exilu, atentát, USA vstupuje, vznik ČSR, TGM prezidentem.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Masaryk odchází do exilu (1915)",
      "USA vstupuje (1917)",
      "Vznik ČSR (28. 10. 1918)",
      "TGM zvolen prezidentem (14. 11. 1918)",
    ],
    hints: ["TGM byl zvolen prezidentem krátce po vzniku ČSR."],
  },
];

// Level 3 – pokročilé sekvence (5–6 událostí)
const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď 6 klíčových událostí 1. světové války a vzniku ČSR od nejdřívějšího.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (28. 6. 1914)",
      "Začátek 1. světové války (srpen 1914)",
      "Ruská revoluce (1917)",
      "USA vstupuje do války (1917)",
      "Vznik Československa (28. 10. 1918)",
      "Versailleská mírová smlouva (1919)",
    ],
    hints: ["Versailleská smlouva byla až v roce 1919."],
  },
  {
    question: "Seřaď 6 milníků — od politické krize po plné uznání ČSR.",
    correctAnswer: "order",
    items: [
      "Atentát na Františka Ferdinanda (1914)",
      "Masaryk odchází do exilu (1915)",
      "Bitva u Zborova — legionáři (1917)",
      "USA vstupuje do války (1917)",
      "Vznik ČSR (28. 10. 1918)",
      "Versailleská smlouva — ČSR uznána mezinárodně (1919)",
    ],
    hints: ["Bitva u Zborova (1917) posílila pozici legionářů."],
  },
  {
    question: "Seřaď: Karel I. abdikuje, Versailles, vznik ČSR, Ruská revoluce, atentát, USA vstupuje.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Ruská revoluce (1917)",
      "USA vstupuje (1917)",
      "Vznik ČSR (28. 10. 1918)",
      "Karel I. abdikuje (11. 11. 1918)",
      "Versailleská mírová smlouva (1919)",
    ],
    hints: ["Karel I. abdikoval ve stejný den jako konec války."],
  },
  {
    question: "Seřaď 6 milníků cesty Čechů a Slováků za vlastním státem.",
    correctAnswer: "order",
    items: [
      "Česká a slovenská emigrace — první kontakty s Dohodou (1914)",
      "Vznik Čs. legií ve Francii (1914)",
      "Vznik Čs. Národní rady v Paříži (1916)",
      "Bitva u Zborova — mezinárodní uznání legionářů (1917)",
      "Washingtonská deklarace (18. 10. 1918)",
      "Vznik Čs (28. 10. 1918)",
    ],
    hints: ["Cesta k ČSR trvala celou válku."],
  },
  {
    question: "Seřaď chronologicky: vznik ČSR, bitva u Zborova, konec války, Versailles, atentát, Rusko vystupuje.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Bitva u Zborova (1917)",
      "Rusko vystupuje z války (1917)",
      "Vznik ČSR (28. 10. 1918)",
      "Konec války (11. 11. 1918)",
      "Versailleská mírová smlouva (1919)",
    ],
    hints: ["Rusko vystoupilo z války v roce 1917."],
  },
  {
    question: "Seřaď 6 klíčových dat: TGM prezidentem, atentát, Masaryk v exilu, vznik ČSR, Versailles, vstup USA.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Masaryk odchází do exilu (1915)",
      "USA vstupuje (1917)",
      "Vznik ČSR (28. 10. 1918)",
      "TGM zvolen prezidentem (14. 11. 1918)",
      "Versailleská smlouva (1919)",
    ],
    hints: ["TGM byl zvolen krátce po vzniku ČSR."],
  },
  {
    question: "Seřaď 5 událostí, které vedly k zániku Rakouska-Uherska a vzniku ČSR.",
    correctAnswer: "order",
    items: [
      "Atentát na Františka Ferdinanda (1914)",
      "Porážky Trojspolku na frontách (1917–1918)",
      "Vznik Čs (28. 10. 1918)",
      "Karel I. abdikuje (11. 11. 1918)",
      "Rozpad Habsburské monarchie (1918)",
    ],
    hints: ["Rozpad Habsburků nastal po vzniku ČSR."],
  },
  {
    question: "Seřaď: Wilsonových 14 bodů, atentát, vznik ČSR, USA vstupuje, Versailles.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "USA vstupuje (1917)",
      "Wilsonových 14 bodů (leden 1918)",
      "Vznik ČSR (28. 10. 1918)",
      "Versailleská smlouva (1919)",
    ],
    hints: ["Wilsonových 14 bodů bylo v lednu 1918."],
  },
  {
    question: "Seřaď 5 klíčových milníků, jimiž prošlo Československo od vzniku k prvním volbám.",
    correctAnswer: "order",
    items: [
      "Vznik ČSR (28. 10. 1918)",
      "TGM zvolen prezidentem (14. 11. 1918)",
      "Versailleská smlouva — mezinárodní uznání (1919)",
      "Přijetí ústavy ČSR (1920)",
      "První parlamentní volby (1920)",
    ],
    hints: ["Ústava a volby přišly v roce 1920."],
  },
  {
    question: "Seřaď: Štefánik zahynul, TGM prezidentem, vznik ČSR, Versailles, atentát.",
    correctAnswer: "order",
    items: [
      "Atentát v Sarajevu (1914)",
      "Vznik ČSR (28. 10. 1918)",
      "TGM zvolen prezidentem (14. 11. 1918)",
      "Štefánik zahynul při letecké nehodě (4. 5. 1919)",
      "Versailleská mírová smlouva (1919)",
    ],
    hints: ["Štefánik zemřel krátce po vzniku ČSR."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const PRVNISVETOVAVALKAAVZNIKCESKOSLOVENSKA1918: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-prvni-svetova-valka-a-vznik-ceskoslovenska-1918",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-prvni-svetova-valka-a-vznik-ceskoslovenska-1918",
    title: "První světová válka a vznik Československa 1918",
    studentTitle: "1. světová válka",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "20. století - od T. G. Masaryka po dnešek",
    briefDescription: "Pochopíš vznik Československa po první světové válce.",
    keywords: ["první světová válka", "masaryk", "československo", "28. října", "legionáři", "beneš"],
    goals: [
      "Žák uvede příčiny a výsledek první světové války",
      "Žák vysvětlí roli Masaryka při vzniku ČSR",
      "Žák zná datum 28. října 1918 a jeho význam",
    ],
    boundaries: ["Vojenská taktika jednotlivých bitev", "Detailní mírové smlouvy"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Klíčové datum: 28. října 1918 — vznik Československa.",
      steps: [
        "1914: atentát v Sarajevu → začátek 1. světové války",
        "Dohoda vs. Trojspolek",
        "Masaryk v emigraci bojuje za ČSR",
        "28. října 1918: vznik Československa",
        "TGM = 1. prezident",
      ],
      commonMistake: "Zaměňování roku začátku (1914) a konce (1918) války.",
      example: "Legionáři bojovali za Dohodu a pomohli přesvědčit mocnosti, aby ČSR uznaly.",
    },
  },
];
