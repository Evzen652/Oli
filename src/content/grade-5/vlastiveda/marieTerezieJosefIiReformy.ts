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
    question: "Seřaď chronologicky: Josef II. nastupuje, Marie Terezie nastupuje, zrušení nevolnictví, povinná školní docházka.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje na trůn (1740)",
      "Povinná školní docházka (Marie Terezie, 1774)",
      "Josef II. nastupuje na trůn (1780)",
      "Zrušení nevolnictví (Josef II., 1781)",
    ],
    hints: ["Marie Terezie nastoupila v roce 1740."],
  },
  {
    question: "Seřaď od nejdřívějšího: Toleranční patent, zrušení nevolnictví, školní docházka, Marie Terezie nastupuje.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje na trůn (1740)",
      "Povinná školní docházka (1774)",
      "Zrušení nevolnictví (1781)",
      "Toleranční patent (1781)",
    ],
    hints: ["Marie Terezie nastoupila jako první."],
  },
  {
    question: "Seřaď: Josef II. umírá, povinná školní docházka, Marie Terezie nastupuje, slezské války.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje na trůn (1740)",
      "Slezské války — ztráta Slezska (1740–1748)",
      "Povinná školní docházka (1774)",
      "Josef II. umírá (1790)",
    ],
    hints: ["Slezské války proběhly hned po nástupu Marie Terezie."],
  },
  {
    question: "Seřaď čtyři klíčové reformy osvícenských panovníků.",
    correctAnswer: "order",
    items: [
      "Reforma správy (Marie Terezie, 1749)",
      "Povinná školní docházka (Marie Terezie, 1774)",
      "Zrušení nevolnictví (Josef II., 1781)",
      "Toleranční patent (Josef II., 1781)",
    ],
    hints: ["Reforma správy přišla v roce 1749."],
  },
  {
    question: "Seřaď: Josef II. nastupuje, Marie Terezie umírá, školní docházka, Toleranční patent.",
    correctAnswer: "order",
    items: [
      "Povinná školní docházka (1774)",
      "Marie Terezie umírá (1780)",
      "Josef II. nastupuje (1780)",
      "Toleranční patent (1781)",
    ],
    hints: ["Marie Terezie umřela v roce 1780."],
  },
  {
    question: "Seřaď: slezské války, školní docházka, Josef II. nastupuje, Marie Terezie nastupuje.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje (1740)",
      "Slezské války (1740–1748)",
      "Povinná školní docházka (1774)",
      "Josef II. nastupuje (1780)",
    ],
    hints: ["Slezské války se odehrály brzy po nástupu Marie Terezie."],
  },
  {
    question: "Seřaď čtyři klíčové momenty vládnutí Josefa II.",
    correctAnswer: "order",
    items: [
      "Josef II. nastupuje na trůn po matce (1780)",
      "Toleranční patent — náboženská svoboda (1781)",
      "Zrušení nevolnictví (1781)",
      "Josef II. ruší kontemplativní kláštery (1782–1789)",
    ],
    hints: ["Josef II. nastoupil v roce 1780."],
  },
  {
    question: "Seřaď: Toleranční patent, Marie Terezie nastupuje, Josef II. umírá, školní docházka.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje (1740)",
      "Povinná školní docházka (1774)",
      "Toleranční patent (1781)",
      "Josef II. umírá (1790)",
    ],
    hints: ["Marie Terezie nastoupila v roce 1740."],
  },
  {
    question: "Seřaď: nevolnictví zrušeno, Josef II. nastupuje, slezské války, Marie Terezie nastupuje.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje (1740)",
      "Slezské války (1740–1748)",
      "Josef II. nastupuje (1780)",
      "Nevolnictví zrušeno (1781)",
    ],
    hints: ["Marie Terezie nastoupila v roce 1740."],
  },
  {
    question: "Seřaď: Marie Terezie umírá, Josef II. nastupuje, zrušení klášterů, Toleranční patent.",
    correctAnswer: "order",
    items: [
      "Marie Terezie umírá (1780)",
      "Josef II. nastupuje (1780)",
      "Toleranční patent (1781)",
      "Zrušení kontemplativních klášterů (1782–)",
    ],
    hints: ["Marie Terezie a Josef II. nastoupili ve stejném roce 1780."],
  },
];

