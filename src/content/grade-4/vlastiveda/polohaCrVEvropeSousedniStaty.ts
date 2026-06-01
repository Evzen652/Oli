import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Ve které části Evropy leží Česká republika?",
    correctAnswer: "Ve střední Evropě",
    options: ["Ve střední Evropě", "Na jihu Evropy", "Na severu Evropy", "Na východě Evropy"],
    hints: ["ČR neleží ani na okraji, ani uprostřed kontinentu — je to střed."],
    solutionSteps: ["Česká republika leží ve střední Evropě."],
  },
  {
    question: "Jaké je hlavní město České republiky?",
    correctAnswer: "Praha",
    options: ["Praha", "Brno", "Ostrava", "Plzeň"],
    hints: ["Hlavní město je sídlo vlády a parlamentu."],
    solutionSteps: ["Hlavní město ČR je Praha."],
  },
  {
    question: "Se kterými státy sousedí Česká republika?",
    correctAnswer: "Německo, Polsko, Slovensko, Rakousko",
    options: [
      "Německo, Polsko, Slovensko, Rakousko",
      "Německo, Francie, Itálie, Polsko",
      "Slovensko, Maďarsko, Rakousko, Švýcarsko",
      "Polsko, Rusko, Finsko, Německo",
    ],
    hints: ["ČR má 4 sousední státy."],
    solutionSteps: ["ČR sousedí s Německem (západ/severozápad), Polskem (sever), Slovenskem (východ) a Rakouskem (jih)."],
  },
  {
    question: "Který sousední stát ČR leží na západ a severozápad?",
    correctAnswer: "Německo",
    options: ["Německo", "Polsko", "Slovensko", "Rakousko"],
    hints: ["Nejlidnatější stát sousedící s ČR."],
    solutionSteps: ["Na západ a severozápad od ČR leží Německo."],
  },
  {
    question: "Který sousední stát ČR leží na severu a severovýchodě?",
    correctAnswer: "Polsko",
    options: ["Polsko", "Německo", "Slovensko", "Maďarsko"],
    hints: ["Tento sousední stát je největší ze sousedů ČR."],
    solutionSteps: ["Na severu a severovýchodě sousedí ČR s Polskem."],
  },
  {
    question: "Který sousední stát ČR leží na východě?",
    correctAnswer: "Slovensko",
    options: ["Slovensko", "Maďarsko", "Polsko", "Rakousko"],
    hints: ["Tento stát byl dříve s ČR jednou zemí."],
    solutionSteps: ["Na východě sousedí ČR se Slovenskem — dříve byly jedním státem (Československo)."],
  },
  {
    question: "Který sousední stát ČR leží na jihu?",
    correctAnswer: "Rakousko",
    options: ["Rakousko", "Slovensko", "Maďarsko", "Itálie"],
    hints: ["Tento stát leží jižně od Jihočeského a Jihomoravského kraje."],
    solutionSteps: ["Na jihu sousedí ČR s Rakouskem."],
  },
  {
    question: "Jaká je přibližná rozloha ČR?",
    correctAnswer: "78 866 km²",
    options: ["78 866 km²", "9 000 km²", "550 000 km²", "200 000 km²"],
    hints: ["ČR je středně velká evropská země."],
    solutionSteps: ["ČR má rozlohu přibližně 78 866 km²."],
  },
  {
    question: "Kolik obyvatel má ČR přibližně?",
    correctAnswer: "Přibližně 10,9 milionu",
    options: ["Přibližně 10,9 milionu", "Přibližně 5 milionů", "Přibližně 20 milionů", "Přibližně 80 milionů"],
    hints: ["ČR je středně lidnatý stát."],
    solutionSteps: ["ČR má přibližně 10,9 milionu obyvatel."],
  },
  {
    question: "Je ČR přímořský stát?",
    correctAnswer: "Ne, ČR je vnitrozemský stát bez přístupu k moři",
    options: [
      "Ne, ČR je vnitrozemský stát bez přístupu k moři",
      "Ano, má přístup k Jadranskému moři",
      "Ano, leží u Baltského moře",
      "Ano, má přístup k Severnímu moři",
    ],
    hints: ["Podívej se na mapu ČR — je všude obklopena souší."],
    solutionSteps: ["ČR je vnitrozemský stát — nemá žádné pobřeží ani přístup k moři."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jaká jsou 4 největší města ČR?",
    correctAnswer: "Praha, Brno, Ostrava, Plzeň",
    options: [
      "Praha, Brno, Ostrava, Plzeň",
      "Praha, Liberec, Olomouc, Hradec Králové",
      "Praha, Ústí nad Labem, Pardubice, Zlín",
      "Praha, Brno, Karlovy Vary, Jihlava",
    ],
    hints: ["Největší po Praze je Brno — centrum Moravy."],
    solutionSteps: ["Největší města ČR jsou Praha, Brno, Ostrava a Plzeň."],
  },
  {
    question: "Do kterého moře odtéká řeka Vltava (přes Labe)?",
    correctAnswer: "Do Severního moře",
    options: ["Do Severního moře", "Do Černého moře", "Do Baltského moře", "Do Středozemního moře"],
    hints: ["Labe teče přes Německo do tohoto moře."],
    solutionSteps: ["Vltava ústí do Labe v Mělníku a Labe odtéká přes Německo do Severního moře."],
  },
  {
    question: "Do kterého moře odtéká řeka Morava (přes Dunaj)?",
    correctAnswer: "Do Černého moře",
    options: ["Do Černého moře", "Do Severního moře", "Do Baltského moře", "Do Jaderského moře"],
    hints: ["Dunaj teče na jihovýchod přes Rumunsko."],
    solutionSteps: ["Morava ústí do Dunaje a Dunaj odtéká do Černého moře."],
  },
  {
    question: "Co je to rozvodí (hlavní evropské rozvodí)?",
    correctAnswer: "Linie, která odděluje, kam vody tečou — na západ do Severního nebo na jih do Černého moře",
    options: [
      "Linie, která odděluje, kam vody tečou — na západ do Severního nebo na jih do Černého moře",
      "Hranice mezi Čechami a Moravou",
      "Státní hranice ČR",
      "Linie spojující nejvyšší hory ČR",
    ],
    hints: ["Rozvodí je jako střecha — voda stéká na jednu nebo druhou stranu."],
    solutionSteps: ["Hlavní evropské rozvodí prochází ČR — vody na západ tečou do Severního moře, na jih do Černého moře."],
  },
  {
    question: "Proč je ČR důležitou tranzitní zemí v Evropě?",
    correctAnswer: "Leží ve středu Evropy a protínají ji důležité dopravní trasy",
    options: [
      "Leží ve středu Evropy a protínají ji důležité dopravní trasy",
      "Má velký přístav",
      "Je největší zemí Evropy",
      "Vyrábí nejvíce automobilů",
    ],
    hints: ["Střed Evropy = křižovatka tras."],
    solutionSteps: ["ČR leží ve středu Evropy, proto jí prochází důležité silniční, železniční a letecké trasy."],
  },
  {
    question: "Jak se ČR jmenovala dříve, před rokem 1993?",
    correctAnswer: "Československo – Česká a Slovenská Federativní Republika",
    options: [
      "Československo – Česká a Slovenská Federativní Republika",
      "Český stát",
      "Království Čechy",
      "Moravsko-Česká republika",
    ],
    hints: ["ČR a Slovensko se rozdělily v roce 1993."],
    solutionSteps: ["Před rokem 1993 byl společný stát s názvem Československo — k 'sametovému rozvodu' došlo 1. 1. 1993."],
  },
  {
    question: "Ve které světové organizaci je ČR členem od roku 2004?",
    correctAnswer: "Evropská unie – EU",
    options: ["Evropská unie – EU", "NATO – ale to je od 1999", "OSN – ale to je od 1945", "ASEAN"],
    hints: ["V roce 2004 vstoupilo do EU 10 nových zemí z východní Evropy."],
    solutionSteps: ["ČR vstoupila do Evropské unie 1. 5. 2004."],
  },
  {
    question: "Kde leží ČR z hlediska zeměpisné šířky — v tropech, mírném nebo arktickém pásmu?",
    correctAnswer: "V mírném pásmu",
    options: ["V mírném pásmu", "V tropickém pásmu", "V arktickém pásmu", "V subtropickém pásmu"],
    hints: ["ČR leží přibližně mezi 48° a 51° severní šířky."],
    solutionSteps: ["ČR leží v mírném pásmu severní polokoule — přibližně 50° severní šířky."],
  },
  {
    question: "Jaký jazyk je úřední jazyk v ČR?",
    correctAnswer: "Čeština",
    options: ["Čeština", "Slovenština", "Němčina", "Polština"],
    hints: ["ČR = Česká republika → jazyk?"],
    solutionSteps: ["Úředním jazykem ČR je čeština."],
  },
  {
    question: "Jak se jmenuje měna používaná v ČR?",
    correctAnswer: "Česká koruna – Kč",
    options: ["Česká koruna – Kč", "Euro – €", "Dolar – $", "Forint – Ft"],
    hints: ["ČR nepoužívá euro."],
    solutionSteps: ["V ČR platíme českou korunou (Kč). ČR není v eurozóně."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Proč ČR říkáme 'střecha Evropy'?",
    correctAnswer: "Většina řek odtéká od ČR do různých moří — ČR leží na hlavním evropském rozvodí",
    options: [
      "Většina řek odtéká od ČR do různých moří — ČR leží na hlavním evropském rozvodí",
      "ČR má nejvyšší hory v Evropě",
      "ČR leží na nejvyšším místě Evropy",
      "Z ČR vidíš celou Evropu",
    ],
    hints: ["Rozvodí = místo odkud voda stéká na různé strany."],
    solutionSteps: ["ČR leží na hlavním evropském rozvodí — vody tečou od ní do Severního, Černého i Baltského moře."],
  },
  {
    question: "Jaká je výhoda i nevýhoda toho, že ČR je vnitrozemský stát?",
    correctAnswer: "Výhoda: bezpečí; nevýhoda: žádné moře, drahší námořní doprava",
    options: [
      "Výhoda: bezpečí; nevýhoda: žádné moře, drahší námořní doprava",
      "Výhoda: levnější námořní doprava; nevýhoda: žádné hory",
      "Vnitrozemský stát nemá žádné nevýhody",
      "Výhoda: teplejší klima; nevýhoda: sucha",
    ],
    hints: ["Zamysli se nad tím, co přináší přístup k moři."],
    solutionSteps: ["Vnitrozemská poloha = žádné záplavy od oceánu, ale vše musíme přepravovat přes jiné státy k moři."],
  },
  {
    question: "Jak se jmenoval stát zahrnující Čechy a Moravu v době habsburské monarchie?",
    correctAnswer: "Českomoravské království v rámci Rakouska-Uherska",
    options: [
      "Českomoravské království v rámci Rakouska-Uherska",
      "Velká Morava",
      "Království Čechy",
      "Přemyslovská dynastie",
    ],
    hints: ["Habsburci vládli od roku 1526."],
    solutionSteps: ["České a moravské země byly součástí Habsburské monarchie (Rakouska-Uherska) od roku 1526 do 1918."],
  },
  {
    question: "Proč Slovensko a ČR tvoří kulturně blízké státy i po rozdělení v roce 1993?",
    correctAnswer: "Po 75 let – 1918–1993 tvořily jeden stát — Československo",
    options: [
      "Po 75 let – 1918–1993 tvořily jeden stát — Československo",
      "Mají stejný jazyk",
      "Leží na stejném území",
      "Sdílejí stejnou měnu",
    ],
    hints: ["Vzpomeň si na Czechoslovakia — kdy vznikla a kdy se rozdělila?"],
    solutionSteps: ["ČR a Slovensko sdílely 75 let společných dějin v Československu (1918–1993) — blízká kultura, jazyk i dějiny."],
  },
  {
    question: "Na které světové straně od ČR leží Německo?",
    correctAnswer: "Na západ a severozápad",
    options: ["Na západ a severozápad", "Na sever", "Na jihovýchod", "Na jih"],
    hints: ["Německo je největší soused ČR."],
    solutionSteps: ["Německo leží na západ a severozápad od ČR — sdílejí dlouhou hranici přes Krušné hory a Šumavu."],
  },
  {
    question: "Proč bylo Brno historicky důležitým centrem Moravy?",
    correctAnswer: "Brno bylo sídlem moravského markraběte a centrem obchodu",
    options: [
      "Brno bylo sídlem moravského markraběte a centrem obchodu",
      "Brno leží u moře",
      "Brno bylo hlavním městem ČR do roku 1945",
      "Brno bylo středověkou pevností proti Turkům",
    ],
    hints: ["Markrabě Moravy sídlil v Brně."],
    solutionSteps: ["Brno bylo historickým centrem Moravy jako sídlo markraběte a obchodní křižovatka."],
  },
  {
    question: "Jaký vliv má poloha ČR ve střední Evropě na její hospodářství?",
    correctAnswer: "Usnadňuje obchod a spolupráci s Německem, Polskem, Rakouskem a Slovenskem",
    options: [
      "Usnadňuje obchod a spolupráci s Německem, Polskem, Rakouskem a Slovenskem",
      "ČR je příliš malá na zahraniční obchod",
      "Středoevropská poloha ztěžuje export",
      "ČR závisí jen na vnitřním trhu",
    ],
    hints: ["ČR leží uprostřed sousedů — tranzit a obchod jsou snadné."],
    solutionSteps: ["Centrální poloha v Evropě umožňuje ČR snadno obchodovat se sousedy a tranzitovat zboží."],
  },
  {
    question: "Jak se jmenuje kraj, ve kterém leží Praha — hlavní město ČR?",
    correctAnswer: "Praha je samostatný kraj",
    options: [
      "Praha je samostatný kraj",
      "Středočeský kraj",
      "Kraj Praha-centrum",
      "Praha leží v Jihočeském kraji",
    ],
    hints: ["Praha je specifická — je to zároveň město i kraj."],
    solutionSteps: ["Praha je zvláštní — je to zároveň hlavní město i samostatný kraj ČR."],
  },
  {
    question: "Jak se jmenuje místo v ČR, kde se setkávají hranice tří států najednou (ČR, Německo, Polsko)?",
    correctAnswer: "Trojmezí – trojpomezí v oblasti Krušných hor / Jizerských hor",
    options: [
      "Trojmezí – trojpomezí v oblasti Krušných hor / Jizerských hor",
      "Na Šumavě u Železné Rudy",
      "Na Lysé hoře v Beskydech",
      "U Opavy na severu Moravy",
    ],
    hints: ["Tři státy se setkávají na severu ČR."],
    solutionSteps: ["Trojmezí ČR, Německa a Polska leží v oblasti Jizerských hor (Trojmezí).", "Na jihu se setkávají ČR, Německo a Rakousko u Šumavy."],
  },
  {
    question: "Jakými horami je ČR oddělena od sousedních zemí na severu?",
    correctAnswer: "Krkonošemi, Jizerskými horami, Orlickými horami, Jeseníky – Sudetský oblouk",
    options: [
      "Krkonošemi, Jizerskými horami, Orlickými horami, Jeseníky – Sudetský oblouk",
      "Alpami a Karpaty",
      "Šumavou a Krušnými horami",
      "Beskydami a Tatrami",
    ],
    hints: ["Sudetský oblouk obklopuje Čechy ze tří stran."],
    solutionSteps: ["Sudetský oblouk (Krkonoše, Jizerské, Orlické hory, Jeseníky) odděluje ČR od Polska."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const count = level === 3 ? Math.min(pool.length, 45) : Math.min(pool.length, 30);
  return shuffle(pool).slice(0, count);
}

export const POLOHACRVEVROPESOUSEDNISTATY: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-poloha-cr-v-evrope-sousedni-staty",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-poloha-cr-v-evrope-sousedni-staty",
    title: "Poloha ČR v Evropě, sousední státy",
    studentTitle: "ČR v Evropě",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Poznáš polohu ČR, sousední státy a základní fakta o naší zemi.",
    keywords: ["česká republika", "evropa", "sousední státy", "Německo", "Polsko", "Slovensko", "Rakousko", "Praha"],
    goals: [
      "Vyjmenovat 4 sousední státy ČR",
      "Určit polohu ČR v Evropě",
      "Vyjmenovat největší česká města",
      "Popsat, že ČR je vnitrozemský stát",
    ],
    boundaries: ["Podrobná geopolitika není cílem", "Historické hranice ČR nejsou vyžadovány"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "ČR leží ve střední Evropě. 4 sousedé: Německo (Z), Polsko (S), Slovensko (V), Rakousko (J).",
      steps: [
        "Vzpomeň si na mapu Evropy",
        "Najdi ČR — je to malá zemička uprostřed",
        "Podívej se, kdo ji obklopuje",
      ],
      commonMistake: "Žáci si pletou Slovensko a Maďarsko — s Maďarskem ČR nesousedí.",
      example: "ČR: 4 sousedé = Německo (západ), Polsko (sever), Slovensko (východ), Rakousko (jih)",
    },
  },
];
