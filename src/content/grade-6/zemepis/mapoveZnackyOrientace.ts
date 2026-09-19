/**
 * Zeměpis 6. ročník — Mapové značky, orientace na mapě (select_one).
 *
 * K tématu nejsou obrázky map: značky se popisují slovy („modrá plná čára“,
 * „černý trojúhelník s číslem“) a poloha míst posunem prstu po mapě nebo
 * slovním popisem. Sever je na mapě nahoře, pokud zadání neříká jinak.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • záměna východu a západu (vpravo ↔ vlevo), záměna severu a jihu;
 *  • záměna os mapy (nahoru ↔ doprava), šikmý posun čtený jako hlavní strana
 *    a naopak;
 *  • opačný směr (cesta z druhého konce), u inverze převrácená jen jedna část
 *    vedlejší strany nebo směr nepřevrácený vůbec;
 *  • záměna barev a čar v legendě (vrstevnice = cesta / hranice, zelená vždy
 *    les, hnědá = pole);
 *  • husté vrstevnice = mírný svah; Slunce v poledne jinde než na jihu.
 *
 *  • L1 — zapamatování: banka faktů o legendě, pojmech a světových stranách.
 *  • L2 — použití: směr mezi dvěma místy z posunu na mapě (i vedlejší strany),
 *         cesta mezi značkami, dvě místa na opačných březích potoka.
 *  • L3 — přenos: inverze směru, cesta o dvou až třech úsecích, orientace
 *         podle poledního Slunce, úsudek z vrstevnic, směr toku z barev mapy.
 *
 * Rotace šablon/banky začíná na náhodném místě (lokální počítadlo v gen()),
 * modul nemá stav.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { cis, pick, shuffle, buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

// ── Světové strany ───────────────────────────────────────────────────────
/** Posun na mapě: [doprava +, nahoru +]. */
type Vec = [number, number];

interface Smer {
  /** „na sever“ — kam jdeš / kam něco leží. */
  na: string;
  /** „severně“ — kde něco leží vzhledem k jinému místu. */
  adv: string;
  /** „k severu“ — kam něco teče. */
  k: string;
}

const SMERY: Record<string, Smer> = {
  "0,1": { na: "na sever", adv: "severně", k: "k severu" },
  "1,1": { na: "na severovýchod", adv: "severovýchodně", k: "k severovýchodu" },
  "1,0": { na: "na východ", adv: "východně", k: "k východu" },
  "1,-1": { na: "na jihovýchod", adv: "jihovýchodně", k: "k jihovýchodu" },
  "0,-1": { na: "na jih", adv: "jižně", k: "k jihu" },
  "-1,-1": { na: "na jihozápad", adv: "jihozápadně", k: "k jihozápadu" },
  "-1,0": { na: "na západ", adv: "západně", k: "k západu" },
  "-1,1": { na: "na severozápad", adv: "severozápadně", k: "k severozápadu" },
};

const znam = (n: number) => (n > 0 ? 1 : n < 0 ? -1 : 0);
const smer = (v: Vec): Smer => SMERY[`${znam(v[0])},${znam(v[1])}`];

/** Osm směrů v pořadí po směru hodinových ručiček od severu. */
const VEKTORY: Vec[] = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];

const velke = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Opakované diagnózy chyb (stejná miskoncepce → stejné vysvětlení).
const FB_VZ = "Na mapě se severem nahoře je vpravo východ a vlevo západ. Tady jsi je prohodil.";
const FB_SJ = "Na mapě je sever nahoře a jih dole. Tady jsi je prohodil.";
const FB_OSY = "Zaměnil jsi osy mapy: posun nahoru a dolů odpovídá severu a jihu, posun doprava a doleva východu a západu.";
const FB_SIKMO = "Posun vede nahoru nebo dolů a zároveň do strany, tedy šikmo. Takový směr je vedlejší světová strana, jejíž název se skládá ze dvou částí.";
const FB_ROVNE = "Posun vede jen jedním směrem, ne šikmo. Vedlejší světová strana by platila jen tehdy, kdyby posun vedl zároveň nahoru nebo dolů i do strany.";

/**
 * Distraktory k posunu na mapě (L2 a tok řeky v L3). Záměna východu a západu
 * je hlavní chyba tématu, proto je mezi distraktory vždy, když posun vede
 * do strany.
 *
 * `opacnyWhy` je diagnóza volby OPAČNÉHO směru. U hlavních stran je opačný
 * směr zároveň prohozením východu a západu (resp. severu a jihu), ale
 * miskoncepce za tou volbou je jiná — u toku řeky „voda by tekla do kopce“,
 * ne „prohodil jsi strany mapy“. Proto má `opacnyWhy` přednost i tam a
 * FB_VZ / FB_SJ zůstávají jen jako výchozí text, když ho volající nedodá.
 */
function posunDistraktory(v: Vec, tvar: (s: Smer) => string, opacnyWhy?: string): Distractor[] {
  const [dx, dy] = v;
  const d = (w: Vec, why: string): Distractor => ({ value: tvar(smer(w)), why });
  if (dx && dy) {
    return [
      d([-dx, dy], FB_VZ),
      ...shuffle([
        d([-dx, -dy], opacnyWhy ?? FB_VZ),
        d([dx, -dy], FB_SJ),
        d([0, dy], FB_SIKMO),
        d([dx, 0], FB_SIKMO),
      ]),
    ];
  }
  if (dx) {
    return [d([-dx, 0], opacnyWhy ?? FB_VZ), d([0, pick([1, -1])], FB_OSY), d([dx, pick([1, -1])], FB_ROVNE)];
  }
  return [d([0, -dy], opacnyWhy ?? FB_SJ), d([pick([1, -1]), 0], FB_OSY), d([pick([1, -1]), dy], FB_ROVNE)];
}

// ── Místa ────────────────────────────────────────────────────────────────
interface Misto {
  nom: string;
  gen: string;
  akuz: string;
  /** Dativ i s předložkou („ke kostelu“) — předložka se nelepí k holému jménu. */
  kDat: string;
}

const MISTA: Misto[] = [
  { nom: "hájovna", gen: "hájovny", akuz: "hájovnu", kDat: "k hájovně" },
  { nom: "mlýn", gen: "mlýna", akuz: "mlýn", kDat: "k mlýnu" },
  { nom: "hrad", gen: "hradu", akuz: "hrad", kDat: "k hradu" },
  { nom: "chata", gen: "chaty", akuz: "chatu", kDat: "k chatě" },
  { nom: "kaple", gen: "kaple", akuz: "kapli", kDat: "ke kapli" },
  { nom: "nádraží", gen: "nádraží", akuz: "nádraží", kDat: "k nádraží" },
  { nom: "rozhledna", gen: "rozhledny", akuz: "rozhlednu", kDat: "k rozhledně" },
  { nom: "most", gen: "mostu", akuz: "most", kDat: "k mostu" },
  { nom: "studánka", gen: "studánky", akuz: "studánku", kDat: "ke studánce" },
  { nom: "škola", gen: "školy", akuz: "školu", kDat: "ke škole" },
];

