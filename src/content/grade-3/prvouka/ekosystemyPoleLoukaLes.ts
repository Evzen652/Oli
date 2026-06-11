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
    type: "select_one",
    question: "Kde žije kobylka?",
    correctAnswer: "Na louce",
    options: ["Na louce", "V lese", "Na poli", "V rybníku"],
    hints: [
      "Kobylka skáče v trávě a chytáme ji v létě na louce.",
      "Louka je prostředí s vysokou travou a bylinkami.",
    ],
    explanation:
      "Kobylka žije na louce, kde se živí trávou a bylinkami. Louka je její přirozené prostředí plné hmyzu.",
  },
  {
    type: "select_one",
    question: "Které zvíře hledá potravu na loukách, i když hnízdí na komínech?",
    correctAnswer: "Čáp",
    options: ["Čáp", "Sova", "Liška", "Veverka"],
    hints: [
      "Toto velké bílé ptáku loví žáby a myši v mokré trávě.",
      "Hnízdí na komínech a sloupech, ale loví na loukách.",
    ],
    explanation:
      "Čáp hnízdí na komínech nebo stromech, ale potravu hledá na loukách a mokřadech — loví žáby, myši, hmyz a červy.",
  },
  {
    type: "select_one",
    question: "Která rostlina roste na louce a má žluté květy?",
    correctAnswer: "Pampeliška",
    options: ["Pampeliška", "Borůvka", "Mák", "Mech"],
    hints: [
      "Na jaře vidíme na loukách žlutý koberec těchto kvítků.",
      "Z jejích bílých chmýří sfukujeme — foukáme na ně a přejeme si.",
    ],
    explanation:
      "Pampeliška je typická louková rostlina se žlutými květy, které se mění v bílou chmýrnatou kouli. Je důležitou potravou pro včely na jaře.",
  },
  {
    type: "select_one",
    question: "Kdo v lese sbírá zásoby žaludů a ořechů na zimu?",
    correctAnswer: "Veverka",
    options: ["Veverka", "Srnec", "Volavka", "Bažant"],
    hints: [
      "Toto zvíře má načervenalou srst a chlupatý ocas.",
      "Vypadá jako malé zvíře šplhající po stromech a schraňující zásoby.",
    ],
    explanation:
      "Veverka žije v lese a ukládá zásoby žaludů, ořechů a šišek na zimu. Šplhá po stromech a staví hnízdo (drej) v korunách.",
  },
  {
    type: "select_one",
    question: "Kde v lese najdeme borůvky?",
    correctAnswer: "Pod stromy na zemi",
    options: [
      "Pod stromy na zemi",
      "Na vrcholcích vysokých stromů",
      "V rybníku",
      "Na polích mezi obilím",
    ],
    hints: [
      "Borůvčí je nízký keřík, který roste ve stínu.",
      "V létě jdeme do lesa s košíkem a sbíráme modré plody nízko u země.",
    ],
    explanation:
      "Borůvky rostou na nízkých keříčcích přímo pod stromy v lese. Mají rády stín a kyselou půdu. Jsou oblíbenou potravou ptáků, medvědů i lidí.",
  },
  {
    type: "select_one",
    question: "Jaká rostlina pokrývá lesní půdu zeleným kobercem a zadržuje vláhu?",
    correctAnswer: "Mech",
    options: ["Mech", "Jetel", "Chrpa", "Rákos"],
    hints: [
      "Tato zelená rostlina nemá kořeny ani květy, pokrývá kameny a stromy.",
      "V lese ho najdeme na vlhkých místech — je měkký na dotek.",
    ],
    explanation:
      "Mech roste v lese na vlhkých místech, na kamenech i kmenech stromů. Zadržuje vodu v půdě a poskytuje úkryt malým živočichům.",
  },
  {
    type: "select_one",
    question: "Které obilí roste na poli?",
    correctAnswer: "Pšenice",
    options: ["Pšenice", "Borůvka", "Pampeliška", "Rákos"],
    hints: [
      "Z tohoto obilí se mele mouka na chleba.",
      "Na poli vidíme zlaté klasy v létě.",
    ],
    explanation:
      "Pšenice je nejdůležitější obilnina pěstovaná na polích. Z jejích zrn se mele mouka, ze které pečeme chleba a rohlíky.",
  },
  {
    type: "select_one",
    question: "Jaký pták žije na polích a hnízdí přímo v zemi?",
    correctAnswer: "Koroptev",
    options: ["Koroptev", "Volavka", "Sova", "Čáp"],
    hints: [
      "Toto hnědé ptáče sedí skrytě v mezích a obilí.",
      "Hnízdí na zemi mezi trávou a obilím — vejce klade přímo do jamky v zemi.",
    ],
    explanation:
      "Koroptev je polní pták, který hnízdí přímo na zemi v obilí nebo v mezích. Splývá s prostředím díky hnědému zbarvení.",
  },
  {
    type: "select_one",
    question: "Která modrá rostlina roste na polích jako plevel?",
    correctAnswer: "Chrpa modrá",
    options: ["Chrpa modrá", "Jetel", "Borůvka", "Leknín"],
    hints: [
      "Je to modrý kvítek, který roste mezi obilím.",
      "Říkáme jí polní kvítí — má modré okvětní lístky.",
    ],
    explanation:
      "Chrpa modrá je typická polní rostlina s modrými květy. Roste v obilí jako plevel. V minulosti byla na polích běžná, dnes je vzácnější.",
  },
  {
    type: "select_one",
    question: "Kde žije vydra?",
    correctAnswer: "U vody — v řekách a rybnících",
    options: [
      "U vody — v řekách a rybnících",
      "V lese na stromech",
      "Na poli v obilí",
      "Na louce v trávě",
    ],
    hints: [
      "Toto zvíře je výborný plavec a loví ryby.",
      "Žije v noře v břehu řeky nebo rybníka.",
    ],
    explanation:
      "Vydra říční žije u vody — v řekách, potocích a rybnících. Je to výborný plavec a loví ryby, raky a žáby. Staví si noru v břehu.",
  },
  {
    type: "select_one",
    question: "Jak se jmenuje plovoucí rostlina s bílými nebo žlutými květy na rybníku?",
    correctAnswer: "Leknín",
    options: ["Leknín", "Jetel", "Pampeliška", "Mech"],
    hints: [
      "Tato rostlina plovoucí na hladině má velké kulaté listy.",
      "V pohádkách na ní sedávají žabky.",
    ],
    explanation:
      "Leknín je vodní rostlina, jejíž listy a květy plavou na hladině rybníků a jezer. Kořeny má zapuštěny v bahnitém dně. Jsou domovem pro hmyz a žáby.",
  },
  {
    type: "select_one",
    question: "Kdo je producent v potravním řetězci?",
    correctAnswer: "Rostlina, která vyrábí potravu fotosyntézou",
    options: [
      "Rostlina, která vyrábí potravu fotosyntézou",
      "Ježek, který loví hmyz",
      "Houba, která rozkládá odumřelé listy",
      "Liška, která loví ježka",
    ],
    hints: [
      "Producent = ten, kdo vyrábí potravu. Kdo si sám vyrábí jídlo?",
      "Rostliny využívají sluneční světlo k výrobě potravy — fotosyntéza.",
    ],
    explanation:
      "Producent je organismus, který si sám vyrábí potravu fotosyntézou — jsou to rostliny. Tvoří základ každého potravního řetězce.",
  },
  {
    type: "select_one",
    question: "Jaký je správný potravní řetězec na louce?",
    correctAnswer: "Tráva → kobylka → ježek → liška",
    options: [
      "Tráva → kobylka → ježek → liška",
      "Liška → ježek → kobylka → tráva",
      "Kobylka → tráva → liška → ježek",
      "Ježek → liška → tráva → kobylka",
    ],
    hints: [
      "Potravní řetězec začíná vždy rostlinou — ta je první.",
      "Kdo jí koho? Kobylka jí trávu, ježek jí kobylku, liška jí ježka.",
    ],
    explanation:
      "Potravní řetězec na louce: tráva (producent) → kobylka (konzument 1. řádu) → ježek (konzument 2. řádu) → liška (konzument 3. řádu). Šipka znamená „je snědena\".",
  },
  {
    type: "select_one",
    question: "Co jsou rozkladači v ekosystému?",
    correctAnswer: "Houby a bakterie, které rozkládají odumřelé organismy",
    options: [
      "Houby a bakterie, které rozkládají odumřelé organismy",
      "Rostliny, které vyrábějí kyslík",
      "Draví ptáci na vrcholu potravního řetězce",
      "Živočichové, kteří se živí bylinami",
    ],
    hints: [
      "Rozkladači pracují v půdě a rozkládají mrtvé listy, dřevo a zvířata.",
      "Houba v lese — co asi dělá s odumřelým dřevem?",
    ],
    explanation:
      "Rozkladači (houby a bakterie) rozkládají odumřelé organismy na jednoduché látky, které se vracejí zpět do půdy. Jsou nezbytní pro koloběh látek v přírodě.",
  },
  {
    type: "select_one",
    question: "Kdo je konzument v potravním řetězci?",
    correctAnswer: "Živočich, který se živí jinými organismy",
    options: [
      "Živočich, který se živí jinými organismy",
      "Rostlina, která fotosyntézou vyrábí potravu",
      "Houba, která rozkládá mrtvé dřevo",
      "Bakterie v půdě",
    ],
    hints: [
      "Konzumovat = jíst. Konzument jí jiné organismy.",
      "Kobylka jí trávu — je to konzument. Tráva si vyrábí potravu sama.",
    ],
    explanation:
      "Konzument je živočich, který musí přijímat potravu z jiných organizmů — sám ji nedokáže vyrobit. Patří sem býložravci, masožravci i všežravci.",
  },
  {
    type: "match_pairs",
    question: "Spoj každé zvíře s prostředím, kde žije.",
    correctAnswer: "match",
    pairs: [
      { left: "kobylka", right: "louka" },
      { left: "veverka", right: "les" },
      { left: "kapr", right: "rybník" },
      { left: "koroptev", right: "pole" },
    ],
    hints: [
      "Kobylka skáče v trávě na louce. Veverka šplhá po stromech v lese.",
      "Kapr je ryba — žije ve vodě. Koroptev hnízdí na zemi v obilí.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj každé zvíře s prostředím, kde žije.",
    correctAnswer: "match",
    pairs: [
      { left: "sova", right: "les" },
      { left: "volavka", right: "rybník" },
      { left: "čáp", right: "louka" },
      { left: "bažant", right: "pole" },
    ],
    hints: [
      "Sova loví v lese v noci. Volavka stojí nehnutě u vody a čeká na rybu.",
      "Čáp loví žáby na mokrých loukách. Bažant se schovává v obilí na poli.",
    ],
  },
  {
    type: "match_pairs",
    question: "Spoj každý organismus s jeho rolí v ekosystému.",
    correctAnswer: "match",
    pairs: [
      { left: "tráva", right: "producent" },
      { left: "kobylka", right: "konzument" },
      { left: "houba", right: "rozkladač" },
      { left: "srnec", right: "konzument" },
    ],
    hints: [
      "Producent si vyrábí potravu sám — fotosyntézou. Konzument jí jiné organismy.",
      "Houba rozkládá odumřelé věci v půdě — je to rozkladač.",
    ],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
}

export const EKOSYSTEMYPOLLOUKAES: TopicMetadata[] = [
  {
    id: "g3-prvouka-rozmanitost-prirody-ekosystemy-pole-louka-les-voda-jednoduche-ekosystemy",
    title: "Ekosystémy: pole, louka, les, voda",
    studentTitle: "Příroda kolem nás",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Ekosystémy",
    briefDescription: "Poznáš různá přírodní prostředí a jejich obyvatele.",
    illustrationDesc:
      "dítě stojí na okraji lesa s výhledem na louku, rybník a pole, v ruce drží lupu a pozoruje kobylku na stéblu trávy",
    keywords: [
      "ekosystém",
      "louka",
      "les",
      "pole",
      "rybník",
      "voda",
      "kobylka",
      "motýl",
      "krtok",
      "pampeliška",
      "jetel",
      "čáp",
      "srnec",
      "veverka",
      "sova",
      "liška",
      "houby",
      "mech",
      "borůvky",
      "bažant",
      "koroptev",
      "obilniny",
      "mák",
      "chrpa",
      "vydra",
      "kapr",
      "rákos",
      "leknín",
      "volavka",
      "producent",
      "konzument",
      "rozkladač",
      "potravní řetězec",
    ],
    goals: [
      "Pojmenovat alespoň 3 typické organismy louky, lesa, pole a vody.",
      "Vysvětlit, co je producent, konzument a rozkladač.",
      "Sestavit jednoduchý potravní řetězec (tráva → kobylka → ježek → liška).",
      "Přiřadit zvíře ke správnému ekosystému.",
    ],
    boundaries: [
      "Jednoduchá příroda pro 3. třídu — bez složitých ekologických modelů.",
      "Potravní řetězec jen na 3–4 článcích, bez energetických pyramid.",
      "Bez latinských názvů.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Louka: kobylka, motýl, pampeliška, čáp. Les: srnec, veverka, sova, houby, mech, borůvky. Pole: bažant, koroptev, obilniny, chrpa. Voda: vydra, kapr, leknín, volavka.",
      steps: [
        "Zamysli se, kde dané zvíře nebo rostlinu vídáme.",
        "Louka = travnatá plocha s bylinkami. Les = stromy, stín, houby.",
        "Pole = orná půda s obilím a zeleninou. Voda/rybník = mokré prostředí.",
        "Potravní řetězec: začíná rostlinou (producent), pokračuje živočichy (konzumenti).",
      ],
      commonMistake:
        "Čáp loví na loukách, ne v lese. Volavka stojí u vody, ne na poli. Kobylka žije na louce, ne na poli.",
      example:
        "Potravní řetězec louky: tráva → kobylka → ježek → liška. Tráva je producent, ostatní jsou konzumenti.",
    },
  },
];
