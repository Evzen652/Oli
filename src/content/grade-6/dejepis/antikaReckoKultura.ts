/**
 * Dějepis 6. ročník — Alexandr Veliký, helénismus, řecká kultura, mytologie (select_one).
 *
 * Faktické téma → banky úloh, ne šablona. Tři disjunktní banky (POOL_L1/L2/L3),
 * každá položka má vlastní znění, vlastní dvojici nápověd a vlastní vysvětlení.
 * Banky jsou PROLOŽENÉ (bohové × kultura × Alexandr), aby žádný úsek sezení
 * nebyl jen o jedné látce.
 *
 * Chybový model (každý distraktor = jedna typická chyba):
 *  • záměna řeckého a římského jména téhož boha (Neptun, Jupiter…) — jen
 *    u některých položek, a vždy tehdy, když se otázka výslovně ptá na ŘECKÉ jméno;
 *  • záměna oblastí sousedních bohů (moře × podsvětí, Arés × Athéna, posel × válka);
 *  • záměna místa her a hory bohů (Olympie × Olymp), pahorku a chrámu (Akropole × Parthenón);
 *  • záměna osob kolem Alexandra (Filip II., Sókratés, Platón; „athénský vojevůdce“);
 *  • doslovné čtení rčení a posunutí helénismu do doby Perikla nebo římské říše.
 *
 *  • L1 — zapamatování: přímá otázka → jeden pojem, bůh, osoba.
 *  • L2 — použití: popis výjevu, sloupu, stavby nebo stopy výpravy → pojem;
 *    rčení → jeho dnešní význam.
 *  • L3 — analýza a transfer: z báje urči boha, mýtus → dnešní slovo a zvyk,
 *    dnešní situace → rčení, správné použití rčení, mýtus × doložená historie
 *    (i u skutečných osob), příčina a důsledek Alexandrovy výpravy.
 *
 * Nepoužívá se jako klíč: přesný rok založení Alexandrie, počet Alexandrií,
 * sedm divů světa, trojská válka a maraton (sousední podtémata).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, type Distractor } from "./_shared";
import { ruzneUlohy } from "../fyzika/_shared";

interface Polozka {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

const RIMSKE = (jmeno: string, co: "boha" | "bohyni") =>
  `${jmeno} je římské jméno. Otázka se ptá na jméno, kterým ${co === "boha" ? "tohoto boha" : "tuto bohyni"} nazývali Řekové.`;

// ── L1 — ZAPAMATOVÁNÍ: přímá otázka → pojem ─────────────────────────────────
export const POOL_L1: Polozka[] = [
  {
    q: "Který řecký bůh vládl ostatním bohům a byl pánem nebe?",
    correct: "Zeus",
    distractors: [
      { value: "Jupiter", why: RIMSKE("Jupiter", "boha") },
      { value: "Poseidón", why: "Poseidón byl bratr nejvyššího boha, ale vládl moři, ne nebi." },
      { value: "Hádés", why: "Hádés byl také jeho bratr, vládl ale podsvětí, tedy říši mrtvých." },
    ],
    hints: [
      "Hledáš řecké jméno, ne římské. Vzpomeň si, kdo držel v ruce blesk.",
      "Tři bratři si podle bájí rozdělili svět: jeden dostal nebe, druhý moře a třetí podsvětí. Nejmocnější byl ten, který vládl nebi a metal blesky. Pozor, jedno jméno v nabídce je římské.",
    ],
    explanation: "Nejvyšším řeckým bohem byl Zeus, protože podle bájí vládl nebi i ostatním bohům. Římané ho nazývali Jupiter. Jeho bratři Poseidón a Hádés vládli moři a podsvětí.",
  },
  {
    q: "Na které hoře podle řeckých bájí sídlili nejvyšší bohové?",
    correct: "Olymp",
    distractors: [
      { value: "Parnas", why: "Parnas je hora spojená s bohem Apollónem a Múzami. Nejvyšší bohové ale sídlili jinde." },
      { value: "Akropole", why: "Akropole je pahorek v Athénách s chrámy. Bohové tam měli svatyně, ale nesídlili tam." },
      { value: "Olympie", why: "Tohle jméno patří posvátnému místu v údolí na Peloponésu, kde se konaly slavné hry. Není to hora, na které by bohové sídlili." },
    ],
    hints: [
      "Hledáš horu, ne město ani posvátné místo her.",
      "Bohové chtěli sídlit co nejblíž nebi, a tak si vybrali nejvyšší horu Řecka, jejíž vrchol se ztrácí v mracích. Dej pozor na dvě podobně znějící jména: jedno patří hoře, druhé údolí se závodištěm.",
    ],
    explanation: "Bohové sídlili na Olympu, protože je to nejvyšší hora Řecka a její vrchol býval skrytý v mracích, tedy blízko nebi. Proto se jim říká olympští bohové. Olympie je jiné místo: údolí, kde se konaly hry.",
  },
  {
    q: "Jak se jmenoval bůh, kterému při dělení světa připadlo moře?",
    correct: "Poseidón",
    distractors: [
      { value: "Hádés", why: "Hádés vládl podsvětí, říši mrtvých, ne moři. Moře patřilo jeho bratrovi." },
      { value: "Zeus", why: "Zeus vládl nebi a ostatním bohům. Moře svěřil svému bratrovi." },
      { value: "Hermés", why: "Hermés jako posel bohů cestoval po souši i po moři, ale moři nevládl." },
    ],
    hints: [
      "Vzpomeň si, který bůh drží v ruce trojzubec.",
      "Tři bratři si podle bájí rozdělili svět: nebe, moře a podsvětí. Hledáš toho, komu připadly vody, ne nebe ani temná říše pod zemí.",
    ],
    explanation: "Moři vládl Poseidón, protože si podle bájí tři bratři rozdělili svět: Zeus dostal nebe, Hádés podsvětí a Poseidón moře. Římané mu říkali Neptun.",
  },
  {
    q: "Kdo podle tradice složil básně Ilias a Odysseia?",
    correct: "Homér",
    distractors: [
      { value: "Sofoklés", why: "Sofoklés psal tragédie pro divadlo, ne dlouhé hrdinské básně." },
      { value: "Hérodotos", why: "Hérodotos byl dějepisec a psal o skutečných válkách, ne o hrdinech bájí." },
      { value: "Aristotelés", why: "Aristotelés byl filozof a vychovatel Alexandra, hrdinské básně nesložil." },
    ],
    hints: [
      "Hledáš slepého pěvce, ne dějepisce, filozofa ani autora divadelních her.",
      "Obě básně vyprávějí o hrdinech a bozích, dlouho se předávaly zpaměti a zapsaly se až později. Tradice je připisuje legendárnímu slepému básníkovi, který žil dávno před slavnými athénskými autory.",
    ],
    explanation: "Ilias a Odysseia se podle tradice připisují Homérovi, protože staří Řekové věřili, že je složil slepý pěvec tohoto jména. Sofoklés psal tragédie, Hérodotos dějiny a Aristotelés filozofii.",
  },
  {
    q: "Která řecká bohyně byla bohyní moudrosti?",
    correct: "Athéna",
    distractors: [
      { value: "Minerva", why: RIMSKE("Minerva", "bohyni") },
      { value: "Héra", why: "Héra byla manželka nejvyššího boha a ochránkyně manželství, ne bohyně moudrosti." },
      { value: "Afrodita", why: "Afrodita byla bohyně lásky a krásy, moudrost na starosti neměla." },
    ],
    hints: [
      "Tahle bohyně měla za symbol sovu. Hledáš její řecké jméno.",
      "Tahle bohyně pomáhala hrdinům radou a lstí, ne silou. Vyřaď bohyně s jinou oblastí a jedno jméno, které je římské.",
    ],
    explanation: "Bohyní moudrosti byla Athéna, protože podle bájí přinášela lidem rozum, řemesla a chytrou válečnou strategii. Jejím symbolem byla sova a Římané jí říkali Minerva.",
  },
  {
    q: "Kdo byl Alexandr Veliký?",
    correct: "Makedonský král",
    distractors: [
      { value: "Athénský vojevůdce", why: "Alexandr nepocházel z Athén. Narodil se v Makedonii, v království severně od řeckých městských států, a zdědil tam trůn." },
      { value: "Perský král", why: "Perským králem byl jeho protivník Dareios III., kterého Alexandr porazil." },
      { value: "Římský císař", why: "Římští císaři vládli až o několik set let později. Alexandr s Římem neválčil ani mu nevládl." },
    ],
    hints: [
      "Vzpomeň si, odkud Alexandr pocházel a jaký úřad zdědil po otci.",
      "Alexandr se narodil v zemi severně od řeckých městských států a po otci zdědil trůn. Nepleť si ho s Athéňany, s Peršany, se kterými válčil, ani s Římany, kteří přišli mnohem později.",
    ],
    explanation: "Alexandr Veliký byl makedonský král, protože po smrti svého otce Filipa II. zdědil roku 336 př. n. l. trůn v Makedonii. Odtud pak táhl proti Perské říši.",
  },
  {
    q: "Kdo z bohů vládl podsvětí, tedy říši mrtvých?",
    correct: "Hádés",
    distractors: [
      { value: "Poseidón", why: "Poseidón byl sice bratr vládce podsvětí, sám ale vládl moři." },
      { value: "Arés", why: "Arés byl bůh války. S mrtvými se v bitvách setkával, podsvětí mu ale nepatřilo." },
      { value: "Zeus", why: "Zeus vládl nebi a ostatním bohům. Říši mrtvých přenechal svému bratrovi." },
    ],
    hints: [
      "Hledáš boha, který nevládl ani nebi, ani moři.",
      "Vzpomeň si na tři bratry, kteří si rozdělili svět. Nebe a moře už mají své vládce, zbývá ten, komu připadla temná říše pod zemí. Bitvy, ve kterých lidé umírají, ještě neznamenají vládu nad mrtvými.",
    ],
    explanation: "Podsvětí vládl Hádés, protože mu při dělení světa mezi bratry připadla říše mrtvých. Římané ho nazývali Pluto. Arés byl bůh války.",
  },
  {
    q: "Jak se jmenovaly slavné závody, které Řekové každé čtyři roky pořádali na počest Dia?",
    correct: "Olympijské hry",
    distractors: [
      { value: "Delfské hry", why: "V Delfách se konaly hry na počest boha Apollóna, ne Dia." },
      { value: "Gladiátorské hry", why: "Zápasy gladiátorů pořádali až Římané a nebyly na počest Dia." },
      { value: "Athénské slavnosti", why: "Athény pořádaly velké slavnosti na počest své ochránkyně, bohyně moudrosti, ne Dia." },
    ],
    hints: [
      "Závody dostaly jméno podle místa, kde se konaly.",
      "Závody se pořádaly v posvátném okrsku Dia v údolí na Peloponésu, ne v Delfách ani v Athénách. Krvavé zápasy v aréně patří až Římanům.",
    ],
    explanation: "Na počest Dia se konaly olympijské hry, protože se pořádaly v Olympii, v posvátném okrsku zasvěceném Diovi. Podle nich se jmenují i dnešní olympijské hry.",
  },
  {
    q: "Který řecký bůh byl poslem bohů?",
    correct: "Hermés",
    distractors: [
      { value: "Merkur", why: RIMSKE("Merkur", "boha") },
      { value: "Arés", why: "Arés byl bůh války, zprávy mezi bohy nenosil." },
      { value: "Apollón", why: "Apollón byl bůh světla, hudby a umění, poslem nebyl." },
    ],
    hints: [
      "Posel musí být rychlý. Který bůh měl okřídlené sandály?",
      "Tenhle bůh nosil zprávy od bohů lidem a chránil také obchodníky a poutníky. Planeta nejblíž Slunci nese jeho římské jméno, ty ale hledáš řecké.",
    ],
    explanation: "Poslem bohů byl Hermés, protože byl nejrychlejší: měl okřídlené sandály. Chránil také obchodníky a poutníky. Římané mu říkali Merkur.",
  },
  {
    q: "Který filozof byl učitelem mladého Alexandra Velikého?",
    correct: "Aristotelés",
    distractors: [
      { value: "Sókratés", why: "Sókratés zemřel dávno před narozením Alexandra, učit ho tedy nemohl." },
      { value: "Platón", why: "Platón učil Alexandrova učitele, samotného Alexandra ale nevychovával." },
      { value: "Periklés", why: "Periklés nebyl filozof, ale athénský politik, a zemřel dávno před Alexandrovým narozením." },
    ],
    hints: [
      "Tři slavní filozofové jdou po sobě: učitel, jeho žák a žák toho žáka. Kdo z nich žil v Alexandrově době?",
      "Sókratés učil Platóna a Platón učil dalšího slavného filozofa. Právě ten nejmladší z trojice byl pozván na makedonský dvůr, aby vychovával králova syna. Politika, který filozofem nebyl, vyřaď.",
    ],
    explanation: "Alexandra učil Aristotelés, protože ho král Filip II. pozval na makedonský dvůr jako vychovatele svého syna. Sókratés a Platón žili dřív a Periklés byl athénský politik.",
  },
  {
    q: "Která bohyně měla na starosti lásku a krásu?",
    correct: "Afrodita",
    distractors: [
      { value: "Athéna", why: "Athéna byla bohyně moudrosti, ne lásky." },
      { value: "Artemis", why: "Artemis byla bohyně lovu a divoké přírody, ne lásky a krásy." },
      { value: "Héra", why: "Héra byla královna bohů a chránila manželství. Bohyní lásky a krásy ale nebyla." },
    ],
    hints: [
      "Podle báje se tahle bohyně zrodila z mořské pěny.",
      "Každá z bohyň v nabídce měla jinou oblast: moudrost, lov, manželství, nebo lásku. Zkus každé přiřadit tu její.",
    ],
    explanation: "Bohyní lásky a krásy byla Afrodita, protože podle bájí vzbuzovala lásku mezi bohy i lidmi. Římané ji uctívali jako Venuši.",
  },
  {
    q: "Jak se jmenuje nejslavnější chrám bohyně Athény, který stojí na pahorku nad Athénami?",
    correct: "Parthenón",
    distractors: [
      { value: "Pantheon", why: "Pantheon je chrám všech bohů v Římě, ne v Athénách." },
      { value: "Akropole", why: "Akropole je pahorek, na kterém chrám stojí, ne samotný chrám." },
      { value: "Olympie", why: "Olympie je posvátné místo her na Peloponésu, ne chrám v Athénách." },
    ],
    hints: [
      "Hledáš jméno stavby, ne jméno pahorku ani místa her.",
      "Jméno chrámu vychází z přívlastku bohyně „Panenská“. Pozor na podobně znějící chrám všech bohů, ten ale stojí v Římě.",
    ],
    explanation: "Nejslavnějším chrámem Athény je Parthenón, protože byl postaven přímo pro ni na Akropoli v době, kdy Athény vedl Periklés. Akropole je pahorek pod ním a Pantheon stojí v Římě.",
  },
  {
    q: "Který řecký bůh byl bohem války?",
    correct: "Arés",
    distractors: [
      { value: "Mars", why: RIMSKE("Mars", "boha") },
      { value: "Athéna", why: "Athéna měla na starosti moudrost a chytrou válečnou strategii. Bohem krutého boje byl někdo jiný." },
      { value: "Hermés", why: "Hermés byl posel bohů a ochránce obchodníků, válce nevládl." },
    ],
    hints: [
      "Ptáme se na boha krutého boje, ne na bohyni válečné chytrosti.",
      "Planeta Mars nese římské jméno tohoto boha. Řekové ho neměli příliš rádi, protože miloval boj a krveprolití. Najdi jeho řecké jméno a nenech se splést bohyní, která válčila rozumem.",
    ],
    explanation: "Bohem války byl Arés, protože zosobňoval divoký boj a krveprolití. Athéna byla bohyní moudrosti a válečné strategie. Římané tohoto boha nazývali Mars.",
  },
  {
    q: "Kdo byl otcem Alexandra Velikého a ovládl řecké městské státy ještě před ním?",
    correct: "Filip II.",
    distractors: [
      { value: "Dareios III.", why: "Dareios III. byl perský král, kterého porazil až Alexandr. Řecko neovládl." },
      { value: "Periklés", why: "Periklés byl athénský politik, který žil mnohem dřív. Makedonským králem nebyl." },
      { value: "Solón", why: "Solón byl athénský zákonodárce ze starší doby, ne makedonský král." },
    ],
    hints: [
      "Hledáš krále, po kterém Alexandr zdědil trůn i vycvičené vojsko.",
      "Alexandrův otec vládl v Makedonii a Řeky porazil dřív, než jeho syn vytáhl na východ. Athénští státníci ani perský protivník makedonský trůn nedrželi.",
    ],
    explanation: "Řecké městské státy ovládl Filip II., protože vybudoval silné makedonské vojsko a Řeky porazil. Jeho syn Alexandr pak zdědil hotovou moc a mohl táhnout proti Persii.",
  },
  {
    q: "Jak se jmenoval bůh ohně a kovářství?",
    correct: "Héfaistos",
    distractors: [
      { value: "Arés", why: "Arés zbraně v boji používal, ale neukoval je. Byl to bůh války." },
      { value: "Prométheus", why: "Prométheus byl titán, který podle báje ukradl bohům oheň pro lidi. Bohem kovářství ale nebyl." },
      { value: "Zeus", why: "Zeus metal ohnivé blesky, kovářem ale nebyl. Vládl nebi a ostatním bohům." },
    ],
    hints: [
      "Hledáš boha, který pracoval v kovárně u ohně.",
      "Tento bůh koval zbraně a šperky pro ostatní bohy. Podle jeho římského jména se dnes říká ohnivým horám. Nenech se splést titánem, který oheň jen ukradl.",
    ],
    explanation: "Bohem ohně a kovářství byl Héfaistos, protože podle bájí koval v kovárně u ohně zbraně pro bohy. Římané mu říkali Vulkán, odtud je i slovo vulkán.",
  },
  {
    q: "Kdo byl královnou bohů a ochránkyní manželství?",
    correct: "Héra",
    distractors: [
      { value: "Athéna", why: "Athéna byla dcera nejvyššího boha a bohyně moudrosti, ne jeho manželka." },
      { value: "Afrodita", why: "Afrodita byla bohyně lásky a krásy, manželství ale nechránila." },
      { value: "Artemis", why: "Artemis byla bohyně lovu a sama se nikdy nevdala." },
    ],
    hints: [
      "Královna bohů stála po boku vládce nebe jako jeho manželka.",
      "Láska a manželská věrnost nejsou totéž. Hledáš bohyni, která hlídala věrnost v manželství, ne tu, která vzbuzovala lásku.",
    ],
    explanation: "Královnou bohů byla Héra, protože byla manželkou nejvyššího boha a podle bájí chránila manželství. Římané ji nazývali Juno.",
  },
];

// ── L2 — POUŽITÍ: popis výjevu, sloupu, stavby, stopy výpravy; rčení → význam ─
const RADY = ["Dórský řád", "Iónský řád", "Korintský řád", "Egyptský lotosový sloup"];
const DRUHY_HER = { tragedie: "Tragédie", komedie: "Komedie" };

export const POOL_L2: Polozka[] = [
  {
    q: "Na řecké váze je vousatý bůh s trojzubcem v ruce, kolem něj vlny a delfíni. Kterého řeckého boha výjev ukazuje?",
    correct: "Poseidón",
    distractors: [
      { value: "Zeus", why: "Zeus se zobrazuje s bleskem a orlem, trojzubec nenosil." },
      { value: "Hádés", why: "Hádés sedí v temném podsvětí s trojhlavým psem, vlny ani delfíny u sebe nemá." },
      { value: "Neptun", why: "Neptun je římské jméno. Výjev je na řecké váze a otázka chce řecké jméno." },
    ],
    hints: [
      "Podívej se na znaky u postavy: trojzubec, vlny a delfíni. Kterému prostředí bůh vládne?",
      "Každý bůh má svůj poznávací předmět: blesk patří nebi, trojhlavý pes podsvětí a trojzubec vodám. Najdi toho, kdo vládl vodám, a vyber jeho řecké jméno, ne římské.",
    ],
    explanation: "Na váze je Poseidón, protože trojzubec, vlny a delfíni patří k bohu moře. Zeus má blesk, Hádés vládne podsvětí a Neptun je jen římské jméno.",
  },
  {
    q: "Sloup řeckého chrámu stojí přímo na podlaze bez patky a nahoře má jednoduchou hlavici bez ozdob, podobnou nízkému polštáři. Který sloupový řád to je?",
    correct: RADY[0],
    distractors: [
      { value: RADY[1], why: "Iónský sloup má na hlavici dva stočené závity (voluty), ne holý polštář." },
      { value: RADY[2], why: "Korintská hlavice je bohatě zdobená listy akantu, tady je hlavice bez ozdob." },
      { value: RADY[3], why: "Egyptský sloup má hlavici tvarovanou jako květ nebo pupen lotosu. Tady je hlavice hladká a sloup stojí v řeckém chrámu." },
    ],
    hints: [
      "Všimni si hlavice: je hladká, bez závitů i bez listů. Který řád je nejprostší?",
      "Řecké sloupové řády se liší hlavně hlavicí. Jeden má závity jako šnečí ulita, druhý listy akantu a třetí je nejstarší a nejjednodušší, bez jakékoli ozdoby. Druhý rozlišovací znak je patka: nejprostší řád ji nemá.",
    ],
    explanation: "Je to dórský řád, protože dórský sloup nemá patku a jeho hlavice je prostá jako polštář. Iónský i korintský sloup stojí na patce, iónský má na hlavici závity a korintský listy akantu.",
  },
  {
    q: "V divadelní hře se hrdina snaží uniknout osudu, který mu určili bohové, ale nakonec zahyne a hra končí smutně. Jaký druh hry to je?",
    correct: DRUHY_HER.tragedie,
    distractors: [
      { value: DRUHY_HER.komedie, why: "Komedie končí vesele a diváky rozesmává, tady ale hra končí smrtí hrdiny." },
      { value: "Pantomima", why: "V pantomimě herci nemluví a vše ukazují jen pohybem. Tady jde o smutný příběh o osudu." },
      { value: "Opera", why: "Opera, ve které se celý děj zpívá, vznikla až mnohem později, v novověku." },
    ],
    hints: [
      "Rozhodující je konec hry: smutný, nebo veselý?",
      "Řecké divadlo mělo dva hlavní druhy her. Jeden rozesmával a zesměšňoval, druhý ukazoval utrpení hrdiny a jeho pád. Vyřaď také hru beze slov a zpívanou hru z mnohem pozdější doby.",
    ],
    explanation: "Je to tragédie, protože řecká tragédie končí nešťastně a ukazuje, jak hrdina marně bojuje s osudem. Veselý druh hry končí naopak dobře.",
  },
  {
    q: "Co dnes znamená rčení Achillova pata?",
    correct: "Slabé místo jinak silného člověka",
    distractors: [
      { value: "Zraněná pata po sportovním úrazu", why: "To je doslovné čtení. Rčení nemluví o skutečném zranění, ale o slabině v přeneseném smyslu." },
      { value: "Marná, stále se opakující námaha", why: "Achilleus žádnou nekonečnou práci nedělal. Byl to hrdina, kterého šlo zranit jen na jediném místě." },
      { value: "Zdroj mnoha nečekaných potíží", why: "Achilleovi se nevyrojily potíže. Příběh je o tom, že byl nezranitelný všude kromě jednoho místa." },
    ],
    hints: [
      "Rčení se používá v přeneseném významu, ne o skutečné noze.",
      "Hrdina z mýtu byl nezranitelný všude kromě jediného místa na těle a právě tam ho zasáhl šíp. Co tedy rčení říká o člověku, který je jinak velmi silný? Doslovné čtení vyřaď.",
    ],
    explanation: "Achillova pata znamená slabé místo jinak silného člověka nebo věci, protože hrdina Achilleus byl podle mýtu nezranitelný všude kromě paty.",
  },
  {
    q: "Nejslavnější město, které Alexandr Veliký založil a pojmenoval po sobě, stojí u ústí řeky, jejíž záplavy přinášely úrodné bahno. Ve které zemi leží?",
    correct: "V Egyptě",
    distractors: [
      { value: "V Řecku", why: "Alexandrie neleží v Řecku. Alexandr ji založil až během výpravy daleko za mořem." },
      { value: "V Makedonii", why: "Makedonie byla Alexandrova vlast, ale nejslavnější Alexandrie vznikla až na výpravě v Africe." },
      { value: "V Persii", why: "Alexandr zakládal města i v Persii, nejslavnější Alexandrie ale leží u ústí Nilu v Africe." },
    ],
    hints: [
      "Řeka, jejíž záplavy přinášely úrodné bahno, ti připomene jednu starověkou zemi v Africe.",
      "Vzpomeň si na učivo o nejstarších státech u řek. Která řeka se každý rok rozlévala a hnojila pole? Město u jejího ústí patří do stejné země. Vlast Alexandra ani Řecko to nejsou.",
    ],
    explanation: "Nejslavnější Alexandrie leží v Egyptě, protože ji Alexandr založil u ústí Nilu, když Egypt ovládl. Stala se centrem helénistické vzdělanosti.",
  },
  {
    q: "Na minci je bohyně s přilbou na hlavě a vedle ní sedí sova. Kterou řeckou bohyni mince zobrazuje?",
    correct: "Athéna",
    distractors: [
      { value: "Afrodita", why: "Afrodita, bohyně lásky, se zobrazuje bez zbroje, třeba s holubicí nebo mušlí." },
      { value: "Héra", why: "Héra nosí korunu a žezlo jako královna bohů, přilbu a sovu ne." },
      { value: "Minerva", why: "Minerva je římské jméno. Mince je řecká a otázka chce řecké jméno." },
    ],
    hints: [
      "Přilba znamená boj, sova znamená moudrost. Která bohyně spojuje obojí?",
      "Sova byla u Řeků symbolem moudrosti a athénské mince ji nesly. Najdi bohyni, která uměla válčit rozumem a byla ochránkyní Athén, a vyber její řecké jméno.",
    ],
    explanation: "Na minci je Athéna, protože přilba patří bohyni válečné strategie a sova byla symbolem její moudrosti. Athény ji měly za ochránkyni, proto ji dávaly na mince.",
  },
  {
    q: "Hlavice sloupu řeckého chrámu je po stranách stočená do dvou závitů (volut), které připomínají ulitu šneka. Který sloupový řád to je?",
    correct: RADY[1],
    distractors: [
      { value: RADY[0], why: "Dórská hlavice je prostá jako polštář, závity nemá." },
      { value: RADY[2], why: "Korintská hlavice nese listy akantu, ne dva závity." },
      { value: RADY[3], why: "Egyptská hlavice napodobuje květ lotosu, stočené závity nemá. Popis navíc patří sloupu řeckého chrámu." },
    ],
    hints: [
      "Hledej řád, který má na hlavici spirály. Nejprostší ani nejzdobnější to není.",
      "Seřaď si řecké řády od nejprostšího po nejzdobnější: hladký polštář, stočené závity, listy akantu. Popis sedí na prostřední stupeň. Květ na hlavici k řeckým řádům nepatří.",
    ],
    explanation: "Je to iónský řád, protože iónská hlavice má dva stočené závity (voluty). Dórská hlavice je hladká a korintská nese listy akantu.",
  },
  {
    q: "Ve svahu kopce jsou do půlkruhu vytesaná kamenná sedadla, dole je kruhová plocha pro sbor a za ní budova, před kterou hráli herci. Co je to za stavbu?",
    correct: "Divadlo",
    distractors: [
      { value: "Stadion", why: "Stadion byl dlouhá rovná dráha pro běžce, ne půlkruh s místem pro herce." },
      { value: "Agora", why: "Agora bylo náměstí a tržiště uprostřed města, sedadla ve svahu nemělo." },
      { value: "Amfiteátr", why: "Amfiteátr stavěli až Římané pro zápasy gladiátorů a je uzavřený do oválu, ne otevřený půlkruh ve svahu." },
    ],
    hints: [
      "Kdo vystupuje před sedícími diváky: sportovci, obchodníci, nebo herci?",
      "Sedadla do půlkruhu byla postavena tak, aby všichni diváci dobře viděli i slyšeli, co se dole odehrává. Vyřaď dráhu pro běžce, tržiště a oválnou římskou stavbu pro zápasy.",
    ],
    explanation: "Je to řecké divadlo, protože sedadla ve svahu do půlkruhu sloužila divákům, kruhová plocha dole (orchestra) sloužila sboru a herci hráli před budovou skéné. Stadion sloužil závodům a amfiteátr stavěli až Římané.",
  },
  {
    q: "Co dnes znamená rčení sisyfovská práce?",
    correct: "Marná, stále se opakující námaha",
    distractors: [
      { value: "Těžká fyzická práce s kameny", why: "To je doslovné čtení. Nejde o práci s kameny, ale o úsilí, které nikdy nevede k cíli." },
      { value: "Slabé místo jinak silného člověka", why: "Sisyfos netrpěl slabým místem. Jeho trest spočíval v tom, že jeho práce nikdy neskončila." },
      { value: "Trápení z něčeho blízkého, ale nedosažitelného", why: "Sisyfos nestál před ničím, na co by nedosáhl. Pořád znovu pracoval a výsledek mu vždy zmizel." },
    ],
    hints: [
      "Nejde o skutečné kameny. Co se stalo s balvanem pokaždé těsně pod vrcholem?",
      "Sisyfos musel balvan valit znovu a znovu, protože se mu vždy skutálel dolů. Zeptej se, jestli ta práce měla někdy konec a jestli k něčemu vedla. Doslovné čtení rčení vyřaď.",
    ],
    explanation: "Sisyfovská práce znamená marnou, stále se opakující námahu, protože Sisyfos podle mýtu věčně valil do kopce balvan, který se mu pokaždé skutálel zpět.",
  },
  {
    q: "Alexandr vytáhl s vojskem na východ, v bitvách porazil krále Dareia III. a zmocnil se jeho obrovské říše. Která říše to byla?",
    correct: "Perská říše",
    distractors: [
      { value: "Římská říše", why: "Římská říše vznikla až později a Alexandr s Římany nebojoval." },
      { value: "Asyrská říše", why: "Asyrská říše zanikla dávno před Alexandrem, Dareios nebyl asyrský král." },
      { value: "Babylonská říše", why: "Babylon v té době patřil pod Dareiovu vládu, samostatná Babylonská říše už neexistovala." },
    ],
    hints: [
      "Dareios III. byl král mocné říše na východ od Řecka, se kterou Řekové válčili už dřív.",
      "S touto říší válčili už předkové Alexandrových současníků, o několik generací dřív. Alexandr ji dobyl celou. Vyřaď říše, které v jeho době už neexistovaly nebo ještě nevznikly.",
    ],
    explanation: "Dareios III. vládl Perské říši, a protože ho Alexandr v bitvách porazil, perská moc padla a její území připadlo Makedoncům.",
  },
  {
    q: "Na malbě je mladý bůh s okřídlenými sandály a v ruce drží hůl ovinutou dvěma hady. Kterého řeckého boha malba ukazuje?",
    correct: "Hermés",
    distractors: [
      { value: "Arés", why: "Arés se zobrazuje ve zbroji s kopím a štítem, křídla na nohou nemá." },
      { value: "Apollón", why: "Apollón nosí luk nebo lyru, okřídlené sandály ne." },
      { value: "Merkur", why: "Merkur je římské jméno. Otázka chce řecké jméno." },
    ],
    hints: [
      "Křídla na nohou prozrazují, že bůh musel být hodně rychlý. Kdo rychlost potřeboval?",
      "Bůh s okřídlenými sandály nosil vzkazy mezi bohy a lidmi. Vyřaď boha ve zbroji a boha s lyrou a dej pozor na římské jméno.",
    ],
    explanation: "Na malbě je Hermés, protože okřídlené sandály a hůl ovinutá hady jsou znaky posla bohů. Arés nosí zbroj, Apollón lyru a Merkur je římské jméno.",
  },
  {
    q: "Hlavice sloupu řeckého chrámu vypadá jako košík obalený vytesanými listy rostliny akantu. Který sloupový řád to je?",
    correct: RADY[2],
    distractors: [
      { value: RADY[0], why: "Dórská hlavice je hladká a bez ozdob, listy na ní nejsou." },
      { value: RADY[1], why: "Iónská hlavice má dva stočené závity, listy akantu ne." },
      { value: RADY[3], why: "Egyptská hlavice napodobuje květ lotosu nebo papyru. Listy akantu patří řeckému řádu a popis mluví o řeckém chrámu." },
    ],
    hints: [
      "Listy na hlavici znamenají nejbohatší výzdobu. Který řád je nejzdobnější?",
      "Seřaď si tři řecké řády od nejprostšího po nejzdobnější: hladký polštář, stočené závity, a nakonec bohatá výzdoba z listů. Popis sedí na poslední stupeň. Květ lotosu je znak jiné, neřecké stavby.",
    ],
    explanation: "Je to korintský řád, protože korintská hlavice je obalená listy akantu. Je nejmladší a nejzdobnější ze tří řeckých řádů.",
  },
  {
    q: "Diváci se nahlas smějí, protože herci v legračních maskách zesměšňují známé athénské politiky. Jaký druh hry sledují?",
    correct: DRUHY_HER.komedie,
    distractors: [
      { value: DRUHY_HER.tragedie, why: "Tragédie končí smutně a diváky dojímá, ne rozesmává." },
      { value: "Pantomima", why: "V pantomimě herci nemluví, a zesměšnit politiky slovy by tedy nemohli." },
      { value: "Opera", why: "Opera vznikla až v novověku, řecké divadlo ji neznalo." },
    ],
    hints: [
      "Smích diváků je hlavní vodítko. Který druh hry chce diváky pobavit?",
      "Řečtí autoři veselých her si rádi dělali legraci z mocných lidí svého města a diváci je za to milovali. Vyřaď smutný druh hry, hru beze slov a zpívanou hru z pozdější doby.",
    ],
    explanation: "Je to komedie, protože řecká komedie diváky rozesmávala a často zesměšňovala skutečné politiky. Smutný druh hry končil neštěstím hrdiny.",
  },
  {
    q: "Co dnes znamená rčení Tantalova muka?",
    correct: "Trápení z něčeho blízkého, ale nedosažitelného",
    distractors: [
      { value: "Bolest z těžkých ran utržených v boji", why: "To je doslovné čtení. Tantalos netrpěl ranami, ale tím, že nemohl dosáhnout na vodu a ovoce." },
      { value: "Slabé místo jinak silného člověka nebo věci", why: "Tantalos neměl slabé místo. Trápil se tím, co měl těsně před sebou." },
      { value: "Zdroj mnoha nečekaných potíží najednou", why: "Tantalovi se nevyrojila spousta potíží. Jeho trest byl jeden a pořád stejný." },
    ],
    hints: [
      "Vzpomeň si, co měl Tantalos v podsvětí těsně před sebou a proč na to nedosáhl.",
      "Tantalos stál ve vodě pod ovocným stromem, ale voda i větve před ním vždy ustoupily. Netrpěl tedy zraněním, trpěl něčím jiným. Jaký pocit to v člověku vyvolá? Doslovné čtení vyřaď.",
    ],
    explanation: "Tantalova muka znamenají trápení z něčeho blízkého, ale nedosažitelného, protože Tantalos měl podle mýtu vodu i ovoce na dosah, a přesto na ně nedosáhl.",
  },
  {
    q: "Alexandrovo vojsko táhlo přes Persii stále dál na východ, až vyčerpaní vojáci odmítli jít dál. Ke které řece na východním okraji výpravy došlo?",
    correct: "K Indu",
    distractors: [
      { value: "K Nilu", why: "Nil teče v Egyptě, na západ od Persie, ne na východ." },
      { value: "K Eufratu", why: "Eufrat Alexandr překročil už cestou do nitra Persie. Na východě došel mnohem dál." },
      { value: "K Tibeře", why: "Tibera protéká Římem v Itálii, tam Alexandr nikdy nebyl." },
    ],
    hints: [
      "Vojsko šlo z Makedonie na východ. Najdi řeku, která leží za Persií, ne před ní.",
      "Seřaď řeky z nabídky od západu k východu: Itálie, Egypt, Mezopotámie a dál. Egypt i Mezopotámii měl Alexandr za sebou, v Itálii nikdy nebyl. Hledáš tu nejvýchodnější.",
    ],
    explanation: "Alexandr došel až k Indu, protože po dobytí Perské říše pokračoval na východ až na práh Indie. Tam vyčerpaní vojáci odmítli jít dál a výprava se obrátila zpět.",
  },
  {
    q: "Na reliéfu sedí na trůnu vousatý bůh, v ruce drží blesk a u nohou mu stojí orel. Kterého řeckého boha reliéf zobrazuje?",
    correct: "Zeus",
    distractors: [
      { value: "Poseidón", why: "Poseidón drží trojzubec, blesk ani orla nemá." },
      { value: "Hádés", why: "Hádés vládne podsvětí a u nohou mu leží trojhlavý pes, ne orel." },
      { value: "Jupiter", why: "Jupiter je římské jméno. Reliéf je řecký a otázka chce řecké jméno." },
    ],
    hints: [
      "Blesk přichází z nebe. Kdo z bratrů vládl nebi?",
      "Orel létá nejvýš ze všech ptáků a blesk metá jen nejmocnější z bohů. Vyřaď boha s trojzubcem, boha s trojhlavým psem a římské jméno.",
    ],
    explanation: "Na reliéfu je Zeus, protože blesk a orel jsou znaky vládce nebe a nejvyššího boha. Poseidón má trojzubec, Hádés psa Kerbera a Jupiter je římské jméno.",
  },
  {
    q: "Na malbě sedí přísný bůh na trůnu v temné říši pod zemí a u nohou mu leží trojhlavý pes Kerberos. Kterého řeckého boha malba ukazuje?",
    correct: "Hádés",
    distractors: [
      { value: "Poseidón", why: "Poseidón vládl moři a drží trojzubec. Pod zemí nesídlil." },
      { value: "Arés", why: "Arés je bůh války ve zbroji, trojhlavého psa nemá." },
      { value: "Pluto", why: "Pluto je římské jméno. Otázka chce řecké jméno." },
    ],
    hints: [
      "Trojhlavý pes hlídal vchod do říše mrtvých. Kdo tam vládl?",
      "Kerberos nepouštěl duše zemřelých zpátky mezi živé. Najdi boha, kterému při dělení světa připadla říše pod zemí, a vyber jeho řecké jméno.",
    ],
    explanation: "Na malbě je Hádés, protože trojhlavý pes Kerberos hlídal podsvětí, kterému tento bůh vládl. Pluto je jeho římské jméno.",
  },
  {
    q: "Co dnes znamená, když někdo otevře Pandořinu skříňku?",
    correct: "Spustí řadu nečekaných potíží",
    distractors: [
      { value: "Najde krabici plnou vzácných darů", why: "To je doslovné čtení. V mýtu nádoba skrývala zla, ne dary, a rčení nemluví o skutečné krabici." },
      { value: "Objeví slabé místo svého soupeře", why: "Pandora u nikoho slabé místo nehledala. Otevřela nádobu a ven vylétlo, co bylo uvnitř." },
      { value: "Pustí se do marné a nekonečné práce", why: "Pandora žádnou nekonečnou práci nedělala. Stačilo jedno otevření a následky se rozletěly do světa." },
    ],
    hints: [
      "Vzpomeň si, co vylétlo z nádoby, kterou Pandora otevřela.",
      "Pandora ze zvědavosti otevřela nádobu od bohů a do světa se rozletěla všechna zla a nemoci. Co se tedy stane, když někdo udělá něco podobného dnes? Doslovné čtení vyřaď.",
    ],
    explanation: "Otevřít Pandořinu skříňku znamená spustit řadu nečekaných potíží, protože podle mýtu Pandora otevřela nádobu a vypustila do světa všechna zla.",
  },
  {
    q: "Helénistické město u moře mělo slavnou knihovnu a vysoký maják u přístavu a úřady v něm psaly řecky. Které město to bylo?",
    correct: "Alexandrie",
    distractors: [
      { value: "Athény", why: "Athény byly centrem klasického Řecka, slavný maják ani velkou královskou knihovnu neměly." },
      { value: "Babylon", why: "V Babylonu Alexandr zemřel, ale město nestálo u moře a slavný maják nemělo." },
      { value: "Konstantinopol", why: "Konstantinopol založil římský císař až o mnoho století později." },
    ],
    hints: [
      "Hledáš město nové helénistické doby, ne staré centrum klasického Řecka ani Mezopotámie.",
      "Po Alexandrově výpravě vznikla nová města, kde se mísila řecká a východní kultura. Nejslavnější z nich stálo u ústí Nilu a jeho knihovnu navštěvovali učenci z celého světa. Vyřaď město založené až Římany.",
    ],
    explanation: "Je to Alexandrie v Egyptě, protože právě tam stála slavná knihovna i maják a jako helénistické město používala řečtinu. Babylon u moře nestál a Konstantinopol vznikla mnohem později.",
  },
  {
    q: "Na váze pracuje v kovárně u ohně bůh s kladivem a kleštěmi a kove zbraně pro ostatní bohy. Kterého řeckého boha výjev ukazuje?",
    correct: "Héfaistos",
    distractors: [
      { value: "Arés", why: "Arés zbraně v boji používá, ale nekove je. Zobrazuje se ve zbroji." },
      { value: "Prométheus", why: "Prométheus oheň bohům ukradl a dal ho lidem, ale zbraně pro bohy nekoval." },
      { value: "Vulkán", why: "Vulkán je římské jméno. Otázka chce řecké jméno." },
    ],
    hints: [
      "Kladivo, kleště a kovárna patří k řemeslu. Který bůh byl řemeslník?",
      "Vyřaď boha, který zbraně jen používal v boji, a titána, který oheň ukradl. Zbude bůh ohně a kovářů. Pozor, jeho římské jméno dnes označuje ohnivou horu.",
    ],
    explanation: "Na váze je Héfaistos, protože kladivo, kleště a kovárna jsou znaky boha ohně a kovářství. Arés zbraně jen používá a Vulkán je římské jméno.",
  },
  {
    q: "Na obraze vystupuje z mořské pěny na lastuře krásná bohyně. Kterou řeckou bohyni obraz podle báje ukazuje?",
    correct: "Afrodita",
    distractors: [
      { value: "Athéna", why: "Athéna se podle báje zrodila v plné zbroji z hlavy svého otce, ne z moře." },
      { value: "Artemis", why: "Artemis byla bohyně lovu a zobrazuje se s lukem, ne na lastuře." },
      { value: "Venuše", why: "Venuše je římské jméno. Otázka chce řecké jméno." },
    ],
    hints: [
      "Zrození z moře a krása. Která bohyně měla krásu na starosti?",
      "Podle báje se tato bohyně zrodila z mořské pěny u břehů Kypru. Vyřaď bohyni zrozenou ve zbroji a bohyni s lukem, pak vyber řecké jméno místo římského.",
    ],
    explanation: "Na obraze je Afrodita, protože podle báje se bohyně lásky a krásy zrodila z mořské pěny. Římané ji nazývali Venuše.",
  },
];

// ── L3 — ANALÝZA a TRANSFER: báje → bůh, mýtus → dnešek, rčení v situaci, ────
//        mýtus × historie, příčina a důsledek ────────────────────────────────
const RCENI = ["Achillova pata", "Pandořina skříňka", "Sisyfovská práce", "Tantalova muka"];

export const POOL_L3: Polozka[] = [
  {
    q: "V báji Odysseus oslepí Kyklopa, syna jednoho z bohů. Rozzlobený otec mu pak posílá bouře a vlny a nedovolí mu doplout domů. Který bůh to je?",
    correct: "Poseidón",
    distractors: [
      { value: "Zeus", why: "Zeus vládl nebi a blesky. Vlny a plavba po vodě ale patřily jeho bratrovi a Kyklop nebyl Diův syn." },
      { value: "Hádés", why: "Hádés vládl podsvětí a z říše mrtvých vlny na lodě neposílal." },
      { value: "Arés", why: "Arés byl bůh války. Nad plavbou lodí moc neměl." },
    ],
    hints: [
      "Kde všude se Odysseus trápí: na souši, nebo na vodě? Kdo tomu prostředí vládne?",
      "Kdo chce někomu bránit v plavbě, musí mít moc nad vodou. Najdi boha, kterému při dělení světa mezi bratry připadlo právě to prostředí, kde Odysseus bloudí.",
    ],
    explanation: "Je to Poseidón, protože Kyklop Polyfémos byl jeho syn a jako vládce moře mohl Odysseovi posílat bouře a bránit mu v plavbě domů.",
  },
  {
    q: "Brankář chytí skoro každou střelu, jen nízké míče k levé tyči mu pravidelně propadnou. Které rčení podle řeckých mýtů to vystihuje?",
    correct: RCENI[0],
    distractors: [
      { value: RCENI[1], why: "Brankáři se nevyrojila spousta nových potíží najednou. Chybuje pořád na jednom místě." },
      { value: RCENI[2], why: "Brankář nedělá marnou práci pořád dokola, většinu střel přece chytí." },
      { value: RCENI[3], why: "Brankář netouží po něčem, co má na dosah a nemůže získat. Jde o jeho slabinu." },
    ],
    hints: [
      "Brankář je jinak skvělý a má jen jedno zranitelné místo. Který mýtický hrdina na tom byl stejně?",
      "Vzpomeň si na hrdinu, kterého matka ponořila do zázračné řeky, aby byl nezranitelný. Místo, za které ho držela, zůstalo suché. Rčení podle něj označuje jedinou slabinu silného člověka.",
    ],
    explanation: "Hodí se Achillova pata, protože tak říkáme jedinému slabému místu jinak silného člověka. Podle mýtu byl hrdina Achilleus nezranitelný všude kromě paty.",
  },
  {
    q: "Proč se po Alexandrových výbojích mluvilo řecky od Egypta až po Persii?",
    correct: "Protože zakládal města a usazoval v nich Řeky a Makedonce",
    distractors: [
      { value: "Protože tam lidé mluvili řecky už dávno před jeho příchodem", why: "Před Alexandrem se v Egyptě a Persii mluvilo egyptsky a persky. Řečtina se tam rozšířila až s jeho výpravou." },
      { value: "Protože pod trestem smrti zakázal všechny ostatní jazyky", why: "Takový zákaz nevydal. Místní jazyky dál žily, řečtina k nim přibyla jako společný jazyk úřadů a obchodu." },
      { value: "Protože řečtinu do těch zemí přinesli až římští vojáci", why: "Římané ovládli východ až mnohem později a řečtinu tam už našli." },
    ],
    hints: [
      "Zeptej se, kdo po Alexandrově výpravě v dobytých zemích žil a vládl.",
      "Jazyk se šíří s lidmi, kteří ho používají. Rozmysli, koho Alexandr v dobytých zemích nechal a kde se usadili. Vyřaď možnosti, které posouvají událost do jiné doby nebo přehánějí.",
    ],
    explanation: "Řečtina se rozšířila, protože Alexandr v dobytých zemích zakládal města a usazoval v nich Řeky a Makedonce. Řečtina se stala jazykem úřadů, obchodu a vzdělanosti a místní ji přejímali.",
  },
  {
    q: "Athéňané razili na své stříbrné mince sovu. Proč si vybrali právě tohoto ptáka?",
    correct: "Protože sova patřila bohyni, která chránila město",
    distractors: [
      { value: "Protože sova byla posvátným ptákem nejvyššího boha Dia", why: "Nejvyššímu bohu patřil orel. Sova byla znakem jiného božstva." },
      { value: "Protože sova byla ptákem bohyně lásky Afrodity", why: "Bohyni lásky patřila holubice. Sova byla znakem moudrosti." },
      { value: "Protože Athéňané uctívali sovy jako bohy", why: "Uctívání zvířat jako bohů znáš z Egypta. Řekové sovu za boha neměli, byla jen znakem jednoho božstva." },
    ],
    hints: [
      "Každý bůh měl své posvátné zvíře. Komu patřila sova a proč by na tom Athéňanům záleželo?",
      "Orel patřil vládci nebe a holubice bohyni lásky. Sova byla znakem moudrosti. Rozmysli, která bohyně moudrosti měla k tomuto městu zvláštní vztah.",
    ],
    explanation: "Athéňané dávali na mince sovu, protože byla symbolem bohyně Athény, ochránkyně jejich města. Mince se sovou tak každému ukazovala, odkud pochází.",
  },
  {
    q: "Který z výroků popisuje historicky doloženou událost, a ne příběh z řeckých bájí?",
    correct: "Alexandr Veliký porazil perského krále Dareia III.",
    distractors: [
      { value: "Alexandr Veliký byl synem boha Dia, a ne krále Filipa", why: "To je legenda, kterou o Alexandrovi vyprávěli jeho obdivovatelé. Bůh jako otec patří do bájí, jeho skutečným otcem byl makedonský král." },
      { value: "Prométheus ukradl bohům oheň a dal ho lidem", why: "To je mýtus o titánovi Prométheovi, ne skutečná událost doložená prameny." },
      { value: "Alexandr Veliký porazil v bitvě Julia Caesara", why: "Caesar žil víc než dvě stě let po Alexandrovi, v bitvě se tedy nikdy nesetkali." },
    ],
    hints: [
      "U každého výroku se ptej: jednají v něm jen lidé, nebo i bohové? A mohli se ti lidé vůbec potkat?",
      "Skutečná osoba ve výroku ještě nezaručuje, že jde o historii: o slavných lidech se vyprávěly i legendy s bohy. Zkontroluj také, jestli osoby žily ve stejné době.",
    ],
    explanation: "Historicky doložené je vítězství Alexandra nad perským králem Dareiem III., protože o něm píší antičtí dějepisci a dokládá ho i pád Perské říše. Alexandr jako Diův syn je legenda, Prométheus postava bájí a Caesar žil o víc než dvě stě let později.",
  },
  {
    q: "Podle báje titán nesl na ramenou celou nebeskou klenbu. Jeho jméno dnes nese kniha map, kterou používáš v zeměpise. Jak se ta kniha jmenuje?",
    correct: "Atlas",
    distractors: [
      { value: "Glóbus", why: "Glóbus je model Země ve tvaru koule, ne kniha. Jméno má z latinského slova pro kouli, ne po titánovi." },
      { value: "Mapa", why: "Mapa je jeden list, ne kniha map. Jméno pochází z latiny, ne z řeckých bájí." },
      { value: "Kompas", why: "Kompas je přístroj, který ukazuje světové strany. Není to kniha a po titánovi se nejmenuje." },
    ],
    hints: [
      "Dnešní slovo zdědilo jméno přímo po postavě z báje. Jak se jmenoval titán, který držel nebe?",
      "Vzpomeň si na obrázky obra, který drží na zádech nebeskou kouli. Jeho jméno se v češtině nezměnilo a označuje knihu, ne přístroj ani model.",
    ],
    explanation: "Kniha map se jmenuje atlas, protože podle báje titán Atlas nesl na ramenou nebeskou klenbu a jeho postava s koulí na zádech se kreslila na obálky sbírek map.",
  },
  {
    q: "Uklízeč zametá chodník, ale vítr na něj vždy hned nafouká nové listí, a tak začíná pořád znovu. Které rčení podle řeckých mýtů to vystihuje?",
    correct: RCENI[2],
    distractors: [
      { value: RCENI[0], why: "Uklízeč nemá jedno slabé místo. Jeho práce se prostě pořád vrací na začátek." },
      { value: RCENI[1], why: "Nevyrojila se spousta nových a různých potíží. Pořád dokola se opakuje tatáž práce." },
      { value: RCENI[3], why: "Uklízeč nečeká na nic nedosažitelného. Pracuje, a výsledek mu pokaždé zmizí." },
    ],
    hints: [
      "Úsilí, které nikdy nekončí a pořád se vrací na začátek. Kdo v mýtu dělal něco podobného?",
      "Vzpomeň si na krále, kterého bohové potrestali: musel valit do kopce balvan, který se těsně pod vrcholem vždycky skutálel dolů. Rčení podle něj označuje marnou námahu.",
    ],
    explanation: "Hodí se sisyfovská práce, protože označuje marnou a stále se opakující námahu. Sisyfos v podsvětí valil balvan do kopce a ten se mu vždy skutálel zpět.",
  },
  {
    q: "Učenec žije kolem roku 250 př. n. l. v Egyptě, píše knihy řecky a pracuje v knihovně, kterou založil makedonský král. Do kterého období to patří?",
    correct: "Do helénismu",
    distractors: [
      { value: "Do klasického Řecka", why: "V klasické době ještě Egypt nepatřil pod vládu makedonských králů. To přišlo až po Alexandrově výpravě." },
      { value: "Do doby římské říše", why: "Římané ovládli Egypt až o víc než dvě stě let později. Kolem roku 250 př. n. l. tam vládli makedonští králové." },
      { value: "Do doby pyramid", why: "Pyramidy v Gíze se stavěly víc než dva tisíce let předtím, za vlády faraonů, ne makedonských králů." },
    ],
    hints: [
      "Hledej stopy Alexandrovy výpravy: řecký jazyk a makedonský král v cizí zemi.",
      "Makedonští králové vládli v Egyptě až po Alexandrově smrti, kdy si jeho říši rozdělili vojevůdci, a dřív, než přišli Římané. Řečtina se tehdy stala jazykem učenců. Do jaké doby tedy popis patří?",
    ],
    explanation: "Popis patří do helénismu, protože po Alexandrově smrti vládli v Egyptě makedonští králové (Ptolemaiovci), založili v Alexandrii knihovnu a řečtina byla jazykem vzdělanců. Římané Egypt ovládli až později.",
  },
  {
    q: "Před hrami v Olympii se vyhlašoval posvátný mír, aby sportovci a diváci mohli bezpečně dorazit. Proč ho dodržovaly i městské státy, které spolu válčily?",
    correct: "Protože hry patřily Diovi a porušit mír by ho urazilo",
    distractors: [
      { value: "Protože jim to přikázal perský král Dareios", why: "Perský král řeckým městským státům nevládl a o hry v Olympii se nestaral." },
      { value: "Protože vítěz her získal vládu nad všemi městskými státy", why: "Vítěz dostal věnec z olivových větví a slávu, vládu nad Řeckem ale ne." },
      { value: "Protože hry hlídali římští vojáci", why: "Hry byly řecké a Římané je v té době nepořádali ani nehlídali." },
    ],
    hints: [
      "Pro Řeky nebyly hry jen sport. Komu byly zasvěcené?",
      "Kdo porušil posvátný mír, neurazil jen soupeře. Rozmysli, koho ještě by rozhněval, když závody byly součástí náboženského svátku.",
    ],
    explanation: "Posvátný mír se dodržoval, protože hry v Olympii byly svátkem na počest Dia a porušit mír znamenalo urazit boha. Za porušení navíc hrozila pokuta a zákaz účasti na hrách.",
  },
  {
    q: "Podle kterého výroku poznáš, že jde o mýtus, a ne o doloženou historii?",
    correct: "Athéna darovala Athéňanům první olivovník",
    distractors: [
      { value: "Athéňané postavili bohyni Athéně chrám Parthenón", why: "Tady jednají lidé, ne bohyně. Chrám opravdu postavili Athéňané a stojí dodnes." },
      { value: "Řekové pořádali v Olympii hry na počest Dia", why: "Hry pořádali skuteční lidé a zprávy o vítězích se dochovaly. To, že byly na počest boha, z nich mýtus nedělá." },
      { value: "Alexandr Veliký založil v Egyptě město Alexandrii", why: "Založení Alexandrie je doložená událost a město stojí dodnes." },
    ],
    hints: [
      "U každého výroku se ptej, kdo v něm jedná: lidé, nebo sám bůh?",
      "Zmínka o bohu ještě neznamená mýtus. Lidé bohy uctívali a stavěli jim chrámy, a to je doložené. Mýtus je příběh, ve kterém bůh sám něco udělá.",
    ],
    explanation: "Mýtus poznáš podle výroku o daru olivovníku, protože v něm jedná sama bohyně, a to žádný pramen doložit nemůže. Chrám pro Athénu, hry na počest Dia i založení Alexandrie jsou činy skutečných lidí a zůstaly po nich stavby a zprávy.",
  },
  {
    q: "Hladový turista stojí před výlohou plnou jídla, ale obchod je zamčený a nikde nikdo. Které rčení podle řeckých mýtů to vystihuje?",
    correct: RCENI[3],
    distractors: [
      { value: RCENI[0], why: "Turista nemá žádné slabé místo. Trápí ho, že jídlo vidí a nemůže na ně." },
      { value: RCENI[1], why: "Nevyrojilo se mnoho potíží najednou. Jde o jednu věc, která je na dosah." },
      { value: RCENI[2], why: "Turista nedělá žádnou marnou práci, jen nemůže dosáhnout na jídlo." },
    ],
    hints: [
      "Jídlo je na dosah, a přesto se k němu nedá dostat. Kdo v mýtu trpěl stejně?",
      "Vzpomeň si na krále, který v podsvětí stál ve vodě pod stromem s ovocem: když se chtěl napít, voda ustoupila, a když sáhl po ovoci, větev uhnula. Rčení podle něj označuje trápení, kdy je cíl blízko, a přesto nedosažitelný.",
    ],
    explanation: "Hodí se Tantalova muka, protože označují trápení, kdy je vytoužená věc na dosah, ale nedá se jí dosáhnout. Tantalos v podsvětí nedosáhl na vodu ani na ovoce.",
  },
  {
    q: "Proč se době po Alexandrově smrti říká helénismus?",
    correct: "Protože se řecká kultura rozšířila a mísila s východní",
    distractors: [
      { value: "Protože Athénám v té době vládl slavný politik Periklés", why: "Periklés vedl Athény v klasické době, dávno před Alexandrem." },
      { value: "Protože se tehdy poprvé konaly olympijské hry v Olympii", why: "Hry v Olympii se konaly už stovky let předtím. Název doby s nimi nesouvisí." },
      { value: "Protože Řekové převzali perský jazyk a perské zvyky", why: "Bylo to naopak: řečtina se šířila na východ. Některé východní zvyky Řekové přejímali, ale svůj jazyk si nechali." },
    ],
    hints: [
      "Slovo helénismus pochází od jména, kterým Řekové nazývali sami sebe: Helénové.",
      "Název doby prozrazuje, čí kultura v ní hrála hlavní roli. Rozmysli, co se s ní stalo po Alexandrově výpravě na východ. Vyřaď možnosti, které patří do starší doby nebo obracejí směr šíření.",
    ],
    explanation: "Helénismus se jmenuje podle Helénů, jak si říkali Řekové, protože po Alexandrovi se řecká kultura rozšířila od Egypta po Indii a mísila se s kulturou východních národů.",
  },
  {
    q: "Ve které větě je rčení Achillova pata použité správně?",
    correct: "Počítá skvěle, jen zlomky jsou jeho Achillova pata",
    distractors: [
      { value: "Spadl z kola a teď ho bolí Achillova pata", why: "Tady jde o skutečnou bolest nohy. Rčení se ale používá v přeneseném smyslu, o slabině jinak silného člověka." },
      { value: "Uklízí pořád dokola, to je jeho Achillova pata", why: "Úklid, který nikdy nekončí, není slabé místo. Pro marnou práci se hodí jiné rčení." },
      { value: "Jeho poznámka spustila hádku, to byla Achillova pata", why: "Poznámka, ze které vzešla spousta potíží, není slabé místo. Na takovou situaci se hodí jiné rčení." },
    ],
    hints: [
      "Rčení nemluví o skutečném těle. Ve které větě jde o jedinou slabinu někoho, komu se jinak daří?",
      "Achilleus byl nezranitelný všude kromě jednoho místa. U každé věty se zeptej: popisuje někoho, kdo je jinak silný a má jen jednu slabinu?",
    ],
    explanation: "Správně je rčení použité ve větě o zlomcích, protože Achillova pata znamená jediné slabé místo jinak silného člověka: počítání mu jde, zlomky ne.",
  },
  {
    q: "Třída začne řešit jednu drobnou hádku a z ní se najednou vyrojí stížnosti, urážky a další a další problémy. Které rčení podle řeckých mýtů to vystihuje?",
    correct: RCENI[1],
    distractors: [
      { value: RCENI[0], why: "Nejde o jedno slabé místo. Problémů naopak pořád přibývá." },
      { value: RCENI[2], why: "Třída nedělá tutéž práci pořád dokola. Z jedné hádky vznikají nové potíže." },
      { value: RCENI[3], why: "Nikdo tu netouží po něčem na dosah. Potíže se valí jedna za druhou." },
    ],
    hints: [
      "Z jedné maličkosti se najednou vyvalí spousta potíží. Který mýtus vypráví o něčem podobném?",
      "Vzpomeň si na první ženu z mýtu, která ze zvědavosti otevřela nádobu od bohů, a ven vylétla všechna zla světa. Rčení podle ní označuje věc, ze které se vyrojí spousta nečekaných potíží.",
    ],
    explanation: "Hodí se Pandořina skříňka, protože tak říkáme něčemu, z čeho se vyrojí mnoho nečekaných potíží. Podle mýtu Pandora otevřela nádobu a vypustila do světa všechna zla.",
  },
  {
    q: "Proč se Alexandrova obrovská říše po jeho smrti rychle rozpadla?",
    correct: "Protože neměl dospělého nástupce a vojevůdci se o ni přeli",
    distractors: [
      { value: "Protože ji hned po jeho smrti znovu dobyli perští králové", why: "Perská říše už byla poražená. O Alexandrovo dědictví se přeli jeho vlastní generálové." },
      { value: "Protože ji ještě za života spravedlivě rozdělil mezi syny", why: "Alexandr zemřel mladý a nečekaně a dospělé syny neměl. Říši předem nikomu nerozdělil." },
      { value: "Protože ji hned po jeho smrti dobyla římská vojska", why: "Římané ovládli helénistické státy až mnohem později. Říše se rozpadla zevnitř." },
    ],
    hints: [
      "Zeptej se, kdo měl po Alexandrově smrti převzít vládu a jestli na to byl připravený.",
      "Alexandr zemřel v Babylonu nečekaně a ještě mladý. Co se stane s velkou říší, když panovník náhle zemře a nemá připraveného dědice? Kdo má v takové chvíli moc?",
    ],
    explanation: "Říše se rozpadla, protože Alexandr nezanechal dospělého nástupce. Jeho vojevůdci, kterým se říká diadochové, si ji rozdělili a vznikly z ní helénistické státy, například Egypt Ptolemaiovců.",
  },
  {
    q: "Čím se doba helénismu nejvíc liší od doby klasického Řecka?",
    correct: "Místo malých městských států vládli králové velkých říší",
    distractors: [
      { value: "Řecko vedly Athény a na Akropoli se stavěl Parthenón", why: "To je klasická doba za Perikla, tedy před Alexandrem. Helénismus přišel až po něm." },
      { value: "Řekové žili jen v malých, zcela samostatných městských státech", why: "Samostatné městské státy patří klasické době. V helénismu nad nimi vládli mocní panovníci." },
      { value: "Řečtina zanikla a všude se začalo mluvit latinsky", why: "Řečtina se v helénismu naopak rozšířila. Latina se na východě nikdy nestala hlavním jazykem." },
    ],
    hints: [
      "Porovnej, kdo vládl: malé obce, nebo mocní panovníci? A kde se mluvilo řecky?",
      "Klasické Řecko tvořily samostatné městské státy jako Athény a Sparta. Po Alexandrovi vznikly státy jeho vojevůdců. Vyřaď popisy, které patří do starší doby, i ten, který obrací šíření řečtiny.",
    ],
    explanation: "Helénismus se liší hlavně tím, že místo samostatných městských států vládli králové velkých říší, protože si Alexandrovo dobyté území rozdělili jeho vojevůdci. Řecká kultura se přitom mísila s východní.",
  },
  {
    q: "Který výrok je doložená historie, a ne mýtus?",
    correct: "Alexandr Veliký zemřel roku 323 př. n. l. v Babylonu",
    distractors: [
      { value: "Perseus usekl hlavu Medúse, která měla místo vlasů hady", why: "To je báje o hrdinovi Perseovi. Medúsa s hady ve vlasech je mýtická bytost." },
      { value: "Orfeus sestoupil do podsvětí, aby přivedl zpět svou ženu", why: "To je mýtus o pěvci Orfeovi. Cestu živého člověka do podsvětí žádný pramen nedokládá." },
      { value: "Alexandr Veliký padl v bitvě s římskými legiemi", why: "Alexandr s Římany nikdy nebojoval a v bitvě nepadl. Zemřel nečekaně, když se vrátil z výpravy." },
    ],
    hints: [
      "Hledej výrok bez nadpřirozených bytostí a zázraků, ve kterém nic neodporuje době.",
      "Hadi místo vlasů nebo cesta živého člověka do podsvětí prozrazují báji. U výroku o skutečném člověku ověř, jestli sedí s tím, s kým ve své době válčil. Římané se na východ dostali až mnohem později.",
    ],
    explanation: "Doložená historie je Alexandrova smrt roku 323 př. n. l. v Babylonu, protože ji zaznamenali antičtí dějepisci. Perseus a Orfeus jsou postavy mýtů a s Římany Alexandr nikdy nebojoval.",
  },
];

// ── Generátor ───────────────────────────────────────────────────────────────
const vytvor = (p: Polozka): PracticeTask =>
  choice(p.q, p.correct, p.distractors, { hints: p.hints, explanation: p.explanation });

/** Deterministicky projde celou banku úrovně — každá položka dá jednu úlohu. */
function zBanky(pool: Polozka[]): PracticeTask[] {
  let i = 0;
  return ruzneUlohy(() => vytvor(pool[i++ % pool.length]), pool.length, pool.length);
}

