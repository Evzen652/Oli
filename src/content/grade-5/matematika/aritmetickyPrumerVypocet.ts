import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { ciselnaUloha, fdec, pick, rnd, sada } from "./_mat";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy byly pevný seznam bez nápověd
// a bez vysvětlení chybných možností. Teď generátor s typickými chybami
// (zapomenuté dělení, dělení špatným počtem, useknuté desetiny).
// L1 průměr ze tří až čtyř čísel do 100 · L2 ze čtyř až šesti čísel, výsledek
// může vyjít s pěti desetinami (12,5) · L3 obrácené úlohy: součet z průměru,
// chybějící číslo a změna průměru po přidání čísla.

const POCET_1P: Record<number, string> = { 3: "tři", 4: "čtyři", 5: "pět", 6: "šest" };
const POCET_7P: Record<number, string> = { 2: "dvěma", 3: "třemi", 4: "čtyřmi", 5: "pěti", 6: "šesti", 7: "sedmi" };
const seznam = (xs: number[]) => `${xs.slice(0, -1).join(", ")} a ${xs[xs.length - 1]}`;

// Jednotka vždy před výčtem čísel, aby za číslem nestál tvar, který nesedí.
const KONTEXT_CELE = [
  (s: string) => `Jaký je průměr čísel ${s}?`,
  (s: string) => `Počty žáků v jednotlivých třídách jsou ${s}. Kolik žáků má třída průměrně?`,
  (s: string) => `Obchod prodal za jednotlivé dny tolik rohlíků: ${s}. Kolik rohlíků prodal průměrně za den?`,
  (s: string) => `Družstvo sklidilo za jednotlivé dny tolik kilogramů jablek: ${s}. Kolik kilogramů to bylo průměrně za den?`,
];
const KONTEXT_DES = [
  (s: string) => `Jaký je průměr čísel ${s}?`,
  (s: string) => `Honza běhal za jednotlivé dny tolik minut: ${s}. Kolik minut běhal průměrně za den?`,
  (s: string) => `Na výletě jsme za jednotlivé dny ušli tolik kilometrů: ${s}. Kolik kilometrů to bylo průměrně za den?`,
  (s: string) => `Konvice vařila vodu postupně tolik sekund: ${s}. Kolik sekund to trvalo průměrně?`,
];

function prumer(count: number, max: number, desetiny: boolean): PracticeTask | null {
  const nums = Array.from({ length: count }, () => rnd(5, max));
  const sum = nums.reduce((a, b) => a + b, 0);
  const avg = sum / count;
  if (new Set(nums).size < count || nums.includes(avg)) return null;
  if (desetiny ? (2 * sum) % count !== 0 : sum % count !== 0) return null;
  const serazena = [...nums].sort((a, b) => a - b);
  const chyby = [
    { value: fdec(sum), why: `${fdec(sum)} je součet. Průměr dostaneš, když součet vydělíš počtem čísel.` },
    ...((2 * sum) % (count - 1) === 0 ? [{ value: fdec(sum / (count - 1)), why: `Součet se dělil ${POCET_7P[count - 1]}. Čísel je ale ${POCET_1P[count]}.` }] : []),
    ...(!Number.isInteger(avg) ? [{ value: fdec(Math.floor(avg)), why: `Dělení ${sum} ÷ ${count} nevyšlo beze zbytku a zbytek se zahodil. Pokračuj za desetinnou čárkou.` }] : []),
    { value: fdec(avg + 1), why: `Zkouška: ${count} × ${fdec(avg + 1)} = ${fdec(count * (avg + 1))}, ale součet je ${sum}.` },
    { value: fdec(avg - 1), why: `Zkouška: ${count} × ${fdec(avg - 1)} = ${fdec(count * (avg - 1))}, ale součet je ${sum}.` },
  ];
  const kontext = (desetiny ? KONTEXT_DES : KONTEXT_CELE)[sum % 4];
  return ciselnaUloha(kontext(seznam(nums)), fdec(avg), chyby, [
    `Nejdřív sečti všechna čísla: ${nums.join(" + ")}. Kolik vyjde?`,
    `Průměr = součet všech čísel ÷ jejich počet. Čísel je ${POCET_1P[count]}, takže celý součet vyděl ${POCET_7P[count]}.${desetiny ? " Když dělení nevyjde beze zbytku, pokračuj za desetinnou čárkou." : ""}`,
  ], [
    `Součet: ${nums.join(" + ")} = ${sum}`,
    `Průměr: ${sum} ÷ ${count} = ${fdec(avg)}`,
    `Průměr leží mezi nejmenším (${serazena[0]}) a největším (${serazena[count - 1]}) číslem — to sedí.`,
  ]);
}

