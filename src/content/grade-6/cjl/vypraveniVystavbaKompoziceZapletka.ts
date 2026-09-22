/**
 * Čeština 6. ročník — Komunikační a slohová výchova: Vyprávění — výstavba,
 * kompozice, zápletka (select_one).
 *
 * Úplné vyprávění mívá pět částí: úvod (kdo, kde, kdy — problém ještě
 * nevzniká) – zápletka (vznik problému) – vyvrcholení (největší napětí) –
 * obrat (nečekaná změna směřující k rozuzlení; nemusí být v každém příběhu)
 * – závěr (rozuzlení, ohlédnutí). Banka `STAVBA` má 18 vlastních krátkých
 * příběhů, každý jako pole pěti vět v tomto pořadí (`PARTS`).
 *
 * Příběhy jsou rozdělené do tří DISJUNKTNÍCH skupin podle úrovně (`uroven`),
 * takže se tentýž příběh v jednom sezení neobjeví na více úrovních a žák
 * u vyšší úrovně nezná odpověď z paměti. Obraty a závěry nezačínají jednou
 * formulkou („Tu se ale ukázalo…“, „Nakonec…“) a zápletky nejsou vždy uvozené
 * slovem „ale“ — část se musí poznat podle funkce v ději, ne podle úvodního
 * slova.
 *
 *  • L1 — rozpoznání pojmu: samostatná citovaná věta → která část (jen
 *    úvod, zápletka, závěr — ty jsou poznat i z vytržené věty), nebo
 *    definice části → která to je.
 *  • L2 — použití v souvislém textu: věta v kontextu celého příběhu (těžké
 *    dvojice zápletka×vyvrcholení, obrat×závěr), která věta je zápletka,
 *    která věta přijde jako další (distraktory = věty, které v textu ještě
 *    nezazněly: pozdější části téhož příběhu a doplňující věta úvodu/závěru).
 *  • L3 — analýza stavby celého příběhu (přenos): (a) převod retrospektivního
 *    vyprávění na chronologické (kterou větou by děj začínal popořadě),
 *    (b) porušená posloupnost (které číslo věty stojí na špatném místě —
 *    posunout se může kterákoli část), (c) chybějící část osnovy,
 *    (d) skutečná zápletka × vedlejší nepříjemnost, která jen vypadá jako
 *    problém (úvod L3 příběhů ji schválně obsahuje).
 *
 * Chybový model (viz PAIR_FEEDBACK a optionFeedback u každé úlohy):
 *  • zápletka × vyvrcholení — problém vzniká × je největší napětí.
 *  • obrat × závěr — mění směr děje × jen uzavírá a hodnotí.
 *  • úvod × zápletka — jen představuje × v ní teprve vzniká problém.
 *  • retrospektivní text — žák za začátek děje považuje první větu textu.
 *  • drobná nepříjemnost × zápletka — žák bere za zápletku první zmínku
 *    o čemkoli nepříjemném.
 *
 * Nápovědy (hints) NIKDY nejmenují žádný z pěti názvů částí (úvod, zápletka,
 * vyvrcholení, obrat, závěr) u úloh, kde je klíčem název části. Obě nápovědy
 * se vážou ke konkrétní úloze (příběh, citovaný začátek věty, místo zlomu).
 *
 * Skládání textů: `EXPL` je přísudek pro podmět „Tahle věta/část …“, `REL`
 * je vztažná věta za „věta, …“ — nikdy se nezaměňují (věta není „chvíle“).
 *
 * Termíny učebnic (expozice, kolize, krize, peripetie) se nepoužívají, jen
 * česká pojmenování.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { pick, pickN, buildChoiceTask as choice, losUlohy, ruzneUlohy } from "./_shared";

// ═══════════════════════════════════════════════════════════════════════
// Pět částí kompozice
// ═══════════════════════════════════════════════════════════════════════

type Cast = "úvod" | "zápletka" | "vyvrcholení" | "obrat" | "závěr";
const PARTS: Cast[] = ["úvod", "zápletka", "vyvrcholení", "obrat", "závěr"];

/** Přísudek pro podmět „Tahle věta …“ / „Tahle část …“ (ženský rod). */
const EXPL: Record<Cast, string> = {
  "úvod": "teprve představuje, kdo, kde a kdy se příběh odehrává – problém v ní ještě nevzniká",
  "zápletka": "zachycuje chvíli, kdy poprvé vznikne problém, který příběh rozjede",
  "vyvrcholení": "zachycuje chvíli největšího napětí, kdy se rozhoduje, jak vše dopadne",
  "obrat": "přináší nečekanou změnu, po které se děj stočí k rozuzlení",
  "závěr": "příběh uzavírá a ukazuje, jak vše nakonec dopadlo",
};

/** Vztažná věta za „věta, …“. */
const REL: Record<Cast, string> = {
  "úvod": "která jen představuje, kdo, kde a kdy se příběh odehrává",
  "zápletka": "ve které poprvé vznikne problém",
  "vyvrcholení": "která zachycuje chvíli největšího napětí",
  "obrat": "která přináší nečekanou změnu a stáčí děj k rozuzlení",
  "závěr": "která příběh uzavírá a ukazuje, jak vše dopadlo",
};

/** Pro každou část 3 nejčastěji zaměňované sousední části (pětice → 4 možnosti). */
const DISTRACTORS_FOR: Record<Cast, Cast[]> = {
  "úvod": ["zápletka", "vyvrcholení", "závěr"],
  "zápletka": ["úvod", "vyvrcholení", "obrat"],
  "vyvrcholení": ["zápletka", "obrat", "závěr"],
  "obrat": ["vyvrcholení", "závěr", "zápletka"],
  "závěr": ["obrat", "vyvrcholení", "úvod"],
};

