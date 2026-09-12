import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pluralWithNumber } from "@/lib/czechGrammar";
import { shuffle } from "../_shared";

// Přepsáno 2026-09-12 (inventura obsahu). Původní generátor měl 8/8/10
// unikátních úloh, jednu sdílenou dvojici nápověd na celou úroveň a u chybných
// možností žádnou zpětnou vazbu. Teď jsou tři disjunktní banky:
// L1 pojmy (verš, strofa, odstavec, rým, próza) · L2 zařazení konkrétní ukázky
// · L3 počítání veršů a strof, krátké řádky bez rýmu, přepis mezi formami.

const versu = (n: number) => pluralWithNumber(n, "verš", "verše", "veršů");
const strof = (n: number) => pluralWithNumber(n, "strofa", "strofy", "strof");
const odstavcu = (n: number) => pluralWithNumber(n, "odstavec", "odstavce", "odstavců");

interface Uloha {
  q: string;
  a: string;
  /** [chybná možnost, proč je špatně právě tahle možnost u téhle úlohy] */
  w: [[string, string], [string, string], [string, string]];
  /** [malá nápověda, velká nápověda] — obě unikátní pro tuhle úlohu */
  h: [string, string];
  e: string;
}

function task({ q, a, w, h, e }: Uloha): PracticeTask {
  const optionFeedback: Record<string, string> = {};
  for (const [value, why] of w) optionFeedback[value] = why;
  return {
    question: q,
    correctAnswer: a,
    options: shuffle([a, ...w.map(([value]) => value)]),
    optionFeedback,
    hints: [h[0], h[1]],
    explanation: e,
  };
}

