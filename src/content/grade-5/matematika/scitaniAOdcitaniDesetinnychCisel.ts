import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { ciselnaUloha, fdec, fkc, pick, rnd, sada, type Chyba } from "./_mat";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy byly pevný seznam bez nápověd
// a bez vysvětlení chybných možností. Teď generátor; počítá se v setinách jako
// s celými čísly, takže klíč nemá chyby zaokrouhlení. Distraktory jsou typické
// chyby: desetiny sečtené bez přenosu (3,7 + 2,5 = 5,12), zarovnání podle
// posledního místa místo podle čárky (3,5 + 1,25 = 4,30), zapomenutá čárka.
// L1 obě čísla s desetinami · L2 desetiny se setinami · L3 slovní úlohy
// o penězích a délkách na dva kroky.
//
// Doplněno 2026-09-12 (inventura obsahu): nápovědy nenesly data konkrétní
// úlohy — jedna věta obsloužila celou skupinu zadání (u stuhy se malá
// nápověda opakovala dvakrát, velká byla u všech úloh stejná). Teď obě
// nápovědy počítají s čísly té úlohy a `bezLeaku` hlídá, aby se mezi nimi
// náhodou neobjevil výsledek.

/**
 * Desetinné číslo v tomhle tématu se nikdy nezobrazí jako celé: 6 se píše
 * „6,0". Bez toho stálo mezi možnostmi „5,8 | 5,9 | 6 | 59" jediné číslo bez
 * čárky a šlo poznat podle tvaru, ne podle výpočtu — a dítě, které se zrovna
 * učí, že 6 = 6,0, to navíc mate.
 */
const desetinne = (n: number, min: number) =>
  n.toLocaleString("cs-CZ", { minimumFractionDigits: min, maximumFractionDigits: 4 }).replace(/\s/g, " ");

const D = (setiny: number) => desetinne(setiny / 100, 1);

/**
 * Nápověda smí zopakovat zadaná čísla, ale nikdy ne výsledek. U desetinných
 * čísel se výsledek může s některým zadaným číslem náhodou shodnout (4,5 − 1,2
 * i 3,9 − 0,6 dají 3,3), proto se hledá samostatné číslo, ne podřetězec.
 * Když se trefí, zadání se zahodí a generátor zkusí jiná čísla.
 */
function bezLeaku(key: string, hints: [string, string]): boolean {
  const cislo = key.match(/^-?\d+(?:,\d+)?/)?.[0];
  if (!cislo) return true;
  const re = new RegExp(`(^|[^\\d,.])${cislo.replace(/,/g, ",")}([^\\d,.]|$)`);
  return !hints.some((h) => re.test(h));
}

