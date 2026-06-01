import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1 – jednodušší sekvence (4 události)
const POOL_L1: PracticeTask[] = [
  {
    question: "Seřaď chronologicky osobnosti národního obrození podle roku narození.",
    correctAnswer: "order",
    items: [
      "Josef Jungmann (narozen 1773)",
      "František Palacký (narozen 1798)",
      "Karel Havlíček Borovský (narozen 1821)",
      "Bedřich Smetana (narozen 1824)",
    ],
    hints: ["Jungmann je nejstarší — narozen v roce 1773."],
  },
  {
    question: "Seřaď od nejdřívějšího: Smetanova Má vlast, Havlíčkovy Národní noviny, Jungmannův slovník, Palackého Dějiny.",
    correctAnswer: "order",
    items: [
      "Jungmannův česko-německý slovník (1835–1839)",
      "Palackého Dějiny národu českého (1836–)",
      "Havlíčkovy Národní noviny (1848–)",
      "Smetanova Má vlast (1874–1879)",
    ],
    hints: ["Jungmann vydal slovník jako první."],
  },
  {
    question: "Seřaď čtyři klíčové momenty národního obrození.",
    correctAnswer: "order",
    items: [
      "Počátky obrození — Dobner, Dobrovský (konec 18. stol.)",
      "Jungmannův slovník (1835–1839)",
      "Palackého Dějiny (1836–)",
      "Havlíček deportován do Brixenu (1851)",
    ],
    hints: ["Obrození začalo koncem 18. stol."],
  },
  {
    question: "Seřaď: Dvořák vydává Rusalku, Smetanova Prodaná nevěsta, Jungmannův slovník, Havlíčkovy noviny.",
    correctAnswer: "order",
    items: [
      "Jungmannův slovník (1835–1839)",
      "Smetanova Prodaná nevěsta (1866)",
      "Smetanova Má vlast (1874–1879)",
      "Dvořák vydává Rusalku (1900)",
    ],
    hints: ["Jungmannův slovník přišel jako první."],
  },
  {
    question: "Seřaď: Havlíček v Brixenu, Jungmann vydává slovník, Palacký píše dějiny, Smetana vydává Má vlast.",
    correctAnswer: "order",
    items: [
      "Jungmann vydává slovník (1835–1839)",
      "Palacký píše Dějiny (1836–1867)",
      "Havlíček deportován do Brixenu (1851–1855)",
      "Smetana vydává Má vlast (1874–1879)",
    ],
    hints: ["Jungmannův slovník je nejstarší."],
  },
  {
    question: "Seřaď: Dvořákova Novosvětská symfonie, Jungmannův slovník, Palackého dějiny, Havlíčkovy noviny.",
    correctAnswer: "order",
    items: [
      "Jungmannův slovník (1835–1839)",
      "Palackého Dějiny (1836–)",
      "Havlíčkovy Národní noviny (1848–)",
      "Dvořákova Novosvětská symfonie (1893)",
    ],
    hints: ["Jungmann vydal slovník jako první."],
  },
  {
    question: "Seřaď čtyři klíčové osobnosti obrození v pořadí narozeni.",
    correctAnswer: "order",
    items: [
      "Josef Dobrovský (1753)",
      "Josef Jungmann (1773)",
      "František Palacký (1798)",
      "Karel Havlíček Borovský (1821)",
    ],
    hints: ["Dobrovský je nejstarší — narozen 1753."],
  },
  {
    question: "Seřaď: Palacký odmítá Frankfurt, Jungmannův slovník, Havlíčkovy noviny, Smetanova opera.",
    correctAnswer: "order",
    items: [
      "Jungmannův slovník (1835–1839)",
      "Palacký odmítá frankfurtský parlament (1848)",
      "Havlíčkovy Národní noviny (1848–)",
      "Smetanova Prodaná nevěsta (1866)",
    ],
    hints: ["Jungmannův slovník je nejstarší."],
  },
  {
    question: "Seřaď: Dvořák v New Yorku, Havlíčkovy noviny, Jungmannův slovník, Prodaná nevěsta.",
    correctAnswer: "order",
    items: [
      "Jungmannův slovník (1835–1839)",
      "Havlíčkovy Národní noviny (1848–)",
      "Smetanova Prodaná nevěsta (1866)",
      "Dvořák v New Yorku — Novosvětská (1892–1895)",
    ],
    hints: ["Dvořák byl v New Yorku v 90. letech 19. stol."],
  },
  {
    question: "Seřaď: smrt Smetany, Jungmann vydává slovník, Havlíček v exilu, Palackého dějiny.",
    correctAnswer: "order",
    items: [
      "Jungmann vydává slovník (1835–1839)",
      "Palackého Dějiny národu českého (1836–)",
      "Havlíček deportován do Brixenu (1851)",
      "Smrt Bedřicha Smetany (1884)",
    ],
    hints: ["Jungmann vydal slovník jako první."],
  },
];

