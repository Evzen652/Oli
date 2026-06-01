import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MATCH_TASKS: PracticeTask[] = [
  {
    question: "Spoj části počítače s jejich funkcí (vstupní/výstupní zařízení):",
    correctAnswer: "Klávesnice-Vstupní zařízení — zadávání textu|Monitor-Výstupní zařízení — zobrazuje obraz|Mikrofon-Vstupní zařízení — snímá zvuk|Reproduktory-Výstupní zařízení — přehrávají zvuk",
    pairs: [
      { left: "Klávesnice", right: "Vstupní zařízení — zadávání textu" },
      { left: "Monitor", right: "Výstupní zařízení — zobrazuje obraz" },
      { left: "Mikrofon", right: "Vstupní zařízení — snímá zvuk" },
      { left: "Reproduktory", right: "Výstupní zařízení — přehrávají zvuk" },
    ],
    hints: ["Vstupní = data jdou DO počítače.", "Výstupní = data jdou Z počítače k uživateli."],
  },
  {
    question: "Spoj součásti uvnitř počítače s jejich popisem:",
    correctAnswer: "CPU – procesor-Mozek počítače, zpracovává instrukce|RAM-Dočasná pracovní paměť – vymaže se po vypnutí|HDD nebo SSD-Trvalé uložení dat a programů|GPU – grafická karta-Zpracovává obraz a 3D grafiku",
    pairs: [
      { left: "CPU (procesor)", right: "Mozek počítače, zpracovává instrukce" },
      { left: "RAM", right: "Dočasná pracovní paměť (vymaže se po vypnutí)" },
      { left: "HDD nebo SSD", right: "Trvalé uložení dat a programů" },
      { left: "GPU (grafická karta)", right: "Zpracovává obraz a 3D grafiku" },
    ],
    hints: ["CPU = Central Processing Unit.", "RAM = Random Access Memory."],
  },
  {
    question: "Spoj software s jeho kategorií:",
    correctAnswer: "Windows 11-Operační systém|Microsoft Word-Textový editor – aplikace|Google Chrome-Webový prohlížeč – aplikace|VLC Media Player-Přehrávač médií – aplikace",
    pairs: [
      { left: "Windows 11", right: "Operační systém" },
      { left: "Microsoft Word", right: "Textový editor (aplikace)" },
      { left: "Google Chrome", right: "Webový prohlížeč (aplikace)" },
      { left: "VLC Media Player", right: "Přehrávač médií (aplikace)" },
    ],
    hints: ["Operační systém řídí celý počítač.", "Aplikace jsou programy pro konkrétní účel."],
  },
];

