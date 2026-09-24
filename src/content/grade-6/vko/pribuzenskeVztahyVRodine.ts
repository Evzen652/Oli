/**
 * Výchova k občanství 6. ročník — Rodina, příbuzenství, mezigenerační vztahy:
 * odvození příbuzenského vztahu ze slovně popsané rodinné situace (select_one).
 *
 * Slovník příbuznosti je záměrně omezen na 9 pojmů z pravidel pro toto téma:
 * rodiče, prarodiče, sourozenec, teta, strýc, bratranec, sestřenice, synovec,
 * neteř. Žádné další pojmy (švagr, prastrýc…) a žádné hodnocení "správného"
 * složení rodiny — rodinné situace jsou vždy neutrální.
 *
 *  • L1 — přímé přiřazení pojmu k definici bez rodinného příběhu ("Jak se
 *    říká sestře tvé matky?"), jeden vztahový krok od žáka samého.
 *  • L2 — krátký popis se 3 jmenovanými osobami a JEDNÍM společným bodem
 *    (rodič nebo sourozenec rodiče), na který se obě fakta odkazují —
 *    sourozenec, nebo teta/strýc/synovec/neteř přímo odvozené odtud.
 *  • L3 — popis se 4+ jmenovanými osobami a vztahem přes prostředníka
 *    (bratranec/sestřenice přes dva sourozence, nebo teta/strýc/synovec/neteř
 *    odvozené přes prarodiče jako druhého prostředníka) — žák nesmí zastavit
 *    u prvního mezičlánku.
 *
 * Chybový model (každý distraktor patří přesně k jedné z těchto chyb, viz
 * tabulka WHY): (1) prohození směru vztahu u nesymetrických dvojic
 * (strýc↔synovec, teta↔neteř); (2) posun o generaci vedle v téže větvi
 * (strýc/teta ↔ bratranec/sestřenice, rodiče ↔ prarodiče); (3) záměna rodu
 * ve stejné generaci a větvi (teta↔strýc, synovec↔neteř, bratranec↔sestřenice);
 * (4) u L3 zastavení u prvního mezičlánku místo pokračování k cílové osobě
 * (odpověď platná pro prostředníka, ne pro osobu z otázky — typicky
 * "prarodiče" místo teta/strýc/synovec/neteř, nebo "sourozenec" místo
 * bratranec/sestřenice).
 *
 * Generátor nemá stav mezi voláními — rotace bankou se nastaví na začátku
 * gen(), ne na úrovni modulu.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

type Term =
  | "sourozenec"
  | "bratranec"
  | "sestřenice"
  | "strýc"
  | "teta"
  | "synovec"
  | "neteř"
  | "rodiče"
  | "prarodiče";

/** Vysvětlení KAŽDÉHO distraktoru: proč "wrong" není správně, když klíč je "key". */
const WHY: Record<string, string> = {
  "teta|strýc": "Strýc je muž. Tady jde o sestru, ne o bratra — je to žena, proto teta.",
  "teta|sestřenice": "Sestřenice je ve tvé generaci — dítě strýce nebo tety. Sestra rodiče je ale o generaci starší, proto teta.",
  "teta|neteř": "Neteř je dcera sourozence, ne sestra rodiče — prohodil jsi směr příbuzenství.",
  "teta|prarodiče": "Prarodič by byl rodič tvého rodiče, o dvě generace výš. Tady jde o sourozence rodiče, o generaci níž než prarodič — proto teta.",

  "strýc|teta": "Teta je žena. Tady jde o bratra, ne o sestru — je to muž, proto strýc.",
  "strýc|bratranec": "Bratranec je ve tvé generaci — dítě strýce nebo tety. Bratr rodiče je ale o generaci starší, proto strýc.",
  "strýc|synovec": "Synovec je syn sourozence, ne bratr rodiče — prohodil jsi směr příbuzenství.",
  "strýc|prarodiče": "Prarodič by byl rodič tvého rodiče, o dvě generace výš. Tady jde o sourozence rodiče, o generaci níž než prarodič — proto strýc.",

  "bratranec|sestřenice": "Sestřenice je žena. Tady jde o syna, ne o dceru — je to muž, proto bratranec.",
  "bratranec|strýc": "Strýc je o generaci starší — je sourozenec rodiče. Syn strýce nebo tety je ale ve stejné generaci jako ty, proto bratranec.",
  "bratranec|synovec": "Synovec je syn TVÉHO sourozence, jiná větev rodiny. Syn strýce nebo tety je bratranec.",
  "bratranec|teta": "Teta je o generaci starší — je sourozenec rodiče. Syn strýce nebo tety je ale ve stejné generaci jako ty, proto bratranec.",
  "bratranec|sourozenec": "Sourozenci mají společné rodiče. Bratranec má s cílovou osobou společné jen prarodiče — jeho rodič je sourozenec rodiče cílové osoby, je to vzdálenější příbuzenství.",

  "sestřenice|bratranec": "Bratranec je muž. Tady jde o dceru, ne o syna — je to žena, proto sestřenice.",
  "sestřenice|teta": "Teta je o generaci starší — je sourozenec rodiče. Dcera strýce nebo tety je ale ve stejné generaci jako ty, proto sestřenice.",
  "sestřenice|neteř": "Neteř je dcera TVÉHO sourozence, jiná větev rodiny. Dcera strýce nebo tety je sestřenice.",
  "sestřenice|strýc": "Strýc je o generaci starší — je sourozenec rodiče. Dcera strýce nebo tety je ale ve stejné generaci jako ty, proto sestřenice.",
  "sestřenice|sourozenec": "Sourozenci mají společné rodiče. Sestřenice má s cílovou osobou společné jen prarodiče — její rodič je sourozenec rodiče cílové osoby, je to vzdálenější příbuzenství.",

  "synovec|neteř": "Neteř je žena. Tady jde o syna, ne o dceru — je to muž, proto synovec.",
  "synovec|bratranec": "Bratranec je dítě strýce nebo tety, jiná větev rodiny. Syn TVÉHO sourozence je synovec.",
  "synovec|strýc": "Strýc je bratr rodiče, ne syn sourozence — prohodil jsi směr příbuzenství.",
  "synovec|prarodiče": "Prarodič by byl rodič rodiče, ne dítě sourozence. Tady jde o syna sourozence, proto synovec.",

  "neteř|synovec": "Synovec je muž. Tady jde o dceru, ne o syna — je to žena, proto neteř.",
  "neteř|sestřenice": "Sestřenice je dítě strýce nebo tety, jiná větev rodiny. Dcera TVÉHO sourozence je neteř.",
  "neteř|teta": "Teta je sestra rodiče, ne dcera sourozence — prohodil jsi směr příbuzenství.",
  "neteř|prarodiče": "Prarodič by byl rodič rodiče, ne dítě sourozence. Tady jde o dceru sourozence, proto neteř.",

  "sourozenec|bratranec": "Bratranec má s tebou společné jen prarodiče (jeho rodič je sourozenec tvého rodiče). Tady mají obě osoby stejného rodiče, proto sourozenec.",
  "sourozenec|sestřenice": "Sestřenice má s tebou společné jen prarodiče (její rodič je sourozenec tvého rodiče). Tady mají obě osoby stejného rodiče, proto sourozenec.",
  "sourozenec|strýc": "Strýc je o generaci starší — sourozenec rodiče. Tady jde o vztah ve stejné generaci, proto sourozenec.",
  "sourozenec|teta": "Teta je o generaci starší — sourozenec rodiče. Tady jde o vztah ve stejné generaci, proto sourozenec.",
  "sourozenec|synovec": "Synovec je o generaci mladší — syn sourozence. Tady jde o vztah ve stejné generaci, proto sourozenec.",
  "sourozenec|neteř": "Neteř je o generaci mladší — dcera sourozence. Tady jde o vztah ve stejné generaci, proto sourozenec.",

  "rodiče|prarodiče": "Prarodiče jsou rodiče tvých rodičů, o celou generaci starší. Otec a matka jsou rodiče, ne prarodiče.",
  "rodiče|sourozenec": "Sourozenec je osoba ve tvé vlastní generaci se stejnými rodiči jako ty. Otec a matka jsou naopak sami tví rodiče.",
  "rodiče|teta": "Teta je jen sestra jednoho z rodičů, ne oba rodiče dohromady.",

  "prarodiče|rodiče": "Rodiče jsou tví vlastní rodiče, o generaci mladší, než na co se otázka ptá.",
  "prarodiče|strýc": "Strýc je jen sourozenec jednoho rodiče, ve stejné generaci jako rodič — ne rodič rodiče.",
  "prarodiče|sourozenec": "Sourozenec je ve tvé vlastní generaci, ne o dvě generace výš.",
  "prarodiče|teta": "Teta je sestra rodiče, ve stejné generaci jako rodič — ne rodič rodiče.",
};

