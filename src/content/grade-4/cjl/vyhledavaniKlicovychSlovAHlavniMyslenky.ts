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
  { q: "Co jsou klíčová slova?", a: "Nejdůležitější pojmy, které vystihují téma textu", opts: ["Nejdůležitější pojmy, které vystihují téma textu", "Všechna podstatná jména v textu", "Slova s diakritikou", "Nejdelší slova v textu"], e: "Klíčová slova jsou ta nejdůležitější slova, díky kterým poznáme, o čem text je. Není to každé podstatné jméno ani nejdelší slovo — záleží na tom, jak moc slovo vystihuje téma." },
  { q: "Proč klíčová slova bývají opakována v textu?", a: "Protože jsou pro téma nejdůležitější", opts: ["Protože jsou pro téma nejdůležitější", "Protože autor zapomněl napsat jiná slova", "Protože rýmují se", "Protože jsou nejkratší"], e: "Když je něco pro text důležité, autor se k tomu stále vrací, a proto se klíčové slovo opakuje. Opakování tedy není chyba ani náhoda, ale signál, že jde o hlavní pojem." },
  { q: "Jaká je technika rychlého hledání informací v textu?", a: "Přeletíme text očima a hledáme klíčová slova", opts: ["Přeletíme text očima a hledáme klíčová slova", "Čteme každé slovo od začátku", "Čteme jen poslední větu", "Přečteme text pozpátku"], e: "Při rychlém hledání nemusíme číst slovo po slově — jen přejedeme očima text a všímáme si klíčových slov. Číst vše od začátku by trvalo zbytečně dlouho." },
  { q: "Co nám pomáhá najít klíčové slovo?", a: "Opakování slova, tučné písmo, nadpis, první věta odstavce", opts: ["Opakování slova, tučné písmo, nadpis, první věta odstavce", "Nejkratší slova", "Slova v závorce", "Slova na konci vět"], e: "Klíčová slova autoři rádi zdůrazňují — opakují je, píší tučně nebo je dávají do nadpisu či na začátek odstavce. Délka slova ani jeho místo na konci věty o důležitosti nic neříká." },
  { q: "Jak najdeme hlavní myšlenku textu?", a: "Ptáme se: O čem celý text je? Co chce autor říct?", opts: ["Ptáme se: O čem celý text je? Co chce autor říct?", "Přečteme jen první větu", "Spočítáme odstavce", "Hledáme nejdelší větu"], e: "Hlavní myšlenku najdeme tak, že přemýšlíme o celém textu a ptáme se, co nám tím autor chce sdělit. První věta ani nejdelší věta hlavní myšlenku samy o sobě prozradit nemusí." },
  { q: "Co je téma textu?", a: "O čem text pojednává (slůvko nebo krátká fráze)", opts: ["O čem text pojednává (slůvko nebo krátká fráze)", "Co chce autor říct", "Pocit z textu", "Délka textu"], e: "Téma je krátké pojmenování toho, o čem text je — třeba 'sloni' nebo 'lesy'. Co o tom autor říká, to už je hlavní myšlenka, a ta je delší než jen téma." },
  { q: "Jaký je rozdíl mezi tématem a hlavní myšlenkou?", a: "Téma = o čem; hlavní myšlenka = co se o tom říká", opts: ["Téma = o čem; hlavní myšlenka = co se o tom říká", "Jsou to stejné věci", "Téma je delší než hlavní myšlenka", "Hlavní myšlenka je vždy v závorce"], e: "Téma odpovídá na otázku 'o čem' a bývá jen slovo nebo krátká fráze, kdežto hlavní myšlenka říká celou větou, co se o tom tématu tvrdí. Nejsou to tedy stejné věci a hlavní myšlenka je obvykle delší než téma." },
  { q: "V textu o deštném pralese: Jaká slova jsou klíčová?", a: "prales, tropický, biodiverzita, kácení, ohrožení", opts: ["prales, tropický, biodiverzita, kácení, ohrožení", "zelený, velký, krásný, hezký", "pondělí, středa, pátek", "stůl, okno, dveře, zdi"], e: "Klíčová slova musí vystihovat právě téma pralesa, proto sem patří prales, tropický, kácení nebo ohrožení. Obecná slova jako zelený nebo krásný a slova z úplně jiné oblasti (dny v týdnu, nábytek) téma nevystihují." },
  { q: "Při vyhledávání informací v textu nejprve:", a: "přelétneme text očima a hledáme klíčové slovo", opts: ["přelétneme text očima a hledáme klíčové slovo", "čteme vše od začátku do konce", "přečteme jen titulky", "hledáme závorky"], e: "Když hledáme konkrétní informaci, nejdřív rychle přejedeme text očima a hledáme klíčové slovo, které nás k ní dovede. Číst celý text od začátku by nás zdrželo." },
  { q: "Co je první věta odstavce?", a: "Témata věta (topic sentence) — říká, o čem odstavec je", opts: ["Témata věta (topic sentence) — říká, o čem odstavec je", "Nejkratší věta odstavce", "Závěrečná věta odstavce", "Vždy tázací věta"], e: "První věta odstavce často shrnuje, o čem celý odstavec bude, proto se jí říká témata (úvodní) věta. Není to nutně nejkratší ani tázací věta — důležitá je tím, co prozradí o obsahu." },
  { q: "Tučné písmo v textu signalizuje:", a: "Důležité klíčové pojmy", opts: ["Důležité klíčové pojmy", "Okrajové informace", "Záporné informace", "Autorovy komentáře"], e: "Tučným písmem autor zvýrazňuje to, co je důležité, abychom si toho hned všimli — bývají to právě klíčové pojmy. Okrajové nebo méně podstatné informace se tučně nepíší." },
  { q: "Co jsou podnadpisy v textu?", a: "Menší nadpisy, které označují jednotlivé části textu", opts: ["Menší nadpisy, které označují jednotlivé části textu", "Klíčová slova", "Závěry odstavců", "Citace z jiných textů"], e: "Podnadpisy jsou menší nadpisy, které text rozdělují na části a napoví nám, o čem každá část je. Nejsou to klíčová slova ani citace — slouží k orientaci v textu." },
  { q: "Jak použít nadpis pro nalezení hlavní myšlenky?", a: "Nadpis zpravidla naznačuje téma nebo hlavní myšlenku", opts: ["Nadpis zpravidla naznačuje téma nebo hlavní myšlenku", "Nadpis je vždy okrajová informace", "Nadpis neodpovídá obsahu", "Nadpis je jen dekorace"], e: "Nadpis autor vybírá tak, aby vystihl, o čem text je, proto nám často napoví téma i hlavní myšlenku. Není to tedy jen ozdoba ani okrajová informace." },
  { q: "Při rychlém prohlížení textu (scanning) hledáme:", a: "konkrétní slovo nebo informaci — ignorujeme zbytek", opts: ["konkrétní slovo nebo informaci — ignorujeme zbytek", "celkový dojem z textu", "chyby pravopisu", "délku vět"], e: "Scanning znamená cíleně hledat jednu konkrétní informaci, třeba určité číslo nebo jméno, a ostatního si nevšímáme. Celkový dojem z textu získáváme jinou technikou (skimming)." },
  { q: "Při letmém prohlížení textu (skimming) získáváme:", a: "celkový přehled o tématu a struktuře textu", opts: ["celkový přehled o tématu a struktuře textu", "každý detail textu", "přesný přepis textu", "pravopisné chyby"], e: "Skimming je letmé pročtení, při kterém zjistíme, o čem text zhruba je a jak je uspořádaný. Nejde o zapamatování každého detailu — na to bychom museli číst pomalu a důkladně." },
  { q: "Příklad klíčového slova v textu o klimatické změně:", a: "oteplování, emise, skleníkový efekt, sucho", opts: ["oteplování, emise, skleníkový efekt, sucho", "stůl, okno, zahrada, auto", "pondělí, ráno, večer, poledne", "červený, modrý, zelený, žlutý"], e: "Klíčová slova musí souviset s tématem klimatické změny, proto sem patří oteplování, emise nebo sucho. Slova jako stůl, barvy nebo části dne s klimatem nesouvisejí, a tak klíčová nejsou." },
];

