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
  { question: "Co udělá zkratka Ctrl+B v textovém editoru?", correctAnswer: "Udělá vybraný text tučný (bold)", options: ["Udělá vybraný text tučný (bold)", "Udělá text kurzívou", "Podtrhne text", "Smaže text"], hints: ["B = bold = tučný."] },
  { question: "Co udělá zkratka Ctrl+I v textovém editoru?", correctAnswer: "Udělá vybraný text kurzívou (italic)", options: ["Udělá vybraný text kurzívou (italic)", "Udělá text tučným", "Podtrhne text", "Vloží obrázek"], hints: ["I = italic = kurzíva."] },
  { question: "Co udělá zkratka Ctrl+U v textovém editoru?", correctAnswer: "Podtrhne vybraný text", options: ["Podtrhne vybraný text", "Udělá text tučným", "Zvýší velikost písma", "Vloží odkaz"], hints: ["U = underline = podtržení."] },
  { question: "Co je zarovnání textu na střed?", correctAnswer: "Text je vycentrovaný uprostřed řádku", options: ["Text je vycentrovaný uprostřed řádku", "Text je zarovnaný k levému okraji", "Text je zarovnaný k pravému okraji", "Text je rozložen na celou šířku"], hints: ["Střed = text je uprostřed."] },
  { question: "Jaký formát souboru uloží dokument z programu Word?", correctAnswer: ".docx", options: [".docx", ".pdf", ".txt", ".jpg"], hints: ["Word ukládá ve formátu .docx."] },
  { question: "Proč uložíme dokument jako PDF pro tisk nebo sdílení?", correctAnswer: "PDF vypadá stejně na každém počítači a tiskárně", options: ["PDF vypadá stejně na každém počítači a tiskárně", "PDF je menší než .docx", "PDF lze snadno upravovat", "PDF je určeno jen pro obrázky"], hints: ["PDF = univerzální formát — vypadá všude stejně."] },
  { question: "Co je nadpis H1 v dokumentu?", correctAnswer: "Největší nadpis — hlavní název dokumentu nebo kapitoly", options: ["Největší nadpis — hlavní název dokumentu nebo kapitoly", "Nejmenší nadpis", "Normální text", "Tučné zvýraznění"], hints: ["H1 = první úroveň = největší nadpis."] },
  { question: "Jak se nazývá program od Googlu pro psaní a úpravu textu online?", correctAnswer: "Google Dokumenty (Google Docs)", options: ["Google Dokumenty (Google Docs)", "Google Tabulky", "Google Formuláře", "Google Foto"], hints: ["Dokumenty = pro text; Tabulky = pro čísla."] },
  { question: "Co je červené podtržení pod slovem v textovém editoru?", correctAnswer: "Pravopisná chyba — editor upozorňuje, že slovo nezná", options: ["Pravopisná chyba — editor upozorňuje, že slovo nezná", "Tučné písmo", "Odkaz na webovou stránku", "Výběr textu"], hints: ["Červené podtržení = pravopisná chyba."] },
  { question: "Co je klávesová zkratka Ctrl+S?", correctAnswer: "Uložení dokumentu", options: ["Uložení dokumentu", "Otevření dokumentu", "Zavření programu", "Tisk dokumentu"], hints: ["S = save = uložit."] },
  { question: "Co znamená zarovnání do bloku (justify)?", correctAnswer: "Text je rovnoměrně roztažen od levého po pravý okraj", options: ["Text je rovnoměrně roztažen od levého po pravý okraj", "Text je zarovnán vlevo", "Text je zarovnán vpravo", "Text je vycentrován uprostřed"], hints: ["Blok = text sahá od okraje k okraji."] },
  { question: "Jaký program je bezplatná alternativa k Microsoft Word?", correctAnswer: "LibreOffice Writer", options: ["LibreOffice Writer", "Adobe Photoshop", "GIMP", "Scratch"], hints: ["LibreOffice = bezplatná kancelářská sada s textovým editorem."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Proč je dobré používat nadpisy (H1, H2, H3) místo tučného textu pro strukturu dokumentu?", correctAnswer: "Nadpisy jsou rozpoznány jako struktura — lze z nich vytvořit obsah a snáze se naviguje", options: ["Nadpisy jsou rozpoznány jako struktura — lze z nich vytvořit obsah a snáze se naviguje", "Nadpisy jsou tučnější než tučný text", "Tučný text a nadpisy jsou totéž", "Nadpisy jsou jen pro titulní stranu"], hints: ["Nadpis = strukturální prvek; tučné = jen vizuální důraz."] },
  { question: "Jak se nazývá kontrola pravopisu v textovém editoru?", correctAnswer: "Pravopisný kontrolor — automaticky označuje chyby", options: ["Pravopisný kontrolor — automaticky označuje chyby", "Formátování textu", "Zarovnání textu", "Řádkování"], hints: ["Kontrola pravopisu = červené podtržení chyb."] },
  { question: "Co je modrá vlnka pod slovem v textovém editoru?", correctAnswer: "Stylová nebo gramatická chyba (ne jen pravopis)", options: ["Stylová nebo gramatická chyba (ne jen pravopis)", "Pravopisná chyba", "Hypertextový odkaz", "Tučné zvýraznění"], hints: ["Modrá vlnka = gramatická nebo stylistická chyba."] },
  { question: "Chci dokument odevzdat učiteli a nechci, aby ho mohl jednoduše upravovat. Jaký formát zvolím?", correctAnswer: "PDF — nelze snadno upravovat, vypadá stejně na každém zařízení", options: ["PDF — nelze snadno upravovat, vypadá stejně na každém zařízení", ".docx — Word formát", ".txt — prostý text", ".odt — LibreOffice formát"], hints: ["PDF = chráněný formát pro sdílení."] },
  { question: "Jaký je rozdíl mezi .docx a .txt formátem?", correctAnswer: ".docx uchovává formátování (tučné, barvy, nadpisy); .txt je prostý text bez formátování", options: [".docx uchovává formátování (tučné, barvy, nadpisy); .txt je prostý text bez formátování", "Jsou totéž", ".txt má více funkcí než .docx", ".docx nelze otevřít ve Wordu"], hints: [".txt = jen znaky; .docx = text + formátování."] },
  { question: "Co je řádkování (mezery mezi řádky) v textovém editoru?", correctAnswer: "Nastavení výšky mezery mezi řádky textu (jednoduché, 1,5, dvojité)", options: ["Nastavení výšky mezery mezi řádky textu (jednoduché, 1,5, dvojité)", "Velikost písma", "Zarovnání textu", "Tučnost písma"], hints: ["Řádkování = mezera mezi řádky textu."] },
  { question: "Co udělá Ctrl+Z v textovém editoru?", correctAnswer: "Vrátí zpět poslední akci (Undo)", options: ["Vrátí zpět poslední akci (Undo)", "Uloží dokument", "Znovu provede akci (Redo)", "Zavře dokument"], hints: ["Z = Undo = vrátit zpět."] },
  { question: "Co udělá Ctrl+Y v textovém editoru?", correctAnswer: "Znovu provede vrácenou akci (Redo)", options: ["Znovu provede vrácenou akci (Redo)", "Vrátí zpět akci (Undo)", "Uloží dokument", "Označí text"], hints: ["Y = Redo = znovu provést."] },
  { question: "Jak se nazývá nastavení okrajů (mezery od okraje stránky) dokumentu?", correctAnswer: "Okraje stránky (margins)", options: ["Okraje stránky (margins)", "Řádkování", "Zarovnání textu", "Písmo"], hints: ["Okraje = bílé prostory kolem textu na stránce."] },
  { question: "Co je hlavička (záhlaví) dokumentu?", correctAnswer: "Oblast v horní části každé stránky — obvykle název dokumentu nebo číslo stránky", options: ["Oblast v horní části každé stránky — obvykle název dokumentu nebo číslo stránky", "Nadpis H1", "Tučný text", "Název souboru"], hints: ["Záhlaví = opakující se text v horní části každé stránky."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč je výhodné používat Google Dokumenty místo Microsoft Word v týmu?", correctAnswer: "Google Dokumenty umožňuje spolupráci více lidí současně online — všichni vidí změny v reálném čase", options: ["Google Dokumenty umožňuje spolupráci více lidí současně online — všichni vidí změny v reálném čase", "Word neumožňuje ukládání", "Google Dokumenty mají více funkcí", "Word nelze sdílet"], hints: ["Spolupráce online = Google Docs."] },
  { question: "Co je automatický obsah v textovém editoru?", correctAnswer: "Obsah generovaný z nadpisů (H1, H2, H3) — aktualizuje se automaticky", options: ["Obsah generovaný z nadpisů (H1, H2, H3) — aktualizuje se automaticky", "Ručně psaný seznam kapitol", "Tabulka na konci dokumentu", "Zápatí stránky"], hints: ["Automatický obsah = vytvořen z nadpisů, aktualizovatelný."] },
  { question: "Co je sledování změn (Track Changes) v dokumentu?", correctAnswer: "Funkce, která zobrazuje, co bylo přidáno nebo odstraněno — užitečné při korekturách", options: ["Funkce, která zobrazuje, co bylo přidáno nebo odstraněno — užitečné při korekturách", "Automatické ukládání dokumentu", "Kontrola pravopisu", "Automatický obsah"], hints: ["Sledování změn = vidím, co kdo změnil."] },
  { question: "Proč je dobré dokument pravidelně ukládat (Ctrl+S) během práce?", correctAnswer: "Pokud počítač spadne nebo vypne, nepřijdu o neuložené změny", options: ["Pokud počítač spadne nebo vypne, nepřijdu o neuložené změny", "Ukládání zlepší pravopis", "Ukládání změní formátování", "Je to povinné ze zákona"], hints: ["Ctrl+S = záchrana práce před neočekávaným výpadkem."] },
  { question: "Jaký je rozdíl mezi Vložit (Paste) a Vložit jinak (Paste Special)?", correctAnswer: "Paste vloží obsah i formátování; Paste Special umožní vložit jen text bez formátování", options: ["Paste vloží obsah i formátování; Paste Special umožní vložit jen text bez formátování", "Jsou totéž", "Paste Special vloží jako obrázek", "Paste vloží jen formátování"], hints: ["Paste Special = vložit bez formátování původního zdroje."] },
  { question: "Proč by nadpisy v dokumentu měly být hierarchické (H1 → H2 → H3)?", correctAnswer: "Hierarchie pomáhá čtenáři orientovat se — je jasné, co je hlavní a co podřízené", options: ["Hierarchie pomáhá čtenáři orientovat se — je jasné, co je hlavní a co podřízené", "Hierarchie je jen estetická volba", "H1 a H3 jsou totéž", "Pořadí H1/H2/H3 nezáleží"], hints: ["H1 = hlavní; H2 = podkapitola; H3 = podpodkapitola."] },
  { question: "Chci v dokumentu vyhledat slovo 'pes' a nahradit ho 'kočka'. Jakou funkci použiji?", correctAnswer: "Najít a nahradit (Ctrl+H)", options: ["Najít a nahradit (Ctrl+H)", "Pravopisný kontrolor", "Automatický obsah", "Záhlaví a zápatí"], hints: ["Ctrl+H = Find & Replace = najít a nahradit."] },
  { question: "Co je zápatí (footer) dokumentu?", correctAnswer: "Oblast v dolní části každé stránky — obvykle číslo stránky nebo jméno autora", options: ["Oblast v dolní části každé stránky — obvykle číslo stránky nebo jméno autora", "Poslední odstavec dokumentu", "Nadpis H3", "Poznámka pod čarou"], hints: ["Zápatí = opakující se text v dolní části každé stránky."] },
  { question: "Co je formát .odt?", correctAnswer: "Otevřený formát textového dokumentu — používá LibreOffice Writer (alternativa k .docx)", options: ["Otevřený formát textového dokumentu — používá LibreOffice Writer (alternativa k .docx)", "Formát pro obrázky", "Formát tabulkového procesoru", "PDF dokument"], hints: [".odt = LibreOffice Writer; .docx = Microsoft Word."] },
  { question: "Proč je dobré mít v dokumentu obsah (Table of Contents)?", correctAnswer: "Čtenář může rychle přejít na konkrétní kapitolu bez čtení celého dokumentu", options: ["Čtenář může rychle přejít na konkrétní kapitolu bez čtení celého dokumentu", "Obsah vyplňuje stránky automaticky", "Obsah zlepšuje pravopis", "Obsah je povinný zákon"], hints: ["Obsah = rychlá navigace v delším dokumentu."] },
  { question: "Ctrl+A v textovém editoru vybere...", correctAnswer: "Veškerý text v dokumentu", options: ["Veškerý text v dokumentu", "Jen aktuální odstavec", "Jen nadpisy", "Jen tučný text"], hints: ["A = All = vybrat vše."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const TVORBAAUPRAVATEXTUFORMATOVANI: TopicMetadata[] = [
  {
    id: "g5-informatika-digitalni-technologie-prace-s-textem-a-obrazem-tvorba-a-uprava-textu-formatovani",
    rvpNodeId: "g5-informatika-digitalni-technologie-prace-s-textem-a-obrazem-tvorba-a-uprava-textu-formatovani",
    title: "Tvorba a úprava textu, formátování",
    studentTitle: "Práce s textem",
    subject: "informatika",
    category: "Digitální technologie",
    topic: "Práce s textem a obrazem",
    briefDescription: "Naučíš se formátovat a upravovat text na počítači.",
    keywords: ["Word", "Google Docs", "LibreOffice", "formátování", "tučné", "kurzíva", "nadpis", "PDF", "docx"],
    goals: [
      "Použije základní formátování textu (tučné, kurzíva, nadpisy).",
      "Uloží dokument v správném formátu (.docx, PDF).",
      "Zná klávesové zkratky pro práci s textem.",
    ],
    boundaries: ["Pokročilé makra ve Wordu", "Šablony a styly dokumentů", "DTP (Desktop Publishing)"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Ctrl+B = tučné. Ctrl+I = kurzíva. Ctrl+U = podtržení. Ctrl+S = uložit. PDF = pro sdílení; .docx = pro úpravy. Nadpisy H1/H2/H3 = struktura.",
      steps: [
        "Napíši text v textovém editoru.",
        "Označím část textu a použiji formátování (tučné, kurzíva, nadpis).",
        "Zkontroluju pravopis (červené podtržení = chyba).",
        "Uložím jako .docx pro úpravy nebo PDF pro sdílení.",
      ],
      commonMistake: "Tučný text místo nadpisu H1 — tučný text vypadá podobně, ale nadpis vytváří strukturu dokumentu.",
      example: "Ctrl+B = tučné. Ctrl+S = uložit. PDF pro odevzdání úkolu. .docx pro společnou práci.",
    },
  },
];
