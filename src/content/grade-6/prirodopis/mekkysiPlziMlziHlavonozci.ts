/**
 * Přírodopis 6. ročník — Měkkýši: plži, mlži, hlavonožci (select_one).
 *
 * Fakta, na kterých se shodují učebnice 6. ročníku (Fraus, Nová škola, SPN):
 * měkkýši mají měkké nečlánkované tělo (hlava, svalnatá noha, útroby, plášť,
 * který vytváří schránku). Plži: jednodílná, obvykle závitá ulita (plzák ji
 * nemá), hlava s tykadly a očima, jazyk se zoubky, suchozemští dýchají plicním
 * vakem, hlemýžď na zimu zavře ulitu víčkem. Mlži: schránka ze dvou misek
 * spojených vazem, bez hlavy, dýchají žábrami, filtrují potravu z vody, a proto
 * potřebují čistou vodu. Hlavonožci: jen mořští, chapadla s přísavkami, dobře
 * vyvinuté oči, dravci, inkoust, pohyb vystřikováním vody; sépie má vnitřní
 * vápenitou schránku (sépiová kost není kost), chobotnice schránku nemá.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • plzák bez ulity „není plž“, je to kroužkovec (sliz = žížala),
 *  • každý živočich se schránkou je plž (slávka, škeble),
 *  • hlavonožci jsou ryby / nejsou měkkýši / sépiová kost je kost,
 *  • záměna funkcí a potravy (mlž loví, hlavonožec spásá řasy, sání krve = pijavka).
 *
 *  • L1 — zapamatování: zástupce → skupina, skupina → zástupce, část těla, typ schránky.
 *  • L2 — použití: popis znaků → skupina, znak → funkce, způsob výživy, společné znaky.
 *  • L3 — přenos: klamavý popis, tvrzení spolužáka, znak ↔ způsob života, důsledek pro prostředí.
 *
 * Šablona se volí na začátku každého losu, generátor nemá stav na úrovni modulu.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

type Skupina = "plzi" | "mlzi" | "hlav";

const NAZEV: Record<Skupina | "krouz", string> = {
  plzi: "plži",
  mlzi: "mlži",
  hlav: "hlavonožci",
  krouz: "kroužkovci",
};
/** 4. pád pro „patří mezi …“. */
const MEZI: Record<Skupina, string> = { plzi: "plže", mlzi: "mlže", hlav: "hlavonožce" };

/** Proč živočich do skupiny NEpatří — obecný znak skupiny. */
const ZNAK_SKUPINY: Record<Skupina | "krouz", string> = {
  plzi: "Plži mají jednodílnou ulitu nebo žádnou a na hlavě nosí tykadla.",
  mlzi: "Mlži mají schránku ze dvou misek spojených vazem a nemají hlavu.",
  hlav: "Hlavonožci žijí jen v moři a na hlavě mají chapadla s přísavkami.",
  krouz: "Kroužkovci jako žížala nejsou měkkýši, jejich tělo je složené z článků.",
};

interface Zastupce {
  name: string;
  /** 2. pád pro „schránka …“. */
  gen: string;
  g: Skupina;
  /** Věta o znacích, začíná jménem s velkým písmenem. */
  znak: string;
  /** Velká nápověda k otázce „Do které skupiny patří …?“. */
  rada: string;
  /** Má vnější schránku, na kterou se dá ptát počtem dílů. */
  schranka: boolean;
}

const ZASTUPCI: Zastupce[] = [
  // plži
  {
    name: "hlemýžď zahradní", gen: "hlemýždě zahradního", g: "plzi", schranka: true,
    znak: "Hlemýžď zahradní má jednodílnou závitou ulitu a hlavu s tykadly.",
    rada: "Hlemýžď nosí na zádech stočenou ulitu z jednoho kusu a z hlavy mu vykukují tykadla. Která skupina má právě tyto znaky?",
  },
  {
    name: "plzák", gen: "plzáka", g: "plzi", schranka: false,
    znak: "Plzák nemá ulitu, ale má měkké nečlánkované tělo, svalnatou nohu a na hlavě tykadla.",
    rada: "Plzák ulitu nemá. Rozhoduj podle toho, jestli má tělo z článků, nebo měkké tělo se svalnatou nohou a tykadly.",
  },
  {
    name: "páskovka", gen: "páskovky", g: "plzi", schranka: true,
    znak: "Páskovka má jednodílnou závitou ulitu s pruhy a hlavu s tykadly.",
    rada: "Páskovka má pruhovanou stočenou ulitu a leze po rostlinách na svalnaté noze. Která skupina se takto pohybuje?",
  },
  {
    name: "plovatka bahenní", gen: "plovatky bahenní", g: "plzi", schranka: true,
    znak: "Plovatka bahenní žije v rybnících, má jednodílnou špičatou ulitu a hlavu s tykadly.",
    rada: "Plovatka žije ve vodě, ale ulitu má špičatou a stočenou do závitů. Je to znak skupiny s hlavou, nebo bez hlavy?",
  },
  {
    name: "okružák", gen: "okružáka", g: "plzi", schranka: true,
    znak: "Okružák žije v rybnících, má jednodílnou ulitu stočenou do ploché spirály a hlavu s tykadly.",
    rada: "Okružák má ulitu stočenou do ploché spirály jako šnek z pečiva. Kolik kusů taková schránka má?",
  },
  // mlži
  {
    name: "škeble rybničná", gen: "škeble rybničné", g: "mlzi", schranka: true,
    znak: "Škeble rybničná má schránku ze dvou misek a nemá hlavu.",
    rada: "Škeble leží v bahně rybníka a její schránka se otevírá jako krabička. Z kolika částí tedy je a má škeble hlavu?",
  },
  {
    name: "velevrub", gen: "velevruba", g: "mlzi", schranka: true,
    znak: "Velevrub žije v řekách, má schránku ze dvou misek a nemá hlavu.",
    rada: "Velevrub žije zahrabaný na dně řeky a pootevírá schránku, aby do ní proudila voda. Která skupina takto žije?",
  },
  {
    name: "slávka jedlá", gen: "slávky jedlé", g: "mlzi", schranka: true,
    znak: "Slávka jedlá je mořský živočich se schránkou ze dvou misek a bez hlavy.",
    rada: "Slávky se prodávají jako mořské plody v tmavých podlouhlých schránkách, které se po uvaření rozevřou. Na kolik částí?",
  },
  {
    name: "ústřice", gen: "ústřice", g: "mlzi", schranka: true,
    znak: "Ústřice přirůstá v moři ke skalám, má schránku ze dvou misek a nemá hlavu.",
    rada: "Ústřice je přirostlá ke skále a za potravou nikam nechodí. Jakou má schránku a potřebuje hlavu s očima?",
  },
  {
    name: "perlorodka říční", gen: "perlorodky říční", g: "mlzi", schranka: true,
    znak: "Perlorodka říční žije v čistých potocích, má schránku ze dvou misek a nemá hlavu.",
    rada: "Perla vzniká uvnitř schránky, když plášť obalí cizí zrnko perletí. Která skupina má schránku ze dvou polovin?",
  },
  // hlavonožci
  {
    name: "sépie", gen: "sépie", g: "hlav", schranka: false,
    znak: "Sépie je mořský dravec s chapadly s přísavkami a schránkou ukrytou uvnitř těla.",
    rada: "Sépie žije v moři, loví chapadly s přísavkami a její schránka je schovaná uvnitř těla. Kterou skupinu tyto znaky určují?",
  },
  {
    name: "chobotnice", gen: "chobotnice", g: "hlav", schranka: false,
    znak: "Chobotnice nemá žádnou schránku, ale má velké oči a osm chapadel s přísavkami.",
    rada: "Chobotnice nemá ulitu ani misky. Podívej se na její hlavu: co z ní vyrůstá a čím se to přichytí ke kameni?",
  },
  {
    name: "oliheň", gen: "olihně", g: "hlav", schranka: false,
    znak: "Oliheň je mořský dravec s velkýma očima a chapadly s přísavkami.",
    rada: "Oliheň rychle plave v moři a kořist chytá chapadly s přísavkami. Která skupina měkkýšů má místo nohy chapadla?",
  },
];

