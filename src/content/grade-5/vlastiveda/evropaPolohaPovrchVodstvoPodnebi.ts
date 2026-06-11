import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1 – jednodušší páry (hory, řeky, moře)
const POOL_L1: PracticeTask[] = [
  {
    question: "Spoj řeku s jejím ústím nebo mořem, do kterého se vlévá.",
    correctAnswer: "match",
    pairs: [
      { left: "Vltava", right: "vlévá se do Labe u Mělníka" },
      { left: "Labe", right: "vlévá se do Severního moře" },
      { left: "Dunaj", right: "vlévá se do Černého moře" },
      { left: "Volha", right: "vlévá se do Kaspického moře" },
    ],
    hints: ["Vltava teče přes Prahu."],
  },
  {
    question: "Spoj pohoří s jeho nejvyšší horou nebo polohou.",
    correctAnswer: "match",
    pairs: [
      { left: "Alpy", right: "Mont Blanc (4808 m)" },
      { left: "Karpaty", right: "Gerlachovský štít (2655 m)" },
      { left: "Pyreneje", right: "Pico de Aneto (3404 m)" },
      { left: "Skandinávské hory", right: "Galdhøpiggen (2469 m)" },
    ],
    hints: ["Mont Blanc je nejvyšší hora Alp i Evropy."],
  },
  {
    question: "Spoj typ podnebí s oblastí Evropy, kde převládá.",
    correctAnswer: "match",
    pairs: [
      { left: "Středomořské", right: "Španělsko, Itálie, Řecko" },
      { left: "Atlantické", right: "Irsko, Velká Británie, Francie" },
      { left: "Kontinentální", right: "Česko, Polsko, Rusko" },
      { left: "Arktické", right: "Severní Norsko, Skandinávie nad polárním kruhem" },
    ],
    hints: ["Středomořské = suché horké léto."],
  },
  {
    question: "Spoj moře s jeho polohou v Evropě.",
    correctAnswer: "match",
    pairs: [
      { left: "Středozemní moře", right: "Mezi Evropou, Afrikou a Asií na jihu" },
      { left: "Baltské moře", right: "Na severu, mezi Skandinávií a Pobaltím" },
      { left: "Severní moře", right: "Mezi Británií, Norskem a Dánskem" },
      { left: "Černé moře", right: "Na jihovýchodě Evropy, u Turecka" },
    ],
    hints: ["Středozemní moře odděluje Evropu od Afriky."],
  },
  {
    question: "Spoj řeku s délkou nebo charakteristikou.",
    correctAnswer: "match",
    pairs: [
      { left: "Volha", right: "Nejdelší řeka Evropy (3531 km), Rusko" },
      { left: "Dunaj", right: "Druhá nejdelší v Evropě (2860 km), 10 zemí" },
      { left: "Rýn", right: "Velká obchodní řeka (1233 km), Německo → Holandsko" },
      { left: "Vltava", right: "Nejdelší řeka v Čechách (430 km)" },
    ],
    hints: ["Volha je nejdelší — teče v Rusku."],
  },
  {
    question: "Spoj typ podnebí s jeho charakteristickým rysem.",
    correctAnswer: "match",
    pairs: [
      { left: "Středomořské", right: "Suché horké léto, mírná deštivá zima" },
      { left: "Atlantické", right: "Mírné vlhké celoroční počasí" },
      { left: "Kontinentální", right: "Teplé léto, studená zima, méně srážek" },
      { left: "Arktické", right: "Velmi chladné, sníh a led velkou část roku" },
    ],
    hints: ["Atlantické klima ovlivňuje oceán."],
  },
  {
    question: "Spoj horu s horstvem, kam patří.",
    correctAnswer: "match",
    pairs: [
      { left: "Mont Blanc", right: "Alpy" },
      { left: "Pico de Aneto", right: "Pyreneje (Francie/Španělsko)" },
      { left: "Gerlachovský štít", right: "Karpaty (Slovensko)" },
      { left: "Elbrus", right: "Kavkaz (Rusko/Gruzie)" },
    ],
    hints: ["Mont Blanc leží v Alpách na hranici Francie a Itálie."],
  },
  {
    question: "Spoj řeku s hlavním městem, přes které protéká.",
    correctAnswer: "match",
    pairs: [
      { left: "Vltava", right: "Praha" },
      { left: "Dunaj", right: "Vídeň (a Budapešť)" },
      { left: "Temže", right: "Londýn" },
      { left: "Seina", right: "Paříž" },
    ],
    hints: ["Vltava protéká Prahou."],
  },
  {
    question: "Spoj geografický pojem s jeho definicí.",
    correctAnswer: "match",
    pairs: [
      { left: "Nížina", right: "Ploché území do 200 m n. m." },
      { left: "Vrchovina", right: "Zvlněný terén 200–600 m n. m." },
      { left: "Pohoří", right: "Hornatý terén s vrcholy nad 600 m" },
      { left: "Polostrov", right: "Pevnina obklopená mořem ze tří stran" },
    ],
    hints: ["Nížina je nejnižší typ reliéfu."],
  },
  {
    question: "Spoj moře nebo oceán s jeho charakteristikou.",
    correctAnswer: "match",
    pairs: [
      { left: "Středozemní moře", right: "Vnitřní moře — bez přímého spojení s Atlantikem" },
      { left: "Baltské moře", right: "Vnitřní moře — méně slané, obklopuje Skandinávii" },
      { left: "Atlantský oceán", right: "Odděluje Evropu a Ameriku" },
      { left: "Severní Ledový oceán", right: "Nejmenší oceán, u severního pólu" },
    ],
    hints: ["Atlantský oceán odděluje Evropu od Ameriky."],
  },
];

