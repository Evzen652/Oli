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
//   L1 = rozpoznání: izolované, jasné příklady živé/neživé přírody a
//        základní znaky života (dýchání, výživa, růst, rozmnožování).
//   L2 = aplikace: hraniční, ale vysvětlitelné případy s odůvodněním —
//        semeno, houba bez chlorofylu, fotosyntéza, potravní řetězec,
//        rozlišení nositele (ryba) vs samotné neživé látky (voda/vzduch).
//   L3 = transfer: kombinace znaků, "pastičkové" příklady, 2kroková úvaha —
//        pohyb/růst samy o sobě nerozhodují, skupinové zařazení více věcí
//        najednou, závislost živého na neživém.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Co patří do živé přírody?",
    correctAnswer: "Strom",
    options: ["Strom", "Kámen", "Vzduch", "Voda"],
    hints: [
      "Živé věci rostou, dýchají a rozmnožují se.",
      "Tato rostlina roste, přijímá živiny a rozmnožuje se semeny.",
    ],
    explanation:
      "Strom patří do živé přírody, protože dýchá, roste, přijímá živiny a rozmnožuje se. Kámen, vzduch a voda jsou neživá příroda — nesplňují znaky živých organizmů.",
  },
  {
    question: "Co patří do neživé přírody?",
    correctAnswer: "Kámen",
    options: ["Kámen", "Housenka", "Houba", "Tráva"],
    hints: [
      "Neživé věci neroste, nedýchají a nerozmnožují se.",
      "Je to tvrdý kus horniny — nevzniká z živých organizmů, nepohybuje se samo.",
    ],
    explanation:
      "Kámen patří do neživé přírody. Sám od sebe neroste, nedýchá ani se nerozmnožuje. Housenka, houba i tráva jsou živé organismy.",
  },
  {
    question: "Který ze znaků NEPLATÍ pro živé organismy?",
    correctAnswer: "Jsou tvrdé jako horniny",
    options: ["Jsou tvrdé jako horniny", "Dýchají", "Rostou", "Rozmnožují se"],
    hints: [
      "Živé organismy mají společné vlastnosti — dýchání, růst a rozmnožování.",
      "Tvrdost nemá se životem nic společného — i měkké organismy jsou živé.",
    ],
    explanation:
      "Živé organismy dýchají, rostou, přijímají živiny a rozmnožují se. Tvrdost není znakem živého — je to vlastnost hornin, ale nijak nesouvisí se životem.",
  },
  {
    question: "Co patří do živé přírody?",
    correctAnswer: "Pes",
    options: ["Pes", "Písek", "Mrak", "Sníh"],
    hints: [
      "Živý organismus dýchá, přijímá potravu a rozmnožuje se.",
      "Je to zvíře, které dýchá, roste a má mláďata.",
    ],
    explanation:
      "Pes patří do živé přírody — dýchá, přijímá potravu, roste a rozmnožuje se. Písek, mrak a sníh jsou neživá příroda.",
  },
  {
    question: "Co patří do neživé přírody?",
    correctAnswer: "Písek",
    options: ["Písek", "Motýl", "Bříza", "Žížala"],
    hints: [
      "Neživá věc neroste, nedýchá a nerozmnožuje se.",
      "Jsou to drobná zrnka horniny.",
    ],
    explanation:
      "Písek patří do neživé přírody — je to drobná rozdrcená hornina, sám neroste ani se nerozmnožuje. Motýl, bříza i žížala jsou živé organismy.",
  },
  {
    question: "Které zvíře patří do živé přírody?",
    correctAnswer: "Kočka",
    options: ["Kočka", "Hora", "Řeka", "Oblak"],
    hints: [
      "Živočich dýchá, roste a rozmnožuje se.",
      "Toto zvíře má mláďata, dýchá a přijímá potravu.",
    ],
    explanation:
      "Kočka je živočich — dýchá, roste, přijímá potravu a rozmnožuje se. Hora, řeka a oblak patří do neživé přírody.",
  },
  {
    question: "Co patří do neživé přírody?",
    correctAnswer: "Sníh",
    options: ["Sníh", "Ryba", "Strom", "Brouk"],
    hints: [
      "Neživá věc nedýchá, neroste ani se nerozmnožuje.",
      "Je to zmrzlá voda.",
    ],
    explanation:
      "Sníh patří do neživé přírody — je to zmrzlá voda, sama o sobě nedýchá ani se nerozmnožuje. Ryba, strom a brouk jsou živé organismy.",
  },
  {
    question: "Jaké jsou znaky živých organizmů? Vyber správnou skupinu.",
    correctAnswer: "Dýchání, výživa, růst, rozmnožování",
    options: [
      "Dýchání, výživa, růst, rozmnožování",
      "Tvrdost, barva, tvar, váha",
      "Pohyb, chlad, tvrdost, lesk",
      "Světlo, teplo, vzduch, voda",
    ],
    hints: [
      "Znaky živých organizmů jsou biologické projevy — co dělá každý živý tvor?",
      "Tvrdost, barva a lesk popisují neživé látky, ne živé organismy.",
    ],
    explanation:
      "Znaky živých organizmů jsou: dýchání, výživa (příjem energie), růst a rozmnožování. Tvrdost, barva nebo lesk jsou vlastnosti neživých látek.",
  },
  {
    question: "Co patří do živé přírody?",
    correctAnswer: "Rostlina",
    options: ["Rostlina", "Kov", "Plast", "Sklo"],
    hints: [
      "Rostlina roste, přijímá živiny a rozmnožuje se semeny.",
      "Kov, plast a sklo jsou vyrobené neživé materiály.",
    ],
    explanation:
      "Rostlina patří do živé přírody — roste, přijímá vodu a živiny a rozmnožuje se. Kov, plast a sklo jsou neživé materiály.",
  },
  {
    question: "Co patří do neživé přírody?",
    correctAnswer: "Oblak",
    options: ["Oblak", "Včela", "Dub", "Ježek"],
    hints: [
      "Neživá věc nedýchá, neroste ani se nerozmnožuje.",
      "Je to shluk kapiček vody nebo krystalků ledu vysoko na obloze.",
    ],
    explanation:
      "Oblak patří do neživé přírody — je to shluk vodních kapiček nebo ledových krystalků, sám nedýchá ani se nerozmnožuje. Včela, dub a ježek jsou živé organismy.",
  },
  {
    question: "Které z těchto věcí je živý organismus?",
    correctAnswer: "Brouk",
    options: ["Brouk", "Cihla", "Sklenice", "Mince"],
    hints: [
      "Živý organismus dýchá, roste a rozmnožuje se.",
      "Cihla, sklenice a mince jsou vyrobené neživé předměty.",
    ],
    explanation:
      "Brouk je živý organismus — dýchá, roste a rozmnožuje se. Cihla, sklenice a mince jsou neživé vyrobené předměty.",
  },
  {
    question: "Co patří do neživé přírody?",
    correctAnswer: "Skála",
    options: ["Skála", "Liška", "Muchomůrka", "Kopřiva"],
    hints: [
      "Neživá věc neroste, nedýchá ani se nerozmnožuje.",
      "Je to velký, pevně usazený kus horniny.",
    ],
    explanation:
      "Skála patří do neživé přírody — je to velký kus horniny, sama neroste ani se nerozmnožuje. Liška, muchomůrka i kopřiva jsou živé organismy.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Proč je semeno považováno za živé, i když neroste?",
    correctAnswer: "Uvnitř semene je zárodek — bude růst, až dostane vodu a teplo",
    options: [
      "Uvnitř semene je zárodek — bude růst, až dostane vodu a teplo",
      "Semeno je jen kousek horniny",
      "Semeno je neživé, protože nehýbe se",
      "Semeno je neživé, dokud nevyklíčí",
    ],
    hints: [
      "Semeno vypadá jako neživé, ale obsahuje živý zárodek rostliny.",
      "Stačí voda a teplo a zárodek se probudí a začne klíčit.",
    ],
    explanation:
      "Semeno je živé, i když se nepohybuje a neroste. Uvnitř je zárodek budoucí rostliny, který čeká na vhodné podmínky — vodu, teplo a světlo. Tomuto klidovému stavu se říká dormance.",
  },
  {
    question: "Houba v lese — je to živý organismus?",
    correctAnswer: "Ano, houba je živý organismus",
    options: [
      "Ano, houba je živý organismus",
      "Ne, houba je neživá, protože nemá listy",
      "Ne, houba je neživá, protože nefotosyntézuje",
      "Záleží na tom, jak velká houba je",
    ],
    hints: [
      "Houba roste, rozmnožuje se výtrusy a přijímá živiny.",
      "Houby netvoří chlorofyl, ale to neznamená, že jsou neživé.",
    ],
    explanation:
      "Houba je živý organismus, i když nemá chlorofyl a nevyrábí si potravu fotosyntézou. Houby získávají živiny jinak — rozkládají organické látky. Rostou a rozmnožují se výtrusy.",
  },
  {
    question: "Co je fotosyntéza?",
    correctAnswer: "Způsob, jak si rostliny vyrábějí potravu ze světla a vody",
    options: [
      "Způsob, jak si rostliny vyrábějí potravu ze světla a vody",
      "Způsob, jak se rozmnožují živočichové",
      "Způsob, jak horniny mění svůj tvar",
      "Způsob, jak vzduch vzniká v půdě",
    ],
    hints: [
      "Foto = světlo. Rostliny potřebují světlo k výrobě potravy.",
      "Rostliny přijímají vodu z půdy a oxid uhličitý ze vzduchu, pak vyrobí cukr.",
    ],
    explanation:
      "Fotosyntéza je proces, při kterém zelené rostliny využívají sluneční světlo, vodu a oxid uhličitý k výrobě cukru jako potravy. Při tom vzniká kyslík, který vydechujeme.",
  },
  {
    question: "Co tvoří základ potravního řetězce?",
    correctAnswer: "Rostliny (producenti)",
    options: [
      "Rostliny (producenti)",
      "Dravci — lvi a vlci",
      "Kameny a horniny",
      "Houby a bakterie",
    ],
    hints: [
      "Potravní řetězec začíná organizmem, který si sám vyrábí potravu.",
      "Ten organismus si fotosyntézou vyrábí potravu sám — ostatní na něm závisí.",
    ],
    explanation:
      "Základ potravního řetězce tvoří rostliny, protože samy si vyrábějí potravu fotosyntézou. Ostatní organismy — býložravci, masožravci — závisí na rostlinách přímo nebo nepřímo.",
  },
  {
    question: "Vzduch patří do živé nebo neživé přírody?",
    correctAnswer: "Do neživé přírody",
    options: [
      "Do neživé přírody",
      "Do živé přírody",
      "Do obou — vzduch je součástí živých i neživých věcí",
      "Vzduch není součástí přírody",
    ],
    hints: [
      "Vzduch neroste, nedýchá ani se nerozmnožuje.",
      "Vzduch je směs plynů — to jsou neživé látky.",
    ],
    explanation:
      "Vzduch patří do neživé přírody. Je to směs plynů (dusík, kyslík, oxid uhličitý). Sám o sobě neroste ani se nerozmnožuje — ale živé organismy ho potřebují ke dýchání.",
  },
  {
    question: "Voda patří do živé nebo neživé přírody?",
    correctAnswer: "Do neživé přírody",
    options: [
      "Do neživé přírody",
      "Do živé přírody",
      "Do živé přírody, protože v ní žijí ryby",
      "Záleží na tom, zda je čistá nebo znečištěná",
    ],
    hints: [
      "Voda sama o sobě neroste, nedýchá ani se nerozmnožuje.",
      "Ryby ve vodě jsou živé — ale samotná voda je neživá látka.",
    ],
    explanation:
      "Voda patří do neživé přírody — je to chemická látka (H₂O), která sama neroste ani se nerozmnožuje. Ve vodě mohou žít živé organismy, ale to z vody živou věc nedělá.",
  },
  {
    question: "Potřebují živé organismy neživou přírodu?",
    correctAnswer: "Ano, potřebují vodu, vzduch, světlo a půdu",
    options: [
      "Ano, potřebují vodu, vzduch, světlo a půdu",
      "Ne, živé organismy nepotřebují nic z neživé přírody",
      "Jen živočichové potřebují vzduch, rostliny nepotřebují nic",
      "Jen rostliny potřebují světlo, živočichové ne",
    ],
    hints: [
      "Představ si rostlinu bez vody nebo bez světla — co se stane?",
      "Zvířata dýchají vzduch, pijí vodu a potřebují potravu — to vše souvisí i s neživou přírodou.",
    ],
    explanation:
      "Všechny živé organismy závisí na neživé přírodě. Rostliny potřebují vodu, vzduch, světlo a živiny z půdy. Živočichové dýchají vzduch a pijí vodu. Bez neživé přírody by život nemohl existovat.",
  },
  {
    question: "Proč rostliny potřebují světlo?",
    correctAnswer: "Ke fotosyntéze — výrobě potravy",
    options: [
      "Ke fotosyntéze — výrobě potravy",
      "Aby se mohly pohybovat",
      "Aby mohly dýchat",
      "Aby se rozmnožovaly",
    ],
    hints: [
      "Rostliny vyrábějí potravu ze světla — jak se ten proces jmenuje?",
      "Bez světla rostliny žloutnou a chřadnou.",
    ],
    explanation:
      "Rostliny potřebují světlo ke fotosyntéze — procesu, při kterém z vody a oxidu uhličitého vyrábějí cukr jako potravu. Bez dostatku světla fotosyntéza neprobíhá a rostlina hyne.",
  },
  {
    question: "Je plíseň na chlebu živý organismus?",
    correctAnswer: "Ano, plíseň je živý organismus (druh houby)",
    options: [
      "Ano, plíseň je živý organismus (druh houby)",
      "Ne, protože nemá listy ani kořeny",
      "Ne, plíseň je jen skvrna na chlebu",
      "Záleží na barvě plísně",
    ],
    hints: [
      "Plíseň roste, rozmnožuje se výtrusy a přijímá živiny z chleba.",
      "Plísně patří mezi houby, i když jsou drobné.",
    ],
    explanation:
      "Plíseň je živý organismus — druh houby. Roste, přijímá živiny z chleba a rozmnožuje se drobnými výtrusy, i když nemá listy ani kořeny jako rostlina.",
  },
  {
    question: "Co vše potřebuje rostlina k fotosyntéze?",
    correctAnswer: "Světlo, vodu a oxid uhličitý",
    options: [
      "Světlo, vodu a oxid uhličitý",
      "Jen sluneční světlo",
      "Jen vodu z půdy",
      "Teplo a tmu",
    ],
    hints: [
      "Fotosyntéza potřebuje světlo, ale i další dvě látky.",
      "Jednu z nich rostlina nasává kořeny ze země, druhou přijímá listy ze vzduchu.",
    ],
    explanation:
      "K fotosyntéze rostlina potřebuje světlo, vodu (z půdy) a oxid uhličitý (ze vzduchu). Z těchto tří věcí vyrobí cukr jako potravu a jako vedlejší produkt vzniká kyslík.",
  },
  {
    question: "Proč se houby neřadí mezi rostliny, přestože jsou obě živé?",
    correctAnswer:
      "Houby nemají chlorofyl a nevyrábějí si potravu fotosyntézou jako rostliny",
    options: [
      "Houby nemají chlorofyl a nevyrábějí si potravu fotosyntézou jako rostliny",
      "Houby se nikdy nerozmnožují",
      "Houby nejsou vůbec živé organismy",
      "Houby nepotřebují žádné živiny",
    ],
    hints: [
      "Rostliny mají v listech zelené barvivo, které jim umožňuje fotosyntézu.",
      "Houby získávají živiny jinak — rozkladem organických látek.",
    ],
    explanation:
      "Houby nemají chlorofyl, a proto si nemohou vyrábět potravu fotosyntézou jako rostliny. Místo toho přijímají živiny rozkladem odumřelých organismů. Přesto jsou houby živé — rostou a rozmnožují se výtrusy.",
  },
  {
    question: "Co znamená, že rostliny jsou v potravním řetězci „producenti“?",
    correctAnswer: "Že si samy vyrábějí potravu fotosyntézou, a ostatní na nich závisí",
    options: [
      "Že si samy vyrábějí potravu fotosyntézou, a ostatní na nich závisí",
      "Že vyrábějí potravu pro sebe i pro kameny",
      "Že jsou to jediné živé organismy na Zemi",
      "Že se nikdy nerozmnožují",
    ],
    hints: [
      "Producent = ten, kdo něco vyrábí — v tomto případě potravu.",
      "Býložravci jedí rostliny, masožravci jedí býložravce — vše navazuje na rostliny.",
    ],
    explanation:
      "Rostliny nazýváme producenty, protože si díky fotosyntéze samy vyrábějí potravu ze světla, vody a oxidu uhličitého. Všichni ostatní v potravním řetězci — býložravci i masožravci — na nich přímo nebo nepřímo závisí.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jaký je hlavní rozdíl mezi živou a neživou přírodou?",
    correctAnswer: "Živé organismy dýchají, rostou a rozmnožují se; neživé věci ne",
    options: [
      "Živé organismy dýchají, rostou a rozmnožují se; neživé věci ne",
      "Živé věci jsou vždy zelené; neživé věci mají jinou barvu",
      "Živé věci jsou větší než neživé věci",
      "Živé věci se pohybují, neživé věci stojí na místě",
    ],
    hints: [
      "Zamysli se nad znaky živých organizmů: dýchání, růst, rozmnožování.",
      "Stromy se nepohybují, ale jsou živé. Vítr se pohybuje, ale je neživý.",
    ],
    explanation:
      "Hlavní rozdíl je v životních projevech. Živé organismy dýchají, přijímají živiny, rostou a rozmnožují se. Neživé věci tyto projevy nemají — ani pohyb není rozhodujícím znakem, protože stromy jsou živé, přestože se nepohybují.",
  },
  {
    question: "Který příklad DOKAZUJE, že pohyb není rozhodujícím znakem živého organismu?",
    correctAnswer: "Strom stojí na místě, ale je živý; vítr se pohybuje, ale je neživý",
    options: [
      "Strom stojí na místě, ale je živý; vítr se pohybuje, ale je neživý",
      "Pes běhá po zahradě, protože je živý",
      "Kámen se nehýbe, protože je neživý",
      "Ryba plave, protože žije ve vodě",
    ],
    hints: [
      "Potřebuješ příklad, který ukazuje OBĚ strany: nehybnou živou věc i pohyblivou neživou věc.",
      "Strom se nepohybuje z místa, přesto dýchá, roste a rozmnožuje se.",
    ],
    explanation:
      "Aby se dokázalo, že pohyb sám o sobě nerozhoduje o životě, potřebujeme příklad z obou stran: strom je živý, i když stojí na místě, a vítr se pohybuje, i když je neživý. Ostatní možnosti ukazují jen jeden směr, a proto nic nedokazují.",
  },
  {
    question:
      "Proč je semeno klasifikováno jako živé, přestože právě neroste, nedýchá viditelně a nerozmnožuje se?",
    correctAnswer:
      "Protože obsahuje živý zárodek v klidovém stavu — všechny znaky života začne plnit, jakmile dostane vodu, teplo a světlo",
    options: [
      "Protože obsahuje živý zárodek v klidovém stavu — všechny znaky života začne plnit, jakmile dostane vodu, teplo a světlo",
      "Protože je tvrdé jako kámen, a kámen taky vydrží dlouho",
      "Semeno vlastně živé není, jen to tak vypadá",
      "Protože má stejnou barvu jako listy stromu",
    ],
    hints: [
      "Semeno teď zrovna nedělá nic z toho, co dělá živý tvor — ale proč to není důvod považovat ho za neživé?",
      "Jde o dočasný klidový (dormantní) stav, ne o to, že by semeno bylo neživé.",
    ],
    explanation:
      "Semeno je živé, i když teď zrovna neroste, nedýchá viditelně a nerozmnožuje se. Uvnitř je zárodek rostliny v klidovém (dormantním) stavu, který začne plnit všechny životní projevy najednou, jakmile dostane vodu, teplo a světlo.",
  },
  {
    question: "Co se stane s rostlinou, když ji přestaneme zalévat?",
    correctAnswer: "Usychá a hyne, protože voda je nezbytná pro její život",
    options: [
      "Usychá a hyne, protože voda je nezbytná pro její život",
      "Nic se nestane — rostliny nepotřebují vodu",
      "Začne přijímat vodu ze vzduchu a přežije bez problémů",
      "Přestane růst, ale jinak ji to neovlivní",
    ],
    hints: [
      "Vzpomeň si, co potřebuje rostlina k životu.",
      "Živé organismy závisí na neživé přírodě — voda je nezbytná.",
    ],
    explanation:
      "Rostlina bez vody usychá a hyne. Voda je součást neživé přírody, na níž živé organismy závisí — přenáší živiny, udržuje pletiva napnutá a je nutná pro fotosyntézu. Ukazuje to, jak moc je živá příroda závislá na neživé.",
  },
  {
    question: "Které z níže uvedených věcí patří VŠECHNY do neživé přírody?",
    correctAnswer: "Půda, voda, vzduch",
    options: [
      "Půda, voda, vzduch",
      "Tráva, voda, housenka",
      "Strom, kámen, houba",
      "Pes, slunce, mech",
    ],
    hints: [
      "Neživé věci nejsou organismy — neroste, nedýchají, nerozmnožují se.",
      "Zkontroluj KAŽDOU položku ve skupině — stačí jedna živá věc a skupina nesedí.",
    ],
    explanation:
      "Půda, voda a vzduch patří do neživé přírody. Jsou to látky a prostředí, na nichž živé organismy závisí, ale samy nejsou živými organismy. Ostatní skupiny obsahují alespoň jednu živou věc — trávu, housenku, strom, houbu, psa nebo mech.",
  },
  {
    question: "Které z níže uvedených věcí patří VŠECHNY do živé přírody?",
    correctAnswer: "Dub, žížala, muchomůrka",
    options: [
      "Dub, žížala, muchomůrka",
      "Dub, kámen, žížala",
      "Žížala, voda, muchomůrka",
      "Dub, vzduch, muchomůrka",
    ],
    hints: [
      "Zkontroluj KAŽDOU položku ve skupině — stačí jedna neživá věc a skupina nesedí.",
      "Dub je strom, žížala je živočich, muchomůrka je houba — všechny dýchají, rostou a rozmnožují se.",
    ],
    explanation:
      "Dub (strom), žížala (živočich) a muchomůrka (houba) jsou všechny živé organismy. Ostatní skupiny obsahují vždy jednu neživou věc — kámen, vodu nebo vzduch.",
  },
  {
    question:
      "Houby nefotosyntetizují jako rostliny. Odkud tedy houby získávají živiny, a proč to neznamená, že jsou neživé?",
    correctAnswer:
      "Rozkládají odumřelé organismy a přijímají tak živiny — je to jiný způsob výživy, ale houby stále rostou a rozmnožují se",
    options: [
      "Rozkládají odumřelé organismy a přijímají tak živiny — je to jiný způsob výživy, ale houby stále rostou a rozmnožují se",
      "Houby energii nepotřebují, protože jsou napůl neživé",
      "Houby čerpají energii přímo ze slunce úplně stejně jako rostliny",
      "Houby jsou vlastně kameny, které pomalu rostou",
    ],
    hints: [
      "Výživa fotosyntézou není jediný způsob, jak organismus může žít.",
      "I bez chlorofylu houba splňuje ostatní znaky života — roste a rozmnožuje se výtrusy.",
    ],
    explanation:
      "Houby nemají chlorofyl, a tak nemohou fotosyntetizovat. Místo toho rozkládají odumřelé organické látky a přijímají z nich živiny. Tento jiný způsob výživy neznamená, že jsou neživé — houby stále dýchají, rostou a rozmnožují se výtrusy.",
  },
  {
    question:
      "V rybníce je voda, ve které žije okoun a roste vodní tráva. Co z toho patří do neživé přírody?",
    correctAnswer: "Pouze voda v rybníce",
    options: [
      "Pouze voda v rybníce",
      "Voda i okoun, protože okoun ve vodě žije",
      "Okoun i vodní tráva, protože oba potřebují vodu",
      "Nic — všechno v rybníce je živé",
    ],
    hints: [
      "Odděl nositele (prostředí) od organismů, které v něm žijí.",
      "Okoun a vodní tráva dýchají, rostou a rozmnožují se — voda sama ne.",
    ],
    explanation:
      "Do neživé přírody patří pouze samotná voda — je to látka, která sama neroste, nedýchá ani se nerozmnožuje. Okoun (živočich) a vodní tráva (rostlina) jsou živé organismy, které ve vodě žijí, ale to z vody živou věc nedělá.",
  },
  {
    question:
      "Rostliny (producenti) tvoří základ potravního řetězce. Co by se stalo, kdyby na Zemi náhle nebyly žádné rostliny?",
    correctAnswer:
      "Živočichové by neměli co jíst, protože všichni v řetězci přímo nebo nepřímo závisí na rostlinách",
    options: [
      "Živočichové by neměli co jíst, protože všichni v řetězci přímo nebo nepřímo závisí na rostlinách",
      "Nic by se nestalo, dravci by dál lovili kořist",
      "Živočichové by začali fotosyntetizovat místo rostlin",
      "Jen býložravci by měli problém, masožravci ne",
    ],
    hints: [
      "Zamysli se, kdo je na začátku potravního řetězce a kdo na něm dál staví.",
      "Masožravci jedí býložravce, a ti jedí rostliny — řetěz je propojený.",
    ],
    explanation:
      "Kdyby zmizely rostliny, neměli by co jíst ani býložravci. A protože masožravci loví býložravce, chyběla by potrava i jim. Celý potravní řetězec — přímo i nepřímo — závisí na rostlinách jako producentech.",
  },
  {
    question:
      "Při fotosyntéze rostliny spotřebovávají oxid uhličitý a vodu a vyrábějí kyslík a cukr. Co díky tomu dýchají živočichové?",
    correctAnswer: "Kyslík, který rostliny vyrábějí při fotosyntéze",
    options: [
      "Kyslík, který rostliny vyrábějí při fotosyntéze",
      "Oxid uhličitý, který rostliny vyrábějí při fotosyntéze",
      "Cukr, který se mění na vzduch",
      "Vodu, kterou rostliny vypouštějí do vzduchu",
    ],
    hints: [
      "Fotosyntéza má dva výsledky — cukr jako potravu a jeden plyn navíc.",
      "Ten plyn potřebují k dýchání živočichové i lidé.",
    ],
    explanation:
      "Při fotosyntéze rostliny spotřebovávají oxid uhličitý a vodu a jako vedlejší produkt vzniká kyslík. Právě tento kyslík živočichové (i lidé) dýchají — je to příklad toho, jak jsou živé organismy vzájemně propojené.",
  },
  {
    question:
      "Rampouch na okapu se pomalu prodlužuje, jak na něj namrzá další voda. Je rampouch živý organismus?",
    correctAnswer:
      "Ne, protože nedýchá, nepřijímá živiny ani se nerozmnožuje — jen na něj namrzá další voda",
    options: [
      "Ne, protože nedýchá, nepřijímá živiny ani se nerozmnožuje — jen na něj namrzá další voda",
      "Ano, protože roste stejně jako rostlina",
      "Ano, protože má protáhlý tvar jako živý organismus",
      "Záleží na tom, jak dlouhý rampouch je",
    ],
    hints: [
      "Prodlužování samo o sobě neznamená, že něco žije — musí splňovat i ostatní znaky.",
      "Zkontroluj: dýchá rampouch? Přijímá živiny? Rozmnožuje se?",
    ],
    explanation:
      "Rampouch se sice zvětšuje, ale to je jen mechanické namrzání vody — nedýchá, nepřijímá živiny ani se nerozmnožuje. Pouhé zvětšování velikosti neznamená, že je něco živé; stejně jako pohyb, ani růst velikosti sám o sobě není spolehlivým znakem.",
  },
  {
    question:
      "Krápník v jeskyni pomalu roste, jak se na něj usazuje vápenec z kapající vody. Je krápník živý organismus?",
    correctAnswer:
      "Ne, protože nedýchá, nepřijímá živiny ani se nerozmnožuje — jen se na něj usazuje vápenec",
    options: [
      "Ne, protože nedýchá, nepřijímá živiny ani se nerozmnožuje — jen se na něj usazuje vápenec",
      "Ano, protože roste jako rostlina v zemi",
      "Ano, protože má pravidelný tvar jako živé organismy",
      "Záleží na tom, jak starý krápník je",
    ],
    hints: [
      "I krápník se zvětšuje — ale znamená to totéž, co u živého organismu?",
      "Zkontroluj všechny znaky života najednou, ne jen jeden.",
    ],
    explanation:
      "Krápník roste přidáváním vrstviček vápence z kapající vody, ale nedýchá, nepřijímá živiny ani se nerozmnožuje. Je to neživá hornina — pouhé zvětšování samo o sobě organismus z ničeho neudělá.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const ZIVANEZIVAPRIRODA: TopicMetadata[] = [
  {
    id: "g3-prvouka-rozmanitost-prirody-ziva-a-neziva-priroda-rozdily-mezi-zivou-a-nezivou-prirodou",
    title: "Živá a neživá příroda",
    studentTitle: "Živé a neživé",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Živá a neživá příroda",
    briefDescription: "Rozeznáš živou a neživou přírodu a jejich znaky.",
    illustrationDesc:
      "dítě sedí na louce, vedle leží kameny a rostliny, v ruce drží lupu a zkoumá brouka na listu",
    keywords: [
      "živá příroda",
      "neživá příroda",
      "organismy",
      "rostliny",
      "živočichové",
      "houby",
      "kámen",
      "voda",
      "vzduch",
      "půda",
      "světlo",
      "dýchání",
      "růst",
      "rozmnožování",
      "fotosyntéza",
      "semeno",
      "potravní řetězec",
    ],
    goals: [
      "Rozlišit živou a neživou přírodu a uvést příklady obou.",
      "Vyjmenovat znaky živých organizmů (dýchání, výživa, růst, rozmnožování).",
      "Vysvětlit, proč semeno je živé, i když neroste.",
      "Popsat, jak živé organismy závisí na neživé přírodě.",
      "Uvést příklad potravního řetězce.",
    ],
    boundaries: [
      "Základní pojmy pro 3. třídu — bez buněčné biologie, biochemie nebo ekosystémových modelů.",
      "Fotosyntéza jen jako jednoduchá představa (světlo + voda → potrava), bez rovnic.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Živá příroda: rostliny, živočichové, houby. Neživá příroda: kameny, voda, vzduch, půda, světlo. Živé organismy dýchají, rostou a rozmnožují se.",
      steps: [
        "Zeptej se: roste to, dýchá to, rozmnožuje se to?",
        "Pokud ano — je to živý organismus.",
        "Pokud ne — patří to do neživé přírody.",
        "Nezapomeň: semeno je živé, i když právě neroste.",
      ],
      commonMistake:
        "Záměna: pohyb ani samotný růst velikosti nejsou rozhodující — stromy jsou živé, přestože se nepohybují, a rampouch nebo krápník rostou, přestože jsou neživé. Houba je živá, i když nemá chlorofyl.",
      example:
        "Kámen — neroste, nedýchá, nerozmnožuje se → neživá příroda. Dub — roste, dýchá, rozmnožuje se žaludy → živá příroda.",
    },
  },
];
