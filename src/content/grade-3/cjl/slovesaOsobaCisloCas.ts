import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * PED-3 kalibrace L1<L2<L3.
 * Před: L1 = POOL[0..9], L2 = L3 = celý POOL → getTierTasks L3 vyprazdňoval.
 * Teď disjunktní: L1 (čas), L2 (osoba + číslo), L3 (aplikace v celé větě).
 */

type Item = { q: string; a: string; opts: string[]; e: string; hints?: string[] };

const POOL_L1: Item[] = [
  // Čas — základní rozlišení
  { q: "Sloveso 'hrál' je v čase:", a: "Minulém", opts: ["Minulém", "Přítomném", "Budoucím", "Neurčitém"], e: "Slovo 'hrál' říká, že hraní už proběhlo — stalo se dříve." },
  { q: "Sloveso 'hraje' je v čase:", a: "Přítomném", opts: ["Přítomném", "Minulém", "Budoucím", "Neurčitém"], e: "Slovo 'hraje' znamená, že hraní se děje právě teď." },
  { q: "Sloveso 'bude hrát' je v čase:", a: "Budoucím", opts: ["Budoucím", "Přítomném", "Minulém", "Neurčitém"], e: "Slovo 'bude' napovídá, že hraní teprve přijde." },
  { q: "Sloveso 'psal' je v čase:", a: "Minulém", opts: ["Minulém", "Přítomném", "Budoucím", "Neurčitém"], e: "'Psal' se odehrálo dřív — minulý čas." },
  { q: "Sloveso 'zpívá' je v čase:", a: "Přítomném", opts: ["Přítomném", "Minulém", "Budoucím", "Neurčitém"], e: "'Zpívá' se děje právě teď — přítomný čas." },
  { q: "Sloveso 'budeme číst' je v čase:", a: "Budoucím", opts: ["Budoucím", "Přítomném", "Minulém", "Neurčitém"], e: "'Budeme' říká, že čtení teprve nastane — budoucí čas." },
  { q: "Které z těchto sloves je v přítomném čase?", a: "běhá", opts: ["běhá", "běhal", "poběží", "běžet"], e: "'Běhá' se děje teď — jediné v přítomném čase." },
  { q: "Které z těchto sloves je v minulém čase?", a: "šel", opts: ["šel", "jde", "půjde", "jít"], e: "'Šel' se stalo dříve — minulý čas." },
  { q: "Které z těchto sloves je v budoucím čase?", a: "napíše", opts: ["napíše", "psal", "píše", "psát"], e: "'Napíše' se stane až později — budoucí čas." },
];

const POOL_L2: Item[] = [
  // Osoba a číslo — kdo dělá, kolik jich je
  { q: "Sloveso 'čtu' — která osoba?", a: "1. osoba (já čtu)", opts: ["1. osoba (já čtu)", "2. osoba (ty čteš)", "3. osoba (on čte)", "Neurčitá"], e: "'Čtu' = mluvím o sobě → 1. osoba." },
  { q: "Sloveso 'čteš' — která osoba?", a: "2. osoba (ty čteš)", opts: ["2. osoba (ty čteš)", "1. osoba (já čtu)", "3. osoba (on čte)", "Neurčitá"], e: "'Čteš' použijeme, když říkáme někomu 'ty' → 2. osoba." },
  { q: "Sloveso 'čte' — která osoba?", a: "3. osoba (on/ona čte)", opts: ["3. osoba (on/ona čte)", "1. osoba (já čtu)", "2. osoba (ty čteš)", "Neurčitá"], e: "'Čte' říká, že čte on nebo ona → 3. osoba." },
  { q: "Sloveso 'jdeme' je v čísle:", a: "Množném (my jdeme)", opts: ["Množném (my jdeme)", "Jednotném (já jdu)", "Středním", "Neurčitém"], e: "'Jdeme' → 'my' → množné číslo." },
  {
    q: "Sloveso 'jdu' je v čísle:",
    a: "Jednotné (já jdu)",
    opts: ["Jednotné (já jdu)", "Množné (my jdeme)", "Střední", "Neurčité"],
    e: "'Jdu' → 'já' → jednotné číslo.",
    hints: [
      "Zeptej se: dělá to jedna osoba, nebo víc najednou?",
      "Sloveso 'jdu' patří k 'já' — a 'já' je vždycky jen jeden.",
    ],
  },
  { q: "Sloveso 'přišli' — číslo?", a: "Množné (oni přišli)", opts: ["Množné (oni přišli)", "Jednotné (on přišel)", "Střední", "Neurčité"], e: "'Přišli' → 'oni' → množné číslo." },
  { q: "Sloveso 'nesete' — osoba a číslo?", a: "2. osoba, množné (vy)", opts: ["2. osoba, množné (vy)", "1. osoba, jednotné (já)", "3. osoba, množné (oni)", "2. osoba, jednotné (ty)"], e: "'Nesete' = mluvíte více lidem najednou (vy) → 2. os. mn. č." },
  { q: "Sloveso 'píšou' — osoba a číslo?", a: "3. osoba, množné (oni)", opts: ["3. osoba, množné (oni)", "1. osoba, množné (my)", "2. osoba, množné (vy)", "3. osoba, jednotné (on)"], e: "'Píšou' → 'oni' → 3. os. mn. č." },
  { q: "Jak tvoříme přítomný čas od 'číst'?", a: "čtu, čteš, čte, čteme, čtete, čtou", opts: ["čtu, čteš, čte, čteme, čtete, čtou", "čil, čila, číst, čtěme", "jsem číst, jsi číst, je číst", "budu číst, budeš číst"], e: "Přítomný čas: -u, -eš, -e, -eme, -ete, -ou." },
];