/** Chybový model pro všech 10 dvojic částí (viz hlavička souboru). */
const PARY: [Cast, Cast, string][] = [
  ["úvod", "zápletka", "Úvod jen představuje, kdo, kde a kdy – problém v něm ještě nevzniká. Zápletka je až chvíle, kdy se problém poprvé objeví."],
  ["úvod", "vyvrcholení", "Úvod teprve představuje postavy a místo. Vyvrcholení je až chvíle s největším napětím, kdy se rozhoduje, jak to dopadne."],
  ["úvod", "obrat", "Úvod na začátku jen představí, kdo, kde a kdy. Obrat je až pozdější nečekaný zvrat, po kterém se děj stočí jinam."],
  ["úvod", "závěr", "Úvod příběh teprve otevírá. Závěr ho naopak uzavírá a shrnuje, jak vše dopadlo."],
  ["zápletka", "vyvrcholení", "Zápletka problém teprve otvírá. Vyvrcholení je až chvíle, kdy se rozhoduje, jak to dopadne."],
  ["zápletka", "obrat", "Zápletka problém teprve otvírá. Obrat je až pozdější nečekaný zvrat, který děj stočí k rozuzlení."],
  ["zápletka", "závěr", "Zápletka je chvíle, kdy problém teprve vzniká. Závěr příběh naopak uzavírá."],
  ["vyvrcholení", "obrat", "Vyvrcholení je chvíle s největším napětím. Obrat je až následná nečekaná změna, která napětí rozetne a nasměruje děj k rozuzlení."],
  ["vyvrcholení", "závěr", "Vyvrcholení je chvíle s největším napětím. Závěr přichází až po něm a příběh uzavírá."],
  ["obrat", "závěr", "Obrat ještě mění směr děje. Závěr děj už jen uzavírá a ukazuje, jak vše dopadlo."],
];
const PAIR_FEEDBACK = new Map<string, string>();
for (const [a, b, txt] of PARY) {
  PAIR_FEEDBACK.set(`${a}|${b}`, txt);
  PAIR_FEEDBACK.set(`${b}|${a}`, txt);
}
function feedbackPart(distractor: Cast, correct: Cast): string {
  return PAIR_FEEDBACK.get(`${distractor}|${correct}`)!;
}

// ═══════════════════════════════════════════════════════════════════════
// Banka příběhů — STAVBA: pole pěti vět v pořadí PARTS
// ═══════════════════════════════════════════════════════════════════════

interface Pribeh {
  id: string;
  /** Úroveň, na které se příběh používá (skupiny jsou disjunktní). */
  uroven: 1 | 2 | 3;
  /** Krátký odkaz na příběh do nápověd/otázek ("o táboře"). */
  nazev: string;
  vety: [string, string, string, string, string];
  /**
   * Jen L2: dvě NOVÉ věty téhož příběhu, které v textu nikdy nezazní —
   * doplňující informace do úvodu a věta, která patří až úplně na konec.
   * Slouží jako distraktory v úloze „co přijde jako další“.
   */
  navic?: { uvod: string; zaver: string };
}