const SELECT_L1: PracticeTask[] = [
  {
    question: "Co je hardware?",
    correctAnswer: "Fyzické součásti počítače, které lze fyzicky dotknout",
    options: shuffle(["Fyzické součásti počítače, které lze fyzicky dotknout", "Programy a aplikace v počítači", "Internetové připojení", "Operační systém"]),
    hints: ["Hardware = tvrdý = fyzický.", "Klávesnice, monitor, myš = hardware."],
  },
  {
    question: "Co je software?",
    correctAnswer: "Programy a aplikace — nehmotná část počítače",
    options: shuffle(["Programy a aplikace — nehmotná část počítače", "Fyzické části počítače", "Typ monitoru", "Kabel pro internet"]),
    hints: ["Software = programy, OS, aplikace.", "Software si nemůžeš fyzicky vzít do ruky."],
  },
  {
    question: "Co je vstupní zařízení?",
    correctAnswer: "Zařízení, které přijímá data od uživatele a posílá je do počítače",
    options: shuffle(["Zařízení, které přijímá data od uživatele a posílá je do počítače", "Zařízení, které zobrazuje výsledky", "Součást uvnitř počítače", "Zálohovací zařízení"]),
    hints: ["Vstupní = vstup DO počítače.", "Klávesnice, myš, mikrofon = vstupní."],
  },
  {
    question: "Co je výstupní zařízení?",
    correctAnswer: "Zařízení, které zobrazuje nebo přehrává výsledky z počítače",
    options: shuffle(["Zařízení, které zobrazuje nebo přehrává výsledky z počítače", "Zařízení pro zadávání dat", "Součást uvnitř počítače", "Zálohovací médium"]),
    hints: ["Výstupní = výstup Z počítače.", "Monitor, tiskárna, reproduktory = výstupní."],
  },
  {
    question: "Co je CPU (procesor)?",
    correctAnswer: "Mozek počítače — zpracovává instrukce a výpočty",
    options: shuffle(["Mozek počítače — zpracovává instrukce a výpočty", "Trvalá paměť pro soubory", "Dočasná pracovní paměť", "Zařízení pro zobrazení obrazu"]),
    hints: ["CPU = Central Processing Unit.", "Čím rychlejší GHz, tím výkonnější procesor."],
  },
  {
    question: "Co je RAM?",
    correctAnswer: "Dočasná pracovní paměť — vymaže se po vypnutí počítače",
    options: shuffle(["Dočasná pracovní paměť — vymaže se po vypnutí počítače", "Trvalé uložení souborů", "Procesor", "Grafická karta"]),
    hints: ["RAM = Random Access Memory.", "Po vypnutí PC se RAM vymaže — jako pracovní plocha."],
  },
  {
    question: "Co je pevný disk (HDD nebo SSD)?",
    correctAnswer: "Trvalé uložení dat a programů — zachová obsah po vypnutí",
    options: shuffle(["Trvalé uložení dat a programů — zachová obsah po vypnutí", "Dočasná pracovní paměť", "Procesor", "Monitor"]),
    hints: ["HDD/SSD = trvalé úložiště.", "Soubory na disku zůstanou i po vypnutí."],
  },
  {
    question: "Co je operační systém?",
    correctAnswer: "Software, který řídí celý počítač a umožňuje spouštět aplikace",
    options: shuffle(["Software, který řídí celý počítač a umožňuje spouštět aplikace", "Typ procesoru", "Fyzická část počítače", "Paměťový modul"]),
    hints: ["Windows, macOS, Linux, Android = operační systémy.", "OS = základ, na kterém běží vše ostatní."],
  },
  {
    question: "Jaká jsou vstupní zařízení počítače?",
    correctAnswer: "Klávesnice, myš, mikrofon, webkamera, skener",
    options: shuffle(["Klávesnice, myš, mikrofon, webkamera, skener", "Monitor, tiskárna, reproduktory", "CPU, RAM, HDD", "Router, modem, switch"]),
    hints: ["Vstupní = data jdou DO počítače.", "Ty ovládáš vstupní zařízení, počítač zpracuje."],
  },
  {
    question: "Jaká jsou výstupní zařízení počítače?",
    correctAnswer: "Monitor, tiskárna, reproduktory, sluchátka",
    options: shuffle(["Monitor, tiskárna, reproduktory, sluchátka", "Klávesnice, myš, mikrofon", "CPU, RAM, GPU", "Router, modem, WiFi"]),
    hints: ["Výstupní = výsledky Z počítače k tobě.", "Monitor zobrazuje, tiskárna tiskne, reproduktory hrají."],
  },
  {
    question: "Co je GPU (grafická karta)?",
    correctAnswer: "Zpracovává obraz a 3D grafiku — důležitá pro hry a video",
    options: shuffle(["Zpracovává obraz a 3D grafiku — důležitá pro hry a video", "Dočasná paměť", "Trvalé úložiště", "Procesor pro výpočty"]),
    hints: ["GPU = Graphics Processing Unit.", "NVIDIA, AMD = výrobci grafických karet."],
  },
  {
    question: "Co je základní deska (motherboard)?",
    correctAnswer: "Propojuje všechny součásti počítače – CPU, RAM, GPU, disk",
    options: shuffle(["Propojuje všechny součásti počítače (CPU, RAM, GPU, disk)", "Trvalé úložiště dat", "Napájecí zdroj", "Výstupní zařízení"]),
    hints: ["Základní deska = páteř počítače.", "Vše ostatní se zapojuje do základní desky."],
  },
];

