/**
 * Matematika 6. ročník — Trojúhelníky: druhy, vnitřní úhly, výška, těžnice.
 *
 * Stavba podle výpočetního vzoru `../fyzika/mereniDelky.ts`, helpery jen
 * z `./_shared.ts`. Téma emituje výhradně select_one se čtyřmi možnostmi.
 * Obrázek se nepoužívá — úhly i strany žák vyčte ze slovního zadání.
 *
 *  • L1 — rozpoznání: druh podle tří zadaných úhlů, druh podle tří délek
 *    stran (včetně trojice, ze které trojúhelník sestrojit nejde), pojem
 *    z banky definic (výška / těžnice / osa strany / střední příčka).
 *  • L2 — jeden výpočetní krok s pravidlem 180°: třetí úhel ze dvou úhlů
 *    se stupni a minutami, druhý ostrý úhel pravoúhlého trojúhelníku, úhel
 *    při základně / při hlavním vrcholu rovnoramenného trojúhelníku.
 *  • L3 — dva kroky nebo inverze: úplný popis podle úhlů i stran, úhly
 *    v „dílcích“ (tolikrát větší), pravdivý výrok o zbylých úhlech, poloha
 *    průsečíku přímek, na kterých leží výšky.
 *
 * Všechny úhly se počítají v MINUTÁCH (`uhel()` bere minuty). Distraktor
 * „minuty po stovkách“ se počítá v setinách stupně a do nabídky se dostane
 * jen tehdy, když dává platný úhel (minut méně než 60) a liší se od klíče —
 * tedy právě u úloh s přenosem přes 60′, s půjčkou nebo s polovinou stupně.
 *
 * Šablony se střídají podle počítadla (ne náhodou), aby žádná nepřevážila.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad, plural } from "@/lib/czechGrammar";
import { cis, uhel, rnd, pick, shuffle, doplnVelkou, buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

// ── Pomocné výpočty ─────────────────────────────────────────────────────────
const PLNY = 180 * 60; // 10 800′
const PRAVY = 90 * 60;

/** Úhel ve stupních (celých) → minuty. */
const st = (deg: number): number => deg * 60;
/** „180 stupňů“ — v nápovědách slovy, aby „180°“ neobsahovalo klíč „80°“. */
const stupnu = (n: number): string => `${cis(n)} ${plural(n, "stupeň", "stupně", "stupňů")}`;
/** Nenormalizovaný zápis mezikroku: 115° 75′. */
const surovy = (deg: number, min: number): string => (min === 0 ? `${cis(deg)}°` : `${cis(deg)}° ${cis(min)}′`);

/** Minuty → „setiny“ (chybný model 1° = 100′). */
const naSetiny = (m: number): number => Math.floor(m / 60) * 100 + (m % 60);
/** Setiny → minuty; null, když výsledek není platný úhel. */
function zeSetin(s: number): number | null {
  if (!Number.isInteger(s) || s <= 0 || s % 100 >= 60) return null;
  return Math.floor(s / 100) * 60 + (s % 100);
}

type DruhU = "ostroúhlý" | "pravoúhlý" | "tupoúhlý";
type DruhS = "různostranný" | "rovnoramenný" | "rovnostranný";

function druhPodleShody(xs: number[]): DruhS {
  const r = new Set(xs).size;
  return r === 1 ? "rovnostranný" : r === 2 ? "rovnoramenný" : "různostranný";
}

/** Sčítání úhlů s mezikrokem převodu minut: „47° 30′ + 68° 45′ = 115° 75′ = 116° 15′“. */
function zapisSouctu(uhly: number[]): string {
  const deg = uhly.reduce((a, u) => a + Math.floor(u / 60), 0);
  const min = uhly.reduce((a, u) => a + (u % 60), 0);
  const soucet = uhly.reduce((a, b) => a + b, 0);
  const lev = `${uhly.map(uhel).join(" + ")} = ${surovy(deg, min)}`;
  return min >= 60 ? `${lev} = ${uhel(soucet)} (60′ = 1°)` : lev;
}

/** Odčítání s mezikrokem půjčky: „180° − 116° 15′ = 179° 60′ − 116° 15′ = 63° 45′“. */
function zapisRozdilu(od: number, co: number): string {
  const vysl = uhel(od - co);
  if (od % 60 < co % 60) {
    const pujcka = surovy(Math.floor(od / 60) - 1, (od % 60) + 60);
    return `${uhel(od)} − ${uhel(co)} = ${pujcka} − ${uhel(co)} = ${vysl} (půjčili jsme si 1° = 60′)`;
  }
  return `${uhel(od)} − ${uhel(co)} = ${vysl}`;
}

// ── Sestavení úlohy ────────────────────────────────────────────────────────
const STRATEGIE_POJMY = [
  "Každý pojem si představ nakreslený a porovnej ho s popisem v otázce.",
  "Zkontroluj, na co přesně se otázka ptá, než vybereš odpověď.",
];
const STRATEGIE_STRANY = [
  "Nakonec zkontroluj, jestli tvoje odpověď sedí se všemi třemi délkami.",
  "Zkontroluj, na co přesně se otázka ptá, než vybereš odpověď.",
];
const STRATEGIE = [
  "Nakonec zkontroluj, že všechny tři úhly mají dohromady 180 stupňů.",
  "Zkontroluj, na co přesně se otázka ptá, než vybereš odpověď.",
  "Porovnej výsledek s odhadem: dává taková velikost smysl?",
];

interface Casti {
  hints: [string, string];
  solutionSteps: string[];
  explanation: string;
}

/**
 * select_one úloha. Malá nápověda = první krok + údaje ze zadání (konkrétní
 * pro úlohu), velká = zbytek postupu. Úloha, jejíž zadání nebo nápověda by
 * obsahovaly klíč, se zahodí a losuje se znovu.
 */
function uloha(question: string, correct: string, dis: Distractor[], c: Casti, udaje: string[], strategie: string[] = STRATEGIE): PracticeTask | null {
  const t = buildChoiceTask(question, correct, dis, c);
  if (!t) return null;
  const h0 = udaje.length ? `${c.hints[0]} Údaje ze zadání: ${udaje.join("; ")}.` : c.hints[0];
  const h1 = doplnVelkou(h0, c.hints[1], strategie);
  t.hints = [h0, h1];
  if (question.includes(correct) || t.hints.some((h) => h.includes(correct))) return null;
  return t;
}

/** Úhel ve formě možnosti a důvodu. */
const d = (minut: number, why: string): Distractor => ({ value: uhel(minut), why });

/** Zvolí náhodně jednu hodnotu minut z nabídky. */
const minuty = (xs: number[]): number => pick(xs);

// ── L1: rozpoznání ─────────────────────────────────────────────────────────
const NEEXISTUJE = "takový neexistuje";
const NELZE = "nelze sestrojit";

