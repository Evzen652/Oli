import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface FillItem { sentence: string; blank: string; options: string[] }

const POOL_L1: FillItem[] = [
  { sentence: "___dělal jsem domácí úkol.", blank: "Vy", options: ["Vy-", "Vý-", "S-", "Z-"] },
  { sentence: "Dostal jsem ___hru v soutěži.", blank: "vý", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Míč ___letěl vysoko do vzduchu.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Dostal ___bornou známku.", blank: "vý", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Přečetl ___tah z knihy.", blank: "vý", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Kočka ___lezla na strom.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Ptáček ___letěl z klece.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Dostal ___hodu v závodech.", blank: "vý", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Hráč ___střelil gól.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Žák ___pracoval celé cvičení.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Dostal jsem ___borné hodnocení.", blank: "vý", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Psala dopis s ___bornou péčí.", blank: "vý", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Závodník ___trénoval měsíc.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Přečetl ___tisk z novin.", blank: "vý", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Horolezec ___stoupil na vrchol.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Dostal jsem ___zvu na párty.", blank: "po", options: ["vy-", "vý-", "po-", "z-"] },
];

const POOL_L2: FillItem[] = [
  { sentence: "Lyžař ___jel z kopce.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Chlapec ___bohatl díky práci.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Kameny ___padaly ze skály.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Brácha ___pálil papír v ohni.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Dívka ___lepšila svůj výkon.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Pták ___vzlétl nad stromy.", blank: "vz", options: ["vy-", "vz-", "s-", "z-"] },
  { sentence: "Svah ___jeli na saních.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Mlha ___hustla po ránu.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Sníh ___tálo na jaře.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Kamion ___jel z dálnice.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Balón ___letěl do oblak.", blank: "vz", options: ["vz-", "vy-", "s-", "z-"] },
  { sentence: "Teplota ___klesla na minus deset.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Chlapec se ___dal a přestal plakat.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Přátelé ___sloučili síly.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Vlak ___pomalel před stanicí.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Raketa ___startovala a mířila ke hvězdám.", blank: "vz", options: ["vz-", "vy-", "s-", "z-"] },
];

const POOL_L3: FillItem[] = [
  { sentence: "Kos ___letěl nad hřiště a zmizel v korunách stromů.", blank: "vz", options: ["vz-", "vy-", "s-", "z-"] },
  { sentence: "Žák ___dal ruku, aby odpověděl na otázku.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Závodníci ___jeli na kole ze strmého kopce.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Holčička ___pracovala celý projekt sama.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Slunce ___chází každý den na východě.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Balón ___letěl do oblak a zmizel z dohledu.", blank: "vz", options: ["vz-", "vy-", "s-", "z-"] },
  { sentence: "Přátelé ___sloučili síly a dokázali to.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Teplota ___klesla na minus deset stupňů.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Kluk ___skočil na trampolíně velmi vysoko.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Hra ___těžila z každého hráče to nejlepší.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Horolezec ___stoupil na vrchol hory.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Potok ___mrzl a děti mohly bruslit.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Četa vojáků ___pochodovala na rozkaz.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Závodník ___trénoval a dosáhl nového rekordu.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Raketa ___startovala a mířila ke hvězdám.", blank: "vz", options: ["vz-", "vy-", "s-", "z-"] },
  { sentence: "Mlha ___hustla poté, co přišla studená fronta.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ sentence, blank, options }) => ({
    question: `Doplň správnou předponu: "${sentence}"`,
    correctAnswer: blank.toLowerCase() + "-",
    options: options,
    blanks: [blank],
    hints: [
      "vy- = dokončení děje nebo pohyb ven (vyletět, vypracovat)",
      "vý- = přízvučná první slabika (výhra, výborný, výtah)",
      "s- = pohyb dolů nebo sloučení (sjet, spalit)",
      "z- = změna stavu (ztuhnout, zbohatnout, zlepšit)",
      "vz- = pohyb nahoru nebo vznik (vzlétnout, vzdát)",
    ],
    solutionSteps: [
      "Přečti větu a zamysli se, co sloveso vyjadřuje.",
      "Pohyb dolů nebo dohromady → s-",
      "Změna stavu → z-",
      "Dokončení nebo pohyb ven → vy-",
      "Pohyb nahoru nebo vznik → vz-",
      "Přízvučná 1. slabika → vý-",
    ],
  }));
}

export const PRAVOPISPREDPONVYVYSZVZ: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-stavba-slova-pravopis-predpon-vy-vy-s-z-vz",
    rvpNodeId: "g4-cjl-jazykova-vychova-stavba-slova-pravopis-predpon-vy-vy-s-z-vz",
    title: "Pravopis předpon (vy-, vý-, s-, z-, vz-)",
    studentTitle: "Předpony vy/s/z",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Naučíš se, kdy psát předponu vy-, vý-, s-, z- nebo vz-.",
    keywords: ["předpona", "vy-", "vý-", "s-", "z-", "vz-", "pravopis"],
    goals: [
      "Rozlišit předpony vy-/vý-/s-/z-/vz- podle významu slovesa",
      "Správně doplnit předponu ve větách",
    ],
    boundaries: ["Nezabývat se předložkami s/z", "Bez předpon v přejatých slovech"],
    gradeRange: [4, 4],
    inputType: "fill_blank",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "vy-=dokončení, vý-=přízvučná slabika, s-=dolů/dohromady, z-=změna stavu, vz-=nahoru/vznik",
      steps: [
        "Co vyjadřuje sloveso?",
        "Pohyb dolů nebo sloučení → s-",
        "Změna stavu → z-",
        "Dokončení děje nebo pohyb ven → vy-",
        "Pohyb nahoru nebo vznik → vz-",
        "Přízvučná 1. slabika → vý-",
      ],
      commonMistake: "Záměna s- a z- (sjet = dolů × zlepšit = změna stavu)",
      example: "sjet (z kopce dolů) × ztuhnout (změna stavu) × vzlétnout (nahoru)",
    },
  },
];
