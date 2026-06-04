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
  { q: "Co je próza?", a: "Text psaný v odstavcích a větách (ne ve verších)", opts: ["Text psaný v odstavcích a větách (ne ve verších)", "Text psaný v krátkých řádcích s rýmy", "Popis přírody", "Divadelní hra"] },
  { q: "Co jsou verše?", a: "Krátké řádky v básni, které mají rytmus", opts: ["Krátké řádky v básni, které mají rytmus", "Odstavce v próze", "Věty v povídce", "Části pohádky"] },
  { q: "Jak poznáme báseň (verše)?", a: "Krátké řádky, rýmy na konci, rytmus při čtení", opts: ["Krátké řádky, rýmy na konci, rytmus při čtení", "Dlouhé odstavce", "Dialogy postav", "Nadpis a obsah"] },
  { q: "Jak poznáme prózu?", a: "Dlouhé věty a odstavce, jako v příběhu nebo pohádce", opts: ["Dlouhé věty a odstavce, jako v příběhu nebo pohádce", "Krátké řádky s rýmy", "Jen přímá řeč", "Jen popis"] },
  { q: "Pohádka je napsána v:", a: "Próze (odstavce a věty)", opts: ["Próze (odstavce a věty)", "Verších (básni)", "Dialogu", "Odrážkách"] },
  { q: "Báseň 'Skákal pes přes oves...' je napsána:", a: "Ve verších (báseň)", opts: ["Ve verších (báseň)", "V próze", "V dialogu", "V odstavcích"] },
  { q: "Co je strofa?", a: "Skupina veršů v básni (jako odstavec v próze)", opts: ["Skupina veršů v básni (jako odstavec v próze)", "Rým na konci verše", "Celá báseň", "Jeden verš"] },
  { q: "Příklad prózy je:", a: "Pohádka, povídka, román", opts: ["Pohádka, povídka, román", "Báseň, říkanka, sonet", "Rým, rytmus, verš", "Strofa, rýmové schéma"] },
  { q: "Příklad veršů (básně) je:", a: "Říkanka, sonet, haiku", opts: ["Říkanka, sonet, haiku", "Pohádka, povídka", "Popis, omluvenka", "Dialog, dopis"] },
  { q: "Jak se odlišuje zápis básně od prózy?", a: "Báseň: každý verš na novém řádku. Próza: věty za sebou.", opts: ["Báseň: každý verš na novém řádku. Próza: věty za sebou.", "Žádný rozdíl v zápisu", "Próza má nadpis, báseň ne", "Báseň má tečky, próza ne"] },
  { q: "Ukázka: 'Padá listí ze stromů, / zima buší do domů.' Je to:", a: "Báseň (verše, rým: stromů/domů)", opts: ["Báseň (verše, rým: stromů/domů)", "Próza", "Dialog", "Popis"] },
  { q: "Ukázka: 'Bylo jednou jedno malé kotě. Bydlelo v chaloupce na kraji lesa.' Je to:", a: "Próza (věty, odstavce)", opts: ["Próza (věty, odstavce)", "Báseň", "Dialog", "Verš"] },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Verše = krátké řádky s rytmem a rýmy. Próza = normální věty a odstavce.", "Báseň → verše → krátké řádky. Pohádka/příběh → próza → odstavce."],
    solutionSteps: [`Odpověď: ${a}`],
  }));
}

export const PROZAVERSE: TopicMetadata[] = [
  {
    id: "g3-cjl-proza-verse",
    rvpNodeId: "g3-cjl-literarni-vychova-literarni-druhy-a-zanry-proza-a-verse-rozliseni",
    title: "Próza a verše - rozlišení",
    studentTitle: "Próza nebo báseň?",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární druhy a žánry",
    briefDescription: "Poznáš rozdíl mezi prózou a básní psanou ve verších.",
    keywords: ["próza", "verše", "báseň", "strofa", "rým", "rytmus", "odstavec"],
    goals: ["Rozlišit prózu a verše.", "Popsat znaky básně (krátké řádky, rým, rytmus).", "Popsat znaky prózy (věty, odstavce)."],
    boundaries: ["Základní rozlišení bez metriky."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Próza = příběh v odstavcích. Verše = báseň ve krátkých řádcích s rýmem.",
      steps: ["Podívej se, jak je text zapsán.", "Krátké řádky s rýmy → verše/báseň.", "Normální věty v odstavcích → próza."],
      commonMistake: "Říkanka se zdá krátká a jednoduchá — ale je to báseň (verše), ne próza.",
      example: "Próza: 'Bylo jednou malé kotě...' / Verše: 'Skákal pes / přes oves / přes zelenou louku...'",
    },
  },
];
