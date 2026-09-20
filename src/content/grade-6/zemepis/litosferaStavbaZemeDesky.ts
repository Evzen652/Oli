/**
 * Zeměpis 6. ročník — Litosféra: stavba Země, pohyby litosférických desek,
 * sopky, zemětřesení (select_one).
 *
 * K obsahu nejsou mapy ani obrázky: poloha se popisuje slovy (uprostřed
 * Tichého oceánu, na okraji desky, na rozhraní dvou desek), čísla jen řádově
 * (kůra jednotky až desítky kilometrů proti poloměru Země asi 6 400 km).
 * Přesná mocnost kůry, rychlost desek na centimetr ani konkrétní erupce
 * nejsou klíčem.
 *
 * Chybový model (každý distraktor = jedna typická chyba šesťáka):
 *  • magma × láva a ohnisko × epicentrum brané jako synonyma — žák je neváže
 *    na dvojici „v hloubce × na povrchu“;
 *  • stavba Země: kůra jako nejmocnější vrstva, prohozené pořadí, plášť
 *    vynechaný (pod kůrou prý hned jádro);
 *  • sopky a zemětřesení rozseté náhodně, nebo tam, kde je horko či poušť —
 *    místo pásů kopírujících okraje desek (Ohnivý kruh kolem Tichého oceánu);
 *  • prohozený směr pohybu: pohoří prý roste vzdalováním, hřbet prý srážkou;
 *  • sopka a zemětřesení berou jako nerozlučnou dvojici — u zlomu, kde se
 *    desky jen smýkají, čekají i sopku.
 *
 *  • L1 — zapamatování: vrstvy Země a jejich pořadí, dvojice magma/láva a
 *    ohnisko/epicentrum, litosféra rozlámaná na desky, kůra jako tenká slupka.
 *  • L2 — použití vztahu příčina → důsledek: pohyb desek ↔ jev (obousměrně),
 *    pásy sopek a otřesů, tsunami, Richterova stupnice, pohon pohybu desek.
 *  • L3 — analýza a přenos: rozhodnutí o nepopsaném místě, proč Himálaj roste
 *    a Česko má jen vyhaslé sopky, jev, který pohybem desek NEvzniká, škody
 *    podle hloubky ohniska a vzdálenosti od epicentra, stáří hornin na dně.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, cis, type Distractor } from "./_shared";

interface Polozka {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

const vytvor = (p: Polozka): PracticeTask | null =>
  choice(p.q, p.correct, p.distractors, { hints: p.hints, explanation: p.explanation });

// ── L1 (a) — vrstvy Země: co leží hned pod / hned nad danou vrstvou ────────
/** Vrstvy od povrchu do středu. `rank` = pořadí v hloubce, pády kvůli předložkám. */
interface Vrstva {
  nom: string;
  /** 2. pád — po předložce „od“. */
  gen: string;
  akuz: string;
  ins: string;
  rank: number;
}

const VRSTVY: Vrstva[] = [
  { nom: "Zemská kůra", gen: "zemské kůry", akuz: "zemskou kůru", ins: "zemskou kůrou", rank: 1 },
  { nom: "Zemský plášť", gen: "zemského pláště", akuz: "zemský plášť", ins: "zemským pláštěm", rank: 2 },
  { nom: "Vnější jádro", gen: "vnějšího jádra", akuz: "vnější jádro", ins: "vnějším jádrem", rank: 3 },
  { nom: "Vnitřní jádro", gen: "vnitřního jádra", akuz: "vnitřní jádro", ins: "vnitřním jádrem", rank: 4 },
];

/** Šest variant: tři dvojice směrem dolů a tři směrem k povrchu. */
export const VRSTVA_VARIANTY: { x: number; dolu: boolean }[] = [
  { x: 0, dolu: true },
  { x: 1, dolu: true },
  { x: 2, dolu: true },
  { x: 1, dolu: false },
  { x: 2, dolu: false },
  { x: 3, dolu: false },
];

function genVrstva(varianta: number): PracticeTask | null {
  const { x: xi, dolu } = VRSTVA_VARIANTY[varianta];
  const x = VRSTVY[xi];
  const klic = VRSTVY[dolu ? xi + 1 : xi - 1];
  const smer = dolu ? "pod" : "nad";
  // Čtvrtou možností je souhrnný pojem, ne další vrstva v pořadí — typická
  // záměna „litosféra = jedna z vrstev“ (ve skutečnosti kůra + svrchní plášť).
  const distractors: Distractor[] = VRSTVY.filter((w) => w !== x && w !== klic).map<Distractor>((w) => {
    const hloubeji = w.rank > x.rank;
    if (hloubeji !== dolu) {
      return {
        value: w.nom,
        why: `${w.nom} je ${hloubeji ? "hlouběji" : "blíž k povrchu"} — otázka se ptá opačným směrem. Hned ${smer} ${x.ins} leží ${klic.nom.toLowerCase()}.`,
      };
    }
    return {
      value: w.nom,
      why: `Mezi ${x.ins} a ${w.ins} je ještě ${klic.nom.toLowerCase()} — ${w.nom.toLowerCase()} proto hned ${smer} ${x.ins} neleží.`,
    };
  });
  distractors.push({
    value: "Litosféra",
    why: `Litosféra není další vrstva v pořadí, ale souhrnný název pro pevný obal Země (zemská kůra a nejsvrchnější část pláště). Hned ${smer} ${x.ins} leží ${klic.nom.toLowerCase()}.`,
  });
  return choice(
    `Která vrstva Země leží hned ${smer} ${x.ins}?`,
    klic.nom,
    distractors,
    {
      hints: [
        `Vrstvy Země jdou od povrchu do středu v pevném pořadí. Na kterou z nich narazíš, když se od ${x.gen} vydáš ${dolu ? "o krok dál do hloubky" : "o krok zpátky k povrchu"}?`,
        `Od povrchu ke středu jdou vrstvy takhle: tenký kamenný obal, pod ním nejmocnější vrstva horkých hornin, pak tekutá část středu a úplně uprostřed pevná část středu. Najdi v tomhle pořadí ${x.akuz} a posuň se o jediný krok ${dolu ? "do hloubky" : "k povrchu"} — žádnou vrstvu přitom nepřeskakuj.`,
      ],
      explanation: `Vrstvy Země jdou od povrchu ke středu takto: zemská kůra, zemský plášť, vnější jádro, vnitřní jádro. Hned ${smer} ${x.ins} proto leží ${klic.nom.toLowerCase()}. Přeskočit žádnou z nich nelze — plášť je mezi kůrou a jádrem vždy.`,
    },
  );
}

// ── L1 (b) — banka faktů ───────────────────────────────────────────────────
const DVOJICE_HLOUBKA = "Obě slova znamenají tutéž roztavenou horninu. Liší se jen tím, kde je: pod povrchem, nebo už venku na něm.";