// Level 2 – středně těžké sekvence (5 událostí)
const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď chronologicky 5 klíčových milníků národního obrození.",
    correctAnswer: "order",
    items: [
      "Josef Jungmann vydává česko-německý slovník (1835–1839)",
      "František Palacký — Dějiny národu českého (1836–)",
      "Karel Havlíček — Národní noviny (1848–)",
      "Bedřich Smetana — Prodaná nevěsta (1866)",
      "Bedřich Smetana — Má vlast (1874–1879)",
    ],
    hints: ["Jungmannův slovník přišel jako první."],
  },
  {
    question: "Seřaď: Dvořák vydává Rusalku, Smetanova Má vlast, Havlíčkovy noviny, Jungmannův slovník, Palackého dějiny.",
    correctAnswer: "order",
    items: [
      "Jungmannův slovník (1835–1839)",
      "Palackého Dějiny (1836–)",
      "Havlíčkovy Národní noviny (1848–)",
      "Smetanova Má vlast (1874–1879)",
      "Dvořákova Rusalka (1900)",
    ],
    hints: ["Jungmann je nejdříve, Dvořákova Rusalka nejpozději."],
  },
  {
    question: "Seřaď 5 klíčových dat: od počátků obrození po Smetanovu tvorbu.",
    correctAnswer: "order",
    items: [
      "Počátky obrození — Dobrovský (1791 — Dějiny češtiny)",
      "Jungmannův slovník (1835–1839)",
      "Palackého Dějiny (1836–)",
      "Havlíčkovy Národní noviny (1848–)",
      "Smetanova Prodaná nevěsta (1866)",
    ],
    hints: ["Dobrovský byl před Jungmannem."],
  },
  {
    question: "Seřaď: Novosvětská symfonie, Jungmann vydává, Havlíčkovy noviny, Palacký odmítá Frankfurt, Prodaná nevěsta.",
    correctAnswer: "order",
    items: [
      "Jungmannův slovník (1835–1839)",
      "Palacký odmítá frankfurtský parlament (1848)",
      "Havlíčkovy Národní noviny (1848–)",
      "Prodaná nevěsta (1866)",
      "Dvořákova Novosvětská symfonie (1893)",
    ],
    hints: ["Palacký a Havlíček jsou ze stejného období 1848."],
  },
  {
    question: "Seřaď 5 klíčových momentů Smetanova a Dvořákova díla.",
    correctAnswer: "order",
    items: [
      "Smetana vydává Prodanou nevěstu (1866)",
      "Smetana vydává Má vlast (1874–1879)",
      "Dvořák diriguje v New Yorku (1892–1895)",
      "Dvořák vydává Novosvětskou symfonii (1893)",
      "Dvořák vydává Rusalku (1900)",
    ],
    hints: ["Prodaná nevěsta přišla první v 1866."],
  },
  {
    question: "Seřaď: Toleranční patent, Jungmannův slovník, Havlíček v Brixenu, Palackého dějiny, Smetana.",
    correctAnswer: "order",
    items: [
      "Toleranční patent — Josef II. (1781)",
      "Jungmannův slovník (1835–1839)",
      "Palackého Dějiny (1836–)",
      "Havlíček deportován do Brixenu (1851)",
      "Smetana — Prodaná nevěsta (1866)",
    ],
    hints: ["Toleranční patent je nejdříve v roce 1781."],
  },
  {
    question: "Seřaď 5 dat: od Jungmanna po Dvořákovu Rusalku.",
    correctAnswer: "order",
    items: [
      "Jungmannův slovník (1835–1839)",
      "Havlíčkovy noviny zakázány (1850)",
      "Smetana — Prodaná nevěsta (1866)",
      "Smetana — Má vlast (1874–1879)",
      "Dvořák — Rusalka (1900)",
    ],
    hints: ["Noviny byly zakázány v roce 1850."],
  },
  {
    question: "Seřaď: Havlíček zemřel, Jungmann vydával slovník, Palacký odmítá Frankfurt, Smetana — Má vlast, Dvořák v USA.",
    correctAnswer: "order",
    items: [
      "Jungmann vydával slovník (1835–1839)",
      "Palacký odmítá frankfurtský parlament (1848)",
      "Havlíček zemřel (1856)",
      "Smetana — Má vlast (1874–1879)",
      "Dvořák v New Yorku (1892–1895)",
    ],
    hints: ["Havlíček zemřel v roce 1856."],
  },
  {
    question: "Seřaď 5 klíčových dat života Karla Havlíčka Borovského.",
    correctAnswer: "order",
    items: [
      "Havlíček se narodil (1821)",
      "Havlíček vydává Národní noviny (od 1848)",
      "Havlíček deportován do Brixenu (1851)",
      "Havlíček se vrací z exilu (1855)",
      "Havlíček umírá v Praze (1856)",
    ],
    hints: ["Havlíček se narodil v roce 1821."],
  },
  {
    question: "Seřaď 5 klíčových dat: od počátků obrození po Dvořákovu Rusalku.",
    correctAnswer: "order",
    items: [
      "Počátky obrození — Dobrovský (konec 18. stol.)",
      "Jungmannův slovník (1835–1839)",
      "Havlíčkovy Národní noviny (1848–)",
      "Smetana — Prodaná nevěsta (1866)",
      "Dvořák — Rusalka (1900)",
    ],
    hints: ["Od Dobrovského po Dvořákovu Rusalku."],
  },
];

