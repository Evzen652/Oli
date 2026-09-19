/**
 * Zeměpis 6. ročník — Vesmír, Sluneční soustava, Země jako planeta (select_one).
 *
 * Faktické téma, všechny tři úrovně emitují jen select_one. Každá úroveň má
 * čtyři šablony, které se v gen() střídají rovnoměrně (rotace žije jen uvnitř
 * volání, modul nemá stav).
 *
 *  • L1 — zapamatování: (a) poznávací znak → planeta, (b) pojem → druh tělesa,
 *    (c) základní pohyby Země, (d) hierarchie planeta → soustava → galaxie.
 *  • L2 — použití: (a) pořadí od Slunce (mezi X a Y; dál/blíž než X) z tabulky
 *    PLANETY, (b) kamenné × obří planety, (c) vlastní × odražené světlo,
 *    (d) důsledek pohybu Země (den a noc, rok). Roční doby ne — sousední podtéma.
 *  • L3 — analýza a přenos: (a) neznámé těleso z popisu znaků, (b) dvě podmínky
 *    z tabulky PLANETY najednou (jednoznačnost ověřena výčtem), (c) proč je Země
 *    výjimečná, (d) úvaha o pozorování oblohy.
 *
 * Chybový model: Slunce = planeta / obíhá kolem Země; Měsíc a Venuše svítí
 * vlastním světlem; největší je Saturn (prstence); Mars × Venuše, Merkur ×
 * Venuše; Pluto = planeta; padající hvězda = hvězda; Mléčná dráha = Sluneční
 * soustava.
 *
 * Fakta jen nesporná: pořadí planet, dělení na kamenné a obří, pořadí velikosti
 * (Jupiter > Saturn > Uran > Neptun > Země > Venuše > Mars > Merkur), Merkur a
 * Venuše bez měsíců, otočení asi 24 h, oběh asi 365 dní. Přesné vzdálenosti,
 * počty měsíců ani teploty se jako klíč nepoužívají.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import {
  buildChoiceTask as choice,
  losUlohy,
  ruzneUlohy,
  pick,
  pickN,
  shuffle,
  cis,
  type Distractor,
} from "./_shared";

interface Polozka {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

// ── Tabulka planet ──────────────────────────────────────────────────────────
export interface Planeta {
  /** 1. pád */
  nom: string;
  /** 7. pád (mezi Merkurem a Zemí) */
  ins: string;
  /** pořadí od Slunce, 1–8 */
  od: number;
  /** pořadí velikosti, 1 = největší */
  vel: number;
  skupina: "kamenná" | "obří";
  mesice: boolean;
}

export const PLANETY: Planeta[] = [
  { nom: "Merkur", ins: "Merkurem", od: 1, vel: 8, skupina: "kamenná", mesice: false },
  { nom: "Venuše", ins: "Venuší", od: 2, vel: 6, skupina: "kamenná", mesice: false },
  { nom: "Země", ins: "Zemí", od: 3, vel: 5, skupina: "kamenná", mesice: true },
  { nom: "Mars", ins: "Marsem", od: 4, vel: 7, skupina: "kamenná", mesice: true },
  { nom: "Jupiter", ins: "Jupiterem", od: 5, vel: 1, skupina: "obří", mesice: true },
  { nom: "Saturn", ins: "Saturnem", od: 6, vel: 2, skupina: "obří", mesice: true },
  { nom: "Uran", ins: "Uranem", od: 7, vel: 3, skupina: "obří", mesice: true },
  { nom: "Neptun", ins: "Neptunem", od: 8, vel: 4, skupina: "obří", mesice: true },
];

/** Řadové číslovky v ženském rodě (planeta), index = pořadí od Slunce. */
const RADOVE = ["", "první", "druhá", "třetí", "čtvrtá", "pátá", "šestá", "sedmá", "osmá"];
const PORADI_TEXT = PLANETY.map((p) => p.nom).join(", ");

const planeta = (od: number): Planeta => PLANETY.find((p) => p.od === od)!;
const kamenna = (p: Planeta) => p.skupina === "kamenná";

/** „Merkur, Venuše a Země“ */
function vycet(jmena: string[]): string {
  return jmena.length <= 1 ? jmena.join("") : `${jmena.slice(0, -1).join(", ")} a ${jmena[jmena.length - 1]}`;
}

// ── L1 — ZAPAMATOVÁNÍ ───────────────────────────────────────────────────────
// (a) poznávací znak → planeta
const L1_ZNAK: Polozka[] = [
  {
    q: "Která planeta obíhá ze všech planet nejblíž Slunci?",
    correct: "Merkur",
    distractors: [
      { value: "Venuše", why: "Venuše je až druhá planeta od Slunce. Merkur a Venuše se často pletou, obě obíhají blízko Slunce, ale první v řadě je Merkur." },
      { value: "Země", why: "Země je třetí planeta od Slunce. Před ní obíhají ještě dvě planety." },
      { value: "Mars", why: "Mars je čtvrtá planeta od Slunce, obíhá dál než Země." },
    ],
    hints: [
      "Vybav si řadu planet od Slunce a podívej se na její začátek.",
      "Planety si seřaď podle toho, jak daleko od Slunce obíhají. Ta nejbližší je zároveň nejmenší planetou soustavy a oběhne Slunce nejrychleji.",
    ],
    explanation: "Řada planet od Slunce začíná Merkurem, pak následují Venuše, Země a Mars. Merkur je tedy Slunci ze všech planet nejblíž.",
  },
  {
    q: "Která planeta Sluneční soustavy je největší?",
    correct: "Jupiter",
    distractors: [
      { value: "Saturn", why: "Saturn je až druhý největší. Jeho nápadné prstence o velikosti samotné planety nic neříkají." },
      { value: "Země", why: "Země patří ke kamenným planetám, které jsou mnohem menší než obří planety." },
      { value: "Neptun", why: "Neptun obíhá nejdál od Slunce, ale vzdálenost o velikosti nic neříká. Z obřích planet je Neptun nejmenší." },
    ],
    hints: [
      "Mysli na obří planety a zkus si vybavit, která z nich vyniká velikostí.",
      "Obří planety jsou čtyři a obíhají dál od Slunce než Mars. Pozor, nápadné prstence o velikosti planety nerozhodují.",
    ],
    explanation: "Jupiter je ze všech planet největší. Za ním následují Saturn, Uran a Neptun. Kamenné planety jako Země jsou mnohem menší.",
  },
  {
    q: "Která planeta má ze všech nejvýraznější prstence?",
    correct: "Saturn",
    distractors: [
      { value: "Jupiter", why: "Jupiter je největší planeta, ale jeho prstence jsou slabé a z dálky skoro neviditelné. Velikost a prstence spolu nesouvisí." },
      { value: "Mars", why: "Mars je kamenná planeta a prstence nemá. Proslul spíš svou načervenalou barvou." },
      { value: "Uran", why: "Uran má jen tenké a tmavé prstence, které nejsou nápadné." },
    ],
    hints: [
      "Prstence mají jen obří planety. Vybav si, u které z nich je vidět i malým dalekohledem.",
      "Prstence mají všechny čtyři obří planety, ale jen u jedné jsou jasné a široké. Je to druhá největší planeta, ne ta největší.",
    ],
    explanation: "Saturn má široké a jasné prstence z ledu a úlomků hornin, které jsou vidět i malým dalekohledem. Ostatní obří planety mají prstence jen slabé.",
  },
  {
    q: "Která planeta se pro svou načervenalou barvu nazývá rudá planeta?",
    correct: "Mars",
    distractors: [
      { value: "Venuše", why: "Venuše září jasně bílým světlem a lidé jí říkají Jitřenka. Rudou planetou je jiný soused Země." },
      { value: "Jupiter", why: "Jupiter je obří planeta s pruhy mraků. Jeho velká skvrna je sice načervenalá, ale rudou planetou se nenazývá." },
      { value: "Merkur", why: "Merkur je šedý podobně jako Měsíc a obíhá nejblíž Slunci." },
    ],
    hints: [
      "Vzpomeň si, na kterou planetu posílají lidé průzkumná vozítka.",
      "Načervenalou barvu způsobuje prach s velkým množstvím železa, podobný rzi. Ta planeta je kamenná, menší než Země a lidé už na ni poslali několik vozítek.",
    ],
    explanation: "Mars má povrch pokrytý prachem, který obsahuje hodně železa a podobá se rzi. Proto má načervenalou barvu a říká se mu rudá planeta.",
  },
  {
    q: "Která planeta obíhá jako třetí v pořadí od Slunce?",
    correct: "Země",
    distractors: [
      { value: "Venuše", why: "Venuše je druhá planeta od Slunce. Třetí je až planeta za ní." },
      { value: "Mars", why: "Mars je čtvrtá planeta od Slunce, třetí obíhá těsně před ním." },
      { value: "Merkur", why: "Merkur je první planeta od Slunce, ne třetí." },
    ],
    hints: [
      "Počítej planety od Slunce jednu po druhé, dokud nedojdeš ke třetí.",
      "Začni planetou nejblíž Slunci a posouvej se směrem ven. U třetí planety se zastav a vzpomeň si, co o ní víš.",
    ],
    explanation: "Pořadí od Slunce je Merkur, Venuše, Země a Mars. Třetí v pořadí je tedy Země, naše planeta.",
  },
  {
    q: "Která planeta obíhá ze všech planet nejdál od Slunce?",
    correct: "Neptun",
    distractors: [
      { value: "Pluto", why: "Pluto obíhá většinou ještě dál, ale astronomové ho přeřadili mezi trpasličí planety. Mezi planety už nepatří." },
      { value: "Uran", why: "Uran je sedmá planeta od Slunce. Za ním obíhá ještě jedna planeta." },
      { value: "Saturn", why: "Saturn je šestá planeta od Slunce, za ním obíhají ještě dvě planety." },
    ],
    hints: [
      "Vybav si řadu planet od Slunce a podívej se na její konec.",
      "Poslední planeta řady je modrá obří planeta. Pozor na těleso, které se dřív považovalo za devátou planetu – dnes mezi planety nepatří.",
    ],
    explanation: "Řada planet od Slunce končí Uranem a Neptunem. Neptun je osmá a poslední planeta. Pluto, které obíhá většinou ještě dál, je trpasličí planeta.",
  },
  {
    q: "Která planeta je nejbližší soused Země na straně směrem ke Slunci?",
    correct: "Venuše",
    distractors: [
      { value: "Mars", why: "Mars je soused Země, ale na opačné straně – obíhá dál od Slunce než Země." },
      { value: "Merkur", why: "Merkur obíhá ještě blíž ke Slunci a mezi ním a Zemí je další planeta." },
      { value: "Jupiter", why: "Jupiter obíhá až za Marsem, daleko od Slunce." },
    ],
    hints: [
      "Najdi v řadě planet Zemi a podívej se, která planeta je těsně před ní.",
      "Země je třetí v řadě od Slunce. Hledáš planetu, která je v řadě o jedno místo blíž Slunci, ne úplně první.",
    ],
    explanation: "Pořadí od Slunce je Merkur, Venuše, Země. Mezi Zemí a Sluncem je Zemi nejblíž Venuše, Merkur obíhá ještě blíž Slunci.",
  },
  {
    q: "Která planeta Sluneční soustavy je nejmenší?",
    correct: "Merkur",
    distractors: [
      { value: "Mars", why: "Mars je menší než Země, ale nejmenší planeta to není. Ještě menší je jiná kamenná planeta." },
      { value: "Venuše", why: "Venuše je skoro stejně velká jako Země. Nejmenší planeta je mnohem menší." },
      { value: "Neptun", why: "Neptun je sice nejdál od Slunce, ale je to obří planeta. Vzdálenost o velikosti nic neříká." },
    ],
    hints: [
      "Mysli jen na kamenné planety – obří planety to být nemohou.",
      "Kamenné planety jsou čtyři. Země a Venuše jsou si velikostí podobné, zbylé dvě jsou menší. Z těch dvou vyber tu menší.",
    ],
    explanation: "Merkur je nejmenší planeta Sluneční soustavy. Mars je větší než Merkur, Venuše a Země jsou ještě větší a obří planety jsou největší.",
  },
];

