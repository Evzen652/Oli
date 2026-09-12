import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";
import { plural } from "@/lib/czechGrammar";

// Přepsáno 2026-09-11 (inventura obsahu). Dřív 8/8/10 úloh, jedna nápověda
// sdílená dvaceti úlohami, chybné možnosti bez zpětné vazby a u zápisu čárek
// se distraktory lišily od klíče jen interpunkcí. Teď tři disjunktní banky:
//
//   L1 rozpoznání — krátká věta s 1 nebo 2 ději: kolik má sloves a jaká je to věta.
//   L2 aplikace   — kolik vět tvoří zápis; pasti: výčet se spojkou „a“,
//                   složený tvar („šel jsem“, „budeme malovat“), dlouhá věta
//                   jednoduchá, souvětí ze tří vět.
//   L3 transfer   — dva kroky: najít hranice vět a u každé rozhodnout o čárce
//                   (před „ale, protože, když, aby, že“ ano, před slučovací
//                   „a, nebo“ ne; věta s „když“ na začátku se odděluje za sebou).

const CISLOVKA_F = ["žádná", "jedna", "dvě", "tři", "čtyři"];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const seznam = (xs: string[]) => xs.map((x) => `„${x}“`).join(", ");

// ─── L1: kolik sloves a jaká věta ───────────────────────────────────────────

interface L1Item {
  v: string;
  slovesa: string[];
  /** Otázky, které dítě dovedou k dějům (velká nápověda). */
  ptej: string;
}

const L1: L1Item[] = [
  { v: "Pes štěká.", slovesa: ["štěká"], ptej: "Co dělá pes?" },
  { v: "Pes štěká a kočka mňouká.", slovesa: ["štěká", "mňouká"], ptej: "Co dělá pes? A co dělá kočka?" },
  { v: "Slunce svítí.", slovesa: ["svítí"], ptej: "Co dělá slunce?" },
  { v: "Maminka vaří a tatínek čte.", slovesa: ["vaří", "čte"], ptej: "Co dělá maminka? A co tatínek?" },
  { v: "Prší.", slovesa: ["prší"], ptej: "Co se venku děje?" },
  { v: "Děti si hrají na zahradě.", slovesa: ["hrají si"], ptej: "Co dělají děti? Slova „na zahradě“ říkají jen kde." },
  { v: "Honza kreslí, ale Eva zpívá.", slovesa: ["kreslí", "zpívá"], ptej: "Co dělá Honza? A co dělá Eva?" },
  { v: "Na louce kvetou vlčí máky.", slovesa: ["kvetou"], ptej: "Co dělají máky? Slova „na louce“ a „vlčí“ jen popisují." },
  { v: "Vítr fouká a listí padá.", slovesa: ["fouká", "padá"], ptej: "Co dělá vítr? A co se děje s listím?" },
  { v: "Babička plete teplý svetr.", slovesa: ["plete"], ptej: "Co dělá babička? Slovo „teplý“ jen popisuje svetr." },
  { v: "Ptáci zpívají a stromy kvetou.", slovesa: ["zpívají", "kvetou"], ptej: "Co dělají ptáci? A co stromy?" },
  { v: "Kuba běží rychle, ale Tom ho dohoní.", slovesa: ["běží", "dohoní"], ptej: "Co dělá Kuba? A co udělá Tom?" },
  { v: "Moje sestra hraje na klavír.", slovesa: ["hraje"], ptej: "Co dělá sestra? Slova „moje“ a „na klavír“ děj nejsou." },
  { v: "Venku sněží a děti staví sněhuláka.", slovesa: ["sněží", "staví"], ptej: "Co se děje venku? A co dělají děti?" },
  { v: "Vlak přijel na nádraží.", slovesa: ["přijel"], ptej: "Co udělal vlak? „Na nádraží“ říká jen kam." },
  { v: "Kočka spí a myš utíká.", slovesa: ["spí", "utíká"], ptej: "Co dělá kočka? A co myš?" },
];

