import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { ciselnaUloha, pick, rnd, sada } from "./_mat";

// Přepsáno 2026-09-12 (inventura obsahu). Předchozí verze měla nápovědy, které
// nenesly data konkrétní úlohy — jedna věta obsloužila celou skupinu (u triček
// a sukní 15×, u vrstvy kostek 3×, u rozdílů v řadě 12×). Teď každá úloha nese
// vlastní malou i velkou nápovědu složenou z vlastních čísel a vlastní
// strategie a každý distraktor vysvětluje právě tu svoji chybu.
//
// Kalibrace úrovní:
//  L1 rozpoznání — řada s pevným krokem (roste/klesá) a vybavení počtu hran,
//     stěn a vrcholů běžných těles.
//  L2 aplikace — řada, kde krok není pevný: násobení, střídání dvou kroků,
//     rostoucí krok. Vzor se musí nejdřív odhalit, pak použít.
//  L3 transfer — kombinatorika (podání rukou, dvojice oblečení), prostorová
//     představivost (kostky v kvádru, natřená krychle), inverze (z počtu kostek
//     zpět k počtu vrstev) a dvoukroková úloha o věku.

const rada = (xs: number[]) => `${xs.join(", ")}, ?`;

/**
 * Klíč se nesmí objevit jako podřetězec v zadání ani v nápovědě
 * (brána i docs-check hlídají klíče od tří znaků výš).
 */
function bezLeaku(q: string, key: number | string, hints: [string, string]): boolean {
  const s = String(key);
  if (s.length < 3) return true;
  return !q.includes(s) && !hints.some((h) => h.includes(s));
}

/**
 * U číselných řad se výsledek může náhodou shodovat s některým členem, který
 * nápověda vypisuje (např. 5, 8, 6, 9, 7, 10 → další je zase 8). Taková úloha
 * se zahodí, protože nápověda by odpověď rovnou ukázala.
 */
function hintBezCisla(key: number, hints: [string, string]): boolean {
  const s = String(key);
  return !hints.some((h) => (h.match(/\d+/g) ?? []).includes(s));
}

// ── L1 ──────────────────────────────────────────────────────────────────────

function aritmeticka(): PracticeTask | null {
  const krok = rnd(2, 15) * (Math.random() < 0.3 ? -1 : 1), a = krok > 0 ? rnd(1, 40) : rnd(80, 150);
  const xs = Array.from({ length: 5 }, (_, i) => a + i * krok);
  const key = a + 5 * krok;
  if (key < 0) return null;
  const q = `Které číslo v řadě pokračuje? ${rada(xs)}`;
  const hints: [string, string] = [
    `O kolik se liší ${xs[0]} a ${xs[1]}? A vyjde ti totéž i mezi ${xs[3]} a ${xs[4]}?`,
    `Porovnej postupně dvojice ${xs[0]} a ${xs[1]}, pak ${xs[1]} a ${xs[2]}, pak ${xs[2]} a ${xs[3]}. Když je rozdíl pokaždé stejný, řada má pevný krok — ten samý krok pak od posledního čísla ${xs[4]} ${krok > 0 ? "přičti" : "odečti"}.`,
  ];
  if (!bezLeaku(q, key, hints) || !hintBezCisla(key, hints)) return null;
  return ciselnaUloha(q, key, [
    { value: key + (krok > 0 ? 1 : -1), why: `Krok řady je ${Math.abs(krok)}, tady se použil krok ${Math.abs(krok) + 1}.` },
    { value: key - (krok > 0 ? 1 : -1), why: `Krok řady je ${Math.abs(krok)}, tady se použil krok ${Math.abs(krok) - 1}.` },
    { value: key + krok, why: `Krok ${Math.abs(krok)} se od ${xs[4]} použil dvakrát — hledá se ale jen nejbližší další číslo.` },
  ], hints, [
    `Krok řady: ${xs[1]} − ${xs[0]} = ${krok > 0 ? krok : `−${Math.abs(krok)}`}`,
    `Stejný rozdíl je i mezi posledními členy: ${xs[4]} − ${xs[3]} = ${krok > 0 ? krok : `−${Math.abs(krok)}`}`,
    `${xs[4]} ${krok > 0 ? "+" : "−"} ${Math.abs(krok)} = ${key}, protože řada pořád stejně ${krok > 0 ? "přidává" : "ubírá"}.`,
  ]);
}

