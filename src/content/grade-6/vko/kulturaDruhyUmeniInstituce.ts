/**
 * Výchova k občanství 6. ročník — Kultura: druhy umění, kulturní instituce,
 * masová kultura (select_one).
 *
 * Čistě pojmové/klasifikační téma — žák rozpoznává a zařazuje, nehodnotí,
 * která varianta je "lepší" (žádný hodnotový soud u kultury).
 *
 *  • L1 — přímé rozpoznání z jedné jasné věty: buď druh umění (podle toho,
 *    ČÍM vzniká), nebo kulturní instituce (podle toho, K ČEMU slouží).
 *  • L2 — aplikace: výběr MEZI dvěma blízkými institucemi podle účelu
 *    (galerie vs. muzeum, kino vs. divadlo, knihovna vs. muzeum…).
 *  • L3 — transfer: (a) rozpoznat masovou kulturu podle ŠÍŘENÍ MÉDII K
 *    VELKÉMU, NEURČITÉMU PUBLIKU (ne podle obliby), nebo (b) dvoukrokové
 *    rozhodnutí — nejdřív určit druh umění z popisu, pak z něj instituci.
 *
 * Chybový model (typické záměny šesťáka):
 *  1. muzeum ↔ galerie (obě "o starých/výtvarných věcech")
 *  2. dramatické umění ↔ filmové umění (živé vs. nahrané)
 *  3. knihovna ↔ muzeum (obě "budova s věcmi ke kultuře")
 *  4. masová kultura = cokoli oblíbené (i lokální/rodinné), ne jen to, co
 *     se šíří médii k velkému neurčitému publiku
 * Body 1–3 jsou vynucené jako povinný jeden z distraktorů (INSTITUCE_PRIORITY),
 * bod 4 je jádro L3(a) banky NEMASA_ITEMS.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import {
  pick,
  pickN,
  buildChoiceTask as choice,
  ruzneUlohy,
  losUlohy,
  type Distractor,
} from "./_shared";

// ── Druhy umění ──────────────────────────────────────────────────────────

interface Pojem {
  name: string;
  examples: string[];
}

const DRUHY_UMENI: Pojem[] = [
  {
    name: "výtvarné umění",
    examples: [
      "Umělec namaloval obraz barvami na plátno.",
      "Sochař vytesal z kamene sochu.",
    ],
  },
  {
    name: "hudební umění",
    examples: [
      "Skladatel složil melodii, kterou zpěvačka zazpívala s doprovodem kapely.",
      "Hudebníci hrají skladbu na nástroje a diváci ji poslouchají.",
    ],
  },
  {
    name: "dramatické umění",
    examples: [
      "Herci na jevišti živě, přímo teď a tady, předvádějí divákům příběh.",
      "Skupina herců nacvičila představení, které hraje naživo před publikem.",
    ],
  },
  {
    name: "filmové umění",
    examples: [
      "Režisér natočil film, který diváci sledují na plátně v kině.",
      "Štáb natočil kamerou příběh, který se pak promítá jako nahraný film.",
    ],
  },
  {
    name: "literární umění",
    examples: [
      "Spisovatel napsal příběh, který čtenáři čtou v knize.",
      "Autor sepsal báseň, kterou lidé čtou jako psaný text.",
    ],
  },
  {
    name: "taneční umění",
    examples: [
      "Tanečníci pohybem těla a kroky vyjadřují příběh nebo pocit.",
      "Baletka tancem a pohybem předvádí divákům příběh beze slov.",
    ],
  },
];

const ZNAK_UMENI: Record<string, string> = {
  "výtvarné umění": "vzniká barvami, tvary nebo vytesáváním — je to obraz nebo socha",
  "hudební umění": "vzniká tóny a melodií — hraním na hudební nástroje nebo zpěvem",
  "dramatické umění": "hrají ho živí herci naživo, přímo teď a tady, na jevišti",
  "filmové umění": "je to nahraný film, který diváci sledují na plátně",
  "literární umění": "je to psaný text, který čtenář čte",
  "taneční umění": "vyjadřuje se pohybem těla",
};

/** Typická záměna: živé provedení (dramatické) vs. nahraný záznam (filmové). */
const UMENI_PRIORITY: Record<string, string> = {
  "dramatické umění": "filmové umění",
  "filmové umění": "dramatické umění",
};

