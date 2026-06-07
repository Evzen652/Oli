import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string }

const POOL_L1: QA[] = [
  { q: "Jaké jsou části osnovy vypravování?", a: "úvod, zápletka, vyvrcholení, závěr", opts: ["úvod, zápletka, vyvrcholení, závěr", "začátek, konec", "úvod, závěr", "expozice, kolize, krize, peripetie, katastrofa"], e: "Osnova vypravování má čtyři části, které jdou za sebou: úvod, zápletka, vyvrcholení a závěr. Jen 'začátek a konec' nebo 'úvod a závěr' by neměly střed příběhu, a odborné názvy jako expozice nebo katastrofa se učí až na vyšších stupních." },
  { q: "Co odpovídá úvod vypravování?", a: "kde, kdy, kdo (představení postav a místa)", opts: ["kde, kdy, kdo (představení postav a místa)", "co se stalo dramatického", "jak příběh skončil", "co chtěl autor říct"], e: "Úvod nás na začátku seznámí s tím, kde a kdy se příběh děje a kdo v něm vystupuje. To dramatické (co se stalo) přijde až v zápletce a jak příběh skončil patří do závěru." },
  { q: "Jaký je příklad slova vyjadřujícího časovou posloupnost?", a: "nejprve, pak, potom, nakonec, mezitím", opts: ["nejprve, pak, potom, nakonec, mezitím", "tady, tam, vlevo, vpravo", "asi, možná, snad", "nebo, ale, protože, přestože"], e: "Časovou posloupnost vyjadřují slova, která říkají, co bylo dřív a co potom: nejprve, pak, potom, nakonec. Slova tady a vlevo označují místo, asi a snad nejistotu a nebo, ale spojují věty." },
  { q: "Jak se správně zapisuje přímá řeč? (Petr říká: Přijdu brzy.)", a: "dolní+horní uvozovky: Přijdu brzy, řekl Petr.", opts: ["dolní+horní uvozovky: Přijdu brzy, řekl Petr.", "jednoduché apostrofy bez uvozovací věty", "pomlčka bez uvozovek", "tečka + velké písmeno uvozovací věty"], e: "Přímou řeč píšeme do uvozovek (dole a nahoře) a oddělíme ji od uvozovací věty čárkou. Apostrofy ani holá pomlčka pro přímou řeč v češtině nestačí." },
  { q: "Co je zápletka ve vypravování?", a: "co se stalo — problém nebo překvapení", opts: ["co se stalo — problém nebo překvapení", "kde a kdy se děj odehrává", "jak příběh skončil", "kdo jsou hlavní postavy"], e: "Zápletka je okamžik, kdy se v příběhu objeví problém nebo překvapení a děj se rozjede. Kde a kdy se příběh odehrává a kdo v něm hraje patří do úvodu, a jak skončil do závěru." },
  { q: "Co popisuje závěr vypravování?", a: "rozuzlení — jak příběh dopadl", opts: ["rozuzlení — jak příběh dopadl", "začátek příběhu", "hlavní problém", "kde a kdy se děj odehrál"], e: "Závěr je rozuzlení — řekne nám, jak to celé dopadlo. Začátek a místo příběhu patří do úvodu a hlavní problém je zápletka, ne závěr." },
  { q: "Vyvrcholení vypravování je:", a: "největší napětí příběhu — kulminace", opts: ["největší napětí příběhu — kulminace", "začátek příběhu", "závěr příběhu", "představení postav"], e: "Vyvrcholení je vrchol příběhu, kde je napětí největší a čtenář napjatě čeká, jak to dopadne. Začátek a představení postav je úvod a uklidnění na konci je závěr." },
  { q: "V přímé řeči: 'Pojď se mnou!' Honza zavolal. — co je přímá řeč?", a: "'Pojď se mnou!'", opts: ["'Pojď se mnou!'", "Honza zavolal", "Pojď se mnou! Honza", "zavolal Honza"], e: "Přímá řeč jsou jen ta doslovná slova, která postava vyslovila — tedy 'Pojď se mnou!'. Část 'Honza zavolal' je uvozovací věta, která říká, kdo mluví, ale sama do přímé řeči nepatří." },
  { q: "Časové slovo 'mezitím' vyjadřuje:", a: "děj probíhá současně s jiným dějem", opts: ["děj probíhá současně s jiným dějem", "děj byl ukončen", "děj je na začátku", "děj nebude pokračovat"], e: "Slovo 'mezitím' znamená, že se dvě věci dějí ve stejnou chvíli — jedna probíhá, zatímco probíhá druhá. Nevyjadřuje tedy konec děje ani jeho začátek." },
  { q: "Časové slovo 'nakonec' vyjadřuje:", a: "závěrečný děj v posloupnosti", opts: ["závěrečný děj v posloupnosti", "první děj v posloupnosti", "souběžný děj", "opakovaný děj"], e: "Slovo 'nakonec' označuje to, co se stalo jako poslední, tedy závěr posloupnosti. První děj by uvedlo 'nejprve' a současný děj 'mezitím'." },
  { q: "Proč je časová posloupnost ve vypravování důležitá?", a: "aby čtenář pochopil pořadí událostí", opts: ["aby čtenář pochopil pořadí událostí", "aby byl text kratší", "aby bylo více postav", "aby příběh byl smutný"], e: "Když děje seřadíme od prvního k poslednímu, čtenář snadno pochopí, co se stalo dřív a co potom. S přeházeným pořadím by se v příběhu ztratil — s délkou textu ani počtem postav to nesouvisí." },
  { q: "Osnova slouží k:", a: "plánování struktury vypravování před psaním", opts: ["plánování struktury vypravování před psaním", "opravování chyb po psaní", "zkrácení textu", "vymýšlení postav"], e: "Osnovu si připravíme předem jako plán, abychom věděli, co napsat do úvodu, zápletky, vyvrcholení a závěru. Není to nástroj na opravu chyb ani na zkracování hotového textu." },
  { q: "Co je přímá řeč?", a: "doslovná slova postavy, uzavřená do uvozovek", opts: ["doslovná slova postavy, uzavřená do uvozovek", "popis chování postavy", "myšlenky autora", "komentář vypravěče"], e: "Přímá řeč je přesné znění toho, co postava řekla, a píše se do uvozovek. Popis chování ani komentář vypravěče nejsou doslovná slova postavy, proto se do uvozovek nedávají." },
  { q: "Vzor zápisu uvozovací věty za přímou řečí:", a: "dolní+horní uvozovky + čárka + uvozovací věta malým", opts: ["dolní+horní uvozovky + čárka + uvozovací věta malým", "uvozovky + tečka + uvozovací věta velkým", "uvozovky bez čárky + uvozovací věta malým", "uvozovací věta na začátku + uvozovky na konci"] , e: "Když uvozovací věta stojí za přímou řečí, oddělíme ji čárkou a začneme malým písmenem (např. 'Přijdu,' řekl). Tečka a velké písmeno by větu ukončily, a čárka se vynechat nesmí." },
  { q: "Časové slovo 'potom' řadí děj:", a: "jako další v pořadí po předchozím", opts: ["jako další v pořadí po předchozím", "jako souběžný děj", "jako závěrečný děj", "jako první děj"], e: "Slovo 'potom' říká, že tento děj následuje hned po tom předchozím. Souběžnost by vyjádřilo 'mezitím', úplný konec 'nakonec' a začátek 'nejprve'." },
  { q: "Co píšeme v úvodu vypravování?", a: "kde a kdy se příběh odehrává, kdo jsou postavy", opts: ["kde a kdy se příběh odehrává, kdo jsou postavy", "čím příběh vyvrcholí", "jak příběh skončí", "co autor chtěl říct"], e: "Úvod čtenáři představí místo, čas a postavy, aby věděl, kde a s kým se příběh děje. Vyvrcholení i konec by úvod prozradily moc brzy a do úvodu nepatří." },
];

