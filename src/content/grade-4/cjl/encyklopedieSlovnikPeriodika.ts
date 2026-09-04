import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string; hints?: string[] }

const POOL_L1: QA[] = [
  { q: "Co je encyklopedie?", a: "Příručka s abecedně seřazenými fakta o světě", opts: ["Příručka s abecedně seřazenými fakta o světě", "Příručka s výkladem slov", "Novinový deník", "Sbírka pohádek"], e: "Encyklopedie shromažďuje fakta o světě — o přírodě, dějinách, lidech — a hesla řadí podle abecedy, aby se snadno hledala. Výklad slov najdeme ve slovníku a pohádky ve sbírce příběhů, ne v encyklopedii." },
  { q: "Co je slovník?", a: "Příručka s výkladem nebo překladem slov", opts: ["Příručka s výkladem nebo překladem slov", "Příručka s fakta o světě", "Novinový deník", "Sbírka básní"], e: "Slovník se zabývá slovy — buď vysvětluje, co znamenají, nebo je překládá do jiného jazyka. Fakta o světě uvádí encyklopedie, ne slovník." },
  { q: "Co jsou periodika?", a: "Tiskoviny vycházející opakovaně", opts: ["Slovníky cizích slov", "Tiskoviny vycházející opakovaně", "Naučné encyklopedie", "Jednorázově vydané knihy"], e: "Slovo periodikum souvisí se slovem perioda neboli pravidelný úsek — periodika proto vycházejí opakovaně, třeba každý den nebo týden. Kniha, encyklopedie ani slovník nevycházejí pravidelně znovu a znovu." },
  { q: "Jak jsou hesla v encyklopedii seřazena?", a: "abecedně", opts: ["abecedně", "podle velikosti tématu", "chronologicky", "tematicky vždy na skupiny"], e: "Hesla jsou seřazena podle abecedy, abys je našel stejně rychle jako slovo ve slovníku. Kdyby byla řazena podle velikosti nebo času, musel bys listovat celou knihou, než bys heslo objevil.", hints: [
    "Přemýšlej, jaký systém řazení používáme i ve slovníku nebo v telefonním seznamu — něco, co jde snadno najít podle prvního písmene.",
    "Řazení podle velikosti tématu nebo podle času by ti nepomohlo najít konkrétní heslo rychle — musel bys projít celou knihu a doufat, že na to slovo někde narazíš.",
  ] },
  { q: "Jak často vycházejí noviny?", a: "Denně", opts: ["Denně", "Týdně", "Měsíčně", "Ročně"], e: "Noviny přinášejí čerstvé zprávy o tom, co se právě stalo, proto vycházejí každý den. Časopisy vycházejí řidčeji (týdně nebo měsíčně), protože nepřinášejí tak rychle se měnící zprávy.", hints: [
    "Noviny přinášejí čerstvé zprávy o tom, co se PRÁVĚ stalo — jak často se svět kolem nás mění natolik, aby to stálo za nové vydání?",
    "Časopisy vycházejí řidčeji než noviny — o kolik častěji tedy musí vycházet noviny, aby stihly zachytit i to, co se stalo teprve dnes ráno nebo včera pozdě večer?",
  ] },
  { q: "Jak často vycházejí časopisy?", a: "Týdně nebo měsíčně", opts: ["Týdně nebo měsíčně", "Denně", "Ročně", "Jednou za 10 let"], e: "Časopis vychází méně často než noviny — obvykle jednou za týden nebo měsíc — a věnuje se tématu podrobněji. Denně vycházejí noviny, ne časopisy." },
  { q: "K čemu slouží výkladový slovník?", a: "Vysvětluje, co slova znamenají", opts: ["Vysvětluje, co slova znamenají", "Překládá slova do jiného jazyka", "Uvádí fakta o světě", "Poskytuje synonyma"], e: "Výkladový slovník u každého slova napíše, co znamená — jako bys ho někomu vysvětloval. Překlad do cizího jazyka dělá slovník překladový a fakta o světě najdeš v encyklopedii." },
  { q: "K čemu slouží překladový slovník?", a: "Překládá slova z jednoho jazyka do druhého", opts: ["Překládá slova z jednoho jazyka do druhého", "Vysvětluje, co slova znamenají", "Uvádí fakta o světě", "Uvádí synonyma a antonyma"], e: "Překladový slovník u slova v jednom jazyce uvádí, jak se řekne v jazyce druhém — třeba česky 'pes' a anglicky 'dog'. Význam slova ve stejném jazyce vysvětluje slovník výkladový." },
  { q: "Kde najdeme heslo 'sopka' v encyklopedii?", a: "V části na písmeno S", opts: ["V části na písmeno S", "V části na písmeno Z (záchrana)", "V části na písmeno V (vulkán)", "Na konci encyklopedie"], e: "Hesla se řadí podle prvního písmene slova, kterým se ptáme — slovo 'sopka' začíná na S, takže ho hledáme v části S. Cizí slovo vulkán ani jiné téma na řazení nemají vliv." },
  { q: "Novinový článek je příkladem:", a: "periodika", opts: ["encyklopedie", "periodika", "románu", "slovníku"], e: "Noviny vycházejí opakovaně každý den, proto patří mezi periodika. Encyklopedie ani slovník nevycházejí pravidelně znovu a román je souvislý vymyšlený příběh, ne článek se zprávou." },
  { q: "Diderot nebo Britannica jsou příklady:", a: "encyklopedií", opts: ["encyklopedií", "slovníků", "periodik", "románů"], e: "Diderotova encyklopedie i Britannica jsou slavné soubory faktů o světě seřazené abecedně — tedy encyklopedie. Nejsou to slovníky slov ani noviny vycházející opakovaně." },
  { q: "Slovník synonymů nám pomáhá:", a: "najít slova s podobným významem", opts: ["najít slova s podobným významem", "přeložit text", "zjistit fakta o světě", "naučit se číst"], e: "Synonyma jsou slova s podobným významem (například velký – obrovský), a právě ta tento slovník nabízí, abys neopakoval pořád totéž slovo. Překlad ani fakta o světě v něm nehledej." },
  { q: "Co je naučný slovník?", a: "Stručně vysvětluje odborné pojmy z různých oborů", opts: ["Stručně vysvětluje odborné pojmy z různých oborů", "Překládá slova do cizích jazyků", "Sbírá básně a prózu", "Uvádí jízdní řády"], e: "Naučný slovník krátce vysvětlí odborné pojmy z různých oborů, jako je věda nebo umění — je něco mezi slovníkem a malou encyklopedií. Překlady dělá slovník překladový a básně patří do sbírky, ne do slovníku." },
  { q: "Kde hledáme informace o historii vynálezu kola?", a: "V naučné encyklopedii", opts: ["V časopise pro děti", "V naučné encyklopedii", "V denních novinách", "V překladovém slovníku"], e: "Historie vynálezu je fakt o světě, a takové údaje shromažďuje encyklopedie pod příslušným heslem. Překladový slovník jen překládá slova a noviny přinášejí dnešní zprávy, ne dávnou historii." },
  { q: "Co je věstník?", a: "Tiskovina s úředními oznámeními", opts: ["Encyklopedie pro školy", "Tiskovina s úředními oznámeními", "Denní zpravodajské noviny", "Dětský obrázkový časopis"], e: "Věstník je periodikum, které pravidelně přináší úřední nebo spolková oznámení — třeba zprávy z radnice nebo ze spolku. Není to běžný deník se zprávami ani encyklopedie faktů." },
  { q: "Jaký zdroj použijeme, pokud nevíme, co znamená slovo 'biodiverzita'?", a: "Slovník nebo encyklopedie", opts: ["Denní noviny a časopisy", "Slovník nebo encyklopedie", "Jízdní řád autobusů", "Román na pokračování"], e: "Když neznáme význam slova, hledáme v něčem, co slova vysvětluje — ve slovníku nebo naučné encyklopedii. Noviny, román ani jízdní řád význam odborného slova nevysvětlí." },
];