type Co = "hran" | "stěn" | "vrcholů";
const CO: Co[] = ["hran", "stěn", "vrcholů"];

const POPIS: Record<Co, string> = {
  "hran": "hrana je čára, ve které se stýkají dvě stěny",
  "stěn": "stěna je celá plocha, kterou je těleso ohraničené",
  "vrcholů": "vrchol je špičatý roh, ve kterém se potkávají hrany",
};

interface Teleso {
  nazev: string;
  obraz: string;
  pocty: Record<Co, number>;
  strategie: Record<Co, string>;
  rozklad: Record<Co, string>;
}

const TELESA: Teleso[] = [
  {
    nazev: "krychle", obraz: "hrací kostku",
    pocty: { "hran": 12, "stěn": 6, "vrcholů": 8 },
    strategie: {
      "hran": "Krychle stojí na čtvercové podstavě — spočítej hrany toho spodního čtverce, stejný čtverec najdeš i nahoře a k tomu vedou svislé hrany, které oba čtverce spojují.",
      "stěn": "Krychle má čtvercovou podstavu dole, úplně stejný čtverec nahoře a kolem dokola svislé stěny; počítej je zvlášť dole, zvlášť nahoře a zvlášť po stranách.",
      "vrcholů": "Krychle má dole čtvercovou podstavu, a ta má čtyři rohy; přesně stejné rohy má i horní čtverec nad ní.",
    },
    rozklad: { "hran": "4 dole + 4 nahoře + 4 svislé = 12", "stěn": "1 dole + 1 nahoře + 4 po stranách = 6", "vrcholů": "4 dole + 4 nahoře = 8" },
  },
  {
    nazev: "kvádr", obraz: "krabici od bot",
    pocty: { "hran": 12, "stěn": 6, "vrcholů": 8 },
    strategie: {
      "hran": "Krabice od bot má na dně obdélník, na víku stejný obdélník a mezi nimi vede v každém rohu jedna svislá hrana; sečti tyhle tři skupiny.",
      "stěn": "U krabice od bot najdeš dno, víko a boční stěny — přední, zadní a dvě po stranách; počítej je popořadě, ať na žádnou nezapomeneš.",
      "vrcholů": "Krabice od bot má rohy na dně a přesně stejný počet rohů i na víku, takže stačí spočítat jednu skupinu a vzít ji dvakrát.",
    },
    rozklad: { "hran": "4 na dně + 4 na víku + 4 svislé = 12", "stěn": "dno + víko + 4 boční = 6", "vrcholů": "4 na dně + 4 na víku = 8" },
  },
  {
    nazev: "čtyřboký jehlan", obraz: "egyptskou pyramidu",
    pocty: { "hran": 8, "stěn": 5, "vrcholů": 5 },
    strategie: {
      "hran": "Pyramida stojí na čtvercové podstavě, takže dole jsou hrany toho čtverce, a od každého rohu podstavy vede ještě jedna hrana nahoru ke špičce.",
      "stěn": "Pyramida má dole čtvercovou podstavu a nad každou její stranou se zvedá jedna trojúhelníková stěna; nezapomeň podstavu započítat taky.",
      "vrcholů": "U pyramidy počítej nejdřív rohy čtvercové podstavy a teprve pak přidej špičku úplně nahoře.",
    },
    rozklad: { "hran": "4 v podstavě + 4 ke špičce = 8", "stěn": "1 podstava + 4 trojúhelníkové stěny = 5", "vrcholů": "4 rohy podstavy + 1 špička = 5" },
  },
  {
    nazev: "trojboký hranol", obraz: "stan s trojúhelníkovým čelem",
    pocty: { "hran": 9, "stěn": 5, "vrcholů": 6 },
    strategie: {
      "hran": "Hranol má trojúhelník na jednom konci, stejný trojúhelník na druhém konci a mezi nimi vedou podélné hrany od rohu k rohu; spočítej všechny tři skupiny.",
      "stěn": "U trojbokého hranolu jsou dvě trojúhelníkové podstavy proti sobě a mezi nimi obdélníkové stěny — nad každou stranou trojúhelníku jedna.",
      "vrcholů": "Trojboký hranol má rohy trojúhelníku na jednom konci a úplně stejné rohy na druhém konci, takže jednu skupinu spočítej a vezmi ji dvakrát.",
    },
    rozklad: { "hran": "3 na jednom konci + 3 na druhém + 3 podélné = 9", "stěn": "2 trojúhelníkové podstavy + 3 obdélníkové stěny = 5", "vrcholů": "3 na jednom konci + 3 na druhém = 6" },
  },
  {
    nazev: "trojboký jehlan", obraz: "špičatý stan se třemi stěnami",
    pocty: { "hran": 6, "stěn": 4, "vrcholů": 4 },
    strategie: {
      "hran": "Trojboký jehlan stojí na trojúhelníku, takže dole jsou jeho tři hrany, a od každého rohu podstavy vede jedna hrana nahoru ke špičce.",
      "stěn": "Trojboký jehlan má trojúhelníkovou podstavu a nad každou její stranou jednu trojúhelníkovou stěnu; podstava se počítá taky.",
      "vrcholů": "U trojbokého jehlanu spočítej nejdřív rohy trojúhelníkové podstavy a k nim přidej špičku nahoře.",
    },
    rozklad: { "hran": "3 v podstavě + 3 ke špičce = 6", "stěn": "1 podstava + 3 trojúhelníkové stěny = 4", "vrcholů": "3 rohy podstavy + 1 špička = 4" },
  },
];

