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
    question: "Kdo byl Přemysl Oráč?",
    correctAnswer: "Bájný zakladatel přemyslovského rodu — oráč, který se stal knížetem",
    options: [
      "Bájný zakladatel přemyslovského rodu — oráč, který se stal knížetem",
      "Historický kníže Čech",
      "Slovanský kněz",
      "Keltský náčelník",
    ],
    hints: ["Přemysl Oráč je legenda — ne skutečná historická postava."],
    solutionSteps: ["Přemysl Oráč je bájný zakladatel Přemyslovců — legenda praví, že byl oráč, který se oženil s kněžnou Libuší."],
  },
  {
    question: "Kdo byl první pokřtěný přemyslovský kníže?",
    correctAnswer: "Bořivoj",
    options: ["Bořivoj", "Václav", "Přemysl Otakar II.", "Boleslav I."],
    hints: ["Tento kníže byl pokřtěn na dvoře Svätopluka VM Říše."],
    solutionSteps: ["Bořivoj byl první historicky doložený přemyslovský kníže a první pokřtěný vládce Čech."],
  },
  {
    question: "Jak se jmenuje patron Čech a sv. zemský světec?",
    correctAnswer: "Svatý Václav",
    options: ["Svatý Václav", "Svatý Jan Nepomucký", "Cyril a Metoděj", "Svatý Vít"],
    hints: ["Tento světec je vyobrazen na sv. Václavském náměstí v Praze."],
    solutionSteps: ["Patron Čech je svatý Václav — kníže, který šířil křesťanství a byl zavražděn svým bratrem."],
  },
  {
    question: "Kdy byl zavražděn sv. Václav?",
    correctAnswer: "28. září 935 (nebo 929)",
    options: ["28. září 935 (nebo 929)", "12. října 1000", "6. července 1415", "28. října 918"],
    hints: ["Stalo se to 28. září — svátek sv. Václava."],
    solutionSteps: ["Sv. Václav byl zavražděn 28. září roku 935 (nebo 929) svým bratrem Boleslavem I."],
  },
  {
    question: "Kdo zavraždil sv. Václava?",
    correctAnswer: "Jeho bratr Boleslav I.",
    options: ["Jeho bratr Boleslav I.", "Maďaři", "Němci", "Vlastní druh"],
    hints: ["Vražda se odehrála na vchodu do kostela ve Staré Boleslavi."],
    solutionSteps: ["Sv. Václav byl zavražděn svým bratrem Boleslavem I. 28. září 935 ve Staré Boleslavi."],
  },
  {
    question: "Jak se říkalo Přemyslu Otakaru II.?",
    correctAnswer: "Král železný a zlatý",
    options: ["Král železný a zlatý", "Otec vlasti", "Zlatý král Praha", "Lev severu"],
    hints: ["Tuto přezdívku dostal díky svým úspěchům a bohatství."],
    solutionSteps: ["Přemysl Otakar II. (1253–1278) se nazýval 'král železný a zlatý' pro svou vojenskou sílu a bohatství."],
  },
  {
    question: "Do kdy dosáhla říše Přemysla Otakara II.?",
    correctAnswer: "Od Baltského moře po Jaderské moře",
    options: [
      "Od Baltského moře po Jaderské moře",
      "Jen Čechy a Morava",
      "Od Alp po Polsko",
      "Jen střední Čechy",
    ],
    hints: ["Přemysl Otakar II. byl nejmocnějším panovníkem střední Evropy."],
    solutionSteps: ["Přemysl Otakar II. vládl od Baltského po Jaderské moře — Čechy, Morava, Rakousy, Korutany, Štýrsko."],
  },
  {
    question: "Kde zemřel Přemysl Otakar II.?",
    correctAnswer: "V bitvě na Moravském poli (1278)",
    options: [
      "V bitvě na Moravském poli (1278)",
      "V Praze na Hradčanech",
      "V Polsku při tažení",
      "V Olomouci",
    ],
    hints: ["Prohrál s Rudolfem Habsburským."],
    solutionSteps: ["Přemysl Otakar II. zemřel v bitvě na Moravském poli v roce 1278 — poražen Rudolfem Habsburským."],
  },
  {
    question: "Kdo byl Václav II.?",
    correctAnswer: "Syn Přemysla Otakara II. — král český a polský, těžil stříbro z Kutné Hory",
    options: [
      "Syn Přemysla Otakara II. — král český a polský, těžil stříbro z Kutné Hory",
      "Vnuk Karla IV.",
      "Syn sv. Václava",
      "Lucemburský král",
    ],
    hints: ["Václav II. byl posledním ale jedním z nejsilnějších Přemyslovců."],
    solutionSteps: ["Václav II. byl syn Přemysla Otakara II. — byl králem českým a polským a využíval bohatství kutnohorského stříbra."],
  },
  {
    question: "Kdo byl poslední Přemyslovec?",
    correctAnswer: "Václav III. (zavražděn 1306)",
    options: [
      "Václav III. (zavražděn 1306)",
      "Václav II.",
      "Přemysl Otakar II.",
      "Jan Lucemburský",
    ],
    hints: ["Přemyslovci vymřeli po meči v roce 1306."],
    solutionSteps: ["Posledním Přemyslovcem byl Václav III. — byl zavražděn v Olomouci roku 1306 a rod vymřel."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co je to přemyslovská dynastie?",
    correctAnswer: "Rod českých knížat a králů vládnoucí od 9. do 13. stol.",
    options: [
      "Rod českých knížat a králů vládnoucí od 9. do 13. stol.",
      "Lucemburský rod",
      "Habsburský rod",
      "Slovanský rod z Moravy",
    ],
    hints: ["Přemyslovci vládli Čechám asi 400 let."],
    solutionSteps: ["Přemyslovci byli dynastií českých knížat a králů vládnoucí od 9. do začátku 14. stol. n. l."],
  },
  {
    question: "Jaký byl přínos sv. Václava pro Čechy?",
    correctAnswer: "Šířil křesťanství a upevňoval vztahy s fransko-říšskými zeměmi",
    options: [
      "Šířil křesťanství a upevňoval vztahy s fransko-říšskými zeměmi",
      "Sjednotil Slovany s Kelty",
      "Vytvořil první české písmo",
      "Porazil Maďary v bitvě",
    ],
    hints: ["Václav byl zbožný kníže — centrum jeho díla bylo náboženství."],
    solutionSteps: ["Sv. Václav šířil křesťanství, stavěl kostely a udržoval mír se Saskou říší — podkladatel německé orientace Čech."],
  },
  {
    question: "Proč je 28. září státním svátkem ČR?",
    correctAnswer: "Je to svátek sv. Václava — patrona Čech, den jeho mučednické smrti",
    options: [
      "Je to svátek sv. Václava — patrona Čech, den jeho mučednické smrti",
      "Den vzniku Přemyslovské říše",
      "Den vzniku ČR",
      "Den bitvy na Moravském poli",
    ],
    hints: ["Sv. Václav byl zavražděn 28. září."],
    solutionSteps: ["28. září = Den české státnosti — svátek sv. Václava, patrona Čech, zavražděného 28. 9. 935."],
  },
  {
    question: "Co bylo Kutnohorské stříbro a proč bylo tak důležité?",
    correctAnswer: "Stříbrné doly v Kutné Hoře přinášely obrovské bohatství českým králům",
    options: [
      "Stříbrné doly v Kutné Hoře přinášely obrovské bohatství českým králům",
      "Stříbrné umělecké předměty z doby bronzové",
      "Stříbro z Německ dovezené do Čech",
      "Název pro české stříbrné mince",
    ],
    hints: ["Kutná Hora leží ve středních Čechách — dnes UNESCO."],
    solutionSteps: ["Kutnohorské stříbrné doly byly v době Václava II. nejbohatšími v Evropě — základ moci českého království."],
  },
  {
    question: "Proč byl Přemysl Otakar II. tak mocný?",
    correctAnswer: "Rozšířil říši přes půl střední Evropy — dědickými nároky a válkami",
    options: [
      "Rozšířil říši přes půl střední Evropy — dědickými nároky a válkami",
      "Byl volený imperátorem",
      "Získal moc díky Kutnohorskému stříbru",
      "Porazil Tatary",
    ],
    hints: ["Přemysl Otakar II. získal Rakousy, Štýrsko, Korutany — jak?"],
    solutionSteps: ["Přemysl Otakar II. získal alpské země (Rakousy, Štýrsko, Korutany) sňatky a dědickými nároky."],
  },
  {
    question: "Kdo byl Rudolf Habsburský a proč porazil Přemysla Otakara II.?",
    correctAnswer: "Německý král — volil koalici proti Přemyslovi a porazil ho na Moravském poli (1278)",
    options: [
      "Německý král — volil koalici proti Přemyslovi a porazil ho na Moravském poli (1278)",
      "Francouzský král",
      "Moravský kníže",
      "Polský král",
    ],
    hints: ["Rudolf Habsburský nastoupil jako římský král a zpochybnil Přemyslovy nároky."],
    solutionSteps: ["Rudolf I. Habsburský (1273–1291) byl zvolen římskoněmeckým králem a porazil Přemysla na Moravském poli 1278."],
  },
  {
    question: "Co byl přemyslovský stát — knížectví nebo království?",
    correctAnswer: "Nejprve knížectví, od roku 1198 království (Přemysl Otakar I.)",
    options: [
      "Nejprve knížectví, od roku 1198 království (Přemysl Otakar I.)",
      "Vždy bylo knížectvím",
      "Vždy bylo královstvím",
      "Bylo součástí Říma",
    ],
    hints: ["Království = vyšší titul než knížectví."],
    solutionSteps: ["České knížectví se stalo královstvím roku 1198 za Přemysla Otakara I. — tento titul byl dědičný."],
  },
  {
    question: "Co je to zlatá bula sicilská?",
    correctAnswer: "Dokument z roku 1212 potvrzující dědičné království pro české Přemyslovce",
    options: [
      "Dokument z roku 1212 potvrzující dědičné království pro české Přemyslovce",
      "Zlatý zákon o volbě císaře",
      "Smlouva s Polskem",
      "Privilegium Karla IV.",
    ],
    hints: ["Zlatá bula sicilská = privilegium vydané v Sicílii."],
    solutionSteps: ["Zlatá bula sicilská (1212) je dokument císaře Fridricha II. potvrzující dědičné právo Přemyslovců na českou korunu."],
  },
  {
    question: "Jak ovlivnila vražda sv. Václava jeho pověst?",
    correctAnswer: "Byl prohlášen za mučedníka a světce — patrona Čech",
    options: [
      "Byl prohlášen za mučedníka a světce — patrona Čech",
      "Vražda nezměnila jeho pověst",
      "Byl po čase zapomenut",
      "Stal se symbolem zrady",
    ],
    hints: ["Mučedník = ten, kdo zemřel pro víru."],
    solutionSteps: ["Václav byl záhy kanonizován (prohlášen za světce) jako mučedník — patron Čech a symbol české státnosti."],
  },
  {
    question: "Proč Václav III. neměl nástupce?",
    correctAnswer: "Byl zavražděn bez potomků — rod Přemyslovců vymřel po meči",
    options: [
      "Byl zavražděn bez potomků — rod Přemyslovců vymřel po meči",
      "Abdikoval ve prospěch Lucemburků",
      "Odjel na křížovou výpravu",
      "Zemřel na mor",
    ],
    hints: ["Přemyslovci vymřeli v roce 1306."],
    solutionSteps: ["Václav III. byl zavražděn v Olomouci roku 1306 bez potomků — Přemyslovci vymřeli a nastoupili Lucemburkové."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jak sv. Václav zemřel a proč je jeho smrt pro Čechy symbolická?",
    correctAnswer: "Zavražděn bratrem kvůli víře — symbol loajality k Bohu i vlasti",
    options: [
      "Zavražděn bratrem kvůli víře — symbol loajality k Bohu i vlasti",
      "Zemřel v bitvě — symbol vojenské odvahy",
      "Byl oběšen — symbol mučednictví pod cizí nadvládou",
      "Zemřel přirozenou smrtí",
    ],
    hints: ["Václav byl ochoten zemřít za víru — klíčový atribut světce."],
    solutionSteps: ["Václav zemřel jako mučedník pro křesťanství — zavražděn vlastním bratrem. Symbolizuje oddanost víře a vlasti."],
  },
  {
    question: "Proč bitva na Moravském poli 1278 změnila dějiny střední Evropy?",
    correctAnswer: "Habsburkové získali Rakousy — základ budoucí habsburské říše trvající do roku 1918",
    options: [
      "Habsburkové získali Rakousy — základ budoucí habsburské říše trvající do roku 1918",
      "Čechy ztratily nezávislost",
      "Přemyslovci přišli jen o Moravu",
      "Bitva neměla větší historický dopad",
    ],
    hints: ["Rudolfovi Habsburskému se otevřela cesta na jih."],
    solutionSteps: ["Po Přemyslově smrti získali Habsburkové Rakousy → základ dynastické moci, která trvala až do 1918."],
  },
  {
    question: "Jak přemyslovský stát sjednotil slovanské kmeny v Čechách?",
    correctAnswer: "Postupnou expanzí, válkami a dohodami — rodina z Prahy ovládla ostatní kmeny",
    options: [
      "Postupnou expanzí, válkami a dohodami — rodina z Prahy ovládla ostatní kmeny",
      "Pomocí křesťanských misií",
      "Díky darování půdy ostatním rodům",
      "Slovanské kmeny se dobrovolně sjednotily",
    ],
    hints: ["Sjednocení probíhalo postupně — někdy silou, někdy diplomacií."],
    solutionSteps: ["Přemyslovci z Prahy postupně podrobili ostatní slovanské kmeny v Čechách — kombinací síly a sňatkové politiky."],
  },
  {
    question: "Proč bylo stříbro z Kutné Hory tak strategické pro Václava II.?",
    correctAnswer: "Dovolilo razit groše — silnou měnu, která posílila obchod a panovníkův vliv",
    options: [
      "Dovolilo razit groše — silnou měnu, která posílila obchod a panovníkův vliv",
      "Stříbro bylo jen pro výzdobu kostelů",
      "Václav stříbro exportoval bez dalšího zpracování",
      "Stříbro sloužilo jako válečná náhrada za zlato",
    ],
    hints: ["Ražba peněz = kontrola hospodářství."],
    solutionSteps: ["Kutnohorské stříbro umožnilo Václavovi II. razit pražský groš — silnou a žádanou měnu v celé střední Evropě."],
  },
  {
    question: "Jak přemyslovský stát přispěl k rozvoji Prahy jako hlavního města?",
    correctAnswer: "Přemyslovci sídlili na Pražském hradě a Praha se stala správním a kulturním centrem",
    options: [
      "Přemyslovci sídlili na Pražském hradě a Praha se stala správním a kulturním centrem",
      "Praha byl jen obchodní přístav na Vltavě",
      "Praha vznikla za Lucemburků",
      "Praha byla centrem pouze za Václava IV.",
    ],
    hints: ["Pražský hrad byl sídlem knížat a králů od pravěku."],
    solutionSteps: ["Přemyslovci budovali Pražský hrad jako sídelní centrum — Praha rostla jako správní, hospodářské a náboženské centrum Čech."],
  },
  {
    question: "Jaký byl náboženský a politický smysl uctívání sv. Václava v ČR dnes?",
    correctAnswer: "Symbolizuje kontinuitu české státnosti a propojení národní identity s křesťanskou tradicí",
    options: [
      "Symbolizuje kontinuitu české státnosti a propojení národní identity s křesťanskou tradicí",
      "Je to jen náboženský svátek bez politického rozměru",
      "Václav je světec bez vlivu na dnešní identitu",
      "Svátek byl zaveden až v 20. stol. bez historického základu",
    ],
    hints: ["Sv. Václav je zobrazován na Václavském náměstí v Praze."],
    solutionSteps: ["Sv. Václav = patron Čech + symbol české státnosti. 28. září = Den české státnosti. Přemostění víry a národní identity."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const count = level === 3 ? Math.min(pool.length, 40) : Math.min(pool.length, 30);
  return shuffle(pool).slice(0, count);
}

export const PREMYSLOVCISVVACLAVPREMYSLOTAKARIIVACLAVII: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-premyslovci-sv-vaclav-premysl-otakar-ii-vaclav-ii",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-premyslovci-sv-vaclav-premysl-otakar-ii-vaclav-ii",
    title: "Přemyslovci - sv. Václav, Přemysl Otakar II., Václav II.",
    studentTitle: "Přemyslovci",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš první českou dynastii Přemyslovců a jejich nejslavnější panovníky.",
    keywords: ["Přemyslovci", "Václav", "Přemysl Otakar II.", "Bořivoj", "Kutná Hora", "patron Čech"],
    goals: [
      "Vyjmenovat hlavní přemyslovské panovníky",
      "Popsat přínos sv. Václava",
      "Vysvětlit přezdívku 'král železný a zlatý'",
      "Vědět, kdy a proč Přemyslovci vymřeli",
    ],
    boundaries: ["Přesná genealogie celé dynastie není vyžadována", "Feudální systém do hloubky není cílem"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Přemyslovci: Bořivoj (první křestěný) → Sv. Václav (zavražděn 935) → Přemysl Otakar II. 'železný a zlatý' → Václav II. (stříbro) → Václav III. (1306 konec).",
      steps: [
        "Patron Čech = sv. Václav, 28. září = svátek",
        "Přemysl Otakar II. = 'král železný a zlatý', od Baltu po Jadrán",
        "Bitva na Moravském poli 1278 = konec moci Přemyslovců",
        "Václav III. 1306 = zánik dynastie",
      ],
      commonMistake: "Žáci si pletou Václava I. (sv. Václav, kníže) a Václava II. (král, otec Václava III.).",
      example: "Sv. Václav: kníže, šířil křesťanství, zavražděn 935, patron Čech.",
    },
  },
];
