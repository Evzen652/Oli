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
    question: "Co je Scratch?",
    correctAnswer: "Vizuální programovací prostředí pro děti kde skládáš bloky",
    options: shuffle(["Vizuální programovací prostředí pro děti kde skládáš bloky", "Textový editor pro psaní", "Herní konzole", "Sociální síť"]),
    hints: ["Scratch je na scratch.mit.edu.", "Programuješ skládáním barevných bloků — bez psaní kódu."],
  },
  {
    question: "Jak se nazývá postavička (objekt) ve Scratchi?",
    correctAnswer: "Sprite",
    options: shuffle(["Sprite", "Skript", "Scéna", "Blok"]),
    hints: ["Sprite = postavička nebo objekt, který pohybuješ.", "Kocour je výchozí sprite ve Scratchi."],
  },
  {
    question: "Jak se nazývá pozadí ve Scratchi, na kterém sprite stojí?",
    correctAnswer: "Scéna (Stage)",
    options: shuffle(["Scéna (Stage)", "Sprite", "Skript", "Kostým"]),
    hints: ["Scéna = pozadí, prostředí příběhu.", "Sprite běhá po scéně."],
  },
  {
    question: "Co je skript ve Scratchi?",
    correctAnswer: "Program sestavený ze seřazených bloků",
    options: shuffle(["Program sestavený ze seřazených bloků", "Název postavičky", "Obrázek pozadí", "Zvukový soubor"]),
    hints: ["Skript = program = sled příkazů.", "Skript se spustí, když klikneš na zelenou vlajku."],
  },
  {
    question: "Jaká kategorie bloků ve Scratchi pohybuje spritem po scéně?",
    correctAnswer: "Pohyb",
    options: shuffle(["Pohyb", "Vzhled", "Zvuky", "Proměnné"]),
    hints: ["Pohyb = jdi N kroků, otoč se, skoč.", "Modrá kategorie bloků."],
  },
  {
    question: "Co provede blok 'řekni Ahoj! po 2 sekundy' ve Scratchi?",
    correctAnswer: "Sprite zobrazí textový bublinu 'Ahoj!' na 2 sekundy",
    options: shuffle(["Sprite zobrazí textový bublinu 'Ahoj!' na 2 sekundy", "Sprite se přemístí", "Zahrajě se zvuk", "Scéna se změní"]),
    hints: ["Blok 'řekni' patří do kategorie Vzhled.", "Textová bublina nad spritem."],
  },
  {
    question: "Co spustí program ve Scratchi?",
    correctAnswer: "Klik na zelenou vlajku",
    options: shuffle(["Klik na zelenou vlajku", "Klik na červené Stop", "Dvojklik na sprite", "Klávesa Enter"]),
    hints: ["Zelená vlajka = Start programu.", "Červené Stop = zastaví program."],
  },
  {
    question: "Co provede červené Stop ve Scratchi?",
    correctAnswer: "Zastaví všechny skripty",
    options: shuffle(["Zastaví všechny skripty", "Spustí program", "Uloží projekt", "Smaže sprite"]),
    hints: ["Stop = okamžité zastavení.", "Zelená vlajka = Start, červená = Stop."],
  },
  {
    question: "Co je Code.org?",
    correctAnswer: "Online web s kurzy programování pro děti bez nutnosti instalace",
    options: shuffle(["Online web s kurzy programování pro děti bez nutnosti instalace", "Herní konzole", "Offline programovací prostředí", "Sociální síť pro programátory"]),
    hints: ["Code.org je zdarma a dostupné přes web.", "Nepotřebuješ nic instalovat."],
  },
  {
    question: "Co je 'Hour of Code'?",
    correctAnswer: "Akce, kdy si každý může vyzkoušet programování za 1 hodinu",
    options: shuffle(["Akce, kdy si každý může vyzkoušet programování za 1 hodinu", "Hodina dějepisu o počítačích", "Soutěž v rychlém psaní", "Hodina anglického jazyka"]),
    hints: ["Hour of Code = Hodina kódu.", "Je to celosvětová akce popularizace programování."],
  },
  {
    question: "Jaká kategorie bloků ve Scratchi zahrnuje bloky 'opakuj' a 'čekej'?",
    correctAnswer: "Řízení",
    options: shuffle(["Řízení", "Pohyb", "Zvuky", "Proměnné"]),
    hints: ["Řízení = řídí tok programu (smyčky, podmínky).", "Oranžová kategorie bloků."],
  },
  {
    question: "Co je proměnná ve Scratchi?",
    correctAnswer: "Pojmenované místo pro uložení čísla nebo textu (zapamatování hodnoty)",
    options: shuffle(["Pojmenované místo pro uložení čísla nebo textu (zapamatování hodnoty)", "Speciální sprite", "Blok pohybu", "Zvukový efekt"]),
    hints: ["Proměnná = jako krabička s popiskem.", "Např. 'skóre = 0' → proměnná skóre."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď, co tvoří Scratch projekt: sprite, skript, scéna. Co je správné pořadí od největšího po nejmenší?",
    correctAnswer: "Projekt → Scéna + Sprite → Skript → Bloky",
    options: shuffle(["Projekt → Scéna + Sprite → Skript → Bloky", "Bloky → Skript → Sprite → Projekt", "Scéna → Bloky → Sprite → Skript", "Sprite → Projekt → Bloky → Scéna"]),
    hints: ["Projekt obsahuje scénu a sprity.", "Sprite má skripty sestavené z bloků."],
  },
  {
    question: "Co je kostým spritu ve Scratchi?",
    correctAnswer: "Různé podoby/obrázky jednoho spritu (např. postava v pohybu)",
    options: shuffle(["Různé podoby/obrázky jednoho spritu (např. postava v pohybu)", "Zvukový soubor", "Skript spritu", "Název proměnné"]),
    hints: ["Kostým = jak sprite vypadá.", "Změnou kostýmu animuješ pohyb."],
  },
  {
    question: "Jaký blok ve Scratchi zahájí skript, když uživatel stiskne konkrétní klávesu?",
    correctAnswer: "Blok z kategorie Události: 'když stisknete klávesu [...]'",
    options: shuffle(["Blok z kategorie Události: 'když stisknete klávesu [...]'", "Blok z kategorie Pohyb", "Blok z kategorie Zvuky", "Blok z kategorie Proměnné"]),
    hints: ["Události = co spustí skript.", "Klávesa, vlajka nebo klik spravují od Události."],
  },
  {
    question: "Ve Scratchi chceš, aby sprite opakoval pohyb 10krát. Jaký blok použiješ?",
    correctAnswer: "Blok 'opakuj 10krát' z kategorie Řízení",
    options: shuffle(["Blok 'opakuj 10krát' z kategorie Řízení", "Blok 'jdi 10 kroků' z kategorie Pohyb", "Blok 'řekni' z kategorie Vzhled", "Blok 'zahraj zvuk' z kategorie Zvuky"]),
    hints: ["Opakování = Řízení.", "Uvnitř bloku opakování vložíš blok pohybu."],
  },
  {
    question: "Co je vizuální programování?",
    correctAnswer: "Programování skládáním bloků/ikon místo psaní textového kódu",
    options: shuffle(["Programování skládáním bloků/ikon místo psaní textového kódu", "Programování v obrázkovém editoru", "Psaní kódu v Pythonu", "Tvorba videí"]),
    hints: ["Vizuální = vidíš bloky, nepisuješ text.", "Scratch a Code.org jsou vizuální prostředí."],
  },
  {
    question: "Co přidává kategorie bloků 'Zvuky' ve Scratchi?",
    correctAnswer: "Přehrávání zvuků a hudby ve skriptu",
    options: shuffle(["Přehrávání zvuků a hudby ve skriptu", "Pohyb po scéně", "Zobrazení textu", "Uložení proměnné"]),
    hints: ["Zvuky = zahraj zvuk, zastav zvuky.", "Fialová kategorie ve Scratchi."],
  },
  {
    question: "Jaká akce ve Scratchi změní scénu (pozadí)?",
    correctAnswer: "Blok 'přepni pozadí na [...]' z kategorie Vzhled",
    options: shuffle(["Blok 'přepni pozadí na [...]' z kategorie Vzhled", "Blok 'jdi 10 kroků'", "Blok 'řekni Ahoj!'", "Blok 'zahraj zvuk'"]),
    hints: ["Pozadí = scéna.", "Změna pozadí je v kategorii Vzhled."],
  },
  {
    question: "Co je sekvence bloků ve Scratchi?",
    correctAnswer: "Bloky seřazené za sebou, které se provádějí v daném pořadí",
    options: shuffle(["Bloky seřazené za sebou, které se provádějí v daném pořadí", "Bloky vedle sebe bez pořadí", "Jeden blok", "Náhodné bloky"]),
    hints: ["Sekvence = pořadí.", "Jako algoritmus — kroky za sebou."],
  },
  {
    question: "Scratch byl vytvořen na MIT. Co to znamená?",
    correctAnswer: "MIT je prestižní americká univerzita, která Scratch vyvinula",
    options: shuffle(["MIT je prestižní americká univerzita, která Scratch vyvinula", "MIT je zkratka pro Microsoft Internet Technology", "MIT je název programovacího jazyka", "MIT je herní studio"]),
    hints: ["MIT = Massachusetts Institute of Technology.", "Scratch je na scratch.mit.edu."],
  },
  {
    question: "Co je Angry Birds na Code.org?",
    correctAnswer: "Úvodní programovací kurz pro začátečníky s herní tematikou",
    options: shuffle(["Úvodní programovací kurz pro začátečníky s herní tematikou", "Mobilní hra pro download", "Soutěž v programování", "Platforma pro tvorbu her"]),
    hints: ["Code.org používá hry jako motiv pro výuku.", "Angry Birds kurz učí základy algoritmů."],
  },
  {
    question: "Co je sprite ve Scratchi vedle kočky?",
    correctAnswer: "Jakýkoli obrázek/objekt, který lze pohybovat nebo ovládat skriptem",
    options: shuffle(["Jakýkoli obrázek/objekt, který lze pohybovat nebo ovládat skriptem", "Jen obrázky zvířat", "Jen geometrické tvary", "Pozadí scény"]),
    hints: ["Sprite může být cokoliv — ryba, auto, hvězda.", "Kočka je jen výchozí sprite."],
  },
  {
    question: "Jak Scratch pomáhá dětem učit se programování?",
    correctAnswer: "Odstraňuje nutnost psát textový kód — stačí skládat bloky",
    options: shuffle(["Odstraňuje nutnost psát textový kód — stačí skládat bloky", "Ukazuje jak psát Python", "Učí anglický jazyk", "Trénuje psaní na klávesnici"]),
    hints: ["Bloky = snadnější začátek bez syntaktických chyb.", "Vizuální programování snižuje bariéru vstupu."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jaký je rozdíl mezi Scratch a textovým programovacím jazykem (např. Python)?",
    correctAnswer: "Scratch = bloky (vizuální), Python = psaný textový kód; oba jsou algoritmy",
    options: shuffle(["Scratch = bloky (vizuální), Python = psaný textový kód; oba jsou algoritmy", "Scratch je lepší než Python", "Python je pro děti, Scratch pro dospělé", "Scratch nemůže dělat smyčky, Python ano"]),
    hints: ["Obě prostředí realizují algoritmy, jen jinak.", "Scratch je vizuální vstup, Python je textový."],
  },
  {
    question: "Co je broadcast (zpráva/událost) ve Scratchi?",
    correctAnswer: "Způsob komunikace mezi skripty — jeden skript vyšle zprávu, jiný na ni reaguje",
    options: shuffle(["Způsob komunikace mezi skripty — jeden skript vyšle zprávu, jiný na ni reaguje", "Zvukový efekt", "Blok pohybu spritu", "Typ kostýmu"]),
    hints: ["Broadcast = rozeslat zprávu všem skriptům.", "Jiný sprite může zachytit zprávu a reagovat."],
  },
  {
    question: "Ve Scratchi chceš sprite pohybovat stále, dokud nestiskneš klávesu 'q'. Jaký blok použiješ?",
    correctAnswer: "Blok 'opakuj dokud [klávesa q stisknuta]' z kategorie Řízení",
    options: shuffle(["Blok 'opakuj dokud [klávesa q stisknuta]' z kategorie Řízení", "Blok 'opakuj 10krát'", "Blok 'čekej 1 sekundu'", "Blok 'jdi 10 kroků'"]),
    hints: ["Opakuj DOKUD = while loop.", "Podmínka: klávesa q stisknuta."],
  },
  {
    question: "Proč je Scratch vhodný pro začátečníky oproti Pythonu?",
    correctAnswer: "Scratch zabraňuje syntaktickým chybám — bloky lze skládat jen správně",
    options: shuffle(["Scratch zabraňuje syntaktickým chybám — bloky lze skládat jen správně", "Scratch je rychlejší", "Scratch má více funkcí", "Scratch neumožňuje smyčky"]),
    hints: ["V Pythonu špatná interpunkce = chyba.", "Ve Scratchi nenapíšeš špatné slovo — jen skládáš bloky."],
  },
  {
    question: "Co se stane, když ve Scratchi sprite dojde na kraj scény a blok 'odraž se od okraje' není aktivní?",
    correctAnswer: "Sprite zmizí za kraj scény nebo se zastaví u okraje",
    options: shuffle(["Sprite zmizí za kraj scény nebo se zastaví u okraje", "Sprite se automaticky odrazí", "Sprite změní kostým", "Scéna se přesune"]),
    hints: ["Bez bloku 'odraž se' sprite nepočítá s okrajem.", "Musíš přidat blok, aby se sprite odrážel."],
  },
  {
    question: "Co je proměnná 'skóre' ve Scratch hře a proč ji potřebuješ?",
    correctAnswer: "Proměnná uchovává aktuální skóre — mění se při každém úspěchu hráče",
    options: shuffle(["Proměnná uchovává aktuální skóre — mění se při každém úspěchu hráče", "Skóre je zvukový efekt", "Skóre je typ spritu", "Skóre je pozadí scény"]),
    hints: ["Proměnná = pojmenovaná 'krabička' pro hodnotu.", "Skóre začíná na 0 a roste."],
  },
  {
    question: "Jaký je základní princip vizuálního programování?",
    correctAnswer: "Příkazy jsou reprezentovány bloky, které skládáš do sekvence",
    options: shuffle(["Příkazy jsou reprezentovány bloky, které skládáš do sekvence", "Píšeš kód na klávesnici", "Algoritmus se generuje automaticky", "Program kreslíš myší"]),
    hints: ["Vizuální = vidíš bloky, ne text.", "Sekvence bloků = algoritmus."],
  },
  {
    question: "Ve Scratchi chceš, aby sprite řekl 'Výhra!' jen pokud proměnná skóre > 10. Jaké bloky použiješ?",
    correctAnswer: "Blok 'když [skóre > 10] pak [řekni Výhra!]' z kategorie Řízení + Vzhled",
    options: shuffle(["Blok 'když [skóre > 10] pak [řekni Výhra!]' z kategorie Řízení + Vzhled", "Blok 'opakuj 10krát'", "Blok 'zahraj zvuk Výhra'", "Blok 'přepni kostým'"]),
    hints: ["Podmínka = Řízení → 'když ... pak'.", "Uvnitř podmínky vložíš blok 'řekni'."],
  },
  {
    question: "Jak se od Scratche liší Code.org?",
    correctAnswer: "Code.org je web s řízenými kurzy a úkoly, Scratch je volné tvůrčí prostředí",
    options: shuffle(["Code.org je web s řízenými kurzy a úkoly, Scratch je volné tvůrčí prostředí", "Code.org i Scratch jsou totéž", "Scratch je pro dospělé, Code.org pro děti", "Code.org vyžaduje instalaci"]),
    hints: ["Code.org = strukturované lekce.", "Scratch = tvoříš co chceš."],
  },
  {
    question: "Proč je sekvence bloků ve Scratchi ekvivalentem algoritmu?",
    correctAnswer: "Obě popisují přesné kroky v daném pořadí, které vedou k výsledku",
    options: shuffle(["Obě popisují přesné kroky v daném pořadí, které vedou k výsledku", "Sekvence bloků je jen grafika", "Algoritmus se nezapisuje bloky", "Pořadí bloků není důležité"]),
    hints: ["Sekvence = pořadí.", "Algoritmus = přesný sled kroků = sekvence bloků."],
  },
  {
    question: "Co je Frozen kurz na Code.org?",
    correctAnswer: "Kurz programování s tématikou Disney Frozen pro začátečníky",
    options: shuffle(["Kurz programování s tématikou Disney Frozen pro začátečníky", "Hra o zmrzlých objektech", "Kurs o chladírenství", "Výukový program o ledu"]),
    hints: ["Code.org používá populární témata (Frozen, Angry Birds) k výuce.", "Frozen kurz učí základy tahů a funkcí."],
  },
  {
    question: "Může mít jeden sprite více skriptů ve Scratchi?",
    correctAnswer: "Ano — více skriptů může běžet najednou (paralelně)",
    options: shuffle(["Ano — více skriptů může běžet najednou (paralelně)", "Ne — každý sprite má jen jeden skript", "Jen 2 skripty maximálně", "Skripty patří scéně, ne spritu"]),
    hints: ["Jeden sprite může mít skript pro pohyb a jiný pro zvuk.", "Skripty běží paralelně."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool =
    level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 35);
}

export const VIZUALNIPROGRAMOVACIPROSTREDINAPRSCRATCHJRCODEORGUVOD: TopicMetadata[] = [
  {
    id: "g4-informatika-algoritmizace-a-programovani-pokyny-a-postupy-vizualni-programovaci-prostredi-napr-scratch-jr-code-org-uvo",
    rvpNodeId: "g4-informatika-algoritmizace-a-programovani-pokyny-a-postupy-vizualni-programovaci-prostredi-napr-scratch-jr-code-org-uvo",
    title: "Vizuální programovací prostředí (např. Scratch Jr, Code.org) - úvod",
    studentTitle: "Scratch a Code.org",
    subject: "informatika",
    category: "Algoritmizace a programování",
    topic: "Algoritmizace a programování",
    briefDescription: "Poznáš prostředí Scratch a Code.org a naučíš se sestavovat programy z bloků.",
    keywords: ["Scratch", "Code.org", "sprite", "blok", "skript", "vizuální programování"],
    goals: [
      "Žák popíše základní pojmy Scratche: sprite, scéna, skript, blok",
      "Žák vysvětlí, co spouští a zastavuje program ve Scratchi",
      "Žák rozliší kategorie bloků ve Scratchi",
    ],
    boundaries: ["Žák nezapisuje kód v textovém jazyce"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "conceptual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Scratch: sprite = postavička, scéna = pozadí, skript = program z bloků. Zelená vlajka = start, červené Stop = zastavení.",
      steps: [
        "Vzpomeň si: co je to sprite a co scéna?",
        "Jaká kategorie bloků dělá pohyb / zvuk / opakování?",
        "Co spouští a zastavuje program?",
      ],
      commonMistake: "Záměna sprite (postavičky) a scény (pozadí).",
      example: "Kocour (sprite) běhá po trávníku (scéna). Program spustí zelená vlajka.",
    },
  },
];
