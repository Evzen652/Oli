import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { TROJICE, ciselnaUloha, fdec, pick, rnd, sada, shuffle, slovy, type Chyba } from "./_mat";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy byly pevný seznam bez nápověd
// a bez vysvětlení chybných možností. Teď generátor s typickými chybami:
// desetiny zapsané jako setiny, přehlédnutá nula za čárkou, „3,14 je víc než
// 3,5, protože 14 je víc než 5“.
// L1 čtení a zápis desetinného čísla · L2 největší a nejmenší ze čtyř čísel
// · L3 číslo mezi dvěma desetinnými čísly a seřazení čtyř čísel.

const celeSlovy = (c: number) => c === 0 ? "nula celá" : c === 1 ? "jedna celá" : c === 2 ? "dvě celé" : c < 5 ? `${slovy(c)} celé` : `${slovy(c)} celých`;
const castSlovy = (k: number, jedna: string, dve: string, pet: string) =>
  k === 1 ? `jedna ${jedna}` : k === 2 ? `dvě ${dve}` : k < 5 ? `${slovy(k)} ${dve}` : `${slovy(k)} ${pet}`;
const desetinySlovy = (d: number) => castSlovy(d, "desetina", "desetiny", "desetin");
const setinySlovy = (s: number) => castSlovy(s, "setina", "setiny", "setin");
/** Setiny, jejichž tvar je jistý (1–19 a čísla končící 0, 5–9). */
const CITELNE_SETINY = Array.from({ length: 99 }, (_, i) => i + 1).filter((s) => s < 20 || s % 10 === 0 || s % 10 >= 5);

interface Des { c: number; cast: number; mist: 1 | 2 }
const hodnota = (x: Des) => x.c + x.cast / (x.mist === 1 ? 10 : 100);
const txt = (x: Des) => `${x.c},${String(x.cast).padStart(x.mist, "0")}`;
const slovne = (x: Des) => `${celeSlovy(x.c)} ${x.mist === 1 ? desetinySlovy(x.cast) : setinySlovy(x.cast)}`;
const CELE = TROJICE.filter((g) => g < 60);

function nahodne(): Des {
  const c = Math.random() < 0.15 ? 0 : pick(CELE);
  return Math.random() < 0.5 ? { c, cast: rnd(1, 9), mist: 1 } : { c, cast: pick(CITELNE_SETINY), mist: 2 };
}

function zapis(x: Des): PracticeTask | null {
  const chyby: Chyba[] = x.mist === 1
    ? [
      { value: `${x.c},0${x.cast}`, why: `${desetinySlovy(x.cast)} je první místo za čárkou. ${x.c},0${x.cast} jsou setiny.` },
      { value: `${x.c}${x.cast}`, why: "Chybí desetinná čárka — z desetin se staly jednotky." },
      ...(x.c > 0 && x.c < 10 ? [{ value: `${x.cast},${x.c}`, why: "Celé a desetiny se prohodily. Celé se píšou před čárku." }] : []),
      { value: `${x.c + 1},${x.cast}`, why: `Celých je ${x.c}, ne ${x.c + 1}.` },
    ]
    : [
      { value: x.cast < 10 ? `${x.c},${x.cast}` : `${x.c},0${x.cast}`, why: x.cast < 10 ? `${setinySlovy(x.cast)} patří na druhé místo za čárkou, první místo (desetiny) je 0.` : `Setiny jsou dvě místa za čárkou; ${x.c},0${x.cast} by byly tisíciny.` },
      { value: x.cast < 10 ? `${x.c},00${x.cast}` : `${x.c}${String(x.cast).padStart(2, "0")}`, why: x.cast < 10 ? "To by byly tisíciny — setiny mají jen dvě místa za čárkou." : "Chybí desetinná čárka." },
      ...(x.cast >= 10 && x.cast % 10 !== 0 ? [{ value: `${x.c},${String(x.cast).split("").reverse().join("")}`, why: "Číslice za čárkou se prohodily." }] : []),
      { value: x.cast < 10 ? `${x.c + 1},0${x.cast}` : `${x.c},${x.cast}${x.cast % 10}`, why: x.cast < 10 ? `Celých je ${x.c}, ne ${x.c + 1}.` : "Za čárkou mají být jen dvě číslice — setiny." },
    ];
  return ciselnaUloha(`Zapiš číslem: ${slovne(x)}.`, txt(x), chyby, [
    `Kolik je celých a kolik ${x.mist === 1 ? "desetin" : "setin"} v zápisu „${slovne(x)}“?`,
    `Celé se píšou před čárku. Desetiny jsou první místo za čárkou, setiny druhé — když je setin méně než deset, první místo za čárkou je 0.`,
  ], [
    `Celé: ${x.c} — před čárku`,
    x.mist === 1 ? `Desetiny: ${x.cast} — první místo za čárkou` : `Setiny: ${x.cast} — ${x.cast < 10 ? "druhé místo, na prvním je 0" : "dvě místa za čárkou"}`,
    `Zápis: ${txt(x)}`,
  ]);
}

