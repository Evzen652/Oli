import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1: základní porovnávání záporných čísel
const POOL_L1: PracticeTask[] = [
  { question: "Které číslo je větší: −3 nebo −5?", correctAnswer: "−3", options: ["−3", "−5", "jsou stejná", "nelze určit"] },
  { question: "Které číslo je menší: −1 nebo −4?", correctAnswer: "−4", options: ["−4", "−1", "jsou stejná", "nelze určit"] },
  { question: "Platí: −2 > −7?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží"] },
  { question: "Platí: −5 < −1?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží"] },
  { question: "Platí: −3 > 0?", correctAnswer: "Ne", options: ["Ne", "Ano", "Jsou si rovny", "Záleží"] },
  { question: "Platí: 0 > −8?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží"] },
  { question: "Jaká teplota je vyšší: −10 °C nebo −5 °C?", correctAnswer: "−5 °C", options: ["−5 °C", "−10 °C", "jsou stejné", "nelze určit"] },
  { question: "Jaká teplota je nižší: −2 °C nebo −6 °C?", correctAnswer: "−6 °C", options: ["−6 °C", "−2 °C", "jsou stejné", "nelze určit"] },
  { question: "Kde na číselné ose leží číslo −4?", correctAnswer: "Vlevo od nuly", options: ["Vlevo od nuly", "Vpravo od nuly", "Na nule", "Mimo číselnou osu"] },
  { question: "Kde na číselné ose leží číslo 4?", correctAnswer: "Vpravo od nuly", options: ["Vpravo od nuly", "Vlevo od nuly", "Na nule", "Mimo číselnou osu"] },
  { question: "Které číslo leží na číselné ose nejblíže nule: −8, −2, −5?", correctAnswer: "−2", options: ["−2", "−5", "−8", "jsou stejně daleko"] },
  { question: "Seřaď od nejmenšího: −3, 0, 2, −1", correctAnswer: "−3, −1, 0, 2", options: ["−3, −1, 0, 2", "0, −1, −3, 2", "2, 0, −1, −3", "−1, −3, 0, 2"] },
  { question: "Platí: −9 < −1?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží"] },
  { question: "Co je záporné číslo?", correctAnswer: "Číslo menší než nula", options: ["Číslo menší než nula", "Číslo větší než nula", "Číslo rovné nule", "Číslo bez znaménka"] },
  { question: "Které z čísel je záporné: −5, 0, 3?", correctAnswer: "−5", options: ["−5", "0", "3", "všechna jsou záporná"] },
  { question: "Jaká teplota je v mrazu: 5 °C nebo −5 °C?", correctAnswer: "−5 °C", options: ["−5 °C", "5 °C", "obě jsou v mrazu", "ani jedna"] },
  { question: "Platí: −100 < −1?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou si rovny", "Záleží"] },
  { question: "Které číslo je větší: −6 nebo 1?", correctAnswer: "1", options: ["1", "−6", "jsou stejná", "nelze určit"] },
  { question: "Seřaď od největšího: 5, −5, 0", correctAnswer: "5, 0, −5", options: ["5, 0, −5", "−5, 0, 5", "0, 5, −5", "5, −5, 0"] },
  { question: "Které číslo je nejblíže nule: −3 nebo 2?", correctAnswer: "2 – vzdálenost 2", options: ["2 (vzdálenost 2)", "−3 (vzdálenost 3)", "jsou stejně daleko", "nula sama"] },
];

// Level 2: absolutní hodnota, teploty, hlubiny
const POOL_L2: PracticeTask[] = [
  { question: "Jak daleko od nuly leží číslo −7 na číselné ose?", correctAnswer: "7 kroků", options: ["7 kroků", "−7 kroků", "0 kroků", "14 kroků"] },
  { question: "Jak daleko od nuly leží číslo 7 na číselné ose?", correctAnswer: "7 kroků", options: ["7 kroků", "−7 kroků", "0 kroků", "14 kroků"] },
  { question: "Mají čísla −5 a 5 stejnou vzdálenost od nuly?", correctAnswer: "Ano", options: ["Ano", "Ne", "Záleží na směru", "Nelze porovnat"] },
  { question: "Teplota ráno byla −4 °C, odpoledne 3 °C. O kolik stupňů se oteplilo?", correctAnswer: "7 °C", options: ["7 °C", "1 °C", "−7 °C", "4 °C"] },
  { question: "Teplota klesla z 2 °C na −5 °C. O kolik stupňů klesla?", correctAnswer: "7 °C", options: ["7 °C", "3 °C", "5 °C", "−3 °C"] },
  { question: "Hloubka pod mořem −30 m a −80 m — která je větší?", correctAnswer: "−30 m – blíže k hladině", options: ["−30 m (blíže k hladině)", "−80 m (větší číslo)", "jsou stejné", "nelze říct"] },
  { question: "Seřaď od nejmenšího: −10, 5, −3, 0, 8", correctAnswer: "−10, −3, 0, 5, 8", options: ["−10, −3, 0, 5, 8", "8, 5, 0, −3, −10", "−3, −10, 0, 5, 8", "0, −3, −10, 5, 8"] },
  { question: "Podzemní patro je v hloubce −4 m. Nadzemní patro ve výšce 3 m. Jaký je rozdíl?", correctAnswer: "7 m", options: ["7 m", "1 m", "−1 m", "4 m"] },
  { question: "Platí: vzdálenost čísla −8 od nuly > vzdálenost čísla 5 od nuly?", correctAnswer: "Ano", options: ["Ano", "Ne", "Jsou stejné", "Záleží"] },
  { question: "Číslo −12 leží na číselné ose vlevo nebo vpravo od čísla −5?", correctAnswer: "Vlevo – −12 < −5", options: ["Vlevo (−12 < −5)", "Vpravo (−12 > −5)", "Na stejném místě", "Nelze určit"] },
  { question: "Vypočítej: jak daleko je −6 od 4 na číselné ose?", correctAnswer: "10 kroků", options: ["10 kroků", "2 kroky", "−10 kroků", "6 kroků"] },
  { question: "Teplota v Praze je −3 °C a v Brně −8 °C. Kde je tepleji?", correctAnswer: "V Praze – −3 °C", options: ["V Praze (−3 °C)", "V Brně (−8 °C)", "je stejně", "nelze určit"] },
  { question: "Jaké celé číslo leží na číselné ose mezi −3 a −1?", correctAnswer: "−2", options: ["−2", "−1", "−3", "0"] },
  { question: "Seřaď od největšího: −4, −9, −1, −6", correctAnswer: "−1, −4, −6, −9", options: ["−1, −4, −6, −9", "−9, −6, −4, −1", "−4, −9, −1, −6", "−1, −6, −4, −9"] },
  { question: "Jaká je absolutní hodnota čísla −15?", correctAnswer: "15", options: ["15", "−15", "0", "1"] },
];

