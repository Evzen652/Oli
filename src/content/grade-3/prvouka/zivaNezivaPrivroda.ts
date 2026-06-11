import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
  {
    question: "Co patří do živé přírody?",
    correctAnswer: "Strom",
    options: ["Strom", "Kámen", "Vzduch", "Voda"],
    hints: [
      "Živé věci rostou, dýchají a rozmnožují se.",
      "Strom roste, přijímá živiny a rozmnožuje se semeny.",
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
      "Kámen je hornina — nevzniká z živých organizmů, nepohybuje se samo.",
    ],
    explanation:
      "Kámen patří do neživé přírody. Sám od sebe neroste, nedýchá ani se nerozmnožuje. Housenka, houba i tráva jsou živé organismy.",
  },
  {
    question: "Který ze znaků NEPLATÍ pro živé organismy?",
    correctAnswer: "Jsou tvrdé jako horniny",
    options: [
      "Jsou tvrdé jako horniny",
      "Dýchají",
      "Rostou",
      "Rozmnožují se",
    ],
    hints: [
      "Živé organismy mají společné vlastnosti — dýchání, růst a rozmnožování.",
      "Tvrdost nemá se životem nic společného — i měkké organismy jsou živé.",
    ],
    explanation:
      "Živé organismy dýchají, rostou, přijímají živiny a rozmnožují se. Tvrdost není znakem živého — je to vlastnost hornin, ale nijak nesouvisí se životem.",
  },
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
      "Semeno je živé, i když se nepohybuje a neroste. Uvnitř je zárodek budoucí rostliny, který čeká na vhodné podmínky — vodu, teplo a světlo. Říkáme mu dormantní (spící) stav.",
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
      "Zvířata dýchají vzduch, pijí vodu a potřebují potravu — to vše pochází i z neživé přírody.",
    ],
    explanation:
      "Všechny živé organismy závisí na neživé přírodě. Rostliny potřebují vodu, vzduch, světlo a živiny z půdy. Živočichové dýchají vzduch a pijí vodu. Bez neživé přírody by život nemohl existovat.",
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
      "Rostliny fotosyntézou vyrábějí potravu — ostatní je konzumují.",
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
      "Voda patří do neživé přírody — je to chemická látka (H₂O), která sama neroste ani se nerozmnožuje. V vodě mohou žít živé organismy, ale to z vody živou věc nedělá.",
  },
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
    question: "Které z níže uvedených věcí patří do neživé přírody?",
    correctAnswer: "Půda, voda, vzduch",
    options: [
      "Půda, voda, vzduch",
      "Tráva, voda, housenka",
      "Strom, kámen, houba",
      "Pes, slunce, mech",
    ],
    hints: [
      "Neživé věci nejsou organismy — neroste, nedýchají, nerozmnožují se.",
      "Půda obsahuje minerály a humus, ale sama o sobě není živá.",
    ],
    explanation:
      "Půda, voda a vzduch patří do neživé přírody. Jsou to látky a prostředí, na nichž živé organismy závisí, ale samy nejsou živými organismy. Tráva, housenka, pes, mech a houba jsou živé.",
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
      "Znaky živých organizmů jsou: dýchání, výživa (příjem energie), růst, rozmnožování a reakce na podněty. Tvrdost, barva nebo lesk jsou vlastnosti neživých látek.",
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
      "Rostlina bez vody usychá a hyne. Voda je součást neživé přírody, na níž živé organismy závisí — přenáší živiny, udržuje buňky napnuté a je nutná pro fotosyntézu.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 12);
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
        "Záměna: pohyb není rozhodující — stromy jsou živé, přestože se nepohybují. Houba je živá, i když nemá chlorofyl.",
      example:
        "Kámen — neroste, nedýchá, nerozmnožuje se → neživá příroda. Dub — roste, dýchá, rozmnožuje se žaludy → živá příroda.",
    },
  },
];
