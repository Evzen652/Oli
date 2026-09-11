import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { ciselnaUloha, pick, rnd, sada } from "./_mat";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy byly pevný seznam bez nápověd
// a bez vysvětlení chybných možností. Teď generátor s typickými chybami
// (u řady s násobením pokračovat přičítáním, u podání rukou počítat každou
// dvojici dvakrát, u natřené krychle zapomenout na vnitřní kostky).
// L1 řada, která roste nebo klesá o stejné číslo · L2 řada s násobením,
// se střídáním dvou kroků nebo s rostoucím krokem · L3 kombinatorika
// a prostorová představivost (podání rukou, oblečení, kostky v kvádru, natřená
// krychle, hrany a stěny těles).

const rada = (xs: number[]) => `${xs.join(", ")}, ?`;

function aritmeticka(): PracticeTask | null {
  const krok = rnd(2, 15) * (Math.random() < 0.3 ? -1 : 1), a = krok > 0 ? rnd(1, 40) : rnd(80, 150);
  const xs = Array.from({ length: 5 }, (_, i) => a + i * krok);
  const key = a + 5 * krok;
  if (key < 0) return null;
  return ciselnaUloha(`Které číslo v řadě pokračuje? ${rada(xs)}`, key, [
    { value: key + (krok > 0 ? 1 : -1), why: `Krok je ${Math.abs(krok)}, ne ${Math.abs(krok) + 1}.` },
    { value: key - (krok > 0 ? 1 : -1), why: `Krok je ${Math.abs(krok)}, ne ${Math.abs(krok) - 1}.` },
    { value: key + krok, why: "Krok se přičetl dvakrát — hledáš jen další číslo." },
  ], [
    `O kolik se liší ${xs[0]} a ${xs[1]}? A platí to i pro ${xs[3]} a ${xs[4]}?`,
    "Když se sousední čísla liší pořád o stejné číslo, stačí ho přičíst (nebo odečíst) k poslednímu číslu řady.",
  ], [`Krok: ${xs[1]} − ${xs[0]} = ${krok}`, `${xs[4]} ${krok > 0 ? "+" : "−"} ${Math.abs(krok)} = ${key}`]);
}

function nasobici(): PracticeTask | null {
  const k = pick([2, 3]), a = rnd(1, k === 2 ? 12 : 5);
  const xs = Array.from({ length: 4 }, (_, i) => a * k ** i);
  const key = xs[3] * k, rozdil = xs[3] - xs[2];
  return ciselnaUloha(`Které číslo v řadě pokračuje? ${rada(xs)}`, key, [
    { value: xs[3] + rozdil, why: `Přičetl se poslední rozdíl (${rozdil}), ale rozdíly rostou — každé číslo je ${k === 2 ? "dvakrát" : "třikrát"} větší než předchozí.` },
    { value: xs[3] + k, why: `Přičetlo se ${k}, ale čísla se ${k === 2 ? "zdvojnásobují" : "ztrojnásobují"}.` },
    { value: xs[3] * (k + 1), why: `Násobí se ${k}, ne ${k + 1}.` },
  ], [
    `Liší se sousední čísla ${xs.join(", ")} pořád o stejné číslo? Zkus místo odčítání dělit: ${xs[1]} : ${xs[0]}.`,
    "Když rozdíly rostou, zkus, jestli se čísla nenásobí. Poznáš to tak, že každé číslo je stejněkrát větší než to předchozí.",
  ], [`${xs[1]} : ${xs[0]} = ${k}, ${xs[2]} : ${xs[1]} = ${k}`, `${xs[3]} × ${k} = ${key}`]);
}

function stridava(): PracticeTask | null {
  const p = rnd(3, 9), m = rnd(1, p - 1), a = rnd(5, 30);
  const xs = [a];
  for (let i = 1; i < 6; i++) xs.push(xs[i - 1] + (i % 2 ? p : -m));
  const key = xs[5] + p;
  return ciselnaUloha(`Které číslo v řadě pokračuje? ${rada(xs)}`, key, [
    { value: xs[5] - m, why: `Kroky se střídají: +${p}, −${m}. Po odečtení přichází přičtení.` },
    { value: xs[5] + (p - m), why: `${p - m} je, o kolik řada vyroste za dva kroky; další krok je ale jen +${p}.` },
    { value: key + 1, why: `Krok je +${p}, ne +${p + 1}.` },
  ], [
    `Napiš si rozdíly mezi sousedními čísly ${xs.slice(0, 4).join(", ")}. Opakují se?`,
    "Rozdíly se můžou střídat, třeba přičti, odečti, přičti… Zjisti, který krok přišel naposledy, a použij ten druhý.",
  ], [`Kroky: +${p}, −${m}, +${p}, −${m}, +${p}`, `Poslední byl −${m}, další je +${p}: ${xs[5]} + ${p} = ${key}`]);
}

