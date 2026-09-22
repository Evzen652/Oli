/**
 * Čeština 6. ročník — Pohádka klasická (lidová) a autorská (select_one).
 *
 * Navazuje na grade-4/cjl/pohadkaPovestBajkaPovidka.ts (žánry lidové
 * slovesnosti) a grade-5/cjl/elementarniLiterarniPojmyPriRozboruTextu.ts.
 * Dovednost: rozlišit klasickou (lidovou) pohádku od autorské podle znaků
 * textu a podle toho, jak vznikla (sběratel zapsal × autor vymyslel),
 * a zdůvodnit zařazení konkrétními rysy krátké ukázky.
 *
 *  • L1 — POJMY (bez ukázek, aby byl obsah disjunktní s L3): znaky lidové
 *    pohádky (anonymní autor, ústní šíření, ustálené obraty, kouzelná čísla,
 *    černobílé postavy, vítězství dobra, neurčitý čas a místo), význam toho,
 *    že Erben/Němcová/Grimmové pohádky SBÍRALI, kdo je autor autorské
 *    pohádky (Andersen, Čapek), který začátek/konec patří lidové pohádce.
 *  • L2 — POUŽITÍ: (a) vlastní krátká ukázka (lidová/autorská/bajka/pověst)
 *    → jaký druh to je; (b) ukázka → který rys ukazuje na lidovou pohádku;
 *    (c) popis díla → jak vzniklo (autor vymyslel × sběratel zapsal).
 *  • L3 — ANALÝZA A PŘENOS: (a) ukázka se smíchanými rysy → rozhodující
 *    znak; (b) popis vzniku neznámého textu → lidová, nebo autorská a proč;
 *    (c) srovnání dvou mini-ukázek A/B → která je autorská a podle čeho;
 *    (d) proč lidová pohádka opakuje ustálené prvky (funkce, ne jen popis).
 *
 * Chybový model (errorModel, viz zadání tématu):
 *  • záměna sběratele za autora (Erben/Němcová/Grimmové = autoři → chybně);
 *  • rozhodování podle povrchního znaku (kouzlo, princezna, drak = automaticky
 *    lidová; smutný konec = není to pohádka);
 *  • záměna žánrů lidové slovesnosti (mluvící zvíře = bajka; skutečné
 *    místo/jméno = pověst);
 *  • na L3 vybrán detail nebo znak sdílený oběma druhy místo rozhodujícího.
 *
 * Determinismus: gen() nemá žádný stav mezi voláními — pool se sestavuje
 * znovu při každém volání (viz src/test/generator-determinism.test.ts).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask, ruzneUlohy, losUlohy, pick, type Distractor } from "./_shared";

// ════════════════════════════════════════════════════════════════════════
// L1 — pojmy (bez ukázek)
// ════════════════════════════════════════════════════════════════════════

interface L1Item {
  question: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

const L1_ITEMS: L1Item[] = [
  {
    question: "Co je typické pro lidovou (klasickou) pohádku?",
    correct: "Nemá jednoho známého autora, dlouho se šířila ústním vyprávěním.",
    distractors: [
      { value: "Vždycky ji napsal a podepsal jeden konkrétní spisovatel.", why: "To je znak autorské pohádky. Lidová pohádka žádného jmenovaného autora nemá." },
      { value: "Vznikla teprve nedávno a od začátku existovala jen v knize.", why: "Lidová pohádka je naopak stará a dlouho se předávala ústně, ne z knihy." },
      { value: "Musí být napsaná ve verších jako báseň.", why: "Forma verše ani rým lidovou pohádku neurčují, obvykle je to próza." },
    ],
    hints: [
      "Ptej se, jestli text má u sebe jméno konkrétního spisovatele, nebo ho lidé jen vyprávěli jeden druhému.",
      "Lidová pohádka nemá autora, kterého bys mohl vyhledat v knize — vznikala postupně tím, jak si ji lidé vyprávěli.",
    ],
    explanation: "Lidová (klasická) pohádka nemá jednoho známého autora — dlouho se šířila ústně a měnila se, jak ji lidé vyprávěli dál.",
  },
  {
    question: "Co znamená, že autorská pohádka má „autora“?",
    correct: "Konkrétní známý spisovatel si celý příběh sám vymyslel a napsal.",
    distractors: [
      { value: "Autor pohádku jen zapsal tak, jak ji předtím slyšel vyprávět od jiných lidí.", why: "To dělá sběratel, ne autor. Autor si příběh sám vymyslel." },
      { value: "Autor je člověk, který pohádku jako první přeložil do češtiny.", why: "Překlad z jiného jazyka není totéž jako vlastní vymyšlený příběh." },
      { value: "Autor je kdokoli, kdo pohádku dětem večer vypráví.", why: "Kdokoli může pohádku vyprávět dál, ale autorem je jen ten, kdo si ji sám vymyslel." },
    ],
    hints: [
      "Autor je ten, kdo příběh sám vytvořil — nikdo ho podle stejného vyprávění neopakoval před ním.",
      "U autorské pohádky vždycky víme přesné jméno spisovatele, který si celý děj vymyslel.",
    ],
    explanation: "Autorskou pohádku vymyslel a napsal konkrétní spisovatel, kterého známe jménem.",
  },
  {
    question: "Co znamená, že K. J. Erben pohádky SBÍRAL?",
    correct: "Zapisoval pohádky tak, jak je vyprávěl lid, sám si je nevymyslel.",
    distractors: [
      { value: "Vymýšlel si vlastní nové pohádky a podepisoval se pod ně.", why: "To by z něj dělalo autora. Erben ale zapisoval to, co už dávno vyprávěl lid." },
      { value: "Kupoval staré pohádkové knihy do své knihovny.", why: "Sbírání pohádek neznamená kupovat knihy, ale zapisovat lidové vyprávění." },
      { value: "Opravoval chyby v pohádkách, které napsali jiní spisovatelé.", why: "Erben pohádky nezapisoval podle cizích knih, ale podle vyprávění lidí." },
    ],
    hints: [
      "„Sbírat pohádky“ znamená chodit mezi lidi a zapisovat, co vyprávějí — ne vymýšlet nový příběh.",
      "Erben je jedním ze sběratelů: jeho zásluha je v tom, že lidové vyprávění zachránil zápisem, nevymyslel ho.",
    ],
    explanation: "K. J. Erben pohádky sbíral: zapisoval to, co už dlouho vyprávěl lid, a sám si příběhy nevymýšlel.",
  },
  {
    question: "Co znamená, že Božena Němcová pohádky SBÍRALA?",
    correct: "Zapisovala pohádky tak, jak je vyprávěl lid, sama si je nevymyslela.",
    distractors: [
      { value: "Sama si vymyslela nové pohádkové příběhy a podepsala se pod ně jako autorka.", why: "To by z ní dělalo autorku. Němcová zapisovala to, co vyprávěl lid." },
      { value: "Překládala pohádky z francouzštiny do češtiny.", why: "Sbírání neznamená překlad z cizího jazyka, ale zápis ústního vyprávění." },
      { value: "Vybírala nejhezčí pohádky z knih jiných spisovatelů.", why: "Nešlo o výběr z knih, ale o zápis přímo od lidí, kteří pohádky vyprávěli." },
    ],
    hints: [
      "Stejně jako u jiných sběratelů jde o to, že text zapsala podle vyprávění lidí, ne že by ho sama vymyslela.",
      "Božena Němcová je vedle Erbena další ze sběratelů lidových pohádek 19. století.",
    ],
    explanation: "Božena Němcová pohádky sbírala: zapisovala to, co vyprávěl lid, sama je nevymyslela.",
  },
  {
    question: "Co znamená, že bratři Grimmové pohádky SBÍRALI?",
    correct: "Zapisovali pohádky tak, jak je vyprávěl lid, sami si je nevymysleli.",
    distractors: [
      { value: "Vymysleli si vlastní nové pohádky a podepsali se pod ně.", why: "To by z nich dělalo autory. Grimmové zapisovali to, co vyprávěl lid." },
      { value: "Přeložili pohádky z latiny do němčiny.", why: "Nešlo o překlad, ale o zápis vyprávění přímo od lidí v Německu." },
      { value: "Vymalovali obrázky k pohádkám, které předtím napsal jiný spisovatel.", why: "Grimmové sbírali pohádky zápisem vyprávění, ne malováním obrázků k cizímu textu." },
    ],
    hints: [
      "Jsou to dva bratři z Německa. Ptej se, odkud se k nim příběhy dostaly — znali je lidé z jejich okolí už dávno před nimi?",
      "Postupuj stejně jako u Erbena nebo Němcové: rozliš, jestli tvůrce příběh přinesl jako vlastní novinku, nebo jen zachytil vyprávění, které se mezi lidmi předávalo už dávno před ním.",
    ],
    explanation: "Bratři Grimmové pohádky sbírali: zapisovali vyprávění, které si lidé předávali už dávno před nimi, sami si je nevymysleli.",
  },
  {
    question: "Kdo je autorem pohádek o Malé mořské víle a o Ošklivém káčátku?",
    correct: "H. Ch. Andersen — dánský spisovatel, který si příběhy sám vymyslel.",
    distractors: [
      { value: "Neznáme jeho jméno, protože jde o starou lidovou pohádku.", why: "Tyto pohádky mají známého autora — H. Ch. Andersena, nejsou anonymní lidové." },
      { value: "Karel Jaromír Erben, který je zapsal podle vyprávění lidí.", why: "Erben byl sběratel lidových pohádek. Malou mořskou vílu si vymyslel Andersen." },
      { value: "Bratři Grimmové, kteří je sebrali v Německu.", why: "Grimmové sbírali lidové pohádky, tyto konkrétní příběhy ale vymyslel Andersen." },
    ],
    hints: [
      "Rozliš dvě věci — kdo pohádku od lidí sebral a zapsal, a kdo si ji celou sám vymyslel. Tyhle dvě pohádky mají svého vymýšlejícího autora.",
      "Projdi nabídnutá jména a u každého se ptej, jestli pohádky sbíral, nebo si je vymýšlel. Sběratele postupně vyřaď — zůstane ti ten, kdo si příběhy vymyslel sám.",
    ],
    explanation: "Autorem Malé mořské víly i Ošklivého káčátka je dánský spisovatel H. Ch. Andersen.",
  },
  {
    question: "Kdo je autorem sbírky Devatero pohádek?",
    correct: "Karel Čapek — český spisovatel, který si příběhy sám vymyslel.",
    distractors: [
      { value: "Neznáme jeho jméno, protože jde o starou lidovou sbírku.", why: "Devatero pohádek má konkrétního autora — Karla Čapka, nejde o anonymní lidovou sbírku." },
      { value: "Božena Němcová, která je zapsala podle vyprávění lidí.", why: "Němcová byla sběratelka lidových pohádek. Devatero pohádek vymyslel Karel Čapek." },
      { value: "H. Ch. Andersen, dánský spisovatel.", why: "Andersen napsal jiné, vlastní pohádky. Devatero pohádek je dílo Karla Čapka." },
    ],
    hints: [
      "Jde o českého spisovatele 20. století, který je známý i jinými díly, ne jen pohádkami.",
      "Devatero pohádek je dílo s konkrétním jménem autora na obálce — takže jde o autorskou pohádku.",
    ],
    explanation: "Sbírku Devatero pohádek napsal český spisovatel Karel Čapek.",
  },
  {
    question: "Který začátek je typický pro lidovou (klasickou) pohádku?",
    correct: "„Byl jednou jeden král, který měl tři syny…“",
    distractors: [
      { value: "„V pátek ráno se Petrovi rozbil budík a celý den se mu nedařilo.“", why: "Konkrétní den v týdnu a jméno Petr patří spíš do moderního, autorského příběhu." },
      { value: "„Dne 3. května 1842 se v Praze narodil chlapec jménem Jan.“", why: "Přesné datum a skutečné místo patří spíš do pověsti nebo životopisu, ne do lidové pohádky." },
      { value: "„Tuhle historku mi minulý týden vyprávěla babička o svém sousedovi.“", why: "Odkaz na konkrétní nedávnou událost a souseda nepatří k neurčitému, dávnému světu lidové pohádky." },
    ],
    hints: [
      "Lidová pohádka začíná neurčitě — bez přesného data, bez jména skutečného města nebo ulice.",
      "Hledej začátek, který se ještě dnes používá jako ustálený obrat a nejmenuje žádné skutečné místo ani rok.",
    ],
    explanation: "„Byl jednou jeden král, který měl tři syny…“ je ustálený, neurčitý začátek typický pro lidovou pohádku.",
  },
  {
    question: "Který konec je typický pro lidovou (klasickou) pohádku?",
    correct: "„A žili spolu šťastně až do smrti.“",
    distractors: [
      { value: "„A nikdo se nikdy nedozvěděl, jak to s nimi vlastně dopadlo.“", why: "Otevřený, nejistý konec je typický spíš pro autorskou pohádku, ne pro lidovou." },
      { value: "„Vypravěč na závěr přiznal, že sám neví, jestli tomu má věřit.“", why: "Komentář vypravěče o vlastní nedůvěře patří spíš do autorského vyprávění s neobvyklým pohledem." },
      { value: "„A tím to celé skončilo — bez dalších slov.“", why: "Náhlé, strohé zakončení bez tradičního obratu nepatří k typickému konci lidové pohádky." },
    ],
    hints: [
      "Lidová pohádka končí jasně a jednoznačně, obvykle ustáleným obratem, který se opakuje v mnoha pohádkách.",
      "Hledej konec, který slibuje jasné a trvalé štěstí hlavním postavám, ne otevřenou nebo nejistou budoucnost.",
    ],
    explanation: "„A žili spolu šťastně až do smrti.“ je ustálený konec typický pro lidovou pohádku.",
  },
  {
    question: "Proč se v lidové pohádce často objevují čísla tři, sedm nebo dvanáct?",
    correct: "Jsou to kouzelná čísla — jejich opakování je jeden z ustálených znaků lidové pohádky.",
    distractors: [
      { value: "Protože si to tak vymyslel jeden konkrétní spisovatel a všichni ho pak opisovali.", why: "Kouzelná čísla nejsou nápad jednoho autora, jde o ustálený znak celé lidové tradice." },
      { value: "Protože lidová pohádka musí mít přesně tolik postav.", why: "Žádné takové pravidlo neexistuje. Kouzelné číslo se sice často objeví i u počtu postav (tři synové, dvanáct měsíčků), ale stejně tak u počtu úkolů, přání nebo dní cesty — povinný počet postav to není." },
      { value: "Protože jde o matematické úlohy schované v textu pohádky.", why: "V pohádce nejde o matematiku, ale o tradiční, symbolicky opakovaná čísla." },
    ],
    hints: [
      "Tahle čísla se v lidových pohádkách objevují znovu a znovu — u počtu úkolů, synů, dní cesty.",
      "Jde o pevně zavedenou tradiční vlastnost, podle které lidovou pohádku poznáš.",
    ],
    explanation: "Tři, sedm a dvanáct jsou kouzelná čísla — jejich opakování patří mezi ustálené znaky lidové pohádky.",
  },
  {
    question: "Jak bývají vylíčené postavy v lidové pohádce?",
    correct: "Jednoznačně dobré, nebo jednoznačně zlé, bez odstínů mezi tím.",
    distractors: [
      { value: "Vždy psychologicky složité, se skrytými pochybnostmi jako u skutečných lidí.", why: "Psychologicky složité postavy jsou typické spíš pro autorskou pohádku, ne pro lidovou." },
      { value: "Vždy beze jména, jen jako „on“ a „ona“.", why: "Postavy lidové pohádky jména mívají (Honza, Popelka, Jeníček a Mařenka), i když u některých stačí role (princezna, král). Podstatné je, že jsou jednoznačně dobré, nebo zlé." },
      { value: "Neustále se v průběhu příběhu mění z dobrých na zlé a naopak.", why: "V lidové pohádce zůstává postava po celou dobu buď dobrá, nebo zlá, nemění se sem a tam." },
    ],
    hints: [
      "V lidové pohádce hned poznáš, komu fandit — dobro a zlo se v postavách nemísí.",
      "Hledej odpověď, která mluví o tom, že postavy nejsou nijak složité nebo rozporuplné.",
    ],
    explanation: "V lidové pohádce jsou postavy jednoznačně dobré, nebo jednoznačně zlé, bez odstínů mezi tím.",
  },
  {
    question: "Co obvykle platí o čase a místě v lidové pohádce?",
    correct: "Jsou neurčité — neznámé, dávné časy a smyšlené, nejmenované místo.",
    distractors: [
      { value: "Vždy je přesně uvedený rok a název skutečného města.", why: "To je typické spíš pro pověst nebo autorský příběh se skutečnými reáliemi, ne pro lidovou pohádku." },
      { value: "Děj se vždy odehrává v současnosti, ve stejné době jako dnes.", why: "Lidová pohádka se naopak odehrává v neurčené, dávné minulosti — „kdysi dávno“." },
      { value: "Místo musí být vždy popsáno velmi podrobně, se všemi ulicemi.", why: "Lidová pohádka místo naopak nechává neurčité, bez podrobného popisu." },
    ],
    hints: [
      "Lidová pohádka nikdy neříká přesný rok ani skutečné jméno místa — je to „kdysi dávno, za devatero horami“.",
      "Neurčitost času a místa je jeden z ustálených znaků, podle kterých lidovou pohádku poznáš.",
    ],
    explanation: "Lidová pohádka má neurčitý čas („kdysi dávno“) a neurčité, smyšlené místo („za devatero horami“).",
  },
  {
    question: "Co platí o konci lidové pohádky?",
    correct: "Dobro v ní nakonec vždy zvítězí nad zlem.",
    distractors: [
      { value: "Konec bývá často smutný nebo nejistý.", why: "Smutný nebo nejistý konec je typický spíš pro autorskou pohádku, lidová pohádka obvykle končí jasným vítězstvím dobra." },
      { value: "Konec vůbec neřeší, jestli zvítězilo dobro, nebo zlo.", why: "Lidová pohádka naopak jasně ukazuje, že dobro zvítězilo — to je jeden z jejích ustálených znaků." },
      { value: "Zlá postava se na konci vždy polepší a zůstane s ostatními.", why: "Zlá postava v lidové pohádce bývá spíš potrestána nebo poražena, ne že by se prostě polepšila." },
    ],
    hints: [
      "Přemýšlej, kdo v lidové pohádce na konci vyhrává — hodná postava, nebo zlá?",
      "Jasné a jednoznačné vítězství dobra patří mezi pevně ustálené znaky lidové pohádky.",
    ],
    explanation: "V lidové pohádce dobro nakonec vždy zvítězí nad zlem — to je jeden z jejích ustálených znaků.",
  },
  {
    question: "Čím se autorská pohádka nejvíc liší od lidové v otázce vzniku?",
    correct: "Autorskou pohádku vymyslel jeden konkrétní spisovatel, kterého známe jménem.",
    distractors: [
      { value: "Autorská pohádka je vždy delší než lidová.", why: "Délka není rozhodující znak — obojí může být krátké i dlouhé." },
      { value: "Autorská pohádka se nikdy netýká kouzel ani nadpřirozených bytostí.", why: "I autorská pohádka může mít kouzla a nadpřirozené bytosti, jen je vymyslel konkrétní autor." },
      { value: "Autorská pohádka se nesmí vůbec podobat lidovým motivům.", why: "Autor může klidně navázat na lidové motivy (draka, kouzlo), pořád jde ale o jeho vlastní, vymyšlený příběh." },
    ],
    hints: [
      "Rozhoduje způsob vzniku, ne délka textu ani přítomnost kouzel.",
      "U autorské pohádky vždy umíme jmenovat konkrétního spisovatele, který si ji vymyslel — u lidové ne.",
    ],
    explanation: "Hlavní rozdíl je ve vzniku: autorskou pohádku vymyslel jeden konkrétní, jmenovaný spisovatel.",
  },
];

function ukolL1(item: L1Item): PracticeTask | null {
  return buildChoiceTask(item.question, item.correct, item.distractors, {
    hints: item.hints,
    explanation: item.explanation,
  });
}

// ════════════════════════════════════════════════════════════════════════
// L2 (a) — vlastní krátká ukázka → jaký druh to je
// ════════════════════════════════════════════════════════════════════════

type Druh = "lidová (klasická) pohádka" | "autorská pohádka" | "bajka" | "pověst";

interface UkazkaL2 {
  text: string;
  druh: "lidová (klasická) pohádka" | "autorská pohádka";
  /**
   * Konkrétní důvod z TÉHLE ukázky (vedlejší věta, malé písmeno na začátku).
   * Vysvětlení se nesmí opírat o jmenovaného spisovatele — v ukázce žádný
   * není, žák by ho v textu marně hledal.
   */
  duvod: string;
}

