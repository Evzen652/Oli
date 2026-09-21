/**
 * Čeština 6. ročník — Předmět, příslovečné určení, přívlastek, doplněk (select_one).
 *
 * Navazuje na grade-4/cjl/stavbaVetyZakladniSkladebniDvojicePodmetPrisudek.ts
 * a grade-5/cjl/podmetVyjadrenyNevyjadrenyNekolikanasobny.ts — podmět a přísudek
 * už žák umí určit, tady se učí ROZVÍJEJÍCÍ členy.
 *
 * Zkoumaný člen je ve větě vždy VYZNAČEN (velká písmena); u víceslovného členu
 * jsou zvýrazněná všechna jeho slova.
 *
 *  • L1 — rozpoznání podle otázky, jednoznačné prototypy.
 *    – formát A: jeden vyznačený člen, čtyři hlavní pojmy (podmět jako
 *      rozcvička z 5. ročníku i distraktor, předmět, příslovečné určení,
 *      přívlastek). Doplněk se na L1 nevyskytuje.
 *    – formát B: obrácená otázka → člen ("Na který větný člen se ptáme
 *      otázkou „KDY?“?"), učí dvojici otázka–člen bez konkrétní věty.
 *  • L2 — použití a jemnější rozlišení UVNITŘ členů.
 *    (a) druh příslovečného určení (místa/času/způsobu/příčiny),
 *    (b) přívlastek shodný × neshodný,
 *    (c) předmět × příslovečné určení místa u typických předložkových vazeb
 *        (mluvit O ČEM = předmět × jít DO ČEHO = PU místa), doplněk se tu
 *        objevuje jen jako distraktor,
 *    (d) pádová otázka, kterou se ptáme na předmět.
 *  • L3 — analýza a přenos.
 *    (a) doplněk v prototypech (Vrátil se unavený. Zvolili ho předsedou.),
 *    (b) minimální dvojice přívlastek × doplněk stejným slovem v jiné
 *        pozici věty,
 *    (c) podmět × předmět ve 4. pádě při obráceném slovosledu (Míč kopl
 *        Tomáš.), reuse formátu A,
 *    (d) příslovečné určení míry a účelu — jen tady,
 *    (e) inverze: ze čtyř vět se stejným slovem v jiné funkci vyber tu, kde
 *        je doplňkem.
 *
 * Chybový model (viz spec):
 *  1) záměna podmětu a předmětu ve 4. pádě při obráceném slovosledu,
 *  2) předložková vazba braná automaticky jako PU místa (nebo naopak),
 *  3) přívlastek shodný × neshodný posuzovaný podle POLOHY slova, ne podle
 *     skloňování,
 *  4) doplněk zaměněný za přívlastek nebo PU způsobu.
 *
 * Sporné případy (předmět × PU u vazeb typu "bojovat o titul", doplněk
 * vyjádřený přechodníkem, několikanásobné členy, přívlastek volný) se
 * v tématu nepoužívají ani jako klíč, ani jako distraktor.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

type Builder = () => PracticeTask | null;

/**
 * Obal nad `buildChoiceTask`: sdílený dovětek „Dosaď každou možnost zpátky do
 * věty…“ tu nedává smysl (možnostmi jsou názvy větných členů nebo pádové
 * otázky, ne slova do věty), proto velkou nápovědu skládáme sami. Velká
 * nápověda musí být aspoň o pětinu delší než malá — když není, doplní se
 * obecná rada, která sedí na každou úlohu tématu.
 */
const DOPLNKY_NAPOVEDY = [
  "Nejdřív škrtni možnost, která zjevně nesedí, a pak porovnej zbylé.",
  "Otázku polož celou, i se slovem, ke kterému vyznačený člen patří.",
];
function choice(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: [string, string]; explanation: string },
): PracticeTask | null {
  const t = buildChoiceTask(question, correct, distractors, parts);
  if (!t) return null;
  let velka = parts.hints[1];
  for (const d of DOPLNKY_NAPOVEDY) {
    if (velka.length >= parts.hints[0].length * 1.2) break;
    velka = `${velka} ${d}`;
  }
  t.hints = [parts.hints[0], velka];
  return t;
}

// ── Společný slovník pěti hlavních větných členů ─────────────────────────────
type Member = "podmet" | "predmet" | "pu" | "privlastek" | "doplnek";

/** 1. pád (a zároveň 4. pád — všechny názvy jsou neživotné). */
const LABEL: Record<Member, string> = {
  podmet: "podmět",
  predmet: "předmět",
  pu: "příslovečné určení",
  privlastek: "přívlastek",
  doplnek: "doplněk",
};

/** 3. pád — po předložce „k“. */
const LABEL_DAT: Record<Member, string> = {
  podmet: "podmětu",
  predmet: "předmětu",
  pu: "příslovečnému určení",
  privlastek: "přívlastku",
  doplnek: "doplňku",
};

/** „na X se ptáme …“ — jedna úroveň závorek, žádné vnořené. */
const OTAZKA: Record<Member, string> = {
  podmet: "otázkou KDO? CO? v 1. pádě",
  predmet: "pádovou otázkou od slovesa ve 2.–7. pádě, třeba koho? co? nebo komu? čemu?",
  pu: "otázkami KDE? KDY? JAK? PROČ?",
  privlastek: "otázkami JAKÝ? KTERÝ? ČÍ?",
  doplnek: "otázkou na podmět nebo předmět a zároveň na děj",
};

/** Pravidlo pro distraktor: co by ten člen musel splňovat. */
const PRAVIDLO: Record<Member, string> = {
  podmet: "Podmět odpovídá na otázku KDO? CO? v 1. pádě a označuje toho, kdo děj koná.",
  predmet: "Předmět odpovídá na pádovou otázku od slovesa ve 2.–7. pádě (třeba koho? co? nebo komu? čemu?) a označuje osobu nebo věc, které se děj týká.",
  pu: "Příslovečné určení odpovídá na otázky KDE? KDY? JAK? PROČ? a říká, za jakých okolností se děj odehrává.",
  privlastek: "Přívlastek odpovídá na otázky JAKÝ? KTERÝ? ČÍ? a rozvíjí podstatné jméno, ne sloveso.",
  doplnek: "Doplněk se váže zároveň k podmětu nebo předmětu a k ději.",
};

/** Co člen dělá — do vysvětlení. */
const POPIS: Record<Member, string> = {
  podmet: "Podmět označuje toho, kdo nebo co děj koná, a stojí v 1. pádě.",
  predmet: "Předmět označuje osobu nebo věc, které se děj týká; ptáme se na něj od slovesa v pádě 2.–7.",
  pu: "Příslovečné určení říká, kde, kdy, jak nebo proč se děj odehrává.",
  privlastek: "Přívlastek rozvíjí podstatné jméno a říká, jaké je, které nebo čí.",
  doplnek: "Doplněk vypovídá zároveň o podmětu nebo předmětu a o ději.",
};

const MEMBERS_4: Member[] = ["podmet", "predmet", "pu", "privlastek"];

// ── L1 formát A — vyznačený člen ve větě, čtyři hlavní pojmy ────────────────
interface VetaA {
  sentence: string;
  marked: string;
  member: Member;
  /** Otázka, na kterou vyznačený člen ve větě skutečně odpovídá. */
  otazka: string;
  /** Volitelně ručně psaný feedback k některým distraktorům (L3c). */
  feedback?: Partial<Record<Member, string>>;
  explanation?: string;
}

/** Proč `wrong` nesedí — pravidlo členu + skutečná otázka z věty. */
function whyNotMember(wrong: Member, item: VetaA): string {
  return `${PRAVIDLO[wrong]} Na „${item.marked}“ se ale ptáme „${item.otazka}“, a to je otázka na ${LABEL[item.member]}.`;
}