// (b) pojem → druh tělesa
const L1_DRUH: Polozka[] = [
  {
    q: "Jaký druh tělesa je Slunce?",
    correct: "Hvězda",
    distractors: [
      { value: "Planeta", why: "Slunce není planeta. Svítí vlastním světlem a Země i ostatní planety obíhají kolem něj." },
      { value: "Galaxie", why: "Galaxie je obrovská soustava miliard hvězd. Slunce je jen jedna z nich." },
      { value: "Přirozená družice", why: "Přirozená družice obíhá kolem planety a sama nesvítí. Slunce svítí samo a nic takového neobíhá." },
    ],
    hints: [
      "Zamysli se, jestli Slunce světlo samo vyrábí, nebo ho jen odráží.",
      "Těleso, které samo vyrábí světlo a teplo, je koule žhavých plynů. Takových těles je na noční obloze vidět spousta, jen jsou mnohem dál.",
    ],
    explanation: "Slunce je hvězda: obrovská koule žhavých plynů, která sama vyzařuje světlo a teplo. Země a ostatní planety kolem něj obíhají.",
  },
  {
    q: "Jaký druh tělesa je Měsíc?",
    correct: "Přirozená družice",
    distractors: [
      { value: "Planeta", why: "Měsíc není planeta. Neobíhá samostatně kolem Slunce, ale kolem Země." },
      { value: "Hvězda", why: "Měsíc sice v noci září, ale sám nesvítí. Jen odráží světlo Slunce, takže hvězdou není." },
      { value: "Trpasličí planeta", why: "Trpasličí planeta obíhá přímo kolem Slunce, kdežto Měsíc obíhá kolem Země." },
    ],
    hints: [
      "Zamysli se, kolem kterého tělesa Měsíc obíhá.",
      "Těleso, které neobíhá samo kolem Slunce, ale kolem planety, má zvláštní označení. Podobná tělesa umějí lidé vyrobit a vypustit do vesmíru.",
    ],
    explanation: "Měsíc obíhá kolem Země a sám nesvítí. Je to její přirozená družice – přirozená proto, že ji nevyrobili lidé.",
  },
  {
    q: "Jaký druh tělesa je Pluto?",
    correct: "Trpasličí planeta",
    distractors: [
      { value: "Planeta", why: "Pluto se dřív počítalo jako devátá planeta, ale astronomové ho přeřadili mezi trpasličí planety. Planet je dnes osm." },
      { value: "Kometa", why: "Pluto je sice ledové, ale je kulaté, obíhá stále daleko od Slunce a ohon mu nenarůstá." },
      { value: "Přirozená družice", why: "Pluto neobíhá kolem žádné planety, obíhá přímo kolem Slunce." },
    ],
    hints: [
      "Vzpomeň si, kolik planet má dnes Sluneční soustava a jestli mezi ně patří i Pluto.",
      "Pluto obíhá kolem Slunce a je kulaté, ale na své dráze se dělí o místo s mnoha jinými ledovými tělesy. Proto ho astronomové zařadili do zvláštní skupiny.",
    ],
    explanation: "Pluto obíhá kolem Slunce a je kulaté, ale svou dráhu nevyčistilo od ostatních těles. Proto ho astronomové řadí mezi trpasličí planety a planet je dnes osm.",
  },
  {
    q: "Jaký útvar je Mléčná dráha?",
    correct: "Galaxie",
    distractors: [
      { value: "Sluneční soustava", why: "Sluneční soustava je jen Slunce a tělesa kolem něj. Mléčná dráha obsahuje miliardy hvězd a Sluneční soustava je jen její malá část." },
      { value: "Souhvězdí", why: "Souhvězdí je skupina několika jasných hvězd na obloze. Mléčná dráha je celá soustava miliard hvězd." },
      { value: "Kometa", why: "Mléčná dráha připomíná zářící pruh, ale není to ohon komety. Je to pohled na naši galaxii zevnitř." },
    ],
    hints: [
      "Mléčnou dráhu vidíš za tmavé noci jako světlý pruh přes oblohu. Z čeho se asi skládá?",
      "Světlý pruh tvoří obrovské množství vzdálených hvězd. Soustava miliard hvězd je mnohem větší než Sluneční soustava a má vlastní označení.",
    ],
    explanation: "Mléčná dráha je naše galaxie – obrovská soustava miliard hvězd. Slunce je jedna z nich a Sluneční soustava tvoří jen malou část galaxie.",
  },
  {
    q: "Jaký druh tělesa je Venuše, které lidé říkají Jitřenka?",
    correct: "Planeta",
    distractors: [
      { value: "Hvězda", why: "Jitřenka sice ráno jasně září, ale nesvítí vlastním světlem. Venuše jen odráží světlo Slunce." },
      { value: "Kometa", why: "Kometa má ohon a na obloze se objeví jen občas. Venuše je vidět často a ohon nemá." },
      { value: "Přirozená družice", why: "Venuše neobíhá kolem žádné planety, obíhá přímo kolem Slunce." },
    ],
    hints: [
      "Jitřenka je vidět ráno jako jasný bod. Zamysli se, jestli svítí sama, nebo jen odráží světlo.",
      "Venuše obíhá kolem Slunce stejně jako Země a sama světlo nevyrábí. Jasně září jen proto, že je blízko nás a odráží hodně slunečního světla.",
    ],
    explanation: "Venuše je druhá planeta od Slunce. Jitřenka se jí říká proto, že je ráno vidět jako velmi jasný bod, svítí ale jen odraženým slunečním světlem.",
  },
];

// (c) základní pohyby Země
const H24 = pad(24, "HODINA");
const H12 = pad(12, "HODINA");
const D365 = pad(365, "DEN");
const D30 = pad(30, "DEN");
const D24 = pad(24, "DEN");

const L1_POHYB: Polozka[] = [
  {
    q: "Jak dlouho trvá, než se Země jednou otočí kolem své osy?",
    correct: `Asi ${H24}`,
    distractors: [
      { value: `Asi ${D365}`, why: "Tolik trvá oběh Země kolem Slunce, tedy rok. Otočení kolem osy je mnohem kratší." },
      { value: `Asi ${D30}`, why: "Přibližně tolik trvá, než Měsíc projde všemi fázemi. Země se kolem osy otočí mnohem rychleji." },
      { value: `Asi ${H12}`, why: "Tolik trvá přibližně jen den nebo jen noc. Celé otočení zahrnuje den i noc dohromady." },
    ],
    hints: [
      "Jedno otočení Země kolem osy odpovídá jednomu dni a jedné noci dohromady.",
      "Za jedno otočení se na každém místě vystřídá den i noc. Vzpomeň si, jak dlouho trvá celý jeden den i s nocí.",
    ],
    explanation: `Země se kolem své osy otočí asi za ${H24}. Za tu dobu se na každém místě vystřídá den a noc.`,
  },
  {
    q: "Jak dlouho trvá Zemi jeden oběh kolem Slunce?",
    correct: `Asi ${D365}`,
    distractors: [
      { value: `Asi ${H24}`, why: "Tolik trvá jedno otočení Země kolem její osy, ne oběh kolem Slunce." },
      { value: `Asi ${D30}`, why: "Přibližně tolik trvá jeden měsíc v kalendáři. Oběh Země kolem Slunce trvá celý rok." },
      { value: `Asi ${D24}`, why: `Číslo ${cis(24)} patří k otočení kolem osy, které trvá ${H24}. Oběh kolem Slunce trvá mnohem déle.` },
    ],
    hints: [
      "Jeden oběh Země kolem Slunce odpovídá jednomu kalendářnímu roku.",
      "Za jeden oběh kolem Slunce se vystřídají všechna roční období. Vzpomeň si, kolik dní má obyčejný rok.",
    ],
    explanation: `Země oběhne Slunce asi za ${D365}. Tato doba je jeden rok.`,
  },
  {
    q: "Kolem kterého tělesa obíhá Země?",
    correct: "Kolem Slunce",
    distractors: [
      { value: "Kolem Měsíce", why: "Je to naopak: Měsíc obíhá kolem Země." },
      { value: "Kolem Polárky", why: "Polárka je vzdálená hvězda, která se na obloze zdánlivě nehýbe. Země kolem ní neobíhá." },
      { value: "Kolem Jupiteru", why: "Jupiter je jiná planeta. Planety neobíhají jedna kolem druhé, ale všechny kolem stejné hvězdy." },
    ],
    hints: [
      "Zamysli se, které těleso je středem soustavy, do které Země patří.",
      "Soustava, ve které žijeme, je pojmenovaná podle tělesa v jejím středu. Kolem něj obíhají všechny planety včetně naší.",
    ],
    explanation: "Země obíhá kolem Slunce stejně jako ostatní planety. Kolem Země obíhá Měsíc.",
  },
  {
    q: "Jak se nazývá pomyslná přímka, kolem které se Země otáčí?",
    correct: "Zemská osa",
    distractors: [
      { value: "Rovník", why: "Rovník je pomyslná čára kolem Země uprostřed mezi póly. Země se otáčí kolem přímky, která prochází póly." },
      { value: "Nultý poledník", why: "Nultý poledník je čára na povrchu Země od pólu k pólu. Země se otáčí kolem přímky, která vede jejím středem." },
      { value: "Oběžná dráha", why: "Oběžná dráha je cesta, po které Země obíhá kolem Slunce, ne přímka, kolem které se otáčí." },
    ],
    hints: [
      "Představ si káču: točí se kolem pomyslné přímky, která jí prochází středem.",
      "Ta pomyslná přímka prochází středem Země a na povrchu vychází na severním a jižním pólu.",
    ],
    explanation: "Země se otáčí kolem zemské osy. Je to pomyslná přímka, která prochází středem Země a oběma póly.",
  },
];

