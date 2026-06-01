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
    question: "Kolik sousedních zemí má Česká republika?",
    correctAnswer: "4 (Německo, Polsko, Slovensko, Rakousko)",
    options: [
      "4 (Německo, Polsko, Slovensko, Rakousko)",
      "3",
      "5",
      "2",
    ],
    hints: ["Vzpomeň na kompas — západ, sever, východ, jih."],
    solutionSteps: ["ČR sousedí se 4 zeměmi: Německo (Z), Polsko (S), Slovensko (V), Rakousko (J)."],
  },
  {
    question: "Který soused ČR leží na západ?",
    correctAnswer: "Německo",
    options: ["Německo", "Polsko", "Slovensko", "Rakousko"],
    hints: ["Je to největší soused ČR."],
    solutionSteps: ["Německo leží na západ od ČR."],
  },
  {
    question: "Který soused ČR leží na sever?",
    correctAnswer: "Polsko",
    options: ["Polsko", "Německo", "Slovensko", "Rakousko"],
    hints: ["Hranice vede přes Krkonoše a Beskydy."],
    solutionSteps: ["Polsko leží na sever a severovýchod od ČR."],
  },
  {
    question: "Který soused ČR leží na jih?",
    correctAnswer: "Rakousko",
    options: ["Rakousko", "Slovensko", "Německo", "Maďarsko"],
    hints: ["Jejich hlavní město je Vídeň."],
    solutionSteps: ["Rakousko sousedí s ČR na jihu — přes Šumavu a jižní Moravu."],
  },
  {
    question: "Který soused ČR leží na východ?",
    correctAnswer: "Slovensko",
    options: ["Slovensko", "Polsko", "Maďarsko", "Ukrajina"],
    hints: ["Byl to součást Československa."],
    solutionSteps: ["Slovensko sousedí s ČR na východě."],
  },
  {
    question: "Jaká je přibližná populace Německa?",
    correctAnswer: "Přibližně 84 milionů obyvatel",
    options: ["Přibližně 84 milionů", "Přibližně 37 milionů", "Přibližně 9 milionů", "Přibližně 5,5 milionu"],
    hints: ["Je to nejlidnatější soused ČR."],
    solutionSteps: ["Německo má přibližně 84 milionů obyvatel — největší populace ze sousedů ČR."],
  },
  {
    question: "Jaká je přibližná populace Polska?",
    correctAnswer: "Přibližně 37 milionů obyvatel",
    options: ["Přibližně 37 milionů", "Přibližně 84 milionů", "Přibližně 9 milionů", "Přibližně 5,5 milionu"],
    hints: ["Je druhý největší ze sousedů ČR."],
    solutionSteps: ["Polsko má přibližně 37 milionů obyvatel."],
  },
  {
    question: "Kolik členských zemí má EU v roce 2024?",
    correctAnswer: "27",
    options: ["27", "28", "25", "30"],
    hints: ["Velká Británie odešla (Brexit)."],
    solutionSteps: ["Po Brexitu 2020 má EU 27 členských zemí."],
  },
  {
    question: "Jak se nazývá nejmenší stát Evropy?",
    correctAnswer: "Vatikán",
    options: ["Vatikán", "Monaco", "Lichtenštejnsko", "San Marino"],
    hints: ["Leží uvnitř Říma v Itálii."],
    solutionSteps: ["Vatikán je nejmenší stát světa (0,44 km²) — sídlo papeže uvnitř Říma."],
  },
  {
    question: "Ve kterém městě sídlí hlavní instituce EU?",
    correctAnswer: "Brusel (Belgie)",
    options: ["Brusel (Belgie)", "Paříž (Francie)", "Berlín (Německo)", "Štrasburk (Francie)"],
    hints: ["Je to hlavní město Belgie."],
    solutionSteps: ["Komise EU a Rada EU sídlí v Bruselu."],
  },
  {
    question: "Která z těchto zemí je nejmenší ze sousedů ČR?",
    correctAnswer: "Slovensko (~5,5 milionu obyvatel)",
    options: [
      "Slovensko (~5,5 milionu obyvatel)",
      "Německo (~84 milionů)",
      "Polsko (~37 milionů)",
      "Rakousko (~9 milionů)",
    ],
    hints: ["Slovensko bylo součástí ČSR."],
    solutionSteps: ["Slovensko má nejméně obyvatel ze čtyř sousedů ČR — přibližně 5,5 milionu."],
  },
  {
    question: "Jak se nazývá druhá nejmenší republika Evropy po Vatikánu?",
    correctAnswer: "Monaco",
    options: ["Monaco", "Lichtenštejnsko", "San Marino", "Andorra"],
    hints: ["Je na jihu Francie u Středomořského moře."],
    solutionSteps: ["Monaco (2,02 km²) je druhý nejmenší stát v Evropě."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč je Německo nejdůležitější obchodní partner ČR?",
    correctAnswer: "Sdílíme nejdelší hranici, blízkost a silná německá ekonomika je trhem pro české výrobky",
    options: [
      "Sdílíme nejdelší hranici, blízkost a silná německá ekonomika je trhem pro české výrobky",
      "Německo je v NATO a ČR ne",
      "Oba státy mají euro",
      "Česko je součástí Německa",
    ],
    hints: ["Geografická blízkost + ekonomická síla."],
    solutionSteps: ["Německo je největší ekonomika EU a ČR má s Německem nejdelší hranici → přirozený hlavní partner."],
  },
  {
    question: "Proč jsou Polsko a ČR podobné v historii?",
    correctAnswer: "Oba státy byly pod komunistickým režimem, oba vstoupily do NATO a EU ve stejné době",
    options: [
      "Oba státy byly pod komunistickým režimem, oba vstoupily do NATO a EU ve stejné době",
      "Oba státy byly součástí Habsburků vždy",
      "Nemají nic společného",
      "Polsko nikdy nebylo pod komunismem",
    ],
    hints: ["1999 NATO, 2004 EU — společně."],
    solutionSteps: ["ČR a Polsko: oba komunistické satelity, oba vstoupily do NATO 1999 a EU 2004."],
  },
  {
    question: "Co mají Česko a Slovensko společného i po rozdělení v 1993?",
    correctAnswer: "Podobný jazyk, sdílenou historii, členství v EU a NATO",
    options: [
      "Podobný jazyk, sdílenou historii, členství v EU a NATO",
      "Společnou měnu euro",
      "Jednoho prezidenta",
      "Totožné zákony",
    ],
    hints: ["Jazyk, dějiny, aliance."],
    solutionSteps: ["Čeština a slovenština jsou si podobné, sdílíme 75 let společné historie a obě jsme v EU/NATO."],
  },
  {
    question: "Proč jsou malé státy jako Vatikán, Monaco a Lichtenštejnsko možné v Evropě?",
    correctAnswer: "Historicky vznikly jako nezávislá knížectví nebo církevní státy, EU jim dává ochranu",
    options: [
      "Historicky vznikly jako nezávislá knížectví nebo církevní státy, EU jim dává ochranu",
      "Jsou příliš malé na to, aby je někdo obsadil",
      "Jsou to turistické atrakce bez skutečné státnosti",
      "EU je záměrně vytvořila jako nárazníkové státy",
    ],
    hints: ["Vatikán = sídlo papeže, Monaco = knížectví od středověku."],
    solutionSteps: ["Malé státy vznikly historicky a přežily díky diplomatickým dohodám a ochraně větších sousedů."],
  },
  {
    question: "Jak se liší vztahy ČR s Německem dnes od vztahů za druhé světové války?",
    correctAnswer: "Dnes jsou partneři v EU a NATO; za 2. sv. války bylo Německo okupant",
    options: [
      "Dnes jsou partneři v EU a NATO; za 2. sv. války bylo Německo okupant",
      "Vztahy jsou stejné jako vždy",
      "Dnes je Německo nepřítel ČR",
      "ČR a Německo nikdy neměly konflikty",
    ],
    hints: ["Protektorát 1939–1945 vs. EU 2004."],
    solutionSteps: ["Z okupanta (1939–1945) na klíčového spojence v EU a NATO — dramatická proměna za 80 let."],
  },
  {
    question: "Proč Slovensko používá euro a ČR ne, přestože obě vstoupily do EU ve stejný den?",
    correctAnswer: "Slovensko splnilo maastrichtská kritéria a přijalo euro 2009; ČR se rozhodla euro zatím nepřijímat",
    options: [
      "Slovensko splnilo maastrichtská kritéria a přijalo euro 2009; ČR se rozhodla euro zatím nepřijímat",
      "EU Slovensku euro přikázala a ČR zakázala",
      "ČR euro bude mít příští rok",
      "Slovensko je v jiné eurozóně než EU",
    ],
    hints: ["Euro je volbou každého státu splňujícího kritéria."],
    solutionSteps: ["Slovensko přijalo euro 2009; ČR se politicky rozhodla korunu zachovat."],
  },
  {
    question: "Proč je Visegrádská skupina (V4: ČR, Slovensko, Polsko, Maďarsko) důležitá?",
    correctAnswer: "Koordinuje zájmy středoevropských zemí v EU",
    options: [
      "Koordinuje zájmy středoevropských zemí v EU",
      "Je to vojenská aliance nahrazující NATO",
      "Je to skupina zemí s eurem",
      "Je to ekonomická unie oddělená od EU",
    ],
    hints: ["Čtyři sousední státy střední Evropy spolupracují."],
    solutionSteps: ["V4 (1991) = ČR, Slovensko, Polsko, Maďarsko — spolupráce v rámci EU a NATO."],
  },
  {
    question: "Jak Česko využívá svou polohu ve středu Evropy hospodářsky?",
    correctAnswer: "Přepravní uzel pro zboží — Dálnice, železnice, letiště spojující západ a východ EU",
    options: [
      "Přepravní uzel pro zboží — Dálnice, železnice, letiště spojující západ a východ EU",
      "Těžba surovin — Česko má nejvíce ropy v Evropě",
      "Turistika — Česko je nejnavštěvovanější zemí",
      "Poloha není pro ekonomiku důležitá",
    ],
    hints: ["Mysl na tranzitní dopravu."],
    solutionSteps: ["ČR jako 'srdce Evropy' je přirozený dopravní uzel mezi Německem, Polskem, Slovenskem a Rakouskem."],
  },
  {
    question: "Které z těchto zemí nejsou v Evropské unii?",
    correctAnswer: "Norsko, Švýcarsko, Srbsko",
    options: [
      "Norsko, Švýcarsko, Srbsko",
      "Polsko, Slovensko, Maďarsko",
      "Německo, Francie, Itálie",
      "Slovensko, Chorvatsko, Rumunsko",
    ],
    hints: ["Norsko je v NATO ale ne v EU."],
    solutionSteps: ["Norsko a Švýcarsko záměrně odmítly EU; Srbsko kandiduje, ale není členem."],
  },
  {
    question: "Proč má Německo nejsilnější ekonomiku v EU?",
    correctAnswer: "Silný průmysl (auta, stroje, chemie), velká populace a vývoz po celém světě",
    options: [
      "Silný průmysl (auta, stroje, chemie), velká populace a vývoz po celém světě",
      "Německo má nejvíce surovin v Evropě",
      "Německo dostalo nejvíce peněz po 2. světové válce",
      "Jen proto, že je v EU nejdéle",
    ],
    hints: ["BMW, Mercedes, Volkswagen, Siemens, BASF."],
    solutionSteps: ["Německé průmyslové firmy jsou světovými lídry — export technologií, aut a strojů."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď sousední státy ČR podle počtu obyvatel od největšího.",
    correctAnswer: "Německo → Polsko → Rakousko → Slovensko",
    items: [
      "Německo (~84 mil.)",
      "Polsko (~37 mil.)",
      "Rakousko (~9 mil.)",
      "Slovensko (~5,5 mil.)",
    ],
    hints: ["Německo je největší."],
    solutionSteps: ["Německo 84 mil. > Polsko 37 mil. > Rakousko 9 mil. > Slovensko 5,5 mil."],
  },
  {
    question: "Spoj sousední stát s jeho hlavním městem.",
    correctAnswer: "Správné přiřazení",
    pairs: [
      { left: "Německo", right: "Berlín" },
      { left: "Polsko", right: "Varšava" },
      { left: "Slovensko", right: "Bratislava" },
      { left: "Rakousko", right: "Vídeň" },
    ],
    hints: ["Bratislava = Slovensko."],
    solutionSteps: ["Berlín, Varšava, Bratislava, Vídeň — hlavní města sousedů ČR."],
  },
  {
    question: "Proč je EU silnější než každý členský stát sám?",
    correctAnswer: "27 zemí spolu jedná jako blok — větší vliv na obchod, klima a bezpečnost",
    options: [
      "27 zemí spolu jedná jako blok — větší vliv na obchod, klima a bezpečnost",
      "EU má vlastní armádu silnější než USA",
      "Každý stát je silnější sám — EU slabí",
      "EU jen vybírá daně od členů",
    ],
    hints: ["Unie = síla v počtu."],
    solutionSteps: ["EU jako celek má 450 mil. lidí a obří ekonomiku — větší vyjednávací sílu než samotná ČR (10 mil.)."],
  },
  {
    question: "Co mají společného Norsko, Švýcarsko a Velká Británie ve vztahu k EU?",
    correctAnswer: "Nejsou (nebo přestaly být) členy EU, ale úzce s ní spolupracují",
    options: [
      "Nejsou (nebo přestaly být) členy EU, ale úzce s ní spolupracují",
      "Jsou zakládajícími členy EU",
      "Jsou v EU, ale nemají hlasovací právo",
      "Chtějí EU zrušit",
    ],
    hints: ["Brexit = odchod Velké Británie z EU."],
    solutionSteps: ["Norsko + Švýcarsko: v Schengenu a EHP, ale ne v EU. Británie: odešla 2020 (Brexit)."],
  },
  {
    question: "Jak by se lišil život v ČR bez členství v EU?",
    correctAnswer: "Pas na cestu do Německa, cla na zboží, méně zahraničních investic",
    options: [
      "Pas na cestu do Německa, cla na zboží, méně zahraničních investic",
      "Nic by se nezměnilo",
      "ČR by bylo bohatší",
      "Čeština by se stala světovým jazykem",
    ],
    hints: ["Uvažuj o každodenním životě — cestování, nákupy, práce."],
    solutionSteps: ["Bez EU: hranice, cla, obtížnější práce v zahraničí, méně investic — EU přinesla volný trh."],
  },
  {
    question: "Který výrok o sousedech ČR je NEPRAVDIVÝ?",
    correctAnswer: "Slovensko má více obyvatel než Polsko",
    options: [
      "Slovensko má více obyvatel než Polsko",
      "Německo je nejlidnatější soused ČR",
      "Rakousko leží na jihu od ČR",
      "Polsko leží na severu od ČR",
    ],
    hints: ["Polsko má 37 milionů, Slovensko 5,5 milionu."],
    solutionSteps: ["Slovensko (5,5 mil.) má méně obyvatel než Polsko (37 mil.) — tvrzení je nepravdivé."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const EVROPSKESTATYAEUSOUSEDNIZEMECRPODROBNE: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropske-staty-a-eu-sousedni-zeme-cr-podrobne",
    rvpNodeId: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropske-staty-a-eu-sousedni-zeme-cr-podrobne",
    title: "Evropské státy a EU, sousední země ČR podrobně",
    studentTitle: "Sousedé ČR a EU",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Evropa a svět",
    briefDescription: "Poznáš sousedy Česka a jak funguje Evropská unie.",
    keywords: ["sousedé čr", "německo", "polsko", "slovensko", "rakousko", "eu", "vatikán", "monaco"],
    goals: [
      "Žák jmenuje 4 sousední státy ČR a jejich polohu",
      "Žák uvede základní fakta o EU (27 členů, Brusel)",
      "Žák porovná sousedy ČR podle populace",
    ],
    boundaries: ["Detailní ekonomická statistika", "Politická geografie celé Evropy"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "ČR má 4 sousedy: Německo (Z), Polsko (S), Slovensko (V), Rakousko (J).",
      steps: [
        "Západ: Německo (~84 mil.)",
        "Sever: Polsko (~37 mil.)",
        "Východ: Slovensko (~5,5 mil.)",
        "Jih: Rakousko (~9 mil.)",
        "EU: 27 zemí, sídlo v Bruselu",
      ],
      commonMistake: "Záměna polohy Polska (sever) a Slovenska (východ).",
      example: "Německo je největší soused ČR — přibližně 84 milionů obyvatel.",
    },
  },
];
