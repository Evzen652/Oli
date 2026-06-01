import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[] }

const POOL_L1: QA[] = [
  { q: "Jak poznáme hlavní postavu v příběhu?", a: "Nejvíce se vyskytuje, příběh se točí kolem ní", opts: ["Nejvíce se vyskytuje, příběh se točí kolem ní", "Je to vždy dospělý muž", "Je zmíněna jen jednou", "Je nejkrásnější v příběhu"] },
  { q: "Co jsou fyzické vlastnosti postavy?", a: "Jak postava vypadá: výška, vlasy, oči, postava", opts: ["Jak postava vypadá: výška, vlasy, oči, postava", "Jak se postava chová k ostatním", "Co postava říká a myslí", "Čím postava pracuje"] },
  { q: "Co jsou psychické vlastnosti postavy?", a: "Charakter: odvážný, lstivý, laskavý, sobecký", opts: ["Charakter: odvážný, lstivý, laskavý, sobecký", "Jak postava vypadá fyzicky", "Věk a jméno postavy", "Kde postava bydlí"] },
  { q: "Co je přímá charakteristika postavy?", a: "Autor přímo říká, jaká postava je: 'Petr je odvážný.'", opts: ["Autor přímo říká, jaká postava je: 'Petr je odvážný.'", "Postava ukazuje vlastnosti svým jednáním", "Jiná postava mluví o hlavní postavě", "Přímá řeč hlavní postavy"] },
  { q: "Co je nepřímá charakteristika postavy?", a: "Vlastnosti poznáme z chování, řeči a jednání postavy", opts: ["Vlastnosti poznáme z chování, řeči a jednání postavy", "Autor přímo říká, jaká postava je", "Jméno postavy nám říká vše", "Popis oblečení postavy"] },
  { q: "Příklad přímé charakteristiky:", a: "'Jana je velmi hodná a pomáhá všem v nouzi.'", opts: ["'Jana je velmi hodná a pomáhá všem v nouzi.'", "'Jana skočila do řeky, aby zachránila tonoucího.'", "'Jana řekla: Pomůžu ti!'", "'Jana dostal cenu za statečnost.'"] },
  { q: "Příklad nepřímé charakteristiky:", a: "'Skočil do řeky a zachránil tonoucího.' → odvážný", opts: ["'Skočil do řeky a zachránil tonoucího.' → odvážný", "'Petr je odvážný.'", "'Řekli mu, že je odvážný.'", "'Dostal vyznamenání za statečnost.'"] },
  { q: "Čím se liší hlavní a vedlejší postava?", a: "Hlavní = střed příběhu; vedlejší = doplňuje příběh", opts: ["Hlavní = střed příběhu; vedlejší = doplňuje příběh", "Hlavní je vždy hodná, vedlejší zlá", "Hlavní je dospělá, vedlejší dítě", "Nejsou žádné vedlejší postavy"] },
  { q: "Co nám o postavě může říct přímá řeč?", a: "Jak postava mluví, co si myslí a jaké má hodnoty", opts: ["Jak postava mluví, co si myslí a jaké má hodnoty", "Jen věk postavy", "Jen fyzický popis", "Jak se jmenuje"] },
  { q: "Záporná postava v pohádce má typicky vlastnosti:", a: "závist, lstivost, krutost, sobeckost", opts: ["závist, lstivost, krutost, sobeckost", "odvaha, laskavost, upřímnost", "výška, barva vlasů, věk", "povolání, bydliště, záliby"] },
  { q: "Kladná postava v pohádce má typicky vlastnosti:", a: "odvaha, laskavost, upřímnost, pracovitost", opts: ["odvaha, laskavost, upřímnost, pracovitost", "závist, lstivost, krutost", "výška, barva vlasů, věk", "povolání, bydliště, záliby"] },
  { q: "Jak se postava vyvíjí v příběhu?", a: "Může se změnit — naučí se, poroste, změní názor", opts: ["Může se změnit — naučí se, poroste, změní názor", "Postava je vždy stejná od začátku do konce", "Postava vždy zesiluje fyzicky", "Postava vždy zemře na konci"] },
  { q: "Vypravěč v příběhu:", a: "Vypráví příběh — může být uvnitř nebo vně příběhu", opts: ["Vypráví příběh — může být uvnitř nebo vně příběhu", "Je vždy hlavní postavou", "Je vždy zápornou postavou", "Je vždy dítětem"] },
  { q: "Jak poznáme postavu z pohádky?", a: "Je jednodimenzionální — jasně dobrá nebo zlá", opts: ["Je jednodimenzionální — jasně dobrá nebo zlá", "Je složitá s rozporuplnými vlastnostmi", "Nikdy nemluví", "Je vždy zvíře"] },
  { q: "Jaká slova popisují fyzické vlastnosti?", a: "vysoký, blonďatý, štíhlý, s modrýma očima", opts: ["vysoký, blonďatý, štíhlý, s modrýma očima", "odvážný, laskavý, sobecký", "rychlý, chytrý, pilný", "šťastný, smutný, naštvaný"] },
  { q: "Jaká slova popisují psychické vlastnosti?", a: "odvážný, laskavý, sobecký, lstivý, upřímný", opts: ["odvážný, laskavý, sobecký, lstivý, upřímný", "vysoký, blonďatý, štíhlý", "rychlý, pomalý, hlasitý", "červený, zelený, modrý"] },
];