function jednoMisto(): PracticeTask | null {
  const plus = Math.random() < 0.5;
  let a = rnd(11, 199), b = rnd(11, 199); // v desetinách
  if (!plus && a < b) [a, b] = [b, a];
  if (a % 10 === 0 || b % 10 === 0 || a === b) return null;
  const vysl = plus ? a + b : a - b;
  if (vysl === a || vysl === b) return null;
  const [ca, da, cb, db] = [Math.floor(a / 10), a % 10, Math.floor(b / 10), b % 10];
  const T = (x: number) => desetinne(x / 10, 1);
  if (T(a).includes(T(vysl)) || T(b).includes(T(vysl))) return null;
  const chyby: Chyba[] = plus
    ? [
      ...(da + db >= 10 ? [
        { value: `${ca + cb},${da + db}`, why: `Desetiny ${da} + ${db} = ${da + db} desetin, to je 1 celá a ${(da + db) % 10} desetin. Celá se přenese k celým.` },
        { value: T(vysl - 10), why: "Z desetin se měla přenést 1 celá, ale zapomněla se přičíst." },
      ] : []),
      { value: String(vysl), why: "Chybí desetinná čárka — výsledek je desetkrát větší." },
      { value: T(vysl + 1), why: `Desetiny: ${da} + ${db} = ${da + db}. Zkontroluj poslední číslici.` },
      { value: T(vysl - 1), why: `Desetiny: ${da} + ${db} = ${da + db}. Zkontroluj poslední číslici.` },
    ]
    : [
      ...(da < db ? [
        { value: `${ca - cb},${db - da}`, why: `U desetin se odečetlo menší od většího (${db} − ${da}). Správně se musí půjčit 1 celá: ${da + 10} − ${db}.` },
        { value: T(vysl + 10), why: "Půjčila se 1 celá, ale zapomněla se odečíst od celých." },
      ] : []),
      { value: String(vysl), why: "Chybí desetinná čárka — výsledek je desetkrát větší." },
      { value: T(a + b), why: "Čísla se sečetla místo odečetla." },
      { value: T(vysl + 1), why: "Zkontroluj desetiny." },
    ];
  const znak = plus ? "+" : "−";
  const hints: [string, string] = plus
    ? [
      `Zapiš ${T(a)} a ${T(b)} pod sebe tak, aby čárka stála přesně pod čárkou. Začni vpravo u desetin: kolik dají ${da} a ${db} dohromady?`,
      `Sečti nejdřív desetiny, tedy ${da} a ${db}. Když ti vyjde deset nebo víc, zapiš pod čáru jen jednotky a jednu celou si přenes doleva k celým číslům ${ca} a ${cb}. Teprve potom sečti celá čísla a přenesenou celou k nim přičti. Do výsledku nakonec opiš čárku přesně pod ty dvě nad ním.`,
    ]
    : [
      `Zapiš ${T(a)} a ${T(b)} pod sebe tak, aby čárka stála přesně pod čárkou. Začni vpravo u desetin: jde ${db} odečíst od ${da}?`,
      `U desetin odečítáš ${db} od ${da}. Když nahoře desetin nestačí, půjč si jednu celou od čísla ${ca} — je to deset desetin, takže jich máš najednou o deset víc — a u celých pak tu půjčenou celou nezapomeň odečíst. Do výsledku nakonec opiš čárku přesně pod ty dvě nad ním.`,
    ];
  if (!bezLeaku(T(vysl), hints)) return null;
  return ciselnaUloha(`Vypočítej: ${T(a)} ${znak} ${T(b)}`, T(vysl), chyby, hints, [
    `Desetiny: ${plus ? `${da} + ${db} = ${da + db}${da + db >= 10 ? " → píšu " + ((da + db) % 10) + ", 1 přenáším" : ""}` : da < db ? `${da + 10} − ${db} = ${da + 10 - db} (půjčil jsem si 1 celou)` : `${da} − ${db} = ${da - db}`}`,
    `Celé: ${plus ? `${ca} + ${cb}${da + db >= 10 ? " + 1" : ""}` : `${ca}${da < db ? " − 1" : ""} − ${cb}`} = ${Math.floor(vysl / 10)}`,
    `Výsledek: ${T(vysl)}`,
  ]);
}

function ruznaMista(): PracticeTask | null {
  const plus = Math.random() < 0.5;
  const aDes = rnd(11, 99), bSet = rnd(101, 999); // a v desetinách, b v setinách
  if (aDes % 10 === 0 || bSet % 10 === 0) return null;
  let A = aDes * 10, B = bSet;
  let [txtA, txtB] = [fdec(aDes / 10), D(bSet)];
  if (!plus && A < B) { [A, B] = [B, A]; [txtA, txtB] = [txtB, txtA]; }
  const vysl = plus ? A + B : A - B;
  if (vysl <= 0 || txtA.includes(D(vysl)) || txtB.includes(D(vysl))) return null;
  // Chybné zarovnání: jedna desetina se vezme jako setiny (3,5 → 3,05).
  const spatneDes = Math.floor(aDes / 10) * 100 + (aDes % 10);
  const spatne = plus ? spatneDes + B : A === aDes * 10 ? spatneDes - B : A - spatneDes;
  const chyby: Chyba[] = [
    ...(spatne > 0 ? [{ value: D(spatne), why: `Čísla se zarovnala podle posledního místa, ne podle čárky: ${fdec(aDes / 10)} = ${fdec(aDes / 10)}0, ne ${D(spatneDes)}.` }] : []),
    { value: String(vysl), why: "Chybí desetinná čárka." },
    { value: D(plus ? vysl - 100 : vysl + 100), why: plus ? "Z desetin se měla přenést 1 celá." : "Při půjčování se zapomnělo odečíst 1 celou." },
    { value: D(plus ? vysl + 10 : vysl - 10), why: "Chyba u desetin — zkontroluj přenos ze setin." },
    { value: D(vysl + 1), why: "Chyba u setin." },
  ];
  const znak = plus ? "+" : "−";
  const hints: [string, string] = [
    `Číslo ${fdec(aDes / 10)} má za čárkou jedno místo, ${D(bSet)} má dvě. Co uděláš s ${fdec(aDes / 10)}, aby měla obě čísla stejný počet míst, než je ${plus ? "sečteš" : "odečteš"}?`,
    `K číslu ${fdec(aDes / 10)} připiš na konec nulu — jeho hodnota se tím nezmění, jen bude mít taky setiny jako ${D(bSet)}. Pak zapiš obě čísla pod sebe čárkou pod čárkou a ${plus ? "sčítej" : "odčítej"} zprava jako celá čísla: nejdřív setiny, potom desetiny a nakonec celé. Do výsledku opiš čárku přesně pod ty dvě nad ním.`,
  ];
  if (!bezLeaku(D(vysl), hints)) return null;
  return ciselnaUloha(`Vypočítej: ${txtA} ${znak} ${txtB}`, D(vysl), chyby, hints, [
    `Doplníme nulu: ${fdec(aDes / 10)} = ${fdec(aDes / 10)}0`,
    `${plus ? `${fdec(aDes / 10)}0 + ${D(bSet)}` : `${txtA.includes(",") && txtA.split(",")[1].length === 1 ? `${txtA}0` : txtA} − ${txtB.includes(",") && txtB.split(",")[1].length === 1 ? `${txtB}0` : txtB}`} = ${D(vysl)}`,
  ]);
}