/**
 * Neutrální (3. osoba) alternativy k `WHY` pro páry klíč|distraktor, které se
 * objevují i v L2/L3 úlohách. Tam otázka žáka neoslovuje ("Petr je syn paní
 * Novákové…", žádné "ty"), takže původní 2.-osobový text z `WHY` ("…má s
 * TEBOU společné jen prarodiče") by najednou mluvil o vztahu k žákovi, který
 * v otázce vůbec nefiguroval. V L1 ("Jak se říká sestře TVÉ matky?") je
 * 2. osoba správně, protože se tak ptá i otázka — tam se `WHY` používá beze
 * změny (viz `whyFor`).
 */
const WHY_NEUTRAL: Record<string, string> = {
  "teta|sestřenice": "Sestřenice je ve stejné generaci jako cílová osoba — dítě strýce nebo tety. Sestra rodiče je ale o generaci starší, proto teta.",
  "teta|neteř": "Neteř je dcera sourozence, ne sestra rodiče — jde o opačný směr příbuzenství.",
  "teta|prarodiče": "Prarodič by byl rodič rodiče cílové osoby, o dvě generace výš. Tady jde o sourozence rodiče, o generaci níž než prarodič — proto teta.",

  "strýc|bratranec": "Bratranec je ve stejné generaci jako cílová osoba — dítě strýce nebo tety. Bratr rodiče je ale o generaci starší, proto strýc.",
  "strýc|synovec": "Synovec je syn sourozence, ne bratr rodiče — jde o opačný směr příbuzenství.",
  "strýc|prarodiče": "Prarodič by byl rodič rodiče cílové osoby, o dvě generace výš. Tady jde o sourozence rodiče, o generaci níž než prarodič — proto strýc.",

  "bratranec|strýc": "Strýc je o generaci starší — je sourozenec rodiče. Syn strýce nebo tety je ale ve stejné generaci jako cílová osoba, proto bratranec.",
  "bratranec|synovec": "Synovec je syn sourozence cílové osoby, jiná větev rodiny. Syn strýce nebo tety je bratranec.",
  "bratranec|teta": "Teta je o generaci starší — je sourozenec rodiče. Syn strýce nebo tety je ale ve stejné generaci jako cílová osoba, proto bratranec.",

  "sestřenice|teta": "Teta je o generaci starší — je sourozenec rodiče. Dcera strýce nebo tety je ale ve stejné generaci jako cílová osoba, proto sestřenice.",
  "sestřenice|neteř": "Neteř je dcera sourozence cílové osoby, jiná větev rodiny. Dcera strýce nebo tety je sestřenice.",
  "sestřenice|strýc": "Strýc je o generaci starší — je sourozenec rodiče. Dcera strýce nebo tety je ale ve stejné generaci jako cílová osoba, proto sestřenice.",

  "synovec|bratranec": "Bratranec je dítě strýce nebo tety, jiná větev rodiny. Syn sourozence cílové osoby je synovec.",
  "synovec|strýc": "Strýc je bratr rodiče, ne syn sourozence — jde o opačný směr příbuzenství.",

  "neteř|sestřenice": "Sestřenice je dítě strýce nebo tety, jiná větev rodiny. Dcera sourozence cílové osoby je neteř.",
  "neteř|teta": "Teta je sestra rodiče, ne dcera sourozence — jde o opačný směr příbuzenství.",

  "sourozenec|bratranec": "Bratranec má s cílovou osobou společné jen prarodiče (jeho rodič je sourozenec rodiče cílové osoby). Tady mají obě osoby stejného rodiče, proto sourozenec.",
  "sourozenec|sestřenice": "Sestřenice má s cílovou osobou společné jen prarodiče (její rodič je sourozenec rodiče cílové osoby). Tady mají obě osoby stejného rodiče, proto sourozenec.",
};

