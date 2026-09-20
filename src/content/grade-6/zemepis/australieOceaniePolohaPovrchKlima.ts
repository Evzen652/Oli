/**
 * Zeměpis 6. ročník — Austrálie a Oceánie: poloha, povrch, klima (select_one).
 *
 * Celé téma emituje jen úlohy s možnostmi (žádné míchání typů). K obsahu nejsou
 * mapy ani obrázky, poloha se proto zadává slovy a souřadnicemi.
 *
 * Gradace:
 *  • L1 — banka faktů: kde světadíl leží, světadíl × stát, Oceánie = ostrovy
 *    v Tichém oceánu, povrch vnitrozemí, Velké předělové pohoří, teplý sever,
 *    Vánoce v létě.
 *  • L2 — příčina → následek: proč je vnitrozemí suché, proč lidé bydlí u pobřeží,
 *    obrácené roční doby; souřadnice → polokoule; zeměpisná šířka → podnebí.
 *  • L3 — přenos: poznej oblast ze souřadnic (a podle podnebí), rozhodni, kde bude
 *    nejřidčeji osídleno (jen ze souřadnic), porovnej dvě místa, najdi chybné
 *    tvrzení a příčinu chyby, porovnej teplotu v Česku a v Austrálii podle měsíce
 *    a polokoule. Znění L1 a L3 jsou disjunktní.
 *
 * Souřadnice L3 se nelosují z obdélníků (padaly by do moře), ale z bank ověřených
 * bodů na souši — viz BODY. Rozsahy v REG jen slovně popisují oblast („zhruba mezi").
 *
 * Chybový model: sever = nejchladnější (přenos ze severní polokoule), Vánoce
 * v zimě, vnitrozemí = chladné, Austrálie jen stát v Asii / Oceánie
 * v Atlantiku, s. š. ↔ j. š., vzdálenost od Slunce místo sklonu osy.
 *
 * Nápovědy: hints[1] musí být aspoň o pětinu delší než hints[0], jinak by
 * _shared.buildChoiceTask připojil obecnou větu, která se k úloze nehodí.
 *
 * Fakta jsou stálá a zaokrouhlená (žádná přesná výška hor ani rozloha).
 * Rotace šablon se nastavuje uvnitř gen(), modul nedrží žádný stav.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { klicUlohy } from "@/lib/taskIdentity";
import {
  pick,
  rnd,
  shuffle,
  sirka,
  delka,
  losUlohy,
  ruzneUlohy,
  buildChoiceTask as choice,
  type Distractor,
} from "./_shared";

type Tvurce = () => PracticeTask | null;

/** Úloha nesmí obsahovat klíč ve znění otázky — jinak ji vylosujeme znovu. */
function hlidej(t: PracticeTask | null): PracticeTask | null {
  if (!t) return null;
  return t.question.includes(t.correctAnswer) ? null : t;
}

interface Fakt {
  q: string;
  key: string;
  d: [string, string][];
  hints: [string, string];
  explanation: string;
}

const fakt = (f: Fakt): PracticeTask | null =>
  hlidej(
    choice(
      f.q,
      f.key,
      f.d.map(([value, why]): Distractor => ({ value, why })),
      { hints: f.hints, explanation: f.explanation },
    ),
  );

// ── L1: banka faktů ────────────────────────────────────────────────────────

