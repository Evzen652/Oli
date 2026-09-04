import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// L1 — rozpoznání: znám číslo, znám základní úkon.
const POOL_L1: PracticeTask[] = [
  { question: "Na jaké číslo zavoláš záchrannou službu?", correctAnswer: "155", options: ["155", "150", "158", "112"] },
  { question: "Na jaké číslo zavoláš hasiče?", correctAnswer: "150", options: ["112", "150", "158", "155"] },
  { question: "Na jaké číslo zavoláš policii?", correctAnswer: "158", options: ["150", "155", "158", "112"] },
  { question: "Které tísňové číslo funguje ve všech státech Evropské unie?", correctAnswer: "112", options: ["150", "155", "158", "112"] },
  { question: "Kdo při tísňovém volání ukončuje hovor jako první?", correctAnswer: "Operátor, který hovor přijal", options: ["Operátor, který hovor přijal", "Ten, kdo volá, jakmile řekne adresu", "Oba zavěsí ve stejnou chvíli", "Záleží na tom, kdo mluví déle"] },
  { question: "Co má zaznít hned na začátku tísňového hovoru?", correctAnswer: "Místo, kde se neštěstí stalo", options: ["Tvoje celé jméno a příjmení", "Místo, kde se neštěstí stalo", "Kolik je ti přesně let", "Jak dlouho už tam stojíš"] },
  { question: "Čím se chladí čerstvá popálenina?", correctAnswer: "Studenou tekoucí vodou", options: ["Kostkami ledu z mrazáku", "Máslem nebo olejem", "Studenou tekoucí vodou", "Zubní pastou z tuby"] },
  { question: "Co uděláš s odřeným kolenem?", correctAnswer: "Opláchneš ranku a přelepíš náplastí", options: ["Necháš ji být a jdeš dál hrát", "Přiložíš na ni kostku ledu", "Potřeš ji mastným krémem", "Opláchneš ranku a přelepíš náplastí"] },
  { question: "Koho zavoláš jako prvního, když se kamarád na hřišti vážně zraní?", correctAnswer: "Dospělého, který je nejblíž", options: ["Dospělého, který je nejblíž", "Spolužáka ze své třídy", "Sourozence, až přijdeš domů", "Nikoho, zvládneš to sám"] },
  { question: "Co patří do domácí lékárničky?", correctAnswer: "Obvaz, náplast a dezinfekce", options: ["Nůžky na papír a lepidlo", "Obvaz, náplast a dezinfekce", "Teploměr na měření počasí", "Náhradní baterie a nabíječka"] },
  { question: "Co znamená kolísavý tón sirény?", correctAnswer: "Varování před nebezpečím", options: ["Zkouška školního rozhlasu", "Konec vyučování ve škole", "Varování před nebezpečím", "Oznámení pravého poledne"] },
  { question: "Kudy opustíš hořící budovu?", correctAnswer: "Po schodech ven z domu", options: ["Výtahem, je to rychlejší", "Schováš se do koupelny", "Zůstaneš stát u okna", "Po schodech ven z domu"] },
  { question: "Co uděláš, když kamarádovi teče krev z ranky na ruce?", correctAnswer: "Přitlačíš na ni čistou látku", options: ["Přitlačíš na ni čistou látku", "Opláchneš ji pod tekoucí vodou", "Počkáš, až to samo přestane", "Zafoukáš na ni, aby to nebolelo"] },
];