function teleso(): PracticeTask | null {
  const t = pick(TELESA), co = pick(CO);
  const key = t.pocty[co];
  const jine = CO.filter((c) => c !== co).map((c) => ({ value: t.pocty[c], why: `${t.pocty[c]} je počet ${c}, ne ${co}.` }));
  const hints: [string, string] = [
    `Představ si ${t.obraz}. Vzpomeň si, že ${POPIS[co]}, a počítej po skupinách.`,
    `${t.strategie[co]} Mezisoučty jednotlivých skupin si zapiš, ať žádnou nepočítáš dvakrát ani na žádnou nezapomeneš.`,
  ];
  return ciselnaUloha(`Kolik ${co} má ${t.nazev}?`, key, [
    ...jine,
    { value: key + 2, why: `To je o 2 víc, než ${t.nazev} má — nejspíš se dvě započítaly dvakrát.` },
    { value: key - 2, why: `To je o 2 méně, než ${t.nazev} má — na dvě se zapomnělo, nejspíš vzadu.` },
    { value: key + 1, why: `To je o 1 víc, než ${t.nazev} má — přepočítej zvlášť podstavu a zvlášť zbytek.` },
    { value: key - 1, why: `To je o 1 méně, než ${t.nazev} má — jedna skupina zůstala nedopočítaná.` },
  ], hints, [
    `${t.nazev[0].toUpperCase()}${t.nazev.slice(1)}: ${t.rozklad[co]}`,
    `Proto má ${t.nazev} ${key} ${co === "hran" ? "hran" : co === "stěn" ? "stěn" : "vrcholů"} — počítá se po skupinách, které se nepřekrývají.`,
  ]);
}

// ── L2 ──────────────────────────────────────────────────────────────────────

