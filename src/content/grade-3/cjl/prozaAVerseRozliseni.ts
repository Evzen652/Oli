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
  { q: "Co je próza?", a: "Text psaný v odstavcích a větách (ne ve verších)", opts: ["Text psaný v odstavcích a větách (ne ve verších)", "Text psaný v krátkých řádcích s rýmy", "Popis přírody", "Divadelní hra"], e: "Próza vypadá jako normální text — věty jdou za sebou a jsou seskupeny do odstavců. Takto jsou napsány pohádky, příběhy nebo třeba dopisy." },
  { q: "Co jsou verše?", a: "Krátké řádky v básni, které mají rytmus", opts: ["Krátké řádky v básni, které mají rytmus", "Odstavce v próze", "Věty v povídce", "Části pohádky"], e: "Verše jsou krátké řádky, ze kterých se skládá báseň. Každý verš začíná na novém řádku a při čtení cítíš rytmus, jako by sis básničku ťukal/a prstem." },
  { q: "Jak poznáme báseň (verše)?", a: "Krátké řádky, rýmy na konci, rytmus při čtení", opts: ["Krátké řádky, rýmy na konci, rytmus při čtení", "Dlouhé odstavce", "Dialogy postav", "Nadpis a obsah"], e: "Báseň poznáš snadno — řádky jsou krátké, slova na konci řádků se rýmují (například 'pes–les') a při čtení cítíš pravidelný rytmus." },
  { q: "Jak poznáme prózu?", a: "Dlouhé věty a odstavce, jako v příběhu nebo pohádce", opts: ["Dlouhé věty a odstavce, jako v příběhu nebo pohádce", "Krátké řádky s rýmy", "Jen přímá řeč", "Jen popis"], e: "Próza vypadá jako příběh — věty jsou dlouhé a navazují na sebe, text se skládá do odstavců. Žádné rýmy ani krátké řádky." },
  { q: "Pohádka je napsána v:", a: "Próze (odstavce a věty)", opts: ["Próze (odstavce a věty)", "Verších (básni)", "Dialogu", "Odrážkách"], e: "Pohádky jsou psány prózou, protože vypravují příběh v normálních větách a odstavcích — například 'Bylo jednou jedno malé kotě...'. Verše by pohádka měla jen tehdy, kdyby byla říkanka." },
  { q: "Báseň 'Skákal pes přes oves...' je napsána:", a: "Ve verších (báseň)", opts: ["Ve verších (báseň)", "V próze", "V dialogu", "V odstavcích"], e: "'Skákal pes přes oves' je říkanka — text se skládá z krátkých řádků, slova se rýmují a při čtení cítíš rytmus. To jsou přesné znaky veršů." },
  { q: "Co je strofa?", a: "Skupina veršů v básni (jako odstavec v próze)", opts: ["Skupina veršů v básni (jako odstavec v próze)", "Rým na konci verše", "Celá báseň", "Jeden verš"], e: "Strofa je skupina několika veršů, které k sobě patří — jsou odděleny mezerou od další skupiny. Je to stejné jako odstavec v próze, jen pro básně." },
  { q: "Příklad prózy je:", a: "Pohádka, povídka, román", opts: ["Pohádka, povídka, román", "Báseň, říkanka, sonet", "Rým, rytmus, verš", "Strofa, rýmové schéma"], e: "Pohádka, povídka i román jsou příběhy psané normálními větami a odstavci — to je próza. Básně, říkanky a sonety jsou naopak psány ve verších." },
  { q: "Příklad veršů (básně) je:", a: "Říkanka, sonet, haiku", opts: ["Říkanka, sonet, haiku", "Pohádka, povídka", "Popis, omluvenka", "Dialog, dopis"], e: "Říkanka, sonet i haiku jsou různé druhy básní — všechny jsou psané ve verších s rytmem. Pohádky nebo dopisy jsou naopak próza." },
  { q: "Jak se odlišuje zápis básně od prózy?", a: "Báseň: každý verš na novém řádku. Próza: věty za sebou.", opts: ["Báseň: každý verš na novém řádku. Próza: věty za sebou.", "Žádný rozdíl v zápisu", "Próza má nadpis, báseň ne", "Báseň má tečky, próza ne"], e: "Zápis ti napoví hned na první pohled — v básni každý řádek (verš) začíná znovu, kdežto v próze věty jdou za sebou a zalomí se až na konci řádku." },
  { q: "Ukázka: 'Padá listí ze stromů, / zima buší do domů.' Je to:", a: "Báseň (verše, rým: stromů/domů)", opts: ["Báseň (verše, rým: stromů/domů)", "Próza", "Dialog", "Popis"], e: "Tato ukázka je báseň — řádky jsou krátké a slova 'stromů' a 'domů' se rýmují (obě končí na '-omů'). To jsou jasné znaky veršů." },
  { q: "Ukázka: 'Bylo jednou jedno malé kotě. Bydlelo v chaloupce na kraji lesa.' Je to:", a: "Próza (věty, odstavce)", opts: ["Próza (věty, odstavce)", "Báseň", "Dialog", "Verš"], e: "Tato ukázka je próza — jsou to normální věty, které na sebe navazují a vypravují příběh. Žádné rýmy, žádné krátké řádky." },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Verše = krátké řádky s rytmem a rýmy. Próza = normální věty a odstavce.", "Báseň → verše → krátké řádky. Pohádka/příběh → próza → odstavce."],
    explanation: e,
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
