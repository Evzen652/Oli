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
    question: "Jaké je telefonní číslo hasičů?",
    correctAnswer: "150",
    options: ["150", "155", "158", "112"],
    hints: [
      "Hasiči hasí požáry. Jejich číslo začíná na 15.",
      "150 = hasiči, 155 = záchranná služba, 158 = policie, 112 = tísňová linka.",
    ],
    explanation: "Hasiči mají číslo 150. Pamatuj si: 150 = hasiči (oheň), 155 = záchranná služba (nemoc), 158 = policie (zločin), 112 = evropská tísňová linka pro všechno.",
  },
  {
    question: "Koho zavoláš, když někdo omdlí a potřebuje rychle doktora?",
    correctAnswer: "Záchrannou službu — 155",
    options: ["Záchrannou službu — 155", "Hasiče — 150", "Policii — 158", "Obecní úřad"],
    hints: [
      "Jde o zdravotní příhodu — potřebujeme lékaře.",
      "Záchranná služba má číslo 155.",
    ],
    explanation: "Záchranná služba (155) jezdí k nemocným a zraněným lidem. Hasiči (150) jezdí k požárům a nehodám, policie (158) řeší zločiny a nebezpečné situace.",
  },
  {
    question: "Jaké číslo zavolám, když vidím, že někdo vykrádá auto?",
    correctAnswer: "158 — policie",
    options: ["158 — policie", "150 — hasiči", "155 — záchranná služba", "116 000 — linka pro děti"],
    hints: [
      "Vykrádání auta je trestná činnost — kdo ji řeší?",
      "Policie chrání pořádek a řeší zločiny.",
    ],
    explanation: "Policie má číslo 158. Volíme ji, když jsme svědky trestného činu, ztratíme se nebo potřebujeme pomoc s bezpečností. Hasiči ani záchranná služba zločiny neřeší.",
  },
  {
    question: "Co je číslo 112?",
    correctAnswer: "Evropská tísňová linka — funguje všude v Evropě",
    options: ["Evropská tísňová linka — funguje všude v Evropě", "Číslo jen pro děti", "Číslo hasičů v Praze", "Informační linka"],
    hints: [
      "Toto číslo funguje v celé Evropě, nejen v Česku.",
      "Lze volat i ze zahraničí nebo bez kreditu na mobilu.",
    ],
    explanation: "Číslo 112 je evropská tísňová linka. Funguje ve všech zemích EU, i bez kreditu a SIM karty. Operátor tě přepojí na hasiče, záchranku nebo policii podle toho, co potřebuješ.",
  },
  {
    question: "Cizí člověk tě na ulici prosí, abys s ním nasedl do auta. Co uděláš?",
    correctAnswer: "Odmítnu a rychle odejdu k jiným lidem nebo do obchodu",
    options: [
      "Odmítnu a rychle odejdu k jiným lidem nebo do obchodu",
      "Nastoupím, protože vypadá hodně",
      "Počkám, co chce říct",
      "Dám mu své telefonní číslo",
    ],
    hints: [
      "Do auta cizího člověka nikdy nenastupujeme.",
      "Bezpečí je důležitější než zdvořilost — smíš říct ne.",
    ],
    explanation: "Do auta cizího člověka nikdy nenastupuj, i kdyby byl velmi milý nebo sliboval odměnu. Bezpečný dospělý nepotřebuje pomoc od dítěte. Rychle odejdi tam, kde jsou další lidé.",
  },
  {
    question: "Cizí paní tě vyzve, ať s ní půjdeš na odlehlé hřiště ukázat cestu. Co uděláš?",
    correctAnswer: "Odmítnu — s neznámou osobou na odlehlé místo nechodím",
    options: [
      "Odmítnu — s neznámou osobou na odlehlé místo nechodím",
      "Půjdu, protože to potřebuje",
      "Půjdu, ale budu se jí bát",
      "Zavolám kamaráda, ať jde taky",
    ],
    hints: [
      "Odlehlé místo = místo, kde nejsou další lidé.",
      "Dospělí si cestu mohou zjistit sami, nepotřebují doprovod od dítěte.",
    ],
    explanation: "S neznámou osobou na odlehlé nebo opuštěné místo nikdy nechoď. Dospělý, který potřebuje opravdovou pomoc, se zeptá jiného dospělého, ne dítěte. Toto je jeden ze způsobů, jak může dojít k nebezpečí.",
  },
  {
    question: "Ztratil ses v nákupním centru. Koho požádáš o pomoc?",
    correctAnswer: "Prodavače nebo ochranku v obchodě",
    options: [
      "Prodavače nebo ochranku v obchodě",
      "Prvního cizího muže na ulici",
      "Nikoho — počkám sám",
      "Náhodné dítě stejného věku",
    ],
    hints: [
      "V obchodě jsou dospělí, kteří tam pracují — znají prostředí a mohou zavolat rodiče.",
      "Zaměstnanci v uniformě jsou bezpečnější volba než náhodný cizinec.",
    ],
    explanation: "Prodavač nebo bezpečnostní pracovník (ochranka) jsou důvěryhodní dospělí — pracují na veřejném místě a mohou pomoci zavolat rodiče nebo ohlásit ztrátu dítěte přes rozhlas.",
  },
  {
    question: "Ztratil ses ve městě. Koho dalšího, kromě prodavačů, smíš požádat o pomoc?",
    correctAnswer: "Policistu nebo strážníka v uniformě",
    options: [
      "Policistu nebo strážníka v uniformě",
      "Kohokoliv, kdo vypadá hodně",
      "Jen mládež na skateboardu",
      "Nikoho cizího",
    ],
    hints: [
      "Uniforma označuje osobu, která má povinnost pomáhat.",
      "Policista má služební číslo a musí se prokázat.",
    ],
    explanation: "Policistu nebo strážníka v uniformě poznáš snadno a jsou povinni ti pomoci. Mohou kontaktovat tvoje rodiče nebo tě bezpečně dopravit na místo. Náhodní cizinci bez uniformy jsou méně bezpeční.",
  },
  {
    question: "Co NESMÍŠ sdílet s cizími lidmi na internetu?",
    correctAnswer: "Svou adresu a telefonní číslo",
    options: [
      "Svou adresu a telefonní číslo",
      "Oblíbenou barvu",
      "Název svého oblíbeného seriálu",
      "Obrázek krajiny",
    ],
    hints: [
      "Adresa a telefon jsou osobní údaje — s jejich pomocí tě cizí člověk může najít.",
      "Jméno, adresa, škola, telefon = nikdy cizím na internetu.",
    ],
    explanation: "Adresa a telefonní číslo jsou osobní údaje, díky nimž tě cizí člověk může fyzicky najít. Na internetu mohou být lidé, kteří nejsou takoví, jak se tváří — proto tyto údaje nikomu neříkáme.",
  },
  {
    question: "Cizí člověk na internetu tě žádá, abys mu poslal svou fotku. Co uděláš?",
    correctAnswer: "Neposílám — řeknu to rodiči nebo učiteli",
    options: [
      "Neposílám — řeknu to rodiči nebo učiteli",
      "Pošlu, když vypadá přátelsky",
      "Pošlu anonymní fotku",
      "Pošlu fotku kamaráda místo sebe",
    ],
    hints: [
      "Fotky jsou osobní — cizí člověk by je mohl zneužít.",
      "Pokud tě někdo na internetu žádá o fotky, vždy to řekni dospělému.",
    ],
    explanation: "Fotky nikomu cizímu na internetu neposílej. Cizí člověk může být ve skutečnosti úplně jiný, než tvrdí. Pokud tě o to někdo požádá, ihned to řekni rodiči, učiteli nebo jinému důvěryhodnému dospělému.",
  },
  {
    question: "Spolužák tě každý den strká a posmívá se ti před ostatními. Jak se jmenuje toto chování?",
    correctAnswer: "Šikana",
    options: ["Šikana", "Žert", "Přátelské škádlení", "Hra"],
    hints: [
      "Klíčové slovo: opakuje se to každý den.",
      "Šikana = úmyslné a opakované ubližování.",
    ],
    explanation: "Šikana je úmyslné a opakované ubližování — fyzické (bití, strkání) nebo psychické (posměch, vyloučení ze skupiny). Jednorázový žert nebo škádlení šikana není, ale opakování a záměr ublížit ji definují.",
  },
  {
    question: "Co je NEJDŮLEŽITĚJŠÍ udělat, když tě někdo šikanuje?",
    correctAnswer: "Říct to důvěryhodnému dospělému — rodiči nebo učiteli",
    options: [
      "Říct to důvěryhodnému dospělému — rodiči nebo učiteli",
      "Vrátit to šikanistovi",
      "Nic nedělat a doufat, že přestane",
      "Říct to jen kamarádovi",
    ],
    hints: [
      "Sám šikanu zastavit je velmi těžké — potřebuješ pomoc dospělého.",
      "Říct o šikaně není donášení — je to ochrana sebe i ostatních.",
    ],
    explanation: "Říct o šikaně dospělému je nejdůležitější krok. Není to donášení — je to ochrana. Dospělý má prostředky a pravomoci situaci řešit. Čím dříve to řekneš, tím dříve šikana skončí.",
  },
  {
    question: "Kdo je důvěryhodný dospělý pro dítě?",
    correctAnswer: "Rodič, učitel nebo jiný blízký dospělý, kterého dítě zná",
    options: [
      "Rodič, učitel nebo jiný blízký dospělý, kterého dítě zná",
      "Kdokoliv starší 18 let",
      "Jen rodič, nikdo jiný",
      "Cizí člověk s hodnou tváří",
    ],
    hints: [
      "Důvěryhodný = takový, komu věříme a koho dobře známe.",
      "Může to být rodič, prarodič, učitel, trenér — někdo z blízkého okolí.",
    ],
    explanation: "Důvěryhodný dospělý je člověk, kterého dobře znáš a kterému věříš — rodič, prarodič, učitel, trenér nebo soused. Nemusí to být jen rodič. Důležité je, že ho znáš a cítíš se u něj bezpečně.",
  },
  {
    question: "Proč je dobré znát tísňová čísla 150, 155, 158 a 112?",
    correctAnswer: "Abych mohl rychle zavolat pomoc v nebezpečné situaci",
    options: [
      "Abych mohl rychle zavolat pomoc v nebezpečné situaci",
      "Jen pro případ školního testu",
      "Abych mohl volat zdarma",
      "Jsou povinná pro všechny od 6 let",
    ],
    hints: [
      "Tísňová čísla fungují i bez kreditu na mobilu.",
      "V nebezpečí je každá sekunda důležitá.",
    ],
    explanation: "Znát tísňová čísla může jednoho dne zachránit život — tvůj nebo někoho blízkého. Volání na 150, 155, 158 nebo 112 je zdarma a funguje i bez kreditu nebo SIM karty.",
  },
  {
    question: "Kamarád ti pošle na internetu odkaz na neznámou stránku a říká, že tam jsou super hry. Co uděláš?",
    correctAnswer: "Nejdřív se zeptám rodiče nebo dospělého, zda je stránka bezpečná",
    options: [
      "Nejdřív se zeptám rodiče nebo dospělého, zda je stránka bezpečná",
      "Kliknu hned — kamarád to posílá",
      "Pošlu odkaz všem spolužákům",
      "Kliknu, ale nezadám žádné údaje",
    ],
    hints: [
      "I kamarád může nevědomky poslat nebezpečný odkaz.",
      "Rodič nebo dospělý může snadno ověřit, zda je stránka bezpečná.",
    ],
    explanation: "I kamarád může poslat odkaz, který sám dostal od cizího člověka a neví, že je nebezpečný. Nebezpečné stránky mohou ukrást hesla nebo nainstalovat škodlivý program. Vždy se nejdřív zeptej dospělého.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
}