const STAVBA: Pribeh[] = [
  // ── L1 ────────────────────────────────────────────────────────────────
  {
    id: "tabor",
    uroven: 1,
    nazev: "o táboře",
    vety: [
      "První den letního tábora u rybníka si Tomáš vybral místo v chatce hned vedle svého kamaráda Honzy.",
      "Druhý den ráno ale zjistil, že mu z batohu zmizela baterka, bez které se do lesa nesměl.",
      "Srdce mu bušilo, když prohledával poslední tmavý kout chatky a baterku pořád nikde neviděl.",
      "Vtom do chatky nahlédl vedoucí tábora s Tomášovou baterkou v ruce – večer si ji půjčil, aby ji přes noc nabil, a zapomněl mu to říct.",
      "Od té chvíle si Tomáš baterku vždycky večer sám zkontroloval, než šel spát.",
    ],
  },
  {
    id: "ztraceny-klic",
    uroven: 1,
    nazev: "o ztraceném klíči",
    vety: [
      "Jana se v pátek odpoledne vracela ze školy domů a cestou počítala dny do prázdnin.",
      "Před domovními dveřmi sáhla do kapsy a klíč od bytu v ní nenahmatala.",
      "Zvonila na sousedy jednoho po druhém a s každým dalším tichým zvonkem se bála víc a víc.",
      "Když si zkřehlé ruce strčila do druhé kapsy u bundy, nahmatala v ní něco studeného a kovového – ztracený klíč.",
      "Ještě týž večer si Jana navlékla klíč na tkaničku, aby se jí to už nikdy nestalo.",
    ],
  },
  {
    id: "zapas",
    uroven: 1,
    nazev: "o fotbalovém zápase",
    vety: [
      "V sobotu ráno nastoupil Ondra na fotbalové hřiště jako brankář do rozhodujícího zápasu sezóny.",
      "Deset minut před koncem soupeř vyrovnal na 1:1 a Ondrovým spoluhráčům začínaly docházet síly.",
      "V poslední minutě se útočník soupeře ocitl sám před Ondrou a vystřelil – celé hřiště na okamžik ztichlo.",
      "Ondra ale míč chytil, hned ho vykopl daleko dopředu a jeho spoluhráč v poslední vteřině vstřelil vítězný gól.",
      "Po zápase Ondru spoluhráči nadšeně objímali uprostřed hřiště.",
    ],
  },
  {
    id: "bourka-na-chate",
    uroven: 1,
    nazev: "o bouřce na chatě",
    vety: [
      "O letních prázdninách trávil Marek týden na chatě u babičky uprostřed lesa.",
      "Jednoho večera se obloha během chvíle zatáhla černými mraky a v dálce zahřmělo.",
      "Blesky práskaly čím dál blíž, a když s dalším zahřměním zhasla všechna světla, Marek se schoval pod peřinu.",
      "Babička ale v klidu vytáhla ze šuplíku svíčky, zapálila je a chata se rozzářila teplým světlem.",
      "Zbytek večera si při svíčkách vyprávěli příběhy a bouřka Marka přestala děsit.",
    ],
  },
  {
    id: "soutez-ve-vareni",
    uroven: 1,
    nazev: "o soutěži ve vaření",
    vety: [
      "Simona se přihlásila do školní soutěže ve vaření se svým receptem na bramborové placky.",
      "Když v šatně vybalovala tašku, zjistila, že doma zapomněla klíčovou přísadu – čerstvý česnek.",
      "Do začátku soutěže zbývalo pět minut a Simona zoufale probírala tašku, jestli tam přece jen něco nenajde.",
      "Pomoc přišla odjinud: kuchařka ze školní jídelny měla náhradní stroužek česneku a ráda jí ho dala.",
      "Simona se svými plackami obsadila druhé místo a ze soutěže odcházela celá rozzářená.",
    ],
  },
  {
    id: "cesta-vlakem",
    uroven: 1,
    nazev: "o cestě vlakem",
    vety: [
      "O jarních prázdninách jela Lucie poprvé sama vlakem za tetou do Olomouce.",
      "Po hodině jízdy ji průvodčí upozornil, že sedí ve vagonu, který se v příští stanici odpojí a pojede jinam.",
      "Vlak už brzdil před stanicí a Lucie s těžkým kufrem marně hledala, kudy se dostat do správného vagonu.",
      "Vtom jí jeden cestující ochotně vzal kufr a provedl ji uličkou až do vedlejšího vagonu.",
      "Do Olomouce dorazila včas a teta jí na nástupišti mávala už z dálky.",
    ],
  },
  // ── L2 ────────────────────────────────────────────────────────────────
  {
    id: "skolni-predstaveni",
    uroven: 2,
    nazev: "o školním představení",
    vety: [
      "Kuba dostal ve školním představení roli krále a týdny se učil svoji jedinou dlouhou repliku.",
      "Těsně před začátkem představení ale zjistil, že mu ze scény zmizela papírová koruna.",
      "Za oponou horečně prohledával krabice s kostýmy, zatímco diváci v sále už netrpělivě čekali.",
      "Najednou si všiml, že jeho korunu má omylem na hlavě spolužačka, která hrála princeznu.",
      "Rychle si koruny vyměnili a představení pak sklidilo velký potlesk.",
    ],
    navic: {
      uvod: "Kuba chodil do šesté třídy a divadelní kroužek ho bavil ze všeho nejvíc.",
      zaver: "Po představení si Kuba korunu odnesl domů na památku.",
    },
  },
  {
    id: "ztracene-morce",
    uroven: 2,
    nazev: "o ztraceném morčeti",
    vety: [
      "Bára měla doma morče jménem Skvrnka, kterému každý den po škole čistila klec.",
      "Jednou odpoledne našla klec otevřenou a Skvrnka v ní nebyla.",
      "Prohledávala byt pokoj po pokoji a se strachem si představovala, co všechno se morčeti mohlo stát.",
      "Z krabice od bot pod postelí se vtom ozvalo tiché chroupání a vykoukla z ní Skvrnka.",
      "Od té chvíle si Bára dávala pozor, aby klec vždycky pořádně zavřela.",
    ],
    navic: {
      uvod: "Skvrnka byla hnědobílá a ze všeho nejraději měla mrkev.",
      zaver: "Večer dala Bára Skvrnce na usmířenou tu největší mrkev.",
    },
  },
  {
    id: "vyprava-do-sklepa",
    uroven: 2,
    nazev: "o výpravě do sklepa",
    vety: [
      "Petr s bratrancem se rozhodli o víkendu prozkoumat starý sklep na chalupě, kam se báli chodit sami.",
      "Sotva otevřeli vrzající dveře, uslyšeli ze tmy podivné škrábání.",
      "Stáli na schodech s baterkou v ruce a zvuk se ozýval čím dál blíž k nim.",
      "Když konečně posvítili do rohu, zablýskly se tam dvě oči – byla to jen sousedova kočka, která se schovala před deštěm.",
      "Kočku odnesli sousedům a ze sklepa si pak udělali oblíbené místo na hraní.",
    ],
    navic: {
      uvod: "Chalupa patřila jejich dědovi a stála na samém konci vesnice.",
      zaver: "Sousedka jim za nalezenou kočku upekla bábovku.",
    },
  },
  {
    id: "vylet-na-kole",
    uroven: 2,
    nazev: "o výletu na kole",
    vety: [
      "Adéla se s tátou v neděli ráno vydala na první delší cyklovýlet podél řeky.",
      "Na půli cesty ale zaslechla podivné syčení a zjistila, že jí praskla duše v zadním kole.",
      "Stáli uprostřed lesa bez signálu a slunce se pomalu chýlilo k obzoru.",
      "Táta se najednou usmál a z brašny vytáhl náhradní duši i pumpičku, které si přibalil pro jistotu.",
      "Domů dorazili jen o půl hodiny později, než plánovali.",
    ],
    navic: {
      uvod: "Adéla dostala nové kolo k narozeninám a na výlet se těšila celý týden.",
      zaver: "Večer Adéla vyprávěla mámě, jak se u řeky naučila vyměnit duši.",
    },
  },
  {
    id: "novy-spoluzak",
    uroven: 2,
    nazev: "o novém spolužákovi",
    vety: [
      "Do třídy přišel po Vánocích nový spolužák Filip, který ve škole ještě nikoho neznal.",
      "O přestávce si ale všiml, že si z něj dva kluci ze třídy dělají legraci kvůli jeho výslovnosti.",
      "Stál sám uprostřed chodby a nevěděl, jestli se má bránit nebo raději mlčet.",
      "Vtom se ho ale zastala Karolína a hlasitě řekla, že si z nikoho legraci dělat nebudou.",
      "Od té chvíle Filip s Karolínou o přestávkách sedávali spolu a brzy z nich byli kamarádi.",
    ],
    navic: {
      uvod: "Filip se s rodiči přistěhoval z malé vesnice na Slovensku.",
      zaver: "Druhý den se oba kluci Filipovi sami omluvili.",
    },
  },
  {
    id: "rodinny-obed",
    uroven: 2,
    nazev: "o nedělním obědě",
    vety: [
      "V neděli chystala Klára s bratrem Vojtou oběd k babiččiným narozeninám.",
      "Když otevřeli troubu, zjistili, že kuře je spálené na uhel.",
      "Za půl hodiny měla přijít celá rodina a v kuchyni to štiplavě páchlo spáleninou.",
      "Vojtu vtom napadlo podívat se do mrazáku a tam našli velkou krabici tátova guláše.",
      "Babička si guláš pochvalovala a o spáleném kuřeti se dozvěděla, až když jí to vnoučata sama přiznala.",
    ],
    navic: {
      uvod: "Babičce bylo sedmdesát let a nejraději ze všeho měla pečené kuře.",
      zaver: "Příště si Klára s Vojtou k troubě pro jistotu nastavili budík.",
    },
  },
  // ── L3 (úvod schválně obsahuje drobnou nepříjemnost, která NENÍ zápletka) ──
  {
    id: "sachovy-turnaj",
    uroven: 3,
    nazev: "o šachovém turnaji",
    vety: [
      "Vítek jel v sobotu na svůj první šachový turnaj, i když ho cestou trochu bolelo v krku.",
      "Los mu hned do prvního kola přidělil loňského vítěze celého turnaje.",
      "Po dvou hodinách hry zbývala Vítkovi na hodinách jediná minuta a soupeř mu hrozil matem.",
      "Soupeř si však v rychlosti nevšiml Vítkova koně a jediným tahem přišel o dámu.",
      "Partii Vítek vyhrál a domů si odvezl pohár pro nejlepšího nováčka.",
    ],
  },
  {
    id: "koncert",
    uroven: 3,
    nazev: "o školním koncertě",
    vety: [
      "Eliška hrála na flétnu a v pátek měla vystoupit na školním koncertě, ačkoli venku od rána lilo.",
      "Hodinu před koncertem jí flétna spadla na zem a spodní díl se ohnul tak, že nešel nasadit.",
      "Moderátorka už ohlašovala její jméno a Eliška stála za oponou jen s polovinou nástroje v ruce.",
      "V poslední chvíli jí pan učitel hudby přinesl z kabinetu svou vlastní flétnu.",
      "Eliška zahrála bez jediné chyby a učiteli pak flétnu s poděkováním vrátila.",
    ],
  },
  {
    id: "pes-v-parku",
    uroven: 3,
    nazev: "o psovi v parku",
    vety: [
      "Martin venčil v parku sousedova psa Arga a trochu se zlobil, že kvůli tomu nestihne oblíbený seriál.",
      "U rybníka se Argo vysmekl z obojku a rozběhl se za kachnami.",
      "Martin volal jeho jméno do houstnoucí tmy, ale z křoví se ozývalo jen šustění listí.",
      "Když už to chtěl vzdát, přiběhl Argo celý mokrý sám od sebe a olízl mu ruku.",
      "Sousedovi Martin všechno po pravdě pověděl a od té doby Argovi vždycky pořádně utáhl obojek.",
    ],
  },
  {
    id: "referat",
    uroven: 3,
    nazev: "o referátu",
    vety: [
      "Anežka měla v pondělí odevzdat referát o sovách a starší bratr jí k tomu celé odpoledne pouštěl hlasitou hudbu.",
      "Večer počítač najednou zčernal a s ním zmizel i celý rozepsaný referát.",
      "Byla skoro půlnoc, Anežka seděla nad prázdnou obrazovkou a věděla, že za jednu noc všechno znovu nenapíše.",
      "Bratr vtom přišel na to, že se referát průběžně ukládal i na internet, a Anežka měla referát za minutu zpátky.",
      "V pondělí dostala Anežka za referát jedničku a bratrovi hudbu už nevyčítala.",
    ],
  },
  {
    id: "stanovani",
    uroven: 3,
    nazev: "o stanování",
    vety: [
      "Ríša s tátou jeli na víkend stanovat k přehradě, i když Ríša nerad spal ve spacáku.",
      "Při stavění stanu zjistili, že doma nechali všechny kolíky.",
      "Zvedal se vítr, nepřipevněný stan se nafukoval jako plachta a od západu se blížila bouřka.",
      "Ríšu vtom napadlo zatížit rohy stanu velkými kameny z břehu.",
      "Stan vydržel celou noc a Ríša ve spacáku spal jako nikdy předtím.",
    ],
  },
  {
    id: "jarmark",
    uroven: 3,
    nazev: "o školním jarmarku",
    vety: [
      "Na školní jarmark připravila třída 6. B stánek s perníčky a Nela, která nerada počítala, dostala na starost pokladnu.",
      "Ráno našli krabici s perníčky rozmočenou, protože přes noc zůstala venku na dešti.",
      "K prázdnému stánku se už sbíhali první zákazníci a ve třídě nikdo nevěděl, co jim nabídnout.",
      "Nela přišla s nápadem prodávat místo perníčků horký čaj a záložky, které třída vyrobila minulý týden.",
      "Stánek vydělal víc, než čekali, a Nela zjistila, že počítat peníze ji vlastně baví.",
    ],
  },
];