const BANKA_L1: Fakt[] = [
  {
    q: "Kde leží Austrálie?",
    key: "na jižní polokouli, mezi Indickým a Tichým oceánem",
    d: [
      ["na severní polokouli, mezi Atlantským a Tichým oceánem", "Atlantský oceán leží mezi Amerikou a Evropou s Afrikou, Austrálii neomývá. A jižní šířka znamená jižní polokouli, ne severní."],
      ["na jižní polokouli, mezi Atlantským a Indickým oceánem", "Polokouli máš správně, ale mezi Atlantským a Indickým oceánem leží Afrika. Austrálii obklopují Indický a Tichý oceán."],
      ["na severní polokouli, mezi Indickým a Severním ledovým oceánem", "Severní ledový oceán je u severního pólu, daleko od Austrálie, která leží na jihu."],
    ],
    hints: [
      "Ptej se nejdřív, na které polokouli světadíl leží, a pak, které dva oceány ho obklopují.",
      "Souřadnice míst v Austrálii mají za číslem písmena j. š. Oceány kolem ní jsou ty, které leží na západ a na východ od jejích břehů.",
    ],
    explanation: "Austrálie leží na jižní polokouli. Na západě ji omývá Indický oceán a na východě Tichý oceán, proto je z každé strany obklopená vodou.",
  },
  {
    q: "Co je Austrálie?",
    key: "světadíl a zároveň stát",
    d: [
      ["stát v Asii, světadíl to není", "Austrálie neleží v Asii, je to samostatný světadíl. Od Asie ji dělí moře."],
      ["velký ostrov, který patří Indonésii", "Indonésie je stát v Asii, Austrálie k ní nepatří. Je to samostatný stát na vlastním světadílu."],
      ["souostroví v Tichém oceánu bez pevniny", "Souostroví tvoří jiná část světa (Oceánie). Austrálie je jedna velká souvislá pevnina."],
    ],
    hints: [
      "Rozlišuj pojmy světadíl a stát: jeden je část zemského povrchu, druhý území s vlastní vládou.",
      "Většinu světadílů tvoří víc států, ale u tohoto je to výjimečné. Zjisti, kolik států zabírá celou jeho pevninu, a podle toho vysvětli, proč se jmenuje stejně.",
    ],
    explanation: "Austrálie je nejmenší světadíl a jediný, jehož pevninu zabírá jeden stát. Proto se slovo Austrálie používá pro světadíl i pro stát.",
  },
  {
    q: "Který světadíl je z celého světa nejmenší?",
    key: "Austrálie",
    d: [
      ["Evropa", "Evropa je malá, ale má přes 10 milionů km², kdežto nejmenší světadíl kolem 8 milionů km². Menší je tedy ten druhý."],
      ["Antarktida", "Antarktida má pod ledem kolem 14 milionů km², je větší než Evropa i než nejmenší světadíl."],
      ["Jižní Amerika", "Jižní Amerika má kolem 18 milionů km², je víc než dvakrát větší než nejmenší světadíl."],
    ],
    hints: [
      "Seřaď si světadíly od největšího po nejmenší a hledej ten poslední.",
      "Porovnej rozlohu: který světadíl na globusu zabírá nejméně místa? Evropa má přes 10 milionů km², hledaný světadíl o něco méně.",
    ],
    explanation: "Nejmenším světadílem je Austrálie. Je ve srovnání s ostatními malá, přesto je to velká pevnina a jediný světadíl, který je zároveň státem.",
  },
  {
    q: "Co tvoří Oceánii?",
    key: "tisíce ostrovů v Tichém oceánu",
    d: [
      ["souostroví v Atlantském oceánu u Ameriky", "Atlantský oceán leží na druhé straně Země. Oceánie je rozptýlená po Tichém oceánu."],
      ["jedna velká pevnina kolem jižního pólu", "Pevnina kolem jižního pólu je Antarktida. Oceánie je naopak roztříštěná na malé ostrovy."],
      ["pohoří na severu Austrálie", "Oceánie není pohoří ani část Austrálie, je to celá skupina ostrovů v moři."],
    ],
    hints: [
      "Slovo Oceánie ti prozradí, že jde o svět kolem oceánu, ne o souvislou pevninu.",
      "Podívej se na globus: mezi Asií a Amerikou je obrovská vodní plocha. Co tam místo souvislé pevniny najdeš?",
    ],
    explanation: "Oceánii tvoří tisíce ostrovů rozptýlených v Tichém oceánu, například Nový Zéland, Papua-Nová Guinea nebo Fidži. Souvislá pevnina je jen Austrálie.",
  },
  {
    q: "Který z uvedených států leží v Oceánii?",
    key: "Papua-Nová Guinea",
    d: [
      ["Madagaskar", "Madagaskar je velký ostrov u východního pobřeží Afriky v Indickém oceánu, patří k Africe."],
      ["Island", "Island je ostrov v severním Atlantiku, patří k Evropě."],
      ["Kuba", "Kuba je ostrov v Karibském moři u Ameriky, Oceánie leží v Tichém oceánu."],
    ],
    hints: [
      "Všechny čtyři státy leží na ostrovech nebo jsou z ostrovů tvořeny, rozhoduje proto oceán a poloha vůči světadílům.",
      "Hledej ostrovy v Tichém oceánu daleko od Ameriky, Afriky i Evropy — ostrovy blízko těchto světadílů k nim také patří, proto se u každého ptej, u kterého světadílu leží.",
    ],
    explanation: "Papua-Nová Guinea leží v Tichém oceánu severně od Austrálie, patří tedy do Oceánie. Madagaskar patří k Africe, Island k Evropě a Kuba k Americe.",
  },
  {
    q: "Kde leží ostrovní stát Nový Zéland?",
    key: "v Tichém oceánu jihovýchodně od Austrálie",
    d: [
      ["v Atlantském oceánu jihozápadně od Afriky", "Atlantský oceán leží na druhé straně Země. Nový Zéland je od Austrálie dělený jen Tasmanovým mořem."],
      ["v Indickém oceánu západně od Austrálie", "Západně od Austrálie je Indický oceán, ale Nový Zéland leží na opačné, východní straně."],
      ["v Severním ledovém oceánu u severního pólu", "Nový Zéland leží na jižní polokouli, daleko od severního pólu."],
    ],
    hints: [
      "Uvažuj, na které straně od Austrálie leží ostrovní stát, který od ní odděluje jen Tasmanovo moře.",
      "Nový Zéland je ostrovní stát na jižní polokouli, na opačné straně Austrálie než Indický oceán. Rozhodni, který oceán tam leží.",
    ],
    explanation: "Nový Zéland tvoří dva velké ostrovy v jihozápadní části Tichého oceánu, jihovýchodně od Austrálie. Patří do Oceánie.",
  },
  {
    q: "Jak vypadá povrch ve vnitrozemí Austrálie?",
    key: "rovinatá a suchá krajina s pouštěmi",
    d: [
      ["vysoká zasněžená pohoří", "Vysoká zasněžená pohoří tam nejsou. Nejvyšší a nejdelší pohoří leží na východě a vnitrozemí je nízké."],
      ["souvislé vlhké deštné pralesy", "Souvislé deštné pralesy rostou hlavně u severovýchodního pobřeží. Vnitrozemí je suché."],
      ["hluboké fjordy a ledovcová údolí", "Fjordy a ledovcová údolí vznikají u chladných moří s ledovci. Vnitrozemí Austrálie je horké a suché."],
    ],
    hints: [
      "Zamysli se nad slovem vnitrozemí — je od oceánu daleko, což ovlivňuje srážky.",
      "Nejvyšší hory Austrálie leží u východního pobřeží a ve středu světadílu jich moc není. Jaká krajina tedy převládá uvnitř?",
    ],
    explanation: "Vnitrozemí Austrálie tvoří převážně nížiny a náhorní plošiny, kde je málo srážek a leží tam velké pouště. Nejvyšší a nejdelší pohoří je na východě.",
  },
  {
    q: "Jak se jmenuje pohoří na východě Austrálie?",
    key: "Velké předělové pohoří",
    d: [
      ["Skalnaté hory", "Skalnaté hory leží v Severní Americe."],
      ["Himálaj", "Himálaj je nejvyšší pohoří světa v Asii."],
      ["Andy", "Andy se táhnou podél západního pobřeží Jižní Ameriky."],
    ],
    hints: [
      "Pohoří má název, který prozrazuje, že něco rozděluje.",
      "Vyřaď pohoří, která leží na jiných světadílech (Amerika, Asie) — zbyde to, které leží v Austrálii.",
    ],
    explanation: "Na východě Austrálie se od severu k jihu táhne Velké předělové pohoří. Není příliš vysoké, ale zadržuje vlhký vítr od Tichého oceánu.",
  },
  {
    q: "Ve které části Austrálie je v průměru nejtepleji?",
    key: "na severu",
    d: [
      ["na jihu", "Na jihu je chladněji, protože je od rovníku dál."],
      ["na jihovýchodě", "Jihovýchod má mírné podnebí. Teplejší je sever."],
      ["na jihozápadě", "Jihozápad má mírné podnebí, léto je teplé, ale roční průměr je nižší než na severu."],
    ],
    hints: [
      "Teplota souvisí se vzdáleností od rovníku — hledej část světadílu, která k němu má nejblíž.",
      "V Česku je teplejší jih. Na jižní polokouli je to naopak, protože tam se od rovníku míří k jižnímu pólu, a ne k severnímu.",
    ],
    explanation: "Nejtepleji je na severu Austrálie, protože leží nejblíž k rovníku. Na jižní polokouli je to obráceně než u nás: čím dál na jih, tím chladněji.",
  },
  {
    q: "Jaké roční období je v Austrálii o Vánocích?",
    key: "léto",
    d: [
      ["zima", "Zima je v Austrálii v době našeho léta, tedy v červnu až srpnu."],
      ["podzim", "Podzim je tam v březnu až květnu."],
      ["jaro", "Jaro je tam v září až listopadu."],
    ],
    hints: [
      "Připomeň si, že roční doby na jižní polokouli jsou oproti severní posunuté.",
      "Když je u nás v prosinci zima, na druhé polokouli je to naopak. Rozhodni podle toho, na které polokouli Austrálie leží.",
    ],
    explanation: "Austrálie leží na jižní polokouli, kde jsou roční doby oproti Česku obrácené. Proto tam o Vánocích panuje horko a lidé se třeba koupou.",
  },
  {
    q: "Který oceán leží na východ od Austrálie?",
    key: "Tichý oceán",
    d: [
      ["Indický oceán", "Indický oceán leží na západě, u západního pobřeží Austrálie."],
      ["Atlantský oceán", "Atlantský oceán je daleko od Austrálie, mezi Amerikou a Evropou s Afrikou."],
      ["Severní ledový oceán", "Severní ledový oceán leží u severního pólu, ne u Austrálie."],
    ],
    hints: [
      "Představ si Austrálii mezi dvěma oceány — jeden je vlevo (západ) a druhý vpravo (východ).",
      "Za východním pobřežím leží oceán, který se táhne až k západním břehům Ameriky. Atlantský oceán s Austrálií nesousedí.",
    ],
    explanation: "Na východ od Austrálie leží Tichý oceán, největší oceán světa. Na západě ji obklopuje Indický oceán.",
  },
  {
    q: "Který oceán leží na západ od Austrálie?",
    key: "Indický oceán",
    d: [
      ["Tichý oceán", "Tichý oceán je na východě, u východního pobřeží."],
      ["Atlantský oceán", "Atlantský oceán je na opačné straně Země, ne u Austrálie."],
      ["Severní ledový oceán", "Severní ledový oceán je u severního pólu."],
    ],
    hints: [
      "Rozhodni, kde je západ, a pak vyber oceán, který k Austrálii přiléhá z té strany.",
      "Oceán na západě sousedí s Afrikou a s jižní Asií, ne s Amerikou. Z dvou oceánů, které Austrálii obklopují, je to ten, který leží blíž k Africe.",
    ],
    explanation: "Na západě omývá Austrálii Indický oceán, který leží mezi Afrikou a Austrálií. Tichý oceán je na východě.",
  },
  {
    q: "Jaké podnebí je na severu Austrálie?",
    key: "horké tropické s obdobím dešťů",
    d: [
      ["mírné s chladnými zimami", "Mírné podnebí má jih Austrálie. Sever je od rovníku blízko a je tam teplo celý rok."],
      ["polární s trvalým sněhem", "Polární podnebí je jen kolem pólů. Sever Austrálie leží v tropickém pásu, blíž k rovníku než zbytek světadílu."],
      ["suché pouštní bez dešťů v celém roce", "Pouště jsou ve vnitrozemí. Sever má období dešťů."],
    ],
    hints: [
      "Když je oblast blízko rovníku, přemýšlej, jak se tam mění teplota během roku.",
      "Blízko rovníku se nestřídají čtyři roční doby podle teploty, ale dvě podle srážek. Vyber podnebí, které to popisuje.",
    ],
    explanation: "Sever Austrálie leží nejblíž k rovníku, a proto je tam horké tropické podnebí. Střídá se tam období dešťů a sucha.",
  },
  {
    q: "Kde v Austrálii bydlí většina lidí?",
    key: "u pobřeží, hlavně na východě a jihovýchodě",
    d: [
      ["uprostřed pouští ve vnitrozemí", "Uvnitř je sucho, tam bydlí jen málo lidí. Většina si vybírá pobřeží."],
      ["na severu v deštných pralesích", "Sever je horký a lidí tam žije málo. Většina bydlí na jihovýchodě."],
      ["vysoko v horách Velkého předělového pohoří", "V horách žije málo lidí. Většina bydlí u moře pod pohořím."],
    ],
    hints: [
      "Lidé se usazují tam, kde je dost vody a příjemné podnebí. Zvaž, kde to v Austrálii je.",
      "Ptej se, kde v Austrálii prší dost: dívej se na okraje světadílu a porovnej je s jeho středem, kde se lidem žije hůř.",
    ],
    explanation: "Většina Australanů bydlí u pobřeží, hlavně na východě a jihovýchodě, kde je dost srážek a mírné podnebí. Ve vnitrozemí je sucho a lidí je tam málo.",
  },
  {
    q: "Kde leží ostrovní stát Fidži?",
    key: "v Tichém oceánu v Oceánii",
    d: [
      ["v Atlantském oceánu u Ameriky", "Atlantský oceán je na druhé straně Země než Oceánie."],
      ["v Indickém oceánu u Afriky", "U Afriky leží třeba Madagaskar, ale Fidži je mnohem dál na východ."],
      ["v Severním ledovém oceánu u pólu", "Fidži je teplý ostrov v tropech, ne u severního pólu."],
    ],
    hints: [
      "Ptej se, který oceán je spojený s pojmem Oceánie.",
      "Fidži leží daleko na východ od Austrálie, mezi ní a Amerikou. Rozhodni, který oceán tam je, a vyřaď oceány u jiných světadílů.",
    ],
    explanation: "Fidži je ostrovní stát v Tichém oceánu. Patří do Oceánie, kterou tvoří tisíce ostrovů v tomto oceánu.",
  },
];

