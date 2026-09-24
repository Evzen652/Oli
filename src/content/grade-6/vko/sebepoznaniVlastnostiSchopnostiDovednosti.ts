/**
 * Výchova k občanství 6. ročník — Sebepoznání: vlastnost, schopnost, dovednost
 * (categorize).
 *
 * Cíl: zařadit konkrétní příklad chování/jednání do správné kategorie podle
 * toho, JAK vznikl — ne podle povrchového znění slova.
 * - Vlastnost  = stálý rys povahy (způsob, jak se člověk chová/prožívá).
 * - Schopnost  = vrozený předpoklad k výkonu (má ho od narození, bez tréninku).
 * - Dovednost  = naučená způsobilost, získaná cvičením (bez tréninku by ji
 *   člověk neuměl, i s talentem).
 *
 * - L1 (zapamatování): izolované, prototypické příklady s jednoznačným
 *   slovníkovým klíčem ("Je upřímný." / "Má hudební sluch." / "Umí plavat.").
 * - L2 (použití): příklady zasazené do krátké situace — žák musí aplikovat
 *   definici na popsané chování, ne jen chytit klíčové slovo.
 * - L3 (přenos): dvě věty vždy popisují TÉHOŽ člověka a TÉŽ činnost — jedna
 *   mluví o vrozeném základu (schopnost), druhá o výsledku tréninku
 *   (dovednost). Žák musí rozlišit dvě různé kategorie v jedné souvislé
 *   situaci. Zbytek úlohy je vlastnost v novém, nešablonovitém kontextu
 *   (chování popsané situací, ne holé přídavné jméno).
 *
 * Chybový model (viz `why` u každé položky a explanation):
 * - vlastnost ↔ dovednost: rys povahy (pečlivost, trpělivost) se netrénuje
 *   jako dovednost.
 * - schopnost ↔ dovednost: "umí hrát na klavír" je výsledek let cvičení,
 *   ne vrozená schopnost, i když sloveso "umí" zní stejně.
 * - vlastnost ↔ schopnost: nadání je vrozený předpoklad k výkonu, ne rys
 *   povahy.
 *
 * Generátor nemá stav mezi voláními — dedup přes Map se počítá vždy znovu
 * v `gen()`.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pickN, buildCategorizeTask as cat } from "./_shared";

const V = "Vlastnost";
const S = "Schopnost";
const D = "Dovednost";

const RULE =
  "Vlastnost je stálý rys povahy — projevuje se v chování, ne v tréninku. Schopnost je vrozený předpoklad, se kterým se člověk narodil a ukazuje se i bez cvičení. Dovednost je to, co se člověk naučil a zdokonalil cvičením — bez tréninku by to neuměl, i s talentem.";

/** [text položky, proč do své kategorie patří] */
type Polozka = [string, string];

