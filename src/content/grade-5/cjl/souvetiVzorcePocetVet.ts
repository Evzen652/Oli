import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Co je souvětí?",
    correctAnswer: "věta složená ze dvou nebo více vět",
    options: [
      "jedna krátká věta",
      "věta složená ze dvou nebo více vět",
      "věta s mnoha přídavnými jmény",
      "věta s otazníkem",
    ],
    hints: ["Souvětí = více vět spojených dohromady."],
  },
  {
    question: "Kolik vět obsahuje souvětí 'Šel domů, protože byl unavený.'?",
    correctAnswer: "2 věty",
    options: ["1 větu", "2 věty", "3 věty", "4 věty"],
    hints: ["Šel domů = 1. věta. Byl unavený = 2. věta."],
  },
  {
    question: "Které slovo spojuje věty v souvětí 'Přišel a sedl si.'?",
    correctAnswer: "a",
    options: ["přišel", "a", "sedl", "si"],
    hints: ["Spojka 'a' pojí obě věty."],
  },
  {
    question: "Která z těchto vět je souvětí?",
    correctAnswer: "Přišel domů a šel spát.",
    options: [
      "Přišel domů.",
      "Přišel domů a šel spát.",
      "Velmi rychle.",
      "Pes a kočka.",
    ],
    hints: ["Souvětí obsahuje dvě slovesa (přišel + šel)."],
  },
  {
    question: "Spojka 'protože' je:",
    correctAnswer: "podřadící – spojuje hlavní a vedlejší větu",
    options: [
      "souřadící – spojuje dvě rovnocenné věty",
      "podřadící – spojuje hlavní a vedlejší větu",
      "příslovce",
      "citoslovce",
    ],
    hints: ["'Protože' uvádí důvod – vedlejší větu příčinnou."],
  },
  {
    question: "Spojka 'ale' je:",
    correctAnswer: "souřadící – spojuje dvě rovnocenné věty",
    options: [
      "podřadící – spojuje hlavní a vedlejší větu",
      "souřadící – spojuje dvě rovnocenné věty",
      "příslovce",
      "předložka",
    ],
    hints: ["Ale = odporovací souřadící spojka (Přišel, ale byl unavený)."],
  },
  {
    question: "Kolik vět je v souvětí 'Jedl, pil a zpíval, dokud mu nezbyly síly.'?",
    correctAnswer: "3 věty",
    options: ["2 věty", "3 věty", "4 věty", "1 věta"],
    hints: ["Jedl – pil a zpíval – dokud mu nezbyly síly = 3 části."],
  },
  {
    question: "Spojka 'nebo' spojuje:",
    correctAnswer: "dvě možnosti – souřadící věty vylučovací",
    options: [
      "příčinu a důsledek",
      "dvě možnosti – souřadící věty vylučovací",
      "čas a podmínku",
      "přirovnání",
    ],
    hints: ["'Nebo' = výběr mezi možnostmi."],
  },
  {
    question: "Spojka 'když' je:",
    correctAnswer: "podřadící – uvádí vedlejší větu časovou nebo podmínkovou",
    options: [
      "souřadící – spojuje rovnocenné věty",
      "podřadící – uvádí vedlejší větu časovou nebo podmínkovou",
      "příslovce",
      "citoslovce",
    ],
    hints: ["'Když přijdeš...' = vedlejší věta."],
  },
  {
    question: "Souřadící spojky v souvětí jsou například:",
    correctAnswer: "a, ale, nebo, proto, i",
    options: [
      "že, když, protože, aby, který",
      "a, ale, nebo, proto, i",
      "nad, pod, před, za",
      "hodně, málo, dost",
    ],
    hints: ["Souřadící = obě věty jsou si rovnocenné."],
  },
  {
    question: "Podřadící spojky v souvětí jsou například:",
    correctAnswer: "že, aby, protože, když, který",
    options: [
      "a, ale, nebo, proto",
      "že, aby, protože, když, který",
      "nad, pod, před",
      "já, ty, on",
    ],
    hints: ["Podřadící = jedna věta závisí na druhé (je podřazena)."],
  },
  {
    question: "Jaký vzorec odpovídá souvětí 'Přišel, ale nezdravil.'?",
    correctAnswer: "V1, ale V2 (souřadící souvětí)",
    options: [
      "V1, že V2 (podřadící)",
      "V1, ale V2 (souřadící souvětí)",
      "V1 + V2 + V3",
      "jen jedna věta",
    ],
    hints: ["Ale = souřadící → obě věty jsou rovnocenné."],
  },
  {
    question: "Čárka v souvětí se píše:",
    correctAnswer: "před spojkami podřadícími a některými souřadícími (ale, proto)",
    options: [
      "nikdy",
      "jen na konci souvětí",
      "před spojkami podřadícími a některými souřadícími (ale, proto)",
      "za každým slovesem",
    ],
    hints: ["Před 'že, aby, protože, ale, proto' píšeme čárku."],
  },
  {
    question: "Kolik vět je v souvětí 'Vím, že přijdeš, když budeš mít čas.'?",
    correctAnswer: "3 věty",
    options: ["2 věty", "3 věty", "4 věty", "1 věta"],
    hints: ["Vím – že přijdeš – když budeš mít čas = 3 věty."],
  },
  {
    question: "Která z vět je jednoduchou větou (ne souvětím)?",
    correctAnswer: "Pes hlasitě zaštěkal.",
    options: [
      "Pes zaštěkal a utekl.",
      "Šel domů, protože byl unavený.",
      "Pes hlasitě zaštěkal.",
      "Jana zpívá a Pavel tancuje.",
    ],
    hints: ["Jednoduchá věta má jen jedno sloveso (zaštěkal)."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jaký je rozdíl mezi souřadícím a podřadícím souvětím?",
    correctAnswer: "souřadící = dvě rovnocenné věty; podřadící = jedna závisí na druhé",
    options: [
      "souřadící má více vět, podřadící jen dvě",
      "souřadící = dvě rovnocenné věty; podřadící = jedna závisí na druhé",
      "v souřadícím není spojka",
      "podřadící se píše bez čárky",
    ],
    hints: ["Souřadí = vedle sebe. Podřadí = jedna pod druhou (závislá)."],
  },
  {
    question: "Ve větě 'Šel do školy, ačkoli byl nemocný.' je spojka 'ačkoli':",
    correctAnswer: "podřadící – přípustková spojka",
    options: [
      "souřadící",
      "podřadící – přípustková spojka",
      "příslovce",
      "předložka",
    ],
    hints: ["'Ačkoli' = přestože – uvádí přípustkovou vedlejší větu."],
  },
  {
    question: "Ve větě 'Bude pršet, proto vezmu deštník.' je spojka 'proto':",
    correctAnswer: "souřadící – důsledková spojka",
    options: [
      "podřadící",
      "souřadící – důsledková spojka",
      "příslovce",
      "citoslovce",
    ],
    hints: ["Proto = výsledek/důsledek. Obě věty jsou rovnocenné."],
  },
  {
    question: "Kolik vět je v souvětí 'Doma bylo ticho, protože všichni spali a nikdo nerušil.'?",
    correctAnswer: "3 věty",
    options: ["2 věty", "3 věty", "4 věty", "5 vět"],
    hints: ["Bylo ticho – protože spali – a nikdo nerušil = 3 věty."],
  },
  {
    question: "Napište vzorec souvětí 'Nešel ven, protože pršelo.':",
    correctAnswer: "HV, PV (hlavní věta, vedlejší věta příčinná)",
    options: [
      "V1 + V2 souřadící",
      "HV, PV (hlavní věta, vedlejší věta příčinná)",
      "PV + HV",
      "HV a HV",
    ],
    hints: ["Protože = podřadící → hlavní věta + vedlejší věta."],
  },
  {
    question: "Ve větě 'Sněžilo, a přesto šli na procházku.' – kolik vět?",
    correctAnswer: "2 věty",
    options: ["1 věta", "2 věty", "3 věty", "4 věty"],
    hints: ["Sněžilo = 1. věta. Šli na procházku = 2. věta."],
  },
  {
    question: "Spojka 'aby' uvádí vedlejší větu:",
    correctAnswer: "účelovou – vyjadřuje cíl nebo záměr",
    options: [
      "časovou",
      "příčinnou",
      "účelovou – vyjadřuje cíl nebo záměr",
      "podmínkovou",
    ],
    hints: ["'Aby' = pro daný účel (Učím se, aby...)."],
  },
  {
    question: "Jakou spojkou je spojena vedlejší věta příslovečná podmínková?",
    correctAnswer: "kdyby / jestli / pokud",
    options: [
      "protože / jelikož",
      "kdyby / jestli / pokud",
      "ačkoli / přestože",
      "než / jakmile",
    ],
    hints: ["Podmínka: Jestli budeš hodný... / Kdyby přišel..."],
  },
  {
    question: "Ve větě 'Vím, kam jdeš.' je 'kam jdeš' vedlejší věta:",
    correctAnswer: "předmětná",
    options: [
      "časová",
      "předmětná",
      "příčinná",
      "podmínková",
    ],
    hints: ["Vím co? Kam jdeš. – vedlejší věta předmětná."],
  },
  {
    question: "Které z těchto souvětí je souřadící?",
    correctAnswer: "Jana zpívá a Pavel hraje na kytaru.",
    options: [
      "Vím, že přijdeš.",
      "Jana zpívá a Pavel hraje na kytaru.",
      "Šel domů, protože byl unavený.",
      "Pokud přijdeš, budeme hrát.",
    ],
    hints: ["Spojka 'a' = souřadící → obě věty rovnocenné."],
  },
  {
    question: "Ve větě 'Čítal jsem, dokud nezhaslo světlo.' je 'dokud' spojka:",
    correctAnswer: "podřadící – časová",
    options: [
      "souřadící",
      "podřadící – časová",
      "příslovce",
      "záporová",
    ],
    hints: ["'Dokud' = po dobu, kdy – uvádí vedlejší větu časovou."],
  },
  {
    question: "Kolik vět je v souvětí 'Zima přišla, sníh napadl a děti se radovaly.'?",
    correctAnswer: "3 věty",
    options: ["2 věty", "3 věty", "4 věty", "1 věta"],
    hints: ["Zima přišla – sníh napadl – děti se radovaly = 3 věty."],
  },
  {
    question: "Čárka před spojkou 'a' se píše:",
    correctAnswer: "zpravidla ne, ale záleží na kontextu (nevylučuje se)",
    options: [
      "vždy",
      "zpravidla ne, ale záleží na kontextu (nevylučuje se)",
      "nikdy",
      "jen před posledním 'a'",
    ],
    hints: ["Před 'a' zpravidla čárku nepíšeme (na rozdíl od 'ale', 'proto')."],
  },
  {
    question: "Ve větě 'Nevěděl, zda přijde, nebo ne.' kolik vět?",
    correctAnswer: "2 věty",
    options: ["1 věta", "2 věty", "3 věty", "4 věty"],
    hints: ["Nevěděl = 1. věta. Zda přijde nebo ne = 2. věta (rozvitá)."],
  },
  {
    question: "Jaká je funkce souřadících souvětí slučovacích (a, i, ani)?",
    correctAnswer: "řadí děje za sebou nebo vedle sebe",
    options: [
      "vyjadřují příčinu",
      "řadí děje za sebou nebo vedle sebe",
      "vyjadřují podmínku",
      "vyjadřují přípustku",
    ],
    hints: ["Přišel a sedl si – děje jdou za sebou."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jak se nazývá souvětí, kde věty mají vztah příčiny a důsledku spojen souřadící spojkou?",
    correctAnswer: "souřadící souvětí důsledkové (proto, tedy, tudíž)",
    options: [
      "podřadící souvětí příčinné",
      "souřadící souvětí důsledkové (proto, tedy, tudíž)",
      "souřadící souvětí odporovací",
      "podřadící souvětí podmínkové",
    ],
    hints: ["Proto/tudíž → důsledek z předchozí věty, ale obě věty jsou rovnocenné."],
  },
  {
    question: "Kolik vět je v souvětí 'Jakmile dorazili, začali pracovat, ačkoli byli unaveni.'?",
    correctAnswer: "3 věty",
    options: ["2 věty", "3 věty", "4 věty", "5 vět"],
    hints: ["Dorazili – začali pracovat – ačkoli unaveni = 3 věty."],
  },
  {
    question: "Jak se nazývá vedlejší věta ve větě 'Věřím, že uspěješ.'?",
    correctAnswer: "vedlejší věta předmětná",
    options: [
      "vedlejší věta přívlastková",
      "vedlejší věta předmětná",
      "vedlejší věta časová",
      "vedlejší věta podmínková",
    ],
    hints: ["Věřím čemu? Že uspěješ. – předmět = předmětná věta."],
  },
  {
    question: "Jak se nazývá vedlejší věta ve větě 'Chlapec, který přišel včera, je môj kamarád.'?",
    correctAnswer: "vedlejší věta přívlastková",
    options: [
      "vedlejší věta předmětná",
      "vedlejší věta přívlastková",
      "vedlejší věta časová",
      "vedlejší věta podmínková",
    ],
    hints: ["Který přišel = přívlastek k podmětu 'chlapec'."],
  },
  {
    question: "Napište vzorec souvětí: 'Nevím, kdy přijde, protože mi nic neřekl.'",
    correctAnswer: "HV – PV(kdy) – PV(protože)",
    options: [
      "HV + HV + HV",
      "HV – PV(kdy) – PV(protože)",
      "PV – HV – PV",
      "HV + PV souřadící",
    ],
    hints: ["Nevím = HV. Kdy přijde = PV předmětná. Protože = PV příčinná."],
  },
  {
    question: "Proč dáváme čárku před 'protože', 'ačkoli', 'aby', 'když'?",
    correctAnswer: "tyto spojky uvádějí vedlejší větu, která se odděluje čárkou",
    options: [
      "protože jsou delší",
      "tyto spojky uvádějí vedlejší větu, která se odděluje čárkou",
      "pravidlo neexistuje – záleží na autorovi",
      "proto, aby věta byla hezčí",
    ],
    hints: ["Před podřadícími spojkami píšeme čárku."],
  },
  {
    question: "Ve větě 'Dej mi vědět, přijde-li vlak včas.' je 'přijde-li' spojena:",
    correctAnswer: "podmínkově – -li připojuje vedlejší větu podmínkovou",
    options: [
      "souřadící spojkou",
      "podmínkově – -li připojuje vedlejší větu podmínkovou",
      "příslovcem",
      "záporovou částicí",
    ],
    hints: ["'-li' = starší forma podmínkové spojky (pokud přijde = přijde-li)."],
  },
  {
    question: "Kolik vedlejších vět je v souvětí: 'Věděl, že je čas jít, i když se mu nechtělo.'?",
    correctAnswer: "2 vedlejší věty (že je čas jít + i když se mu nechtělo)",
    options: [
      "1 vedlejší věta",
      "2 vedlejší věty (že je čas jít + i když se mu nechtělo)",
      "3 vedlejší věty",
      "žádná vedlejší věta",
    ],
    hints: ["Že + i když = dvě podřadící spojky = dvě vedlejší věty."],
  },
  {
    question: "Jak se nazývá vedlejší věta 'jak to udělal' ve větě 'Viděl jsem, jak to udělal.'?",
    correctAnswer: "vedlejší věta předmětná (viděl co? jak to udělal)",
    options: [
      "vedlejší věta způsobová",
      "vedlejší věta předmětná (viděl co? jak to udělal)",
      "vedlejší věta časová",
      "vedlejší věta přívlastková",
    ],
    hints: ["Viděl co? Jak to udělal = předmět = předmětná."],
  },
  {
    question: "Ve složeném souvětí s více vedlejšími větami – jak se vyznačuje řazení vět?",
    correctAnswer: "čísly nebo symboly: HV, PV1, PV2...",
    options: [
      "písmeny abecedy",
      "čísly nebo symboly: HV, PV1, PV2...",
      "závorkami",
      "v češtině se to nevyznačuje",
    ],
    hints: ["Při rozboru souvětí označujeme věty čísly a typy."],
  },
  {
    question: "Co je rozvité souvětí?",
    correctAnswer: "souvětí se třemi a více větami",
    options: [
      "souvětí s dlouhými slovy",
      "souvětí se třemi a více větami",
      "souvětí s přídavnými jmény",
      "souvětí s více podměty",
    ],
    hints: ["Rozvité = rozvinuté = hodně vět."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const SOUVETIVZORCEPOCETVET: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-skladba-souveti-vzorce-pocet-vet",
    rvpNodeId: "g5-cjl-jazykova-vychova-skladba-souveti-vzorce-pocet-vet",
    title: "Souvětí – vzorce, počet vět",
    studentTitle: "Souvětí",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Poznáš souvětí a spočítáš věty v souvětí.",
    keywords: ["souvětí", "souřadící", "podřadící", "spojky", "věty"],
    goals: [
      "Poznat souvětí a spočítat věty v něm",
      "Rozlišit souřadící a podřadící souvětí",
      "Určit typ spojky v souvětí",
    ],
    boundaries: [
      "Neprobíráme podrobný rozbor všech typů vedlejších vět",
      "Bez složité grafické analýzy",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Souvětí = dvě nebo více vět. Souřadící spojky (a, ale, nebo) – věty jsou si rovnocenné. Podřadící spojky (že, protože, když) – jedna věta závisí na druhé.",
      steps: [
        "Najdi všechna slovesa v souvětí – kolik sloves, tolik vět.",
        "Najdi spojku – souřadící nebo podřadící?",
        "Souřadící → obě věty rovnocenné. Podřadící → jedna závisí na druhé.",
      ],
      commonMistake: "Žáci počítají čárky místo sloves. Čárka nerovná se věta – záleží na slovesech.",
      example: "Šel domů, protože byl unavený. = 2 věty (šel + byl). Spojka protože = podřadící.",
    },
  },
];
