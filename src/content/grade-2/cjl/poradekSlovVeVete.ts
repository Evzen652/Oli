import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

/**
 * Pořádek slov ve větě — 2. ročník (RVP: jazyková výchova → slovo a věta).
 *
 * ⚠️ Proč tu NENÍ „seřaď slova do věty“ (`drag_order`), i když se to nabízí:
 * čeština má **volný slovosled**. „Pes spí v boudě.“, „V boudě spí pes.“
 * i „Spí pes v boudě.“ jsou všechny správné věty. Úloha, která uzná jediné
 * pořadí, by dítě učila nepravdu — a `drag_order` jiné pořadí uznat neumí
 * (`orderedSequenceValidator` porovnává položky pozici po pozici).
 *
 * Téma se proto staví na tom, co opravdu platí:
 *   · předložka stojí vždy hned před slovem, ke kterému patří (L1),
 *   · pořádek slov se dá měnit a smysl zůstane — dokud zůstanou TA SAMÁ
 *     slova a předložka u svého slova (L2),
 *   · L3 to posouvá dvěma směry: dvě předložkové vazby v jedné větě (dvě
 *     podmínky zároveň) a věty, kde přehození slov smysl NEZMĚNÍ, ale změna
 *     jejich tvaru ano („Kočka honí psa.“ / „Pes honí kočku.“).
 */

const low = (s: string) => s[0].toLowerCase() + s.slice(1);
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

// ── L1 + L2: společná tabulka vět tvaru „podmět — přísudek — předložka — jméno“ ──
interface Zaklad {
  /** Podmět s velkým písmenem („Pes“). */
  s: string;
  /** Přísudek („spí“). */
  v: string;
  /** Předložka malým písmenem („v“). */
  p: string;
  /** Jméno v pádu, který předložka žádá („boudě“). */
  n: string;
  /** „o kom / o čem je věta“ do zadání L1 („psovi“). */
  o: string;
  /** Jiný podmět ve stejném čísle — distraktor L2 („kočka“). */
  s2: string;
  /** Jiné jméno po TÉŽE předložce — distraktor L2 („domě“). */
  n2: string;
  emoji: string;
}

const ZAKLAD: Zaklad[] = [
  { s: "Pes", v: "spí", p: "v", n: "boudě", o: "psovi", s2: "kočka", n2: "domě", emoji: "🐕" },
  { s: "Kočka", v: "leží", p: "na", n: "polštáři", o: "kočce", s2: "myška", n2: "podlaze", emoji: "🐈" },
  { s: "Táta", v: "stojí", p: "u", n: "auta", o: "tátovi", s2: "soused", n2: "plotu", emoji: "🚗" },
  { s: "Maminka", v: "vaří", p: "v", n: "kuchyni", o: "mamince", s2: "babička", n2: "hrnci", emoji: "🍲" },
  { s: "Ptáci", v: "zpívají", p: "na", n: "stromě", o: "ptácích", s2: "děti", n2: "drátě", emoji: "🐦" },
  { s: "Dědeček", v: "sedí", p: "na", n: "lavičce", o: "dědečkovi", s2: "kamarád", n2: "židli", emoji: "👴" },
  { s: "Kniha", v: "leží", p: "na", n: "stole", o: "knize", s2: "čepice", n2: "poličce", emoji: "📖" },
  { s: "Děti", v: "běhají", p: "po", n: "hřišti", o: "dětech", s2: "psi", n2: "chodbě", emoji: "🏃" },
  { s: "Rybičky", v: "plavou", p: "v", n: "akváriu", o: "rybičkách", s2: "kachny", n2: "rybníku", emoji: "🐠" },
  { s: "Voda", v: "teče", p: "na", n: "silnici", o: "vodě", s2: "bláto", n2: "louce", emoji: "💧" },
  { s: "Pastelky", v: "leží", p: "v", n: "penálu", o: "pastelkách", s2: "klíče", n2: "aktovce", emoji: "✏️" },
  { s: "Babička", v: "plete", p: "u", n: "okna", o: "babičce", s2: "sousedka", n2: "stolu", emoji: "🧶" },
  { s: "Sestra", v: "kreslí", p: "na", n: "papír", o: "sestře", s2: "bratr", n2: "tabuli", emoji: "🎨" },
  { s: "Myška", v: "běží", p: "do", n: "díry", o: "myšce", s2: "liška", n2: "lesa", emoji: "🐭" },
  { s: "Lampa", v: "svítí", p: "nad", n: "stolem", o: "lampě", s2: "lustr", n2: "postelí", emoji: "💡" },
  { s: "Teta", v: "stojí", p: "před", n: "domem", o: "tetě", s2: "strejda", n2: "školou", emoji: "🏠" },
];

