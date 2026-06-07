import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface TFItem { q: string; a: "ano" | "ne"; hint: string; e: string }

// Level 1: zakladni tvrzeni o reklame
const POOL_L1: TFItem[] = [
  { q: "Reklama vždy říká pravdu.", a: "ne", hint: "Reklamy jsou navrženy, aby přesvědčily, ne aby informovaly objektivně.", e: "Reklama chce hlavně prodat, a tak vyzdvihne jen to dobré a o nevýhodách mlčí. Proto nemůžeme spoléhat, že říká celou pravdu — některá tvrzení bývají přehnaná nebo zavádějící." },
  { q: "Cílem reklamy je přesvědčit nás ke koupi produktu.", a: "ano", hint: "Přesvědčení ke koupi je hlavní účel reklamy.", e: "Reklamu platí ten, kdo chce něco prodat, takže jejím hlavním úkolem je přimět nás k nákupu. I když nás při tom baví nebo informuje, vždy za tím stojí snaha, abychom si výrobek koupili." },
  { q: "Slavná osobnost v reklamě zaručuje kvalitu výrobku.", a: "ne", hint: "Celebrita je placená za doporučení — to nezaručuje kvalitu.", e: "Známá osobnost dostane za vystoupení v reklamě zaplaceno, takže výrobek chválí hlavně kvůli penězům, ne proto, že by ho sama odborně prověřila. Sláva herce nebo zpěváka tedy o kvalitě zboží nic neříká." },
  { q: "Slogan je krátká, zapamatovatelná reklamní věta.", a: "ano", hint: "Slogan je definován jako stručná fráze, která se snadno pamatuje.", e: "Slogan je úmyslně krátký a chytlavý, abychom si ho snadno zapamatovali a vybavili si ho, až budeme nakupovat. Právě tahle stručnost a zapamatovatelnost ho odlišuje od běžné věty." },
  { q: "Reklama na zmrzlinu ukazující šťastnou rodinu nám slibuje, že zmrzlina udělá naši rodinu šťastnou.", a: "ne", hint: "Je to emocionální apel — propojení produktu se štěstím, ne slib.", e: "Šťastná rodina v reklamě je emocionální apel — má v nás vyvolat hezký pocit a spojit ho s výrobkem. Není to skutečný slib, protože zmrzlina sama štěstí v rodině nezpůsobí." },
  { q: "Výrazy jako 'Jen dnes!' nebo 'Poslední kusy!' vždy odrážejí skutečný nedostatek zboží.", a: "ne", hint: "Jde o falešnou naléhavost — tlak na rychlé rozhodnutí.", e: "Tyhle výrazy mají hlavně vyvolat pocit, že musíme jednat hned, aby nám něco neuteklo. Často jde o falešnou naléhavost — zboží bývá k dostání i další dny, jen nás to tlačí k unáhlenému nákupu." },
  { q: "Reklamy opakují slogan, aby si ho zákazníci lépe zapamatovali.", a: "ano", hint: "Opakování je klasická technika zapamatování.", e: "Když něco slyšíme znovu a znovu, snáz si to zapamatujeme a vybaví se nám to v obchodě. Proto reklamy slogan tolikrát opakují — sázejí na to, že si na výrobek vzpomeneme." },
  { q: "Tvrzení '20% lepší' je vždy dokazatelné a srovnatelné.", a: "ne", hint: "Lepší než co? Základ srovnání nebývá uveden.", e: "U takového čísla chybí to nejdůležitější — lepší než co? Bez uvedeného srovnání nemůžeme tvrzení ověřit, takže '20% lepší' může znít přesvědčivě, aniž by něco skutečně dokazovalo." },
  { q: "Kritické myšlení nám pomáhá nepodléhat reklamní manipulaci.", a: "ano", hint: "Ptáme se: Je to pravda? Jaký je základ tvrzení?", e: "Kritické myšlení znamená, že si klademe otázky — je to pravda a na čem to stojí? Když takhle přemýšlíme, snáz odhalíme triky a nenecháme se reklamou zmanipulovat ke zbytečnému nákupu." },
  { q: "Bandwagon ('všichni to kupují') je spolehlivý důvod pro koupi.", a: "ne", hint: "Tlak skupiny není argument pro kvalitu produktu.", e: "To, že si něco kupuje hodně lidí, ještě neznamená, že je to kvalitní nebo že to potřebujeme právě my. Trik 'všichni to mají' využívá touhu nezůstat stranou, ale o vlastnostech výrobku neříká nic." },
  { q: "Manipulativní komunikace záměrně ovlivňuje bez logických argumentů.", a: "ano", hint: "Manipulace využívá emoce a triky místo faktů.", e: "Manipulace nás chce přesvědčit pomocí emocí a triků místo skutečných důvodů a faktů. Záměrně obchází rozumné uvažování, a proto je dobré ji umět rozpoznat." },
  { q: "Reklamy jsou vždy povinny uvést všechny nevýhody produktu.", a: "ne", hint: "Reklamy záměrně vynechávají nevýhody — to je jejich povaha.", e: "Reklama chce výrobek prodat, takže o nevýhodách raději mlčí a ukazuje jen to dobré. Nemá povinnost vyjmenovat všechny zápory, a proto musíme případné nevýhody hledat sami." },
  { q: "Emocionální apel propojuje produkt s pozitivními pocity (rodina, přátelství, štěstí).", a: "ano", hint: "Emocionální apel je jedna z nejčastějších reklamních technik.", e: "Emocionální apel spojuje výrobek s příjemnými pocity jako rodina nebo přátelství, abychom si ten hezký pocit přenesli i na produkt. Je to jedna z nejčastějších technik, protože emoce nás ovlivňují víc než suchá fakta." },
  { q: "Vědecký výzkum zmíněný v reklamě bez citace je vždy spolehlivý.", a: "ne", hint: "Jde o falešnou autoritu — základ tvrzení není ověřitelný.", e: "Když reklama mluví o výzkumu, ale neuvede, kdo a jak ho dělal, nemůžeme si to nijak ověřit. Jde o falešnou autoritu — slovo 'výzkum' má jen dodat důvěru, i když za ním nic průkazného být nemusí." },
  { q: "Dětská cílová skupina je snáze ovlivnitelná reklamou než dospělí.", a: "ano", hint: "Proto existují přísná pravidla pro reklamu cílenou na děti.", e: "Děti zatím nemají tolik zkušeností, aby triky v reklamě prohlédly, a proto je snáz ovlivní. Právě kvůli tomu platí pro reklamu cílenou na děti přísnější pravidla, která je mají chránit." },
  { q: "Superlativy jako 'nejlepší na trhu' jsou vždy dokazatelné.", a: "ne", hint: "Superlativ bez srovnávací základny není dokazatelný.", e: "Slovo 'nejlepší' zní silně, ale chybí u něj, podle čeho a s čím se výrobek srovnává. Bez takové srovnávací základny nejde tvrzení dokázat — je to spíš chvála než ověřitelný fakt." },
  { q: "Záměrné vynechání podmínek akce (hvězdičky) je poctivá komunikace.", a: "ne", hint: "Skryté podmínky jsou manipulativní technika.", e: "Když reklama ukáže lákavou nabídku, ale podmínky schová do drobné poznámky u hvězdičky, schválně nám zatajuje důležité informace. Takové skrývání je manipulace, ne poctivé jednání." },
  { q: "Reklama nám může říkat, co si máme myslet, aniž to přímo tvrdí.", a: "ano", hint: "Emoce a obrazy ovlivňují naše postoje nepřímo.", e: "Reklama nemusí nic přímo říct — stačí obrazy, hudba a pocity, které v nás vyvolá. Tím nepřímo ovlivní, co si o výrobku myslíme, aniž by to vyslovila slovy." },
  { q: "Pokud reklamu sdílí slavný sportovec, produkt je vhodný pro každého sportovce.", a: "ne", hint: "Celebrita je zaplacena — nejde o odborné doporučení.", e: "Slavný sportovec dostane za reklamu zaplaceno, takže výrobek chválí kvůli smlouvě, ne jako odborný posudek. To, že ho propaguje, ještě neznamená, že se hodí pro každého — každý má jiné potřeby." },
  { q: "Reklamy na hračky jsou záměrně cíleny na děti, protože ty pak prosí rodiče.", a: "ano", hint: "Jde o záměrnou marketingovou strategii.", e: "Tvůrci vědí, že děti hračku chtějí a budou o ni prosit rodiče, kteří ji nakonec koupí. Proto reklamy na hračky úmyslně cílí na děti — je to promyšlená prodejní strategie." },
];

