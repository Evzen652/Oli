import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";
import { plural } from "@/lib/czechGrammar";

// Přepsáno 2026-09-11 (inventura obsahu): úrovně měly jen 8/9/12 ručních otázek,
// většina úloh sdílela jednu dvojici nápověd, chybné možnosti neměly zpětnou vazbu
// a bez vysvětlení. Teď parametrické úlohy s nápovědami z čísel konkrétní úlohy:
//   L1 rozpoznání — kružnice (čára) × kruh (plocha) na věcech kolem nás; pojmy
//                   střed, poloměr, průměr, kružítko; poloměr přečtený z rozevření od nuly
//   L2 aplikace   — poloměr → průměr, průměr → poloměr; rozevření kružítka mimo nulu
//   L3 transfer   — kde leží bod (průměr → poloměr → porovnání); porovnání dvou kružnic
//                   zadaných různě; pruh mezi soustřednými kružnicemi; kolik kružnic se
//                   vejde na úsečku; poloměr z průměru na pravítku (dva kroky)
// Jen celé centimetry, průměr vždy sudý tam, kde se dělí (RVP 3. ročníku).

/** Vybere první tři různé distraktory, které se neshodují s klíčem (dedup po vygenerování tvaru). */
function tri(key: string, cands: Distractor[]): [Distractor, Distractor, Distractor] {
  const seen = new Set([key]);
  const out: Distractor[] = [];
  for (const c of cands) {
    if (seen.has(c.value)) continue;
    seen.add(c.value);
    out.push(c);
    if (out.length === 3) return out as [Distractor, Distractor, Distractor];
  }
  throw new Error(`Málo různých distraktorů pro klíč „${key}“`);
}

const kruznic = (n: number) => `${n} ${plural(n, "kružnice", "kružnice", "kružnic")}`;
const prumeru = (n: number) => `${n} ${plural(n, "průměr", "průměry", "průměrů")}`;

// ─── L1 · rozpoznání ────────────────────────────────────────────────────────

interface Vec {
  q: string;
  key: "kružnice" | "kruh";
  h0: string;
  h1: string;
  proc: string;
  /** Proč je chybná ta druhá možnost (kruh ↔ kružnice) právě u této věci. */
  zamena: string;
  /** Proč to není koule. */
  koule: string;
}

