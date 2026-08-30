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
    question: "Co je téma literárního díla?",
    correctAnswer: "hlavní myšlenka díla",
    options: [
      "název díla na obálce",
      "hlavní myšlenka díla",
      "jméno autora knihy",
      "počet stran knihy",
    ],
    hints: ["Když knihu dočteš a někdo se zeptá, o čem to bylo, neodpovíš jménem ani počtem stran. Co tedy řekneš?"],
    explanation: "Téma je to, o čem dílo v jádru je — přátelství, odvaha, samota. Název ani autor o obsahu nic říkat nemusí.",
  },
  {
    question: "Co je motiv v literárním díle?",
    correctAnswer: "opakující se prvek v díle",
    options: [
      "hlavní postava příběhu",
      "opakující se prvek v díle",
      "název kapitoly knihy",
      "typ rýmu na konci veršů",
    ],
    hints: ["Když se knihou pořád vrací obraz vody nebo cesty, autor to nedělá náhodou. Jak se takovému prvku říká?"],
    explanation: "Motiv je drobnější prvek, který se v díle vrací a nese význam — voda, les, cesta. Téma je oproti tomu myšlenka celého díla.",
  },
  {
    question: "Co je postava v literárním díle?",
    correctAnswer: "ten, kdo v příběhu jedná",
    options: [
      "místo, kde se děj odehrává",
      "ten, kdo v příběhu jedná",
      "hlavní myšlenka díla",
      "shoda zvuků na konci veršů",
    ],
    hints: ["Rozděl možnosti na ty, které označují někoho, a ty, které označují něco. Která zbude?"],
    explanation: "Postava je osoba nebo bytost, která v příběhu něco dělá a něco prožívá. Nemusí to být člověk — může to být i zvíře nebo pohádková bytost.",
  },
  {
    question: "Co je prostředí v literárním díle?",
    correctAnswer: "místo a čas děje",
    options: [
      "hlavní myšlenka díla",
      "místo a čas děje",
      "ten, kdo příběh vypráví",
      "počet postav v ději",
    ],
    hints: ["Na jaké dvě otázky odpovíš, když chceš někomu popsat kulisy příběhu?"],
    explanation: "Prostředí odpovídá na otázky kde a kdy — les, přístav, 19. století. Kdo v něm jedná, řeší postavy, a o čem dílo je, řeší téma.",
  },
  {
    question: "Co je děj v literárním díle?",
    correctAnswer: "sled událostí v příběhu",
    options: [
      "hlavní myšlenka díla",
      "sled událostí v příběhu",
      "místo a čas příběhu",
      "jméno autora knihy",
    ],
    hints: ["Zeptej se: co se v knize postupně stalo? Která možnost tuhle otázku pokrývá?"],
    explanation: "Děj je to, co se v příběhu postupně odehraje — od zápletky k rozuzlení. Prostředí říká kde a kdy, téma říká proč to autor napsal.",
  },
  {
    question: "Co je vypravěč v literárním díle?",
    correctAnswer: "ten, kdo příběh vypráví",
    options: [
      "vždy sám autor knihy",
      "ten, kdo příběh vypráví",
      "vždy hlavní postava",
      "ten, kdo knihu čte",
    ],
    hints: ["Autor knihu napsal, ale uvnitř příběhu mluví někdo jiný — třeba stařec nebo dítě. Kdo to tedy je?"],
    explanation: "Vypravěč je hlas, kterým je příběh podán. Autor si ho vymýšlí, takže se s ním nemusí shodovat — vypravěčem může být i jedna z postav.",
  },
  {
    question: "Co je verš v básni?",
    correctAnswer: "jeden řádek básně",
    options: [
      "celá báseň dohromady",
      "jeden řádek básně",
      "skupina řádků básně",
      "dvě rýmující se slova",
    ],
    hints: ["Přemýšlej o tom, jak je báseň fyzicky rozdělená na papíře — na jakou nejmenší jednotku je rozdělená?"],
    explanation: "Verš je základní jednotka básně — jeden řádek. Několik veršů dohromady tvoří strofu a strofy dohromady celou báseň.",
  },
  {
    question: "Co je strofa v básni?",
    correctAnswer: "skupina veršů",
    options: [
      "jeden řádek básně",
      "skupina veršů",
      "celá báseň dohromady",
      "dvě rýmující se slova",
    ],
    hints: ["V básni bývají mezi některými řádky mezery navíc. Co ty mezery od sebe oddělují?"],
    explanation: "Strofa je v básni tím, čím je odstavec v próze — několik řádků oddělených mezerou. Jednotlivý řádek je verš.",
  },
  {
    question: "Co je rým v básni?",
    correctAnswer: "shoda zvuků na konci veršů",
    options: [
      "počet slabik ve verši",
      "shoda zvuků na konci veršů",
      "hlavní téma básně",
      "délka jednoho verše",
    ],
    hints: ["Proč se k sobě hodí dvojice pes – les nebo moře – hoře? Podívej se na jejich zakončení."],
    explanation: "Rým vzniká, když se zvukově shodují konce veršů. S délkou verše ani počtem slabik nesouvisí — to je věcí rytmu.",
  },
  {
    question: "Co je rytmus v básni?",
    correctAnswer: "pravidelné střídání přízvuků",
    options: [
      "počet veršů v básni",
      "pravidelné střídání přízvuků",
      "délka celé básně",
      "hlavní téma básně",
    ],
    hints: ["Přečti báseň nahlas a zaťukej si k tomu. Co v tom ťukání vytváří pravidelnost?"],
    explanation: "Rytmus tvoří pravidelné střídání silněji a slaběji vyslovených slabik. Proto báseň při čtení nahlas „drží tempo“ — na rozdíl od prózy.",
  },
  {
    question: "Co je refrén v básni?",
    correctAnswer: "opakující se verš",
    options: [
      "první verš básně",
      "opakující se verš",
      "poslední verš básně",
      "verš s nejdelším rýmem",
    ],
    hints: ["V písničkách se po každé sloce vrací tatáž část. Jak se tomu říká i v básni?"],
    explanation: "Refrén je verš nebo skupina veršů, které se v básni pravidelně vracejí. Nezáleží na tom, kde stojí poprvé — podstatné je to opakování.",
  },
  {
    question: "Přímý vypravěč (er-forma) vypráví v:",
    correctAnswer: "3. osobě – on/ona/oni",
    options: [
      "1. osobě – já",
      "2. osobě – ty",
      "3. osobě – on/ona/oni",
      "1. osobě množného čísla",
    ],
    hints: ["Vypravěč u er-formy stojí mimo příběh a mluví o postavách zvenčí — sám sebe neoznačuje jako 'já' a postavy neoslovuje jako 'ty'."],
    explanation: "Er-forma znamená, že vypravěč o postavách mluví zvenčí: 'Šel domů.' Sám v příběhu nevystupuje, takže o sobě nemluví jako o 'já'.",
  },
  {
    question: "Ich-forma vypravěče znamená:",
    correctAnswer: "vypravěč je postava a mluví jako já",
    options: [
      "vypravěč stojí mimo příběh",
      "vypravěč je postava a mluví jako já",
      "vypravěč mluví o jiné osobě",
      "vypravěč oslovuje čtenáře",
    ],
    hints: ["'Ich' je německé slovo pro první osobu. Zamysli se: je vypravěč uvnitř nebo vně příběhu, a v jaké osobě proto mluví?"],
    explanation: "U ich-formy vypráví jedna z postav svůj vlastní příběh: 'Šel jsem domů.' Čtenář proto vidí děj jen jejíma očima.",
  },
  {
    question: "Co je hlavní postava?",
    correctAnswer: "postava, kolem které se točí děj",
    options: [
      "každá postava v příběhu",
      "postava, kolem které se točí děj",
      "vždy záporná postava",
      "postava, která nemluví",
    ],
    hints: ["Kdyby ses měl někoho z příběhu zbavit, bez které postavy by se děj úplně rozpadl?"],
    explanation: "Hlavní postava (protagonista) je ta, jejíž osud příběh sleduje. Být kladná nebo záporná přitom nemusí — rozhoduje, že stojí v centru děje.",
  },
  {
    question: "Co je antagonista?",
    correctAnswer: "postava stojící proti hrdinovi",
    options: [
      "hlavní kladná postava",
      "postava stojící proti hrdinovi",
      "vedlejší veselá postava",
      "vypravěč celého příběhu",
    ],
    hints: ["Předpona 'anti-' znamená 'proti'. Proti komu tedy taková postava stojí?"],
    explanation: "Antagonista je ten, kdo hlavní postavě brání dosáhnout cíle. Nemusí to být zlosyn — překážkou může být i příbuzný nebo okolnosti.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co je lyrický subjekt?",
    correctAnswer: "hlas, který v básni mluví",
    options: [
      "vždy sám autor básně",
      "hlas, který v básni mluví",
      "hlavní postava příběhu",
      "čtenář, který báseň čte",
    ],
    hints: ["Když v básni stojí 'já', je to nutně ten člověk, který ji napsal? Zkus si představit báseň psanou z pohledu starce."],
    explanation: "Lyrický subjekt je ten, kdo v básni promlouvá. Bývá autorovi blízký, ale básník může psát i z pohledu někoho úplně jiného.",
  },
  {
    question: "Co je charakteristika postavy?",
    correctAnswer: "popis vlastností a chování",
    options: [
      "jméno a věk postavy",
      "popis vlastností a chování",
      "seznam činů postavy",
      "místo, kde postava žije",
    ],
    hints: ["Jméno a věk ti o člověku moc neřeknou. Co potřebuješ vědět, abys ho poznal?"],
    explanation: "Charakteristika říká, jaká postava je — jak vypadá, jak se chová a jaké má vlastnosti. Samotné údaje jako jméno nebo bydliště to nezachytí.",
  },
  {
    question: "Co je přímá charakteristika postavy?",
    correctAnswer: "autor vlastnosti přímo pojmenuje",
    options: [
      "čtenář si je odvodí z chování",
      "autor vlastnosti přímo pojmenuje",
      "postava si dává přezdívky",
      "vlastnosti se vůbec neuvádějí",
    ],
    hints: ["Ve větě 'Pavel byl statečný a laskavý' se čtenář nemusí nic domýšlet. Kdo tu vlastnost vyslovil?"],
    explanation: "U přímé charakteristiky autor vlastnost rovnou pojmenuje. Čtenář ji tak dostane hotovou a nemusí ji vyvozovat z jednání postavy.",
  },
  {
    question: "Co je nepřímá charakteristika postavy?",
    correctAnswer: "čtenář si je odvodí z chování",
    options: [
      "autor vlastnosti přímo pojmenuje",
      "čtenář si je odvodí z chování",
      "postava si dává přezdívky",
      "vlastnosti určí jiná postava",
    ],
    hints: ["Ve větě 'Vběhl do hořícího domu pro kotě' není žádné přídavné jméno. Přesto o postavě něco víš — odkud?"],
    explanation: "U nepřímé charakteristiky autor vlastnost nepojmenuje, ale ukáže ji jednáním a slovy postavy. Závěr si udělá čtenář sám.",
  },
  {
    question: "Co je kompozice literárního díla?",
    correctAnswer: "uspořádání částí díla",
    options: [
      "hlavní myšlenka díla",
      "uspořádání částí díla",
      "jazyk, kterým je psáno",
      "počet postav v díle",
    ],
    hints: ["Dvě knihy mohou vyprávět totéž, a přesto jedna začne od narození hrdiny a druhá od jeho smrti. Čím se liší?"],
    explanation: "Kompozice je stavba díla — z jakých částí se skládá a v jakém pořadí jdou za sebou. Obsah přitom může zůstat stejný.",
  },
  {
    question: "Co je alegorie?",
    correctAnswer: "příběh se skrytým významem",
    options: [
      "příběh bez skrytého významu",
      "příběh se skrytým významem",
      "opakování hlásky na začátku",
      "shoda zvuků na konci veršů",
    ],
    hints: ["V bajce vystupují zvířata, ale mluví se přitom o lidech. Jak se říká takovému dvojímu čtení?"],
    explanation: "Alegorie vypráví jeden příběh, ale míní jiný — zvířata v bajce zastupují lidské vlastnosti. Čtenář má rozpoznat druhou rovinu.",
  },
  {
    question: "Co je symbol v literárním textu?",
    correctAnswer: "obraz zastupující něco jiného",
    options: [
      "jméno hlavní postavy",
      "obraz zastupující něco jiného",
      "opakující se verš básně",
      "shoda zvuků na konci veršů",
    ],
    hints: ["Proč se holubice objevuje na plakátech proti válce? Zastupuje sama sebe, nebo něco dalšího?"],
    explanation: "Symbol je konkrétní věc, která odkazuje k něčemu nehmotnému — holubice k míru, srdce k lásce. Význam mu dává ustálená domluva mezi lidmi.",
  },
  {
    question: "Co je kontrast v literárním díle?",
    correctAnswer: "postavení protikladů vedle sebe",
    options: [
      "opakování stejného prvku",
      "postavení protikladů vedle sebe",
      "pravidelné střídání přízvuků",
      "zjemnění nepříjemné zprávy",
    ],
    hints: ["Proč autor postaví chudou chalupu hned vedle zámku? Co tím u čtenáře zdůrazní?"],
    explanation: "Kontrast staví vedle sebe dvě protikladné věci — světlo a tmu, bohatství a bídu — aby rozdíl mezi nimi vynikl.",
  },
  {
    question: "Co je přirovnání v literárním textu?",
    correctAnswer: "srovnání pomocí slova jako",
    options: [
      "přenesené pojmenování bez jako",
      "srovnání pomocí slova jako",
      "opakování slova na začátku",
      "záměrné přehánění skutečnosti",
    ],
    hints: ["Věta 'Utíkal rychle jako blesk' srovnává dvě věci — všimni si, které slovo to srovnání spojuje."],
    explanation: "Přirovnání spojuje dvě věci výslovně, nejčastěji slovem 'jako'. Když spojovací slovo chybí a věc je pojmenovaná rovnou jinak, jde o metaforu.",
  },
  {
    question: "Co je metafora v literárním textu?",
    correctAnswer: "přenesené pojmenování bez jako",
    options: [
      "srovnání pomocí slova jako",
      "přenesené pojmenování bez jako",
      "opakování slova na konci",
      "zjemnění nepříjemné zprávy",
    ],
    hints: ["Spojení 'moře slz' netvrdí, že tam je opravdu moře, a přesto nepoužívá žádné spojovací slovo. Jak takový obrat funguje?"],
    explanation: "Metafora pojmenuje věc názvem něčeho jiného na základě podobnosti — bez 'jako'. Právě chybějící spojovací slovo ji odlišuje od přirovnání.",
  },
  {
    question: "Co je personifikace?",
    correctAnswer: "neživé věci jednají jako lidé",
    options: [
      "lidé jsou popsáni jako věci",
      "neživé věci jednají jako lidé",
      "srovnání pomocí slova jako",
      "záměrné přehánění skutečnosti",
    ],
    hints: ["Ve spojení 'les šeptá' dělá les něco, co umí jen člověk. Jakým směrem se ta vlastnost přenesla?"],
    explanation: "Personifikace přisuzuje lidské jednání a pocity neživým věcem nebo zvířatům — les šeptá, kameny sní. Opačný směr by personifikace nebyl.",
  },
  {
    question: "Co je hyperbola?",
    correctAnswer: "záměrné přehánění",
    options: [
      "záměrné zmenšování",
      "záměrné přehánění",
      "srovnání pomocí jako",
      "zjemnění nepříjemné zprávy",
    ],
    hints: ["Věta 'Čekal jsem celou věčnost' není myšlená doslova. Jakým směrem autor skutečnost posunul?"],
    explanation: "Hyperbola nadsazuje, aby výrok zesílila — 'sto let jsem tě neviděl'. Autor nechce, aby mu čtenář věřil doslova.",
  },
  {
    question: "Co je eufemismus?",
    correctAnswer: "zjemnění nepříjemné zprávy",
    options: [
      "záměrné přehánění skutečnosti",
      "zjemnění nepříjemné zprávy",
      "opakování slova na začátku",
      "spojení protikladných slov",
    ],
    hints: ["Proč lidé raději řeknou 'odešel od nás' než to tvrdší slovo? Co tím se sdělením udělají?"],
    explanation: "Eufemismus nahradí tvrdý výraz ohleduplnějším, aby zpráva tolik nezraňovala. Obsah se nemění, mění se jen jeho ostrost.",
  },
  {
    question: "Co je anafora v básni?",
    correctAnswer: "opakování slova na začátku veršů",
    options: [
      "opakování slova na konci veršů",
      "opakování slova na začátku veršů",
      "shoda zvuků na konci veršů",
      "pravidelné střídání přízvuků",
    ],
    hints: ["'Každý ví… Každý cítí… Každý vidí…' — v které části veršů se tu něco vrací?"],
    explanation: "Anafora opakuje totéž slovo nebo spojení na začátcích po sobě jdoucích veršů. Kdyby se opakovalo na koncích, šlo by o epiforu.",
  },
  {
    question: "Co je aliterace?",
    correctAnswer: "opakování hlásky na začátku slov",
    options: [
      "opakování celého slova ve verši",
      "opakování hlásky na začátku slov",
      "shoda zvuků na konci veršů",
      "spojení protikladných slov",
    ],
    hints: ["Ve verši 'Šuměly šeptem šedivé šlahouny' se něco vrací v každém slově. Je to celé slovo, nebo jen jeho začátek?"],
    explanation: "Aliterace opakuje stejnou hlásku na začátcích sousedních slov a vytváří tím zvukový efekt. Neopakuje se celé slovo, jen jeho první hláska.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co je ironie v literárním textu?",
    correctAnswer: "výrok s opačným smyslem",
    options: [
      "srovnání pomocí slova jako",
      "výrok s opačným smyslem",
      "přenesené pojmenování",
      "záměrné přehánění",
    ],
    hints: ["Když někdo po prohraném zápase řekne 'To byl ale výkon', myslí to vážně?"],
    explanation: "Ironie říká pravý opak toho, co má na mysli — a spoléhá, že to posluchač pozná ze situace nebo tónu.",
  },
  {
    question: "Co je sarkasmus?",
    correctAnswer: "ostrá, zraňující ironie",
    options: [
      "mírná, laskavá ironie",
      "ostrá, zraňující ironie",
      "srovnání pomocí jako",
      "spojení protikladných slov",
    ],
    hints: ["Sarkasmus je blízký příbuzný ironie. Liší se tím, jak moc má bolet."],
    explanation: "Sarkasmus je vyhrocená ironie, jejímž cílem je zasáhnout. Běžná ironie může být i laskavá nebo hravá.",
  },
  {
    question: "Co je epifora?",
    correctAnswer: "opakování slova na konci veršů",
    options: [
      "opakování slova na začátku veršů",
      "opakování slova na konci veršů",
      "opakování hlásky na začátku slov",
      "shoda zvuků na konci veršů",
    ],
    hints: ["Je to zrcadlový protějšek anafory. Kde tedy k opakování dochází?"],
    explanation: "Epifora opakuje totéž slovo na koncích po sobě jdoucích veršů. Na rozdíl od rýmu se neshodují jen zvuky, ale vrací se celé slovo.",
  },
  {
    question: "Co je synestezie v literárním textu?",
    correctAnswer: "prolínání různých smyslů",
    options: [
      "srovnání pomocí slova jako",
      "prolínání různých smyslů",
      "spojení protikladných slov",
      "záměrné přehánění skutečnosti",
    ],
    hints: ["'Slyším barvu' nebo 'cítím hudbu' míchají dohromady dva různé smysly, které normálně fungují odděleně."],
    explanation: "Synestezie popisuje vjem jednoho smyslu slovníkem jiného — ostrý zvuk, sladká vůně tónu. Vzniká tím nezvyklý, silný obraz.",
  },
  {
    question: "Co je oxymóron?",
    correctAnswer: "spojení protikladných slov",
    options: [
      "prolínání různých smyslů",
      "spojení protikladných slov",
      "srovnání pomocí slova jako",
      "opakování slova na začátku",
    ],
    hints: ["Spojení 'mrtvé milenky cit' nebo 'živá smrt' si samo odporuje. V čem je ten rozpor?"],
    explanation: "Oxymóron staví do jednoho spojení dvě slova, která se navzájem vylučují. Rozpor je záměrný — má čtenáře zastavit a přinutit přemýšlet.",
  },
  {
    question: "Co je parabola (podobenství)?",
    correctAnswer: "příběh s poučením",
    options: [
      "příběh bez jakéhokoli poučení",
      "příběh s poučením",
      "báseň s tragickým koncem",
      "vyprávění o vlastním životě",
    ],
    hints: ["Krátké biblické příběhy se nevyprávějí kvůli ději samotnému. Kvůli čemu tedy?"],
    explanation: "Parabola je jednoduchý příběh vyprávěný proto, aby z něj plynulo ponaučení. Děj je jen prostředek, důležitý je závěr, který si čtenář odnese.",
  },
  {
    question: "Co je leitmotiv?",
    correctAnswer: "opakující se motiv v díle",
    options: [
      "jednorázový nápad autora",
      "opakující se motiv v díle",
      "shoda zvuků na konci veršů",
      "srovnání pomocí slova jako",
    ],
    hints: ["Když se dílem táhne stále tentýž obraz jako červená nit, jak se tomu prvku říká?"],
    explanation: "Leitmotiv se v díle vrací znovu a znovu a spojuje jeho části dohromady. Prvek, který se objeví jen jednou, leitmotivem není.",
  },
  {
    question: "Co je gradace?",
    correctAnswer: "stupňování intenzity",
    options: [
      "zeslabování intenzity",
      "stupňování intenzity",
      "opakování stejných slov",
      "spojení protikladných slov",
    ],
    hints: ["V řadě 'zašeptal – řekl – zakřičel' se něco postupně mění. Kterým směrem?"],
    explanation: "Gradace řadí výrazy tak, aby jejich síla postupně rostla a napětí stoupalo. Opačný postup by účinek naopak tlumil.",
  },
  {
    question: "Co je katarze?",
    correctAnswer: "citová očista diváka",
    options: [
      "citové otupení diváka",
      "citová očista diváka",
      "poučení na konci díla",
      "shrnutí děje pro diváka",
    ],
    hints: ["Proč se lidem po smutném filmu často uleví, i když plakali? Co se v nich odehrálo?"],
    explanation: "Katarze je úleva a vnitřní očista, kterou divák prožije, když s postavami projde silnými city. Není to poučení, ale citový zážitek.",
  },
  {
    question: "Co je chronologická kompozice?",
    correctAnswer: "děj postupuje podle času",
    options: [
      "děj se vrací do minulosti",
      "děj postupuje podle času",
      "děj začíná až závěrem",
      "děj nemá žádné pořadí",
    ],
    hints: ["Řecké 'chronos' znamená čas. Jak se podle toho příběh odvíjí?"],
    explanation: "Chronologická kompozice vypráví události v tom pořadí, v jakém se staly — od nejstarší k nejnovější. Čtenář se tak nikam nevrací.",
  },
  {
    question: "Co je retrospektivní kompozice?",
    correctAnswer: "děj se vrací do minulosti",
    options: [
      "děj postupuje podle času",
      "děj se vrací do minulosti",
      "děj je zcela bez pořadí",
      "děj se odehrává v budoucnu",
    ],
    hints: ["Předpona 'retro-' znamená 'zpět'. Postupuje takové vyprávění jen dopředu, nebo se v určité chvíli obrací?"],
    explanation: "Retrospektivní kompozice začne v přítomnosti a teprve pak se vrací k dřívějším událostem, aby vysvětlila, jak k dnešnímu stavu došlo.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const ELEMENTARNILITERARNIPOJMYPRIROZBORUTEXTU: TopicMetadata[] = [
  {
    id: "g5-cjl-literarni-vychova-prace-s-textem-elementarni-literarni-pojmy-pri-rozboru-textu",
    rvpNodeId: "g5-cjl-literarni-vychova-prace-s-textem-elementarni-literarni-pojmy-pri-rozboru-textu",
    title: "Elementární literární pojmy při rozboru textu",
    studentTitle: "Rozbor textu",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Práce s textem",
    briefDescription: "Naučíš se základní literární pojmy pro rozbor textu.",
    keywords: ["téma", "motiv", "postava", "prostředí", "děj", "vypravěč", "verš", "strofa", "rým"],
    goals: [
      "Používat základní literární pojmy správně",
      "Rozebrat literární text pomocí pojmů (téma, motiv, postava, prostředí)",
      "Popsat formu básně (verš, strofa, rým, rytmus)",
    ],
    boundaries: [
      "Bez pokročilé naratologie a literární teorie",
      "Rozšiřující nad rámec RVP 5. ročníku: figury a pojmy v úrovni 3 (epifora, synestezie, oxymóron, parabola, katarze, kompozice)",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Téma = o čem dílo je. Motiv = opakující se prvek. Postava = kdo jedná. Prostředí = kde a kdy. Děj = co se stalo. Vypravěč = kdo to vypráví.",
      steps: [
        "Přečti text.",
        "Urči téma: o čem to je celkově?",
        "Najdi postavy: kdo jedná?",
        "Popiš prostředí: kde a kdy se to děje?",
        "Sleduj děj: co se stalo?",
        "Zjisti vypravěče: mluvčí = já nebo on/ona?",
      ],
      commonMistake: "Žáci si pletou téma a motiv. Téma = hlavní myšlenka celého díla. Motiv = opakující se prvek (voda, les).",
      example: "Téma: odvaha. Motiv: moře (vrací se). Postava: Jan. Prostředí: přístav, 19. st. Vypravěč: er-forma (on/ona).",
    },
  },
];