// Level 2: slozitejsi tvrzeni o reklamních tricích
const POOL_L2: TFItem[] = [
  { q: "Tvrzení 'Doporučeno 9 z 10 dentistů' je vždy věrohodné bez dalšího kontextu.", a: "ne", hint: "Kolik dentistů bylo dotázáno? Kdo je vybral? To nevíme.", e: "U takového čísla nevíme, kolik zubařů se vlastně ptali ani kdo je vybral — třeba jich bylo jen deset. Bez tohoto kontextu zní tvrzení důvěryhodně, ale ověřit ho nemůžeme, takže věrohodné samo o sobě není." },
  { q: "Reklama 'Zdarma* (*při nákupu nad 500 Kč)' záměrně skrývá podmínku.", a: "ano", hint: "Hvězdička s podmínkou je klasická technika skrytých podmínek.", e: "Velké slovo 'zdarma' nás má nalákat, zatímco důležitá podmínka u hvězdičky je schválně napsaná drobně. Tím reklama skrývá, že nic není doopravdy zadarmo — je to klasický trik se skrytými podmínkami." },
  { q: "Objektivní informace a reklamní komunikace jsou si rovny, protože obě sdělují fakta.", a: "ne", hint: "Reklama má zájem přesvědčit; objektivní informace je nestranná.", e: "Objektivní informace je nestranná a snaží se říct pravdu, kdežto reklama chce hlavně přesvědčit a prodat. Proto se nedají postavit naroveň — reklama vybírá jen to, co se jí hodí." },
  { q: "Silný slogan je krátký, rytmický a emocionálně působivý.", a: "ano", hint: "Tyto vlastnosti dělají slogan zapamatovatelným.", e: "Krátkost, rytmus a působení na city dělají slogan chytlavým a snadno zapamatovatelným. Právě díky těmto vlastnostem nám utkví v hlavě a vybaví se nám, až budeme nakupovat." },
  { q: "Reklama 'Naše auto spotřebuje méně!' poskytuje úplnou informaci.", a: "ne", hint: "Méně než co? Základ srovnání chybí.", e: "Ve sdělení chybí to hlavní — méně než co? Bez srovnání nevíme, s čím se spotřeba porovnává, takže informace není úplná a má jen vyznít dobře." },
  { q: "Když reklama ukazuje šťastné lidi, produkt opravdu udělá kupující šťastnými.", a: "ne", hint: "Šťastné obrazy jsou emocionální apel, ne slib výsledku.", e: "Šťastní lidé v reklamě mají v nás vyvolat hezký pocit a spojit ho s výrobkem. Je to emocionální apel, ne skutečný výsledek — samotný produkt štěstí nezaručí." },
  { q: "Záměrné vynechání informací je běžná reklamní technika.", a: "ano", hint: "Reklamy záměrně neuvádí nevýhody nebo skryté podmínky.", e: "Reklama nemusí lhát, stačí, když zamlčí nevýhody nebo skryté podmínky. Takové úmyslné vynechávání je běžný trik, jak vytvořit lepší dojem, než jaký výrobek doopravdy zaslouží." },
  { q: "Čísla v reklamě (50% lepší, 3× výkonnější) jsou vždy podložena nezávislým výzkumem.", a: "ne", hint: "Čísla bez zdroje a základny nejsou ověřitelná.", e: "Čísla působí přesvědčivě, ale často u nich chybí zdroj a srovnávací základna — lepší o 50 % než co? Bez uvedeného a nezávislého ověření jim nemůžeme bez výhrad věřit." },
  { q: "Kritický přístup k reklamě znamená ptát se: Proč to říkají? Co z toho mají?", a: "ano", hint: "Kritické otázky pomáhají odhalit záměr a techniky reklamy.", e: "Když se ptáme, proč nám to říkají a co z toho mají, odhalíme skutečný záměr reklamy. Právě tyhle otázky jsou jádrem kritického přístupu a pomáhají nás chránit před triky." },
  { q: "Reklamy mají vždy povinnost uvést cenu produktu.", a: "ne", hint: "Reklamy mají zákonné povinnosti, ale ne vždy musí uvádět cenu.", e: "Reklama musí dodržovat zákony, třeba nesmí klamat, ale uvést cenu jí povinnost vždycky neukládá. Proto se setkáme i s reklamou, kde se cena vůbec neobjeví." },
  { q: "Falešná naléhavost ('jen dnes!') nutí zákazníky rozhodovat se unáhleně.", a: "ano", hint: "Právě to je cíl falešné naléhavosti — nedát čas na přemyšlení.", e: "Slovem 'jen dnes' nás reklama tlačí, abychom se rozhodli hned a nestihli si nákup rozmyslet. Právě to je cíl falešné naléhavosti — pod tlakem snáz koupíme i to, co nepotřebujeme." },
  { q: "Reklama zaměřená na emoce je méně manipulativní než reklama s čísly.", a: "ne", hint: "Emocionální manipulace je stejně silná, jen funguje jinak.", e: "Emoce nás dokážou ovlivnit stejně silně jako čísla, jen působí jinou cestou — přes pocity místo přes rozum. Proto není emocionální reklama o nic méně manipulativní než ta s čísly." },
  { q: "Bandwagon efekt ('všichni to mají') využívá sociálního tlaku skupiny.", a: "ano", hint: "Patřit ke skupině je silná lidská potřeba, reklamy toho využívají.", e: "Lidé touží někam patřit a nezůstat stranou, a tohle reklama využívá tvrzením 'všichni to mají'. Tlak skupiny nás má přimět ke koupi, i když o kvalitě výrobku nic neříká." },
  { q: "Pokud se slogan rýmuje, produkt je automaticky kvalitnější.", a: "ne", hint: "Rým usnadňuje zapamatování, ale neříká nic o kvalitě.", e: "Rým slogan zpříjemní a pomůže nám si ho zapamatovat, ale o vlastnostech výrobku nevypovídá nic. Hezky znějící věta tedy z produktu kvalitnější zboží neudělá." },
  { q: "Je vhodné ověřit reklamní tvrzení z nezávislých zdrojů, než se rozhodneme ke koupi.", a: "ano", hint: "Srovnání a ověřování je součást kritického spotřebitelského chování.", e: "Nezávislý zdroj nemá zájem nám něco prodat, takže nám řekne pravdivější informace než reklama. Ověřovat si tvrzení před nákupem proto patří k rozumnému a kritickému chování zákazníka." },
  { q: "Reklama může ovlivnit naše rozhodování, aniž si to uvědomujeme.", a: "ano", hint: "Emoce a opakování působí i nevědomě.", e: "Emoce a často opakované slogany na nás působí, i když si toho vůbec nevšimneme. Proto nás reklama dokáže nasměrovat ke koupi, aniž bychom si uvědomili, že nás vlastně ovlivnila." },
  { q: "Slogan 'Rozdělíme se o radost' slibuje, že čokoláda opravdu přinese radost.", a: "ne", hint: "Je to emocionální apel — propojení produktu s pozitivním pocitem.", e: "Slogan spojuje čokoládu s příjemným pocitem radosti, aby se nám výrobek líbil. Není to skutečný slib — radost nezpůsobí čokoláda sama, jde jen o emocionální apel." },
  { q: "Cílová skupina reklamy jsou lidé, na které je reklama zaměřena.", a: "ano", hint: "Reklamy jsou vytvářeny pro konkrétní skupiny zákazníků.", e: "Cílová skupina je přesně ta skupina lidí, pro kterou je reklama vytvořená — třeba děti nebo sportovci. Tvůrci ji nejdřív vyberou a pak reklamu přizpůsobí tak, aby právě na ně co nejlépe zapůsobila." },
  { q: "Falešná autorita ('vědci dokázali') bez citace zdrojů je spolehlivý argument.", a: "ne", hint: "Bez ověřitelného zdroje jde o manipulaci, ne o fakta.", e: "Slovo 'vědci' má dodat tvrzení vážnost, ale když chybí, kteří vědci a kde to dokázali, nedá se to ověřit. Taková falešná autorita působí důvěryhodně, přitom za ní žádný průkazný zdroj být nemusí." },
  { q: "Reklama může propagovat produkt, aniž o něm přímo mluví (jen obrazy a hudba).", a: "ano", hint: "Emocionální asociace jsou silnou nepřímou technikou.", e: "Samotné obrazy a hudba v nás vyvolají náladu, kterou si pak spojíme s výrobkem, i když o něm reklama nic neřekne. Tahle nepřímá technika působí přes pocity a bývá velmi silná." },
  { q: "Přemýšlet o tom, komu reklama slouží, nám pomáhá lépe ji pochopit.", a: "ano", hint: "Reklama vždy slouží zájmům výrobce nebo prodejce.", e: "Reklama vždy slouží tomu, kdo ji platí — výrobci nebo prodejci, který chce vydělat. Když si tohle uvědomíme, snáz pochopíme, proč nám něco říká, a nenecháme se tak snadno ovlivnit." },
  { q: "Reklamy cílené na děti mají v ČR stejná pravidla jako reklamy pro dospělé.", a: "ne", hint: "Reklamy pro děti podléhají přísnějším pravidlům na ochranu dětí.", e: "Děti se nechají ovlivnit snáz než dospělí, a proto pro reklamy cílené na ně platí přísnější pravidla. Nejsou tedy stejná jako u reklam pro dospělé — mají děti zvlášť chránit." },
  { q: "Pokud reklama mluví o 'přirozeném složení', produkt neobsahuje žádné přísady.", a: "ne", hint: "'Přirozené' je marketingový výraz, ne zákonná definice bez přísad.", e: "Slovo 'přirozené' zní zdravě, ale není to přesná zákonná definice — výrobek může klidně obsahovat různé přísady. Je to marketingový výraz, který má dobře vyznít, ne záruka, že tam nic přidaného není." },
  { q: "Umět rozpoznat reklamní triky pomáhá lépe hospodařit s penězi.", a: "ano", hint: "Kdo odolá manipulaci, kupuje to, co skutečně potřebuje.", e: "Kdo umí prohlédnout triky, nenechá se zlákat ke zbytečným nákupům a koupí jen to, co opravdu potřebuje. Díky tomu lépe zachází s penězi a zbytečně neutrácí." },
  { q: "Reklama je vždy dobrá, protože informuje o dostupných produktech.", a: "ne", hint: "Reklama může informovat, ale také záměrně klamat nebo manipulovat.", e: "Reklama nám sice může dát užitečnou informaci o tom, co je k dostání, ale zároveň dokáže záměrně klamat a manipulovat. Proto o ní nemůžeme říct, že je vždycky dobrá — záleží, jak se chová." },
  { q: "Vizuální obraz (krásní lidé, příroda) v reklamě ovlivňuje naše pocity vůči produktu.", a: "ano", hint: "Vizuální asociace jsou klíčovou součástí emocionálního apelu.", e: "Krásní lidé nebo příroda v reklamě v nás vyvolají příjemný pocit, který si přeneseme i na výrobek. Právě tyhle vizuální obrazy jsou důležitou součástí emocionálního apelu a ovlivňují, jak produkt vnímáme." },
  { q: "Reklamní slogan může být lhaní, i když neříká žádnou nepravdivou větu.", a: "ano", hint: "Záměrné vynechání informací nebo zavádějící kontext je také manipulace.", e: "Slogan může klamat, i když každé jeho slovo je formálně pravdivé — stačí zamlčet důležitou informaci nebo věc postavit zavádějícím způsobem. I takové matení je manipulace, i bez jediné nepravdivé věty." },
  { q: "Opakování reklamy na nás nemá žádný vliv, pokud ji nevnímáme vědomě.", a: "ne", hint: "Opakování funguje i nevědomě — to je efekt zapamatování.", e: "I když reklamě nevěnujeme pozornost, opakování ji nenápadně ukládá do paměti a později se nám vybaví. Působí tedy i nevědomě, takže tvrzení, že na nás nemá žádný vliv, neplatí." },
  { q: "Každý zákazník by měl mít právo znát skutečné vlastnosti produktu před koupí.", a: "ano", hint: "Spotřebitelská práva zahrnují právo na pravdivé informace.", e: "Abychom se mohli rozhodnout správně, potřebujeme znát pravdivé vlastnosti výrobku ještě před nákupem. Právo na takové informace patří mezi spotřebitelská práva a chrání nás před klamáním." },
  { q: "Dobrý reklamní trik nám může prodat i produkt, který nepotřebujeme.", a: "ano", hint: "Manipulativní reklama přesvědčuje i bez skutečné potřeby.", e: "Šikovná manipulace v nás vyvolá pocit, že výrobek chceme nebo musíme mít, i když ho doopravdy nepotřebujeme. Proto nás dobrý trik dokáže přimět ke koupi i bez skutečné potřeby — a právě proto je dobré ho umět odhalit." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  return shuffle(pool).slice(0, 30).map(({ q, a, hint, e }) => ({
    question: q,
    correctAnswer: a,
    options: ["Ano", "Ne"],
    hints: [
      hint,
      "Reklamní triky: emoce, slavná osobnost, opakování, falešná naléhavost, zdánlivá výhoda.",
      "Ptej se: Je to pravda? Co z toho má výrobce? Je základ tvrzení uveden?",
    ],
    explanation: e,
  }));
}

export const MANIPULATIVNIKOMUNIKACEVREKLAME: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-manipulativni-komunikace-v-reklame",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-manipulativni-komunikace-v-reklame",
    displayName: "Triky v reklamě",
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
    recommendedNext: ["g4-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-klicovych-slov-a-hlavni-myslenky"],
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