export const POOL_L1: Polozka[] = [
  {
    q: "Jak se nazývá roztavená hornina, dokud je hluboko pod zemským povrchem?",
    correct: "Magma",
    distractors: [
      { value: "Láva", why: `Tak se roztavená hornina jmenuje až potom, co vyteče na zemský povrch. ${DVOJICE_HLOUBKA}` },
      { value: "Sopečný popel", why: "Popel je jemný prach, který sopka vymrští do vzduchu. Otázka se ptá na horninu tekutou, ne na prach." },
      { value: "Žula", why: "Žula je už dávno ztuhlá pevná hornina. Otázka se ptá na horninu, která je stále roztavená." },
    ],
    hints: [
      "Rozhoduje jediná věc: jestli je hornina ještě zavřená uvnitř Země, nebo už venku na povrchu. Každá z těch dvou poloh má jiný název.",
      "Roztavená hornina dostane při výstupu na povrch nové jméno, i když je to pořád tatáž látka. Tady je ale ještě v hloubce, kde ji nikdo nevidí — hledej tedy název pro tu podzemní podobu, ne pro tu, která se valí po svahu.",
    ],
    explanation: "Roztavené hornině v hloubce se říká magma. Jakmile vyteče na povrch, mluvíme o lávě. Je to stále táž látka, jen na jiném místě — proto se ty dva názvy nesmí zaměňovat.",
  },
  {
    q: "Jak se nazývá roztavená hornina, která už vytekla na zemský povrch?",
    correct: "Láva",
    distractors: [
      { value: "Magma", why: `Tak se roztavená hornina jmenuje, dokud je ještě v hloubce pod povrchem. ${DVOJICE_HLOUBKA}` },
      { value: "Sopečný popel", why: "Popel je jemný prach vynesený do vzduchu, ne tekutá hornina stékající po svahu." },
      { value: "Sopouch", why: "Sopouch je trubice, kterou hornina z hloubky stoupá vzhůru. Je to cesta, ne sama hornina." },
    ],
    hints: [
      "Táž látka má dva názvy podle toho, kde se právě nachází. Tady už je venku, na povrchu — který z názvů k tomu patří?",
      "Dokud je roztavená hornina schovaná v hloubce, nosí jedno jméno; jakmile se dostane ven, mluvíme o ní jinak. Otázka popisuje druhý případ, tedy horninu, kterou by šlo z bezpečné vzdálenosti vidět stékat po svahu sopky.",
    ],
    explanation: "Roztavená hornina, která vyteče na povrch, se nazývá láva. V hloubce je to magma. Rozdíl je jen v poloze, látka je stejná — láva ale na vzduchu rychle chladne a tuhne.",
  },
  {
    q: "Jak se nazývá místo v hloubce, kde zemětřesení vzniká?",
    correct: "Ohnisko",
    distractors: [
      { value: "Epicentrum", why: "To je místo na zemském povrchu přímo nad ním. Dvojice se liší právě tím, že jedno leží v hloubce a druhé nahoře na povrchu." },
      { value: "Kráter", why: "Kráter je otvor na vrcholu sopky. Se vznikem otřesů v hloubce nemá nic společného." },
      { value: "Zlom", why: "Zlom je puklina, podél které se horniny posouvají. Bod, ve kterém se pohyb naráz spustí, má vlastní název." },
    ],
    hints: [
      "U zemětřesení se rozlišují dvě místa: jedno je dole v hornině, druhé nahoře na povrchu. Otázka se ptá na to dolní.",
      "Hluboko pod povrchem hornina praskne a posune se — odtud se otřes rozeběhne na všechny strany. Místo přímo nad ním na povrchu má jiný název, i když se obě slova pletou. Rozhoduj se tedy jen podle toho, jestli se otázka ptá na bod dole v hornině, nebo na bod nahoře pod nohama lidí.",
    ],
    explanation: "Místo v hloubce, kde se hornina posune a otřes vznikne, se jmenuje ohnisko. Kolmo nad ním na povrchu leží epicentrum. Čím mělčeji ohnisko leží, tím silněji je otřes nahoře cítit.",
  },
  {
    q: "Jak se nazývá místo na zemském povrchu přímo nad ohniskem zemětřesení?",
    correct: "Epicentrum",
    distractors: [
      { value: "Ohnisko", why: "Tak se jmenuje samo místo v hloubce, kde otřes vzniká. Otázka se ptá na bod nahoře nad ním." },
      { value: "Kráter", why: "Kráter je otvor na vrcholu sopky, kterým ven vychází láva a popel. Se zemětřesením nesouvisí." },
      { value: "Zlom", why: "Zlom je puklina v hornině, podél které se desky posouvají. Není to jediný bod na povrchu." },
    ],
    hints: [
      "Otřes vzniká dole v hornině, ale lidé ho cítí nahoře. Nejsilněji tam, kde je to místo vzniku nejblíž — jak se ten bod na povrchu jmenuje?",
      "Představ si svislou čáru vedenou z místa vzniku otřesu kolmo vzhůru. Tam, kde protne zemský povrch, bývají škody největší a obyvatelé ucítí otřes jako první. Ten bod má vlastní název, jiný než místo dole v hloubce.",
    ],
    explanation: "Bod na povrchu kolmo nad ohniskem se jmenuje epicentrum. Právě tam bývají otřesy nejsilnější a škody největší, protože vlny mají z ohniska nejkratší cestu.",
  },
  {
    q: "Co je litosféra?",
    correct: "Pevný kamenný obal Země rozlámaný na desky",
    distractors: [
      { value: "Roztavená vrstva mezi kůrou a jádrem Země", why: "Hlouběji je hornina opravdu horká a tvárná, ale litosféra je právě ta svrchní pevná část, která na ní leží a pohybuje se po ní." },
      { value: "Vzdušný obal Země sahající vysoko nad povrch", why: "Vzdušnému obalu se říká atmosféra. Litosféra je z kamene, ne ze vzduchu." },
      { value: "Vodní obal Země, tedy oceány, moře i řeky", why: "Vodní obal je hydrosféra. Litosféra je pevná a tvoří dno oceánů i pevninu." },
    ],
    hints: [
      "Zemské obaly se od sebe liší látkou, ze které jsou. Název litosféra má stejný kořen jako litografie — zjisti, co ten kořen znamená, a látku podle něj poznáš.",
      "Jeden ze zemských obalů je ze vzduchu, druhý z vody a třetí z pevné horniny. Ten třetí navíc není celistvý jako skořápka vejce — je rozpraskaný na velké kusy, které se po sobě pomalu posouvají.",
    ],
    explanation: "Litosféra je pevný kamenný obal Země: zemská kůra i nejsvrchnější část pláště. Není celistvá, ale rozlámaná na litosférické desky, které se po tvárné vrstvě pod sebou pomalu pohybují.",
  },
  {
    q: "Která vrstva Země je zdaleka nejmocnější, tedy nejtlustší?",
    correct: "Zemský plášť",
    distractors: [
      { value: "Zemská kůra", why: "Kůra je proti celé Zemi jen tenká slupka — měří jednotky až desítky kilometrů, zatímco vnitřek Země tisíce." },
      { value: "Vnější jádro", why: "Vnější jádro je mohutné, ale vrstva horkých hornin nad ním sahá ještě dál a je tlustší." },
      { value: "Vnitřní jádro", why: "Vnitřní jádro je pevná koule ve středu Země a zabírá z jejího poloměru jen menší část." },
    ],
    hints: [
      "Porovnej, kolik místa mezi povrchem a středem Země která vrstva zabírá. Slupka nahoře je proti zbytku zanedbatelná.",
      "Zemský poloměr měří asi 6 400 km. Kamenný obal na povrchu z něj ukrojí nanejvýš desítky kilometrů, takže skoro celý zbytek si mezi sebe rozdělí vrstva pod ním a střed Země. A z těch dvou je mnohem tlustší ta horní.",
    ],
    explanation: `Nejmocnější vrstvou je zemský plášť — sahá od spodku kůry až k jádru, tedy zhruba do poloviny cesty ke středu Země (asi ${cis(2900)} km). Žádná jiná vrstva není tak mocná. Kůra je proti poloměru Země (asi ${cis(6400)} km) jen tenká slupka.`,
  },
  {
    q: "Co platí o mocnosti zemské kůry ve srovnání s poloměrem Země?",
    correct: "Je to jen tenká slupka — jednotky až desítky kilometrů",
    distractors: [
      { value: "Je to nejmocnější vrstva Země — tisíce kilometrů", why: "Tisíce kilometrů měří až vrstvy pod kůrou. Kamenná slupka na povrchu je proti nim velmi tenká." },
      { value: "Sahá zhruba do poloviny cesty ke středu Země", why: "Do poloviny cesty ke středu sahá plášť, ne kůra. Ta končí nanejvýš po desítkách kilometrů." },
      { value: "Je mocná asi jako jádro, obě měří tisíce kilometrů", why: "Jádro je mohutné, kůra ne. Poměr je zhruba jako slupka jablka proti celému jablku." },
    ],
    hints: [
      "Porovnej dvě čísla různého řádu: hloubku, ve které kůra končí, a vzdálenost od povrchu do středu Země.",
      "Poloměr Země je asi 6 400 km. Nejhlubší vrt na světě se zavrtal jen asi dvanáct kilometrů a ani ten kůru neprovrtal. Jaká část Země tedy na kamennou slupku na povrchu vůbec zbývá?",
    ],
    explanation: `Zemská kůra měří jednotky až desítky kilometrů (pod oceány 5 až 10 km, pod pevninami 30 až 40 km), zatímco poloměr Země je asi ${cis(6400)} km. Proti celé planetě je to tenká slupka, podobně jako slupka na jablku — proto se v ní všechno, co známe, odehrává těsně u povrchu.`,
  },
  {
    q: "Co platí o litosférických deskách?",
    correct: "Pomalu se pohybují po tvárné vrstvě pod sebou",
    distractors: [
      { value: "Stojí nehybně, protože jsou z pevné horniny", why: "Pevné opravdu jsou, ale to jim v pohybu nebrání: plují po tvárné horké vrstvě pod sebou, jen velmi pomalu." },
      { value: "Otáčejí se dokola nezávisle na zbytku Země", why: "Desky se nikam neroztáčejí. Posouvají se po sobě jen o kousek za rok a nesou přitom pevninu i dno oceánů." },
      { value: "Vznikají a znovu mizí při každém zemětřesení", why: "Zemětřesení je důsledek pohybu desek, ne jejich vznik. Desky existují dál, jen se o sebe zadrhly a naráz povolily." },
    ],
    hints: [
      "Kamenný obal Země není celistvý, ale rozlámaný na velké kusy. Rozmysli si, jestli takové kusy musí nutně zůstat stát na místě.",
      "Desky jsou pevné, ale to, na čem leží, je horké a poddajné jako hodně tuhé těsto. Proto se desky mohou po podloží posouvat, jenže tak pomalu, že to člověk přímo nevidí — pozná se to až podle jevů na jejich okrajích.",
    ],
    explanation: "Litosférické desky jsou pevné kusy kamenného obalu, které se po tvárné vrstvě pláště pomalu pohybují. Právě na jejich okrajích se srážejí, rozestupují nebo míjejí, a proto tam vznikají sopky a zemětřesení.",
  },
  {
    q: "Jak rychle se litosférické desky pohybují?",
    correct: "Velmi pomalu, asi jako rostou nehty na rukou",
    distractors: [
      { value: "Rychle, za jediný rok urazí stovky kilometrů", why: "Tak rychlý pohyb by byl vidět na první pohled. Desky se za rok posunou jen nepatrně." },
      { value: "Vůbec se nepohybují, jen se občas zatřesou", why: "Otřesy jsou právě důsledkem pohybu. Kdyby se desky vůbec nehýbaly, napětí v hornině by nemělo z čeho vznikat." },
      { value: "Pohnou se jen ve chvíli, kdy vybuchne sopka", why: "Je to naopak: sopka vybuchne kvůli pohybu desek. Ten probíhá pořád, i když se zrovna nic neděje." },
    ],
    hints: [
      "Pohyb desek nikdo pouhým okem nesleduje. Porovnej ho s něčím pomalým, co se u tebe doma mění taky jen nepozorovaně.",
      "Kdyby se desky hýbaly rychle, měnil by se tvar pevnin během jediného lidského života a všichni by si toho všimli. Ve skutečnosti se posunou tak málo, že je potřeba měřit roky a spoléhat na přesné přístroje.",
    ],
    explanation: "Desky se pohybují velmi pomalu, řádově srovnatelně s tím, jak rostou nehty. Za miliony let to ale stačí na to, aby se oceány rozšířily a vyrostla celá pohoří.",
  },
  {
    q: "Co je zemětřesení?",
    correct: "Otřesy povrchu z náhlého pohybu hornin v hloubce",
    distractors: [
      { value: "Výbuch sopky, při kterém na povrch vytéká láva", why: "To je sopečná činnost. Obojí se často objeví ve stejné oblasti, ale není to totéž — otřesy vznikají i bez sopky." },
      { value: "Pomalý pokles pevniny pod hladinu moře", why: "Pokles je pozvolný děj, zemětřesení trvá chvilku. Rozhodující je ta náhlost, se kterou hornina povolí." },
      { value: "Vlna, která se po moři žene směrem k pobřeží", why: "Taková vlna (tsunami) může být až následkem otřesu na mořském dně, ne samotným zemětřesením." },
    ],
    hints: [
      "Slovo samo napovídá, co se děje se zemí. Rozmysli si ale, jestli jde o pomalou změnu, nebo o něco náhlého.",
      "V hornině se dlouho hromadí napětí, protože se desky o sebe zadrhnou a tlačí dál. Když pevnost horniny nestačí, povolí naráz a energie se rozběhne do okolí jako vlnění. Který z popisů tomuhle ději odpovídá?",
    ],
    explanation: "Zemětřesení jsou otřesy zemského povrchu, které vzniknou, když se hornina v hloubce náhle posune a napětí se uvolní. Vlnění se z ohniska šíří na všechny strany a na povrchu je cítit nejsilněji v epicentru.",
  },
  {
    q: "Jak se jmenuje otvor na vrcholu sopky, kterým ven vychází láva a popel?",
    correct: "Kráter",
    distractors: [
      { value: "Sopouch", why: "Sopouch je trubice vedoucí z hloubky vzhůru. Otázka se ptá na ústí navrchu, kde trubice končí." },
      { value: "Magmatický krb", why: "Krb je zásobárna roztavené horniny hluboko pod sopkou, ne otvor na jejím vrcholu." },
      { value: "Lávový proud", why: "Tak se říká tomu, co po svahu stéká. Otázka se ptá na místo, kudy to ven vyšlo." },
    ],
    hints: [
      "Sopka má tři části: zásobárnu dole, trubici uprostřed a ústí nahoře. Otázka míří na to ústí.",
      "Projdi si cestu roztavené horniny odspodu nahoru: nejdřív se hromadí v hloubce, pak stoupá úzkou trubicí a nakonec vyjde ven. To poslední místo bývá na vrcholu sopky jako prohlubeň a má vlastní název.",
    ],
    explanation: "Otvor na vrcholu sopky se jmenuje kráter. Pod ním vede sopouch a ještě hlouběji je magmatický krb, kde se roztavená hornina shromažďuje, než vystoupá vzhůru.",
  },
  {
    q: "Jak se jmenuje pás sopek a častých zemětřesení kolem Tichého oceánu?",
    correct: "Ohnivý kruh",
    distractors: [
      { value: "Polární kruh", why: "Polární kruh je rovnoběžka kolem pólu. Se sopkami ani s okraji desek nemá nic společného." },
      { value: "Oceánský hřbet", why: "Hřbet je podmořské pohoří uprostřed oceánu, ne pás kolem jeho okrajů." },
      { value: "Obratník Raka", why: "Obratník je rovnoběžka, podle které se dělí podnebné pásy. Sopky se podle ní neřadí." },
    ],
    hints: [
      "Sopky a otřesy netvoří rovnoběžku, ale kopírují okraje desek kolem jednoho velkého oceánu. Hledej název podle toho, co se v tom pásu děje.",
      "Název vznikl z toho, jak pás vypadá na mapě: uzavírá se kolem celého oceánu do smyčky a je v něm nejvíc činných sopek na světě. Slovo v názvu proto odkazuje na žhavé nitro Země, ne na zeměpisnou šířku.",
    ],
    explanation: "Pás sopek a zemětřesení kolem Tichého oceánu se nazývá Ohnivý kruh. Kopíruje okraje desek, které Tichý oceán obklopují — právě tam se jedna deska podsouvá pod druhou.",
  },
  {
    q: "Která vrstva Země je úplně uprostřed, ve středu planety?",
    correct: "Vnitřní jádro",
    distractors: [
      { value: "Vnější jádro", why: "Vnější jádro obaluje střed planety, ale samo uprostřed neleží — pod ním je ještě jedna vrstva." },
      { value: "Zemský plášť", why: "Plášť je mezi kůrou a jádrem. Do středu planety nesahá, jádro je pod ním." },
      { value: "Zemská kůra", why: "Kůra je úplně navrchu, přímo pod našima nohama. Od středu Země je nejdál ze všech vrstev." },
    ],
    hints: [
      "Vyjmenuj si vrstvy od povrchu dolů a zastav se u té poslední. Ta žádnou další pod sebou nemá.",
      "Cesta od povrchu ke středu vede přes kamenný obal, pak přes nejmocnější vrstvu horkých hornin a nakonec přes dvě části středu Země. Z těch dvou částí hledáš tu hlubší, kolem které je ta druhá jako obal.",
    ],
    explanation: "Ve středu planety je vnitřní jádro. Je pevné, přestože je velmi horké, protože na ně tlačí obrovská váha všech vrstev nad ním. Obaluje ho vnější jádro, které je naopak tekuté.",
  },
  {
    q: "Co platí o vnějším jádru Země?",
    correct: "Je tekuté, zatímco vnitřní jádro je pevné",
    distractors: [
      { value: "Je pevné, zatímco vnitřní jádro je tekuté", why: "Je to přesně naopak. Ve středu planety drží obrovský tlak látku pevnou, i když je tam ještě větší horko." },
      { value: "Obě části jádra jsou tekuté a mísí se", why: "Střed planety tekutý není. Tlak všech vrstev nad ním ho udrží v pevném stavu." },
      { value: "Obě části jádra jsou pevné jako kůra", why: "Jedna z nich pevná je, druhá ne — střed planety obaluje vrstva roztaveného kovu." },
    ],
    hints: [
      "Jádro má dvě části a každá je v jiném stavu. Rozmysli si, ve které z nich je větší tlak.",
      "Platí jednoduché pravidlo: čím hlouběji, tím větší tlak působí váha všech vrstev nad tím — a dost velký tlak udrží látku pevnou, i když je rozžhavená. Obě části středu Země leží v jiné hloubce, tak si u každé z nich rozmysli, jestli na ni tlaku působí dost.",
    ],
    explanation: "Vnější jádro je vrstva roztaveného kovu, která obaluje střed planety. Vnitřní jádro ve středu je naopak pevné, protože na ně tlačí váha všech vrstev nad ním — i když je tam ještě větší horko.",
  },
];

