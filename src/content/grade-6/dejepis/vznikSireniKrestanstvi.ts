/**
 * Dějepis 6. ročník — Antika, Řím: vznik a šíření křesťanství (select_one).
 *
 * Faktické téma → tři disjunktní banky (POOL_L1/L2/L3), každá položka má vlastní
 * znění, vlastní dvojici nápověd a vlastní vysvětlení.
 *
 * Chybový model (každý distraktor = jedna typická chyba):
 *  • povolení × státní náboženství — Milánský edikt 313 (Konstantin) splývá
 *    s Theodosiem (kolem 380);
 *  • anachronismus místa — víra „vznikla v Římě", protože tam později sídlí papež;
 *  • špatný důvod pronásledování — ozbrojená vzpoura, nesnášenlivost vůči všem
 *    cizím bohům (Řím cizí kulty snášel, vadilo odmítnutí oběti císaři);
 *  • záměna osob a rolí — Petr × Pavel, Nero × Konstantin, apoštol × biskup.
 *
 *  • L1 — zapamatování: kdo / co / kde → krátký pojem.
 *  • L2 — použití: čin nebo situace → role, příčina, důsledek (jeden krok).
 *  • L3 — analýza: inverze, porovnání dvou stavů, pramen, pořadí, anachronismus.
 *
 * Nepoužívá se jako klíč: přesný rok narození či smrti Ježíše, sporné detaily
 * (způsob Petrovy smrti, počty obětí), rozdělení církve 1054 (jen distraktor).
 * Pevný letopočet je jen 313; Theodosius vždy „kolem roku 380".
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pluralWithNumber } from "@/lib/czechGrammar";
import { buildChoiceTask as choice, type Distractor } from "./_shared";
import { ruzneUlohy } from "../fyzika/_shared";

interface Polozka {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

/** Číslo + tvar slova „evangelium" (1 evangelium, 4 evangelia, 12 evangelií). */
const evangelia = (n: number) => pluralWithNumber(n, "evangelium", "evangelia", "evangelií");
const apostolu = (n: number) => pluralWithNumber(n, "apoštol", "apoštolové", "apoštolů");

const EDIKT_JEN_POVOLIL = "Milánský edikt roku 313 víru jen povolil a zrovnoprávnil s ostatními. Státním náboženstvím se křesťanství stalo až za Theodosia kolem roku 380.";

