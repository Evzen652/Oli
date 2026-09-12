import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";
import { plural, isAre } from "@/lib/czechGrammar";

// Přepsáno 2026-09-11 (inventura obsahu): úrovně měly jen 8/8/12 ručních otázek,
// všechny úlohy sdílely stejnou dvojici nápověd, chybné možnosti neměly zpětnou
// vazbu a v L1/L3 se objevovala desetinná čísla (4,5 cm), která 3. ročník ještě nezná.
// Teď parametrické úlohy, nápovědy i vysvětlení nesou čísla konkrétní úlohy:
//   L1 rozpoznání — délka přečtená z pravítka od nuly; pojmy (krajní body, zápis |AB|…)
//   L2 aplikace   — úsečka nezačíná u nuly (odečítání); cm a mm → mm; čtení mm dílků
//   L3 transfer   — kde označit bod B (inverze); součet a rozdíl úseček v různých
//                   jednotkách; polovina úsečky v milimetrech (dva kroky)
// Jen celá čísla (RVP 3. ročníku), délky do 15 cm / 150 mm.

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

const DVOJICE: [string, string][] = [
  ["A", "B"], ["C", "D"], ["E", "F"], ["K", "L"], ["M", "N"], ["P", "R"], ["U", "V"], ["X", "Y"],
];
const TROJICE: [string, string, string][] = [["A", "B", "C"], ["K", "L", "M"], ["P", "R", "T"], ["D", "E", "F"]];
const dv = (i: number) => DVOJICE[i % DVOJICE.length];
const dilky = (m: number) => `${m} ${plural(m, "milimetrový dílek", "milimetrové dílky", "milimetrových dílků")}`;

// ─── L1 · rozpoznání ────────────────────────────────────────────────────────

/** Bod X u nuly, bod Y u čísla n → délka se přečte přímo. */
function odNuly(n: number, i: number): PracticeTask {
  const [X, Y] = dv(i);
  return choice(`Bod ${X} je na pravítku u nuly, bod ${Y} u čísla ${n}. Jak dlouhá je úsečka ${X}${Y}?`, `${n} cm`, [
    { value: `${n + 1} cm`, why: `To vyjde, když se k číslům započítá i nula. Nula je začátek úsečky, ne její první centimetr.` },
    { value: `${n - 1} cm`, why: `Tolik by měřila úsečka, kdyby bod ${Y} ležel u čísla ${n - 1}. Délku čteš přesně u bodu ${Y}.` },
    { value: `${n} mm`, why: `Čísla na pravítku značí celé centimetry. Milimetry jsou jen malé dílky mezi nimi.` },
  ], {
    hints: [
      `Začátek úsečky je u nuly, konec u čísla ${n}. Co ta čísla na pravítku měří?`,
      `Když bod ${X} leží přesně u nuly, délka úsečky ${X}${Y} se přečte rovnou u bodu ${Y}. Velká čísla na pravítku jsou centimetry, malé dílky mezi nimi milimetry. Kolik celých centimetrů je od nuly k číslu ${n}?`,
    ],
    explanation: `Bod ${X} leží u nuly, takže délku čteme přímo u bodu ${Y}: od 0 do ${n} je ${n} cm. Proto |${X}${Y}| = ${n} cm.`,
  });
}