// Pořadí střídá určovaný člen (podmět, předmět, PU, přívlastek) a pozici
// vyznačeného slova ve větě — nejde uhodnout podle toho, co stojí na začátku.
const BANKA_L1: VetaA[] = [
  { sentence: "BABIČKA upletla teplou čepici.", marked: "BABIČKA", member: "podmet", otazka: "Kdo upletl teplou čepici?" },
  { sentence: "Táta čte KNIHU.", marked: "KNIHU", member: "predmet", otazka: "Co čte táta?" },
  { sentence: "Hráli jsme fotbal NA HŘIŠTI.", marked: "NA HŘIŠTI", member: "pu", otazka: "Kde jsme hráli fotbal?" },
  { sentence: "Klára čte NAPÍNAVOU knihu.", marked: "NAPÍNAVOU", member: "privlastek", otazka: "Jakou knihu čte Klára?" },
  { sentence: "Na zahradě si hrají DĚTI.", marked: "DĚTI", member: "podmet", otazka: "Kdo si hraje na zahradě?" },
  { sentence: "Babička upekla VNOUČATŮM buchty.", marked: "VNOUČATŮM", member: "predmet", otazka: "Komu upekla babička buchty?" },
  { sentence: "VČERA jsme odjeli na hory.", marked: "VČERA", member: "pu", otazka: "Kdy jsme odjeli na hory?" },
  { sentence: "Petr má ZELENÝ batoh.", marked: "ZELENÝ", member: "privlastek", otazka: "Jaký batoh má Petr?" },
  { sentence: "Naši SOUSEDÉ staví nový plot.", marked: "SOUSEDÉ", member: "podmet", otazka: "Kdo staví nový plot?" },
  { sentence: "Věnuji se KRESLENÍ.", marked: "KRESLENÍ", member: "predmet", otazka: "Čemu se věnuji?" },
  { sentence: "Zpívala POTICHU.", marked: "POTICHU", member: "pu", otazka: "Jak zpívala?" },
  { sentence: "STARÝ hrad stojí na kopci.", marked: "STARÝ", member: "privlastek", otazka: "Jaký hrad stojí na kopci?" },
  { sentence: "Malá HOLČIČKA nakreslila obrázek.", marked: "HOLČIČKA", member: "podmet", otazka: "Kdo nakreslil obrázek?" },
  { sentence: "Kamarádka se těší NA VÝLET.", marked: "NA VÝLET", member: "predmet", otazka: "Na co se těší kamarádka?" },
  { sentence: "Sešli jsme se PŘED ŠKOLOU.", marked: "PŘED ŠKOLOU", member: "pu", otazka: "Kde jsme se sešli?" },
  { sentence: "Viděli jsme RYCHLÉ auto.", marked: "RYCHLÉ", member: "privlastek", otazka: "Jaké auto jsme viděli?" },
];

function taskFormatA(item: VetaA): PracticeTask | null {
  return choice(
    `Jakým větným členem je ve větě „${item.sentence}“ vyznačená část „${item.marked}“?`,
    LABEL[item.member],
    MEMBERS_4.filter((m) => m !== item.member).map((m) => ({
      value: LABEL[m],
      why: item.feedback?.[m] ?? whyNotMember(m, item),
    })),
    {
      hints: [
        `Najdi ve větě „${item.sentence}“ nejdřív přísudek (sloveso) a polož si otázku, na kterou vyznačené „${item.marked}“ odpovídá.`,
        `Zkus na „${item.marked}“ postupně otázky KDO? CO? v 1. pádě, pádovou otázku od slovesa, KDE? KDY? JAK? PROČ? a JAKÝ? KTERÝ? ČÍ? — vyhraje ta, na kterou slovo odpoví se smyslem věty.`,
      ],
      explanation:
        item.explanation ??
        `Na „${item.marked}“ se ptáme „${item.otazka}“. ${POPIS[item.member]} Proto je „${item.marked}“ ${LABEL[item.member]}.`,
    },
  );
}

// ── L1 formát B — obrácená otázka: na který člen se ptáme touhle otázkou? ───
interface OtazkaB {
  otazka: string;
  member: Member;
}

const BANKA_L1B: OtazkaB[] = [
  { otazka: "KDY?", member: "pu" },
  { otazka: "KOMU? nebo ČEMU? (3. pád)", member: "predmet" },
  { otazka: "JAKÝ? KTERÝ? nebo ČÍ?", member: "privlastek" },
  { otazka: "KDO? nebo CO? (1. pád)", member: "podmet" },
  { otazka: "KDE?", member: "pu" },
  { otazka: "KOHO? nebo CO? (4. pád)", member: "predmet" },
  { otazka: "ČÍ?", member: "privlastek" },
  { otazka: "JAK?", member: "pu" },
];

function taskFormatB(item: OtazkaB): PracticeTask | null {
  const distractors = MEMBERS_4.filter((m) => m !== item.member).map((m) => ({
    value: LABEL[m],
    why: `Otázka „${item.otazka}“ patří k ${LABEL_DAT[item.member]}, ne k ${LABEL_DAT[m]}. Na ${LABEL[m]} se ptáme ${OTAZKA[m]}`,
  }));
  return choice(`Na který větný člen se ptáme otázkou „${item.otazka}“?`, LABEL[item.member], distractors, {
    hints: [
      `Zkus otázku „${item.otazka}“ položit u jednoduché věty, třeba „Pes štěká.“ nebo „Maminka vaří polévku.“, a sleduj, na jaké slovo se ptáš a v jakém je tvaru.`,
      `Porovnej otázku „${item.otazka}“ se čtyřmi skupinami otázek: KDO? CO? v 1. pádě, pádové otázky od slovesa ve 2.–7. pádě, KDE? KDY? JAK? PROČ? a JAKÝ? KTERÝ? ČÍ? — do které skupiny patří?`,
    ],
    explanation: `Otázkou „${item.otazka}“ se ptáme na ${LABEL[item.member]}. ${POPIS[item.member]}`,
  });
}