function genL1Uhly(druh: DruhU): PracticeTask | null {
  let u: number[];
  if (druh === "ostroúhlý") {
    const a = rnd(25, 85), b = rnd(25, 85), c = 180 - a - b;
    if (c < 10 || c >= 90) return null;
    u = [a, b, c];
  } else if (druh === "pravoúhlý") {
    const a = rnd(10, 80);
    u = [a, 90 - a, 90];
  } else {
    const c = rnd(95, 160);
    const a = rnd(5, 180 - c - 5);
    u = [a, 180 - c - a, c];
  }
  const uhly = shuffle(u.map(st));
  const max = Math.max(...uhly);
  const zn = `${uhel(uhly[0])}, ${uhel(uhly[1])} a ${uhel(uhly[2])}`;
  const why: Record<string, string> = {
    ostroúhlý: druh === "pravoúhlý"
      ? `Ostroúhlý trojúhelník má všechny tři úhly ostré. Úhel 90° ale ostrý není, je pravý.`
      : `Dva úhly jsou sice ostré, ale o druhu rozhoduje největší úhel. Úhel ${uhel(max)} je větší než 90°, tedy tupý.`,
    pravoúhlý: `Pravoúhlý trojúhelník má jeden úhel přesně 90°. Tady žádný úhel 90° nemá, největší měří ${uhel(max)}.`,
    tupoúhlý: druh === "pravoúhlý"
      ? `Úhel 90° je pravý, ne tupý. Tupý úhel je větší než 90°.`
      : `Tupoúhlý trojúhelník má jeden úhel větší než 90°. Největší úhel tady měří ${uhel(max)}, a to je méně než 90°.`,
    [NEEXISTUJE]: `Úhly ${zn} mají dohromady 180°, takže takový trojúhelník existuje.`,
  };
  const dis = (["ostroúhlý", "pravoúhlý", "tupoúhlý", NEEXISTUJE] as string[])
    .filter((x) => x !== druh)
    .map((x) => ({ value: x, why: why[x] }));
  const popis = druh === "ostroúhlý" ? "menší než 90°, všechny úhly jsou ostré" : druh === "pravoúhlý" ? "přesně 90°, je to pravý úhel" : "větší než 90°, je to tupý úhel";
  return uloha(
    `Trojúhelník má úhly ${zn}. Jaký je to trojúhelník podle velikosti úhlů?`,
    druh,
    dis,
    {
      hints: [
        "Najdi mezi zadanými úhly ten největší.",
        "Podle největšího úhlu se rozhoduje: je menší než pravý úhel, přesně pravý, nebo větší než pravý úhel?",
      ],
      solutionSteps: [
        `Kontrola: ${zapisSouctu(uhly)} ✓`,
        `Největší úhel: ${uhel(max)}`,
        `${uhel(max)} je ${popis} → ${druh} trojúhelník`,
      ],
      explanation: `Druh trojúhelníku podle úhlů určuje jeho největší úhel. Největší úhel měří ${uhel(max)}, to je ${popis}. Proto je trojúhelník ${druh}.`,
    },
    [zn],
  );
}

type TypStran = "rovnoramenný" | "různostranný" | "nelze";

function genL1Strany(typ: TypStran): PracticeTask | null {
  let s: number[];
  if (typ === "rovnoramenný") {
    const a = rnd(3, 12), c = rnd(2, 2 * a - 1);
    if (c === a) return null;
    s = [a, a, c];
  } else if (typ === "různostranný") {
    const x = [rnd(3, 15), rnd(3, 15), rnd(3, 15)].sort((p, q) => p - q);
    if (new Set(x).size < 3 || x[0] + x[1] <= x[2]) return null;
    s = x;
  } else {
    const a = rnd(2, 6), b = rnd(a, 7);
    s = [a, b, a + b + rnd(0, 4)];
  }
  const strany = shuffle(s);
  const [k1, k2, nej] = [...s].sort((p, q) => p - q);
  const zn = `${cis(strany[0])} cm, ${cis(strany[1])} cm a ${cis(strany[2])} cm`;
  const lze = k1 + k2 > nej;
  const druh = druhPodleShody(s);
  const correct = lze ? druh : NELZE;
  const nerovnost = `${cis(k1)} cm + ${cis(k2)} cm = ${cis(k1 + k2)} cm`;
  const nelzeText = `Nejdřív ověř, jestli trojúhelník vůbec jde sestrojit: ${nerovnost}, a to není víc než nejdelší strana ${cis(nej)} cm. Takový trojúhelník nelze sestrojit, a tak nemá smysl určovat jeho druh.`;
  const shodna = s.find((x, i) => s.indexOf(x) !== i);
  const jina = s.find((x) => x !== shodna);
  const why: Record<string, string> = lze
    ? {
      různostranný: `Různostranný trojúhelník nemá žádné dvě strany stejně dlouhé. Tady mají dvě strany shodně ${cis(shodna ?? 0)} cm.`,
      rovnoramenný: `Rovnoramenný trojúhelník má dvě strany stejně dlouhé. Tady má každá strana jinou délku.`,
      rovnostranný: druh === "rovnoramenný"
        ? `Rovnostranný trojúhelník má všechny tři strany stejné. Tady jsou shodné jen dvě, třetí měří ${cis(jina ?? 0)} cm.`
        : `Rovnostranný trojúhelník má všechny tři strany stejné. Tady má každá strana jinou délku.`,
      [NELZE]: `Součet dvou kratších stran ${nerovnost} je větší než nejdelší strana ${cis(nej)} cm, takže trojúhelník sestrojit lze.`,
    }
    : { různostranný: nelzeText, rovnoramenný: nelzeText, rovnostranný: nelzeText };
  const dis = (["různostranný", "rovnoramenný", "rovnostranný", NELZE] as string[])
    .filter((x) => x !== correct)
    .map((x) => ({ value: x, why: why[x] }));
  const krok2 = lze
    ? druh === "rovnoramenný"
      ? `Shodné jsou dvě strany (${cis(shodna ?? 0)} cm), třetí je jiná → ${druh}`
      : `Žádné dvě strany nejsou shodné → ${druh}`
    : `Trojúhelník nelze sestrojit, druh se neurčuje.`;
  return uloha(
    `Trojúhelník má mít strany ${zn}. Jaký to bude trojúhelník podle délek stran?`,
    correct,
    dis,
    {
      hints: [
        "Nejdřív ověř, že součet dvou kratších stran je větší než nejdelší strana.",
        "Pak porovnej délky stran a spočítej, kolik z nich je shodných: žádná, dvě, nebo všechny tři.",
      ],
      solutionSteps: [
        `Trojúhelníková nerovnost: ${nerovnost} ${lze ? ">" : "≤"} ${cis(nej)} cm → ${lze ? "trojúhelník lze sestrojit" : "trojúhelník nelze sestrojit"}`,
        krok2,
      ],
      explanation: lze
        ? `Součet dvou kratších stran je větší než nejdelší strana, takže trojúhelník existuje. ${druh === "rovnoramenný" ? "Dvě jeho strany jsou stejně dlouhé, proto je rovnoramenný." : "Každá jeho strana má jinou délku, proto je různostranný."}`
        : `Trojúhelník jde sestrojit jen tehdy, když je součet dvou kratších stran větší než nejdelší strana. Tady ${nerovnost} a nejdelší strana měří ${cis(nej)} cm, takže takový trojúhelník nelze sestrojit.`,
    },
    [zn],
    STRATEGIE_STRANY,
  );
}

type Pojem = "výška" | "těžnice" | "osa strany" | "střední příčka";

interface Definice {
  q: string;
  klic: Pojem;
  hints: [string, string];
}

