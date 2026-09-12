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
  /** [malá, velká] nápověda — obě vlastní pro tuto větu. */
  hints: [string, string];
  solution: string;
  /** Proč je chybná volba (opak klíče) špatně. */
  feedback: string;
}

function toTask(item: TrueFalseItem): PracticeTask {
  const wrong = item.correct ? NE : ANO;
  return {
    question: item.question,
    correctAnswer: item.correct ? ANO : NE,
    options: [ANO, NE],
    emoji: item.emoji,
    hints: [...item.hints],
    explanation: item.solution,
    optionFeedback: { [wrong]: item.feedback },
  };
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3) pro 2. ročník.
//   L1 = rozpoznání jednoho izolovaného návyku jako zdravého či
//        nezdravého — formát Ano/Ne (2 možnosti), jen zde.
//   L2 = aplikace: výběr zdravé volby ze 4 možností, přiřazení
//        činnosti k potřebě těla (spánek, pohyb, pití, hygiena).
//   L3 = transfer: „proč“ je něco zdravé, spojení dvou informací,
//        oprava miskoncepce, porovnání dvou dětí/voleb, rada
//        kamarádovi — vždy 4 možnosti, žádné Ano/Ne.
// Každá úloha: 2 vlastní nápovědy (malá → velká), vysvětlení PROČ
// a optionFeedback ke každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Zuby si čistíme každý den. Je to pravda?",
    correct: true,
    emoji: "🦷",
    hints: [
      "Čisté zuby chrání před zubním kazem — jak často je čistíme?",
      "Vzpomeň si na koupelnu ráno po probuzení a večer před spaním. Co tam pokaždé děláš s kartáčkem a pastou?",
    ],
    solution: "Zuby si čistíme každý den — ráno a večer, aby se nekazily.",
    feedback: "Zuby se čistí opravdu každý den, ráno i večer. Věta platí.",
  },
  {
    question: "Spánek je pro tělo důležitý. Je to pravda?",
    correct: true,
    emoji: "😴",
    hints: [
      "V noci si tělo odpočine a nabere energii — je spánek důležitý?",
      "Vzpomeň si, jak se cítíš ráno, když ses dobře vyspal, a jak, když jsi šel spát moc pozdě. Kdy máš víc síly?",
    ],
    solution: "Spánek je důležitý — tělo si při něm odpočine a nabere sílu na další den.",
    feedback: "Bez spánku by tělo nemělo sílu. Spánek je opravdu důležitý, věta platí.",
  },
  {
    question: "Zdravé je pít málo vody. Je to pravda?",
    correct: false,
    emoji: "💧",
    hints: [
      "Tělo vodu pořád potřebuje — je zdravější pít málo, nebo dost?",
      "Když celý den skoro nepiješ, začne tě bolet hlava a jsi unavený. Co to tělu chybí a kolik by ho mělo dostat?",
    ],
    solution: "Zdravé není pít málo vody — tělo jí potřebuje dost, proto pijeme pravidelně během dne.",
    feedback: "Tělo potřebuje vody dost. Pít málo zdravé nepovažujeme, věta neplatí.",
  },
  {
    question: "Ovoce je zdravé. Je to pravda?",
    correct: true,
    emoji: "🍎",
    hints: [
      "Ovoce obsahuje vitamíny — prospívají tělu?",
      "Vzpomeň si na jablko, banán nebo jahody. Proč nám rodiče dávají ovoce do svačiny místo bonbonů?",
    ],
    solution: "Ovoce je zdravé — obsahuje vitamíny, které tělo potřebuje.",
    feedback: "Ovoce má vitamíny a tělu prospívá. Věta platí.",
  },
  {
    question: "Pohyb a sport jsou pro tělo zdravé. Je to pravda?",
    correct: true,
    emoji: "🏃",
    hints: [
      "Při pohybu pracují svaly a srdce — posiluje je to?",
      "Když běháš, skáčeš nebo jezdíš na kole, bije ti rychleji srdce a pracují svaly. Sílí tělo, když ho takhle cvičíš?",
    ],
    solution: "Pohyb je zdravý — sportem a hrou posilujeme svaly i srdce.",
    feedback: "Pohyb posiluje svaly i srdce, proto je zdravý. Věta platí.",
  },
  {
    question: "Před jídlem si myjeme ruce. Je to pravda?",
    correct: true,
    emoji: "🧼",
    hints: [
      "Na rukou jsou bakterie — kdy je omyjeme, abychom je nesnědli?",
      "Rukama sahám na kliky, hračky i zábradlí. Pak jimi beru chleba do pusy. Co je dobré udělat mezi tím?",
    ],
    solution: "Před jídlem si myjeme ruce — smyjeme bakterie, abychom je nedostali do úst.",
    feedback: "Mytí rukou před jídlem nás chrání před bakteriemi. Věta platí.",
  },
  {
    question: "Zdravé je jíst celý den jenom bonbony. Je to pravda?",
    correct: false,
    emoji: "🍬",
    hints: [
      "Bonbony jsou sladké, ale samy tělu nestačí — co ještě potřebuje?",
      "Bonbony jsou skoro jen cukr. Tělo ale potřebuje i vitamíny z ovoce a zeleniny, pečivo a mléko. Najdeš to v bonbonech?",
    ],
    solution: "Zdravé není jíst jen bonbony — tělo potřebuje i ovoce, zeleninu, pečivo a mléčné výrobky.",
    feedback: "Samé bonbony jsou jen cukr a kazí zuby. Tělu chybí vitamíny, věta neplatí.",
  },
  {
    question: "Zelenina je zdravá. Je to pravda?",
    correct: true,
    emoji: "🥦",
    hints: [
      "Mrkev, brokolice i salát dodávají vitamíny — jsou zdravé?",
      "Zelenina roste na zahradě a na poli. Dává tělu vitamíny a pomáhá trávení. Prospívá tedy tělu, nebo mu škodí?",
    ],
    solution: "Zelenina je zdravá — dodává tělu vitamíny a vlákninu.",
    feedback: "Zelenina má vitamíny a vlákninu, je zdravá. Věta platí.",
  },
  {
    question: "Dítěti stačí spát jen jednu hodinu za noc. Je to pravda?",
    correct: false,
    emoji: "🛌",
    hints: [
      "Jedna hodina je hodně málo — kolik hodin spánku dítě potřebuje?",
      "Spočítej si to: když jdeš spát v osm večer a vstáváš v sedm ráno, kolik hodin jsi spal? Bylo by jich dost, kdyby to byla jen jedna?",
    ],
    solution: "Jedna hodina nestačí — dítě potřebuje kolem deseti hodin spánku za noc.",
    feedback: "Po jedné hodině spánku by bylo dítě velmi unavené. Potřebuje asi deset hodin, věta neplatí.",
  },
  {
    question: "Hrát si a běhat venku je zdravé. Je to pravda?",
    correct: true,
    emoji: "⚽",
    hints: [
      "Pohyb na čerstvém vzduchu tělu prospívá — je zdravý?",
      "Venku se proběhneš, nadýcháš čerstvého vzduchu a posílíš svaly. Je to pro tělo dobré, nebo špatné?",
    ],
    solution: "Hrát si a běhat venku je zdravé — pohyb na čerstvém vzduchu tělu prospívá.",
    feedback: "Pohyb venku na čerstvém vzduchu je zdravý. Věta platí.",
  },
  {
    question: "Zdravé je celý den jen sedět u televize. Je to pravda?",
    correct: false,
    emoji: "📺",
    hints: [
      "Celý den bez pohybu tělu nesvědčí — co bychom měli střídat?",
      "Když sedíš celý den, svaly nepracují a oči se unaví od obrazovky. Co by tělo potřebovalo místo toho aspoň část dne?",
    ],
    solution: "Zdravé není celý den sedět u televize — je potřeba střídat pohyb, hru i odpočinek.",
    feedback: "Celodenní sezení bez pohybu tělu škodí. Věta neplatí.",
  },
  {
    question: "Ráno je dobré nasnídat se. Je to pravda?",
    correct: true,
    emoji: "🍞",
    hints: [
      "Po noci je tělo bez energie — co ji ráno doplní?",
      "Celou noc jsi nejedl a ráno tě čeká škola. Z čeho bude mít tělo sílu na učení a na hraní o přestávce?",
    ],
    solution: "Ráno je dobré se nasnídat — snídaně dodá tělu energii na dopoledne.",
    feedback: "Snídaně dodá energii na dopoledne, proto je dobrá. Věta platí.",
  },
  {
    question: "Odpočinek tělu škodí. Je to pravda?",
    correct: false,
    emoji: "🧘",
    hints: [
      "Jak se cítíme po dobrém odpočinku — hůř, nebo líp?",
      "Po dlouhém běhání si sedneš a vydechneš. Za chvíli máš zase sílu. Pomohl ti ten odpočinek, nebo ti ublížil?",
    ],
    solution: "Odpočinek tělu neškodí — naopak ho potřebujeme, abychom nabrali sílu.",
    feedback: "Odpočinek tělu pomáhá nabrat sílu, neškodí. Věta neplatí.",
  },
  {
    question: "Myjeme se a sprchujeme se pravidelně. Je to pravda?",
    correct: true,
    emoji: "🚿",
    hints: [
      "Hygiena chrání zdraví — myjeme se pravidelně, nebo nikdy?",
      "Vzpomeň si na večer: vana nebo sprcha, mýdlo, ručník. Proč to děláme skoro každý den a ne jen jednou za čas?",
    ],
    solution: "Myjeme se pravidelně — hygiena chrání zdraví a odstraňuje bakterie.",
    feedback: "Pravidelné mytí patří k hygieně a chrání zdraví. Věta platí.",
  },
  {
    question: "Mrkev je zdravá. Je to pravda?",
    correct: true,
    emoji: "🥕",
    hints: [
      "Mrkev je zelenina plná vitamínů — je zdravá, nebo škodlivá?",
      "Mrkev je oranžová zelenina, která roste v zemi. Říká se, že prospívá očím. Patří tedy mezi zdravé jídlo?",
    ],
    solution: "Mrkev je zdravá — obsahuje vitamíny, které prospívají očím i celému tělu.",
    feedback: "Mrkev je zelenina plná vitamínů, je zdravá. Věta platí.",
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
      "Balíček chipsů a sladký džus",
    ],
    emoji: "🍎",
    hints: [
      "Hledej svačinu s ovocem a pečivem, ne samý cukr.",
      "U každé svačiny se zeptej, jestli je v ní něco s vitamíny a něco, co opravdu zasytí. Sladkosti a slazené nápoje jsou hlavně cukr.",
    ],
    explanation:
      "Nejzdravější svačina je jablko a chléb se sýrem — má vitamíny i výživu. Čokoláda, bonbony, chipsy i slazené nápoje jsou samý cukr nebo sůl.",
    optionFeedback: {
      "Tabulka čokolády a kola": "Čokoláda i kola jsou plné cukru, zdravá svačina to není.",
      "Sáček bonbonů a limonáda": "Bonbony a limonáda jsou skoro jen cukr.",
      "Balíček chipsů a sladký džus": "Chipsy jsou slané a mastné a džus je slazený.",
    },
  },
  {
    question: "Co je nejlepší pít, když máš žízeň?",
    correctAnswer: "Vodu",
    options: ["Sladkou limonádu", "Vodu", "Kolu", "Energetický nápoj"],
    emoji: "💧",
    hints: [
      "Který nápoj tělu nejvíc prospívá a neobsahuje cukr?",
      "Slazené nápoje žízeň zaženou jen na chvíli a kazí zuby. Hledej nápoj, který teče z kohoutku a nemá žádnou příchuť.",
    ],
    explanation:
      "Nejlepší je pít vodu — tělu prospívá a nemá cukr. Limonáda, kola i energetické nápoje obsahují hodně cukru.",
    optionFeedback: {
      "Sladkou limonádu": "Limonáda má hodně cukru, který škodí zubům.",
      Kolu: "Kola má hodně cukru a pro děti se nehodí.",
      "Energetický nápoj": "Energetické nápoje jsou pro děti nevhodné, mají cukr i povzbuzující látky.",
    },
  },
  {
    question: "Co pomáhá tělu, aby bylo silné a zdravé?",
    correctAnswer: "Pravidelný pohyb a sport",
    options: ["Celodenní sezení u počítače", "Přejídání se sladkostmi", "Pravidelný pohyb a sport", "Vynechávání spánku"],
    emoji: "🏃",
    hints: [
      "Co posiluje svaly a srdce?",
      "Tři možnosti tělo oslabují: sezení, sladkosti a málo spánku. Hledej tu, při které tělo pracuje a sílí.",
    ],
    explanation:
      "Tělu pomáhá pravidelný pohyb a sport — posiluje svaly a srdce. Sezení, přejídání a málo spánku naopak škodí.",
    optionFeedback: {
      "Celodenní sezení u počítače": "Při sezení svaly nepracují a tělo slábne.",
      "Přejídání se sladkostmi": "Moc sladkostí tělu škodí a kazí zuby.",
      "Vynechávání spánku": "Bez spánku si tělo neodpočine a slábne.",
    },
  },
  {
    question: "Kdy si máme čistit zuby?",
    correctAnswer: "Ráno a večer",
    options: ["Jen jednou za týden", "Nikdy, není to potřeba", "Jen když nás bolí", "Ráno a večer"],
    emoji: "🦷",
    hints: [
      "Zuby čistíme na začátku i na konci dne.",
      "Přes noc se na zubech usadí zbytky jídla a přes den znovu. Kdy je potřeba je odstranit, aby se nevytvořil kaz?",
    ],
    explanation:
      "Zuby si čistíme ráno a večer, abychom je chránili před kazem. Čistit je jednou za týden nebo vůbec by zubům škodilo.",
    optionFeedback: {
      "Jen jednou za týden": "Za týden se na zubech nahromadí spousta zbytků jídla a vznikne kaz.",
      "Nikdy, není to potřeba": "Bez čištění by se zuby rychle kazily.",
      "Jen když nás bolí": "Když zub bolí, kaz už tam většinou je. Čistíme proto, aby vůbec nevznikl.",
    },
  },
  {
    question: "Co uděláme, než si sedneme k obědu?",
    correctAnswer: "Umyjeme si ruce mýdlem",
    options: [
      "Umyjeme si ruce mýdlem",
      "Otřeme si ruce do kalhot",
      "Pohladíme psa a hned jíme",
      "Nic, ruce myjeme jen ráno",
    ],
    emoji: "🧼",
    hints: [
      "Na rukou jsou bakterie — co s nimi před jídlem uděláme?",
      "Bakterie na rukou nejsou vidět. Otřením do oblečení nezmizí. Co je z rukou opravdu smyje, než vezmeš lžíci?",
    ],
    explanation:
      "Před jídlem si umyjeme ruce mýdlem, abychom smyli bakterie. Špinavýma rukama bychom si je dali do úst a mohli onemocnět.",
    optionFeedback: {
      "Otřeme si ruce do kalhot": "Otřením do kalhot bakterie nezmizí, jen se přesunou.",
      "Pohladíme psa a hned jíme": "Po pohlazení psa jsou ruce ještě špinavější.",
      "Nic, ruce myjeme jen ráno": "Přes den se ruce znovu ušpiní, myjeme je hlavně před jídlem.",
    },
  },
  {
    question: "Co dělá tělo, když v noci spíme?",
    correctAnswer: "Odpočívá a nabírá novou energii",
    options: ["Pracuje víc než přes den", "Odpočívá a nabírá novou energii", "Nic se s ním neděje", "Ztrácí sílu a slábne"],
    emoji: "😴",
    hints: [
      "Jak se cítíme ráno po dobrém spánku?",
      "Večer jsi unavený a ráno po spánku máš zase chuť běhat. Co se v noci s tvým tělem dělo, že máš sílu zpátky?",
    ],
    explanation:
      "Když spíme, tělo odpočívá a nabírá energii na další den. Proto se po dobrém spánku cítíme svěží a plní síly.",
    optionFeedback: {
      "Pracuje víc než přes den": "Ve spánku tělo naopak odpočívá, nepracuje víc.",
      "Nic se s ním neděje": "Ve spánku tělo nabírá sílu a regeneruje, děje se toho hodně.",
      "Ztrácí sílu a slábne": "Spánek sílu dodává, neubírá.",
    },
  },
  {
    question: "Která z těchto věcí zubům škodí nejvíc?",
    correctAnswer: "Jíst hodně sladkostí a nečistit si zuby",
    options: ["Čistit si zuby ráno a večer", "Jíst mrkev a jablka", "Jíst hodně sladkostí a nečistit si zuby", "Pít vodu"],
    emoji: "🍭",
    hints: [
      "Co na zubech zůstane po sladkém a způsobí kaz?",
      "Pozor, hledáš to, co zubům škodí. Tři možnosti zubům pomáhají nebo jim nevadí, jedna spojuje dvě špatné věci najednou.",
    ],
    explanation:
      "Zubům nejvíc škodí hodně sladkostí a nečištění — cukr na zubech způsobuje kaz. Čištění, mrkev, jablka i voda zubům prospívají.",
    optionFeedback: {
      "Čistit si zuby ráno a večer": "Čištění zuby chrání, neškodí jim.",
      "Jíst mrkev a jablka": "Mrkev a jablka jsou zdravé a zuby při kousání dokonce čistí.",
      "Pít vodu": "Voda zubům neškodí, nemá cukr.",
    },
  },
  {
    question: "Co patří ke zdravému dni dítěte?",
    correctAnswer: "Pohyb venku, zdravé jídlo a dost spánku",
    options: ["Celý den u televize a samé sladkosti", "Žádný pohyb a spánek jednu hodinu", "Jen sezení a slazené nápoje", "Pohyb venku, zdravé jídlo a dost spánku"],
    emoji: "🌞",
    hints: [
      "Zdravý den spojuje víc dobrých návyků najednou, ne jen jeden.",
      "Zkontroluj u každé možnosti pohyb, jídlo i spánek. Hledáš den, ve kterém jsou všechny tři věci v pořádku.",
    ],
    explanation:
      "Ke zdravému dni patří pohyb venku, zdravé jídlo a dost spánku. Televize po celý den, sladkosti a málo spánku tělu škodí.",
    optionFeedback: {
      "Celý den u televize a samé sladkosti": "Žádný pohyb a samý cukr, to zdravý den není.",
      "Žádný pohyb a spánek jednu hodinu": "Bez pohybu a skoro bez spánku by tělo strádalo.",
      "Jen sezení a slazené nápoje": "Sezení a sladké pití tělu nepomáhají.",
    },
  },
  {
    question: "Kolik spánku potřebuje dítě, aby bylo přes den čilé?",
    correctAnswer: "Kolem deseti hodin za noc",
    options: ["Kolem deseti hodin za noc", "Jen jednu hodinu za noc", "Stačí zdřímnout si odpoledne", "Nejvýš tři hodiny"],
    emoji: "🛌",
    hints: [
      "Děti spí víc než dospělí — kolik hodin to asi je?",
      "Spočítej svou noc: když jdeš spát kolem osmé večer a vstáváš kolem šesté nebo sedmé ráno, kolik hodin to je?",
    ],
    explanation:
      "Dítě potřebuje kolem deseti hodin spánku za noc, aby bylo přes den odpočaté a čilé. Jedna nebo tři hodiny by zdaleka nestačily.",
    optionFeedback: {
      "Jen jednu hodinu za noc": "Jedna hodina je hodně málo, dítě by bylo celý den unavené.",
      "Stačí zdřímnout si odpoledne": "Krátký odpolední spánek nenahradí celou noc.",
      "Nejvýš tři hodiny": "Tři hodiny nestačí ani dospělému, natož dítěti.",
    },
  },
  {
    question: "Proč je dobré jíst ovoce a zeleninu?",
    correctAnswer: "Obsahují vitamíny, které tělo potřebuje",
    options: ["Obsahují hodně cukru a barviv", "Obsahují vitamíny, které tělo potřebuje", "Nemají pro tělo žádný význam", "Škodí zubům víc než bonbony"],
    emoji: "🥗",
    hints: [
      "Co dobrého ovoce a zelenina tělu dodávají?",
      "Když jsi nemocný, maminka ti dá citron nebo jablko. Co v nich je, co tělu pomáhá být zdravé a odolné?",
    ],
    explanation:
      "Ovoce a zeleninu jíme kvůli vitamínům, které tělo potřebuje, aby bylo zdravé. Na rozdíl od bonbonů zubům neškodí.",
    optionFeedback: {
      "Obsahují hodně cukru a barviv": "Cukr a barviva jsou hlavně v bonbonech, ne v zelenině.",
      "Nemají pro tělo žádný význam": "Ovoce a zelenina jsou pro tělo velmi důležité.",
      "Škodí zubům víc než bonbony": "Bonbony škodí zubům mnohem víc než ovoce a zelenina.",
    },
  },
  {
    question: "Co je zdravější způsob trávení odpoledne?",
    correctAnswer: "Jít si zahrát ven na hřiště",
    options: ["Celé odpoledne sedět u obrazovky", "Ležet a jíst chipsy", "Jít si zahrát ven na hřiště", "Nehýbat se a pít limonádu"],
    emoji: "🤸",
    hints: [
      "Kdy je v odpoledni nejvíc pohybu?",
      "Tři možnosti mají společné to, že se při nich tělo nehýbe. Hledej tu, kde běháš, lezeš a dýcháš čerstvý vzduch.",
    ],
    explanation:
      "Zdravější je jít si zahrát ven na hřiště — je tam pohyb a čerstvý vzduch. Sezení u obrazovky s chipsy a limonádou tělu neprospívá.",
    optionFeedback: {
      "Celé odpoledne sedět u obrazovky": "Celé odpoledne u obrazovky je bez pohybu a unaví oči.",
      "Ležet a jíst chipsy": "Ležení bez pohybu a mastné chipsy tělu neprospívají.",
      "Nehýbat se a pít limonádu": "Bez pohybu a se sladkým pitím tělo nesílí.",
    },
  },
  {
    question: "K čemu je dobrá pravidelná hygiena, třeba mytí rukou a sprchování?",
    correctAnswer: "Chrání nás před bakteriemi a nemocemi",
    options: ["Nemá vůbec žádný smysl", "Slouží jen k tomu, abychom voněli", "Škodí zdraví a oslabuje tělo", "Chrání nás před bakteriemi a nemocemi"],
    emoji: "🚿",
    hints: [
      "Co z těla a rukou odstraníme, když se myjeme?",
      "Vůně je příjemná, ale není to hlavní důvod. Mysli na to, co nejde vidět a co by nás mohlo udělat nemocnými.",
    ],
    explanation:
      "Pravidelná hygiena nás chrání před bakteriemi a nemocemi. Mytím odstraníme z těla a rukou nečistoty a choroboplodné bakterie.",
    optionFeedback: {
      "Nemá vůbec žádný smysl": "Hygiena má velký smysl, chrání zdraví.",
      "Slouží jen k tomu, abychom voněli": "Vůně je jen příjemný bonus. Hlavně odstraníme bakterie.",
      "Škodí zdraví a oslabuje tělo": "Mytí zdraví neškodí, naopak ho chrání.",
    },
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
      "Protože jinak by nám sladké chutnalo ještě víc",
    ],
    emoji: "🦷",
    hints: [
      "Co zůstane na zubech po sladkém a co to způsobí?",
      "Spoj dva kroky: nejdřív co po sladkém na zubech zůstane, pak co to se zubem časem udělá, když to kartáček neodstraní.",
    ],
    explanation:
      "Po sladkém zůstane na zubech cukr, který je poškozuje a vzniká z něj kaz. Čištěním cukr odstraníme, a tak zubům pomůžeme.",
    optionFeedback: {
      "Protože po sladkém zuby změní barvu na modrou": "Zuby po sladkém nezmodrají. Škodí jim cukr, ze kterého vzniká kaz.",
      "Protože sladké jídlo zuby posiluje": "Sladké zuby neposiluje, naopak jim škodí.",
      "Protože jinak by nám sladké chutnalo ještě víc": "Chuť s tím nesouvisí. Čistíme kvůli cukru, který zuby kazí.",
    },
  },
  {
    question: "Kamarád tvrdí, že je zdravější pít celý den kolu než vodu. Jak to opravíš?",
    correctAnswer: "Zdravější je voda — kola má hodně cukru, který škodí zubům i tělu",
    options: [
      "Kamarád má pravdu, kola je nejzdravější nápoj",
      "Zdravější je voda — kola má hodně cukru, který škodí zubům i tělu",
      "Voda i kola jsou úplně stejně zdravé",
      "Nejzdravější je nepít vůbec nic",
    ],
    emoji: "💧",
    hints: [
      "Porovnej vodu a kolu podle množství cukru.",
      "Oprava má dvě části: řekni, který nápoj je zdravější, a vysvětli proč. Mysli na to, co je v kole navíc a co to dělá se zuby.",
    ],
    explanation:
      "Zdravější je voda, protože nemá cukr. Kola obsahuje hodně cukru, který škodí zubům i tělu. Nepít vůbec nic ale také nejde — tělo vodu potřebuje.",
    optionFeedback: {
      "Kamarád má pravdu, kola je nejzdravější nápoj": "Kola má hodně cukru, zdravá není. Kamarád se plete.",
      "Voda i kola jsou úplně stejně zdravé": "Nejsou. Kola má cukr, voda ne.",
      "Nejzdravější je nepít vůbec nic": "Tělo vodu potřebuje, bez pití by strádalo.",
    },
  },
  {
    question: "Které dvě věci k sobě patří jako zdravé návyky?",
    correctAnswer: "Pravidelný pohyb a dostatek spánku",
    options: ["Celodenní televize a samé bonbony", "Málo vody a žádná hygiena", "Pravidelný pohyb a dostatek spánku", "Přejídání a nulový pohyb"],
    emoji: "💪",
    hints: [
      "Obě věci ve dvojici musí tělu prospívat.",
      "Zkontroluj každou dvojici po částech: je zdravá první věc? A je zdravá i druhá? Správná dvojice projde oběma kontrolami.",
    ],
    explanation:
      "Pravidelný pohyb i dostatek spánku jsou zdravé návyky — tělo posilují a nechají ho odpočinout. Ostatní dvojice tělu naopak škodí.",
    optionFeedback: {
      "Celodenní televize a samé bonbony": "Obě věci tělu škodí, žádná zdravá.",
      "Málo vody a žádná hygiena": "Málo pití i špína zdraví škodí.",
      "Přejídání a nulový pohyb": "Přejídání a nehybnost jsou nezdravé návyky.",
    },
  },
  {
    question: "Proč se cítíme unavení a nesoustředění, když se v noci moc nevyspíme?",
    correctAnswer: "Tělo si přes krátký spánek nestihlo odpočinout a nabrat energii",
    options: [
      "Protože jsme přes noc příliš odpočatí",
      "Protože málo spánku dodá tělu moc energie",
      "S únavou spánek vůbec nesouvisí",
      "Tělo si přes krátký spánek nestihlo odpočinout a nabrat energii",
    ],
    emoji: "😪",
    hints: [
      "K čemu tělu spánek slouží?",
      "Spoj dvě věci: co tělo ve spánku dělá a co se stane, když na to má málo času. Proč pak ráno nemáš sílu ani se soustředit?",
    ],
    explanation:
      "Při krátkém spánku si tělo nestihne odpočinout a nabrat energii, proto jsme pak unavení a nesoustředění. Dost spánku únavě předchází.",
    optionFeedback: {
      "Protože jsme přes noc příliš odpočatí": "Po krátkém spánku odpočatí nejsme, je to naopak.",
      "Protože málo spánku dodá tělu moc energie": "Málo spánku energii ubírá, nedodává.",
      "S únavou spánek vůbec nesouvisí": "Souvisí velmi. Málo spánku je hlavní příčina únavy.",
    },
  },
  {
    question: "Maminka řekne, ať si po hraní na zahradě před svačinou umyješ ruce. Proč to chce?",
    correctAnswer: "Na rukou jsou po hraní bakterie, které bychom si jinak dali s jídlem do úst",
    options: [
      "Na rukou jsou po hraní bakterie, které bychom si jinak dali s jídlem do úst",
      "Protože mokré ruce lépe drží svačinu",
      "Protože čisté ruce se nesmějí špinit jídlem",
      "Protože mýdlo svačině dodá lepší chuť",
    ],
    emoji: "🧼",
    hints: [
      "Co se na ruce dostane při hraní venku?",
      "Spoj dvě věci: na čem jsou ruce po hraní na zahradě a co s nimi pak děláš u svačiny. Kam by se ta špína nakonec dostala?",
    ],
    explanation:
      "Po hraní venku jsou na rukou bakterie a nečistoty. Kdybychom si ruce neumyli, dostali bychom je se svačinou do úst a mohli onemocnět.",
    optionFeedback: {
      "Protože mokré ruce lépe drží svačinu": "Po umytí si ruce utřeme. Myjeme je kvůli bakteriím, ne kvůli držení.",
      "Protože čisté ruce se nesmějí špinit jídlem": "Jde o to, aby se špína z rukou nedostala do jídla, ne naopak.",
      "Protože mýdlo svačině dodá lepší chuť": "Mýdlo chuť nezlepší. Smyje bakterie.",
    },
  },
  {
    question: "Proč nestačí ke zdraví jen zdravě jíst, ale je potřeba se i hýbat?",
    correctAnswer: "Pohyb posiluje svaly a srdce, které samotné jídlo neposílí",
    options: [
      "Protože po jídle se člověk nesmí ani pohnout",
      "Pohyb posiluje svaly a srdce, které samotné jídlo neposílí",
      "Protože zdravé jídlo tělu naopak škodí",
      "Protože pohyb nahradí jídlo, takže pak jíst nemusíme",
    ],
    emoji: "🏃",
    hints: [
      "Co dělá s tělem pohyb, co jídlo samo neumí?",
      "Porovnej, co tělu dá jídlo a co pohyb. Jídlo dodá výživu. Co ale posílí svaly a srdce, když je necháš pracovat?",
    ],
    explanation:
      "Ke zdraví patří jak zdravé jídlo, tak pohyb — pohyb posiluje svaly a srdce, což samotné jídlo nedokáže. Proto je dobré obojí spojit.",
    optionFeedback: {
      "Protože po jídle se člověk nesmí ani pohnout": "Po jídle se hýbat smíme, jen ne hned divoce běhat.",
      "Protože zdravé jídlo tělu naopak škodí": "Zdravé jídlo tělu prospívá, jen samo nestačí.",
      "Protože pohyb nahradí jídlo, takže pak jíst nemusíme": "Pohyb jídlo nenahradí. Tělo potřebuje obojí.",
    },
  },
  {
    question: "Petr sní k obědu jen tabulku čokolády. Co mu chybí, aby byl oběd zdravý?",
    correctAnswer: "Zelenina, pečivo nebo maso a k pití voda — čokoláda je samý cukr",
    options: [
      "Nic, čokoláda je úplně vyvážený oběd",
      "Ještě víc čokolády a sladká limonáda",
      "Zelenina, pečivo nebo maso a k pití voda — čokoláda je samý cukr",
      "Jen další bonbony jako zákusek",
    ],
    emoji: "🍽️",
    hints: [
      "Co zdravému obědu chybí, když je v něm jen sladké?",
      "Představ si talíř ve školní jídelně. Co na něm obvykle bývá a co se k němu pije? Porovnej to s tabulkou čokolády.",
    ],
    explanation:
      "Čokoláda je samý cukr, takže Petrovi chybí zelenina, pečivo nebo maso a k pití voda. Zdravý oběd je vyvážený, ne jen sladký.",
    optionFeedback: {
      "Nic, čokoláda je úplně vyvážený oběd": "Čokoláda je jen cukr a tuk, vyvážený oběd to není.",
      "Ještě víc čokolády a sladká limonáda": "Přidat další cukr by oběd ještě zhoršilo.",
      "Jen další bonbony jako zákusek": "Bonbony jsou další cukr, obědu by nepomohly.",
    },
  },
  {
    question: "Proč je lepší svačina jablko než sáček bonbonů, i když obojí zasytí?",
    correctAnswer: "Jablko má vitamíny a neškodí zubům, bonbony jsou skoro jen cukr",
    options: [
      "Jablko i bonbony jsou úplně stejně zdravé",
      "Bonbony jsou zdravější, protože jsou sladší",
      "Jablko škodí zubům víc než bonbony",
      "Jablko má vitamíny a neškodí zubům, bonbony jsou skoro jen cukr",
    ],
    emoji: "🍏",
    hints: [
      "Porovnej, co dobrého tělu dodá jablko a co bonbony.",
      "Porovnej je ve dvou věcech: co dají tělu navíc a co udělají se zuby. Která svačina vyhraje v obou?",
    ],
    explanation:
      "Jablko je lepší svačina, protože má vitamíny a zubům neškodí. Bonbony sice zasytí, ale jsou skoro jen cukr, který zubům škodí.",
    optionFeedback: {
      "Jablko i bonbony jsou úplně stejně zdravé": "Nejsou. Jablko má vitamíny, bonbony skoro jen cukr.",
      "Bonbony jsou zdravější, protože jsou sladší": "Sladší neznamená zdravější. Cukr zubům škodí.",
      "Jablko škodí zubům víc než bonbony": "Je to obráceně, bonbony zubům škodí mnohem víc.",
    },
  },
  {
    question: "Kamarád tvrdí, že když se ráno pořádně nají, nemusí pak celý den nic pít. Jak to opravíš?",
    correctAnswer: "Jídlo pití nenahradí — tělo potřebuje vodu pravidelně po celý den",
    options: [
      "Jídlo pití nenahradí — tělo potřebuje vodu pravidelně po celý den",
      "Kamarád má pravdu, po vydatné snídani se pít nemusí",
      "Stačí se pořádně napít jednou večer",
      "Místo pití stačí sníst víc bonbonů",
    ],
    emoji: "💧",
    hints: [
      "Může jídlo nahradit pití?",
      "Tělo vodu během dne pořád ztrácí, třeba potem při běhání. Stačí ji doplnit jednou, nebo ji musíš doplňovat průběžně?",
    ],
    explanation:
      "Jídlo pití nenahradí — tělo vodu potřebuje pravidelně po celý den. I když se kamarád dobře nasnídá, musí během dne pít, aby tělu voda nechyběla.",
    optionFeedback: {
      "Kamarád má pravdu, po vydatné snídani se pít nemusí": "Snídaně vodu nenahradí, kamarád se plete.",
      "Stačí se pořádně napít jednou večer": "Vodu doplňujeme průběžně, jedno napití večer nestačí.",
      "Místo pití stačí sníst víc bonbonů": "Bonbony vodu nenahradí a navíc kazí zuby.",
    },
  },
  {
    question: "Tomáš celé odpoledne sedí u tabletu, Jana běhá venku s míčem. Kdo dělá pro své tělo víc?",
    correctAnswer: "Jana, protože pohyb posiluje svaly i srdce",
    options: [
      "Tomáš, protože při sezení tělo odpočívá",
      "Jana, protože pohyb posiluje svaly i srdce",
      "Oba stejně, na tom nezáleží",
      "Tomáš, protože tablet procvičí mozek i tělo",
    ],
    emoji: "🤸",
    hints: [
      "Porovnej, při které činnosti tělo pracuje a sílí.",
      "Odpočinek je dobrý, ale celé odpoledne na jednom místě je moc. Kdo z dětí nechá pracovat svaly a srdce a dýchá čerstvý vzduch?",
    ],
    explanation:
      "Víc pro své tělo dělá Jana. Pohyb venku posiluje svaly i srdce, kdežto celé odpoledne u tabletu tělu neprospívá.",
    optionFeedback: {
      "Tomáš, protože při sezení tělo odpočívá": "Chvíle odpočinku je dobrá, ale celé odpoledne sezení tělu neprospívá.",
      "Oba stejně, na tom nezáleží": "Záleží. Pohyb je pro tělo mnohem prospěšnější než celodenní sezení.",
      "Tomáš, protože tablet procvičí mozek i tělo": "Tablet tělo neprocvičí, svaly při tom nepracují.",
    },
  },
  {
    question: "Po běhání máš velkou žízeň. Proč je lepší napít se vody než slazené limonády?",
    correctAnswer: "Voda žízeň zažene a nemá cukr, který škodí zubům",
    options: [
      "Limonáda žízeň zažene líp, protože je sladká",
      "Voda žízeň zažene a nemá cukr, který škodí zubům",
      "Po běhání se nemá pít vůbec nic",
      "Voda má víc vitamínů než ovoce",
    ],
    emoji: "💧",
    hints: [
      "Porovnej vodu a limonádu podle množství cukru.",
      "Po běhání tělo potřebuje doplnit vodu. Oba nápoje vodu obsahují. Co je ale v limonádě navíc a proč to není dobré?",
    ],
    explanation:
      "Voda žízeň zažene a nemá žádný cukr. Limonáda obsahuje hodně cukru, který škodí zubům, a žízeň po ní brzy přijde znovu.",
    optionFeedback: {
      "Limonáda žízeň zažene líp, protože je sladká": "Sladkost žízeň nezažene, spíš ji brzy vrátí.",
      "Po běhání se nemá pít vůbec nic": "Po běhání tělo vodu potřebuje ještě víc.",
      "Voda má víc vitamínů než ovoce": "Voda vitamíny skoro nemá. Je lepší, protože nemá cukr.",
    },
  },
  {
    question: "Co mají společného čištění zubů a mytí rukou?",
    correctAnswer: "Obojí je hygiena, která nás chrání před bakteriemi",
    options: [
      "Obojí je hygiena, která nás chrání před bakteriemi",
      "Obojí je potřeba jen tehdy, když jsme nemocní",
      "Obojí děláme hlavně proto, abychom hezky voněli",
      "Obojí děláme jen jednou za týden",
    ],
    emoji: "🪥",
    hints: [
      "Obě činnosti odstraňují něco neviditelného, co může škodit.",
      "Najdi, co obě činnosti spojuje: kdy je děláme, proč a před čím nás chrání. Pozor na odpověď, která je pravdivá jen napůl.",
    ],
    explanation:
      "Čištění zubů i mytí rukou jsou součástí hygieny. Obojí odstraňuje bakterie, a tím nás chrání před kazem a nemocemi.",
    optionFeedback: {
      "Obojí je potřeba jen tehdy, když jsme nemocní": "Hygiena je potřeba každý den, právě proto, abychom neonemocněli.",
      "Obojí děláme hlavně proto, abychom hezky voněli": "Vůně je jen příjemný bonus. Hlavní je ochrana před bakteriemi.",
      "Obojí děláme jen jednou za týden": "Zuby čistíme dvakrát denně a ruce myjeme několikrát denně.",
    },
  },
  {
    question: "Kamarád se v noci dlouho dívá na televizi a ráno je unavený. Co mu poradíš?",
    correctAnswer: "Aby šel spát včas, protože tělo potřebuje dost spánku",
    options: [
      "Aby se ráno napil koly, to únavu zažene",
      "Aby se díval ještě déle, zvykne si",
      "Aby šel spát včas, protože tělo potřebuje dost spánku",
      "Aby se vyspal o přestávce ve škole",
    ],
    emoji: "📺",
    hints: [
      "Najdi příčinu jeho únavy a pak radu, která ji odstraní.",
      "Spoj dvě věci: co kamarád dělá místo spánku a co tělo v noci potřebuje. Která rada řeší příčinu, a ne jen únavu ráno?",
    ],
    explanation:
      "Kamarád je unavený, protože místo spánku kouká na televizi. Nejlepší rada je chodit spát včas — tělo potřebuje dost spánku, aby si odpočinulo.",
    optionFeedback: {
      "Aby se ráno napil koly, to únavu zažene": "Kola má cukr a spánek nenahradí. Příčina únavy zůstane.",
      "Aby se díval ještě déle, zvykne si": "Na nedostatek spánku si tělo nezvykne, bude ještě unavenější.",
      "Aby se vyspal o přestávce ve škole": "Krátká přestávka noční spánek nenahradí.",
    },
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
