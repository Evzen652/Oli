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
  { q: "Co je rým?", a: "Stejně nebo podobně znějící konec slov (pes – les)", opts: ["Stejně nebo podobně znějící konec slov (pes – les)", "Rytmus básně", "Délka verše", "Opakování slov"], e: "Rým vzniká, když dvě slova mají stejné nebo podobné zakončení — třeba 'pes' a 'les' obě končí na '-es'. Rytmus, délka nebo opakování slov nejsou rým." },
  { q: "Co se rýmuje se slovem 'pes'?", a: "les", opts: ["les", "kočka", "ryba", "okno"], e: "'Pes' a 'les' obě končí na '-es', takže se rýmují. Slova 'kočka', 'ryba' ani 'okno' nemají stejné zakončení jako 'pes'." },
  { q: "Co se rýmuje se slovem 'strom'?", a: "dům", opts: ["dům", "hora", "louka", "voda"], e: "'Strom' a 'dům' obě končí na '-om' / '-ům' — zvuk na konci je velmi podobný. Hora, louka ani voda takové zakončení nemají." },
  { q: "Co se rýmuje se slovem 'modrý'?", a: "mokrý", opts: ["mokrý", "zelený", "velký", "teplý"], e: "'Modrý' a 'mokrý' mají podobné zakončení '-rý', takže zní podobně. Zelený, velký ani teplý se s 'modrý' nerýmují." },
  { q: "Co je verš?", a: "Jeden řádek v básni", opts: ["Jeden řádek v básni", "Celá báseň", "Skupina řádků", "Rýmové slovo"], e: "Verš je jeden řádek básně — jako jeden řádek v sešitě, jenže v básni. Celá báseň má více veršů a skupina veršů se nazývá strofa." },
  { q: "Co je přirovnání?", a: "Porovnání dvou věcí pomocí slova 'jako'", opts: ["Porovnání dvou věcí pomocí slova 'jako'", "Rým ve verši", "Název básně", "Ponaučení z bajky"], e: "Přirovnání vždy používá slovo 'jako' — například 'silný jako lev'. Tím říkáme, že se jedna věc podobá druhé. Rým, název básně ani ponaučení přirovnání nejsou." },
  { q: "Doplň přirovnání: 'Rychlý jako ___'", a: "vítr / blesk / šíp", opts: ["vítr / blesk / šíp", "stůl / okno / dveře", "zelená / modrá", "pomalý / tichý"], e: "Vítr, blesk a šíp jsou věci, které se pohybují velmi rychle — proto se hodí do přirovnání 'rychlý jako'. Stůl ani okno se nepohybují vůbec." },
  { q: "Doplň přirovnání: 'Silný jako ___'", a: "medvěd / býk / lev", opts: ["medvěd / býk / lev", "myška / pero", "voda / vzduch", "žlutý / hezký"], e: "Medvěd, býk a lev jsou zvířata známá svojí velkou silou. Myška ani pero silná nejsou a 'žlutý' nebo 'hezký' vůbec nejsou zvířata ani věci." },
  { q: "Věta: 'Máša je chytrá jako liška.' Co je to?", a: "Přirovnání (jako liška)", opts: ["Přirovnání (jako liška)", "Rým", "Pohádka", "Bajka"], e: "Ve větě je slovo 'jako', které porovnává Mášinu chytrost s liškou. To je přirovnání. Rým by musel mít dvě slova se stejným zakončením." },
  { q: "Co se rýmuje se slovem 'zima'?", a: "prima", opts: ["prima", "jaro", "teplo", "déšť"], e: "'Zima' a 'prima' obě končí na '-ima', takže se rýmují. Jaro, teplo ani déšť takové zakončení nemají — nezní podobně jako 'zima'." },
  { q: "Báseň má verše seřazené do skupin. Jedna skupina se nazývá:", a: "Strofa", opts: ["Strofa", "Odstavec", "Kapitola", "Rým"], e: "Skupina veršů v básni se nazývá strofa — je to jako odstavec v próze, ale v básni. Odstavec a kapitola patří do prózy, rým je zakončení slov." },
  { q: "Doplň lidovou říkanku: 'Skákal pes přes oves, přes zelenou ___'", a: "louku", opts: ["louku", "trávu", "zahradu", "cestu"], e: "Lidová říkanka pokračuje slovem 'louku' ('přes zelenou louku'). Je to známá říkanka, kterou si děti říkají — i když 'oves' a 'louku' se přesně nerýmují." },
  { q: "Přirovnání: 'Tichý jako ___'", a: "myška", opts: ["myška", "pes", "vítr", "hrom"], e: "Myška je známá tím, že se pohybuje velmi tiše a skoro ji není slyšet. Proto říkáme 'tichý jako myška'. Pes, vítr ani hrom nejsou tiché věci." },
  { q: "Co se rýmuje: máma – ___?", a: "dáma", opts: ["dáma", "bratr", "sestra", "dítě"], e: "'Máma' a 'dáma' obě končí na '-áma', takže se rýmují. Bratr, sestra ani dítě nemají zakončení podobné slovu 'máma'." },
  { q: "Přirovnání 'Bílý jako sníh' popisuje:", a: "Barvu (bílá) pomocí přirovnání ke sněhu", opts: ["Barvu (bílá) pomocí přirovnání ke sněhu", "Chlad sněhu", "Tvar sněhu", "Rychlost sněhu"], e: "Slovo 'bílý' říká, jakou má věc barvu, a přirovnání 'jako sníh' nám pomáhá si tu bílou barvu lépe představit. Nejde o chlad, tvar ani rychlost — jen o barvu." },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Rým = stejné/podobné zakončení slov. Přirovnání = jako + co porovnáváme.", "Verš = jeden řádek básně. Strofa = skupina veršů."],
    explanation: e,
  }));
}

export const VERSRYMPRIROVNANI: TopicMetadata[] = [
  {
    id: "g3-cjl-vers-rym-prirovnani",
    rvpNodeId: "g3-cjl-literarni-vychova-literarni-druhy-a-zanry-vers-rym-prirovnani",
    title: "Verš, rým, přirovnání",
    studentTitle: "Rým a přirovnání",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární druhy a žánry",
    briefDescription: "Najdeš rýmy v básni a doplníš přirovnání se slovem 'jako'.",
    keywords: ["rým", "verš", "přirovnání", "jako", "báseň", "strofa", "rytmus"],
    goals: ["Rozpoznat rým v básni.", "Najít slovo, které se rýmuje.", "Rozpoznat a doplnit přirovnání."],
    boundaries: ["Základní rýmy a přirovnání pro 3. ročník."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Rým: poslyš, jak slova znějí — mají stejný konec? Přirovnání: hledej slovo 'jako'.",
      steps: ["Rým: přečti slova nahlas — znějí stejně na konci?", "Přirovnání: spojení s 'jako' (rychlý jako vítr).", "Verš = jeden řádek básně."],
      commonMistake: "Záměna rýmu za opakování: 'pes pes' není rým, 'pes les' je rým.",
      example: "Rým: pes – les, strom – dům. Přirovnání: Tichý jako ryba. Chytrý jako liška.",
    },
  },
];
