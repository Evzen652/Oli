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
    question: "Které otázky musí zodpovědět úplné sdělení?",
    correctAnswer: "kdo, co, kde, kdy, proč, jak",
    options: [
      "jen kdo a co se stalo",
      "kdo, co, kde, kdy, proč, jak",
      "jen kdy a kde se to koná",
      "jen proč a jak se to stalo",
    ],
    hints: ["Zkus si vzpomenout, na kolik různých věcí se ptá novinář, když píše zprávu o události."],
    explanation: "Sdělení je úplné, když čtenáři nezůstane žádná z těch šesti otázek bez odpovědi. Vynechat kteroukoli z nich znamená, že si adresát bude muset domýšlet.",
  },
  {
    question: "Je tato zpráva úplná? 'Přijdu pozdě.'",
    correctAnswer: "ne, chybí proč a jak moc",
    options: [
      "ano, je to dostatečné",
      "ne, chybí proč a jak moc",
      "ano, v SMS to stačí",
      "ne, chybí jen podpis",
    ],
    hints: ["Kdybys tohle dostal, věděl bys, o kolik minut se máš zpozdit, nebo z jakého důvodu?"],
    explanation: "Příjemce se dozví jen to, že se něco změnilo, ale ne o kolik ani proč. Nemůže se tedy zařídit — a právě to je znak neúplného sdělení.",
  },
  {
    question: "Je tato zpráva úplná? 'Schůzka v úterý v 15:00 ve škole.'",
    correctAnswer: "skoro, chybí jen téma",
    options: [
      "je zcela úplná",
      "skoro, chybí jen téma",
      "je zcela neúplná",
      "chybí čas i místo",
    ],
    hints: ["Zkontroluj: víš KDY a KDE se to koná. Ale víš taky, O ČEM to bude?"],
    explanation: "Kdy i kde ve zprávě je, takže se dá dorazit. Chybí ale, o čem se bude jednat — a bez toho se člověk nemůže připravit.",
  },
  {
    question: "Co chybí ve vzkazu 'Zavolej mi!'?",
    correctAnswer: "kdo volal a proč",
    options: [
      "nic, je to dost",
      "kdo volal a proč",
      "jen přesný čas",
      "jen adresa domů",
    ],
    hints: ["Najdeš tenhle lísteček na stole. Komu vlastně máš volat?"],
    explanation: "Bez jména příjemce netuší, komu se ozvat, a bez důvodu neví, jak naléhavé to je. Chybí tedy dvě ze šesti základních otázek naráz.",
  },
  {
    question: "Co chybí ve zprávě 'Přijela maminka z Brna.'?",
    correctAnswer: "kdy přijela",
    options: [
      "nic, je to úplné",
      "kdy přijela",
      "adresa v Brně",
      "způsob dopravy",
    ],
    hints: ["Kdo i co ve zprávě je. Která z otázek zůstala bez odpovědi?"],
    explanation: "Zpráva říká kdo a co, ale ne kdy. Bez času nepoznáš, jestli je informace čerstvá, nebo týden stará.",
  },
  {
    question: "Pro koho je sdělení 'Třídní schůzka je zrušena.' úplné?",
    correctAnswer: "pro toho, kdo znal termín",
    options: [
      "pro úplně každého",
      "pro toho, kdo znal termín",
      "pro nikoho z rodičů",
      "jen pro učitele",
    ],
    hints: ["Rodič, který o schůzce věděl, a člověk, který o ní slyší poprvé — potřebují oba stejné informace?"],
    explanation: "Kdo termín znal, ten si zprávu doplní z paměti a nic mu nechybí. Pro nezasvěceného je neúplná — nedozví se, co vlastně bylo zrušeno.",
  },
  {
    question: "Jak poznáš neúplné sdělení?",
    correctAnswer: "zbývají ti otázky",
    options: [
      "je kratší než věta",
      "zbývají ti otázky",
      "neobsahuje sloveso",
      "nemá podpis autora",
    ],
    hints: ["Dočteš zprávu. Podle čeho poznáš, že něco chybí, aniž bys počítal slova?"],
    explanation: "Zkouška je jednoduchá: po přečtení si projdi šest otázek. Pokud na některou neumíš odpovědět, sdělení je neúplné. Délka o tom nerozhoduje.",
  },
  {
    question: "Je pozvánka 'Přijď na oslavu!' úplná?",
    correctAnswer: "ne, chybí kdy, kde a čí",
    options: [
      "ano, stačí to takhle",
      "ne, chybí kdy, kde a čí",
      "chybí jen jméno hostitele",
      "chybí jen co přinést",
    ],
    hints: ["Zkus si představit, že tuhle pozvánku dostaneš — věděl bys, kam a v kolik máš přijít?"],
    explanation: "Z pozvánky se dá vyčíst jen to, že se něco koná. Bez data, místa a oslavence se pozvaný nemá jak zařídit.",
  },
  {
    question: "Co musí obsahovat úplná pozvánka na oslavu?",
    correctAnswer: "kdo slaví, kdy a kde",
    options: [
      "jen jméno oslavence",
      "kdo slaví, kdy a kde",
      "jen datum oslavy",
      "jen adresu bydliště",
    ],
    hints: ["Tři údaje, bez kterých se pozvaný nedostaví na správné místo ve správný čas."],
    explanation: "Pozvánka musí odpovědět na kdo, kdy a kde naráz. Kterýkoli z těch údajů zvlášť pozvanému ke splnění úkolu nestačí.",
  },
  {
    question: "Ve zprávě 'Ukliď pokoj!' chybí:",
    correctAnswer: "do kdy to má být",
    options: [
      "nic, je to jasné",
      "do kdy to má být",
      "adresa toho pokoje",
      "kdo to nařizuje",
    ],
    hints: ["Úkol je srozumitelný, ale kdy ho máš splnit — hned, nebo do večera?"],
    explanation: "Co se má udělat, je jasné. Chybí ale termín, takže se dá splnit i za týden a formálně to bude v pořádku.",
  },
  {
    question: "Proč je důležité, aby sdělení bylo úplné?",
    correctAnswer: "aby adresát mohl jednat",
    options: [
      "aby byl text delší",
      "aby adresát mohl jednat",
      "aby to znělo slušně",
      "jen u psané zprávy",
    ],
    hints: ["K čemu je zpráva, po které příjemce pořád neví, co má dělat?"],
    explanation: "Smyslem sdělení je, aby příjemce věděl, co se děje a co se od něj čeká. Neúplná zpráva vede k chybné reakci nebo k dalšímu doptávání.",
  },
  {
    question: "Co chybí ve školní omluvence 'Dítě bude chybět.'?",
    correctAnswer: "jméno, třída, datum, důvod",
    options: [
      "nic, to je dostatečné",
      "jméno, třída, datum, důvod",
      "jen datum absence",
      "jen jméno třídy",
    ],
    hints: ["Škola má stovky žáků. Co všechno potřebuje vědět, aby absenci vůbec zapsala?"],
    explanation: "Bez jména a třídy škola nepozná, o koho jde, bez data neví, co zapsat, a bez důvodu nemůže absenci uznat. Chybí tedy všechno podstatné.",
  },
  {
    question: "Je sdělení 'Zítra ve 14:00 v tělocvičně.' úplné?",
    correctAnswer: "ne, chybí co a pro koho",
    options: [
      "ano, to úplně stačí",
      "ne, chybí co a pro koho",
      "chybí jen přesný čas",
      "chybí jen jméno školy",
    ],
    hints: ["Kdy i kde ve sdělení je. Co ti ještě chybí, abys věděl, jestli se to týká tebe?"],
    explanation: "Čas a místo jsou uvedené, ale ne akce ani její účastníci. Čtenář tak neví, jestli má přijít právě on.",
  },
  {
    question: "Co je klíčové v mimořádném hlášení?",
    correctAnswer: "co se děje a co dělat",
    options: [
      "datum a čas hlášení",
      "co se děje a co dělat",
      "jméno oznamovatele",
      "délka celého hlášení",
    ],
    hints: ["Při varování jde o vteřiny. Co musí posluchač slyšet jako první?"],
    explanation: "V nouzi potřebuje člověk vědět, co hrozí a jak se zachovat. Ostatní údaje se dají doplnit později, tyhle dva ne.",
  },
  {
    question: "Je hlášení 'Unikl plyn, nebezpečí.' úplné?",
    correctAnswer: "ne, chybí kde a co dělat",
    options: [
      "ano, je to naléhavé",
      "ne, chybí kde a co dělat",
      "chybí jméno toho, kdo hlásí",
      "chybí jen přesný čas úniku",
    ],
    hints: ["Slyšíš to z rozhlasu. Víš, jestli se máš schovat doma, nebo utíkat pryč?"],
    explanation: "Varování zní naléhavě, ale posluchač netuší, kde nebezpečí je ani jak se zachovat. Právě to jsou u mimořádné události nejdůležitější údaje.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co je neúplné ve sdělení 'Přijď do kina.'?",
    correctAnswer: "které kino, kdy, na co",
    options: [
      "nic, je to srozumitelné",
      "které kino, kdy, na co",
      "chybí jenom datum",
      "chybí jenom čas",
    ],
    hints: ["Projdi si postupně kde, kdy a co. Na kolik z nich umíš odpovědět?"],
    explanation: "Ze zprávy nevyplývá ani místo, ani čas, ani program. Zbývají tedy tři otázky bez odpovědi, ne jedna.",
  },
  {
    question: "Je sdělení 'Prosím, kupte mléko.' úplné?",
    correctAnswer: "skoro, chybí kolik a jaké",
    options: [
      "ano, je to dostatečné",
      "skoro, chybí kolik a jaké",
      "je zcela neúplné",
      "chybí jméno obchodu",
    ],
    hints: ["Kdybys šel podle téhle zprávy nakoupit, věděl bys, kolik kusů a který druh máš vzít?"],
    explanation: "Úkol je jasný, ale v obchodě narazíš na množství a druh. Zpráva tedy není nepoužitelná, jen nedotažená.",
  },
  {
    question: "Proč může být sdělení úplné pro jednoho a pro druhého ne?",
    correctAnswer: "liší se jejich znalosti",
    options: [
      "liší se délkou zprávy",
      "liší se jejich znalosti",
      "sdělení je vždy stejné",
      "liší se jen jazykem",
    ],
    hints: ["Zpráva je pro oba stejná. Co je tedy na jejich straně jinak?"],
    explanation: "Kdo zná souvislosti, doplní si chybějící údaje z paměti. Pro nezasvěceného ta samá zpráva zůstane neúplná. Úplnost proto závisí i na adresátovi.",
  },
  {
    question: "Co musí obsahovat novinová zpráva o nehodě?",
    correctAnswer: "co, kde, kdy a příčina",
    options: [
      "jen popis samotné nehody",
      "co, kde, kdy a příčina",
      "jen jméno řidiče",
      "jen fotografie z místa",
    ],
    hints: ["Čtenář noviny otevře a o události neví nic. Co všechno se musí dozvědět?"],
    explanation: "Zpravodajská zpráva má odpovědět na základní otázky naráz. Samotná fotografie ani jméno účastníka událost nevysvětlí.",
  },
  {
    question: "Jak poznáme, že zpráva potřebuje doplnění?",
    correctAnswer: "zbývají otázky bez odpovědi",
    options: [
      "zpráva má méně než pět slov",
      "zbývají otázky bez odpovědi",
      "zpráva neobsahuje sloveso",
      "zpráva nemá podpis",
    ],
    hints: ["Existuje krátká zpráva, která je úplná? A dlouhá, která není?"],
    explanation: "Rozhoduje jen to, jestli po přečtení něco nevíš. Počet slov ani stavba věty s úplností nesouvisí.",
  },
  {
    question: "Je SMS 'Jdu domů, budu ve 4.' úplná?",
    correctAnswer: "v rodině je srozumitelná",
    options: [
      "je vždy zcela neúplná",
      "v rodině je srozumitelná",
      "je úplná pro kohokoli",
      "chybí v ní jméno",
    ],
    hints: ["Doma všichni vědí, o jaké čtvrté hodině je řeč. Platilo by to i pro cizího člověka?"],
    explanation: "Mezi lidmi, kteří sdílejí souvislosti, taková zpráva funguje. Mimo rodinu by 've 4' bylo nejednoznačné — úplnost tedy závisí na adresátovi.",
  },
  {
    question: "Co chybí ve sdělení 'Výlet je v pátek.'?",
    correctAnswer: "kam, sraz, co s sebou",
    options: [
      "nic, stačí samo datum",
      "kam, sraz, co s sebou",
      "jen přesný čas srazu",
      "jen jméno organizátora",
    ],
    hints: ["Máš zítra vyrazit. Co všechno potřebuješ vědět, abys ráno vyšel z domu správně vybavený?"],
    explanation: "Datum samo o sobě nestačí — bez cíle, místa a času srazu a seznamu vybavení se na výlet nedá připravit.",
  },
  {
    question: "Která informace je ve sdělení nepotřebná?",
    correctAnswer: "nepomůže k porozumění",
    options: [
      "je vždy na konci textu",
      "nepomůže k porozumění",
      "je to jméno odesílatele",
      "je vždy ta nejdelší",
    ],
    hints: ["Zkus údaj z věty vyškrtnout. Ztratí tím zpráva něco podstatného?"],
    explanation: "Nadbytečná je informace, po jejímž vypuštění se nic nezmění na tom, co adresát pochopí a udělá. Pozice ani délka o tom nerozhodují.",
  },
  {
    question: "Co je neúplné na titulku 'Požár v Praze.'?",
    correctAnswer: "kde přesně, kdy, zranění",
    options: [
      "nic, titulek je zkratka",
      "kde přesně, kdy, zranění",
      "chybí jen přesná hodina",
      "chybí jen jméno hasičů",
    ],
    hints: ["Praha je velká. Co všechno se čtenář z titulku nedozví?"],
    explanation: "Titulek smí být zkrácený, ale sám o sobě je neúplný — chybí místo, čas i následky. Ty musí doplnit článek pod ním.",
  },
  {
    question: "Co je cílem úplného sdělení?",
    correctAnswer: "předat vše bez doptávání",
    options: [
      "napsat co nejkratší text",
      "předat vše bez doptávání",
      "napsat co nejdelší text",
      "zaujmout hezkým slohem",
    ],
    hints: ["Podle čeho poznáš, že se zpráva povedla — podle délky, nebo podle reakce příjemce?"],
    explanation: "Sdělení splnilo svůj účel, když adresát ví, co se děje, a nemusí se na nic doptávat. Délka je jen prostředek.",
  },
  {
    question: "Co chybí v oznámení 'Suplování zítra.'?",
    correctAnswer: "které hodiny a která třída",
    options: [
      "nic, to je srozumitelné",
      "které hodiny a která třída",
      "chybí jen přesná hodina",
      "chybí jen jméno učitele",
    ],
    hints: ["Kdybys to oznámení četl, poznal bys, jestli se týká tvé třídy a tvých hodin?"],
    explanation: "Bez určení třídy a hodin se žák nedozví, jestli se ho oznámení vůbec týká. Samotné 'zítra' je pro rozhodnutí nepoužitelné.",
  },
  {
    question: "Sdělení je přiměřeně úplné, pokud:",
    correctAnswer: "adresát může jednat",
    options: [
      "má aspoň padesát slov",
      "adresát může jednat",
      "obsahuje datum a podpis",
      "je delší než odstavec",
    ],
    hints: ["Nejde o formu ani rozsah. Podle čeho se pozná, že zpráva stačí?"],
    explanation: "Měřítkem je použitelnost: příjemce se podle zprávy dokáže zařídit, aniž by se musel ptát. Formální náležitosti to nenahradí.",
  },
  {
    question: "Co chybí ve sdělení 'Přijďte na zahájení školního roku.'?",
    correctAnswer: "datum, čas a místo",
    options: [
      "nic, sdělení je jasné",
      "datum, čas a místo",
      "chybí jen školní rok",
      "chybí jen jméno ředitele",
    ],
    hints: ["Co se koná, víš. Co potřebuješ navíc, abys tam skutečně dorazil?"],
    explanation: "Akce je pojmenovaná, ale bez tří organizačních údajů se pozvaný nedostaví. Právě ty ze sdělení chybí.",
  },
  {
    question: "Jak by znělo úplné oznámení o třídní schůzce?",
    correctAnswer: "Schůzka v úterý 10. 6. v 17:00 v učebně 3A.",
    options: [
      "Schůzka se brzy uskuteční.",
      "Schůzka v úterý 10. 6. v 17:00 v učebně 3A.",
      "Přijďte prosím na schůzku.",
      "Schůzka proběhne ve škole.",
    ],
    hints: ["Porovnej možnosti: ze které se rodič dozví den, hodinu i místnost naráz?"],
    explanation: "Jediná varianta uvádí datum, čas i konkrétní místnost. Ostatní jsou zdvořilé, ale rodič se podle nich nemá jak zařídit.",
  },
  {
    question: "Co chybí ve varování 'Varujeme před žíravinou.'?",
    correctAnswer: "kde je a co dělat",
    options: [
      "nic, varování je jasné",
      "kde je a co dělat",
      "chybí jen popis té látky",
      "chybí jen jméno výrobce",
    ],
    hints: ["Víš, co hrozí. Co ještě musíš vědět, aby ses tomu vyhnul?"],
    explanation: "Varování pojmenuje nebezpečí, ale neřekne, kde se nachází ani jak se zachovat. Bez toho nemá praktickou hodnotu.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jaký je rozdíl mezi úplností a přesností sdělení?",
    correctAnswer: "úplnost = vše, přesnost = bez chyb",
    options: [
      "přesnost = vše, úplnost = bez chyb",
      "úplnost = vše, přesnost = bez chyb",
      "obojí znamená totéž",
      "přesnost je délka textu",
    ],
    hints: ["Může mít zpráva všechny údaje, a přesto být k ničemu? Co by na ní bylo špatně?"],
    explanation: "Úplné sdělení má všechny potřebné údaje, přesné je má správně. Zpráva s chybným datem je úplná, ale nepřesná — a proto stejně nefunguje.",
  },
  {
    question: "Jak se říká informaci, která ve sdělení nic nepřidá?",
    correctAnswer: "nadbytečná",
    options: [
      "nezbytná",
      "nadbytečná",
      "přesná",
      "chybějící",
    ],
    hints: ["Předpona 'nad-' napovídá. Je toho víc, než je potřeba, nebo míň?"],
    explanation: "Nadbytečný údaj se dá vypustit, aniž by se cokoli změnilo na tom, co adresát pochopí. Přemíra takových údajů sdělení naopak znepřehlední.",
  },
  {
    question: "Proč jsou otázky 'kdo' a 'co' nejdůležitější?",
    correctAnswer: "bez nich nechápeme nic dalšího",
    options: [
      "protože jsou nejkratší",
      "bez nich nechápeme nic dalšího",
      "platí to jen v novinách",
      "protože se píší první",
    ],
    hints: ["Zkus si představit zprávu, kde víš kdy a kde, ale ne kdo a co. Dá se z ní něco vyčíst?"],
    explanation: "Čas a místo dávají smysl jen tehdy, když víš, o kom a o čem je řeč. Ostatní údaje se na tyhle dvě otázky vážou.",
  },
  {
    question: "Co je nejdůležitější ve sdělení pro záchranáře?",
    correctAnswer: "kde to je a co se stalo",
    options: [
      "jméno toho, kdo volá",
      "kde to je a co se stalo",
      "přesné datum a čas",
      "délka celého hovoru",
    ],
    hints: ["Posádka musí okamžitě vyjet. Bez čeho se ani nehne z místa?"],
    explanation: "Bez místa nemá kam jet a bez popisu situace neví, koho a s čím vyslat. Ostatní údaje se dají doplnit cestou.",
  },
  {
    question: "Jak se liší úplnost SMS a úředního dokumentu?",
    correctAnswer: "SMS je kratší a neformální",
    options: [
      "SMS je delší a formální",
      "SMS je kratší a neformální",
      "obojí je stejně formální",
      "liší se jen adresátem",
    ],
    hints: ["Píšeš známému a píšeš úřadu. U kterého si můžeš dovolit spoléhat na to, že si zbytek domyslí?"],
    explanation: "V SMS mezi známými stačí náznak, protože souvislosti oba znají. Úřední dokument musí být srozumitelný i pro někoho, kdo o věci neví nic.",
  },
  {
    question: "Co chybí cestujícímu ve sdělení 'Let OK401 je zpožděný.'?",
    correctAnswer: "o kolik a odkud poletí",
    options: [
      "nic, to je dostatečné",
      "o kolik a odkud poletí",
      "chybí jen název společnosti",
      "chybí jen jméno kapitána",
    ],
    hints: ["Stojíš na letišti. Co potřebuješ vědět, abys věděl, kde a jak dlouho čekat?"],
    explanation: "Cestující se dozví, že se něco změnilo, ale ne o kolik ani odkud se poletí. Právě podle toho by se přitom rozhodoval, co dělat.",
  },
  {
    question: "Proč může neúplné sdělení způsobit problém?",
    correctAnswer: "adresát zareaguje špatně",
    options: [
      "text je tím delší",
      "adresát zareaguje špatně",
      "neúplnost nikdy nevadí",
      "zpráva dojde později",
    ],
    hints: ["Co udělá člověk, kterému v pokynu chybí místo — počká, nebo si domyslí špatné?"],
    explanation: "Když údaj chybí, příjemce si ho domyslí — a často špatně. Dorazí jinam, jindy, nebo neudělá nic. Chyba přitom vznikla už u odesílatele.",
  },
  {
    question: "Jak doplníme neúplné sdělení?",
    correctAnswer: "zeptáme se nebo ověříme",
    options: [
      "chybějící část si domyslíme",
      "zeptáme se nebo ověříme",
      "zprávu raději zahodíme",
      "neúplnost přehlédneme",
    ],
    hints: ["Domýšlet si znamená hádat. Co je spolehlivější?"],
    explanation: "Jediný bezpečný postup je chybějící údaj zjistit — dotazem u odesílatele nebo z jiného zdroje. Domýšlení vede k témuž problému jako neúplnost sama.",
  },
  {
    question: "Proč jsou formální dopisy tak podrobné?",
    correctAnswer: "aby nešly vyložit dvojím způsobem",
    options: [
      "aby byly co nejdelší",
      "aby nešly vyložit dvojím způsobem",
      "aby vypadaly úředně",
      "nařizuje to zákon",
    ],
    hints: ["Úřední dopis čte často někdo, kdo se odesílatele nemůže doptat. Co z toho plyne?"],
    explanation: "Formální text musí obstát sám o sobě, bez možnosti upřesnění. Proto se v něm nic nenechává na domýšlení — každá nejednoznačnost by mohla vést ke sporu.",
  },
  {
    question: "Kolik informací má dobré sdělení obsahovat?",
    correctAnswer: "tolik, kolik je třeba",
    options: [
      "co nejvíc, pro jistotu",
      "tolik, kolik je třeba",
      "co nejmíň, ať je krátké",
      "vždy stejně jako ostatní",
    ],
    hints: ["Co se stane, když do zprávy nacpeš úplně všechno? A když z ní naopak vyškrtáš, co jde?"],
    explanation: "Úplnost neznamená obsáhlost. Zpráva má obsahovat vše potřebné a nic navíc — přemíra údajů to podstatné zakryje stejně spolehlivě jako jejich nedostatek.",
  },
  {
    question: "Které sdělení je nejúplnější pro školní nástěnku?",
    correctAnswer: "Schůzka: úterý 10. 6., 17:00, třída 5A.",
    options: [
      "Schůzka se bude konat.",
      "Schůzka: úterý 10. 6., 17:00, třída 5A.",
      "Třídní schůzka v úterý.",
      "Přijďte ve čtvrtek.",
    ],
    hints: ["Nástěnku čte i rodič, který o ničem neví. Ze které varianty se dozví všechno naráz?"],
    explanation: "Jen jedna možnost uvádí den, datum, hodinu i třídu. Ostatní vyžadují, aby si čtenář zbytek zjistil jinde.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const POSUZOVANIUPLNOSTISDELENI: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-posuzovani-uplnosti-sdeleni",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-posuzovani-uplnosti-sdeleni",
    title: "Posuzování úplnosti sdělení",
    studentTitle: "Úplnost sdělení",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení a naslouchání",
    briefDescription: "Poznáš, jestli zpráva obsahuje všechny důležité informace.",
    keywords: ["úplnost sdělení", "komunikace", "kdo co kde kdy proč jak", "zpráva", "vzkaz"],
    goals: [
      "Posoudit, zda sdělení obsahuje všechny podstatné informace",
      "Určit, co ve sdělení chybí",
      "Doplnit neúplné sdělení",
    ],
    boundaries: [
      "Bez lingvistické analýzy komunikace",
      "Neprobíráme teorii komunikace podrobně",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Úplné sdělení odpovídá na: KDO? CO? KDE? KDY? PROČ? JAK? Přečti sdělení a zkontroluj, zda znáš odpovědi na všechny tyto otázky.",
      steps: [
        "Přečti sdělení.",
        "Zeptej se: Kdo? Co? Kde? Kdy? Proč? Jak?",
        "Pokud na některou otázku nemáš odpověď = sdělení je neúplné.",
        "Urči, co konkrétně chybí.",
      ],
      commonMistake: "Žáci si myslí, že krátká sdělení jsou vždy neúplná. Ale v kontextu může být i kratší sdělení úplné.",
      example: "'Přijdu v 15:00 ke škole.' = kdo (já), co (přijdu), kde (ke škole), kdy (v 15:00). Proč? chybí – ale v kontextu to nemusí vadit.",
    },
  },
];