const faktL1 = (): PracticeTask | null => fakt(pick(BANKA_L1));

// ── Regiony Austrálie (souřadnicový model) ─────────────────────────────────

type RegId = "sever" | "vnit" | "jv" | "jz" | "nz";

interface Reg {
  label: string;         // název oblasti jako možnost
  lat: [number, number]; // j. š.
  lon: [number, number]; // v. d.
  clim: string;          // podnebí (jen kontinent)
  popisy: string[];      // jednoznačné popisy podnebí
  nejasne: string[];     // popisy, které sedí na víc oblastí — rozhodnou souřadnice
}

const REG: Record<RegId, Reg> = {
  sever: {
    label: "tropický sever",
    lat: [13, 18],
    lon: [129, 142],
    clim: "horké tropické s obdobím dešťů",
    popisy: ["je celoročně horko a část roku trvá období dešťů", "v létě přicházejí silné deště a teplo je celoročně"],
    nejasne: ["většinu roku je horko"],
  },
  vnit: {
    label: "suché vnitrozemí",
    lat: [20, 29],
    lon: [128, 140],
    clim: "suché s pouštěmi",
    popisy: ["za rok spadne velmi málo srážek a krajina je pouštní", "prší velmi málo a ve dne je velké horko"],
    nejasne: ["léta jsou velmi horká"],
  },
  jv: {
    label: "jihovýchodní pobřeží",
    lat: [33, 38],
    lon: [146, 151],
    clim: "mírné a vlhčí",
    popisy: ["srážky jsou rozložené do celého roku a podnebí je mírné", "prší po celý rok a zimy jsou mírné"],
    nejasne: ["léto je teplé a zima mírná"],
  },
  jz: {
    label: "jihozápadní pobřeží",
    lat: [32, 35],
    lon: [116, 118],
    clim: "mírné se suchým létem",
    popisy: ["léto je teplé a suché a zima vlhká", "v létě téměř neprší, deště přicházejí v zimě"],
    nejasne: ["léto je teplé a zima mírná"],
  },
  nz: {
    label: "ostrovy Nového Zélandu",
    lat: [37, 45],
    lon: [172, 176],
    clim: "",
    popisy: [],
    nejasne: [],
  },
};

const KONT: RegId[] = ["sever", "vnit", "jv", "jz"];

