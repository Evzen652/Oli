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
    question: "Doplň správný tvar: Žáci ___ (hrát) fotbal.",
    correctAnswer: "hráli",
    options: ["hrály", "hráli", "hrálo", "hrál"],
    hints: ["Žáci = mužský životný rod → přísudek s -i."],
  },
  {
    question: "Doplň správný tvar: Dívky ___ (zpívat) píseň.",
    correctAnswer: "zpívaly",
    options: ["zpívali", "zpívaly", "zpívalo", "zpíval"],
    hints: ["Dívky = ženský rod → přísudek s -y."],
  },
  {
    question: "Doplň správný tvar: Chlapci ___ (skočit) do vody.",
    correctAnswer: "skočili",
    options: ["skočily", "skočili", "skočilo", "skočil"],
    hints: ["Chlapci = mužský životný rod → -i."],
  },
  {
    question: "Doplň správný tvar: Holky ___ (běžet) domů.",
    correctAnswer: "běžely",
    options: ["běželi", "běžely", "běželo", "běžel"],
    hints: ["Holky = ženský rod → -y."],
  },
  {
    question: "Která věta je správně?",
    correctAnswer: "Žákyně hrály loutkové divadlo.",
    options: [
      "Žákyně hráli loutkové divadlo.",
      "Žákyně hrály loutkové divadlo.",
      "Žákyně hrálo loutkové divadlo.",
      "Žákyně hrál loutkové divadlo.",
    ],
    hints: ["Žákyně = ženský rod → hrály."],
  },
  {
    question: "Která věta je správně?",
    correctAnswer: "Hoši křičeli od radosti.",
    options: [
      "Hoši křičely od radosti.",
      "Hoši křičeli od radosti.",
      "Hoši křičelo od radosti.",
      "Hoši křičel od radosti.",
    ],
    hints: ["Hoši = mužský životný → křičeli."],
  },
  {
    question: "Doplň správný tvar: Ptáci ___ (odletět) na jih.",
    correctAnswer: "odletěli",
    options: ["odletěly", "odletěli", "odletělo", "odletěl"],
    hints: ["Ptáci = mužský životný rod → -i."],
  },
  {
    question: "Doplň správný tvar: Kočky ___ (spát) celé odpoledne.",
    correctAnswer: "spaly",
    options: ["spali", "spaly", "spalo", "spal"],
    hints: ["Kočky = ženský rod → -y."],
  },
  {
    question: "Doplň správný tvar: Stromy ___ (padat) ve větru.",
    correctAnswer: "padaly",
    options: ["padali", "padaly", "padalo", "padal"],
    hints: ["Stromy = mužský neživotný rod → -y."],
  },
  {
    question: "Doplň správný tvar: Kameny ___ (ležet) na cestě.",
    correctAnswer: "ležely",
    options: ["leželi", "ležely", "leželo", "ležel"],
    hints: ["Kameny = mužský neživotný rod → -y."],
  },
  {
    question: "Která věta je chybná?",
    correctAnswer: "Kluci hrály fotbal.",
    options: [
      "Kluci hráli fotbal.",
      "Kluci hrály fotbal.",
      "Kluci hrají fotbal.",
      "Kluci hráli fotbal správně.",
    ],
    hints: ["Kluci = mužský životný → hráli, ne hrály."],
  },
  {
    question: "Doplň správný tvar: Kamarádky ___ (přijít) včas.",
    correctAnswer: "přišly",
    options: ["přišli", "přišly", "přišlo", "přišel"],
    hints: ["Kamarádky = ženský rod → -y → přišly."],
  },
  {
    question: "Doplň správný tvar: Bratři ___ (jít) na výlet.",
    correctAnswer: "šli",
    options: ["šly", "šli", "šlo", "šel"],
    hints: ["Bratři = mužský životný → šli."],
  },
  {
    question: "Doplň správný tvar: Sestry ___ (jít) na výlet.",
    correctAnswer: "šly",
    options: ["šli", "šly", "šlo", "šla"],
    hints: ["Sestry = ženský rod → šly."],
  },
  {
    question: "Pravidlo shody přísudku s podmětem: mužský životný rod dostane koncovku:",
    correctAnswer: "-i / -li / -eli",
    options: ["-y / -ly / -ely", "-i / -li / -eli", "-o / -lo", "záleží na slovese"],
    hints: ["Chlapci hráli, skočili, přišli – vždy -i."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Doplň správný tvar: Bratři a sestry ___ (hrát) spolu.",
    correctAnswer: "hráli",
    options: ["hrály", "hráli", "hrálo", "hrál"],
    hints: ["Bratři = mužský životný → celá skupina dostane -i."],
  },
  {
    question: "Doplň správný tvar: Maminka a táta ___ (přijít) pozdě.",
    correctAnswer: "přišli",
    options: ["přišly", "přišli", "přišlo", "přišel"],
    hints: ["Táta = mužský životný → skupina dostane -i."],
  },
  {
    question: "Doplň správný tvar: Kočky a pes ___ (utéct) ze zahrady.",
    correctAnswer: "utekli",
    options: ["utekly", "utekli", "uteklo", "utekl"],
    hints: ["Pes = mužský životný → skupina dostane -i."],
  },
  {
    question: "Doplň správný tvar: Okna a dveře ___ (zůstat) otevřené.",
    correctAnswer: "zůstaly",
    options: ["zůstali", "zůstaly", "zůstalo", "zůstal"],
    hints: ["Okna (střední) + dveře (ženský) = žádný mužský životný → -y."],
  },
  {
    question: "Která věta je správně?",
    correctAnswer: "Lucie a Pavel šli do kina.",
    options: [
      "Lucie a Pavel šly do kina.",
      "Lucie a Pavel šli do kina.",
      "Lucie a Pavel šlo do kina.",
      "Lucie a Pavel šel do kina.",
    ],
    hints: ["Pavel = mužský životný → šli."],
  },
  {
    question: "Doplň správný tvar: Žáci a žákyně ___ (napsat) test.",
    correctAnswer: "napsali",
    options: ["napsaly", "napsali", "napsalo", "napsal"],
    hints: ["Žáci = mužský životný → napsali."],
  },
  {
    question: "Doplň správný tvar: Teta a strýc ___ (odjet) na dovolenou.",
    correctAnswer: "odjeli",
    options: ["odjely", "odjeli", "odjelo", "odjel"],
    hints: ["Strýc = mužský životný → odjeli."],
  },
  {
    question: "Doplň správný tvar: Tety a babičky ___ (odjet) na dovolenou.",
    correctAnswer: "odjely",
    options: ["odjeli", "odjely", "odjelo", "odjela"],
    hints: ["Tety a babičky = jen ženský rod → odjely."],
  },
  {
    question: "Ve větě 'Holky a kluci hráli volejbal.' je přísudek správně?",
    correctAnswer: "ano – kluci jsou mužský životný → hráli",
    options: [
      "ne – správně je hrály",
      "ano – kluci jsou mužský životný → hráli",
      "ne – správně je hrálo",
      "ano, ale jen proto, že holky jsou první",
    ],
    hints: ["Kluci = mužský životný → přísudek v mužském rodě."],
  },
  {
    question: "Ve větě 'Kvítky a tráva rostly na louce.' je přísudek správně?",
    correctAnswer: "ano – kvítky – střední a tráva – ženský = žádný mužský životný → rostly",
    options: [
      "ne – správně je rostli",
      "ne – správně je rostlo",
      "ano – kvítky (střední) a tráva (ženský) = žádný mužský životný → rostly",
      "záleží na louce",
    ],
    hints: ["Bez mužského životného rodu = -y."],
  },
  {
    question: "Doplň správný tvar: Ryby ___ (plavat) pomalu.",
    correctAnswer: "plávaly",
    options: ["plávali", "plávaly", "plávalo", "plával"],
    hints: ["Ryby = ženský rod → -y."],
  },
  {
    question: "Doplň správný tvar: Vlci ___ (vyběhnout) z lesa.",
    correctAnswer: "vyběhli",
    options: ["vyběhly", "vyběhli", "vyběhlo", "vyběhl"],
    hints: ["Vlci = mužský životný → -i."],
  },
  {
    question: "Doplň správný tvar: Housle a klarinet ___ (hrát) v orchestru.",
    correctAnswer: "hrály",
    options: ["hráli", "hrály", "hrálo", "hrál"],
    hints: ["Housle (ženský neživotný) + klarinet (mužský neživotný) = žádný živý → -y."],
  },
  {
    question: "Doplň správný tvar: Děti a dospělí ___ (sledovat) film.",
    correctAnswer: "sledovali",
    options: ["sledovaly", "sledovali", "sledovalo", "sledoval"],
    hints: ["Dospělí = mužský životný → sledovali."],
  },
  {
    question: "Ve větě 'Kluk a dívka přišli na oslavu.' – je přísudek správně?",
    correctAnswer: "ano – kluk je mužský životný → přišli",
    options: [
      "ne – správně je přišly",
      "ano – kluk je mužský životný → přišli",
      "ne – správně je přišlo",
      "záleží na tom, kdo přišel první",
    ],
    hints: ["I jeden mužský životný podmět = mužský rod přísudku."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Doplň správný tvar: Generálové ___ (pochodovat) v průvodu.",
    correctAnswer: "pochodovali",
    options: ["pochodovaly", "pochodovali", "pochodovalo", "pochodoval"],
    hints: ["Generálové = mužský životný množné číslo → -i."],
  },
  {
    question: "Doplň správný tvar: Učitelé a žáci ___ (diskutovat) o problému.",
    correctAnswer: "diskutovali",
    options: ["diskutovaly", "diskutovali", "diskutovalo", "diskutoval"],
    hints: ["Učitelé i žáci = mužský životný → -i."],
  },
  {
    question: "Která věta MÁ chybu v shodě?",
    correctAnswer: "Kamarádi a kamarádky přišly na oslavu.",
    options: [
      "Kamarádi a kamarádky přišli na oslavu.",
      "Kamarádi a kamarádky přišly na oslavu.",
      "Žáci a žákyně napsali test správně.",
      "Chlapci a dívky zpívali ve sboru.",
    ],
    hints: ["Kamarádi = mužský životný → přišli, ne přišly."],
  },
  {
    question: "Ve větě 'Slepice a kohouti hlasitě kokrhali.' je přísudek správně?",
    correctAnswer: "ano – kohouti jsou mužský životný → kokrhali",
    options: [
      "ne – správně je kokrhaly",
      "ne – správně je kokrhalo",
      "ano – kohouti jsou mužský životný → kokrhali",
      "záleží na počtu slepic",
    ],
    hints: ["Kohouti = mužský životný → přísudek v mužském rodě."],
  },
  {
    question: "Doplň správný tvar: Princové a princezny ___ (tančit) celou noc.",
    correctAnswer: "tančili",
    options: ["tančily", "tančili", "tančilo", "tančil"],
    hints: ["Princové = mužský životný → tančili."],
  },
  {
    question: "Proč říkáme 'Děti si hrály' a ne 'hráli', i když mezi nimi jsou chlapci?",
    correctAnswer: "slovo 'děti' je gramaticky ženského rodu → hrály; ale 'chlapci a dívky hráli'",
    options: [
      "protože děti jsou menší",
      "slovo 'děti' je gramaticky ženského rodu → hrály; ale 'chlapci a dívky hráli'",
      "děti vždy dostane -li",
      "záleží na konkrétní větě",
    ],
    hints: ["Gramatický rod slova 'děti' je ženský → hrály. Záleží na tvaru slova, ne na pohlaví."],
  },
  {
    question: "Doplň správný tvar: Studenti a studentky ___ (složit) zkoušky.",
    correctAnswer: "složili",
    options: ["složily", "složili", "složilo", "složil"],
    hints: ["Studenti = mužský životný → složili."],
  },
  {
    question: "Ve větě 'Tygři a lvice utekly ze zoo.' – je chyba?",
    correctAnswer: "ano – tygři jsou mužský životný → utekli",
    options: [
      "ne – lvice jsou ženský → utekly",
      "ano – tygři jsou mužský životný → utekli",
      "ne – záleží na tom, koho je více",
      "ano – chybí čárka",
    ],
    hints: ["I jeden mužský živý podmět (tygři) způsobí -i."],
  },
  {
    question: "Jak správně doplnit: Páv a pávi ___ (tančit) na dvorku.",
    correctAnswer: "tančili",
    options: ["tančily", "tančili", "tančilo", "tančil"],
    hints: ["Páv a pávi = mužský životný (ptáci) → tančili."],
  },
  {
    question: "Ve větě 'Skály a hory tyčily se k nebi.' – je přísudek správně?",
    correctAnswer: "ano – skály – ženský neživotný + hory – ženský neživotný = -y",
    options: [
      "ne – správně je tyčili",
      "ne – správně je tyčilo",
      "ano – skály (ženský neživotný) + hory (ženský neživotný) = -y",
      "záleží na výšce hor",
    ],
    hints: ["Oba podměty jsou ženského neživotného rodu → -y."],
  },
  {
    question: "Doplň správný tvar: Králové a šlechtici ___ (sedět) u stolu.",
    correctAnswer: "seděli",
    options: ["seděly", "seděli", "sedělo", "seděl"],
    hints: ["Králové i šlechtici = mužský životný → seděli."],
  },
  {
    question: "Ve větě 'Ženy a muži tančili celou noc.' – je správně?",
    correctAnswer: "ano – muži jsou mužský životný → tančili",
    options: [
      "ne – správně je tančily",
      "ano – muži jsou mužský životný → tančili",
      "záleží na tom, zda je žen víc",
      "ne – správně je tančilo",
    ],
    hints: ["Přítomnost mužských živých podmětů = mužský rod přísudku."],
  },
  {
    question: "Doplň správný tvar: Stromy a keře ___ (rozvít se) na jaře.",
    correctAnswer: "rozvily se",
    options: ["rozvili se", "rozvily se", "rozvinulo se", "rozvil se"],
    hints: ["Stromy (mužský neživotný) + keře (mužský neživotný) = -y."],
  },
  {
    question: "Doplň správný tvar: Myši a krysy ___ (sníst) zásoby.",
    correctAnswer: "snědly",
    options: ["snědli", "snědly", "snědlo", "snědl"],
    hints: ["Myši a krysy = ženský rod → -y."],
  },
  {
    question: "Ve větě 'Hasiči a záchranáři přijeli rychle.' – je přísudek správně?",
    correctAnswer: "ano – hasiči i záchranáři = mužský životný → přijeli",
    options: [
      "ne – správně je přijely",
      "ano – hasiči i záchranáři = mužský životný → přijeli",
      "ne – správně je přijelo",
      "záleží na situaci",
    ],
    hints: ["Oba podměty jsou mužského životného rodu → přijeli."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const SHODAPRISUDKUSPODMETEM: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-skladba-shoda-prisudku-s-podmetem",
    rvpNodeId: "g5-cjl-jazykova-vychova-skladba-shoda-prisudku-s-podmetem",
    title: "Shoda přísudku s podmětem",
    studentTitle: "Shoda přísudku s podmětem",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Procvičíš správné koncovky sloves – hrali nebo hraly.",
    keywords: ["shoda přísudku", "podmět", "rod", "hrali hraly", "koncovky sloves"],
    goals: [
      "Doplnit správnou koncovku přísudku podle rodu a čísla podmětu",
      "Rozlišit mužský životný od ostatních rodů",
      "Správně určit shodu při několikanásobném podmětu",
    ],
    boundaries: [
      "Neprobíráme složité větné vzorce",
      "Bez historické gramatiky",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Najdi podmět a zjisti jeho rod. Mužský životný → -i/-li. Ostatní rody (ženský, střední, mužský neživotný) → -y/-ly.",
      steps: [
        "Najdi podmět ve větě.",
        "Zjisti rod podmětu: je mužský životný (chlapec, pes, strom)?",
        "Mužský životný → přísudek s -i (hráli, přišli).",
        "Ostatní → přísudek s -y (hrály, přišly).",
        "Při několikanásobném podmětu: stačí jeden mužský životný → -i.",
      ],
      commonMistake: "Žáci zaměňují mužský životný s mužským neživotným (stromy, kameny → hrály, ne hráli).",
      example: "Chlapci hráli (mužský životný → -i). Dívky hrály (ženský → -y). Stromy padaly (mužský neživotný → -y).",
    },
  },
];
