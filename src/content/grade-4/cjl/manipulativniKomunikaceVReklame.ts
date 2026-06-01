import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface TFItem { q: string; a: "ano" | "ne"; hint: string }

// Level 1: zakladni tvrzeni o reklame
const POOL_L1: TFItem[] = [
  { q: "Reklama vždy říká pravdu.", a: "ne", hint: "Reklamy jsou navrženy, aby přesvědčily, ne aby informovaly objektivně." },
  { q: "Cílem reklamy je přesvědčit nás ke koupi produktu.", a: "ano", hint: "Přesvědčení ke koupi je hlavní účel reklamy." },
  { q: "Slavná osobnost v reklamě zaručuje kvalitu výrobku.", a: "ne", hint: "Celebrita je placená za doporučení — to nezaručuje kvalitu." },
  { q: "Slogan je krátká, zapamatovatelná reklamní věta.", a: "ano", hint: "Slogan je definován jako stručná fráze, která se snadno pamatuje." },
  { q: "Reklama na zmrzlinu ukazující šťastnou rodinu nám slibuje, že zmrzlina udělá naši rodinu šťastnou.", a: "ne", hint: "Je to emocionální apel — propojení produktu se štěstím, ne slib." },
  { q: "Výrazy jako 'Jen dnes!' nebo 'Poslední kusy!' vždy odrážejí skutečný nedostatek zboží.", a: "ne", hint: "Jde o falešnou naléhavost — tlak na rychlé rozhodnutí." },
  { q: "Reklamy opakují slogan, aby si ho zákazníci lépe zapamatovali.", a: "ano", hint: "Opakování je klasická technika zapamatování." },
  { q: "Tvrzení '20% lepší' je vždy dokazatelné a srovnatelné.", a: "ne", hint: "Lepší než co? Základ srovnání nebývá uveden." },
  { q: "Kritické myšlení nám pomáhá nepodléhat reklamní manipulaci.", a: "ano", hint: "Ptáme se: Je to pravda? Jaký je základ tvrzení?" },
  { q: "Bandwagon ('všichni to kupují') je spolehlivý důvod pro koupi.", a: "ne", hint: "Tlak skupiny není argument pro kvalitu produktu." },
  { q: "Manipulativní komunikace záměrně ovlivňuje bez logických argumentů.", a: "ano", hint: "Manipulace využívá emoce a triky místo faktů." },
  { q: "Reklamy jsou vždy povinny uvést všechny nevýhody produktu.", a: "ne", hint: "Reklamy záměrně vynechávají nevýhody — to je jejich povaha." },
  { q: "Emocionální apel propojuje produkt s pozitivními pocity (rodina, přátelství, štěstí).", a: "ano", hint: "Emocionální apel je jedna z nejčastějších reklamních technik." },
  { q: "Vědecký výzkum zmíněný v reklamě bez citace je vždy spolehlivý.", a: "ne", hint: "Jde o falešnou autoritu — základ tvrzení není ověřitelný." },
  { q: "Dětská cílová skupina je snáze ovlivnitelná reklamou než dospělí.", a: "ano", hint: "Proto existují přísná pravidla pro reklamu cílenou na děti." },
  { q: "Superlativy jako 'nejlepší na trhu' jsou vždy dokazatelné.", a: "ne", hint: "Superlativ bez srovnávací základny není dokazatelný." },
  { q: "Záměrné vynechání podmínek akce (hvězdičky) je poctivá komunikace.", a: "ne", hint: "Skryté podmínky jsou manipulativní technika." },
  { q: "Reklama nám může říkat, co si máme myslet, aniž to přímo tvrdí.", a: "ano", hint: "Emoce a obrazy ovlivňují naše postoje nepřímo." },
  { q: "Pokud reklamu sdílí slavný sportovec, produkt je vhodný pro každého sportovce.", a: "ne", hint: "Celebrita je zaplacena — nejde o odborné doporučení." },
  { q: "Reklamy na hračky jsou záměrně cíleny na děti, protože ty pak prosí rodiče.", a: "ano", hint: "Jde o záměrnou marketingovou strategii." },
];