const START: Misto[] = [
  { nom: "rozcestí", gen: "rozcestí", akuz: "rozcestí", kDat: "k rozcestí" },
  { nom: "chata", gen: "chaty", akuz: "chatu", kDat: "k chatě" },
  { nom: "parkoviště", gen: "parkoviště", akuz: "parkoviště", kDat: "k parkovišti" },
  { nom: "nádraží", gen: "nádraží", akuz: "nádraží", kDat: "k nádraží" },
  { nom: "hájovna", gen: "hájovny", akuz: "hájovnu", kDat: "k hájovně" },
];

/** Obce pro úlohu s potokem (jméno + genitiv). */
const OBCE: { nom: string; gen: string }[] = [
  { nom: "Lipová", gen: "Lipové" },
  { nom: "Dubí", gen: "Dubí" },
  { nom: "Borek", gen: "Borku" },
  { nom: "Lhota", gen: "Lhoty" },
  { nom: "Olešná", gen: "Olešné" },
  { nom: "Javorník", gen: "Javorníku" },
];

/** Objekty s mapovou značkou popsanou slovy (turistická mapa). */
const ZNACKY: { nom: string; gen: string; kDat: string; znacka: string }[] = [
  { nom: "kostel", gen: "kostela", kDat: "ke kostelu", znacka: "černý křížek" },
  { nom: "rybník", gen: "rybníka", kDat: "k rybníku", znacka: "modrá plocha" },
  { nom: "vrchol", gen: "vrcholu", kDat: "k vrcholu", znacka: "černý trojúhelník s údajem výšky" },
  { nom: "les", gen: "lesa", kDat: "k lesu", znacka: "zelená plocha" },
];

const dvaRuzne = <T>(seznam: T[]): [T, T] => {
  const a = pick(seznam);
  let b = pick(seznam);
  while (b === a) b = pick(seznam);
  return [a, b];
};

// ── L1 — zapamatování ────────────────────────────────────────────────────
/** Jedna položka banky: otázka, klíč, distraktory [možnost, proč je to chyba], dvě nápovědy, vysvětlení. */
interface Polozka {
  q: string;
  key: string;
  ds: [string, string][];
  h: [string, string];
  ex: string;
}

const uloha = (p: Polozka): PracticeTask | null =>
  choice(p.q, p.key, shuffle(p.ds.map(([value, why]) => ({ value, why }))), { hints: [...p.h], explanation: p.ex });

const FB_VRSTEVNICE_CESTA = "Turistická cesta se kreslí barevnou čarou podle značení. Vrstevnice je tenká hnědá čára, která spojuje místa se stejnou nadmořskou výškou.";
const FB_VRSTEVNICE_HRANICE = "Hranice se kreslí přerušovanou nebo tečkovanou čarou. Vrstevnice je tenká hnědá čára, která spojuje místa se stejnou nadmořskou výškou.";