const POOL_L2: QA[] = [
  { q: "Jak z textu vytáhneme hlavní myšlenku?", a: "Pátráme po nejdůležitějším sdělení celého textu jednou větou", opts: ["Pátráme po nejdůležitějším sdělení celého textu jednou větou", "Vybereme první větu každého odstavce", "Spojíme všechny klíčové slova", "Zkopírujeme závěrečnou větu"], e: "Hlavní myšlenka je to nejdůležitější, co platí pro celý text, a vyjádříme ji jednou vlastní větou. Pouhé spojení klíčových slov nebo opsání jedné věty z textu hlavní myšlenku celého textu nevystihne." },
  { q: "V textu: 'Ledovce tají. Hladina moří stoupá. Pobřežní města jsou ohrožena.' — jaká je hlavní myšlenka?", a: "Klimatická změna ohrožuje pobřežní oblasti.", opts: ["Klimatická změna ohrožuje pobřežní oblasti.", "Ledovce jsou krásné.", "Moře jsou velká.", "Města jsou na pobřeží."], e: "Hlavní myšlenka spojuje všechny tři věty do jednoho sdělení — oteplování vede k tání ledovců, stoupání moří a ohrožení měst. Ostatní možnosti popisují jen jednu drobnost a nevystihují, o co v textu jde." },
  { q: "Strategie vyhledávání informací: Jak najdeme v encyklopedii heslo 'sopka'?", a: "Jdeme na písmeno S a hledáme abecedně 'sopka'", opts: ["Jdeme na písmeno S a hledáme abecedně 'sopka'", "Čteme celou encyklopedii", "Hledáme na konci knihy", "Otevřeme náhodnou stránku"], e: "Encyklopedie řadí hesla podle abecedy, proto stačí najít písmeno S a v něm slovo sopka. Číst celou knihu nebo otevírat náhodné stránky by trvalo zbytečně dlouho." },
  { q: "Klíčová slova v textu bývají:", a: "opakována, zvýrazněna nebo v nadpisech", opts: ["opakována, zvýrazněna nebo v nadpisech", "v závorce nebo psána kurzívou", "vždy v první větě textu", "vždy nejkratší slova"], e: "Klíčová slova autor zdůrazňuje opakováním, tučným písmem nebo umístěním do nadpisu, aby na ně upozornil. Nemusí být v první větě ani být nejkratší — důležitý je jejich význam pro téma." },
  { q: "Jak vytvoříme myšlenkovou mapu textu?", a: "Hlavní téma uprostřed + klíčová slova v paprscích", opts: ["Hlavní téma uprostřed + klíčová slova v paprscích", "Napíšeme text celý znovu", "Seřadíme věty abecedně", "Vypíšeme jen slovesa"], e: "Myšlenková mapa má uprostřed hlavní téma a od něj se paprskovitě rozbíhají klíčová slova, takže přehledně ukáže, co spolu souvisí. Opsání celého textu ani řazení vět podle abecedy mapou není." },
  { q: "Přečteme rychle nadpisy a první věty odstavců. To nám dá:", a: "celkový přehled o obsahu textu", opts: ["celkový přehled o obsahu textu", "detailní znalost každé věty", "přesnou odpověď na každou otázku", "seznam klíčových slov"], e: "Nadpisy a úvodní věty odstavců shrnují, o čem jednotlivé části jsou, takže z nich rychle získáme celkový přehled. Pro znalost každého detailu bychom museli text přečíst celý a pomalu." },
  { q: "Vyhledávání klíčového slova 'fotosyntéza' v učebnici — nejrychlejší metoda:", a: "Použít rejstřík (index) na konci knihy", opts: ["Použít rejstřík (index) na konci knihy", "Číst celou učebnici od začátku", "Hledat jen v obrázcích", "Přečíst jen tituly kapitol"], e: "V rejstříku na konci knihy najdeme pojem abecedně a hned u něj číslo strany, kde se o něm píše. Procházet celou učebnici nebo jen obrázky by bylo mnohem pomalejší." },
  { q: "Hlavní myšlenka textu je:", a: "sdělení, které platí pro celý text a ne jen pro jeden odstavec", opts: ["sdělení, které platí pro celý text a ne jen pro jeden odstavec", "první věta textu", "nadpis textu", "nejdelší věta textu"], e: "Hlavní myšlenka musí shrnovat celý text, ne jen jeden jeho odstavec nebo jednu větu. Proto to není automaticky první věta, nadpis ani nejdelší věta — ty zachycují jen část." },
  { q: "Proč je rychlé vyhledávání (scanning) užitečné?", a: "Ušetříme čas — hledáme jen konkrétní informaci", opts: ["Ušetříme čas — hledáme jen konkrétní informaci", "Přečteme text důkladněji", "Lépe porozumíme textu", "Zapamatujeme si více"], e: "Scanning nám šetří čas, protože hledáme jen jednu konkrétní informaci a zbytek textu přeskočíme. Pro hlubší porozumění nebo zapamatování bychom naopak museli číst pomalu a pozorně." },
  { q: "Jak z klíčových slov odhadneme téma textu?", a: "Klíčová slova vystihují hlavní oblast — propojíme je", opts: ["Klíčová slova vystihují hlavní oblast — propojíme je", "Klíčová slova jsou základ pro překlad textu", "Klíčová slova jsou vždy přídavná jména", "Klíčová slova jsou vždy verba"], e: "Když klíčová slova spojíme dohromady, ukáže se nám oblast, o které text je — to je jeho téma. Klíčová slova přitom mohou být různé slovní druhy, nejsou vždy jen přídavná jména nebo slovesa." },
  { q: "Text: 'Včely, opylení, med, úl, kvetoucí louky.' — jaké je pravděpodobné téma?", a: "Včely a jejich role v přírodě", opts: ["Včely a jejich role v přírodě", "Výroba medu v továrně", "Zahradnictví a pěstování rostlin", "Meteorologie a počasí"], e: "Všechna slova se točí kolem včel a toho, co dělají v přírodě — opylují, žijí v úlu a sbírají z luk. Továrna ani počasí mezi tato slova nezapadají, a proto nejsou tématem." },
  { q: "Co je 'rejstřík' v knize?", a: "Abecední seznam pojmů s čísly stran, kde jsou v knize", opts: ["Abecední seznam pojmů s čísly stran, kde jsou v knize", "Obsah kapitol na začátku", "Seznam ilustrací", "Bibliografie"], e: "Rejstřík je abecední seznam pojmů na konci knihy a u každého je číslo strany, kde pojem najdeme. Liší se od obsahu, který je na začátku a řadí kapitoly podle pořadí, ne podle abecedy." },
  { q: "Proč je schopnost vyhledávat klíčová slova důležitá?", a: "Pomáhá rychle najít potřebné informace v textu i v knihovně", opts: ["Pomáhá rychle najít potřebné informace v textu i v knihovně", "Pomáhá psát básně", "Pomáhá číst rychleji bez porozumění", "Pomáhá memorovat celé texty"], e: "Když umíme najít klíčová slova, rychle se zorientujeme v textu i ve velkém množství knih a najdeme, co potřebujeme. Cílem není číst bez porozumění ani se učit texty nazpaměť." },
  { q: "Klíčové slovo vs. téma: Klíčové slovo je:", a: "konkrétní výraz; téma je obecnější označení oblasti", opts: ["konkrétní výraz; téma je obecnější označení oblasti", "stejná věc jako téma", "vždy sloveso", "vždy celá věta"], e: "Klíčové slovo je konkrétní výraz z textu, kdežto téma je obecnější pojmenování celé oblasti, do které ta slova patří. Není to tedy totéž a klíčové slovo nemusí být sloveso ani celá věta." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Klíčová slova = opakují se, jsou tučně, jsou v nadpisech",
      "Hlavní myšlenka = O čem je text? Co chce autor říct? — shrnutí jednou větou",
      "Vyhledávání: scanning = konkrétní info; skimming = celkový přehled",
    ],
    explanation: e,
  }));
}