// Level 2: slozitejsi tvrzeni o reklamních tricích
const POOL_L2: TFItem[] = [
  { q: "Tvrzení 'Doporučeno 9 z 10 dentistů' je vždy věrohodné bez dalšího kontextu.", a: "ne", hint: "Kolik dentistů bylo dotázáno? Kdo je vybral? To nevíme." },
  { q: "Reklama 'Zdarma* (*při nákupu nad 500 Kč)' záměrně skrývá podmínku.", a: "ano", hint: "Hvězdička s podmínkou je klasická technika skrytých podmínek." },
  { q: "Objektivní informace a reklamní komunikace jsou si rovny, protože obě sdělují fakta.", a: "ne", hint: "Reklama má zájem přesvědčit; objektivní informace je nestranná." },
  { q: "Silný slogan je krátký, rytmický a emocionálně působivý.", a: "ano", hint: "Tyto vlastnosti dělají slogan zapamatovatelným." },
  { q: "Reklama 'Naše auto spotřebuje méně!' poskytuje úplnou informaci.", a: "ne", hint: "Méně než co? Základ srovnání chybí." },
  { q: "Když reklama ukazuje šťastné lidi, produkt opravdu udělá kupující šťastnými.", a: "ne", hint: "Šťastné obrazy jsou emocionální apel, ne slib výsledku." },
  { q: "Záměrné vynechání informací je běžná reklamní technika.", a: "ano", hint: "Reklamy záměrně neuvádí nevýhody nebo skryté podmínky." },
  { q: "Čísla v reklamě (50% lepší, 3× výkonnější) jsou vždy podložena nezávislým výzkumem.", a: "ne", hint: "Čísla bez zdroje a základny nejsou ověřitelná." },
  { q: "Kritický přístup k reklamě znamená ptát se: Proč to říkají? Co z toho mají?", a: "ano", hint: "Kritické otázky pomáhají odhalit záměr a techniky reklamy." },
  { q: "Reklamy mají vždy povinnost uvést cenu produktu.", a: "ne", hint: "Reklamy mají zákonné povinnosti, ale ne vždy musí uvádět cenu." },
  { q: "Falešná naléhavost ('jen dnes!') nutí zákazníky rozhodovat se unáhleně.", a: "ano", hint: "Právě to je cíl falešné naléhavosti — nedát čas na přemyšlení." },
  { q: "Reklama zaměřená na emoce je méně manipulativní než reklama s čísly.", a: "ne", hint: "Emocionální manipulace je stejně silná, jen funguje jinak." },
  { q: "Bandwagon efekt ('všichni to mají') využívá sociálního tlaku skupiny.", a: "ano", hint: "Patřit ke skupině je silná lidská potřeba, reklamy toho využívají." },
  { q: "Pokud se slogan rýmuje, produkt je automaticky kvalitnější.", a: "ne", hint: "Rým usnadňuje zapamatování, ale neříká nic o kvalitě." },
  { q: "Je vhodné ověřit reklamní tvrzení z nezávislých zdrojů, než se rozhodneme ke koupi.", a: "ano", hint: "Srovnání a ověřování je součást kritického spotřebitelského chování." },
  { q: "Reklama může ovlivnit naše rozhodování, aniž si to uvědomujeme.", a: "ano", hint: "Emoce a opakování působí i nevědomě." },
  { q: "Slogan 'Rozdělíme se o radost' slibuje, že čokoláda opravdu přinese radost.", a: "ne", hint: "Je to emocionální apel — propojení produktu s pozitivním pocitem." },
  { q: "Cílová skupina reklamy jsou lidé, na které je reklama zaměřena.", a: "ano", hint: "Reklamy jsou vytvářeny pro konkrétní skupiny zákazníků." },
  { q: "Falešná autorita ('vědci dokázali') bez citace zdrojů je spolehlivý argument.", a: "ne", hint: "Bez ověřitelného zdroje jde o manipulaci, ne o fakta." },
  { q: "Reklama může propagovat produkt, aniž o něm přímo mluví (jen obrazy a hudba).", a: "ano", hint: "Emocionální asociace jsou silnou nepřímou technikou." },
  { q: "Přemýšlet o tom, komu reklama slouží, nám pomáhá lépe ji pochopit.", a: "ano", hint: "Reklama vždy slouží zájmům výrobce nebo prodejce." },
  { q: "Reklamy cílené na děti mají v ČR stejná pravidla jako reklamy pro dospělé.", a: "ne", hint: "Reklamy pro děti podléhají přísnějším pravidlům na ochranu dětí." },
  { q: "Pokud reklama mluví o 'přirozeném složení', produkt neobsahuje žádné přísady.", a: "ne", hint: "'Přirozené' je marketingový výraz, ne zákonná definice bez přísad." },
  { q: "Umět rozpoznat reklamní triky pomáhá lépe hospodařit s penězi.", a: "ano", hint: "Kdo odolá manipulaci, kupuje to, co skutečně potřebuje." },
  { q: "Reklama je vždy dobrá, protože informuje o dostupných produktech.", a: "ne", hint: "Reklama může informovat, ale také záměrně klamat nebo manipulovat." },
  { q: "Vizuální obraz (krásní lidé, příroda) v reklamě ovlivňuje naše pocity vůči produktu.", a: "ano", hint: "Vizuální asociace jsou klíčovou součástí emocionálního apelu." },
  { q: "Reklamní slogan může být lhaní, i když neříká žádnou nepravdivou větu.", a: "ano", hint: "Záměrné vynechání informací nebo zavádějící kontext je také manipulace." },
  { q: "Opakování reklamy na nás nemá žádný vliv, pokud ji nevnímáme vědomě.", a: "ne", hint: "Opakování funguje i nevědomě — to je efekt zapamatování." },
  { q: "Každý zákazník by měl mít právo znát skutečné vlastnosti produktu před koupí.", a: "ano", hint: "Spotřebitelská práva zahrnují právo na pravdivé informace." },
  { q: "Dobrý reklamní trik nám může prodat i produkt, který nepotřebujeme.", a: "ano", hint: "Manipulativní reklama přesvědčuje i bez skutečné potřeby." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  return shuffle(pool).slice(0, 30).map(({ q, a, hint }) => ({
    question: q,
    correctAnswer: a,
    options: ["Ano", "Ne"],
    hints: [
      hint,
      "Reklamní triky: emoce, slavná osobnost, opakování, falešná naléhavost, zdánlivá výhoda.",
      "Ptej se: Je to pravda? Co z toho má výrobce? Je základ tvrzení uveden?",
    ],
  }));
}

export const MANIPULATIVNIKOMUNIKACEVREKLAME: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-manipulativni-komunikace-v-reklame",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-manipulativni-komunikace-v-reklame",
    title: "Manipulativní komunikace v reklamě",
    studentTitle: "Triky v reklamě",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Poznáš, jak reklamy manipulují, a naučíš se jim nepodléhat.",
    keywords: ["reklama", "manipulace", "slogan", "emoce", "slavná osobnost", "falešná naléhavost", "kritické myšlení"],
    goals: [
      "Rozpoznat reklamní triky (emoce, celebrita, naléhavost, opakování)",
      "Kriticky hodnotit reklamní sdělení",
    ],
    boundaries: ["Bez analýzy politické propagandy", "Bez pokročilé semiotiky"],
    gradeRange: [4, 4],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Triky: emoce (rodina/štěstí), celebrita (slavný doporučuje), naléhavost (jen dnes!), opakování (slogan), zdánlivá výhoda (o 20% lepší — než co?)",
      steps: [
        "Přečti tvrzení pečlivě.",
        "Ptej se: Je to pravda? Co tím chtějí říct?",
        "Najdi techniku: emoce / slavná osoba / naléhavost / opakování.",
        "Zhodnoť, zda je tvrzení dokazatelné.",
      ],
      commonMistake: "Věřit číslům bez kontextu: '50% lepší' — lepší než co? Základna není uvedena.",
      example: "Reklama: 'Milujte svou rodinu → kupte nás!' = emocionální apel (propojení produktu se štěstím rodiny)",
    },
  },
];
