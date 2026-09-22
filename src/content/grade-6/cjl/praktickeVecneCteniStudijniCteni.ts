/**
 * Čeština 6. ročník — Praktické a věcné čtení, studijní čtení (select_one).
 *
 * Dovednost: vyčíst z krátkého věcného nebo naučného textu správný údaj,
 * hlavní myšlenku a to, co z textu opravdu plyne — bez záměny detailu za
 * hlavní myšlenku, domněnky za fakt nebo přehlédnuté podmínky.
 *
 *  • L1 — ROZPOZNÁNÍ. Věcný text (otevírací doba, ceník) a přímý dotaz
 *    kdy/kolik na jednu konkrétní položku. Distraktory jsou skutečné údaje
 *    ze stejného textu, jen z jiného řádku (jiný den, jiná skupina).
 *  • L2 — POUŽITÍ. Odstavec „z učebnice“ (přírodopis/zeměpis/dějepis/
 *    technika) a tři rotující šablony: hlavní myšlenka, trojice klíčových
 *    slov pro výpisky, nejlepší nadpis. Distraktory: vybraný detail,
 *    příliš obecné tvrzení, tvrzení mimo text.
 *  • L3 — ANALÝZA. Šest typů přenosu: (a) jízdní řád převyprávěný slovy
 *    s víkendovou výjimkou — žák počítá, jestli spoj stihne; (b) pravidlo
 *    s podmínkou/výjimkou — žák posuzuje konkrétní osobu; (c) fakt × názor
 *    v krátkém textu; (d) co z textu NELZE vyvodit; (e) návod — který krok
 *    přijde teď; (f) porovnání dvou cen po přepočtu na stejný počet.
 *
 * Ukázky jsou vlastní, smyšlené — žádné reálné adresy, telefony ani citace.
 * Čísla a časy v ukázkách jsou vnitřně konzistentní (ověřeno nezávislým
 * solverem v testu). Otázky L1 a L3 jsou zněním disjunktní (L1 = „Kdy má…
 * otevřeno/Kolik zaplatí…“, L3 = „Jak to dopadne?/Smí…?/Co má udělat jako
 * další krok?/Co je výhodnější?/Co NELZE vyvodit?“).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

/**
 * buildChoiceTask, ale nápovědy přesně tak, jak je napíšeme. Sdílený dovětek
 * „Dosaď každou možnost zpátky do věty…“ tu nedává smysl — možnosti jsou
 * údaje nebo celé věty k textu, nic se nikam nedosazuje.
 */
function choice(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: string[]; explanation: string; solutionSteps?: string[] },
): PracticeTask | null {
  const t = buildChoiceTask(question, correct, distractors, parts);
  if (t) t.hints = [...parts.hints];
  return t;
}

// ─────────────────────────────────────────────────────────────────────────
// L1 — věcný text: otevírací doba (cas) nebo ceník (cena)
// ─────────────────────────────────────────────────────────────────────────

interface RadekCas {
  den: string; // "v sobotu", "o víkendu", "v pondělí a ve středu"… (v otázce)
  label: string; // "Sobota", "Sobota a neděle"… (řádek rozpisu v textu)
  h1: number;
  h2: number;
}
interface UkazkaCas {
  nazevVeta: string; // s velkým počátečním písmenem, pro začátek textu
  nazev: string; // pro použití uprostřed věty (malé písmeno, nebo vlastní jméno)
  radky: RadekCas[]; // přesně 4, všechny hodnoty uvnitř textu vzájemně různé
}

const CAS_BANKA: UkazkaCas[] = [
  {
    nazevVeta: "Bazén", nazev: "bazén",
    radky: [
      { den: "v pondělí a ve středu", label: "Pondělí a středa", h1: 14, h2: 20 },
      { den: "v úterý a ve čtvrtek", label: "Úterý a čtvrtek", h1: 6, h2: 9 },
      { den: "v pátek", label: "Pátek", h1: 14, h2: 21 },
      { den: "o víkendu", label: "Sobota a neděle", h1: 9, h2: 18 },
    ],
  },
  {
    nazevVeta: "Knihovna", nazev: "knihovna",
    radky: [
      { den: "v pondělí", label: "Pondělí", h1: 9, h2: 12 },
      { den: "v úterý a ve čtvrtek", label: "Úterý a čtvrtek", h1: 13, h2: 18 },
      { den: "ve středu", label: "Středa", h1: 9, h2: 17 },
      { den: "v pátek", label: "Pátek", h1: 9, h2: 14 },
    ],
  },
  {
    nazevVeta: "Muzeum hraček", nazev: "muzeum hraček",
    radky: [
      { den: "v úterý a ve středu", label: "Úterý a středa", h1: 9, h2: 16 },
      { den: "ve čtvrtek", label: "Čtvrtek", h1: 9, h2: 20 },
      { den: "v pátek", label: "Pátek", h1: 9, h2: 15 },
      { den: "o víkendu", label: "Sobota a neděle", h1: 10, h2: 17 },
    ],
  },
  {
    nazevVeta: "Kino Sluníčko", nazev: "Kino Sluníčko",
    radky: [
      { den: "v pondělí", label: "Pondělí", h1: 16, h2: 22 },
      { den: "v úterý a ve středu", label: "Úterý a středa", h1: 17, h2: 22 },
      { den: "ve čtvrtek", label: "Čtvrtek", h1: 16, h2: 23 },
      { den: "o víkendu", label: "Sobota a neděle", h1: 14, h2: 23 },
    ],
  },
  {
    nazevVeta: "Půjčovna kol", nazev: "půjčovna kol",
    radky: [
      { den: "v pondělí a v úterý", label: "Pondělí a úterý", h1: 8, h2: 16 },
      { den: "ve středu", label: "Středa", h1: 8, h2: 12 },
      { den: "ve čtvrtek a v pátek", label: "Čtvrtek a pátek", h1: 8, h2: 18 },
      { den: "o víkendu", label: "Sobota a neděle", h1: 9, h2: 19 },
    ],
  },
  {
    nazevVeta: "Kluziště", nazev: "kluziště",
    radky: [
      { den: "v pondělí", label: "Pondělí", h1: 15, h2: 19 },
      { den: "v úterý a ve čtvrtek", label: "Úterý a čtvrtek", h1: 15, h2: 21 },
      { den: "v pátek", label: "Pátek", h1: 15, h2: 22 },
      { den: "o víkendu", label: "Sobota a neděle", h1: 10, h2: 22 },
    ],
  },
  {
    nazevVeta: "Čítárna", nazev: "čítárna",
    radky: [
      { den: "v pondělí a ve středu", label: "Pondělí a středa", h1: 8, h2: 15 },
      { den: "v úterý", label: "Úterý", h1: 8, h2: 18 },
      { den: "ve čtvrtek a v pátek", label: "Čtvrtek a pátek", h1: 8, h2: 13 },
      { den: "v sobotu", label: "Sobota", h1: 9, h2: 12 },
    ],
  },
  {
    nazevVeta: "Sportovní hala", nazev: "sportovní hala",
    radky: [
      { den: "v pondělí a v pátek", label: "Pondělí a pátek", h1: 7, h2: 21 },
      { den: "v úterý a ve čtvrtek", label: "Úterý a čtvrtek", h1: 7, h2: 22 },
      { den: "ve středu", label: "Středa", h1: 7, h2: 20 },
      { den: "o víkendu", label: "Sobota a neděle", h1: 8, h2: 20 },
    ],
  },
];

/**
 * Otevírací doba jako rozpis po řádcích (krátké úseky „Den: od – do“), ne
 * jedno dlouhé souvětí — tak vypadá cedule na dveřích a dá se v ní hledat očima.
 */
function textCas(u: UkazkaCas): string {
  return `${u.nazevVeta} – otevírací doba. ` + u.radky.map((r) => `${r.label}: od ${r.h1} do ${r.h2} hodin.`).join(" ");
}

