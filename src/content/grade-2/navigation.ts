/**
 * Vlastní 2-úrovňová navigace pro 2. ročník: předmět → okruh → téma.
 * Stejný princip jako grade-3/navigation.ts — jde čistě o display vrstvu.
 * RVP data (TopicMetadata.category/topic/id) zůstávají beze změny.
 * Každé téma (cvičení) je v právě jednom okruhu — viz konzistenční test.
 * Informatika zde záměrně NENÍ (zůstává plochá).
 */

import type { SubjectNav } from "../navigation";

export const GRADE2_NAVIGATION: SubjectNav[] = [
  {
    subject: "matematika",
    okruhy: [
      {
        id: "pocitani-100",
        name: "Počítání do 100",
        description: "Čteš, zapisuješ a počítáš čísla do sta.",
        emoji: "🔢",
        topicIds: [
          "g2-mat-cteni-zapis-100",
          "g2-mat-ciselna-osa-100",
          "g2-mat-scitani-odcitani-100",
        ],
      },
      {
        id: "nasobilka",
        name: "Násobilka",
        description: "Násobení, dělení a malá násobilka.",
        emoji: "✖️",
        topicIds: [
          "g2-mat-nasobeni-opakovane",
          "g2-mat-nasobilka-2345",
          "g2-mat-vztah-nasobeni-deleni",
        ],
      },
      {
        id: "slovni-ulohy",
        name: "Slovní úlohy",
        description: "Krátké příklady ze života.",
        emoji: "📖",
        topicIds: [
          "g2-mat-slovni-ulohy-100",
        ],
      },
      {
        id: "mereni-jednotky",
        name: "Měření a jednotky",
        description: "Měříš délku, hmotnost, objem a čas.",
        emoji: "📏",
        topicIds: [
          "g2-mat-jednotky",
          "g2-mat-mereni-casu",
        ],
      },
      {
        id: "tabulky-rady",
        name: "Tabulky a řady",
        description: "Čteš z tabulek a doplňuješ řady čísel.",
        emoji: "📊",
        topicIds: [
          "g2-mat-tabulky",
          "g2-mat-posloupnosti",
        ],
      },
      {
        id: "geometrie",
        name: "Geometrie",
        description: "Bod, přímka, úsečka a její délka.",
        emoji: "📐",
        topicIds: [
          "g2-mat-bod-primka-usecka",
          "g2-mat-mereni-delky",
        ],
      },
    ],
  },
  {
    subject: "prvouka",
    okruhy: [
      {
        id: "cas-tradice",
        name: "Čas a tradice",
        description: "Hodiny, kalendář a svátky.",
        emoji: "🕐",
        topicIds: [
          "g2-prv-hodiny-cas",
          "g2-prv-tradice",
        ],
      },
      {
        id: "lide-kolem-nas",
        name: "Lidé kolem nás",
        description: "Kamarádi, povolání a slušné chování.",
        emoji: "👨‍👩‍👧",
        topicIds: [
          "g2-prv-sousedstvi",
          "g2-prv-chovani",
          "g2-prv-povolani",
        ],
      },
      {
        id: "nase-obec",
        name: "Naše obec",
        description: "Tvá obec a důležitá místa v ní.",
        emoji: "🏘️",
        topicIds: [
          "g2-prv-nase-obec",
          "g2-prv-orientace-obec",
          "g2-prv-plan-obce",
        ],
      },
      {
        id: "priroda-zvirata",
        name: "Příroda a zvířata",
        description: "Zvířata, rostliny a roční období.",
        emoji: "🌳",
        topicIds: [
          "g2-prv-zvirata-uzitek",
          "g2-prv-jaro-rostliny-mladata",
          "g2-prv-jaro-leto",
          "g2-prv-podzim-zima",
          "g2-prv-zima-zvirata",
        ],
      },
      {
        id: "zdravi-bezpeci",
        name: "Zdraví a bezpečí",
        description: "Jak žít zdravě a pomoci při úrazu.",
        emoji: "❤️",
        topicIds: [
          "g2-prv-zdravy-styl",
          "g2-prv-prvni-pomoc",
        ],
      },
    ],
  },
  {
    subject: "čeština",
    okruhy: [
      {
        id: "hlasky-pravopis",
        name: "Hlásky a pravopis",
        description: "Y/I, skupiny s háčkem a slabiky.",
        emoji: "🔤",
        topicIds: [
          "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-pravopis-tvrdych-a-mekkych-souhlasek-i-y-po-souhlaskach",
          "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-skupiny-de-te-ne-be-pe-ve-me",
          "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-slabika-rozdeleni-na-slabiky",
        ],
      },
      {
        id: "slova-tvary",
        name: "Slova a jejich tvary",
        description: "Slovesa, vlastní jména a abeceda.",
        emoji: "✏️",
        topicIds: [
          "g2-cjl-jazykova-vychova-tvaroslovi-slovesa-rozliseni-slovesneho-druhu",
          "g2-cjl-jazykova-vychova-tvaroslovi-vlastni-jmena-velke-pismeno",
          "g2-cjl-jazykova-vychova-tvaroslovi-abeceda-a-razeni",
        ],
      },
      {
        id: "vyznam-slov",
        name: "Význam slov",
        description: "Protiklady, synonyma a skupiny slov.",
        emoji: "🔁",
        topicIds: [
          "g2-cjl-jazykova-vychova-slovni-zasoba-slova-protikladna-a-souznacna",
          "g2-cjl-jazykova-vychova-slovni-zasoba-slova-nadrazena-a-podrazena",
        ],
      },
      {
        id: "veta-text",
        name: "Věta a text",
        description: "Druhy vět a orientace v textu.",
        emoji: "📝",
        topicIds: [
          "g2-cjl-komunikacni-a-slohova-vychova-prace-s-textem-druhy-vet-oznamovaci-tazaci-rozkazovaci",
          "g2-cjl-komunikacni-a-slohova-vychova-prace-s-textem-orientace-v-textu-veta-odstavec-nadpis",
        ],
      },
      {
        id: "cteni-knihy",
        name: "Čtení a knihy",
        description: "Pohádky, básně a práce s knihou.",
        emoji: "📚",
        topicIds: [
          "g2-cjl-literarni-vychova-literarni-zanry-pohadka-rikanky-basen-hadanka",
          "g2-cjl-literarni-vychova-prace-s-knihou-spisovatel-ilustrator-knihovna",
        ],
      },
    ],
  },
];
