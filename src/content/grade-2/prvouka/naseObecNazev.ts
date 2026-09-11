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
  /** Malá nápověda — jemně nasměruje. */
  hint: string;
  /** Velká nápověda — konkrétní situace k této větě, pořád bez odpovědi. */
  hint2: string;
  /** Zpětná vazba k chybné volbě (proč opačná odpověď neplatí). */
  wrong: string;
  solution: string;
}

function toTask(item: TrueFalseItem): PracticeTask {
  return {
    question: item.question,
    correctAnswer: item.correct ? ANO : NE,
    options: [ANO, NE],
    emoji: item.emoji,
    hints: [item.hint, item.hint2],
    optionFeedback: { [item.correct ? NE : ANO]: item.wrong },
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
//   L3 = transfer: vztah pojmů „obec ⊃ vesnice, město“, co z výroku
//        plyne jistě, pořadí dům < ulice < obec, proč adresa potřebuje
//        název obce, „co bys udělal, kdyby ses ztratil“ — výhradně
//        4 možnosti (Ano/Ne jen na L1).
// Každá úloha: dvě vlastní nápovědy, zpětná vazba u každé chybné možnosti.
// ─────────────────────────────────────────────────────────

const POOL_L1: TrueFalseItem[] = [
  {
    question: "Praha je město. Je to pravda?",
    correct: true,
    emoji: "🏙️",
    hint: "Praha má víc než milion obyvatel.",
    hint2: "Představ si tisíce domů, tramvaje, metro a spoustu ulic. Je to malé místo s návsí, nebo velké místo, kde žije mnoho lidí?",
    wrong: "Praha opravdu je město — dokonce největší a hlavní město České republiky.",
    solution: "Praha je město — je to dokonce hlavní město České republiky.",
  },
  {
    question: "Vesnice je menší než město. Je to pravda?",
    correct: true,
    emoji: "🏡",
    hint: "Porovnej, kde žije víc lidí a kde stojí víc domů.",
    hint2: "Na vesnici se lidé většinou znají, protože jich tam žije málo. Ve městě jsou sídliště, obchodní centra a spousta ulic. Kde je lidí a domů méně?",
    wrong: "Vesnice je opravdu menší — žije v ní méně lidí než ve městě.",
    solution: "Vesnice je menší než město — ve městě žije víc lidí a je tam víc budov.",
  },
  {
    question: "Každá obec má svůj název. Je to pravda?",
    correct: true,
    emoji: "🏘️",
    hint: "Stejně jako my máme jméno, má i každá obec své jméno.",
    hint2: "Když jedete autem, u silnice na kraji obce stojí cedule s velkým nápisem. Co je na ní napsané?",
    wrong: "Každá obec má svůj název — podle něj ji najdeme na mapě i v adrese.",
    solution: "Každá obec má svůj název — podle něj ji poznáme na mapě i v adrese.",
  },
  {
    question: "V obci bydlí lidé. Je to pravda?",
    correct: true,
    emoji: "🏘️",
    hint: "Obec je místo, kde lidé bydlí, pracují a žijí.",
    hint2: "Vzpomeň si na své bydliště: kdo žije v domech kolem tebe? Rodiny, sousedé, kamarádi…",
    wrong: "V obci bydlí lidé — kvůli tomu obce vznikly.",
    solution: "V obci bydlí lidé — to je základní smysl obce jako místa k životu.",
  },
  {
    question: "V obci jsou ulice. Je to pravda?",
    correct: true,
    emoji: "🛣️",
    hint: "Ulice jsou cesty mezi domy — v každé obci nějaké jsou.",
    hint2: "Když jdeš ze školy domů, po čem jdeš a jak se to místo jmenuje? Taková místa mají i svá jména, třeba Školní nebo Lipová.",
    wrong: "V obci jsou ulice — po nich chodíme a jezdíme mezi domy.",
    solution: "V obci jsou ulice — po nich se pohybujeme mezi domy.",
  },
  {
    question: "Obec má svůj úřad. Je to pravda?",
    correct: true,
    emoji: "🏛️",
    hint: "Obecní úřad nebo radnice se stará o věci v obci.",
    hint2: "Někdo musí rozhodnout, kde se opraví silnice nebo postaví hřiště. Pracuje v budově, které se v obci říká obecní úřad nebo radnice.",
    wrong: "Obec svůj úřad má — starosta a úředníci tam vyřizují věci obce.",
    solution: "Obec má svůj úřad — tam se rozhoduje o věcech, které se obce týkají.",
  },
  {
    question: "Ve většině obcí je obchod. Je to pravda?",
    correct: true,
    emoji: "🏪",
    hint: "V obchodě nakupujeme jídlo a věci, které potřebujeme.",
    hint2: "Kde tvoje rodina kupuje chleba a mléko? Takové místo najdeme skoro v každém městě i ve většině vesnic.",
    wrong: "Ve většině obcí obchod je — lidé tam nakupují jídlo.",
    solution: "Ve většině obcí je obchod — tam nakupujeme jídlo a potřebné věci.",
  },
  {
    question: "Praha je vesnice. Je to pravda?",
    correct: false,
    emoji: "🏙️",
    hint: "Vzpomeň si, jak velká je Praha a kolik v ní jezdí tramvají.",
    hint2: "Vesnice mívá pár desítek nebo stovek domů a náves. Praha má metro, tramvaje, vysoké domy a přes milion obyvatel. Sedí na ni slovo vesnice?",
    wrong: "Praha není vesnice — je to velké město, hlavní město České republiky.",
    solution: "Praha není vesnice — je to velké město, hlavní město České republiky.",
  },
  {
    question: "Obec nemá žádné domy. Je to pravda?",
    correct: false,
    emoji: "🏠",
    hint: "Obec je místo, kde stojí domy a bydlí v nich lidé.",
    hint2: "Kdyby na nějakém místě nestál ani jeden dům, kde by lidé spali a bydleli? Bylo by to vůbec místo k životu?",
    wrong: "Obec domy má — bez domů by to byla jen louka nebo les.",
    solution: "Obec má domy — bez domů by to nebyla obec, ale les nebo pole.",
  },
  {
    question: "V obci nežijí žádní lidé. Je to pravda?",
    correct: false,
    emoji: "🏘️",
    hint: "Kde bydlíme my i naši sousedé?",
    hint2: "Každá obec má své obyvatele — rodiny, děti, babičky a dědečky. Kdo by jinak chodil do obchodu, do školy nebo na úřad?",
    wrong: "V obci žijí lidé — bez obyvatel by to nebyla obec.",
    solution: "V obci žijí lidé — bez obyvatel by to nebyla obec.",
  },
  {
    question: "Obec nemá ulice. Je to pravda?",
    correct: false,
    emoji: "🛣️",
    hint: "Jak bychom se jinak dostali mezi domy k sousedům?",
    hint2: "Na obálku dopisu píšeme i jméno cesty, u které dům stojí, třeba Nádražní. Kde by takové jméno bylo, kdyby obec žádné cesty neměla?",
    wrong: "Obec ulice má — bez nich bychom se mezi domy nedostali.",
    solution: "Obec má ulice — bez ulic bychom se mezi domy nedostali.",
  },
  {
    question: "Vesnice je větší než město. Je to pravda?",
    correct: false,
    emoji: "🏡",
    hint: "Srovnej počet obyvatel vesnice a města — kde jich je víc?",
    hint2: "Ve městě jezdí autobusy a tramvaje a stojí tam spousta domů a sídlišť. Na vesnici je pár ulic a náves. Které z těch míst je větší?",
    wrong: "Vesnice větší než město být nemůže — ve městě žije víc lidí.",
    solution: "Vesnice není větší než město — město je větší, žije v něm víc lidí.",
  },
  {
    question: "Praha je hlavní město České republiky. Je to pravda?",
    correct: true,
    emoji: "🏰",
    hint: "Každý stát má hlavní město, kde sídlí prezident a vláda.",
    hint2: "Na Pražském hradě sídlí prezident. Ve kterém městě tedy prezident pracuje a jaké postavení to město v zemi má?",
    wrong: "Praha opravdu je hlavní město České republiky.",
    solution: "Praha je hlavní město České republiky — sídlí tam prezident i vláda.",
  },
  {
    question: "Naše adresa obsahuje název obce, ve které bydlíme. Je to pravda?",
    correct: true,
    emoji: "📮",
    hint: "Adresa říká, kde bydlíme — patří do ní i jméno místa, ne jen ulice.",
    hint2: "Na obálku píšeme jméno, ulici, číslo domu — a ještě něco, aby pošťák věděl, do kterého města nebo vesnice má dopis doručit.",
    wrong: "Název obce v adrese je — bez něj by pošta nevěděla, kam dopis poslat.",
    solution: "Naše adresa obsahuje název obce — díky tomu nás pošta i záchranáři najdou.",
  },
  {
    question: "V obci bývá škola. Je to pravda?",
    correct: true,
    emoji: "🏫",
    hint: "Ve většině obcí najdeme budovu, kam chodí děti se učit.",
    hint2: "Kam chodíš každé ráno s aktovkou? Taková budova bývá ve městech i v mnoha vesnicích, aby to děti neměly daleko.",
    wrong: "V obci bývá škola — chodí do ní děti z okolí.",
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
    hints: [
      "Přemýšlej, kde bývá náves a jen málo domů.",
      "Náves je prostranství uprostřed malé obce, často s rybníkem a kapličkou. Kolem jsou pole a louky, protože obec je malá. Jak se takové obci říká?",
    ],
    optionFeedback: {
      město: "Ve městě je hodně domů a ulic, náves a pole kolem nebývají.",
      sídliště: "Sídliště je skupina paneláků ve městě, ne malé místo s návsí.",
      ulice: "Ulice je jen cesta mezi domy, ne celé místo s návsí a poli.",
    },
    explanation:
      "Málo domů, náves a pole kolem jsou typické pro vesnici. Ve městě bývá mnohem víc domů a ulic.",
  },
  {
    question:
      "Toto je popis místa: „Mnoho ulic, vysoké domy, obchody a jezdí tam tramvaje.“ O jaké místo jde?",
    correctAnswer: "město",
    options: ["vesnice", "město", "náves", "adresa"],
    emoji: "🏙️",
    hints: [
      "Kde bývá hodně domů, ulic a lidí najednou?",
      "Tramvaje jezdí jen tam, kde žije opravdu hodně lidí a je mnoho ulic. Na malém místě s návsí by tramvaj neměla koho vozit.",
    ],
    optionFeedback: {
      vesnice: "Na vesnici tramvaje nejezdí a vysokých domů je málo.",
      náves: "Náves je jen prostranství uprostřed vesnice, ne celé místo.",
      adresa: "Adresa je zápis, kde někdo bydlí, ne místo samotné.",
    },
    explanation:
      "Mnoho ulic, vysoké domy, obchody a tramvaje jsou typické pro město. Vesnice bývá mnohem menší.",
  },
  {
    question: "Která část adresy nám řekne, ve které obci někdo bydlí?",
    correctAnswer: "název obce",
    options: ["barva vstupních dveří", "jméno rodinného mazlíčka", "název obce", "počet oken v domě"],
    emoji: "📮",
    hints: [
      "Vzpomeň si, co všechno píšeme do adresy na obálku dopisu.",
      "Barvu dveří ani jméno mazlíčka pošťák nepotřebuje. Hledej údaj, podle kterého pozná, do kterého města nebo vesnice má dopis doručit.",
    ],
    optionFeedback: {
      "barva vstupních dveří": "Barva dveří do adresy nepatří, pošta ji nepotřebuje.",
      "jméno rodinného mazlíčka": "Jméno mazlíčka se do adresy nepíše.",
      "počet oken v domě": "Počet oken nikomu neřekne, kde dům stojí.",
    },
    explanation: "Název obce je součástí adresy a říká, ve kterém místě člověk bydlí.",
  },
  {
    question: "Skupině bytových nebo panelových domů, které stojí blízko sebe, se říká:",
    correctAnswer: "sídliště",
    options: ["náves", "adresa", "škola", "sídliště"],
    emoji: "🏢",
    hints: [
      "Přemýšlej, kde bydlí hodně lidí v mnoha stejných domech vedle sebe.",
      "Takové místo najdeš hlavně ve městech: stojí tam vedle sebe vysoké domy s mnoha byty a mezi nimi hřiště a parkoviště.",
    ],
    optionFeedback: {
      náves: "Náves je prostranství uprostřed vesnice, bez paneláků.",
      adresa: "Adresa je zápis bydliště, ne skupina domů.",
      škola: "Škola je jedna budova pro výuku, ne skupina bytových domů.",
    },
    explanation: "Sídliště je část obce, kde stojí blízko sebe bytové nebo panelové domy.",
  },
  {
    question:
      "Klidnému prostranství uprostřed vesnice, kde bývá třeba rybník nebo kaplička, se říká:",
    correctAnswer: "náves",
    options: ["náves", "sídliště", "adresa", "obchod"],
    emoji: "⛲",
    hints: [
      "Je to střed vesnice, kolem kterého stojí domy.",
      "Na tomhle místě se ve vesnici konají slavnosti, stojí tam lípa, kaplička nebo požární nádrž a kolem dokola jsou domy.",
    ],
    optionFeedback: {
      sídliště: "Sídliště je skupina paneláků, bývá hlavně ve městě.",
      adresa: "Adresa je zápis bydliště, ne místo ve vesnici.",
      obchod: "Obchod je budova na nakupování, ne prostranství.",
    },
    explanation: "Náves je klidné prostranství uprostřed vesnice, kde bývá rybník, kaplička nebo lavičky.",
  },
  {
    question: "Vesnice i město jsou dva druhy čeho?",
    correctAnswer: "obce",
    options: ["státu", "obce", "ulice", "školy"],
    emoji: "🏘️",
    hints: [
      "Vesnice i město jsou dva druhy stejné věci — jak se ta věc jmenuje?",
      "Hledané slovo zahrnuje každé místo, kde lidé bydlí a které má svůj název a úřad — malé i velké. Ulice ani škola to nejsou, ty jsou jen jejich součástí.",
    ],
    optionFeedback: {
      státu: "Stát je mnohem větší — skládá se z mnoha vesnic a měst.",
      ulice: "Ulice je jen část vesnice nebo města.",
      školy: "Škola je budova, ne druh místa k bydlení.",
    },
    explanation: "Vesnice i město jsou druhy obce — obec může být malá (vesnice), nebo velká (město).",
  },
  {
    question: "Kde se v obci rozhoduje o důležitých věcech, jako je oprava silnice nebo stavba školy?",
    correctAnswer: "na obecním úřadě",
    options: ["v obchodě", "na hřišti", "na obecním úřadě", "v lese"],
    emoji: "🏛️",
    hints: [
      "Přemýšlej, kde pracují lidé, kteří se starají o celou obec.",
      "V obchodě se nakupuje a na hřišti hraje. Hledej budovu, kde pracuje starosta a kde se rozhoduje o penězích a opravách pro celou obec.",
    ],
    optionFeedback: {
      "v obchodě": "V obchodě se nakupuje, o obci se tam nerozhoduje.",
      "na hřišti": "Na hřišti si děti hrají.",
      "v lese": "V lese se o obci nerozhoduje.",
    },
    explanation: "Na obecním úřadě se rozhoduje o důležitých věcech, které se týkají celé obce.",
  },
  {
    question: "Která z možností NENÍ obvyklou součástí adresy?",
    correctAnswer: "oblíbená barva",
    options: ["název ulice", "číslo domu", "název obce", "oblíbená barva"],
    emoji: "✉️",
    hints: [
      "Adresa obsahuje jen údaje, podle kterých nás najde pošta — ne to, co máme rádi.",
      "Projdi možnosti a u každé se zeptej: pomůže tohle pošťákovi najít správný dům? Tři údaje pomůžou, jeden vůbec ne.",
    ],
    optionFeedback: {
      "název ulice": "Název ulice do adresy patří — hledáš údaj, který tam nepatří.",
      "číslo domu": "Číslo domu v adrese být musí.",
      "název obce": "Název obce do adresy patří.",
    },
    explanation: "Oblíbená barva není součástí adresy. Adresa obsahuje název ulice, číslo domu a název obce.",
  },
  {
    question:
      "Velké město se dělí na menší kousky s vlastními jmény, třeba Staré Město. Jak se jim říká?",
    correctAnswer: "části obce",
    options: ["části obce", "ulice", "náměstí", "adresy"],
    emoji: "🗺️",
    hints: [
      "Hledej slovo, které říká, že jde o kousek většího celku.",
      "Takový kousek má své jméno, ale patří pod stejný úřad jako celé město. Jedna ulice nebo jedno náměstí jsou ještě mnohem menší než on.",
    ],
    optionFeedback: {
      ulice: "Ulice je jen jedna cesta s domy, takový kousek města jich má mnoho.",
      náměstí: "Náměstí je jedno prostranství, ne celý kus města.",
      adresy: "Adresa je zápis bydliště, ne kus města.",
    },
    explanation:
      "Velké obce se dělí na části obce s vlastními názvy — například Staré Město nebo nějaké sídliště. Každá část má mnoho ulic i náměstí.",
  },
  {
    question: "Co patří mezi typické znaky vesnice spíše než města?",
    correctAnswer: "menší počet domů",
    options: ["mrakodrapy", "menší počet domů", "tramvaje", "velké nákupní centrum"],
    emoji: "🏘️",
    hints: [
      "Hledej znak, který se týká menšího místa, ne velkého města.",
      "Mrakodrapy, tramvaje i velká nákupní centra se vyplatí jen tam, kde žije hodně lidí. Hledej jedinou věc, která se hodí k malému místu.",
    ],
    optionFeedback: {
      mrakodrapy: "Mrakodrapy stojí ve velkých městech.",
      tramvaje: "Tramvaje jezdí jen ve větších městech.",
      "velké nákupní centrum": "Velká nákupní centra bývají ve městech.",
    },
    explanation:
      "Menší počet domů je typický pro vesnici. Mrakodrapy, tramvaje a velká nákupní centra bývají naopak ve městech.",
  },
  {
    question: "Jak se jmenuje hlavní město České republiky?",
    correctAnswer: "Praha",
    options: ["Brno", "Ostrava", "Praha", "Plzeň"],
    emoji: "🏰",
    hints: [
      "Je to největší město u nás, kde sídlí vláda a prezident.",
      "Brno, Ostrava a Plzeň jsou velká města, ale hlavní není ani jedno z nich. Hledej město, které leží na Vltavě a má na kopci hrad s prezidentem.",
    ],
    optionFeedback: {
      Brno: "Brno je druhé největší město, ale ne hlavní.",
      Ostrava: "Ostrava je velké město na severu Moravy, ale ne hlavní.",
      Plzeň: "Plzeň je krajské město na západě Čech, ale ne hlavní.",
    },
    explanation: "Hlavní město České republiky je Praha — sídlí v ní prezident i vláda.",
  },
  {
    question: "Co v adrese domu rozhodně nesmí chybět, abychom dům v obci našli?",
    correctAnswer: "číslo domu",
    options: ["datum narození", "oblíbené číslo", "počet sourozenců", "číslo domu"],
    emoji: "🔢",
    hints: [
      "Přemýšlej, co je napsané přímo na domě, kde bydlíš.",
      "V jedné ulici stojí mnoho domů vedle sebe. Každý z nich má na zdi malou cedulku, aby je pošťák od sebe rozlišil.",
    ],
    optionFeedback: {
      "datum narození": "Datum narození neříká, kde bydlíš.",
      "oblíbené číslo": "Oblíbené číslo do adresy nepatří, pošťák by s ním dům nenašel.",
      "počet sourozenců": "Počet sourozenců s adresou nesouvisí.",
    },
    explanation:
      "V adrese nesmí chybět číslo domu — podle něj mezi ostatními domy v ulici poznáme ten správný.",
  },
  {
    question:
      "Ivan bydlí v místě, kde je jen pár desítek domů, uprostřed náves s rybníkem a kolem pole. Kde Ivan bydlí?",
    correctAnswer: "Ve vesnici",
    options: ["Ve vesnici", "Ve velkém městě", "Na sídlišti", "V centru města"],
    emoji: "👦",
    hints: [
      "Pár domů, náves a pole kolem — jak velké to místo je?",
      "Sídliště i centrum města jsou plné vysokých domů a ulic. Ivan má kolem domu jen pár sousedů, rybník na návsi a pole. Kde tedy bydlí?",
    ],
    optionFeedback: {
      "Ve velkém městě": "Velké město má tisíce domů, ne pár desítek.",
      "Na sídlišti": "Sídliště je skupina paneláků ve městě, náves tam nebývá.",
      "V centru města": "V centru města je spousta domů a obchodů, ne pole a náves.",
    },
    explanation: "Málo domů, náves a pole kolem jsou typické pro vesnici — proto Ivan bydlí ve vesnici.",
  },
  {
    question:
      "Petra bydlí v místě s mnoha ulicemi, obchody a vysokými domy, kde jezdí tramvaj. Kde Petra bydlí?",
    correctAnswer: "Ve městě",
    options: ["Ve vesnici", "Ve městě", "Na samotě u lesa", "Na statku u pole"],
    emoji: "👧",
    hints: [
      "Mnoho ulic, obchodů a tramvaj — jak velké to místo je?",
      "Tramvaj a vysoké domy s mnoha obchody najdeš jen tam, kde žije hodně lidí. Na vesnici, na samotě ani na statku tramvaj nejezdí.",
    ],
    optionFeedback: {
      "Ve vesnici": "Vesnice má málo domů a tramvaj tam nejezdí.",
      "Na samotě u lesa": "Samota je jeden dům daleko od ostatních, ulice a tramvaj tam nejsou.",
      "Na statku u pole": "Statek stojí u polí, vysoké domy a tramvaj tam nejsou.",
    },
    explanation:
      "Mnoho ulic, obchody, vysoké domy a tramvaj jsou typické pro město — proto Petra bydlí ve městě.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question:
      "Ztratil ses v obci a potkáš dospělého, který ti chce pomoct najít cestu domů. Co mu řekneš jako první?",
    correctAnswer: "Název naší obce a ulice, kde bydlím",
    options: ["Jméno svého domácího mazlíčka", "Jakou barvu má naše auto", "Název naší obce a ulice, kde bydlím", "Co jsem měl dnes k obědu"],
    emoji: "🧭",
    hints: [
      "Přemýšlej, co dospělému nejvíc pomůže najít, kde bydlíš.",
      "Dospělý tě může dovést domů, jen když ví, kam přesně. Jméno mazlíčka ani barva auta mu k tomu nepomůže. Co z tvé adresy mu řekneš?",
    ],
    optionFeedback: {
      "Jméno svého domácího mazlíčka": "Podle jména mazlíčka dospělý tvůj dům nenajde.",
      "Jakou barvu má naše auto": "Aut stejné barvy je spousta, dům podle toho nenajdete.",
      "Co jsem měl dnes k obědu": "Oběd s cestou domů nesouvisí.",
    },
    explanation:
      "Když se ztratíme, nejvíc pomůže říct název obce a ulice, kde bydlíme — podle toho nás dospělý dovede domů.",
  },
  {
    question: "Co určuje, jestli je obec vesnicí, nebo městem?",
    correctAnswer: "hlavně velikost obce a počet lidí, kteří v ní žijí",
    options: ["barva domů v obci", "jméno starosty obce", "počet pouličních lamp v obci", "hlavně velikost obce a počet lidí, kteří v ní žijí"],
    emoji: "⚖️",
    hints: [
      "Přemýšlej, čím se vesnice a město nejvíc liší.",
      "Barvu domů lze přemalovat a starosta se může vyměnit, ale obec zůstane stejná. Vesnice se změní ve město jen tehdy, když se hodně rozroste.",
    ],
    optionFeedback: {
      "barva domů v obci": "Barva domů o typu obce nerozhoduje.",
      "jméno starosty obce": "Starostu má vesnice i město, jeho jméno nic neurčuje.",
      "počet pouličních lamp v obci": "Lampy mají vesnice i města, podle nich se typ obce neurčuje.",
    },
    explanation:
      "Jestli je obec vesnicí, nebo městem, určuje hlavně její velikost a počet lidí, kteří v ní žijí — ne barva domů, jméno starosty ani počet lamp.",
  },
  {
    question:
      "Obec má náves, málo domů a pole kolem, ale i vlastní obecní úřad. O jaký typ obce nejspíš jde?",
    correctAnswer: "o malou vesnici",
    options: ["o malou vesnici", "o velké město", "o sídliště", "o hlavní město"],
    emoji: "🏡",
    hints: [
      "Spoj dvě věci: jak obec vypadá (náves, pole) a to, že i malá obec může mít úřad.",
      "Úřad nemá jen město — má ho každá obec, i ta nejmenší. Rozhodni proto jen podle toho, jak obec vypadá: náves, málo domů, pole kolem.",
    ],
    optionFeedback: {
      "o velké město": "Velké město má mnoho domů a ulic, náves a pole kolem nebývají.",
      "o sídliště": "Sídliště není samostatná obec, je to část města s paneláky.",
      "o hlavní město": "Hlavní město je u nás jen jedno — Praha — a je obrovské.",
    },
    explanation:
      "Náves, málo domů a pole kolem jsou typické pro vesnici. I malá vesnice přitom může mít vlastní obecní úřad, který se stará o její záležitosti.",
  },
  {
    question: "Které tvrzení je správné?",
    correctAnswer: "Každé město je obec, ale ne každá obec je město",
    options: ["Obec a město znamenají vždy totéž", "Každé město je obec, ale ne každá obec je město", "Vesnice a obec spolu vůbec nesouvisí", "Město je vždycky menší než vesnice"],
    emoji: "🤔",
    hints: [
      "Zamysli se, jestli slovo obec zahrnuje vesnice i města, nebo jen jedno z nich.",
      "Obec je jako velká krabice, do které patří malé vesnice i velká města. Když je něco město, patří tedy určitě do té krabice. Platí to ale i obráceně?",
    ],
    optionFeedback: {
      "Obec a město znamenají vždy totéž": "Nemusí — obcí je i vesnice, a ta městem není.",
      "Vesnice a obec spolu vůbec nesouvisí": "Souvisí — vesnice je druh obce.",
      "Město je vždycky menší než vesnice": "Je to naopak, město je větší.",
    },
    explanation:
      "Obec je nadřazený pojem — patří pod ni vesnice i město. Proto je každé město obcí, ale ne každá obec je zrovna městem, může to být i vesnice.",
  },
  {
    question: "Která obec může mít svůj obecní úřad?",
    correctAnswer: "Každá obec, malá vesnice i velké město",
    options: ["Jen velké město", "Jen hlavní město Praha", "Každá obec, malá vesnice i velké město", "Žádná, úřady jsou jen v krajích"],
    emoji: "🏛️",
    hints: [
      "Přemýšlej, jestli úřad souvisí s velikostí obce, nebo s tím, že je to obec.",
      "I obec s pár desítkami domů potřebuje někoho, kdo se stará o její silnice, lampy a hřiště. Kde takový člověk pracuje a má ho jen velké místo?",
    ],
    optionFeedback: {
      "Jen velké město": "Úřad má i malá vesnice, ne jen město.",
      "Jen hlavní město Praha": "Úřad má každá obec, ne jen Praha.",
      "Žádná, úřady jsou jen v krajích": "Obecní úřad má přímo každá obec.",
    },
    explanation:
      "I malá vesnice je obec, a proto má svůj obecní úřad, stejně jako velké město.",
  },
  {
    question: "Píšeš dopis babičce, která bydlí v jiné obci. Co musíš napsat na obálku, aby jí ho pošta doručila?",
    correctAnswer: "Celou adresu včetně názvu obce",
    options: ["Jen její jméno", "Jen to, že bydlí na vesnici", "Celou adresu včetně názvu obce", "Nic, pošta adresu najde sama"],
    emoji: "✉️",
    hints: [
      "Přemýšlej, co všechno pošta potřebuje vědět, aby našla přesně ten správný dům ve správné obci.",
      "Babiček se stejným jménem je v republice spousta a ulice se stejným názvem jsou v mnoha obcích. Co všechno tedy musí být na obálce, aby pošťák našel ten jediný správný dům?",
    ],
    optionFeedback: {
      "Jen její jméno": "Podle jména pošta babičku nenajde, lidí se stejným jménem je hodně.",
      "Jen to, že bydlí na vesnici": "Vesnic jsou tisíce, pošta by nevěděla, do které.",
      "Nic, pošta adresu najde sama": "Pošta adresu neuhodne, musí ji mít napsanou.",
    },
    explanation:
      "Na obálku patří celá adresa — jméno, ulice, číslo domu a název obce — jinak by pošta dopis nedoručila.",
  },
  {
    question: "V čem se liší sídliště od návsi?",
    correctAnswer: "Sídliště je skupina domů spíš ve městě, náves je prostranství uprostřed vesnice",
    options: ["Sídliště a náves jsou úplně to samé", "Sídliště bývá jen na vesnici, náves jen ve městě", "Sídliště je řeka, náves je kopec", "Sídliště je skupina domů spíš ve městě, náves je prostranství uprostřed vesnice"],
    emoji: "🏘️",
    hints: [
      "Přemýšlej, kde se sídliště obvykle staví a kde bývá náves.",
      "Vzpomeň si: kde stojí paneláky s mnoha byty a kde je klidné místo s rybníkem a kapličkou? Jedno patří spíš k městu, druhé k malé obci.",
    ],
    optionFeedback: {
      "Sídliště a náves jsou úplně to samé": "Nejsou — sídliště jsou domy, náves je prostranství.",
      "Sídliště bývá jen na vesnici, náves jen ve městě": "Je to obráceně — náves patří k vesnici, sídliště spíš k městu.",
      "Sídliště je řeka, náves je kopec": "Ani jedno není řeka ani kopec, obojí je část obce.",
    },
    explanation:
      "Sídliště je skupina bytových domů, která bývá spíš ve městě, zatímco náves je klidné prostranství uprostřed vesnice.",
  },
  {
    question: "Co platí o Praze?",
    correctAnswer: "Je to obec, město i hlavní město zároveň",
    options: ["Je to vesnice, a proto i hlavní město", "Je to hlavní město, ale ne obec", "Je to město, ale ne hlavní město", "Je to obec, město i hlavní město zároveň"],
    emoji: "🏰",
    hints: [
      "Praha je jedna konkrétní obec — a má ještě jednu zvláštní roli pro celou zemi.",
      "Praha je obrovská, takže je to město. Každé město je obec. A navíc v ní sídlí prezident a vláda. Kolik z těch pojmů na ni sedí?",
    ],
    optionFeedback: {
      "Je to vesnice, a proto i hlavní město": "Praha není vesnice — je to velké město.",
      "Je to hlavní město, ale ne obec": "Každé město, i hlavní, je zároveň obec.",
      "Je to město, ale ne hlavní město": "Praha je hlavní město České republiky.",
    },
    explanation:
      "Praha je obec, konkrétně velké město, a zároveň je hlavním městem České republiky — platí na ni všechny tři pojmy.",
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
    hints: [
      "Obec může být malá i velká — dá se to poznat jen z tohoto jednoho slova?",
      "Obec je nadřazené slovo — patří pod něj malé vesnice i velká města. Kamarád neřekl, jak velká jeho obec je, takže jistě víš jen málo.",
    ],
    optionFeedback: {
      "Že bydlí určitě ve vesnici": "Obcí je i město, takže vesnice to být nemusí.",
      "Že bydlí určitě ve velkém městě": "Obcí je i vesnice, takže město to být nemusí.",
      "Že vůbec nikde nebydlí": "Říká přece, že bydlí v obci.",
    },
    explanation:
      "Slovo obec zahrnuje vesnice i města, takže jen z něj samotného nepoznáme, jestli kamarád bydlí v malé vesnici, nebo ve velkém městě.",
  },
  {
    question: "Jsi na výletě v jiné obci a chceš zjistit její název. Kam se nejlíp podíváš?",
    correctAnswer: "Na ceduli s názvem obce při vjezdu do obce",
    options: ["Na oblohu", "Na ceduli s názvem obce při vjezdu do obce", "Na boty kolemjdoucího", "Do jídelního lístku v restauraci"],
    emoji: "🪧",
    hints: [
      "Kde se obec návštěvníkům sama představí, hned když do ní přijedou?",
      "Obloha ani boty kolemjdoucích název obce neprozradí a jídelní lístek bývá jen o jídle. Hledej místo u silnice na kraji obce, kde je velký nápis.",
    ],
    optionFeedback: {
      "Na oblohu": "Na obloze žádný název obce nenajdeš.",
      "Na boty kolemjdoucího": "Boty o obci nic neřeknou.",
      "Do jídelního lístku v restauraci": "Jídelní lístek je o jídle, název obce tam většinou nebývá.",
    },
    explanation: "Při vjezdu do obce bývá cedule s jejím názvem — podle ní poznáme, kam jsme přijeli.",
  },
  {
    question: "Kdy všude se hodí znát svou adresu?",
    correctAnswer: "Při psaní dopisu i při volání záchranářů",
    options: ["Jen když píšu dopis", "Jen když jdu do školy", "Při psaní dopisu i při volání záchranářů", "Nikdy, stačí znát jméno"],
    emoji: "📭",
    hints: [
      "Přemýšlej, kdy ještě musí někdo vědět, kde přesně bydlíš.",
      "Když se doma někomu udělá zle a voláš záchranku na číslo 155, první, na co se tě zeptají, je, kam mají přijet. Kdy tedy adresa pomůže?",
    ],
    optionFeedback: {
      "Jen když píšu dopis": "Adresa se hodí i v jiných situacích, třeba když voláme pomoc.",
      "Jen když jdu do školy": "Cestu do školy znáš, adresu potřebuješ hlavně pro dopisy a přivolání pomoci.",
      "Nikdy, stačí znát jméno": "Podle jména tě nikdo nenajde, adresa je důležitá.",
    },
    explanation:
      "Adresu potřebujeme nejen na dopis, ale i když voláme záchranáře nebo se ptáme cizích lidí na cestu domů.",
  },
  {
    question: "Které pořadí je seřazené od nejmenšího k největšímu?",
    correctAnswer: "dům, ulice, obec",
    options: ["obec, ulice, dům", "ulice, obec, dům", "dům, ulice, obec", "dům, obec, ulice"],
    emoji: "📏",
    hints: [
      "Začni od nejmenšího místa, kde bydlíš, a postupně jdi k větším celkům.",
      "V jedné ulici stojí mnoho domů a jedna obec má mnoho ulic. Co je tedy nejmenší, co je uprostřed a co je největší?",
    ],
    optionFeedback: {
      "obec, ulice, dům": "To je pořadí od největšího k nejmenšímu — obrácené.",
      "ulice, obec, dům": "Dům je nejmenší, nemůže být na konci.",
      "dům, obec, ulice": "Obec je větší než ulice, musí být až poslední.",
    },
    explanation: "Nejmenší je dům, pak ulice, na které dům stojí, a nakonec celá obec, do které ulice patří.",
  },
  {
    question: "Který z pojmů NEPATŘÍ mezi části jedné obce?",
    correctAnswer: "úplně jiná, vzdálená obec",
    options: ["sídliště s paneláky", "náves uprostřed obce", "ulice s rodinnými domy", "úplně jiná, vzdálená obec"],
    emoji: "🚫",
    hints: [
      "Tři možnosti jsou přímo částmi jedné obce, jedna je něco úplně jiného.",
      "Sídliště, náves i ulice najdeš uvnitř jedné obce. Hledej možnost, která leží úplně mimo ni a má vlastní název i úřad.",
    ],
    optionFeedback: {
      "sídliště s paneláky": "Sídliště je část obce — hledáš, co do obce nepatří.",
      "náves uprostřed obce": "Náves je přímo uprostřed obce.",
      "ulice s rodinnými domy": "Ulice jsou součástí obce.",
    },
    explanation:
      "Jiná, vzdálená obec není částí naší obce — je to samostatné místo. Sídliště, náves i ulice jsou naopak přímo částmi obce.",
  },
  {
    question: "Proč do adresy píšeme i název obce, když už tam je ulice?",
    correctAnswer: "Protože stejná ulice může být ve více obcích",
    options: ["Protože ulice nemají názvy", "Protože se to hezky čte", "Protože stejná ulice může být ve více obcích", "Protože pošťák nezná ulice"],
    emoji: "🛣️",
    hints: [
      "Přemýšlej, jestli název ulice sám stačí, abychom poznali přesné místo.",
      "Ulice s názvem Školní nebo Nádražní je skoro v každém městě. Kdyby na obálce stála jen ulice, do kterého města by pošta dopis poslala?",
    ],
    optionFeedback: {
      "Protože ulice nemají názvy": "Ulice názvy mají — jen se v různých obcích opakují.",
      "Protože se to hezky čte": "Nejde o to, jak se to čte, ale aby pošta našla správné místo.",
      "Protože pošťák nezná ulice": "Pošťák ulice ve své obci zná, potřebuje ale vědět, do které obce dopis patří.",
    },
    explanation:
      "Stejný název ulice, například Školní, může být ve více obcích. Proto k úplné adrese patří i název obce.",
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