function genL1Cas(): PracticeTask | null {
  const u = pick(CAS_BANKA);
  const cil = pick(u.radky);
  const ostatni = u.radky.filter((r) => r !== cil);
  const text = textCas(u);
  const distraktory: Distractor[] = ostatni.map((r) => ({
    value: `od ${r.h1} do ${r.h2} hodin`,
    why: `Tenhle čas v textu je, ale platí ${r.den}. Otázka se ptá na čas ${cil.den}.`,
  }));
  return choice(
    `Text: „${text}“ Kdy má ${u.nazev} otevřeno ${cil.den}?`,
    `od ${cil.h1} do ${cil.h2} hodin`,
    distraktory,
    {
      hints: [
        `Otázka se ptá na den: ${cil.den}. Najdi v rozpisu řádek s tímhle dnem.`,
        "Rozpis uvádí čas zvlášť pro každou skupinu dnů. Najdi řádek, ve kterém je den z otázky, a přečti dvě čísla za slovy „od“ a „do“.",
      ],
      explanation: `V rozpisu stojí u řádku „${cil.label}“ čas od ${cil.h1} do ${cil.h2} hodin. Proto má ${u.nazev} ${cil.den} otevřeno od ${cil.h1} do ${cil.h2} hodin.`,
    },
  );
}

interface SkupinaCena {
  acc: string; // tvar po "pro" (v textu)
  nom: string; // tvar jako podmět (v otázce "Kolik zaplatí …?")
}
interface UkazkaCena {
  nazev: string;
  skupiny: (SkupinaCena & { cena: number })[]; // přesně 4, ceny vzájemně různé
}

const DETI: SkupinaCena = { acc: "děti do 6 let", nom: "děti do 6 let" };
const ZACI: SkupinaCena = { acc: "žáky", nom: "žáci" };
const DOSPELI: SkupinaCena = { acc: "dospělé", nom: "dospělí" };
const SENIORI: SkupinaCena = { acc: "seniory", nom: "senioři" };

const CENA_BANKA: UkazkaCena[] = [
  { nazev: "Zoo Lipová", skupiny: [{ ...DETI, cena: 40 }, { ...ZACI, cena: 70 }, { ...DOSPELI, cena: 150 }, { ...SENIORI, cena: 90 }] },
  { nazev: "Muzeum starých strojů", skupiny: [{ ...DETI, cena: 30 }, { ...ZACI, cena: 50 }, { ...DOSPELI, cena: 100 }, { ...SENIORI, cena: 70 }] },
  { nazev: "Aquapark Vlnka", skupiny: [{ ...DETI, cena: 60 }, { ...ZACI, cena: 90 }, { ...DOSPELI, cena: 180 }, { ...SENIORI, cena: 120 }] },
  { nazev: "Hrad Květov", skupiny: [{ ...DETI, cena: 20 }, { ...ZACI, cena: 60 }, { ...DOSPELI, cena: 120 }, { ...SENIORI, cena: 80 }] },
  { nazev: "Planetárium Hvězda", skupiny: [{ ...DETI, cena: 35 }, { ...ZACI, cena: 55 }, { ...DOSPELI, cena: 110 }, { ...SENIORI, cena: 75 }] },
  { nazev: "Lanové centrum Opička", skupiny: [{ ...DETI, cena: 50 }, { ...ZACI, cena: 80 }, { ...DOSPELI, cena: 160 }, { ...SENIORI, cena: 100 }] },
  { nazev: "Botanická zahrada Kvítek", skupiny: [{ ...DETI, cena: 25 }, { ...ZACI, cena: 45 }, { ...DOSPELI, cena: 90 }, { ...SENIORI, cena: 60 }] },
  { nazev: "Skanzen Dřevěnka", skupiny: [{ ...DETI, cena: 30 }, { ...ZACI, cena: 60 }, { ...DOSPELI, cena: 130 }, { ...SENIORI, cena: 85 }] },
];

function textCena(u: UkazkaCena): string {
  const [s0, s1, s2, s3] = u.skupiny;
  return `${u.nazev} má vstupné pro ${s0.acc} ${s0.cena} Kč, pro ${s1.acc} ${s1.cena} Kč, pro ${s2.acc} ${s2.cena} Kč a pro ${s3.acc} ${s3.cena} Kč.`;
}

function genL1Cena(): PracticeTask | null {
  const u = pick(CENA_BANKA);
  const cil = pick(u.skupiny);
  const ostatni = u.skupiny.filter((s) => s !== cil);
  const text = textCena(u);
  const distraktory: Distractor[] = ostatni.map((s) => ({
    value: `${s.cena} Kč`,
    why: `Tahle cena v textu je, ale platí pro ${s.acc}. Otázka se ptá na cenu pro ${cil.acc}.`,
  }));
  return choice(
    `Text: „${text}“ Kolik zaplatí ${cil.nom} za vstup?`,
    `${cil.cena} Kč`,
    distraktory,
    {
      hints: [
        `Najdi v textu, kolik stojí vstupné pro ${cil.acc}.`,
        "Text uvádí cenu zvlášť pro každou skupinu lidí. Najdi tu správnou skupinu a přečti číslo před slovem „Kč“.",
      ],
      explanation: `Text uvádí, že pro ${cil.acc} je vstupné ${cil.cena} Kč — to je hledaný údaj.`,
    },
  );
}

function genL1(): PracticeTask | null {
  return Math.random() < 0.5 ? genL1Cas() : genL1Cena();
}

// ─────────────────────────────────────────────────────────────────────────
// L2 — odstavec „z učebnice“ + tři rotující šablony
// ─────────────────────────────────────────────────────────────────────────

interface Odstavec {
  text: string;
  hlavniMyslenka: string;
  detail: string;
  obecne: string;
  mimoText: string;
  /** Vlastní feedback, když `mimoText` textu přímo odporuje (ne jen v něm chybí). */
  mimoTextWhy?: string;
  klicovaSlova: string; // "a, b, c" — slova se stem-oporou v textu
  /**
   * detail = tři podrobnosti; neuplne = dvě klíčová slova + jedna podrobnost
   * (blízká chyba: výpisky by vynechaly důležitou část); generic = příliš obecná.
   */
  klicovaSlovaSpatne: { detail: string; neuplne: string; generic: string };
  nadpis: string;
  nadpisySpatne: { detail: string; generic: string; mimoText: string };
}