function soucetZPrumeru(): PracticeTask | null {
  const n = rnd(5, 9), avg = rnd(18, 32);
  const celkem = n * avg;
  return ciselnaUloha(`Ve škole je ${pad(n, "TŘÍDA")}. Průměrný počet žáků ve třídě je ${avg}. Kolik žáků chodí do všech tříd dohromady?`, celkem, [
    { value: avg + n, why: "Počet tříd a průměr se sečetly. Průměr říká, kolik žáků připadá na jednu třídu — tříd je víc." },
    { value: avg, why: "To je počet žáků v jedné průměrné třídě, ne ve všech třídách." },
    { value: avg * (n - 1), why: `Násobilo se o jednu třídu méně. Tříd je ${n}.` },
  ], [
    `Kolik žáků by bylo ve škole, kdyby v každé z tříd (je jich ${n}) bylo přesně ${avg} žáků?`,
    `Průměr = součet ÷ počet, takže součet = průměr × počet. Vynásob průměrný počet žáků počtem tříd. Výsledek musí vyjít mnohem víc než průměr, protože jde o všechny třídy.`,
  ], [
    `Součet = průměr × počet tříd`,
    `${avg} × ${n} = ${celkem}`,
    `Zkouška: ${celkem} ÷ ${n} = ${avg} ✓`,
  ]);
}

function chybejici(): PracticeTask | null {
  const count = rnd(4, 5), avg = rnd(12, 60);
  const known = Array.from({ length: count - 1 }, () => rnd(5, 2 * avg));
  const sumKnown = known.reduce((a, b) => a + b, 0);
  const celek = avg * count, missing = celek - sumKnown;
  if (missing < 10 || missing > 150 || missing === avg || known.includes(missing) || known.includes(avg) || new Set(known).size < known.length) return null;
  const [kolika, kolik, porade] = count === 4 ? ["čtyř", "Tři", "čtvrté"] : ["pěti", "Čtyři", "páté"];
  return ciselnaUloha(`Průměr ${kolika} čísel je ${avg}. ${kolik} z nich jsou ${seznam(known)}. Jaké je ${porade} číslo?`, missing, [
    { value: avg, why: `Hledané číslo nemusí být rovno průměru. Průměr ${avg} říká, že všechna čísla dohromady dají ${count} × ${avg} = ${celek}.` },
    { value: celek, why: `${celek} je součet všech čísel. Ještě od něj odečti známá čísla.` },
    { value: sumKnown, why: `${sumKnown} je součet známých čísel. Hledané číslo je to, co jim chybí do ${celek}.` },
    { value: missing + 1, why: `Zkouška: (${[...known, missing + 1].join(" + ")}) ÷ ${count} nedá ${avg}.` },
  ], [
    `Jaký je součet všech čísel, když je jejich průměr ${avg}? Známá čísla jsou ${seznam(known)}.`,
    `Součet všech čísel = průměr × počet čísel = ${avg} × ${count}. Od tohoto součtu odečti známá čísla — co zbude, je hledané číslo.`,
  ], [
    `Součet všech ${kolika} čísel: ${avg} × ${count} = ${celek}`,
    `Známá čísla: ${known.join(" + ")} = ${sumKnown}`,
    `Hledané číslo: ${celek} − ${sumKnown} = ${missing}`,
    `Zkouška: (${[...known, missing].join(" + ")}) ÷ ${count} = ${avg} ✓`,
  ]);
}