const VECI: Vec[] = [
  {
    q: "Obkreslíš minci tužkou jen po okraji a vnitřek necháš prázdný. Jaký útvar vznikne?",
    key: "kružnice",
    h0: "Na papíře zůstane jen tenká kulatá čára. Je vnitřek vybarvený?",
    h1: "Rozhoduje, jestli útvar tvoří jen čára, nebo i plocha uvnitř. Tužka obešla minci jen po okraji a dovnitř nic nenakreslila. Který pojem znamená jen tu kulatou čáru?",
    proc: "Po obkreslení zůstala jen čára dokola a vnitřek je prázdný. Samotná kulatá čára je kružnice; kruh by to byl, kdyby byl vybarvený i vnitřek.",
    zamena: "Kruh je vybarvená plocha. Tady je vnitřek prázdný, zůstala jen čára.",
    koule: "Koule je těleso, jako míč. Obkreslením na papír vznikne jen plochý obrázek.",
  },
  {
    q: "Obkreslíš minci a celý vnitřek vybarvíš pastelkou. Jaký útvar vznikne?",
    key: "kruh",
    h0: "Je na papíře jen čára dokola, nebo i vybarvená plocha?",
    h1: "Když je vybarvený i vnitřek, nejde už jen o čáru, ale o celou plochu, kterou čára ohraničuje. Pojmenuj útvar, ke kterému patří i všechno uvnitř okraje.",
    proc: "Vybarvením vznikla kulatá plocha i s okrajem. Taková plocha je kruh; kružnice by byla jen ta čára po okraji.",
    zamena: "Kružnice je jen čára po okraji. Tady je vybarvený i celý vnitřek, tedy plocha.",
    koule: "Koule je těleso, které se dá chytit do ruky. Vybarvený obrázek na papíře je plochý.",
  },
  {
    q: "Kružítkem uděláš jednu celou otočku. Jak se jmenuje čára, která vznikne?",
    key: "kružnice",
    h0: "Tuha kružítka nakreslí jen tenkou čáru, vnitřek zůstane bílý.",
    h1: "Kružítko drží tuhu pořád stejně daleko od hrotu, proto nakreslí uzavřenou kulatou čáru. Plochu uvnitř nevybarví. Jak se taková čára jmenuje?",
    proc: "Kružítko kreslí čáru, jejíž body jsou všechny stejně daleko od hrotu — to je kružnice. Kruh by vznikl až vybarvením vnitřku.",
    zamena: "Kružítko vybarvenou plochu neudělá, nakreslí jen čáru. Kruh je plocha.",
    koule: "Koule je těleso, kružítkem na papír nakreslíš jen plochou čáru.",
  },
  {
    q: "Z papíru vystřihneš kulatý podtácek pod hrnek. Který útvar připomíná?",
    key: "kruh",
    h0: "Podtácek je plochý a papír je i uprostřed, ne jen po okraji.",
    h1: "Vystřižený kus papíru má okraj i celou plochu uvnitř, na kterou postavíš hrnek. Pojmenuj útvar, ke kterému patří okraj i celý vnitřek.",
    proc: "Podtácek je plochý a zabírá celou plochu uvnitř okraje, proto připomíná kruh. Kružnice by byla jen tenká čára po jeho okraji.",
    zamena: "Kružnice je jen tenká čára. Podtácek má i plochu uvnitř, na kterou postavíš hrnek.",
    koule: "Koule je kulatá ze všech stran, jako míč. Podtácek je plochý.",
  },
  {
    q: "Gumička natažená kolem sklenice tvoří tenkou kulatou čáru. Který útvar připomíná?",
    key: "kružnice",
    h0: "Uvnitř gumičky je sklenice, ne gumička. Co tvoří samotná gumička?",
    h1: "Podívej se jen na gumičku: tvoří tenkou uzavřenou čáru dokola a plochu uvnitř nezabírá. Který pojem označuje samotnou kulatou čáru bez vnitřku?",
    proc: "Gumička tvoří jen tenkou uzavřenou čáru dokola, vnitřek nevyplňuje. Proto připomíná kružnici, ne kruh.",
    zamena: "Kruh je celá plocha. Gumička tvoří jen čáru dokola a vnitřek nevyplňuje.",
    koule: "Koule je těleso. Gumička tvoří jen tenkou čáru.",
  },
  {
    q: "Kulatý koberec zakrývá celou podlahu uvnitř svého okraje. Který útvar připomíná?",
    key: "kruh",
    h0: "Po koberci můžeš chodit i uprostřed. Je to jen čára, nebo plocha?",
    h1: "Koberec zakrývá celou plochu, po které chodíš, nejen tenký pruh po okraji. Pojmenuj útvar, ke kterému patří okraj i celý vnitřek, jako u tohoto koberce.",
    proc: "Koberec zakrývá celou plochu až k okraji, proto připomíná kruh. Kružnice by byla jen jeho obruba.",
    zamena: "Kružnice by byla jen obruba koberce. Koberec zakrývá i celou plochu uvnitř.",
    koule: "Koule je těleso jako míč. Koberec leží na zemi naplocho.",
  },
  {
    q: "Obruč na cvičení je stočená dokola a uprostřed je prázdno. Který útvar připomíná?",
    key: "kružnice",
    h0: "Obručí můžeš prolézt — uprostřed nic není.",
    h1: "Obruč tvoří jen úzký okraj a vnitřek je prázdný, proto jí můžeš prostrčit ruku nebo prolézt. Útvar, který je jen čára dokola bez vnitřku, má své jméno. Jaké?",
    proc: "Obruč je jen okraj dokola a uprostřed je prázdno. Proto připomíná kružnici; kruh by musel mít vyplněný i vnitřek.",
    zamena: "Kruh má vyplněný i vnitřek. Obručí ale prolezeš, uprostřed nic není.",
    koule: "Koule je plná ze všech stran. Obručí prolezeš, uprostřed je prázdno.",
  },
  {
    q: "Palačinka na talíři je kulatá a plná až do prostředka. Který útvar připomíná?",
    key: "kruh",
    h0: "Palačinka nemá uprostřed díru. Tvoří jen okraj, nebo celou plochu?",
    h1: "Palačinka je plochá a těsto je všude, od okraje až po prostředek. Útvar, který zahrnuje okraj i všechno uvnitř, má jiné jméno než samotná čára po okraji. Jaké?",
    proc: "Palačinka je plochá a plná až do prostředka, proto připomíná kruh. Kružnice by byla jen čára po jejím okraji.",
    zamena: "Kružnice je jen čára po okraji. Palačinka je plná až do prostředka.",
    koule: "Koule je kulatá ze všech stran. Palačinka je placatá.",
  },
  {
    q: "Prstýnek ležící na stole je tenký kroužek s dírou uprostřed. Který útvar připomíná?",
    key: "kružnice",
    h0: "Prstýnek má uprostřed díru na prst. Je vyplněný, nebo jen po okraji?",
    h1: "Prstýnek je jen tenký kroužek dokola, uprostřed je místo pro prst. Nemá tedy vyplněnou plochu. Který pojem označuje jen kulatou čáru bez vnitřku?",
    proc: "Prstýnek je tenký kroužek s dírou uprostřed — jen čára dokola bez vnitřku. Proto připomíná kružnici.",
    zamena: "Kruh je vyplněná plocha. Prstýnek má uprostřed díru, je to jen tenký kroužek.",
    koule: "Koule je plná ze všech stran. Prstýnek má uprostřed díru.",
  },
  {
    q: "Kulatá nálepka je celá pokrytá barvou až k okraji. Který útvar připomíná?",
    key: "kruh",
    h0: "Barva je na nálepce všude. Je to tedy jen okraj, nebo plocha?",
    h1: "Nálepka je plochá a barva pokrývá celou její plochu až k okraji. Pojmenuj útvar, ke kterému patří okraj i celý vybarvený vnitřek.",
    proc: "Nálepka je plochá a vybarvená až k okraji, proto připomíná kruh. Kružnice by byla jen tenká čára po jejím okraji.",
    zamena: "Kružnice je jen tenká čára po okraji. Nálepka je vybarvená celá.",
    koule: "Koule je těleso jako míč. Nálepka je plochá.",
  },
];