const ZBOZI: [string, number, number][] = [
  ["sešit", 1290, 2990], ["pero", 890, 2490], ["chléb", 2990, 4590], ["mléko", 1690, 2890],
  ["pravítko", 990, 1990], ["jablka", 2450, 4990], ["sýr", 3290, 5490], ["čokoládu", 1990, 3490],
];
const JMENA = ["Eva", "Tomáš", "Lucka", "Filip", "Anna", "Jakub"];

function nakup(): PracticeTask | null {
  const [z1, z2] = [pick(ZBOZI), pick(ZBOZI)];
  if (z1 === z2) return null;
  const c1 = rnd(z1[1] / 10, z1[2] / 10) * 10, c2 = rnd(z2[1] / 10, z2[2] / 10) * 10; // v haléřích, na desetníky
  const platil = c1 + c2 <= 5000 ? 5000 : 10000;
  const vratili = platil - c1 - c2;
  if (vratili < 200) return null;
  const kdo = pick(JMENA);
  const P = (h: number) => fkc(h / 100);
  const hints: [string, string] = [
    `${kdo} platí dvě věci: ${z1[0]} za ${P(c1)} Kč a ${z2[0]} za ${P(c2)} Kč. Kolik stojí celý nákup dohromady?`,
    `Úloha má dva kroky. Nejdřív sečti ${P(c1)} a ${P(c2)} zapsané pod sebou čárkou pod čárkou — tak zjistíš cenu nákupu. Potom tuhle cenu odečti od ${platil / 100} Kč; celé koruny si proto napiš jako ${platil / 100},00, ať mají obě čísla stejně míst za čárkou.`,
  ];
  const klic = `${P(vratili)} Kč`;
  const a = kdo.endsWith("a") ? "a" : "";
  const q = `${kdo} koupil${a} ${z1[0]} za ${P(c1)} Kč a ${z2[0]} za ${P(c2)} Kč. Platil${a} ${platil / 100} Kč. Kolik korun ${a ? "jí" : "mu"} vrátili?`;
  // „8,90 Kč" je podřetězcem „18,90 Kč" v zadání — dítě by odpověď opsalo.
  if (q.includes(klic) || !bezLeaku(klic, hints)) return null;
  return ciselnaUloha(q, klic, [
    { value: `${P(c1 + c2)} Kč`, why: `To je cena nákupu. Ještě ji odečti od ${platil / 100} Kč, které dostal prodavač.` },
    { value: `${P(platil - c1)} Kč`, why: "Odečetla se jen první položka." },
    { value: `${P(vratili + 100)} Kč`, why: "Při odčítání se zapomnělo půjčit — zkontroluj korunu." },
    { value: `${P(vratili - 10)} Kč`, why: "Chyba u desetníků — zkontroluj číslice za čárkou." },
  ], hints, [
    `Nákup: ${P(c1)} + ${P(c2)} = ${P(c1 + c2)} Kč`,
    `Vrátili: ${platil / 100},00 − ${P(c1 + c2)} = ${P(vratili)} Kč`,
  ]);
}