const POJMY: PracticeTask[] = [
  choice("Kolik krajních bodů má úsečka?", "dva", [
    { value: "jeden", why: "Jeden krajní bod má polopřímka: v bodě začíná a na druhou stranu pokračuje bez konce." },
    { value: "žádný", why: "Žádný krajní bod nemá přímka, ta pokračuje na obě strany donekonečna. Úsečka ne." },
    { value: "tři", why: "Bod uprostřed úsečky není krajní. Krajní body jsou jen na koncích a konce má úsečka jen na dvou stranách." },
  ], {
    hints: [
      "Krajní body leží na koncích úsečky. Kolik konců úsečka má?",
      "Úsečka je rovná čára, která někde začíná a někde končí — na rozdíl od přímky, která pokračuje donekonečna. Na každém konci leží jeden bod. Spočítej konce úsečky.",
    ],
    explanation: "Úsečka má dva konce a na každém leží jeden krajní bod, třeba A a B. Proto se úsečka jmenuje podle nich: úsečka AB.",
  }),
  choice("Úsečky AB a CD jsou stejně dlouhé. Jak se takovým úsečkám říká?", "shodné", [
    { value: "rovnoběžné", why: "Rovnoběžné úsečky mají stejný směr a nikdy se neprotnou. O délce to nic neříká." },
    { value: "kolmé", why: "Kolmé úsečky spolu svírají pravý úhel. O délce to nic neříká." },
    { value: "různoběžné", why: "Různoběžné úsečky míří každá jinam. O délce to nic neříká." },
  ], {
    hints: [
      "Hledej slovo, které říká, že se dvě věci dají přesně položit přes sebe.",
      "Když změříš AB i CD a vyjde stejné číslo, dají se úsečky položit přes sebe tak, že se úplně kryjí. Ostatní slova popisují, kam úsečky míří, ne jak jsou dlouhé.",
    ],
    explanation: "Stejně dlouhé úsečky se po přiložení přes sebe kryjí — říkáme, že jsou shodné. Zapisujeme |AB| = |CD|.",
  }),
  choice("Ke které čárce pravítka přiložíš bod A, aby šla délka úsečky přečíst přímo?", "k nule", [
    { value: "k číslu 1", why: "Když začneš u jedničky, přečteš u bodu B číslo o 1 cm větší, než je skutečná délka." },
    { value: "k okraji pravítka", why: "Okraj pravítka často není nula — před nulou bývá kousek bez čárek." },
    { value: "k prostřední čárce", why: "Od prostřední čárky by se délka musela odečítat, přímo přečíst by nešla." },
  ], {
    hints: [
      "Kde na pravítku začíná počítání centimetrů?",
      "Délka úsečky je počet centimetrů od začátku ke konci. Když začátek úsečky leží tam, kde pravítko začíná počítat, přečteš délku rovnou u bodu B a nic neodečítáš.",
    ],
    explanation: "Centimetry se na pravítku počítají od nuly. Když je bod A u nuly, číslo u bodu B je přímo délka úsečky; jinak by se muselo odečítat.",
  }),
  choice("Body A a B máš označené. Jak je spojíš, aby vznikla úsečka AB?", "rovnou čarou podél pravítka", [
    { value: "obloukem pomocí kružítka", why: "Kružítkem vzniká oblouk nebo kružnice. Úsečka je rovná." },
    { value: "rovnou čarou od ruky", why: "Od ruky čára nebude přesně rovná, proto se úsečka rýsuje podél pravítka." },
    { value: "vlnovkou od bodu k bodu", why: "Úsečka je nejkratší spojení dvou bodů. Vlnovka je křivá a delší." },
  ], {
    hints: [
      "Úsečka musí být úplně rovná. Co ti pomůže vést tužku rovně?",
      "Přilož pravítko tak, aby se jeho hrana dotýkala bodu A i bodu B. Tužku pak veď po hraně od jednoho bodu ke druhému. Kružítko ani ruka bez pomůcky rovnou čáru neudělají.",
    ],
    explanation: "Úsečka je rovná čára mezi dvěma body. Přesně rovnou ji nakreslíš jen s pravítkem: přiložíš ho k oběma bodům a vedeš tužku po hraně.",
  }),
  choice("Jak správně zapíšeš, že úsečka AB měří 6 cm?", "|AB| = 6 cm", [
    { value: "|AB| = 6", why: "Chybí jednotka. Bez „cm“ nikdo neví, jestli jde o centimetry, nebo milimetry." },
    { value: "AB = |6 cm|", why: "Svislé čáry patří kolem názvu úsečky, ne kolem čísla." },
    { value: "|A| = |B| = 6 cm", why: "Délku má úsečka, ne jednotlivé body. Svislé čáry se píšou kolem obou písmen dohromady." },
  ], {
    hints: [
      "Délka úsečky se zapisuje pomocí svislých čar. Kam je dáš a co nesmí chybět za číslem?",
      "Svislé čáry obklopí oba krajní body dohromady — tím říkáš „délka úsečky“. Za rovnítko napiš číslo i jednotku, jinak by nikdo nevěděl, jestli jde o centimetry, nebo milimetry.",
    ],
    explanation: "Délka úsečky AB se píše |AB|; svislé čáry znamenají „délka“. Za rovnítko patří číslo i jednotka, tedy |AB| = 6 cm.",
  }),
  choice("Čím se úsečka liší od přímky?", "má začátek i konec", [
    { value: "je křivá", why: "Úsečka i přímka jsou rovné čáry, křivá není ani jedna." },
    { value: "nemá žádný konec", why: "To platí pro přímku, která pokračuje na obě strany donekonečna." },
    { value: "má jen jeden konec", why: "Jen na jedné straně končí polopřímka, ne úsečka." },
  ], {
    hints: [
      "Přímka pokračuje na obě strany bez přestání. Jak je to u úsečky?",
      "Úsečka leží mezi dvěma body a za nimi už nepokračuje. Přímka se dá prodlužovat donekonečna na obě strany, polopřímka jen na jednu. Která možnost to vystihuje?",
    ],
    explanation: "Úsečka začíná v jednom krajním bodě a končí ve druhém. Přímka nemá začátek ani konec a polopřímka má jen začátek.",
  }),
];