const POOL_L2: QA[] = [
  { q: "Jaký je rozdíl mezi encyklopedií a slovníkem?", a: "Encyklopedie = fakta o světě; slovník = výklad nebo překlad slov", opts: ["Encyklopedie = fakta o světě; slovník = výklad nebo překlad slov", "Jsou to stejné věci", "Encyklopedie je menší; slovník větší", "Slovník má abecední řazení, encyklopedie ne"], e: "Encyklopedie vypráví o věcech a jevech ve světě, zatímco slovník se zabývá samotnými slovy — vysvětluje je nebo překládá. Nejde o velikost ani o řazení, abecedně bývají obě.", hints: [
    "Jedna z těch dvou knih vypráví o věcech a jevech ve světě, druhá se zabývá samotnými slovy — jejich významem nebo převodem do jiného jazyka.",
    "Není to o velikosti knihy ani o tom, jestli mají abecední řazení — obě ho totiž mívají, takže podle toho je od sebe nikdy nerozeznáš. Rozhoduje, o čem heslo vypráví.",
  ] },
  { q: "Jaký zdroj použijeme pro překlad slova 'house' z angličtiny?", a: "Překladový slovník (anglicko-český)", opts: ["Překladový slovník (anglicko-český)", "Encyklopedie", "Noviny", "Výkladový slovník češtiny"], e: "Když chceme slovo z cizího jazyka říct česky, potřebujeme překladový slovník, který spojuje dva jazyky. Výkladový slovník češtiny by 'house' nenašel a encyklopedie ani noviny slova nepřekládají." },
  { q: "Jaký je rozdíl mezi novinami a časopisem?", a: "Noviny = denní tisk; časopisy = týdenní nebo měsíční", opts: ["Noviny = denní tisk; časopisy = týdenní nebo měsíční", "Jsou to stejné věci", "Noviny jsou větší; časopisy menší", "Časopisy jsou denní; noviny týdenní"], e: "Hlavní rozdíl je v tom, jak často vycházejí: noviny každý den, časopisy obvykle jednou za týden nebo měsíc. Nejde o velikost a pořadí v poslední možnosti je obrácené." },
  { q: "Co je Slovník spisovné češtiny?", a: "Výkladový slovník s normativními tvary a pravidly", opts: ["Výkladový slovník s normativními tvary a pravidly", "Překladový slovník", "Encyklopedie českých autorů", "Sbírka básní"], e: "Slovník spisovné češtiny vysvětluje význam českých slov a ukazuje jejich správné spisovné tvary — je to slovník výkladový. Nepřekládá do cizích jazyků ani nepopisuje autory jako encyklopedie." },
  { q: "Proč jsou noviny periodika?", a: "Protože vychází opakovaně (denně)", opts: ["Protože vychází opakovaně (denně)", "Protože mají mnoho stran", "Protože jsou barevné", "Protože obsahují reklamy"], e: "O tom, zda je něco periodikum, rozhoduje pravidelné opakované vydávání, ne vzhled. Noviny vycházejí znovu a znovu (denně), proto jsou periodika; barvy ani reklamy s tím nesouvisí." },
  { q: "Kde najdeme heslo 'Vltava' v encyklopedii?", a: "V části na písmeno V", opts: ["V části na písmeno V", "V části na písmeno R (řeky)", "V části na písmeno P (Praha)", "Na konci encyklopedie"], e: "Heslo hledáme podle prvního písmene jeho názvu — Vltava začíná na V, takže ji najdeme v části V. Encyklopedie neřadí podle toho, že jde o řeku nebo že teče Prahou." },
  { q: "K čemu slouží rejstřík na konci encyklopedie?", a: "K rychlému hledání hesel", opts: ["Ke čtení o celém světě", "K rychlému hledání hesel", "K překladu cizích slov", "K výkladu neznámých slov"], e: "Rejstřík je abecední seznam pojmů s čísly stran, díky kterému rychle najdeš, kde se o tématu píše. Samotný výklad ani překlad slov rejstřík neobsahuje, jen tě k informaci nasměruje." },
  { q: "Informaci o počtu obyvatel Prahy hledáme:", a: "V encyklopedii nebo statistické ročence", opts: ["V encyklopedii nebo statistické ročence", "V překladovém slovníku", "V beletrii", "V dětském časopisu"], e: "Počet obyvatel je fakt o světě a takové údaje shromažďuje encyklopedie nebo statistická ročenka. Překladový slovník překládá slova a beletrie je vymyšlené čtení, fakta v ní nehledej." },
  { q: "Synonymum slova 'šedivý' hledáme:", a: "Ve slovníku synonym", opts: ["V naučné encyklopedii", "Ve slovníku synonym", "V denních novinách", "V dobrodružném románu"], e: "Synonymum je slovo s podobným významem a sbírku takových slov najdeš ve slovníku synonym (tezauru). Encyklopedie podává fakta o světě, ne podobná slova." },
  { q: "Dětský časopis 'ABC' je příkladem:", a: "periodika (časopis, vychází opakovaně)", opts: ["periodika (časopis, vychází opakovaně)", "encyklopedie", "výkladového slovníku", "naučné knihy"], e: "Časopis ABC vychází pravidelně znovu a znovu, proto je to periodikum. Encyklopedie ani slovník nevycházejí opakovaně a kniha je jednorázová." },
  { q: "Které zdroje patří mezi periodika?", a: "Noviny, časopisy, věstníky", opts: ["Noviny, časopisy, věstníky", "Encyklopedie, slovníky, atlasy", "Románové knihy, sbírky básní", "Jízdní řády, mapy, plány"], e: "Periodika vycházejí opakovaně — to platí pro noviny, časopisy i věstníky. Encyklopedie, slovníky, atlasy nebo knihy vyjdou jednou a opakovaně se nevydávají." },
  { q: "Co je 'naučný slovník' vs. 'výkladový slovník'?", a: "Naučný = odborné pojmy; výkladový = obecná slova s vysvětlením", opts: ["Naučný = odborné pojmy; výkladový = obecná slova s vysvětlením", "Jsou to stejné věci", "Naučný = překlady; výkladový = fakta", "Oba jsou encyklopedie"], e: "Naučný slovník vysvětluje odborné pojmy z různých oborů, kdežto výkladový slovník vysvětluje běžná slova jazyka. Žádný z nich nepřekládá do cizích jazyků a nejsou to encyklopedie." },
  { q: "Proč hesla v encyklopedii jsou seřazena abecedně?", a: "Aby čtenář snadno a rychle našel hledané heslo", opts: ["Aby čtenář snadno a rychle našel hledané heslo", "Protože je to zákon", "Protože písmena jsou hezká", "Protože encyklopedie je dlouhá"], e: "Abecední řazení má praktický důvod — známe-li první písmeno slova, najdeme heslo rychle, jako jméno v telefonním seznamu. Nejde o pravidlo ze zákona ani o krásu písmen." },
  { q: "Příklad výkladového slovníku česky:", a: "Slovník spisovné češtiny", opts: ["Deník Lidové noviny", "Slovník spisovné češtiny", "Diderotova encyklopedie", "Anglicko-český slovník"], e: "Výkladový slovník vysvětluje význam slov ve stejném jazyce, a přesně to dělá Slovník spisovné češtiny. Anglicko-český slovník překládá, Diderotova encyklopedie podává fakta a Lidové noviny jsou periodikum." },
  { q: "Co obsahuje novinový článek, co encyklopedie ne?", a: "Aktuální informace a zprávy (co se stalo dnes)", opts: ["Aktuální informace a zprávy (co se stalo dnes)", "Fakta o historii", "Výklad slov", "Překlad do jiných jazyků"], e: "Noviny vycházejí denně, proto přinášejí čerstvé zprávy o tom, co se právě stalo — to encyklopedie nestihne. Historická fakta naopak najdeš spíš v encyklopedii než v jednom novinovém článku." },
  { q: "Proč jsou encyklopedie vydávány v nových edicích?", a: "Protože svět se mění a přibývají nová fakta", opts: ["Protože svět se mění a přibývají nová fakta", "Protože stará vydání jsou ošklivá", "Protože musí být delší", "Protože se mění abeceda"], e: "Svět se neustále vyvíjí — vznikají nové objevy a události — a nové vydání tato čerstvá fakta doplní, aby byla encyklopedie pravdivá. Abeceda se nemění a o vzhled ani délku tu nejde." },
];

