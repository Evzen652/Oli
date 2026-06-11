import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
  {
    question: "Co je to časová přímka?",
    correctAnswer: "Čára, která zobrazuje události v pořadí, jak šly za sebou v čase",
    options: [
      "Čára, která zobrazuje události v pořadí, jak šly za sebou v čase",
      "Mapa, na které jsou vyznačena důležitá místa",
      "Tabulka s jmény členů rodiny",
      "Obrázek, který ukazuje, jak vypadala škola dříve",
    ],
    hints: [
      "Časová přímka vypadá jako čára s body — každý bod značí jednu událost.",
      "Na časové přímce jsou události seřazeny od nejstarší (vlevo) po nejnovější (vpravo).",
    ],
    explanation: "Časová přímka je čára, na které jsou události zaznačeny v pořadí, jak šly za sebou. Pomáhá nám přehledně vidět, co se stalo dříve a co později.",
  },
  {
    question: "Která generace jsou prarodiče (babička a děda)?",
    correctAnswer: "První generace",
    options: ["První generace", "Druhá generace", "Třetí generace", "Čtvrtá generace"],
    hints: [
      "Generace se počítají od nejstarších k nejmladším.",
      "Prarodiče jsou nejstarší v rodině — jsou tedy první.",
    ],
    explanation: "Prarodiče (babička a děda) patří do první (nejstarší) generace v rodině. Jsou rodiči tvých rodičů.",
  },
  {
    question: "Která generace jsou rodiče (máma a táta)?",
    correctAnswer: "Druhá generace",
    options: ["Druhá generace", "První generace", "Třetí generace", "Nultá generace"],
    hints: [
      "Rodiče jsou mladší než prarodiče, ale starší než ty.",
      "Druhá generace stojí uprostřed — mezi prarodiči a dětmi.",
    ],
    explanation: "Rodiče patří do druhé generace. Jsou mladší než prarodiče (1. generace), ale starší než jejich vlastní děti (3. generace).",
  },
  {
    question: "Do které generace patříš ty (dítě)?",
    correctAnswer: "Třetí generace",
    options: ["Třetí generace", "Druhá generace", "První generace", "Nultá generace"],
    hints: [
      "Ty jsi nejmladší — prarodiče, rodiče a pak ty.",
      "Počítej: 1. prarodiče, 2. rodiče, 3. děti.",
    ],
    explanation: "Děti patří do třetí generace. V rodině jsou tři generace: prarodiče (1.), rodiče (2.) a děti (3.).",
  },
  {
    question: "Co znamená slovo 'minulost'?",
    correctAnswer: "Čas, který už proběhl — co se stalo dříve",
    options: [
      "Čas, který už proběhl — co se stalo dříve",
      "Čas, který právě prožíváme — co se děje teď",
      "Čas, který teprve přijde — co se stane",
      "Slovo pro počítání generací",
    ],
    hints: [
      "Minulost je za námi — už se stala.",
      "Události v minulosti zapsujeme například do kronik.",
    ],
    explanation: "Minulost je čas, který již proběhl. Patří sem vše, co se stalo dříve — třeba jak žili naši prarodiče nebo jak vypadala škola před sto lety.",
  },
  {
    question: "Co znamená slovo 'přítomnost'?",
    correctAnswer: "Čas, který právě prožíváme — co se děje teď",
    options: [
      "Čas, který právě prožíváme — co se děje teď",
      "Čas, který už proběhl — co se stalo dříve",
      "Čas, který teprve přijde — co se stane",
      "Část časové přímky pro nejstarší události",
    ],
    hints: [
      "Přítomnost = teď, v tuto chvíli.",
      "Co děláš právě teď, to je přítomnost.",
    ],
    explanation: "Přítomnost je čas, který právě prožíváme. Je to 'teď' — co se děje v této chvíli.",
  },
  {
    question: "Co znamená slovo 'budoucnost'?",
    correctAnswer: "Čas, který teprve přijde — co se stane",
    options: [
      "Čas, který teprve přijde — co se stane",
      "Čas, který právě prožíváme — co se děje teď",
      "Čas, který už proběhl — co se stalo dříve",
      "Nejstarší část rodokmenu",
    ],
    hints: [
      "Budoucnost je před námi — ještě nenastala.",
      "Co budeš dělat zítra? To je budoucnost.",
    ],
    explanation: "Budoucnost je čas, který teprve nastane. Patří sem plány a události, které se ještě nestaly — třeba prázdniny, nebo jak bude vypadat svět za padesát let.",
  },
  {
    question: "Co je to rodokmen?",
    correctAnswer: "Strom (nebo tabulka) zobrazující členy rodiny a jejich příbuzenské vztahy",
    options: [
      "Strom (nebo tabulka) zobrazující členy rodiny a jejich příbuzenské vztahy",
      "Čára zobrazující historické události v čase",
      "Kniha, do které se zapisují důležité události ve škole",
      "Mapa starého města",
    ],
    hints: [
      "Rodokmen vypadá jako strom — nahoře jsou nejstarší předci, dole nejmladší.",
      "Slovo 'rod' znamená rodina, 'kmen' je hlavní část stromu.",
    ],
    explanation: "Rodokmen je schéma (strom nebo tabulka), které zobrazuje členy rodiny a ukazuje, jak jsou navzájem příbuzní. Vidíme v něm prarodiče, rodiče, děti a jejich vztahy.",
  },
  {
    question: "Jak se změnily telefony od doby prarodičů do dnes?",
    correctAnswer: "Dříve byly velké a pevně připojené ke zdi, dnes jsou malé a přenosné",
    options: [
      "Dříve byly velké a pevně připojené ke zdi, dnes jsou malé a přenosné",
      "Dříve byly malé a přenosné, dnes jsou velké a těžké",
      "Telefony se vůbec nezměnily",
      "Dříve neexistovaly, vymysleli je teprve nedávno",
    ],
    hints: [
      "Přemýšlej, jak vypadal telefon, který viděl na starých fotkách.",
      "Dnes máme chytrý telefon, který se vejde do kapsy.",
    ],
    explanation: "V době prarodičů byly telefony velké, pevné a připojené ke zdi — říkalo se jim 'pevná linka'. Dnes máme malé mobilní telefony, které nosíme všude s sebou.",
  },
  {
    question: "Jak se změnila škola od doby prarodičů do dnes?",
    correctAnswer: "Dříve se psalo perem a inkoustem do sešitů, dnes se používají i počítače a tablety",
    options: [
      "Dříve se psalo perem a inkoustem do sešitů, dnes se používají i počítače a tablety",
      "Dříve byly školy modernější než dnes",
      "Ve škole se nic nezměnilo, vždy bylo úplně stejné",
      "Dříve se nechodilo do školy vůbec",
    ],
    hints: [
      "Pomysli, jaké pomůcky mají dnes děti ve škole.",
      "Prarodiče neměli počítače — psali perem a tužkou.",
    ],
    explanation: "Ve škole za doby prarodičů se psalo perem a inkoustem, nebyly interaktivní tabule ani počítače. Dnes mají děti k dispozici moderní technologie, ale základní věci jako čtení a psaní zůstávají.",
  },
  {
    question: "Jak se změnila doprava za posledních sto let?",
    correctAnswer: "Dříve jezdily koňské povozy a parní vlaky, dnes jezdí auta, rychlovlaky a létají letadla",
    options: [
      "Dříve jezdily koňské povozy a parní vlaky, dnes jezdí auta, rychlovlaky a létají letadla",
      "Dříve se létalo letadlem více než dnes",
      "Doprava se vůbec nezměnila",
      "Dříve bylo více aut než dnes",
    ],
    hints: [
      "Přemýšlej, jak se lidé přepravovali, když ještě nebyly silnice a benzínové motory.",
      "Koně, kola a parní stroje — to byl začátek.",
    ],
    explanation: "Před sto lety lidé jezdili na koních, v koňských povozech nebo parními vlaky. Auta, rychlovlaky a letadla jsou výdobytky moderní doby. Doprava se za sto let velmi změnila.",
  },
  {
    question: "Co je to kronika?",
    correctAnswer: "Kniha, do které se zapisují důležité události v pořadí, jak šly za sebou",
    options: [
      "Kniha, do které se zapisují důležité události v pořadí, jak šly za sebou",
      "Strom příbuzenských vztahů rodiny",
      "Mapa zobrazující historická místa",
      "Časová přímka v podobě číselné osy",
    ],
    hints: [
      "Kroniku vedla například každá vesnice nebo škola.",
      "Kronika je jako deník — ale pro celou obec nebo skupinu.",
    ],
    explanation: "Kronika je kniha, do které kronikář zapisuje důležité události v pořadí, jak šly za sebou v čase. Vedla ji každá vesnice, město nebo škola. Dnes je kronika cenným historickým pramenem.",
  },
  {
    question: "Co je to archiv?",
    correctAnswer: "Místo, kde se uchovávají staré dokumenty, fotografie a záznamy",
    options: [
      "Místo, kde se uchovávají staré dokumenty, fotografie a záznamy",
      "Místo, kde se vystavují moderní obrazy",
      "Budova, kde žijí prarodiče",
      "Jiný název pro rodokmen",
    ],
    hints: [
      "V archivu najdeš staré listiny, matriky nebo fotografie.",
      "Archiv je jako velká knihovna pro historické záznamy.",
    ],
    explanation: "Archiv je speciální místo (budova), kde se uchovávají staré dokumenty, listiny, fotografie a záznamy. Historici a badatelé do archivu chodí, když chtějí zjistit, co se stalo v minulosti.",
  },
  {
    question: "Která událost na časové přímce patří nejdál do minulosti?",
    correctAnswer: "Stavba hradu před 700 lety",
    options: [
      "Stavba hradu před 700 lety",
      "Narozeniny táty před 35 lety",
      "Tvoje narozeniny před 8 lety",
      "Příchod učitelky do školy před 10 lety",
    ],
    hints: [
      "Na časové přímce jsou nejstarší události nejvíce vlevo (nebo nejníže).",
      "Porovnej čísla: 700, 35, 10, 8 — které je největší?",
    ],
    explanation: "Stavba hradu před 700 lety je nejdál v minulosti, protože 700 let je největší číslo. Na časové přímce by tato událost byla úplně vlevo — nejdál od přítomnosti.",
  },
  {
    question: "Jaký je správný pořadí generací od nejstarší po nejmladší?",
    correctAnswer: "Prarodiče → rodiče → děti",
    options: [
      "Prarodiče → rodiče → děti",
      "Děti → rodiče → prarodiče",
      "Rodiče → prarodiče → děti",
      "Děti → prarodiče → rodiče",
    ],
    hints: [
      "Generace jdou od nejstarších k nejmladším.",
      "Kdo se narodil jako první — prarodiče, rodiče nebo děti?",
    ],
    explanation: "Správné pořadí generací od nejstarší po nejmladší je: prarodiče (1. generace) → rodiče (2. generace) → děti (3. generace). Prarodiče se narodili jako první.",
  },
  {
    question: "Proč je důležité uchovávat staré fotografie a dokumenty?",
    correctAnswer: "Abychom věděli, jak žili lidé v minulosti a nezapomněli na svou historii",
    options: [
      "Abychom věděli, jak žili lidé v minulosti a nezapomněli na svou historii",
      "Protože jsou hezké a zdobí pokoj",
      "Fotografie jsou povinné pro školu",
      "Aby je mohla policie použít jako důkaz",
    ],
    hints: [
      "Co bys chtěl vědět o svých prarodičích, když jejich fotky neexistují?",
      "Staré dokumenty jsou jako most mezi minulostí a přítomností.",
    ],
    explanation: "Staré fotografie a dokumenty jsou důkazem toho, jak žili lidé v minulosti. Pomáhají nám pochopit historii naší rodiny i celého národa a nezapomenout na ni.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
}

