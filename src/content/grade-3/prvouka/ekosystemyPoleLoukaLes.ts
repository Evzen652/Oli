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
    question: "Kde žije kobylka?",
    correctAnswer: "Na louce",
    options: ["Na louce", "V lese", "Na poli", "V rybníku"],
    hints: [
      "Kobylka žije tam, kde je hodně vysoké trávy a divokých bylin, ne mezi stromy.",
      "Louka je prostředí s vysokou travou a bylinkami.",
    ],
    explanation:
      "Kobylka žije na louce, kde se živí trávou a bylinkami. Louka je její přirozené prostředí plné hmyzu.",
  },
  {
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
    question: "Kdo je producent v potravním řetězci?",
    correctAnswer: "Rostlina, která vyrábí potravu fotosyntézou",
    options: [
      "Rostlina, která vyrábí potravu fotosyntézou",
      "Ježek, který loví hmyz",
      "Houba, která rozkládá odumřelé listy",
      "Liška, která loví ježka",
    ],
    hints: [
      "Producent = ten, kdo si dokáže sám zajistit jídlo, aniž by musel něco lovit nebo rozkládat.",
      "Rostliny využívají sluneční světlo k výrobě potravy — fotosyntéza.",
    ],
    explanation:
      "Producent je organismus, který si sám vyrábí potravu fotosyntézou — jsou to rostliny. Tvoří základ každého potravního řetězce.",
  },
  {
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

// A10 (kolo 2 pilot): disjunkce L1/L2/L3 s minimálně 8 unikátními
// úlohami per tier. Před: gen ignoroval level a vracel 12 z 18 —
// vytvářelo dojem opakující se úlohy napříč sezeními.
//
// L1 — identifikace: kdo kde žije (louka/les/pole/voda)
// L2 — pojmy: producent, konzument, rozkladač, matching prostředí
// L3 — potravní řetězce, ekologické role, transfer

const POOL_L1_IDS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// (0..10 = kobylka, čáp, pampeliška, veverka, borůvky, mech, pšenice, koroptev,
//  chrpa modrá, vydra, leknín)
const POOL_L2_IDS: number[] = [11, 13, 14];
// (11 = producent, 13 = rozkladači, 14 = konzument) — match_pairs 15/16/17
//   nejsou zahrnuty (topic.inputType = "select_one" a generator-validation
//   vyžaduje options u všech tasků). L2 doplněno o POOL_L2_EXTRA (select_one).
const POOL_L3_IDS: number[] = [12];
// (12 = potravní řetězec louky)

// L2 pool doplněný o select_one úlohy testující stejné dovednosti jako
// match_pairs (přiřazení organismu k prostředí + pojmy).
const POOL_L2_EXTRA: PracticeTask[] = [
  {
    question: "Ve kterém prostředí žije sova?",
    correctAnswer: "V lese",
    options: ["V lese", "Na poli", "V rybníku", "Na písečné pláži"],
    hints: ["Sova loví v noci ptáky a myši mezi stromy.", "Denní úkryt: dutina stromu."],
    explanation: "Sova žije v lese — přes den se ukrývá v dutinách stromů, v noci loví myši a další drobné živočichy.",
  },
  {
    question: "Ve kterém prostředí žije volavka?",
    correctAnswer: "U vody (rybník, řeka)",
    options: ["U vody (rybník, řeka)", "V hustém lese", "Na písečné poušti", "V horských dutinách"],
    hints: ["Volavka stojí dlouho nehnutě a čeká na kořist.", "Loví ryby a žáby."],
    explanation: "Volavka žije u vody — na rybnících, řekách a mokřadech. Loví ryby, žáby a hmyz.",
  },
  {
    question: "Ve kterém prostředí žije bažant?",
    correctAnswer: "Na poli a v mezích",
    options: ["Na poli a v mezích", "Na moři", "V rybníku", "Na vrcholu hor"],
    hints: ["Bažant se schovává v obilí.", "Barevný samec je snadno rozeznatelný."],
    explanation: "Bažant obývá pole, meze a okraje lesů. Hnízdí na zemi a živí se semeny a hmyzem.",
  },
  {
    question: "Kdo je v ekosystému býložravec (konzument 1. řádu)?",
    correctAnswer: "Srnec (jí trávu a listy)",
    options: [
      "Srnec (jí trávu a listy)",
      "Sova (loví myši)",
      "Houba (rozkládá dřevo)",
      "Tráva (fotosyntéza)",
    ],
    hints: ["Býložravec = jí rostliny.", "Konzument 1. řádu je hned nad producentem."],
    explanation: "Srnec se živí trávou a listy → býložravec, konzument 1. řádu. Sova je masožravec, houba rozkladač, tráva producent.",
  },
  {
    question: "Který organismus je masožravec (konzument 2. řádu)?",
    correctAnswer: "Liška",
    options: [
      "Kráva",
      "Liška",
      "Pampeliška",
      "Bakterie v půdě",
    ],
    hints: ["Masožravec loví jiné živočichy.", "Konzument 2. řádu je nad býložravci."],
    explanation: "Liška loví myši, zajíce, drobné ptáky → masožravec, konzument 2. řádu.",
  },
];

// L3 pool s doplněnými transfer úlohami (min. 8 unikátních)
const POOL_L3_EXTRA: PracticeTask[] = [
  {
    question: "Kdyby v ekosystému zmizely všechny rostliny, co by se stalo nejdřív?",
    correctAnswer: "Nejdřív by vyhynuli býložravci (nemají co jíst).",
    options: [
      "Nejdřív by vyhynuli býložravci (nemají co jíst).",
      "Nejdřív by vyhynuli masožravci.",
      "Nic by se nestalo — zvířata by jedla něco jiného.",
      "Nejdřív by vyhynuly houby.",
    ],
    hints: [
      "Potravní řetězec začíná rostlinou (producent). Kdo první ztratí potravu?",
    ],
    explanation:
      "Bez rostlin (producentů) nemají býložravci co jíst — vymřeli by první. Pak by přišli masožravci (nemají co lovit).",
  },
  {
    question: "Proč jsou rozkladači nezbytní pro ekosystém?",
    correctAnswer: "Vrací živiny z odumřelých organismů zpět do půdy pro rostliny.",
    options: [
      "Loví v lese a na poli drobné škůdce.",
      "Vrací živiny z odumřelých organismů zpět do půdy pro rostliny.",
      "Poskytují potravu velkým masožravcům.",
      "Vyrábějí kyslík pomocí fotosyntézy.",
    ],
    hints: [
      "Rozkladači = houby, bakterie. Co dělají s mrtvým dřevem a listím?",
    ],
    explanation:
      "Rozkladači rozkládají odumřelé organismy na jednoduché látky, které se vracejí do půdy. Bez nich by se hromadily mrtvé věci a rostliny by neměly z čeho růst.",
  },
  {
    question: "V lese ubyly veverky. Jaký dopad to pravděpodobně bude mít?",
    correctAnswer: "Ubude šíření semen stromů (žaludy, ořechy).",
    options: [
      "Ubude šíření semen stromů (žaludy, ořechy).",
      "Zvýší se počet ryb v rybnících.",
      "Přibude obilí na polích.",
      "Ubude čápů, protože se jim ubere prostor pro hnízdo.",
    ],
    hints: [
      "Veverky nosí a zakopávají žaludy a ořechy. Co se stane, když je zakopanou nesežerou?",
    ],
    explanation:
      "Veverky zakopávají žaludy a ořechy — část zapomenou a z těch semen pak vyrostou nové stromy. Bez veverek se stromy hůře šíří.",
  },
  {
    question: "Který ekosystém má nejvíc druhů zvířat a rostlin (biodiverzitu)?",
    correctAnswer: "Přirozený smíšený les (různé stromy, půda, dutiny).",
    options: [
      "Přirozený smíšený les (různé stromy, půda, dutiny).",
      "Pole s jednou plodinou (monokultura).",
      "Asfaltové parkoviště.",
      "Pouštní písek bez rostlin.",
    ],
    hints: [
      "Biodiverzita = kolik různých druhů žije pohromadě. Kde je nejvíc úkrytů a druhů potravy?",
    ],
    explanation:
      "Přirozený smíšený les má rozmanité stromy, keře, dutiny, mrtvé dřevo — poskytuje úkryt a potravu spoustě druhů. Monokultura (jeden druh plodiny na poli) má málo úkrytů.",
  },
  {
    question: "Rybník se změnil na blátivou louži. Co se stalo s ekosystémem?",
    correctAnswer: "Vodní organismy zmizely, přišli živočichové vlhkého bláta.",
    options: [
      "Vodní organismy zmizely, přišli živočichové vlhkého bláta.",
      "Přišli lední medvědi a tučňáci.",
      "Nic se nezměnilo, rybí druhy jsou stejné.",
      "Přišli druhy pouštních plazů.",
    ],
    hints: [
      "Vysychající rybník už není domov pro ryby. Kdo se naopak cítí dobře v blátě?",
    ],
    explanation:
      "Když ubyde voda, ryby a leknín zmizí (nemají kde žít). Naopak přijdou žáby, hmyz, ptáci lovící v blátě. Ekosystém se změní na jiný typ.",
  },
  {
    question: "Sova ulovila myš. Jaká je sova v tomto řetězci?",
    correctAnswer: "Konzument 2. řádu.",
    options: [
      "Producent.",
      "Konzument 2. řádu.",
      "Rozkladač.",
      "Konzument 1. řádu.",
    ],
    hints: [
      "Zeptej se, co sova ulovila — a čím se to zvíře samo živilo.",
    ],
    explanation:
      "Myš jí obilí (konzument 1. řádu, býložravec). Sova loví myš (konzument 2. řádu, masožravec). Sova stojí výš v potravním řetězci.",
  },
  {
    question: "Proč nese kobylka podobnou barvu jako tráva?",
    correctAnswer: "Splývá s prostředím — ochrana před predátory (mimikry).",
    options: [
      "Splývá s prostředím — ochrana před predátory (mimikry).",
      "Aby ji viděla čáp a mohla ji sníst.",
      "Nesplývá s prostředím, tráva má náhodou stejnou barvu.",
      "Kvůli fotosyntéze.",
    ],
    hints: [
      "Kobylka je kořist. Co jí pomůže, aby si jí nevšimli predátoři (čápi, ptáci)?",
    ],
    explanation:
      "Zelená barva pomáhá kobylce splývat s trávou — predátoři ji hůř vidí. Tomu se říká ochranné zbarvení (mimikry).",
  },
  {
    question: "Který potravní řetězec je SPRÁVNĚ z lesa?",
    correctAnswer: "Bukvice → myš → sova.",
    options: [
      "Bukvice → myš → sova.",
      "Sova → myš → bukvice.",
      "Myš → bukvice → sova.",
      "Bukvice → sova → myš.",
    ],
    hints: [
      "Řetězec začíná rostlinou. Šipka znamená: „je snědeno“.",
    ],
    explanation:
      "Bukvice (plod buku) → sní myš (konzument 1) → uloví sova (konzument 2). Rostlina musí být první, dravec poslední.",
  },
];

function gen(level: number): PracticeTask[] {
  const ids = level === 1 ? POOL_L1_IDS : level === 2 ? POOL_L2_IDS : POOL_L3_IDS;
  const basePool = ids.map((i) => POOL[i]).filter(Boolean);
  const pool =
    level === 2 ? [...basePool, ...POOL_L2_EXTRA] :
    level === 3 ? [...basePool, ...POOL_L3_EXTRA] :
    basePool;
  return shuffle(pool).slice(0, 12);
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