/**
 * L1 — rozpoznání pravidla: jen jedna ze čtyř vět má předložku na svém místě.
 *
 * Všechny tři chybné možnosti vznikají jediným přesunem předložky, takže jde
 * o blízké chyby jednoho pravidla, ne o náhodný nesmysl. Žádná z nich není
 * jiný dovolený slovosled — předložka v češtině nikdy nestojí za svým slovem,
 * před slovesem ani odtržená na začátku věty.
 */
function l1(x: Zaklad): PracticeTask {
  const spravne = `${x.s} ${x.v} ${x.p} ${x.n}.`;
  const d: [Distractor, Distractor, Distractor] = [
    {
      value: `${x.s} ${x.v} ${x.n} ${x.p}.`,
      why: `Předložka „${x.p}“ se dostala až za slovo „${x.n}“. Předložka stojí vždycky před ním, nikdy za ním.`,
    },
    {
      value: `${x.s} ${x.p} ${x.v} ${x.n}.`,
      why: `Předložka „${x.p}“ tu stojí před slovem „${x.v}“, ale patří ke slovu „${x.n}“.`,
    },
    {
      value: `${cap(x.p)} ${low(x.s)} ${x.v} ${x.n}.`,
      why: `Předložka „${x.p}“ se odtrhla od slova „${x.n}“ a zůstala na začátku věty.`,
    },
  ];
  return {
    ...choice(`Ve které větě o ${x.o} stojí slova správně?`, spravne, d, {
      hints: [
        `Najdi ve větě předložku „${x.p}“. Před kterým slovem musí stát?`,
        `Předložka a slovo, ke kterému patří, jdou vždy spolu: nejdřív předložka, hned za ní to slovo. Vyřaď proto každou možnost, kde „${x.p}“ nestojí hned před slovem „${x.n}“.`,
      ],
      explanation: `Ve větě „${spravne}“ stojí předložka „${x.p}“ hned před slovem „${x.n}“ — tam patří. V ostatních větách se od něj odtrhla a věta přestala dávat smysl.`,
    }),
    emoji: x.emoji,
  };
}

/**
 * L2 — aplikace: pořádek slov se dá změnit, smysl zůstane. Dvě podmínky
 * zároveň — slova musí zůstat stejná A předložka u svého slova.
 *
 * Správná možnost je táž věta začínající předložkovou vazbou („V boudě spí
 * pes.“). Distraktory ukazují tři typické chyby: vyměněný podmět, vyměněné
 * místo (pořádek se přitom vůbec nezměnil) a odtrženou předložku.
 */