// ── L1: izolované, prototypické příklady ────────────────────────────────
const L1_V: Polozka[] = [
  ["Je upřímný.", "upřímnost je stálý rys povahy, ne dovednost ani vrozený talent"],
  ["Je pečlivý.", "pečlivost je rys povahy — netrénuje se jako dovednost"],
  ["Je trpělivý.", "trpělivost je způsob, jak se člověk chová, tedy vlastnost"],
  ["Je tvrdohlavý.", "tvrdohlavost je rys povahy, ne schopnost ani dovednost"],
  ["Je veselý.", "veselost je stálý způsob prožívání, tedy vlastnost"],
  ["Je laskavý.", "laskavost je rys povahy, projevuje se v chování k lidem"],
  ["Je spolehlivý.", "spolehlivost je stálý rys povahy"],
  ["Je štědrý.", "štědrost je rys povahy, ne naučený úkon"],
  ["Je zodpovědný.", "zodpovědnost je stálý rys povahy"],
  ["Je skromný.", "skromnost je rys povahy"],
  ["Je zdvořilý.", "zdvořilost je rys povahy, projevuje se v chování k lidem"],
  ["Je vznětlivý.", "vznětlivost je rys povahy, ne dovednost"],
];
const L1_S: Polozka[] = [
  ["Má hudební sluch.", "hudební sluch je vrozený předpoklad, ne naučený úkon"],
  ["Má dobrou paměť.", "dobrá paměť je vrozený předpoklad k zapamatování"],
  ["Má nadání na kreslení.", "nadání je vrozený předpoklad k výkonu, ne rys povahy"],
  ["Má talent na jazyky.", "talent je vrozený předpoklad, ne naučená dovednost"],
  ["Má cit pro rytmus.", "cit pro rytmus je vrozený předpoklad"],
  ["Má bystrý úsudek.", "bystrý úsudek je vrozený předpoklad k rychlému uvažování"],
  ["Má vlohy na matematiku.", "vlohy jsou vrozený předpoklad k výkonu"],
  ["Má výborný zrak.", "výborný zrak je vrozený tělesný předpoklad, ne naučená dovednost"],
  ["Má přirozené nadání na sport.", "přirozené nadání je vrozený předpoklad k výkonu"],
  ["Má krásný hlas od přírody.", "hlas od přírody je vrozený předpoklad, ne naučená dovednost"],
  ["Má cit pro barvy.", "cit pro barvy je vrozený předpoklad, ne rys povahy"],
  ["Má rychlé reflexy.", "rychlé reflexy jsou vrozený tělesný předpoklad"],
];
const L1_D: Polozka[] = [
  ["Umí plavat.", "plavání se člověk musí naučit cvičením, je to dovednost"],
  ["Umí jezdit na kole.", "jízda na kole je naučená dovednost, ne vrozený talent"],
  ["Umí hrát šachy.", "hrát šachy se člověk naučí, je to dovednost"],
  ["Umí uvázat uzel.", "uvázat uzel je naučený úkon, dovednost"],
  ["Umí vařit těstoviny.", "vaření je naučená dovednost"],
  ["Umí psát na klávesnici všemi deseti.", "psaní všemi deseti se člověk naučí cvičením"],
  ["Umí bruslit.", "bruslení je naučená dovednost, ne vrozený rys"],
  ["Umí hrát na kytaru.", "hra na nástroj je naučená dovednost, i s talentem se musí trénovat"],
  ["Umí háčkovat.", "háčkování je naučený úkon, dovednost"],
  ["Umí stavět stan.", "stavění stanu je naučená dovednost"],
  ["Umí plést copánky.", "pletení copánků je naučený úkon"],
  ["Umí opravit píchlou duši u kola.", "oprava duše je naučená dovednost"],
];