function vec(v: Vec): PracticeTask {
  const druha = v.key === "kruh" ? "kružnice" : "kruh";
  return choice(v.q, v.key, [
    { value: druha, why: v.zamena },
    { value: "koule", why: v.koule },
    {
      value: "úsečka",
      why: v.key === "kruh" ? "Úsečka je rovná čára mezi dvěma body a nemá žádnou plochu." : "Úsečka je rovná čára mezi dvěma body. Tahle čára je kulatá a uzavřená.",
    },
  ], { hints: [v.h0, v.h1], explanation: v.proc });
}

const POJMY: PracticeTask[] = [
  choice("Jak se jmenuje bod, od kterého jsou všechny body kružnice stejně daleko?", "střed", [
    { value: "poloměr", why: "Poloměr není bod, ale úsečka, která vede od toho bodu ke kružnici." },
    { value: "průměr", why: "Průměr je úsečka napříč celou kružnicí, ne bod." },
    { value: "vrchol", why: "Vrcholy mají mnohoúhelníky, třeba trojúhelník. Kružnice žádný vrchol nemá." },
  ], {
    hints: [
      "Hledáš bod, ne čáru. Kam zapíchneš hrot kružítka?",
      "Kružítko má hrot zapíchnutý pořád na jednom místě a tuha kolem něj kreslí kružnici. Každý bod kružnice je od toho místa stejně daleko. Jak se tomu bodu říká?",
    ],
    explanation: "Bod, kolem kterého kružítko kreslí a od kterého jsou všechny body kružnice stejně daleko, se jmenuje střed. Značí se často písmenem S.",
  }),
  choice("Úsečka vede ze středu kružnice k bodu na kružnici. Jak se jmenuje?", "poloměr", [
    { value: "průměr", why: "Průměr vede napříč celou kružnicí přes střed, je dvakrát delší." },
    { value: "střed", why: "Střed je bod, ne úsečka. Úsečka z něj teprve vychází." },
    { value: "obvod", why: "Obvod je délka celé čáry dokola, ne úsečka ze středu." },
  ], {
    hints: [
      "Úsečka jde jen do půlky kružnice — ze středu na okraj.",
      "Když zapíchneš hrot kružítka do středu, tuha je na kružnici. Vzdálenost mezi hrotem a tuhou je právě tahle úsečka. Její název napovídá, že je to půlka něčeho delšího.",
    ],
    explanation: "Úsečka ze středu k bodu na kružnici je poloměr. Je to polovina průměru, proto „polo-měr“.",
  }),
  choice("Úsečka vede z jednoho bodu kružnice přes střed až na druhou stranu. Jak se jmenuje?", "průměr", [
    { value: "poloměr", why: "Poloměr vede jen ze středu ke kružnici, je poloviční." },
    { value: "střed", why: "Střed je jen bod uprostřed, kterým úsečka prochází." },
    { value: "obvod", why: "Obvod je délka celé čáry dokola, ne úsečka napříč." },
  ], {
    hints: [
      "Úsečka prochází celou kružnicí napříč, z jedné strany na druhou.",
      "Tahle úsečka se skládá ze dvou úseček ze středu: jedna vede ze středu doleva, druhá doprava. Je tedy dvakrát delší než úsečka ze středu na okraj. Jak se jmenuje?",
    ],
    explanation: "Úsečka napříč kružnicí přes střed je průměr. Skládá se ze dvou poloměrů, proto je dvakrát delší než poloměr.",
  }),
  choice("Kterou pomůckou narýsuješ kružnici?", "kružítkem", [
    { value: "pravítkem", why: "Pravítkem rýsuješ rovné čáry, kulatou čáru s ním neuděláš." },
    { value: "trojúhelníkem s ryskou", why: "Trojúhelník s ryskou slouží k rýsování rovných čar, ne kulatých." },
    { value: "úhloměrem", why: "Úhloměrem se měří úhly, kružnice se jím nerýsuje." },
  ], {
    hints: [
      "Potřebuješ pomůcku, která drží tuhu pořád stejně daleko od jednoho bodu.",
      "Kružnice je kulatá čára, jejíž body jsou všechny stejně daleko od středu. Pomůcka na ni má hrot, který se zapíchne do středu, a tuhu, která se kolem něj otáčí.",
    ],
    explanation: "Kružítko má hrot a tuhu v pevné vzdálenosti. Když ho otočíš kolem hrotu, tuha nakreslí kružnici — všechny její body jsou stejně daleko od středu.",
  }),
  choice("Rýsuješ kružnici se středem S. Kam zapíchneš hrot kružítka?", "do bodu S", [
    { value: "vedle bodu S", why: "Hrot musí být přesně ve středu, jinak bude kružnice posunutá a S nebude její střed." },
    { value: "tam, kde bude kružnice", why: "Tam kreslí tuha, ne hrot. Hrot zůstává uprostřed." },
    { value: "na okraj papíru", why: "Na okraji by nebyl střed S a kružnice by se na papír ani nevešla." },
  ], {
    hints: [
      "Hrot kružítka stojí na místě a tuha se kolem něj točí. Kde má být uprostřed?",
      "Kružnice se středem S má všechny body stejně daleko od S. Aby to tak vyšlo, musí se kružítko otáčet kolem S — hrot tedy patří přesně na to písmeno, ne vedle.",
    ],
    explanation: "Hrot kružítka určuje střed kružnice. Má-li být středem S, zapíchneš hrot přímo do S a tuha pak kreslí kolem něj.",
  }),
  choice("Kolik středů má jedna kružnice?", "jeden", [
    { value: "dva", why: "Kdyby měla dva středy, nešla by narýsovat jedním zapíchnutím kružítka." },
    { value: "žádný", why: "Každá kružnice má střed — tam je zapíchnutý hrot kružítka." },
    { value: "nekonečně mnoho", why: "Nekonečně mnoho má kružnice bodů na své čáře, ne středů." },
  ], {
    hints: [
      "Vzpomeň si, kolikrát zapíchneš hrot kružítka, když kreslíš jednu kružnici.",
      "Při rýsování kružnice je hrot kružítka pořád na jednom místě a všechny body kružnice jsou od toho místa stejně daleko. Kolik takových míst uprostřed kružnice je?",
    ],
    explanation: "Kružnice má jediný střed — bod, kam se zapíchne hrot kružítka a od kterého jsou všechny její body stejně daleko.",
  }),
];