function cteni(x: Des): PracticeTask | null {
  const chyby: Chyba[] = [
    { value: `${celeSlovy(x.c)} ${x.mist === 1 ? setinySlovy(x.cast) : desetinySlovy(x.cast)}`, why: x.mist === 1 ? "Jedna číslice za čárkou znamená desetiny, ne setiny." : "Dvě místa za čárkou znamenají setiny, ne desetiny." },
    ...(x.c > 0 && x.c < 10 && x.cast < 20 ? [{ value: `${celeSlovy(x.cast)} ${x.mist === 1 ? desetinySlovy(x.c) : setinySlovy(x.c)}`, why: "Celé a část za čárkou se prohodily." }] : []),
    { value: `${celeSlovy(x.c)} ${x.mist === 1 ? desetinySlovy(x.cast === 9 ? 8 : x.cast + 1) : setinySlovy(pick(CITELNE_SETINY.filter((s) => s !== x.cast)))}`, why: "Počet za čárkou nesouhlasí se zápisem." },
    { value: `${celeSlovy(x.c === 0 ? 1 : x.c - 1)} ${x.mist === 1 ? desetinySlovy(x.cast) : setinySlovy(x.cast)}`, why: "Celá část nesouhlasí se zápisem." },
  ];
  return ciselnaUloha(`Jak přečteš číslo ${txt(x)}?`, slovne(x), chyby, [
    `Kolik míst je v čísle ${txt(x)} za čárkou? Podle toho poznáš, jestli čteš desetiny, nebo setiny.`,
    "Nejdřív přečti celou část a přidej slovo celá, celé nebo celých. Jedno místo za čárkou jsou desetiny, dvě místa setiny.",
  ], [
    `Před čárkou: ${x.c} → ${celeSlovy(x.c)}`,
    `Za čárkou ${x.mist === 1 ? "jedno místo → desetiny" : "dvě místa → setiny"}: ${slovne(x)}`,
  ]);
}

function nejvetsi(): PracticeTask | null {
  const c = rnd(1, 15), a = rnd(3, 8), b = rnd(1, 9);
  const key = `${c},${a}`;
  const ds = [
    { value: `${c},${a - 1}${b}`, why: `Má víc číslic za čárkou, ale desetin je jen ${a - 1}.` },
    { value: `${c},0${a + 1}`, why: `Za čárkou je nejdřív 0 — desetin je nula, ${a + 1} jsou setiny.` },
    { value: `${c - 1},9${b}`, why: `Má hodně desetin, ale celá část je jen ${c - 1}.` },
  ];
  const vse = [key, ...ds.map((d) => d.value)].sort();
  return ciselnaUloha(`Které z čísel ${vse.join("; ")} je největší?`, key, ds, [
    `Porovnej nejdřív celé části, potom desetiny a nakonec setiny. Začni čísly ${ds[0].value} a ${ds[1].value}.`,
    "Když mají čísla za čárkou různý počet míst, doplň na konec nuly, aby jich měla všechna dvě. Pak se setiny dají porovnat jako obyčejná čísla.",
  ], [
    `Doplníme nuly: ${vse.map((v) => (v.split(",")[1].length === 1 ? `${v}0` : v)).join("; ")}`,
    `Nejvíc je ${key}${key.split(",")[1].length === 1 ? ` (${key}0)` : ""}.`,
  ]);
}

function nejmensi(): PracticeTask | null {
  const c = rnd(1, 15), b = rnd(2, 8);
  const key = `${c},0${b}`;
  const ds = [
    { value: `${c},${b}`, why: `Tady je ${b} na místě desetin, takže je to ${c},${b}0 — víc než ${key}.` },
    { value: `${c},1`, why: `Jedna desetina je 10 setin, víc než ${b} setin.` },
    { value: `${c},0${b + 1}`, why: `${b + 1} setin je víc než ${b} setin.` },
  ];
  const vse = [key, ...ds.map((d) => d.value)].sort();
  return ciselnaUloha(`Které z čísel ${vse.join("; ")} je nejmenší?`, key, ds, [
    `Celá část je všude ${c}. Kolik desetin má ${ds[0].value} a kolik ${ds[1].value}?`,
    "Doplň na konec nuly, aby měla všechna čísla dvě místa za čárkou, a porovnej je podle desetin a setin. Kratší zápis neznamená menší číslo.",
  ], [
    `Doplníme nuly: ${vse.map((v) => (v.split(",")[1].length === 1 ? `${v}0` : v)).join("; ")}`,
    `Nejméně je ${key}.`,
  ]);
}

