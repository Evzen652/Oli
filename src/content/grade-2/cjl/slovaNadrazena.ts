import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Přepsáno 2026-09-11 (inventura obsahu): původní banky měly po 8 úlohách,
// jednu nápovědu a žádnou zpětnou vazbu u chybných možností. Teď tři oddělené
// banky; chybné možnosti jsou typické záměny (slovo ze zadání místo jména
// skupiny, sousední skupina, věc, která se skupinou jen souvisí — místo,
// materiál, část).
//   L1 rozpoznání: nadřazené slovo ke třem podřazeným
//   L2 aplikace:   obráceně — podřazené slovo k nadřazenému (pasti: místo, materiál, část)
//   L3 transfer:   vztah dvou slov (nadřazené / podřazené / souřadné) a souřadné slovo
//                  (dva kroky: najdi skupinu, pak jejího dalšího člena)

type Chybna = [string, string];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const dis = (d: Chybna[]) => d.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];

// ── L1: tři podřazená slova → nadřazené ──────────────────────────────────
interface Skupina {
  slova: [string, string, string];
  a: string;
  /** Chybná možnost, která je jedním ze slov zadání (podřazené místo nadřazeného). */
  clen: string;
  d: [Chybna, Chybna];
  e: string;
}

const POOL_L1: Skupina[] = [
  { slova: ["pes", "kočka", "kráva"], a: "zvíře", clen: "kočka", e: "🐾",
    d: [["pták", "Pes ani kráva nejsou ptáci — nelétají a nemají peří."],
      ["hračka", "Plyšový pes je hračka, ale živý pes, kočka ani kráva hračky nejsou."]] },
  { slova: ["jablko", "hruška", "švestka"], a: "ovoce", clen: "hruška", e: "🍎",
    d: [["zelenina", "Zelenina je třeba mrkev nebo cibule. Jablko ani švestka zelenina nejsou."],
      ["strom", "Ovoce roste na stromě, ale jablko samo strom není."]] },
  { slova: ["mrkev", "cibule", "brambora"], a: "zelenina", clen: "cibule", e: "🥕",
    d: [["ovoce", "Ovoce je sladké a roste hlavně na stromech a keřích. Mrkev ani brambora ovoce nejsou."],
      ["záhon", "Zelenina roste na záhonu, ale mrkev není záhon."]] },
  { slova: ["stůl", "židle", "skříň"], a: "nábytek", clen: "židle", e: "🪑",
    d: [["dřevo", "Nábytek se často dělá ze dřeva, ale skříň není dřevo — je z něj vyrobená."],
      ["pokoj", "Nábytek stojí v pokoji, ale stůl není pokoj."]] },
  { slova: ["červená", "modrá", "zelená"], a: "barva", clen: "modrá", e: "🎨",
    d: [["pastelka", "Pastelkou barvy kreslíš, ale červená není pastelka."],
      ["duha", "Duha má mnoho barev, ale zelená sama duha není."]] },
  { slova: ["tričko", "svetr", "sukně"], a: "oblečení", clen: "svetr", e: "👕",
    d: [["boty", "Boty si taky obouváš, ale tričko ani sukně boty nejsou."],
      ["skříň", "Oblečení se ukládá do skříně, ale svetr není skříň."]] },
  { slova: ["vrabec", "kos", "čáp"], a: "pták", clen: "čáp", e: "🐦",
    d: [["ryba", "Ryby žijí ve vodě a nemají peří. Vrabec ani kos ryby nejsou."],
      ["hnízdo", "Ptáci si stavějí hnízda, ale kos není hnízdo."]] },
  { slova: ["kapr", "štika", "pstruh"], a: "ryba", clen: "štika", e: "🐟",
    d: [["rybník", "V rybníku ryby žijí, ale kapr není rybník."],
      ["rak", "Rak žije ve vodě, ale ryba to není — a kapr ani pstruh raci nejsou."]] },
  { slova: ["kytara", "buben", "klavír"], a: "hudební nástroj", clen: "buben", e: "🎸",
    d: [["písnička", "Na nástroj zahraješ písničku, ale kytara není písnička."],
      ["muzikant", "Muzikant na nástroj hraje, ale klavír není muzikant."]] },
  { slova: ["pondělí", "středa", "pátek"], a: "den v týdnu", clen: "středa", e: "📅",
    d: [["měsíc", "Měsíce jsou leden, únor, březen… Pondělí ani pátek měsíce nejsou."],
      ["víkend", "Víkend je jen sobota a neděle. Pondělí, středa ani pátek do víkendu nepatří."]] },
  { slova: ["leden", "květen", "říjen"], a: "měsíc", clen: "květen", e: "📆",
    d: [["roční období", "Roční období jsou jaro, léto, podzim a zima. Leden ani říjen roční období nejsou."],
      ["kalendář", "V kalendáři měsíce najdeš, ale leden není kalendář."]] },
  { slova: ["růže", "tulipán", "sedmikráska"], a: "květina", clen: "tulipán", e: "🌷",
    d: [["strom", "Strom má kmen a větve. Růže ani sedmikráska stromy nejsou."],
      ["zahrada", "Květiny rostou na zahradě, ale růže není zahrada."]] },
  { slova: ["dub", "buk", "smrk"], a: "strom", clen: "buk", e: "🌳",
    d: [["les", "Les je místo, kde roste mnoho stromů. Dub sám les není."],
      ["dřevo", "Ze stromu se dělá dřevo, ale smrk v lese je živá rostlina, ne dřevo."]] },
  { slova: ["auto", "autobus", "vlak"], a: "dopravní prostředek", clen: "vlak", e: "🚌",
    d: [["silnice", "Po silnici auta jezdí, ale autobus není silnice — a vlak jezdí po kolejích."],
      ["jízdní řád", "Jízdní řád říká, kdy autobus nebo vlak jede, ale sám nikoho neodveze."]] },
  { slova: ["kladivo", "pila", "šroubovák"], a: "nářadí", clen: "pila", e: "🔨",
    d: [["dílna", "Nářadí se ukládá v dílně, ale kladivo není dílna."],
      ["hřebík", "Hřebík se zatlouká kladivem, ale pila ani šroubovák hřebíky nejsou."]] },
];

