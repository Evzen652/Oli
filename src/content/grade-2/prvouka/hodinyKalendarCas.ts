import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";

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
//   L1 = rozpoznání: izolovaná fakta o časových jednotkách (kolik má rok
//        měsíců, týden dní, den hodin, hodina minut, první/poslední den
//        a měsíc, počet ročních období...).
//   L2 = aplikace: pořadí dnů/měsíců/ročních období (co je hned po/před),
//        porovnání délky časových jednotek (co je delší), rozlišení
//        pracovního dne a víkendu.
//   L3 = transfer (2 kroky, přiměřeně věku): počítání dnů/měsíců mezi
//        dvěma body, hádanky "den přede mnou / po mně", spojení dvou
//        faktů (poslední měsíc → roční období), odečítání víkendu od
//        celého týdne, počítání pozpátku. Bez čtení přesného času
//        na ciferníku (dle boundaries).
// Každá úloha: dvě vlastní nápovědy, zpětná vazba u každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Kolik měsíců má rok?",
    correctAnswer: "12",
    options: ["12", "10", "7", "4"],
    emoji: "📅",
    hints: [
      "Vzpomeň si na kalendář — leden, únor, březen… kolik jich je celkem?",
      "Vyjmenuj všechny měsíce od ledna až do prosince a na každý měsíc ohni jeden prst. Až ti prsty dojdou, pokračuj znovu od palce.",
    ],
    optionFeedback: {
      "10": "Deset je málo — rok by skončil už říjnem, ale po něm přijde ještě listopad a prosinec.",
      "7": "Sedm je počet dní v týdnu, ne počet měsíců v roce.",
      "4": "Čtyři jsou roční období (jaro, léto, podzim, zima), měsíců je víc.",
    },
    solutionSteps: ["Rok má 12 měsíců — od ledna do prosince."],
  },
  {
    question: "Kolik dní má týden?",
    correctAnswer: "7",
    options: ["5", "7", "10", "6"],
    emoji: "📆",
    hints: [
      "Týden začíná pondělím a končí nedělí. Kolik dní to je i s nimi?",
      "Začni pondělím a na každý den ohni jeden prst: pondělí, úterý, středa, čtvrtek, pátek, sobota, neděle. Kolik prstů máš ohnutých?",
    ],
    optionFeedback: {
      "5": "Pět je jen školních dnů — zapomněl jsi na sobotu a neděli.",
      "10": "Deset dní je víc než týden, týden skončí nedělí dřív.",
      "6": "Šest — nejspíš jsi vynechal jeden den, třeba neděli.",
    },
    solutionSteps: ["Týden má 7 dní — od pondělí do neděle."],
  },
  {
    question: "Kolik hodin má den?",
    correctAnswer: "24",
    options: ["12", "60", "24", "10"],
    emoji: "⏰",
    hints: [
      "Ve dne je 12 hodin a v noci dalších 12 hodin — kolik je to dohromady?",
      "Celý den i s nocí trvá od jedné půlnoci do druhé. Malá ručička oběhne ciferník dvakrát, jednou ve dne a jednou v noci — sečti dvakrát dvanáct.",
    ],
    optionFeedback: {
      "12": "Dvanáct hodin je jen polovina — tolik trvá den bez noci. Celý den má i noc.",
      "60": "Šedesát je počet minut v hodině, ne hodin ve dni.",
      "10": "Deset hodin je příliš málo, jen o trochu víc než noční spánek.",
    },
    solutionSteps: ["Den má 24 hodin — 12 hodin dne a 12 hodin noci."],
  },
  {
    question: "Kolik minut má hodina?",
    correctAnswer: "60",
    options: ["30", "100", "24", "60"],
    emoji: "🕐",
    hints: [
      "Velká ručička projde za hodinu celý ciferník — po jednom malém dílku za každou minutu.",
      "Ciferník má 12 čísel a mezi každými dvěma sousedními čísly je 5 malých dílků. Počítej po pěti od jedničky dokola, dokud se nevrátíš nahoru: 5, 10, 15…",
    ],
    optionFeedback: {
      "30": "Třicet minut je jen půl hodiny.",
      "100": "Sto se hodí k penězům nebo centimetrům, hodina má minut méně.",
      "24": "Dvacet čtyři je počet hodin ve dni, ne minut v hodině.",
    },
    solutionSteps: ["Hodina má 60 minut — velká ručička za ni oběhne celý ciferník."],
  },
  {
    question: "Kolik dní má běžný rok?",
    correctAnswer: "365",
    options: ["365", "300", "100", "12"],
    emoji: "📅",
    hints: [
      "Rok má 12 měsíců a většina měsíců má 30 nebo 31 dní.",
      "Každý měsíc má kolem třiceti dní a měsíců je dvanáct. Dvanáct třicítek je už víc než tři sta — a některé měsíce mají ještě den navíc.",
    ],
    optionFeedback: {
      "300": "Tři sta je málo — už dvanáct měsíců po třiceti dnech dá víc.",
      "100": "Sto dní jsou jen asi tři měsíce, rok je mnohem delší.",
      "12": "Dvanáct je počet měsíců v roce, ne dní.",
    },
    solutionSteps: ["Běžný rok má 365 dní, přestupný rok má o jeden den víc (366)."],
  },
  {
    question: "Který den je první v týdnu?",
    correctAnswer: "Pondělí",
    options: ["Neděle", "Pondělí", "Středa", "Sobota"],
    emoji: "📆",
    hints: [
      "Týden začíná prvním školním dnem, hned po víkendu.",
      "Vzpomeň si, kterým dnem začíná školní týden: po volné sobotě a neděli jdeš zase do školy. Ten den je v českém kalendáři první.",
    ],
    optionFeedback: {
      Neděle: "Neděle je u nás poslední den týdne; jako první ji počítají jen v některých jiných zemích.",
      Středa: "Středa je uprostřed týdne — je až třetí.",
      Sobota: "Sobota je předposlední den, patří k víkendu.",
    },
    solutionSteps: ["Pondělí je první den v týdnu — každý týden začíná pondělím."],
  },
  {
    question: "Který den je poslední v týdnu?",
    correctAnswer: "Neděle",
    options: ["Sobota", "Pátek", "Neděle", "Pondělí"],
    emoji: "📆",
    hints: [
      "Týden končí víkendem. Poslední je ten den, po kterém začíná nový týden pondělím.",
      "Víkend má dva dny. První z nich je předposlední den týdne, druhý je úplně poslední — hned po něm jdeš zase do školy a začíná nový týden.",
    ],
    optionFeedback: {
      Sobota: "Sobota je předposlední, po ní přijde ještě jeden víkendový den.",
      Pátek: "Pátek je poslední školní den, ale týden pokračuje víkendem.",
      Pondělí: "Pondělím týden začíná, ne končí.",
    },
    solutionSteps: ["Neděle je poslední den v týdnu — po ní začíná nový týden pondělím."],
  },
  {
    question: "Čím měříme čas?",
    correctAnswer: "Hodiny",
    options: ["Metr", "Váha", "Teploměr", "Hodiny"],
    emoji: "⏰",
    hints: [
      "Co visí ve třídě na zdi a má ručičky?",
      "Metr měří délku, váha hmotnost a teploměr teplotu. Hledej věc s ciferníkem a ručičkami, podle které poznáš, kdy začíná přestávka.",
    ],
    optionFeedback: {
      Metr: "Metrem měříme délku, třeba jak je dlouhá lavice.",
      Váha: "Váhou zjišťujeme, kolik co váží.",
      Teploměr: "Teploměr ukazuje, jak je teplo nebo zima.",
    },
    solutionSteps: ["Čas měříme hodinami — ručičky ukazují hodiny a minuty."],
  },
  {
    question: "Kolik ročních období má rok?",
    correctAnswer: "Čtyři",
    options: ["Čtyři", "Tři", "Pět", "Dvě"],
    emoji: "🍂",
    hints: [
      "Vyjmenuj je: jaro, léto, podzim, zima — kolik jich je?",
      "Za každé roční období ohni jeden prst: nejdřív to, kdy kvetou první květiny, pak to s prázdninami, pak to s padajícím listím a nakonec to se sněhem.",
    ],
    optionFeedback: {
      Tři: "Tři — nějaké období jsi vynechal; zkontroluj jaro, léto, podzim i zimu.",
      Pět: "Pět je moc, žádné páté roční období nemáme.",
      Dvě: "Kdyby byla jen dvě, měli bychom jen léto a zimu — ale mezi nimi je ještě jaro a podzim.",
    },
    solutionSteps: ["Rok má čtyři roční období: jaro, léto, podzim a zimu."],
  },
  {
    question: "Který měsíc je první v roce?",
    correctAnswer: "Leden",
    options: ["Prosinec", "Leden", "Březen", "Únor"],
    emoji: "❄️",
    hints: [
      "Rok začíná uprostřed zimy, hned po silvestrovské půlnoci.",
      "Na Silvestra slavíme konec roku. Měsíc, který začíná hned o půlnoci po oslavě, je v nástěnném kalendáři na úplně prvním listu.",
    ],
    optionFeedback: {
      Prosinec: "Prosinec je poslední měsíc, na jeho konci slavíme Silvestra.",
      Březen: "Březen je až třetí měsíc, během něj začíná jaro.",
      Únor: "Únor je druhý měsíc, přijde až po prvním.",
    },
    solutionSteps: ["První měsíc v roce je leden — rok začíná 1. ledna."],
  },
  {
    question: "Který měsíc je poslední v roce?",
    correctAnswer: "Prosinec",
    options: ["Leden", "Červen", "Prosinec", "Listopad"],
    emoji: "🎄",
    hints: [
      "Rok končí vánočním měsícem.",
      "Vzpomeň si, ve kterém měsíci je Štědrý den a Silvestr. Po Silvestru už začíná nový rok.",
    ],
    optionFeedback: {
      Leden: "Leden je první měsíc, rokem začíná.",
      Červen: "Červen je uprostřed roku, po něm začínají prázdniny.",
      Listopad: "Listopad je předposlední, po něm přijde ještě jeden měsíc.",
    },
    solutionSteps: ["Poslední měsíc v roce je prosinec — v prosinci slavíme Vánoce i Silvestra."],
  },
  {
    question: "Která ručička na hodinách je kratší?",
    correctAnswer: "Hodinová",
    options: ["Hodinová", "Minutová", "Vteřinová", "Obě jsou stejně dlouhé"],
    emoji: "🕐",
    hints: [
      "Podívej se na hodiny ve třídě: jedna ručička je dlouhá a rychlá, druhá krátká a pomalá.",
      "Dlouhá ručička oběhne celý ciferník za jednu hodinu a počítá minuty. Ta druhá se za stejnou dobu posune jen o jedno číslo a ukazuje, kolik je hodin.",
    ],
    optionFeedback: {
      Minutová: "Minutová ručička je ta delší, rychle obíhá ciferník.",
      Vteřinová: "Vteřinová ručička bývá tenká a dlouhá, a navíc ji mají jen některé hodiny.",
      "Obě jsou stejně dlouhé": "Kdyby byly stejně dlouhé, nepoznali bychom, která ukazuje hodiny a která minuty.",
    },
    solutionSteps: ["Kratší je hodinová ručička — pohybuje se pomalu a ukazuje hodiny. Delší minutová ukazuje minuty."],
  },
  {
    question: "Která část dne je nejtmavší?",
    correctAnswer: "Noc",
    options: ["Noc", "Ráno", "Poledne", "Večer"],
    emoji: "🌙",
    hints: [
      "Slunce svítí přes den — kdy ho nevidíme vůbec?",
      "Ráno slunce vychází a večer zapadá, takže je šero. Nejtmavší je ta část dne, kdy spíš a slunce je celou dobu schované pod obzorem.",
    ],
    optionFeedback: {
      Ráno: "Ráno slunce vychází a začíná se rozednívat.",
      Poledne: "V poledne je slunce nejvýš a je největší světlo.",
      Večer: "Večer se teprve stmívá, úplná tma přijde až potom.",
    },
    solutionSteps: ["Nejtmavší je noc — slunce je pod obzorem a nesvítí."],
  },
  {
    question: "Kdy vychází slunce?",
    correctAnswer: "Ráno",
    options: ["Večer", "Ráno", "V noci", "V poledne"],
    emoji: "🌅",
    hints: [
      "Slunce se objeví na obloze na začátku dne, když se probouzíme.",
      "Když slunce vychází, obloha se pomalu rozjasňuje a ty vstáváš a snídáš. Když slunce zapadá, chystáš se brzy spát.",
    ],
    optionFeedback: {
      Večer: "Večer slunce zapadá, ne vychází.",
      "V noci": "V noci slunce vůbec nevidíme.",
      "V poledne": "V poledne je slunce už vysoko na obloze, vyšlo dávno předtím.",
    },
    solutionSteps: ["Slunce vychází ráno — na začátku každého dne."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Který den přijde po pondělí?",
    correctAnswer: "Úterý",
    options: ["Neděle", "Pátek", "Úterý", "Středa"],
    emoji: "📆",
    hints: [
      "Pondělí je první den týdne. Který den je hned druhý v pořadí?",
      "Řekni si dny popořadě od začátku týdne a zastav se na tom, který následuje hned za prvním. Nepřeskakuj žádný den.",
    ],
    optionFeedback: {
      Neděle: "Neděle je před pondělím, ne po něm.",
      Pátek: "Pátek je až pátý den týdne.",
      Středa: "Středa je až třetí — jeden den jsi přeskočil.",
    },
    solutionSteps: ["Po pondělí přijde úterý — je to druhý den v týdnu."],
  },
  {
    question: "Který den přijde po středě?",
    correctAnswer: "Čtvrtek",
    options: ["Pátek", "Úterý", "Pondělí", "Čtvrtek"],
    emoji: "📆",
    hints: [
      "Středa je uprostřed týdne. Který školní den následuje hned po ní?",
      "Středa je třetí den týdne. Hledáš čtvrtý den — spočítej na prstech od pondělí a přidej jeden den za středou.",
    ],
    optionFeedback: {
      Pátek: "Pátek je až pátý den, jeden den jsi přeskočil.",
      Úterý: "Úterý je před středou, ne po ní.",
      Pondělí: "Pondělí je na začátku týdne, dva dny před středou.",
    },
    solutionSteps: ["Po středě přijde čtvrtek — čtvrtý den týdne."],
  },
  {
    question: "Který den je hned před nedělí?",
    correctAnswer: "Sobota",
    options: ["Sobota", "Pátek", "Pondělí", "Čtvrtek"],
    emoji: "📆",
    hints: [
      "Neděle je poslední den v týdnu. Který den je těsně před ní?",
      "Víkend tvoří dva dny a neděle je ten druhý z nich. Který víkendový den přijde dřív, hned po posledním školním dni?",
    ],
    optionFeedback: {
      Pátek: "Pátek je dva dny před nedělí, mezi nimi je ještě jeden den.",
      Pondělí: "Pondělí přijde až po neděli.",
      Čtvrtek: "Čtvrtek je tři dny před nedělí.",
    },
    solutionSteps: ["Před nedělí je sobota — spolu tvoří víkend."],
  },
  {
    question: "Které roční období přijde po podzimu?",
    correctAnswer: "Zima",
    options: ["Léto", "Zima", "Jaro", "Podzim"],
    emoji: "❄️",
    hints: [
      "Po podzimu přichází nejchladnější období, kdy mrzne a padá sníh.",
      "Roční období se opakují stále dokola ve stejném pořadí. Po období, kdy padá listí, přijde to, kdy se staví sněhulák a slaví se Vánoce.",
    ],
    optionFeedback: {
      Léto: "Léto je před podzimem, ne po něm.",
      Jaro: "Jaro přijde až po zimě — jedno období jsi přeskočil.",
      Podzim: "Ptáme se, co přijde PO podzimu, ne na podzim samotný.",
    },
    solutionSteps: ["Po podzimu přijde zima — pořadí je jaro, léto, podzim, zima."],
  },
  {
    question: "Které roční období přijde po létě?",
    correctAnswer: "Podzim",
    options: ["Jaro", "Zima", "Podzim", "Léto"],
    emoji: "🍂",
    hints: [
      "Po nejteplejším období přichází čas, kdy začíná padat listí a chladne.",
      "Po letních prázdninách jdeš zase v září do školy. Jak se jmenuje roční období, které tehdy začíná a kdy se sbírají kaštany?",
    ],
    optionFeedback: {
      Jaro: "Jaro je před létem, ne po něm.",
      Zima: "Zima přijde až po podzimu — jedno období jsi přeskočil.",
      Léto: "Ptáme se na období PO létě, ne na léto samotné.",
    },
    solutionSteps: ["Po létě přijde podzim — listí začne padat a ochladí se."],
  },
  {
    question: "Které roční období přijde po zimě?",
    correctAnswer: "Jaro",
    options: ["Léto", "Podzim", "Zima", "Jaro"],
    emoji: "🌱",
    hints: [
      "Po zimě se oteplí a začnou kvést první květiny.",
      "Po zimě se dny prodlužují, taje sníh a ze země vykukují sněženky. To období začíná v březnu.",
    ],
    optionFeedback: {
      Léto: "Léto přijde až po jaru — jedno období jsi přeskočil.",
      Podzim: "Podzim je před zimou, ne po ní.",
      Zima: "Ptáme se na období PO zimě, ne na zimu samotnou.",
    },
    solutionSteps: ["Po zimě přijde jaro — příroda se probouzí k životu."],
  },
  {
    question: "Který měsíc přijde hned po lednu?",
    correctAnswer: "Únor",
    options: ["Únor", "Březen", "Prosinec", "Duben"],
    emoji: "📆",
    hints: [
      "Leden je první měsíc v roce. Který je hned druhý v pořadí?",
      "Řekni si měsíce od začátku roku a zastav se hned na druhém. Je to nejkratší měsíc roku a bývá v něm masopust.",
    ],
    optionFeedback: {
      Březen: "Březen je až třetí — jeden měsíc jsi přeskočil.",
      Prosinec: "Prosinec je před lednem, na konci předchozího roku.",
      Duben: "Duben je až čtvrtý měsíc.",
    },
    solutionSteps: ["Po lednu přijde únor — je to druhý měsíc v roce."],
  },
  {
    question: "Který měsíc je hned před prosincem?",
    correctAnswer: "Listopad",
    options: ["Říjen", "Listopad", "Leden", "Září"],
    emoji: "📆",
    hints: [
      "Prosinec je poslední měsíc v roce. Který měsíc je těsně před ním?",
      "Počítej měsíce od konce roku pozpátku: poslední je prosinec a o jeden krok zpátky je měsíc, ve kterém bývají Dušičky.",
    ],
    optionFeedback: {
      Říjen: "Říjen je dva měsíce před prosincem, jeden jsi přeskočil.",
      Leden: "Leden přijde po prosinci, začíná jím nový rok.",
      Září: "Září je tři měsíce před prosincem.",
    },
    solutionSteps: ["Před prosincem je listopad — jedenáctý měsíc v roce."],
  },
  {
    question: "Co trvá déle — minuta, nebo hodina?",
    correctAnswer: "Hodina",
    options: ["Minuta", "Jsou stejně dlouhé", "Hodina", "Nedá se to porovnat"],
    emoji: "⏳",
    hints: [
      "Jedna z nich se skládá ze šedesáti těch druhých — a delší je ta větší.",
      "Minuta uteče, než si zavážeš tkaničky. Za tu druhou dobu stihneš celou vyučovací hodinu i s přestávkou. Která z nich obsahuje tu druhou šedesátkrát?",
    ],
    optionFeedback: {
      Minuta: "Minuta je krátká — hodina se skládá ze šedesáti minut.",
      "Jsou stejně dlouhé": "Nejsou — v jedné hodině je šedesát minut.",
      "Nedá se to porovnat": "Obě jsou jednotky času, takže je porovnat jde.",
    },
    solutionSteps: ["Hodina je delší než minuta — 1 hodina = 60 minut."],
  },
  {
    question: "Co trvá déle — den, nebo týden?",
    correctAnswer: "Týden",
    options: ["Den", "Jsou stejně dlouhé", "Nedá se to porovnat", "Týden"],
    emoji: "📆",
    hints: [
      "Kolik dní musíš počkat, než uplyne celý týden?",
      "Den trvá od jednoho rána do dalšího rána. Celý týden začíná pondělím a končí nedělí — a těch dnů je v něm sedm.",
    ],
    optionFeedback: {
      Den: "Den je kratší — v týdnu je sedm dní.",
      "Jsou stejně dlouhé": "Nejsou stejně dlouhé, týden má sedm dní.",
      "Nedá se to porovnat": "Den i týden jsou jednotky času, porovnat je jde.",
    },
    solutionSteps: ["Týden je delší než den — týden má 7 dní."],
  },
  {
    question: "Co trvá déle — týden, nebo měsíc?",
    correctAnswer: "Měsíc",
    options: ["Měsíc", "Týden", "Jsou stejně dlouhé", "Nedá se to porovnat"],
    emoji: "📅",
    hints: [
      "Kolik týdnů se vejde do jednoho měsíce?",
      "Podívej se do kalendáře: jeden list pro jeden měsíc má čtyři až pět řádků a každý řádek je jeden celý týden.",
    ],
    optionFeedback: {
      Týden: "Týden má jen sedm dní, měsíc jich má kolem třiceti.",
      "Jsou stejně dlouhé": "Nejsou — do měsíce se vejdou čtyři týdny a něco navíc.",
      "Nedá se to porovnat": "Týden i měsíc jsou jednotky času, porovnat je jde.",
    },
    solutionSteps: ["Měsíc je delší než týden — měsíc má obvykle čtyři týdny a pár dní navíc."],
  },
  {
    question: "Kolik hodin ukazují hodiny v poledne?",
    correctAnswer: "12",
    options: ["6", "12", "24", "9"],
    emoji: "🕛",
    hints: [
      "Poledne je uprostřed dne, kdy se obvykle obědvá.",
      "V poledne se obě ručičky potkají a ukazují přímo nahoru. Podívej se, které číslo je na ciferníku úplně nahoře.",
    ],
    optionFeedback: {
      "6": "Šest hodin je ráno nebo večer, ne poledne.",
      "24": "Dvacet čtyři hodin má celý den; tak se říká spíš o půlnoci.",
      "9": "Devět hodin je dopoledne, třeba při druhé vyučovací hodině.",
    },
    solutionSteps: ["V poledne je 12 hodin — obě ručičky ukazují nahoru na dvanáctku."],
  },
  {
    question: "Které dny v týdnu tvoří víkend?",
    correctAnswer: "Sobota a neděle",
    options: ["Pátek a sobota", "Neděle a pondělí", "Sobota a neděle", "Středa a čtvrtek"],
    emoji: "🎉",
    hints: [
      "Víkend jsou poslední dva dny týdne, kdy se obvykle nechodí do školy.",
      "Víkend jsou dva dny těsně za sebou na konci týdne. Najdi dvojici, ve které ani jeden den není školní a po které začíná nový týden.",
    ],
    optionFeedback: {
      "Pátek a sobota": "Pátek je ještě školní den, víkend začíná až po něm.",
      "Neděle a pondělí": "Pondělím začíná nový týden a jde se do školy.",
      "Středa a čtvrtek": "Středa a čtvrtek jsou uprostřed školního týdne.",
    },
    solutionSteps: ["Víkend tvoří sobota a neděle — poslední dva dny v týdnu."],
  },
  {
    question: "Je úterý pracovní den, nebo víkendový den?",
    correctAnswer: "Pracovní den",
    options: ["Víkendový den", "Ani jedno", "Státní svátek", "Pracovní den"],
    emoji: "🏫",
    hints: [
      "Chodíš v úterý do školy?",
      "Víkend jsou jen dva dny na konci týdne. Úterý je druhý den týdne, hned po pondělí — dospělí jdou do práce a děti do školy.",
    ],
    optionFeedback: {
      "Víkendový den": "Víkend tvoří jen sobota a neděle, úterý mezi ně nepatří.",
      "Ani jedno": "Každý den v týdnu je buď pracovní, nebo víkendový.",
      "Státní svátek": "Svátek připadá na určité datum, ne na každé úterý.",
    },
    solutionSteps: ["Úterý je pracovní (školní) den — víkend jsou jen sobota a neděle."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Dnes je středa. Za kolik dní bude neděle?",
    correctAnswer: pad(4, "DEN"),
    options: [pad(4, "DEN"), pad(3, "DEN"), pad(5, "DEN"), pad(2, "DEN")],
    emoji: "🗓️",
    hints: [
      "Vyjmenuj dny od středy dál, až dojdeš k neděli.",
      "Za každý den, o který se posuneš dál (čtvrtek, pátek…), ohni jeden prst. Středu nepočítej, ta je dnes. Neděli započítej.",
    ],
    optionFeedback: {
      [pad(3, "DEN")]: "Za tři dny od středy bude sobota — neděle je o den dál.",
      [pad(5, "DEN")]: "Pět — nejspíš jsi započítal i dnešní středu.",
      [pad(2, "DEN")]: "Za dva dny od středy bude teprve pátek.",
    },
    solutionSteps: ["Od středy do neděle: čtvrtek, pátek, sobota, neděle — to jsou 4 dny."],
  },
  {
    question: "Dnes je pátek. Jaký den bude za dva dny?",
    correctAnswer: "Neděle",
    options: ["Neděle", "Sobota", "Pondělí", "Čtvrtek"],
    emoji: "🗓️",
    hints: [
      "Za 1 den po pátku je sobota. Za 2 dny po pátku je…",
      "Posuň se od pátku o jeden den dopředu a pak ještě o jeden. Každý krok je jeden další den v týdnu, dozadu se nevracej.",
    ],
    optionFeedback: {
      Sobota: "Sobota je jen za jeden den, druhý krok chybí.",
      Pondělí: "Pondělí bude až za tři dny.",
      Čtvrtek: "Čtvrtek je před pátkem — šel jsi pozpátku.",
    },
    solutionSteps: ["Pátek + 1 den = sobota, sobota + 1 den = neděle. Za dva dny bude neděle."],
  },
  {
    question: "Dnes je pondělí. Jaký den byl předevčírem?",
    correctAnswer: "Sobota",
    options: ["Sobota", "Neděle", "Středa", "Pátek"],
    emoji: "⏪",
    hints: [
      "Předevčírem znamená před dvěma dny — v týdnu půjdeš pozpátku.",
      "Od pondělí udělej krok zpátky (to je včera) a pak ještě jeden krok zpátky. Pozor, pozpátku se přes víkend vracíš do minulého týdne.",
    ],
    optionFeedback: {
      Neděle: "Neděle byla včera — předevčírem je o den dřív.",
      Středa: "Středa bude za dva dny — šel jsi dopředu místo dozadu.",
      Pátek: "Pátek byl už před třemi dny.",
    },
    solutionSteps: ["Pondělí − 1 den = neděle (včera), neděle − 1 den = sobota. Předevčírem byla sobota."],
  },
  {
    question:
      "Anička má narozeniny v posledním měsíci roku. Ve kterém ročním období to nejspíš je?",
    correctAnswer: "V zimě",
    options: ["Na podzim", "V zimě", "V létě", "Na jaře"],
    emoji: "🎂",
    hints: [
      "Nejdřív si vzpomeň, který měsíc je poslední v roce.",
      "Poslední měsíc v roce je prosinec — a ten patří k jednomu konkrétnímu ročnímu období, spolu s lednem a únorem.",
    ],
    optionFeedback: {
      "Na podzim": "Podzimní měsíce jsou září, říjen a listopad — prosinec už k nim nepatří.",
      "V létě": "Léto je v červnu, červenci a srpnu, uprostřed roku.",
      "Na jaře": "Jaro je v březnu, dubnu a květnu.",
    },
    solutionSteps: [
      "Poslední měsíc v roce je prosinec a prosinec je zimní měsíc — narozeniny budou v zimě.",
    ],
  },
  {
    question: "Petr má narozeniny v prvním měsíci roku. Ve kterém ročním období to nejspíš je?",
    correctAnswer: "V zimě",
    options: ["Na jaře", "V létě", "V zimě", "Na podzim"],
    emoji: "🎂",
    hints: [
      "Nejdřív si vzpomeň, který měsíc je první v roce.",
      "První měsíc v roce je leden — hned po Silvestru. Vzpomeň si, jaké počasí v tu dobu venku bývá a co se dá dělat na horách.",
    ],
    optionFeedback: {
      "Na jaře": "Jaro začíná až v březnu, leden je ještě chladný.",
      "V létě": "Léto je uprostřed roku, leden je na jeho začátku.",
      "Na podzim": "Podzim je v září až listopadu, ne v lednu.",
    },
    solutionSteps: [
      "První měsíc v roce je leden a leden je zimní měsíc — narozeniny budou v zimě.",
    ],
  },
  {
    question: "Jarda říká: „Den přede mnou je sobota a den po mně je pondělí.“ Jaký je dnes den?",
    correctAnswer: "Neděle",
    options: ["Sobota", "Pondělí", "Pátek", "Neděle"],
    emoji: "🧩",
    hints: [
      "Hledej den, který leží přesně mezi sobotou a pondělím.",
      "Řekni si dny popořadě: sobota, …, pondělí. Který den se schovává na místě teček? Jarda je právě ten jeden den mezi nimi.",
    ],
    optionFeedback: {
      Sobota: "Sobota je den PŘED Jardou, ne Jarda sám.",
      Pondělí: "Pondělí je den PO Jardovi.",
      Pátek: "Po pátku přijde sobota, ne pondělí — to nesedí.",
    },
    solutionSteps: [
      "Mezi sobotou a pondělím leží jen jeden den — neděle. Sobota → neděle → pondělí.",
    ],
  },
  {
    question: "Pavla říká: „Den přede mnou je pondělí a den po mně je středa.“ Jaký je dnes den?",
    correctAnswer: "Úterý",
    options: ["Úterý", "Pondělí", "Středa", "Čtvrtek"],
    emoji: "🧩",
    hints: [
      "Hledej den, který leží přesně mezi pondělím a středou.",
      "Řekni si dny popořadě: pondělí, …, středa. Den, který chybí na místě teček, je druhý den týdne.",
    ],
    optionFeedback: {
      Pondělí: "Pondělí je den PŘED Pavlou, ne Pavla sama.",
      Středa: "Středa je den PO Pavle.",
      Čtvrtek: "Po čtvrtku přijde pátek, ne středa — to nesedí.",
    },
    solutionSteps: [
      "Mezi pondělím a středou leží jen jeden den — úterý. Pondělí → úterý → středa.",
    ],
  },
  {
    question: "Kolik minut uplyne od osmi hodin do půl deváté?",
    correctAnswer: pad(30, "MINUTA"),
    options: [pad(30, "MINUTA"), pad(15, "MINUTA"), pad(60, "MINUTA"), pad(45, "MINUTA")],
    emoji: "🕐",
    hints: [
      "Půl deváté znamená, že do devíti hodin zbývá ještě půl hodiny.",
      "Celá hodina má 60 minut. Od osmi do půl deváté ujde minutová ručička jen polovinu ciferníku — kolik je polovina ze šedesáti?",
    ],
    optionFeedback: {
      [pad(15, "MINUTA")]: "Patnáct minut je čtvrt hodiny — to by bylo čtvrt na devět.",
      [pad(60, "MINUTA")]: "Šedesát minut by uplynulo až do devíti hodin.",
      [pad(45, "MINUTA")]: "Čtyřicet pět minut jsou tři čtvrtě hodiny — to by bylo tři čtvrtě na devět.",
    },
    solutionSteps: ["Od osmi do půl deváté uplyne půl hodiny. Hodina má 60 minut, polovina je 30 minut."],
  },
  {
    question: "Kolik hodin uplyne od půlnoci do poledne?",
    correctAnswer: pad(12, "HODINA"),
    options: [pad(12, "HODINA"), pad(6, "HODINA"), pad(24, "HODINA"), pad(18, "HODINA")],
    emoji: "🌗",
    hints: [
      "Den má 24 hodin a poledne je přesně uprostřed dne.",
      "Celý den i s nocí má 24 hodin. Poledne ho dělí na dvě stejné poloviny — rozděl proto 24 hodin na dvě stejné části.",
    ],
    optionFeedback: {
      [pad(6, "HODINA")]: "Šest hodin po půlnoci je teprve brzy ráno.",
      [pad(24, "HODINA")]: "Dvacet čtyři hodin je celý den, od půlnoci do další půlnoci.",
      [pad(18, "HODINA")]: "Osmnáct hodin po půlnoci je až šest hodin večer.",
    },
    solutionSteps: ["Den má 24 hodin, poledne je přesně v polovině — od půlnoci do poledne je to 12 hodin."],
  },
  {
    question: "Vánoce slavíme v prosinci. V jakém ročním období tedy slavíme Vánoce?",
    correctAnswer: "V zimě",
    options: ["Na podzim", "V zimě", "V létě", "Na jaře"],
    emoji: "🎄",
    hints: [
      "Nejdřív si vzpomeň, jaké roční období patří k prosinci.",
      "Každé roční období má tři měsíce. Do stejného období jako prosinec patří i leden a únor — tehdy často padá sníh.",
    ],
    optionFeedback: {
      "Na podzim": "Podzim jsou září, říjen a listopad; prosinec už ne.",
      "V létě": "V létě jsou prázdniny, Vánoce slavíme o půl roku později.",
      "Na jaře": "Na jaře slavíme Velikonoce, ne Vánoce.",
    },
    solutionSteps: ["Prosinec je zimní měsíc, a proto Vánoce slavíme v zimě."],
  },
  {
    question: "Které roční období je v roce mezi jarem a podzimem?",
    correctAnswer: "Léto",
    options: ["Zima", "Podzim", "Léto", "Jaro"],
    emoji: "☀️",
    hints: [
      "Seřaď si roční období popořadě, jak jdou za sebou.",
      "Začni jarem a pokračuj dál. Období hned po jaru je to s prázdninami a koupáním — a teprve po něm přijde podzim.",
    ],
    optionFeedback: {
      Zima: "Zima je mezi podzimem a jarem, na druhé straně roku.",
      Podzim: "Podzim je jedna z hranic — hledáme období MEZI jarem a podzimem.",
      Jaro: "Jaro je druhá hranice, ne období mezi nimi.",
    },
    solutionSteps: ["Pořadí ročních období je jaro → léto → podzim → zima. Mezi jarem a podzimem je léto."],
  },
  {
    question: "Teď je leden. Za kolik měsíců bude duben?",
    correctAnswer: pad(3, "MĚSÍC"),
    options: [pad(3, "MĚSÍC"), pad(4, "MĚSÍC"), pad(2, "MĚSÍC"), pad(5, "MĚSÍC")],
    emoji: "🗓️",
    hints: [
      "Vyjmenuj měsíce od ledna dál, až dojdeš k dubnu.",
      "Za každý krok na další měsíc ohni jeden prst: únor, březen… Leden nepočítej, ten je teď. Duben započítej.",
    ],
    optionFeedback: {
      [pad(4, "MĚSÍC")]: "Čtyři — nejspíš jsi započítal i leden, který je teď.",
      [pad(2, "MĚSÍC")]: "Za dva měsíce bude teprve březen.",
      [pad(5, "MĚSÍC")]: "Za pět měsíců už bude červen.",
    },
    solutionSteps: ["Od ledna: únor (1), březen (2), duben (3). Duben bude za 3 měsíce."],
  },
  {
    question: "Kolik dní v týdnu chodíme normálně do školy (bez víkendu)?",
    correctAnswer: pad(5, "DEN"),
    options: [pad(5, "DEN"), pad(7, "DEN"), pad(6, "DEN"), pad(2, "DEN")],
    emoji: "🏫",
    hints: [
      "Týden má 7 dní. Víkend tvoří 2 dny — sobota a neděle.",
      "Od sedmi dnů v týdnu odečti dva víkendové dny, kdy se do školy nechodí. Můžeš to i spočítat na prstech: pondělí, úterý…",
    ],
    optionFeedback: {
      [pad(7, "DEN")]: "Sedm dní má celý týden i s víkendem, o víkendu se do školy nechodí.",
      [pad(6, "DEN")]: "Šest — odečetl jsi jen jeden víkendový den, víkend má dva.",
      [pad(2, "DEN")]: "Dva dny trvá víkend, kdy se do školy nechodí.",
    },
    solutionSteps: ["Týden má 7 dní, víkend jsou 2 dny (sobota, neděle). 7 − 2 = 5 — do školy chodíme 5 dní v týdnu."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool).map((t) => ({ ...t, options: t.options ? shuffle(t.options) : t.options }));
}

export const HODINYKALENDARCAS: TopicMetadata[] = [
  {
    id: "g2-prv-hodiny-cas",
    rvpNodeId: "g2-prvouka-lide-a-cas-mereni-casu-a-tradice-hodiny-kalendar-cas",
    title: "Hodiny, kalendář a čas",
    studentTitle: "Co je dnes za den?",
    subject: "prvouka",
    category: "Lidé a čas",
    topic: "Měření času a tradice",
    briefDescription: "Poznáš dny, měsíce, roční období a hodiny.",
    keywords: ["čas", "hodiny", "kalendář", "den", "týden", "měsíc", "rok", "roční období"],
    goals: [
      "Vědět, kolik má rok měsíců, týden dní a den hodin.",
      "Znát pořadí dnů v týdnu, měsíců v roce a ročních období.",
      "Orientovat se v kalendáři a porovnat délku časových jednotek.",
    ],
    boundaries: ["Pouze základní jednotky času.", "Bez čtení přesného času na hodinách."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Rok má 12 měsíců a 4 roční období, týden 7 dní, den 24 hodin, hodina 60 minut.",
      steps: ["Přečti otázku.", "Vzpomeň si na kalendář a hodiny.", "U hádanek si dny nebo měsíce vyjmenuj popořadě."],
      commonMistake: "Záměna týdne (7 dní) a roku (12 měsíců), nebo záměna pořadí ročních období.",
      example: "Týden má 7 dní: pondělí až neděle. Rok má čtyři roční období: jaro, léto, podzim, zima.",
    },
  },
];
