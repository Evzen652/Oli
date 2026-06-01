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
  { question: "Z kolika kostí se skládá lidská kostra?", correctAnswer: "206 kostí", options: ["206 kostí", "300 kostí", "150 kostí", "360 kostí"], hints: ["Novorozenec má více kostí – srůstají s věkem."] },
  { question: "Jaké jsou funkce kostry?", correctAnswer: "Opora, ochrana orgánů, pohyb, krvetvorba", options: ["Opora, ochrana orgánů, pohyb, krvetvorba", "Pouze opora a pohyb", "Trávení a dýchání", "Krevní oběh a imunita"], hints: ["Červená kostní dřeň vyrábí krvinky."] },
  { question: "Kde v těle probíhá výměna kyslíku za CO₂?", correctAnswer: "V plicích – plicních sklípcích – alveolách", options: ["V plicních sklípcích – alveolách", "V srdci", "V krvi", "V játrech"], hints: ["Alveoly = malé váčky v plicích s obrovským povrchem."] },
  { question: "Kolikrát za minutu dýchá zdravý žák přibližně?", correctAnswer: "15–20 dechů za minutu", options: ["15–20 dechů za minutu", "5–8 dechů za minutu", "30–40 dechů za minutu", "60 dechů za minutu"], hints: ["Během cvičení se dýchání zrychluje."] },
  { question: "Co jsou tepny?", correctAnswer: "Cévy vedoucí krev od srdce do těla", options: ["Cévy vedoucí krev od srdce do těla", "Cévy vedoucí krev od těla k srdci", "Cévy v plicích přenášející kyslík", "Mikrocévy propojující tkáně"], hints: ["Tepna = z srdce ven."] },
  { question: "Co jsou žíly?", correctAnswer: "Cévy vedoucí krev od těla zpět k srdci", options: ["Cévy vedoucí krev od těla zpět k srdci", "Cévy vedoucí krev od srdce do těla", "Cévy v mozku přenášející nervové impulzy", "Kapiláry v kůži"], hints: ["Žíla = do srdce."] },
  { question: "Z kolika komor a předsíní se skládá lidské srdce?", correctAnswer: "2 komory a 2 předsíně – celkem 4 části", options: ["2 komory a 2 předsíně (celkem 4 části)", "1 komora a 1 předsíň", "4 komory", "2 komory bez předsíní"], hints: ["Srdce = výkonná pumpa ve tvaru hrušky."] },
  { question: "Co jsou červené krvinky?", correctAnswer: "Přenášejí kyslík z plic do tkání – obsahují hemoglobin", options: ["Přenášejí kyslík z plic do tkání (obsahují hemoglobin)", "Bojují s bakteriemi a viry", "Srážejí krev při krvácení", "Přenášejí živiny z trávicí soustavy"], hints: ["Červené = hemoglobin = červené barvivo vázající kyslík."] },
  { question: "Jakou funkci mají bílé krvinky?", correctAnswer: "Chrání tělo před infekcí – imunita", options: ["Chrání tělo před infekcí (imunita)", "Přenášejí kyslík", "Srážejí krev", "Rozkládají živiny v krvi"], hints: ["Bílé krvinky = vojáci imunitního systému."] },
  { question: "Co je bránice a jakou má funkci při dýchání?", correctAnswer: "Svalová přepážka pod plícemi – stahem stahuje a roztahuje hrudník při dýchání", options: ["Svalová přepážka pod plícemi – stahem stahuje a roztahuje hrudník při dýchání", "Část plic, kde probíhá výměna plynů", "Chrupavka oddělující průdušnici od jícnu", "Část srdce pumupující krev do plic"], hints: ["Bránice + mezižeberní svaly = dýchací svaly."] },
  { question: "Co jsou klouby?", correctAnswer: "Spoje kostí umožňující pohyb – koleno, kyčel, rameno", options: ["Spoje kostí umožňující pohyb (koleno, kyčel, rameno)", "Svaly ovládající pohyb kostí", "Část kostra bez pohyblivých spojů", "Šlachy připevňující svaly ke kostem"], hints: ["Kloub = místo, kde se dvě kosti pohyblivě spojují."] },
  { question: "Co tvoří kostru páteř, k čemu slouží?", correctAnswer: "Páteř = 33 obratlů, chrání míchu a nese váhu těla", options: ["Páteř = 33 obratlů, chrání míchu a nese váhu těla", "Páteř = jeden pevný kus kosti od hlavy k pánvi", "Páteř nese jen hlavu – trup drží žebra", "Páteř produkuje bílé krvinky v kostní dřeni"], hints: ["Obratel = jeden kus páteře."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se liší kosterní sval od srdečního svalu?", correctAnswer: "Kosterní svaly ovládáme vědomě – ruka. Srdeční sval bije nepřetržitě automaticky – nelze ho vědomě zastavit.", options: ["Kosterní svaly ovládáme vědomě (ruka). Srdeční sval bije nepřetržitě automaticky – nelze ho vědomě zastavit.", "Kosterní svaly jsou větší než srdeční", "Srdeční sval lze zastavit meditací a vůlí", "Oba typy svalů ovládáme vědomě stejně"], hints: ["Vědomé × mimovolné svalstvo = klíčový rozdíl."] },
  { question: "Jak probíhají oba krevní oběhy (malý a velký)?", correctAnswer: "Malý – plicní: srdce → plíce – okysličení → srdce. Velký: srdce → tělo – živiny a O₂ → srdce – CO₂.", options: ["Malý (plicní): srdce → plíce (okysličení) → srdce. Velký: srdce → tělo (živiny a O₂) → srdce (CO₂).", "Malý oběh zásobuje mozek, velký zbytek těla", "Velký oběh jde přes plíce, malý přes játra", "Oba oběhy jsou totéž – pumpa je jen jedna"], hints: ["Dva oběhy = srdce čerpá do dvou oddělených okruhů."] },
  { question: "Co je plicní sklípek (alveola) a proč má velký povrch?", correctAnswer: "Alveola = malý vzduchový váček v plicích. Miliony alveol mají dohromady povrch 70–100 m² – obrovská plocha pro výměnu plynů.", options: ["Alveola = malý vzduchový váček v plicích. Miliony alveol mají dohromady povrch 70–100 m² – obrovská plocha pro výměnu plynů.", "Alveola je průdušnice vedoucí vzduch do plic", "Povrch alveol je malý – výměna probíhá v průduškách", "Alveoly jsou cévy v plicích, ne vzduchové váčky"], hints: ["Velký povrch = více kontaktu krev/vzduch = efektivnější výměna plynů."] },
  { question: "Proč se sportovci rozcvičují a ochlazují po výkonu?", correctAnswer: "Rozcvičení zahřeje svaly, zvýší průtok krve a sníží riziko zranění. Ochlazení postupně sníží srdeční tep a odplaví kyselinu mléčnou.", options: ["Rozcvičení zahřeje svaly, zvýší průtok krve a sníží riziko zranění. Ochlazení postupně sníží srdeční tep a odplaví kyselinu mléčnou.", "Rozcvičení je jen zvyk bez vědeckého zdůvodnění", "Ochlazení je zbytečné – tělo se přirozeně uklidní samo", "Rozcvičení spaluje kalorie před výkonem"], hints: ["Kyselina mléčná = vedlejší produkt intenzivního cvičení způsobující svalovou bolest."] },
  { question: "Co je krevní tlak a co ovlivňuje jeho výši?", correctAnswer: "Síla, s jakou krev tlačí na stěny tepen. Ovlivňuje ho stres, fyzická aktivita, sůl ve stravě, věk a hmotnost.", options: ["Síla, s jakou krev tlačí na stěny tepen. Ovlivňuje ho stres, fyzická aktivita, sůl ve stravě, věk a hmotnost.", "Rychlost, s jakou srdce bije za minutu", "Množství kyslíku v krvi měřené oximetrem", "Teplota krve při průchodu srdcem"], hints: ["Normální krevní tlak u dospělého: 120/80 mmHg."] },
  { question: "Jak fyzická aktivita prospívá srdci a plicím?", correctAnswer: "Pravidelný pohyb posiluje srdeční sval → srdce čerpá efektivněji. Plíce se rozšiřují → větší kapacita. Krevní cévy jsou pružnější.", options: ["Pravidelný pohyb posiluje srdeční sval → srdce čerpá efektivněji. Plíce se rozšiřují → větší kapacita. Krevní cévy jsou pružnější.", "Fyzická aktivita zvyšuje tlak krve trvale, což je nezdravé.", "Pohyb prospívá jen svalům – srdce a plíce se nemění tréninkem.", "Srdce je svůj vlastní orgán – trénink ho neovlivňuje."], hints: ["Sportovci mají pomalejší klidový tep – srdce je efektivnější."] },
  { question: "Proč jsou destičky (trombocyty) v krvi důležité?", correctAnswer: "Srážejí krev při poranění – tvoří zátku – trombus a zastavují krvácení, aby nedošlo ke ztrátě krve", options: ["Srážejí krev při poranění – tvoří zátku (trombus) a zastavují krvácení, aby nedošlo ke ztrátě krve", "Přenášejí kyslík jako červené krvinky", "Bojují s bakteriemi jako bílé krvinky", "Regulují teplotu krve procházením cévami"], hints: ["Bez destiček by se i malé škrábnutí stalo smrtelným krvácením."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jak souvisí osteoporóza s výživou a pohybem?", correctAnswer: "Osteoporóza = řídnutí kostí při nedostatku vápníku a vitamínu D. Pohyb stimuluje tvorbu nové kostní hmoty – bez pohybu kosti slábnou i při dobré výživě.", options: ["Osteoporóza = řídnutí kostí při nedostatku vápníku a vitamínu D. Pohyb stimuluje tvorbu nové kostní hmoty – bez pohybu kosti slábnou i při dobré výživě.", "Osteoporóza vzniká jen v důsledku zranění kostí.", "Pohyb kostem škodí – přetěžuje je a způsobuje osteoporózu.", "Osteoporóza je způsobena nadbytkem vápníku v krvi."], hints: ["Kost je živá tkáň – potřebuje pohybovou zátěž ke zpevnění."] },
  { question: "Proč je počet červených krvinek u horolezcích ve výšce vyšší než u lidí v nížině?", correctAnswer: "Ve výšce je méně kyslíku. Tělo reaguje produkcí více červených krvinek, aby přepravilo dostatek kyslíku při nižší koncentraci vzduchu.", options: ["Ve výšce je méně kyslíku. Tělo reaguje produkcí více červených krvinek, aby přepravilo dostatek kyslíku při nižší koncentraci vzduchu.", "Ve výšce je více kyslíku, proto jsou potřeba větší krvinky.", "Červené krvinky nemají vliv na přizpůsobení výšce.", "Horolezci mají více krvinek díky potravinovým doplňkům, ne prostředí."], hints: ["Aklimatizace = přizpůsobení těla na jiné podmínky prostředí."] },
  { question: "Jak by se změnila funkce srdce při chlopňové vadě?", correctAnswer: "Chlopeň zabraňuje zpětnému toku krve. Vadná chlopeň = krev teče zpět → srdce musí pracovat víc → přetížení a srdeční selhání.", options: ["Chlopeň zabraňuje zpětnému toku krve. Vadná chlopeň = krev teče zpět → srdce musí pracovat víc → přetížení a srdeční selhání.", "Vadná chlopeň zpomaluje srdeční tep bez jiných následků.", "Chlopně jsou ve svalech, ne v srdci – jejich poškození neovlivňuje pumpu.", "Srdce má záložní mechanismus, který funkci chlopní nahradí."], hints: ["4 srdeční chlopně: mezi předsíněmi a komorami a ve výstupních cévách."] },
  { question: "Proč při intenzivním cvičení cítíme pálení ve svalech?", correctAnswer: "Při nedostatku kyslíku přechází svaly na anaerobní metabolismus → vzniká kyselina mléčná, která způsobuje pálení a únavu.", options: ["Při nedostatku kyslíku přechází svaly na anaerobní metabolismus → vzniká kyselina mléčná, která způsobuje pálení a únavu.", "Pálení způsobuje přehřátí svalů při silném tréninku.", "Při cvičení se svaly trhlají a opravují – pálení = zánět.", "Kyslík způsobuje pálení tím, že reaguje s glukózou ve svalech."], hints: ["Anaerobní = bez kyslíku. Kyselina mléčná = dočasný metabolický produkt."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const KOSTRAASVALYDYCHACIAOBEHOVASOUSTAVA: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-kostra-a-svaly-dychaci-a-obehova-soustava",
    rvpNodeId: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-kostra-a-svaly-dychaci-a-obehova-soustava",
    title: "Kostra a svaly, dýchací a oběhová soustava",
    studentTitle: "Kostra a krev",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Lidské tělo - soustavy",
    briefDescription: "Pochopíš, jak funguje kostra, svaly, plíce a srdce.",
    keywords: ["kostra", "svaly", "srdce", "plíce", "krev", "alveoly", "tepny", "žíly", "klouby"],
    goals: ["Popsat funkce kostry a svalů", "Vysvětlit princip dýchání a výměny plynů", "Popsat malý a velký krevní oběh"],
    boundaries: ["Neprobírá biochemii krve", "Neprobírá kardiovaskulární choroby do hloubky"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Kostra: 206 kostí. Dýchání: nos → plíce → alveoly → krev. Srdce: malý (plíce) + velký (tělo) oběh.",
      steps: [
        "1. Kostra: opora + ochrana + pohyb + krvetvorba.",
        "2. Dýchání: nos → hrtan → průdušnice → plíce → alveoly.",
        "3. Alveoly: O₂ do krve, CO₂ ven.",
        "4. Srdce: malý oběh (plíce), velký oběh (tělo).",
        "5. Krev: červené (O₂), bílé (imunita), destičky (srážení).",
      ],
      commonMistake: "Tepny vedou krev OD srdce. Žíly vedou krev K srdci.",
      example: "Vdech: bránice dolů → plíce se rozepnou → vzduch dovnitř. Výdech: bránice nahoru → plíce se smrsknou.",
    },
  },
];
