import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DRAG_TASKS: PracticeTask[] = [
  {
    question: "Seřaď kroky správného otevření a uložení dokumentu ve Wordu:",
    correctAnswer: "Otevři Word,Vytvoř nový dokument,Piš text,Stiskni Ctrl+S pro uložení,Pojmenuj soubor,Klikni Uložit",
    items: ["Otevři Word", "Vytvoř nový dokument", "Piš text", "Stiskni Ctrl+S pro uložení", "Pojmenuj soubor", "Klikni Uložit"],
    hints: ["Nejprve otevřeš program.", "Ukládáš průběžně, ne až na konci."],
  },
  {
    question: "Seřaď kroky správného ukončení práce a vypnutí počítače:",
    correctAnswer: "Ulož všechny otevřené soubory,Zavři aplikace,Klikni Start,Vyber Vypnout,Počkej na dokončení vypnutí",
    items: ["Ulož všechny otevřené soubory", "Zavři aplikace", "Klikni Start", "Vyber Vypnout", "Počkej na dokončení vypnutí"],
    hints: ["Nejprve ulož, pak zavři.", "Nikdy netrhej napájení bez předchozího uložení."],
  },
  {
    question: "Seřaď kroky přesunutí souboru do složky:",
    correctAnswer: "Otevři Průzkumník souborů,Najdi soubor,Klikni pravým tlačítkem,Vyber Vyjmout,Otevři cílovou složku,Klikni Vložit",
    items: ["Otevři Průzkumník souborů", "Najdi soubor", "Klikni pravým tlačítkem", "Vyber Vyjmout", "Otevři cílovou složku", "Klikni Vložit"],
    hints: ["Vyjmout = přesunout (Ctrl+X).", "Pak vložíš na nové místo (Ctrl+V)."],
  },
  {
    question: "Seřaď kroky 'Uložit jako' (uložení pod novým názvem):",
    correctAnswer: "Klikni na Soubor,Vyber Uložit jako,Zadej nový název souboru,Vyber cílovou složku,Klikni Uložit",
    items: ["Klikni na Soubor", "Vyber Uložit jako", "Zadej nový název souboru", "Vyber cílovou složku", "Klikni Uložit"],
    hints: ["Soubor → Uložit jako = nový název nebo složka.", "Nezapomeň zvolit správný formát."],
  },
  {
    question: "Seřaď kroky instalace nové aplikace:",
    correctAnswer: "Stáhni instalační soubor,Spusť instalátor,Přijmi podmínky,Zvol cílovou složku,Klikni Nainstalovat,Počkej na dokončení",
    items: ["Stáhni instalační soubor", "Spusť instalátor", "Přijmi podmínky", "Zvol cílovou složku", "Klikni Nainstalovat", "Počkej na dokončení"],
    hints: ["Nejprve stahuješ, pak instaluješ.", "Přijmout podmínky = nutný krok."],
  },
];