const ODSTAVCE: Odstavec[] = [
  {
    text: "Ježek je noční živočich, který se přes den ukrývá v houštinách nebo pod listím. Na těle má tvrdé ostny, kterými se brání před predátory. Živí se hlavně hmyzem, žížalami a slimáky. Na zimu upadá do zimního spánku, kterému se říká hibernace. Během hibernace se jeho tělesná teplota výrazně sníží a srdce bije jen pomalu.",
    hlavniMyslenka: "Ježek je noční živočich, který se brání ostny a přes zimu upadá do hibernace.",
    detail: "Živí se hlavně hmyzem, žížalami a slimáky.",
    obecne: "Zvířata se na zimu musí připravit, aby přežila.",
    mimoText: "Ježci jsou v Česku chránění zákonem a je zakázáno je chovat doma.",
    klicovaSlova: "ježek, ostny, hibernace",
    klicovaSlovaSpatne: { detail: "listí, houštiny, den", neuplne: "ježek, ostny, slimáci", generic: "zvíře, příroda, zima" },
    nadpis: "Jak žije ježek",
    nadpisySpatne: { detail: "Proč ježek spí zimním spánkem", generic: "Zvířata v přírodě", mimoText: "Jak chránit lesní zvířata" },
  },
  {
    text: "Vltava pramení na Šumavě a je nejdelší českou řekou. Protéká mimo jiné Českým Krumlovem a hlavním městem Prahou. Do Labe se vlévá u Mělníka. Na jejím toku byla postavena soustava přehrad, které slouží k výrobě elektřiny a k ochraně před povodněmi.",
    hlavniMyslenka: "Vltava je nejdelší česká řeka, která protéká Prahou a vlévá se do Labe.",
    detail: "Na jejím toku byla postavena soustava přehrad, které slouží k výrobě elektřiny.",
    obecne: "Řeky jsou pro krajinu důležité.",
    mimoText: "Vltava je splavná pro velké nákladní lodě až k moři.",
    klicovaSlova: "Vltava, Praha, Labe",
    klicovaSlovaSpatne: { detail: "přehrady, elektřina, povodně", neuplne: "Vltava, Praha, Krumlov", generic: "řeka, voda, krajina" },
    nadpis: "Tok řeky Vltavy",
    nadpisySpatne: { detail: "Přehrady na Vltavě", generic: "České řeky", mimoText: "Doprava po řekách" },
  },
  {
    text: "Keltové žili na našem území v mladší době železné, tedy před více než dvěma tisíci lety. Byli zruční řemeslníci a uměli zpracovávat železo. Stavěli opevněná sídliště zvaná oppida, která sloužila jako centra řemesel a obchodu. Uctívali přírodu a měli vlastní kněze, kterým se říkalo druidové.",
    hlavniMyslenka: "Keltové byli zruční řemeslníci, kteří v době železné stavěli opevněná oppida.",
    detail: "Uctívali přírodu a měli vlastní kněze, kterým se říkalo druidové.",
    obecne: "Staré civilizace měly obvykle bohatý mytologický svět.",
    mimoText: "Keltové jako první na světě vynalezli kolo.",
    klicovaSlova: "Keltové, oppida, řemeslníci",
    klicovaSlovaSpatne: { detail: "druidové, kněží, příroda", neuplne: "Keltové, řemeslníci, obchod", generic: "národ, historie, doba" },
    nadpis: "Keltové na našem území",
    nadpisySpatne: { detail: "Druidové a jejich obřady", generic: "Staré národy", mimoText: "Keltské svátky" },
  },
  {
    text: "Elektrický obvod potřebuje ke svému fungování uzavřenou cestu, kterou může procházet proud. Pokud obvod přerušíme, třeba vypínačem, proud přestane téct a spotřebič se vypne. Vodiče, jako je měď, proud vedou snadno. Izolanty, jako je guma nebo plast, proud nevedou a chrání nás před úrazem.",
    hlavniMyslenka: "Elektrický obvod funguje, jen když je uzavřený; proud vedou vodiče, izolanty ho nevedou.",
    detail: "Vodiče, jako je měď, proud vedou snadno.",
    obecne: "Bezpečnost při práci s domácími přístroji je důležitá.",
    mimoText: "Elektrický proud v obvodu vždy teče rychlostí světla.",
    klicovaSlova: "obvod, vodiče, izolanty",
    klicovaSlovaSpatne: { detail: "vypínač, spotřebič, přerušení", neuplne: "obvod, vodiče, měď", generic: "technika, přístroj, zařízení" },
    nadpis: "Jak funguje elektrický obvod",
    nadpisySpatne: { detail: "Vypínač a spotřebič", generic: "Elektřina kolem nás", mimoText: "Jak vzniká blesk" },
  },
  {
    text: "Houby nejsou rostliny ani živočichové, tvoří samostatnou skupinu organismů. Nemají v těle chlorofyl, a proto si samy nevyrábějí živiny jako rostliny. Živiny získávají z okolí, často z odumřelého dřeva nebo z listí. To, co v lese sbíráme, je jen plodnice, zatímco hlavní tělo houby tvoří podhoubí ukryté v zemi.",
    hlavniMyslenka: "Houby nejsou rostliny, nemají chlorofyl, a proto živiny získávají z okolí.",
    detail: "To, co v lese sbíráme, je jen plodnice, zatímco hlavní tělo houby tvoří podhoubí ukryté v zemi.",
    obecne: "Příroda kolem nás skrývá spoustu zajímavostí.",
    mimoText: "Houby si podobně jako rostliny vyrábějí živiny fotosyntézou.",
    mimoTextWhy: "Text říká pravý opak — přečti si znovu větu o chlorofylu a o tom, jak houby získávají živiny.",
    klicovaSlova: "houby, chlorofyl, podhoubí",
    klicovaSlovaSpatne: { detail: "plodnice, dřevo, listí", neuplne: "houby, chlorofyl, plodnice", generic: "organismus, příroda, les" },
    nadpis: "Houby a jejich výživa",
    nadpisySpatne: { detail: "Sbírání hub v lese", generic: "Organismy v přírodě", mimoText: "Jedovaté houby" },
  },
  {
    text: "Sahara je největší horká poušť na světě a leží v severní Africe. Přes den tam bývá extrémní horko, ale v noci teplota prudce klesá. Na první pohled se zdá, že je celá pokrytá pískem, ve skutečnosti ale velkou část tvoří kamenitá a hornatá krajina. Přesto v poušti žijí rostliny i živočichové, kteří jsou na sucho a horko přizpůsobení.",
    hlavniMyslenka: "Sahara je největší horká poušť s drsnými podmínkami, přesto v ní žijí přizpůsobené rostliny i živočichové.",
    detail: "Přes den tam bývá extrémní horko, ale v noci teplota prudce klesá.",
    obecne: "Vzdálené oblasti planety zkoumají vědci už dlouho.",
    mimoText: "Sahara je celá pokrytá jen pískem, žádná jiná krajina se tam nevyskytuje.",
    mimoTextWhy: "Text říká pravý opak — přečti si znovu větu o tom, co tvoří velkou část Sahary.",
    klicovaSlova: "Sahara, poušť, přizpůsobení",
    klicovaSlovaSpatne: { detail: "horko, noc, teplota", neuplne: "Sahara, poušť, noc", generic: "krajina, svět, příroda" },
    nadpis: "Poušť Sahara",
    nadpisySpatne: { detail: "Horko a chlad v poušti", generic: "Přírodní oblasti světa", mimoText: "Karavany na poušti" },
  },
];

function genL2(): PracticeTask | null {
  const o = pick(ODSTAVCE);
  const sablona = pick(["hlavniMyslenka", "klicovaSlova", "nadpis"] as const);
  const text = o.text;

  if (sablona === "hlavniMyslenka") {
    return choice(
      `Text: „${text}“ Která věta nejlépe vystihuje hlavní myšlenku odstavce?`,
      o.hlavniMyslenka,
      [
        { value: o.detail, why: "Tohle v textu stojí, ale je to jen jedna podrobnost. Hlavní myšlenka musí platit pro celý odstavec." },
        { value: o.obecne, why: "To je pravda obecně, ale odstavec říká víc — hlavní myšlenka musí sedět přímo na tenhle text." },
        { value: o.mimoText, why: o.mimoTextWhy ?? "Tohle v textu není napsané. Při studijním čtení vycházej jen z toho, co v textu opravdu je." },
      ],
      {
        hints: [
          "Zkus u každé možnosti: platí pro celý odstavec, nebo jen pro jednu jeho část?",
          "Hlavní myšlenka shrnuje všechny věty dohromady, ne jen jednu zajímavou podrobnost nebo obecnou pravdu, která v textu vůbec není.",
        ],
        explanation: `Hlavní myšlenka musí platit pro celý odstavec: ${o.hlavniMyslenka}`,
      },
    );
  }

  if (sablona === "klicovaSlova") {
    return choice(
      `Text: „${text}“ Která trojice klíčových slov se nejlépe hodí do výpisků?`,
      o.klicovaSlova,
      [
        { value: o.klicovaSlovaSpatne.detail, why: "Tahle slova jsou v textu, ale jsou to jen podrobnosti, ne jádro celého odstavce." },
        { value: o.klicovaSlovaSpatne.neuplne, why: "Dvě slova sedí, ale třetí je jen podrobnost z jedné věty. Jedna důležitá část odstavce by ti ve výpiscích chyběla." },
        { value: o.klicovaSlovaSpatne.generic, why: "Tahle slova jsou příliš obecná — nesedí jen na tenhle odstavec, ale na spoustu jiných textů." },
      ],
      {
        hints: [
          "Klíčová slova musí pokrýt to nejdůležitější z celého odstavce, ne jen jednu větu.",
          "Vyber trojici, která by ti sama o sobě připomněla, o čem odstavec je — bez detailů a bez slov, která s textem nesouvisí.",
        ],
        explanation: `Do výpisků patří slova, která shrnují jádro odstavce: ${o.klicovaSlova}.`,
      },
    );
  }

  return choice(
    `Text: „${text}“ Který nadpis se k odstavci nejlépe hodí?`,
    o.nadpis,
    [
      { value: o.nadpisySpatne.detail, why: "Tenhle nadpis sedí jen na část odstavce, ne na celý text." },
      { value: o.nadpisySpatne.generic, why: "Tenhle nadpis je příliš obecný — hodil by se na spoustu jiných textů." },
      { value: o.nadpisySpatne.mimoText, why: "Tohle odstavec vůbec neřeší." },
    ],
    {
      hints: [
        "Nadpis musí sedět na celý odstavec, ne jen na jeho část.",
        "Zkus si nadpis dosadit před text a zeptej se, jestli by čtenáře správně navedl na to, o čem odstavec je.",
      ],
      explanation: `Nejlépe sedí nadpis: ${o.nadpis}.`,
    },
  );
}