const UMENI_NAMES = DRUHY_UMENI.map((d) => d.name);

// ── Kulturní instituce ───────────────────────────────────────────────────

const INSTITUCE: Pojem[] = [
  {
    name: "muzeum",
    examples: [
      "Instituce sbírá a chrání staré předměty, doklady o minulosti a přírodniny.",
      "Budova uchovává vzácné historické předměty a přírodniny, aby se neztratily.",
    ],
  },
  {
    name: "galerie",
    examples: [
      "V budově jsou vystaveny originální obrazy a sochy slavných umělců.",
      "Instituce ukazuje veřejnosti originální výtvarná díla — obrazy a sochy.",
    ],
  },
  {
    name: "divadlo",
    examples: [
      "V budově hrají živí herci divadelní představení přímo na jevišti.",
      "Instituce uvádí živá představení, která herci hrají před diváky tady a teď.",
    ],
  },
  {
    name: "kino",
    examples: [
      "V sále se na velkém plátně promítá nový film.",
      "Instituce promítá divákům nahrané filmy na velkém plátně.",
    ],
  },
  {
    name: "knihovna",
    examples: [
      "Instituce půjčuje lidem knihy, které si mohou odnést domů.",
      "V budově si lidé mohou vypůjčit knihy a časopisy domů.",
    ],
  },
];

const ZNAK_INSTITUCE: Record<string, string> = {
  muzeum: "sbírá a chrání širší doklady o minulosti a přírodě — historické předměty i přírodniny",
  galerie: "vystavuje originální výtvarné umění — obrazy a sochy",
  divadlo: "v něm hrají živí herci naživo na jevišti",
  kino: "promítá nahraný film na velkém plátně",
  knihovna: "půjčuje knihy a časopisy domů",
};

/** Vynucené typické záměny (chybový model 1 a 3). */
const INSTITUCE_PRIORITY: Record<string, string> = {
  muzeum: "galerie",
  galerie: "muzeum",
  knihovna: "muzeum",
  divadlo: "kino",
  kino: "divadlo",
};

const INSTITUCE_NAMES = INSTITUCE.map((d) => d.name);

// ── Generický výběr distraktorů (stejný princip pro umění i instituce) ────

function pickDistractorsFrom(
  pool: string[],
  correct: string,
  znak: Record<string, string>,
  priority: Record<string, string>,
): Distractor[] {
  const forced = priority[correct];
  const restPool = pool.filter((n) => n !== correct && n !== forced);
  const extra = pickN(restPool, forced ? 2 : 3);
  const chosen = forced ? [forced, ...extra] : extra;
  return chosen.map((d) => ({
    value: d,
    why: `„${d}“ poznáš takto: ${znak[d]}. Tady ale popis odpovídá pojmu „${correct}“: ${znak[correct]}.`,
  }));
}

const pickDistractorsUmeni = (correct: string) => pickDistractorsFrom(UMENI_NAMES, correct, ZNAK_UMENI, UMENI_PRIORITY);
const pickDistractorsInstituce = (correct: string) => pickDistractorsFrom(INSTITUCE_NAMES, correct, ZNAK_INSTITUCE, INSTITUCE_PRIORITY);

// ── Nápovědy (obecné pravidlo, nikdy nejmenuje konkrétní pojem) ───────────

const HINT1_UMENI = "Najdi ve větě slovo, které říká, ČÍM nebo JAK umělecké dílo vzniká — to je rozhodující znak.";
const HINT2_UMENI =
  "Druh umění poznáš podle prostředku: barvy a tvary nebo tesání je jeden druh, tóny a melodie (hra na nástroje nebo zpěv) jiný, živí herci na jevišti jiný, nahraný film na plátně jiný, psaný text jiný a pohyb těla poslední. Najdi, který prostředek sedí k popisu ve větě.";

const HINT1_INSTITUCE = "Najdi ve větě slovo, které říká, CO se v té budově dělá nebo k čemu slouží.";
const HINT1_INSTITUCE_L2 = "Přečti si znovu, CO přesně chtějí lidé z věty vidět nebo zažít — to je rozhodující rozdíl mezi podobnými institucemi.";
const HINT2_INSTITUCE =
  "Instituce se liší účelem: jedna sbírá a chrání staré předměty a doklady o minulosti, jiná vystavuje originální výtvarná díla, jiná hraje živá představení, jiná promítá filmy a jiná půjčuje knihy domů. Najdi, který účel sedí k popisu ve větě.";