export const VYHLEDAVANIKLICOVYCHSLOVAHLAVNIMYSLENKY: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-klicovych-slov-a-hlavni-myslenky",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-klicovych-slov-a-hlavni-myslenky",
    title: "Vyhledávání klíčových slov a hlavní myšlenky",
    studentTitle: "Klíčová slova a myšlenka",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se rychle najít klíčová slova a hlavní myšlenku textu.",
    keywords: ["klíčové slovo", "hlavní myšlenka", "téma", "vyhledávání", "skimming", "scanning", "rejstřík"],
    goals: [
      "Vyhledat klíčová slova v textu",
      "Určit hlavní myšlenku textu",
      "Použít techniky rychlého vyhledávání informací",
    ],
    boundaries: ["Bez pokročilé analýzy argumentů", "Bez textů nad úroveň 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Klíčová slova = opakují se nebo jsou tučně; hlavní myšlenka = co chce autor říct (shrnutí celého textu)",
      steps: [
        "Přelétni text a hledej opakující se nebo zvýrazněná slova → klíčová slova.",
        "Přečti nadpis a první větu každého odstavce.",
        "Ptej se: O čem je celý text? Co tím autor říká?",
        "Shrň hlavní myšlenku jednou větou.",
      ],
      commonMistake: "Záměna tématu a hlavní myšlenky: téma = 'sloni'; hlavní myšlenka = 'Sloni jsou ohroženi vyhynutím.'",
      example: "Klíčová slova v textu o lesích: 'kácení, les, biodiverzita, ohrožení'; hlavní myšlenka: 'Kácení lesů ohrožuje biodiverzitu.'",
    },
  },
];