// ── L1 — ZAPAMATOVÁNÍ: kdo / co / kde → pojem ───────────────────────────────
export const POOL_L1: Polozka[] = [
  {
    q: "Ve které části Římské říše působil Ježíš?",
    correct: "V Palestině",
    distractors: [
      { value: "V Itálii", why: "V Itálii leží Řím, kam se víra dostala až šířením. Ježíš kázal na východním okraji říše mezi Židy." },
      { value: "V Řecku", why: "V Řecku zakládal křesťanské obce až apoštol Pavel. Ježíš sám tam nikdy nekázal." },
      { value: "V Malé Asii", why: "V Malé Asii (dnešním Turecku) šířil víru až Pavel na svých cestách. Ježíš působil jinde." },
    ],
    hints: [
      "Křesťanství vyrostlo z víry jednoho národa. Kde tento národ tehdy žil?",
      "Ježíš kázal v kraji na východním pobřeží Středozemního moře, kudy teče řeka Jordán. Do Řecka víru donesl až apoštol Pavel na svých cestách.",
    ],
    explanation: "Ježíš působil v Palestině, která patřila k Římské říši. Žili tam Židé a z jejich víry křesťanství vyrostlo. Do Řecka, Malé Asie a Itálie se víra dostala až díky apoštolům a dalším kazatelům.",
  },
  {
    q: "Ve kterém městě byl Ježíš ukřižován?",
    correct: "V Jeruzalémě",
    distractors: [
      { value: "V Římě", why: "Řím se stal centrem církve až později. Ježíš do Říma nikdy nepřišel, zemřel v Palestině." },
      { value: "V Athénách", why: "Athény leží v Řecku. Tam kázal až apoštol Pavel, Ježíš v Řecku nebyl." },
      { value: "V Alexandrii", why: "Alexandrie leží v Egyptě. Ježíš zemřel ve městě, které bylo střediskem židovské víry." },
    ],
    hints: [
      "Hledáš město v zemi, kde Ježíš kázal, ne místo, kde později sídlili biskupové církve.",
      "Řím se centrem církve stal až po staletích, nehledej tedy sídlo papeže. Ježíš zemřel v Palestině, v kraji, kde celý život kázal.",
    ],
    explanation: "Ježíš byl ukřižován v Jeruzalémě, hlavním městě Židů, asi kolem roku 30. Odsoudil ho římský místodržitel Pontius Pilát. Řím se centrem církve stal až mnohem později.",
  },
  {
    q: "Z jakého náboženství křesťanství vyrostlo?",
    correct: "Z judaismu",
    distractors: [
      { value: "Z uctívání římských bohů", why: "Římané uctívali mnoho bohů. Křesťanství vzniklo mezi Židy v Palestině a do Říma se dostalo až šířením." },
      { value: "Z řeckých pověstí o bozích", why: "Řecké pověsti vyprávějí o mnoha bozích. Křesťanství převzalo víru v jednoho Boha od Židů." },
      { value: "Z buddhismu", why: "Buddhismus vznikl v Indii a s křesťanstvím nesouvisí. Ježíš a apoštolové byli Židé." },
    ],
    hints: [
      "Zjisti, jakého národa a jaké víry byli Ježíš a jeho první učedníci.",
      "Křesťané převzali posvátné knihy starší víry, dnes první část Bible, i víru v jednoho Boha. Vzpomeň si, který národ tyto knihy sepsal.",
    ],
    explanation: "Křesťanství vyrostlo z judaismu, víry Židů. Ježíš i apoštolové byli Židé a křesťané převzali jejich posvátné knihy jako Starý zákon a víru v jediného Boha.",
  },
  {
    q: "Jak se nazývá druhá část Bible, ve které jsou evangelia?",
    correct: "Nový zákon",
    distractors: [
      { value: "Starý zákon", why: "Starý zákon je první, starší část Bible s posvátnými knihami Židů. Evangelia vznikla až po Ježíšově smrti." },
      { value: "Tóra", why: "Tóra je pět knih Mojžíšových, tedy začátek první části Bible. Evangelia v ní nejsou." },
      { value: "Korán", why: "Korán je posvátná kniha islámu, který vznikl o šest set let později. Do Bible nepatří." },
    ],
    hints: [
      "Bible má dvě části. Jedna vznikla dávno před Ježíšem, druhá až po něm.",
      "Posvátné knihy Židů tvoří první, starší část Bible. Evangelia a listy apoštolů vznikly až po Ježíšově smrti, a proto jejich část dostala jméno, které ji odlišuje od té první.",
    ],
    explanation: "Evangelia jsou v Novém zákoně, druhé části Bible. Vznikl po Ježíšově smrti a obsahuje i listy apoštolů. Starý zákon tvoří posvátné knihy Židů, Korán patří islámu.",
  },
  {
    q: "Kolik evangelií obsahuje Nový zákon?",
    correct: evangelia(4),
    distractors: [
      { value: evangelia(12), why: `Dvanáct je počet apoštolů, ne evangelií. Ježíš si vybral ${apostolu(12)}, evangelia sepsali jen někteří autoři.` },
      { value: evangelia(1), why: "Mluví se sice o „evangeliu“ jako o radostné zvěsti, ale Nový zákon ji vypráví v několika samostatných knihách." },
      { value: evangelia(10), why: "Deset je počet přikázání ze Starého zákona. S počtem evangelií nesouvisí." },
    ],
    hints: [
      "Evangelia se nazývají podle mužů, kterým je tradice připisuje. Vzpomeň si na jejich jména a spočítej je.",
      "Každé evangelium vypráví Ježíšův život trochu jinak a nese jméno jiného muže. Nepleť si jejich počet s počtem apoštolů.",
    ],
    explanation: `Nový zákon obsahuje ${evangelia(4)}: podle Matouše, Marka, Lukáše a Jana. Každé vypráví o Ježíšově životě, smrti a vzkříšení. Dvanáct je počet apoštolů a deset počet přikázání.`,
  },
  {
    q: "Který apoštol podnikl dlouhé misijní cesty a psal listy křesťanským obcím?",
    correct: "Pavel",
    distractors: [
      { value: "Petr", why: "Petr vedl první učedníky a podle tradice působil v Římě jako první biskup. Nejdelší cesty a nejvíc listů obcím patří jinému apoštolovi." },
      { value: "Jidáš", why: "Jidáš Ježíše zradil a víru nešířil. Cesty a listy obcím patří jinému apoštolovi." },
      { value: "Tomáš", why: "Tomáš je známý tím, že pochyboval o Ježíšově vzkříšení. Listy obcím nepsal." },
    ],
    hints: [
      "Hledáš apoštola, který Ježíše za života neznal a k víře se obrátil až později.",
      "Hledaný apoštol se k víře obrátil na cestě do Damašku. Nezaměňuj ho s Petrem, který je spojován hlavně s vedením obce v Římě.",
    ],
    explanation: "Misijní cesty podnikal apoštol Pavel. Putoval po Malé Asii a Řecku, zakládal křesťanské obce a psal jim listy, které jsou dnes součástí Nového zákona.",
  },
  {
    q: "Který apoštol je spojován s Římem a považován za prvního římského biskupa?",
    correct: "Petr",
    distractors: [
      { value: "Pavel", why: "Pavel sice v Římě také kázal, ale proslavil se cestami a listy obcím. Za prvního biskupa Říma se považuje jiný apoštol." },
      { value: "Ondřej", why: "Ondřej byl bratr hledaného apoštola a podle tradice šířil víru u Černého moře a v Řecku. S Římem spojován není." },
      { value: "Tomáš", why: "Tomáš podle tradice odešel šířit víru daleko na východ, až do Indie. Biskupem Říma nebyl." },
    ],
    hints: [
      "Hledáš apoštola, který stál v čele Ježíšových učedníků. Podle evangelií ho Ježíš nazval skálou.",
      "Muž, kterého hledáš, byl rybář z Galileje a vůdce apoštolů. Nezaměňuj ho s apoštolem, který Ježíše za života neznal a proslavil se cestami a listy obcím.",
    ],
    explanation: "S Římem je spojován apoštol Petr. Podle tradice vedl římskou obec jako její první biskup a papežové jsou považováni za jeho nástupce. Pavel se proslavil misijními cestami.",
  },
  {
    q: "Co znamená slovo evangelium?",
    correct: "Radostná zvěst",
    distractors: [
      { value: "Svatá kniha", why: "Svatou knihou je celá Bible. Slovo evangelium označuje zprávu, kterou ty knihy nesou." },
      { value: "Církevní zákon", why: "Evangelium není soubor pravidel. Je to zpráva o Ježíšově životě a o naději pro lidi." },
      { value: "Tajné znamení", why: "Tajným znamením křesťanů byla ryba. Slovo evangelium znamená něco jiného." },
    ],
    hints: [
      "Slovo pochází z řečtiny. Zamysli se, co evangelia lidem oznamovala.",
      "Evangelia vyprávějí o Ježíšově životě a o naději na spásu. Zamysli se, jakou zprávu chtěli první křesťané roznést po světě a jak se při ní cítili.",
    ],
    explanation: "Evangelium znamená radostná (dobrá) zvěst. Křesťané tak nazývali zprávu o Ježíšově životě a vzkříšení. Evangeliem se proto jmenují i knihy, které ji zapisují.",
  },
  {
    q: "Které zvíře používali první křesťané jako tajné znamení?",
    correct: "Rybu",
    distractors: [
      { value: "Orla", why: "Orel byl znakem římských legií. Křesťané potřebovali znamení, kterému rozuměli jen oni." },
      { value: "Sovu", why: "Sova byla symbolem řecké bohyně Athény. S křesťany nesouvisí." },
      { value: "Vlčici", why: "Vlčice je symbolem města Říma podle pověsti o Romulovi a Removi. Křesťanským znamením nebyla." },
    ],
    hints: [
      "Znamení muselo pro Římana vypadat nenápadně, ale křesťan v něm poznal víru.",
      "Hledáš obyčejné zvíře, jehož řecký název tvoří počáteční písmena slov o Ježíši. Orel se nehodil, byl znakem římských legií.",
    ],
    explanation: "Tajným znamením křesťanů byla ryba. Řecké slovo pro rybu (ichthys) tvoří počáteční písmena slov „Ježíš Kristus, Boží Syn, Spasitel“. Orel patřil legiím a vlčice Římu.",
  },
  {
    q: "Kde v Římě první křesťané pohřbívali své mrtvé?",
    correct: "V katakombách",
    distractors: [
      { value: "V pyramidách", why: "Pyramidy stavěli egyptští faraoni jako hrobky. V Římě se křesťané pohřbívali jinde." },
      { value: "V Koloseu", why: "V Koloseu se konaly hry a zápasy. Pohřebištěm nebylo." },
      { value: "V Pantheonu", why: "Pantheon byl chrám zasvěcený římským bohům. Křesťané tam své mrtvé nepohřbívali." },
    ],
    hints: [
      "Rozliš, které místo sloužilo k pohřbívání a které k zábavě nebo k uctívání bohů.",
      "V Koloseu se konaly hry, pohřebištěm nebylo. Vzpomeň si, zda římský zákon dovoloval pohřbívat mrtvé uvnitř městských hradeb, nebo jen za nimi.",
    ],
    explanation: "Křesťané v Římě pohřbívali své mrtvé v katakombách, podzemních chodbách s hroby za hradbami města. Scházeli se tam také k modlitbám za zemřelé.",
  },
  {
    q: "Který císař vydal Milánský edikt?",
    correct: "Konstantin",
    distractors: [
      { value: "Nero", why: "Nero křesťany naopak pronásledoval po požáru Říma roku 64. Edikt vydal až pozdější císař." },
      { value: "Theodosius", why: "Theodosius učinil křesťanství kolem roku 380 státním náboženstvím. Edikt z roku 313 vydal jiný císař." },
      { value: "Dioklecián", why: "Dioklecián rozpoutal poslední velké pronásledování křesťanů. Edikt, který víru povolil, vydal až jiný císař." },
    ],
    hints: [
      "Rozliš císaře, kteří křesťany pronásledovali, od těch, kteří jim pomohli.",
      "Pomůže časová osa: pronásledování roku 64, velké pronásledování na začátku 4. století, edikt roku 313, státní náboženství kolem roku 380. Urči, který z císařů vládl právě roku 313.",
    ],
    explanation: "Milánský edikt vydal roku 313 císař Konstantin spolu se svým spoluvládcem Liciniem. Křesťané pak mohli svou víru vyznávat svobodně. Nero a Dioklecián křesťany pronásledovali, Theodosius z víry udělal státní náboženství.",
  },
  {
    q: "Kdo byl apoštol?",
    correct: "Vyslaný Ježíšův učedník",
    distractors: [
      { value: "Kněz v římském chrámu", why: "Kněží římských chrámů sloužili římským bohům. Apoštolové šířili víru v Ježíše." },
      { value: "Biskup v městě Římě", why: "Biskup vedl křesťanskou obec až později. Apoštolové byli první Ježíšovi následovníci." },
      { value: "Vůdce židovského povstání", why: "Apoštolové nevedli žádné povstání se zbraní. Šířili víru kázáním." },
    ],
    hints: [
      "Rozliš, jestli hledáš lidi, kteří žili s Ježíšem, nebo pozdější úřad v církvi či v římském chrámu.",
      `Ježíš si vybral ${apostolu(12)} ještě za svého života. Biskupové vedli obce až o generace později. Zamysli se, jaký vztah k Ježíšovi měli ti první.`,
    ],
    explanation: `Apoštol znamená posel. Ježíš si vybral ${apostolu(12)}, kteří ho doprovázeli, a vyslal je šířit víru mezi lidi. Apoštolem se nazývá i Pavel, který Ježíše za života neznal.`,
  },
  {
    q: "Kolik bohů uctívají křesťané?",
    correct: "Jediného Boha",
    distractors: [
      { value: "Mnoho bohů jako Římané", why: "Mnoho bohů uctívali Římané a Řekové. Křesťanství převzalo od Židů víru v jednoho Boha." },
      { value: "Tři samostatné bohy", why: "Křesťané mluví o Otci, Synu a Duchu svatém, ale věří, že je to jeden Bůh, ne tři samostatní bohové." },
      { value: "Bohy i císaře", why: "Právě uctívat císaře jako boha křesťané odmítali, a proto je Římané pronásledovali." },
    ],
    hints: [
      "Porovnej křesťany s Židy, ze kterých vzešli, a s Římany, mezi kterými žili.",
      "Křesťané převzali víru od Židů. Vzpomeň si na první z deseti přikázání, která podle Starého zákona dostal Mojžíš.",
    ],
    explanation: "Křesťané uctívají jediného Boha, stejně jako Židé. Tím se lišili od Římanů, kteří měli mnoho bohů a uctívali i císaře. Odmítání obětí bohům a císaři je stavělo proti státu.",
  },
  {
    q: "Který císař zahájil pronásledování křesťanů po velkém požáru Říma?",
    correct: "Nero",
    distractors: [
      { value: "Konstantin", why: "Konstantin křesťany naopak ochránil: roku 313 vydal Milánský edikt, který víru povolil." },
      { value: "Theodosius", why: "Theodosius učinil křesťanství kolem roku 380 státním náboženstvím. Pronásledovatelem nebyl." },
      { value: "Augustus", why: "Za Augusta se Ježíš teprve narodil a křesťané ještě neexistovali. Požár Říma přišel až roku 64." },
    ],
    hints: [
      "Rozliš, který císař křesťany trestal a který jim pomohl.",
      "Požár Říma vypukl roku 64. Augustus tehdy už padesát let nežil. Hledáš císaře, o kterém lidé šířili zvěsti, že požár sám zavinil.",
    ],
    explanation: "Po velkém požáru Říma roku 64 obvinil císař Nero křesťany a dal je krutě trestat. Bylo to první velké pronásledování. Konstantin a Theodosius křesťanství naopak podporovali.",
  },
  {
    q: "Jak se dodnes nazývá biskup Říma?",
    correct: "Papež",
    distractors: [
      { value: "Kardinál", why: "Kardinálové papeže volí a papežem se obvykle stává jeden z nich. Po zvolení ale biskup Říma nese jiný titul." },
      { value: "Apoštol", why: "Apoštolem byl jeden z Ježíšových prvních učedníků. Biskupové Říma jsou až jejich nástupci." },
      { value: "Farář", why: "Farář vede jednu farnost, tedy malé společenství věřících. Biskup Říma stojí v čele celé katolické církve." },
    ],
    hints: [
      "Hledáš titul, který dodnes nosí nástupce apoštola spojeného s Římem.",
      "Titul biskupa Říma vznikl z řeckého slova, kterým děti oslovovaly otce. Apoštoly byli jen první Ježíšovi učedníci, ne jejich pozdější nástupci.",
    ],
    explanation: "Biskup Říma se nazývá papež. Považuje se za nástupce apoštola Petra a stojí v čele katolické církve. Titul pochází z řeckého slova pro otce.",
  },
  {
    q: "Který římský místodržitel odsoudil Ježíše k smrti?",
    correct: "Pontius Pilát",
    distractors: [
      { value: "Herodes Veliký", why: "Herodes Veliký byl židovský král a zemřel krátce po Ježíšově narození. Ježíše k smrti neodsoudil." },
      { value: "Julius Caesar", why: "Julius Caesar byl zavražděn roku 44 př. n. l., dávno před Ježíšovým narozením." },
      { value: "Oktavián Augustus", why: "Augustus byl první římský císař, ne místodržitel. Za jeho vlády se Ježíš teprve narodil." },
    ],
    hints: [
      "Hledáš úředníka, kterého Řím poslal spravovat provincii, ne krále ani císaře.",
      "Hledaný muž spravoval Judsko kolem roku 30 jménem císaře. Julius Caesar tehdy už dávno nežil.",
    ],
    explanation: "Ježíše odsoudil k smrti římský místodržitel Pontius Pilát, který spravoval Judsko. Caesar a Augustus žili dřív a Herodes Veliký byl židovský král.",
  },
];

