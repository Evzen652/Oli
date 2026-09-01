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
  { question: "Jaký plyn v ovzduší potřebujeme k dýchání?", correctAnswer: "Kyslík – O₂", options: ["Kyslík – O₂", "Dusík – N₂", "Oxid uhličitý – CO₂", "Argon – Ar"] },
  { question: "Jaký plyn vydechujeme při dýchání?", correctAnswer: "Oxid uhličitý – CO₂", options: ["Kyslík – O₂", "Oxid uhličitý – CO₂", "Dusík – N₂", "Vodní pára"] },
  { question: "Jakou barvu má vzduch?", correctAnswer: "Je bezbarvý", options: ["Modrá", "Bílá", "Je bezbarvý", "Šedá"] },
  { question: "Jaký je nejhojnější plyn ve vzduchu?", correctAnswer: "Dusík – N₂, cca 78 %", options: ["Kyslík – O₂", "Oxid uhličitý – CO₂", "Argon – Ar", "Dusík – N₂, cca 78 %"] },
  { question: "Kolik procent kyslíku přibližně obsahuje vzduch?", correctAnswer: "Cca 21 %", options: ["Cca 21 %", "Cca 78 %", "Cca 1 %", "Cca 50 %"] },
  { question: "Co je vítr?", correctAnswer: "Pohyb vzduchu", options: ["Teplý vzduch stoupající nahoru", "Pohyb vzduchu", "Pohyb vody v ovzduší", "Elektrický výboj v oblacích"] },
  { question: "Jaký přístroj měří tlak vzduchu?", correctAnswer: "Barometr", options: ["Teploměr", "Vlhkoměr", "Barometr", "Rychloměr"] },
  { question: "Bez čeho nelze zapálit oheň?", correctAnswer: "Bez kyslíku", options: ["Bez dusíku", "Bez CO₂", "Bez argonu", "Bez kyslíku"] },
  { question: "Jaký plyn využívají rostliny při fotosyntéze?", correctAnswer: "Oxid uhličitý – CO₂", options: ["Oxid uhličitý – CO₂", "Kyslík – O₂", "Dusík – N₂", "Argon – Ar"] },
  { question: "Má vzduch vůni?", correctAnswer: "Ne, čistý vzduch je bez zápachu", options: ["Ano, voní po kyslíku", "Ne, čistý vzduch je bez zápachu", "Ano, voní po dusíku", "Jen vlhký vzduch má vůni"] },
  { question: "Lze vzduch stlačit (zmáčknout)?", correctAnswer: "Ano, vzduch je stlačitelný", options: ["Ne, vzduch nelze stlačit", "Jen při teplotě nad 100 °C", "Ano, vzduch je stlačitelný", "Jen kyslík lze stlačit"] },
  { question: "Co způsobuje skleníkový efekt?", correctAnswer: "Oxid uhličitý a další plyny", options: ["Kyslík obsažený v atmosféře", "Dusík obsažený ve vzduchu", "Argon obsažený ve vzduchu", "Oxid uhličitý a další plyny"] },
  { question: "Jaká je přibližná hodnota tlaku vzduchu u moře?", correctAnswer: "Cca 1013 hPa", options: ["Cca 1013 hPa", "Cca 100 hPa", "Cca 5000 hPa", "Cca 500 hPa"] },
  { question: "Co je atmosféra?", correctAnswer: "Vzduchový obal Země", options: ["Vrstva vody na Zemi", "Vzduchový obal Země", "Skleníkový plyn", "Druh větru"] },
  { question: "Šíří se zvuk ve vakuu (bez vzduchu)?", correctAnswer: "Ne, zvuk potřebuje prostředí", options: ["Ano, zvuk se šíří i ve vakuu", "Jen ve vakuu se šíří zvuk", "Ne, zvuk potřebuje prostředí", "Zvuk se šíří jen vodou"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jaký je přibližný obsah dusíku ve vzduchu?", correctAnswer: "Cca 78 %", options: ["Cca 21 %", "Cca 50 %", "Cca 1 %", "Cca 78 %"] },
  { question: "Proč dusík neumožňuje dýchání ani hoření?", correctAnswer: "Nereaguje s jinými látkami", options: ["Nereaguje s jinými látkami", "Je příliš lehký na dýchání", "Přeměňuje se na oxid uhličitý", "Je jedovatý pro organismy"] },
  { question: "Jak argon přispívá ke složení vzduchu?", correctAnswer: "Tvoří asi 1 % a nereaguje", options: ["Způsobuje hoření látek", "Tvoří asi 1 % a nereaguje", "Tvoří 21 % vzduchu", "Je škodlivý pro zdraví"] },
  { question: "Co je inverze (teplotní inverze) vzduchu?", correctAnswer: "Studený vzduch je u země", options: ["Prudký vítr v horách", "Způsob stlačení vzduchu", "Studený vzduch je u země", "Pohyb vzduchu od jihu"] },
  { question: "Jak vzduch přenáší teplo?", correctAnswer: "Prouděním, teplý vzduch stoupá", options: ["Vedením skrze molekuly", "Tepelnými vlnami zdola", "Vzduch teplo nepřenáší", "Prouděním, teplý vzduch stoupá"] },
  { question: "Kde je tlak vzduchu nižší — v horách nebo u moře?", correctAnswer: "V horách — méně vzduchu nad námi", options: ["V horách — méně vzduchu nad námi", "U moře — kvůli vlhkosti", "Tlak vzduchu je všude stejný", "V horách jen v létě"] },
  { question: "Co je smog?", correctAnswer: "Znečištěný vzduch s mlhou", options: ["Zvláštní druh oblaku", "Znečištěný vzduch s mlhou", "Zápach od moře", "Velmi silný vítr"] },
  { question: "Co se stane se svíčkou v uzavřeném prostoru bez přístupu kyslíku?", correctAnswer: "Zhasne — bez kyslíku nemůže hořet", options: ["Hoří dále, vzduch nepotřebuje", "Hoří jasněji", "Zhasne — bez kyslíku nemůže hořet", "Přemění se na CO₂"] },
  { question: "Co je kyselý déšť a čím ho způsobuje?", correctAnswer: "Déšť s kyselinami ze znečištění", options: ["Déšť z moře s mořskou solí", "Přirozený jev bez škod", "Déšť při silné bouřce", "Déšť s kyselinami ze znečištění"] },
  { question: "Co tvoří vrstvu ozonu v atmosféře?", correctAnswer: "Ozon – O₃ — chrání Zemi před UV zářením", options: ["Ozon – O₃ — chrání Zemi před UV zářením", "Kyslík – O₂ ve velké výšce", "Dusík a argon", "Vodní pára"] },
  { question: "Proč se s nadmořskou výškou mění obsah kyslíku?", correctAnswer: "Nahoře je nižší tlak", options: ["Kyslík stoupá do výšky", "Nahoře je nižší tlak", "Obsah kyslíku se nemění", "Klesá jen oxid uhličitý"] },
  { question: "Jak rostliny přispívají k obsahu kyslíku ve vzduchu?", correctAnswer: "Fotosyntézou — přijímají CO₂ a uvolňují O₂", options: ["Dýcháním vydávají O₂ i CO₂", "Nemají vliv na obsah kyslíku", "Fotosyntézou — přijímají CO₂ a uvolňují O₂", "Absorbují O₂ a uvolňují N₂"] },
  { question: "Co je anemometr?", correctAnswer: "Přístroj měřící rychlost větru", options: ["Přístroj měřící tlak vzduchu", "Přístroj měřící vlhkost vzduchu", "Přístroj měřící teplotu vzduchu", "Přístroj měřící rychlost větru"] },
  { question: "Co způsobuje vítr?", correctAnswer: "Rozdíly v tlaku vzduchu", options: ["Rozdíly v tlaku vzduchu", "Otáčení Země kolem osy", "Pohyb Měsíce kolem Země", "Změna teploty vody v mořích"] },
  { question: "Proč se vzduch zahřívá blíže k zemskému povrchu?", correctAnswer: "Povrch Země pohltí sluneční záření a zahřeje přiléhající vzduch", options: ["Vzduch sám zachytává sluneční záření", "Povrch Země pohltí sluneční záření a zahřeje přiléhající vzduch", "Vzduch se zahřívá od hor", "Teplo pochází ze Slunce přímo"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jak přispívá dusík v atmosféře k ochraně živých organismů?", correctAnswer: "Ředí kyslík na bezpečnou koncentraci a brání spontánnímu hoření", options: ["Dusík životy chrání přímo toxicitou", "Dusík nemá ochrannou funkci", "Ředí kyslík na bezpečnou koncentraci a brání spontánnímu hoření", "Dusík absorbuje UV záření"] },
  { question: "Vysvětli skleníkový efekt a jeho přirozený x zesilovaný charakter.", correctAnswer: "Přirozený: CO₂ a H₂O zadržují teplo – nutné pro život . Zesilovaný: nadbytek CO₂ z fosilních paliv otepluje Zemi.", options: ["Skleníkový efekt je jen umělý fenomén bez přirozené příčiny.", "Přirozený skleníkový efekt Zemi ochlazuje, zesilovaný otepluje.", "Skleníkový efekt způsobuje jen dusík.", "Přirozený: CO₂ a H₂O zadržují teplo – nutné pro život . Zesilovaný: nadbytek CO₂ z fosilních paliv otepluje Zemi."] },
  { question: "Jak ovlivňuje znečištění vzduchu zdraví člověka?", correctAnswer: "Dýchací potíže a nemoci plic", options: ["Dýchací potíže a nemoci plic", "Nemá dokázaný vliv na zdraví", "Ovlivňuje jen pokožku", "Způsobuje pouze alergii"] },
  { question: "Co je proudění vzduchu (cirkulace atmosféry) a co ho způsobuje?", correctAnswer: "Vzduch žene nerovnoměrný ohřev", options: ["Rotace Země bez vlivu Slunce", "Vzduch žene nerovnoměrný ohřev", "Přitahování vzduchu Měsícem", "Pohyb mořských proudů"] },
  { question: "Jak se liší složení vydechovaného vzduchu od vdechovaného?", correctAnswer: "Vydechovaný: více CO₂ (~4 %), méně O₂ – ~17 % , stejně N₂", options: ["Vydechovaný: méně CO₂, více O₂", "Vydechovaný: žádný dusík, jen CO₂", "Vydechovaný: více CO₂ (~4 %), méně O₂ – ~17 % , stejně N₂", "Vydechovaný vzduch je identický s vdechovaným"] },
  { question: "Co je atmosférický tlak a proč je důležitý pro meteorologii?", correctAnswer: "Vysoký tlak přináší hezké počasí", options: ["Nízký tlak přináší hezké počasí", "Tlak nemá vliv na počasí", "Tlak měříme jen v horách", "Vysoký tlak přináší hezké počasí"] },
  { question: "Co je konvekční bouřka a jak vzniká?", correctAnswer: "Vzniká vzestupem teplého vzduchu", options: ["Vzniká vzestupem teplého vzduchu", "Bouřka přicházející od moře", "Bouřka způsobená frontou", "Bouřka bez jakýchkoli srážek"] },
  { question: "Jak funguje větrná elektrárna a co pohání turbínu?", correctAnswer: "Vítr otáčí lopatkami turbíny", options: ["Turbínu pohání slunce přímo", "Vítr otáčí lopatkami turbíny", "Turbínu pohání vodní pára", "Turbínu pohání magnetismus"] },
  { question: "Proč jsou lesy důležité pro kvalitu vzduchu?", correctAnswer: "Pohlcují CO₂ a vyrábějí kyslík", options: ["Lesy produkují CO₂ a pohlcují O₂", "Lesy nemají vliv na složení vzduchu", "Pohlcují CO₂ a vyrábějí kyslík", "Lesy jen čistí vzduch od prachu"] },
  { question: "Co je Coriolisova síla a jak ovlivňuje vítr?", correctAnswer: "Rotace Země stáčí větry", options: ["Reálná síla tvořící tornáda", "Gravitační síla na vzduch", "Síla magnetického pole Země", "Rotace Země stáčí větry"] },
  { question: "Jak se liší troposféra od stratosféry?", correctAnswer: "V troposféře vzniká počasí", options: ["V troposféře vzniká počasí", "Ve stratosféře vzniká počasí", "Troposféra leží nad stratosférou", "Obě mají stejnou teplotu"] },
  { question: "Co je fotochemický smog a kdy vzniká?", correctAnswer: "Vzniká za slunečního záření", options: ["Mlha nad mořem za slunce", "Vzniká za slunečního záření", "Přírodní smog z požárů", "Vzniká kondenzací páry"] },
  { question: "Proč je důležité větrání místností?", correctAnswer: "Sníží CO₂ a přivede kyslík", options: ["Větrání jen ochlazuje místnost", "Větrání odstraňuje dusík", "Sníží CO₂ a přivede kyslík", "Větrání nemá vliv na zdraví"] },
  { question: "Co je depresie a anticyklóna v meteorologii?", correctAnswer: "Depresie = oblast nízkého tlaku (nepříjemné počasí). Anticyklóna = oblast vysokého tlaku – hezké počasí .", options: ["Depresie = bouřka, anticyklóna = bezvětří bez srážek.", "Depresie = vysoký tlak, anticyklóna = nízký tlak.", "Jsou to totéž — jen různé názvy.", "Depresie = oblast nízkého tlaku (nepříjemné počasí). Anticyklóna = oblast vysokého tlaku – hezké počasí ."] },
  { question: "Jaká je funkce ozónové vrstvy pro život na Zemi?", correctAnswer: "Pohlcuje škodlivé UV záření", options: ["Pohlcuje škodlivé UV záření", "Zadržuje kyslík v troposféře", "Vyrábí kyslík pro dýchání", "Brání úniku dusíku z atmosféry"] },
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