/**
 * Ověřené body na souši (j. š., v. d.), zaokrouhlené na celé stupně. Vždy leží
 * uvnitř rozsahů REG a nepadají do moře (Batchelor, Kununurra, Katherine,
 * Alice Springs, Uluru, Coober Pedy, Sydney, Melbourne, Perth, Albany, Auckland …).
 */
const BODY: Record<RegId, [number, number][]> = {
  sever: [[13, 131], [14, 132], [15, 133], [16, 131], [16, 129], [13, 142], [18, 141]],
  vnit: [[24, 134], [25, 131], [29, 135], [26, 139], [28, 135], [25, 128], [21, 132]],
  jv: [[34, 151], [33, 151], [35, 150], [36, 150], [37, 149], [38, 146]],
  jz: [[32, 116], [33, 116], [34, 116], [34, 117], [35, 117], [35, 118]],
  nz: [[37, 175], [41, 175], [41, 173], [44, 173], [38, 176]],
};

interface Bod {
  lat: number;
  lon: number;
  s: string; // „24° j. š.“
  d: string; // „134° v. d.“
}

const mkBod = (lat: number, lon: number, jih = true): Bod => ({
  lat,
  lon,
  s: sirka(jih ? -lat : lat),
  d: delka(lon),
});

function bod(r: RegId): Bod {
  const [lat, lon] = pick(BODY[r]);
  return mkBod(lat, lon);
}

/** Proč místo NEPATŘÍ do oblasti R — podle první souřadnice, která nesedí. */
function procMimo(r: RegId, b: Bod): string {
  const R = REG[r];
  const [a, z] = R.lat;
  const [la, lz] = R.lon;
  if (b.lat < a || b.lat > z) {
    return `Oblast „${R.label}“ leží zhruba mezi ${a}° a ${z}° j. š., ale toto místo je na ${b.s} – mimo tento rozsah.`;
  }
  return `Oblast „${R.label}“ leží zhruba mezi ${la}° a ${lz}° v. d., ale toto místo je na ${b.d} – mimo tento rozsah.`;
}

// ── L2: příčiny a následky, souřadnice ────────────────────────────────────

const BANKA_L2: Fakt[] = [
  {
    q: "Proč je vnitrozemí Austrálie suché?",
    key: "Vlhký vítr od Tichého oceánu zadrží pohoří na východě a moře je od vnitrozemí daleko",
    d: [
      ["Slunce svítí ve vnitrozemí blíž než u pobřeží, a proto tam veškerá voda rychle vyschne", "Vzdálenost od Slunce je všude v Austrálii prakticky stejná. Sucho dělá vzdálenost od moře a pohoří."],
      ["Ve vnitrozemí je málo řek, a proto tam neprší", "Déšť řeky nedělají — málo řek je naopak následek sucha. Příčinu je třeba hledat u větru a vzdálenosti od moře."],
      ["V Austrálii nejsou žádné hory, které by zachytily déšť pro vnitrozemí", "Hory v Austrálii jsou — Velké předělové pohoří na východě. Právě ono vlhký vítr od oceánu zadrží, takže do vnitrozemí se dostane jen suchý vzduch."],
    ],
    hints: [
      "Ptej se, odkud přichází vítr nesoucí vodu z oceánu a co mu stojí v cestě, než dorazí do středu světadílu.",
      "Východním pobřežím se táhne pohoří a oceán je od středu daleko. Sleduj cestu větru od moře dovnitř a řekni, kolik vlhkosti se do středu dostane.",
    ],
    explanation: "Vlhký vítr od Tichého oceánu zadrží Velké předělové pohoří a ke všem pobřežím je to z vnitrozemí daleko. K suchu přispívá i klesající suchý vzduch nad vnitrozemím. Proto tam prší jen málo a vznikají pouště.",
  },
  {
    q: "Proč bydlí většina Australanů na východním a jihovýchodním pobřeží?",
    key: "Prší tam dost a podnebí je mírné, takže se tam dá žít i hospodařit",
    d: [
      ["Je tam nejblíž k rovníku, a proto tam bývá nejtepleji", "Nejblíž k rovníku leží sever, ne jihovýchod. A teplo samo o sobě k usazení nestačí."],
      ["Vnitrozemí pokrývá hustý deštný prales, který lidé nemohou vykácet ani osídlit", "Vnitrozemí je naopak suché a pusté, prales tam není."],
      ["Jen východ leží u moře, zbytek světadílu je od oceánu daleko", "Austrálie je z každé strany obklopená oceánem. Sucho je způsobeno jiným důvodem."],
    ],
    hints: [
      "Lidé se usazují tam, kde je voda a příjemné podnebí. Porovnej pobřeží s vnitrozemím.",
      "Podívej se na to, jak se liší množství srážek na pobřeží a ve vnitrozemí a co z toho plyne pro pole a města.",
    ],
    explanation: "Na východě a jihovýchodě prší nejvíc a podnebí je mírné, proto tam vznikla velká města i zemědělská půda. Vnitrozemí je suché a lidí je tam málo.",
  },
  {
    q: "V Sydney je v lednu horko a v červenci chladněji. Co z toho plyne o poloze města?",
    key: "Leží na jižní polokouli, kde jsou roční doby oproti Česku obrácené",
    d: [
      ["Leží na severní polokouli, kde je léto v lednu", "Na severní polokouli je v lednu zima, stejně jako u nás."],
      ["Leží přímo na rovníku, kde je horko a roční doby se střídají obráceně než u nás", "Na rovníku se roční doby téměř nestřídají. Tady jde o jižní polokouli."],
      ["Leží blízko jižního pólu, kde je v lednu polární zima", "U pólu je zima celý rok. Horko v lednu ukazuje jen na jižní polokouli."],
    ],
    hints: [
      "Porovnej, co v lednu očekáváš doma, s tím, co se děje v Sydney.",
      "Když je v lednu horko, ale u nás mráz, musí být roční doby opačné. Rozhodni, na které polokouli to tak je.",
    ],
    explanation: "Sydney leží na jižní polokouli. Tam je v lednu léto a v červenci zima, tedy opačně než v Česku, kde je v lednu zima a v červenci léto.",
  },
  {
    q: "Vnitrozemí Austrálie je suché a vody je málo. Co z toho plyne pro osídlení?",
    key: "Osídlení je tam řídké, lidé žijí jen v malých městech a na farmách",
    d: [
      ["Osídlení je tam nejhustší, protože tam je nejvíc volné půdy pro města i pole", "Volná půda bez vody neuživí lidi. Nejhustěji se bydlí u pobřeží."],
      ["Osídlení je stejně husté jako na pobřeží, protože se voda dováží", "Voda se do vnitrozemí tak snadno nedováží. Lidé se usazují u moře."],
      ["Nikdo tam nežije, protože tam žít vůbec nelze", "Pár lidí tam žije — na farmách a v malých městech, i když jich je jen málo."],
    ],
    hints: [
      "Ptej se, co lidé potřebují k životu a jestli to vnitrozemí nabízí.",
      "Přemýšlej, kolik lidí uživí krajina bez vody: žádné, nebo jen hodně málo? Podle toho vyber, jak hustě je vnitrozemí osídlené.",
    ],
    explanation: "Kde je málo vody, nemůže žít mnoho lidí. Vnitrozemí je proto osídlené řídce, jen několika městy a farmami, zatímco většina lidí bydlí u pobřeží.",
  },
  {
    q: "Proč jsou v Austrálii roční doby obrácené oproti Česku?",
    key: "Zemská osa je nakloněná, a proto je jižní polokoule ke Slunci nakloněná v jiné době než severní",
    d: [
      ["V prosinci je Austrálie ke Slunci blíž než Česko, a proto je tam léto, když je u nás zima", "Vzdálenost od Slunce roční doby nedělá. Rozhoduje sklon zemské osy."],
      ["Země se na jižní polokouli otáčí opačným směrem než na severní polokouli", "Země se otáčí jedním směrem po celém povrchu. Roční doby dělá sklon osy."],
      ["Austrálie leží na druhé straně Slunce než Evropa, a proto jsou tam roční doby vždy opačné než u nás", "Slunce je jen jedno a od obou polokoulí je stejně daleko. Roční doby dělá sklon zemské osy."],
    ],
    hints: [
      "Roční doby nezávisí na vzdálenosti od Slunce, ale na něčem jiném u samotné Země.",
      "Osa, kolem které se Země otáčí, je šikmá. Přemýšlej, která polokoule se v dané době ke Slunci přikloní a která odkloní.",
    ],
    explanation: "Zemská osa je nakloněná, takže se v jednu dobu ke Slunci přikloní jižní polokoule a v druhou severní. Proto je v Austrálii léto, když je u nás zima.",
  },
  {
    q: "Oceánii tvoří tisíce ostrovů v Tichém oceánu. Co z toho plyne pro dopravu mezi nimi?",
    key: "Mezi ostrovy se cestuje hlavně lodí nebo letadlem, po souši to nejde",
    d: [
      ["Ostrovy jsou spojené dlouhými mosty, takže se mezi nimi jezdí autem", "Ostrovy jsou od sebe odděleny širým mořem, od kilometrů po tisíce kilometrů. Mosty mezi státy Oceánie nevedou."],
      ["Mezi ostrovy se cestuje hlavně vlakem po sousedních ostrovech", "Vlaky jezdí po souši, ale mezi ostrovy je moře. Vlak tam nepojede."],
      ["Ostrovy leží těsně vedle sebe, takže se mezi nimi chodí po souši", "Mezi ostrovy je moře, po kterém se pěšky nechodí. Cesta jde jen po vodě nebo vzduchem."],
    ],
    hints: [
      "Ostrov je souš obklopená vodou — zvaž, jak se přes vodu dá dostat na další.",
      "Ostrovy jsou rozházené po celém oceánu a mezi nimi není souvislá pevnina. Uvaž, která doprava vyžaduje souš a která ne.",
    ],
    explanation: "Ostrovy Oceánie jsou od sebe odděleny oceánem. Proto se mezi nimi cestuje lodí nebo letadlem, po souši to nejde.",
  },
];