const POOL = (u: 1 | 2 | 3) => STAVBA.filter((p) => p.uroven === u);
const L1_POOL = POOL(1);
const L2_POOL = POOL(2);
const L3_POOL = POOL(3);

function pribeh(id: string): Pribeh {
  return STAVBA.find((p) => p.id === id)!;
}

function textPribehu(p: Pribeh, idxs: number[] = [0, 1, 2, 3, 4]): string {
  return idxs.map((i) => p.vety[i]).join(" ");
}

/** Začátek věty (prvních pár slov) pro odkaz v nápovědě. */
function zac(veta: string, slov = 4): string {
  return veta.split(" ").slice(0, slov).join(" ").replace(/[,.:–]+$/, "");
}

// ═══════════════════════════════════════════════════════════════════════
// Sdílené texty pro nápovědy (nikdy nejmenují žádnou z pěti částí)
// ═══════════════════════════════════════════════════════════════════════

const DEFINE_HINT0: Record<Cast, string> = {
  "úvod": "Přemýšlej, jestli tahle část teprve seznamuje čtenáře s postavami a prostředím, nebo už se v ději něco děje.",
  "zápletka": "Přemýšlej, kdy se v příběhu poprvé objeví potíž, se kterou si postava neví rady.",
  "vyvrcholení": "Přemýšlej, kdy je čtenáři nejvíc úzko a ještě nikdo neví, jak to dopadne.",
  "obrat": "Přemýšlej, kdy se v ději stane něco, co všechno najednou otočí jiným směrem.",
  "závěr": "Přemýšlej, kdy už je problém vyřešený a příběh se chýlí ke konci.",
};