function nasobici(): PracticeTask | null {
  const k = pick([2, 3]), a = rnd(1, k === 2 ? 12 : 5);
  const xs = Array.from({ length: 4 }, (_, i) => a * k ** i);
  const key = xs[3] * k, rozdil = xs[3] - xs[2];
  const q = `Které číslo v řadě pokračuje? ${rada(xs)}`;
  const hints: [string, string] = [
    `Rozdíly v řadě ${xs.join(", ")} nejsou stejné. Zkus místo odčítání dělit: kolik je ${xs[1]} : ${xs[0]}?`,
    `Vyděl i další dvojice: ${xs[2]} : ${xs[1]} a ${xs[3]} : ${xs[2]}. Když ti pokaždé vyjde totéž číslo, řada se nepřičítá, ale násobí — a stejným číslem musíš vynásobit i poslední člen ${xs[3]}.`,
  ];
  if (!bezLeaku(q, key, hints) || !hintBezCisla(key, hints)) return null;
  return ciselnaUloha(q, key, [
    { value: xs[3] + rozdil, why: `K ${xs[3]} se přičetl poslední rozdíl ${rozdil}. Rozdíly v téhle řadě ale rostou, protože každé číslo je ${k === 2 ? "dvakrát" : "třikrát"} větší než předchozí.` },
    { value: xs[3] + k, why: `Číslo ${k} se přičetlo, i když se jím má násobit: ${xs[0]} → ${xs[1]} není o ${k} víc, ale ${k}krát víc.` },
    { value: xs[3] * (k + 1), why: `Násobí se ${k}, ne ${k + 1} — zkontroluj to na dvojici ${xs[1]} a ${xs[2]}.` },
  ], hints, [
    `${xs[1]} : ${xs[0]} = ${k} a ${xs[2]} : ${xs[1]} = ${k}, takže každý další člen je ${k}krát větší.`,
    `${xs[3]} × ${k} = ${key}`,
  ]);
}

function stridava(): PracticeTask | null {
  const p = rnd(3, 9), m = rnd(2, p - 1), a = rnd(5, 30);
  const xs = [a];
  for (let i = 1; i < 6; i++) xs.push(xs[i - 1] + (i % 2 ? p : -m));
  // Kroky jdou v pořadí +p, −m, +p, −m, +p, takže na řadě je krok −m.
  const key = xs[5] - m;
  const q = `Které číslo v řadě pokračuje? ${rada(xs)}`;
  const hints: [string, string] = [
    `Řada ${xs.slice(0, 4).join(", ")} jednou roste a jednou klesá. Spočítej rozdíly mezi sousedy — opakují se dva různé?`,
    `Mezi ${xs[0]} a ${xs[1]} se přičítalo, mezi ${xs[1]} a ${xs[2]} odečítalo a dál se to zase střídá. Zjisti, který z těch dvou kroků byl použitý naposledy, mezi ${xs[4]} a ${xs[5]}, a teď použij ten druhý.`,
  ];
  if (!bezLeaku(q, key, hints) || !hintBezCisla(key, hints)) return null;
  return ciselnaUloha(q, key, [
    { value: xs[5] + p, why: `Krok +${p} se použil dvakrát za sebou. Kroky se ale střídají a mezi ${xs[4]} a ${xs[5]} se už přičítalo.` },
    { value: xs[5] + (p - m), why: `${p - m} je, o kolik řada vyroste za celou dvojici kroků (+${p} a −${m}). Teď je ale na řadě jen jeden krok, a to ten dolů.` },
    { value: key + 1, why: `Krok dolů je −${m}, tady se odečetlo jen ${m - 1} — ověř si ho na dvojici ${xs[1]} a ${xs[2]}.` },
  ], hints, [
    `Kroky za sebou: +${p}, −${m}, +${p}, −${m}, +${p}`,
    `Naposledy se přičítalo (z ${xs[4]} na ${xs[5]}), takže teď se střídavě odečítá: krok je −${m}.`,
    `${xs[5]} − ${m} = ${key}`,
  ]);
}