// ─── L2 · aplikace ──────────────────────────────────────────────────────────

/** Úsečka nezačíná u nuly: délka = b − a. */
function mimoNulu([a, b]: [number, number], i: number): PracticeTask {
  const [X, Y] = dv(i + 3);
  const L = b - a;
  return choice(`Bod ${X} je na pravítku u čísla ${a}, bod ${Y} u čísla ${b}. Jak dlouhá je úsečka ${X}${Y}?`, `${L} cm`, tri(`${L} cm`, [
    { value: `${b} cm`, why: `${b} cm by platilo, kdyby bod ${X} ležel u nuly. Tady ale úsečka začíná u čísla ${a}.` },
    { value: `${L + 1} cm`, why: `To vyjde, když se spočítají čísla od ${a} do ${b} včetně obou. Délku ale tvoří mezery mezi čísly, ne čísla samotná.` },
    { value: `${a + b} cm`, why: `Čísla ${a} a ${b} se nesčítají — délka je vzdálenost mezi nimi, tedy rozdíl.` },
    { value: `${L - 1} cm`, why: `O centimetr méně — jeden skok mezi čísly se ztratil. Od ${a} do ${b} počítej skoky pečlivě.` },
  ]), {
    hints: [
      `Bod ${X} neleží u nuly, ale u čísla ${a}. Kolik centimetrů je od něj k číslu ${b}?`,
      `Když úsečka nezačíná u nuly, nestačí přečíst číslo u bodu ${Y}. Počítej centimetrové skoky od ${a} do ${b}, nebo od většího čísla odečti menší. Pozor, nepočítej čísla, ale mezery mezi nimi.`,
    ],
    explanation: `Úsečka začíná u čísla ${a} a končí u čísla ${b}. Její délka je vzdálenost mezi nimi: ${b} − ${a} = ${L} cm.`,
  });
}

/** c cm m mm → milimetry. */
function cmMmNaMm([c, m]: [number, number], i: number): PracticeTask {
  const [X, Y] = dv(i + 5);
  const x = 10 * c + m;
  return choice(`Úsečka ${X}${Y} měří ${c} cm ${m} mm. Kolik je to milimetrů?`, `${x} mm`, tri(`${x} mm`, [
    { value: `${c + m} mm`, why: `Centimetry a milimetry nejde sečíst jen tak. Nejdřív převeď ${c} cm na milimetry.` },
    { value: `${10 * m + c} mm`, why: `Čísla se prohodila. ${c} cm ${isAre(c)} ${c} ${plural(c, "desítka", "desítky", "desítek")} milimetrů, na místo desítek tedy patří ${c}.` },
    { value: `${100 * c + m} mm`, why: `1 cm má 10 mm, ne 100 mm. ${c} cm je jen ${10 * c} mm.` },
  ]), {
    hints: [
      `Kolik milimetrů je ${c} cm? A co pak uděláš s ${m} mm navíc?`,
      `Jeden centimetr má deset milimetrů, takže ${c} cm je ${c} krát deset milimetrů. K tomu přičti ještě ${m} mm. Na pravítku to je ${c} ${plural(c, "velký dílek", "velké dílky", "velkých dílků")} a k tomu ${m} ${plural(m, "malý", "malé", "malých")}.`,
    ],
    explanation: `${c} cm = ${10 * c} mm, protože každý centimetr má 10 mm. K tomu ${m} mm: ${10 * c} + ${m} = ${x} mm.`,
  });
}