function nadrazene(r: Skupina): PracticeTask {
  const [x, y, z] = r.slova;
  return {
    ...choice(`Které slovo je nadřazené slovům „${x}“, „${y}“, „${z}“?`, r.a, dis([
      [r.clen, `${cap(r.clen)} je jen jedno ze slov v zadání — je podřazené. Nadřazené slovo musí sedět na všechna tři.`],
      ...r.d,
    ]), {
      hints: [
        `Co mají ${x}, ${y} a ${z} společného? Jakou skupinu tvoří?`,
        `Nadřazené slovo je jméno celé skupiny. Zkus doplnit stejné slovo do vět „${cap(x)} je …“, „${cap(y)} je …“ a „${cap(z)} je …“. Slovo ze zadání to být nemůže, to je jen jeden člen skupiny.`,
      ],
      explanation: `${cap(x)} je ${r.a}, ${y} je ${r.a} a ${z} je ${r.a} — slovo „${r.a}“ sedí na všechna tři. Je to jméno celé skupiny, a proto je nadřazené.`,
    }),
    emoji: r.e,
  };
}

// ── L2: nadřazené → podřazené (pasti: místo, materiál, část, sousední skupina) ──
interface Clen {
  g: string;
  a: string;
  /** Velká nápověda — konkrétní pasti této úlohy, bez prozrazení odpovědi. */
  h1: string;
  d: [Chybna, Chybna, Chybna];
  e: string;
}

