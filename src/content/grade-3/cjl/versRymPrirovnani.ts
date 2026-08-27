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
  { q: "Co je rým?", a: "Stejně nebo podobně znějící konec slov (pes – les)", opts: ["Stejně nebo podobně znějící konec slov (pes – les)", "Rytmus básně", "Délka verše", "Opakování slov"], e: "Rým vzniká, když dvě slova mají stejné nebo podobné zakončení — třeba 'pes' a 'les' obě končí na '-es'. Rytmus, délka nebo opakování slov nejsou rým." },
  {
    q: "Co je verš?",
    a: "Jeden řádek v básni",
    opts: ["Jeden řádek v básni", "Celá báseň", "Skupina řádků", "Rýmové slovo"],
    e: "Verš je jeden řádek básně — jako jeden řádek v sešitě, jenže v básni. Celá báseň má více veršů a skupina veršů se nazývá strofa.",
    hints: [
      "Rým = stejné/podobné zakončení slov. Přirovnání = jako + co porovnáváme.",
      "Když čteš báseň nahlas, po každém takovém úseku se zastavíš a začneš nový na dalším řádku.",
    ],
  },
  {
    q: "Co je strofa?",
    a: "Skupina veršů v básni (jako odstavec v próze)",
    opts: ["Skupina veršů v básni (jako odstavec v próze)", "Rým na konci verše", "Celá báseň", "Jeden verš"],
    e: "Strofa je skupina několika veršů, které k sobě patří a jsou odděleny mezerou od další skupiny — je to podobné odstavci v próze. Rým je zvuk na konci slov, ne skupina veršů.",
    hints: [
      "Rým = stejné/podobné zakončení slov. Přirovnání = jako + co porovnáváme.",
      "V próze má podobnou funkci odstavec — několik řádků básně oddělených mezerou od dalšího celku.",
    ],
  },
  { q: "Co je přirovnání?", a: "Porovnání dvou věcí pomocí slova 'jako'", opts: ["Porovnání dvou věcí pomocí slova 'jako'", "Rým ve verši", "Název básně", "Ponaučení z bajky"], e: "Přirovnání vždy používá slovo 'jako' — například 'silný jako lev'. Tím říkáme, že se jedna věc podobá druhé. Rým, název básně ani ponaučení přirovnání nejsou." },
  { q: "Co se rýmuje se slovem 'pes'?", a: "les", opts: ["les", "kočka", "ryba", "okno"], e: "'Pes' a 'les' obě končí na '-es', takže se rýmují. Slova 'kočka', 'ryba' ani 'okno' nemají stejné zakončení jako 'pes'." },
  { q: "Co se rýmuje se slovem 'strom'?", a: "dům", opts: ["dům", "hora", "louka", "voda"], e: "'Strom' a 'dům' obě končí na '-om' / '-ům' — zvuk na konci je velmi podobný. Hora, louka ani voda takové zakončení nemají." },
  { q: "Co se rýmuje se slovem 'modrý'?", a: "mokrý", opts: ["mokrý", "zelený", "velký", "teplý"], e: "'Modrý' a 'mokrý' mají podobné zakončení '-rý', takže zní podobně. Zelený, velký ani teplý se s 'modrý' nerýmují." },
  { q: "Doplň přirovnání: 'Rychlý jako ___'", a: "vítr / blesk / šíp", opts: ["vítr / blesk / šíp", "stůl / okno / dveře", "zelená / modrá", "pomalý / tichý"], e: "Vítr, blesk a šíp jsou věci, které se pohybují velmi rychle — proto se hodí do přirovnání 'rychlý jako'. Stůl ani okno se nepohybují vůbec." },
  { q: "Doplň přirovnání: 'Silný jako ___'", a: "medvěd / býk / lev", opts: ["medvěd / býk / lev", "myška / pero", "voda / vzduch", "žlutý / hezký"], e: "Medvěd, býk a lev jsou zvířata známá svojí velkou silou. Myška ani pero silná nejsou a 'žlutý' nebo 'hezký' vůbec nejsou zvířata ani věci." },
  { q: "Věta: 'Máša je chytrá jako liška.' Co je to?", a: "Přirovnání (jako liška)", opts: ["Přirovnání (jako liška)", "Rým", "Pohádka", "Bajka"], e: "Ve větě je slovo 'jako', které porovnává Mášinu chytrost s liškou. To je přirovnání. Rým by musel mít dvě slova se stejným zakončením." },
];

