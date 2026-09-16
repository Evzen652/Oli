/**
 * Přírodopis 6. ročník — Vývoj života na Zemi, geologická období (categorize).
 *
 * Žák třídí organismy, události a nálezy do prvohor, druhohor, třetihor
 * a čtvrtohor.
 *  • L1 rozpoznání: dvě kontrastní éry, 4–6 známých zástupců nebo jevů.
 *  • L2 použití: všechny čtyři éry, 6–8 položek, aspoň dvě z nich jsou
 *    rostliny nebo události (uhlí, vymírání, doby ledové).
 *  • L3 přenos: popisy nálezů bez jména zástupce i éry, éra se odvozuje
 *    ze stop (druh uhlí, srst a chlad, peří a zuby, kamenné nástroje).
 *
 * Banka obsahuje jen položky, které patří jednoznačně do jedné éry.
 * Záměrně chybí amoniti, žraloci, hmyz a kapradiny obecně, „první ptáci“
 * bez upřesnění, „obří ještěři“ bez upřesnění (obří krokodýli a hadi žili
 * i ve třetihorách — proto „dinosauři“) a starohory.
 *
 * Nápovědy se skládají jen ze stop, které v úloze opravdu jsou (`stopy`).
 * Upozornění na typickou chybu (`pozor`) se do vysvětlení přidá, jen když
 * úloha obsahuje obě strany té záměny.
 *
 * DETERMINISMUS: úloha je daná indexem `i`, který se nastaví na začátku
 * `gen()`. Výběr položek počítá `rozptyl()` z indexu, bez Math.random, takže
 * dvě volání `gen(n)` vrátí totéž a modul nemá stav mezi voláními.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildCategorizeTask, ruzneUlohy } from "./_shared";

const P = "Prvohory";
const D = "Druhohory";
const T = "Třetihory";
const C = "Čtvrtohory";
const ERY = [P, D, T, C] as const;
type Era = (typeof ERY)[number];
/** Genitiv pro „patří do …“ (pád jako vlastní pole, nelepí se k nominativu). */
const DO_ERY: Record<Era, string> = { [P]: "prvohor", [D]: "druhohor", [T]: "třetihor", [C]: "čtvrtohor" };

/** Upozornění na typickou chybu; do vysvětlení se přidá, když úloha obsahuje obě strany záměny. */
type Pozor = "lide" | "srst" | "uhli" | "savci" | "more";

const POZOR: Record<Pozor, string> = {
  lide: "Pozor: dinosauři a lidé se nikdy nepotkali. Dinosauři vymřeli na konci druhohor, víc než 60 milionů let předtím, než se objevili první lidé.",
  srst: "Velké pravěké zvíře ještě není dinosaurus. Srst měli už první savci, ale hustá srst spolu s přizpůsobením chladu ukazuje na doby ledové, které se střídaly ve čtvrtohorách.",
  uhli: "Uhlí není jen jedno. Černé uhlí je starší, vzniklo z pralesů stromových plavuní a přesliček v prvohorách. Hnědé uhlí vzniklo z mladších lesů ve třetihorách.",
  savci: "Drobní savci žili už vedle dinosaurů v druhohorách. Ve třetihorách se rozšířili a zvětšili, když dinosauři vymřeli.",
  more: "Život v pravěkých mořích nepatří automaticky k mořským ještěrům do druhohor. Trilobiti a první ryby žili v mořích už v prvohorách, dávno před mořskými ještěry.",
};

/**
 * Kdy upozornění dává smysl: `tag` = éry položek s tímto upozorněním,
 * `ery` = éry, které v úloze mají aspoň jednu položku.
 */
const POZOR_PODMINKA: Record<Pozor, (tag: Set<Era>, ery: Set<Era>) => boolean> = {
  lide: (tag) => tag.has(D) && tag.has(C),
  srst: (tag, ery) => tag.has(C) && ery.has(D),
  uhli: (tag, ery) => tag.size > 0 && ery.has(P) && ery.has(T),
  savci: (tag, ery) => tag.size > 0 && ery.has(D) && ery.has(T),
  more: (tag) => tag.has(P) && tag.has(D),
};

/** Stopa, podle které se éra pozná; z ní se skládají nápovědy. */
type Stopa =
  | "uhli" | "savci" | "srst" | "pero" | "ptaci" | "more" | "rostliny" | "teplo"
  | "lidoop" | "led" | "hmyz" | "lide" | "jestri" | "les" | "sous";