const zeSkupiny = (g: Skupina) => ZASTUPCI.filter((z) => z.g === g);

// ── L1a — zástupce → skupina ────────────────────────────────────────────────
function l1Skupina(z: Zastupce): PracticeTask | null {
  const jine = (["plzi", "mlzi", "hlav", "krouz"] as const).filter((g) => g !== z.g);
  const d: Distractor[] = jine.map((g) => ({ value: NAZEV[g], why: `${ZNAK_SKUPINY[g]} ${z.znak}` }));
  return choice(`Do které skupiny živočichů patří ${z.name}?`, NAZEV[z.g], d, {
    hints: [`Vybav si, jak vypadá ${z.name}: má schránku, a pokud ano, z kolika dílů? Má hlavu?`, z.rada],
    explanation: `${z.znak} Proto patří mezi ${MEZI[z.g]}.`,
  });
}

// ── L1b — skupina → zástupce ────────────────────────────────────────────────
interface Nemekkys { name: string; why: string }
const NEMEKKYSI: Record<Skupina, [Nemekkys, Nemekkys]> = {
  plzi: [
    { name: "pijavka lékařská", why: "Pijavka je kroužkovec: sliz má, ale tělo je složené z článků a ulitu ani tykadla nemá." },
    { name: "žížala obecná", why: "Žížala je kroužkovec s tělem z článků. Nemá ulitu, svalnatou nohu ani tykadla." },
  ],
  mlzi: [
    { name: "žížala obecná", why: "Žížala je kroužkovec s tělem z článků a žádnou schránku nemá." },
    { name: "rak říční", why: "Rak má pevný krunýř a článkované končetiny, je to korýš. Schránku ze dvou misek nemá." },
  ],
  hlav: [
    { name: "talířovka ušatá", why: "Talířovka ušatá je medúza, tedy žahavec. Má chapadla, ale bez přísavek, a hlavu nemá." },
    { name: "sasanka koňská", why: "Sasanka je žahavec přisedlý na skále. Chapadla má, ale bez přísavek, a hlavu nemá." },
  ],
};
const HLEDEJ: Record<Skupina, string> = {
  plzi: "Hledej živočicha s ulitou z jednoho kusu, nebo aspoň se svalnatou nohou a tykadly.",
  mlzi: "Hledej živočicha, jehož schránka se skládá ze dvou misek a který nemá hlavu.",
  hlav: "Hledej mořského živočicha s chapadly, na kterých jsou přísavky.",
};
const PTEJ_SE: Record<Skupina, string> = {
  plzi: "Ptej se u každého: plazí se po svalnaté noze a má na hlavě tykadla?",
  mlzi: "Ptej se u každého: dá se jeho schránka otevřít jako dvě poloviny?",
  hlav: "Ptej se u každého: má dobře vyvinuté oči a chapadla s přísavkami?",
};

function l1Zastupce(g: Skupina, i: number): PracticeTask | null {
  const z = zeSkupiny(g)[i];
  const [g1, g2] = (["plzi", "mlzi", "hlav"] as const).filter((x) => x !== g);
  const o1 = zeSkupiny(g1)[i % zeSkupiny(g1).length];
  const o2 = zeSkupiny(g2)[i % zeSkupiny(g2).length];
  const non = NEMEKKYSI[g][i % 2];
  const d: Distractor[] = [
    { value: o1.name, why: `${o1.znak} Patří proto mezi ${MEZI[o1.g]}.` },
    { value: o2.name, why: `${o2.znak} Patří proto mezi ${MEZI[o2.g]}.` },
    { value: non.name, why: non.why },
  ];
  return choice(`Který živočich z nabídky patří mezi ${MEZI[g]}?`, z.name, d, {
    // Nápověda smí vyřadit jen jednu špatnou možnost (o1) a řekne to výslovně,
    // aby ji dítě nebralo jako doporučenou. Zbylé tři zůstávají otevřené.
    hints: [
      `${HLEDEJ[g]} Třeba ${o1.name} mezi ně nepatří.`,
      `${PTEJ_SE[g]} Možnost ${o1.name} už máš vyřazenou. U zbylých si ověř i to, jestli jde vůbec o měkkýše.`,
    ],
    explanation: `Mezi ${MEZI[g]} patří ${z.name}. ${z.znak}`,
  });
}

// ── L1d — typ schránky ──────────────────────────────────────────────────────
// Každá možnost je typ schránky, který má některý měkkýš (ulita plžů, dvě
// misky mlžů, vnitřní destička sépie, žádná u plzáka/chobotnice).
const TYP_SCHRANKY: { value: string; why: string; g?: Skupina }[] = [
  { value: "ulitu z jednoho kusu", why: "Ulitu z jednoho kusu mají plži.", g: "plzi" },
  { value: "schránku ze dvou misek", why: "Schránku ze dvou misek mají mlži.", g: "mlzi" },
  { value: "destičku ukrytou uvnitř těla", why: "Schránku ukrytou uvnitř těla má sépie, hlavonožec." },
  { value: "žádnou, je bez schránky", why: "Bez schránky je třeba plzák nebo chobotnice." },
];

function l1Schranka(z: Zastupce): PracticeTask | null {
  const spravne = TYP_SCHRANKY.find((t) => t.g === z.g)!;
  const d: Distractor[] = TYP_SCHRANKY.filter((t) => t !== spravne).map((t) => ({
    value: t.value,
    why: `${t.why} ${z.znak}`,
  }));
  return choice(`Jakou schránku má ${z.name}?`, spravne.value, d, {
    hints: [
      `Vybav si, jak vypadá schránka ${z.gen}: je stočená do závitů, nebo se otevírá jako krabička?`,
      `Zeptej se, jestli ${z.name} vystrkuje ze schránky hlavu s tykadly, nebo hlavu nemá a schránku jen pootevírá.`,
    ],
    explanation:
      z.g === "plzi"
        ? `${z.znak} Ulita plžů je z jednoho kusu. Dvě misky mají mlži.`
        : `${z.znak} Obě misky spojuje vaz. Ulitu z jednoho kusu mají plži.`,
  });
}

// ── Pevné úlohy (L1c, L2, L3) ───────────────────────────────────────────────
interface Fakt {
  q: string;
  key: string;
  /** Přesně tři distraktory: [možnost, proč je to chyba]. */
  d: [string, string][];
  h: [string, string];
  e: string;
}

const uloha = (f: Fakt): PracticeTask | null =>
  choice(
    f.q,
    f.key,
    f.d.map(([value, why]) => ({ value, why })),
    { hints: f.h, explanation: f.e },
  );