const SELECT_L1: PracticeTask[] = [
  {
    question: "Jak nejrychleji spustíš aplikaci na Windows?",
    correctAnswer: "Dvojklik na ikonu na ploše nebo hledáš ji ve Start menu",
    options: shuffle(["Dvojklik na ikonu na ploše nebo hledáš ji ve Start menu", "Jednoklik na ikonu", "Pravý klik → Spustit", "Třiklik na ikonu"]),
    hints: ["Dvojklik = otevřít program.", "Start menu = vyhledávání aplikací."],
  },
  {
    question: "Jaká klávesová zkratka uloží soubor ve Windows?",
    correctAnswer: "Ctrl + S",
    options: shuffle(["Ctrl + S", "Ctrl + C", "Ctrl + V", "Alt + F4"]),
    hints: ["S = Save (uložit).", "Ctrl + S = rychlé uložení."],
  },
  {
    question: "Jaká klávesová zkratka uloží soubor na Mac?",
    correctAnswer: "Cmd + S",
    options: shuffle(["Cmd + S", "Ctrl + S", "Cmd + C", "Cmd + Q"]),
    hints: ["Mac = Command (Cmd) místo Ctrl.", "Cmd + S = uložit na Macu."],
  },
  {
    question: "Jak zavřeš okno aplikace ve Windows?",
    correctAnswer: "Klikni na X v pravém horním rohu okna",
    options: shuffle(["Klikni na X v pravém horním rohu okna", "Stiskni Enter", "Klikni na červené kolečko vlevo nahoře", "Stiskni Ctrl+S"]),
    hints: ["Windows = X vpravo nahoře.", "Mac = červené kolečko vlevo nahoře."],
  },
  {
    question: "Jak zavřeš okno aplikace na Macu?",
    correctAnswer: "Klikni na červené kolečko vlevo nahoře",
    options: shuffle(["Klikni na červené kolečko vlevo nahoře", "Klikni na X vpravo nahoře", "Stiskni Esc", "Stiskni Cmd+S"]),
    hints: ["Mac = tři barevná kolečka vlevo nahoře.", "Červené = zavřít, žluté = minimalizovat, zelené = celá obrazovka."],
  },
  {
    question: "Co je klávesová zkratka Alt+F4 ve Windows?",
    correctAnswer: "Zavřít aktuální aplikaci",
    options: shuffle(["Zavřít aktuální aplikaci", "Uložit soubor", "Otevřít nový soubor", "Minimalizovat okno"]),
    hints: ["Alt+F4 = rychlé zavření aplikace.", "Pozor: neuložená práce se ztratí!"],
  },
  {
    question: "Co je to koš (Recycle Bin) ve Windows?",
    correctAnswer: "Dočasné úložiště smazaných souborů — lze je obnovit, než koš vysypeš",
    options: shuffle(["Dočasné úložiště smazaných souborů — lze je obnovit, než koš vysypeš", "Zálohovací složka", "Složka pro důležité soubory", "Program pro mazání virů"]),
    hints: ["Koš = odstraněné soubory čekají.", "Vysypat koš = trvalé smazání."],
  },
  {
    question: "Co je formát .docx?",
    correctAnswer: "Formát dokumentů Microsoft Word",
    options: shuffle(["Formát dokumentů Microsoft Word", "Formát pro obrázky", "Formát pro tabulky Excel", "Formát pro videa"]),
    hints: [".docx = Word dokument.", "Word = textový editor od Microsoftu."],
  },
  {
    question: "Co je formát .pdf?",
    correctAnswer: "Portable Document Format — dokument určený ke čtení, zachovává formátování",
    options: shuffle(["Portable Document Format — dokument určený ke čtení, zachovává formátování", "Formát pro editaci textu", "Formát pro tabulky", "Formát pro hudbu"]),
    hints: [".pdf = prezentace, factury, manuály.", "PDF vypadá stejně na každém zařízení."],
  },
  {
    question: "Jak přepnout mezi otevřenými aplikacemi ve Windows?",
    correctAnswer: "Alt + Tab",
    options: shuffle(["Alt + Tab", "Ctrl + Tab", "Windows + Tab", "Shift + Tab"]),
    hints: ["Alt + Tab = přepínání okna.", "Drž Alt, stiskni Tab opakovaně."],
  },
  {
    question: "Co je složka (adresář) v počítači?",
    correctAnswer: "Kontejner pro organizaci souborů a dalších složek",
    options: shuffle(["Kontejner pro organizaci souborů a dalších složek", "Soubor s textem", "Program", "Záloha dat"]),
    hints: ["Složka = jako šuplík pro organizaci.", "Složky vytváříš pro přehlednost."],
  },
  {
    question: "Co se stane se souborem, pokud ho smažeš a nevysypeš koš?",
    correctAnswer: "Soubor je stále v koši a lze ho obnovit",
    options: shuffle(["Soubor je stále v koši a lze ho obnovit", "Soubor je trvale smazán", "Soubor se přesune do záloh", "Soubor se přejmenuje"]),
    hints: ["Koš = bezpečná smažení.", "Vysypat koš = teprve pak je soubor pryč."],
  },
];