// ── L2: příklady v krátké situaci ────────────────────────────────────────
const L2_V: Polozka[] = [
  ["Honza počká, až domluvíš, a nikdy ti neskáče do řeči – je trpělivý.", "čekat a neskákat do řeči je stálý způsob chování, vlastnost"],
  ["Když Táňa slíbí, že něco udělá, vždycky to splní – je spolehlivá.", "dodržet slib pokaždé je stálý rys povahy"],
  ["I když prohrává, Filip se nezlobí a hraje dál s úsměvem – je veselý.", "zůstat v pohodě i při prohře je rys povahy, ne dovednost"],
  ["Kryštof řekne pravdu, i když by mohl mlčet a nikdo by na to nepřišel – je upřímný.", "mluvit pravdu i bez kontroly je stálý rys povahy"],
  ["Adéla si každou úlohu dvakrát zkontroluje, než ji odevzdá – je pečlivá.", "kontrolovat si práci je způsob chování, ne naučený úkon"],
  ["I když ho ostatní přemlouvají, Ondra si stojí za svým rozhodnutím – je tvrdohlavý.", "trvat na svém i proti přesvědčování je rys povahy"],
  ["Bára se s mladší sestrou rozdělí o poslední kousek dortu – je štědrá.", "dělit se o poslední kousek je stálý rys povahy"],
  ["Denisa pozdraví každého dospělého, i cizího, a poděkuje za pomoc – je zdvořilá.", "zdravit a děkovat je stálý způsob chování k lidem"],
];
const L2_S: Polozka[] = [
  ["Eva má od narození pěkný hlas a zpívá čistě, i když na zpěv nikdy nechodila do kroužku.", "čistý hlas bez jakékoli výuky je vrozený předpoklad, ne naučená dovednost"],
  ["Kuba má od přírody bystré oko a odhadne vzdálenost líp než dospělí kolem něj.", "bystré oko od přírody je vrozený předpoklad"],
  ["Nikola má od malička cit pro barvy a obrázky jí sedí samy, bez hodin výtvarky navíc.", "cit pro barvy bez výuky navíc je vrozený předpoklad"],
  ["Matěj má od narození nadání na čísla, počty mu jdou snadno i bez počítání navíc.", "nadání na čísla je vrozený předpoklad, ne rys povahy"],
  ["Anička má od narození výborný sluch a pozná falešný tón hned, jak ho uslyší.", "výborný sluch od narození je vrozený předpoklad"],
  ["Vojta má od přírody rychlé nohy a v běhu je mezi prvními ve třídě už od první hodiny tělocviku.", "rychlé nohy od přírody jsou vrozený tělesný předpoklad"],
  ["Klára má vlohy na jazyky a novou řeč pochytí rychleji než ostatní ve třídě.", "vlohy na jazyky jsou vrozený předpoklad"],
  ["Tomáš má od malička skvělou paměť a básničku si zapamatuje hned napoprvé.", "skvělá paměť od malička je vrozený předpoklad"],
];
const L2_D: Polozka[] = [
  ["Petr se měsíc učil žonglovat, až mu to teď jde.", "žonglování se naučil cvičením, je to dovednost"],
  ["Simona se dva roky učila hrát na zobcovou flétnu, až teď zvládá i těžší skladby.", "hra na flétnu je výsledek let cvičení, dovednost"],
  ["David dlouho trénoval driblink s míčem, až ho teď zvládá i se zavřenýma očima.", "driblink je výsledek dlouhého tréninku, dovednost"],
  ["Bára se celé prázdniny učila plavat kraul, až to teď zvládá bez zastavení.", "plavání kraul je naučená dovednost, výsledek cvičení"],
  ["Filip se týdny učil vázat uzly na táboře, až mu teď jdou i poslepu.", "vázání uzlů je naučený úkon, dovednost"],
  ["Zuzka dlouho trénovala jízdu na kole bez postranních koleček, až to teď zvládá sama.", "jízda bez koleček je výsledek tréninku, dovednost"],
  ["Honza se měsíce učil skládat origami, až teď zvládá i složité tvary.", "skládání origami je naučený úkon, dovednost"],
  ["Nikol se rok učila háčkovat, až teď háčkuje celou čepici bez chyby.", "háčkování je výsledek dlouhého cvičení, dovednost"],
];

// ── L3: vlastnost v novém kontextu + dvojice schopnost/dovednost ────────
const L3_V: Polozka[] = [
  ["Marek každý týden bez připomínání uklidí pokoj a slib vždycky dodrží – je zodpovědný.", "plnit povinnosti bez připomínání je stálý rys povahy"],
  ["I když někdo stojí ve frontě před ním, Bety se nerozčílí a klidně počká – je trpělivá.", "zůstat klidná při čekání je stálý rys povahy"],
  ["Když kamarádka udělá chybu, Adam jí to řekne narovinu, ne za zády – je upřímný.", "říct pravdu narovinu je stálý rys povahy"],
  ["I když se jí kvůli dešti zruší dlouho plánovaný výlet, Tereza nezůstane zklamaná a hned vymýšlí náhradní program – je veselá.", "zůstat naladěná i po zklamání, které nesouvisí s prohrou ve hře, je stálý rys povahy"],
  ["I když zvoní a spolužáci už odcházejí ze třídy, Šimon si radši ještě jednou projde každý výpočet v testu – je pečlivý.", "kontrolovat práci i pod časovým tlakem, kdy by to nikdo nevyžadoval, je stálý rys povahy"],
  ["I po neúspěchu to Klára zkusí znovu a nevzdává se – je vytrvalá.", "nevzdávat se po neúspěchu je stálý rys povahy"],
  ["Vojta se s nikým nehádá a i na nepříjemnou poznámku odpoví klidně – je klidný.", "reagovat klidně na nepříjemnost je stálý rys povahy"],
  ["Když má někdo hlad, Nikola se s ním rozdělí o svačinu, i když jí toho moc nezbyde – je štědrá.", "dělit se, i když nezbyde moc, je stálý rys povahy"],
];