// ── L2 — POUŽITÍ: čin nebo situace → příčina, role, důsledek ───────────────
export const POOL_L2: Polozka[] = [
  {
    q: "Proč Římané křesťany pronásledovali?",
    correct: "Protože odmítali obětovat bohům a uctívat císaře",
    distractors: [
      { value: "Protože se ozbrojeně bouřili proti římskému vojsku", why: "Křesťané žádnou vzpouru se zbraní nevedli. Trestali je za to, že odmítali obětovat bohům a císaři." },
      { value: "Protože Římané nesnášeli žádnou cizí víru", why: "Řím cizí bohy běžně snášel, třeba maloasijskou Kybelu nebo perského Mithru. Vadilo, že křesťané odmítali obětovat bohům a císaři." },
      { value: "Protože odmítali platit daně do římské pokladny", why: "Křesťané daně platili. Spor byl v tom, že odmítali uctívat císaře jako boha." },
    ],
    hints: [
      "Uvažuj, jakou úctu k císaři a k bohům Římané od obyvatel říše očekávali.",
      "Římané snesli v říši mnoho cizích bohů, pokud lidé zároveň plnili povinnosti ke státu. Zjisti, kterou povinnost křesťan kvůli víře v jediného Boha splnit nemohl a proč to Římané brali jako neúctu k říši.",
    ],
    explanation: "Od křesťanů postavených před soud žádali, aby obětovali bohům a císaři. Cizí víry Římané snášeli, pokud se tato úcta dodržovala. Křesťané oběť odmítali, a proto je Římané považovali za nepřátele státu.",
  },
  {
    q: "Co přinesl Milánský edikt roku 313 křesťanům?",
    correct: "Mohli svou víru vyznávat svobodně a bez trestu",
    distractors: [
      { value: "Křesťanství se stalo jediným povoleným náboženstvím", why: EDIKT_JEN_POVOLIL },
      { value: "Museli se vzdát víry a znovu obětovat bohům", why: "Edikt přinesl pravý opak: pronásledování skončilo a oběti bohům už nikdo po křesťanech nevyžadoval." },
      { value: "Směli se scházet, ale jen v katakombách pod městem", why: "Po ediktu se křesťané nemuseli skrývat, scházeli se veřejně a mohli svobodně stavět kostely." },
    ],
    hints: [
      "Rozliš, zda se víra v tu chvíli jen povolila, nebo stala povinnou pro celý stát.",
      "Edikt vydal Konstantin a státním náboženstvím učinil křesťanství až jiný císař o několik desítek let později. Přemýšlej, co se tedy změnilo pro křesťany, kteří se do té doby báli trestu.",
    ],
    explanation: "Milánský edikt roku 313 křesťanství povolil a zrovnoprávnil s ostatními vírami. Křesťané se už nemuseli skrývat a mohli svobodně stavět kostely. Státním náboženstvím se stalo až kolem roku 380.",
  },
  {
    q: "Proč křesťanství oslovilo hlavně otroky a chudé lidi?",
    correct: "Protože hlásalo, že jsou si před Bohem všichni rovni",
    distractors: [
      { value: "Protože slibovalo otrokům okamžité propuštění na svobodu", why: "Křesťanství otroctví nezrušilo. Otroky oslovilo tím, že v obci měli stejnou hodnotu jako svobodní." },
      { value: "Protože křesťanští biskupové rozdávali chudým půdu", why: "Biskupové půdu nerozdávali. Obce chudým pomáhaly jídlem a útěchou, hlavní ale byla víra v rovnost." },
      { value: "Protože Římané chudým zakazovali uctívat bohy", why: "Chudí Římané bohy uctívat směli. Nová víra je lákala něčím jiným." },
    ],
    hints: [
      "Zamysli se, co mohla nová víra nabídnout člověku, který v říši neměl žádná práva.",
      "Nová víra nabízela útěchu a naději na posmrtný život. Porovnej, jak se na otroka díval římský zákon a jak ho viděla křesťanská obec.",
    ],
    explanation: "Křesťanství hlásalo, že všichni lidé jsou si před Bohem rovni, otrok i pán. Chudým a otrokům navíc slibovalo naději na posmrtný život. Proto k němu přicházeli hlavně lidé bez práv.",
  },
  {
    q: "Proč se první křesťané scházeli tajně?",
    correct: "Protože jim hrozil trest za odmítání obětí bohům a císaři",
    distractors: [
      { value: "Protože jejich obřady směli vidět jen kněží a biskupové", why: "Křesťanských setkání se účastnili všichni věřící. Tajnost měla důvod v chování úřadů." },
      { value: "Protože se v noci připravovali na ozbrojený útok proti Římu", why: "Křesťané žádný útok nechystali. Skrývali se, protože jim hrozil trest." },
      { value: "Protože jim veřejná setkání zakazoval Milánský edikt", why: "Milánský edikt roku 313 přinesl pravý opak: po něm se křesťané mohli scházet veřejně." },
    ],
    hints: [
      "Porovnej, jak se křesťané scházeli před rokem 313 a jak po něm. Co se tím rokem změnilo?",
      "Křesťané nechystali žádnou vzpouru. Vzpomeň si, jak se k nim před rokem 313 chovali císaři jako Nero nebo Dioklecián.",
    ],
    explanation: "Křesťané odmítali obětovat bohům a uctívat císaře, a proto jim hrozilo vězení nebo smrt. Scházeli se tajně v soukromých domech. Veřejně mohli až po Milánském ediktu roku 313.",
  },
  {
    q: "Co udělal císař Theodosius kolem roku 380?",
    correct: "Učinil křesťanství státním náboženstvím říše",
    distractors: [
      { value: "Vydal Milánský edikt a křesťanství jen povolil", why: "Milánský edikt vydal Konstantin už roku 313. Theodosius šel o krok dál." },
      { value: "Zahájil velké pronásledování všech křesťanů", why: "Pronásledování vedli Nero a Dioklecián. Za Theodosia už křesťanům nic nehrozilo." },
      { value: "Ukončil Nerovo pronásledování křesťanů", why: "Nero vládl skoro o tři sta let dřív a jeho pronásledování dávno skončilo. Theodosius rozhodl o postavení víry v celé říši." },
    ],
    hints: [
      "Theodosius vládl skoro sedmdesát let po Milánském ediktu. Co už tehdy platilo a co mohl změnit dál?",
      "Pomůže časová osa: pronásledování roku 64, povolení víry roku 313, Theodosius kolem roku 380. Zvaž, co mohl změnit panovník, který přišel až po povolení.",
    ],
    explanation: "Kolem roku 380 učinil Theodosius křesťanství státním náboženstvím. Konstantin víru roku 313 jen povolil, Theodosius ji povýšil nad ostatní a uctívání starých bohů se začalo omezovat.",
  },
  {
    q: "Proč apoštol Pavel psal listy křesťanským obcím?",
    correct: "Protože s nimi tak zůstával ve spojení na dálku",
    distractors: [
      { value: "Protože mu úřady zakazovaly s křesťany mluvit", why: "Pavel mluvil s lidmi i na cestách. Listy psal, protože nemohl být ve všech městech zároveň." },
      { value: "Protože byl biskupem všech obcí a vydával jim příkazy", why: "Pavel byl apoštol, ne biskup nad všemi obcemi. Obce vedli místní představení a Pavel jim jako jejich zakladatel radil." },
      { value: "Protože mu edikt zakazoval cestovat mezi obcemi", why: "Milánský edikt přišel až roku 313, skoro tři sta let po Pavlovi. Pavel naopak hodně cestoval." },
    ],
    hints: [
      "Pavel založil obce v mnoha městech Malé Asie a Řecka. Mohl být ve všech najednou?",
      "Pavel kázal veřejně a na cestách mluvil s tisíci lidí. Když odešel do dalšího města, obce potřebovaly jeho rady dál. Zamysli se, jak se tehdy dalo radit lidem, kteří žijí stovky kilometrů daleko.",
    ],
    explanation: "Pavel založil křesťanské obce v mnoha vzdálených městech. Nemohl být všude, a tak jim psal listy s radami a povzbuzením. Listy se četly nahlas a staly se součástí Nového zákona.",
  },
  {
    q: "Proč si první křesťané vybrali za tajné znamení rybu?",
    correct: "Protože řecké slovo pro rybu tvoří zkratku Ježíšova titulu",
    distractors: [
      { value: "Protože Ježíš a všichni apoštolové byli rybáři", why: "Rybáři byli jen někteří apoštolové, třeba Petr. Ježíš rybář nebyl a znamení mělo skrytý význam ve slovech." },
      { value: "Protože křesťané nesměli jíst jiné maso než ryby", why: "Žádný takový zákaz v prvních obcích nebyl. Znamení mělo skrytý význam ve slovech." },
      { value: "Protože ryba byla odznakem římských vojáků a úřadů", why: "Znakem legií byl orel. Znak úřadů by pozornost naopak přitahoval." },
    ],
    hints: [
      "Tajné znamení nemělo nepovolaným nic říkat, ale pro křesťana muselo mít skrytý význam.",
      "Křesťané ve východní části říše mluvili řecky. Zkus si představit, že se počáteční písmena několika slov o Ježíši složí do jednoho obyčejného slova. Znak úřadů by naopak přitahoval pozornost.",
    ],
    explanation: "Řecké slovo ichthys (ryba) tvoří počáteční písmena slov „Ježíš Kristus, Boží Syn, Spasitel“. Pro Římana to byl obyčejný obrázek, křesťan v něm poznal víru.",
  },
  {
    q: "Čím se křesťanství nejvíc lišilo od římského náboženství?",
    correct: "Uctívalo jediného Boha místo mnoha bohů",
    distractors: [
      { value: "Uctívalo císaře jako nejvyššího boha", why: "Uctívat císaře jako boha chtěli naopak Římané. Křesťané to odmítali." },
      { value: "Uctívalo bohy v chrámech na náměstích", why: "Chrámy na náměstích stavěli Římané svým bohům. Křesťané se nejdřív scházeli v domech." },
      { value: "Uctívalo stejné bohy pod jinými jmény", why: "Stejné bohy pod jinými jmény měli Řekové a Římané (Zeus a Jupiter). Křesťanství je odmítalo." },
    ],
    hints: [
      "Vzpomeň si, z jaké víry křesťanství vyrostlo a čím se ta víra lišila od okolních národů.",
      "Římané snadno přijímali nové bohy a stavěli jim chrámy, jen to nesmělo narušit úctu k císaři. Křesťan ale nemohl vedle své víry uctívat ještě další bohy. Zamysli se proč.",
    ],
    explanation: "Římané uctívali mnoho bohů i císaře. Křesťané věřili v jediného Boha a jiné bohy odmítali. Právě proto nemohli obětovat římským bohům a císaři, což vedlo k pronásledování.",
  },
  {
    q: "Proč Nero obvinil křesťany z požáru Říma roku 64?",
    correct: "Protože potřeboval svalit vinu na nepopulární skupinu",
    distractors: [
      { value: "Protože křesťané Řím opravdu zapálili na protest", why: "Žádný pramen nedokládá, že by křesťané požár založili. Nero hledal, na koho vinu přesunout." },
      { value: "Protože křesťané tehdy už ovládali římský senát", why: "Křesťanů bylo roku 64 v Římě málo a v senátu neměli moc. Byli snadným terčem." },
      { value: "Protože to vyžadoval zákon vydaný Konstantinem", why: "Konstantin vládl až o víc než dvě stě let později a křesťany chránil." },
    ],
    hints: [
      "Zamysli se, koho lidé v Římě podezírali, když se rozšířily řeči o příčině požáru.",
      "Mezi lidmi kolovaly zvěsti, že za požárem stojí sám císař. Křesťané byli malá skupina, které Římané nerozuměli a nedůvěřovali jí.",
    ],
    explanation: "Po požáru Říma se šířily zvěsti, že ho zavinil sám Nero. Aby podezření odvrátil, obvinil křesťany, kterým lidé nedůvěřovali. Tak začalo první velké pronásledování.",
  },
  {
    q: "Jak pomohly římské silnice šíření křesťanství?",
    correct: "Kazatelé se po nich rychle dostali do vzdálených měst",
    distractors: [
      { value: "Císaři po nich posílali kazatele od samého počátku", why: "První císaři křesťany nepodporovali, ale pronásledovali. Kazatelé cestovali sami." },
      { value: "Silnice postavili křesťané, aby mohli kázat", why: "Silnice stavěli Římané hlavně pro vojsko a obchod, dávno před křesťany. Křesťané je jen využili." },
      { value: "Víru po nich šířili hlavně římští vojáci na rozkaz", why: "Vojáci sloužili císaři a víru na rozkaz nešířili. Kázali apoštolové a další věřící, kteří cestovali sami." },
    ],
    hints: [
      "Zamysli se, jak se ve starověku šířila zpráva, když neexistovaly noviny ani telefon.",
      "Zprávu musel někdo donést pěšky, na voze nebo lodí. Římané spojili říši dobrými cestami a v říši vládl mír. Uvažuj, co to znamenalo pro člověka, který chtěl víru hlásat v mnoha městech.",
    ],
    explanation: "Římské silnice a mír v říši umožnily bezpečné cestování. Apoštolové a další kazatelé se po nich rychle dostali do vzdálených měst a zakládali tam obce.",
  },
  {
    q: "Proč byl apoštol Petr tak důležitý pro křesťany v Římě?",
    correct: "Podle tradice vedl jejich obec jako první biskup",
    distractors: [
      { value: "Podle tradice sepsal pro Řím celý Nový zákon", why: "Nový zákon sepsalo mnoho autorů, například evangelisté a Pavel. Petr ho celý nenapsal." },
      { value: "Podle tradice podnikl nejvíc misijních cest", why: "Nejvíc misijních cest podnikl apoštol Pavel. Petr je spojován s vedením obce v Římě." },
      { value: "Podle tradice byl prvním křesťanským císařem", why: "Prvním císařem, který křesťany podporoval, byl Konstantin. Petr byl apoštol, ne panovník." },
    ],
    hints: [
      "Rozliš role dvou apoštolů spojených s Římem: kdo hlavně cestoval a kdo vedl místní obec.",
      "Katolická církev dodnes považuje každého papeže za nástupce tohoto apoštola. Čím tedy musel pro obec v Římě být?",
    ],
    explanation: "Podle tradice vedl apoštol Petr římskou obec jako její první biskup a v Římě zemřel. Papežové, biskupové Říma, jsou proto považováni za jeho nástupce. Cesty a listy patří Pavlovi.",
  },
  {
    q: "Proč křesťanství dávalo lidem naději i v těžkých dobách?",
    correct: "Protože slibovalo věřícím spásu a život po smrti",
    distractors: [
      { value: "Protože slibovalo věřícím bohatství už na zemi", why: "Křesťanství bohatství neslibovalo, naopak chválilo chudobu a pomoc druhým." },
      { value: "Protože slibovalo věřícím vítězství nad Římem", why: "Křesťané nechystali boj proti Římu. Naději viděli v životě po smrti." },
      { value: "Protože slibovalo věřícím ochranu od císaře", why: "Císaři křesťany dlouho pronásledovali. Ochranu od nich víra slibovat nemohla." },
    ],
    hints: [
      "Rozliš, zda víra slibovala odměnu v tomto životě, nebo až po něm.",
      "Nejdůležitější pro křesťany byla víra v Ježíšovo vzkříšení. Co z ní vyvozovali pro sebe?",
    ],
    explanation: "Křesťanství slibovalo věřícím spásu a věčný život po smrti, stejně jako Ježíš vstal z mrtvých. Lidem v bídě nebo pronásledovaným to dávalo naději a sílu vydržet.",
  },
  {
    q: "Za císaře Diokleciána, krátce před rokem 313, se bořily kostely a pálily posvátné knihy křesťanů. Co to bylo?",
    correct: "Poslední velké pronásledování křesťanů",
    distractors: [
      { value: "Trest za ozbrojené povstání křesťanů", why: "Křesťané žádné povstání nevedli. Trestali je za odmítání obětí bohům a císaři." },
      { value: "Důsledek vydání Milánského ediktu", why: "Edikt přišel až po tomto pronásledování a definitivně potvrdil svobodu víry." },
      { value: "Běžný římský trest pro všechna cizí náboženství", why: "Řím cizí bohy běžně snášel. Takto tvrdě trestal křesťany, protože odmítali obětovat bohům a císaři." },
    ],
    hints: [
      "Porovnej, kdy se to stalo, s rokem, kdy byla víra povolena.",
      "Pronásledování přicházelo ve vlnách od doby Nerona. Zvaž, co následovalo o několik let později a jestli pak mohla přijít další podobná vlna.",
    ],
    explanation: "Za Diokleciána proběhlo poslední velké pronásledování křesťanů. Brzy potom skončilo a roku 313 Milánský edikt definitivně potvrdil svobodu víry.",
  },
  {
    q: "Apoštolové po Ježíšově smrti kázali nejen Židům, ale i lidem z dalších národů. Co to pro křesťanství znamenalo?",
    correct: "Stalo se vírou otevřenou lidem všech národů",
    distractors: [
      { value: "Zůstalo vírou určenou jen pro Židy v Palestině", why: "Víra sice vznikla mezi Židy, ale kázáním ostatním národům se otevřela všem." },
      { value: "Stalo se vírou určenou jen pro římské občany", why: "K víře přicházeli občané i otroci a cizinci. Občanství nerozhodovalo." },
      { value: "Stalo se vírou určenou jen pro vládce a kněze", why: "Křesťanství oslovilo hlavně prosté lidi, chudé a otroky, ne jen vládce." },
    ],
    hints: [
      "Porovnej, komu apoštolové kázali, s tím, komu byla víra na začátku určena.",
      "Pavel založil obce v řeckých městech, kde žili pohané, otroci i svobodní. Kdyby víra patřila jen jednomu národu nebo jedné vrstvě, nemohla by se rozšířit po celé říši.",
    ],
    explanation: "Apoštolové, hlavně Pavel, kázali i lidem, kteří nebyli Židé. Křesťanství se tak stalo vírou pro všechny národy a mohlo se rozšířit po celé Římské říši.",
  },
];

