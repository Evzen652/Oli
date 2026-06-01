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
    question: "Co NIKDY nesdílej s cizími lidmi online?",
    correctAnswer: "Domácí adresu, telefonní číslo a hesla",
    options: shuffle(["Domácí adresu, telefonní číslo a hesla", "Oblíbenou barvu", "Název oblíbené hry", "Obrázky přírody"]),
    hints: ["Cizí lidé online mohou zneužít osobní informace.", "Adresa + jméno = cizí člověk tě může najít."],
  },
  {
    question: "Co je silné heslo?",
    correctAnswer: "Alespoň 8 znaků s velkými, malými písmeny, číslicemi a symboly",
    options: shuffle(["Alespoň 8 znaků s velkými, malými písmeny, číslicemi a symboly", "Jméno domácího mazlíčka", "Datum narozenin", "Slovo 'heslo' nebo '12345'"]),
    hints: ["Silné heslo je těžké uhodnout.", "Smíchej písmena, číslice a symboly jako !@#$."],
  },
  {
    question: "Je správné používat stejné heslo pro všechny účty?",
    correctAnswer: "Ne — každý účet by měl mít jiné heslo",
    options: shuffle(["Ne — každý účet by měl mít jiné heslo", "Ano — je to přehlednější", "Záleží na důležitosti účtu", "Ano, pokud je heslo dlouhé"]),
    hints: ["Jedno heslo pro vše = pokud ho někdo zjistí, má přístup všude.", "Různá hesla = větší bezpečnost."],
  },
  {
    question: "Co je phishing?",
    correctAnswer: "Podvodný e-mail nebo web, který chce ukrást heslo nebo platební kartu",
    options: shuffle(["Podvodný e-mail nebo web, který chce ukrást heslo nebo platební kartu", "Druh rybolovu", "Bezpečný způsob přihlášení", "Typ antivirového programu"]),
    hints: ["Phishing = podvodný e-mail tvářící se jako banka.", "Nikdy nezadávej heslo na odkaz z e-mailu."],
  },
  {
    question: "Co je kyberšikana?",
    correctAnswer: "Šikana přes internet (SMS, sociální sítě, hry)",
    options: shuffle(["Šikana přes internet (SMS, sociální sítě, hry)", "Šikana v reálném životě", "Virový útok na počítač", "Spam v e-mailu"]),
    hints: ["Kyber = digitální, šikana = ubližování.", "Urážení přes chat nebo hry = kyberšikana."],
  },
  {
    question: "Co udělat, pokud tě někdo šikanuje online?",
    correctAnswer: "Zachovej důkazy, řekni důvěryhodné dospělé a zablokuj útočníka",
    options: shuffle(["Zachovej důkazy, řekni důvěryhodné dospělé a zablokuj útočníka", "Odpověz útočníkovi stejně", "Smaž svůj účet okamžitě", "Mlč a nic nedělej"]),
    hints: ["Důkazy = screenshoty zpráv.", "Dospělý ti pomůže situaci řešit."],
  },
  {
    question: "Kolik let musíš mít pro většinu sociálních sítí (Facebook, Instagram, TikTok)?",
    correctAnswer: "Minimálně 13 let",
    options: shuffle(["Minimálně 13 let", "Minimálně 10 let", "Minimálně 16 let", "Žádná věková hranice neexistuje"]),
    hints: ["Facebook, Instagram, TikTok = věková hranice 13 let.", "Věkové omezení chrání děti."],
  },
  {
    question: "Co se stane s tím, co sdílíš na internetu?",
    correctAnswer: "Zůstane na internetu prakticky navždy",
    options: shuffle(["Zůstane na internetu prakticky navždy", "Smaže se po 30 dnech", "Vidí to jen přátelé", "Smaže se po odhlášení"]),
    hints: ["Internet = digitální otisk, těžko smazatelný.", "Než sdílíš, přemýšlej."],
  },
  {
    question: "Proč by měl být profil na sociální síti nastavený jako soukromý?",
    correctAnswer: "Aby tvůj obsah viděli jen přátelé, ne cizí lidé",
    options: shuffle(["Aby tvůj obsah viděli jen přátelé, ne cizí lidé", "Aby profil byl rychlejší", "Soukromý profil je požadavek zákona", "Aby se zobrazovalo méně reklam"]),
    hints: ["Soukromý profil = jen přijatí přátelé uvidí příspěvky.", "Veřejný profil = vidí ho kdokoliv."],
  },
  {
    question: "Proč je dobré dávat přestávky od obrazovek každých 30-45 minut?",
    correctAnswer: "Oči i mozek potřebují odpočinek, dlouhé sezení škodí zdraví",
    options: shuffle(["Oči i mozek potřebují odpočinek, dlouhé sezení škodí zdraví", "Kvůli šetření baterie", "Sociální sítě automaticky přerušují spojení", "Jen pokud hraješ hry"]),
    hints: ["Oči unaví nepřetržité sledování obrazovky.", "Pravidlo 20-20-20: každých 20 minut pohled na 20 sekund do 20 metrů."],
  },
  {
    question: "Smíš přijmout žádost o přátelství od cizího člověka na sociální síti?",
    correctAnswer: "Ne — přijímej jen lidi, které osobně znáš",
    options: shuffle(["Ne — přijímej jen lidi, které osobně znáš", "Ano, čím více přátel tím lépe", "Záleží na věku cizí osoby", "Ano, pokud mají fotku profilovou"]),
    hints: ["Cizí online = může být nebezpečný.", "Online identita ≠ skutečná osoba."],
  },
  {
    question: "Co je screen time a proč ho hlídat?",
    correctAnswer: "Čas strávený u obrazovky — přílišné množství škodí zdraví a spánku",
    options: shuffle(["Čas strávený u obrazovky — přílišné množství škodí zdraví a spánku", "Typ bezpečnostního nastavení telefonu", "Aplikace na hraní her", "Záloha fotografií"]),
    hints: ["Příliš mnoho obrazovky → méně pohybu, horší spánek.", "Rodič může nastavit denní limit."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co je dvoufaktorové ověření (2FA)?",
    correctAnswer: "Přihlášení pomocí hesla + druhého faktoru (SMS kód, aplikace)",
    options: shuffle(["Přihlášení pomocí hesla + druhého faktoru (SMS kód, aplikace)", "Dvě hesla pro jeden účet", "Přihlášení bez hesla", "Antivirový program"]),
    hints: ["2FA = heslo + kód z mobilu.", "I když někdo zná heslo, bez druhého faktoru se nepřihlásí."],
  },
  {
    question: "Proč je nebezpečné klikat na odkazy v podezřelých e-mailech?",
    correctAnswer: "Odkaz může vést na phishingový web nebo spustit škodlivý program",
    options: shuffle(["Odkaz může vést na phishingový web nebo spustit škodlivý program", "E-mail se tím smaže", "Odkaz zobrazí reklamu", "Nic se nestane"]),
    hints: ["Phishing = podvodná kopie webu.", "Nikdy neklikej na odkaz z e-mailu, pokud si nejsi jistý odesílatelem."],
  },
  {
    question: "Co je GDPR?",
    correctAnswer: "Evropský zákon o ochraně osobních údajů",
    options: shuffle(["Evropský zákon o ochraně osobních údajů", "Typ antivirového programu", "Pravidla pro silná hesla", "Věková hranice pro sociální sítě"]),
    hints: ["GDPR = General Data Protection Regulation.", "Zákon říká, jak firmy smí zacházet s tvými daty."],
  },
  {
    question: "Co jsou osobní údaje, které zákon chrání?",
    correctAnswer: "Jméno, příjmení, adresa, telefon, e-mail, rodné číslo, fotografie",
    options: shuffle(["Jméno, příjmení, adresa, telefon, e-mail, rodné číslo, fotografie", "Oblíbená barva a jídlo", "Název knihy nebo hry", "Počasí v místě bydliště"]),
    hints: ["Osobní údaj = identifikuje konkrétní osobu.", "Zákon chrání data, která odhalují kdo a kde jsi."],
  },
  {
    question: "Proč je špatné sdílet hesla kamarádům?",
    correctAnswer: "Kamarád může sdílet heslo dál nebo ho zneužít",
    options: shuffle(["Kamarád může sdílet heslo dál nebo ho zneužít", "Hesla nejsou důvěrná", "Kamarádi jsou vždy bezpeční", "Hesla si je lepší pamatovat spolu"]),
    hints: ["Heslo = tajemství pouze pro tebe.", "Nikdy nikomu nesděluj heslo."],
  },
  {
    question: "Co je digitální stopa?",
    correctAnswer: "Veškerá data, která zanecháváš při používání internetu",
    options: shuffle(["Veškerá data, která zanecháváš při používání internetu", "Hardwarový identifikátor počítače", "Záloha souborů", "Typ viru"]),
    hints: ["Digitální stopa = like, komentář, přihlášení, stažení.", "Vše, co děláš online, zanechává stopu."],
  },
  {
    question: "Proč je dobré nepoužívat veřejné WiFi sítě pro přihlašování?",
    correctAnswer: "Veřejná WiFi může být odposlouchávána — hesla jsou přístupná útočníkovi",
    options: shuffle(["Veřejná WiFi může být odposlouchávána — hesla jsou přístupná útočníkovi", "Veřejná WiFi je vždy pomalá", "Veřejná WiFi automaticky krade data", "Veřejná WiFi není problém"]),
    hints: ["Nezabezpečená WiFi = nebezpečí odposlechu.", "Neposílej citlivá data na veřejné WiFi."],
  },
  {
    question: "Co by mělo být součástí bezpečného hesla?",
    correctAnswer: "Velká i malá písmena, číslice a speciální znaky (!@#$%)",
    options: shuffle(["Velká i malá písmena, číslice a speciální znaky (!@#$%)", "Jen číslice", "Jen malá písmena", "Datum narozenin a jméno"]),
    hints: ["Čím různorodější znaky, tím těžší uhádnutí.", "Heslo 'Abc!23xQ' je silné."],
  },
  {
    question: "Co je malware?",
    correctAnswer: "Škodlivý software (vir, trojan) poškozující počítač nebo krádež dat",
    options: shuffle(["Škodlivý software (vir, trojan) poškozující počítač nebo krádež dat", "Bezplatný software", "Typ antivirového programu", "Zálohovací software"]),
    hints: ["Malware = malicious software = škodlivý program.", "Viry, trojské koně, ransomware jsou malware."],
  },
  {
    question: "Jak poznáš phishingový e-mail?",
    correctAnswer: "Podezřelý odesílatel, naléhavá výzva, odkaz na falešný web",
    options: shuffle(["Podezřelý odesílatel, naléhavá výzva, odkaz na falešný web", "Gramaticky bezchybný text", "Zpráva od kamaráda", "Potvrzení objednávky"]),
    hints: ["Phishing = 'Váš účet bude zablokován, klikněte ZDE!'", "Banky nikdy nežádají heslo e-mailem."],
  },
  {
    question: "Co je ransomware?",
    correctAnswer: "Malware, který zašifruje soubory a žádá výkupné za odšifrování",
    options: shuffle(["Malware, který zašifruje soubory a žádá výkupné za odšifrování", "Antivirový program", "Zálohovací software", "Reklamní program"]),
    hints: ["Ransomware = ransom (výkupné) + software.", "Záloha dat je ochrana před ransomwarem."],
  },
  {
    question: "Proč je dobré mít nainstalovaný antivirový program?",
    correctAnswer: "Detekuje a odstraňuje škodlivé programy (malware, viry)",
    options: shuffle(["Detekuje a odstraňuje škodlivé programy (malware, viry)", "Urychluje internet", "Zabraňuje kyberšikaně", "Blokuje sociální sítě"]),
    hints: ["Antivirus = strážce počítače.", "Pravidelně ho aktualizuj."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co je sociální inženýrství v kybernetické bezpečnosti?",
    correctAnswer: "Manipulace lidí k prozrazení hesel nebo citlivých informací (ne technický útok)",
    options: shuffle(["Manipulace lidí k prozrazení hesel nebo citlivých informací (ne technický útok)", "Technický útok na server", "Tvorba sociálních sítí", "Typ šifrování"]),
    hints: ["Sociální inženýrství = útočník přesvědčí tě, ne počítač.", "Phishing je forma sociálního inženýrství."],
  },
  {
    question: "Co je to šifrování dat (end-to-end encryption)?",
    correctAnswer: "Zpráva se zakóduje tak, že ji přečte jen odesílatel a příjemce",
    options: shuffle(["Zpráva se zakóduje tak, že ji přečte jen odesílatel a příjemce", "Zpráva se zálohu na serveru", "Zpráva se komprimuje pro rychlý přenos", "Typ filtru spamu"]),
    hints: ["End-to-end = šifrování od zdroje k cíli.", "WhatsApp a Signal používají end-to-end šifrování."],
  },
  {
    question: "Co je VPN (Virtual Private Network) a proč ho lidé používají?",
    correctAnswer: "Šifrovaný tunel pro internet — skrývá IP adresu a chrání soukromí",
    options: shuffle(["Šifrovaný tunel pro internet — skrývá IP adresu a chrání soukromí", "Typ antivirového programu", "Zálohovací systém", "Způsob připojení k WiFi"]),
    hints: ["VPN = skryje, odkud se připojuješ.", "Bezpečnější surfování na veřejné WiFi s VPN."],
  },
  {
    question: "Jak funguje princip 'nejmenšího privilegia' v IT bezpečnosti?",
    correctAnswer: "Uživatel má přístup jen k tomu, co potřebuje pro svou práci",
    options: shuffle(["Uživatel má přístup jen k tomu, co potřebuje pro svou práci", "Admin má vždy přístup ke všemu", "Hesla jsou sdílená mezi uživateli", "Veškerá data jsou veřejná"]),
    hints: ["Méně přístupu = méně rizika.", "Žák nepotřebuje přístup k databázi učitelů."],
  },
  {
    question: "Co je zero-day exploit?",
    correctAnswer: "Útok využívající chybu softwaru, o které výrobce ještě neví",
    options: shuffle(["Útok využívající chybu softwaru, o které výrobce ještě neví", "Denní záloha dat", "Útok v den instalace softwaru", "Typ phishingu"]),
    hints: ["Zero-day = chyba ještě neopravena.", "Výrobce 'neví' = 0 dní na opravu."],
  },
  {
    question: "Co je digitální identita a proč ji chránit?",
    correctAnswer: "Soubor dat o tobě online (profily, aktivity) — zneužití poškodí pověst i bezpečnost",
    options: shuffle(["Soubor dat o tobě online (profily, aktivity) — zneužití poškodí pověst i bezpečnost", "Uživatelské jméno na jednom webu", "Číslo občanského průkazu", "Databáze hesel"]),
    hints: ["Digitální identita = vše, co o tobě existuje online.", "Kradení identity = zneužití tvých dat k podvodům."],
  },
  {
    question: "Proč je HTTPS (zelený zámek) v adrese webu důležitý?",
    correctAnswer: "HTTPS = šifrované připojení — nikdo nemůže odposlouchávat přenášená data",
    options: shuffle(["HTTPS = šifrované připojení — nikdo nemůže odposlouchávat přenášená data", "HTTPS = web je ověřený a bezpečný obsah", "HTTPS = web je bez reklam", "HTTPS je jen dekorace"]),
    hints: ["HTTPS = Hypertext Transfer Protocol Secure.", "Bez HTTPS = HTTP = nešifrovaný přenos."],
  },
  {
    question: "Co je botnet?",
    correctAnswer: "Síť infikovaných počítačů ovládaných hackerem pro útoky",
    options: shuffle(["Síť infikovaných počítačů ovládaných hackerem pro útoky", "Antivirová databáze", "Typ sociální sítě", "Zálohovací síť"]),
    hints: ["Bot = robot, net = síť.", "Botnety se používají pro SPAM a DDoS útoky."],
  },
  {
    question: "Co je doxxing?",
    correctAnswer: "Záměrné zveřejnění osobních informací o cizí osobě bez jejího souhlasu",
    options: shuffle(["Záměrné zveřejnění osobních informací o cizí osobě bez jejího souhlasu", "Typ malwaru", "Záloha dokumentů", "Druh šifrování"]),
    hints: ["Doxxing = dox = documents (dokumenty).", "Zveřejnění adresy nebo telefonu je doxxing."],
  },
  {
    question: "Proč je bezpečnostní záplata (update softwaru) důležitá?",
    correctAnswer: "Záplata opravuje zranitelnosti, které útočníci mohou zneužít",
    options: shuffle(["Záplata opravuje zranitelnosti, které útočníci mohou zneužít", "Update přidává jen nové funkce", "Záplata urychluje internet", "Update je jen pro nové počítače"]),
    hints: ["Starý software = neopravené chyby = snadný cíl.", "Pravidelné aktualizace = základ bezpečnosti."],
  },
  {
    question: "Co je správce hesel (password manager)?",
    correctAnswer: "Aplikace, která bezpečně ukládá a generuje silná hesla pro různé účty",
    options: shuffle(["Aplikace, která bezpečně ukládá a generuje silná hesla pro různé účty", "Typ dvoufaktorového ověření", "Prohlížeč hesel na internetu", "Antivirový program"]),
    hints: ["Password manager = trezor na hesla.", "Nemusíš si pamatovat 100 hesel — jen jedno hlavní."],
  },
  {
    question: "Co je DDoS útok?",
    correctAnswer: "Distributed Denial of Service — přehlcení serveru obrovským množstvím požadavků",
    options: shuffle(["Distributed Denial of Service — přehlcení serveru obrovským množstvím požadavků", "Druh malwaru", "Typ phishingu", "Útok na hesla hrubou silou"]),
    hints: ["DDoS = tisíce počítačů zaplavují server požadavky.", "Server přestane odpovídat = nedostupný."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool =
    level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 40);
}

export const BEZPECNECHOVANIVDIGITALNIMPROSTREDIOCHRANAOSOBNICHUDAJU: TopicMetadata[] = [
  {
    id: "g4-informatika-digitalni-technologie-bezpecnost-online-bezpecne-chovani-v-digitalnim-prostredi-ochrana-osobnich-uda",
    rvpNodeId: "g4-informatika-digitalni-technologie-bezpecnost-online-bezpecne-chovani-v-digitalnim-prostredi-ochrana-osobnich-uda",
    title: "Bezpečné chování v digitálním prostředí, ochrana osobních údajů",
    studentTitle: "Bezpečnost online",
    subject: "informatika",
    category: "Digitální technologie",
    topic: "Digitální technologie",
    briefDescription: "Naučíš se chránit své osobní údaje a bezpečně se chovat na internetu.",
    keywords: ["heslo", "phishing", "kyberšikana", "osobní údaje", "sociální sítě", "bezpečnost"],
    goals: [
      "Žák vyjmenuje, co nesdílet online s cizími",
      "Žák popíše vlastnosti silného hesla",
      "Žák vysvětlí pojem kyberšikana a jak na ni reagovat",
    ],
    boundaries: ["Žák se nezabývá technickými detaily kryptografie a šifrování"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "conceptual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Nesdílej adresu, heslo ani fotky cizím. Silné heslo = velká+malá+číslice+symbol. Kyberšikana = zachovej důkazy, řekni dospělému.",
      steps: [
        "Přemýšlej: může tato informace cizímu ublížit nebo tě ohrozit?",
        "Heslo = tajemství, nesdílej ho nikomu",
        "Kyberšikana = oznam dospělému, zablokuj, zachovej důkazy",
      ],
      commonMistake: "Myšlenka, že 'mě se to netýká' — kyberšikana i phishing se mohou stát každému.",
      example: "Dobrý heslo: 'Jaro!2025xQ'. Špatné heslo: 'heslo123' nebo datum narozenin.",
    },
  },
];