// ─────────────────────────────────────────────────────────────────────────
// L3 — šest typů přenosu: jízdní řád, návod, porovnání cen, pravidlo
// s podmínkou, fakt × názor, co z textu NELZE vyvodit. Obsah je hotový (bez losování parametrů),
// generátor jen vybírá položku z banky.
// ─────────────────────────────────────────────────────────────────────────

interface TaskSpec {
  question: string;
  correct: string;
  distractors: Distractor[];
  hints: string[];
  explanation: string;
  solutionSteps?: string[];
}

const JIZDNI_BANKA: TaskSpec[] = [
  {
    question: "Text: „Autobus odjíždí z Lipové v 7:10, 7:40 a 8:25, cesta do Horní Vsi trvá 25 minut; o víkendu jede jen spoj v 8:25.“ Tomáš musí být v Horní Vsi v sobotu v 8:30. Jak to dopadne?",
    correct: "Nestihne to, přijede až v 8:50.",
    distractors: [
      { value: "Stihne to spojem v 7:40.", why: "V sobotu jede jen spoj v 8:25, spoj v 7:40 jezdí jen ve všední dny." },
      { value: "Stihne to, protože 8:25 je dřív než 8:30.", why: "8:25 je čas odjezdu, ne příjezdu. Musíš přičíst dobu jízdy: 8:25 + 25 minut." },
      { value: "Nestihne to, protože o víkendu autobus vůbec nejede.", why: "O víkendu jede jeden spoj, v 8:25 — doprava je jen řidší, ne žádná." },
    ],
    hints: [
      "Sečti čas odjezdu víkendového spoje a dobu jízdy — to je čas příjezdu.",
      "Pozor na výjimku: o víkendu jezdí jen jeden z uvedených spojů, ne všechny. Najdi ho, přičti k němu dobu jízdy a teprve výsledný čas příjezdu porovnej s limitem.",
    ],
    explanation: "V sobotu jede jen spoj v 8:25. K němu se přičte doba jízdy 25 minut: 8:25 + 25 minut = 8:50. To je později než 8:30, proto to Tomáš nestihne.",
    solutionSteps: ["Víkendový spoj jede v 8:25.", "8:25 + 25 minut = 8:50.", "8:50 je později než limit 8:30 → nestihne."],
  },
  {
    question: "Text: „Vlak odjíždí z Javorníku v 6:50, 7:20 a 7:55, cesta na Sídliště trvá 20 minut; o víkendu jede jen spoj v 6:50.“ Petra musí být na Sídlišti v neděli v 7:30. Jak to dopadne?",
    correct: "Stihne to, přijede v 7:10.",
    distractors: [
      { value: "Nestihne to, přijede až v 7:40.", why: "To je příjezd spoje v 7:20, který jezdí jen ve všední dny. V neděli jede jen spoj v 6:50." },
      { value: "Stihne to, přijede v 7:20.", why: "7:20 je v textu čas odjezdu jiného spoje, ne příjezd. Spočítej příjezd: 6:50 + 20 minut." },
      { value: "Nestihne to, protože v neděli vlak nejezdí.", why: "V neděli jede jeden spoj, v 6:50 — doprava je jen řidší, ne žádná." },
    ],
    hints: [
      "Sečti čas odjezdu víkendového spoje a dobu jízdy — to je čas příjezdu.",
      "Pozor na výjimku: v neděli jezdí jen jeden z uvedených spojů. Při sčítání minut dej pozor na přechod přes celou hodinu. Teprve výsledný čas příjezdu porovnej s limitem.",
    ],
    explanation: "V neděli jede jen spoj v 6:50. K němu se přičte doba jízdy 20 minut: 6:50 + 20 minut = 7:10. To je dřív než limit 7:30, proto to Petra stihne.",
    solutionSteps: ["Víkendový spoj jede v 6:50.", "6:50 + 10 minut = 7:00, + dalších 10 minut = 7:10.", "7:10 je dřív než limit 7:30 → stihne."],
  },
  {
    question: "Text: „Vlak odjíždí z Lesné v 12:15, 12:45 a 13:20, cesta na Zámecké nádraží trvá 30 minut; o víkendu jede jen spoj v 12:45.“ Eliška musí být na Zámeckém nádraží v sobotu v 13:40. Jak to dopadne?",
    correct: "Stihne to, přijede v 13:15.",
    distractors: [
      { value: "Nestihne to, přijede až v 13:50.", why: "To je příjezd spoje v 13:20, který jezdí jen ve všední dny. O víkendu jede jen spoj v 12:45." },
      { value: "Nestihne to, přijede až v 13:45.", why: "Dobu jízdy jsi přičetl dvakrát. Stačí jednou: 12:45 + 30 minut = 13:15." },
      { value: "Stihne to spojem v 12:15.", why: "Spoj v 12:15 jezdí jen ve všední dny. O víkendu jede jen spoj v 12:45." },
    ],
    hints: [
      "Sečti čas odjezdu víkendového spoje a dobu jízdy — to je čas příjezdu.",
      "Pozor na výjimku: o víkendu jezdí jen jeden z uvedených spojů. Dobu jízdy k němu přičti jen jednou a teprve výsledný čas příjezdu porovnej s limitem, kdy tam Eliška musí být.",
    ],
    explanation: "O víkendu jede jen spoj v 12:45. K němu se přičte doba jízdy 30 minut: 12:45 + 30 minut = 13:15. To je dřív než limit 13:40, proto to Eliška stihne.",
    solutionSteps: ["Víkendový spoj jede v 12:45.", "12:45 + 30 minut = 13:15.", "13:15 je dřív než limit 13:40 → stihne."],
  },
  {
    question: "Text: „Přívoz odjíždí z Rybníčku v 9:05, 9:35 a 10:10, cesta na Ostrov trvá 15 minut; o víkendu jede jen spoj v 9:35.“ Honza musí být na Ostrově v neděli v 9:45. Jak to dopadne?",
    correct: "Nestihne to, přijede až v 9:50.",
    distractors: [
      { value: "Stihne to, přijede v 9:45.", why: "Přesně 9:45 nevyjde — spočítej znovu: 9:35 + 15 minut = 9:50, to je později než 9:45." },
      { value: "Stihne to spojem v 9:05.", why: "Spoj v 9:05 jezdí jen ve všední dny. V neděli jede jen spoj v 9:35." },
      { value: "Nestihne to, protože přívoz o víkendu nejezdí.", why: "V neděli jede jeden spoj, v 9:35 — doprava je jen řidší, ne žádná." },
    ],
    hints: [
      "Sečti čas odjezdu víkendového spoje a dobu jízdy — to je čas příjezdu.",
      "Pozor na výjimku: v neděli jezdí jen jeden spoj. Teprve výsledný čas příjezdu pečlivě porovnej s limitem, kdy tam Honza musí být.",
    ],
    explanation: "V neděli jede jen spoj v 9:35. K němu se přičte doba jízdy 15 minut: 9:35 + 15 minut = 9:50. To je později než 9:45, proto to Honza nestihne.",
    solutionSteps: ["Víkendový spoj jede v 9:35.", "9:35 + 15 minut = 9:50.", "9:50 je později než limit 9:45 → nestihne."],
  },
];