// ── L2 (a) — pohyb desek ↔ jev na povrchu (obousměrně) ─────────────────────
interface Pohyb {
  /** Odpovědní tvar pohybu (nominativ, používá se jako možnost). */
  pohyb: string;
  /** Vedlejší věta do otázky: „na rozhraní, KDE …“. */
  kde: string;
  /** Samostatná věta o pohybu (do zpětných vazeb a vysvětlení). */
  veta: string;
  /** Odpovědní tvar jevu (možnost). */
  jev: string;
  /** Jev v předmětu otázky: „Který pohyb vysvětluje …?“. */
  jevGen: string;
  /** Jev malým písmenem do souvětí. */
  jevMale: string;
  /** Kde daný jev vzniká — do zpětné vazby, když ho žák vybere omylem. */
  jevVznikaTam: string;
  /** Co daný pohyb způsobuje — do zpětné vazby, když ho žák vybere omylem. */
  kdyzPohyb: string;
  hintA: [string, string];
  hintB: [string, string];
  vysvetleniA: string;
  vysvetleniB: string;
}

const POHYBY: Pohyb[] = [
  {
    pohyb: "Desky se od sebe pomalu vzdalují",
    kde: "kde se dvě desky od sebe pomalu vzdalují",
    veta: "desky se od sebe pomalu vzdalují",
    jev: "Oceánský hřbet a nová oceánská kůra",
    jevGen: "vznik oceánského hřbetu s novou kůrou",
    jevMale: "oceánský hřbet a nová oceánská kůra",
    jevVznikaTam: "Oceánský hřbet a nová kůra vznikají tam, kde se desky od sebe vzdalují a mezeru vyplní hornina z hloubky.",
    kdyzPohyb: "Když se desky od sebe vzdalují, prostor mezi nimi se otvírá a vyplní ho hornina vystupující z hloubky.",
    hintA: [
      "Mezi rozestupujícími se deskami se otvírá mezera. Co ji asi zaplní, když je pod nimi horká tvárná vrstva?",
      "Tam, kde se kamenný obal roztahuje, se prázdné místo nedrží dlouho: z hloubky vystoupí roztavená hornina, ztuhne a doplní okraje obou desek. Na mořském dně tak postupně vyroste dlouhý podmořský val a po jeho stranách dna přibývá.",
    ],
    hintB: [
      "Odkud se na dně oceánu může vzít úplně čerstvá hornina? Přemýšlej, kde se pro ni uvolní místo.",
      "Nové dno může přibýt jen tam, kde se něco otevřelo a mezeru zaplnila hornina z hloubky. Kde se naopak vrstvy tlačí proti sobě nebo se jedna z nich ponořuje, tam se dno naopak mačká nebo mizí, takže pro přírůstek není místo.",
    ],
    vysvetleniA: "Tam, kde se dvě desky od sebe vzdalují, vystupuje z hloubky roztavená hornina, tuhne a doplňuje okraje obou desek. Na dně oceánu tak roste oceánský hřbet a spolu s ním přibývá nová oceánská kůra.",
    vysvetleniB: "Nová oceánská kůra a podmořský hřbet uprostřed oceánu vznikají tím, že se desky od sebe vzdalují. Mezera mezi nimi se plní horninou z hloubky, která ztuhne a stane se novým dnem.",
  },
  {
    pohyb: "Oceánská deska klesá pod pevninskou",
    kde: "kde oceánská deska klesá pod pevninskou",
    veta: "oceánská deska klesá pod pevninskou",
    jev: "Hluboký příkop, sopky a zemětřesení",
    jevGen: "vznik hlubokého příkopu a pásu sopek vedle něj",
    jevMale: "hluboký příkop, sopky a zemětřesení",
    jevVznikaTam: "Hluboký příkop a nedaleký pás sopek vznikají tam, kde se jedna deska podsouvá pod druhou a v hloubce nad ní se taví hornina.",
    kdyzPohyb: "Když jedna deska klesá pod druhou, dno se prohne do hlubokého příkopu a kousek za ním, už na sousední desce, vyroste pás sopek.",
    hintA: [
      "Deska klesá do hloubky, kde je velké horko. Co se tam s horninou kolem ní stane a kam se to potom vydá?",
      "Klesající deska stahuje do hloubky i vodu nasáklou v mořském dně. Voda sníží teplotu, při které hornina nad deskou taje, a vzniklé magma stoupá vzhůru, až se prorazí ven. Zároveň se mořské dno v místě, kde se deska ohýbá dolů, prohne hodně hluboko — a protože se přitom desky o sebe zadrhávají, bývají tam i silné otřesy.",
    ],
    hintB: [
      "Hluboký zářez v mořském dně a hned vedle něj pás sopek. Který jediný pohyb zvládne obojí naráz?",
      "Dno se prohne dolů tam, kde se jedna deska ohýbá a ponořuje pod druhou. V hloubce nad ní se pak taví hornina a magma stoupá k povrchu, proto se sopky táhnou kousek od zářezu. Pouhé rozestupování ani smýkání desek podél sebe takový zářez neudělá.",
    ],
    vysvetleniA: "Oceánská deska je těžší, proto se při setkání s pevninskou podsouvá pod ni. V místě ohybu se dno prohne do hlubokého příkopu. Deska s sebou stahuje do hloubky vodu, ta sníží teplotu tání horniny nad deskou, a vzniklé magma stoupá vzhůru jako pás sopek kousek za příkopem, už na sousední desce. Zadrhávání obou desek k tomu přidává silná zemětřesení.",
    vysvetleniB: "Hluboký příkop a kousek za ním pás sopek je poznávací znamení podsouvání: oceánská deska klesá pod pevninskou a v hloubce nad ní se taví hornina, jejíž magma si razí cestu vzhůru.",
  },
  {
    pohyb: "Dvě pevninské desky se srazí čelem",
    kde: "kde se dvě pevninské desky srazí čelem",
    veta: "dvě pevninské desky se srazí čelem",
    jev: "Vrásné pohoří zdvižené do výšky",
    jevGen: "vznik vysokého vrásného pohoří uprostřed pevniny, kde nestojí žádná sopka ani nikde poblíž není hlubokooceánský příkop",
    jevMale: "vrásné pohoří zdvižené do výšky, a to bez sopek a bez příkopu",
    jevVznikaTam: "Vrásné pohoří bez sopek vzniká tam, kde se dvě pevninské desky srazí a vrstvy hornin se zmačkají do výšky. (Nad podsouvající se deskou pohoří také roste, ale je sopečné a provází ho hlubokooceánský příkop.)",
    kdyzPohyb: "Při čelní srážce dvou pevninských desek jsou sice také silné otřesy, ale hlavně se vrstvy hornin mačkají a zdvihají vysoko nad okolí — zůstane po nich pohoří.",
    hintA: [
      "Dvě desky do sebe narazí a ani jedna není dost těžká, aby klesla. Kam se stlačené vrstvy hornin podějí?",
      "Pevninská deska je lehká, takže se nepotopí. Když na sebe najedou dvě takové, vrstvy hornin mezi nimi se zmačkají jako ubrus a nemají kam jinam než vzhůru. Přesně takhle vznikly Alpy i nejvyšší pohoří světa.",
    ],
    hintB: [
      "Vrstvy hornin jsou zmačkané a zdvižené vysoko nad okolí. Co je muselo takhle stlačit?",
      "Nahoru se vrstvy dostanou jedině tlakem z obou stran, tedy když na sebe dvě desky najedou a ani jedna neklesne do hloubky. Při vzdalování se naopak prostor otvírá a vrstvy se natahují, takže z nich žádný vysoký hřeben nevznikne.",
    ],
    vysvetleniA: "Pevninské desky jsou lehké, takže se ani jedna nepodsune. Při čelní srážce se vrstvy hornin stlačí, zvlní do vrás a zdvihnou vysoko nad okolí. Tak vznikly Alpy i Himálaj.",
    vysvetleniB: "Vysoké vrásné pohoří bez sopek a bez příkopu je stopa po čelní srážce dvou pevninských desek: vrstvy hornin se zmačkaly a zdvihly. Himálaj takhle roste dodnes, protože tlak obou desek neustal. Pohoří vyroste i tam, kde se oceánská deska podsouvá pod pevninskou (třeba Andy), ale tam ho provázejí sopky a před pobřežím hlubokooceánský příkop.",
  },
  {
    pohyb: "Desky se posouvají podél sebe",
    kde: "kde se dvě desky posouvají podél sebe",
    veta: "desky se posouvají podél sebe",
    jev: "Otřesy podél zlomu bez sopek a bez pohoří",
    jevGen: "časté otřesy podél zlomu, u kterých nevzniká ani sopka, ani pohoří",
    jevMale: "otřesy podél zlomu, u kterých nevzniká ani sopka, ani pohoří",
    jevVznikaTam: "Otřesy podél zlomu bez sopek a bez pohoří jsou typické tam, kde se desky jen míjejí bokem, takže se nic nemačká do výšky ani neklesá do hloubky.",
    kdyzPohyb: "Když se desky jen smýkají podél sebe, hornina praská a otřásá se, ale nic se neponoří, neroztaví ani nezmačká do výšky.",
    hintA: [
      "Desky se míjejí bokem: žádná neklesá do hloubky a nic se netlačí vzhůru. Co z toho na takovém rozhraní vůbec může vzniknout?",
      "Roztavená hornina vzniká až tam, kde se deska ponoří hluboko do horka, a pohoří vyroste jen tam, kde se vrstvy o sebe mačkají. Při pouhém smýkání nenastane ani jedno. Zato se desky o sebe zadrhávají a nahromaděné napětí povolí naráz.",
    ],
    hintB: [
      "V oblasti to praská a třese se, ale žádná sopka tam nestojí a žádné hory nerostou. Který pohyb tomu odpovídá?",
      "Sopka potřebuje magma z hloubky a pohoří potřebuje tlak, který vrstvy nahrne do výšky. Hledej proto pohyb, při kterém se desky jen míjejí bokem: nic se nemačká vzhůru, nic neklesá dolů, jen se o sebe zadrhávají a napětí uvolňují otřesy.",
    ],
    vysvetleniA: "Když se desky jen smýkají podél sebe, zadrhávají se a nahromaděné napětí povolí naráz — proto jsou podél zlomu častá zemětřesení. Žádná deska ale neklesá do hloubky, takže nevzniká magma a sopky chybí, a protože se vrstvy o sebe nemačkají, nevyroste tam ani pohoří.",
    vysvetleniB: "Časté otřesy podél zlomu, u kterých nevzniká sopka ani pohoří, prozrazují, že se desky míjejí bokem. Tření a zadrhávání vyvolá zemětřesení, ale hornina se přitom neroztaví ani nezmačká do výšky. (Silné otřesy jsou i tam, kde se srazí dvě pevninské desky — tam ale vzniká pohoří.)",
  },
];