const UKAZKY_L2: UkazkaL2[] = [
  // ── lidové ──
  {
    druh: "lidová (klasická) pohádka",
    text: "Byl jednou jeden král, který měl tři syny. Řekl jim, že trůn zdědí ten, kdo splní tři těžké úkoly. Nejmladší syn si na cestě poradil se starým mužem u studny a všechny tři úkoly nakonec splnil.",
    duvod: "začíná ustáleným obratem „Byl jednou jeden…“, čas ani místo nejsou určené a úkoly se opakují po třech",
  },
  {
    druh: "lidová (klasická) pohádka",
    text: "Za devatero horami a devatero řekami žil v jeskyni zlý drak, který každý rok unesl jednu princeznu. Vydal se ho zabít chudý pasáček, kterému pomohl mluvící kůň. Po dlouhém boji draka přemohl a princeznu osvobodil.",
    duvod: "místo je popsané jen neurčitě („za devatero horami“) a postavy jsou jednoznačně dobré, nebo zlé",
  },
  {
    druh: "lidová (klasická) pohádka",
    text: "V jedné chaloupce na kraji lesa žila chudá vdova se třemi dcerami. Nejmladší dcera byla hodná a pracovitá, zatímco její sestry jí ze závisti ubližovaly. Za odměnu jí kouzelná bába splnila tři přání.",
    duvod: "postavy jsou jednoznačně hodné, nebo zlé, bez odstínů, čas ani místo nejsou určené a opakuje se kouzelné číslo tři",
  },
  {
    druh: "lidová (klasická) pohádka",
    text: "Byla jednou jedna princezna, která se zaklela do labutě a mohla se proměnit zpátky jen o půlnoci. Princ ji hledal po sedmero krajích, až ji jednou v úplňku poznal u lesního jezera. Vysvobodil ji a spolu pak žili šťastně až do smrti.",
    duvod: "začíná i končí ustáleným obratem („Byla jednou jedna…“, „žili šťastně až do smrti“) a čas ani místo nejsou určené",
  },
  {
    druh: "lidová (klasická) pohádka",
    text: "Chudý mlynářský synek Honza se vydal do světa hledat štěstí, protože doma neměl nic než starý kabát. Cestou třikrát pomohl zvířatům v nouzi a ta mu na oplátku pomohla přelstít zlého čaroděje. Nakonec se oženil s princeznou a stal se králem.",
    duvod: "pomoc se opakuje přesně třikrát, čas ani místo nejsou určené a hrdina má jméno ze staré tradice (Honza)",
  },
  {
    druh: "lidová (klasická) pohádka",
    text: "Kdysi dávno žil v malé vesnici kovář, který vykoval kouzelný meč. Kdo mečem třikrát mávl a řekl kouzelná slova, tomu se splnilo jedno přání. Meč nakonec získal nejmladší z bratří, protože jako jediný pomohl staré žebračce, ačkoli nevěděl, že je to zakletá víla.",
    duvod: "začíná neurčitým „kdysi dávno“, vesnice nemá jméno a opakuje se kouzelné číslo tři",
  },
  // ── autorské ──
  {
    druh: "autorská pohádka",
    text: "V samoobsluze na rohu pracoval noční brigádník Vilém, který uměl pouhým pohledem srovnat každou popadanou konzervu zpátky do regálu. Jednou večer mu z regálu spadla konzerva, která se vrátit odmítla, a Vilém s ní strávil celou noc. Vypravěč na konci poznamenal, že takovou trpělivost by s konzervou neměl nikdo z nás.",
    duvod: "odehrává se v dnešní samoobsluze a vypravěč na konci děj sám hodnotí — takové rysy lidová pohádka nemá",
  },
  {
    druh: "autorská pohádka",
    text: "Na sídlišti za garážemi žil malý drak jménem Pepin, kterého sousedé nejdřív považovali za ztraceného pejska. Pepin uměl jen slabě prskat oheň a nejvíc ze všeho miloval limonádu z automatu. Když jednou pomohl hasičům najít cestu kouřem, stal se z něj maskot celého sídliště.",
    duvod: "odehrává se na dnešním sídlišti mezi garážemi, automaty a hasiči — dnešní reálie do lidové pohádky nepatří",
  },
  {
    druh: "autorská pohádka",
    text: "Víla Karolína bydlela ve starém mobilu odhozeném na smetišti a přála si jedinou věc — plný signál. Kluk, který telefon našel, jí ho dobil powerbankou a víla mu na oplátku posílala každý den vtipnou zprávu. Jednoho dne telefon spadl do louže a víla zmizela beze stopy — nikdo neví, jestli se ještě vrátí.",
    duvod: "odehrává se u dnešního mobilu a powerbanky a končí otevřeně, bez jistoty — takový konec lidová pohádka nezná",
  },
  {
    druh: "autorská pohádka",
    text: "Pouliční lampa na rohu ulice se styděla za to, že jí bliká žárovka. Každý večer se schválně rozsvěcela až dlouho po setmění, aby si toho nikdo nevšiml. Vypravěč se přiznal, že tuhle lampu má ze všech nejradši.",
    duvod: "hlavní postavou je pouliční lampa se žárovkou a vypravěč mluví sám za sebe — obojí patří k dnešnímu autorskému vyprávění",
  },
  {
    druh: "autorská pohádka",
    text: "Malý robot Cvak žil v opravně starých hraček a snil o tom, že se stane opravdovým chlapcem. Jednoho dne pomohl opravit rozbitou loutku, která mu na oplátku vysvětlila, že být robotem taky stačí. Cvak se s tím smířil, i když si pořád tajně přál mít aspoň jeden prst navíc.",
    duvod: "vystupuje v ní robot z opravny hraček a konec je smířlivý místo vítězného — to lidová pohádka nezná",
  },
  {
    druh: "autorská pohádka",
    text: "Kluk Marek našel na půdě starý budík, který uměl mluvit, ale jen anglicky. Budík mu slíbil, že ho naučí čas, pokud mu Marek slíbí vstávat dřív. Marek souhlasil, ale budík ho pak budil tak brzo, že si to nakonec rozmyslel a budík vrátil zpátky na půdu.",
    duvod: "mluvící budík, angličtina i konec, ve kterém to hrdina vzdá, patří k dnešnímu autorskému vyprávění",
  },
];