const DEFINICE: Definice[] = [
  {
    q: "Jak se nazývá úsečka, která spojuje vrchol trojúhelníku se středem protější strany?",
    klic: "těžnice",
    hints: ["Všimni si, odkud úsečka vychází a kde přesně končí.", "Úsečka začíná ve vrcholu a končí uprostřed protější strany. O pravém úhlu se v popisu nemluví — vyber pojem, který spojuje vrchol se středem."],
  },
  {
    q: "Jak se nazývá úsečka, která vede z vrcholu trojúhelníku kolmo k přímce, na které leží protější strana?",
    klic: "výška",
    hints: ["Všimni si slova „kolmo“ a toho, odkud úsečka vychází.", "Úsečka vychází z vrcholu a s protější stranou svírá pravý úhel. Střed strany v popisu není — vyber pojem, u kterého rozhoduje kolmost."],
  },
  {
    q: "Jak se nazývá přímka, která prochází středem strany trojúhelníku a je k této straně kolmá?",
    klic: "osa strany",
    hints: ["Všimni si, že přímka nevychází z vrcholu.", "Přímka prochází středem strany a je k ní kolmá. Vrchol v popisu vůbec není — vyber pojem, který patří jedné straně, ne vrcholu."],
  },
  {
    q: "Jak se nazývá úsečka, která spojuje středy dvou stran trojúhelníku?",
    klic: "střední příčka",
    hints: ["Všimni si, že úsečka nezačíná ani nekončí ve vrcholu.", "Oba krajní body úsečky leží ve středech stran. Který pojem spojuje dva středy stran, a ne vrchol se stranou?"],
  },
  {
    q: "Jak se nazývá vzdálenost vrcholu trojúhelníku od přímky, na které leží protější strana?",
    klic: "výška",
    hints: ["Vzdálenost bodu od přímky se měří po kolmici.", "Z vrcholu vedeš kolmici k přímce protější strany a měříš její délku. Vyber pojem, u kterého rozhoduje kolmost a vychází z vrcholu."],
  },
  {
    q: "Jak se nazývá úsečka z vrcholu trojúhelníku, která končí přesně uprostřed protější strany?",
    klic: "těžnice",
    hints: ["Všimni si, kde úsečka končí: uprostřed strany.", "Úsečka vychází z vrcholu a dělí protější stranu na dvě stejně dlouhé části. O kolmosti se v popisu nemluví."],
  },
  {
    q: "Jak se nazývá úsečka, která je rovnoběžná s jednou stranou trojúhelníku a spojuje středy zbylých dvou stran?",
    klic: "střední příčka",
    hints: ["Všimni si, že oba konce úsečky leží ve středech stran.", "Úsečka nevychází z vrcholu a není kolmá, je rovnoběžná se třetí stranou. Vyber pojem, který spojuje středy dvou stran."],
  },
  {
    q: "Jak se nazývá přímka, jejíž každý bod je stejně daleko od obou krajních bodů strany trojúhelníku?",
    klic: "osa strany",
    hints: ["Body stejně daleko od dvou bodů leží na kolmici vedené středem jejich spojnice.", "Taková přímka prochází středem strany a je k ní kolmá, vrcholem obvykle neprochází. Vyber pojem, který k tomu patří."],
  },
  {
    q: "Jak se nazývá úsečka z vrcholu trojúhelníku, která svírá s přímkou protější strany pravý úhel?",
    klic: "výška",
    hints: ["Všimni si pravého úhlu a toho, odkud úsečka vychází.", "Úsečka vychází z vrcholu a je kolmá k přímce protější strany. Do středu strany mířit nemusí."],
  },
];

const POJEM_WHY: Record<Pojem, Record<Pojem, string>> = {
  výška: {
    výška: "",
    těžnice: "Těžnice vede z vrcholu do středu protější strany, ale kolmá k ní obvykle není. Tady rozhoduje pravý úhel.",
    "osa strany": "Osa strany je sice kolmá ke straně, ale prochází jejím středem a z vrcholu nevychází.",
    "střední příčka": "Střední příčka spojuje středy dvou stran, z vrcholu nevychází a ke straně kolmá není.",
  },
  těžnice: {
    výška: "Výška vede z vrcholu kolmo k protější straně, ale do jejího středu obvykle nemíří.",
    těžnice: "",
    "osa strany": "Osa strany prochází středem strany, ale je to kolmice ke straně a vrcholem obvykle neprochází.",
    "střední příčka": "Střední příčka spojuje středy dvou stran, ne vrchol se středem strany.",
  },
  "osa strany": {
    výška: "Výška je také kolmá, ale vychází z vrcholu a středem strany obvykle neprochází.",
    těžnice: "Těžnice sice končí ve středu strany, ale vychází z vrcholu a ke straně obvykle kolmá není.",
    "osa strany": "",
    "střední příčka": "Střední příčka spojuje středy dvou stran. Tady jde o přímku, která prochází středem jediné strany.",
  },
  "střední příčka": {
    výška: "Výška vychází z vrcholu a je kolmá k protější straně, středy dvou stran nespojuje.",
    těžnice: "Těžnice spojuje střed strany s vrcholem, ne se středem jiné strany.",
    "osa strany": "Osa strany je přímka kolmá ke straně, středy dvou stran nespojuje.",
    "střední příčka": "",
  },
};

const POJEM_POPIS: Record<Pojem, string> = {
  výška: "Výška je kolmice vedená z vrcholu na přímku, na které leží protější strana.",
  těžnice: "Těžnice je úsečka, která spojuje vrchol se středem protější strany.",
  "osa strany": "Osa strany je přímka, která prochází středem strany a je k ní kolmá.",
  "střední příčka": "Střední příčka je úsečka, která spojuje středy dvou stran.",
};

let iDef = 0;
function genL1Pojem(): PracticeTask | null {
  const def = DEFINICE[iDef++ % DEFINICE.length];
  const dis = (["výška", "těžnice", "osa strany", "střední příčka"] as Pojem[])
    .filter((p) => p !== def.klic)
    .map((p) => ({ value: p, why: POJEM_WHY[def.klic][p] }));
  return uloha(
    def.q,
    def.klic,
    dis,
    {
      hints: def.hints,
      solutionSteps: [
        "Odkud útvar vychází: z vrcholu, nebo ze středu strany?",
        "Rozhoduje pravý úhel, nebo střed strany?",
        `${POJEM_POPIS[def.klic]} → ${def.klic}`,
      ],
      explanation: `${POJEM_POPIS[def.klic]} Popis v otázce odpovídá přesně tomuto pojmu.`,
    },
    [],
    STRATEGIE_POJMY,
  );
}

let i1 = 0;
let i1u = 0;
let i1s = 0;
function genL1(): PracticeTask | null {
  const k = i1++ % 3;
  if (k === 0) return genL1Uhly((["ostroúhlý", "pravoúhlý", "tupoúhlý"] as DruhU[])[i1u++ % 3]);
  if (k === 1) return genL1Strany((["rovnoramenný", "různostranný", "nelze"] as TypStran[])[i1s++ % 3]);
  return genL1Pojem();
}

// ── L2: jeden výpočetní krok ───────────────────────────────────────────────
type Kontext = "abc" | "strecha" | "zahon" | "regal" | "satek";

const TEXT_OBECNY: Record<Exclude<Kontext, "strecha">, (a: string, b: string) => string> = {
  abc: (a, b) => `V trojúhelníku ABC měří úhel α ${a} a úhel β ${b}. Jak velký je úhel γ?`,
  zahon: (a, b) => `Záhon má tvar trojúhelníku. Dva jeho vnitřní úhly měří ${a} a ${b}. Jak velký je jeho třetí vnitřní úhel?`,
  regal: (a, b) => `Výztuha regálu má tvar trojúhelníku s vnitřními úhly ${a} a ${b}. Jak velký je její třetí vnitřní úhel?`,
  satek: (a, b) => `Šátek má tvar trojúhelníku. Dva jeho vnitřní úhly měří ${a} a ${b}. Jak velký je třetí úhel šátku?`,
};