/** Bod Y je m milimetrových dílků za číslem c → délka v mm. */
function ctiMm([c, m]: [number, number], i: number): PracticeTask {
  const [X, Y] = dv(i + 1);
  const x = 10 * c + m;
  return choice(`Bod ${X} je u nuly, bod ${Y} o ${dilky(m)} za číslem ${c}. Kolik milimetrů měří úsečka ${X}${Y}?`, `${x} mm`, tri(`${x} mm`, [
    { value: `${10 * c - m} mm`, why: `Dílky jsou ZA číslem ${c}, ne před ním, proto se k ${10 * c} mm přičítají.` },
    { value: `${c + m} mm`, why: `Číslo ${c} na pravítku znamená ${c} cm, tedy ${10 * c} mm — ne ${c} mm.` },
    { value: `${10 * (c + 1) + m} mm`, why: `Tak by to vyšlo, kdyby bod ${Y} ležel za číslem ${c + 1}. Leží ale za číslem ${c}.` },
  ]), {
    hints: [
      `Číslo ${c} na pravítku znamená ${c} cm. Kolik milimetrů to je a kolik dílků ještě přibude?`,
      `Každý centimetr má deset milimetrových dílků. Od nuly k číslu ${c} je tedy ${c} krát deset dílků a od čísla ${c} pak odpočítej ještě ${dilky(m)}. Oba počty sečti.`,
    ],
    explanation: `Od nuly k číslu ${c} je ${c} cm = ${10 * c} mm. K tomu ${dilky(m)} za číslem ${c}, tedy ${m} mm: ${10 * c} + ${m} = ${x} mm.`,
  });
}

// ─── L3 · transfer ──────────────────────────────────────────────────────────

/** Inverze: začátek u čísla a, délka L → kde označit konec. */
function kdeKonec([a, L]: [number, number], i: number): PracticeTask {
  const [X, Y] = dv(i + 2);
  const key = `u čísla ${a + L}`;
  return choice(`Úsečka ${X}${Y} má měřit ${L} cm. Bod ${X} je u čísla ${a}. Kde na pravítku označíš bod ${Y}?`, key, tri(key, [
    { value: `u čísla ${L}`, why: `Tak by to bylo, kdyby bod ${X} ležel u nuly. Začíná ale u čísla ${a}, takže se konec posune o ${a} dál.` },
    { value: `u čísla ${a + L + 1}`, why: `O centimetr dál — to se stane, když se číslo ${a} počítá už jako první centimetr. Počítej skoky mezi čísly.` },
    ...(L - a > 0 ? [{ value: `u čísla ${L - a}`, why: `Číslo ${a} se má k délce přičíst, ne odečíst — bod ${Y} musí ležet dál od nuly než bod ${X}.` }] : []),
    { value: `u čísla ${a + L - 1}`, why: `O centimetr blíž — úsečka by měřila jen ${L - 1} cm. Od čísla ${a} udělej ${L} ${plural(L, "skok", "skoky", "skoků")}.` },
  ]), {
    hints: [
      `Bod ${X} nezačíná u nuly, ale u čísla ${a}. O kolik centimetrů dál musí ležet bod ${Y}?`,
      `Od čísla ${a} odpočítej na pravítku ${L} ${plural(L, "centimetrový skok", "centimetrové skoky", "centimetrových skoků")} doprava — jeden skok je vzdálenost mezi dvěma sousedními čísly. Kde se zastavíš, tam označ bod ${Y}. Můžeš také sečíst ${a} + ${L}.`,
    ],
    explanation: `Úsečka začíná u čísla ${a} a má měřit ${L} cm, proto její konec leží o ${L} dál: ${a} + ${L} = ${a + L}. Bod ${Y} označíš u čísla ${a + L}.`,
  });
}