// Level 3 – pokročilé sekvence (5–6 událostí)
const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď 6 klíčových milníků národního obrození od nejdřívějšího.",
    correctAnswer: "order",
    items: [
      "Počátky obrození — Dobrovský vydává Dějiny češtiny (1791)",
      "Josef Jungmann vydává česko-německý slovník (1835–1839)",
      "František Palacký — Dějiny národu českého (1836–)",
      "Karel Havlíček — Národní noviny (1848–)",
      "Bedřich Smetana — Prodaná nevěsta (1866)",
      "Bedřich Smetana — Má vlast (1874–1879)",
    ],
    hints: ["Dobrovský byl na přelomu 18. a 19. stol."],
  },
  {
    question: "Seřaď 6 milníků: od Dobrovského po Dvořákovu Rusalku.",
    correctAnswer: "order",
    items: [
      "Dobrovský — Dějiny češtiny (1791)",
      "Jungmannův slovník (1835–1839)",
      "Palackého Dějiny (1836–)",
      "Havlíček v Brixenu (1851–1855)",
      "Smetana — Má vlast (1874–1879)",
      "Dvořák — Rusalka (1900)",
    ],
    hints: ["Dobrovský je nejdříve, Dvořák nejpozději."],
  },
  {
    question: "Seřaď 6 klíčových dat: od Tolerančního patentu po Dvořákovu Novosvětskou.",
    correctAnswer: "order",
    items: [
      "Toleranční patent (1781)",
      "Dobrovský — Dějiny češtiny (1791)",
      "Jungmannův slovník (1835–1839)",
      "Palackého Dějiny (1836–)",
      "Havlíčkovy Národní noviny (1848–)",
      "Dvořák — Novosvětská symfonie (1893)",
    ],
    hints: ["Toleranční patent je nejdříve."],
  },
  {
    question: "Seřaď 5 klíčových dat osobního života a díla Františka Palackého.",
    correctAnswer: "order",
    items: [
      "Palacký se narodil (1798)",
      "Palacký vydává první svazek Dějin (1836)",
      "Palacký odmítá frankfurtský parlament (1848)",
      "Palacký dokončuje Dějiny (1867)",
      "Palacký umírá (1876)",
    ],
    hints: ["Palacký se narodil v roce 1798."],
  },
  {
    question: "Seřaď 6 klíčových dat: od Jungmanna po Dvořákovu smrt.",
    correctAnswer: "order",
    items: [
      "Jungmannův slovník (1835–1839)",
      "Palackého Dějiny (od 1836)",
      "Havlíčkovy Národní noviny (1848–)",
      "Smetana — Prodaná nevěsta (1866)",
      "Dvořák — Novosvětská (1893)",
      "Dvořák umírá (1904)",
    ],
    hints: ["Dvořák umřel v roce 1904."],
  },
  {
    question: "Seřaď 5 klíčových dat: od počátků obrození po Národní divadlo.",
    correctAnswer: "order",
    items: [
      "Dobrovský — Dějiny češtiny (1791)",
      "Jungmannův slovník (1835–1839)",
      "Palackého Dějiny (1836–)",
      "Smetana — Prodaná nevěsta (1866)",
      "Otevření Národního divadla (1883)",
    ],
    hints: ["Národní divadlo bylo otevřeno v roce 1883."],
  },
  {
    question: "Seřaď 6 klíčových dat: od Bílé hory po konec obrození.",
    correctAnswer: "order",
    items: [
      "Bitva na Bílé hoře — počátek germanizace (1620)",
      "Toleranční patent (1781)",
      "Jungmannův slovník (1835–1839)",
      "Havlíčkovy noviny (1848–)",
      "Smetana — Má vlast (1874–1879)",
      "Vznik Československa (1918)",
    ],
    hints: ["Od Bílé hory po vznik ČSR."],
  },
  {
    question: "Seřaď 5 klíčových dat politického boje za česká práva.",
    correctAnswer: "order",
    items: [
      "Palacký odmítá frankfurtský parlament (1848)",
      "Havlíček deportován za kritiku vlády (1851)",
      "Česko-slovenský kompromis — dualismus (1867)",
      "Česká státoprávní deklarace (1868)",
      "Vznik ČSR (1918)",
    ],
    hints: ["Palacký odmítl Frankfurt v roce 1848."],
  },
  {
    question: "Seřaď 6 klíčových dat Smetanova života.",
    correctAnswer: "order",
    items: [
      "Smetana se narodil (1824)",
      "Smetana vydává Prodanou nevěstu (1866)",
      "Smetana ztratil sluch (1874)",
      "Smetana skládá Má vlast (1874–1879)",
      "Smetana v sanatoriiu (1884)",
      "Smetana umírá (1884)",
    ],
    hints: ["Smetana ztratil sluch v roce 1874."],
  },
  {
    question: "Seřaď 5 klíčových dat: od Jungmanna po otevření Národního divadla.",
    correctAnswer: "order",
    items: [
      "Jungmannův slovník (1835–1839)",
      "Palacký odmítá Frankfurt (1848)",
      "Havlíček umírá (1856)",
      "Smetana — Prodaná nevěsta (1866)",
      "Otevření Národního divadla (1883)",
    ],
    hints: ["Havlíček zemřel v roce 1856."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const NARODNIOBROZENIJUNGMANNPALACKYHAVLICEK: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-narodni-obrozeni-jungmann-palacky-havlicek",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-narodni-obrozeni-jungmann-palacky-havlicek",
    title: "Národní obrození - Jungmann, Palacký, Havlíček",
    studentTitle: "Národní obrození",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Národní obrození a 19. století",
    briefDescription: "Poznáš obrozence, kteří zachránili český jazyk a kulturu.",
    keywords: ["národní obrození", "jungmann", "palacký", "havlíček", "smetana", "dvořák", "čeština"],
    goals: [
      "Žák vysvětlí příčiny a cíle národního obrození",
      "Žák uvede přínosy Jungmanna, Palackého a Havlíčka",
      "Žák propojí kulturní dílo Smetany a Dvořáka s obrozenectvím",
    ],
    boundaries: ["Detailní jazykovědná analýza slovníku", "Hudební teorie"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Jungmann = slovník, Palacký = dějiny, Havlíček = noviny.",
      steps: [
        "Příčina: germanizace po Bílé hoře",
        "Cíl: obnovit češtinu a českou kulturu",
        "Jungmann: slovník (1835–1839)",
        "Palacký: Dějiny národu českého",
        "Havlíček: Národní noviny, satira, exil v Brixenu",
      ],
      commonMistake: "Zaměňování Komenského (17. stol.) s obrozenci (18.–19. stol.).",
      example: "Palacký byl nazýván 'Otcem národa' za jeho historické dílo.",
    },
  },
];
