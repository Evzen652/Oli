import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[] }

const POOL_L1: QA[] = [
  { q: "Jaké jsou části osnovy vypravování?", a: "úvod, zápletka, vyvrcholení, závěr", opts: ["úvod, zápletka, vyvrcholení, závěr", "začátek, konec", "úvod, závěr", "expozice, kolize, krize, peripetie, katastrofa"] },
  { q: "Co odpovídá úvod vypravování?", a: "kde, kdy, kdo (představení postav a místa)", opts: ["kde, kdy, kdo (představení postav a místa)", "co se stalo dramatického", "jak příběh skončil", "co chtěl autor říct"] },
  { q: "Jaký je příklad slova vyjadřujícího časovou posloupnost?", a: "nejprve, pak, potom, nakonec, mezitím", opts: ["nejprve, pak, potom, nakonec, mezitím", "tady, tam, vlevo, vpravo", "asi, možná, snad", "nebo, ale, protože, přestože"] },
  { q: "Jak se správně zapisuje přímá řeč?", a: "„Přijdu brzy," řekl Petr.", opts: ["„Přijdu brzy," řekl Petr.", "'Přijdu brzy' řekl Petr.", "Přijdu brzy - řekl Petr.", "Přijdu brzy. Řekl Petr."] },
  { q: "Co je zápletka ve vypravování?", a: "co se stalo — problém nebo překvapení", opts: ["co se stalo — problém nebo překvapení", "kde a kdy se děj odehrává", "jak příběh skončil", "kdo jsou hlavní postavy"] },
  { q: "Co popisuje závěr vypravování?", a: "rozuzlení — jak příběh dopadl", opts: ["rozuzlení — jak příběh dopadl", "začátek příběhu", "hlavní problém", "kde a kdy se děj odehrál"] },
  { q: "Vyvrcholení vypravování je:", a: "největší napětí příběhu — kulminace", opts: ["největší napětí příběhu — kulminace", "začátek příběhu", "závěr příběhu", "představení postav"] },
  { q: "V přímé řeči: 'Pojď se mnou!' Honza zavolal. — co je přímá řeč?", a: "'Pojď se mnou!'", opts: ["'Pojď se mnou!'", "Honza zavolal", "Pojď se mnou! Honza", "zavolal Honza"] },
  { q: "Časové slovo 'mezitím' vyjadřuje:", a: "děj probíhá současně s jiným dějem", opts: ["děj probíhá současně s jiným dějem", "děj byl ukončen", "děj je na začátku", "děj nebude pokračovat"] },
  { q: "Časové slovo 'nakonec' vyjadřuje:", a: "závěrečný děj v posloupnosti", opts: ["závěrečný děj v posloupnosti", "první děj v posloupnosti", "souběžný děj", "opakovaný děj"] },
  { q: "Proč je časová posloupnost ve vypravování důležitá?", a: "aby čtenář pochopil pořadí událostí", opts: ["aby čtenář pochopil pořadí událostí", "aby byl text kratší", "aby bylo více postav", "aby příběh byl smutný"] },
  { q: "Osnova slouží k:", a: "plánování struktury vypravování před psaním", opts: ["plánování struktury vypravování před psaním", "opravování chyb po psaní", "zkrácení textu", "vymýšlení postav"] },
  { q: "Co je přímá řeč?", a: "doslovná slova postavy, uzavřená do uvozovek", opts: ["doslovná slova postavy, uzavřená do uvozovek", "popis chování postavy", "myšlenky autora", "komentář vypravěče"] },
  { q: "Vzor zápisu uvozovací věty za přímou řečí:", a: "„Přijdu," řekl Honza.", opts: ["„Přijdu," řekl Honza.", "„Přijdu." Řekl Honza.", "„Přijdu" řekl Honza.", "Řekl Honza „Přijdu"."] },
  { q: "Časové slovo 'potom' řadí děj:", a: "jako další v pořadí po předchozím", opts: ["jako další v pořadí po předchozím", "jako souběžný děj", "jako závěrečný děj", "jako první děj"] },
  { q: "Co píšeme v úvodu vypravování?", a: "kde a kdy se příběh odehrává, kdo jsou postavy", opts: ["kde a kdy se příběh odehrává, kdo jsou postavy", "čím příběh vyvrcholí", "jak příběh skončí", "co autor chtěl říct"] },
];

