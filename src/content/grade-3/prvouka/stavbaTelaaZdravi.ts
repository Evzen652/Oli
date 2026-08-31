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
//   L1 = rozpoznání: přiřadit orgánu / kosti jednu základní vlastnost
//        („co chrání lebka", „který orgán přečerpává krev").
//   L2 = aplikace: vysvětlit funkci orgánu nebo pojem (k čemu slouží kostra,
//        co jsou šlachy, proč si myjeme ruce, co je vyvážená strava, očkování).
//   L3 = transfer: řetězce a důsledky (cesta pohybu mozek→sval→kost, cesta
//        kyslíku, co se stane při málu spánku), rozlišení miskoncepcí
//        (srdce vs ledviny), zdůvodnění zdravých návyků.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Co chrání lebka?",
    correctAnswer: "Mozek",
    options: ["Mozek", "Srdce", "Plíce", "Žaludek"],
    emoji: "🧠",
    hints: [
      "Lebka je tvrdá kost v hlavě.",
      "Co důležitého máš uvnitř hlavy?",
    ],
    explanation:
      "Lebka je pevná kostěná schránka, která obklopuje a chrání mozek před nárazy a poraněním.",
  },
  {
    question: "Co chrání žebra?",
    correctAnswer: "Srdce a plíce",
    options: ["Srdce a plíce", "Mozek", "Žaludek a střeva", "Páteř"],
    emoji: "🫁",
    hints: [
      "Žebra tvoří klec kolem hrudi — přemýšlej, co je tam uvnitř.",
      "V hrudi máš dva velmi důležité orgány.",
    ],
    explanation:
      "Žebra tvoří kostěnou klec v oblasti hrudi. Tato klec chrání srdce a plíce před nárazy a poraněním.",
  },
  {
    question: "Který orgán přečerpává krev po celém těle?",
    correctAnswer: "Srdce",
    options: ["Srdce", "Plíce", "Mozek", "Žaludek"],
    emoji: "❤️",
    hints: [
      "Polož si ruku na hrudník — co tam pravidelně bije?",
      "Funguje jako pumpa, která nikdy nepřestane.",
    ],
    explanation:
      "Srdce je svalová pumpa. Stahuje se a uvolňuje a tím přečerpává krev do všech částí těla, kam dopravuje kyslík a živiny.",
  },
  {
    question: "Který orgán řídí celé tělo, myšlení a pohyby?",
    correctAnswer: "Mozek",
    options: ["Mozek", "Srdce", "Žaludek", "Ledviny"],
    emoji: "🧠",
    hints: [
      "Je to velitelské centrum, které dobře chráníme lebkou.",
      "Rozhoduje o tom, co uděláš i na co myslíš.",
    ],
    explanation:
      "Mozek je velitelské centrum těla. Zpracovává informace ze smyslů a řídí pohyby, myšlení, paměť i emoce.",
  },
  {
    question: "Kterým orgánem dýcháme?",
    correctAnswer: "Plícemi",
    options: ["Plícemi", "Ledvinami", "Žaludkem", "Srdcem"],
    emoji: "🫁",
    hints: [
      "Když se nadechneš, tato část se v hrudi naplní vzduchem.",
      "Není to orgán na trávení ani na čištění krve.",
    ],
    explanation:
      "Dýcháme plícemi. Při nádechu přijmou vzduch s kyslíkem a při výdechu vypustí oxid uhličitý.",
  },
  {
    question: "Který orgán čistí krev a tvoří moč?",
    correctAnswer: "Ledviny",
    options: ["Ledviny", "Srdce", "Plíce", "Mozek"],
    emoji: "🩸",
    hints: [
      "Tento orgán funguje jako filtr krve.",
      "Odpadní látky z krve odcházejí z těla jako moč.",
    ],
    explanation:
      "Ledviny filtrují krev, odstraňují z ní odpadní látky a tvoří z nich moč, která odchází z těla.",
  },
  {
    question: "Která kost drží tělo vzpřímené a chrání míchu?",
    correctAnswer: "Páteř",
    options: ["Páteř", "Lebka", "Žebra", "Kosti ruky"],
    emoji: "🦴",
    hints: [
      "Táhne se od krku dolů uprostřed zad.",
      "Skládá se z mnoha obratlů poskládaných na sobě.",
    ],
    explanation:
      "Páteř tvoří obratle poskládané na sobě. Drží tělo vzpřímené a uvnitř chrání míchu, kterou procházejí nervy.",
  },
  {
    question: "Čím jsou svaly připojené ke kostem?",
    correctAnswer: "Šlachami",
    options: ["Šlachami", "Cévami", "Nervy", "Kůží"],
    emoji: "💪",
    hints: [
      "Je to pevné vlákno jako silný provázek.",
      "Není to trubice s krví ani vlákno, které vede signály.",
    ],
    explanation:
      "Svaly jsou ke kostem připojené šlachami — pevnými vlákny. Když se sval stáhne, šlacha přenese sílu na kost.",
  },
  {
    question: "Kolik hodin spánku denně potřebuje dítě ve věku 8–9 let?",
    correctAnswer: "9 až 11 hodin",
    options: ["9 až 11 hodin", "6 až 7 hodin", "12 až 14 hodin", "4 až 5 hodin"],
    emoji: "😴",
    hints: [
      "Dítě potřebuje víc spánku než dospělý.",
      "Tělo i mozek během spánku rostou a odpočívají — je to opravdu dlouhá doba.",
    ],
    explanation:
      "Děti ve věku 8–9 let potřebují 9 až 11 hodin spánku. Během spánku tělo roste, mozek zpracovává nové informace a imunitní systém se posiluje.",
  },
  {
    question: "Jak dlouho by se děti měly každý den hýbat?",
    correctAnswer: "Alespoň 60 minut",
    options: ["Alespoň 60 minut", "Alespoň 10 minut", "Alespoň 3 hodiny", "Pohyb není nutný"],
    emoji: "🏃",
    hints: [
      "Mělo by to být opravdu hodně — víc než jen krátká chvilka denně.",
      "Ale zase ne celé půldne v kuse — hledej rozumný střed.",
    ],
    explanation:
      "Odborníci doporučují dětem alespoň 60 minut pohybu každý den. Pohyb posiluje svaly, kosti i srdce, zlepšuje soustředění a náladu.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "K čemu slouží kostra?",
    correctAnswer: "Dává tělu tvar, chrání vnitřní orgány a umožňuje pohyb",
    options: [
      "Dává tělu tvar, chrání vnitřní orgány a umožňuje pohyb",
      "Přepravuje krev po celém těle",
      "Tráví potravu a vstřebává živiny",
      "Řídí myšlení a pohyby těla",
    ],
    emoji: "🦴",
    hints: [
      "Přemýšlej, co by se s tělem stalo, kdybys neměl žádné kosti.",
      "Kostra má víc úkolů najednou — opora, ochrana i pohyb.",
    ],
    explanation:
      "Kostra plní tři hlavní úkoly: dává tělu pevný tvar a oporu, chrání měkké orgány uvnitř (mozek, srdce, plíce) a spolu se svaly umožňuje pohyb.",
  },
  {
    question: "K čemu slouží svaly?",
    correctAnswer: "Umožňují pohyb — stahují se a uvolňují, tím hýbou kostmi",
    options: [
      "Umožňují pohyb — stahují se a uvolňují, tím hýbou kostmi",
      "Chrání mozek a míchu před poraněním",
      "Přenášejí kyslík z plic do celého těla",
      "Tráví potravu v žaludku",
    ],
    emoji: "💪",
    hints: [
      "Co cítíš napínat v ruce, když zvedáš těžkou tašku?",
      "Svaly jsou přirostlé ke kostem — přemýšlej, jak s nimi hýbou.",
    ],
    explanation:
      "Svaly jsou ke kostem přirostlé šlachami. Když se sval stáhne, přiblíží kosti k sobě a vznikne pohyb. Když se uvolní, kost se vrátí zpět.",
  },
  {
    question: "Co dělá srdce?",
    correctAnswer: "Přečerpává krev a posílá ji do celého těla",
    options: [
      "Přečerpává krev a posílá ji do celého těla",
      "Čistí krev od škodlivých látek",
      "Vyrábí nové krvinky",
      "Řídí dýchání a tep",
    ],
    emoji: "❤️",
    hints: [
      "Srdce funguje jako pumpa — přemýšlej, co rozvádí ke všem orgánům.",
      "Čištění krve má na starost jiný orgán.",
    ],
    explanation:
      "Srdce je sval, který pracuje celý život jako pumpa. Stahuje se a uvolňuje a tím přečerpává krev do všech částí těla, kam dopravuje kyslík a živiny.",
  },
  {
    question: "Co se děje v plicích?",
    correctAnswer: "Přijímají kyslík ze vzduchu a odevzdávají oxid uhličitý",
    options: [
      "Přijímají kyslík ze vzduchu a odevzdávají oxid uhličitý",
      "Filtrují krev a tvoří moč",
      "Rozkládají potravu na živiny",
      "Vyrábějí hormony pro růst těla",
    ],
    emoji: "🫁",
    hints: [
      "Přemýšlej, co dýcháš dovnitř a co vydechuješ ven.",
      "Filtrování krve a trávení mají na starost jiné orgány.",
    ],
    explanation:
      "Při každém nádechu plíce přijmou vzduch bohatý na kyslík. Kyslík přechází do krve, která ho rozveze po těle. Zpět do plic přichází oxid uhličitý, který vydechneme.",
  },
  {
    question: "Co dělá mozek?",
    correctAnswer: "Řídí celé tělo, myšlení, pohyby i smysly",
    options: [
      "Řídí celé tělo, myšlení, pohyby i smysly",
      "Vyrábí krev pro srdce",
      "Tráví potravu a vstřebává vitamíny",
      "Čistí krev od odpadních látek",
    ],
    emoji: "🧠",
    hints: [
      "Proč tak dobře chráníme právě tuto část v hlavě?",
      "Rozhoduje o pohybech, myšlenkách i o tom, co cítíš.",
    ],
    explanation:
      "Mozek je velitelské centrum celého těla. Zpracovává informace ze smyslů, řídí pohyby, myšlení, paměť a emoce. Bez mozku by tělo nemohlo fungovat.",
  },
  {
    question: "Co dělají ledviny?",
    correctAnswer: "Čistí krev a tvoří moč, kterou se z těla odstraňují odpadní látky",
    options: [
      "Čistí krev a tvoří moč, kterou se z těla odstraňují odpadní látky",
      "Vyrábějí trávicí šťávy pro žaludek",
      "Přenášejí kyslík do svalů",
      "Regulují tep srdce",
    ],
    emoji: "🩸",
    hints: [
      "Ledviny fungují jako filtr — přemýšlej, co odstraňují.",
      "Výsledkem jejich práce je moč.",
    ],
    explanation:
      "Ledviny filtrují krev a odstraňují z ní odpadní látky, které by tělu škodily. Z těchto odpadních látek a přebytečné vody vzniká moč, která odchází z těla.",
  },
  {
    question: "Co jsou šlachy?",
    correctAnswer: "Pevná vlákna, která spojují svaly s kostmi",
    options: [
      "Pevná vlákna, která spojují svaly s kostmi",
      "Měkká tkáň uvnitř kostí, kde vznikají krvinky",
      "Cévy, které vedou krev ke svalům",
      "Část nervové soustavy v míše",
    ],
    emoji: "🦵",
    hints: [
      "Svaly musí být nějak přichycené ke kostem — čím?",
      "Jsou jako silné provázky, ne trubice s krví.",
    ],
    explanation:
      "Šlachy jsou pevná vlákna, která přichycují svaly ke kostem. Když se sval stáhne, šlacha přenese sílu na kost a tím vznikne pohyb.",
  },
  {
    question: "Proč si myjeme ruce?",
    correctAnswer: "Na rukou jsou bakterie a viry, které nás můžou nakazit",
    options: [
      "Protože pak lépe udržíme tužku",
      "Na rukou jsou bakterie a viry, které nás můžou nakazit",
      "Protože voda posiluje pokožku",
      "Protože to tak říká paní učitelka",
    ],
    emoji: "🧼",
    hints: [
      "Co se dá z neumytých rukou přenést s jídlem do těla?",
      "Přemýšlej, proč si myjeme ruce zvlášť před jídlem a po záchodě.",
    ],
    explanation:
      "Na rukou se hromadí bakterie a viry. Pokud si neumyjeme ruce, tyto zárodky se přenesou do úst nebo očí a způsobí nemoc. Mýdlo a voda je z rukou odstraní.",
  },
  {
    question: "Co patří do vyvážené stravy?",
    correctAnswer: "Ovoce, zelenina, bílkoviny, sacharidy a dostatek tekutin",
    options: [
      "Ovoce, zelenina, bílkoviny, sacharidy a dostatek tekutin",
      "Pouze maso a mléčné výrobky",
      "Sladkosti a slané pochutiny v každém jídle",
      "Jen zelenina a voda",
    ],
    emoji: "🥗",
    hints: [
      "Vyvážená strava znamená jíst od každé skupiny potravin trochu.",
      "Jen jedna jediná skupina potravin tělu nestačí.",
    ],
    explanation:
      "Vyvážená strava obsahuje různé skupiny potravin: ovoce a zeleninu (vitamíny), bílkoviny (maso, luštěniny, vejce — stavební látky pro svaly), sacharidy (chléb, brambory — energie) a dostatek tekutin.",
  },
  {
    question: "K čemu slouží očkování?",
    correctAnswer: "Trénuje imunitní systém, aby nemoc poznal předem",
    options: [
      "Léčí nemoci, které v těle už máme",
      "Trénuje imunitní systém, aby nemoc poznal předem",
      "Dodává tělu vitamíny a minerály",
      "Posiluje svaly a kosti při růstu",
    ],
    emoji: "💉",
    hints: [
      "Očkování je prevence — chrání dřív, než nemoc přijde.",
      "Přemýšlej, co se v těle po vakcíně naučí bránit.",
    ],
    explanation:
      "Očkování (vakcinace) do těla vpraví oslabené nebo mrtvé zárodky nemoci. Imunitní systém se naučí je rozpoznat a příště, při skutečné nákaze, je rychle porazí dřív, než způsobí vážnou nemoc.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Kopneš do míče. V jakém pořadí to v těle proběhne?",
    correctAnswer: "Mozek dá povel → nerv přenese signál → sval se stáhne → kost se pohne",
    options: [
      "Mozek dá povel → nerv přenese signál → sval se stáhne → kost se pohne",
      "Sval se stáhne → mozek dá povel → kost se pohne → nerv přenese signál",
      "Kost se pohne → sval se stáhne → mozek dá povel → nerv přenese signál",
      "Nerv se stáhne → kost dá povel → sval přenese signál → mozek se pohne",
    ],
    emoji: "⚽",
    hints: [
      "Každý pohyb začíná rozhodnutím — kde v těle vzniká?",
      "Signál musí nejdřív dorazit ke svalu, teprve pak se pohne kost.",
    ],
    explanation:
      "Pohyb začíná v mozku, který vyšle povel. Nerv signál přenese ke svalu, sval se stáhne a přes šlachu pohne kostí — noha kopne do míče.",
  },
  {
    question: "Která věta o orgánech je správná?",
    correctAnswer: "Srdce přečerpává krev, ledviny ji čistí",
    options: [
      "Srdce přečerpává krev, ledviny ji čistí",
      "Srdce čistí krev, ledviny ji přečerpávají",
      "Plíce přečerpávají krev, srdce dýchá",
      "Mozek přečerpává krev, srdce řídí myšlení",
    ],
    emoji: "🧠",
    hints: [
      "Vzpomeň si, který orgán je pumpa a který je filtr.",
      "Nepleť si úkoly srdce a ledvin — každý dělá něco jiného.",
    ],
    explanation:
      "Srdce funguje jako pumpa a přečerpává krev po těle. Ledviny fungují jako filtr a krev čistí. Časté je právě zaměnit tyto dva úkoly.",
  },
  {
    question: "Jak se kyslík ze vzduchu dostane až ke svalům?",
    correctAnswer: "Plíce ho předají krvi a srdce krev rozvede po celém těle",
    options: [
      "Plíce ho předají krvi a srdce krev rozvede po celém těle",
      "Žaludek ho stráví a pošle rovnou do svalů",
      "Ledviny ho vyfiltrují a dopraví do kostí",
      "Mozek ho vyrobí a rozešle nervy",
    ],
    emoji: "🫁",
    hints: [
      "Kyslík se nejdřív dostane do krve — kde to je?",
      "Kdo krev s kyslíkem rozveze do celého těla?",
    ],
    explanation:
      "V plicích přejde kyslík ze vzduchu do krve. Srdce tuto krev přečerpá a rozvede po celém těle až ke svalům, které kyslík potřebují k pohybu.",
  },
  {
    question: "Dítě chodí spát pozdě a spí jen 5 hodin. Jak se to na něm nejspíš projeví?",
    correctAnswer: "Bude unavené, hůř se soustředí a tělo se hůř zotaví",
    options: [
      "Bude unavené, hůř se soustředí a tělo se hůř zotaví",
      "Bude rychleji růst, protože ušetří čas",
      "Bude zdravější, protože je víc vzhůru",
      "Nijak — na spánku nezáleží",
    ],
    emoji: "😴",
    hints: [
      "Vzpomeň si, co tělo a mozek během spánku dělají.",
      "Když tenhle čas chybí, co se stane další den?",
    ],
    explanation:
      "Během spánku tělo roste a zotavuje se a mozek si třídí informace. Když dítě spí málo, je unavené, hůř se soustředí a snadněji onemocní.",
  },
  {
    question: "Míč tě udeří do hrudníku, ale srdce ani plíce se nic nestane. Co je ochránilo?",
    correctAnswer: "Žebra, která kolem nich tvoří pevnou kostěnou klec",
    options: [
      "Žebra, která kolem nich tvoří pevnou kostěnou klec",
      "Svaly na rukou, které míč odrazily",
      "Lebka, která kryje celé tělo",
      "Kůže, která je úplně neprůstřelná",
    ],
    emoji: "🛡️",
    hints: [
      "Která kost tvoří klec právě v oblasti hrudi?",
      "Lebka chrání jinou část těla, ne hrudník.",
    ],
    explanation:
      "Srdce a plíce chrání žebra, která kolem nich tvoří pevnou kostěnou klec. Ta ztlumí náraz, takže se orgánům uvnitř nic nestane.",
  },
  {
    question: "Proč nás očkování chrání, i když zrovna nejsme nemocní?",
    correctAnswer: "Předem naučí tělo nemoc poznat a rychle ji porazit",
    options: [
      "Zabije všechny bakterie na kůži",
      "Předem naučí tělo nemoc poznat a rychle ji porazit",
      "Dodá tělu rychlou energii z cukru",
      "Posílí kosti, aby se nezlomily",
    ],
    emoji: "💉",
    hints: [
      "Očkování je trénink nanečisto — na co tělo připraví?",
      "Díky němu tělo nemoc pozná, ještě než opravdu přijde.",
    ],
    explanation:
      "Očkování ukáže tělu oslabené zárodky nemoci. Imunitní systém se je naučí rozpoznat, takže při skutečné nákaze je porazí rychle, dřív než způsobí vážnou nemoc.",
  },
  {
    question: "Jak vznikne pohyb ruky, když chceš zvednout tašku?",
    correctAnswer: "Mozek vyšle signál, sval se stáhne a přes šlachu pohne kostí",
    options: [
      "Mozek vyšle signál, sval se stáhne a přes šlachu pohne kostí",
      "Kost se sama rozhodne a zvedne sval",
      "Krev zatlačí na kost a ta se pohne",
      "Šlacha vyšle signál mozku, aby kost ztvrdla",
    ],
    emoji: "💪",
    hints: [
      "Kdo dává povel a co se pak se svalem stane?",
      "Sval táhne kost ne přímo, ale přes pevné vlákno.",
    ],
    explanation:
      "Mozek vyšle nervy signál ke svalu. Sval se stáhne a přes šlachu, kterou je připojený ke kosti, kost přitáhne — ruka se pohne a zvedne tašku.",
  },
  {
    question: "Proč jíme od více skupin potravin, a ne jen jednu?",
    correctAnswer: "Každá skupina dodá tělu něco jiného — energii, stavební látky i vitamíny",
    options: [
      "Každá skupina dodá tělu něco jiného — energii, stavební látky i vitamíny",
      "Aby jídlo trvalo déle a nudili jsme se méně",
      "Protože jedna skupina potravin je jedovatá",
      "Aby tělo nemuselo vůbec trávit",
    ],
    emoji: "🍽️",
    hints: [
      "Přemýšlej, co dává ovoce, co maso a co pečivo.",
      "Kdyby chyběla jedna skupina, chyběla by tělu i její výhoda.",
    ],
    explanation:
      "Různé potraviny dodávají tělu různé věci: sacharidy energii, bílkoviny stavební látky pro svaly, ovoce a zelenina vitamíny. Proto je potřeba jíst od každé skupiny — jedna sama nestačí.",
  },
  {
    question: "Proč sportovci dbají nejen na trénink, ale i na spánek a jídlo?",
    correctAnswer: "Tělo se zpevňuje a obnovuje hlavně během odpočinku a z živin v jídle",
    options: [
      "Tělo se zpevňuje a obnovuje hlavně během odpočinku a z živin v jídle",
      "Spánek a jídlo se sportem nijak nesouvisí",
      "Aby měli výmluvu, proč netrénovat",
      "Protože svaly rostou jen ve spánku, jídlo je zbytečné",
    ],
    emoji: "🏅",
    hints: [
      "Kdy a z čeho se unavené svaly zotaví a posílí?",
      "Trénink svaly namáhá — co jim pomůže znovu zesílit?",
    ],
    explanation:
      "Trénink svaly namáhá, ale posílí a obnoví se hlavně během spánku a z živin, které tělo získá z jídla. Proto je potřeba pohyb, spánek i strava dohromady.",
  },
  {
    question: "Když si při pádu narazíš koleno a nemůžeš nohu ohnout, které dvě spolupracující části k pohybu potřebuješ?",
    correctAnswer: "Svaly a kosti, které jsou spojené šlachou",
    options: [
      "Svaly a kosti, které jsou spojené šlachou",
      "Plíce a srdce, které pohánějí nohu",
      "Ledviny a žaludek, které tvoří pohyb",
      "Mozek a kůži, které ohýbají kost",
    ],
    emoji: "🦵",
    hints: [
      "Vzpomeň si, co se musí stáhnout a co se díky tomu pohne.",
      "Pohyb dělá dvojice: jedno táhne, druhé se ohne.",
    ],
    explanation:
      "Pohyb v koleni dělají svaly a kosti spojené šlachou. Sval se stáhne, přes šlachu zatáhne kost a noha se ohne. Když je koleno naražené, tato spolupráce bolí a pohyb je omezený.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const STAVBATELAAZDRAV: TopicMetadata[] = [
  {
    id: "g3-prvouka-clovek-a-jeho-zdravi-lidske-telo-stavba-lidskeho-tela-kostra-svaly-uvod-zdravi-a-nemoc",
    title: "Stavba lidského těla, zdraví",
    studentTitle: "Naše tělo a zdraví",
    subject: "prvouka",
    category: "Člověk a jeho zdraví",
    topic: "Lidské tělo",
    briefDescription: "Poznáš základní části lidského těla a jak pečovat o zdraví.",
    illustrationDesc:
      "dítě ukazuje na průhledný model lidského těla se srdcem, plícemi a mozkem, vedle stojí kostra a na stole leží ovoce a zelenina",
    keywords: [
      "kostra",
      "svaly",
      "lebka",
      "páteř",
      "žebra",
      "šlachy",
      "srdce",
      "plíce",
      "mozek",
      "žaludek",
      "ledviny",
      "orgány",
      "zdraví",
      "vyvážená strava",
      "pohyb",
      "spánek",
      "hygiena",
      "mytí rukou",
      "očkování",
      "stavba těla",
    ],
    goals: [
      "Pojmenovat základní části kostry a vysvětlit jejich funkci.",
      "Popsat, jak fungují svaly a šlachy.",
      "Vysvětlit funkci hlavních orgánů: srdce, plíce, mozek, žaludek, ledviny.",
      "Vyjmenovat zásady zdravého životního stylu: strava, pohyb, spánek, hygiena.",
      "Vysvětlit, proč se očkujeme.",
    ],
    boundaries: [
      "Základní pojmy pro 3. třídu — bez anatomie na úrovni buněk ani chemie.",
      "Orgány jen v základní funkci — bez detailního popisu oběhové či trávicí soustavy.",
      "Hygiena a zdraví prakticky — bez detailní mikrobiologie.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Kostra = opora + ochrana. Svaly + šlachy = pohyb. Hlavní orgány: srdce (pumpa krve), plíce (dýchání), mozek (velení), žaludek (trávení), ledviny (čištění krve). Zdraví: pohyb 60 min, spánek 9–11 h, vyvážená strava, mytí rukou, očkování.",
      steps: [
        "Kostra — dává tělu tvar, chrání orgány (lebka → mozek, žebra → srdce + plíce, páteř → mícha).",
        "Svaly — přirostlé ke kostem přes šlachy; stahují se a uvolňují → pohyb.",
        "Srdce — svalová pumpa, přečerpává krev do celého těla.",
        "Plíce — výměna kyslíku (dovnitř) za oxid uhličitý (ven) při dýchání.",
        "Mozek — řídí tělo, myšlení, smysly i pohyby.",
        "Žaludek — rozkládá potravu, aby ji tělo mohlo vstřebat.",
        "Ledviny — filtrují krev, odstraňují odpadní látky jako moč.",
        "Zdraví: vyvážená strava, pohyb ≥ 60 min/den, spánek 9–11 h, mytí rukou, čištění zubů, očkování.",
      ],
      commonMistake:
        "Záměna funkcí orgánů: ledviny čistí krev (ne srdce), srdce pumpa krev (ne mozek). Šlachy spojují svaly s kostmi — nejsou to cévy ani nervy.",
      example:
        "Kopneš míč: mozek dá povel → nervy přenesou signál → sval stehna se stáhne → šlacha zatáhne kost → noha se pohne → míč odletí. Srdce mezitím pumpuje krev se kyslíkem do svalu.",
    },
  },
];
