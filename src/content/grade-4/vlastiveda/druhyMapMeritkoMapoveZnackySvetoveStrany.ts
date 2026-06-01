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
    question: "Jaké jsou čtyři světové strany?",
    correctAnswer: "Sever, jih, západ, východ",
    options: ["Sever, jih, západ, východ", "Hora, dol, levá, pravá", "Ráno, poledne, večer, noc", "Jaro, léto, podzim, zima"],
    hints: ["Světové strany se určují pomocí kompasu."],
    solutionSteps: ["Čtyři světové strany jsou: sever (N), jih (S), západ (Z/W), východ (V/E)."],
  },
  {
    question: "Jaký přístroj slouží k určení světových stran?",
    correctAnswer: "Kompas",
    options: ["Kompas", "Teploměr", "Dalekohled", "Metr"],
    hints: ["Tento přístroj má magnetickou střelku."],
    solutionSteps: ["Kompas má magnetickou střelku, která vždy ukazuje na sever."],
  },
  {
    question: "Na které straně mapy bývá zpravidla sever?",
    correctAnswer: "Nahoře",
    options: ["Nahoře", "Dole", "Vlevo", "Vpravo"],
    hints: ["Mapy mají standardní orientaci."],
    solutionSteps: ["Na mapě bývá sever nahoře — to je mezinárodní standard."],
  },
  {
    question: "Jaká barva se na mapě používá pro vodní plochy (řeky, jezera, moře)?",
    correctAnswer: "Modrá",
    options: ["Modrá", "Zelená", "Hnědá", "Červená"],
    hints: ["Jakou barvu má voda?"],
    solutionSteps: ["Na mapě se vodní plochy zobrazují modrou barvou."],
  },
  {
    question: "Jaká barva na mapě označuje lesy?",
    correctAnswer: "Zelená",
    options: ["Zelená", "Modrá", "Hnědá", "Žlutá"],
    hints: ["Strom je jaké barvy?"],
    solutionSteps: ["Lesy jsou na mapě zobrazeny zelenou barvou."],
  },
  {
    question: "Co je to měřítko mapy?",
    correctAnswer: "Poměr vzdálenosti na mapě k reálné vzdálenosti",
    options: [
      "Poměr vzdálenosti na mapě k reálné vzdálenosti",
      "Velikost mapy v centimetrech",
      "Barvy použité na mapě",
      "Název mapy",
    ],
    hints: ["Měřítko říká, kolik centimetrů na mapě odpovídá metrům v přírodě."],
    solutionSteps: ["Měřítko mapy udává, jak je zmenšená — například 1:50 000 znamená 1 cm = 500 m."],
  },
  {
    question: "Jaký typ mapy zobrazuje pohoří, řeky a nadmořskou výšku?",
    correctAnswer: "Fyzická mapa",
    options: ["Fyzická mapa", "Politická mapa", "Turistická mapa", "Tematická mapa"],
    hints: ["Tento typ mapy zachycuje terén a přírodu."],
    solutionSteps: ["Fyzická mapa zobrazuje terén — pohoří, nížiny, řeky a nadmořské výšky."],
  },
  {
    question: "Jaký typ mapy zobrazuje státní hranice a hlavní města?",
    correctAnswer: "Politická mapa",
    options: ["Politická mapa", "Fyzická mapa", "Turistická mapa", "Plán města"],
    hints: ["Tento typ mapy zachycuje státy a jejich hranice."],
    solutionSteps: ["Politická mapa zobrazuje státní hranice, hlavní města a správní celky."],
  },
  {
    question: "Která mapa je vhodná pro turisty a pěší výlety?",
    correctAnswer: "Turistická mapa",
    options: ["Turistická mapa", "Politická mapa", "Astronomická mapa", "Námořní mapa"],
    hints: ["Na této mapě najdeš turistické stezky a útočiště."],
    solutionSteps: ["Turistická mapa zobrazuje turistické trasy, značky, chaty a zajímavé cíle."],
  },
  {
    question: "Co je to plán města?",
    correctAnswer: "Podrobná mapa zobrazující ulice a budovy města",
    options: [
      "Podrobná mapa zobrazující ulice a budovy města",
      "Mapa celé ČR",
      "Letecký snímek přírody",
      "Turistická mapa hor",
    ],
    hints: ["Plán zachycuje detaily jednoho místa — ulice, náměstí, budovy."],
    solutionSteps: ["Plán města je podrobná mapa ulic, budov a náměstí jednoho města."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co znamená měřítko 1:50 000?",
    correctAnswer: "1 cm na mapě = 500 m ve skutečnosti",
    options: [
      "1 cm na mapě = 500 m ve skutečnosti",
      "1 cm na mapě = 50 m ve skutečnosti",
      "1 cm na mapě = 5 km ve skutečnosti",
      "1 cm na mapě = 50 km ve skutečnosti",
    ],
    hints: ["50 000 cm = 500 m = 0,5 km"],
    solutionSteps: ["1:50 000 → 1 cm = 50 000 cm = 500 m ve skutečnosti."],
  },
  {
    question: "Co znamená měřítko 1:200 000?",
    correctAnswer: "1 cm na mapě = 2 km ve skutečnosti",
    options: [
      "1 cm na mapě = 2 km ve skutečnosti",
      "1 cm na mapě = 200 m ve skutečnosti",
      "1 cm na mapě = 20 km ve skutečnosti",
      "1 cm na mapě = 200 km ve skutečnosti",
    ],
    hints: ["200 000 cm = 2 000 m = 2 km"],
    solutionSteps: ["1:200 000 → 1 cm = 200 000 cm = 2 000 m = 2 km ve skutečnosti."],
  },
  {
    question: "Která mapa zobrazuje větší území — mapa v měřítku 1:50 000 nebo 1:200 000?",
    correctAnswer: "Mapa 1:200 000 zobrazuje větší území",
    options: [
      "Mapa 1:200 000 zobrazuje větší území",
      "Mapa 1:50 000 zobrazuje větší území",
      "Obě mapy zobrazují stejně velké území",
      "Záleží na velikosti papíru",
    ],
    hints: ["Čím větší číslo v měřítku, tím více skutečnosti je zmenšeno na papír."],
    solutionSteps: ["Mapa 1:200 000 zobrazuje větší území — 1 cm = 2 km, kdežto 1:50 000 má 1 cm = 500 m."],
  },
  {
    question: "Jaká barva na mapě označuje vrstevnice a pohoří?",
    correctAnswer: "Hnědá",
    options: ["Hnědá", "Zelená", "Modrá", "Červená"],
    hints: ["Tato barva je spojena s horami a kamenem."],
    solutionSteps: ["Vrstevnice (linie stejné nadmořské výšky) a pohoří se kreslí hnědou barvou."],
  },
  {
    question: "Jaká barva se na mapě používá pro důležité silnice a dálnice?",
    correctAnswer: "Červená",
    options: ["Červená", "Modrá", "Zelená", "Žlutá"],
    hints: ["Tato barva upoutá pozornost — dobrá pro důležité cesty."],
    solutionSteps: ["Hlavní silnice a dálnice se na mapě vyznačují červenou barvou."],
  },
  {
    question: "Co jsou to vrstevnice na mapě?",
    correctAnswer: "Čáry spojující místa se stejnou nadmořskou výškou",
    options: [
      "Čáry spojující místa se stejnou nadmořskou výškou",
      "Čáry označující hranice krajů",
      "Čáry zobrazující turistické stezky",
      "Čáry označující řeky",
    ],
    hints: ["Vrstevnice se kreslí hnědě a ukazují terén."],
    solutionSteps: ["Vrstevnice jsou hnědé čáry spojující místa ve stejné nadmořské výšce — čím hustší, tím strmější svah."],
  },
  {
    question: "Jakou hvězdou (nebo šipkou) se na mapě označuje sever?",
    correctAnswer: "Růžicí světových stran nebo šipkou se symbolem N",
    options: [
      "Růžicí světových stran nebo šipkou se symbolem N",
      "Hvězdou Davidovou",
      "Kruhovou šipkou",
      "Červeným křížem",
    ],
    hints: ["N je zkratka anglického slova North (sever)."],
    solutionSteps: ["Sever se na mapě označuje šipkou nebo kompasovou růžicí se symbolem N (North)."],
  },
  {
    question: "Co je to legenda mapy?",
    correctAnswer: "Vysvětlivky mapových značek a barev",
    options: [
      "Vysvětlivky mapových značek a barev",
      "Příběh o vzniku mapy",
      "Jméno autora mapy",
      "Měřítko mapy",
    ],
    hints: ["Legenda ti pomůže přečíst, co co znamená."],
    solutionSteps: ["Legenda (vysvětlivka) mapy vysvětluje, co jednotlivé barvy, čáry a symboly na mapě znamenají."],
  },
  {
    question: "Jaký typ mapy bys použil/a ke zjištění hustoty obyvatelstva v různých krajích?",
    correctAnswer: "Tematická mapa",
    options: ["Tematická mapa", "Fyzická mapa", "Turistická mapa", "Plán města"],
    hints: ["Tento typ mapy zobrazuje jeden konkrétní jev — například počet obyvatel."],
    solutionSteps: ["Tematická mapa zobrazuje jeden konkrétní jev — hustotu obyvatelstva, klima, průmysl apod."],
  },
  {
    question: "Co jsou to souřadnice na mapě?",
    correctAnswer: "Čísla a písmena určující polohu bodu na mapě",
    options: [
      "Čísla a písmena určující polohu bodu na mapě",
      "Vzdálenosti mezi městy",
      "Výšky vrcholů hor",
      "Barvy použité v legendě",
    ],
    hints: ["Souřadnice slouží k přesnému určení polohy."],
    solutionSteps: ["Souřadnice (zeměpisná šířka a délka) přesně určují polohu každého bodu na mapě."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Mapa má měřítko 1:50 000. Jak dlouhá je cesta, jejíž délka na mapě je 4 cm?",
    correctAnswer: "2 km – 2 000 m",
    options: ["2 km – 2 000 m", "200 m", "20 km", "400 m"],
    hints: ["1 cm = 500 m → 4 cm = ?"],
    solutionSteps: ["1 cm = 500 m. 4 cm × 500 m = 2 000 m = 2 km."],
  },
  {
    question: "Mapa má měřítko 1:200 000. Vzdálenost dvou měst je 6 cm na mapě. Jak daleko jsou od sebe ve skutečnosti?",
    correctAnswer: "12 km",
    options: ["12 km", "1,2 km", "120 km", "6 km"],
    hints: ["1 cm = 2 km → 6 cm = ?"],
    solutionSteps: ["1:200 000 → 1 cm = 2 km. 6 cm × 2 km = 12 km."],
  },
  {
    question: "Proč turistická mapa obsahuje turistické značky (červená, modrá, zelená, žlutá)?",
    correctAnswer: "Aby turisté mohli rozlišit různé trasy a snáze se orientovat v terénu",
    options: [
      "Aby turisté mohli rozlišit různé trasy a snáze se orientovat v terénu",
      "Protože je to zákonem povinné",
      "Aby mapa vypadala hezky",
      "Kvůli barvoslepým turistům",
    ],
    hints: ["Barvy pomáhají odlišit různé trasy v lese."],
    solutionSteps: ["Různobarevné značky odlišují trasy a pomohou turistovi sledovat konkrétní cestu bez zabloudění."],
  },
  {
    question: "Jak poznáš na fyzické mapě strmý svah?",
    correctAnswer: "Vrstevnice jsou blízko u sebe",
    options: [
      "Vrstevnice jsou blízko u sebe",
      "Vrstevnice jsou daleko od sebe",
      "Oblast je vyznačena modrou barvou",
      "Oblast je vyznačena zelenou barvou",
    ],
    hints: ["Čím hustší vrstevnice, tím strmější terén."],
    solutionSteps: ["Husté vrstevnice = strmý svah, protože výška se mění rychle na malé vzdálenosti."],
  },
  {
    question: "Proč existují různé druhy map a ne jedna univerzální?",
    correctAnswer: "Každý účel vyžaduje jiné informace — turisté potřebují jiné detaily než řidiči nebo geografové",
    options: [
      "Každý účel vyžaduje jiné informace — turisté potřebují jiné detaily než řidiči nebo geografové",
      "Protože mapy jsou příliš drahé na výrobu v jednom kuse",
      "Různé kraje mají různé mapy",
      "Mapy se tisknou pro různé věkové skupiny",
    ],
    hints: ["Co potřebuje turista na výlet a co potřebuje řidič?"],
    solutionSteps: ["Různé mapy slouží různým účelům — turistická zobrazuje stezky, autoatlas silnice, fyzická terén."],
  },
  {
    question: "Stojíš na náměstí a slunce vychází vpravo od tebe. Kam se díváš?",
    correctAnswer: "Na sever",
    options: ["Na sever", "Na jih", "Na západ", "Na východ"],
    hints: ["Slunce vychází na východě — pokud je vpravo, pak ty..."],
    solutionSteps: ["Slunce vychází na východě (vpravo) → tvoje pravá ruka = východ → díváš se na sever."],
  },
  {
    question: "Proč mají polárky hvězdáři pro určení severu?",
    correctAnswer: "Polárka stojí téměř nad severním pólem a vždy ukazuje na sever",
    options: [
      "Polárka stojí téměř nad severním pólem a vždy ukazuje na sever",
      "Polárka je nejjasnější hvězda na obloze",
      "Polárka je nejblíže Zemi ze všech hvězd",
      "Polárka svítí pouze v noci na severu",
    ],
    hints: ["Polárka = Severka, nachází se nad severním pólem."],
    solutionSteps: ["Polárka (Severka) je umístěna téměř nad severním zemským pólem a ukazuje sever s přesností asi 1°."],
  },
  {
    question: "Jak bys vypočítal/a vzdálenost na mapě v měřítku 1:100 000, když na mapě měříš 5 cm?",
    correctAnswer: "5 km",
    options: ["5 km", "500 m", "50 km", "0,5 km"],
    hints: ["1:100 000 → 1 cm = 1 km → 5 cm = ?"],
    solutionSteps: ["1:100 000 → 1 cm = 100 000 cm = 1 km. 5 cm × 1 km = 5 km."],
  },
  {
    question: "Co znamená, že mapa má 'větší měřítko'?",
    correctAnswer: "Zobrazuje menší území s větším detailem",
    options: [
      "Zobrazuje menší území s větším detailem",
      "Zobrazuje větší území s menším detailem",
      "Je fyzicky větší",
      "Má více barev",
    ],
    hints: ["Větší měřítko = větší číslo ve jmenovateli nebo menší číslo?"],
    solutionSteps: ["Větší měřítko (1:10 000) zobrazuje menší území s větším detailem. Menší měřítko (1:1 000 000) zobrazuje velké území s malým detailem."],
  },
  {
    question: "Na mapě jsou hustší vrstevnice na západní straně kopce a řídké na východní. Co to znamená?",
    correctAnswer: "Západní strana kopce je strmá, východní je mírná",
    options: [
      "Západní strana kopce je strmá, východní je mírná",
      "Východní strana je strmá, západní je mírná",
      "Kopec je symetrický",
      "Vrstevnice nezávisejí na sklonu svahu",
    ],
    hints: ["Hustší vrstevnice = rychlejší změna výšky = strmější svah."],
    solutionSteps: ["Hustší vrstevnice = strmý svah (výška se mění rychle). Řídké vrstevnice = mírný svah."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const count = level === 3 ? Math.min(pool.length, 40) : Math.min(pool.length, 30);
  return shuffle(pool).slice(0, count);
}

export const DRUHYMAPMERITKOMAPOVEZNACKYSVETOVESTRANY: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-prace-s-mapou-druhy-map-meritko-mapove-znacky-svetove-strany",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-prace-s-mapou-druhy-map-meritko-mapove-znacky-svetove-strany",
    title: "Druhy map, měřítko, mapové značky, světové strany",
    studentTitle: "Práce s mapou",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Naučíš se číst mapu, poznat světové strany a porozumět měřítku.",
    keywords: ["mapa", "měřítko", "světové strany", "sever", "kompas", "legenda", "vrstevnice"],
    goals: [
      "Rozlišit druhy map (fyzická, politická, turistická, tematická)",
      "Vypočítat vzdálenost pomocí měřítka",
      "Orientovat se na mapě pomocí světových stran",
      "Přečíst základní mapové značky",
    ],
    boundaries: ["Zeměpisné souřadnice do hloubky nejsou cílem", "GPS technologie není vyžadována"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Na mapě je sever nahoře. Modrá = voda, zelená = les, hnědá = hory. Měřítko říká, kolik cm = kolik metrů.",
      steps: [
        "Podívej se na legendu mapy",
        "Urči světové strany (sever = nahoře)",
        "Přečti měřítko a vypočítej vzdálenost",
      ],
      commonMistake: "Žáci si pletou, která mapa zobrazuje větší území — mapa s menším měřítkem (1:1 000 000) zobrazuje větší území.",
      example: "Měřítko 1:50 000: 2 cm na mapě = 2 × 500 m = 1 km ve skutečnosti",
    },
  },
];