const POOL_L3: QA[] = [
  { q: "Chceš zjistit, co znamená cizí slovo 'ekosystém', a zároveň se dozvědět zajímavá fakta o přírodě. Které dva zdroje použiješ?", a: "Slovník i encyklopedii", opts: ["Jen denní noviny", "Slovník i encyklopedii", "Jen encyklopedii", "Jen slovník"], e: "Slovník ti vysvětlí, co slovo 'ekosystém' znamená, encyklopedie ti k tomu doplní konkrétní fakta o přírodě — každý zdroj slouží k něčemu jinému." },
  { q: "Proč nehledáme dnešní počasí v encyklopedii?", a: "Obsahuje stálá fakta, ne aktuality", opts: ["Počasí není důležité téma", "Obsahuje stálá fakta, ne aktuality", "Encyklopedie počasí nezná", "Encyklopedie je moc malá"], e: "Encyklopedie shromažďuje fakta, která se dlouho nemění, kdežto počasí je aktuální informace, kterou přinášejí denně vycházející noviny." },
  { q: "Kniha má tisíce hesel řazených abecedně o přírodě, historii i vědě a vychází jen jednou (ne pravidelně). Co to je?", a: "Encyklopedie", opts: ["Encyklopedie", "Periodikum", "Slovník", "Časopis"], e: "Abecedně řazená hesla s fakty z různých oborů, vydaná jednorázově, jsou typickým znakem encyklopedie." },
  { q: "Proč se může časopis věnovat tématu podrobněji než noviny?", a: "Vychází méně často, takže má víc času na přípravu obsahu", opts: ["Vychází méně často, takže má víc času na přípravu obsahu", "Je menší, takže se do něj vejde méně", "Nemá redaktory", "Nepíše o aktuálních věcech"], e: "Časopis vychází jen jednou za týden nebo měsíc, proto může redakce věnovat víc času přípravě hlubších článků než denní noviny." },
  { q: "Kniha vychází v nových vydáních každý rok s novými objevy, ale pořád má formu abecedních hesel. Je to spíš:", a: "Encyklopedie (forma zůstává — abecední hesla o faktech)", opts: ["Encyklopedie (forma zůstává — abecední hesla o faktech)", "Periodikum, protože vychází pravidelně", "Slovník, protože má hesla", "Noviny, protože je aktuální"], e: "O tom, zda je něco encyklopedie, rozhoduje forma (abecední hesla s fakty), ne to, jak často vychází nové vydání." },
  { q: "Hledáš recept na dnešní večeři a chceš vědět aktuální ceny potravin v obchodě. Kam se podíváš?", a: "Do novin nebo časopisu", opts: ["Do překladového slovníku", "Do novin nebo časopisu", "Do výkladového slovníku", "Do naučné encyklopedie"], e: "Aktuální ceny a novinky hledáme v periodikách, protože ta vycházejí pravidelně a přinášejí čerstvé informace." },
  { q: "Máš dvě knihy: jednu s výkladem 50 000 českých slov, druhou s fakty o všech státech světa. Který zdroj použiješ, když nevíš, co znamená slovo 'monzun'?", a: "Slovník s výkladem slov (výkladový slovník)", opts: ["Slovník s výkladem slov (výkladový slovník)", "Knihu s fakty o státech (encyklopedii)", "Obě knihy stejně", "Ani jednu, hledal bys v novinách"], e: "Když nevíš, co slovo znamená, potřebuješ výkladový slovník. Encyklopedie s fakty o státech by ti význam slova nevysvětlila.", hints: [
    "Potřebuješ vysvětlit VÝZNAM slova, ne zjistit fakta o zemích — která z těch dvou knih ti to umožní?",
    "Noviny by ti definici slova taky nedaly, vyřaď je hned. Zbývají dvě knihy a jen jedna z nich se zabývá samotnými slovy a jejich významem.",
  ] },
  { q: "Proč encyklopedie řadí hesla abecedně, i když by šlo řadit podle témat (příroda, historie, věda)?", a: "Hledá se tak rychleji", opts: ["Témata se nedají seřadit", "Hledá se tak rychleji", "Přikazuje to zákon", "Jiné řazení neexistuje"], e: "Když známe první písmeno hesla, najdeme ho rychle, i když neznáme přesné téma, do kterého patří." },
  { q: "Chceš vědět, jak se anglicky řekne 'strom', a taky, co slovo 'strom' znamená v biologii. Které dva zdroje potřebuješ?", a: "Překladový i výkladový slovník", opts: ["Jen výkladový slovník", "Překladový i výkladový slovník", "Jen překladový slovník", "Jen denní noviny"], e: "Na překlad slova potřebuješ překladový slovník, na biologický výklad výkladový slovník nebo encyklopedii — každý úkol vyžaduje jiný zdroj.", hints: [
    "Máš tu dva různé úkoly — přeložit slovo do jiného jazyka a zjistit jeho odborný význam. Zvládne to jeden jediný typ zdroje, nebo potřebuješ dva různé?",
    "Noviny by ti ani jeden z těch úkolů nesplnily, vyřaď je hned. Pak si u každého zbylého úkolu zvlášť rozmysli, jestli jde o převod do jiného jazyka, nebo o vysvětlení odborného významu.",
  ] },
  { q: "Proč jsou noviny periodikum, ale kniha, i když má 500 stran, periodikum není?", a: "Noviny vycházejí opakovaně (denně), kniha vyjde jednou", opts: ["Noviny vycházejí opakovaně (denně), kniha vyjde jednou", "Noviny jsou kratší než kniha", "Kniha nemá abecední řazení", "Noviny mají barevné obrázky"], e: "O periodiku rozhoduje opakované vydávání, ne délka nebo vzhled — noviny vycházejí znovu a znovu, kniha jen jednou.", hints: [
    "Přemýšlej, kolikrát každá z těch dvou věcí vůbec vznikne — jednou navždy, nebo se pořád tiskne nové vydání?",
    "Není to o délce ani o vzhledu, to je jen rozptylující detail. Rozhoduje jediná věc: jestli je to jednorázová záležitost, nebo jestli po ní přijde další a další vydání.",
  ] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e, hints }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: hints ?? [
      "Nejdřív si ujasni, co vlastně hledáš.",
      "Hledáš jedno jediné slovo, nebo fakta o nějaké věci? A potřebuješ něco dnešního, nebo něco, co platí pořád?",
      "Když jde o jedno jediné slovo, rozhodni ještě, jestli chceš vědět, co znamená, nebo jak se řekne v jiném jazyce.",
    ],
    explanation: e,
  }));
}