// (d) hierarchie
const L1_HIERARCHIE: Polozka[] = [
  {
    q: "Co je z nabízených možností největší?",
    correct: "Galaxie Mléčná dráha",
    distractors: [
      { value: "Sluneční soustava", why: "Sluneční soustava je jen malá část galaxie Mléčná dráha." },
      { value: "Hvězda Slunce", why: "Slunce je jen jedna z miliard hvězd v galaxii a je menší než celá Sluneční soustava." },
      { value: "Planeta Jupiter", why: "Jupiter je největší planeta, ale je menší než Slunce a je jen částí Sluneční soustavy." },
    ],
    hints: [
      "Zamysli se, co v čem leží: planeta, hvězda, soustava a galaxie.",
      "Planeta obíhá kolem hvězdy, hvězda s planetami tvoří soustavu a mnoho soustav a hvězd dohromady tvoří ještě větší celek.",
    ],
    explanation: "Jupiter je součástí Sluneční soustavy, v jejímž středu je Slunce. Sluneční soustava leží v galaxii Mléčná dráha, která je ze všech možností největší.",
  },
  {
    q: "Co je z nabízených možností nejmenší?",
    correct: "Planeta Země",
    distractors: [
      { value: "Hvězda Slunce", why: "Slunce se nám zdá malé jen proto, že je daleko. Ve skutečnosti je mnohem větší než Země." },
      { value: "Sluneční soustava", why: "Sluneční soustava obsahuje Slunce i všechny planety, je tedy větší než kterékoli z těchto těles." },
      { value: "Galaxie Mléčná dráha", why: "Galaxie obsahuje miliardy hvězd, je ze všech nabízených možností největší." },
    ],
    hints: [
      "Seřaď si možnosti podle toho, co v čem leží.",
      "Nenech se zmást tím, jak velká se tělesa zdají na obloze. Vzdálené těleso vypadá malé, i když je obrovské.",
    ],
    explanation: "Země je jedna z planet, které obíhají kolem Slunce. Slunce je mnohem větší než Země, Sluneční soustava obsahuje Slunce i planety a galaxie Mléčná dráha je největší.",
  },
  {
    q: "Co z nabízených možností obsahuje celou Sluneční soustavu?",
    correct: "Galaxie Mléčná dráha",
    distractors: [
      { value: "Souhvězdí Velká medvědice", why: "Souhvězdí je jen skupina hvězd, které na obloze vidíme blízko sebe. Sluneční soustava v žádném souhvězdí neleží." },
      { value: "Hvězda Slunce", why: "Je to naopak: Slunce je součástí Sluneční soustavy, leží v jejím středu." },
      { value: "Planeta Jupiter", why: "Jupiter je jen jedna z planet, které obíhají uvnitř Sluneční soustavy." },
    ],
    hints: [
      "Hledáš celek, který je větší než Slunce se všemi planetami dohromady.",
      "Sluneční soustava je jedna z mnoha soustav, které spolu s miliardami hvězd tvoří obrovský celek. Na noční obloze ho vidíš jako světlý pruh.",
    ],
    explanation: "Sluneční soustava leží v galaxii Mléčná dráha. Slunce i Jupiter jsou naopak součástí Sluneční soustavy a souhvězdí je jen skupina hvězd na obloze.",
  },
  {
    q: "Co z nabízených možností patří do Sluneční soustavy?",
    correct: "Planeta Neptun",
    distractors: [
      { value: "Hvězda Polárka", why: "Polárka je jiná, velmi vzdálená hvězda. Do Sluneční soustavy patří jen Slunce a tělesa, která kolem něj obíhají." },
      { value: "Souhvězdí Velká medvědice", why: "Souhvězdí tvoří vzdálené hvězdy, které leží daleko za Sluneční soustavou." },
      { value: "Galaxie Mléčná dráha", why: "Je to naopak: Sluneční soustava je malá část galaxie Mléčná dráha." },
    ],
    hints: [
      "Do Sluneční soustavy patří jen Slunce a tělesa, která kolem něj obíhají.",
      "Všechno, co leží mimo Sluneční soustavu, je od nás nesmírně daleko – i nejbližší hvězdy. Vyber těleso, které obíhá kolem Slunce.",
    ],
    explanation: "Neptun je osmá planeta, obíhá kolem Slunce, a proto patří do Sluneční soustavy. Polárka a hvězdy souhvězdí leží daleko za ní a galaxie Sluneční soustavu naopak obsahuje.",
  },
];

// ── L2 — POUŽITÍ ────────────────────────────────────────────────────────────
// (a) pořadí od Slunce z tabulky
function l2Mezi(): PracticeTask | null {
  const i = pick([1, 2, 3, 4, 5, 6]);
  const X = planeta(i), K = planeta(i + 1), Y = planeta(i + 2);
  const blizke = PLANETY.filter((p) => p.od < i || p.od > i + 2)
    .sort((a, b) => Math.abs(a.od - K.od) - Math.abs(b.od - K.od))
    .slice(0, 4);
  const d = pickN(blizke, 3).map<Distractor>((p) => ({
    value: p.nom,
    why: p.od < i
      ? `${p.nom} je ${RADOVE[p.od]} planeta od Slunce. Obíhá tedy blíž ke Slunci než ${X.nom}, ne mezi ${X.ins} a ${Y.ins}.`
      : `${p.nom} je ${RADOVE[p.od]} planeta od Slunce. Obíhá tedy dál od Slunce než ${Y.nom}, ne mezi ${X.ins} a ${Y.ins}.`,
  }));
  return choice(`Která planeta obíhá mezi ${X.ins} a ${Y.ins}?`, K.nom, d, {
    hints: [
      `Vybav si pořadí planet od Slunce a najdi v něm, kde leží ${X.nom}.`,
      `${X.nom} je ${RADOVE[i]} planeta od Slunce a ${Y.nom} ${RADOVE[i + 2]}. Hledaná planeta leží v řadě přesně mezi nimi, u každé nabízené si proto vybav, kolikátá od Slunce je.`,
    ],
    explanation: `Pořadí planet od Slunce: ${PORADI_TEXT}. ${X.nom} je ${RADOVE[i]} a ${Y.nom} ${RADOVE[i + 2]} planeta, mezi nimi obíhá ${K.nom} jako ${RADOVE[i + 1]} planeta.`,
  });
}

function l2DalBliz(): PracticeTask | null {
  const dal = pick([true, false]);
  const X = pick(PLANETY.filter((p) => (dal ? p.od >= 4 && p.od <= 7 : p.od >= 2 && p.od <= 5)));
  const K = pick(PLANETY.filter((p) => (dal ? p.od > X.od : p.od < X.od)));
  const spatne = PLANETY.filter((p) => (dal ? p.od < X.od : p.od > X.od));
  const d = pickN(spatne, 3).map<Distractor>((p) => ({
    value: p.nom,
    why: `${p.nom} je ${RADOVE[p.od]} planeta od Slunce. Obíhá tedy ${dal ? "blíž ke Slunci" : "dál od Slunce"} než ${X.nom}.`,
  }));
  const smer = dal ? "dál od Slunce" : "blíž ke Slunci";
  return choice(`Která z nabízených planet obíhá ${smer} než ${X.nom}?`, K.nom, d, {
    hints: [
      `Urči nejdřív, kolikátá planeta od Slunce je ${X.nom}.`,
      `${X.nom} je ${RADOVE[X.od]} planeta od Slunce. Hledáš planetu, která je v řadě ${dal ? "za ní, tedy s vyšším" : "před ní, tedy s nižším"} pořadím. U každé nabízené planety si pořadí vybav.`,
    ],
    explanation: `Pořadí planet od Slunce: ${PORADI_TEXT}. ${X.nom} je ${RADOVE[X.od]} planeta a z nabízených obíhá ${smer} jen ${K.nom}, ${RADOVE[K.od]} planeta v pořadí.`,
  });
}

const l2Poradi = (): PracticeTask | null => (pick([true, false]) ? l2Mezi() : l2DalBliz());

// (b) kamenné × obří
const FB_SKUPINA = (p: Planeta): string =>
  kamenna(p)
    ? `${p.nom} je kamenná planeta. Kamenné jsou čtyři planety nejblíž Slunci a mají pevný povrch.`
    : `${p.nom} je obří planeta. Obří planety obíhají daleko od Slunce, jsou mnohem větší než Země a nemají pevný povrch.`;

