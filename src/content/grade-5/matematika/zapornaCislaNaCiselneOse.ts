import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad, isAre } from "@/lib/czechGrammar";
import { ciselnaUloha, pick, rnd, sada, shuffle, slovy } from "./_mat";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy byly pevný seznam bez nápověd
// a bez vysvětlení chybných možností. Teď generátor s typickými chybami:
// „−8 je víc než −3, protože 8 je víc než 3“, záporné číslo na špatné straně
// osy, vzdálenost od nuly se znaménkem.
// L1 záporné číslo na ose, na teploměru a pod hladinou, vzdálenost od nuly
// · L2 největší a nejmenší ze čtyř čísel, seřazení · L3 posun po ose o několik
// dílů (změna teploty, patra pod zemí, kolik dílů je mezi dvěma čísly).

const Z = (n: number) => (n < 0 ? `−${-n}` : String(n));

function naOse(): PracticeTask | null {
  const n = rnd(2, 15);
  return ciselnaUloha(`Které číslo leží na číselné ose ${pad(n, "DÍL")} vlevo od nuly?`, Z(-n), [
    { value: Z(n), why: `${n} leží vpravo od nuly. Vlevo od nuly jsou záporná čísla se znaménkem minus.` },
    { value: Z(-(n + 1)), why: "Počítej dílky znovu — od nuly, ne od prvního dílku." },
    { value: Z(-(n - 1)), why: "Počítej dílky znovu — nula se nepočítá jako první dílek." },
  ], [
    `Na kterou stranu od nuly leží čísla se znaménkem minus? A kolik dílů máš odpočítat?`,
    "Vpravo od nuly jsou kladná čísla, vlevo záporná. Číslo, které je o několik dílů vlevo od nuly, zapíšeš s minusem a počtem dílů.",
  ], [`Vlevo od nuly = záporné číslo`, `${pad(n, "DÍL")} vlevo → ${Z(-n)}`]);
}

function teplomer(): PracticeTask | null {
  const n = rnd(2, 25);
  return ciselnaUloha(`Teploměr ukazuje teplotu ${n} °C pod nulou. Jak ji zapíšeš číslem?`, `${Z(-n)} °C`, [
    { value: `${n} °C`, why: "Bez minusu by to byla teplota nad nulou." },
    { value: `${Z(-(n + 10))} °C`, why: `Pod nulou je o ${n}, ne o ${n + 10}.` },
    { value: "0 °C", why: "Nula je bod mrazu. Teplota pod nulou je záporné číslo." },
  ], [
    `Teplota je pod bodem mrazu. Jaké znaménko dáš před číslo ${slovy(n)}?`,
    "Teploty pod nulou se zapisují se znaménkem minus. Nula je bod mrazu, teplota nad ní je kladná.",
  ], [`Pod nulou → minus`, `${n} °C pod nulou = ${Z(-n)} °C`]);
}

function hloubka(): PracticeTask | null {
  const n = rnd(3, 40), kdo = pick(["Potápěč", "Ponorka", "Kotva"]);
  return ciselnaUloha(`${kdo} je ${n} m pod hladinou. Jak tu výšku zapíšeš číslem, když hladina je 0 m?`, `${Z(-n)} m`, [
    { value: `${n} m`, why: `${n} m by bylo nad hladinou.` },
    { value: `${Z(-(n * 10))} m`, why: `Pod hladinou je ${n} m, ne ${n * 10} m.` },
    { value: `${Z(-(n + 1))} m`, why: "Zkontroluj číslo — hloubka je v zadání." },
  ], [
    `Je ${kdo.toLowerCase()} nad hladinou, nebo pod ní? Jaké znaménko pak dostane číslo ${slovy(n)}?`,
    "Hladina je nula. Co je nad ní, zapíšeš kladným číslem, co je pod ní, záporným — se znaménkem minus.",
  ], [`Hladina = 0`, `Pod hladinou → ${Z(-n)} m`]);
}

