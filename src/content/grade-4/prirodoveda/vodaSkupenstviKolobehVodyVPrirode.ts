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
  { question: "Ve kterém skupenství je voda, když teče z kohoutku?", correctAnswer: "Kapalné", options: ["Pevné", "Kapalné", "Plynné", "Žádném"] },
  { question: "Jak se nazývá pevné skupenství vody?", correctAnswer: "Led", options: ["Led", "Pára", "Rosa", "Oblak"] },
  { question: "Na kolik stupňů Celsia taje led?", correctAnswer: "0 °C", options: ["0 °C", "10 °C", "100 °C", "-10 °C"] },
  { question: "Na kolik stupňů Celsia vaří voda?", correctAnswer: "100 °C", options: ["50 °C", "80 °C", "100 °C", "120 °C"] },
  { question: "Jak se nazývá plynné skupenství vody?", correctAnswer: "Vodní pára", options: ["Vodní pára", "Led", "Déšť", "Rosa"] },
  { question: "Přechod vody z kapalného skupenství na pevné se nazývá:", correctAnswer: "Tuhnutí", options: ["Tání", "Tuhnutí", "Var", "Kondenzace"] },
  { question: "Přechod vody z pevného skupenství na kapalné se nazývá:", correctAnswer: "Tání", options: ["Tání", "Tuhnutí", "Var", "Sublimace"] },
  { question: "Co pohání koloběh vody v přírodě?", correctAnswer: "Slunce", options: ["Slunce", "Vítr", "Gravitace", "Měsíc"] },
  { question: "Jak se nazývá srážka, která padá v zimě?", correctAnswer: "Sníh", options: ["Déšť", "Sníh", "Rosa", "Kroupy"] },
  { question: "Kde se voda shromažďuje po dešti a taje sněhu?", correctAnswer: "V řekách a spodní vodě", options: ["V řekách a spodní vodě", "V oblacích", "V ledu", "Ve sněhu"] },
  { question: "Jakou barvu má čistá voda?", correctAnswer: "Je bezbarvá", options: ["Je bezbarvá", "Modrá", "Průhledná s nádechem zelené", "Bílá"] },
  { question: "Jakou chuť má čistá voda?", correctAnswer: "Nemá chuť", options: ["Slanou", "Sladkou", "Nemá chuť", "Kyselou"] },
  { question: "Co je rosa?", correctAnswer: "Kapky vody na trávě ráno", options: ["Kapky vody na trávě ráno", "Malý dešťový mrak", "Druh sněhu", "Typ ledu"] },
  { question: "Jak se nazývá přechod vody z kapalného skupenství na plynné při zahřátí?", correctAnswer: "Var (odpařování)", options: ["Var (odpařování)", "Kondenzace", "Tuhnutí", "Sublimace"] },
  { question: "Co jsou kroupy?", correctAnswer: "Pevné kuličky ledu padající z nebe", options: ["Pevné kuličky ledu padající z nebe", "Druh deště", "Hustá mlha", "Jiná forma sněhu"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se nazývá přechod vodní páry zpět na kapalnou vodu?", correctAnswer: "Kondenzace", options: ["Kondenzace", "Sublimace", "Tání", "Var"] },
  { question: "Jak se nazývá přechod ledu přímo na vodní páru (bez mezistádia)?", correctAnswer: "Sublimace", options: ["Sublimace", "Kondenzace", "Tání", "Vypařování"] },
  { question: "Jak rostliny přispívají ke koloběhu vody?", correctAnswer: "Transpirací — vydávají vodní páru", options: ["Transpirací — vydávají vodní páru", "Absorbují veškerou vodu", "Vyrábí vodu fotosyntézou", "Zadržují vodu navždy"] },
  { question: "Proč led plave na vodě?", correctAnswer: "Protože led je lehčí (méně hustý) než kapalná voda", options: ["Protože led je lehčí (méně hustý) než kapalná voda", "Protože led je těžší než voda", "Led na vodě nepluje", "Protože voda je plynná"] },
  { question: "Jak se nazývají zmrzlé krystalky vody na trávě a větvích?", correctAnswer: "Jinovatka", options: ["Jinovatka", "Kroupy", "Sníh", "Námraza"] },
  { question: "V jaké části koloběhu vody vznikají oblaka?", correctAnswer: "Při kondenzaci vodní páry ve výšce", options: ["Při kondenzaci vodní páry ve výšce", "Při tání ledu", "Při srážkách", "Při odpařování z oblak"] },
  { question: "Co je výpar (evaporace)?", correctAnswer: "Přechod kapalné vody na vodní páru ohřátím Sluncem", options: ["Přechod kapalné vody na vodní páru ohřátím Sluncem", "Pád deště", "Tání sněhu", "Vznik ledu"] },
  { question: "Kde vzniká spodní voda?", correctAnswer: "Zasakováním dešťové vody do půdy", options: ["Zasakováním dešťové vody do půdy", "V oblacích", "Ve větvích stromů", "Vyvěrá ze Slunce"] },
  { question: "Jakou vlastnost má voda jako rozpouštědlo?", correctAnswer: "Je nejlepším přírodním rozpouštědlem", options: ["Je nejlepším přírodním rozpouštědlem", "Nic nerozpouští", "Rozpouští jen sůl", "Rozpouští jen cukr"] },
  { question: "Co se stane s vodou, když ji ochladíme pod 0 °C?", correctAnswer: "Zmrzne na led", options: ["Zmrzne na led", "Vypaří se", "Zůstane kapalná", "Stane se plynnou"] },
  { question: "Jak se nazývá voda, která teče z pramenů a studánek?", correctAnswer: "Podzemní (spodní) voda", options: ["Podzemní (spodní) voda", "Destilovaná voda", "Mořská voda", "Dešťová voda"] },
  { question: "Při jaké teplotě kondenzuje vodní pára?", correctAnswer: "Pod 100 °C (při ochlazení)", options: ["Pod 100 °C (při ochlazení)", "Přesně při 100 °C", "Nad 100 °C", "Pouze při 0 °C"] },
  { question: "Co je mlha?", correctAnswer: "Oblak u zemského povrchu — kapičky vody ve vzduchu", options: ["Oblak u zemského povrchu — kapičky vody ve vzduchu", "Zmrzlá voda", "Vodní pára pod zemí", "Druh deště"] },
  { question: "Jaký je koloběh vody — první krok po výparu?", correctAnswer: "Vodní pára stoupá do výšky a kondenzuje v oblaka", options: ["Vodní pára stoupá do výšky a kondenzuje v oblaka", "Voda hned prší zpět", "Voda se tuhne na led", "Voda zmizí z přírody"] },
  { question: "Co tvoří tvrdou část sněhové vločky?", correctAnswer: "Ledové krystalky v šestibokém vzoru", options: ["Ledové krystalky v šestibokém vzoru", "Zmrzlé kapičky deště", "Vodní pára stlačená mrazem", "Kousky krupobití"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Vysvětli anomálii vody: co se stane s hustotou vody při zmrznutí?", correctAnswer: "Hustota klesne — led je lehčí než voda, proto plave", options: ["Hustota klesne — led je lehčí než voda, proto plave", "Hustota stoupne — led je těžší", "Hustota zůstane stejná", "Hustota se mění jen u slané vody"] },
  { question: "Jaký je ekologický význam anomálie, že led plave na vodě?", correctAnswer: "Vodní organismy přežijí zimu pod ledem v kapalné vodě", options: ["Vodní organismy přežijí zimu pod ledem v kapalné vodě", "Led chrání dno rybníka před sluncem", "Pomáhá rostlinám růst rychleji", "Urychluje koloběh vody"] },
  { question: "V jakém pořadí probíhají fáze koloběhu vody od výparu?", correctAnswer: "Výpar → kondenzace → srážky → odtok → výpar", options: ["Výpar → kondenzace → srážky → odtok → výpar", "Srážky → výpar → kondenzace → odtok", "Kondenzace → výpar → srážky → tání", "Odtok → srážky → výpar → kondenzace"] },
  { question: "Co je transpirační proud u rostlin?", correctAnswer: "Pohyb vody z kořenů přes stonek do listů, kde se odpaří průduchy", options: ["Pohyb vody z kořenů přes stonek do listů, kde se odpaří průduchy", "Příjem vody kořeny bez pohybu", "Fotosyntéza s využitím vody", "Výměna plynů bez vody"] },
  { question: "Jak dlouho trvá přibližně jeden koloběh vody od výparu do deště?", correctAnswer: "Dny až týdny (záleží na podmínkách)", options: ["Dny až týdny (záleží na podmínkách)", "Přesně 24 hodin", "1 rok přesně", "1 hodinu"] },
  { question: "Co způsobuje vznik rosy na trávě v noci?", correctAnswer: "Ochlazení povrchu pod rosný bod — vodní pára kondenzuje", options: ["Ochlazení povrchu pod rosný bod — vodní pára kondenzuje", "Drobný déšť v noci", "Voda vytékající z půdy", "Tání ranního sněhu"] },
  { question: "Proč je voda výjimečná jako rozpouštědlo?", correctAnswer: "Díky polárním vazbám molekuly H₂O může obklopit a oddělovat ionty", options: ["Díky polárním vazbám molekuly H₂O může obklopit a oddělovat ionty", "Protože je kapalná při pokojové teplotě", "Protože je bezbarvá", "Protože nemá vůni"] },
  { question: "Jaký vliv má lesní pokryv na koloběh vody?", correctAnswer: "Les zvyšuje transpirace a zadržuje vodu v půdě — zpomaluje odtok", options: ["Les zvyšuje transpirace a zadržuje vodu v půdě — zpomaluje odtok", "Les urychluje odtok vody", "Les nemá vliv na koloběh vody", "Les zvyšuje výpar jen v létě"] },
  { question: "Co jsou ledovce a jak přispívají ke koloběhu vody?", correctAnswer: "Zásobárny pevné vody, tají a přispívají ke spodní vodě i mořím", options: ["Zásobárny pevné vody, tají a přispívají ke spodní vodě i mořím", "Pevné oblaky na zemi", "Voda bez skupenství", "Zásobárny plynu"] },
  { question: "Jaký je rozdíl mezi rosou a jinovatkou?", correctAnswer: "Rosa vzniká kondenzací kapalné vody, jinovatka sublimací (přímo zmrzlé krystalky)", options: ["Rosa vzniká kondenzací kapalné vody, jinovatka sublimací (přímo zmrzlé krystalky)", "Jinovatka je jen hustší rosa", "Rosa je zimní, jinovatka letní", "Žádný rozdíl — jsou to synonyma"] },
  { question: "Co je povodí řeky?", correctAnswer: "Oblast, ze které řeka sbírá srážkovou a spodní vodu", options: ["Oblast, ze které řeka sbírá srážkovou a spodní vodu", "Přehruda na řece", "Místo, kde řeka ústí do moře", "Oblast záplav řeky"] },
  { question: "Proč jsou mokřady důležité pro koloběh vody?", correctAnswer: "Zadržují vodu, zpomalují odtok a přispívají k čištění vody", options: ["Zadržují vodu, zpomalují odtok a přispívají k čištění vody", "Zrychlují odpařování vody", "Překážejí koloběhu vody", "Nemají žádný vliv"] },
  { question: "Jak se přechod vody při sublimaci liší od tání?", correctAnswer: "Sublimace: led přechází přímo na páru bez fáze kapaliny", options: ["Sublimace: led přechází přímo na páru bez fáze kapaliny", "Sublimace je pomalejší forma tání", "Tání probíhá jen v zimě, sublimace jen v létě", "Sublimace vyžaduje vyšší teplotu než var"] },
  { question: "Co je hydrologický cyklus?", correctAnswer: "Vědecký název pro koloběh vody v přírodě", options: ["Vědecký název pro koloběh vody v přírodě", "Pohyb vody v těle člověka", "Čistění vody v čistírně", "Systém přehrad a kanálů"] },
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
    boundaries: ["Molekulární struktura vody (H₂O vzorec není náplní 4. ročníku)"],
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