function rostouciKrok(): PracticeTask | null {
  const a = rnd(1, 20), k0 = rnd(1, 4);
  const xs = [a];
  for (let i = 0; i < 4; i++) xs.push(xs[i] + k0 + i);
  const key = xs[4] + k0 + 4;
  const q = `Které číslo v řadě pokračuje? ${rada(xs)}`;
  const hints: [string, string] = [
    `Napiš si rozdíly mezi sousedy v řadě ${xs.join(", ")}. Tvoří samy nějakou řadu?`,
    `První rozdíl je ${xs[1] - xs[0]}, druhý ${xs[2] - xs[1]}, třetí ${xs[3] - xs[2]} a čtvrtý ${xs[4] - xs[3]}. Samy rozdíly tvoří řadu s pevným krokem, takže dopočítej, jaký rozdíl přijde na řadu jako pátý, a ten k číslu ${xs[4]} přičti.`,
  ];
  if (!bezLeaku(q, key, hints) || !hintBezCisla(key, hints)) return null;
  return ciselnaUloha(q, key, [
    { value: xs[4] + k0 + 3, why: `Použil se znovu rozdíl ${k0 + 3}, který už padl mezi ${xs[3]} a ${xs[4]}. Rozdíly se ale pokaždé zvětší o 1.` },
    { value: xs[4] + k0, why: `${k0} byl jen úplně první rozdíl, mezi ${xs[0]} a ${xs[1]}. Od té doby rozdíly povyrostly.` },
    { value: key + 1, why: `Další rozdíl je o 1 větší než ${k0 + 3}, tedy ${k0 + 4}, ne ${k0 + 5}.` },
  ], hints, [
    `Rozdíly: ${xs.slice(1).map((x, i) => x - xs[i]).join(", ")} — každý je o 1 větší než předchozí.`,
    `Pátý rozdíl je proto ${k0 + 4}.`,
    `${xs[4]} + ${k0 + 4} = ${key}`,
  ]);
}

// ── L3 ──────────────────────────────────────────────────────────────────────

function ruce(): PracticeTask | null {
  const n = rnd(4, 9), key = (n * (n - 1)) / 2;
  const hints: [string, string] = [
    `Dětí je ${n}. S kolika dalšími si podá ruku první z nich a kolik nových podání přidá druhé dítě, když s prvním už se pozdravilo?`,
    `První dítě podá ruku ${n - 1} dětem, druhé už jen ${n - 2} dalším (s prvním se pozdravilo), třetí ${n - 3} a tak dál až k poslednímu; sečti to. Druhá cesta: každé dítě podá ruku ${n - 1} dalším, jenže každé podání je tak započítané ze dvou stran.`,
  ];
  return ciselnaUloha(`Počet dětí na schůzce je ${n}. Každé dítě si podá ruku s každým jednou. Kolik podání rukou proběhne?`, key, [
    { value: n * (n - 1), why: `Každé podání se počítalo dvakrát: když si první dítě podá ruku s druhým, je to totéž podání jako druhé s prvním.` },
    { value: n * n, why: `Tenhle součin počítá navíc i podání každého dítěte se sebou samým, a taková se nekonají.` },
    { value: n - 1, why: `${n - 1} je počet podání jediného dítěte. Stejně tak se pozdraví i všechny ostatní děti.` },
  ], hints, [
    `Sečteme podání po dětech: ${Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(" + ")} = ${key}`,
    `Kontrola druhou cestou: ${n} × ${n - 1} = ${n * (n - 1)}, ale každé podání je tam dvakrát, takže ${n * (n - 1)} : 2 = ${key}.`,
  ]);
}