const TEXT_PRAVY: Record<Exclude<Kontext, "strecha">, (a: string) => string> = {
  abc: (a) => `V pravoúhlém trojúhelníku ABC s pravým úhlem u vrcholu C měří úhel α ${a}. Jak velký je úhel β?`,
  zahon: (a) => `Záhon má tvar pravoúhlého trojúhelníku. Jeden jeho ostrý úhel měří ${a}. Jak velký je druhý ostrý úhel?`,
  regal: (a) => `Výztuha regálu má tvar pravoúhlého trojúhelníku. Jeden její ostrý úhel měří ${a}. Jak velký je druhý ostrý úhel?`,
  satek: (a) => `Šátek má tvar pravoúhlého trojúhelníku a jeden jeho ostrý úhel měří ${a}. Jak velký je druhý ostrý úhel?`,
};

const TEXT_VRCHOL: Record<Exclude<Kontext, "regal">, (v: string) => string> = {
  abc: (v) => `V rovnoramenném trojúhelníku ABC se základnou AB měří úhel při hlavním vrcholu C ${v}. Jak velký je úhel při základně?`,
  strecha: (v) => `Štít střechy má tvar rovnoramenného trojúhelníku. Úhel při hlavním vrcholu u hřebene měří ${v}. Jak velký je úhel při základně?`,
  zahon: (v) => `Záhon má tvar rovnoramenného trojúhelníku s úhlem ${v} při hlavním vrcholu. Jak velký je úhel při základně?`,
  satek: (v) => `Šátek má tvar rovnoramenného trojúhelníku, jeho úhel při hlavním vrcholu měří ${v}. Jak velký je každý z úhlů při základně?`,
};

const TEXT_ZAKLADNA: Record<Exclude<Kontext, "regal">, (z: string) => string> = {
  abc: (z) => `V rovnoramenném trojúhelníku ABC se základnou AB měří úhel při vrcholu A ${z}. Jak velký je úhel při hlavním vrcholu C?`,
  strecha: (z) => `Štít střechy má tvar rovnoramenného trojúhelníku. Úhel při základně u okapu měří ${z}. Jak velký je úhel při hlavním vrcholu u hřebene?`,
  zahon: (z) => `Záhon má tvar rovnoramenného trojúhelníku a úhel při jeho základně měří ${z}. Jak velký je úhel při hlavním vrcholu?`,
  satek: (z) => `Šátek má tvar rovnoramenného trojúhelníku. Každý z úhlů při základně měří ${z}. Jak velký je úhel při hlavním vrcholu?`,
};

const pujcka = "Při odčítání si půjčuješ 1° = 60′, ne 100′.";
const ZAPOMENUTA_PUJCKA = "Při odčítání sis půjčil 1° = 60′, ale ve stupních jsi ten 1° pak neubral.";

