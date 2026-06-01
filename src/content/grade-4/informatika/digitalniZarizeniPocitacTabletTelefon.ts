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
    question: "Spoj digitální zařízení s jejich hlavní vlastností:",
    correctAnswer: "Desktop počítač-Nejvýkonnější, pevné místo, bez baterie|Notebook-Přenosný, vše integrované, baterie|Tablet-Velká dotyková obrazovka, přenosný|Smartphone-Kapesní, kamera, GPS, dotyková obrazovka",
    pairs: [
      { left: "Desktop počítač", right: "Nejvýkonnější, pevné místo, bez baterie" },
      { left: "Notebook", right: "Přenosný, vše integrované, baterie" },
      { left: "Tablet", right: "Velká dotyková obrazovka, přenosný" },
      { left: "Smartphone", right: "Kapesní, kamera, GPS, dotyková obrazovka" },
    ],
    hints: ["Desktop = stůl, pevné místo.", "Tablet je větší než telefon, ale menší než notebook."],
  },
  {
    question: "Spoj zařízení se způsobem jeho hlavního použití:",
    correctAnswer: "Herní konzole-PS5, Xbox, Nintendo Switch pro hry|E-čtečka – Kindle-Čtení knih, e-Ink displej|Chytré hodinky-Health monitoring, notifikace, nositelná elektronika|Desktop PC-Náročná práce, programování, střih videa",
    pairs: [
      { left: "Herní konzole", right: "PS5, Xbox, Nintendo Switch pro hry" },
      { left: "E-čtečka (Kindle)", right: "Čtení knih, e-Ink displej" },
      { left: "Chytré hodinky", right: "Health monitoring, notifikace, nositelná elektronika" },
      { left: "Desktop PC", right: "Náročná práce, programování, střih videa" },
    ],
    hints: ["PS5 a Xbox = herní konzole.", "Kindle = čtečka e-knih od Amazonu."],
  },
];