const POOL_L2: QA[] = [
  { q: "Seřaď části osnovy správně: závěr, úvod, vyvrcholení, zápletka", a: "úvod → zápletka → vyvrcholení → závěr", opts: ["úvod → zápletka → vyvrcholení → závěr", "zápletka → úvod → závěr → vyvrcholení", "závěr → úvod → zápletka → vyvrcholení", "vyvrcholení → zápletka → úvod → závěr"], e: "Příběh vždy začíná úvodem (seznámení), pokračuje zápletkou (problém), graduje vyvrcholením (napětí) a končí závěrem (rozuzlení). Ostatní pořadí míchají konec před začátek, což nedává smysl." },
  { q: "Přímá řeč uprostřed věty (Petr řekl: Pojď, a odešel) — co je správně?", a: "Ano — uvozovací věta, dvojtečka, přímá řeč s čárkou", opts: ["Ano — uvozovací věta, dvojtečka, přímá řeč s čárkou", "Ne — chybí vykřičník", "Ne — chybí druhé záhlaví", "Ne — přímá řeč se nepíše s čárkou"] , e: "Když uvozovací věta stojí před přímou řečí, oddělíme ji dvojtečkou a přímou řeč dáme do uvozovek. Vykřičník není povinný a čárka se v přímé řeči klidně použít může." },
  { q: "Příklad zápletky ve vypravování o výletě:", a: "Náhle se ztratil batoh s jídlem a deštěm přicházela bouře.", opts: ["Náhle se ztratil batoh s jídlem a deštěm přicházela bouře.", "Vydali jsme se na výlet v sobotu ráno.", "Celé to dobře dopadlo.", "Byl jednou jeden výlet."], e: "Zápletka přináší problém, který rozjede děj — tady ztracený batoh a blížící se bouře. 'Vydali jsme se na výlet' je úvod a 'dobře to dopadlo' je závěr, žádný problém v sobě nemají." },
  { q: "Příklad vyvrcholení ve vypravování o výletě:", a: "Stáli jsme promočení na vrcholu a nevěděli kudy dál.", opts: ["Stáli jsme promočení na vrcholu a nevěděli kudy dál.", "Vydali jsme se na výlet.", "Nakonec jsme šťastně dorazili domů.", "Výlet byl plánován na sobotu."], e: "Vyvrcholení je chvíle největšího napětí — promočení a ztracení na vrcholu nevíme, jak dál. 'Dorazili jsme domů' je už uklidnění v závěru a 'vydali jsme se na výlet' je úvod." },
  { q: "Příklad závěru vypravování o výletě:", a: "Unavení, ale šťastní jsme se večer vrátili domů.", opts: ["Unavení, ale šťastní jsme se večer vrátili domů.", "Vydali jsme se na výlet.", "Náhle se ztratil batoh.", "Stáli jsme na vrcholu."], e: "Závěr říká, jak to dopadlo — návrat domů příběh uzavírá. Ztracený batoh je zápletka a stání na vrcholu vyvrcholení, ty napětí teprve stupňují, ne uklidňují." },
  { q: "Jak zvýraznit přímou řeč v textu?", a: "uvozovky a uvozovací věta (řekl, zavolal, odpověděl)", opts: ["uvozovky a uvozovací věta (řekl, zavolal, odpověděl)", "jen uvozovky bez uvozovací věty", "jen tučné písmo", "kurzívou a podtržením"], e: "Přímou řeč poznáme podle uvozovek a uvozovací věty, která říká, kdo a jak promluvil (řekl, zavolal). Tučné písmo ani podtržení se k označení přímé řeči nepoužívají." },
  { q: "Co dělá vypravování zajímavějším?", a: "přídavná jména, přímá řeč, napětí, živé popis", opts: ["přídavná jména, přímá řeč, napětí, živé popis", "co nejvíce postav", "jen krátké věty", "jen fakta bez děje"], e: "Příběh ožije, když použijeme barvitá přídavná jména, přímou řeč postav a vystavíme napětí. Hromada postav nebo jen suchá fakta bez děje čtenáře naopak nudí." },
  { q: "Příklad časové posloupnosti: 'Vstal, ... snídani, ... do školy.'", a: "Vstal, nasnídal se, šel do školy.", opts: ["Vstal, nasnídal se, šel do školy.", "Vstal, pak šel do školy, pak nasnídal se.", "Nejprve šel do školy, pak vstal.", "Nakonec vstal a pak se nasnídal."], e: "Děje musí jít v pořadí, jak se opravdu staly: nejdřív vstal, pak se nasnídal a teprve potom šel do školy. Ostatní možnosti mají kroky přeházené, takže neodpovídají skutečnému sledu." },
  { q: "Přímá řeč tázací: 'Kam jdeš?' zeptala se Marta. — Je správně?", a: "Ano — otazník uvnitř uvozovek, malé z za uvozovkami", opts: ["Ano — otazník uvnitř uvozovek, malé z za uvozovkami", "Ne — otazník patří za uvozovky", "Ne — zeptala se se píše s velkým Z", "Ne — přímá řeč musí být oznamovací"] , e: "Otazník patří k otázce, proto stojí uvnitř uvozovek, a uvozovací věta za ním pokračuje malým písmenem. Přímá řeč může být i otázka nebo zvolání, nejen oznámení." },
  { q: "Jaký typ věty používáme v úvodu vypravování?", a: "oznamovací, představující místo, čas, postavy", opts: ["oznamovací, představující místo, čas, postavy", "rozkazovací", "tázací", "zvolací"], e: "V úvodu klidně oznamujeme, kde, kdy a kdo — proto používáme věty oznamovací. Rozkazy, otázky nebo zvolání se hodí spíš dovnitř děje a do přímé řeči postav." },
  { q: "Co se stane, když vypravování nemá osnovu?", a: "může být chaotické, bez logické stavby", opts: ["může být chaotické, bez logické stavby", "bude kratší a lepší", "bude mít více postav", "bude čtenářsky zajímavější"], e: "Bez osnovy se v příběhu snadno ztratíme a děje se zamotají, protože chybí pevná stavba. Osnova text nezkracuje ani nepřidává postavy — drží ho pohromadě." },
  { q: "Příklad správné přímé řeči s uvozovací větou na začátku:", a: "uvozovací věta + dvojtečka + uvozovky + obsah", opts: ["uvozovací věta + dvojtečka + uvozovky + obsah", "uvozovky bez uvozovací věty", "uvozovací věta + obsah bez uvozovek", "obsah bez uvozovek i věty"], e: "Když začínáme uvozovací větou, dáme za ni dvojtečku a teprve potom přímou řeč do uvozovek (Marta řekla: 'Pojď'). Bez uvozovek nebo bez uvozovací věty by čtenář nepoznal, kdo a co přesně řekl." },
  { q: "Jaká slova vyjadřují časovou posloupnost?", a: "nejprve, pak, potom, nakonec, mezitím, zatímco, dříve", opts: ["nejprve, pak, potom, nakonec, mezitím, zatímco, dříve", "napravo, nalevo, nahoře, dole", "hodný, zlý, veselý, smutný", "protože, přestože, ačkoliv, aby"], e: "Časovou posloupnost vyjadřují slova o čase — nejprve, pak, nakonec, zatímco. Slova napravo a nahoře označují místo, hodný a zlý vlastnosti a protože, aby spojují věty podle příčiny či účelu." },
  { q: "V osnově vypravování je jako druhý bod:", a: "zápletka (jádro příběhu — problém)", opts: ["zápletka (jádro příběhu — problém)", "úvod", "vyvrcholení", "závěr"], e: "Hned po úvodu přichází jako druhý bod zápletka, ve které se objeví problém a rozjede se děj. Úvod je první, vyvrcholení třetí a závěr poslední." },
  { q: "Kdo je vypravěč?", a: "ten, kdo vypráví příběh (může být v příběhu nebo mimo něj)", opts: ["ten, kdo vypráví příběh (může být v příběhu nebo mimo něj)", "hlavní postava", "autor knihy", "čtenář"], e: "Vypravěč je hlas, který nám příběh vypráví — může být jednou z postav, nebo stát mimo děj. Není to totéž co skutečný autor knihy ani jako čtenář, který příběh čte." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Osnova: úvod (kde/kdy/kdo) → zápletka (problém) → vyvrcholení (napětí) → závěr (rozuzlení)",
      "Přímá řeč: dolní+horní uvozovky + obsah + čárka + uvozovací věta.",
      "Časová slova: nejprve, pak, potom, nakonec, mezitím",
    ],
    explanation: e,
  }));
}

