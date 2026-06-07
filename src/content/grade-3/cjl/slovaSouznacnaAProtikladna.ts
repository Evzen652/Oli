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

const POOL: QA[] = [
  { q: "Které slovo má PODOBNÝ význam jako 'radost'?", a: "štěstí", opts: ["štěstí", "smutek", "strach", "únava"], e: "Radost a štěstí jsou synonyma — obě slova popisují příjemný pocit, kdy se nám něco líbí nebo nám jde dobře. Smutek a strach jsou naopak nepříjemné pocity, takže to jsou skoro antonyma." },
  { q: "Které slovo má OPAČNÝ význam jako 'velký'?", a: "malý", opts: ["malý", "obrovský", "veliký", "velký"], e: "Malý je přesný opak slova velký — antonymum. Obrovský a veliký znamenají skoro to samé jako velký, takže to jsou synonyma, ne antonyma." },
  { q: "Které slovo má PODOBNÝ význam jako 'hezký'?", a: "pěkný", opts: ["pěkný", "ošklivý", "škaredý", "strašný"], e: "Pěkný a hezký jsou synonyma — obě slova říkají, že se nám něco líbí. Ošklivý a škaredý jsou naopak, jsou to antonyma slova hezký." },
  { q: "Které slovo má OPAČNÝ význam jako 'rychlý'?", a: "pomalý", opts: ["pomalý", "rychlejší", "spěšný", "bleskový"], e: "Pomalý je antonymum slova rychlý — kdo je pomalý, potřebuje hodně času, kdo je rychlý, udělá věci brzy. Spěšný a bleskový jsou synonyma slova rychlý." },
  { q: "Které slovo má PODOBNÝ význam jako 'dům'?", a: "obydlí", opts: ["obydlí", "škola", "auto", "les"], e: "Obydlí je synonymum slova dům — obě slova označují místo, kde lidé bydlí. Škola, auto a les jsou úplně jiné věci." },
  { q: "Které slovo má OPAČNÝ význam jako 'horký'?", a: "studený", opts: ["studený", "teplý", "vlažný", "hřejivý"], e: "Studený je přesný opak horkého — horký čaj pálí, studený osvěží. Teplý a vlažný jsou mezi horkou a studenou teplotou, ale nejsou pravým opakem." },
  { q: "Které slovo má PODOBNÝ význam jako 'jíst'?", a: "pojídat", opts: ["pojídat", "spát", "běžet", "pít"], e: "Pojídat je synonymum slova jíst — obě slova znamenají, že dáváme jídlo do úst. Pít je podobná činnost, ale pijeme tekutiny, ne jídlo." },
  { q: "Které slovo má OPAČNÝ význam jako 'světlý'?", a: "tmavý", opts: ["tmavý", "jasný", "zářivý", "bílý"], e: "Tmavý je antonymum slova světlý — světlý pokoj má hodně světla, tmavý skoro žádné. Jasný a zářivý jsou synonyma slova světlý." },
  { q: "Které slovo má PODOBNÝ význam jako 'smutný'?", a: "nešťastný", opts: ["nešťastný", "veselý", "šťastný", "spokojený"], e: "Nešťastný je synonymum slova smutný — oba výrazy popisují, že se nám není dobře v duši. Veselý a šťastný jsou naopak antonyma." },
  { q: "Které slovo má OPAČNÝ význam jako 'nový'?", a: "starý", opts: ["starý", "moderní", "čerstvý", "nedávný"], e: "Starý je antonymum slova nový — nová věc je právě vyrobená, stará věc existuje dlouho. Moderní a čerstvý jsou spíše synonyma slova nový." },
  { q: "Které slovo má PODOBNÝ význam jako 'mluvit'?", a: "povídat", opts: ["povídat", "poslouchat", "číst", "psát"], e: "Povídat je synonymum slova mluvit — obě slova popisují, že sdělujeme myšlenky slovně. Poslouchat je pravý opak mluvení — jedno jde s druhým." },
  { q: "Které slovo má OPAČNÝ význam jako 'tvrdý'?", a: "měkký", opts: ["měkký", "pevný", "tuhý", "kamenný"], e: "Měkký je antonymum slova tvrdý — měkký polštář se mačká, tvrdý kámen ne. Pevný a tuhý jsou synonyma slova tvrdý." },
  { q: "Které slovo má PODOBNÝ význam jako 'les'?", a: "háj", opts: ["háj", "louka", "pole", "zahrada"], e: "Háj je synonymum slova les — oba výrazy označují místo, kde roste hodně stromů. Louka a pole jsou bez stromů, takže to jsou jiné věci." },
  { q: "Které slovo má OPAČNÝ význam jako 'začátek'?", a: "konec", opts: ["konec", "střed", "přestávka", "úvod"], e: "Konec je antonymum slova začátek — příběh začíná na začátku a skončí na konci. Úvod je synonymum začátku, střed je uprostřed." },
  { q: "Které slovo má PODOBNÝ význam jako 'přítel'?", a: "kamarád", opts: ["kamarád", "nepřítel", "soused", "žák"], e: "Kamarád je synonymum slova přítel — oba výrazy označují člověka, kterého máme rádi a bavíme se s ním. Nepřítel je pravý opak — antonymum." },
  { q: "Které slovo má OPAČNÝ význam jako 'otevřený'?", a: "zavřený", opts: ["zavřený", "pootevřený", "otevíravý", "rozevřený"], e: "Zavřený je antonymum slova otevřený — otevřené dveře lze projít, zavřené zastaví. Pootevřený a rozevřený jsou blízko slova otevřený." },
  { q: "Které slovo má PODOBNÝ význam jako 'cesta'?", a: "silnice", opts: ["silnice", "zahrada", "pole", "les"], e: "Silnice je synonymum slova cesta — obě slova označují místo, kudy se chodí nebo jezdí. Zahrada, pole a les jsou jiná místa, ne cesty." },
  { q: "Které slovo má OPAČNÝ význam jako 'nahoru'?", a: "dolů", opts: ["dolů", "doprava", "vlevo", "dopředu"], e: "Dolů je přesný opak slova nahoru — nahoru jdeme po schodech výš, dolů se vracíme níže. Doprava, vlevo a dopředu jsou jiné směry." },
  { q: "Jaké synonymum lze použít místo slova 'říci' ve větě 'Jan říci pravdu'?", a: "sdělit", opts: ["sdělit", "skrýt", "zapsat", "zamlčet"], e: "Sdělit je synonymum slova říci — obě slova znamenají, že někomu dáme vědět nějakou informaci. Skrýt a zamlčet jsou pravé opaky — to jsou antonyma." },
  { q: "Které slovo má OPAČNÝ význam jako 'silný'?", a: "slabý", opts: ["slabý", "mocný", "svalnatý", "výkonný"], e: "Slabý je antonymum slova silný — silný člověk udrží těžký batoh, slabý ne. Mocný a svalnatý jsou synonyma slova silný." },
  { q: "Které slovo má PODOBNÝ význam jako 'unavený'?", a: "vyčerpaný", opts: ["vyčerpaný", "odpočatý", "svěží", "čilý"], e: "Vyčerpaný je synonymum slova unavený — oba výrazy popisují, že nám chybí energie. Odpočatý a svěží jsou antonyma — to jsou slova s opačným významem." },
  { q: "Které slovo má OPAČNÝ význam jako 'plný'?", a: "prázdný", opts: ["prázdný", "přeplněný", "naplněný", "obsazený"], e: "Prázdný je antonymum slova plný — plný hrnek má tekutinu, prázdný nic. Přeplněný a naplněný jsou synonyma slova plný." },
  { q: "Které slovo má PODOBNÝ význam jako 'chytrý'?", a: "šikovný", opts: ["šikovný", "hloupý", "pomalý", "líný"], e: "Šikovný je synonymum slova chytrý — oba výrazy říkají, že někdo umí věci dobře vymyslet nebo udělat. Hloupý je antonymum — pravý opak." },
  { q: "Které slovo má OPAČNÝ význam jako 'ráno'?", a: "večer", opts: ["večer", "poledne", "odpoledne", "přestávka"], e: "Večer je antonymum slova ráno — ráno den začíná, večer končí. Poledne a odpoledne jsou mezičasy, ne pravé opaky." },
  { q: "Které slovo má PODOBNÝ význam jako 'peníze'?", a: "hotovost", opts: ["hotovost", "dluh", "cena", "zboží"], e: "Hotovost je synonymum slova peníze — obě slova označují mince a bankovky, které platíme. Dluh je jiná věc — to jsou peníze, které ještě musíme vrátit." },
  { q: "Které slovo má OPAČNÝ význam jako 'letět'?", a: "přistát", opts: ["přistát", "vzlétnout", "stoupat", "plachtit"], e: "Přistát je antonymum slova letět ve smyslu vzlétnout a stoupat — letadlo nejprve vzlétne a pak přistane. Vzlétnout a plachtit jsou synonyma slova letět." },
  { q: "Které slovo má PODOBNÝ význam jako 'modrý'?", a: "azurový", opts: ["azurový", "červený", "zelený", "žlutý"], e: "Azurový je synonymum slova modrý — azurová je světlá modrá barva, jako jasné nebe. Červená, zelená a žlutá jsou úplně jiné barvy." },
  { q: "Které slovo má OPAČNÝ význam jako 'přijít'?", a: "odejít", opts: ["odejít", "přijet", "dorazit", "přiběhnout"], e: "Odejít je antonymum slova přijít — přijdeme dovnitř a odejdeme ven nebo pryč. Přijet a dorazit jsou synonyma slova přijít." },
  { q: "Vyberte synonymum pro slovo 'dítě' ve větě 'Dítě si hraje na zahradě.'", a: "dítko", opts: ["dítko", "dospělý", "starec", "rodič"], e: "Dítko je synonymum slova dítě — obě slova označují malého člověka, který ještě nevyrostl. Dospělý je antonymum — to je člověk, který už vyrostl." },
  { q: "Které slovo má OPAČNÝ význam jako 'pravý'?", a: "levý", opts: ["levý", "přímý", "správný", "pravdivý"], e: "Levý je antonymum slova pravý ve smyslu strany — pravá ruka je naproti levé ruce. Správný a pravdivý mají jiný význam slova pravý." },
  { q: "Které slovo má PODOBNÝ význam jako 'auto'?", a: "vůz", opts: ["vůz", "vlak", "letadlo", "loď"], e: "Vůz je synonymum slova auto — obě slova označují dopravní prostředek na čtyřech kolech, který jezdí po silnici. Vlak, letadlo a loď jsou jiné dopravní prostředky." },
  { q: "Které slovo má OPAČNÝ význam jako 'čistý'?", a: "špinavý", opts: ["špinavý", "bílý", "umytý", "svěží"], e: "Špinavý je antonymum slova čistý — čisté triko je umyté bez skvrn, špinavé má skvrny nebo nečistoty. Umytý je synonymum slova čistý." },
  { q: "Která dvojice jsou synonyma (slova s podobným významem)?", a: "dům — obydlí", opts: ["dům — obydlí", "dům — les", "dům — auto", "dům — škola"], e: "Dům a obydlí jsou synonyma, protože obě slova označují místo, kde lidé bydlí. Les, auto a škola jsou úplně jiné věci, nemají nic společného s bydlením." },
  { q: "Která dvojice jsou antonyma (slova s opačným významem)?", a: "den — noc", opts:["den — noc", "den — ráno", "den — světlo", "den — čas"], e: "Den a noc jsou antonyma — přesné opaky. Přes den svítí slunce, v noci je tma. Ráno je část dne, takže to antonymum není." },
  { q: "Které synonymum se hodí ve větě: 'Byl to ___ výlet.' (místo slova pěkný)?", a: "krásný", opts: ["krásný", "ošklivý", "nudný", "špatný"], e: "Krásný je synonymum slova pěkný — oba výrazy říkají, že se nám výlet líbil. Ošklivý a nudný jsou antonyma — popisují, že výlet nebyl dobrý." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 15) : level === 2 ? POOL.slice(15, 30) : POOL;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Synonyma = slova s podobným významem (radost = štěstí).",
      "Antonyma = slova s opačným významem (velký × malý).",
    ],
    explanation: e,
  }));
}

