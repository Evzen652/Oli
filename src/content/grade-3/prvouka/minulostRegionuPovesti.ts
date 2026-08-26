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
// Bez letopočtů (viz boundaries) — obtížnost roste přes hloubku faktu
// a počet kroků, ne přes datování.
//   L1 = rozpoznání: izolovaná fakta o pověstech a pramenech (kdo, co, kde)
//   L2 = aplikace: doplňkové detaily téže postavy/pověsti, rozlišení
//        archiv vs. muzeum, chování postav v konkrétní situaci
//   L3 = transfer (2 kroky): zařazení pramene do kategorie (hmotný/
//        písemný/ústní), zřetězení faktů přes dvě postavy, přenos
//        pravidla o pramenech do nové situace
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Co je pověst?",
    correctAnswer: "Příběh z minulosti smíchaný s historií a fantazií",
    options: [
      "Příběh z minulosti smíchaný s historií a fantazií",
      "Pravdivá zpráva o historické události",
      "Báseň o hrdinech",
      "Novinový článek o dávné době",
    ],
    hints: [
      "Pověst není ani pohádka, ani přesná historická zpráva — je to něco mezi.",
      "Pověst má základ v historii, ale přidává nadpřirozené nebo zveličené prvky.",
    ],
    explanation:
      "Pověst je příběh, který má základ v historické skutečnosti, ale je smíchaný s fantazií a doplněný o zázračné nebo nadpřirozené události. Nejedná se o přesný historický záznam.",
  },
  {
    question: "Kdo byla Libuše podle pověsti?",
    correctAnswer: "Česká kněžna a věštkyně, zakladatelka Prahy",
    options: [
      "Česká kněžna a věštkyně, zakladatelka Prahy",
      "Dcera Krakonoše ze Sudet",
      "Česká učitelka, která psala kroniky",
      "Selka z Moravy, která vynikala v zemědělství",
    ],
    hints: [
      "Libuše byla dcera knížete Kroka a měla dar věštění.",
      "Podle pověsti zahlédla místo, kde vyrostl slavný hrad.",
    ],
    explanation:
      "Libuše byla podle pověsti česká kněžna s darem věštění. Prorokovala vznik velkého města — Prahy — a vybrala si za manžela prostého oráče Přemysla.",
  },
  {
    question: "Kdo byl Přemysl Oráč podle pověsti?",
    correctAnswer: "Prostý rolník, kterého si Libuše vybrala za muže a zakladatel rodu Přemyslovců",
    options: [
      "Prostý rolník, kterého si Libuše vybrala za muže a zakladatel rodu Přemyslovců",
      "Rytíř, který porazil draka a stal se knížetem",
      "Syn Krakonoše, vládce Krkonoš",
      "Kupec z Bavorska, který přišel do Čech",
    ],
    hints: [
      "Přemysl přišel z pole — oral půdu, když pro něj přijeli Libušini poslové.",
      "Z Přemysla a Libuše vznikl slavný vládnoucí rod.",
    ],
    explanation:
      "Přemysl byl prostý oráč z Stadiče. Libuše ho nechala přivézt ke svému dvoru a vzala si ho za muže. Společně se stali zakladateli rodu Přemyslovců, který vládl Čechám po staletí.",
  },
  {
    question: "Jak se jmenuje rod, který podle pověsti založili Libuše a Přemysl?",
    correctAnswer: "Přemyslovci",
    options: ["Přemyslovci", "Lucemburkové", "Habsburkové", "Slavníkovci"],
    hints: [
      "Název rodu vychází ze jména Přemysl.",
      "Tento rod vládl Čechám po dlouhou dobu.",
    ],
    explanation:
      "Libuše a Přemysl Oráč jsou považováni za zakladatele rodu Přemyslovců. Tento rod vládl českému knížectví a království po několik staletí.",
  },
  {
    question: "Kde podle pověsti spí Blaničtí rytíři?",
    correctAnswer: "V hoře Blaník ve středních Čechách",
    options: [
      "V hoře Blaník ve středních Čechách",
      "Pod Vyšehradem v Praze",
      "V jeskyních Moravského krasu",
      "Pod hradem Karlštejn",
    ],
    hints: [
      "Blaničtí rytíři jsou spojeni s horou, která nese jejich jméno.",
      "Tato hora se nachází v Posázaví.",
    ],
    explanation:
      "Podle pověsti spí Blaničtí rytíři v nitru hory Blaník. Jsou připraveni probudit se a přijít na pomoc českému národu v době největší nouze.",
  },
  {
    question: "Kdo je Krakonoš?",
    correctAnswer: "Duch hor, vládce Krkonoš",
    options: [
      "Duch hor, vládce Krkonoš",
      "Český král ze středověku",
      "Blanický rytíř, který se probudil",
      "Syn Přemysla Oráče",
    ],
    hints: [
      "Krakonoš patří k nejvyššímu pohoří v Čechách.",
      "Ovládá počasí a přírodu v horách.",
    ],
    explanation:
      "Krakonoš je podle pověstí mohutný duch hor, který vládne Krkonoším. Může být laskavý k pocestným a chudým lidem, ale potrestá ty, kteří jsou pyšní nebo ničí přírodu.",
  },
  {
    question: "Kde Krakonoš podle pověstí žije a vládne?",
    correctAnswer: "V Krkonoších",
    options: ["V Krkonoších", "V Šumavě", "V Tatrách", "Na Blaníku"],
    hints: [
      "Název hory je skryt v jeho jménu.",
      "Krkonoše jsou nejvyšší pohoří v Čechách.",
    ],
    explanation:
      "Krakonoš je duch a vládce Krkonoš — nejvyššího pohoří v České republice. Proto se mu také říká Pán hor nebo Duch Krkonoš.",
  },
  {
    question: "Co je kronika?",
    correctAnswer: "Kniha, do které se zapisovaly důležité události v pořadí, jak šly za sebou",
    options: [
      "Kniha, do které se zapisovaly důležité události v pořadí, jak šly za sebou",
      "Sborník pohádek a pověstí",
      "Mapa starého města",
      "Jídelní lístek ze středověku",
    ],
    hints: [
      "Kronika zaznamenávala historii — co se stalo, kdy a kde.",
      "Kroniky psali kronikáři, například ve vesnicích nebo klášterech.",
    ],
    explanation:
      "Kronika je historický záznam, kde kronikář zapisoval události v časovém pořadí — co se kdy stalo v obci, zemi nebo klášteře. Je to cenný historický pramen.",
  },
  {
    question: "Jak se nazývá člověk, který zapisoval historii do kroniky?",
    correctAnswer: "Kronikář",
    options: ["Kronikář", "Archivář", "Muzejník", "Průvodce"],
    hints: [
      "Slovo je odvozeno od slova kronika.",
      "Tento člověk psal a uchovával záznamy o událostech.",
    ],
    explanation:
      "Kronikář byl člověk, jehož úkolem bylo zapisovat důležité události do kroniky. Ve středověku to bývali mniši, později se kronikáři vyskytovali i ve vesnicích a městech.",
  },
  {
    question: "Co je archiv?",
    correctAnswer: "Místo, kde se uchovávají staré dokumenty a listiny",
    options: [
      "Místo, kde se uchovávají staré dokumenty a listiny",
      "Místo, kde se prodávají noviny",
      "Škola pro budoucí kronikáře",
      "Sklad potravin ve středověkém hradu",
    ],
    hints: [
      "Archiv uchovává hlavně papíry — smlouvy, listiny, staré zápisy.",
      "Liší se od muzea tím, že sbírá spíš dokumenty než předměty.",
    ],
    explanation:
      "Archiv je místo, kde se uchovávají staré dokumenty, listiny a písemné záznamy. Badatelé v něm hledají informace o tom, co se v minulosti skutečně stalo.",
  },
  {
    question: "Co je muzeum?",
    correctAnswer: "Místo, kde se uchovávají staré předměty a fotografie",
    options: [
      "Místo, kde se uchovávají staré předměty a fotografie",
      "Místo, kde se píší nové kroniky",
      "Sklad map a plánů měst",
      "Budova, kde bydlí kronikář",
    ],
    hints: [
      "Muzeum sbírá spíš věci — oblečení, nástroje, hračky z minulosti.",
      "Na rozdíl od archivu tam vidíš skutečné předměty, ne jen papíry.",
    ],
    explanation:
      "Muzeum uchovává staré předměty, fotografie a modely, které ukazují, jak místo a lidé vypadali dříve. Je to jeden z klíčových zdrojů poznání místní historie.",
  },
  {
    question: "Kdo je pro nás živým historickým pramenem o místní minulosti?",
    correctAnswer: "Starší lidé, kteří si pamatují, jak to tady bývalo",
    options: [
      "Starší lidé, kteří si pamatují, jak to tady bývalo",
      "Malé děti ve školce",
      "Pracovníci supermarketu",
      "Řidiči autobusů",
    ],
    hints: [
      "Přímý svědek události je nejcennější zdroj — byl u toho.",
      "Kdo z nabízených možností mohl sám zažít věci z dávnější minulosti obce?",
    ],
    explanation:
      "Starší lidé jsou živými historickými prameny — mohou nám přímo vyprávět, jak to v obci nebo městě vypadalo, co se změnilo a jak se žilo dříve. Jejich vzpomínky jsou nenahraditelné.",
  },
  {
    question: "Proč navštěvujeme hrady a zámky?",
    correctAnswer: "Protože jsou to historické stavby, které nám ukazují minulost",
    options: [
      "Protože jsou to historické stavby, které nám ukazují minulost",
      "Protože tam prodávají nejlevnější jídlo",
      "Protože tam trénují hasiči",
      "Protože jsou to nové sportovní haly",
    ],
    hints: [
      "Hrady byly stavěny před stovkami let pro ochranu a bydlení šlechty.",
      "Navštívením hradu se dotkneme skutečné minulosti.",
    ],
    explanation:
      "Hrady a zámky jsou historické stavby ze středověku nebo novověku. Navštěvujeme je, protože nám ukazují, jak žili lidé v minulosti — jak vypadaly jejich domovy, jak se bránili nepřátelům.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Kdy podle pověsti vyjdou Blaničtí rytíři z hory?",
    correctAnswer: "Když bude Česká země v největší nouzi a nebezpečí",
    options: [
      "Když bude Česká země v největší nouzi a nebezpečí",
      "Každý rok na Vánoce",
      "Jakmile se probudí Krakonoš",
      "Na příkaz českého krále",
    ],
    hints: [
      "Rytíři spí a čekají na okamžik, kdy budou opravdu zapotřebí.",
      "Jejich probuzení je spojeno s obranou vlasti.",
    ],
    explanation:
      "Pověst říká, že Blaničtí rytíři čekají hluboko v hoře a probudí se jedině tehdy, když bude Čechám hrozit největší nebezpečí. Přijedou na pomoc a zachrání zemi.",
  },
  {
    question: "Jak se liší pověst od pohádky?",
    correctAnswer: "Pověst je vázána na skutečné místo nebo postavu z historie, pohádka ne",
    options: [
      "Pověst je vázána na skutečné místo nebo postavu z historie, pohádka ne",
      "Pohádka je vždy delší než pověst",
      "Pověst se vždy šťastně končí",
      "Pohádka nemá žádné postavy",
    ],
    hints: [
      "Přemysl Oráč byl skutečný historický rod, pohádkový princ je vymyšlený.",
      "Pověst se váže ke konkrétní hoře, hradu nebo městu.",
    ],
    explanation:
      "Pověst je spojena s konkrétním místem (hora Blaník, Vyšehrad) nebo historickou postavou (Libuše, Přemysl). Pohádka je zcela vymyšlená bez vazby na skutečná místa nebo osoby.",
  },
  {
    question: "Čí dcerou byla podle pověsti kněžna Libuše?",
    correctAnswer: "Knížete Kroka",
    options: ["Knížete Kroka", "Krále Přemysla", "Vévody Krakonoše", "Kronikáře Kosmy"],
    hints: [
      "Její otec byl jedním z prvních vládnoucích knížat.",
      "Libuše byla jeho nejmladší a nejmoudřejší dcera.",
    ],
    explanation:
      "Podle pověsti byla Libuše dcerou knížete Kroka. Po jeho smrti se stala kněžnou a věštkyní, která později prorokovala vznik Prahy.",
  },
  {
    question: "Odkud pocházel Přemysl Oráč, než ho Libušini poslové přivezli na hrad?",
    correctAnswer: "Ze vsi Stadice",
    options: ["Ze vsi Stadice", "Z hory Blaník", "Z Krkonoš", "Z Vyšehradu"],
    hints: [
      "Přemysl oral pole ve vesnici, jejíž jméno se dodnes připomíná.",
      "Poslové ho tam našli s dvěma voly u pluhu.",
    ],
    explanation:
      "Přemysl Oráč pocházel ze vsi Stadice, kde ho Libušini poslové našli orat pole. Odtud ho přivezli na hrad, kde se stal Libušiným mužem.",
  },
  {
    question: "Co Libuše podle pověsti prorokovala, když stála na skále nad Vltavou?",
    correctAnswer: "Vznik slavného města, které bude sahat slávou až ke hvězdám",
    options: [
      "Vznik slavného města, které bude sahat slávou až ke hvězdám",
      "Příchod Blanických rytířů",
      "Konec vlády Přemyslovců",
      "Narození Krakonoše",
    ],
    hints: [
      "Její věštba se týkala místa, kde později vyrostl hrad a hlavní město.",
      "Dodnes tomuto městu vládne z jeho hradu prezident.",
    ],
    explanation:
      "Podle pověsti Libuše z vyšehradské skály nad Vltavou prorokovala vznik slavného města — Prahy —, jehož sláva bude sahat až ke hvězdám.",
  },
  {
    question: "Jak se Krakonoš podle pověstí zachová k pyšnému nebo lakomému člověku?",
    correctAnswer: "Potrestá ho",
    options: ["Potrestá ho", "Obdaruje ho pokladem", "Nevšímá si ho", "Stane se jeho přítelem"],
    hints: [
      "Krakonoš odměňuje dobré vlastnosti a trestá ty špatné.",
      "Pýcha a lakota patří mezi vlastnosti, které Krakonoš netoleruje.",
    ],
    explanation:
      "Krakonoš podle pověstí trestá pyšné a lakomé lidi, zatímco chudým a poctivým pomáhá. Je to duch hor, který dbá na spravedlnost.",
  },
  {
    question: "Jak se Krakonoš podle pověstí zachová k chudému a poctivému poutníkovi?",
    correctAnswer: "Pomůže mu",
    options: ["Pomůže mu", "Potrestá ho", "Zažene ho z hor", "Promění ho v kámen"],
    hints: [
      "Krakonoš je přísný na zlé, ale laskavý na dobré lidi.",
      "Chudoba a poctivost jsou vlastnosti, které si Krakonoš cení.",
    ],
    explanation:
      "Krakonoš podle pověstí pomáhá chudým a poctivým poutníkům, kteří se ocitnou v horách v nouzi. Naopak trestá ty, kdo jsou pyšní nebo ničí přírodu.",
  },
  {
    question:
      "Kde spíš najdeš staré listiny a úřední dokumenty o tvém městě — v muzeu, nebo v archivu?",
    correctAnswer: "V archivu",
    options: ["V archivu", "V muzeu", "V obou stejně", "Ani v jednom"],
    hints: [
      "Archiv se specializuje na papírové záznamy, ne na předměty.",
      "Muzeum spíš vystavuje věci, které si můžeš prohlédnout.",
    ],
    explanation:
      "Staré listiny, úřední dokumenty a smlouvy se uchovávají hlavně v archivu. Muzeum se naopak zaměřuje na fyzické předměty a fotografie.",
  },
  {
    question:
      "Kde spíš najdeš staré předměty a fotografie tvého města — v muzeu, nebo v archivu?",
    correctAnswer: "V muzeu",
    options: ["V muzeu", "V archivu", "V obou stejně", "Ani v jednom"],
    hints: [
      "Muzeum vystavuje věci, které si můžeš prohlédnout — ne jen papíry.",
      "Archiv se specializuje spíš na dokumenty a listiny.",
    ],
    explanation:
      "Staré předměty, oblečení a fotografie se uchovávají hlavně v muzeu. Archiv se naopak zaměřuje na dokumenty a písemné záznamy.",
  },
  {
    question: "Kdo bývali ve středověku nejčastěji kronikáři?",
    correctAnswer: "Mniši v klášterech",
    options: ["Mniši v klášterech", "Vojáci na hradech", "Kupci na tržišti", "Rolníci na poli"],
    hints: [
      "Tito lidé uměli číst a psát, což byla ve středověku vzácná dovednost.",
      "Žili společně v budovách, kde měli knihy a klid i čas na psaní.",
    ],
    explanation:
      "Ve středověku bývali kronikáři nejčastěji mniši, protože v klášterech se uchovávaly knihy a mniši uměli číst a psát — což tehdy nebylo samozřejmostí.",
  },
  {
    question: "Jak se pověsti šířily dřív, než se začaly zapisovat do knih?",
    correctAnswer: "Vyprávěly se ústně z generace na generaci",
    options: [
      "Vyprávěly se ústně z generace na generaci",
      "Posílaly se poštou mezi vesnicemi",
      "Vysílaly se v rozhlase",
      "Tiskly se v novinách",
    ],
    hints: [
      "Než existoval tisk, informace se předávaly hlavně mluveným slovem.",
      "Babičky a dědečkové vyprávěli pověsti dětem, ty je pak vyprávěly dál.",
    ],
    explanation:
      "Pověsti se dlouho šířily jen ústně — vyprávěly se z generace na generaci, než je někdo poprvé zapsal. Proto se v různých krajích liší detaily téže pověsti.",
  },
  {
    question: "Jaký druh pramene je stará fotografie nebo starý předmět z muzea?",
    correctAnswer: "Hmotný pramen",
    options: ["Hmotný pramen", "Písemný pramen", "Ústní pramen", "Není to historický pramen"],
    hints: [
      "Předmět a fotografii si můžeš vzít do ruky nebo si je prohlédnout.",
      "Na rozdíl od kroniky to není text, na rozdíl od vyprávění to není mluvené slovo.",
    ],
    explanation:
      "Stará fotografie nebo předmět je hmotný pramen — hmatatelná věc z minulosti. Kronika je pramen písemný, vyprávění pamětníka je pramen ústní.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question:
      "Kroniku, vyprávění praprababičky a starý hrnec z vykopávek máme roztřídit podle typu pramene. Kam patří kronika?",
    correctAnswer: "Písemný pramen",
    options: ["Písemný pramen", "Hmotný pramen", "Ústní pramen", "Žádný z pramenů"],
    hints: [
      "Kronika je text zapsaný na papíře.",
      "Rozliš: text = písemný, předmět = hmotný, vyprávění = ústní.",
    ],
    explanation:
      "Kronika je psaný text, takže patří mezi písemné prameny. Starý hrnec je hmotný pramen, vyprávění praprababičky je pramen ústní.",
  },
  {
    question:
      "Kroniku, vyprávění praprababičky a starý hrnec z vykopávek máme roztřídit podle typu pramene. Kam patří starý hrnec?",
    correctAnswer: "Hmotný pramen",
    options: ["Hmotný pramen", "Písemný pramen", "Ústní pramen", "Žádný z pramenů"],
    hints: [
      "Hrnec je skutečný předmět, který si můžeš vzít do ruky.",
      "Rozliš: text = písemný, předmět = hmotný, vyprávění = ústní.",
    ],
    explanation:
      "Starý hrnec je hmatatelný předmět z minulosti, takže patří mezi hmotné prameny. Kronika je pramen písemný, vyprávění je pramen ústní.",
  },
  {
    question:
      "Kroniku, vyprávění praprababičky a starý hrnec z vykopávek máme roztřídit podle typu pramene. Kam patří vyprávění praprababičky?",
    correctAnswer: "Ústní pramen",
    options: ["Ústní pramen", "Písemný pramen", "Hmotný pramen", "Žádný z pramenů"],
    hints: [
      "Vyprávění je mluvené slovo, ne text ani předmět.",
      "Rozliš: text = písemný, předmět = hmotný, vyprávění = ústní.",
    ],
    explanation:
      "Vyprávění praprababičky je mluvené svědectví, takže patří mezi ústní prameny. Kronika je pramen písemný, hrnec je pramen hmotný.",
  },
  {
    question: "Co mají podle pověsti společného Libuše a Přemysl Oráč?",
    correctAnswer: "Jsou považováni za zakladatele rodu Přemyslovců",
    options: [
      "Jsou považováni za zakladatele rodu Přemyslovců",
      "Oba pocházeli ze vsi Stadice",
      "Oba spali v hoře Blaník",
      "Oba vládli Krkonoším",
    ],
    hints: [
      "Přemysl přišel z pole do Libušina hradu a vzali se.",
      "Jejich potomci se jmenují po Přemyslovi.",
    ],
    explanation:
      "Libuše a Přemysl Oráč jsou podle pověsti manželé, kteří se stali zakladateli rodu Přemyslovců — vládnoucího rodu, jenž po nich nese jméno.",
  },
  {
    question:
      "V čem je hlavní rozdíl mezi Krakonošem a Blanickými rytíři, i když oba žijí v horách?",
    correctAnswer:
      "Krakonoš stále vládne horám a jedná s lidmi, rytíři jen spí a čekají na chvíli velké nouze",
    options: [
      "Krakonoš stále vládne horám a jedná s lidmi, rytíři jen spí a čekají na chvíli velké nouze",
      "Krakonoš spí v hoře, rytíři aktivně vládnou Krkonoším",
      "Oba dělají úplně totéž, jen v jiném pohoří",
      "Krakonoš je člověk, rytíři jsou duchové hor",
    ],
    hints: [
      "Jeden z nich je stále aktivní duch hor, druzí čekají skrytě na budoucí okamžik.",
      "Rytíři se probudí jen v největší nouzi, Krakonoš jedná s lidmi průběžně.",
    ],
    explanation:
      "Krakonoš je podle pověstí stále aktivní duch hor, který průběžně jedná s lidmi — pomáhá poctivým, trestá pyšné. Blaničtí rytíři naopak celou dobu spí a probudí se jen tehdy, až bude zemi nejhůř.",
  },
  {
    question:
      "Chceš zjistit, jak vypadala tvá ulice před padesáti lety, ale nemáš žádné staré fotografie ani dokumenty. Koho se nejspíš zeptáš?",
    correctAnswer: "Nejstaršího souseda, který si to pamatuje",
    options: [
      "Nejstaršího souseda, který si to pamatuje",
      "Kronikáře ze středověku",
      "Krakonoše",
      "Nikoho — bez fotografie se to zjistit nedá",
    ],
    hints: [
      "Když chybí písemný i hmotný pramen, zůstává ještě jeden typ pramene.",
      "Živým historickým pramenem jsou lidé, kteří danou dobu sami zažili.",
    ],
    explanation:
      "Když chybí fotografie i dokumenty, zůstává ústní pramen — vzpomínky pamětníků. Nejstarší sousedé si mohou pamatovat, jak ulice vypadala dříve, a mohou o tom vyprávět.",
  },
  {
    question:
      "Píšeš do školního sešitu, co se dnes stalo ve třídě, aby si to za sto let mohli přečíst budoucí žáci. Jaký typ pramene tím vytváříš?",
    correctAnswer: "Písemný pramen",
    options: ["Písemný pramen", "Hmotný pramen", "Ústní pramen", "Žádný, sešit není pramen"],
    hints: [
      "Přemýšlej, čím se tvůj zápis nejvíc podobá — vyprávění, předmětu, nebo textu?",
      "Děláš vlastně to samé, co dřív dělal kronikář.",
    ],
    explanation:
      "Psaný zápis o dnešní události je písemný pramen — funguje stejně jako kronika, jen ho píšeš ty místo dávného kronikáře.",
  },
  {
    question:
      "Která dvojice postav z pověstí je spojená motivem založení vládnoucího rodu, který pak vládl Čechám po staletí?",
    correctAnswer: "Libuše a Přemysl Oráč",
    options: [
      "Libuše a Přemysl Oráč",
      "Krakonoš a Blaničtí rytíři",
      "Libuše a Krakonoš",
      "Přemysl Oráč a Blaničtí rytíři",
    ],
    hints: [
      "Hledej dvojici, ze které podle pověsti vzešel celý rod.",
      "Jeden z nich byl kněžna, druhý prostý oráč — vzali se a založili rod.",
    ],
    explanation:
      "Libuše a Přemysl Oráč jsou podle pověsti manželský pár, který založil rod Přemyslovců. Krakonoš i Blaničtí rytíři jsou samostatné postavy bez podobného motivu založení rodu.",
  },
  {
    question:
      "Muzeum vystavuje starý kočár, archiv má listinu o jeho majiteli a praprababička si pamatuje, jak se v něm jezdilo na trh. Kolik různých typů historických pramenů tu je popsáno?",
    correctAnswer: "Tři — hmotný, písemný i ústní",
    options: [
      "Tři — hmotný, písemný i ústní",
      "Dva — jen hmotný a písemný",
      "Jeden — všechno je to jen vyprávění",
      "Žádný — kočár není historický pramen",
    ],
    hints: [
      "Spočítej: předmět v muzeu, dokument v archivu, vyprávění pamětníka.",
      "Každý z popsaných zdrojů patří do jiné kategorie pramene.",
    ],
    explanation:
      "Kočár v muzeu je hmotný pramen, listina v archivu je písemný pramen a vyprávění praprababičky je ústní pramen. Dohromady jsou popsány všechny tři typy pramenů.",
  },
  {
    question:
      "Proč se příběh o Libušině věštbě řadí mezi pověsti, a ne mezi doložené historické zprávy?",
    correctAnswer:
      "Protože obsahuje nadpřirozený prvek (věštění budoucnosti), který nelze historicky doložit",
    options: [
      "Protože obsahuje nadpřirozený prvek (věštění budoucnosti), který nelze historicky doložit",
      "Protože se odehrává v horách",
      "Protože v něm nevystupuje žádná skutečná postava",
      "Protože je moc krátký na to, aby byl historickou zprávou",
    ],
    hints: [
      "Pověst se od historické zprávy liší tím, že obsahuje něco, co se nedá doložit fakty.",
      "Libušina schopnost věštit budoucnost je něco, co se v realitě prostě nestává.",
    ],
    explanation:
      "Příběh o Libuši je pověst, protože kromě historického jádra (existence knížecího rodu) obsahuje i nadpřirozený prvek — schopnost věštit budoucnost —, který nelze doložit jako fakt.",
  },
  {
    question:
      "Kterou informaci bys hledal v archivu, kdybys chtěl zjistit přesné jméno majitele domu z roku, kdy ho postavili?",
    correctAnswer: "Starou stavební listinu nebo smlouvu",
    options: [
      "Starou stavební listinu nebo smlouvu",
      "Vyprávění souseda, který dům nikdy neviděl",
      "Fotografii jiného domu z muzea",
      "Pověst o založení domu",
    ],
    hints: [
      "Přesné jméno a datum najdeš spíš v úředním dokumentu než ve vyprávění.",
      "Archiv uchovává právě takové listiny a smlouvy.",
    ],
    explanation:
      "Přesné jméno majitele a datum stavby by bylo zapsáno v úřední listině nebo smlouvě, kterou najdeme v archivu — je to písemný pramen s přesnými údaji, na rozdíl od vyprávění nebo pověsti.",
  },
  {
    question:
      "Co je společné pro muzeum, archiv i vyprávění pamětníků, i když se od sebe navzájem liší?",
    correctAnswer: "Všechny nám pomáhají poznat, jak lidé žili v minulosti",
    options: [
      "Všechny nám pomáhají poznat, jak lidé žili v minulosti",
      "Všechny obsahují jen pověsti a pohádky",
      "Všechny vznikly teprve v posledních letech",
      "Všechny se nacházejí jen v Praze",
    ],
    hints: [
      "I když jde o různé typy pramenů (hmotný, písemný, ústní), sledují stejný cíl.",
      "Každý z nich nám jinou cestou ukazuje kus minulosti.",
    ],
    explanation:
      "Muzeum, archiv i vyprávění pamětníků jsou různé typy historických pramenů, ale všechny slouží stejnému účelu — pomáhají nám poznat, jak lidé v minulosti žili a jak se jejich okolí měnilo.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const MINULOSTREGIONUPOVESTI: TopicMetadata[] = [
  {
    id: "g3-prvouka-lide-a-cas-minulost-a-soucasnost-minulost-naseho-regionu-povesti",
    title: "Minulost našeho regionu, pověsti",
    studentTitle: "Historie a pověsti",
    subject: "prvouka",
    category: "Lidé a čas",
    topic: "Minulost a současnost",
    briefDescription: "Poznáš historii svého regionu a nejznámější české pověsti.",
    keywords: ["pověsti", "region", "minulost", "Libuše", "Přemysl", "Krakonoš", "Blaník"],
    goals: [
      "Porozumět pojmu pověst a odlišit ho od pohádky a historického faktu.",
      "Vědět, kde a jak se dozvídáme o minulosti svého regionu (muzeum, archiv, kronika, starší lidé).",
      "Znát nejznámější české pověsti — o Libuši a Přemyslu Oráči, Blanických rytířích a Krakonošovi.",
      "Rozlišit hmotný, písemný a ústní historický pramen a přiřadit k nim konkrétní příklady.",
    ],
    boundaries: [
      "Detailní historické datování a letopočty nejsou součástí obsahu pro 3. ročník.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Pověst = příběh z minulosti smíchaný s historií a fantazií. Libuše = kněžna, Přemysl = oráč. Blaničtí rytíři spí v hoře. Krakonoš vládne Krkonoším. Prameny: hmotný (předmět), písemný (text), ústní (vyprávění).",
      steps: [
        "Vzpomeň si, co víš o dané pověsti nebo historickém prameni.",
        "Pověst má vždy základ v historii, ale je doplněna fantazií.",
        "Historické prameny: muzeum a předměty (hmotný), archiv a kronika (písemný), starší lidé (ústní).",
        "Libuše a Přemysl = zakladatelé Přemyslovců. Blaničtí rytíři = spí v Blaníku. Krakonoš = vládce Krkonoš.",
      ],
      commonMistake:
        "Pověst není pohádka — pohádka je zcela vymyšlená, pověst se váže ke skutečnému místu nebo postavě.",
      example:
        "Pověst o Blanických rytířích: rytíři spí v hoře Blaník a probudí se, až bude Čechám nejhůře.",
    },
  },
];
