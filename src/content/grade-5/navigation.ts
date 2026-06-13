/**
 * Vlastní 2-úrovňová navigace pro 5. ročník: předmět → okruh → téma.
 * Stejný princip jako grade-3/navigation.ts — jde čistě o display vrstvu.
 * RVP data (TopicMetadata.category/topic/id) zůstávají beze změny.
 * Každé téma (cvičení) je v právě jednom okruhu — viz konzistenční test.
 * Informatika zde záměrně NENÍ (zůstává plochá).
 */

import type { SubjectNav } from "../navigation";

export const GRADE5_NAVIGATION: SubjectNav[] = [
  {
    subject: "matematika",
    okruhy: [
      {
        id: "velka-cisla",
        name: "Velká čísla a počítání",
        description: "Miliardy, záporná čísla a dělení pod sebou.",
        emoji: "🔢",
        topicIds: [
          "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-cisla-nad-milion-miliardy",
          "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-zaporna-cisla-na-ciselne-ose",
          "g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-pisemne-deleni-dvoucifernym-delitelem",
        ],
      },
      {
        id: "desetinna-cisla",
        name: "Desetinná čísla",
        description: "Čtení, sčítání a násobení desetinných čísel.",
        emoji: "🔟",
        topicIds: [
          "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-desetinna-cisla-cteni-zapis-porovnavani",
          "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-scitani-a-odcitani-desetinnych-cisel",
          "g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-nasobeni-a-deleni-desetinnych-cisel-10-100-1000",
        ],
      },
      {
        id: "geometrie",
        name: "Geometrie",
        description: "Rýsování, obsah obrazce a souměrnost.",
        emoji: "📐",
        topicIds: [
          "g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-konstrukce-trojuhelniku-kolmice-rovnobezky",
          "g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-obsah-obrazce-ve-ctvercove-siti-jednotky-obsahu",
          "g5-matematika-geometrie-v-rovine-a-v-prostoru-soumernost-osova-soumernost-sestrojeni-obrazu-urceni-osy",
        ],
      },
      {
        id: "tabulky-grafy",
        name: "Tabulky a grafy",
        description: "Aritmetický průměr, grafy a tabulky.",
        emoji: "📊",
        topicIds: [
          "g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-aritmeticky-prumer-vypocet",
          "g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-diagramy-grafy-cteni-a-sestavovani-tabulek",
        ],
      },
      {
        id: "logicke-ulohy",
        name: "Logické úlohy",
        description: "Úlohy na přemýšlení a představivost.",
        emoji: "🧩",
        topicIds: [
          "g5-matematika-nestandardni-aplikacni-ulohy-a-problemy-logicke-ulohy-ulohy-nezavisle-na-beznych-postupech-prostorova-predstavivos",
        ],
      },
    ],
  },
  {
    subject: "čeština",
    okruhy: [
      {
        id: "slovo-vyznam",
        name: "Slovo a jeho význam",
        description: "Vícevýznamová slova a spisovná čeština.",
        emoji: "🔁",
        topicIds: [
          "g5-cjl-jazykova-vychova-nauka-o-slove-slova-jednoznacna-mnohoznacna-vicevyznamova",
          "g5-cjl-jazykova-vychova-nauka-o-slove-slova-spisovna-a-nespisovna",
        ],
      },
      {
        id: "slovni-druhy",
        name: "Slovní druhy",
        description: "Deset slovních druhů, číslovky, slovesa a další.",
        emoji: "✏️",
        topicIds: [
          "g5-cjl-jazykova-vychova-tvaroslovi-slovni-druhy-urcovani-vsech-deseti-ohebne-a-neohebne",
          "g5-cjl-jazykova-vychova-tvaroslovi-cislovky-druhy-zakladni-radove-druhove-nasobne",
          "g5-cjl-jazykova-vychova-tvaroslovi-pridavna-jmena-druhy-tvrda-mekka-privlastnovaci-sklonovani",
          "g5-cjl-jazykova-vychova-tvaroslovi-zajmena-sklonovani-osobnich-zajmen",
          "g5-cjl-jazykova-vychova-tvaroslovi-slovesa-zpusob-oznamovaci-rozkazovaci-podminovaci",
        ],
      },
      {
        id: "stavba-vety",
        name: "Stavba věty",
        description: "Podmět, shoda, souvětí a přímá řeč.",
        emoji: "📝",
        topicIds: [
          "g5-cjl-jazykova-vychova-skladba-podmet-vyjadreny-nevyjadreny-nekolikanasobny",
          "g5-cjl-jazykova-vychova-skladba-shoda-prisudku-s-podmetem",
          "g5-cjl-jazykova-vychova-skladba-souveti-vzorce-pocet-vet",
          "g5-cjl-jazykova-vychova-skladba-prima-a-neprima-rec-uvod",
        ],
      },
      {
        id: "cteni-porozumeni",
        name: "Čtení a porozumění",
        description: "Jak číst texty, úplnost a převyprávění.",
        emoji: "📖",
        topicIds: [
          "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-studijni-cteni-a-vecne-cteni",
          "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-posuzovani-uplnosti-sdeleni",
          "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-reprodukce-primerene-sloziteho-sdeleni",
        ],
      },
      {
        id: "sloh-psani",
        name: "Sloh a psaní",
        description: "Vypravování, popis, dopis a vzkazy.",
        emoji: "✍️",
        topicIds: [
          "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-rozvinutou-osnovou",
          "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-subjektivne-zabarveny-popis-pracovniho-postupu",
          "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-uredni-zadost-tiskopisy-prihlaska-dotaznik",
          "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-telefonicky-rozhovor-zanechani-vzkazu",
        ],
      },
      {
        id: "literatura",
        name: "Literatura",
        description: "Žánry, umělecké texty, rozbor a vlastní tvorba.",
        emoji: "📚",
        topicIds: [
          "g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-basen-lyricka-a-epicka-roman-povidka",
          "g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-umelecke-a-neumelecke-texty",
          "g5-cjl-literarni-vychova-prace-s-textem-elementarni-literarni-pojmy-pri-rozboru-textu",
          "g5-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-text-na-dane-tema",
        ],
      },
    ],
  },
  {
    subject: "přírodověda",
    okruhy: [
      {
        id: "lidske-telo",
        name: "Lidské tělo",
        description: "Kostra, krev, mozek, smysly a trávení.",
        emoji: "🫀",
        topicIds: [
          "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-kostra-a-svaly-dychaci-a-obehova-soustava",
          "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-nervova-soustava-smysly",
          "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-travici-soustava-vylucovaci-soustava",
        ],
      },
      {
        id: "zdravi-dospivani",
        name: "Zdraví a dospívání",
        description: "Návykové látky, etapy života a vznik života.",
        emoji: "❤️",
        topicIds: [
          "g5-prirodoveda-clovek-a-jeho-zdravi-navyky-a-prevence-navykove-latky-alkohol-nikotin-drogy",
          "g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-etapy-lidskeho-zivota-dospivani",
          "g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-rozmnozovaci-soustava-vyvoj-cloveka-uvod",
        ],
      },
      {
        id: "trideni-organismu",
        name: "Třídění organismů",
        description: "Bezobratlí, obratlovci a říše živé přírody.",
        emoji: "🦋",
        topicIds: [
          "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-bezobratli-hmyz-pavouci-mekkysi-cervi",
          "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-obratlovci-savci-ptaci-plazi-obojzivelnici-ryby",
          "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-rise-rostlin-hub-zivocichu",
        ],
      },
      {
        id: "ekosystemy-ochrana",
        name: "Ekosystémy a ochrana",
        description: "Potravní řetězec a ochrana přírody.",
        emoji: "🌳",
        topicIds: [
          "g5-prirodoveda-rozmanitost-prirody-ekosystemy-a-zivotni-prostredi-potravni-retezec-vztahy-v-ekosystemu",
          "g5-prirodoveda-rozmanitost-prirody-ekosystemy-a-zivotni-prostredi-ochrana-prirody-narodni-parky-chko-v-cr",
        ],
      },
      {
        id: "energie",
        name: "Energie",
        description: "Magnety, elektřina a zdroje energie.",
        emoji: "⚡",
        topicIds: [
          "g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-magnety-elektrina-jednoduche-obvody-uvod",
          "g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-obnovitelne-a-neobnovitelne-zdroje-energie",
        ],
      },
      {
        id: "vesmir-zeme",
        name: "Vesmír a Země",
        description: "Pohyby Země, vesmír a horniny.",
        emoji: "🪐",
        topicIds: [
          "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-zeme-jako-planeta-tvar-rotace-obeh-stridani-dne-a-noci",
          "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-vesmir-slunecni-soustava-planety-slunce-mesic",
          "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-horniny-a-nerosty-druhy-vlastnosti-vznik",
        ],
      },
    ],
  },
  {
    subject: "vlastivěda",
    okruhy: [
      {
        id: "evropa-svet",
        name: "Evropa a svět",
        description: "Evropa, sousedé ČR, světadíly a mapy.",
        emoji: "🌍",
        topicIds: [
          "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropa-poloha-povrch-vodstvo-podnebi",
          "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropske-staty-a-eu-sousedni-zeme-cr-podrobne",
          "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-svetadily-a-oceany-zeme-prehled",
          "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-globus-svetove-strany-na-mape-casova-pasma-uvod",
        ],
      },
      {
        id: "novovek-habsburkove",
        name: "Novověk a Habsburkové",
        description: "Habsburkové, baroko a Marie Terezie.",
        emoji: "👑",
        topicIds: [
          "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-habsburkove-doba-pobelohorska-baroko",
          "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-marie-terezie-josef-ii-reformy",
        ],
      },
      {
        id: "devatenacte-stoleti",
        name: "19. století",
        description: "Národní obrození a průmyslová revoluce.",
        emoji: "🏭",
        topicIds: [
          "g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-narodni-obrozeni-jungmann-palacky-havlicek",
          "g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-prumyslova-revoluce-vedecky-a-technicky-pokrok",
        ],
      },
      {
        id: "dvacate-stoleti",
        name: "20. století",
        description: "Světové války, komunismus a vznik ČR.",
        emoji: "⚔️",
        topicIds: [
          "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-prvni-svetova-valka-a-vznik-ceskoslovenska-1918",
          "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-druha-svetova-valka-okupace-osvobozeni",
          "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-komunisticky-rezim-sametova-revoluce-1989",
          "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-vznik-cr-1993-cr-v-eu-a-nato",
        ],
      },
      {
        id: "stat-demokracie",
        name: "Stát a demokracie",
        description: "Volby, parlament a vláda.",
        emoji: "🏛️",
        topicIds: [
          "g5-vlastiveda-lide-kolem-nas-demokracie-a-stat-volby-zastupitelske-organy-cr-prezident-vlada",
        ],
      },
    ],
  },
];
