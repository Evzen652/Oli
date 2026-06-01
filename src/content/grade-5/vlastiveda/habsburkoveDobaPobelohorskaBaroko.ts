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
    question: "Seřaď chronologicky: bitva na Bílé hoře, příchod Habsburků, smrt Komenského, defenestrace.",
    correctAnswer: "order",
    items: [
      "Příchod Habsburků — Ferdinand I. (1526)",
      "Pražská defenestrace — vzpoura šlechty (1618)",
      "Bitva na Bílé hoře (1620)",
      "Smrt Jana Amose Komenského (1670)",
    ],
    hints: ["Ferdinand I. přišel v roce 1526."],
  },
  {
    question: "Seřaď od nejdřívějšího: rekatolizace, bitva na Bílé hoře, Komenský v exilu, příchod Habsburků.",
    correctAnswer: "order",
    items: [
      "Příchod Habsburků — Ferdinand I. (1526)",
      "Bitva na Bílé hoře (1620)",
      "Rekatolizace — protestanté musí přestoupit (po 1620)",
      "Komenský v exilu — umírá v Holandsku (1670)",
    ],
    hints: ["Komenský zemřel v roce 1670."],
  },
  {
    question: "Seřaď: Komenský vydal Orbis Pictus, bitva na Bílé hoře, defenestrace, poprava 27 pánů.",
    correctAnswer: "order",
    items: [
      "Defenestrace (1618)",
      "Bitva na Bílé hoře (1620)",
      "Poprava 27 předních pánů na Staroměstském náměstí (1621)",
      "Komenský vydává Orbis Pictus (1658)",
    ],
    hints: ["Defenestrace spustila vzpouru."],
  },
  {
    question: "Seřaď: Habsburkové na trůně, česká stavovská vzpoura, bitva na Bílé hoře, exil Komenského.",
    correctAnswer: "order",
    items: [
      "Habsburkové na českém trůně (1526)",
      "Česká stavovská vzpoura (1618)",
      "Bitva na Bílé hoře (1620)",
      "Komenský odchází do exilu (asi 1628)",
    ],
    hints: ["Komenský odešel do exilu až po Bílé hoře."],
  },
  {
    question: "Seřaď čtyři klíčové momenty doby pobělohorské.",
    correctAnswer: "order",
    items: [
      "Bitva na Bílé hoře (1620)",
      "Staroměstská exekuce — poprava 27 pánů (1621)",
      "Rekatolizace a germanizace českých zemí (po 1621)",
      "Komenský vydává Didaktiku Magna (1657)",
    ],
    hints: ["Exekuce přišla rok po Bílé hoře."],
  },
  {
    question: "Seřaď: bitva u Moháče, bitva na Bílé hoře, defenestrace, příchod Ferdinanda I.",
    correctAnswer: "order",
    items: [
      "Bitva u Moháče — zánik Jagellonců (1526)",
      "Ferdinand I. Habsburský na českém trůně (1526)",
      "Defenestrace — vzpoura české šlechty (1618)",
      "Bitva na Bílé hoře (1620)",
    ],
    hints: ["Bitva u Moháče umožnila Habsburkům nastoupit."],
  },
  {
    question: "Seřaď: smrt Komenského, bitva na Bílé hoře, poprava 27 pánů, příchod Habsburků.",
    correctAnswer: "order",
    items: [
      "Příchod Habsburků (1526)",
      "Bitva na Bílé hoře (1620)",
      "Poprava 27 pánů (1621)",
      "Smrt Komenského (1670)",
    ],
    hints: ["Habsburkové přišli v roce 1526."],
  },
  {
    question: "Seřaď: Komenský vydává Orbis Pictus, defenestrace, Komenský v exilu, příchod Habsburků.",
    correctAnswer: "order",
    items: [
      "Příchod Habsburků (1526)",
      "Defenestrace (1618)",
      "Komenský odchází do exilu (asi 1628)",
      "Komenský vydává Orbis Pictus (1658)",
    ],
    hints: ["Komenský šel do exilu po Bílé hoře."],
  },
  {
    question: "Seřaď čtyři klíčové momenty příchodu Habsburků a jejich upevnění moci.",
    correctAnswer: "order",
    items: [
      "Bitva u Moháče — zánik Jagellonců (1526)",
      "Ferdinand I. přijímá českou korunu (1526)",
      "Vzpoura české šlechty (1618)",
      "Bitva na Bílé hoře — Habsburkové vítězí (1620)",
    ],
    hints: ["Bitva u Moháče umožnila Habsburkům nastoupit."],
  },
  {
    question: "Seřaď: Komenský odchází ze Lešna do Anglie, bitva na Bílé hoře, Komenský umírá, defenestrace.",
    correctAnswer: "order",
    items: [
      "Defenestrace (1618)",
      "Bitva na Bílé hoře (1620)",
      "Komenský odchází ze Lešna do Anglie (1641)",
      "Komenský umírá v Amsterdamu (1670)",
    ],
    hints: ["Komenský navštívil Anglii v roce 1641."],
  },
];

