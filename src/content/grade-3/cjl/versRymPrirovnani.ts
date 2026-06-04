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
  { q: "Co je rým?", a: "Stejně nebo podobně znějící konec slov (pes – les)", opts: ["Stejně nebo podobně znějící konec slov (pes – les)", "Rytmus básně", "Délka verše", "Opakování slov"] },
  { q: "Co se rýmuje se slovem 'pes'?", a: "les", opts: ["les", "kočka", "ryba", "okno"] },
  { q: "Co se rýmuje se slovem 'strom'?", a: "dům", opts: ["dům", "hora", "louka", "voda"] },
  { q: "Co se rýmuje se slovem 'modrý'?", a: "lodrý / pohodlný / romodný (nebo: mokrý)", opts: ["mokrý", "zelený", "velký", "teplý"] },
  { q: "Co je verš?", a: "Jeden řádek v básni", opts: ["Jeden řádek v básni", "Celá báseň", "Skupina řádků", "Rýmové slovo"] },
  { q: "Co je přirovnání?", a: "Porovnání dvou věcí pomocí slova 'jako'", opts: ["Porovnání dvou věcí pomocí slova 'jako'", "Rým ve verši", "Název básně", "Ponaučení z bajky"] },
  { q: "Doplň přirovnání: 'Rychlý jako ___'", a: "vítr / blesk / šíp", opts: ["vítr / blesk / šíp", "stůl / okno / dveře", "zelená / modrá", "pomalý / tichý"] },
  { q: "Doplň přirovnání: 'Silný jako ___'", a: "medvěd / byk / lev", opts: ["medvěd / byk / lev", "myška / pero", "voda / vzduch", "žlutý / hezký"] },
  { q: "Věta: 'Máša je chytrá jako liška.' Co je to?", a: "Přirovnání (jako liška)", opts: ["Přirovnání (jako liška)", "Rým", "Pohádka", "Bajka"] },
  { q: "Co se rýmuje se slovem 'zima'?", a: "prima / lima / klima", opts: ["prima", "jaro", "teplo", "déšť"] },
  { q: "Báseň má verše seřazené do skupin. Jedna skupina se nazývá:", a: "Strofa", opts: ["Strofa", "Odstavec", "Kapitola", "Rým"] },
  { q: "Najdi rým: 'Skákal pes přes oves, přes zelenou ___'", a: "louku (rým: oves – louku nepasuje, správně: oves–oves nebo les–ves)", opts: ["louku", "trávu", "zahradu", "cestu"] },
  { q: "Přirovnání: 'Tichý jako ___'", a: "myška / voda v rybníce", opts: ["myška", "pes", "vítr", "hrom"] },
  { q: "Co se rýmuje: máma – ___?", a: "táta / dáma / láma", opts: ["táta / dáma", "bratr", "sestra", "dítě"] },
  { q: "Přirovnání 'Bílý jako sníh' popisuje:", a: "Barvu (bílá) pomocí přirovnání ke sněhu", opts: ["Barvu (bílá) pomocí přirovnání ke sněhu", "Chlad sněhu", "Tvar sněhu", "Rychlost sněhu"] },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Rým = stejné/podobné zakončení slov. Přirovnání = jako + co porovnáváme.", "Verš = jeden řádek básně. Strofa = skupina veršů."],
    solutionSteps: [`Odpověď: ${a}`],
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
