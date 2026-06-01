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
  { question: "Jaký plyn v ovzduší potřebujeme k dýchání?", correctAnswer: "Kyslík (O₂)", options: ["Kyslík (O₂)", "Dusík (N₂)", "Oxid uhličitý (CO₂)", "Argon (Ar)"] },
  { question: "Jaký plyn vydechujeme při dýchání?", correctAnswer: "Oxid uhličitý (CO₂)", options: ["Kyslík (O₂)", "Dusík (N₂)", "Oxid uhličitý (CO₂)", "Vodní pára"] },
  { question: "Jakou barvu má vzduch?", correctAnswer: "Je bezbarvý", options: ["Je bezbarvý", "Modrá", "Bílá", "Šedá"] },
  { question: "Jaký je nejhojnější plyn ve vzduchu?", correctAnswer: "Dusík (N₂, cca 78 %)", options: ["Dusík (N₂, cca 78 %)", "Kyslík (O₂)", "Oxid uhličitý (CO₂)", "Argon (Ar)"] },
  { question: "Kolik procent kyslíku přibližně obsahuje vzduch?", correctAnswer: "Cca 21 %", options: ["Cca 21 %", "Cca 78 %", "Cca 1 %", "Cca 50 %"] },
  { question: "Co je vítr?", correctAnswer: "Pohyb vzduchu", options: ["Pohyb vzduchu", "Teplý vzduch stoupající nahoru", "Pohyb vody v ovzduší", "Elektrický výboj v oblacích"] },
  { question: "Jaký přístroj měří tlak vzduchu?", correctAnswer: "Barometr", options: ["Barometr", "Teploměr", "Vlhkoměr", "Rychloměr"] },
  { question: "Bez čeho nelze zapálit oheň?", correctAnswer: "Bez kyslíku", options: ["Bez kyslíku", "Bez dusíku", "Bez CO₂", "Bez argonu"] },
  { question: "Jaký plyn využívají rostliny při fotosyntéze?", correctAnswer: "Oxid uhličitý (CO₂)", options: ["Oxid uhličitý (CO₂)", "Kyslík (O₂)", "Dusík (N₂)", "Argon (Ar)"] },
  { question: "Má vzduch vůni?", correctAnswer: "Ne, čistý vzduch je bez zápachu", options: ["Ne, čistý vzduch je bez zápachu", "Ano, voní po kyslíku", "Ano, voní po dusíku", "Jen vlhký vzduch má vůni"] },
  { question: "Lze vzduch stlačit (zmáčknout)?", correctAnswer: "Ano, vzduch je stlačitelný", options: ["Ano, vzduch je stlačitelný", "Ne, vzduch nelze stlačit", "Jen při teplotě nad 100 °C", "Jen kyslík lze stlačit"] },
  { question: "Co způsobuje skleníkový efekt?", correctAnswer: "Oxid uhličitý a jiné skleníkové plyny", options: ["Oxid uhličitý a jiné skleníkové plyny", "Kyslík v atmosféře", "Dusík ve vzduchu", "Argon ve vzduchu"] },
  { question: "Jaká je přibližná hodnota tlaku vzduchu u moře?", correctAnswer: "Cca 1013 hPa", options: ["Cca 1013 hPa", "Cca 100 hPa", "Cca 5000 hPa", "Cca 500 hPa"] },
  { question: "Co je atmosféra?", correctAnswer: "Vzduchový obal Země", options: ["Vzduchový obal Země", "Vrstva vody na Zemi", "Skleníkový plyn", "Druh větru"] },
  { question: "Šíří se zvuk ve vakuu (bez vzduchu)?", correctAnswer: "Ne, zvuk potřebuje prostředí (vzduch, vodu, pevnou látku)", options: ["Ne, zvuk potřebuje prostředí (vzduch, vodu, pevnou látku)", "Ano, zvuk se šíří i ve vakuu", "Jen ve vakuu se šíří zvuk", "Zvuk se šíří jen vodou"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jaký je přibližný obsah dusíku ve vzduchu?", correctAnswer: "Cca 78 %", options: ["Cca 78 %", "Cca 21 %", "Cca 50 %", "Cca 1 %"] },
  { question: "Proč dusík neumožňuje dýchání ani hoření?", correctAnswer: "Je inertní — nereaguje s kyslíkem ani s organismy při dýchání", options: ["Je inertní — nereaguje s kyslíkem ani s organismy při dýchání", "Je příliš lehký", "Přeměňuje se na CO₂", "Je toxický pro organismy"] },
  { question: "Jak argon přispívá ke složení vzduchu?", correctAnswer: "Je třetí nejhojnější složkou (cca 1 %), je inertní", options: ["Je třetí nejhojnější složkou (cca 1 %), je inertní", "Způsobuje hoření", "Tvoří 21 % vzduchu", "Je škodlivý pro zdraví"] },
  { question: "Co je inverze (teplotní inverze) vzduchu?", correctAnswer: "Stav, kdy je studený vzduch u země a teplý nad ním (normálně naopak)", options: ["Stav, kdy je studený vzduch u země a teplý nad ním (normálně naopak)", "Prudký vítr v horách", "Způsob stlačení vzduchu", "Pohyb vzduchu od jihu"] },
  { question: "Jak vzduch přenáší teplo?", correctAnswer: "Prouděním (konvekcí) — teplý vzduch stoupá, studený klesá", options: ["Prouděním (konvekcí) — teplý vzduch stoupá, studený klesá", "Vedením skrze molekuly", "Tepelnými vlnami", "Vzduch teplo nepřenáší"] },
  { question: "Kde je tlak vzduchu nižší — v horách nebo u moře?", correctAnswer: "V horách — méně vzduchu nad námi", options: ["V horách — méně vzduchu nad námi", "U moře — kvůli vlhkosti", "Tlak vzduchu je všude stejný", "V horách jen v létě"] },
  { question: "Co je smog?", correctAnswer: "Znečištěný vzduch — směs mlhy a škodlivých látek", options: ["Znečištěný vzduch — směs mlhy a škodlivých látek", "Druh oblaku", "Zápach moře", "Speciální vítr"] },
  { question: "Co se stane se svíčkou v uzavřeném prostoru bez přístupu kyslíku?", correctAnswer: "Zhasne — bez kyslíku nemůže hořet", options: ["Zhasne — bez kyslíku nemůže hořet", "Hoří dále, vzduch nepotřebuje", "Hoří jasněji", "Přemění se na CO₂"] },
  { question: "Co je kyselý déšť a čím ho způsobuje?", correctAnswer: "Déšť obsahující kyseliny ze znečištěného vzduchu (SO₂, NOₓ)", options: ["Déšť obsahující kyseliny ze znečištěného vzduchu (SO₂, NOₓ)", "Déšť z moře s mořskou solí", "Přirozený jev bez škod", "Déšť při bouřce"] },
  { question: "Co tvoří vrstvu ozonu v atmosféře?", correctAnswer: "Ozon (O₃) — chrání Zemi před UV zářením", options: ["Ozon (O₃) — chrání Zemi před UV zářením", "Kyslík (O₂) ve velké výšce", "Dusík a argon", "Vodní pára"] },
  { question: "Proč se s nadmořskou výškou mění obsah kyslíku?", correctAnswer: "Čím výše, tím nižší tlak — méně molekul kyslíku v každém decímetru vzduchu", options: ["Čím výše, tím nižší tlak — méně molekul kyslíku v každém decímetru vzduchu", "Kyslík stoupá do výšky", "Obsah kyslíku se nemění", "Pouze CO₂ klesá s výškou"] },
  { question: "Jak rostliny přispívají k obsahu kyslíku ve vzduchu?", correctAnswer: "Fotosyntézou — přijímají CO₂ a uvolňují O₂", options: ["Fotosyntézou — přijímají CO₂ a uvolňují O₂", "Dýcháním vydávají O₂ i CO₂", "Nemají vliv na obsah kyslíku", "Absorbují O₂ a uvolňují N₂"] },
  { question: "Co je anemometr?", correctAnswer: "Přístroj měřící rychlost větru", options: ["Přístroj měřící rychlost větru", "Přístroj měřící tlak vzduchu", "Přístroj měřící vlhkost vzduchu", "Přístroj měřící teplotu vzduchu"] },
  { question: "Co způsobuje vítr?", correctAnswer: "Rozdíly v tlaku vzduchu — vzduch proudí z vysokého do nízkého tlaku", options: ["Rozdíly v tlaku vzduchu — vzduch proudí z vysokého do nízkého tlaku", "Rotace Země", "Pohyb Měsíce", "Změna teploty vody v mořích"] },
  { question: "Proč se vzduch zahřívá blíže k zemskému povrchu?", correctAnswer: "Povrch Země pohltí sluneční záření a zahřeje přiléhající vzduch", options: ["Povrch Země pohltí sluneční záření a zahřeje přiléhající vzduch", "Vzduch sám zachytává sluneční záření", "Vzduch se zahřívá od hor", "Teplo pochází ze Slunce přímo"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jak přispívá dusík v atmosféře k ochraně živých organismů?", correctAnswer: "Ředí kyslík na bezpečnou koncentraci a brání spontánnímu hoření", options: ["Ředí kyslík na bezpečnou koncentraci a brání spontánnímu hoření", "Dusík životy chrání přímo toxicitou", "Dusík nemá ochrannou funkci", "Dusík absorbuje UV záření"] },
  { question: "Vysvětli skleníkový efekt a jeho přirozený x zesilovaný charakter.", correctAnswer: "Přirozený: CO₂ a H₂O zadržují teplo (nutné pro život). Zesilovaný: nadbytek CO₂ z fosilních paliv otepluje Zemi.", options: ["Přirozený: CO₂ a H₂O zadržují teplo (nutné pro život). Zesilovaný: nadbytek CO₂ z fosilních paliv otepluje Zemi.", "Skleníkový efekt je jen umělý fenomén bez přirozené příčiny.", "Přirozený skleníkový efekt Zemi ochlazuje, zesilovaný otepluje.", "Skleníkový efekt způsobuje jen dusík."] },
  { question: "Jak ovlivňuje znečištění vzduchu zdraví člověka?", correctAnswer: "Způsobuje dýchací potíže, alergii, rakovinu plic a kardiovaskulární choroby", options: ["Způsobuje dýchací potíže, alergii, rakovinu plic a kardiovaskulární choroby", "Nemá dokázaný vliv na zdraví", "Ovlivňuje jen kůži", "Způsobuje jen alergii"] },
  { question: "Co je proudění vzduchu (cirkulace atmosféry) a co ho způsobuje?", correctAnswer: "Globální pohyb vzduchu způsobený nerovnoměrným ohřevem Země Sluncem", options: ["Globální pohyb vzduchu způsobený nerovnoměrným ohřevem Země Sluncem", "Rotace Země bez vlivu Slunce", "Přitahování vzduchu Měsícem", "Pohyb mořských proudů"] },
  { question: "Jak se liší složení vydechovaného vzduchu od vdechovaného?", correctAnswer: "Vydechovaný: více CO₂ (~4 %), méně O₂ (~17 %), stejně N₂", options: ["Vydechovaný: více CO₂ (~4 %), méně O₂ (~17 %), stejně N₂", "Vydechovaný: méně CO₂, více O₂", "Vydechovaný: žádný dusík, jen CO₂", "Vydechovaný vzduch je identický s vdechovaným"] },
  { question: "Co je atmosférický tlak a proč je důležitý pro meteorologii?", correctAnswer: "Tlak vzduchového sloupce — vysoký tlak = hezké počasí, nízký tlak = bouřky a déšť", options: ["Tlak vzduchového sloupce — vysoký tlak = hezké počasí, nízký tlak = bouřky a déšť", "Tlak vzduchu nemá vliv na počasí", "Nízký tlak vždy přináší hezké počasí", "Atmosférický tlak se nemění"] },
  { question: "Co je konvekční bouřka a jak vzniká?", correctAnswer: "Bouřka vznikající silným vzestupem teplého vlhkého vzduchu — vytvoří se cumulonimbus", options: ["Bouřka vznikající silným vzestupem teplého vlhkého vzduchu — vytvoří se cumulonimbus", "Bouřka přicházející od moře", "Bouřka způsobená hřebenem fronty", "Bouřka bez srážek"] },
  { question: "Jak funguje větrná elektrárna a co pohání turbínu?", correctAnswer: "Pohybující se vzduch (vítr) otáčí lopatkami turbíny a generuje elektřinu", options: ["Pohybující se vzduch (vítr) otáčí lopatkami turbíny a generuje elektřinu", "Turbínu pohání slunce přímo", "Turbínu pohání vodní pára z výparu", "Turbínu pohání zemský magnetismus"] },
  { question: "Proč jsou lesy důležité pro kvalitu vzduchu?", correctAnswer: "Absorbují CO₂ a produkují O₂ fotosyntézou — fungují jako plíce planety", options: ["Absorbují CO₂ a produkují O₂ fotosyntézou — fungují jako plíce planety", "Lesy produkují CO₂ a pohlcují O₂", "Lesy nemají vliv na složení vzduchu", "Lesy pouze čistí vzduch od prachu"] },
  { question: "Co je Coriolisova síla a jak ovlivňuje vítr?", correctAnswer: "Zdánlivá síla způsobená rotací Země — stáčí větry doprava na severní polokouli", options: ["Zdánlivá síla způsobená rotací Země — stáčí větry doprava na severní polokouli", "Reálná síla způsobující tornáda", "Gravitační síla na vzduch", "Síla způsobená magnetickým polem Země"] },
  { question: "Jak se liší troposféra od stratosféry?", correctAnswer: "Troposféra: nejnižší vrstva (0–12 km), teplota klesá s výškou, počasí. Stratosféra: 12–50 km, ozonová vrstva, teplota stoupá.", options: ["Troposféra: nejnižší vrstva (0–12 km), teplota klesá s výškou, počasí. Stratosféra: 12–50 km, ozonová vrstva, teplota stoupá.", "Troposféra je výše než stratosféra.", "V stratosféře se tvoří počasí a bouřky.", "Obě vrstvy mají stejnou teplotu."] },
  { question: "Co je fotochemický smog a kdy vzniká?", correctAnswer: "Smog vzniklý reakcí škodlivin z dopravy a průmyslu se slunečním zářením", options: ["Smog vzniklý reakcí škodlivin z dopravy a průmyslu se slunečním zářením", "Mlha nad mořem za slunečného počasí", "Přírodní smog z lesních požárů", "Smog z kondenzace vodní páry"] },
  { question: "Proč je důležité větrání místností?", correctAnswer: "Snižuje koncentraci CO₂ a přivádí čerstvý kyslík — zlepšuje soustředění", options: ["Snižuje koncentraci CO₂ a přivádí čerstvý kyslík — zlepšuje soustředění", "Větrání jen ochlazuje místnost", "Větrání odstraňuje dusík", "Větrání nemá vliv na zdraví"] },
  { question: "Co je depresie a anticyklóna v meteorologii?", correctAnswer: "Depresie = oblast nízkého tlaku (nepříjemné počasí). Anticyklóna = oblast vysokého tlaku (hezké počasí).", options: ["Depresie = oblast nízkého tlaku (nepříjemné počasí). Anticyklóna = oblast vysokého tlaku (hezké počasí).", "Depresie = bouřka, anticyklóna = bezvětří bez srážek.", "Depresie = vysoký tlak, anticyklóna = nízký tlak.", "Jsou to totéž — jen různé názvy."] },
  { question: "Jaká je funkce ozónové vrstvy pro život na Zemi?", correctAnswer: "Absorbuje škodlivé UV záření Slunce — chrání organismy před rakovinou kůže a poškozením DNA", options: ["Absorbuje škodlivé UV záření Slunce — chrání organismy před rakovinou kůže a poškozením DNA", "Zadržuje kyslík v troposféře", "Produkuje kyslík pro dýchání", "Brání dusíku v úniku z atmosféry"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 40);
}

export const VZDUCHSLOZENIVLASTNOSTIVYZNAM: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-vzduch-slozeni-vlastnosti-vyznam",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-vzduch-slozeni-vlastnosti-vyznam",
    title: "Vzduch - složení, vlastnosti, význam",
    studentTitle: "Vzduch kolem nás",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš složení vzduchu a pochopíš, proč je kyslík pro nás nenahraditelný.",
    keywords: ["vzduch", "kyslík", "dusík", "CO₂", "oxid uhličitý", "atmosféra", "vítr", "tlak vzduchu"],
    goals: [
      "Jmenovat hlavní složky vzduchu s přibližnými procenty",
      "Vysvětlit roli kyslíku pro dýchání a hoření",
      "Popsat vlastnosti vzduchu (bezbarvý, bez zápachu, stlačitelný)",
      "Vysvětlit, co je vítr a tlak vzduchu",
    ],
    boundaries: ["Detailní chemické vzorce nejsou náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Vzduch: 78 % dusík, 21 % kyslík, 1 % argon, 0,04 % CO₂.",
      steps: [
        "1. Kyslík = dýchání a hoření.",
        "2. Dusík = inertní, nejvíce ve vzduchu.",
        "3. CO₂ = fotosyntéza rostlin, vydechujeme ho.",
        "4. Vítr = pohyb vzduchu, barometr = měří tlak.",
      ],
      commonMistake: "Záměna: kyslík tvoří 21 % (ne 78 %) — dusík je ten, co tvoří 78 %.",
      example: "Svíčka zhasne v zavřené nádobě, protože spotřebuje kyslík.",
    },
  },
];
