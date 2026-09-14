/**
 * Dějepis 6. ročník — Keltové, Germáni a Slované na našem území (categorize).
 *
 * Tři pevné koše, jen typ categorize na všech úrovních:
 *  • L1 ZAPAMATOVÁNÍ — holé pojmy a jména z učebnice (Bójové, Markomani, polozemnice…),
 *    4 karty (2 + 1 + 1).
 *  • L2 POUŽITÍ — popis místo názvu; žák pojem nejdřív pozná, pak zařadí,
 *    5 karet (2 + 2 + 1).
 *  • L3 ANALÝZA — nález nebo situace se dvěma kroky: nejdřív doba (letopočet,
 *    vztah k Římu, vztah k jinému národu), potom národ. 6 karet (2 + 2 + 2).
 *
 * Znění karet L2 a L3 neobsahuje žádný termín z L1. Generátor je deterministický
 * (UI karty samo míchá), každá úroveň dá 24 různých úloh.
 *
 * Fakta: shoda běžných učebnic 6. ročníku — Keltové asi od 4. st. př. n. l.,
 * Germáni kolem přelomu letopočtu, Slované asi v 6. st. n. l. Letopočty v kartách
 * leží daleko od hranic mezi obdobími, aby zařazení nebylo sporné.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildCategorizeTask as cat } from "./_shared";

const K = "Keltové";
const G = "Germáni";
const S = "Slované";
const NARODY = [K, G, S];

/** Předložkový tvar „k + 3. pád" uložený zvlášť — žádné lepení předložky ke jménu. */
const K_NARODU: Record<string, string> = { [K]: "ke Keltům", [G]: "k Germánům", [S]: "ke Slovanům" };

type Karta = {
  /** Text karty, jak ho žák vidí. */
  text: string;
  /** Proč patří do koše: doba + rozlišovací znak (případně omyl, kterému se vyhnout). */
  proc: string;
  /** Druh stopy — jen pro nápovědu (říká, CO na kartách je, ne KAM patří). */
  druh: string;
};

const PORADI =
  "Keltové tu žili asi od 4. století př. n. l., Germáni přišli kolem přelomu letopočtu a Slované asi v 6. století n. l.";

// ── L1: pojmy a jména ───────────────────────────────────────────────────────
const L1: Record<string, Karta[]> = {
  [K]: [
    { text: "Bójové", druh: "kmeny", proc: "keltský kmen, který tu žil asi od 4. století př. n. l.; podle Bójů Římané nazvali naši zemi Boiohaemum, země Bójů, odtud pochází pozdější latinské Bohemia (s pověstí o praotci Čechovi to nesouvisí)" },
    { text: "oppidum", druh: "stavby", proc: "opevněné keltské město s dílnami a mincovnou ze 2. a 1. století př. n. l.; Germáni oppida nestavěli" },
    { text: "druidové", druh: "víra", proc: "keltští kněží, kteří vedli obřady a znali byliny" },
    { text: "duhovka", druh: "peníze", proc: "zlatá keltská mince miskovitého tvaru; první mince u nás razili Keltové" },
    { text: "Stradonice", druh: "stavby", proc: "jedno z největších keltských oppid u nás, stálo na Berounsku ve 2. a 1. století př. n. l." },
  ],
  [G]: [
    { text: "Markomani", druh: "kmeny", proc: "germánský kmen, který kolem přelomu letopočtu přišel do Čech, tedy až po Keltech" },
    { text: "Kvádové", druh: "kmeny", proc: "germánský kmen, který kolem přelomu letopočtu sídlil na Moravě" },
    { text: "král Marobud", druh: "vládci", proc: "markomanský král, který kolem přelomu letopočtu vybudoval v Čechách mocný svaz germánských kmenů" },
    { text: "markomanské války", druh: "války", proc: "války germánských Markomanů a Kvádů s Římem za císaře Marka Aurelia ve 2. století n. l." },
    { text: "doba římská", druh: "období", proc: "období od přelomu letopočtu asi do konce 4. století n. l. (do roku 375), kdy u nás žily germánské kmeny a obchodovaly s Římem; Římané tu natrvalo nesídlili, jen za markomanských válek tu krátce táborila jejich vojska" },
  ],
  [S]: [
    { text: "polozemnice", druh: "obydlí", proc: "obydlí částečně zapuštěné do země se čtvercovým půdorysem a pecí v rohu, typické pro vesnice Slovanů od 6. století n. l." },
    { text: "keramika pražského typu", druh: "řemesla", proc: "jednoduché hrnce tvarované rukou, podle nichž archeologové poznají nejstarší sídliště Slovanů z 6. století n. l." },
    { text: "bůh Perun", druh: "víra", proc: "slovanský bůh hromu a blesku" },
    { text: "žďáření", druh: "zemědělství", proc: "získávání pole vypálením lesa, jak ho používali slovanští zemědělci, kteří přišli asi v 6. století n. l." },
  ],
};