const lbl = (typ: "věta jednoduchá" | "souvětí", n: number) => `${typ} — ${n} ${plural(n, "sloveso", "slovesa", "sloves")}`;

function ulohaL1({ v, slovesa, ptej }: L1Item): PracticeTask {
  const [s0, s1] = slovesa;
  const J1 = lbl("věta jednoduchá", 1);
  const S2 = lbl("souvětí", 2);
  const J2 = lbl("věta jednoduchá", 2);
  const S1 = lbl("souvětí", 1);
  const docs = {
    hints: [
      `Přečti „${v}“ a hledej slova, která říkají, co kdo dělá.`,
      `Ptej se: ${ptej} Každá odpověď na otázku „co dělá?“ je jeden děj. Spočítej děje a podle jejich počtu rozhodni, jaká je to věta.`,
    ] as [string, string],
  };
  if (slovesa.length === 1) {
    return choice(`Kolik sloves má „${v}“ a je to věta jednoduchá, nebo souvětí?`, J1, [
      { value: S2, why: `Druhý děj tu není — jediné sloveso je „${s0}“. Ostatní slova říkají kdo, co nebo kde.` },
      { value: J2, why: `Sloveso je jen jedno („${s0}“), ne dvě. Ostatní slova žádný děj nepopisují.` },
      { value: S1, why: `Sloveso je opravdu jedno („${s0}“), jenže s jedním slovesem je to věta jednoduchá. Souvětí má sloves aspoň dvě.` },
    ], {
      ...docs,
      explanation: `V „${v}“ je jediné sloveso „${s0}“ — věta popisuje jeden děj. Jeden děj znamená jednu větu, a proto je to věta jednoduchá.`,
    });
  }
  return choice(`Kolik sloves má „${v}“ a je to věta jednoduchá, nebo souvětí?`, S2, [
    { value: J1, why: `Jeden děj ti utekl: ve větě je „${s0}“ i „${s1}“. S dvěma ději už to věta jednoduchá není.` },
    { value: J2, why: `Slovesa jsou opravdu dvě („${s0}“, „${s1}“), ale dva děje znamenají dvě věty spojené dohromady — a to je souvětí.` },
    { value: S1, why: `Je to souvětí, ale sloveso není jedno: najdeš „${s0}“ i „${s1}“.` },
  ], {
    ...docs,
    explanation: `V „${v}“ jsou dva děje: „${s0}“ a „${s1}“. Každý děj tvoří jednu větu a obě věty jsou spojené dohromady, a proto je to souvětí.`,
  });
}

// ─── L2: z kolika vět se zápis skládá (pasti) ───────────────────────────────

interface L2Item {
  v: string;
  slovesa: string[];
  /** Past: kolik vět dítě typicky napočítá a proč je to chyba. */
  past: [number, string];
  /** Konkrétní upozornění do velké nápovědy (neprozrazuje počet). */
  tip: string;
}