function gen(level: number): PracticeTask[] {
  if (level <= 1) return zBanky(POOL_L1);
  if (level === 2) return zBanky(POOL_L2);
  return zBanky(POOL_L3);
}

// ── Topic ───────────────────────────────────────────────────────────────────
export const ANTIKA_RECKO_KULTURA: TopicMetadata[] = [
  {
    id: "g6-dej-antika-recko-kultura-6",
    rvpNodeId: "g6-dejepis-starovek-antika-recko-alexandr-veliky-helenismus-recka-kultura-mytologie",
    displayName: "Alexandr Veliký a řecká kultura",
    title: "Alexandr Veliký, helénismus, řecká kultura, mytologie",
    studentTitle: "Alexandr Veliký a řečtí bohové",
    subject: "dejepis",
    category: "Starověk",
    topic: "Antika - Řecko",
    briefDescription: "Poznáš řecké bohy, divadlo, sloupy a víš, co přinesla Alexandrova výprava.",
    keywords: [
      "Řecko", "řečtí bohové", "mytologie", "Olymp", "Zeus", "Athéna", "Alexandr Veliký",
      "helénismus", "Alexandrie", "sloupové řády", "divadlo", "tragédie", "komedie", "Achillova pata",
    ],
    goals: [
      "Přiřadit řeckým bohům jejich oblast a poznávací znaky a odlišit je od římských jmen.",
      "Poznat sloupové řády, řecké divadlo a stopy Alexandrovy výpravy z popisu.",
      "Vysvětlit, proč se řecká kultura po Alexandrovi rozšířila a čím je helénismus jiný než klasické Řecko.",
    ],
    boundaries: [
      "Jen fakta, na kterých se shodují učebnice 6. ročníku; Homér jen „podle tradice“.",
      "Bez přesného roku založení Alexandrie, sedmi divů světa, trojské války a maratonu.",
      "Rčení z mýtů jen čtyři běžná: Achillova pata, Pandořina skříňka, sisyfovská práce, Tantalova muka.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Každý řecký bůh má svou oblast a poznávací předmět (blesk, trojzubec, sova). Pozor na římská jména. Helénismus je doba PO Alexandrovi, kdy se řecká kultura mísila s východní.",
      steps: [
        "Najdi v popisu poznávací znak (předmět, hlavici sloupu, konec hry).",
        "Vyřaď římská jména a pojmy z jiné doby.",
        "U „proč“ hledej příčinu, která opravdu vysvětluje, ne jen popisuje.",
      ],
      commonMistake: "Odpovědět římským jménem boha (Neptun místo Poseidón) nebo posunout helénismus do doby Perikla.",
      example: "Bůh s trojzubcem je Poseidón, protože trojzubec je znak boha moře.",
    },
  },
];