// ── L2: popis místo názvu ───────────────────────────────────────────────────
const L2: Record<string, Karta[]> = {
  [K]: [
    { text: "Opevněné sídliště s dílnami, kde se razily mince", druh: "stavby", proc: "je to oppidum; taková města stavěli Keltové ve 2. a 1. století př. n. l., Germáni ne" },
    { text: "Kněží, kteří znali byliny a vedli obřady", druh: "víra", proc: "jsou to druidové, kněží Keltů" },
    { text: "Kmen, podle kterého Římané pojmenovali Čechy", druh: "kmeny", proc: "jsou to Bójové: Římané nazvali naši zemi Boiohaemum, země Bójů, odtud pochází pozdější latinské Bohemia; Bójové byli keltský kmen, který tu žil asi od 4. století př. n. l.; Slované přišli až jako poslední" },
    { text: "Drobné zlaté mince miskovitého tvaru", druh: "peníze", proc: "jsou to duhovky, mince, které razili Keltové" },
    { text: "Řemeslníci, kteří u nás jako první točili hrnce na kruhu", druh: "řemesla", proc: "hrnčířský kruh k nám přinesli Keltové; první Slované dělali hrnce zase rukou" },
    { text: "První obyvatelé naší země, kteří platili vlastními penězi", druh: "peníze", proc: "vlastní mince u nás jako první razili Keltové, dávno před příchodem Germánů" },
  ],
  [G]: [
    { text: "Král, který kolem přelomu letopočtu vládl v Čechách mocné říši a jednal s Římem", druh: "vládci", proc: "je to Marobud, král germánských Markomanů; přišel až po Keltech" },
    { text: "Král, který kolem přelomu letopočtu sjednotil kmeny v Čechách a nakonec uprchl k Římanům", druh: "vládci", proc: "je to Marobud, markomanský král; po svržení dožil pod ochranou Říma v italské Ravenně" },
    { text: "Kmen, který sídlil na Moravě a spolu se sousedy válčil s Římany", druh: "kmeny", proc: "jsou to Kvádové, germánský kmen z Moravy; s Římem válčili ve 2. století n. l., kdy tu Slované ještě nebyli" },
    { text: "Kmen, po němž se jmenují války s Římem ve 2. století n. l.", druh: "války", proc: "jsou to Markomani, germánský kmen z Čech; války se proto jmenují markomanské" },
    { text: "Období, které se u nás jmenuje podle sousední velké říše", druh: "období", proc: "je to doba římská, kdy u nás žily germánské kmeny a obchodovaly s Římem" },
    { text: "Bojovníci, kterým do hrobů dávali zboží přivezené z Říma", druh: "obchod", proc: "zboží z Říma se sem dostávalo obchodem ke Germánům v době římské; Římané tu natrvalo nesídlili, jen za markomanských válek tu krátce táborila jejich vojska" },
  ],
  [S]: [
    { text: "Čtvercové obydlí zapuštěné do země s kamennou pecí v rohu", druh: "obydlí", proc: "je to polozemnice, typické obydlí Slovanů; zahloubená obydlí stavěli i jiní, ale čtvercový půdorys s kamennou pecí v rohu je typicky slovanský" },
    { text: "Zemědělci, kteří přišli z východu až po Germánech", druh: "zemědělství", proc: "Slované přišli z východu asi v 6. století n. l. a nějakou dobu žili vedle zbylých germánských skupin; zmínka o Germánech jen říká, kdo tu byl před nimi" },
    { text: "Rolníci, kteří získávali pole vypalováním lesa", druh: "zemědělství", proc: "je to žďáření, způsob, jakým pole získávali slovanští zemědělci" },
    { text: "Jednoduché hrnce tvarované rukou, podle nichž archeologové poznají nejstarší vesnice z 6. století n. l.", druh: "řemesla", proc: "je to keramika pražského typu, podle níž se poznají nejstarší sídliště Slovanů, kteří k nám přišli v 6. století n. l." },
    { text: "Předkové dnešních Čechů, Poláků i Rusů", druh: "jazyk", proc: "dnešní slovanské národy, i Češi, pocházejí ze Slovanů; na naše území přišla jejich část asi v 6. století n. l." },
    { text: "Národ, jehož jazyk je předkem dnešní češtiny", druh: "jazyk", proc: "čeština je slovanský jazyk; Keltové ani Germáni česky nemluvili" },
  ],
};

