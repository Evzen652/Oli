import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1 – jednodušší sekvence (4 události / vynálezy)
const POOL_L1: PracticeTask[] = [
  {
    question: "Seřaď vynálezce a jejich vynálezy od nejstaršího.",
    correctAnswer: "order",
    items: [
      "James Watt — parní stroj (~1769)",
      "Alexander Graham Bell — telefon (1876)",
      "Thomas Edison — žárovka (1879)",
      "Karl Benz — automobil (1885)",
    ],
    hints: ["Parní stroj je nejstarší vynález."],
  },
  {
    question: "Seřaď od nejdřívějšího: letadlo bratří Wrightů, žárovka, telefon, parní stroj.",
    correctAnswer: "order",
    items: [
      "Parní stroj (Watt, ~1769)",
      "Telefon (Bell, 1876)",
      "Žárovka (Edison, 1879)",
      "Letadlo (Wright, 1903)",
    ],
    hints: ["Parní stroj je nejstarší — ze 18. stol."],
  },
  {
    question: "Seřaď čtyři klíčové etapy průmyslové revoluce.",
    correctAnswer: "order",
    items: [
      "Vznik manufaktur — přechodné stadium (17.–18. stol.)",
      "Wattův parní stroj — zahájení průmyslové revoluce (~1769)",
      "Rozmach železnic v Anglii (1825–1850)",
      "Elektřina a chemický průmysl (po 1870)",
    ],
    hints: ["Manufaktury předcházely parnímu stroji."],
  },
  {
    question: "Seřaď: automobil, parní stroj, žárovka, letadlo.",
    correctAnswer: "order",
    items: [
      "Parní stroj (Watt, ~1769)",
      "Žárovka (Edison, 1879)",
      "Automobil (Benz, 1885)",
      "Letadlo (Wright, 1903)",
    ],
    hints: ["Parní stroj je ze 18. stol."],
  },
  {
    question: "Seřaď: průmyslová revoluce v Čechách, průmyslová revoluce v Anglii, vznik železnic, žárovka.",
    correctAnswer: "order",
    items: [
      "Průmyslová revoluce začíná v Anglii (pol. 18. stol.)",
      "Vznik železnic — první parní lokomotiva (1804)",
      "Průmyslová revoluce se šíří do Čech (1830–1860)",
      "Žárovka (Edison, 1879)",
    ],
    hints: ["Průmyslová revoluce začala v Anglii."],
  },
  {
    question: "Seřaď: telefon, parní stroj, letadlo, automobil.",
    correctAnswer: "order",
    items: [
      "Parní stroj (Watt, ~1769)",
      "Telefon (Bell, 1876)",
      "Automobil (Benz, 1885)",
      "Letadlo (Wright, 1903)",
    ],
    hints: ["Parní stroj je nejstarší ze všech."],
  },
  {
    question: "Seřaď čtyři klíčové milníky vývoje dopravy.",
    correctAnswer: "order",
    items: [
      "Parní lokomotivy nahrazují koňský pohon (pol. 19. stol.)",
      "Automobil — Benz (1885)",
      "Letadlo — Wright (1903)",
      "Masová výroba aut — Ford (1913)",
    ],
    hints: ["Lokomotivy předcházely automobilu."],
  },
  {
    question: "Seřaď: Thomas Edison, James Watt, bratři Wrightové, Alexander Graham Bell — podle roku vynálezu.",
    correctAnswer: "order",
    items: [
      "James Watt — parní stroj (~1769)",
      "Alexander Graham Bell — telefon (1876)",
      "Thomas Edison — žárovka (1879)",
      "Wright bratři — letadlo (1903)",
    ],
    hints: ["Watt je ze 18. stol."],
  },
  {
    question: "Seřaď: Liberec textilním centrem, průmyslová revoluce v Anglii, žárovka, automobil.",
    correctAnswer: "order",
    items: [
      "Průmyslová revoluce v Anglii (pol. 18. stol.)",
      "Liberec se stává textilním centrem (pol. 19. stol.)",
      "Žárovka (Edison, 1879)",
      "Automobil (Benz, 1885)",
    ],
    hints: ["Průmyslová revoluce v Anglii je nejdříve."],
  },
  {
    question: "Seřaď: vznik železnic, parní stroj, telefon, letadlo.",
    correctAnswer: "order",
    items: [
      "Parní stroj (Watt, ~1769)",
      "Vznik železnic (Stephenson, 1825)",
      "Telefon (Bell, 1876)",
      "Letadlo (Wright, 1903)",
    ],
    hints: ["Parní stroj je nejstarší."],
  },
];

