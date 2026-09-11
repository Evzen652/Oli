import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { chronologie, type Udalost } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a na úrovni jen deset pevných řad. Teď se skládají z banky
// ověřených vynálezů a událostí: L1 tři s datem, L2 čtyři s datem,
// L3 čtyři bez data (pořadí se odvozuje: nejdřív pára, pak elektřina a motor).

const UDALOSTI: Udalost[] = [
  { uroven: 1, co: "James Watt zdokonalil parní stroj", kdy: "1769", klic: 1769.0,
    proc: "Parní stroj začal pohánět továrny, později lokomotivy i lodě." },
  { uroven: 1, co: "Jezdila první veřejná železnice s parní lokomotivou", kdy: "1825", klic: 1825.0927,
    proc: "V Anglii začala vozit uhlí i cestující lokomotiva George Stephensona." },
  { uroven: 1, co: "Otevřena koněspřežná železnice České Budějovice – Linec", kdy: "1832", klic: 1832.0801,
    proc: "Vozy po kolejích u nás zpočátku tahali koně." },
  { uroven: 1, co: "Thomas Edison sestrojil použitelnou žárovku", kdy: "1879", klic: 1879.1,
    proc: "Elektrické světlo začalo nahrazovat plynové lampy a svíčky." },
  { uroven: 1, co: "Bratři Wrightové poprvé vzlétli letadlem s motorem", kdy: "1903", klic: 1903.1217,
    proc: "První řízený let letadla s motorem trval jen dvanáct sekund." },

  { uroven: 2, co: "Prokop Diviš postavil bleskosvod", kdy: "1754", klic: 1754.0,
    proc: "Český farář a vynálezce postavil jeden z prvních bleskosvodů na světě." },
  { uroven: 2, co: "Do Prahy přijel první parní vlak (z Olomouce)", kdy: "1845", klic: 1845.082,
    proc: "Železnice spojila Prahu s Vídní a cesta se zkrátila z dnů na hodiny." },
  { uroven: 2, co: "Alexander Graham Bell představil telefon", kdy: "1876", klic: 1876.0,
    proc: "Telefon umožnil mluvit s lidmi na velkou vzdálenost." },
  { uroven: 1, co: "Carl Benz sestrojil automobil se spalovacím motorem", kdy: "1886", klic: 1886.0,
    proc: "Benzův tříkolový vůz je považován za první automobil." },
  { uroven: 2, co: "František Křižík provozoval v Praze elektrickou tramvaj", kdy: "1891", klic: 1891.0,
    proc: "Na Jubilejní výstavě v Praze jezdila první elektrická tramvaj v Čechách." },
  { uroven: 2, co: "V Kopřivnici vyrobili první automobil ve střední Evropě", kdy: "1897", klic: 1897.0,
    proc: "Vůz Präsident z Kopřivnice stojí na začátku automobilky Tatra." },

  { uroven: 3, co: "Bratři Veverkové vynalezli ruchadlo", kdy: "1827", klic: 1827.0,
    proc: "Nový pluh ruchadlo zrychlil a zlepšil orbu na polích." },
  { uroven: 3, co: "Josef Ressel si nechal patentovat lodní šroub", kdy: "1827", klic: 1827.5,
    proc: "Lodní šroub pohání lodě dodnes." },
  { uroven: 3, co: "Louis Pasteur zachránil očkováním chlapce před vzteklinou", kdy: "1885", klic: 1885.0,
    proc: "Očkování začalo chránit lidi před nemocemi, které dřív končily smrtí." },
  { uroven: 3, co: "Wilhelm Röntgen objevil paprsky X", kdy: "listopad 1895", klic: 1895.1108,
    proc: "Lékaři poprvé viděli dovnitř těla, aniž by ho museli otevřít." },
  { uroven: 3, co: "Bratři Lumièrové uspořádali první veřejné promítání filmu", kdy: "prosinec 1895", klic: 1895.1228,
    proc: "V Paříži se poprvé promítaly filmy za vstupné — začátek kina." },
];

function gen(level: number): PracticeTask[] {
  return chronologie(UDALOSTI, level, "z doby vynálezů a průmyslu");
}

export const PRUMYSLOVAREVOLUCEVEDECKYATECHNICKYPOKROK: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-prumyslova-revoluce-vedecky-a-technicky-pokrok",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-prumyslova-revoluce-vedecky-a-technicky-pokrok",
    title: "Průmyslová revoluce, vědecký a technický pokrok",
    studentTitle: "Průmyslová revoluce",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Národní obrození a 19. století",
    briefDescription: "Poznáš vynálezce a stroje, které změnily svět.",
    keywords: ["průmyslová revoluce", "parní stroj", "watt", "edison", "bell", "benz", "továrna", "železnice"],
    goals: [
      "Žák popíše podstatu průmyslové revoluce",
      "Žák uvede klíčové vynálezy a jejich vynálezce",
      "Žák vysvětlí dopad průmyslové revoluce na společnost",
    ],
    boundaries: ["Detailní technický popis strojů", "Ekonomická teorie"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Pamatuj na čtyři vynálezce a roky: Bell 1876, Edison 1879, Benz 1885, Wright 1903.",
      steps: [
        "Průmyslová revoluce: přechod od ruční výroby k tovární",
        "Klíčový vynález: parní stroj (Watt)",
        "Bell 1876: telefon",
        "Edison 1879: žárovka",
        "Benz 1885: automobil",
        "Wright 1903: letadlo",
      ],
      commonMistake: "Zaměňování roku vynálezu telefonu (1876) a žárovky (1879).",
      example: "Edison vynalezl žárovku roku 1879 — od té doby svítíme v noci.",
    },
  },
];