const SELECT_L1: PracticeTask[] = [
  {
    question: "Co je desktop počítač?",
    correctAnswer: "Výkonný stolní počítač s oddělnými částmi – skříň PC, monitor, klávesnice, myš",
    options: shuffle(["Výkonný stolní počítač s oddělnými částmi (skříň PC, monitor, klávesnice, myš)", "Přenosný počítač s baterií", "Velký tablet", "Herní konzole"]),
    hints: ["Desktop = stojí na stole, nepřenosný.", "Oddělené části: skříň PC + monitor + klávesnice + myš."],
  },
  {
    question: "Co je notebook (laptop)?",
    correctAnswer: "Přenosný počítač s baterií a integrovaným displejem",
    options: shuffle(["Přenosný počítač s baterií a integrovaným displejem", "Stolní počítač", "Velký tablet", "Chytré hodinky"]),
    hints: ["Notebook = přenosný, vše v jednom.", "Baterie 4-12 hodin."],
  },
  {
    question: "Co je tablet?",
    correctAnswer: "Přenosné zařízení s velkou dotykovou obrazovkou bez fyzické klávesnice",
    options: shuffle(["Přenosné zařízení s velkou dotykovou obrazovkou bez fyzické klávesnice", "Malý smartphone", "Přenosný počítač s klávesnicí", "Herní konzole"]),
    hints: ["Tablet = velká dotyková obrazovka.", "Ovládání prsty místo myši."],
  },
  {
    question: "Co je smartphone?",
    correctAnswer: "Kapesní telefon s dotykovou obrazovkou, kamerou a přístupem k internetu",
    options: shuffle(["Kapesní telefon s dotykovou obrazovkou, kamerou a přístupem k internetu", "Stolní počítač", "Herní konzole", "E-čtečka"]),
    hints: ["Smartphone = chytrý telefon.", "Kamera, GPS, internet v kapse."],
  },
  {
    question: "Která zařízení jsou příklady herních konzolí?",
    correctAnswer: "PlayStation 5 – PS5, Xbox, Nintendo Switch",
    options: shuffle(["PlayStation 5 (PS5), Xbox, Nintendo Switch", "iPad, Samsung Galaxy Tab", "MacBook, Dell Notebook", "Kindle, Kobo"]),
    hints: ["Herní konzole = speciální hardware pro hry.", "PS5 = PlayStation 5, Xbox = Microsoft."],
  },
  {
    question: "Co jsou chytré hodinky?",
    correctAnswer: "Nositelná elektronika na zápěstí s funkcemi health monitoringu a notifikací",
    options: shuffle(["Nositelná elektronika na zápěstí s funkcemi health monitoringu a notifikací", "Speciální typ tabletu", "Přenosný reproduktor", "Klávesnice s displejem"]),
    hints: ["Chytré hodinky = wearable technology.", "Apple Watch, Samsung Galaxy Watch."],
  },
  {
    question: "Co je e-čtečka (Kindle)?",
    correctAnswer: "Zařízení pro čtení e-knih s e-Ink displejem podobným papíru",
    options: shuffle(["Zařízení pro čtení e-knih s e-Ink displejem podobným papíru", "Tablet s velkým displejem", "Chytré hodinky pro čtení", "Specializovaný notebook"]),
    hints: ["Kindle = e-čtečka od Amazonu.", "e-Ink = displej jako tisk na papíru, nesvítí přímo do očí."],
  },
  {
    question: "Jakou výhodu má desktop počítač oproti notebooku?",
    correctAnswer: "Vyšší výkon za nižší cenu, snazší oprava a upgrade komponent",
    options: shuffle(["Vyšší výkon za nižší cenu, snazší oprava a upgrade komponent", "Přenosnost", "Delší výdrž baterie", "Dotykový displej"]),
    hints: ["Desktop = větší prostor = výkonnější hardware.", "Notebook platíš příplatek za přenosnost."],
  },
  {
    question: "Pro co je vhodný tablet?",
    correctAnswer: "Konzumace obsahu – videa, knihy, online výuka, kreslení",
    options: shuffle(["Konzumace obsahu (videa, knihy), online výuka, kreslení", "Náročné programování", "Hraní výkonných her", "Přesné CAD projekty"]),
    hints: ["Tablet = prohlížení, čtení, jednoduché úkoly.", "Programování a profesionální práce = PC/notebook."],
  },
  {
    question: "Jaká je výhoda smartphonu oproti stolnímu telefonu?",
    correctAnswer: "Přenosnost, kamera, GPS, internet kdekoli",
    options: shuffle(["Přenosnost, kamera, GPS, internet kdekoli", "Větší výpočetní výkon", "Větší displej", "Levnější hovory"]),
    hints: ["Smartphone = počítač + telefon + kamera + GPS v kapse.", "Pevný telefon nemá GPS ani internet."],
  },
  {
    question: "Jaká je výhoda notebooku oproti desktopu?",
    correctAnswer: "Přenosnost — lze ho brát všude s sebou",
    options: shuffle(["Přenosnost — lze ho brát všude s sebou", "Vyšší výkon za nižší cenu", "Snazší upgrade RAM a procesoru", "Větší monitor"]),
    hints: ["Notebook = přenosný = klíčová výhoda.", "Desktop je pevně na místě."],
  },
  {
    question: "Jak se připojuje přídavná klávesnice k tabletu?",
    correctAnswer: "Přes Bluetooth – bezdrátově nebo speciální konektor",
    options: shuffle(["Přes Bluetooth (bezdrátově) nebo speciální konektor", "Přes USB-A port", "Přes HDMI", "Přes WiFi"]),
    hints: ["Tablety nemají USB-A, ale mají Bluetooth.", "Speciální konektor = nasazovací klávesnice (např. iPad Magic Keyboard)."],
  },
];