type Par = { s: Polozka; d: Polozka };
const PARY: Par[] = [
  {
    s: ["Tomáš má od narození vlohy k rychlému běhu.", "vrozené vlohy k běhu jsou schopnost, ukázaly se bez tréninku"],
    d: ["Tomáš teprve po měsících tréninku zvládl uběhnout pět kilometrů bez zastavení.", "uběhnout pět kilometrů je výsledek měsíců tréninku, dovednost"],
  },
  {
    s: ["Eva má od narození hudební nadání.", "hudební nadání je vrozený předpoklad, schopnost"],
    d: ["Eva se roky učila hrát na housle, až jí to teď jde.", "hra na housle je výsledek let učení, dovednost"],
  },
  {
    s: ["Jakub má od malička vlohy ke kreslení.", "vlohy ke kreslení jsou vrozený předpoklad, schopnost"],
    d: ["Jakub se dva roky učil malovat portréty, až mu to teď jde.", "malovat portréty se naučil cvičením, dovednost"],
  },
  {
    s: ["Petra má od přírody cit pro rytmus a pohyb.", "cit pro rytmus od přírody je vrozený předpoklad, schopnost"],
    d: ["Petra po dvou letech tréninku zvládla celou taneční sestavu bez jediné chyby.", "zvládnout tanečního sestavu je výsledek dvou let tréninku, dovednost"],
  },
  {
    s: ["David má od narození rychlé reflexy.", "rychlé reflexy od narození jsou vrozený předpoklad, schopnost"],
    d: ["David po měsících tréninku zvládl chytat penalty i v důležitých zápasech.", "chytat penalty je výsledek měsíců tréninku, dovednost"],
  },
  {
    s: ["Simona má od přírody krásný hlas.", "krásný hlas od přírody je vrozený předpoklad, schopnost"],
    d: ["Simona se rok učila zpívat čistě i vysoké tóny, až jí to teď jde.", "čistě zpívat vysoké tóny se naučila cvičením, dovednost"],
  },
];

/** Jméno (1. pád, jak je uvedeno v PARY) → tvar v 6. pádě (lokálu) pro nápovědu "o ...". */
const LOKAL: Record<string, string> = {
  Tomáš: "Tomášovi",
  Eva: "Evě",
  Jakub: "Jakubovi",
  Petra: "Petře",
  David: "Davidovi",
  Simona: "Simoně",
};

const ZADANI: Record<number, string> = {
  1: "Zařaď šest příkladů: je to vlastnost, schopnost nebo dovednost?",
  2: "Přečti šest krátkých situací a zařaď je: vlastnost, schopnost nebo dovednost?",
  3: "Přečti šest vět a rozhodni: vlastnost, schopnost nebo dovednost? Dvě dvojice vět mluví o témže člověku jinak.",
};

/** Zkrátí text položky pro nápovědu, ať zůstane přehledná. */
const krat = (t: string): string => (t.length > 30 ? `${t.slice(0, 30).trim()}…` : t);

function sestav(zadani: string, v: Polozka[], s: Polozka[], d: Polozka[], hints: [string, string]): PracticeTask {
  const vse = [
    ...v.map(([t, proc]) => ({ t, proc, kat: V })),
    ...s.map(([t, proc]) => ({ t, proc, kat: S })),
    ...d.map(([t, proc]) => ({ t, proc, kat: D })),
  ];
  return cat(
    zadani,
    [
      { name: V, items: v.map(([t]) => t) },
      { name: S, items: s.map(([t]) => t) },
      { name: D, items: d.map(([t]) => t) },
    ],
    {
      hints,
      explanation: vse.map((x) => `„${x.t}“ patří do kategorie „${x.kat}“, protože ${x.proc}.`).join(" "),
    },
  );
}