// L1c — části těla
const L1_CASTI: Fakt[] = [
  {
    q: "Jak se jmenuje svalnatá část těla, po které se hlemýžď pomalu plazí?",
    key: "noha",
    d: [
      ["chapadlo", "Chapadla mají hlavonožci a chytají jimi kořist. Hlemýžď po chapadlech nelze."],
      ["plášť", "Plášť kryje útroby a vytváří schránku, k plazení neslouží."],
      ["tykadlo", "Tykadla nese hlava a slouží k hmatu a čichu, ne k pohybu."],
    ],
    h: [
      "Hlemýžď leží na široké svalnaté ploše, která se vlní. Jak se ta část těla jmenuje?",
      "Měkkýš má čtyři hlavní části: hlavu, útroby, plášť a část, na které se pohybuje. U hlavonožců se tato část přeměnila v chapadla.",
    ],
    e: "Hlemýžď se plazí po svalnaté noze. Noha se vlní a sliz pod ní usnadňuje klouzání.",
  },
  {
    q: "Která část těla měkkýše vytváří schránku?",
    key: "plášť",
    d: [
      ["noha", "Noha slouží k pohybu, schránku nevytváří."],
      ["žábry", "Žábry slouží k dýchání ve vodě, schránku nevytvářejí."],
      ["tykadlo", "Tykadla slouží k hmatu a čichu, schránku nevytvářejí."],
    ],
    h: [
      "Schránka leží na útrobách. Která část těla útroby přikrývá?",
      "Vylučuj: jedna část slouží k pohybu, jiná k dýchání a další k hmatu. Zbývá kožní řasa, která kryje útroby a vylučuje vápenité látky.",
    ],
    e: "Schránku vytváří plášť, kožní řasa, která kryje útroby. Plášť vylučuje vápenité látky a z nich schránka roste.",
  },
  {
    q: "Čím dýchá škeble rybničná pod vodou?",
    key: "žábrami",
    d: [
      ["plicním vakem", "Plicním vakem dýchají suchozemští plži, třeba hlemýžď. Škeble žije stále ve vodě."],
      ["vzdušnicemi", "Vzdušnice má hmyz, měkkýši je nemají."],
      ["jen kůží těla", "Celým povrchem těla dýchá žížala. Škeble má zvláštní dýchací orgán."],
    ],
    h: [
      "Škeble žije stále ve vodě a kyslík bere z vody. Jaký orgán k tomu mají i ryby?",
      "Vodní živočichové dýchají orgánem, přes který protéká voda. Suchozemští plži mají místo něj dutinu naplněnou vzduchem.",
    ],
    e: "Škeble dýchá žábrami. Voda jimi protéká a žábry z ní berou kyslík, zároveň zachytávají drobnou potravu.",
  },
  {
    q: "Čím dýchá hlemýžď zahradní na souši?",
    key: "plicním vakem",
    d: [
      ["žábrami", "Žábrami dýchají mlži a hlavonožci ve vodě. Hlemýžď žije na souši."],
      ["vzdušnicemi", "Vzdušnice má hmyz, měkkýši je nemají."],
      ["jen kůží těla", "Celým povrchem těla dýchá žížala. Hlemýžď má zvláštní dýchací dutinu."],
    ],
    h: [
      "Hlemýžď žije na souši a dýchá vzduch. Žábry by mu na suchu nefungovaly. Co tedy má?",
      "Pod ulitou má hlemýžď dutinu, do které nasává vzduch otvorem na boku těla. Ta dutina funguje podobně jako plíce.",
    ],
    e: "Hlemýžď dýchá plicním vakem, dutinou pod pláštěm, do které nasává vzduch. Žábry mají vodní měkkýši.",
  },
  {
    q: "Co mají hlavonožci na chapadlech?",
    key: "přísavky",
    d: [
      ["zoubky", "Zoubky má na jazyku plž, chapadla hlavonožců je nemají."],
      ["štětinky", "Štětinky má na těle žížala, ne hlavonožci."],
      ["tykadla", "Tykadla nosí na hlavě plži, na chapadlech nejsou."],
    ],
    h: [
      "Chobotnice se chapadly pevně drží kamene i kořisti. Co jí to umožňuje?",
      "Na spodní straně chapadel jsou kulaté útvary, díky kterým chapadlo drží i na hladkém skle.",
    ],
    e: "Chapadla hlavonožců nesou přísavky. Pomocí nich drží kořist a přichytí se ke dnu.",
  },
  {
    q: "Čím plž seškrabává potravu z rostlin?",
    key: "jazykem se zoubky",
    d: [
      ["chapadly s přísavkami", "Chapadla s přísavkami mají hlavonožci a loví jimi kořist."],
      ["žábrami v plášti", "Žábrami mlži dýchají a zachytávají potravu z vody. Plž tak rostliny nespásá."],
      ["kusadly na hlavě", "Kusadla má hmyz, třeba housenka. Měkkýši je nemají."],
    ],
    h: [
      "Na listu po plžovi zůstanou vyškrabané dírky. Čím je asi udělal?",
      "V ústech má plž orgán pokrytý řadami drobných tvrdých výrůstků. Funguje jako struhadlo.",
    ],
    e: "Plž má v ústech jazyk pokrytý drobnými zoubky (radulu) a jím seškrabává rostlinnou potravu.",
  },
  {
    q: "Kde má hlemýžď zahradní oči?",
    key: "na tykadlech",
    d: [
      ["na chapadlech", "Chapadla mají hlavonožci a ani ti na nich oči nemají."],
      ["na noze", "Noha slouží k plazení, oči na ní nejsou."],
      ["na ulitě", "Ulita je neživá schránka, oči na ní být nemohou."],
    ],
    h: [
      "Když hlemýždě jemně dotkneš, zatáhne z hlavy dva delší výběžky. Proč je chrání?",
      "Hlemýžď má na hlavě dva páry výběžků. Kratší slouží k hmatu a čichu, na koncích delších je tmavá tečka.",
    ],
    e: "Hlemýžď má oči na koncích delších tykadel. Při nebezpečí je zatáhne dovnitř.",
  },
  {
    q: "Čím hlemýžď zahradní uzavře ulitu na zimu?",
    key: "víčkem",
    d: [
      ["pláštěm", "Plášť je kožní řasa, která ulitu vytváří. Otvor ulity nezakrývá."],
      ["druhou miskou", "Dvě misky mají mlži. Ulita hlemýždě je z jednoho kusu."],
      ["chapadly", "Chapadla mají hlavonožci, hlemýžď je nemá."],
    ],
    h: [
      "Hlemýžď se na zimu zatáhne do ulity a otvor zakryje. Čím?",
      "Otvor ulity zalepí vápenitou vrstvou, která ztvrdne. Na jaře ji odstrčí a vyleze ven.",
    ],
    e: "Hlemýžď zahradní se na zimu zatáhne do ulity a zavře ji vápenitým víčkem. Tak přečká mráz i sucho.",
  },
  {
    q: "Kde žijí hlavonožci?",
    key: "jen v moři",
    d: [
      ["v rybnících a řekách", "V rybnících a řekách žijí plži a mlži, ne hlavonožci."],
      ["na vlhké souši", "Na souši žijí jen někteří plži, třeba hlemýžď."],
      ["v moři i v řekách", "Hlavonožci potřebují slanou vodu, ve sladké nežijí."],
    ],
    h: [
      "Vzpomeň si, kde by ses mohl nebo mohla setkat s chobotnicí či sépií.",
      "Vybav si, odkud se chobotnice dovážejí do obchodů a kde je lidé potkávají při potápění.",
    ],
    e: "Hlavonožci žijí jen v moři. Ve sladké vodě ani na souši je nenajdeš.",
  },
];