const POOL_L3: Item[] = [
  // Aplikace v celé větě: určit vše najednou
  { q: "Věta: 'Kluci šli domů.' — Sloveso je v čase:", a: "Minulém (šli)", opts: ["Minulém (šli)", "Přítomném", "Budoucím", "Neurčitém"], e: "'Šli' se stalo dříve — minulý čas." },
  { q: "Věta: 'Zítra půjdeme do kina.' — Čas slovesa?", a: "Budoucí", opts: ["Neurčitý", "Budoucí", "Přítomný", "Minulý"], e: "'Zítra' + 'půjdeme' → budoucí čas." },
  { q: "Ve větě 'Děti si hrají venku.' — Čas slovesa 'hrají'?", a: "Přítomný", opts: ["Přítomný", "Minulý", "Budoucí", "Neurčitý"], e: "'Hrají' se děje teď → přítomný čas." },
  { q: "Ve větě 'Učila jsem se celý večer.' — Osoba a číslo?", a: "1. osoba, číslo jednotné (já)", opts: ["1. osoba, číslo jednotné (já)", "2. osoba (ty)", "3. osoba (ona)", "1. osoba množné"], e: "'Jsem' + 'učila' = mluvčí o sobě → 1. os. jed. č." },
  { q: "Věta: 'Budu studovat na vysoké škole.' — Čas?", a: "Budoucí", opts: ["Budoucí", "Přítomný", "Minulý", "Neurčitý"], e: "'Budu' → budoucí čas." },
  { q: "Věta: 'Sourozenci si postavili sněhuláka.' — Určíme?", a: "Minulý čas, 3. os., mn. č.", opts: ["Minulý čas, 3. os., mn. č.", "Přítomný, 1. os., jed. č.", "Budoucí, 2. os., mn. č.", "Minulý, 1. os., mn. č."], e: "'Postavili' se stalo dřív, dělali oni (více lidí) → minulý čas, 3. os., mn. č." },
  { q: "Věta: 'Zpíváš krásně!' — Určíme?", a: "Přítomný, 2. os., jed. č.", opts: ["Přítomný, 2. os., jed. č.", "Přítomný, 1. os., mn. č.", "Minulý, 3. os., jed. č.", "Budoucí, 2. os., jed. č."], e: "'Zpíváš' se děje teď a mluvíš k jedné osobě → přítomný, 2. os., jed. č." },
  { q: "Věta: 'Pojedeme na výlet.' — Určíme?", a: "Budoucí, 1. os., mn. č.", opts: ["Budoucí, 1. os., mn. č.", "Přítomný, 1. os., mn. č.", "Minulý, 3. os., mn. č.", "Budoucí, 2. os., mn. č."], e: "'Pojedeme' = my pojedeme → budoucí čas, 1. os., mn. č." },
  { q: "V jaké osobě a čísle je sloveso ve větě 'Ptáci létají nad polem.'?", a: "3. os., mn. č.", opts: ["3. os., mn. č.", "3. os., jed. č.", "1. os., mn. č.", "2. os., mn. č."], e: "Ptáci = oni (více) → 3. os. mn. č." },
  { q: "Věta 'Napíšu ti dopis.' — Čas, osoba, číslo?", a: "Budoucí, 1. os., jed. č.", opts: ["Budoucí, 1. os., jed. č.", "Přítomný, 1. os., jed. č.", "Minulý, 2. os., jed. č.", "Budoucí, 2. os., jed. č."], e: "'Napíšu' = já napíšu (budoucí) → budoucí, 1. os., jed. č." },
];

function pick(pool: Item[]): PracticeTask[] {
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e, hints }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: hints ?? [
      "Zeptej se, jestli se děj už stal, právě probíhá, nebo teprve nastane.",
      "Osoba: já = 1., ty = 2., on/ona = 3. Číslo: já/ty/on = jednotné; my/vy/oni = množné.",
    ],
    explanation: e,
  }));
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return pick(pool);
}

export const SLOVESAOSOBACISELCAS: TopicMetadata[] = [
  {
    id: "g3-cjl-slovesa-osoba-cislo-cas",
    rvpNodeId: "g3-cjl-jazykova-vychova-tvaroslovi-slovesa-osoba-cislo-cas",
    title: "Slovesa - osoba, číslo, čas",
    studentTitle: "Slovesa: kdo a kdy",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Určíš u slovesa osobu, číslo a čas.",
    keywords: ["sloveso", "osoba", "číslo", "čas", "minulý přítomný budoucí", "já ty on"],
    goals: ["Určit čas slovesa (minulý, přítomný, budoucí).", "Určit osobu slovesa (1., 2., 3.).", "Určit číslo slovesa (jednotné, množné)."],
    boundaries: ["Jednoduchý čas, základní slovesa."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Čas: hrál = minulý, hraje = přítomný, bude hrát = budoucí. Osoba: já/ty/on-ona. Číslo: sg/pl.",
      steps: ["Najdi sloveso ve větě.", "Zeptej se: Kdy? (čas), Kdo dělá? (osoba), Jeden nebo více? (číslo)."],
      commonMistake: "Záměna minulého a přítomného: 'hrál' (hotové, minulé) vs 'hraje' (právě teď).",
      example: "Dívky zpívaly. → zpívaly: minulý čas, 3. osoba, množné číslo.",
    },
  },
];