/** Kružítko rozevřené od nuly k číslu n → poloměr n cm. */
function rozevreniOdNuly(n: number): PracticeTask {
  return choice(`Kružítko rozevřeš na pravítku od nuly k číslu ${n}. Jaký poloměr bude mít kružnice?`, `${n} cm`, [
    { value: `${2 * n} cm`, why: `${2 * n} cm by byl průměr — dvojnásobek. Rozevření kružítka je poloměr.` },
    { value: `${n + 1} cm`, why: `Od nuly k číslu ${n} je přesně ${n} cm. Nula se jako centimetr nepočítá.` },
    { value: `${n} mm`, why: `Čísla na pravítku značí centimetry. Milimetry jsou jen malé dílky mezi nimi.` },
  ], {
    hints: [
      `Hrot je u nuly, tuha u čísla ${n}. Jak daleko je tuha od hrotu?`,
      `Kružítko drží stále stejné rozevření, takže každý bod kružnice je od středu tak daleko jako tuha od hrotu. Tu vzdálenost přečteš na pravítku: kolik centimetrů je od nuly k číslu ${n}?`,
    ],
    explanation: `Rozevření kružítka je vzdálenost hrotu od tuhy a to je právě poloměr. Od 0 do ${n} je ${n} cm, proto má kružnice poloměr ${n} cm.`,
  });
}

