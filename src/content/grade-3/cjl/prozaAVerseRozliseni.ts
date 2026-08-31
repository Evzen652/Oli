import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string; hints?: string[] }

const POOL_L1: QA[] = [
  { q: "Co je próza?", a: "Text psaný v odstavcích a větách (ne ve verších)", opts: ["Text psaný v odstavcích a větách (ne ve verších)", "Text psaný v krátkých řádcích s rýmy", "Popis přírody", "Divadelní hra"], e: "Próza vypadá jako normální text — věty jdou za sebou a jsou seskupeny do odstavců. Takto jsou napsány pohádky, příběhy nebo třeba dopisy." },
  {
    q: "Co jsou verše?",
    a: "Krátké řádky s rytmem",
    opts: ["Části pohádky o zvířatech", "Krátké řádky s rytmem", "Věty v dlouhé povídce", "Odstavce v próze"],
    e: "Verše jsou krátké řádky, ze kterých se skládá báseň. Každý verš začíná na novém řádku a při čtení cítíš rytmus.",
    hints: [
      "Báseň se neskládá z odstavců ani vět jako povídka — skládá se z něčeho jiného.",
      "Každý takový úsek začíná na novém řádku a všechny dohromady dávají básni její pravidelný rytmus, který uslyšíš při čtení nahlas.",
    ],
  },
  { q: "Pohádka je napsána v:", a: "Próze (odstavce a věty)", opts: ["Próze (odstavce a věty)", "Verších (básni)", "Dialogu", "Odrážkách"], e: "Pohádky jsou psány prózou, protože vypravují příběh v normálních větách a odstavcích — například 'Bylo jednou jedno malé kotě...'." },
  { q: "Co je strofa?", a: "Skupina veršů v básni", opts: ["Celá báseň dohromady", "Skupina veršů v básni", "Jeden jediný verš", "Rým na konci verše"], e: "Strofa je skupina několika veršů, které k sobě patří — jsou odděleny mezerou od další skupiny. Je to stejné jako odstavec v próze, jen pro básně." },
  { q: "Příklad prózy je:", a: "Pohádka, povídka, román", opts: ["Pohádka, povídka, román", "Báseň, říkanka, sonet", "Rým, rytmus, verš", "Strofa, rýmové schéma"], e: "Pohádka, povídka i román jsou příběhy psané normálními větami a odstavci — to je próza. Básně, říkanky a sonety jsou naopak psány ve verších." },
  { q: "Příklad veršů (básně) je:", a: "Říkanka, sonet, haiku", opts: ["Říkanka, sonet, haiku", "Pohádka, povídka", "Popis, omluvenka", "Dialog, dopis"], e: "Říkanka, sonet i haiku jsou různé druhy básní — všechny jsou psané ve verších s rytmem. Pohádky nebo dopisy jsou naopak próza." },
  { q: "Báseň se skládá z:", a: "veršů, které tvoří strofy", opts: ["dialogů mezi postavami", "veršů, které tvoří strofy", "vět a odstavců", "kapitol a dílů"], e: "Báseň je poskládaná z veršů, tedy krátkých řádků, a skupiny veršů tvoří strofy. Věty a odstavce patří naopak k próze." },
  { q: "Próza se skládá z:", a: "vět, které tvoří odstavce", opts: ["veršů a rýmů na konci", "vět, které tvoří odstavce", "strof a slok", "jen samých nadpisů"], e: "Próza je poskládaná z vět, které se seskupují do odstavců. Verše, rýmy a strofy patří k básním, ne k próze." },
];