function rostouciKrok(): PracticeTask | null {
  const a = rnd(1, 20), k0 = rnd(1, 4);
  const xs = [a];
  for (let i = 0; i < 4; i++) xs.push(xs[i] + k0 + i);
  const key = xs[4] + k0 + 4;
  return ciselnaUloha(`Které číslo v řadě pokračuje? ${rada(xs)}`, key, [
    { value: xs[4] + k0 + 3, why: `Krok se neopakuje, roste o 1: ${k0}, ${k0 + 1}, ${k0 + 2}, ${k0 + 3}, ${k0 + 4}.` },
    { value: xs[4] + k0, why: `${k0} byl jen první krok; kroky se zvětšují.` },
    { value: key + 1, why: `Další krok je ${k0 + 4}, ne ${k0 + 5}.` },
  ], [
    `Napiš si rozdíly mezi sousedními čísly: ${xs[1] - xs[0]}, ${xs[2] - xs[1]}, … Jak se mění?`,
    "Když rozdíly nejsou stejné, podívej se, jestli samy netvoří řadu — třeba rostou vždy o 1. Další rozdíl pak přičti k poslednímu číslu.",
  ], [`Rozdíly: ${xs.slice(1).map((x, i) => x - xs[i]).join(", ")}, další ${k0 + 4}`, `${xs[4]} + ${k0 + 4} = ${key}`]);
}

function ruce(): PracticeTask | null {
  const n = rnd(4, 9), key = (n * (n - 1)) / 2;
  return ciselnaUloha(`Počet dětí na schůzce je ${n}. Každé dítě si podá ruku s každým jednou. Kolik podání rukou proběhne?`, key, [
    { value: n * (n - 1), why: `Každé podání se počítalo dvakrát — když si Eva podá ruku s Petrem, je to totéž podání jako Petr s Evou.` },
    { value: n * n, why: "Nikdo si nepodává ruku sám se sebou a každá dvojice se počítá jednou." },
    { value: n - 1, why: `To je počet podání jen jednoho dítěte. Každé z dětí si podá ruku s ${n - 1} dalšími.` },
  ], [
    `S kolika dětmi si podá ruku první dítě? A s kolika novými druhé, když s prvním už se pozdravilo?`,
    `První dítě podá ruku ${n - 1} dětem, druhé už jen ${n - 2} novým, třetí ${n - 3}… Sečti to. Nebo: každé dítě podá ${n - 1} rukou, ale každé podání tak počítáš dvakrát, takže vyděl dvěma.`,
  ], [`${Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(" + ")} = ${key}`, `Nebo: ${n} × ${n - 1} : 2 = ${key}`]);
}

function obleceni(): PracticeTask | null {
  const t = rnd(2, 6), k = rnd(2, 5);
  if (t === k) return null;
  const tricka = pad(t, "TRIČKO"), sukne = pad(k, "SUKNĚ");
  return ciselnaUloha(`Petra má ${tricka} a ${sukne}. Kolik různých oblečení (tričko a sukně) si může obléct?`, t * k, [
    { value: t + k, why: "Trička a sukně se sečetly. Ke každému tričku ale můžeš vzít kteroukoli sukni." },
    { value: t * k - 1, why: "Žádná dvojice se nemá vynechat." },
    { value: 2 * (t + k), why: "Tady se nepočítají kusy oblečení, ale dvojice tričko + sukně." },
  ], [
    `Kolik oblečení dostaneš s prvním tričkem, když k němu vyzkoušíš všechny sukně?`,
    `Ke každému tričku se hodí každá sukně. S jedním tričkem máš ${pad(k, "MOŽNOST")}; to platí pro každé tričko, takže se násobí.`,
  ], [`Jedno tričko: ${pad(k, "MOŽNOST")}`, `${t} × ${k} = ${t * k}`]);
}

