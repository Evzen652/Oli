import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1: základní pojmy, příklady ze života
const POOL_L1: PracticeTask[] = [
  { question: "Co je osová souměrnost?", correctAnswer: "Obraz je zrcadlovým odrazem originálu přes osu", options: ["Obraz je zrcadlovým odrazem originálu přes osu", "Obraz je posunutý o stejnou vzdálenost", "Obraz je otočený o 180°", "Obraz je zmenšený na polovinu"] },
  { question: "Kolik os souměrnosti má čtverec?", correctAnswer: "4", options: ["2", "4", "1", "0"] },
  { question: "Kolik os souměrnosti má kružnice?", correctAnswer: "Nekonečně mnoho", options: ["1", "4", "Nekonečně mnoho", "0"] },
  { question: "Kolik os souměrnosti má obdélník (ne čtverec)?", correctAnswer: "2", options: ["4", "1", "0", "2"] },
  { question: "Má písmeno A osu souměrnosti?", correctAnswer: "Ano – svislá osa", options: ["Ano – svislá osa", "Ne", "Ano – vodorovná osa", "Ano – 2 osy"] },
  { question: "Má písmeno B osu souměrnosti?", correctAnswer: "Ano – vodorovná osa", options: ["Ne", "Ano – vodorovná osa", "Ano – svislá osa", "Ano – 2 osy"] },
  { question: "Má písmeno S osu souměrnosti?", correctAnswer: "Ne", options: ["Ano – svislá osa", "Ano – vodorovná osa", "Ne", "Ano – 2 osy"] },
  { question: "Motýl je příkladem osové souměrnosti. Kde leží osa?", correctAnswer: "Svislá osa uprostřed těla", options: ["Vodorovná osa uprostřed těla", "Nemá osu", "Dvě osy křížem", "Svislá osa uprostřed těla"] },
  { question: "Je lidský obličej přesně osově souměrný?", correctAnswer: "Přibližně – v přírodě nejsou dokonalé", options: ["Přibližně – v přírodě nejsou dokonalé", "Ano, je to dokonale přesné zrcadlení", "Ne vůbec, obličej nemá žádnou souměrnost", "Záleží na tom, o kterého člověka jde"] },
  { question: "Kolik os souměrnosti má rovnostranný trojúhelník?", correctAnswer: "3", options: ["1", "3", "0", "6"] },
  { question: "Kolik os souměrnosti má rovnoramenný trojúhelník (ne rovnostranný)?", correctAnswer: "1", options: ["2", "0", "1", "3"] },
  { question: "Kolik os souměrnosti má kruh?", correctAnswer: "Nekonečně mnoho", options: ["1", "2", "0", "Nekonečně mnoho"] },
  { question: "Má písmeno H osu souměrnosti?", correctAnswer: "Ano – svislou i vodorovnou — 2 osy", options: ["Ano – svislou i vodorovnou — 2 osy", "Ne, písmeno H nemá žádnou osu souměrnosti", "Jen svislou, vodorovnou nemá", "Jen vodorovnou, svislou nemá"] },
  { question: "Co je osa souměrnosti?", correctAnswer: "Přímka, podle níž se obraz překládá – skládá", options: ["Bod, kolem nějž se otáčí", "Přímka, podle níž se obraz překládá – skládá", "Střed obrazce", "Průsečík úhlopříček"] },
  { question: "Má pravidelný šestiúhelník osy souměrnosti?", correctAnswer: "Ano, 6 os", options: ["Ne", "Ano, 3 osy", "Ano, 6 os", "Ano, 2 osy"] },
  { question: "Je zrcadlový obraz souměrný s originálem?", correctAnswer: "Ano, jsou osově souměrné – osou je zrcadlo", options: ["Ne, zrcadlový obraz je úplně jiný tvar", "Záleží na tom, jak je zrcadlo nakloněné", "Jen přibližně, nikdy ne přesně stejné", "Ano, jsou osově souměrné – osou je zrcadlo"] },
  { question: "Kolik os souměrnosti má pravidelný pětiúhelník?", correctAnswer: "5", options: ["5", "3", "1", "0"] },
  { question: "Kde leží osa souměrnosti u kapky vody?", correctAnswer: "Svislá osa středem kapky", options: ["Vodorovná osa středem kapky", "Svislá osa středem kapky", "Nemá osu", "Diagonálně"] },
  { question: "Má číslo 8 osu souměrnosti?", correctAnswer: "Ano – svislou i vodorovnou — 2 osy", options: ["Ne, číslo 8 nemá žádnou osu souměrnosti", "Jen svislou, vodorovnou nemá", "Ano – svislou i vodorovnou — 2 osy", "Jen vodorovnou, svislou nemá"] },
  { question: "Kolik os souměrnosti má kosočtverec (rhombus) — ne čtverec?", correctAnswer: "2", options: ["4", "1", "0", "2"] },
];