/**
 * Osm variant: čtyři pohyby, každý ve směru pohyb → jev i jev → pohyb.
 *
 * Pořadí NENÍ po dvojicích. Obě otázky téhož pohybu jsou tatáž věc naruby
 * („co vzniká, když se desky vzdalují“ × „který pohyb vysvětluje hřbet“) a
 * vedle sebe v jednom sezení působí jako opakování. Proto nejdřív všechny
 * pohyby jedním směrem a teprve pak druhým — do šestiúlohového sezení se
 * tak dostanou jen různé pohyby.
 */
export const POHYB_VARIANTY: { m: number; zPohybu: boolean }[] = [
  ...POHYBY.map((_, m) => ({ m, zPohybu: true })),
  ...POHYBY.map((_, m) => ({ m, zPohybu: false })),
];

function genPohybJev(varianta: number): PracticeTask | null {
  const { m: mi, zPohybu } = POHYB_VARIANTY[varianta];
  const m = POHYBY[mi];
  const ostatni = POHYBY.filter((p) => p !== m);
  if (zPohybu) {
    return choice(
      `Co vzniká na rozhraní, ${m.kde}?`,
      m.jev,
      ostatni.map((p) => ({
        value: p.jev,
        why: `${p.jevVznikaTam} Při pohybu ze zadání (${m.veta}) vzniká něco jiného: ${m.jevMale}.`,
      })),
      { hints: m.hintA, explanation: m.vysvetleniA },
    );
  }
  return choice(
    `Který pohyb litosférických desek vysvětluje ${m.jevGen}?`,
    m.pohyb,
    ostatni.map((p) => ({
      value: p.pohyb,
      why: `${p.kdyzPohyb} Jev ze zadání (${m.jevMale}) vzniká jinak: ${m.veta}.`,
    })),
    { hints: m.hintB, explanation: m.vysvetleniB },
  );
}

