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
    question: "Kdy přišli Slované do střední Evropy?",
    correctAnswer: "V 6. století n. l.",
    options: ["V 6. století n. l.", "Ve 3. století př. n. l.", "Ve 12. století n. l.", "Ve 2. tisíciletí př. n. l."],
    hints: ["Slované přišli po zániku Římské říše."],
    solutionSteps: ["Slované přišli do střední Evropy přibližně v 6. století n. l."],
  },
  {
    question: "Jak si Slované opatřovali obživu?",
    correctAnswer: "Zemědělstvím — pěstovali obilí a chovali zvířata",
    options: [
      "Zemědělstvím — pěstovali obilí a chovali zvířata",
      "Lovem a sběrem",
      "Obchodem s cizími zeměmi",
      "Rybářstvím v mořích",
    ],
    hints: ["Slované byli usedlí lidé s polnostmi."],
    solutionSteps: ["Slované byli zemědělci — pěstovali obilí (žito, pšenice) a chovali dobytek."],
  },
  {
    question: "Jak se jmenoval první slovanský stát?",
    correctAnswer: "Sámova říše",
    options: ["Sámova říše", "Velkomoravská říše", "Přemyslovský stát", "Bohemia"],
    hints: ["Tento stát vznikl v 7. století a nazval se podle svého panovníka."],
    solutionSteps: ["Prvním slovanským státem v naší oblasti byla Sámova říše (623–658 n. l.)."],
  },
  {
    question: "Kdo byl Sámo?",
    correctAnswer: "Franský kupec, který se stal vůdcem a knížetem Slovanů",
    options: [
      "Franský kupec, který se stal vůdcem a knížetem Slovanů",
      "Moravský kníže",
      "Byzantský císař",
      "Keltský náčelník",
    ],
    hints: ["Sámo nebyl Slovan — přišel ze západu."],
    solutionSteps: ["Sámo byl franský kupec, který pomohl Slovanům porazit Avary a stal se jejich panovníkem (623–658)."],
  },
  {
    question: "Co je to Velkomoravská říše?",
    correctAnswer: "Slovanský stát na Moravě a Slovensku v 9. století",
    options: [
      "Slovanský stát na Moravě a Slovensku v 9. století",
      "Keltský stát v době bronzové",
      "Germánský stát v době stěhování národů",
      "Habsburská monarchie",
    ],
    hints: ["Velkomoravská říše existovala v 9. stol. n. l."],
    solutionSteps: ["Velkomoravská říše byl slovanský stát v 9. století n. l. na území Moravy a Slovenska."],
  },
  {
    question: "Kdo byli Cyril a Metoděj?",
    correctAnswer: "Byzantští misionáři, kteří přinesli na Moravu hlaholici a křesťanství",
    options: [
      "Byzantští misionáři, kteří přinesli na Moravu hlaholici a křesťanství",
      "Čeští přemyslovští knížata",
      "Germánští válečníci",
      "Slovanští kněží z Polska",
    ],
    hints: ["Přišli z Byzance (Řecko-Turecka) do Velkomoravské říše."],
    solutionSteps: ["Cyril a Metoděj byli byzantští misionáři, kteří roku 863 přinesli na Moravu hlaholici a přeložili liturgii do staroslověnštiny."],
  },
  {
    question: "Co je to hlaholice?",
    correctAnswer: "První slovanské písmo, které vytvořil Cyril pro záznamy liturgie",
    options: [
      "První slovanské písmo, které vytvořil Cyril pro záznamy liturgie",
      "Staré germánské písmo",
      "Latinka",
      "Keltské runové písmo",
    ],
    hints: ["Hlaholice = první písmena Slovanů."],
    solutionSteps: ["Hlaholici vytvořil Cyril (Konstantin) — bylo to první písmo přizpůsobené slovanskému jazyku."],
  },
  {
    question: "V kterém roce přišli Cyril a Metoděj na Moravu?",
    correctAnswer: "V roce 863",
    options: ["V roce 863", "V roce 623", "V roce 1000", "V roce 700"],
    hints: ["Přišli na pozvání moravského knížete Rastislava."],
    solutionSteps: ["Cyril a Metoděj přišli na Velkou Moravu v roce 863 n. l."],
  },
  {
    question: "Jak se jmenoval moravský kníže, který pozval Cyrila a Metoděje?",
    correctAnswer: "Rastislav",
    options: ["Rastislav", "Svätopluk", "Bořivoj", "Václav"],
    hints: ["Rastislav chtěl liturgii ve slovanském jazyce, ne v latině."],
    solutionSteps: ["Moravský kníže Rastislav pozval Cyrila a Metoděje z Byzance v roce 863."],
  },
  {
    question: "Co se stalo s Velkomoravskou říší v roce 906?",
    correctAnswer: "Zanikla — byla rozvrácena Maďary (Uhry)",
    options: [
      "Zanikla — byla rozvrácena Maďary (Uhry)",
      "Stala se součástí Přemyslovského státu",
      "Přejmenovala se na Čechy",
      "Dobyli ji Keltové",
    ],
    hints: ["VM Říše zanikla pod náporem nájezdů z východu."],
    solutionSteps: ["Velkomoravská říše zanikla kolem roku 906 n. l. pod útoky maďarských kmenů (Uhrů)."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč chtěl kníže Rastislav pozvat misionáře z Byzance, a ne ze západu?",
    correctAnswer: "Chtěl liturgii ve slovanském jazyce, nikoliv v latiné — a chránit nezávislost na Francích",
    options: [
      "Chtěl liturgii ve slovanském jazyce, nikoliv v latiné — a chránit nezávislost na Francích",
      "Byzance byla blíže než západ",
      "Franské misie již selhaly",
      "Rastislav neuměl latinsky",
    ],
    hints: ["Lat. mše nerozumí Slované — Rastislav to chtěl změnit."],
    solutionSteps: ["Rastislav chtěl bohoslužby ve srozumitelném slovanském jazyce a zároveň oslabení franského vlivu."],
  },
  {
    question: "Co bylo dílem Cyrila a Metoděje kromě hlaholice?",
    correctAnswer: "Přeložili bibli a bohoslužebné texty do staroslověnštiny",
    options: [
      "Přeložili bibli a bohoslužebné texty do staroslověnštiny",
      "Postavili první katedrálu na Moravě",
      "Sjednotili slovanské kmeny",
      "Přinesli bronzové nástroje",
    ],
    hints: ["Cyril a Metoděj byli vzdělanci — přišli s jazykem i překlady."],
    solutionSteps: ["Cyril a Metoděj vytvořili hlaholici, přeložili bibli a bohoslužby do staroslověnštiny — umožnili Slovanům mši ve svém jazyce."],
  },
  {
    question: "Co je to staroslověnština?",
    correctAnswer: "Slovanský liturgický jazyk vytvořený Cyrilem a Metodějem pro bohoslužby",
    options: [
      "Slovanský liturgický jazyk vytvořený Cyrilem a Metodějem pro bohoslužby",
      "Starý jazyk Keltů",
      "Praslovenština 5. stol.",
      "Jazyk staré Byzance",
    ],
    hints: ["Staroslověnština = nejstarší literární jazyk Slovanů."],
    solutionSteps: ["Staroslověnština je umělý liturgický jazyk, do kterého Cyril a Metoděj přeložili křesťanské texty."],
  },
  {
    question: "Jak Slované budovali svá sídla?",
    correctAnswer: "Osady s dřevěnými domy, hradiště (opevněné vesnice)",
    options: [
      "Osady s dřevěnými domy, hradiště (opevněné vesnice)",
      "Kamenné hrady na vrcholech hor",
      "Podzemní příbytky v jeskyních",
      "Kočovné tábory bez pevného sídla",
    ],
    hints: ["Slované byli usedlí — budovali vesnice z dřeva."],
    solutionSteps: ["Slované stavěli dřevěné domy v osadách a budovali hradiště — opevněné obytné areály."],
  },
  {
    question: "Jak se jmenoval nejznámější panovník Velkomoravské říše?",
    correctAnswer: "Svätopluk",
    options: ["Svätopluk", "Rastislav", "Sámo", "Bořivoj"],
    hints: ["Tento kníže přijal i Přemyslovce Bořivoje na svůj dvůr."],
    solutionSteps: ["Svätopluk (871–894) byl nejslavnějším panovníkem VM Říše — za jeho vlády dosáhla největšího rozsahu."],
  },
  {
    question: "Co přineslo křesťanství Slovanům?",
    correctAnswer: "Písmo, vzdělání, nové stavby (kostely) a zapojení do evropské kultury",
    options: [
      "Písmo, vzdělání, nové stavby (kostely) a zapojení do evropské kultury",
      "Pouze nová náboženská pravidla",
      "Zemědělské znalosti",
      "Výrobu kovů",
    ],
    hints: ["Křesťanství bylo v 9. stol. spojem s civilizací a vzdělaností."],
    solutionSteps: ["Křesťanství přineslo hlaholici, vzdělání v kláštěrech, stavbu kostelů a zapojení Slovanů do evropské středověké kultury."],
  },
  {
    question: "Co je to azbuka a jak souvisí s hlaholici?",
    correctAnswer: "Azbuka je slovanské písmo navazující na hlaholici, rozšířené po Cyrilově vzoru",
    options: [
      "Azbuka je slovanské písmo navazující na hlaholici, rozšířené po Cyrilově vzoru",
      "Azbuka a hlaholice jsou totéž",
      "Azbuka je latinské písmo",
      "Azbuka je keltské písmo",
    ],
    hints: ["Azbuka je dnes písmo Rusů a Bulharů — Cyrilice."],
    solutionSteps: ["Azbuka (cyrilice) vznikla z hlaholice — pojmenovaná po Cyrilovi. Dnes ji používají Rusové, Bulhaři, Srbové."],
  },
  {
    question: "Kdo sjednotil Čechy po zániku VM Říše?",
    correctAnswer: "Přemyslovci",
    options: ["Přemyslovci", "Lucemburkové", "Mojmírovci", "Habsburkové"],
    hints: ["Přemyslovci jsou první česká knížecí dynastie."],
    solutionSteps: ["Po zániku VM Říše sjednotili Čechy Přemyslovci — rod knížat pocházející z Čech."],
  },
  {
    question: "Jaký jazyk používali Slované při příchodu do Čech?",
    correctAnswer: "Praslovanský jazyk — společný předchůdce dnešních slovanských jazyků",
    options: [
      "Praslovanský jazyk — společný předchůdce dnešních slovanských jazyků",
      "Latinu",
      "Keltský jazyk",
      "Germánský jazyk",
    ],
    hints: ["Všichni Slované mluvili podobným jazykem — z tohoto se vyvinula čeština, polština, ruština..."],
    solutionSteps: ["Slované mluvili praslovansky — z tohoto jazyka se v průběhu staletí vyvinuly dnešní slovanské jazyky."],
  },
  {
    question: "Proč je rok 863 důležitý v dějinách Slovanů?",
    correctAnswer: "Cyril a Metoděj přišli na Moravu a přinesli hlaholici — první slovanské písmo",
    options: [
      "Cyril a Metoděj přišli na Moravu a přinesli hlaholici — první slovanské písmo",
      "Vznikla Velkomoravská říše",
      "Bořivoj přijal křesťanství",
      "Přemyslovci sjednotili Čechy",
    ],
    hints: ["Rok 863 = přichod Cyrila a Metoděje."],
    solutionSteps: ["V roce 863 přišli Cyril a Metoděj na Velkou Moravu a přinesli hlaholici — datum zásadní pro slovanskou kulturu."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Proč hlaholice upadla a nahradila ji latinka?",
    correctAnswer: "Po vyhnaní Metodějových žáků zvítězil latinský ritus — latina se stala církevním jazykem",
    options: [
      "Po vyhnaní Metodějových žáků zvítězil latinský ritus — latina se stala církevním jazykem",
      "Hlaholice byla příliš složitá",
      "Slované sami přestali používat hlaholici",
      "Hlaholice zanikla se zánikem VM Říše",
    ],
    hints: ["Metodějovi žáci byli vyhnáni z Moravy Franky."],
    solutionSteps: ["Po Metodějově smrti (885) byli jeho žáci vyhnáni — latinský ritus zvítězil a hlaholice v Čechách zanikla."],
  },
  {
    question: "Jak se Sámova říše lišila od Velkomoravské říše?",
    correctAnswer: "Sámova říše byla 7. stol. — dočasný útvar, VM Říše trvalý stát 9. stol. se správní strukturou",
    options: [
      "Sámova říše byla 7. stol. — dočasný útvar, VM Říše trvalý stát 9. stol. se správní strukturou",
      "Sámova říše byla větší",
      "VM Říše zanikla dříve",
      "Obě byly totožné",
    ],
    hints: ["Sámova říše trvala jen za Sámova života."],
    solutionSteps: ["Sámova říše (623–658) byla dočasný útvar za jednoho vůdce. VM Říše (820–906) měla trvalou správní strukturu a křesťanství."],
  },
  {
    question: "Jak Cyrila a Metoděje přijal papež v Římě a co to znamenalo?",
    correctAnswer: "Papež schválil staroslověnštinu jako bohoslužebný jazyk — průlom v praxi pouze latinských mší",
    options: [
      "Papež schválil staroslověnštinu jako bohoslužebný jazyk — průlom v praxi pouze latinských mší",
      "Papež zakázal slovanskou liturgii",
      "Papež je uvěznil za herezi",
      "Setkání s papežem proběhlo neúspěšně",
    ],
    hints: ["Vatikán uznával pouze tři jazyky liturgie — hebrejštinu, řečtinu a latinu."],
    solutionSteps: ["Papež Hadrián II. v roce 868 schválil staroslověnštinu jako čtvrtý liturgický jazyk — velká změna v církevní praxi."],
  },
  {
    question: "Jak vyhnaní žáci Cyrila a Metoděje ovlivnili jiné slovanské národy?",
    correctAnswer: "Uchýlili se do Bulharska, kde rozvinuli azbuku — dnes ji používají Rusové, Srbové, Bulhaři",
    options: [
      "Uchýlili se do Bulharska, kde rozvinuli azbuku — dnes ji používají Rusové, Srbové, Bulhaři",
      "Odešli do Polska a rozšířili latinku",
      "Vrátili se do Byzance",
      "Vytvořili nové státy v Čechách",
    ],
    hints: ["Žáci z Moravy šli do Bulharska a přinesli tam písmo."],
    solutionSteps: ["Metodějovi žáci uprchli do Bulharska (893) a tam rozvinuli cyrilici (azbuku) — základ pro ruské, srbské a bulharské písmo."],
  },
  {
    question: "Jak ovlivnila Velkomoravská říše pozdější dějiny Čech a Slovenska?",
    correctAnswer: "Dala základ křesťanství, slovanské kultury a státnosti na tomto území",
    options: [
      "Dala základ křesťanství, slovanské kultury a státnosti na tomto území",
      "VM Říše neměla trvalý vliv",
      "VM Říše způsobila zánik Přemyslovců",
      "VM Říše sjednotila Čechy s Polskem",
    ],
    hints: ["VM Říše přijala Bořivoje Přemyslovce jako prvního křesťanského knížete Čech."],
    solutionSteps: ["VM Říše položila základy křesťanství v Čechách (křest Bořivoje), slovanské vzdělanosti a státní tradice."],
  },
  {
    question: "Proč Slované přišli do střední Evropy právě v 6. stol. n. l.?",
    correctAnswer: "Stěhování národů (Germáni odešli na západ) uvolnilo území — Slované je obsadili",
    options: [
      "Stěhování národů (Germáni odešli na západ) uvolnilo území — Slované je obsadili",
      "Slované byli pozváni Germány",
      "Slované prchali před Kelty",
      "Slované hledali úrodnou půdu u moře",
    ],
    hints: ["Pohyb Germánů na západ (zánik Říma) uvolnil prostory ve střední Evropě."],
    solutionSteps: ["V 5.–6. stol. Germáni migrovali do bývalého Říma — jejich území bylo prázdné, Slované ho postupně obsadili."],
  },
  {
    question: "Co byl liturgický jazyk a proč na něm záleželo v 9. stol.?",
    correctAnswer: "Jazyk církevních bohoslužeb — kdo ho kontroloval, měl moc nad věřícími a vzděláváním",
    options: [
      "Jazyk církevních bohoslužeb — kdo ho kontroloval, měl moc nad věřícími a vzděláváním",
      "Jazyk obchodu a diplomacie",
      "Jazyk písní a básní",
      "Jazyk vojáků",
    ],
    hints: ["V 9. stol. = vzdělání přes církev = kdo ovládal jazyk mší, ovládal vzdělání."],
    solutionSteps: ["Liturgický jazyk = jazyk mší a knih → kdo ho kontroloval, ovládal vzdělání a kulturu — obrovská moc."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const count = level === 3 ? Math.min(pool.length, 40) : Math.min(pool.length, 30);
  return shuffle(pool).slice(0, count);
}

export const SLOVANEVELKOMORAVSKARISECYRILAMETODEJ: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-slovane-velkomoravska-rise-cyril-a-metodej",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-slovane-velkomoravska-rise-cyril-a-metodej",
    title: "Slované, Velkomoravská říše, Cyril a Metoděj",
    studentTitle: "Slované a Morava",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš, jak Slované přišli do Čech a kdo přinesl první slovanské písmo.",
    keywords: ["Slované", "Velkomoravská říše", "Cyril", "Metoděj", "hlaholice", "Rastislav", "Sámova říše"],
    goals: [
      "Popsat příchod Slovanů a způsob jejich života",
      "Vysvětlit vznik a zánik Velkomoravské říše",
      "Znát rok 863 a přínos Cyrila a Metoděje",
      "Vysvětlit hlaholici a staroslověnštinu",
    ],
    boundaries: ["Detailní genealogie panovníků není vyžadována", "Byzantská politika není cílem"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Slované přišli v 6. stol. Cyril a Metoděj = 863, hlaholice, staroslověnština. VM Říše zanikla 906.",
      steps: [
        "Sámova říše 623–658 = první slovanský stát",
        "VM Říše 9. stol. = Rastislav, Svätopluk",
        "863: Cyril a Metoděj → hlaholice",
        "906: zánik VM Říše → Přemyslovci sjednotí Čechy",
      ],
      commonMistake: "Žáci si pletou Rastislava a Svätopluka — Rastislav pozval Cyrila a Metoděje, Svätopluk byl jeho nástupce.",
      example: "Rastislav (860–870) pozval Cyrila a Metoděje z Byzance roku 863 → přinesli hlaholici.",
    },
  },
];
