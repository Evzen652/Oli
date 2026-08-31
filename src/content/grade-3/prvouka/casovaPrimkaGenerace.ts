import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: základní pojmy (časová přímka, generace, minulost/
//        přítomnost/budoucnost, rodokmen, kronika, kronikář, archiv)
//   L2 = aplikace: pojem na konkrétní scénář (změna telefonu/školy/dopravy,
//        zařazení strýce/tety/bratrance do generace, zařazení situace do
//        minulosti/přítomnosti/budoucnosti)
//   L3 = transfer: numerické úlohy s roky, porovnání 4 časových vzdáleností,
//        inferenční otázky o významu pramenů napříč generacemi
// Boundary: jen 3 generace v rodině (prarodiče, rodiče, děti) — bez
// prarodičů prarodičů nebo dalších generací.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
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
      "Na časové přímce jsou události seřazeny od nejstarší po nejnovější.",
    ],
    explanation: "Časová přímka je čára, na které jsou události zaznačeny v pořadí, jak šly za sebou. Pomáhá nám přehledně vidět, co se stalo dříve a co později.",
  },
  {
    question: "Která generace jsou prarodiče (babička a děda)?",
    correctAnswer: "První generace",
    options: ["První generace", "Druhá generace", "Třetí generace", "Čtvrtá generace"],
    hints: [
      "Generace se počítají od nejstarších k nejmladším.",
      "Prarodiče jsou v rodině nejstarší — když bychom pokolení řadili podle věku od nejstaršího, na kterém místě by stáli?",
    ],
    explanation: "Prarodiče (babička a děda) patří do první (nejstarší) generace v rodině. Jsou rodiči tvých rodičů.",
  },
  {
    question: "Která generace jsou rodiče (máma a táta)?",
    correctAnswer: "Druhá generace",
    options: ["Druhá generace", "První generace", "Třetí generace", "Nultá generace"],
    hints: [
      "Rodiče jsou mladší než prarodiče, ale starší než ty.",
      "Rodiče přišli na svět hned po prarodičích, ale dřív než ty — kolikátí jsou tedy v pořadí, když prarodiče počítáme jako první?",
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
      "Události v minulosti zapisujeme například do kronik.",
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
    explanation: "Přítomnost je čas, který právě prožíváme. Je to „teď“ — co se děje v této chvíli.",
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
      "Slovo „rod“ znamená rodina, „kmen“ je hlavní část stromu.",
    ],
    explanation: "Rodokmen je schéma (strom nebo tabulka), které zobrazuje členy rodiny a ukazuje, jak jsou navzájem příbuzní. Vidíme v něm prarodiče, rodiče, děti a jejich vztahy.",
  },
  {
    question: "Co je to kronika?",
    correctAnswer: "Kniha, kam se zapisují události tak, jak se staly",
    options: [
      "Strom příbuzenských vztahů rodiny",
      "Kniha, kam se zapisují události tak, jak se staly",
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
    question: "Kdo je kronikář?",
    correctAnswer: "Člověk, který zapisuje důležité události do kroniky",
    options: [
      "Člověk, který zapisuje důležité události do kroniky",
      "Člověk, který uchovává staré dokumenty v archivu",
      "Nejstarší člen rodiny",
      "Člověk, který kreslí rodokmen",
    ],
    hints: [
      "Kronikář je jako „zapisovatel“ historie obce nebo školy.",
      "Bez kronikáře by kronika zůstala prázdná.",
    ],
    explanation: "Kronikář je člověk, který má na starosti vedení kroniky — pravidelně do ní zapisuje důležité události, aby se na ně nezapomnělo.",
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
    question: "Kolik generací obvykle rozlišujeme v jedné rodině (prarodiče, rodiče, děti)?",
    correctAnswer: "Tři generace",
    options: ["Tři generace", "Dvě generace", "Čtyři generace", "Pět generací"],
    hints: [
      "Vyjmenuj je: prarodiče, rodiče, děti.",
      "Spočítej skupiny, ne jednotlivé lidi.",
    ],
    explanation: "V rodině obvykle rozlišujeme tři generace: prarodiče (1.), rodiče (2.) a děti (3.).",
  },
  {
    question: "Kterým směrem na časové přímce jdeme od minulosti k budoucnosti?",
    correctAnswer: "Zleva doprava",
    options: ["Zleva doprava", "Zprava doleva", "Shora dolů", "Zdola nahoru"],
    hints: [
      "Nejstarší události kreslíme na časovou přímku vlevo.",
      "Podobně jako čteme text — od levé strany k pravé.",
    ],
    explanation: "Na časové přímce jdou události zleva doprava — vlevo je minulost, uprostřed přítomnost a vpravo budoucnost.",
  },
  {
    question: "Co znamená slovo 'generace'?",
    correctAnswer: "Skupina lidí podobného věku v rodině, například prarodiče, rodiče nebo děti",
    options: [
      "Skupina lidí podobného věku v rodině, například prarodiče, rodiče nebo děti",
      "Kniha, do které se zapisují události",
      "Místo, kde se uchovávají staré fotografie",
      "Jiné slovo pro rodokmen",
    ],
    hints: [
      "Generace odděluje lidi v rodině do skupin podle toho, jak jsou staří — kolik takových skupin dokážeš ve své rodině najít?",
      "Prarodiče a rodiče jsou dvě různé generace.",
    ],
    explanation: "Generace je skupina lidí přibližně stejného věku v rodině. V rodině rozlišujeme tři generace: prarodiče, rodiče a děti.",
  },
];