const L2: L2Item[] = [
  { v: "Šel jsem do obchodu a koupil jsem rohlíky.", slovesa: ["šel jsem", "koupil jsem"], past: [4, "Slovo „jsem“ není samostatný děj — patří k „šel“ a ke „koupil“ a tvoří s nimi jeden tvar slovesa."], tip: "Slůvko „jsem“ tu samo nic nedělá — hledej, ke kterému slovesu patří." },
  { v: "Bratr a sestra spí.", slovesa: ["spí"], past: [2, "Spojka „a“ tu spojuje dvě jména (bratr, sestra), ne dvě věty. Oba dělají stejný děj."], tip: "Spojka „a“ může spojovat děje, ale i jména — zjisti, co stojí po jejích stranách." },
  { v: "Koupili jsme chleba, máslo a sýr.", slovesa: ["koupili jsme"], past: [3, "Chleba, máslo a sýr je výčet věcí, které se koupily. Čárky a „a“ tu oddělují věci, ne věty."], tip: "Čárky a „a“ tu oddělují položky nákupu. Jsou mezi nimi i další děje?" },
  { v: "Velký hnědý medvěd spí v jeskyni pod skálou.", slovesa: ["spí"], past: [2, "Délka neurčuje počet vět. „Velký“, „hnědý“ a „pod skálou“ jen popisují medvěda a místo."], tip: "Věta je dlouhá, ale počítají se děje, ne slova. Která slova jen popisují, jaký medvěd je a kde?" },
  { v: "Když prší, zůstaneme doma.", slovesa: ["prší", "zůstaneme"], past: [1, "„Prší“ je samostatný děj, i když je to jediné slovo. Spolu se „zůstaneme“ jsou to dva děje."], tip: "I jediné slovo může být celá věta. Co se děje a co uděláme?" },
  { v: "Zítra budeme malovat obrázky.", slovesa: ["budeme malovat"], past: [2, "„Budeme malovat“ je jeden děj v budoucím čase — „budeme“ jen říká, že se to stane zítra."], tip: "Slovo „budeme“ tu nestojí samo — tvoří budoucí čas s jiným slovesem." },
  { v: "Petr zůstal doma, protože byl nemocný.", slovesa: ["zůstal", "byl nemocný"], past: [1, "Věta se spojkou „protože“ má vlastní sloveso („byl“) — je to druhá věta souvětí."], tip: "Za spojkou „protože“ následuje důvod. Má ta část vlastní sloveso?" },
  { v: "Babička upekla koláč a dědeček uvařil čaj.", slovesa: ["upekla", "uvařil"], past: [3, "Koláč a čaj nejsou děje, jsou to věci. Děje jsou jen dva: babička upekla, dědeček uvařil."], tip: "Každý z nich dělá něco jiného. Kolik různých dějů popisuje zápis?" },
  { v: "Tomáš vstal, umyl se a šel do školy.", slovesa: ["vstal", "umyl se", "šel"], past: [2, "Tomáš je sice jen jeden, ale dělá tři různé věci za sebou — tři děje jsou tři věty."], tip: "Jedna osoba může dělat víc věcí za sebou. Projdi, co všechno Tomáš udělal." },
  { v: "Na stole ležely hrušky, švestky a meruňky.", slovesa: ["ležely"], past: [3, "Hrušky, švestky a meruňky jsou výčet ovoce. Všechno ovoce dělá jeden děj — leží."], tip: "Na stole je víc druhů ovoce. Dělá každé něco jiného, nebo všechno totéž?" },
  { v: "Víš, že zítra pojedeme na výlet?", slovesa: ["víš", "pojedeme"], past: [1, "Otázka může být souvětí: „víš“ je jeden děj a „pojedeme“ druhý, spojuje je „že“."], tip: "I otázka může mít víc dějů. Co se ptáš a co se zítra stane?" },
  { v: "Kočka vyskočila na plot, ale pes zůstal dole.", slovesa: ["vyskočila", "zůstal"], past: [3, "„Na plot“ a „dole“ říkají jen kde. Děje jsou dva: kočka vyskočila, pes zůstal."], tip: "Slova „na plot“ a „dole“ říkají kde. Co udělala kočka a co pes?" },
  { v: "Maminka nakoupila, uvařila oběd a pak si sedla ke knize.", slovesa: ["nakoupila", "uvařila", "sedla si"], past: [4, "„Pak“ není sloveso, jen říká, kdy se to stalo. Děje jsou tři."], tip: "Slůvko „pak“ říká jen kdy. Najdi všechno, co maminka udělala." },
  { v: "Ráno bude pršet, ale odpoledne vysvitne slunce.", slovesa: ["bude pršet", "vysvitne"], past: [3, "„Bude pršet“ je jeden děj v budoucím čase, ne dva. Spolu s „vysvitne“ jsou to dva děje."], tip: "Slovo „bude“ tvoří budoucí čas spolu s dalším slovesem — počítej je dohromady jako jeden děj." },
  { v: "Děti zpívaly, tančily a smály se.", slovesa: ["zpívaly", "tančily", "smály se"], past: [1, "Podmět je sice jeden (děti), ale dějů je víc — každý děj je jedna věta."], tip: "Děti jsou jedny, ale co všechno dělaly? Spočítej jednotlivé děje." },
  { v: "Holky a kluci běží na hřiště.", slovesa: ["běží"], past: [2, "Spojka „a“ spojuje holky a kluky, ne dvě věty. Všichni dělají jeden děj — běží."], tip: "Zjisti, co spojka „a“ spojuje: dva děje, nebo dvě skupiny dětí?" },
];