// ── L1 — pojmy a jejich rozlišení ───────────────────────────────────────────
const POOL_L1: Uloha[] = [
  {
    q: "Jak se jmenuje jeden jediný řádek básně?",
    a: "Verš",
    w: [
      ["Strofa", "Strofa je celá skupina řádků oddělená mezerou, ne jeden řádek."],
      ["Odstavec", "Odstavec je skupina vět v textu psaném prózou, v básni ho nenajdeš."],
      ["Rým", "Rým je souznění konců slov, žádnou část zápisu neoznačuje."],
    ],
    h: [
      "Rozliš tři různé věci: jeden řádek, skupinu řádků a souznění konců slov. Ptáme se na tu první z nich.",
      "Strofa je skupina řádků oddělená prázdným řádkem, odstavec je skupina vět v textu psaném prózou a rým je souznění konců slov. Zbývá pojem pro jediný samostatný řádek, tedy pro nejmenší dílek, ze kterého se báseň skládá.",
    ],
    e: "Nejmenší dílek básně je jeden řádek a říká se mu verš. Několik veršů dohromady teprve tvoří strofu.",
  },
  {
    q: "Jak se jmenuje skupina řádků, kterou v básni oddělí prázdný řádek?",
    a: "Strofa",
    w: [
      ["Verš", "Verš je jediný řádek básně, ne celá skupina řádků."],
      ["Odstavec", "Odstavec odděluje skupiny vět v textu psaném prózou, ne skupiny řádků v básni."],
      ["Rým", "Rým je souznění konců slov, o rozdělení básně na části neříká nic."],
    ],
    h: [
      "Hledáš celek složený z několika řádků — ne jeden řádek a ne souznění konců slov.",
      "Verš je jediný řádek básně, odstavec patří do textu psaného větami a rým je souznění konců slov. Zbývá pojem pro skupinu řádků, kterou od další skupiny odděluje prázdný řádek a kterou v básni poznáš na první pohled.",
    ],
    e: "Skupina řádků oddělená prázdným řádkem se v básni jmenuje strofa. Je to obdoba odstavce, jen pro text psaný ve verších.",
  },
  {
    q: "Jak se jmenuje skupina vět, kterou v pohádce poznáš podle odsazeného prvního řádku?",
    a: "Odstavec",
    w: [
      ["Strofa", "Strofa odděluje skupiny řádků v básni, v textu psaném větami nevzniká."],
      ["Verš", "Verš je jeden řádek básně, skupinu vět tak nikdo nenazve."],
      ["Rým", "Rým je souznění konců slov, s členěním vyprávění nemá nic společného."],
    ],
    h: [
      "Odsazený první řádek je značka, která v pohádce odděluje jednu část vyprávění od další.",
      "Strofa i verš patří k textu psanému v krátkých řádcích, takže do pohádky se nehodí ani jeden z nich, a rým je jen zvuková ozdoba. Hledej název pro skupinu vět, která patří k sobě a začíná odsazeným prvním řádkem.",
    ],
    e: "Skupina vět, která patří k sobě a začíná odsazeným řádkem, se jmenuje odstavec. Vyprávění se díky odstavcům lépe čte.",
  },
  {
    q: "Jak se jmenuje shoda hlásek na konci dvou slov, například u dvojice „kos – nos“?",
    a: "Rým",
    w: [
      ["Verš", "Verš je jeden řádek básně, dvojici slov takhle nepojmenujeme."],
      ["Strofa", "Strofa je skupina řádků v básni, ne shoda konců dvou slov."],
      ["Odstavec", "Odstavec je skupina vět v próze, se zvukem slov nesouvisí."],
    ],
    h: [
      "Slova „kos“ a „nos“ se liší jen první hláskou a jejich konce znějí stejně. Jak se takové shodě říká?",
      "Verš, strofa i odstavec jsou názvy pro části zápisu, tedy pro to, jak je text rozdělený na stránce. Tady ale hledáš název pro zvuk: pro to, že dvě slova znějí na konci stejně a při čtení nahlas si odpovídají.",
    ],
    e: "Shoda hlásek na konci slov se jmenuje rým. Právě podle rýmu poznáš dvojice jako „kos – nos“ nebo „pes – les“.",
  },
  {
    q: "Jak se jmenuje text zapsaný v obyčejných větách a odstavcích?",
    a: "Próza",
    w: [
      ["Báseň", "Báseň se zapisuje do krátkých řádků, ne do vět a odstavců."],
      ["Strofa", "Strofa je jen část básně, celý způsob zápisu takhle nepojmenujeme."],
      ["Verš", "Verš je jediný řádek básně, ne název pro text psaný větami."],
    ],
    h: [
      "Věty a odstavce jsou znaky zápisu, který znáš z pohádkových knížek i z čítanky.",
      "Báseň, strofa i verš patří k textu rozdělenému do krátkých řádků. Hledáš ale opačný způsob zápisu: ten, ve kterém věty plynou za sebou až k pravému okraji stránky a shlukují se do odstavců.",
    ],
    e: "Text psaný v obyčejných větách a odstavcích se jmenuje próza. Takhle jsou zapsané pohádky, povídky i romány.",
  },
  {
    q: "Pohádka o Popelce se vypráví v souvislých větách a odstavcích. Jak je tedy zapsaná?",
    a: "V próze",
    w: [
      ["Ve verších", "Ve verších jsou krátké řádky pod sebou, tady ale text tvoří souvislé věty."],
      ["Ve strofách", "Strofy vznikají jen tam, kde se text dělí na krátké řádky."],
      ["V replikách postav", "Repliky s uvedeným jménem postavy má divadelní hra, ne vyprávěná pohádka."],
    ],
    h: [
      "Souvislé věty a odstavce ukazují na jeden ze dvou základních způsobů zápisu. Který to je?",
      "Kdyby byla Popelka zapsaná v krátkých řádcích pod sebou, mluvili bychom o verších a skupinám řádků bychom říkali strofy. Kdyby před každou promluvou stálo jméno postavy, šlo by o divadelní hru. Nic z toho ale zadání neříká.",
    ],
    e: "Souvislé věty seskupené do odstavců jsou znakem prózy. Pohádka o Popelce je proto zapsaná v próze, i když je plná kouzel.",
  },
  {
    q: "Říkanka „Skákal pes přes oves“ je rozdělená do krátkých řádků pod sebou. Jak je zapsaná?",
    a: "Ve verších",
    w: [
      ["V próze", "V próze plynou věty za sebou až k okraji stránky, ne do krátkých řádků."],
      ["V odstavcích", "Odstavce vznikají tam, kde se text skládá z vět, ne z krátkých řádků."],
      ["V replikách postav", "Repliky s uvedeným jménem postavy patří do divadelní hry, říkanka žádné nemá."],
    ],
    h: [
      "Rozhoduje zápis: text nepokračuje k pravému okraji stránky, ale láme se do krátkých řádků pod sebou.",
      "Kdyby šlo o prózu, věty by plynuly za sebou a shlukovaly by se do odstavců. Kdyby šlo o divadelní hru, stálo by před každou promluvou jméno postavy. Zbývá způsob zápisu, ve kterém je každý krátký řádek samostatnou částí textu.",
    ],
    e: "Krátké řádky pod sebou jsou verše, a text takhle zapsaný čteme ve verších. Říkanka je proto zapsaná stejně jako báseň.",
  },
  {
    q: "Co v próze zastává stejnou úlohu, jakou má v básni strofa?",
    a: "Odstavec",
    w: [
      ["Verš", "Verš je jeden řádek básně, v próze žádnou úlohu nemá."],
      ["Rým", "Rým je zvuková ozdoba konců slov, text na části nedělí."],
      ["Nadpis", "Nadpis stojí nad celým textem, uvnitř ho na části nerozděluje."],
    ],
    h: [
      "Strofa dělí báseň na části, které patří k sobě. Co dělí stejným způsobem vyprávění?",
      "Verš je nejmenší dílek básně, ne způsob dělení prózy. Rým je jen zvuk a nadpis stojí nad textem. Hledáš část, která v próze plní stejnou úlohu jako strofa v básni: shrne dohromady to, co k sobě patří, a odliší to od dalšího celku.",
    ],
    e: "Strofa dělí báseň a odstavec dělí prózu — obojí sdružuje to, co k sobě patří. Proto odstavci v próze odpovídá v básni strofa.",
  },
  {
    q: "Co musí platit, aby dvě slova tvořila rým?",
    a: "Musí stejně znít na konci",
    w: [
      ["Musí mít stejný počet písmen", "Stejně dlouhá slova ještě rým netvoří — „pes“ a „dům“ mají tři písmena, a přesto se nerýmují."],
      ["Musí začínat stejným písmenem", "Shoda na začátku rým není: „pes“ a „pole“ začínají stejně, přesto si konce neodpovídají."],
      ["Musí znamenat totéž", "Slova stejného významu se rýmovat nemusí — „auto“ a „vůz“ znamenají totéž a nerýmují se."],
    ],
    h: [
      "Přečti si dvojici slov nahlas a poslouchej, jestli si odpovídá jejich začátek, konec, nebo význam.",
      "Zkoušej si to na příkladech: „pes“ a „dům“ jsou stejně dlouhá, „pes“ a „pole“ začínají stejně, „auto“ a „vůz“ znamenají totéž — a přesto ani jedna z těch dvojic nerýmuje. Podmínka bude tedy někde jinde než v délce, začátku nebo významu.",
    ],
    e: "Rým vzniká shodou zvuku na konci slov. Ani stejná délka, ani stejné první písmeno, ani stejný význam rým neudělají.",
  },
  {
    q: "Který z těchto útvarů se zapisuje do krátkých řádků pod sebou?",
    a: "Říkanka",
    w: [
      ["Povídka", "Povídka se zapisuje v souvislých větách a odstavcích."],
      ["Dopis", "Dopis se píše ve větách, i když má oslovení a podpis na zvláštním řádku."],
      ["Pohádka", "Pohádka se vypráví v souvislých větách, i když má kouzelný obsah."],
    ],
    h: [
      "Vyber ten útvar, který se dětem nejsnáz pamatuje nazpaměť, protože má krátké řádky a rým.",
      "Povídku, dopis i pohádku píšeme ve větách, které plynou až k pravému okraji stránky. Jeden z útvarů se ale zapisuje jinak: v krátkých řádcích pod sebou, jejichž konce si zvukově odpovídají — proto se dá tak snadno odříkat zpaměti.",
    ],
    e: "Říkanka se zapisuje do krátkých rýmovaných řádků, tedy do veršů. Povídka, dopis i pohádka se píšou v próze.",
  },
  {
    q: "Který z těchto útvarů se zapisuje v souvislých větách a odstavcích?",
    a: "Povídka",
    w: [
      ["Říkanka", "Říkanka má krátké rýmované řádky, ne souvislé věty."],
      ["Básnička", "Básnička se zapisuje do veršů, proto souvislé odstavce nemá."],
      ["Písnička", "Text písničky se zapisuje po verších a slokách, ne do odstavců."],
    ],
    h: [
      "Tři z možností se dají zpívat nebo odříkat v rytmu. Ta čtvrtá se jenom čte jako vyprávění.",
      "Říkanka, básnička i text písničky se lámou do krátkých řádků, které se rýmují a mají rytmus. Hledej útvar, u kterého nic takového nečekáš: vypráví příběh větu po větě a jeho řádky dojdou až k pravému okraji stránky.",
    ],
    e: "Povídka je vyprávění zapsané v souvislých větách a odstavcích, tedy v próze. Říkanka, básnička i písnička se zapisují ve verších.",
  },
  {
    q: "Čím se zápis básně liší od zápisu vyprávění, ještě než začneš číst?",
    a: "Řádky jsou krátké a nedosahují k pravému okraji",
    w: [
      ["Báseň se píše úplně bez teček", "Tečky v básni být mohou i nemusí, poznávacím znakem nejsou."],
      ["Báseň nemá nikdy nadpis", "Nadpis má většina básní stejně jako většina vyprávění."],
      ["Báseň se píše jen velkými písmeny", "Velikost písmen je věcí pravopisu, se zápisem básně nesouvisí."],
    ],
    h: [
      "Představ si obě stránky vedle sebe a dívej se jen na tvar textu, ne na jednotlivá slova.",
      "Zkus si to jako pohled z dálky: u vyprávění vidíš plnou plochu textu, protože řádky pokračují až na konec stránky. U básně vidíš na pravé straně hodně bílého místa, protože každý řádek končí tam, kde skončí verš.",
    ],
    e: "Báseň se pozná už podle tvaru na stránce: krátké řádky končí dřív než u okraje, takže napravo zůstává bílé místo. Vyprávění vyplní řádek celý.",
  },
  {
    q: "Divadelní hra se skládá hlavně z replik postav. Z čeho se skládá báseň?",
    a: "Z veršů a strof",
    w: [
      ["Z vět a odstavců", "Věty a odstavce tvoří prózu, tedy vyprávění, ne báseň."],
      ["Z kapitol a dílů", "Na kapitoly a díly se dělí dlouhé knihy, ne jednotlivá báseň."],
      ["Z replik a jednání", "Repliky a jednání patří divadelní hře, kterou zadání uvádí jako protiklad."],
    ],
    h: [
      "Každý útvar má své vlastní stavební dílky. U divadelní hry jsou to repliky — a co u básně?",
      "Věty a odstavce jsou stavebními dílky vyprávění, kapitoly a díly patří dlouhým knihám a repliky s jednáními divadelní hře. Hledáš dvojici názvů, která popisuje nejmenší řádek textu a skupinu takových řádků oddělenou mezerou.",
    ],
    e: "Báseň staví z veršů, tedy jednotlivých řádků, a z jejich skupin, kterým říkáme strofy. Věty a odstavce patří próze, repliky divadelní hře.",
  },
];

