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
    question: "Jaký je podmět ve větě 'Petr čte knihu.'?",
    correctAnswer: "Petr",
    options: ["Petr", "čte", "knihu", "není tam podmět"],
    hints: ["Podmět odpovídá na otázku KDO? nebo CO? dělá to, co říká přísudek."],
    explanation: "Přísudek je 'čte'. Ptáme se: Kdo čte? — Petr. Slovo 'knihu' je ve 4. pádu (koho, co čte), takže je to předmět, ne podmět.",
  },
  {
    question: "Jaký je podmět ve větě 'Pes štěká.'?",
    correctAnswer: "pes",
    options: ["štěká", "pes", "věta nemá podmět", "hlasitě"],
    hints: ["Zeptej se: Kdo štěká?"],
    explanation: "Přísudek je 'štěká'. Kdo štěká? — pes. Podmět je vždy v 1. pádu, proto jím nemůže být sloveso 'štěká' ani příslovce 'hlasitě'.",
  },
  {
    question: "Jaký je podmět ve větě 'Čtu.'?",
    correctAnswer: "já",
    options: ["ty", "čtu", "já", "věta nemá podmět"],
    hints: ["Z koncovky slovesa 'čtu' poznáš osobu. Kdo čte?"],
    explanation: "Koncovka -u ve tvaru 'čtu' patří 1. osobě jednotného čísla, takže podmět je 'já'. Ve větě napsaný není — jde o podmět nevyjádřený, ale věta ho má.",
  },
  {
    question: "Ve větě 'Pojďme do kina.' jaký je podmět?",
    correctAnswer: "my",
    options: ["pojďme", "kino", "žádný", "my"],
    hints: ["Koho zahrnuje výzva 'pojďme'? Odvoď z tvaru slovesa."],
    explanation: "Tvar 'pojďme' je 1. osoba množného čísla, takže mluvčí zahrnuje i sebe — podmět je nevyjádřené 'my'.",
  },
  {
    question: "Ve větě 'Petr a Jana přišli.' je podmět:",
    correctAnswer: "několikanásobný",
    options: ["několikanásobný", "nevyjádřený", "vyjádřený jedním slovem", "žádný"],
    hints: ["Kolik osob ve větě dělá to, co říká sloveso?"],
    explanation: "Přišli dva lidé — Petr a Jana. Když má věta dva nebo více podmětů spojených souřadně, mluvíme o několikanásobném podmětu. Vyjádřený je, protože oba jsou ve větě napsaní.",
  },
  {
    question: "Podmět vyjádřený je:",
    correctAnswer: "přímo napsaný nebo řečený ve větě",
    options: [
      "skrytý v koncovce slovesa",
      "přímo napsaný nebo řečený ve větě",
      "vždy zájmeno",
      "vždy přídavné jméno",
    ],
    hints: ["Co znamená slovo 'vyjádřit'? Je takový podmět ve větě vidět?"],
    explanation: "Vyjádřený podmět ve větě přímo vidíš ('Petr čte.'). Když je skrytý jen v koncovce slovesa ('Čtu.'), je to podmět nevyjádřený. Slovní druh o tom nerozhoduje.",
  },
  {
    question: "Ve větě 'Hrajete si venku.' jaký je podmět?",
    correctAnswer: "vy",
    options: ["hrajete", "venku", "vy", "si"],
    hints: ["Z koncovky 'hrajete' poznáš osobu. Kdo si hraje?"],
    explanation: "Koncovka -ete patří 2. osobě množného čísla, takže podmět je nevyjádřené 'vy'. Slovo 'venku' odpovídá na otázku kde — je to příslovečné určení místa.",
  },
  {
    question: "Ve větě 'Slunce svítí.' jaký je podmět?",
    correctAnswer: "slunce",
    options: ["svítí", "žádný", "světlo", "slunce"],
    hints: ["Zeptej se: Co svítí?"],
    explanation: "Přísudek je 'svítí'. Co svítí? — slunce. Slovo 'světlo' ve větě vůbec není, takže podmětem být nemůže.",
  },
  {
    question: "Ve větě 'Zpívám a tancuji.' jaký je podmět?",
    correctAnswer: "já",
    options: ["já", "já a ty", "zpívám", "tancuji"],
    hints: ["Kdo zpívá a kdo tancuje? Je to stejná osoba?"],
    explanation: "Obě slovesa mají koncovku 1. osoby jednotného čísla, takže je koná tentýž člověk. Věta má jediný nevyjádřený podmět 'já' pro obě slovesa, ne dva různé.",
  },
  {
    question: "Ve větě 'Babička a děda sedí na lavičce.' jaký je podmět?",
    correctAnswer: "babička a děda",
    options: ["babička", "babička a děda", "děda", "lavička"],
    hints: ["Kolik osob sedí na lavičce?"],
    explanation: "Sedí dva lidé, takže podmět tvoří obě jména dohromady — je několikanásobný. 'Lavička' odpovídá na otázku kde, je to příslovečné určení místa.",
  },
  {
    question: "Jak poznáš nevyjádřený podmět?",
    correctAnswer: "z tvaru slovesa – koncovky poznáš, kdo je podmět",
    options: ["nelze ho vůbec poznat", "vždy je to 'já'", "z tvaru slovesa – koncovky poznáš, kdo je podmět", "věta bez napsaného podmětu žádný podmět nemá"],
    hints: ["Zkus měnit koncovku: čtu/čteš/čte. Co ti prozradí o tom, kdo jedná?"],
    explanation: "Koncovka slovesa nese osobu i číslo: čtu = já, čteš = ty, čteme = my. Podle ní podmět bezpečně odvodíš, i když ve větě napsaný není.",
  },
  {
    question: "Ve větě 'Ptáci odletěli na jih.' je podmět:",
    correctAnswer: "ptáci",
    options: ["odletěli", "jih", "věta podmět nemá", "ptáci"],
    hints: ["Zeptej se: Kdo odletěl na jih?"],
    explanation: "Kdo odletěl? — ptáci. Slovo 'jih' odpovídá na otázku kam, je to tedy příslovečné určení místa.",
  },
  {
    question: "Ve větě 'Mlčte!' jaký je podmět?",
    correctAnswer: "vy",
    options: ["vy", "já", "mlčte", "věta nemá podmět"],
    hints: ["Komu je příkaz 'Mlčte!' určen?"],
    explanation: "Rozkaz 'Mlčte!' je ve 2. osobě množného čísla, takže je určen tomu, s kým mluvíme — podmět je nevyjádřené 'vy'. Rozkazovací věty podmět mají, jen ho nepíšeme.",
  },
  {
    question: "Ve větě 'Lucie, Tomáš a Ondřej skočili do vody.' jaký je podmět?",
    correctAnswer: "Lucie, Tomáš a Ondřej",
    options: ["Lucie", "Lucie, Tomáš a Ondřej", "Tomáš a Ondřej", "voda"],
    hints: ["Kolik jmen dělá to, co říká sloveso?"],
    explanation: "Skočili všichni tři, takže do podmětu patří všechna tři jména — je několikanásobný. Vynechat kohokoli z nich by změnilo smysl věty.",
  },
  {
    question: "Podmět ve větě odpovídá na otázku:",
    correctAnswer: "Kdo? nebo Co?",
    options: ["Koho? Čeho?", "Kdy? Kde?", "Kdo? nebo Co?", "Jak? Proč?"],
    hints: ["Podmět je v 1. pádu. Jakou otázkou se na 1. pád ptáš?"],
    explanation: "Podmět stojí v 1. pádu, na který se ptáme 'kdo, co'. Otázka 'koho, čeho' patří 2. pádu a vedla by k předmětu, ne k podmětu.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Ve větě 'Prší.' jaký je podmět?",
    correctAnswer: "žádný",
    options: ["déšť", "počasí", "ono", "žádný"],
    hints: ["Zkus se zeptat: kdo nebo co prší? Jde to vůbec?"],
    explanation: "Na otázku 'kdo nebo co prší' nelze odpovědět — děj nikdo nekoná. Taková věta se jmenuje bezpodmětová a podmět nemá ani vyjádřený, ani nevyjádřený. Slova 'déšť' a 'počasí' ve větě vůbec nejsou.",
  },
  {
    question: "Ve větě 'Sněží a fouká.' jaký je podmět?",
    correctAnswer: "žádný",
    options: ["žádný", "vítr a sníh", "ono", "počasí"],
    hints: ["Dá se říct, kdo sněží a kdo fouká?"],
    explanation: "Obě slovesa popisují počasí, které nikdo nekoná — věta je bezpodmětová. Nejde tedy o několikanásobný podmět, přestože jsou slovesa dvě.",
  },
  {
    question: "Jak se liší vyjádřený a nevyjádřený podmět?",
    correctAnswer: "vyjádřený je přímo ve větě, nevyjádřený je skryt v tvaru slovesa",
    options: ["vyjádřený je vždy na začátku věty", "vyjádřený je přímo ve větě, nevyjádřený je skryt v tvaru slovesa", "nevyjádřený vůbec neexistuje", "nevyjádřený se týká jen rozkazovacích vět"],
    hints: ["U kterého z nich vidíš podmět přímo a u kterého ne?"],
    explanation: "Rozdíl je jen v tom, jestli podmět ve větě vidíš. Oba typy podmět mají — nevyjádřený ho nese v koncovce slovesa. Pozice ve větě ani druh věty o tom nerozhodují.",
  },
  {
    question: "Ve větě 'Přijdu a pomůžu.' jaký je podmět?",
    correctAnswer: "já",
    options: ["já a ty", "přijdu", "já", "pomůžu"],
    hints: ["Urči osobu sloves 'přijdu' a 'pomůžu'. Je stejná?"],
    explanation: "Obě slovesa jsou v 1. osobě jednotného čísla, takže je koná stejný člověk. Věta má jediný nevyjádřený podmět 'já', ne několikanásobný.",
  },
  {
    question: "Ve větě 'Knihy a filmy jsou moje záliby.' jaký je podmět?",
    correctAnswer: "knihy a filmy",
    options: ["jen knihy", "jen filmy", "záliby", "knihy a filmy"],
    hints: ["Kolik věcí ve větě je tím, o čem se mluví?"],
    explanation: "Zálibami jsou knihy i filmy, takže podmět je několikanásobný. Slovo 'záliby' patří k přísudku ('jsou záliby'), ne k podmětu.",
  },
  {
    question: "Podmět a přísudek se shodují v:",
    correctAnswer: "osobě a čísle",
    options: ["osobě a čísle", "délce slov", "pořadí ve větě", "počtu slabik"],
    hints: ["Já jdu, ty jdeš, on jde – podmět a přísudek se shodují."],
    explanation: "Přísudek přebírá od podmětu osobu a číslo (já jdu — my jdeme). Je-li přísudek v minulém čase (příčestí), přidává se navíc shoda v rodě: chlapci šli — dívky šly.",
  },
  {
    question: "Ve větě 'Loni jsme jeli na výlet.' jaký je podmět?",
    correctAnswer: "my",
    options: ["já", "my", "vy", "loni"],
    hints: ["Urči osobu a číslo slovesa 'jsme jeli'. Kdo to je?"],
    explanation: "Tvar 'jsme jeli' je 1. osoba množného čísla, takže podmět je nevyjádřené 'my'. Slovo 'loni' odpovídá na otázku kdy — je to příslovečné určení času.",
  },
  {
    question: "Ve větě 'Chtěla bych více spát.' jaký je podmět?",
    correctAnswer: "já",
    options: ["ona", "ty", "já", "chtěla"],
    hints: ["Z tvaru 'chtěla bych' poznáš osobu i rod. Kdo mluví?"],
    explanation: "Pomocné 'bych' patří 1. osobě jednotného čísla, takže podmět je 'já'. Koncovka -a v příčestí 'chtěla' navíc prozrazuje, že mluvčí je žena.",
  },
  {
    question: "Ve větě 'Maminka a tatínek přišli.' – proč je přísudek 'přišli' (ne 'přišly')?",
    correctAnswer: "mezi podměty je tatínek – mužský rod",
    options: ["maminka je hlavní podmět", "podměty jsou dva", "tatínek rozhoduje vždy", "mezi podměty je tatínek – mužský rod"],
    hints: ["Kdyby přišly maminka a teta, napsal bys přísudek stejně? Co se ve větě změnilo?"],
    explanation: "U několikanásobného podmětu stačí jediný podmět mužského rodu životného a přísudek dostane koncovku -i. Nerozhoduje pořadí ani počet podmětů — kdyby přišly maminka a teta, psalo by se 'přišly'.",
  },
  {
    question: "Ve větě 'Ryby a ptáci jsou obratlovci.' je přísudek 'jsou'. Proč?",
    correctAnswer: "podmět je několikanásobný, tedy množné číslo",
    options: ["podmět je několikanásobný, tedy množné číslo", "protože obratlovci je množné číslo", "protože 'jsou' je vždy správně", "záleží na pořadí podmětů"],
    hints: ["Kolik podmětů je ve větě? Jak to ovlivní číslo přísudku?"],
    explanation: "Přísudek se řídí podmětem, ne jménem za slovesem 'být'. Podměty jsou dva (ryby, ptáci), dohromady tedy množné číslo, a proto 'jsou'.",
  },
  {
    question: "Ve větě 'Ráno se probudil a šel do školy.' jaký je podmět?",
    correctAnswer: "on",
    options: ["ráno", "on", "já", "škola"],
    hints: ["Z tvaru 'probudil a šel' poznáš rod a osobu. Kdo to byl?"],
    explanation: "Příčestí 'probudil' a 'šel' jsou ve 3. osobě jednotného čísla mužského rodu, takže podmět je nevyjádřené 'on'. Slovo 'ráno' je příslovečné určení času.",
  },
  {
    question: "Co je bezpodmětová věta?",
    correctAnswer: "věta, která nemá podmět vyjádřený ani nevyjádřený",
    options: ["věta, která má podmět skrytý v koncovce slovesa", "věta, která nemá přísudek, jen podmět", "věta, která nemá podmět vyjádřený ani nevyjádřený", "věta, která vyjadřuje příkaz nebo zákaz"],
    hints: ["Prší, sněží, svítá – nikdo konkrétní to nedělá."],
    explanation: "U bezpodmětové věty se nedá odpovědět na otázku 'kdo, co' — děj nikdo nekoná (prší, svítá). Liší se tím od věty s nevyjádřeným podmětem, kde podmět existuje a poznáš ho z koncovky.",
  },
  {
    question: "Ve větě 'Čtu a píšu zároveň.' kolik podmětů je?",
    correctAnswer: "jeden",
    options: ["žádný", "dva", "tři", "jeden"],
    hints: ["Urči osobu obou sloves. Patří jednomu, nebo dvěma lidem?"],
    explanation: "Obě slovesa jsou v 1. osobě jednotného čísla, takže je koná tentýž člověk — jeden nevyjádřený podmět 'já' platí pro obě. Počet sloves nerozhoduje o počtu podmětů.",
  },
  {
    question: "Ve větě 'Lenka, Pavel a Mirka zpívali.' je přísudek 'zpívali'. Proč?",
    correctAnswer: "Pavel je mužský rod životný",
    options: ["Pavel je mužský rod životný", "protože jsou tři podměty", "protože Lenka je první", "'zpívali' je vždy správný tvar"],
    hints: ["Kdyby zpívaly jen Lenka a Mirka, napsal bys přísudek stejně? Kdo do skupiny přibyl?"],
    explanation: "Stačí jediný podmět mužského rodu životného a přísudek dostane koncovku -i. Kdyby zpívaly jen Lenka a Mirka, psalo by se 'zpívaly'. Na pořadí ani na počtu podmětů nezáleží.",
  },
  {
    question: "Ve větě 'Učte se pilně!' jaký je podmět?",
    correctAnswer: "vy",
    options: ["já", "vy", "on", "žádný"],
    hints: ["Komu je výzva 'Učte se!' určena?"],
    explanation: "Rozkaz je ve 2. osobě množného čísla, takže podmět je nevyjádřené 'vy'. Rozkazovací věta podmět má — jen se nepíše.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Ve větě 'Ona i její sestra přišly pozdě.' proč je přísudek 'přišly'?",
    correctAnswer: "oba podměty jsou ženského rodu",
    options: ["podmětem je jen sestra", "podmětem je jen 'ona'", "oba podměty jsou ženského rodu", "rozhoduje sloveso, ne podmět"],
    hints: ["Jakého rodu jsou 'ona' a 'sestra'? Co z toho plyne pro přísudek?"],
    explanation: "Několikanásobný podmět tvoří 'ona' a 'sestra' — obojí ženský rod, proto má příčestí koncovku -y. Kdyby ve skupině byl jediný muž, psalo by se 'přišli'.",
  },
  {
    question: "Ve větě 'Kdo to udělal?' co je podmět a jaký je to slovní druh?",
    correctAnswer: "kdo – tázací zájmeno",
    options: ["to – ukazovací zájmeno", "udělal – sloveso", "věta podmět nemá", "kdo – tázací zájmeno"],
    hints: ["Které slovo je v 1. pádu a ptá se po původci děje?"],
    explanation: "Podmět nemusí být podstatné jméno. Tady je jím tázací zájmeno v 1. pádu, kterým se ptáme právě po tom, kdo děj vykonal. Slovo 'to' je ve 4. pádu, tedy předmět.",
  },
  {
    question: "Ve větě 'Nikdo nepřišel.' co je podmět a jaký je to slovní druh?",
    correctAnswer: "nikdo – záporné zájmeno",
    options: ["nikdo – záporné zájmeno", "nepřišel – sloveso", "nevyjádřený podmět 'já'", "věta podmět nemá"],
    hints: ["Kdo nepřišel? Které slovo to vyjadřuje?"],
    explanation: "Věta podmět má, i když popisuje, že nikdo nic neudělal — je jím záporné zájmeno v 1. pádu. Proto nejde o větu bezpodmětovou.",
  },
  {
    question: "Ve větě 'Zpívat je zdravé.' co je podmět a jaký je to tvar?",
    correctAnswer: "zpívat – infinitiv",
    options: ["zdravé – přídavné jméno", "zpívat – infinitiv", "je – sloveso", "věta podmět nemá"],
    hints: ["Co je zdravé? Které slovo to říká?"],
    explanation: "Ptáme se: Co je zdravé? — zpívat. V roli podmětu tu stojí neurčitý tvar slovesa, takže podmětem nemusí být jen podstatné jméno nebo zájmeno.",
  },
  {
    question: "Ve větě 'Kočky, pes a křeček utekli.' proč je přísudek 'utekli'?",
    correctAnswer: "mezi podměty je pes – mužský rod životný",
    options: ["protože je tam nejvíc koček", "'utekli' je jediný možný tvar", "mezi podměty je pes – mužský rod životný", "protože křeček stojí poslední"],
    hints: ["Kdyby utekly jen kočky, napsal bys přísudek stejně? Kdo do skupiny přibyl?"],
    explanation: "Pravidlo platí bez ohledu na počet a pořadí: jediný podmět mužského rodu životného přebije ostatní a přísudek dostane -i. Kdyby utekly jen kočky, psalo by se 'utekly'.",
  },
  {
    question: "Ve větě 'Bylo veselo.' jaký je podmět?",
    correctAnswer: "žádný",
    options: ["ono", "veselo", "bylo", "žádný"],
    hints: ["Dá se říct, kdo nebo co je veselo?"],
    explanation: "Věta popisuje stav, který nikdo nekoná — na otázku 'kdo, co' se odpovědět nedá. Je proto bezpodmětová, stejně jako 'Prší.' nebo 'Svítá.'",
  },
  {
    question: "Ve větě 'Hoši a dívky zpívaly sborově.' je tvar přísudku v pořádku?",
    correctAnswer: "ne, má být 'zpívali'",
    options: ["ne, má být 'zpívali'", "ano, protože jsou tam i dívky", "ano, záleží na pořadí slov", "oba tvary jsou přijatelné"],
    hints: ["Jsou ve skupině 'hoši'? Jakého jsou rodu a co to udělá s přísudkem?"],
    explanation: "Ve skupině jsou hoši — mužský rod životný, a ten určuje koncovku -i pro celý několikanásobný podmět. Správně je tedy 'Hoši a dívky zpívali sborově.'",
  },
  {
    question: "Může být podmětem celá vedlejší věta?",
    correctAnswer: "ano – např. 'Kdo chce, může jít.'",
    options: [
      "ne – podmět je vždy jen jedno slovo",
      "ano – např. 'Kdo chce, může jít.'",
      "jen v básních",
      "jen v rozkazovacích větách",
    ],
    hints: ["Zkus najít, na co se ptáš 'kdo?' nebo 'co?' v téhle větě — je to jen jedno slovo, nebo víc?"],
    explanation: "Ptáme se: Kdo může jít? — kdo chce. Odpovědí je celá vedlejší věta, která tak zastupuje podmět. Podmět proto nemusí být jediné slovo.",
  },
  {
    question: "Ve větě 'Tři chlapci přišli.' slovo 'tři' je:",
    correctAnswer: "součást podmětu",
    options: ["přísudek", "podmět samotný", "součást podmětu", "příslovečné určení"],
    hints: ["Zkus říct větu bez slova 'tři'. Změní se tím, kdo přišel?"],
    explanation: "Ptáme se: Kdo přišel? — tři chlapci. Číslovka blíže určuje podstatné jméno, patří tedy k podmětu, ale sama podmětem není.",
  },
  {
    question: "Co musíš vždy zkontrolovat po nalezení podmětu?",
    correctAnswer: "shodu přísudku s podmětem",
    options: ["délku podmětu ve slabikách", "pořadí podmětu ve větě", "interpunkci za podmětem", "shodu přísudku s podmětem"],
    hints: ["Když máš podmět, co dalšího musíš ověřit u přísudku?"],
    explanation: "Přísudek se musí s podmětem shodovat v osobě a čísle a v minulém čase (u příčestí) i v rodě. Právě tam vznikají chyby typu 'chlapci šly'.",
  },
  {
    question: "Ve větě 'Co máš nového?' jaký je podmět?",
    correctAnswer: "ty",
    options: ["ty", "co", "nového", "věta podmět nemá"],
    hints: ["Z tvaru 'máš' poznáš osobu. Komu je otázka určena?"],
    explanation: "Koncovka -š patří 2. osobě jednotného čísla, takže podmět je nevyjádřené 'ty'. Slovo 'co' je tu ve 4. pádu (co máš), jde tedy o předmět.",
  },
  {
    question: "Ve větě 'Říká se, že...' slovo 'se' je:",
    correctAnswer: "zvratné zájmeno",
    options: ["podmět", "zvratné zájmeno", "přísudek", "příslovečné určení"],
    hints: ["Vyjadřuje 'se' nějakého konkrétního původce děje?"],
    explanation: "'Se' patří ke slovesu jako jeho zvratná část, nikoho neoznačuje. Věta tak nemá původce děje a je neosobní — proto ani podmět.",
  },
  {
    question: "Ve větě 'Maminka a tatínek hráli karty.' jsou oba podměty životné?",
    correctAnswer: "ano, oba jsou životní",
    options: ["ne, maminka je neživotná", "ne, oba jsou neživotní", "ano, oba jsou životní", "životný je jen tatínek"],
    hints: ["Jsou maminka i tatínek životní? Který určí rod přísudku?"],
    explanation: "Životní jsou oba, ale rod přísudku určí tatínek — mužský rod životný má přednost, proto 'hráli'. Kdyby hrály maminka a babička, psalo by se 'hrály'.",
  },
  {
    question: "Jak se nazývá věta, kde podmět není vyjádřen ani v koncovce (jako 'prší')?",
    correctAnswer: "bezpodmětová věta",
    options: ["věta s nevyjádřeným podmětem", "holá věta", "tázací věta", "bezpodmětová věta"],
    hints: ["Předpona 'bez-' ti napoví. Věta bez čeho?"],
    explanation: "U věty s nevyjádřeným podmětem podmět existuje a odvodíš ho z koncovky ('Čtu.' = já). U 'Prší.' žádný původce děje není, proto bezpodmětová.",
  },
  {
    question: "Ve větě 'Zima se blíží.' jaký je podmět?",
    correctAnswer: "zima",
    options: ["zima", "se", "blíží", "věta podmět nemá"],
    hints: ["Zeptej se: Co se blíží? Pozor, 'se' není podmět."],
    explanation: "Co se blíží? — zima. Slovo 'se' patří ke slovesu jako jeho zvratná část, samo nikoho ani nic neoznačuje, takže podmětem být nemůže.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const PODMETVYJADRENYNEVYJADRENYNEKOLIKANASOBNY: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-skladba-podmet-vyjadreny-nevyjadreny-nekolikanasobny",
    rvpNodeId: "g5-cjl-jazykova-vychova-skladba-podmet-vyjadreny-nevyjadreny-nekolikanasobny",
    title: "Podmět vyjádřený, nevyjádřený, několikanásobný",
    studentTitle: "Podmět věty",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Najdeš podmět věty, i když není napsaný.",
    keywords: ["podmět", "vyjádřený podmět", "nevyjádřený podmět", "několikanásobný podmět", "skladba"],
    goals: [
      "Najít podmět ve větě",
      "Rozlišit vyjádřený, nevyjádřený a několikanásobný podmět",
      "Určit rod nevyjádřeného podmětu z tvaru slovesa",
    ],
    boundaries: [
      "Neprobíráme složité větné vzorce",
      "Bez pokročilé syntaktické analýzy",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Najdi přísudek (sloveso) a zeptej se: KDO nebo CO to dělá? Odpověď je podmět. Pokud není napsáno, zkus si ho odvodit z koncovky slovesa.",
      steps: [
        "Najdi sloveso (přísudek) ve větě.",
        "Zeptej se: KDO nebo CO dělá to, co říká sloveso?",
        "Pokud odpověď není ve větě = nevyjádřený podmět (odvoď ho z koncovky).",
        "Pokud jsou odpovědi dvě nebo více = několikanásobný podmět.",
      ],
      commonMistake: "Žáci označí za podmět příslovečné určení nebo předmět. Podmět je vždy v 1. pádu (kdo? co?).",
      example: "'Čtu.' – podmět 'já' (nevyjádřený). 'Pavel a Lucie přišli.' – podmět 'Pavel a Lucie' (několikanásobný).",
    },
  },
];