const SELECT_L2: PracticeTask[] = [
  {
    question: "Jaký je rozdíl mezi HDD a SSD?",
    correctAnswer: "HDD = magnetické plotny – pomalejší, levnější; SSD = flash paměť – rychlejší, dražší",
    options: shuffle(["HDD = magnetické plotny (pomalejší, levnější); SSD = flash paměť (rychlejší, dražší)", "Jsou totéž", "SSD je starší technologie", "HDD je vždy rychlejší"]),
    hints: ["HDD = pohyblivé části.", "SSD = žádné pohyblivé části, proto rychlejší."],
  },
  {
    question: "Proč více RAM obecně znamená rychlejší multitasking?",
    correctAnswer: "Více RAM = více programů může běžet najednou bez zpomalení",
    options: shuffle(["Více RAM = více programů může běžet najednou bez zpomalení", "RAM ovlivňuje jen grafiku", "RAM nahrazuje CPU", "RAM urychluje internet"]),
    hints: ["RAM = pracovní plocha.", "Malá plocha = musíš neustále odkládat."],
  },
  {
    question: "Co je dotyková obrazovka — vstupní nebo výstupní zařízení?",
    correctAnswer: "Vstupně-výstupní — zobrazuje obraz – výstupní i přijímá dotek – vstupní",
    options: shuffle(["Vstupně-výstupní — zobrazuje obraz (výstupní) i přijímá dotek (vstupní)", "Jen vstupní", "Jen výstupní", "Ani vstupní ani výstupní"]),
    hints: ["Dotyk = vstup.", "Zobrazení = výstup.", "Obojí = vstupně-výstupní."],
  },
  {
    question: "Co je USB flash disk z hlediska vstup/výstup?",
    correctAnswer: "Vstupně-výstupní — lze na něj data zapisovat i z něj číst",
    options: shuffle(["Vstupně-výstupní — lze na něj data zapisovat i z něj číst", "Jen vstupní", "Jen výstupní", "Není to ani vstupní ani výstupní"]),
    hints: ["Zapisuješ na flash disk (vstup do flash disku).", "Čteš z flash disku (výstup k tobě)."],
  },
  {
    question: "Jaké operační systémy se používají na desktopech a noteboocích?",
    correctAnswer: "Windows – Microsoft, macOS – Apple, Linux",
    options: shuffle(["Windows (Microsoft), macOS (Apple), Linux", "Android, iOS, Windows Phone", "iOS (Apple), Android (Google)", "Chrome OS, Android, iOS"]),
    hints: ["Desktop/notebook = Windows, Mac nebo Linux.", "Telefon = Android nebo iOS."],
  },
  {
    question: "K čemu slouží skener (scanner) jako vstupní zařízení?",
    correctAnswer: "Převádí papírový dokument nebo obrázek do digitální podoby",
    options: shuffle(["Převádí papírový dokument nebo obrázek do digitální podoby", "Tiskne dokumenty z počítače", "Přehrává zvuk", "Zobrazuje obraz"]),
    hints: ["Skener = opak tiskárny.", "Tiskárna: digitální → papír. Skener: papír → digitální."],
  },
  {
    question: "Co je napájecí zdroj (PSU) v počítači?",
    correctAnswer: "Převádí síťové napětí – 230V na nízká napětí pro součástky počítače",
    options: shuffle(["Převádí síťové napětí (230V) na nízká napětí pro součástky počítače", "Záložní baterie počítače", "Zdroj bezdrátového internetu", "Typ procesoru"]),
    hints: ["PSU = Power Supply Unit.", "Bez napájecího zdroje by počítač neběžel."],
  },
  {
    question: "Jaký je rozdíl mezi operačním systémem a aplikací?",
    correctAnswer: "OS řídí celý počítač; aplikace je program pro konkrétní úkol běžící na OS",
    options: shuffle(["OS řídí celý počítač; aplikace je program pro konkrétní úkol běžící na OS", "Jsou totéž", "Aplikace řídí OS", "OS je jen jedna aplikace"]),
    hints: ["OS = základ (Windows, macOS).", "Aplikace běží na OS (Word, Chrome, Minecraft)."],
  },
  {
    question: "Proč je webkamera vstupní zařízení?",
    correctAnswer: "Snímá obraz – video a posílá ho jako vstupní data do počítače",
    options: shuffle(["Snímá obraz (video) a posílá ho jako vstupní data do počítače", "Zobrazuje obraz z internetu", "Přehrává video soubory", "Je to výstupní zařízení"]),
    hints: ["Webkamera → data → počítač = vstupní.", "Monitor → obraz k tobě = výstupní."],
  },
  {
    question: "Co je BIOS/UEFI?",
    correctAnswer: "Firmware, který spouští počítač a kontroluje hardware před načtením OS",
    options: shuffle(["Firmware, který spouští počítač a kontroluje hardware před načtením OS", "Typ operačního systému", "Zálohovací program", "Antivirový software"]),
    hints: ["BIOS/UEFI běží před Windows/macOS.", "Základní vstup/výstupní systém."],
  },
];