const POOL_L2: QA[] = [
  { q: "Co se rýmuje se slovem 'zima'?", a: "prima", opts: ["prima", "jaro", "teplo", "déšť"], e: "'Zima' a 'prima' obě končí na '-ima', takže se rýmují. Jaro, teplo ani déšť takové zakončení nemají — nezní podobně jako 'zima'." },
  { q: "Co se rýmuje: máma – ___?", a: "dáma", opts: ["dáma", "bratr", "sestra", "dítě"], e: "'Máma' a 'dáma' obě končí na '-áma', takže se rýmují. Bratr, sestra ani dítě nemají zakončení podobné slovu 'máma'." },
  { q: "Doplň lidovou říkanku: 'Skákal pes přes oves, přes zelenou ___'", a: "louku", opts: ["louku", "trávu", "zahradu", "cestu"], e: "Lidová říkanka pokračuje slovem 'louku' ('přes zelenou louku'). Je to známá říkanka, kterou si děti říkají." },
  { q: "Přirovnání: 'Tichý jako ___'", a: "myška", opts: ["myška", "pes", "vítr", "hrom"], e: "Myška je známá tím, že se pohybuje velmi tiše a skoro ji není slyšet. Proto říkáme 'tichý jako myška'. Pes, vítr ani hrom nejsou tiché věci." },
  { q: "Přirovnání 'Bílý jako sníh' popisuje:", a: "Barvu (bílá) pomocí přirovnání ke sněhu", opts: ["Barvu (bílá) pomocí přirovnání ke sněhu", "Chlad sněhu", "Tvar sněhu", "Rychlost sněhu"], e: "Slovo 'bílý' říká, jakou má věc barvu, a přirovnání 'jako sníh' nám pomáhá si tu bílou barvu lépe představit. Nejde o chlad, tvar ani rychlost." },
  { q: "Co se rýmuje se slovem 'kámen'?", a: "plamen", opts: ["plamen", "strom", "voda", "hlína"], e: "'Kámen' a 'plamen' obě končí na '-amen', takže se rýmují. Strom, voda ani hlína takové zakončení nemají." },
  { q: "Co se rýmuje se slovem 'nebe'?", a: "tebe", opts: ["tebe", "slunce", "hvězda", "mrak"], e: "'Nebe' a 'tebe' obě končí na '-ebe', takže se rýmují. Slunce, hvězda ani mrak takové zakončení nemají." },
  { q: "Doplň přirovnání: 'Studený jako ___'", a: "led / sníh", opts: ["led / sníh", "oheň / slunce", "tráva / listí", "kámen / dřevo"], e: "Led a sníh jsou věci, které jsou opravdu studené, proto se hodí do přirovnání 'studený jako'. Oheň a slunce jsou naopak horké." },
  { q: "Doplň přirovnání: 'Tvrdý jako ___'", a: "kámen / skála", opts: ["kámen / skála", "peří / vata", "voda / mlha", "vítr / dým"], e: "Kámen a skála jsou tvrdé věci, proto se hodí do přirovnání 'tvrdý jako'. Peří a vata jsou naopak měkké." },
  { q: "Kolik veršů má básnička: 'Skákal pes / přes oves / přes zelenou louku'?", a: "3 verše", opts: ["3 verše", "1 verš", "2 verše", "4 verše"], e: "Básnička má tři řádky, a protože verš je jeden řádek básně, má tato básnička tři verše." },
];