interface Polozka {
  q: string;
  key: Term;
  d: [Term, Term, Term];
  hints: [string, string];
  explanation: string;
}

/** L1 mluví k žákovi ("tvůj/tebou/ty") — otázka sama ho oslovuje. L2/L3 jsou
 *  scénáře o jmenovaných osobách ve 3. osobě, proto tam feedback nesmí
 *  najednou přejít na "ty" — použije se neutrální varianta, pokud existuje. */
function whyFor(level: number, key: Term, distraktor: Term): string {
  const klic = `${key}|${distraktor}`;
  if (level >= 2 && WHY_NEUTRAL[klic]) return WHY_NEUTRAL[klic];
  return WHY[klic];
}

function uloha(p: Polozka, level: number): PracticeTask | null {
  const distraktory: Distractor[] = p.d.map((t) => ({ value: t, why: whyFor(level, p.key, t) }));
  return choice(p.q, p.key, distraktory, { hints: p.hints, explanation: p.explanation });
}

// ── L1 — přímé přiřazení pojmu, bez rodinného příběhu ───────────────────
const POOL_L1: Polozka[] = [
  {
    q: "Jak se říká sestře tvé matky?",
    key: "teta",
    d: ["strýc", "sestřenice", "neteř"],
    hints: [
      "Všimni si, čí je to sourozenec a jakého je pohlaví.",
      "Sourozenec rodiče je stejně starý jako rodič — ne o generaci starší, ne mladší, a je to jiná osoba než dítě sourozence.",
    ],
    explanation: "Sestra matky (nebo otce) je teta — žena ze stejné generace jako tvoji rodiče.",
  },
  {
    q: "Jak se říká bratrovi tvého otce?",
    key: "strýc",
    d: ["teta", "bratranec", "synovec"],
    hints: [
      "Rozhodni, čí je to sourozenec a jestli jde o muže, nebo o ženu.",
      "Sourozenec rodiče patří do stejné generace jako rodič — není to ani rodičovo dítě, ani rodič samotný.",
    ],
    explanation: "Bratr otce (nebo matky) je strýc — muž ze stejné generace jako tvoji rodiče.",
  },
  {
    q: "Jak se říká sestře tvého otce?",
    key: "teta",
    d: ["strýc", "sestřenice", "neteř"],
    hints: [
      "Ptáš se na sourozence otce — soustřeď se na to, jakého je pohlaví.",
      "Nehraje roli, jestli je řeč o matčině, nebo otcově straně rodiny — sourozenec rodiče je vždy stejně starý jako rodič sám.",
    ],
    explanation: "Sestra otce (nebo matky) je teta — žena ze stejné generace jako tvoji rodiče.",
  },
  {
    q: "Jak se říká bratrovi tvé matky?",
    key: "strýc",
    d: ["teta", "bratranec", "synovec"],
    hints: [
      "Ptáš se na sourozence matky — soustřeď se na to, jakého je pohlaví.",
      "Ať je řeč o matčině, nebo otcově straně rodiny, sourozenec rodiče je vždy stejně starý jako rodič sám, ne mladší.",
    ],
    explanation: "Bratr matky (nebo otce) je strýc — muž ze stejné generace jako tvoji rodiče.",
  },
  {
    q: "Jak se říká synovi tvého strýce nebo tvé tety?",
    key: "bratranec",
    d: ["sestřenice", "strýc", "synovec"],
    hints: [
      "Dítě strýce nebo tety patří do tvé vlastní generace — a tady jde o syna.",
      "Nezaměňuj dítě strýce nebo tety s dítětem tvého vlastního sourozence ani se samotným rodičovým sourozencem.",
    ],
    explanation: "Syn strýce nebo tety je bratranec — je ve stejné generaci jako ty.",
  },
  {
    q: "Jak se říká dceři tvého strýce nebo tvé tety?",
    key: "sestřenice",
    d: ["bratranec", "teta", "neteř"],
    hints: [
      "Dítě strýce nebo tety patří do tvé vlastní generace — a tady jde o dceru.",
      "Nezaměňuj dítě strýce nebo tety s dítětem tvého vlastního sourozence ani se samotnou rodičovou sestrou.",
    ],
    explanation: "Dcera strýce nebo tety je sestřenice — je ve stejné generaci jako ty.",
  },
  {
    q: "Jak se říká synovi tvého sourozence?",
    key: "synovec",
    d: ["neteř", "bratranec", "strýc"],
    hints: [
      "Jde o dítě TVÉHO sourozence, ne dítě strýce nebo tety — a je to syn.",
      "Dítě sourozence je o generaci mladší než ty, ne stejně staré jako ty.",
    ],
    explanation: "Syn tvého sourozence je synovec — je o generaci mladší než ty.",
  },
  {
    q: "Jak se říká dceři tvého sourozence?",
    key: "neteř",
    d: ["synovec", "sestřenice", "teta"],
    hints: [
      "Jde o dítě TVÉHO sourozence, ne dítě strýce nebo tety — a je to dcera.",
      "Dítě sourozence je o generaci mladší než ty, ne starší.",
    ],
    explanation: "Dcera tvého sourozence je neteř — je o generaci mladší než ty.",
  },
  {
    q: "Jak se říká synovi tvé sestry?",
    key: "synovec",
    d: ["neteř", "bratranec", "strýc"],
    hints: [
      "Ptáš se na dítě sestry — a jde o syna.",
      "Dítě bratra nebo sestry je vždy o generaci mladší než ty.",
    ],
    explanation: "Syn tvé sestry je synovec.",
  },
  {
    q: "Jak se říká dceři tvého bratra?",
    key: "neteř",
    d: ["synovec", "sestřenice", "teta"],
    hints: [
      "Ptáš se na dítě bratra — a jde o dceru.",
      "Dítě bratra nebo sestry je vždy o generaci mladší než ty, ne stejně staré.",
    ],
    explanation: "Dcera tvého bratra je neteř.",
  },
  {
    q: "Jak se říká chlapci, který je dítětem tvé tety?",
    key: "bratranec",
    d: ["sestřenice", "strýc", "synovec"],
    hints: [
      "Teta je sestra rodiče, ale ptáš se na JEJÍ dítě, a je to chlapec.",
      "Dítě rodičovy sestry patří do tvé generace — je to jiná osoba než rodičova sestra samotná.",
    ],
    explanation: "Syn tety je bratranec.",
  },
  {
    q: "Jak se říká dívce, která je dítětem tvého strýce?",
    key: "sestřenice",
    d: ["bratranec", "teta", "neteř"],
    hints: [
      "Strýc je bratr rodiče, ale ptáš se na JEHO dítě, a je to dívka.",
      "Dítě rodičova bratra patří do tvé generace — je to jiná osoba než rodičův bratr samotný.",
    ],
    explanation: "Dcera strýce je sestřenice.",
  },
  {
    q: "Jak se říká tvému bratrovi nebo tvé sestře jedním společným slovem?",
    key: "sourozenec",
    d: ["bratranec", "strýc", "synovec"],
    hints: [
      "Hledáš jedno slovo, které platí pro bratra i pro sestru zároveň.",
      "Jde o osobu se stejnými rodiči jako ty, ne o dítě rodičova bratra nebo sestry a ne o bratra či sestru rodiče samotného.",
    ],
    explanation: "Bratr nebo sestra se jedním slovem nazývá sourozenec.",
  },
  {
    q: "Jak se říkají společně otec a matka?",
    key: "rodiče",
    d: ["prarodiče", "sourozenec", "teta"],
    hints: [
      "Hledáš jedno slovo pro oba, kdo tě vychovávají — otce i matku.",
      "Nejde o osobu o generaci výš (kdo vychovával je, když byli malí) ani o osoby ve tvé vlastní generaci.",
    ],
    explanation: "Otec a matka se společně nazývají rodiče.",
  },
  {
    q: "Jak se říká rodičům tvých rodičů?",
    key: "prarodiče",
    d: ["rodiče", "strýc", "sourozenec"],
    hints: [
      "Ptáš se o generaci výš, než jsou tví rodiče.",
      "Jde o rodiče rodičů, ne o samotné rodiče ani o jejich bratra či sestru.",
    ],
    explanation: "Rodiče tvých rodičů jsou prarodiče.",
  },
  {
    q: "Do jaké skupiny příbuzných patří matka tvého otce nebo matka tvé matky?",
    key: "prarodiče",
    d: ["rodiče", "teta", "sourozenec"],
    hints: [
      "Jde o matku jednoho z tvých rodičů — to je o generaci výš než sami rodiče.",
      "Nejde o tvého rodiče samotného ani o jeho sourozence, ale o toho, kdo vychoval tvého rodiče.",
    ],
    explanation: "Matka tvého otce nebo matky patří mezi tvé prarodiče.",
  },
];