const SELECT_L3: PracticeTask[] = [
  {
    question: "Proč je cache paměť v procesoru důležitá?",
    correctAnswer: "Cache je velmi rychlá paměť přímo v CPU — předběžně ukládá data pro okamžitý přístup",
    options: shuffle(["Cache je velmi rychlá paměť přímo v CPU — předběžně ukládá data pro okamžitý přístup", "Cache = stejné jako RAM", "Cache = záloha na pevném disku", "Cache = typ grafické karty"]),
    hints: ["CPU cache L1/L2/L3 = rychlejší než RAM.", "Méně čekání = rychlejší výpočet."],
  },
  {
    question: "Jak se liší integrovaná grafika (iGPU) od dedikované grafiky (dGPU)?",
    correctAnswer: "iGPU = v procesoru, sdílí RAM; dGPU = samostatný čip s vlastní VRAM, výkonnější",
    options: shuffle(["iGPU = v procesoru, sdílí RAM; dGPU = samostatný čip s vlastní VRAM, výkonnější", "Jsou totéž", "iGPU je výkonnější", "dGPU sdílí paměť s RAM"]),
    hints: ["Intel UHD = iGPU.", "NVIDIA GeForce, AMD Radeon = dGPU."],
  },
  {
    question: "Co je northbridge a southbridge na základní desce (historicky)?",
    correctAnswer: "Northbridge = propojoval CPU, RAM, GPU; southbridge = propojoval USB, SATA, PCI",
    options: shuffle(["Northbridge = propojoval CPU, RAM, GPU; southbridge = propojoval USB, SATA, PCI", "Jsou typy RAM", "Jsou typy procesorů", "Jsou typy grafických karet"]),
    hints: ["Dnes jsou integrovány do CPU (PCH).", "Northbridge = rychlá sběrnice, southbridge = pomalá."],
  },
  {
    question: "Co je RAID (Redundant Array of Independent Disks)?",
    correctAnswer: "Technologie spojující více disků pro vyšší výkon nebo zálohu dat",
    options: shuffle(["Technologie spojující více disků pro vyšší výkon nebo zálohu dat", "Typ RAM paměti", "Antivirový systém", "Typ SSD disku"]),
    hints: ["RAID 0 = rychlost, RAID 1 = záloha (mirror).", "Servery a výkonné počítače používají RAID."],
  },
  {
    question: "Co je herní mechanická klávesnice a jak se liší od membránové?",
    correctAnswer: "Mechanická = každá klávesa má vlastní přepínač – přesnost, hmat; membránová = gumová vrstva",
    options: shuffle(["Mechanická = každá klávesa má vlastní přepínač (přesnost, hmat); membránová = gumová vrstva", "Jsou totéž", "Membránová je přesnější", "Mechanická je levnější"]),
    hints: ["Mechanická = klik a hmat při stisku.", "Membránová = tichá, levnější."],
  },
  {
    question: "Co je displejová rozlišení a proč záleží?",
    correctAnswer: "Počet pixelů – šíříka × výška — více pixelů = ostřejší obraz",
    options: shuffle(["Počet pixelů (šíříka × výška) — více pixelů = ostřejší obraz", "Rychlost displeje v Hz", "Velikost displeje v palcích", "Intenzita podsvícení"]),
    hints: ["1920×1080 = Full HD, 3840×2160 = 4K.", "Více pixelů = jemnější, detailnější obraz."],
  },
  {
    question: "Co je frekvence obnovení displeje (refresh rate) a proč je důležitá pro hráče?",
    correctAnswer: "Počet snímků za sekundu, který displej zobrazí – Hz — 144Hz = plynulejší obraz",
    options: shuffle(["Počet snímků za sekundu, který displej zobrazí (Hz) — 144Hz = plynulejší obraz", "Jas displeje", "Rozlišení displeje", "Energetická náročnost displeje"]),
    hints: ["60Hz = standardní, 144Hz/240Hz = herní.", "Více Hz = plynulejší pohyb v hrách."],
  },
  {
    question: "Co je overclocking procesoru?",
    correctAnswer: "Zvyšování frekvence CPU nad výrobní nastavení pro vyšší výkon — zvyšuje teplo",
    options: shuffle(["Zvyšování frekvence CPU nad výrobní nastavení pro vyšší výkon — zvyšuje teplo", "Snižování spotřeby CPU", "Záloha nastavení CPU", "Výrobní nastavení procesoru"]),
    hints: ["Overclocking = přetaktování.", "Více výkonu, ale i více tepla — potřeba lepší chlazení."],
  },
  {
    question: "Co je USB-C oproti USB-A?",
    correctAnswer: "USB-C = nový oboustranný konektor – rychlejší, přenos energie, video; USB-A = starší jednostranný",
    options: shuffle(["USB-C = nový oboustranný konektor (rychlejší, přenos energie, video); USB-A = starší jednostranný", "Jsou totéž, jen jiný tvar", "USB-A je rychlejší", "USB-C je jen pro Apple"]),
    hints: ["USB-C = reversible (nelze zastrčit špatně).", "Thunderbolt 4, USB4 = USB-C formát."],
  },
  {
    question: "Co je TPM (Trusted Platform Module)?",
    correctAnswer: "Bezpečnostní čip pro šifrování dat a ochranu hesel na hardwarové úrovni",
    options: shuffle(["Bezpečnostní čip pro šifrování dat a ochranu hesel na hardwarové úrovni", "Typ grafické karty", "Záložní napájení", "Modem pro internet"]),
    hints: ["Windows 11 vyžaduje TPM 2.0.", "BitLocker disk encryption používá TPM."],
  },
];

