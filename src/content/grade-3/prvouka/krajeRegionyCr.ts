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
    question: "Kolik krajů má Česká republika?",
    correctAnswer: "14 krajů",
    options: ["14 krajů", "12 krajů", "16 krajů", "10 krajů"],
    hints: [
      "Počet krajů je mezi 10 a 16.",
      "Hlavní město Praha je také kraj — jeden ze 14.",
    ],
    explanation:
      "Česká republika se dělí na 14 krajů. Každý kraj má své krajské město, kde sídlí krajský úřad. Praha je zároveň hlavním městem státu i samostatným krajem.",
  },
  {
    question: "Co je kraj?",
    correctAnswer: "Územní celek, který spravuje část státu",
    options: [
      "Územní celek, který spravuje část státu",
      "Název pro velkou vesnici",
      "Jiné označení pro stát",
      "Část ulice ve městě",
    ],
    hints: [
      "Kraj je větší než obec, ale menší než stát.",
      "Každý kraj má svůj úřad a zastupitele.",
    ],
    explanation:
      "Kraj je územní celek, který spravuje část státu. Česká republika je rozdělena na 14 krajů. Každý kraj má krajský úřad a zastupitelstvo, které rozhoduje o věcech v daném kraji.",
  },
  {
    question: "Co je region?",
    correctAnswer: "Oblast se společnými znaky — přírodou, historií nebo kulturou",
    options: [
      "Oblast se společnými znaky — přírodou, historií nebo kulturou",
      "Přesně vymezená část státu s úřadem",
      "Jiný název pro hlavní město",
      "Část kraje bez vlastní správy",
    ],
    hints: [
      "Region nemusí mít přesné hranice — jde o podobné rysy oblasti.",
      "Lidé v regionu mají podobnou kulturu, přírodní podmínky nebo historii.",
    ],
    explanation:
      "Region je oblast, která má společné znaky — například stejnou přírodu, historii nebo kulturu. Region nemusí mít přesně dané hranice jako kraj. Například Haná nebo Chodsko jsou regiony.",
  },
  {
    question: "Jaké je krajské město Jihomoravského kraje?",
    correctAnswer: "Brno",
    options: ["Brno", "Zlín", "Jihlava", "Olomouc"],
    hints: [
      "Je to druhé největší město České republiky.",
      "Leží na jihu Moravy a je centrem celé oblasti.",
    ],
    explanation:
      "Brno je krajské město Jihomoravského kraje. Je to druhé největší město České republiky a leží na jihu Moravy.",
  },
  {
    question: "Jaké je krajské město Moravskoslezského kraje?",
    correctAnswer: "Ostrava",
    options: ["Ostrava", "Opava", "Brno", "Olomouc"],
    hints: [
      "Je to třetí největší město České republiky.",
      "Leží na severu Moravy, poblíž hranic s Polskem.",
    ],
    explanation:
      "Ostrava je krajské město Moravskoslezského kraje. Je to třetí největší město v České republice a leží na severovýchodě Moravy.",
  },
  {
    question: "Jaké je krajské město Plzeňského kraje?",
    correctAnswer: "Plzeň",
    options: ["Plzeň", "České Budějovice", "Liberec", "Karlovy Vary"],
    hints: [
      "Krajské město má stejné jméno jako kraj.",
      "Je to velké město v západních Čechách.",
    ],
    explanation:
      "Plzeň je krajské město Plzeňského kraje. Leží v západních Čechách a je čtvrtým největším městem České republiky.",
  },
  {
    question: "Jaké je krajské město Jihočeského kraje?",
    correctAnswer: "České Budějovice",
    options: ["České Budějovice", "Písek", "Tábor", "Strakonice"],
    hints: [
      "Leží na jihu Čech, poblíž hranic s Rakouskem.",
      "V názvu tohoto města jsou slova označující polohu — jih a Čechy.",
    ],
    explanation:
      "České Budějovice jsou krajské město Jihočeského kraje. Leží na jihu Čech a jsou největším městem tohoto kraje.",
  },
  {
    question: "Jaké je krajské město Libereckého kraje?",
    correctAnswer: "Liberec",
    options: ["Liberec", "Jablonec nad Nisou", "Česká Lípa", "Frýdlant"],
    hints: [
      "Krajské město má stejné jméno jako kraj.",
      "Leží v severních Čechách, pod Ještědem.",
    ],
    explanation:
      "Liberec je krajské město Libereckého kraje. Leží v severních Čechách pod horou Ještěd.",
  },
  {
    question: "Jaké je krajské město Olomouckého kraje?",
    correctAnswer: "Olomouc",
    options: ["Olomouc", "Přerov", "Prostějov", "Šumperk"],
    hints: [
      "Krajské město má stejné jméno jako kraj.",
      "Je to historické město na střední Moravě.",
    ],
    explanation:
      "Olomouc je krajské město Olomouckého kraje. Je to jedno z nejstarších a historicky nejvýznamnějších měst na Moravě.",
  },
  {
    question: "Jaké je krajské město Zlínského kraje?",
    correctAnswer: "Zlín",
    options: ["Zlín", "Uherské Hradiště", "Vsetín", "Kroměříž"],
    hints: [
      "Krajské město má stejné jméno jako kraj.",
      "Leží na východní Moravě a je znám historií obuvnické továrny Baťa.",
    ],
    explanation:
      "Zlín je krajské město Zlínského kraje. Leží na východní Moravě a je proslulý svou historií spojenou s firmou Baťa.",
  },
  {
    question: "Jaké je krajské město Pardubického kraje?",
    correctAnswer: "Pardubice",
    options: ["Pardubice", "Chrudim", "Svitavy", "Ústí nad Orlicí"],
    hints: [
      "Krajské město má stejné jméno jako kraj.",
      "Je to město ve východních Čechách, známé dostizích.",
    ],
    explanation:
      "Pardubice jsou krajské město Pardubického kraje. Leží ve východních Čechách a jsou proslulé Velkou pardubickou — slavným dostihem.",
  },
  {
    question: "Jaké je krajské město Královéhradeckého kraje?",
    correctAnswer: "Hradec Králové",
    options: ["Hradec Králové", "Náchod", "Trutnov", "Jičín"],
    hints: [
      "Název krajského města je skryt v názvu kraje.",
      "Leží ve východních Čechách při řece Labi.",
    ],
    explanation:
      "Hradec Králové je krajské město Královéhradeckého kraje. Leží ve východních Čechách, kde se setkávají řeky Labe a Orlice.",
  },
  {
    question: "Jaké je krajské město kraje Vysočina?",
    correctAnswer: "Jihlava",
    options: ["Jihlava", "Havlíčkův Brod", "Třebíč", "Žďár nad Sázavou"],
    hints: [
      "Leží přibližně uprostřed České republiky.",
      "Kraj Vysočina je pojmenován podle krajiny — vysočiny, nikoliv podle města.",
    ],
    explanation:
      "Jihlava je krajské město kraje Vysočina. Leží přibližně ve středu České republiky. Kraj Vysočina je jediný kraj, který nemá v názvu jméno svého krajského města.",
  },
  {
    question: "Jaké je krajské město Karlovarského kraje?",
    correctAnswer: "Karlovy Vary",
    options: ["Karlovy Vary", "Cheb", "Sokolov", "Mariánské Lázně"],
    hints: [
      "Krajské město má stejné jméno jako kraj.",
      "Je to lázeňské město v západních Čechách.",
    ],
    explanation:
      "Karlovy Vary jsou krajské město Karlovarského kraje. Je to slavné lázeňské město v západních Čechách, známé minerálními prameny.",
  },
  {
    question: "Jaké je krajské město Ústeckého kraje?",
    correctAnswer: "Ústí nad Labem",
    options: ["Ústí nad Labem", "Most", "Chomutov", "Teplice"],
    hints: [
      "Krajské město leží u velké řeky — Labe.",
      "Kraj leží na severu Čech u hranic s Německem.",
    ],
    explanation:
      "Ústí nad Labem je krajské město Ústeckého kraje. Leží na severu Čech u řeky Labe a hranic s Německem.",
  },
  {
    question: "Které město je zároveň hlavním městem státu i samostatným krajem?",
    correctAnswer: "Praha",
    options: ["Praha", "Brno", "Ostrava", "Plzeň"],
    hints: [
      "Toto město je největší v České republice.",
      "Sídlí zde prezident, vláda i parlament.",
    ],
    explanation:
      "Praha je zároveň hlavním městem České republiky a samostatným krajem. Je největším městem státu a sídlí zde prezident, vláda, parlament i soudy.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
}