// ── L2 (b) — banka souvislostí ─────────────────────────────────────────────
export const POOL_L2: Polozka[] = [
  {
    q: "Čím se vysvětluje, že sopky a zemětřesení leží na Zemi v úzkých pásech?",
    correct: "Pásy sledují okraje litosférických desek",
    distractors: [
      { value: "Pásy vedou tam, kde je na povrchu největší horko", why: "Podnebí o sopkách nerozhoduje. Sopky jsou i na Islandu v chladu a uprostřed horkých pouští naopak chybí." },
      { value: "Pásy procházejí nejhlubšími údolími pevnin", why: "Údolí vyhloubily řeky a ledovce shora. Pásy sopek se řídí tím, co se děje hluboko pod povrchem." },
      { value: "Rozmístění je náhodné a žádné pravidlo v něm není", why: "Náhodné rozhodně není: kdyby bylo, byly by sopky rozeseté rovnoměrně, a ne seřazené do dlouhých linií." },
    ],
    hints: [
      "Sopky ani otřesy nejsou rozeseté rovnoměrně. Zamysli se, co na Zemi tvoří podobně dlouhé linie.",
      "Kamenný obal Země je rozlámaný na velké kusy a všechno zajímavé se děje tam, kde se dva takové kusy setkávají — tlačí se, rozestupují nebo míjejí. Uvnitř kusů je naopak klid, a proto tam sopky ani silné otřesy nejsou.",
    ],
    explanation: "Sopky a zemětřesení kopírují okraje litosférických desek, protože právě tam se desky setkávají a hýbou proti sobě. Vnitřky desek jsou klidné, proto tam takové jevy chybí.",
  },
  {
    q: "Kde na Zemi leží Ohnivý kruh?",
    correct: "V pásu kolem celého Tichého oceánu",
    distractors: [
      { value: "V pásu kolem Severního ledového oceánu", why: "Kolem severního pólu tolik činných sopek není. Nejvíc jich lemuje největší oceán světa." },
      { value: "Podél rovníku napříč všemi světadíly", why: "Sopky se neřídí zeměpisnou šířkou, ale okraji desek. Rovník jich většinu míjí." },
      { value: "Uprostřed velkých pevnin daleko od moře", why: "Uprostřed desek je klid. Pás sopek naopak kopíruje okraje desek, tedy převážně pobřeží." },
    ],
    hints: [
      "Pás kopíruje okraje litosférických desek. Zjisti tedy, kolem čeho je na Zemi nejvíc okrajů s podsouváním.",
      "Desky kolem tohoto oceánu se z velké části podsouvají pod sousední, a proto je nad nimi nejvíc činných sopek na Zemi. Pás proto prochází od Jižní Ameriky přes Severní Ameriku, Japonsko až po Nový Zéland.",
    ],
    explanation: "Ohnivý kruh lemuje Tichý oceán: táhne se od Jižní a Severní Ameriky přes Japonsko a Filipíny až k Novému Zélandu. Kopíruje okraje desek, kde se oceánské dno podsouvá pod sousední desky.",
  },
  {
    q: "Proč po silném zemětřesení pod mořem hrozí pobřeží vlna tsunami?",
    correct: "Pohyb dna nadzvedne vodní sloupec nad sebou",
    distractors: [
      { value: "Láva ohřeje mořskou vodu a ta se prudce rozpíná", why: "Vlna vzniká i tam, kde žádná láva není. Rozhoduje náhlý pohyb dna, ne teplota vody." },
      { value: "Vítr nad epicentrem zesílí a nažene vlny k pobřeží", why: "Vítr dělá běžné vlny, ale tahle přichází i za klidného počasí. Zdroj je pod hladinou." },
      { value: "Voda spadne do trhliny ve dně a vystříkne zpátky", why: "Trhlina by vodu spíš pohltila. Vlnu vyvolá naopak zdvih dna, který vodu vytlačí vzhůru." },
    ],
    hints: [
      "Voda sama od sebe nic nedělá. Přemýšlej, co se při otřesu stane s dnem a co to udělá s vodou nad ním.",
      "Nad každým kouskem mořského dna stojí obrovské množství vody. Když se dno naráz posune vzhůru, musí se tenhle sloupec posunout taky — a ta porucha se pak rozběhne po hladině na všechny strany. U pobřeží, kde je mělko, se zvedne do výšky.",
    ],
    explanation: "Při zemětřesení pod mořem se dno naráz posune a nadzvedne vodu nad sebou. Porucha se šíří oceánem jako dlouhá vlna a v mělčině u pobřeží se zvedne do ničivé výšky. Proto se v ohrožených oblastech po otřesu vyhlašuje výstraha a lidé odcházejí od moře.",
  },
  {
    q: "Co znamená vyšší číslo na Richterově stupnici?",
    correct: "Otřes byl silnější",
    distractors: [
      { value: "Ohnisko leželo hlouběji", why: "Hloubka ohniska je jiný údaj. Stupnice popisuje sílu otřesu, ne to, odkud vyšel." },
      { value: "Otřes trval déle", why: "Délka trvání se měří zvlášť. Číslo na stupnici říká, jak velká energie se uvolnila." },
      { value: "Otřes byl dál od pobřeží", why: "Vzdálenost od pobřeží se stupnicí nesouvisí. Ta popisuje samotný otřes, ne jeho polohu." },
    ],
    hints: [
      "Stupnice popisuje jednu jedinou vlastnost otřesu. Rozmysli si, kterou z nabízených by mělo smysl vyjádřit jedním číslem pro celé zemětřesení.",
      "Hloubka, doba trvání i vzdálenost se dají změřit samostatně a u každého místa vycházejí jinak. Stupnice naproti tomu dává jedno číslo pro celé zemětřesení — popisuje tedy energii, která se při něm uvolnila.",
    ],
    explanation: "Richterova stupnice vyjadřuje sílu zemětřesení: čím vyšší číslo, tím větší energie se uvolnila. Hloubka ohniska ani vzdálenost od pobřeží se do ní nepromítají, ty ovlivňují až velikost škod.",
  },
  {
    q: "Proč vzniká pás sopek na okraji pevniny, pod kterou se podsouvá oceánská deska?",
    correct: "Nad podsunutou deskou se taví hornina a magma stoupá",
    distractors: [
      { value: "Tření obou desek zapálí horninu přímo na povrchu", why: "Hornina nehoří jako dřevo. Roztaví se až v hloubce, kde je obrovské horko a tlak." },
      { value: "Mořská voda se v příkopu vaří a protrhne zemskou kůru", why: "Voda v příkopu je naopak studená. Zdroj žhavé horniny je hluboko pod povrchem." },
      { value: "Oceánská deska vytlačí nahoru horninu z okraje pevniny", why: "Sopka nevyvrhuje kus vytlačené pevniny, ale roztavenou horninu, která vznikla hluboko dole." },
    ],
    hints: [
      "Sopka potřebuje roztavenou horninu. Zamysli se, kde je dost velké horko na to, aby hornina roztála.",
      "Deska, která se ponoří, stahuje do hloubky i vodu nasáklou v mořském dně. Voda snižuje teplotu, při které rozžhavená hornina kolem taje, a co roztaje, je lehčí než pevné okolí. Cestu vzhůru si to najde skrz kůru — a tam, kde vyjde ven, stojí sopka.",
    ],
    explanation: "Sama podsouvající se deska se zpravidla netaví — stahuje s sebou do hloubky vodu a ta sníží teplotu, při které taje hornina nad ní. Vzniklé magma je lehčí než okolí, stoupá vzhůru a prorazí kůru. Proto se pás sopek táhne rovnoběžně s příkopem, kousek od něj na pevnině.",
  },
  {
    q: "Co pohání pohyb litosférických desek?",
    correct: "Pomalé proudění horkých hornin v zemském plášti",
    distractors: [
      { value: "Otáčení Země kolem její vlastní osy", why: "Země se otáčí pořád stejně, ale desky se pohybují různými směry a různě rychle. Pohon je uvnitř Země." },
      { value: "Přitažlivost Měsíce, která zvedá i mořskou vodu", why: "Měsíc působí na vodu (příliv), ne na desky. Ty pohání teplo z nitra Země." },
      { value: "Tlak mořské vody na okraje pevninských desek", why: "Voda je proti hornině lehká. Deskami hýbe proudění v horké vrstvě pod nimi." },
    ],
    hints: [
      "Desky leží na horké tvárné vrstvě. Zamysli se, co se děje s horkou látkou zespodu a se studenější nahoře.",
      "V hrnci s polévkou stoupá teplá tekutina vzhůru a chladnější u hladiny klesá zpátky dolů. Podobně, jen nesrovnatelně pomaleji, se chová hornina v horké vrstvě pod deskami — a to, co po ní nahoře plave, s ní putuje.",
    ],
    explanation: "Desky pohání pomalé proudění v zemském plášti: horká hornina stoupá, chladnější klesá, a desky nad tím se posouvají. Energie pochází z tepla uvnitř Země, ne z pohybů Země ve vesmíru.",
  },
  {
    q: "Proč je Island sopečný ostrov, i když leží uprostřed Atlantského oceánu?",
    correct: "Leží přímo na hřbetu, kde se desky rozestupují",
    distractors: [
      { value: "Leží blízko evropské pevniny, kde končí šelf", why: "Island leží asi tisíc kilometrů od evropské pevniny, až za šelfem. Hlavně ale rozhraní desek nevede podél pobřeží — prochází přímo Islandem uprostřed oceánu." },
      { value: "Leží v místě, kde se dvě pevniny srazily", why: "Při srážce pevnin vzniká pohoří, ne sopečný ostrov uprostřed oceánu." },
      { value: "Leží tak daleko na severu, že kůra praská", why: "Zeměpisná šířka na sopky nemá vliv. Na stejné šířce jinde v oceánu sopky nejsou." },
    ],
    hints: [
      "Okraj desky nemusí ležet jen u pobřeží pevniny. Vzpomeň si, co se táhne uprostřed Atlantského oceánu po celé jeho délce.",
      "Dno Atlantiku není rovná pláň: uprostřed se pořád doplňuje horninou, která vystupuje z hloubky a tuhne. Na jednom místě se jí za miliony let nahromadilo tolik, že vyčnívá nad hladinu — a právě tam ostrov leží. Zbývá určit, co se na takovém místě děje s deskami.",
    ],
    explanation: "Island leží na Středoatlantském hřbetu, tedy přímo na rozhraní dvou desek, které se od sebe vzdalují. Roztavená hornina tam vystupuje k povrchu, a proto je ostrov sopečný a stále se mírně rozšiřuje.",
  },
  {
    q: "Co je oceánský hřbet?",
    correct: "Podmořské pohoří tam, kde se desky rozestupují",
    distractors: [
      { value: "Nejhlubší zářez v oceánu u okraje pevniny", why: "Takový zářez je příkop a vzniká podsouváním. Hřbet je naopak vyvýšenina uprostřed oceánu." },
      { value: "Pás sopek na pobřeží nad podmořským příkopem", why: "Ten pás leží na pevnině nad podsouvající se deskou. Hřbet je daleko od pevniny, uprostřed oceánu." },
      { value: "Okraj pevniny, kde končí mělké moře u břehu", why: "Tam je okraj pevninského šelfu. Hřbet leží hluboko uprostřed oceánu, ne u pobřeží." },
    ],
    hints: [
      "Slovo hřbet napovídá tvar: je to vyvýšenina, ne prohlubeň. Zbývá určit, čím je na dně oceánu způsobená.",
      "Po obou stranách takového místa je dno tím starší, čím dál od něj je — nejmladší hornina leží přímo v jeho ose. To prozrazuje, že tam dno teprve vzniká, a ne že se tam něco propadá nebo mizí.",
    ],
    explanation: "Oceánský hřbet je podmořské pohoří, které vzniká tam, kde se dvě desky od sebe vzdalují. V jeho ose vystupuje magma, tuhne a vytváří novou oceánskou kůru — dno se tím rozšiřuje na obě strany.",
  },
  {
    q: "Čím se vysvětluje, že v Japonsku jsou časté otřesy i činné sopky?",
    correct: "Leží na rozhraní desek, kde se jedna podsouvá",
    distractors: [
      { value: "Leží uprostřed velké desky daleko od jejích okrajů", why: "Uvnitř desek je klid. Japonsko naopak leží přímo v pásu, kde se desky setkávají." },
      { value: "Leží v pásu horkého podnebí nedaleko rovníku", why: "Podnebí se sopkami nesouvisí. Otřesy jsou i v chladných oblastech na okraji desky." },
      { value: "Leží na ostrovech, a ty se v moři přirozeně chvějí", why: "Ostrovy stojí na mořském dně stejně pevně jako pevnina. Chvějí se jen tehdy, když se hýbou desky pod nimi." },
    ],
    hints: [
      "Japonsko je součástí většího pásu, který obepíná celý Tichý oceán. Co ten pás na mapě sleduje?",
      "Otřesy i sopky se objevují společně jen u jednoho typu rozhraní: tam, kde se hornina dostane do hloubky, ve které se taví. Projdi proto možnosti jednu po druhé a u každé se zeptej, jestli tohle umožňuje — uvnitř desky ani horké podnebí magma z hloubky nedodají.",
    ],
    explanation: "Japonsko leží na rozhraní desek, kde se oceánská deska podsouvá pod sousední. Zadrhávání desek působí častá zemětřesení a magma z hloubky živí činné sopky. Proto je součástí Ohnivého kruhu.",
  },
  {
    q: "Jak se jmenuje dlouhý úzký zářez ve dně tam, kde se jedna deska podsouvá pod druhou?",
    correct: "Hlubokooceánský příkop",
    distractors: [
      { value: "Oceánský hřbet", why: "Hřbet je vyvýšenina uprostřed oceánu a vzniká při rozestupování desek, ne při podsouvání." },
      { value: "Vrásné pohoří", why: "Vrásné pohoří vzniká na pevnině při srážce dvou desek a tyčí se do výšky, ne dolů." },
      { value: "Sopečný kráter", why: "Kráter je prohlubeň na vrcholu sopky, jen pár set metrů široká. Zářez ve dně je dlouhý tisíce kilometrů." },
    ],
    hints: [
      "Hledáš název pro sníženinu, ne pro vyvýšeninu. Vznikne tam, kde se okraj desky ohýbá směrem dolů.",
      "Když se okraj desky ohne a míří dolů, dno se v tom místě prohne a vznikne dlouhá úzká sníženina. Název takového útvaru popisuje dvě věci naráz — kde leží a jaký má tvar. Hledej tedy pojmenování pro protáhlou sníženinu v mořském dně, ne pro vyvýšeninu a ne pro otvor v sopce.",
    ],
    explanation: "Hlubokooceánský příkop je dlouhý úzký zářez ve dně v místě, kde se jedna deska podsouvá pod druhou. Leží tam nejhlubší místa oceánů a kousek za příkopem, už na sousední desce, bývá pás sopek.",
  },
  {
    q: "Proč jsou zemětřesení na rozhraní dvou desek tak častá?",
    correct: "Desky se o sebe zadrhnou a napětí povolí naráz",
    distractors: [
      { value: "Kůra je tam z měkčí horniny, a proto se boří", why: "Hornina tam měkčí není. Otřes vznikne tím, že pevná hornina nevydrží napětí a praskne." },
      { value: "Otřesy tam vyvolává příboj narážející na pobřeží", why: "Vlny dopadají na pobřeží pořád, ale zemětřesení z nich nevzniká. Energie přichází zevnitř Země." },
      { value: "Kůra je tam tenčí, a tak z hloubky proniká teplo", why: "Teplo samo otřes neudělá. Otřes přijde ve chvíli, kdy se nahromaděné napětí uvolní pohybem." },
    ],
    hints: [
      "Desky se pohybují plynule, ale na okrajích to plynule nejde. Zamysli se, co se stane, když se o sebe zachytí.",
      "Zkus si to na dvou prknech přitisknutých k sobě: dokud je tlačíš mírně, drží. Napětí ale roste, až to jednou nevydrží a obě prkna sebou škubnou. Přesně to se děje na okraji desek, jen v obrovském měřítku.",
    ],
    explanation: "Desky se na okrajích o sebe zadrhnou, ale pohyb pokračuje dál, takže v hornině roste napětí. Když pevnost horniny nestačí, uvolní se naráz — a to je zemětřesení. Proto se otřesy na rozhraní desek opakují.",
  },
  {
    q: "Proč se v okolí sopky často objeví otřesy ještě před jejím výbuchem?",
    correct: "Stoupající magma si razí cestu a láme horninu",
    distractors: [
      { value: "Sopka horninu nejdřív ochladí, a ta se pak smrští", why: "Před výbuchem se okolí naopak prohřívá. Otřesy působí pohyb horniny, ne chladnutí." },
      { value: "Popel nad sopkou zatíží povrch a ten se propadne", why: "Popel se sype až při výbuchu, ne před ním. Otřesy přicházejí dřív, než se cokoli vysype." },
      { value: "Láva už stéká po svahu a rozechvívá celý kraj", why: "Než začne výbuch, žádná láva venku není. Pohyb se odehrává pod povrchem." },
    ],
    hints: [
      "Než se roztavená hornina dostane ven, musí projít skrz pevnou kůru. Co to s okolní horninou udělá?",
      "Roztavená hornina si cestu vzhůru neprorazí potichu: tlačí na okolí, rozevírá pukliny a skála kolem ní praská. Každé takové prasknutí je malý otřes, a proto jich seismologové před výbuchem zaznamenají celé série.",
    ],
    explanation: "Magma stoupající k povrchu tlačí na okolní horninu, rozevírá pukliny a láme ji. Každé prasknutí je slabý otřes. Právě proto se hustota otřesů sleduje — pomáhá sopečný výbuch předpovědět a včas varovat okolí.",
  },
];