// ─── L2 · aplikace ──────────────────────────────────────────────────────────

function polomerNaPrumer(r: number): PracticeTask {
  const key = `${2 * r} cm`;
  return choice(`Kružnice má poloměr ${r} cm. Jak dlouhý je její průměr?`, key, tri(key, [
    ...(r % 2 === 0 ? [{ value: `${r / 2} cm`, why: `Tady se dělilo místo násobení. Poloviční je poloměr, průměr je naopak dvojnásobný.` }] : []),
    { value: `${r} cm`, why: `To je poloměr. Průměr vede přes celou kružnici a je dvakrát delší.` },
    { value: `${r + 2} cm`, why: `Průměr není o 2 cm delší, ale dvakrát delší: skládá se ze dvou poloměrů.` },
    { value: `${3 * r} cm`, why: `Průměr tvoří dva poloměry, ne tři.` },
  ]), {
    hints: [
      `Průměr jde přes střed z jedné strany kružnice na druhou. Kolik poloměrů ${r} cm se do něj vejde?`,
      `Představ si průměr jako dvě úsečky za sebou: ze středu doleva a ze středu doprava. Každá z nich je poloměr a měří ${r} cm. Obě délky sečti, nebo ${r} vynásob dvěma.`,
    ],
    explanation: `Průměr se skládá ze dvou poloměrů: ${r} cm + ${r} cm = ${2 * r} cm, tedy d = 2 × ${r} = ${2 * r} cm.`,
  });
}

function prumerNaPolomer(d: number): PracticeTask {
  const key = `${d / 2} cm`;
  return choice(`Kružnice má průměr ${d} cm. Jak dlouhý je její poloměr?`, key, tri(key, [
    { value: `${2 * d} cm`, why: `Tady se násobilo. Poloměr je polovina průměru, musí tedy vyjít menší číslo než ${d}.` },
    { value: `${d} cm`, why: `To je celý průměr. Poloměr sahá jen ze středu ke kružnici, je poloviční.` },
    { value: `${d - 2} cm`, why: `Poloměr není o 2 cm kratší než průměr, ale poloviční.` },
    { value: `${d / 2 + 1} cm`, why: `Rozděl průměr přesně na dvě stejné části — tahle je o centimetr delší.` },
  ]), {
    hints: [
      `Poloměr vede jen ze středu ke kružnici. Jaká část průměru ${d} cm to je?`,
      `Průměr ${d} cm prochází středem a střed ho rozdělí na dvě stejně dlouhé části. Každá z nich je poloměr. Rozděl tedy ${d} na dvě stejné poloviny.`,
    ],
    explanation: `Střed rozdělí průměr na dva stejné poloměry: ${d} ÷ 2 = ${d / 2} cm. Kontrola: ${d / 2} + ${d / 2} = ${d}.`,
  });
}

/** Hrot u čísla a, tuha u čísla b → poloměr b − a. */
function rozevreniMimoNulu([a, b]: [number, number]): PracticeTask {
  const r = b - a;
  const key = `${r} cm`;
  return choice(`Hrot kružítka je na pravítku u čísla ${a}, tuha u čísla ${b}. Jaký poloměr bude mít kružnice?`, key, tri(key, [
    { value: `${b} cm`, why: `${b} cm by platilo, kdyby byl hrot u nuly. Hrot je ale u čísla ${a}.` },
    { value: `${2 * r} cm`, why: `To by byl průměr, dvojnásobek. Rozevření kružítka je poloměr.` },
    { value: `${r + 1} cm`, why: `To vyjde, když se spočítají čísla od ${a} do ${b} včetně obou. Poloměr tvoří mezery mezi čísly.` },
    { value: `${a + b} cm`, why: `Čísla ${a} a ${b} se nesčítají — poloměr je vzdálenost mezi nimi, tedy rozdíl.` },
  ]), {
    hints: [
      `Hrot není u nuly, ale u čísla ${a}. Kolik centimetrů je od něj k tuze u čísla ${b}?`,
      `Poloměr je vzdálenost hrotu od tuhy. Protože hrot nezačíná u nuly, nestačí přečíst číslo u tuhy. Počítej centimetrové skoky od ${a} do ${b}, nebo od většího čísla odečti menší.`,
    ],
    explanation: `Poloměr je vzdálenost hrotu od tuhy: ${b} − ${a} = ${r} cm. Tak daleko od středu budou všechny body kružnice.`,
  });
}