function poolL1(): Builder[] {
  const a = BANKA_L1.map((item) => () => taskFormatA(item));
  const b = BANKA_L1B.map((item) => () => taskFormatB(item));
  const out: Builder[] = [];
  for (let i = 0; i < a.length; i++) {
    out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  out.push(...b.slice(a.length));
  return out;
}

// ── L2 (a) — druh příslovečného určení: místa / času / způsobu / příčiny ────
type Druh = "misto" | "cas" | "zpusob" | "pricina" | "ucel" | "mira";

const LABEL_DRUH: Record<Druh, string> = {
  misto: "příslovečné určení místa",
  cas: "příslovečné určení času",
  zpusob: "příslovečné určení způsobu",
  pricina: "příslovečné určení příčiny",
  ucel: "příslovečné určení účelu",
  mira: "příslovečné určení míry",
};

const OTAZKA_DRUH: Record<Druh, string> = {
  misto: "KDE? KAM? ODKUD? KUDY?",
  cas: "KDY? ODKDY? DOKDY? JAK DLOUHO?",
  zpusob: "JAK? JAKÝM ZPŮSOBEM?",
  pricina: "PROČ? KVŮLI ČEMU?",
  ucel: "ZA JAKÝM ÚČELEM? NAČ?",
  mira: "JAK MOC? KOLIK? O KOLIK? KOLIKRÁT?",
};

interface VetaDruh {
  sentence: string;
  marked: string;
  druh: Druh;
  /** Otázka, na kterou vyznačený člen ve větě skutečně odpovídá. */
  q: string;
  /** Ručně psaný feedback k některým distraktorům (účel × příčina). */
  feedback?: Partial<Record<Druh, string>>;
}

function whyNotDruh(wrong: Druh, item: VetaDruh): string {
  return (
    item.feedback?.[wrong] ??
    `Na ${LABEL_DRUH[wrong]} se ptáme ${OTAZKA_DRUH[wrong]} Na „${item.marked}“ se tak ve větě smysluplně zeptat nedá. Správná otázka zní „${item.q}“.`
  );
}

// Pořadí střídá všechny čtyři druhy hned od začátku (místo, čas, způsob, příčina…).
const BANKA_L2A: VetaDruh[] = [
  { sentence: "Sešli jsme se PŘED KINEM.", marked: "PŘED KINEM", druh: "misto", q: "Kde jsme se sešli?" },
  { sentence: "Sraz máme V SEDM HODIN.", marked: "V SEDM HODIN", druh: "cas", q: "Kdy máme sraz?" },
  { sentence: "Odpověděl TICHÝM HLASEM.", marked: "TICHÝM HLASEM", druh: "zpusob", q: "Jak odpověděl?" },
  { sentence: "Zápas se odložil KVŮLI DEŠTI.", marked: "KVŮLI DEŠTI", druh: "pricina", q: "Proč se zápas odložil?" },
  { sentence: "Knihu našel POD POSTELÍ.", marked: "POD POSTELÍ", druh: "misto", q: "Kde knihu našel?" },
  { sentence: "Vrátíme se PŘÍŠTÍ TÝDEN.", marked: "PŘÍŠTÍ TÝDEN", druh: "cas", q: "Kdy se vrátíme?" },
  { sentence: "Napsal úkol PEČLIVĚ.", marked: "PEČLIVĚ", druh: "zpusob", q: "Jak napsal úkol?" },
  { sentence: "Škola byla zavřená KVŮLI CHŘIPCE.", marked: "KVŮLI CHŘIPCE", druh: "pricina", q: "Proč byla škola zavřená?" },
  { sentence: "Auto zaparkoval NA NÁMĚSTÍ.", marked: "NA NÁMĚSTÍ", druh: "misto", q: "Kde zaparkoval auto?" },
  { sentence: "Dárky rozbalujeme O VÁNOCÍCH.", marked: "O VÁNOCÍCH", druh: "cas", q: "Kdy rozbalujeme dárky?" },
  { sentence: "Šel domů RYCHLÝM KROKEM.", marked: "RYCHLÝM KROKEM", druh: "zpusob", q: "Jak šel domů?" },
  { sentence: "Neslyšel zvonek KVŮLI HLUKU.", marked: "KVŮLI HLUKU", druh: "pricina", q: "Proč neslyšel zvonek?" },
];

function taskL2a(item: VetaDruh): PracticeTask | null {
  const distractors: Distractor[] = (["misto", "cas", "zpusob", "pricina"] as Druh[])
    .filter((d) => d !== item.druh)
    .map((d) => ({ value: LABEL_DRUH[d], why: whyNotDruh(d, item) }));
  return choice(
    `Jaký druh příslovečného určení je ve větě „${item.sentence}“ vyznačené „${item.marked}“?`,
    LABEL_DRUH[item.druh],
    distractors,
    {
      hints: [
        `Najdi ve větě „${item.sentence}“ přísudek a zkus na „${item.marked}“ postupně otázky KDE? KDY? JAK? a PROČ?`,
        `Polož každou otázku celou, i se slovesem z věty. Jen jedna z těch čtyř otázek bude na „${item.marked}“ opravdu sedět se smyslem věty — u ostatních odpověď nedává smysl.`,
      ],
      explanation: `Ptáme se „${item.q}“ — to je otázka na ${LABEL_DRUH[item.druh]} (${OTAZKA_DRUH[item.druh]}).`,
    },
  );
}

// ── L2 (b) — přívlastek shodný × neshodný ────────────────────────────────────
interface VetaShoda {
  sentence: string;
  marked: string;
  governing: string;
  shodny: boolean;
  /** Celé spojení v 1. pádě a ve 2. pádě po „bez“ — ukázka skloňování. */
  nom: string;
  gen: string;
}

const BANKA_L2B: VetaShoda[] = [
  { sentence: "VYSOKÁ bříza rostla u cesty.", marked: "VYSOKÁ", governing: "bříza", shodny: true, nom: "vysoká bříza", gen: "bez vysoké břízy" },
  { sentence: "Přišla NAŠE sousedka.", marked: "NAŠE", governing: "sousedka", shodny: true, nom: "naše sousedka", gen: "bez naší sousedky" },
  { sentence: "Koupili DRUHÝ dům.", marked: "DRUHÝ", governing: "dům", shodny: true, nom: "druhý dům", gen: "bez druhého domu" },
  { sentence: "Měl NOVÉ boty.", marked: "NOVÉ", governing: "boty", shodny: true, nom: "nové boty", gen: "bez nových bot" },
  { sentence: "Kolo BRATRA stálo u plotu.", marked: "BRATRA", governing: "kolo", shodny: false, nom: "kolo bratra", gen: "bez kola bratra" },
  { sentence: "Chuť ČOKOLÁDY byla výborná.", marked: "ČOKOLÁDY", governing: "chuť", shodny: false, nom: "chuť čokolády", gen: "bez chuti čokolády" },
  { sentence: "Dům Z CIHEL byl starý.", marked: "Z CIHEL", governing: "dům", shodny: false, nom: "dům z cihel", gen: "bez domu z cihel" },
  { sentence: "Hrnek S UCHEM se rozbil.", marked: "S UCHEM", governing: "hrnek", shodny: false, nom: "hrnek s uchem", gen: "bez hrnku s uchem" },
];

function taskL2b(item: VetaShoda): PracticeTask | null {
  const correctLabel = item.shodny ? "přívlastek shodný" : "přívlastek neshodný";
  const wrongShodnostLabel = item.shodny ? "přívlastek neshodný" : "přívlastek shodný";
  const ukazka = `${item.nom} → ${item.gen}`;
  const whyShodnost = item.shodny
    ? `„${item.marked}“ se mění spolu s podstatným jménem „${item.governing}“ (${ukazka}) — shoduje se s ním v pádě, čísle i rodě. Neshodný přívlastek by zůstal pořád ve stejném tvaru.`
    : `„${item.marked}“ zůstává ve stejném tvaru, i když podstatné jméno „${item.governing}“ skloňujeme (${ukazka}). Shodný přívlastek by se měnil spolu s ním. Nerozhoduje, jestli slovo stojí před podstatným jménem, nebo za ním.`;
  const whyPredmet = item.shodny
    ? `„${item.marked}“ rozvíjí podstatné jméno „${item.governing}“ a odpovídá na otázku od něj (jaký? který? čí?), ne na pádovou otázku od slovesa. Proto je to přívlastek, ne předmět.`
    : `Na „${item.marked}“ se sice ptáme pádovou otázkou, ale od podstatného jména „${item.governing}“, ne od slovesa. Předmět rozvíjí sloveso; slovo, které rozvíjí podstatné jméno, je přívlastek.`;
  const whyPu = `„${item.marked}“ rozvíjí podstatné jméno „${item.governing}“, ne sloveso — neříká, kde, kdy, jak ani proč se děj odehrává. Proto je to přívlastek, ne příslovečné určení.`;
  return choice(
    `Jakým větným členem je ve větě „${item.sentence}“ vyznačené „${item.marked}“? U přívlastku urči i druh.`,
    correctLabel,
    [
      { value: wrongShodnostLabel, why: whyShodnost },
      { value: "předmět", why: whyPredmet },
      { value: "příslovečné určení", why: whyPu },
    ],
    {
      hints: [
        `Najdi slovo, které „${item.marked}“ rozvíjí (tady „${item.governing}“), a dej celé spojení do jiného pádu — třeba do 2. pádu (bez koho? čeho?).`,
        `Porovnej 1. a 2. pád celého spojení: „${item.nom}“ × „${item.gen}“. Mění se „${item.marked}“ spolu s podstatným jménem „${item.governing}“, nebo zůstává pořád stejné?`,
      ],
      explanation: `Ve větě „${item.sentence}“ ${
        item.shodny
          ? `se „${item.marked}“ skloňuje spolu s podstatným jménem „${item.governing}“ (${ukazka}) a shoduje se s ním v pádě, čísle i rodě. Proto je to přívlastek shodný.`
          : `zůstává „${item.marked}“ ve stejném tvaru, i když podstatné jméno „${item.governing}“ skloňujeme (${ukazka}). S podstatným jménem se neshoduje, proto je to přívlastek neshodný.`
      }`,
    },
  );
}

// ── L2 (c) — předmět × PU místa u typické předložkové vazby ─────────────────
interface VetaVazba {
  sentence: string;
  marked: string;
  verb: string;
  kind: "predmet" | "mista";
  /** Skutečná otázka z věty (u předmětu i s pádem). */
  otazka: string;
  pad?: string;
}

const BANKA_L2C: VetaVazba[] = [
  { sentence: "Přemýšlela O ZKOUŠCE.", marked: "O ZKOUŠCE", verb: "přemýšlela", kind: "predmet", otazka: "o čem přemýšlela?", pad: "6. pád" },
  { sentence: "Staral se O ZAHRADU.", marked: "O ZAHRADU", verb: "staral se", kind: "predmet", otazka: "o co se staral?", pad: "4. pád" },
  { sentence: "Vyprávěl O DOVOLENÉ.", marked: "O DOVOLENÉ", verb: "vyprávěl", kind: "predmet", otazka: "o čem vyprávěl?", pad: "6. pád" },
  { sentence: "Mluvili jsme O VÝLETĚ.", marked: "O VÝLETĚ", verb: "mluvili", kind: "predmet", otazka: "o čem jsme mluvili?", pad: "6. pád" },
  { sentence: "Šli jsme DO LESA.", marked: "DO LESA", verb: "šli", kind: "mista", otazka: "kam jsme šli?" },
  { sentence: "Rodina bydlela NA VENKOVĚ.", marked: "NA VENKOVĚ", verb: "bydlela", kind: "mista", otazka: "kde bydlela rodina?" },
  { sentence: "Vlak dojel DO STANICE.", marked: "DO STANICE", verb: "dojel", kind: "mista", otazka: "kam dojel vlak?" },
  { sentence: "Schovali se ZA STODOLOU.", marked: "ZA STODOLOU", verb: "schovali se", kind: "mista", otazka: "kde se schovali?" },
];

function taskL2c(item: VetaVazba): PracticeTask | null {
  const correct = item.kind === "predmet" ? "předmět" : "příslovečné určení místa";
  // volba „PU místa“ u předmětové věty → proč to NENÍ místo
  const whyNeniMisto = `Na „${item.marked}“ se nedá smysluplně zeptat KDE? ani KAM? — neurčuje místo děje. Ptáme se „${item.otazka}“, tedy pádovou otázkou od slovesa „${item.verb}“ (${item.pad}). Slovo říká, čeho se děj týká, proto to není příslovečné určení místa.`;
  // volba „předmět“ u věty s PU místa → proč to NENÍ předmět
  const whyNeniPredmet = `Na „${item.marked}“ se ptáme „${item.otazka}“ — to je otázka na místo, ne pádová otázka na to, čeho se děj týká. „${item.marked}“ určuje místo děje, proto to není předmět.`;
  const whyNeniCas = `Na „${item.marked}“ se ptáme „${item.otazka}“, ne KDY? — slovo neurčuje čas děje, ale místo.`;
  const whyPrivlastek = `„${item.marked}“ rozvíjí sloveso „${item.verb}“, ne podstatné jméno — přívlastek by musel stát u podstatného jména a odpovídat na JAKÝ? KTERÝ? ČÍ?`;
  const whyDoplnek = `Doplněk by musel vypovídat zároveň o podmětu nebo předmětu a o ději (např. „Vrátil se unavený.“). „${item.marked}“ o žádné osobě nic neříká, jen rozvíjí sloveso.`;
  const distractors: Distractor[] =
    item.kind === "predmet"
      ? [
          { value: "příslovečné určení místa", why: whyNeniMisto },
          { value: "přívlastek", why: whyPrivlastek },
          { value: "doplněk", why: whyDoplnek },
        ]
      : [
          { value: "předmět", why: whyNeniPredmet },
          { value: "příslovečné určení času", why: whyNeniCas },
          { value: "přívlastek", why: whyPrivlastek },
        ];
  return choice(`Jakým větným členem je ve větě „${item.sentence}“ vyznačené „${item.marked}“?`, correct, distractors, {
    hints: [
      `Najdi ve větě „${item.sentence}“ sloveso „${item.verb}“ a zkus se na „${item.marked}“ zeptat dvojím způsobem: pádovou otázkou od slovesa (o čem? o co?) a otázkou KDE? nebo KAM?`,
      `Jen jedna z těch otázek bude se smyslem věty opravdu sedět. Ptá se sloveso „${item.verb}“ na to, čeho se děj týká, nebo na místo, kde se děj odehrává či kam směřuje? Předložka sama o místě nerozhoduje.`,
    ],
    explanation:
      item.kind === "predmet"
        ? `Ptáme se „${item.otazka}“ — to je pádová otázka od slovesa „${item.verb}“ (${item.pad}), která zjišťuje, čeho se děj týká. Otázka KDE? ani KAM? tu smysl nedává. Proto je „${item.marked}“ předmět.`
        : `Ptáme se „${item.otazka}“ — zjišťujeme místo děje, ne to, čeho se děj týká. Proto je „${item.marked}“ příslovečné určení místa.`,
  });
}

// ── L2 (d) — pádová otázka, kterou se ptáme na vyznačený předmět ────────────
const PADOVE_OTAZKY = ["koho? čeho?", "komu? čemu?", "koho? co?", "o kom? o čem?", "s kým? s čím?"];

/** Pád otázky + tvar slova „žena“ (jeho tvary se v každém pádě liší). */
const PAD_INFO: Record<string, { pad: string; kPadu: string; sPadem: string; zena: string }> = {
  "koho? čeho?": { pad: "2. pád", kPadu: "ke 2. pádu", sPadem: "se 2. pádem", zena: "ženy" },
  "komu? čemu?": { pad: "3. pád", kPadu: "ke 3. pádu", sPadem: "se 3. pádem", zena: "ženě" },
  "koho? co?": { pad: "4. pád", kPadu: "ke 4. pádu", sPadem: "se 4. pádem", zena: "ženu" },
  "o kom? o čem?": { pad: "6. pád", kPadu: "k 6. pádu", sPadem: "s 6. pádem", zena: "o ženě" },
  "s kým? s čím?": { pad: "7. pád", kPadu: "k 7. pádu", sPadem: "se 7. pádem", zena: "se ženou" },
};

interface VetaPad {
  sentence: string;
  marked: string;
  verb: string;
  otazka: string;
  /** Věta, kde je předmět nahrazený slovem „žena“. */
  zenaVeta: string;
}

const BANKA_L2D: VetaPad[] = [
  { sentence: "Bojíme se PAVOUKŮ.", marked: "PAVOUKŮ", verb: "bojíme se", otazka: "koho? čeho?", zenaVeta: "Bojíme se ženy." },
  { sentence: "Věnovala se MALOVÁNÍ.", marked: "MALOVÁNÍ", verb: "věnovala se", otazka: "komu? čemu?", zenaVeta: "Věnovala se ženě." },
  { sentence: "Potkal jsem KAMARÁDA.", marked: "KAMARÁDA", verb: "potkal", otazka: "koho? co?", zenaVeta: "Potkal jsem ženu." },
  { sentence: "Přemýšleli O ZÁVODĚ.", marked: "O ZÁVODĚ", verb: "přemýšleli", otazka: "o kom? o čem?", zenaVeta: "Přemýšleli o ženě." },
  { sentence: "Rozdělili se S KAMARÁDY.", marked: "S KAMARÁDY", verb: "rozdělili se", otazka: "s kým? s čím?", zenaVeta: "Rozdělili se se ženou." },
  { sentence: "Bál se TMY.", marked: "TMY", verb: "bál se", otazka: "koho? čeho?", zenaVeta: "Bál se ženy." },
  { sentence: "Poděkoval UČITELCE.", marked: "UČITELCE", verb: "poděkoval", otazka: "komu? čemu?", zenaVeta: "Poděkoval ženě." },
  { sentence: "Navštívili MUZEUM.", marked: "MUZEUM", verb: "navštívili", otazka: "koho? co?", zenaVeta: "Navštívili ženu." },
];

function taskL2d(item: VetaPad): PracticeTask | null {
  const spravne = PAD_INFO[item.otazka];
  const distractors: Distractor[] = PADOVE_OTAZKY.filter((o) => o !== item.otazka).map((o) => ({
    value: o,
    why: `Otázka „${o}“ patří ${PAD_INFO[o].kPadu}. Dosaď místo „${item.marked}“ slovo žena: „${item.zenaVeta}“ — tvar „${spravne.zena}“ je ${spravne.pad}, ne ${PAD_INFO[o].pad}.`,
  }));
  return choice(
    `Kterou pádovou otázkou se ptáme na vyznačený předmět „${item.marked}“ ve větě „${item.sentence}“?`,
    item.otazka,
    distractors,
    {
      hints: [
        `Najdi ve větě „${item.sentence}“ sloveso „${item.verb}“ — předmět zjistíš pádovou otázkou, kterou se od tohoto slovesa ptáme (2.–7. pád, nikdy ne 1.).`,
        `Tvar „${item.marked}“ může v několika pádech vypadat stejně. Dosaď místo něj slovo žena, které má v každém pádě jiný tvar (ženy, ženě, ženu, o ženě, se ženou), a podívej se, který tvar do věty sedí — podle něj poznáš pád i otázku.`,
      ],
      explanation: `Dosadíme slovo žena: „${item.zenaVeta}“ Tvar „${spravne.zena}“ je ${spravne.pad}, ptáme se na něj „${item.otazka}“. Sloveso „${item.verb}“ se tedy pojí ${spravne.sPadem} a na předmět „${item.marked}“ se ptáme „${item.otazka}“.`,
    },
  );
}

function poolL2(): Builder[] {
  const out: Builder[] = [];
  const n = Math.max(BANKA_L2A.length, BANKA_L2B.length, BANKA_L2C.length, BANKA_L2D.length);
  for (let i = 0; i < n; i++) {
    if (i < BANKA_L2A.length) out.push(() => taskL2a(BANKA_L2A[i]));
    if (i < BANKA_L2B.length) out.push(() => taskL2b(BANKA_L2B[i]));
    if (i < BANKA_L2C.length) out.push(() => taskL2c(BANKA_L2C[i]));
    if (i < BANKA_L2D.length) out.push(() => taskL2d(BANKA_L2D[i]));
  }
  return out;
}

// ── L3 (a) — doplněk v prototypech ────────────────────────────────────────────
interface VetaDoplnek {
  sentence: string;
  marked: string;
  verb: string;
  /** K čemu se doplněk vztahuje (vedle přísudku). */
  relatesTo: "podmet" | "predmet";
  /** Řídící člen tak, jak stojí ve větě (u nevyjádřeného podmětu zájmeno). */
  ref: string;
  /** „o Janě“, „o tom, kdo se vrátil“ … */
  oKom: string;
  /** Co doplněk o osobě říká: „jaký byl? unavený“, „čím se stala? předsedkyní“. */
  vypoved: string;
  /** U předmětu otázka, kterou ho najdeme: „koho zvolili?“. */
  koho?: string;
  /** Tvar příslovce pro kontrast s PU způsobu (jen tam, kde je přirozený). */
  zpusobTvar?: string;
  /** „UTÍKAT“ — infinitiv, ne příslovce. */
  druhPozn?: string;
  hint1: string;
  explanation: string;
}

const BANKA_L3A: VetaDoplnek[] = [
  {
    sentence: "Vrátil se z tábora UNAVENÝ.", marked: "UNAVENÝ", verb: "vrátil se", relatesTo: "podmet",
    ref: "on", oKom: "o tom, kdo se vrátil", vypoved: "jaký byl? unavený", zpusobTvar: "unaveně",
    hint1: "Rozděl větu na dvě: „Vrátil se z tábora.“ a „Byl přitom unavený.“ Když obě dávají smysl zároveň, slovo říká něco o tom, kdo se vrátil, A zároveň patří ke slovesu.",
    explanation: "„UNAVENÝ“ vypovídá o nevyjádřeném podmětu (on — ten, kdo se vrátil: jaký byl?) a zároveň o ději: vrátil se a byl přitom unavený. Váže se k podmětu i k přísudku, proto je to doplněk.",
  },
  {
    sentence: "Zvolili Janu PŘEDSEDKYNÍ třídy.", marked: "PŘEDSEDKYNÍ", verb: "zvolili", relatesTo: "predmet",
    ref: "Janu", oKom: "o Janě", vypoved: "čím se stala? předsedkyní", koho: "koho zvolili?",
    hint1: "Kdo se stal předsedkyní? Jana — ne ti, kdo volili. Slovo tedy říká něco o Janě (koho zvolili?) A zároveň patří ke slovesu „zvolili“: Janu zvolili, tím se stala předsedkyní.",
    explanation: "„PŘEDSEDKYNÍ“ vypovídá o předmětu „Janu“ (koho zvolili? Janu — čím se stala? předsedkyní) a zároveň o ději „zvolili“. Váže se k předmětu i k přísudku, proto je to doplněk.",
  },
  {
    sentence: "Viděl bratra UTÍKAT k autobusu.", marked: "UTÍKAT", verb: "viděl", relatesTo: "predmet",
    ref: "bratra", oKom: "o bratrovi", vypoved: "co bratr dělal? utíkal", koho: "koho viděl?",
    druhPozn: "„UTÍKAT“ je navíc infinitiv, ne příslovce.",
    hint1: "Kdo utíkal? Bratr — ne ten, kdo se díval. Slovo tedy říká něco o bratrovi (koho viděl?) A zároveň patří ke slovesu „viděl“: viděl bratra a bratr přitom utíkal.",
    explanation: "„UTÍKAT“ vypovídá o předmětu „bratra“ (koho viděl? bratra — co bratr dělal? utíkal) a zároveň patří k ději „viděl“. Váže se k předmětu i k přísudku, proto je to doplněk, i když je vyjádřený infinitivem.",
  },
  {
    sentence: "Ema přišla domů celá PROMOKLÁ.", marked: "PROMOKLÁ", verb: "přišla", relatesTo: "podmet",
    ref: "Ema", oKom: "o Emě", vypoved: "jaká byla? promoklá",
    hint1: "Rozděl větu na dvě: „Ema přišla domů.“ a „Byla přitom celá promoklá.“ Když obě dávají smysl zároveň, slovo říká něco o Emě A zároveň patří ke slovesu.",
    explanation: "„PROMOKLÁ“ vypovídá o podmětu „Ema“ (jaká byla? promoklá) a zároveň o ději: přišla domů a byla přitom promoklá. Váže se k podmětu i k přísudku, proto je to doplněk.",
  },
  {
    sentence: "Chlapci odešli ze třídy SMUTNÍ.", marked: "SMUTNÍ", verb: "odešli", relatesTo: "podmet",
    ref: "chlapci", oKom: "o chlapcích", vypoved: "jací byli? smutní", zpusobTvar: "smutně",
    hint1: "Rozděl větu na dvě: „Chlapci odešli ze třídy.“ a „Byli přitom smutní.“ Když obě dávají smysl zároveň, slovo říká něco o chlapcích A zároveň patří ke slovesu.",
    explanation: "„SMUTNÍ“ vypovídá o podmětu „chlapci“ (jací byli? smutní) a zároveň o ději: odešli a byli přitom smutní. Váže se k podmětu i k přísudku, proto je to doplněk.",
  },
  {
    sentence: "Kamarádi ho zvolili KAPITÁNEM týmu.", marked: "KAPITÁNEM", verb: "zvolili", relatesTo: "predmet",
    ref: "ho", oKom: "o něm", vypoved: "čím se stal? kapitánem", koho: "koho zvolili?",
    hint1: "Kdo se stal kapitánem? Ten, koho zvolili (zájmeno „ho“) — ne kamarádi. Slovo tedy říká něco o něm A zároveň patří ke slovesu „zvolili“: zvolili ho, tím se stal kapitánem.",
    explanation: "„KAPITÁNEM“ vypovídá o předmětu „ho“ (koho zvolili? jeho — čím se stal? kapitánem) a zároveň o ději „zvolili“. Váže se k předmětu i k přísudku, proto je to doplněk.",
  },
];

function taskL3a(item: VetaDoplnek): PracticeTask | null {
  const whyPrivlastek = `Přívlastek rozvíjí jen jedno podstatné jméno a s dějem nesouvisí. „${item.marked}“ ale vypovídá ${item.oKom} (${item.vypoved}) a zároveň patří ke slovesu „${item.verb}“ — váže se ke dvěma členům, proto to přívlastek není.`;
  const whyPuZpusob =
    `Příslovečné určení způsobu rozvíjí jen sloveso a odpovídá na JAK? — o osobě nic neříká.` +
    (item.zpusobTvar ? ` (Byl by to tvar jako „${item.zpusobTvar}“.)` : "") +
    ` „${item.marked}“ ale vypovídá i ${item.oKom} (${item.vypoved}), proto je to doplněk.` +
    (item.druhPozn ? ` ${item.druhPozn}` : "");
  const whyPredmet =
    item.relatesTo === "predmet"
      ? `Předmětem je v této větě „${item.ref}“ (${item.koho}). „${item.marked}“ vypovídá ${item.oKom} (${item.vypoved}) a zároveň patří k ději — váže se ke dvěma členům, kdežto předmět jen ke slovesu.`
      : `Předmět odpovídá na pádovou otázku od slovesa a váže se jen k němu. „${item.marked}“ vypovídá ${item.oKom} (${item.vypoved}) a zároveň patří k ději — váže se ke dvěma členům najednou.`;
  const hint0 =
    item.relatesTo === "podmet"
      ? `Najdi ve větě „${item.sentence}“ podmět a přísudek. Popisuje „${item.marked}“ jen nějaké sousední podstatné jméno, nebo říká něco o podmětu a zároveň o ději?`
      : `Najdi ve větě „${item.sentence}“ přísudek a zeptej se od něj KOHO? — tak najdeš osobu, se kterou se něco děje. Co o ní „${item.marked}“ říká?`;
  return choice(
    `Jakým větným členem je ve větě „${item.sentence}“ vyznačené „${item.marked}“?`,
    "doplněk",
    [
      { value: "přívlastek", why: whyPrivlastek },
      { value: "příslovečné určení způsobu", why: whyPuZpusob },
      { value: "předmět", why: whyPredmet },
    ],
    { hints: [hint0, item.hint1], explanation: item.explanation },
  );
}

// ── L3 (b) — minimální dvojice: přívlastek × doplněk stejným slovem ─────────
interface VetaMinPar {
  sentence: string;
  marked: string;
  correct: "privlastek" | "doplnek";
  /** Podstatné jméno, o kterém slovo vypovídá (u přívlastku ho rozvíjí). */
  governing: string;
  /** „o turistovi“ */
  oKom: string;
  verb: string;
  /** Věta v běžném zápisu (bez vyznačení) a její párová věta. */
  plain: string;
  pair: string;
  /** Otázka od podstatného jména a na stav osoby — ve správném rodě. */
  jaky: string;
  jakyByl: string;
  zpusobTvar?: string;
}

const BANKA_L3B: VetaMinPar[] = [
  { sentence: "UNAVENÝ turista došel k chatě.", marked: "UNAVENÝ", correct: "privlastek", governing: "turista", oKom: "o turistovi", verb: "došel", plain: "Unavený turista došel k chatě.", pair: "Turista došel k chatě unavený.", jaky: "jaký turista?", jakyByl: "jaký byl?" },
  { sentence: "Turista došel k chatě UNAVENÝ.", marked: "UNAVENÝ", correct: "doplnek", governing: "turista", oKom: "o turistovi", verb: "došel", plain: "Turista došel k chatě unavený.", pair: "Unavený turista došel k chatě.", jaky: "jaký turista?", jakyByl: "jaký byl?", zpusobTvar: "unaveně" },
  { sentence: "NEMOCNÁ dívka zůstala doma.", marked: "NEMOCNÁ", correct: "privlastek", governing: "dívka", oKom: "o dívce", verb: "zůstala", plain: "Nemocná dívka zůstala doma.", pair: "Dívka zůstala doma nemocná.", jaky: "jaká dívka?", jakyByl: "jaká byla?" },
  { sentence: "Dívka zůstala doma NEMOCNÁ.", marked: "NEMOCNÁ", correct: "doplnek", governing: "dívka", oKom: "o dívce", verb: "zůstala", plain: "Dívka zůstala doma nemocná.", pair: "Nemocná dívka zůstala doma.", jaky: "jaká dívka?", jakyByl: "jaká byla?" },
];

function taskL3b(item: VetaMinPar): PracticeTask | null {
  const question = `Jakým větným členem je ve větě „${item.sentence}“ vyznačené „${item.marked}“?`;
  if (item.correct === "privlastek") {
    return choice(
      question,
      "přívlastek",
      [
        {
          value: "doplněk",
          why: `„${item.marked}“ tady rozvíjí jen podstatné jméno „${item.governing}“ (stojí přímo u něj a odpovídá na otázku ${item.jaky}) — k ději „${item.verb}“ se nevztahuje. Doplněk by vypovídal zároveň o osobě i o ději, jako ve větě „${item.pair}“`,
        },
        {
          value: "příslovečné určení způsobu",
          why: `„${item.marked}“ rozvíjí podstatné jméno „${item.governing}“ (${item.jaky}), ne sloveso „${item.verb}“. Příslovečné určení způsobu by odpovídalo na otázku JAK ${item.verb}? — to tu „${item.marked}“ neříká.`,
        },
        {
          value: "předmět",
          why: `„${item.marked}“ neodpovídá na pádovou otázku od slovesa „${item.verb}“ — rozvíjí podstatné jméno „${item.governing}“ (${item.jaky}). Předmět by se vázal ke slovesu, ne k podstatnému jménu.`,
        },
      ],
      {
        hints: [
          `Najdi ve větě „${item.sentence}“ podstatné jméno, které stojí hned vedle „${item.marked}“, a zkus, jestli „${item.marked}“ popisuje JEN toto jméno, nebo i to, v jakém stavu děj proběhl.`,
          `Porovnej dvě věty: „${item.plain}“ × „${item.pair}“ — ve které z nich slovo patří jen k podstatnému jménu a ve které zároveň i ke slovesu?`,
        ],
        explanation: `Ve větě „${item.sentence}“ stojí „${item.marked}“ přímo u podstatného jména „${item.governing}“ a rozvíjí jen toto jméno (${item.jaky}). K ději se nevztahuje — proto je to přívlastek shodný.`,
      },
    );
  }
  return choice(
    question,
    "doplněk",
    [
      {
        value: "přívlastek",
        why: `„${item.marked}“ tu nestojí u podstatného jména „${item.governing}“ — vypovídá ${item.oKom} a zároveň o ději „${item.verb}“. Přívlastek by rozvíjel jen podstatné jméno, jako ve větě „${item.pair}“`,
      },
      {
        value: "příslovečné určení způsobu",
        why:
          `Příslovečné určení způsobu rozvíjí jen sloveso a o osobě nic neříká` +
          (item.zpusobTvar ? ` (byl by to tvar jako „${item.zpusobTvar}“)` : "") +
          `. „${item.marked}“ ale vypovídá i ${item.oKom} (${item.jakyByl}), nejen o ději.`,
      },
      {
        value: "předmět",
        why: `Předmět odpovídá na pádovou otázku od slovesa a váže se jen k němu. „${item.marked}“ ale vypovídá ${item.oKom} (${item.jakyByl}) a zároveň o ději „${item.verb}“.`,
      },
    ],
    {
      hints: [
        `Najdi ve větě „${item.sentence}“ podmět a přísudek a zkus, jestli „${item.marked}“ popisuje JEN sousední slovo, nebo jestli patří zároveň k podmětu A k ději.`,
        `Tady „${item.marked}“ nestojí hned vedle žádného podstatného jména — stojí až za slovesem. Porovnej s větou „${item.pair}“ a zkus, ke kterým dvěma členům věty se slovo tady váže zároveň.`,
      ],
      explanation: `„${item.marked}“ tu nestojí u podstatného jména, ale vypovídá zároveň o podmětu „${item.governing}“ i o ději „${item.verb}“ — proto je to doplněk, ne přívlastek.`,
    },
  );
}

// ── L3 (c) — podmět × předmět ve 4. pádě při obráceném slovosledu ───────────
const BANKA_L3C: VetaA[] = [
  {
    sentence: "MÍČ kopl Tomáš.", marked: "MÍČ", member: "predmet", otazka: "Co kopl Tomáš?",
    feedback: { podmet: "„MÍČ“ stojí na začátku jen kvůli slovosledu. Kdo kopl? Tomáš — ten děj koná. Co kopl Tomáš? Míč, ve 4. pádě. Zkus zájmeno: „Tomáš HO kopl“ — tvar HO je 4. pád, ne 1. pád ON." },
    explanation: "Kdo kopl? Tomáš — to je podmět. Co kopl Tomáš? Míč (4. pád) — to je předmět. „MÍČ“ stojí na začátku věty jen kvůli slovosledu.",
  },
  {
    sentence: "Míč kopl TOMÁŠ.", marked: "TOMÁŠ", member: "podmet", otazka: "Kdo kopl míč?",
    feedback: { predmet: "Kdo kopl? Tomáš — ten děj koná, proto je v 1. pádě. Že stojí až na konci věty, nevadí: slovosled je v češtině volný. Zkus zájmeno: „Míč kopl ON“ — tvar ON je 1. pád, ne 4. pád HO." },
    explanation: "Kdo kopl míč? Tomáš — ten děj koná a je v 1. pádě, proto je to podmět. Míč je předmět (co kopl?). Na konci věty stojí Tomáš jen kvůli slovosledu.",
  },
  {
    sentence: "HOUSKU snědla Klára.", marked: "HOUSKU", member: "predmet", otazka: "Co snědla Klára?",
    feedback: { podmet: "„HOUSKU“ stojí na začátku jen kvůli slovosledu. Kdo snědl? Klára — ta děj koná. Co snědla Klára? Housku, ve 4. pádě (1. pád by byl „houska“). Předmět může stát i na začátku věty." },
    explanation: "Kdo snědl housku? Klára — to je podmět. Co snědla Klára? Housku (4. pád, 1. pád by byl „houska“) — to je předmět. Na začátku věty stojí jen kvůli slovosledu.",
  },
  {
    sentence: "Housku snědla KLÁRA.", marked: "KLÁRA", member: "podmet", otazka: "Kdo snědl housku?",
    feedback: { predmet: "Kdo snědl housku? Klára — ta děj koná a je v 1. pádě (4. pád by byl „Kláru“). Na konci věty stojí jen kvůli slovosledu, proto to není předmět." },
    explanation: "Kdo snědl housku? Klára — ta děj koná a je v 1. pádě (ne „Kláru“), proto je to podmět. Na konci věty stojí jen kvůli slovosledu.",
  },
  {
    sentence: "DOPIS napsala babička.", marked: "DOPIS", member: "predmet", otazka: "Co napsala babička?",
    feedback: { podmet: "„DOPIS“ stojí na začátku jen kvůli slovosledu. Kdo napsal? Babička — ta děj koná. Co napsala babička? Dopis, ve 4. pádě. Zkus zájmeno: „Babička HO napsala“ — tvar HO je 4. pád, ne 1. pád ON." },
    explanation: "Kdo napsal dopis? Babička — to je podmět. Co napsala babička? Dopis (4. pád) — to je předmět. „DOPIS“ stojí na začátku věty jen kvůli slovosledu.",
  },
  {
    sentence: "Dopis napsala BABIČKA.", marked: "BABIČKA", member: "podmet", otazka: "Kdo napsal dopis?",
    feedback: { predmet: "Kdo napsal dopis? Babička — ta děj koná a je v 1. pádě (4. pád by byl „babičku“). Na konci věty stojí jen kvůli slovosledu, proto to není předmět." },
    explanation: "Kdo napsal dopis? Babička — ta děj koná a je v 1. pádě (ne „babičku“), proto je to podmět. Na konci věty stojí jen kvůli slovosledu.",
  },
];

function taskL3c(item: VetaA): PracticeTask | null {
  return choice(
    `Jakým větným členem je ve větě „${item.sentence}“ vyznačená část „${item.marked}“?`,
    LABEL[item.member],
    MEMBERS_4.filter((m) => m !== item.member).map((m) => ({
      value: LABEL[m],
      why: item.feedback?.[m] ?? whyNotMember(m, item),
    })),
    {
      hints: [
        `Pozor: ve větě „${item.sentence}“ nemusí na začátku stát ten, kdo děj koná. Najdi přísudek a zeptej se od něj KDO? a potom KOHO? CO?`,
        `Zkus vyznačené „${item.marked}“ nahradit zájmenem: sedí-li ON/ONA (1. pád), slovo děj koná; sedí-li HO/JI (4. pád), děj ho zasahuje. U slov, která mají 1. a 4. pád stejný (míč, dopis), rozhoduje právě tahle zkouška.`,
      ],
      explanation: item.explanation!,
    },
  );
}

// ── L3 (d) — příslovečné určení míry a účelu ─────────────────────────────────
const BANKA_L3D: VetaDruh[] = [
  {
    sentence: "Šel do obchodu PRO CHLEBA.", marked: "PRO CHLEBA", druh: "ucel", q: "Za jakým účelem šel do obchodu?",
    feedback: { pricina: "Příčina odpovídá na PROČ? KVŮLI ČEMU? a říká, co děj způsobilo (třeba „kvůli dešti“). „PRO CHLEBA“ ale říká, jakého CÍLE chce děj dosáhnout: šel, aby koupil chleba. Ptáme se ZA JAKÝM ÚČELEM? — to je účel, ne příčina." },
  },
  {
    sentence: "Poslali ho PRO LÉKAŘE.", marked: "PRO LÉKAŘE", druh: "ucel", q: "Za jakým účelem ho poslali?",
    feedback: { pricina: "Příčina odpovídá na PROČ? KVŮLI ČEMU? a říká, co děj způsobilo (třeba „kvůli nemoci“). „PRO LÉKAŘE“ ale říká, jakého CÍLE chce děj dosáhnout: poslali ho, aby přivedl lékaře. Ptáme se ZA JAKÝM ÚČELEM? — to je účel, ne příčina." },
  },
  { sentence: "Zaplatil DVAKRÁT VÍC.", marked: "DVAKRÁT VÍC", druh: "mira", q: "Kolik zaplatil?" },
  { sentence: "Zboží zdražilo O PĚT KORUN.", marked: "O PĚT KORUN", druh: "mira", q: "O kolik zboží zdražilo?" },
];

function taskL3d(item: VetaDruh): PracticeTask | null {
  const ostatni: Druh[] = item.druh === "ucel" ? ["pricina", "misto", "zpusob"] : ["zpusob", "cas", "misto"];
  const distractors: Distractor[] = ostatni.map((d) => ({ value: LABEL_DRUH[d], why: whyNotDruh(d, item) }));
  return choice(
    `Jaký druh příslovečného určení je ve větě „${item.sentence}“ vyznačené „${item.marked}“?`,
    LABEL_DRUH[item.druh],
    distractors,
    {
      hints: [
        `Najdi ve větě „${item.sentence}“ přísudek a zkus na „${item.marked}“ otázky KDE? JAK? PROČ? ZA JAKÝM ÚČELEM? i KOLIK? nebo O KOLIK? — která dává smysl?`,
        `Pozor na rozdíl mezi PROČ? a ZA JAKÝM ÚČELEM?: příčina říká, co děj způsobilo, účel říká, jakého cíle chce děj dosáhnout. Míra zase říká, kolik nebo jak moc — a JAK? se ptá jen na způsob.`,
      ],
      explanation: `Ptáme se „${item.q}“ — to je otázka na ${LABEL_DRUH[item.druh]} (${OTAZKA_DRUH[item.druh]}).`,
    },
  );
}

// ── L3 (e) — inverze: ve které ze čtyř vět je vyznačený člen doplňkem? ──────
interface InverzniSada {
  lemma: string;
  doplnek: { sentence: string; marked: string; ref: string };
  podmet: { sentence: string; marked: string };
  predmet: { sentence: string; marked: string };
  privlastek: { sentence: string; marked: string; governing: string };
}

const BANKA_L3E: InverzniSada[] = [
  {
    lemma: "vítěz",
    doplnek: { sentence: "Diváci ho vyhlásili VÍTĚZEM závodu.", marked: "VÍTĚZEM", ref: "o předmětu „ho“ (koho vyhlásili?)" },
    podmet: { sentence: "VÍTĚZ závodu dostal medaili.", marked: "VÍTĚZ" },
    predmet: { sentence: "Trenér blahopřál VÍTĚZI závodu.", marked: "VÍTĚZI" },
    privlastek: { sentence: "Radost VÍTĚZE byla veliká.", marked: "VÍTĚZE", governing: "radost" },
  },
  {
    lemma: "kapitánka",
    doplnek: { sentence: "Zvolili Janu KAPITÁNKOU týmu.", marked: "KAPITÁNKOU", ref: "o předmětu „Janu“ (koho zvolili?)" },
    podmet: { sentence: "KAPITÁNKA týmu rozdělila úkoly.", marked: "KAPITÁNKA" },
    predmet: { sentence: "Poslouchali jsme KAPITÁNKU.", marked: "KAPITÁNKU" },
    privlastek: { sentence: "Pokyny KAPITÁNKY byly jasné.", marked: "KAPITÁNKY", governing: "pokyny" },
  },
  {
    lemma: "básník",
    doplnek: { sentence: "Kritici ho nazvali BÁSNÍKEM generace.", marked: "BÁSNÍKEM", ref: "o předmětu „ho“ (koho nazvali?)" },
    podmet: { sentence: "BÁSNÍK generace vydal novou sbírku.", marked: "BÁSNÍK" },
    predmet: { sentence: "Čtenáři obdivovali BÁSNÍKA generace.", marked: "BÁSNÍKA" },
    privlastek: { sentence: "Sbírka BÁSNÍKA generace vyšla loni.", marked: "BÁSNÍKA", governing: "sbírka" },
  },
];

function taskL3e(set: InverzniSada): PracticeTask | null {
  const distractors: Distractor[] = [
    {
      value: set.podmet.sentence,
      why: `V této větě je „${set.podmet.marked}“ podmětem (odpovídá na otázku KDO? a je v 1. pádě) — sám děj koná, nevypovídá o jiném členu věty jako doplněk.`,
    },
    {
      value: set.predmet.sentence,
      why: `V této větě je „${set.predmet.marked}“ předmětem (odpovídá na pádovou otázku od slovesa) — váže se jen ke slovesu, ne zároveň k podmětu nebo předmětu jako doplněk.`,
    },
    {
      value: set.privlastek.sentence,
      why: `V této větě „${set.privlastek.marked}“ rozvíjí jen podstatné jméno „${set.privlastek.governing}“ (odpovídá na otázku ČÍ?) — to je přívlastek neshodný, ne doplněk.`,
    },
  ];
  return choice(`Ve které z vět se slovem „${set.lemma}“ je vyznačený člen doplňkem?`, set.doplnek.sentence, distractors, {
    hints: [
      `Přečti si všechny čtyři věty a v každé najdi podmět a přísudek — všímej si, ke kterým členům se vyznačené slovo váže.`,
      `Doplněk se váže SOUČASNĚ k podmětu nebo předmětu i k přísudku (říká, čím se někdo stal nebo jak byl nazván). V ostatních větách má vyznačené slovo jen jednu roli: podmět, předmět, nebo přívlastek jediného podstatného jména.`,
    ],
    explanation: `Ve větě „${set.doplnek.sentence}“ vypovídá „${set.doplnek.marked}“ ${set.doplnek.ref} a zároveň patří k ději — to je doplněk. V ostatních větách má stejné slovo jinou funkci (podmět, předmět nebo přívlastek).`,
  });
}

function poolL3(): Builder[] {
  const out: Builder[] = [];
  const n = Math.max(BANKA_L3A.length, BANKA_L3B.length, BANKA_L3C.length, BANKA_L3D.length, BANKA_L3E.length);
  for (let i = 0; i < n; i++) {
    if (i < BANKA_L3A.length) out.push(() => taskL3a(BANKA_L3A[i]));
    if (i < BANKA_L3B.length) out.push(() => taskL3b(BANKA_L3B[i]));
    if (i < BANKA_L3C.length) out.push(() => taskL3c(BANKA_L3C[i]));
    if (i < BANKA_L3D.length) out.push(() => taskL3d(BANKA_L3D[i]));
    if (i < BANKA_L3E.length) out.push(() => taskL3e(BANKA_L3E[i]));
  }
  return out;
}

// ── Generátor ────────────────────────────────────────────────────────────────
/** Rotace po bance se nastaví při každém volání — žádný stav mezi voláními. */
function gen(level: number): PracticeTask[] {
  const pool = level <= 1 ? poolL1() : level === 2 ? poolL2() : poolL3();
  let i = 0;
  const dalsi = () => pool[i++ % pool.length]();
  return ruzneUlohy(() => losUlohy(dalsi), 24, pool.length * 3);
}

// ── Topic ────────────────────────────────────────────────────────────────────
export const PREDMET_PRISLOVECNE_URCENI_PRIVLASTEK_DOPLNEK: TopicMetadata[] = [
  {
    id: "g6-cjl-predmet-prislovecne-urceni-privlastek-doplnek-6",
    rvpNodeId: "g6-cjl-jazykova-vychova-skladba-predmet-prislovecne-urceni-privlastek-doplnek",
    title: "Předmět, příslovečné určení, přívlastek a doplněk",
    studentTitle: "Předmět, příslovečné určení, přívlastek a doplněk",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Poznáš, jaký rozvíjející větný člen je ve větě vyznačený.",
    keywords: ["předmět", "příslovečné určení", "přívlastek", "doplněk", "větné členy", "skladba", "pádová otázka"],
    goals: [
      "Určit podle otázky, jakým větným členem je vyznačená část věty: předmět, příslovečné určení, přívlastek nebo doplněk.",
      "Rozlišit druh příslovečného určení (místa, času, způsobu, příčiny) a přívlastek shodný od neshodného.",
      "Rozpoznat doplněk v typických větách a nezaměnit ho s přívlastkem ani s podmětem/předmětem při obráceném slovosledu.",
    ],
    boundaries: [
      "Navazuje na podmět a přísudek z 4. a 5. ročníku (grade-4/cjl/stavbaVetyZakladniSkladebniDvojicePodmetPrisudek.ts, grade-5/cjl/podmetVyjadrenyNevyjadrenyNekolikanasobny.ts) — ty se tu neprocvičují znovu samostatně, jen jako rozcvička/distraktor.",
      "Sporné případy (předmět × PU u vazeb typu „bojovat o titul“, doplněk vyjádřený přechodníkem, několikanásobné větné členy, přívlastek volný) se v tématu nepoužívají ani jako klíč, ani jako distraktor.",
      "Bez souvětí a bez rozboru vedlejších vět — jen jednoduché věty s rozvíjejícími členy.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Najdi přísudek (sloveso) a polož si na vyznačené slovo otázku: KDO/CO? = podmět, pádová otázka od slovesa (kromě 1. pádu) = předmět, KDE/KDY/JAK/PROČ? = příslovečné určení, JAKÝ/KTERÝ/ČÍ? = přívlastek. Když slovo vypovídá zároveň o podmětu nebo předmětu A o ději, je to doplněk.",
      steps: [
        "Najdi ve větě přísudek (sloveso).",
        "Polož si na vyznačené slovo otázku a zkus, která z pěti skupin otázek sedí.",
        "U příslovečného určení rozliš druh (kde/kdy/jak/proč); u přívlastku zkus podstatné jméno vyskloňovat a sleduj, jestli se slovo mění s ním (shodný), nebo ne (neshodný).",
      ],
      commonMistake: "Záměna podmětu a předmětu ve 4. pádě při obráceném slovosledu (Míč kopl Tomáš.), a považování doplňku za přívlastek nebo za příslovečné určení způsobu.",
      example: "„Vrátil se z tábora UNAVENÝ.“ — „unavený“ se váže zároveň k tomu, KDO se vrátil, i k ději (jak se vrátil) — to je doplněk, ne přívlastek.",
    },
  },
];