const HINT1_L3B = "Nejdřív si rozmysli, o jaký druh umění jde podle toho, čím vzniká nebo jak se předvádí. Pak si vzpomeň, ve které instituci se dá takové umění zažít.";

const HINT1_MASA = "U každé ze čtyř možností se zeptej: šíří se to přes nějaké médium (televize, rozhlas, internet, tisk), nebo to zůstává jen mezi pár lidmi?";
const HINT2_MASA =
  "Masová kultura se pozná podle ŠÍŘENÍ, ne podle obliby: musí se šířit hromadně médiem k velkému a neurčitému publiku najednou. To, že je něco oblíbené mezi kamarády, v rodině nebo ve třídě, ještě neznamená, že jde o masovou kulturu — i velmi oblíbená věc může zůstat jen v malém okruhu lidí.";

// ── L1 — přímé rozpoznání ─────────────────────────────────────────────────

const TAIL_UMENI = ["O jaký druh umění jde?", "Který druh umění to je?"];
const TAIL_INSTITUCE = ["Do jaké instituce to patří?", "Jak se taková instituce jmenuje?"];

function genL1(): PracticeTask | null {
  if (Math.random() < 0.5) {
    const item = pick(DRUHY_UMENI);
    const example = pick(item.examples);
    return choice(
      `${example} ${pick(TAIL_UMENI)}`,
      item.name,
      pickDistractorsUmeni(item.name),
      {
        hints: [HINT1_UMENI, HINT2_UMENI],
        explanation: `${example} Jde o ${item.name} — ${ZNAK_UMENI[item.name]}.`,
      },
    );
  }
  const item = pick(INSTITUCE);
  const example = pick(item.examples);
  return choice(
    `${example} ${pick(TAIL_INSTITUCE)}`,
    item.name,
    pickDistractorsInstituce(item.name),
    {
      hints: [HINT1_INSTITUCE, HINT2_INSTITUCE],
      explanation: `${example} Jde o instituci „${item.name}“ — ${ZNAK_INSTITUCE[item.name]}.`,
    },
  );
}

// ── L2 — aplikace: výběr mezi dvěma blízkými institucemi podle účelu ──────

const SKUPINY = ["Žáci", "Kamarádi", "Spolužáci", "Prarodiče s vnoučaty"];
const JMENA = ["Tomáš", "Petr", "Eliška", "Karolína", "Matěj", "Nikola", "Adam", "Tereza"];

const L2_TEMPLATES: Array<() => { question: string; correct: string }> = [
  () => ({
    question: `${pick(SKUPINY)} chtějí vidět originální obrazy a sochy slavných umělců. Kam by měli jet?`,
    correct: "galerie",
  }),
  () => ({
    question: `${pick(SKUPINY)} chtějí v sobotu večer vidět nový film na velkém plátně se zvukem z reproduktorů. Kam půjdou?`,
    correct: "kino",
  }),
  () => ({
    question: `${pick(JMENA)} si chce vypůjčit dobrodružný román domů na čtení o prázdninách. Kam půjde?`,
    correct: "knihovna",
  }),
  () => ({
    question: `${pick(SKUPINY)} chtějí na výletě vidět staré nástroje, mince a kosti pravěkých zvířat. Kam by měli jet?`,
    correct: "muzeum",
  }),
  () => ({
    question: `${pick(JMENA)} chce sedět v hledišti a sledovat herce, kteří hrají příběh naživo, přímo teď a tady. Kam půjde?`,
    correct: "divadlo",
  }),
];

function genL2(): PracticeTask | null {
  const { question, correct } = pick(L2_TEMPLATES)();
  return choice(question, correct, pickDistractorsInstituce(correct), {
    hints: [HINT1_INSTITUCE_L2, HINT2_INSTITUCE],
    explanation: `Jde o instituci „${correct}“ — ${ZNAK_INSTITUCE[correct]}.`,
  });
}

// ── L3(a) — transfer: rozpoznání masové kultury podle ŠÍŘENÍ ─────────────