// L2 — aplikace: konkrétní situace vede ke konkrétnímu úkonu.
const POOL_L2: PracticeTask[] = [
  { question: "Operátor se tě ptá na podrobnosti. Co všechno mu řekneš?", correctAnswer: "Kde to je, co se stalo, kolik je zraněných a kdo volá", options: ["Jen adresu, na víc se stejně nikdo neptá", "Kde to je, co se stalo, kolik je zraněných a kdo volá", "Jen své jméno a číslo telefonu", "Jen to, jak k tomu zranění došlo"] },
  { question: "Jak dlouho chladíš popálené místo?", correctAnswer: "Deset až dvacet minut", options: ["Zhruba deset vteřin", "Celou hodinu bez přestávky", "Deset až dvacet minut", "Chladit se nemá vůbec"] },
  { question: "Kamarád spadl z kola a ruka mu otekla. Co uděláš?", correctAnswer: "Necháš ruku v klidu a přivoláš dospělého", options: ["Zkusíš mu ruku narovnat do správné polohy", "Rozhýbeš mu ruku, ať otok splaskne", "Přiložíš mu na ruku horký obklad", "Necháš ruku v klidu a přivoláš dospělého"] },
  { question: "Kamarád leží na zemi, nereaguje, ale dýchá. Co uděláš?", correctAnswer: "Zavoláš 155 a zůstaneš u něj", options: ["Zavoláš 155 a zůstaneš u něj", "Necháš ho odpočívat a odejdeš", "Posadíš ho a dáš mu napít", "Zkusíš ho probrat politím vodou"] },
  { question: "Teče ti krev z nosu. Co uděláš?", correctAnswer: "Předkloníš hlavu a stiskneš nosní křídla", options: ["Zakloníš hlavu co nejvíc dozadu", "Předkloníš hlavu a stiskneš nosní křídla", "Lehneš si na záda a chvíli počkáš", "Vysmrkáš se, ať krev vyjde ven"] },
  { question: "Na popálené kůži se udělal puchýř. Co s ním?", correctAnswer: "Necháš ho být a zakryješ ho", options: ["Propíchneš ho čistou jehlou", "Rozmáčkneš ho a vytřeš", "Necháš ho být a zakryješ ho", "Potřeš ho zubní pastou"] },
  { question: "Proč se při požáru pohybuješ co nejblíže u podlahy?", correctAnswer: "U země zůstává vzduch čistší", options: ["U země je vždycky chladněji", "Aby tě z chodby nikdo neviděl", "Abys nenarazil hlavou o strop", "U země zůstává vzduch čistší"] },
  { question: "Řeka se vylila z břehů a voda stoupá. Kam půjdeš?", correctAnswer: "Na vyvýšené místo dál od vody", options: ["Na vyvýšené místo dál od vody", "Na břeh se podívat, jak stoupá", "Do sklepa, tam je bezpečno", "Na most, odtud je nejlepší výhled"] },
  { question: "Na chodníku leží cizí člověk a nehýbe se. Co uděláš?", correctAnswer: "Zavoláš 155 a řekneš to dospělému", options: ["Projdeš kolem, není to tvoje věc", "Zavoláš 155 a řekneš to dospělému", "Zatřeseš s ním a postavíš ho", "Vezmeš mu telefon a zavoláš rodině"] },
  { question: "Kamaráda štípla včela do krku a začíná mu otékat. Co uděláš?", correctAnswer: "Okamžitě voláš 155", options: ["Dáš mu napít studené vody", "Přiložíš mu obklad a čekáš", "Okamžitě voláš 155", "Necháš to být, otok splaskne"] },
  { question: "Co nesmíš udělat člověku, který je v bezvědomí?", correctAnswer: "Dát mu napít nebo najíst", options: ["Přikrýt ho, aby mu nebyla zima", "Mluvit na něj, i když neodpovídá", "Zůstat u něj a čekat na pomoc", "Dát mu napít nebo najíst"] },
  { question: "Voláš na tísňovou linku, ale neznáš přesnou adresu. Co uděláš?", correctAnswer: "Popíšeš, co je kolem tebe vidět", options: ["Popíšeš, co je kolem tebe vidět", "Zavěsíš a hledáš někoho, kdo ji zná", "Řekneš jen město a zavěsíš", "Počkáš, až půjde kolem dospělý"] },
  { question: "Cítíš v bytě plyn. Co uděláš jako první?", correctAnswer: "Otevřeš okna a nezapínáš světlo", options: ["Rozsvítíš, ať vidíš, odkud jde", "Otevřeš okna a nezapínáš světlo", "Zapálíš sirku a zkontroluješ sporák", "Zavřeš okna, ať plyn neuteče ven"] },
];