/** Dvě úsečky za sebou, jedna v cm, druhá v mm → celek v mm. */
function soucet([c, m]: [number, number], i: number): PracticeTask {
  const [X, Y, Z] = TROJICE[i % TROJICE.length];
  const x = 10 * c + m;
  return choice(`Úsečka ${X}${Y} měří ${c} cm, úsečka ${Y}${Z} měří ${m} mm. Leží za sebou. Kolik milimetrů měří ${X}${Z}?`, `${x} mm`, tri(`${x} mm`, [
    { value: `${c + m} mm`, why: `Centimetry a milimetry nejde sečíst přímo — ${c} cm je nejdřív potřeba převést na ${10 * c} mm.` },
    { value: `${100 * c + m} mm`, why: `1 cm má 10 mm, ne 100 mm. ${c} cm je ${10 * c} mm.` },
    { value: `${Math.abs(10 * c - m)} mm`, why: `Úsečky leží za sebou, takže se jejich délky sčítají, ne odečítají.` },
  ]), {
    hints: [
      `${c} cm a ${m} mm jsou v různých jednotkách. Co uděláš, než je sečteš?`,
      `Nejdřív převeď ${c} cm na milimetry — každý centimetr má deset milimetrů. Pak přičti ${m} mm, protože úsečky ${X}${Y} a ${Y}${Z} leží za sebou a jejich délky se skládají.`,
    ],
    explanation: `${c} cm = ${10 * c} mm. Úsečky leží za sebou, takže ${10 * c} mm + ${m} mm = ${x} mm.`,
  });
}

/** Rozdíl délek v různých jednotkách → mm. */
function rozdil([c, m]: [number, number], i: number): PracticeTask {
  const [X, Y] = dv(i);
  const [U, V] = dv(i + 4);
  const x = 10 * c - m;
  return choice(`Úsečka ${X}${Y} měří ${c} cm, úsečka ${U}${V} měří ${m} mm. O kolik milimetrů je ${X}${Y} delší?`, `${x} mm`, tri(`${x} mm`, [
    { value: `${m - c} mm`, why: `${c} cm není ${c} mm. Nejdřív převeď ${c} cm na ${10 * c} mm, teprve pak odečítej.` },
    { value: `${10 * c + m} mm`, why: `Otázka „o kolik je delší“ chce rozdíl délek, ne jejich součet.` },
    { value: `${100 * c - m} mm`, why: `1 cm má 10 mm, ne 100 mm. ${c} cm je ${10 * c} mm.` },
  ]), {
    hints: [
      `Úsečka ${X}${Y} je zadaná v centimetrech, ${U}${V} v milimetrech. Převeď ${c} cm, než začneš porovnávat.`,
      `${c} cm převeď na milimetry — každý centimetr má deset milimetrů. Pak se ptáš, o kolik je jedno číslo větší než druhé, takže od většího počtu milimetrů odečti ${m}.`,
    ],
    explanation: `${c} cm = ${10 * c} mm. Rozdíl délek: ${10 * c} mm − ${m} mm = ${x} mm. O tolik je úsečka ${X}${Y} delší.`,
  });
}

/** Bod S v polovině úsečky c cm → |XS| v mm. U lichých c je převod nutný dřív než dělení. */
function polovina(c: number, i: number): PracticeTask {
  const [X, Y] = dv(i);
  const x = 5 * c;
  const sude = c % 2 === 0;
  return choice(`Úsečka ${X}${Y} měří ${c} cm. Bod S leží přesně v její polovině. Kolik milimetrů měří ${X}S?`, `${x} mm`, tri(`${x} mm`, [
    ...(sude ? [{ value: `${c / 2} mm`, why: `${c / 2} je polovina v centimetrech. Otázka se ale ptá na milimetry, ještě je potřeba převést.` }] : []),
    { value: `${10 * c} mm`, why: `To je celá úsečka ${X}${Y}. Bod S je v polovině, takže ${X}S je jen polovina z ní.` },
    { value: `${20 * c} mm`, why: `Tady se délka zdvojnásobila. Polovina je naopak menší než celá úsečka.` },
    { value: `${c} mm`, why: `${c} je délka celé úsečky v centimetrech, ne polovina v milimetrech.` },
  ]), {
    hints: sude
      ? [
        `Nejdřív zjisti, kolik je polovina z ${c} cm. V jakých jednotkách se ale otázka ptá?`,
        `Bod S dělí úsečku ${X}${Y} na dvě stejné části, takže ${X}S je polovina z ${c} cm. Tu polovinu pak převeď na milimetry — jeden centimetr má deset milimetrů.`,
      ]
      : [
        `Polovinu z ${c} cm v celých centimetrech nevyjádříš. Zkus nejdřív převést na milimetry.`,
        `Převeď ${c} cm na milimetry, každý centimetr má deset milimetrů. Bod S dělí úsečku ${X}${Y} na dvě stejné části, takže počet milimetrů pak rozděl na dvě stejné poloviny.`,
      ],
    explanation: sude
      ? `Polovina z ${c} cm je ${c / 2} cm. V milimetrech: ${c / 2} cm = ${x} mm. Proto |${X}S| = ${x} mm.`
      : `${c} cm = ${10 * c} mm. Polovina z ${10 * c} mm je ${x} mm, protože ${x} + ${x} = ${10 * c}. Proto |${X}S| = ${x} mm.`,
  });
}

