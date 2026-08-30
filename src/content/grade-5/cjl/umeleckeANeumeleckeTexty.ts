import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Co je umělecký text?",
    correctAnswer: "text pro estetický zážitek",
    options: [
      "text s přesnými fakty",
      "text pro estetický zážitek",
      "návod k použití přístroje",
      "zpráva o dnešním počasí",
    ],
    hints: ["Proč sáhneš po básni nebo románu? Chceš se něco dozvědět, nebo něco prožít?"],
    explanation: "Umělecký text chce v čtenáři vyvolat prožitek — dojetí, napětí, krásu. Fakta v něm být mohou, ale nejsou jeho hlavním smyslem.",
  },
  {
    question: "Co je věcný (neumělecký) text?",
    correctAnswer: "text, který předává informaci",
    options: [
      "text, který vyvolává city",
      "text, který předává informaci",
      "text plný obrazných výrazů",
      "text vyprávějící smyšlený příběh",
    ],
    hints: ["Učebnice, návod i jízdní řád mají jeden společný úkol. Jaký?"],
    explanation: "Věcný text má čtenáři sdělit něco pravdivého co nejsrozumitelněji. Proto se obejde bez obrazného jazyka i bez smyšleného děje.",
  },
  {
    question: "Jaký typ textu je báseň?",
    correctAnswer: "umělecký",
    options: ["věcný", "umělecký", "odborný", "publicistický"],
    hints: ["Báseň pracuje s obrazy, rytmem a citem — chce tě to hlavně informovat, nebo v tobě vyvolat prožitek?"],
    explanation: "Báseň míří na prožitek čtenáře, ne na předání údajů. Proto ji řadíme mezi texty umělecké.",
  },
  {
    question: "Jaký typ textu je návod k pračce?",
    correctAnswer: "věcný",
    options: ["umělecký", "věcný", "poetický", "beletristický"],
    hints: ["Návod k pračce tě má naučit, jak něco udělat — jde mu o přesnost instrukcí, nebo o krásu jazyka?"],
    explanation: "Návod musí být především jednoznačný, aby podle něj šlo postupovat. Obrazný jazyk by tu jen škodil.",
  },
  {
    question: "Jaký typ textu je encyklopedie?",
    correctAnswer: "věcný odborný",
    options: ["umělecký", "poetický", "věcný odborný", "beletristický"],
    hints: ["Encyklopedie ti má podat ověřená fakta a definice — chce tě to pobavit příběhem, nebo poučit informací?"],
    explanation: "Encyklopedie shrnuje ověřené poznatky s přesnými pojmy. Je to tedy věcný text, a protože pracuje s terminologií, řadíme ho k odborným.",
  },
  {
    question: "Jaký typ textu je pohádka?",
    correctAnswer: "umělecký",
    options: ["věcný", "odborný", "umělecký", "publicistický"],
    hints: ["Pohádka vypráví smyšlený příběh s kouzly a fantazií — má tě to informovat, nebo vtáhnout do prožitku?"],
    explanation: "Pohádka vypráví smyšlený děj a chce zaujmout. Ničemu skutečnému neinformuje, takže mezi věcné texty nepatří.",
  },
  {
    question: "Jaký typ textu je novinový článek o fotbale?",
    correctAnswer: "věcný publicistický",
    options: ["umělecký", "věcný publicistický", "poetický", "beletristický"],
    hints: ["Článek popisuje, jak zápas skutečně dopadl. Je to smyšlený příběh, nebo záznam události?"],
    explanation: "Zpravodajství podává skutečné události, takže jde o text věcný. Protože vychází v médiích, mluvíme o textu publicistickém.",
  },
  {
    question: "Jaký typ textu je román Jaroslava Foglara?",
    correctAnswer: "umělecký",
    options: ["věcný", "odborný", "umělecký", "publicistický"],
    hints: ["Rychlé šípy jsou vymyšlená parta a vymyšlený příběh. Do které skupiny textů to patří?"],
    explanation: "Foglarovy romány vyprávějí smyšlený příběh a chtějí čtenáře vtáhnout — jsou to tedy texty umělecké, konkrétně beletrie.",
  },
  {
    question: "Jaký typ textu je jízdní řád autobusu?",
    correctAnswer: "věcný",
    options: ["umělecký", "věcný", "poetický", "beletristický"],
    hints: ["Jízdní řád jen sděluje časy odjezdů — chce tě to pobavit příběhem, nebo tě to jen informuje?"],
    explanation: "Jízdní řád podává přesné údaje a nic víc. Je to typický věcný text s praktickým úkolem.",
  },
  {
    question: "Co je cílem uměleckého textu?",
    correctAnswer: "vyvolat zážitek a emoce",
    options: [
      "předat přesná fakta",
      "vyvolat zážitek a emoce",
      "dát návod k činnosti",
      "seřadit údaje do tabulky",
    ],
    hints: ["Umělecký text nechce jen přesně informovat ani dávat návod — co v tobě tedy chce vyvolat, když čteš báseň nebo příběh?"],
    explanation: "Umělecký text míří na čtenářův prožitek — má dojmout, pobavit nebo přimět k zamyšlení. Informace i poučení mohou přijít, ale jako vedlejší efekt.",
  },
  {
    question: "Co je cílem věcného textu?",
    correctAnswer: "přesně předat informaci",
    options: [
      "vyvolat silné emoce",
      "pobavit čtenáře příběhem",
      "přesně předat informaci",
      "překvapit obrazným jazykem",
    ],
    hints: ["Proč otvíráš encyklopedii nebo návod? Kvůli zážitku, nebo kvůli něčemu jinému?"],
    explanation: "Věcný text má sdělit něco pravdivého tak, aby tomu čtenář porozuměl. Přesnost a srozumitelnost jsou proto důležitější než působivost.",
  },
  {
    question: "Jaký typ textu je učebnice matematiky?",
    correctAnswer: "věcný odborný",
    options: ["umělecký", "poetický", "věcný odborný", "beletristický"],
    hints: ["Učebnice má žáka něco naučit pomocí faktů a přesných pojmů — jde jí o krásu jazyka, nebo o přesnost?"],
    explanation: "Učebnice vysvětluje látku pomocí přesně vymezených pojmů. Je to věcný text s odbornou terminologií.",
  },
  {
    question: "Jak se liší styl uměleckého a věcného textu?",
    correctAnswer: "umělecký je obrazný, věcný přesný",
    options: [
      "umělecký je přesný, věcný obrazný",
      "umělecký je obrazný, věcný přesný",
      "věcný je vždy kratší",
      "obojí je zcela stejné",
    ],
    hints: ["V kterém z těch dvou textů čekáš metaforu a v kterém přesné číslo?"],
    explanation: "Umělecký text pracuje s obrazy, přirovnáními a citovým zabarvením, věcný volí neutrální a jednoznačná slova. Na délce to nezávisí.",
  },
  {
    question: "Jaký typ textu je reklama?",
    correctAnswer: "věcný s uměleckými prvky",
    options: [
      "čistě umělecký",
      "věcný s uměleckými prvky",
      "čistě věcný",
      "čistě odborný",
    ],
    hints: ["Reklama ti sděluje, co výrobek umí, ale zároveň používá vtipy a obrazy. Vejde se do jediné škatulky?"],
    explanation: "Reklama informuje o produktu, ale zároveň chce zapůsobit a přesvědčit, takže si půjčuje prostředky uměleckého textu. Stojí proto na pomezí.",
  },
  {
    question: "Co je beletrie?",
    correctAnswer: "umělecká próza",
    options: [
      "odborný vědecký text",
      "umělecká próza",
      "novinové zpravodajství",
      "sbírka básní",
    ],
    hints: ["Do téhle skupiny patří romány, povídky a novely — ale ne básně. Co mají ty první tři společného?"],
    explanation: "Beletrie označuje uměleckou prózu — romány, novely a povídky. Poezie ani věcné texty do ní nepatří.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co je publicistický text?",
    correctAnswer: "text o aktuálních událostech",
    options: [
      "text o dávné minulosti",
      "text o aktuálních událostech",
      "báseň otištěná v novinách",
      "návod k domácímu spotřebiči",
    ],
    hints: ["Kde takový text vychází a jak rychle zastará?"],
    explanation: "Publicistika informuje o tom, co se právě děje — zprávy, reportáže, komentáře. Zítra už bývá překonaná, na rozdíl od odborného textu.",
  },
  {
    question: "Co je odborný text?",
    correctAnswer: "text s přesnou terminologií",
    options: [
      "text bez odborných pojmů",
      "text s přesnou terminologií",
      "text psaný obrazným jazykem",
      "text určený malým dětem",
    ],
    hints: ["Komu je takový text určený a jaká slova proto může používat, aniž by je vysvětloval?"],
    explanation: "Odborný text píše odborník pro odborníky, takže si může dovolit přesné termíny bez vysvětlování. Právě terminologie ho odlišuje od textu populárně naučného.",
  },
  {
    question: "Jaký typ textu je fejeton?",
    correctAnswer: "věcný text s humorem",
    options: [
      "čistě umělecká povídka",
      "věcný text s humorem",
      "čistě věcná zpráva",
      "odborná vědecká studie",
    ],
    hints: ["Fejeton vychází v novinách jako zpráva, ale čte se úplně jinak. Co k němu autor přidal?"],
    explanation: "Fejeton komentuje skutečné dění, ale s nadhledem, vtipem a osobním tónem. Stojí proto mezi věcným a uměleckým textem.",
  },
  {
    question: "Co je reportáž?",
    correctAnswer: "zpráva přímo z místa události",
    options: [
      "úvaha psaná u stolu doma",
      "zpráva přímo z místa události",
      "vymyšlený příběh o události",
      "seznam údajů v tabulce",
    ],
    hints: ["Čím se liší text novináře, který někam skutečně jel, od textu, který jen shrnuje, co se doslechl?"],
    explanation: "Reportér je na místě a popisuje, co sám viděl a slyšel. Přímý zážitek reportáž odlišuje od běžné zprávy i od úvahy.",
  },
  {
    question: "Co je esej?",
    correctAnswer: "úvaha autora nad tématem",
    options: [
      "krátká novinová zpráva",
      "úvaha autora nad tématem",
      "odborný výzkumný článek",
      "vyprávění smyšleného děje",
    ],
    hints: ["Takový text nepřináší jen fakta ani jen příběh. Co v něm autor předkládá navíc?"],
    explanation: "Esej spojuje fakta s autorovým vlastním přemýšlením a postojem. Na rozdíl od odborné studie nemusí nic dokazovat — nabízí pohled.",
  },
  {
    question: "Jak poznáme umělecký text od věcného?",
    correctAnswer: "podle obrazného jazyka",
    options: [
      "podle délky textu",
      "podle obrazného jazyka",
      "podle počtu čísel",
      "podle jména autora",
    ],
    hints: ["Zkus najít v textu metafory nebo přirovnání a všimni si, jestli v něm převažují city, nebo přesná fakta."],
    explanation: "Rozhoduje způsob vyjádření a účel: obrazný, citově zabarvený jazyk míří k prožitku. Délka ani autor o zařazení nevypovídají.",
  },
  {
    question: "Co je cestopis?",
    correctAnswer: "popis cesty a navštívených míst",
    options: [
      "návod, jak zabalit kufr",
      "popis cesty a navštívených míst",
      "jízdní řád vlaků a autobusů",
      "vědecký výzkum o krajině",
    ],
    hints: ["Autor někam jel a pak o tom napsal. Co v takovém textu čtenář najde?"],
    explanation: "Cestopis podává skutečné informace o místech, ale zároveň autorovy dojmy a zážitky. Právě proto stojí mezi věcným a uměleckým textem.",
  },
  {
    question: "Jaký typ textu je recept?",
    correctAnswer: "věcný text s postupem",
    options: [
      "umělecká povídka o vaření",
      "věcný text s postupem",
      "báseň o jídle",
      "odborná studie o výživě",
    ],
    hints: ["Recept ti krok za krokem říká, co udělat — jde mu o přesný postup, nebo o krásu jazyka?"],
    explanation: "Recept je návod: uvádí suroviny a kroky v přesném pořadí, aby podle něj šlo uvařit. Je to tedy věcný text s praktickým úkolem.",
  },
  {
    question: "Co jsou memoáry?",
    correctAnswer: "vzpomínky autora na svůj život",
    options: [
      "vědecká studie o minulosti",
      "vzpomínky autora na svůj život",
      "vymyšlený příběh o hrdinovi",
      "sbírka dopisů cizích lidí",
    ],
    hints: ["Kdo takový text píše a o čem? A jsou to události skutečné, nebo vymyšlené?"],
    explanation: "V memoárech autor zaznamenává, co sám prožil. Události jsou skutečné, ale podané jeho pohledem, takže text spojuje věcné i umělecké rysy.",
  },
  {
    question: "Co je populárně naučný text?",
    correctAnswer: "věda vysvětlená srozumitelně",
    options: [
      "věda psaná jen pro odborníky",
      "věda vysvětlená srozumitelně",
      "vymyšlený příběh o vědcích",
      "báseň o vědeckém objevu",
    ],
    hints: ["Komu je určený časopis o přírodě, který čtou i děti? A jak podle toho musí být napsaný?"],
    explanation: "Populárně naučný text přináší stejné poznatky jako odborný, ale vysvětluje je tak, aby jim rozuměl i nezasvěcený čtenář.",
  },
  {
    question: "Jaký styl jazyka je typický pro věcný text?",
    correctAnswer: "neutrální a přesný",
    options: [
      "obrazný a citový",
      "neutrální a přesný",
      "hovorový a nespisovný",
      "veršovaný a rytmický",
    ],
    hints: ["Aby čtenář pochopil údaj správně, nesmí si ho vyložit dvěma způsoby. Jaká slova to zajistí?"],
    explanation: "Věcný text volí slova, která nemají dvojí význam ani citové zabarvení. Jen tak si čtenář informaci vyloží přesně tak, jak byla míněna.",
  },
  {
    question: "Jaký styl jazyka je typický pro umělecký text?",
    correctAnswer: "obrazný a citový",
    options: [
      "neutrální a přesný",
      "obrazný a citový",
      "odborný s termíny",
      "strohý a úřední",
    ],
    hints: ["Je to opak toho, co bys čekal v návodu. Jaká slova tedy autor volí?"],
    explanation: "Umělecký text pracuje s metaforami, přirovnáními a citově zabarvenými slovy, protože chce působit na čtenářovy pocity, ne jen na jeho rozum.",
  },
  {
    question: "Může být stejné téma zpracováno věcně i umělecky?",
    correctAnswer: "ano, rozhoduje účel textu",
    options: [
      "ne, téma určuje typ textu",
      "ano, rozhoduje účel textu",
      "ano, rozhoduje délka textu",
      "ne, obojí je vždy umělecké",
    ],
    hints: ["Zkus si představit odborný popis lesa a báseň o lese. Je téma stejné? A jsou stejné i texty?"],
    explanation: "O zařazení nerozhoduje téma, ale záměr autora. O lese lze napsat encyklopedické heslo i báseň — a bude to věcný, respektive umělecký text.",
  },
  {
    question: "Co je literární kritika?",
    correctAnswer: "věcný text hodnotící dílo",
    options: [
      "umělecká povídka o autorovi",
      "věcný text hodnotící dílo",
      "báseň napsaná o knize",
      "vymyšlený rozhovor s autorem",
    ],
    hints: ["Kritik knihu nevymýšlí — píše o knize někoho jiného. K jakému typu textu to má blíž?"],
    explanation: "Kritika rozebírá a hodnotí hotové dílo pomocí argumentů. Přestože se týká umění, sama uměleckým textem není — je to text věcný.",
  },
  {
    question: "Jak se liší životopis (biografie) od autobiografie?",
    correctAnswer: "biografie je o jiném člověku",
    options: [
      "autobiografie je o jiném člověku",
      "biografie je o jiném člověku",
      "obojí znamená totéž",
      "biografie je vždy kratší",
    ],
    hints: ["Rozlož si slovo 'auto-' (sám) — kdo v každém z těch dvou pojmů píše a o kom?"],
    explanation: "Předpona 'auto-' znamená, že autor píše o sobě. Bez ní jde o vyprávění o někom jiném. Délka rozdíl netvoří.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co znamená, že text odkazuje na jiný text?",
    correctAnswer: "cituje ho nebo na něj naráží",
    options: [
      "je od stejného autora",
      "cituje ho nebo na něj naráží",
      "má stejný počet stran",
      "vyšel ve stejném roce",
    ],
    hints: ["Když se v knize objeví věta z pohádky, kterou znáš, co tím autor udělal?"],
    explanation: "Text může druhý text přímo citovat nebo na něj jen nenápadně narážet. Čtenář, který obě díla zná, tak získá význam navíc.",
  },
  {
    question: "Proč vyzní stejná událost jinak ve zprávě a v povídce?",
    correctAnswer: "liší se účel a jazyk",
    options: [
      "liší se jen délka",
      "liší se účel a jazyk",
      "liší se jen nadpis",
      "nijak se to neliší",
    ],
    hints: ["Zpráva chce informovat, povídka zaujmout. Co to udělá s výběrem slov?"],
    explanation: "Zpráva volí neutrální slova a fakta, povídka obrazy a city — proto tatáž událost působí pokaždé jinak. Rozhoduje účel, ne samotná událost.",
  },
  {
    question: "Co je propaganda?",
    correctAnswer: "text přesvědčující o názoru",
    options: [
      "text popisující fakta",
      "text přesvědčující o názoru",
      "text bavící čtenáře",
      "text s návodem k práci",
    ],
    hints: ["Takový text se tváří, že informuje, ale ve skutečnosti tě chce k něčemu naklonit. K čemu?"],
    explanation: "Propaganda šíří určitý názor a záměrně vybírá jen to, co se jí hodí. Proto se nedá číst jako běžné zpravodajství — je potřeba ověřovat.",
  },
  {
    question: "Co je alegorie v literárním textu?",
    correctAnswer: "příběh se skrytým významem",
    options: [
      "příběh bez skrytého významu",
      "příběh se skrytým významem",
      "věcný popis události",
      "báseň o krásné přírodě",
    ],
    hints: ["V bajce vystupují zvířata, ale mluví se přitom o lidech. Jak se takovému dvojímu čtení říká?"],
    explanation: "Alegorie vypráví jeden příběh, ale míní jiný — zvířata nebo postavy zastupují něco dalšího. Čtenář má druhou rovinu rozpoznat.",
  },
  {
    question: "Co je satira?",
    correctAnswer: "kritika pomocí humoru",
    options: [
      "chvála pomocí humoru",
      "kritika pomocí humoru",
      "věcný popis bez hodnocení",
      "vyprávění pro nejmenší",
    ],
    hints: ["Proč se lidé smějí kreslenému vtipu o politicích? Jde tomu vtipu jen o smích?"],
    explanation: "Satira zesměšňuje nešvary, aby na ně upozornila. Humor je jen prostředek — cílem je kritika.",
  },
  {
    question: "Jak se liší odborný a populárně naučný text?",
    correctAnswer: "liší se srozumitelností",
    options: [
      "liší se pravdivostí",
      "liší se srozumitelností",
      "liší se jen délkou",
      "vůbec se od sebe neliší",
    ],
    hints: ["Oba text mohou popisovat totéž a oba mluví pravdu. Co se tedy mění podle toho, kdo je má číst?"],
    explanation: "Obsah může být stejně pravdivý v obou, mění se jazyk: odborný text počítá se znalostmi čtenáře, populárně naučný vysvětluje i základy.",
  },
  {
    question: "Co je fikce v literatuře?",
    correctAnswer: "vymyšlené příběhy a světy",
    options: [
      "pravdivý záznam událostí",
      "vymyšlené příběhy a světy",
      "sbírka ověřených faktů",
      "návod k použití věci",
    ],
    hints: ["Existovali Rychlé šípy doopravdy? A co to říká o textech, v nichž vystupují?"],
    explanation: "Fikce je vše, co si autor vymyslel — postavy, děje i celé světy. Nejde o lež, protože čtenář ví, že text skutečnost nezaznamenává.",
  },
  {
    question: "Co je literatura faktu?",
    correctAnswer: "knihy o skutečných událostech",
    options: [
      "knihy o vymyšlených světech",
      "knihy o skutečných událostech",
      "sbírky básní a pohádek",
      "knihy jen pro odborníky",
    ],
    hints: ["Je to protiklad fikce. O čem takové knihy tedy vypovídají?"],
    explanation: "Literatura faktu se opírá o doložené události a osoby — patří sem životopisy, cestopisy i knihy o historii. Autor si nesmí vymýšlet.",
  },
  {
    question: "Co je ironický text?",
    correctAnswer: "text s opačným smyslem",
    options: [
      "text psaný ve verších",
      "text s opačným smyslem",
      "text bez jakéhokoli humoru",
      "text s přesnými fakty",
    ],
    hints: ["Když někdo v lijáku prohlásí 'To je ale krásné počasí', myslí to vážně?"],
    explanation: "Ironie říká pravý opak toho, co má na mysli, a spoléhá, že to čtenář rozpozná ze situace. Doslovné čtení by vedlo k nedorozumění.",
  },
  {
    question: "Proč je reklama na pomezí věcného a uměleckého textu?",
    correctAnswer: "informuje i přesvědčuje",
    options: [
      "jen informuje o produktu",
      "informuje i přesvědčuje",
      "jen baví obrazným jazykem",
      "nedělá ani jedno z toho",
    ],
    hints: ["Dozvíš se z reklamy, co výrobek umí? A zůstane u toho?"],
    explanation: "Reklama sděluje údaje o výrobku jako věcný text, ale používá obrazy, vtipy a emoce, aby zapůsobila. Proto ji nelze zařadit jen do jedné skupiny.",
  },
  {
    question: "Co je dystopie?",
    correctAnswer: "příběh o špatné budoucnosti",
    options: [
      "příběh o krásné budoucnosti",
      "příběh o špatné budoucnosti",
      "příběh o dávné minulosti",
      "příběh bez jakéhokoli děje",
    ],
    hints: ["Existují příběhy o vysněném světě budoucnosti. Jak by vypadal jejich pravý opak?"],
    explanation: "Dystopie líčí budoucí společnost, kde se něco vážně pokazilo — nesvoboda, zničená příroda, dohled nad lidmi. Autor tím obvykle varuje před dneškem.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const UMELECKEANEUMELECKETEXTY: TopicMetadata[] = [
  {
    id: "g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-umelecke-a-neumelecke-texty",
    rvpNodeId: "g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-umelecke-a-neumelecke-texty",
    title: "Umělecké a věcné texty",
    studentTitle: "Umělecké a věcné texty",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární pojmy a žánry",
    briefDescription: "Rozlišíš umělecký a věcný text a pochopíš jejich účel.",
    keywords: ["umělecký text", "věcný text", "beletrie", "odborný text", "publicistika"],
    goals: [
      "Rozlišit umělecký a věcný text",
      "Určit cíl a styl obou typů textů",
      "Přiřadit konkrétní text ke správné kategorii",
    ],
    boundaries: [
      "Bez podrobné literárněvědné analýzy",
      "Rozšiřující nad rámec RVP 5. ročníku: úroveň 3 (propaganda, alegorie, satira, literatura faktu, dystopie)",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Umělecký text = krása, emoce, příběh (básně, romány, pohádky). Věcný text = informace, fakta (učebnice, návody, zprávy).",
      steps: [
        "Přečti text a zeptej se: Chce mě pobavit nebo dojmout? → umělecký.",
        "Chce mě informovat nebo poučit? → věcný.",
        "Umělecký: obrazný jazyk, příběh, emoce.",
        "Věcný: přesná fakta, neutrální jazyk.",
      ],
      commonMistake: "Žáci si myslí, že krásně napsaný věcný text je umělecký. Záleží na účelu, ne na kráse jazyka.",
      example: "Báseň o slonech = umělecká. Encyklopedický článek o slonech = věcný.",
    },
  },
];
