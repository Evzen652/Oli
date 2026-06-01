import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Kdy Hitler napadl Polsko a začala tak druhá světová válka?",
    correctAnswer: "1939",
    options: ["1939", "1938", "1941", "1945"],
    hints: ["Válka začala v záři."],
    solutionSteps: ["Německo napadlo Polsko 1. září 1939 → Británie a Francie vyhlásily válku Německu."],
  },
  {
    question: "Kdy Německo obsadilo Čechy a Moravu a vznikl Protektorát?",
    correctAnswer: "15. března 1939",
    options: ["15. března 1939", "1. září 1939", "28. října 1918", "8. května 1945"],
    hints: ["Bylo to ještě před začátkem 2. světové války."],
    solutionSteps: ["15. března 1939 obsadil Hitler české země a vznikl Protektorát Čechy a Morava."],
  },
  {
    question: "Jak se nazývalo území Čech a Moravy pod německou správou v letech 1939–1945?",
    correctAnswer: "Protektorát Čechy a Morava",
    options: [
      "Protektorát Čechy a Morava",
      "Třetí říše",
      "Sudetenland",
      "Slovenský stát",
    ],
    hints: ["Protektorát = chráněné území — ve skutečnosti šlo o okupaci."],
    solutionSteps: ["Protektorát Čechy a Morava existoval 1939–1945 pod německou vojenskou kontrolou."],
  },
  {
    question: "Kdo byl Reinhard Heydrich?",
    correctAnswer: "Zastupující říšský protektor, zavražděn parašutisty v roce 1942",
    options: [
      "Zastupující říšský protektor, zavražděn parašutisty v roce 1942",
      "Hitler vlastní rukou",
      "Prezident Protektorátu",
      "Vrchní velitel Rudé armády",
    ],
    hints: ["Byl velmi krutý — říkalo se mu 'Kat'."],
    solutionSteps: ["Heydrich byl zastupující říšský protektor, zabit českou operací Anthropoid (1942)."],
  },
  {
    question: "Co se stalo s vesnicemi Lidice a Ležáky po atentátu na Heydricha?",
    correctAnswer: "Byly vypáleny a jejich obyvatelé zabiti jako pomsta",
    options: [
      "Byly vypáleny a jejich obyvatelé zabiti jako pomsta",
      "Dostaly od Němců odměnu",
      "Byly ušetřeny",
      "Byly přejmenovány",
    ],
    hints: ["Nacisté je ztotožnili se spoluprací s atentátníky."],
    solutionSteps: ["Nacisté vypálili Lidice (10. 6. 1942) a Ležáky jako odplatu za Heydrichův atentát."],
  },
  {
    question: "Co byl holocaust?",
    correctAnswer: "Systematické vyhlazování Židů nacisty (6 milionů obětí)",
    options: [
      "Systematické vyhlazování Židů nacisty (6 milionů obětí)",
      "Bombardování Londýna",
      "Deportace Čechů do Sibiře",
      "Válka v Tichomoří",
    ],
    hints: ["Šest milionů Židů bylo zabito v koncentračních táborech."],
    solutionSteps: ["Nacistická politika genocidy Židů si vyžádala přes 6 milionů obětí."],
  },
  {
    question: "Jakou roli hrál Terezín za druhé světové války?",
    correctAnswer: "Byl to koncentrační tábor – ghetto pro Židy",
    options: [
      "Byl to koncentrační tábor – ghetto pro Židy",
      "Byl to hlavní stan Hitlera",
      "Byl to přijímací tábor pro uprchlíky",
      "Byl to sídlo Edvarda Beneše",
    ],
    hints: ["Šlo o pevnostní město přeměněné na věznici."],
    solutionSteps: ["Terezín sloužil jako sběrné ghetto pro Židy z Čech, odkud byli deportováni do vyhlazovacích táborů."],
  },
  {
    question: "Kdy Německo kapitulovalo a skončila druhá světová válka v Evropě?",
    correctAnswer: "8. května 1945",
    options: ["8. května 1945", "28. října 1945", "9. května 1945", "1. září 1945"],
    hints: ["Tento den slavíme jako Den vítězství."],
    solutionSteps: ["Německo podepsalo bezpodmínečnou kapitulaci 8. května 1945."],
  },
  {
    question: "Kdo osvobodil západ Čech (Plzeň) v roce 1945?",
    correctAnswer: "Američané",
    options: ["Američané", "Sověti", "Britové", "Poláci"],
    hints: ["Plzeň je na západ od Prahy."],
    solutionSteps: ["Americká armáda osvobodila západ Čech včetně Plzně v květnu 1945."],
  },
  {
    question: "Kdo osvobodil Prahu a východ Čech v roce 1945?",
    correctAnswer: "Sovětská armáda",
    options: ["Sovětská armáda", "Americká armáda", "Britská armáda", "Jugoslávská armáda"],
    hints: ["Přišla z východu — z Ruska."],
    solutionSteps: ["Rudá armáda (SSSR) vstoupila do Prahy 9. května 1945."],
  },
  {
    question: "Co se stalo s Němci žijícími v Sudetech po roce 1945?",
    correctAnswer: "Byli odsunuti (deportováni) z Československa",
    options: [
      "Byli odsunuti (deportováni) z Československa",
      "Dostali vlastní stát v Sudetech",
      "Stali se československými občany",
      "Odešli dobrovolně do SSSR",
    ],
    hints: ["Rozhodnutí padlo na konferenci v Postupimi."],
    solutionSteps: ["Postupimská konference 1945 rozhodla o odsunu sudetských Němců z Československa."],
  },
  {
    question: "Jak se jmenovala operace, při které čeští parašutisté zabili Heydricha?",
    correctAnswer: "Operace Anthropoid",
    options: ["Operace Anthropoid", "Operace Overlord", "Operace Barbarossa", "Operace Valkyrie"],
    hints: ["Parašutisté byli vysazeni z Anglie."],
    solutionSteps: ["Operace Anthropoid — Jan Kubiš a Jozef Gabčík provedli atentát 27. května 1942."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč bylo 15. března 1939 pro Čechy traumatické?",
    correctAnswer: "Nacistické Německo obsadilo Čechy bez války — lidé vstávali do nacistické okupace",
    options: [
      "Nacistické Německo obsadilo Čechy bez války — lidé vstávali do nacistické okupace",
      "Byl to den voleb",
      "Začala cholera",
      "Proběhla povodeň",
    ],
    hints: ["ČSR ztratila nezávislost bez jediného výstřelu."],
    solutionSteps: ["Hitler vstoupil do Prahy 15. 3. 1939 — ČSR přestala existovat bez boje, šokující pro národ."],
  },
  {
    question: "Proč nacisté vypálili Lidice?",
    correctAnswer: "Jako odplatu za atentát na Heydricha — hledali spojení vesnice s atentátníky",
    options: [
      "Jako odplatu za atentát na Heydricha — hledali spojení vesnice s atentátníky",
      "Lidice se vzbouřily vojensky",
      "Lidice ukrývaly Židy",
      "Byl to náhodný útok",
    ],
    hints: ["Teroristická kolektivní odplata za odpor."],
    solutionSteps: ["Nacisté nesprávně obvinili Lidice ze spolupráce s parašutisty — vypálili je jako varování."],
  },
  {
    question: "Proč byl Terezín využíván jako ghetto a ne jen jako vězení?",
    correctAnswer: "Sloužil jako přestupní bod — Židy soustředil před deportací do vyhlazovacích táborů",
    options: [
      "Sloužil jako přestupní bod — Židy soustředil před deportací do vyhlazovacích táborů",
      "Byl to klidný tábor pro dobrovolné ubytování",
      "Byl to trest jen pro zločince",
      "Sloužil jako sídlo Heydricha",
    ],
    hints: ["Z Terezína vedla cesta do Osvětimi a dalších táborů."],
    solutionSteps: ["Terezín = ghetto a transit point → velká část vězňů byla deportována do Osvětimi."],
  },
  {
    question: "Jak holocaustus zasáhl české Židy?",
    correctAnswer: "Z přibližně 80 000 českých Židů deportovaných přežilo méně než 15 000",
    options: [
      "Z přibližně 80 000 českých Židů deportovaných přežilo méně než 15 000",
      "Čeští Židé byli od holocaustu uchráněni",
      "Všichni čeští Židé přežili v Terezíně",
      "Pouze 100 Židů bylo zabito",
    ],
    hints: ["Terezín → Osvětim → smrt pro většinu."],
    solutionSteps: ["Přes 77 000 českých Židů zahynulo, z Terezína přežilo jen asi 20 % deportovaných."],
  },
  {
    question: "Proč se říká, že osvobození ČSR roku 1945 bylo 'rozpolcené'?",
    correctAnswer: "Západ osvobodili Američané, východ Sověti — dvě různé velmoci",
    options: [
      "Západ osvobodili Američané, východ Sověti — dvě různé velmoci",
      "Osvobozování trvalo 5 let",
      "ČSR se osvobodila sama bez cizí pomoci",
      "Osvobodili ji jen Sověti celou",
    ],
    hints: ["Plzeň = Amerika; Praha = SSSR."],
    solutionSteps: ["Americká armáda zastavila na demarkační linii, Sověti osvobodili Prahu a východ Čech."],
  },
  {
    question: "Proč atentát na Heydricha vedl k tak krutým odvetným opatřením?",
    correctAnswer: "Heydrich byl velmi mocný nacistický funkcionář — nacisté zastrašením chtěli potlačit odpor",
    options: [
      "Heydrich byl velmi mocný nacistický funkcionář — nacisté zastrašením chtěli potlačit odpor",
      "Atentátníci utekli a nacisté neměli koho potrestat",
      "Heydrich byl bezvýznamný úředník",
      "Lidice útok plánovaly",
    ],
    hints: ["Terorem chtěli nacisté odradit od dalšího odporu."],
    solutionSteps: ["Vypálení Lidic a Ležáků mělo zastrašit obyvatelstvo a znemožnit podporu odboje."],
  },
  {
    question: "Jak se liší holocaust od ostatních válečných ztrát?",
    correctAnswer: "Holocaust byl cílené průmyslové vyhlazování konkrétní skupiny obyvatel — genocida",
    options: [
      "Holocaust byl cílené průmyslové vyhlazování konkrétní skupiny obyvatel — genocida",
      "Byl to jen vedlejší efekt bojů",
      "Šlo o hladomor způsobený válkou",
      "Holocaustus zasáhl jen vojáky",
    ],
    hints: ["Genocida = plánované vyvraždění celé skupiny lidí."],
    solutionSteps: ["Holocaust byl systematická, státem řízená genocida — ne náhodné válečné ztráty."],
  },
  {
    question: "Co znamenal odsun sudetských Němců po roce 1945?",
    correctAnswer: "Přes 2,5 milionu Němců muselo opustit Čechy — domy, pole, vše",
    options: [
      "Přes 2,5 milionu Němců muselo opustit Čechy — domy, pole, vše",
      "Sudetští Němci dostali autonomní stát",
      "Odsun byl jen symbolický — pár tisíc lidí",
      "Němci odešli dobrovolně ještě za války",
    ],
    hints: ["Bylo to jednou z největších přesídlovacích akcí v dějinách."],
    solutionSteps: ["Přes 2,5 mil. Němců bylo odsunuto z Čech po roce 1945 na základě Postupimské dohody."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď události druhé světové války chronologicky.",
    correctAnswer: "Obsazení ČSR → začátek války → Terezín → atentát → Heydrich umírá → konec války",
    items: [
      "Obsazení ČSR – vznik Protektorátu (15. 3. 1939)",
      "Začátek 2. světové války (1. 9. 1939)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Vypálení Lidic (10. 6. 1942)",
      "Konec války v Evropě (8. 5. 1945)",
    ],
    hints: ["Protektorát byl před začátkem války."],
    solutionSteps: ["3/1939 protektorát → 9/1939 válka → 5/1942 atentát → 6/1942 Lidice → 5/1945 konec."],
  },
  {
    question: "Spoj pojmy s jejich vysvětlením.",
    correctAnswer: "Správné přiřazení",
    pairs: [
      { left: "Protektorát Čechy a Morava", right: "Nacisticky okupované české země 1939–1945" },
      { left: "Heydrich", right: "Říšský protektor, zabit 1942" },
      { left: "Lidice", right: "Vypálená vesnice jako odplata za atentát" },
      { left: "Terezín", right: "Ghetto a transit tábor pro Židy" },
      { left: "8. května 1945", right: "Konec 2. světové války v Evropě" },
    ],
    hints: ["Protektorát = německá správa."],
    solutionSteps: ["Každý pojem má své klíčové spojení s druhou světovou válkou."],
  },
  {
    question: "Proč se říká, že po roce 1945 ČSR stála na 'křižovatce'?",
    correctAnswer: "Západ osvobodili Američané, ale SSSR měl hlavní vliv — hrozil komunistický převrat",
    options: [
      "Západ osvobodili Američané, ale SSSR měl hlavní vliv — hrozil komunistický převrat",
      "ČSR se stala součástí USA",
      "Británie chtěla ČSR připojit k Impériu",
      "Německo žádalo ČSR zpět",
    ],
    hints: ["Únor 1948 přišel brzy po osvobození."],
    solutionSteps: ["Sovětský vliv po 1945 připravil půdu pro komunistický převrat v únoru 1948."],
  },
  {
    question: "Proč má 8. května větší symbolický význam než 9. května?",
    correctAnswer: "8. května kapitulovalo Německo — formální konec války; 9. května je sovětská tradice",
    options: [
      "8. května kapitulovalo Německo — formální konec války; 9. května je sovětská tradice",
      "9. května je vždy správnější",
      "8. května se slaví jen v Česku",
      "Obě data jsou totožná",
    ],
    hints: ["Kapitulace podepsána v noci 8./9. května — západ slaví 8., Rusko 9."],
    solutionSteps: ["Podpis kapitulace proběhl v noci 8./9. 5. — západ chápe 8. 5. jako konec, Rusko 9. 5."],
  },
  {
    question: "Jak by ses jako pražský Žid cítil v roce 1942? Která odpověď nejlépe popisuje historickou realitu?",
    correctAnswer: "Žil bych ve strachu — hrozila deportace do Terezína a poté do vyhlazovacích táborů",
    options: [
      "Žil bych ve strachu — hrozila deportace do Terezína a poté do vyhlazovacích táborů",
      "Žil bych normálně — Protektorát Židy neohrožoval",
      "Byl bych v bezpečí za hradbami Prahy",
      "Mohl bych odejít svobodně do zahraničí",
    ],
    hints: ["Deportace začaly roku 1941."],
    solutionSteps: ["Od 1941 probíhaly deportace Židů z Prahy do Terezína, odtud do vyhlazovacích táborů."],
  },
  {
    question: "Co je genocida a jak holocaust tomuto pojmu odpovídá?",
    correctAnswer: "Genocida = cílené vyvraždění národa nebo skupiny; holocaust byl plánovanou genocidou Židů",
    options: [
      "Genocida = cílené vyvraždění národa nebo skupiny; holocaust byl plánovanou genocidou Židů",
      "Genocida = válečné ztráty; holocaust byl jen vedlejším efektem",
      "Genocida = odsun obyvatelstva; holocaust to nebyl",
      "Holocaust a genocida nemají nic společného",
    ],
    hints: ["Genocide = řecky 'vyvraždění rodu/národa'."],
    solutionSteps: ["Holocaust splňuje definici genocidy: státem organizované, systematické vyhlazování celé skupiny."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const DRUHASVETOVAVALKAOKUPACEOSVOBOZENI: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-druha-svetova-valka-okupace-osvobozeni",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-druha-svetova-valka-okupace-osvobozeni",
    title: "Druhá světová válka, okupace, osvobození",
    studentTitle: "2. světová válka",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "20. století - od T. G. Masaryka po dnešek",
    briefDescription: "Poznáš, co zažily Čechy za nacistické okupace.",
    keywords: ["druhá světová válka", "protektorát", "heydrich", "lidice", "holocaust", "terezín", "osvobození"],
    goals: [
      "Žák vysvětlí vznik a podstatu Protektorátu Čechy a Morava",
      "Žák popíše holocaust a roli Terezína",
      "Žák uvede, kdo a kdy osvobodil ČSR",
    ],
    boundaries: ["Detailní vojenské operace", "Celá geografie druhé světové války"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Klíčová data: 15. 3. 1939 (Protektorát), 1942 (Heydrich + Lidice), 8. 5. 1945 (konec války).",
      steps: [
        "15. 3. 1939: nacistická okupace — Protektorát",
        "1942: atentát na Heydricha → Lidice a Ležáky",
        "Holocaust: Terezín → deportace → 6 mil. obětí",
        "8. 5. 1945: konec války; západ = Američané, východ = Sověti",
        "Odsun sudetských Němců po 1945",
      ],
      commonMistake: "Zaměňování protektorátu (1939) s začátkem světové války (1939) — protektorát byl o 6 měsíců dříve.",
      example: "Lidice byly vypáleny jako odplata za atentát na Heydricha v červnu 1942.",
    },
  },
];