// Level 2: sestrojení obrazu, vzdálenost od osy
const POOL_L2: PracticeTask[] = [
  { question: "Bod A leží 3 cm od osy souměrnosti. Jak daleko od osy leží jeho obraz A'?", correctAnswer: "3 cm", options: ["3 cm", "6 cm", "0 cm", "1,5 cm"] },
  { question: "Bod B leží 5 cm od osy. Jaká je vzdálenost B od B' (celková)?", correctAnswer: "10 cm", options: ["5 cm", "10 cm", "2,5 cm", "0 cm"] },
  { question: "Osa souměrnosti je svislá přímka. Bod P [3; 2]. Kde leží P'?", correctAnswer: "P' leží na opačné straně ve stejné vzdálenosti od osy", options: ["P' = [3; −2] (jen otočený znak u druhé souřadnice)", "P' = [−3; −2] (otočené znaménko u obou souřadnic)", "P' leží na opačné straně ve stejné vzdálenosti od osy", "P' = [0; 2] (bod na samotné ose souměrnosti)"] },
  { question: "Při osové souměrnosti: osa je svislá, bod je vlevo od osy. Kde bude jeho obraz?", correctAnswer: "Vpravo od osy, stejně daleko", options: ["Vlevo, ale výše", "Na ose", "Záleží na bodu", "Vpravo od osy, stejně daleko"] },
  { question: "Obraz bodu leží na ose souměrnosti. Co to znamená?", correctAnswer: "Bod leží přímo na ose – obraz = originál", options: ["Bod leží přímo na ose – obraz = originál", "Bod je daleko od osy", "Bod nemá obraz", "Záleží na vzdálenosti"] },
  { question: "Kolmice z bodu na osu souměrnosti slouží k:", correctAnswer: "Určení polohy obrazu – obraz je stejně daleko na opačné straně", options: ["Výpočtu obsahu obrazce, který vznikne zrcadlením", "Určení polohy obrazu – obraz je stejně daleko na opačné straně", "Určení celkové délky osy souměrnosti", "Nalezení středu obrazce, ne jeho obrazu"] },
  { question: "Trojúhelník ABC překládáme přes osu. Obraz je A'B'C'. Mají trojúhelník a obraz stejný tvar a velikost?", correctAnswer: "Ano – shodné útvary", options: ["Ne, obraz je zmenšený", "Ano, ale jiný tvar", "Ano – shodné útvary", "Záleží na ose"] },
  { question: "Přeložím papír přes čáru a vystřihnu tvar. Oba díly jsou:", correctAnswer: "Osově souměrné – osa = záhyb", options: ["Stejné ale bez souměrnosti", "Různé tvary", "Záleží na tvaru", "Osově souměrné – osa = záhyb"] },
  { question: "Bod A [4; 0], osa je osa y (svislá). Kde leží A'?", correctAnswer: "[−4; 0]", options: ["[−4; 0]", "[4; 0]", "[0; 4]", "[−4; 4]"] },
  { question: "Bod B [0; 3], osa je osa x (vodorovná). Kde leží B'?", correctAnswer: "[0; −3]", options: ["[0; 3]", "[0; −3]", "[3; 0]", "[−3; 0]"] },
  { question: "Úsečka AB je rovnoběžná s osou souměrnosti. Jaká je délka jejího obrazu A'B'?", correctAnswer: "Stejná jako délka AB", options: ["Dvojnásobná", "Poloviční", "Stejná jako délka AB", "Záleží na vzdálenosti od osy"] },
  { question: "Kolik os souměrnosti má pravidelný čtyřúhelník (čtverec)?", correctAnswer: "4 – 2 osy přes strany, 2 přes rohy", options: ["2 – jen úhlopříčky, zapomíná na strany", "1 – jen jedna, ne všechny 4 osy", "0 – čtverec žádnou osu souměrnosti nemá", "4 – 2 osy přes strany, 2 přes rohy"] },
];