const faktL2 = (): PracticeTask | null => fakt(pick(BANKA_L2));

const PODNEBI = {
  tropy: "horké tropické s obdobím dešťů",
  mirne: "mírné s teplým létem a chladnější zimou",
  polarni: "polární s trvalým sněhem a ledem",
  poust: "suché pouštní s minimem srážek",
};

/** Zeměpisná šířka → podnebí na pobřeží (sever = 11–17°, jih = 34–38°). */
function podnebiZeSirky(): PracticeTask | null {
  const tropy = Math.random() < 0.5;
  const lat = tropy ? rnd(11, 17) : rnd(34, 38);
  const s = sirka(-lat);
  const key = tropy ? PODNEBI.tropy : PODNEBI.mirne;
  const dist: Distractor[] = [
    {
      value: tropy ? PODNEBI.mirne : PODNEBI.tropy,
      why: tropy
        ? `Mírné podnebí má jih Austrálie. Místo na ${s} je blízko rovníku, kde je teplo celý rok.`
        : `Tropické podnebí je jen blízko rovníku. Místo na ${s} je od rovníku dál na jih, takže tam je mírněji.`,
    },
    {
      value: PODNEBI.polarni,
      why: `Polární podnebí je jen kolem pólů, od polárního kruhu (66,5°) dál. Místo na ${s} je od pólu ještě hodně daleko.`,
    },
    {
      value: PODNEBI.poust,
      why: `Pouště leží hluboko ve vnitrozemí, kolem 20° až 29° j. š. Na pobřeží na ${s} je srážek dost.`,
    },
  ];
  return hlidej(
    choice(
      `Které podnebí čekáš na pobřeží Austrálie v místě s polohou ${s}?`,
      key,
      dist,
      {
        hints: [
          "Porovnej šířku s polohou rovníku (0°): čím blíž k rovníku, tím tepleji.",
          "Šířka rozhoduje o podnebném pásu. Nejdřív urči, jestli je místo blíž k rovníku, nebo k jižnímu pólu, a podle toho odhadni teplotu.",
        ],
        explanation: tropy
          ? `Místo na ${s} je blízko rovníku, proto je tam na pobřeží horké tropické podnebí s obdobím dešťů. Polární podnebí by musela mít šířka přes 66,5°, pouště jsou hluboko ve vnitrozemí.`
          : `Místo na ${s} je od rovníku dál na jih, proto je tam na pobřeží mírné podnebí s teplým létem a chladnější zimou. Do tropů se šířka nedostává a polární kruh je až na 66,5°.`,
        solutionSteps: [
          `Šířka místa (${s}) ukazuje, jak daleko je od rovníku.`,
          tropy
            ? "Číslo je malé, místo leží blízko rovníku (0°)."
            : "Číslo je střední, místo leží dál od rovníku, ale daleko od polárního kruhu (66,5°).",
          tropy
            ? "Blízko rovníku je celoročně horko a střídá se období dešťů."
            : "Uprostřed mezi rovníkem a pólem je mírné podnebí.",
        ],
      },
    ),
  );
}