/** Pořadí = priorita pro hints[0] (nejdřív stopy, na kterých se nejčastěji chybuje). */
const STOPY_PORADI: Stopa[] = [
  "uhli", "savci", "srst", "pero", "ptaci", "more", "rostliny", "teplo",
  "lidoop", "led", "hmyz", "lide", "jestri", "les", "sous",
];

/** Krátký název stopy do výčtu v hints[1]. */
const STOPA_NAZEV: Record<Stopa, string> = {
  uhli: "druh uhlí (černé, nebo hnědé)",
  savci: "savci (první drobní, nebo už rozšíření)",
  srst: "hustá srst a chlad",
  pero: "peří a zuby",
  ptaci: "ptáci",
  more: "život v pravěkém moři",
  rostliny: "jehličnany, nebo kvetoucí rostliny",
  teplo: "rostliny teplých krajů",
  lidoop: "lidoopi bez lidí",
  led: "ledovce a doby ledové",
  hmyz: "obří hmyz",
  lide: "lidé a jejich nástroje",
  jestri: "dinosauři a mořští ještěři",
  les: "pralesy plavuní a přesliček",
  sous: "přechod z vody na souš",
};

/** První krok pro hints[0]: navádí na konkrétní položku úlohy, éru neprozradí. */
const STOPA_START: Record<Stopa, string> = {
  uhli: "Začni položkou s uhlím. Rozhodni, jestli jde o černé, nebo hnědé uhlí, a vzpomeň si, které z nich je starší.",
  savci: "Začni položkou se savci. Rozliš, jestli jde o první drobné savce, nebo o dobu, kdy se savci rozšířili a zvětšili.",
  srst: "Začni položkou se zvířetem, které má hustou srst. Zeptej se, v jaké době potřebovalo ochranu před velkým chladem.",
  pero: "Začni položkou s peřím. Všimni si, že zvíře má ještě zuby a drápy na křídlech, a zeptej se, s kým tehdy žilo.",
  ptaci: "Začni položkou s ptáky. Zeptej se, kdy se ptáci mohli rozrůznit do mnoha druhů: ještě za dinosaurů, nebo až po jejich vymření?",
  more: "Začni položkou z pravěkého moře. Zeptej se, jestli jde o trilobity a první ryby, nebo o mořské ještěry.",
  rostliny: "Začni položkou s rostlinami. Rozliš, jestli tehdy převládaly jehličnany, nebo kvetoucí rostliny.",
  teplo: "Začni položkou s rostlinou teplých krajů. Zeptej se, kdy u nás bylo mnohem tepleji než dnes.",
  lidoop: "Začni položkou s lidoopy. Zeptej se, jestli v té době už žil člověk.",
  led: "Začni položkou s ledem nebo ledovcem. Zeptej se, kdy se u nás střídaly doby ledové.",
  hmyz: "Začni položkou s obřím hmyzem. Zeptej se, v jaké době rostly pralesy, ve kterých tak velký hmyz žil.",
  lide: "Začni položkou, ve které jsou lidé. Zeptej se, kdy se objevili první lidé a s jakými zvířaty žili.",
  jestri: "Začni položkou s dinosaurem nebo mořským ještěrem. Vzpomeň si, kdy tito ještěři vymřeli.",
  les: "Začni položkou se stromovými plavuněmi nebo přesličkami. Zeptej se, z jakých pralesů vzniklo černé uhlí.",
  sous: "Začni položkou o přechodu z vody na souš. Zeptej se, jestli se to stalo v nejstarší z probíraných er, nebo až v některé z mladších.",
};

/** Hlavní poznávací znak éry pro L1 (dvě éry, výčet jen těch dvou). */
const ERA_ZNAK: Record<Era, string> = {
  [P]: "trilobiti, první ryby a pralesy stromových plavuní a přesliček",
  [D]: "velcí ještěři, hlavně dinosauři",
  [T]: "doba po vymření dinosaurů, kdy se rozšířili savci a kvetoucí rostliny",
  [C]: "doby ledové, zvířata s hustou srstí a dnešní člověk",
};

interface Polozka {
  text: string;
  /** Proč položka patří do své éry — věta navazující na „patří sem, protože…“. */
  proc: string;
  pozor?: Pozor[];
  stopy: Stopa[];
  /** L2: rostlina nebo událost, kterou žák musí s érou spojit (ne zvíře z L1). */
  nova?: boolean;
}