const zVet = (n: number) => `${n === 1 ? "z" : "ze"} ${n} ${plural(n, "věty", "vět", "vět")}`;
const kolikVet = (n: number) => `${cap(CISLOVKA_F[n])} ${plural(n, "věta", "věty", "vět")}?`;

function ulohaL2({ v, slovesa, past, tip }: L2Item): PracticeTask {
  const n = slovesa.length;
  const key = zVet(n);
  const deju = `${n} ${plural(n, "děj", "děje", "dějů")}`;
  const distr = [1, 2, 3, 4].filter((k) => k !== n).map((k): Distractor => {
    let why: string;
    if (k === past[0]) why = `${kolikVet(k)} ${past[1]}`;
    else if (k < n) why = `${kolikVet(k)} Některý děj ti utekl — slovesa jsou tu: ${seznam(slovesa)}.`;
    else why = `${kolikVet(k)} Tolik dějů tu není — každá věta potřebuje své sloveso a v zápisu najdeš ${plural(n, "jen tento děj", "jen tyto děje", "jen tyto děje")}: ${seznam(slovesa)}.`;
    return { value: zVet(k), why };
  }) as [Distractor, Distractor, Distractor];
  return choice(`Z kolika vět se skládá „${v}“?`, key, distr, {
    hints: [
      `Najdi v „${v}“ všechna slova, která říkají, co se děje.`,
      `${tip} Každý děj (sloveso) tvoří jednu větu — kolik dějů najdeš, tolik vět zápis má.`,
    ],
    explanation: `Děje v zápisu: ${seznam(slovesa)} — dohromady ${deju}. Kolik dějů, tolik vět, ${n === 1 ? "takže je to věta jednoduchá." : "takže je to souvětí."} ${past[1]}`,
  });
}

// ─── L3: čárky v souvětí (hranice vět + pravidlo) ───────────────────────────

interface L3Pocet {
  typ: "pocet";
  v: string;
  spravne: string;
  carek: number;
  hranic: number;
  /** Kde se čárka NEpíše (zpětná vazba, když jich dítě dá moc). */
  moc: string;
  /** Kde se čárka píše (zpětná vazba, když jich dítě dá málo). */
  malo: string;
  /** Upozornění do velké nápovědy — na spojky v tomto souvětí. */
  tip: string;
}

interface L3Pred {
  typ: "pred";
  v: string;
  spravne: string;
  klic: string;
  spatne: [[string, string], [string, string], [string, string]];
  tip: string;
}

type L3Item = L3Pocet | L3Pred;