// Level 3: složitější porovnávání, příklady ze života
const POOL_L3: PracticeTask[] = [
  { question: "Nejnižší zaznamenaná teplota na Zemi je asi −89 °C. Která je nižší: −89 °C nebo −90 °C?", correctAnswer: "−90 °C", options: ["−90 °C", "−89 °C", "jsou stejné", "nelze určit"] },
  { question: "Mariánský příkop je hluboký asi −11 000 m. Jak to čteme?", correctAnswer: "jedenáct tisíc metrů pod hladinou moře", options: ["jedenáct tisíc metrů pod hladinou moře", "minus jedenáct tisíc", "nad hladinou moře", "jedenáct metrů"] },
  { question: "Seřaď od nejmenšího: −50, 20, −100, 0, −25", correctAnswer: "−100, −50, −25, 0, 20", options: ["−100, −50, −25, 0, 20", "20, 0, −25, −50, −100", "−25, −50, −100, 0, 20", "0, −25, −50, −100, 20"] },
  { question: "Banka: máš −500 Kč (dluh). Kamarád má 200 Kč. Kdo má více peněz?", correctAnswer: "Kamarád – 200 Kč", options: ["Kamarád (200 Kč)", "Ty (−500 Kč je větší číslo)", "jste na tom stejně", "nelze porovnat"] },
  { question: "Teploměr ukázal −15 °C ráno a −8 °C v poledne. Je v poledne tepleji?", correctAnswer: "Ano – −8 > −15", options: ["Ano (−8 > −15)", "Ne (−15 je větší záporné číslo)", "je stejně", "záleží na místě"] },
  { question: "Platí: −|−5| = −5?", correctAnswer: "Ano", options: ["Ano", "Ne", "Pouze přibližně", "Záleží"] },
  { question: "Které dva body jsou na číselné ose stejně daleko od nuly: −7 a 7?", correctAnswer: "Ano, oba jsou 7 kroků od nuly", options: ["Ano, oba jsou 7 kroků od nuly", "Ne, −7 je dál", "Ne, 7 je dál", "Nelze porovnat"] },
  { question: "Výtah je v poschodí −2 (2. podzemní). Musí jet do 5. patra. O kolik pater jede?", correctAnswer: "7 pater", options: ["7 pater", "3 patra", "5 pater", "−7 pater"] },
  { question: "Teploměr ukazuje −20 °C. Oteplí se o 35 °C. Jaká bude teplota?", correctAnswer: "15 °C", options: ["15 °C", "−15 °C", "55 °C", "−55 °C"] },
  { question: "Platí: čím více vlevo na číselné ose, tím menší číslo?", correctAnswer: "Ano", options: ["Ano", "Ne", "Záleží na čísle", "Záleží na měřítku"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const ZAPORNACISLANACISELNEOSE: TopicMetadata[] = [
  {
    id: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-zaporna-cisla-na-ciselne-ose",
    rvpNodeId: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-zaporna-cisla-na-ciselne-ose",
    title: "Záporná čísla na číselné ose",
    studentTitle: "Záporná čísla",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Velká čísla a desetinná čísla",
    briefDescription: "Pochopíš záporná čísla — třeba teplotu pod nulou.",
    keywords: ["záporná čísla", "číselná osa", "teplota", "porovnávání", "absolutní hodnota", "minus"],
    goals: [
      "Umístit záporné číslo na číselnou osu",
      "Porovnat záporná čísla navzájem i s kladnými",
      "Pochopit záporná čísla v kontextu teploty a hlubiny",
      "Určit vzdálenost čísla od nuly",
    ],
    boundaries: ["Bez sčítání a odčítání záporných čísel", "Bez záporných desetinných čísel"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Záporná čísla leží vlevo od nuly na číselné ose. Platí: čím větší záporné číslo, tím menší hodnota. Takže −5 < −3 < 0 < 2.",
      steps: [
        "Nakresli si číselnou osu: ... −5, −4, −3, −2, −1, 0, 1, 2, 3, 4, 5 ...",
        "Záporná čísla jsou vlevo od nuly, kladná vpravo.",
        "Číslo více vlevo je menší: −8 < −3.",
        "Každé záporné číslo je menší než nula a než každé kladné číslo.",
      ],
      commonMistake: "Chyba: žáci si myslí, že −8 > −3, protože 8 > 3. Ale na číselné ose −8 leží více vlevo, takže −8 < −3.",
      example: "Porovnej −5 a −2: na číselné ose −5 je vlevo od −2, takže −5 < −2.",
    },
  },
];