// ── L3: nález nebo situace, nejdřív doba, pak národ ────────────────────────
const L3: Record<string, Karta[]> = {
  [K]: [
    { text: "Archeolog najde osadu z doby kolem roku 300 př. n. l.", druh: "letopočet", proc: "rok 300 př. n. l. leží na časové ose vlevo od přelomu letopočtu, v době, kdy tu už žili Keltové a Germáni ještě nepřišli" },
    { text: "Mince ražená u nás kolem roku 100 př. n. l.", druh: "letopočet", proc: "rok 100 př. n. l. je ještě před přelomem letopočtu, tedy v době Keltů" },
    { text: "Hrob bojovníka ze 3. století př. n. l.", druh: "letopočet", proc: "př. n. l. znamená před přelomem letopočtu, kdy tu žili Keltové; nepleť si to se 3. stoletím n. l., kdy tu byli Germáni" },
    { text: "Zlatý šperk z doby kolem roku 200 př. n. l.", druh: "letopočet", proc: "rok 200 př. n. l. leží před přelomem letopočtu, v době Keltů" },
    { text: "Železný meč ze 2. století př. n. l.", druh: "letopočet", proc: "2. století př. n. l. je před přelomem letopočtu, kdy tu žili Keltové" },
    { text: "Nejstarší z těchto tří národů na našem území", druh: "pořadí", proc: "Keltové přišli první, asi ve 4. století př. n. l.; Slované nejsou nejstarší, přišli až jako poslední" },
    { text: "Národ, který tu žil ještě před těmi, proti nimž táhla vojska Marka Aurelia", druh: "pořadí", proc: "Marek Aurelius válčil ve 2. století n. l. s Germány (Markomany a Kvády); před Germány tu žili Keltové" },
    { text: "Národ, který tu žil těsně před příchodem Germánů", druh: "pořadí", proc: "Germáni přišli kolem přelomu letopočtu a těsně před nimi tu žili Keltové" },
  ],
  [G]: [
    { text: "Archeolog najde vesnici z doby kolem roku 200 n. l.", druh: "letopočet", proc: "rok 200 n. l. leží na časové ose vpravo od přelomu letopočtu, v době mezi příchodem Germánů a Slovanů" },
    { text: "Hrob bojovníka ze 3. století n. l.", druh: "letopočet", proc: "3. století n. l. je po přelomu letopočtu, ale dávno před příchodem Slovanů, tedy v době Germánů" },
    { text: "Osada z doby kolem roku 300 n. l.", druh: "letopočet", proc: "rok 300 n. l. patří do doby, kdy tu žili Germáni; Slované přišli až asi v 6. století n. l." },
    { text: "Hrob náčelníka z 1. století n. l. s římskou mincí a bronzovou nádobou", druh: "Řím", proc: "v 1. století n. l. tu sídlili Germáni a římské zboží k nim přicházelo obchodem; Římané tu natrvalo nesídlili, jen za markomanských válek tu krátce táborila jejich vojska" },
    { text: "Obyvatelé, proti nimž táhla vojska císaře Marka Aurelia", druh: "Řím", proc: "Marek Aurelius válčil ve 2. století n. l. s Markomany a Kvády; Slované tu tehdy ještě nebyli" },
    { text: "Bojovníci, kteří ve 2. století n. l. válčili s Římany na Dunaji", druh: "Řím", proc: "ve 2. století n. l. tu žili Germáni, kteří s Římem vedli markomanské války" },
    { text: "Národ, který sem přišel po Keltech, ale před Slovany", druh: "pořadí", proc: "mezi Kelty a Slovany přišli kolem přelomu letopočtu Germáni" },
    { text: "Národ, který tu žil těsně před příchodem Slovanů", druh: "pořadí", proc: "Slované přišli asi v 6. století n. l. do krajiny, kterou předtím obývali Germáni" },
  ],
  [S]: [
    { text: "Archeolog najde vesnici z doby kolem roku 600 n. l.", druh: "letopočet", proc: "rok 600 n. l. leží na časové ose daleko vpravo od přelomu letopočtu; Slované přišli asi v 6. století n. l. (nepleť si to s dobou př. n. l.)" },
    { text: "Hrob ze 7. století n. l.", druh: "letopočet", proc: "7. století n. l. je až po příchodu Slovanů v 6. století n. l." },
    { text: "Hrnec vyrobený kolem roku 700 n. l.", druh: "letopočet", proc: "rok 700 n. l. patří do doby, kdy tu už žili Slované" },
    { text: "Osada z 8. století n. l.", druh: "letopočet", proc: "8. století n. l. je dlouho po příchodu Slovanů, Germáni tu už nesídlili" },
    { text: "Národ, který sem přišel jako poslední z těchto tří", druh: "pořadí", proc: "pořadí je Keltové, Germáni, Slované; Slované tu tedy nebyli odjakživa" },
    { text: "Hrob z doby asi 200 let po zániku Západořímské říše (476)", druh: "Řím", proc: "476 + 200 je asi rok 676, tedy 7. století n. l., kdy tu už žili Slované" },
    { text: "Národ, který sem přišel až po těch, proti nimž táhla vojska Marka Aurelia", druh: "pořadí", proc: "Marek Aurelius válčil ve 2. století n. l. s Germány; po Germánech přišli asi v 6. století n. l. Slované" },
  ],
};