/** (e) Návod — kde v pořadí kroků člověk je a co má udělat hned teď. */
const NAVOD_BANKA: TaskSpec[] = [
  {
    question: "Text: „Namoč vatu do vody a polož ji na misku. Pak na ni rovnoměrně nasyp semínka řeřichy. Misku postav na světlé místo, ale ne na přímé slunce. Potom vatu každý den zalévej, aby nevyschla.“ Klára už nasypala semínka na mokrou vatu. Co má udělat jako další krok?",
    correct: "Postavit misku na světlé místo mimo přímé slunce.",
    distractors: [
      { value: "Namočit vatu do vody.", why: "Tenhle krok už Klára udělala — semínka sypala na mokrou vatu." },
      { value: "Postavit misku na přímé slunce, aby řeřicha rychleji rostla.", why: "Návod výslovně říká, že ne na přímé slunce. Přehlédl jsi tu podmínku." },
      { value: "Zalít vatu.", why: "Zalévání přijde až potom, co misku postaví na místo. Návod ho řadí na konec." },
    ],
    hints: [
      "Najdi v návodu krok, který Klára udělala naposledy.",
      "Návod popisuje kroky v pořadí. Zjisti, kde v tom pořadí Klára teď je, a vyber krok, který stojí hned za ním. Pozor i na podmínku, kterou návod ke kroku přidává.",
    ],
    explanation: "Klára má za sebou namočení vaty a nasypání semínek. V návodu následuje: postavit misku na světlé místo, ale ne na přímé slunce.",
    solutionSteps: ["Hotovo: vata namočená, semínka nasypaná.", "Další krok v návodu: miska na světlé místo.", "Podmínka: ne na přímé slunce."],
  },
  {
    question: "Text: „Obsah sáčku vysyp do hrnku. Zalij ho 250 mililitry vroucí vody. Nech polévku 3 minuty odstát a pak ji zamíchej.“ Ema vysypala sáček do hrnku a zalila ho vroucí vodou. Co má udělat jako další krok?",
    correct: "Nechat polévku 3 minuty odstát.",
    distractors: [
      { value: "Hned polévku zamíchat a jíst.", why: "Návod říká, že se míchá až po třech minutách odstátí. Tenhle krok bys přeskočil." },
      { value: "Zamíchat a pak nechat 3 minuty odstát.", why: "Pořadí je obráceně: nejdřív odstát, potom zamíchat." },
      { value: "Zalít polévku 250 mililitry vroucí vody.", why: "Tenhle krok už Ema udělala — zalila sáček vroucí vodou." },
    ],
    hints: [
      "Najdi v návodu krok, který Ema udělala naposledy.",
      "Návod popisuje kroky v pořadí. Zjisti, kde v tom pořadí Ema teď je, a vyber krok, který stojí hned za ním — nepřeskakuj ho a neprohazuj pořadí.",
    ],
    explanation: "Ema má za sebou vysypání sáčku a zalití vodou. V návodu následuje nechat polévku 3 minuty odstát, teprve pak se míchá.",
    solutionSteps: ["Hotovo: vysypat, zalít.", "Další krok: nechat 3 minuty odstát.", "Až potom: zamíchat."],
  },
  {
    question: "Text: „Otevři kryt na zadní straně budíku. Vlož dvě baterie tak, aby znaménka + a − odpovídala obrázku uvnitř. Zavři kryt. Nakonec nastav čas dlouhým stiskem tlačítka SET.“ Adam otevřel kryt a vložil baterie podle obrázku. Co má udělat jako další krok?",
    correct: "Zavřít kryt.",
    distractors: [
      { value: "Nastavit čas tlačítkem SET.", why: "Nastavení času je v návodu až poslední krok. Předtím musí Adam zavřít kryt." },
      { value: "Otevřít kryt na zadní straně.", why: "Tenhle krok už Adam udělal — kryt je otevřený." },
      { value: "Otočit baterie obráceně.", why: "Adam vložil baterie podle obrázku, tedy správně. Návod nic takového neříká." },
    ],
    hints: [
      "Najdi v návodu krok, který Adam udělal naposledy.",
      "Návod popisuje kroky v pořadí. Zjisti, kde v tom pořadí Adam teď je, a vyber krok, který stojí hned za ním — ne ten, který už udělal, ani ten, který patří až na konec.",
    ],
    explanation: "Adam má za sebou otevření krytu a vložení baterií. V návodu následuje zavřít kryt, teprve potom se nastavuje čas.",
    solutionSteps: ["Hotovo: otevřít kryt, vložit baterie.", "Další krok: zavřít kryt.", "Poslední krok: nastavit čas."],
  },
  {
    question: "Text: „Před první jízdou nabíjej koloběžku celou noc. Zapneš ji dlouhým stiskem tlačítka na řídítkách. Nejdřív se rozjeď odrazem nohy, teprve potom přidej plyn. Po jízdě koloběžku vypni.“ Ondra koloběžku přes noc nabil, ráno ji zapnul a stojí na ní. Co má udělat jako další krok?",
    correct: "Odrazit se nohou a teprve potom přidat plyn.",
    distractors: [
      { value: "Hned přidat plyn.", why: "Návod říká, že se nejdřív rozjíždí odrazem nohy a plyn přijde až potom." },
      { value: "Nabíjet koloběžku celou noc.", why: "Tenhle krok už Ondra udělal — koloběžku nabil přes noc." },
      { value: "Koloběžku vypnout.", why: "Vypnutí patří až na konec, po jízdě. Ondra ještě ani nevyjel." },
    ],
    hints: [
      "Najdi v návodu krok, který Ondra udělal naposledy.",
      "Návod popisuje kroky v pořadí. Zjisti, kde v tom pořadí Ondra teď je, a vyber krok, který stojí hned za ním. Pozor na slova „nejdřív“ a „teprve potom“.",
    ],
    explanation: "Ondra má za sebou nabití a zapnutí. V návodu následuje rozjet se odrazem nohy, teprve potom přidat plyn.",
    solutionSteps: ["Hotovo: nabít, zapnout.", "Další krok: odrazit se nohou.", "Až potom: přidat plyn."],
  },
];

