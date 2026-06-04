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
  { q: "Vyber správnou spojku: 'Šel jsem ven, ___ pršelo.'", a: "ale", opts: ["ale", "a", "nebo", "proto"] },
  { q: "Vyber správnou spojku: 'Chceš čaj ___ kávu?'", a: "nebo", opts: ["nebo", "ale", "protože", "když"] },
  { q: "Vyber správnou spojku: 'Hráli jsme si ___ učili se.'", a: "a", opts: ["a", "ale", "nebo", "aby"] },
  { q: "Vyber správnou spojku: 'Nezaspal jsem, ___ jsem vstával časně.'", a: "protože", opts: ["protože", "ale", "nebo", "a"] },
  { q: "Vyber správnou spojku: '___ přijde tatínek, pojdeme na výlet.'", a: "Když", opts: ["Když", "Ale", "Nebo", "Proto"] },
  { q: "Vyber správnou spojku: 'Chci ___ ses naučil číst.'", a: "aby", opts: ["aby", "protože", "nebo", "ale"] },
  { q: "Jakou spojkou spojíme věty: 'Bylo horko. Šli jsme se koupat.'", a: "a (Bylo horko, a šli jsme se koupat.)", opts: ["a (Bylo horko, a šli jsme se koupat.)", "ale", "nebo", "aby"] },
  { q: "Vyber správnou spojku: 'Nedošel jsem, ___ jsem se ztratil.'", a: "protože", opts: ["protože", "a", "nebo", "aby"] },
  { q: "Co je 'ale' ve větě?", a: "Spojka (spojuje věty s protikladem)", opts: ["Spojka (spojuje věty s protikladem)", "Příslovce", "Podstatné jméno", "Přídavné jméno"] },
  { q: "Které slovo je spojka?", a: "nebo", opts: ["nebo", "velký", "běžet", "rychle"] },
  { q: "Věta: 'Přišel domů ___ hned šel spát.' — doplň spojku:", a: "a", opts: ["a", "ale", "nebo", "aby"] },
  { q: "Spojka 'protože' vyjadřuje:", a: "Příčinu (proč se něco stalo)", opts: ["Příčinu (proč se něco stalo)", "Protiklad", "Výběr", "Podmínku"] },
  { q: "Spojka 'nebo' vyjadřuje:", a: "Výběr mezi dvěma možnostmi", opts: ["Výběr mezi dvěma možnostmi", "Protiklad", "Příčinu", "Podmínku"] },
  { q: "Věta: 'Chtěla hrát, ___ musela učit.' — doplň:", a: "ale", opts: ["ale", "a", "nebo", "protože"] },
  { q: "Spojka 'když' vyjadřuje:", a: "Čas nebo podmínku", opts: ["Čas nebo podmínku", "Protiklad", "Příčinu", "Výběr"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 10) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Spojky spojují věty nebo části věty dohromady.", "a = přidávám, ale = protiklad, nebo = výběr, protože = příčina, když = čas/podmínka."],
    solutionSteps: ["Co chci vyjádřit? (protiklad / příčinu / výběr / podmínku)", `Správná spojka: ${a}`],
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
