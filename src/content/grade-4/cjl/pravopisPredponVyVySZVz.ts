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
  { sentence: "Žák ___světlil úlohu správně.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Dostal ___znamení z matematiky.", blank: "vý", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Žába ___skočila z rybníka.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Sbírka má ___bornou cenu.", blank: "vý", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Ptáci ___létali z hnízda.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Přečetl jsem ___tah ze smlouvy.", blank: "vý", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Dítě ___běhlo za míčem.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Je to ___borný nápad.", blank: "vý", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Sluníčko ___šlo z mraků.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Dostal ___zvu na oslavu.", blank: "po", options: ["vy-", "vý-", "po-", "z-"] },
  { sentence: "Kluk ___koumal z okna.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Přečetl jsem ___bornou knihu.", blank: "vý", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Ryba ___skočila z vody.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Zpěvák měl ___borný hlas.", blank: "vý", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Závodník ___koupal závod.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
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
  { sentence: "Voda ___houstla mrazem.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Letadlo ___klesalo k přistání.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Cena ___klesla po slevě.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Chlapec ___klidnil se postupně.", blank: "u", options: ["s-", "z-", "u-", "vz-"] },
  { sentence: "Přátelé ___chystali na výlet.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Puk ___klouzal po ledu.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Jelen ___mizel v lese.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Oheň ___hasl ráno.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Ptáci ___lítali nad vodou.", blank: "vz", options: ["vz-", "vy-", "s-", "z-"] },
  { sentence: "Děti ___sedly na zem.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Stromy ___dřevěněly s lety.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Pes ___kulovitěl jak houska.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Prameny ___víraly se do řeky.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Déšť ___silnil odpoledne.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
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
  { sentence: "Ptáci ___lítali do výšky, když viděli nebezpečí.", blank: "vz", options: ["vz-", "vy-", "s-", "z-"] },
  { sentence: "Chlapec ___pracoval projekt za jeden večer.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Lyžař ___jel z hory, a pak znovu vyjel nahoru.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Voda ___hustla na ledu a zamrzla.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Dívka ___lepšila výsledky po celý rok.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Orel ___letěl nad horami a hledal kořist.", blank: "vz", options: ["vz-", "vy-", "s-", "z-"] },
  { sentence: "Sníh ___tálo pomalu, ale jaro přišlo.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Závodníci ___jeli z vrcholu sjezdovky.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Cvičením ___silnil a byl stále fittovanější.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Dítě ___bredilo s teplotou celou noc.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Přátelé ___chystali na cestu a naložili zavazadla.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Ptáci ___letěli na jih, kde bylo teplo.", blank: "vy", options: ["vy-", "vý-", "s-", "z-"] },
  { sentence: "Teplota ___klesala každý den o stupeň.", blank: "s", options: ["s-", "z-", "vy-", "vz-"] },
  { sentence: "Hoch ___dal to a šel za svým cílem.", blank: "z", options: ["s-", "z-", "vy-", "vz-"] },
];

const EXPLANATIONS: Record<string, string> = {
  "vy": "Předpona vy- se vždy píše s tvrdým y. Vyjadřuje dokončení děje nebo pohyb ven (například vyletět z klece). Když není slabika přízvučná, píšeme krátké vy-.",
  "vý": "Předpona vý- se vždy píše s tvrdým ý. Píšeme ji tehdy, když je první slabika přízvučná a dlouhá, většinou u podstatných a přídavných jmen (výhra, výborný, výtah). Měkké i sem nikdy nepatří.",
  "s": "Předpona s- se píše, když znamená pohyb dolů nebo spojení dohromady (sjet z kopce, sloučit síly). Rozhoduje se podle významu — když jde o směr dolů či dání věcí k sobě, je to s-.",
  "z": "Předpona z- se píše, když znamená změnu stavu — něco se stane jiným (ztuhnout, zbohatnout, zlepšit). Rozhoduj se podle významu: pokud se mění stav nebo vlastnost, patří tam z-.",
  "vz": "Předpona vz- se píše, když znamená pohyb nahoru nebo vznik něčeho nového (vzlétnout do výšky, vzejít). Když jde děj směrem vzhůru, je to vz-.",
  "po": "Tady nejde o předpony vy-/vý- ani s-/z-/vz-. Slovo má předponu po-, kterou poznáš podle významu slovesa. Vždy se rozhoduj podle toho, co sloveso vyjadřuje.",
  "u": "Tady nejde o předpony vy-/vý- ani s-/z-/vz-. Slovo má předponu u-, kterou poznáš podle významu slovesa. Vždy se rozhoduj podle toho, co sloveso vyjadřuje.",
};

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30).map(({ sentence, blank, options }) => ({
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
    explanation: EXPLANATIONS[blank.toLowerCase()] ?? EXPLANATIONS["vy"],
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