const SKUPINA_VARIANTY: { q: string; hledana: Planeta["skupina"]; hints: [string, string] }[] = [
  {
    q: "Která z nabízených planet NENÍ kamenná?",
    hledana: "obří",
    hints: [
      "Rozděl si planety na čtyři blízko Slunce a čtyři daleko od něj.",
      "Kamenné planety mají pevný povrch a obíhají nejblíž Slunci. Najdi mezi nabízenými tu, která k nim nepatří, protože obíhá až za Marsem.",
    ],
  },
  {
    q: "Která z nabízených planet patří k obřím planetám?",
    hledana: "obří",
    hints: [
      "Obří planety obíhají daleko od Slunce, za Marsem.",
      "Planety se dělí na dvě skupiny: menší kamenné blízko Slunce a velké bez pevného povrchu daleko od něj. U každé nabízené planety si vybav, kde obíhá.",
    ],
  },
  {
    q: "Která z nabízených planet NENÍ obří?",
    hledana: "kamenná",
    hints: [
      "Vzpomeň si, které čtyři planety obíhají nejblíž Slunci.",
      "Obří planety jsou velké a nemají pevný povrch. Najdi mezi nabízenými tu, která je menší a má pevný povrch, protože obíhá blízko Slunce.",
    ],
  },
  {
    q: "Která z nabízených planet patří ke kamenným planetám?",
    hledana: "kamenná",
    hints: [
      "Kamenné planety mají pevný povrch a obíhají blízko Slunce.",
      "Planety se dělí na čtyři kamenné blízko Slunce a čtyři obří daleko od něj. Hledej mezi nabízenými tu, která obíhá blízko Slunce a má pevný povrch.",
    ],
  },
];

function l2Skupina(): PracticeTask | null {
  const v = pick(SKUPINA_VARIANTY);
  const K = pick(PLANETY.filter((p) => p.skupina === v.hledana));
  const d = pickN(PLANETY.filter((p) => p.skupina !== v.hledana), 3).map<Distractor>((p) => ({ value: p.nom, why: FB_SKUPINA(p) }));
  return choice(v.q, K.nom, d, {
    hints: v.hints,
    explanation: `Kamenné planety jsou Merkur, Venuše, Země a Mars. Obří planety jsou Jupiter, Saturn, Uran a Neptun. ${K.nom} je ${K.skupina} planeta, ostatní nabízené patří do druhé skupiny.`,
  });
}

// (c) vlastní × odražené světlo
/** Krátké představení hvězdy do vysvětlení — jméno samo žákovi nic neřekne. */
const HVEZDA_POPIS: Record<string, string> = {
  Slunce: "Slunce je hvězda, naše nejbližší",
  Polárka: "Polárka je hvězda, kterou najdeme na severní obloze",
  Sirius: "Sirius je hvězda – nejjasnější, jakou na noční obloze vidíme",
};

const HVEZDY: Distractor[] = [
  { value: "Slunce", why: "Slunce je hvězda. Světlo samo vyrábí, nic neodráží." },
  { value: "Polárka", why: "Polárka je hvězda, a proto svítí vlastním světlem." },
  { value: "Sirius", why: "Sirius je hvězda, nejjasnější na noční obloze. Svítí vlastním světlem." },
];
/**
 * Pozor na strategii „neznámé jméno = správně“: mezi tělesa, která nesvítí,
 * patří i dvě jména, která žák nezná (Ceres, Fobos). Samotná neznalost jména
 * tedy k odpovědi nestačí, rozhodnout musí druh tělesa.
 */
const NESVITI: Distractor[] = [
  { value: "Měsíc", why: "Měsíc sám nesvítí, jen odráží světlo Slunce. Proto ho vidíme i v noci." },
  { value: "Venuše", why: "Venuše je planeta. Září jasně, ale jen odráží sluneční světlo – vlastním světlem svítí jen hvězdy." },
  { value: "Jupiter", why: "Jupiter je planeta. Na obloze jasně září, ale jen proto, že odráží světlo Slunce." },
  { value: "Mars", why: "Mars je planeta. Jeho načervenalé světlo je odražené sluneční světlo, ne vlastní." },
  { value: "Halleyova kometa", why: "Kometa sama světlo nevyrábí. Září jen díky Slunci, které ji osvětluje a zahřívá." },
  { value: "Ceres", why: "Ceres je největší planetka. Obíhá kolem Slunce mezi Marsem a Jupiterem a světlo jen odráží – hvězda to není." },
  { value: "Fobos", why: "Fobos je jeden ze dvou malých měsíců Marsu. Obíhá kolem planety a světlo jen odráží – hvězda to není." },
];

function l2Svetlo(): PracticeTask | null {
  const typ = pick([0, 1, 2]);
  if (typ < 2) {
    const K = pick(HVEZDY);
    const d = pickN(NESVITI, 3);
    const q = typ === 0
      ? "Které z nabízených těles svítí vlastním světlem?"
      : "Které z nabízených těles samo vyrábí světlo, které k nám doletí?";
    const hints: [string, string] = typ === 0
      ? [
        "Vzpomeň si, které těleso vyrábí světlo samo a které ho jen odráží.",
        "Vlastním světlem svítí jen hvězdy. Planety, měsíce i komety září jen proto, že na ně dopadá světlo naší hvězdy.",
      ]
      : [
        "Rozliš tělesa, která světlo vyrábějí, od těch, která ho jen odrážejí jako zrcadlo.",
        "Světlo vyrábí jen obrovské koule žhavých plynů. Všechno ostatní na obloze, co jasně září, jen vrací světlo, které na to dopadá.",
      ];
    return choice(q, K.value, d, {
      hints,
      explanation: `${HVEZDA_POPIS[K.value]}, a proto svítí vlastním světlem. ${vycet(d.map((x) => x.value))} samy nesvítí, jen odrážejí sluneční světlo.`,
    });
  }
  const K = pick(NESVITI.slice(0, 4));
  return choice("Které z nabízených těles samo nesvítí a vidíme ho jen díky odraženému světlu?", K.value, HVEZDY, {
    hints: [
      "Najdi mezi nabízenými tělesy to jediné, které není hvězda.",
      "Hvězdy světlo vyrábějí samy. Všechno ostatní ve Sluneční soustavě jen vrací světlo, které na ně dopadá ze Slunce.",
    ],
    explanation: `${K.value} nesvítí vlastním světlem, jen odráží světlo Slunce. Slunce, Polárka i Sirius jsou hvězdy a svítí samy.`,
  });
}

// (d) důsledek pohybu Země
const L2_POHYB: Polozka[] = [
  {
    q: "Co způsobuje, že se na Zemi střídá den a noc?",
    correct: "Pohyb Země kolem vlastní osy",
    distractors: [
      { value: "Pohyb Slunce kolem Země", why: "Slunce kolem Země neobíhá. Zdá se nám, že se pohybuje po obloze, ale ve skutečnosti se otáčí Země." },
      { value: "Pohyb Země kolem Slunce", why: "Oběh Země kolem Slunce trvá celý rok, ne den. Den a noc střídá otáčení Země." },
      { value: "Pohyb Měsíce kolem Země", why: "Měsíc Slunce každý den nezakrývá. Noc nastává, když se naše místo otočí od Slunce." },
    ],
    hints: [
      "Zamysli se, který pohyb Země trvá jeden den a jednu noc dohromady.",
      "Slunce vždy osvětluje jen polovinu Země. Místo, kde stojíš, se dostává střídavě na osvětlenou a na odvrácenou stranu – který pohyb to způsobuje?",
    ],
    explanation: `Země se otočí kolem vlastní osy asi za ${H24}. Místo, které je právě otočené ke Slunci, má den, a místo na odvrácené straně má noc.`,
  },
  {
    q: "Který pohyb Země odpovídá délce jednoho roku?",
    correct: "Pohyb Země kolem Slunce",
    distractors: [
      { value: "Pohyb Země kolem vlastní osy", why: `Otočení kolem osy trvá jen asi ${H24}, to je jeden den.` },
      { value: "Pohyb Měsíce kolem Země", why: "Měsíc oběhne Zemi přibližně za měsíc. Rok je mnohem delší." },
      { value: "Pohyb Slunce kolem Země", why: "Slunce kolem Země neobíhá, je to naopak." },
    ],
    hints: [
      "Zamysli se, který pohyb Země trvá nejdéle.",
      `Rok má asi ${D365}. Porovnej to s tím, jak dlouho trvá otočení Země kolem osy.`,
    ],
    explanation: `Země oběhne Slunce asi za ${D365}, a to je jeden rok. Otočení kolem osy trvá jen asi ${H24}, tedy jeden den.`,
  },
  {
    q: "Proč Slunce ráno vychází na východě a večer zapadá na západě?",
    correct: "Protože se Země otáčí kolem své osy",
    distractors: [
      { value: "Protože Slunce obíhá kolem Země", why: "Pohyb Slunce po obloze je jen zdánlivý. Kolem Země Slunce neobíhá, otáčí se Země." },
      { value: "Protože Země obíhá kolem Slunce", why: "Oběh kolem Slunce trvá celý rok. Východ a západ Slunce se opakuje každý den a způsobuje ho otáčení Země." },
      { value: "Protože Měsíc večer zakrývá Slunce", why: "Měsíc zakrývá Slunce jen výjimečně, při zatmění. Západ Slunce nastává každý den z jiného důvodu." },
    ],
    hints: [
      "Zamysli se, jestli se po obloze opravdu pohybuje Slunce, nebo se hýbeme my.",
      "Když jedeš vlakem, zdá se ti, že stromy ubíhají dozadu. Podobně vzniká i zdánlivý pohyb Slunce po obloze. Který pohyb Země trvá jeden den?",
    ],
    explanation: "Země se otáčí od západu na východ. Proto se nám zdá, že Slunce vychází na východě, putuje po obloze a zapadá na západě. Ve skutečnosti se pohybuje Země.",
  },
  {
    q: "Na jedné polovině Země je den a na druhé noc. Čím to je?",
    correct: "Slunce osvětluje vždy jen polovinu zeměkoule",
    distractors: [
      { value: "Slunce v noci na chvíli přestává svítit", why: "Slunce svítí nepřetržitě. Noc je tam, kam jeho světlo zrovna nedopadá." },
      { value: "Měsíc zakrývá druhou polovinu zeměkoule", why: "Měsíc je mnohem menší než Země a polovinu planety zakrýt nemůže." },
      { value: "Na noční straně je Slunce skryté za mraky", why: "Mraky noc nezpůsobují. I bez mraků je na odvrácené straně Země tma." },
    ],
    hints: [
      "Představ si míč, na který svítí baterka ze strany. Jak velká část míče je osvětlená?",
      "Země je koule a Slunce na ni svítí jen z jedné strany. Na odvrácenou stranu světlo nedopadá, dokud se k němu otáčením nepřesune.",
    ],
    explanation: "Země je koule a Slunce na ni svítí jen z jedné strany. Osvětlená polovina má den, odvrácená polovina noc. Otáčením Země se strany střídají.",
  },
  {
    q: "Za jak dlouho se na jednom místě vystřídá den i noc?",
    correct: `Asi za ${H24}`,
    distractors: [
      { value: `Asi za ${H12}`, why: "Tolik trvá přibližně jen den nebo jen noc, ne obojí dohromady." },
      { value: `Asi za ${D365}`, why: "To je doba oběhu Země kolem Slunce, tedy rok." },
      { value: `Asi za ${D30}`, why: "Přibližně tolik trvá jeden měsíc. Den a noc se střídají mnohem rychleji." },
    ],
    hints: [
      "Den a noc vystřídá jedno otočení Země kolem osy.",
      "Zamysli se, jak dlouho trvá jedno otočení Země kolem osy. Pozor: počítej den i noc dohromady, ne jen jedno z nich.",
    ],
    explanation: `Den a noc se vystřídají za jedno otočení Země kolem osy, tedy asi za ${H24}. Samotný den nebo samotná noc trvá kratší dobu.`,
  },
  {
    q: "Kolikrát se Země otočí kolem své osy během jednoho oběhu kolem Slunce?",
    correct: `Asi ${cis(365)}krát`,
    distractors: [
      { value: `Asi ${cis(12)}krát`, why: `${cis(12)} je počet měsíců v roce, ne počet otočení kolem osy.` },
      { value: `Asi ${cis(24)}krát`, why: `${cis(24)} je počet hodin jednoho otočení, ne počet otočení za rok.` },
      { value: `Asi ${cis(52)}krát`, why: `${cis(52)} je počet týdnů v roce. Země se ale otočí jednou za každý den.` },
    ],
    hints: [
      "Jedno otočení kolem osy trvá jeden den. Kolik dní trvá oběh kolem Slunce?",
      "Za jeden oběh kolem Slunce uplyne jeden rok. Zjisti, kolik dní rok má – tolikrát se Země za tu dobu otočí.",
    ],
    explanation: `Jedno otočení kolem osy trvá jeden den a oběh kolem Slunce asi ${D365}. Za jeden oběh se proto Země otočí asi ${cis(365)}krát.`,
  },
];