// Level 2 – středně těžké sekvence (5 událostí)
const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď chronologicky 5 klíčových událostí doby habsburské a pobělohorské.",
    correctAnswer: "order",
    items: [
      "Příchod Habsburků — Ferdinand I. (1526)",
      "Česká stavovská vzpoura — defenestrace (1618)",
      "Bitva na Bílé hoře (1620)",
      "Poprava 27 pánů na Staroměstském náměstí (1621)",
      "Smrt Jana Amose Komenského (1670)",
    ],
    hints: ["Příchod Habsburků byl absolutně první v roce 1526."],
  },
  {
    question: "Seřaď: Komenský vydává Orbis Pictus, poprava 27 pánů, příchod Habsburků, bitva na Bílé hoře, defenestrace.",
    correctAnswer: "order",
    items: [
      "Příchod Habsburků (1526)",
      "Defenestrace (1618)",
      "Bitva na Bílé hoře (1620)",
      "Poprava 27 pánů (1621)",
      "Komenský vydává Orbis Pictus (1658)",
    ],
    hints: ["Poprava 27 pánů přišla rok po Bílé hoře."],
  },
  {
    question: "Seřaď 5 klíčových momentů exilu a díla Komenského.",
    correctAnswer: "order",
    items: [
      "Komenský odchází do Lešna (Polsko) po Bílé hoře (asi 1628)",
      "Komenský v Anglii — jednání o reformě vzdělání (1641)",
      "Komenský ve Švédsku — vzdělávací projekty (1642–1648)",
      "Komenský vydává Orbis Pictus (1658)",
      "Komenský umírá v Amsterdamu (1670)",
    ],
    hints: ["Komenský odešel nejprve do Polska."],
  },
  {
    question: "Seřaď: rekatolizace, Orbis Pictus, bitva na Bílé hoře, příchod Habsburků, poprava 27 pánů.",
    correctAnswer: "order",
    items: [
      "Příchod Habsburků (1526)",
      "Bitva na Bílé hoře (1620)",
      "Poprava 27 pánů (1621)",
      "Rekatolizace — nucený přechod ke katolicismu (po 1621)",
      "Orbis Pictus (1658)",
    ],
    hints: ["Příchod Habsburků je absolutně první."],
  },
  {
    question: "Seřaď 5 klíčových dat od vzpoury šlechty po smrt Komenského.",
    correctAnswer: "order",
    items: [
      "Defenestrace — start vzpoury (1618)",
      "Bitva na Bílé hoře — porážka šlechty (1620)",
      "Staroměstská exekuce — poprava 27 pánů (1621)",
      "Komenský vydává Didaktiku Magna (1657)",
      "Smrt Komenského (1670)",
    ],
    hints: ["Defenestrace spustila vzpouru."],
  },
  {
    question: "Seřaď: germanizace a rekatolizace, bitva na Bílé hoře, Habsburkové na trůně, defenestrace, Komenský v exilu.",
    correctAnswer: "order",
    items: [
      "Habsburkové na českém trůně (1526)",
      "Defenestrace (1618)",
      "Bitva na Bílé hoře (1620)",
      "Germanizace a rekatolizace (po 1620)",
      "Komenský v exilu píše pedagogická díla (1628–1670)",
    ],
    hints: ["Habsburkové nastoupili v roce 1526."],
  },
  {
    question: "Seřaď: smrt Komenského, poprava 27 pánů, defenestrace, příchod Habsburků, bitva na Bílé hoře.",
    correctAnswer: "order",
    items: [
      "Příchod Habsburků (1526)",
      "Defenestrace (1618)",
      "Bitva na Bílé hoře (1620)",
      "Poprava 27 pánů (1621)",
      "Smrt Komenského (1670)",
    ],
    hints: ["Přechod od roku 1526 do 1670."],
  },
  {
    question: "Seřaď 5 milníků od bitvy u Moháče po pobělohorské temno.",
    correctAnswer: "order",
    items: [
      "Bitva u Moháče (1526)",
      "Ferdinand I. na českém trůně (1526)",
      "Česká stavovská vzpoura (1618)",
      "Bitva na Bílé hoře (1620)",
      "Pobělohorská rekatolizace a germanizace (1620–)",
    ],
    hints: ["Obě události v roce 1526 jsou historicky propojené."],
  },
  {
    question: "Seřaď: Komenský umírá, defenestrace, bitva u Moháče, Orbis Pictus, Bílá hora.",
    correctAnswer: "order",
    items: [
      "Bitva u Moháče (1526)",
      "Defenestrace (1618)",
      "Bitva na Bílé hoře (1620)",
      "Orbis Pictus (1658)",
      "Komenský umírá (1670)",
    ],
    hints: ["Bitva u Moháče je nejstarší událost."],
  },
  {
    question: "Seřaď 5 klíčových dat: poprava 27 pánů, Komenský v Amsterdamu, Bílá hora, defenestrace, Habsburkové.",
    correctAnswer: "order",
    items: [
      "Habsburkové na českém trůně (1526)",
      "Defenestrace — start vzpoury (1618)",
      "Bitva na Bílé hoře (1620)",
      "Poprava 27 pánů (1621)",
      "Komenský v Amsterdamu — poslední léta (1656–1670)",
    ],
    hints: ["Habsburkové jsou nejstarší."],
  },
];