// ─── L3 · transfer ──────────────────────────────────────────────────────────

const POLOHA = ["uvnitř kruhu", "na kružnici", "mimo kruh", "ve středu"] as const;

/** Průměr d, bod ve vzdálenosti x od středu → kde leží (nejdřív poloměr, pak porovnání). */
function poloha([d, x]: [number, number]): PracticeTask {
  const r = d / 2;
  const key = x < r ? "uvnitř kruhu" : x === r ? "na kružnici" : "mimo kruh";
  const vztah = x < r ? "méně než poloměr" : x === r ? "přesně poloměr" : "víc než poloměr";
  const why: Record<string, string> = {
    "uvnitř kruhu": x === r
      ? `Uvnitř kruhu by bod byl, jen kdyby byl od středu blíž než ${r} cm. Bod B je ale přesně ${r} cm daleko.`
      : x < d
        ? `${x} cm je sice méně než průměr ${d} cm, ale porovnávat se musí s poloměrem ${r} cm.`
        : `Uvnitř kruhu by bod byl, jen kdyby byl od středu blíž než ${r} cm.`,
    "na kružnici": x === d
      ? `${d} cm je průměr, ne poloměr. Na kružnici leží body vzdálené od středu jen ${r} cm.`
      : `Na kružnici leží jen body vzdálené od středu přesně ${r} cm (poloměr). Bod B je ${x} cm daleko.`,
    "mimo kruh": `Mimo kruh by bod byl, kdyby byl od středu dál než poloměr ${r} cm. ${x} cm víc není.`,
    "ve středu": `Ve středu by bod B byl, jen kdyby byl od S vzdálený 0 cm.`,
  };
  const d3 = POLOHA.filter((p) => p !== key).map((p) => ({ value: p, why: why[p] })) as [Distractor, Distractor, Distractor];
  return choice(`Kružnice se středem S má průměr ${d} cm. Bod B je ${x} cm od S. Kde leží?`, key, d3, {
    hints: [
      `Průměr ${d} cm není vzdálenost od středu. Kolik měří poloměr, se kterým pak porovnáš ${x} cm?`,
      `Nejdřív z průměru ${d} cm urči poloměr — je to jeho polovina. Všechny body čáry jsou od S vzdálené právě o poloměr. Pak porovnej: je bod B blíž ke středu než čára, přesně tak daleko, nebo dál?`,
    ],
    explanation: `Poloměr je polovina průměru: ${d} ÷ 2 = ${r} cm. Bod B je ${x} cm od středu, to je ${vztah}, proto leží ${key}.`,
  });
}

/** Kružnice k zadaná poloměrem r, kružnice m průměrem d; rozdíl průměrů. */
function dveKruznice([r, d]: [number, number]): PracticeTask {
  const x = 2 * r - d;
  const key = `${x} cm`;
  return choice(`Kružnice k má poloměr ${r} cm, kružnice m průměr ${d} cm. O kolik cm má k větší průměr?`, key, tri(key, [
    { value: `${d - r} cm`, why: `Tady se porovnal poloměr ${r} cm s průměrem ${d} cm. Nejdřív z poloměru udělej průměr.` },
    { value: `${2 * r} cm`, why: `To je průměr kružnice k. Ještě od něj odečti průměr kružnice m.` },
    { value: `${2 * r + d} cm`, why: `Otázka „o kolik“ chce rozdíl průměrů, ne jejich součet.` },
    { value: `${r} cm`, why: `To je jen poloměr kružnice k, ne rozdíl průměrů.` },
  ]), {
    hints: [
      `Kružnice m má průměr ${d} cm, u kružnice k ale znáš jen poloměr ${r} cm. Co s ním uděláš, než je porovnáš?`,
      `Průměr je dvakrát delší než poloměr, takže nejdřív zdvojnásob ${r} cm. Teprve pak máš dva průměry a můžeš je porovnat: od většího odečti ${d} cm.`,
    ],
    explanation: `Průměr kružnice k je 2 × ${r} = ${2 * r} cm, průměr kružnice m je ${d} cm. Rozdíl: ${2 * r} − ${d} = ${x} cm.`,
  });
}