// ── L1: známí zástupci a jevy ────────────────────────────────────────────
const L1: Record<Era, Polozka[]> = {
  [P]: [
    { text: "Trilobit", proc: "je mořský členovec, který vymřel už na konci prvohor", pozor: ["more"], stopy: ["more"] },
    { text: "První ryby", proc: "první ryby se objevily v prvohorních mořích", pozor: ["more"], stopy: ["more"] },
    { text: "Stromové plavuně", proc: "tvořily prvohorní pralesy, ze kterých vzniklo černé uhlí", stopy: ["les"] },
    { text: "Stromové přesličky", proc: "rostly v prvohorních pralesích spolu se stromovými plavuněmi", stopy: ["les"] },
    { text: "První obojživelníci", proc: "v prvohorách vylezli první obratlovci z vody na souš", stopy: ["sous"] },
  ],
  [D]: [
    { text: "Tyranosaurus", proc: "je dravý dinosaurus a dinosauři žili v druhohorách", pozor: ["lide"], stopy: ["jestri"] },
    { text: "Diplodok", proc: "je býložravý dinosaurus s dlouhým krkem, typický pro druhohory", pozor: ["lide"], stopy: ["jestri"] },
    { text: "Ptakoještěři", proc: "jsou létající plazi, kteří vymřeli spolu s dinosaury na konci druhohor", pozor: ["lide"], stopy: ["jestri"] },
    { text: "Ichtyosaurus (mořský ještěr podobný delfínovi)", proc: "tito mořští ještěři žili v druhohorních mořích", pozor: ["lide", "more"], stopy: ["more", "jestri"] },
  ],
  [T]: [
    { text: "Rozvoj savců", proc: "když dinosauři vymřeli, savci se ve třetihorách rozšířili a zvětšili", pozor: ["savci"], stopy: ["savci"] },
    { text: "Rozvoj ptáků", proc: "ptáci se ve třetihorách rozrůznili do mnoha druhů", stopy: ["ptaci"] },
    { text: "Lesy, ve kterých poprvé převládly kvetoucí rostliny", proc: "ve třetihorách kvetoucí rostliny poprvé ovládly většinu lesů (objevily se už v druhohorách, ale převahu tehdy ještě neměly)", stopy: ["rostliny"] },
  ],
  [C]: [
    { text: "Mamut srstnatý", proc: "hustá srst ho chránila v době ledové a doby ledové se střídaly ve čtvrtohorách", pozor: ["srst"], stopy: ["srst"] },
    { text: "Nosorožec srstnatý", proc: "srst ho chránila před chladem doby ledové ve čtvrtohorách", pozor: ["srst"], stopy: ["srst"] },
    { text: "Jeskynní medvěd", proc: "přečkával v jeskyních chladné doby ledové ve čtvrtohorách", pozor: ["srst"], stopy: ["srst"] },
    { text: "Člověk rozumný", proc: "náš druh se objevil až ve čtvrtohorách", pozor: ["lide"], stopy: ["lide"] },
  ],
};

