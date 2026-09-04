import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ANO = "Ano, to je pravda";
const NE = "Ne, to není pravda";

interface TrueFalseItem {
  question: string;
  correct: boolean;
  emoji: string;
  hint: string;
  solution: string;
}

function toTask(item: TrueFalseItem): PracticeTask {
  return {
    question: item.question,
    correctAnswer: item.correct ? ANO : NE,
    options: [ANO, NE],
    emoji: item.emoji,
    hints: [item.hint],
    explanation: item.solution,
  };
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3) pro 2. ročník.
//   L1 = rozpoznání jednoho izolovaného návyku jako zdravého či
//        nezdravého — formát Ano/Ne (2 možnosti).
//   L2 = aplikace: výběr zdravé volby ze 4 možností, přiřazení
//        činnosti k potřebě těla (spánek, pohyb, pití, hygiena).
//   L3 = transfer: „proč“ je něco zdravé, spojení dvou informací,
//        oprava miskoncepce, porovnání — většinou 4 možnosti,
//        jen menšina Ano/Ne.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Zuby si čistíme každý den. Je to pravda?",
    correct: true,
    emoji: "🦷",
    hint: "Čisté zuby chrání před zubním kazem — jak často je čistíme?",
    solution: "Zuby si čistíme každý den — ráno a večer, aby se nekazily.",
  },
  {
    question: "Spánek je pro tělo důležitý. Je to pravda?",
    correct: true,
    emoji: "😴",
    hint: "V noci si tělo odpočine a nabere energii — je spánek důležitý?",
    solution: "Spánek je důležitý — tělo si při něm odpočine a nabere sílu na další den.",
  },
  {
    question: "Zdravé je pít málo vody. Je to pravda?",
    correct: false,
    emoji: "💧",
    hint: "Tělo vodu pořád potřebuje — je zdravější pít málo, nebo dost?",
    solution: "Zdravé není pít málo vody — tělo jí potřebuje dost, proto pijeme pravidelně.",
  },
  {
    question: "Ovoce je zdravé. Je to pravda?",
    correct: true,
    emoji: "🍎",
    hint: "Ovoce obsahuje vitamíny — prospívají tělu?",
    solution: "Ovoce je zdravé — obsahuje vitamíny, které tělo potřebuje.",
  },
  {
    question: "Pohyb a sport jsou pro tělo zdravé. Je to pravda?",
    correct: true,
    emoji: "🏃",
    hint: "Při pohybu pracují svaly a srdce — posiluje je to?",
    solution: "Pohyb je zdravý — sportem a hrou posilujeme svaly i srdce.",
  },
  {
    question: "Před jídlem si myjeme ruce. Je to pravda?",
    correct: true,
    emoji: "🧼",
    hint: "Na rukou jsou bakterie — kdy je omyjeme, abychom je nesnědli?",
    solution: "Před jídlem si myjeme ruce — smyjeme bakterie, abychom je nedostali do úst.",
  },
  {
    question: "Zdravé je jíst celý den jenom bonbony. Je to pravda?",
    correct: false,
    emoji: "🍬",
    hint: "Bonbony jsou sladké, ale samy tělu nestačí — co ještě potřebuje?",
    solution: "Zdravé není jíst jen bonbony — tělo potřebuje i ovoce, zeleninu, pečivo a mléčné výrobky.",
  },
  {
    question: "Zelenina je zdravá. Je to pravda?",
    correct: true,
    emoji: "🥦",
    hint: "Mrkev, brokolice i salát dodávají vitamíny — jsou zdravé?",
    solution: "Zelenina je zdravá — dodává tělu vitamíny a vlákninu.",
  },
  {
    question: "Dítěti stačí spát jen jednu hodinu za noc. Je to pravda?",
    correct: false,
    emoji: "🛌",
    hint: "Jedna hodina je málo — kolik hodin spánku dítě potřebuje?",
    solution: "Jedna hodina nestačí — dítě potřebuje kolem deseti hodin spánku za noc.",
  },
  {
    question: "Hrát si a běhat venku je zdravé. Je to pravda?",
    correct: true,
    emoji: "⚽",
    hint: "Pohyb na čerstvém vzduchu tělu prospívá — je zdravý?",
    solution: "Hrát si a běhat venku je zdravé — pohyb na čerstvém vzduchu tělu prospívá.",
  },
  {
    question: "Zdravé je celý den jen sedět u televize. Je to pravda?",
    correct: false,
    emoji: "📺",
    hint: "Celý den bez pohybu tělu nesvědčí — co bychom měli střídat?",
    solution: "Zdravé není celý den sedět u televize — je potřeba střídat pohyb, hru i odpočinek.",
  },
  {
    question: "Ráno je dobré nasnídat se. Je to pravda?",
    correct: true,
    emoji: "🍞",
    hint: "Po noci je tělo bez energie — co ji ráno doplní?",
    solution: "Ráno je dobré se nasnídat — snídaně dodá tělu energii na dopoledne.",
  },
  {
    question: "Odpočinek tělu škodí. Je to pravda?",
    correct: false,
    emoji: "🧘",
    hint: "Jak se cítíme po dobrém odpočinku — hůř, nebo líp?",
    solution: "Odpočinek tělu neškodí — naopak ho potřebujeme, abychom nabrali sílu.",
  },
  {
    question: "Myjeme se a sprchujeme se pravidelně. Je to pravda?",
    correct: true,
    emoji: "🚿",
    hint: "Hygiena chrání zdraví — myjeme se pravidelně, nebo nikdy?",
    solution: "Myjeme se pravidelně — hygiena chrání zdraví a odstraňuje bakterie.",
  },
  {
    question: "Mrkev je zdravá. Je to pravda?",
    correct: true,
    emoji: "🥕",
    hint: "Mrkev je zelenina plná vitamínů — je zdravá, nebo škodlivá?",
    solution: "Mrkev je zdravá — obsahuje vitamíny, které prospívají očím i celému tělu.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Které jídlo je z uvedených nejzdravější svačina?",
    correctAnswer: "Jablko a kousek chleba se sýrem",
    options: [
      "Jablko a kousek chleba se sýrem",
      "Tabulka čokolády a kola",
      "Sáček bonbonů a limonáda",
      "Velký lízátkový špalek",
    ],
    emoji: "🍎",
    hints: [
      "Hledej svačinu s ovocem a pečivem, ne samý cukr.",
      "Sladkosti a slazené nápoje zdravou svačinou nejsou.",
    ],
    explanation:
      "Nejzdravější svačina je jablko a chléb se sýrem — má vitamíny i výživu. Bonbony, čokoláda a limonáda jsou samý cukr.",
  },
  {
    question: "Co je nejlepší pít, když máš žízeň?",
    correctAnswer: "Vodu",
    options: ["Sladkou limonádu", "Vodu", "Kolu", "Energetický nápoj"],
    emoji: "💧",
    hints: [
      "Který nápoj tělu nejvíc prospívá a neobsahuje cukr?",
      "Slazené nápoje žízeň jen zdánlivě zaženou.",
    ],
    explanation:
      "Nejlepší je pít vodu — tělu prospívá a nemá cukr. Limonáda, kola i energetické nápoje obsahují hodně cukru.",
  },
  {
    question: "Co pomáhá tělu, aby bylo silné a zdravé?",
    correctAnswer: "Pravidelný pohyb a sport",
    options: ["Celodenní sezení u počítače", "Přejídání se sladkostmi", "Pravidelný pohyb a sport", "Vynechávání spánku"],
    emoji: "🏃",
    hints: [
      "Co posiluje svaly a srdce?",
      "Sezení a přejídání tělu nepomáhají.",
    ],
    explanation:
      "Tělu pomáhá pravidelný pohyb a sport — posiluje svaly a srdce. Sezení, přejídání a málo spánku naopak škodí.",
  },
  {
    question: "Kdy si máme čistit zuby?",
    correctAnswer: "Ráno a večer",
    options: ["Jen jednou za týden", "Nikdy, není to potřeba", "Jen když nás bolí", "Ráno a večer"],
    emoji: "🦷",
    hints: [
      "Zuby čistíme na začátku i na konci dne.",
      "Kdybychom je čistili málo, začaly by se kazit.",
    ],
    explanation:
      "Zuby si čistíme ráno a večer, abychom je chránili před kazem. Čistit je jednou za týden nebo vůbec by zubům škodilo.",
  },
  {
    question: "Co uděláme, než si sedneme k obědu?",
    correctAnswer: "Umyjeme si ruce mýdlem",
    options: [
      "Umyjeme si ruce mýdlem",
      "Osaháme co nejvíc věcí",
      "Pohladíme psa a hned jíme",
      "Nic, ruce myjeme jen ráno",
    ],
    emoji: "🧼",
    hints: [
      "Na rukou jsou bakterie — co s nimi před jídlem uděláme?",
      "Špinavýma rukama bychom si bakterie dali do úst.",
    ],
    explanation:
      "Před jídlem si umyjeme ruce mýdlem, abychom snesli bakterie. Špinavýma rukama bychom si je dali do úst a mohli onemocnět.",
  },
  {
    question: "Co dělá tělo, když v noci spíme?",
    correctAnswer: "Odpočívá a nabírá novou energii",
    options: ["Pracuje víc než přes den", "Odpočívá a nabírá novou energii", "Nic se s ním neděje", "Ztrácí sílu a slábne"],
    emoji: "😴",
    hints: [
      "Jak se cítíme ráno po dobrém spánku?",
      "Spánek tělu dodává sílu na další den.",
    ],
    explanation:
      "Když spíme, tělo odpočívá a nabírá energii na další den. Proto se po dobrém spánku cítíme svěží a plní síly.",
  },
  {
    question: "Která z těchto věcí zubům škodí nejvíc?",
    correctAnswer: "Jíst hodně sladkostí a nečistit si zuby",
    options: ["Čistit si zuby ráno a večer", "Jíst mrkev a jablka", "Jíst hodně sladkostí a nečistit si zuby", "Pít vodu"],
    emoji: "🍭",
    hints: [
      "Co na zubech zůstane po sladkém a způsobí kaz?",
      "Čištění a zdravé jídlo zubům naopak pomáhají.",
    ],
    explanation:
      "Zubům nejvíc škodí hodně sladkostí a nečištění — cukr na zubech způsobuje kaz. Čištění, mrkev, jablka i voda zubům prospívají.",
  },
  {
    question: "Co patří ke zdravému dni dítěte?",
    correctAnswer: "Pohyb venku, zdravé jídlo a dost spánku",
    options: ["Celý den u televize a samé sladkosti", "Žádný pohyb a spánek jednu hodinu", "Jen sezení a slazené nápoje", "Pohyb venku, zdravé jídlo a dost spánku"],
    emoji: "🌞",
    hints: [
      "Zdravý den spojuje víc dobrých návyků najednou, ne jen jeden.",
      "Samé sladkosti a žádný pohyb ke zdraví nepatří.",
    ],
    explanation:
      "Ke zdravému dni patří pohyb venku, zdravé jídlo a dost spánku. Televize po celý den, sladkosti a málo spánku tělu škodí.",
  },
  {
    question: "Kolik spánku potřebuje dítě, aby bylo přes den čilé?",
    correctAnswer: "Kolem deseti hodin za noc",
    options: [
      "Kolem deseti hodin za noc",
      "Jen jednu hodinu za noc",
      "Vůbec žádný spánek",
      "Nejvýš deset minut",
    ],
    emoji: "🛌",
    hints: [
      "Děti spí víc než dospělí — kolik hodin to asi je?",
      "Jedna hodina ani deset minut by na odpočinek nestačily.",
    ],
    explanation:
      "Dítě potřebuje kolem deseti hodin spánku za noc, aby bylo přes den odpočaté a čilé. Jedna hodina by zdaleka nestačila.",
  },
  {
    question: "Proč je dobré jíst ovoce a zeleninu?",
    correctAnswer: "Obsahují vitamíny, které tělo potřebuje",
    options: ["Obsahují hodně cukru a barviv", "Obsahují vitamíny, které tělo potřebuje", "Nemají pro tělo žádný význam", "Škodí zubům víc než bonbony"],
    emoji: "🥗",
    hints: [
      "Co dobrého ovoce a zelenina tělu dodávají?",
      "Vitamíny pomáhají, aby tělo bylo zdravé.",
    ],
    explanation:
      "Ovoce a zeleninu jíme kvůli vitamínům, které tělo potřebuje, aby bylo zdravé. Na rozdíl od bonbonů zubům neškodí.",
  },
  {
    question: "Co je zdravější způsob trávení odpoledne?",
    correctAnswer: "Jít si zahrát ven na hřiště",
    options: ["Celé odpoledne sedět u obrazovky", "Ležet a jíst chipsy", "Jít si zahrát ven na hřiště", "Nehýbat se a pít limonádu"],
    emoji: "🤸",
    hints: [
      "Kdy je v odpoledni nejvíc pohybu?",
      "Sezení u obrazovky a chipsy zdravé nejsou.",
    ],
    explanation:
      "Zdravější je jít si zahrát ven na hřiště — je tam pohyb a čerstvý vzduch. Sezení u obrazovky s chipsy a limonádou tělu neprospívá.",
  },
  {
    question: "K čemu je dobrá pravidelná hygiena, třeba mytí rukou a sprchování?",
    correctAnswer: "Chrání nás před bakteriemi a nemocemi",
    options: ["Nemá vůbec žádný smysl", "Slouží jen k tomu, abychom voněli", "Škodí zdraví a oslabuje tělo", "Chrání nás před bakteriemi a nemocemi"],
    emoji: "🚿",
    hints: [
      "Co z těla a rukou odstraníme, když se myjeme?",
      "Bakterie mohou způsobit nemoc — hygiena je odstraní.",
    ],
    explanation:
      "Pravidelná hygiena nás chrání před bakteriemi a nemocemi. Mytím odstraníme z těla a rukou nečistoty a choroboplodné bakterie.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Proč si po sladkém jídle čistíme zuby?",
    correctAnswer: "Cukr zbylý na zubech by je jinak poškozoval a vznikl by kaz",
    options: [
      "Cukr zbylý na zubech by je jinak poškozoval a vznikl by kaz",
      "Protože po sladkém zuby změní barvu na modrou",
      "Protože sladké jídlo zuby posiluje",
      "Není k tomu žádný důvod",
    ],
    emoji: "🦷",
    hints: [
      "Co zůstane na zubech po sladkém a co to způsobí?",
      "Spoj dvě věci: cukr na zubech → vznik kazu.",
    ],
    explanation:
      "Po sladkém zůstane na zubech cukr, který je poškozuje a vzniká z něj kaz. Čištěním cukr odstraníme, a tak zubům pomůžeme.",
  },
  {
    question: "Kamarád tvrdí, že je zdravější pít celý den kolu než vodu. Jak to opravíš?",
    correctAnswer: "Zdravější je voda — kola má hodně cukru, který škodí zubům i tělu",
    options: ["Kamarád má pravdu, kola je nejzdravější nápoj", "Zdravější je voda — kola má hodně cukru, který škodí zubům i tělu", "Voda i kola jsou úplně stejně zdravé", "Nejzdravější je nepít vůbec nic"],
    emoji: "💧",
    hints: [
      "Porovnej vodu a kolu podle množství cukru.",
      "Který nápoj tělu opravdu prospívá a nemá cukr?",
    ],
    explanation:
      "Zdravější je voda, protože nemá cukr. Kola obsahuje hodně cukru, který škodí zubům i tělu. Nepít vůbec nic ale také nejde — tělo vodu potřebuje.",
  },
  {
    question: "Které dvě věci k sobě patří jako zdravé návyky?",
    correctAnswer: "Pravidelný pohyb a dostatek spánku",
    options: ["Celodenní televize a samé bonbony", "Málo vody a žádná hygiena", "Pravidelný pohyb a dostatek spánku", "Přejídání a nulový pohyb"],
    emoji: "💪",
    hints: [
      "Obě věci musí tělu prospívat.",
      "Televize, bonbony a přejídání ke zdravým návykům nepatří.",
    ],
    explanation:
      "Pravidelný pohyb i dostatek spánku jsou zdravé návyky — tělo posilují a nechají ho odpočinout. Ostatní dvojice tělu naopak škodí.",
  },
  {
    question: "Proč se cítíme unavení a nesoustředění, když se v noci moc nevyspíme?",
    correctAnswer: "Tělo si přes krátký spánek nestihlo odpočinout a nabrat energii",
    options: ["Protože jsme přes noc příliš odpočatí", "Protože málo spánku dodá tělu moc energie", "S únavou spánek vůbec nesouvisí", "Tělo si přes krátký spánek nestihlo odpočinout a nabrat energii"],
    emoji: "😪",
    hints: [
      "K čemu tělu spánek slouží?",
      "Když spánku bylo málo, co tělo nestihlo?",
    ],
    explanation:
      "Při krátkém spánku si tělo nestihne odpočinout a nabrat energii, proto jsme pak unavení a nesoustředění. Dost spánku únavě předchází.",
  },
  {
    question: "Maminka řekne, ať si po hraní na zahradě před svačinou umyješ ruce. Proč to chce?",
    correctAnswer: "Na rukou jsou po hraní bakterie, které bychom si jinak dali s jídlem do úst",
    options: [
      "Na rukou jsou po hraní bakterie, které bychom si jinak dali s jídlem do úst",
      "Protože mokré ruce lépe drží svačinu",
      "Protože se čisté ruce nesmějí špinit jídlem",
      "Není k tomu žádný důvod, jen tak",
    ],
    emoji: "🧼",
    hints: [
      "Co se na ruce dostane při hraní venku?",
      "Spoj dvě věci: špinavé ruce → bakterie v jídle.",
    ],
    explanation:
      "Po hraní venku jsou na rukou bakterie a nečistoty. Kdybychom si ruce neumyli, dostali bychom je se svačinou do úst a mohli onemocnět.",
  },
  {
    question: "Proč nestačí ke zdraví jen zdravě jíst, ale je potřeba se i hýbat?",
    correctAnswer: "Pohyb posiluje svaly a srdce, které samotné jídlo neposílí",
    options: ["Protože po jídle se člověk nesmí ani pohnout", "Pohyb posiluje svaly a srdce, které samotné jídlo neposílí", "Protože zdravé jídlo tělu naopak škodí", "Pohyb se zdravím vůbec nesouvisí"],
    emoji: "🏃",
    hints: [
      "Co dělá s tělem pohyb, co jídlo samo neumí?",
      "Spoj dvě věci: zdravé jídlo i pohyb dohromady.",
    ],
    explanation:
      "Ke zdraví patří jak zdravé jídlo, tak pohyb — pohyb posiluje svaly a srdce, což samotné jídlo nedokáže. Proto je dobré obojí spojit.",
  },
  {
    question: "Petr sní k obědu jen tabulku čokolády. Co mu chybí, aby byl oběd zdravý?",
    correctAnswer: "Zelenina, pečivo nebo maso a k pití voda — čokoláda je samý cukr",
    options: ["Nic, čokoláda je úplně vyvážený oběd", "Ještě víc čokolády a sladká limonáda", "Zelenina, pečivo nebo maso a k pití voda — čokoláda je samý cukr", "Jen další bonbony jako zákusek"],
    emoji: "🍽️",
    hints: [
      "Co zdravému obědu chybí, když je v něm jen sladké?",
      "Přemýšlej, z čeho se skládá vyvážené jídlo.",
    ],
    explanation:
      "Čokoláda je samý cukr, takže Petrovi chybí zelenina, pečivo nebo maso a k pití voda. Zdravý oběd je vyvážený, ne jen sladký.",
  },
  {
    question: "Proč je lepší svačina jablko než sáček bonbonů, i když obojí zasytí?",
    correctAnswer: "Jablko má vitamíny a neškodí zubům, bonbony jsou skoro jen cukr",
    options: ["Jablko i bonbony jsou úplně stejně zdravé", "Bonbony jsou zdravější, protože jsou sladší", "Jablko škodí zubům víc než bonbony", "Jablko má vitamíny a neškodí zubům, bonbony jsou skoro jen cukr"],
    emoji: "🍏",
    hints: [
      "Porovnej, co dobrého tělu dodá jablko a co bonbony.",
      "Spoj dvě věci: jablko má vitamíny navíc a míň škodí zubům.",
    ],
    explanation:
      "Jablko je lepší svačina, protože má vitamíny a zubům neškodí. Bonbony sice zasytí, ale jsou skoro jen cukr, který zubům škodí.",
  },
  {
    question: "Kamarád tvrdí, že když se ráno pořádně nají, nemusí pak celý den nic pít. Jak to opravíš?",
    correctAnswer: "Jídlo pití nenahradí — tělo potřebuje vodu pravidelně po celý den",
    options: [
      "Jídlo pití nenahradí — tělo potřebuje vodu pravidelně po celý den",
      "Kamarád má pravdu, po vydatné snídani se pít nemusí",
      "Stačí se napít jen jednou za týden",
      "Místo pití stačí sníst víc bonbonů",
    ],
    emoji: "💧",
    hints: [
      "Může jídlo nahradit pití?",
      "Spoj dvě věci: vodu doplňujeme pitím, a to pravidelně během dne.",
    ],
    explanation:
      "Jídlo pití nenahradí — tělo vodu potřebuje pravidelně po celý den. I když se kamarád dobře nasnídá, musí během dne pít, aby tělu voda nechyběla.",
  },
  {
    question: "Pravidelný pohyb je pro tělo zdravější než celý den sedět. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🤸",
    hints: [
      "Co posiluje svaly a srdce — pohyb, nebo sezení?",
    ],
    explanation:
      "Ano, to je pravda — pohyb posiluje svaly i srdce, kdežto celodenní sezení tělu neprospívá.",
  },
  {
    question: "Voda je zdravější nápoj než slazená limonáda. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "💧",
    hints: [
      "Porovnej vodu a limonádu podle množství cukru.",
    ],
    explanation:
      "Ano, to je pravda — voda nemá cukr a tělu prospívá, kdežto limonáda obsahuje hodně cukru.",
  },
  {
    question: "Čištění zubů a mytí rukou patří obojí ke zdravé hygieně. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🪥",
    hints: [
      "Obě činnosti nás chrání před bakteriemi — patří k hygieně?",
    ],
    explanation:
      "Ano, to je pravda — čištění zubů i mytí rukou jsou součástí hygieny a chrání nás před bakteriemi a nemocemi.",
  },
  {
    question: "Zdravé je nahradit spánek tím, že se celou noc díváme na televizi. Je to pravda?",
    correctAnswer: NE,
    options: [ANO, NE],
    emoji: "📺",
    hints: [
      "Co by tělu chybělo, kdyby místo spánku sledovalo televizi?",
    ],
    explanation:
      "Ne, to není pravda — tělo potřebuje spánek, aby si odpočinulo. Sledování televize místo spánku zdraví škodí.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1.map(toTask);
  return shuffle(pool);
}

