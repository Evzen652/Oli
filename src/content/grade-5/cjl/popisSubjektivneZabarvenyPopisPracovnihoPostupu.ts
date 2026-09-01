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
    question: "Jaký typ popisu je: 'Jablko je kulaté, červené, o průměru asi 8 cm.'?",
    correctAnswer: "objektivní popis",
    options: ["objektivní popis", "subjektivní popis", "pracovní postup", "vyprávění příběhu"],
    hints: ["Obsahuje ta věta nějaké pocity nebo hodnocení, nebo jen měřitelné údaje?"],
    explanation: "Věta uvádí tvar, barvu a rozměr — samé ověřitelné údaje. Nikde není hodnocení ani dojem, takže jde o popis objektivní.",
  },
  {
    question: "Jaký typ popisu je: 'Jablko voní jako zahrada po dešti.'?",
    correctAnswer: "subjektivní popis",
    options: ["objektivní popis", "subjektivní popis", "pracovní postup", "novinová zpráva"],
    hints: ["Dá se vůně přirovnaná k zahradě po dešti změřit, nebo jde o autorův dojem?"],
    explanation: "Přirovnání vyjadřuje osobní dojem, ne měřitelnou vlastnost. Jiný člověk by vůni popsal jinak — proto je popis subjektivní.",
  },
  {
    question: "Jaký typ textu je recept na dort?",
    correctAnswer: "pracovní postup",
    options: ["objektivní popis", "subjektivní popis", "pracovní postup", "pohádka pro děti"],
    hints: ["Recept ti krok za krokem říká, co udělat v jakém pořadí. Jak se takovému textu říká?"],
    explanation: "Recept neříká, jak dort vypadá, ale co má člověk postupně udělat. Text uspořádaný do kroků v pevném pořadí je pracovní postup.",
  },
  {
    question: "Pracovní postup používá slovesa v:",
    correctAnswer: "rozkazovacím způsobu",
    options: ["podmiňovacím způsobu", "minulém čase", "budoucím čase", "rozkazovacím způsobu"],
    hints: ["Text ti přikazuje, co máš udělat. Řekne ti 'přidal bys', nebo 'přidej'?"],
    explanation: "Tvary jako 'přidej', 'smíchej', 'zahřej' jsou rozkazovací způsob. Někdy se místo nich používá infinitiv (přidat, smíchat), smysl je stejný.",
  },
  {
    question: "Subjektivně zabarvený popis obsahuje:",
    correctAnswer: "hodnocení a přirovnání",
    options: ["hodnocení a přirovnání", "jen čísla a míry", "jen technické údaje", "jen kroky postupu"],
    hints: ["Co do textu přidá autor, který chce sdělit nejen jak věc vypadá, ale i jak na něj působí?"],
    explanation: "Subjektivní popis nese autorův pohled — hodnotící přídavná jména, přirovnání, citově zabarvená slova. Čísla a míry patří k popisu objektivnímu.",
  },
  {
    question: "Objektivní popis obsahuje:",
    correctAnswer: "fakta bez hodnocení",
    options: ["osobní dojmy autora", "fakta bez hodnocení", "přirovnání a emoce", "kroky v pořadí"],
    hints: ["Popíšou dva lidé tutéž věc objektivně stejně, nebo každý jinak?"],
    explanation: "Objektivní popis uvádí jen to, co se dá ověřit — tvar, barvu, rozměry. Proto na něm dva pozorovatelé dojdou ke shodě.",
  },
  {
    question: "Kde se nejčastěji setkáme s objektivním popisem?",
    correctAnswer: "v encyklopedii a návodu",
    options: ["v románu a povídce", "v básni a písni", "v encyklopedii a návodu", "v pohádce a bajce"],
    hints: ["Kde má text čtenáře přesně informovat, a ne v něm vyvolat náladu?"],
    explanation: "Odborné a naučné texty musí být ověřitelné a jednoznačné, proto se drží faktů. Umělecké texty naopak s dojmy pracují záměrně.",
  },
  {
    question: "Kde se nejčastěji setkáme se subjektivně zabarveným popisem?",
    correctAnswer: "v literatuře a recenzi",
    options: ["v technickém návodu", "v encyklopedii", "v zákoně a vyhlášce", "v literatuře a recenzi"],
    hints: ["Kde autor záměrně sděluje i to, jak věc působí na něj?"],
    explanation: "V literatuře a v recenzi je autorův pohled smyslem textu. V návodu nebo zákoně by naopak vedl k nejednoznačnosti.",
  },
  {
    question: "Co je charakteristické pro pracovní postup?",
    correctAnswer: "pořadí kroků",
    options: ["pořadí kroků", "libovolné pořadí", "emoce a hodnocení", "přirovnání a obrazy"],
    hints: ["Co se stane, když u receptu prohodíš druhý a pátý krok?"],
    explanation: "Kroky na sebe navazují, takže jejich pořadí je závazné. Prohození by vedlo k jinému nebo zkaženému výsledku.",
  },
  {
    question: "Věta 'Přidej 200 g mouky a dobře promíchej.' patří do:",
    correctAnswer: "pracovního postupu",
    options: ["objektivního popisu", "pracovního postupu", "subjektivního popisu", "vyprávění příběhu"],
    hints: ["Popisuje ta věta, jak něco vypadá, nebo říká, co má čtenář udělat?"],
    explanation: "Obě slovesa jsou rozkazy adresované čtenáři a uvádějí přesné množství. To je typická věta pracovního postupu.",
  },
  {
    question: "Věta 'Pes má čtyři tlapy, hnědou srst a váží 15 kg.' patří do:",
    correctAnswer: "objektivního popisu",
    options: ["subjektivního popisu", "pracovního postupu", "objektivního popisu", "vyprávění příběhu"],
    hints: ["Dalo by se všechno v té větě změřit nebo spočítat?"],
    explanation: "Počet tlap, barva i hmotnost jsou ověřitelné údaje bez hodnocení. Věta proto patří k objektivnímu popisu.",
  },
  {
    question: "Věta 'Ten milý pes s hebkou srstí mi vždy zvedne náladu.' patří do:",
    correctAnswer: "subjektivního popisu",
    options: ["objektivního popisu", "pracovního postupu", "novinové zprávy", "subjektivního popisu"],
    hints: ["Slova 'milý' a 'zvedne náladu' — dají se ověřit, nebo vyjadřují autorův vztah?"],
    explanation: "Hodnocení 'milý' i sdělení o vlastní náladě jsou osobní. Jiný člověk by téhož psa mohl popsat úplně jinak.",
  },
  {
    question: "Jakou úlohu mají v pracovním postupu výrazy 'nejprve', 'poté', 'nakonec'?",
    correctAnswer: "označují pořadí kroků",
    options: ["označují pořadí kroků", "vyjadřují emoce autora", "spojují věty v souvětí", "popisují barvy věcí"],
    hints: ["Co by čtenáři chybělo, kdyby tahle slova z návodu zmizela?"],
    explanation: "Tyhle výrazy říkají, co přijde dřív a co později, takže drží kroky ve správném sledu. Jsou to příslovce, ne spojky.",
  },
  {
    question: "Jak poznáš subjektivně zabarvený popis?",
    correctAnswer: "podle hodnotících slov",
    options: ["podle počtu čísel", "podle hodnotících slov", "podle délky textu", "podle chybějících sloves"],
    hints: ["Které slovo v textu prozradí, že autor věc nejen popisuje, ale i posuzuje?"],
    explanation: "Slova jako 'skvělý', 'kouzelný' nebo 'nádherný' nesou autorovo hodnocení. Právě ta odlišují subjektivní popis od objektivního; délka o tom nerozhoduje.",
  },
  {
    question: "Jak poznáš pracovní postup v textu?",
    correctAnswer: "podle rozkazů a pořadí",
    options: ["podle minulého času", "podle dialogů postav", "podle rozkazů a pořadí", "podle popisu krajiny"],
    hints: ["Obrací se text na čtenáře a říká mu, co má dělat?"],
    explanation: "Pracovní postup poznáš podle sloves v rozkazovacím způsobu a podle kroků řazených za sebou, často i očíslovaných.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jak bys objektivně popsal automobil?",
    correctAnswer: "délka, výkon, počet sedadel",
    options: ["Krásné auto, jezdí jako vítr!", "Popsal bych ho básní.", "Podle toho, co se mi líbí.", "délka, výkon, počet sedadel"],
    hints: ["Objektivní popis musí sedět i tomu, komu se auto nelíbí. Co do něj tedy patří?"],
    explanation: "Objektivní popis uvádí ověřitelné parametry, na kterých se shodnou všichni. Obdiv ani osobní vkus do něj nepatří.",
  },
  {
    question: "Jak bys subjektivně popsal západ slunce?",
    correctAnswer: "Zlatá záře zalévala oblohu.",
    options: ["Zlatá záře zalévala oblohu.", "Slunce je hvězda.", "Západ nastává v 19:45.", "Slunce se pohybuje rychle."],
    hints: ["Která možnost nesděluje údaj, ale dojem?"],
    explanation: "Obraz zlaté záře zalévající oblohu vyjadřuje autorův prožitek. Ostatní možnosti uvádějí ověřitelná fakta, tedy popis objektivní.",
  },
  {
    question: "Jaký styl je vhodný pro návod k pračce?",
    correctAnswer: "pracovní postup",
    options: ["subjektivní popis", "pracovní postup", "poetický popis", "vyprávění příběhu"],
    hints: ["Návod má čtenáře provést krok za krokem. Který styl to umí?"],
    explanation: "U návodu jde o to, aby podle něj šlo bezpečně postupovat. Obrazný jazyk by jen zvyšoval riziko chyby.",
  },
  {
    question: "Jaký styl je vhodný pro turistického průvodce po hradu?",
    correctAnswer: "fakta i trocha zabarvení",
    options: ["čistě technický popis", "jen pracovní postup", "fakta i trocha zabarvení", "jen básně o hradu"],
    hints: ["Průvodce má dvě úlohy naráz: poučit a zaujmout. Co z toho plyne pro styl?"],
    explanation: "Průvodce musí uvést ověřitelné údaje o hradu, ale zároveň čtenáře nalákat. Proto kombinuje objektivní fakta s mírným subjektivním zabarvením.",
  },
  {
    question: "Ve větě 'Bohatě ozdobený sál rozjasňovaly stovky svíček.' je styl:",
    correctAnswer: "subjektivní",
    options: ["objektivní", "pracovní postup", "zpravodajský", "subjektivní"],
    hints: ["Je 'bohatě ozdobený' měřitelný údaj, nebo posouzení?"],
    explanation: "Slovo 'bohatě' vyjadřuje autorovo hodnocení a celá věta má navodit dojem. Objektivní popis by uvedl počet a rozmístění ozdob.",
  },
  {
    question: "Ve větě 'Místnost má plochu 25 m² a výšku stropu 2,8 m.' je styl:",
    correctAnswer: "objektivní",
    options: ["objektivní", "subjektivní", "pracovní postup", "poetický"],
    hints: ["Dalo by se to změřit metrem?"],
    explanation: "Věta obsahuje jen číselné údaje, které si každý může ověřit. Není v ní žádné hodnocení ani obraz.",
  },
  {
    question: "Proč je v pracovním postupu důležité přesné pořadí kroků?",
    correctAnswer: "špatné pořadí zkazí výsledek",
    options: [
      "kvůli délce textu",
      "špatné pořadí zkazí výsledek",
      "záleží jen na autorovi",
      "pořadí nerozhoduje",
    ],
    hints: ["Co se stane, když u receptu nejdřív upečeš a teprve pak zamícháš?"],
    explanation: "Kroky na sebe navazují — pozdější často předpokládají výsledek dřívějších. U některých postupů může chybné pořadí navíc znamenat nebezpečí.",
  },
  {
    question: "Jak bys subjektivně popsal svého oblíbeného herce?",
    correctAnswer: "hodnotícími slovy a obdivem",
    options: ["jen výškou a barvou vlasů", "postupem, jak se hraje", "hodnotícími slovy a obdivem", "seznamem jeho filmů"],
    hints: ["Co do popisu přidáš, aby z něj bylo poznat, že ho máš rád?"],
    explanation: "Subjektivní popis prozradí autorův vztah k tématu. Výška a seznam filmů jsou ověřitelné údaje, tedy popis objektivní.",
  },
  {
    question: "Jaký typ textu je recenze na film?",
    correctAnswer: "subjektivní popis",
    options: ["objektivní popis", "pracovní postup", "návod k použití", "subjektivní popis"],
    hints: ["Píšou dva kritici o témže filmu totéž?"],
    explanation: "Recenze staví na hodnocení, a to je vždy osobní. Ověřitelné údaje o filmu jsou v ní jen doplňkem.",
  },
  {
    question: "Jaký typ textu je technická specifikace výrobku?",
    correctAnswer: "objektivní popis",
    options: ["objektivní popis", "subjektivní popis", "pracovní postup", "báseň o výrobku"],
    hints: ["Obsahuje takový text rozměry a hodnoty, nebo dojmy?"],
    explanation: "Specifikace uvádí měřitelné parametry, podle kterých si zákazník výrobek porovná. Hodnocení by tam bylo na obtíž.",
  },
  {
    question: "Jak se liší popis osoby od vyprávění o osobě?",
    correctAnswer: "popis říká jaká je, vyprávění co dělala",
    options: [
      "vyprávění říká jaká je, popis co dělala",
      "popis říká jaká je, vyprávění co dělala",
      "obojí znamená totéž",
      "popis neuvádí jméno",
    ],
    hints: ["V jednom z těch textů se něco stane. Ve kterém?"],
    explanation: "Popis zachycuje vlastnosti a vzhled, které trvají. Vyprávění sleduje události v čase. Délka ani jméno o rozdílu nerozhodují.",
  },
  {
    question: "Jaká přídavná jména jsou typická pro subjektivní popis?",
    correctAnswer: "skvělý, úžasný, nádherný",
    options: ["kulatý, dřevěný, dutý", "červený, modrý, žlutý", "skvělý, úžasný, nádherný", "první, druhý, poslední"],
    hints: ["Která skupina slov říká, jak se autorovi věc líbí, a ne jaká je?"],
    explanation: "Tato přídavná jména nesou hodnocení, které se nedá změřit. Tvar, materiál i barva jsou naopak ověřitelné, a proto objektivní.",
  },
  {
    question: "Které výrazy jsou typické pro pracovní postup?",
    correctAnswer: "nejprve, poté, nakonec",
    options: ["jednou, dvakrát, třikrát", "bylo, stalo se, tehdy", "kdyby, pokud, jestliže", "nejprve, poté, nakonec"],
    hints: ["Která skupina slov drží kroky ve správném sledu?"],
    explanation: "Tyto výrazy určují pořadí činností, což je pro postup zásadní. Ostatní skupiny vyjadřují počet, minulost nebo podmínku.",
  },
  {
    question: "Přepiš objektivní větu na subjektivní: 'Moře je modré.'",
    correctAnswer: "Moře se třpytí v barvě safíru.",
    options: ["Moře se třpytí v barvě safíru.", "Moře má hloubku 3 800 m.", "Moře je plocha slané vody.", "Moře je modré i zelené."],
    hints: ["Do které možnosti autor vložil vlastní dojem místo pouhého údaje?"],
    explanation: "Přirovnání k safíru a sloveso 'třpytí se' vyjadřují prožitek, ne měřitelnou vlastnost. Ostatní varianty zůstávají u faktů.",
  },
  {
    question: "Přepiš subjektivní větu na objektivní: 'Kytice byla překrásná a nesmírně voněla.'",
    correctAnswer: "Kytice měla dvanáct červených růží.",
    options: [
      "Kytice byla nádherná!",
      "Kytice měla dvanáct červených růží.",
      "Kytice mi dělala radost.",
      "Kytice voněla jako zahrada.",
    ],
    hints: ["Která možnost by se dala ověřit spočítáním?"],
    explanation: "Počet a barva květů jsou ověřitelné údaje. Zbylé varianty jen nahrazují jedno hodnocení druhým, takže subjektivní zůstávají.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Přepiš do pracovního postupu: 'Bábovku dáme péct na 180 °C.'",
    correctAnswer: "Vložte bábovku do trouby.",
    options: ["Bábovka se peče v troubě.", "Bábovka byla v troubě.", "Vložte bábovku do trouby.", "Trouba měla 180 stupňů."],
    hints: ["Postup se obrací přímo na čtenáře. Která možnost mu něco ukládá?"],
    explanation: "Pracovní postup používá rozkazovací způsob adresovaný tomu, kdo podle něj pracuje. Ostatní varianty jen konstatují stav.",
  },
  {
    question: "Jaký je rozdíl mezi statickým a dynamickým popisem?",
    correctAnswer: "statický zachycuje klid",
    options: ["dynamický zachycuje klid", "statický je vždy delší", "obojí znamená totéž", "statický zachycuje klid"],
    hints: ["Řecké 'statis' znamená stání. Co z toho plyne?"],
    explanation: "Statický popis zachycuje věc v jednom okamžiku, jako fotografie. Dynamický sleduje pohyb nebo proměnu v čase.",
  },
  {
    question: "Ve které části literárního textu bývá subjektivní popis?",
    correctAnswer: "v popisu prostředí a nálady",
    options: ["v popisu prostředí a nálady", "v přímé řeči postav", "v pracovním postupu", "v tabulkách s údaji"],
    hints: ["Kde autor buduje atmosféru, ve které se děj odehrává?"],
    explanation: "Právě popisy krajiny, počasí a prostředí nesou náladu díla. Autor je proto píše zabarveně, aby čtenáře naladil.",
  },
  {
    question: "Co je metafora v popisu?",
    correctAnswer: "přejmenování bez slova jako",
    options: [
      "srovnání se slovem jako",
      "přejmenování bez slova jako",
      "opakování stejné hlásky",
      "záporné hodnocení věci",
    ],
    hints: ["Používá tenhle obrat spojovací slovo pro srovnání, nebo věc rovnou přejmenuje?"],
    explanation: "Metafora pojmenuje věc názvem něčeho jiného na základě podobnosti — 'srdce z kamene'. Se slovem 'jako' by šlo o přirovnání.",
  },
  {
    question: "Co je personifikace v popisu?",
    correctAnswer: "věci jednají jako lidé",
    options: ["lidé jednají jako věci", "srovnání se slovem jako", "věci jednají jako lidé", "objektivní popis osoby"],
    hints: ["Ve spojení 'les šeptá' dělá les něco, co umí jen člověk. Kterým směrem se vlastnost přenesla?"],
    explanation: "Personifikace přisuzuje lidské jednání a pocity neživým věcem nebo přírodě. Opačný směr personifikací není.",
  },
  {
    question: "Jak se liší pracovní postup od návodu k použití?",
    correctAnswer: "jsou si velmi podobné",
    options: ["jsou to zcela jiné žánry", "postup nemá slovesa", "návod je vždy delší", "jsou si velmi podobné"],
    hints: ["Porovnej jejich stavbu: kroky, pořadí, rozkazy. V čem se doopravdy liší?"],
    explanation: "Oba texty vedou čtenáře krok za krokem a používají rozkazovací způsob. Rozdíl je jen v míře obecnosti, ne ve stavbě.",
  },
  {
    question: "Z jakého pohledu se píše subjektivní popis?",
    correctAnswer: "z pohledu autora",
    options: ["z pohledu autora", "vždy v množném čísle", "vždy v rozkazech", "bez jakéhokoli pohledu"],
    hints: ["Čí dojmy se v takovém popisu objevují?"],
    explanation: "Subjektivní popis nese autorovo vnímání a hodnocení, ať už píše v první, nebo ve třetí osobě. Bez konkrétního pohledu by přestal být subjektivní.",
  },
  {
    question: "Čemu se v pracovním postupu vyhýbáme?",
    correctAnswer: "nejasným formulacím",
    options: [
      "číslům a mírám",
      "nejasným formulacím",
      "slovesům v rozkazech",
      "časovým výrazům",
    ],
    hints: ["Co udělá čtenář s pokynem 'přidej trochu' nebo 'ohřej chvíli'?"],
    explanation: "Neurčité pokyny si každý vyloží jinak, a výsledek proto dopadne pokaždé jinak. Postup musí uvádět konkrétní množství a časy.",
  },
  {
    question: "Jak se říká prolínání smyslů v popisu, například 'teplá barva hudby'?",
    correctAnswer: "synestezie",
    options: ["personifikace", "přirovnání", "synestezie", "metafora"],
    hints: ["Ve spojení se míchají dva různé smysly, které normálně fungují odděleně. Jak se tomu říká?"],
    explanation: "Synestezie popisuje vjem jednoho smyslu slovníkem jiného — teplá barva, sladký tón. Vzniká tím nezvyklý, silný obraz.",
  },
  {
    question: "Jak důležitá je přesnost v pracovním postupu?",
    correctAnswer: "chyba zkazí výsledek",
    options: ["přesnost nerozhoduje", "záleží jen na čtenáři", "platí to jen v kuchyni", "chyba zkazí výsledek"],
    hints: ["Co se stane, když v návodu zaměníš 200 g za 20 g?"],
    explanation: "Postup slouží k tomu, aby podle něj šlo dojít ke stejnému výsledku. Nepřesný údaj to znemožní, a u některých činností může být i nebezpečný.",
  },
  {
    question: "Přepiš do objektivního popisu: 'Kouzelný les zabalený v tajemném tichu.'",
    correctAnswer: "Les má plochu 5 ha, rostou tu buky.",
    options: ["Les má plochu 5 ha, rostou tu buky.", "Kouzelný les je velký.", "Les stojí tiše a tajemně.", "Les je tajemný a tichý."],
    hints: ["Která možnost by obstála i v encyklopedii?"],
    explanation: "Rozloha a druhy stromů se dají ověřit. Ostatní varianty jen mění hodnotící slova, ale subjektivní zůstávají.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const POPISSUBJEKTIVNEZABARVENYPOPISPRACOVNIHOPOSTUPU: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-subjektivne-zabarveny-popis-pracovniho-postupu",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-subjektivne-zabarveny-popis-pracovniho-postupu",
    title: "Popis – subjektivně zabarvený, popis pracovního postupu",
    studentTitle: "Druhy popisu",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se rozdíl mezi objektivním a subjektivním popisem.",
    keywords: ["popis", "objektivní", "subjektivní", "pracovní postup", "recept", "návod"],
    goals: [
      "Rozlišit objektivní a subjektivně zabarvený popis",
      "Poznat pracovní postup a jeho znaky",
      "Přepsat text z jednoho stylu do druhého",
    ],
    boundaries: [
      "Bez hluboké stylistiky a rétoriky",
      "Rozšiřující nad rámec RVP 5. ročníku: metafora, personifikace a synestezie v úrovni 3",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Objektivní = jen fakta (barva, tvar, velikost). Subjektivní = pocity, hodnocení, přirovnání. Pracovní postup = kroky v pořadí s rozkazovacím způsobem.",
      steps: [
        "Přečti text a hledej hodnotící slova (skvělý, kouzelný) = subjektivní.",
        "Jsou tam jen fakta a čísla? = objektivní.",
        "Jsou tam kroky v pořadí s rozkazy (přidej, smíchej)? = pracovní postup.",
      ],
      commonMistake: "Žáci si pletou subjektivní hodnocení s objektivními fakty. Hodnotící přídavná jména (krásný, ošklivý) jsou vždy subjektivní.",
      example: "Objektivní: Jablko je kulaté, červené. Subjektivní: Jablko voní jako léto. Postup: Oloupeš jablko, nakrájíš ho...",
    },
  },
];