export const KOMUNIKACEBEZPECNOST: TopicMetadata[] = [
  {
    id: "g3-prvouka-lide-kolem-nas-souziti-a-komunikace-komunikace-jednani-s-neznamymi-lidmi-bezpecnost",
    rvpNodeId: "g3-prvouka-lide-kolem-nas-souziti-a-komunikace-komunikace-jednani-s-neznamymi-lidmi-bezpecnost",
    title: "Komunikace a bezpečnost",
    studentTitle: "Bezpečně mezi lidmi",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití a komunikace",
    briefDescription: "Víš, jak se chovat s neznámými lidmi a jak zůstat v bezpečí.",
    keywords: [
      "bezpečnost",
      "neznámý člověk",
      "tísňová čísla",
      "hasiči",
      "záchranná služba",
      "policie",
      "šikana",
      "internet",
      "osobní údaje",
      "důvěryhodný dospělý",
    ],
    goals: [
      "Znát tísňová čísla 150, 155, 158 a 112.",
      "Vědět, co nedělat s neznámým člověkem.",
      "Vědět, na koho se obrátit, když se ztratím.",
      "Chránit své osobní údaje na internetu.",
      "Rozumět pojmu šikana a vědět, jak ji řešit.",
    ],
    boundaries: [
      "Bez podrobností o kriminalitě nebo děsivých scénářů.",
      "Základní pravidla bezpečnosti přiměřená věku 8–9 let.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 8,
    generator: gen,
    helpTemplate: {
      hint: "150 = hasiči, 155 = záchranná služba, 158 = policie, 112 = tísňová linka. S cizím člověkem nenastupuj do auta a nechodím na odlehlá místa.",
      steps: [
        "Zapamatuj si čísla: 150 hasiči, 155 záchranka, 158 policie, 112 vše.",
        "S cizím člověkem: nenastupuj do auta, nechoď na odlehlé místo.",
        "Ztratíš-li se: jdi k prodavači nebo policistovi v uniformě.",
        "Na internetu: nesdílej adresu, telefon ani fotky.",
        "Šikana: řekni to dospělému — rodiči nebo učiteli.",
      ],
      commonMistake: "Zaměňování čísel 150 a 155 — 150 jsou hasiči (oheň), 155 je záchranná služba (zdraví).",
      example: "Hoří sousedovo auto → voláš 150 (hasiči). Kamarád je zraněný → voláš 155 (záchranná služba).",
    },
  },
];