// Level 2 – středně těžké sekvence (5 událostí)
const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď chronologicky 5 klíčových reforem Marie Terezie a Josefa II.",
    correctAnswer: "order",
    items: [
      "Reforma správy (Marie Terezie, 1749)",
      "Povinná školní docházka (Marie Terezie, 1774)",
      "Zrušení nevolnictví (Josef II., 1781)",
      "Toleranční patent (Josef II., 1781)",
      "Zrušení kontemplativních klášterů (Josef II., 1782–1789)",
    ],
    hints: ["Reforma správy přišla jako první v roce 1749."],
  },
  {
    question: "Seřaď: Josef II. nastupuje, slezské války, školní docházka, Toleranční patent, Marie Terezie nastupuje.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje (1740)",
      "Slezské války — ztráta Slezska (1740–1748)",
      "Povinná školní docházka (1774)",
      "Josef II. nastupuje (1780)",
      "Toleranční patent (1781)",
    ],
    hints: ["Slezské války proběhly hned po nástupu Marie Terezie."],
  },
  {
    question: "Seřaď 5 klíčových dat vládnutí Marie Terezie.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje (1740)",
      "Válka o rakouské dědictví (1740–1748)",
      "Ztráta Slezska — mír v Drážďanech (1745)",
      "Reforma správy — zavedení ministerstev (1749)",
      "Povinná školní docházka (1774)",
    ],
    hints: ["Marie Terezie nastoupila v roce 1740."],
  },
  {
    question: "Seřaď: Josef II. nastupuje, kláštery rušeny, školní docházka, slezské války, nevolnictví zrušeno.",
    correctAnswer: "order",
    items: [
      "Slezské války (1740–1748)",
      "Povinná školní docházka (1774)",
      "Josef II. nastupuje (1780)",
      "Nevolnictví zrušeno (1781)",
      "Kláštery rušeny (1782–)",
    ],
    hints: ["Slezské války jsou nejdříve."],
  },
  {
    question: "Seřaď 5 klíčových dat: od slezských válek po smrt Josefa II.",
    correctAnswer: "order",
    items: [
      "Slezské války — ztráta Slezska (1740–1748)",
      "Reforma správy (1749)",
      "Školní docházka (1774)",
      "Toleranční patent + zrušení nevolnictví (1781)",
      "Josef II. umírá (1790)",
    ],
    hints: ["Slezské války jsou nejdříve, smrt Josefa II. nejpozději."],
  },
  {
    question: "Seřaď: Marie Terezie nastupuje, slezské války, školní docházka, Josef II. nastupuje, nevolnictví zrušeno.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje (1740)",
      "Slezské války (1740–1748)",
      "Povinná školní docházka (1774)",
      "Josef II. nastupuje (1780)",
      "Nevolnictví zrušeno (1781)",
    ],
    hints: ["Marie Terezie nastoupila v roce 1740."],
  },
  {
    question: "Seřaď 5 klíčových dat osvícenské doby v habsburské monarchii.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje na trůn (1740)",
      "Reforma správy (1749)",
      "Povinná školní docházka (1774)",
      "Josef II. nastupuje (1780)",
      "Josef II. vydává Toleranční patent a ruší nevolnictví (1781)",
    ],
    hints: ["Marie Terezie nastoupila v roce 1740."],
  },
  {
    question: "Seřaď: slezské války, Josef II. umírá, Marie Terezie nastupuje, školní docházka, kláštery rušeny.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje (1740)",
      "Slezské války (1740–1748)",
      "Školní docházka (1774)",
      "Kláštery rušeny (1782–1789)",
      "Josef II. umírá (1790)",
    ],
    hints: ["Slezské války proběhly hned na začátku vlády Marie Terezie."],
  },
  {
    question: "Seřaď 5 milníků: od Bílé hory po reformy Marie Terezie.",
    correctAnswer: "order",
    items: [
      "Bitva na Bílé hoře (1620)",
      "Rekatolizace a germanizace (po 1620)",
      "Marie Terezie nastupuje (1740)",
      "Slezské války (1740–1748)",
      "Povinná školní docházka (1774)",
    ],
    hints: ["Bílá hora je absolutně první."],
  },
  {
    question: "Seřaď 5 klíčových dat: od reforem Marie Terezie po národní obrození.",
    correctAnswer: "order",
    items: [
      "Školní docházka — Marie Terezie (1774)",
      "Toleranční patent — Josef II. (1781)",
      "Josef II. umírá (1790)",
      "Jungmann vydává slovník (1835–1839)",
      "Palacký — Dějiny národu českého (1836–1867)",
    ],
    hints: ["Školní docházka přišla jako první."],
  },
];