// ── L2: k zástupcům přibývají rostliny a události ────────────────────────
const L2_NOVE: Record<Era, Polozka[]> = {
  [P]: [
    { text: "Vznik černého uhlí z pralesů plavuní a přesliček", proc: "tyto pralesy rostly v prvohorách a z jejich zbytků vzniklo černé uhlí", pozor: ["uhli"], stopy: ["uhli", "les"], nova: true },
    { text: "Přechod života z vody na souš", proc: "v prvohorách se na souši uchytily první rostliny a vylezli na ni první obojživelníci", stopy: ["sous"], nova: true },
  ],
  [D]: [
    { text: "Převaha jehličnanů a jiných rostlin bez květů v lesích", proc: "v druhohorách převládaly jehličnany a další rostliny bez květů a kvetoucí rostliny se objevily až v posledním období druhohor", stopy: ["rostliny"], nova: true },
    { text: "Archeopteryx", proc: "je pravěký pták s peřím i zuby, žil v druhohorách vedle dinosaurů", pozor: ["lide"], stopy: ["pero"], nova: true },
    { text: "Vymírání dinosaurů", proc: "dinosauři vymřeli na konci druhohor", pozor: ["lide"], stopy: ["jestri"], nova: true },
    { text: "První drobní savci vedle dinosaurů", proc: "první malí savci se objevili už v druhohorách", pozor: ["savci"], stopy: ["savci"], nova: true },
  ],
  [T]: [
    { text: "Vznik hnědého uhlí v severních Čechách", proc: "hnědé uhlí vzniklo z lesů, které rostly ve třetihorách", pozor: ["uhli"], stopy: ["uhli"], nova: true },
    { text: "Rozvoj lidoopů", proc: "lidoopi se objevili a rozšířili ve třetihorách, ještě před člověkem", stopy: ["lidoop"], nova: true },
  ],
  [C]: [
    { text: "Střídání dob ledových a meziledových", proc: "doby ledové a teplejší meziledové doby se střídaly ve čtvrtohorách", stopy: ["led"], nova: true },
    { text: "Lov mamutů pravěkými lidmi", proc: "lidé a mamuti žili zároveň až ve čtvrtohorách", pozor: ["lide", "srst"], stopy: ["lide", "srst"], nova: true },
  ],
};
const L2: Record<Era, Polozka[]> = {
  [P]: [...L2_NOVE[P], ...L1[P]],
  [D]: [...L2_NOVE[D], ...L1[D]],
  [T]: [...L2_NOVE[T], ...L1[T]],
  [C]: [...L2_NOVE[C], ...L1[C]],
};