const BANKA: Record<number, Record<string, Karta[]>> = { 1: L1, 2: L2, 3: L3 };
/** Počty karet v koších; úloha je rotuje, takže dvojici dostane každý národ. */
const POCTY: Record<number, number[]> = { 1: [2, 1, 1], 2: [2, 2, 1], 3: [2, 2, 2] };

const ZADANI: Record<number, string> = {
  1: "Roztřiď pojmy k národu, kterému patří.",
  2: "Podle popisu poznej, o co jde, a zařaď to ke správnému národu.",
  3: "U každého nálezu nebo situace nejdřív zjisti, do které doby patří nebo kdo přišel před kým, a pak kartu přiřaď národu, který tu tehdy žil.",
};

/** Deterministický výběr `k` různých karet (k ≤ 2): krok 1…n−1 nikdy nevrátí stejný index. */
function vyber(pool: Karta[], k: number, seed: number): Karta[] {
  const n = pool.length;
  const krok = 1 + (seed % (n - 1));
  return Array.from({ length: k }, (_, j) => pool[(seed + j * krok) % n]);
}

function seznam(slova: string[]): string {
  return slova.length <= 1 ? slova.join("") : `${slova.slice(0, -1).join(", ")} a ${slova[slova.length - 1]}`;
}

function napovedy(level: number, karty: Karta[]): string[] {
  const druhy = [...new Set(karty.map((c) => c.druh))];
  if (level === 1) {
    return [
      `Mezi pojmy jsou ${seznam(druhy)}. U každého si vybav, v jaké souvislosti jsi ho v učebnici potkal a z jaké doby pochází.`,
      `Pomůže pořadí příchodu: ${PORADI} U každého pojmu odvoď dobu podle toho, s čím se pojí (s Římem, s mincemi, s novou vírou, se zemědělstvím), a porovnej ji s touto časovou osou.`,
    ];
  }
  if (level === 2) {
    return [
      `Popisy se týkají oblastí: ${seznam(druhy)}. Nejdřív z každého popisu urči, jak se ta věc nebo ten člověk jmenuje.`,
      `Když pojem pojmenuješ, vzpomeň si, kdy k nám jeho národ přišel: ${PORADI} Pozor na popisy, které zmiňují jiný národ nebo Řím: kdo je v popisu jen jmenovaný, bývá soused nebo předchůdce, ne hledaný národ.`,
    ];
  }
  const texty = karty.map((c) => c.text);
  const vety: string[] = [];
  const pred = texty.some((t) => /př\. n\. l\./.test(t));
  const po = texty.some((t) => /\d.*(?<!př\. )n\. l\./.test(t));
  if (pred && po) vety.push("Některé karty mají letopočet před naším letopočtem a jiné po něm: zakresli si je na časovou osu, př. n. l. leží vlevo od přelomu letopočtu a rok 0 neexistuje.");
  else if (pred || po) vety.push("U karet s letopočtem si nejdřív urči, jestli leží před přelomem letopočtu, nebo po něm, a jak daleko od něj.");
  if (druhy.includes("pořadí")) vety.push("Karty bez letopočtu popisují, kdo přišel před kým nebo po kom; seřaď si národy podle příchodu.");
  if (druhy.includes("Řím")) vety.push("U karet s Římem si vzpomeň, ve kterém století se to stalo, a teprve pak hledej národ.");
  return [
    vety.join(" "),
    `Časová osa příchodu: ${PORADI} Každý národ patří k době od svého příchodu až do příchodu dalšího, takže rozhoduje, mezi které dva příchody karta spadá. Pomůžou i pevné body: Marek Aurelius válčil ve 2. století n. l. a Západořímská říše zanikla roku 476.`,
  ];
}