// ── L3 — ANALÝZA A PŘENOS ───────────────────────────────────────────────────
// (a) neznámé těleso z popisu
const DRUH_Q = "O jaký druh tělesa jde?";
/**
 * Pořadí banky je promíchané tak, aby dvě sousední položky nikdy neměly stejný
 * klíč — generátor bere položky za sebou a v jednom sezení by se jinak sešly
 * dvě úlohy na totéž. Uvnitř každé dvojice se navíc liší rozlišovací znak:
 * u družice přirozená × umělá, u komety trvání jevu × vznik ohonu.
 *
 * Druh „měsíc“ se pojmenovává stejně jako v L1, tedy „přirozená družice“.
 * Vlastní jméno Měsíc patří jen našemu jednomu tělesu, ne celému druhu.
 */
const L3_POPIS: Polozka[] = [
  {
    q: `Těleso obíhá kolem planety, samo nesvítí a vidíme ho jen díky odraženému světlu. ${DRUH_Q}`,
    correct: "Přirozená družice",
    distractors: [
      { value: "Planeta", why: "Planeta obíhá přímo kolem Slunce. Toto těleso obíhá kolem planety." },
      { value: "Hvězda", why: "Hvězda svítí vlastním světlem. Toto těleso samo nesvítí." },
      { value: "Trpasličí planeta", why: "Trpasličí planeta obíhá kolem Slunce, ne kolem planety." },
    ],
    hints: [
      "Zamysli se hlavně nad tím, kolem čeho těleso obíhá.",
      "Planety, trpasličí planety, planetky i komety obíhají kolem Slunce. Jen jeden druh těles obíhá kolem planety – Země má takové těleso jediné a říkáme mu Měsíc.",
    ],
    explanation: "Těleso, které obíhá kolem planety, je její přirozená družice; lidově se jí říká měsíc. Sama nesvítí a vidíme ji jen proto, že odráží sluneční světlo – stejně jako náš Měsíc.",
  },
  {
    q: `Těleso z ledu a prachu se přiblížilo ke Slunci a narostl mu dlouhý zářící ohon. ${DRUH_Q}`,
    correct: "Kometa",
    distractors: [
      { value: "Meteor", why: "Meteor je krátká svítící stopa v atmosféře Země. Ohon, který vydrží dny i týdny, má jiné těleso." },
      { value: "Planetka", why: "Planetka je kamenná a ohon jí nenarůstá." },
      { value: "Hvězda", why: "Hvězda svítí vlastním světlem a ohon nemá." },
    ],
    hints: [
      "Všimni si, z čeho těleso je a co se s ním děje u Slunce.",
      "Když se ledové těleso přiblíží ke Slunci, led se zahřívá a mění v plyn. Plyn a prach pak za tělesem tvoří dlouhý pruh.",
    ],
    explanation: "Kometa je těleso z ledu a prachu. Když se přiblíží ke Slunci, led se mění v plyn a za kometou se vytvoří zářící ohon.",
  },
  {
    q: `Obrovská koule žhavých plynů sama vyzařuje světlo a teplo. ${DRUH_Q}`,
    correct: "Hvězda",
    distractors: [
      { value: "Planeta", why: "Obří planety jsou sice z plynů, ale nežhnou a samy nesvítí. Světlo jen odrážejí." },
      { value: "Meteor", why: "Meteor svítí jen na okamžik, když drobné těleso shoří v atmosféře." },
      { value: "Kometa", why: "Kometa je z ledu a prachu a sama světlo nevyrábí." },
    ],
    hints: [
      "Zamysli se, která tělesa světlo sama vyrábějí.",
      "Vlastní světlo a teplo vyrábí jen jeden druh těles. Nejbližší takové těleso vidíme každý den na obloze.",
    ],
    explanation: "Hvězda je obrovská koule žhavých plynů, která sama vyzařuje světlo a teplo. Nejbližší hvězdou je Slunce.",
  },
  {
    q: `Těleso obíhá kolem Slunce a je dost velké na to, aby bylo kulaté, ale svou dráhu nevyčistilo od jiných těles. ${DRUH_Q}`,
    correct: "Trpasličí planeta",
    distractors: [
      { value: "Planeta", why: "Planeta svou dráhu od ostatních těles vyčistila. Tomuto tělesu se to nepovedlo." },
      { value: "Planetka", why: "Planetka je malá a většinou nepravidelná, ne kulatá." },
      { value: "Přirozená družice", why: "Přirozená družice obíhá kolem planety, toto těleso obíhá kolem Slunce." },
    ],
    hints: [
      "Porovnej těleso s planetou: v čem se od ní liší?",
      "Planeta i toto těleso obíhají kolem Slunce a jsou kulaté. Rozdíl je jen v tom, jestli těleso na své dráze zůstalo samo, nebo se o ni dělí s dalšími tělesy.",
    ],
    explanation: "Trpasličí planeta obíhá kolem Slunce a je kulatá, ale na své dráze není sama. Tím se liší od planety. Patří sem například Pluto.",
  },
  {
    q: "Na noční obloze se na okamžik objevila svítící čára. Vznikla, když drobné těleso shořelo v atmosféře Země. Jak se tento jev nazývá?",
    correct: "Meteor",
    distractors: [
      { value: "Hvězda", why: "Lidé tomu říkají padající hvězda, ale hvězda to není. Hvězdy nepadají, svítící stopu způsobilo drobné shořelé těleso." },
      { value: "Kometa", why: "Kometa je na obloze vidět mnoho dní a za jednu noc se viditelně neposune. Tato stopa zmizela za okamžik." },
      { value: "Planetka", why: "Planetka je větší těleso, které obíhá kolem Slunce ve vesmíru. Svítící stopa v atmosféře je jiný jev." },
    ],
    hints: [
      "Zamysli se, jestli šlo o těleso daleko ve vesmíru, nebo o jev v ovzduší Země.",
      "Svítící stopa vzniká, když drobné těleso vletí velkou rychlostí do ovzduší a rozžhaví se. Lidové pojmenování tohoto jevu je zavádějící.",
    ],
    explanation: "Svítící stopa po drobném tělese, které shořelo v atmosféře, je meteor. Lidé mu říkají padající hvězda, ale s hvězdami nemá nic společného.",
  },
  {
    q: `Velké kulaté těleso obíhá kolem Slunce, samo nesvítí a svou dráhu už vyčistilo od jiných těles. ${DRUH_Q}`,
    correct: "Planeta",
    distractors: [
      { value: "Trpasličí planeta", why: "Trpasličí planeta svou dráhu nevyčistila. Toto těleso na ní zůstalo samo." },
      { value: "Hvězda", why: "Hvězda svítí vlastním světlem, toto těleso samo nesvítí." },
      { value: "Přirozená družice", why: "Přirozená družice obíhá kolem planety, ne přímo kolem Slunce." },
    ],
    hints: [
      "Zamysli se, kolem čeho těleso obíhá a jestli je na své dráze samo.",
      "Kolem Slunce obíhá osm takových těles a Země je jedním z nich. Od menších kulatých těles se liší tím, že na své dráze nemají soupeře.",
    ],
    explanation: "Těleso, které obíhá kolem Slunce, je kulaté, samo nesvítí a svou dráhu vyčistilo, je planeta. Tím se liší od trpasličí planety.",
  },
  {
    q: `Kamenné těleso krouží kolem obří planety. Vzniklo ve vesmíru a nikdo ho tam nevypustil. ${DRUH_Q}`,
    correct: "Přirozená družice",
    distractors: [
      { value: "Umělá družice", why: "Umělou družici vyrobili lidé a na dráhu ji dopravila raketa. Toto těleso vzniklo ve vesmíru samo." },
      { value: "Trpasličí planeta", why: "Trpasličí planeta obíhá kolem Slunce, ne kolem jiné planety." },
      { value: "Kometa", why: "Kometa je z ledu a prachu a obíhá kolem Slunce. Toto těleso krouží kolem planety." },
    ],
    hints: [
      "Rozhodni dvě věci: kolem čeho těleso krouží a kdo ho na dráhu dostal.",
      "Kolem planet krouží dva druhy těles. Jedny tam dopravily rakety, druhé tam krouží odedávna. Rozhodni podle toho, jak se těleso na svou dráhu dostalo.",
    ],
    explanation: "Těleso, které krouží kolem planety, je družice. Tuhle nevyrobili lidé, vznikla ve vesmíru, a je proto přirozená – lidově se jí říká měsíc. Obří planety jich mají desítky, Země jedinou.",
  },
  {
    q: `Na obloze je několik nocí po sobě vidět světlá skvrna s dlouhým ohonem, která se mezi hvězdami pomalu posouvá. ${DRUH_Q}`,
    correct: "Kometa",
    distractors: [
      { value: "Meteor", why: "Meteor je svítící stopa, která zmizí za zlomek vteřiny. Tenhle úkaz je vidět několik nocí po sobě." },
      { value: "Hvězda", why: "Hvězdy stojí na obloze na svých místech, mezi ostatními se neposouvají a ohon nemají." },
      { value: "Planetka", why: "Planetka je vidět nanejvýš jako slabý bod. Ohon jí nenarůstá, protože není z ledu." },
    ],
    hints: [
      "Rozhoduj hlavně podle toho, jak dlouho je úkaz na obloze vidět.",
      "Drobné těleso, které se rozžhaví v ovzduší Země, svítí jen okamžik. Těleso, ze kterého se u Slunce odpařuje led, je vidět dlouhé noci i týdny.",
    ],
    explanation: "Kometa obíhá kolem Slunce a u Slunce se z ní odpařuje led, takže za ní vzniká ohon. Proto je na obloze vidět mnoho nocí po sobě, zatímco meteor svítí jen okamžik.",
  },
  {
    q: `Na noční obloze září bod, který svítí vlastním světlem a je od nás mnohem dál než Slunce. ${DRUH_Q}`,
    correct: "Hvězda",
    distractors: [
      { value: "Planeta", why: "Planety na obloze také září, ale jen odrážejí světlo Slunce." },
      { value: "Přirozená družice", why: "Přirozená družice, jako je náš Měsíc, je naopak blízko a sama nesvítí." },
      { value: "Meteor", why: "Meteor je svítící stopa, která za okamžik zmizí. Bod, který září celou noc, je něco jiného." },
    ],
    hints: [
      "Rozhodující je, že bod svítí sám, ne odraženým světlem.",
      "Slunce svítí vlastním světlem a patří do stejné skupiny těles jako vzdálené svítící body na noční obloze.",
    ],
    explanation: "Bod na noční obloze, který svítí vlastním světlem, je hvězda. Hvězdy jsou podobné Slunci, jen jsou mnohem dál, a proto se nám zdají malé.",
  },
  {
    q: `Kulaté ledové těleso obíhá kolem Slunce daleko za Neptunem a svou dráhu nevyčistilo, dělí se o ni s mnoha dalšími tělesy. ${DRUH_Q}`,
    correct: "Trpasličí planeta",
    distractors: [
      { value: "Planeta", why: "Za Neptunem už žádná planeta neobíhá. Kulaté těleso, které svou dráhu nevyčistilo, planetou není." },
      { value: "Kometa", why: "Kometa bývá malá a nepravidelná, kdežto toto těleso je kulaté." },
      { value: "Přirozená družice", why: "Přirozená družice obíhá kolem planety, toto těleso obíhá kolem Slunce." },
    ],
    hints: [
      "Všimni si, jestli těleso na své dráze zůstalo samo.",
      "Za Neptunem obíhá mnoho ledových těles. Ta největší jsou kulatá, ale protože se o dráhu dělí s ostatními, k osmi velkým tělesům obíhajícím kolem Slunce nepatří.",
    ],
    explanation: "Kulaté těleso, které obíhá kolem Slunce, ale svou dráhu nevyčistilo, je trpasličí planeta. Takových těles je za Neptunem několik, nejznámější je Pluto.",
  },
  {
    q: "Lidé říkají, že viděli padat hvězdu. Ve skutečnosti drobné zrnko z vesmíru shořelo vysoko v atmosféře. Jak se tato svítící stopa správně nazývá?",
    correct: "Meteor",
    distractors: [
      { value: "Hvězda", why: "Hvězdy nepadají, jsou to obrovské koule plynů daleko od nás. Stopa na obloze vznikla shořením drobného zrnka." },
      { value: "Kometa", why: "Kometa je těleso s ohonem, které je na obloze vidět mnoho dní. Tato stopa trvala jen okamžik." },
      { value: "Umělá družice", why: "Umělá družice se po obloze pohybuje pomalu a nehoří. Krátká svítící stopa je jiný jev." },
    ],
    hints: [
      "Odděl lidové pojmenování od toho, co se ve skutečnosti stalo.",
      "Jev vzniká v ovzduší Země, ne daleko ve vesmíru. Zrnko se při průletu vzduchem rozžhaví a shoří.",
    ],
    explanation: "Když drobné zrnko z vesmíru shoří v atmosféře, vznikne svítící stopa zvaná meteor. Padající hvězda je jen lidové označení.",
  },
  {
    q: `Těleso obíhá kolem hvězdy, je tak velké, že má kulatý tvar, a v okolí své dráhy už vyčistilo prostor od jiných těles. ${DRUH_Q}`,
    correct: "Planeta",
    distractors: [
      { value: "Planetka", why: "Planetka je malá a většinou nepravidelná. Toto těleso je velké a kulaté." },
      { value: "Trpasličí planeta", why: "Trpasličí planeta se o dráhu dělí s dalšími tělesy. Toto těleso ji vyčistilo." },
      { value: "Kometa", why: "Kometa je malé ledové těleso a svou dráhu nevyčistí." },
    ],
    hints: [
      "Posuď tři znaky: kolem čeho těleso obíhá, jaký má tvar a jestli je na dráze samo.",
      "Kulatých těles obíhá kolem hvězdy víc druhů. To, které si dráhu uklidilo a nemá na ní soupeře, patří mezi osm velkých těles obíhajících kolem Slunce.",
    ],
    explanation: "Kulaté těleso, které obíhá kolem hvězdy a svou dráhu vyčistilo, je planeta. Naše Slunce má takových těles osm.",
  },
];