/** L2 — rozlišovací otázka pro těžkou dvojici (nejmenuje části). */
const PAIR_QUESTION: Record<Cast, string> = {
  "úvod": "seznamuje nás teprve s postavou, nebo už se něco děje?",
  "zápletka": "objevuje se tady potíž teprve teď, nebo už se čeká, jak to celé dopadne?",
  "vyvrcholení": "objevuje se tady potíž teprve teď, nebo už se čeká, jak to celé dopadne?",
  "obrat": "mění se tady ještě směr děje, nebo už je po všem a jen se ukazuje, jak to dopadlo?",
  "závěr": "mění se tady ještě směr děje, nebo už je po všem a jen se ukazuje, jak to dopadlo?",
};

/** L1 — definice části bez jejího jmenování (šablona „pojem"). */
const QUESTION_DEFINE: Record<Cast, string> = {
  "úvod": "Která část vyprávění představí, kdo, kde a kdy se příběh odehrává, a problém v ní ještě nevzniká?",
  "zápletka": "Ve které části se poprvé objeví problém, který rozjede děj?",
  "vyvrcholení": "Která část vyprávění je chvílí s největším napětím, kdy se rozhoduje, jak vše dopadne?",
  "obrat": "Která část vyprávění přináší nečekanou změnu, po které se děj stočí jinam a směřuje k rozuzlení?",
  "závěr": "Která část vyprávění příběh uzavírá a ukazuje, jak vše dopadlo?",
};

/** select_one úloha typu „která je to část" — options z DISTRACTORS_FOR. */
function ulohaCast(question: string, correct: Cast, hints: [string, string], explanation: string): PracticeTask | null {
  const ds = DISTRACTORS_FOR[correct].map((d) => ({ value: d, why: feedbackPart(d, correct) }));
  return choice(question, correct, ds, { hints, explanation });
}

// ═══════════════════════════════════════════════════════════════════════
// L1 — rozpoznání pojmu
// ═══════════════════════════════════════════════════════════════════════

/**
 * Z jedné vytržené věty jde jednoznačně poznat jen úvod, zápletku a závěr.
 * Vyvrcholení a obrat se od sebe (i od závěru) liší až v kontextu celého
 * příběhu — „chytil míč a spoluhráč dal gól“ může samotné působit jako
 * vyvrcholení i závěr. Ty se proto ptají až na L2 (věta v textu).
 */
const L1_QUOTE_IDX = [0, 1, 4];

function genL1quote(): PracticeTask | null {
  const p = pick(L1_POOL);
  const idx = pick(L1_QUOTE_IDX);
  const correct = PARTS[idx];
  const veta = p.vety[idx];
  return ulohaCast(
    `Přečti si větu z vyprávění: „${veta}“ Do které části vyprávění patří?`,
    correct,
    [
      "Vyprávění nejdřív představí, kdo, kde a kdy; potom v něm vznikne problém; nakonec se ukáže, jak vše dopadlo. Kterou z těch rolí plní tahle věta?",
      `U věty „${zac(veta)}…“ se zeptej: je potíž teprve před námi, právě vzniká, je napětí nejvyšší, otáčí se děj nečekaně jinam, nebo už je po všem?`,
    ],
    `Tahle věta ${EXPL[correct]} – to je znak části „${correct}“.`,
  );
}

function genL1define(): PracticeTask | null {
  const correct = pick(PARTS);
  const p = pick(L1_POOL);
  const idx = PARTS.indexOf(correct);
  return ulohaCast(
    QUESTION_DEFINE[correct],
    correct,
    [
      DEFINE_HINT0[correct],
      `Takovou roli má například tahle věta z vyprávění ${p.nazev}: „${p.vety[idx]}“ Kde v příběhu stojí a jak se jmenuje část, která tam bývá?`,
    ],
    `Tahle část ${EXPL[correct]} – proto se jmenuje „${correct}“.`,
  );
}

function genL1(): PracticeTask | null {
  return pick([genL1quote, genL1define])();
}

// ═══════════════════════════════════════════════════════════════════════
// L2 — použití v souvislém textu
// ═══════════════════════════════════════════════════════════════════════

/** Těžké dvojice: zápletka × vyvrcholení, obrat × závěr (úvod se sem nedává, ten je nápadný). */
const L2_HARD: Cast[] = ["zápletka", "vyvrcholení", "obrat", "závěr"];

function genL2marked(): PracticeTask | null {
  const p = pick(L2_POOL);
  const correct = pick(L2_HARD);
  const idx = PARTS.indexOf(correct);
  const veta = p.vety[idx];
  return ulohaCast(
    `Přečti si text: ${textPribehu(p)} Kterou částí vyprávění je tahle věta: „${veta}“?`,
    correct,
    [
      `Najdi větu „${zac(veta)}…“ ve vyprávění ${p.nazev} a všimni si, co se děje ve větě před ní a po ní.`,
      `U téhle věty se zeptej: ${PAIR_QUESTION[correct]} Odpověď poznáš podle toho, co věta v ději dělá, ne podle jejích prvních slov.`,
    ],
    `Tahle věta ${EXPL[correct]} – to je znak části „${correct}“.`,
  );
}