const POOL_L2: Clen[] = [
  { g: "nábytek", a: "skříň", e: "🛋️",
    h1: "Nábytek stojí v domě a vyrábí se třeba ze dřeva — ale dům ani dřevo nábytkem nejsou. Hledej věc, do které si uklidíš oblečení.",
    d: [["dům", "Nábytek stojí v domě, ale dům sám nábytek není — je to stavba."],
      ["dřevo", "Ze dřeva se nábytek vyrábí, ale dřevo samo je materiál, ne nábytek."],
      ["hrnek", "Hrnek je nádobí, ne nábytek."]] },
  { g: "ovoce", a: "meruňka", e: "🍑",
    h1: "Ovoce roste na stromech a vaří se z něj džem — strom ani džem ale ovocem nejsou. Hledej sladký plod, který se trhá ze stromu.",
    d: [["strom", "Ovoce na stromech roste, ale strom sám ovoce není."],
      ["mrkev", "Mrkev je zelenina, ne ovoce."],
      ["džem", "Džem se z ovoce vaří, ale sám je to jídlo ve sklenici, ne ovoce."]] },
  { g: "zelenina", a: "okurka", e: "🥒",
    h1: "Zelenina roste na záhonu a vaří se z ní polévka — záhon ani polévka ale zeleninou nejsou. Pozor i na sladké plody, ty patří k ovoci.",
    d: [["záhon", "Na záhonu zelenina roste, ale záhon je kus zahrady, ne zelenina."],
      ["jahoda", "Jahoda je sladká a patří mezi ovoce."],
      ["polévka", "Polévka se ze zeleniny vaří, ale je to hotové jídlo, ne zelenina."]] },
  { g: "zvíře", a: "liška", e: "🦊",
    h1: "Zvíře žije třeba v lese a má na těle srst — místo ani část těla ale zvířetem nejsou. A člověk, který se o les stará, taky ne. Hledej divokého tvora.",
    d: [["les", "V lese zvířata žijí, ale les je místo, ne zvíře."],
      ["srst", "Srst má zvíře na těle, je to jen jeho část."],
      ["myslivec", "Myslivec se o zvířata v lese stará, ale je to člověk."]] },
  { g: "pták", a: "sýkora", e: "🐤",
    h1: "Ptáci mají peří a staví si hnízda, ale hnízdo ani pírko ptákem nejsou. Pozor: létat umí i hmyz. Pták má zobák a peří.",
    d: [["hnízdo", "Hnízdo si pták staví, ale hnízdo samo pták není."],
      ["pírko", "Pírko je jen část ptačího těla."],
      ["motýl", "Motýl sice létá, ale je to hmyz — nemá peří ani zobák."]] },
  { g: "oblečení", a: "svetr", e: "🧥",
    h1: "Oblečení se šije z látky, věší na ramínko a pere v pračce — nic z toho si ale neoblékneš. Hledej věc, kterou si můžeš obléct.",
    d: [["ramínko", "Na ramínko se oblečení věší, ale ramínko si neoblékneš."],
      ["látka", "Z látky se oblečení šije, ale látka sama je materiál."],
      ["pračka", "V pračce se oblečení pere, ale pračka je spotřebič."]] },
  { g: "barva", a: "fialová", e: "🖌️",
    h1: "Barvy se nanášejí štětcem nebo pastelkou a vznikne z nich obraz — to jsou ale věci. Hledej slovo, které je samo jménem barvy, jako když říkáš, jaké máš tričko.",
    d: [["štětec", "Štětcem barvu naneseš na papír, ale štětec je nástroj."],
      ["obraz", "Obraz je namalovaný barvami, ale sám barvou není."],
      ["pastelka", "Pastelkou kreslíš, ale pastelka je věc, ne barva."]] },
  { g: "hračka", a: "panenka", e: "🧸",
    h1: "Hračky se kupují v obchodě, ukládají do krabice a hraje si s nimi dítě — nic z toho ale hračkou není. Hledej věc, se kterou si hraješ.",
    d: [["krabice", "Do krabice se hračky ukládají, ale krabice sama hračka není."],
      ["dítě", "Dítě si s hračkami hraje, ale dítě hračka není."],
      ["obchod", "V obchodě se hračky kupují, ale obchod je místo."]] },
  { g: "dopravní prostředek", a: "tramvaj", e: "🚋",
    h1: "Dopravní prostředek jezdí po kolejích nebo silnici, staví na zastávce a řídí ho řidič — to ale nejsou dopravní prostředky. Hledej to, čím se dá někam jet.",
    d: [["koleje", "Po kolejích jezdí vlak i tramvaj, ale koleje samy nikoho neodvezou."],
      ["zastávka", "Na zastávce se nastupuje, ale zastávka se nehýbe."],
      ["řidič", "Řidič dopravní prostředek řídí, ale sám je člověk."]] },
  { g: "hudební nástroj", a: "flétna", e: "🎶",
    h1: "Na nástroj se hrají písničky podle not a vedle muzikanta někdy zpívá zpěvák — to ale nástroje nejsou. Hledej věc, do které foukáš, brnkáš na ni nebo do ní bubnuješ.",
    d: [["písnička", "Písnička se na nástroj hraje, ale je to hudba, ne nástroj."],
      ["nota", "Nota je značka na papíře, podle které se hraje."],
      ["zpěvák", "Zpěvák zpívá hlasem — je to člověk, ne nástroj."]] },
  { g: "květina", a: "pampeliška", e: "🌼",
    h1: "Květiny rostou na louce, mají listy a létají na ně včely — louka, list ani včela ale květinou nejsou. Hledej rostlinu, která kvete.",
    d: [["louka", "Na louce květiny rostou, ale louka je místo."],
      ["list", "List je jen část rostliny."],
      ["včela", "Včela na květiny létá pro nektar, ale je to hmyz."]] },
  { g: "strom", a: "bříza", e: "🌲",
    h1: "Strom má větve a mnoho stromů tvoří les — větev ani les ale nejsou jeden strom. Pozor i na keř: strom má jeden silný kmen.",
    d: [["větev", "Větev je jen část stromu."],
      ["les", "Les je mnoho stromů pohromadě, ne jeden strom."],
      ["keř", "Keř je taky rostlina, ale nemá jeden silný kmen jako strom."]] },
  { g: "nádobí", a: "talíř", e: "🍽️",
    h1: "Nádobí najdeš v kuchyni vedle ledničky a jí se z něj třeba polévka — nic z toho ale nádobí není. Hledej věc, ze které se jí nebo pije.",
    d: [["kuchyň", "V kuchyni se nádobí používá, ale kuchyň je místnost."],
      ["polévka", "Polévka se jí z nádobí, ale sama je jídlo."],
      ["lednička", "Lednička je spotřebič, který chladí jídlo. Nádobí to není."]] },
  { g: "roční období", a: "podzim", e: "🍂",
    h1: "Pozor na měsíce: jsou kratší než roční období a patří do nich. Roční období jsou jen čtyři a každé trvá asi tři měsíce. Počasí se mění každý den.",
    d: [["listopad", "Listopad je měsíc. Je sice na podzim, ale měsíc není roční období."],
      ["deštník", "Deštník se hodí v každém ročním období, když prší. Je to věc."],
      ["počasí", "Počasí je to, jestli prší nebo svítí slunce. Roční období to není."]] },
  { g: "ryba", a: "sumec", e: "🐠",
    h1: "Ryby žijí v rybníku a mají ploutve — rybník ani ploutev ale rybou nejsou. Pozor i na zvířata, která jen žijí u vody.",
    d: [["rybník", "V rybníku ryby žijí, ale rybník je místo."],
      ["ploutev", "Ploutev je jen část rybího těla."],
      ["žába", "Žába žije u vody, ale ryba to není — má nohy a skáče."]] },
];

