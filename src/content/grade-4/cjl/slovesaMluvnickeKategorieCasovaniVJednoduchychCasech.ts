import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Z možností vypadly kategorie,
// které školní mluvnice nezná („přací způsob“, „tázací způsob“, „duál“,
// „čas neurčitý“), a klíč „přací / rozkazovací“ u „ať přijdou“. Úlohy
// vznikají z tabulky tvarů: každá špatná možnost se od klíče liší právě
// v jedné kategorii a zpětná vazba řekne, ve které a proč.
//
// L1 = osoba a číslo · L2 = osoba, číslo a čas · L3 = osoba, číslo a způsob.

type Os = 1 | 2 | 3;
type Cis = "j" | "m";
type Cas = "minulý" | "přítomný" | "budoucí";
type Zp = "oznamovací" | "rozkazovací" | "podmiňovací";

const ZAJ: Record<string, string> = { "1j": "já", "2j": "ty", "3j": "on, ona, ono", "1m": "my", "2m": "vy", "3m": "oni, ony, ona" };
const CISLO: Record<Cis, string> = { j: "jednotné číslo", m: "množné číslo" };
const CAS_POPIS: Record<Cas, string> = {
  minulý: "vyjadřuje děj, který už proběhl",
  přítomný: "vyjadřuje děj, který probíhá teď",
  budoucí: "vyjadřuje děj, který teprve nastane",
};
const ZP_POPIS: Record<Zp, string> = {
  oznamovací: "jen oznamuje, co se děje",
  rozkazovací: "je výzva nebo rozkaz",
  podmiňovací: "obsahuje by, bych, bys… a říká, co by se stalo",
};

const dalsiOs = (o: Os): Os => ((o % 3) + 1) as Os;
const jineCis = (c: Cis): Cis => (c === "j" ? "m" : "j");

function osobaCislo(o: Os, c: Cis) { return `${o}. osoba, ${CISLO[c]}`; }

function whyOsoba(t: string, o: Os, c: Cis, d: Os) {
  return `K tvaru „${t}“ se hodí „${ZAJ[`${o}${c}`]}“ — to je ${o}. osoba, ne ${d}. osoba.`;
}
function whyCislo(t: string, o: Os, c: Cis) {
  return `„${t}“ patří k „${ZAJ[`${o}${c}`]}“ — ${c === "m" ? "je jich víc" : "je jen jeden"}, tedy ${CISLO[c]}.`;
}

type Tri = [{ value: string; why: string }, { value: string; why: string }, { value: string; why: string }];

function ulohaL1(t: string, o: Os, c: Cis): PracticeTask {
  const d1 = dalsiOs(o); const d2 = dalsiOs(d1);
  return choice(`Urči osobu a číslo slovesa „${t}“.`, osobaCislo(o, c), [
    { value: osobaCislo(d1, c), why: whyOsoba(t, o, c, d1) },
    { value: osobaCislo(d2, c), why: whyOsoba(t, o, c, d2) },
    { value: osobaCislo(o, jineCis(c)), why: whyCislo(t, o, c) },
  ] as Tri, {
    hints: [
      `Které zájmeno se hodí před „${t}“: já, ty, on, my, vy, nebo oni?`,
      `Doplň zájmeno: „… ${t}“. Kdo mluví sám o sobě, je první osoba; ten, s kým mluvíme, druhá; o kom mluvíme, třetí. Pak rozhodni, jestli jde o jednoho, nebo víc lidí.`,
    ],
    explanation: `K tvaru „${t}“ patří „${ZAJ[`${o}${c}`]}“, proto ${osobaCislo(o, c)}.`,
  });
}

function ulohaL2(t: string, o: Os, c: Cis, cas: Cas): PracticeTask {
  const fmt = (oo: Os, cc: Cis, ca: Cas) => `${osobaCislo(oo, cc)}, čas ${ca}`;
  const casy: Cas[] = ["minulý", "přítomný", "budoucí"];
  const jinyCas = casy[(casy.indexOf(cas) + 1) % 3];
  return choice(`Urči osobu, číslo a čas slovesa „${t}“.`, fmt(o, c, cas), [
    { value: fmt(dalsiOs(o), c, cas), why: whyOsoba(t, o, c, dalsiOs(o)) },
    { value: fmt(o, jineCis(c), cas), why: whyCislo(t, o, c) },
    { value: fmt(o, c, jinyCas), why: `Osoba i číslo sedí, ale „${t}“ ${CAS_POPIS[cas]} — čas ${cas}.` },
  ] as Tri, {
    hints: [
      `Kdo děj „${t}“ koná a kdy se to děje?`,
      `Zájmeno před „${t}“ ti řekne osobu a číslo. Čas poznáš podle toho, jestli se to už stalo, děje se teď, nebo teprve bude: tvary jako psal, šel ukazují minulost, budu, budeš… budoucnost.`,
    ],
    explanation: `„${t}“ patří k „${ZAJ[`${o}${c}`]}“ a ${CAS_POPIS[cas]}, proto ${fmt(o, c, cas)}.`,
  });
}