export const ENCYKLOPEDIESLOVNIKPERIODIKA: TopicMetadata[] = [
  {
    id: "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-encyklopedie-slovnik-periodika",
    rvpNodeId: "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-encyklopedie-slovnik-periodika",
    displayName: "Encyklopedie a slovníky",
    title: "Encyklopedie, slovník, periodika",
    studentTitle: "Knihy a zdroje info",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární výchova",
    briefDescription: "Poznáš různé druhy informačních zdrojů — encyklopedie, slovníky a periodika.",
    keywords: ["encyklopedie", "slovník", "periodika", "noviny", "časopis", "výkladový slovník", "překladový slovník"],
    goals: [
      "Rozlišit encyklopedii, slovník a periodika",
      "Vybrat správný zdroj pro danou potřebu",
    ],
    boundaries: ["Bez digitálních databází a internetu", "Bez pokročilé bibliografie"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-pohadka-povest-bajka-povidka"],
    generator: gen,
    helpTemplate: {
      hint: "Encyklopedie=fakta o světě; Slovník=výklad/překlad slov; Periodika=noviny/časopisy vycházející opakovaně",
      steps: [
        "Potřebuji fakta o tématu? → encyklopedie",
        "Potřebuji vysvětlit slovo? → výkladový slovník",
        "Potřebuji přeložit slovo? → překladový slovník",
        "Potřebuji aktuální zprávy? → noviny/periodika",
      ],
      commonMistake: "Záměna encyklopedie a slovníku — encyklopedie popisuje svět, slovník popisuje slova",
      example: "Co znamená 'metafora'? → slovník; Kde leží Kilimandžáro? → encyklopedie; Jaké je dnešní počasí? → noviny",
    },
  },
];