// ── L2 — zařaď konkrétní ukázku podle zápisu ────────────────────────────────
const P = "Próza";
const V = "Verše";
const D = "Divadelní hra";
const S = "Seznam pod sebou";

const POOL_L2: Uloha[] = [
  {
    q: "Jak je zapsaná ukázka? „Bylo jednou jedno kotě. Bydlelo v chaloupce na kraji lesa a nejradši spalo u kamen.“",
    a: P,
    w: [
      [V, "Verše by byly rozdělené do krátkých řádků pod sebou, tady plynou dvě věty za sebou."],
      [D, "Divadelní hra by před promluvou uvedla jméno postavy, v ukázce nikdo nemluví."],
      [S, "Seznam by měl krátké položky pod sebou, tahle ukázka ale vypráví příběh ve větách."],
    ],
    h: [
      "Ukázku tvoří dvě věty, které na sebe navazují a končí tečkou. Co to o zápisu prozradí?",
      "Podívej se, kde text končí řádek. Kdyby to byly verše, lámal by se po pár slovech a konce řádků by si zvukově odpovídaly. Tady místo toho čteš celé věty, které se řadí za sebou a tvoří souvislé vyprávění o kotěti.",
    ],
    e: "Dvě souvislé věty, které na sebe navazují a tvoří odstavec, jsou znakem prózy. Text o kotěti je tedy zapsaný jako běžné vyprávění.",
  },
  {
    q: "Jak je zapsaná ukázka? „Padá listí ze stromů, / zima buší do domů.“",
    a: V,
    w: [
      [P, "Próza by měla věty plynoucí za sebou až k okraji stránky, tady jsou dva krátké řádky."],
      [D, "Divadelní hra by u promluvy uvedla jméno postavy, v ukázce se nemluví."],
      [S, "Seznam nevypráví ani nerýmuje, jen řadí položky — tady si ale konce řádků odpovídají."],
    ],
    h: [
      "Ukázka je rozdělená lomítkem na dva krátké úseky a jejich konce „stromů“ a „domů“ znějí skoro stejně.",
      "Lomítko v zápisu ukazuje, kde končí jeden řádek a začíná další. Přečti si oba úseky nahlas a poslouchej jejich konce: když si odpovídají, nejde o náhodu, ale o ozdobu, kterou najdeš jen u jednoho způsobu zápisu.",
    ],
    e: "Dva krátké řádky se souznějícími konci jsou verše. Rým „stromů – domů“ je přesně ta ozdoba, kterou próza nemá.",
  },
  {
    q: "Jak je zapsaná ukázka? „Šel jsem lesem a potkal lišku. Utekla dřív, než jsem stačil sáhnout po fotoaparátu.“",
    a: P,
    w: [
      [V, "Verše by se lámaly do krátkých řádků a jejich konce by se rýmovaly, tady nic takového není."],
      [D, "Divadelní hra by měla promluvy s uvedeným jménem postavy, tady vypráví jeden člověk souvisle."],
      [S, "Seznam řadí krátké položky pod sebou, tahle ukázka je vyprávění ve dvou větách."],
    ],
    h: [
      "Vypravěč tu popisuje setkání s liškou ve dvou větách, které jdou plynule za sebou.",
      "Zkus si ukázku rozdělit na řádky po pár slovech — text se tím rozpadne a nic se nezačne rýmovat, protože k tomu nebyl napsaný. To je nejlepší důkaz, že jde o zápis, ve kterém věty prostě plynou za sebou.",
    ],
    e: "Souvislé věty bez rýmu a bez lámání na krátké řádky jsou znakem prózy. Vyprávění o lišce je proto próza.",
  },
  {
    q: "Jak je zapsaná ukázka? „Slunce svítí, ptáci pějí, / celý den se na nás smějí.“",
    a: V,
    w: [
      [P, "Próza by nechala věty plynout za sebou, tady je text rozdělený na dva krátké řádky."],
      [D, "Divadelní hra by uvedla, která postava mluví, v ukázce nikdo nepromlouvá."],
      [S, "Seznam by neměl rým ani plynulý smysl, tady se ale konce řádků rýmují."],
    ],
    h: [
      "Za lomítkem začíná nový řádek. Přečti nahlas konce obou řádků, „pějí“ a „smějí“, a poslouchej.",
      "Nejdřív si všimni délky: oba úseky jsou krátké a podobně dlouhé, takže při čtení vzniká pravidelný rytmus. Pak poslouchej jejich konce — když si odpovídají, je to ozdoba typická pro jediný způsob zápisu.",
    ],
    e: "Krátké řádky se stejným rytmem a se souznějícími konci jsou verše. Dvojice „pějí – smějí“ je rým.",
  },
  {
    q: "Jak je zapsaná ukázka? „Dědeček zapálil v kamnech. Za chvíli bylo v celé chalupě teplo a venku zatím padal sníh.“",
    a: P,
    w: [
      [V, "Verše by byly krátké řádky pod sebou se souznějícími konci, tady nic takového nenajdeš."],
      [D, "Divadelní hra by uvedla u promluvy jméno postavy, tady dědeček nic neříká."],
      [S, "Seznam řadí krátké položky, tahle ukázka je souvislé vyprávění ve dvou větách."],
    ],
    h: [
      "Ukázka popisuje, co se stalo v chalupě a co zatím venku, a to všechno ve dvou navazujících větách.",
      "Zaměř se na konce řádků. Kdyby šlo o zápis ve verších, musela by se slova na koncích rýmovat a řádky by byly krátké a pravidelné. Tady ale čteš dvě věty, které plynou za sebou a rozdělí se podle šířky stránky, ne podle rytmu.",
    ],
    e: "Dvě navazující věty tvořící odstavec jsou znakem prózy. Text o dědečkovi a kamnech je tedy próza.",
  },
  {
    q: "Jak je zapsaná ukázka? „V lese bydlí kmotra liška, / vedle v noře malá myška.“",
    a: V,
    w: [
      [P, "Próza by měla souvislé věty bez rýmu, tady si konce obou řádků odpovídají."],
      [D, "Divadelní hra by uvedla jméno mluvící postavy, liška ani myška tu nemluví."],
      [S, "Seznam by neměl rytmus ani rým, tahle ukázka má obojí."],
    ],
    h: [
      "Ukázka má dva krátké úseky oddělené lomítkem a jejich konce „liška“ a „myška“ znějí skoro stejně.",
      "Obě zvířata tu vystupují, ale o způsobu zápisu nerozhodují. Rozhoduje tvar textu: dva krátké řádky stejné délky, které se dají odříkat v rytmu, a slova na jejich koncích, která si zvukově odpovídají.",
    ],
    e: "Krátké řádky s rýmem „liška – myška“ jsou verše. O zařazení rozhoduje zápis, ne to, že v textu vystupují zvířata.",
  },
  {
    q: "Jak je zapsaná ukázka? „Ráno jsme vyrazili na chatu. Cesta trvala dvě hodiny, protože jsme cestou nabírali babičku.“",
    a: P,
    w: [
      [V, "Verše by tvořily krátké řádky pod sebou se souznějícími konci, tady jsou dlouhé souvislé věty."],
      [D, "Divadelní hra by měla u promluv jména postav, tady jen vypravěč popisuje cestu."],
      [S, "Seznam by řadil krátké položky pod sebou, tahle ukázka vypráví ve větách."],
    ],
    h: [
      "Druhá věta vysvětluje, proč cesta trvala tak dlouho. Takové vysvětlení se do krátkého rytmického řádku nevejde.",
      "Všimni si délky vět: druhá věta má vedlejší část uvozenou spojkou „protože“ a táhne se přes celý řádek. Zápis v krátkých řádcích by takovou větu musel roztrhnout na kusy, a proto se do něj vyprávění tohohle typu nedává.",
    ],
    e: "Dlouhé věty plynoucí za sebou a shlukující se do odstavce jsou znakem prózy. Vyprávění o cestě na chatu je próza.",
  },
  {
    q: "Jak je zapsaná ukázka? „Na komíně sedí vrána, / je jí zima už od rána.“",
    a: V,
    w: [
      [P, "Próza by nechala věty plynout za sebou, tady je text zlomený do dvou krátkých řádků."],
      [D, "Divadelní hra by uvedla jméno postavy před promluvou, vrána tu nic neříká."],
      [S, "Seznam nemá rytmus ani rým, tahle ukázka má obojí."],
    ],
    h: [
      "Konce obou úseků, „vrána“ a „rána“, se liší jen o jednu hlásku na začátku a znějí skoro stejně.",
      "Zkus si ukázku přepsat do jedné souvislé věty. Zjistíš, že se tím ztratí rytmus i souznění konců, které jsi předtím slyšel. Právě proto se takové texty zapisují do krátkých řádků a ne jako vyprávění.",
    ],
    e: "Dva krátké řádky s rýmem „vrána – rána“ jsou verše. Rým a rytmus vznikají jen díky tomu, že je text takhle rozdělený.",
  },
  {
    q: "Jak je zapsaná ukázka? „Kuba otevřel okno. Do pokoje vlétl studený vzduch a s ním i jeden zmatený motýl.“",
    a: P,
    w: [
      [V, "Verše by měly krátké rýmované řádky, tady jsou dvě souvislé věty bez rýmu."],
      [D, "Divadelní hra by před promluvou uvedla jméno postavy, Kuba v ukázce nemluví."],
      [S, "Seznam řadí krátké položky, tahle ukázka vypráví, co se po otevření okna stalo."],
    ],
    h: [
      "Věty popisují jednu událost po druhé: nejdřív otevřené okno, potom studený vzduch a motýla.",
      "Poslouchej konce obou vět, „okno“ a „motýl“. Nic si neodpovídá, a přesto text dává smysl a plyne. Kdyby šlo o zápis ve verších, byl by rým nebo aspoň pravidelný rytmus tím hlavním, co bys slyšel.",
    ],
    e: "Souvislé věty bez rýmu, které vyprávějí jednu událost za druhou, jsou próza. Text o Kubovi je proto zapsaný v próze.",
  },
  {
    q: "Jak je zapsaná ukázka? „Fouká vítr od Vltavy, / bere mi čepici z hlavy.“",
    a: V,
    w: [
      [P, "Próza by věty nechala plynout až k okraji stránky, tady jsou dva krátké řádky."],
      [D, "Divadelní hra by uvedla, kdo mluví, v ukázce ale nikdo nepromlouvá."],
      [S, "Seznam by neřadil slova do rytmu a neměl by rým, tahle ukázka má obojí."],
    ],
    h: [
      "Přečti nahlas konce obou úseků, „Vltavy“ a „hlavy“. Uslyšíš, že si odpovídají.",
      "Oba úseky mají skoro stejnou délku, takže při čtení vzniká pravidelné houpání, kterému říkáme rytmus. K němu se přidává souznění konců. Tahle dvojice vlastností je typická pro jediný způsob zápisu textu.",
    ],
    e: "Krátké řádky s rytmem a s rýmem „Vltavy – hlavy“ jsou verše. Próza ani seznam takhle pravidelné nejsou.",
  },
  {
    q: "Jak je zapsaná ukázka? „Na dvoře si hrály děti. Míč jim přeletěl přes plot a musely pro něj zaklepat u souseda.“",
    a: P,
    w: [
      [V, "Verše by byly krátké řádky se souznějícími konci, tady jsou dvě delší věty."],
      [D, "Divadelní hra by uvedla jména postav před jejich promluvami, tady nikdo nemluví."],
      [S, "Seznam by řadil krátké položky pod sebou, tahle ukázka vypráví, co se na dvoře stalo."],
    ],
    h: [
      "Ukázka vypráví, co se stalo s míčem a co pak děti musely udělat — a to všechno souvislými větami.",
      "Zkontroluj dvě věci naráz. Za prvé: končí řádky po pár slovech, nebo až u okraje stránky? Za druhé: odpovídají si slova na jejich koncích? Když je odpověď na obě otázky záporná, o verše jít nemůže.",
    ],
    e: "Souvislé vyprávění ve větách bez rýmu je próza. Text o dětech a míči proto zapisujeme jako prózu.",
  },
  {
    q: "Jak je zapsaná ukázka? „Za humny je malý rybník, / kolem něj vede starý chodník.“",
    a: V,
    w: [
      [P, "Próza by měla souvislou větu bez rýmu, tady je text rozdělený na dva krátké řádky."],
      [D, "Divadelní hra by uvedla jméno postavy před promluvou, v ukázce nikdo nemluví."],
      [S, "Seznam by položky jen řadil, tahle ukázka má rytmus i souznějící konce."],
    ],
    h: [
      "Konce obou úseků, „rybník“ a „chodník“, se shodují v poslední slabice.",
      "Lomítko v zápisu znamená zlom řádku. Kdybys ho odstranil a nechal text plynout, vznikla by obyčejná věta a souznění konců by zaniklo uprostřed. Zlom řádku je tu tedy důležitý a ukazuje, o jaký způsob zápisu jde.",
    ],
    e: "Dva krátké řádky se souznějícími konci „rybník – chodník“ jsou verše. Zlom řádku tady není náhodný, ale záměrný.",
  },
  {
    q: "Jak je zapsaná ukázka? „Kočka leze po skále, / hraje si tam stále.“",
    a: V,
    w: [
      [P, "Próza by text nelámala po pár slovech a konce by se v ní nerýmovaly."],
      [D, "Divadelní hra by u promluvy uvedla jméno postavy, kočka tu nemluví."],
      [S, "Seznam nemá souvislý smysl ani rým, tahle ukázka má obojí."],
    ],
    h: [
      "Konce obou úseků, „skále“ a „stále“, se liší jedinou hláskou a při čtení nahlas si odpovídají.",
      "Kočka v textu nic neříká, takže o promluvy nejde. Rozhoduje tedy tvar zápisu: dva krátké úseky oddělené lomítkem, které se dají odříkat v pravidelném rytmu a jejichž konce se shodují v poslední slabice.",
    ],
    e: "Krátké řádky s rýmem „skále – stále“ jsou verše. Text zapsaný takhle čteme jako báseň nebo říkanku.",
  },
];