// ── L2 — 3 jmenované osoby, jeden společný bod ───────────────────────────
const POOL_L2: Polozka[] = [
  {
    q: "Petr je syn paní Novákové. Hana je dcera paní Novákové. Kým je Petr Haně?",
    key: "sourozenec",
    d: ["bratranec", "strýc", "synovec"],
    hints: [
      "Kdo je matkou Petra i Hany zároveň?",
      "Petr a Hana mají stejnou matku — takoví dva lidé jsou navzájem stejně staří, ne jeden druhému rodičem, dítětem ani vnukem.",
    ],
    explanation: "Petr i Hana mají stejnou matku, paní Novákovou — mají tedy stejné rodiče a jsou to sourozenci.",
  },
  {
    q: "Karolína je dcera pana Dvořáka. Filip je syn pana Dvořáka. Kým je Karolína Filipovi?",
    key: "sourozenec",
    d: ["sestřenice", "teta", "neteř"],
    hints: [
      "Kdo je otcem Karolíny i Filipa zároveň?",
      "Karolína a Filip mají společného otce — dva takoví lidé jsou stejné generace, ne rodič a dítě.",
    ],
    explanation: "Karolína i Filip mají stejného otce, pana Dvořáka — mají tedy stejné rodiče a jsou to sourozenci.",
  },
  {
    q: "Tomáš je syn paní Bartošové. Iveta je sestra paní Bartošové. Kým je Iveta Tomášovi?",
    key: "teta",
    d: ["strýc", "sestřenice", "neteř"],
    hints: [
      "Iveta je sestra Tomášovy matky — do jaké generace patří vzhledem k Tomášovi?",
      "Sourozenec rodiče je stejně starý jako rodič, ne jako jeho dítě — a tady jde o ženu.",
    ],
    explanation: "Iveta je sestra Tomášovy matky, paní Bartošové. Sestra rodiče je teta.",
  },
  {
    q: "Karolína je dcera paní Svobodové. Marek je bratr paní Svobodové. Kým je Marek Karolíně?",
    key: "strýc",
    d: ["teta", "bratranec", "synovec"],
    hints: [
      "Marek je bratr Karolíniny matky — do jaké generace patří vzhledem ke Karolíně?",
      "Sourozenec rodiče je stejně starý jako rodič, ne jako jeho dítě — a tady jde o muže.",
    ],
    explanation: "Marek je bratr Karolíniny matky, paní Svobodové. Bratr rodiče je strýc.",
  },
  {
    q: "David je syn pana Krále. Renata je sestra pana Krále. Kým je David Renatě?",
    key: "synovec",
    d: ["neteř", "bratranec", "strýc"],
    hints: [
      "David je syn Renatina bratra — do jaké generace patří David vzhledem k Renatě?",
      "Dítě sourozence je o generaci mladší než ten sourozenec — a tady jde o syna.",
    ],
    explanation: "David je syn bratra Renaty, tedy syn jejího sourozence. Syn sourozence je synovec.",
  },
  {
    q: "Barbora je dcera paní Procházkové. Jakub je bratr paní Procházkové. Kým je Barbora Jakubovi?",
    key: "neteř",
    d: ["synovec", "sestřenice", "teta"],
    hints: [
      "Barbora je dcera Jakubovy sestry — do jaké generace patří Barbora vzhledem k Jakubovi?",
      "Dítě sourozence je o generaci mladší než ten sourozenec — a tady jde o dceru.",
    ],
    explanation: "Barbora je dcera sestry Jakuba, tedy dcera jeho sourozence. Dcera sourozence je neteř.",
  },
  {
    q: "Vojtěch je syn pana Horáka. Klára je dcera pana Horáka. Kým je Vojtěch Kláře?",
    key: "sourozenec",
    d: ["bratranec", "strýc", "synovec"],
    hints: [
      "Kdo je otcem Vojtěcha i Kláry zároveň?",
      "Vojtěch a Klára mají společného otce — jsou tedy stejné generace, ne rodič a dítě.",
    ],
    explanation: "Vojtěch i Klára mají stejného otce, pana Horáka — jsou to sourozenci.",
  },
  {
    q: "Šimon je syn paní Veselé. Simona je sestra paní Veselé. Kým je Simona Šimonovi?",
    key: "teta",
    d: ["strýc", "sestřenice", "neteř"],
    hints: [
      "Simona je sestra Šimonovy matky — přemýšlej, do jaké generace patří.",
      "Sourozenec rodiče je stejně starý jako rodič sám, a tady jde o ženu, ne o muže.",
    ],
    explanation: "Simona je sestra matky Šimona, paní Veselé. Sestra rodiče je teta.",
  },
  {
    q: "Zuzana je dcera pana Beneše. Lukáš je bratr pana Beneše. Kým je Lukáš Zuzaně?",
    key: "strýc",
    d: ["teta", "bratranec", "synovec"],
    hints: [
      "Lukáš je bratr Zuzanina otce — přemýšlej, do jaké generace patří.",
      "Sourozenec rodiče je stejně starý jako rodič sám, a tady jde o muže, ne o ženu.",
    ],
    explanation: "Lukáš je bratr otce Zuzany, pana Beneše. Bratr rodiče je strýc.",
  },
  {
    q: "Ondřej je syn paní Kučerové. Kateřina je sestra paní Kučerové. Kým je Ondřej Kateřině?",
    key: "synovec",
    d: ["neteř", "bratranec", "strýc"],
    hints: [
      "Ondřej je syn Kateřininy sestry — do jaké generace patří Ondřej vzhledem ke Kateřině?",
      "Dítě sourozence je o generaci mladší než ten sourozenec, a tady jde o syna.",
    ],
    explanation: "Ondřej je syn sestry Kateřiny, tedy syn jejího sourozence. Syn sourozence je synovec.",
  },
  {
    q: "Eliška je dcera pana Doležala. Jan je bratr pana Doležala. Kým je Eliška Janovi?",
    key: "neteř",
    d: ["synovec", "sestřenice", "teta"],
    hints: [
      "Eliška je dcera Janova bratra — do jaké generace patří Eliška vzhledem k Janovi?",
      "Dítě sourozence je o generaci mladší než ten sourozenec, a tady jde o dceru.",
    ],
    explanation: "Eliška je dcera bratra Jana, tedy dcera jeho sourozence. Dcera sourozence je neteř.",
  },
  {
    q: "Matěj je syn paní Fialové. Nikola je dcera paní Fialové. Kým je Matěj Nikole?",
    key: "sourozenec",
    d: ["bratranec", "strýc", "synovec"],
    hints: [
      "Kdo je matkou Matěje i Nikoly zároveň?",
      "Matěj a Nikola mají společnou matku — jsou tedy stejné generace, ne rodič a dítě.",
    ],
    explanation: "Matěj i Nikola mají stejnou matku, paní Fialovou — jsou to sourozenci.",
  },
  {
    q: "Adéla je dcera pana Malého. Veronika je sestra pana Malého. Kým je Veronika Adéle?",
    key: "teta",
    d: ["strýc", "sestřenice", "neteř"],
    hints: [
      "Veronika je sestra Adélina otce — přemýšlej, do jaké generace patří.",
      "Sourozenec rodiče je stejně starý jako rodič sám — a tady jde o ženu.",
    ],
    explanation: "Veronika je sestra otce Adély, pana Malého. Sestra rodiče je teta.",
  },
  {
    q: "Tereza je dcera paní Pokorné. Filip je bratr paní Pokorné. Kým je Filip Tereze?",
    key: "strýc",
    d: ["teta", "bratranec", "synovec"],
    hints: [
      "Filip je bratr Terezčiny matky — přemýšlej, do jaké generace patří.",
      "Sourozenec rodiče je stejně starý jako rodič sám — a tady jde o muže.",
    ],
    explanation: "Filip je bratr matky Terezy, paní Pokorné. Bratr rodiče je strýc.",
  },
];

