import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Jak se nazývá nejvyšší hora Evropy?",
    correctAnswer: "Mont Blanc (4808 m)",
    options: ["Mont Blanc (4808 m)", "Elbrus (5642 m)", "Matterhorn (4478 m)", "Grossglockner (3798 m)"],
    hints: ["Leží na hranici Francie a Itálie."],
    solutionSteps: ["Mont Blanc (4808 m) je nejvyšší hora Alp, tedy nejvyšší hora západní Evropy."],
  },
  {
    question: "Jak se nazývá nejdelší řeka Evropy?",
    correctAnswer: "Volha",
    options: ["Volha", "Dunaj", "Rýn", "Labe"],
    hints: ["Teče v Rusku a vlévá se do Kaspického moře."],
    solutionSteps: ["Volha (3531 km) v Rusku je nejdelší evropskou řekou."],
  },
  {
    question: "Jaké moře odděluje Evropu od Afriky?",
    correctAnswer: "Středozemní moře",
    options: ["Středozemní moře", "Severní moře", "Baltské moře", "Černé moře"],
    hints: ["Je uprostřed mezi třemi světadíly."],
    solutionSteps: ["Středozemní moře leží mezi Evropou, Afrikou a Asií."],
  },
  {
    question: "Kde leží hranice mezi Evropou a Asií na východě?",
    correctAnswer: "Pohoří Ural, řeka Ural a Kaspické moře",
    options: [
      "Pohoří Ural, řeka Ural a Kaspické moře",
      "Řeka Volha",
      "Kavkazské pohoří",
      "Řeka Dněpr",
    ],
    hints: ["Ural je pohoří na Ruském území."],
    solutionSteps: ["Hranice Evropy a Asie: hory Ural → řeka Ural → Kaspické moře → Kavkaz."],
  },
  {
    question: "Jaký typ podnebí panuje na jihu Evropy (Španělsko, Itálie, Řecko)?",
    correctAnswer: "Středomořské (suché léto, mírná zima)",
    options: [
      "Středomořské (suché léto, mírná zima)",
      "Atlantické (vlhké, mírné)",
      "Kontinentální (teplé léto, mrazivá zima)",
      "Arktické",
    ],
    hints: ["Charakterizuje ho suché horké léto."],
    solutionSteps: ["Středomořské podnebí = suché horké léto a mírná deštivá zima."],
  },
  {
    question: "Která řeka protéká Prahou?",
    correctAnswer: "Vltava",
    options: ["Vltava", "Labe", "Dunaj", "Morava"],
    hints: ["Je to řeka z Mávy vlasti Smetany."],
    solutionSteps: ["Prahou protéká Vltava, která se u Mělníka vlévá do Labe."],
  },
  {
    question: "Jak se nazývá moře na severu Evropy, které obklopuje Skandinávii?",
    correctAnswer: "Baltské moře",
    options: ["Baltské moře", "Severní moře", "Severní Ledový oceán", "Černé moře"],
    hints: ["Leží mezi Skandinávií, Pobaltím a Polskem."],
    solutionSteps: ["Baltské moře je vnitřní moře severní Evropy — obklopuje Skandinávii ze severu."],
  },
  {
    question: "Jaké pohoří tvoří páteř Evropy uprostřed kontinentu?",
    correctAnswer: "Alpy",
    options: ["Alpy", "Pyreneje", "Karpaty", "Skandinávské hory"],
    hints: ["Jsou v Rakousku, Švýcarsku, Francii a Itálii."],
    solutionSteps: ["Alpy tvoří centrální horský oblouk Evropy — Mont Blanc, Matterhorn."],
  },
  {
    question: "Která Evropská řeka teče z Německa do Holandska a vlévá se do Severního moře?",
    correctAnswer: "Rýn",
    options: ["Rýn", "Dunaj", "Labe", "Seina"],
    hints: ["Proslavila se jako obchodní cesta — lodní doprava."],
    solutionSteps: ["Rýn (1233 km) teče ze Švýcarska přes Německo do Severního moře v Holandsku."],
  },
  {
    question: "Jaký typ podnebí mají Čechy?",
    correctAnswer: "Mírné kontinentální (teplé léto, studená zima)",
    options: [
      "Mírné kontinentální (teplé léto, studená zima)",
      "Středomořské",
      "Arktické",
      "Atlantické",
    ],
    hints: ["Čechy jsou ve středu Evropy, daleko od oceánu."],
    solutionSteps: ["Kontinentální podnebí: teplá léta, chladné zimy, méně srážek než na atlantském pobřeží."],
  },
  {
    question: "Jak se nazývá moře na severozápadě Evropy, které leží mezi Británií a Skandinávií?",
    correctAnswer: "Severní moře",
    options: ["Severní moře", "Baltské moře", "Středozemní moře", "Jaderské moře"],
    hints: ["Spojuje se s Atlantickým oceánem."],
    solutionSteps: ["Severní moře leží mezi Velkou Británií, Norskem, Dánskem, Nizozemskem a Německem."],
  },
  {
    question: "Která řeka je nejdelší v území Evropy mimo Rusko?",
    correctAnswer: "Dunaj",
    options: ["Dunaj", "Rýn", "Labe", "Seina"],
    hints: ["Protéká Vídní, Budapeští a Bělehradem."],
    solutionSteps: ["Dunaj (2860 km) je druhá nejdelší řeka Evropy a protéká 10 státy."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč je Kavkaz také uváděn jako hranice Evropy a Asie?",
    correctAnswer: "Kavkaz navazuje na hranici Ural–Kaspické moře a tvoří přírodní bariéru",
    options: [
      "Kavkaz navazuje na hranici Ural–Kaspické moře a tvoří přírodní bariéru",
      "Kavkaz leží výhradně v Asii",
      "Kavkaz je pouze historická, ne přírodní hranice",
      "Kavkaz odděluje Rusko od Číny",
    ],
    hints: ["Hledej přirozené přírodní bariéry."],
    solutionSteps: ["Ural + Kaspické moře + Kavkaz tvoří dohromady přirozenou hranici Evropy a Asie."],
  },
  {
    question: "Proč má atlantické pobřeží Evropy mírnější zimy než vnitrozemí?",
    correctAnswer: "Atlantický oceán funguje jako tepelný zásobník — ohřívá vzduch v zimě",
    options: [
      "Atlantický oceán funguje jako tepelný zásobník — ohřívá vzduch v zimě",
      "Na atlantickém pobřeží není zima nikdy",
      "Golfský proud chladí pobřeží",
      "Alpy blokují atlantické vzduchové masy",
    ],
    hints: ["Voda si uchovává teplo lépe než pevnina."],
    solutionSteps: ["Oceán drží teplo z léta a v zimě ohřívá přilehlé oblasti → mírnější klima."],
  },
  {
    question: "Jak ovlivňuje středomořské klima zemědělství?",
    correctAnswer: "Suché horké léto nevyhovuje obilí, ale je ideální pro olivy, víno a citrusy",
    options: [
      "Suché horké léto nevyhovuje obilí, ale je ideální pro olivy, víno a citrusy",
      "Středomořské klima je nejlepší pro pěstování obilí",
      "V mediteránní oblasti nelze nic pěstovat",
      "Středomořské klima způsobuje neúrodnou půdu",
    ],
    hints: ["Mysl na tradiční středomořské potraviny."],
    solutionSteps: ["Suché léto favorizuje suchomilné plodiny: olivy, fíky, víno, citrusy."],
  },
  {
    question: "Proč Dunaj protéká 10 státy a Vltava jen jedním?",
    correctAnswer: "Dunaj je mnohem delší (2860 km) a teče nížinou přes více zemí",
    options: [
      "Dunaj je mnohem delší (2860 km) a teče nížinou přes více zemí",
      "Vltava je delší, ale protéká horami",
      "Dunaj byl uměle prodloužen",
      "Vltava je hranična řeka",
    ],
    hints: ["Délka řeky a terén určují, kolika zeměmi protéká."],
    solutionSteps: ["Dunaj 2860 km vs. Vltava 430 km; Dunaj teče Panonskou nížinou — nízký terén umožňuje velkou délku."],
  },
  {
    question: "Jak Alpy ovlivňují klima okolních oblastí?",
    correctAnswer: "Blokují přístup atlantického a středomořského vzduchu do vnitrozemí",
    options: [
      "Blokují přístup atlantického a středomořského vzduchu do vnitrozemí",
      "Způsobují tropické klima v Itálii",
      "Alpy na klima nemají žádný vliv",
      "Alpy srážení přinášejí do vnitrozemí Evropy",
    ],
    hints: ["Pohoří = překážka pro vzduchové masy."],
    solutionSteps: ["Alpy oddělují vlhké atlantické klima severní Evropy od suchého středomořského na jihu."],
  },
  {
    question: "Proč je Kaspické moře moře a ne jezero, přestože je uzavřené?",
    correctAnswer: "Jen historicky — je to slaná uzavřená nádrž = formálně jezero, ale voláme ho mořem",
    options: [
      "Jen historicky — je to slaná uzavřená nádrž = formálně jezero, ale voláme ho mořem",
      "Kaspické moře má spojení s Černým mořem",
      "Kaspické moře se vlévá do oceánu",
      "Je skutečné moře jako Středomoří",
    ],
    hints: ["Kaspické moře je ze všech stran obklopeno pevninou."],
    solutionSteps: ["Kaspické moře je ve skutečnosti největší jezero světa — slaná uzavřená nádrž bez odtoku do oceánu."],
  },
  {
    question: "Jak ovlivňuje Golfský proud klima severozápadní Evropy?",
    correctAnswer: "Ohřívá atlantické pobřeží — Irsko a Norsko mají teplejší zimy, než odpovídá zeměpisné šířce",
    options: [
      "Ohřívá atlantické pobřeží — Irsko a Norsko mají teplejší zimy, než odpovídá zeměpisné šířce",
      "Ochlazuje Skandinávii",
      "Golfský proud přináší srážky do středu Evropy",
      "Golfský proud nemá vliv na Evropu",
    ],
    hints: ["Golfský proud = teplý oceánský proud z Karibiku."],
    solutionSteps: ["Golfský proud přináší teplo z Mexického zálivu podél atlantského pobřeží Evropy."],
  },
  {
    question: "Proč je poloha Evropy výhodná pro zemědělství?",
    correctAnswer: "Mírné klima, dostatok srážek a úrodná půda v nížinách umožňují pěstování obilí i jiných plodin",
    options: [
      "Mírné klima, dostatok srážek a úrodná půda v nížinách umožňují pěstování obilí i jiných plodin",
      "Evropa má suché klima vhodné jen pro kaktusy",
      "Evropa má jen ledovce, zemědělství je nemožné",
      "Příznivé podmínky jsou jen na jihu Evropy",
    ],
    hints: ["Mírné podnebí = ani příliš sucho, ani příliš mrazivo."],
    solutionSteps: ["Mírné klima, dostatek dešťů a úrodná půda (Panonská nížina, severoněmecká nížina) = ideální pro zemědělství."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď řeky Evropy od nejdelší po nejkratší.",
    correctAnswer: "Volha → Dunaj → Rýn → Labe → Vltava",
    items: [
      "Volha (3531 km)",
      "Dunaj (2860 km)",
      "Rýn (1233 km)",
      "Labe (1091 km)",
      "Vltava (430 km)",
    ],
    hints: ["Volha je nejdelší."],
    solutionSteps: ["Volha 3531 > Dunaj 2860 > Rýn 1233 > Labe 1091 > Vltava 430."],
  },
  {
    question: "Spoj typ podnebí s oblastí Evropy.",
    correctAnswer: "Správné přiřazení",
    pairs: [
      { left: "Atlantické", right: "Západ (Irsko, Anglie, Francie)" },
      { left: "Středomořské", right: "Jih (Španělsko, Itálie, Řecko)" },
      { left: "Kontinentální", right: "Střed a východ (ČR, Polsko, Rusko)" },
      { left: "Arktické", right: "Sever (Norsko nad polárním kruhem)" },
    ],
    hints: ["Atlantické = blízko oceánu."],
    solutionSteps: ["Podnebí závisí na vzdálenosti od oceánu a zeměpisné šířce."],
  },
  {
    question: "Proč se říká, že Evropa je 'polostrov polostrovů'?",
    correctAnswer: "Evropa sama je polostrov Eurasie a má mnoho dalších poloostrovů (Skandinávie, Iberský, Balkán)",
    options: [
      "Evropa sama je polostrov Eurasie a má mnoho dalších poloostrovů (Skandinávie, Iberský, Balkán)",
      "Evropa je ostrov oddělený od Asie",
      "Všechny evropské státy jsou ostrovy",
      "Evropa nemá žádné poloostrovy",
    ],
    hints: ["Polostrov = z jedné strany moře, z druhé pevnina."],
    solutionSteps: ["Evropa = záp. polostrov Eurasie; obsahuje poloostrovy: Skandinávie, Iberský, Apeninský, Balkánský."],
  },
  {
    question: "Jak by se změnil český podnebí, kdybychom žili blíže k Atlantiku?",
    correctAnswer: "Zimy by byly mírnější a vlhčí, léta chladnější — jako ve Francii nebo Belgii",
    options: [
      "Zimy by byly mírnější a vlhčí, léta chladnější — jako ve Francii nebo Belgii",
      "Podnebí by bylo tropické",
      "Bylo by více sněhu a větší mrazy",
      "Nic by se nezměnilo",
    ],
    hints: ["Atlantické klima = oceánský vliv."],
    solutionSteps: ["Blíže k Atlantiku = oceánské klima: mírnější zimy, méně extrémní léta, více srážek."],
  },
  {
    question: "Která tvrzení o Alpách jsou správná? Vyber NEJÚPLNĚJŠÍ odpověď.",
    correctAnswer: "Alpy jsou nejvyšší pohoří Evropy, leží ve střední Evropě, nejvyšší hora je Mont Blanc",
    options: [
      "Alpy jsou nejvyšší pohoří Evropy, leží ve střední Evropě, nejvyšší hora je Mont Blanc",
      "Alpy leží jen ve Švýcarsku",
      "Nejvyšší hora Alp je Elbrus",
      "Alpy leží na severu Evropy",
    ],
    hints: ["Alpy se rozkládají v Rakousku, Švýcarsku, Francii, Itálii a dalších zemích."],
    solutionSteps: ["Alpy: střed Evropy, 8 zemí, Mont Blanc 4808 m — nejvyšší hora záp. Evropy."],
  },
  {
    question: "Proč je Středozemní moře strategicky důležité?",
    correctAnswer: "Spojuje tři světadíly a historicky bylo hlavní obchodní cestou Evropy s Asií a Afrikou",
    options: [
      "Spojuje tři světadíly a historicky bylo hlavní obchodní cestou Evropy s Asií a Afrikou",
      "Je to největší moře světa",
      "Nemá žádný strategický význam",
      "Je důležité jen pro turistiku",
    ],
    hints: ["'Středozemní' = uprostřed zemí (Evropy, Asie, Afriky)."],
    solutionSteps: ["Středomoří: centrum antického světa, obchodní cesty, dnes turismus a ropné tanky."],
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
    inputType: "select_one",
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