const BANKA_L1: Polozka[] = [
  {
    q: "Co je na mapě vyznačeno modrou plnou čarou, která se klikatí krajinou?",
    key: "vodní tok, třeba řeka nebo potok",
    ds: [
      ["silnice, třeba dálnice nebo cesta", "Silnice se kreslí jinou barvou. Modrá barva na mapě patří vodě."],
      ["hranice, třeba mezi dvěma státy", "Hranice se kreslí přerušovanou nebo tečkovanou čarou, ne plnou modrou."],
      ["vrstevnice, tedy stejná výška", "Vrstevnice je tenká hnědá čára. Modrou barvou se na mapě kreslí voda."],
    ],
    h: [
      "Barva značky napovídá, co v krajině představuje. Co je v přírodě modré a vine se krajinou?",
      "Modrou barvou se na mapách kreslí všechno, co souvisí s vodou. Dlouhá klikatá čára znamená něco, co krajinou teče z vyšších míst do nižších.",
    ],
    ex: "Modrá barva na mapě patří vodě. Modrá klikatá čára je vodní tok, tedy řeka nebo potok.",
  },
  {
    q: "Co je na mapě vyznačeno modře vybarvenou plochou?",
    key: "vodní plocha, třeba rybník",
    ds: [
      ["lesní porost, třeba bučina", "Les se na turistické mapě kreslí zeleně. Modrá barva patří vodě."],
      ["nížina, třeba Polabí", "Nížiny se na obecně zeměpisné mapě barví zeleně. Modrá barva patří vodě."],
      ["pole, třeba s obilím", "Pole modře vybarvená nebývají. Modrá barva na mapě patří vodě."],
    ],
    h: [
      "Modrá plocha je jiná než modrá čára: nevine se, ale zabírá místo. Co takového je v krajině?",
      "Modrou barvou se na mapách kreslí voda. Čára znamená vodu, která teče, plocha znamená vodu, která stojí a zaplňuje prohlubeň.",
    ],
    ex: "Modře vybarvená plocha je vodní plocha: rybník, jezero, přehradní nádrž nebo moře.",
  },
  {
    q: "Co je na turistické mapě vyznačeno zeleně vybarvenou plochou?",
    key: "les",
    ds: [
      ["nížina", "Zelená barva znamená nížinu na obecně zeměpisné mapě v atlase. Tady jde o turistickou mapu, na které je zeleně les."],
      ["rybník", "Rybníky a jiné vodní plochy se kreslí modře."],
      ["hory", "Vyšší polohy ukazují na turistické mapě hnědé vrstevnice, ne zelená plocha."],
    ],
    h: [
      "Všimni si, o jaký druh mapy jde. Turistická mapa ukazuje hlavně to, co uvidíš na výletě.",
      "Na turistické mapě barva plochy ukazuje, čím je krajina pokrytá. Zeleně se kreslí to, čím vedou stinné cesty mezi stromy.",
    ],
    ex: "Na turistické mapě je zeleně vybarvený les. (V atlase na obecně zeměpisné mapě znamená zelená nížinu.)",
  },
  {
    q: "Co ukazuje zelená barva na obecně zeměpisné mapě v atlase?",
    key: "nížiny, tedy nízko položená území",
    ds: [
      ["lesy, tedy území pokrytá stromy", "Les znamená zelená barva na turistické mapě. V atlase ukazuje barva nadmořskou výšku."],
      ["hory, tedy vysoko položená území", "Hory se na obecně zeměpisné mapě barví hnědě. Zelená znamená nízkou polohu."],
      ["pole, tedy obdělávaná území", "Obecně zeměpisná mapa barvou neukazuje, co na území roste, ale jak vysoko leží."],
    ],
    h: [
      "Na obecně zeměpisné mapě se barvy mění od zelené přes žlutou do hnědé. Co tím mapa ukazuje?",
      "Barvy na obecně zeměpisné mapě ukazují nadmořskou výšku: čím tmavší hnědá, tím výš. Zelená je na opačném konci té stupnice.",
    ],
    ex: "Obecně zeměpisná mapa ukazuje barvou nadmořskou výšku. Zelená znamená nížiny, žlutá a hnědá vyšší polohy.",
  },
  {
    q: "Co ukazuje tmavě hnědá barva na obecně zeměpisné mapě v atlase?",
    key: "hory, tedy vysoko položená území",
    ds: [
      ["pole, tedy orná půda", "Obecně zeměpisná mapa barvou neukazuje, co na území roste. Hnědá znamená vysokou polohu."],
      ["nížiny, tedy nízko položená území", "Nížiny se barví zeleně. Čím tmavší hnědá, tím výš území leží."],
      ["města, tedy hustě osídlená území", "Sídla mají na mapě vlastní značky. Hnědá barva ukazuje nadmořskou výšku."],
    ],
    h: [
      "Barvy na obecně zeměpisné mapě tvoří stupnici od zelené přes žlutou do hnědé. Co se podle ní mění?",
      "Stupnice barev v atlase ukazuje nadmořskou výšku. Zelená je dole na stupnici, hnědá nahoře — a tmavě hnědá úplně nahoře.",
    ],
    ex: "Tmavě hnědá barva na obecně zeměpisné mapě znamená hory, tedy nejvýše položená území.",
  },
  {
    q: "Co je na mapě vrstevnice?",
    key: "čára spojující místa se stejnou nadmořskou výškou",
    ds: [
      ["čára označující turistickou cestu do kopce", FB_VRSTEVNICE_CESTA],
      ["čára označující hranici okresu nebo kraje", FB_VRSTEVNICE_HRANICE],
      ["čára spojující místa se stejnou teplotou", "Místa se stejnou teplotou spojuje jiná čára. Vrstevnice se týká výšky."],
    ],
    h: [
      "Vrstevnice se kreslí tenkou hnědou čarou a v kopcích jich je mnoho. Co mají body na jedné takové čáře společného?",
      "Představ si, že kopec rozřežeš vodorovně na stejně vysoké vrstvy. Okraj každé vrstvy nakreslený na mapu je jedna vrstevnice.",
    ],
    ex: "Vrstevnice je čára, která spojuje místa se stejnou nadmořskou výškou. Kreslí se tenkou hnědou čarou.",
  },
  {
    q: `Co znamená na mapě černý trojúhelník, u kterého je číslo ${cis(1603)}?`,
    key: "vrchol a jeho nadmořskou výšku v metrech",
    ds: [
      ["rozhlednu a její výšku v metrech", "Žádná rozhledna není vysoká přes tisíc metrů. Číslo u trojúhelníku je nadmořská výška vrcholu."],
      ["vzdálenost k obci v metrech", "Vzdálenosti se na mapě měří podle měřítka, u značek se nepíšou. Trojúhelník označuje vrchol."],
      ["jezero a jeho hloubku v metrech", "Jezero se kreslí modrou plochou. Černý trojúhelník označuje vrchol."],
    ],
    h: [
      "Takovému bodu se říká kóta. Trojúhelník svým tvarem připomíná to, co v krajině označuje.",
      `Kóta je bod s uvedenou nadmořskou výškou; černý trojúhelník ji na mapě označuje na vrcholu. Číslo vedle udává, kolik metrů nad mořem to místo leží — Sněžka má třeba ${cis(1603)} metrů.`,
    ],
    ex: "Černý trojúhelník s číslem je kóta: označuje vrchol a číslo udává jeho nadmořskou výšku v metrech.",
  },
  {
    q: "Jak se nazývá část mapy, která vysvětluje, co znamenají jednotlivé značky?",
    key: "legenda",
    ds: [
      ["měřítko", "Měřítko udává, kolikrát je mapa zmenšená. Značky nevysvětluje."],
      ["směrová růžice", "Směrová růžice ukazuje světové strany. Značky nevysvětluje."],
      ["zeměpisná síť", "Síť poledníků a rovnoběžek slouží k určení polohy. Značky nevysvětluje."],
    ],
    h: [
      "Hledáš rámeček na okraji mapy, ve kterém je u každé značky napsané, co znamená.",
      "Této části mapy se říká také vysvětlivky. Stejné slovo znáš i z pověstí, jen tam znamená vyprávění.",
    ],
    ex: "Legenda (vysvětlivky) je část mapy, kde je u každé značky napsané, co znamená.",
  },
  {
    q: "Který přístroj ukazuje pomocí magnetické střelky k severu?",
    key: "buzola nebo kompas",
    ds: [
      ["výškoměr nebo barometr", "Výškoměr a barometr měří výšku a tlak vzduchu. Směr neukážou."],
      ["úhloměr nebo pravítko", "Úhloměrem a pravítkem měříš na papíře. K severu nemíří."],
      ["sluneční hodiny", "Sluneční hodiny ukazují čas podle stínu. Magnetickou střelku nemají."],
    ],
    h: [
      "Hledáš přístroj, který nosí turisté a vojáci, aby se neztratili v lese.",
      "Střelka tohoto přístroje je malý magnet, který se natočí podle magnetického pole Země. Jeden z nich má navíc otočný kotouč se stupnicí.",
    ],
    ex: "K severu ukazuje magnetická střelka buzoly nebo kompasu. Buzola má navíc stupnici pro měření směru.",
  },
  {
    q: "Jak se řekne tomu, když mapu otočíš tak, aby její sever mířil k severu v krajině?",
    key: "zorientovat mapu",
    ds: [
      ["zmenšit mapu", "Zmenšení mapy souvisí s měřítkem. Směr mapy se tím nemění."],
      ["přeložit mapu", "Přeložením mapu jen složíš. K severu v krajině ji tím nenamíříš."],
      ["okótovat mapu", "Kóta je bod s údajem nadmořské výšky. Se směrem mapy nesouvisí."],
    ],
    h: [
      "Myslí se tím natočení mapy podle skutečných světových stran. Které sloveso říká, že se v krajině vyznáš?",
      "Když mapu otočíš podle buzoly, značky na ní leží stejným směrem jako skutečná místa kolem tebe. Tomu úkonu se říká stejně jako tomu, že se v terénu vyznáš.",
    ],
    ex: "Zorientovat mapu znamená otočit ji tak, aby její sever mířil k severu v krajině (například podle buzoly).",
  },
  {
    q: "Kde je na mapě obvykle sever, když na ní není nic jiného vyznačeno?",
    key: "u horního okraje mapy",
    ds: [
      ["u dolního okraje mapy", "U dolního okraje mapy bývá jih, tedy opačná strana."],
      ["u levého okraje mapy", "U levého okraje mapy bývá západ."],
      ["u pravého okraje mapy", "U pravého okraje mapy bývá východ."],
    ],
    h: [
      "Vybav si mapu Česka: na kterém okraji leží Polsko a na kterém Rakousko?",
      "Nápisy na mapě čteš stejně jako v knize. Strana, na které leží Krkonoše a Polsko, je ta, ke které ukazuje střelka buzoly.",
    ],
    ex: "Mapy se kreslí tak, že sever je u horního okraje. Proto je nahoře Polsko a dole Rakousko.",
  },
  {
    q: "Která světová strana je na mapě dole, když je sever nahoře?",
    key: "jih",
    ds: [
      ["západ", "Západ je na mapě vlevo, ne dole."],
      ["východ", "Východ je na mapě vpravo, ne dole."],
      ["jihozápad", "Jihozápad je vedlejší strana a leží šikmo vlevo dole, ne přímo dole."],
    ],
    h: [
      "Dolní okraj mapy je naproti hornímu. Která strana je naproti severu?",
      "Hlavní světové strany jdou po směru hodinových ručiček. Od severu je to o půl otáčky, tedy na opačnou stranu kruhu.",
    ],
    ex: "Na mapě se severem nahoře je dole jih — leží přesně naproti severu.",
  },
  {
    q: "Která světová strana je na mapě vpravo, když je sever nahoře?",
    key: "východ",
    ds: [
      ["západ", "Na mapě se severem nahoře je vpravo východ a vlevo západ. Tady jsi je prohodil."],
      ["jih", "Jih je na mapě dole, ne vpravo."],
      ["severovýchod", "Severovýchod leží šikmo vpravo nahoře, ne přímo vpravo."],
    ],
    h: [
      "Hlavní světové strany jdou po směru hodinových ručiček. Která následuje hned po severu?",
      "Otoč se v duchu od severu o čtvrt otáčky po směru hodinových ručiček. Pomůcka: Slunce ráno vychází na té straně, kde je na mapě tento okraj.",
    ],
    ex: "Na mapě se severem nahoře je vpravo východ, vlevo západ.",
  },
  {
    q: "Která světová strana je na mapě vlevo, když je sever nahoře?",
    key: "západ",
    ds: [
      ["východ", "Na mapě se severem nahoře je vpravo východ a vlevo západ. Tady jsi je prohodil."],
      ["jih", "Jih je na mapě dole, ne vlevo."],
      ["jihozápad", "Jihozápad leží šikmo vlevo dole, ne přímo vlevo."],
    ],
    h: [
      "Hlavní světové strany jdou po směru hodinových ručiček. Která je o čtvrt otáčky před severem?",
      "Otoč se v duchu od severu o čtvrt otáčky proti směru hodinových ručiček. Pomůcka: na té straně Slunce večer zapadá.",
    ],
    ex: "Na mapě se severem nahoře je vlevo západ, vpravo východ.",
  },
  {
    q: "Která z těchto světových stran je vedlejší, ne hlavní?",
    key: "severovýchod",
    ds: [
      ["sever", "Sever je hlavní světová strana, stejně jako jih, východ a západ."],
      ["východ", "Východ je hlavní světová strana, stejně jako sever, jih a západ."],
      ["jih", "Jih je hlavní světová strana, stejně jako sever, východ a západ."],
    ],
    h: [
      "Hlavní světové strany jsou čtyři. Vedlejší leží mezi nimi. Poznáš je podle názvu?",
      "Vedlejší strana leží přesně mezi dvěma hlavními, a proto má složený název ze dvou hlavních stran.",
    ],
    ex: "Vedlejší světové strany leží mezi hlavními a mají složený název: severovýchod, jihovýchod, jihozápad, severozápad.",
  },
  {
    q: "Na které straně oblohy je u nás Slunce v poledne?",
    key: "na jihu",
    ds: [
      ["na severu", "Česko leží severně od obratníku Raka, a proto je tu Slunce v poledne vždy na jižní straně oblohy, nikdy na severní."],
      ["na východě", "Na východě je Slunce ráno, když vychází. Do poledne se přesune."],
      ["přímo nad hlavou", "Přímo nad hlavou bývá Slunce jen v tropech. U nás je v poledne níž nad obzorem."],
    ],
    h: [
      "Slunce ráno vychází, v poledne je nejvýš a večer zapadá. Kam se za dopoledne přesune?",
      "Česko leží severně od obratníku, takže Slunce u nás v poledne nikdy nestojí nad hlavou. Je nad obzorem na straně, která je od nás směrem k rovníku.",
    ],
    ex: "Česko leží na severní polokouli severně od obratníku, proto je u nás Slunce v poledne na jihu.",
  },
  {
    q: "Na které straně obzoru Slunce ráno vychází?",
    key: "přibližně na východě",
    ds: [
      ["přibližně na západě", "Na západě Slunce večer zapadá."],
      ["přibližně na jihu", "Na jihu je Slunce v poledne, ne ráno."],
      ["přibližně na severu", "Na severu u nás Slunce nikdy nevychází."],
    ],
    h: [
      "Vzpomeň si, kde Slunce večer zapadá. Ráno vychází na opačné straně.",
      "Země se otáčí od západu k východu, a proto se nám zdá, že Slunce putuje po obloze opačně. Den začíná na té straně, která je na mapě vpravo.",
    ],
    ex: "Slunce vychází přibližně na východě (přesně jen o rovnodennosti), v poledne je na jihu a zapadá přibližně na západě.",
  },
  {
    q: "Na politické mapě jsou státy vybarvené různými barvami. Co znamená přerušovaná čára mezi dvěma barvami?",
    key: "hranici mezi dvěma státy",
    ds: [
      ["řeku mezi dvěma státy", "Řeka se kreslí modrou plnou čarou. Hranice může po řece vést, ale značí ji přerušovaná čára."],
      ["železnici mezi dvěma státy", "Železnice vede napříč územím a nekopíruje rozhraní barev. Přerušovaná čára mezi barvami je hranice."],
      ["vrstevnici mezi dvěma státy", FB_VRSTEVNICE_HRANICE],
    ],
    h: [
      "Každá barva na politické mapě patří jednomu státu. Co tedy leží tam, kde jedna barva končí a druhá začíná?",
      "Čára vede přesně po rozhraní dvou barev, tedy tam, kde končí území jednoho státu a začíná území druhého. Značí se přerušovanou nebo tečkovanou čarou.",
    ],
    ex: "Přerušovaná (nebo tečkovaná) čára mezi dvěma různě vybarvenými státy je státní hranice.",
  },
  {
    q: "V autoatlase vede mezi městy silná červená čára. Co znamená?",
    key: "hlavní silnici",
    ds: [
      ["řeku", "Řeky se kreslí modře. Červená čára mezi městy v autoatlase je silnice."],
      ["hranici", "Hranice se kreslí přerušovanou nebo tečkovanou čarou, ne plnou červenou."],
      ["vrstevnici", "Vrstevnice je tenká hnědá čára. Silná červená čára mezi městy je silnice."],
    ],
    h: [
      "Autoatlas je mapa pro řidiče. Co spojuje města a řidič to potřebuje najít nejvíc?",
      "V autoatlase jsou nejvýraznějšími čarami cesty pro auta: čím důležitější spojení mezi městy, tím silnější čára.",
    ],
    ex: "V autoatlase znamená silná červená čára hlavní silnici. (Barvy silnic se na různých mapách liší — vždy se podívej do legendy.)",
  },
  {
    q: "Co znamenají vrstevnice nakreslené na mapě hustě u sebe?",
    key: "prudký svah",
    ds: [
      ["mírný svah", "Husté vrstevnice znamenají, že výška přibývá na krátké vzdálenosti. To je prudký svah, ne mírný."],
      ["rovinu", "Na rovině se výška nemění, a tak tam vrstevnice skoro nejsou."],
      ["cestu", FB_VRSTEVNICE_CESTA],
    ],
    h: [
      "Mezi dvěma sousedními vrstevnicemi je vždy stejný výškový rozdíl. Co to znamená, když jsou blízko u sebe?",
      "Když jsou vrstevnice blízko, stejný výškový rozdíl překonáš na krátkém kousku cesty. Představ si, jak se ti po takovém kousku jde nahoru.",
    ],
    ex: "Husté vrstevnice znamenají prudký svah: výška přibývá na krátké vzdálenosti. Řídké vrstevnice znamenají mírný svah.",
  },
];

