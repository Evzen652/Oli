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
  { question: "Jaký plyn vydechujeme při dýchání?", correctAnswer: "Oxid uhličitý – CO₂", options: ["Kyslík – O₂", "Dusík – N₂", "Oxid uhličitý – CO₂", "Vodní pára"] },
  { question: "Jakou barvu má vzduch?", correctAnswer: "Je bezbarvý", options: ["Je bezbarvý", "Modrá", "Bílá", "Šedá"] },
  { question: "Jaký je nejhojnější plyn ve vzduchu?", correctAnswer: "Dusík – N₂, cca 78 %", options: ["Dusík – N₂, cca 78 %", "Kyslík – O₂", "Oxid uhličitý – CO₂", "Argon – Ar"] },
  { question: "Kolik procent kyslíku přibližně obsahuje vzduch?", correctAnswer: "Cca 21 %", options: ["Cca 21 %", "Cca 78 %", "Cca 1 %", "Cca 50 %"] },
  { question: "Co je vítr?", correctAnswer: "Pohyb vzduchu", options: ["Pohyb vzduchu", "Teplý vzduch stoupající nahoru", "Pohyb vody v ovzduší", "Elektrický výboj v oblacích"] },
  { question: "Jaký přístroj měří tlak vzduchu?", correctAnswer: "Barometr", options: ["Barometr", "Teploměr", "Vlhkoměr", "Rychloměr"] },
  { question: "Bez čeho nelze zapálit oheň?", correctAnswer: "Bez kyslíku", options: ["Bez kyslíku", "Bez dusíku", "Bez CO₂", "Bez argonu"] },
  { question: "Jaký plyn využívají rostliny při fotosyntéze?", correctAnswer: "Oxid uhličitý – CO₂", options: ["Oxid uhličitý – CO₂", "Kyslík – O₂", "Dusík – N₂", "Argon – Ar"] },
  { question: "Má vzduch vůni?", correctAnswer: "Ne, čistý vzduch je bez zápachu", options: ["Ne, čistý vzduch je bez zápachu", "Ano, voní po kyslíku", "Ano, voní po dusíku", "Jen vlhký vzduch má vůni"] },
  { question: "Lze vzduch stlačit (zmáčknout)?", correctAnswer: "Ano, vzduch je stlačitelný", options: ["Ano, vzduch je stlačitelný", "Ne, vzduch nelze stlačit", "Jen při teplotě nad 100 °C", "Jen kyslík lze stlačit"] },
  { question: "Co způsobuje skleníkový efekt?", correctAnswer: "Oxid uhličitý a další plyny", options: ["Kyslík obsažený v atmosféře", "Oxid uhličitý a další plyny", "Dusík obsažený ve vzduchu", "Argon obsažený ve vzduchu"] },
  { question: "Jaká je přibližná hodnota tlaku vzduchu u moře?", correctAnswer: "Cca 1013 hPa", options: ["Cca 1013 hPa", "Cca 100 hPa", "Cca 5000 hPa", "Cca 500 hPa"] },
  { question: "Co je atmosféra?", correctAnswer: "Vzduchový obal Země", options: ["Vzduchový obal Země", "Vrstva vody na Zemi", "Skleníkový plyn", "Druh větru"] },
  { question: "Šíří se zvuk ve vakuu (bez vzduchu)?", correctAnswer: "Ne, zvuk potřebuje prostředí", options: ["Ano, zvuk se šíří i ve vakuu", "Ne, zvuk potřebuje prostředí", "Jen ve vakuu se šíří zvuk", "Zvuk se šíří jen vodou"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jaký je přibližný obsah dusíku ve vzduchu?", correctAnswer: "Cca 78 %", options: ["Cca 78 %", "Cca 21 %", "Cca 50 %", "Cca 1 %"] },
  { question: "Proč dusík neumožňuje dýchání ani hoření?", correctAnswer: "Nereaguje s jinými látkami", options: ["Je příliš lehký na dýchání", "Nereaguje s jinými látkami", "Přeměňuje se na oxid uhličitý", "Je jedovatý pro organismy"] },
  { question: "Jak argon přispívá ke složení vzduchu?", correctAnswer: "Tvoří asi 1 % a nereaguje", options: ["Způsobuje hoření látek", "Tvoří asi 1 % a nereaguje", "Tvoří 21 % vzduchu", "Je škodlivý pro zdraví"] },
  { question: "Co je inverze (teplotní inverze) vzduchu?", correctAnswer: "Studený vzduch je u země", options: ["Prudký vítr v horách", "Studený vzduch je u země", "Způsob stlačení vzduchu", "Pohyb vzduchu od jihu"] },
  { question: "Jak vzduch přenáší teplo?", correctAnswer: "Prouděním, teplý vzduch stoupá", options: ["Vedením skrze molekuly", "Prouděním, teplý vzduch stoupá", "Tepelnými vlnami zdola", "Vzduch teplo nepřenáší"] },
  { question: "Kde je tlak vzduchu nižší — v horách nebo u moře?", correctAnswer: "V horách — méně vzduchu nad námi", options: ["V horách — méně vzduchu nad námi", "U moře — kvůli vlhkosti", "Tlak vzduchu je všude stejný", "V horách jen v létě"] },
  { question: "Co je smog?", correctAnswer: "Znečištěný vzduch s mlhou", options: ["Zvláštní druh oblaku", "Znečištěný vzduch s mlhou", "Zápach od moře", "Velmi silný vítr"] },
  { question: "Co se stane se svíčkou v uzavřeném prostoru bez přístupu kyslíku?", correctAnswer: "Zhasne — bez kyslíku nemůže hořet", options: ["Zhasne — bez kyslíku nemůže hořet", "Hoří dále, vzduch nepotřebuje", "Hoří jasněji", "Přemění se na CO₂"] },
  { question: "Co je kyselý déšť a čím ho způsobuje?", correctAnswer: "Déšť s kyselinami ze znečištění", options: ["Déšť z moře s mořskou solí", "Déšť s kyselinami ze znečištění", "Přirozený jev bez škod", "Déšť při silné bouřce"] },
  { question: "Co tvoří vrstvu ozonu v atmosféře?", correctAnswer: "Ozon – O₃ — chrání Zemi před UV zářením", options: ["Ozon – O₃ — chrání Zemi před UV zářením", "Kyslík – O₂ ve velké výšce", "Dusík a argon", "Vodní pára"] },
  { question: "Proč se s nadmořskou výškou mění obsah kyslíku?", correctAnswer: "Nahoře je nižší tlak", options: ["Kyslík stoupá do výšky", "Nahoře je nižší tlak", "Obsah kyslíku se nemění", "Klesá jen oxid uhličitý"] },
  { question: "Jak rostliny přispívají k obsahu kyslíku ve vzduchu?", correctAnswer: "Fotosyntézou — přijímají CO₂ a uvolňují O₂", options: ["Fotosyntézou — přijímají CO₂ a uvolňují O₂", "Dýcháním vydávají O₂ i CO₂", "Nemají vliv na obsah kyslíku", "Absorbují O₂ a uvolňují N₂"] },
  { question: "Co je anemometr?", correctAnswer: "Přístroj měřící rychlost větru", options: ["Přístroj měřící rychlost větru", "Přístroj měřící tlak vzduchu", "Přístroj měřící vlhkost vzduchu", "Přístroj měřící teplotu vzduchu"] },
  { question: "Co způsobuje vítr?", correctAnswer: "Rozdíly v tlaku vzduchu", options: ["Otáčení Země kolem osy", "Rozdíly v tlaku vzduchu", "Pohyb Měsíce kolem Země", "Změna teploty vody v mořích"] },
  { question: "Proč se vzduch zahřívá blíže k zemskému povrchu?", correctAnswer: "Povrch Země pohltí sluneční záření a zahřeje přiléhající vzduch", options: ["Povrch Země pohltí sluneční záření a zahřeje přiléhající vzduch", "Vzduch sám zachytává sluneční záření", "Vzduch se zahřívá od hor", "Teplo pochází ze Slunce přímo"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jak přispívá dusík v atmosféře k ochraně živých organismů?", correctAnswer: "Ředí kyslík na bezpečnou koncentraci a brání spontánnímu hoření", options: ["Ředí kyslík na bezpečnou koncentraci a brání spontánnímu hoření", "Dusík životy chrání přímo toxicitou", "Dusík nemá ochrannou funkci", "Dusík absorbuje UV záření"] },
  { question: "Vysvětli skleníkový efekt a jeho přirozený x zesilovaný charakter.", correctAnswer: "Přirozený: CO₂ a H₂O zadržují teplo – nutné pro život . Zesilovaný: nadbytek CO₂ z fosilních paliv otepluje Zemi.", options: ["Přirozený: CO₂ a H₂O zadržují teplo – nutné pro život . Zesilovaný: nadbytek CO₂ z fosilních paliv otepluje Zemi.", "Skleníkový efekt je jen umělý fenomén bez přirozené příčiny.", "Přirozený skleníkový efekt Zemi ochlazuje, zesilovaný otepluje.", "Skleníkový efekt způsobuje jen dusík."] },
  { question: "Jak ovlivňuje znečištění vzduchu zdraví člověka?", correctAnswer: "Dýchací potíže a nemoci plic", options: ["Nemá dokázaný vliv na zdraví", "Dýchací potíže a nemoci plic", "Ovlivňuje jen pokožku", "Způsobuje pouze alergii"] },
  { question: "Co je proudění vzduchu (cirkulace atmosféry) a co ho způsobuje?", correctAnswer: "Vzduch žene nerovnoměrný ohřev", options: ["Rotace Země bez vlivu Slunce", "Vzduch žene nerovnoměrný ohřev", "Přitahování vzduchu Měsícem", "Pohyb mořských proudů"] },
  { question: "Jak se liší složení vydechovaného vzduchu od vdechovaného?", correctAnswer: "Vydechovaný: více CO₂ (~4 %), méně O₂ – ~17 % , stejně N₂", options: ["Vydechovaný: více CO₂ (~4 %), méně O₂ – ~17 % , stejně N₂", "Vydechovaný: méně CO₂, více O₂", "Vydechovaný: žádný dusík, jen CO₂", "Vydechovaný vzduch je identický s vdechovaným"] },
  { question: "Co je atmosférický tlak a proč je důležitý pro meteorologii?", correctAnswer: "Vysoký tlak přináší hezké počasí", options: ["Nízký tlak přináší hezké počasí", "Vysoký tlak přináší hezké počasí", "Tlak nemá vliv na počasí", "Tlak měříme jen v horách"] },
  { question: "Co je konvekční bouřka a jak vzniká?", correctAnswer: "Vzniká vzestupem teplého vzduchu", options: ["Bouřka přicházející od moře", "Vzniká vzestupem teplého vzduchu", "Bouřka způsobená frontou", "Bouřka bez jakýchkoli srážek"] },
  { question: "Jak funguje větrná elektrárna a co pohání turbínu?", correctAnswer: "Vítr otáčí lopatkami turbíny", options: ["Turbínu pohání slunce přímo", "Vítr otáčí lopatkami turbíny", "Turbínu pohání vodní pára", "Turbínu pohání magnetismus"] },
  { question: "Proč jsou lesy důležité pro kvalitu vzduchu?", correctAnswer: "Pohlcují CO₂ a vyrábějí kyslík", options: ["Lesy produkují CO₂ a pohlcují O₂", "Pohlcují CO₂ a vyrábějí kyslík", "Lesy nemají vliv na složení vzduchu", "Lesy jen čistí vzduch od prachu"] },
  { question: "Co je Coriolisova síla a jak ovlivňuje vítr?", correctAnswer: "Rotace Země stáčí větry", options: ["Reálná síla tvořící tornáda", "Rotace Země stáčí větry", "Gravitační síla na vzduch", "Síla magnetického pole Země"] },
  { question: "Jak se liší troposféra od stratosféry?", correctAnswer: "V troposféře vzniká počasí", options: ["Ve stratosféře vzniká počasí", "V troposféře vzniká počasí", "Troposféra leží nad stratosférou", "Obě mají stejnou teplotu"] },
  { question: "Co je fotochemický smog a kdy vzniká?", correctAnswer: "Vzniká za slunečního záření", options: ["Mlha nad mořem za slunce", "Vzniká za slunečního záření", "Přírodní smog z požárů", "Vzniká kondenzací páry"] },
  { question: "Proč je důležité větrání místností?", correctAnswer: "Sníží CO₂ a přivede kyslík", options: ["Větrání jen ochlazuje místnost", "Sníží CO₂ a přivede kyslík", "Větrání odstraňuje dusík", "Větrání nemá vliv na zdraví"] },
  { question: "Co je depresie a anticyklóna v meteorologii?", correctAnswer: "Depresie = oblast nízkého tlaku (nepříjemné počasí). Anticyklóna = oblast vysokého tlaku – hezké počasí .", options: ["Depresie = oblast nízkého tlaku (nepříjemné počasí). Anticyklóna = oblast vysokého tlaku – hezké počasí .", "Depresie = bouřka, anticyklóna = bezvětří bez srážek.", "Depresie = vysoký tlak, anticyklóna = nízký tlak.", "Jsou to totéž — jen různé názvy."] },
  { question: "Jaká je funkce ozónové vrstvy pro život na Zemi?", correctAnswer: "Pohlcuje škodlivé UV záření", options: ["Zadržuje kyslík v troposféře", "Pohlcuje škodlivé UV záření", "Vyrábí kyslík pro dýchání", "Brání úniku dusíku z atmosféry"] },
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