const SELECT_L2: PracticeTask[] = [
  {
    question: "Pro koho je desktop počítač nejlepší volbou?",
    correctAnswer: "Pro uživatele pracující na pevném místě s náročnými úkoly – střih videa, programování",
    options: shuffle(["Pro uživatele pracující na pevném místě s náročnými úkoly (střih videa, programování)", "Pro studenty cestující do školy", "Pro krátkodobé použití na cestách", "Pro čtení knih"]),
    hints: ["Desktop = výkon + pevné místo.", "Střih 4K videa = potřeba výkonu = desktop."],
  },
  {
    question: "Co je e-Ink displej u e-čteček?",
    correctAnswer: "Technologie displeje podobná tištěnému papíru — nezáří přímo, šetří oči",
    options: shuffle(["Technologie displeje podobná tištěnému papíru — nezáří přímo, šetří oči", "OLED displej s vyšší svítivostí", "Dotykový displej pro kreslení", "Typ LED displeje v noteboocích"]),
    hints: ["e-Ink = elektrický inkoust.", "e-Ink odráží světlo jako papír — nefatigue oči."],
  },
  {
    question: "Jaký je rozdíl mezi herní konzolí a PC co se týče her?",
    correctAnswer: "Konzole = uzavřená platforma speciálně pro hry; PC = otevřený systém pro hry i práci",
    options: shuffle(["Konzole = uzavřená platforma speciálně pro hry; PC = otevřený systém pro hry i práci", "Jsou totéž", "PC je vždy výkonnější", "Konzole má více her"]),
    hints: ["PS5 hraje jen PS hry; PC hraje Steam, Epic, atd.", "Konzole = jednoduché, PC = flexibilní."],
  },
  {
    question: "Co je nositelná elektronika (wearables)?",
    correctAnswer: "Zařízení noselná na těle – hodinky, fitness náramky, chytré brýle",
    options: shuffle(["Zařízení noselná na těle (hodinky, fitness náramky, chytré brýle)", "Přenosné reproduktory", "Tablet v pouzdru", "Miniaturní notebook"]),
    hints: ["Wearables = nositelné technologie.", "Apple Watch, Fitbit, Google Glass."],
  },
  {
    question: "Proč má notebook kratší výdrž baterie při hraní her oproti kancelářské práci?",
    correctAnswer: "Hry využívají CPU a GPU na plný výkon — spotřeba energie je mnohem vyšší",
    options: shuffle(["Hry využívají CPU a GPU na plný výkon — spotřeba energie je mnohem vyšší", "Hry poškozují baterii", "Kancelářská práce nepotřebuje CPU", "Baterie se prohřívá u her"]),
    hints: ["Vyšší výkon = vyšší spotřeba energie.", "Kancelářská práce = nízká zátěž CPU/GPU."],
  },
  {
    question: "Proč je Nintendo Switch unikátní herní konzole?",
    correctAnswer: "Lze ji použít doma na TV i přenosně jako handheld konzoli",
    options: shuffle(["Lze ji použít doma na TV i přenosně jako handheld konzoli", "Je to mobilní telefon s ovladačem", "Má výkonnější hardware než PS5", "Hraje pouze Nintendo hry v cloudu"]),
    hints: ["Switch = přepínání (doma/přenosně).", "Odepni ovladače Joy-Con a ber konzoli s sebou."],
  },
  {
    question: "Co je operační systém chytrého telefonu?",
    correctAnswer: "Software, který řídí telefon — nejčastěji Android – Google nebo iOS – Apple",
    options: shuffle(["Software, který řídí telefon — nejčastěji Android (Google) nebo iOS (Apple)", "Sim karta", "Aplikační obchod", "Mobilní síť"]),
    hints: ["Android = Samsung, Xiaomi, atd.", "iOS = Apple iPhone."],
  },
  {
    question: "Jaké zařízení by sis vybral/a pro čtení knih na dovolené u moře?",
    correctAnswer: "E-čtečku – Kindle — nezáří, vydrží na slunci, baterie 4-6 týdnů",
    options: shuffle(["E-čtečku (Kindle) — nezáří, vydrží na slunci, baterie 4-6 týdnů", "Notebook", "Desktop počítač", "Herní konzoli"]),
    hints: ["Na slunci = e-Ink se čte lépe než klasický displej.", "Baterie e-čtečky vydrží týdny."],
  },
  {
    question: "Co je 2-v-1 notebook (convertible)?",
    correctAnswer: "Notebook, jehož displej lze otočit nebo odepnout — funguje i jako tablet",
    options: shuffle(["Notebook, jehož displej lze otočit nebo odepnout — funguje i jako tablet", "Notebook s 2 procesory", "Notebook pro 2 uživatele", "Notebook s 2 bateriemi"]),
    hints: ["2-v-1 = notebook + tablet v jednom.", "Microsoft Surface Pro je příklad."],
  },
  {
    question: "Jaké zařízení je vhodné pro dítě na online výuku doma?",
    correctAnswer: "Notebook nebo tablet — přenosné, s kamerou pro videohovory",
    options: shuffle(["Notebook nebo tablet — přenosné, s kamerou pro videohovory", "Desktop PC v obýváku", "Herní konzole", "E-čtečka"]),
    hints: ["Online výuka = internet, kamera, mikrofon.", "Notebook = přenosnost + plný výkon."],
  },
];