const POOL_L2: PracticeTask[] = [
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
    explanation: "V době prarodičů byly telefony velké, pevné a připojené ke zdi — říkalo se jim „pevná linka“. Dnes máme malé mobilní telefony, které nosíme všude s sebou.",
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
    correctAnswer: "Dřív koňské povozy a parní vlaky, dnes auta, vlaky a letadla",
    options: [
      "Dříve se létalo letadlem více než dnes",
      "Dřív koňské povozy a parní vlaky, dnes auta, vlaky a letadla",
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
    question: "Do které generace patří teta (sestra maminky nebo tatínka)?",
    correctAnswer: "Do druhé generace, protože je to sourozenec rodičů",
    options: [
      "Do druhé generace, protože je to sourozenec rodičů",
      "Do první generace, protože je stejně stará jako babička",
      "Do třetí generace, protože je mladší než rodiče",
      "Generace tety se nepočítá",
    ],
    hints: [
      "Teta je sourozenec maminky nebo tatínka — je tedy stejná generace jako oni.",
      "Sourozenci patří vždy do stejné generace.",
    ],
    explanation: "Teta je sourozenec jednoho z rodičů, a proto patří do stejné (druhé) generace jako rodiče — ne mezi prarodiče ani mezi děti.",
  },
  {
    question: "Do které generace patří bratranec (syn strýce nebo tety)?",
    correctAnswer: "Do třetí generace, protože je to dítě stejně jako ty",
    options: [
      "Do třetí generace, protože je to dítě stejně jako ty",
      "Do druhé generace, protože je synem rodičova sourozence",
      "Do první generace, protože je nejstarší v rodině",
      "Bratranec nepatří do žádné generace",
    ],
    hints: [
      "Bratranec je dítě tety nebo strýce — je tedy stejná generace jako ty.",
      "Děti sourozenců rodičů patří do stejné generace jako ty.",
    ],
    explanation: "Bratranec je syn strýce nebo tety, a proto patří do třetí generace — stejné, do jaké patříš ty.",
  },
  {
    question: "Jaké je správné pořadí generací od nejstarší po nejmladší?",
    correctAnswer: "Prarodiče, rodiče, děti",
    options: [
      "Prarodiče, rodiče, děti",
      "Děti, rodiče, prarodiče",
      "Rodiče, prarodiče, děti",
      "Děti, prarodiče, rodiče",
    ],
    hints: [
      "Generace jdou od nejstarších k nejmladším.",
      "Přemýšlej, ve kterém pořadí lidé v rodině přicházejí na svět — kdo je časem nejstarší?",
    ],
    explanation: "Správné pořadí generací od nejstarší po nejmladší je: prarodiče (1. generace) → rodiče (2. generace) → děti (3. generace). Prarodiče se narodili jako první.",
  },
  {
    question: "Babička ti ukazuje fotografii ze svých deseti let. Do jaké části času tato fotka patří?",
    correctAnswer: "Do minulosti",
    options: ["Do minulosti", "Do přítomnosti", "Do budoucnosti", "Do žádné z těchto možností"],
    hints: [
      "Fotka zachycuje něco, co se už dávno stalo.",
      "Babička dnes už deset let nemá — je to dávná událost.",
    ],
    explanation: "Fotografie zachycuje událost, která se už stala, tedy patří do minulosti.",
  },
  {
    question: "Přemýšlíš, kam pojedeš příští léto na dovolenou. Do jaké části času tato úvaha patří?",
    correctAnswer: "Do budoucnosti",
    options: ["Do budoucnosti", "Do minulosti", "Do přítomnosti", "Do žádné z těchto možností"],
    hints: [
      "Příští léto ještě nenastalo.",
      "Plány na dovolenou se týkají něčeho, co teprve přijde.",
    ],
    explanation: "Příští léto ještě nenastalo, takže úvaha o dovolené patří do budoucnosti.",
  },
  {
    question: "Právě teď píšeš úkol do sešitu. Do jaké části času tato činnost patří?",
    correctAnswer: "Do přítomnosti",
    options: ["Do přítomnosti", "Do minulosti", "Do budoucnosti", "Do žádné z těchto možností"],
    hints: [
      "Slovo „právě teď“ napovídá, o jaký čas jde.",
      "Co děláš v tuto chvíli, to je vždy přítomnost.",
    ],
    explanation: "Psaní úkolu právě teď je činnost, kterou prožíváš v tomto okamžiku — patří tedy do přítomnosti.",
  },
  {
    question: "Jak se změnilo oblékání od doby prarodičů do dnes?",
    correctAnswer: "Dříve se lidé oblékali formálněji a šili si oblečení sami, dnes se oblečení hlavně kupuje hotové",
    options: [
      "Dříve se lidé oblékali formálněji a šili si oblečení sami, dnes se oblečení hlavně kupuje hotové",
      "Oblékání se za tu dobu vůbec nezměnilo",
      "Dříve nosili lidé více moderních značkových oděvů než dnes",
      "Dříve se oblečení vůbec nenosilo",
    ],
    hints: [
      "Podívej se na staré fotografie prarodičů — jak byli oblečení?",
      "Dnes si oblečení většinou kupujeme v obchodě.",
    ],
    explanation: "V době prarodičů se lidé oblékali formálněji a oblečení si často šili nebo nechávali šít sami. Dnes se oblečení hlavně kupuje hotové v obchodech.",
  },
  {
    question: "Jak se změnila komunikace mezi lidmi od doby prarodičů do dnes?",
    correctAnswer: "Dřív se psaly dopisy a čekalo se dny, dnes zprávy dorazí hned",
    options: [
      "Dříve lidé komunikovali rychleji než dnes",
      "Dřív se psaly dopisy a čekalo se dny, dnes zprávy dorazí hned",
      "Komunikace se vůbec nezměnila",
      "Dopisy se používají čím dál víc a mobily méně",
    ],
    hints: [
      "Přemýšlej, jak dlouho trvalo, než dopis dorazil k adresátovi.",
      "Dnes odešleš zprávu a druhá osoba ji přečte během pár vteřin.",
    ],
    explanation: "V době prarodičů se lidé domlouvali hlavně dopisy, na jejichž doručení se čekalo i několik dní. Dnes díky mobilům a internetu posíláme zprávy okamžitě.",
  },
  {
    question: "Kdo by měl do obecní kroniky zapsat, že se ve vesnici postavila nová škola?",
    correctAnswer: "Kronikář",
    options: ["Kronikář", "Archivář", "Kterýkoliv žák ze školy", "Nikdo, do kroniky se zapisují jen narození"],
    hints: [
      "Do kroniky zapisuje důležité události ten, kdo ji vede.",
      "Není to náhodný člověk ani archivář — obec má pro tenhle úkol svou funkci.",
    ],
    explanation: "Postavení nové školy je důležitá událost v obci, a proto ji zapíše kronikář — člověk, který vede kroniku.",
  },
  {
    question: "Kam se obrátíš, když chceš najít staré fotografie vesnice z doby, kdy tam žili tvoji prarodiče?",
    correctAnswer: "Do archivu",
    options: ["Do archivu", "Do rodokmenu", "Do budoucnosti", "Na časovou přímku"],
    hints: [
      "Staré fotografie a dokumenty se uchovávají na jednom konkrétním místě.",
      "Archiv je jako knihovna pro historické záznamy.",
    ],
    explanation: "Staré fotografie a dokumenty se uchovávají v archivu — tam je nejlepší místo, kde je hledat.",
  },
  {
    question: "Jak se změnily hračky od doby prarodičů do dnes?",
    correctAnswer: "Dříve byly hračky hlavně dřevěné a ruční výroby, dnes jsou často elektronické a na baterky",
    options: [
      "Dříve byly hračky hlavně dřevěné a ruční výroby, dnes jsou často elektronické a na baterky",
      "Hračky se za tu dobu vůbec nezměnily",
      "Dříve byly hračky elektronické, dnes jsou dřevěné",
      "Dříve děti hračky vůbec neměly",
    ],
    hints: [
      "Přemýšlej, z čeho byly vyrobeny hračky, které měla babička jako malá.",
      "Dnes mnoho hraček svítí, hraje nebo jezdí na baterky.",
    ],
    explanation: "V době prarodičů byly hračky často vyrobené z dřeva ručně, případně doma. Dnes jsou hračky často elektronické, plastové a na baterky.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Dědeček se narodil v roce 1955. Kolik mu bylo, když se v roce 2005 narodil vnuk?",
    correctAnswer: "50 let",
    options: ["50 let", "45 let", "55 let", "60 let"],
    hints: [
      "Odečti rok narození dědečka od roku, kdy se narodil vnuk.",
      "2005 − 1955 = ?",
    ],
    explanation: "2005 − 1955 = 50. Dědečkovi bylo v roce 2005 přesně 50 let.",
  },
  {
    question: "Babička se narodila v roce 1960. Kolik jí bylo v roce 2000, kdy se narodila její první vnučka?",
    correctAnswer: "40 let",
    options: ["40 let", "30 let", "35 let", "45 let"],
    hints: [
      "Odečti rok narození babičky od roku 2000.",
      "2000 − 1960 = ?",
    ],
    explanation: "2000 − 1960 = 40. Babičce bylo v roce 2000 40 let.",
  },
  {
    question: "Táta se narodil v roce 1980. V jakém roce mu bylo 25 let?",
    correctAnswer: "V roce 2005",
    options: ["V roce 2005", "V roce 2000", "V roce 2010", "V roce 1995"],
    hints: [
      "K roku narození přičti 25 let.",
      "1980 + 25 = ?",
    ],
    explanation: "1980 + 25 = 2005. Tátovi bylo 25 let v roce 2005.",
  },
  {
    question: "Maminka se narodila v roce 1985. Kolik jí bude v roce 2030?",
    correctAnswer: "45 let",
    options: ["45 let", "40 let", "50 let", "35 let"],
    hints: [
      "Odečti rok narození maminky od roku 2030.",
      "2030 − 1985 = ?",
    ],
    explanation: "2030 − 1985 = 45. V roce 2030 bude mamince 45 let.",
  },
  {
    question: "Babička se narodila v roce 1950. Kolik jí bylo v roce 1980, kdy se narodila maminka?",
    correctAnswer: "30 let",
    options: ["30 let", "25 let", "35 let", "40 let"],
    hints: [
      "Odečti rok narození babičky od roku narození maminky.",
      "1980 − 1950 = ?",
    ],
    explanation: "1980 − 1950 = 30. Babičce bylo v roce 1980 30 let.",
  },
  {
    question: "Děda se narodil v roce 1948. V jakém roce mu bylo 60 let?",
    correctAnswer: "V roce 2008",
    options: ["V roce 2008", "V roce 2000", "V roce 2010", "V roce 1998"],
    hints: [
      "K roku narození přičti 60 let.",
      "1948 + 60 = ?",
    ],
    explanation: "1948 + 60 = 2008. Dědovi bylo 60 let v roce 2008.",
  },
  {
    question: "Teta (sestra maminky) se narodila v roce 1978. Kolik jí bylo v roce 2010?",
    correctAnswer: "32 let",
    options: ["32 let", "30 let", "35 let", "40 let"],
    hints: [
      "Odečti rok narození tety od roku 2010.",
      "2010 − 1978 = ?",
    ],
    explanation: "2010 − 1978 = 32. Tetě bylo v roce 2010 32 let.",
  },
  {
    question: "Rodiče se vzali v roce 2000. Ty ses narodil/a v roce 2017. Kolik let po svatbě rodičů ses narodil/a?",
    correctAnswer: "17 let",
    options: ["17 let", "15 let", "20 let", "10 let"],
    hints: [
      "Odečti rok svatby od roku tvého narození.",
      "2017 − 2000 = ?",
    ],
    explanation: "2017 − 2000 = 17. Narodil/a ses 17 let po svatbě rodičů.",
  },
  {
    question: "Která z těchto událostí je nejdál v minulosti?",
    correctAnswer: "Svatba prarodičů před 45 lety",
    options: [
      "Svatba prarodičů před 45 lety",
      "Narození maminky před 30 lety",
      "Tvoje narození před 9 lety",
      "Nástup do školy před 4 lety",
    ],
    hints: [
      "Nejdál v minulosti je událost s největším počtem let.",
      "Porovnej čísla: 45, 30, 9, 4 — které je největší?",
    ],
    explanation: "45 let je ze všech čtyř možností největší číslo, takže svatba prarodičů před 45 lety je nejdál v minulosti.",
  },
  {
    question: "Která z těchto událostí se stala nejblíže přítomnosti (je nejnovější)?",
    correctAnswer: "Narození bratra před 2 lety",
    options: [
      "Narození bratra před 2 lety",
      "Narození sestry před 6 lety",
      "Svatba rodičů před 12 lety",
      "Narození maminky před 33 lety",
    ],
    hints: [
      "Nejblíže přítomnosti je událost s nejmenším počtem let.",
      "Porovnej čísla: 2, 6, 12, 33 — které je nejmenší?",
    ],
    explanation: "2 roky je ze všech čtyř možností nejmenší číslo, takže narození bratra před 2 lety je nejnovější (nejblíže přítomnosti).",
  },
  {
    question: "Která z těchto fotografií je nejstarší?",
    correctAnswer: "Fotka z narození dědy před 70 lety",
    options: [
      "Fotka z narození dědy před 70 lety",
      "Fotka ze svatby rodičů před 15 lety",
      "Fotka z tvých narozenin před 9 lety",
      "Fotka ze začátku školy před 4 lety",
    ],
    hints: [
      "Nejstarší fotka je ta s největším počtem let.",
      "Porovnej čísla: 70, 15, 9, 4 — které je největší?",
    ],
    explanation: "70 let je ze všech čtyř možností největší číslo, takže fotka z narození dědy je nejstarší.",
  },
  {
    question: "Proč jsou pro poznání historie důležité kroniky a staré fotografie napříč generacemi?",
    correctAnswer: "Protože zaznamenávají, jak žili lidé v minulosti, a pomáhají nám to porovnat se současností",
    options: [
      "Protože zaznamenávají, jak žili lidé v minulosti, a pomáhají nám to porovnat se současností",
      "Protože jsou vzácné a dají se výhodně prodat",
      "Protože to škole nařizuje zákon",
      "Protože ukazují jen to, jaké bylo zrovna počasí",
    ],
    hints: [
      "Kronika a fotografie jsou doklady o životě našich předků — k čemu je dobré mít takový doklad, když chceme něco porovnat?",
      "Bez záznamů bychom nevěděli, jak se věci v čase změnily.",
    ],
    explanation: "Kroniky a staré fotografie zaznamenávají, jak žili lidé v jednotlivých generacích. Díky nim můžeme porovnat minulost se současností a vidět, co se změnilo.",
  },
  {
    question: "Jak poznáme z rodinné kroniky nebo starých fotografií, že se něco mezi generacemi změnilo?",
    correctAnswer: "Porovnáme zápisy a fotografie z různých let a všimneme si rozdílů",
    options: [
      "Porovnáme zápisy a fotografie z různých let a všimneme si rozdílů",
      "Prostě to uhodneme, kroniku ani fotky k tomu nepotřebujeme",
      "Zeptáme se kronikáře, aby nám to sám vymyslel",
      "Podíváme se jen na nejnovější fotku a to nám stačí",
    ],
    hints: [
      "Ke srovnání potřebuješ alespoň dva různé časové okamžiky.",
      "Změnu poznáš jen tehdy, když porovnáš staré a nové záznamy.",
    ],
    explanation: "Změnu mezi generacemi poznáme tak, že porovnáme zápisy a fotografie z různých let — všimneme si, co bylo dřív jinak než dnes.",
  },
  {
    question: "Proč je užitečné povídat si s prarodiči o tom, jak žili, když byli malí?",
    correctAnswer: "Dozvíme se o minulosti přímo od někoho, kdo ji sám zažil",
    options: [
      "Dozvíme se o minulosti přímo od někoho, kdo ji sám zažil",
      "Protože si stejně nic jiného nepamatují",
      "Protože nám tím musí půjčit peníze",
      "Protože je to povinný úkol do kroniky",
    ],
    hints: [
      "Prarodiče jsou svědci minulosti, kterou ty sám/sama nezažil/a.",
      "Vyprávění je jeden ze způsobů, jak se dozvídáme o historii rodiny.",
    ],
    explanation: "Povídání s prarodiči je cenné proto, že se od nich dozvíme o minulosti přímo od člověka, který ji sám prožil — to žádná kniha nenahradí.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
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
      example: "Dědeček se narodil v roce 1955, v roce 2005 se mu narodil vnuk — bylo mu tehdy 50 let (2005 − 1955 = 50).",
    },
  },
];