function ulohaL3(t: string, o: Os, c: Cis, zp: Zp): PracticeTask {
  const fmt = (oo: Os, cc: Cis, z: Zp) => `${osobaCislo(oo, cc)}, způsob ${z}`;
  const zpusoby: Zp[] = ["oznamovací", "rozkazovací", "podmiňovací"];
  const jinyZp = zpusoby[(zpusoby.indexOf(zp) + 1) % 3];
  // Rozkazovací způsob nemá 3. osobu — jiná osoba se proto bere jen z 1. a 2.
  const jinaOs: Os = zp === "rozkazovací" ? (o === 1 ? 2 : 1) : dalsiOs(o);
  return choice(`Urči osobu, číslo a způsob slovesa „${t}“.`, fmt(o, c, zp), [
    { value: fmt(jinaOs, c, zp), why: whyOsoba(t, o, c, jinaOs) },
    { value: fmt(o, jineCis(c), zp), why: whyCislo(t, o, c) },
    { value: fmt(o, c, jinyZp), why: `Osoba i číslo sedí, ale „${t}“ ${ZP_POPIS[zp]} — způsob ${zp}.` },
  ] as Tri, {
    hints: [
      `Je „${t}“ obyčejné oznámení, výzva, nebo to, co by se stalo?`,
      `Výzva (čti!, pojďme!) má jeden způsob, slůvka bych, bys, by, bychom, byste druhý a obyčejné sdělení třetí. Osobu a číslo urči podle zájmena, které se k „${t}“ hodí.`,
    ],
    explanation: `„${t}“ patří k „${ZAJ[`${o}${c}`]}“ a ${ZP_POPIS[zp]}, proto ${fmt(o, c, zp)}.`,
  });
}

const L1: PracticeTask[] = ([
  ["čteme", 1, "m"], ["píšeš", 2, "j"], ["zpívají", 3, "m"], ["jdu", 1, "j"], ["hrajete", 2, "m"],
  ["nese", 3, "j"], ["kreslíme", 1, "m"], ["skáčeš", 2, "j"], ["vaříte", 2, "m"], ["tancuji", 1, "j"],
  ["píšou", 3, "m"], ["plaveš", 2, "j"], ["čte", 3, "j"],
] as [string, Os, Cis][]).map(([t, o, c]) => ulohaL1(t, o, c));

const L2: PracticeTask[] = ([
  ["nesli jsme", 1, "m", "minulý"], ["budeš psát", 2, "j", "budoucí"], ["psali jste", 2, "m", "minulý"],
  ["půjdeme", 1, "m", "budoucí"], ["čtou", 3, "m", "přítomný"], ["zpívala jsem", 1, "j", "minulý"],
  ["budou hrát", 3, "m", "budoucí"], ["kreslíš", 2, "j", "přítomný"], ["šel", 3, "j", "minulý"],
  ["budete spát", 2, "m", "budoucí"], ["vařím", 1, "j", "přítomný"], ["letěly", 3, "m", "minulý"],
  ["přijdu", 1, "j", "budoucí"],
] as [string, Os, Cis, Cas][]).map(([t, o, c, ca]) => ulohaL2(t, o, c, ca));

const L3: PracticeTask[] = ([
  ["čti", 2, "j", "rozkazovací"], ["pojďme", 1, "m", "rozkazovací"], ["napište", 2, "m", "rozkazovací"],
  ["četl bys", 2, "j", "podmiňovací"], ["zpívali bychom", 1, "m", "podmiňovací"], ["přišel by", 3, "j", "podmiňovací"],
  ["byli byste", 2, "m", "podmiňovací"], ["hrajeme", 1, "m", "oznamovací"], ["nesl bych", 1, "j", "podmiňovací"],
  ["běžte", 2, "m", "rozkazovací"], ["ukaž", 2, "j", "rozkazovací"], ["čekaly by", 3, "m", "podmiňovací"],
  ["vaříš", 2, "j", "oznamovací"],
] as [string, Os, Cis, Zp][]).map(([t, o, c, z]) => ulohaL3(t, o, c, z));

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const SLOVESAMLUVNICKEKATEGORIECASOVANIVJEDNODUCHYCHCASECH: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-slovesa-mluvnicke-kategorie-casovani-v-jednoduchych-casech",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-slovesa-mluvnicke-kategorie-casovani-v-jednoduchych-casech",
    displayName: "Slovesa a časování",
    title: "Slovesa - mluvnické kategorie, časování v jednoduchých časech",
    studentTitle: "Slovesa a časy",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Naučíš se určovat osobu, číslo, čas a způsob sloves.",
    keywords: ["sloveso", "osoba", "číslo", "čas", "způsob", "časování", "mluvnické kategorie"],
    goals: [
      "Určit osobu, číslo, čas a způsob slovesa",
      "Časovat slovesa v přítomném, minulém a budoucím čase",
    ],
    boundaries: ["Bez podmiňovacího způsobu minulého", "Bez trpného rodu"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-cjl-jazykova-vychova-tvaroslovi-zajmena-druhy-zajmen"],
    generator: gen,
    helpTemplate: {
      hint: "Osoba=kdo (já/ty/on), Číslo=jeden/víc, Čas=minulý/přítomný/budoucí, Způsob=oznamovací/rozkazovací/podmiňovací",
      steps: [
        "Doplň zájmeno → osoba (1./2./3.) a číslo (jednotné/množné)",
        "Kdy se děj odehrává? → čas (minulý/přítomný/budoucí)",
        "Oznámení, výzva, nebo „by“? → způsob (oznamovací/rozkazovací/podmiňovací)",
      ],
      commonMistake: "Dokonavá slovesa v přítomném tvaru vyjadřují budoucnost: „přijdu“ = čas budoucí",
      example: "čteme: 1. osoba, množné číslo, čas přítomný, způsob oznamovací",
    },
  },
];