// Level 2 – středně těžké páry (podnebí, geografické pojmy)
const POOL_L2: PracticeTask[] = [
  {
    question: "Spoj zemi nebo oblast s typem podnebí, který ji charakterizuje.",
    correctAnswer: "match",
    pairs: [
      { left: "Norsko (pobřeží)", right: "Atlantické" },
      { left: "Česká republika", right: "Kontinentální" },
      { left: "Španělsko (jih)", right: "Středomořské" },
      { left: "Finsko (Laponsko)", right: "Subarktické / arktické" },
    ],
    hints: ["ČR je ve středu kontinentu."],
  },
  {
    question: "Spoj řeku s zemí nebo zeměmi, přes které převážně teče.",
    correctAnswer: "match",
    pairs: [
      { left: "Rýn", right: "Švýcarsko → Německo → Holandsko" },
      { left: "Dunaj", right: "Německo → Rakousko → Maďarsko → Rumunsko" },
      { left: "Labe", right: "Česká republika → Německo" },
      { left: "Volha", right: "Rusko (Moskevská oblast → Kaspické moře)" },
    ],
    hints: ["Rýn teče přes Německo do Holandska."],
  },
  {
    question: "Spoj poloostrov s jeho polohou v Evropě.",
    correctAnswer: "match",
    pairs: [
      { left: "Skandinávský poloostrov", right: "Sever Evropy — Norsko, Švédsko" },
      { left: "Iberský poloostrov", right: "Jihozápad — Španělsko, Portugalsko" },
      { left: "Apeninský poloostrov", right: "Jih — Itálie" },
      { left: "Balkánský poloostrov", right: "Jihovýchod — Řecko, Chorvatsko, Bulharsko" },
    ],
    hints: ["Skandinávský poloostrov je na severu."],
  },
  {
    question: "Spoj geografický jev s jeho popisem.",
    correctAnswer: "match",
    pairs: [
      { left: "Golfský proud", right: "Teplý oceánský proud — ohřívá západ Evropy" },
      { left: "Ural", right: "Pohoří tvořící hranici Evropy a Asie" },
      { left: "Kaspické moře", right: "Největší jezero světa — uzavřená slaná nádrž" },
      { left: "Kavkaz", right: "Pohoří na jihovýchodní hranici Evropy a Asie" },
    ],
    hints: ["Golfský proud přichází z Karibiku."],
  },
  {
    question: "Spoj zemi s hlavní řekou, která ji protéká.",
    correctAnswer: "match",
    pairs: [
      { left: "Maďarsko", right: "Dunaj" },
      { left: "Holandsko", right: "Rýn" },
      { left: "Rusko", right: "Volha" },
      { left: "Česká republika", right: "Labe (a Vltava)" },
    ],
    hints: ["Dunaj protéká Maďarskem — přes Budapešť."],
  },
  {
    question: "Spoj typ reliéfu s příkladem z Evropy.",
    correctAnswer: "match",
    pairs: [
      { left: "Vysočina", right: "Česká vrchovina (Vysočina)" },
      { left: "Nížina", right: "Panonská nížina (Maďarsko)" },
      { left: "Horský masív", right: "Alpy (Mont Blanc, Matterhorn)" },
      { left: "Ostrov", right: "Velká Británie" },
    ],
    hints: ["Alpy jsou horský masív ve střední Evropě."],
  },
  {
    question: "Spoj klimatický jev s jeho příčinou nebo oblastí výskytu.",
    correctAnswer: "match",
    pairs: [
      { left: "Suchá horká léta", right: "Středomořské podnebí" },
      { left: "Časté deště celoročně", right: "Atlantické podnebí" },
      { left: "Mrazivé zimy, teplá léta", right: "Kontinentální podnebí" },
      { left: "Polární noc", right: "Arktické podnebí" },
    ],
    hints: ["Polární noc je v arktickém podnebí."],
  },
  {
    question: "Spoj horu s výškou v metrech.",
    correctAnswer: "match",
    pairs: [
      { left: "Mont Blanc", right: "4808 m" },
      { left: "Matterhorn", right: "4478 m" },
      { left: "Grossglockner", right: "3798 m" },
      { left: "Sněžka", right: "1603 m" },
    ],
    hints: ["Mont Blanc je nejvyšší."],
  },
  {
    question: "Spoj oceán nebo moře s jeho rozlohou či umístěním.",
    correctAnswer: "match",
    pairs: [
      { left: "Atlantský oceán", right: "Druhý největší oceán — mezi Europou a Amerikou" },
      { left: "Středozemní moře", right: "Vnitřní moře mezi Europou, Afrikou a Asií" },
      { left: "Baltské moře", right: "Méně slané — přítok sladkovodních řek" },
      { left: "Severní moře", right: "Mezi Británií a Skandinávií" },
    ],
    hints: ["Atlantský oceán je druhý největší na světě."],
  },
  {
    question: "Spoj zemi s typem podnebí, který ji charakterizuje.",
    correctAnswer: "match",
    pairs: [
      { left: "Irsko", right: "Atlantické — vlhké, mírné" },
      { left: "Řecko (Atény)", right: "Středomořské — suché léto" },
      { left: "Polsko", right: "Kontinentální — teplé léto, studená zima" },
      { left: "Norsko (sever)", right: "Subarktické — tundra, polární noc" },
    ],
    hints: ["Irsko je na atlantském pobřeží."],
  },
];

