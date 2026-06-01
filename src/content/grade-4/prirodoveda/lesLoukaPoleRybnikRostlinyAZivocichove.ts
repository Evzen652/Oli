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
  { question: "Který živočich žije typicky v lese a má parohy?", correctAnswer: "Jelen", options: ["Jelen", "Zajíc", "Vydra", "Kapr"] },
  { question: "Kde žije kapr?", correctAnswer: "V rybníku a řece", options: ["V rybníku a řece", "V lese", "Na louce", "Na poli"] },
  { question: "Která rostlina roste typicky na louce a má žluté květy?", correctAnswer: "Pampeliška", options: ["Pampeliška", "Leknín", "Kopřiva", "Smrk"] },
  { question: "Jak se jmenuje patro lesa, kde rostou stromy?", correctAnswer: "Stromové patro", options: ["Stromové patro", "Keřové patro", "Bylinné patro", "Mechové patro"] },
  { question: "Co je typická ryba pro rybník v ČR?", correctAnswer: "Kapr", options: ["Kapr", "Losos", "Treska", "Sardinka"] },
  { question: "Která rostlina roste ve vodě rybníka a má velké plovoucí listy?", correctAnswer: "Leknín", options: ["Leknín", "Kopretina", "Jetel", "Pampeliška"] },
  { question: "Jaký hmyz sbírá nektar z lučních květů?", correctAnswer: "Čmelák a motýl", options: ["Čmelák a motýl", "Mravenec a brouk", "Moucha a komár", "Šváb a mšice"] },
  { question: "Který živočich dlábe dřevo v lese a hledá larvy?", correctAnswer: "Datel", options: ["Datel", "Sýkorka", "Liška", "Hlemýžď"] },
  { question: "Co je potravní řetězec?", correctAnswer: "Posloupnost organismů, kde každý je potravou dalšího", options: ["Posloupnost organismů, kde každý je potravou dalšího", "Druh lesa s různými rostlinami", "Počet vrstev (pater) lesa", "Způsob, jak rostliny sdílejí živiny"] },
  { question: "Jaká je první složka potravního řetězce?", correctAnswer: "Producent — zelená rostlina (vyrábí organiku fotosyntézou)", options: ["Producent — zelená rostlina (vyrábí organiku fotosyntézou)", "Konzument — bylinožravec", "Konzument — masožravec", "Rozkladač — houba nebo bakterie"] },
  { question: "Jaké zvíře loví myši na poli a hnízdí na stromech?", correctAnswer: "Poštolka", options: ["Poštolka", "Žába", "Vydra", "Zajíc"] },
  { question: "Kde typicky roste rákos?", correctAnswer: "Na břehu rybníka nebo řeky", options: ["Na břehu rybníka nebo řeky", "Uprostřed hustého lesa", "Na vysychajícím poli", "Na kamenitém kopci"] },
  { question: "Jaký živočich loví ryby v řekách a rybnících v ČR?", correctAnswer: "Vydra říční", options: ["Vydra říční", "Liška", "Srnec", "Volavka šedá"] },
  { question: "Co jsou houby v ekosystému?", correctAnswer: "Rozkladači — rozkládají odumřelou organiku", options: ["Rozkladači — rozkládají odumřelou organiku", "Producenti — vyrábí organiku fotosyntézou", "Konzumenti — jedí jiné živočichy", "Parazité — ničí živé organismy"] },
  { question: "Kde žijí žáby?", correctAnswer: "Na rozhraní vody a souše — rybníky, potoky, louky poblíž vody", options: ["Na rozhraní vody a souše — rybníky, potoky, louky poblíž vody", "Jen v hustém lese", "Jen ve vodě celoročně", "Na suchých polích"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Kolik pater má les a jak se jmenují?", correctAnswer: "4 patra: stromové, keřové, bylinné, mechové", options: ["4 patra: stromové, keřové, bylinné, mechové", "3 patra: stromové, keřové, mechové", "5 pater: stromové, keřové, bylinné, mechové, podzemní", "2 patra: stromové a bylinné"] },
  { question: "Jaký je rozdíl mezi bylinožravcem a masožravcem?", correctAnswer: "Bylinožravec jí rostliny, masožravec loví jiné živočichy", options: ["Bylinožravec jí rostliny, masožravec loví jiné živočichy", "Bylinožravec žije v lese, masožravec na louce", "Masožravec jí rostliny, bylinožravec maso", "Oba jsou konzumenti druhého řádu"] },
  { question: "Sestav jednoduchý potravní řetězec louky.", correctAnswer: "Tráva → myš → poštolka (nebo sova)", options: ["Tráva → myš → poštolka (nebo sova)", "Myš → tráva → poštolka", "Poštolka → tráva → myš", "Myš → poštolka → tráva"] },
  { question: "Proč jsou rozkladači (houby, bakterie) nezbytní v ekosystému?", correctAnswer: "Rozkládají odumřelou organiku na minerály, které pak využijí rostliny", options: ["Rozkládají odumřelou organiku na minerály, které pak využijí rostliny", "Produkují kyslík pro ostatní organismy", "Loví nemocné živočichy a udržují populaci", "Chrání půdu před erozí"] },
  { question: "Která ptáci typicky hnízdí v lese (2 příklady)?", correctAnswer: "Sýkorka, datel (nebo sojka, kukačka)", options: ["Sýkorka, datel (nebo sojka, kukačka)", "Čáp, vlaštovka", "Kachna, volavka", "Koroptev, křepelka"] },
  { question: "Co je biotop?", correctAnswer: "Životní prostředí s typickými podmínkami pro určité druhy (les, louka, rybník...)", options: ["Životní prostředí s typickými podmínkami pro určité druhy (les, louka, rybník...)", "Druh rostliny v konkrétním ekosystému", "Způsob přizpůsobení živočicha prostředí", "Vědecký název pro skupinu rostlin"] },
  { question: "Proč je pro rybník důležitý rákos a orobinec?", correctAnswer: "Poskytují úkryt pro živočichy, čistí vodu a zpevňují břehy", options: ["Poskytují úkryt pro živočichy, čistí vodu a zpevňují břehy", "Jen zvyšují hloubku rybníka", "Brání rybám v pohybu", "Rákos nemá pro rybník praktický význam"] },
  { question: "Jaký je rozdíl mezi přirozeným lesem a plantáží?", correctAnswer: "Přirozený les: různé druhy stromů, bohatá biodiverzita. Plantáž: jeden druh stromů, chudá biodiverzita.", options: ["Přirozený les: různé druhy stromů, bohatá biodiverzita. Plantáž: jeden druh stromů, chudá biodiverzita.", "Plantáž je starší než přirozený les.", "V přirozeném lese nejsou žádné stromy.", "Rozdíl je jen v tom, kdo les pěstuje."] },
  { question: "Jak se jmenuje jev, kdy různé druhy žijí vedle sebe a závisí na sobě?", correctAnswer: "Ekosystém (vzájemné vztahy v biotopu)", options: ["Ekosystém (vzájemné vztahy v biotopu)", "Evoluce", "Adaptace", "Koloběh látek"] },
  { question: "Proč jsou louky cenné pro hmyz, zejména opylovače?", correctAnswer: "Nabízejí bohatou nabídku rozmanitých kvetoucích rostlin po celé léto", options: ["Nabízejí bohatou nabídku rozmanitých kvetoucích rostlin po celé léto", "Louky jsou jediným místem, kde motýli přezimují", "Louky nemají pro hmyz zvláštní význam", "Na louce je méně hmyzu než v lese"] },
  { question: "Co jsou škůdci pole a jak se s nimi bojuje?", correctAnswer: "Mšice, plevel, hlodavci — biologicky (predátoři), chemicky (pesticidie), agrotechnicky", options: ["Mšice, plevel, hlodavci — biologicky (predátoři), chemicky (pesticidie), agrotechnicky", "Jen mšice — léčí se hnojením", "Všechen hmyz na poli je škůdce", "Plevel se nevyskytuje na moderních polích"] },
  { question: "Proč přirozené mokřady ubývají?", correctAnswer: "Odvodnění pro zemědělství a zástavbu — mokřady jsou záměrně vysoušeny", options: ["Odvodnění pro zemědělství a zástavbu — mokřady jsou záměrně vysoušeny", "Mokřady zanikají přirozeným vývojem bez lidského vlivu", "Klimatická změna způsobuje vznik nových mokřadů", "Mokřady ubývají kvůli nadměrnému rybolovu"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč je ztráta biodiverzity nebezpečná pro ekosystémy?", correctAnswer: "Každý druh plní roli v potravním řetězci — zánik jednoho může způsobit kolaps celého ekosystému", options: ["Každý druh plní roli v potravním řetězci — zánik jednoho může způsobit kolaps celého ekosystému", "Ztráta biodiverzity je přirozená a ekosystém se vždy obnoví", "Zánik druhů ovlivňuje jen potravní řetěz, ne půdu ani vodu", "Biodiverzita je jen estetická záležitost"] },
  { question: "Co je invazivní druh a proč je problémem?", correctAnswer: "Druh zavlečený z jiného území, který vytlačuje původní druhy a narušuje ekosystém", options: ["Druh zavlečený z jiného území, který vytlačuje původní druhy a narušuje ekosystém", "Druh schopný rychlého rozmnožení v přirozeném prostředí", "Chráněný druh přesouvaný mezi ekosystémy", "Druh adaptovaný na extrémy prostředí"] },
  { question: "Jak les přispívá k regulaci klimatu?", correctAnswer: "Absorbuje CO₂, produkuje O₂, zvyšuje vlhkost vzduchu transpirací a zadržuje vodu v půdě", options: ["Absorbuje CO₂, produkuje O₂, zvyšuje vlhkost vzduchu transpirací a zadržuje vodu v půdě", "Les ovlivňuje pouze místní teplotu bez globálního efektu", "Les produkuje CO₂ v noci — celkový efekt je neutrální", "Les zvyšuje sucho absorbcí spodní vody"] },
  { question: "Co je nitrifikace a proč je důležitá pro ekosystém?", correctAnswer: "Přeměna amoniaku na dusičnany bakteriemi v půdě — zpřístupňuje dusík rostlinám", options: ["Přeměna amoniaku na dusičnany bakteriemi v půdě — zpřístupňuje dusík rostlinám", "Absorpce dusíku listovými průduchy", "Přeměna dusíku na kyslík fotosyntézou", "Uvolňování dusíku do atmosféry rozkladem"] },
  { question: "Co je trofická kaskáda?", correctAnswer: "Efekt, kdy změna počtu predátorů na vrcholu potravního řetězce ovlivní celý ekosystém", options: ["Efekt, kdy změna počtu predátorů na vrcholu potravního řetězce ovlivní celý ekosystém", "Vertikální uspořádání pater lesa", "Sezonní migrace živočichů v ekosystému", "Postupné obohacování půdy o živiny"] },
  { question: "Jak mohou rybníky tlumit povodně?", correctAnswer: "Zadržují přebytečnou vodu při přívalových deštích a postupně ji uvolňují", options: ["Zadržují přebytečnou vodu při přívalových deštích a postupně ji uvolňují", "Rybníky povodně naopak zhoršují", "Rybníky mají vliv jen na místní vlhkost vzduchu", "Rybníky odvádějí vodu rychleji do řek"] },
  { question: "Proč smrkové monokultury jsou náchylnější ke kůrovcové kalamitě?", correctAnswer: "Monokultura nemá přirozené predátory kůrovce ani odolné druhy stromů, které by kalamitu omezily", options: ["Monokultura nemá přirozené predátory kůrovce ani odolné druhy stromů, které by kalamitu omezily", "Smrk je přirozeně citlivý na kůrovce bez ohledu na okolní druhy", "Smrkové lesy mají příliš vysokou vlhkost pro kůrovce", "Kůrovcová kalamita postihuje stejně smrky i listnaté stromy"] },
  { question: "Jaký je vztah mezi opylováním a produkcí potravin pro lidstvo?", correctAnswer: "Cca 75 % potravin závisí na opylení hmyzem — bez opylovačů by hrozil kolaps zemědělství", options: ["Cca 75 % potravin závisí na opylení hmyzem — bez opylovačů by hrozil kolaps zemědělství", "Opylování hmyzem je jen estetický proces bez vlivu na produkci", "Pouze ovoce závisí na opylení, ostatní potraviny ne", "Opylení větrem plně nahradí úbytek hmyzu"] },
  { question: "Co je ekoton?", correctAnswer: "Přechodová zóna mezi dvěma ekosystémy (např. okraj lesa a louka) — bývá druhově nejbohatší", options: ["Přechodová zóna mezi dvěma ekosystémy (např. okraj lesa a louka) — bývá druhově nejbohatší", "Typ chráněného území s nejvíce druhy", "Oblast bez živočichů na pomezí biotopu", "Vědecký název pro suché louky"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 45);
}

export const LESLOUKAPOLERYBNIKROSTLINYAZIVOCICHOVE: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ekosystemy-les-louka-pole-rybnik-rostliny-a-zivocichove",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ekosystemy-les-louka-pole-rybnik-rostliny-a-zivocichove",
    title: "Les, louka, pole, rybník - rostliny a živočichové",
    studentTitle: "Ekosystémy ČR",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš rostliny a živočichy čtyř ekosystémů a pochopíš potravní řetězec.",
    keywords: ["les", "louka", "pole", "rybník", "potravní řetězec", "ekosystém", "producent", "konzument", "rozkladač"],
    goals: [
      "Uvést typické rostliny a živočichy lesa, louky, pole a rybníka",
      "Popsat patra lesa",
      "Sestavit jednoduchý potravní řetězec",
      "Vysvětlit roli producentů, konzumentů a rozkladačů",
    ],
    boundaries: ["Podrobná taxonomie živočichů není náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "mixed",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Potravní řetězec: rostlina (producent) → bylinožravec → masožravec → rozkladač.",
      steps: [
        "1. Les: 4 patra (stromové, keřové, bylinné, mechové).",
        "2. Louka: pampeliška, jetel, motýl, žába.",
        "3. Rybník: leknín, rákos, kapr, vydra.",
        "4. Pole: obilniny, zajíc, myš, poštolka.",
      ],
      commonMistake: "Houby a bakterie jsou rozkladači, ne producenti.",
      example: "Příklad potravního řetězce louky: tráva → myš → poštolka → rozkladači.",
    },
  },
];