// ── L3: popisy nálezů bez jména zástupce i éry ───────────────────────────
const L3: Record<Era, Polozka[]> = {
  [P]: [
    { text: "Ve vrstvě černého uhlí je otisk kmene se šupinatou kůrou.", proc: "černé uhlí vzniklo z pralesů stromových plavuní a šupinatá kůra patří právě jim", pozor: ["uhli"], stopy: ["uhli"] },
    { text: "V kameni je otisk křídla vážky velké jako holub.", proc: "obří vážky létaly v prvohorních pralesích, ze kterých vzniklo černé uhlí", stopy: ["hmyz"] },
    { text: "Otisk mořského členovce, jehož tělo tvoří tři podélné části.", proc: "takové tělo měl trilobit, který vymřel na konci prvohor", pozor: ["more"], stopy: ["more"] },
    { text: "Ve vrstvě černého uhlí je otisk článkovaného stonku s přeslenem lístků.", proc: "článkovaný stonek s přesleny mají přesličky a stromové přesličky tvořily prvohorní uhelné pralesy", pozor: ["uhli"], stopy: ["uhli"] },
    { text: "Kostra jednoho z prvních obratlovců, kteří vylezli z vody na souš.", proc: "první obojživelníci vylezli na souš v prvohorách", stopy: ["sous"] },
    { text: "Otisk pancéřovaného živočicha s ploutvemi, jedné z nejstarších ryb.", proc: "mezi nejstarší ryby patřily pancéřované (pancířnaté) ryby prvohorních moří", pozor: ["more"], stopy: ["more"] },
  ],
  [D]: [
    { text: "Vedle kostí dinosaura leží zub malého chlupatého savce.", proc: "dinosauři žili v druhohorách a drobní savci už vedle nich", pozor: ["savci", "lide"], stopy: ["savci", "jestri"] },
    { text: "Otisk zvířete s peřím, zuby a drápy na křídlech.", proc: "takový byl archeopteryx, pravěký pták z doby dinosaurů", stopy: ["pero"] },
    { text: "Stopy velkého dvounohého dinosaura v bahně a vedle nich otisk šišky jehličnanu.", proc: "dinosauři i převaha jehličnanů patří do druhohor", pozor: ["lide"], stopy: ["jestri", "rostliny"] },
    { text: "Kostra mořského plaza, který rodil živá mláďata a tělem připomínal delfína.", proc: "takový byl ichtyosaurus z druhohorních moří", pozor: ["more"], stopy: ["more", "jestri"] },
    { text: "Otisk listu cykasu vedle zkamenělého vejce dinosaura.", proc: "cykasy (rostliny bez květů) byly hojné v druhohorách a dinosauři žili jen v druhohorách", pozor: ["lide"], stopy: ["jestri", "rostliny"] },
    { text: "Kostra létajícího plaza s blánou mezi dlouhým prstem a tělem.", proc: "takoví byli ptakoještěři, kteří vymřeli s dinosaury na konci druhohor", pozor: ["lide"], stopy: ["jestri"] },
    { text: "Nejvyšší vrstva, ve které se ještě najdou kosti dinosaurů.", proc: "dinosauři vymřeli na konci druhohor, takže poslední vrstva s jejich kostmi patří ještě do druhohor", pozor: ["lide"], stopy: ["jestri"] },
  ],
  [T]: [
    { text: "V hnědém uhlí je otisk listu kvetoucí rostliny.", proc: "hnědé uhlí vzniklo ve třetihorách a v jeho lesích už rostlo mnoho kvetoucích stromů", pozor: ["uhli"], stopy: ["uhli", "rostliny"] },
    { text: "V hnědouhelném dole je otisk listu vavřínu, který dnes roste jen v teplých krajích.", proc: "hnědé uhlí vzniklo ve třetihorách, kdy bylo u nás mnohem tepleji", pozor: ["uhli"], stopy: ["uhli", "teplo"] },
    { text: "Zkamenělá lebka lidoopa z doby, kdy ještě nežil žádný člověk.", proc: "lidoopi žili už ve třetihorách, člověk rozumný přišel až ve čtvrtohorách", stopy: ["lidoop"] },
    { text: "Zub velkého savce a otisky listů teplomilných kvetoucích stromů ve vrstvě hnědého uhlí.", proc: "hnědé uhlí vzniklo z třetihorních lesů, ve kterých rostly i kvetoucí stromy, bylo u nás tehdy mnohem tepleji než v dobách ledových a velcí savci se rozšířili právě tehdy", pozor: ["uhli", "savci"], stopy: ["uhli", "savci", "rostliny", "teplo"] },
    { text: "V Česku je ve vrstvě s otisky palmových listů kost velkého savce.", proc: "velcí savci se rozšířili až po vymření dinosaurů a palmy u nás naposledy rostly v teplých třetihorách", pozor: ["savci"], stopy: ["teplo", "savci"] },
  ],
  [C]: [
    { text: "V jeskyni leží pazourkový nástroj a kosti sobů a lišky polární.", proc: "kamenné nástroje dělali lidé čtvrtohor a sobi i lišky polární žili u nás v chladných dobách ledových", pozor: ["srst", "lide"], stopy: ["lide", "srst"] },
    { text: "Na stěně jeskyně je nakreslené chlupaté zvíře s dlouhými zakroucenými kly.", proc: "mamuty kreslili lidé doby ledové ve čtvrtohorách", pozor: ["srst", "lide"], stopy: ["lide", "srst"] },
    { text: "Ve věčně zmrzlé půdě na Sibiři je zachované celé tělo slona s hustou srstí.", proc: "hustou srst měl mamut, který žil v dobách ledových čtvrtohor", pozor: ["srst"], stopy: ["srst"] },
    { text: "Obrovská lebka medvěda v jeskyni a vedle ní ohniště a kostěné nástroje.", proc: "jeskynní medvědi a lidé s ohněm žili ve čtvrtohorách", pozor: ["lide"], stopy: ["lide"] },
    { text: "Balvany ze Skandinávie, které na sever Česka dovezl pevninský ledovec.", proc: "pevninský ledovec zasáhl sever našeho území v dobách ledových čtvrtohor", stopy: ["led"] },
    { text: "Hrob lovce s kamennými hroty a parohy soba.", proc: "sobi žili u nás v chladných dobách ledových a lovili je lidé čtvrtohor", pozor: ["lide"], stopy: ["lide"] },
  ],
};

// ── Zadání a nápovědy ────────────────────────────────────────────────────
const ZADANI: Record<number, string> = {
  1: "Zařaď každou položku do jedné ze dvou geologických er.",
  2: "Zařaď každou položku do geologické éry, ve které žila nebo proběhla.",
  3: "Paleontolog popsal tyto nálezy. Urči, ze které éry pocházejí.",
};

const L1_PARY: [Era, Era][] = [[P, D], [D, C], [P, C], [D, T], [T, C]];

