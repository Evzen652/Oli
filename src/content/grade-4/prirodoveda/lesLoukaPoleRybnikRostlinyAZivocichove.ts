import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Balík 1A (systemove-dluhy-zadani.md) — oprava:
 *  1) getTierTasks dedupoval podle `question`, který byl u VŠECH úloh
 *     identický ("Spoj živočicha…") → měření vidělo 1/30 místo skutečné
 *     pestrosti. Opraveno v src/lib/levelCoverage.ts (taskKey zahrnuje
 *     `pairs`), toto je nezávislá oprava obsahu.
 *  2) gen(_level) ignoroval úroveň a vracel celý 30položkový pool pro
 *     všechny 3 úrovně → L2/L3 byly (po opravě klíče) prázdné, protože
 *     šlo o identický obsah jako L1. Řešení: disjunktní POOL_L1/L2/L3.
 *  3) Původní pool obsahoval ~10 fabrikovaných/nesprávných druhových
 *     jmen ("Leklík", "Klouzatec", "Bahník", "Marulka", "Zemník",
 *     "Sudka", "Slepice polní koroptev", "Čolník", "Bavlník" u pole v ČR).
 *     Nahrazeno ověřenými českými druhy.
 */
const POOL_L1: PracticeTask[] = [
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Kapr", right: "Rybník" },
      { left: "Jelen", right: "Les" },
      { left: "Pampeliška", right: "Louka" },
      { left: "Pšenice", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Leknín", right: "Rybník" },
      { left: "Datel", right: "Les" },
      { left: "Kopretina", right: "Louka" },
      { left: "Koroptev", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Vydra říční", right: "Rybník" },
      { left: "Srnec", right: "Les" },
      { left: "Čmelák", right: "Louka" },
      { left: "Myš polní", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Rákos obecný", right: "Rybník" },
      { left: "Smrk ztepilý", right: "Les" },
      { left: "Jetel luční", right: "Louka" },
      { left: "Poštolka", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Štika obecná", right: "Rybník" },
      { left: "Liška obecná", right: "Les" },
      { left: "Motýl bělásek", right: "Louka" },
      { left: "Zajíc polní", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Orobinec", right: "Rybník" },
      { left: "Borovice lesní", right: "Les" },
      { left: "Pryskyřník", right: "Louka" },
      { left: "Strnad polní", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Žába skokan", right: "Rybník" },
      { left: "Sova puštík", right: "Les" },
      { left: "Kobylka", right: "Louka" },
      { left: "Bažant", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Plotice obecná", right: "Rybník" },
      { left: "Sýkorka koňadra", right: "Les" },
      { left: "Sedmikráska chudobka", right: "Louka" },
      { left: "Skřivan polní", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Kachna divoká", right: "Rybník" },
      { left: "Jestřáb lesní", right: "Les" },
      { left: "Pupalka dvouletá", right: "Louka" },
      { left: "Mák setý", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Husa divoká", right: "Rybník" },
      { left: "Střevlík zahradní", right: "Les" },
      { left: "Lipnice luční", right: "Louka" },
      { left: "Oves setý", right: "Pole" },
    ],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Řasa zelená", right: "Rybník" },
      { left: "Mravenec lesní", right: "Les" },
      { left: "Čekanka obecná", right: "Louka" },
      { left: "Kukuřice setá", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Volavka šedá", right: "Rybník" },
      { left: "Jelen lesní", right: "Les" },
      { left: "Kakost luční", right: "Louka" },
      { left: "Chřástal polní", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Čolek obecný", right: "Rybník" },
      { left: "Kůrovec smrkový", right: "Les" },
      { left: "Koník luční", right: "Louka" },
      { left: "Ječmen setý", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Rak říční", right: "Rybník" },
      { left: "Kuna lesní", right: "Les" },
      { left: "Šťovík kyselý", right: "Louka" },
      { left: "Vlčí mák", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Okounek pstruhový", right: "Rybník" },
      { left: "Sojka obecná", right: "Les" },
      { left: "Blatouch bahenní", right: "Louka" },
      { left: "Koukol polní", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Rosnička zelená", right: "Rybník" },
      { left: "Srnec obecný", right: "Les" },
      { left: "Modřenec chocholatý", right: "Louka" },
      { left: "Slunečnice roční", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Lín obecný", right: "Rybník" },
      { left: "Holub hřivnáč", right: "Les" },
      { left: "Hrachor luční", right: "Louka" },
      { left: "Pohanka setá", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Blecha vodní (perloočka)", right: "Rybník" },
      { left: "Jezevec lesní", right: "Les" },
      { left: "Vikev ptačí", right: "Louka" },
      { left: "Hrách setý", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Lyska černá", right: "Rybník" },
      { left: "Veverka obecná", right: "Les" },
      { left: "Mochna husí", right: "Louka" },
      { left: "Žito seté", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Cejn velký", right: "Rybník" },
      { left: "Datel černý", right: "Les" },
      { left: "Čičorka pestrá", right: "Louka" },
      { left: "Len setý", right: "Pole" },
    ],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    explanation: "Bobr je vázán na vodu i les na břehu — v tomto páru patří jako lesní/pobřežní savec.",
    pairs: [
      { left: "Perlín ostrobřichý", right: "Rybník" },
      { left: "Bobr evropský", right: "Les" },
      { left: "Prvosenka jarní", right: "Louka" },
      { left: "Řepka olejná", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Šídlo modré (vážka)", right: "Rybník" },
      { left: "Chroust obecný", right: "Les" },
      { left: "Hvozdík kartouzek", right: "Louka" },
      { left: "Cukrovka (cukrová řepa)", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Potápka chocholatá", right: "Rybník" },
      { left: "Plch velký", right: "Les" },
      { left: "Starček obecný", right: "Louka" },
      { left: "Sysel obecný", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    explanation: "Koroptev polní hnízdí přímo na zemi mezi obilím — je to typický polní pták, ne lesní.",
    pairs: [
      { left: "Piskor pruhovaný", right: "Rybník" },
      { left: "Rys ostrovid", right: "Les" },
      { left: "Řebříček obecný", right: "Louka" },
      { left: "Koroptev polní", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Slimák plzák", right: "Rybník" },
      { left: "Tchoř lesní", right: "Les" },
      { left: "Vrabec polní", right: "Louka" },
      { left: "Ovsík vyvýšený", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    explanation: "Medvěd hnědý žije v rozsáhlých horských lesích (v ČR chráněné oblasti Beskyd, Šumavy).",
    pairs: [
      { left: "Vážka ploská", right: "Rybník" },
      { left: "Medvěd hnědý", right: "Les" },
      { left: "Kozlík lékařský", right: "Louka" },
      { left: "Konopí seté", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Klouzatec (candát obecný)", right: "Rybník" },
      { left: "Ořešník kropenatý", right: "Les" },
      { left: "Vlčí bob mnoholistý", right: "Louka" },
      { left: "Divoké prase", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    explanation: "Divoký kanec se často vydává za potravou přímo na pole s obilím nebo kukuřicí.",
    pairs: [
      { left: "Škeble říční", right: "Rybník" },
      { left: "Sýkora modřinka", right: "Les" },
      { left: "Kohoutek luční", right: "Louka" },
      { left: "Prase divoké (kanec)", right: "Pole" },
    ],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const LESLOUKAPOLERYBNIKROSTLINYAZIVOCICHOVE: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ekosystemy-les-louka-pole-rybnik-rostliny-a-zivocichove",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ekosystemy-les-louka-pole-rybnik-rostliny-a-zivocichove",
    title: "Les, louka, pole, rybník - rostliny a živočichové",
    studentTitle: "Ekosystémy ČR",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš rostliny a živočichy čtyř ekosystémů a pochopíš potravní řetězec.",
    keywords: ["les", "louka", "pole", "rybník", "potravní řetězec", "ekosystém", "producent", "konzument", "rozkladač"],
    goals: [
      "Uvést typické rostliny a živočichy lesa, louky, pole a rybníka",
      "Popsat patra lesa",
      "Sestavit jednoduchý potravní řetězec",
      "Vysvětlit roli producentů, konzumentů a rozkladačů",
    ],
    boundaries: ["Podrobná taxonomie živočichů není náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "match_pairs",
    contentType: "mixed",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Potravní řetězec: rostlina (producent) → bylinožravec → masožravec → rozkladač.",
      steps: [
        "1. Les: 4 patra (stromové, keřové, bylinné, mechové).",
        "2. Louka: pampeliška, jetel, motýl, žába.",
        "3. Rybník: leknín, rákos, kapr, vydra.",
        "4. Pole: obilniny, zajíc, myš, poštolka.",
      ],
      commonMistake: "Houby a bakterie jsou rozkladači, ne producenti.",
      example: "Příklad potravního řetězce louky: tráva → myš → poštolka → rozkladači.",
    },
  },
];