export const SLOVASOUZNACNAPROTIKLADNA: TopicMetadata[] = [
  {
    id: "g3-cjl-jazykova-vychova-nauka-o-slove-slova-souznacna-synonyma-a-protikladna-antonyma",
    rvpNodeId: "g3-cjl-jazykova-vychova-nauka-o-slove-slova-souznacna-synonyma-a-protikladna-antonyma",
    title: "Slova souznačná (synonyma) a protikladná (antonyma)",
    studentTitle: "Podobná a opačná slova",
    illustrationDesc: "dvě skupiny balónků — jedna s nápisy radost a štěstí (synonyma), druhá velký a malý s šipkami mezi nimi (antonyma), kreslené postavičky s výrazy obličejů",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slově",
    briefDescription: "Poznáš slova s podobným i opačným významem a správně je použiješ.",
    keywords: ["synonyma", "antonyma", "souznačná slova", "protikladná slova", "význam slov"],
    goals: [
      "Rozpoznat synonyma (slova podobného významu).",
      "Rozpoznat antonyma (slova opačného významu).",
      "Vybrat vhodné synonymum ve větě.",
    ],
    boundaries: ["Základní slovní zásoba 3. ročníku", "Bez homonym a polysémie"],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Synonyma: radost = štěstí, hezký = pěkný. Antonyma: velký × malý, nový × starý.",
      steps: [
        "Přečti slovo a rozmysli, jaký má význam.",
        "Synonym: hledáš slovo, které říká totéž. Antonum: hledáš slovo s opačným významem.",
      ],
      commonMistake: "Záměna: hledat antonymum, ale vybrat synonymum (nebo naopak). Pozor na zadání — 'podobný' nebo 'opačný'?",
      example: "Synonymum k 'radost': štěstí, veselí, potěšení. Antonymum k 'radost': smutek, zármutek.",
    },
  },
];
