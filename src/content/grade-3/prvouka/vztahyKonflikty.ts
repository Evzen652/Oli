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
    question: "Co znamená slovo empatie?",
    correctAnswer: "Vcítit se do pocitů druhého člověka",
    options: [
      "Vcítit se do pocitů druhého člověka",
      "Být nejlepší ve třídě",
      "Dělat si, co chci",
      "Mluvit hodně hlasitě",
    ],
    hints: [
      "Empatie má základ ve slově 'cítit' — jde o pocity.",
      "Když vidíš smutného kamaráda a snažíš se pochopit, proč je smutný, projevuješ empatii.",
    ],
    explanation:
      "Empatie znamená umět se vcítit do toho, jak se druhý člověk cítí — zkusit pochopit jeho radost, smutek nebo strach. Je to důležitá součást dobrého přátelství.",
  },
  {
    question: "Co znamená respektovat druhého člověka?",
    correctAnswer: "Brát ohled na jeho pocity a názory",
    options: [
      "Brát ohled na jeho pocity a názory",
      "Vždy s ním souhlasit",
      "Ignorovat, co říká",
      "Dělat vše, co si přeje",
    ],
    hints: [
      "Respekt neznamená souhlas — můžeš mít jiný názor a přesto respektovat druhého.",
      "Respektovat = brát ohled, přistupovat s úctou.",
    ],
    explanation:
      "Respekt znamená, že bereme ohled na pocity, názory a potřeby druhého. Nemusíme vždy souhlasit, ale přistupujeme k druhým s úctou a neubližujeme jim.",
  },
  {
    question: "Co je kompromis?",
    correctAnswer: "Řešení, kdy každý trochu ustoupí, aby se dohodli",
    options: [
      "Řešení, kdy každý trochu ustoupí, aby se dohodli",
      "Jeden vyhraje a druhý prohraje",
      "Hádka, která neskončí",
      "Přijmout rozhodnutí dospělého",
    ],
    hints: [
      "Kompromis hledá cestu, která vyhovuje oběma stranám — ne jen jedné.",
      "Každý musí trochu ustoupit od toho, co chce.",
    ],
    explanation:
      "Kompromis je způsob řešení sporu, kdy obě strany trochu ustoupí od svého požadavku a najdou společné řešení. Například: jeden chce hrát fotbal, druhý basketbal — kompromis je odehrát půl hodiny každou hru.",
  },
  {
    question: "Co je spolupráce?",
    correctAnswer: "Společná práce na jednom cíli",
    options: [
      "Společná práce na jednom cíli",
      "Dělat vše sám bez pomoci",
      "Závodit, kdo bude rychlejší",
      "Ignorovat spolužáky",
    ],
    hints: [
      "Spolupráce = spolu + práce. Jde o společné úsilí.",
      "Když táhnou všichni za jeden provaz, dosáhnou cíle snadněji.",
    ],
    explanation:
      "Spolupráce znamená, že lidé pracují společně na dosažení jednoho cíle. Každý přispěje svou silou nebo dovedností a výsledek je lepší, než kdyby každý dělal vše sám.",
  },
  {
    question: "Co znamená tolerance?",
    correctAnswer: "Přijímat a respektovat odlišnosti druhých",
    options: [
      "Přijímat a respektovat odlišnosti druhých",
      "Smát se lidem, kteří jsou jiní",
      "Kamarádit se jen s těmi, kdo jsou jako já",
      "Nikomu nic neříkat",
    ],
    hints: [
      "Lidé jsou různí — jiné záliby, vzhled, zvyky. Tolerance je to přijímat.",
      "Tolerantní člověk neubližuje těm, kdo jsou jiní.",
    ],
    explanation:
      "Tolerance znamená, že přijímáme a respektujeme to, že jsou lidé různí — mají jiné záliby, jiný původ nebo jiné názory. Tolerantní třída je místo, kde se všichni cítí bezpečně.",
  },
  {
    question: "Jaký je první správný krok při řešení konfliktu?",
    correctAnswer: "Uklidnit se a začít klidně mluvit",
    options: [
      "Uklidnit se a začít klidně mluvit",
      "Hned začít křičet",
      "Odejít a nikdy se nevrátit",
      "Říct kamarádovi, ať si řeší problém sám",
    ],
    hints: [
      "Hádka ve vzteku problém nevyřeší — nejprve se zklidni.",
      "Klidná řeč = základ pro nalezení řešení.",
    ],
    explanation:
      "Když se pohádáme, je důležité nejprve se uklidnit — zhluboka se nadechnout nebo chvíli počkat. Teprve poté lze klidně mluvit a hledat řešení. Ve vzteku se těžko dohodne.",
  },
  {
    question: "Proč je důležité naslouchat druhému při konfliktu?",
    correctAnswer: "Abychom pochopili, jak se cítí a co potřebuje",
    options: [
      "Abychom pochopili, jak se cítí a co potřebuje",
      "Abychom hned věděli, kdo má pravdu",
      "Abychom mohli rychle odejít",
      "Naslouchat není při hádce potřeba",
    ],
    hints: [
      "Naslouchat = doopravdy poslouchat, ne jen čekat, až budu mluvit já.",
      "Když druhý cítí, že ho slyšíme, lépe se dohodne.",
    ],
    explanation:
      "Naslouchání je klíčové proto, abychom pochopili pohled a pocity druhého. Když každý mluví a nikdo neposlouchá, konflikt se nevyřeší. Aktivní naslouchání ukazuje respekt.",
  },
  {
    question: "Co je společné řešení konfliktu?",
    correctAnswer: "Hledání dohody, která je přijatelná pro obě strany",
    options: [
      "Hledání dohody, která je přijatelná pro obě strany",
      "Rozhodnutí, které vyhovuje jen mně",
      "Volba té silnější strany",
      "Přestání se bavit navždy",
    ],
    hints: [
      "Dobré řešení nevyhraje jen jeden — vyhovuje oběma.",
      "Ptej se: Co bychom mohli udělat, abychom byli spokojeni oba?",
    ],
    explanation:
      "Společné řešení znamená, že obě strany hledají dohodu, která je pro obě přijatelná. Nemusí být dokonalá pro každého, ale nikoho nechá cítit se jako poražený.",
  },
  {
    question: "Které pravidlo patří do třídy?",
    correctAnswer: "Nasloucháme si navzájem a neskáčeme si do řeči",
    options: [
      "Nasloucháme si navzájem a neskáčeme si do řeči",
      "Kdo křičí nejhlasitěji, ten má pravdu",
      "Při hodině si povídáme s kamarádem",
      "Úkoly plní jen ti, co chtějí",
    ],
    hints: [
      "Pravidla třídy pomáhají, aby se všichni cítili bezpečně a mohli se učit.",
      "Přemýšlej, co pomáhá třídě fungovat dobře.",
    ],
    explanation:
      "Vzájemné naslouchání je základní pravidlo, které ve třídě pomáhá. Když si neskáčeme do řeči, každý dostane prostor vyjádřit svůj názor a třída funguje jako tým.",
  },
  {
    question: "Co patří k dobrému kamarádství?",
    correctAnswer: "Věrnost, pomoc v těžkých chvílích a upřímnost",
    options: [
      "Věrnost, pomoc v těžkých chvílích a upřímnost",
      "Kamarád vždy dělá vše, co chci já",
      "Bavíme se jen tehdy, když je mi dobře",
      "Nikdy si neříkáme pravdu",
    ],
    hints: [
      "Pravý kamarád je tu i tehdy, když se nám nedaří.",
      "Věrnost, pomoc, upřímnost — tři pilíře přátelství.",
    ],
    explanation:
      "Dobré kamarádství stojí na věrnosti (jsme si věrní i v těžkých chvílích), pomoci (pomůžeme si, když je třeba) a upřímnosti (říkáme si pravdu, i když je nepříjemná).",
  },
  {
    question: "Co je násilí (oproti konfliktu)?",
    correctAnswer: "Záměrné ubližování slovem nebo fyzicky",
    options: [
      "Záměrné ubližování slovem nebo fyzicky",
      "Hádka, která skončí dohodou",
      "Rozdílné názory na jednu věc",
      "Soutěž o nejlepší výsledek",
    ],
    hints: [
      "Konflikt lze vyřešit dohodou. Násilí ubližuje záměrně.",
      "Mluvit o problému = konflikt. Bít nebo urážet = násilí.",
    ],
    explanation:
      "Konflikt je spor nebo neshoda, která se dá vyřešit dohodou. Násilí je záměrné ubližování — fyzicky (bití) nebo slovně (urážky, vyhrůžky). Násilí nikdy problém nevyřeší.",
  },
  {
    question: "Jak poznáme, že se kamarád cítí smutně?",
    correctAnswer: "Všimneme si jeho chování a zeptáme se, co mu je",
    options: [
      "Všimneme si jeho chování a zeptáme se, co mu je",
      "Necháme ho být a nevšímáme si ho",
      "Řekneme mu, ať se nesměje",
      "Přijdeme za ním až za týden",
    ],
    hints: [
      "Empatie nám pomáhá všímat si druhých. Zeptat se = projevit zájem.",
      "Kamarád, který se ptá, ukazuje, že mu na nás záleží.",
    ],
    explanation:
      "Vnímat pocity kamaráda a zeptat se, co mu je, je projevem empatie a přátelství. Takový zájem kamaráda potěší a ukáže, že na něj myslíme.",
  },
  {
    question: "Co udělám, když mě spolužák uhodí?",
    correctAnswer: "Řeknu to učiteli nebo dospělému — násilí se nesmí ignorovat",
    options: [
      "Řeknu to učiteli nebo dospělému — násilí se nesmí ignorovat",
      "Uhodím ho zpátky",
      "Nic neřeknu a schovám se",
      "Zasmějí se mi spolužáci, tak nic nedělám",
    ],
    hints: [
      "Násilí je vždy špatné — chránit sebe i druhé je správné.",
      "Dospělý může situaci vyřešit bezpečně.",
    ],
    explanation:
      "Fyzické násilí není nikdy přijatelné. Správná reakce je říct to dospělému (učiteli, rodiči) — ten může situaci vyřešit bezpečně. Oplácení by situaci jen zhoršilo.",
  },
  {
    question: "Proč jsou pravidla třídy důležitá?",
    correctAnswer: "Pomáhají všem cítit se bezpečně a spolupracovat",
    options: [
      "Pomáhají všem cítit se bezpečně a spolupracovat",
      "Jsou jen pro žáky, kteří se špatně chovají",
      "Omezují naši svobodu zbytečně",
      "Vymyslel je učitel, aby ho nikdo nerušil",
    ],
    hints: [
      "Pravidla platí pro všechny — i pro učitele.",
      "Bez pravidel by ve třídě byl chaos a nikdo by se necítil dobře.",
    ],
    explanation:
      "Pravidla třídy pomáhají vytvořit bezpečné a přátelské prostředí, kde se každý může učit a vyjadřovat. Platí pro všechny stejně a vznikají společně, aby je všichni přijali za své.",
  },
  {
    question: "Jak se chováme k novému spolužákovi ve třídě?",
    correctAnswer: "Přivítáme ho, představíme se a pomůžeme mu",
    options: [
      "Přivítáme ho, představíme se a pomůžeme mu",
      "Ignorujeme ho, dokud sám nezačne",
      "Smějeme se, že nezná zvyky třídy",
      "Necháme ho sedět samotného celý týden",
    ],
    hints: [
      "V novém prostředí se každý cítí nejistě — vlídné přivítání pomáhá.",
      "Jak by ses cítil ty, kdybys byl nový?",
    ],
    explanation:
      "Nový spolužák se v neznámém prostředí cítí nejistě. Vlídné přivítání, představení se a pomoc s orientací jsou projevy tolerance a empatie. Taková třída je přátelská pro všechny.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
}