/**
 * Distraktory pro L2(a). Zdůvodnění se opírá jen o to, co v ukázce opravdu je
 * — žádná ukázka v poolu nevyslovuje obecné ponaučení ani nejmenuje skutečné
 * místo, takže vyvrácení bajky a pověsti je u každé z nich pravdivé.
 */
function druhDistraktory(u: UkazkaL2): Distractor[] {
  const opak: Druh = u.druh === "autorská pohádka" ? "lidová (klasická) pohádka" : "autorská pohádka";
  const whyOpak = u.druh === "autorská pohádka"
    ? `Lidová pohádka se dlouho šířila ústně, má neurčitý čas i místo a ustálené obraty. Tahle ukázka je jiná: ${u.duvod}.`
    : `Autorskou pohádku vymyslel konkrétní spisovatel a bývá v ní dnešní prostředí nebo vlastní komentář vypravěče. Tahle ukázka nic takového nemá: ${u.duvod}.`;
  return [
    { value: opak, why: whyOpak },
    { value: "bajka", why: "V bajce z příběhu na konci plyne obecné ponaučení o lidských vlastnostech, vyslovené naplno. Tahle ukázka žádné takové ponaučení nevyslovuje." },
    { value: "pověst", why: "Pověst se váže ke skutečnému místu, osobě nebo události, které opravdu existovaly. V téhle ukázce žádné skutečné jméno ani místo není." },
  ];
}