function vzdalenost(): PracticeTask | null {
  const n = rnd(2, 20);
  return ciselnaUloha(`Kolik dílů je na číselné ose od nuly k číslu ${Z(-n)}?`, pad(n, "DÍL"), [
    { value: pad(n + 1, "DÍL"), why: "Nula se nepočítá jako dílek — počítají se mezery mezi čísly." },
    { value: pad(n - 1, "DÍL"), why: "Počítej znovu: od nuly až k číslu." },
    { value: pad(2 * n, "DÍL"), why: `To by bylo z čísla ${Z(-n)} až k číslu ${n} na druhé straně.` },
  ], [
    `Zkus si na ose odpočítat od nuly doleva až k číslu minus ${slovy(n)}. Kolik skoků uděláš?`,
    "Vzdálenost od nuly je vždy kladné číslo — je to počet dílů mezi nulou a číslem. Znaménko jen říká, na které straně číslo leží.",
  ], [`Od 0 doleva k ${Z(-n)}: ${pad(n, "DÍL")}`]);
}

function nejmensi(): PracticeTask | null {
  const a = rnd(14, 30), b = rnd(10, a - 3), c = rnd(1, 9);
  const key = Z(-a);
  const ds = [
    { value: Z(-b), why: `${Z(-b)} leží blíž nule, tedy víc vpravo než ${key}.` },
    { value: "0", why: "Nula leží vpravo od všech záporných čísel." },
    { value: String(c), why: `${c} je kladné — leží vpravo od nuly.` },
  ];
  const vse = shuffle([key, ...ds.map((d) => d.value)]);
  return ciselnaUloha(`Které z čísel ${vse.join("; ")} je nejmenší?`, key, ds, [
    `Představ si číselnou osu. Kde na ní leží ${Z(-b)} a kde ${c}? Které z čísel je ze všech nejvíc vlevo?`,
    "Čísla na ose rostou zleva doprava. Záporná čísla jsou vlevo od nuly, a čím dál od nuly doleva, tím víc vlevo — bez ohledu na to, jak velká číslice stojí za minusem.",
  ], [`Na ose zleva: ${[...vse].sort((x, y) => Number(x.replace("−", "-")) - Number(y.replace("−", "-"))).join("; ")}`, `Nejvíc vlevo: ${key}`]);
}

function nejvetsi(): PracticeTask | null {
  const cisla = new Set<number>();
  while (cisla.size < 4) cisla.add(-rnd(10, 40));
  const xs = [...cisla].sort((x, y) => x - y);
  const key = Z(xs[3]);
  const ds = [
    { value: Z(xs[0]), why: `Za minusem stojí velká číslice, ale ${Z(xs[0])} leží na ose ze všech nejvíc vlevo.` },
    { value: Z(xs[1]), why: `${Z(xs[1])} leží dál od nuly než ${key}, tedy víc vlevo.` },
    { value: Z(xs[2]), why: `${Z(xs[2])} leží dál od nuly než ${key}, tedy víc vlevo.` },
  ];
  const vse = shuffle(xs.map(Z));
  return ciselnaUloha(`Které z čísel ${vse.join("; ")} je největší?`, key, ds, [
    `Všechna čísla jsou záporná. Které z nich leží na ose nejblíž nule?`,
    "Na ose rostou čísla zleva doprava. U záporných čísel platí: čím blíž nule, tím víc vpravo — takže to s nejmenší číslicí za minusem je nejvíc vpravo.",
  ], [`Na ose zleva: ${xs.map(Z).join("; ")}`, `Nejvíc vpravo: ${key}`]);
}

