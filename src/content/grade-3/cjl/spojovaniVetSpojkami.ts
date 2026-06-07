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
  { q: "Vyber správnou spojku: 'Šel jsem ven, ___ pršelo.'", a: "ale", opts: ["ale", "a", "nebo", "proto"], e: "Spojka 'ale' vyjadřuje protiklad — šel ven, přestože pršelo, to jsou dvě věci, které si odporují. Spojka 'a' by znamenala, že obě věci jdou přirozeně dohromady." },
  { q: "Vyber správnou spojku: 'Chceš čaj ___ kávu?'", a: "nebo", opts: ["nebo", "ale", "protože", "když"], e: "Spojka 'nebo' nám dává na výběr mezi dvěma možnostmi — buď čaj, nebo kávu. Ostatní spojky by tu nedávaly smysl, protože tu nejde o protiklad ani příčinu." },
  { q: "Vyber správnou spojku: 'Hráli jsme si ___ učili se.'", a: "a", opts: ["a", "ale", "nebo", "aby"], e: "Spojka 'a' přidává další informaci — dělali dvě věci za sebou nebo najednou. Spojka 'ale' by naznačovala, že je to divné nebo nečekané, ale hrát si a učit se není protiklad." },
  { q: "Vyber správnou spojku: 'Nezaspal jsem, ___ jsem vstával časně.'", a: "protože", opts: ["protože", "ale", "nebo", "a"], e: "Spojka 'protože' vysvětluje příčinu — proč jsem nezaspal? Protože jsem vstával časně. Vždy ji použij, když chceš vysvětlit PROČ se něco stalo." },
  { q: "Vyber správnou spojku: '___ přijde tatínek, pojdeme na výlet.'", a: "Když", opts: ["Když", "Ale", "Nebo", "Proto"], e: "Spojka 'když' vyjadřuje podmínku nebo čas — výlet se stane tehdy, jestliže přijde tatínek. Říká nám, za jaké situace se něco stane." },
  { q: "Vyber správnou spojku: 'Chci ___ ses naučil číst.'", a: "aby", opts: ["aby", "protože", "nebo", "ale"], e: "Spojka 'aby' vyjadřuje přání nebo cíl — chci, aby se to stalo. Říká nám, co si někdo přeje nebo k čemu něco slouží." },
  { q: "Jakou spojkou spojíme věty: 'Bylo horko. Šli jsme se koupat.'", a: "a (Bylo horko, a šli jsme se koupat.)", opts: ["a (Bylo horko, a šli jsme se koupat.)", "ale", "nebo", "aby"], e: "Spojka 'a' tu přidává druhé děje — jedno přirozeně navazuje na druhé. Spojka 'ale' by znamenala protiklad, ale koupat se v horku je přirozené, ne překvapivé." },
  { q: "Vyber správnou spojku: 'Nedošel jsem, ___ jsem se ztratil.'", a: "protože", opts: ["protože", "a", "nebo", "aby"], e: "Spojka 'protože' vysvětluje důvod — proč jsem nedošel? Protože jsem se ztratil. Vždy si polož otázku 'proč?' a pokud odpovíš druhou větou, potřebuješ 'protože'." },
  { q: "Co je 'ale' ve větě?", a: "Spojka (spojuje věty s protikladem)", opts: ["Spojka (spojuje věty s protikladem)", "Příslovce", "Podstatné jméno", "Přídavné jméno"], e: "Slovo 'ale' je spojka — slouží ke spojování vět. Navíc vyjadřuje protiklad, tedy že druhá věta říká něco nečekaného nebo opačného k první větě." },
  { q: "Které slovo je spojka?", a: "nebo", opts: ["nebo", "velký", "běžet", "rychle"], e: "Slovo 'nebo' je spojka, protože slouží ke spojování dvou věcí nebo vět a vyjadřuje výběr. Slovo 'velký' je přídavné jméno, 'běžet' je sloveso a 'rychle' je příslovce." },
  { q: "Věta: 'Přišel domů ___ hned šel spát.' — doplň spojku:", a: "a", opts: ["a", "ale", "nebo", "aby"], e: "Spojka 'a' tu přidává druhý děj, který přirozeně navazuje — přišel a pak šel spát. Není tu žádný protiklad ani výběr, jen popis dvou věcí za sebou." },
  { q: "Spojka 'protože' vyjadřuje:", a: "Příčinu (proč se něco stalo)", opts: ["Příčinu (proč se něco stalo)", "Protiklad", "Výběr", "Podmínku"], e: "Spojka 'protože' vždy vysvětluje příčinu — říká nám, PROČ se něco stalo nebo proč je něco tak, jak je. Zkus si říct otázku 'proč?' — pokud ji umíš odpovědět druhou větou, použij 'protože'." },
  { q: "Spojka 'nebo' vyjadřuje:", a: "Výběr mezi dvěma možnostmi", opts: ["Výběr mezi dvěma možnostmi", "Protiklad", "Příčinu", "Podmínku"], e: "Spojka 'nebo' nám vždy nabízí výběr — buď jedno, nebo druhé. Například 'Dáš si jablko nebo hrušku?' — musíš si vybrat jednu možnost." },
  { q: "Věta: 'Chtěla hrát, ___ musela učit.' — doplň:", a: "ale", opts: ["ale", "a", "nebo", "protože"], e: "Spojka 'ale' tu vyjadřuje protiklad — chtěla hrát, ale realita byla jiná (musela učit). Když jedna věc jde proti druhé nebo je nečekaná, použijeme 'ale'." },
  { q: "Spojka 'když' vyjadřuje:", a: "Čas nebo podmínku", opts: ["Čas nebo podmínku", "Protiklad", "Příčinu", "Výběr"], e: "Spojka 'když' říká, za jakých okolností nebo kdy se něco stane — například 'Když zaprší, vezmeme deštník.' Může vyjadřovat čas (tehdy, kdy) nebo podmínku (za té situace, že)." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 10) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Spojky spojují věty nebo části věty dohromady.", "a = přidávám, ale = protiklad, nebo = výběr, protože = příčina, když = čas/podmínka."],
    explanation: e,
  }));
}

export const SPOJOVANIVETSPOJKAMI: TopicMetadata[] = [
  {
    id: "g3-cjl-spojovani-vet-spojkami",
    rvpNodeId: "g3-cjl-jazykova-vychova-skladba-spojovani-vet-spojkami-a-spojovacimi-vyrazy",
    title: "Spojování vět spojkami a spojovacími výrazy",
    studentTitle: "Spojky ve větách",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Naučíš se spojovat věty pomocí správných spojek.",
    keywords: ["spojka", "a", "ale", "nebo", "protože", "když", "aby", "souvětí"],
    goals: ["Rozpoznat spojku ve větě.", "Vybrat správnou spojku pro spojení vět.", "Pochopit, co různé spojky vyjadřují."],
    boundaries: ["Základní spojky: a, ale, nebo, protože, když, aby."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Spojky: a (přidávám), ale (protiklad), nebo (výběr), protože (příčina), když (čas/podmínka).",
      steps: ["Přečti obě věty.", "Co je mezi nimi za vztah? (protiklad, příčina, výběr…)", "Vyber odpovídající spojku."],
      commonMistake: "'Šel ven, ale pršelo.' (protiklad) vs 'Šel ven, protože bylo hezky.' (příčina).",
      example: "Bylo teplo, a proto jsme šli plavat. → 'a proto' = příčina/důsledek.",
    },
  },
];