// ── L2 — použití ────────────────────────────────────────────────────────────
const KAM = "Do které skupiny patří?";
const FB_PLZI_POPIS = "Plži mají jednodílnou ulitu nebo žádnou a na hlavě tykadla.";
const FB_KROUZ = "Kroužkovci mají tělo z článků, ne měkké nečlánkované tělo.";
const L2: Fakt[] = [
  {
    q: `Živočich má schránku ze dvou misek spojených vazem a nemá hlavu. ${KAM}`,
    key: "mlži",
    d: [
      ["plži", `Každý živočich se schránkou není plž. ${FB_PLZI_POPIS}`],
      ["hlavonožci", "Hlavonožci mají hlavu s očima a chapadly. Tenhle živočich hlavu nemá."],
      ["kroužkovci", `${FB_KROUZ} Schránku kroužkovci nemají.`],
    ],
    h: [
      "Dva znaky: schránka z polovin a chybějící hlava. Která skupina měkkýšů nemá hlavu?",
      "Zeptej se: kolik kusů má schránka? Jednodílnou ulitu mají živočichové s tykadly, schránku z polovin spojených vazem ti, kteří potravu filtrují.",
    ],
    e: "Schránku ze dvou misek spojených vazem a tělo bez hlavy mají mlži, například škeble.",
  },
  {
    q: `Živočich má jednodílnou závitou schránku a na hlavě tykadla. ${KAM}`,
    key: "plži",
    d: [
      ["mlži", "Mlži mají schránku ze dvou misek a hlavu nemají."],
      ["hlavonožci", "Hlavonožci mají na hlavě chapadla s přísavkami, ne tykadla, a žijí jen v moři."],
      ["kroužkovci", `${FB_KROUZ} Schránku ani tykadla nemají.`],
    ],
    h: [
      "Dva znaky: schránka z jednoho kusu a tykadla. Která skupina měkkýšů má tykadla?",
      "Zeptej se: kolik kusů má schránka? Z jednoho kusu stočeného do závitů ji má skupina, kam patří hlemýžď.",
    ],
    e: "Jednodílnou závitou ulitu a hlavu s tykadly mají plži, třeba hlemýžď nebo páskovka.",
  },
  {
    q: `Živočich má kolem hlavy chapadla s přísavkami a dobře vyvinuté oči. ${KAM}`,
    key: "hlavonožci",
    d: [
      ["plži", "Plži mají na hlavě tykadla, ne chapadla s přísavkami."],
      ["kroužkovci", "Kroužkovci mají tělo z článků. Chapadla s přísavkami kolem hlavy nemají."],
      ["žahavci", "Medúzy a jiní žahavci mají chapadla se žahavými buňkami, ale bez přísavek, a hlavu nemají."],
    ],
    h: [
      "Chapadla s přísavkami rostou přímo z hlavy. Na tuhle stavbu ukazuje i jméno skupiny.",
      "Zeptej se: co roste z hlavy? Tykadla mají měkkýši, kteří se plazí po noze, chapadla s přísavkami mořští dravci jako chobotnice.",
    ],
    e: "Chapadla s přísavkami kolem hlavy a dobře vyvinuté oči mají hlavonožci, třeba chobotnice. Noha se jim přeměnila v chapadla.",
  },
  {
    q: `Živočich nemá vnější schránku, plazí se po svalnaté noze a na hlavě má tykadla. ${KAM}`,
    key: "plži",
    d: [
      ["kroužkovci", `${FB_KROUZ} Tykadla ani svalnatou nohu nemají.`],
      ["mlži", "Mlži mají schránku ze dvou misek a hlavu s tykadly nemají."],
      ["hlavonožci", "Hlavonožci nemají tykadla, ale chapadla s přísavkami, a žijí jen v moři."],
    ],
    h: [
      "Chybějící schránka neznamená, že to není měkkýš. Rozhoduj podle nohy a tykadel.",
      "Zeptej se: kdo má tykadla a plazí se po noze? Stejné znaky má hlemýžď, jen s ulitou navíc.",
    ],
    e: "Svalnatou nohu a tykadla mají plži. Někteří plži, jako plzák, vnější ulitu nemají, a přesto do této skupiny patří.",
  },
  {
    q: `Živočich je přirostlý ke skále v moři, schránku má ze dvou misek a potravu filtruje z vody. ${KAM}`,
    key: "mlži",
    d: [
      ["plži", `Schránka sama nestačí. ${FB_PLZI_POPIS}`],
      ["hlavonožci", "Hlavonožci jsou pohybliví dravci s chapadly, nefiltrují a nejsou přirostlí."],
      ["žahavci", "Přisedlá sasanka je žahavec, ale nemá schránku ze dvou misek."],
    ],
    h: [
      "Přisedlý živočich za potravou nechodí, musí si ji brát z proudící vody. Která skupina měkkýšů to dělá?",
      "Zeptej se: kolik kusů má schránka? Schránku z polovin a filtrování potravy má skupina, kam patří ústřice.",
    ],
    e: "Schránka ze dvou misek a filtrování potravy z vody jsou znaky mlžů. Ústřice přirůstají ke skalám a slávky se k nim přichytávají pevnými vlákny.",
  },
  {
    q: `Živočich rychle plave tak, že vystřikuje vodu, a kořist chytá chapadly. ${KAM}`,
    key: "hlavonožci",
    d: [
      ["ryby", "Ryby mají páteř a plavou pomocí ploutví, ne vystřikováním vody. Chapadla nemají."],
      ["plži", "Plži se pomalu plazí po noze a chapadla nemají."],
      ["mlži", "Mlži nemají chapadla a potravu jen filtrují z vody."],
    ],
    h: [
      "Rychlý dravec s chapadly, který se žene jako raketa. Která skupina měkkýšů loví?",
      "Zeptej se: plave živočich ploutvemi, nebo vystřikuje vodu z dutiny těla? Tak se pohybuje sépie.",
    ],
    e: "Pohyb vystřikováním vody a lov chapadly jsou znaky hlavonožců, například sépie nebo olihně.",
  },
  {
    q: "Na vnitřní straně misek škeble je lesklá perleť. Která část těla ji vytvořila?",
    key: "plášť",
    d: [
      ["noha", "Noha slouží k pohybu, perleť ani schránku nevytváří."],
      ["žábry", "Žábry slouží k dýchání a zachytávání potravy, perleť nevytvářejí."],
      ["útroby", "Útroby obsahují trávicí a další orgány. Schránku a perleť vytváří kožní řasa, která je kryje."],
    ],
    h: [
      "Perleť je vnitřní vrstva schránky. Která část těla vytváří celou schránku?",
      "Hledej část, která leží těsně pod schránkou a přikrývá útroby.",
    ],
    e: "Perleť vytváří plášť. Je to kožní řasa, která vylučuje vápenité látky, a z nich roste schránka i její perleťová vrstva.",
  },
  {
    q: "Měkkýš se pomalu sune po kameni a za sebou nechává lesklou slizovou stopu. Čím se pohybuje?",
    key: "svalnatou nohou",
    d: [
      ["chapadly s přísavkami", "Chapadly se přitahují hlavonožci v moři. Slizovou stopu nenechávají."],
      ["vystřikováním vody", "Vystřikováním vody plavou hlavonožci, po kameni se nesunou."],
      ["tělem z článků", "Tělo z článků mají kroužkovci jako žížala, měkkýši ne."],
    ],
    h: [
      "Slizová stopa zůstává po živočichovi, který leží celým spodkem těla na podkladu. Jak se ta část těla jmenuje?",
      "Vzpomeň si na hlemýždě na skle: spodní strana těla se vlní odzadu dopředu.",
    ],
    e: "Pomalé sunutí se slizovou stopou je plazení po svalnaté noze, jak to dělají plži. Noha se vlní a sliz jí usnadňuje klouzání.",
  },
  {
    q: "Jak hlavonožci nejčastěji unikají nepříteli?",
    key: "vystříknou inkoust a odplavou",
    d: [
      ["zalezou do ulity a zavřou ji", "Takto se chrání plži s ulitou. Většina hlavonožců vnější ulitu nemá."],
      ["pevně sevřou obě misky", "Takto se chrání mlži. Hlavonožci misky nemají."],
      ["svinou se do klubíčka", "Do klubíčka se svinuje třeba svinka nebo ježek, ne hlavonožci."],
    ],
    h: [
      "Většina hlavonožců nemá ochrannou vnější schránku. Musí tedy nepřítele zmást a rychle zmizet. Jak?",
      "Mají v těle žlázu s tmavou tekutinou a umí se prudce pohybovat vystřikováním vody.",
    ],
    e: "Hlavonožci vypustí tmavý inkoust, který nepřítele zmate, a vystřikováním vody rychle odplavou.",
  },
  {
    q: "K čemu slouží sépii inkoustová žláza?",
    key: "k zamaskování útěku",
    d: [
      ["k trávení kořisti", "Kořist se tráví v trávicí soustavě, inkoust s tím nesouvisí."],
      ["k tvorbě schránky", "Vnitřní schránku sépie vytváří plášť."],
      ["k lákání kořisti", "Inkoust sépie vypouští při ohrožení, ne na lov."],
    ],
    h: [
      "Kdy sépie inkoust vypustí? Pomysli, co se stane s vodou kolem ní.",
      "Tmavý oblak ve vodě zakryje výhled. Komu to pomůže a v jaké situaci?",
    ],
    e: "Inkoust sépie vypustí při ohrožení. Tmavý oblak nepřítele zmate a sépie mezitím uplave.",
  },
  {
    q: "Jak přijímá potravu škeble rybničná?",
    key: "filtruje drobné částice z vody",
    d: [
      ["seškrabává rostliny jazykem", "Jazykem se zoubky seškrabávají potravu plži. Škeble hlavu ani jazyk nemá."],
      ["loví kořist chapadly", "Chapadly loví hlavonožci. Škeble chapadla nemá a nepohybuje se za kořistí."],
      ["nasává krev hostitele", "Krev saje pijavka, kroužkovec. Škeble se živí jinak."],
    ],
    h: [
      "Škeble nemá hlavu ani chapadla a skoro se nehýbe. Kde tedy vezme potravu?",
      "Škeble leží na dně s pootevřenými miskami a voda kolem ní stále proudí. Co by si z té vody mohla vzít?",
    ],
    e: "Škeble filtruje potravu: přes žábry protéká voda a zachytávají se drobné částice a organismy.",
  },
  {
    q: "Jak získává potravu hlemýžď zahradní?",
    key: "seškrabává rostliny jazykem",
    d: [
      ["filtruje drobné částice z vody", "Filtrují mlži ve vodě. Hlemýžď žije na souši."],
      ["loví kořist chapadly", "Chapadly loví hlavonožci. Hlemýžď chapadla nemá."],
      ["nasává krev hostitele", "Krev saje pijavka, kroužkovec. Hlemýžď je býložravec."],
    ],
    h: [
      "Hlemýžď škodí na zahradě listům salátu. Jak je asi požírá?",
      "Hlemýžď žije na souši a chapadla nemá. Co z toho vyplývá pro to, jakou potravu jí a jak se k ní dostane?",
    ],
    e: "Hlemýžď seškrabává rostliny jazykem pokrytým drobnými zoubky. Proto zůstávají na listech vyžrané dírky.",
  },
  {
    q: "Jak získává potravu chobotnice?",
    key: "loví kořist chapadly",
    d: [
      ["filtruje drobné částice z vody", "Filtrují mlži, kteří hlavu ani chapadla nemají."],
      ["seškrabává rostliny jazykem", "Jazykem se zoubky seškrabávají rostliny plži. Chobotnice je dravec."],
      ["nasává krev hostitele", "Krev saje pijavka, kroužkovec. Chobotnice parazit není."],
    ],
    h: [
      "Podívej se, jaké orgány chobotnice má a jestli se hýbe. Co z toho vyplývá pro získávání potravy?",
      "Chobotnice se živí kraby a rybami, tedy živými zvířaty, která utíkají. Jak se k nim asi dostane?",
    ],
    e: "Chobotnice je dravec: kořist vyhledá očima, chytí chapadly a přidrží přísavkami.",
  },
  {
    q: "Který znak mají plži, mlži i hlavonožci společný?",
    key: "měkké nečlánkované tělo",
    d: [
      ["pevnou vnější schránku", "Vnější schránku nemá chobotnice ani plzák, a přesto jsou to měkkýši."],
      ["tělo složené z článků", "Tělo z článků mají kroužkovci, třeba žížala."],
      ["článkované končetiny", "Článkované končetiny mají členovci, třeba hmyz nebo rak."],
    ],
    h: [
      "Vzpomeň si na plzáka a chobotnici. Co mají stejného se škeblí, přestože vypadají úplně jinak?",
      "Najdi znak, který má chobotnice, plzák i škeble zároveň. Vyřaď znaky, které aspoň jednomu z nich chybí.",
    ],
    e: "Všichni měkkýši mají měkké nečlánkované tělo. Schránku mají jen někteří, články a končetiny nemá žádný.",
  },
  {
    q: "Který znak mají plži a hlavonožci, ale mlži ne?",
    key: "hlavu s očima",
    d: [
      ["plášť kolem útrob", "Plášť mají všichni měkkýši, i mlži."],
      ["schránku ze dvou misek", "Dvě misky mají naopak jen mlži."],
      ["chapadla s přísavkami", "Chapadla s přísavkami mají jen hlavonožci, plži ne."],
    ],
    h: [
      "Mlži se nehýbou za potravou, jen ji filtrují. Které části těla proto nepotřebují?",
      "Porovnej přední část těla hlemýždě, chobotnice a škeble. Co škebli chybí a proč to nepotřebuje?",
    ],
    e: "Hlavu s očima mají plži i hlavonožci. Mlži hlavu nemají, protože potravu jen filtrují a za kořistí nechodí.",
  },
  {
    q: "Čím se liší schránka plže od schránky mlže?",
    key: "plž má ulitu, mlž dvě misky",
    d: [
      ["plž má dvě misky, mlž ulitu", "Je to obráceně: dvě misky mají mlži, ulitu z jednoho kusu plži."],
      ["oba mají ulitu z jednoho kusu", "Mlži nemají ulitu, jejich schránka je ze dvou misek."],
      ["oba mají schránku z misek", "Plži nemají misky, jejich ulita je z jednoho kusu."],
    ],
    h: [
      "Vybav si hlemýždě a škebli vedle sebe. Kolik kusů má schránka každého z nich?",
      "Jedna schránka se otevírá jako krabička, druhá je stočená do závitů. Přiřaď je správně.",
    ],
    e: "Plž má ulitu z jednoho kusu, obvykle závitou. Mlž má schránku ze dvou misek spojených vazem.",
  },
];