function genL2Obecny(k: Exclude<Kontext, "strecha">): PracticeTask | null {
  const a = st(rnd(25, 95)) + minuty([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  const b = st(rnd(20, 70)) + minuty([10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  const sum = a + b;
  if (sum >= PLNY - 5 * 60) return null;
  const key = PLNY - sum;
  const mSum = (a % 60) + (b % 60);
  const prenos = mSum >= 60;
  const hund = zeSetin(18000 - naSetiny(a) - naSetiny(b));
  const dis: Distractor[] = [];
  if (sum % 60 !== 0) dis.push(d(key + 60, ZAPOMENUTA_PUJCKA));
  if (hund !== null && hund !== key) {
    dis.push(d(hund, prenos
      ? `S minutami jsi počítal jako se setinami. 1° má jen 60′, takže ${mSum}′ = 1° ${mSum - 60}′. ${pujcka}`
      : `S minutami jsi počítal jako se setinami. ${pujcka}`));
  }
  dis.push(
    d(PLNY - a, `Od 180° jsi odečetl jen jeden z úhlů. Odečíst je potřeba oba zadané úhly.`),
    d(sum, `To je jen součet obou zadaných úhlů. Ten je potřeba ještě odečíst od 180°.`),
    d(PLNY - b, `Od 180° jsi odečetl jen jeden z úhlů. Odečíst je potřeba oba zadané úhly.`),
  );
  const zn = [uhel(a), uhel(b)];
  return uloha(
    TEXT_OBECNY[k](zn[0], zn[1]),
    uhel(key),
    dis,
    {
      hints: [
        "Nejdřív sečti oba zadané úhly, stupně zvlášť a minuty zvlášť.",
        `Je-li minut 60 nebo víc, převeď ${pad(60, "MINUTA")} na ${stupnu(1)}. Součet pak odečti od ${stupnu(180)}, protože vnitřní úhly trojúhelníku mají dohromady právě tolik. Při odčítání si podle potřeby půjč ${stupnu(1)}, tedy ${pad(60, "MINUTA")}.`,
      ],
      solutionSteps: [
        `Součet zadaných úhlů: ${zapisSouctu([a, b])}`,
        `Třetí úhel: ${zapisRozdilu(PLNY, sum)}`,
        `Zkouška: ${uhel(a)} + ${uhel(b)} + ${uhel(key)} = 180° ✓`,
      ],
      explanation: `Vnitřní úhly trojúhelníku mají dohromady 180°. Zadané úhly dávají ${uhel(sum)}, na třetí úhel proto zbývá 180° − ${uhel(sum)} = ${uhel(key)}.${prenos ? ` Při sčítání bylo minut ${mSum}, tedy víc než 60, a 60′ se převedlo na 1°.` : ""}`,
    },
    zn,
  );
}

function genL2Pravy(k: Exclude<Kontext, "strecha">): PracticeTask | null {
  const a = st(rnd(15, 74)) + minuty([0, 0, 20, 30, 45, 50, 55]);
  if (a === st(45)) return null;
  const key = PRAVY - a;
  const hund = zeSetin(9000 - naSetiny(a));
  const dis: Distractor[] = [];
  if (hund !== null && hund !== key) dis.push(d(hund, `S minutami jsi počítal jako se setinami. ${pujcka}`));
  if (a % 60 !== 0) {
    dis.push(d(key + 60, ZAPOMENUTA_PUJCKA));
  } else {
    const o10 = key + 600 < PRAVY && key + 600 !== a ? key + 600 : key - 600;
    dis.push(d(o10, `Při odčítání přes desítku ses spletl o 10°. Ověř to zkouškou: 90° + ${uhel(a)} + výsledek musí dát 180°.`));
  }
  dis.push(
    d(PLNY - a, `Od 180° jsi odečetl jen zadaný ostrý úhel. Pravý úhel 90° je také vnitřní úhel trojúhelníku a musíš ho odečíst taky.`),
    d(a, `Oba ostré úhly jsou stejné jen v rovnoramenném pravoúhlém trojúhelníku, kde měří 45°. Tady je zadaný úhel jiný.`),
  );
  const zn = uhel(a);
  return uloha(
    TEXT_PRAVY[k](zn),
    uhel(key),
    dis,
    {
      hints: [
        `Pravý úhel má ${stupnu(90)} a vnitřní úhly trojúhelníku mají dohromady ${stupnu(180)}.`,
        `Na oba ostré úhly tedy dohromady zbývá ${stupnu(90)}. Zadaný ostrý úhel od toho odečti; když je potřeba, půjč si ${stupnu(1)}, tedy ${pad(60, "MINUTA")}.`,
      ],
      solutionSteps: [
        `Oba ostré úhly mají dohromady 180° − 90° = 90°`,
        `Druhý ostrý úhel: ${zapisRozdilu(PRAVY, a)}`,
        `Zkouška: 90° + ${zn} + ${uhel(key)} = 180° ✓`,
      ],
      explanation: `V pravoúhlém trojúhelníku zabírá pravý úhel 90° ze 180°, takže oba ostré úhly mají dohromady 90°. Druhý ostrý úhel proto měří 90° − ${zn} = ${uhel(key)}.`,
    },
    [zn],
  );
}

function genL2Vrchol(k: Exclude<Kontext, "regal">): PracticeTask | null {
  const v = st(rnd(20, 160));
  if (v === st(60)) return null;
  const key = (PLNY - v) / 2;
  const pul = key % 60 !== 0;
  const dis: Distractor[] = [];
  const hund = zeSetin((18000 - naSetiny(v)) / 2);
  if (hund !== null && hund !== key) {
    dis.push(d(hund, `Polovina stupně je 30′, ne 50′. Jeden stupeň má 60′, ne 100′.`));
  }
  dis.push(d(PLNY - v, `Od 180° jsi úhel při hlavním vrcholu správně odečetl, ale zbytek připadá na DVA stejné úhly při základně. Je potřeba ho ještě rozdělit na polovinu.`));
  if (v < PRAVY) {
    dis.push(d(PLNY - 2 * v, `Zaměnil jsi role úhlů: zadaný úhel ${uhel(v)} je jen jeden, ten při hlavním vrcholu. Dva stejné úhly jsou při základně.`));
  }
  dis.push(
    d((PLNY - v) / 3, `Zbytek po odečtení úhlu při hlavním vrcholu připadá jen na dva úhly při základně, ne na tři. Vyděl ho dvěma.`),
    d(v, `Stejné jsou jen úhly při základně. Všechny tři úhly jsou stejné jen v rovnostranném trojúhelníku, kde měří 60°.`),
  );
  const zn = uhel(v);
  return uloha(
    TEXT_VRCHOL[k](zn),
    uhel(key),
    dis,
    {
      hints: [
        "V rovnoramenném trojúhelníku jsou oba úhly při základně stejně velké.",
        `Od ${stupnu(180)} odečti úhel při hlavním vrcholu. Zbytek připadá na dva stejné úhly při základně, proto ho vyděl dvěma; polovina stupně je ${pad(30, "MINUTA")}.`,
      ],
      solutionSteps: [
        `Na oba úhly při základně zbývá 180° − ${zn} = ${uhel(PLNY - v)}`,
        pul
          ? `Jeden úhel při základně: ${uhel(PLNY - v)} : 2 = ${uhel(key)} (polovina z 1° je 30′)`
          : `Jeden úhel při základně: ${uhel(PLNY - v)} : 2 = ${uhel(key)}`,
        `Zkouška: ${zn} + ${uhel(key)} + ${uhel(key)} = 180° ✓`,
      ],
      explanation: `Úhly při základně rovnoramenného trojúhelníku jsou shodné. Po odečtení úhlu při hlavním vrcholu zbývá ${uhel(PLNY - v)} a ten se rozdělí rovným dílem na dva úhly, každý tedy měří ${uhel(key)}.`,
    },
    [zn],
  );
}

function genL2Zakladna(k: Exclude<Kontext, "regal">): PracticeTask | null {
  const z = st(rnd(15, 85)) + minuty([0, 0, 30]);
  if (z === st(60)) return null;
  const key = PLNY - 2 * z;
  const dis: Distractor[] = [];
  const hund = zeSetin(18000 - 2 * naSetiny(z));
  if (hund !== null && hund !== key) {
    dis.push(d(hund, `Dvakrát 30′ je 60′, a to je celý 1°. S minutami nepočítej jako se setinami. ${pujcka}`));
  }
  dis.push(
    d((PLNY - z) / 2, `Zaměnil jsi role úhlů: zadaný úhel ${uhel(z)} leží při základně a takové jsou dva. Při hlavním vrcholu je jen jeden úhel, takže se nic nedělí dvěma.`),
    d(PLNY - z, `Odečetl jsi úhel při základně jen jednou. Úhly při základně jsou ale dva stejné, odečíst je potřeba oba.`),
    d(z, `Stejně velké jsou jen dva úhly při základně. Všechny tři úhly jsou stejné jen v rovnostranném trojúhelníku, kde měří 60°.`),
  );
  const zn = uhel(z);
  return uloha(
    TEXT_ZAKLADNA[k](zn),
    uhel(key),
    dis,
    {
      hints: [
        "V rovnoramenném trojúhelníku jsou úhly při základně dva a jsou stejně velké.",
        `Úhel při základně vezmi dvakrát a tento součet odečti od ${stupnu(180)}. Co zbude, připadá na jediný úhel při hlavním vrcholu.`,
      ],
      solutionSteps: [
        `Oba úhly při základně: ${zapisSouctu([z, z])}`,
        `Úhel při hlavním vrcholu: ${zapisRozdilu(PLNY, 2 * z)}`,
        `Zkouška: ${zn} + ${zn} + ${uhel(key)} = 180° ✓`,
      ],
      explanation: `Rovnoramenný trojúhelník má dva shodné úhly při základně, dohromady ${uhel(2 * z)}. Na úhel při hlavním vrcholu zbývá 180° − ${uhel(2 * z)} = ${uhel(key)}.`,
    },
    [zn],
  );
}

let i2 = 0;
const k2 = Math.floor(Math.random() * 4);
const K_BEZ_STRECHY: Exclude<Kontext, "strecha">[] = ["abc", "zahon", "regal", "satek"];
const K_BEZ_REGALU: Exclude<Kontext, "regal">[] = ["abc", "strecha", "zahon", "satek"];
function genL2(): PracticeTask | null {
  // Kontext se posune až po celém kole šablon, jinak by každá šablona měla napořád tentýž kontext.
  const typ = i2 % 4;
  const c = k2 + Math.floor(i2 / 4);
  i2++;
  if (typ === 0) return genL2Obecny(K_BEZ_STRECHY[c % 4]);
  if (typ === 1) return genL2Pravy(K_BEZ_STRECHY[c % 4]);
  if (typ === 2) return genL2Vrchol(K_BEZ_REGALU[c % 4]);
  return genL2Zakladna(K_BEZ_REGALU[c % 4]);
}

// ── L3: dva kroky, inverze ─────────────────────────────────────────────────
type Kombinace = [DruhU, DruhS];
const KOMBINACE: Kombinace[] = [
  ["ostroúhlý", "rovnoramenný"],
  ["tupoúhlý", "různostranný"],
  ["pravoúhlý", "rovnoramenný"],
  ["ostroúhlý", "různostranný"],
  ["tupoúhlý", "rovnoramenný"],
  ["pravoúhlý", "různostranný"],
  ["ostroúhlý", "rovnostranný"],
];

/** Tři úhly (ve stupních) pro danou kombinaci; první dva se zadají. */
function uhlyPro([u, s]: Kombinace): number[] | null {
  if (s === "rovnostranný") return [60, 60, 60];
  if (s === "rovnoramenný") {
    const z = u === "ostroúhlý" ? rnd(46, 88) : u === "pravoúhlý" ? 45 : rnd(10, 44);
    if (z === 60) return null;
    const v = 180 - 2 * z;
    return pick([[z, z, v], [z, v, z], [v, z, z]]);
  }
  let x: number[];
  if (u === "pravoúhlý") {
    const a = rnd(15, 75);
    x = pick([[a, 90 - a, 90], [a, 90, 90 - a]]);
  } else if (u === "tupoúhlý") {
    const c = rnd(95, 150), a = rnd(5, 180 - c - 5);
    x = pick([[a, 180 - c - a, c], [a, c, 180 - c - a]]);
  } else {
    const a = rnd(35, 85), b = rnd(35, 85);
    x = [a, b, 180 - a - b];
    if (x[2] >= 90) return null;
  }
  return new Set(x).size === 3 ? x : null;
}

function genL3Popis(komb: Kombinace): PracticeTask | null {
  const deg = uhlyPro(komb);
  if (!deg) return null;
  const u = deg.map(st);
  const [a, b, c] = u;
  const [A, S] = komb;
  const max = Math.max(...u);
  const zadanyNetupy = a < PRAVY && b < PRAVY;
  // chybný druh podle úhlů
  let Aw: DruhU;
  let whyA: string;
  if (A === "ostroúhlý") {
    Aw = "tupoúhlý";
    whyA = `Tupý musí být jeden z úhlů trojúhelníku. Součet ${uhel(a)} + ${uhel(b)} = ${uhel(a + b)} žádným úhlem trojúhelníku není; největší úhel měří ${uhel(max)}.`;
  } else if (A === "pravoúhlý") {
    Aw = zadanyNetupy ? "ostroúhlý" : "tupoúhlý";
    whyA = zadanyNetupy
      ? `Oba zadané úhly jsou sice ostré, ale třetí úhel měří 180° − ${uhel(a + b)} = 90°, a to je pravý úhel.`
      : `Úhel 90° je pravý, ne tupý. Tupý úhel je větší než 90°.`;
  } else {
    Aw = zadanyNetupy ? "ostroúhlý" : "pravoúhlý";
    whyA = zadanyNetupy
      ? `Oba zadané úhly jsou sice ostré, ale o druhu rozhoduje největší úhel. Třetí úhel měří ${uhel(c)}, a to je tupý úhel.`
      : `Žádný z úhlů nemá přesně 90°. Úhel ${uhel(max)} je větší než pravý, tedy tupý.`;
  }
  // chybný druh podle stran
  let Sw: DruhS;
  let whyS: string;
  if (S === "rovnostranný") {
    Sw = "různostranný";
    whyS = `Všechny tři úhly měří 60°, takže jsou shodné i všechny tři strany.`;
  } else if (S === "rovnoramenný") {
    if (a === b) {
      Sw = "rovnostranný";
      whyS = `Rovnostranný trojúhelník má všechny úhly 60°. Třetí úhel tu měří ${uhel(c)}, shodné jsou jen dva úhly, a tedy jen dvě strany.`;
    } else {
      Sw = "různostranný";
      whyS = `Zadané úhly jsou různé, ale třetí úhel měří ${uhel(c)} — stejně jako jeden ze zadaných. Proti shodným úhlům leží shodné strany.`;
    }
  } else {
    Sw = "rovnoramenný";
    whyS = `Rovnoramenný trojúhelník by musel mít dva shodné úhly. Úhly ${uhel(a)}, ${uhel(b)} a ${uhel(c)} jsou všechny různé, a tak jsou různé i strany.`;
  }
  const opt = (x: DruhU, y: DruhS) => `${x} ${y}`;
  const dis: Distractor[] = [
    { value: opt(Aw, S), why: `Podle stran je to správně, ale podle úhlů ne. ${whyA}` },
    { value: opt(A, Sw), why: `Podle úhlů je to správně, ale podle stran ne. ${whyS}` },
    { value: opt(Aw, Sw), why: `Nesedí ani jedna část. ${whyA} ${whyS}` },
  ];
  const q = `Rozhodni, jak se nazývá trojúhelník podle úhlů i podle stran, jestliže dva jeho vnitřní úhly měří ${uhel(a)} a ${uhel(b)}.`;
  const shodaText = S === "rovnostranný"
    ? "Všechny tři úhly jsou shodné, proto jsou shodné i všechny tři strany"
    : S === "rovnoramenný"
      ? "Dva úhly jsou shodné, proti nim leží dvě shodné strany"
      : "Žádné dva úhly nejsou shodné, proto nejsou shodné ani žádné dvě strany";
  return uloha(
    q,
    opt(A, S),
    dis,
    {
      hints: [
        `Nejdřív dopočítej třetí úhel: od ${stupnu(180)} odečti součet zadaných úhlů.`,
        "Druh podle úhlů urči podle největšího ze všech tří úhlů. Druh podle stran poznáš podle shodných úhlů: proti shodným úhlům leží shodné strany.",
      ],
      solutionSteps: [
        `Třetí úhel: 180° − (${uhel(a)} + ${uhel(b)}) = 180° − ${uhel(a + b)} = ${uhel(c)}`,
        `Největší úhel ${uhel(max)} → ${A}`,
        `${shodaText} → ${S}`,
      ],
      explanation: `Třetí úhel měří ${uhel(c)}. Největší ze tří úhlů má ${uhel(max)}, proto je trojúhelník ${A}. ${shodaText}, takže je ${S}.`,
    },
    [uhel(a), uhel(b)],
  );
}

const KRAT: Record<number, string> = {
  2: "dvakrát", 3: "třikrát", 4: "čtyřikrát", 6: "šestkrát", 7: "sedmkrát", 8: "osmkrát", 10: "desetkrát",
};

/**
 * Dílky. „vrchol“ = úhel při hlavním vrcholu je k-krát větší (dílů k + 2),
 * „zakladna“ = každý úhel při základně je k-krát větší (dílů 2k + 1).
 */
function genL3Dilky(): PracticeTask | null {
  const varianta = pick(["vrchol", "vrchol", "zakladna"] as const);
  const k = varianta === "vrchol" ? pick([2, 3, 4, 6, 7, 8, 10]) : pick([2, 4, 7]);
  const kText = varianta === "zakladna" && k === 7 ? "sedmkrát" : KRAT[k];
  const dilu = varianta === "vrchol" ? k + 2 : 2 * k + 1;
  const dil = PLNY / dilu;
  if (!Number.isInteger(dil)) return null;
  const z = varianta === "vrchol" ? dil : k * dil; // úhel při základně
  const v = varianta === "vrchol" ? k * dil : dil; // úhel při hlavním vrcholu
  const ptejSeNa = pick(["z", "v"] as const);
  const key = ptejSeNa === "z" ? z : v;
  const nazevHledany = ptejSeNa === "z" ? "úhel při základně" : "úhel při hlavním vrcholu";
  const vztah = varianta === "vrchol"
    ? `úhel při hlavním vrcholu je ${kText} větší než každý z úhlů při základně`
    : `každý z úhlů při základně je ${kText} větší než úhel při hlavním vrcholu`;
  const q = `Kolik stupňů má ${nazevHledany} rovnoramenného trojúhelníku, jestliže ${vztah}?`;

  const vDilech = varianta === "vrchol"
    ? `úhel při základně = 1 díl, úhel při hlavním vrcholu = ${pad(k, "DÍL")}`
    : `úhel při hlavním vrcholu = 1 díl, každý úhel při základně = ${pad(k, "DÍL")}`;
  const dis: Distractor[] = [];
  const pridej = (minut: number, why: string) => {
    if (Number.isInteger(minut) && minut > 0) dis.push(d(minut, why));
  };
  // záměna, na který úhel se otázka ptá
  pridej(ptejSeNa === "z" ? v : z, `To je ${ptejSeNa === "z" ? "úhel při hlavním vrcholu" : "úhel při základně"}. Otázka se ptá na ${nazevHledany}.`);
  // zapomenutý druhý úhel při základně
  const dilu1 = varianta === "vrchol" ? k + 1 : k + 1;
  const dil1 = PLNY / dilu1;
  pridej(ptejSeNa === "z" ? (varianta === "vrchol" ? dil1 : k * dil1) : (varianta === "vrchol" ? k * dil1 : dil1),
    `Počítal jsi jen s jedním úhlem při základně. Rovnoramenný trojúhelník má úhly při základně dva, takže dílů je ${cis(dilu)}, ne ${cis(dilu1)}.`);
  // 360° místo 180°
  pridej(2 * key, `Rozdělil jsi 360°, jenže vnitřní úhly trojúhelníku mají dohromady 180°.`);
  // záměna rolí: vztah otočený
  const dilu2 = varianta === "vrchol" ? 2 * k + 1 : k + 2;
  const dil2 = PLNY / dilu2;
  const zOtoc = varianta === "vrchol" ? k * dil2 : dil2;
  const vOtoc = varianta === "vrchol" ? dil2 : k * dil2;
  pridej(ptejSeNa === "z" ? zOtoc : vOtoc, `Otočil jsi vztah: v zadání je ${vztah}, ne naopak.`);

  const soucetDilu = varianta === "vrchol" ? `1 + 1 + ${cis(k)} = ${cis(dilu)}` : `${cis(k)} + ${cis(k)} + 1 = ${cis(dilu)}`;
  return uloha(
    q,
    uhel(key),
    dis,
    {
      hints: [
        varianta === "vrchol"
          ? "Rozděl úhly na stejné díly: každý úhel při základně je jeden díl."
          : "Rozděl úhly na stejné díly: úhel při hlavním vrcholu je jeden díl.",
        `Spočítej, kolik takových dílů mají všechny tři úhly dohromady, a ${stupnu(180)} rozděl tímto počtem dílů. Pak zjisti, kolik dílů má úhel, na který se otázka ptá.`,
      ],
      solutionSteps: [
        `V dílech: ${vDilech}`,
        `Všechny tři úhly: ${soucetDilu} (${pad(dilu, "DÍL")})`,
        `Jeden díl: 180° : ${dilu} = ${uhel(dil)}`,
        `Úhel při základně = ${uhel(z)}, úhel při hlavním vrcholu = ${uhel(v)}; zkouška: ${uhel(z)} + ${uhel(z)} + ${uhel(v)} = 180° ✓`,
      ],
      explanation: `Úhly při základně rovnoramenného trojúhelníku jsou dva a shodné. Když ${vztah}, mají všechny tři úhly dohromady ${pad(dilu, "DÍL")}. Jeden díl je 180° : ${dilu} = ${uhel(dil)}, a proto ${nazevHledany} měří ${uhel(key)}.`,
    },
    [],
  );
}

const GAMMA = [90, 92, 95, 98, 100, 104, 105, 108, 110, 112, 115, 118, 120, 124, 125, 130, 135, 140, 150];

let i3c = 0;
function genL3Vyrok(): PracticeTask | null {
  const g = pick(GAMMA);
  // γ vždy se stupni i minutami: součet zbylých úhlů je pak odčítání s půjčkou (dva kroky).
  const gm = st(g) + minuty([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  const zbytek = PLNY - gm;
  const kSoucet = i3c++ % 2 === 0;
  const PREFIX = "Zbylé dva úhly";
  const soucet = (x: number) => `${PREFIX} mají dohromady ${uhel(x)}.`;
  const OSTRE = `${PREFIX} jsou oba ostré.`;
  const key = kSoucet ? soucet(zbytek) : OSTRE;
  const nepravdy: Distractor[] = [
    { value: soucet(zbytek + 60), why: `${ZAPOMENUTA_PUJCKA} Správně: ${zapisRozdilu(PLNY, gm)}.` },
    { value: soucet(PLNY), why: `180° mají dohromady všechny tři úhly, ne jen dva zbylé. Na ně zbývá 180° − ${uhel(gm)} = ${uhel(zbytek)}.` },
    { value: `${PREFIX} mohou být jeden pravý a jeden ostrý.`, why: `Na oba zbylé úhly dohromady zbývá jen ${uhel(zbytek)}. Pravý úhel 90° by se tam s dalším úhlem nevešel.` },
    { value: `${PREFIX} mohou být jeden tupý a jeden ostrý.`, why: `Na oba zbylé úhly dohromady zbývá jen ${uhel(zbytek)}, a tupý úhel je větší než 90°. Trojúhelník má nejvýš jeden úhel pravý nebo tupý.` },
    { value: `${PREFIX} mohou být oba pravé.`, why: `Dva pravé úhly by měly dohromady 180° a na zadaný úhel ${uhel(gm)} by nic nezbylo.` },
  ];
  const dis = shuffle(nepravdy).slice(0, 3);
  return uloha(
    `Který výrok je pravdivý o trojúhelníku, jehož jeden úhel měří ${uhel(gm)}?`,
    key,
    dis,
    {
      hints: [
        `Od ${stupnu(180)} odečti zadaný úhel: tolik zbývá na dva ostatní úhly dohromady. Při odčítání minut si podle potřeby půjč ${stupnu(1)}, tedy ${pad(60, "MINUTA")}.`,
        `Porovnej tento zbytek s pravým úhlem. Když na oba úhly dohromady zbývá méně než ${stupnu(90)}, může některý z nich mít ${stupnu(90)} nebo víc? Každý výrok ověř zvlášť.`,
      ],
      solutionSteps: [
        `Zbylé dva úhly mají dohromady ${zapisRozdilu(PLNY, gm)}`,
        `${uhel(zbytek)} < 90°, takže každý ze zbylých úhlů je menší než 90° → oba jsou ostré`,
        `Pravdivý výrok: ${key}`,
      ],
      explanation: kSoucet
        ? `Všechny tři vnitřní úhly mají dohromady 180°, takže na zbylé dva úhly zbývá 180° − ${uhel(gm)} = ${uhel(zbytek)}. Ostatní výroky tomu odporují.`
        : `Úhel ${uhel(gm)} je tupý. Na zbylé dva úhly zbývá 180° − ${uhel(gm)} = ${uhel(zbytek)}. To je méně než 90°, proto je každý z nich ostrý. Ostatní výroky tomu odporují.`,
    },
    [uhel(gm)],
    STRATEGIE.slice(1),
  );
}

const PRUSECIK = {
  uvnitr: "uvnitř trojúhelníku",
  vrchol: "ve vrcholu pravého úhlu",
  vne: "vně trojúhelníku",
  stred: "ve středu nejdelší strany",
} as const;

function genL3Vysky(druh: DruhU): PracticeTask | null {
  let a: number, b: number;
  if (druh === "ostroúhlý") {
    a = rnd(35, 85); b = rnd(35, 85);
    const c = 180 - a - b;
    if (c <= 0 || c >= 90) return null;
  } else if (druh === "pravoúhlý") {
    a = rnd(15, 75); b = 90 - a;
  } else {
    a = rnd(5, 60); b = rnd(5, 60);
    if (a + b > 85 || a + b < 20) return null;
  }
  const am = st(a), bm = st(b), cm = PLNY - am - bm;
  const key = druh === "ostroúhlý" ? PRUSECIK.uvnitr : druh === "pravoúhlý" ? PRUSECIK.vrchol : PRUSECIK.vne;
  const treti = `Třetí úhel měří 180° − ${uhel(am + bm)} = ${uhel(cm)}`;
  const why: Record<string, string> = {
    [PRUSECIK.uvnitr]: druh === "tupoúhlý"
      ? `Výšky neleží vždy uvnitř. ${treti}, trojúhelník je tupoúhlý a výšky z vrcholů ostrých úhlů dopadnou až na prodloužení stran. Jejich přímky se proto protnou vně.`
      : `${treti}, to je pravý úhel. Dvě výšky tu splývají se stranami, které svírají pravý úhel, a ty se protínají ve vrcholu.`,
    [PRUSECIK.vrchol]: `Tento trojúhelník pravý úhel nemá: ${treti.charAt(0).toLowerCase()}${treti.slice(1)}.`,
    [PRUSECIK.vne]: druh === "ostroúhlý"
      ? `Vně leží průsečík jen u tupoúhlého trojúhelníku. ${treti}, všechny tři úhly jsou tedy ostré.`
      : `Vně leží průsečík jen u tupoúhlého trojúhelníku. ${treti}, trojúhelník je pravoúhlý.`,
    [PRUSECIK.stred]: `Ve středu nejdelší strany leží u pravoúhlého trojúhelníku střed kružnice opsané. Průsečík přímek, na kterých leží výšky, tam není.`,
  };
  const dis = Object.values(PRUSECIK)
    .filter((x) => x !== key)
    .map((x) => ({ value: x, why: why[x] }));
  const zaver = druh === "ostroúhlý"
    ? "Všechny úhly jsou ostré, výšky leží uvnitř a protnou se uvnitř trojúhelníku."
    : druh === "pravoúhlý"
      ? "Dvě výšky splývají se stranami u pravého úhlu, proto se přímky výšek protnou ve vrcholu pravého úhlu."
      : "Výšky z vrcholů ostrých úhlů leží mimo trojúhelník, proto se přímky výšek protnou vně trojúhelníku.";
  return uloha(
    `Rozhodni, kde leží průsečík přímek, na kterých leží výšky trojúhelníku, jehož dva vnitřní úhly měří ${uhel(am)} a ${uhel(bm)}.`,
    key,
    dis,
    {
      hints: [
        `Nejdřív dopočítej třetí úhel (odečti součet zadaných od ${stupnu(180)}) a urči druh trojúhelníku podle největšího úhlu.`,
        "Představ si, kde leží výšky: u pravého úhlu splývají dvě výšky se stranami a u tupého úhlu dopadne výška z ostrého úhlu až na prodloužení protější strany.",
      ],
      solutionSteps: [
        `${treti}`,
        `Největší úhel ${uhel(Math.max(am, bm, cm))} → ${druh} trojúhelník`,
        zaver,
      ],
      explanation: `${treti}, takže trojúhelník je ${druh}. ${zaver}`,
    },
    [uhel(am), uhel(bm)],
  );
}

let i3 = 0;
let i3a = 0;
let i3d = 0;
function genL3(): PracticeTask | null {
  const k = i3++ % 4;
  if (k === 0) return genL3Popis(KOMBINACE[i3a++ % KOMBINACE.length]);
  if (k === 1) return genL3Dilky();
  if (k === 2) return genL3Vyrok();
  return genL3Vysky((["ostroúhlý", "pravoúhlý", "tupoúhlý"] as DruhU[])[i3d++ % 3]);
}

// ── Generátor ──────────────────────────────────────────────────────────────
/**
 * Počítadla rotace šablon se nastaví náhodně na začátku KAŽDÉHO volání.
 * Dřív se losovala jednou při načtení modulu a mezi voláními pokračovala,
 * takže dvě volání gen() se stejným seedem dala jiné úlohy a zámek obsahu
 * (frozen-content-unchanged) padal náhodně.
 */
function zacniRotace(): void {
  const r = (n: number) => Math.floor(Math.random() * n);
  iDef = r(DEFINICE.length);
  i1 = r(3); i1u = r(3); i1s = r(3);
  i2 = r(4);
  i3c = r(2);
  i3 = r(4); i3a = r(KOMBINACE.length); i3d = r(3);
}

function gen(level: number): PracticeTask[] {
  zacniRotace();
  if (level === 1) return ruzneUlohy(() => losUlohy(genL1));
  if (level === 2) return ruzneUlohy(() => losUlohy(genL2));
  return ruzneUlohy(() => losUlohy(genL3));
}

// ── Topic ──────────────────────────────────────────────────────────────────
export const TROJUHELNIKY_UHLY_VYSKA_TEZNICE_6: TopicMetadata[] = [
  {
    id: "g6-mat-trojuhelniky-uhly-vyska-teznice-6",
    rvpNodeId: "g6-matematika-geometrie-v-rovine-a-v-prostoru-trojuhelniky-druhy-trojuhelniku-vnitrni-uhly-vyska-teznice",
    displayName: "Trojúhelníky: úhly, výška a těžnice",
    title: "Druhy trojúhelníků, vnitřní úhly, výška, těžnice",
    studentTitle: "Trojúhelníky: úhly, výška a těžnice",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Trojúhelníky",
    briefDescription: "Dopočítej úhel v trojúhelníku, urči jeho druh a rozliš výšku od těžnice.",
    keywords: [
      "trojúhelník", "vnitřní úhly", "součet úhlů", "ostroúhlý", "pravoúhlý", "tupoúhlý",
      "rovnoramenný", "rovnostranný", "různostranný", "výška", "těžnice", "osa strany", "stupně a minuty",
    ],
    goals: [
      "Dopočítat chybějící vnitřní úhel trojúhelníku ze součtu 180°, i se stupni a minutami.",
      "Určit druh trojúhelníku podle úhlů a podle stran.",
      "Rozlišit výšku, těžnici, osu strany a střední příčku a vědět, kde se protínají přímky výšek.",
    ],
    boundaries: [
      "Bez obrázku — všechny údaje jsou ve slovním zadání.",
      "Úhly ve stupních a minutách (1° = 60′), bez vteřin.",
      "Bez vnějších úhlů, těžiště ve dvou třetinách, poměru a rovnic.",
      "Žák vybírá ze čtyř možností, nepíše vlastní odpověď.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-mat-osova-stredova-soumernost-6"],
    generator: gen,
    helpTemplate: {
      hint: "Vnitřní úhly každého trojúhelníku mají dohromady 180°. Druh podle úhlů určuje největší úhel.",
      steps: [
        "Sečti známé úhly (60′ = 1°) a součet odečti od 180°.",
        "U rovnoramenného trojúhelníku jsou úhly při základně dva a shodné.",
        "Největší úhel ostrý → ostroúhlý, pravý → pravoúhlý, tupý → tupoúhlý.",
        "Výška je kolmice z vrcholu na protější stranu, těžnice spojuje vrchol se středem protější strany.",
      ],
      commonMistake: "Odečítání od 360° místo od 180°, minuty počítané po stovkách a zapomenutý druhý úhel při základně.",
      example: "Úhly 47° 30′ a 68° 45′: součet 115° 75′ = 116° 15′, třetí úhel 180° − 116° 15′ = 63° 45′.",
    },
  },
];