function l2(x: Zaklad): PracticeTask {
  const zadani = `${x.s} ${x.v} ${x.p} ${x.n}.`;
  const spravne = `${cap(x.p)} ${x.n} ${x.v} ${low(x.s)}.`;
  const d: [Distractor, Distractor, Distractor] = [
    {
      value: `${cap(x.p)} ${x.n} ${x.v} ${x.s2}.`,
      why: `Slova se přehodila správně, ale místo „${low(x.s)}“ je ve větě „${x.s2}“. Věta pak říká něco jiného.`,
    },
    {
      value: `${x.s} ${x.v} ${x.p} ${x.n2}.`,
      why: `Pořádek slov se vůbec nezměnil a navíc je místo „${x.n}“ ve větě „${x.n2}“.`,
    },
    {
      value: `${cap(x.n)} ${x.p} ${x.v} ${low(x.s)}.`,
      why: `Předložka „${x.p}“ se odtrhla od slova „${x.n}“ — takhle věta nedává smysl.`,
    },
  ];
  return {
    ...choice(`„${zadani}“ Která věta říká totéž?`, spravne, d, {
      hints: [
        `Smysl zůstane stejný jen tehdy, když ve větě zůstanou úplně stejná slova — jen jinak seřazená.`,
        `Porovnej každou možnost se zadáním slovo po slovu. Jsou tam všechna stejná slova? A drží předložka „${x.p}“ pořád u slova „${x.n}“? Jakmile se jedno slovo vymění, věta už říká něco jiného.`,
      ],
      explanation: `„${spravne}“ má úplně stejná slova jako zadání, jen v jiném pořadí — proto říká totéž. Čeština to dovolí: pořádek slov se dá měnit, dokud předložka zůstane u svého slova.`,
    }),
    emoji: x.emoji,
  };
}

// ── L3: ruční banky ──────────────────────────────────────────────────────────
interface Rucni {
  q: string;
  a: string;
  d: [Distractor, Distractor, Distractor];
  h: [string, string];
  e: string;
  emoji: string;
}

const rucni = (x: Rucni): PracticeTask => ({
  ...choice(x.q, x.a, x.d, { hints: x.h, explanation: x.e }),
  emoji: x.emoji,
});

/**
 * L3a — dvě předložkové vazby v jedné větě. Nová obtížnost: dítě musí držet
 * obě předložky u jejich slov najednou. Nejblizší chyba je **výměna předložek**
 * mezi oběma slovy — slova zůstanou všechna, ale věta začne tvrdit něco jiného
 * („pes by spal na boudě“).
 */