function gen(level: number): PracticeTask[] {
  const matchPool = shuffle(MATCH_TASKS).slice(0, 2);
  const selectPool =
    level === 1
      ? shuffle(SELECT_L1).slice(0, 20)
      : level === 2
      ? shuffle(SELECT_L2).slice(0, 20)
      : shuffle(SELECT_L3).slice(0, 20);
  return shuffle([...matchPool, ...selectPool]);
}

export const ZAKLADNICASTIPOCITACEMONITORKLAVESNICEMYS: TopicMetadata[] = [
  {
    id: "g4-informatika-digitalni-technologie-hardware-a-software-zakladni-casti-pocitace-monitor-klavesnice-mys",
    rvpNodeId: "g4-informatika-digitalni-technologie-hardware-a-software-zakladni-casti-pocitace-monitor-klavesnice-mys",
    title: "Základní části počítače - monitor, klávesnice, myš",
    studentTitle: "Části počítače",
    subject: "informatika",
    category: "Digitální technologie",
    topic: "Digitální technologie",
    briefDescription: "Poznáš části počítače — co je hardware a software, vstupní a výstupní zařízení.",
    keywords: ["hardware", "software", "monitor", "klávesnice", "myš", "CPU", "RAM", "HDD", "GPU"],
    goals: [
      "Žák rozliší hardware a software",
      "Žák vyjmenuje vstupní a výstupní zařízení",
      "Žák popíše funkci CPU, RAM a disku",
    ],
    boundaries: ["Žák se nezabývá technickými parametry a architekturou CPU"],
    gradeRange: [4, 4],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Vstupní = data jdou DO počítače (klávesnice, myš). Výstupní = data jdou Z počítače (monitor, tiskárna).",
      steps: [
        "Hardware = fyzické, Software = programy",
        "Vstupní = ovládáš ty (klávesnice, myš, mikrofon)",
        "Výstupní = přijímáš výsledky (monitor, tiskárna, reproduktory)",
      ],
      commonMistake: "Záměna RAM (dočasná) a HDD/SSD (trvalá) paměti.",
      example: "CPU = mozek, RAM = pracovní plocha, HDD = šuplík na soubory, GPU = vizuální procesor.",
    },
  },
];
