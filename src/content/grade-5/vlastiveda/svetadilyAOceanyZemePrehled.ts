import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1 – jednodušší páry (světadíly a oceány)
const POOL_L1: PracticeTask[] = [
  {
    question: "Spoj světadíl s jeho charakteristikou.",
    correctAnswer: "match",
    pairs: [
      { left: "Asie", right: "Největší světadíl (44 mil. km²)" },
      { left: "Australie", right: "Nejmenší světadíl — zároveň největší ostrov" },
      { left: "Antarktida", right: "Nejjižnější světadíl — pokrytý ledem, bez obyvatel" },
      { left: "Evropa", right: "Druhý nejmenší světadíl — 10 mil. km²" },
    ],
    hints: ["Asie je největší světadíl."],
  },
  {
    question: "Spoj oceán s jeho charakteristikou.",
    correctAnswer: "match",
    pairs: [
      { left: "Tichý oceán", right: "Největší oceán světa" },
      { left: "Atlantský oceán", right: "Mezi Europou/Afrikou a Amerikami" },
      { left: "Indický oceán", right: "Mezi Afrikou, Asií a Austrálií" },
      { left: "Severní Ledový oceán", right: "Nejmenší oceán — u severního pólu" },
    ],
    hints: ["Tichý oceán je největší."],
  },
  {
    question: "Spoj světadíl s kontinentem, kde leží jeho hlavní části.",
    correctAnswer: "match",
    pairs: [
      { left: "Asie", right: "Čína, Indie, Japonsko, Rusko (část)" },
      { left: "Afrika", right: "Egypt, Nigérie, Keňa, Jihoafrická republika" },
      { left: "Severní Amerika", right: "USA, Kanada, Mexiko" },
      { left: "Jižní Amerika", right: "Brazílie, Argentina, Chile, Peru" },
    ],
    hints: ["Čína a Indie jsou v Asii."],
  },
  {
    question: "Spoj světadíl s přibližnou rozlohou v milionech km².",
    correctAnswer: "match",
    pairs: [
      { left: "Asie", right: "44 mil. km²" },
      { left: "Afrika", right: "30 mil. km²" },
      { left: "Severní Amerika", right: "24 mil. km²" },
      { left: "Australie", right: "8 mil. km²" },
    ],
    hints: ["Asie je na prvním místě s 44 mil. km²."],
  },
  {
    question: "Spoj světadíl s tím, co je pro něj typické.",
    correctAnswer: "match",
    pairs: [
      { left: "Antarktida", right: "Leží kolem jižního pólu — 70 % sladké vody v ledu" },
      { left: "Australie", right: "Klokan, Velký korálový útes, osamocená poloha" },
      { left: "Afrika", right: "Sahara, Kilimandžáro, řeka Nil, Safari" },
      { left: "Asie", right: "Himaláje, řeky Jang-c'-ťiang a Ganga, miliardy lidí" },
    ],
    hints: ["Sahara je v Africe."],
  },
  {
    question: "Spoj oceán s jeho polohou.",
    correctAnswer: "match",
    pairs: [
      { left: "Tichý oceán", right: "Mezi Asií/Austrálií a Amerikami" },
      { left: "Atlantský oceán", right: "Mezi Europou/Afrikou a Amerikami" },
      { left: "Indický oceán", right: "Jižně od Asie — mezi Afrikou a Austrálií" },
      { left: "Jižní (Antarktický) oceán", right: "Obklopuje Antarktidu" },
    ],
    hints: ["Tichý oceán je mezi Asií a Amerikou."],
  },
  {
    question: "Spoj světadíl s počtem obyvatel.",
    correctAnswer: "match",
    pairs: [
      { left: "Asie", right: "Nejlidnatější — přes 4,7 miliardy obyvatel" },
      { left: "Afrika", right: "Druhý nejlidnatější — přes 1,4 miliardy" },
      { left: "Evropa", right: "Přibližně 750 milionů obyvatel" },
      { left: "Antarktida", right: "Žádní stálí obyvatelé — jen výzkumníci" },
    ],
    hints: ["Asie je nejlidnatější."],
  },
  {
    question: "Spoj světadíl s příkladem největší země na tomto světadílu.",
    correctAnswer: "match",
    pairs: [
      { left: "Asie", right: "Rusko (část), Čína" },
      { left: "Afrika", right: "Alžírsko (největší země Afriky)" },
      { left: "Jižní Amerika", right: "Brazílie" },
      { left: "Australie/Oceánie", right: "Austrálie" },
    ],
    hints: ["Brazílie je největší zemí Jižní Ameriky."],
  },
  {
    question: "Spoj oceán s jeho přibližnou rozlohou.",
    correctAnswer: "match",
    pairs: [
      { left: "Tichý oceán", right: "~165 mil. km² — největší oceán" },
      { left: "Atlantský oceán", right: "~106 mil. km² — druhý největší" },
      { left: "Indický oceán", right: "~70 mil. km²" },
      { left: "Severní Ledový oceán", right: "~14 mil. km² — nejmenší" },
    ],
    hints: ["Tichý oceán je největší — 165 mil. km²."],
  },
  {
    question: "Spoj světadíl s jeho polohou na Zemi.",
    correctAnswer: "match",
    pairs: [
      { left: "Antarktida", right: "Kolem jižního pólu" },
      { left: "Asie", right: "Severní a východní část Eurasie" },
      { left: "Australie", right: "Jižní polokoule — jihovýchod" },
      { left: "Severní Amerika", right: "Severní polokoule — západ" },
    ],
    hints: ["Antarktida je kolem jižního pólu."],
  },
];