// ─── Úrovně ─────────────────────────────────────────────────────────────────

const L2_MIMO_NULU: [number, number][] = [
  [1, 6], [2, 9], [3, 11], [4, 10], [2, 5], [5, 14], [3, 7], [6, 15], [1, 10], [4, 13], [8, 12], [7, 9],
];
const L2_CM_MM: [number, number][] = [
  [3, 2], [4, 7], [5, 3], [6, 4], [7, 5], [8, 1], [2, 9], [9, 6], [3, 8], [1, 4], [6, 2], [4, 5],
];
const L2_CTI_MM: [number, number][] = [[4, 6], [2, 3], [7, 2], [5, 8], [3, 5], [9, 4], [6, 7], [1, 8]];
const L3_KDE: [number, number][] = [
  [2, 5], [3, 6], [4, 7], [1, 8], [5, 4], [6, 9], [2, 11], [3, 9], [7, 6], [4, 10], [1, 12], [5, 7],
];
const L3_SOUCET: [number, number][] = [
  [4, 25], [3, 18], [5, 12], [2, 35], [6, 14], [3, 45], [7, 16], [4, 32], [5, 27], [2, 48], [6, 23], [8, 15],
];
// Rozdíl nikdy nevyjde stejně jako druhá délka (jinak by klíč stál v zadání).
const L3_ROZDIL: [number, number][] = [
  [9, 46], [7, 38], [6, 25], [8, 52], [5, 16], [4, 27], [9, 63], [7, 44], [6, 51], [8, 35], [5, 32], [3, 18],
];
const L3_POLOVINA = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

function gen(level: number): PracticeTask[] {
  if (level === 1) {
    return shuffle([...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(odNuly), ...POJMY]);
  }
  if (level === 2) {
    return shuffle([...L2_MIMO_NULU.map(mimoNulu), ...L2_CM_MM.map(cmMmNaMm), ...L2_CTI_MM.map(ctiMm)]);
  }
  return shuffle([
    ...L3_KDE.map(kdeKonec),
    ...L3_SOUCET.map(soucet),
    ...L3_ROZDIL.map(rozdil),
    ...L3_POLOVINA.map(polovina),
  ]);
}

export const RYSOVANIUSECKYODANEDELCE: TopicMetadata[] = [
  {
    id: "g3-mat-rysovani-usecky",
    rvpNodeId: "g3-matematika-geometrie-v-rovine-a-v-prostoru-rovinne-utvary-rysovani-usecky-o-dane-delce",
    title: "Rýsování úsečky o dané délce",
    studentTitle: "Rýsuji úsečky",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Rovinné útvary",
    briefDescription: "Naučíš se narýsovat úsečku přesné délky pomocí pravítka.",
    keywords: ["úsečka", "rýsování", "pravítko", "délka", "body A B", "cm", "mm"],
    goals: [
      "Narýsovat úsečku zadané délky pomocí pravítka.",
      "Změřit délku dané úsečky.",
      "Označit krajní body úsečky.",
      "Sčítat a porovnávat délky úseček v cm a mm.",
    ],
    boundaries: ["Délky v cm a mm.", "Bez kružítka."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Přilož pravítko k počátečnímu bodu A (na nulu). Odměř zadanou délku a označ bod B. Spoj A a B rovnou čarou. 1 cm = 10 mm.",
      steps: [
        "Označ bod A tužkou.",
        "Přilož pravítko tak, aby nula byla u bodu A.",
        "Odměř zadanou délku a označ bod B.",
        "Spoj A a B rovnou čarou podél pravítka.",
        "Napiš délku: |AB| = … cm.",
      ],
      commonMistake: "Přikládání pravítka ne od nuly, ale od čísla 1 — vznikne o 1 cm delší úsečka.",
      example: "|AB| = 4 cm 5 mm: začátek u 0, konec o 5 malých dílků za číslem 4. To je 45 mm.",
    },
  },
];
