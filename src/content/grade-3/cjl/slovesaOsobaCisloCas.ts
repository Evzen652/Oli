import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[] }[] = [
  // Čas
  { q: "Sloveso 'hrál' je v čase:", a: "Minulém", opts: ["Minulém", "Přítomném", "Budoucím", "Neurčitém"] },
  { q: "Sloveso 'hraje' je v čase:", a: "Přítomném", opts: ["Přítomném", "Minulém", "Budoucím", "Neurčitém"] },
  { q: "Sloveso 'bude hrát' je v čase:", a: "Budoucím", opts: ["Budoucím", "Přítomném", "Minulém", "Neurčitém"] },
  { q: "Věta: 'Kluci šli domů.' — Sloveso je v čase:", a: "Minulém (šli)", opts: ["Minulém (šli)", "Přítomném", "Budoucím", "Neurčitém"] },
  { q: "Věta: 'Zítra půjdeme do kina.' — Čas:", a: "Budoucí (půjdeme)", opts: ["Budoucí (půjdeme)", "Přítomný", "Minulý", "Neurčitý"] },
  // Osoba
  { q: "Sloveso 'čtu' — která osoba?", a: "1. osoba (já čtu)", opts: ["1. osoba (já čtu)", "2. osoba (ty čteš)", "3. osoba (on čte)", "Neurčitá"] },
  { q: "Sloveso 'čteš' — která osoba?", a: "2. osoba (ty čteš)", opts: ["2. osoba (ty čteš)", "1. osoba (já čtu)", "3. osoba (on čte)", "Neurčitá"] },
  { q: "Sloveso 'čte' — která osoba?", a: "3. osoba (on/ona čte)", opts: ["3. osoba (on/ona čte)", "1. osoba (já čtu)", "2. osoba (ty čteš)", "Neurčitá"] },
  // Číslo
  { q: "Sloveso 'jdeme' je v čísle:", a: "Množném (my jdeme)", opts: ["Množném (my jdeme)", "Jednotném (já jdu)", "Středním", "Neurčitém"] },
  { q: "Sloveso 'jdu' je v čísle:", a: "Jednotném (já jdu)", opts: ["Jednotném (já jdu)", "Množném (my jdeme)", "Středním", "Neurčitém"] },
  { q: "Ve větě 'Děti si hrají venku.' — Čas slovesa 'hrají'?", a: "Přítomný", opts: ["Přítomný", "Minulý", "Budoucí", "Neurčitý"] },
  { q: "Ve větě 'Učila jsem se celý večer.' — Osoba?", a: "1. osoba, číslo jednotné (já)", opts: ["1. osoba, číslo jednotné (já)", "2. osoba (ty)", "3. osoba (ona)", "1. osoba množné"] },
  { q: "Jak tvoříme přítomný čas od 'číst'?", a: "čtu, čteš, čte, čteme, čtete, čtou", opts: ["čtu, čteš, čte, čteme, čtete, čtou", "čil, čila, číst, čtěme", "jsem číst, jsi číst, je číst", "budu číst, budeš číst"] },
  { q: "Sloveso 'přišli' — číslo?", a: "Množné (oni přišli)", opts: ["Množné (oni přišli)", "Jednotné (on přišel)", "Střední", "Neurčité"] },
  { q: "Věta: 'Budu studovat na vysoké škole.' — Čas?", a: "Budoucí", opts: ["Budoucí", "Přítomný", "Minulý", "Neurčitý"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 9) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Čas: bylo = minulý, je/jsou = přítomný, bude = budoucí.", "Osoba: já = 1., ty = 2., on/ona = 3. Číslo: já/ty/on = jednotné; my/vy/oni = množné."],
    solutionSteps: ["Najdu sloveso.", `Určím: ${a}`],
  }));
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
