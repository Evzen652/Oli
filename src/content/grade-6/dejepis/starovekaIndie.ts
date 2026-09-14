/**
 * Dějepis 6. ročník — Starověká Indie: varny (kasty), hinduismus, buddhismus (select_one).
 *
 * Faktické téma → banky úloh, ne šablona. Tři disjunktní banky (POOL_L1/L2/L3),
 * každá s vlastním zněním, vlastní dvojicí nápověd a vlastním vysvětlením.
 *
 * Chybový model (každý distraktor = jedna typická chyba):
 *  • pořadí varen podle moci — kšatrijové (vládci) nejvýš místo bráhmanů,
 *    prohozené vaišjové a šúdrové;
 *  • míchání hinduismu a buddhismu — Buddhovi připsaná trojice bohů nebo varny,
 *    buddhismus „nevěří v převtělování“;
 *  • evropské a dnešní představy — varna jako třída, ze které se dá vypracovat
 *    penězi, studiem nebo sňatkem; karma jako trest boha nebo osud bez vlivu;
 *  • záměna s jinými civilizacemi — Nil, Eufrat, Chuang-che, Osiris, Konfucius.
 *
 *  • L1 — zapamatování: popis → pojem.
 *  • L2 — použití: situace nebo postava → pojem, varna, učení.
 *  • L3 — analýza: srovnání, příčina a důsledek, oprávněný závěr.
 *
 * Sporné údaje se nepoužívají: jména jednotlivých Véd, Ašóka, přesné datace
 * (Árjové jen „kolem roku 1500 př. n. l.“ a nikdy jako klíč).
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

const EGYPT = "To patří starověkému Egyptu, ne Indii.";
const MEZO = "To patří Mezopotámii, ne Indii.";
const CINA = "To patří starověké Číně, ne Indii.";

// ── L1 — ZAPAMATOVÁNÍ: popis → pojem ────────────────────────────────────────
export const POOL_L1: Polozka[] = [
  {
    q: "U které řeky stála města Mohendžodáro a Harappa?",
    correct: "Indus",
    distractors: [
      { value: "Nil", why: `${EGYPT} Nil protéká Afrikou a dal vzniknout egyptské civilizaci.` },
      { value: "Eufrat", why: `${MEZO} Eufrat a Tigris vymezují území mezi dvěma řekami v Přední Asii.` },
      { value: "Ganga", why: "Ganga je posvátná řeka hinduistů na východě Indie. Nejstarší indická města ale vznikla na severozápadě, u jiné řeky." },
    ],
    hints: [
      "Vybav si, ve které části Asie leží Indie a které řeky patří k ostatním starověkým civilizacím.",
      "Dvě řeky z nabídky patří k Egyptu a Mezopotámii. Ze dvou indických řek je jedna posvátná a teče na východ, nejstarší města ale ležela na severozápadě, v dnešním Pákistánu.",
    ],
    explanation: "Nejstarší indická civilizace vznikla v povodí Indu, kde stála města Mohendžodáro a Harappa. Od jména řeky je odvozen i název Indie.",
  },
  {
    q: "Jak se nazývá víra, že duše po smrti přechází do nového těla?",
    correct: "Převtělování",
    distractors: [
      { value: "Karma", why: "Karma je zákon, podle kterého skutky ovlivní příští život. Samotný přechod duše do nového těla se jmenuje jinak." },
      { value: "Nirvána", why: "Nirvána je naopak konec koloběhu zrození a utrpení. Člověk se už znovu nenarodí." },
      { value: "Uctívání předků", why: "Uctívání předků znala Čína i Indie, ale je to péče o památku zemřelých, ne víra v nové zrození." },
    ],
    hints: [
      "Hledáš slovo pro to, co se děje s duší po smrti, ne pro to, co o tom rozhoduje.",
      "Jeden pojem z nabídky popisuje zákon skutků, druhý konec celého koloběhu. Hledaný pojem říká, že se duše znovu vtělí, tedy dostane nové tělo člověka nebo zvířete.",
    ],
    explanation: "Převtělování (reinkarnace) je víra, že duše po smrti přejde do nového těla. Jaké tělo to bude, určuje karma, tedy skutky z minulého života.",
  },
  {
    q: "Která varna měla na starosti náboženské obřady?",
    correct: "Bráhmani",
    distractors: [
      { value: "Kšatrijové", why: "Kšatrijové byli válečníci a vládci. Měli moc, ale obřady konali kněží." },
      { value: "Vaišjové", why: "Vaišjové byli obchodníci, řemeslníci a rolníci. Obřady nekonali." },
      { value: "Šúdrové", why: "Šúdrové byli služebníci a nádeníci. Ke konání obřadů neměli přístup." },
    ],
    hints: [
      "Obřady konali kněží. Která varna byla kněžská?",
      "Varna válečníků měla moc, varna obchodníků bohatství a varna služebníků pracovala pro ostatní. Kněžská varna stála v řádu nejvýš a jen ona směla posvátné texty vyučovat.",
    ],
    explanation: "Obřady konali bráhmani, kněžská varna. Stáli nejvýš, protože jen oni směli posvátné texty vyučovat a konat obřady, a byli tak prostředníky mezi lidmi a bohy.",
  },
  {
    q: "Jak se jmenoval muž, kterému lidé začali říkat Buddha?",
    correct: "Siddhártha",
    distractors: [
      { value: "Konfucius", why: `${CINA} Konfucius byl čínský učitel mravů, nikoli zakladatel buddhismu.` },
      { value: "Chammurapi", why: `${MEZO} Chammurapi vládl Babylonu a je známý svým zákoníkem.` },
      { value: "Višnu", why: "Višnu je hinduistický bůh. Buddha nebyl bůh, ale člověk, který našel cestu z utrpení." },
    ],
    hints: [
      "Buddha byl skutečný člověk z Indie, ne bůh a ne cizí panovník.",
      "Vyřaď postavy z Číny a Mezopotámie i hinduistického boha. Hledaný muž se narodil jako syn indického vládce, opustil palác a hledal, jak skončit utrpení.",
    ],
    explanation: "Buddhou (Osvíceným) začali říkat Siddhárthovi Gautamovi. Byl to indický princ, který asi v 6.–5. století př. n. l. opustil palác, hledal příčinu utrpení a začal učit, jak z něj ven.",
  },
  {
    q: "Který bůh je v hinduismu ničitel a obnovitel?",
    correct: "Šiva",
    distractors: [
      { value: "Brahma", why: "Brahma je v hinduismu stvořitel světa. Ničí a obnovuje jiný bůh." },
      { value: "Višnu", why: "Višnu je ochránce a udržovatel světa, ne jeho ničitel." },
      { value: "Buddha", why: "Buddha nebyl hinduistický bůh, ale člověk, zakladatel buddhismu." },
    ],
    hints: [
      "Hinduisté uctívají trojici hlavních bohů a každý má jiný úkol: tvořit, chránit, ničit.",
      "Jedna možnost vůbec není bůh, ale zakladatel jiného učení. Ze tří bohů jeden svět stvořil a druhý ho chrání, zbývající ho ničí, aby mohl vzniknout znovu.",
    ],
    explanation: "Šiva je v hinduismu ničitel a zároveň obnovitel: to staré musí zaniknout, aby vzniklo nové. Brahma je stvořitel a Višnu ochránce.",
  },
  {
    q: "Jak se říká lidem mimo varny, kteří dělali „nečisté“ práce?",
    correct: "Nedotknutelní",
    distractors: [
      { value: "Šúdrové", why: "Šúdrové byli nejnižší varna, ale do varnového řádu patřili. Lidé mimo varny měli jiné označení." },
      { value: "Otroci z války", why: "Otroci byli zajatci nebo lidé prodaní za dluhy. Postavení mimo varny se ale dědilo narozením." },
      { value: "Chudí vesničané", why: "Nešlo o chudobu. Chudý mohl patřit do kterékoli varny, lidé mimo varny byli vyloučeni už narozením." },
    ],
    hints: [
      "Pozor na slovo „mimo“. Hledáš skupinu, která do žádné ze čtyř varen nepatřila.",
      "Nejnižší varna do řádu ještě patřila. Hledaná skupina stála až pod ní: čistila ulice, pracovala s mrtvými zvířaty a ostatní se báli, že je pouhý dotyk s nimi znečistí.",
    ],
    explanation: "Lidé mimo varny se nazývali nedotknutelní. Dělali práce považované za nečisté a ostatní se jich nesměli dotknout. Postavení se dědilo narozením, ne chudobou.",
  },
  {
    q: "Jak se nazývá zákon, podle kterého skutky ovlivní příští život?",
    correct: "Karma",
    distractors: [
      { value: "Nirvána", why: "Nirvána je konec utrpení a koloběhu zrození, ne zákon o skutcích." },
      { value: "Převtělování", why: "Převtělování je samotný přechod duše do nového těla. Jaké tělo to bude, určuje jiný zákon." },
      { value: "Osud", why: "Osud člověk ovlivnit nemůže. Tento zákon naopak říká, že si příští život určuje vlastními skutky." },
    ],
    hints: [
      "Zákon spojuje dvě věci: co člověk dělá teď a co ho čeká v příštím životě.",
      "Nezaměň ho s přechodem duše do nového těla ani s koncem utrpení. Hledaný zákon funguje jako účet: dobré skutky přinesou lepší zrození, zlé horší, a nikdo ho nemusí vyhlásit.",
    ],
    explanation: "Karma je zákon, podle kterého skutky člověka určí jeho příští zrození. Není to trest od boha ani neměnný osud, člověk ji ovlivňuje tím, jak žije.",
  },
  {
    q: "Který živočich je hinduistům posvátný?",
    correct: "Kráva",
    distractors: [
      { value: "Kočka", why: `${EGYPT} Egypťané uctívali kočku jako zvíře bohyně Bastet.` },
      { value: "Skarabeus", why: `${EGYPT} Skarabea uctívali Egypťané jako posvátného brouka.` },
      { value: "Vlčice", why: "Vlčice je symbolem Říma, podle pověsti kojila Romula a Rema. S Indií nesouvisí." },
    ],
    hints: [
      "Vybav si, které zvíře se v indických městech může volně procházet po ulicích a nikdo ho neodežene.",
      "Dvě zvířata uctívali Egypťané a třetí je symbolem Říma. Posvátné zvíře hinduistů dává mléko, pomáhá na poli a jíst jeho maso se nesmí.",
    ],
    explanation: "Hinduistům je posvátná kráva. Dává mléko a pomáhá při práci, je symbolem života, a proto se nezabíjí ani nejí.",
  },
  {
    q: "Ve kterém posvátném toku se hinduisté omývají?",
    correct: "Ganga",
    distractors: [
      { value: "Nil", why: `${EGYPT} Nil byl pro Egypťany zdrojem úrody, s hinduistickým omýváním nesouvisí.` },
      { value: "Eufrat", why: `${MEZO} Eufrat teče Přední Asií daleko od Indie a hinduisté se v něm neomývají.` },
      { value: "Indus", why: "U Indu vznikla nejstarší civilizace, posvátnou řekou hinduismu je ale jiná řeka na východě." },
    ],
    hints: [
      "Hledáš řeku, ke které hinduisté putují, ne tu, u které stála nejstarší indická města.",
      "Vyřaď řeky Egypta a Mezopotámie. Ze dvou indických řek je hledaná ta, která teče severní Indií od Himálaje k východu a na jejích březích stojí město Váránasí, kam míří poutníci.",
    ],
    explanation: "Posvátnou řekou hinduistů je Ganga. Věří, že omytí v ní očišťuje od hříchů, a proto se k ní vydávají poutníci.",
  },
  {
    q: "Jak se nazývá stav, kdy buddhista dosáhne konce utrpení?",
    correct: "Nirvána",
    distractors: [
      { value: "Karma", why: "Karma je zákon skutků, který naopak drží člověka v koloběhu zrození. Konec utrpení se jmenuje jinak." },
      { value: "Převtělování", why: "Převtělování je nové zrození, tedy pokračování utrpení, ne jeho konec." },
      { value: "Posmrtný soud", why: "Soud Osirida na vahách je egyptská představa. Nirvána není rozsudek, ale konec touhy a utrpení." },
    ],
    hints: [
      "Hledáš cíl buddhisty, tedy stav, kdy už se nemusí znovu narodit.",
      "Vyřaď pojmy, které popisují, jak koloběh zrození pokračuje, i představu jiné civilizace. Zbude stav klidu, ve kterém zhasne touha, a s ní i utrpení.",
    ],
    explanation: "Nirvána je stav, kdy buddhista přestane toužit, a tím skončí jeho utrpení i koloběh zrození. Karma a znovuzrození naopak popisují, jak koloběh pokračuje.",
  },
  {
    q: "Jak se nazývají nejstarší posvátné spisy hinduismu?",
    correct: "Védy",
    distractors: [
      { value: "Bible", why: "Bible je posvátná kniha židů a křesťanů, vznikla v Přední Asii." },
      { value: "Korán", why: "Korán je posvátná kniha muslimů a vznikl mnohem později v Arábii." },
      { value: "Kniha mrtvých", why: `${EGYPT} Kniha mrtvých obsahovala modlitby pro cestu duše do podsvětí.` },
    ],
    hints: [
      "Vyřaď spisy jiných náboženství, i ty mladší.",
      "Dvě knihy patří náboženstvím, která vznikla mimo Indii, a jedna Egyptu. Indické spisy obsahovaly hymny a modlitby, dlouho se předávaly jen ústně a uchovávali je hlavně kněží.",
    ],
    explanation: "Nejstarší posvátné spisy hinduismu jsou Védy. Obsahují hymny a návody k obřadům. Uchovávali a předávali je hlavně bráhmani.",
  },
  {
    q: "Kterým jménem nazývají hinduisté boha stvořitele?",
    correct: "Brahma",
    distractors: [
      { value: "Višnu", why: "Višnu svět chrání a udržuje. Stvořitelem je jiný bůh." },
      { value: "Šiva", why: "Šiva svět ničí a obnovuje. Stvořitelem je jiný bůh." },
      { value: "Buddha", why: "Buddha nebyl bůh a svět nestvořil. Byl to člověk, který učil cestu z utrpení." },
    ],
    hints: [
      "Každý z hlavní trojice hinduistických bohů má jiný úkol. Který svět stvořil?",
      "Jedna možnost není bůh vůbec. Ze tří bohů jeden svět chrání a druhý ho ničí. Jméno stvořitele zní podobně jako název kněžské varny.",
    ],
    explanation: "Stvořitelem je v hinduismu Brahma. Višnu svět chrání a Šiva ho ničí a obnovuje. Buddha byl člověk, zakladatel buddhismu.",
  },
  {
    q: "Který hinduistický bůh je ochráncem světa?",
    correct: "Višnu",
    distractors: [
      { value: "Brahma", why: "Brahma svět stvořil. Chránit ho má na starosti jiný bůh." },
      { value: "Šiva", why: "Šiva je ničitel a obnovitel, ne ochránce." },
      { value: "Ra", why: `${EGYPT} Ra byl egyptský bůh slunce.` },
    ],
    hints: [
      "Vyřaď nejdřív boha jiné civilizace.",
      "Jeden z bohů patří Egyptu. Ze dvou zbylých hinduistických bohů jeden svět stvořil a druhý ho ničí. Ochránce se podle bájí zjevuje na zemi v různých podobách, když světu hrozí nebezpečí.",
    ],
    explanation: "Ochráncem a udržovatelem světa je Višnu. Brahma je stvořitel a Šiva ničitel a obnovitel. Ra byl bohem slunce v Egyptě.",
  },
  {
    q: "Jak se nazývá společenská skupina, do které se Ind narodil a která určovala jeho povolání?",
    correct: "Varna (kasta)",
    distractors: [
      { value: "Společenská třída", why: "Ze třídy se dá vypracovat penězi nebo prací. Indická skupina se dědila narozením a změnit ji nešlo." },
      { value: "Řemeslný cech", why: "Do cechu se vstupovalo po vyučení, byl to spolek řemeslníků. Indická skupina se dědila narozením." },
      { value: "Šlechtický titul", why: "Titul udělovali vládci jednotlivcům. Indickou skupinu dostal každý člověk už narozením." },
    ],
    hints: [
      "Všimni si slov „narodil“ a „určovala povolání“. Ta skupina se nedala vybrat.",
      "Vyřaď skupiny, do kterých se člověk dostane vlastní prací, vyučením nebo přízní vládce. Hledaná skupina byla v Indii čtyři a člověk v ní zůstal celý život.",
    ],
    explanation: "Indická společnost se dělila na varny, kterým se také říká kasty. Do varny se člověk narodil, zůstal v ní celý život a varna určovala jeho povolání i to, s kým se smí oženit.",
  },
  {
    q: "Které kmeny přišly kolem roku 1500 př. n. l. do severní Indie? Postupně se u nich vyvinul varnový řád.",
    correct: "Árjové",
    distractors: [
      { value: "Sumerové", why: `${MEZO} Sumerové žili na jihu Mezopotámie a do Indie nepřišli.` },
      { value: "Egypťané", why: `${EGYPT} Egypťané zůstávali u Nilu.` },
      { value: "Keltové", why: "Keltové žili v Evropě, i na našem území, a do Indie nikdy nepřišli." },
    ],
    hints: [
      "Hledáš kmeny, které do Indie opravdu přišly, ne národ, který žil jinde a do Indie nedošel.",
      "Tři národy z nabídky žily v Mezopotámii, Egyptě a Evropě. Hledané kmeny přišly ze severozápadu, chovaly dobytek a koně a jejich kněží složili nejstarší posvátné hymny.",
    ],
    explanation: "Kolem roku 1500 př. n. l. přišli do severní Indie Árjové. U nich se během staletí postupně prosadilo dělení společnosti na varny a nejstarší posvátné hymny hinduismu.",
  },
  {
    q: "Jak se nazývá buddhista, který se vzdal majetku a žije v klášteře?",
    correct: "Mnich",
    distractors: [
      { value: "Bráhman", why: "Bráhman je hinduistický kněz z nejvyšší varny. Buddhista, který opustil světský život, se nazývá jinak." },
      { value: "Písař", why: `${EGYPT} Písař byl vážený úředník, který vedl záznamy.` },
      { value: "Kšatrija", why: "Kšatrija je označení varny válečníků a vládců, ne buddhisty, který žije v klášteře." },
    ],
    hints: [
      "Hledáš člověka, který se zřekl světa, ne člena některé varny.",
      "Vyřaď hinduistického kněze, válečníka a egyptského úředníka. Hledaný buddhista chodí v jednoduchém rouchu, žije z darů a celý den se věnuje rozjímání a učení.",
    ],
    explanation: "Buddhista, který se vzdal majetku a žije v klášteře, je mnich. Buddha učil, že touha po majetku vede k utrpení, a mniši se jí proto vzdávají.",
  },
];

// ── L2 — POUŽITÍ: situace → pojem, varna, učení ─────────────────────────────
export const POOL_L2: Polozka[] = [
  {
    q: "Syn hrnčíře by chtěl být knězem. Jak to podle varnového řádu dopadne?",
    correct: "Zůstane u řemesla, které dělala jeho rodina",
    distractors: [
      { value: "Stane se knězem, když bude pilně studovat", why: "Studiem se varna změnit nedala. Knězem se mohl stát jen ten, kdo se do kněžské varny narodil." },
      { value: "Kněžství si koupí, až řemeslem zbohatne", why: "Varnu nešlo koupit. Bohatství neměnilo to, do které varny se člověk narodil." },
      { value: "Stane se knězem, když si vezme dceru kněze", why: "Sňatky se uzavíraly zpravidla uvnitř vlastní varny. Varnu tedy nešlo změnit ani svatbou." },
    ],
    hints: [
      "Rozhoduje, do jaké rodiny se chlapec narodil, ne co by sám chtěl.",
      "Zeptej se, jestli se varna dala změnit studiem, penězi nebo sňatkem. Ve varnovém řádu se povolání předávalo z otce na syna a přechod do vyšší varny nebyl možný.",
    ],
    explanation: "Varna se dědila narozením. Syn hrnčíře patřil do varny svého otce a musel pokračovat v rodinném řemesle. Studium, bohatství ani sňatek na tom nic neměnily.",
  },
  {
    q: "Vesničan věří, že když bude krutý ke zvířatům, v příštím životě se narodí jako nižší tvor. Kterým pojmem se vysvětluje, proč by se tak stalo?",
    correct: "Karma",
    distractors: [
      { value: "Nirvána", why: "Nirvána je konec koloběhu zrození. Vesničan ale mluví o tom, jak se narodí příště." },
      { value: "Trest boha Šivy", why: "Podle zákona karmy určují zrození samy skutky, ne rozsudek boha." },
      { value: "Varna", why: "Varna je skupina, do které se člověk narodil. Nevysvětluje, proč se příště narodí jako zvíře." },
    ],
    hints: [
      "Hledej příčinu: co vesničana do horšího zrození dostane?",
      "Vesničan netvrdí, že ho někdo potrestá. Věří, že jeho vlastní krutost sama přinese následek v dalším životě. Vyber pojem pro zákon, který spojuje skutky s příštím zrozením.",
    ],
    explanation: "Vysvětluje to karma: zlé skutky samy přinesou horší zrození, dobré lepší. Nejde o trest od boha, ale o zákon důsledků vlastního jednání.",
  },
  {
    q: "Muž s mečem vládne kraji a v době války vede vojsko. Do které varny patří?",
    correct: "Kšatrijové",
    distractors: [
      { value: "Bráhmani", why: "Bráhmani byli kněží a konali obřady. Vojsko nevedli." },
      { value: "Vaišjové", why: "Vaišjové byli obchodníci, řemeslníci a rolníci, ne vládci a válečníci." },
      { value: "Šúdrové", why: "Šúdrové byli služebníci. Vládnout ani velet vojsku nesměli." },
    ],
    hints: [
      "Muž dělá dvě věci: vládne a bojuje. Která varna měla právě tyto úkoly?",
      "Nenech se zmást tím, že vládce má moc. Nejvyšší varna nebyla vládnoucí, ale kněžská. Hledaná varna stála hned pod ní a patřili do ní králové a válečníci.",
    ],
    explanation: "Vládci a válečníci patřili mezi kšatrije. Měli moc a bránili zemi, ale v prestiži stáli až pod bráhmany, kteří konali obřady.",
  },
  {
    q: "Na trhu prodává obchodník látky a vedle něj rolník nabízí rýži. Do které varny oba patří?",
    correct: "Vaišjové",
    distractors: [
      { value: "Šúdrové", why: "Šúdrové byli služebníci a nádeníci, kteří pracovali pro jiné. Obchodníci a rolníci stáli o stupeň výš." },
      { value: "Kšatrijové", why: "Kšatrijové byli válečníci a vládci, na trhu neobchodovali." },
      { value: "Nedotknutelní", why: "Nedotknutelní stáli mimo varny a dělali nečisté práce. S potravinami na trhu obchodovat nesměli." },
    ],
    hints: [
      "Obchod a zemědělství patřily do stejné varny. Která to byla?",
      "Nepleť si varnu obchodníků a rolníků se služebníky: služebníci pracovali pro druhé a neměli vlastní obchod. Hledaná varna byla třetí ze čtyř, pod kněžími a válečníky.",
    ],
    explanation: "Obchodníci, řemeslníci a rolníci patřili mezi vaišje, třetí varnu. Pod nimi stáli šúdrové, služebníci, kteří pracovali pro ostatní.",
  },
  {
    q: "Mnich učí, že utrpení vzniká z touhy a že ho lze ukončit. Které učení šíří?",
    correct: "Buddhismus",
    distractors: [
      { value: "Hinduismus", why: "Hinduismus stojí na varnách, karmě a uctívání bohů. Myšlenka, že utrpení vzniká z touhy, je jádrem Buddhova učení." },
      { value: "Konfucianismus", why: `${CINA} Konfucius učil úctě k rodičům a pořádku ve státě, ne cestě z utrpení.` },
      { value: "Uctívání předků", why: "Uctívání předků znala Čína i Indie, ale je to péče o památku zemřelých, ne učení o konci utrpení." },
    ],
    hints: [
      "Všimni si dvou myšlenek: utrpení má příčinu a dá se skončit. Kdo s nimi přišel?",
      "Učení o touze jako příčině utrpení vyslovil indický princ, který opustil palác. Vyber náboženství, které se po něm jmenuje, a vyřaď čínská učení.",
    ],
    explanation: "Mnich šíří buddhismus. Buddha učil, že utrpení vzniká z touhy, a když se člověk touhy zbaví, utrpení skončí a dosáhne nirvány.",
  },
  {
    q: "Člověk z nejnižší skupiny slyší kazatele, že ke konci utrpení může dojít každý bez ohledu na původ. Kdo mu to káže?",
    correct: "Buddhistický mnich",
    distractors: [
      { value: "Hinduistický kněz bráhman", why: "Bráhmani učili, že postavení člověka určuje narození do varny. Že na původu nezáleží, hlásali buddhisté." },
      { value: "Poutník k posvátné Ganze", why: "Poutník k Ganze je hinduista, který hledá očistu v řece. Že na původu nezáleží, hlásali buddhisté." },
      { value: "Vládce z varny kšatrijů", why: "Vládci varnový řád udržovali. Rovnost všech na cestě z utrpení hlásal Buddha a jeho žáci." },
    ],
    hints: [
      "Rozhodující jsou slova „bez ohledu na původ“. Které indické učení odmítlo, že varna rozhoduje?",
      "Hinduističtí kněží i vládci stáli na varnovém řádu, kde původ znamenal všechno. Hledaný kazatel patřil k učení, podle kterého může k nirváně dojít člověk z jakékoli skupiny.",
    ],
    explanation: "Káže buddhistický mnich. Buddha učil, že cesta z utrpení je otevřená každému bez ohledu na varnu. Hinduismus naopak spojoval postavení člověka s narozením.",
  },
  {
    q: "Muž celý život čistí ulice a odklízí mrtvá zvířata. Ostatní se ho bojí dotknout. Do které skupiny patří?",
    correct: "Nedotknutelní",
    distractors: [
      { value: "Šúdrové", why: "Šúdrové byli nejnižší varna, ale do varnového řádu patřili. Kdo dělal nečisté práce, stál až mimo varny." },
      { value: "Otroci z války", why: "Otroci byli zajatci. Nečisté práce dělali lidé, kteří se do postavení mimo varny narodili." },
      { value: "Vaišjové", why: "Vaišjové byli obchodníci, řemeslníci a rolníci, třetí varna. Nečisté práce nedělali." },
    ],
    hints: [
      "Všimni si, že se ho ostatní bojí dotknout. Kdo byl pro Indy „nečistý“?",
      "Nejnižší varna do řádu ještě patřila a služebníky se nikdo dotknout nebál. Hledaná skupina stála úplně mimo čtyři varny a dělala práce s mrtvými a s odpadem.",
    ],
    explanation: "Muž patří mezi nedotknutelné. Stáli mimo varny, dělali práce považované za nečisté a ostatní se jich nesměli dotknout. Šúdrové byli nejnižší varna, ale do řádu patřili.",
  },
  {
    q: "Dívka z kněžské rodiny se chce vdát za syna obchodníka. Co tomu podle varnového řádu brání?",
    correct: "Brali se zpravidla lidé ze stejné varny",
    distractors: [
      { value: "Rodina nevěsty musela zaplatit vysoké věno", why: "Věno nebylo to podstatné. Sňatek mezi různými varnami omezoval samotný řád, ne peníze." },
      { value: "Dívky z kněžských rodin se nesměly vdávat", why: "Dcery bráhmanů se vdávaly a zakládaly rodiny. Bez manželství žili buddhističtí mniši a mnišky." },
      { value: "Nevěsta musela nejdřív přestoupit k Buddhovi", why: "Přestup k buddhismu by nic nezměnil. Buddhismus varny neuznával, ale hinduistický řád by takový sňatek stejně nedovolil." },
    ],
    hints: [
      "Porovnej, do jaké varny patří nevěsta a do jaké ženich.",
      "Nevěsta je z kněžské varny, ženich z varny obchodníků. Zeptej se, jestli se dívka směla provdat do nižší varny a jestli by pomohly peníze nebo změna víry.",
    ],
    explanation: "Sňatky se zpravidla uzavíraly uvnitř vlastní varny. Staré zákoníky sice někdy dovolily muži vzít si ženu z nižší varny, ale dívka z vyšší varny se do nižší provdat nesměla. Peníze ani změna víry na tom nic neměnily.",
  },
  {
    q: "Indická matka říká synovi: „Buď hodný, ať se příště narodíš do lepšího postavení.“ Na které dvě představy se spoléhá?",
    correct: "Na karmu a převtělování",
    distractors: [
      { value: "Na nirvánu a převtělování", why: "Nirvána je konec koloběhu zrození. Matka ale počítá s tím, že se syn znovu narodí." },
      { value: "Na karmu a posmrtný soud", why: "Soud Osirida na vahách je egyptská představa. Matka ale počítá s tím, že skutky samy určí další zrození." },
      { value: "Na varnu a vůli bohů", why: "Varna je dána narozením a matka nemluví o vůli bohů. Mluví o skutcích a novém zrození." },
    ],
    hints: [
      "Rozlož větu na dvě části: „buď hodný“ a „příště se narodíš“. Každá odpovídá jedné představě.",
      "První část mluví o skutcích a jejich následku, druhá o tom, že duše dostane nové tělo. Vyřaď dvojice, kde je konec koloběhu zrození, soud nebo vůle bohů.",
    ],
    explanation: "Matka spoléhá na karmu (dobré skutky přinesou lepší zrození) a na převtělování (duše se po smrti znovu narodí). Obě představy k sobě v hinduismu patří.",
  },
  {
    q: "Poutník se vydá k posvátné řece Ganze, aby se v ní omyl a očistil od hříchů. Které náboženství vyznává?",
    correct: "Hinduismus",
    distractors: [
      { value: "Buddhismus", why: "Buddhismus neučí očistu v řece. Konec utrpení hledá ve zbavení se touhy." },
      { value: "Buddhismus i hinduismus", why: "Očista v posvátné řece je hinduistický obřad. Buddhismus konec utrpení hledá ve zbavení se touhy, ne v omývání." },
      { value: "Uctívání Buddhy jako boha", why: "Buddha nebyl bůh a jeho učení očistu v řece nezná. Omývání v Ganze patří jinému náboženství." },
    ],
    hints: [
      "Očista v posvátné řece je obřad. Které indické náboženství stojí na obřadech?",
      "Buddhismus hledá konec utrpení v myšlení člověka, ne v obřadech, a Buddha nebyl bůh. Hledané náboženství uctívá bohy a vodu indické řeky považuje za svatou.",
    ],
    explanation: "Poutník je hinduista. Hinduisté považují Gangu za posvátnou a věří, že omytí v ní očišťuje od hříchů.",
  },
  {
    q: "Princ opustí palác, protože poprvé uviděl nemoc, stáří a smrt, a vydá se hledat cestu z utrpení. O kom se vypráví?",
    correct: "O Siddhárthovi Gautamovi",
    distractors: [
      { value: "O Konfuciovi, čínském učenci", why: `${CINA} Konfucius nebyl indický princ a cestu z utrpení nehledal.` },
      { value: "O bohu Višnuovi, ochránci světa", why: "Višnu je hinduistický bůh. Příběh vypráví o člověku, který teprve hledal odpověď." },
      { value: "O Šivovi, bohu ničiteli světa", why: "Šiva je hinduistický bůh. Bohové nemuseli opouštět palác a hledat cestu z utrpení." },
    ],
    hints: [
      "Příběh je o člověku, ne o bohovi. Kdo z nabídky byl indický princ?",
      "Vyřaď hinduistické bohy i čínského učence. Hledaný princ po letech hledání pochopil příčinu utrpení a lidé mu pak začali říkat Osvícený.",
    ],
    explanation: "Vypráví se o Siddhárthovi Gautamovi. Pohled na nemoc, stáří a smrt ho přiměl opustit palác. Po letech hledání pochopil příčinu utrpení a stal se Buddhou.",
  },
  {
    q: "Ve vesnici dělá dědeček, otec i syn stejnou práci kováře. Co to ukazuje o varnovém řádu?",
    correct: "Povolání se dědilo z otce na syna",
    distractors: [
      { value: "Syn si povolání vybral podle svého nadání", why: "Ve varnovém řádu se povolání nevybíralo. Syn dělal to, co jeho rodina." },
      { value: "Povolání přiděloval kněz podle karmy syna", why: "Kněz povolání nikomu nepřiděloval. Určila ho varna, do které se syn narodil." },
      { value: "Rodina byla chudá, a proto neměla výběr", why: "Nešlo o chudobu. I bohatá rodina zůstávala u povolání své varny." },
    ],
    hints: [
      "Tři generace dělají totéž. Náhoda, nebo pravidlo?",
      "Zeptej se, jestli si Ind mohl vybrat povolání podle nadání, nebo jestli mu ho určil někdo jiný. Ve varnovém řádu rozhodovalo narození, ne vůle, peníze ani kněz.",
    ],
    explanation: "Příklad ukazuje, že povolání se dědilo. Syn patřil do varny otce a pokračoval v jeho práci. Nevybíral si podle nadání a nerozhodovala o tom chudoba.",
  },
  {
    q: "Sluha pracuje na poli pro bohatého rolníka a nemá vlastní půdu. Do které varny patří?",
    correct: "Šúdrové",
    distractors: [
      { value: "Vaišjové", why: "Vaišjové byli samostatní rolníci a obchodníci. Sluha, který pracuje pro jiné, stál o stupeň níž." },
      { value: "Nedotknutelní", why: "Nedotknutelní stáli mimo varny a dělali nečisté práce. Práce sluhy na poli nečistá nebyla." },
      { value: "Kšatrijové", why: "Kšatrijové byli válečníci a vládci, na cizím poli nepracovali." },
    ],
    hints: [
      "Rozliš, kdo hospodaří na svém a kdo pracuje pro druhé.",
      "Samostatný rolník patřil do varny obchodníků a rolníků. Hledaná varna byla nejnižší ze čtyř: patřili do ní služebníci a nádeníci, stále ale uvnitř varnového řádu.",
    ],
    explanation: "Sluha patří mezi šúdry, nejnižší varnu. Pracovali pro ostatní jako služebníci a nádeníci. Samostatný rolník byl vaišja.",
  },
  {
    q: "Které jednání by hinduista považoval za těžké provinění?",
    correct: "Zabít krávu a sníst její maso",
    distractors: [
      { value: "Dojit krávu a pít její mléko", why: "Mléko krav hinduisté běžně pijí. Kráva ho dává, a proto si jí váží." },
      { value: "Omýt se v posvátné řece Ganze", why: "Omytí v Ganze je pro hinduisty naopak očista od hříchů." },
      { value: "Obětovat bohům mléko a máslo", why: "Mléko a přepuštěné máslo se při hinduistických obřadech bohům obětovaly. Proviněním to nebylo." },
    ],
    hints: [
      "Vzpomeň si, jaký vztah mají hinduisté ke krávě a co od ní smějí přijímat.",
      "Mléko a máslo krav hinduisté užívají i při obřadech a omytí v řece je očista. Hledej jednání, kterým by posvátnému zvířeti vzali život.",
    ],
    explanation: "Kráva je hinduistům posvátná, a proto se nezabíjí ani nejí. Její mléko a máslo se ale běžně užívají, i při obřadech, a omytí v Ganze je očista, ne provinění.",
  },
  {
    q: "Muž z varny šúdrů se stane buddhistou. Může podle Buddhova učení dojít k nirváně?",
    correct: "Ano, původ ani varna nerozhodují",
    distractors: [
      { value: "Ne, nirvána je jen pro bráhmany", why: "To je hinduistický pohled na výsadní postavení kněží. Buddha učil, že cesta je otevřená každému." },
      { value: "Ano, ale až se převtělí na bráhmana", why: "Buddha nepodmiňoval nirvánu narozením do vyšší varny. Může k ní dojít už v tomto životě." },
      { value: "Ne, musí si nejdřív koupit vyšší varnu", why: "Varnu nešlo koupit a buddhismus ji navíc za podmínku nepovažoval." },
    ],
    hints: [
      "Rozhodni podle toho, co Buddha učil o varnách, ne podle hinduistického řádu.",
      "Vyřaď odpovědi, které k nirváně vyžadují vyšší varnu, převtělení nebo peníze. Buddha přijímal mezi své žáky lidi ze všech skupin a na původu nestavěl.",
    ],
    explanation: "Ano. Buddha učil, že cesta ke konci utrpení je otevřená každému. Rozhoduje vlastní snaha zbavit se touhy, ne varna ani majetek.",
  },
  {
    q: "Buddhista zemře dřív, než dosáhl nirvány. Co ho podle buddhismu čeká?",
    correct: "Znovu se narodí v novém těle",
    distractors: [
      { value: "Navždy odejde do nebe k bohům", why: "Buddhismus nečeká věčný život u bohů. Kdo nedosáhl nirvány, zůstává v koloběhu zrození." },
      { value: "Po smrti už nic dalšího nebude", why: "Buddhismus znovuzrození neodmítá. Kdo nedošel ke konci utrpení, narodí se znovu." },
      { value: "Bude souzen bohem Osiridem", why: `${EGYPT} Soud Osirida je egyptská představa. V buddhismu nikdo nesoudí.` },
    ],
    hints: [
      "Nirvána je konec koloběhu zrození. Co se tedy děje s tím, kdo ho neskončil?",
      "Pozor na omyl, že buddhisté znovuzrození odmítají. Buddhismus představu koloběhu zrození převzal ze starší indické víry. Vyřaď i představy jiných civilizací.",
    ],
    explanation: "Buddhista, který nedosáhl nirvány, se znovu narodí. Víra v karmu a koloběh znovuzrození je buddhismu a hinduismu společná, nirvána je vysvobození z tohoto koloběhu.",
  },
];

// ── L3 — ANALÝZA: srovnání, příčina, důsledek, závěr ────────────────────────
export const POOL_L3: Polozka[] = [
  {
    q: "Proč mohl buddhismus oslovit i lidi z nižších varen?",
    correct: "Cestu ke konci utrpení nevázal na varnu",
    distractors: [
      { value: "Sliboval jim bohatství a vyšší postavení", why: "Buddha majetek nesliboval, naopak učil zříci se touhy po něm." },
      { value: "Zrušil v celé Indii varny zákonem", why: "Buddhismus nebyl zákon a varny v Indii nezrušil. Jen tvrdil, že na cestě z utrpení nerozhodují." },
      { value: "Nevěřil ve znovuzrození ani v karmu", why: "Buddhismus v karmu i koloběh znovuzrození věří, to má s hinduismem společné." },
    ],
    hints: [
      "Porovnej, co člověku z nízké varny nabízel hinduismus a co buddhismus.",
      "V hinduismu mohl člověk z nízké varny doufat jen v lepší zrození. Hledej rozdíl, který se ho týkal přímo, a vyřaď tvrzení o penězích, zákonech a o odmítnutí karmy.",
    ],
    explanation: "Buddhismus mohl oslovit i lidi z nižších varen, protože učil, že cesta ke konci utrpení je otevřená každému bez ohledu na varnu. Varny ale nezrušil a karmu i koloběh znovuzrození uznával.",
  },
  {
    q: "Které tvrzení platí pro hinduismus, ale ne pro buddhismus?",
    correct: "Postavení člověka určuje narození do varny",
    distractors: [
      { value: "Po smrti se člověk znovu narodí v novém těle", why: "Víru v koloběh znovuzrození mají obě náboženství, takže neplatí jen pro hinduismus." },
      { value: "Skutky ovlivňují, jak se člověk narodí příště", why: "Karmu uznávají obě náboženství, takže neplatí jen pro hinduismus." },
      { value: "Utrpení vzniká z touhy a lze ho ukončit", why: "To je jádro Buddhova učení, platí tedy pro buddhismus." },
    ],
    hints: [
      "U každého tvrzení se zeptej dvakrát: platí pro hinduismus? A platí i pro buddhismus?",
      "Vyřaď tvrzení, která platí pro obě náboženství, a to, které pochází od Buddhy. Zbude tvrzení, které Buddha výslovně odmítl, když přijímal žáky ze všech skupin.",
    ],
    explanation: "Jen pro hinduismus platí, že postavení člověka určuje narození do varny. Karma a koloběh znovuzrození jsou společné a učení o touze jako příčině utrpení je buddhistické.",
  },
  {
    q: "Bráhman celý život ubližuje lidem i zvířatům. Jaký závěr z toho plyne podle zákona karmy?",
    correct: "Může se příště narodit do nižší varny",
    distractors: [
      { value: "Vysoká varna ho před karmou ochrání", why: "Zákon karmy platí pro všechny. Kněžská varna před následky zlých skutků nechrání." },
      { value: "Bůh Šiva mu varnu ještě za života vezme", why: "Varna se za života neměnila a karma není rozsudek boha. Následek se projeví v příštím zrození." },
      { value: "Následky krutosti ponesou až jeho děti", why: "Karma je zákon vlastních skutků. Následky nese sám bráhman v dalším životě, ne jeho děti." },
    ],
    hints: [
      "Zákon karmy platí pro každého. Na čem podle něj závisí příští zrození?",
      "Vysoké narození před následky skutků nechrání a karma nepůsobí jako okamžitý trest ani na jiné lidi. Zeptej se, co zlé skutky přinesou samotnému bráhmanovi v dalším životě.",
    ],
    explanation: "Podle zákona karmy přinášejí zlé skutky horší zrození každému, i bráhmanovi. Varna, do které se narodil, ho neochrání, a příště se tak může narodit níž. Následek nepřichází jako okamžitý trest a nenesou ho jeho děti.",
  },
  {
    q: "Proč se indická společnost po staletí měnila jen málo?",
    correct: "Povolání i sňatky určovala hlavně varna",
    distractors: [
      { value: "Lidé nesměli z Indie cestovat do ciziny", why: "Indové obchodovali s okolními zeměmi. Změnám bránilo dělení společnosti uvnitř země." },
      { value: "Králové zakázali stavět nová města", why: "V Indii vznikala nová města i říše. Neměnné zůstávalo postavení lidí." },
      { value: "Karma trestala každého, kdo něco změnil", why: "Karma není trest za změnu, ale zákon důsledků skutků. Změnám bránilo dědění varen." },
    ],
    hints: [
      "Hledej příčinu, která držela každého člověka na stejném místě po celý život.",
      "Zeptej se, jestli mohl syn dělat jinou práci než otec a jestli se mohli brát lidé z různých skupin. Když obojí určuje hlavně narození, zůstává společnost stejná po mnoho generací.",
    ],
    explanation: "Varnový řád určoval povolání i sňatky hlavně podle narození. Každá generace opakovala postavení rodičů, a proto se společnost měnila jen pomalu.",
  },
  {
    q: "Co mají hinduismus a buddhismus společné?",
    correct: "Víru v karmu a znovuzrození",
    distractors: [
      { value: "Uctívání Brahmy, Višnua a Šivy", why: "Tyto bohy uctívá jen hinduismus. Buddhismus na uctívání bohů nestaví." },
      { value: "Rozdělení lidí do dědičných varen", why: "Varny jsou hinduistické. Buddha učil, že na cestě z utrpení nerozhodují." },
      { value: "Zakladatele Siddhárthu Gautamu", why: "Siddhártha Gautama založil jen buddhismus. Hinduismus zakladatele nemá, vznikal postupně." },
    ],
    hints: [
      "Hledáš představu, kterou buddhismus z hinduismu převzal, ne tu, kterou odmítl.",
      "Bohy a varny Buddha neuznával a zakladatele má jen jedno z náboženství. Obě ale počítají s tím, že člověk po smrti znovu přijde na svět a jeho skutky ovlivní, jak.",
    ],
    explanation: "Obě náboženství věří v karmu a v koloběh znovuzrození. Liší se tím, že hinduismus uctívá bohy a stojí na varnách, kdežto buddhismus hledá konec utrpení bez ohledu na varnu.",
  },
  {
    q: "Proč mohl hinduista z nízké varny přijímat svůj úděl bez vzpoury?",
    correct: "Věřil, že dobrým životem získá lepší zrození",
    distractors: [
      { value: "Věřil, že ho bůh Šiva za vzpouru hned zabije", why: "Hinduismus netvrdí, že bůh okamžitě trestá. Skutky se projeví v příštím životě." },
      { value: "Věřil, že si bohatstvím koupí vyšší varnu", why: "Varnu nešlo koupit. Naděje na změnu byla až v příštím zrození." },
      { value: "Věřil, že po smrti už nic dalšího nepřijde", why: "Hinduista naopak věří v převtělování. Právě naděje na další život ho vedla ke smíření." },
    ],
    hints: [
      "Spoj dvě hinduistické představy: co se děje po smrti a co o tom rozhoduje.",
      "Když člověk věří, že se znovu narodí a že jeho skutky určí kam, dává mu smysl žít podle pravidel své varny. Vyřaď tvrzení o okamžitém trestu, penězích a konci po smrti.",
    ],
    explanation: "Hinduista věřil v karmu a převtělování. Když splní povinnosti své varny, zaslouží si lepší zrození. Učení o karmě ho proto vedlo spíš ke smíření s postavením než ke vzpouře.",
  },
  {
    q: "Buddhismus se z Indie dostal až do Číny a dalších zemí východní Asie. Který závěr o jeho šíření je správný?",
    correct: "Šířili ho mniši s obchodníky po cestách",
    distractors: [
      { value: "Indičtí králové tyto země dobyli vojskem", why: "Indie Čínu a východní Asii nedobyla. Buddhismus se šířil mírově." },
      { value: "Buddha sám prošel pěšky celou východní Asii", why: "Buddha učil v severní Indii. Do vzdálených zemí jeho učení donesli až pozdější mniši." },
      { value: "Číňané přijali i indický varnový systém", why: "Varny do Číny nepřešly a buddhismus je navíc nevyžadoval." },
    ],
    hints: [
      "Zeptej se, kdo ve starověku cestoval mezi vzdálenými zeměmi.",
      "Buddha sám zůstal v Indii a Indie Čínu nedobyla. Po obchodních cestách ale neputovalo jen zboží: s karavanami chodili i lidé, kteří chtěli učení předat dál.",
    ],
    explanation: "Buddhismus šířili mniši, kteří putovali s obchodníky po obchodních cestách do Číny a dalších zemí. Dnes je rozšířený hlavně ve východní a jihovýchodní Asii.",
  },
  {
    q: "V čem se Buddhova cesta liší od hledání spásy obětí bohům?",
    correct: "Stačí vlastní úsilí, ne přízeň bohů",
    distractors: [
      { value: "Bohům se obětuje víc než v hinduismu", why: "Buddha na obětech nestavěl. Cestu z utrpení viděl ve změně vlastního myšlení." },
      { value: "Spásu zajistí jen kněz z varny bráhmanů", why: "Kněžské obřady patří hinduismu. Buddhista kněze z varny ke konci utrpení nepotřebuje." },
      { value: "Konec utrpení přinese bohatá oběť Šivovi", why: "Oběť Šivovi je hinduistický obřad. Buddha učil, že utrpení skončí zbavením se touhy." },
    ],
    hints: [
      "Zeptej se, kdo v každé z cest dělá hlavní práci: člověk, kněz, nebo bohové?",
      "Při oběti člověk doufá, že mu pomohou bohové a kněz. Buddha učil, že utrpení vzniká v člověku samém, z jeho touhy. Vyber, kdo tedy musí utrpení ukončit.",
    ],
    explanation: "Buddhova cesta stojí na vlastním úsilí: člověk se musí sám zbavit touhy. Nespoléhá na oběti, kněze ani přízeň bohů jako hinduistické obřady.",
  },
  {
    q: "Proč stáli bráhmani ve varnovém řádu výš než kšatrijové, přestože kšatrijové vládli?",
    correct: "Jen oni směli konat obřady pro bohy",
    distractors: [
      { value: "Byli bohatší než všichni vládci a válečníci", why: "Postavení neurčovalo bohatství. Kněží stáli nejvýš díky spojení s bohy." },
      { value: "Porazili kšatrije ve válce o vládu", why: "Kněží s válečníky neválčili a nevládli. Jejich prestiž byla náboženská." },
      { value: "Král je každý rok jmenoval podle zásluh", why: "Varna se dědila, nikdo ji nejmenoval. Kněží se do varny narodili." },
    ],
    hints: [
      "Rozliš dva druhy převahy: moc nad lidmi a náboženskou vážnost.",
      "Vládci měli vojsko a moc, ale ve varnovém řádu rozhodovalo, kdo je nejblíž bohům. Zeptej se, kdo mohl obřady konat a kdo směl posvátné spisy vyučovat.",
    ],
    explanation: "Bráhmani stáli nejvýš, protože jen oni konali obřady a směli vyučovat posvátné texty. Byli prostředníky mezi lidmi a bohy. Kšatrijové měli moc, ale náboženskou vážnost ne.",
  },
  {
    q: "Učitel dnes tvrdí: „Kasta se dá změnit, stačí vystudovat.“ Proč by s ním starý varnový řád nesouhlasil?",
    correct: "Varna se dědila narozením, ne vzděláním",
    distractors: [
      { value: "Studovat směli jen kšatrijové a vládci", why: "Posvátné texty učili bráhmani a studovat je směly všechny vyšší varny. Ani jejich znalost ale varnu neměnila." },
      { value: "Varnu mohl změnit jen král svým výnosem", why: "Varnu nemohl změnit nikdo, ani král. Určovalo ji narození." },
      { value: "Učení bylo v Indii úplně zakázané", why: "V Indii se učilo, bráhmani znali posvátné texty. Vzdělání ale varnu neměnilo." },
    ],
    hints: [
      "Zeptej se, čím člověk ve starověké Indii do varny přišel.",
      "Učitel mluví jako člověk dneška, kdy se dá vypracovat. Starý řád ale neznal změnu varny během života. Vyřaď tvrzení, že by varnu mohl změnit král, a tvrzení o zákazu učení.",
    ],
    explanation: "Podle starého řádu se varna dědila narozením a po celý život se neměnila. Vzdělání, bohatství ani vůle krále na tom nic nezměnily.",
  },
  {
    q: "Který závěr o karmě je správný?",
    correct: "Karma je zákon důsledků vlastních skutků",
    distractors: [
      { value: "Karma je trest, který člověku sešle bůh Šiva", why: "Podle zákona karmy přinášejí následky samy skutky, nejde o trest seslaný bohem." },
      { value: "Karma je osud, který člověk nemůže ovlivnit", why: "Naopak, člověk karmu ovlivňuje tím, jak jedná. Proto se vyplatí dobré skutky." },
      { value: "Karma platí jen pro lidi z nejnižší varny", why: "Zákon skutků platí pro každého, i pro bráhmany." },
    ],
    hints: [
      "U každé možnosti se zeptej: kdo o následku rozhoduje a může ho člověk ovlivnit?",
      "Vyřaď představy přenesené z jiných náboženství (trest od boha) i z představy osudu. Zákon platí pro všechny stejně a funguje sám, bez soudce: jak kdo jedná, takový následek ho čeká.",
    ],
    explanation: "Karma je zákon, podle kterého vlastní skutky přinášejí následky v tomto i příštím životě. Není to trest seslaný bohem ani neměnný osud a platí pro všechny.",
  },
  {
    q: "Mnich řekne: „Utrpení skončí, až přestaneš po všem toužit.“ Co z toho vyplývá?",
    correct: "Konec utrpení závisí na změně vlastního myšlení",
    distractors: [
      { value: "Konec utrpení závisí na přízni bohů", why: "Mnich nemluví o bozích, ale o touze v člověku. Tu musí změnit sám." },
      { value: "Konec utrpení závisí na narození do varny", why: "Buddha učil, že varna nerozhoduje. Rozhoduje, jestli se člověk zbaví touhy." },
      { value: "Konec utrpení závisí na bohatství rodiny", why: "Majetek touhu nezastaví. Buddha naopak radil zříci se touhy po něm." },
    ],
    hints: [
      "Najdi ve větě, co má skončit a kdo to musí udělat.",
      "Touha je něco, co má člověk v sobě. Pokud utrpení skončí, až touha zmizí, musí ji zastavit sám člověk. Vyřaď vnější příčiny, které na to vliv nemají.",
    ],
    explanation: "Když utrpení vzniká z touhy, skončí jen tehdy, když se člověk touhy sám zbaví. Nezáleží na bozích, varně ani majetku, ale na změně myšlení.",
  },
  {
    q: "Proč by se buddhista i hinduista shodli, že není dobré ubližovat zvířatům?",
    correct: "Oba věří, že zlé skutky přinesou špatné zrození",
    distractors: [
      { value: "Oba uctívají všechna zvířata jako bohy", why: "Zvířata nejsou bohové. Posvátná je v hinduismu kráva, ale důvodem shody je zákon skutků." },
      { value: "Oba věří, že zvířata mají vlastní varny", why: "Varny jsou skupiny lidí, ne zvířat. A buddhismus varny neuznává." },
      { value: "Oba věří, že bůh za to člověka hned potrestá", why: "V buddhismu člověka nesoudí bůh a ani hinduismus nečeká okamžitý trest. Následek přinese karma." },
    ],
    hints: [
      "Hledej představu, kterou mají obě náboženství společnou.",
      "Buddhismus neuctívá bohy a neuznává varny, takže tvrzení o nich nemohou platit pro oba. Zbude představa o tom, jak skutky člověka ovlivní jeho další život.",
    ],
    explanation: "Buddhisté i hinduisté věří v karmu a koloběh znovuzrození. Ublížit zvířeti je zlý skutek, který přinese horší zrození, a proto se obě náboženství ubližování zvířatům vyhýbají.",
  },
  {
    q: "Podle starého indického zákoníku nesměl šúdra poslouchat předčítání posvátných spisů. Jaký závěr z toho vyplývá?",
    correct: "Náboženské vzdělání patřilo jen vyšším varnám",
    distractors: [
      { value: "Šúdrové byli pro kněze nebezpeční nepřátelé", why: "Zákaz neznamená nepřátelství. Ukazuje, že přístup ke spisům měly jen vyšší varny." },
      { value: "Všichni Indové byli tehdy negramotní", why: "Zákaz se týkal jen šúdrů. Bráhmani spisy znali, takže tak široký závěr neplatí." },
      { value: "Zákoník platil jen pro buddhistické kláštery", why: "Buddhismus varny neuznával. Zákon o šúdrech patří varnovému řádu hinduismu." },
    ],
    hints: [
      "Z pramenu vyvoď jen to, co opravdu dokládá. Koho zákaz postihoval a koho ne?",
      "Zákaz se týká jedné varny, ne všech lidí, a nemluví o nepřátelství. Zeptej se, kdo tedy ke spisům přístup měl a co to říká o rozdělení vzdělání ve společnosti.",
    ],
    explanation: "Zákon ukazuje, že posvátné spisy a vzdělání v nich patřily jen vyšším varnám a vyučovali je bráhmani. Nedokládá nepřátelství ani negramotnost všech.",
  },
  {
    q: "Proč se Siddhárthovi začalo říkat Buddha, tedy Osvícený?",
    correct: "Pochopil příčinu utrpení a jak ho ukončit",
    distractors: [
      { value: "Narodil se jako bůh, a proto věděl vše", why: "Siddhártha byl člověk. Poznání dosáhl až po letech hledání." },
      { value: "Byl bráhman a znal nazpaměť posvátné spisy", why: "Siddhártha byl princ, ne bráhman, a osvícení nezískal znalostí spisů." },
      { value: "Jako princ vládl nejmoudřeji ze všech", why: "Siddhártha palác i vládu opustil. Osvícený se stal díky poznání, ne vládnutím." },
    ],
    hints: [
      "Osvícený znamená, že mu něco „došlo“. Co hledal, když opustil palác?",
      "Siddhártha nebyl bůh, kněz ani moudrý vládce, všechno to opustil. Vzpomeň si, na jakou otázku hledal odpověď, když uviděl nemoc, stáří a smrt.",
    ],
    explanation: "Siddhártha se stal Buddhou, když po letech hledání pochopil, že utrpení vzniká z touhy a jak ho ukončit. Nebyl bůh a osvícení nezískal narozením ani vládou.",
  },
  {
    q: "Egypťan věřil v posmrtný soud u Osirida, hinduista v karmu. Čím se hinduistická představa liší?",
    correct: "Příští zrození určí skutky, ne vážení srdce",
    distractors: [
      { value: "Hinduistu po smrti soudí bůh Šiva na vahách", why: "Soud na vahách je egyptská představa. Podle zákona karmy určují zrození samy skutky, ne rozsudek boha." },
      { value: "Hinduista po smrti navždy odchází do podsvětí", why: "Hinduista věří v nové zrození, ne ve věčný pobyt v podsvětí." },
      { value: "Hinduista věří, že po smrti nic dalšího není", why: "Hinduista naopak věří, že se znovu narodí v novém těle." },
    ],
    hints: [
      "Porovnej, kdo v každé představě rozhoduje o tom, co čeká člověka po smrti.",
      "V Egyptě rozhodoval bůh, který vážil srdce zemřelého. Vyřaď možnosti, které hinduismu připisují soud, věčné podsvětí nebo konec po smrti, a zeptej se, co rozhoduje u karmy.",
    ],
    explanation: "Podle zákona karmy určí další život hlavně vlastní skutky, ne vážení srdce před bohem. Skutky samy přinesou následek a určí, jak se člověk znovu narodí. V Egyptě o osudu duše rozhodoval soud boha Osirida.",
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
export const STAROVEKA_INDIE: TopicMetadata[] = [
  {
    id: "g6-dej-staroveka-indie-6",
    rvpNodeId: "g6-dejepis-starovek-staroveka-indie-a-cina-staroveka-indie-kasty-hinduismus-buddhismus",
    displayName: "Starověká Indie",
    title: "Starověká Indie - kasty, hinduismus, buddhismus",
    studentTitle: "Starověká Indie",
    subject: "dejepis",
    category: "Starověk",
    topic: "Starověká Indie a Čína",
    briefDescription: "Poznáš indické kasty, hinduismus a buddhismus a rozlišíš, v čem se liší.",
    keywords: [
      "Indie", "starověká Indie", "Indus", "Ganga", "varna", "kasta", "bráhmani", "kšatrijové",
      "vaišjové", "šúdrové", "nedotknutelní", "hinduismus", "karma", "převtělování",
      "Brahma", "Višnu", "Šiva", "buddhismus", "Buddha", "Siddhártha Gautama", "nirvána",
    ],
    goals: [
      "Popsat varnový řád a vysvětlit, že se postavení dědilo narozením.",
      "Poznat základní pojmy hinduismu a buddhismu.",
      "Rozlišit, co platí pro hinduismus, co pro buddhismus a co pro oba.",
    ],
    boundaries: [
      "Jen nesporná fakta z učebnic 6. ročníku; datace jen s „kolem/asi“ a nikdy jako klíč.",
      "Bez jmen jednotlivých Véd, bez Ašóky a dalších rozšiřujících reálií.",
      "Egypt, Mezopotámie a Čína jen jako zdroj záměn.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Varny: bráhmani (kněží), kšatrijové (válečníci a vládci), vaišjové (obchodníci a rolníci), šúdrové (služebníci); nedotknutelní mimo varny. Hinduismus i buddhismus: karma a koloběh znovuzrození. Jen buddhismus: varna nerozhoduje, cílem je nirvána.",
      steps: [
        "Urči, jestli otázka mluví o varnách, o hinduismu, nebo o buddhismu.",
        "U varny se ptej na povolání a na to, že se dědí narozením.",
        "U srovnání ohodnoť každou možnost: hinduismus, buddhismus, nebo oba?",
      ],
      commonMistake: "Dát vládce nad kněze, myslet si, že varnu jde koupit, nebo připsat Buddhovi hinduistické bohy a varny.",
      example: "Buddhismus mohl oslovit i lidi z nižších varen, protože cestu ke konci utrpení nevázal na varnu.",
    },
  },
];