function uloha(level: number): PracticeTask {
  if (level === 1) {
    const v = pickN(L1_V, 2);
    const s = pickN(L1_S, 2);
    const d = pickN(L1_D, 2);
    const seznam = [...v, ...s, ...d].map(([t]) => `„${t}“`).join(", ");
    return sestav(ZADANI[1], v, s, d, [
      `Podívej se na tyto příklady: ${seznam}. Co z nich je stálý rys povahy, co vrozený dar a co naučený úkon?`,
      RULE,
    ]);
  }
  if (level === 2) {
    const v = pickN(L2_V, 2);
    const s = pickN(L2_S, 2);
    const d = pickN(L2_D, 2);
    const seznam = [...v, ...s, ...d].map(([t]) => `„${krat(t)}“`).join(", ");
    return sestav(ZADANI[2], v, s, d, [
      `Přečti si znovu: ${seznam}. U každé věty se ptej: mluví o tom, JAK se člověk chová, JAK se narodil nebo CO se naučil?`,
      RULE,
    ]);
  }
  // L3
  const pary = pickN(PARY, 2);
  const v = pickN(L3_V, 2);
  const s = pary.map((p) => p.s);
  const d = pary.map((p) => p.d);
  const jmena = pary
    .map((p) => {
      const jmeno = p.s[0].split(" ")[0];
      return LOKAL[jmeno] ?? jmeno;
    })
    .join(" a ");
  return sestav(ZADANI[3], v, s, d, [
    `U vět o ${jmena} rozhoduj větu po větě: jedna mluví o vrozeném základu, druhá o výsledku cvičení — nejde o jednu kategorii pro obě věty.`,
    `${RULE} Když se u téhož člověka mluví o vrozeném základu i o výsledku tréninku, jde o dvě různé věci — zařaď každou zvlášť.`,
  ]);
}

function gen(level: number): PracticeTask[] {
  const out = new Map<string, PracticeTask>();
  for (let i = 0; i < 300 && out.size < 24; i++) {
    const t = uloha(level);
    out.set(t.categories!.map((c) => c.items.join("+")).join("|"), t);
  }
  return [...out.values()];
}

// ── Topic ────────────────────────────────────────────────────────────────
export const SEBEPOZNANI_VLASTNOSTI_SCHOPNOSTI_DOVEDNOSTI: TopicMetadata[] = [
  {
    id: "g6-vko-sebepoznani-vlastnosti-schopnosti-dovednosti-6",
    rvpNodeId:
      "g6-vko-clovek-jako-jedinec-osobni-rozvoj-sebepoznani-osobni-vlastnosti-schopnosti-dovednosti",
    displayName: "Vlastnost, schopnost nebo dovednost?",
    title: "Sebepoznání – vlastnost, schopnost a dovednost",
    studentTitle: "Vlastnost, schopnost nebo dovednost?",
    subject: "vko",
    category: "Člověk jako jedinec",
    topic: "Osobní rozvoj",
    briefDescription: "Rozlišíš vlastnost, schopnost a dovednost podle toho, jak vznikly.",
    keywords: [
      "vlastnost", "schopnost", "dovednost", "sebepoznání", "rys povahy",
      "vrozený předpoklad", "nadání", "vlohy", "trénink", "talent",
    ],
    goals: [
      "Rozlišit vlastnost (stálý rys povahy) od schopnosti (vrozený předpoklad) a dovednosti (naučená cvičením).",
      "Zařadit konkrétní chování nebo příklad do správné kategorie podle toho, JAK vznikl.",
      "Rozpoznat situaci, kde se u téhož člověka objevuje vrozený předpoklad i naučená dovednost zároveň.",
    ],
    boundaries: [
      "Tři kategorie: vlastnost, schopnost, dovednost — podle původu, ne podle znění slova.",
      "Žádný typ osobnosti ani vlastnost není hodnocena jako „lepší“ nebo „horší“.",
      "Nezahrnuje typologii osobnosti ani psychologické testy.",
    ],
    gradeRange: [6, 6],
    inputType: "categorize",
    defaultLevel: 1,
    sessionTaskCount: 3,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Vlastnost je stálý rys povahy (projevuje se v chování). Schopnost je vrozený předpoklad, se kterým se člověk narodil. Dovednost je to, co se člověk naučil cvičením.",
      steps: [
        "Zeptej se: je to způsob, jak se člověk chová nebo prožívá? → vlastnost.",
        "Ukazuje se to od narození, bez tréninku? → schopnost.",
        "Musel se to člověk naučit a procvičit, jinak by to neuměl? → dovednost.",
        "Pokud se u stejného člověka mluví o obojím, rozliš vrozený základ (schopnost) od výsledku cvičení (dovednost) zvlášť.",
      ],
      commonMistake: "Myslet si, že nadání je vlastnost (je to schopnost) nebo že se rys povahy dá natrénovat jako dovednost (pečlivost se netrénuje jako hra na nástroj).",
      example: "„Je pečlivý.“ = vlastnost. „Má hudební sluch.“ = schopnost. „Umí hrát na klavír.“ = dovednost, i když k tomu měl talent.",
    },
  },
];