// ── L2 — použití: směr z posunu na mapě ─────────────────────────────────
const POSUN_SLOVY = (v: Vec, n: number): string => {
  const [dx, dy] = v;
  const vert = dy > 0 ? "nahoru" : "dolů";
  const hor = dx > 0 ? "doprava" : "doleva";
  if (dx && dy) return `o ${n} cm ${vert} a o ${n} cm ${hor}`;
  return `o ${n} cm ${dx ? hor : vert}`;
};

const POSUN_KRATCE = (v: Vec): string => {
  const [dx, dy] = v;
  const vert = dy > 0 ? "nahoru" : "dolů";
  const hor = dx > 0 ? "doprava" : "doleva";
  if (dx && dy) return `šikmo ${hor} ${vert}`;
  return `přímo ${dx ? hor : vert}`;
};

/**
 * Velká nápověda k posunu: růžice vždy, věta o skládání názvu vedlejší strany
 * jen tehdy, když je posun opravdu šikmý. U rovného posunu („přímo doleva“)
 * žáka jen mate — začne hledat vedlejší stranu tam, kde žádná není.
 */
const RUZICE = "Na mapě se severem nahoře platí: nahoře sever, vpravo východ, dole jih, vlevo západ.";
const ruzice = (v: Vec): string =>
  v[0] && v[1]
    ? `${RUZICE} Posun vede šikmo, takže jde o vedlejší stranu: spoj obě strany do jednoho názvu, a to v pořadí nejdřív sever nebo jih.`
    : `${RUZICE} Posun vede jen jedním směrem, ne šikmo, takže hledáš jednu z těchto čtyř stran.`;

