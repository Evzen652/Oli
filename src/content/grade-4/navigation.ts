/**
 * Vlastní 2-úrovňová navigace pro 4. ročník: předmět → okruh → téma.
 * Stejný princip jako grade-3/navigation.ts — jde čistě o display vrstvu.
 * RVP data (TopicMetadata.category/topic/id) zůstávají beze změny.
 * Každé téma (cvičení) je v právě jednom okruhu — viz konzistenční test.
 * Informatika zde záměrně NENÍ (zůstává plochá).
 */

import type { SubjectNav } from "../navigation";

export const GRADE4_NAVIGATION: SubjectNav[] = [
  {
    subject: "matematika",
    okruhy: [
      {
        id: "velka-cisla",
        name: "Velká čísla",
        description: "Čísla do milionu a zaokrouhlování.",
        emoji: "🔢",
        topicIds: [
          "g4-mat-cisla-do-milionu-4",
          "g4-mat-zaokrouhlovani-4",
        ],
      },
      {
        id: "pisemne-pocitani",
        name: "Písemné počítání",
        description: "Sčítání, násobení a dělení pod sebou.",
        emoji: "✏️",
        topicIds: [
          "g4-mat-pisemne-scitani-odcitani-4",
          "g4-mat-pisemne-nasobeni-4",
          "g4-mat-pisemne-deleni-jednociferne-4",
        ],
      },
      {
        id: "zlomky",
        name: "Zlomky",
        description: "Co je zlomek a počítání se zlomky.",
        emoji: "🍰",
        topicIds: [
          "g4-mat-zlomek-cast-celku-4",
          "g4-mat-zlomky-scitani-odcitani-stejny-jmenovatel-4",
        ],
      },
      {
        id: "geometrie",
        name: "Geometrie",
        description: "Trojúhelníky, kolmice, obvod a souměrnost.",
        emoji: "📐",
        topicIds: [
          "g4-mat-trojuhelnik-druhy-stran-4",
          "g4-mat-rovnobezky-kolmice-4",
          "g4-mat-obvod-obsah-obdelnik-ctverec-4",
          "g4-mat-osova-soumernost-4",
        ],
      },
      {
        id: "tabulky-prumer",
        name: "Tabulky a průměr",
        description: "Aritmetický průměr a čtení z tabulek.",
        emoji: "📊",
        topicIds: [
          "g4-mat-aritmeticky-prumer-4",
          "g4-mat-tabulky-diagramy-4",
        ],
      },
      {
        id: "logika",
        name: "Hádanky a logika",
        description: "Magické čtverce a číselné řady.",
        emoji: "🧩",
        topicIds: [
          "g4-mat-magicke-ctverce-ciselne-rady-4",
        ],
      },
    ],
  },
  {
    subject: "čeština",
    okruhy: [
      {
        id: "stavba-slova",
        name: "Stavba slova",
        description: "Části slova, předpony a předložky.",
        emoji: "🧱",
        topicIds: [
          "g4-cjl-jazykova-vychova-stavba-slova-predpona-koren-pripona-koncovka",
          "g4-cjl-jazykova-vychova-stavba-slova-pravopis-predpon-vy-vy-s-z-vz",
          "g4-cjl-jazykova-vychova-stavba-slova-pravopis-predlozek-s-z-se-ze",
        ],
      },
      {
        id: "slovni-druhy",
        name: "Slovní druhy",
        description: "Podstatná jména, vzory, zájmena a slovesa.",
        emoji: "✏️",
        topicIds: [
          "g4-cjl-jazykova-vychova-tvaroslovi-podstatna-jmena-sklonovani-podle-vzoru-rod-muz-zen-str",
          "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-pan-hrad-muz-stroj-predseda-soudce",
          "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-zena-ruze-pisen-kost-mesto-more-kure",
          "g4-cjl-jazykova-vychova-tvaroslovi-zajmena-druhy-zajmen",
          "g4-cjl-jazykova-vychova-tvaroslovi-slovesa-mluvnicke-kategorie-casovani-v-jednoduchych-casech",
        ],
      },
      {
        id: "stavba-vety",
        name: "Stavba věty",
        description: "Podmět, přísudek a souvětí.",
        emoji: "📝",
        topicIds: [
          "g4-cjl-jazykova-vychova-skladba-veta-jednoducha-a-souveti-vzorec-souveti",
          "g4-cjl-jazykova-vychova-skladba-stavba-vety-zakladni-skladebni-dvojice-podmet-prisudek",
        ],
      },
      {
        id: "cteni-porozumeni",
        name: "Čtení a porozumění",
        description: "Čtení s porozuměním a hledání informací.",
        emoji: "📖",
        topicIds: [
          "g4-cjl-komunikacni-a-slohova-vychova-cteni-manipulativni-komunikace-v-reklame",
          "g4-cjl-komunikacni-a-slohova-vychova-cteni-plynule-cteni-s-porozumenim-primerene-narocnych-textu",
          "g4-cjl-komunikacni-a-slohova-vychova-cteni-rozliseni-podstatnych-a-okrajovych-informaci",
          "g4-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-klicovych-slov-a-hlavni-myslenky",
        ],
      },
      {
        id: "sloh-psani",
        name: "Sloh a psaní",
        description: "Dopis, popis, vypravování a vzkazy.",
        emoji: "✍️",
        topicIds: [
          "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-inzerat-vzkaz-telefonicky-rozhovor",
          "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-psani-soukromeho-dopisu",
          "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-predmetu-osoby-a-pracovniho-postupu",
          "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-casovou-posloupnosti-osnova",
        ],
      },
      {
        id: "literatura-knihy",
        name: "Literatura a knihy",
        description: "Žánry, postavy a vlastní tvorba.",
        emoji: "📚",
        topicIds: [
          "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-encyklopedie-slovnik-periodika",
          "g4-cjl-literarni-vychova-prace-s-textem-hlavni-postavy-a-jejich-charakteristika",
          "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-pohadka-povest-bajka-povidka",
          "g4-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-tvorba-na-dane-tema",
        ],
      },
    ],
  },
  {
    subject: "vlastivěda",
    okruhy: [
      {
        id: "ceska-republika",
        name: "Česká republika",
        description: "Poloha, podnebí, povrch a vodstvo ČR.",
        emoji: "🇨🇿",
        topicIds: [
          "g4-vlastiveda-misto-kde-zijeme-ceska-republika-poloha-cr-v-evrope-sousedni-staty",
          "g4-vlastiveda-misto-kde-zijeme-ceska-republika-podnebi-cr-ovzdusi-pocasi",
          "g4-vlastiveda-misto-kde-zijeme-ceska-republika-povrch-cr-niziny-vrchoviny-hory-krkonose-sumava-aj",
          "g4-vlastiveda-misto-kde-zijeme-ceska-republika-vodstvo-cr-hlavni-reky-vltava-labe-morava-odra-rybniky-prehr",
        ],
      },
      {
        id: "kraje-mapa",
        name: "Kraje a mapa",
        description: "Kraje ČR, náš kraj a práce s mapou.",
        emoji: "🗺️",
        topicIds: [
          "g4-vlastiveda-misto-kde-zijeme-kraje-cr-14-kraju-cr-jejich-poloha-a-krajska-mesta",
          "g4-vlastiveda-misto-kde-zijeme-kraje-cr-nas-kraj-priroda-hospodarstvi-zajimavosti",
          "g4-vlastiveda-misto-kde-zijeme-prace-s-mapou-druhy-map-meritko-mapove-znacky-svetove-strany",
        ],
      },
      {
        id: "pravek-slovane",
        name: "Pravěk a Slované",
        description: "První lidé a příchod Slovanů.",
        emoji: "🏺",
        topicIds: [
          "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-pravek-a-prvni-lide-na-nasem-uzemi",
          "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-slovane-velkomoravska-rise-cyril-a-metodej",
        ],
      },
      {
        id: "cesti-panovnici",
        name: "Čeští panovníci",
        description: "Přemyslovci, Karel IV. a Jan Hus.",
        emoji: "👑",
        topicIds: [
          "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-premyslovci-sv-vaclav-premysl-otakar-ii-vaclav-ii",
          "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-lucemburkove-karel-iv-a-jeho-doba",
          "g4-vlastiveda-lide-a-cas-husitstvi-mistr-jan-hus-husitske-valky",
        ],
      },
      {
        id: "stat-demokracie",
        name: "Stát a demokracie",
        description: "Jak vznikl stát a co je demokracie.",
        emoji: "🏛️",
        topicIds: [
          "g4-vlastiveda-lide-kolem-nas-stat-a-spolecnost-vznik-a-vyvoj-statu-demokracie-pravni-stat",
        ],
      },
    ],
  },
  {
    subject: "přírodověda",
    okruhy: [
      {
        id: "rostliny",
        name: "Rostliny",
        description: "Stavba rostlin, stromy a plodiny.",
        emoji: "🌱",
        topicIds: [
          "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-stavba-rostlin-rozsireni-druhy-rostlin",
          "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-dreviny-stromy-a-kere",
          "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-hospodarske-rostliny-obilniny-ovoce-zelenina",
        ],
      },
      {
        id: "zivocichove",
        name: "Živočichové",
        description: "Třídění živočichů, savci a ptáci.",
        emoji: "🦊",
        topicIds: [
          "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-zivocichove-bezobratli-a-obratlovci-uvodni-trideni",
          "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-zivocichove-savci-ptaci-znaky-zastupci",
        ],
      },
      {
        id: "neziva-priroda",
        name: "Neživá příroda",
        description: "Voda, vzduch, slunce a půda.",
        emoji: "💧",
        topicIds: [
          "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-voda-skupenstvi-kolobeh-vody-v-prirode",
          "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-vzduch-slozeni-vlastnosti-vyznam",
          "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-slunce-svetlo-teplo-energie",
          "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-puda-vznik-slozeni-vyznam-pro-zivot",
        ],
      },
      {
        id: "ekosystemy-ochrana",
        name: "Ekosystémy a ochrana",
        description: "Les, louka, pole a ochrana přírody.",
        emoji: "🌳",
        topicIds: [
          "g4-prirodoveda-rozmanitost-prirody-ekosystemy-les-louka-pole-rybnik-rostliny-a-zivocichove",
          "g4-prirodoveda-rozmanitost-prirody-ochrana-prirody-chranene-rostliny-a-zivocichove-ohrozene-druhy",
        ],
      },
      {
        id: "zdravi-cloveka",
        name: "Zdraví člověka",
        description: "Zdravý životní styl a první pomoc.",
        emoji: "❤️",
        topicIds: [
          "g4-prirodoveda-clovek-a-jeho-zdravi-zdravy-zivotni-styl-strava-pohyb-spanek-prevence-urazu-a-nemoci",
          "g4-prirodoveda-clovek-a-jeho-zdravi-bezpecnost-prvni-pomoc-tisnove-volani-mimoradne-udalosti",
        ],
      },
    ],
  },
];