/** Který bod leží na jižní polokouli a ve východní délce (jako Austrálie)? */
function souradniceJihVychod(): PracticeTask | null {
  const j = rnd(12, 38);
  const vd = rnd(115, 155);
  const key = `${sirka(-j)}, ${delka(vd)}`;
  const ne = { s: sirka(rnd(12, 60)), d: delka(rnd(10, 150)) };
  const sw = { s: sirka(-rnd(12, 50)), d: delka(-rnd(30, 120)) };
  const nw = { s: sirka(rnd(12, 60)), d: delka(-rnd(30, 120)) };
  const q = pick([
    "Který z uvedených bodů leží na jižní polokouli a ve východní délce, tedy ve stejné části světa jako Austrálie?",
    "Který bod leží na jižní polokouli a zároveň ve východní délce, jako Austrálie?",
  ]);
  return hlidej(
    choice(
      q,
      key,
      [
        {
          value: `${ne.s}, ${ne.d}`,
          why: "Délka je východní, ale písmena s. š. znamenají severní polokouli. Austrálie leží na jihu.",
        },
        {
          value: `${sw.s}, ${sw.d}`,
          why: "Šířka je jižní, ale písmena z. d. znamenají západní délku. Austrálie leží na východ od nultého poledníku.",
        },
        {
          value: `${nw.s}, ${nw.d}`,
          why: "Oba údaje jsou opačně: s. š. je severní polokoule a z. d. západní délka.",
        },
      ],
      {
        hints: [
          "Písmena za šířkou ukazují polokouli (j. š. a s. š.), písmena za délkou východ a západ (v. d. a z. d.).",
          "Projdi možnosti podle dvou písmen: šířka musí být jižní a délka východní. Vyřaď ty, které mají aspoň jedno písmeno špatně, a zbude jediný bod.",
        ],
        explanation: "Austrálie leží na jižní polokouli (j. š.) a východně od nultého poledníku (v. d.). Správný bod proto musí mít obě písmena j. š. a v. d.; u ostatních bodů aspoň jedno písmeno sedí opačně.",
        solutionSteps: [
          "Jižní polokoule = j. š., východní délka = v. d.",
          "U každé možnosti zkontroluj písmena za šířkou.",
          "U zbylých zkontroluj i písmena za délkou. Vyhovuje jediný bod.",
        ],
      },
    ),
  );
}

const l2Tvurci: Tvurce[] = [faktL2, faktL2, faktL2, podnebiZeSirky, souradniceJihVychod];

// ── L3: přenos ─────────────────────────────────────────────────────────────

/** A) Poznej oblast ze souřadnic (a podle podnebí — někdy jen ze souřadnic). */
function poznejOblast(): PracticeTask | null {
  const r = pick(KONT);
  const R = REG[r];
  const b = bod(r);
  const bezPopisu = Math.random() < 0.25;
  const popis = bezPopisu ? "" : pick([...R.popisy, ...R.nejasne]);
  const q = bezPopisu
    ? pick([
        `Které oblasti Austrálie odpovídá místo ${b.s}, ${b.d}?`,
        `Které oblasti Austrálie odpovídá stanice na ${b.s}, ${b.d}?`,
      ])
    : pick([
        `Které oblasti Austrálie odpovídá místo ${b.s}, ${b.d}, kde ${popis}?`,
        `Meteorolog hlásí ze stanice na ${b.s}, ${b.d}, že ${popis}. Které oblasti Austrálie to odpovídá?`,
      ]);
  const dist: Distractor[] = KONT.filter((x) => x !== r).map((x) => ({
    value: REG[x].label,
    why: procMimo(x, b),
  }));
  const nejasne = R.nejasne.includes(popis);
  const hints: [string, string] = bezPopisu
    ? [
        "Šířka řekne, jak daleko od rovníku místo leží (sever je nejblíž, jih nejdál), délka jestli jde o západ, střed, nebo východ světadílu.",
        "Austrálie se rozprostírá zhruba mezi 113° a 154° v. d. Z šířky nejdřív vyřaď oblasti, které leží jinde na ose sever–jih, a z délky pak rozhodni mezi západem a východem.",
      ]
    : [
        nejasne
          ? "Popis podnebí sedí na víc oblastí, rozhodnou souřadnice: podle šířky zjistíš vzdálenost od rovníku, podle délky východ a západ světadílu."
          : "Popis podnebí zúží výběr, souřadnice ho potvrdí: šířka řekne, jak daleko od rovníku místo leží.",
        "Rozděl si kroky: nejdřív podle šířky urči vzdálenost od rovníku, potom podle délky, jestli jde o západ, střed, nebo východ. Až nakonec porovnej s podnebím a vyřaď oblasti, které nesedí.",
      ];
  return hlidej(
    choice(q, R.label, dist, {
      hints,
      explanation: `Místo ${b.s}, ${b.d} leží zhruba mezi ${R.lat[0]}° a ${R.lat[1]}° j. š. a ${R.lon[0]}° a ${R.lon[1]}° v. d., tedy v oblasti „${R.label}“. Podnebí této oblasti je ${R.clim}${bezPopisu ? "" : ", což sedí na popis"}. U ostatních oblastí nesouhlasí souřadnice.`,
    }),
  );
}

/** B) Které z uvedených míst bude nejřidčeji osídlené? (jen souřadnice, bez popisků) */
function nejridceji(): PracticeTask | null {
  const zaz = (r: RegId) => {
    const b = bod(r);
    return `${b.s}, ${b.d}`;
  };
  const key = zaz("vnit");
  const dist: Distractor[] = [
    {
      value: zaz("jv"),
      why: "Toto místo leží na jihovýchodě Austrálie, v nejhustěji osídlené části světadílu: je blízko moře, prší tam po celý rok a stojí tam velká města.",
    },
    {
      value: zaz("jz"),
      why: "Toto místo leží na jihozápadě Austrálie, kde je vlhká zima a blízko moře. Lidé bydlí hlavně ve městech na pobřeží, osídlení je proto hustší než ve vnitrozemí.",
    },
    {
      value: zaz("nz"),
      why: "Toto místo leží na Novém Zélandu, ostrovním státě s vlhkým mírným podnebím. Lidé tam bydlí ve městech, osídlení je hustší než ve vnitrozemí Austrálie.",
    },
  ];
  return hlidej(
    choice(
      "Které z uvedených míst bude s největší pravděpodobností nejřidčeji osídlené?",
      key,
      dist,
      {
        hints: [
          "Lidé se usazují tam, kde je voda a příjemné podnebí. Zjisti, které místo je od moře nejdál.",
          "Austrálie se rozprostírá zhruba mezi 113° a 154° v. d. a mezi 11° a 39° j. š. Střed světadílu leží uprostřed těchto rozsahů; čím dál je místo od středu, tím blíž je k moři a tím víc lidí tam bývá.",
        ],
        explanation: `Místo ${key} leží uprostřed Austrálie, daleko od moře, v suchém vnitrozemí s minimem srážek, proto tam bydlí nejméně lidí. U ostatních míst je moře blízko a srážek je dost, proto tam lidí bydlí víc.`,
      },
    ),
  );
}

