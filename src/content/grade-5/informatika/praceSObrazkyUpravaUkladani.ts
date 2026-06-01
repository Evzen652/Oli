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
  { question: "Co je oříznutí obrázku?", correctAnswer: "Výběr části obrázku a odebrání okrajů", options: ["Výběr části obrázku a odebrání okrajů", "Zvětšení obrázku", "Změna barev obrázku", "Uložení obrázku"], hints: ["Oříznout = nechat jen část obrázku."] },
  { question: "Co je formát JPG?", correctAnswer: "Formát pro fotografie — menší velikost souboru, horší kvalita při velkém zvětšení", options: ["Formát pro fotografie — menší velikost souboru, horší kvalita při velkém zvětšení", "Formát pro animace", "Formát pro vektorovou grafiku", "Formát pro průhledné pozadí"], hints: ["JPG = komprimovaná fotka."] },
  { question: "Co je formát PNG?", correctAnswer: "Formát s průhledným pozadím — větší soubor než JPG, ale bez ztráty kvality", options: ["Formát s průhledným pozadím — větší soubor než JPG, ale bez ztráty kvality", "Formát pro animace", "Komprimovaná fotografie", "Vektorová grafika"], hints: ["PNG = průhledné pozadí + bez ztráty kvality."] },
  { question: "Co je formát GIF?", correctAnswer: "Formát pro krátké animace — pohyblivé obrázky", options: ["Formát pro krátké animace — pohyblivé obrázky", "Formát pro fotografie", "Vektorová grafika", "Formát s průhledným pozadím"], hints: ["GIF = pohyblivý obrázek (animace)."] },
  { question: "Jaký program je vhodný pro jednoduchou úpravu obrázků na Windows?", correctAnswer: "Paint (Malování)", options: ["Paint (Malování)", "Word", "Excel", "Scratch"], hints: ["Paint je předinstalovaný na Windows a slouží k jednoduchým úpravám obrázků."] },
  { question: "Co dělá funkce 'jas' při úpravě obrázku?", correctAnswer: "Změní, jak světlý nebo tmavý obrázek vypadá", options: ["Změní, jak světlý nebo tmavý obrázek vypadá", "Změní velikost obrázku", "Přidá efekt", "Ořízne obrázek"], hints: ["Jas = světlost obrázku."] },
  { question: "Co dělá funkce 'kontrast' při úpravě obrázku?", correctAnswer: "Změní rozdíl mezi světlými a tmavými částmi obrázku", options: ["Změní rozdíl mezi světlými a tmavými částmi obrázku", "Změní barvu pozadí", "Ořízne obrázek", "Zvětší soubor"], hints: ["Kontrast = rozdíl světlá vs. tmavá."] },
  { question: "Co je otočení obrázku?", correctAnswer: "Otočení obrázku o 90°, 180° nebo 270°", options: ["Otočení obrázku o 90°, 180° nebo 270°", "Zrcadlové převrácení obrázku", "Oříznutí obrázku", "Změna formátu obrázku"], hints: ["Otočení = rotace obrázku."] },
  { question: "Proč je PNG lepší než JPG pro loga s průhledným pozadím?", correctAnswer: "PNG podporuje průhlednost, JPG ne", options: ["PNG podporuje průhlednost, JPG ne", "PNG je vždy menší než JPG", "JPG má lepší kvalitu barev", "JPG podporuje průhlednost"], hints: ["Průhledné pozadí = PNG."] },
  { question: "Co je resize (změna velikosti) obrázku?", correctAnswer: "Změna rozměrů obrázku (výška a šířka v pixelech)", options: ["Změna rozměrů obrázku (výška a šířka v pixelech)", "Oříznutí obrázku", "Změna formátu obrázku", "Přidání filtru"], hints: ["Resize = znovu nastavit velikost."] },
  { question: "Kde se obrázky nejčastěji ukládají v počítači?", correctAnswer: "Do složky Obrázky nebo na plochu", options: ["Do složky Obrázky nebo na plochu", "Do složky Dokumenty", "Do e-mailu", "Do prohlížeče"], hints: ["Obrázky mají vlastní složku."] },
  { question: "Co je filtr v grafickém programu?", correctAnswer: "Efekt aplikovaný na celý obrázek (černobílý, sépia, rozostření)", options: ["Efekt aplikovaný na celý obrázek (černobílý, sépia, rozostření)", "Způsob oříznutí obrázku", "Typ souboru", "Tlačítko pro uložení"], hints: ["Filtr = vizuální efekt na celý obrázek."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Chci sdílet fotku z dovolené přes e-mail a chci co nejmenší soubor. Jaký formát zvolím?", correctAnswer: "JPG — menší soubor vhodný pro fotografie", options: ["JPG — menší soubor vhodný pro fotografie", "PNG — průhledné pozadí", "GIF — animace", "SVG — vektorový"], hints: ["JPG = menší soubor = rychlé sdílení fotografií."] },
  { question: "Chci logo webu, které bude mít průhledné pozadí a bez ztráty kvality. Jaký formát?", correctAnswer: "PNG — průhlednost + bezztrátová kvalita", options: ["PNG — průhlednost + bezztrátová kvalita", "JPG — foto formát", "GIF — animace", "SVG — vektorový"], hints: ["Průhledné pozadí = PNG."] },
  { question: "Jaký je rozdíl mezi rastrovou a vektorovou grafikou?", correctAnswer: "Rastrová = složena z pixelů (JPG, PNG); vektorová = matematické křivky, bezpochyby skalovatelná (SVG)", options: ["Rastrová = složena z pixelů (JPG, PNG); vektorová = matematické křivky, bezpochyby skalovatelná (SVG)", "Rastrová = vektorová, jen jiný název", "Vektorová = pixely; rastrová = křivky", "SVG je rastrový formát"], hints: ["Pixely vs. křivky — co se zvětší bez pixelizace?"] },
  { question: "Proč SVG formát vypadá hezky i po velkém zvětšení?", correctAnswer: "Je vektorový — popsán matematickými křivkami, ne pixely", options: ["Je vektorový — popsán matematickými křivkami, ne pixely", "SVG má více pixelů než JPG", "SVG automaticky zvyšuje rozlišení", "SVG je komprimovaný"], hints: ["Vektor = křivka = lze zvětšit bez pixelizace."] },
  { question: "Obrázek v JPG zvětším 10× — co se stane s kvalitou?", correctAnswer: "Obrázek bude rozmazaný (pixelizovaný) — JPG je rastrový", options: ["Obrázek bude rozmazaný (pixelizovaný) — JPG je rastrový", "Obrázek bude stále ostrý", "Obrázek se automaticky ostří", "Nic se nestane"], hints: ["Rastrový obrázek při zvětšení ztrácí ostrost — pixely jsou vidět."] },
  { question: "Jaký program je lepší než Paint pro profesionální úpravu fotek?", correctAnswer: "GIMP nebo Adobe Photoshop", options: ["GIMP nebo Adobe Photoshop", "Scratch", "Word", "Excel"], hints: ["GIMP = profesionální bezplatný grafický program."] },
  { question: "Co je Canva?", correctAnswer: "Online nástroj pro tvorbu grafiky, plakátů a prezentací — i bez instalace", options: ["Online nástroj pro tvorbu grafiky, plakátů a prezentací — i bez instalace", "Antivirový program", "Tabulkový procesor", "Programovací prostředí"], hints: ["Canva = grafický editor v prohlížeči."] },
  { question: "Proč je JPG formát menší než PNG při stejném obrázku?", correctAnswer: "JPG používá ztrátovou kompresi — trochu sníží kvalitu, ale výrazně zmenší soubor", options: ["JPG používá ztrátovou kompresi — trochu sníží kvalitu, ale výrazně zmenší soubor", "JPG má méně barev", "PNG je vždy větší bez důvodu", "JPG je starší formát"], hints: ["Komprese = menší soubor, ale trochu horší kvalita."] },
  { question: "Co je vhodné udělat před sdílením fotky s osobami (jas příliš tmavý)?", correctAnswer: "Zvýšit jas v grafickém programu", options: ["Zvýšit jas v grafickém programu", "Změnit formát na GIF", "Oříznout tmavé okraje", "Zvětšit soubor"], hints: ["Tmavá fotka = zvýšit jas."] },
  { question: "Uložím obrázek jako JPG a pak ho budu opakovaně upravovat a ukládat. Co se stane s kvalitou?", correctAnswer: "Kvalita se s každým uložením trochu sníží — JPG je ztrátový formát", options: ["Kvalita se s každým uložením trochu sníží — JPG je ztrátový formát", "Kvalita zůstane stejná", "Kvalita se zlepší", "Soubor se zvětší bez ztráty kvality"], hints: ["JPG ztrácí trochu kvality při každém uložení."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Chci pro web ikonu, která bude hezky vypadat na malém i velkém monitoru. Jaký formát?", correctAnswer: "SVG — vektorový, skalovatelný bez ztráty kvality", options: ["SVG — vektorový, skalovatelný bez ztráty kvality", "JPG — foto formát", "GIF — animace", "PNG — průhlednost, ale rastrový"], hints: ["Ikona na různých velikostech = SVG (vektorový)."] },
  { question: "Jaký je rozdíl mezi oříznutím a změnou velikosti (resize)?", correctAnswer: "Oříznutí odstraní okraje; resize změní celkové rozměry obrázku", options: ["Oříznutí odstraní okraje; resize změní celkové rozměry obrázku", "Jsou totéž", "Resize odstraní okraje; oříznutí změní rozměry", "Oříznutí změní formát"], hints: ["Oříznout = menší plocha; resize = menší celý obrázek."] },
  { question: "Mám obrázek 4000×3000 px. Chci ho zmenšit na 800×600 px. O kolik procent se sníží počet pixelů?", correctAnswer: "O 96 % (4000×3000 = 12 mil. px; 800×600 = 480 tis. px; pokles 96 %)", options: ["O 96 % (4000×3000 = 12 mil. px; 800×600 = 480 tis. px; pokles 96 %)", "O 50 %", "O 80 %", "O 25 %"], hints: ["12 000 000 → 480 000: pokles = (12 mil - 480 tis) ÷ 12 mil ≈ 96 %."] },
  { question: "Proč by neměly fotografie na webech být v PNG formátu (jsou-li fotografie bez průhledného pozadí)?", correctAnswer: "PNG fotky jsou zbytečně velké — JPG stejnou kvalitu fotky uloží s menším souborem", options: ["PNG fotky jsou zbytečně velké — JPG stejnou kvalitu fotky uloží s menším souborem", "PNG formát web nepodporuje", "PNG má horší barvy než JPG", "PNG fotky se nezobrazí v prohlížeči"], hints: ["PNG = velký soubor. JPG = menší soubor při podobné vizuální kvalitě fotky."] },
  { question: "Chci vytvořit animovaný pozdrav (pohyblivý obrázek). Jaký formát?", correctAnswer: "GIF — formát pro krátké animace", options: ["GIF — formát pro krátké animace", "JPG", "PNG", "SVG"], hints: ["GIF = animace z více snímků."] },
  { question: "Co se stane při oříznutí obrázku z 1000×800 px na 500×400 px?", correctAnswer: "Obrázek zachová stejné rozlišení, ale zobrazí jen vybranou část", options: ["Obrázek zachová stejné rozlišení, ale zobrazí jen vybranou část", "Obrázek ztratí kvalitu", "Velikost souboru se zdvojnásobí", "Formát se změní na PNG"], hints: ["Oříznutí = menší plocha, stejná hustota pixelů."] },
  { question: "Proč je vhodné uchovávat originál fotky a upravovat jen kopii?", correctAnswer: "Pokud úprava selže nebo se nelíbí, mám stále originál nezměněný", options: ["Pokud úprava selže nebo se nelíbí, mám stále originál nezměněný", "Originál zabírá zbytečné místo", "Kopii nelze upravovat", "Programy automaticky ukládají originál"], hints: ["Vždy pracuj s kopií — originál si zachovej jako zálohu."] },
  { question: "Grafický program GIMP je zdarma. Co to znamená pro uživatele?", correctAnswer: "Může ho kdokoliv stáhnout a používat bez platby (open-source)", options: ["Může ho kdokoliv stáhnout a používat bez platby (open-source)", "GIMP je dostupný jen pro školy", "GIMP je horší než placené programy", "GIMP vyžaduje roční předplatné"], hints: ["Open-source = zdarma + dostupný pro všechny."] },
  { question: "Jaká je výhoda ukládání ve formátu PNG oproti JPG u obrázků s textem nebo ostrými hranami?", correctAnswer: "PNG uchovává ostré hrany a text bez rozmazání — JPG je rozmaže kompresí", options: ["PNG uchovává ostré hrany a text bez rozmazání — JPG je rozmaže kompresí", "JPG je lepší pro text", "Oba formáty jsou pro text stejné", "PNG text automaticky zvětší"], hints: ["JPG komprese rozmaže ostré hrany — PNG je bezztrátové."] },
  { question: "Co je DPI (dots per inch) u obrázku?", correctAnswer: "Počet bodů (pixelů) na jeden palec — určuje kvalitu tisku", options: ["Počet bodů (pixelů) na jeden palec — určuje kvalitu tisku", "Velikost souboru v MB", "Typ formátu obrázku", "Barevná hloubka obrázku"], hints: ["DPI = hustota pixelů. Vyšší DPI = lepší tisk."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const PRACESOBRAZKYUPRAVAUKLADANI: TopicMetadata[] = [
  {
    id: "g5-informatika-digitalni-technologie-prace-s-textem-a-obrazem-prace-s-obrazky-uprava-ukladani",
    rvpNodeId: "g5-informatika-digitalni-technologie-prace-s-textem-a-obrazem-prace-s-obrazky-uprava-ukladani",
    title: "Práce s obrázky - úprava, ukládání",
    studentTitle: "Úprava obrázků",
    subject: "informatika",
    category: "Digitální technologie",
    topic: "Práce s textem a obrazem",
    briefDescription: "Naučíš se upravit obrázek a uložit ho ve správném formátu.",
    keywords: ["JPG", "PNG", "GIF", "SVG", "oříznutí", "jas", "kontrast", "GIMP", "Paint", "rastrová", "vektorová"],
    goals: [
      "Rozliší formáty JPG, PNG, GIF, SVG a ví, kdy je použít.",
      "Provede základní úpravy obrázku (oříznutí, jas, rotace).",
      "Rozumí rozdílu mezi rastrovou a vektorovou grafikou.",
    ],
    boundaries: ["Pokročilá retuš fotek", "Barevné profily a ICC", "3D grafika"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "JPG = menší soubor pro fotky. PNG = průhledné pozadí. GIF = animace. SVG = vektorový, skalovatelný. Rastrový = pixely; vektorový = křivky.",
      steps: [
        "Otevřu obrázek v grafickém programu (Paint, GIMP, Canva).",
        "Provedu úpravy: oříznutí, jas, kontrast, rotace.",
        "Zvolím správný formát pro uložení.",
        "Uložím jako kopii — originál zachovám.",
      ],
      commonMistake: "Použití JPG pro logo s průhledným pozadím — JPG průhlednost nepodporuje. Správně je PNG.",
      example: "Fotka z dovolené → JPG (menší soubor). Logo webu s průhledným pozadím → PNG. Animovaný pozdrav → GIF.",
    },
  },
];