function obleceni(): PracticeTask | null {
  const t = rnd(2, 6), k = rnd(2, 5);
  if (t === k) return null;
  const tricka = pad(t, "TRIČKO"), sukne = pad(k, "SUKNĚ");
  const hints: [string, string] = [
    `Petra má ${tricka} a ${sukne}. Kolik různých dvojic vznikne, když si vezme jen to první tričko?`,
    `K prvnímu tričku se hodí kterákoli sukně, takže s ním samotným máš ${pad(k, "MOŽNOST")}. Úplně stejně to dopadne u druhého trička i u každého dalšího — a trička jsou ${t}, takže se stejný počet možností opakuje ${t}krát.`,
  ];
  return ciselnaUloha(`Petra má ${tricka} a ${sukne}. Kolik různých dvojic tričko a sukně si může vybrat?`, t * k, [
    { value: t + k, why: `Trička a sukně se sečetly, jenže ${t + k} je počet kusů oblečení. Dvojic je víc, protože ke každému tričku patří každá sukně.` },
    { value: t * k - 1, why: `Jedna dvojice se vynechala. Žádná kombinace trička se sukní se nevylučuje, počítají se všechny.` },
    { value: 2 * (t + k), why: `Tady se počítaly kusy oblečení a ještě se zdvojnásobily. Otázka se ale ptá na dvojice tričko a sukně.` },
  ], hints, [
    `S jedním tričkem má Petra tolik možností, kolik má sukní: ${pad(k, "MOŽNOST")}.`,
    `Triček je ${t} a u každého se ta nabídka opakuje: ${t} × ${k} = ${t * k}`,
  ]);
}

function kvadr(): PracticeTask | null {
  const a = rnd(2, 5), b = rnd(2, 5), c = rnd(2, 4);
  const hints: [string, string] = [
    `Spodní vrstva kvádru je obdélník ${a} × ${b} kostek a takových vrstev je na sobě ${c}. Kolik kostek leží v té jedné vrstvě?`,
    `Nejdřív spočítej jednu vrstvu, tedy obdélník ${a} × ${b} kostek. Takových stejných vrstev leží na sobě ${c}, takže výsledek jedné vrstvy vezmi ještě ${c}krát.`,
  ];
  return ciselnaUloha(`Kvádr je složený z kostek: na délku ${a}, na šířku ${b} a na výšku ${c}. Kolik kostek má celý kvádr?`, a * b * c, [
    { value: a + b + c, why: `Rozměry se sečetly. Kostky ale vyplňují celý prostor, proto se ${a}, ${b} a ${c} násobí.` },
    { value: a * b, why: `${a * b} je počet kostek v jedné vrstvě. Vrstev je na sobě ${c}.` },
    { value: a * b * c - c, why: `Uvnitř kvádru žádná kostka nechybí — je plný, takže se nic neodečítá.` },
  ], hints, [
    `Jedna vrstva: ${a} × ${b} = ${a * b} kostek`,
    `Vrstev je ${c}, a proto ${a * b} × ${c} = ${a * b * c}`,
  ]);
}

function natrena(): PracticeTask | null {
  const n = rnd(4, 6), key = (n - 2) ** 3;
  const hints: [string, string] = [
    `Barva se dostane jen na povrch krychle ${n} × ${n} × ${n}. Které kostky se jí tedy vůbec nedotknou?`,
    `Odloupni z krychle ${n} × ${n} × ${n} celou vnější slupku. Na každém rozměru zmizí jedna kostka na začátku i jedna na konci, takže uvnitř zůstane zase krychle, jen menší — a tu spočítej jako každý jiný kvádr.`,
  ];
  return ciselnaUloha(`Velkou krychli ${n} × ${n} × ${n} složenou z malých kostek natřeme zvenku barvou. Kolik malých kostek nebude natřených vůbec?`, key, [
    { value: (n - 1) ** 3, why: `Z každého rozměru se odebrala jen jedna kostka. Natřená je ale vrstva na obou koncích, takže na každém rozměru ubydou dvě.` },
    { value: (n - 2) ** 2 * 6, why: `${(n - 2) ** 2 * 6} je počet kostek, které mají natřenou právě jednu stěnu — leží uvnitř stěn, ale barvy se dotýkají, takže se sem nepočítají.` },
    { value: n * n, why: `${n * n} je počet kostek na jedné stěně krychle, ne počet kostek schovaných uvnitř.` },
    { value: (n - 2) ** 2, why: `${(n - 2) ** 2} je jen jedna vnitřní vrstva. Vnitřek je krychle, takže takových vrstev je nad sebou víc.` },
  ], hints, [
    `Na každém rozměru odpadne kostka na obou koncích: ${n} − 2 = ${n - 2}`,
    `Vnitřek je tedy krychle ${n - 2} × ${n - 2} × ${n - 2} = ${key}`,
  ]);
}

