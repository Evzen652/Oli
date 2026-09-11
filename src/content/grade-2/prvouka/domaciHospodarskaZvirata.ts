import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání izolovaného faktu: které zvíře dává mléko/vejce/
//        vlnu/med, jak se jmenuje mládě/samice/samec, jaký vydává zvuk.
//   L2 = aplikace: přiřazení užitku ke zvířeti a obráceně, poznání
//        zvířete podle popisu, kde zvíře bydlí (chlívek/kurník/úl/stáj).
//   L3 = transfer (2 kroky, přiměřeně věku 7-8 let): kombinace dvou
//        faktů zároveň (které zvíře dává X i Y), rozlišení blízkých /
//        zaměnitelných mláďat a samců, řetězec „z čeho se vyrábí“
//        (mléko→sýr, vlna→svetr, peří→peřina).
// Každá úloha: 2 vlastní nápovědy (malá → velká), vysvětlení PROČ
// a optionFeedback ke každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Které zvíře nám dává mléko?",
    correctAnswer: "Kráva",
    options: ["Kráva", "Slepice", "Včela", "Kočka"],
    emoji: "🐄",
    hints: [
      "Mléko pijeme každý den — vzpomeň si, které velké zvíře na farmě zemědělec dojí.",
      "Hledej velké zvíře, které se pase na louce, bučí „bú“ a ráno i večer ho zemědělec podojí do kbelíku nebo dojicím strojem.",
    ],
    solutionSteps: ["Mléko nám dává kráva — zemědělec ji každý den podojí. Z jejího mléka se dělá i sýr a máslo."],
    optionFeedback: {
      Slepice: "Slepice je pták. Mléko nedává, snáší vejce.",
      Včela: "Včela je hmyz, který vyrábí med. Mléko nedává.",
      Kočka: "Kočka mléko sama ráda pije, ale lidé ji nedojí.",
    },
  },
  {
    question: "Které zvíře snáší vejce?",
    correctAnswer: "Slepice",
    options: ["Ovce", "Slepice", "Kráva", "Prase"],
    emoji: "🐔",
    hints: [
      "K snídani si někdy uvaříme vajíčko — které zvíře ho snese?",
      "Vejce snášejí jen ptáci. Najdi mezi možnostmi jediného ptáka, který žije na dvoře, kdáká a spí v kurníku.",
    ],
    solutionSteps: ["Vejce snáší slepice — je to pták a snáší je skoro každý den do hnízda v kurníku."],
    optionFeedback: {
      Ovce: "Ovce vejce nesnáší, rodí živá mláďata. Dává nám vlnu.",
      Kráva: "Kráva vejce nesnáší, dává nám mléko.",
      Prase: "Prase vejce nesnáší, rodí selátka.",
    },
  },
  {
    question: "Které zvíře nám dává vlnu?",
    correctAnswer: "Ovce",
    options: ["Kráva", "Včela", "Ovce", "Kůň"],
    emoji: "🐑",
    hints: [
      "Z vlny se pletou teplé svetry — od kterého zvířete pochází?",
      "Hledej zvíře s hustou kudrnatou srstí, které bečí „bé“. Jednou za rok mu srst ostříhají a z ní se upředou nitě.",
    ],
    solutionSteps: ["Vlnu nám dává ovce — jednou za rok ji zemědělec ostříhá a z vlny se pak pletou svetry."],
    optionFeedback: {
      Kráva: "Kráva má krátkou srst, kterou nikdo nestříhá. Dává mléko.",
      Včela: "Včela je hmyz a vyrábí med, vlnu nemá.",
      Kůň: "Kůň má hřívu a krátkou srst, ale vlna se z něj nestříhá.",
    },
  },
  {
    question: "Které zvíře nám dává med?",
    correctAnswer: "Včela",
    options: ["Slepice", "Koza", "Husa", "Včela"],
    emoji: "🐝",
    hints: [
      "Med je sladký a vzniká z květového nektaru — které zvíře ho dělá?",
      "Hledej malého létajícího tvora, který bzučí, sedá na květy a žije ve velké rodině v dřevěném domečku u zahrady.",
    ],
    solutionSteps: ["Med nám dává včela — sbírá nektar z květů a v úlu z něj vyrábí med."],
    optionFeedback: {
      Slepice: "Slepice snáší vejce. Med nevyrábí.",
      Koza: "Koza dává mléko. Med vyrábí jen drobný hmyz.",
      Husa: "Husa nám dává peří a vejce, ne med.",
    },
  },
  {
    question: "Jak se jmenuje mládě krávy?",
    correctAnswer: "Tele",
    options: ["Tele", "Hříbě", "Jehně", "Sele"],
    emoji: "🐄",
    hints: [
      "Vzpomeň si, jak říkáme malému mláděti, které pije mléko od krávy.",
      "Kráva, býk a jejich mládě patří k sobě. Jméno mláděte je krátké, má jen dvě slabiky a začíná na „t“.",
    ],
    solutionSteps: ["Mládě krávy je tele — kráva, býk a tele patří k sobě."],
    optionFeedback: {
      Hříbě: "Hříbě je mládě koně, ne krávy.",
      Jehně: "Jehně je mládě ovce, ne krávy.",
      Sele: "Sele je mládě prasete, ne krávy.",
    },
  },
  {
    question: "Jak se jmenuje mládě ovce?",
    correctAnswer: "Jehně",
    options: ["Tele", "Jehně", "Kůzle", "Sele"],
    emoji: "🐑",
    hints: [
      "Malé bílé mládě ovce má své vlastní jméno — jaké?",
      "Ovce a beran mají mládě, které se na jaře prohání po louce. Pozor, koza má mládě podobné, ale jmenuje se jinak.",
    ],
    solutionSteps: ["Mládě ovce je jehně — ovce, beran a jehně patří k sobě."],
    optionFeedback: {
      Tele: "Tele je mládě krávy.",
      Kůzle: "Kůzle je mládě kozy. Koza a ovce jsou podobné, ale jsou to dvě různá zvířata.",
      Sele: "Sele je mládě prasete.",
    },
  },
  {
    question: "Jak se jmenuje mládě prasete?",
    correctAnswer: "Sele",
    options: ["Jehně", "Kuře", "Sele", "Tele"],
    emoji: "🐖",
    hints: [
      "Malé růžové mládě prasete má krátké jméno — jaké?",
      "Prase, kanec a jejich mládě patří k sobě. Mládě chrochtá u maminky a jeho jméno má jen dvě slabiky a začíná na „s“.",
    ],
    solutionSteps: ["Mládě prasete je sele — prase, kanec a sele patří k sobě."],
    optionFeedback: {
      Jehně: "Jehně je mládě ovce.",
      Kuře: "Kuře je mládě slepice, vylíhne se z vejce.",
      Tele: "Tele je mládě krávy.",
    },
  },
  {
    question: "Jak se jmenuje mládě slepice?",
    correctAnswer: "Kuře",
    options: ["House", "Káče", "Sele", "Kuře"],
    emoji: "🐤",
    hints: [
      "Ze slepičího vejce se vylíhne malé žluté mládě — jak se jmenuje?",
      "Slepice, kohout a jejich mládě patří k sobě. Mládě pípá, běhá za slepicí po dvoře a jeho jméno začíná na „k“.",
    ],
    solutionSteps: ["Mládě slepice je kuře — slepice, kohout a kuře patří k sobě."],
    optionFeedback: {
      House: "House je mládě husy. Také se líhne z vejce, ale husa je jiný pták.",
      Káče: "Káče je mládě kachny. Umí plavat, kdežto mládě slepice ne.",
      Sele: "Sele je mládě prasete, z vejce se nelíhne.",
    },
  },
  {
    question: "Jak se jmenuje mládě koně?",
    correctAnswer: "Hříbě",
    options: ["Hříbě", "Tele", "Sele", "Kůzle"],
    emoji: "🐴",
    hints: [
      "Malé mládě koně má dlouhé nožky a své vlastní jméno — jaké?",
      "Klisna a hřebec mají mládě, které se brzy po narození postaví na tenké nohy. Jeho jméno se podobá slovu hřebec.",
    ],
    solutionSteps: ["Mládě koně je hříbě — klisna, hřebec a hříbě patří k sobě."],
    optionFeedback: {
      Tele: "Tele je mládě krávy, ne koně.",
      Sele: "Sele je mládě prasete.",
      Kůzle: "Kůzle je mládě kozy.",
    },
  },
  {
    question: "Jak se jmenuje mládě kozy?",
    correctAnswer: "Kůzle",
    options: ["Jehně", "Kůzle", "Tele", "Hříbě"],
    emoji: "🐐",
    hints: [
      "Mládě kozy se snadno splete s mládětem ovce — pozor, má jiné jméno.",
      "Koza a kozel mají mládě, které ráno mečí a poskakuje. Jeho jméno je od slova koza, jen zdrobnělé.",
    ],
    solutionSteps: ["Mládě kozy je kůzle — koza, kozel a kůzle patří k sobě."],
    optionFeedback: {
      Jehně: "Jehně je mládě ovce. Ovce a koza jsou si podobné, proto se to plete.",
      Tele: "Tele je mládě krávy.",
      Hříbě: "Hříbě je mládě koně.",
    },
  },
  {
    question: "Jak se jmenuje samec krávy?",
    correctAnswer: "Býk",
    options: ["Beran", "Kohout", "Býk", "Kozel"],
    emoji: "🐂",
    hints: [
      "Kráva je samice — jak říkáme velkému samci s rohy u téhož druhu?",
      "Kráva, její samec a tele tvoří jednu rodinu. Samec je silný, má rohy, mléko nedává a jeho jméno má jen jednu slabiku.",
    ],
    solutionSteps: ["Samec krávy je býk — kráva, býk a tele patří k sobě."],
    optionFeedback: {
      Beran: "Beran je samec ovce.",
      Kohout: "Kohout je samec slepice.",
      Kozel: "Kozel je samec kozy.",
    },
  },
  {
    question: "Jak se jmenuje samice kohouta?",
    correctAnswer: "Slepice",
    options: ["Kachna", "Husa", "Koza", "Slepice"],
    emoji: "🐔",
    hints: [
      "Kohout ráno kokrhá — jak se jmenuje samice, která snáší vejce?",
      "Kohout, jeho samice a kuře tvoří jednu rodinu. Samice kdáká na dvoře a spí v kurníku.",
    ],
    solutionSteps: ["Samice kohouta je slepice — kohout, slepice a kuře patří k sobě."],
    optionFeedback: {
      Kachna: "Kachna je samice kačera, ne kohouta.",
      Husa: "Husa je samice houseře, ne kohouta.",
      Koza: "Koza není pták. Je to samice kozla.",
    },
  },
  {
    question: "Které zvíře bydlí v úlu?",
    correctAnswer: "Včela",
    options: ["Včela", "Slepice", "Koza", "Kráva"],
    emoji: "🐝",
    hints: [
      "Úl je domeček pro drobný pracovitý hmyz — pro který?",
      "Úl stojí u zahrady nebo na louce. Z malého otvoru v něm neustále vylétají a zase přilétají bzučící létavci.",
    ],
    solutionSteps: ["V úlu bydlí včela — celá včelí rodina žije pohromadě v jednom úlu."],
    optionFeedback: {
      Slepice: "Slepice bydlí v kurníku.",
      Koza: "Koza bydlí v chlévě.",
      Kráva: "Kráva bydlí v kravíně nebo v chlévě.",
    },
  },
  {
    question: "Které zvíře ráno kokrhá?",
    correctAnswer: "Kohout",
    options: ["Kráva", "Kohout", "Ovce", "Husa"],
    emoji: "🐓",
    hints: [
      "Brzy ráno je na farmě slyšet hlasité „kykyryký“ — kdo ho vydává?",
      "Hledej ptáka s červeným hřebínkem a barevným ocasem, který na dvoře hlídá slepice a budí celý statek.",
    ],
    solutionSteps: ["Ráno kokrhá kohout — jeho volání oznamuje začátek dne."],
    optionFeedback: {
      Kráva: "Kráva bučí, nekokrhá.",
      Ovce: "Ovce bečí, nekokrhá.",
      Husa: "Husa kejhá. Kokrhání patří jinému ptákovi.",
    },
  },
  {
    question: "Které zvíře hlídá dům a štěká?",
    correctAnswer: "Pes",
    options: ["Kočka", "Kůň", "Pes", "Ovce"],
    emoji: "🐕",
    hints: [
      "Toto zvíře štěká na cizí lidi a hlídá domov — které to je?",
      "Hledej věrného kamaráda člověka, který bydlí v boudě nebo doma, vrtí ocasem a ozve se „haf“, když přijde cizí.",
    ],
    solutionSteps: ["Dům hlídá pes — štěká na cizí lidi a chrání domov."],
    optionFeedback: {
      Kočka: "Kočka mňouká a loví myši, dům neštěkáním nehlídá.",
      Kůň: "Kůň řehtá a tahá vozy, štěkat neumí.",
      Ovce: "Ovce bečí a dává vlnu. Hlídat neumí.",
    },
  },
  {
    question: "Které zvíře chytá myši?",
    correctAnswer: "Kočka",
    options: ["Pes", "Slepice", "Kráva", "Kočka"],
    emoji: "🐈",
    hints: [
      "Toto zvíře tiše loví hlodavce v domě i na dvoře — které to je?",
      "Hledej šikovného lovce s měkkými tlapkami a ostrými drápky, který umí dlouho čekat u díry a pak rychle skočí. Když je spokojený, přede.",
    ],
    solutionSteps: ["Myši chytá kočka — je to šikovný lovec hlodavců."],
    optionFeedback: {
      Pes: "Pes hlídá dům. Myši obvykle neloví.",
      Slepice: "Slepice zobe zrní, myši nechytá.",
      Kráva: "Kráva se živí trávou a senem, myši neloví.",
    },
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co dostaneme, když ostříháme ovci?",
    correctAnswer: "Vlnu",
    options: ["Vlnu", "Med", "Vejce", "Peří"],
    emoji: "🐑",
    hints: [
      "Přemýšlej, co ovci jednou za rok ostříháme.",
      "Ovce má na sobě hustý kudrnatý kožíšek. Když ho ostříháme, co z něj pak upředeme na pletení teplých svetrů?",
    ],
    solutionSteps: ["Když ostříháme ovci, dostaneme vlnu — z té se pletou teplé svetry."],
    optionFeedback: {
      Med: "Med vyrábějí včely, ovce ne.",
      Vejce: "Vejce snáší slepice. Ovce nesnáší vejce.",
      Peří: "Peří mají ptáci, třeba husy. Ovce má srst.",
    },
  },
  {
    question: "Co nám dává včela?",
    correctAnswer: "Med",
    options: ["Vlnu", "Med", "Vejce", "Mléko"],
    emoji: "🐝",
    hints: [
      "Přiřaď užitek ke správnému zvířeti — co sladkého vyrábí včela?",
      "Včela létá z květu na květ a sbírá sladkou šťávu. V úlu z ní udělá něco, co si mažeme na chleba.",
    ],
    solutionSteps: ["Včela nám dává med — vyrábí ho v úlu z květového nektaru."],
    optionFeedback: {
      Vlnu: "Vlnu dává ovce. Včela vlnu nemá.",
      Vejce: "Vejce, která jíme, snáší slepice.",
      Mléko: "Mléko dává kráva nebo koza, ne hmyz.",
    },
  },
  {
    question: "Co nám dává slepice?",
    correctAnswer: "Vejce",
    options: ["Mléko", "Vlnu", "Vejce", "Med"],
    emoji: "🐔",
    hints: [
      "Přiřaď užitek ke slepici — co snáší téměř každý den?",
      "Slepice je pták. Ráno v kurníku najdeme v hnízdě něco, co si pak uvaříme natvrdo nebo usmažíme k snídani.",
    ],
    solutionSteps: ["Slepice nám dává vejce — snáší je do hnízda v kurníku."],
    optionFeedback: {
      Mléko: "Mléko dávají savci jako kráva. Slepice je pták.",
      Vlnu: "Vlnu dává ovce. Slepice má peří.",
      Med: "Med dávají včely.",
    },
  },
  {
    question: "K čemu hlavně chováme krávu?",
    correctAnswer: "Kvůli mléku",
    options: ["Kvůli vlně", "Kvůli medu", "Kvůli peří", "Kvůli mléku"],
    emoji: "🐄",
    hints: [
      "Přemýšlej, co z krávy získáváme každý den, když ji podojíme.",
      "Zemědělec chodí ke krávě ráno i večer s kbelíkem nebo dojicím strojem. Co z ní potom teče a co z toho vyrábíme?",
    ],
    solutionSteps: ["Krávu chováme hlavně kvůli mléku — dojí se každý den."],
    optionFeedback: {
      "Kvůli vlně": "Vlnu dává ovce. Kráva má krátkou srst.",
      "Kvůli medu": "Med vyrábějí včely.",
      "Kvůli peří": "Peří mají ptáci, třeba husa.",
    },
  },
  {
    question: "Kde bydlí prase?",
    correctAnswer: "V chlívku",
    options: ["V chlívku", "V úlu", "V kurníku", "Ve stáji"],
    emoji: "🐖",
    hints: [
      "Přemýšlej, jak se jmenuje malý domek pro prase na dvoře.",
      "Úl patří včelám, kurník slepicím a stáj koním. Jak se jmenuje stavení na dvoře, ve kterém chrochtají prasata?",
    ],
    solutionSteps: ["Prase bydlí v chlívku — je to jeho ohrazený domek na dvoře."],
    optionFeedback: {
      "V úlu": "V úlu bydlí včely.",
      "V kurníku": "V kurníku bydlí slepice.",
      "Ve stáji": "Ve stáji bydlí koně.",
    },
  },
  {
    question: "Kde bydlí slepice?",
    correctAnswer: "V kurníku",
    options: ["V úlu", "V kurníku", "V chlívku", "Ve stáji"],
    emoji: "🐔",
    hints: [
      "Přemýšlej, jak se jmenuje domek pro slepice, kam večer zalezou spát.",
      "Je to malá dřevěná stavba s bidýlky na spaní a hnízdy na snášení. Slepice do ní vcházejí po lávce.",
    ],
    solutionSteps: ["Slepice bydlí v kurníku — tam spí a snáší vejce do hnízd."],
    optionFeedback: {
      "V úlu": "V úlu bydlí včely.",
      "V chlívku": "V chlívku bydlí prasata.",
      "Ve stáji": "Ve stáji bydlí koně.",
    },
  },
  {
    question: "Kde bydlí kůň?",
    correctAnswer: "Ve stáji",
    options: ["V úlu", "V kurníku", "Ve stáji", "V boudě"],
    emoji: "🐴",
    hints: [
      "Přemýšlej, kde na statku spí velký kůň — jak se to místo jmenuje?",
      "Je to velká budova se samostatnými boxy, ve kterých má každý kůň seno, vodu a slámu na spaní.",
    ],
    solutionSteps: ["Kůň bydlí ve stáji — má tam sucho, seno a klid."],
    optionFeedback: {
      "V úlu": "V úlu bydlí včely, kůň by se tam nevešel.",
      "V kurníku": "V kurníku bydlí slepice.",
      "V boudě": "V boudě bydlí pes. Kůň potřebuje mnohem větší prostor.",
    },
  },
  {
    question: "Které zvíře má rohy, bradku a dává mléko?",
    correctAnswer: "Koza",
    options: ["Slepice", "Prase", "Husa", "Koza"],
    emoji: "🐐",
    hints: [
      "Poznej zvíře podle popisu — má malé rohy, bradku a dojí se jako kráva.",
      "Porovnej každou možnost se všemi třemi znaky zároveň. Které zvíře mečí, rádo šplhá po kamenech a má pod bradou chomáč chlupů?",
    ],
    solutionSteps: ["Podle popisu je to koza — má rohy, bradku a dává kozí mléko."],
    optionFeedback: {
      Slepice: "Slepice nemá rohy ani bradku a mléko nedává.",
      Prase: "Prase nemá rohy ani bradku a nedojí se.",
      Husa: "Husa je pták. Rohy ani mléko nemá.",
    },
  },
  {
    question: "Které zvíře je velký vodní pták a snáší velká vejce?",
    correctAnswer: "Husa",
    options: ["Husa", "Kráva", "Ovce", "Kůň"],
    emoji: "🦢",
    hints: [
      "Poznej zvíře podle popisu — je to bílý pták, který rád plave a hlasitě kejhá.",
      "Nejdřív vyřaď zvířata, která nejsou ptáci. Pak hledej ptáka s dlouhým krkem, který chodí na dvoře ve skupině a dává peří do peřin.",
    ],
    solutionSteps: ["Podle popisu je to husa — velký vodní pták, který snáší velká vejce."],
    optionFeedback: {
      Kráva: "Kráva není pták a vejce nesnáší.",
      Ovce: "Ovce není pták a vejce nesnáší.",
      Kůň: "Kůň není pták a vejce nesnáší.",
    },
  },
  {
    question: "Které zvíře nosí lidi na hřbetě a tahá vozy?",
    correctAnswer: "Kůň",
    options: ["Prase", "Kůň", "Slepice", "Včela"],
    emoji: "🐴",
    hints: [
      "Poznej zvíře podle popisu — lidé na něm jezdí a zapřahají ho do vozu.",
      "Hledej velké silné zvíře s hřívou a kopyty, které má na hřbetě sedlo. Když se zapřáhne do vozu, uveze těžký náklad.",
    ],
    solutionSteps: ["Podle popisu je to kůň — nosí jezdce na hřbetě a tahá vozy."],
    optionFeedback: {
      Prase: "Prase na hřbetě nikoho nenosí a vozy netahá.",
      Slepice: "Slepice je malý pták, nikoho neunese.",
      Včela: "Včela je drobný hmyz, nikoho neunese.",
    },
  },
  {
    question: "Které zvíře se rádo válí v bahně a chová se hlavně pro maso?",
    correctAnswer: "Prase",
    options: ["Ovce", "Kůň", "Prase", "Kočka"],
    emoji: "🐖",
    hints: [
      "Poznej zvíře podle popisu — je růžové, chrochtá a rádo se válí v bahně.",
      "Bláto ho chladí v horku. Má rypák s dvěma dírkami, zatočený ocásek a bydlí v chlívku. Které zvíře to je?",
    ],
    solutionSteps: ["Podle popisu je to prase — válí se v bahně a chová se hlavně pro maso."],
    optionFeedback: {
      Ovce: "Ovce se v bahně neválí a chová se hlavně kvůli vlně.",
      Kůň: "Kůň se chová hlavně na jízdu a tahání, v bahně se neválí.",
      Kočka: "Kočka je mazlíček, který chytá myši. Bláto nemá ráda.",
    },
  },
  {
    question: "Které zvíře plave na rybníku a kváká?",
    correctAnswer: "Kachna",
    options: ["Slepice", "Kohout", "Kůň", "Kachna"],
    emoji: "🦆",
    hints: [
      "Poznej zvíře podle popisu — je to menší vodní pták, který dělá „ka ka ka“.",
      "Nejdřív vyřaď zvířata, která neumějí plavat. Pak hledej ptáka s plochým zobákem a blánami mezi prsty na nohou.",
    ],
    solutionSteps: ["Podle popisu je to kachna — plave na rybníku a kváká."],
    optionFeedback: {
      Slepice: "Slepice je pták, ale neplave a kdáká.",
      Kohout: "Kohout neplave a kokrhá.",
      Kůň: "Kůň není pták a nekváká.",
    },
  },
  {
    question: "Ke kterému zvířeti patří kurník?",
    correctAnswer: "Ke slepici",
    options: ["Ke slepici", "Ke koni", "K praseti", "Ke včele"],
    emoji: "🐔",
    hints: [
      "Přemýšlej, jaké zvíře bydlí v kurníku, a přiřaď ho zpět k domku.",
      "V kurníku jsou bidýlka na spaní a hnízda na snášení vajec. Které zvíře potřebuje bidýlko a hnízdo?",
    ],
    solutionSteps: ["Kurník patří ke slepici — bydlí v něm a snáší tam vejce."],
    optionFeedback: {
      "Ke koni": "Kůň bydlí ve stáji.",
      "K praseti": "Prase bydlí v chlívku.",
      "Ke včele": "Včela bydlí v úlu.",
    },
  },
  {
    question: "Ke kterému zvířeti patří úl?",
    correctAnswer: "Ke včele",
    options: ["Ke krávě", "Ke včele", "K praseti", "Ke koze"],
    emoji: "🐝",
    hints: [
      "Přemýšlej, jaké zvíře bydlí v úlu, a přiřaď ho zpět k domku.",
      "Úl je malá dřevěná bedýnka s rámky, na kterých vznikají voskové plástve plné medu. Kdo je staví?",
    ],
    solutionSteps: ["Úl patří ke včele — bydlí v něm celá včelí rodina a vyrábí med."],
    optionFeedback: {
      "Ke krávě": "Kráva bydlí v chlévě, do úlu by se nevešla.",
      "K praseti": "Prase bydlí v chlívku.",
      "Ke koze": "Koza bydlí v chlévě.",
    },
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Které zvíře nám dává zároveň mléko i maso?",
    correctAnswer: "Kráva",
    options: ["Slepice", "Včela", "Kráva", "Husa"],
    emoji: "🐄",
    hints: [
      "Hledej zvíře, které splňuje OBOJÍ najednou — mléko i maso.",
      "Postupuj ve dvou krocích: nejdřív škrtni zvířata, která mléko nedávají. Pak zkontroluj, jestli zbylé zvíře chováme i na maso.",
    ],
    solutionSteps: [
      "Kráva nám dává mléko i maso zároveň. Slepice a husa dávají vejce a maso, ale ne mléko, včela dává jen med.",
    ],
    optionFeedback: {
      Slepice: "Slepice dává maso a vejce, ale mléko ne. Splňuje jen jednu podmínku.",
      Včela: "Včela dává med. Mléko ani maso nedává.",
      Husa: "Husa dává maso a peří, ale mléko ne, protože je to pták.",
    },
  },
  {
    question: "Které zvíře nám dává zároveň vlnu i mléko?",
    correctAnswer: "Ovce",
    options: ["Kráva", "Slepice", "Včela", "Ovce"],
    emoji: "🐑",
    hints: [
      "Hledej zvíře, které splňuje OBOJÍ najednou — vlnu i mléko.",
      "Postupuj ve dvou krocích: nejdřív najdi zvíře, které se stříhá kvůli vlně. Pak si ověř, jestli se dá i podojit.",
    ],
    solutionSteps: [
      "Ovce nám dává vlnu i mléko zároveň. Kráva dává mléko, ale ne vlnu, slepice dává vejce a včela med.",
    ],
    optionFeedback: {
      Kráva: "Kráva dává mléko, ale vlnu ne. Splňuje jen jednu podmínku.",
      Slepice: "Slepice dává vejce. Vlnu ani mléko nedává.",
      Včela: "Včela dává med. Vlnu ani mléko nedává.",
    },
  },
  {
    question: "Z čeho se vyrábí sýr?",
    correctAnswer: "Z mléka",
    options: ["Z mléka", "Z vlny", "Z medu", "Z vajec"],
    emoji: "🧀",
    hints: [
      "Přemýšlej po krocích — sýr vzniká z bílé tekutiny, kterou dává kráva.",
      "Sýr patří mezi mléčné výrobky spolu s tvarohem, jogurtem a máslem. Co mají všechny tyhle výrobky společného?",
    ],
    solutionSteps: ["Sýr se vyrábí z mléka — a mléko nám dává kráva nebo koza."],
    optionFeedback: {
      "Z vlny": "Z vlny se pletou svetry, ne jídlo.",
      "Z medu": "Med je sladký a sýr se z něj nevyrábí.",
      "Z vajec": "Z vajec se dělají třeba palačinky nebo omeleta, ne sýr.",
    },
  },
  {
    question: "Z čeho se plete teplý svetr?",
    correctAnswer: "Z vlny",
    options: ["Z mléka", "Z vlny", "Z medu", "Z peří"],
    emoji: "🧶",
    hints: [
      "Přemýšlej po krocích — svetr se plete z materiálu, který ostříháme ovci.",
      "Nejdřív se ovce ostříhá, pak se z její srsti upředou nitě a z nití babička plete jehlicemi. Jak se ta ostříhaná srst jmenuje?",
    ],
    solutionSteps: ["Teplý svetr se plete z vlny — a vlnu nám dává ovce."],
    optionFeedback: {
      "Z mléka": "Mléko je nápoj a jídlo, nitě se z něj nepředou.",
      "Z medu": "Med je sladké jídlo, plést se z něj nedá.",
      "Z peří": "Peřím se plní peřiny a polštáře. Svetr se z peří neplete.",
    },
  },
  {
    question: "Sýr se vyrábí z mléka. Které zvíře nám tedy mléko na sýr dá?",
    correctAnswer: "Kráva",
    options: ["Slepice", "Včela", "Kráva", "Husa"],
    emoji: "🧀",
    hints: [
      "Nejdřív si vzpomeň, z čeho je sýr, a pak najdi zvíře, které to dává.",
      "První krok už máš v zadání. Druhý krok: které z nabízených zvířat se dojí? Ptáci ani hmyz se nedojí.",
    ],
    solutionSteps: [
      "Sýr je z mléka a mléko nám dává kráva. Slepice a husa dávají vejce, včela med, mléko na sýr nedají.",
    ],
    optionFeedback: {
      Slepice: "Slepice je pták, mléko nedává, a proto ani mléko na sýr.",
      Včela: "Včela dává med. Mléko nedává.",
      Husa: "Husa je pták, dává vejce a peří, ale ne mléko.",
    },
  },
  {
    question: "Ke snídani máš vajíčko a lžičku medu. Která dvě zvířata ti to dala?",
    correctAnswer: "Slepice a včela",
    options: ["Kráva a ovce", "Prase a kůň", "Koza a pes", "Slepice a včela"],
    emoji: "🍯",
    hints: [
      "Rozděl si to na dvě části — kdo dává vejce a kdo dává med?",
      "Vyřeš každou věc zvlášť: vajíčko snáší pták z kurníku, med vyrábí hmyz z úlu. Pak najdi dvojici, kde sedí obě zvířata.",
    ],
    solutionSteps: ["Vajíčko snesla slepice a med vyrobila včela — proto je to slepice a včela."],
    optionFeedback: {
      "Kráva a ovce": "Kráva a ovce dávají mléko a vlnu. Vejce ani med nedávají.",
      "Prase a kůň": "Prase a kůň nedávají ani vejce, ani med.",
      "Koza a pes": "Koza dává mléko a pes hlídá dům. Vejce ani med od nich nemáme.",
    },
  },
  {
    question: "Ovce má mládě jehně. Jak se jmenuje mládě kozy?",
    correctAnswer: "Kůzle",
    options: ["Kůzle", "Jehně", "Tele", "Sele"],
    emoji: "🐐",
    hints: [
      "Pozor na záměnu — koza a ovce jsou si podobné, ale mládě mají jinak pojmenované.",
      "Jméno z první věty patří ovci, takže pro kozu to být nemůže. Jméno mláděte kozy se podobá slovu koza, jen je zdrobnělé.",
    ],
    solutionSteps: [
      "Mládě kozy je kůzle. Jehně je mládě ovce, tele mládě krávy a sele mládě prasete.",
    ],
    optionFeedback: {
      Jehně: "Jehně je mládě ovce, jak říká zadání. Koza je jiné zvíře.",
      Tele: "Tele je mládě krávy.",
      Sele: "Sele je mládě prasete.",
    },
  },
  {
    question: "Kráva má mládě tele. Jak se jmenuje mládě koně?",
    correctAnswer: "Hříbě",
    options: ["Tele", "Hříbě", "Sele", "Kůzle"],
    emoji: "🐴",
    hints: [
      "Nezaměň mláďata — každý druh má své vlastní jméno pro mládě.",
      "Jméno z první věty patří krávě, pro koně to tedy není. Mládě koně se jmenuje podobně jako samec koně, hřebec.",
    ],
    solutionSteps: [
      "Mládě koně je hříbě. Tele je mládě krávy, sele mládě prasete a kůzle mládě kozy.",
    ],
    optionFeedback: {
      Tele: "Tele je mládě krávy, jak říká zadání. Kůň má mládě jinak pojmenované.",
      Sele: "Sele je mládě prasete.",
      Kůzle: "Kůzle je mládě kozy.",
    },
  },
  {
    question: "Jak se jmenuje samec ovce?",
    correctAnswer: "Beran",
    options: ["Býk", "Kozel", "Beran", "Kanec"],
    emoji: "🐑",
    hints: [
      "Pozor na záměnu samců — hledej samce právě u ovce, ne u krávy nebo kozy.",
      "Každý samec v nabídce patří k jinému zvířeti. Přiřaď je postupně: ke krávě, ke koze, k praseti. Který zbude pro ovci?",
    ],
    solutionSteps: [
      "Samec ovce je beran. Býk je samec krávy, kozel samec kozy a kanec samec prasete.",
    ],
    optionFeedback: {
      Býk: "Býk je samec krávy.",
      Kozel: "Kozel je samec kozy. Koza a ovce jsou podobné, proto se to plete.",
      Kanec: "Kanec je samec prasete.",
    },
  },
  {
    question: "Jak se jmenuje samec kozy?",
    correctAnswer: "Kozel",
    options: ["Beran", "Býk", "Kohout", "Kozel"],
    emoji: "🐐",
    hints: [
      "Pozor na záměnu samců — koza a ovce jsou podobné, ale jejich samci se jmenují jinak.",
      "Přiřaď každého samce z nabídky k jeho samici: k ovci, ke krávě, ke slepici. Jméno samce kozy navíc zní skoro jako koza.",
    ],
    solutionSteps: [
      "Samec kozy je kozel. Beran je samec ovce, býk samec krávy a kohout samec slepice.",
    ],
    optionFeedback: {
      Beran: "Beran je samec ovce, ne kozy.",
      Býk: "Býk je samec krávy.",
      Kohout: "Kohout je samec slepice.",
    },
  },
  {
    question: "Které z těchto zvířat NEDÁVÁ mléko?",
    correctAnswer: "Slepice",
    options: ["Slepice", "Kráva", "Koza", "Ovce"],
    emoji: "🐔",
    hints: [
      "Tři z těchto zvířat se dojí — najdi to jediné, které se nedojí.",
      "Mléko dávají jen zvířata, která svá mláďata kojí. Které zvíře z nabídky je pták a mláďata se mu líhnou z vajec?",
    ],
    solutionSteps: [
      "Mléko nedává slepice — ta snáší vejce. Kráva, koza i ovce se dojí, a mléko tedy dávají.",
    ],
    optionFeedback: {
      Kráva: "Kráva mléko dává, dojí se každý den. Hledáš zvíře, které ho nedává.",
      Koza: "Koza mléko dává, z kozího mléka je i sýr. Hledáš zvíře, které ho nedává.",
      Ovce: "Ovce mléko dává, i když ji chováme hlavně kvůli vlně. Hledáš zvíře, které ho nedává.",
    },
  },
  {
    question: "Které zvíře bydlí v úlu a zároveň vyrábí med?",
    correctAnswer: "Včela",
    options: ["Slepice", "Včela", "Kráva", "Koza"],
    emoji: "🐝",
    hints: [
      "Hledej zvíře, které splňuje OBOJÍ — bydlí v úlu a k tomu dělá med.",
      "Ověř obě podmínky u každé možnosti: kde to zvíře bydlí a co nám dává. Jen jedno zvíře projde oběma kontrolami.",
    ],
    solutionSteps: [
      "V úlu bydlí včela a v něm i vyrábí med. Slepice bydlí v kurníku, kráva a koza v chlévě.",
    ],
    optionFeedback: {
      Slepice: "Slepice bydlí v kurníku a dává vejce, med ne.",
      Kráva: "Kráva bydlí v chlévě a dává mléko.",
      Koza: "Koza bydlí v chlévě a dává mléko.",
    },
  },
  {
    question: "Čím se plní péřová peřina a které zvíře nám to dá?",
    correctAnswer: "Peřím husy",
    options: ["Vlnou ovce", "Mlékem krávy", "Peřím husy", "Medem včely"],
    emoji: "🪶",
    hints: [
      "Peřina je měkká a lehká — vzpomeň si, který velký pták nám dává jemné pírko.",
      "Odpověz na dvě otázky: čím se peřina plní (napovídá to její jméno) a které zvíře z nabídky je pták. Obě části musí sedět.",
    ],
    solutionSteps: [
      "Peřina se plní jemným peřím a to nám dává husa. Ovce dává vlnu, kráva mléko, to se do peřiny nedává.",
    ],
    optionFeedback: {
      "Vlnou ovce": "Vlnou se plní spíš deky, peřina má už ve jménu, čím se plní.",
      "Mlékem krávy": "Mléko je tekutina, peřinu jím naplnit nejde.",
      "Medem včely": "Med je lepkavé jídlo, do peřiny nepatří.",
    },
  },
  {
    question: "Máslo i sýr se vyrábějí z mléka. Které zvíře nám mléko dává?",
    correctAnswer: "Kráva",
    options: ["Slepice", "Prase", "Včela", "Kráva"],
    emoji: "🥛",
    hints: [
      "Nejdřív si vzpomeň, z čeho je máslo a sýr, a pak najdi zvíře, které to dává.",
      "První krok říká zadání: z mléka. Druhý krok: které zvíře z nabídky se v kravíně dojí dvakrát denně?",
    ],
    solutionSteps: [
      "Máslo i sýr jsou z mléka a mléko nám dává kráva. Slepice dává vejce, prase maso, včela med.",
    ],
    optionFeedback: {
      Slepice: "Slepice dává vejce. Máslo ani sýr z vajec nevzniknou.",
      Prase: "Prase chováme pro maso a nedojí se.",
      Včela: "Včela dává med. Mléko nedává.",
    },
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool).map((t) => ({ ...t, options: t.options ? shuffle(t.options) : t.options }));
}