const POOL_L2: QA[] = [
  { q: "Přečti: 'Petr mlčky pomohl přenést těžké bedny bez toho, aby ho kdokoli žádal.' Co tím chce autor říct?", a: "Petr je obětavý a pracovitý (nepřímá charakteristika)", opts: ["Petr je obětavý a pracovitý (nepřímá charakteristika)", "Petr je silný (fyzická vlastnost)", "Petr je tichý (přímá charakteristika)", "Bedny byly těžké"] },
  { q: "Přečti: 'Marta se usmívala na každého, kdo šel kolem.' Co vyvozujeme?", a: "Marta je přátelská a otevřená", opts: ["Marta je přátelská a otevřená", "Marta je zlá a lstivá", "Marta je smutná", "Marta je fyzicky aktivní"] },
  { q: "Jak se liší postava v pohádce a v povídce?", a: "Pohádková = jednodimenzionální; v povídce = komplexnější", opts: ["Pohádková = jednodimenzionální; v povídce = komplexnější", "Jsou stejné", "V pohádce je vždy dospělá; v povídce dítě", "V pohádce není hlavní postava"] },
  { q: "Příklad vývoje postavy v příběhu:", a: "Zlý statkář pochopí, že záleží na přátelství, a změní se.", opts: ["Zlý statkář pochopí, že záleží na přátelství, a změní se.", "Hodný chlapec zůstane hodný celý příběh.", "Drak celý příběh plní příkazy.", "Princezna čeká celý příběh bez pohybu."] },
  { q: "Co je 'round character' (plná postava)?", a: "Komplexní postava s rozporuplnými vlastnostmi — ne jen dobrá nebo zlá", opts: ["Komplexní postava s rozporuplnými vlastnostmi — ne jen dobrá nebo zlá", "Postava, která je fyzicky silná", "Postava z pohádky", "Postava bez jména"] },
  { q: "Autor řekne: 'Honza byl vždy první, kdo se nabídl k práci.' — jaký typ charakteristiky?", a: "nepřímá (jednání ukazuje pracovitost)", opts: ["nepřímá (jednání ukazuje pracovitost)", "přímá (autor říká přímo)", "fyzická", "psychická přímá"] },
  { q: "Jakou roli hrají vedlejší postavy?", a: "Doplňují příběh, pomáhají nebo brání hlavní postavě", opts: ["Doplňují příběh, pomáhají nebo brání hlavní postavě", "Jsou vždy záporné", "Jsou vždy kladné", "Nevyskytují se v příbězích"] },
  { q: "Jak popsat postavu při charakteristice?", a: "Fyzické vlastnosti → psychické vlastnosti → chování → vztahy", opts: ["Fyzické vlastnosti → psychické vlastnosti → chování → vztahy", "Jméno → věk → pohlaví → konec", "Abecedně", "Jen přímou řečí"] },
  { q: "Záporná postava: 'Královna záviděla sněhurce její krásu a přikázala ji zabít.' — jaká vlastnost?", a: "závist a krutost", opts: ["závist a krutost", "upřímnost a odvaha", "laskavost a obětavost", "pracovitost a pilnost"] },
  { q: "Jak vyjádříme sympatie nebo antipatie k postavě?", a: "Záleží na jejích vlastnostech a jednání — co dělá a říká", opts: ["Záleží na jejích vlastnostech a jednání — co dělá a říká", "Záleží na délce popisu postavy", "Záleží na fyzickém popisu", "Záleží na jménu postavy"] },
  { q: "Protagonista je:", a: "Hlavní postava příběhu — hrdina", opts: ["Hlavní postava příběhu — hrdina", "Záporná postava", "Vedlejší postava", "Vypravěč"] },
  { q: "Antagonista je:", a: "Protivník hlavní postavy — překáží nebo bojuje proti ní", opts: ["Protivník hlavní postavy — překáží nebo bojuje proti ní", "Hlavní hrdina", "Vedlejší postava pomáhající hrdinovi", "Vypravěč"] },
  { q: "Proč autor nevykreslí vždy postavu přímou charakteristikou?", a: "Nepřímá je živější — čtenář si sám vyvozuje vlastnosti", opts: ["Nepřímá je živější — čtenář si sám vyvozuje vlastnosti", "Autor neumí psát přímou charakteristiku", "Přímá charakteristika je zakázána", "Čtenáři se nepřímá nelíbí"] },
  { q: "Příklad komplexní postavy:", a: "Detektiv, který je chytrý, ale závisí na whisky a je osamělý", opts: ["Detektiv, který je chytrý, ale závisí na whisky a je osamělý", "Pohádkový princ, který je vždy hodný", "Drak, který je vždy zlý", "Víla, která vždy pomáhá"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Hlavní postava = střed příběhu, nejvíce se vyskytuje",
      "Fyzické vlastnosti = jak vypadá; psychické = jak se chová",
      "Přímá charakteristika = autor říká přímo; nepřímá = z jednání a řeči postavy",
    ],
    solutionSteps: [
      "Urči, kdo je hlavní postava — kdo je středem příběhu.",
      "Fyzické vlastnosti: jak postava vypadá?",
      "Psychické vlastnosti: jak se chová, co říká, co si myslí?",
      "Je to přímá nebo nepřímá charakteristika?",
    ],
  }));
}

