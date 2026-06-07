import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[]; e: string }[] = [
  // Čas
  { q: "Sloveso 'hrál' je v čase:", a: "Minulém", opts: ["Minulém", "Přítomném", "Budoucím", "Neurčitém"], e: "Slovo 'hrál' říká, že hraní už proběhlo — stalo se to dříve, ne teď. Vždy se zeptej: Kdy to bylo? 'Hrál' = bylo to v minulosti." },
  { q: "Sloveso 'hraje' je v čase:", a: "Přítomném", opts: ["Přítomném", "Minulém", "Budoucím", "Neurčitém"], e: "Slovo 'hraje' znamená, že hraní se děje právě teď, v tuto chvíli. Přítomný čas poznáš tak, že se to děje teď." },
  { q: "Sloveso 'bude hrát' je v čase:", a: "Budoucím", opts: ["Budoucím", "Přítomném", "Minulém", "Neurčitém"], e: "Slovo 'bude' nám napovídá, že hraní teprve přijde — ještě se nestalo. Budoucí čas vždy poznáš podle slova 'bude', 'budu', 'budeme' a podobných." },
  { q: "Věta: 'Kluci šli domů.' — Sloveso je v čase:", a: "Minulém (šli)", opts: ["Minulém (šli)", "Přítomném", "Budoucím", "Neurčitém"], e: "Sloveso 'šli' říká, že chůze domů už proběhla. Minulý čas poznáme tak, že se děj stal dříve — kluci už doma jsou." },
  { q: "Věta: 'Zítra půjdeme do kina.' — Čas:", a: "Budoucí (půjdeme)", opts: ["Budoucí (půjdeme)", "Přítomný", "Minulý", "Neurčitý"], e: "Slovo 'zítra' nám hned prozradí, že to ještě nenastalo. Sloveso 'půjdeme' je budoucí čas — do kina teprve půjdeme." },
  // Osoba
  { q: "Sloveso 'čtu' — která osoba?", a: "1. osoba (já čtu)", opts: ["1. osoba (já čtu)", "2. osoba (ty čteš)", "3. osoba (on čte)", "Neurčitá"], e: "Sloveso 'čtu' říká, že čtu já sám. Vždy, když mluvíš o sobě a použiješ tvar jako 'čtu, jdu, dělám', je to 1. osoba." },
  { q: "Sloveso 'čteš' — která osoba?", a: "2. osoba (ty čteš)", opts: ["2. osoba (ty čteš)", "1. osoba (já čtu)", "3. osoba (on čte)", "Neurčitá"], e: "Tvar 'čteš' použijeme, když mluvíme s někým přímo — říkáme mu 'ty'. Kdykoli oslovuješ druhého a sloveso končí podobně, je to 2. osoba." },
  { q: "Sloveso 'čte' — která osoba?", a: "3. osoba (on/ona čte)", opts: ["3. osoba (on/ona čte)", "1. osoba (já čtu)", "2. osoba (ty čteš)", "Neurčitá"], e: "Tvar 'čte' říká, že čte někdo jiný — on nebo ona. Třetí osoba je vždy o někom, kdo není ani já, ani ty." },
  // Číslo
  { q: "Sloveso 'jdeme' je v čísle:", a: "Množném (my jdeme)", opts: ["Množném (my jdeme)", "Jednotném (já jdu)", "Středním", "Neurčitém"], e: "Slovo 'jdeme' říká, že jde víc lidí najednou — my všichni. Množné číslo vždy značí, že dělá víc než jeden člověk." },
  { q: "Sloveso 'jdu' je v čísle:", a: "Jednotné (já jdu)", opts: ["Jednotné (já jdu)", "Množné (my jdeme)", "Střední", "Neurčité"], e: "Slovo 'jdu' říká, že jde jen jedna osoba — já sám. Jednotné číslo poznáš tak, že děj dělá vždy jen jeden člověk." },
  { q: "Ve větě 'Děti si hrají venku.' — Čas slovesa 'hrají'?", a: "Přítomný", opts: ["Přítomný", "Minulý", "Budoucí", "Neurčitý"], e: "Sloveso 'hrají' říká, že hraní se děje právě teď. Není tam žádné 'bude' ani 'hráli', takže víme, že je to přítomný čas." },
  { q: "Ve větě 'Učila jsem se celý večer.' — Osoba?", a: "1. osoba, číslo jednotné (já)", opts: ["1. osoba, číslo jednotné (já)", "2. osoba (ty)", "3. osoba (ona)", "1. osoba množné"], e: "Slovíčko 'jsem' nám prozrazuje, kdo mluví — mluví o sobě, tedy je to já. Jedna osoba = jednotné číslo, mluvčí = 1. osoba." },
  { q: "Jak tvoříme přítomný čas od 'číst'?", a: "čtu, čteš, čte, čteme, čtete, čtou", opts: ["čtu, čteš, čte, čteme, čtete, čtou", "čil, čila, číst, čtěme", "jsem číst, jsi číst, je číst", "budu číst, budeš číst"], e: "Přítomný čas tvoříme tak, že ke kořenu slova přidáváme různé koncovky: -u, -eš, -e, -eme, -ete, -ou. Tímto způsobem vyjádříme, kdo čte právě teď." },
  { q: "Sloveso 'přišli' — číslo?", a: "Množné (oni přišli)", opts: ["Množné (oni přišli)", "Jednotné (on přišel)", "Střední", "Neurčité"], e: "Tvar 'přišli' říká, že přišlo více lidí — oni. Množné číslo poznáš, protože jde o víc osob najednou. Jeden člověk by 'přišel'." },
  { q: "Věta: 'Budu studovat na vysoké škole.' — Čas?", a: "Budoucí", opts: ["Budoucí", "Přítomný", "Minulý", "Neurčitý"], e: "Slovíčko 'budu' nám hned říká, že studování ještě nezačalo — teprve přijde. Kdykoli vidíš 'budu, budeš, bude…', jde o budoucí čas." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 9) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Čas: bylo = minulý, je/jsou = přítomný, bude = budoucí.", "Osoba: já = 1., ty = 2., on/ona = 3. Číslo: já/ty/on = jednotné; my/vy/oni = množné."],
    explanation: e,
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