function l2Posun(): PracticeTask | null {
  const [a, b] = dvaRuzne(MISTA);
  const v = pick(VEKTORY);
  const n = pick([2, 3, 4, 5, 6]);
  const posun = POSUN_SLOVY(v, n);
  return choice(
    `Na mapě se severem nahoře najdeš ${b.akuz} tak, že od ${a.gen} posuneš prst ${posun}. Kterým směrem od ${a.gen} leží ${b.nom}?`,
    smer(v).na,
    posunDistraktory(v, (s) => s.na, `To je opačný směr: tak leží ${a.nom} od ${b.gen}.`),
    {
      hints: [
        `Prst jede od ${a.gen} ${posun}. Které světové strany odpovídají posunu nahoru, dolů, doleva a doprava?`,
        `${ruzice(v)} Použij to na cestu od ${a.gen}.`,
      ],
      explanation: `Na mapě se severem nahoře odpovídá posun nahoru severu, dolů jihu, doprava východu a doleva západu. Posun ${posun} proto znamená, že ${b.nom} leží od ${a.gen} ${smer(v).na}.`,
    },
  );
}

function l2Znacky(): PracticeTask | null {
  const [a, b] = dvaRuzne(ZNACKY);
  const v = pick(VEKTORY);
  const kudy = POSUN_KRATCE(v);
  return choice(
    `Na turistické mapě je sever nahoře. Cesta od ${a.gen} (${a.znacka}) ${b.kDat} (${b.znacka}) vede na mapě ${kudy}. Kterým směrem po ní jdeš?`,
    smer(v).na,
    posunDistraktory(v, (s) => s.na, `To je opačný směr: tak bys šel od ${b.gen} ${a.kDat}.`),
    {
      hints: [
        `Cesta od ${a.gen} vede na mapě ${kudy}. Převeď tenhle posun na světové strany.`,
        `${ruzice(v)} Tak zjistíš, kam vede cesta ${b.kDat}.`,
      ],
      explanation: `Cesta vede na mapě ${kudy}. Na mapě se severem nahoře to znamená, že od ${a.gen} ${b.kDat} jdeš ${smer(v).na}.`,
    },
  );
}

function l2Potok(): PracticeTask | null {
  const [x, y] = dvaRuzne(OBCE);
  // Potok teče podél jedné osy, obce leží na opačných březích (na druhé ose)
  // a zadání říká i to, že leží přímo proti sobě — bez toho by z dat plynula
  // jen jedna složka směru (třeba „jižní“) a klíč by nebyl jednoznačný.
  const vodorovne = Math.random() < 0.5;
  const strana: Vec = vodorovne ? [0, pick([1, -1])] : [pick([1, -1]), 0];
  const proti: Vec = [-strana[0], -strana[1]];
  const podel: Vec[] = vodorovne ? [[1, 0], [-1, 0]] : [[0, 1], [0, -1]];
  const tok = vodorovne
    ? pick(["od západu k východu", "od východu k západu"])
    : pick(["od severu k jihu", "od jihu k severu"]);
  const pres = `Obě obce leží na opačných březích potoka, takže cesta mezi nimi vede přes potok, ne podél něj. Potok teče ${tok}.`;
  return choice(
    `Potok (modrá čára) teče ${tok}. Obec ${x.nom} leží ${smer(strana).adv} od potoka, obec ${y.nom} přímo naproti ní ${smer(proti).adv} od něj. Kterým směrem od ${y.gen} leží ${x.nom}?`,
    smer(strana).na,
    [
      { value: smer(proti).na, why: `To je opačný směr: tak leží ${y.nom} od ${x.gen}.` },
      { value: smer(podel[0]).na, why: pres },
      { value: smer(podel[1]).na, why: pres },
    ],
    {
      hints: [
        `Kde leží ${y.nom} a kde ${x.nom} vzhledem k potoku? Nakresli si potok a obě obce na papír se severem nahoře.`,
        `Cesta od ${y.gen} vede přes potok na druhý břeh, kde leží ${x.nom}. Směr toku potoka tu neurčuje, kam jdeš — rozhoduje, na které straně potoka je každá obec.`,
      ],
      explanation: `${x.nom} leží ${smer(strana).adv} od potoka a ${y.nom} přímo naproti ní ${smer(proti).adv}. Obce jsou tedy proti sobě přes potok: z ${y.gen} přejdeš potok a jdeš ${smer(strana).na}. Směr toku (${tok}) na tom nic nemění.`,
    },
  );
}