// ── L3 — analýza a přenos na nepopsaný případ ──────────────────────────────
export const POOL_L3: Polozka[] = [
  {
    q: "Ostrov X leží uprostřed oceánu a patří do dlouhé linie, ve které jsou sopky činné po celé délce a otřesy jsou časté přes tisíce kilometrů. Co o jeho poloze nejspíš platí?",
    correct: "Leží na rozhraní dvou litosférických desek",
    distractors: [
      { value: "Leží uprostřed jedné desky, daleko od okrajů", why: "Uvnitř desky bývá klid — činné sopky a časté otřesy jsou tam vzácné a nebývají rozesety podél celé dlouhé linie. Řetěz sopek uvnitř desky sice existuje (Havaj nad horkou skvrnou), ale činná je tam nanejvýš jedna sopka na konci řetězce, ne celý pás naráz." },
      { value: "Leží v místě, kde je nejteplejší podnebí", why: "Počasí nad hladinou se sopkami nesouvisí. Rozhoduje, co se děje v hloubce pod ostrovem." },
      { value: "Leží na nejstarší oceánské kůře, jaká je", why: "Nejstarší kůra bývá naopak klidná. Sopky a otřesy patří k místům, kde kůra právě vzniká nebo mizí." },
    ],
    hints: [
      "Spoj si informace ze zadání dohromady: činné sopky, časté otřesy a hlavně to, že se táhnou v jedné dlouhé linii. Co na Zemi tvoří takhle dlouhé linie?",
      "Oba jevy potřebují pohyb v hloubce: magmatu se musí odkud vzít a hornina se musí mít kde posunout. To se děje tam, kde se setkávají dva kusy kamenného obalu — a takové místo nemusí ležet u pobřeží, klidně je i uprostřed oceánu. Právě proto jsou jevy činné po celé délce dlouhého pásu, a ne jen v jediném bodě.",
    ],
    explanation: "Sopky a otřesy činné po celé délce dlouhé linie ukazují na okraj desky, protože právě okraje desek se táhnou přes tisíce kilometrů. Uprostřed oceánu to bývá hřbet, kde se desky rozestupují — přesně tak vznikl třeba Island. (Řetěz sopek uvnitř desky existuje také, třeba Havaj nad horkou skvrnou, ale činná je tam jen jedna sopka na konci řetězce a zbytek je vyhaslý.)",
  },
  {
    q: "Město M leží uprostřed velké pevninské desky, tisíce kilometrů od jejího okraje. Co tam hrozí nejméně?",
    correct: "Výbuch sopky a silné zemětřesení",
    distractors: [
      { value: "Povodeň po vydatných deštích", why: "Povodeň nezávisí na deskách, ale na počasí a na řekách. Uprostřed desky hrozí stejně jako jinde." },
      { value: "Vichřice a přívalový déšť", why: "Vichřice vzniká v ovzduší, ne v zemské kůře. Poloha uvnitř desky před ní nechrání." },
      { value: "Sesuv půdy na prudkém svahu", why: "Sesuv spustí déšť a sklon svahu. S okrajem desky přímo nesouvisí." },
    ],
    hints: [
      "Roztřiď si nabízené pohromy podle toho, kde vznikají: v ovzduší, nebo hluboko v zemské kůře.",
      "Tři z nabídnutých jevů souvisejí s počasím a se svahem, takže mohou potkat kterékoli místo na světě. Jen jeden z nich potřebuje okraj desky — a od toho je zadané město hodně daleko.",
    ],
    explanation: "Uvnitř desky se nic velkého nehýbe, takže tam nevzniká magma ani silné napětí v hornině. Proto tam sopky a ničivá zemětřesení prakticky nehrozí. Povětrnostní pohromy se ale poloze uvnitř desky nevyhýbají.",
  },
  {
    q: "Pobřeží P leží nad místem, kde se oceánská deska podsouvá pod pevninskou. Co tam hrozí?",
    correct: "Silné otřesy, výbuchy sopek i vlna tsunami",
    distractors: [
      { value: "Jen mírné otřesy, sopky tam nevznikají", why: "Podsouvání dodá do hloubky horninu, která se roztaví — sopky tam patří stejně jako otřesy." },
      { value: "Hlavně růst nového pohoří, otřesy ne", why: "Při podsouvání se desky zadrhávají, takže otřesy patří k nejsilnějším na Zemi." },
      { value: "Nic zvláštního, je to klidný okraj desky", why: "Podsouvání je právě ten nejneklidnější typ okraje. Klid je naopak uvnitř desek." },
    ],
    hints: [
      "Projdi si, co se při podsouvání děje: deska se ohýbá, zadrhává a klesá do horka. Každý z těch dějů něco způsobí.",
      "Deska, která klesá, se v hloubce taví — z toho bude sopka. Než klesne, zadrhává se o sousední desku — z toho budou otřesy. A protože se to celé odehrává pod mořem, může se při prudkém posunu dna zvednout i ničivá vlna.",
    ],
    explanation: "Nad podsouvající se deskou se sejde všechno naráz: zadrhávání desek působí nejsilnější zemětřesení, tavení v hloubce živí sopky a pohyb mořského dna může vyvolat tsunami. Proto se v takových oblastech staví odolné domy a nacvičuje se evakuace.",
  },
  {
    q: "Čím se vysvětluje, že Himálaj stále roste?",
    correct: "Dvě pevninské desky se do sebe pořád tlačí",
    distractors: [
      { value: "Dvě desky se od sebe vzdalují a hory je následují", why: "Při vzdalování se prostor otvírá a vyplňuje novou horninou — vrstvy se tím nezdvihnou. Do výšky je natlačí až tlak z obou stran." },
      { value: "Pod pohořím vybuchuje sopka a přidává horninu", why: "Himálaj není sopečné pohoří. Vrcholy tvoří zvrásněné vrstvy hornin, ne ztuhlá láva." },
      { value: "Na vrcholech každý rok přibývá sníh a led", why: "Sníh je jen pokrývka, která v létě zase ubude. Roste samotná skála pod ním." },
    ],
    hints: [
      "Pohoří vzniklo srážkou dvou desek. Zeptej se, jestli ta srážka už skončila, nebo pokračuje.",
      "Desky se nezastavily: jedna se do druhé tlačí dál a vrstvy hornin se mezi nimi stále mačkají. Dokud tenhle tlak trvá, jsou vrstvy vytlačovány vzhůru a pohoří přibývá na výšce, i když jen o kousek za rok.",
    ],
    explanation: "Himálaj vyrostl srážkou dvou pevninských desek a ta srážka trvá dál. Desky se do sebe stále tlačí, vrstvy hornin se mačkají a zdvihají, takže pohoří roste dodnes — jen tak pomalu, že to prozradí až přesné měření.",
  },
  {
    q: "Proč má Česko jen dávno vyhaslé sopky a žádnou činnou?",
    correct: "Leží uvnitř desky, daleko od jejího okraje",
    distractors: [
      { value: "Leží příliš na severu, kde je zemská kůra studená", why: "Zeměpisná šířka o sopkách nerozhoduje. Island leží ještě severněji a sopky tam činné jsou." },
      { value: "Leží nízko, a proto magma nemá kudy vyjít ven", why: "Nadmořská výška cestu magmatu nezavírá. Sopky jsou i u hladiny moře." },
      { value: "Leží daleko od moře a bez vody sopka nevznikne", why: "Sopky vznikají i hluboko ve vnitrozemí. Rozhoduje poloha vůči okraji desky, ne vzdálenost od moře." },
    ],
    hints: [
      "Porovnej polohu Česka s místy, kde sopky činné jsou. Nejde o podnebí ani o nadmořskou výšku.",
      "Činné sopky potřebují magma z hloubky, a to se dostává vzhůru hlavně na okrajích desek. Česko leží v klidné části velké desky, kde se dnes nic nepodsouvá ani nerozestupuje — sopky tu byly dávno, ale zdroj magmatu už vyhasl.",
    ],
    explanation: "Česko leží uvnitř euroasijské desky, daleko od jejích okrajů. Proto tu dnes magma nemá odkud stoupat a sopky jsou jen pozůstatkem dávné minulosti, jako Říp nebo Komorní hůrka.",
  },
  {
    q: "Který z těchto jevů NEvzniká pohybem litosférických desek?",
    correct: "Střídání ročních dob",
    distractors: [
      { value: "Vznik vrásného pohoří", why: "Vrásné pohoří vzniká přímo srážkou dvou desek — pohyb desek za ním stojí." },
      { value: "Růst oceánského hřbetu", why: "Hřbet roste tam, kde se desky rozestupují. Bez pohybu desek by nevznikl." },
      { value: "Vznik hlubokooceánského příkopu", why: "Dno se prohne do příkopu tam, kde se jedna deska podsouvá pod druhou. I ten je tedy dílem pohybu desek." },
    ],
    hints: [
      "Projdi možnosti jednu po druhé a u každé se zeptej, jestli se odehrává v zemské kůře, nebo úplně jinde.",
      "Tři z nabídnutých jevů vznikají na rozhraní desek, tedy hluboko pod nohama. Ten čtvrtý souvisí s tím, jak Země obíhá kolem Slunce a jak je skloněná její osa — s děním pod povrchem nemá nic společného.",
    ],
    explanation: "Roční doby způsobuje sklon zemské osy při oběhu Země kolem Slunce, ne pohyb desek. Pohoří, hřbety i příkopy jsou naopak přímé důsledky toho, jak se desky pohybují.",
  },
  {
    q: "Který z těchto jevů NELZE vysvětlit pohybem litosférických desek?",
    correct: "Příliv a odliv na mořském pobřeží",
    distractors: [
      { value: "Zemětřesení podél zlomu v hornině", why: "Otřesy podél zlomu vznikají právě tím, že se desky o sebe zadrhnou a naráz povolí." },
      { value: "Výbuch sopky nad podmořským příkopem", why: "Magma pro takovou sopku vzniká z desky, která se podsouvá do hloubky a taví se tam." },
      { value: "Růst Himálaje o kousek každý rok", why: "Himálaj roste, protože se dvě pevninské desky do sebe stále tlačí." },
    ],
    hints: [
      "Tři z jevů se odehrávají v hornině, čtvrtý na hladině moře. Zamysli se, co hýbe vodou v oceánech.",
      "Hladina moře stoupá a klesá pravidelně dvakrát denně, tedy v rytmu, který má co dělat s pohybem těles ve vesmíru, ne s pomalým plazením desek. Ostatní tři jevy naopak vznikají na rozhraní desek.",
    ],
    explanation: "Příliv a odliv působí přitažlivost Měsíce a Slunce, ne pohyb desek. Zemětřesení, sopky i růst pohoří jsou naopak důsledky toho, jak se desky pohybují po tvárné vrstvě pod sebou.",
  },
  {
    q: "Dvě stejně silná zemětřesení: jedno mělo ohnisko těsně pod povrchem, druhé velmi hluboko. Kde budou škody větší?",
    correct: "Tam, kde ohnisko leželo mělce pod povrchem",
    distractors: [
      { value: "Tam, kde ohnisko leželo hluboko pod povrchem", why: "Z velké hloubky urazí vlnění dlouhou cestu a cestou zeslábne. Nahoru dorazí slabší." },
      { value: "Škody budou stejné, hloubka na nich nic nemění", why: "Hloubka rozhoduje hodně: rozdíl mezi mělkým a hlubokým ohniskem bývá znát na první pohled." },
      { value: "Tam, kde ohnisko bylo hlouběji a otřes trval déle", why: "Délka otřesu se řídí jinými vlivy než hloubkou. Rozhodující je, jak daleko musí vlnění na povrch." },
    ],
    hints: [
      "Otřes musí z ohniska dorazit až na povrch. Zamysli se, co udělá s vlněním dlouhá cesta horninou.",
      "Představ si klepání na jeden konec dlouhého trámu: čím dál jsi, tím slaběji to cítíš. Stejně slábne i zemětřesné vlnění, když putuje horninou. Proto záleží na tom, jak dlouhou cestu k povrchu musí urazit.",
    ],
    explanation: "Vlnění cestou horninou slábne. Mělké ohnisko je povrchu blízko, takže tam dorazí velká část energie a škody bývají velké. Z hlubokého ohniska dorazí nahoru vlnění už zeslabené, i když je zemětřesení na stupnici stejně silné.",
  },
  {
    q: "Dvě města zasáhlo totéž zemětřesení. Ve kterém z nich lidé pocítili silnější otřes?",
    correct: "V tom, které leží blíž k epicentru",
    distractors: [
      { value: "V tom, které leží dál od epicentra", why: "Je to naopak: čím dál od epicentra, tím je vlnění slabší, protože se cestou rozptýlí." },
      { value: "V tom, které leží výš nad hladinou moře", why: "Nadmořská výška sílu otřesu neurčuje. Rozhoduje vzdálenost od místa, odkud se vlnění šíří." },
      { value: "V tom, které má víc obyvatel", why: "Počet obyvatel ovlivní počet zasažených lidí, ne sílu samotného otřesu." },
    ],
    hints: [
      "Vlnění se z jednoho místa šíří do okolí na všechny strany. Co se s ním děje, čím dál od zdroje dorazí?",
      "Je to jako s hozeným kamenem do rybníka: vlny jsou u místa dopadu vysoké a u břehu už jen čeří hladinu. Energie se totiž rozprostře po stále větší ploše, takže na každé místo připadne méně.",
    ],
    explanation: "Vlnění se z ohniska šíří na všechny strany a se vzdáleností slábne. Nejsilněji je proto otřes cítit v epicentru a blízko něj, dál od něj už jen mírně. Proto se u zemětřesení vždycky uvádí i poloha epicentra.",
  },
  {
    q: "Na dně oceánu jsou horniny nejmladší uprostřed a čím blíž k pevninám, tím starší. Co z toho plyne?",
    correct: "Dno uprostřed přibývá a roste do stran",
    distractors: [
      { value: "Dno uprostřed mizí a propadá se do hloubky", why: "Kdyby se dno uprostřed propadalo, bylo by tam nejstarší. Mladá hornina uprostřed znamená, že tam právě vzniká." },
      { value: "Dno je všude stejně staré, stáří jen kolísá", why: "Stáří se nemění nahodile, ale pravidelně od středu k okrajům. To nahodilé kolísání vylučuje." },
      { value: "Dno se u pevnin zvedá a tvoří nová pohoří", why: "U pevnin se dno naopak podsouvá pod sousední desku a mizí. Rozdíl stáří o pohořích nic neříká." },
    ],
    hints: [
      "Nejmladší hornina je tam, kde vznikla naposledy. Rozmysli si, kam se potom musela ta starší podít.",
      "Představ si pás, na který uprostřed pořád přidáváš nové kousky: každý dřívější kousek je tlačí dál od středu. Podle stáří se tedy dá poznat směr, kterým se celé dno posouvá — a kde se doplňuje.",
    ],
    explanation: "Nejmladší hornina uprostřed znamená, že tam dno stále vzniká: desky se od sebe vzdalují a mezeru vyplňuje magma. Starší kůra je postupně odsouvána k okrajům, proto stáří roste směrem k pevninám.",
  },
  {
    q: "V Rudém moři se oba břehy od sebe každý rok o kousek vzdálí. Co se s ním nejspíš stane za miliony let?",
    correct: "Rozšíří se a stane se z něj nový oceán",
    distractors: [
      { value: "Zúží se, až se oba břehy nakonec spojí", why: "Ke spojení břehů by desky musely mířit proti sobě. Tady se od sebe vzdalují, takže se moře otvírá." },
      { value: "Zůstane přesně tak široké, jak je dnes", why: "Pohyb desek se nezastaví. Za miliony let se i pomalý posun sečte do velké změny." },
      { value: "Vyschne, protože se jeho dno vyzdvihne nahoru", why: "Při rozestupování se dno naopak prohlubuje a zaplňuje novou kůrou, nezvedá se." },
    ],
    hints: [
      "Zadání říká, kterým směrem se břehy pohybují. Pokračuj v téhle změně v myšlenkách dál do budoucnosti.",
      "Pomalé posuny se za miliony let sčítají: co je dnes úzké moře mezi dvěma deskami, které se rozestupují, může být jednou široká vodní plocha. Prostor, který mezi deskami vzniká, se přitom vyplňuje novou kůrou zespodu.",
    ],
    explanation: "Rudé moře leží na rozhraní dvou desek, které se od sebe vzdalují. Prostor mezi nimi se otvírá a vyplňuje novou kůrou, takže se moře stále rozšiřuje. Za miliony let z něj může být plnohodnotný oceán.",
  },
  {
    q: "Mezi dvěma deskami, které se k sobě přibližují, leží moře. Co se s ním bude dít?",
    correct: "Bude se zužovat, až se oba břehy srazí",
    distractors: [
      { value: "Bude se rozšiřovat a vznikne v něm hřbet", why: "Hřbet a rozšiřování patří k deskám, které se rozestupují. Tady se desky naopak přibližují." },
      { value: "Zůstane stejně široké, jen se prohloubí", why: "Když se desky přibližují, prostor mezi nimi ubývá. Šířka se proto měnit musí." },
      { value: "Rozdělí se na dvě moře podél nového zlomu", why: "Zlom desky rozdělí jen tam, kde se smýkají podél sebe. Přibližování moře nerozděluje, ale zmenšuje." },
    ],
    hints: [
      "Sleduj jen prostor mezi deskami. Zvětšuje se, nebo se zmenšuje, když se desky k sobě přibližují?",
      "Desky se pohybují stále stejným směrem, takže se vzdálenost mezi nimi bude dál zmenšovat. Co leží mezi nimi, na to místo časem nezbude — a až se okraje setkají, vrstvy hornin se zmačkají a zdvihnou.",
    ],
    explanation: "Přibližující se desky zmenšují prostor mezi sebou, takže se moře postupně zužuje. Až se okraje setkají, vrstvy hornin se zvrásní a zdvihnou v pohoří. Přesně takhle vznikly z dávného moře Alpy.",
  },
  {
    q: "Ve vzorku z mořského dna u podmořského hřbetu našli vědci zcela čerstvou horninu. Čím to vysvětlit?",
    correct: "Tuhne tam magma vyplňující mezeru mezi deskami",
    distractors: [
      { value: "Připlula tam z pevniny s mořskými proudy", why: "Proudy unesou jen jemný kal, ne pevnou horninu. Navíc by nebyla čerstvá." },
      { value: "Zvedla se tam ze zemského jádra skrz plášť", why: "Hornina nepřichází až z jádra. Taví se mnohem blíž povrchu a mezerou vystoupí ven." },
      { value: "Vznikla usazením písku, který přinesly řeky", why: "Usazeniny z řek se hromadí u pobřeží, ne uprostřed oceánu, a nejsou to čerstvě ztuhlé horniny." },
    ],
    hints: [
      "Čerstvá hornina znamená, že tam vznikla nedávno. Zamysli se, co se děje přímo v ose podmořského hřbetu.",
      "V ose hřbetu se dvě desky od sebe vzdalují, takže tam pořád vzniká prázdné místo. Něco ho musí zaplnit a musí to přijít zespodu, protože shora by se tam nic nedostalo. Co jediné se do takové škvíry může z hloubky protlačit a na studeném dně rychle ztuhnout?",
    ],
    explanation: "V ose hřbetu se desky rozestupují a mezeru vyplňuje magma z hloubky. Na dně rychle ztuhne, a proto je hornina přímo u hřbetu ta nejmladší na celém dně oceánu.",
  },
  {
    q: "Proč se dá čekat, že je Atlantský oceán dnes širší než před milionem let?",
    correct: "Uprostřed se desky rozestupují a kůra přibývá",
    distractors: [
      { value: "Voda z tajících ledovců ho roztlačila do stran", why: "Voda může zvednout hladinu, ale dno neroztlačí. Šířku oceánu určuje pohyb desek pod ním." },
      { value: "Uprostřed se dvě desky srazily a vytlačily moře", why: "Srážkou by se oceán naopak zužoval. Uprostřed Atlantiku se desky rozestupují." },
      { value: "Vlny postupně odnesly břehy na obou stranách", why: "Vlny obrušují pobřeží jen o kousek. Oceán se rozšiřuje kvůli tomu, co se děje na jeho dně." },
    ],
    hints: [
      "Atlantským oceánem prochází po celé délce podmořské pohoří. Vzpomeň si, co se v jeho ose s deskami děje.",
      "Tam, kde se desky od sebe vzdalují, se mezera vyplňuje novou horninou a dno se rozrůstá na obě strany. Tenhle přírůstek je za rok nepatrný, ale za milion let už znamená kilometry navíc.",
    ],
    explanation: "Uprostřed Atlantiku leží hřbet, na kterém se desky vzdalují a vzniká nová oceánská kůra. Dno se proto rozšiřuje na obě strany a oceán je každý rok o kousek širší. Amerika a Evropa se tak od sebe pomalu vzdalují.",
  },
];