export const VZTAHYKONFLIKTY: TopicMetadata[] = [
  {
    id: "g3-prvouka-lide-kolem-nas-souziti-a-komunikace-vztahy-mezi-lidmi-reseni-konfliktu",
    rvpNodeId:
      "g3-prvouka-lide-kolem-nas-souziti-a-komunikace-vztahy-mezi-lidmi-reseni-konfliktu",
    title: "Vztahy mezi lidmi, řešení konfliktů",
    studentTitle: "Vztahy a konflikty",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití a komunikace",
    briefDescription:
      "Poznáš, jak fungují dobré vztahy a jak řešit konflikty.",
    keywords: [
      "empatie",
      "respekt",
      "kompromis",
      "spolupráce",
      "tolerance",
      "konflikt",
      "násilí",
      "kamarádství",
      "pravidla třídy",
      "naslouchání",
    ],
    goals: [
      "Vysvětlit pojmy empatie, respekt, kompromis, spolupráce a tolerance.",
      "Popsat kroky při řešení konfliktu.",
      "Rozlišit konflikt a násilí.",
      "Uvést příklady dobrého kamarádství.",
    ],
    boundaries: [
      "Základní pojmy a situace ze školního a rodinného života, bez psychologické teorie.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Empatie = vcítit se. Respekt = brát ohled. Kompromis = každý trochu ustoupí. Konflikt = neshoda, která se dá vyřešit klidnou dohodou.",
      steps: [
        "Uklidni se.",
        "Klidně mluv a naslouchej.",
        "Hledejte společné řešení.",
        "Dohodněte se na kompromisu.",
      ],
      commonMistake:
        "Záměna konfliktu a násilí — konflikt je neshoda, násilí záměrně ubližuje.",
      example:
        "Jana a Tomáš se hádají o to, jakou hru hrát. Každý trochu ustoupí a střídají se — to je kompromis.",
    },
  },
];