function podrazene(r: Clen): PracticeTask {
  return {
    ...choice(`Které slovo je podřazené slovu „${r.g}“?`, r.a, dis(r.d), {
      hints: [`Řekni o každé možnosti větu „… je ${r.g}.“ U kterého slova je pravdivá?`, r.h1],
      explanation: `Platí věta „${cap(r.a)} je ${r.g}.“ ${cap(r.a)} tedy patří do skupiny „${r.g}“ jako jeden její člen — je to slovo podřazené. U ostatních možností tahle věta neplatí.`,
    }),
    emoji: r.e,
  };
}

// ── L3a: vztah dvou slov ─────────────────────────────────────────────────
interface Dvojice {
  A: string;
  B: string;
  /** Které slovo je nadřazené; "sour" = obě jsou souřadná. */
  rel: "A" | "B" | "sour";
  /** Společná skupina u souřadných slov. */
  g?: string;
  e: string;
}

const POOL_VZTAH: Dvojice[] = [
  { A: "tulipán", B: "květina", rel: "B", e: "🌷" },
  { A: "zvíře", B: "medvěd", rel: "A", e: "🐻" },
  { A: "jablko", B: "hruška", rel: "sour", g: "ovoce", e: "🍐" },
  { A: "ovoce", B: "švestka", rel: "A", e: "🫐" },
  { A: "židle", B: "stůl", rel: "sour", g: "nábytek", e: "🪑" },
  { A: "čáp", B: "pták", rel: "B", e: "🦩" },
  { A: "kytara", B: "buben", rel: "sour", g: "hudební nástroj", e: "🥁" },
  // Barvy sem nepatří: věta „Barva je žlutá.“ je gramaticky i věcně v pořádku
  // (barva může být žlutá), takže by test „X je Y“ mátl.
  { A: "hračka", B: "panenka", rel: "A", e: "🪆" },
];