const POOL_L2: QA[] = [
  {
    q: "Jak poznáme báseň (verše)?",
    a: "Krátké řádky a rýmy",
    opts: ["Dialogy postav v textu", "Krátké řádky a rýmy", "Nadpis a obsah", "Dlouhé odstavce"],
    e: "Báseň poznáš snadno — řádky jsou krátké, slova na konci řádků se rýmují (například 'pes–les') a při čtení cítíš pravidelný rytmus.",
    hints: [
      "Všímej si délky řádků a toho, jestli se slova na jejich koncích rýmují.",
      "Když si text řekneš nahlas, uslyšíš pravidelné opakování přízvuků — a právě tomu se říká rytmus.",
    ],
  },
  { q: "Jak poznáme prózu?", a: "Dlouhé věty a odstavce", opts: ["Jen samá přímá řeč", "Dlouhé věty a odstavce", "Krátké řádky s rýmy", "Jen popis krajiny"], e: "Próza vypadá jako příběh — věty jsou dlouhé a navazují na sebe, text se skládá do odstavců. Žádné rýmy ani krátké řádky." },
  { q: "Báseň 'Skákal pes přes oves...' je napsána:", a: "Ve verších (báseň)", opts: ["Ve verších (báseň)", "V próze", "V dialogu", "V odstavcích"], e: "'Skákal pes přes oves' je říkanka — text se skládá z krátkých řádků, slova se rýmují a při čtení cítíš rytmus. To jsou přesné znaky veršů." },
  { q: "Jak se odlišuje zápis básně od prózy?", a: "Báseň má verše na řádcích", opts: ["Báseň má tečky, próza ne", "Báseň má verše na řádcích", "V zápisu není žádný rozdíl", "Próza má nadpis, báseň ne"], e: "Zápis ti napoví hned na první pohled — v básni každý řádek (verš) začíná znovu, kdežto v próze věty jdou za sebou a zalomí se až na konci řádku." },
  { q: "Ukázka: 'Padá listí ze stromů, / zima buší do domů.' Je to:", a: "Báseň", opts: ["Dialog", "Báseň", "Próza", "Popis"], e: "Tato ukázka je báseň — řádky jsou krátké a slova 'stromů' a 'domů' se rýmují (obě končí na '-omů'). To jsou jasné znaky veršů." },
  { q: "Ukázka: 'Bylo jednou jedno malé kotě. Bydlelo v chaloupce na kraji lesa.' Je to:", a: "Próza", opts: ["Dialog", "Próza", "Verš", "Báseň"], e: "Tato ukázka je próza — jsou to normální věty, které na sebe navazují a vypravují příběh. Žádné rýmy, žádné krátké řádky." },
  { q: "Ukázka: 'Šel jsem lesem, potkal jsem lišku. Utekla mi rychle pryč.' Je to:", a: "Próza", opts: ["Verš", "Próza", "Báseň", "Strofa"], e: "Věty jdou souvisle za sebou a nemají rým ani krátké verše — to jsou znaky prózy." },
  { q: "Ukázka: 'Slunce svítí, ptáci pějí, / celý den se s námi smějí.' Je to:", a: "Báseň", opts: ["Dopis", "Báseň", "Popis", "Próza"], e: "Text má krátké řádky a slova 'pějí' a 'smějí' se rýmují (obě končí na '-ějí') — to jsou verše, tedy báseň." },
];