// Level 2 – středně těžké páry
const POOL_L2: PracticeTask[] = [
  {
    question: "Spoj světadíl s nejvyšší horou nebo největší řekou.",
    correctAnswer: "match",
    pairs: [
      { left: "Asie", right: "Everest (8849 m), Jang-c'-ťiang" },
      { left: "Afrika", right: "Kilimandžáro (5895 m), Nil" },
      { left: "Jižní Amerika", right: "Aconcagua (6961 m), Amazonka" },
      { left: "Severní Amerika", right: "Denali (6190 m), Mississippi" },
    ],
    hints: ["Everest je v Asii — Himaláje."],
  },
  {
    question: "Spoj oceán nebo moře s jeho geopolitickým významem.",
    correctAnswer: "match",
    pairs: [
      { left: "Tichý oceán", right: "Největší obchodní trasy — Asie–USA" },
      { left: "Atlantský oceán", right: "Historická obchodní cesta Evropa–Amerika" },
      { left: "Středozemní moře", right: "Historické centrum civilizace — antika" },
      { left: "Severní Ledový oceán", right: "Arktické trasy — strategický zájem o suroviny" },
    ],
    hints: ["Středozemní moře bylo centrem antické civilizace."],
  },
  {
    question: "Spoj světadíl s klimatickým charakterem.",
    correctAnswer: "match",
    pairs: [
      { left: "Antarktida", right: "Nejchladnější — průměr −60 °C" },
      { left: "Afrika", right: "Nejteplotplejší kontinent — Sahara + rovník" },
      { left: "Evropa", right: "Mírné pásmo — 4 roční období" },
      { left: "Asie", right: "Největší klimatická různorodost — tundra až tropiky" },
    ],
    hints: ["Antarktida je nejchladnější."],
  },
  {
    question: "Spoj světadíl s typickými zvířaty.",
    correctAnswer: "match",
    pairs: [
      { left: "Australie", right: "Klokan, koala, platypus, emu" },
      { left: "Afrika", right: "Lev, slon, žirafa, zebra, hroch" },
      { left: "Severní Amerika", right: "Bizon, medvěd grizzly, kojot, jelen" },
      { left: "Antarktida", right: "Tučňák, tuleň, albatros" },
    ],
    hints: ["Tučňáci žijí v Antarktidě."],
  },
  {
    question: "Spoj oceán s typickým proudem nebo jevem.",
    correctAnswer: "match",
    pairs: [
      { left: "Tichý oceán", right: "El Niño — klimatický jev" },
      { left: "Atlantský oceán", right: "Golfský proud — otepluje západ Evropy" },
      { left: "Indický oceán", right: "Monzuny — sezónní větry pro Asii" },
      { left: "Severní Ledový oceán", right: "Tání ledovce — hrozba pro globální klima" },
    ],
    hints: ["Golfský proud teče v Atlantském oceánu."],
  },
  {
    question: "Spoj světadíl s jeho populační hustotou.",
    correctAnswer: "match",
    pairs: [
      { left: "Asie", right: "Nejvyšší hustota — přes 100 lidí/km² v průměru" },
      { left: "Australie", right: "Nejnižší hustota — přibližně 3 lidi/km²" },
      { left: "Evropa", right: "Hustě osídlená — přibližně 75 lidí/km²" },
      { left: "Antarktida", right: "Nula stálých obyvatel" },
    ],
    hints: ["Asie má nejvyšší hustotu obyvatelstva."],
  },
  {
    question: "Spoj geografický jev s světadílem nebo oceánem.",
    correctAnswer: "match",
    pairs: [
      { left: "Sahara", right: "Afrika — největší pouštní oblast světa" },
      { left: "Amazonský prales", right: "Jižní Amerika — největší tropický prales" },
      { left: "Himaláje", right: "Asie — nejvyšší pohoří světa" },
      { left: "Velký korálový útes", right: "Australie — největší korálový útes" },
    ],
    hints: ["Sahara je v Africe."],
  },
  {
    question: "Spoj řeku s světadílem, kde teče.",
    correctAnswer: "match",
    pairs: [
      { left: "Nil", right: "Afrika" },
      { left: "Amazonka", right: "Jižní Amerika" },
      { left: "Jang-c'-ťiang (Yangtze)", right: "Asie (Čína)" },
      { left: "Mississippi", right: "Severní Amerika" },
    ],
    hints: ["Nil teče přes Afriku — přes Egypt do Středozemního moře."],
  },
  {
    question: "Spoj světadíl s průměrnou výškou nad mořem.",
    correctAnswer: "match",
    pairs: [
      { left: "Antarktida", right: "Nejvyšší průměrná výška (~2300 m) — led" },
      { left: "Asie", right: "Nejvyšší pohoří (Himaláje) — průměr ~960 m" },
      { left: "Evropa", right: "Nízká průměrná výška — ~340 m" },
      { left: "Australie", right: "Nejnižší průměr ze všech světadílů — ~330 m" },
    ],
    hints: ["Antarktida má nejvyšší průměrnou výšku díky ledovci."],
  },
  {
    question: "Spoj zvíře nebo jev s světadílem.",
    correctAnswer: "match",
    pairs: [
      { left: "Gorila", right: "Afrika" },
      { left: "Lama", right: "Jižní Amerika (Andy)" },
      { left: "Panda", right: "Asie (Čína)" },
      { left: "Polárka medvěd", right: "Severní Amerka / Arktida" },
    ],
    hints: ["Gorila žije v Africe."],
  },
];