export const DOMACIHOSPODARSKAZVIRATA: TopicMetadata[] = [
  {
    id: "g2-prv-zvirata-uzitek",
    rvpNodeId: "g2-prvouka-rozmanitost-prirody-domaci-a-hospodarska-zvirata-domaci-mazlicci-hospodarska-zvirata-a-jejich-uzitek",
    title: "Domácí a hospodářská zvířata a jejich užitek",
    studentTitle: "Domácí zvířata",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Domácí a hospodářská zvířata",
    briefDescription: "Poznáš zvířata a jejich užitek.",
    keywords: ["zvířata", "kráva", "slepice", "ovce", "včela", "užitek"],
    goals: [
      "Poznat domácí a hospodářská zvířata.",
      "Vědět, co nám zvířata dávají.",
      "Spojit zvíře s jeho užitkem.",
    ],
    boundaries: [
      "Pouze běžná domácí a hospodářská zvířata.",
      "Bez podrobností o chovu a péči.",
      "Řetězce „z čeho se vyrábí“ (mléko→sýr, vlna→svetr, peří→peřina) jsou rozšiřující — jen na L3.",
    ],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Každé zvíře nám něco dává: mléko, vejce, vlnu nebo med. Mysli i na to, kde bydlí a jak se jmenuje jeho mládě.",
      steps: ["Přečti otázku.", "Které zvíře to dělá, nebo které k tomu patří?"],
      commonMistake: "Záměna užitku (kráva dává mléko, slepice vejce) nebo podobných mláďat (jehně × kůzle).",
      example: "Kráva dává mléko, včela med, ovce vlnu. Mládě krávy je tele, mládě ovce jehně.",
    },
  },
];
