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
  { question: "Ve kterém skupenství je voda, když teče z kohoutku?", correctAnswer: "Kapalné", options: ["Kapalné", "Pevné", "Plynné", "Žádném"] },
  { question: "Jak se nazývá pevné skupenství vody?", correctAnswer: "Led", options: ["Pára", "Led", "Rosa", "Oblak"] },
  { question: "Na kolik stupňů Celsia taje led?", correctAnswer: "0 °C", options: ["10 °C", "100 °C", "0 °C", "-10 °C"] },
  { question: "Na kolik stupňů Celsia vaří voda?", correctAnswer: "100 °C", options: ["50 °C", "80 °C", "120 °C", "100 °C"] },
  { question: "Jak se nazývá plynné skupenství vody?", correctAnswer: "Vodní pára", options: ["Vodní pára", "Led", "Déšť", "Rosa"] },
  { question: "Přechod vody z kapalného skupenství na pevné se nazývá:", correctAnswer: "Tuhnutí", options: ["Tání", "Tuhnutí", "Var", "Kondenzace"] },
  { question: "Přechod vody z pevného skupenství na kapalné se nazývá:", correctAnswer: "Tání", options: ["Tuhnutí", "Var", "Tání", "Sublimace"] },
  { question: "Co pohání koloběh vody v přírodě?", correctAnswer: "Slunce", options: ["Vítr", "Gravitace", "Měsíc", "Slunce"] },
  { question: "Jak se nazývá srážka, která padá v zimě?", correctAnswer: "Sníh", options: ["Sníh", "Déšť", "Rosa", "Kroupy"] },
  { question: "Kde se voda shromažďuje po dešti a tání sněhu?", correctAnswer: "V řekách a spodní vodě", options: ["V oblacích nad krajinou", "V řekách a spodní vodě", "V ledu na horských vrcholech", "Ve sněhu na střechách"] },
  { question: "Jakou barvu má čistá voda?", correctAnswer: "Je bezbarvá", options: ["Modrá", "Průhledná s nádechem zelené", "Je bezbarvá", "Bílá"] },
  { question: "Jakou chuť má čistá voda?", correctAnswer: "Nemá chuť", options: ["Slanou", "Sladkou", "Kyselou", "Nemá chuť"] },
  { question: "Co je rosa?", correctAnswer: "Kapky vody na trávě ráno", options: ["Kapky vody na trávě ráno", "Malý dešťový mrak", "Druh sněhu", "Typ ledu"] },
  { question: "Jak se nazývá přechod vody z kapalného skupenství na plynné při zahřátí?", correctAnswer: "Var – odpařování", options: ["Kondenzace", "Var – odpařování", "Tuhnutí", "Sublimace"] },
  { question: "Co jsou kroupy?", correctAnswer: "Kuličky ledu padající z mraků", options: ["Druh hustého deště", "Zmrzlá hustá mlha", "Kuličky ledu padající z mraků", "Jiná forma sněhových vloček"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se nazývá přechod vodní páry zpět na kapalnou vodu?", correctAnswer: "Kondenzace", options: ["Sublimace", "Tání", "Var", "Kondenzace"] },
  { question: "Jak se nazývá přechod ledu přímo na vodní páru (bez mezistádia)?", correctAnswer: "Sublimace", options: ["Sublimace", "Kondenzace", "Tání", "Vypařování"] },
  { question: "Jak rostliny přispívají ke koloběhu vody?", correctAnswer: "Transpirací — vydávají vodní páru", options: ["Absorbují veškerou vodu", "Transpirací — vydávají vodní páru", "Vyrábí vodu fotosyntézou", "Zadržují vodu navždy"] },
  { question: "Proč led plave na vodě?", correctAnswer: "Protože led je lehčí – méně hustý než kapalná voda", options: ["Protože led je těžší než voda", "Led na vodě nepluje", "Protože led je lehčí – méně hustý než kapalná voda", "Protože voda je plynná"] },
  { question: "Jak se nazývají zmrzlé krystalky vody na trávě a větvích?", correctAnswer: "Jinovatka", options: ["Kroupy", "Sníh", "Námraza", "Jinovatka"] },
  { question: "V jaké části koloběhu vody vznikají oblaka?", correctAnswer: "Při kondenzaci vodní páry ve výšce", options: ["Při kondenzaci vodní páry ve výšce", "Při tání ledu", "Při srážkách", "Při odpařování z oblak"] },
  { question: "Co je výpar?", correctAnswer: "Voda se ohřeje a změní v páru", options: ["Pád dešťových kapek", "Voda se ohřeje a změní v páru", "Tání sněhu na jaře", "Vznik ledu v mrazu"] },
  { question: "Kde vzniká spodní voda?", correctAnswer: "Zasakováním dešťové vody do půdy", options: ["V oblacích", "Ve větvích stromů", "Zasakováním dešťové vody do půdy", "Vyvěrá ze Slunce"] },
  { question: "Jakou vlastnost má voda jako rozpouštědlo?", correctAnswer: "Rozpouští nejvíc látek v přírodě", options: ["Nerozpouští vůbec nic", "Rozpouští jenom sůl", "Rozpouští jenom cukr", "Rozpouští nejvíc látek v přírodě"] },
  { question: "Co se stane s vodou, když ji ochladíme pod 0 °C?", correctAnswer: "Zmrzne na led", options: ["Zmrzne na led", "Vypaří se", "Zůstane kapalná", "Stane se plynnou"] },
  { question: "Jak se nazývá voda, která teče z pramenů a studánek?", correctAnswer: "Podzemní – spodní voda", options: ["Destilovaná voda", "Podzemní – spodní voda", "Mořská voda", "Dešťová voda"] },
  { question: "Při jaké teplotě kondenzuje vodní pára?", correctAnswer: "Pod 100 °C – při ochlazení", options: ["Přesně při 100 °C", "Nad 100 °C", "Pod 100 °C – při ochlazení", "Pouze při 0 °C"] },
  { question: "Co je mlha?", correctAnswer: "Oblak u zemského povrchu", options: ["Zmrzlá voda na zemi", "Vodní pára pod zemí", "Druh velmi jemného deště", "Oblak u zemského povrchu"] },
  { question: "Co se s vodou stane hned po výparu?", correctAnswer: "Pára stoupá a mění se v oblaka", options: ["Pára stoupá a mění se v oblaka", "Voda hned prší zpátky", "Voda tuhne rovnou na led", "Voda z přírody úplně zmizí"] },
  { question: "Co tvoří tvrdou část sněhové vločky?", correctAnswer: "Ledové krystalky v šestibokém vzoru", options: ["Zmrzlé kapičky deště", "Ledové krystalky v šestibokém vzoru", "Vodní pára stlačená mrazem", "Kousky krupobití"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Vysvětli anomálii vody: co se stane s hustotou vody při zmrznutí?", correctAnswer: "Hustota klesne — led je lehčí než voda, proto plave", options: ["Hustota stoupne — led je těžší", "Hustota zůstane stejná", "Hustota klesne — led je lehčí než voda, proto plave", "Hustota se mění jen u slané vody"] },
  { question: "Jaký je ekologický význam anomálie, že led plave na vodě?", correctAnswer: "Vodní organismy přežijí zimu pod ledem v kapalné vodě", options: ["Led chrání dno rybníka před sluncem", "Pomáhá rostlinám růst rychleji", "Urychluje koloběh vody", "Vodní organismy přežijí zimu pod ledem v kapalné vodě"] },
  { question: "V jakém pořadí probíhají fáze koloběhu vody od výparu?", correctAnswer: "Výpar, kondenzace, srážky, odtok, výpar", options: ["Výpar, kondenzace, srážky, odtok, výpar", "Srážky, výpar, kondenzace, odtok", "Kondenzace, výpar, srážky, tání", "Odtok, srážky, výpar, kondenzace"] },
  { question: "Jak putuje voda v rostlině?", correctAnswer: "Od kořenů do listů, tam se odpaří", options: ["Kořeny ji přijmou a zůstane v nich", "Od kořenů do listů, tam se odpaří", "Vzniká v listech a jde do kořenů", "Rostlina vodu vůbec nepřijímá"] },
  { question: "Jak dlouho trvá jeden koloběh vody?", correctAnswer: "Dny až týdny podle počasí", options: ["Přesně dvacet čtyři hodin", "Přesně jeden celý rok", "Dny až týdny podle počasí", "Přesně jednu hodinu"] },
  { question: "Co způsobuje vznik rosy na trávě v noci?", correctAnswer: "Chladný povrch srazí vodní páru", options: ["Drobný déšť padající v noci", "Voda vytékající z půdy", "Tání ranního sněhu", "Chladný povrch srazí vodní páru"] },
  { question: "Proč je dešťová voda čistší než voda v potoce?", correctAnswer: "Vznikla výparem — rozpuštěné látky při odpařování zůstaly dole", options: ["Vznikla výparem — rozpuštěné látky při odpařování zůstaly dole", "Prošla oblaky, které ji jako síto přefiltrovaly", "Je studenější, a proto se v ní nic nerozpustí", "Voda v potoce je starší, a proto se zkazila"] },
  { question: "Jaký vliv má les na koloběh vody?", correctAnswer: "Zadržuje vodu a zpomaluje odtok", options: ["Urychluje odtok vody z krajiny", "Zadržuje vodu a zpomaluje odtok", "Nemá na koloběh vody vliv", "Zvyšuje výpar jenom v létě"] },
  { question: "Co jsou ledovce a jak přispívají ke koloběhu vody?", correctAnswer: "Zásobárny pevné vody, které tají", options: ["Pevné oblaky ležící na zemi", "Voda bez skupenství", "Zásobárny pevné vody, které tají", "Zásobárny plynu v horách"] },
  { question: "Jaký je rozdíl mezi rosou a jinovatkou?", correctAnswer: "Rosa je z kapek, jinovatka z ledu", options: ["Jinovatka je jen hustší rosa", "Rosa je zimní, jinovatka letní", "Žádný rozdíl, jsou to synonyma", "Rosa je z kapek, jinovatka z ledu"] },
  { question: "Co je povodí řeky?", correctAnswer: "Oblast, ze které řeka sbírá srážkovou a spodní vodu", options: ["Oblast, ze které řeka sbírá srážkovou a spodní vodu", "Přehruda na řece", "Místo, kde řeka ústí do moře", "Oblast záplav řeky"] },
  { question: "Proč jsou mokřady důležité pro koloběh vody?", correctAnswer: "Zadržují vodu a čistí ji", options: ["Zrychlují odpařování vody", "Zadržují vodu a čistí ji", "Překážejí koloběhu vody", "Nemají na vodu žádný vliv"] },
  { question: "Jak se přechod vody při sublimaci liší od tání?", correctAnswer: "Sublimace: led přechází přímo na páru bez fáze kapaliny", options: ["Sublimace je pomalejší forma tání", "Tání probíhá jen v zimě, sublimace jen v létě", "Sublimace: led přechází přímo na páru bez fáze kapaliny", "Sublimace vyžaduje vyšší teplotu než var"] },
  { question: "Co je hydrologický cyklus?", correctAnswer: "Vědecký název pro koloběh vody v přírodě", options: ["Pohyb vody v těle člověka", "Čistění vody v čistírně", "Systém přehrad a kanálů", "Vědecký název pro koloběh vody v přírodě"] },
  { question: "Jak se nazývá místo, kde řeka pramení?", correctAnswer: "Pramen", options: ["Pramen", "Přítok", "Ústí", "Rybník"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 40);
}

export const VODASKUPENSTVIKOLOBEHVODYVPRIRODE: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-voda-skupenstvi-kolobeh-vody-v-prirode",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-voda-skupenstvi-kolobeh-vody-v-prirode",
    title: "Voda - skupenství, koloběh vody v přírodě",
    studentTitle: "Voda a koloběh",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš tři skupenství vody a pochopíš koloběh vody v přírodě.",
    keywords: ["voda", "led", "pára", "koloběh vody", "skupenství", "tání", "var", "kondenzace"],
    goals: [
      "Rozlišit tři skupenství vody a uvést příklady",
      "Popsat přechody mezi skupenstvími s teplotami",
      "Vysvětlit koloběh vody v přírodě",
      "Uvést anomálii vody (led lehčí než voda)",
    ],
    boundaries: [
      "Neprobírá stavbu molekuly vody ani vzorec H₂O — patří na 2. stupeň",
      "Neprobírá rozpouštění na úrovni částic a iontů",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Vzpomeň si: led = pevné, voda = kapalné, pára = plynné skupenství.",
      steps: [
        "1. Přečti otázku a určí, o jakém skupenství jde.",
        "2. Vzpomeň si teploty přechodů: 0 °C (tání/tuhnutí), 100 °C (var).",
        "3. Koloběh: výpar → oblaka → déšť → odtok → výpar.",
      ],
      commonMistake: "Záměna tání a tuhnutí — tání je přechod led→voda, tuhnutí voda→led.",
      example: "Led taje při 0 °C → vzniká kapalná voda. Ohřejeme-li vodu na 100 °C, vaří a vzniká pára.",
    },
  },
];