function genL2zacatek(): PracticeTask | null {
  const p = pick(L2_POOL);
  const correct = p.vety[1]; // zápletka
  const otherIdx = [0, 2, 3, 4];
  const distractors = pickN(otherIdx, 3).map((i) => ({
    value: p.vety[i],
    why: `Tahle věta patří do jiné části vyprávění – je to věta, ${REL[PARTS[i]]}. Zápletka je věta, ${REL["zápletka"]}.`,
  }));
  return choice(
    `Přečti si text: ${textPribehu(p)} Ve které z vět zápletka začíná?`,
    correct,
    distractors,
    {
      hints: [
        `Zápletka je chvíle, kdy se v příběhu poprvé objeví problém. Projdi vyprávění ${p.nazev} od začátku a hledej první větu, kde se něco pokazí.`,
        `Vyřaď věty, ve kterých se v příběhu ${p.nazev} postava teprve představuje, ve kterých se problém už řeší nebo ve kterých je po všem. Ze zbylých vyber tu, kde potíž teprve vzniká.`,
      ],
      explanation: `Zápletka je věta, ${REL["zápletka"]}: „${correct}“`,
    },
  );
}

function genL2nasleduje(): PracticeTask | null {
  const p = pick(L2_POOL);
  const navic = p.navic!;
  const k = 1 + Math.floor(Math.random() * 3); // kolik vět už je vidět (1–3)
  const shown = [0, 1, 2, 3, 4].slice(0, k);
  const correctIdx = k;
  const correct = p.vety[correctIdx];
  const pozdeji = (i: number) => ({
    value: p.vety[i],
    why: `Tahle věta do příběhu patří, ale až později – je to věta, ${REL[PARTS[i]]}. Hned teď musí přijít věta, ${REL[PARTS[correctIdx]]}.`,
  });
  const uvodNavic = {
    value: navic.uvod,
    why: "Tahle věta jen doplňuje představení postavy a prostředí. To patří na začátek vyprávění, ne až potom, co už vznikl problém.",
  };
  const zaverNavic = {
    value: navic.zaver,
    why: `Tahle věta patří až úplně na konec, kdy je po všem. Předtím musí přijít ještě věta, ${REL[PARTS[correctIdx]]}.`,
  };
  let distractors;
  if (k === 1) {
    // Po úvodu by doplňující věta úvodu mohla navazovat — proto ji sem nedáváme.
    distractors = [2, 3, 4].map(pozdeji);
  } else if (k === 2) {
    distractors = [pozdeji(3), ...pickN([pozdeji(4), uvodNavic, zaverNavic], 2)];
  } else {
    distractors = [pozdeji(4), zaverNavic, uvodNavic];
  }
  const posledni = p.vety[k - 1];
  return choice(
    `Přečti si text: ${textPribehu(p, shown)} Která věta podle stavby vyprávění přijde hned jako další?`,
    correct,
    distractors,
    {
      hints: [
        `Zatím znáš z vyprávění ${pad(k, "ČÁST")}. Podle pořadí kroků vyprávění zjisti, jestli teď přijde problém, napětí, nečekaný zvrat, nebo konec.`,
        `Poslední věta, kterou znáš, začíná „${zac(posledni)}…“. Co musí v příběhu ${p.nazev} přijít hned po ní, aby na sebe děj navazoval a žádný krok se nepřeskočil?`,
      ],
      explanation: `Další v pořadí je věta, ${REL[PARTS[correctIdx]]}: „${correct}“`,
    },
  );
}

function genL2(): PracticeTask | null {
  return pick([genL2marked, genL2zacatek, genL2nasleduje])();
}

// ═══════════════════════════════════════════════════════════════════════
// L3 — analýza stavby celého příběhu
// ═══════════════════════════════════════════════════════════════════════

// (a) Retrospektivní vyprávění → kterou větou by začínalo chronologicky
function genL3a(): PracticeTask | null {
  const p = pick(L3_POOL);
  const head = pick([2, 4]); // vypravěč začne vrcholem napětí, nebo koncem
  const rest = [0, 1, 2, 3, 4].filter((i) => i !== head);
  const text = `${p.vety[head]} Jak k tomu došlo? ${textPribehu(p, rest)}`;
  const correct = p.vety[0];
  const other = head === 2 ? 4 : 2;
  const ds = [
    {
      value: p.vety[head],
      why: "Tahle věta stojí v textu první, ale v ději se stala až mnohem později. Vypravěč s ní začal schválně, aby čtenáře vtáhl, a pak se vrátil zpátky.",
    },
    {
      value: p.vety[1],
      why: "V téhle větě už vzniká problém. Než se mohl objevit, muselo se nejdřív představit, kdo, kde a kdy.",
    },
    {
      value: p.vety[other],
      why:
        other === 4
          ? "Tahle věta ukazuje, jak vše dopadlo. Popořadě by byla až úplně na konci."
          : "Tahle věta zachycuje chvíli největšího napětí. Popořadě by přišla až po vzniku problému.",
    },
  ];
  return choice(
    `Přečti si text: ${text} Vypravěč nezačíná tím, co se stalo nejdřív, ale pozdější chvílí, a teprve pak se vrací zpátky (tomu se říká retrospektivní postup). Kterou větou by vyprávění začínalo, kdyby šlo chronologicky – přesně v tom pořadí, jak se věci staly?`,
    correct,
    ds,
    {
      hints: [
        `U každé možnosti se zeptej: stalo se tohle v příběhu ${p.nazev} dřív než všechno ostatní?`,
        `První věta textu („${zac(p.vety[head])}…“) je schválně vytržená z pozdější chvíle. Hledej větu, která popisuje, co bylo ještě předtím, než vůbec něco začalo.`,
      ],
      explanation: `Popořadě (chronologicky) začíná vyprávění tím, co se stalo nejdřív: „${correct}“ Vypravěč ale začal pozdější chvílí a pak se vrátil zpátky – tomu se říká retrospektivní postup.`,
    },
  );
}