export const HLAVNIPOSTAVYAJEJICHCHARAKTERISTIKA: TopicMetadata[] = [
  {
    id: "g4-cjl-literarni-vychova-prace-s-textem-hlavni-postavy-a-jejich-charakteristika",
    rvpNodeId: "g4-cjl-literarni-vychova-prace-s-textem-hlavni-postavy-a-jejich-charakteristika",
    title: "Hlavní postavy a jejich charakteristika",
    studentTitle: "Postavy v příbězích",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární výchova",
    briefDescription: "Naučíš se analyzovat postavy v příbězích a rozlišit přímou a nepřímou charakteristiku.",
    keywords: ["hlavní postava", "charakteristika", "fyzické vlastnosti", "psychické vlastnosti", "přímá charakteristika", "nepřímá charakteristika"],
    goals: [
      "Rozlišit fyzické a psychické vlastnosti postavy",
      "Rozlišit přímou a nepřímou charakteristiku",
      "Určit hlavní a vedlejší postavu",
    ],
    boundaries: ["Bez literárněvědné terminologie", "Bez psychologické analýzy"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Fyzické = vzhled; psychické = charakter; přímá = autor říká přímo; nepřímá = z jednání postavy",
      steps: [
        "Kdo je hlavní postava? → nejvíce se vyskytuje",
        "Fyzické vlastnosti: jak vypadá (vlasy, oči, postava)?",
        "Psychické vlastnosti: jak se chová (odvážný, laskavý...)?",
        "Přímá char. = autor říká; nepřímá = z jednání/řeči/myšlenek",
      ],
      commonMistake: "Záměna přímé a nepřímé charakteristiky — 'Je hodný.' = přímá; 'Pomohl bez ptaní.' = nepřímá",
      example: "Přímá: 'Jana je velmi odvážná.' Nepřímá: 'Jana skočila do řeky, aby zachránila tonoucího.'",
    },
  },
];