function kvadrInverze(): PracticeTask | null {
  const a = rnd(2, 5), b = rnd(2, 5), c = rnd(2, 4);
  const vrstva = a * b, celkem = vrstva * c;
  if (a === b) return null;
  const q = `Kvádr je poskládaný z ${pad(celkem, "KOSTKA")}. V jedné vrstvě jich leží ${a} × ${b}. Kolik vrstev je na sobě?`;
  const hints: [string, string] = [
    `Kvádr má dohromady ${pad(celkem, "KOSTKA")}. Nejdřív zjisti, kolik jich má jedna vrstva — je to obdélník ${a} × ${b}.`,
    `Jedna vrstva má ${a} × ${b} kostek — spočítej ji. Celý kvádr je z takových stejných vrstev poskládaný, takže zjisti, kolikrát se počet kostek jedné vrstvy vejde do ${celkem}; to je dělení, ne odčítání.`,
  ];
  if (!bezLeaku(q, c, hints)) return null;
  return ciselnaUloha(q, c, [
    { value: vrstva, why: `${vrstva} je počet kostek v jedné vrstvě, ne počet vrstev. Vrstev je tolikrát, kolikrát se ${vrstva} vejde do ${celkem}.` },
    { value: c + 1, why: `O jednu vrstvu víc: ${(c + 1) * vrstva} kostek by už bylo víc, než kvádr má.` },
    { value: c - 1, why: `O jednu vrstvu míň: ${(c - 1) * vrstva} kostek by kvádr nezaplnilo, zbylo by jich ještě ${vrstva}.` },
    { value: celkem - vrstva, why: `Tady se odečítalo. Vrstvy se ale zjistí dělením — kolikrát se jedna vrstva vejde do celku.` },
  ], hints, [
    `Jedna vrstva: ${a} × ${b} = ${vrstva} kostek`,
    `Vrstev je tolik, kolikrát se ${vrstva} vejde do ${celkem}: ${celkem} : ${vrstva} = ${c}`,
    `Zkouška: ${vrstva} × ${c} = ${celkem} ✓`,
  ]);
}

const DVOJICE: [string, string][] = [
  ["Tomáš", "Eva"], ["Marek", "Klára"], ["Adam", "Nela"], ["Petr", "Iva"], ["Filip", "Zuzka"], ["Honza", "Bára"],
];