// (b) dvě podmínky najednou — z tabulky PLANETY
interface Podminka {
  typ: "poloha" | "velikost" | "skupina" | "mesice";
  ref?: Planeta;
  /** „Která planeta …“ */
  text: string;
  /** „planety, které …“ */
  textPl: string;
  plati: (p: Planeta) => boolean;
  /** pravdivý výrok o planetě p (bez jména) */
  fakt: (p: Planeta) => string;
}

function vsechnyPodminky(): Podminka[] {
  const out: Podminka[] = [];
  const poloha = (p: Planeta, A: Planeta) => (p.od > A.od ? `obíhá dál od Slunce než ${A.nom}` : `obíhá blíž ke Slunci než ${A.nom}`);
  const velikost = (p: Planeta, A: Planeta) => (p.vel < A.vel ? `je větší než ${A.nom}` : `je menší než ${A.nom}`);
  for (const A of PLANETY) {
    out.push({ typ: "poloha", ref: A, text: `obíhá dál od Slunce než ${A.nom}`, textPl: `obíhají dál od Slunce než ${A.nom}`, plati: (p) => p.od > A.od, fakt: (p) => poloha(p, A) });
    out.push({ typ: "poloha", ref: A, text: `obíhá blíž ke Slunci než ${A.nom}`, textPl: `obíhají blíž ke Slunci než ${A.nom}`, plati: (p) => p.od < A.od, fakt: (p) => poloha(p, A) });
    out.push({ typ: "velikost", ref: A, text: `je větší než ${A.nom}`, textPl: `jsou větší než ${A.nom}`, plati: (p) => p.vel < A.vel, fakt: (p) => velikost(p, A) });
    out.push({ typ: "velikost", ref: A, text: `je menší než ${A.nom}`, textPl: `jsou menší než ${A.nom}`, plati: (p) => p.vel > A.vel, fakt: (p) => velikost(p, A) });
  }
  const skupina = (p: Planeta) => (kamenna(p) ? "je kamenná planeta" : "patří k obřím planetám");
  out.push({ typ: "skupina", text: "je kamenná", textPl: "jsou kamenné", plati: kamenna, fakt: skupina });
  out.push({ typ: "skupina", text: "patří k obřím planetám", textPl: "patří k obřím planetám", plati: (p) => !kamenna(p), fakt: skupina });
  const mesic = (p: Planeta) => (p.mesice ? "má aspoň jeden měsíc" : "nemá žádný měsíc");
  out.push({ typ: "mesice", text: "nemá žádný měsíc", textPl: "nemají žádný měsíc", plati: (p) => !p.mesice, fakt: mesic });
  out.push({ typ: "mesice", text: "má aspoň jeden měsíc", textPl: "mají aspoň jeden měsíc", plati: (p) => p.mesice, fakt: mesic });
  return out;
}

/**
 * Dvojice planet, jejichž velikost se liší o pár procent — ve výuce se říká, že
 * jsou „skoro stejně velké“, takže žák je podle velikosti neporovná. Velikostní
 * podmínka se o takovou dvojici nesmí opřít (viz `velikostJeJasna`).
 */
const VELIKOST_NEROZLISITELNA: [string, string][] = [
  ["Země", "Venuše"],
  ["Uran", "Neptun"],
];

const stejneVelke = (a: string, b: string): boolean =>
  VELIKOST_NEROZLISITELNA.some(([x, y]) => (a === x && b === y) || (a === y && b === x));