// Level 3 – pokročilé sekvence (5–6 událostí)
const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď 6 klíčových událostí od příchodu Habsburků po smrt Komenského.",
    correctAnswer: "order",
    items: [
      "Příchod Habsburků — Ferdinand I. (1526)",
      "Česká stavovská vzpoura — defenestrace (1618)",
      "Bitva na Bílé hoře (1620)",
      "Poprava 27 pánů na Staroměstském náměstí (1621)",
      "Komenský vydává Orbis Pictus (1658)",
      "Smrt Jana Amose Komenského (1670)",
    ],
    hints: ["Od roku 1526 po rok 1670."],
  },
  {
    question: "Seřaď 6 milníků od bitvy u Moháče po pobělohorskou germanizaci.",
    correctAnswer: "order",
    items: [
      "Bitva u Moháče — zánik Jagellonců (1526)",
      "Ferdinand I. na českém trůně (1526)",
      "Defenestrace — vzpoura šlechty (1618)",
      "Bitva na Bílé hoře (1620)",
      "Poprava 27 pánů (1621)",
      "Germanizace a rekatolizace (po 1621)",
    ],
    hints: ["Bitva u Moháče umožnila nástup Habsburků."],
  },
  {
    question: "Seřaď 6 klíčových dat doby pobělohorské a barokní.",
    correctAnswer: "order",
    items: [
      "Bitva na Bílé hoře (1620)",
      "Poprava 27 pánů (1621)",
      "Komenský v exilu v Lešně (asi 1628)",
      "Komenský vydává Didaktiku Magna (1657)",
      "Komenský vydává Orbis Pictus (1658)",
      "Smrt Komenského (1670)",
    ],
    hints: ["Od Bílé hory do Komesnkého smrti."],
  },
  {
    question: "Seřaď 5 klíčových dat exilu Komenského ve správném pořadí.",
    correctAnswer: "order",
    items: [
      "Komenský v Lešně — Polsko (1628–1641)",
      "Komenský v Anglii — přednáší o vzdělání (1641)",
      "Komenský v Elbingu — Švédsko (1642–1648)",
      "Komenský vydává Orbis Pictus v Norimberku (1658)",
      "Komenský umírá v Amsterdamu (1670)",
    ],
    hints: ["Komenský putoval Lešno → Anglie → Švédsko → Amsterdam."],
  },
  {
    question: "Seřaď 6 milníků od příchodu Habsburků po upadnutí češtiny.",
    correctAnswer: "order",
    items: [
      "Ferdinand I. na českém trůně (1526)",
      "Česká stavovská vzpoura (1618)",
      "Bitva na Bílé hoře (1620)",
      "Staroměstská exekuce (1621)",
      "Komenský odchází do exilu (asi 1628)",
      "Němčina nahrazuje češtinu v úřadech (po 1627)",
    ],
    hints: ["Němčina nahradila češtinu po roce 1627."],
  },
  {
    question: "Seřaď 6 klíčových dat: od bitvy na Bílé hoře po národní obrození.",
    correctAnswer: "order",
    items: [
      "Bitva na Bílé hoře (1620)",
      "Rekatolizace a exil protestantů (po 1620)",
      "Smrt Komenského (1670)",
      "Vláda Habsburků — barokní kultura (17.–18. stol.)",
      "Reformy Josefa II. — toleranční patent (1781)",
      "Počátky národního obrození (konec 18. stol.)",
    ],
    hints: ["Od Bílé hory po přelom 18. a 19. stol."],
  },
  {
    question: "Seřaď 5 milníků: Habsburkové upevňují moc po Bílé hoře.",
    correctAnswer: "order",
    items: [
      "Bitva na Bílé hoře (1620)",
      "Poprava 27 pánů — konec šlechtické opozice (1621)",
      "Obnovené zřízení zemské — absolutní moc Habsburků (1627)",
      "Němčina jako úřední jazyk (1627)",
      "Komenský v exilu — pokračování českého ducha (1628–)",
    ],
    hints: ["Obnovené zřízení zemské upevnilo Habsburky v roce 1627."],
  },
  {
    question: "Seřaď 6 dat od vzpoury šlechty po konec barokní éry.",
    correctAnswer: "order",
    items: [
      "Defenestrace (1618)",
      "Bitva na Bílé hoře (1620)",
      "Poprava 27 pánů (1621)",
      "Orbis Pictus (1658)",
      "Smrt Komenského (1670)",
      "Stavba kostela sv. Mikuláše — vrchol baroka (1703–1755)",
    ],
    hints: ["Kostel sv. Mikuláše byl postaven od 1703."],
  },
  {
    question: "Seřaď 5 klíčových dat spojených s Ferdinandem I. a jeho nástupci.",
    correctAnswer: "order",
    items: [
      "Ferdinand I. na trůně (1526)",
      "Maxmilián II. — ústupky protestantům (1564–1576)",
      "Rudolf II. — zlatý věk Prahy (1583–1611)",
      "Vzpoura šlechty za Ferdinanda II. (1618)",
      "Bitva na Bílé hoře — Ferdinand II. vítězí (1620)",
    ],
    hints: ["Ferdinand I. byl první, bitva na Bílé hoře za Ferdinanda II."],
  },
  {
    question: "Seřaď 6 milníků: od Bílé hory po Josefovy reformy.",
    correctAnswer: "order",
    items: [
      "Bitva na Bílé hoře (1620)",
      "Rekatolizace — exil protestantů (po 1620)",
      "Smrt Komenského (1670)",
      "Vláda Karla VI. — pragmatická sankce (1713)",
      "Marie Terezie nastupuje na trůn (1740)",
      "Toleranční patent Josefa II. (1781)",
    ],
    hints: ["Toleranční patent byl v roce 1781."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const HABSBURKOVEDOBAPOBELOHORSKABAROKO: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-habsburkove-doba-pobelohorska-baroko",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-habsburkove-doba-pobelohorska-baroko",
    title: "Habsburkové, doba pobělohorská, baroko",
    studentTitle: "Habsburkové a baroko",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Novověk - habsburská monarchie",
    briefDescription: "Poznáš Habsburky, bitvu na Bílé hoře a barokní styl.",
    keywords: ["habsburkové", "bílá hora", "baroko", "komenský", "rekatolizace", "jezuité"],
    goals: [
      "Žák vysvětlí příchod Habsburků na český trůn",
      "Žák popíše důsledky bitvy na Bílé hoře",
      "Žák charakterizuje barokní styl a jeho roli",
      "Žák zná dílo a osud J. A. Komenského",
    ],
    boundaries: [
      "Detailní vojenská taktika bitev",
      "Genealogie Habsburků",
      "Podrobná teologie reformace",
    ],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Vzpomeň si na rok 1620 — bitva na Bílé hoře změnila Čechy.",
      steps: [
        "1526: Habsburkové přišli na český trůn",
        "1620: Bílá hora — porážka české šlechty",
        "Po 1620: rekatolizace, exil protestantů, baroko",
        "Komenský: Učitel národů v exilu",
      ],
      commonMistake: "Zaměňování bitvy u Moháče (1526) a bitvy na Bílé hoře (1620).",
      example: "Komenský napsal Orbis Pictus — první ilustrovanou učebnici světa.",
    },
  },
];