function uloha(level: number, i: number): PracticeTask {
  const vyberNaroda: Record<string, Karta[]> = {};
  NARODY.forEach((narod, n) => {
    const k = POCTY[level][(n + i) % 3];
    vyberNaroda[narod] = vyber(BANKA[level][narod], k, i * (7 + 2 * n) + 3 * n);
  });
  const vse = NARODY.flatMap((narod) => vyberNaroda[narod].map((c) => ({ c, narod })));
  return cat(
    ZADANI[level],
    NARODY.map((narod) => ({ name: narod, items: vyberNaroda[narod].map((c) => c.text) })),
    {
      hints: napovedy(level, vse.map((x) => x.c)),
      explanation: `Rozhoduje doba a znak. ${PORADI} ${vse
        .map((x) => `„${x.c.text}“ patří ${K_NARODU[x.narod]}: ${x.c.proc.endsWith(".") ? x.c.proc : `${x.c.proc}.`}`)
        .join(" ")}`,
    },
  );
}

function gen(level: number): PracticeTask[] {
  const out = new Map<string, PracticeTask>();
  for (let i = 0; i < 400 && out.size < 24; i++) {
    const t = uloha(level, i);
    out.set(t.categories!.map((c) => [...c.items].sort().join("+")).join("|"), t);
  }
  return [...out.values()];
}

// ── Topic ────────────────────────────────────────────────────────────────
export const KELTOVE_GERMANI_SLOVANE: TopicMetadata[] = [
  {
    id: "g6-dej-keltove-germani-slovane-6",
    rvpNodeId: "g6-dejepis-pravek-pravek-na-nasem-uzemi-keltove-germani-slovane-prichod",
    displayName: "Keltové, Germáni a Slované",
    title: "Keltové, Germáni a Slované – příchod na naše území",
    studentTitle: "Keltové, Germáni a Slované u nás",
    subject: "dejepis",
    category: "Pravěk",
    topic: "Pravěk na našem území",
    briefDescription: "Roztřiď stopy, jména a nálezy ke Keltům, Germánům a Slovanům.",
    keywords: [
      "Keltové", "Germáni", "Slované", "Bójové", "oppidum", "druidové",
      "Markomani", "Kvádové", "Marobud", "polozemnice", "příchod Slovanů",
    ],
    goals: [
      "Přiřadit pojem, jméno nebo nález ke Keltům, Germánům, nebo Slovanům.",
      "Poznat pojem podle popisu a zařadit ho k národu.",
      "Využít pořadí příchodu (Keltové → Germáni → Slované) k zařazení nálezu podle doby.",
    ],
    boundaries: [
      "Jen tři národy: Keltové, Germáni, Slované.",
      "Datace jen na celá století, s „asi“ nebo „kolem“.",
      "Nezahrnuje Sámovu říši, Avary ani Velkou Moravu (raný středověk, 7. ročník).",
    ],
    gradeRange: [6, 6],
    inputType: "categorize",
    defaultLevel: 1,
    sessionTaskCount: 3,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Rozhoduje doba: Keltové přišli první (asi 4. století př. n. l.), Germáni kolem přelomu letopočtu, Slované jako poslední (asi 6. století n. l.).",
      steps: [
        "Poznej, o co na kartě jde (kmen, stavba, obydlí, nález s letopočtem).",
        "Urči dobu: před přelomem letopočtu, kolem něj, nebo dávno po něm.",
        "Přiřaď kartu národu, který tu v té době žil.",
      ],
      commonMistake: "Myslet si, že Slované tu byli odjakživa. Jméno Bohemia pochází od keltských Bójů a Slované přišli až jako poslední.",
      example: "Opevněné město s mincovnou = Keltové. Markomani a král Marobud = Germáni. Polozemnice = Slované.",
    },
  },
];