export const KRAJEREGIONYCR: TopicMetadata[] = [
  {
    id: "g3-prvouka-misto-kde-zijeme-nase-vlast-kraje-a-regiony-cr-uvod-nas-region",
    title: "Kraje a regiony ČR (úvod)",
    studentTitle: "Kraje České republiky",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Naše vlast",
    briefDescription: "Poznáš kraje ČR a jejich krajská města.",
    keywords: [
      "kraj",
      "region",
      "krajské město",
      "Praha",
      "Brno",
      "Ostrava",
      "Plzeň",
      "České Budějovice",
      "Liberec",
      "Olomouc",
      "Zlín",
      "Pardubice",
      "Hradec Králové",
      "Jihlava",
      "Karlovy Vary",
      "Ústí nad Labem",
    ],
    goals: [
      "Vědět, že Česká republika má 14 krajů.",
      "Znát rozdíl mezi krajem a regionem.",
      "Umět přiřadit krajská města ke správným krajům.",
    ],
    boundaries: [
      "Podrobná geografie a poloha krajů na mapě nejsou součástí základního obsahu pro 3. ročník.",
      "Detaily o krajské správě a politice se neprobírají.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "ČR má 14 krajů. Kraj = územní celek se správou. Region = oblast se společnými znaky. Praha je hlavní město i kraj.",
      steps: [
        "Vzpomeň si, kolik krajů má Česká republika.",
        "Kraj a region nejsou totéž — kraj má přesné hranice a úřad, region je oblast se společnými znaky.",
        "Každý kraj má krajské město — většinou má stejný název jako kraj.",
        "Praha je výjimka — je to hlavní město státu i samostatný kraj.",
      ],
      commonMistake:
        "Středočeský kraj nemá vlastní krajské město — jeho správa sídlí v Praze, ale Praha do Středočeského kraje nepatří.",
      example:
        "Jihomoravský kraj — krajské město Brno. Vysočina — krajské město Jihlava (jediný kraj bez jména města v názvu).",
    },
  },
];