/** (f) Porovnání dvou cen — přepočítat na stejný počet a teprve pak srovnat. */
const CENY_BANKA: TaskSpec[] = [
  {
    question: "Text: „Permanentka do bazénu na 10 vstupů stojí 500 Kč. Jednotlivý vstup stojí 60 Kč.“ Lukáš chce jít do bazénu 10krát. Co je pro něj výhodnější?",
    correct: "Permanentka, ušetří 100 Kč.",
    distractors: [
      { value: "Jednotlivé vstupy, protože 60 Kč je méně než 500 Kč.", why: "Srovnáváš jeden vstup s deseti. Deset jednotlivých vstupů stojí 10 × 60 Kč = 600 Kč." },
      { value: "Permanentka, ušetří 440 Kč.", why: "Odečetl jsi cenu jednoho vstupu. Porovnej 500 Kč s cenou deseti vstupů: 10 × 60 Kč = 600 Kč." },
      { value: "Jednotlivé vstupy, ušetří 100 Kč.", why: "Rozdíl 100 Kč sedí, ale obráceně: dráž vyjdou jednotlivé vstupy (600 Kč), ne permanentka (500 Kč)." },
    ],
    hints: [
      "Spočítej, kolik by stálo 10 jednotlivých vstupů.",
      "Ceny se dají porovnat, až když platí pro stejný počet vstupů. Vynásob cenu jednoho vstupu deseti, porovnej výsledek s permanentkou a rozdíl odečti.",
    ],
    explanation: "Deset jednotlivých vstupů stojí 10 × 60 Kč = 600 Kč. Permanentka stojí 500 Kč, tedy o 100 Kč méně.",
    solutionSteps: ["10 × 60 Kč = 600 Kč.", "600 Kč − 500 Kč = 100 Kč.", "Levnější je permanentka, ušetří 100 Kč."],
  },
  {
    question: "Text: „Balení šesti jogurtů stojí 72 Kč. Jeden jogurt zvlášť stojí 14 Kč.“ Maminka potřebuje 6 jogurtů. Co je pro ni výhodnější?",
    correct: "Balení, ušetří 12 Kč.",
    distractors: [
      { value: "Jogurty zvlášť, protože 14 Kč je méně než 72 Kč.", why: "Srovnáváš jeden jogurt se šesti. Šest jogurtů zvlášť stojí 6 × 14 Kč = 84 Kč." },
      { value: "Balení, ušetří 58 Kč.", why: "Odečetl jsi cenu jednoho jogurtu. Porovnej 72 Kč s cenou šesti jogurtů: 6 × 14 Kč = 84 Kč." },
      { value: "Jogurty zvlášť, ušetří 12 Kč.", why: "Rozdíl 12 Kč sedí, ale obráceně: dráž vyjdou jogurty zvlášť (84 Kč), ne balení (72 Kč)." },
    ],
    hints: [
      "Spočítej, kolik by stálo 6 jogurtů kupovaných zvlášť.",
      "Ceny se dají porovnat, až když platí pro stejný počet kusů. Vynásob cenu jednoho jogurtu šesti, porovnej výsledek s balením a rozdíl odečti.",
    ],
    explanation: "Šest jogurtů zvlášť stojí 6 × 14 Kč = 84 Kč. Balení stojí 72 Kč, tedy o 12 Kč méně.",
    solutionSteps: ["6 × 14 Kč = 84 Kč.", "84 Kč − 72 Kč = 12 Kč.", "Levnější je balení, ušetří 12 Kč."],
  },
  {
    question: "Text: „Týdenní jízdenka na autobus stojí 150 Kč. Jedna jízdenka stojí 20 Kč.“ Sára pojede tento týden autobusem jen 6krát. Co je pro ni výhodnější?",
    correct: "Jednotlivé jízdenky, ušetří 30 Kč.",
    distractors: [
      { value: "Týdenní jízdenka, ušetří 30 Kč.", why: "Rozdíl 30 Kč sedí, ale obráceně: 6 jízdenek stojí 120 Kč, týdenní 150 Kč. Levnější jsou jednotlivé." },
      { value: "Jednotlivé jízdenky, ušetří 130 Kč.", why: "Odečetl jsi cenu jedné jízdenky. Porovnej 150 Kč s cenou šesti jízdenek: 6 × 20 Kč = 120 Kč." },
      { value: "Týdenní jízdenka, protože vždycky vyjde levněji.", why: "Výhodnost záleží na počtu jízd. Při 6 jízdách: 6 × 20 Kč = 120 Kč, to je méně než 150 Kč." },
    ],
    hints: [
      "Spočítej, kolik by stálo 6 jednotlivých jízdenek.",
      "Ceny se dají porovnat, až když platí pro stejný počet jízd. Vynásob cenu jedné jízdenky šesti, porovnej výsledek s týdenní jízdenkou a rozdíl odečti.",
    ],
    explanation: "Šest jednotlivých jízdenek stojí 6 × 20 Kč = 120 Kč. Týdenní jízdenka stojí 150 Kč, tedy o 30 Kč víc. Sáře se víc vyplatí jednotlivé jízdenky.",
    solutionSteps: ["6 × 20 Kč = 120 Kč.", "150 Kč − 120 Kč = 30 Kč.", "Levnější jsou jednotlivé jízdenky, ušetří 30 Kč."],
  },
  {
    question: "Text: „Jedna vstupenka do kina stojí 150 Kč. Ve středu platí akce: dvě vstupenky za 250 Kč.“ Dva kamarádi jdou do kina ve středu. Co je pro ně výhodnější?",
    correct: "Akce, ušetří 50 Kč.",
    distractors: [
      { value: "Dvě obyčejné vstupenky, protože 150 Kč je méně než 250 Kč.", why: "Srovnáváš jednu vstupenku se dvěma. Dvě obyčejné vstupenky stojí 2 × 150 Kč = 300 Kč." },
      { value: "Akce, ušetří 100 Kč.", why: "Odečetl jsi cenu jedné vstupenky. Porovnej 250 Kč s cenou dvou vstupenek: 2 × 150 Kč = 300 Kč." },
      { value: "Dvě obyčejné vstupenky, ušetří 50 Kč.", why: "Rozdíl 50 Kč sedí, ale obráceně: dráž vyjdou obyčejné vstupenky (300 Kč), ne akce (250 Kč)." },
    ],
    hints: [
      "Spočítej, kolik by stály 2 obyčejné vstupenky.",
      "Ceny se dají porovnat, až když platí pro stejný počet vstupenek. Vynásob cenu jedné vstupenky dvěma, porovnej výsledek s akcí a rozdíl odečti.",
    ],
    explanation: "Dvě obyčejné vstupenky stojí 2 × 150 Kč = 300 Kč. Akce stojí 250 Kč, tedy o 50 Kč méně.",
    solutionSteps: ["2 × 150 Kč = 300 Kč.", "300 Kč − 250 Kč = 50 Kč.", "Levnější je akce, ušetří 50 Kč."],
  },
];

const PRAVIDLO_BANKA: TaskSpec[] = [
  {
    question: "Text: „Do dětského bazénu smí děti mladší 10 let jen v doprovodu dospělého, starší děti mohou dovnitř samy.“ Markovi je 8 let a chce jít plavat sám, bez rodičů. Smí Marek vstoupit do bazénu sám?",
    correct: "Ne, potřebuje doprovod dospělého.",
    distractors: [
      { value: "Ano, dětem se v bazénu nikdy nic nestane.", why: "Tohle pravidlo neřeší bezpečnost obecně, ale věkovou hranici. Markovi je 8 let, a to je méně než 10." },
      { value: "Ano, protože je mu už 8 let.", why: "8 let je méně než hranice 10 let z pravidla, ne víc — proto doprovod pořád potřebuje." },
      { value: "Ne, děti do bazénu vůbec nesmí.", why: "Pravidlo děti nezakazuje úplně — starší děti smí samy, jen ty mladší 10 let potřebují doprovod." },
    ],
    hints: [
      "Najdi v pravidle věkovou hranici a porovnej ji s Markovým věkem.",
      "Pravidlo rozlišuje mladší a starší děti podle jedné hranice. Zjisti, na kterou stranu té hranice Marek patří, a teprve podle toho rozhodni.",
    ],
    explanation: "Pravidlo dovoluje dětem mladším 10 let vstup jen s doprovodem. Markovi je 8 let, to je méně než 10, proto doprovod potřebuje.",
  },
  {
    question: "Text: „Snížené dětské vstupné do muzea platí jen pro žáky se studentským průkazem, bez průkazu se platí vstupné jako pro dospělé.“ Jana je žákyně 6. třídy, ale studentský průkaz si zapomněla doma. Zaplatí Jana sníženou cenu?",
    correct: "Ne, bez průkazu platí plnou cenu.",
    distractors: [
      { value: "Ano, protože je žákyně.", why: "Být žákyní nestačí — sleva je podmíněná průkazem, a ten Jana u sebe nemá." },
      { value: "Ano, sleva platí vždy pro děti do 15 let.", why: "Tohle pravidlo v textu není. Text mluví jen o studentském průkazu, ne o věku." },
      { value: "Ne, protože je na dětskou slevu už moc stará.", why: "Věk tu není důvod. Chybí jí průkaz, ne roky." },
    ],
    hints: [
      "Najdi v pravidle podmínku, za jaké platí snížené vstupné, a ověř, jestli ji Jana splňuje.",
      "Sleva není podmíněná tím, že je žákyně, ale tím, že u sebe má konkrétní doklad. Zjisti, jestli ho podle textu má.",
    ],
    explanation: "Sleva platí jen se studentským průkazem. Jana ho u sebe nemá, proto zaplatí plnou cenu jako dospělý.",
  },
  {
    question: "Text: „Na kolotoč smí děti menší než 100 centimetrů jen s doprovodem, vyšší děti mohou jet samy.“ Filip měří 105 centimetrů a chce jet sám. Smí Filip jet sám?",
    correct: "Ano, je vyšší než stanovený limit.",
    distractors: [
      { value: "Ne, potřebuje doprovod, protože je pořád dítě.", why: "Pravidlo nerozlišuje podle věku, ale podle výšky. Filip měří víc než 100 centimetrů, takže smí sám." },
      { value: "Ano, protože je mu dost let.", why: "Pravidlo mluví o výšce, ne o věku — o letech tam nic není." },
      { value: "Ne, kolotoč je jen pro dospělé.", why: "Tohle v textu není. Text naopak říká, že vyšší děti mohou jet samy." },
    ],
    hints: [
      "Najdi v pravidle výškovou hranici a porovnej ji s Filipovou výškou.",
      "Pravidlo rozlišuje děti podle jedné hranice výšky, ne podle věku. Zjisti, na kterou stranu té hranice Filip patří.",
    ],
    explanation: "Pravidlo dovoluje dětem menším než 100 centimetrů jet jen s doprovodem. Filip měří 105 centimetrů, to je víc, proto smí jet sám.",
  },
  {
    question: "Text: „Vstup do trampolínového centra je zakázán dětem mladším 4 let, a to i s doprovodem. Od 4 let mohou skákat, ale jen s podepsaným souhlasem rodičů.“ Tříletá Anička chce skákat s maminkou, která by stála hned vedle ní. Smí Anička skákat?",
    correct: "Ne, dětem mladším 4 let je vstup zakázaný úplně.",
    distractors: [
      { value: "Ano, když je s ní maminka.", why: "Text říká, že dětem mladším 4 let je vstup zakázaný i s doprovodem — maminka na tom nic nemění." },
      { value: "Ano, stačí podepsaný souhlas rodičů.", why: "Souhlas rodičů platí až od 4 let. Aničce jsou 3, ta hranice pro ni ještě neplatí." },
      { value: "Ne, protože nemá podepsaný souhlas rodičů.", why: "Důvod je jinde — Aničce jsou jen 3 roky, a to jí vstup zakazuje úplně, bez ohledu na souhlas." },
    ],
    hints: [
      "Najdi v pravidle věkovou hranici a ověř, na kterou stranu té hranice Anička patří.",
      "U dětí pod hranicí platí úplný zákaz, i s doprovodem. Podmínka se souhlasem rodičů se týká až starších dětí.",
    ],
    explanation: "Dětem mladším 4 let je vstup zakázaný úplně, i s doprovodem dospělého. Aničce jsou 3 roky, proto skákat nesmí.",
  },
];

