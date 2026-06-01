import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
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
      { left: "Volavka šedá", right: "Rybník" },
      { left: "Jelen lesní", right: "Les" },
      { left: "Jeřáb luční", right: "Louka" },
      { left: "Chřástal polní", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Plotice obecná", right: "Rybník" },
      { left: "Sýkorka koňadra", right: "Les" },
      { left: "Pampeliška", right: "Louka" },
      { left: "Skřivan polní", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Řasa zelená", right: "Rybník" },
      { left: "Mravenec lesní", right: "Les" },
      { left: "Čekanka", right: "Louka" },
      { left: "Kukuřice", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Labuť velká", right: "Rybník" },
      { left: "Veverka obecná", right: "Les" },
      { left: "Tráva (kavyl)", right: "Louka" },
      { left: "Slepice polní koroptev", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Čolník obecný", right: "Rybník" },
      { left: "Kůrovec", right: "Les" },
      { left: "Koník luční", right: "Louka" },
      { left: "Ječmen", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Kachna divoká", right: "Rybník" },
      { left: "Jestřáb lesní", right: "Les" },
      { left: "Pupalka dvouletá", right: "Louka" },
      { left: "Mák polní", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Bahník (bahnivka)", right: "Rybník" },
      { left: "Dub letní", right: "Les" },
      { left: "Hvozdík kartouzek", right: "Louka" },
      { left: "Ovsík vyvýšený", right: "Pole" },
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
      { left: "Potápka chocholatá", right: "Rybník" },
      { left: "Plch velký", right: "Les" },
      { left: "Starček obecný", right: "Louka" },
      { left: "Snovač polní", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Leklík (ryba)", right: "Rybník" },
      { left: "Chrobák nosorožec", right: "Les" },
      { left: "Prvosenka jarní", right: "Louka" },
      { left: "Řepka olejná", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Okounek pstruhový", right: "Rybník" },
      { left: "Sojka obecná", right: "Les" },
      { left: "Blatoucha", right: "Louka" },
      { left: "Koukol polní", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Vrkoč (plž)", right: "Rybník" },
      { left: "Tchoř lesní", right: "Les" },
      { left: "Řebříček obecný", right: "Louka" },
      { left: "Zemník (brambor)", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Husa divoká", right: "Rybník" },
      { left: "Střevlík zahradní", right: "Les" },
      { left: "Lipnice luční", right: "Louka" },
      { left: "Oves", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Rosnička zelená", right: "Rybník" },
      { left: "Srnec obecný", right: "Les" },
      { left: "Modřenec", right: "Louka" },
      { left: "Slunečnice", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Lín obecný", right: "Rybník" },
      { left: "Čáp černý", right: "Les" },
      { left: "Kuklík obecný", right: "Louka" },
      { left: "Bavlník", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Poduška (mechorost)", right: "Rybník" },
      { left: "Holub hřivnáč", right: "Les" },
      { left: "Hrachor luční", right: "Louka" },
      { left: "Pohanka setá", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Sekáč (klepeto)", right: "Rybník" },
      { left: "Drobek lesní", right: "Les" },
      { left: "Vikev ptačí", right: "Louka" },
      { left: "Hrách polní", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Blecha vodní (perloočka)", right: "Rybník" },
      { left: "Jezevec lesní", right: "Les" },
      { left: "Kakost luční", right: "Louka" },
      { left: "Soja luštinná", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Klouzatec (ryba)", right: "Rybník" },
      { left: "Ořešník pěti", right: "Les" },
      { left: "Čičorka pestrá", right: "Louka" },
      { left: "Len setý", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Lyska černá", right: "Rybník" },
      { left: "Bobr evropský", right: "Les" },
      { left: "Marulka (Potentilla)", right: "Louka" },
      { left: "Žito", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Piskor pruhovaný", right: "Rybník" },
      { left: "Rys ostrovid", right: "Les" },
      { left: "Mochna husí", right: "Louka" },
      { left: "Sudka (cukrová řepa)", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Šídlatka (vážka)", right: "Rybník" },
      { left: "Divoké prase", right: "Les" },
      { left: "Lomikámen", right: "Louka" },
      { left: "Tabák", right: "Pole" },
    ],
  },
  {
    question: "Spoj živočicha nebo rostlinu s ekosystémem, kde typicky žije.",
    correctAnswer: "match",
    pairs: [
      { left: "Okřídlenec (vážka)", right: "Rybník" },
      { left: "Medvěd hnědý", right: "Les" },
      { left: "Kozlík lékařský", right: "Louka" },
      { left: "Konopí seté", right: "Pole" },
    ],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 30);
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