const SELECT_L3: PracticeTask[] = [
  {
    question: "Proč jsou herní konzole stále populární, i když PC hry existují?",
    correctAnswer: "Konzole jsou levnější, jednoduší na použití, exkluzivní hry a lze hrát na TV",
    options: shuffle(["Konzole jsou levnější, jednoduší na použití, exkluzivní hry a lze hrát na TV", "Konzole jsou výkonnější než PC", "Konzole mají lepší grafiku", "PC neumí hrát hry online"]),
    hints: ["PlayStation exkluzivní hry nelze hrát na PC.", "Konzole = plug and play, bez instalace driverů."],
  },
  {
    question: "Jak se liší ARM procesory (v telefonech) od x86 (v desktopech)?",
    correctAnswer: "ARM = nízká spotřeba energie, mobilní zařízení; x86 = vysoký výkon, PC",
    options: shuffle(["ARM = nízká spotřeba energie, mobilní zařízení; x86 = vysoký výkon, PC", "Jsou totéž", "ARM je výkonnější", "x86 se používá v telefonech"]),
    hints: ["Telefon = ARM čip (Qualcomm Snapdragon, Apple A-série).", "PC = Intel/AMD = x86 architektura."],
  },
  {
    question: "Proč mají tablety obecně méně výkonu než notebooky stejné ceny?",
    correctAnswer: "Tablety používají mobilní ARM čipy optimalizované pro výdrž, ne výkon",
    options: shuffle(["Tablety používají mobilní ARM čipy optimalizované pro výdrž, ne výkon", "Tablety jsou starší technologie", "Tablety nemají operační systém", "Výrobci záměrně omezují výkon"]),
    hints: ["ARM = baterie, x86 = výkon.", "Tablet = mobilní čip, notebook = desktopový/mobilní x86."],
  },
  {
    question: "Co je cloud gaming a jak mění potřebu výkonného hardware?",
    correctAnswer: "Hry běží na serverech v cloudu — stačí slabý tablet nebo TV s internetem",
    options: shuffle(["Hry běží na serverech v cloudu — stačí slabý tablet nebo TV s internetem", "Cloud gaming = ukládání her v cloudu", "Cloud gaming = streaming filmů", "Vyžaduje výkonný GPU lokálně"]),
    hints: ["GeForce NOW, Xbox Cloud Gaming = cloud gaming.", "Výpočet probíhá v datovém centru, ty jen streamuješ."],
  },
  {
    question: "Proč je Apple Silicon (M-série) v MacBookách tak efektivní?",
    correctAnswer: "Integruje CPU, GPU, RAM na jednom čipu – System on Chip — výkon s nízkou spotřebou",
    options: shuffle(["Integruje CPU, GPU, RAM na jednom čipu (System on Chip) — výkon s nízkou spotřebou", "Používá nejnovější Intel procesor", "Má speciální Apple operační systém", "Větší baterie než ostatní notebooky"]),
    hints: ["SoC = vše na jednom čipu.", "M1/M2/M3 = Apple Silicon = ARM architektura."],
  },
  {
    question: "Co je IoT (Internet of Things) a jak rozšiřuje pojem 'digitální zařízení'?",
    correctAnswer: "IoT = připojené věci – televize, lednice, žárovky s čipy a internetem",
    options: shuffle(["IoT = připojené věci (televize, lednice, žárovky) s čipy a internetem", "IoT = jen chytré telefony", "IoT = pouze počítačové servery", "IoT = typ mobilní sítě"]),
    hints: ["IoT = smart home zařízení.", "Chytrá lednice, termostat, žárovka = IoT."],
  },
  {
    question: "Proč je e-Ink displej šetrnější pro čtení než OLED/LCD?",
    correctAnswer: "e-Ink odráží světlo jako papír — nezáří přímým světlem do očí, méně únavy",
    options: shuffle(["e-Ink odráží světlo jako papír — nezáří přímým světlem do očí, méně únavy", "e-Ink má vyšší jas", "e-Ink zobrazuje více barev", "e-Ink spotřebuje méně CPU"]),
    hints: ["OLED/LCD = vlastní světelný zdroj.", "e-Ink = pasivní displej, odráží světlo okolí."],
  },
  {
    question: "Proč se procesory v mobilních zařízeních nazývají SoC (System on Chip)?",
    correctAnswer: "CPU, GPU, RAM, modem jsou na jednom čipu — úspora místa a energie",
    options: shuffle(["CPU, GPU, RAM, modem jsou na jednom čipu — úspora místa a energie", "SoC = speciální čip pro sociální sítě", "SoC = záložní baterie", "SoC = typ displeje"]),
    hints: ["V telefonu není místo na velkou základní desku.", "SoC = vše v jednom malém čipu."],
  },
  {
    question: "Jak ovlivnila smartphony vývoj tabletu?",
    correctAnswer: "Smartphony ukázaly poptávku po dotykových zařízeních — tablet je větší verze s jiným zaměřením",
    options: shuffle(["Smartphony ukázaly poptávku po dotykových zařízeních — tablet je větší verze s jiným zaměřením", "Tablet předcházel smartphonu", "Tablet nahradil smartphone", "Smartphony a tablety nemají nic společného"]),
    hints: ["iPhone (2007) → iPad (2010).", "Dotyková plocha, app store — stejné koncepty v jiném formátu."],
  },
  {
    question: "Proč jsou herní konzole stále ztrátové při prodeji (prodávány pod cenou výroby)?",
    correctAnswer: "Výrobci vydělávají na hrách a předplatném, ne na hardwaru",
    options: shuffle(["Výrobci vydělávají na hrách a předplatném, ne na hardwaru", "Konzole jsou levné na výrobu", "Jen PS5 je ztrátová, Xbox ne", "Výrobci dotují konzole státem"]),
    hints: ["Razor and blades model = levná holička, drahé čepele.", "Sony/Microsoft = konzole levně, hry draze."],
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

export const DIGITALNIZARIZENIPOCITACTABLETTELEFON: TopicMetadata[] = [
  {
    id: "g4-informatika-digitalni-technologie-hardware-a-software-digitalni-zarizeni-pocitac-tablet-telefon",
    rvpNodeId: "g4-informatika-digitalni-technologie-hardware-a-software-digitalni-zarizeni-pocitac-tablet-telefon",
    title: "Digitální zařízení - počítač, tablet, telefon",
    studentTitle: "Druhy zařízení",
    subject: "informatika",
    category: "Digitální technologie",
    topic: "Digitální technologie",
    briefDescription: "Poznáš různé druhy digitálních zařízení a naučíš se, pro co jsou vhodná.",
    keywords: ["počítač", "tablet", "telefon", "notebook", "konzole", "e-čtečka", "chytré hodinky"],
    goals: [
      "Žák pojmenuje a popíše základní druhy digitálních zařízení",
      "Žák rozliší desktop, notebook, tablet a smartphone",
      "Žák vysvětlí, pro jaký účel je které zařízení vhodné",
    ],
    boundaries: ["Žák se nezabývá technickými parametry procesorů a GPU"],
    gradeRange: [4, 4],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Desktop = stůl, výkon. Notebook = přenosný. Tablet = dotyková obrazovka. Smartphone = kapesní počítač+telefon.",
      steps: [
        "Je zařízení přenosné nebo pevné?",
        "Má fyzickou klávesnici nebo jen dotykový displej?",
        "Pro jaký hlavní účel se používá?",
      ],
      commonMistake: "Záměna tabletu a notebooku — tablet nemá fyzickou klávesnici.",
      example: "iPad = tablet (dotyková obrazovka). MacBook = notebook (klávesnice + trackpad).",
    },
  },
];