const DVE_VAZBY: Rucni[] = [
  {
    q: "„Pes spí v boudě na zahradě.“ Která věta říká totéž?",
    a: "Na zahradě spí pes v boudě.",
    d: [
      { value: "V zahradě spí pes na boudě.", why: "Předložky si vyměnily svá slova. Pes by spal na boudě, ne v ní." },
      { value: "Na zahradě v boudě spí kočka.", why: "Předložky jsou na svých místech, ale spí tam kočka, ne pes." },
      { value: "Pes spí boudě v na zahradě.", why: "Předložka „v“ se odtrhla od slova „boudě“ a věta se rozpadla." },
    ],
    h: [
      "Ve větě jsou dvě předložky. U každé se zvlášť zeptej, ke kterému slovu patří.",
      "Přehodit slova je dovolené, ale obě předložky musí zůstat hned před svými slovy a nesmí si je vyměnit. Ověř u každé možnosti obojí: „v“ před boudou a „na“ před zahradou.",
    ],
    e: "„Na zahradě spí pes v boudě.“ má stejná slova jako zadání a obě předložky zůstaly u svých slov. Proto říká totéž, i když začíná jinak.",
    emoji: "🐕",
  },
  {
    q: "„Kniha leží na stole u okna.“ Která věta říká totéž?",
    a: "U okna leží kniha na stole.",
    d: [
      { value: "Na okně leží kniha u stolu.", why: "Předložky si vyměnily svá slova. Kniha by ležela na okně, ne na stole." },
      { value: "U okna leží na stole sešit.", why: "Předložky jsou v pořádku, ale leží tam sešit, ne kniha." },
      { value: "Kniha leží stole na u okna.", why: "Předložka „na“ se odtrhla od slova „stole“ a věta se rozpadla." },
    ],
    h: [
      "Ve větě jsou dvě předložky. Ke kterému slovu patří „na“ a ke kterému „u“?",
      "Pořádek slov se měnit smí, ale každá předložka musí zůstat hned před svým slovem. Projdi možnosti a u obou předložek ověř, že stojí před stejným slovem jako v zadání.",
    ],
    e: "„U okna leží kniha na stole.“ má stejná slova jako zadání a obě předložky zůstaly u svých slov. Pořádek se změnil, smysl ne.",
    emoji: "📖",
  },
  {
    q: "„Táta stojí u auta před domem.“ Která věta říká totéž?",
    a: "Před domem stojí táta u auta.",
    d: [
      { value: "Před autem stojí táta u domu.", why: "Předložky si vyměnily svá slova. Táta by stál u domu, ne u auta." },
      { value: "Před domem stojí máma u auta.", why: "Předložky jsou na svých místech, ale stojí tam máma, ne táta." },
      { value: "Táta stojí auta u před domem.", why: "Předložka „u“ se odtrhla od slova „auta“ a věta se rozpadla." },
    ],
    h: [
      "Ve větě jsou dvě předložky. Zkontroluj zvlášť „u“ a zvlášť „před“.",
      "Slova se přehodit smějí, ale předložky si nesmějí vyměnit svá slova. U každé možnosti ověř obojí: „u“ před autem a „před“ před domem.",
    ],
    e: "„Před domem stojí táta u auta.“ má stejná slova jako zadání a obě předložky drží u svých slov. Proto říká totéž.",
    emoji: "🚗",
  },
  {
    q: "„Kočka leží na polštáři v křesle.“ Která věta říká totéž?",
    a: "V křesle leží kočka na polštáři.",
    d: [
      { value: "V polštáři leží kočka na křesle.", why: "Předložky si vyměnily svá slova. Kočka by ležela na křesle, ne na polštáři." },
      { value: "V křesle leží pes na polštáři.", why: "Předložky jsou v pořádku, ale leží tam pes, ne kočka." },
      { value: "Kočka leží polštáři na v křesle.", why: "Předložka „na“ se odtrhla od slova „polštáři“ a věta se rozpadla." },
    ],
    h: [
      "Ve větě jsou dvě předložky. Ke kterému slovu patří „na“ a ke kterému „v“?",
      "Pořádek slov se měnit smí, ale obě předložky musí zůstat hned před svými slovy. Ověř u každé možnosti, že „na“ stojí před polštářem a „v“ před křeslem.",
    ],
    e: "„V křesle leží kočka na polštáři.“ má stejná slova jako zadání a obě předložky zůstaly u svých slov. Smysl se nezměnil.",
    emoji: "🐈",
  },
  {
    q: "„Děti běhají po hřišti za školou.“ Která věta říká totéž?",
    a: "Za školou běhají děti po hřišti.",
    d: [
      { value: "Za hřištěm běhají děti po škole.", why: "Předložky si vyměnily svá slova. Děti by běhaly po škole, ne po hřišti." },
      { value: "Za školou běhají psi po hřišti.", why: "Předložky jsou na svých místech, ale běhají tam psi, ne děti." },
      { value: "Děti běhají hřišti po za školou.", why: "Předložka „po“ se odtrhla od slova „hřišti“ a věta se rozpadla." },
    ],
    h: [
      "Ve větě jsou dvě předložky. Zkontroluj zvlášť „po“ a zvlášť „za“.",
      "Slova se přehodit smějí, ale předložky si nesmějí vyměnit svá slova. U každé možnosti ověř obojí: „po“ před hřištěm a „za“ před školou.",
    ],
    e: "„Za školou běhají děti po hřišti.“ má stejná slova jako zadání a obě předložky drží u svých slov. Proto říká totéž.",
    emoji: "🏃",
  },
  {
    q: "„Rybičky plavou v akváriu u televize.“ Která věta říká totéž?",
    a: "U televize plavou rybičky v akváriu.",
    d: [
      { value: "U akvária plavou rybičky v televizi.", why: "Předložky si vyměnily svá slova. Rybičky by plavaly v televizi." },
      { value: "U televize plavou žabky v akváriu.", why: "Předložky jsou v pořádku, ale plavou tam žabky, ne rybičky." },
      { value: "Rybičky plavou akváriu v u televize.", why: "Předložka „v“ se odtrhla od slova „akváriu“ a věta se rozpadla." },
    ],
    h: [
      "Ve větě jsou dvě předložky. Ke kterému slovu patří „v“ a ke kterému „u“?",
      "Pořádek slov se měnit smí, ale obě předložky musí zůstat hned před svými slovy. Ověř u každé možnosti, že „v“ stojí před akváriem a „u“ před televizí.",
    ],
    e: "„U televize plavou rybičky v akváriu.“ má stejná slova jako zadání a obě předložky zůstaly u svých slov. Smysl se nezměnil.",
    emoji: "🐠",
  },
  {
    q: "„Babička sedí na lavičce u domu.“ Která věta říká totéž?",
    a: "U domu sedí babička na lavičce.",
    d: [
      { value: "U lavičky sedí babička na domě.", why: "Předložky si vyměnily svá slova. Babička by seděla na domě." },
      { value: "U domu sedí dědeček na lavičce.", why: "Předložky jsou na svých místech, ale sedí tam dědeček, ne babička." },
      { value: "Babička sedí lavičce na u domu.", why: "Předložka „na“ se odtrhla od slova „lavičce“ a věta se rozpadla." },
    ],
    h: [
      "Ve větě jsou dvě předložky. Zkontroluj zvlášť „na“ a zvlášť „u“.",
      "Slova se přehodit smějí, ale předložky si nesmějí vyměnit svá slova. U každé možnosti ověř obojí: „na“ před lavičkou a „u“ před domem.",
    ],
    e: "„U domu sedí babička na lavičce.“ má stejná slova jako zadání a obě předložky drží u svých slov. Proto říká totéž.",
    emoji: "👵",
  },
];