function serad(): PracticeTask | null {
  const cisla = new Set<number>([-rnd(5, 15), -rnd(1, 4), rnd(1, 9)]);
  cisla.add(Math.random() < 0.5 ? 0 : -rnd(16, 25));
  if (cisla.size < 4) return null;
  const xs = [...cisla];
  const J = (a: number[]) => a.map(Z).join("; ");
  const key = [...xs].sort((a, b) => a - b);
  let zamichane = shuffle(xs);
  if (J(zamichane) === J(key)) zamichane = [...key].reverse();
  return ciselnaUloha(`Seřaď od nejmenšího: ${J(zamichane)}.`, J(key), [
    { value: J([...xs].sort((a, b) => Math.abs(a) - Math.abs(b))), why: "Řadilo se podle číslic bez ohledu na minus. Záporná čísla jsou ale vlevo od nuly." },
    { value: J([...key].reverse()), why: "To je pořadí od největšího." },
    { value: J([...xs].sort((a, b) => (a < 0 && b < 0 ? b - a : a - b))), why: "Záporná čísla se seřadila obráceně — to s větší číslicí za minusem leží víc vlevo." },
  ], [
    `Které z čísel ${J(xs)} leží na ose nejvíc vlevo, a které nejvíc vpravo?`,
    "Na ose rostou čísla zleva doprava: nejdřív záporná (to s největší číslicí za minusem úplně vlevo), pak nula a nakonec kladná čísla.",
  ], [`Na ose zleva doprava: ${J(key)}`]);
}

function teplota(): PracticeTask | null {
  const start = -rnd(2, 12), zmena = rnd(3, 15);
  const konec = start + zmena;
  if (konec === 0 || Math.abs(konec) === -start || Math.abs(konec) === zmena) return null;
  if (`${zmena} °C`.includes(`${Z(konec)} °C`) || Z(start).includes(Z(konec))) return null;
  const kdy = pick([["Ráno", "do poledne"], ["V noci", "do rána"], ["V pondělí", "do úterý"]]);
  return ciselnaUloha(`${kdy[0]} bylo ${Z(start)} °C, ${kdy[1]} se oteplilo o ${zmena} °C. Kolik stupňů bylo potom?`, `${Z(konec)} °C`, [
    { value: `${Z(start - zmena)} °C`, why: "Posun šel na špatnou stranu. Oteplení znamená posun po teploměru nahoru — doprava na ose." },
    { value: `${Z(-start + zmena)} °C`, why: "Minus se nevšímal. Teplota začínala pod nulou." },
    { value: `${Z(-konec)} °C`, why: `Znaménko nesedí: po posunu o ${pad(zmena, "DÍL")} nahoru z ${Z(start)} jsi ${konec > 0 ? "nad" : "pod"} nulou.` },
  ], [
    `Kolik dílů je z ${Z(start)} k nule? A kolik dílů ještě zbývá z oteplení o ${zmena} °C?`,
    "Oteplení = posun po teploměru nahoru (na ose doprava), ochlazení = dolů (doleva). Nejdřív dojdi k nule a pak pokračuj o zbytek.",
  ], [
    `Z ${Z(start)} k nule: ${pad(-start, "DÍL")}`,
    konec > 0 ? `Zbývá ${zmena} − ${-start} = ${konec} → ${konec} °C` : `Nula nestačí: ${Z(start)} + ${zmena} = ${Z(konec)} °C`,
  ]);
}

function patra(): PracticeTask | null {
  const start = -rnd(1, 3), nahoru = rnd(2, 8), konec = start + nahoru;
  if (konec === 0 || Math.abs(konec) === -start) return null;
  return ciselnaUloha(`Výtah stojí v patře ${Z(start)} (pod zemí). Vyjede o ${pad(nahoru, "PATRO")} nahoru. Ve kterém patře zastaví?`, Z(konec), [
    { value: Z(start - nahoru), why: "Výtah jel nahoru, ne dolů." },
    { value: Z(nahoru - start), why: "Nevšímal sis minusu — výtah začínal pod zemí." },
    { value: Z(konec + 1), why: "Přízemí má číslo 0 — i to je jedno patro na cestě." },
  ].map((c) => ({ ...c })), [
    `Kolik pater musí výtah z patra ${Z(start)} vyjet, aby byl v přízemí (0)?`,
    "Patra pod zemí mají záporná čísla, přízemí je 0. Jízda nahoru je posun doprava na číselné ose; přízemí se počítá jako jedno patro.",
  ], [`Z ${Z(start)} do přízemí: ${-start}`, `Zbývá ${nahoru} − ${-start} = ${konec} → patro ${Z(konec)}`]);
}

