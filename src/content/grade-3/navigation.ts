/**
 * Vlastní 2-úrovňová navigace pro 3. ročník: okruh → téma.
 * Nahrazuje 4-úrovňovou RVP hierarchii v TopicBrowseru.
 * RVP data zůstávají beze změny — jde pouze o display vrstvu.
 */

export interface Grade3Okruh {
  id: string;
  name: string;
  description: string;
  emoji: string;
  topicIds: string[];
}

export interface Grade3SubjectNav {
  subject: string;
  okruhy: Grade3Okruh[];
}

export const GRADE3_NAVIGATION: Grade3SubjectNav[] = [
  {
    subject: "matematika",
    okruhy: [
      {
        id: "cisla",
        name: "Čísla do 1 000",
        description: "Čteš, zapisuješ, zaokrouhlíš a počítáš s čísly do tisíce.",
        emoji: "🔢",
        topicIds: [
          "g3-mat-cisla-do-1000",
          "g3-mat-zaokrouhlovani",
          "g3-mat-scitani-odcitani-1000",
        ],
      },
      {
        id: "nasobilka",
        name: "Násobilka",
        description: "Celá malá násobilka, násobení desítkami a dělení se zbytkem.",
        emoji: "✖️",
        topicIds: [
          "g3-mat-nasobeni-deleni-mala-nasobilka",
          "g3-mat-nasobeni-10-100-zbytkem",
          "g3-mat-nasobilka-6-10",
        ],
      },
      {
        id: "geometrie",
        name: "Geometrie",
        description: "Rýsuješ úsečky, kružnice a počítáš obvod.",
        emoji: "📐",
        topicIds: [
          "g3-mat-kruznice-kruh",
          "g3-mat-rysovani-usecky",
          "g3-mat-obvod-trojuhelniku-ctverce-obdelniku",
        ],
      },
      {
        id: "miry",
        name: "Míry",
        description: "Převádíš délky, hmotnosti, objemy a čas.",
        emoji: "📏",
        topicIds: [
          "g3-mat-prevody-delky",
          "g3-mat-prevody-hmotnost-objem-cas",
        ],
      },
      {
        id: "slovni-ulohy",
        name: "Slovní úlohy",
        description: "Řešíš úlohy ze života s více kroky výpočtu.",
        emoji: "📝",
        topicIds: [
          "g3-mat-tabulky-diagramy",
          "g3-mat-slovni-ulohy-dve-operace",
        ],
      },
    ],
  },
  {
    subject: "čeština",
    okruhy: [
      {
        id: "vyjmenovana-slova",
        name: "Vyjmenovaná slova",
        description: "Píšeš správně i/y po obojetných souhláskách.",
        emoji: "📋",
        topicIds: [
          "g3-cjl-vyjmenovana-slova",
          "g3-cjl-slova-pribuzna-vyjmenovana",
          "g3-cjl-velka-pismena",
        ],
      },
      {
        id: "slova",
        name: "Slova",
        description: "Příbuzná slova, synonyma, antonyma a více významů.",
        emoji: "🔤",
        topicIds: [
          "g3-cjl-jazykova-vychova-nauka-o-slove-slova-pribuzna-koren-slova",
          "g3-cjl-jazykova-vychova-nauka-o-slove-slova-souznacna-synonyma-a-protikladna-antonyma",
          "g3-cjl-jazykova-vychova-nauka-o-slove-vyznam-slova-slova-jednoznacna-a-mnohoznacna",
        ],
      },
      {
        id: "slovni-druhy",
        name: "Slovní druhy",
        description: "Podstatná jména, slovesa a všech deset slovních druhů.",
        emoji: "🏷️",
        topicIds: [
          "g3-cjl-podstatna-jmena-rod-cislo-pad",
          "g3-cjl-slovesa-osoba-cislo-cas",
          "g3-cjl-slovni-druhy",
        ],
      },
      {
        id: "veta",
        name: "Věta",
        description: "Věta jednoduchá, souvětí a spojování vět.",
        emoji: "💬",
        topicIds: [
          "g3-cjl-veta-jednoducha-souveti",
          "g3-cjl-spojovani-vet-spojkami",
        ],
      },
      {
        id: "cteni",
        name: "Čtení",
        description: "Čteš plynně, rozumíš textu a vyhledáváš informace.",
        emoji: "📖",
        topicIds: [
          "g3-cjl-plynule-cteni-porozumeni",
          "g3-cjl-reprodukce-textu",
          "g3-cjl-vyhledavani-informaci",
        ],
      },
      {
        id: "sloh",
        name: "Sloh",
        description: "Napíšeš dialog, popis, omluvenku nebo vypravování.",
        emoji: "✏️",
        topicIds: [
          "g3-cjl-dialog-pravidla",
          "g3-cjl-omluvenka-zprava",
          "g3-cjl-popis-predmetu",
          "g3-cjl-vypravovani-osnova",
        ],
      },
      {
        id: "psani",
        name: "Psaní",
        description: "Píšeš úhledně, kontroluješ projev a doprovázíš text obrázkem.",
        emoji: "🖊️",
        topicIds: [
          "g3-cjl-uhledne-psani",
          "g3-cjl-sebekontrola-projevu",
          "g3-cjl-vlastni-vytvarny-doprovod",
        ],
      },
      {
        id: "literatura",
        name: "Literatura",
        description: "Pohádky, básně, bajky — čteš, rozumíš a tvoříš.",
        emoji: "📚",
        topicIds: [
          "g3-cjl-pohadka-povidka-basen-bajka",
          "g3-cjl-proza-verse",
          "g3-cjl-vers-rym-prirovnani",
          "g3-cjl-tvorive-cinnosti",
        ],
      },
    ],
  },
];
