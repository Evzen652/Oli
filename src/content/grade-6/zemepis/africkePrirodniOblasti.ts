/**
 * Zeměpis 6. ročník — Africké přírodní oblasti: Sahara, savany, deštné lesy (select_one).
 *
 * K tématu nejsou mapy ani obrázky. Poloha se popisuje slovy (kolem rovníku,
 * kolem obratníku Raka, severně a jižně od rovníkového pásu) nebo zeměpisnou
 * šířkou přes `sirka()`; podnebí číslem srážek a teplot.
 *
 * Téma stojí na jednom řetězci: teplo a srážky → vegetace → život lidí.
 * Všechno je select_one (žádné míchání typů).
 *
 * Gradace:
 *  • L1 — zapamatování jedné oblasti = jeden znak. Banka faktů (Sahara, oáza,
 *    povrch, denní rozdíl teplot, povodí Konga), otázky „která oblast má
 *    znak X“ a „které zvíře patří kam“.
 *  • L2 — aplikace pravidla na případ: popis podnebí → vegetace, oblast →
 *    způsob života lidí, pořadí pásů od rovníku k obratníku, příčiny
 *    (proč zvířata táhnou za vodou, proč je v lese šero, proč jsou lidé u oáz).
 *  • L3 — přenos: oblast z nového popisu bez pojmenování, rozhodnutí o
 *    neznámé stanici podle zeměpisné šířky a srážek, příčina a důsledek
 *    zásahu (dezertifikace v Sahelu, kácení deštného lesa).
 *
 * Chybový model: Sahara jen písek; noc v poušti stejně horká jako den;
 * zvířata deštného lesa a savany zaměněná; hrb velblouda jako zásoba vody;
 * poušť se šíří jen kvůli větru (bez lidského vlivu); kácení lesa jako
 * „stromy dorostou“; rostliny mírného pásu v tropech.
 *
 * Fakta jsou omezená na shodu učebnic zeměpisu 6. ročníku (Fraus, Nová škola,
 * SPN): Sahara = největší horká poušť světa na severu Afriky (duny jen
 * z části), oáza, savana = tráva s roztroušenými stromy a střídáním sucha a
 * dešťů, deštný les kolem rovníku (povodí Konga) — celoročně teplo a vlhko.
 * Bez přesných čísel rozlohy a teplot. Rotace šablon je uvnitř gen(),
 * modul nedrží žádný stav.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import {
  pick,
  pickN,
  shuffle,
  rnd,
  cis,
  sirka,
  losUlohy,
  ruzneUlohy,
  buildChoiceTask as choice,
  type Distractor,
} from "./_shared";

type Tvurce = () => PracticeTask | null;

/** Úloha nesmí mít klíč ve znění otázky ani v nápovědě — jinak ji vylosujeme znovu. */
function hlidej(t: PracticeTask | null): PracticeTask | null {
  if (!t) return null;
  if (t.question.includes(t.correctAnswer)) return null;
  for (const h of t.hints ?? []) if (h.includes(t.correctAnswer)) return null;
  return t;
}