// ── L3 — přenos ─────────────────────────────────────────────────────────────
const ZARADIS = "Kam ho zařadíš?";
const L3: Fakt[] = [
  {
    q: `Mořský živočich nemá vnější schránku, má velké oči a osm chapadel s přísavkami. ${ZARADIS}`,
    key: "hlavonožci, protože má chapadla s přísavkami",
    d: [
      ["plži, protože nemá schránku jako plzák", "Plzák nemá ulitu, ale má tykadla a plazí se po noze. Chapadla s přísavkami plži nemají."],
      ["ryby, protože žije v moři a plave", "Ryby mají páteř a ploutve. Život v moři o skupině nerozhoduje."],
      ["žahavci, protože má chapadla jako medúza", "Medúza má chapadla bez přísavek a nemá hlavu s velkýma očima. Přísavky rozhodují."],
    ],
    h: [
      "Chybějící schránka je past. Rozhoduj podle toho, co roste z hlavy a co na tom je.",
      "Krok 1: najdi znak, který má jen jedna skupina. Krok 2: ověř, že s ním souhlasí i oči a život v moři.",
    ],
    e: "Chapadla s přísavkami a velké oči mají hlavonožci, tady chobotnice. Vnější schránku hlavonožci obvykle nemají.",
  },
  {
    q: `Suchozemský živočich nemá schránku, plazí se po noze a zanechává slizovou stopu. ${ZARADIS}`,
    key: "plži, protože se plazí po svalnaté noze",
    d: [
      ["kroužkovci, protože je slizký jako žížala", "Sliz nerozhoduje. Kroužkovci mají tělo z článků a nemají svalnatou nohu."],
      ["mlži, protože nemá ulitu ani tykadla", "Mlži mají schránku ze dvou misek. Živočich bez schránky mezi mlže nepatří."],
      ["hlavonožci, protože nemá vnější schránku", "Hlavonožci žijí jen v moři a mají chapadla. Tenhle živočich žije na souši."],
    ],
    h: [
      "Slizová stopa svádí k žížale. Podívej se ale, po čem se živočich pohybuje.",
      "Krok 1: najdi znak, který patří jen jedné skupině měkkýšů. Krok 2: ověř, jestli ta skupina žije i na souši.",
    ],
    e: "Plazení po svalnaté noze je znak plžů. Jde o plzáka: nemá ulitu, a přesto je plž. Kroužkovci mají tělo z článků.",
  },
  {
    q: `Živočich z řeky má pevnou schránku, ale nemá hlavu, oči ani tykadla. ${ZARADIS}`,
    key: "mlži, protože má schránku, ale nemá hlavu",
    d: [
      ["plži, protože má pevnou vápenitou schránku","Plži mají hlavu s tykadly. Schránka sama o skupině nerozhoduje."],
      ["korýši, protože má pevný krunýř", "Korýši jako rak mají hlavu, oči i tykadla. Tenhle živočich je nemá."],
      ["kroužkovci, protože nemá hlavu", "Kroužkovci nemají schránku a jejich tělo je z článků."],
    ],
    h: [
      "Pevnou schránku mají různí živočichové. Rozhoduj podle toho, co tomuto živočichovi chybí.",
      "Krok 1: která skupina měkkýšů nemá hlavu? Krok 2: sedí k ní i pevná schránka a život ve vodě?",
    ],
    e: "Měkkýš se schránkou, ale bez hlavy, očí a tykadel je mlž, například velevrub. Plži hlavu s tykadly mají.",
  },
  {
    q: `Mořský živočich má uvnitř těla vápenitou destičku, velké oči a chapadla s přísavkami. ${ZARADIS}`,
    key: "hlavonožci, protože má chapadla s přísavkami",
    d: [
      ["obratlovci, protože má v těle kost", "Vápenitá destička není kost, ale vnitřní schránka. Páteř tento živočich nemá."],
      ["mlži, protože má pevnou vápenitou schránku", "Mlži mají vnější schránku ze dvou misek a nemají hlavu ani chapadla."],
      ["plži, protože má vápenitou schránku", "Plži mají vnější ulitu a tykadla, ne chapadla s přísavkami."],
    ],
    h: [
      "Destička uvnitř těla svádí ke kostře. Je to ale páteř? Rozhoduj podle znaků na hlavě.",
      "Krok 1: najdi znak, který má jen jedna skupina měkkýšů. Krok 2: rozhodni, čím může být destička uvnitř těla u měkkýše.",
    ],
    e: "Jde o sépii, hlavonožce s chapadly s přísavkami. Sépiová kost není kost, ale vnitřní vápenitá schránka.",
  },
  {
    q: `Mořský živočich se pohybuje tak, že prudce vystřikuje vodu z těla, a když je ohrožen, vypustí tmavý oblak. ${ZARADIS}`,
    key: "hlavonožci, protože se pohybuje vystřikováním vody",
    d: [
      ["ryby, protože rychle plave v moři", "Ryby plavou pomocí ploutví a tmavý oblak nevypouštějí."],
      ["plži, protože vylučuje tekutinu jako sliz", "Sliz plžů není tmavý oblak. Plži se pomalu plazí po noze."],
      ["mlži, protože protlačuje vodu schránkou", "Mlži vodu hlavně filtrují a tmavý oblak nevypouštějí. Rozhoduje inkoust a pohyb vystřikováním vody."],
    ],
    h: [
      "Rychlé plavání svádí k rybám. Všimni si ale, jakým způsobem se živočich pohybuje.",
      "Krok 1: čím je tmavý oblak a kdo ho vypouští? Krok 2: která skupina měkkýšů se pohybuje jako raketa?",
    ],
    e: "Pohyb vystřikováním vody a vypuštění inkoustu jsou znaky hlavonožců, například olihně nebo sépie.",
  },
  {
    q: `Vodní živočich má jednodílnou ulitu a pro vzduch vyplouvá k hladině. ${ZARADIS}`,
    key: "plži, protože má jednodílnou ulitu",
    d: [
      ["mlži, protože má pevnou schránku", "Pevnou schránku mají mlži i plži. Mlži mají dvě misky, ne jednodílnou ulitu."],
      ["hlavonožci, protože umí plavat k hladině", "Hlavonožci žijí jen v moři a vnější ulitu obvykle nemají."],
      ["ryby, protože žije ve vodě", "Ryby nemají ulitu ani žádnou schránku, mají páteř a ploutve."],
    ],
    h: [
      "Život ve vodě je past, žije tam víc skupin. Rozhoduj podle schránky.",
      "Krok 1: kolik kusů má schránka? Krok 2: proč musí živočich pro vzduch k hladině, když žije ve vodě?",
    ],
    e: "Jednodílná ulita je znak plžů. Jde o plovatku: dýchá plicním vakem, a proto vyplouvá pro vzduch k hladině.",
  },
  {
    q: "Tonda tvrdí, že slávka je plž, protože má schránku. Co je na tom špatně?",
    key: "Schránka slávky má dvě misky, takže je to mlž.",
    d: [
      ["Tonda má pravdu, každý měkkýš se schránkou je plž.", "Schránku mají i mlži. Slávka má dvě misky, ne ulitu z jednoho kusu."],
      ["Slávka je hlavonožec, protože žije v moři.", "V moři žijí i plži a mlži. Hlavonožci mají chapadla s přísavkami, slávka ne."],
      ["Slávka nemá schránku, jen tvrdou kůži.", "Slávka má pevnou vápenitou schránku, ne tvrdou kůži."],
    ],
    h: [
      "Schránku mají dvě skupiny měkkýšů. Tonda nevzal v úvahu, jak schránka vypadá.",
      "Krok 1: z kolika kusů je schránka slávky? Krok 2: které skupině takový počet patří?",
    ],
    e: "Schránku mají plži i mlži, liší se ale počtem dílů. Slávka má dvě misky spojené vazem, takže je to mlž.",
  },
  {
    q: "Eliška tvrdí, že chobotnice není měkkýš, protože nemá ulitu. Co je na tom špatně?",
    key: "Schránka nerozhoduje, měkkýši mají hlavně měkké nečlánkované tělo.",
    d: [
      ["Eliška má pravdu, chobotnice je ryba bez šupin.", "Chobotnice nemá páteř ani ploutve, rybou není."],
      ["Eliška má pravdu, chobotnice je žahavec jako medúza.", "Medúza nemá přísavky ani hlavu s velkýma očima. Chobotnice je měkkýš."],
      ["Chobotnice ulitu nosí jen v mládí, pak ji odhodí.", "Chobotnice ulitu nemá ani v mládí. Přesto je měkkýš."],
    ],
    h: [
      "Vzpomeň si na plzáka: nemá ulitu, a přece je měkkýš. Co tedy měkkýše určuje?",
      "Krok 1: najdi znak, který mají všichni měkkýši. Krok 2: ověř, jestli ho chobotnice má.",
    ],
    e: "Schránka není podmínkou. Měkkýše určuje měkké nečlánkované tělo. Chobotnice ho má, je to hlavonožec.",
  },
  {
    q: "Petr tvrdí, že plzák patří ke kroužkovcům, protože je slizký a nemá ulitu. Co je na tom špatně?",
    key: "Plzák má nečlánkované tělo, svalnatou nohu a tykadla jako plži.",
    d: [
      ["Plzák je opravdu kroužkovec, sliz mají jen kroužkovci.", "Sliz vylučují i plži. Kroužkovce poznáš podle těla z článků."],
      ["Plzák je mlž, protože nemá ulitu ani hlavu.", "Plzák hlavu s tykadly má. Mlži mají schránku ze dvou misek."],
      ["Plzák je hmyz, protože má na hlavě tykadla.", "Hmyz má článkované tělo a šest nohou. Plzák je měkkýš."],
    ],
    h: [
      "Sliz ani chybějící ulita skupinu neurčují. Podívej se, jestli je tělo složené z článků.",
      "Krok 1: má plzák tělo z článků? Krok 2: po čem se plazí a co má na hlavě? Které skupině měkkýšů to odpovídá?",
    ],
    e: "Kroužkovci mají tělo z článků. Plzák má měkké nečlánkované tělo, svalnatou nohu a tykadla, takže je to plž bez ulity.",
  },
  {
    q: "Jakub tvrdí, že sépie je obratlovec, protože má v těle kost. Co je na tom špatně?",
    key: "Sépiová kost je vnitřní schránka, sépie nemá páteř.",
    d: [
      ["Sépiová kost je skutečná kost, Jakub má pravdu.", "Sépiová kost je vápenitá schránka, ne kost. Sépie nemá páteř, obratlovec není."],
      ["Sépiová kost je ulita, proto je sépie plž.", "Sépie má chapadla s přísavkami, plž to není. Schránku má uvnitř těla."],
      ["Sépiová kost je krunýř, proto je sépie korýš.", "Korýši mají článkované tělo a končetiny. Sépie je měkkýš."],
    ],
    h: [
      "Název té destičky v těle sépie je zavádějící. Zjisti, co obratlovce odlišuje od bezobratlých, a jestli to sépie má.",
      "Krok 1: z čeho je destička v těle sépie a kde přesně leží? Krok 2: tvoří kostru jako u obratlovců, nebo je to něco jiného?",
    ],
    e: "Sépiová kost je vnitřní vápenitá schránka, ne kost. Sépie nemá páteř, je to měkkýš z hlavonožců.",
  },
  {
    q: "Proč mlž nepotřebuje hlavu s tykadly a očima?",
    key: "potravu filtruje z vody a žije přisedle nebo zahrabaný",
    d: [
      ["potravu loví chapadly a oči mu nahrazují přísavky", "Chapadly loví hlavonožci. Mlž chapadla nemá a nic neloví."],
      ["potravu seškrabává jazykem a tykadla má v ulitě", "Jazykem se zoubky seškrabávají potravu plži. Mlž ulitu ani jazyk nemá."],
      ["potravu hledá čichem a hlavu má schovanou v misce", "Mlž hlavu nemá vůbec, ani schovanou."],
    ],
    h: [
      "Oči a tykadla slouží k hledání potravy a orientaci při pohybu. Potřebuje je živočich, který se skoro nehýbe?",
      "Krok 1: jak mlž získává potravu? Krok 2: kde a jak mlž žije? Z obojího vyplyne, proč mu hlava chybí.",
    ],
    e: "Mlž potravu filtruje z vody, která k němu sama přitéká, a žije přisedle nebo zahrabaný v bahně. Hlavu s tykadly a očima proto nepotřebuje.",
  },
  {
    q: "Proč hlavonožci potřebují dobře vyvinuté oči?",
    key: "jsou to dravci a kořist aktivně vyhledávají",
    d: [
      ["jsou to býložravci a hledají řasy na dně", "Hlavonožci nejsou býložravci, loví živou kořist."],
      ["jsou to filtrátoři a sledují proud vody", "Potravu z vody filtrují mlži, a ti nemají hlavu ani dobře vyvinuté oči."],
      ["jsou to parazité a hledají hostitele", "Hlavonožci nejsou parazité, jsou to volně žijící dravci."],
    ],
    h: [
      "Čím se hlavonožci živí? Kdo potřebuje dobře vidět?",
      "Krok 1: jak hlavonožci získávají potravu? Krok 2: k čemu jim při tom pomůže dobrý zrak a rychlý pohyb?",
    ],
    e: "Hlavonožci jsou dravci: kořist vyhledávají očima, rychle ji dohoní a chytí chapadly. Proto mají oči dobře vyvinuté.",
  },
  {
    q: "Proč suchozemský plž vylučuje sliz?",
    key: "sliz mu usnadňuje plazení a chrání tělo před vyschnutím",
    d: [
      ["sliz mu slouží k filtrování drobné potravy z vody", "Potravu z vody filtrují mlži. Suchozemský plž seškrabává rostliny."],
      ["sliz mu slouží k omráčení kořisti", "Hlemýžď ani plzák kořist neloví a sliz k lovu nepoužívají."],
      ["sliz mu nahrazuje dýchací orgán", "Suchozemský plž dýchá plicním vakem. Sliz dýchání nenahrazuje."],
    ],
    h: [
      "Pomysli, jaké problémy má měkké tělo bez ulity na suché zemi a na drsném podkladu.",
      "Krok 1: co se stane s mokrým hadříkem, když leží na slunci? Krok 2: co pomůže, aby se měkké tělo neodřelo o kamínky?",
    ],
    e: "Sliz pomáhá svalnaté noze klouzat po podkladu a udržuje měkké tělo vlhké, aby nevyschlo.",
  },
  {
    q: "Akvarista chce chovat sépii v akváriu s vodou z kohoutku. Co dělá špatně?",
    key: "sépie potřebuje slanou mořskou vodu",
    d: [
      ["sépie potřebuje tekoucí potok, ne akvárium", "Hlavonožci ve sladké vodě nežijí vůbec, ani v potocích."],
      ["voda z kohoutku je pro sépii moc čistá", "Čistota tu nerozhoduje. Sépie ve sladké vodě nepřežije, ať je jakkoli čistá."],
      ["sépie potřebuje v akváriu bahno k zahrabání", "Zahrabaní v bahně žijí mlži jako škeble. Sépie aktivně plave a loví."],
    ],
    h: [
      "Kde žije sépie v přírodě? A jaká voda teče z kohoutku?",
      "Krok 1: porovnej vodu, ve které sépie žije v přírodě, s vodou z kohoutku. Krok 2: co ten rozdíl udělá s živočichem, který jinde nežije?",
    ],
    e: "Sépie i ostatní hlavonožci žijí jen v moři se slanou vodou. Ve sladké vodě z kohoutku nepřežijí. V dnešním Česku proto hlavonožci nežijí, zkameněliny z dávných moří se tu ale najdou.",
  },
  {
    q: "Proč velevruby a perlorodky mizí z potoků se znečištěnou vodou?",
    key: "filtrují vodu a potřebují ji čistou a bohatou na kyslík",
    d: [
      ["loví ryby, které ze špinavé vody odplavaly", "Mlži neloví, potravu filtrují z vody."],
      ["seškrabávají řasy, které ve špinavé vodě nerostou", "Jazykem seškrabávají potravu plži. Mlži jazyk se zoubky nemají."],
      ["potřebují slanou vodu, kterou nečistota ředí", "Velevruby a perlorodky žijí ve sladké vodě, ne ve slané."],
    ],
    h: [
      "Jak tito živočichové získávají potravu? Co všechno při tom proteče jejich tělem?",
      "Krok 1: vzpomeň si, jak se živí živočichové se schránkou ze dvou misek. Krok 2: co se stane, když ve vodě bude špína a málo kyslíku?",
    ],
    e: "Velevruby a perlorodky jsou mlži: filtrují vodu a dýchají žábrami. Ve znečištěné vodě s málem kyslíku nepřežijí, proto je perlorodka říční ohrožená.",
  },
  {
    q: "Proč škeble v rybníce pomáhá udržovat čistou vodu?",
    key: "přes žábry filtruje vodu a zachytí v ní částice",
    d: [
      ["seškrabává z kamenů řasy svým jazykem", "Jazykem se zoubky seškrabávají potravu plži. Škeble jazyk nemá."],
      ["vypouští do vody čisticí inkoust", "Inkoust vypouštějí mořští hlavonožci a vodu nečistí."],
      ["loví drobné živočichy chapadly", "Chapadly loví hlavonožci. Škeble chapadla nemá."],
    ],
    h: [
      "Škeble se živí tím, co voda přinese. Co se stane s vodou, která projde jejím tělem?",
      "Krok 1: jak škeble přijímá potravu? Krok 2: co tím zmizí z vody v rybníce?",
    ],
    e: "Škeble filtruje vodu přes žábry a zachytává v ní drobné částice. Voda, která jí proteče, je čistší.",
  },
  {
    q: "V potoce zůstaly jen prázdné schránky ze dvou misek. Co to může znamenat?",
    key: "mlži tu uhynuli, voda mohla být znečištěná",
    d: [
      ["plži tu uhynuli, voda mohla být znečištěná", "Dvě misky nepatří plžům. Plži mají ulitu z jednoho kusu."],
      ["mlži schránky odhazují, když povyrostou", "Mlži schránky neodhazují, schránka roste s nimi."],
      ["hlavonožci tu odložili vnitřní schránky", "Hlavonožci žijí jen v moři, v potoce nejsou."],
    ],
    h: [
      "Dvě úvahy: komu schránka ze dvou misek patřila a proč by mohl zemřít.",
      "Krok 1: kdo má schránku ze dvou misek? Krok 2: co tito živočichové potřebují, aby v potoce přežili?",
    ],
    e: "Dvě misky patří mlžům. Mlži filtrují vodu a potřebují čistou vodu, takže prázdné schránky mohou ukazovat na znečištění.",
  },
];