// (b) Porušená posloupnost — jedna věta je na špatném místě
function genL3b(): PracticeTask | null {
  const p = pick(L3_POOL);
  const from = Math.floor(Math.random() * 5);
  const to = Math.floor(Math.random() * 5);
  if (Math.abs(from - to) < 2) return null; // sousední prohození = dvě možné odpovědi
  // Vrchol nebo konec na začátku = záměrná retrospektiva (úloha L3a), ne chyba.
  if (to === 0 && (from === 2 || from === 4)) return null;
  const arr = [0, 1, 2, 3, 4].filter((i) => i !== from);
  arr.splice(to, 0, from);
  // Jednoznačnost: pořadí napraví vyjmutí právě jedné věty.
  const opravy = arr.filter((_, skip) => {
    const r = arr.filter((__, i) => i !== skip);
    return r.every((v, i) => i === 0 || v > r[i - 1]);
  });
  if (opravy.length !== 1) return null;
  const violator = PARTS[from];
  const label = (pos: number) => `věta č. ${pos + 1}`;
  const zlom = arr.findIndex((v, i) => i > 0 && v < arr[i - 1]); // 0-based index druhé věty zlomu
  const smer = to < from ? "v textu přišla dřív, než by měla" : "v textu přišla později, než by měla";
  const text = arr.map((i, pos) => `${pos + 1}) ${p.vety[i]}`).join(" ");
  const ds = pickN(
    [0, 1, 2, 3, 4].filter((pos) => pos !== to),
    3,
  ).map((pos) => ({
    value: label(pos),
    why: `Kdybys větu č. ${pos + 1} vyjmul, zbylé věty by na sebe pořád nenavazovaly popořadě. Na špatném místě tedy stojí jiná věta.`,
  }));
  return choice(
    `Přečti si text: Vyprávění je poskládané takhle: ${text} Která věta stojí v tomhle pořadí na špatném místě?`,
    label(to),
    ds,
    {
      hints: [
        `Přečti si vyprávění ${p.nazev} popořadě a u každé věty se zeptej, jestli navazuje na tu předchozí.`,
        `Mezi ${zlom}. a ${zlom + 1}. větou se děj láme. Zkus jednu z nich v duchu vyjmout – po vyjmutí které z nich budou zbylé věty hladce navazovat?`,
      ],
      explanation: `Věta č. ${to + 1} je věta, ${REL[violator]}. Podle stavby vyprávění patří na ${from + 1}. místo, ale ${smer} – proto stojí na špatném místě.`,
    },
  );
}

// (c) Chybějící část — z osnovy o čtyřech bodech pozná, co v ní chybí
const MISSING_EXPL: Record<"zápletka" | "obrat", string> = {
  "zápletka": "Chybí zápletka. Bez ní příběh nemá problém, který by ho rozjel – postavy by jen dál žily obyčejný den a nebylo by co vyprávět.",
  "obrat": "Chybí obrat – nečekaná změna, která stočí děj k rozuzlení. Obrat nemusí mít každý příběh, ale tady bez něj závěr přijde znenadání: problém je najednou vyřešený a nevíme jak.",
};

function genL3c(): PracticeTask | null {
  const p = pick(L3_POOL);
  const missing = pick(["zápletka", "obrat"] as const);
  const missingIdx = PARTS.indexOf(missing);
  const shownIdx = [0, 1, 2, 3, 4].filter((i) => i !== missingIdx);
  const text = shownIdx.map((i, pos) => `${pos + 1}) ${p.vety[i]}`).join(" ");
  const ds = DISTRACTORS_FOR[missing].map((d) => ({
    value: d,
    why: `Tahle část v osnově je – patří k ní věta, ${REL[d]}. ${MISSING_EXPL[missing]}`,
  }));
  // Mezera je mezi body missingIdx a missingIdx + 1 (číslováno od 1).
  return choice(
    `Přečti si text: Osnova vyprávění ${p.nazev} má jen čtyři body: ${text} Jedna část chybí. Která?`,
    missing,
    ds,
    {
      hints: [
        `Přehraj si vyprávění ${p.nazev} v duchu bod po bodu. Kde děj přeskočí?`,
        `Podívej se na přechod mezi ${missingIdx}. a ${missingIdx + 1}. bodem. Co by se muselo stát mezi nimi, aby na sebe navazovaly?`,
      ],
      explanation: MISSING_EXPL[missing],
    },
  );
}

// (d) Skutečná zápletka × drobná nepříjemnost z úvodu / úvod / vyvrcholení
interface SummarySet {
  storyId: string;
  /** Zápletka — problém, který rozjede děj. */
  correct: string;
  /** Drobná nepříjemnost z úvodu, která vypadá jako problém, ale děj nerozjede. */
  vedlejsi: string;
  uvodP: string;
  vyvrcholeniP: string;
}

const SUMMARY_BANKA: SummarySet[] = [
  {
    storyId: "sachovy-turnaj",
    correct: "Vítek dostal hned v prvním kole loňského vítěze turnaje.",
    vedlejsi: "Vítka cestou na turnaj trochu bolelo v krku.",
    uvodP: "Vítek jel v sobotu na svůj první šachový turnaj.",
    vyvrcholeniP: "Vítkovi zbývala na hodinách minuta a hrozil mu mat.",
  },
  {
    storyId: "koncert",
    correct: "Eliščina flétna spadla na zem a ohnula se.",
    vedlejsi: "V den koncertu venku od rána vytrvale lilo.",
    uvodP: "Eliška měla v pátek hrát na školním koncertě.",
    vyvrcholeniP: "Eliška stála za oponou jen s půlkou nástroje.",
  },
  {
    storyId: "pes-v-parku",
    correct: "Martinovi se u rybníka Argo vysmekl a utekl za kachnami.",
    vedlejsi: "Martin se zlobil, že nestihne oblíbený seriál.",
    uvodP: "Martin venčil v parku sousedova psa Arga.",
    vyvrcholeniP: "Martin volal do tmy a slyšel jen šustění listí.",
  },
  {
    storyId: "referat",
    correct: "Anežce večer zčernal počítač i s referátem.",
    vedlejsi: "Bratr Anežce celé odpoledne pouštěl hudbu.",
    uvodP: "Anežka měla v pondělí odevzdat referát o sovách.",
    vyvrcholeniP: "Anežka o půlnoci seděla nad prázdnou obrazovkou.",
  },
  {
    storyId: "stanovani",
    correct: "Ríša s tátou doma nechali všechny kolíky.",
    vedlejsi: "Ríša odjakživa nerad spal ve spacáku.",
    uvodP: "Ríša s tátou jeli na víkend k přehradě.",
    vyvrcholeniP: "Stan se ve větru nafukoval a blížila se bouřka.",
  },
  {
    storyId: "jarmark",
    correct: "Perníčky přes noc zmokly a rozmočily se.",
    vedlejsi: "Nela nerada počítala, a přesto dostala pokladnu.",
    uvodP: "Třída 6. B chystala na jarmark stánek s perníčky.",
    vyvrcholeniP: "K prázdnému stánku se sbíhali první zákazníci.",
  },
];

