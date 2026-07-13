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
//        celého týdne. Bez čtení přesného času na ciferníku (dle boundaries).
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Kolik měsíců má rok?",
    correctAnswer: "12",
    options: ["12", "10", "7", "4"],
    emoji: "📅",
    hints: ["Vzpomeň si na kalendář — leden, únor, březen… kolik jich je celkem?"],
    solutionSteps: ["Rok má 12 měsíců — od ledna do prosince."],
  },
  {
    question: "Kolik dní má týden?",
    correctAnswer: "7",
    options: ["7", "5", "10", "6"],
    emoji: "📆",
    hints: ["Spočítej dny: pondělí, úterý, středa, čtvrtek, pátek, sobota, neděle."],
    solutionSteps: ["Týden má 7 dní — od pondělí do neděle."],
  },
  {
    question: "Kolik hodin má den?",
    correctAnswer: "24",
    options: ["24", "12", "60", "10"],
    emoji: "⏰",
    hints: ["Den má část denní a část noční — dohromady 24 hodin."],
    solutionSteps: ["Den má 24 hodin — 12 hodin dne a 12 hodin noci."],
  },
  {
    question: "Kolik minut má hodina?",
    correctAnswer: "60",
    options: ["60", "30", "100", "24"],
    emoji: "🕐",
    hints: ["Na hodinách je 60 dílků — každý dílek je 1 minuta."],
    solutionSteps: ["Hodina má 60 minut."],
  },
  {
    question: "Kolik dní má rok (přibližně)?",
    correctAnswer: "365",
    options: ["365", "300", "100", "12"],
    emoji: "📅",
    hints: ["Rok má přibližně 52 týdnů. Každý týden má 7 dní — kolik je to celkem?"],
    solutionSteps: ["Rok má 365 dní (přestupný rok má 366)."],
  },
  {
    question: "Který den je první v týdnu?",
    correctAnswer: "Pondělí",
    options: ["Pondělí", "Neděle", "Středa", "Sobota"],
    emoji: "📆",
    hints: ["Týden začíná pracovním dnem — pondělí, úterý…"],
    solutionSteps: ["Pondělí je první den v týdnu — každý týden začíná pondělím."],
  },
  {
    question: "Který den je poslední v týdnu?",
    correctAnswer: "Neděle",
    options: ["Neděle", "Sobota", "Pátek", "Pondělí"],
    emoji: "📆",
    hints: ["Týden končí víkendem — sobota nebo neděle. Který je poslední?"],
    solutionSteps: ["Neděle je poslední den v týdnu."],
  },
  {
    question: "Čím měříme čas?",
    correctAnswer: "Hodiny",
    options: ["Hodiny", "Metr", "Váha", "Teploměr"],
    emoji: "⏰",
    hints: ["Co visí na zdi a ukazuje, kolik je hodin?"],
    solutionSteps: ["Čas měříme hodinami."],
  },
  {
    question: "Kolik ročních období má rok?",
    correctAnswer: "Čtyři",
    options: ["Čtyři", "Tři", "Pět", "Dvě"],
    emoji: "🍂",
    hints: ["Vyjmenuj je: jaro, léto, podzim, zima — kolik jich je?"],
    solutionSteps: ["Rok má čtyři roční období: jaro, léto, podzim a zima."],
  },
  {
    question: "Který měsíc je první v roce?",
    correctAnswer: "Leden",
    options: ["Leden", "Prosinec", "Březen", "Únor"],
    emoji: "❄️",
    hints: ["Rok začíná zimním měsícem — leden, únor…"],
    solutionSteps: ["První měsíc v roce je leden — rok začíná v lednu."],
  },
  {
    question: "Který měsíc je poslední v roce?",
    correctAnswer: "Prosinec",
    options: ["Prosinec", "Leden", "Červen", "Listopad"],
    emoji: "🎄",
    hints: ["Rok končí vánočním měsícem — kdy slavíme Vánoce?"],
    solutionSteps: ["Poslední měsíc v roce je prosinec — v prosinci slavíme Vánoce."],
  },
  {
    question: "Kolik ručiček mají hodiny?",
    correctAnswer: "Dvě",
    options: ["Dvě", "Jedna", "Tři", "Čtyři"],
    emoji: "🕐",
    hints: ["Hodiny mají hodinovou ručičku (kratší) a minutovou ručičku (delší)."],
    solutionSteps: ["Hodiny mají dvě hlavní ručičky — hodinovou a minutovou."],
  },
  {
    question: "Kdy je nejvíc tma?",
    correctAnswer: "Noc",
    options: ["Noc", "Ráno", "Poledne", "Večer"],
    emoji: "🌙",
    hints: ["Slunce svítí přes den — kdy ho nevidíme?"],
    solutionSteps: ["Nejvíc tma je v noci — slunce pak nesvítí."],
  },
  {
    question: "Kdy vychází slunce?",
    correctAnswer: "Ráno",
    options: ["Ráno", "Večer", "Noc", "Poledne"],
    emoji: "🌅",
    hints: ["Slunce vychází na začátku dne — ráno, v poledne nebo večer?"],
    solutionSteps: ["Slunce vychází ráno — na začátku každého dne."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Který den přijde po pondělí?",
    correctAnswer: "Úterý",
    options: ["Úterý", "Neděle", "Pátek", "Středa"],
    emoji: "📆",
    hints: ["Dny v týdnu jdou za sebou: pondělí, úterý, středa… Co přijde hned po pondělí?"],
    solutionSteps: ["Po pondělí přijde úterý — je to druhý den v týdnu."],
  },
  {
    question: "Který den přijde po středě?",
    correctAnswer: "Čtvrtek",
    options: ["Čtvrtek", "Pátek", "Úterý", "Pondělí"],
    emoji: "📆",
    hints: ["Dny jdou za sebou: pondělí, úterý, středa, čtvrtek…"],
    solutionSteps: ["Po středě přijde čtvrtek."],
  },
  {
    question: "Který den je hned před nedělí?",
    correctAnswer: "Sobota",
    options: ["Sobota", "Pátek", "Pondělí", "Čtvrtek"],
    emoji: "📆",
    hints: ["Neděle je poslední den v týdnu. Který den je těsně před ní?"],
    solutionSteps: ["Před nedělí je sobota — spolu tvoří víkend."],
  },
  {
    question: "Které roční období přijde po podzimu?",
    correctAnswer: "Zima",
    options: ["Zima", "Léto", "Jaro", "Podzim"],
    emoji: "❄️",
    hints: ["Čtyři roční období jdou za sebou: jaro, léto, podzim, zima — co přijde po podzimu?"],
    solutionSteps: ["Po podzimu přijde zima — rok má čtyři roční období: jaro, léto, podzim, zima."],
  },
  {
    question: "Které roční období přijde po létě?",
    correctAnswer: "Podzim",
    options: ["Podzim", "Jaro", "Zima", "Léto"],
    emoji: "🍂",
    hints: ["Čtyři roční období: jaro, léto, podzim, zima — co přijde po létě?"],
    solutionSteps: ["Po létě přijde podzim — listí začne padat a ochladí se."],
  },
  {
    question: "Které roční období přijde po zimě?",
    correctAnswer: "Jaro",
    options: ["Jaro", "Léto", "Podzim", "Zima"],
    emoji: "🌱",
    hints: ["Po zimě se oteplí a začnou kvést první květiny."],
    solutionSteps: ["Po zimě přijde jaro — příroda se probouzí k životu."],
  },
  {
    question: "Který měsíc přijde hned po lednu?",
    correctAnswer: "Únor",
    options: ["Únor", "Březen", "Prosinec", "Duben"],
    emoji: "📆",
    hints: ["Měsíce jdou za sebou: leden, únor, březen…"],
    solutionSteps: ["Po lednu přijde únor — je to druhý měsíc v roce."],
  },
  {
    question: "Který měsíc je hned před prosincem?",
    correctAnswer: "Listopad",
    options: ["Listopad", "Říjen", "Leden", "Září"],
    emoji: "📆",
    hints: ["Prosinec je poslední měsíc v roce. Který měsíc je těsně před ním?"],
    solutionSteps: ["Před prosincem je listopad — je to jedenáctý měsíc v roce."],
  },
  {
    question: "Co trvá déle — minuta, nebo hodina?",
    correctAnswer: "Hodina",
    options: ["Hodina", "Minuta", "Jsou stejně dlouhé", "Nedá se to porovnat"],
    emoji: "⏳",
    hints: ["Srovnej: vteřina, minuta, hodina — která z nich trvá nejdéle?"],
    solutionSteps: ["Hodina je delší než minuta — 1 hodina = 60 minut."],
  },
  {
    question: "Co trvá déle — den, nebo týden?",
    correctAnswer: "Týden",
    options: ["Týden", "Den", "Jsou stejně dlouhé", "Nedá se to porovnat"],
    emoji: "📆",
    hints: ["Týden se skládá z několika dní."],
    solutionSteps: ["Týden je delší než den — týden má 7 dní."],
  },
  {
    question: "Co trvá déle — týden, nebo měsíc?",
    correctAnswer: "Měsíc",
    options: ["Měsíc", "Týden", "Jsou stejně dlouhé", "Nedá se to porovnat"],
    emoji: "📅",
    hints: ["Měsíc se skládá z několika týdnů."],
    solutionSteps: ["Měsíc je delší než týden — měsíc má obvykle čtyři týdny a něco navíc."],
  },
  {
    question: "Kolik hodin ukazují hodiny v poledne?",
    correctAnswer: "12",
    options: ["12", "6", "24", "9"],
    emoji: "🕛",
    hints: ["Poledne je uprostřed dne — obě ručičky jsou nahoře na dvanáctce."],
    solutionSteps: ["V poledne je 12 hodin — obě ručičky jsou nahoře."],
  },
  {
    question: "Které dny v týdnu tvoří víkend?",
    correctAnswer: "Sobota a neděle",
    options: ["Sobota a neděle", "Pátek a sobota", "Neděle a pondělí", "Středa a čtvrtek"],
    emoji: "🎉",
    hints: ["Víkend jsou poslední dva dny týdne, kdy se obvykle nechodí do školy."],
    solutionSteps: ["Víkend tvoří sobota a neděle — poslední dva dny v týdnu."],
  },
  {
    question: "Je úterý pracovní den, nebo víkendový den?",
    correctAnswer: "Pracovní den",
    options: ["Pracovní den", "Víkendový den", "Ani jedno", "Státní svátek"],
    emoji: "🏫",
    hints: ["Víkend tvoří jen sobota a neděle. Úterý mezi ně nepatří."],
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
      "Vyjmenuj dny od středy dál: čtvrtek, pátek, sobota, neděle.",
      "Spočítej, kolikrát musíš přejít na další den, než dojdeš k neděli.",
    ],
    solutionSteps: ["Od středy do neděle: čtvrtek, pátek, sobota, neděle — to jsou 4 dny."],
  },
  {
    question: "Dnes je pátek. Jaký den bude za dva dny?",
    correctAnswer: "Neděle",
    options: ["Neděle", "Sobota", "Pondělí", "Čtvrtek"],
    emoji: "🗓️",
    hints: ["Za 1 den po pátku je sobota. Za 2 dny po pátku je…"],
    solutionSteps: ["Pátek + 1 den = sobota, sobota + 1 den = neděle. Za dva dny bude neděle."],
  },
  {
    question:
      "Anička má narozeniny v posledním měsíci roku. Ve kterém ročním období to nejspíš je?",
    correctAnswer: "V zimě",
    options: ["V zimě", "Na podzim", "V létě", "Na jaře"],
    emoji: "🎂",
    hints: [
      "Nejdřív si vzpomeň, který měsíc je poslední v roce.",
      "Poslední měsíc v roce je prosinec — a ten patří k jednomu konkrétnímu ročnímu období.",
    ],
    solutionSteps: [
      "Poslední měsíc v roce je prosinec a prosinec je zimní měsíc — narozeniny budou v zimě.",
    ],
  },
  {
    question: "Petr má narozeniny v prvním měsíci roku. Ve kterém ročním období to nejspíš je?",
    correctAnswer: "V zimě",
    options: ["V zimě", "Na jaře", "V létě", "Na podzim"],
    emoji: "🎂",
    hints: [
      "Nejdřív si vzpomeň, který měsíc je první v roce.",
      "První měsíc v roce je leden — a ten patří k jednomu konkrétnímu ročnímu období.",
    ],
    solutionSteps: [
      "První měsíc v roce je leden a leden je zimní měsíc — narozeniny budou v zimě.",
    ],
  },
  {
    question: "Jarda říká: „Den přede mnou je sobota a den po mně je pondělí.“ Jaký je dnes den?",
    correctAnswer: "Neděle",
    options: ["Neděle", "Sobota", "Pondělí", "Pátek"],
    emoji: "🧩",
    hints: [
      "Hledej den, který leží přesně mezi sobotou a pondělím.",
      "Po sobotě přijde…, a po tom dni přijde pondělí.",
    ],
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
      "Po pondělí přijde…, a po tom dni přijde středa.",
    ],
    solutionSteps: [
      "Mezi pondělím a středou leží jen jeden den — úterý. Pondělí → úterý → středa.",
    ],
  },
  {
    question: "Kolik minut uplyne mezi celou hodinou a půl hodinou?",
    correctAnswer: pad(30, "MINUTA"),
    options: [pad(30, "MINUTA"), pad(15, "MINUTA"), pad(60, "MINUTA"), pad(45, "MINUTA")],
    emoji: "🕐",
    hints: [
      "Hodina má 60 minut. Půl hodiny je polovina z toho.",
      "60 minut děleno dvěma je kolik?",
    ],
    solutionSteps: ["Hodina má 60 minut, půl hodiny je polovina — tedy 30 minut."],
  },
  {
    question: "Kolik hodin uplyne od půlnoci do poledne?",
    correctAnswer: pad(12, "HODINA"),
    options: [pad(12, "HODINA"), pad(6, "HODINA"), pad(24, "HODINA"), pad(18, "HODINA")],
    emoji: "🌗",
    hints: [
      "Den má 24 hodin a poledne je přesně uprostřed dne.",
      "24 hodin děleno dvěma je kolik?",
    ],
    solutionSteps: ["Den má 24 hodin, poledne je přesně v polovině — od půlnoci do poledne je to 12 hodin."],
  },
  {
    question: "Vánoce slavíme v prosinci. V jakém ročním období tedy slavíme Vánoce?",
    correctAnswer: "V zimě",
    options: ["V zimě", "Na podzim", "V létě", "Na jaře"],
    emoji: "🎄",
    hints: [
      "Nejdřív si vzpomeň, jaké roční období patří k prosinci.",
      "Prosinec je poslední, zimní měsíc v roce.",
    ],
    solutionSteps: ["Prosinec je zimní měsíc, a proto Vánoce slavíme v zimě."],
  },
  {
    question: "Které roční období je mezi jarem a podzimem (v pořadí jaro → léto → podzim)?",
    correctAnswer: "Léto",
    options: ["Léto", "Zima", "Podzim", "Jaro"],
    emoji: "☀️",
    hints: [
      "Roční období jdou v pevném pořadí: jaro, léto, podzim, zima.",
      "Které z nich leží přesně mezi jarem a podzimem?",
    ],
    solutionSteps: ["Pořadí ročních období je jaro → léto → podzim → zima. Mezi jarem a podzimem je léto."],
  },
  {
    question: "Kolik měsíců uplyne od ledna do dubna (duben už nepočítej)?",
    correctAnswer: pad(3, "MĚSÍC"),
    options: [pad(3, "MĚSÍC"), pad(4, "MĚSÍC"), pad(2, "MĚSÍC"), pad(5, "MĚSÍC")],
    emoji: "🗓️",
    hints: [
      "Vyjmenuj měsíce od ledna dál: únor, březen, duben.",
      "Spočítej, kolik měsíců uplyne, než dojdeš k dubnu — duben sám nepočítej.",
    ],
    solutionSteps: ["Od ledna do dubna uplynou únor, březen a duben — mezi lednem a dubnem jsou 3 měsíce."],
  },
  {
    question: "Kolik dní v týdnu chodíme normálně do školy (bez víkendu)?",
    correctAnswer: pad(5, "DEN"),
    options: [pad(5, "DEN"), pad(7, "DEN"), pad(6, "DEN"), pad(2, "DEN")],
    emoji: "🏫",
    hints: [
      "Týden má 7 dní. Víkend tvoří 2 dny — sobota a neděle.",
      "Kolik dní zbyde, když od celého týdne odečteš víkend?",
    ],
    solutionSteps: ["Týden má 7 dní, víkend jsou 2 dny (sobota, neděle). 7 − 2 = 5 — do školy chodíme 5 dní v týdnu."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const HODINYKALENDARCAS: TopicMetadata[] = [
  {
    id: "g2-prv-hodiny-cas",
    rvpNodeId: "g2-prvouka-lide-a-cas-mereni-casu-a-tradice-hodiny-kalendar-cas",
    title: "Hodiny, kalendář a čas",
    studentTitle: "Hodiny a čas",
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