function ukolDruhL2(u: UkazkaL2): PracticeTask | null {
  return buildChoiceTask(
    `Přečti si ukázku a rozhodni, o jaký druh vyprávění jde. „${u.text}“`,
    u.druh,
    druhDistraktory(u),
    {
      hints: [
        "Projdi text a hledej dvě věci: dnešní vybavení nebo místo, a to, jestli se do vyprávění vkládá vypravěč s vlastním komentářem.",
        "Text s neurčitým časem a místem a ustálenými obraty patří k jednomu druhu. Text s dnešními reáliemi nebo s vypravěčem, který děj sám hodnotí, patří k druhému. Ptej se ještě, jestli text končí vysloveným ponaučením (to by byla bajka) a jestli se váže ke skutečnému místu (to by byla pověst).",
      ],
      explanation: `Tahle ukázka je ${u.druh}: ${u.duvod}.`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L2 (b) — ukázka → který rys ukazuje na lidovou pohádku
// ════════════════════════════════════════════════════════════════════════

interface RysL2 {
  text: string;
  /** krátká odpověď (option) — nesmí být systematicky nejdelší možnost */
  option: string;
  /** plné zdůvodnění do explanation */
  vysvetleni: string;
  d1: string;
  d2: string;
  d3: string;
}

const RYSY_L2: RysL2[] = [
  {
    text: "Byl jednou jeden král, který měl tři syny. Řekl jim, že trůn zdědí ten, kdo splní tři těžké úkoly. Nejmladší syn si na cestě poradil se starým mužem u studny a všechny tři úkoly nakonec splnil.",
    option: "Úkoly se opakují přesně třikrát.",
    vysvetleni: "Úkoly se v pohádce opakují přesně třikrát — to je kouzelné číslo typické pro lidové vyprávění.",
    d1: "V příběhu vystupuje král, jako v mnoha jiných pohádkách.",
    d2: "Syn potká starého muže právě u studny.",
    d3: "Cesta za splněním úkolů vede pryč z domova.",
  },
  {
    text: "Za devatero horami a devatero řekami žil v jeskyni zlý drak, který každý rok unesl jednu princeznu. Vydal se ho zabít chudý pasáček, kterému pomohl mluvící kůň. Po dlouhém boji draka přemohl a princeznu osvobodil.",
    option: "Místo je popsáno jen neurčitě, bez skutečného jména.",
    vysvetleni: "Místo je popsáno jen neurčitě — „za devatero horami a devatero řekami“ — bez skutečného jména.",
    d1: "V příběhu vystupuje drak, podobně jako v mnoha jiných pohádkách.",
    d2: "Pasáčkovi na cestě pomáhá mluvící kůň.",
    d3: "Drak unese vždycky jen jednu princeznu za rok.",
  },
  {
    text: "V jedné chaloupce na kraji lesa žila chudá vdova se třemi dcerami. Nejmladší dcera byla hodná a pracovitá, zatímco její sestry jí ze závisti ubližovaly. Za odměnu jí kouzelná bába splnila tři přání.",
    option: "Dcera je hodná, sestry zlé, bez odstínů mezi nimi.",
    vysvetleni: "Nejmladší dcera je vylíčená jako jednoznačně hodná a sestry jednoznačně zlé, bez odstínů.",
    d1: "V příběhu vystupuje kouzelná bába, jako v mnoha jiných pohádkách.",
    d2: "Vdova bydlí v chaloupce na kraji lesa.",
    d3: "Vdova se o dcery stará sama, bez manžela.",
  },
  {
    text: "Byla jednou jedna princezna, která se zaklela do labutě a mohla se proměnit zpátky jen o půlnoci. Princ ji hledal po sedmero krajích, až ji jednou v úplňku poznal u lesního jezera. Vysvobodil ji a spolu pak žili šťastně až do smrti.",
    option: "Konec je ustálený obrat „žili šťastně až do smrti“.",
    vysvetleni: "Příběh končí ustáleným obratem „žili šťastně až do smrti“, typickým pro konec lidové pohádky.",
    d1: "V příběhu se objevuje kouzlo proměny, jako v mnoha jiných pohádkách.",
    d2: "Princ princeznu najde u lesního jezera.",
    d3: "Proměna zpátky je možná jen o půlnoci.",
  },
  {
    text: "Chudý mlynářský synek Honza se vydal do světa hledat štěstí, protože doma neměl nic než starý kabát. Cestou třikrát pomohl zvířatům v nouzi a ta mu na oplátku pomohla přelstít zlého čaroděje. Nakonec se oženil s princeznou a stal se králem.",
    option: "Honza pomáhá zvířatům přesně třikrát.",
    vysvetleni: "Honza pomáhá zvířatům přesně třikrát — opakování po třech je kouzelné číslo typické pro lidovou pohádku.",
    d1: "V příběhu vystupuje zlý čaroděj, jako v mnoha jiných pohádkách.",
    d2: "Honza doma neměl nic než starý kabát.",
    d3: "Honza se vydá na cestu do světa.",
  },
  {
    text: "Kdysi dávno žil v malé vesnici kovář, který vykoval kouzelný meč. Kdo mečem třikrát mávl a řekl kouzelná slova, tomu se splnilo jedno přání. Meč nakonec získal nejmladší z bratří, protože jako jediný pomohl staré žebračce, ačkoli nevěděl, že je to zakletá víla.",
    option: "Čas ani místo nejsou v příběhu vůbec určené.",
    vysvetleni: "Čas ani místo nejsou určené — „kdysi dávno“, žádný rok ani jméno vesnice.",
    d1: "V příběhu se objevuje kouzelný meč, jako v mnoha jiných pohádkách.",
    d2: "Meč vykoval vesnický kovář.",
    d3: "Žebračka je ve skutečnosti zakletá víla.",
  },
];

function ukolRysL2(r: RysL2): PracticeTask | null {
  return buildChoiceTask(
    `Přečti si ukázku. Který rys textu ukazuje, že jde o lidovou (klasickou) pohádku? „${r.text}“`,
    r.option,
    [
      { value: r.d1, why: "Kouzelné bytosti, draci, králové ani kouzla o zařazení nerozhodují — objevují se v lidových i v autorských pohádkách." },
      { value: r.d2, why: "Jde jen o konkrétní podrobnost téhle ukázky, ne o ustálený znak, podle kterého se lidová pohádka pozná." },
      { value: r.d3, why: "Tohle je detail děje. Ustálený znak lidové pohádky se naopak opakuje v mnoha různých pohádkách, ne jen v téhle jedné." },
    ],
    {
      hints: [
        "Hledej rys spojený s ustálenými znaky lidové pohádky: neurčitý čas a místo, kouzelné číslo, ustálený obrat, jednoznačně dobré a zlé postavy.",
        "Kouzlo, drak nebo princezna samy o sobě lidovou pohádku nerozhodují — objevují se i v autorských pohádkách. Hledej to, co je specificky ustálené a opakující se.",
      ],
      explanation: r.vysvetleni,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L2 (c) — popis díla → jak vzniklo (autor vymyslel × sběratel zapsal)
// ════════════════════════════════════════════════════════════════════════

type Puvod = "autor" | "sberatel" | "prekladatel" | "upravovatel";

const PUVOD_POPIS: Record<Puvod, string> = {
  autor: "Autor si celý příběh sám vymyslel a napsal ho jako svoje vlastní dílo.",
  sberatel: "Sběratel zapsal to, co už dlouho vyprávěl lid; sám příběh nevymyslel.",
  prekladatel: "Někdo pohádku jen přeložil z jazyka, ve kterém ji vymyslel jiný spisovatel.",
  upravovatel: "Někdo starou lidovou pohádku upravil a dopsal jí úplně nový, moderní konec.",
};

const PUVOD_WHY: Record<string, string> = {
  "autor>sberatel": "Sběratel pohádku nevymýšlí, jen zapisuje to, co už dlouho vyprávěl lid. Tenhle tvůrce ale příběh sám vymyslel.",
  "autor>prekladatel": "Tvůrce pohádku nepřekládal odjinud, vymyslel si ji sám a napsal jako svoje vlastní dílo.",
  "autor>upravovatel": "Nejde o úpravu staré pohádky s novým koncem — tvůrce si celý příběh vymyslel od začátku sám.",
  "sberatel>autor": "Sběratel si příběh sám nevymyslel, jen zapsal to, co už dlouho vyprávěl lid.",
  "sberatel>prekladatel": "Sběratel pohádku nepřekládal z jiného jazyka, zapsal ji přímo od lidí, kteří ji vyprávěli ústně.",
  "sberatel>upravovatel": "Sběratel vychází z vyprávění, které slyšel — text může jazykově uhladit, ale děj si nevymýšlí. Upravovatel naopak příběh záměrně přetváří, třeba mu dopíše nový konec.",
};

interface TvurceItem {
  popis: string;
  spravny: "autor" | "sberatel";
}

/**
 * Zadání záměrně NEobsahuje sloveso z klíče („vymyslel“, „zapsal“) — jinak by
 * úloha testovala párování slov místo pochopení rozdílu autor × sběratel.
 * Žák musí usoudit z okolností (podpis na knize × chození za vypravěči).
 */
const TVURCE: TvurceItem[] = [
  { popis: "Pod pohádkou o mořské víle, která vyměnila hlas za nohy, aby mohla žít na souši, je podepsaný H. Ch. Andersen. Takový příběh v Dánsku nikdo před ním neznal.", spravny: "autor" },
  { popis: "Karel Čapek je pod sbírkou Devatero pohádek podepsaný jako spisovatel. Její postavy ani zápletky se nikde předtím neobjevily.", spravny: "autor" },
  { popis: "Karel Jaromír Erben chodil po vesnicích s poznámkovým blokem a doma pak měl plné šuplíky příběhů, které slyšel od starých hospodářů.", spravny: "sberatel" },
  { popis: "Božena Němcová trávila dlouhé večery u lidí na venkově a poslouchala příběhy, které v kraji znal skoro každý; ty pak vyšly v její knize.", spravny: "sberatel" },
  { popis: "Bratři Grimmové měli v Kasselu stálé návštěvy: lidé z okolí k nim chodili s příběhy, které znali z dětství, a bratři si je jeden po druhém poznamenávali.", spravny: "sberatel" },
];

function ukolTvurce(t: TvurceItem): PracticeTask | null {
  const vsechny: Puvod[] = ["autor", "sberatel", "prekladatel", "upravovatel"];
  const distraktory: Distractor[] = vsechny
    .filter((p) => p !== t.spravny)
    .map((p) => ({ value: PUVOD_POPIS[p], why: PUVOD_WHY[`${t.spravny}>${p}`] }));
  return buildChoiceTask(
    `${t.popis} Jak tahle pohádka vznikla?`,
    PUVOD_POPIS[t.spravny],
    distraktory,
    {
      hints: [
        "Ptej se, odkud se děj vzal: existoval už předtím mezi lidmi, nebo ho tvůrce přinesl jako úplnou novinku?",
        "Sběratel si děj nevymýšlí, vychází z toho, co lidé vyprávěli — jazyk sice uhladit může, ale příběh ne. Autor si celý děj vytvoří sám.",
      ],
      explanation: PUVOD_POPIS[t.spravny],
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (a) — ukázka se smíchanými rysy → rozhodující znak
// ════════════════════════════════════════════════════════════════════════

interface SmisenaUkazka {
  text: string;
  /** krátká odpověď (option) — nesmí být systematicky nejdelší možnost */
  option: string;
  /** plné zdůvodnění do explanation */
  vysvetleni: string;
  d1: string;
  d2: string;
  d3: string;
}

const L3A: SmisenaUkazka[] = [
  {
    text: "Princezna Julie bydlela v paneláku ve dvanáctém patře a měla kouzelnou moc otevřít každý zamčený výtah. Jednoho dne musela třikrát pomoct sousedům uvíznutým mezi patry, než ji za to jmenovali čestnou správcovou domu. Vypravěč celou dobu žertoval, že to je nejnudnější kouzlo na světě.",
    option: "Moderní prostředí (panelák, výtah) a žertovný komentář vypravěče.",
    vysvetleni: "Rozhoduje moderní prostředí (panelák, výtah) a žertovný komentář vypravěče — takové rysy lidová pohádka nemá, proto jde o autorskou pohádku, i když se v ní objevuje princezna a číslo tři.",
    d1: "Princezna Julie je hlavní postavou příběhu, podobně jako v mnoha jiných pohádkách.",
    d2: "Julie pomáhá sousedům přesně třikrát.",
    d3: "Julie je nakonec za svůj čin odměněna, stejně jako bývá odměněn nejeden hrdina.",
  },
  {
    text: "Král Bedřich vládl v zemi, kde si mohl přát jen jednou za sedm let. Jednou si přál nový mobil s nekonečnou baterkou a celé království se mu kvůli tomu vysmívalo. Vypravěč vážně ujišťoval, že moudřejší přání už žádný král nikdy nevyslovil.",
    option: "Moderní reálie (mobil s baterkou) a ironický komentář vypravěče.",
    vysvetleni: "Rozhoduje moderní reálie (mobil s baterkou) a ironický komentář vypravěče (chválí přání, kterému se smálo celé království, takže myslí pravý opak) — takové rysy lidová pohádka nemá, proto jde o autorskou pohádku, i když se v ní objevuje král a číslo sedm.",
    d1: "Bedřich je král, podobně jako mnozí vládci ve starých lidových pohádkách.",
    d2: "Přání se váže ke kouzelnému číslu sedm.",
    d3: "Království se Bedřichovi kvůli přání vysmívá po celé zemi.",
  },
  {
    text: "Kouzelná víla žila ve staré knihovně a mohla splnit přání jen tomu, kdo přečetl přesně dvanáct knih. Nela knihy přečetla, ale místo pohádkového zámku si přála, aby její mladší bratr konečně uměl mlčet. Vypravěč se do příběhu vložil a přiznal, že tohle přání sám nikdy nepochopil.",
    option: "Vypravěč do příběhu vstupuje a mluví sám za sebe.",
    vysvetleni: "Rozhoduje vypravěč, který se do příběhu vloží a mluví sám za sebe („sám jsem to nikdy nepochopil“) — v lidové pohádce vypravěč takhle o sobě nemluví, proto jde o autorskou pohádku, i když se v ní objevuje víla a číslo dvanáct.",
    d1: "Ve vyprávění vystupuje kouzelná víla, stejně jako v mnoha lidových pohádkách.",
    d2: "Přání se váže ke kouzelnému číslu dvanáct.",
    d3: "Nelin bratr je v příběhu mladší než ona.",
  },
  {
    text: "Za sedmero horami žil drak, který střežil poklad ve staré tramvaji odstavené na kraji lesa. Rytíř ho musel třikrát obelstít, než se dostal dovnitř. Vypravěč na konci poznamenal, že takhle rozbitou tramvaj by dnes nechtěl ani sběratel starého železa.",
    option: "Moderní reálie (tramvaj, sběratel starého železa) a komentář vypravěče.",
    vysvetleni: "Rozhodují moderní reálie (tramvaj, sběratel starého železa) a vypravěčův vlastní, hodnotící komentář — takové rysy lidová pohádka nemá, proto jde o autorskou pohádku, i když se v ní objevuje drak a číslo tři.",
    d1: "V příběhu vystupuje drak, podobně jako v mnoha jiných pohádkách.",
    d2: "Rytíř draka obelstí přesně třikrát.",
    d3: "Rytíř je v příběhu hlavním a jediným hrdinou.",
  },
  {
    text: "Princ Vojtěch putoval za sedmero řekami, aby našel kouzelný lék pro nemocného otce. Cestou třikrát poprosil o radu chytrou sovu. Vypravěč ale celou dobu upozorňoval, že se mu princova umanutost vůbec nelíbí a že by měl raději zavolat lékaře.",
    option: "Neobvyklý, kritický pohled vypravěče na hrdinovo počínání.",
    vysvetleni: "Rozhoduje neobvyklý, kritický pohled vypravěče na hrdinu (a narážka na lékaře) — v lidové pohádce vypravěč hrdinu takhle nesoudí, proto jde o autorskou pohádku, i když se v ní objevuje princ a číslo tři.",
    d1: "Princ Vojtěch je v příběhu hlavní a jedinou postavou.",
    d2: "Princ poprosí sovu o radu přesně třikrát.",
    d3: "Otec je v příběhu vážně nemocný a potřebuje pomoc syna.",
  },
  {
    text: "Kouzelnice v modré zástěře uměla přeměnit cokoli v cokoli, ale jen třikrát denně. Bydlela v bytě nad pekařstvím a nejradši měnila stará kola na jízdní kola pro děti ze sídliště. Vypravěč vážným hlasem tvrdil, že tohle je nejobyčejnější povolání v celém městě.",
    option: "Moderní prostředí (byt nad pekařstvím, sídliště) a ironie vypravěče.",
    vysvetleni: "Rozhoduje moderní prostředí (byt nad pekařstvím, sídliště) a ironický tón vypravěče — takové rysy lidová pohádka nemá, proto jde o autorskou pohádku, i když se v ní objevuje kouzlo a číslo tři.",
    d1: "Kouzelnice umí kouzlit, podobně jako mnohé kouzelné postavy ve starých lidových pohádkách.",
    d2: "Kouzelnice kouzlí přesně třikrát denně.",
    d3: "Kouzelnice pomáhá dětem ze sídliště novými koly.",
  },
];

function ukolL3a(u: SmisenaUkazka): PracticeTask | null {
  return buildChoiceTask(
    `Přečti si ukázku. Který znak rozhoduje o tom, že jde o autorskou pohádku, a proč? „${u.text}“`,
    u.option,
    [
      { value: u.d1, why: "Tenhle rys se stejně dobře může objevit i v lidové pohádce, sám o sobě zařazení nerozhoduje." },
      { value: u.d2, why: "Kouzelné číslo se objevuje v lidových i autorských pohádkách, samo o sobě zařazení nerozhoduje." },
      { value: u.d3, why: "Jde jen o detail děje, ne o rozhodující rozdíl mezi lidovou a autorskou pohádkou." },
    ],
    {
      hints: [
        "Ukázka má rysy obou druhů najednou — hledej ten, který lidová pohádka nikdy nemá (dnešní reálie, nebo vypravěč, který děj sám hodnotí či mluví o sobě).",
        "Kouzelné číslo, princezna nebo drak samy o sobě nerozhodují, protože se objevují i v autorských pohádkách. Rozhoduje to, co je specificky dnešní nebo autorské — ne to, co je v příběhu jen náhodná podrobnost.",
      ],
      explanation: u.vysvetleni,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (b) — popis vzniku neznámého textu → lidová, nebo autorská, a proč
// ════════════════════════════════════════════════════════════════════════

interface NeznamyPripad {
  popis: string;
  /** krátká odpověď (option) — nesmí být systematicky nejdelší možnost */
  option: string;
  /** plné zdůvodnění do explanation */
  vysvetleni: string;
  d1: string;
  /** zpětná vazba k d1 — vlastní pro každou položku, ne přiřazená podle pořadí */
  w1: string;
  d2: string;
  w2: string;
  d3: string;
  w3: string;
}

const L3B: NeznamyPripad[] = [
  {
    popis: "Babička vyprávěla pohádku, kterou slyšela od své babičky; učitel ji ve škole zapsal přesně tak, jak ji babička vyprávěla, beze změny.",
    option: "Lidová pohádka — šířila se dlouho ústně a zapisovatel na ní nic nezměnil.",
    vysvetleni: "Jde o lidovou pohádku — vyprávění se dlouho předávalo ústně z generace na generaci a zapisovatel na něm nic nezměnil.",
    d1: "Autorská pohádka — protože ji nakonec zapsal konkrétní člověk (učitel).",
    w1: "Učitel je zapisovatel, ne autor. Kdo text zapsal, a kdo si ho vymyslel, jsou dvě různé věci — tenhle učitel na příběhu nic nezměnil.",
    d2: "Lidová pohádka — protože se v ní určitě objevuje princezna a kouzlo.",
    w2: "Závěr je správný, ale zdůvodnění ne: o princezně ani o kouzle v popisu nic není, jen si je domýšlíš. Rozhoduje způsob vzniku, ne hádaný obsah.",
    d3: "Nedá se to poznat, protože nevíme, jak babiččina babička pohádku poprvé vymyslela nebo odkud ji znala.",
    w3: "Právě to, že se původ ztrácí v řadě vypravěčů, je znakem lidové pohádky. Zařazení je tedy jasné i bez odpovědi na otázku, kdo byl úplně první.",
  },
  {
    popis: "Spisovatel převzal postavu Honzy ze staré pohádky, ale přenesl ho do dnešního velkoměsta a úplně změnil konec příběhu.",
    option: "Autorská pohádka — spisovatel vymyslel nové prostředí a nový konec.",
    vysvetleni: "Jde o autorskou pohádku — spisovatel sice použil starou lidovou postavu, ale sám vymyslel nové prostředí a nový konec příběhu.",
    d1: "Lidová pohádka — protože postava Honzy pochází z lidové tradice.",
    w1: "Převzatá postava z textu lidovou pohádku nedělá. Spisovatel si kolem Honzy vymyslel nový děj i nový konec, a to rozhoduje.",
    d2: "Autorská pohádka — protože postava Honzy je v Česku hodně známá.",
    w2: "Závěr je správný, ale zdůvodnění ne: známost postavy o vzniku textu nic neříká. Honza je známý právě z lidových pohádek — rozhoduje, že tenhle příběh kolem něj někdo nově vymyslel.",
    d3: "Nedá se to poznat, protože Honza je jen vymyšlené jméno používané v mnoha různých příbězích.",
    w3: "Poznat to jde: v popisu stojí, že spisovatel změnil prostředí i konec. To samo stačí, i když se jméno Honza objevuje v desítkách jiných příběhů.",
  },
  {
    popis: "Sběratelka zapsala pohádku od několika různých vypravěčů z různých vesnic; všechny verze si byly podobné, jen s drobnými obměnami, a ona sepsala tu nejběžnější podobu.",
    option: "Lidová pohádka — víc lidí ji nezávisle vyprávělo podobně, jde o ústní tradici.",
    vysvetleni: "Jde o lidovou pohádku — víc lidí ji nezávisle na sobě vyprávělo podobně, což ukazuje na dlouhou ústní tradici, ne na jednoho autora.",
    d1: "Autorská pohádka — sběratelka nakonec sama rozhodla, jak bude finální text vypadat.",
    w1: "Sběratelka opravdu vybírala, kterou podobu sepíše — ale děj si nevymyslela, ten znali vypravěči před ní. Výběr z hotových verzí z nikoho autora nedělá.",
    d2: "Lidová pohádka — protože se v pohádce určitě musí vyskytovat drak nebo princezna.",
    w2: "Závěr je správný, ale zdůvodnění ne: o dracích ani princeznách v popisu nic není. A žádné pravidlo, že v pohádce musí být, neexistuje.",
    d3: "Nedá se to poznat, protože různé vesnice vyprávěly pohádku pokaždé trochu jinak.",
    w3: "Drobné obměny mezi vesnicemi jsou právě důkaz ústní tradice — text se měnil tím, jak se předával dál. Zařazení tedy poznat jde.",
  },
  {
    popis: "Spisovatelka napsala příběh o víle, která žije v telefonu, a na konci nechala vílu zmizet beze stopy — nikdo neví, jestli se vrátí.",
    option: "Autorská pohádka — moderní prostředí a otevřený konec.",
    vysvetleni: "Jde o autorskou pohádku — moderní prostředí (telefon) a otevřený konec jsou znaky, které lidová pohádka obvykle nemá.",
    d1: "Lidová pohádka — protože v příběhu vystupuje kouzelná víla jako pomocnice.",
    w1: "Víla se objevuje v lidových i v autorských pohádkách — sama o sobě nerozhoduje. Tady rozhoduje telefon a otevřený konec.",
    d2: "Autorská pohádka — protože je celkově dost smutná a nešťastná.",
    w2: "Závěr je správný, ale zdůvodnění ne: nálada textu o vzniku nic neříká, smutné konce mají i některé lidové pohádky. Rozhoduje nejistý, otevřený konec a dnešní prostředí.",
    d3: "Nedá se to poznat, protože v popisu není uvedeno celé jméno spisovatelky.",
    w3: "Celé jméno k zařazení potřeba není. Stačí, že text napsala konkrétní spisovatelka a že příběh nemá za sebou žádnou ústní tradici.",
  },
  {
    popis: "Vypravěč na táboře řekl, že pohádku, kterou právě vypráví, slyšel jako malý od dědečka a neví, kdo ji vymyslel jako první.",
    option: "Lidová pohádka — nikdo neví, kdo ji vymyslel, šířila se ústně.",
    vysvetleni: "Jde o lidovou pohádku — nikdo neví, kdo ji jako první vymyslel, a předávala se ústně mezi lidmi.",
    d1: "Autorská pohádka — protože ji teď vypráví konkrétní člověk (vypravěč na táboře).",
    w1: "Ten, kdo příběh právě vypráví, není jeho autor. Vypravěč na táboře ho sám slyšel od dědečka — jen ho předává dál.",
    d2: "Lidová pohádka — protože se příběh určitě odehrává v lese u staré chaloupky.",
    w2: "Závěr je správný, ale zdůvodnění ne: o lese ani o chaloupce v popisu nic není, domýšlíš si je. Rozhoduje to, že původ příběhu nikdo nezná.",
    d3: "Nedá se to poznat, protože z krátkého popisu nevíme, o čem pohádka vlastně je.",
    w3: "K zařazení stačí to, co v popisu je: příběh se předával ústně a nikdo neví, kdo ho vymyslel. Obsah znát nepotřebuješ.",
  },
  {
    popis: "Autor v úvodu knihy napsal, že celý příběh o strašidle z plaveckého bazénu vymyslel sám a že žádný takový bazén ve skutečnosti neexistuje.",
    option: "Autorská pohádka — autor sám potvrzuje, že si příběh vymyslel.",
    vysvetleni: "Jde o autorskou pohádku — autor sám v úvodu potvrzuje, že si celý příběh vymyslel.",
    d1: "Lidová pohádka — protože strašidla obecně patří jen do lidových pohádek.",
    w1: "Strašidlo se objevuje v lidových i v autorských příbězích. Rozhoduje způsob vzniku textu, ne to, jaká bytost v něm vystupuje.",
    d2: "Autorská pohádka — protože se celý příběh odehrává v bazénu.",
    w2: "Bazén v příběhu opravdu je, ale prostředí samo nerozhoduje — rozhoduje, že autor sám přiznal, že si příběh vymyslel.",
    d3: "Nedá se to poznat, protože autor v knize svoje celé jméno neuvedl.",
    w3: "Celé jméno tu nic neřeší. Autor v úvodu přímo píše, že si příběh vymyslel — to je ta rozhodující informace.",
  },
];

function ukolL3b(n: NeznamyPripad): PracticeTask | null {
  return buildChoiceTask(
    `${n.popis} Jak bys tenhle text zařadil a proč?`,
    n.option,
    [
      { value: n.d1, why: n.w1 },
      { value: n.d2, why: n.w2 },
      { value: n.d3, why: n.w3 },
    ],
    {
      hints: [
        "Ptej se: vznikl text dlouhým ústním předáváním beze jména tvůrce, nebo ho někdo konkrétní vědomě vymyslel či zásadně přetvořil?",
        "Nezaměňuj toho, kdo text jen zapsal nebo právě vypráví, s tím, kdo si ho jako první vymyslel.",
      ],
      explanation: n.vysvetleni,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (c) — srovnání dvou mini-ukázek A a B → která je autorská a podle čeho
// ════════════════════════════════════════════════════════════════════════

interface SrovnaniAB {
  a: string;
  b: string;
  /** krátká odpověď (option) — nesmí být systematicky nejdelší možnost */
  option: string;
  /** plné zdůvodnění do explanation */
  vysvetleni: string;
  d1: string;
  /** zpětná vazba k d1 — vlastní pro každou položku, ne přiřazená podle pořadí */
  w1: string;
  d2: string;
  w2: string;
  d3: string;
  w3: string;
}

const L3C: SrovnaniAB[] = [
  {
    a: "Kdysi dávno žila v hlubokém lese chaloupka, ve které bydlela zlá čarodějnice. Kdo k ní zabloudil, už se nikdy nevrátil domů, dokud ho nezachránil statečný myslivec.",
    b: "V panelovém domě na sídlišti bydlela čarodějnice, která si místo košťete kupovala jízdenky na tramvaj. Sousedé si na ni pořád stěžovali, že jim mate navigaci v mobilu.",
    option: "Ukázka B — odehrává se v současném městském prostředí.",
    vysvetleni: "Ukázka B je autorská pohádka, protože se odehrává v současném městském prostředí (panelák, tramvaj, mobil), které lidová pohádka nemá.",
    d1: "Ukázka A, protože v ní vystupuje zlá čarodějnice v lese.",
    w1: "Čarodějnice je v obou ukázkách, takže podle ní rozhodnout nejde. Ukázka A má navíc neurčitý čas („kdysi dávno“) i místo — to je znak lidové pohádky.",
    d2: "Ukázka B, protože působí vtipněji a méně vážně než ukázka A.",
    w2: "Ukázka B opravdu je vtipnější, ale humor sám o sobě nerozhoduje — vtipná může být i lidová pohádka. Rozhoduje dnešní město: panelák, tramvaj, mobil.",
    d3: "Obě ukázky jsou lidové pohádky, protože v obou vystupuje čarodějnice.",
    w3: "Ukázky se právě liší: A má neurčitý čas i místo, B se odehrává v dnešním městě. Společná postava z nich stejný druh nedělá.",
  },
  {
    a: "Princezna se zamilovala do chudého pasáčka, ale otec král jí to zakázal. Pasáček musel splnit tři nemožné úkoly, aby si princeznu směl vzít, a nakonec se mu to podařilo.",
    b: "Princezna Ema se zamilovala do spolužáka z gymnázia, ale její přísný otec, ředitel firmy, jí to zakázal. Vypravěč s úsměvem podotkl, že takhle přísný táta by se hodil spíš do reality show.",
    option: "Ukázka B — má moderní reálie a vlastní komentář vypravěče.",
    vysvetleni: "Ukázka B je autorská pohádka, protože má moderní reálie (gymnázium, firma, reality show) a vypravěč děj sám komentuje a hodnotí.",
    d1: "Ukázka A, protože hlavní hrdinkou je zamilovaná princezna.",
    w1: "Zamilovaná princezna je v obou ukázkách, takže podle ní rozhodnout nejde. Ukázka A navíc opakuje úkoly po třech — to je znak lidové pohádky.",
    d2: "Ukázka B, protože je v ní otec vylíčen jako přísnější člověk.",
    w2: "Přísný otec je v obou ukázkách stejně a přísnost o vzniku textu nic neříká. Rozhodují dnešní reálie (gymnázium, firma, reality show) a komentář vypravěče.",
    d3: "Obě ukázky jsou autorské, protože v obou je zamilovaná princezna a přísný otec.",
    w3: "Společné postavy z ukázek stejný druh nedělají. Ukázka A má neurčitý čas i místo a opakování po třech, ukázka B dnešní reálie a vypravěčův komentář.",
  },
  {
    a: "Za sedmero horami žil rytíř, který třikrát bojoval s drakem, aby zachránil zajaté vesničany. Po vítězství ho vesničané zvolili svým ochráncem.",
    b: "Rytíř Standa jezdil na kole po sídlišti a třikrát pomohl sousedům chytit uprchlou kočku. Vypravěč nakonec dodal, že tohle je jediné hrdinství, které se mu kdy povedlo.",
    option: "Ukázka B — moderní prostředí a vlastní komentář vypravěče.",
    vysvetleni: "Ukázka B je autorská pohádka, protože moderní prostředí (kolo, sídliště) a vypravěčův vlastní hodnotící komentář ukazují na autorský původ.",
    d1: "Ukázka A, protože hlavním hrdinou je statečný rytíř.",
    w1: "Rytíř je v obou ukázkách, takže podle něj rozhodnout nejde. Ukázka A má navíc neurčité místo („za sedmero horami“) — to je znak lidové pohádky.",
    d2: "Ukázka B, protože je celkově delší a má víc podrobností než ukázka A.",
    w2: "Ukázka B opravdu je o něco delší, ale délka o vzniku textu nic neříká — lidová pohádka může být dlouhá i krátká. Rozhoduje kolo, sídliště a komentář vypravěče.",
    d3: "Obě ukázky jsou lidové pohádky, protože v obou vystupuje statečný rytíř.",
    w3: "Ukázky se právě liší: A má neurčité místo a dávný svět, B dnešní sídliště a vypravěče, který děj hodnotí. Společný hrdina z nich stejný druh nedělá.",
  },
  {
    a: "V dávných dobách žil v horách skřítek, který střežil poklad a odměňoval jen ty, kdo byli k ostatním laskaví.",
    b: "Skřítek Emil pracoval na poště a odměňoval jen ty zákazníky, kteří si pamatovali PSČ svého souseda. Vypravěč přiznal, že sám by u něj nikdy neuspěl.",
    option: "Ukázka B — moderní prostředí a osobní přiznání vypravěče.",
    vysvetleni: "Ukázka B je autorská pohádka, protože moderní prostředí (pošta, PSČ) a osobní přiznání vypravěče ukazují na autorský původ.",
    d1: "Ukázka A, protože v ní vystupuje tajemný skřítek v horách.",
    w1: "Skřítek je v obou ukázkách, takže podle něj rozhodnout nejde. Ukázka A má navíc neurčitý čas („v dávných dobách“) — to je znak lidové pohádky.",
    d2: "Ukázka B, protože je o něco delší a podrobnější než ukázka A.",
    w2: "Ukázka B opravdu je delší, ale délka o vzniku textu nic neříká. Rozhoduje pošta s PSČ a vypravěč, který mluví sám o sobě.",
    d3: "Obě ukázky jsou lidové pohádky, protože v obou vystupuje skřítek.",
    w3: "Ukázky se právě liší: A má dávný, neurčitý svět, B dnešní poštu a vypravěče, který se přiznává k vlastní zkušenosti. Společná postava z nich stejný druh nedělá.",
  },
];

function ukolL3c(s: SrovnaniAB): PracticeTask | null {
  return buildChoiceTask(
    `Přečti si dvě ukázky. Ukázka A: „${s.a}“ Ukázka B: „${s.b}“ Která z nich je autorská pohádka a podle čeho to poznáš?`,
    s.option,
    [
      { value: s.d1, why: s.w1 },
      { value: s.d2, why: s.w2 },
      { value: s.d3, why: s.w3 },
    ],
    {
      hints: [
        "Porovnej, ve které ukázce se objevuje dnešní vybavení nebo místo (sídliště, mobil, tramvaj, firma) a ve které je čas a místo neurčité.",
        "Všimni si taky, jestli se v jedné z ukázek vypravěč do děje vkládá vlastním, hodnotícím komentářem. Co mají obě ukázky společné (čarodějnice, rytíř, princezna), naopak nerozhoduje.",
      ],
      explanation: s.vysvetleni,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (d) — funkce ustálených prvků (proč, ne jen co)
// ════════════════════════════════════════════════════════════════════════

const L3D: L1Item[] = [
  {
    question: "Proč se v lidových pohádkách úkoly nebo zkoušky často opakují přesně třikrát?",
    correct: "Protože se pohádka dlouho vyprávěla nahlas z paměti a opakování po třech pomáhalo vypravěči i posluchačům si příběh snáz zapamatovat.",
    distractors: [
      { value: "Protože se takové číslo líbilo jednomu konkrétnímu spisovateli, který pohádku napsal.", why: "Lidová pohádka nemá jednoho spisovatele, který by si číslo vybral — jde o znak celé ústní tradice." },
      { value: "Protože tři úkoly stačí na to, aby byla pohádka dostatečně dlouhá a pro čtenáře zajímavá.", why: "Nejde jen o délku textu, ale o pomůcku pro zapamatování při ústním vyprávění." },
      { value: "Protože se počet opakování v jednotlivých pohádkách řídí úplnou náhodou bez jakéhokoli pravidla.", why: "Opakování po třech není náhodné, je to ustálený a pravidelně se objevující znak lidové pohádky." },
    ],
    hints: [
      "Přemýšlej, jak se příběh po dlouhou dobu šířil — nahlas, z paměti, bez zápisu — a co takovému šíření pomáhá.",
      "Opakování po třech usnadňuje zapamatování, jak vypravěči, tak posluchačům, kteří příběh poslouchají jen jednou.",
    ],
    explanation: "Opakování po třech pomáhalo lidem, kteří si pohádku předávali ústně, snáz si ji zapamatovat a znovu vyprávět dál.",
  },
  {
    question: "Proč mají lidové pohádky ustálený, opakující se začátek jako „Byl jednou jeden král…“?",
    correct: "Protože ustálený začátek upozornil posluchače, že začíná vyprávění, a vypravěči usnadnil zapamatovat si a snadno začít příběh nazpaměť.",
    distractors: [
      { value: "Protože takový začátek si jeden konkrétní autor jednou vymyslel a všichni ho pak opisovali.", why: "Lidová pohádka nemá jednoho autora — ustálený začátek vznikl postupně v ústní tradici, ne opisováním od jednoho spisovatele." },
      { value: "Protože bez tohoto začátku by pohádka nebyla dost dlouhá.", why: "Nejde o délku textu, ale o signál pro posluchače a pomůcku pro vypravěčovu paměť." },
      { value: "Protože je to jen náhodná móda vypravěčů, nemá to žádný důvod.", why: "Ustálený začátek má konkrétní funkci — signalizuje začátek vyprávění a pomáhá při ústním předávání." },
    ],
    hints: [
      "Ustálený začátek plní dvě úlohy najednou — pro posluchače i pro vypravěče, který příběh vypráví zpaměti.",
      "Zamysli se, jak by se ti vyprávělo dlouhé vyprávění nazpaměť bez pevného, snadno zapamatovatelného začátku.",
    ],
    explanation: "Ustálený začátek signalizoval posluchačům, že začíná vyprávění, a vypravěči usnadňoval zapamatovat si a snadno začít příběh, který uměl jen z paměti.",
  },
  {
    question: "Proč jsou postavy v lidové pohádce často jednoznačně dobré, nebo jednoznačně zlé, bez odstínů?",
    correct: "Protože se pohádka poslouchala nahlas a jednoznačné postavy usnadňovaly posluchačům hned pochopit, komu mají fandit, i bez možnosti si text znovu přečíst.",
    distractors: [
      { value: "Protože si to tak vymyslel jeden konkrétní spisovatel a ostatní vypravěči ho jen napodobovali.", why: "Lidová pohádka nemá jednoho autora, jednoznačné postavy jsou znak celé ústní tradice, ne nápad jednoho člověka." },
      { value: "Protože složitější postavy by byly příliš dlouhé na vyprávění.", why: "Nejde o délku popisu postavy, ale o to, aby posluchač hned pochopil, kdo je hodný a kdo zlý." },
      { value: "Protože se to v pohádkách střídá úplně náhodně, bez žádného důvodu.", why: "Jednoznačné postavy nejsou náhoda — mají konkrétní funkci při vyprávění a poslouchání nahlas." },
    ],
    hints: [
      "Přemýšlej, jak rychle si posluchač musí při poslechu ujasnit, na čí stranu se má přiklonit — nemůže se přece vrátit zpátky v textu jako při čtení.",
      "Postavy bez odstínů usnadňují sledování děje, když text jen posloucháš a nemůžeš se k němu vrátit.",
    ],
    explanation: "Jednoznačně dobré a zlé postavy usnadňovaly posluchačům hned pochopit, komu mají v příběhu fandit, i když ho jen slyšeli nahlas a nemohli se k němu vrátit.",
  },
  {
    question: "Proč lidová pohádka obvykle nekončí smutně nebo nejistě, ale jasným vítězstvím dobra?",
    correct: "Protože si posluchači takové vyprávění pamatovali a rádi předávali dál a jasný šťastný konec navíc dával naději a mravní ponaučení.",
    distractors: [
      { value: "Protože smutné konce si žádný ze sběratelů nikdy nezapsal, i kdyby existovaly.", why: "Sběratelé zapisovali to, co lid vyprávěl — šťastný konec je znakem samotné ústní tradice, ne rozhodnutí sběratele." },
      { value: "Protože šťastný konec je jednodušší na vymyšlení než smutný.", why: "Nejde o to, který konec se snáz vymýšlí, ale o to, co posluchačům dávalo naději a co si rádi předávali dál." },
      { value: "Protože je to čistě náhoda, bez žádného důvodu.", why: "Jasné vítězství dobra není náhoda, je to ustálený a opakující se znak s vlastní funkcí." },
    ],
    hints: [
      "Přemýšlej, jaký typ konce si lidé rádi pamatují a rádi vyprávějí dál svým dětem.",
      "Vítězství dobra na konci dává posluchačům naději a jasně ukazuje, jak se má člověk chovat.",
    ],
    explanation: "Jasné vítězství dobra dávalo posluchačům naději a mravní ponaučení a takové vyprávění si lidé rádi pamatovali a předávali dál.",
  },
];

function ukolL3d(item: L1Item): PracticeTask | null {
  return buildChoiceTask(item.question, item.correct, item.distractors, {
    hints: item.hints,
    explanation: item.explanation,
  });
}

// ════════════════════════════════════════════════════════════════════════
// gen()
// ════════════════════════════════════════════════════════════════════════

const POOL_L1: (() => PracticeTask | null)[] = L1_ITEMS.map((item) => () => ukolL1(item));

const POOL_L2: (() => PracticeTask | null)[] = [
  ...UKAZKY_L2.map((u) => () => ukolDruhL2(u)),
  ...RYSY_L2.map((r) => () => ukolRysL2(r)),
  ...TVURCE.map((t) => () => ukolTvurce(t)),
];

const POOL_L3: (() => PracticeTask | null)[] = [
  ...L3A.map((u) => () => ukolL3a(u)),
  ...L3B.map((n) => () => ukolL3b(n)),
  ...L3C.map((s) => () => ukolL3c(s)),
  ...L3D.map((item) => () => ukolL3d(item)),
];

/** gen() nemá žádný stav mezi voláními — pool i losování se sestaví znovu při každém volání. */
function gen(level: number): PracticeTask[] {
  const pool = level <= 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const genLx = () => pick(pool)();
  return ruzneUlohy(() => losUlohy(genLx), pool.length, pool.length * 25);
}

// ════════════════════════════════════════════════════════════════════════
// Topic
// ════════════════════════════════════════════════════════════════════════

export const POHADKA_KLASICKA_AUTORSKA: TopicMetadata[] = [
  {
    id: "g6-cjl-pohadka-klasicka-autorska-6",
    rvpNodeId: "g6-cjl-literarni-vychova-lidova-slovesnost-pohadka-klasicka-autorska",
    displayName: "Pohádka - klasická, autorská",
    title: "Pohádka - klasická, autorská",
    studentTitle: "Pohádka lidová a autorská",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Lidová slovesnost",
    briefDescription: "Poznáš, jestli pohádku vyprávěl lid, nebo ji vymyslel konkrétní autor.",
    keywords: [
      "pohádka", "lidová pohádka", "klasická pohádka", "autorská pohádka", "sběratel", "autor",
      "Erben", "Němcová", "Grimmové", "Andersen", "Karel Čapek", "lidová slovesnost",
    ],
    goals: [
      "Rozpoznat lidovou (klasickou) pohádku podle ustálených znaků a neurčitého vzniku.",
      "Rozpoznat autorskou pohádku podle jmenovaného autora a jejích znaků.",
      "Vědět, že sběratel pohádku zapsal podle vyprávění lidu, zatímco autor si ji vymyslel sám.",
      "Rozhodnout u ukázky se smíchanými znaky, který znak je pro zařazení rozhodující.",
    ],
    boundaries: [
      "Navazuje na grade-4/cjl/pohadkaPovestBajkaPovidka.ts a grade-5/cjl/elementarniLiterarniPojmyPriRozboruTextu.ts.",
      "Jen všeobecně známá a nesporná fakta o tvůrcích; sporné případy (Perrault, Fimfárum, Hauffovy pohádky) nejsou použity jako klíč.",
      "Bez psaní vlastního textu — žák jen vybírá ze čtyř možností.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Lidová (klasická) pohádka nemá jmenovaného autora, dlouho se šířila ústně a má ustálené znaky (kouzelná čísla, neurčitý čas a místo, černobílé postavy, vítězství dobra). Autorskou pohádku vymyslel konkrétní známý spisovatel a často má moderní prostředí nebo neobvyklý pohled vypravěče.",
      steps: [
        "Zjisti, jestli je u pohádky uvedené jméno konkrétního spisovatele, nebo je autor neznámý.",
        "Podívej se, jestli je čas a místo neurčité (kdysi dávno, za devatero horami), nebo jde o moderní prostředí.",
        "Hledej ustálené znaky: kouzelná čísla (tři, sedm, dvanáct), ustálený začátek nebo konec, jednoznačně dobré a zlé postavy.",
        "Nezaměňuj sběratele (zapsal, co vyprávěl lid) s autorem (příběh si sám vymyslel).",
      ],
      commonMistake: "Považovat sběratele (Erben, Němcová, Grimmové) za autory pohádek, nebo rozhodovat jen podle povrchního znaku (kouzlo, princezna, drak), který se objevuje v obou druzích pohádek.",
      example: "„Byl jednou jeden král, který měl tři syny…“ = lidová pohádka (neurčitý čas, kouzelné číslo). Pohádky H. Ch. Andersena nebo Karla Čapka = autorská pohádka (známý autor).",
    },
  },
];
