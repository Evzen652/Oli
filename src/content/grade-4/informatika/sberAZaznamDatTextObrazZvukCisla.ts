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
    question: "Jaký typ dat jsou slova, věty a texty?",
    correctAnswer: "Textová data",
    options: shuffle(["Textová data", "Číselná data", "Obrazová data", "Zvuková data"]),
    hints: ["Text = písmena a slova.", "Esej, kniha, e-mail jsou textová data."],
  },
  {
    question: "Jaký typ dat jsou fotografie a obrázky?",
    correctAnswer: "Obrazová data",
    options: shuffle(["Obrazová data", "Textová data", "Číselná data", "Zvuková data"]),
    hints: ["Obraz = co vidíš na obrazovce.", "Fotografie je obrazové datum."],
  },
  {
    question: "Jaký typ dat je hudba a nahrávky hlasu?",
    correctAnswer: "Zvuková data",
    options: shuffle(["Zvuková data", "Textová data", "Číselná data", "Obrazová data"]),
    hints: ["Zvuk = slyšíš ho.", "Hudba, podcasty, audioknihsy = zvuková data."],
  },
  {
    question: "Jaký typ dat jsou výsledky měření, statistiky a počty?",
    correctAnswer: "Číselná data",
    options: shuffle(["Číselná data", "Textová data", "Obrazová data", "Zvuková data"]),
    hints: ["Čísla = výsledky měření.", "Teplota, výška, počet studentů = číselná data."],
  },
  {
    question: "Jakou příponu (formát) mají fotografie nejčastěji?",
    correctAnswer: ".jpg",
    options: shuffle([".jpg", ".mp3", ".docx", ".txt"]),
    hints: [".jpg = formát pro fotografie.", "Fotoaparáty ukládají fotky jako .jpg."],
  },
  {
    question: "Jaký formát se používá pro textové dokumenty ve Wordu?",
    correctAnswer: ".docx",
    options: shuffle([".docx", ".jpg", ".mp3", ".mp4"]),
    hints: ["Word = Microsoft Word, ukládá .docx.", ".docx = Word dokument."],
  },
  {
    question: "Jaký formát se používá pro hudbu a zvuk?",
    correctAnswer: ".mp3",
    options: shuffle([".mp3", ".jpg", ".docx", ".gif"]),
    hints: [".mp3 = komprimovaný zvukový soubor.", "Hudba se nejčastěji stahuje jako .mp3."],
  },
  {
    question: "Jaký formát se používá pro videa?",
    correctAnswer: ".mp4",
    options: shuffle([".mp4", ".jpg", ".docx", ".mp3"]),
    hints: [".mp4 = formát pro video.", "YouTube videa jsou běžně ve formátu .mp4."],
  },
  {
    question: "Co je USB flash disk?",
    correctAnswer: "Přenosné paměťové zařízení pro uložení dat",
    options: shuffle(["Přenosné paměťové zařízení pro uložení dat", "Způsob přenosu zvuku", "Program pro editaci textu", "Typ monitoru"]),
    hints: ["USB flash disk = 'flešku' zastrčíš do USB portu.", "Na něm uchováváš soubory a přenášíš je."],
  },
  {
    question: "Co je cloud (cloudové úložiště)?",
    correctAnswer: "Ukládání dat na serverech přes internet",
    options: shuffle(["Ukládání dat na serverech přes internet", "Lokální disk v počítači", "Záloha na USB", "Typ sítě WiFi"]),
    hints: ["Cloud = 'v oblaku', na internetu.", "Google Drive, OneDrive, iCloud jsou cloudová úložiště."],
  },
  {
    question: "Co je dotazník jako způsob sběru dat?",
    correctAnswer: "Formulář s otázkami, jehož vyplněním se získávají odpovědi",
    options: shuffle(["Formulář s otázkami, jehož vyplněním se získávají odpovědi", "Program pro zpracování dat", "Grafický nástroj", "Způsob ukládání zvuku"]),
    hints: ["Dotazník = sada otázek pro respondenty.", "Průzkum ve škole = dotazník."],
  },
  {
    question: "Jaký formát obrázku podporuje průhledné pozadí?",
    correctAnswer: ".png",
    options: shuffle([".png", ".jpg", ".mp4", ".mp3"]),
    hints: [".png = průhledné pozadí (alfa kanál).", "Loga na webech jsou často .png."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co je HDD (Hard Disk Drive)?",
    correctAnswer: "Pevný disk s magnetickými plotnami pro trvalé uložení dat",
    options: shuffle(["Pevný disk s magnetickými plotnami pro trvalé uložení dat", "Přenosný USB disk", "Cloudové úložiště", "RAM paměť"]),
    hints: ["HDD = tradiční pevný disk s otáčejícími se plotnami.", "HDD je pomalejší než SSD."],
  },
  {
    question: "Co je SSD (Solid State Drive)?",
    correctAnswer: "Rychlý pevný disk bez pohyblivých částí (flash paměť)",
    options: shuffle(["Rychlý pevný disk bez pohyblivých částí (flash paměť)", "Magnetický disk", "Cloudové úložiště", "RAM paměť"]),
    hints: ["SSD = flash paměť jako v USB disku.", "SSD je rychlejší než HDD."],
  },
  {
    question: "Proč je .gif formát oblíbený na internetu?",
    correctAnswer: "Podporuje jednoduché animace (krátká smyčka obrázků)",
    options: shuffle(["Podporuje jednoduché animace (krátká smyčka obrázků)", "Má nejlepší kvalitu pro fotografie", "Je nejmenší soubor", "Obsahuje zvuk"]),
    hints: [".gif = animovaný obrázek.", "Vtipné animované obrázky na internetu jsou .gif."],
  },
  {
    question: "Jaký je rozdíl mezi .jpg a .png?",
    correctAnswer: ".jpg nemá průhledné pozadí, .png průhledné pozadí má",
    options: shuffle([".jpg nemá průhledné pozadí, .png průhledné pozadí má", ".jpg je lepší pro logotypy", ".png je vždy menší než .jpg", "Jsou totéž"]),
    hints: [".jpg = fotografie (ztráta kvality při kompresi).", ".png = průhledné pozadí, lepší pro grafy."],
  },
  {
    question: "Proč se data v tabulkovém programu (Excel) ukládají jako .xlsx?",
    correctAnswer: ".xlsx je formát tabulkového procesoru Microsoft Excel",
    options: shuffle([".xlsx je formát tabulkového procesoru Microsoft Excel", ".xlsx je formát pro dokumenty Word", ".xlsx je formát pro obrázky", ".xlsx je formát pro video"]),
    hints: ["Excel = tabulky s daty a výpočty.", ".xlsx = Excel workbook."],
  },
  {
    question: "Co je anketa jako způsob sběru dat?",
    correctAnswer: "Krátký průzkum s 1-2 otázkami pro rychlé zjištění názoru",
    options: shuffle(["Krátký průzkum s 1-2 otázkami pro rychlé zjištění názoru", "Podrobný dotazník s 50 otázkami", "Statistický výpočet", "Způsob ukládání dat"]),
    hints: ["Anketa = rychlé zjištění (hlasování).", "Ankety jsou kratší než dotazníky."],
  },
  {
    question: "Co je .wav soubor?",
    correctAnswer: "Nekomprimovaný zvukový formát s vyšší kvalitou než .mp3",
    options: shuffle(["Nekomprimovaný zvukový formát s vyšší kvalitou než .mp3", "Formát pro video", "Formát pro obrázky", "Formát pro textové dokumenty"]),
    hints: [".wav = bezztrátový zvuk.", "Větší soubor, ale lepší kvalita než .mp3."],
  },
  {
    question: "Proč je při sběru dat důležité zaznamenávat data do tabulky?",
    correctAnswer: "Tabulka umožňuje přehledné uložení a pozdější analýzu dat",
    options: shuffle(["Tabulka umožňuje přehledné uložení a pozdější analýzu dat", "Tabulka zmenšuje objem dat", "Tabulka šifruje data", "Tabulka přenáší data rychleji"]),
    hints: ["Tabulka = strukturovaný přehled.", "Záznamy v tabulce jsou snadno zpracovatelné."],
  },
  {
    question: "Jaký formát se používá pro dokumenty k přečtení (bez editace)?",
    correctAnswer: ".pdf",
    options: shuffle([".pdf", ".docx", ".xlsx", ".pptx"]),
    hints: [".pdf = Portable Document Format.", "PDF nelze snadno editovat, ale vypadá stejně na každém zařízení."],
  },
  {
    question: "Co je měření jako způsob sběru dat?",
    correctAnswer: "Zaznamenání hodnoty pomocí přístroje (teploměr, váha, pravítko)",
    options: shuffle(["Zaznamenání hodnoty pomocí přístroje (teploměr, váha, pravítko)", "Dotazník s otázkami", "Vizuální pozorování bez záznamu", "Fotografování objektů"]),
    hints: ["Měření = přesná číselná hodnota.", "Teplota 36,8°C je výsledek měření."],
  },
  {
    question: "Co je CD/DVD jako úložiště?",
    correctAnswer: "Optický disk pro ukládání dat (dnes méně používaný)",
    options: shuffle(["Optický disk pro ukládání dat (dnes méně používaný)", "Magnetický pevný disk", "Flash paměť", "Cloudové úložiště"]),
    hints: ["CD = kompaktní disk, DVD = Digital Versatile Disc.", "Dnes je CD/DVD nahrazován USB disky a cloudem."],
  },
  {
    question: "Proč je .mp3 menší soubor než .wav při stejné délce nahrávky?",
    correctAnswer: ".mp3 je komprimovaný formát — odstraňuje zvuky, které lidské ucho neslyší",
    options: shuffle([".mp3 je komprimovaný formát — odstraňuje zvuky, které lidské ucho neslyší", ".mp3 má nižší vzorkovací frekvenci", ".wav obsahuje video i zvuk", ".mp3 ukládá data 10krát duplicitně"]),
    hints: ["Komprese = ztráta nepotřebných dat.", ".mp3 je menší díky kompresi."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jaký je rozdíl mezi ztrátovou a bezztrátovou kompresí?",
    correctAnswer: "Ztrátová (jpg, mp3) odstraní část dat; bezztrátová (png, wav) zachová vše",
    options: shuffle(["Ztrátová (jpg, mp3) odstraní část dat; bezztrátová (png, wav) zachová vše", "Jsou totéž", "Bezztrátová je vždy menší", "Ztrátová je vždy lepší kvalita"]),
    hints: [".jpg odstraní detaily pro menší soubor.", ".png zachová každý pixel."],
  },
  {
    question: "Co je vektorová grafika a jak se liší od rastrové?",
    correctAnswer: "Vektorová = matematické křivky (škáluje bez ztráty); rastrová = mřížka pixelů (.jpg, .png)",
    options: shuffle(["Vektorová = matematické křivky (škáluje bez ztráty); rastrová = mřížka pixelů (.jpg, .png)", "Jsou totéž", "Rastrová se lépe tiskne", "Vektorová je jen pro fotografii"]),
    hints: ["Vektorová = logo, ikona (SVG).", "Rastrová = fotografie (JPG, PNG)."],
  },
  {
    question: "Co je metadata souboru?",
    correctAnswer: "Informace o souboru: datum vytvoření, autor, velikost, formát",
    options: shuffle(["Informace o souboru: datum vytvoření, autor, velikost, formát", "Obsah samotného souboru", "Přípona souboru", "Název složky"]),
    hints: ["Metadata = data o datech.", "Datum pořízení fotky = metadata."],
  },
  {
    question: "Proč je důležité zálohovat data?",
    correctAnswer: "Kvůli ochraně před ztrátou při poruše disku, virem nebo omylem",
    options: shuffle(["Kvůli ochraně před ztrátou při poruše disku, virem nebo omylem", "Záloha urychlí počítač", "Záloha šifruje data", "Záloha je povinná ze zákona"]),
    hints: ["Záloha = kopie dat na jiném místě.", "Porucha disku → bez zálohy data ztracena."],
  },
  {
    question: "Co je strukturovaná data vs. nestrukturovaná data?",
    correctAnswer: "Strukturovaná = v tabulce s definovanými sloupci; nestrukturovaná = text, obrázky bez pevné struktury",
    options: shuffle(["Strukturovaná = v tabulce s definovanými sloupci; nestrukturovaná = text, obrázky bez pevné struktury", "Jsou totéž", "Strukturovaná data jsou vždy číselná", "Nestrukturovaná data nelze digitálně ukládat"]),
    hints: ["Tabulka Excel = strukturovaná.", "Esej nebo fotka = nestrukturovaná."],
  },
  {
    question: "Proč je pro vědecký výzkum důležité zaznamenat podmínky měření?",
    correctAnswer: "Bez podmínek nelze výsledky zopakovat ani porovnat s jinými měřeními",
    options: shuffle(["Bez podmínek nelze výsledky zopakovat ani porovnat s jinými měřeními", "Podmínky se nepotřebují zaznamenat", "Stačí zapsat jen čísla", "Podmínky jsou součástí výsledku automaticky"]),
    hints: ["Teplota při měření ovlivní výsledek.", "Opakovatelnost = základ vědy."],
  },
  {
    question: "Co je digitalizace dat?",
    correctAnswer: "Převod analogových dat (papír, zvuk, obraz) do digitální podoby (0 a 1)",
    options: shuffle(["Převod analogových dat (papír, zvuk, obraz) do digitální podoby (0 a 1)", "Zmenšení souboru", "Přenos dat přes WiFi", "Uložení dat do cloudu"]),
    hints: ["Skenování papíru = digitalizace.", "Analogový záznam → digitální = digitalizace."],
  },
  {
    question: "Jaký je rozdíl mezi operační paměti (RAM) a pevným diskem pro ukládání dat?",
    correctAnswer: "RAM = dočasná (maže se po vypnutí); pevný disk = trvalé uložení",
    options: shuffle(["RAM = dočasná (maže se po vypnutí); pevný disk = trvalé uložení", "RAM ukládá permanentně; pevný disk dočasně", "Jsou totéž", "RAM je pomalejší než pevný disk"]),
    hints: ["RAM = pracovní paměť, po vypnutí se vymaže.", "HDD/SSD = trvalé uložení."],
  },
  {
    question: "Proč je sběr dat dotazníkem subjektivní?",
    correctAnswer: "Odpovědi závisí na pocitech a názorech respondentů, ne na objektivním měření",
    options: shuffle(["Odpovědi závisí na pocitech a názorech respondentů, ne na objektivním měření", "Dotazník je vždy objektivní", "Respondenti vždy lžou", "Dotazník měří fyzikální veličiny"]),
    hints: ["Subjektivní = závisí na osobě.", "Otázka 'Jak se cítíš?' dá různé odpovědi."],
  },
  {
    question: "Co je datový formát a proč je důležitý?",
    correctAnswer: "Definuje strukturu a způsob uložení dat — určuje, jaký program soubor otevře",
    options: shuffle(["Definuje strukturu a způsob uložení dat — určuje, jaký program soubor otevře", "Je to přípona souboru (totéž)", "Určuje pouze velikost souboru", "Je důležitý jen pro videa"]),
    hints: ["Formát .mp3 = iTunes, Windows Media Player.", "Formát určuje, jak jsou data organizována."],
  },
  {
    question: "Co je big data?",
    correctAnswer: "Extrémně velké objemy dat, které klasické nástroje nedokáží zpracovat",
    options: shuffle(["Extrémně velké objemy dat, které klasické nástroje nedokáží zpracovat", "Velké obrázky a videa", "Data uložená v cloudu", "Data z průzkumů"]),
    hints: ["Big data = miliardy záznamů z internetu, senzorů, transakcí.", "Vyžadují speciální nástroje (Hadoop, Spark)."],
  },
  {
    question: "Co je pozorování jako metoda sběru dat?",
    correctAnswer: "Sledování a zaznamenávání jevů bez zásahu do nich",
    options: shuffle(["Sledování a zaznamenávání jevů bez zásahu do nich", "Dotazování respondentů", "Měření přístrojem", "Experimenty v laboratoři"]),
    hints: ["Pozorování = nezasahuješ, jen pozoruješ.", "Zápisky o chování zvířat = pozorování."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool =
    level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 35);
}

export const SBERAZAZNAMDATTEXTOBRAZZVUKCISLA: TopicMetadata[] = [
  {
    id: "g4-informatika-data-informace-a-modelovani-data-a-informace-sber-a-zaznam-dat-text-obraz-zvuk-cisla",
    rvpNodeId: "g4-informatika-data-informace-a-modelovani-data-a-informace-sber-a-zaznam-dat-text-obraz-zvuk-cisla",
    title: "Sběr a záznam dat - text, obraz, zvuk, čísla",
    studentTitle: "Druhy dat",
    subject: "informatika",
    category: "Data, informace a modelování",
    topic: "Data, informace a modelování",
    briefDescription: "Naučíš se rozeznávat různé druhy dat a jejich formáty.",
    keywords: ["text", "obraz", "zvuk", "čísla", "formát", "jpg", "mp3", "docx", "sběr dat"],
    goals: [
      "Žák rozliší typy dat: text, obraz, zvuk, čísla",
      "Žák přiřadí správný formát ke správnému typu dat",
      "Žák popíše základní způsoby sběru a uložení dat",
    ],
    boundaries: ["Žák se nezabývá technickými detaily komprese a kódování"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Text → .docx/.txt, Obraz → .jpg/.png, Zvuk → .mp3/.wav, Video → .mp4, Čísla → Excel/.xlsx",
      steps: [
        "Urči, o jaký typ dat jde (text, obraz, zvuk, čísla)",
        "Vzpomeň si, jaký formát se pro tento typ používá",
        "Zvol správnou odpověď",
      ],
      commonMistake: "Záměna .jpg (fotografie) a .png (průhledné pozadí).",
      example: "Fotka třídy → .jpg. Logo školy s průhledným pozadím → .png. Hudba → .mp3.",
    },
  },
];