/**
 * L3b — transfer: přehození slov smysl NEZMĚNÍ, změna jejich TVARU ano.
 *
 * Tady se teprve ukáže, proč je volný slovosled v češtině možný: větné role
 * nedrží pozice, ale tvar slova. Dva ze tří distraktorů proto obracejí role
 * výměnou tvarů („Kočka honí psa.“ → „Pes honí kočku.“) — každý jinak
 * seřazený, aby se nedalo trefit podle pořadí.
 */
const PROHOZENE_TVARY: Rucni[] = [
  {
    q: "„Kočka honí psa.“ Která věta říká totéž?",
    a: "Psa honí kočka.",
    d: [
      { value: "Pes honí kočku.", why: "Tady honí pes. Nestačí slova přehodit — změnil se jejich tvar, a tím i to, kdo koho honí." },
      { value: "Kočku honí pes.", why: "I tady honí pes. Tvary „pes“ a „kočku“ obrátily smysl věty." },
      { value: "Psa honí liška.", why: "Tvary jsou v pořádku, ale „kočka“ se vyměnila za „lišku“." },
    ],
    h: [
      "Přehozená slova smysl nezmění. Podívej se ale na tvary slov — zůstaly stejné?",
      "V češtině poznáš, kdo koho honí, podle TVARU slova, ne podle jeho místa ve větě. V zadání honí kočka. Projdi možnosti a u každé se zeptej, kdo honí tam.",
    ],
    e: "„Psa honí kočka.“ má stejná slova ve stejných tvarech jako zadání, jen v jiném pořadí — honí pořád kočka. Jakmile se tvary změní na „pes“ a „kočku“, honí někdo jiný.",
    emoji: "🐈",
  },
  {
    q: "„Maminka volá Petra.“ Která věta říká totéž?",
    a: "Petra volá maminka.",
    d: [
      { value: "Petr volá maminku.", why: "Tady volá Petr. Tvary slov se změnily, a s nimi i to, kdo koho volá." },
      { value: "Maminku volá Petr.", why: "I tady volá Petr. Pořádek je jiný, ale tvary obrátily smysl." },
      { value: "Petra volá babička.", why: "Tvary jsou v pořádku, ale volá babička, ne maminka." },
    ],
    h: [
      "Slova se přehodit smějí. Zkontroluj ale, jestli zůstala ve stejném tvaru.",
      "Kdo koho volá, poznáš z tvaru slova, ne z jeho místa ve větě. V zadání volá maminka. U každé možnosti se zeptej, kdo volá tam.",
    ],
    e: "„Petra volá maminka.“ má stejná slova ve stejných tvarech, jen v jiném pořadí — volá pořád maminka. Tvary „Petr“ a „maminku“ by roli obrátily.",
    emoji: "📞",
  },
  {
    q: "„Učitelka chválí Jirku.“ Která věta říká totéž?",
    a: "Jirku chválí učitelka.",
    d: [
      { value: "Jirka chválí učitelku.", why: "Tady chválí Jirka. Změnil se tvar slov, a tím i to, kdo koho chválí." },
      { value: "Učitelku chválí Jirka.", why: "I tady chválí Jirka. Jiné pořadí, ale tvary smysl obrátily." },
      { value: "Jirku chválí trenér.", why: "Tvary jsou v pořádku, ale chválí trenér, ne učitelka." },
    ],
    h: [
      "Přehodit slova je dovolené. Musí ale zůstat ve stejném tvaru.",
      "Kdo koho chválí, prozradí tvar slova, ne jeho místo ve větě. V zadání chválí učitelka. Projdi možnosti a u každé urči, kdo chválí tam.",
    ],
    e: "„Jirku chválí učitelka.“ má stejná slova ve stejných tvarech, jen v jiném pořadí — chválí pořád učitelka. Tvary „Jirka“ a „učitelku“ by roli obrátily.",
    emoji: "👏",
  },
  {
    q: "„Tomáš předběhl Davida.“ Která věta říká totéž?",
    a: "Davida předběhl Tomáš.",
    d: [
      { value: "David předběhl Tomáše.", why: "Tady předběhl David. Tvary se změnily, a s nimi i to, kdo byl rychlejší." },
      { value: "Tomáše předběhl David.", why: "I tady předběhl David. Pořádek je jiný, ale tvary obrátily smysl." },
      { value: "Davida předběhl Marek.", why: "Tvary jsou v pořádku, ale předběhl Marek, ne Tomáš." },
    ],
    h: [
      "Slova se přehodit smějí, tvary se měnit nesmějí. Porovnej je.",
      "Kdo koho předběhl, poznáš z tvaru jména, ne z jeho místa ve větě. V zadání předběhl Tomáš. U každé možnosti urči, kdo předběhl tam.",
    ],
    e: "„Davida předběhl Tomáš.“ má stejná jména ve stejných tvarech, jen v jiném pořadí — předběhl pořád Tomáš. Tvary „David“ a „Tomáše“ by roli obrátily.",
    emoji: "🏁",
  },
  {
    q: "„Babička češe Lucku.“ Která věta říká totéž?",
    a: "Lucku češe babička.",
    d: [
      { value: "Lucka češe babičku.", why: "Tady češe Lucka. Tvary se změnily, a tím i to, kdo koho češe." },
      { value: "Babičku češe Lucka.", why: "I tady češe Lucka. Jiné pořadí, ale tvary smysl obrátily." },
      { value: "Lucku češe máma.", why: "Tvary jsou v pořádku, ale češe máma, ne babička." },
    ],
    h: [
      "Přehozená slova smysl nezmění. Změněný tvar slova ale ano.",
      "Kdo koho češe, prozradí tvar slova, ne jeho místo ve větě. V zadání češe babička. Projdi možnosti a u každé se zeptej, kdo češe tam.",
    ],
    e: "„Lucku češe babička.“ má stejná slova ve stejných tvarech, jen v jiném pořadí — češe pořád babička. Tvary „Lucka“ a „babičku“ by roli obrátily.",
    emoji: "💇",
  },
  {
    q: "„Slon postříkal klauna.“ Která věta říká totéž?",
    a: "Klauna postříkal slon.",
    d: [
      { value: "Klaun postříkal slona.", why: "Tady stříkal klaun. Tvary se změnily, a s nimi i to, kdo koho postříkal." },
      { value: "Slona postříkal klaun.", why: "I tady stříkal klaun. Pořádek je jiný, ale tvary obrátily smysl." },
      { value: "Klauna postříkal tygr.", why: "Tvary jsou v pořádku, ale stříkal tygr, ne slon." },
    ],
    h: [
      "Slova se přehodit smějí, tvary se měnit nesmějí. Porovnej je.",
      "Kdo koho postříkal, poznáš z tvaru slova, ne z jeho místa ve větě. V zadání stříkal slon. U každé možnosti urči, kdo stříkal tam.",
    ],
    e: "„Klauna postříkal slon.“ má stejná slova ve stejných tvarech, jen v jiném pořadí — stříkal pořád slon. Tvary „klaun“ a „slona“ by roli obrátily.",
    emoji: "🐘",
  },
  {
    q: "„Sova vyplašila myšku.“ Která věta říká totéž?",
    a: "Myšku vyplašila sova.",
    d: [
      { value: "Myška vyplašila sovu.", why: "Tady plaší myška, ne sova. Tvary se změnily, a tím i to, kdo koho vyplašil." },
      { value: "Sovu vyplašila myška.", why: "I tady plaší myška. Jiné pořadí, ale tvary smysl obrátily." },
      { value: "Myšku vyplašila liška.", why: "Tvary jsou v pořádku, ale vyplašila liška, ne sova." },
    ],
    h: [
      "Přehozená slova smysl nezmění. Změněný tvar slova ale ano.",
      "Kdo koho vyplašil, prozradí tvar slova, ne jeho místo ve větě. V zadání plašila sova. Projdi možnosti a u každé se zeptej, kdo plašil tam.",
    ],
    e: "„Myšku vyplašila sova.“ má stejná slova ve stejných tvarech, jen v jiném pořadí — plašila pořád sova. Tvary „myška“ a „sovu“ by roli obrátily.",
    emoji: "🦉",
  },
];

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(ZAKLAD).map(l1);
  if (level === 2) return shuffle(ZAKLAD).map(l2);
  return shuffle([...DVE_VAZBY, ...PROHOZENE_TVARY]).map(rucni);
}