// Level 3 – pokročilé páry
const POOL_L3: PracticeTask[] = [
  {
    question: "Spoj světadíl s jeho geologickým nebo tektonickým charakterem.",
    correctAnswer: "match",
    pairs: [
      { left: "Tichý oceán", right: "Ohnivý prsten — sopky a zemětřesení kolem okraje" },
      { left: "Atlantský oceán", right: "Středoatlantský hřbet — rozpínání desek 2–3 cm/rok" },
      { left: "Asie", right: "Himaláje vznikly srážkou Eurasijské a Indické desky" },
      { left: "Antarktida", right: "Kontinentální deska pod ledovcem — horniny starší 1 mld. let" },
    ],
    hints: ["Himaláje vznikly srážkou tektonických desek."],
  },
  {
    question: "Spoj světadíl s historickým nebo civilizačním faktem.",
    correctAnswer: "match",
    pairs: [
      { left: "Asie", right: "Kolébka prvních civilizací — Mesopotamie, Indus, Huang He" },
      { left: "Afrika", right: "Kolébka lidstva — Homo sapiens poprvé před 200 000 lety" },
      { left: "Evropa", right: "Průmyslová revoluce (18. stol.), kolonialismus" },
      { left: "Amerika", right: "Kolonizace Evropany od 1492 — Kolumbus" },
    ],
    hints: ["Africká savana je kolébkou Homo sapiens."],
  },
  {
    question: "Spoj oceán s důležitou vlastností pro světový obchod.",
    correctAnswer: "match",
    pairs: [
      { left: "Tichý oceán", right: "~50 % světového rybolovu — rybářská velmoc" },
      { left: "Atlantský oceán", right: "Přes 90 % transatlantické komunikace přes podmořské kabely" },
      { left: "Indický oceán", right: "Klíčová trasa ropy z Perského zálivu do Evropy" },
      { left: "Arktický oceán", right: "Severní mořská cesta — nová trasa díky tání ledu" },
    ],
    hints: ["Tichý oceán je největší a nejrybnatější."],
  },
  {
    question: "Spoj světadíl s ekosystémem nebo biómem.",
    correctAnswer: "match",
    pairs: [
      { left: "Asie (jihovýchod)", right: "Tropický deštný prales" },
      { left: "Afrika (střed)", right: "Savana a tropický prales" },
      { left: "Jižní Amerika", right: "Amazonský prales + Andy" },
      { left: "Severní Amerika (sever)", right: "Tajga a tundra" },
    ],
    hints: ["Savana je typická pro střední Afriku."],
  },
  {
    question: "Spoj světadíl nebo region s náboženstvím, které tam dominuje.",
    correctAnswer: "match",
    pairs: [
      { left: "Jižní Asie (Indie)", right: "Hinduismus a buddhismus" },
      { left: "Blízký východ", right: "Islám" },
      { left: "Jižní Amerika", right: "Křesťanství (katolicismus)" },
      { left: "Jihovýchodní Asie (Thajsko, Myanmar)", right: "Buddhismus" },
    ],
    hints: ["Islám dominuje na Blízkém východě."],
  },
  {
    question: "Spoj světadíl s jazykovou skupinou nebo rodinou jazyků.",
    correctAnswer: "match",
    pairs: [
      { left: "Jižní Amerika", right: "Románské jazyky — španělština, portugalština" },
      { left: "Blízký východ a Severní Afrika", right: "Semitské jazyky — arabština, hebrejština" },
      { left: "Austrálie (domorodci)", right: "Austronéské a australské domorodé jazyky" },
      { left: "Subsaharská Afrika", right: "Bantuské a africké rodiny — přes 2000 jazyků" },
    ],
    hints: ["Španělština a portugalština jsou v Jižní Americe."],
  },
  {
    question: "Spoj oceán nebo moře s historicky důležitou trasou nebo událostí.",
    correctAnswer: "match",
    pairs: [
      { left: "Atlantský oceán", right: "Columbus přeplaval 1492 — kontakt Evropy a Ameriky" },
      { left: "Indický oceán", right: "Vasco da Gama 1498 — cesta do Indie kolem Afriky" },
      { left: "Tichý oceán", right: "Magellan 1520 — první obeplutí světa" },
      { left: "Středozemní moře", right: "Fénická a řecká kolonizace antiky" },
    ],
    hints: ["Columbus přeplaval Atlantský oceán."],
  },
  {
    question: "Spoj světadíl s průměrnou teplotou nebo klimatickým pásmem.",
    correctAnswer: "match",
    pairs: [
      { left: "Antarktida", right: "Nejchladnější — průměrná teplota −49 °C" },
      { left: "Afrika (rovník)", right: "Nejteplejší poblíž rovníku — celoroční +25 °C a výše" },
      { left: "Evropa", right: "Mírný pás — −5 °C až +25 °C sezónně" },
      { left: "Severní Amerika (sever)", right: "Subarktická tundra — záporné teploty velkou část roku" },
    ],
    hints: ["Antarktida je nejchladnější."],
  },
  {
    question: "Spoj světadíl s příkladem domorodého obyvatelstva nebo kultury.",
    correctAnswer: "match",
    pairs: [
      { left: "Australie", right: "Aboriginci — nejstarší kultura na světě (~65 000 let)" },
      { left: "Severní Amerika", right: "Indiánské kmeny — Sioux, Apači, Navahové" },
      { left: "Jižní Amerika", right: "Inkové, Mayové (střední Am.), Amazónské kmeny" },
      { left: "Arktida", right: "Inuité (Eskymáci) — přežívají v extrémním chladu" },
    ],
    hints: ["Aboriginci jsou domorodci Austrálie."],
  },
  {
    question: "Spoj oceán s průměrnou hloubkou nebo specifickým místem.",
    correctAnswer: "match",
    pairs: [
      { left: "Tichý oceán", right: "Mariánský příkop — nejhlubší místo Země (11 034 m)" },
      { left: "Atlantský oceán", right: "Puerto Ricský příkop (8376 m)" },
      { left: "Indický oceán", right: "Diamantina (7258 m) u Austrálie" },
      { left: "Severní Ledový oceán", right: "Průměrná hloubka jen 1038 m — nejmělčí oceán" },
    ],
    hints: ["Mariánský příkop je nejhlubší místo Tichého oceánu."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const SVETADILYAOCEANYZEMEPREHLED: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-svetadily-a-oceany-zeme-prehled",
    rvpNodeId: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-svetadily-a-oceany-zeme-prehled",
    title: "Světadíly a oceány Země - přehled",
    studentTitle: "Světadíly a oceány",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Evropa a svět",
    briefDescription: "Poznáš všechny světadíly a oceány naší planety.",
    keywords: ["světadíly", "oceány", "asie", "afrika", "tichý oceán", "atlantský oceán", "antarktida", "australie"],
    goals: [
      "Žák jmenuje 7 světadílů a 5 oceánů",
      "Žák uvede největší a nejmenší světadíl a oceán",
      "Žák umístí světadíly na mapu světa",
    ],
    boundaries: ["Politická geografie světa", "Detailní fyzická geografie kontinentů"],
    gradeRange: [5, 5],
    inputType: "match_pairs",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "7 světadílů: Evropa, Asie, Afrika, SAmr, JAmr, Australie, Antarktida. 5 oceánů: Tichý, Atlantský, Indický, Severní Ledový, Jižní.",
      steps: [
        "7 světadílů: Evropa, Asie, Afrika, Severní Amerika, Jižní Amerika, Australie, Antarktida",
        "5 oceánů: Tichý (největší), Atlantský, Indický, Severní Ledový (nejmenší), Jižní",
        "Největší světadíl: Asie",
        "Nejmenší světadíl: Australie",
      ],
      commonMistake: "Zapomínání Jižního (Antarktického) oceánu — nejnověji uznaný z pěti oceánů.",
      example: "Tichý oceán je největší — pokrývá třetinu povrchu Země.",
    },
  },
];
