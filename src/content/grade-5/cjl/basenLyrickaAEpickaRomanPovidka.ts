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
    question: "Co je lyrická báseň?",
    correctAnswer: "báseň o pocitech a náladách, bez děje",
    options: ["báseň o pocitech a náladách, bez děje", "báseň s příběhem a postavami", "báseň o historické události", "báseň určená jen dětem"],
    hints: ["'Lyrika' pochází z řeckého nástroje lyra, spojeného s výrazem vnitřního světa. Vypráví tato báseň příběh, nebo spíše vyjadřuje niterné prožívání?"],
    explanation: "Lyrická báseň nic nevypráví — zachycuje, co básník cítí a jak vnímá svět. Jakmile by měla postavy a sled událostí, byla by to báseň epická.",
  },
  {
    question: "Co je epická báseň?",
    correctAnswer: "báseň s příběhem a dějem",
    options: ["báseň bez děje, jen o pocitech", "báseň s příběhem a dějem", "báseň jen o přírodě a krajině", "báseň psaná z pohledu zvířete"],
    hints: ["'Epika' pochází z řeckého slova pro vyprávění. Má tato báseň příběh s postavami a dějem, nebo jen vyjadřuje pocity?"],
    explanation: "Epická báseň vypráví příběh, jen ho místo do vět rozdělí do veršů. Patří sem balada, epos i veršovaná pohádka. Bez děje by šlo o lyriku.",
  },
  {
    question: "Co je román?",
    correctAnswer: "delší próza s více postavami",
    options: ["kratší próza s jedním příběhem", "báseň psaná v próze", "delší próza s více postavami", "hra určená pro divadlo"],
    hints: ["Zamysli se, kolik dějových linek a postav dokáže dílo unést, když má stovky stran — a kolik, když má jen pár."],
    explanation: "Román má dost místa na několik dějových linek a mnoho postav, které se vyvíjejí. Kratší próza s jediným příběhem je povídka.",
  },
  {
    question: "Co je povídka?",
    correctAnswer: "kratší próza s jedním příběhem",
    options: ["delší próza s více příběhy", "báseň s pravidelným rýmem", "hra určená pro divadlo", "kratší próza s jedním příběhem"],
    hints: ["Kolik zápletek se vejde do textu, který přečteš za půl hodiny?"],
    explanation: "Povídka se soustředí na jednu situaci a málo postav — proto je krátká. Kdyby měla víc dějových linek a stovky stran, byl by to román.",
  },
  {
    question: "Jaký literární žánr je Erbenova Kytice?",
    correctAnswer: "sbírka balad",
    options: ["sbírka balad", "román", "sbírka povídek", "divadelní hra"],
    hints: ["Vodník, Polednice, Vrba — mají tyhle texty děj? A jsou psané ve verších, nebo v souvislých větách?"],
    explanation: "Kytice obsahuje básně, které vyprávějí příběh a končí tragicky — to jsou balady. Kdyby to byla próza, šlo by o sbírku povídek.",
  },
  {
    question: "Jaký literární žánr jsou Máchovy básně (Máj)?",
    correctAnswer: "lyrickoepická báseň",
    options: ["dobrodružný román", "lyrickoepická báseň", "detektivní povídka", "divadelní tragédie"],
    hints: ["Máj má příběh o Vilémovi, ale zároveň rozsáhlé pasáže o přírodě a pocitech. Která možnost obě tyhle stránky spojuje?"],
    explanation: "Máj vypráví příběh (epická složka), ale velkou část zabírají úvahy a nálady (lyrická složka). Proto se řadí mezi básně lyrickoepické.",
  },
  {
    question: "Jaký je hlavní rozdíl mezi románem a povídkou?",
    correctAnswer: "román je delší a složitější",
    options: ["povídka je delší a složitější", "povídka je vždy jen o dětech", "román je delší a složitější", "román musí být sci-fi"],
    hints: ["Rozdíl není v tématu ani v tom, pro koho je dílo určené. Zamysli se nad rozsahem a počtem dějových linek."],
    explanation: "Rozhoduje rozsah a složitost děje, ne téma. Román i povídka mohou být o čemkoli — sci-fi, o dětech i o dospělých.",
  },
  {
    question: "Který z těchto titulů je román?",
    correctAnswer: "Dobrodružství Toma Sawyera",
    options: ["Kytice od Erbena", "Máj od Máchy", "Polednice od Erbena", "Dobrodružství Toma Sawyera"],
    hints: ["Tři z těch titulů jsou psané ve verších. Který jediný je souvislá próza na několik set stran?"],
    explanation: "Tom Sawyer je dlouhá próza s mnoha postavami — román. Kytice, Máj i Polednice jsou psané ve verších, takže mezi romány nepatří.",
  },
  {
    question: "Co je balada?",
    correctAnswer: "epická báseň s tragickým dějem",
    options: ["epická báseň s tragickým dějem", "lyrická báseň o přírodě", "veselá báseň pro děti", "pohádka psaná ve verších"],
    hints: ["Vodník i Polednice končí neštěstím. Co je pro tenhle typ básní typické kromě toho, že mají děj?"],
    explanation: "Balada vypráví příběh ve verších a téměř vždy končí neštěstím — právě tragický konec ji odlišuje od veršované pohádky.",
  },
  {
    question: "Co je epos?",
    correctAnswer: "rozsáhlá báseň o hrdinech",
    options: [
      "kratší lyrická báseň",
      "rozsáhlá báseň o hrdinech",
      "moderní dobrodružný román",
      "pohádka pro nejmenší",
    ],
    hints: ["Ilias a Odyssea mají tisíce veršů a sledují osudy bojovníků. Jaký útvar to je?"],
    explanation: "Epos je dlouhá veršovaná skladba o činech hrdinů. Od románu se liší tím, že je psaný ve verších, ne v próze.",
  },
  {
    question: "Jaký typ díla je Jaroslav Foglar – Záhada hlavolamu?",
    correctAnswer: "dobrodružný román pro mládež",
    options: ["sbírka lyrických básní", "detektivní povídka", "dobrodružný román pro mládež", "veršovaná pohádka"],
    hints: ["Je to souvislá próza na několik set stran o partě chlapců a jejich pátrání. Který žánr tomu odpovídá?"],
    explanation: "Záhada hlavolamu je dlouhá próza s mnoha postavami, psaná pro mladé čtenáře — dobrodružný román. Na povídku je příliš rozsáhlá.",
  },
  {
    question: "Lyrická báseň nevypráví příběh, ale:",
    correctAnswer: "vyjadřuje pocity a nálady",
    options: ["popisuje historické události", "instruuje čtenáře, co dělat", "vypráví pohádku", "vyjadřuje pocity a nálady"],
    hints: ["Když v básni není děj ani postavy, co v ní vlastně zbývá?"],
    explanation: "Lyrika zachycuje vnitřní svět — dojmy, nálady a prožitky. Historické události i pohádky mají děj, takže patří k epice.",
  },
  {
    question: "Jaký literární žánr psal Arthur Conan Doyle (Sherlock Holmes)?",
    correctAnswer: "detektivní povídky a novely",
    options: ["detektivní povídky a novely", "epické básně o hrdinech", "lyrické básně o lásce", "veršované pohádky"],
    hints: ["Příběhy o Sherlocku Holmesovi jsou psané souvislými větami, ne ve verších, a většina z nich je krátká."],
    explanation: "Doyle psal prózu — kratší příběhy o vyšetřování záhad. Jde tedy o povídky a novely, ne o poezii.",
  },
  {
    question: "Co je novela?",
    correctAnswer: "próza delší než povídka",
    options: [
      "próza delší než román",
      "próza delší než povídka",
      "jiné slovo pro román",
      "kratší epická báseň",
    ],
    hints: ["Novela stojí mezi dvěma útvary, které už znáš. Který z nich je kratší a který delší?"],
    explanation: "Novela je rozsahem mezi povídkou a románem — delší než povídka, kratší než román, a drží se jedné hlavní dějové linky.",
  },
  {
    question: "Jaký je autor knihy 'Ostrov pokladů'?",
    correctAnswer: "Robert Louis Stevenson",
    options: ["Mark Twain", "Arthur Conan Doyle", "Robert Louis Stevenson", "Jaroslav Foglar"],
    hints: ["Autor je Skot, který psal dobrodružné romány o mořeplavbě a pirátech."],
    explanation: "Ostrov pokladů napsal skotský spisovatel Stevenson. Twain je autorem Toma Sawyera, Doyle psal o Sherlocku Holmesovi a Foglar o Rychlých šípech.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co je lyrickoepická báseň?",
    correctAnswer: "báseň s pocity i s dějem",
    options: ["báseň jen s pocity, bez děje", "báseň jen s dějem, bez pocitů", "pohádka psaná ve verších", "báseň s pocity i s dějem"],
    hints: ["'Lyricko-' a '-epická' — obě části názvu napovídají, co dílo spojuje. Která dvě slova označují pocity a příběh?"],
    explanation: "Název je složený ze dvou slov, protože se v díle spojují obě složky: příběh i vyjádření nálad. Typickým příkladem je Máchův Máj.",
  },
  {
    question: "Co je pohádka a jaký žánr to je?",
    correctAnswer: "dílo s fantastickými prvky",
    options: ["dílo s fantastickými prvky", "dílo o skutečné historii", "text popisující vědecký pokus", "hra určená pro divadlo"],
    hints: ["Co mají společného kouzelný prsten, mluvící zvíře a drak? A může se něco takového stát doopravdy?"],
    explanation: "Pohádku poznáš podle nadpřirozených prvků — kouzel, mluvících zvířat, nadpřirozených bytostí. Může být psaná prózou i ve verších.",
  },
  {
    question: "Jaké znaky má epická báseň, které lyrická nemá?",
    correctAnswer: "děj, postavy a zápletku",
    options: [
      "rým a pravidelný rytmus",
      "děj, postavy a zápletku",
      "verše rozdělené do slok",
      "záleží jen na autorovi",
    ],
    hints: ["Rým, rytmus i sloky najdeš u obou. Co potřebuješ navíc, aby se dalo mluvit o hrdinovi a rozuzlení?"],
    explanation: "Verše, rým i sloky mají oba druhy. Rozdíl je jen v tom, že epická báseň něco vypráví — má postavy, zápletku a rozuzlení.",
  },
  {
    question: "Jaký je žánr díla Tři mušketýři (Alexandre Dumas)?",
    correctAnswer: "historický dobrodružný román",
    options: ["epická báseň", "detektivní povídka", "historický dobrodružný román", "pohádka"],
    hints: ["Dílo má stovky stran, odehrává se ve Francii 17. století a je psané souvislými větami."],
    explanation: "Tři mušketýři jsou rozsáhlá próza zasazená do skutečné minulosti — historický román s dobrodružným dějem.",
  },
  {
    question: "Co je sci-fi (science fiction)?",
    correctAnswer: "próza o budoucnosti a technice",
    options: ["próza o dávné historii", "báseň o vesmírné krajině", "pohádka o kouzelnících", "próza o budoucnosti a technice"],
    hints: ["Anglický název doslova znamená 'vědecká fikce'. Čím se takové příběhy vysvětlují — kouzly, nebo vynálezy?"],
    explanation: "Sci-fi staví na vědě a technice, které zatím neexistují — vesmírné lodě, roboti, cestování časem. Tím se liší od pohádky, kde funguje magie.",
  },
  {
    question: "Jaký je rozdíl mezi povídkou a příběhem v básni (baladou)?",
    correctAnswer: "povídka je próza, balada báseň",
    options: ["povídka je próza, balada báseň", "balada je próza, povídka báseň", "obojí je psáno ve verších", "liší se jen svou délkou"],
    hints: ["Oba útvary vyprávějí příběh. Podívej se, jak je text na stránce zapsaný — v odstavcích, nebo v řádcích pod sebou?"],
    explanation: "Děj mají oba, liší se jen formou zápisu: povídka je psaná souvislými větami, balada ve verších. Délka nerozhoduje.",
  },
  {
    question: "Co je detektivní román?",
    correctAnswer: "próza o záhadě a jejím řešení",
    options: [
      "próza o dávné minulosti",
      "próza o záhadě a jejím řešení",
      "veršovaný příběh o hrdinovi",
      "vyprávění o kouzlech",
    ],
    hints: ["Co dělá vyšetřovatel od první do poslední stránky takové knihy?"],
    explanation: "Detektivní román staví celý děj na nevyřešené záhadě, kterou hrdina postupně rozplétá. Napětí drží právě otázka, kdo je pachatel.",
  },
  {
    question: "Co je fantasy román?",
    correctAnswer: "próza ze smyšleného světa s magií",
    options: ["próza ze skutečné minulosti", "pohádka jen pro malé děti", "próza ze smyšleného světa s magií", "veršovaný hrdinský příběh"],
    hints: ["Pán prstenů má vlastní mapu, vlastní národy i vlastní jazyky. Existuje takový svět doopravdy?"],
    explanation: "Fantasy si vytváří vlastní svět s vlastními pravidly, kde funguje magie. Od pohádky se liší rozsahem a tím, že je psaná i pro dospělé čtenáře.",
  },
  {
    question: "Co je autobiografie?",
    correctAnswer: "vyprávění autora o sobě",
    options: ["vyprávění o jiné osobě", "smyšlený životní příběh", "báseň o vlastních pocitech", "vyprávění autora o sobě"],
    hints: ["Předpona 'auto-' znamená 'sám' a 'bio-' znamená 'život'. Kdo je tedy hlavní postavou?"],
    explanation: "V autobiografii píše autor o svém vlastním životě. Kdyby psal o někom jiném, byl by to životopis (biografie).",
  },
  {
    question: "Proč patří Erbenova Kytice mezi epická díla?",
    correctAnswer: "její básně vyprávějí příběh",
    options: ["její básně vyprávějí příběh", "je psaná souvislou prózou", "obsahuje jen popisy přírody", "je určená pro divadlo"],
    hints: ["Vzpomeň si na Polednici nebo Vodníka — dozvíš se z nich, co se komu stalo?"],
    explanation: "V každé básni Kytice se něco stane — má postavy, zápletku a rozuzlení. To je znak epiky. Kdyby šlo jen o nálady a popisy, byla by to lyrika.",
  },
  {
    question: "Co je pohádkový román?",
    correctAnswer: "delší próza s pohádkovými prvky",
    options: [
      "krátká lidová pohádka",
      "delší próza s pohádkovými prvky",
      "veršovaný pohádkový příběh",
      "báseň o kouzelném světě",
    ],
    hints: ["Kouzla a nadpřirozené bytosti tu zůstávají, ale dílo má rozsah knihy. Co se tedy změnilo oproti klasické pohádce?"],
    explanation: "Pohádkový román si nechává kouzelné prvky, ale má rozsah a stavbu románu — víc postav, víc dějových linek a delší text.",
  },
  {
    question: "Co je hororová literatura?",
    correctAnswer: "žánr zaměřený na strach a napětí",
    options: ["žánr o skutečné historii", "poezie o přírodních náladách", "žánr zaměřený na strach a napětí", "vyprávění s veselým koncem"],
    hints: ["Jaký pocit má takové dílo ve čtenáři záměrně vyvolat?"],
    explanation: "Horor je stavěný tak, aby čtenáře vyděsil — pracuje s hrozbou, napětím a nadpřirozeným nebezpečím. Cíl žánru je vyvolat strach.",
  },
  {
    question: "Povídka má oproti románu obvykle:",
    correctAnswer: "méně postav a jednodušší děj",
    options: ["více postav a složitější děj", "vždy veršovanou podobu", "povinně tragický konec", "méně postav a jednodušší děj"],
    hints: ["Když má text jen pár stran, kolik osudů stihne čtenáři představit?"],
    explanation: "Krátký rozsah povídky nedovolí rozvinout mnoho postav ani vedlejších dějových linek — proto se soustředí na jednu situaci. Formu i konec má stejně volné jako román.",
  },
  {
    question: "Co je fejeton?",
    correctAnswer: "vtipný článek v novinách",
    options: ["vtipný článek v novinách", "dlouhý román o historii", "báseň otištěná v novinách", "vědecká studie v časopise"],
    hints: ["Je to krátký text, který vychází v tisku a všímá si všedních věcí s nadhledem a humorem."],
    explanation: "Fejeton je krátký novinový útvar, ve kterém autor s humorem nebo ironií komentuje běžný život. Od zprávy ho odlišuje právě osobní a vtipný tón.",
  },
  {
    question: "Co je dobrodružný román?",
    correctAnswer: "próza plná napínavých událostí",
    options: [
      "próza o všedním dni ve škole",
      "próza plná napínavých událostí",
      "báseň o dalekých krajích",
      "sbírka krátkých vtipů",
    ],
    hints: ["Co drží čtenáře u knih o pirátech, cestovatelích a objevitelích?"],
    explanation: "Dobrodružný román staví na napětí a nečekaných zvratech — cestách, pronásledování, nebezpečí. Klidné vyprávění o všedním dni by tenhle žánr nenaplnilo.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jaký je rozdíl mezi lyrikou a epikou jako literárními druhy?",
    correctAnswer: "lyrika je bez děje, epika s dějem",
    options: ["epika je bez děje, lyrika s dějem", "obojí vždy vypráví příběh", "lyrika je bez děje, epika s dějem", "liší se jen svou délkou"],
    hints: ["Obě mohou být psané ve verších i v próze. Rozhoduje něco jiného — zeptej se, jestli se v díle něco stane."],
    explanation: "Lyrika zachycuje pocity a nálady, epika vypráví, co se stalo. Forma ani délka o zařazení nerozhodují — existují i krátké epické básně.",
  },
  {
    question: "Co je drama jako literární druh?",
    correctAnswer: "dílo určené pro divadlo",
    options: ["dílo určené jen ke čtení", "báseň přednášená zpaměti", "vyprávění v próze", "dílo určené pro divadlo"],
    hints: ["Text tvoří převážně repliky postav a poznámky o tom, kdo kam přichází. Komu je takový zápis určený?"],
    explanation: "Drama je psané pro jeviště — děj se odvíjí z dialogů postav, doplněných scénickými poznámkami pro herce a režii.",
  },
  {
    question: "Co je tragédie?",
    correctAnswer: "hra se smutným koncem",
    options: ["hra se smutným koncem", "hra s veselým koncem", "báseň o smutku", "pohádka se šťastným koncem"],
    hints: ["Vzpomeň si, jak dopadnou Romeo a Julie nebo Hamlet."],
    explanation: "Tragédie je divadelní hra, kde hlavní hrdina neuspěje a zpravidla zahyne. Právě konec ji odlišuje od komedie.",
  },
  {
    question: "Co je komedie?",
    correctAnswer: "hra s veselým koncem",
    options: [
      "hra se smutným koncem",
      "hra s veselým koncem",
      "báseň plná humoru",
      "vážné vyprávění v próze",
    ],
    hints: ["Je to opak toho druhu hry, kde hrdina na konci prohraje."],
    explanation: "Komedie je divadelní hra, která diváka baví a končí dobře. Není to báseň ani próza — je to text určený k hraní na jevišti.",
  },
  {
    question: "Co je literární próza?",
    correctAnswer: "texty psané běžnými větami",
    options: ["texty psané ve verších", "texty s pravidelným rýmem", "texty psané běžnými větami", "texty určené jen k recitaci"],
    hints: ["Podívej se, jak text vypadá na stránce: pokračuje řádek za řádkem až k okraji, nebo se láme na krátké řádky pod sebou?"],
    explanation: "Próza se píše souvislými větami a odstavci, bez veršů a rýmu. Patří sem romány, povídky i novely.",
  },
  {
    question: "Co je lyrický subjekt v básni?",
    correctAnswer: "ten, kdo v básni mluví",
    options: ["vždy sám autor básně", "hlavní postava příběhu", "čtenář, který báseň čte", "ten, kdo v básni mluví"],
    hints: ["Když v básni stojí 'já', je to nutně ten člověk, který ji napsal? Zkus si představit báseň psanou z pohledu starce nebo dítěte."],
    explanation: "Lyrický subjekt je hlas, kterým báseň promlouvá. Bývá autorovi blízký, ale nemusí se s ním shodovat — básník může psát i z pohledu někoho úplně jiného.",
  },
  {
    question: "V čem se drama liší od románu?",
    correctAnswer: "je psané v dialozích",
    options: ["je psané v dialozích", "je psané ve verších", "je vždy kratší", "nemá žádné postavy"],
    hints: ["Představ si obě knihy otevřené vedle sebe. Čím je stránka divadelní hry na první pohled jiná?"],
    explanation: "V dramatu nese děj přímá řeč postav, doplněná scénickými poznámkami. Román naopak vypráví vypravěč. Verše i délka mohou být v obou případech různé.",
  },
  {
    question: "Co je sbírka básní?",
    correctAnswer: "kniha více básní jednoho autora",
    options: [
      "jedna dlouhá báseň",
      "kniha více básní jednoho autora",
      "kniha povídek",
      "výbor z románů",
    ],
    hints: ["Erbenova Kytice není jedna báseň — co je tedy jako celek?"],
    explanation: "Sbírka shromažďuje více básní do jedné knihy, obvykle spojených tématem nebo autorem. Jedna samostatná dlouhá báseň sbírka není.",
  },
  {
    question: "Co je leitmotiv v literárním díle?",
    correctAnswer: "opakující se motiv v díle",
    options: ["hlavní postava díla", "poučení na konci díla", "opakující se motiv v díle", "název kapitoly"],
    hints: ["Když se v knize znovu a znovu vrací tentýž obraz nebo věta, autor to nedělá náhodou. Jak se takovému prvku říká?"],
    explanation: "Leitmotiv je prvek, který se dílem táhne jako červená nit — obraz, věta nebo téma, jež se opakovaně vrací a spojuje jednotlivé části.",
  },
  {
    question: "Co je hlavní myšlenka literárního díla?",
    correctAnswer: "to, co chtěl autor sdělit",
    options: ["jméno hlavní postavy", "počet kapitol v knize", "místo, kde se děj odehrává", "to, co chtěl autor sdělit"],
    hints: ["Když knihu dočteš a někdo se tě zeptá, o čem to vlastně bylo, co odpovíš — kdo tam vystupoval, nebo proč to autor napsal?"],
    explanation: "Hlavní myšlenka je sdělení, kvůli kterému dílo vzniklo — třeba že přátelství je důležitější než majetek. Postavy a místo jsou jen prostředky, jak ji autor předá.",
  },
  {
    question: "Jaký žánr jsou Andersenovy pohádky?",
    correctAnswer: "autorské pohádky",
    options: ["autorské pohádky", "lidové pohádky", "epické básně", "balady ve verších"],
    hints: ["U Boženy Němcové jde často o zápis toho, co se vyprávělo mezi lidmi. U Andersena je to jinak — víme, kdo je vymyslel."],
    explanation: "Andersen si své pohádky sám vymyslel a napsal, proto jsou autorské (umělé). Lidové pohádky se naopak předávaly ústně a jejich původce neznáme.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const BASENLYRICKAAEPICKAROMANPOVIDKA: TopicMetadata[] = [
  {
    id: "g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-basen-lyricka-a-epicka-roman-povidka",
    rvpNodeId: "g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-basen-lyricka-a-epicka-roman-povidka",
    title: "Báseň lyrická a epická, román, povídka",
    studentTitle: "Literární žánry",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární pojmy a žánry",
    briefDescription: "Poznáš rozdíl mezi básní, románem a povídkou.",
    keywords: ["lyrická báseň", "epická báseň", "román", "povídka", "balada", "literární žánry"],
    goals: [
      "Rozlišit lyrickou a epickou báseň",
      "Rozlišit román a povídku",
      "Přiřadit dílo ke správnému žánru",
    ],
    boundaries: [
      "Bez podrobné literárněhistorické analýzy",
      "Neprobíráme avantgardní žánry",
      "Rozšiřující nad rámec RVP 5. ročníku: lyrický subjekt, leitmotiv, literární druhy (lyrika/epika/drama)",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Lyrická báseň = pocity (bez příběhu). Epická báseň = příběh ve verších (balada). Román = dlouhá próza. Povídka = kratší próza.",
      steps: [
        "Zjisti: je to próza nebo poezie (verše)?",
        "Poezie bez příběhu? → lyrická báseň.",
        "Poezie s příběhem? → epická báseň / balada.",
        "Próza, dlouhá? → román. Krátká? → povídka.",
      ],
      commonMistake: "Žáci si pletou baladu (epická báseň) s románem. Klíč: balada je ve verších.",
      example: "Kytice (Erben) = balady = epické básně. Tom Sawyer (Twain) = román. Sherlock Holmes (Doyle) = povídky.",
    },
  },
];