// L3 — proč a v jakém pořadí: zdůvodnění pravidla, volba priority, vyvrácení mýtu.
const POOL_L3: PracticeTask[] = [
  { question: "Proč máš při tísňovém volání počkat, až hovor ukončí operátor?", correctAnswer: "Může se doptat a poradit ti, co dělat", options: ["Je to jen slušnost při telefonování", "Jinak se hovor nezapíše do systému", "Může se doptat a poradit ti, co dělat", "Aby se stihl zeptat na tvůj věk"] },
  { question: "Proč se se zlomenou končetinou nemá hýbat?", correctAnswer: "Pohyb může poranění ještě zhoršit", options: ["Zraněný by se mohl začít potit", "Kost by přirostla v jiné poloze", "Otok by se přesunul jinam", "Pohyb může poranění ještě zhoršit"] },
  { question: "Proč se popálenina nechladí ledem?", correctAnswer: "Led kůži poškodí mrazem", options: ["Led kůži poškodí mrazem", "Led nechladí dostatečně silně", "Led by ránu jenom znečistil", "Led by se moc rychle rozpustil"] },
  { question: "Proč se člověku v bezvědomí nesmí nic dát do úst?", correctAnswer: "Mohl by se tekutinou zadusit", options: ["Mohlo by mu být špatně od žaludku", "Mohl by se tekutinou zadusit", "Zkazilo by to vyšetření v nemocnici", "Zbytečně by se tím probudil"] },
  { question: "Jeden kamarád si odřel koleno, druhému teče krev z rozbité ruky. Komu pomůžeš dřív?", correctAnswer: "Tomu, kdo silně krvácí", options: ["Tomu s odřeným kolenem", "Tomu, kdo si řekne první", "Tomu, kdo silně krvácí", "Tomu, kdo stojí blíž k tobě"] },
  { question: "Proč se při požáru nesmí použít výtah?", correctAnswer: "Může se zastavit a uvěznit tě", options: ["Ve výtahu je vždycky víc kouře", "Výtah jezdí pomaleji než schody", "Výtah se od horka hned roztaví", "Může se zastavit a uvěznit tě"] },
  { question: "Proč se puchýř po popálenině nepropichuje?", correctAnswer: "Kůže pod ním je chráněná před špínou", options: ["Kůže pod ním je chráněná před špínou", "Bolelo by to pak ještě mnohem víc", "Puchýř sám od sebe zmizí do hodiny", "Zůstala by po něm velká jizva"] },
  { question: "Bezvědomého, který dýchá, uložíme na bok. Co tím získá?", correctAnswer: "Nezadusí se, kdyby se pozvracel", options: ["Rychleji se mu vrátí vědomí", "Nezadusí se, kdyby se pozvracel", "Lépe se mu na boku odpočívá", "Přestane ho bolet hlava"] },
  { question: "Co uděláš, když nevíš, jestli je zranění dost vážné na záchranku?", correctAnswer: "Zavoláš, vážnost posoudí operátor", options: ["Počkáš, jestli se to samo zhorší", "Zavoláš až ráno do ordinace", "Zavoláš, vážnost posoudí operátor", "Poradíš se nejdřív se spolužáky"] },
  { question: "Proč hlásíš místo neštěstí dřív než popis zranění?", correctAnswer: "Kdyby se hovor přerušil, pomoc už ví, kam jet", options: ["Protože je to kratší a řekne se to rychleji", "Operátor si stejně zapisuje jenom adresu", "Popis zranění se hlásí až v nemocnici", "Kdyby se hovor přerušil, pomoc už ví, kam jet"] },
  { question: "Proč se ani malý požár nemáš pokoušet uhasit sám?", correctAnswer: "Oheň se šíří rychleji, než čekáš", options: ["Oheň se šíří rychleji, než čekáš", "Hasiči by pak měli méně práce", "Za vlastní hašení se platí pokuta", "Voda by nábytek poškodila víc"] },
  { question: "Kamarád tvrdí, že popáleninu je nejlepší potřít máslem. Co mu odpovíš?", correctAnswer: "Mastnota teplo udrží a ránu zhorší", options: ["Má pravdu, máslo ránu ochladí", "Mastnota teplo udrží a ránu zhorší", "Lepší je na to sádlo než máslo", "Záleží na tom, jak je popálenina velká"] },
  { question: "Jsi doma sám a venku se rozezní siréna. Co uděláš nejdřív?", correctAnswer: "Zůstaneš uvnitř a zapneš rádio", options: ["Vyběhneš ven podívat se, co se děje", "Zavoláš na linku 155", "Zůstaneš uvnitř a zapneš rádio", "Otevřeš všechna okna dokořán"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 45);
}

export const PRVNIPOMOCTISNOVEVOLANIMIMORADNEUDALOSTI: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-clovek-a-jeho-zdravi-bezpecnost-prvni-pomoc-tisnove-volani-mimoradne-udalosti",
    rvpNodeId: "g4-prirodoveda-clovek-a-jeho-zdravi-bezpecnost-prvni-pomoc-tisnove-volani-mimoradne-udalosti",
    title: "První pomoc, tísňové volání, mimořádné události",
    studentTitle: "První pomoc",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Člověk a jeho zdraví",
    briefDescription: "Naučíš se přivolat pomoc a ošetřit drobné zranění, než přijde dospělý.",
    keywords: ["první pomoc", "tísňové volání", "112", "155", "krvácení", "popálenina", "zlomenina", "požár", "siréna"],
    goals: [
      "Znát tísňová čísla a vědět, co říct operátorovi",
      "Ošetřit drobné poranění a zastavit krvácení přitlačením",
      "Správně chladit popáleninu a vědět, co se dělat nesmí",
      "Zachovat se správně při požáru, povodni a při zvuku sirény",
      "Poznat situaci, kdy je nutné přivolat dospělého nebo záchrannou službu",
    ],
    boundaries: [
      "Neprobírá resuscitaci ani použití defibrilátoru — patří na 2. stupeň",
      "Neprobírá odborné záchranářské postupy (třídění zraněných, škrtidlo, ABCDE)",
      "Neprobírá podávání léků ani injekčních aplikátorů",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Čísla: 112 (platí v celé EU), 150 (hasiči), 155 (záchranka), 158 (policie).",
      steps: [
        "1. Volání: KDE, CO, KOLIK zraněných, KDO volá — hovor ukončí operátor.",
        "2. Krvácení: přitlač čistou látku, končetinu zvedni výš.",
        "3. Popálenina: studená tekoucí voda deset až dvacet minut — ne led, ne mast.",
        "4. Zlomenina: nehýbej s ní, nech ji v klidu, přivolej dospělého.",
        "5. Bezvědomí a dýchá: ulož na bok, zůstaň u něj, volej 155.",
        "6. Požár: nízko u země, po schodech, nikdy výtahem.",
      ],
      commonMistake: "Popálenina se nechladí ledem ani nemaže mastí — jen studenou tekoucí vodou.",
      example: "Kamarádovi teče krev z ruky: přitlač čistou látku, zvedni paži výš než srdce, zavolej dospělého.",
    },
  },
];