export const PORADEK_SLOV_VE_VETE: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-slovo-a-veta-poradek-slov-ve-vete",
    rvpNodeId: "g2-cjl-jazykova-vychova-slovo-a-veta-poradek-slov-ve-vete",
    title: "Pořádek slov ve větě",
    studentTitle: "Pořádek slov",
    illustrationDesc:
      "dítě skládá na stole kartičky se slovy do jedné řady a dívá se na ně zblízka",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Slovo a věta",
    briefDescription:
      "Poznáš, kdy slova ve větě stojí správně, a kdy se smysl věty změní.",
    keywords: [
      "pořádek slov",
      "slovosled",
      "pořadí slov",
      "pořádek slov ve větě",
      "přehazování slov",
      "předložka ve větě",
      "sestavit větu",
    ],
    goals: [
      "Poznat větu, ve které slova stojí tak, aby věta dávala smysl.",
      "Vědět, že předložka stojí vždy hned před slovem, ke kterému patří.",
      "Vědět, že pořádek slov se dá měnit a smysl věty zůstane stejný.",
      "Poznat, že změna tvaru slova smysl věty změní, i když slova zůstanou.",
    ],
    boundaries: [
      "Jen jednoduché věty, bez souvětí.",
      "Bez pojmů podmět, přísudek, předmět — mluví se o slovech a jejich tvarech.",
      "Bez pravidel o příklonkách („se“, „si“) — to není obsah 2. ročníku.",
    ],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Předložka stojí vždy hned před svým slovem. Slova se dají přehodit, smysl zůstane — dokud se nezmění jejich tvar.",
      steps: [
        "Přečti větu nahlas. Dá se takhle říct?",
        "Najdi předložku („v“, „na“, „u“, „do“) a zkontroluj, že hned za ní stojí slovo, ke kterému patří.",
        "Když porovnáváš dvě věty, projdi je slovo po slovu: jsou to stejná slova a stejné tvary?",
      ],
      commonMistake:
        "Dítě si myslí, že přehozená slova vždy říkají totéž. Jenže „Kočka honí psa.“ a „Pes honí kočku.“ mají jiné tvary slov, a proto jiný smysl.",
      example:
        "Pes spí v boudě. = V boudě spí pes. · Pes spí boudě v. — takhle to nejde, předložka se odtrhla.",
    },
  },
];
