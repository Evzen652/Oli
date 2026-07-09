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
 * Před: L1 = POOL[0..8], L2 = L3 = celý POOL → getTierTasks L3 vyprazdňoval.
 * Teď disjunktní: L1 (identifikace typu), L2 (pravidla — čárka, spojka, výčet),
 * L3 (aplikace — analýza konkrétních vět, více spojek).
 */

type Item = { q: string; a: string; opts: string[]; e: string };

const POOL_L1: Item[] = [
  // Identifikace typu (jednoduchá vs souvětí)
  { q: "'Pes štěká.' — Je to věta jednoduchá nebo souvětí?", a: "Věta jednoduchá (jedno sloveso)", opts: ["Věta jednoduchá (jedno sloveso)", "Souvětí", "Ani jedno", "Souvětí o dvou větách"], e: "'Štěká' = 1 sloveso → věta jednoduchá." },
  { q: "'Pes štěká a kočka mňouká.' — Je to věta jednoduchá nebo souvětí?", a: "Souvětí (dvě věty spojené spojkou)", opts: ["Souvětí (dvě věty spojené spojkou)", "Věta jednoduchá", "Jeden výraz", "Tři věty"], e: "'Štěká' + 'mňouká' = 2 slovesa spojená 'a' → souvětí." },
  { q: "Kolik vět je v souvětí: 'Šel jsem do školy, ale zapomněl jsem sešit.'?", a: "Dvě věty", opts: ["Dvě věty", "Jedna věta", "Tři věty", "Čtyři věty"], e: "2 slovesa ('šel jsem', 'zapomněl jsem') → 2 věty." },
  { q: "Jak poznáme souvětí?", a: "Má více sloves (více dějů) a spojku", opts: ["Má více sloves (více dějů) a spojku", "Má více podstatných jmen", "Má více přídavných jmen", "Je delší než 5 slov"], e: "Souvětí = 2+ sloves + spojka." },
  { q: "Kolik sloves je ve větě jednoduché?", a: "Jedno (jeden děj)", opts: ["Jedno (jeden děj)", "Dvě", "Tři", "Žádné"], e: "Věta jednoduchá = 1 sloveso." },
  { q: "'Slunce svítí.' je:", a: "Věta jednoduchá", opts: ["Věta jednoduchá", "Souvětí", "Nelze určit", "Souvětí o třech větách"], e: "1 sloveso 'svítí' → věta jednoduchá." },
  { q: "'Matka vaří a otec čte.' je:", a: "Souvětí", opts: ["Souvětí", "Věta jednoduchá", "Výčet", "Nelze určit"], e: "2 slovesa spojená 'a' → souvětí." },
  { q: "'Prší.' je:", a: "Věta jednoduchá", opts: ["Věta jednoduchá", "Souvětí", "Nelze určit", "Slovo"], e: "1 sloveso → věta jednoduchá (i když má jen jedno slovo)." },
];

const POOL_L2: Item[] = [
  // Pravidla — spojky, čárka, výčet
  { q: "Věta: 'Přišel jsem domů a umyl si ruce.' Najdi spojku:", a: "a", opts: ["a", "jsem", "domů", "si"], e: "'A' spojuje 2 věty. 'Jsem', 'domů', 'si' spojkami nejsou." },
  { q: "Které souvětí je správně zapsané?", a: "Šel jsem ven, protože bylo hezky.", opts: ["Šel jsem ven, protože bylo hezky.", "Šel jsem ven. Protože bylo hezky.", "Šel jsem ven protože bylo hezky", "Šel jsem ven ale protože bylo hezky."], e: "Před spojkou 'protože' píšeme čárku." },
  { q: "Jak se zapisuje souvětí?", a: "Věty oddělujeme čárkou před spojkou (ale, protože, když…)", opts: ["Věty oddělujeme čárkou před spojkou (ale, protože, když…)", "Věty oddělujeme tečkou", "Věty píšeme bez čárky", "Každou větu na nový řádek"], e: "Čárka před spojkou. Tečka věty rozdělí na samostatné." },
  { q: "Věta: 'Koupili jsme chleba, máslo a sýr.' je:", a: "Věta jednoduchá (výčet, ne souvětí)", opts: ["Věta jednoduchá (výčet, ne souvětí)", "Souvětí o třech větách", "Souvětí o dvou větách", "Nelze určit"], e: "Jen 1 sloveso 'koupili', ostatní jsou předměty ve výčtu." },
  { q: "Věta 'Velký hnědý medvěd spí v jeskyni.' je:", a: "Věta jednoduchá (jedno sloveso: spí)", opts: ["Věta jednoduchá (jedno sloveso: spí)", "Souvětí", "Tři věty", "Nelze určit"], e: "Dlouhá věta, ale 1 sloveso 'spí' → jednoduchá." },
  { q: "Které souvětí má správně čárku?", a: "Prší, ale nevzali jsme deštník.", opts: ["Prší, ale nevzali jsme deštník.", "Prší ale nevzali jsme deštník.", "Prší. Ale nevzali jsme deštník.", "Prší; ale nevzali jsme deštník."], e: "Před spojkou 'ale' patří čárka." },
  { q: "Ve větě 'Bratr a sestra spí' je:", a: "Věta jednoduchá (1 sloveso)", opts: ["Věta jednoduchá (1 sloveso)", "Souvětí (spojka a)", "Nelze určit", "Věta rozvitá souvětím"], e: "'A' spojuje 2 podměty, ne 2 věty. Sloveso je jen 1 ('spí') → jednoduchá." },
  { q: "Která z těchto vět je JEDNODUCHÁ?", a: "Malý pes spí na koberci.", opts: ["Malý pes spí na koberci.", "Pes spí a kočka mňouká.", "Když prší, zůstaneme doma.", "Šel jsem ven, protože svítilo slunce."], e: "První má 1 sloveso 'spí' → jednoduchá. Ostatní mají 2 slovesa → souvětí." },
];