const POOL_L3: QA[] = [
  { q: "Adresa na obálce je napsána v krátkých řádcích: 'Jana Nováková / Hlavní 12 / Praha'. Je to báseň?", a: "Ne — je to adresa, nemá rým ani rytmus, jen seznam údajů", opts: ["Ne — je to adresa, nemá rým ani rytmus, jen seznam údajů", "Ano, protože má krátké řádky", "Ano, protože nemá odstavec", "Ano, protože je to psáno na obálce"], e: "Krátké řádky samy o sobě báseň nedělají — musí mít i rým nebo rytmus. Adresa je jen seznam údajů pod sebou, ne verše." },
  {
    q: "Text A: 'Bylo jednou jedno kotě. Žilo v lese u potoka.' Text B: 'V lese žil kmotr liška, / vedle skákala myška.' Který text je psán ve verších?",
    a: "Text B (krátké řádky, rým liška–myška)",
    opts: ["Text B (krátké řádky, rým liška–myška)", "Text A (dlouhé věty)", "Oba texty jsou verše", "Ani jeden text není verše"],
    e: "Text B má krátké řádky a slova 'liška' a 'myška' se rýmují (obě končí na '-iška') — to jsou verše. Text A jsou souvislé věty bez rýmu, tedy próza.",
    hints: [
      "Podívej se, který text má na konci řádků slova, co se rýmují.",
      "Text napsaný ve verších nemá dlouhé souvislé věty jako vyprávění.",
    ],
  },
  { q: "Báseň má 12 veršů rozdělených po 3 verších do strof. Kolik strof báseň má?", a: "4 strofy", opts: ["4 strofy", "3 strofy", "12 strof", "6 strof"], e: "Když 12 veršů rozdělíme po třech, dostaneme 12 : 3 = 4 skupiny — tedy 4 strofy." },
  { q: "Pohádka je rozdělena na 3 odstavce. Je stále prózou?", a: "Ano — rozdělení na odstavce prózu nemění", opts: ["Ano — rozdělení na odstavce prózu nemění", "Ne — teď je to báseň", "Ne — teď je to seznam", "Ano, ale jen pokud má rým"], e: "Odstavce jsou přirozenou součástí prózy a jejich počet na tom nic nemění — pořád jde o věty seskupené do odstavců, ne o verše s rýmem." },
  { q: "Báseň má 15 veršů rozdělených po 5 verších do strof. Kolik strof báseň má?", a: "3 strofy", opts: ["3 strofy", "5 strof", "15 strof", "2 strofy"], e: "Když 15 veršů rozdělíme po pěti, dostaneme 15 : 5 = 3 skupiny — tedy 3 strofy." },
  { q: "Porovnej: A) 'V lese roste starý strom, vedle stojí malý dům.' (jedna souvislá věta) B) 'V lese roste starý strom, / vedle stojí malý dům.' (dva krátké verše s rýmem). Co platí?", a: "B je báseň, A je próza", opts: ["Oba texty jsou próza", "B je báseň, A je próza", "A je báseň, B je próza", "Oba texty jsou báseň"], e: "Stejný obsah lze napsat jako souvislou větu (próza) nebo rozdělit na krátké rýmované verše (báseň) — rozhoduje zápis a rým, ne obsah." },
  { q: "Proč je pohádka próza, i když v ní může být řeč postav (dialog)?", a: "Protože je psaná v souvislých větách", opts: ["Protože dialog je vždy báseň", "Protože je psaná v souvislých větách", "Protože pohádky nemají postavy", "Protože pohádky nejsou psané"], e: "Přítomnost dialogu (přímé řeči) sama o sobě žánr nemění — pohádka zůstává prózou, protože je zapsaná ve větách a odstavcích, ne v rýmovaných krátkých verších." },
  { q: "Báseň má 3 strofy po 4 verších. Kolik veršů má báseň celkem?", a: "12 veršů", opts: ["12 veršů", "7 veršů", "3 verše", "4 verše"], e: "3 strofy po 4 verších znamená 3 × 4 = 12 veršů celkem." },
  { q: "Který literární útvar bývá vždy próza, i když je krátký?", a: "Povídka", opts: ["Povídka", "Říkanka", "Sonet", "Haiku"], e: "Povídka je vždy psána v souvislých větách a odstavcích, i když je krátká. Říkanka, sonet a haiku jsou naopak vždy psány ve verších." },
  { q: "Který literární útvar bývá vždy verše, i když je krátký?", a: "Haiku", opts: ["Haiku", "Povídka", "Pohádka", "Dopis"], e: "Haiku je krátká báseň, která je vždy psaná ve verších (obvykle na 3 řádcích). Povídka, pohádka a dopis jsou naopak psány prózou." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e, hints }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: hints ?? ["Nejdřív se podívej, jak je text zapsaný na stránce.", "Krátké řádky pod sebou, na jejichž koncích se slova rýmují, vypadají úplně jinak než souvislé řádky, které jdou až k okraji stránky."],
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