function vek(): PracticeTask | null {
  const [A, B] = pick(DVOJICE);
  const m = rnd(6, 14), d = rnd(2, 9);
  if (m === d) return null;
  const S = 2 * m + d, key = m + d;
  const q = `${A} a ${B} mají dohromady ${pad(S, "ROK")}. ${A} je o ${pad(d, "ROK")} starší než ${B}. Kolik let je staršímu z nich?`;
  const hints: [string, string] = [
    `${A} a ${B}: představ si jejich věky jako dvě tyčky — jedna je o ${d} delší a dohromady měří ${S}. Co se stane, když tu delší o ${d} zkrátíš?`,
    `${A} a ${B} mají dohromady ${pad(S, "ROK")}. Odečti od toho součtu rozdíl ${pad(d, "ROK")} — co zbude, patří dvěma stejně starým dětem, takže se to dá rozdělit na poloviny. Tak zjistíš věk mladšího a rozdíl pak přičti zpátky.`,
  ];
  if (!bezLeaku(q, key, hints) || !hintBezCisla(key, hints)) return null;
  return ciselnaUloha(q, key, [
    { value: m, why: `${m} je věk mladšího z nich. Starší má ještě o ${pad(d, "ROK")} víc.` },
    { value: S - d, why: `Rozdíl se od součtu odečetl správně, ale výsledek ${S - d} patří oběma dohromady — ještě se musí rozdělit na dva stejné díly.` },
    { value: key + d, why: `Rozdíl ${d} se přičetl dvakrát. Stačí ho k věku mladšího přidat jednou.` },
    { value: S, why: `${S} je součet obou věků, ne věk jednoho z nich.` },
  ], hints, [
    `Rozdíl odečteme od součtu: ${S} − ${d} = ${S - d}`,
    `${S - d} patří dvěma stejně starým dětem, takže mladší má ${S - d} : 2 = ${m}`,
    `Starší je o ${d} let víc: ${m} + ${d} = ${key}. Zkouška: ${m} + ${key} = ${S} ✓`,
  ]);
}

const L2 = [nasobici, stridava, rostouciKrok];
const L3 = [ruce, obleceni, kvadr, natrena, kvadrInverze, vek];

function gen(level: number): PracticeTask[] {
  if (level === 1) return sada(30, (i) => (i % 4 === 3 ? teleso() : aritmeticka()));
  if (level === 2) return sada(30, (i) => L2[i % L2.length]());
  return sada(30, (i) => L3[i % L3.length]());
}

export const ULOHYNEZAVISLENABEZNYCHPOSTUPECHPROSTOROVAPREDSTAVIVOST: TopicMetadata[] = [
  {
    id: "g5-matematika-nestandardni-aplikacni-ulohy-a-problemy-logicke-ulohy-ulohy-nezavisle-na-beznych-postupech-prostorova-predstavivos",
    rvpNodeId: "g5-matematika-nestandardni-aplikacni-ulohy-a-problemy-logicke-ulohy-ulohy-nezavisle-na-beznych-postupech-prostorova-predstavivos",
    title: "Úlohy nezávislé na běžných postupech, prostorová představivost",
    studentTitle: "Logické úlohy",
    subject: "matematika",
    category: "Nestandardní aplikační úlohy a problémy",
    topic: "Logické úlohy",
    briefDescription: "Procvičíš logické myšlení a prostorovou představivost.",
    keywords: ["logika", "číselné řady", "vzor", "prostorová představivost", "kostky", "síť tělesa"],
    goals: [
      "Rozpoznat vzor v číselné řadě a doplnit chybějící číslo",
      "Řešit nestandardní úlohy bez obvyklého algoritmu",
      "Představit si tvar při pohledu ze shora nebo z boku",
      "Rozvíjet logické myšlení a kombinatorické uvažování",
    ],
    boundaries: ["Bez složité pravděpodobnosti", "Bez algebraických rovnic"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "mixed",
    generator: gen,
    helpTemplate: {
      hint: "Nejprve zkus rozeznat vzor (co se opakuje nebo jak roste). U prostorových úloh si tvar nakresli nebo představ krok po kroku.",
      steps: [
        "Přečti úlohu pečlivě a zjisti, co se ptá.",
        "Hledej vzor: o kolik se mění čísla? Násobí se? Opakují se symboly?",
        "Ověř svůj tip: přilož ho na začátek řady a zkontroluj.",
        "U prostorových úloh si nakresli tvar nebo pohled.",
      ],
      commonMistake: "Chyba: u číselných řad hledat jen součet (+n), když jde o násobení (×n). Vždy otestuj oba vzory.",
      example: "Řada 2, 4, 8, 16, ?: každé číslo je dvakrát větší → 32.",
    },
  },
];