/**
 * Rotace šablon se nastavuje při každém volání — mezi voláními žádný stav.
 *
 * Šablony (vrstvy, pohyb ↔ jev) se NEstřídají s bankou půl na půl. Sezení
 * bere prvních `sessionTaskCount` úloh z pořadí, takže při střídání 1 : 1
 * byla polovina sezení tatáž šablona jen s jiným slovem — po první úloze se
 * zbytek jen odklikal. Šablona proto vstupuje jen jako každá čtvrtá (L1),
 * resp. každá třetí (L2) úloha; do celého seznamu se stejně dostanou všechny
 * varianty, jen nejdou v sezení za sebou.
 */
function gen(level: number): PracticeTask[] {
  if (level <= 1) {
    let b = 0;
    let v = 0;
    let t = 0;
    const zBanky = () => vytvor(POOL_L1[b++ % POOL_L1.length]);
    const tvurci: (() => PracticeTask | null)[] = [
      zBanky,
      zBanky,
      zBanky,
      () => genVrstva(v++ % VRSTVA_VARIANTY.length),
    ];
    const genL1 = () => tvurci[t++ % tvurci.length]();
    return ruzneUlohy(() => losUlohy(genL1), POOL_L1.length + VRSTVA_VARIANTY.length, 300);
  }
  if (level === 2) {
    let b = 0;
    let p = 0;
    let t = 0;
    const zBanky = () => vytvor(POOL_L2[b++ % POOL_L2.length]);
    const tvurci: (() => PracticeTask | null)[] = [
      zBanky,
      zBanky,
      () => genPohybJev(p++ % POHYB_VARIANTY.length),
    ];
    const genL2 = () => tvurci[t++ % tvurci.length]();
    return ruzneUlohy(() => losUlohy(genL2), POOL_L2.length + POHYB_VARIANTY.length, 300);
  }
  let b = 0;
  const genL3 = () => vytvor(POOL_L3[b++ % POOL_L3.length]);
  return ruzneUlohy(() => losUlohy(genL3), POOL_L3.length, 300);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const LITOSFERA_STAVBA_ZEME_DESKY: TopicMetadata[] = [
  {
    id: "g6-zem-litosfera-stavba-zeme-desky-6",
    rvpNodeId:
      "g6-zemepis-prirodni-obraz-zeme-krajinne-sfery-litosfera-stavba-zeme-pohyby-litosferickych-desek-sopky-zeme",
    displayName: "Litosféra a pohyb desek",
    title: "Litosféra - stavba Země, pohyby litosférických desek, sopky, zemětřesení",
    studentTitle: "Proč sopky soptí a země se třese",
    subject: "zemepis",
    category: "Přírodní obraz Země",
    topic: "Krajinné sféry",
    briefDescription: "Stavba Země, pohyb desek a vznik sopek, zemětřesení i pohoří.",
    keywords: [
      "litosféra", "zemská kůra", "zemský plášť", "jádro Země", "litosférické desky",
      "sopka", "magma", "láva", "kráter", "zemětřesení", "ohnisko", "epicentrum",
      "Richterova stupnice", "tsunami", "oceánský hřbet", "hlubokooceánský příkop",
      "vrásné pohoří", "Ohnivý kruh",
    ],
    goals: [
      "Pojmenovat vrstvy Země a seřadit je podle hloubky.",
      "Rozlišit dvojice magma a láva, ohnisko a epicentrum podle toho, kde leží.",
      "Přiřadit jev na povrchu (hřbet, příkop, pohoří, otřesy) k pohybu litosférických desek.",
      "Vysvětlit z polohy místa, co tam hrozí a proč.",
    ],
    boundaries: [
      "Bez map a obrázků — poloha se popisuje slovy.",
      "Čísla jen řádově (kůra jednotky až desítky kilometrů — pod oceány 5 až 10 km, pod pevninami 30 až 40 km — proti poloměru Země asi 6 400 km).",
      "Richterova stupnice jen ve smyslu „vyšší číslo = silnější otřes“.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Vrstvy Země jdou od povrchu dolů: kůra, plášť, vnější jádro, vnitřní jádro. Magma je v hloubce, láva na povrchu; ohnisko v hloubce, epicentrum nad ním. Sopky a zemětřesení leží na okrajích desek.",
      steps: [
        "Urči, jestli se děj odehrává v hloubce, nebo na povrchu — podle toho vyber pojem z dvojice.",
        "U jevů se ptej, jak se tam desky pohybují: vzdalují se, podsouvají, srážejí, nebo míjejí.",
        "Podle pohybu přiřaď důsledek: hřbet a nová kůra, příkop se sopkami, vrásné pohoří, otřesy bez sopek.",
      ],
      commonMistake: "Zaměnit magma a lávu (nebo ohnisko a epicentrum) a čekat sopku i tam, kde se desky jen posouvají podél sebe.",
      example: "Himálaj roste srážkou dvou pevninských desek. Na zlomu, kde se desky jen míjejí, jsou otřesy, ale sopky ne.",
    },
  },
];