const MASA_ITEMS: string[] = [
  "Televizní stanice odvysílala pořad, který ve stejný večer sledovaly statisíce diváků po celé zemi.",
  "Zpěvačka vydala píseň, kterou si přes internet pustily miliony lidí po celém světě.",
  "Film měl premiéru v kinech po celé republice a ve stejném týdnu ho vidělo statisíce diváků.",
  "Video na internetu si za pár dní pustily miliony lidí z celého světa.",
  "Rozhlasová stanice vysílala zprávy, které ve stejnou chvíli poslouchali posluchači po celé zemi.",
  "Časopis s velkým nákladem otiskl článek, který si ve stejném týdnu přečetly statisíce čtenářů.",
];

const NEMASA_ITEMS: Distractor[] = [
  { value: "Píseň, kterou složil kamarád a hraje ji jen doma na kytaru pro rodinu.", why: "Píseň hraje jen doma pro rodinu — nešíří se žádným médiem k velkému, neurčitému publiku, je to jen malý okruh lidí." },
  { value: "Divadelní představení, které nacvičila celá třída a předvedla ho jen rodičům ve škole.", why: "Představení vidí jen rodiče ve škole — nešíří se hromadným médiem, publikum je malé a předem známé." },
  { value: "Fotografie z výletu, kterou žák ukázal jen svým kamarádům ve třídě.", why: "Fotografii vidí jen pár kamarádů ve třídě — nešíří se žádným médiem k velkému, neurčitému publiku." },
  { value: "Vtip, který zná a vypráví si celá parta kamarádů ve škole.", why: "Vtip zná jen parta kamarádů ve škole — to je malý a předem známý okruh lidí, ne masové šíření médiem." },
  { value: "Vánoční koleda, kterou rodina zpívá každý rok jen doma u stromečku.", why: "Koledu zpívá jen rodina doma — i když je to oblíbená tradice, nešíří se to médiem k širokému publiku." },
  { value: "Hra, kterou vymyslela celá třída a hraje ji jen o přestávkách.", why: "Hru hraje jen třída o přestávkách — je to oblíbené mezi spolužáky, ale nešíří se to žádným médiem." },
  { value: "Fotbalový zápas, který sehráli žáci jen mezi sebou na hřišti za školou.", why: "Zápas viděli jen žáci na hřišti za školou — malý okruh lidí, žádné médium, které by to šířilo dál." },
  { value: "Báseň, kterou napsala spolužačka a přečetla ji jen svým kamarádkám.", why: "Báseň slyšelo jen pár kamarádek — nešíří se to médiem k velkému, neurčitému publiku." },
];

const TAIL_MASA = [
  "Která z těchto čtyř situací je příkladem MASOVÉ KULTURY? (Masová kultura se šíří hromadně médiem — například televizí, rozhlasem nebo internetem — k velkému, neurčitému publiku najednou.)",
  "Ve které z těchto čtyř situací jde o MASOVOU KULTURU? (Rozhoduje to, že se něco šíří hromadně médiem k velkému, neurčitému publiku najednou — ne to, jak moc je to oblíbené.)",
];

function genL3a(): PracticeTask | null {
  const masa = pick(MASA_ITEMS);
  const nemasa = pickN(NEMASA_ITEMS, 3);
  return choice(pick(TAIL_MASA), masa, nemasa, {
    hints: [HINT1_MASA, HINT2_MASA],
    explanation: `${masa} To je masová kultura, protože se to šíří hromadně médiem k velkému, neurčitému publiku najednou. Ostatní možnosti jsou oblíbené nebo známé jen v malém okruhu lidí (rodina, třída, kamarádi) — a to masová kultura není, bez ohledu na to, jak moc se to lidem líbí.`,
  });
}

// ── L3(b) — transfer: dvoukrokové rozhodnutí (druh umění → instituce) ────

interface DvoukrokovaPolozka {
  umeni: string;
  instituce: string;
  clues: string[];
}