function stuha(): PracticeTask | null {
  const cela = rnd(25, 60) * 10, p1 = rnd(51, 199), druhy = rnd(3, 9) * 10;
  if (p1 % 10 === 0) return null;
  const zbylo = cela - p1 - druhy;
  if (zbylo <= 20) return null;
  const co = pick([["stuha", "Stuha", "odstřihli"], ["provaz", "Provaz", "uřízli"], ["látka", "Látka", "odstřihli"]]);
  const hints: [string, string] = [
    `${co[1]} — celá délka ${D(cela)} m, ${co[0] === "provaz" ? "uříznuté" : "odstřižené"} kusy ${D(p1)} m a ${D(druhy)} m. Kolik metrů ubylo dohromady?`,
    `Sečti oba kusy, ${D(p1)} m a ${D(druhy)} m, zapsané pod sebou čárkou pod čárkou; kratšímu číslu si na konci doplň nulu, ať mají obě stejně míst za čárkou. Ten součet potom odečti od ${D(cela)} m. Můžeš taky odčítat postupně, nejdřív jeden kus a pak druhý — výsledek vyjde stejný.`,
  ];
  const klic = `${D(zbylo)} m`;
  const q = `${co[1]} měřil${co[0] === "provaz" ? "" : "a"} ${D(cela)} m. Nejdřív ${co[0] === "provaz" ? "z něj" : "z ní"} ${co[2]} ${D(p1)} m a potom ještě ${D(druhy)} m. Kolik metrů zbylo?`;
  // „1,3 m" je podřetězcem „11,3 m" v zadání — dítě by odpověď opsalo.
  if (q.includes(klic) || !bezLeaku(klic, hints)) return null;
  return ciselnaUloha(q, klic, [
    { value: `${D(cela - p1)} m`, why: "Odečetl se jen první kus." },
    { value: `${D(p1 + druhy)} m`, why: "To je délka obou odebraných kusů dohromady, ne zbytek." },
    { value: `${D(cela - p1 - Math.floor(druhy / 10))} m`, why: `${D(druhy)} m je ${druhy / 10} desetin metru, ne setin — zarovnej čárky pod sebe.` },
    { value: `${D(zbylo + 100)} m`, why: "Při odčítání se zapomnělo půjčit celý metr." },
  ], hints, [
    `Ubylo celkem: ${D(p1)} + ${D(druhy)} = ${D(p1 + druhy)} m`,
    `Zbylo: ${D(cela)} − ${D(p1 + druhy)} = ${D(zbylo)} m`,
  ]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return sada(30, jednoMisto);
  if (level === 2) return sada(30, ruznaMista);
  return sada(30, (i) => (i % 2 ? stuha() : nakup()));
}

export const SCITANIAODCITANIDESETINNYCHCISEL: TopicMetadata[] = [
  {
    id: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-scitani-a-odcitani-desetinnych-cisel",
    rvpNodeId: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-scitani-a-odcitani-desetinnych-cisel",
    title: "Sčítání a odčítání desetinných čísel",
    studentTitle: "Sčítání desetinných",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Velká čísla a desetinná čísla",
    briefDescription: "Sečteš a odečteš desetinná čísla pod sebou.",
    keywords: ["sčítání", "odčítání", "desetinná čísla", "desetinná čárka", "zarovnání"],
    goals: [
      "Sečíst dvě desetinná čísla s 1 nebo 2 desetinnými místy",
      "Odečíst dvě desetinná čísla s 1 nebo 2 desetinnými místy",
      "Zarovnat desetinné čárky při písemném výpočtu",
    ],
    boundaries: ["Bez záporných výsledků", "Bez násobení a dělení desetinných čísel"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Při sčítání a odčítání desetinných čísel nejprve zarovnej desetinné čárky pod sebe. Pak počítej jako s celými čísly.",
      steps: [
        "Zapiš čísla pod sebe tak, aby desetinné čárky byly v jedné svislé linii.",
        "Doplň nuly tam, kde chybí číslice (3,5 = 3,50).",
        "Sčítej nebo odčítej od zprava doleva.",
        "Přenes desetinnou čárku dolů do výsledku.",
      ],
      commonMistake: "Chyba: 3,5 + 1,25 = 4,75 ale žáci píší 4,30. Správně: 3,50 + 1,25 = 4,75.",
      example: "3,7 + 1,25: zapiš jako 3,70 + 1,25 = 4,95.",
    },
  },
];