// ── L3 — ANALÝZA: inverze, porovnání, pramen, pořadí, anachronismus ────────
export const POOL_L3: Polozka[] = [
  {
    q: "Ve 2. století stál křesťan před římským soudcem a odmítl obětovat u sochy císaře. Co ho nejspíš čekalo a proč?",
    correct: "Trest, protože úřady to braly jako neúctu k císaři a státu",
    distractors: [
      { value: "Propuštění, protože Milánský edikt víru už povolil", why: "Milánský edikt vznikl až roku 313, tedy ve 4. století. Ve 2. století křesťanům trest hrozil." },
      { value: "Trest, protože Římané zakazovali víru v jakéhokoli boha", why: "Výsledek sedí, důvod ne. Římané víru v bohy nezakazovali, sami jich měli mnoho. Vadilo odmítnutí oběti císaři." },
      { value: "Propuštění, protože Řím snášel všechna náboženství", why: "Řím cizí bohy snášel, ale kdo byl obviněn jako křesťan a odmítl obětovat císaři, byl potrestán." },
    ],
    hints: [
      "Rozhodni zvlášť dvě věci: jaký byl tehdy vztah státu ke křesťanům a co přesně Římanům vadilo.",
      "Zjisti nejdřív, jestli ve 2. století už platilo povolení víry. Pak zvaž, co soudce na chování obviněného viděl jako hlavní provinění.",
    ],
    explanation: "Ve 2. století křesťanství ještě povolené nebylo. Od obviněného křesťana soudce žádal oběť u sochy císaře jako důkaz věrnosti státu, a kdo ji odmítl, byl potrestán. Víru v bohy Římané netrestali, trestali odmítnutí oběti.",
  },
  {
    q: "Apoštol Pavel poslal List Římanům křesťanské obci v Římě dřív, než do města sám poprvé přišel. Co z tohoto pramene vyplývá?",
    correct: "Obec v Římě existovala dřív, než tam přišel Pavel",
    distractors: [
      { value: "Obec v Římě založil sám Pavel na své misijní cestě", why: "Pavel píše obci ve městě, které teprve chce navštívit. Založit ji tedy nemohl." },
      { value: "Obec v Římě založil až Konstantin po roce 313", why: "List Římanům vznikl v 1. století, skoro tři sta let před Konstantinem. Obec tedy existovala dávno před ním." },
      { value: "Obec v Římě byla starší než obec v Jeruzalémě", why: "Víra vznikla v Jeruzalémě a do Říma se dostala až šířením. Starší být obec v Římě nemohla." },
    ],
    hints: [
      "Všimni si, co se stalo dřív: odeslání dopisu, nebo Pavlův příchod do Říma.",
      "Kdo posílá dopis do města, kde nikdy nebyl, počítá s tím, že ho tam někdo přečte. Rozmysli, co to říká o lidech, kteří tam dopis dostali.",
    ],
    explanation: "Pavel psal List Římanům obci, která už v Římě existovala, a teprve potom do města přišel. Víru tam donesli dřív neznámí věřící, kupci a přistěhovalci. Víra přitom vznikla v Palestině a Konstantin žil až o staletí později.",
  },
  {
    q: "Který z faktorů rychlé šíření křesťanství v Římské říši NEvysvětluje?",
    correct: "Podpora římských císařů od prvního století",
    distractors: [
      { value: "Síť dobrých silnic a námořních cest v říši", why: "Tento faktor šíření vysvětluje: kazatelé po silnicích a lodích rychle cestovali." },
      { value: "Řečtina a latina jako společné jazyky říše", why: "Tento faktor šíření vysvětluje: kazatelům rozuměli lidé v mnoha zemích." },
      { value: "Mír uvnitř říše a bezpečné cestování", why: "Tento faktor šíření vysvětluje: v míru se dalo bezpečně putovat z města do města." },
    ],
    hints: [
      "U každého faktoru ověř, jestli v 1. a 2. století opravdu platil.",
      "U každé možnosti si polož stejnou otázku: pomáhala tahle věc kazateli dostat se k lidem a domluvit se s nimi už v době apoštola Pavla?",
    ],
    explanation: "Císaři křesťany dlouho pronásledovali, podporovat je začal až Konstantin ve 4. století. Víra se šířila i bez nich díky silnicím, míru v říši a společné řečtině a latině.",
  },
  {
    q: "Archeologové našli v podzemní chodbě pod Římem vyrytý obrázek ryby a vedle něj hroby. Co tento nález nejspíš dokládá?",
    correct: "Že tu pohřbívali své mrtvé křesťané",
    distractors: [
      { value: "Že tu stál chrám boha moře Neptuna", why: "Chrámy římských bohů stály na povrchu, ne v podzemí mezi hroby. Ryba tu má jiný význam." },
      { value: "Že tu byli pohřbeni římští rybáři a námořníci", why: "Ryba vedle hrobů není znak řemesla. Byla to znamení, podle kterého se poznávali křesťané." },
      { value: "Že tu po roce 380 stál kostel postavený státem", why: "Kostel postavený státem by stál veřejně na povrchu. Podzemní chodby s hroby sloužily k pohřbívání." },
    ],
    hints: [
      "Spoj dohromady všechny tři stopy: místo pod zemí, obrázek a hroby.",
      "Vzpomeň si, kdo používal rybu jako své znamení a jak se v Římě nazývala podzemní pohřebiště za hradbami.",
    ],
    explanation: "Podzemní chodby s hroby jsou katakomby a ryba byla znamením křesťanů. Nález dokládá, že tu křesťané pohřbívali své mrtvé a scházeli se tu k modlitbám za zemřelé. Bohoslužby se konaly hlavně v soukromých domech.",
  },
  {
    q: "Které tvrzení o pořadí událostí je pravdivé?",
    correct: "Pronásledování za Nera předcházelo Milánskému ediktu",
    distractors: [
      { value: "Milánský edikt předcházel pronásledování za Nera", why: "Nero pronásledoval křesťany po roce 64, edikt je z roku 313. Je to obráceně." },
      { value: "Státní náboženství předcházelo Milánskému ediktu", why: "Edikt roku 313 víru jen povolil, státní se stala až kolem roku 380. Je to obráceně." },
      { value: "Milánský edikt předcházel Ježíšovu ukřižování", why: "Ježíš byl ukřižován asi kolem roku 30, edikt přišel skoro o tři sta let později." },
    ],
    hints: [
      "Přiřaď každé události přibližný letopočet a pak porovnávej vždy jen jednu dvojici.",
      "Pomůže časová osa se čtyřmi roky: asi 30, 64, 313 a kolem 380. Každé tvrzení porovnává jen dvě události, tak jim přiřaď roky a zkontroluj, která je menší.",
    ],
    explanation: "Pořadí je: ukřižování Ježíše (asi kolem roku 30), pronásledování za Nera (po roce 64), Milánský edikt (313), státní náboženství (kolem roku 380). Pravdivé je jen tvrzení, že Nero byl před ediktem.",
  },
  {
    q: "Která posloupnost řadí události od nejstarší po nejmladší správně?",
    correct: "Ukřižování → požár Říma za Nera → Milánský edikt → státní náboženství",
    distractors: [
      { value: "Ukřižování → Milánský edikt → požár Říma za Nera → státní náboženství", why: "Požár Říma a Nerovo pronásledování jsou z roku 64, edikt až z roku 313." },
      { value: "Požár Říma za Nera → ukřižování → Milánský edikt → státní náboženství", why: "Ježíš byl ukřižován asi kolem roku 30, tedy dřív než požár Říma roku 64." },
      { value: "Ukřižování → požár Říma za Nera → státní náboženství → Milánský edikt", why: EDIKT_JEN_POVOLIL },
    ],
    hints: [
      "Ke každé události si vybav přibližný rok a teprve pak je porovnej.",
      "Víra musela nejdřív vzniknout, než ji mohl někdo pronásledovat. A než stát víru sám prosazuje, musí ji nejdřív přestat trestat. Z toho odvodíš obě dvojice, ve kterých se možnosti liší.",
    ],
    explanation: "Ježíš byl ukřižován asi kolem roku 30. Roku 64 vypukl požár Říma a Nero začal křesťany pronásledovat. Roku 313 Milánský edikt víru povolil a kolem roku 380 se stala státním náboženstvím.",
  },
  {
    q: "Které tvrzení nemohlo platit v 1. století našeho letopočtu?",
    correct: "Křesťané se veřejně scházeli v kostelech povolených státem",
    distractors: [
      { value: "Apoštol Pavel putoval s vírou po Malé Asii a Řecku", why: "Pavel cestoval kolem poloviny 1. století. Tvrzení do této doby patří." },
      { value: "Křesťané v Římě trpěli pronásledováním za Nera", why: "Nero pronásledoval křesťany po roce 64, tedy v 1. století. Tvrzení platí." },
      { value: "Křesťané v Jeruzalémě byli většinou Židé", why: "První křesťané v Jeruzalémě vyšli z židovské víry. Tvrzení do 1. století patří." },
    ],
    hints: [
      "U každého tvrzení urči, ze kterého století pochází to, co popisuje.",
      "První století končí rokem 100. U každého tvrzení rozmysli, jestli nepotřebuje něco, co přišlo až mnohem později, třeba změnu v postoji státu.",
    ],
    explanation: "Veřejně v kostelech povolených státem se křesťané mohli scházet až po Milánském ediktu roku 313, tedy ve 4. století. Pavlovy cesty, Nerovo pronásledování i první obec Židů, kteří uvěřili v Ježíše, patří do 1. století.",
  },
  {
    q: "Apoštol Pavel byl římský občan a mluvil řecky. Proč mu to při šíření víry pomohlo?",
    correct: "Mohl cestovat po říši a řecky mu rozuměli v mnoha městech",
    distractors: [
      { value: "Mohl jako římský občan vydávat zákony povolující víru", why: "Občan zákony vydávat nemohl, to dělali císaři. Víru povolil až Konstantin roku 313." },
      { value: "Mohl kázat v Palestině, kde se mluvilo jen řecky", why: "V Palestině mluvila většina lidí aramejsky. Řečtina pomáhala hlavně ve městech Malé Asie a Řecka." },
      { value: "Mohl jako římský občan zakázat pronásledování křesťanů", why: "Pronásledování nemohl zakázat žádný občan, to mohli jen císaři." },
    ],
    hints: [
      "Rozeber zvlášť výhodu občanství a zvlášť výhodu jazyka.",
      "Římský občan měl u úřadů ochranu a mohl se odvolat k císaři, ale zákony vydávat nemohl. Zjisti, jakým jazykem se ve východní části říše domlouvali lidé z různých národů.",
    ],
    explanation: "Římské občanství dávalo Pavlovi ochranu na cestách a u úřadů. Řečtina byla společným jazykem východní části říše, a tak mu rozuměli v Malé Asii, v Řecku i v dalších městech.",
  },
  {
    q: "Víra vznikla v Jeruzalémě. Proč se přesto centrem církve stal Řím?",
    correct: "Protože byl hlavním městem říše a působil v něm Petr",
    distractors: [
      { value: "Protože Ježíš podle evangelií kázal hlavně v Římě", why: "Ježíš kázal v Palestině a do Říma nikdy nepřišel. Víra se tam dostala až šířením." },
      { value: "Protože Jeruzalém ležel mimo území Římské říše", why: "Jeruzalém patřil do Římské říše, spravoval ho římský místodržitel." },
      { value: "Protože v Římě vydal Konstantin Milánský edikt", why: "Edikt nese jméno města Milána. Řím byl důležitý z jiných důvodů." },
    ],
    hints: [
      "Zamysli se, odkud se v říši řídilo všechno důležité a kdo z apoštolů tam podle tradice vedl obec.",
      "Jeruzalém spravoval římský místodržitel. Uvažuj, proč by zpráva z hlavního města dorazila rychleji do celé říše.",
    ],
    explanation: "Řím byl hlavním městem říše, vedly do něj silnice a zprávy z něj se šířily všude. Podle tradice tu působil a zemřel apoštol Petr, první biskup Říma. Proto se Řím stal centrem církve.",
  },
  {
    q: "Představ si, že by Konstantin roku 313 edikt nevydal. Co by pro křesťany nejspíš trvalo dál?",
    correct: "Hrozba trestu za odmítání obětí bohům",
    distractors: [
      { value: "Postavení křesťanství jako státní víry", why: "Státní vírou křesťanství před rokem 313 nebylo. To přišlo až za Theodosia kolem roku 380." },
      { value: "Svobodná stavba kostelů po celé říši", why: "Svobodnou stavbu kostelů přinesl právě edikt. Bez něj by nevznikla." },
      { value: "Svobodné vyznávání víry bez trestu", why: "Svobodné vyznávání víry přinesl právě edikt. Bez něj by křesťanům trest hrozil dál." },
    ],
    hints: [
      "Zjisti, jaký byl stav křesťanů těsně před rokem 313, a představ si, že by se nezměnil.",
      "Státní náboženství přišlo až kolem roku 380. Zbylé možnosti roztřiď podle toho, jestli popisují stav před ediktem, nebo po něm.",
    ],
    explanation: "Před rokem 313 hrozil křesťanům trest za to, že odmítali obětovat bohům a císaři. Edikt tuto hrozbu ukončil, přinesl svobodu víry a dovolil stavět kostely. Bez něj by pronásledování mohlo pokračovat.",
  },
  {
    q: "Římský dějepisec Tacitus zapsal, že Nero po požáru Říma obvinil skupinu lidí, kterou lid nenáviděl. O kom psal?",
    correct: "O křesťanech, na které svedl vinu za požár",
    distractors: [
      { value: "O křesťanech, kteří Řím skutečně zapálili", why: "Tacitus píše, že Nero chtěl odvrátit podezření od sebe. Že by křesťané požár založili, nedokládá." },
      { value: "O gladiátorech, kteří se vzbouřili v aréně", why: "Velké povstání gladiátorů vedl Spartakus o víc než sto let dřív. S požárem Říma nesouvisí." },
      { value: "O Germánech, kteří Řím dobyli a vypálili", why: "Germánské kmeny dobyly Řím až v 5. století. Za Nera se to nestalo." },
    ],
    hints: [
      "Zamysli se, proč by císař potřeboval někoho obvinit, a jaká skupina se k tomu tehdy hodila.",
      "Pramen říká, že skupinu lid nenáviděl, ne že vinu prokázal. Po městě se šířily zvěsti proti samotnému císaři.",
    ],
    explanation: "Tacitus psal o křesťanech. Po městě se šířily zvěsti, že požár zavinil sám Nero, a ten proto vinu svedl na skupinu, které lidé nedůvěřovali. Pramen ukazuje, že křesťané byli obětí, ne pachateli.",
  },
  {
    q: "Theodosius učinil křesťanství státním náboženstvím. Který krok musel přijít dřív, aby to bylo možné?",
    correct: "Povolení víry Milánským ediktem",
    distractors: [
      { value: "Rozdělení církve na východní a západní", why: "Církev se rozdělila až roku 1054, ve středověku. To je mnohem později." },
      { value: "Pád Západořímské říše a konec císařů", why: "Západořímská říše padla roku 476, tedy až po Theodosiovi. Bez císaře by státní náboženství nevyhlásil." },
      { value: "Přijetí křesťanství u Slovanů na Moravě", why: "Na Moravu se křesťanství dostalo až v 9. století, nejprve od franských kněží. Roku 863 přišli Cyril a Metoděj." },
    ],
    hints: [
      "Stát nemůže prosazovat víru, kterou sám trestá. Co se muselo změnit nejdřív?",
      "Theodosius vládl kolem roku 380. Ke každé možnosti si vybav přibližnou dobu a ponech jen to, co se stalo před ním.",
    ],
    explanation: "Aby mohla být víra státní, musela být nejdřív povolená. To udělal Konstantin Milánským ediktem roku 313. Theodosius pak kolem roku 380 šel o krok dál. Ostatní události přišly až po něm.",
  },
  {
    q: "Spolužák tvrdí: „Křesťanství vzniklo v Římě, protože tam sídlí papež.“ V čem je chyba jeho úvahy?",
    correct: "Sídlo papeže je pozdější stav, víra vznikla v Palestině",
    distractors: [
      { value: "Chyba tam není, víra opravdu vznikla v Římě", why: "Víra vznikla v Palestině mezi Židy. Do Říma se dostala až šířením." },
      { value: "Víra vznikla v Řecku, odkud ji přinesl Pavel", why: "Pavel v Řecku zakládal obce, ale víra tam nevznikla. Vznikla v Palestině." },
      { value: "Víra vznikla v Egyptě a papež sídlí v Alexandrii", why: "Víra nevznikla v Egyptě a biskup Říma sídlí v Římě. Chyba je v tom, že spolužák plete pozdější stav s počátkem." },
    ],
    hints: [
      "Rozliš, kde víra začala, a kde se její vedení usadilo až po staletích šíření.",
      "To, kde dnes nějaká instituce sídlí, nemusí být místo, kde vznikla. Vzpomeň si, kde kázal Ježíš a kam víru donesli jeho následovníci až potom.",
    ],
    explanation: "Spolužák přenáší pozdější stav na počátek. Křesťanství vzniklo v Palestině mezi Židy. Do Říma ho donesli první věřící a apoštolové a teprve pak se Řím stal sídlem biskupa, tedy papeže.",
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
export const VZNIK_SIRENI_KRESTANSTVI: TopicMetadata[] = [
  {
    id: "g6-dej-vznik-sireni-krestanstvi-6",
    rvpNodeId: "g6-dejepis-starovek-antika-rim-vznik-a-sireni-krestanstvi",
    displayName: "Vznik a šíření křesťanství",
    title: "Vznik a šíření křesťanství",
    studentTitle: "Jak se šířilo křesťanství",
    subject: "dejepis",
    category: "Starověk",
    topic: "Antika - Řím",
    briefDescription: "Ježíš, apoštolové, pronásledování křesťanů a proč se nová víra rozšířila po říši",
    keywords: [
      "křesťanství", "Ježíš", "Palestina", "Jeruzalém", "judaismus", "Bible", "Nový zákon", "evangelium",
      "apoštol", "Petr", "Pavel", "Nero", "pronásledování", "katakomby", "ryba", "Milánský edikt",
      "Konstantin", "Theodosius", "papež",
    ],
    goals: [
      "Vysvětlit, kde a z jaké víry křesťanství vzniklo.",
      "Vysvětlit, proč Římané křesťany pronásledovali a proč se víra přesto šířila.",
      "Rozlišit povolení víry Milánským ediktem (313) od státního náboženství za Theodosia (kolem 380).",
      "Přiřadit osoby (Ježíš, Petr, Pavel, Nero, Konstantin, Theodosius) k jejich roli.",
    ],
    boundaries: [
      "Jen fakta, na kterých se shodují učebnice 6. ročníku; rok ukřižování jen „asi kolem roku 30“.",
      "Pevný letopočet je jen Milánský edikt 313; Theodosius vždy „kolem roku 380“.",
      "Rozdělení církve (1054) a sporné detaily nejsou klíčem.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Pořadí: Ježíš v Palestině (asi kolem 30) → pronásledování za Nera (64) → Milánský edikt, povolení (313) → státní náboženství za Theodosia (kolem 380).",
      steps: [
        "Najdi v zadání kotvu: osobu, místo nebo událost (požár Říma, edikt, misijní cesty).",
        "Urči, jestli jde o dobu pronásledování, povolení, nebo státního náboženství.",
        "Zkontroluj, jestli možnost nepřenáší pozdější stav (Řím, papež) na počátek víry.",
      ],
      commonMistake: "Myslet si, že Milánský edikt udělal z křesťanství státní náboženství, nebo že víra vznikla v Římě.",
      example: "Nero křesťany pronásledoval, Konstantin roku 313 víru povolil a Theodosius z ní kolem roku 380 udělal státní náboženství.",
    },
  },
];