export const VYPRAVOVANISCASOVOUPOSLOUPNOSTIOSNOVA: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-casovou-posloupnosti-osnova",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-casovou-posloupnosti-osnova",
    title: "Vypravování s časovou posloupností, osnova",
    studentTitle: "Vypravování a osnova",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se sestavit osnovu a napsat vypravování s časovou posloupností.",
    keywords: ["vypravování", "osnova", "úvod", "zápletka", "vyvrcholení", "závěr", "přímá řeč", "časová posloupnost"],
    goals: [
      "Sestavit osnovu vypravování",
      "Použít časová slova pro posloupnost událostí",
      "Správně zapsat přímou řeč",
    ],
    boundaries: ["Bez literární analýzy", "Bez složitých grafů vztahů postav"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Osnova: 1.úvod (kde/kdy/kdo), 2.zápletka (co se stalo), 3.vyvrcholení (napětí), 4.závěr (rozuzlení)",
      steps: [
        "Úvod: kde, kdy, kdo se příběh odehrává.",
        "Zápletka: co se stalo, jaký nastal problém.",
        "Vyvrcholení: největší napětí příběhu.",
        "Závěr: jak příběh dopadl.",
      ],
      commonMistake: "Záměna zápletky a vyvrcholení; přímá řeč bez uvozovek nebo bez uvozovací věty",
      example: "Zápletka: Ztratil se pejsek. Vyvrcholení: Hledali jsme celý den v dešti. Závěr: Našli jsme ho schoulený u sousedů.",
    },
  },
];
