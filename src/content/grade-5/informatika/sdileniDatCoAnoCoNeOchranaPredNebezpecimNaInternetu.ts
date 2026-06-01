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
  { question: "Co NESMÍM sdílet na internetu s cizími lidmi?", correctAnswer: "Svou domácí adresu", options: ["Svou domácí adresu", "Svou oblíbenou knihu", "Svůj oblíbený sport", "Barvu svého pokoje"], hints: ["Adresa = soukromá informace — cizí lidé ji nepotřebují vědět."] },
  { question: "Co je bezpečné sdílet na internetu?", correctAnswer: "Svůj oblíbený film nebo hudební skupinu", options: ["Svůj oblíbený film nebo hudební skupinu", "Své telefonní číslo", "Fotku svého průkazu", "Heslo k e-mailu"], hints: ["Oblíbený film nikomu neodhalí, kde bydlíš nebo jak tě kontaktovat."] },
  { question: "Co je phishing?", correctAnswer: "Podvodná zpráva, která se tváří jako důvěryhodná a snaží se získat heslo nebo data", options: ["Podvodná zpráva, která se tváří jako důvěryhodná a snaží se získat heslo nebo data", "Typ rybolovu na internetu", "Bezpečný způsob sdílení fotek", "Antivirový program"], hints: ["Phishing = 'rybáření' na citlivé údaje."] },
  { question: "Co je malware?", correctAnswer: "Škodlivý software, který poškozuje nebo napadá počítač", options: ["Škodlivý software, který poškozuje nebo napadá počítač", "Bezpečný program pro děti", "Typ sociální sítě", "Způsob sdílení fotek"], hints: ["Malware = malicious software = škodlivý program."] },
  { question: "Co je kyberšikana?", correctAnswer: "Šikana přes internet nebo telefon — ponižování, výhružky, zveřejnění soukromých fotek", options: ["Šikana přes internet nebo telefon — ponižování, výhružky, zveřejnění soukromých fotek", "Bezpečná hra online", "Typ antivirového programu", "Sdílení oblíbené hudby"], hints: ["Kyberšikana = šikana v digitálním prostředí."] },
  { question: "Co mám udělat, pokud dostanu podezřelý e-mail s odkazem na 'výhru'?", correctAnswer: "Ignorovat, nesměřovat odkaz klikat a říct dospělému", options: ["Ignorovat, nesměřovat odkaz klikat a říct dospělému", "Kliknout na odkaz a zkontrolovat výhru", "Přeposlat kamarádům", "Zaplatit poplatek za výhru"], hints: ["Nečekané 'výhry' z e-mailu = nejčastější podvod."] },
  { question: "Je bezpečné sdílet heslo k e-mailu s kamarádem?", correctAnswer: "Ne — heslo nesdílím s nikým", options: ["Ne — heslo nesdílím s nikým", "Ano — kamarád je důvěryhodný", "Ano — pokud ho požádám o pomoc", "Záleží na délce hesla"], hints: ["Heslo = tajné jen pro tebe. Nesdílej ho s nikým."] },
  { question: "Co mám udělat, pokud mě někdo online šikanuje?", correctAnswer: "Uchovám důkazy, řeknu rodičům nebo učiteli a zablokuji útočníka", options: ["Uchovám důkazy, řeknu rodičům nebo učiteli a zablokuji útočníka", "Odpovím agresivně zpět", "Ignoruji a sám to vyřeším", "Smažu svůj účet bez záznamu"], hints: ["Kyberšikana: důkaz + pomoc dospělého + zablokovat."] },
  { question: "Co je soukromý profil na sociální síti?", correctAnswer: "Profil, který vidí jen přijatí přátelé — ne cizí lidé", options: ["Profil, který vidí jen přijatí přátelé — ne cizí lidé", "Profil, který vidí každý", "Profil bez fotky", "Profil s pravým jménem"], hints: ["Soukromý = jen pro přijaté přátele."] },
  { question: "Co mám dělat, pokud mě cizí člověk online žádá o mou fotku?", correctAnswer: "Odmítnout a říct rodičům", options: ["Odmítnout a říct rodičům", "Poslat fotku, pokud je hezky napsaný", "Poslat fotku bez tváře", "Sdílet jen přes bezpečný odkaz"], hints: ["Cizí lidé online nepotřebují tvou fotku."] },
  { question: "Proč nemám uvádět na internetu jméno a příjmení dohromady s adresou školy?", correctAnswer: "Kombinace identifikuje, kde jsi — cizí člověk tě může najít", options: ["Kombinace identifikuje, kde jsi — cizí člověk tě může najít", "Škola to zakazuje kvůli byznysu", "Je to nevhodné jen pro dospělé", "Kombinace zabere příliš místa"], hints: ["Jméno + škola = cizí člověk ví, kde tě hledat."] },
  { question: "Co je catfishing?", correctAnswer: "Situace, kdy se někdo online vydává za jinou osobu – falešná identita", options: ["Situace, kdy se někdo online vydává za jinou osobu – falešná identita", "Bezpečná forma rybolovu online", "Typ antivirového programu", "Způsob blokování na sociálních sítích"], hints: ["Catfishing = předstírání falešné identity online."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Dostaneš e-mail: 'Vyhral jsi iPhone! Klikni zde a zadej číslo karty.' Co uděláš?", correctAnswer: "Smažu e-mail, neklikám a řeknu rodičům — je to phishing", options: ["Smažu e-mail, neklikám a řeknu rodičům — je to phishing", "Kliknu a zadám číslo karty", "Přepošlu kamarádovi", "Zavolám na číslo v e-mailu"], hints: ["Nečekaná výhra + žádost o data = phishing."] },
  { question: "Kamarád ti říká, že nezveřejní tvou fotku, pokud mu dáš heslo. Co uděláš?", correctAnswer: "Odmítnu, neřeknu heslo a řeknu dospělému — to je vydírání", options: ["Odmítnu, neřeknu heslo a řeknu dospělému — to je vydírání", "Dám heslo, ať fotku nezveřejní", "Smažu svůj účet", "Ignoruji situaci"], hints: ["Vydírání = nikdy nesplňuj požadavky vydíratele. Řekni dospělému."] },
  { question: "Proč je sdílení fotek na internetu 'nevratné'?", correctAnswer: "Fotka se může kopírovat a šířit — i po smazání zůstane na serverech nebo u lidí", options: ["Fotka se může kopírovat a šířit — i po smazání zůstane na serverech nebo u lidí", "Fotky se automaticky mažou po 24 hodinách", "Fotku lze vzít zpět stisknutím tlačítka", "Sdílení fotek je vždy bezpečné"], hints: ["Internet si pamatuje — jednou nahraná fotka může zůstat navždy."] },
  { question: "Jak poznám podezřelý odkaz v e-mailu?", correctAnswer: "Odkaz vede na neznámou adresu, e-mail je od cizího odesílatele, urgentní tón", options: ["Odkaz vede na neznámou adresu, e-mail je od cizího odesílatele, urgentní tón", "Odkaz je vždy bezpečný, pokud je barevný", "Podezřelé e-maily mají vždy chybu pravopisu", "Každý odkaz v e-mailu je nebezpečný"], hints: ["Podezřelý odkaz: neznámý odesílatel + tlak na akci + neznámá adresa."] },
  { question: "Cizí člověk online říká, že je spolužák tvého kamaráda a chce znát tvou adresu. Co uděláš?", correctAnswer: "Adresu neposkytnu a situaci řeknu rodičům", options: ["Adresu neposkytnu a situaci řeknu rodičům", "Dám adresu, pokud zní přátelsky", "Ověřím u kamaráda a pak adresu dám", "Adresu pošlu přes soukromou zprávu"], hints: ["Online identity nelze ověřit. Adresu nedávej nikomu."] },
  { question: "Proč je důležité mít na sociální síti soukromý profil?", correctAnswer: "Cizí lidé nemohou vidět moje příspěvky, fotky a osobní informace", options: ["Cizí lidé nemohou vidět moje příspěvky, fotky a osobní informace", "Soukromý profil zvýší počet sledujících", "Soukromý profil zabrání virům", "Cizí lidé lépe vidí moje příspěvky"], hints: ["Soukromý = jen přijatí přátelé vidí tvůj obsah."] },
  { question: "Co je bezpečné heslo?", correctAnswer: "Kombinace písmen, čísel a symbolů — min. 8 znaků, bez jména nebo data narození", options: ["Kombinace písmen, čísel a symbolů — min. 8 znaků, bez jména nebo data narození", "Tvoje jméno a rok narození", "Slovo z důkladně", "Heslo '12345' kvůli snadnému zapamatování"], hints: ["Dobré heslo = dlouhé, složité, bez osobních údajů."] },
  { question: "Co mám dělat, pokud někdo online zveřejní mou soukromou fotku bez mého souhlasu?", correctAnswer: "Řeknu rodičům, fotku nahlásím jako nevhodnou obsah a požádám o smazání", options: ["Řeknu rodičům, fotku nahlásím jako nevhodnou obsah a požádám o smazání", "Zveřejním fotku útočníka na oplátku", "Ignoruji situaci", "Smažu svůj účet bez nahlášení"], hints: ["Zveřejnění soukromé fotky = porušení soukromí. Nahlas a požádej o smazání."] },
  { question: "Proč nemám přijímat žádosti o přátelství od lidí, které neznám osobně?", correctAnswer: "Cizí člověk může mít falešnou identitu – catfishing a přístup k mým soukromým příspěvkům", options: ["Cizí člověk může mít falešnou identitu – catfishing a přístup k mým soukromým příspěvkům", "Více přátel je vždy lepší", "Cizí přátelé jsou bezpečnější než známí", "Online přátelé jsou vždy upřímní"], hints: ["Přijmout cizince = dát mu přístup k soukromému profilu."] },
  { question: "Jak se chráním před malwarem?", correctAnswer: "Nestahovat soubory z neznámých zdrojů, mít antivirový program, aktualizovat software", options: ["Nestahovat soubory z neznámých zdrojů, mít antivirový program, aktualizovat software", "Používat internet jen v noci", "Sdílet hesla s kamarádem", "Nestahovat obrázky"], hints: ["Malware se šíří přes neznámé stažené soubory."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Kamarád ti posílá odkaz na 'super hru zdarma' ke stažení z neznámé stránky. Co uděláš?", correctAnswer: "Nestáhnu — soubory z neznámých zdrojů mohou obsahovat malware", options: ["Nestáhnu — soubory z neznámých zdrojů mohou obsahovat malware", "Stáhnu hned — kamarád je důvěryhodný", "Stáhnu jen pokud je to .exe soubor", "Přepošlu dalším kamarádům"], hints: ["I kamarád může nevědomky šířit malware."] },
  { question: "Proč je špatné používat stejné heslo na více webech?", correctAnswer: "Pokud jeden web unikne heslo, útočník získá přístup na všechny ostatní weby", options: ["Pokud jeden web unikne heslo, útočník získá přístup na všechny ostatní weby", "Každý web vyžaduje různé heslo ze zákona", "Stejné heslo se snáze uhádne", "Webům to nevyhovuje technicky"], hints: ["Jedno uniknuté heslo = přístup na všechny weby se stejným heslem."] },
  { question: "Online cizinec tvrdí, že je tvůj věk a chce se sejít osobně. Co uděláš?", correctAnswer: "Odmítnu, nechodím se setkávat s cizinci z internetu a řeknu rodičům", options: ["Odmítnu, nechodím se setkávat s cizinci z internetu a řeknu rodičům", "Sejdu se na veřejném místě", "Pošlu nejprve fotku k ověření", "Sejdu se s kamarádem jako doprovodem"], hints: ["Nikdy se nesetkávej s cizinci z internetu bez vědomí dospělých."] },
  { question: "Co jsou digitální stopy?", correctAnswer: "Záznamy o tvé aktivitě online — co jsi napsal, sdílel, kdy jsi byl online", options: ["Záznamy o tvé aktivitě online — co jsi napsal, sdílel, kdy jsi byl online", "Viry přenášené přes internet", "Bezpečnostní certifikáty webů", "Přílohy v e-mailech"], hints: ["Digitální stopa = otisk tvé online aktivity."] },
  { question: "Proč je sdílení přesné polohy (GPS) na sociálních sítích nebezpečné?", correctAnswer: "Cizí lidé mohou zjistit, kde se právě nacházíš — ohrožení bezpečnosti", options: ["Cizí lidé mohou zjistit, kde se právě nacházíš — ohrožení bezpečnosti", "Poloha je jen pro přátele a je bezpečná", "GPS sdílení je technicky nemožné", "Poloha neprozradí nic osobního"], hints: ["Poloha v reálném čase = cizí lidé vědí, kde jsi."] },
  { question: "Dostaneš SMS: 'Tvůj účet byl hacknutý. Přihlaš se ihned na odkazu.' Co uděláš?", correctAnswer: "Neklikám na odkaz — přihlásím se přímo přes oficiální aplikaci nebo web", options: ["Neklikám na odkaz — přihlásím se přímo přes oficiální aplikaci nebo web", "Kliknu na odkaz a přihlásím se rychle", "Odpovím na SMS svým heslem", "Ignoruji SMS a smažu celý účet"], hints: ["Urgentní SMS s odkazem = phishing. Vždy jdi přímo na stránku bez odkazu."] },
  { question: "Jak poznám phishingový e-mail od legitimního?", correctAnswer: "Phishing má neznámého odesílatele, nátlak na rychlou akci a podezřelý odkaz – neodpovídá webu", options: ["Phishing má neznámého odesílatele, nátlak na rychlou akci a podezřelý odkaz – neodpovídá webu", "Phishing je vždy psán špatnou češtinou", "Legitimní e-mail nikdy nemá přílohy", "Phishing vždy žádá telefonní číslo"], hints: ["Zkontroluj: odesílatele, odkaz (najeď myší), urgenci."] },
  { question: "Co mám udělat okamžitě, pokud mi kamarád napsal, že byl hacknutý a žádá mě o heslo k 'záchraně dat'?", correctAnswer: "Nesplnit — heslo neposkytnu nikomu. Zavolám kamarádovi přímo a ověřím situaci.", options: ["Nesplnit — heslo neposkytnu nikomu. Zavolám kamarádovi přímo a ověřím situaci.", "Pošlu heslo — kamarád to potřebuje", "Pošlu heslo přes soukromou zprávu", "Ignoruji a smažu zprávu"], hints: ["Hacknutý účet kamaráda může ovládat útočník — ověř situaci jinak."] },
  { question: "Proč mám nahlásit kyberšikanu místo pouhého blokování útočníka?", correctAnswer: "Nahlášení pomůže zastavit útočníka i pro ostatní oběti a zanechá záznam", options: ["Nahlášení pomůže zastavit útočníka i pro ostatní oběti a zanechá záznam", "Blokování stačí a útočník přestane", "Nahlášení je zbytečné — nic se nestane", "Nahlášení zasáhne jen mě"], hints: ["Útočník může šikanovat i ostatní — nahlášení chrání i je."] },
  { question: "Jaký je princip 'digitálního stopového otisku' (digital footprint)?", correctAnswer: "Vše, co online sdílíš nebo děláš, zanechá stopu, která může být viditelná i po smazání", options: ["Vše, co online sdílíš nebo děláš, zanechá stopu, která může být viditelná i po smazání", "Online stopy se automaticky mažou po 30 dnech", "Stopy existují jen na sociálních sítích", "Soukromý profil nemá žádný digitální otisk"], hints: ["Internet si pamatuje — přemýšlej, než něco sdílíš."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const SDILENIDATCOANOCONEOCHRANAPREDNEBEZPECIMNAINTERNETU: TopicMetadata[] = [
  {
    id: "g5-informatika-digitalni-technologie-bezpecnost-online-sdileni-dat-co-ano-co-ne-ochrana-pred-nebezpecim-na-internet",
    rvpNodeId: "g5-informatika-digitalni-technologie-bezpecnost-online-sdileni-dat-co-ano-co-ne-ochrana-pred-nebezpecim-na-internet",
    title: "Sdílení dat - co ano, co ne; ochrana před nebezpečím na internetu",
    studentTitle: "Bezpečnost na internetu",
    subject: "informatika",
    category: "Digitální technologie",
    topic: "Bezpečnost online",
    briefDescription: "Naučíš se bezpečně sdílet data a chránit se online.",
    keywords: ["kyberšikana", "phishing", "malware", "heslo", "soukromý profil", "bezpečnost", "internet", "catfishing"],
    goals: [
      "Rozlišuje bezpečné a nebezpečné sdílení informací online.",
      "Rozumí pojmům phishing, malware, catfishing, kyberšikana.",
      "Ví, jak správně reagovat na online hrozby.",
    ],
    boundaries: ["Technické zabezpečení sítí", "Šifrování dat", "Právní aspekty kyberkriminality"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Nesdílej: adresu, telefon, heslo, fotky cizím lidem. Phishing = podvodná výzva k zadání dat. Kyberšikana: uchovej důkaz, řekni dospělému.",
      steps: [
        "Před sdílením se zeptej: potřebuje cizí člověk tuto informaci?",
        "Heslo drž tajné — nesdílej ho s nikým.",
        "Podezřelý odkaz nebo e-mail? Neklikej, řekni dospělému.",
        "Kyberšikana? Uchovej důkazy a řekni rodičům nebo učiteli.",
      ],
      commonMistake: "Záměna korelace a kauzality — blokování útočníka nestačí, pokud šikanuje i ostatní. Je třeba nahlásit.",
      example: "Phishing: 'Vyhral jsi cenu — klikni zde!' → ignoruj a smaž. Kyberšikana: screenshotuji zprávy, řeknu rodičům, zablokaváno.",
    },
  },
];
