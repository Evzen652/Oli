/**
 * Vlastní 2-úrovňová navigace pro 6. ročník: předmět → okruh → téma.
 *
 * Stejný princip jako u ročníků 2–5 — čistě display vrstva, RVP pole
 * (`category` / `topic` / `id`) zůstávají beze změny. Každé téma je v právě
 * jednom okruhu, hlídá `src/test/navigation-consistency.test.ts`.
 *
 * **Zakládá se dřív, než je čím naplnit.** Šestka měla při založení 11 témat ze 117
 * a plochý seznam by jim ještě stačil; při 117 už ne. Struktura vzniká teď,
 * aby každá další dávka jen přidala `topicIds` do existujícího okruhu —
 * dodělávat zařazení zpětně u stovky témat je práce navíc a
 * `navigation-consistency.test.ts` by do té doby padal v dávkách.
 *
 * Okruhy sledují RVP `area`, ale pojmenované jsou pro dítě. Nový okruh se
 * zakládá až ve chvíli, kdy do něj něco patří — prázdná dlaždice je horší než
 * žádná (viz `docs/UI_AUDIT.md`, pravidlo o prázdné díře místo prázdného stavu).
 */

import type { SubjectNav } from "../navigation";

export const GRADE6_NAVIGATION: SubjectNav[] = [
  {
    subject: "matematika",
    okruhy: [
      {
        id: "cisla-a-pocitani",
        name: "Čísla a počítání",
        description: "Počítáš s desetinnými čísly a zjistíš, co je čím dělitelné.",
        emoji: "🔢",
        topicIds: [
          "g6-mat-nasobeni-a-deleni-desetinnych-cisel-6",
          "g6-mat-pocetni-operace-desetinna-komplexne-6",
          "g6-mat-znaky-delitelnosti-6",
          "g6-mat-prvocisla-rozklad-6",
          "g6-mat-nsn-nsd-6",
        ],
      },
      {
        id: "geometrie",
        name: "Geometrie",
        description: "Úhly, trojúhelníky, souměrnost a krabice, do kterých se něco vejde.",
        emoji: "📐",
        topicIds: [
          "g6-mat-uhly-druhy-scitani-6",
          "g6-mat-uhel-rysovani-mereni-6",
          "g6-mat-trojuhelniky-uhly-vyska-teznice-6",
          "g6-mat-sit-krychle-a-kvadru-povrch-a-objem-6",
          "g6-mat-osova-stredova-soumernost-6",
        ],
      },
      {
        id: "ulohy-na-premysleni",
        name: "Úlohy na přemýšlení",
        description: "Úlohy bez naučeného postupu, na které stačí selský rozum.",
        emoji: "🧩",
        topicIds: ["g6-mat-logicke-uvahy-kombinacni-usudek-6"],
      },
      {
        id: "tabulky-a-grafy",
        name: "Tabulky a grafy",
        description: "Vyčteš z tabulky i diagramu, co v datech opravdu je.",
        emoji: "📊",
        topicIds: ["g6-mat-tabulky-a-diagramy-6"],
      },
    ],
  },
  {
    subject: "prirodopis",
    okruhy: [
      {
        id: "jak-funguje-zivot",
        name: "Jak funguje život",
        description: "Buňka, mikroskop, třídění organismů a jak se život na Zemi vyvíjel.",
        emoji: "🔬",
        topicIds: [
          "g6-pri-vznik-zeme-podminky-pro-zivot-6",
          "g6-pri-vyvoj-zivota-geologicka-obdobi-6",
          "g6-pri-taxonomicke-skupiny-6",
          "g6-pri-mikroskop-6",
          "g6-pri-stavba-bunky-6",
        ],
      },
      {
        id: "viry-bakterie-prvoci",
        name: "Viry, bakterie a prvoci",
        description: "Nejmenší původci nemocí i užiteční pomocníci, které neuvidíš pouhým okem.",
        emoji: "🦠",
        topicIds: [
          "g6-pri-viry-stavba-vyznam-6",
          "g6-pri-bakterie-6",
          "g6-pri-sinice-vyskyt-vyznam-6",
          "g6-pri-prvoci-zastupci-nemoci-6",
        ],
      },
      {
        id: "houby-a-lisejniky",
        name: "Houby a lišejníky",
        description: "Jak houby žijí, které se dají jíst a proč lišejník není jeden organismus.",
        emoji: "🍄",
        topicIds: [
          "g6-pri-houby-stavba-vyziva-vyznam-6",
          "g6-pri-jedle-a-jedovate-houby-6",
          "g6-pri-lisejniky-symbioza-6",
        ],
      },
      {
        id: "rasy-mechy-kapradiny",
        name: "Řasy, mechy a kapradiny",
        description: "Rostliny bez květů a semen — množí se výtrusy.",
        emoji: "🌿",
        topicIds: [
          "g6-pri-rasy-stavba-zastupci-vyznam-6",
          "g6-pri-mechorosty-zastupci-vyznam-6",
          "g6-pri-kapradorosty-6",
        ],
      },
      {
        id: "zivocichove-bez-patere",
        name: "Živočichové bez páteře",
        description: "Od nezmara přes hlemýždě a žížaly až po hmyz a pavouky.",
        emoji: "🐌",
        topicIds: [
          "g6-pri-zahavci-nezmar-meduza-koraly-6",
          "g6-pri-plostenci-hlisti-6",
          "g6-pri-mekkysi-plzi-mlzi-hlavonozci-6",
          "g6-pri-krouzkovci-zizala-pijavka-6",
          "g6-pri-pavoukovci-pavouci-stiri-klistata-6",
          "g6-pri-korysi-6",
          "g6-pri-hmyz-stavba-tela-druhy-vyvoj-6",
        ],
      },
    ],
  },
  {
    subject: "fyzika",
    okruhy: [
      {
        id: "mereni-velicin",
        name: "Měření a veličiny",
        description: "Změříš délku, hmotnost, objem, čas i teplotu a převedeš jednotky.",
        emoji: "📏",
        topicIds: [
          "g6-fyz-mereni-delky-6",
          "g6-fyz-mereni-hmotnosti-6",
          "g6-fyz-mereni-objemu-6",
          "g6-fyz-mereni-casu-6",
          "g6-fyz-mereni-teploty-6",
          "g6-fyz-hustota-6",
        ],
      },
      {
        id: "latky-a-telesa",
        name: "Z čeho je co",
        description: "Poznáš rozdíl mezi věcí a materiálem, ze kterého je.",
        emoji: "🧱",
        topicIds: [
          "g6-fyz-latka-a-teleso-6",
          "g6-fyz-skupenstvi-latek-6",
          "g6-fyz-atomy-molekuly-6",
          "g6-fyz-pohyb-castic-6",
        ],
      },
      {
        id: "elektrina-a-magnetismus",
        name: "Elektřina a magnety",
        description: "Zjistíš, co se přitahuje, co odpuzuje a proč tě cvakne o kliku.",
        emoji: "⚡",
        topicIds: [
          "g6-fyz-elektricky-naboj-6",
          "g6-fyz-elektricky-obvod-6",
          "g6-fyz-magnety-6",
        ],
      },
    ],
  },
  {
    subject: "dejepis",
    okruhy: [
      {
        id: "jak-se-zkouma-minulost",
        name: "Jak se zkoumá minulost",
        description: "Zjistíš, odkud historici vědí, co se kdysi stalo.",
        emoji: "🔎",
        topicIds: [
          "g6-dej-co-je-dejepis-6",
          "g6-dej-historicke-prameny-6",
          "g6-dej-pomocne-vedy-historicke-6",
          "g6-dej-periodizace-letopocet-6",
        ],
      },
      {
        id: "pravek",
        name: "Pravěk",
        description: "Od prvních lidí přes lovce mamutů až po Kelty a Slovany.",
        emoji: "🦴",
        topicIds: [
          "g6-dej-hominizace-6",
          "g6-dej-doba-kamenna-periodizace-6",
          "g6-dej-neoliticka-revoluce-6",
          "g6-dej-doba-bronzova-zelezna-6",
          "g6-dej-lovci-mamutu-vestonicka-venuse-6",
          "g6-dej-keltove-germani-slovane-6",
        ],
      },
      {
        id: "nejstarsi-staty",
        name: "Nejstarší státy",
        description: "Poznáš, jak žili lidé v Mezopotámii a ve starém Egyptě.",
        emoji: "🏛️",
        topicIds: [
          "g6-dej-mezopotamie-6",
          "g6-dej-staroveky-egypt-6",
          "g6-dej-kultura-staroveky-vychod-6",
        ],
      },
      {
        id: "indie-a-cina",
        name: "Indie a Čína",
        description: "Kasty, Buddhovo učení, Velká čínská zeď i vynález papíru.",
        emoji: "🐉",
        topicIds: ["g6-dej-staroveka-indie-6", "g6-dej-staroveka-cina-6"],
      },
      {
        id: "stare-recko",
        name: "Staré Řecko",
        description: "Athény, Sparta, války s Peršany i řečtí bohové.",
        emoji: "🏺",
        topicIds: [
          "g6-dej-kreta-mykeny-troja-6",
          "g6-dej-recke-mestske-staty-6",
          "g6-dej-recko-perske-valky-peloponeska-valka-6",
          "g6-dej-antika-recko-kultura-6",
        ],
      },
      {
        id: "stary-rim",
        name: "Starý Řím",
        description: "Od založení Říma přes Caesara až po pád západořímské říše.",
        emoji: "🛡️",
        topicIds: [
          "g6-dej-vznik-rima-republika-6",
          "g6-dej-punske-valky-dobyti-stredomori-6",
          "g6-dej-rimske-cisarstvi-6",
          "g6-dej-vznik-sireni-krestanstvi-6",
          "g6-dej-stehovani-narodu-pad-zapadorimske-rise-6",
        ],
      },
    ],
  },
];