// ── Generátor ───────────────────────────────────────────────────────────────
const SKUPINY: Skupina[] = ["plzi", "mlzi", "hlav"];
/** Velevrub vynechán: šesťák ho nezná a otázka na jeho schránku je jen tip. */
const S_SCHRANKOU = ZASTUPCI.filter((z) => z.schranka && z.g !== "hlav" && z.name !== "velevrub");

const genL1 = (): PracticeTask | null => {
  const sablona = pick([0, 1, 2, 3]);
  if (sablona === 0) return l1Skupina(pick(ZASTUPCI));
  if (sablona === 1) {
    const g = pick(SKUPINY);
    return l1Zastupce(g, Math.floor(Math.random() * zeSkupiny(g).length));
  }
  if (sablona === 2) return uloha(pick(L1_CASTI));
  return l1Schranka(pick(S_SCHRANKOU));
};
const genL2 = () => uloha(pick(L2));
const genL3 = () => uloha(pick(L3));

function gen(level: number): PracticeTask[] {
  const tvor = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(tvor));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const MEKKYSI_PLZI_MLZI_HLAVONOZCI: TopicMetadata[] = [
  {
    id: "g6-pri-mekkysi-plzi-mlzi-hlavonozci-6",
    rvpNodeId: "g6-prirodopis-biologie-zivocichu-bezobratli-mekkysi-krouzkovci-mekkysi-plzi-mlzi-hlavonozci",
    displayName: "Měkkýši – plži, mlži, hlavonožci",
    title: "Měkkýši - plži, mlži, hlavonožci",
    studentTitle: "Měkkýši: plži, mlži, hlavonožci",
    subject: "prirodopis",
    category: "Biologie živočichů",
    topic: "Bezobratlí - měkkýši, kroužkovci",
    briefDescription: "Poznáš plže, mlže a hlavonožce podle schránky, nohy a chapadel.",
    keywords: [
      "měkkýši", "plži", "mlži", "hlavonožci", "hlemýžď", "plzák", "škeble", "slávka",
      "perlorodka", "sépie", "chobotnice", "ulita", "misky", "chapadla", "přísavky", "noha", "plášť",
    ],
    goals: [
      "Zařadit měkkýše mezi plže, mlže a hlavonožce podle schránky, hlavy, nohy a chapadel.",
      "Spojit znak těla s jeho funkcí a se způsobem výživy.",
      "Rozhodnout o neznámém nebo zavádějícím popisu a zdůvodnit, proč mlži potřebují čistou vodu.",
    ],
    boundaries: [
      "Jen zástupci z běžných učebnic 6. ročníku; latinské názvy nejsou klíčem.",
      "Počty ramen sépie a olihně se nezkoušejí.",
      "Kroužkovci a členovci vystupují jen jako distraktory, samostatně je procvičují jiná témata.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Měkkýši mají měkké nečlánkované tělo. Ulita z jednoho kusu a tykadla = plži, schránka ze dvou misek bez hlavy = mlži, chapadla s přísavkami v moři = hlavonožci.",
      steps: [
        "Najdi v zadání znak: schránku (kolik kusů), hlavu, nohu nebo chapadla.",
        "Nenech se zmást jedním znakem (chybějící ulita, sliz, život ve vodě) a hledej ten, který má jen jedna skupina.",
        "U otázek „proč“ spoj znak se způsobem života: filtrování, plazení, lov.",
      ],
      commonMistake: "Myslet si, že každý živočich se schránkou je plž, nebo že plzák a chobotnice nejsou měkkýši, protože nemají ulitu.",
      example: "Slávka má schránku ze dvou misek a nemá hlavu, proto je to mlž, ne plž.",
    },
  },
];