// Level 3 – pokročilé páry (složitější vztahy)
const POOL_L3: PracticeTask[] = [
  {
    question: "Spoj řeku s délkou a ústím.",
    correctAnswer: "match",
    pairs: [
      { left: "Volha (3531 km)", right: "Kaspické moře" },
      { left: "Dunaj (2860 km)", right: "Černé moře" },
      { left: "Rýn (1233 km)", right: "Severní moře" },
      { left: "Labe (1091 km)", right: "Severní moře (Cuxhaven)" },
    ],
    hints: ["Volha teče do Kaspického moře."],
  },
  {
    question: "Spoj geografický jev s jeho vysvětlením.",
    correctAnswer: "match",
    pairs: [
      { left: "Říční delta", right: "Větvení řeky před ústím — usazeniny" },
      { left: "Fjord", right: "Úzký záliv vyhloubený ledovcem — Norsko" },
      { left: "Mys", right: "Výběžek pevniny do moře" },
      { left: "Průliv", right: "Úzká vodní plocha mezi dvěma pevninami" },
    ],
    hints: ["Fjordy jsou typické pro Norsko."],
  },
  {
    question: "Spoj pohraničí s horovstvem tvořícím hranici.",
    correctAnswer: "match",
    pairs: [
      { left: "Hranice Španělska a Francie", right: "Pyreneje" },
      { left: "Hranice Evropy a Asie", right: "Ural" },
      { left: "Hranice Čech a Bavorska", right: "Šumava / Český les" },
      { left: "Hranice Čech a Polska", right: "Krkonoše / Jeseníky" },
    ],
    hints: ["Pyreneje oddělují Španělsko od Francie."],
  },
  {
    question: "Spoj typ podnebí s hospodářskou plodinou, která v něm roste.",
    correctAnswer: "match",
    pairs: [
      { left: "Středomořské", right: "Olivy, víno, citrusy" },
      { left: "Kontinentální", right: "Pšenice, brambory, kukuřice" },
      { left: "Atlantické", right: "Obilniny, tráva, pastviny" },
      { left: "Arktické", right: "Tundra — pěstování omezené na minimum" },
    ],
    hints: ["Olivy rostou v mediteránním podnebí."],
  },
  {
    question: "Spoj moře s přilehlou zemí nebo oblastí.",
    correctAnswer: "match",
    pairs: [
      { left: "Jaderské moře", right: "Chorvatsko, Itálie" },
      { left: "Egejské moře", right: "Řecko, Turecko" },
      { left: "Baltské moře", right: "Polsko, Finsko, Estonsko, Lotyšsko" },
      { left: "Barentsovo moře", right: "Norsko, Rusko (Arktida)" },
    ],
    hints: ["Jaderské moře leží vedle Chorvatska."],
  },
  {
    question: "Spoj řeku s jejím zdrojovým pohořím.",
    correctAnswer: "match",
    pairs: [
      { left: "Rýn", right: "Alpy (Švýcarsko)" },
      { left: "Dunaj", right: "Schwarzwald (Německo)" },
      { left: "Vltava", right: "Šumava (ČR)" },
      { left: "Labe", right: "Krkonoše (ČR/Polsko)" },
    ],
    hints: ["Vltava pramení na Šumavě."],
  },
  {
    question: "Spoj klimatický pás s zeměpisnou šířkou, kde se vyskytuje.",
    correctAnswer: "match",
    pairs: [
      { left: "Arktický pás", right: "Nad 66,5° severní šířky" },
      { left: "Mírný pás", right: "Mezi 40° a 66° severní šířky" },
      { left: "Středomořský pás", right: "Kolem 30°–45° severní šířky" },
      { left: "Tropický pás", right: "Mezi obratníky (0°–23,5°)" },
    ],
    hints: ["Arktický pás je nad polárním kruhem — 66,5°."],
  },
  {
    question: "Spoj geografický pojem s příkladem z Evropy.",
    correctAnswer: "match",
    pairs: [
      { left: "Nízká pohoří", right: "Jeseníky, Šumava, Vogézy" },
      { left: "Vysoká pohoří", right: "Alpy, Pyreneje, Kavkaz" },
      { left: "Velká nížina", right: "Severoněmecká, Panonská, Východoevropská" },
      { left: "Polostrov", right: "Iberský, Apeninský, Skandinávský, Balkánský" },
    ],
    hints: ["Alpy jsou vysoká pohoří."],
  },
  {
    question: "Spoj zemědělskou plodinu s podnebím, kde se jí daří.",
    correctAnswer: "match",
    pairs: [
      { left: "Olivy", right: "Středomořské" },
      { left: "Pšenice ozimá", right: "Kontinentální" },
      { left: "Brambory", right: "Chladnější kontinentální a atlantické" },
      { left: "Rýže", right: "Teplé a vlhké (Španělsko, Itálie — Pád)" },
    ],
    hints: ["Olivy jsou typicky středomořská plodina."],
  },
  {
    question: "Spoj pohoří s zemí nebo zeměmi, kde leží.",
    correctAnswer: "match",
    pairs: [
      { left: "Alpy", right: "Francie, Švýcarsko, Itálie, Rakousko" },
      { left: "Pyreneje", right: "Francie, Španělsko, Andorra" },
      { left: "Karpaty", right: "Slovensko, Polsko, Česko, Rumunsko" },
      { left: "Skandinávské hory", right: "Norsko, Švédsko" },
    ],
    hints: ["Alpy jsou v srdci Evropy — Francie, Itálie, Švýcarsko, Rakousko."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const EVROPAPOLOHAPOVRCHVODSTVOPODNEBI: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropa-poloha-povrch-vodstvo-podnebi",
    rvpNodeId: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropa-poloha-povrch-vodstvo-podnebi",
    title: "Evropa - poloha, povrch, vodstvo, podnebí",
    studentTitle: "Evropa — příroda",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Evropa a svět",
    briefDescription: "Poznáš hory, řeky a klima Evropy.",
    keywords: ["evropa", "alpy", "mont blanc", "volha", "dunaj", "středomořské", "atlantické", "podnebí"],
    goals: [
      "Žák popíše polohu Evropy a její hranice",
      "Žák uvede hlavní pohoří a řeky Evropy",
      "Žák rozliší typy podnebí v Evropě",
    ],
    boundaries: ["Podrobná fyzická geografie", "Detailní klimatologie"],
    gradeRange: [5, 5],
    inputType: "match_pairs",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Mont Blanc = nejvyšší hora Evropy (4808 m). Volha = nejdelší řeka (3531 km).",
      steps: [
        "Hranice Evropy: Ural → Kaspické moře → Kavkaz",
        "Nejvyšší hora: Mont Blanc 4808 m (Alpy)",
        "Nejdelší řeka: Volha (3531 km)",
        "Typy podnebí: atlantické (Z), středomořské (J), kontinentální (S/V)",
      ],
      commonMistake: "Záměna Volhy (nejdelší) a Dunaje (druhá nejdelší — ale protéká více zeměmi).",
      example: "Středomořské klima: suché horké léto a mírná deštivá zima.",
    },
  },
];
