import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
  {
    question: "Kde je na mapě světová strana sever?",
    correctAnswer: "Nahoře",
    options: ["Nahoře", "Dole", "Vpravo", "Vlevo"],
    hints: [
      "Na mapách se sever vždy kreslí směrem nahoru.",
      "Představ si kompasovou ručičku — ukazuje nahoru na mapě.",
    ],
    explanation:
      "Na většině map platí dohodnuté pravidlo: sever je nahoře, jih je dole, východ je vpravo a západ je vlevo. Díky tomu se na mapách všichni snadno orientujeme.",
  },
  {
    question: "Kde je na mapě světová strana jih?",
    correctAnswer: "Dole",
    options: ["Dole", "Nahoře", "Vlevo", "Vpravo"],
    hints: [
      "Jih je opak severu. Sever je nahoře, jih je tedy...",
      "Na mapě je jih vždy dole.",
    ],
    explanation:
      "Na standardní mapě je jih dole. Je to přesně naproti severu, který je nahoře.",
  },
  {
    question: "Kde je na mapě světová strana východ?",
    correctAnswer: "Vpravo",
    options: ["Vpravo", "Vlevo", "Nahoře", "Dole"],
    hints: [
      "Pomůcka: 'Sever Nahoře, Východ Vpravo' — SN, VV.",
      "Slunce vychází na východě — vychází zprava na mapě.",
    ],
    explanation:
      "Na mapě je východ vpravo. Slunce vychází na východě — proto se někdy říká 'vychod slunce'. Na mapě ho najdeme na pravé straně.",
  },
  {
    question: "Kde je na mapě světová strana západ?",
    correctAnswer: "Vlevo",
    options: ["Vlevo", "Vpravo", "Dole", "Nahoře"],
    hints: [
      "Západ je naproti východu. Východ je vpravo, západ je tedy...",
      "Slunce zapadá na západě — na mapě vlevo.",
    ],
    explanation:
      "Na mapě je západ vlevo. Slunce každý večer zapadá na západě, který na mapách najdeme na levé straně.",
  },
  {
    question: "Na co ukazuje magnetická ručička kompasu?",
    correctAnswer: "Na magnetický sever",
    options: [
      "Na magnetický sever",
      "Na jih",
      "Na nejbližší město",
      "Na východ, odkud vychází slunce",
    ],
    hints: [
      "Kompas nás naviguje — ručička vždy ukazuje jedním pevným směrem.",
      "Magnetická ručička reaguje na zemské magnetické pole a míří na sever.",
    ],
    explanation:
      "Magnetická ručička kompasu vždy ukazuje na magnetický sever. Využívá zemské magnetické pole. Proto se kompas používá k orientaci v přírodě.",
  },
  {
    question: "Co je severovýchod (SV)?",
    correctAnswer: "Mezilehlá světová strana mezi severem a východem",
    options: [
      "Mezilehlá světová strana mezi severem a východem",
      "Mezilehlá světová strana mezi severem a západem",
      "Jiný název pro sever",
      "Světová strana pod jihem",
    ],
    hints: [
      "Severovýchod je mezi severem a východem — zkombinuj první písmena.",
      "SV = Sever + Východ = strana mezi nimi, nahoře vpravo na mapě.",
    ],
    explanation:
      "Severovýchod (SV) je mezilehlá světová strana ležící přesně mezi severem a východem. Na mapě ji najdeme v pravém horním rohu.",
  },
  {
    question: "Co je jihozápad (JZ)?",
    correctAnswer: "Mezilehlá světová strana mezi jihem a západem",
    options: [
      "Mezilehlá světová strana mezi jihem a západem",
      "Mezilehlá světová strana mezi jihem a východem",
      "Jiný název pro západ",
      "Světová strana naproti severu",
    ],
    hints: [
      "JZ = Jih + Západ. Podívej se na mapu dolů doleva.",
      "Jihozápad je v levém dolním rohu mapy.",
    ],
    explanation:
      "Jihozápad (JZ) je mezilehlá světová strana mezi jihem a západem. Na mapě ji najdeme v levém dolním rohu.",
  },
  {
    question: "Co znamená legenda na mapě?",
    correctAnswer: "Vysvětlivky — co znamenají jednotlivé značky a barvy na mapě",
    options: [
      "Vysvětlivky — co znamenají jednotlivé značky a barvy na mapě",
      "Název státu vyznačeného na mapě",
      "Vzdálenost mezi dvěma městy",
      "Rok, kdy byla mapa vydána",
    ],
    hints: [
      "Legenda stojí obvykle v rohu mapy a vysvětluje symboly.",
      "Bez legendy bychom nevěděli, co znamená modrá čára nebo zelená barva.",
    ],
    explanation:
      "Legenda (vysvětlivky) je část mapy, která vysvětluje, co znamenají všechny použité značky, symboly a barvy. Bez legendy bychom mapu nedokázali číst.",
  },
  {
    question: "Co je měřítko mapy?",
    correctAnswer: "Poměr, o kolik je mapa zmenšená oproti skutečnosti",
    options: [
      "Poměr, o kolik je mapa zmenšená oproti skutečnosti",
      "Název oblasti zobrazené na mapě",
      "Tabulka s výškami hor",
      "Popis hranice státu",
    ],
    hints: [
      "Mapa nemůže být stejně velká jako skutečný kraj — musí se zmenšit.",
      "Měřítko říká, kolik centimetrů na mapě odpovídá kilometrům ve skutečnosti.",
    ],
    explanation:
      "Měřítko mapy říká, kolikrát je mapa zmenšená oproti skutečnosti. Například měřítko 1:100 000 znamená, že 1 cm na mapě odpovídá 1 km ve skutečnosti.",
  },
  {
    question: "Jaký je rozdíl mezi plánem a mapou?",
    correctAnswer: "Plán zobrazuje malou plochu (např. město), mapa zobrazuje velkou plochu (kraj nebo stát)",
    options: [
      "Plán zobrazuje malou plochu (např. město), mapa zobrazuje velkou plochu (kraj nebo stát)",
      "Plán je pro dospělé, mapa pro děti",
      "Mapa je vždy přesnější než plán",
      "Plán ukazuje jen silnice, mapa jen řeky",
    ],
    hints: [
      "Plán = malá plocha (místnost, škola, město). Mapa = velká plocha.",
      "Na plánu města vidíš ulice, na mapě státu vidíš kraje a hranice.",
    ],
    explanation:
      "Plán zobrazuje malou plochu v podrobném měřítku — například pokoj, školu nebo město. Mapa zobrazuje velkou plochu — kraj, stát nebo celý kontinent.",
  },
  {
    question: "Co znamená modrá barva na mapě?",
    correctAnswer: "Vodu — řeky, jezera, moře",
    options: [
      "Vodu — řeky, jezera, moře",
      "Lesy a parky",
      "Hory a kopce",
      "Silnice a dálnice",
    ],
    hints: [
      "Zamysli se, jakou barvu má voda v přírodě.",
      "Na mapě se barvy podobají skutečnosti — voda je modrá.",
    ],
    explanation:
      "Modrá barva na mapě označuje vodu — řeky, jezera, rybníky, moře a oceány. Je to přirozená barva připomínající skutečný vzhled vodní hladiny.",
  },
  {
    question: "Co znamená zelená barva na fyzické mapě?",
    correctAnswer: "Nížiny a roviny",
    options: [
      "Nížiny a roviny",
      "Hory a vrchoviny",
      "Pouště a suché oblasti",
      "Lesy kolem měst",
    ],
    hints: [
      "Na fyzické mapě barvy ukazují výšku terénu. Zelená = nízko nad mořem.",
      "Nížiny bývají zelené — luhy, louky, pole.",
    ],
    explanation:
      "Na fyzické mapě zelená barva označuje nížiny — oblasti ležící nízko nad mořem. Čím vyšší terén, tím přechází barva do žluté, hnědé a nakonec fialové.",
  },
  {
    question: "Co znamená hnědá barva na fyzické mapě?",
    correctAnswer: "Hory a vrchoviny",
    options: [
      "Hory a vrchoviny",
      "Nížiny a roviny",
      "Řeky a potoky",
      "Hranice mezi státy",
    ],
    hints: [
      "Na fyzické mapě čím tmavší hnědá, tím vyšší hory.",
      "Hnědá barva připomíná skály a půdu bez vegetace na vrcholcích hor.",
    ],
    explanation:
      "Hnědá barva na fyzické mapě označuje hory a vrchoviny. Čím tmavší odstín hnědé, tím vyšší je terén. Nejvyšší horské vrcholy mohou být označeny fialovou nebo bílou barvou.",
  },
  {
    question: "Jak můžeš určit sever za slunečného dne bez kompasu?",
    correctAnswer: "V poledne stojí slunce na jihu, takže sever je přesně naproti",
    options: [
      "V poledne stojí slunce na jihu, takže sever je přesně naproti",
      "Slunce vždy ukazuje na sever",
      "Sever je tam, kde svítí nejsilněji",
      "Za dne nelze sever určit bez kompasu",
    ],
    hints: [
      "Slunce je v poledne nejvýše na obloze a stojí na jihu.",
      "Otočíš-li se čelem k polednímu slunci (jih), za zády máš sever.",
    ],
    explanation:
      "V poledne je slunce nejvýše na obloze a nachází se na jihu. Otočíme-li se k polednímu slunci čelem, stojíme čelem k jihu — za zády máme sever, po pravici východ a po levici západ.",
  },
  {
    question: "Co je jihovýchod (JV)?",
    correctAnswer: "Mezilehlá světová strana mezi jihem a východem",
    options: [
      "Mezilehlá světová strana mezi jihem a východem",
      "Mezilehlá světová strana mezi jihem a západem",
      "Mezilehlá světová strana mezi severem a východem",
      "Jiný název pro jih",
    ],
    hints: [
      "JV = Jih + Východ. Podívej se na mapu dolů doprava.",
      "Jihovýchod je v pravém dolním rohu mapy.",
    ],
    explanation:
      "Jihovýchod (JV) je mezilehlá světová strana ležící přesně mezi jihem a východem. Na mapě ji najdeme v pravém dolním rohu.",
  },
  {
    question: "Co je severozápad (SZ)?",
    correctAnswer: "Mezilehlá světová strana mezi severem a západem",
    options: [
      "Mezilehlá světová strana mezi severem a západem",
      "Mezilehlá světová strana mezi severem a východem",
      "Mezilehlá světová strana mezi jihem a západem",
      "Jiný název pro západ",
    ],
    hints: [
      "SZ = Sever + Západ. Podívej se na mapu nahoru doleva.",
      "Severozápad je v levém horním rohu mapy.",
    ],
    explanation:
      "Severozápad (SZ) je mezilehlá světová strana ležící přesně mezi severem a západem. Na mapě ji najdeme v levém horním rohu.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
}