// Level 2 – středně těžké sekvence (5 vynálezů)
const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď chronologicky 5 klíčových vynálezů průmyslové revoluce.",
    correctAnswer: "order",
    items: [
      "Parní stroj (Watt, ~1769)",
      "Telefon (Bell, 1876)",
      "Žárovka (Edison, 1879)",
      "Automobil (Benz, 1885)",
      "Letadlo (Wright, 1903)",
    ],
    hints: ["Parní stroj je ze 18. stol., letadlo ze začátku 20. stol."],
  },
  {
    question: "Seřaď 5 klíčových momentů průmyslové revoluce od začátku v Anglii po Čechy.",
    correctAnswer: "order",
    items: [
      "Průmyslová revoluce začíná v Anglii (pol. 18. stol.)",
      "Wattův parní stroj (1769)",
      "Stephenson — parní lokomotiva (1825)",
      "Průmyslová revoluce se šíří do Čech — Liberec (1830–1860)",
      "Žárovka — elektřina mění výrobu (1879)",
    ],
    hints: ["Průmyslová revoluce začala v Anglii v pol. 18. stol."],
  },
  {
    question: "Seřaď: letadlo, automobil, parní stroj, žárovka, telefon.",
    correctAnswer: "order",
    items: [
      "Parní stroj (Watt, ~1769)",
      "Telefon (Bell, 1876)",
      "Žárovka (Edison, 1879)",
      "Automobil (Benz, 1885)",
      "Letadlo (Wright, 1903)",
    ],
    hints: ["Parní stroj je nejstarší."],
  },
  {
    question: "Seřaď 5 klíčových milníků rozvoje dopravy v 19.–20. stol.",
    correctAnswer: "order",
    items: [
      "Parní lokomotivy — první železnice (1825)",
      "Pařížská metro — první podzemní dráha (1863)",
      "Automobil (Benz, 1885)",
      "Letadlo (Wright, 1903)",
      "Masová výroba aut — Ford Model T (1908)",
    ],
    hints: ["Železnice předcházejí automobilu."],
  },
  {
    question: "Seřaď 5 klíčových dat: od průmyslové revoluce v Anglii po první auto.",
    correctAnswer: "order",
    items: [
      "Průmyslová revoluce začíná v Anglii (~1760)",
      "Wattův parní stroj (1769)",
      "Vznik první železnice (Stephenson, 1825)",
      "Telefon (Bell, 1876)",
      "Automobil (Benz, 1885)",
    ],
    hints: ["Průmyslová revoluce začala kolem roku 1760."],
  },
  {
    question: "Seřaď: Ford masová výroba, telefon, žárovka, automobil, letadlo.",
    correctAnswer: "order",
    items: [
      "Telefon (Bell, 1876)",
      "Žárovka (Edison, 1879)",
      "Automobil (Benz, 1885)",
      "Letadlo (Wright, 1903)",
      "Ford — masová výroba aut (1913)",
    ],
    hints: ["Telefon přišel jako první z těchto pěti."],
  },
  {
    question: "Seřaď 5 klíčových dat elektrifikace a moderní techniky.",
    correctAnswer: "order",
    items: [
      "Telegraf — Samuel Morse (1837)",
      "Telefon (Bell, 1876)",
      "Žárovka (Edison, 1879)",
      "Radiové vlny — Marconi (1895)",
      "Letadlo (Wright, 1903)",
    ],
    hints: ["Telegraf přišel jako první."],
  },
  {
    question: "Seřaď: Benz, Edison, Bell, Watt, Wright — podle roku vynálezu.",
    correctAnswer: "order",
    items: [
      "Watt — parní stroj (~1769)",
      "Bell — telefon (1876)",
      "Edison — žárovka (1879)",
      "Benz — automobil (1885)",
      "Wright — letadlo (1903)",
    ],
    hints: ["Watt je ze 18. stol."],
  },
  {
    question: "Seřaď 5 klíčových milníků v Čechách za průmyslové revoluce.",
    correctAnswer: "order",
    items: [
      "Josefovy reformy — zrušení nevolnictví, dělníci do měst (1781)",
      "Liberec — centrum textilního průmyslu (1830–1850)",
      "Vznik parní železnice v ČR (Praha–Drážďany, 1851)",
      "Rozmach strojírenství v Praze a Plzni (pol. 19. stol.)",
      "Elektrifikace průmyslu v Čechách (po 1880)",
    ],
    hints: ["Josefovy reformy přišly jako první."],
  },
  {
    question: "Seřaď 5 klíčových dat: od textilní revoluce po letadlo.",
    correctAnswer: "order",
    items: [
      "Textilní revoluce — mechanické tkalcovské stavy (po 1760)",
      "Parní stroj (Watt, 1769)",
      "Železnice (Stephenson, 1825)",
      "Telefon (Bell, 1876)",
      "Letadlo (Wright, 1903)",
    ],
    hints: ["Textilní revoluce předcházela parnímu stroji."],
  },
];