/** C) Porovnej dvě místa. */
function porovnejDve(): PracticeTask | null {
  const [ra, rb] = shuffle([...KONT]).slice(0, 2);
  const A = REG[ra];
  const B = REG[rb];
  const ba = bod(ra);
  const bb = bod(rb);
  const key = `Obě místa leží na jižní polokouli; první má podnebí ${A.clim}, druhé podnebí ${B.clim}`;
  return hlidej(
    choice(
      `Porovnej dvě místa: první má souřadnice ${ba.s}, ${ba.d}, druhé ${bb.s}, ${bb.d} – co mají společné a v čem se liší?`,
      key,
      [
        {
          value: `Obě místa leží na jižní polokouli; první má podnebí ${B.clim}, druhé podnebí ${A.clim}`,
          why: `Podnebí jsi prohodil: první místo (${ba.s}) patří do oblasti „${A.label}“, tedy ${A.clim}.`,
        },
        {
          value: `Obě místa leží na severní polokouli; první má podnebí ${A.clim}, druhé podnebí ${B.clim}`,
          why: `Obě šířky mají písmena j. š. (${ba.s}; ${bb.s}), tedy jižní polokouli. Severní polokoule je u s. š.`,
        },
        {
          value: `Obě místa leží na jižní polokouli; obě mají podnebí ${A.clim}`,
          why: `Druhé místo (${bb.s}, ${bb.d}) patří do oblasti „${B.label}“, tedy ${B.clim}. Stejné podnebí jako první proto nemá.`,
        },
        {
          value: `První místo leží na jižní a druhé na severní polokouli; první má podnebí ${A.clim}, druhé podnebí ${B.clim}`,
          why: `Obě šířky jsou jižní (${ba.s}; ${bb.s}). Žádné místo neleží na severní polokouli, liší se jen podnebím.`,
        },
      ],
      {
        hints: [
          "U každého místa zvlášť zjisti polokouli podle písmen za šířkou a oblast podle čísel. Teprve potom místa porovnej.",
          "Společné bývá to, co plyne z písmen za souřadnicemi; rozdíl v podnebí zjistíš podle šířky a délky, tedy podle toho, jak daleko je místo od rovníku a od moře.",
        ],
        explanation: `${ba.s}, ${ba.d} je oblast „${A.label}“ (${A.clim}), ${bb.s}, ${bb.d} je oblast „${B.label}“ (${B.clim}). Obě šířky jsou jižní, takže obě místa leží na jižní polokouli, ale liší se podnebím.`,
      },
    ),
  );
}

/** D) Které tvrzení je chybné? (3 pravdivá, 1 chybné) */
interface Tvrzeni {
  t: string;
  tema: string;
  proc: string;
}

const PRAVDA: Tvrzeni[] = [
  { t: "Nejtepleji je na severu Austrálie, protože leží nejblíž k rovníku", tema: "sever", proc: "Sever leží nejblíž k rovníku, proto je tam nejtepleji." },
  { t: "V prosinci je v Austrálii léto, protože jižní polokoule je tehdy nakloněná ke Slunci", tema: "doby", proc: "Sklon zemské osy přikloní v prosinci jižní polokouli ke Slunci." },
  { t: "Vnitrozemí je suché mimo jiné proto, že vlhký vítr od oceánu zadrží pohoří na východě", tema: "vnit", proc: "Pohoří na východě zadrží vlhký vítr a moře je daleko, do vnitrozemí se dostane málo srážek." },
  { t: "Nejvíc lidí bydlí na jihovýchodním pobřeží, protože tam prší dost a podnebí je mírné", tema: "osidleni", proc: "Na jihovýchodě je dost srážek a mírné podnebí, proto tam je nejvíc lidí." },
  { t: "Austrálie je světadíl i stát, protože celou pevninu zabírá jediný stát", tema: "stat", proc: "Celou pevninu zabírá jediný stát, proto je Austrálie zároveň světadíl i stát." },
  { t: "Do Oceánie patří Nový Zéland i Fidži, protože oba státy leží na ostrovech v Tichém oceánu", tema: "oceanie", proc: "Oceánii tvoří státy na ostrovech v Tichém oceánu, mezi nimi Nový Zéland a Fidži." },
  { t: "Austrálie leží na jižní polokouli, protože celá leží jižně od rovníku", tema: "poloha", proc: "Celá Austrálie leží jižně od rovníku, proto mají místa v ní šířku j. š. a leží na jižní polokouli." },
  { t: "Východní svahy pohoří jsou vlhčí, protože tam vlhký vítr od Tichého oceánu zanechá déšť", tema: "pohori", proc: "Vlhký vítr od Tichého oceánu zanechá déšť na východních svazích pohoří." },
];

const CHYBA: Tvrzeni[] = [
  { t: "Nejchladněji je na severu Austrálie, protože leží nejblíž k severnímu pólu", tema: "sever", proc: "Sever Austrálie leží v tropech, blíž k rovníku než zbytek světadílu, ne u severního pólu. Na jižní polokouli je nejchladněji na jihu." },
  { t: "V prosinci je v Austrálii zima, protože Vánoce jsou vždy v zimě", tema: "doby", proc: "Vánoce jsou v zimě jen na severní polokouli. V Austrálii je v prosinci léto, protože roční doby jsou obrácené." },
  { t: "Vnitrozemí Austrálie je suché, protože je tam celoročně zima", tema: "vnit", proc: "Ve vnitrozemí je naopak horko. Sucho tam dělá vzdálenost od moře a pohoří, které zachytí vlhký vítr." },
  { t: "Austrálie je jen stát v Asii, protože leží blízko Indonésie", tema: "stat", proc: "Austrálie je samostatný světadíl, ne součást Asie. Blízkost sousedního státu na to nemá vliv." },
  { t: "Oceánie leží v Atlantském oceánu, protože tam je také mnoho ostrovů", tema: "oceanie", proc: "Oceánie leží v Tichém oceánu, ne v Atlantském. Mnoho ostrovů je i jinde, ale to polohu neurčuje." },
  { t: "Austrálie leží na severní polokouli, protože je v ní teplo jako v tropech", tema: "poloha", proc: "Polokouli neurčuje teplo, ale šířka. Austrálie má j. š., leží tedy na jižní polokouli." },
  { t: "Velké předělové pohoří leží na západě Austrálie, protože tam je vlhčeji než na východě", tema: "pohori", proc: "Velké předělové pohoří leží na východě u Tichého oceánu; velká část západu a středu je suchá (pouště a polopouště)." },
  { t: "Nejvíc lidí bydlí ve vnitrozemí, protože je tam nejvíc místa", tema: "osidleni", proc: "Místo samo o sobě k životu nestačí. Ve vnitrozemí je sucho, a proto tam lidí bydlí nejméně." },
];

function chybneTvrzeni(): PracticeTask | null {
  const c = pick(CHYBA);
  const tri = shuffle(PRAVDA.filter((p) => p.tema !== c.tema)).slice(0, 3);
  return hlidej(
    choice(
      "Které tvrzení o Austrálii nebo Oceánii je chybné?",
      c.t,
      tri.map((p): Distractor => ({ value: p.t, why: `Toto tvrzení je pravdivé. ${p.proc}` })),
      {
        hints: [
          "U každého tvrzení zkontroluj obě části: to, co se tvrdí, a příčinu za slovem protože.",
          "Ptej se u každého tvrzení, jestli příčina skutečně vysvětluje to, co se tvrdí, a jestli neplatí jen u nás v Evropě, a ne v Austrálii.",
        ],
        explanation: c.proc,
      },
    ),
  );
}

