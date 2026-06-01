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
  { question: "Co je buňka v tabulce?", correctAnswer: "Jedno pole na průsečíku řádku a sloupce", options: ["Jedno pole na průsečíku řádku a sloupce", "Celý řádek tabulky", "Celý sloupec tabulky", "Název tabulky"], hints: ["Buňka = jedno políčko v tabulce."] },
  { question: "Co je záhlaví tabulky?", correctAnswer: "První řádek s názvy sloupců – např. Jméno, Předmět, Známka", options: ["První řádek s názvy sloupců – např. Jméno, Předmět, Známka", "Poslední řádek tabulky", "Název souboru", "Barevný rámeček tabulky"], hints: ["Záhlaví = popis každého sloupce."] },
  { question: "Co znamená řadit data vzestupně (A-Z nebo 0-9)?", correctAnswer: "Od nejmenšího/nejdříve po největší/naposledy", options: ["Od nejmenšího/nejdříve po největší/naposledy", "Od největšího po nejmenší", "Náhodně", "Abecedně pozpátku"], hints: ["Vzestupně = od nejmenšího nahoru."] },
  { question: "Co znamená řadit data sestupně (Z-A nebo 9-0)?", correctAnswer: "Od největšího/naposledy po nejmenší/nejdříve", options: ["Od největšího/naposledy po nejmenší/nejdříve", "Od nejmenšího po největší", "Abecedně", "Náhodně"], hints: ["Sestupně = od největšího dolů."] },
  { question: "Jak se jmenuje program pro práci s tabulkami?", correctAnswer: "Tabulkový procesor – např. Excel, Google Tabulky", options: ["Tabulkový procesor – např. Excel, Google Tabulky", "Textový editor – Word", "Prohlížeč – Chrome", "Kreslicí program – Paint"], hints: ["Tabulkový procesor = program pro práci s daty v tabulce."] },
  { question: "Mám tabulku se jmény: Jan, Petra, Adam. Jak vypadá seřazení A-Z?", correctAnswer: "Adam, Jan, Petra", options: ["Adam, Jan, Petra", "Petra, Jan, Adam", "Jan, Petra, Adam", "Adam, Petra, Jan"], hints: ["A-Z = abecedně od začátku abecedy."] },
  { question: "Co je filtrování v tabulce?", correctAnswer: "Zobrazení jen těch řádků, které splňují zadanou podmínku", options: ["Zobrazení jen těch řádků, které splňují zadanou podmínku", "Seřazení dat podle sloupce", "Smazání dat z tabulky", "Přidání nového sloupce"], hints: ["Filtr = zobrazím jen to, co mě zajímá."] },
  { question: "Tabulka má sloupce: Jméno, Předmět, Známka. Chci zobrazit jen řádky se Známkou 1. Co použiji?", correctAnswer: "Filtr na sloupec Známka s podmínkou rovná se 1", options: ["Filtr na sloupec Známka s podmínkou rovná se 1", "Seřadit A-Z", "Smazat ostatní řádky", "Přidat nový sloupec"], hints: ["Filtr = zobrazilelze jen záznamy splňující podmínku."] },
  { question: "Jak se nazývají vodorovné části tabulky?", correctAnswer: "Řádky", options: ["Řádky", "Sloupce", "Buňky", "Záhlaví"], hints: ["Řádky = vodorovné; sloupce = svislé."] },
  { question: "Jak se nazývají svislé části tabulky?", correctAnswer: "Sloupce", options: ["Sloupce", "Řádky", "Buňky", "Záhlaví"], hints: ["Sloupce = svislé; řádky = vodorovné."] },
  { question: "Tabulka má čísla: 5, 2, 8, 1. Jak vypadá seřazení od nejmenšího?", correctAnswer: "1, 2, 5, 8", options: ["1, 2, 5, 8", "8, 5, 2, 1", "5, 2, 8, 1", "2, 1, 5, 8"], hints: ["Od nejmenšího = vzestupně."] },
  { question: "K čemu slouží tabulka v počítači?", correctAnswer: "K přehlednému záznamu a organizaci dat – čísla, texty, data", options: ["K přehlednému záznamu a organizaci dat – čísla, texty, data", "K malování obrázků", "K psaní e-mailů", "K prohlížení webu"], hints: ["Tabulka = strukturovaný seznam dat."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Mám tabulku třídy se sloupci: Jméno, Předmět, Známka, Datum. Jak seřadím záznamy tak, aby nejlepší známky byly nahoře?", correctAnswer: "Seřadím vzestupně podle sloupce Známka – 1 = nejlepší", options: ["Seřadím vzestupně podle sloupce Známka – 1 = nejlepší", "Seřadím sestupně podle Jméno", "Filtruji podle Předmětu", "Seřadím sestupně podle Datum"], hints: ["Nejlepší = nejmenší číslo → vzestupně."] },
  { question: "Proč je výhodné mít data v tabulce místo v prostém textu?", correctAnswer: "V tabulce lze data snadno řadit, filtrovat a hledat", options: ["V tabulce lze data snadno řadit, filtrovat a hledat", "Tabulka zabírá méně místa", "Text je nepřehledný vždy", "Tabulky fungují jen v Excelu"], hints: ["Tabulka = přehlednost + možnost třídění a filtrování."] },
  { question: "Chci zobrazit jen záznamy z matematiky. Jak to udělám?", correctAnswer: "Aplikuji filtr na sloupec Předmět s hodnotou Matematika", options: ["Aplikuji filtr na sloupec Předmět s hodnotou Matematika", "Seřadím tabulku A-Z", "Smažu ostatní řádky", "Přejmenují sloupec Předmět"], hints: ["Filtr = zobrazilelze jen záznamy splňující podmínku."] },
  { question: "Tabulka má 3 sloupce a 10 řádků (bez záhlaví). Kolik buněk má tabulka celkem?", correctAnswer: "30 buněk – 3 × 10", options: ["30 buněk – 3 × 10", "13 buněk – 3 + 10", "33 buněk – 3 × 10 + 3", "10 buněk"], hints: ["Počet buněk = počet sloupců × počet řádků."] },
  { question: "Mám tabulku žáků seřazenou A-Z podle jména. Přidám nového žáka 'Eva'. Kam v tabulce patří Eva?", correctAnswer: "Mezi záznamy začínající D a F – na správné abecední místo", options: ["Mezi záznamy začínající D a F – na správné abecední místo", "Na konec tabulky", "Na začátek tabulky", "Záleží na datu přidání"], hints: ["E je v abecedě mezi D a F."] },
  { question: "Proč je důležité záhlaví tabulky?", correctAnswer: "Záhlaví popisuje obsah každého sloupce — bez něj nevíme, co data znamenají", options: ["Záhlaví popisuje obsah každého sloupce — bez něj nevíme, co data znamenají", "Záhlaví tabulky zobrazuje datum", "Záhlaví je jen pro pěkný vzhled", "Záhlaví automaticky seřadí data"], hints: ["Záhlaví = popis sloupců. Co by se stalo, kdybychom ho neměli?"] },
  { question: "Chci vidět jen záznamy s Předmětem matematika A Známkou 1. Jak to udělám?", correctAnswer: "Aplikuji filtr na dva sloupce najednou: Předmět = Matematika a Známka = 1", options: ["Aplikuji filtr na dva sloupce najednou: Předmět = Matematika a Známka = 1", "Seřadím tabulku A-Z", "Filtruji pouze Předmět", "Filtruji pouze Známku"], hints: ["Lze filtrovat podle více sloupců zároveň."] },
  { question: "Jak zjistím, kdo má v tabulce nejhorší známku z matematiky?", correctAnswer: "Filtruji matematiku a seřadím sestupně podle Známky – 5 bude nahoře", options: ["Filtruji matematiku a seřadím sestupně podle Známky – 5 bude nahoře", "Seřadím A-Z podle jméno", "Filtruji Známku = 1", "Neexistuje způsob"], hints: ["Filtr + řazení sestupně = nejhorší bude nahoře."] },
  { question: "Co se stane s daty v tabulce po aplikaci filtru?", correctAnswer: "Ostatní data jsou skryta, ale stále existují — filtr je neodstraní", options: ["Ostatní data jsou skryta, ale stále existují — filtr je neodstraní", "Ostatní data jsou smazána", "Tabulka se seřadí", "Přidá se nový sloupec"], hints: ["Filtr = skrýt; data stále jsou v tabulce."] },
  { question: "Mám tabulku: Jméno, Předmět, Datum. Chci seřadit záznamy od nejstaršího data. Jak?", correctAnswer: "Seřadím vzestupně podle sloupce Datum", options: ["Seřadím vzestupně podle sloupce Datum", "Seřadím sestupně podle Datum", "Filtruji podle Data", "Seřadím A-Z podle Jméno"], hints: ["Nejstarší = nejmenší datum → vzestupně."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Tabulka žáků: Jan/Mat/1, Petra/Čj/2, Jan/Čj/3, Petra/Mat/1. Kolik řádků zbyde po filtru Předmět = Matematika?", correctAnswer: "2 řádky – Jan/Mat/1 a Petra/Mat/1", options: ["2 řádky – Jan/Mat/1 a Petra/Mat/1", "1 řádek", "3 řádky", "4 řádky"], hints: ["Spočítej, kolik řádků má Předmět = Matematika."] },
  { question: "Jak seřadím tabulku primárně podle Předmětu (A-Z) a sekundárně podle Jméno (A-Z)?", correctAnswer: "Nastavím řazení: první klíč = Předmět A-Z, druhý klíč = Jméno A-Z", options: ["Nastavím řazení: první klíč = Předmět A-Z, druhý klíč = Jméno A-Z", "Seřadím jen podle Jméno", "Seřadím jen podle Předmět", "Filtruji Předmět a seřadím Jméno"], hints: ["Víceúrovňové řazení: hlavní klíč + vedlejší klíč pro shody."] },
  { question: "Tabulka má 50 žáků a 4 sloupce. Kolik buněk celkem v datové části (bez záhlaví)?", correctAnswer: "200 buněk – 50 × 4", options: ["200 buněk – 50 × 4", "54 buněk – 50 + 4", "204 buněk – 50 × 4 + 4", "50 buněk"], hints: ["Datové buňky = řádky × sloupce (bez záhlaví)."] },
  { question: "Proč je dobré mít každý typ informace v samostatném sloupci (ne Jméno + příjmení dohromady)?", correctAnswer: "Samostatné sloupce umožňují řadit a filtrovat zvlášť podle jména i příjmení", options: ["Samostatné sloupce umožňují řadit a filtrovat zvlášť podle jména i příjmení", "Dohromady se vejde více dat", "Není to nutné", "Filtrování funguje lépe s propojenými daty"], hints: ["Čím více sloupců, tím větší flexibilita při třídění."] },
  { question: "Jaký je rozdíl mezi řazením a filtrováním?", correctAnswer: "Řazení změní pořadí řádků; filtrování skryje nevyhovující řádky", options: ["Řazení změní pořadí řádků; filtrování skryje nevyhovující řádky", "Jsou totéž", "Filtrování změní pořadí; řazení skryje data", "Řazení smaže data; filtrování je seřadí"], hints: ["Řazení = pořadí; filtrování = co je vidět."] },
  { question: "Chci zjistit průměrnou známku třídy z matematiky. Jaké kroky provedu v tabulce?", correctAnswer: "Filtruji Předmět = Matematika, pak spočítám průměr ze sloupce Známka", options: ["Filtruji Předmět = Matematika, pak spočítám průměr ze sloupce Známka", "Seřadím podle Jméno a přečtu první záznam", "Filtruji Jméno a seřadím Předmět", "Průměr nelze z tabulky zjistit"], hints: ["Filtrovat → pak spočítat průměr z viditelných dat."] },
  { question: "Mám tabulku 100 žáků. Filtruji Předmět = Čeština a zůstane 30 řádků. Kolik řádků je skrytých?", correctAnswer: "70 řádků – 100 − 30 = 70", options: ["70 řádků – 100 − 30 = 70", "30 řádků", "100 řádků", "0 řádků"], hints: ["Celkový počet − viditelné = skryté."] },
  { question: "Jak se nazývá situace, kdy v buňce tabulky chybí data?", correctAnswer: "Prázdná buňka – chybějící hodnota", options: ["Prázdná buňka – chybějící hodnota", "Null chyba", "Záhlaví", "Filtrovaný řádek"], hints: ["Buňka bez dat = prázdná buňka."] },
  { question: "Co by se stalo, kdyby záhlaví tabulky obsahovalo data (ne názvy sloupců)?", correctAnswer: "Tabulka by byla nepřehledná a nešlo by správně řadit a filtrovat", options: ["Tabulka by byla nepřehledná a nešlo by správně řadit a filtrovat", "Tabulka by fungovala stejně", "Záhlaví s daty je výhodné", "Záhlaví by se skrylo"], hints: ["Záhlaví = popis, ne data. Bez správného záhlaví je tabulka nejasná."] },
  { question: "Jak zjistím, kolik žáků má Známku 1 z matematiky?", correctAnswer: "Filtruji Předmět = Matematika a Známka = 1, pak spočítám viditelné řádky", options: ["Filtruji Předmět = Matematika a Známka = 1, pak spočítám viditelné řádky", "Seřadím A-Z a přečtu první", "Filtruji jen Jméno", "Sečtu všechny řádky tabulky"], hints: ["Dvojitý filtr + počet výsledků."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const ZAZNAMATRIDENIDATVTABULCE: TopicMetadata[] = [
  {
    id: "g5-informatika-data-informace-a-modelovani-prace-s-daty-zaznam-a-trideni-dat-v-tabulce",
    rvpNodeId: "g5-informatika-data-informace-a-modelovani-prace-s-daty-zaznam-a-trideni-dat-v-tabulce",
    title: "Záznam a třídění dat v tabulce",
    studentTitle: "Tabulky a data",
    subject: "informatika",
    category: "Data, informace a modelování",
    topic: "Práce s daty",
    briefDescription: "Naučíš se zapisovat data do tabulky a třídit je.",
    keywords: ["tabulka", "řádek", "sloupec", "buňka", "záhlaví", "řazení", "filtrování", "Excel", "Google Tabulky"],
    goals: [
      "Rozumí struktuře tabulky (řádky, sloupce, buňky, záhlaví).",
      "Seřadí data vzestupně i sestupně.",
      "Použije filtr pro zobrazení vybraných záznamů.",
    ],
    boundaries: ["Vzorce a funkce v Excelu", "Grafy a pivotní tabulky", "Databáze"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Tabulka = řádky × sloupce. Záhlaví popisuje sloupce. Řazení změní pořadí. Filtrování skryje nevyhovující záznamy.",
      steps: [
        "Určím, jaké údaje budu ukládat (sloupce).",
        "Přidám záhlaví — název každého sloupce.",
        "Vložím data do řádků.",
        "Seřadím nebo filtruji podle potřeby.",
      ],
      commonMistake: "Záměna řazení a filtrování — řazení změní pořadí, filtrování skryje data.",
      example: "Tabulka: Jméno | Předmět | Známka. Filtruji Předmět = Matematika a seřadím Známka 1-5 → vidím matematikáře od nejlepšího.",
    },
  },
];