function pridane(): PracticeTask | null {
  const n = pick([3, 4]), avg = rnd(8, 30), nove = rnd(avg + 2, avg + 30);
  const soucet = n * avg + nove;
  if (soucet % (n + 1) !== 0) return null;
  const vysledek = soucet / (n + 1);
  const pul = (avg + nove) / 2;
  const kolika = n === 3 ? "tří" : "čtyř";
  return ciselnaUloha(`Průměr ${kolika} čísel je ${avg}. Přidáme k nim číslo ${nove}. Jaký je průměr všech čísel teď?`, vysledek, [
    ...(Number.isInteger(pul) ? [{ value: pul, why: `To je průměr jen dvou čísel (${avg} a ${nove}). Původní průměr ale zastupuje ${n === 3 ? "tři čísla" : "čtyři čísla"}.` }] : []),
    { value: Math.round((n * avg + nove) / n), why: `Nový součet se dělil původním počtem čísel. Čísel je teď o jedno víc.` },
    { value: avg, why: "Přidané číslo je větší než průměr, takže průměr musí stoupnout." },
    { value: vysledek + 1, why: `Zkouška: ${n + 1} × ${vysledek + 1} = ${(n + 1) * (vysledek + 1)}, ale součet je ${soucet}.` },
  ], [
    `Kolik dají původní čísla dohromady, když je jejich průměr ${avg}? A kolik bude čísel, až přibude ${nove}?`,
    `Původní součet = ${avg} × ${n}. Přičti nové číslo a celý nový součet vyděl novým počtem čísel (o jedno víc). Nový průměr musí ležet mezi starým průměrem a přidaným číslem.`,
  ], [
    `Původní součet: ${avg} × ${n} = ${n * avg}`,
    `Nový součet: ${n * avg} + ${nove} = ${soucet}`,
    `Nový průměr: ${soucet} ÷ ${n + 1} = ${vysledek}`,
  ]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return sada(30, () => prumer(rnd(3, 4), 99, false));
  if (level === 2) return sada(30, () => prumer(rnd(4, 6), 60, true));
  const tvurci = [soucetZPrumeru, chybejici, pridane];
  return sada(30, (i) => tvurci[i % tvurci.length]());
}

export const ARITMETICKYPRUMERVYPOCET: TopicMetadata[] = [
  {
    id: "g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-aritmeticky-prumer-vypocet",
    rvpNodeId: "g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-aritmeticky-prumer-vypocet",
    title: "Aritmetický průměr - výpočet",
    studentTitle: "Průměr čísel",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Spočítáš průměr ze skupiny čísel.",
    keywords: ["průměr", "průměrná hodnota", "součet", "dělení", "data"],
    goals: [
      "Vypočítat průměr ze 3–5 čísel",
      "Pochopit, co průměr znamená",
      "Použít průměr v praktických situacích",
      "Najít chybějící číslo, je-li znám průměr",
    ],
    boundaries: ["Bez váženého průměru", "Bez záporných čísel v průměru"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Průměr = součet všech čísel ÷ počet čísel. Příklad: průměr 4, 6, 8 = (4+6+8) ÷ 3 = 18 ÷ 3 = 6.",
      steps: [
        "Sečti všechna čísla dohromady.",
        "Zjisti, kolik čísel máš.",
        "Výsledek sčítání vydělej počtem čísel.",
        "To je průměr.",
      ],
      commonMistake: "Chyba: zapomenout vydělit počtem čísel, nebo spočítat špatně počet čísel.",
      example: "Průměr 3, 5, 7, 9: součet = 24, počet = 4, průměr = 24 ÷ 4 = 6.",
    },
  },
];