export const MAPASTRANYSVET: TopicMetadata[] = [
  {
    id: "g3-prvouka-misto-kde-zijeme-nase-vlast-mapa-svetove-strany-plan-a-mapa-kompas",
    rvpNodeId:
      "g3-prvouka-misto-kde-zijeme-nase-vlast-mapa-svetove-strany-plan-a-mapa-kompas",
    title: "Mapa, světové strany, kompas",
    studentTitle: "Mapa a orientace",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Naše vlast",
    briefDescription: "Umíš se orientovat na mapě a znáš světové strany.",
    keywords: [
      "mapa",
      "plán",
      "světové strany",
      "sever",
      "jih",
      "východ",
      "západ",
      "kompas",
      "legenda",
      "měřítko",
      "orientace",
      "severovýchod",
      "jihozápad",
      "barvy na mapě",
    ],
    goals: [
      "Pojmenovat čtyři hlavní světové strany a určit jejich polohu na mapě.",
      "Vysvětlit, k čemu slouží kompas.",
      "Popsat mezilehlé světové strany (SV, SZ, JV, JZ).",
      "Vysvětlit, co je legenda a měřítko mapy.",
      "Rozlišit plán od mapy.",
      "Přiřadit základní barvy na fyzické mapě ke tvaru terénu.",
      "Popsat, jak určit sever podle polohy slunce v poledne.",
    ],
    boundaries: [
      "Základní pojmy a dovednosti pro 3. třídu, bez zeměpisných souřadnic, projekcí nebo UTM.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Sever je nahoře, Jih dole, Východ vpravo, Západ vlevo. Kompas ukazuje na sever. Legenda = vysvětlivky, měřítko = zmenšení. Plán = malá plocha, mapa = velká plocha.",
      steps: [
        "Podívej se na mapu — sever je nahoře.",
        "Kompasová ručička vždy míří na sever.",
        "Legenda ti poví, co znamenají barvy a značky.",
        "Měřítko říká, kolik skutečných kilometrů odpovídá centimetru na mapě.",
      ],
      commonMistake:
        "Záměna plánu a mapy — plán je pro malou plochu (město), mapa pro velkou plochu (kraj, stát).",
      example:
        "Stojíš na náměstí a chceš najít školu na jihu. Otočíš kompas, ručička ukáže sever (nahoru) — škola je dole na mapě, takže se vydáš na jih.",
    },
  },
];