function vztah(r: Dvojice): PracticeTask {
  const { A, B } = r;
  const optA = `„${A}“ je nadřazené slovo`;
  const optB = `„${B}“ je nadřazené slovo`;
  const optS = "Obě slova jsou souřadná";
  const optO = "Slova mají opačný význam";
  const hyper = r.rel === "A" ? A : B;
  const hypo = r.rel === "A" ? B : A;
  const correct = r.rel === "A" ? optA : r.rel === "B" ? optB : optS;

  const whyNad = (x: string, y: string) =>
    r.rel === "sour"
      ? `„${x}“ není celá skupina — ${x} i ${y} patří do skupiny „${r.g}“.`
      : `Obráceně. ${cap(x)} je jen jeden druh — platí věta „${cap(x)} je ${y}.“, takže „${x}“ je podřazené.`;
  const all: Chybna[] = [
    [optA, whyNad(A, B)],
    [optB, whyNad(B, A)],
    [optS, `Souřadná slova stojí vedle sebe ve stejné skupině. Tady je ale jedno slovo skupinou pro druhé: ${hypo} patří pod slovo „${hyper}“.`],
    [optO, `${cap(A)} a ${B} nejsou protiklady — opak by znamenal pravý protiklad, jako den a noc. Tady jde o to, co kam patří.`],
  ];

  return {
    ...choice(`Jaký vztah mají slova „${A}“ a „${B}“?`, correct, dis(all.filter(([v]) => v !== correct)), {
      hints: [
        `Zkus obě věty: „${cap(A)} je ${B}.“ a „${cap(B)} je ${A}.“ Která z nich platí?`,
        `Nadřazené je vždy obecnější z obou — jméno skupiny, do které to druhé patří. Rozmysli, jestli „${A}“ patří do skupiny „${B}“, nebo naopak. Když neplatí ani jedno, hledej skupinu, kam by patřila obě.`,
      ],
      explanation: r.rel === "sour"
        ? `Ani jedno slovo není skupinou pro druhé: věta „${cap(A)} je ${B}.“ neplatí a obráceně také ne. ${cap(A)} i ${B} patří do stejné skupiny „${r.g}“ — stojí vedle sebe, a proto jsou souřadná.`
        : `„${cap(hyper)}“ je obecnější slovo — jméno skupiny. Platí věta „${cap(hypo)} je ${hyper}.“, obráceně ne. Proto je „${hyper}“ nadřazené a „${hypo}“ podřazené.`,
    }),
    emoji: r.e,
  };
}

// ── L3b: souřadné slovo (najdi skupinu, pak dalšího člena) ─────────────────
interface Soused {
  w: string;
  a: string;
  g: string;
  d: [Chybna, Chybna];
  e: string;
}