function kvadr(): PracticeTask | null {
  const a = rnd(2, 5), b = rnd(2, 5), c = rnd(2, 4);
  return ciselnaUloha(`Kvádr je složený z kostek: na délku ${a}, na šířku ${b} a na výšku ${c}. Kolik kostek má celý kvádr?`, a * b * c, [
    { value: a + b + c, why: "Rozměry se sečetly. Kostky vyplňují celý prostor, takže se násobí." },
    { value: a * b, why: `To je jen jedna vrstva. Vrstev je ${c}.` },
    { value: a * b * c - c, why: "Žádná kostka uvnitř nechybí — kvádr je plný." },
  ], [
    `Kolik kostek je v jedné vrstvě (${a} na délku a ${b} na šířku)? Kolik je vrstev?`,
    "Počet kostek v kvádru = kostky v jedné vrstvě × počet vrstev. Jedna vrstva má délka × šířka kostek.",
  ], [`Jedna vrstva: ${a} × ${b} = ${a * b}`, `${c} vrstvy: ${a * b} × ${c} = ${a * b * c}`]);
}

function natrena(): PracticeTask | null {
  const n = rnd(4, 6), key = (n - 2) ** 3;
  return ciselnaUloha(`Velkou krychli ${n} × ${n} × ${n} složenou z malých kostek natřeme zvenku barvou. Kolik malých kostek nebude natřených vůbec?`, key, [
    { value: (n - 1) ** 3, why: "Z každé strany se odebrala jen jedna vrstva. Natřená je ale vrstva na obou stranách — na každém rozměru ubudou dvě kostky." },
    { value: n ** 3 - n * n * 6, why: "Kostky na hranách a v rozích se tak odečetly vícekrát." },
    { value: n * n, why: "To je počet kostek na jedné stěně." },
  ], [
    `Které kostky se barvy vůbec nedotknou? Představ si, že z krychle ${n} × ${n} × ${n} odloupneš vnější vrstvu.`,
    `Nenatřené zůstanou jen kostky uvnitř. Na každém rozměru odpadne kostka na začátku i na konci, takže vnitřek je krychle ${n - 2} × ${n - 2} × ${n - 2}.`,
  ], [`Vnitřek: ${n} − 2 = ${n - 2} na každý rozměr`, `${n - 2} × ${n - 2} × ${n - 2} = ${key}`]);
}

const TELESA: [string, number, number, number][] = [
  ["krychle", 12, 6, 8], ["kvádr", 12, 6, 8], ["čtyřboký jehlan", 8, 5, 5], ["trojboký hranol", 9, 5, 6], ["trojboký jehlan", 6, 4, 4],
];

function teleso(): PracticeTask | null {
  const [nazev, h, s, v] = pick(TELESA);
  const co = pick(["hran", "stěn", "vrcholů"] as const);
  const key = co === "hran" ? h : co === "stěn" ? s : v;
  const jine = { hran: h, "stěn": s, "vrcholů": v };
  const chyby = (Object.entries(jine) as [string, number][]).filter(([k]) => k !== co).map(([k, x]) => ({ value: x, why: `${x} je počet ${k}, ne ${co}.` }));
  return ciselnaUloha(`Kolik ${co} má ${nazev}?`, key, [
    ...chyby,
    { value: key + 2, why: "Zkus je spočítat postupně: nahoře, dole a po stranách." },
    { value: key - 2, why: "Zkus je spočítat postupně: nahoře, dole a po stranách." },
  ], [
    `Představ si ${nazev === "krychle" ? "hrací kostku" : nazev === "kvádr" ? "krabici od bot" : nazev.includes("jehlan") ? "jehlan jako pyramidu" : "hranol jako stan"}. Kolik ${co} vidíš nahoře, kolik dole a kolik po stranách?`,
    "Hrana je čára, kde se potkávají dvě stěny; stěna je plocha; vrchol je bod, kde se stýká víc hran. Počítej po částech — podstava, horní část, boky.",
  ], [`${nazev}: ${h} hran, ${s} stěn, ${v} vrcholů`]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return sada(30, aritmeticka);
  if (level === 2) { const t = [nasobici, stridava, rostouciKrok]; return sada(30, (i) => t[i % 3]()); }
  const t = [ruce, obleceni, kvadr, natrena, teleso];
  return sada(30, (i) => t[i % 5]());
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