// Level 3 – pokročilé sekvence (5–6 položek)
const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď 6 klíčových vynálezů průmyslové revoluce od nejstaršího.",
    correctAnswer: "order",
    items: [
      "Parní stroj (Watt, ~1769)",
      "Parní lokomotiva (Stephenson, 1825)",
      "Telefon (Bell, 1876)",
      "Žárovka (Edison, 1879)",
      "Automobil (Benz, 1885)",
      "Letadlo (Wright, 1903)",
    ],
    hints: ["Parní stroj je ze 18. stol., letadlo ze začátku 20. stol."],
  },
  {
    question: "Seřaď 6 milníků průmyslové revoluce: od Anglie po masovou výrobu.",
    correctAnswer: "order",
    items: [
      "Průmyslová revoluce v Anglii (~1760)",
      "Wattův parní stroj (1769)",
      "Vznik železnic (Stephenson, 1825)",
      "Telefon (Bell, 1876)",
      "Automobil (Benz, 1885)",
      "Ford — masová výroba aut (1913)",
    ],
    hints: ["Průmyslová revoluce v Anglii je nejdříve."],
  },
  {
    question: "Seřaď 6 klíčových dat vývoje komunikace a dopravy.",
    correctAnswer: "order",
    items: [
      "Telegraf (Morse, 1837)",
      "Telefon (Bell, 1876)",
      "Žárovka — elektrické světlo (Edison, 1879)",
      "Automobil (Benz, 1885)",
      "Radiové vlny (Marconi, 1895)",
      "Letadlo (Wright, 1903)",
    ],
    hints: ["Telegraf přišel v roce 1837."],
  },
  {
    question: "Seřaď 5 klíčových milníků průmyslu v českých zemích.",
    correctAnswer: "order",
    items: [
      "Zrušení nevolnictví — dělníci se stěhují do měst (1781)",
      "Liberec — centrum textilního průmyslu (1830–1850)",
      "První parní vlak Vídeň–Brno (1839)",
      "Rozmach Škodovky v Plzni (po 1860)",
      "Elektrifikace průmyslu v Čechách (po 1880)",
    ],
    hints: ["Zrušení nevolnictví otevřelo cestu průmyslu."],
  },
  {
    question: "Seřaď 6 milníků průmyslové revoluce a vědecko-technického pokroku.",
    correctAnswer: "order",
    items: [
      "Průmyslová revoluce začíná v Anglii (~1760)",
      "Parní stroj (1769)",
      "Železnice (1825)",
      "Telefon (1876)",
      "Automobil (1885)",
      "Letadlo (1903)",
    ],
    hints: ["Průmyslová revoluce začala kolem 1760."],
  },
  {
    question: "Seřaď 6 klíčových dat: od parního stroje po Fordovu masovou výrobu.",
    correctAnswer: "order",
    items: [
      "Parní stroj (Watt, ~1769)",
      "Parní lokomotiva (Stephenson, 1825)",
      "Telegraf (Morse, 1837)",
      "Telefon (Bell, 1876)",
      "Letadlo (Wright, 1903)",
      "Masová výroba aut (Ford, 1913)",
    ],
    hints: ["Parní stroj je nejstarší."],
  },
  {
    question: "Seřaď 5 klíčových dat spojeních s Thomasem Edisonem a elektrifikací.",
    correctAnswer: "order",
    items: [
      "Edison patentuje žárovku (1879)",
      "Edison otevírá první elektrárnu v New Yorku (1882)",
      "Tesla — střídavý proud (1887)",
      "Elektrifikace Prahy (1891)",
      "Elektrické tramvaje v českých městech (konec 19. stol.)",
    ],
    hints: ["Edison patentoval žárovku v roce 1879."],
  },
  {
    question: "Seřaď 6 milníků od průmyslové revoluce v Anglii po 1. světovou válku.",
    correctAnswer: "order",
    items: [
      "Průmyslová revoluce v Anglii (~1760)",
      "Parní stroj (1769)",
      "Železnice (1825)",
      "Automobil (1885)",
      "Letadlo (1903)",
      "1. světová válka — průmysl ve válečné výrobě (1914–1918)",
    ],
    hints: ["1. světová válka je nejpozději."],
  },
  {
    question: "Seřaď 5 klíčových dat vývoje dopravy v 19. a 20. stol.",
    correctAnswer: "order",
    items: [
      "Parní lokomotiva (Stephenson, 1825)",
      "Parní lodě přes Atlantik (pol. 19. stol.)",
      "Automobil (Benz, 1885)",
      "Letadlo (Wright, 1903)",
      "Transatlantický let (Lindbergh, 1927)",
    ],
    hints: ["Parní lokomotiva přišla jako první."],
  },
  {
    question: "Seřaď 6 milníků průmyslové revoluce: od Anglie po druhou průmyslovou revoluci.",
    correctAnswer: "order",
    items: [
      "První průmyslová revoluce — textil, pára (1760–1840)",
      "Rozmach železnic (1825–1870)",
      "Druhá průmyslová revoluce — elektřina a chemie (po 1870)",
      "Telefon (1876)",
      "Žárovka (1879)",
      "Automobil (1885)",
    ],
    hints: ["Druhá průmyslová revoluce přišla po roce 1870."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
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
    contentType: "static",
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