const L3B_BANK: DvoukrokovaPolozka[] = [
  {
    umeni: "výtvarné umění",
    instituce: "galerie",
    clues: [
      "Žáci obdivují obrazy vytvořené barvami a vytesané sochy z kamene.",
      "Skupina lidí si prohlíží originální obrazy a sochy, které vytvořili slavní umělci.",
    ],
  },
  {
    umeni: "dramatické umění",
    instituce: "divadlo",
    clues: [
      "Diváci chtějí zažít příběh, který jim živí herci předvedou přímo na jevišti, tady a teď.",
      "Rodina chce vidět herce, jak naživo, bez natáčení, hrají divadelní hru.",
    ],
  },
  {
    umeni: "filmové umění",
    instituce: "kino",
    clues: [
      "Kamarádi chtějí sledovat nahraný příběh promítaný na velkém plátně se zvukem z reproduktorů.",
      "Parta chce zhlédnout nový film, který natočil filmový štáb kamerou.",
    ],
  },
  {
    umeni: "literární umění",
    instituce: "knihovna",
    clues: [
      "Čtenáři mají rádi dlouhé psané příběhy s ději a postavami a chtějí mít doma stále něco nového ke čtení, aniž by si to museli kupovat.",
      "Tomáš rád čte psané texty stránku po stránce a chce si je čas od času vyměnit za jiné, bez placení.",
    ],
  },
];

function genL3b(): PracticeTask | null {
  const row = pick(L3B_BANK);
  const clue = pick(row.clues);
  return choice(
    `${clue} Do jaké instituce je potřeba jít, aby se to dalo zažít?`,
    row.instituce,
    pickDistractorsInstituce(row.instituce),
    {
      hints: [HINT1_L3B, HINT2_INSTITUCE],
      explanation: `${clue} Nejdřív jde o ${row.umeni} (${ZNAK_UMENI[row.umeni]}), a takové umění se dá zažít v instituci „${row.instituce}“ — ${ZNAK_INSTITUCE[row.instituce]}.`,
    },
  );
}

function genL3(): PracticeTask | null {
  return Math.random() < 0.5 ? genL3a() : genL3b();
}

// ── gen ────────────────────────────────────────────────────────────────

function gen(level: number): PracticeTask[] {
  const producer = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(producer));
}

// ── Topic ──────────────────────────────────────────────────────────────

export const KULTURA_DRUHY_UMENI_INSTITUCE: TopicMetadata[] = [
  {
    id: "g6-vko-kultura-druhy-umeni-instituce-6",
    rvpNodeId:
      "g6-vko-clovek-ve-spolecnosti-lidska-setkavani-a-kultura-kultura-druhy-umeni-kulturni-instituce-masova-kultura",
    displayName: "Kultura, umění a instituce",
    title: "Kultura — druhy umění, kulturní instituce, masová kultura",
    studentTitle: "Kultura a umění",
    subject: "vko",
    category: "Člověk ve společnosti",
    topic: "Lidská setkávání a kultura",
    briefDescription: "Poznáš druhy umění, kulturní instituce a co je masová kultura.",
    keywords: [
      "druh umění", "kulturní instituce", "muzeum", "galerie", "divadlo",
      "kino", "knihovna", "masová kultura", "výtvarné umění", "dramatické umění",
    ],
    goals: [
      "Rozpoznat druh umění podle popisu, jak dílo vzniká nebo se předvádí.",
      "Přiřadit kulturní instituci k jejímu účelu (muzeum, galerie, divadlo, kino, knihovna).",
      "Poznat, kdy jde o masovou kulturu — podle šíření médii k velkému publiku, ne podle obliby.",
    ],
    boundaries: [
      "Jen zařazení a rozpoznání pojmů, žádné hodnocení, která kultura nebo instituce je „lepší“.",
      "Bez obrázků — vše se dá určit ze slovního popisu.",
      "Masová kultura se posuzuje jen podle způsobu šíření, ne podle obliby nebo kvality.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Druh umění poznáš podle toho, ČÍM vzniká (barvy, tóny, živí herci, film, text, pohyb). Instituci poznáš podle ÚČELU (co sbírá, vystavuje, hraje, promítá nebo půjčuje). Masová kultura se šíří hromadně médiem k velkému, neurčitému publiku najednou.",
      steps: [
        "Najdi ve větě, ČÍM dílo vzniká nebo co se v budově dělá.",
        "Porovnej to se čtyřmi nabízenými pojmy a vyber ten, který sedí.",
        "U masové kultury se ptej, jestli se to šíří médiem k velkému publiku, nebo jen mezi pár lidmi.",
      ],
      commonMistake: "Plést muzeum s galerií, dramatické umění s filmovým, nebo považovat za masovou kulturu cokoli oblíbené, i když se to nešíří médii.",
      example: "Živé představení herců na jevišti = dramatické umění, hraje se v divadle. Píseň v televizi, kterou najednou sleduje milion lidí, = masová kultura.",
    },
  },
];
