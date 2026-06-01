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
  { question: "Co je průměr sady čísel?", correctAnswer: "Součet všech čísel děleno jejich počtem", options: ["Součet všech čísel děleno jejich počtem", "Největší číslo", "Nejmenší číslo", "Prostřední číslo"], hints: ["Průměr = součet ÷ počet."] },
  { question: "Co je maximum v datové sadě?", correctAnswer: "Největší hodnota v sadě", options: ["Největší hodnota v sadě", "Nejmenší hodnota", "Průměrná hodnota", "Prostřední hodnota"], hints: ["Maximum = nejvyšší hodnota."] },
  { question: "Co je minimum v datové sadě?", correctAnswer: "Nejmenší hodnota v sadě", options: ["Nejmenší hodnota v sadě", "Největší hodnota", "Průměrná hodnota", "Součet všech hodnot"], hints: ["Minimum = nejnižší hodnota."] },
  { question: "Třída má teploty za týden: 20, 22, 18, 25, 21. Jaký je průměr?", correctAnswer: "21,2 °C – součet 106 ÷ 5", options: ["21,2 °C (součet 106 ÷ 5)", "25 °C", "18 °C", "22 °C"], hints: ["20+22+18+25+21 = 106; 106 ÷ 5 = 21,2."] },
  { question: "K čemu slouží graf?", correctAnswer: "K přehlednému zobrazení dat tak, aby byly vidět vzory a trendy", options: ["K přehlednému zobrazení dat tak, aby byly vidět vzory a trendy", "K výpočtu průměru", "K filtrování dat", "K smazání dat"], hints: ["Graf = vizuální znázornění dat."] },
  { question: "Teploty za týden stoupají každý den. Co to naznačuje?", correctAnswer: "Trend = teplota roste – stoupající trend", options: ["Trend = teplota roste (stoupající trend)", "Teplota bude klesat", "Data jsou chybná", "Teplota zůstane stejná"], hints: ["Trend = směr, kterým se data vyvíjejí."] },
  { question: "Co říkají data, pokud průměrná teplota v červenci je 28 °C a v lednu 0 °C?", correctAnswer: "V létě je mnohem tepleji než v zimě", options: ["V létě je mnohem tepleji než v zimě", "Data jsou stejná", "Průměr nezáleží", "Teplota je vždy 14 °C"], hints: ["Porovnej průměry — který měsíc je teplejší?"] },
  { question: "Jaký typ grafu je nejlepší pro zobrazení teploty každý den v týdnu?", correctAnswer: "Spojnicový – liniový graf — ukazuje průběh v čase", options: ["Spojnicový (liniový) graf — ukazuje průběh v čase", "Koláčový graf", "Pruhový (sloupcový) graf", "Tabulka bez grafu"], hints: ["Průběh v čase = liniový (spojnicový) graf."] },
  { question: "Čísla: 10, 20, 30, 40. Jaké je maximum?", correctAnswer: "40", options: ["40", "10", "25", "30"], hints: ["Maximum = největší číslo."] },
  { question: "Čísla: 10, 20, 30, 40. Jaké je minimum?", correctAnswer: "10", options: ["10", "40", "25", "20"], hints: ["Minimum = nejmenší číslo."] },
  { question: "Co je závěr z dat?", correctAnswer: "Tvrzení, které vyplývá z analýzy dat a je podložené daty", options: ["Tvrzení, které vyplývá z analýzy dat a je podložené daty", "Náhodný odhad", "Kopie dat ze zdrojové tabulky", "Průměr dat"], hints: ["Závěr = co nám data říkají?"] },
  { question: "Kolik je průměr čísel 4, 6, 8?", correctAnswer: "6 – součet 18 ÷ 3", options: ["6 (součet 18 ÷ 3)", "4", "8", "18"], hints: ["4+6+8 = 18; 18 ÷ 3 = 6."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Ve třídě jsou teploty za 5 dnů: 15, 18, 22, 19, 21. Co je nejvyšší a nejnižší?", correctAnswer: "Maximum 22, minimum 15", options: ["Maximum 22, minimum 15", "Maximum 21, minimum 15", "Maximum 22, minimum 18", "Maximum 19, minimum 15"], hints: ["Hledej největší a nejmenší hodnotu."] },
  { question: "Žák Honza měl z testů tyto bodové zisky: 70, 80, 60, 90. Jaký je jeho průměrný bodový zisk?", correctAnswer: "75 bodů – 300 ÷ 4", options: ["75 bodů (300 ÷ 4)", "80 bodů", "70 bodů", "90 bodů"], hints: ["70+80+60+90 = 300; 300 ÷ 4 = 75."] },
  { question: "Graf ukazuje teploty: leden 2, únor 4, březen 8, duben 14. Co naznačuje tento trend?", correctAnswer: "Teplota každý měsíc roste — jaro přichází", options: ["Teplota každý měsíc roste — jaro přichází", "Teplota klesá", "Teplota je stálá", "Data jsou chybná"], hints: ["2, 4, 8, 14 — roste nebo klesá?"] },
  { question: "Co je korelace?", correctAnswer: "Dva jevy se dějí zároveň – společný výskyt, ale jeden nemusí způsobovat druhý", options: ["Dva jevy se dějí zároveň (společný výskyt), ale jeden nemusí způsobovat druhý", "Jeden jev způsobuje druhý", "Dva jevy se nikdy nedějí zároveň", "Průměrná hodnota dvou sad"], hints: ["Korelace = spolu výskyt, ne příčina."] },
  { question: "Jaký je rozdíl mezi korelací a příčinou (kauzalitou)?", correctAnswer: "Korelace = děje se zároveň; kauzalita = jedno způsobuje druhé", options: ["Korelace = děje se zároveň; kauzalita = jedno způsobuje druhé", "Jsou totéž", "Kauzalita = náhodný výskyt", "Korelace vždy znamená příčinu"], hints: ["Korelace neznamená příčinu — může být náhoda."] },
  { question: "Třída měřila výšku a hmotnost 20 žáků. Data ukazují, že vyšší žáci mají obecně vyšší hmotnost. Co to je?", correctAnswer: "Korelace mezi výškou a hmotností", options: ["Korelace mezi výškou a hmotností", "Výška způsobuje hmotnost (kauzalita)", "Náhoda bez vzoru", "Chyba měření"], hints: ["Výšší → těžší — ale výška přímo hmotnost nezpůsobuje."] },
  { question: "Graf prodeje zmrzliny a počtu slunečných dní ukazuje: více slunečných dní = více prodané zmrzliny. Co to je?", correctAnswer: "Korelace — teplejší počasí způsobuje obojí – kauzalita je teplo", options: ["Korelace — teplejší počasí způsobuje obojí (kauzalita je teplo)", "Zmrzlina způsobuje slunečné počasí", "Náhoda bez vzoru", "Kauzalita: slunce způsobuje chuť na zmrzlinu"], hints: ["Co způsobuje obojí? Teplo — ne zmrzlina slunce."] },
  { question: "Jak poznám, zda data mají stoupající trend?", correctAnswer: "Hodnoty se obecně zvyšují s postupujícím časem – nebo jinou proměnnou", options: ["Hodnoty se obecně zvyšují s postupujícím časem (nebo jinou proměnnou)", "Hodnoty jsou náhodné", "Hodnoty kolísají kolem středu", "Hodnoty klesají"], hints: ["Stoupající trend = hodnoty rostou."] },
  { question: "Jaký závěr mohu vyvodit z dat: počet dětí čtoucích knihy klesá každý rok posledních 5 let?", correctAnswer: "Zájem o čtení knih u dětí klesá — je třeba prozkoumat příčiny", options: ["Zájem o čtení knih u dětí klesá — je třeba prozkoumat příčiny", "Data jsou chybná", "Děti čtou více", "Trend bude příští rok opačný"], hints: ["Co nám data říkají o trendech?"] },
  { question: "Mám data teplot: 10, 12, 14, 16, 18. Jaká bude pravděpodobně příští hodnota?", correctAnswer: "Asi 20 — trend ukazuje nárůst o 2 každý krok", options: ["Asi 20 — trend ukazuje nárůst o 2 každý krok", "14 — průměr", "10 — minimum", "Nelze odhadnout"], hints: ["Každý krok +2 — jaká bude další hodnota?"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Data teplot za 7 dní: 20, 22, 21, 23, 25, 24, 26. Jaký je průměr (zaokrouhleně)?", correctAnswer: "23 °C – součet 161 ÷ 7 = 23,0", options: ["23 °C (součet 161 ÷ 7 = 23,0)", "25 °C", "21 °C", "24 °C"], hints: ["20+22+21+23+25+24+26 = 161; 161 ÷ 7 = 23."] },
  { question: "Ve třídě má 20 žáků průměrný bodový zisk 75. Jeden žák měl 0 bodů (byl nemocný). Jak to ovlivní průměr?", correctAnswer: "Průměr klesne — nula táhne průměr dolů", options: ["Průměr klesne — nula táhne průměr dolů", "Průměr se nezmění", "Průměr vzroste", "Průměr bude 0"], hints: ["Přidání nízkého čísla průměr sníží."] },
  { question: "Graf ukazuje: v létě je více úrazů při koupání a zároveň více zmrzlinářů. Je zmrzlina příčinou úrazů?", correctAnswer: "Ne — obojí způsobuje léto – kauzalita je teplo, ne zmrzlina", options: ["Ne — obojí způsobuje teplo (kauzalita je teplo, ne zmrzlina)", "Ano — zmrzlina způsobuje nepozornost", "Data ukazují přímou příčinu", "Korelace vždy znamená příčinu"], hints: ["Co způsobuje obojí? Léto — ne zmrzlina."] },
  { question: "Jaký závěr NEMOHU vyvodit z dat o průměrných teplotách měsíců v roce?", correctAnswer: "Teplota v daný den bude přesně rovna průměru toho měsíce", options: ["Teplota v daný den bude přesně rovna průměru toho měsíce", "V červenci je teplo", "V lednu je chlad", "Léto je teplejší než zima"], hints: ["Průměr říká celkový trend, ne přesnou denní hodnotu."] },
  { question: "Data prodejů: leden 100, únor 120, březen 90, duben 130. Jaký je celkový trend?", correctAnswer: "Obecně rostoucí, i když s poklesem v březnu", options: ["Obecně rostoucí, i když s poklesem v březnu", "Klesající", "Stálý", "Nejde určit trend"], hints: ["Podívej se na celkový směr dat — roste nebo klesá?"] },
  { question: "Proč nestačí jen znát maximum a minimum dat — proč je důležitý i průměr?", correctAnswer: "Průměr ukazuje typickou hodnotu; extrém může být ojedinělý", options: ["Průměr ukazuje typickou hodnotu; extrém může být ojedinělý", "Maximum a minimum jsou vždy dostačující", "Průměr a extrémy říkají totéž", "Minimum je vždy průměr"], hints: ["Extrémní hodnoty mohou být výjimky — průměr popisuje typický případ."] },
  { question: "Korelace ukazuje: děti s více knihami doma mají lepší výsledky ve čtení. Znamená to, že knihy způsobují lepší čtení?", correctAnswer: "Nelze říct jen z korelace — mohlo by to být i naopak, nebo obojí způsobuje vzdělání rodičů", options: ["Nelze říct jen z korelace — mohlo by to být i naopak, nebo obojí způsobuje vzdělání rodičů", "Ano — knihy přímo způsobují lepší čtení", "Ne — čtení nesouvisí s knihami", "Korelace vždy = příčina"], hints: ["Korelace ≠ kauzalita. Hledej alternativní vysvětlení."] },
  { question: "Jaký závěr mohu z grafu vyvozovat bezpečně?", correctAnswer: "Pouze popis toho, co data ukazují — ne předpověď budoucnosti jako jistotu", options: ["Pouze popis toho, co data ukazují — ne předpověď budoucnosti jako jistotu", "Přesnou předpověď budoucích hodnot", "Příčinu všech trendů", "Absolutní pravdu bez chyby"], hints: ["Data popisují minulost — budoucnost je jen odhad."] },
  { question: "Jak poznám, že jsou data spolehlivá?", correctAnswer: "Data byla sbírána systematicky, z více zdrojů, a jsou konzistentní", options: ["Data byla sbírána systematicky, z více zdrojů, a jsou konzistentní", "Data jsou vždy spolehlivá", "Stačí jedno měření", "Spolehlivost dat nelze zjistit"], hints: ["Více zdrojů + konzistence = spolehlivější data."] },
  { question: "Graf ukazuje: více hodin studia → lepší výsledky testu. Jaký závěr je nejvhodnější?", correctAnswer: "Studium a výsledky spolu pozitivně korelují — více studia je spojeno s lepšími výsledky", options: ["Studium a výsledky spolu pozitivně korelují — více studia je spojeno s lepšími výsledky", "Studium vždy zaručí jedničku", "Výsledky nezávisí na studiu", "Data jsou chybná"], hints: ["Pozitivní korelace = oba jevy rostou zároveň."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const HODNOCENIZISKANYCHDATVYVOZOVANIZAVERU: TopicMetadata[] = [
  {
    id: "g5-informatika-data-informace-a-modelovani-prace-s-daty-hodnoceni-ziskanych-dat-vyvozovani-zaveru",
    rvpNodeId: "g5-informatika-data-informace-a-modelovani-prace-s-daty-hodnoceni-ziskanych-dat-vyvozovani-zaveru",
    title: "Hodnocení získaných dat, vyvozování závěrů",
    studentTitle: "Vyhodnocení dat",
    subject: "informatika",
    category: "Data, informace a modelování",
    topic: "Práce s daty",
    briefDescription: "Naučíš se vyhodnotit data a vyvodit závěr.",
    keywords: ["průměr", "maximum", "minimum", "trend", "korelace", "závěr", "graf", "data"],
    goals: [
      "Vypočítá průměr, maximum a minimum z dat.",
      "Identifikuje trend v datové sadě.",
      "Rozlišuje korelaci a příčinu (kauzalitu).",
    ],
    boundaries: ["Statistika nad rámec průměru (medián, modus)", "Statistické testy", "Pokročilá analýza dat"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Průměr = součet ÷ počet. Trend = kam data směřují. Korelace ≠ příčina — dva jevy mohou být spojeny, aniž by jedno způsobovalo druhé.",
      steps: [
        "Zjistím průměr, maximum a minimum dat.",
        "Hledám trend — rostou nebo klesají data?",
        "Vyvozuji závěr: 'Data říkají, že...'",
        "Ověřím, zda korelace není jen náhoda (ne příčina).",
      ],
      commonMistake: "Záměna korelace a příčiny — jen proto, že dvě věci nastanou zároveň, neznamená, že jedna způsobuje druhou.",
      example: "Teploty: 20, 22, 25, 28 → trend roste. Průměr = 23,75. Závěr: teploty v tomto týdnu rostou.",
    },
  },
];