/** Soustředné kružnice s poloměry a < b → šířka pruhu mezi nimi. */
function pruh([a, b]: [number, number]): PracticeTask {
  const x = b - a;
  const key = `${x} cm`;
  return choice(`Dvě kružnice mají stejný střed, poloměry ${a} cm a ${b} cm. Jak široký je pruh mezi nimi?`, key, tri(key, [
    { value: `${a + b} cm`, why: `Pruh mezi kružnicemi je rozdíl poloměrů, ne jejich součet.` },
    { value: `${2 * x} cm`, why: `To je šířka pruhu na obou stranách středu dohromady. Pruh je široký jen jednou tolik.` },
    { value: `${2 * b} cm`, why: `To je průměr větší kružnice, ne šířka pruhu.` },
    { value: `${b} cm`, why: `To je poloměr větší kružnice — měří se od středu, ne od menší kružnice.` },
  ]), {
    hints: [
      `Menší kružnice je od středu ${a} cm, větší ${b} cm. Kde pruh začíná a kde končí?`,
      `Jdi ze středu po poloměru ven: po ${a} cm narazíš na menší kružnici, po ${b} cm na větší. Šířka pruhu je úsek mezi těmito dvěma místy, takže od delší vzdálenosti odečti kratší.`,
    ],
    explanation: `Pruh leží mezi menší kružnicí (${a} cm od středu) a větší (${b} cm od středu). Jeho šířka je ${b} − ${a} = ${x} cm.`,
  });
}

/** Kolik kružnic s poloměrem r se vejde těsně vedle sebe na úsečku L = n · 2r. */
function kolikSeVejde([r, n]: [number, number]): PracticeTask {
  const d = 2 * r;
  const L = n * d;
  const key = kruznic(n);
  return choice(`Kolik kružnic s poloměrem ${r} cm se vejde těsně vedle sebe na úsečku ${L} cm?`, key, tri(key, [
    { value: kruznic(2 * n), why: `Tady se dělilo poloměrem ${r} cm. Každá kružnice ale zabere na úsečce celý průměr ${d} cm.` },
    { value: kruznic(n + 1), why: `Tolik se jich nevejde: ${prumeru(n + 1)} po ${d} cm měří ${(n + 1) * d} cm, to je víc než ${L} cm.` },
    ...(n > 1 ? [{ value: kruznic(n - 1), why: `Vejde se jich víc: ${prumeru(n - 1)} po ${d} cm měří jen ${(n - 1) * d} cm a na úsečce ještě zbývá místo.` }] : []),
    { value: kruznic(n + 2), why: `Tolik se jich nevejde: ${prumeru(n + 2)} po ${d} cm měří ${(n + 2) * d} cm, to je víc než ${L} cm.` },
  ]), {
    hints: [
      `Kružnice s poloměrem ${r} cm zabere na úsečce ${L} cm celou svou šířku. Jak je ta šířka velká?`,
      `Šířka jedné kružnice je její průměr, tedy dva poloměry po ${r} cm. Pak zjisti, kolikrát se tahle šířka vejde do ${L} cm — třeba tak, že budeš průměry přičítat, dokud nedojdeš k ${L}.`,
    ],
    explanation: `Průměr kružnice je 2 × ${r} = ${d} cm. Na úsečku ${L} cm se vejde ${L} ÷ ${d} = ${prumeru(n)}, tedy ${key}.`,
  });
}

/** Průměr leží na pravítku od a do b → poloměr (b − a) / 2. */
function prumerNaPravitku([a, b]: [number, number]): PracticeTask {
  const d = b - a;
  const r = d / 2;
  const key = `${r} cm`;
  const stred = (a + b) / 2;
  return choice(`Průměr kružnice leží na pravítku od čísla ${a} do čísla ${b}. Jak dlouhý je poloměr?`, key, tri(key, [
    { value: `${d} cm`, why: `To je celý průměr. Poloměr je jeho polovina.` },
    { value: `${stred} cm`, why: `U čísla ${stred} leží střed kružnice — to je místo na pravítku, ne délka poloměru.` },
    ...(b % 2 === 0 ? [{ value: `${b / 2} cm`, why: `Polovina z ${b} by platila, kdyby průměr začínal u nuly. Začíná ale u čísla ${a}.` }] : []),
    { value: `${b} cm`, why: `${b} je jen číslo u konce průměru, ne délka. Průměr začíná u čísla ${a}.` },
    { value: `${r + 1} cm`, why: `Poloměr je přesná polovina průměru — tahle délka je o centimetr větší.` },
  ]), {
    hints: [
      `Průměr sahá od čísla ${a} k číslu ${b}. Jak je dlouhý a jaká jeho část je poloměr?`,
      `Nejdřív zjisti délku průměru: počítej centimetry od ${a} do ${b}, nebo odečti menší číslo od většího. Poloměr sahá jen ze středu ke kružnici, takže je to polovina té délky. Číslo u středu na pravítku délka není.`,
    ],
    explanation: `Průměr měří ${b} − ${a} = ${d} cm. Poloměr je polovina průměru: ${d} ÷ 2 = ${r} cm.`,
  });
}