// ── L3 — 4+ jmenované osoby, vztah přes prostředníka ─────────────────────
const POOL_L3: Polozka[] = [
  {
    q: "Hana a Petr jsou sourozenci. Hana má syna Tomáše. Petr má dceru Karolínu. Kým je Karolína Tomášovi?",
    key: "sestřenice",
    d: ["bratranec", "strýc", "sourozenec"],
    hints: [
      "Hana a Petr mají společné rodiče, ale Tomáš a Karolína ne — čí děti to vlastně jsou?",
      "Tomáš je syn Hany a Karolína je dcera Petra — Hana a Petr jsou jen sourozenci, ne rodiče toho druhého dítěte. Tomáš a Karolína jsou tedy děti sourozenců, ne sourozenci samy.",
    ],
    explanation: "Hana a Petr jsou sourozenci. Tomáš je syn Hany, Karolína je dcera Petra — jsou to tedy děti sourozenců. Dítě strýce nebo tety (zde Petra, bratra Hany) je sestřenice nebo bratranec: Karolína je proto sestřenice Tomáše.",
  },
  {
    q: "Jakub a Nikola jsou sourozenci. Jakub má syna Vojtěcha. Nikola má dceru Kláru. Kým je Klára Vojtěchovi?",
    key: "sestřenice",
    d: ["bratranec", "teta", "sourozenec"],
    hints: [
      "Jakub a Nikola mají společné rodiče, ale Vojtěch a Klára ne — čí děti jsou Vojtěch a Klára?",
      "Vojtěch je syn Jakuba, Klára je dcera Nikoly — Jakub a Nikola jsou jen sourozenci navzájem, ne rodiče toho druhého dítěte.",
    ],
    explanation: "Jakub a Nikola jsou sourozenci. Vojtěch je syn Jakuba, Klára je dcera Nikoly — jsou to děti sourozenců. Klára je proto sestřenice Vojtěcha.",
  },
  {
    q: "Barbora a David jsou sourozenci. Barbora má syna Matěje. David má dceru Adélu. Kým je Adéla Matějovi?",
    key: "sestřenice",
    d: ["bratranec", "strýc", "sourozenec"],
    hints: [
      "Barbora a David mají společné rodiče, ale Matěj a Adéla ne — čí děti jsou Matěj a Adéla?",
      "Matěj je syn Barbory, Adéla je dcera Davida — Barbora a David jsou jen sourozenci navzájem, ne rodiče toho druhého dítěte.",
    ],
    explanation: "Barbora a David jsou sourozenci. Matěj je syn Barbory, Adéla je dcera Davida — jsou to děti sourozenců. Adéla je proto sestřenice Matěje.",
  },
  {
    q: "Ondřej a Eliška jsou sourozenci. Ondřej má dceru Simonu. Eliška má syna Šimona. Kým je Šimon Simoně?",
    key: "bratranec",
    d: ["sestřenice", "teta", "sourozenec"],
    hints: [
      "Ondřej a Eliška mají společné rodiče, ale Simona a Šimon ne — čí děti jsou Simona a Šimon?",
      "Simona je dcera Ondřeje, Šimon je syn Elišky — Ondřej a Eliška jsou jen sourozenci navzájem, ne rodiče toho druhého dítěte.",
    ],
    explanation: "Ondřej a Eliška jsou sourozenci. Simona je dcera Ondřeje, Šimon je syn Elišky — jsou to děti sourozenců. Šimon je proto bratranec Simony.",
  },
  {
    q: "Zuzana a Marek jsou sourozenci. Zuzana má syna Lukáše. Marek má dceru Terezu. Kým je Tereza Lukášovi?",
    key: "sestřenice",
    d: ["bratranec", "strýc", "sourozenec"],
    hints: [
      "Zuzana a Marek mají společné rodiče, ale Lukáš a Tereza ne — čí děti jsou Lukáš a Tereza?",
      "Lukáš je syn Zuzany, Tereza je dcera Marka — Zuzana a Marek jsou jen sourozenci navzájem, ne rodiče toho druhého dítěte.",
    ],
    explanation: "Zuzana a Marek jsou sourozenci. Lukáš je syn Zuzany, Tereza je dcera Marka — jsou to děti sourozenců. Tereza je proto sestřenice Lukáše.",
  },
  {
    q: "Filip a Veronika jsou sourozenci. Filip má dceru Kateřinu. Veronika má syna Jana. Kým je Jan Kateřině?",
    key: "bratranec",
    d: ["sestřenice", "teta", "sourozenec"],
    hints: [
      "Filip a Veronika mají společné rodiče, ale Kateřina a Jan ne — čí děti jsou Kateřina a Jan?",
      "Kateřina je dcera Filipa, Jan je syn Veroniky — Filip a Veronika jsou jen sourozenci navzájem, ne rodiče toho druhého dítěte.",
    ],
    explanation: "Filip a Veronika jsou sourozenci. Kateřina je dcera Filipa, Jan je syn Veroniky — jsou to děti sourozenců. Jan je proto bratranec Kateřiny.",
  },
  {
    q: "Tereza a Šimon jsou sourozenci. Tereza má syna Davida. Šimon má dceru Nikolu. Kým je Nikola Davidovi?",
    key: "sestřenice",
    d: ["bratranec", "strýc", "sourozenec"],
    hints: [
      "Tereza a Šimon mají společné rodiče, ale David a Nikola ne — čí děti jsou David a Nikola?",
      "David je syn Terezy, Nikola je dcera Šimona — Tereza a Šimon jsou jen sourozenci navzájem, ne rodiče toho druhého dítěte.",
    ],
    explanation: "Tereza a Šimon jsou sourozenci. David je syn Terezy, Nikola je dcera Šimona — jsou to děti sourozenců. Nikola je proto sestřenice Davida.",
  },
  {
    q: "Matěj a Barbora jsou sourozenci. Matěj má dceru Zuzanu. Barbora má syna Jakuba. Kým je Jakub Zuzaně?",
    key: "bratranec",
    d: ["sestřenice", "teta", "sourozenec"],
    hints: [
      "Matěj a Barbora mají společné rodiče, ale Zuzana a Jakub ne — čí děti jsou Zuzana a Jakub?",
      "Zuzana je dcera Matěje, Jakub je syn Barbory — Matěj a Barbora jsou jen sourozenci navzájem, ne rodiče toho druhého dítěte.",
    ],
    explanation: "Matěj a Barbora jsou sourozenci. Zuzana je dcera Matěje, Jakub je syn Barbory — jsou to děti sourozenců. Jakub je proto bratranec Zuzany.",
  },
  {
    q: "Paní Krátká má dvě děti, Tomáše a Ivetu. Tomáš má syna Ondřeje. Kým je Iveta Ondřejovi?",
    key: "teta",
    d: ["strýc", "prarodiče", "sestřenice"],
    hints: [
      "Paní Krátká je matka Tomáše i Ivety — ale otázka se neptá na paní Krátkou, ptá se na Ivetu.",
      "Tomáš a Iveta jsou sourozenci (děti paní Krátké). Iveta je tedy sourozenec Ondřejova otce — ve stejné generaci jako Tomáš, ne jako Ondřej.",
    ],
    explanation: "Paní Krátká má dvě děti, Tomáše a Ivetu — jsou to sourozenci. Ondřej je syn Tomáše. Iveta je tedy sestra Ondřejova otce, čili jeho teta.",
  },
  {
    q: "Pan Kovář má dvě děti, Simonu a Vojtěcha. Simona má dceru Kláru. Kým je Klára Vojtěchovi?",
    key: "neteř",
    d: ["synovec", "prarodiče", "sestřenice"],
    hints: [
      "Pan Kovář je otec Simony i Vojtěcha — ale otázka se neptá na pana Kováře, ptá se na Kláru.",
      "Simona a Vojtěch jsou sourozenci (děti pana Kováře). Klára je dcera Simony, tedy dcera Vojtěchova sourozence — o generaci mladší než Vojtěch, ne stejně stará.",
    ],
    explanation: "Pan Kovář má dvě děti, Simonu a Vojtěcha — jsou to sourozenci. Klára je dcera Simony. Klára je tedy dcera Vojtěchovy sestry, čili jeho neteř.",
  },
  {
    q: "Paní Marešová má dvě děti, Jana a Renatu. Jan má syna Lukáše. Kým je Renata Lukášovi?",
    key: "teta",
    d: ["strýc", "prarodiče", "sestřenice"],
    hints: [
      "Paní Marešová je matka Jana i Renaty — ale otázka se neptá na paní Marešovou, ptá se na Renatu.",
      "Jan a Renata jsou sourozenci (děti paní Marešové). Renata je tedy sourozenec Lukášova otce — ve stejné generaci jako Jan, ne jako Lukáš.",
    ],
    explanation: "Paní Marešová má dvě děti, Jana a Renatu — jsou to sourozenci. Lukáš je syn Jana. Renata je tedy sestra Lukášova otce, čili jeho teta.",
  },
  {
    q: "Pan Beránek má dvě děti, Kláru a Matěje. Klára má dceru Barboru. Kým je Matěj Barboře?",
    key: "strýc",
    d: ["teta", "prarodiče", "bratranec"],
    hints: [
      "Pan Beránek je otec Kláry i Matěje — ale otázka se neptá na pana Beránka, ptá se na Matěje.",
      "Klára a Matěj jsou sourozenci (děti pana Beránka). Matěj je tedy sourozenec Barbořiny matky — ve stejné generaci jako Klára, ne jako Barbora.",
    ],
    explanation: "Pan Beránek má dvě děti, Kláru a Matěje — jsou to sourozenci. Barbora je dcera Kláry. Matěj je tedy bratr Barbořiny matky, čili její strýc.",
  },
  {
    q: "Paní Holá má dvě děti, Adélu a Davida. Adéla má syna Vojtěcha. Kým je Vojtěch Davidovi?",
    key: "synovec",
    d: ["neteř", "prarodiče", "bratranec"],
    hints: [
      "Paní Holá je matka Adély i Davida — ale otázka se neptá na paní Holou, ptá se na Vojtěcha.",
      "Adéla a David jsou sourozenci (děti paní Holé). Vojtěch je syn Adély, tedy syn Davidova sourozence — o generaci mladší než David, ne stejně starý.",
    ],
    explanation: "Paní Holá má dvě děti, Adélu a Davida — jsou to sourozenci. Vojtěch je syn Adély. Vojtěch je tedy syn Davidovy sestry, čili jeho synovec.",
  },
  {
    q: "Pan Sedláček má dvě děti, Nikolu a Tomáše. Nikola má dceru Elišku. Kým je Eliška Tomášovi?",
    key: "neteř",
    d: ["synovec", "prarodiče", "sestřenice"],
    hints: [
      "Pan Sedláček je otec Nikoly i Tomáše — ale otázka se neptá na pana Sedláčka, ptá se na Elišku.",
      "Nikola a Tomáš jsou sourozenci (děti pana Sedláčka). Eliška je dcera Nikoly, tedy dcera Tomášova sourozence — o generaci mladší než Tomáš, ne stejně stará.",
    ],
    explanation: "Pan Sedláček má dvě děti, Nikolu a Tomáše — jsou to sourozenci. Eliška je dcera Nikoly. Eliška je tedy dcera Tomášovy sestry, čili jeho neteř.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  // Rotace bankou se nastaví tady, ne na úrovni modulu: dvě volání gen()
  // se stejným seedem tak dají stejné úlohy.
  let i = 0;
  return ruzneUlohy(() => losUlohy(() => uloha(pool[i++ % pool.length], level)));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const PRIBUZENSKE_VZTAHY_V_RODINE: TopicMetadata[] = [
  {
    id: "g6-vko-pribuzenske-vztahy-v-rodine-6",
    rvpNodeId:
      "g6-vko-clovek-ve-spolecnosti-nase-obec-region-vlast-rodina-pribuzenstvi-mezigeneracni-vztahy",
    displayName: "Příbuzenské vztahy v rodině",
    title: "Rodina, příbuzenství a mezigenerační vztahy — příbuzenské vztahy",
    studentTitle: "Kdo je kdo v rodině?",
    subject: "vko",
    category: "Člověk ve společnosti",
    topic: "Naše obec, region, vlast",
    briefDescription: "Odvodíš, jak jsou si lidé v rodině příbuzní, i přes prostředníka.",
    keywords: [
      "rodiče", "prarodiče", "sourozenec", "teta", "strýc",
      "bratranec", "sestřenice", "synovec", "neteř", "příbuzenství", "rodina",
    ],
    goals: [
      "Přiřadit správný pojem příbuznosti k definici (teta, strýc, bratranec, sestřenice, synovec, neteř).",
      "Odvodit přímý příbuzenský vztah mezi dvěma jmenovanými osobami z krátkého popisu rodiny.",
      "Odvodit vztah přes prostředníka (dvě generace najednou) a nezastavit se u prvního mezičlánku.",
    ],
    boundaries: [
      "Jen 9 pojmů: rodiče, prarodiče, sourozenec, teta, strýc, bratranec, sestřenice, synovec, neteř.",
      "Žádné hodnocení „správného“ složení rodiny — rozvod ani netradiční rodina se nehodnotí.",
      "Bez vzdálenějších pojmů (švagr, prastrýc) a bez počítání generací číslem.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Nejdřív zjisti generaci (stejná jako ty, o jednu výš, o jednu níž) a větev (přímý rodič/dítě, nebo přes sourozence rodiče). Pak podle pohlaví vyber správné slovo: teta/strýc, bratranec/sestřenice, synovec/neteř.",
      steps: [
        "Najdi, kdo je čí rodič, dítě nebo sourozenec — postav si v hlavě malý rodokmen.",
        "Urči generaci hledané osoby vzhledem k té, na kterou se otázka ptá.",
        "U vztahu přes prostředníka nezastavuj u první osoby — dojdi až k té, na kterou se otázka opravdu ptá.",
        "Nakonec podle pohlaví vyber správný pojem z dvojice (teta/strýc, bratranec/sestřenice, synovec/neteř).",
      ],
      commonMistake: "Zastavit se u prvního mezičlánku (odpovědět vztah k prostředníkovi, ne k osobě z otázky), nebo splést pohlaví (teta místo strýc) či generaci (strýc místo bratranec).",
      example: "Anna a Petr jsou sourozenci. Petr má syna Jirku. Anna je tedy Jirkova teta — je to sestra jeho otce, ne jeho babička ani sestřenice.",
    },
  },
];
