import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
  {
    question: "Seřaď části dne od rána do noci ve správném pořadí.",
    correctAnswer: "order",
    items: [
      "Ráno – vychází slunce na východě",
      "Dopoledne – slunce stoupá na obloze",
      "Poledne – slunce je nejvýše",
      "Odpoledne – slunce klesá",
      "Večer – slunce zapadá na západě",
      "Noc – tma, slunce svítí na druhé straně Země",
    ],
  },
  {
    question: "Seřaď roční období v pořadí, ve kterém přicházejí (od jara).",
    correctAnswer: "order",
    items: ["Jaro", "Léto", "Podzim", "Zima"],
  },
  {
    question: "Seřaď kroky, jak Země způsobuje střídání dne a noci.",
    correctAnswer: "order",
    items: [
      "Slunce osvětluje polovinu Země",
      "Zemská osa se otáčí ze západu na východ",
      "Oblast otočená ke Slunci má den",
      "Oblast otočená od Slunce má noc",
      "Po 24 hodinách se otočí celá Země",
    ],
  },
  {
    question: "Seřaď měsíce roku od začátku (leden) do konce.",
    correctAnswer: "order",
    items: ["Leden", "Duben", "Červenec", "Říjen", "Prosinec"],
  },
  {
    question: "Seřaď klíčové dny roku (slunovraty a rovnodennosti) od začátku roku.",
    correctAnswer: "order",
    items: [
      "21. března – jarní rovnodennost (začátek jara)",
      "21. června – letní slunovrat (nejdelší den)",
      "23. září – podzimní rovnodennost (začátek podzimu)",
      "21. prosince – zimní slunovrat (nejkratší den)",
    ],
  },
  {
    question: "Seřaď výšku slunce na obloze během dne (od nejníže po nejvýše a zpět).",
    correctAnswer: "order",
    items: [
      "Východ slunce – slunce nízko na horizontu",
      "Dopoledne – slunce stoupá",
      "Poledne – slunce nejvýše (kulminace)",
      "Odpoledne – slunce klesá",
      "Západ slunce – slunce opět nízko na horizontu",
    ],
  },
  {
    question: "Seřaď od nejkratšího po nejdelší časový úsek.",
    correctAnswer: "order",
    items: [
      "Sekunda",
      "Minuta",
      "Hodina",
      "Den (24 hodin)",
      "Týden",
      "Měsíc",
      "Rok (365 dní)",
    ],
  },
  {
    question: "Seřaď kroky oběhu Země kolem Slunce od jara.",
    correctAnswer: "order",
    items: [
      "Jaro – severní polokoule se naklání ke Slunci",
      "Léto – slunce nejvýše, nejdelší dny",
      "Podzim – rovnodennost, den = noc",
      "Zima – nejkratší dny, slunce nízko",
      "Jaro opět – nový rok dokončen",
    ],
  },
  {
    question: "Seřaď části dne od půlnoci do následující půlnoci.",
    correctAnswer: "order",
    items: [
      "Půlnoc – 00:00",
      "Svítání – slunce stoupá pod horizontem",
      "Východ slunce – začíná den",
      "Poledne – 12:00, slunce nejvýše",
      "Západ slunce – začíná soumrak",
      "Večer – tma se prohlubuje",
      "Půlnoc opět – 24:00",
    ],
  },
  {
    question: "Seřaď délku dne v průběhu roku na severní polokouli od nejkratšího po nejdelší.",
    correctAnswer: "order",
    items: [
      "21. prosince – nejkratší den (~8 hodin světla)",
      "21. března – rovnodennost (12 hodin světla)",
      "21. června – nejdelší den (~16 hodin světla)",
    ],
  },
  {
    question: "Seřaď kroky vzniku stínu při pohybu slunce.",
    correctAnswer: "order",
    items: [
      "Ráno – dlouhý stín směřuje na západ",
      "Dopoledne – stín se zkracuje",
      "Poledne – stín nejkratší, směřuje na sever",
      "Odpoledne – stín se prodlužuje",
      "Večer – dlouhý stín směřuje na východ",
    ],
  },
  {
    question: "Seřaď planety sluneční soustavy od nejbližší ke Slunci.",
    correctAnswer: "order",
    items: [
      "Merkur – nejblíže Slunci",
      "Venuše",
      "Země",
      "Mars",
      "Jupiter – největší planeta",
    ],
  },
  {
    question: "Seřaď kroky, jak slunce mění výšku v průběhu roku (jaro → zima).",
    correctAnswer: "order",
    items: [
      "Jaro – slunce stoupá výš každým dnem",
      "Léto – slunce v poledne nejvýše v roce",
      "Podzim – slunce klesá níž každým dnem",
      "Zima – slunce v poledne nejníže v roce",
    ],
  },
  {
    question: "Seřaď fáze Měsíce od novu do úplňku a zpět.",
    correctAnswer: "order",
    items: [
      "Nov – Měsíc není vidět",
      "Srpek (první čtvrt) – vidět pravá část",
      "Úplněk – Měsíc celý osvětlený",
      "Srpek (poslední čtvrt) – vidět levá část",
      "Nov opět – cyklus se opakuje",
    ],
  },
  {
    question: "Seřaď kroky, jak se změnila délka dne od jarní rovnodennosti do zimního slunovratu.",
    correctAnswer: "order",
    items: [
      "21. března – den = noc (12 h / 12 h)",
      "21. června – nejdelší den v roce",
      "23. září – den = noc opět",
      "21. prosince – nejkratší den v roce",
    ],
  },
  {
    question: "Seřaď od největšího po nejmenší vesmírný objekt.",
    correctAnswer: "order",
    items: [
      "Galaxie (Mléčná dráha)",
      "Sluneční soustava",
      "Slunce",
      "Země",
      "Měsíc",
    ],
  },
  {
    question: "Seřaď kroky, jak vznikají roční období na Zemi.",
    correctAnswer: "order",
    items: [
      "Zemská osa je nakloněna o 23,5°",
      "Při oběhu kolem Slunce se polokoule střídavě naklánějí",
      "Nakloněná polokoule dostává více světla → léto",
      "Odkloněná polokoule dostává méně světla → zima",
      "Po půlroku se role obrátí",
    ],
  },
  {
    question: "Seřaď události od východu do západu slunce.",
    correctAnswer: "order",
    items: [
      "Svítání – obloha se rozjasňuje",
      "Východ slunce – slunce se objeví nad horizontem",
      "Dopoledne – slunce stoupá nad obzor",
      "Poledne – slunce kulminuje (nejvýše)",
      "Odpoledne – slunce klesá",
      "Západ slunce – slunce zmizí pod horizont",
      "Soumrak – obloha ještě prosvětlená",
    ],
  },
  {
    question: "Seřaď kroky rotace Země od začátku dne na nultém poledníku.",
    correctAnswer: "order",
    items: [
      "Nultý poledník (Greenwich) – polední slunce",
      "Česká republika (15° V.d.) – poledne o 1 hodinu dříve",
      "New York (75° Z.d.) – poledne o 5 hodin pozdější",
      "Tokio (135° V.d.) – poledne o 9 hodin dřívější",
      "Zemský poledník se otočil o 360° – opět polední",
    ],
  },
  {
    question: "Seřaď čísla hodin od rána do noci (celý den).",
    correctAnswer: "order",
    items: [
      "6:00 – svítá",
      "9:00 – dopoledne",
      "12:00 – poledne",
      "15:00 – odpoledne",
      "18:00 – večer",
      "21:00 – soumrak",
      "24:00 – půlnoc",
    ],
  },
  {
    question: "Seřaď kroky, jak rotace Země způsobuje zdánlivý pohyb Slunce.",
    correctAnswer: "order",
    items: [
      "Slunce stojí, Země se otáčí ze západu na východ",
      "Pozorovatel na Zemi vidí Slunce putovat opačně",
      "Ráno Slunce vychází na východě",
      "V poledne kulminuje na jihu",
      "Večer zapadá na západě",
    ],
  },
  {
    question: "Seřaď roční období a jejich typické rysy od jara do zimy.",
    correctAnswer: "order",
    items: [
      "Jaro – teploty stoupají, rostliny kvetou",
      "Léto – nejteplejší, nejdelší dny",
      "Podzim – teploty klesají, listí opadá",
      "Zima – nejchladnější, nejkratší dny",
    ],
  },
  {
    question: "Seřaď kroky, jak roste den v průběhu roku (od zimního slunovratu).",
    correctAnswer: "order",
    items: [
      "21. prosince – nejkratší den",
      "Leden–únor – den se pomalu prodlužuje",
      "21. března – rovnodennost, den = noc",
      "Duben–květen – dny stále delší",
      "21. června – nejdelší den",
    ],
  },
  {
    question: "Seřaď od nejmenšího po největší počet hodin denního světla.",
    correctAnswer: "order",
    items: [
      "Zimní slunovrat (21. 12.) – ~8 hodin světla",
      "Podzimní rovnodennost (23. 9.) – 12 hodin světla",
      "Letní slunovrat (21. 6.) – ~16 hodin světla",
    ],
  },
  {
    question: "Seřaď kroky, jak se mění délka stínu v průběhu dne.",
    correctAnswer: "order",
    items: [
      "Ráno – stín nejdelší (slunce nízko)",
      "Dopoledne – stín se zkracuje",
      "Poledne – stín nejkratší (slunce nejvýše)",
      "Odpoledne – stín se opět prodlužuje",
      "Večer – stín opět nejdelší",
    ],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 25);
}

