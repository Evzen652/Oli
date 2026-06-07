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
  { q: "'Pes štěká.' — Je to věta jednoduchá nebo souvětí?", a: "Věta jednoduchá (jedno sloveso)", opts: ["Věta jednoduchá (jedno sloveso)", "Souvětí", "Ani jedno", "Souvětí o dvou větách"], e: "Ve větě 'Pes štěká' je jen jedno sloveso — 'štěká'. Protože se stane jen jedna věc (jeden děj), je to věta jednoduchá." },
  { q: "'Pes štěká a kočka mňouká.' — Je to věta jednoduchá nebo souvětí?", a: "Souvětí (dvě věty spojené spojkou)", opts: ["Souvětí (dvě věty spojené spojkou)", "Věta jednoduchá", "Jeden výraz", "Tři věty"], e: "Tady jsou dvě slovesa — 'štěká' a 'mňouká' — a spojuje je spojka 'a'. To znamená, že máme dvě věty dohromady, tedy souvětí." },
  { q: "Kolik vět je v souvětí: 'Šel jsem do školy, ale zapomněl jsem sešit.'?", a: "Dvě věty", opts: ["Dvě věty", "Jedna věta", "Tři věty", "Čtyři věty"], e: "Najdeme dvě slovesa: 'šel jsem' a 'zapomněl jsem'. Každé sloveso patří k jedné větě, takže souvětí má dvě věty spojené spojkou 'ale'." },
  { q: "Jak poznáme souvětí?", a: "Má více sloves (více dějů) a spojku", opts: ["Má více sloves (více dějů) a spojku", "Má více podstatných jmen", "Má více přídavných jmen", "Je delší než 5 slov"], e: "Souvětí poznáme tak, že v něm najdeme víc než jedno sloveso (tedy víc dějů) a spojku, která věty drží pohromadě. Délka věty ani počet jmen nám to neřekne." },
  { q: "Která z vět je souvětí?", a: "Jana čte knihu a Petr hraje hru.", opts: ["Jana čte knihu a Petr hraje hru.", "Jana čte knihu.", "Velká červená kniha leží na stole.", "Rychlý pes utíká po ulici."], e: "Ve větě 'Jana čte knihu a Petr hraje hru' jsou dvě slovesa: 'čte' a 'hraje'. Jsou spojená spojkou 'a', takže jde o souvětí. Ostatní věty mají jen jedno sloveso." },
  { q: "Věta: 'Přišel jsem domů a umyl si ruce.' Najdi spojku:", a: "a", opts: ["a", "jsem", "domů", "si"], e: "Spojka je slovo, které spojuje dvě věty dohromady. Tady to slovo je 'a' — spojuje 'přišel jsem domů' a 'umyl si ruce'. Slova jako 'jsem', 'domů' nebo 'si' spojkami nejsou." },
  { q: "Kolik sloves je ve větě jednoduché?", a: "Jedno (jeden děj)", opts: ["Jedno (jeden děj)", "Dvě", "Tři", "Žádné"], e: "Věta jednoduchá má vždy jen jeden děj, tedy jedno sloveso. Jakmile jsou v souvětí dvě nebo více sloves, přestává být větou jednoduchou." },
  { q: "Věta: 'Když prší, zůstaneme doma.' — Kolik vět?", a: "Dvě (souvětí)", opts: ["Dvě (souvětí)", "Jedna", "Tři", "Čtyři"], e: "Najdeme slovesa 'prší' a 'zůstaneme' — to jsou dva děje. Věty spojuje slovo 'když'. Jde tedy o souvětí ze dvou vět." },
  { q: "Které souvětí je správně zapsané?", a: "Šel jsem ven, protože bylo hezky.", opts: ["Šel jsem ven, protože bylo hezky.", "Šel jsem ven. Protože bylo hezky.", "Šel jsem ven protože bylo hezky", "Šel jsem ven ale protože bylo hezky."], e: "V souvětí píšeme před spojkou (jako 'protože', 'ale', 'když') čárku. Věty v souvětí neoddělujeme tečkou — tečka by z nich udělala dvě samostatné věty." },
  { q: "Věta 'Velký hnědý medvěd spí v jeskyni.' je:", a: "Věta jednoduchá (jedno sloveso: spí)", opts: ["Věta jednoduchá (jedno sloveso: spí)", "Souvětí", "Tři věty", "Nelze určit"], e: "I když je věta dlouhá a má hodně slov, stane se v ní jen jedna věc: medvěd spí. Je tam jen jedno sloveso 'spí', takže jde o větu jednoduchou." },
  { q: "Jak se zapisuje souvětí?", a: "Věty oddělujeme čárkou před spojkou (ale, protože, když…)", opts: ["Věty oddělujeme čárkou před spojkou (ale, protože, když…)", "Věty oddělujeme tečkou", "Věty píšeme bez čárky", "Každou větu na nový řádek"], e: "Před spojkami jako 'ale', 'protože' nebo 'když' vždy píšeme čárku. Tečka by věty rozdělila na dvě samostatné, ale souvětí má být jedna promluva dohromady." },
  { q: "Věta: 'Koupili jsme chleba, máslo a sýr.' je:", a: "Věta jednoduchá (výčet, ne souvětí)", opts: ["Věta jednoduchá (výčet, ne souvětí)", "Souvětí o třech větách", "Souvětí o dvou větách", "Nelze určit"], e: "I když tu vidíme čárky a slovo 'a', jde jen o výčet věcí u jednoho slovesa 'koupili'. Děj je jen jeden, takže je to věta jednoduchá — ne souvětí." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 8) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Věta jednoduchá = jeden děj (jedno sloveso).", "Souvětí = více dějů (více sloves) spojených spojkou."],
    explanation: e,
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