function genL3d(): PracticeTask | null {
  const s = pick(SUMMARY_BANKA);
  const p = pribeh(s.storyId);
  const distractors = [
    {
      value: s.vedlejsi,
      why: "Tohle je jen drobná nepříjemnost z úvodu. Nevzniká z ní problém, který by se musel řešit, a nevede z ní napětí.",
    },
    {
      value: s.uvodP,
      why: "Tohle jen představuje, kdo, kde a kdy. Problém tu ještě nevzniká – zápletka přijde až potom.",
    },
    {
      value: s.vyvrcholeniP,
      why: "Tohle je chvíle největšího napětí. Potíž, kvůli které nastala, ale vznikla už dřív – a právě ta je zápletka.",
    },
  ];
  return choice(
    `Přečti si text: ${textPribehu(p)} Které tvrzení vystihuje skutečnou zápletku celého příběhu?`,
    s.correct,
    distractors,
    {
      hints: [
        `Ve vyprávění ${p.nazev} se objeví víc nepříjemných věcí. Zápletka je jen ta, kvůli které se pak celý děj musí řešit.`,
        `U každé nepříjemnosti v příběhu ${p.nazev} se zeptej: vede z ní napětí i to, co se nakonec vyřeší? Pokud z ní nevzniká problém, který by se musel řešit, je to jen vedlejší detail.`,
      ],
      explanation: `Zápletka je problém, který příběh rozjede a který se pak řeší až do konce: ${s.correct}`,
    },
  );
}

function genL3(): PracticeTask | null {
  return pick([genL3a, genL3b, genL3c, genL3d])();
}

// ═══════════════════════════════════════════════════════════════════════
// Generátor
// ═══════════════════════════════════════════════════════════════════════

function gen(level: number): PracticeTask[] {
  const genLx = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(genLx));
}

// ═══════════════════════════════════════════════════════════════════════
// Topic
// ═══════════════════════════════════════════════════════════════════════

export const VYPRAVENI_VYSTAVBA_KOMPOZICE_ZAPLETKA: TopicMetadata[] = [
  {
    id: "g6-cjl-vypraveni-vystavba-kompozice-zapletka-6",
    rvpNodeId: "g6-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypraveni-vystavba-kompozice-zapletka",
    title: "Vyprávění - výstavba, kompozice, zápletka",
    displayName: "Stavba vyprávění",
    studentTitle: "Jak je postavený příběh",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Poznáš úvod, zápletku, vyvrcholení, obrat a závěr a jak je příběh poskládaný.",
    keywords: [
      "vyprávění", "kompozice", "výstavba", "úvod", "zápletka", "vyvrcholení", "obrat", "závěr",
      "osnova", "napětí", "časový postup", "chronologicky", "retrospektivně", "rozuzlení",
    ],
    goals: [
      "Rozpoznat části kompozice vyprávění (úvod, zápletka, vyvrcholení, obrat, závěr) v jednotlivé větě i v celém příběhu.",
      "Rozlišit typicky zaměňované dvojice: zápletka × vyvrcholení, obrat × závěr, úvod × zápletka.",
      "Analyzovat stavbu celého příběhu: převést retrospektivní vyprávění na chronologické, najít porušenou posloupnost a chybějící část osnovy a odlišit skutečnou zápletku od vedlejší nepříjemnosti.",
    ],
    boundaries: [
      "Nepoužívají se učebnicové termíny expozice, kolize, krize, peripetie — jen česká pojmenování.",
      "Obrat se učí jako častá, ne povinná část vyprávění; každý příběh v bance ho má jako samostatnou větu oddělenou od vyvrcholení.",
      "Bez obrázků a zvuku — vše řešitelné jen ze psaného textu.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Úplné vyprávění mívá pět kroků: nejdřív se představí, kdo, kde a kdy (úvod); pak vznikne problém (zápletka); pak přijde chvíle s největším napětím (vyvrcholení); pak se něco nečekaně změní (obrat – nemusí být v každém příběhu); a nakonec se vše vyřeší (závěr).",
      steps: [
        "Zjisti, jestli se v úseku teprve představují postavy a místo, nebo už se v ději něco děje.",
        "Pokud se něco děje, rozhodni: vzniká tu teprve problém (zápletka), je to nejnapínavější chvíle (vyvrcholení), děj se nečekaně obrátí (obrat), nebo se vše uzavírá (závěr)?",
        "U celého příběhu si všímej, čím vypravěč začíná (od začátku, nebo od pozdější chvíle), a jestli části jdou v logickém pořadí.",
      ],
      commonMistake: "Plést zápletku s vyvrcholením (napínavá chvíle není totéž jako vznik problému), obrat se závěrem (obrat ještě mění směr děje, závěr ho jen uzavírá), nebo za zápletku brát první drobnou nepříjemnost z úvodu.",
      example: "Vyprávění o ztraceném klíči: úvod (Jana jde domů) – zápletka (nemá klíč) – vyvrcholení (zvoní na sousedy a bojí se) – obrat (klíč najde v druhé kapse) – závěr (nosí klíč na tkaničce).",
    },
  },
];