const FAKT_NAZOR_BANKA: TaskSpec[] = [
  {
    question: "Text: „Náš výlet na hrad byl naprosto úžasný zážitek. Hrad byl postaven ve 14. století. Myslím, že je to nejkrásnější hrad v okolí. Prohlídka byla podle mě zbytečně dlouhá.“ Která věta z textu je ověřitelný fakt, ne názor?",
    correct: "Hrad byl postaven ve 14. století.",
    distractors: [
      { value: "Náš výlet na hrad byl naprosto úžasný zážitek.", why: "Slovo „úžasný“ je hodnocení pisatele, ne ověřitelný údaj." },
      { value: "Myslím, že je to nejkrásnější hrad v okolí.", why: "Sloveso „myslím“ a slovo „nejkrásnější“ ukazují, že jde o osobní názor." },
      { value: "Prohlídka byla podle mě zbytečně dlouhá.", why: "„Podle mě“ a „zbytečně“ jsou znaky názoru, ne ověřitelného faktu." },
    ],
    hints: [
      "Fakt jde ověřit bez ohledu na to, kdo ho říká. Názor obsahuje hodnocení nebo slovo jako „myslím“.",
      "Projdi si každou větu a hledej slova jako „úžasný“, „nejkrásnější“, „podle mě“ nebo „myslím“ — ta prozrazují názor, ne fakt.",
    ],
    explanation: "Jen věta o době postavení hradu (14. století) je ověřitelný údaj. Ostatní věty obsahují hodnoticí slova jako „úžasný“, „nejkrásnější“ nebo „podle mě“ — to jsou názory pisatele.",
  },
  {
    question: "Text: „Nový animovaný film má stopáž 95 minut. Podle mě je to nejlepší film letošního roku. Grafika je naprosto dokonalá. Děj je zbytečně pomalý.“ Která věta z textu je ověřitelný fakt, ne názor?",
    correct: "Nový animovaný film má stopáž 95 minut.",
    distractors: [
      { value: "Podle mě je to nejlepší film letošního roku.", why: "„Podle mě“ a „nejlepší“ ukazují, že jde o osobní názor." },
      { value: "Grafika je naprosto dokonalá.", why: "Slovo „dokonalá“ je hodnocení, ne ověřitelný údaj." },
      { value: "Děj je zbytečně pomalý.", why: "Slovo „zbytečně“ je hodnocení — jestli je děj pomalý, záleží na tom, komu. Ověřit se to nedá." },
    ],
    hints: [
      "Fakt jde ověřit bez ohledu na to, kdo ho říká. Názor obsahuje hodnocení nebo slovo jako „podle mě“.",
      "Projdi si každou větu a hledej slova jako „nejlepší“, „dokonalá“, „podle mě“ nebo „zbytečně“ — ta prozrazují názor, ne fakt.",
    ],
    explanation: "Jen věta o stopáži filmu je ověřitelný údaj. Ostatní věty obsahují hodnoticí slova jako „nejlepší“, „dokonalá“ nebo „zbytečně pomalý“ — to jsou názory.",
  },
  {
    question: "Text: „Škola postavila novou tělocvičnu o rozloze 400 metrů čtverečních. Je to podle mě nejhezčí tělocvična ve městě. Trénovat v ní je mnohem příjemnější. Staré vybavení bylo otřesné.“ Která věta z textu je ověřitelný fakt, ne názor?",
    correct: "Škola postavila novou tělocvičnu o rozloze 400 metrů čtverečních.",
    distractors: [
      { value: "Je to podle mě nejhezčí tělocvična ve městě.", why: "„Podle mě“ a „nejhezčí“ ukazují, že jde o osobní názor." },
      { value: "Trénovat v ní je mnohem příjemnější.", why: "Slovo „příjemnější“ je dojem pisatele. Co je komu příjemné, se změřit nedá." },
      { value: "Staré vybavení bylo otřesné.", why: "Slovo „otřesné“ je hodnocení, ne ověřitelný údaj." },
    ],
    hints: [
      "Fakt jde ověřit bez ohledu na to, kdo ho říká. Názor obsahuje hodnocení nebo slovo jako „podle mě“.",
      "Projdi si každou větu a hledej slova jako „nejhezčí“, „příjemnější“, „otřesné“ nebo „podle mě“ — ta prozrazují názor, ne fakt.",
    ],
    explanation: "Jen věta o rozloze tělocvičny je ověřitelný údaj (dá se přeměřit). Ostatní věty obsahují hodnoticí slova jako „nejhezčí“, „příjemnější“ nebo „otřesné“ — to jsou názory.",
  },
  {
    question: "Text: „Zoo přivezla nového levharda, kterému je pět let. Je to nejkrásnější zvíře v celé zoo. Levhart je velmi chytrý. Je ale trochu líný.“ Která věta z textu je ověřitelný fakt, ne názor?",
    correct: "Zoo přivezla nového levharda, kterému je pět let.",
    distractors: [
      { value: "Je to nejkrásnější zvíře v celé zoo.", why: "Slovo „nejkrásnější“ je hodnocení, ne ověřitelný údaj." },
      { value: "Levhart je velmi chytrý.", why: "Slovo „chytrý“ je hodnocení. Jak moc je zvíře chytré, se změřit ani ověřit nedá." },
      { value: "Je ale trochu líný.", why: "Slovo „líný“ je dojem pisatele, ne ověřitelný údaj." },
    ],
    hints: [
      "Fakt jde ověřit bez ohledu na to, kdo ho říká. Názor obsahuje hodnocení — slovo, které vyjadřuje, co si pisatel o věci myslí.",
      "Projdi si každou větu a hledej slova jako „nejkrásnější“, „chytrý“ nebo „líný“ — ta prozrazují názor, ne fakt. Fakt je údaj, který jde spočítat nebo dohledat.",
    ],
    explanation: "Jen věta o stáří levharda je ověřitelný údaj. Ostatní věty obsahují hodnoticí slova jako „nejkrásnější“, „chytrý“ nebo „líný“ — to jsou názory.",
  },
];