// ─── Úrovně ─────────────────────────────────────────────────────────────────

const L2_MIMO_NULU: [number, number][] = [
  [1, 4], [2, 7], [3, 5], [1, 7], [4, 9], [2, 8], [5, 11], [3, 9], [6, 10], [2, 5], [4, 12], [1, 6],
];
const L3_POLOHA: [number, number][] = [
  [10, 4], [10, 5], [10, 7], [8, 4], [8, 3], [8, 6], [12, 6], [12, 9], [12, 5], [14, 8], [14, 7], [6, 2], [16, 10], [20, 10], [18, 7],
];
// Klíč nesmí být koncovkou čísla v zadání („6 cm“ uvnitř „16 cm“ by ho prozradilo).
const L3_DVE: [number, number][] = [
  [6, 10], [7, 10], [8, 12], [9, 10], [6, 9], [5, 6], [10, 13], [4, 5], [12, 20], [7, 11], [9, 13], [11, 17], [8, 10],
];
// Šířka pruhu se nikdy nerovná jednomu z poloměrů (klíč by stál v zadání).
const L3_PRUH: [number, number][] = [
  [3, 7], [2, 5], [4, 9], [1, 6], [5, 8], [2, 9], [3, 10], [6, 11], [4, 7], [1, 5], [5, 12], [7, 10],
];
const L3_VEJDE: [number, number][] = [
  [2, 3], [1, 5], [3, 2], [2, 4], [3, 3], [1, 7], [4, 2], [5, 2], [2, 5], [3, 4], [1, 9], [4, 3], [5, 3],
];
const L3_PRAVITKO: [number, number][] = [
  [2, 10], [1, 7], [3, 9], [4, 12], [1, 5], [2, 8], [5, 11], [3, 13], [6, 14], [1, 9], [4, 10], [2, 14], [5, 9],
];

function gen(level: number): PracticeTask[] {
  if (level === 1) {
    return shuffle([...VECI.map(vec), ...POJMY, ...[2, 3, 4, 5, 6, 7, 8, 9].map(rozevreniOdNuly)]);
  }
  if (level === 2) {
    return shuffle([
      ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(polomerNaPrumer),
      ...[4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26].map(prumerNaPolomer),
      ...L2_MIMO_NULU.map(rozevreniMimoNulu),
    ]);
  }
  return shuffle([
    ...L3_POLOHA.map(poloha),
    ...L3_DVE.map(dveKruznice),
    ...L3_PRUH.map(pruh),
    ...L3_VEJDE.map(kolikSeVejde),
    ...L3_PRAVITKO.map(prumerNaPravitku),
  ]);
}

export const KRUZNICAAKRUHRYSOVANI: TopicMetadata[] = [
  {
    id: "g3-mat-kruznice-kruh",
    rvpNodeId: "g3-matematika-geometrie-v-rovine-a-v-prostoru-rovinne-utvary-kruznice-a-kruh-rysovani",
    title: "Kružnice a kruh - rýsování",
    studentTitle: "Kružnice a kruh",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Rovinné útvary",
    briefDescription: "Poznáš rozdíl mezi kružnicí a kruhem a naučíš se je narýsovat.",
    keywords: ["kružnice", "kruh", "poloměr", "průměr", "střed", "kružítko", "rýsování"],
    goals: [
      "Rozlišit kružnici (čára) a kruh (plocha).",
      "Narýsovat kružnici kružítkem se zadaným poloměrem.",
      "Vypočítat průměr z poloměru a naopak.",
      "Použít vztah r = d÷2 v jednoduchých slovních úlohách.",
    ],
    boundaries: ["Bez výpočtu obvodu a obsahu kruhu."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Kružnice = jen obvod (jako drát ohnutý do kroužku). Kruh = vnitřek + obvod (jako mince). Poloměr r = vzdálenost od středu. Průměr d = 2 × r.",
      steps: [
        "Označ střed kružnice — bod S.",
        "Nastav kružítko na zadaný poloměr.",
        "Hrot kružítka vlož do středu S.",
        "Otočením kružítka narýsuj kružnici.",
      ],
      commonMistake: "Záměna kružnice a kruhu: kružnice je jen čára, kruh je vyplněná plocha.",
      example: "Poloměr r = 3 cm → průměr d = 6 cm. Nastav kružítko na 3 cm a narýsuj.",
    },
  },
];