const SABLONY_L2 = [l2Posun, l2Znacky, l2Potok];

// ── L3 — přenos ─────────────────────────────────────────────────────────
function l3Inverze(): PracticeTask | null {
  const [a, b] = dvaRuzne(MISTA);
  const v = pick(VEKTORY);
  const [dx, dy] = v;
  const zadany = smer(v).adv;
  const nepr: Distractor = { value: zadany, why: `To je směr ze zadání — tak leží ${a.nom} od ${b.gen}. Ptáme se obráceně, a opačný směr převrací sever na jih a východ na západ.` };
  const ds: Distractor[] = dx && dy
    ? [
        nepr,
        { value: smer([dx, -dy]).adv, why: "Převrátil jsi jen sever a jih. Opačný směr převrací i východ a západ." },
        { value: smer([-dx, dy]).adv, why: "Převrátil jsi jen východ a západ. Opačný směr převrací i sever a jih." },
      ]
    : [
        nepr,
        ...shuffle([[dy, -dx], [-dy, dx]] as Vec[]).map((w) => ({
          value: smer(w).adv,
          why: "Otočil ses jen o čtvrt kruhu. Opačný směr je o půl kruhu: sever se mění na jih a východ na západ.",
        })),
      ];
  return choice(
    `${velke(a.nom)} leží ${zadany} od ${b.gen}. Kde leží ${b.nom} vzhledem ${a.kDat}?`,
    smer([-dx, -dy]).adv,
    ds,
    {
      hints: [
        `Zadání popisuje, kam se díváš od ${b.gen}. Ty se ale díváš obráceně, od ${a.gen}. Jak se změní směr, když se otočíš?`,
        `Při pohledu zpátky se otočíš o půl kruhu. Sever se tím vymění za jih a východ za západ; u vedlejší strany se vymění obě části jejího názvu. Použij to na dvojici ${a.nom} a ${b.nom}.`,
      ],
      explanation: `Opačný směr převrací obě části: sever ↔ jih a východ ↔ západ. Když ${a.nom} leží ${zadany} od ${b.gen}, leží ${b.nom} ${smer([-dx, -dy]).adv} od ${a.gen}.`,
    },
  );
}

const KROK = (km: number, v: Vec) => `${km} km ${smer(v).na}`;

function l3DvaKroky(): PracticeTask | null {
  const s = pick(START);
  const km = pick([1, 2, 3, 4, 5]);
  // Dva kolmé úseky stejné délky → vedlejší strana.
  const svisly: Vec = [0, pick([1, -1])];
  const vodor: Vec = [pick([1, -1]), 0];
  const [k1, k2] = Math.random() < 0.5 ? [svisly, vodor] : [vodor, svisly];
  const cil: Vec = [k1[0] + k2[0], k1[1] + k2[1]];
  return choice(
    `Od ${s.gen} jdeš ${KROK(km, k1)} a potom ${KROK(km, k2)}. Kde jsi teď vzhledem ${s.kDat}?`,
    smer(cil).adv,
    [
      { value: smer([-cil[0], cil[1]]).adv, why: FB_VZ },
      { value: smer([-cil[0], -cil[1]]).adv, why: "To je opačný směr — tak leží výchozí místo vzhledem k tobě. Ptáme se obráceně: kde jsi ty vzhledem k výchozímu místu." },
      { value: smer(k2).adv, why: "Počítal jsi jen druhý úsek. Oba úseky jsou stejně dlouhé a kolmé na sebe, takže výsledný směr je šikmý — vedlejší světová strana." },
    ],
    {
      hints: [
        `Nakresli si cestu od ${s.gen} na papír se severem nahoře: dva úseky po ${km} km. Kde skončíš?`,
        `Oba úseky jsou stejně dlouhé a svírají pravý úhel, takže cíl leží šikmo od výchozího místa. Název vedlejší strany slož z obou směrů cesty, nejdřív sever nebo jih, pak východ nebo západ. Tak určíš polohu vzhledem ${s.kDat}.`,
      ],
      explanation: `Cesta vede ${KROK(km, k1)} a ${KROK(km, k2)}. Oba úseky jsou stejně dlouhé a kolmé, takže jsi šikmo od výchozího místa: ${smer(cil).adv} od ${s.gen}.`,
    },
  );
}

function l3TriKroky(): PracticeTask | null {
  const s = pick(START);
  const km = pick([1, 2, 3, 4]);
  const km2 = pick([1, 2, 3, 4, 5]);
  const svisly: Vec = [0, pick([1, -1])];
  const vodor: Vec = [pick([1, -1]), 0];
  const [k1, k2] = Math.random() < 0.5 ? [svisly, vodor] : [vodor, svisly];
  const k3: Vec = [-k1[0], -k1[1]];
  return choice(
    `Od ${s.gen} jdeš ${KROK(km, k1)}, potom ${KROK(km2, k2)} a nakonec ${KROK(km, k3)}. Kde jsi teď vzhledem ${s.kDat}?`,
    smer(k2).adv,
    [
      { value: smer([k1[0] + k2[0], k1[1] + k2[1]]).adv, why: "Zapomněl jsi na poslední úsek. Vede opačně než první a je stejně dlouhý, takže první úsek zruší." },
      { value: smer([k2[0] + k3[0], k2[1] + k3[1]]).adv, why: "Počítal jsi jen poslední dva úseky. První a poslední úsek vedou proti sobě a jsou stejně dlouhé, proto se navzájem zruší." },
      { value: smer([-k2[0], -k2[1]]).adv, why: "To je opačný směr, než vede prostřední úsek. Tak bys stál, kdybys ho šel obráceně." },
    ],
    {
      hints: [
        `Nakresli si všechny tři úseky od ${s.gen} na papír se severem nahoře. Které dva z nich vedou proti sobě?`,
        `Úseky stejně dlouhé a opačně orientované se navzájem ruší — jako bys šel tam a zase zpátky. Po jejich zrušení zbude jediný úsek a ten určí, kde jsi vzhledem ${s.kDat}.`,
      ],
      explanation: `První úsek (${KROK(km, k1)}) a poslední (${KROK(km, k3)}) jsou stejně dlouhé a vedou proti sobě, takže se zruší. Zbude prostřední úsek (${KROK(km2, k2)}), proto jsi ${smer(k2).adv} od ${s.gen}.`,
    },
  );
}