const POOL_L2: QA[] = [
  { q: "Seřaď části osnovy správně: závěr, úvod, vyvrcholení, zápletka", a: "úvod → zápletka → vyvrcholení → závěr", opts: ["úvod → zápletka → vyvrcholení → závěr", "zápletka → úvod → závěr → vyvrcholení", "závěr → úvod → zápletka → vyvrcholení", "vyvrcholení → zápletka → úvod → závěr"] },
  { q: "Přímá řeč uprostřed věty: Petr řekl: „Pojď," a odešel. — je správně?", a: "Ano — uvozovací věta, dvojtečka, přímá řeč s čárkou", opts: ["Ano — uvozovací věta, dvojtečka, přímá řeč s čárkou", "Ne — chybí vykřičník", "Ne — chybí druhé záhlaví", "Ne — přímá řeč se nepíše s čárkou"] },
  { q: "Příklad zápletky ve vypravování o výletě:", a: "Náhle se ztratil batoh s jídlem a deštěm přicházela bouře.", opts: ["Náhle se ztratil batoh s jídlem a deštěm přicházela bouře.", "Vydali jsme se na výlet v sobotu ráno.", "Celé to dobře dopadlo.", "Byl jednou jeden výlet."] },
  { q: "Příklad vyvrcholení ve vypravování o výletě:", a: "Stáli jsme promočení na vrcholu a nevěděli kudy dál.", opts: ["Stáli jsme promočení na vrcholu a nevěděli kudy dál.", "Vydali jsme se na výlet.", "Nakonec jsme šťastně dorazili domů.", "Výlet byl plánován na sobotu."] },
  { q: "Příklad závěru vypravování o výletě:", a: "Unavení, ale šťastní jsme se večer vrátili domů.", opts: ["Unavení, ale šťastní jsme se večer vrátili domů.", "Vydali jsme se na výlet.", "Náhle se ztratil batoh.", "Stáli jsme na vrcholu."] },
  { q: "Jak zvýraznit přímou řeč v textu?", a: "uvozovky „ " a uvozovací věta (řekl, zavolal, odpověděl)", opts: ["uvozovky „ " a uvozovací věta (řekl, zavolal, odpověděl)", "jen uvozovky bez uvozovací věty", "jen tučné písmo", "kurzívou a podtržením"] },
  { q: "Co dělá vypravování zajímavějším?", a: "přídavná jména, přímá řeč, napětí, živé popis", opts: ["přídavná jména, přímá řeč, napětí, živé popis", "co nejvíce postav", "jen krátké věty", "jen fakta bez děje"] },
  { q: "Příklad časové posloupnosti: 'Vstal, ... snídani, ... do školy.'", a: "Vstal, nasnídal se, šel do školy.", opts: ["Vstal, nasnídal se, šel do školy.", "Vstal, pak šel do školy, pak nasnídal se.", "Nejprve šel do školy, pak vstal.", "Nakonec vstal a pak se nasnídal."] },
  { q: "Přímá řeč tázací: 'Kam jdeš?' zeptala se Marta. — Je správně?", a: "Ano — otazník uvnitř uvozovek, malé z za uvozovkami", opts: ["Ano — otazník uvnitř uvozovek, malé z za uvozovkami", "Ne — otazník patří za uvozovky", "Ne — zeptala se se píše s velkým Z", "Ne — přímá řeč musí být oznamovací"] },
  { q: "Jaký typ věty používáme v úvodu vypravování?", a: "oznamovací, představující místo, čas, postavy", opts: ["oznamovací, představující místo, čas, postavy", "rozkazovací", "tázací", "zvolací"] },
  { q: "Co se stane, když vypravování nemá osnovu?", a: "může být chaotické, bez logické stavby", opts: ["může být chaotické, bez logické stavby", "bude kratší a lepší", "bude mít více postav", "bude čtenářsky zajímavější"] },
  { q: "Příklad správné přímé řeči s uvozovací větou na začátku:", a: "Maminka zavolala: „Pojď na večeři!"", opts: ["Maminka zavolala: „Pojď na večeři!"", "Maminka zavolala „Pojď na večeři".", "„Pojď na večeři" zavolala maminka", "Maminka: pojď na večeři."] },
  { q: "Jaká slova vyjadřují časovou posloupnost?", a: "nejprve, pak, potom, nakonec, mezitím, zatímco, dříve", opts: ["nejprve, pak, potom, nakonec, mezitím, zatímco, dříve", "napravo, nalevo, nahoře, dole", "hodný, zlý, veselý, smutný", "protože, přestože, ačkoliv, aby"] },
  { q: "V osnově vypravování je jako druhý bod:", a: "zápletka (jádro příběhu — problém)", opts: ["zápletka (jádro příběhu — problém)", "úvod", "vyvrcholení", "závěr"] },
  { q: "Kdo je vypravěč?", a: "ten, kdo vypráví příběh (může být v příběhu nebo mimo něj)", opts: ["ten, kdo vypráví příběh (může být v příběhu nebo mimo něj)", "hlavní postava", "autor knihy", "čtenář"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Osnova: úvod (kde/kdy/kdo) → zápletka (problém) → vyvrcholení (napětí) → závěr (rozuzlení)",
      "Přímá řeč: „Slova postavy," řekl X.",
      "Časová slova: nejprve, pak, potom, nakonec, mezitím",
    ],
    solutionSteps: [
      "Urči část osnovy: začátek? problém? vrchol napětí? konec?",
      "Přímá řeč: uvozovky + uvozovací věta + správná interpunkce.",
      "Časová posloupnost: uspořádej děje od prvního k poslednímu.",
    ],
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