const POOL_L3: QA[] = [
  { q: "Přečti básničku: 'Na dvorku si hraje pes, / za plotem je tichý les. / Vedle roste vysoký strom, / pod ním stojí malý dům.' Které verše se spolu rýmují?", a: "1. a 2. verš (pes–les) a 3. a 4. verš (strom–dům)", opts: ["1. a 2. verš (pes–les) a 3. a 4. verš (strom–dům)", "1. a 3. verš", "2. a 4. verš", "Všechny čtyři verše se rýmují navzájem"], e: "První dva verše končí na 'pes' a 'les' (rým -es), druhé dva na 'strom' a 'dům' (rým -om/-ům). Vznikají tak dvě dvojice rýmujících se veršů, ne jiné kombinace." },
  { q: "Báseň má 8 veršů rozdělených po 4 do strof. Kolik má báseň strof?", a: "2 strofy", opts: ["2 strofy", "4 strofy", "8 strof", "1 strofa"], e: "Když 8 veršů rozdělíme po čtyřech, dostaneme 8 : 4 = 2 skupiny — tedy 2 strofy." },
  { q: "Tři z těchto slov se navzájem rýmují, jedno ne. Které?", a: "okno", opts: ["les", "pes", "ves", "okno"], e: "Slova 'les', 'pes' a 'ves' končí na '-es', a proto se navzájem rýmují. 'Okno' má úplně jiné zakončení, takže se s nimi nerýmuje." },
  { q: "Věta 'Sníh byl bílý jako cukr.' K čemu se přirovnává bílá barva sněhu?", a: "K cukru (přirovnání 'jako cukr')", opts: ["K cukru (přirovnání 'jako cukr')", "K mléku", "Ke sněhové vločce", "K ničemu, není tam přirovnání"], e: "Ve větě je slovo 'jako' následované slovem 'cukr' — bílá barva sněhu se tedy přirovnává právě k cukru, ne k mléku ani k vločce." },
  { q: "Tři z těchto slov se navzájem rýmují, jedno ne. Které?", a: "chleba", opts: ["zima", "prima", "klima", "chleba"], e: "Slova 'zima', 'prima' a 'klima' končí na '-ima', a proto se navzájem rýmují. 'Chleba' má jiné zakončení, takže se s nimi nerýmuje." },
  { q: "Přečti básničku: 'Kočka leze po skále, / hraje si tam stále. / Pod oknem sedí pes, / dívá se, kam zmizel les.' Jaké je rýmové schéma (které verše se rýmují)?", a: "1. a 2. verš (skále–stále) a 3. a 4. verš (pes–les)", opts: ["1. a 2. verš (skále–stále) a 3. a 4. verš (pes–les)", "1. a 4. verš", "2. a 3. verš", "Žádné verše se nerýmují"], e: "První dva verše končí na 'skále' a 'stále' (rým -ále), druhé dva na 'pes' a 'les' (rým -es). Vznikají tak dvě dvojice rýmujících se veršů." },
  { q: "Ve verších 'Vítr fouká přes pole, / šumí tiše jako moře.' najdi přirovnání. Co se s čím porovnává?", a: "Šumění větru se přirovnává k moři (jako moře)", opts: ["Šumění větru se přirovnává k moři (jako moře)", "Pole se přirovnává k větru", "Vítr se přirovnává k poli", "Moře se přirovnává k poli"], e: "Slovo 'jako' spojuje šumění větru s mořem — přirovnání tedy říká, že vítr šumí podobně jako moře, ne že se pole nebo vítr přirovnává k jiné věci." },
  { q: "Báseň má 12 veršů rozdělených do 3 stejných strof. Kolik veršů má jedna strofa?", a: "4 verše", opts: ["4 verše", "3 verše", "6 veršů", "12 veršů"], e: "Když 12 veršů rozdělíme do 3 stejných strof, dostaneme 12 : 3 = 4 verše na jednu strofu." },
  { q: "'V krbu hoří jasný plamen, / na stole leží těžký ___.' Doplň slovo, které se rýmuje a zároveň dává smysl.", a: "kámen", opts: ["kámen", "strom", "vítr", "déšť"], e: "'Plamen' a 'kámen' se rýmují (obě končí na '-amen') a věta 'na stole leží těžký kámen' dává smysl. Strom, vítr ani déšť by na stole neležely a navíc se s 'plamen' nerýmují." },
  { q: "Které přirovnání je SPRÁVNĚ utvořené (obsahuje slovo 'jako')?", a: "Studený jako led", opts: ["Studený jako led", "Studená zima", "Ledový chlad", "Zimní mráz"], e: "Přirovnání musí obsahovat slovo 'jako', které porovnává dvě věci — proto je správné jen 'Studený jako led'. Ostatní možnosti popisují chlad, ale bez slova 'jako' to není přirovnání." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e, hints }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: hints ?? ["Rým = stejné/podobné zakončení slov. Přirovnání = jako + co porovnáváme.", "Verš = jeden řádek básně. Strofa = skupina veršů."],
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