/** Deterministické „náhodné“ číslo z indexu úlohy a soli (bez Math.random). */
function rozptyl(i: number, sul: number): number {
  let h = Math.imul(i + 1, 0x9e3779b1) ^ Math.imul(sul + 7, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** `k` po sobě jdoucích položek banky (cyklicky) od posunu daného indexem. */
function vyber(banka: Polozka[], k: number, i: number, sul: number): Polozka[] {
  const start = rozptyl(i, sul) % banka.length;
  return Array.from({ length: Math.min(k, banka.length) }, (_, j) => banka[(start + j) % banka.length]);
}

function velkaNapoveda(level: number, rozdeleni: [Era, Polozka[]][], stopy: Stopa[]): string {
  if (level === 1) {
    const [[starsi], [mladsi]] = rozdeleni;
    return (
      "Seřaď si obě éry od starší k mladší. " +
      `Ke starší patří ${ERA_ZNAK[starsi]}, k mladší ${ERA_ZNAK[mladsi]}. ` +
      "U každé položky rozhodni, ke které z těch dvou dob patří."
    );
  }
  const vycet = `Hledej stopy: ${stopy.map((s) => STOPA_NAZEV[s]).join("; ")}.`;
  if (level === 2) {
    const texty = rozdeleni.flatMap(([, p]) => p.map((x) => x.text));
    const maPrvni = texty.some((t) => /^Prvn/.test(t));
    const maRozvoj = texty.some((t) => /^(Rozvoj|Převaha|Rozšíření)/.test(t));
    return (
      "Seřaď si v duchu všechny čtyři éry od nejstarší. " + vycet +
      " U každé stopy se zeptej, ve které éře byla nejtypičtější, tedy kdy převládala." +
      (maPrvni || maRozvoj
        ? " Pozor na slova: „první“ říká, kdy se něco objevilo, „rozvoj“ a „převaha“ říkají, kdy toho bylo nejvíc."
        : "")
    );
  }
  const maZvire = stopy.includes("savci") || stopy.includes("srst");
  return vycet + (maZvire ? " Nerozhoduj podle velikosti zvířete, ale podle toho, co kolem něj v nálezu leží." : "");
}

function sestav(level: number, rozdeleni: [Era, Polozka[]][]): PracticeTask {
  const vse = rozdeleni.flatMap(([era, pol]) => pol.map((p) => ({ ...p, era })));
  const ery = new Set(rozdeleni.filter(([, p]) => p.length > 0).map(([e]) => e));

  // Upozornění jen tam, kde jsou v úloze obě strany záměny.
  const poznamky = (Object.keys(POZOR) as Pozor[])
    .filter((k) => vse.some((p) => p.pozor?.includes(k)))
    .filter((k) => POZOR_PODMINKA[k](new Set(vse.filter((p) => p.pozor?.includes(k)).map((p) => p.era)), ery))
    .map((k) => POZOR[k]);

  const pritomne = new Set(vse.flatMap((p) => p.stopy));
  const stopy = STOPY_PORADI.filter((s) => pritomne.has(s));

  const start = stopy.length > 0 ? STOPA_START[stopy[0]] : "Začni položkou, kterou znáš nejlépe.";
  // Závěr míří na nejčastější záměny; nic neslibuje podle „podobnosti s dneškem“.
  const zaver = [
    stopy.includes("les") && stopy[0] !== "les"
      ? "Pralesy stromových plavuní a přesliček rostly dávno předtím, než přišli dinosauři."
      : "",
    stopy.includes("rostliny") && level > 1
      ? "Kvetoucí rostliny začaly v lesích převládat až po vymření dinosaurů, ale dávno před dobami ledovými a prvními lidmi."
      : "",
  ].filter(Boolean);
  const hint0 = [start, ...zaver].join(" ");

  return buildCategorizeTask(
    ZADANI[level],
    rozdeleni.map(([era, pol]) => ({ name: era, items: pol.map((p) => p.text) })),
    {
      hints: [hint0, velkaNapoveda(level, rozdeleni, stopy)],
      explanation: [
        ...vse.map((p) => `„${p.text.replace(/\.$/, "")}“ patří do ${DO_ERY[p.era]}, protože ${p.proc}.`),
        ...poznamky,
      ].join(" "),
    },
  );
}

// L1 — dvě kontrastní éry, 2–3 zástupci z každé.
function genL1(i: number): PracticeTask {
  const par = L1_PARY[i % L1_PARY.length];
  return sestav(
    1,
    par.map((era, e): [Era, Polozka[]] => [era, vyber(L1[era], 2 + (rozptyl(i, 10 + e) % 2), i, 20 + e)]),
  );
}

// L2 — všechny čtyři éry, 6–8 položek, aspoň dvě nové (rostlina nebo událost).
function genL2(i: number): PracticeTask | null {
  const celkem = 6 + (i % 3);
  const pocty = [1, 1, 1, 1];
  for (let j = 0; j < celkem - 4; j++) pocty[(rozptyl(i, 30) + j) % 4]++;
  const rozdeleni = ERY.map((era, e): [Era, Polozka[]] => [era, vyber(L2[era], pocty[e], i, 40 + e)]);
  const novych = rozdeleni.flatMap(([, p]) => p).filter((p) => p.nova).length;
  return novych >= 2 ? sestav(2, rozdeleni) : null;
}

// L3 — 5–6 popisů nálezů, všechny čtyři éry.
function genL3(i: number): PracticeTask {
  const pocty = [1, 1, 1, 1];
  const navic = 1 + (i % 2);
  for (let j = 0; j < navic; j++) pocty[(rozptyl(i, 50) + j) % 4]++;
  return sestav(3, ERY.map((era, e): [Era, Polozka[]] => [era, vyber(L3[era], pocty[e], i, 60 + e)]));
}

function gen(level: number): PracticeTask[] {
  let i = 0; // index úlohy — nastavuje se při každém volání, modul nemá stav
  if (level === 1) return ruzneUlohy(() => genL1(i++));
  if (level === 2) {
    return ruzneUlohy(() => {
      for (;;) {
        const t = genL2(i++);
        if (t) return t;
      }
    });
  }
  return ruzneUlohy(() => genL3(i++));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const VYVOJ_ZIVOTA_GEOLOGICKA_OBDOBI: TopicMetadata[] = [
  {
    id: "g6-pri-vyvoj-zivota-geologicka-obdobi-6",
    rvpNodeId:
      "g6-prirodopis-obecna-biologie-vznik-a-vyvoj-zivota-vyvoj-zivota-na-zemi-geologicka-obdobi",
    displayName: "Geologická období",
    title: "Vývoj života na Zemi - geologická období",
    studentTitle: "Život v pravěku Země: od trilobitů po mamuty",
    subject: "prirodopis",
    category: "Obecná biologie",
    topic: "Vznik a vývoj života",
    briefDescription: "Zařaď zvířata, rostliny a nálezy do prvohor, druhohor, třetihor a čtvrtohor.",
    keywords: [
      "prvohory", "druhohory", "třetihory", "čtvrtohory", "geologická období",
      "trilobit", "dinosaurus", "mamut", "černé uhlí", "hnědé uhlí", "doba ledová", "zkameněliny",
    ],
    goals: [
      "Přiřadit organismus nebo událost ke geologické éře podle toho, co pro ni bylo typické.",
      "Rozlišit vznik černého a hnědého uhlí.",
      "Z popisu nálezu odvodit éru podle stop (srst a chlad, peří, druh uhlí, kamenné nástroje).",
    ],
    boundaries: [
      "Jen prvohory, druhohory, třetihory a čtvrtohory; starohory se neprocvičují.",
      "Datace v milionech let nejsou klíčem k úloze.",
      "Třetihory jako školní pojem (bez dělení na paleogén a neogén).",
      "Dělení rostlin na nahosemenné a krytosemenné se nevyžaduje (učí se v 7. ročníku).",
    ],
    gradeRange: [6, 6],
    inputType: "categorize",
    defaultLevel: 1,
    sessionTaskCount: 3,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Éry jdou za sebou: prvohory, druhohory, třetihory, čtvrtohory. Každá má své typické organismy a stopy.",
      steps: [
        "Najdi stopu: trilobiti, pralesy plavuní a černé uhlí → prvohory.",
        "Dinosauři a mořští ještěři, archeopteryx, převaha jehličnanů → druhohory.",
        "Rozvoj savců, lesy, ve kterých poprvé převládly kvetoucí rostliny, hnědé uhlí, lidoopi → třetihory.",
        "Doby ledové, mamut, srstnatý nosorožec, člověk rozumný → čtvrtohory.",
      ],
      commonMistake: "Myslet si, že dinosauři žili zároveň s lidmi a mamuty. Dinosauři vymřeli na konci druhohor, dlouho předtím, než se objevili první lidé.",
      example: "Trilobit = prvohory. Diplodok = druhohory. Hnědé uhlí = třetihory. Mamut srstnatý = čtvrtohory.",
    },
  },
];