const POOL_L3: Item[] = [
  // Aplikace — analýza složitějších vět
  { q: "Věta: 'Když prší, zůstaneme doma.' — Kolik vět?", a: "Dvě (souvětí)", opts: ["Dvě (souvětí)", "Jedna", "Tři", "Čtyři"], e: "Slovesa 'prší' + 'zůstaneme' → 2 věty spojené 'když'." },
  { q: "Kolik vět je v souvětí: 'Chtěl jsem jít ven, ale pršelo, a proto jsem zůstal doma.'?", a: "Tři věty", opts: ["Tři věty", "Dvě věty", "Čtyři věty", "Jedna věta"], e: "3 slovesa: 'chtěl jsem', 'pršelo', 'zůstal jsem' → 3 věty." },
  { q: "Které souvětí je zapsáno SPRÁVNĚ?", a: "Když skončí škola, půjdeme na hřiště.", opts: ["Když skončí škola, půjdeme na hřiště.", "Když skončí škola půjdeme na hřiště.", "Když skončí. Škola půjdeme na hřiště.", "Když skončí škola. Půjdeme na hřiště."], e: "Před 'když' na začátku věty nepíšeme čárku, ale mezi 2 větami souvětí ANO." },
  { q: "Věta: 'Petr četl knihu, ale usnul u ní.' — Určíme spojku:", a: "ale", opts: ["ale", "u", "ní", "knihu"], e: "'Ale' je spojka mezi 'Petr četl' a 'usnul'." },
  { q: "Kolik vět má souvětí: 'Když jsem se probudil, snídal jsem a šel jsem do školy.'?", a: "Tři věty", opts: ["Tři věty", "Dvě věty", "Čtyři věty", "Jedna věta"], e: "3 slovesa: 'probudil jsem se', 'snídal jsem', 'šel jsem' → 3 věty." },
  { q: "Věta: 'Anna si čte a Bára píše úkol.' Jaký typ vět je toto?", a: "Souvětí ze 2 vět jednoduchých", opts: ["Souvětí ze 2 vět jednoduchých", "Věta jednoduchá s výčtem", "Souvětí ze 3 vět", "Věta jednoduchá s podmětem 'Anna a Bára'"], e: "Dvě různá slovesa a dva různé podměty → 2 věty spojené 'a'." },
  { q: "Která věta je nejsložitější (nejvíc vět)?", a: "Napsal jsem úkol, potom jsem si četl a nakonec jsem šel spát.", opts: ["Napsal jsem úkol, potom jsem si četl a nakonec jsem šel spát.", "Napsal jsem úkol a šel spát.", "Šel jsem spát.", "Napsal jsem úkol."], e: "První má 3 slovesa → souvětí ze 3 vět. Druhá 2, čtvrtá 1, třetí 1." },
  { q: "Kolik čárek má správně souvětí 'Přišel Petr a Anna zpívala a Bára tancovala'?", a: "Dvě čárky (před oběma 'a')", opts: ["Dvě čárky (před oběma 'a')", "Žádnou čárku", "Jednu čárku (jen před 2. 'a')", "Tři čárky"], e: "3 věty → čárky před 2. a 3. spojkou 'a'. (Poznámka: čárka před 'a' se v tomto typu souvětí PÍŠE, když spojuje 2 věty.)" },
  { q: "Ve větě 'Když prší, vezmeme si deštníky a půjdeme.' je:", a: "Souvětí ze 3 vět", opts: ["Souvětí ze 3 vět", "Souvětí ze 2 vět", "Věta jednoduchá s výčtem", "Věta jednoduchá"], e: "3 slovesa: 'prší', 'vezmeme si', 'půjdeme' → 3 věty souvětí." },
  { q: "Věta: 'Slyšel jsem hudbu, protože zpívali ptáci.' — jaká je hlavní věta?", a: "Slyšel jsem hudbu", opts: ["Slyšel jsem hudbu", "protože zpívali ptáci", "zpívali ptáci", "hudbu"], e: "Hlavní věta má hlavní myšlenku. Věta se spojkou 'protože' vysvětluje důvod (vedlejší věta)." },
];

function pick(pool: Item[]): PracticeTask[] {
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: [
      "Věta jednoduchá = jeden děj (jedno sloveso).",
      "Souvětí = více dějů (více sloves) spojených spojkou.",
    ],
    explanation: e,
  }));
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return pick(pool);
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