const NELZE_VYVODIT_BANKA: TaskSpec[] = [
  {
    question: "Text: „Třída jede na výlet do planetária. Odjezd autobusu je v 8 hodin ráno od školy. Vstupné hradí škola, žáci si berou jen svačinu a pití. Program v planetáriu trvá dvě hodiny.“ Co z textu NELZE vyvodit?",
    correct: "Po programu v planetáriu si třída ještě prohlédne hvězdárnu.",
    distractors: [
      { value: "Škola zaplatí vstupné za žáky.", why: "Tohle text přímo říká — vstupné hradí škola. Ptáme se, co nelze vyvodit, a tohle vyvodit jde." },
      { value: "Program v planetáriu trvá 120 minut.", why: "Dvě hodiny jsou 120 minut, to je přesně to, co text říká — tohle vyvodit jde." },
      { value: "Autobus odjíždí ráno.", why: "Text říká, že odjezd je v 8 hodin ráno — tohle vyvodit jde." },
    ],
    hints: [
      "U každé možnosti zkus najít v textu oporu — je tam napsaná, nebo se dá přímo spočítat?",
      "Tři možnosti jsou v textu přímo řečené nebo se dají snadno odvodit. Jedna možnost sice nezní nesmyslně, ale text o ní vůbec nic neříká.",
    ],
    explanation: "Text nic neříká o tom, co bude po programu v planetáriu následovat. Ostatní možnosti jsou přímo v textu, nebo se z něj dají spočítat.",
  },
  {
    question: "Text: „Na farmě chovají slepice, kozy a dvě krávy. Slepice snášejí vejce, která farma prodává na trhu. Kozí mléko rodina zpracovává na sýr. Krávy se pasou na louce za stodolou.“ Co z textu NELZE vyvodit?",
    correct: "Farma prodává na trhu i kozí sýr.",
    distractors: [
      { value: "Na farmě jsou chovaná zvířata alespoň tří druhů.", why: "Text jmenuje slepice, kozy a krávy — to jsou tři druhy, tohle vyvodit jde." },
      { value: "Vejce se prodávají na trhu.", why: "Tohle text přímo říká — tohle vyvodit jde." },
      { value: "Krávy mají přístup na louku.", why: "Text říká, že se krávy pasou na louce — tohle vyvodit jde." },
    ],
    hints: [
      "U každé možnosti zkus najít v textu oporu — je tam napsaná, nebo se dá přímo odvodit?",
      "Tři možnosti jsou v textu přímo řečené nebo se dají snadno odvodit. Jedna možnost sice nezní nesmyslně, ale text o ní vůbec nic neříká.",
    ],
    explanation: "Text říká jen to, že rodina zpracovává kozí mléko na sýr — o prodeji sýra na trhu nic neříká. Ostatní možnosti jsou přímo v textu.",
  },
  {
    question: "Text: „Petr přečetl za prázdniny tři knihy. Jedna z nich byla o dinosaurech, další o vesmíru a poslední byl dobrodružný román. Ke každé knize si napsal krátký zápis do čtenářského deníku. Nejvíc se mu líbila kniha o vesmíru.“ Co z textu NELZE vyvodit?",
    correct: "Petr přečetl dinosauří knihu jako první.",
    distractors: [
      { value: "Petr má čtenářský deník.", why: "Text říká, že si ke každé knize psal zápis do čtenářského deníku — tohle vyvodit jde." },
      { value: "Petr přečetl přesně tři knihy.", why: "Tohle text přímo říká — tohle vyvodit jde." },
      { value: "Nejvíc se mu líbila kniha o vesmíru.", why: "Tohle je v textu doslova napsané — tohle vyvodit jde." },
    ],
    hints: [
      "U každé možnosti zkus najít v textu oporu — je tam napsaná, nebo se dá přímo odvodit?",
      "Tři možnosti jsou v textu přímo řečené. Jedna možnost sice nezní nesmyslně, ale o pořadí čtení text vůbec nic neříká.",
    ],
    explanation: "Text vyjmenovává tři knihy, ale nic neříká o pořadí, v jakém je Petr četl. Ostatní možnosti jsou přímo v textu.",
  },
  {
    question: "Text: „Kroužek atletiky trénuje dvakrát týdně, v úterý a ve čtvrtek. Trénink vede pan trenér Novák. Na trénink je potřeba sportovní oblečení a láhev s pitím. Přihlásit se může každý žák od druhé třídy.“ Co z textu NELZE vyvodit?",
    correct: "Trénink v úterý trvá déle než trénink ve čtvrtek.",
    distractors: [
      { value: "Kroužek se koná dvakrát týdně.", why: "Tohle text přímo říká — tohle vyvodit jde." },
      { value: "Trénink vede pan Novák.", why: "Tohle text přímo říká — tohle vyvodit jde." },
      { value: "Přihlásit se nemůže žák první třídy.", why: "Text říká, že se může přihlásit každý žák od druhé třídy výš — prvňáček tedy ne. Tohle vyvodit jde." },
    ],
    hints: [
      "U každé možnosti zkus najít v textu oporu — je tam napsaná, nebo se dá přímo odvodit?",
      "Tři možnosti jsou v textu přímo řečené nebo se dají odvodit. Jedna možnost sice nezní nesmyslně, ale o délce jednotlivých tréninků text vůbec nic neříká.",
    ],
    explanation: "Text říká jen dny tréninků, ne jejich délku — porovnat úterý a čtvrtek proto nejde. Ostatní možnosti jsou přímo v textu, nebo se z něj dají odvodit.",
  },
];

function genFromBanka(banka: TaskSpec[]): PracticeTask | null {
  const s = pick(banka);
  return choice(s.question, s.correct, s.distractors, {
    hints: s.hints,
    explanation: s.explanation,
    solutionSteps: s.solutionSteps,
  });
}

function genL3(): PracticeTask | null {
  const typ = pick(["jizdniRad", "navod", "ceny", "pravidlo", "faktNazor", "nelzeVyvodit"] as const);
  if (typ === "jizdniRad") return genFromBanka(JIZDNI_BANKA);
  if (typ === "navod") return genFromBanka(NAVOD_BANKA);
  if (typ === "ceny") return genFromBanka(CENY_BANKA);
  if (typ === "pravidlo") return genFromBanka(PRAVIDLO_BANKA);
  if (typ === "faktNazor") return genFromBanka(FAKT_NAZOR_BANKA);
  return genFromBanka(NELZE_VYVODIT_BANKA);
}

// ─────────────────────────────────────────────────────────────────────────

function gen(level: number): PracticeTask[] {
  if (level >= 3) return ruzneUlohy(() => losUlohy(genL3));
  if (level === 2) return ruzneUlohy(() => losUlohy(genL2));
  return ruzneUlohy(() => losUlohy(genL1));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const PRAKTICKE_VECNE_CTENI_STUDIJNI_CTENI: TopicMetadata[] = [
  {
    id: "g6-cjl-prakticke-a-vecne-cteni-studijni-cteni-6",
    rvpNodeId: "g6-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-prakticke-a-vecne-cteni-studijni-cteni",
    title: "Praktické a věcné čtení, studijní čtení",
    studentTitle: "Čtu návody, jízdní řády a učebnici",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení a naslouchání",
    briefDescription: "Najdu v textu údaj, hlavní myšlenku a to, co z textu plyne.",
    keywords: [
      "studijní čtení", "věcné čtení", "jízdní řád", "návod", "hlavní myšlenka",
      "klíčová slova", "výpisky", "nadpis", "fakt", "názor", "ceník",
    ],
    goals: [
      "Vyčíst z krátkého věcného textu konkrétní údaj (kdy, kde, kolik).",
      "Najít hlavní myšlenku odstavce a odlišit ji od detailu nebo domněnky.",
      "Rozhodnout, co z textu plyne — a co z něj vyvodit nelze.",
    ],
    boundaries: [
      "Bez psaní vlastního textu — žák jen vybírá odpověď (žádné inputType: essay).",
      "Věcné texty jsou vlastní, smyšlené — bez tabulek a bez obrázků.",
      "Úroveň 3 počítá s časy a limity, ale jen s jednoduchým sčítáním minut.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Nejdřív najdi v textu správný řádek nebo větu, pak teprve odpovídej — nehádej z hlavy.",
      steps: [
        "Přečti si celý text, ne jen jednu větu.",
        "Najdi v textu přesně to místo, na které se otázka ptá.",
        "U hlavní myšlenky zkontroluj, jestli tvoje možnost platí pro celý text.",
        "U jízdních řádů a pravidel dej pozor na výjimky (víkend, věk, výška).",
      ],
      commonMistake: "Žáci často vezmou první nebo nejzajímavější informaci, i když se otázka ptá na jinou, nebo přehlédnou výjimku (víkend, podmínku).",
      example: "Text říká, že v sobotu jede jen jeden spoj v 8:25 a cesta trvá 25 minut. Kdo tam musí být v 8:30, spoj nestihne — přijede až v 8:50.",
    },
  },
];