/** Hlavní strany jako úhel po směru hodinových ručiček od severu. */
const HLAVNI: Record<number, Vec> = { 0: [0, 1], 90: [1, 0], 180: [0, -1], 270: [-1, 0] };
const SLUNCE_POLOHA: { rel: number; text: string }[] = [
  { rel: 0, text: "přímo před sebou" },
  { rel: 90, text: "po pravé ruce" },
  { rel: 180, text: "přímo za zády" },
  { rel: 270, text: "po levé ruce" },
];
/**
 * `co` je vedlejší věta tázací do nápovědy („zjisti, kam ukazuje pravá ruka“),
 * `zaver` oznamovací podmět s přísudkem do vysvětlení („tvoje pravá ruka
 * ukazuje na sever“). Dosazovat `co` do vysvětlení dává nevětnou konstrukci
 * („Proto kam ukazuje pravá ruka: na sever.“), proto jsou pole dvě.
 */
const DOTAZ: { rel: number; text: string; co: string; zaver: string }[] = [
  { rel: 0, text: "Kterým směrem se díváš?", co: "kam se díváš", zaver: "se díváš" },
  { rel: 90, text: "Kterým směrem ukazuje tvoje pravá ruka, když ji upažíš?", co: "kam ukazuje pravá ruka", zaver: "tvoje pravá ruka ukazuje" },
  { rel: 180, text: "Kterým směrem se díváš, když se otočíš čelem vzad?", co: "kam se díváš po otočení čelem vzad", zaver: "se po otočení čelem vzad díváš" },
  { rel: 270, text: "Kterým směrem ukazuje tvoje levá ruka, když ji upažíš?", co: "kam ukazuje levá ruka", zaver: "tvoje levá ruka ukazuje" },
];
const KDE = ["na louce", "na vrcholu kopce", "na rozcestí v lese", "na hřišti"];

function l3Slunce(): PracticeTask | null {
  const sl = pick(SLUNCE_POLOHA);
  const dotaz = pick(DOTAZ.filter((d) => d.rel !== sl.rel));
  const kde = pick(KDE);
  const pohled = (180 - sl.rel + 360) % 360;
  const klic = (pohled + dotaz.rel) % 360;
  const na = (uhel: number) => smer(HLAVNI[(uhel + 360) % 360]).na;
  const bocni = dotaz.rel === 90 || dotaz.rel === 270;
  return choice(
    `Je pravé poledne a stojíš ${kde} tak, že Slunce máš ${sl.text}. ${dotaz.text}`,
    na(klic),
    [
      {
        value: na(klic + 180),
        why: bocni
          ? "Prohodil sis levou a pravou ruku. Levá ruka míří o čtvrt otáčky proti směru hodinových ručiček od toho, kam se díváš, pravá o čtvrt otáčky po směru."
          : "Počítal jsi, jako by Slunce bylo v poledne na severu. U nás je v poledne na jihu.",
      },
      { value: na(klic + 90), why: "Počítal jsi, jako by Slunce bylo v poledne na západě. Tam zapadá večer, v poledne je u nás na jihu." },
      { value: na(klic + 270), why: "Počítal jsi, jako by Slunce bylo v poledne na východě. Tam vychází ráno, v poledne je u nás na jihu." },
    ],
    {
      hints: [
        `Slunce máš ${sl.text}. Nejdřív si vzpomeň, kde je u nás Slunce v poledne, a z toho urči, kam se díváš. Pak zjisti, ${dotaz.co}.`,
        `Světové strany jdou po směru hodinových ručiček: sever, východ, jih, západ. Pravá ruka míří o čtvrt otáčky po směru hodinových ručiček od směru pohledu, levá o čtvrt otáčky proti němu a záda o půl otáčky. Tak zjistíš, ${dotaz.co}.`,
      ],
      explanation:
        dotaz.rel === 0
          ? `V poledne je u nás Slunce na jihu. Když ho máš ${sl.text}, díváš se ${na(pohled)}.`
          : `V poledne je u nás Slunce na jihu. Když ho máš ${sl.text}, díváš se ${na(pohled)}. Proto ${dotaz.zaver} ${na(klic)}.`,
    },
  );
}

const SVAHY: { adj: string; v: Vec }[] = [
  { adj: "severním", v: [0, 1] },
  { adj: "jižním", v: [0, -1] },
  { adj: "východním", v: [1, 0] },
  { adj: "západním", v: [-1, 0] },
];
const KOPCE = ["Liščí vrch", "Holý vrch", "Jelení vrch", "Kamenný vrch"];

function l3Vrstevnice(): PracticeTask | null {
  const kopec = pick(KOPCE);
  const osa = pick([[0, 1], [2, 3]]);
  const [husty, ridky] = shuffle(osa).map((i) => SVAHY[i]);
  const zadani = `${kopec} má na mapě vrstevnice na ${husty.adj} svahu hustě u sebe, na ${ridky.adj} svahu daleko od sebe.`;
  const hints: [string, string] = [
    `Porovnej, jak daleko od sebe jsou vrstevnice na obou svazích kopce ${kopec}. Co znamená, když jsou blízko u sebe?`,
    "Mezi dvěma sousedními vrstevnicemi je vždy stejný výškový rozdíl. Jsou-li u sebe blízko, nastoupáš tu výšku na krátké vzdálenosti, a svah je tedy strmý. Jsou-li daleko, stoupáš pozvolna.",
  ];
  // Jen přenosové formulace. Holé „na kterém svahu je kopec prudší?“ je týž
  // jediný fakt jako položka o hustých vrstevnicích v BANKA_L1 — na L3 patří
  // úloha, kde si žák musí situaci („co nejmírnější dráha“, „nejstrmější
  // skály“) nejdřív přeložit na hustotu vrstevnic.
  const mirny = Math.random() < 0.5;
  if (mirny) {
    return choice(
      `${zadani} Po kterém svahu povede sáňkařská dráha pro malé děti, aby byla co nejmírnější?`,
      `po ${ridky.adj} svahu, vrstevnice jsou tam řidší`,
      [
        { value: `po ${husty.adj} svahu, vrstevnice jsou tam hustší`, why: "Husté vrstevnice znamenají prudký svah, ne mírný: výška tam přibývá na krátké vzdálenosti." },
        { value: `po ${husty.adj} svahu, cesta tam bude kratší`, why: "Po svahu s hustými vrstevnicemi je cesta sice kratší, ale mnohem strmější." },
        { value: "po obou svazích stejně, vrchol je jen jeden", why: "Vrchol je stejně vysoký, ale na svahu s hustými vrstevnicemi tu výšku nastoupáš na kratší vzdálenosti, takže je prudší." },
      ],
      {
        hints,
        explanation: `Řídké vrstevnice znamenají mírný svah, husté prudký. Mírnější je proto ${ridky.adj.replace(/m$/, "")} svah.`,
      },
    );
  }
  return choice(
    `${zadani} Na kterém svahu budou horolezci hledat nejstrmější skály?`,
    `na ${husty.adj} svahu, vrstevnice jsou tam hustší`,
    [
      { value: `na ${ridky.adj} svahu, vrstevnice jsou tam řidší`, why: "Řídké vrstevnice znamenají, že výška přibývá pomalu. Takový svah je mírný, ne prudký." },
      { value: `na ${ridky.adj} svahu, cesta tam bude delší`, why: "Delší cesta na vrchol neznamená prudší svah — naopak, výška se rozloží na delší vzdálenost." },
      { value: "na obou svazích stejně, vrchol je jen jeden", why: "Vrchol je stejně vysoký, ale na svahu s hustými vrstevnicemi tu výšku nastoupáš na kratší vzdálenosti, takže je prudší." },
    ],
    {
      hints,
      explanation: `Husté vrstevnice znamenají prudký svah: výška přibývá na krátké vzdálenosti. Prudší je proto ${husty.adj.replace(/m$/, "")} svah.`,
    },
  );
}