const velke = (s: string) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`;

/** Pytlík: každý prvek vyjde jednou, než se pytlík znovu naplní. Drží se uvnitř gen(). */
function pytlik<T>(prvky: T[]): () => T {
  let zbytek: T[] = [];
  return () => {
    if (zbytek.length === 0) zbytek = shuffle(prvky);
    return zbytek.pop()!;
  };
}

// ── Oblasti a jejich záměny ────────────────────────────────────────────────

type Ob = "P" | "S" | "L";
const JM: Record<Ob, string> = { P: "poušť", S: "savana", L: "deštný les" };
const GEN: Record<Ob, string> = { P: "pouště", S: "savany", L: "deštného lesa" };
const CTVRTA = ["středomořské pobřeží", "vysokohorská oblast"];
const PROC_CTVRTA: Record<string, string> = {
  "středomořské pobřeží":
    "Středomořské pobřeží leží na severním okraji Afriky u Středozemního moře. Deště tam padají hlavně v zimě, jde o mírný pás s tvrdolistým porostem. Popsané místo je horká oblast s jiným typem vegetace.",
  "vysokohorská oblast":
    "Vysokohorská oblast se pozná podle velké nadmořské výšky a chladu ve výškách. O horách se v zadání nic neříká, jde o krajinu, kterou určují srážky a teplo.",
};

/** Proč je záměna špatně: [kterou oblast zadání popisuje][kterou oblast žák zvolil]. */
const PROC: Record<Ob, Partial<Record<Ob, string>>> = {
  P: {
    S: "V savaně prší v období dešťů dost, aby rostla tráva se stromy. Popsané místo má srážek mnohem méně a vegetace je řídká.",
    L: "Deštný les potřebuje vydatné deště celý rok. Popsané místo je naopak velmi suché a hustý porost by tam nevyrostl.",
  },
  S: {
    P: "Poušť má velmi málo srážek a téměř žádnou souvislou vegetaci. Popis ale odpovídá krajině s travou a s obdobím dešťů.",
    L: "Deštný les má vydatné deště celý rok a hustý porost stromů. Popsané místo má souvislou trávu a část roku je v něm sucho.",
  },
  L: {
    P: "Poušť má velmi málo srážek a téměř žádnou souvislou vegetaci. Popsané místo je naopak vlhké a hustě zarostlé.",
    S: "V savaně roste tráva s roztroušenými stromy a část roku je suchá. Popsané místo je hustě zarostlé a vlhké celý rok.",
  },
};

/** Úloha „která oblast“: klíč = jméno oblasti, distraktory = zbylé dvě + jedna cizí. */
function oblast(
  kdo: Ob,
  q: string,
  hints: [string, string],
  explanation: string,
): PracticeTask | null {
  // Čtvrtá možnost je jen tam, kde je záměna aspoň pravděpodobná:
  // u pouště sousední středomořské pobřeží, jinde vysokohorská oblast.
  const cizi = kdo === "P" ? CTVRTA[0] : CTVRTA[1];
  const d: Distractor[] = [
    ...(["P", "S", "L"] as Ob[])
      .filter((o) => o !== kdo)
      .map((o): Distractor => ({ value: JM[o], why: PROC[kdo][o]! })),
    { value: cizi, why: PROC_CTVRTA[cizi] },
  ];
  return hlidej(choice(q, JM[kdo], d, { hints, explanation }));
}

// ── Faktická banka (sentence options) ──────────────────────────────────────

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

// ── L1 ─────────────────────────────────────────────────────────────────────

const BANKA_L1: Fakt[] = [
  {
    q: "Co platí o Sahaře?",
    key: "Je největší horká poušť světa a leží na severu Afriky.",
    d: [
      ["Je největší deštný les světa a leží kolem rovníku.", "To je popis deštného lesa v povodí Konga. Sahara je naopak oblast, kde téměř neprší."],
      ["Je největší savana světa a leží na jihu Afriky.", "Savana je travnatá krajina se střídáním dešťů a sucha. Sahara je suchá a leží na severu, ne na jihu."],
      ["Je největší studená poušť světa a leží na jihu Afriky.", "Sahara je horká. Největší studenou pouští je led Antarktidy, a Sahara leží na severu, ne na jihu."],
    ],
    hints: [
      "Název Sahara se pojí s jedním z nejsušších míst světa. Uvažuj, kde na kontinentu leží a jaké tam bývá teplo.",
      "Rovník leží uprostřed Afriky a Sahara je od něj velmi daleko. Nejde ani o les, ani o travnatou krajinu, ale o oblast s minimem vody a velkým žárem. Ostatní možnosti porovnej s tím, co víš o poloze a podnebí.",
    ],
    explanation: "Sahara je největší horká poušť světa. Leží na severu Afriky a téměř v celé její šíři prší velmi zřídka. Deštný les leží u rovníku, savana je travnatá krajina mezi lesem a pouští a největší studená poušť je led Antarktidy.",
  },
  {
    q: "Jaký povrch má Sahara?",
    key: "Duny tvoří jen část, většinu zabírají kámen a štěrk.",
    d: [
      ["Celá je pokrytá písečnými dunami bez jediného kamene.", "Písečné duny tvoří jen menší část Sahary. Většinu zabírají kamenité a štěrkové pustiny a stojí tam i pohoří."],
      ["Nemá žádné hory ani oázy, je to jen písečná rovina.", "V Sahaře stojí i vysoká pohoří a jsou v ní oázy, kde vyvěrá voda. Rozhodně to není jen rovina písku."],
      ["Nejsou v ní žádné duny, je celá z tvrdého kamene.", "Duny v Sahaře jsou, i když zabírají jen část plochy. Kámen a štěrk sice převažují, ale ne na celém území."],
    ],
    hints: [
      "Většina lidí si při slově poušť představí moře písku. Zkus si rozmyslet, jestli to může platit pro celou obrovskou plochu.",
      "V obrovské poušti se střídají různé povrchy: duny, kámen, štěrk i hory s oázami. Žádný z nich nezabírá úplně všechno a tvrzení, které říká „celá“ nebo „žádné“, bývá u tak velkého území nepravdivé.",
    ],
    explanation: "Sahara není jen písek. Písečné duny tvoří jen menší část jejího území. Většinu zabírají kamenité a štěrkové pustiny a stojí v ní i pohoří a oázy.",
  },
  {
    q: "Jak se v poušti mění teplota během dne a noci?",
    key: "Ve dne bývá velmi horko a v noci se citelně ochladí.",
    d: [
      ["Noc je stejně horká jako den, protože poušť leží u rovníku.", "Sahara neleží u rovníku, ale blízko obratníku Raka. A hlavně: v suchém vzduchu bez mraků se teplo v noci rychle vyzáří."],
      ["Ve dne bývá chladno a v noci se citelně oteplí.", "Je to obráceně. Slunce za dne rozpálí zemi a po jeho západu se teplo rychle vyzáří."],
      ["Ve dne i v noci je stále chladno a často mrzne.", "V horké poušti nemrzne ve dne a v noci se jen citelně ochladí. Stálý mráz tam není."],
    ],
    hints: [
      "Ve vzduchu bez mraků a bez vlhkosti se teplo drží špatně. Přemýšlej, co se děje, když zapadne slunce.",
      "Suchý vzduch bez oblačnosti zadrží málo tepla, takže po západu slunce se země rychle vyzáří. Rozdíl mezi dnem a nocí je v takové krajině velký; hledej možnost, která popisuje velký rozdíl a správný směr změny (den teplý, noc chladnější).",
    ],
    explanation: "V poušti je suchý vzduch a málo mraků. Za dne slunce rozpálí zemi na velké horko, v noci se teplo rychle vyzáří do prostoru, a proto se citelně ochladí. Rozdíl mezi dnem a nocí je tedy velký.",
  },
  {
    q: "Co je oáza?",
    key: "Místo v poušti, kde je voda a rostou rostliny.",
    d: [
      ["Místo v poušti, kde se zvedají největší písečné duny.", "Duny jsou jen jedním z povrchů pouště a s vodou nemají nic společného. Oázu poznáš podle vody a zeleně."],
      ["Vyschlé koryto řeky v poušti, které je většinu roku bez vody.", "To je popis vyschlého koryta, kterým teče voda jen po vzácném dešti. Oáza má vodu trvale a kolem ní rostou rostliny."],
      ["Místo v poušti, kde pravidelně prší a je hustý les.", "V poušti prší jen vzácně a hustý les tam nevyroste. Oáza je malé místo s vodou z podzemí a s palmami a poli."],
    ],
    hints: [
      "Slovo oáza znáš i z přeneseného významu: příjemné místo uprostřed nepříjemného okolí. Zkus si vzpomenout, co je nepříjemné na poušti.",
      "V poušti platí, že tam, kde se objeví zdroj vody, se okolí změní. Hledej možnost, která popisuje takovou proměnu, a ne další suchou nebo písečnou plochu.",
    ],
    explanation: "Oáza je místo v poušti, kde vyvěrá voda z podzemí. Kolem pramene rostou rostliny, například palmy, a lidé tam mohou žít a pěstovat plodiny. Zbytek pouště je suchý.",
  },
  {
    q: "Co roste v savaně?",
    key: "Tráva s roztroušenými stromy, třeba akácie a baobaby.",
    d: [
      ["Hustý stále zelený les s několika patry stromů nad sebou.", "Takový les roste tam, kde celý rok hodně prší, tedy v deštném lese. Savana má sušší období."],
      ["Jen řídké trnité keře a holá půda mezi kameny.", "To je obraz pouště, kde téměř neprší. V savaně prší v období dešťů dost na souvislou trávu."],
      ["Souvislý jehličnatý les podobný smrkovým lesům v Česku.", "Jehličnaté lesy rostou v chladnějším podnebí. V teplé savaně žádné takové nejsou."],
    ],
    hints: [
      "Slovo savana si spoj s krajinou, kde je vidět široko daleko. Které rostliny nepřekážejí výhledu?",
      "Tam, kde prší jen část roku, se nemůže udržet hustý stále zelený les, ale ani úplná poušť. Stromy tu stojí daleko od sebe a mezi nimi vyrůstá jiný typ rostlin, který se v době dešťů zazelená a v době sucha zežloutne.",
    ],
    explanation: "Savana je krajina s vysokou trávou a roztroušenými stromy, například akáciemi a baobaby. Srážek je dost na trávu, ale kvůli období sucha nestačí na souvislý les.",
  },
  {
    q: "Co platí o deštném lese v Africe?",
    key: "Je stále zelený, vlhký a teplý a žije v něm nejvíc druhů.",
    d: [
      ["Střídá se v něm období dešťů a období sucha, kdy tráva žloutne.", "Takhle vypadá savana. V deštném lese žádné období sucha nenastává a hustý porost je zelený celý rok."],
      ["Je to travnatá krajina, ve které roste jen pár stromů.", "To je popis savany. Deštný les je naopak hustě zarostlý stromy, které rostou v několika patrech."],
      ["Většinu roku je suchý a zelená se jen po vzácném dešti.", "Takhle vypadá poušť. Deštný les má vydatné deště celý rok."],
    ],
    hints: [
      "Rovník je místo, kam Slunce svítí celý rok téměř kolmo a deště padají skoro každý den. Přemýšlej, co to udělá s rostlinami.",
      "Kde je celý rok teplo a vlhko, nemusí rostliny přestat růst kvůli suchu ani zimě, a proto se tam vejde největší množství druhů rostlin i živočichů. Hledej možnost, která popisuje stálé podmínky bez období sucha.",
    ],
    explanation: "Africký deštný les leží kolem rovníku. Je celý rok teplý a vlhký, hustý porost je stále zelený a žije v něm nejvíc druhů rostlin a živočichů ze všech afrických oblastí.",
  },
  {
    q: "V povodí které řeky leží největší africký deštný les?",
    key: "Kongo",
    d: [
      ["Nil", "Nil teče většinu své délky suchou krajinou Súdánu a Egypta a ústí do Středozemního moře. Největší africký deštný les leží u rovníku v povodí jiné řeky."],
      ["Zambezi", "Zambezi teče savanou v jihovýchodní Africe. Deštný les leží ještě blíž k rovníku."],
      ["Orange", "Orange teče na jihu Afriky suchou krajinou u pouští. Deštný les tam neroste."],
    ],
    hints: [
      "Největší africký deštný les leží přímo na rovníku, v samém středu kontinentu. Hledej řeku, která odvodňuje právě tuhle část Afriky.",
      "Deštný les potřebuje vydatné deště celý rok, takže leží u řeky, která protéká středem kontinentu blízko rovníku. Vyřaď řeky, které protékají suchou krajinou na severu nebo na jihu, a řeky ze savany na jihovýchodě.",
    ],
    explanation: "Největší africký deštný les leží v povodí řeky Kongo, přímo kolem rovníku. Nil teče suchou krajinou na severu, Zambezi savanou na jihovýchodě a Orange suchým jihem.",
  },
  {
    q: "V které části Afriky leží Sahara?",
    key: "na severu kontinentu",
    d: [
      ["na jihu kontinentu", "Na jihu Afriky leží jiné oblasti, například savana a poušť Kalahari. Sahara je na opačné straně kontinentu."],
      ["kolem rovníku", "Kolem rovníku leží deštný les, kde je celý rok vlhko. Sahara je od rovníku daleko."],
      ["na jihovýchodě kontinentu", "Na jihovýchodě Afriky leží spíš savana a hory. Sahara leží na severu."],
    ],
    hints: [
      "Zamysli se, jak se s polohou vůči rovníku mění množství srážek, a vzpomeň si, že Sahara je největší horká poušť světa.",
      "Které z nabízených míst leží od rovníku nejdál a zároveň v pásu, kde téměř neprší? Kolem rovníku je naopak vlhko, takže tuto možnost vyřaď a ostatní porovnej s tím, kde v Africe jsou nejsušší oblasti.",
    ],
    explanation: "Sahara leží na severu Afriky, kolem obratníku Raka, daleko od rovníku. Kolem rovníku je vlhký deštný les a na jihu jsou jiné oblasti.",
  },
];

/** L1: otázky typu „která oblast má znak“ — klíč je jméno oblasti. */
interface OblastL1 {
  o: Ob;
  q: string;
  hints: [string, string];
  explanation: string;
}
const OBLASTI_L1: OblastL1[] = [
  {
    o: "L",
    q: "Která africká oblast leží kolem rovníku a je celý rok vlhká, teplá a stále zelená?",
    hints: [
      "Rovník je místo, kam Slunce svítí celý rok téměř kolmo. Přemýšlej, jaká vegetace se hodí k neustálému teplu a vlhku.",
      "Kolem rovníku prší téměř každý měsíc, takže tam nikdy nenastane období sucha. Hledej oblast, kde je vody nejvíc a vegetace je nejhustší; oblast s trávou nebo s pískem k rovníku nepatří.",
    ],
    explanation: "Kolem rovníku je celý rok teplo a každý měsíc prší. Proto tam roste hustý stále zelený les, africký deštný les.",
  },
  {
    o: "P",
    q: "Do které africké oblasti patří Sahara?",
    hints: [
      "Sahara je pojem, který se pojí s extrémním suchem a žárem. Hledej oblast, kde je vody nejméně.",
      "Sahara je krajina, kde prší jen zřídka a někdy několik let vůbec. Roste tam málo rostlin, takže oblast s hustým lesem nebo souvislou travou nemůže být správně.",
    ],
    explanation: "Sahara je největší horká poušť světa. Prší v ní velmi málo a rostlin je tam jen poskrovnu.",
  },
  {
    o: "S",
    q: "Která africká oblast je travnatá krajina s roztroušenými stromy, například akáciemi a baobaby?",
    hints: [
      "Ptáš se na krajinu, kde je vidět daleko, protože stromy stojí od sebe. Vzpomeň si, jaká rostlina tvoří většinu porostu.",
      "Krajina mezi hustým vlhkým lesem a suchými pustinami má dost srážek, aby vyrostla tráva, ale málo, aby vyrostl souvislý les. Hledej oblast, která je právě takovým přechodem.",
    ],
    explanation: "Travnatou krajinu s roztroušenými stromy má savana. Prší v ní v období dešťů, ale část roku je sucho, a proto tam souvislý les nevyroste.",
  },
  {
    o: "S",
    q: "V které horké africké oblasti s celoročním teplem se střídá období sucha s obdobím dešťů?",
    hints: [
      "Hledej oblast, kde srážky nepadají rovnoměrně celý rok, ale jen jeho část. Vylučuj oblasti, kde prší pořád nebo skoro nikdy.",
      "Vegetace v takové oblasti se v době dešťů zazelená a v době sucha zežloutne. Tam, kde prší celý rok, se střídání neděje, a tam, kde neprší skoro nikdy, není co střídat.",
    ],
    explanation: "Střídání období dešťů a sucha je hlavní znak savany. Deštný les má deště celý rok a v poušti neprší téměř nikdy.",
  },
  {
    o: "L",
    q: "Ve které africké oblasti žije nejvíc druhů rostlin a živočichů?",
    hints: [
      "Počet druhů závisí na tom, kolik má příroda potravy, vody a úkrytů. Kde jsou celý rok stálé podmínky, tam se vejde nejvíc druhů.",
      "Nejbohatší oblast je zároveň ta, kde je celý rok nejvíc tepla a vláhy a kde rostliny rostou v několika patrech nad sebou, takže tam je nejvíc úkrytů a potravy. Oblast s malým množstvím vody na druhy bohatá být nemůže.",
    ],
    explanation: "Nejvíc druhů žije v deštném lese. Je tam celý rok teplo a vlhko a rostliny rostou v několika patrech, takže je tam nejvíc potravy a úkrytů.",
  },
  {
    o: "P",
    q: "V které africké oblasti prší nejméně, někdy i několik let vůbec?",
    hints: [
      "Rozhoduje jediné: kde je srážek nejméně. Uvažuj, které oblasti mají aspoň nějaké období dešťů, a ty vyřaď.",
      "Kolem obratníků leží nejsušší pásy Země, protože tam vzduch klesá a mraky se netvoří. Vylučuj oblasti, kde se pravidelně objevuje období dešťů, a vybírej tu, kde se voda objeví jen zřídka.",
    ],
    explanation: "Nejméně srážek má poušť, například Sahara. Prší tam vzácně a někdy několik let vůbec.",
  },
  {
    o: "P",
    q: "V které africké oblasti najdeš oázy a karavany?",
    hints: [
      "Karavana je skupina lidí a zvířat, která putuje se zbožím na dlouhé cesty. Oáza je místo, kde se dá napít. Kde jsou takové zastávky potřeba?",
      "Zastávky se zakládají tam, kde jsou od sebe zdroje vody hodně daleko, tedy tam, kde je vody nejméně celý rok. V hustém lese je vody dost stále, v travnaté krajině aspoň v období dešťů, takže tam karavany putovat nemusejí.",
    ],
    explanation: "Oázy a karavany patří do pouště. Voda je tam jen na vzácných místech, a proto karavany putují od oázy k oáze.",
  },
  {
    o: "S",
    q: "Do které oblasti Afriky nejčastěji jezdí turisté na safari za velkými zvířaty?",
    hints: [
      "Safari znamená pozorovat velká zvířata z auta. K tomu se hodí otevřená krajina, kde je zvířata vidět z dálky.",
      "V hustém lese mezi stromy nevidíš dál než pár metrů a v poušti žije zvířat málo. Hledej oblast, kde je hodně trávy pro velká stáda a nic nezakrývá výhled.",
    ],
    explanation: "Na safari se jezdí do savany. Otevřená travnatá krajina uživí velká stáda a zvířata jsou tam dobře vidět.",
  },
];

/** L1: zvířata — klíč je zvíře oblasti; distraktory jen jednoznačná zvířata jiných oblastí. */
interface Zvire {
  jm: string;
  o: Ob;
  det: string;
  clue: string;
  /** volitelná první nápověda místo obecné (u méně známých zvířat vysvětlí, co zvíře je) */
  hint0?: string;
  /** smí být distraktorem u otázky na jinou oblast (je jednoznačné) */
  safe: boolean;
}
const ZVIRATA: Zvire[] = [
  { jm: "velbloud", o: "P", det: "je přizpůsobený vedru a suchu", clue: "Dlouho se obejde bez pití a jeho široké nohy se v písku nebořijí.", safe: true },
  { jm: "fenek", o: "P", det: "se chladí velkýma ušima a žije v písku", clue: "Je to malá liška s obrovskýma ušima, kterými se zbavuje horka.", safe: true },
  { jm: "škorpion", o: "P", det: "přečká horko zavrtaný v písku", clue: "Je to pavoukovec s klepety a jedovatým bodcem na konci těla.", safe: false },
  { jm: "slon", o: "S", det: "se pase na trávě v otevřené krajině", clue: "Je to největší suchozemský savec, má chobot a dlouhé kly.", safe: false },
  { jm: "žirafa", o: "S", det: "okusuje koruny akácií v otevřené krajině", clue: "Má nejdelší krk ze všech zvířat a okusuje koruny stromů.", safe: true },
  { jm: "zebra", o: "S", det: "žije ve stádech v travnaté krajině", clue: "Má pruhovanou srst a žije ve velkých stádech.", safe: true },
  { jm: "lev", o: "S", det: "loví stáda býložravců v otevřené krajině", clue: "Je to největší africká šelma a samci mají hřívu.", safe: true },
  { jm: "antilopa", o: "S", det: "se ve stádech pase na trávě a před šelmami utíká", clue: "Je to štíhlý býložravec s rohy, který šelmám uniká rychlým během.", safe: false },
  { jm: "nosorožec", o: "S", det: "se pase na trávě a keřích v otevřené krajině", clue: "Je to obří býložravec s rohem na nose.", safe: true },
  { jm: "gorila", o: "L", det: "žije v hustém vlhkém lese a živí se listy a plody", clue: "Je to největší z lidoopů a živí se hlavně rostlinami.", safe: true },
  { jm: "šimpanz", o: "L", det: "žije hlavně v hustém lese a šplhá po stromech", clue: "Je to lidoop, který používá jednoduché nástroje a žije ve skupinách.", safe: false },
  { jm: "okapi", o: "L", det: "se skrývá ve stínu vlhkého lesa", clue: "Na rozdíl od žirafy má krátký krk a ukrývá se ve stínu stromů, kde ho šelmy hůř vidí.", hint0: "Zvíře musí žít v hustém, vlhkém a stínu bohatém lese. Jedno z nabízených je lesní příbuzný žirafy a ostatní jsou zvířata jiných krajin.", safe: false },
];

const HINT_ZVIRE: Record<Ob, string> = {
  P: "Zvíře musí zvládat velké vedro a téměř žádnou vodu. Přemýšlej, které z nabízených takové podmínky snese.",
  S: "Zvíře se musí uživit v otevřené krajině s trávou a roztroušenými stromy. Přemýšlej, které z nabízených se tam může pást nebo lovit.",
  L: "Zvíře musí žít v hustém, vlhkém a stínu bohatém lese plném stromů. Přemýšlej, které z nabízených se tam pohybuje mezi stromy.",
};

function zvire(o: Ob): PracticeTask | null {
  const key = pick(ZVIRATA.filter((z) => z.o === o));
  const d = pickN(ZVIRATA.filter((z) => z.o !== o && z.safe), 3).map(
    (z): Distractor => ({
      value: z.jm,
      why: `${velke(z.jm)} ${z.det}, a patří proto do ${GEN[z.o]}, ne do ${GEN[o]}.`,
    }),
  );
  return hlidej(
    choice(`Které zvíře patří do ${GEN[o]}?`, key.jm, d, {
      hints: [
        key.hint0 ?? HINT_ZVIRE[o],
        `${key.clue} Podle toho poznáš, které ze čtyř zvířat do této krajiny patří, a ostatní vyřaď podle toho, kde žijí.`,
      ],
      explanation: `${velke(key.jm)} ${key.det}, a proto patří do ${GEN[o]}. Ostatní nabízená zvířata žijí v jiných oblastech.`,
    }),
  );
}

// ── L2 ─────────────────────────────────────────────────────────────────────

// Vegetace
const VEG: Record<Ob, string> = {
  L: "hustý stále zelený les",
  S: "tráva s roztroušenými stromy",
  P: "jen řídké trnité keře a holá půda",
};
const VEG_CTVRTA = ["listnatý les, který na zimu opadává", "mechy a lišejníky bez jediného stromu"];
/** První věta zpětné vazby: co ta vegetace potřebuje. */
const VEG_FB1: Record<string, string> = {
  [VEG.L]: "Hustý stále zelený les potřebuje vydatné deště v každém měsíci roku.",
  [VEG.S]: "Tráva s roztroušenými stromy potřebuje období dešťů, ale i období sucha.",
  [VEG.P]: "Jen řídké trnité keře a holá půda vydrží tam, kde srážky spadnou jen vzácně.",
  [VEG_CTVRTA[0]]: "Listnatý les, který na zimu opadává, patří do mírného pásu, ne do horké Afriky.",
  [VEG_CTVRTA[1]]: "Mechy a lišejníky bez jediného stromu rostou v chladné tundře u pólů, ne v horké Africe.",
};
const VEG_POPIS: Record<Ob, string> = {
  P: "Popsané místo ale má srážek velmi málo.",
  S: "Popsané místo ale má střídání dešťů a sucha.",
  L: "Popsané místo ale má vydatné deště celý rok.",
};

interface VegVar {
  o: Ob;
  q: string;
  hints: [string, string];
  explanation: string;
}
const VEG_L2: VegVar[] = [
  {
    o: "L",
    q: "V jedné africké oblasti je celý rok horko a každý měsíc vydatně prší. Jaká vegetace tam roste?",
    hints: [
      "Rozhoduj podle dvou údajů: kolik je tepla a v kolika měsících prší. Vegetace vždy sleduje vodu.",
      "Zadání říká, že v žádném měsíci nechybí voda ani teplo. Zvaž, který typ porostu si může dovolit růst nepřetržitě celý rok, a vyřaď ty, které se přizpůsobují suchu nebo chladu.",
    ],
    explanation: "Kde je celý rok horko a každý měsíc vydatně prší, rostliny nikdy netrpí suchem. Roste tam proto hustý stále zelený les, v Africe deštný les.",
  },
  {
    o: "L",
    q: "Blízko rovníku se teplota za rok téměř nemění a déšť padá skoro každý den. Jaká vegetace tam roste?",
    hints: [
      "Blízko rovníku je celý rok stejné teplo. Zeptej se, jestli tam někdy nastane období, kdy by rostliny nemohly růst.",
      "Když prší téměř denně a nikdy není chladno, rostliny nemají důvod přerušit růst. Zvaž, který typ porostu zvládne růst pořád a v několika výškách nad sebou, a vyřaď ty, které potřebují sušší nebo chladnější období.",
    ],
    explanation: "U rovníku je stále teplo a déšť padá téměř každý den. Rostliny mají celý rok dost vody i tepla, a proto tam roste hustý stále zelený les.",
  },
  {
    o: "L",
    q: "Místo v Africe dostává ročně velmi mnoho srážek, rozložených do všech měsíců, a je stále teplo. Jaká vegetace tam roste?",
    hints: [
      "Všimni si, že srážky jsou rozdělené do všech měsíců. Zeptej se, co to znamená pro rostliny, které by jinak musely přečkat sucho.",
      "Když je srážek mnoho a padají rovnoměrně, není důvod, aby rostliny shazovaly listy nebo usychaly. Vyber možnost, jejíž rostliny by z takových podmínek vytěžily co nejvíc, a vyřaď typy porostu určené pro sucho nebo chlad.",
    ],
    explanation: "Velké množství srážek rozložené do celého roku a stálé teplo dávají rostlinám ideální podmínky. Vyroste tam hustý stále zelený les.",
  },
  {
    o: "S",
    q: "V jedné africké oblasti je celý rok teplo, ale déšť padá jen pár měsíců a zbytek roku je sucho. Jaká vegetace tam roste?",
    hints: [
      "Všimni si, že prší jen část roku. Zeptej se, jaká vegetace zvládne přečkat suché měsíce a po dešti se rychle zazelenat.",
      "Prší jen pár měsíců, takže rostliny musí zvládnout dlouhé sucho, a přitom deště stačí na rychlý růst po dešti. Vyřaď porost, který potřebuje vodu pořád, i ten, kterému nestačí ani období dešťů.",
    ],
    explanation: "Když prší jen pár měsíců a zbytek roku je sucho, souvislý les nevyroste, ale na trávu deště stačí. Vzniká tráva s roztroušenými stromy, savana.",
  },
  {
    o: "S",
    q: "Část roku tam vydatně prší, část roku vůbec, teplota je stále vysoká. Jaká vegetace tam roste?",
    hints: [
      "Rozhoduje střídání dvou období. Zeptej se, která vegetace se v době dešťů zazelená a v době sucha zežloutne.",
      "Střídání dešťů se suchem nedovolí souvislý les, ale zároveň dává rostlinám dost vody na rychlý růst. Zvaž, který typ porostu je kompromisem mezi vlhkým lesem a suchou pustinou.",
    ],
    explanation: "Střídání vydatných dešťů a sucha při stálém teple vytvoří krajinu, kde se zelená tráva střídá se zežloutlou a stromy stojí daleko od sebe. To je savana.",
  },
  {
    o: "S",
    q: "V oblasti se střídá období dešťů a období sucha a nikdy tam nemrzne. Jaká vegetace tam roste?",
    hints: [
      "Ze zadání vyčti dvě věci: střídání dešťů se suchem a stálé teplo. Vegetace musí vydržet obě období.",
      "Rostliny musí přečkat suché měsíce a po dešti se rychle obnovit. Zamysli se, který typ porostu tohle umí, a vyřaď ty, které potřebují vodu neustále nebo v suchu vůbec nepřežijí.",
    ],
    explanation: "Střídání období dešťů a sucha bez mrazu dává vegetaci, která vydrží obě období: tráva s roztroušenými stromy, savana.",
  },
  {
    o: "P",
    q: "V jedné africké oblasti je celoročně horko a srážky spadnou jen vzácně, někdy několik let žádné. Jaká vegetace tam roste?",
    hints: [
      "Všimni si, že srážky spadnou jen vzácně. Vegetace závisí na vodě, a tak zjisti, co dokáže přežít s minimem vody.",
      "Rostliny tu musí šetřit každou kapkou vody, a proto jich je málo a jsou malé. Vyřaď porosty, které potřebují pravidelné deště, a hledej ten, který zvládne dlouhé období bez vody.",
    ],
    explanation: "Kde je celoročně horko a srážky jsou vzácné, dokážou přežít jen rostliny, které šetří vodou: trnité keře s hlubokými kořeny. Většina půdy zůstává holá.",
  },
  {
    o: "P",
    q: "Slunce tam září téměř bez mraků a za rok tam spadne jen zlomek srážek, které padnou v Česku. Jaká vegetace tam roste?",
    hints: [
      "Porovnej množství srážek s Českem, kde rostou lesy a louky. Zeptej se, co se stane s vegetací, když je srážek jen zlomek.",
      "Když je vody tak málo, nevyroste souvislý porost a rostliny se musí přizpůsobit šetření vodou. Porovnej, který typ vegetace potřebuje nejmíň vody, a ostatní vyřaď.",
    ],
    explanation: "Když je srážek jen zlomek toho, co spadne v Česku, nemůže vyrůst les ani souvislá tráva. Rostou tam jen řídké trnité keře a většina půdy je holá.",
  },
  {
    o: "P",
    q: "V oblasti spadne ročně velmi málo srážek a mezi dnem a nocí je velký rozdíl teplot. Jaká vegetace tam roste?",
    hints: [
      "Velký rozdíl mezi dnem a nocí a málo srážek jsou dva znaky téhož prostředí. Zeptej se, jaká vegetace v něm může přežít.",
      "Suchý vzduch s malou oblačností znamená málo vody a výkyvy teploty. Zvaž, který typ porostu je nejnenáročnější na vodu a snese výkyvy teploty, a vyřaď ty, které potřebují pravidelný déšť.",
    ],
    explanation: "Velmi málo srážek a velký denní rozdíl teplot vytvoří prostředí, ve kterém přežijí jen nenáročné trnité keře. Většina půdy zůstává holá.",
  },
];

// Způsob života
const ZIV: Record<Ob, string> = {
  P: "karavany, pastva velbloudů a pěstování datlí",
  S: "pastva dobytka a safari v národních parcích",
  L: "těžba dřeva a pěstování banánů a kakaovníků",
};
const ZIV_CTVRTA = "pěstování pšenice a cukrové řepy na polích";
const ZIV_FB1: Record<string, string> = {
  [ZIV.P]: "Karavany, pastva velbloudů a pěstování datlí jsou typické tam, kde je málo vody a jen oázy.",
  [ZIV.S]: "Pastva dobytka a safari jsou typické tam, kde roste tráva pro stáda.",
  [ZIV.L]: "Těžba dřeva a pěstování banánů a kakaovníků patří tam, kde je vlhký les.",
  [ZIV_CTVRTA]: "Pěstování pšenice a cukrové řepy je typické pro mírný pás, ne pro horkou Afriku.",
};
const ZIV_POPIS: Record<Ob, string> = {
  P: "Popsané místo je ale velmi suché a voda je jen u pramenů.",
  S: "Popsané místo je ale krajina s trávou, kde se střídá sucho s deštěm.",
  L: "Popsané místo je ale hustý vlhký les.",
};

interface ZivVar {
  o: Ob;
  q: string;
  hints: [string, string];
  explanation: string;
}
const ZIV_L2: ZivVar[] = [
  {
    o: "P",
    q: "Čím se tradičně živí lidé v horké oblasti, kde téměř neprší a voda je jen na vzácných místech?",
    hints: [
      "Lidé se živí tím, co jim krajina dovolí. Zamysli se, co se dá dělat tam, kde je vody málo.",
      "Voda je tu jen na vzácných místech a život se kolem nich soustředí. Zvaž, jaké činnosti jdou provozovat s minimem vody a jak se lidé dostanou od jednoho zdroje k druhému, a vyřaď ty, které potřebují deště nebo les.",
    ],
    explanation: "V poušti se dá žít jen u vody a s málo náročnými zvířaty. Nomádi putují s karavanami a pasou velbloudy, v oázách pěstují datle a další plodiny.",
  },
  {
    o: "P",
    q: "Jak se živí lidé v oblasti, kde je málo vody a nejvíc lidí bydlí kolem pramenů?",
    hints: [
      "Kolem pramenů se v takové oblasti soustřeďuje všechno, na co je potřeba voda. Přemýšlej, co lidé pěstují a čím se živí.",
      "Tam, kde voda vyvěrá, se dají pěstovat plodiny, ale okolí je suché. Zvaž, jaká hospodářská zvířata se uživí bez pravidelného pití a jak se přepravuje zboží mezi vzdálenými zdroji vody.",
    ],
    explanation: "Lidé v poušti jsou vázaní na prameny. Využívají karavany k přepravě zboží, pasou velbloudy a v oázách pěstují například datlové palmy.",
  },
  {
    o: "S",
    q: "Čím se tradičně živí lidé v oblasti, kde je hodně trávy pro zvířata a střídá se sucho s deštěm?",
    hints: [
      "Trávu využívají zvířata, která se na ní pasou. Zamysli se, co z toho může mít člověk.",
      "V travnaté krajině se uživí velká stáda, která lidé chovají, a kromě nich tam žijí divoká zvířata, která zajímají lidi z celého světa. Vyřaď činnosti, které potřebují les nebo oázy.",
    ],
    explanation: "V savaně se dobře daří pastvě dobytka. Velká divoká zvířata navíc přitahují turisty, proto tam vznikly národní parky se safari.",
  },
  {
    o: "S",
    q: "Jak lidé nejčastěji využívají krajinu s rozlehlými pastvinami a velkými stády divokých zvířat?",
    hints: [
      "Pastviny jsou vhodné pro určité činnosti. Zamysli se, co se dá dělat s velkými travnatými plochami a s divokými zvířaty.",
      "Velké travnaté plochy uživí stáda, která lidé chovají, a divoká zvířata jsou zajímavá pro návštěvníky z daleka. Vyřaď činnosti, které patří do hustého lesa nebo k pramenům v suché krajině.",
    ],
    explanation: "Rozlehlé pastviny se využívají k pastvě dobytka. Divoká zvířata jsou navíc atrakcí pro turisty a chrání se v národních parcích, kam se jezdí na safari.",
  },
  {
    o: "L",
    q: "Čím se živí lidé v horké a vlhké oblasti pokryté hustým lesem, kde prší celý rok?",
    hints: [
      "Rozhoduje, co dává krajina: v takovém prostředí je nejvíc stromů a rostlin. Přemýšlej, jak to lidé využívají.",
      "Stromy jsou tu surovinou a v teple a vlhku rostou i plodiny, které v suchu nevyrostou. Zvaž, jaké činnosti z toho plynou, a vyřaď ty, které patří do sucha nebo do travnaté krajiny.",
    ],
    explanation: "V deštném lese se těží dřevo a na pasekách se pěstují plodiny, které potřebují teplo a vlhko, například banány a kakaovníky.",
  },
  {
    o: "L",
    q: "Jak lidé využívají krajinu tam, kde rostou vysoké stromy a půda je vlhká a teplá?",
    hints: [
      "Vysoké stromy jsou zdrojem jedné důležité suroviny. Zeptej se také, co roste na vlhké a teplé půdě.",
      "Kde je celý rok teplo a vlhko, jsou stromy cennou surovinou a rostou tu plodiny, které v suchu nevyrostou. Porovnej nabízené činnosti s tím, jestli by se v takovém prostředí daly provozovat.",
    ],
    explanation: "V deštném lese se těží dřevo a na vykácených plochách se pěstují plodiny náročné na teplo a vláhu, například banány a kakaovníky.",
  },
];

function vegetace(v: VegVar): PracticeTask | null {
  const cizi = pick(VEG_CTVRTA);
  const dist: Distractor[] = [
    ...(["P", "S", "L"] as Ob[])
      .filter((o) => o !== v.o)
      .map((o): Distractor => ({ value: VEG[o], why: `${VEG_FB1[VEG[o]]} ${VEG_POPIS[v.o]}` })),
    { value: cizi, why: `${VEG_FB1[cizi]} ${VEG_POPIS[v.o]}` },
  ];
  return hlidej(choice(v.q, VEG[v.o], dist, { hints: v.hints, explanation: v.explanation }));
}

function zivot(v: ZivVar): PracticeTask | null {
  const dist: Distractor[] = [
    ...(["P", "S", "L"] as Ob[])
      .filter((o) => o !== v.o)
      .map((o): Distractor => ({ value: ZIV[o], why: `${ZIV_FB1[ZIV[o]]} ${ZIV_POPIS[v.o]}` })),
    { value: ZIV_CTVRTA, why: `${ZIV_FB1[ZIV_CTVRTA]} ${ZIV_POPIS[v.o]}` },
  ];
  return hlidej(choice(v.q, ZIV[v.o], dist, { hints: v.hints, explanation: v.explanation }));
}

/** L2: pořadí pásů od rovníku k obratníku a příčiny. */
const BANKA_L2: Fakt[] = [
  {
    q: "Vydáš se z deštného lesa kolem rovníku na sever k obratníku Raka. Jak se bude měnit krajina?",
    key: "Nejdřív savana a dál na sever poušť.",
    d: [
      ["Nejdřív poušť a dál na sever savana.", "Pořadí je obrácené. Od rovníku srážek ubývá, takže suchá poušť leží nejdál od vlhkého lesa."],
      ["Nejdřív savana a dál na sever ještě hustší les.", "Hustší les by potřeboval víc srážek než u rovníku, a to není možné. Od rovníku srážek ubývá, takže les řídne."],
      ["Krajina se nemění, les pokračuje až k obratníku.", "Krajina se mění, protože s rostoucí vzdáleností od rovníku ubývá srážek. Les k obratníku nedosahuje."],
    ],
    hints: [
      "Pásy Afriky se řadí od rovníku k obratníkům podle toho, kolik srážek spadne. Zeptej se, jestli srážek směrem od rovníku přibývá, nebo ubývá.",
      "Kolem rovníku prší nejvíc a směrem k obratníkům srážek ubývá. Krajina se proto postupně mění: z vlhkého porostu na sušší a potom na nejsušší. Seřaď si podle toho tři typické oblasti od nejvlhčí k nejsušší a hledej možnost s takovým pořadím.",
    ],
    explanation: "Od rovníku k obratníku Raka srážek ubývá. Kolem rovníku je deštný les, dál na sever savana s obdobím sucha a u obratníku poušť.",
  },
  {
    q: "Vydáš se z Sahary od obratníku Raka na jih k rovníku. Jak se bude měnit krajina?",
    key: "Nejdřív savana a dál k rovníku deštný les.",
    d: [
      ["Nejdřív deštný les a dál k rovníku savana.", "Pořadí je obrácené. Sahara je nejsušší a k rovníku srážek přibývá, takže nejvlhčí les je až u rovníku."],
      ["Nejdřív savana a dál k rovníku ještě větší poušť.", "Poušť by u rovníku nevznikla, protože tam prší nejvíc. Od Sahary k rovníku srážek přibývá."],
      ["Krajina se nemění, poušť pokračuje až k rovníku.", "Krajina se mění, protože k rovníku srážek přibývá. Poušť u rovníku neexistuje."],
    ],
    hints: [
      "Cesta vede opačným směrem než od rovníku: z nejsušší části kontinentu k nejvlhčí. Rozmysli si, jak se s tím bude měnit množství srážek.",
      "Od obratníku k rovníku srážek přibývá, takže krajina se postupně mění ze suché na vlhčí. Seřaď si tři typické oblasti od nejsušší k nejvlhčí a porovnej to s nabízenými možnostmi.",
    ],
    explanation: "Směrem od Sahary k rovníku srážek přibývá. Za pouští následuje savana s obdobím dešťů a u rovníku vlhký deštný les.",
  },
  {
    q: "Proč se africké přírodní oblasti řadí od rovníku k obratníkům do pásů?",
    key: "Od rovníku k obratníkům ubývá srážek, a tak se mění vegetace.",
    d: [
      ["Od rovníku k obratníkům přibývá srážek, a tak se mění vegetace.", "Srážky se mění opačným směrem: nejvíc jich spadne u rovníku a k obratníkům ubývá."],
      ["Od rovníku k obratníkům prudce klesá teplota, a tak se mění vegetace.", "Teplota se od rovníku k obratníkům mění jen málo, všude je horko. Hlavní roli hrají srážky."],
      ["Pásy vymezily lidé podle toho, kde a jak hospodaří.", "Přírodní oblasti vymezuje podnebí, ne lidé. Lidé se naopak přizpůsobují tomu, co v oblasti roste."],
    ],
    hints: [
      "Pásy vznikají z toho, co se s krajinou mění od rovníku k obratníku. Zeptej se, který podnební údaj se mění nejvíc.",
      "Teplo je v celé tropické Africe podobné, takže rozhoduje množství vody. Zaměř se na to, jestli s rostoucí vzdáleností od rovníku srážek přibývá, nebo ubývá, a odmítni vysvětlení, ve kterém nehraje roli podnebí.",
    ],
    explanation: "V tropické Africe je teplo všude podobné, ale srážek od rovníku k obratníkům ubývá. Proto se vegetace mění od deštného lesa přes savanu k poušti.",
  },
  {
    q: "Proč v období sucha zvířata savany táhnou na jiná místa?",
    key: "Tráva vyschne a vody ubývá, a tak hledají pastvu a vodu.",
    d: [
      ["Hledají chladnější místo, protože v období sucha v savaně mrzne.", "V savaně nemrzne, protože leží v tropech. Zvířata táhnou proto, že vyschne tráva a ubývá vody."],
      ["Táhnou k poušti, protože tam je v období sucha víc vody.", "V poušti je vody nejméně. Zvířata táhnou tam, kde ještě najdou trávu a vodu, a to poušť není."],
      ["Odcházejí před přemnoženým hmyzem, který v období sucha hubí trávu.", "Hmyz není příčinou. Tráva vysychá proto, že přestane pršet, a zvířata odcházejí za vodou a pastvou."],
    ],
    hints: [
      "Zvíře se stěhuje tam, kde najde to, co potřebuje k životu. Zeptej se, co potřebují velcí býložravci, když přestane pršet.",
      "Když dlouho neprší, mění se dvě věci, které zvířata nutně potřebují: to, co jedí, a to, co pijí. Ostatní možnosti porovnej s podnebím oblasti: v tropické Africe se teploty nikdy nedostanou k nule a poušť je vodou chudší než savana.",
    ],
    explanation: "V období sucha tráva vyschne a vodní zdroje ubývají. Velká stáda proto táhnou za pastvou a vodou na jiná místa.",
  },
  {
    q: "Proč se lidé v poušti usazují hlavně u oáz?",
    key: "Tam je voda pro lidi, dobytek i malá pole.",
    d: [
      ["Tam stojí palmy, které v poušti dávají příjemný stín.", "Stín palem je příjemný, ale palmy rostou jen díky vodě. Lidé se usazují tam, kde je voda."],
      ["Tam prší častěji než jinde v poušti, a proto tam roste tráva.", "V oáze neprší častěji než jinde. Voda tam vyvěrá z podzemí, a proto tam rostou rostliny."],
      ["Tam se dá nejlépe schovat před písečnými bouřemi.", "Před bouřemi se lze schovat i jinde. Lidé se usazují tam, kde je voda."],
    ],
    hints: [
      "Ze všeho, co člověk k životu potřebuje, chybí v poušti nejvíc jedna věc. Uvažuj, kde ji najde.",
      "Lidé i zvířata bez pravidelného zdroje vody nepřežijí a plodiny nevyrostou. Zamysli se, co se v oáze děje a proč se kolem ní hromadí lidé, a ostatní důvody porovnej s tím, že vítr ani písek vodu nedají.",
    ],
    explanation: "Oáza je místo, kde v poušti vyvěrá voda. Lidé se usazují tam, protože z vody mají pití pro sebe i pro dobytek a mohou zavlažovat malá pole.",
  },
  {
    q: "Proč je v deštném lese pod stromy šero?",
    key: "Koruny vysokých stromů v několika patrech zachytí většinu světla.",
    d: [
      ["Nad lesem bývá celý rok oblačno, a tak k zemi dopadá málo světla.", "Oblačnost světlo jen zeslabí. Šero pod stromy dělají koruny stromů, které zachytí většinu světla."],
      ["Listy stromů mají tmavou barvu, a proto světlo z větší části pohltí.", "Barva listů není hlavní příčina. Světlo zachytí koruny stromů uspořádané v několika patrech nad sebou."],
      ["Stromy jsou nízké, ale rostou tak hustě, že světlo nepronikne.", "Stromy v deštném lese jsou naopak vysoké a tvoří několik pater. Světlo zachytí právě jejich koruny."],
    ],
    hints: [
      "Světlo, které dopadá shora, se někde zastaví. Zeptej se, co v lese stojí mezi oblohou a zemí.",
      "V lese rostou stromy různé výšky nad sebou. Nejvyšší mají rozložité koruny, pod nimi jsou nižší patra a všechny světlo postupně zachytí. Rozmysli, jestli je příčinou délka dne, mlha, nebo něco, co roste v lese samo.",
    ],
    explanation: "V deštném lese rostou vysoké stromy v několika patrech nad sebou. Koruny zachytí většinu světla, a k zemi ho proto dopadá jen málo.",
  },
  {
    q: "Proč se velbloud hodí k cestě přes poušť?",
    key: "Dlouho vydrží bez pití a má široké nohy, které se v písku neboří.",
    d: [
      ["V hrbech má zásobu vody, kterou za horka pije, a proto vydrží dlouho.", "Hrby jsou zásoba tuku, ne vody. Velbloud vydrží dlouho bez pití díky tomu, jak hospodaří s vodou v těle."],
      ["Nasává vodu ze vzduchu, takže žádné pití nepotřebuje.", "Vodu ze vzduchu velbloud nenasává. Pití potřebuje také, jen vydrží velmi dlouho bez něj."],
      ["Rychle běhá po písku, takže cestu přes poušť zvládne za jediný den.", "Rychlost není důvod, proč se velbloud pro poušť hodí. Karavana putuje pomalu a cesta přes poušť trvá týdny. Rozhoduje vytrvalost bez pití a široké chodidlo."],
    ],
    hints: [
      "Cesta přes poušť trvá týdny a písek se pod nohama boří. Zeptej se, jaké dvě potíže musí zvíře na takové cestě zvládnout.",
      "Zvažuj obě potíže zvlášť: co s tělem zvířete udělá dlouhý nedostatek vody a čím se vyhne propadání v měkkém povrchu. Vyřaď možnosti, které slibují zázrak nebo řeší jen jednu z nich.",
    ],
    explanation: "Velbloud dlouho vydrží bez pití a jeho široké chodidlo se v písku nebořívá. Hrby jsou zásobárna tuku, ne vody.",
  },
  {
    q: "Co znamená slovo dezertifikace?",
    key: "Poušť se rozšiřuje a úrodná krajina s trávou pomalu mizí.",
    d: [
      ["Poušť se zmenšuje a mění se v úrodnou krajinu s trávou.", "Směr změny je opačný. Dezertifikace znamená, že se krajina k poušti přibližuje, ne že se poušť zazelení."],
      ["Poušť se zalidňuje a vznikají v ní velká města.", "Osídlování pouště je něco jiného. Dezertifikace popisuje změnu krajiny, ne počet obyvatel."],
      ["Poušť se ochlazuje, až na ní začne padat sníh.", "Se sněhem nemá dezertifikace nic společného. Jde o to, že úrodná půda vysychá a mění se v poušť."],
    ],
    hints: [
      "Slovo je příbuzné s anglickým „desert“, tedy poušť. Zamysli se, co se asi děje s krajinou, když k tomu přidáš koncovku označující proces.",
      "V názvu je základ odvozený z pouště a koncovka, která říká, že se něco pomalu děje. Rozmysli si směr změny: z jaké krajiny na jakou, a vyřaď možnosti, které jdou opačným směrem nebo popisují jinou změnu.",
    ],
    explanation: "Dezertifikace je proces, při kterém se úrodná krajina s trávou pomalu mění v poušť. V Africe se týká hlavně okraje Sahary, Sahelu.",
  },
];

// ── L3 ─────────────────────────────────────────────────────────────────────

/** Popisy bez pojmenování: oblast poznáš jen z krajiny a života v ní. */
interface Popis {
  o: Ob;
  q: string;
  hints: [string, string];
  explanation: string;
}
const POPISY_L3: Popis[] = [
  {
    o: "S",
    q: "Tráva tu část roku zelená, potom zežloutne a stáda táhnou za vodou. O jakou oblast Afriky jde?",
    hints: [
      "Všimni si, že se krajina během roku mění. Zeptej se, co tuto změnu způsobuje.",
      "Když krajina jednou zelená a jindy žloutne a zvířata odcházejí za vodou, znamená to, že se srážky střídají se suchem. Hledej oblast, která právě takové střídání má, a ne tu, kde prší celý rok nebo téměř nikdy.",
    ],
    explanation: "Zelená tráva, která žloutne, a stáda, která táhnou za vodou, ukazují na střídání dešťů a sucha. To je typické pro savanu.",
  },
  {
    o: "S",
    q: "Koryto řeky je půl roku suché a půl roku plné vody; podél něj se pasou velká stáda. O jakou oblast Afriky jde?",
    hints: [
      "Všimni si, že se na jednom místě střídají dvě období. Zeptej se, co takové střídání znamená pro srážky a pro to, co roste kolem řeky.",
      "Řeka, která půl roku vysychá, ukazuje, že déšť tu padá jen část roku. Stáda potřebují trávu, tu ale uživí jen krajina, kde srážky úplně nechybí. Hledej oblast, která leží mezi vlhkým lesem a nejsušší pustinou.",
    ],
    explanation: "Řeka, která půl roku vysychá, a velká stáda ukazují na střídání dešťů a sucha. To je typické pro savanu.",
  },
  {
    o: "S",
    q: "Stromy tu stojí daleko od sebe a mají hluboké kořeny; v období sucha ztrácejí listy a trávu pokryje prach. O jakou oblast Afriky jde?",
    hints: [
      "Všimni si dvou věcí: kolik je stromů a co se s nimi děje v suchém období. Uvažuj, kde je takové střídání běžné.",
      "Stromy, které v suchu zahodí listy, žijí tam, kde je část roku sucho, ale ne tak dlouho jako v nejsušších oblastech. Prach na trávě navíc ukazuje, že tráva tu vyrůstá jen po dešti.",
    ],
    explanation: "Roztroušené stromy s hlubokými kořeny, které v období sucha ztrácejí listy, a tráva pokrytá prachem jsou znaky savany se střídáním dešťů a sucha.",
  },
  {
    o: "S",
    q: "Pastevec tu v době dešťů pase dobytek na bohaté trávě, ale v době sucha musí stáda vodit ke vzdáleným studnám. O jakou oblast Afriky jde?",
    hints: [
      "Ze zadání vyčti dvě různá období roku. Zeptej se, jak by vypadala krajina v každém z nich.",
      "Bohatá tráva v době dešťů a nedostatek vody v době sucha svědčí o střídání dvou období. Oblast, kde je vody vždy dost nebo vždy málo, do takového popisu nesedí.",
    ],
    explanation: "Bohatá tráva po dešti a nedostatek vody v suchu jsou znaky savany. Pastevci proto stáda sezónně přesouvají a v suchu je vodí ke studnám.",
  },
  {
    o: "S",
    q: "Každý rok v době sucha tu vzplane požár trávy, ale stromy s tlustou kůrou přežijí a po prvním dešti se všechno zazelená. O jakou oblast Afriky jde?",
    hints: [
      "Všimni si, co se děje v době sucha a co po prvním dešti. Zeptej se, jaká krajina může shořet a znovu se zazelenat.",
      "Oheň potřebuje suché palivo, tedy suchou trávu, a rychlá obnova po dešti znamená, že deště přicházejí pravidelně. Souvislý vlhký les by nevyschl natolik, aby hořel, a v nejsušší krajině není co spálit.",
    ],
    explanation: "Požáry suché trávy, stromy odolné ohni a rychlé zazelenání po prvním dešti patří do savany, kde se střídá období sucha s obdobím dešťů.",
  },
  {
    o: "P",
    q: "Lidé tu zůstávají jen u hlubokých studní; deště přijdou jednou za několik let a všude jinde je holá země. O jakou oblast Afriky jde?",
    hints: [
      "Ze zadání vyčti dvě věci: kde se lidé drží a jak často prší. Zeptej se, co z toho plyne pro vegetaci.",
      "Deště, které přijdou jednou za několik let, znamenají, že krajina téměř nic nevyprodukuje a jediný spolehlivý zdroj vody je pod zemí. V oblasti s pravidelným obdobím dešťů by se lidé studní tolik držet nemuseli.",
    ],
    explanation: "Studně jako jediný spolehlivý zdroj vody, deště jednou za několik let a holá země jsou znaky pouště, kde je vody nejméně.",
  },
  {
    o: "P",
    q: "Za rok tu spadne sotva 50 mm srážek; přes den je přes 40 °C, v noci teplota klesne k pěti stupňům. O jakou oblast Afriky jde?",
    hints: [
      "Porovnej množství srážek s tím, co znáš z Česka, kde spadne za rok kolem několika set milimetrů. Pak si všimni rozdílu mezi dnem a nocí.",
      "Padesát milimetrů za rok je zlomek toho, co je třeba pro trávu nebo les. Velký rozdíl mezi dnem a nocí ukazuje na suchý vzduch bez mraků. Hledej oblast, kde jsou obě věci pravda.",
    ],
    explanation: "Sotva 50 mm srážek za rok a rozdíl přes třicet stupňů mezi dnem a nocí ukazují na poušť: suchý vzduch bez mraků teplo přes den rozpálí a přes noc rychle vyzáří.",
  },
  {
    o: "P",
    q: "Nomádi tu žijí ve stanech, stěhují se s velbloudy a cestují za rozbřesku a v noci, protože přes den je žár. O jakou oblast Afriky jde?",
    hints: [
      "Vyčti ze zadání, jak lidé žijí. Stany a stěhování je způsob života, který vyžaduje určité prostředí.",
      "Kdo cestuje v noci a spí ve stanech, musí se vyhýbat velkému žáru a nemůže se usadit na jednom místě, protože se tam nedá uživit. Hledej oblast, kde je horko a vody málo.",
    ],
    explanation: "Stěhování se stády velbloudů, stany a cestování v noci kvůli žáru jsou způsob života nomádů, tedy lidí bez stálého domova, v poušti.",
  },
  {
    o: "P",
    q: "Rostliny tu mají hluboké kořeny nebo drobné listy a semena čekají i několik let na vzácný déšť. O jakou oblast Afriky jde?",
    hints: [
      "Rostliny se přizpůsobují tomu, čeho je málo. Zeptej se, k čemu slouží hluboké kořeny a malé listy.",
      "Hluboké kořeny sahají k podzemní vodě a drobné listy šetří vodou. Semena, která čekají roky na déšť, patří tam, kde prší velmi vzácně. Hledej oblast, kde je voda hlavním problémem.",
    ],
    explanation: "Hluboké kořeny, drobné listy a semena čekající na vzácný déšť jsou přizpůsobení rostlin pouště, kde je málo vody.",
  },
  {
    o: "P",
    q: "Na obzoru se zvedají písečné duny, mezi nimi holé kamenité plochy; vzduch je suchý a obloha téměř bez mraků. O jakou oblast Afriky jde?",
    hints: [
      "Z popisu vyčti, jaký je povrch a jaké je nebe. Co říká bezmračná obloha o vlhkosti?",
      "Bezmračná obloha a suchý vzduch znamenají minimum srážek a velký rozdíl mezi dnem a nocí. Duny a holý kámen ukazují na to, že tu skoro nic neroste. Hledej oblast s těmito znaky.",
    ],
    explanation: "Písečné duny, holé kamenité plochy, suchý vzduch a obloha bez mraků jsou znaky pouště.",
  },
  {
    o: "L",
    q: "Sotva vejdeš mezi stromy, zešeří se: většina druhů žije v korunách vysokých stromů a k zemi dopadá málo světla. O jakou oblast Afriky jde?",
    hints: [
      "Všimni si, kde žije většina druhů a proč je dole šero. Zeptej se, co roste nad tvou hlavou.",
      "Vysoké stromy s rozložitými korunami, v nichž žije většina druhů, potřebují dost vody a stálé teplo. Hledej oblast, kde je to celý rok splněno a rostliny rostou v několika patrech nad sebou.",
    ],
    explanation: "Vysoké stromy v několika patrech, koruny, kde žije většina druhů, a šero při zemi jsou znaky deštného lesa.",
  },
  {
    o: "L",
    q: "Teplota se celý rok drží kolem 26 °C a prší téměř denně; nad hlavou se ozývají opice a papoušci. O jakou oblast Afriky jde?",
    hints: [
      "Všimni si dvou věcí: kolik je stupňů a jak často prší. Přemýšlej, v jaké části Afriky je tak stálé počasí.",
      "Stálých 26 °C a déšť téměř denně znamenají, že střídání ročních období skoro neexistuje. Opice a papoušci se pohybují ve stromech, takže jde o oblast s vysokými stromy.",
    ],
    explanation: "Stálých 26 °C, téměř denní deště a opice s papoušky v korunách stromů ukazují na deštný les kolem rovníku.",
  },
  {
    o: "L",
    q: "Ročně tu spadne přes 2 000 mm srážek, žádný měsíc není suchý a vzduch je nasycený vodní parou. O jakou oblast Afriky jde?",
    hints: [
      "Porovnej množství srážek s tím, co znáš z Česka, kde spadne za rok kolem několika set milimetrů. Pak si všimni, že žádný měsíc není suchý.",
      "Několik tisíc milimetrů srážek a žádné suché měsíce jsou hodnoty, které najdeš jen tam, kde je celý rok teplo a vlhko. Hledej oblast s nejvyššími srážkami a nejhustší vegetací.",
    ],
    explanation: "Přes 2 000 mm srážek rozložených do celého roku a vzduch nasycený vodní parou jsou znaky deštného lesa.",
  },
  {
    o: "L",
    q: "Lidé tu sbírají lesní plody, loví a na malých mýtinách pěstují kakaovníky; stezky se za pár měsíců zarostou. O jakou oblast Afriky jde?",
    hints: [
      "Všimni si, co lidé v oblasti dělají a co se děje se stezkami. Zeptej se, jaká krajina tak rychle zarůstá.",
      "Stezky, které se za pár měsíců zarostou, ukazují na velmi rychlý růst, a to je možné jen tam, kde je stále teplo a dost vody. Kakaovníky potřebují také vlhko a teplo.",
    ],
    explanation: "Sběr lesních plodů, kakaovníky na mýtinách a rychle zarůstající stezky jsou znaky deštného lesa, kde je stále teplo a vlhko.",
  },
  {
    o: "L",
    q: "Vrstva humusu je tenká a spadané listí se rozloží za pár týdnů; stromy rostou v několika patrech nad sebou. O jakou oblast Afriky jde?",
    hints: [
      "Všimni si rychlosti rozkladu listí. Zeptej se, jaké podmínky ho urychlují.",
      "Listí se rozkládá rychle tam, kde je teplo a vlhko, a v několika patrech rostou stromy jen tam, kde mají dost vody i světla. Hledej oblast, kde je oboje splněno celý rok.",
    ],
    explanation: "Rychlý rozklad listí, tenká vrstva humusu a stromy v několika patrech patří do deštného lesa, kde je stále teplo a vlhko.",
  },
];

/** Stanice v Africe podle zeměpisné šířky a srážek (číselný L3). */
function poloha(lat: number): string {
  const a = Math.abs(lat);
  if (a <= 5) return "jen několik stupňů od rovníku";
  if (a <= 15) return "mezi rovníkem a obratníkem, asi uprostřed cesty";
  return "kousek od obratníku Raka";
}

const HINT_STANICE_1: Record<Ob, (lat: number) => string> = {
  L: (lat) => `Stanice leží na ${sirka(lat)}, tedy ${poloha(lat)}. Zeptej se, jak vypadá počasí v takové poloze a co to znamená pro srážky.`,
  S: (lat) => `Stanice leží na ${sirka(lat)}, tedy ${poloha(lat)}. Zeptej se, jestli v takové poloze prší celý rok, nebo se srážky střídají se suchem.`,
  P: (lat) => `Stanice leží na ${sirka(lat)}, tedy ${poloha(lat)}. Zeptej se, jak vypadá krajina v okolí obratníku a kolik tam obvykle prší.`,
};
const PRAVIDLO_MM =
  "Pravidlo: do 250 mm za rok je krajina s minimem vody, 500 až 1 200 mm s dlouhým suchým obdobím je krajina se střídáním sucha a dešťů, nad 1 500 mm je krajina s vydatnými dešti celý rok.";
const HINT_STANICE_2: Record<Ob, string> = {
  L: `V Česku spadne za rok kolem 700 mm. Tady je srážek několikrát víc a teplota se během roku téměř nemění, takže žádné suché období nenastává. ${PRAVIDLO_MM} Nakonec zkontroluj, jestli k tomu sedí i poloha.`,
  S: `V Česku spadne za rok kolem 700 mm rozložených do celého roku. Tady je srážek podobně, ale spadnou během pár měsíců a zbytek roku je sucho. ${PRAVIDLO_MM} Nakonec zkontroluj, jestli k tomu sedí i poloha.`,
  P: `V Česku spadne za rok kolem 700 mm. Tady je jen malý zlomek toho a mezi dnem a nocí je velký rozdíl teplot. ${PRAVIDLO_MM} Nakonec zkontroluj, jestli k tomu sedí i poloha.`,
};

function stanice(o: Ob): PracticeTask | null {
  const zn = pick([1, -1]);
  let q: string;
  let lat: number;
  let expl: string;
  if (o === "L") {
    lat = zn * rnd(1, 4);
    const mm = rnd(18, 26) * 100;
    q = `Stanice v Africe stojí na ${sirka(lat)} a za rok naměří ${cis(mm)} mm srážek; teplota se během roku téměř nemění. V jaké oblasti leží?`;
    expl = `Poloha ${sirka(lat)} je kousek od rovníku a ${cis(mm)} mm srážek je velmi mnoho. Při stálé teplotě tam roste deštný les.`;
  } else if (o === "S") {
    lat = zn * rnd(8, 14);
    const mm = rnd(6, 12) * 100;
    const m = rnd(4, 6);
    q = `Stanice v Africe stojí na ${sirka(lat)} a za rok naměří ${cis(mm)} mm srážek, skoro všechny za ${pad(m, "MĚSÍC")}. V jaké oblasti leží?`;
    expl = `Poloha ${sirka(lat)} je mezi rovníkem a obratníkem. ${cis(mm)} mm srážek spadlých za ${pad(m, "MĚSÍC")} znamená období dešťů a období sucha, a to je znak savany.`;
  } else {
    lat = rnd(21, 28);
    const mm = rnd(2, 9) * 10;
    const den = rnd(38, 44);
    const noc = rnd(8, 14);
    q = `Stanice v Africe stojí na ${sirka(lat)} a za rok naměří ${cis(mm)} mm srážek; ve dne je ${den} °C, v noci jen ${noc} °C. V jaké oblasti leží?`;
    expl = `Poloha ${sirka(lat)} je kolem obratníku Raka, srážek je jen ${cis(mm)} mm a rozdíl mezi dnem a nocí je ${den - noc} °C. Tak vypadá poušť.`;
  }
  return oblast(o, q, [HINT_STANICE_1[o](lat), HINT_STANICE_2[o]], expl);
}

/** L3: příčina a důsledek zásahu. */
const PRICINY_L3: Fakt[] = [
  {
    q: "Na jižním okraji Sahary, v Sahelu (úzký pás suché savany), se poušť rok od roku rozšiřuje. Co je hlavní příčinou?",
    key: "Dlouhá sucha spolu s nadměrnou pastvou a kácením keřů a stromů.",
    d: [
      ["Vítr přenáší písek z Sahary dál na jih a poušť se šíří jen kvůli němu.", "Vítr písek přenáší, ale to není celé vysvětlení. Hlavní roli hraje to, že lidé s krajinou zacházejí špatně: pasou příliš mnoho dobytka a kácejí keře."],
      ["Kácení deštného lesa u rovníku, na jehož místě pak vzniká poušť.", "Deštný les leží hodně daleko od Sahelu a jeho kácení Saharu nerozšiřuje. Poušť se šíří v Sahelu kvůli suchu a špatnému hospodaření tam."],
      ["Časté silné deště, které odplavují úrodnou půdu z okraje pouště.", "V Sahelu prší málo a sucha jsou dlouhá. Příčinou je nedostatek dešťů a špatné zacházení s krajinou, ne příliš mnoho deště."],
    ],
    hints: [
      "Přemýšlej, co se děje s půdou, když z ní zmizí rostliny, které ji držely, a kdo za to může: jen příroda, nebo i lidé?",
      "Šíření pouště na úkor úrodné krajiny (odborně dezertifikace) má dvě příčiny, které se sčítají: přírodní (dlouhá období sucha) a lidskou (co lidé s krajinou dělají). Vyřaď možnosti, které tvrdí, že za všechno může jen příroda, a ty, které zaměňují jednu oblast za jinou.",
    ],
    explanation: "Poušť se v Sahelu šíří kvůli dlouhým suchům a lidské činnosti. Stáda spasou trávu, lidé kácejí keře na palivo, půda bez kořenů se rozpadá a vítr ji odnáší.",
  },
  {
    q: "Farmáři vykácejí kus deštného lesa a založí pole. Za pár let úroda klesne a půda zchudne. Proč?",
    key: "Živiny jsou hlavně ve stromech a listí; bez lesa je dešť vyplaví.",
    d: [
      ["Bez lesa výrazně ubude srážek a půda kvůli suchu ztratí úrodnost.", "Srážky po vykácení nezmizí, na rovníku dál prší skoro denně. Půda zchudne, protože déšť vyplaví živiny, které dřív držely stromy."],
      ["Na holém poli je příliš mnoho slunce, které plodiny vysuší a spálí.", "Slunce plodinám neškodí, rostliny ho potřebují. Půda chudne, protože déšť vymývá živiny."],
      ["Pole napadnou škůdci ze zbytku lesa, kteří se přemnoží na plodinách.", "Škůdci mohou plodinám ublížit, ale hlavní příčinou klesající úrody je ztráta živin, které z půdy vymyje déšť."],
    ],
    hints: [
      "Půda pod lesem je úrodná hlavně díky tomu, co v ní zůstává z rostlin. Zeptej se, kam se ta zásoba po vykácení lesa poděje.",
      "V tropickém lese se živiny rychlým koloběhem ze spadaného listí dostávají zpět do stromů, půda sama je chudá. Když stromy zmizí, nic už živiny nezachytí a vydatné deště je odplaví. Uvažuj nad tím, co se stane s hlínou při silném dešti bez porostu.",
    ],
    explanation: "V deštném lese jsou živiny hlavně v rostlinách a spadaném listí, půda sama je chudá. Po vykácení je vydatný déšť z holé půdy vyplaví a pole zchudne.",
  },
  {
    q: "Co se stane, když se v deštném lese vykácí velká plocha stromů?",
    key: "Mizí domov mnoha druhů a holou půdu odplaví vydatné deště.",
    d: [
      ["Les se během několika let sám obnoví a druhy se vrátí zpět.", "Vykácený deštný les za pár let nedoroste. Stromy rostou desítky let, bez nich půda chudne a řada druhů se nevrátí."],
      ["Vznikne savana s ještě větším počtem druhů zvířat než dřív.", "Ubývá druhů, protože mizí domov stromových obyvatel. I kdyby na místě lesa vznikla řidší tráva, druhů bude méně, ne víc."],
      ["Zvířata se přesunou do zbylého lesa, kde se všechna bez problémů uživí.", "Zbylý les má omezenou zásobu potravy i úkrytů a řada druhů je vázaná na konkrétní místo. Bez svého domova zanikají."],
    ],
    hints: [
      "Stromy jsou pro mnoho druhů domov i zdroj potravy. Zeptej se, co se stane s tím, kdo žije v korunách, když stromy zmizí.",
      "Les tvoří vysoké stromy, které rostou pomalu a poskytují úkryt. Bez nich zůstane holá půda vystavená vydatným dešťům. Vyřaď možnosti, které slibují rychlé zotavení nebo stejné podmínky jinde.",
    ],
    explanation: "Vykácením mizí domov většiny druhů a holou půdu odplaví vydatné deště. Deštný les za pár let nedoroste, takže škoda je dlouhodobá.",
  },
  {
    q: "U studny v Sahelu se pase stále víc dobytka. Co se stane, když stáda spasou okolní trávu i keře?",
    key: "Okolí studny se obnaží, půdu odnáší vítr a poušť se rozšíří.",
    d: [
      ["Tráva i keře po spasení brzy dorostou, takže stačí chvíli počkat.", "Trávu i keře lze spást tak, že už nedorostou. V suchu obnovu brzdí nedostatek vody a bez kořenů se půda rozpadá."],
      ["Okolí studny zůstane zelené díky vodě, která se tam stále doplňuje.", "Voda ze studny zavlaží jen malé okolí a stáda ho spasou. Bez trávy a keřů se okolí spíš obnaží."],
      ["Studna vyschne, protože stáda vypijí podzemní vodu z celého okolí.", "Stáda podzemní vodu nevyčerpají. Problém je v tom, že okolí ztratí rostliny, které držely půdu."],
    ],
    hints: [
      "Přemýšlej, co drží půdu na místě a co se s ní stane, když stáda všechno spasou. Pak zvaž, kdo půdu odnese.",
      "Kořeny trávy a keřů drží půdu, a když je stáda spasou, zůstane holá zem vystavená větru. Zeptej se, jestli se v suché krajině obnoví rychle, a odmítni možnosti, které slibují rychlou nápravu.",
    ],
    explanation: "Když stáda spasou trávu i keře, zmizí kořeny, které držely půdu. Vítr ji odnese, okolí studny se obnaží a poušť se rozšíří.",
  },
  {
    q: "Vesničané v Sahelu vysadí kolem polí pás keřů a stromů. Co to způsobí?",
    key: "Kořeny drží půdu a koruny zpomalí vítr, takže se půda méně odnáší.",
    d: [
      ["Stromy vítr usměrní tak, že půdu odnáší rychleji než dřív.", "Stromy vítr naopak zpomalují a jejich kořeny drží půdu. Poušť se díky nim šíří pomaleji."],
      ["Stromy vysají z pole tolik vody, že pole nakonec zaniknou.", "Stromy vodu spotřebují, ale zároveň chrání půdu před větrem. Pás stromů je používané opatření proti odnosu půdy."],
      ["Nic se nezmění, protože v tak suchém Sahelu strom nevyroste.", "V Sahelu strom vyrůst může, zvlášť odolné druhy, a zelené pásy se tam sázejí právě proto, aby zpomalily odnos půdy."],
    ],
    hints: [
      "Zeptej se, co dělají kořeny stromů s půdou a co dělá řada stromů s větrem. Obojí zpomaluje jeden a týž děj.",
      "Zásah, který má bránit rozšiřování pouště, musí zadržet půdu na místě. Kořeny ji drží a koruny snižují sílu větru, který půdu odnáší. Odmítni možnosti, ve kterých strom škodí, nebo se nemůže uchytit.",
    ],
    explanation: "Pás keřů a stromů kolem polí funguje jako ochrana: kořeny drží půdu a koruny zpomalují vítr. Půda se méně odnáší a dezertifikace se zpomalí.",
  },
];

// ── Generátor ──────────────────────────────────────────────────────────────

function gen(level: number): PracticeTask[] {
  // Všechny banky přes pytlík: v jednom sezení se žádná úloha neopakuje
  // a poměr šablon je vyvážený.
  const losFakt = pytlik(BANKA_L1);
  const losOblastL1 = pytlik(OBLASTI_L1);
  const losZvire = pytlik<Ob>(["P", "S", "L"]);
  const faktL1: Tvurce = () => fakt(losFakt());
  const oblastL1: Tvurce = () => {
    const x = losOblastL1();
    return oblast(x.o, x.q, x.hints, x.explanation);
  };
  const zvireL1: Tvurce = () => zvire(losZvire());

  const losVeg = pytlik(VEG_L2);
  const losZiv = pytlik(ZIV_L2);
  const losBankaL2 = pytlik(BANKA_L2);
  const vegL2: Tvurce = () => vegetace(losVeg());
  const zivL2: Tvurce = () => zivot(losZiv());
  const faktL2: Tvurce = () => fakt(losBankaL2());

  const losPopis = pytlik(POPISY_L3);
  const losOblastL3 = pytlik<Ob>(["P", "S", "L"]);
  const losPricina = pytlik(PRICINY_L3);
  const popisL3: Tvurce = () => {
    const x = losPopis();
    return oblast(x.o, x.q, x.hints, x.explanation);
  };
  const stanL3: Tvurce = () => stanice(losOblastL3());
  const pricinaL3: Tvurce = () => fakt(losPricina());

  const sablony: Tvurce[] =
    level === 1
      ? [faktL1, oblastL1, zvireL1, faktL1, oblastL1, faktL1]
      : level === 2
        ? [vegL2, faktL2, zivL2, faktL2, vegL2, zivL2]
        : [popisL3, stanL3, pricinaL3, popisL3, stanL3, pricinaL3];
  let i = 0;
  const genLx = () => losUlohy(sablony[i++ % sablony.length]);
  return ruzneUlohy(() => losUlohy(genLx));
}

// ── Topic ──────────────────────────────────────────────────────────────────
export const AFRICKE_PRIRODNI_OBLASTI: TopicMetadata[] = [
  {
    id: "g6-zem-africke-prirodni-oblasti-6",
    rvpNodeId: "g6-zemepis-regiony-sveta-afrika-africke-prirodni-oblasti-sahara-savany-destne-lesy",
    displayName: "Sahara, savana a deštný les",
    title: "Africké přírodní oblasti - Sahara, savany, deštné lesy",
    studentTitle: "Sahara, savana a deštný les",
    subject: "zemepis",
    category: "Regiony světa",
    topic: "Afrika",
    briefDescription: "Rozlišíš poušť, savanu a deštný les podle podnebí, rostlin a života lidí.",
    keywords: [
      "Afrika", "Sahara", "poušť", "oáza", "savana", "deštný les", "Kongo", "rovník",
      "obratník", "dezertifikace", "Sahel", "nomádi",
    ],
    goals: [
      "Poznat poušť, savanu a deštný les podle srážek, tepla a vegetace.",
      "Propojit podnebí s vegetací, zvířaty a životem lidí.",
      "Z popisu nebo z příčiny (dezertifikace, kácení lesa) rozhodnout, o jakou oblast jde.",
    ],
    boundaries: [
      "Bez map a obrázků — poloha se popisuje slovy a zeměpisnou šířkou.",
      "Žádná přesná čísla rozlohy a teplot; jen řády a pořadí.",
      "Číselné úlohy jen s nespornými hodnotami srážek (poušť do 90 mm, savana 600–1 200 mm, les nad 1 800 mm).",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Africké oblasti se řadí od rovníku k obratníkům podle srážek: kolem rovníku deštný les (celý rok teplo a vlhko), dál savana (tráva se stromy, období dešťů a sucha) a u obratníku poušť (minimum srážek).",
      steps: [
        "Zjisti, kolik srážek spadne a jestli padají celý rok, nebo jen část roku.",
        "Podle srážek a tepla urči vegetaci: hustý les, tráva se stromy, nebo řídké keře.",
        "Podle vegetace odvoď zvířata a život lidí.",
      ],
      commonMistake: "Považovat Saharu za moře písku, zaměnit zvířata savany a deštného lesa, nebo si myslet, že poušť se šíří jen kvůli větru.",
      example: "Místo s 2 000 mm srážek a stálým teplem má deštný les. Místo s 900 mm srážek za pět měsíců a suchým zbytkem roku je savana.",
    },
  },
];