/** Dvojice podmínek, které splňuje PRÁVĚ jedna planeta a každá z nich sama nestačí. */
const DVOJICE: [Podminka, Podminka][] = (() => {
  const vse = vsechnyPodminky();
  const out: [Podminka, Podminka][] = [];
  for (const a of vse) {
    for (const b of vse) {
      if (a.typ === b.typ) continue;
      const nA = PLANETY.filter(a.plati).length;
      const nB = PLANETY.filter(b.plati).length;
      if (nA < 2 || nB < 2) continue;
      if (PLANETY.filter((p) => a.plati(p) && b.plati(p)).length !== 1) continue;
      // „má aspoň jeden měsíc“ je u šesti planet a rozhodne málokdy — nech ho jen jako druhou podmínku
      if (a.typ === "mesice" && a.plati(planeta(3))) continue;
      out.push([a, b]);
    }
  }
  return out;
})();

function l3DvePodminky(): PracticeTask | null {
  const [a, b] = pick(DVOJICE);
  const K = PLANETY.find((p) => a.plati(p) && b.plati(p))!;
  const kandidati = PLANETY.filter((p) => p !== K && p !== a.ref && p !== b.ref);
  const skoro = shuffle(kandidati.filter((p) => a.plati(p) !== b.plati(p)));
  const zbytek = shuffle(kandidati.filter((p) => a.plati(p) === b.plati(p)));
  const d = [...skoro, ...zbytek].slice(0, 3).map<Distractor>((p) => {
    const okA = a.plati(p), okB = b.plati(p);
    let why: string;
    if (okA && !okB) why = `${p.nom} sice ${a.fakt(p)}, ale ${b.fakt(p)}. Druhou podmínku tedy nesplňuje.`;
    else if (!okA && okB) why = `${p.nom} sice ${b.fakt(p)}, ale ${a.fakt(p)}. První podmínku tedy nesplňuje.`;
    else why = `${p.nom} ${a.fakt(p)} a ${b.fakt(p)}. Nesplňuje ani jednu podmínku.`;
    return { value: p.nom, why };
  });
  // Žádná z možností se nesmí s referenční planetou velikostní podmínky
  // porovnávat „na pár procent“ — takovou úlohu žák nevyřeší, jen uhodne.
  const moznosti = [K, ...d.map((x) => PLANETY.find((p) => p.nom === x.value)!)];
  for (const c of [a, b]) {
    if (c.typ !== "velikost" || !c.ref) continue;
    if (moznosti.some((p) => stejneVelke(p.nom, c.ref!.nom))) return null;
  }
  const splnujiA = PLANETY.filter(a.plati).map((p) => p.nom);
  return choice(`Která planeta ${a.text} a zároveň ${b.text}?`, K.nom, d, {
    hints: [
      `Hledáš planetu, která splní dvě podmínky. Začni první z nich: které planety ${a.textPl}?`,
      `Ze skupiny planet, které ${a.textPl}, ponech jen ty, které zároveň ${b.textPl}. Pomůže ti vybavit si pořadí planet od Slunce, jejich velikost a rozdělení na kamenné a obří.`,
    ],
    explanation: `První podmínku (${a.text}) splňují ${vycet(splnujiA)}. Z nich druhou podmínku (${b.text}) splňuje jen ${K.nom}.`,
  });
}

// (c) proč je Země výjimečná
const L3_ZEME: Polozka[] = [
  {
    q: "Proč je právě na Zemi život, když na ostatních planetách Sluneční soustavy ho neznáme?",
    correct: "Protože obíhá v takové vzdálenosti od Slunce, že má kapalnou vodu",
    distractors: [
      { value: "Protože je to ze všech planet Sluneční soustavy ta vůbec největší", why: "Země není největší planeta – největší je Jupiter. Velikost o životě nerozhoduje." },
      { value: "Protože ze všech planet obíhá úplně nejblíž k hřejivému Slunci", why: "Nejblíž Slunci obíhá Merkur a přes den je tam obrovské horko. Země je až třetí." },
      { value: "Protože jako jediná planeta má svou vlastní přirozenou družici", why: "Měsíce mají i Mars a obří planety. Měsíc život na Zemi nezpůsobuje." },
    ],
    hints: [
      "Vzpomeň si, co život potřebuje nejvíc a v jakém skupenství.",
      "Na planetě blízko Slunce se voda vypaří, na vzdálené zamrzne. Rozhoduje, jestli teplota dovolí vodě zůstat tekutou. Velikost ani měsíce roli nehrají.",
    ],
    explanation: "Země obíhá v takové vzdálenosti od Slunce, že na ní není příliš horko ani příliš zima. Voda tu může být kapalná, a to je pro život nezbytné. Atmosféra navíc drží teplo a chrání před škodlivým zářením.",
  },
  {
    q: "Čím se Země liší od všech ostatních planet Sluneční soustavy?",
    correct: "Jako jediná má na povrchu oceány kapalné vody",
    distractors: [
      { value: "Jako jediná je kamenná a má pevný povrch", why: "Kamenné jsou i Merkur, Venuše a Mars a všechny mají pevný povrch." },
      { value: "Jako jediná má měsíc, který kolem ní stále obíhá", why: "Měsíce mají i Mars, Jupiter, Saturn, Uran a Neptun." },
      { value: "Jako jediná se otáčí kolem své vlastní osy", why: "Kolem své osy se otáčejí všechny planety, nejen Země." },
    ],
    hints: [
      "U každé možnosti si vzpomeň, jestli neplatí i pro jinou planetu.",
      "Kamenné planety jsou čtyři a měsíce má většina planet. Hledej vlastnost, kterou má opravdu jen naše planeta a která souvisí s podmínkami pro život.",
    ],
    explanation: "Jen Země má na povrchu oceány kapalné vody. Kamenné jsou i Merkur, Venuše a Mars, měsíce mají i další planety a kolem osy se otáčejí všechny.",
  },
  {
    q: "Co by se nejspíš stalo s oceány, kdyby Země obíhala mnohem blíž ke Slunci?",
    correct: "Voda by se kvůli horku z velké části vypařila",
    distractors: [
      { value: "Voda by kvůli mrazu z velké části zamrzla", why: "Mráz by hrozil, kdyby Země byla dál od Slunce. Blíž ke Slunci je víc tepla." },
      { value: "Oceány by zůstaly stejné, na vzdálenosti nezáleží", why: "Na vzdálenosti od Slunce záleží – určuje, kolik tepla planeta dostává." },
      { value: "Oceány by se zvětšily, protože by víc pršelo", why: "Při velkém horku se voda vypařuje rychleji, než stačí napršet. Oceány by se zmenšovaly, ne zvětšovaly." },
    ],
    hints: [
      "Zamysli se, jak se změní teplota, když bude planeta blíž ke zdroji tepla.",
      "Blíž ke Slunci dopadá na planetu víc tepla. Zamysli se, co udělá velké teplo s vodou – a proč je důležité, že je Země právě tak daleko, jak je.",
    ],
    explanation: "Blíž ke Slunci by na Zemi bylo mnohem víc tepla a voda by se z velké části vypařila. Země obíhá právě v takové vzdálenosti, že voda zůstává kapalná.",
  },
  {
    q: "Mars obíhá dál od Slunce než Země. Proč na jeho povrchu nejsou řeky ani moře?",
    correct: "Je tam chladno a řídké ovzduší, kapalná voda se neudrží",
    distractors: [
      { value: "Je tam velké horko, takže se voda hned celá vypaří", why: "Mars je dál od Slunce než Země, takže je tam naopak chladno." },
      { value: "Je to obří planeta z plynů, která nemá pevný povrch", why: "Mars je kamenná planeta a pevný povrch má." },
      { value: "Je to planeta, kolem které neobíhá vůbec žádný měsíc", why: "Mars má dva malé měsíce. Měsíce navíc o vodě na povrchu nerozhodují." },
    ],
    hints: [
      "Zamysli se, jak se mění teplota s rostoucí vzdáleností od Slunce.",
      "Čím dál od Slunce, tím méně tepla planeta dostává. Pomysli i na to, že tenký obal plynů teplo neudrží.",
    ],
    explanation: "Mars je dál od Slunce a má velmi řídké ovzduší, které teplo neudrží. Je tam proto chladno a voda může být jen jako led, řeky ani moře tam dnes nejsou.",
  },
  {
    q: "Venuše je skoro stejně velká jako Země. Proč na ní přesto není život, jaký známe?",
    correct: "Je blíž Slunci a hustá atmosféra ji silně přehřívá",
    distractors: [
      { value: "Je menší než Merkur, a proto neudrží žádné ovzduší", why: "Venuše je mnohem větší než Merkur a má velmi hustou atmosféru." },
      { value: "Je to obří planeta z plynů, bez pevného povrchu", why: "Venuše je kamenná planeta s pevným povrchem, podobně jako Země." },
      { value: "Svítí vlastním světlem, a proto je tam žhavo", why: "Venuše sama nesvítí. Jasně září jen odraženým slunečním světlem." },
    ],
    hints: [
      "Zamysli se, co udělá s teplotou blízkost Slunce a hustý obal plynů.",
      "Hustá vrstva plynů funguje jako peřina: teplo pustí dovnitř, ale ven ho skoro nepustí. Porovnej také, jak daleko od Slunce obíhá Venuše a jak daleko Země.",
    ],
    explanation: "Venuše obíhá blíž Slunci než Země a má velmi hustou atmosféru, která zadržuje teplo. Na povrchu je proto takové horko, že tam kapalná voda být nemůže.",
  },
  {
    q: "Proč je pro život na Zemi důležitá její atmosféra?",
    correct: "Chrání před škodlivým zářením a udržuje teplo",
    distractors: [
      { value: "Dodává planetě světlo, když Slunce nesvítí", why: "Atmosféra světlo nevyrábí. Světlo přichází ze Slunce." },
      { value: "Drží Měsíc na jeho stálé dráze kolem naší planety", why: "Měsíc drží na dráze přitažlivost Země, ne atmosféra." },
      { value: "Brání Zemi v tom, aby se přiblížila až ke Slunci", why: "Na vzdálenost Země od Slunce atmosféra nemá vliv." },
    ],
    hints: [
      "Zamysli se, před čím nás ovzduší chrání a co by se bez něj stalo s teplotou v noci.",
      "Bez ovzduší by bylo přes den spalující horko, v noci mráz a na povrch by dopadalo nebezpečné záření ze Slunce.",
    ],
    explanation: "Atmosféra zachycuje škodlivé záření ze Slunce a drží teplo, takže se povrch přes den nepřehřeje a v noci příliš neochladí. Bez ní by život na Zemi nebyl možný.",
  },
];