const CAST_MAPY: Record<string, string> = {
  "0,1": "v horní části",
  "1,1": "v pravém horním rohu",
  "1,0": "v pravé části",
  "1,-1": "v pravém dolním rohu",
  "0,-1": "v dolní části",
  "-1,-1": "v levém dolním rohu",
  "-1,0": "v levé části",
  "-1,1": "v levém horním rohu",
};
const cast = (v: Vec) => CAST_MAPY[`${znam(v[0])},${znam(v[1])}`];

function l3Tok(): PracticeTask | null {
  const hory = pick(VEKTORY);
  const niz: Vec = [-hory[0], -hory[1]];
  const voda = pick(["Řeka", "Potok"]);
  const uvod = pick([
    "Na obecně zeměpisné mapě v atlase je sever nahoře.",
    "Máš před sebou obecně zeměpisnou mapu se severem nahoře.",
  ]);
  return choice(
    `${uvod} ${velke(cast(hory))} mapy je území vybarvené tmavě hnědě, ${cast(niz)} zeleně. ${voda} (modrá čára) spojuje obě území. Kterým směrem teče?`,
    smer(niz).k,
    posunDistraktory(
      niz,
      (s) => s.k,
      "Voda by tekla do kopce. Hnědá barva znamená vyšší polohy, zelená nížiny — a voda teče z výšky dolů.",
    ),
    {
      hints: [
        `Tmavě hnědé území je ${cast(hory)} mapy, zelené ${cast(niz)}. Které z nich leží výš? A kam teče voda?`,
        "Na obecně zeměpisné mapě znamená hnědá vyšší polohy a zelená nížiny. Voda teče z vyšších míst do nižších. Posun po mapě pak převeď na světové strany: nahoře sever, vpravo východ, dole jih, vlevo západ.",
      ],
      explanation: `Hnědá barva znamená hory, zelená nížinu. Voda teče z hor do nížiny, tedy z území ${cast(hory)} mapy do území ${cast(niz)} — to je ${smer(niz).k}.`,
    },
  );
}

const SABLONY_L3 = [l3Inverze, l3Slunce, l3DvaKroky, l3Vrstevnice, l3Tok, l3TriKroky];

/** Rotace s náhodným začátkem: v jedné sadě se šablona neopakuje, mezi sezeními se sada liší. */
function rotace<T>(seznam: T[]): () => T {
  let i = Math.floor(Math.random() * seznam.length);
  return () => seznam[i++ % seznam.length];
}

function gen(level: number): PracticeTask[] {
  if (level === 1) {
    const dalsi = rotace(BANKA_L1);
    return ruzneUlohy(() => losUlohy(() => uloha(dalsi())));
  }
  const dalsi = rotace(level === 2 ? SABLONY_L2 : SABLONY_L3);
  return ruzneUlohy(() => losUlohy(() => dalsi()()));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const MAPOVE_ZNACKY_ORIENTACE: TopicMetadata[] = [
  {
    id: "g6-zem-mapove-znacky-orientace-6",
    rvpNodeId:
      "g6-zemepis-geograficke-informace-zdroje-dat-kartogr-mapa-a-globus-mapove-znacky-orientace-na-mape",
    displayName: "Mapové značky a světové strany",
    title: "Mapové značky, orientace na mapě",
    studentTitle: "Mapové značky a světové strany",
    subject: "zemepis",
    category: "Geografické informace, zdroje dat, kartografie",
    topic: "Mapa a glóbus",
    briefDescription: "Přečteš značky na mapě a určíš směr mezi dvěma místy.",
    keywords: [
      "mapa", "mapové značky", "legenda", "vrstevnice", "kóta", "světové strany",
      "sever", "jih", "východ", "západ", "vedlejší světové strany", "buzola", "kompas",
      "orientace", "zorientovat mapu",
    ],
    goals: [
      "Poznat podle popisu, co mapová značka znamená.",
      "Určit směr mezi dvěma místy na mapě včetně vedlejších světových stran.",
      "Převrátit směr, složit cestu z více úseků a zorientovat se podle poledního Slunce a vrstevnic.",
    ],
    boundaries: [
      "Mapy se popisují slovy, žádné obrázky.",
      "Sever je na mapě vždy nahoře.",
      "Jen osm světových stran (hlavní a vedlejší), bez azimutu ve stupních.",
      "Šikmé posuny mají stejně dlouhé obě části, aby byl směr jednoznačný.",
      "Obce u potoka leží přímo proti sobě přes potok — zadání to říká výslovně, aby byl směr jednoznačný.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Na mapě je sever nahoře, jih dole, východ vpravo a západ vlevo. Šikmý posun dává vedlejší stranu (severovýchod…). Opačný směr převrací obě části.",
      steps: [
        "Urči, kterým směrem se na mapě posouváš (nahoru, dolů, doleva, doprava, šikmo).",
        "Převeď posun na světovou stranu: nahoře sever, vpravo východ, dole jih, vlevo západ.",
        "U šikmého posunu spoj obě strany do jednoho názvu, nejdřív sever nebo jih.",
      ],
      commonMistake: "Prohodit východ a západ, nebo u opačného směru převrátit jen jednu část vedlejší strany.",
      example: "Hájovna leží severovýchodně od mlýna → mlýn leží jihozápadně od hájovny.",
    },
  },
];
