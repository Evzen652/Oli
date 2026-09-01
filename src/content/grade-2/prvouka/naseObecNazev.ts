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
//   L1 = rozpoznání izolovaného faktu: co je obec, vesnice, město,
//        adresa, ulice, náves — formát Ano/Ne (2 možnosti).
//   L2 = aplikace: přiřazení pojmu ke konkrétnímu příkladu/popisu,
//        rozpoznání typu sídla (vesnice/město), části adresy —
//        výběr ze 4 možností.
//   L3 = transfer (kombinace dvou faktů, rozlišení blízkých pojmů
//        „obec vs. vesnice vs. město“, jednoduché „co bys udělal,
//        kdyby ses ztratil“ scénáře) — většinou 4 možnosti, jen
//        menšina Ano/Ne.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Praha je město. Je to pravda?",
    correct: true,
    emoji: "🏙️",
    hint: "Praha má víc než milion obyvatel — je to vesnice, nebo město?",
    solution: "Praha je město — je to dokonce hlavní město České republiky.",
  },
  {
    question: "Vesnice je menší než město. Je to pravda?",
    correct: true,
    emoji: "🏡",
    hint: "Ve městě žije víc lidí a je tam víc domů než na vesnici.",
    solution: "Vesnice je menší než město — ve městě žije víc lidí a je tam víc budov.",
  },
  {
    question: "Každá obec má svůj název. Je to pravda?",
    correct: true,
    emoji: "🏘️",
    hint: "Stejně jako my máme jméno, má i každá obec své jméno.",
    solution: "Každá obec má svůj název — podle něj ji poznáme na mapě i v adrese.",
  },
  {
    question: "V obci bydlí lidé. Je to pravda?",
    correct: true,
    emoji: "🏘️",
    hint: "Obec je místo, kde lidé bydlí, pracují a žijí.",
    solution: "V obci bydlí lidé — to je základní smysl obce jako místa k životu.",
  },
  {
    question: "V obci jsou ulice. Je to pravda?",
    correct: true,
    emoji: "🛣️",
    hint: "Ulice jsou cesty mezi domy — v každé obci nějaké jsou.",
    solution: "V obci jsou ulice — po nich se pohybujeme mezi domy.",
  },
  {
    question: "Obec má svůj úřad. Je to pravda?",
    correct: true,
    emoji: "🏛️",
    hint: "Obecní úřad nebo radnice se stará o věci v obci.",
    solution: "Obec má svůj úřad — tam se rozhoduje o věcech, které se obce týkají.",
  },
  {
    question: "Ve většině obcí je obchod. Je to pravda?",
    correct: true,
    emoji: "🏪",
    hint: "V obchodě nakupujeme jídlo a věci, které potřebujeme.",
    solution: "Ve většině obcí je obchod — tam nakupujeme jídlo a potřebné věci.",
  },
  {
    question: "Praha je vesnice. Je to pravda?",
    correct: false,
    emoji: "🏙️",
    hint: "Praha má víc než milion obyvatel — je to vesnice, nebo město?",
    solution: "Praha není vesnice — je to velké město, hlavní město České republiky.",
  },
  {
    question: "Obec nemá žádné domy. Je to pravda?",
    correct: false,
    emoji: "🏠",
    hint: "Obec je místo, kde stojí domy a bydlí v nich lidé.",
    solution: "Obec má domy — bez domů by to nebyla obec, ale les nebo pole.",
  },
  {
    question: "V obci nežijí žádní lidé. Je to pravda?",
    correct: false,
    emoji: "🏘️",
    hint: "Kde bydlíme my i naši sousedé?",
    solution: "V obci žijí lidé — bez obyvatel by to nebyla obec.",
  },
  {
    question: "Obec nemá ulice. Je to pravda?",
    correct: false,
    emoji: "🛣️",
    hint: "Jak bychom se jinak dostali mezi domy k sousedům?",
    solution: "Obec má ulice — bez ulic bychom se mezi domy nedostali.",
  },
  {
    question: "Vesnice je větší než město. Je to pravda?",
    correct: false,
    emoji: "🏡",
    hint: "Srovnej počet obyvatel vesnice a města — kde jich je víc?",
    solution: "Vesnice není větší než město — město je větší, žije v něm víc lidí.",
  },
  {
    question: "Praha je hlavní město České republiky. Je to pravda?",
    correct: true,
    emoji: "🏰",
    hint: "Každý stát má hlavní město — víš, které je hlavní město Česka?",
    solution: "Praha je hlavní město České republiky — sídlí tam prezident i vláda.",
  },
  {
    question: "Naše adresa obsahuje název obce, ve které bydlíme. Je to pravda?",
    correct: true,
    emoji: "📮",
    hint: "Adresa říká, kde bydlíme — patří do ní i jméno místa, ne jen ulice.",
    solution: "Naše adresa obsahuje název obce — díky tomu nás pošta i záchranáři najdou.",
  },
  {
    question: "V obci bývá škola. Je to pravda?",
    correct: true,
    emoji: "🏫",
    hint: "Ve většině obcí najdeme budovu, kam chodí děti se učit.",
    solution: "V obci bývá škola — děti tam chodí se vzdělávat.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question:
      "Toto je popis místa: „Málo domů, uprostřed náves, kolem pole a louky.“ O jaké místo jde?",
    correctAnswer: "vesnice",
    options: ["vesnice", "město", "sídliště", "ulice"],
    emoji: "🏡",
    hints: ["Přemýšlej, kde bývá náves a jen málo domů — na vesnici, nebo ve velkém městě?"],
    explanation:
      "Málo domů, náves a pole kolem jsou typické pro vesnici. Ve městě bývá mnohem víc domů a ulic.",
  },
  {
    question:
      "Toto je popis místa: „Mnoho ulic, vysoké domy, obchody a jezdí tam tramvaje.“ O jaké místo jde?",
    correctAnswer: "město",
    options: ["město", "vesnice", "náves", "adresa"],
    emoji: "🏙️",
    hints: ["Kde bývá hodně domů, ulic a lidí najednou, a jezdí tam i tramvaje?"],
    explanation:
      "Mnoho ulic, vysoké domy, obchody a tramvaje jsou typické pro město. Vesnice bývá mnohem menší.",
  },
  {
    question: "Která část adresy nám řekne, ve které obci někdo bydlí?",
    correctAnswer: "název obce",
    options: ["název obce", "barva vstupních dveří", "jméno rodinného mazlíčka", "počet oken v domě"],
    emoji: "📮",
    hints: ["Vzpomeň si, co všechno píšeme do adresy na obálku dopisu — ulici, číslo domu i město."],
    explanation: "Název obce je součástí adresy a říká, ve kterém místě člověk bydlí.",
  },
  {
    question: "Skupině bytových nebo panelových domů, které stojí blízko sebe, se říká:",
    correctAnswer: "sídliště",
    options: ["sídliště", "náves", "adresa", "škola"],
    emoji: "🏢",
    hints: ["Přemýšlej, kde bydlí hodně lidí v mnoha stejných domech vedle sebe."],
    explanation: "Sídliště je část obce, kde stojí blízko sebe bytové nebo panelové domy.",
  },
  {
    question:
      "Klidnému prostranství uprostřed vesnice, kde bývá třeba rybník nebo kaplička, se říká:",
    correctAnswer: "náves",
    options: ["náves", "sídliště", "adresa", "obchod"],
    emoji: "⛲",
    hints: ["Je to střed vesnice, kolem kterého stojí domy."],
    explanation: "Náves je klidné prostranství uprostřed vesnice, kde bývá rybník, kaplička nebo lavičky.",
  },
  {
    question: "Vesnice i město jsou dva druhy čeho?",
    correctAnswer: "obce",
    options: ["obce", "státu", "ulice", "školy"],
    emoji: "🏘️",
    hints: ["Vesnice i město jsou dva druhy stejné věci — jak se ta věc jmenuje?"],
    explanation: "Vesnice i město jsou druhy obce — obec může být malá (vesnice), nebo velká (město).",
  },
  {
    question: "Kde se v obci rozhoduje o důležitých věcech, jako je oprava silnice nebo stavba školy?",
    correctAnswer: "na obecním úřadě",
    options: ["na obecním úřadě", "v obchodě", "na hřišti", "v lese"],
    emoji: "🏛️",
    hints: ["Přemýšlej, kde pracují lidé, kteří se starají o celou obec."],
    explanation: "Na obecním úřadě se rozhoduje o důležitých věcech, které se týkají celé obce.",
  },
  {
    question: "Která z možností NENÍ obvyklou součástí adresy?",
    correctAnswer: "oblíbená barva",
    options: ["oblíbená barva", "název ulice", "číslo domu", "název obce"],
    emoji: "✉️",
    hints: ["Adresa obsahuje jen údaje, podle kterých nás najde pošta — ne to, co máme rádi."],
    explanation: "Oblíbená barva není součástí adresy. Adresa obsahuje název ulice, číslo domu a název obce.",
  },
  {
    question:
      "Jak se nazývá menší část velké obce nebo města, která má svůj vlastní název, například sídliště nebo staré město?",
    correctAnswer: "část obce",
    options: ["část obce", "škola", "hřiště", "obchod"],
    emoji: "🗺️",
    hints: ["Hledej slovo, které je přímo v otázce — obec se dělí na menší..."],
    explanation:
      "Velká obec nebo město se dělí na menší části obce, které mají vlastní název, například sídliště nebo staré město.",
  },
  {
    question: "Co patří mezi typické znaky vesnice spíše než města?",
    correctAnswer: "menší počet domů",
    options: ["menší počet domů", "mrakodrapy", "tramvaje", "velké nákupní centrum"],
    emoji: "🏘️",
    hints: ["Hledej znak, který se týká menšího místa, ne velkého města."],
    explanation:
      "Menší počet domů je typický pro vesnici. Mrakodrapy, tramvaje a velká nákupní centra bývají naopak ve městech.",
  },
  {
    question: "Jak se jmenuje hlavní město České republiky?",
    correctAnswer: "Praha",
    options: ["Praha", "Brno", "Ostrava", "Plzeň"],
    emoji: "🏰",
    hints: ["Je to největší město u nás, kde sídlí vláda a prezident."],
    explanation: "Hlavní město České republiky je Praha.",
  },
  {
    question: "Co v adrese domu rozhodně nesmí chybět, abychom dům v obci našli?",
    correctAnswer: "číslo domu",
    options: ["číslo domu", "datum narození", "oblíbené číslo", "počet sourozenců"],
    emoji: "🔢",
    hints: ["Přemýšlej, jaké číslo je napsané přímo na domě, kde bydlíš."],
    explanation:
      "V adrese nesmí chybět číslo domu — podle něj mezi ostatními domy v ulici poznáme ten správný.",
  },
  {
    question:
      "Ivan bydlí v místě, kde je jen pár desítek domů, uprostřed náves s rybníkem a kolem pole. Ivan bydlí v:",
    correctAnswer: "vesnici",
    options: ["vesnici", "městě", "na sídlišti", "v obchodě"],
    emoji: "👦",
    hints: ["Pár domů, náves a pole kolem — je to spíš vesnice, nebo velké město?"],
    explanation: "Málo domů, náves a pole kolem jsou typické pro vesnici — proto Ivan bydlí ve vesnici.",
  },
  {
    question:
      "Petra bydlí v místě s mnoha ulicemi, obchody a vysokými domy, kde jezdí tramvaj. Petra bydlí v:",
    correctAnswer: "městě",
    options: ["městě", "vesnici", "na návsi", "v lese"],
    emoji: "👧",
    hints: ["Mnoho ulic, obchodů a tramvaj — je to spíš vesnice, nebo město?"],
    explanation:
      "Mnoho ulic, obchody, vysoké domy a tramvaj jsou typické pro město — proto Petra bydlí ve městě.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question:
      "Ztratil ses v obci a potkáš dospělého, který ti chce pomoct najít cestu domů. Co mu řekneš jako první?",
    correctAnswer: "Název naší obce a ulice, kde bydlím",
    options: [
      "Název naší obce a ulice, kde bydlím",
      "Jméno svého domácího mazlíčka",
      "Jakou barvu má naše auto",
      "Co jsem měl dnes k obědu",
    ],
    emoji: "🧭",
    hints: ["Přemýšlej, co dospělému nejvíc pomůže najít, kde bydlíš."],
    explanation:
      "Když se ztratíme, nejvíc pomůže říct název obce a ulice, kde bydlíme — podle toho nás dospělý dovede domů.",
  },
  {
    question: "Co určuje, jestli je obec vesnicí, nebo městem?",
    correctAnswer: "hlavně velikost obce a počet lidí, kteří v ní žijí",
    options: [
      "hlavně velikost obce a počet lidí, kteří v ní žijí",
      "barva domů v obci",
      "jméno starosty obce",
      "počet pouličních lamp v obci",
    ],
    emoji: "⚖️",
    hints: ["Přemýšlej, čím se vesnice a město nejvíc liší."],
    explanation:
      "Jestli je obec vesnicí, nebo městem, určuje hlavně její velikost a počet lidí, kteří v ní žijí — ne barva domů, jméno starosty ani počet lamp.",
  },
  {
    question:
      "Obec má náves, jen málo domů a kolem ní jsou pole, ale přesto má svůj vlastní obecní úřad. O jaký typ obce nejspíš jde?",
    correctAnswer: "o malou vesnici",
    options: ["o malou vesnici", "o velkoměsto s mrakodrapy", "o obchod", "o školu"],
    emoji: "🏡",
    hints: ["Spoj dvě věci: jak obec vypadá (náves, pole) a to, že i malá obec může mít úřad."],
    explanation:
      "Náves, málo domů a pole kolem jsou typické pro vesnici. I malá vesnice přitom může mít vlastní obecní úřad, který se stará o její záležitosti.",
  },
  {
    question: "Které tvrzení je správné?",
    correctAnswer: "Každé město je obec, ale ne každá obec je město",
    options: [
      "Každé město je obec, ale ne každá obec je město",
      "Každá obec je město",
      "Vesnice a obec spolu vůbec nesouvisí",
      "Město je vždycky menší než vesnice",
    ],
    emoji: "🤔",
    hints: ["Zamysli se, jestli slovo obec zahrnuje vesnice i města, nebo jen jedno z nich."],
    explanation:
      "Obec je nadřazený pojem — patří pod ni vesnice i město. Proto je každé město obcí, ale ne každá obec je zrovna městem, může to být i vesnice.",
  },
  {
    question: "Obecní úřad může mít i malá vesnice, ne jen velké město. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🏛️",
    hints: ["Přemýšlej, jestli úřad souvisí s velikostí obce, nebo s tím, že to prostě je obec."],
    explanation:
      "Ano, to je pravda — i malá vesnice je obec, a proto může mít svůj obecní úřad, stejně jako velké město.",
  },
  {
    question: "Píšeš dopis babičce, která bydlí v jiné obci. Co musíš napsat na obálku, aby jí ho pošta doručila?",
    correctAnswer: "Celou adresu včetně názvu obce",
    options: [
      "Celou adresu včetně názvu obce",
      "Jen její jméno",
      "Jen to, že bydlí na vesnici",
      "Nic, pošta adresu najde sama",
    ],
    emoji: "✉️",
    hints: ["Přemýšlej, co všechno pošta potřebuje vědět, aby našla přesně ten správný dům ve správné obci."],
    explanation:
      "Na obálku patří celá adresa — jméno, ulice, číslo domu a název obce — jinak by pošta dopis nedoručila.",
  },
  {
    question: "V čem se liší sídliště od návsi?",
    correctAnswer: "Sídliště je skupina domů spíš ve městě, náves je prostranství uprostřed vesnice",
    options: [
      "Sídliště je skupina domů spíš ve městě, náves je prostranství uprostřed vesnice",
      "Sídliště a náves jsou úplně to samé",
      "Sídliště bývá jen na vesnici, náves jen ve městě",
      "Sídliště je řeka, náves je kopec",
    ],
    emoji: "🏘️",
    hints: ["Přemýšlej, kde se sídliště obvykle staví a kde bývá náves."],
    explanation:
      "Sídliště je skupina bytových domů, která bývá spíš ve městě, zatímco náves je klidné prostranství uprostřed vesnice.",
  },
  {
    question: "Praha je zároveň obec i hlavní město celé republiky. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🏰",
    hints: ["Praha je jedna konkrétní obec — a zároveň má ještě jednu zvláštní roli pro celou zemi."],
    explanation:
      "Ano, to je pravda — Praha je obec, konkrétně velké město, a zároveň je hlavním městem České republiky.",
  },
  {
    question: "Kamarád ti řekne: „Bydlím v obci.“ Co z toho víš jistě?",
    correctAnswer: "Že bydlí buď ve vesnici, nebo ve městě, ale nevíš které",
    options: [
      "Že bydlí buď ve vesnici, nebo ve městě, ale nevíš které",
      "Že bydlí určitě ve vesnici",
      "Že bydlí určitě ve velkém městě",
      "Že vůbec nikde nebydlí",
    ],
    emoji: "❓",
    hints: ["Obec může být malá i velká — dá se to poznat jen z tohoto jednoho slova?"],
    explanation:
      "Slovo obec zahrnuje vesnice i města, takže jen z něj samotného nepoznáme, jestli kamarád bydlí v malé vesnici, nebo ve velkém městě.",
  },
  {
    question: "Jsi na výletě v jiné obci a chceš zjistit její název. Kam se nejlíp podíváš?",
    correctAnswer: "Na ceduli s názvem obce při vjezdu do obce",
    options: [
      "Na ceduli s názvem obce při vjezdu do obce",
      "Na oblohu",
      "Na boty kolemjdoucího",
      "Do jídelního lístku v restauraci",
    ],
    emoji: "🪧",
    hints: ["Obce mívají při silnici na kraji obce ceduli, která návštěvníkům něco důležitého prozradí."],
    explanation: "Při vjezdu do obce bývá cedule s jejím názvem — podle ní poznáme, kam jsme přijeli.",
  },
  {
    question: "Adresu potřebujeme jen tehdy, když píšeme dopis. Je to pravda?",
    correctAnswer: NE,
    options: [ANO, NE],
    emoji: "📭",
    hints: ["Přemýšlej, kdy všude se ještě adresa hodí — třeba když voláme o pomoc."],
    explanation:
      "Ne, to není pravda — adresu potřebujeme i v jiných situacích, například když voláme záchranáře nebo se ptáme cizích lidí na cestu domů.",
  },
  {
    question: "Které pořadí je seřazené od nejmenšího k největšímu?",
    correctAnswer: "dům → ulice → obec",
    options: ["dům → ulice → obec", "obec → ulice → dům", "ulice → obec → dům", "dům → obec → ulice"],
    emoji: "📏",
    hints: ["Začni od nejmenšího místa, kde bydlíš, a postupně jdi k větším celkům."],
    explanation: "Nejmenší je dům, pak ulice, na které dům stojí, a nakonec celá obec, do které ulice patří.",
  },
  {
    question: "Který z pojmů NEPATŘÍ mezi části jedné obce?",
    correctAnswer: "úplně jiná, vzdálená obec",
    options: ["sídliště s paneláky", "úplně jiná, vzdálená obec", "náves uprostřed obce", "ulice s rodinnými domy"],
    emoji: "🚫",
    hints: ["Tři možnosti jsou přímo částmi jedné obce, jedna je něco úplně jiného."],
    explanation:
      "Jiná, vzdálená obec není částí naší obce — je to samostatné místo. Sídliště, náves i ulice jsou naopak přímo částmi obce.",
  },
  {
    question:
      "Stejný název ulice, například „Školní“, může existovat ve více různých obcích. Je to pravda?",
    correctAnswer: ANO,
    options: [ANO, NE],
    emoji: "🛣️",
    hints: ["Přemýšlej, jestli jméno ulice samo o sobě stačí k tomu, abychom poznali, o které místo přesně jde."],
    explanation:
      "Ano, to je pravda — stejný název ulice může být ve více obcích. Proto k úplné adrese patří i název obce.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1.map(toTask);
  return shuffle(pool);
}

export const NASEOBECNAZEV: TopicMetadata[] = [
  {
    id: "g2-prv-nase-obec",
    rvpNodeId: "g2-prvouka-misto-kde-zijeme-obec-a-okoli-nase-obec-nazev-cast-obce-kde-ziji",
    title: "Naše obec, název, část obce kde žiji",
    studentTitle: "Naše obec",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Obec a okolí",
    briefDescription: "Poznáš svou obec a její jméno.",
    keywords: ["obec", "vesnice", "město", "název", "bydliště"],
    goals: [
      "Vědět, že obec má svůj název.",
      "Rozlišit město a vesnici.",
      "Znát, co v obci najdeme.",
    ],
    boundaries: ["Pouze základní pojmy.", "Bez map a plánů."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Obec je místo, kde bydlíme. Má jméno, domy a lidi.",
      steps: ["Přečti větu.", "Platí to o obci, nebo ne?"],
      commonMistake: "Vesnice je menší než město, ne naopak.",
      example: "Praha je velké město, Praha je hlavní město.",
    },
  },
];