const SELECT_L2: PracticeTask[] = [
  {
    question: "Co je Spotlight na Macu?",
    correctAnswer: "Vyhledávání aplikací a souborů (Cmd + mezerník)",
    options: shuffle(["Vyhledávání aplikací a souborů (Cmd + mezerník)", "Aplikace pro prohlížení fotek", "Typ bezpečnostního nastavení", "Správce hesel"]),
    hints: ["Spotlight = magnifying glass v Macu.", "Cmd + mezerník = otevři Spotlight."],
  },
  {
    question: "Co je Task Manager ve Windows a k čemu slouží?",
    correctAnswer: "Přehled běžících programů a procesů — lze ukončit zamrzlé aplikace",
    options: shuffle(["Přehled běžících programů a procesů — lze ukončit zamrzlé aplikace", "Správce souborů", "Antivirový program", "Program pro instalaci aplikací"]),
    hints: ["Ctrl + Shift + Esc = Task Manager.", "Zamrzlá aplikace = Task Manager → Ukončit úlohu."],
  },
  {
    question: "Co je stromová struktura souborů?",
    correctAnswer: "Hierarchické uspořádání složek a souborů (kořenová složka → podsložky → soubory)",
    options: shuffle(["Hierarchické uspořádání složek a souborů (kořenová složka → podsložky → soubory)", "Náhodné řazení souborů", "Záloha souborů", "Formát souborů"]),
    hints: ["Strom = kořen nahoře, větvení dolů.", "C: → Dokumenty → Škola → Čeština."],
  },
  {
    question: "Jaká zkratka otevře nový soubor v aplikaci (Windows)?",
    correctAnswer: "Ctrl + N",
    options: shuffle(["Ctrl + N", "Ctrl + O", "Ctrl + S", "Ctrl + P"]),
    hints: ["N = New (nový).", "Ctrl + N = nový soubor/okno."],
  },
  {
    question: "Jaká zkratka otevře existující soubor (Windows)?",
    correctAnswer: "Ctrl + O",
    options: shuffle(["Ctrl + O", "Ctrl + N", "Ctrl + S", "Ctrl + P"]),
    hints: ["O = Open (otevřít).", "Ctrl + O = otevřít soubor."],
  },
  {
    question: "Co je Taskbar (hlavní panel) ve Windows?",
    correctAnswer: "Lišta dole na obrazovce s ikonami spuštěných aplikací a tlačítkem Start",
    options: shuffle(["Lišta dole na obrazovce s ikonami spuštěných aplikací a tlačítkem Start", "Záhlaví každého okna", "Hlavní nabídka aplikace", "Panel nástrojů ve Wordu"]),
    hints: ["Taskbar = Windows pruh dole.", "Start button + hodiny + ikonky."],
  },
  {
    question: "Co je Dock na Macu?",
    correctAnswer: "Lišta s ikonami oblíbených a spuštěných aplikací (obvykle dole nebo na straně)",
    options: shuffle(["Lišta s ikonami oblíbených a spuštěných aplikací (obvykle dole nebo na straně)", "Záhlaví oken", "Vyhledávání (Spotlight)", "Menu Bar nahoře"]),
    hints: ["Dock = Mac alternativa Taskbaru.", "Přidáváš do Docku oblíbené aplikace."],
  },
  {
    question: "Co je 'Uložit jako' (Save As) a proč je užitečné?",
    correctAnswer: "Uloží dokument pod novým názvem nebo do jiné složky/formátu — zachová originál",
    options: shuffle(["Uloží dokument pod novým názvem nebo do jiné složky/formátu — zachová originál", "Přepíše originál soubor", "Zálohuje soubor automaticky", "Smaže starý soubor"]),
    hints: ["Uložit = přepsat originál.", "Uložit jako = nový soubor, originál zůstane."],
  },
  {
    question: "Co je Window (okno) v operačním systému?",
    correctAnswer: "Obdélníková oblast na obrazovce zobrazující obsah aplikace",
    options: shuffle(["Obdélníková oblast na obrazovce zobrazující obsah aplikace", "Typ souboru", "Část klávesnice", "Program pro zobrazení fotek"]),
    hints: ["Okno = aplikace v obdélníkové ploše.", "Lze přesouvat, zvětšovat, minimalizovat."],
  },
  {
    question: "Co se stane s neuloženou prací při náhlém výpadku proudu?",
    correctAnswer: "Neuložená data jsou ztracena — proto ukládáme průběžně (Ctrl+S)",
    options: shuffle(["Neuložená data jsou ztracena — proto ukládáme průběžně (Ctrl+S)", "Data se automaticky obnoví", "Data jsou v koši", "Data zůstanou v RAM"]),
    hints: ["RAM se vymaže při výpadku proudu.", "Uložený soubor = na disku = přežije výpadek."],
  },
  {
    question: "Jaký formát je vhodný pro sdílení dokumentu, který nechceš, aby příjemce editoval?",
    correctAnswer: ".pdf — zachovává formátování a obtížně se edituje",
    options: shuffle([".pdf — zachovává formátování a obtížně se edituje", ".docx — snadno editovatelný", ".txt — jen prostý text", ".xlsx — tabulka Excel"]),
    hints: ["PDF = pro čtení, ne editaci.", "Faktury, smlouvy = PDF."],
  },
];