const L3: L3Item[] = [
  {
    typ: "pocet", v: "Chtěl jsem jít ven ale pršelo.", spravne: "Chtěl jsem jít ven, ale pršelo.", carek: 1, hranic: 1,
    moc: "", malo: "Před spojkou „ale“ čárka patří vždycky.",
    tip: "Souvětí spojuje spojka „ale“.",
  },
  {
    typ: "pocet", v: "Přišel Petr a Anna zpívala a Bára tancovala.", spravne: "Přišel Petr a Anna zpívala a Bára tancovala.", carek: 0, hranic: 2,
    moc: "Věty tu spojuje jen slučovací „a“ a před ním se čárka nepíše — ani mezi dvěma větami.", malo: "",
    tip: "Obě hranice mezi větami tvoří spojka „a“.",
  },
  {
    typ: "pocet", v: "Zůstali jsme doma protože venku pršelo.", spravne: "Zůstali jsme doma, protože venku pršelo.", carek: 1, hranic: 1,
    moc: "", malo: "Před „protože“ (věta s důvodem) čárka patří vždycky.",
    tip: "Druhá věta říká důvod a začíná spojkou „protože“.",
  },
  {
    typ: "pocet", v: "Chtěl jsem jít ven ale pršelo a proto jsem zůstal doma.", spravne: "Chtěl jsem jít ven, ale pršelo, a proto jsem zůstal doma.", carek: 2, hranic: 2,
    moc: "", malo: "Čárka patří před „ale“ i před „a proto“ — „a proto“ je jedna spojka, která ohlašuje důsledek.",
    tip: "Hranice tvoří spojky „ale“ a „a proto“. Pozor: „a proto“ se chová jinak než samotné „a“.",
  },
  {
    typ: "pocet", v: "Maminka vaří oběd a tatínek myje nádobí.", spravne: "Maminka vaří oběd a tatínek myje nádobí.", carek: 0, hranic: 1,
    moc: "Věty spojuje slučovací „a“ — před ním se čárka nepíše, i když spojuje dvě věty.", malo: "",
    tip: "Obě věty spojuje spojka „a“.",
  },
  {
    typ: "pocet", v: "Pospíchej abys nepřišel pozdě.", spravne: "Pospíchej, abys nepřišel pozdě.", carek: 1, hranic: 1,
    moc: "", malo: "Před „abys“ (věta říká, proč pospíchat) čárka patří.",
    tip: "Druhá věta začíná spojkou „abys“ a říká, k čemu to je.",
  },
  {
    typ: "pocet", v: "Tonda maluje a Věra zpívá ale Eva jen poslouchá.", spravne: "Tonda maluje a Věra zpívá, ale Eva jen poslouchá.", carek: 1, hranic: 2,
    moc: "Před „a“ mezi „maluje“ a „Věra“ se čárka nepíše — je to slučovací „a“.", malo: "Před „ale“ čárka patří vždycky.",
    tip: "V souvětí jsou dvě spojky: „a“ a „ale“. Každá se řídí jiným pravidlem.",
  },
  {
    typ: "pocet", v: "Pes štěkal ale kočka spala a myš utekla.", spravne: "Pes štěkal, ale kočka spala a myš utekla.", carek: 1, hranic: 2,
    moc: "Před „a“ mezi „spala“ a „myš“ se čárka nepíše — je to slučovací „a“.", malo: "Před „ale“ čárka patří vždycky.",
    tip: "Hranice mezi větami tvoří „ale“ a „a“. Rozhodni u každé zvlášť.",
  },
  {
    typ: "pocet", v: "Petr se učil ale nestihl to protože byl unavený.", spravne: "Petr se učil, ale nestihl to, protože byl unavený.", carek: 2, hranic: 2,
    moc: "", malo: "Čárka patří před „ale“ i před „protože“ — obě tyto spojky čárku chtějí.",
    tip: "V souvětí jsou spojky „ale“ a „protože“.",
  },
  {
    typ: "pocet", v: "Půjdeme do kina nebo zůstaneme doma.", spravne: "Půjdeme do kina nebo zůstaneme doma.", carek: 0, hranic: 1,
    moc: "Před „nebo“ se čárka nepíše — patří mezi spojky a, i, ani, nebo, před kterými čárka není.", malo: "",
    tip: "Věty spojuje spojka „nebo“.",
  },
  {
    typ: "pocet", v: "Když jsem se probudil snídal jsem a pak jsem šel do školy.", spravne: "Když jsem se probudil, snídal jsem a pak jsem šel do školy.", carek: 1, hranic: 2,
    moc: "Před „a pak“ se čárka nepíše — „a“ tu slučuje dva děje, které jdou po sobě.", malo: "Věta s „když“ na začátku se odděluje čárkou tam, kde končí — za „probudil“.",
    tip: "Souvětí začíná větou se spojkou „když“. Pak následuje spojka „a“.",
  },
  {
    typ: "pred", v: "Když skončí škola půjdeme na hřiště.", spravne: "Když skončí škola, půjdeme na hřiště.", klic: "půjdeme",
    spatne: [
      ["když", "Na začátku souvětí čárka nikdy není. Věta s „když“ se odděluje až tam, kde končí."],
      ["škola", "Tady by čárka rozdělila „skončí škola“, a to patří k sobě — je to jedna věta."],
      ["na", "„Na hřiště“ patří k „půjdeme“ — uprostřed jedné věty čárka není."],
    ],
    tip: "Souvětí začíná větou se spojkou „když“. Najdi, kde tahle věta končí a začíná druhá.",
  },
  {
    typ: "pred", v: "Když jsme přišli domů maminka už vařila večeři.", spravne: "Když jsme přišli domů, maminka už vařila večeři.", klic: "maminka",
    spatne: [
      ["jsme", "„Když jsme přišli“ patří k sobě — čárka by rozdělila jednu větu."],
      ["domů", "„Domů“ ještě patří k první větě („přišli domů“), ta končí až za ním."],
      ["už", "„Maminka už vařila“ je jedna věta — mezi „maminka“ a „už“ čárka není."],
    ],
    tip: "První věta začíná „když“ a má sloveso „přišli“. Kde končí a kde začíná věta o mamince?",
  },
  {
    typ: "pred", v: "Víme že zítra bude pěkně.", spravne: "Víme, že zítra bude pěkně.", klic: "že",
    spatne: [
      ["zítra", "„Že zítra bude pěkně“ je jedna věta — čárka patří na její začátek, ne doprostřed."],
      ["bude", "„Zítra bude pěkně“ patří k sobě, uprostřed věty čárka není."],
      ["pěkně", "„Bude pěkně“ je jeden celek, čárka by rozdělila větu."],
    ],
    tip: "Souvětí má dvě slovesa: „víme“ a „bude“. Jaké slovo spojuje obě věty?",
  },
  {
    typ: "pred", v: "Když prší vezmeme si deštníky a půjdeme ven.", spravne: "Když prší, vezmeme si deštníky a půjdeme ven.", klic: "vezmeme",
    spatne: [
      ["a", "Před slučovacím „a“ se čárka nepíše, ani když spojuje dvě věty."],
      ["si", "„Vezmeme si“ patří k sobě — je to jedno sloveso."],
      ["deštníky", "„Vezmeme si deštníky“ je jedna věta, uprostřed čárka není."],
    ],
    tip: "Souvětí začíná „když“ a má tři slovesa. Čárka je jen jedna — u které hranice mezi větami?",
  },
  {
    typ: "pred", v: "Honza nepřišel do školy protože byl nemocný.", spravne: "Honza nepřišel do školy, protože byl nemocný.", klic: "protože",
    spatne: [
      ["do", "„Nepřišel do školy“ je jedna věta — mezi „nepřišel“ a „do“ čárka není."],
      ["byl", "„Byl“ patří do věty s důvodem, ta začíná už o slovo dřív."],
      ["nemocný", "„Byl nemocný“ patří k sobě, čárka by rozdělila větu."],
    ],
    tip: "Druhá věta vysvětluje, proč Honza nepřišel. Kterým slovem začíná?",
  },
  {
    typ: "pred", v: "Ráno pršelo ale odpoledne vysvitlo slunce.", spravne: "Ráno pršelo, ale odpoledne vysvitlo slunce.", klic: "ale",
    spatne: [
      ["odpoledne", "„Odpoledne“ patří už do druhé věty, ta začíná o slovo dřív — spojkou."],
      ["vysvitlo", "„Odpoledne vysvitlo slunce“ je jedna věta, uprostřed čárka není."],
      ["slunce", "„Vysvitlo slunce“ patří k sobě — čárka by rozdělila větu."],
    ],
    tip: "Souvětí má slovesa „pršelo“ a „vysvitlo“. Která spojka stojí mezi nimi?",
  },
];