export const CASOVAPRIMKAGENERACE: TopicMetadata[] = [
  {
    id: "g3-prvouka-lide-a-cas-minulost-a-soucasnost-casova-primka-generace-v-rodine",
    rvpNodeId: "g3-prvouka-lide-a-cas-minulost-a-soucasnost-casova-primka-generace-v-rodine",
    title: "Časová přímka, generace v rodině",
    studentTitle: "Čas a rodina",
    subject: "prvouka",
    category: "Lidé a čas",
    topic: "Minulost a současnost",
    briefDescription: "Pracuješ s časovou přímkou a poznáš generace v rodině.",
    keywords: [
      "časová přímka",
      "generace",
      "prarodiče",
      "rodiče",
      "minulost",
      "přítomnost",
      "budoucnost",
      "rodokmen",
      "kronika",
      "archiv",
    ],
    goals: [
      "Vysvětlit, co je časová přímka a k čemu slouží.",
      "Pojmenovat tři generace v rodině (prarodiče, rodiče, děti).",
      "Rozlišit pojmy minulost, přítomnost a budoucnost.",
      "Uvést příklady toho, jak se věci změnily v čase.",
      "Vysvětlit, co je kronika a archiv.",
    ],
    boundaries: [
      "Pouze základní pojmy — bez podrobné práce s historickými prameny.",
      "Generace v rámci rodiny (3 generace), bez dalšího rozšíření.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Generace: prarodiče (1.), rodiče (2.), děti (3.). Časová přímka jde od minulosti (vlevo) přes přítomnost k budoucnosti (vpravo).",
      steps: [
        "Časová přímka zobrazuje události v pořadí od nejstarší po nejnovější.",
        "Minulost = co bylo, přítomnost = co je teď, budoucnost = co bude.",
        "Rodina má 3 generace: prarodiče → rodiče → děti.",
        "Rodokmen je strom příbuzenských vztahů.",
        "Kronika = kniha záznamů událostí, archiv = místo pro uchovávání dokumentů.",
      ],
      commonMistake: "Prarodiče patří do 1. generace (nejstarší), ne do 3. generace.",
      example: "Na časové přímce: stavba hradu (700 let) je vlevo, tvoje narozeniny (8 let) jsou vpravo — blíže k přítomnosti.",
    },
  },
];