/** E) Kde bude v daném měsíci tepleji — Česko, nebo místo v Austrálii? */
const MES_LETO = ["prosinci", "lednu", "únoru"]; // v Česku zima, na jihu léto
const MES_ZIMA = ["červnu", "červenci", "srpnu"]; // v Česku léto, na jihu zima
const CESKO: [number, number][] = [[50, 14], [49, 17], [50, 18], [50, 13], [49, 15]];

function teplejsiMisto(): PracticeTask | null {
  const leto = Math.random() < 0.5;
  const mes = pick(leto ? MES_LETO : MES_ZIMA);
  const [clat, clon] = pick(CESKO);
  const cz = mkBod(clat, clon, false);
  const b = bod(pick<RegId>(["jv", "jz"]));
  const q = `Které ze dvou míst bude mít v ${mes} průměrně tepleji: první leží v Česku na ${cz.s}, ${cz.d}, druhé v Austrálii na ${b.s}, ${b.d}?`;
  const key = leto
    ? `Druhé místo, protože na jižní polokouli je v ${mes} léto a v Česku zima`
    : `První místo, protože v ${mes} je v Česku léto a na jižní polokouli zima`;
  const stejne: Distractor = {
    value: `Obě místa budou mít stejně, protože v ${mes} je na celé Zemi stejné roční období`,
    why: "Roční období není na celé Zemi stejné. Na severní a jižní polokouli jsou obrácená, protože zemská osa je nakloněná.",
  };
  const dist: Distractor[] = leto
    ? [
        { value: "První místo, protože severní polokoule je teplejší než jižní", why: "Polokoule není trvale teplejší nebo chladnější. V lednu je zima na severní polokouli, kdežto na jižní je léto." },
        { value: `První místo, protože jižní polokoule leží blíž k jižnímu pólu, a proto je tam v ${mes} zima`, why: "Zima není na jihu celoroční. Roční doby dělá sklon zemské osy a v tuto dobu je jižní polokoule přikloněná ke Slunci." },
        stejne,
      ]
    : [
        { value: "Druhé místo, protože Austrálie je vždy teplejší než Česko", why: "Austrálie není teplejší stále. Na jižní polokouli je v tuto dobu zima, v Česku naopak léto." },
        { value: `Druhé místo, protože jižní polokoule je v ${mes} blíž ke Slunci`, why: "Vzdálenost od Slunce roční doby nedělá. Rozhoduje sklon zemské osy: v tuto dobu je ke Slunci přikloněná severní polokoule." },
        stejne,
      ];
  return hlidej(
    choice(q, key, dist, {
      hints: [
        "Nejdřív podle písmen za šířkou zjisti polokouli každého místa a zamysli se, jaké roční období tam v daném měsíci je.",
        "Roční doby dělá sklon zemské osy: kdy je léto na jedné polokouli, je na druhé zima. Porovnej pak roční období obou míst v tom měsíci a rozhodni, kde bude tepleji.",
      ],
      explanation: leto
        ? `Česko leží na severní polokouli (${cz.s}), místo ${b.s} na jižní. Sklon zemské osy způsobí, že je v ${mes} v Česku zima, ale na jižní polokouli léto, takže tam bude tepleji.`
        : `Česko leží na severní polokouli (${cz.s}), místo ${b.s} na jižní. Sklon zemské osy způsobí, že je v ${mes} v Česku léto, ale na jižní polokouli zima, takže tepleji bude v Česku.`,
    }),
  );
}

const l3Tvurci: Tvurce[] = [poznejOblast, nejridceji, porovnejDve, chybneTvrzeni, teplejsiMisto];

// ── Generátor ──────────────────────────────────────────────────────────────

/** L3: šablony se střídají v zamíchaných kolech, ať se v sezení objeví všech pět. */
function genL3(): PracticeTask[] {
  const out = new Map<string, PracticeTask>();
  for (let kolo = 0; kolo < 12 && out.size < 24; kolo++) {
    for (const tv of shuffle(l3Tvurci)) {
      const t = losUlohy(tv);
      out.set(klicUlohy(t), t);
    }
  }
  return [...out.values()];
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return ruzneUlohy(() => losUlohy(faktL1));
  if (level === 2) return ruzneUlohy(() => losUlohy(pick(l2Tvurci)));
  return genL3();
}

// ── Topic ──────────────────────────────────────────────────────────────────

export const AUSTRALIE_OCEANIE_POLOHA_POVRCH_KLIMA: TopicMetadata[] = [
  {
    id: "g6-zem-australie-oceanie-poloha-povrch-klima-6",
    rvpNodeId: "g6-zemepis-regiony-sveta-australie-a-oceanie-australie-a-oceanie-poloha-povrch-klima",
    displayName: "Austrálie a Oceánie",
    title: "Austrálie a Oceánie - poloha, povrch, klima",
    studentTitle: "Světadíl na druhé straně světa",
    subject: "zemepis",
    category: "Regiony světa",
    topic: "Austrálie a Oceánie",
    briefDescription: "Kde Austrálie a Oceánie leží, jak vypadá jejich povrch a jaké je tam podnebí.",
    keywords: [
      "Austrálie", "Oceánie", "jižní polokoule", "Velké předělové pohoří", "vnitrozemí",
      "poušť", "tropický sever", "roční doby", "Tichý oceán", "Indický oceán",
      "Nový Zéland", "podnebí",
    ],
    goals: [
      "Popsat polohu Austrálie a Oceánie mezi Indickým a Tichým oceánem na jižní polokouli.",
      "Vyjmenovat základní znaky povrchu (nížinné a suché vnitrozemí, pohoří na východě).",
      "Odvodit z polohy a povrchu podnebí, osídlení a obrácené roční doby.",
      "Poznat místo podle souřadnic a popisu podnebí.",
    ],
    boundaries: [
      "Roční doby dělá sklon zemské osy, ne vzdálenost od Slunce; na jižní polokouli jsou obrácené oproti Česku.",
      "Přesné výšky, rozlohy ani počty obyvatel se v klíči nepoužívají — jen řád nebo pořadí.",
      "Poloha se zadává slovy a souřadnicemi, bez map a obrázků.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Austrálie je světadíl na jižní polokouli mezi Indickým a Tichým oceánem; Oceánie jsou ostrovy v Tichém oceánu. Vnitrozemí je suché, na východě je pohoří, na severu horko.",
      steps: [
        "U souřadnic nejdřív podle písmen urči polokouli a východ či západ.",
        "Podle šířky odhadni, jak daleko je místo od rovníku (sever teplý, jih mírný).",
        "Podle vzdálenosti od moře a pohoří odhadni srážky a osídlení.",
      ],
      commonMistake: "Přenést na jižní polokouli naše pravidlo: sever tam není nejchladnější a Vánoce nejsou v zimě.",
      example: "Místo na 12° j. š. a 131° v. d. leží na jižní polokouli blízko rovníku, tedy na tropickém severu Austrálie, kde je horko a střídá se období dešťů.",
    },
  },
];
