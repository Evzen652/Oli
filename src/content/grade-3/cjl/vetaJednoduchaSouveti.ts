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
  { q: "'Pes štěká.' — Je to věta jednoduchá nebo souvětí?", a: "Věta jednoduchá (jedno sloveso)", opts: ["Věta jednoduchá (jedno sloveso)", "Souvětí", "Ani jedno", "Souvětí o dvou větách"] },
  { q: "'Pes štěká a kočka mňouká.' — Je to věta jednoduchá nebo souvětí?", a: "Souvětí (dvě věty spojené spojkou)", opts: ["Souvětí (dvě věty spojené spojkou)", "Věta jednoduchá", "Jeden výraz", "Tři věty"] },
  { q: "Kolik vět je v souvětí: 'Šel jsem do školy, ale zapomněl jsem sešit.'?", a: "Dvě věty", opts: ["Dvě věty", "Jedna věta", "Tři věty", "Čtyři věty"] },
  { q: "Jak poznáme souvětí?", a: "Má více sloves (více dějů) a spojku", opts: ["Má více sloves (více dějů) a spojku", "Má více podstatných jmen", "Má více přídavných jmen", "Je delší než 5 slov"] },
  { q: "Která z vět je souvětí?", a: "Jana čte knihu a Petr hraje hru.", opts: ["Jana čte knihu a Petr hraje hru.", "Jana čte knihu.", "Velká červená kniha leží na stole.", "Rychlý pes utíká po ulici."] },
  { q: "Věta: 'Přišel jsem domů a umyl si ruce.' Najdi spojku:", a: "a", opts: ["a", "jsem", "domů", "si"] },
  { q: "Kolik sloves je ve větě jednoduché?", a: "Jedno (jeden děj)", opts: ["Jedno (jeden děj)", "Dvě", "Tři", "Žádné"] },
  { q: "Věta: 'Když prší, zůstaneme doma.' — Kolik vět?", a: "Dvě (souvětí)", opts: ["Dvě (souvětí)", "Jedna", "Tři", "Čtyři"] },
  { q: "Které souvětí je správně zapsané?", a: "Šel jsem ven, protože bylo hezky.", opts: ["Šel jsem ven, protože bylo hezky.", "Šel jsem ven. Protože bylo hezky.", "Šel jsem ven protože bylo hezky", "Šel jsem ven ale protože bylo hezky."] },
  { q: "Věta 'Velký hnědý medvěd spí v jeskyni.' je:", a: "Věta jednoduchá (jedno sloveso: spí)", opts: ["Věta jednoduchá (jedno sloveso: spí)", "Souvětí", "Tři věty", "Nelze určit"] },
  { q: "Jak se zapisuje souvětí?", a: "Věty oddělujeme čárkou před spojkou (ale, protože, když…)", opts: ["Věty oddělujeme čárkou před spojkou (ale, protože, když…)", "Věty oddělujeme tečkou", "Věty píšeme bez čárky", "Každou větu na nový řádek"] },
  { q: "Věta: 'Koupili jsme chleba, máslo a sýr.' je:", a: "Věta jednoduchá (výčet, ne souvětí)", opts: ["Věta jednoduchá (výčet, ne souvětí)", "Souvětí o třech větách", "Souvětí o dvou větách", "Nelze určit"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 8) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Věta jednoduchá = jeden děj (jedno sloveso).", "Souvětí = více dějů (více sloves) spojených spojkou."],
    solutionSteps: ["Spočítám slovesa (děje) ve větě.", a.includes("jednoduchá") ? "Jedno sloveso → věta jednoduchá." : "Více sloves → souvětí."],
  }));
}

export const VETAJJEDNODUCHASONVETI: TopicMetadata[] = [
  {
    id: "g3-cjl-veta-jednoducha-souveti",
    rvpNodeId: "g3-cjl-jazykova-vychova-skladba-veta-jednoducha-a-souveti-uvod",
    title: "Věta jednoduchá a souvětí (úvod)",
    studentTitle: "Věta a souvětí",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Poznáš rozdíl mezi větou jednoduchou a souvětím.",
    keywords: ["věta jednoduchá", "souvětí", "spojka", "sloveso", "děj"],
    goals: ["Rozlišit větu jednoduchou a souvětí.", "Spočítat věty v souvětí.", "Najít spojku spojující věty."],
    boundaries: ["Základní souvětí se dvěma větami."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Věta jednoduchá = 1 sloveso. Souvětí = 2+ slovesa spojená spojkou (a, ale, nebo, protože, když…).",
      steps: ["Najdi všechna slovesa (děje) ve větě.", "Jedno sloveso → věta jednoduchá.", "Dvě a více sloves s spojkou → souvětí."],
      commonMistake: "Výčet ('chleba, máslo a sýr') není souvětí — je to jen jedno sloveso s více předměty.",
      example: "Jana čte. (jednoduchá) × Jana čte a Petr píše. (souvětí — dvě slovesa: čte, píše)",
    },
  },
];