export const ZEMEJAKOPLANETATVARROTACEOBEHSTRIDANIDNEANOCI: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-zeme-jako-planeta-tvar-rotace-obeh-stridani-dne-a-noci",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-zeme-jako-planeta-tvar-rotace-obeh-stridani-dne-a-noci",
    title: "Země jako planeta - tvar, rotace, oběh, střídání dne a noci",
    studentTitle: "Pohyby Země",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Neživá příroda - rozšíření",
    briefDescription: "Pochopíš, proč se střídá den a noc a jak vznikají roční období.",
    keywords: ["rotace", "oběh", "den", "noc", "roční období", "slunovrat", "rovnodennost", "časová pásma"],
    goals: ["Vysvětlit střídání dne a noci rotací Země", "Popsat vztah sklonu osy k ročním obdobím", "Určit data slunovratů a rovnodenností"],
    boundaries: ["Neprobírá precesi zemské osy", "Neprobírá přesnou astronomii oběžných drah"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Rotace (24 h) → den/noc. Oběh + sklon osy (23,5°) → roční období.",
      steps: [
        "1. Rotace Země (kolem osy) = 24 hodin = den a noc.",
        "2. Oběh kolem Slunce = 365,25 dne = rok.",
        "3. Sklon osy = roční období (léto/zima).",
        "4. Nejdelší den: 21. 6. Nejkratší: 21. 12.",
      ],
      commonMistake: "Roční období NEZPŮSOBUJE vzdálenost od Slunce, ale sklon zemské osy!",
      example: "21. června: severní polokoule nakloněna ke Slunci → léto. 21. prosince: odkloněna → zima.",
    },
  },
];