const PRAVIDLO = "Čárku píšeme před ale, protože, když, aby, že; před slučovacím a, i, ani, nebo ne.";

function ulohaL3(it: L3Item): PracticeTask {
  if (it.typ === "pred") {
    const pred = (w: string) => `před „${w}“`;
    return choice(`Před které slovo patří čárka v souvětí „${it.v}“?`, pred(it.klic),
      it.spatne.map(([w, why]) => ({ value: pred(w), why })) as [Distractor, Distractor, Distractor], {
        hints: [
          `Najdi v „${it.v}“ slovesa. Kde končí první věta a kde začíná další?`,
          `${it.tip} Čárka odděluje celé věty, nikdy nerozdělí jednu větu uprostřed. ${PRAVIDLO}`,
        ],
        explanation: `Správně: „${it.spravne}“. Čárka stojí přesně na hranici mezi dvěma větami souvětí, a proto patří ${pred(it.klic)}.`,
      });
  }
  const { v, spravne, carek, hranic, moc, malo, tip } = it;
  const distr = [0, 1, 2, 3].filter((k) => k !== carek).map((k): Distractor => {
    const word = cap(CISLOVKA_F[k]);
    let why: string;
    if (k > hranic) why = `${word}? Tolik čárek ani nejde — souvětí má jen ${hranic} ${plural(hranic, "hranici", "hranice", "hranic")} mezi větami.`;
    else if (k > carek) why = `${word}? To je moc. ${moc}`;
    else why = `${word}? To je málo. ${malo}`;
    return { value: CISLOVKA_F[k], why };
  }) as [Distractor, Distractor, Distractor];
  // Zadání nesmí předjímat, že čárka chybí: u souvětí spojených jen slučovacím
  // „a / nebo“ je správná odpověď „žádná“ a věta „chybí čárky“ by dítě navedla špatně.
  return choice(`Kolik čárek patří do souvětí „${v}“?`, CISLOVKA_F[carek], distr, {
    hints: [
      `Najdi v „${v}“ slovesa a místa, kde končí první věta a začíná další.`,
      `${tip} U každé hranice mezi větami rozhodni podle spojky: ${PRAVIDLO}`,
    ],
    explanation: `Správně: „${spravne}“. ${carek === 0 ? moc : malo}${carek > 0 && moc ? ` ${moc}` : ""}`,
  });
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1).map(ulohaL1);
  if (level === 2) return shuffle(L2).map(ulohaL2);
  return shuffle(L3).map(ulohaL3);
}