const SELECT_L3: PracticeTask[] = [
  {
    question: "Co je absolutní cesta k souboru vs. relativní cesta?",
    correctAnswer: "Absolutní = od kořene (C:\\Dokumenty\\soubor.txt); relativní = od aktuálního adresáře (..\\soubor.txt)",
    options: shuffle(["Absolutní = od kořene (C:\\Dokumenty\\soubor.txt); relativní = od aktuálního adresáře (..\\soubor.txt)", "Jsou totéž", "Relativní je vždy delší", "Absolutní funguje jen na Windows"]),
    hints: ["Absolutní = úplná adresa.", "Relativní = relativně od místa, kde jsi."],
  },
  {
    question: "Co je fork a join v kontextu procesů (spuštěných programů)?",
    correctAnswer: "Fork = vytvoření nového podprocesu; join = čekání na dokončení podprocesu",
    options: shuffle(["Fork = vytvoření nového podprocesu; join = čekání na dokončení podprocesu", "Fork = záloha souboru; join = spojení souborů", "Jsou příkazy pro práci se složkami", "Fork = přejmenování souboru"]),
    hints: ["Fork = 'větev' nového procesu.", "Programovací termíny pro paralelní zpracování."],
  },
  {
    question: "Co je virtuální paměť a jak pomáhá při nedostatku RAM?",
    correctAnswer: "OS používá část pevného disku jako rozšíření RAM — pomalejší, ale umožní spustit více aplikací",
    options: shuffle(["OS používá část pevného disku jako rozšíření RAM — pomalejší, ale umožní spustit více aplikací", "Záloha RAM na cloud", "Typ flash paměti", "Rychlejší než RAM"]),
    hints: ["Virtuální paměť = swap soubor.", "Disk je pomalejší než RAM → aplikace zpomalí."],
  },
  {
    question: "Co je sandbox (karanténa aplikací)?",
    correctAnswer: "Izolované prostředí, kde aplikace běží bez přístupu k ostatnímu systému",
    options: shuffle(["Izolované prostředí, kde aplikace běží bez přístupu k ostatnímu systému", "Zálohovací systém", "Typ antivirového skenování", "Správce souborů"]),
    hints: ["Sandbox = 'pískoviště' — hraješ si bez poškození okolí.", "Prohlížeče používají sandbox pro každou záložku."],
  },
  {
    question: "Co je daemon (démon) v operačním systému?",
    correctAnswer: "Program běžící na pozadí bez uživatelského rozhraní (např. antivirový skener, tiskový server)",
    options: shuffle(["Program běžící na pozadí bez uživatelského rozhraní (např. antivirový skener, tiskový server)", "Vizuální aplikace pro správu souborů", "Typ viru", "Druh operačního systému"]),
    hints: ["Daemon = background process = spustí se automaticky.", "Windows services = daemony."],
  },
  {
    question: "Co je DLL (Dynamic Link Library)?",
    correctAnswer: "Sdílená knihovna funkcí, kterou mohou využívat různé aplikace najednou",
    options: shuffle(["Sdílená knihovna funkcí, kterou mohou využívat různé aplikace najednou", "Formát dokumentu", "Typ zálohy", "Operační systém"]),
    hints: ["DLL = znovupoužitelný kód pro více aplikací.", "DLL problém = aplikace nemůže najít potřebnou knihovnu."],
  },
  {
    question: "Co je registry ve Windows?",
    correctAnswer: "Hierarchická databáze konfiguračních nastavení OS a aplikací",
    options: shuffle(["Hierarchická databáze konfiguračních nastavení OS a aplikací", "Záloha souborů", "Správce aplikací", "Typ antivirového programu"]),
    hints: ["Regedit.exe = editor registru.", "Registy uchovávají nastavení Windows a programů."],
  },
  {
    question: "Co je příkazová řádka (Command Prompt / Terminal)?",
    correctAnswer: "Textové rozhraní pro ovládání počítače příkazy místo klikání myší",
    options: shuffle(["Textové rozhraní pro ovládání počítače příkazy místo klikání myší", "Grafický správce souborů", "Typ textového editoru", "Zálohovací program"]),
    hints: ["cmd.exe = Command Prompt ve Windows.", "Terminal = macOS/Linux příkazová řádka."],
  },
  {
    question: "Co je symlink (symbolický odkaz)?",
    correctAnswer: "Zkratka/odkaz na jiný soubor nebo složku — přístup přes odkaz otevře originál",
    options: shuffle(["Zkratka/odkaz na jiný soubor nebo složku — přístup přes odkaz otevře originál", "Kopie souboru", "Záloha souboru", "Typ komprimovaného souboru"]),
    hints: ["Symlink = jako zástupce na ploše.", "Přes symlink přistupuješ k originálu."],
  },
  {
    question: "Proč je automatické ukládání (AutoSave) v cloudových aplikacích výhodné?",
    correctAnswer: "Data se ukládají průběžně bez nutnosti ručního Ctrl+S — nic se neztratí",
    options: shuffle(["Data se ukládají průběžně bez nutnosti ručního Ctrl+S — nic se neztratí", "AutoSave je pomalejší", "AutoSave funguje jen na Mac", "AutoSave vyžaduje Ctrl+S navíc"]),
    hints: ["Google Docs, Microsoft 365 mají AutoSave.", "Každá změna okamžitě uložena do cloudu."],
  },
];