export const ZDRAVYZIVOTNISTYL: TopicMetadata[] = [
  {
    id: "g2-prv-zdravy-styl",
    rvpNodeId: "g2-prvouka-clovek-a-jeho-zdravi-zdravy-zivotni-styl-pohyb-odpocinek-spanek-pitny-rezim",
    title: "Zdravý životní styl – pohyb, odpočinek, spánek, pitný režim",
    studentTitle: "Jak zůstat zdravý",
    subject: "prvouka",
    category: "Člověk a jeho zdraví",
    topic: "Zdravý životní styl",
    briefDescription: "Jak žít zdravě a pečovat o tělo.",
    keywords: ["zdraví", "pohyb", "spánek", "voda", "ovoce", "hygiena"],
    goals: [
      "Vědět, co je zdravé pro tělo.",
      "Znát význam spánku, pohybu a pití.",
      "Rozlišit zdravé a nezdravé návyky.",
    ],
    boundaries: ["Pouze základní návyky.", "Bez výživových tabulek."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Zdravě žijeme: jíme ovoce, hýbeme se, pijeme vodu a spíme.",
      steps: ["Přečti větu.", "Je to zdravé, nebo ne?"],
      commonMistake: "Málo vody a jen bonbony nejsou zdravé.",
      example: "Ovoce je zdravé, pohyb posiluje tělo, spánek je důležitý.",
    },
  },
];