// ── L3 — počítání veršů a strof, zápis proti obsahu, přepis mezi formami ────
const POOL_L3: Uloha[] = [
  {
    q: "Na obálce je napsáno pod sebou: „Jana Nováková“, „Hlavní 12“, „Praha“. Jsou to verše?",
    a: "Ne — chybí rým i rytmus, jsou to jen údaje pod sebou",
    w: [
      ["Ano — stačí, že jsou řádky krátké", "Krátké řádky samy o sobě verše nedělají, musí k nim přibýt rým nebo rytmus."],
      ["Ano — text není rozdělený do odstavců", "Chybějící odstavce verš neudělají, jinak by veršem byl i nápis na dveřích."],
      ["Ne — verše musí mít vždycky čtyři řádky", "Počet řádků nerozhoduje, báseň může mít dva řádky i dvacet."],
    ],
    h: [
      "Krátké řádky adresa má. Zkus ale zjistit, jestli má i to druhé, co k veršům patří.",
      "Přečti si všechny tři řádky nahlas za sebou. Neuslyšíš žádné houpání ani opakující se zvuk na koncích, protože tady jde jen o jméno, ulici a město. Zápis pod sebou má adresa kvůli přehlednosti, ne kvůli rytmu.",
    ],
    e: "Krátké řádky jsou jen jedna podmínka. Verše poznáme až podle rytmu nebo rýmu, a ty adresa nemá — jsou to údaje seřazené pod sebou kvůli přehlednosti.",
  },
  {
    q: `Báseň má ${versu(12)} a v každé strofě jsou ${versu(3)}. Kolik má báseň strof?`,
    a: strof(4),
    w: [
      [strof(3), "Trojka je počet řádků v jedné skupině, ne počet skupin — tohle číslo už v zadání je."],
      [strof(12), "Dvanáctka je počet všech řádků dohromady, ne počet jejich skupin."],
      [strof(6), "Šestka by vyšla při dělení dvěma, jenže v jedné skupině jsou tři řádky, ne dva."],
    ],
    h: [
      "Ptáme se, kolikrát se do všech řádků vejde jedna skupina. Rozmysli si, jestli budeš násobit, nebo dělit.",
      "Představ si to jako rozdávání: máš hromádku řádků a skládáš je po třech na jednu kupičku. Počet kupiček zjistíš tak, že celkový počet vydělíš tím, kolik jich dáváš na jednu. Odpověď proto bude menší než počet všech řádků.",
    ],
    e: "Počet strof zjistíme dělením: všechny verše rozdělíme po třech, tedy 12 : 3. Vyjdou čtyři skupiny, a to jsou hledané strofy.",
  },
  {
    q: `Báseň má ${strof(3)} a v každé z nich jsou ${versu(4)}. Kolik má báseň veršů celkem?`,
    a: versu(12),
    w: [
      [versu(7), "Sedmička vyjde sečtením obou čísel, jenže skupiny se nesčítají, každá obsahuje čtyři řádky."],
      [versu(4), "Čtyřka je počet řádků v jedné skupině, ne ve všech třech dohromady."],
      [versu(3), "Trojka je počet skupin, ne počet řádků, které v básni přečteš."],
    ],
    h: [
      "Každá skupina obsahuje stejný počet řádků. Přemýšlej, jestli je budeš sčítat, nebo násobit.",
      "Zkus si skupiny nakreslit vedle sebe jako tři obdélníky a do každého napsat čtyři čárky. Až je budeš počítat, zjistíš, že stejný počet přičítáš třikrát po sobě — a přesně to umí zkrátit násobení. Výsledek proto bude větší než obě zadaná čísla.",
    ],
    e: "Ve třech strofách jsou po čtyřech verších, takže počítáme 3 × 4. Celkem tedy báseň obsahuje dvanáct veršů.",
  },
  {
    q: `Báseň má ${versu(15)} a každá strofa má ${versu(5)}. Kolik má báseň strof?`,
    a: strof(3),
    w: [
      [strof(5), "Pětka je počet řádků v jedné skupině, ne počet skupin."],
      [strof(15), "Patnáctka je počet všech řádků, ne počet jejich skupin."],
      [strof(2), "Dvojka by znamenala, že se do dvou skupin vejde patnáct řádků po pěti, a to nevychází."],
    ],
    h: [
      "Zadání říká, kolik řádků má celá báseň a kolik jich připadá na jednu skupinu. Co s těmi dvěma čísly uděláš?",
      "Odpověď najdeš i počítáním po pěti: připočítávej pětku tak dlouho, až se dostaneš k celkovému počtu řádků, a spočítej, kolikrát jsi to udělal. Právě tolikrát se skupina do básně vejde, a tolik skupin tedy báseň má.",
    ],
    e: "Patnáct veršů rozdělíme po pěti, tedy 15 : 5. Vyjdou tři skupiny, a to jsou strofy básně.",
  },
  {
    q: `Pohádka je rozdělená na ${odstavcu(4)}. Je pořád prózou?`,
    a: "Ano — odstavce jsou běžnou součástí prózy a jejich počet nic nemění",
    w: [
      ["Ne — z každého odstavce se stala strofa", "Strofa vzniká jen z veršů, z odstavce se stát nemůže."],
      ["Ne — odstavce může mít jen báseň", "Je to obráceně: odstavce jsou znakem prózy, báseň se dělí na strofy."],
      ["Ano, ale jen kdyby text neměl rým", "Rým může próza mít i náhodou, a přesto prózou zůstane."],
    ],
    h: [
      "Rozdělení na odstavce je běžná součást vyprávění. Ptej se, jestli se tím změnil způsob zápisu.",
      "Zkus si představit, co by se muselo stát, aby text přestal být prózou: věty by se musely rozlámat na krátké řádky s rytmem nebo rýmem. Rozdělení do odstavců ale žádnou větu nerozlámalo, jen text zpřehlednilo.",
    ],
    e: "Odstavce jsou přirozenou součástí prózy a slouží k přehlednosti. Ať jich je jeden, nebo deset, text zůstává prózou, protože se pořád skládá z vět.",
  },
  {
    q: "Stejná slova jsou zapsaná dvakrát. A) „V potoce je čistá voda a na břehu je pohoda.“ B) „V potoce je čistá voda / a na břehu je pohoda.“ Co platí?",
    a: "A je próza, B jsou verše",
    w: [
      ["A jsou verše, B je próza", "Je to obráceně: na dva krátké řádky se láme zápis B, ne zápis A."],
      ["Obojí je próza", "Obojí ne — v zápisu B se text láme na dva krátké řádky, a to próza nedělá."],
      ["Obojí jsou verše", "Obojí ne — zápis A je jedna souvislá věta plynoucí až k okraji stránky."],
    ],
    h: [
      "Slova jsou v obou zápisech stejná. Liší se jen jedno: zda text pokračuje dál, nebo se láme.",
      "Když mají dva texty stejná slova, nemůže o způsobu zápisu rozhodovat obsah. Porovnej je proto jen očima: jeden je jedna dlouhá řada slov, druhý dva krátké kousky pod sebou, na jejichž koncích navíc stojí slova, která si zvukově odpovídají.",
    ],
    e: "Stejná slova se dají zapsat oběma způsoby. Zápis A je jedna souvislá věta, tedy próza; zápis B je rozlomený na dva krátké řádky a na jejich koncích zazní rým „voda – pohoda“, tedy verše.",
  },
  {
    q: "Proč zůstává pohádka prózou, i když v ní postavy mluví?",
    a: "Protože je pořád zapsaná v souvislých větách",
    w: [
      ["Protože řeč postav se nikdy nerýmuje", "Řeč postav se rýmovat může, jen to o způsobu zápisu nic neříká."],
      ["Protože pohádky nemají odstavce", "Pohádky odstavce mají, právě proto se dobře čtou."],
      ["Protože do básně se řeč postav nepíše", "Do básně se řeč postav psát dá, mluví v ní třeba matka na dítě."],
    ],
    h: [
      "Řeč postav je jen obsah. Rozhodni podle toho, jak vypadá zápis kolem ní.",
      "Představ si stránku pohádky s přímou řečí: promluva začíná uvozovkou, ale pořád je to věta, která pokračuje až k okraji stránky a spojuje se s ostatními do odstavce. Nic se nezlomilo do krátkých řádků, takže se způsob zápisu nezměnil.",
    ],
    e: "O próze rozhoduje zápis do vět a odstavců, ne to, kdo v textu mluví. Přímá řeč je pořád věta, takže pohádka zůstává prózou.",
  },
  {
    q: "Který útvar je vždycky próza, i když je opravdu krátký?",
    a: "Povídka",
    w: [
      ["Říkanka", "Říkanka je krátká právě proto, že se skládá z veršů, ne z vět."],
      ["Písnička", "Text písničky se zapisuje po verších a slokách, i když je krátký."],
      ["Koleda", "Koleda se zpívá a její text je zapsaný ve verších, ne v odstavcích."],
    ],
    h: [
      "Nedej se zmást délkou. Ptej se, z čeho se každý z útvarů skládá, ne kolik místa zabere.",
      "Říkanka, písnička i koleda mají společné to, že se dají odříkat nebo zazpívat v rytmu, protože stojí na krátkých řádcích. Hledej útvar, který se dá jen vyprávět nebo číst — ten se skládá z vět, i kdyby měl jen půl stránky.",
    ],
    e: "Délka o způsobu zápisu nerozhoduje. Povídka se skládá z vět a odstavců, a proto je prózou i tehdy, když je velmi krátká.",
  },
  {
    q: "Který útvar je vždycky ve verších, i kdyby měl jen tři řádky?",
    a: "Říkanka",
    w: [
      ["Povídka", "Povídka se skládá z vět a odstavců, veršovaná nebývá."],
      ["Pohádka", "Pohádka se vypráví v souvislých větách, i když má kouzelný obsah."],
      ["Dopis", "Dopis se píše ve větách, i když bývá krátký."],
    ],
    h: [
      "Tři řádky může mít kterýkoli útvar. Rozhodni podle toho, jak jsou ty řádky uvnitř postavené.",
      "Povídku, pohádku i dopis skládáme z vět, které plynou za sebou, a je jedno, jak jsou dlouhé. Hledej útvar, u kterého se každý řádek zlomí záměrně a jejich konce se rýmují, protože se má dobře pamatovat a odříkávat.",
    ],
    e: "Říkanka stojí na krátkých rýmovaných řádcích, tedy na verších, a nezáleží na tom, kolik jich je. Povídka, pohádka i dopis se píší v próze.",
  },
  {
    q: "Nákupní seznam „mléko“, „chléb“, „máslo“ je napsaný pod sebou v krátkých řádcích. Co to je?",
    a: "Položky seřazené pod sebou, ne verše",
    w: [
      ["Verše, protože jsou řádky krátké", "Krátké řádky k veršům nestačí, musel by přibýt rytmus nebo rým."],
      ["Próza, protože jsou to celé věty", "Celé věty to nejsou, každý řádek obsahuje jediné slovo."],
      ["Strofa, protože jsou ty řádky tři", "Strofa je skupina veršů, a verše tady žádné nejsou."],
    ],
    h: [
      "Tři slova pod sebou vypadají jako verše. Zkus je přečíst nahlas a poslouchej, jestli něco drží pohromadě.",
      "Zkontroluj obě podmínky zvlášť. Rytmus: mají ty řádky stejnou délku a houpou se při čtení? Rým: odpovídají si jejich konce? Když je odpověď dvakrát ne, jde jen o způsob, jak si přehledně zapsat, co koupit.",
    ],
    e: "Krátké řádky mají i seznamy, jízdní řády nebo adresy. Bez rytmu a bez rýmu to ale nejsou verše, jen položky seřazené pod sebou.",
  },
  {
    q: `Báseň má ${strof(2)}. V první jsou ${versu(4)}, ve druhé ${versu(3)}. Kolik veršů má celá báseň?`,
    a: versu(7),
    w: [
      [versu(8), "Osmička by vyšla, kdyby měly obě skupiny po čtyřech řádcích, jenže druhá má o jeden méně."],
      [versu(6), "Šestka by vyšla, kdyby měly obě skupiny po třech řádcích, první jich má ale více."],
      [versu(5), "Pětka by vyšla sečtením počtu skupin a počtu řádků v jedné z nich, což dohromady nepatří."],
    ],
    h: [
      "Skupiny tentokrát nejsou stejně velké, takže násobení nepomůže. Co s nestejnými částmi uděláš?",
      "Nakresli si dvě různě vysoké hromádky čárek vedle sebe: jedna bude o čárku vyšší než druhá. Celkový počet zjistíš tak, že je poskládáš dohromady, tedy obě čísla sečteš. Kdyby byly hromádky stejné, mohl bys místo sčítání násobit.",
    ],
    e: "Strofy nejsou stejně velké, proto jejich obsah sečteme: 4 + 3. Báseň má tedy dohromady sedm veršů.",
  },
  {
    q: "Učitelka řekla: „Přepiš tuhle říkanku do prózy.“ Co s textem uděláš?",
    a: "Napíšu ji jako souvislé věty za sebou",
    w: [
      ["Nechám krátké řádky a jen škrtnu rýmy", "Krátké řádky pod sebou jsou právě znak veršů, takže zůstat nemohou."],
      ["Rozdělím ji do dvou strof", "Strofy jsou skupiny veršů, takže by text zůstal ve verších."],
      ["Přidám k ní nadpis a obrázek", "Nadpis ani obrázek způsob zápisu nemění, text by zůstal ve verších."],
    ],
    h: [
      "Přemýšlej pozpátku: podle čeho poznáš prózu? Přesně to musíš s říkankou udělat.",
      "Nejdřív si vyjmenuj, co se pozná na próze — věty jdoucí za sebou až k okraji stránky a odstavce. Pak zkontroluj, co má říkanka jinak: láme se do krátkých řádků. Přepis tedy znamená tyhle zlomy zrušit a slova spojit do vět.",
    ],
    e: "Prózu poznáme podle vět plynoucích za sebou. Přepsat říkanku do prózy proto znamená zrušit zlomy řádků a spojit slova do souvislých vět.",
  },
  {
    q: "V čem se liší strofa a odstavec?",
    a: "Strofa sdružuje verše, odstavec věty",
    w: [
      ["Strofa sdružuje věty, odstavec verše", "Je to obráceně: verše patří k básni, a tedy ke strofě."],
      ["Strofa je vždycky delší než odstavec", "Délka nerozhoduje, strofa bývá naopak často kratší."],
      ["Mezi nimi žádný rozdíl není", "Rozdíl je podstatný — každý z těch pojmů patří k jinému způsobu zápisu."],
    ],
    h: [
      "Oba pojmy dělí text na části. Liší se tím, z čeho jsou ty části poskládané.",
      "Vrať se k tomu, jak vypadá báseň a jak vyprávění. Báseň stojí na krátkých řádcích, vyprávění na větách. Každé dělení textu tedy sdružuje jiný stavební dílek — a právě v tom je mezi oběma pojmy rozdíl.",
    ],
    e: "Strofa i odstavec dělí text na části, ale každý u jiného způsobu zápisu: strofa spojuje verše v básni, odstavec věty v próze.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).map(task);
}

export const PROZAVERSE: TopicMetadata[] = [
  {
    id: "g3-cjl-proza-verse",
    rvpNodeId: "g3-cjl-literarni-vychova-literarni-druhy-a-zanry-proza-a-verse-rozliseni",
    title: "Próza a verše - rozlišení",
    studentTitle: "Próza nebo báseň?",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární druhy a žánry",
    briefDescription: "Poznáš rozdíl mezi prózou a básní psanou ve verších.",
    keywords: ["próza", "verše", "báseň", "strofa", "rým", "rytmus", "odstavec"],
    goals: ["Rozlišit prózu a verše.", "Popsat znaky básně (krátké řádky, rým, rytmus).", "Popsat znaky prózy (věty, odstavce)."],
    boundaries: ["Základní rozlišení bez metriky."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Próza = příběh v odstavcích. Verše = báseň v krátkých řádcích s rýmem.",
      steps: ["Podívej se, jak je text zapsán.", "Krátké řádky s rýmy → verše/báseň.", "Normální věty v odstavcích → próza."],
      commonMistake: "Říkanka se zdá krátká a jednoduchá — ale je to báseň (verše), ne próza.",
      example: "Próza: 'Bylo jednou malé kotě...' / Verše: 'Skákal pes / přes oves / přes zelenou louku...'",
    },
  },
];
