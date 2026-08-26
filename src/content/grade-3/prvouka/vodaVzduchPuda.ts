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
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: izolovaná fakta (výpar, oblaka, skupenství, pitná voda,
//                    kyslík, dusík, vznik půdy, život v půdě)
//   L2 = aplikace:   koloběh vody jako sled dějů, konkrétní šetření vodou,
//                    fotosyntéza jako využití CO2, znečištění vzduchu, eroze
//   L3 = transfer:   propojení 2 konceptů (dýchání ↔ fotosyntéza, eroze
//                    jako příčina-důsledek, chybějící krok koloběhu, voda/
//                    vzduch/půda jako základ potravního řetězce)
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Co se stane s vodou v rybníce, když ji celý den zahřívá slunce?",
    correctAnswer: "Vypaří se a stoupá jako neviditelná pára do vzduchu",
    options: [
      "Vypaří se a stoupá jako neviditelná pára do vzduchu",
      "Zůstane v rybníce úplně beze změny",
      "Promění se rovnou v led",
      "Vsákne se hluboko pod zem",
    ],
    hints: [
      "Vzpomeň si, co se děje s vodou v hrnci na sporáku, když ji zahříváš.",
      "Teplo mění vodu na neviditelnou páru, která stoupá vzhůru.",
    ],
    explanation: "Sluneční teplo mění vodu na neviditelnou vodní páru, která stoupá do vzduchu. Tomuto ději říkáme výpar a je to první krok koloběhu vody.",
  },
  {
    question: "Co se stane s vodou v louži po dešti, když na ni celé odpoledne svítí slunce?",
    correctAnswer: "Postupně se vypaří a promění se v páru",
    options: [
      "Postupně se vypaří a promění se v páru",
      "Zůstane stejně velká",
      "Promění se v led",
      "Změní se na sníh",
    ],
    hints: [
      "Louže po pár hodinách na slunci mizí — kam se voda poděla?",
      "Voda se nemůže ztratit, jen změní skupenství na páru.",
    ],
    explanation: "Teplo ze slunce způsobuje výpar — voda z louže se mění na vodní páru a stoupá do vzduchu, i když ji nevidíme.",
  },
  {
    question: "Co vznikne, když se stoupající vodní pára vysoko v atmosféře ochladí?",
    correctAnswer: "Oblaka — drobné kapičky vody",
    options: [
      "Oblaka — drobné kapičky vody",
      "Rovnou déšť bez oblaků",
      "Sníh, i v létě",
      "Duha",
    ],
    hints: [
      "Podívej se na oblohu — co tam vidíš bílé nebo šedé?",
      "Pára se ochladí a mění skupenství zpět na velmi malé částečky vody, které se vznášejí ve vzduchu.",
    ],
    explanation: "Vysoko v atmosféře je chladno, a tak se vodní pára mění zpět na drobné kapičky vody. Ty se shlukují a tvoří oblaka.",
  },
  {
    question: "Jak nazýváme drobné kapičky vody, které se vznášejí vysoko na obloze?",
    correctAnswer: "Oblaka",
    options: ["Oblaka", "Srážky", "Ledovce", "Mlha nad zemí"],
    hints: [
      "Je to to bílé nebo šedé na obloze.",
      "Vzniká z ochlazené vodní páry.",
    ],
    explanation: "Oblaka jsou tvořena drobnými kapičkami vody nebo ledovými krystalky vzniklými ochlazením vodní páry.",
  },
  {
    question: "Která tři skupenství vody známe?",
    correctAnswer: "Kapalné (voda), pevné (led) a plynné (pára)",
    options: [
      "Kapalné (voda), pevné (led) a plynné (pára)",
      "Teplé, studené a vlažné",
      "Mořské, říční a dešťové",
      "Pitné, užitkové a odpadní",
    ],
    hints: [
      "Vzpomeň si na led v mrazáku a páru nad hrncem.",
      "Skupenství popisuje, jak látka vypadá — ne k čemu se používá.",
    ],
    explanation: "Voda může být kapalná (voda v řece), pevná (led) nebo plynná (vodní pára).",
  },
  {
    question: "Ve kterém skupenství je led?",
    correctAnswer: "V pevném skupenství",
    options: [
      "V pevném skupenství",
      "V kapalném skupenství",
      "V plynném skupenství",
      "V žádném skupenství",
    ],
    hints: [
      "Led můžeš vzít do ruky a drží tvar.",
      "Pevná látka drží svůj tvar, na rozdíl od kapaliny nebo plynu.",
    ],
    explanation: "Led je voda v pevném skupenství — má stálý tvar, dokud ho nezahřejeme.",
  },
  {
    question: "Ve kterém skupenství je vodní pára?",
    correctAnswer: "V plynném skupenství",
    options: [
      "V plynném skupenství",
      "V pevném skupenství",
      "V kapalném skupenství",
      "Není to skupenství vody",
    ],
    hints: [
      "Pára nemá vlastní tvar a šíří se do prostoru.",
      "Plynné skupenství nevidíme, ale cítíme třeba vlhkost.",
    ],
    explanation: "Vodní pára je voda v plynném skupenství — je neviditelná a rozptyluje se ve vzduchu.",
  },
  {
    question: "Co je pitná voda?",
    correctAnswer: "Voda čistá a bezpečná, kterou můžeme pít",
    options: [
      "Voda čistá a bezpečná, kterou můžeme pít",
      "Voda z moře, která je slaná",
      "Voda, která teče jen z kohoutku",
      "Jakákoli voda v přírodě",
    ],
    hints: [
      "Pitná voda nesmí obsahovat škodlivé látky.",
      "Mořskou vodu pít nemůžeme — je slaná.",
    ],
    explanation: "Pitná voda je čistá a bezpečná pro lidský organismus. Voda z moře je slaná a k pití se nehodí.",
  },
  {
    question: "Proč potřebujeme kyslík ze vzduchu?",
    correctAnswer: "Bez kyslíku nemůžeme dýchat a žít",
    options: [
      "Bez kyslíku nemůžeme dýchat a žít",
      "Kyslík nám zahřívá tělo",
      "Kyslík nám dává energii jako jídlo",
      "Bez kyslíku bychom jen hůř viděli",
    ],
    hints: [
      "Co se stane, když se pořádně nadýchneš?",
      "Každá buňka v těle potřebuje kyslík.",
    ],
    explanation: "Kyslík přijímáme při dýchání do plic a krev ho rozvádí po celém těle. Bez kyslíku bychom zemřeli během několika minut.",
  },
  {
    question: "Která složka vzduchu tvoří jeho největší část?",
    correctAnswer: "Dusík",
    options: ["Dusík", "Kyslík", "Oxid uhličitý", "Vodní pára"],
    hints: [
      "Kyslík tvoří jen asi pětinu vzduchu.",
      "Tenhle plyn je neviditelný a s naším tělem skoro vůbec nereaguje — nedýcháme ho aktivně jako kyslík.",
    ],
    explanation: "Vzduch tvoří asi ze čtyř pětin dusík a z jedné pětiny kyslík. Zbytek jsou jiné plyny, například oxid uhličitý.",
  },
  {
    question: "Jak vzniká půda?",
    correctAnswer: "Rozkladem hornin a odumřelých rostlin a živočichů",
    options: [
      "Rozkladem hornin a odumřelých rostlin a živočichů",
      "Vysycháním mořské vody",
      "Smícháním písku s vodou",
      "Rostliny ji vyrábějí z listů",
    ],
    hints: [
      "Půda vzniká velmi pomalu — trvá to tisíce let.",
      "Co se děje s kameny, listím a mrtvými živočichy v přírodě?",
    ],
    explanation: "Půda vzniká velmi dlouho — horniny se drobí a rozpadají, odumřelé rostliny a živočichové se rozkládají. Z toho vzniká úrodná půda.",
  },
  {
    question: "Kdo žije v půdě a pomáhá ji kypřit?",
    correctAnswer: "Žížaly a drobné mikroorganismy",
    options: [
      "Žížaly a drobné mikroorganismy",
      "Ryby a raci",
      "Ptáci a motýli",
      "Houby a lišejníky na kamenech",
    ],
    hints: [
      "Po dešti je vidíš na chodníku — jsou růžové a dlouhé.",
      "Mikroorganismy jsou tak malé, že je nevidíme pouhým okem.",
    ],
    explanation: "Žížaly prokopávají půdu a provzdušňují ji. Mikroorganismy rozkládají odumřelé látky na živiny. Bez nich by půda nebyla úrodná.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Řeka teče, slunce ji zahřívá a nakonec zase prší do řeky. Jak se jmenuje celý tento sled dějů?",
    correctAnswer: "Koloběh vody",
    options: ["Koloběh vody", "Eroze půdy", "Fotosyntéza", "Znečištění vzduchu"],
    hints: [
      "Voda v přírodě stále koluje — výpar, oblaka, srážky, řeky, moře, a znovu dokola.",
      "Hledáš název pro opakující se cyklus, kterým tahle tekutina prochází v přírodě (výpar, oblaka, srážky, řeky).",
    ],
    explanation: "Voda se vypařuje z moří a řek, stoupá jako pára, tvoří oblaka, padá jako srážky a řekami se vrací zpět do moře. Celý tento opakující se sled dějů se nazývá koloběh vody.",
  },
  {
    question: "Sníh na horách taje, voda stéká potokem do řeky a řeka teče do moře. Co bude s touto vodou dál?",
    correctAnswer: "Vypaří se, vytvoří oblaka a znovu spadne jako srážky",
    options: [
      "Vypaří se, vytvoří oblaka a znovu spadne jako srážky",
      "Navždy zůstane jen v moři",
      "Promění se v led na dně moře",
      "Zmizí beze stopy",
    ],
    hints: [
      "Voda z moře nikde nemizí — co se s ní děje díky slunci?",
      "Vzpomeň si na celý koloběh vody, ne jen na jeho jednu část.",
    ],
    explanation: "Voda z moře se pod vlivem slunce vypařuje, stoupá jako pára, tvoří oblaka a znovu padá jako srážky. Koloběh vody se tak stále opakuje.",
  },
  {
    question: "Které pořadí správně popisuje koloběh vody?",
    correctAnswer: "Výpar → oblaka → srážky (déšť/sníh) → řeky → moře",
    options: [
      "Výpar → oblaka → srážky (déšť/sníh) → řeky → moře",
      "Srážky → výpar → moře → oblaka → řeky",
      "Oblaka → moře → výpar → řeky → srážky",
      "Řeky → srážky → moře → výpar → oblaka",
    ],
    hints: [
      "Vše začíná teplem slunce, které vodu mění na páru.",
      "Pára stoupá, ochladí se, a pak teprve padá dolů jako srážky.",
    ],
    explanation: "Koloběh vody vždy začíná výparem (slunce zahřívá vodu), pokračuje vznikem oblaků, pádem srážek a odtokem řekami zpět do moře.",
  },
  {
    question: "Při čištění zubů necháváš zbytečně téct vodu z kohoutku. Jak šetříš vodou správně?",
    correctAnswer: "Zavřu kohoutek, dokud si čistím zuby kartáčkem",
    options: [
      "Zavřu kohoutek, dokud si čistím zuby kartáčkem",
      "Nechám kohoutek pořád téct, ať mi nic neuteče",
      "Pustím vodu naplno, ať to rychle skončí",
      "Čistím si zuby déle, aby voda víc odtekla",
    ],
    hints: [
      "Voda teče zbytečně, i když ji zrovna nepotřebuješ.",
      "Kohoutek stačí pustit jen na opláchnutí kartáčku.",
    ],
    explanation: "Při čištění zubů stačí pustit vodu jen na namočení a opláchnutí kartáčku. Zavřený kohoutek mezitím ušetří mnoho litrů vody.",
  },
  {
    question: "Chceš umýt nádobí a přitom šetřit vodou. Co je nejlepší způsob?",
    correctAnswer: "Napustit dřez a mýt nádobí v něm, ne pod tekoucí vodou",
    options: [
      "Napustit dřez a mýt nádobí v něm, ne pod tekoucí vodou",
      "Nechat kohoutek téct po celou dobu mytí",
      "Umývat každý talíř zvlášť pod silným proudem",
      "Mýt nádobí venku na zahradě hadicí",
    ],
    hints: [
      "Tekoucí voda z kohoutku odtéká pryč, i když ji zrovna nevyužíváš.",
      "Voda ve dřezu se dá použít znovu na víc nádobí.",
    ],
    explanation: "Když napustíme dřez, spotřebujeme mnohem méně vody než při mytí pod stále tekoucím kohoutkem.",
  },
  {
    question: "Kdy je nejlepší zalévat zahradu, aby se šetřilo vodou?",
    correctAnswer: "Ráno nebo večer, kdy voda tolik nevysychá",
    options: [
      "Ráno nebo večer, kdy voda tolik nevysychá",
      "V poledne na plném slunci",
      "Kdykoli, na tom nezáleží",
      "Jen když prší",
    ],
    hints: [
      "V poledne slunce vodu z půdy rychle odpaří, než ji rostliny stihnou využít.",
      "Chladnější části dne jsou pro zálivku výhodnější.",
    ],
    explanation: "V poledne slunce hodně hřeje a velká část zalité vody se rychle vypaří, aniž by ji rostlina využila. Ráno nebo večer voda lépe vsákne do půdy.",
  },
  {
    question: "Doma ti kape kohoutek, i když je zavřený. Co bys měl udělat, abys šetřil vodou?",
    correctAnswer: "Upozornit dospělé, aby kohoutek opravili",
    options: [
      "Upozornit dospělé, aby kohoutek opravili",
      "Nechat to tak, kapka přece nic neznamená",
      "Pustit kohoutek naplno, ať přestane kapat",
      "Podložit umyvadlo kbelíkem a dál nic neřešit",
    ],
    hints: [
      "Kapající kohoutek ztratí za den hodně vody, i když to tak nevypadá.",
      "Nejlepší řešení je odstranit příčinu, ne jen sbírat kapající vodu.",
    ],
    explanation: "Kapající kohoutek zbytečně vyplýtvá velké množství vody za den. Nejlepší je závadu opravit, ne kapku jen sbírat.",
  },
  {
    question: "Rostlina přijímá ze vzduchu oxid uhličitý, vodu z kořenů a energii ze slunečního světla. K čemu jí to všechno slouží?",
    correctAnswer: "K fotosyntéze — výrobě vlastní potravy a kyslíku",
    options: [
      "K fotosyntéze — výrobě vlastní potravy a kyslíku",
      "K dýchání stejně jako u lidí",
      "K ochlazování listů v horku",
      "K nasávání živin z kamenů",
    ],
    hints: [
      "Rostliny si na rozdíl od lidí umí vyrábět vlastní potravu.",
      "Tento proces se jmenuje fotosyntéza.",
    ],
    explanation: "Při fotosyntéze rostlina pomocí slunečního světla přemění oxid uhličitý a vodu na cukry (svou potravu) a jako vedlejší produkt uvolní kyslík.",
  },
  {
    question: "Co vzniká jako vedlejší produkt fotosyntézy a rostlina to vydává do vzduchu?",
    correctAnswer: "Kyslík",
    options: ["Kyslík", "Oxid uhličitý", "Dusík", "Vodní pára jen v noci"],
    hints: [
      "Tento plyn potřebují lidé a zvířata k dýchání.",
      "Rostliny ho při fotosyntéze uvolňují jako vedlejší produkt.",
    ],
    explanation: "Při fotosyntéze rostliny spotřebovávají oxid uhličitý a jako vedlejší produkt uvolňují kyslík, který dýchají lidé a zvířata.",
  },
  {
    question: "Ve velkém městě je vzduch často znečištěný. Co ho znečišťuje nejvíc?",
    correctAnswer: "Výfukové plyny z aut a kouř z továren",
    options: [
      "Výfukové plyny z aut a kouř z továren",
      "Zpívání ptáků a šelest stromů",
      "Déšť a mlha",
      "Dýchání lidí a zvířat",
    ],
    hints: [
      "Zamysli se, co vidíš stoupat nad rušnou silnicí nebo komínem.",
      "Auta a továrny při spalování paliva vypouštějí škodlivé plyny.",
    ],
    explanation: "Auta a továrny spalují palivo a vypouštějí do vzduchu škodlivé plyny a saze. To je hlavní příčina znečištění vzduchu ve městech.",
  },
  {
    question: "Proč rostlina bez úrodné půdy dobře neroste?",
    correctAnswer: "Protože v půdě má kořeny, kterými čerpá vodu a živiny",
    options: [
      "Protože v půdě má kořeny, kterými čerpá vodu a živiny",
      "Protože půda rostlině dodává sluneční světlo",
      "Protože půda chrání rostlinu před deštěm",
      "Protože rostlina v půdě přes zimu spí",
    ],
    hints: [
      "Co dělají kořeny rostliny v zemi?",
      "Bez živin a vody z půdy by rostlina neměla co jíst.",
    ],
    explanation: "Kořeny drží rostlinu v zemi a zároveň z půdy čerpají vodu a živiny potřebné k růstu. Bez úrodné půdy by rostlina neměla dost výživy.",
  },
  {
    question: "Na kopci vykáceli les a přišel silný déšť. Půda se začala odplavovat pryč. Jak se tomuto jevu říká?",
    correctAnswer: "Eroze",
    options: ["Eroze", "Fotosyntéza", "Koloběh vody", "Znečištění"],
    hints: [
      "Je to odnášení půdy větrem nebo vodou.",
      "Stromy a jejich kořeny přitom obvykle půdu drží na místě.",
    ],
    explanation: "Eroze je odnášení půdy větrem nebo vodou. Bez stromů a rostlinného pokryvu, které půdu kořeny drží, se po silném dešti půda snadno odplavuje.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Živočichové při dýchání spotřebovávají kyslík a vydechují oxid uhličitý. Rostliny při fotosyntéze spotřebovávají oxid uhličitý a uvolňují kyslík. Proč se říká, že si rostliny a živočichové navzájem „vyměňují“ plyny?",
    correctAnswer: "Protože to, co jeden tvor vydechuje, druhý potřebuje k životu, a naopak",
    options: [
      "Protože to, co jeden tvor vydechuje, druhý potřebuje k životu, a naopak",
      "Protože živočichové i rostliny vydechují stejný plyn",
      "Protože rostliny přes den vůbec nedýchají",
      "Protože kyslík rostliny vůbec nepotřebují",
    ],
    hints: [
      "Co vydechuje člověk a co z toho rostlina využívá?",
      "Co vydává rostlina a co z toho využívá člověk?",
    ],
    explanation: "Živočichové dýcháním spotřebovávají kyslík a produkují oxid uhličitý, který následně rostliny využívají k fotosyntéze. Rostliny naopak při fotosyntéze uvolňují kyslík, který živočichové dýchají. Tak si navzájem „vyměňují“ plyny potřebné k životu.",
  },
  {
    question: "V akváriu jsou rybičky i vodní rostliny. Proč rostliny rybičkám ve dne pomáhají dýchat?",
    correctAnswer: "Protože ve dne díky fotosyntéze uvolňují do vody kyslík",
    options: [
      "Protože ve dne díky fotosyntéze uvolňují do vody kyslík",
      "Protože rostliny v noci vydávají víc kyslíku než ve dne",
      "Protože rostliny čistí vodu jako filtr, ale kyslík nevytvářejí",
      "Protože rybičky dýchají jen vzduch nad hladinou",
    ],
    hints: [
      "Vzpomeň si, co rostliny vyrábí, když na ně svítí světlo.",
      "Fotosyntéza probíhá jen za světla, ne ve tmě.",
    ],
    explanation: "Vodní rostliny při fotosyntéze (za světla) spotřebovávají oxid uhličitý a uvolňují kyslík do vody, který rybičky využívají k dýchání. V noci naopak samy dýchají a kyslík spotřebovávají.",
  },
  {
    question: "Na svahu vykáceli les a pole nechali holé. Přišel silný déšť. Co se s půdou nejspíš stane a proč?",
    correctAnswer: "Půda se odplaví, protože chybí kořeny stromů, které by ji držely na místě",
    options: [
      "Půda se odplaví, protože chybí kořeny stromů, které by ji držely na místě",
      "Nic se nestane, protože kořeny stromů erozi vůbec neovlivňují",
      "Půda se rychle vsákne do země a zmizí tam navždy",
      "Déšť půdu jen umyje, ale nic neodnese",
    ],
    hints: [
      "Přemýšlej, co běžně drží zeminu na svahu na místě, když prší — a co se stane, když to chybí.",
      "Bez rostlinného pokryvu má voda snadnou cestu půdu odnést pryč.",
    ],
    explanation: "Kořeny stromů a rostlin drží půdu pohromadě. Bez nich silný déšť půdu snadno odplaví — tomuto jevu se říká eroze. Proto je vykácení lesa na svahu rizikové.",
  },
  {
    question: "Co by se stalo s koloběhem vody, kdyby slunce vůbec nehřálo?",
    correctAnswer: "Voda by se nevypařovala, nevznikala by oblaka ani srážky",
    options: [
      "Voda by se nevypařovala, nevznikala by oblaka ani srážky",
      "Koloběh vody by fungoval úplně stejně jako předtím",
      "Pršelo by ještě víc než obvykle",
      "Všechna voda by rovnou zmrzla na led",
    ],
    hints: [
      "Co je úplně prvním krokem koloběhu vody, který způsobuje teplo ze slunce?",
      "Bez výparu se řetězec zastaví hned na začátku — bez oblak logicky nemůže následovat ani to, co z nich padá dolů.",
    ],
    explanation: "Bez slunečního tepla by se voda z moří a řek nevypařovala. Bez výparu by nevznikala vodní pára, tedy ani oblaka, a bez oblaků by nepršelo. Celý koloběh vody by se zastavil.",
  },
  {
    question: "Proč se říká, že voda, vzduch a půda jsou základem CELÉHO potravního řetězce, ne jen jednotlivých rostlin?",
    correctAnswer: "Protože bez nich by nevyrostly rostliny, kterými se živí živočichové, jimiž se živí další tvorové",
    options: [
      "Protože bez nich by nevyrostly rostliny, kterými se živí živočichové, jimiž se živí další tvorové",
      "Protože jen rostliny vodu, vzduch a půdu potřebují, zvířata ne",
      "Protože jen voda je opravdu důležitá, vzduch a půda tolik ne",
      "Protože potravní řetězec na vodě, vzduchu a půdě vůbec nezávisí",
    ],
    hints: [
      "Rostliny potřebují vodu, vzduch a půdu, aby vůbec vyrostly.",
      "Bez rostlin by se neměli čím živit býložravci — a bez nich ani masožravci.",
    ],
    explanation: "Rostliny potřebují vodu, vzduch a půdu k růstu. Bez rostlin by neměli co jíst býložravci, a bez býložravců by neměli co lovit masožravci. Celý potravní řetězec tak stojí na těchto třech základech.",
  },
  {
    question: "Kdyby v půdě vyhynuly všechny žížaly a mikroorganismy, co by se stalo s rostlinami na poli?",
    correctAnswer: "Rostlo by jim hůř, protože půda by přestala být kypřená a bohatá na živiny",
    options: [
      "Rostlo by jim hůř, protože půda by přestala být kypřená a bohatá na živiny",
      "Rostlinám by to vůbec nevadilo",
      "Rostliny by najednou rostly rychleji",
      "Půda by zůstala úplně stejně úrodná jako předtím",
    ],
    hints: [
      "Žížaly a mikroorganismy provzdušňují půdu a rozkládají odumřelé látky na živiny.",
      "Bez nich už půda časem nezůstane tak kyprá a plná živin jako předtím.",
    ],
    explanation: "Žížaly prokopávají a provzdušňují půdu, mikroorganismy rozkládají odumřelé zbytky na živiny. Bez nich by půda přestala být kyprá a úrodná a rostlinám by se v ní hůře dařilo.",
  },
  {
    question: "Továrna vypouští do vzduchu hodně škodlivých zplodin. Proč to škodí i rostlinám a zvířatům v okolí, ne jen lidem ve městě?",
    correctAnswer: "Protože znečištěný vzduch dýchají i rostliny a zvířata a škodí jim stejně jako lidem",
    options: [
      "Protože znečištěný vzduch dýchají i rostliny a zvířata a škodí jim stejně jako lidem",
      "Protože rostliny a zvířata žádný vzduch nedýchají",
      "Protože znečištění zůstává jen uvnitř továrny",
      "Protože jen lidé mají plíce, které to poškozuje",
    ],
    hints: [
      "Vzduch se šíří všude okolo, ne jen tam, kde jsou lidé.",
      "Rostliny i zvířata potřebují ke svému zdraví čistý vzduch úplně stejnou měrou jako lidé — dýchají ten samý vzduch.",
    ],
    explanation: "Znečištěný vzduch se šíří do celého okolí a škodí všem živým organismům, které ho dýchají nebo jsou na něm závislé — nejen lidem, ale i zvířatům a rostlinám.",
  },
  {
    question: "Kdyby lidé vykáceli velkou část lesů na celé planetě, co by se pravděpodobně stalo s množstvím srážek?",
    correctAnswer: "Srážek by ubylo, protože stromy pomáhají vodě z půdy odpařovat se do vzduchu",
    options: [
      "Srážek by ubylo, protože stromy pomáhají vodě z půdy odpařovat se do vzduchu",
      "Srážek by přibylo, protože by nic nebránilo dešti padat",
      "Množství srážek by se vůbec nezměnilo",
      "Srážky by byly úplně stejné, protože počasí dělá jen slunce",
    ],
    hints: [
      "Stromy nasávají vodu z půdy a část jí uvolňují do vzduchu listy.",
      "Méně vody ve vzduchu znamená méně oblaků a méně srážek.",
    ],
    explanation: "Stromy odpařují vodu z půdy do vzduchu svými listy. Bez lesů by se do vzduchu dostávalo méně vodní páry, vznikalo by méně oblaků, a tím i méně srážek v daném kraji.",
  },
  {
    question: "Proč je pro život důležité, že vzduch obsahuje jak kyslík, tak oxid uhličitý zároveň?",
    correctAnswer: "Protože kyslík potřebují k dýchání živočichové a oxid uhličitý potřebují rostliny k fotosyntéze",
    options: [
      "Protože kyslík potřebují k dýchání živočichové a oxid uhličitý potřebují rostliny k fotosyntéze",
      "Protože oba plyny potřebují jen rostliny",
      "Protože oba plyny potřebují jen živočichové",
      "Protože vzduch by fungoval úplně stejně, i kdyby jeden z plynů chyběl",
    ],
    hints: [
      "Kdo dýchá kyslík a kdo využívá oxid uhličitý?",
      "Oba plyny dohromady umožňují fungování koloběhu mezi rostlinami a živočichy.",
    ],
    explanation: "Živočichové potřebují kyslík k dýchání a produkují přitom oxid uhličitý, který zase využívají rostliny k fotosyntéze. Kdyby ve vzduchu chyběl jeden z těchto plynů, koloběh mezi rostlinami a živočichy by se zastavil.",
  },
  {
    question: "Znečištěná půda na poli se při dešti splachuje do potoka. Proč to znamená problém i pro pitnou vodu?",
    correctAnswer: "Protože škodliviny z půdy se dostanou do vody, kterou lidé později používají jako pitnou",
    options: [
      "Protože škodliviny z půdy se dostanou do vody, kterou lidé později používají jako pitnou",
      "Protože voda z potoků se nikdy nedostane do studní ani vodáren",
      "Protože znečištěná půda vodu naopak automaticky čistí",
      "Protože to na kvalitu vody nemá žádný vliv",
    ],
    hints: [
      "Voda z potoků a řek často končí ve studních nebo úpravnách vody.",
      "Co je v půdě, se při dešti může dostat i do vody.",
    ],
    explanation: "Déšť splavuje znečištěné látky z půdy do potoků a řek. Tato voda může být zdrojem pro studny nebo úpravny vody, takže znečištění půdy může ohrozit i kvalitu pitné vody.",
  },
  {
    question: "Proč se říká, že voda, vzduch a půda jsou navzájem propojené, a ne tři oddělené věci?",
    correctAnswer: "Protože změna v jedné z nich ovlivňuje i další dvě, například sucho ovlivní růst rostlin i množství kyslíku",
    options: [
      "Protože změna v jedné z nich ovlivňuje i další dvě, například sucho ovlivní růst rostlin i množství kyslíku",
      "Protože voda, vzduch a půda spolu vůbec nesouvisí",
      "Protože sucho ovlivní jen rostliny, na vzduch nemá žádný vliv",
      "Protože propojené jsou jen voda se vzduchem, půda s nimi nesouvisí",
    ],
    hints: [
      "Zamysli se, co se stane s rostlinami, když je sucho a v půdě chybí voda.",
      "Méně rostlin znamená méně fotosyntézy, a tedy méně kyslíku ve vzduchu.",
    ],
    explanation: "Voda, vzduch a půda jsou vzájemně propojené. Pokud je například sucho, v půdě chybí voda, rostlinám se nedaří, a protože fotosyntetizují méně, ubývá i kyslíku, který uvolňují do vzduchu.",
  },
  {
    question: "Bez stromů na kopci odplavil silný déšť ornici do potoka. Jak to postupně ovlivní i život v potoce?",
    correctAnswer: "Splavená hlína zakalí vodu a rybám i rostlinám v potoce se bude hůř žít",
    options: [
      "Splavená hlína zakalí vodu a rybám i rostlinám v potoce se bude hůř žít",
      "Potok bude čistší, protože hlína ho pročistí",
      "Rybám to nijak nevadí, hlína ve vodě jim nevadí",
      "Hlína se hned usadí na dně a na vodu už dál nepůsobí",
    ],
    hints: [
      "Zakalená voda propouští méně světla a mění podmínky pro život ve vodě.",
      "Eroze na poli může ovlivnit i to, co se děje daleko od pole — v potoce.",
    ],
    explanation: "Eroze odplaví ornici do potoka, voda se zakalí a propouští méně světla. To ztěžuje život vodním rostlinám i rybám, které jsou na čisté vodě závislé. Tak se problém z pole (eroze) přenese až do vodního ekosystému.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const VODAVZDUCHPUDA: TopicMetadata[] = [
  {
    id: "g3-prvouka-rozmanitost-prirody-ziva-a-neziva-priroda-voda-vzduch-puda-vyznam-pro-zivot",
    rvpNodeId: "g3-prvouka-rozmanitost-prirody-ziva-a-neziva-priroda-voda-vzduch-puda-vyznam-pro-zivot",
    title: "Voda, vzduch, půda — význam pro život",
    studentTitle: "Voda, vzduch a půda",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Živá a neživá příroda",
    briefDescription: "Pochopíš, proč jsou voda, vzduch a půda nezbytné pro život.",
    keywords: ["voda", "vzduch", "půda", "koloběh vody", "kyslík", "dusík", "eroze", "fotosyntéza"],
    goals: [
      "Popsat koloběh vody v přírodě",
      "Vysvětlit složení vzduchu a jeho důležitost",
      "Pochopit, jak vzniká půda a proč je důležitá",
      "Uvést příklady znečišťování a ochrany přírody",
    ],
    boundaries: ["Chemické vzorce a podrobná chemie jsou nad rámec 3. ročníku"],
    gradeRange: [3, 3],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Vzpomeň si na koloběh vody: výpar → oblaka → déšť → řeky → moře.",
      steps: [
        "1. Voda: výpar → oblaka → srážky → řeky → moře (koloběh).",
        "2. Vzduch: 4/5 dusík + 1/5 kyslík + trocha CO₂.",
        "3. Kyslík = dýchání živočichů. CO₂ = fotosyntéza rostlin.",
        "4. Půda vzniká z hornin + odumřelých organismů. Žížaly ji kypří.",
      ],
      commonMistake: "Vzduch není jen kyslík — největší část tvoří dusík.",
      example: "Koloběh vody: řeka vypaří vodu → oblaka → déšť → řeka opět.",
    },
  },
];