// Level 3: složitější situace, kombinace
const POOL_L3: PracticeTask[] = [
  { question: "Obdélník 4 × 6 cm. Kolik os souměrnosti má?", correctAnswer: "2", options: ["2", "4", "1", "0"] },
  { question: "Je obraz při osové souměrnosti vždy stejně velký jako originál?", correctAnswer: "Ano – souměrnost zachovává velikost", options: ["Ne, je zmenšený", "Ano – souměrnost zachovává velikost", "Záleží na ose", "Záleží na vzdálenosti od osy"] },
  { question: "Obrazec má 3 osy souměrnosti. Jaký to může být?", correctAnswer: "Rovnostranný trojúhelník", options: ["Obdélník", "Čtverec", "Rovnostranný trojúhelník", "Pravidelný šestiúhelník"] },
  { question: "Slovo 'OKO' — má osa souměrnosti (svislá)?", correctAnswer: "Ano", options: ["Ne", "Záleží na fontu", "Jen přibližně", "Ano"] },
  { question: "Jak se nazývá obrazec, jehož obraz při osové souměrnosti je totožný s originálem?", correctAnswer: "Osově souměrný obrazec", options: ["Osově souměrný obrazec", "Středově souměrný", "Rovnoběžný", "Kongruentní"] },
  { question: "Bod A je 2 cm od osy, bod B je 5 cm od osy. Vzdálenost A' od B' = ?", correctAnswer: "Závisí na poloze bodů — nelze určit jen z těchto dat", options: ["7 cm — součet vzdáleností obou bodů od osy", "Závisí na poloze bodů — nelze určit jen z těchto dat", "3 cm — rozdíl vzdáleností obou bodů od osy", "10 cm — dvojnásobek větší ze vzdáleností"] },
  { question: "Přeložíme list papíru napůl a nastřihneme (symetricky). Výsledek je:", correctAnswer: "Osově souměrný tvar", options: ["Kruh", "Náhodný tvar", "Osově souměrný tvar", "Čtverec"] },
  { question: "Má písmeno X dvě osy souměrnosti?", correctAnswer: "Ano – svislá a vodorovná", options: ["Ne", "Ano, ale diagonální", "Jen jednu", "Ano – svislá a vodorovná"] },
  { question: "Úhelník (pravoúhlý trojúhelník 90°-45°-45°) má kolik os souměrnosti?", correctAnswer: "1", options: ["1", "0", "2", "3"] },
  { question: "Úhelník (pravoúhlý trojúhelník 90°-60°-30°) má kolik os souměrnosti?", correctAnswer: "0", options: ["1", "0", "2", "3"] },
  { question: "Když dva osově souměrné obrazce přiložíme podél osy, co dostaneme?", correctAnswer: "Větší obrazec, který může být souměrný", options: ["Stejný obrazec jako každý z těch dvou", "Vždy nesouměrný, nepravidelný tvar", "Větší obrazec, který může být souměrný", "Vždy přesný kruh nebo elipsu"] },
  { question: "Platí: obrazy dvou různých bodů na ose souměrnosti jsou totožné s originálem?", correctAnswer: "Ano – body na ose se zobrazí samy na sebe", options: ["Ne, obraz bodu na ose je vždy jinde", "Záleží na tom, kde přesně osa leží", "Záleží na tom, jak daleko body jsou", "Ano – body na ose se zobrazí samy na sebe"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const OSOVASOUMERNOSTSESTROJENIOBRAZUURCENIOSY: TopicMetadata[] = [
  {
    id: "g5-matematika-geometrie-v-rovine-a-v-prostoru-soumernost-osova-soumernost-sestrojeni-obrazu-urceni-osy",
    rvpNodeId: "g5-matematika-geometrie-v-rovine-a-v-prostoru-soumernost-osova-soumernost-sestrojeni-obrazu-urceni-osy",
    title: "Osová souměrnost - sestrojení obrazu, určení osy",
    studentTitle: "Osová souměrnost",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Souměrnost",
    briefDescription: "Poznáš osovou souměrnost a naučíš se sestrojit obraz.",
    keywords: ["osová souměrnost", "osa souměrnosti", "zrcadlový obraz", "přeložení", "souměrný"],
    goals: [
      "Vysvětlit, co je osová souměrnost",
      "Určit osy souměrnosti obrazce",
      "Sestrojit obraz bodu nebo úsečky při osové souměrnosti",
      "Rozpoznat osově souměrné tvary v přírodě a každodenním životě",
    ],
    boundaries: ["Bez středové souměrnosti", "Bez analytické geometrie"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Osová souměrnost je jako přeložení papíru nebo zrcadlový odraz. Bod a jeho obraz jsou stejně daleko od osy, na opačných stranách.",
      steps: [
        "Najdi osu souměrnosti (přímku překládání).",
        "Z každého bodu veď kolmici na osu.",
        "Odměř stejnou vzdálenost na druhou stranu.",
        "Spoj body — to je obraz.",
      ],
      commonMistake: "Chyba: obraz není stejně daleko od osy jako originál. Vzdálenost bodu od osy = vzdálenost obrazu od osy.",
      example: "Čtverec se stranou 4 cm má 4 osy souměrnosti: 2 přes střednice stran, 2 přes úhlopříčky.",
    },
  },
];