// Level 3 – pokročilé sekvence (5–6 událostí)
const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď 6 klíčových událostí vlády Marie Terezie a Josefa II. od nejdřívějšího.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje na trůn (1740)",
      "Slezské války — ztráta Slezska (1740–1748)",
      "Reforma správy (1749)",
      "Povinná školní docházka (1774)",
      "Josef II. nastupuje (1780)",
      "Toleranční patent + zrušení nevolnictví (1781)",
    ],
    hints: ["Marie Terezie nastoupila v roce 1740."],
  },
  {
    question: "Seřaď 6 milníků: od slezských válek po smrt Josefa II.",
    correctAnswer: "order",
    items: [
      "Slezské války — ztráta Slezska (1740–1748)",
      "Reforma správy — zavedení ministerstev (1749)",
      "Povinná školní docházka (1774)",
      "Josef II. nastupuje po matce (1780)",
      "Toleranční patent (1781)",
      "Josef II. umírá — revokace některých reforem (1790)",
    ],
    hints: ["Slezské války jsou první, smrt Josefa II. poslední."],
  },
  {
    question: "Seřaď 6 klíčových dat: od vzpoury šlechty po osvícenské reformy.",
    correctAnswer: "order",
    items: [
      "Bitva na Bílé hoře (1620)",
      "Komenský v exilu (od 1628)",
      "Marie Terezie nastupuje (1740)",
      "Povinná školní docházka (1774)",
      "Toleranční patent — Josef II. (1781)",
      "Zrušení nevolnictví (1781)",
    ],
    hints: ["Od Bílé hory po osvícenské reformy."],
  },
  {
    question: "Seřaď 5 klíčových dat z pohledu práv poddaných.",
    correctAnswer: "order",
    items: [
      "Poddaní vázáni nevolnictvím (středověk — 17. stol.)",
      "Marie Terezie zmírňuje robotu (1775)",
      "Toleranční patent (1781)",
      "Zrušení nevolnictví — Josef II. (1781)",
      "Revoluce 1848 — požadavky poddaných splněny (1848)",
    ],
    hints: ["Robota = povinné dny práce pro pána."],
  },
  {
    question: "Seřaď 6 klíčových dat vlády osvícenských panovníků.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje (1740)",
      "Slezské války (1740–1748)",
      "Reforma správy (1749)",
      "Povinná školní docházka (1774)",
      "Toleranční patent (1781)",
      "Zrušení klášterů (1782–1789)",
    ],
    hints: ["Marie Terezie nastoupila v roce 1740."],
  },
  {
    question: "Seřaď 5 klíčových reforem v chronologickém pořadí.",
    correctAnswer: "order",
    items: [
      "Reforma správy (1749)",
      "Vojenská akademie (1752)",
      "Povinná školní docházka (1774)",
      "Toleranční patent (1781)",
      "Zrušení nevolnictví (1781)",
    ],
    hints: ["Reforma správy přišla jako první."],
  },
  {
    question: "Seřaď 6 milníků: od Marie Terezie po národní obrození.",
    correctAnswer: "order",
    items: [
      "Marie Terezie nastupuje (1740)",
      "Povinná školní docházka (1774)",
      "Toleranční patent (1781)",
      "Josef II. umírá (1790)",
      "Jungmann vydává slovník (1835–1839)",
      "Revoluce 1848 — Palacký odmítá Frankfurt (1848)",
    ],
    hints: ["Marie Terezie je první, Palacký a Jungmann přicházejí po Josefovi."],
  },
  {
    question: "Seřaď 5 dat: od příchodu Habsburků po osvícenské reformy.",
    correctAnswer: "order",
    items: [
      "Habsburkové na trůně (1526)",
      "Bitva na Bílé hoře (1620)",
      "Marie Terezie nastupuje (1740)",
      "Povinná školní docházka (1774)",
      "Toleranční patent (1781)",
    ],
    hints: ["Habsburkové nastoupili v roce 1526."],
  },
  {
    question: "Seřaď 6 klíčových dat vlády Josefa II.",
    correctAnswer: "order",
    items: [
      "Josef II. spoluvládne s matkou (od 1765)",
      "Josef II. nastupuje sám (1780)",
      "Toleranční patent (1781)",
      "Zrušení nevolnictví (1781)",
      "Zrušení kontemplativních klášterů (1782–1789)",
      "Josef II. umírá a ruší část reforem (1790)",
    ],
    hints: ["Josef II. spoluvládl s matkou od 1765."],
  },
  {
    question: "Seřaď 5 klíčových dat od Josefova nástupu po revoluční rok.",
    correctAnswer: "order",
    items: [
      "Josef II. nastupuje (1780)",
      "Toleranční patent (1781)",
      "Zrušení nevolnictví (1781)",
      "Josef II. umírá (1790)",
      "Revoluce 1848 — konec roboty (1848)",
    ],
    hints: ["Josef II. nastoupil v roce 1780."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const MARIETEREZIEJOSEFIIREFORMY: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-marie-terezie-josef-ii-reformy",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-marie-terezie-josef-ii-reformy",
    title: "Marie Terezie, Josef II., reformy",
    studentTitle: "Marie Terezie a Josef II.",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Novověk - habsburská monarchie",
    briefDescription: "Pochopíš reformy Marie Terezie a Josefa II.",
    keywords: ["marie terezie", "josef ii", "reformy", "nevolnictví", "toleranční patent", "školní docházka"],
    goals: [
      "Žák uvede hlavní reformy Marie Terezie a Josefa II.",
      "Žák vysvětlí dopad zrušení nevolnictví",
      "Žák porovná přístupy obou panovníků",
    ],
    boundaries: ["Detailní diplomatická jednání", "Válečná taktika slezských válek"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Pamatuj: Marie Terezie zavedla školy (1774), Josef II. zrušil nevolnictví (1781).",
      steps: [
        "Marie Terezie 1740–1780: školy, armáda, správa",
        "Josef II. 1780–1790: nevolnictví, tolerance, kláštery",
        "Oba = osvícenský absolutismus",
      ],
      commonMistake: "Zaměňování, kdo co zavedl — školy jsou Terezie, nevolnictví Josef.",
      example: "Toleranční patent 1781 dovolil protestantům v Čechách svobodně věřit.",
    },
  },
];