export const VETAJJEDNODUCHASONVETI: TopicMetadata[] = [
  {
    id: "g3-cjl-veta-jednoducha-souveti",
    rvpNodeId: "g3-cjl-jazykova-vychova-skladba-veta-jednoducha-a-souveti-uvod",
    title: "Věta jednoduchá a souvětí (úvod)",
    studentTitle: "Věta a souvětí",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Poznáš rozdíl mezi větou jednoduchou a souvětím.",
    keywords: ["věta jednoduchá", "souvětí", "spojka", "sloveso", "děj"],
    goals: ["Rozlišit větu jednoduchou a souvětí.", "Spočítat věty v souvětí.", "Najít spojku spojující věty."],
    boundaries: ["Základní souvětí se dvěma větami."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Věta jednoduchá = 1 sloveso. Souvětí = 2+ slovesa spojená spojkou (a, ale, nebo, protože, když…).",
      steps: ["Najdi všechna slovesa (děje) ve větě.", "Jedno sloveso → věta jednoduchá.", "Dvě a více sloves s spojkou → souvětí."],
      commonMistake: "Výčet ('chleba, máslo a sýr') není souvětí — je to jen jedno sloveso s více předměty.",
      example: "Jana čte. (jednoduchá) × Jana čte a Petr píše. (souvětí — dvě slovesa: čte, píše)",
    },
  },
];
