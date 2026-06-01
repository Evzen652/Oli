import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Kdy začala první světová válka?",
    correctAnswer: "1914",
    options: ["1914", "1918", "1939", "1900"],
    hints: ["Válka začala vraždou arcivévody."],
    solutionSteps: ["První světová válka začala roku 1914 a skončila roku 1918."],
  },
  {
    question: "Kdy skončila první světová válka?",
    correctAnswer: "1918",
    options: ["1918", "1914", "1920", "1945"],
    hints: ["Ve stejném roce vzniklo Československo."],
    solutionSteps: ["Válka skončila 11. listopadu 1918 příměřím."],
  },
  {
    question: "Kdo byl zavražděn v Sarajevu 28. června 1914 a zapálil tím válku?",
    correctAnswer: "František Ferdinand d'Este",
    options: ["František Ferdinand d'Este", "Kaiser Wilhelm II.", "T. G. Masaryk", "Arcivévoda Karel"],
    hints: ["Byl nástupníkem habsburského trůnu."],
    solutionSteps: ["Atentát na Františka Ferdinanda d'Este v Sarajevu 28. 6. 1914 spustil světovou válku."],
  },
  {
    question: "Kdy vzniklo Československo?",
    correctAnswer: "28. října 1918",
    options: ["28. října 1918", "1. září 1939", "1. ledna 1993", "8. května 1945"],
    hints: ["Den vzniku ČSR je státní svátek."],
    solutionSteps: ["Czechoslovakia byla vyhlášena 28. října 1918 v Praze."],
  },
  {
    question: "Kdo byl první prezident Československa?",
    correctAnswer: "Tomáš Garrigue Masaryk (TGM)",
    options: ["Tomáš Garrigue Masaryk (TGM)", "Edvard Beneš", "Milan Rastislav Štefánik", "Karel Kramář"],
    hints: ["Říká se mu TGM nebo 'Tatíček Masaryk'."],
    solutionSteps: ["T. G. Masaryk byl prvním prezidentem ČSR a bojoval za vznik státu v emigraci."],
  },
  {
    question: "Kdo byl první ministr zahraničí Československa?",
    correctAnswer: "Edvard Beneš",
    options: ["Edvard Beneš", "T. G. Masaryk", "Milan Štefánik", "Antonín Švehla"],
    hints: ["Později se stal druhým prezidentem."],
    solutionSteps: ["Edvard Beneš byl ministrem zahraničí nového státu a blízkým spolupracovníkem Masaryka."],
  },
  {
    question: "Kdo byli legionáři?",
    correctAnswer: "Čeští vojáci bojující za Dohodu (Francii, Rusko, Itálii)",
    options: [
      "Čeští vojáci bojující za Dohodu (Francii, Rusko, Itálii)",
      "Habsburská císařská garda",
      "Němečtí vojáci v Čechách",
      "Ruský car a jeho armáda",
    ],
    hints: ["Bojovali za vznik Československa na frontách Dohody."],
    solutionSteps: ["Legionáři (čs. legie) bojovali ve Francii, Rusku a Itálii na straně Dohody."],
  },
  {
    question: "Jaké dvě strany stály proti sobě v první světové válce?",
    correctAnswer: "Dohoda (Francie, Británie, Rusko) a Trojspolek (Německo, Rakousko, Itálie)",
    options: [
      "Dohoda (Francie, Británie, Rusko) a Trojspolek (Německo, Rakousko, Itálie)",
      "NATO a Varšavská smlouva",
      "SSSR a USA",
      "Osmanská říše a Spojenci",
    ],
    hints: ["Dohoda = západ, Trojspolek = střed Evropy."],
    solutionSteps: ["Dohoda: Francie, Británie, Rusko (a USA od 1917) vs. Trojspolek: Německo, Rakousko-Uhersko, Itálie."],
  },
  {
    question: "Kdy vstoupily USA do první světové války?",
    correctAnswer: "1917",
    options: ["1917", "1914", "1918", "1915"],
    hints: ["USA vstoupily do války pozdě."],
    solutionSteps: ["USA vstoupily do války roku 1917 po německém podmořském útoku na americké lodě."],
  },
  {
    question: "Co znamenalo, že Masaryk bojoval za vznik Československa 'v emigraci'?",
    correctAnswer: "Pracoval v zahraničí (Paříž, Londýn, Washington) pro uznání státu",
    options: [
      "Pracoval v zahraničí (Paříž, Londýn, Washington) pro uznání státu",
      "Bojoval na frontě jako voják",
      "Byl uvězněn v Praze",
      "Psal do novin anonymně",
    ],
    hints: ["Emigrace = pobyt v cizině."],
    solutionSteps: ["Masaryk přesvědčoval dohodové vlády v Paříži, Londýně a Washingtonu o nutnosti vzniku ČSR."],
  },
  {
    question: "Proč je 28. října státním svátkem v ČR?",
    correctAnswer: "V tento den roku 1918 vzniklo Československo",
    options: [
      "V tento den roku 1918 vzniklo Československo",
      "Skončila druhá světová válka",
      "Narozeniny T. G. Masaryka",
      "Začala průmyslová revoluce",
    ],
    hints: ["Je to svátek vzniku státu."],
    solutionSteps: ["28. října je Dnem vzniku samostatného Československa — státní svátek ČR."],
  },
  {
    question: "Proč první světová válka začala?",
    correctAnswer: "Spor o atentát vedl k řetězu aliancí — celá Evropa se zapojila do války",
    options: [
      "Spor o atentát vedl k řetězu aliancí — celá Evropa se zapojila do války",
      "Rusko napadlo Německo",
      "Francie vyhlásila válku Anglii",
      "Japonsko zaútočilo na Čínu",
    ],
    hints: ["Atentát v Sarajevu byl jen zápalník — spojenecké smlouvy udělaly zbytek."],
    solutionSteps: ["Atentát → AUT-UHR vyhlásilo válku Srbsku → Rusko mobilizovalo → Německo vstoupilo → řetěz."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč Masaryk bojoval za vznik Československa právě v zahraničí, ne doma?",
    correctAnswer: "V Čechách by byl zatčen jako nepřítel Habsburků — v cizině mohl jednat svobodně",
    options: [
      "V Čechách by byl zatčen jako nepřítel Habsburků — v cizině mohl jednat svobodně",
      "Neměl v Čechách žádnou podporu",
      "Chtěl se vzdát českého občanství",
      "Byl v Čechách neznámý",
    ],
    hints: ["Habsburkové by jeho aktivity zakázali."],
    solutionSteps: ["Jako kritik Habsburků by Masaryk doma čelil uvěznění — emigrace mu dala svobodu jednat diplomaticky."],
  },
  {
    question: "Jak vznik Československa souvisel s porážkou Habsburků v 1. světové válce?",
    correctAnswer: "Porážka Habsburků rozpadla jejich říši — Češi a Slováci využili příležitost ke státnosti",
    options: [
      "Porážka Habsburků rozpadla jejich říši — Češi a Slováci využili příležitost ke státnosti",
      "Habsburkové ČSR sami nabídli",
      "ČSR vzniklo ještě za války na žádost Němců",
      "Rusko donutilo Habsburky ČSR vytvořit",
    ],
    hints: ["Konec Habsburků = konec Rakouska-Uherska."],
    solutionSteps: ["Porážka Trojspolku 1918 znamenala zánik Rakouska-Uherska → národ bez státu mohl svůj stát vytvořit."],
  },
  {
    question: "Proč byl Masaryk pro vznik ČSR klíčový?",
    correctAnswer: "Přesvědčil mocnosti Dohody (USA, Francii, Británii) aby ČSR uznaly",
    options: [
      "Přesvědčil mocnosti Dohody (USA, Francii, Británii) aby ČSR uznaly",
      "Vedl armádu na frontě",
      "Napsal ústavu sám",
      "Byl jediný Čech v emigraci",
    ],
    hints: ["Diplomatická práce je klíčová."],
    solutionSteps: ["Masarykova diplomatická aktivita vedla k uznání ČSR vítěznými mocnostmi Dohody."],
  },
  {
    question: "Co roli sehráli čs. legionáři při vzniku ČSR?",
    correctAnswer: "Ukázali světu, že Češi a Slováci chtějí bojovat za svobodu — posílili Masarykovy argumenty",
    options: [
      "Ukázali světu, že Češi a Slováci chtějí bojovat za svobodu — posílili Masarykovy argumenty",
      "Dobyli Prahu a vyhlásili nezávislost",
      "Legionáři pro vznik státu neměli žádný vliv",
      "Bojovali na straně Habsburků",
    ],
    hints: ["Legionáři = důkaz vůle národa."],
    solutionSteps: ["Legionáři na ruské a francouzské frontě prokázali vůli českého a slovenského národa k boji za svobodu."],
  },
  {
    question: "Jak se lišilo postavení Čechů a Slováků před rokem 1918?",
    correctAnswer: "Češi byli v Rakousku, Slováci v Uhersku — oba národy bez vlastního státu",
    options: [
      "Češi byli v Rakousku, Slováci v Uhersku — oba národy bez vlastního státu",
      "Slováci měli vlastní stát, Češi ne",
      "Oba národy žily ve společném státě",
      "Češi a Slováci byli jeden národ",
    ],
    hints: ["Habsburská monarchie = Rakousko + Uhersko."],
    solutionSteps: ["Habsburská monarchie byla rozdělena — české země patřily Rakousku, Slovensko Uhrám."],
  },
  {
    question: "Proč Ruská revoluce roku 1917 ovlivnila první světovou válku?",
    correctAnswer: "Rusko vystoupilo z války → Německo se soustředilo na západ, ale USA vstoupily",
    options: [
      "Rusko vystoupilo z války → Německo se soustředilo na západ, ale USA vstoupily",
      "Rusko zesílilo a dobylo Berlín",
      "Revoluce neměla vliv na válku",
      "Rusko obsadilo Francii",
    ],
    hints: ["1917 = dvě velké události: ruská revoluce + vstup USA."],
    solutionSteps: ["Únorová revoluce 1917 vyvedla Rusko z války → umožnila Německu přesunout síly, ale USA vyvážily."],
  },
  {
    question: "Proč se říká, že vznik Československa byl 'pokojným' aktem?",
    correctAnswer: "Vyhlášen bez vojenského povstání — na základě diplomatické práce v zahraničí",
    options: [
      "Vyhlášen bez vojenského povstání — na základě diplomatické práce v zahraničí",
      "Habsburkové sami odešli bez boje",
      "Česká armáda vyhrála rozhodující bitvu",
      "Vznikl po podpisu mírové smlouvy ve Versailles",
    ],
    hints: ["28. října 1918 — bez střelby v ulicích Prahy."],
    solutionSteps: ["ČSR vzniklo 28. 10. 1918 vyhlášením Národního výboru — bez vojenského boje na území Čech."],
  },
  {
    question: "Co byl atentát v Sarajevu a proč byl tak důležitý?",
    correctAnswer: "Zavraždění habsburského následníka trůnu — záminká k vyhlášení války Srbsku",
    options: [
      "Zavraždění habsburského následníka trůnu — záminká k vyhlášení války Srbsku",
      "Útok Ruska na Vídeň",
      "Francouzský bombardér na Berlín",
      "Atentát na ruského cara",
    ],
    hints: ["Kdo byl v Sarajevu zavražděn?"],
    solutionSteps: ["Gavrilo Princip zastřelil Františka Ferdinanda → AUH vyhlásilo válku Srbsku → řetězová reakce."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď události první světové války a vzniku ČSR chronologicky.",
    correctAnswer: "Atentát → Válka → Ruská revoluce → USA vstupují → Vznik ČSR",
    items: [
      "Atentát v Sarajevu (28. 6. 1914)",
      "Začátek války (srpen 1914)",
      "Ruská revoluce (1917)",
      "USA vstupují do války (1917)",
      "Vznik Československa (28. 10. 1918)",
    ],
    hints: ["Atentát byl první."],
    solutionSteps: ["1914 atentát → 1914 válka → 1917 revoluce + USA → 1918 vznik ČSR."],
  },
  {
    question: "Spoj osobnost s její rolí ve vzniku ČSR.",
    correctAnswer: "Správné přiřazení",
    pairs: [
      { left: "T. G. Masaryk", right: "První prezident, diplomatická práce v exilu" },
      { left: "Edvard Beneš", right: "První ministr zahraničí" },
      { left: "Milan R. Štefánik", right: "Slovenský spoluzakladatel ČSR" },
      { left: "Čs. legionáři", right: "Vojáci bojující za Dohodu" },
    ],
    hints: ["Masaryk = prezident."],
    solutionSteps: ["Masaryk, Beneš a Štefánik jsou 'Tři muži ČSR'. Legionáři bojovali na frontách."],
  },
  {
    question: "Proč je vznik ČSR příkladem národního sebeurčení?",
    correctAnswer: "Národ bez státu (Češi + Slováci) využil příležitost a vytvořil vlastní stát",
    options: [
      "Národ bez státu (Češi + Slováci) využil příležitost a vytvořil vlastní stát",
      "ČSR byl darován Masarykovi jako odměna",
      "Habsburkové dobrovolně Čechům stát přidělili",
      "OSN rozhodla o vzniku ČSR",
    ],
    hints: ["Sebeurčení = právo národa rozhodovat o sobě."],
    solutionSteps: ["Wilsonovy zásady sebeurčení národů umožnily Masarykovi argumentovat za vznik ČSR."],
  },
  {
    question: "Proč se první světová válka nazývá 'světová'?",
    correctAnswer: "Bojovalo se na více kontinentech a zapojila se většina světových velmocí",
    options: [
      "Bojovalo se na více kontinentech a zapojila se většina světových velmocí",
      "Jen kvůli počtu obětí",
      "Probíhala 20 let",
      "Bojovaly jen evropské státy",
    ],
    hints: ["Afrika, Asie, oceány — válka nebyla jen v Evropě."],
    solutionSteps: ["Boje probíhaly v Evropě, Africe, na Blízkém východě i oceánech; zapojily se velmoci z celého světa."],
  },
  {
    question: "Jaký byl rozdíl mezi Trojspolkem a Dohodou?",
    correctAnswer: "Trojspolek (AUH, Německo, Itálie) byl na straně poraženého; Dohoda (UK, FR, RUS, USA) vyhrála",
    options: [
      "Trojspolek (AUH, Německo, Itálie) byl na straně poraženého; Dohoda (UK, FR, RUS, USA) vyhrála",
      "Trojspolek vyhrál válku",
      "Dohoda zahrnovala Německo",
      "Oba bloky prohrály",
    ],
    hints: ["Czechia bojovala za Dohodu prostřednictvím legionářů."],
    solutionSteps: ["Dohoda zvítězila 1918 → Trojspolek se rozpadl → nové státy jako ČSR mohly vzniknout."],
  },
  {
    question: "Jak by ses jako Čech cítil 28. října 1918? Která odpověď nejlépe popisuje historickou náladu?",
    correctAnswer: "Radost a úleva — po 300 letech habsburské nadvlády konečně vlastní stát",
    options: [
      "Radost a úleva — po 300 letech habsburské nadvlády konečně vlastní stát",
      "Strach — nový stát přinese jen problémy",
      "Lhostejnost — stát pro mě nic neznamená",
      "Zklamání — raději bych zůstal součástí Vídně",
    ],
    hints: ["Češi čekali na vlastní stát od Bílé hory 1620."],
    solutionSteps: ["Vznik ČSR byl pro Čechy vrcholem národního obrození — konec 300 let habsburské nadvlády."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const PRVNISVETOVAVALKAAVZNIKCESKOSLOVENSKA1918: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-prvni-svetova-valka-a-vznik-ceskoslovenska-1918",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-prvni-svetova-valka-a-vznik-ceskoslovenska-1918",
    title: "První světová válka a vznik Československa 1918",
    studentTitle: "1. světová válka",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "20. století - od T. G. Masaryka po dnešek",
    briefDescription: "Pochopíš vznik Československa po první světové válce.",
    keywords: ["první světová válka", "masaryk", "československo", "28. října", "legionáři", "beneš"],
    goals: [
      "Žák uvede příčiny a výsledek první světové války",
      "Žák vysvětlí roli Masaryka při vzniku ČSR",
      "Žák zná datum 28. října 1918 a jeho význam",
    ],
    boundaries: ["Vojenská taktika jednotlivých bitev", "Detailní mírové smlouvy"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Klíčové datum: 28. října 1918 — vznik Československa.",
      steps: [
        "1914: atentát v Sarajevu → začátek 1. světové války",
        "Dohoda vs. Trojspolek",
        "Masaryk v emigraci bojuje za ČSR",
        "28. října 1918: vznik Československa",
        "TGM = 1. prezident",
      ],
      commonMistake: "Zaměňování roku začátku (1914) a konce (1918) války.",
      example: "Legionáři bojovali za Dohodu a pomohli přesvědčit mocnosti, aby ČSR uznaly.",
    },
  },
];