function mezi(): PracticeTask | null {
  const c = rnd(0, 12), a = rnd(1, 7), k = rnd(1, 9);
  if (k === a || k === a + 1) return null;
  const key = `${c},${a}${k}`;
  return ciselnaUloha(`Které číslo leží na číselné ose mezi ${c},${a} a ${c},${a + 1}?`, key, [
    { value: `${c},${a + 1}${k}`, why: `To je až za číslem ${c},${a + 1}.` },
    { value: `${c},0${k}`, why: `Desetin je 0, takže číslo leží ještě před ${c},${a}.` },
    { value: `${c},${k}${a}`, why: `Má ${k} desetin, proto neleží mezi ${c},${a} a ${c},${a + 1}.` },
  ], [
    `Zapiš si obě čísla na setiny: ${c},${a}0 a ${c},${a + 1}0. Které setiny leží mezi nimi — leží tam třeba ${c},0${k}?`,
    "Mezi dvěma sousedními desetinami je devět setin. Hledané číslo musí mít stejnou celou část i stejné desetiny jako první číslo a za nimi ještě setiny.",
  ], [
    `${c},${a} = ${c},${a}0 a ${c},${a + 1} = ${c},${a + 1}0`,
    `Mezi nimi leží ${c},${a}1 až ${c},${a}9, tedy i ${key}.`,
  ]);
}

function serad(): PracticeTask | null {
  const c = rnd(1, 9), a = rnd(3, 8), b = rnd(1, 9), d = rnd(1, 9);
  const cisla = [`${c},${a}`, `${c},${a - 1}${b}`, `${c},0${d}`, `${c + 1},0${b}`];
  if (new Set(cisla).size < 4) return null;
  const val = (s: string) => Number(s.replace(",", "."));
  const key = [...cisla].sort((x, y) => val(x) - val(y));
  const zaCarkou = (s: string) => Number(s.split(",")[1]);
  const podleCislic = [...cisla].sort((x, y) => Number(x.split(",")[0]) - Number(y.split(",")[0]) || zaCarkou(x) - zaCarkou(y));
  const opacne = [...key].reverse();
  const bezCelych = [...cisla].sort((x, y) => val(x) % 1 - val(y) % 1);
  const J = (xs: string[]) => xs.join("; ");
  const zamichane = [key[2], key[3], key[0], key[1]];
  return ciselnaUloha(`Seřaď od nejmenšího: ${J(zamichane)}.`, J(key), [
    { value: J(podleCislic), why: "Část za čárkou se porovnala jako celé číslo. Desetiny se ale porovnávají s desetinami: doplň nuly na dvě místa." },
    { value: J(opacne), why: "To je pořadí od největšího." },
    { value: J(bezCelych), why: "Porovnávala se jen část za čárkou; nejdřív ale rozhoduje celá část." },
  ], [
    `Které číslo má celou část ${c + 1}? To patří na konec. Pak porovnej ${c},${a}0, ${c},${a - 1}${b} a ${c},0${d}.`,
    "Pořadí určuje nejdřív celá část, potom desetiny a potom setiny. Když doplníš nuly, aby měla všechna čísla dvě místa za čárkou, porovnáváš jako obyčejná čísla.",
  ], [
    `Doplníme nuly: ${cisla.map((v) => (v.split(",")[1].length === 1 ? `${v}0` : v)).join("; ")}`,
    `Od nejmenšího: ${J(key)}`,
  ]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return sada(30, (i) => (i % 2 ? cteni(nahodne()) : zapis(nahodne())));
  if (level === 2) return sada(30, (i) => (i % 2 ? nejmensi() : nejvetsi()));
  return sada(30, (i) => (i % 2 ? serad() : mezi()));
}

void fdec;

export const DESETINNACISLACTENIZAPISPOROVNAVANI: TopicMetadata[] = [
  {
    id: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-desetinna-cisla-cteni-zapis-porovnavani",
    rvpNodeId: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-desetinna-cisla-cteni-zapis-porovnavani",
    title: "Desetinná čísla - čtení, zápis, porovnávání",
    studentTitle: "Desetinná čísla",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Velká čísla a desetinná čísla",
    briefDescription: "Naučíš se číst, zapisovat a porovnávat desetinná čísla.",
    keywords: ["desetinná čísla", "desetinná čárka", "porovnávání", "čtení čísel", "zápis čísel"],
    goals: [
      "Přečíst desetinné číslo správně česky",
      "Zapsat desetinné číslo podle slovního popisu",
      "Porovnat dvě desetinná čísla a určit větší/menší",
      "Seřadit desetinná čísla od nejmenšího po největší",
    ],
    boundaries: ["Nepočítat s desetinnými čísly, jen číst a porovnávat", "Bez vědeckého zápisu"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Číslo 3,14 čteme po celku a zlomku: 'tři celé čtrnáct'. Při porovnávání se nejprve díváme na celou část, pak na desetiny, pak na setiny.",
      steps: [
        "Podívej se na celou část (před čárkou).",
        "Porovnej celé části — větší celá část znamená větší číslo.",
        "Pokud jsou celé části stejné, porovnej desetiny (první číslice za čárkou).",
        "Pokud jsou desetiny stejné, porovnej setiny.",
      ],
      commonMistake: "Chyba: 3,14 > 3,5, protože 14 > 5. Správně: 3,5 > 3,14, protože 5 desetin > 1 desetina.",
      example: "Porovnej 2,3 a 2,15: celé části jsou stejné (2). Desetiny: 3 > 1, takže 2,3 > 2,15.",
    },
  },
];