const POOL_SOURADNE: Soused[] = [
  { w: "kapr", a: "štika", g: "ryba", e: "🐟",
    d: [["rybník", "V rybníku kapr žije, ale rybník je místo, ne ryba."],
      ["žába", "Žába žije ve vodě jako kapr, ale ryba to není."]] },
  { w: "mrkev", a: "petržel", g: "zelenina", e: "🥕",
    d: [["záhon", "Na záhonu mrkev roste, ale záhon není zelenina."],
      ["jahoda", "Jahoda je ovoce — patří do jiné skupiny než mrkev."]] },
  { w: "vrabec", a: "kos", g: "pták", e: "🐦",
    d: [["hnízdo", "Hnízdo si vrabec staví, ale hnízdo není pták."],
      ["netopýr", "Netopýr sice létá, ale není to pták — nemá peří."]] },
  { w: "růže", a: "fialka", g: "květina", e: "🌹",
    d: [["trn", "Trn je jen část růže."],
      ["keř", "Růže často roste na keři, ale keř není květina."]] },
  { w: "pondělí", a: "čtvrtek", g: "den v týdnu", e: "📅",
    d: [["týden", "Týden je celých sedm dní, ne jeden den."],
      ["květen", "Květen je měsíc — patří do jiné skupiny než pondělí."]] },
  { w: "autobus", a: "vlak", g: "dopravní prostředek", e: "🚆",
    d: [["nádraží", "Na nádraží autobusy přijíždějí, ale nádraží je místo."],
      ["řidič", "Řidič autobus řídí, ale sám je člověk."]] },
  { w: "kladivo", a: "pila", g: "nářadí", e: "🪚",
    d: [["hřebík", "Hřebík se kladivem zatlouká, ale hřebík není nářadí."],
      ["dílna", "V dílně se nářadí ukládá, ale dílna je místnost."]] },
  { w: "svetr", a: "bunda", g: "oblečení", e: "🧶",
    d: [["knoflík", "Knoflík je jen část oblečení."],
      ["vlna", "Z vlny se svetr plete, ale vlna je materiál."]] },
  { w: "modrá", a: "oranžová", g: "barva", e: "🔵",
    d: [["obloha", "Obloha bývá modrá, ale obloha není barva."],
      ["pastelka", "Pastelkou barvu nakreslíš, ale pastelka je věc."]] },
];

function souradne(r: Soused): PracticeTask {
  return {
    ...choice(`Které slovo je souřadné se slovem „${r.w}“?`, r.a, dis([
      [r.g, `„${cap(r.g)}“ je nadřazené slovo — jméno celé skupiny. Souřadné slovo musí stát vedle slova „${r.w}“, ne nad ním.`],
      ...r.d,
    ]), {
      hints: [
        `Nejdřív zjisti, do jaké skupiny patří „${r.w}“. Pak hledej jiného člena té skupiny.`,
        `„${cap(r.w)}“ patří do skupiny „${r.g}“. Souřadné slovo je další člen této skupiny — ne skupina sama a ne věc, která s ní jen souvisí (místo, část, materiál).`,
      ],
      explanation: `${cap(r.w)} je ${r.g} a ${r.a} je také ${r.g}. Obě slova patří do stejné skupiny a stojí vedle sebe na stejné úrovni, a proto jsou souřadná.`,
    }),
    emoji: r.e,
  };
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(POOL_L1).map(nadrazene);
  if (level === 2) return shuffle(POOL_L2).map(podrazene);
  return shuffle([...POOL_VZTAH.map(vztah), ...POOL_SOURADNE.map(souradne)]);
}

export const SLOVANADRAZENA: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-slovni-zasoba-slova-nadrazena-a-podrazena",
    rvpNodeId: "g2-cjl-jazykova-vychova-slovni-zasoba-slova-nadrazena-a-podrazena",
    title: "Slova nadřazená a podřazená",
    studentTitle: "Co kam patří",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Slovní zásoba",
    briefDescription: "Naučíš se třídit slova do skupin.",
    keywords: ["nadřazené", "podřazené", "souřadné", "zvíře", "ovoce", "barva", "skupina slov"],
    goals: [
      "Rozlišit nadřazené a podřazené slovo.",
      "Přiřadit slova do správné skupiny.",
      "Pochopit, co jsou souřadná slova.",
    ],
    boundaries: ["Pouze základní kategorie 2. třídy.", "Bez víceúrovňového hierarchie."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Nadřazené = zastřešující (zvíře). Podřazené = konkrétní (pes, kočka). Souřadné = na stejné úrovni (pes a kočka).",
      steps: ["Přečti slova.", "Které je obecnější (zastřešující)?", "To je nadřazené; konkrétnější je podřazené."],
      commonMistake: "Záměna nadřazeného a podřazeného — 'zvíře' je nadřazené, 'pes' je podřazené.",
      example: "Zvíře (nadřazené) → pes, kočka, králík (podřazená). Pes a kočka jsou souřadná.",
    },
  },
];