function gen(level: number): PracticeTask[] {
  const dragPool = shuffle(DRAG_TASKS).slice(0, 3);
  const selectPool =
    level === 1
      ? shuffle(SELECT_L1).slice(0, 20)
      : level === 2
      ? shuffle(SELECT_L2).slice(0, 20)
      : shuffle(SELECT_L3).slice(0, 20);
  return shuffle([...dragPool, ...selectPool]);
}

export const PRACESAPLIKACEMISPOUSTENIUKLADANIUKONCENI: TopicMetadata[] = [
  {
    id: "g4-informatika-digitalni-technologie-hardware-a-software-prace-s-aplikacemi-spousteni-ukladani-ukonceni",
    rvpNodeId: "g4-informatika-digitalni-technologie-hardware-a-software-prace-s-aplikacemi-spousteni-ukladani-ukonceni",
    title: "Práce s aplikacemi - spouštění, ukládání, ukončení",
    studentTitle: "Práce s aplikacemi",
    subject: "informatika",
    category: "Digitální technologie",
    topic: "Digitální technologie",
    briefDescription: "Naučíš se spouštět, ukládat a ukončovat aplikace a pracovat se soubory a složkami.",
    keywords: ["aplikace", "uložit", "Ctrl+S", "soubor", "složka", "koš", "formát", "spustit"],
    goals: [
      "Žák popíše, jak spustit, uložit a ukončit aplikaci",
      "Žák vysvětlí rozdíl mezi Uložit a Uložit jako",
      "Žák rozliší základní formáty souborů",
    ],
    boundaries: ["Žák se nezabývá pokročilou správou procesů a systémovými nástroji"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Ctrl+S = uložit, Ctrl+N = nový, Ctrl+O = otevřít. Koš = smazané soubory (lze obnovit). Uložit as = nový název.",
      steps: [
        "Spuštění: dvojklik na ikonu nebo Start menu",
        "Ukládání: Ctrl+S průběžně (neztrácet práci)",
        "Ukončení: klikni X (Windows) nebo červené kolečko (Mac)",
      ],
      commonMistake: "Zavření aplikace bez uložení — vždy ulož před zavřením.",
      example: "Napsal jsi esej ve Wordu → Ctrl+S → pak zavři X. Bez Ctrl+S = práce ztracena.",
    },
  },
];
