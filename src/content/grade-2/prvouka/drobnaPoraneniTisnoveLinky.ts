import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one (4 možnosti).
//   L1 = rozpoznání jednoho jasného faktu — tísňové číslo dané složky,
//        kdo/co při drobném úrazu (na ránu náplast, na oheň hasiče).
//   L2 = aplikace: podle popsané situace vyber správný postup nebo
//        správnou složku pomoci (spadl a krvácí, hoří tráva, boule…).
//   L3 = transfer (2 kroky, věk 7-8 let): rozlišení blízkých tísňových
//        čísel a složek, „proč“ otázky, oprava miskoncepce, správné
//        pořadí kroků při vážnějším úrazu.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Jaké je tísňové číslo záchranné služby (sanitky)?",
    correctAnswer: "155",
    options: ["155", "150", "158", "112"],
    emoji: "🚑",
    hints: ["Záchranáři přijíždějí sanitkou k nemocným a zraněným — na které číslo je voláme?"],
    solutionSteps: ["Záchranná služba má číslo 155 — voláme ho, když někdo potřebuje zdravotní pomoc."],
  },
  {
    question: "Jaké je tísňové číslo hasičů?",
    correctAnswer: "150",
    options: ["150", "155", "158", "112"],
    emoji: "🚒",
    hints: ["Hasiči hasí požáry — na které číslo je voláme?"],
    solutionSteps: ["Hasiči mají číslo 150 — voláme ho, když hoří nebo hrozí jiné nebezpečí."],
  },
  {
    question: "Jaké je tísňové číslo policie?",
    correctAnswer: "158",
    options: ["158", "150", "155", "112"],
    emoji: "👮",
    hints: ["Policie chrání lidi a řeší krádeže a nehody — na které číslo ji voláme?"],
    solutionSteps: ["Policie má číslo 158 — voláme ho, když potřebujeme policejní pomoc."],
  },
  {
    question: "Jaké tísňové číslo platí ve všech zemích Evropy?",
    correctAnswer: "112",
    options: ["112", "155", "150", "158"],
    emoji: "📞",
    hints: ["Jedno společné číslo funguje v celé Evropě — které to je?"],
    solutionSteps: ["Tísňové číslo 112 platí v celé Evropě — dovoláš se jím pomoci ve všech zemích EU."],
  },
  {
    question: "Co dáme na malou odřeninu?",
    correctAnswer: "Náplast",
    options: ["Náplast", "Bonbon", "Hračku", "Kamínek"],
    emoji: "🩹",
    hints: ["Malá odřenina se ošetří — co na ni přiložíme, aby byla chráněná?"],
    solutionSteps: ["Na odřeninu dáme náplast — chrání ranku před nečistotou a pomáhá hojení."],
  },
  {
    question: "Koho voláme, když hoří?",
    correctAnswer: "Hasiče",
    options: ["Hasiče", "Pekaře", "Učitele", "Řidiče"],
    emoji: "🚒",
    hints: ["Oheň je nebezpečný — kdo ho umí uhasit?"],
    solutionSteps: ["Když hoří, voláme hasiče — přijedou a oheň uhasí."],
  },
  {
    question: "Koho voláme, když se někdo vážně zraní?",
    correctAnswer: "Záchrannou službu",
    options: ["Záchrannou službu", "Pošťáka", "Kuchaře", "Prodavače"],
    emoji: "🚑",
    hints: ["Vážné zranění potřebuje zdravotní pomoc — kdo ji poskytne?"],
    solutionSteps: ["Při vážném úrazu voláme záchrannou službu — přijedou záchranáři a zraněného ošetří."],
  },
  {
    question: "Čím umyjeme špinavou ranku?",
    correctAnswer: "Čistou vodou",
    options: ["Čistou vodou", "Blátem", "Pískem", "Sněhem z cesty"],
    emoji: "💧",
    hints: ["Ranku je potřeba zbavit nečistot — čím ji opláchneme?"],
    solutionSteps: ["Ranku umyjeme čistou vodou — smyjeme nečistoty, aby se dobře hojila."],
  },
  {
    question: "Koho zavolá malé dítě, když se stane úraz?",
    correctAnswer: "Dospělého",
    options: ["Dospělého", "Nikoho", "Hračku", "Domácího mazlíčka"],
    emoji: "🧑",
    hints: ["Malé dítě samo úraz nezvládne — koho si přivolá na pomoc?"],
    solutionSteps: ["Při úrazu zavolá dítě dospělého — ten pomůže nebo přivolá záchrannou službu."],
  },
  {
    question: "Co přiložíme na bouli od nárazu?",
    correctAnswer: "Studený obklad",
    options: ["Studený obklad", "Horkou vodu", "Bonbon", "Hrst písku"],
    emoji: "🧊",
    hints: ["Boule bolí a otéká — pomůže spíš chlad, nebo teplo?"],
    solutionSteps: ["Na bouli přiložíme studený obklad — chlad zmírní otok i bolest."],
  },
  {
    question: "Koho voláme, když nám někdo ukradne kolo?",
    correctAnswer: "Policii",
    options: ["Policii", "Hasiče", "Pekaře", "Zubaře"],
    emoji: "🚓",
    hints: ["Krádež je práce pro jednu určitou složku — kterou?"],
    solutionSteps: ["Při krádeži voláme policii — ta krádeže vyšetřuje."],
  },
  {
    question: "Kam jdeme, když je zranění vážné a musí ho ošetřit lékař?",
    correctAnswer: "Do nemocnice",
    options: ["Do nemocnice", "Do obchodu", "Na hřiště", "Do kina"],
    emoji: "🏥",
    hints: ["Malou ranku zvládneme doma, ale vážné zranění patří k lékaři — kam?"],
    solutionSteps: ["Vážné zranění ošetří v nemocnici — jsou tam lékaři a vybavení pro vážnější úrazy."],
  },
  {
    question: "Co záchranné službě řekneme do telefonu jako první?",
    correctAnswer: "Co se stalo a kde jsme",
    options: ["Co se stalo a kde jsme", "Vtip", "Oblíbenou písničku", "Co jsme měli k obědu"],
    emoji: "📞",
    hints: ["Záchranář potřebuje hned vědět dvě věci — proč voláš a kam má přijet."],
    solutionSteps: ["Do telefonu nejdřív řekneme, co se stalo a kde jsme — aby záchranáři věděli, kam a proč přijet."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Spadl jsi z kola a odřel si koleno, které trochu krvácí. Co uděláš nejdřív?",
    correctAnswer: "Opláchnu ranku čistou vodou a řeknu to dospělému",
    options: [
      "Opláchnu ranku čistou vodou a řeknu to dospělému",
      "Zasypu ranku pískem a hraju si dál",
      "Ranku si nechám a nikomu nic neřeknu",
      "Namažu koleno blátem",
    ],
    emoji: "🚲",
    hints: [
      "Nejdřív ranku vyčistíme a pak to řekneme dospělému.",
      "Písek a bláto by ranku jen zanesly špínou.",
    ],
    solutionSteps: ["Odřené koleno nejdřív opláchneme čistou vodou a řekneme to dospělému. Písek ani bláto na ranku nepatří — zanesly by ji špínou."],
  },
  {
    question: "V lese vidíš, že od ohniště začíná hořet suchá tráva a oheň se šíří. Koho zavoláš?",
    correctAnswer: "Hasiče na číslo 150",
    options: [
      "Hasiče na číslo 150",
      "Záchrannou službu na číslo 155",
      "Policii na číslo 158",
      "Nikoho, oheň uhasím sám",
    ],
    emoji: "🔥",
    hints: [
      "Kdo umí uhasit šířící se oheň?",
      "Šířící se oheň v lese je nebezpečný — malé dítě ho nehasí samo.",
    ],
    solutionSteps: ["Šířící se oheň hlásíme hasičům na číslo 150. Sami ho hasit nezkoušíme — je to nebezpečné, radši přivoláme pomoc a odejdeme do bezpečí."],
  },
  {
    question: "Kamarád spadl, drží se za nohu, nemůže vstát a hodně ho to bolí. Co uděláš?",
    correctAnswer: "Zavolám dospělého, případně záchrannou službu 155",
    options: [
      "Zavolám dospělého, případně záchrannou službu 155",
      "Zavolám hasiče na 150",
      "Přinutím ho vstát a běžet",
      "Nechám ho tam a odejdu",
    ],
    emoji: "🚑",
    hints: [
      "Kdo pomůže se zraněním, které bolí a člověk nemůže vstát?",
      "Hasiče voláme k ohni, ne ke zranění.",
    ],
    solutionSteps: ["Když kamarád nemůže vstát a moc ho to bolí, přivoláme dospělého nebo záchrannou službu 155. Nenutíme ho vstávat — mohli bychom zranění zhoršit."],
  },
  {
    question: "Uhodil ses do hlavy a začíná ti růst boule. Co pomůže?",
    correctAnswer: "Přiložit na bouli studený obklad",
    options: [
      "Přiložit na bouli studený obklad",
      "Přiložit na bouli horký hrnek",
      "Bouli silně stisknout a mačkat",
      "Bouli posypat cukrem",
    ],
    emoji: "🤕",
    hints: [
      "Co zmírní otok a bolest — chlad, nebo teplo?",
      "Mačkání ani cukr boulí nepomohou.",
    ],
    solutionSteps: ["Na bouli přiložíme něco studeného — chlad zmenší otok a bolest. Teplo by otok naopak zvětšilo."],
  },
  {
    question: "Když voláš na tísňovou linku, co je nejdůležitější říct?",
    correctAnswer: "Co se stalo a kde přesně jsme",
    options: [
      "Co se stalo a kde přesně jsme",
      "Jak se jmenuje naše morče",
      "Jakou barvu máme nejraději",
      "Co jsme dnes snídali",
    ],
    emoji: "📞",
    hints: [
      "Pomoc musí vědět, proč jede a kam.",
      "Zbytečné věci by jen zdržovaly.",
    ],
    solutionSteps: ["Na tísňové lince nejdřív řekneme, co se stalo a kde jsme. Podle toho pošlou správnou pomoc a najdou nás."],
  },
  {
    question: "Máš malou odřeninu, která skoro nekrvácí. Jak ji ošetříš?",
    correctAnswer: "Umyji ji čistou vodou a přelepím náplastí",
    options: [
      "Umyji ji čistou vodou a přelepím náplastí",
      "Zavolám kvůli ní záchrannou službu 155",
      "Nechám ji špinavou a přikryji blátem",
      "Posypu ji pískem",
    ],
    emoji: "🩹",
    hints: [
      "Malou ranku zvládneme ošetřit sami — umýt a přelepit.",
      "Kvůli malé odřenině se sanitka nevolá.",
    ],
    solutionSteps: ["Malou odřeninu umyjeme čistou vodou a přelepíme náplastí. Sanitku kvůli ní nevoláme — ta jezdí k vážným úrazům."],
  },
  {
    question: "Kterou tísňovou linku zavoláš, když jsi v cizí zemi a nevíš tamní čísla?",
    correctAnswer: "112",
    options: ["112", "150", "155", "158"],
    emoji: "🌍",
    hints: [
      "Které číslo funguje v celé Evropě?",
      "Čísla 150, 155 a 158 platí hlavně u nás.",
    ],
    solutionSteps: ["V cizí evropské zemi vytočíme 112 — funguje v celé Evropě a spojí nás s pomocí i tam, kde tamní čísla neznáme."],
  },
  {
    question: "Než jako dítě zavoláš pomoc při úrazu, koho hlavně sháníš kolem sebe?",
    correctAnswer: "Dospělého, který pomůže",
    options: [
      "Dospělého, který pomůže",
      "Jiné malé dítě",
      "Domácího mazlíčka",
      "Nikoho, poradím si sám",
    ],
    emoji: "🧑‍🤝‍🧑",
    hints: [
      "Kdo dokáže líp posoudit situaci a zavolat pomoc?",
      "Malé dítě by na to nemělo zůstat samo.",
    ],
    solutionSteps: ["Při úrazu jako první sháníme dospělého — ten líp posoudí situaci a přivolá pomoc. Na vážnou věc nezůstáváme sami."],
  },
  {
    question: "Co NEPATŘÍ na čerstvou ranku?",
    correctAnswer: "Bláto nebo písek",
    options: [
      "Bláto nebo písek",
      "Opláchnutí čistou vodou",
      "Čistá náplast",
      "Čistý obvaz",
    ],
    emoji: "🚫",
    hints: [
      "Co by ranku zaneslo špínou a bakteriemi?",
      "Voda, náplast a čistý obvaz ranku naopak chrání.",
    ],
    solutionSteps: ["Na ranku nikdy nedáváme bláto ani písek — zanesly by ji špínou a bakteriemi. Patří na ni čistá voda, náplast nebo čistý obvaz."],
  },
  {
    question: "Kamarádovi teče z nosu krev. Co je správné udělat?",
    correctAnswer: "Posadit ho, naklonit hlavu mírně dopředu a stisknout měkkou část nosu",
    options: [
      "Posadit ho, naklonit hlavu mírně dopředu a stisknout měkkou část nosu",
      "Zaklonit mu hlavu úplně dozadu a nechat krev téct do krku",
      "Nechat ho běhat a skákat",
      "Strčit mu do nosu písek",
    ],
    emoji: "🩸",
    hints: [
      "Hlavu nakláníme dopředu, ne dozadu, a nos jemně stiskneme.",
      "Běhání ani písek krvácení nezastaví.",
    ],
    solutionSteps: ["Při krvácení z nosu kamaráda posadíme, hlavu nakloníme mírně dopředu a stiskneme měkkou část nosu. Zaklánět hlavu dozadu není dobré — krev by tekla do krku."],
  },
  {
    question: "Na dětském hřišti pláče malý kluk, že se ztratil a neví, kde má maminku. Co uděláš?",
    correctAnswer: "Zavedu ho k dospělému, který pomůže najít rodiče",
    options: [
      "Zavedu ho k dospělému, který pomůže najít rodiče",
      "Nechám ho tam samotného plakat",
      "Odvedu ho pryč z hřiště sám neznámo kam",
      "Zavolám hasiče na 150",
    ],
    emoji: "🧒",
    hints: [
      "Kdo dokáže pomoct ztracené dítě spojit s rodiči?",
      "Hasiče voláme k ohni, ne ke ztracenému dítěti.",
    ],
    solutionSteps: ["Ztraceného kluka zavedeme k dospělému (třeba k jinému rodiči nebo pořadateli), který pomůže najít jeho rodiče. Sami ho nikam neodvádíme."],
  },
  {
    question: "Co uděláme s ranou, ze které trochu teče krev?",
    correctAnswer: "Přitlačíme na ni čistý kapesník nebo obvaz",
    options: [
      "Přitlačíme na ni čistý kapesník nebo obvaz",
      "Necháme ji volně krvácet a nic neděláme",
      "Zasypeme ji pískem",
      "Umažeme ji blátem",
    ],
    emoji: "🩹",
    hints: [
      "Krvácení zastavíme jemným přitlačením čisté látky.",
      "Písek a bláto by ránu jen zanesly.",
    ],
    solutionSteps: ["Na krvácející ranu přitlačíme čistý kapesník nebo obvaz — přítlak pomůže krvácení zastavit. Písek ani bláto na ránu nepatří."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Kamarád tvrdí, že záchrannou službu voláš na číslo 158. Jak to opravíš?",
    correctAnswer: "Záchranná služba je 155; 158 je číslo policie",
    options: [
      "Záchranná služba je 155; 158 je číslo policie",
      "Kamarád má pravdu, záchranka je 158",
      "Záchranná služba je 150, ne 155",
      "Záchranka žádné číslo nemá",
    ],
    emoji: "🚑",
    hints: [
      "Rozliš dvě blízká čísla — jedno je záchranka, druhé policie.",
      "155 = zdraví, 158 = policie.",
    ],
    solutionSteps: ["Kamarád se plete — záchranná služba má číslo 155, kdežto 158 patří policii. Čísla se snadno zamění, proto je dobré je znát přesně."],
  },
  {
    question: "V čem se liší, kdy voláš 150 a kdy 155?",
    correctAnswer: "150 voláme hasičům, když hoří; 155 záchrance, když je někdo zraněný nebo nemocný",
    options: [
      "150 voláme hasičům, když hoří; 155 záchrance, když je někdo zraněný nebo nemocný",
      "150 i 155 je to samé číslo",
      "150 je záchranka a 155 hasiči",
      "Obě čísla voláme jen při krádeži",
    ],
    emoji: "🆘",
    hints: [
      "Jedno číslo je k ohni, druhé ke zdraví.",
      "Nespleť si, které patří hasičům a které záchrance.",
    ],
    solutionSteps: ["Číslo 150 patří hasičům a voláme ho, když hoří. Číslo 155 patří záchrance a voláme ho, když je někdo zraněný nebo nemocný. Každé slouží k něčemu jinému."],
  },
  {
    question: "Proč je při volání pomoci důležité umět říct, kde přesně se nacházíme?",
    correctAnswer: "Aby záchranáři věděli, kam mají přijet a našli nás",
    options: [
      "Aby záchranáři věděli, kam mají přijet a našli nás",
      "Aby si mohli cestou koupit svačinu",
      "Není to důležité, pomoc nás najde sama",
      "Aby věděli, jakou barvu má náš dům, kvůli soutěži",
    ],
    emoji: "📍",
    hints: [
      "Bez místa by pomoc nevěděla, kam jet.",
      "Spoj dvě věci: řeknu místo → pomoc mě najde.",
    ],
    solutionSteps: ["Místo je důležité proto, aby záchranáři věděli, kam přijet, a rychle nás našli. Kdyby nevěděli kde jsme, nemohli by přijet včas."],
  },
  {
    question: "Kamarád říká, že na krvácející ranu je nejlepší nasypat písek. Jak to opravíš?",
    correctAnswer: "Písek ránu zanese špínou; ránu je potřeba opláchnout čistou vodou a přitlačit čistý kapesník",
    options: [
      "Písek ránu zanese špínou; ránu je potřeba opláchnout čistou vodou a přitlačit čistý kapesník",
      "Kamarád má pravdu, písek je nejlepší",
      "Na ránu je nejlepší nasypat hlínu",
      "Ránu je nejlepší nechat úplně bez ošetření",
    ],
    emoji: "🩸",
    hints: [
      "Přemýšlej, co se s ranou stane, když do ní dáme písek.",
      "Ránu chceme čistit, ne špinit.",
    ],
    solutionSteps: ["Písek do rány nepatří — zanesl by ji špínou a bakteriemi. Ránu opláchneme čistou vodou a přitlačíme na ni čistý kapesník, aby se zastavilo krvácení."],
  },
  {
    question: "Proč na hlubokou nebo velkou ránu nestačí jen náplast doma?",
    correctAnswer: "Vážné zranění musí odborně ošetřit lékař v nemocnici",
    options: [
      "Vážné zranění musí odborně ošetřit lékař v nemocnici",
      "Protože náplasti dojdou",
      "Protože velká rána se sama zahojí za chvilku",
      "Není to pravda, náplast stačí vždy",
    ],
    emoji: "🏥",
    hints: [
      "Malá ranka = náplast doma; velká a hluboká rána potřebuje víc.",
      "Kdo se stará o hluboká zranění a kam se za ním chodí?",
    ],
    solutionSteps: ["Hlubokou nebo velkou ránu musí ošetřit lékař v nemocnici — má na to vybavení i znalosti. Samotná náplast doma na vážné zranění nestačí."],
  },
  {
    question: "Kamarád se hodně zranil a teče mu krev. Co uděláš správně jako první?",
    correctAnswer: "Přivolám dospělého a na ránu přitlačím čistý kapesník",
    options: [
      "Přivolám dospělého a na ránu přitlačím čistý kapesník",
      "Nejdřív si dojdu domů pro svačinu",
      "Nechám ho být a jdu si hrát",
      "Ránu posypu pískem a odejdu",
    ],
    emoji: "🚑",
    hints: [
      "Spoj dvě věci: přivolat pomoc a zastavit krvácení.",
      "Jde o vážnou věc — neodcházíme a neztrácíme čas.",
    ],
    solutionSteps: ["Při větším krvácení hned přivoláme dospělého a na ránu přitlačíme čistý kapesník, aby se krvácení zpomalilo. Neodcházíme a ránu nešpiníme."],
  },
  {
    question: "Číslo 112 funguje v celé Evropě, kdežto 155 hlavně u nás. Proč je dobré 112 znát?",
    correctAnswer: "Protože jím dovoláš pomoc i v cizí zemi, kde místní čísla neznáš",
    options: [
      "Protože jím dovoláš pomoc i v cizí zemi, kde místní čísla neznáš",
      "Protože 112 je zadarmo jen o víkendu",
      "Protože 112 funguje jen u nás doma",
      "Není k tomu žádný důvod, stačí 155",
    ],
    emoji: "🌍",
    hints: [
      "Kde všude 112 platí a kde bys jinak čísla neznal?",
      "Spoj dvě věci: cizí země → jedno číslo pro celou Evropu.",
    ],
    solutionSteps: ["Číslo 112 je dobré znát, protože funguje v celé Evropě. Když jsme v cizí zemi a neznáme tamní čísla, tímhle jedním se dovoláme pomoci."],
  },
  {
    question: "Proč na bouli přikládáme něco studeného, a ne teplého?",
    correctAnswer: "Chlad otok a bolest zmenší, kdežto teplo by je zvětšilo",
    options: [
      "Chlad otok a bolest zmenší, kdežto teplo by je zvětšilo",
      "Teplé i studené působí úplně stejně",
      "Studené bouli nepomáhá vůbec",
      "Teplé bouli pomáhá víc než studené",
    ],
    emoji: "🧊",
    hints: [
      "Porovnej, co dělá chlad a co teplo s otokem.",
      "Vzpomeň si, proč se na naraženiny dává led.",
    ],
    solutionSteps: ["Na bouli dáváme studený obklad, protože chlad zmírní otok i bolest. Teplo by prokrvení zvětšilo a otok by byl větší — proto se nehodí."],
  },
  {
    question: "Kamarád spadl, nehýbe se a je mu špatně. Je to malá, nebo vážná věc a co uděláš?",
    correctAnswer: "Je to vážné — hned přivolám dospělého a záchrannou službu 155",
    options: [
      "Je to vážné — hned přivolám dospělého a záchrannou službu 155",
      "Je to maličkost — jen mu dám náplast",
      "Je to maličkost — počkám, až se to zítra zlepší",
      "Je to vážné, ale nikomu nic neřeknu",
    ],
    emoji: "🆘",
    hints: [
      "Když se někdo nehýbe a je mu zle, není to drobnost.",
      "Spoj dvě věci: rozpoznat vážnou situaci → přivolat pomoc.",
    ],
    solutionSteps: ["Když se kamarád nehýbe a je mu špatně, jde o vážnou situaci. Hned přivoláme dospělého a záchrannou službu 155 — nečekáme a neřešíme to sami."],
  },
  {
    question: "Proč nejdřív sháníme dospělého, i když sami známe tísňová čísla?",
    correctAnswer: "Dospělý líp posoudí, co se stalo, a dokáže pomoc lépe zvládnout",
    options: [
      "Dospělý líp posoudí, co se stalo, a dokáže pomoc lépe zvládnout",
      "Protože děti nesmí nikdy nikomu pomáhat",
      "Protože tísňová čísla fungují jen dospělým",
      "Není důvod, dospělý je zbytečný",
    ],
    emoji: "🧑‍🚒",
    hints: [
      "Kdo dokáže líp odhadnout, jak vážná situace je?",
      "Znát čísla je dobré, ale dospělý pomůže situaci zvládnout.",
    ],
    solutionSteps: ["Dospělého sháníme proto, že líp posoudí, co se stalo, a pomoc zvládne lépe než malé dítě. Tísňová čísla přitom umíme, kdyby dospělý nablízku nebyl."],
  },
  {
    question: "Kterou složku voláš, když zároveň hoří a je i zraněný člověk, a nevíš, co dřív?",
    correctAnswer: "Zavolám 112 — jedno číslo, přes které pošlou hasiče i záchranku",
    options: [
      "Zavolám 112 — jedno číslo, přes které pošlou hasiče i záchranku",
      "Nezavolám nikam a počkám, co se stane",
      "Zavolám jen pekaře, ať poradí",
      "Budu volat pořád dokola jen jedno číslo a druhé neřeším",
    ],
    emoji: "📞",
    hints: [
      "Existuje jedno číslo, které umí poslat víc složek najednou.",
      "112 spojí pomoc i tam, kde je potřeba hasič i záchranka.",
    ],
    solutionSteps: ["Když je potřeba víc složek najednou, vytočíme 112 — operátor pošle hasiče i záchranku. Nemusíme řešit, které číslo dřív, a hlavně voláme o pomoc a jdeme do bezpečí."],
  },
  {
    question: "Proč je dobré umět tísňová čísla zpaměti, i když je máš doma napsaná na lednici?",
    correctAnswer: "V nouzi nemusíš být doma u lednice a čas rychle rozhoduje",
    options: [
      "V nouzi nemusíš být doma u lednice a čas rychle rozhoduje",
      "Protože napsaná čísla nikdy nefungují",
      "Není to potřeba, čísla si vždycky stihneš v klidu najít",
      "Protože zpaměti fungují jen o víkendu",
    ],
    emoji: "🧠",
    hints: [
      "Kde všude se úraz může stát a stihneš tam hledat napsaná čísla?",
      "Spoj dvě věci: úraz se stane kdekoli a rozhoduje rychlost.",
    ],
    solutionSteps: ["Čísla umíme zpaměti proto, že úraz se může stát kdekoli, ne jen doma u lednice, a v nouzi rozhoduje čas. Hledání lístečku by nás zbytečně zdrželo."],
  },
  {
    question: "Odřel sis koleno a ranka je zanesená hlínou. V jakém pořadí to uděláš správně?",
    correctAnswer: "Nejdřív ranku opláchnu čistou vodou, pak přelepím náplastí a řeknu to dospělému",
    options: [
      "Nejdřív ranku opláchnu čistou vodou, pak přelepím náplastí a řeknu to dospělému",
      "Nejdřív přelepím náplastí i s hlínou, mýt netřeba",
      "Ranku nechám špinavou a zasypu ji pískem",
      "Nejdřív ji umažu blátem a pak přelepím",
    ],
    emoji: "🧴",
    hints: [
      "Špínu z rány je potřeba nejdřív odstranit — čím?",
      "Spoj kroky ve správném pořadí: umýt → přelepit → říct dospělému.",
    ],
    solutionSteps: ["Nejdřív ranku opláchneme čistou vodou, aby v ní nezůstala hlína, pak ji přelepíme náplastí a řekneme to dospělému. Přelepit náplast přes špínu nebo zasypat ránu pískem není správně."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const DROBNAPORANENITISNOVELINKY: TopicMetadata[] = [
  {
    id: "g2-prv-prvni-pomoc",
    rvpNodeId: "g2-prvouka-clovek-a-jeho-zdravi-prevence-a-prvni-pomoc-drobna-poraneni-privolani-pomoci-tisnove-linky",
    title: "Drobná poranění, přivolání pomoci, tísňové linky",
    studentTitle: "První pomoc",
    subject: "prvouka",
    category: "Člověk a jeho zdraví",
    topic: "Prevence a první pomoc",
    briefDescription: "Co dělat při úrazu a kam volat.",
    keywords: ["první pomoc", "úraz", "záchranka", "hasiči", "policie", "tísňová linka"],
    goals: [
      "Znát tísňová čísla: 155, 150, 158, 112.",
      "Vědět, co dělat při drobném úrazu.",
      "Umět přivolat pomoc dospělého.",
    ],
    boundaries: ["Pouze základy.", "Bez složitého ošetřování."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Záchranka 155, hasiči 150, policie 158, tísňové 112.",
      steps: ["Přečti otázku.", "Vzpomeň si na správné číslo nebo pomoc."],
      commonMistake: "Záměna tísňových čísel — záchranka je 155.",
      example: "Když se někdo zraní, voláme záchranku na číslo 155.",
    },
  },
];