function mezi(): PracticeTask | null {
  const a = -rnd(2, 12), b = rnd(2, 12);
  const d = b - a;
  return ciselnaUloha(`Kolik dílů je na číselné ose mezi čísly ${Z(a)} a ${b}?`, pad(d, "DÍL"), [
    { value: pad(b + a > 0 ? b + a : -(b + a) || 1, "DÍL"), why: `Čísla se odečetla bez ohledu na minus. Z ${Z(a)} k nule ${isAre(-a)} ${pad(-a, "DÍL")} a z nuly k ${b} dalších ${b}.` },
    { value: pad(d + 1, "DÍL"), why: "Počítala se čísla, ne mezery mezi nimi." },
    { value: pad(d - 1, "DÍL"), why: "Nula leží mezi nimi a také se přes ni jde." },
  ], [
    `Kolik dílů je z ${Z(a)} k nule, a kolik z nuly k ${b}?`,
    "Když leží jedno číslo vlevo a druhé vpravo od nuly, rozděl cestu na dvě části: k nule a od nuly. Obě části sečti.",
  ], [`${Z(a)} → 0: ${pad(-a, "DÍL")}`, `0 → ${b}: ${pad(b, "DÍL")}`, `Celkem: ${-a} + ${b} = ${d}`]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) { const t = [naOse, teplomer, hloubka, vzdalenost]; return sada(30, (i) => t[i % 4]()); }
  if (level === 2) { const t = [nejmensi, nejvetsi, serad]; return sada(30, (i) => t[i % 3]()); }
  const t = [teplota, patra, mezi];
  return sada(30, (i) => t[i % 3]());
}

export const ZAPORNACISLANACISELNEOSE: TopicMetadata[] = [
  {
    id: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-zaporna-cisla-na-ciselne-ose",
    rvpNodeId: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-zaporna-cisla-na-ciselne-ose",
    title: "Záporná čísla na číselné ose",
    studentTitle: "Záporná čísla",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Velká čísla a desetinná čísla",
    briefDescription: "Pochopíš záporná čísla — třeba teplotu pod nulou.",
    keywords: ["záporná čísla", "číselná osa", "teplota", "porovnávání", "absolutní hodnota", "minus"],
    goals: [
      "Umístit záporné číslo na číselnou osu",
      "Porovnat záporná čísla navzájem i s kladnými",
      "Pochopit záporná čísla v kontextu teploty a hlubiny",
      "Určit vzdálenost čísla od nuly",
    ],
    boundaries: ["Úroveň 3: posun po číselné ose o několik dílů (změna teploty, patra pod zemí); bez písemného počítání se zápornými čísly", "Bez záporných desetinných čísel"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Záporná čísla leží vlevo od nuly na číselné ose. Platí: čím větší záporné číslo, tím menší hodnota. Takže −5 < −3 < 0 < 2.",
      steps: [
        "Nakresli si číselnou osu: ... −5, −4, −3, −2, −1, 0, 1, 2, 3, 4, 5 ...",
        "Záporná čísla jsou vlevo od nuly, kladná vpravo.",
        "Číslo více vlevo je menší: −8 < −3.",
        "Každé záporné číslo je menší než nula a než každé kladné číslo.",
      ],
      commonMistake: "Chyba: žáci si myslí, že −8 > −3, protože 8 > 3. Ale na číselné ose −8 leží více vlevo, takže −8 < −3.",
      example: "Porovnej −5 a −2: na číselné ose −5 je vlevo od −2, takže −5 < −2.",
    },
  },
];