// (d) úvaha o pozorování
const L3_POZOROVANI: Polozka[] = [
  {
    q: "Měsíc sám nesvítí. Proč ho přesto v noci vidíme jasně zářit?",
    correct: "Odráží k nám světlo, které na něj dopadá ze Slunce",
    distractors: [
      { value: "Odráží k nám světlo hvězd, které jsou kolem něj", why: "Hvězdy jsou velmi daleko a jejich světlo je slabé. Měsíc osvětluje Slunce." },
      { value: "Září, protože je na jeho povrchu rozžhavená láva", why: "Na povrchu Měsíce žádná žhavá láva není. Světlo, které vidíme, je odražené." },
      { value: "Září, protože v noci vydává světlo nasbírané přes den", why: "Měsíc světlo neukládá. Září jen tehdy, když na něj právě dopadá sluneční světlo." },
    ],
    hints: [
      "Zamysli se, odkud přichází světlo, které Měsíc odráží.",
      "Ve Sluneční soustavě vyrábí světlo samo jen jedno těleso. Všechno ostatní, co na obloze září, se chová jako zrcadlo.",
    ],
    explanation: "Měsíc sám nesvítí. Dopadá na něj světlo ze Slunce a jeho povrch ho odráží k nám. Proto Měsíc září, i když je u nás noc.",
  },
  {
    q: "Proč přes den na obloze nevidíme hvězdy?",
    correct: "Přes den na obloze jsou, ale přezáří je Slunce",
    distractors: [
      { value: "Přes den zhasnou a rozsvítí se zase večer", why: "Hvězdy svítí nepřetržitě, ve dne i v noci." },
      { value: "Přes den jsou schované na druhé straně Země", why: "Hvězdy jsou kolem Země na všech stranách. Ve dne jsou nad námi také, jen je nevidíme." },
      { value: "Přes den je všechny zakrývá veliký Měsíc", why: "Měsíc je na obloze malý a zakryje jen nepatrnou část hvězd." },
    ],
    hints: [
      "Zamysli se, jestli hvězdy opravdu mizí, nebo je jen něco přezáří.",
      "Představ si baterku rozsvícenou venku za jasného dne. Je ji vidět? Slabé světlo se ztratí vedle mnohem silnějšího.",
    ],
    explanation: "Hvězdy jsou na obloze i ve dne a svítí pořád. Světlo Slunce je ale tak silné, že slabé světlo vzdálených hvězd přezáří. Proto je vidíme až po setmění.",
  },
  {
    q: "Venuši můžeme někdy ráno vidět jako velmi jasný bod, Jitřenku. Proč tak jasně září?",
    correct: "Je blízko nás a odráží hodně slunečního světla",
    distractors: [
      { value: "Je to hvězda, která svítí vlastním světlem", why: "Venuše není hvězda, je to planeta. Vlastním světlem nesvítí." },
      { value: "Je to planeta, která svítí vlastním světlem", why: "Planety vlastním světlem nesvítí, jen odrážejí světlo Slunce." },
      { value: "Je rozžhavená a vyzařuje světlo jako Slunce", why: "Na Venuši je sice velké horko, ale světlo sama nevyrábí. Září odraženým světlem." },
    ],
    hints: [
      "Rozhodni, jestli Venuše světlo vyrábí, nebo ho jen odráží.",
      "Venuše se k Zemi přibližuje víc než ostatní planety a její hustá oblačnost dobře vrací světlo. Čím blíž je těleso a čím víc světla vrací, tím jasněji září.",
    ],
    explanation: "Venuše sama nesvítí. Přibližuje se k Zemi víc než ostatní planety a její hustá oblačnost odráží hodně slunečního světla. Proto je ráno nebo večer vidět jako velmi jasný bod.",
  },
  {
    q: "Proč Měsíc někdy vidíme jako úplněk a jindy jen jako tenký srpek?",
    correct: "Obíhá kolem Země a vidíme jinou část osvětlené poloviny",
    distractors: [
      { value: "Zakrývá ho stín Země, který se každou noc kousek posouvá", why: "Stín Země dopadne na Měsíc jen při zatmění Měsíce. Fáze vznikají tím, že vidíme různou část jeho osvětlené poloviny." },
      { value: "Svítí každou noc jinak silně, jak mu ubývá světla", why: "Měsíc sám nesvítí, takže mu světlo ubývat nemůže. Slunce ho osvětluje stále." },
      { value: "Každou noc zakrývají mraky jinou část měsíčního kotouče", why: "Mraky se mění nahodile, kdežto fáze Měsíce se opakují pravidelně přibližně každý měsíc." },
    ],
    hints: [
      "Pamatuj, že Slunce osvětluje vždy polovinu Měsíce. Kolik z té poloviny vidíme my?",
      "Měsíc během měsíce oběhne Zemi. Podle toho, kde zrovna je, se na jeho osvětlenou stranu díváme zpředu, z boku nebo skoro zezadu.",
    ],
    explanation: "Slunce osvětluje vždy polovinu Měsíce. Jak Měsíc obíhá kolem Země, vidíme z osvětlené poloviny pokaždé jinou část – celou při úplňku, jen kousek jako srpek.",
  },
  {
    q: "Za jednu noc se zdá, že se hvězdy na obloze posunou. Čím to je?",
    correct: "Země se během noci otáčí kolem své osy",
    distractors: [
      { value: "Hvězdy během noci obíhají kolem Země", why: "Hvězdy kolem Země neobíhají. Pohybujeme se my, protože se Země otáčí." },
      { value: "Hvězdy odnáší vítr ve vysoké atmosféře", why: "Hvězdy jsou daleko ve vesmíru, vítr v atmosféře s nimi nepohne." },
      { value: "Měsíc je během noci táhne s sebou po obloze", why: "Měsíc hvězdy nijak nepřitahuje, jsou nesmírně daleko." },
    ],
    hints: [
      "Zamysli se, jestli se opravdu hýbou hvězdy, nebo ten, kdo se na ně dívá.",
      "Podobně jako Slunce ve dne putují i hvězdy v noci po obloze od východu k západu. Který pohyb Země trvá jeden den a noc?",
    ],
    explanation: "Hvězdy se po obloze pohybují jen zdánlivě. Ve skutečnosti se Země otáčí kolem své osy a my s ní, stejně jako když se ve dne zdá, že se pohybuje Slunce.",
  },
];

// ── Generátor ───────────────────────────────────────────────────────────────
const vytvor = (p: Polozka): PracticeTask | null =>
  choice(p.q, p.correct, p.distractors, { hints: p.hints, explanation: p.explanation });

type Tvurce = () => PracticeTask | null;

function gen(level: number): PracticeTask[] {
  // Rotace šablon i bank žije jen uvnitř volání — modul nemá stav.
  const banka = (pole: Polozka[]): Tvurce => {
    let j = 0;
    return () => vytvor(pole[j++ % pole.length]);
  };
  const sablony: Tvurce[] =
    level <= 1
      ? [banka(L1_ZNAK), banka(L1_DRUH), banka(L1_POHYB), banka(L1_HIERARCHIE)]
      : level === 2
        ? [l2Poradi, l2Skupina, l2Svetlo, banka(L2_POHYB)]
        : [banka(L3_POPIS), l3DvePodminky, banka(L3_ZEME), banka(L3_POZOROVANI)];
  let i = 0;
  return ruzneUlohy(() => losUlohy(sablony[i++ % sablony.length]));
}

// ── Topic ───────────────────────────────────────────────────────────────────
export const VESMIR_SLUNECNI_SOUSTAVA: TopicMetadata[] = [
  {
    id: "g6-zem-vesmir-slunecni-soustava-6",
    rvpNodeId: "g6-zemepis-prirodni-obraz-zeme-vesmir-a-zeme-vesmir-slunecni-soustava-zeme-jako-planeta",
    displayName: "Vesmír a naše planeta",
    title: "Vesmír, Sluneční soustava, Země jako planeta",
    studentTitle: "Vesmír a naše planeta",
    subject: "zemepis",
    category: "Přírodní obraz Země",
    topic: "Vesmír a Země",
    briefDescription: "Hvězdy, planety a Měsíc – poznej Sluneční soustavu a Zemi mezi planetami.",
    keywords: [
      "vesmír", "Sluneční soustava", "planety", "Slunce", "hvězda", "Měsíc",
      "trpasličí planeta", "kometa", "meteor", "galaxie", "Mléčná dráha",
      "kamenné planety", "obří planety", "Země jako planeta",
    ],
    goals: [
      "Zařadit vesmírné těleso podle jeho vlastností (hvězda, planeta, trpasličí planeta, měsíc, kometa, planetka, meteor).",
      "Orientovat se ve Sluneční soustavě podle pořadí planet od Slunce, jejich velikosti a rozdělení na kamenné a obří.",
      "Vysvětlit, čím je Země mezi planetami výjimečná (kapalná voda, vhodná vzdálenost od Slunce, atmosféra).",
    ],
    boundaries: [
      "Přesné vzdálenosti, počty měsíců a teploty se jako klíč nepoužívají.",
      "Roční doby a časová pásma patří sousednímu podtématu.",
      "Bez fyziky gravitace a bez vzniku vesmíru.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Hvězda svítí vlastním světlem, planeta a měsíc jen odrážejí světlo Slunce. Planety od Slunce: Merkur, Venuše, Země, Mars (kamenné), Jupiter, Saturn, Uran, Neptun (obří).",
      steps: [
        "Zjisti, jestli těleso svítí samo, nebo jen odráží světlo.",
        "Urči, kolem čeho obíhá: kolem Slunce, nebo kolem planety.",
        "U planet si vybav jejich pořadí od Slunce a skupinu (kamenné, obří).",
      ],
      commonMistake: "Myslet si, že Slunce je planeta, že Měsíc svítí sám nebo že padající hvězda je opravdu hvězda.",
      example: "Těleso, které obíhá kolem planety a samo nesvítí, je měsíc.",
    },
  },
];
