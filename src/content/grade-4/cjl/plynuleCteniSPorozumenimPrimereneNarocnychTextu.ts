import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface TFItem { q: string; a: "ano" | "ne"; hint: string }

// Level 1: zakladni ctenarske strategie
const POOL_L1: TFItem[] = [
  { q: "Kdyz nerozumim slovu, mam vzdy prestat cist.", a: "ne", hint: "Zkusime odhadnout vyznam z kontextu nebo pokracovat dale." },
  { q: "Hlavní myšlenka textu je nejdůležitější sdělení, které chce autor předat.", a: "ano", hint: "Hlavní myšlenka drží celý text pohromadě." },
  { q: "Přečíst text rychle bez zastavení zaručuje jeho porozumění.", a: "ne", hint: "Rychlé čtení neznamená porozumění — potřebujeme přemýšlet." },
  { q: "Kontext jsou okolní věty, které pomáhají pochopit neznámé slovo.", a: "ano", hint: "Kontext = okolí slova, ze kterého odhadujeme jeho význam." },
  { q: "Otázka 'Proč' pomáhá zjistit příčinu nebo důvod děje v textu.", a: "ano", hint: "Proč = příčina, kde = místo, kdo = postava, kdy = čas." },
  { q: "Když přečteme nadpis, víme vždy celý obsah textu.", a: "ne", hint: "Nadpis naznačuje téma, ale obsah textu je mnohem bohatší." },
  { q: "Porozumění textu znamená, že dokážeme odpovědět na otázky kdo, co, kde, kdy, proč.", a: "ano", hint: "Tyto otázky pokrývají základní složky porozumění." },
  { q: "Literární text (pohádka, povídka) vždy podává objektivní fakta.", a: "ne", hint: "Literární text vyjadřuje příběhy a pocity, ne nutně fakta." },
  { q: "Věcný text (encyklopedie, zpráva) podává informace a fakta.", a: "ano", hint: "Věcný = informační text = zaměřen na fakta, ne na příběh." },
  { q: "Po přečtení odstavce je dobré shrnout, co jsme přečetli, vlastními slovy.", a: "ano", hint: "Shrnutí je ověření porozumění." },
  { q: "Inference (vyvozování) znamená opisovat text doslova.", a: "ne", hint: "Vyvozování = odhadujeme to, co není přímo napsáno, ze stop v textu." },
  { q: "'Martin přišel domů mokrý.' — z toho vyvozujeme, že pravděpodobně pršelo.", a: "ano", hint: "Mokrý = stopa; pršelo nebo dostal se do vody — vyvozujeme." },
  { q: "Klíčová slova jsou ta, která nejlépe vystihují téma textu.", a: "ano", hint: "Klíčová slova se zpravidla opakují a shrnují téma." },
  { q: "Číst text podruhé nemá žádný smysl.", a: "ne", hint: "Opakované čtení pomáhá odhalit to, čemu jsme neporozuměli poprvé." },
  { q: "Otázka 'Kdo' v textu zjišťuje postavy nebo aktéry textu.", a: "ano", hint: "Kdo = postava, aktér, původce děje." },
  { q: "Přeskočení těžkých slov v textu je nejlepší strategie čtení s porozuměním.", a: "ne", hint: "Lépe odhadnout z kontextu nebo vyhledat ve slovníku." },
  { q: "Zastavení se a přemýšlení o obsahu (stop-and-think) zlepšuje porozumění.", a: "ano", hint: "Aktivní čtení = zastavíme se a ověřujeme, co jsme pochopili." },
  { q: "Předvídání v textu znamená odhadovat, co se stane dál, na základě stop.", a: "ano", hint: "Předvídání je aktivní čtenářská strategie." },
  { q: "Délka textu určuje, jak dobře mu porozumíme.", a: "ne", hint: "Porozumění závisí na naší strategii, ne na délce textu." },
  { q: "Záměr autora textu je to, co chce autor říct nebo čeho textem dosáhnout.", a: "ano", hint: "Záměr = proč autor text napsal." },
  { q: "Každé slovo v textu je stejně důležité a musíme si je zapamatovat.", a: "ne", hint: "Soustředíme se na klíčová slova a hlavní myšlenku." },
  { q: "Čtenářská strategie je záměrný přístup k textu (předvídání, vyvozování, shrnutí).", a: "ano", hint: "Strategie = plánovaný způsob, jak číst a porozumět." },
  { q: "Pokud přečteme text rychle, automaticky mu porozumíme lépe.", a: "ne", hint: "Rychlost čtení a porozumění spolu nesouvisejí přímo." },
  { q: "Odpověď na otázku může být v textu přímo napsána nebo ji musíme vyvodit.", a: "ano", hint: "Buď hledáme doslova, nebo vyvozujeme ze stop." },
  { q: "Při čtení s porozuměním je vhodné číst pomalu a soustředěně.", a: "ano", hint: "Soustředěné čtení umožňuje zpracovat obsah textu." },
  { q: "Pokud text nerozumíme hned, není důvod ho číst znovu.", a: "ne", hint: "Opakované čtení je běžná a účinná strategie porozumění." },
  { q: "Hlavní myšlenka textu je vždy v první větě prvního odstavce.", a: "ne", hint: "Hlavní myšlenka může být kdekoli — na začátku, uprostřed i na konci." },
  { q: "Vyvozování záměru autora pomáhá pochopit, proč text vznikl.", a: "ano", hint: "Autor psal s určitým cílem — vyvozujeme, jakým." },
  { q: "Shrnutí textu jednou větou ukazuje, zda jsme mu skutečně porozuměli.", a: "ano", hint: "Kdo umí shrnout, ten rozumí obsahu i hlavní myšlence." },
  { q: "Odborný (naučný) text poznáme podle toho, že obsahuje fakta a odborné pojmy.", a: "ano", hint: "Odborný text je věcný, objektivní a používá terminologii." },
];

// Level 2: slozitejsi ctenarske strategie
const POOL_L2: TFItem[] = [
  { q: "Text o slonech říkající 'Slon je největší suchozemské zvíře.' je detail, ne hlavní myšlenka.", a: "ne", hint: "Tato informace je klíčová pro pochopení tématu — jde o hlavní myšlenku." },
  { q: "Text o slonech říkající 'Slon má šedou kůži.' je detail, ne hlavní myšlenka.", a: "ano", hint: "Barva kůže je doplňující detail, ne nosná myšlenka textu." },
  { q: "Čtenářská strategie předvídání nám říká, co se stalo v minulosti.", a: "ne", hint: "Předvídání se týká budoucnosti — odhadujeme, co přijde dál." },
  { q: "Inference znamená, že vyvozujeme informace, které nejsou přímo v textu.", a: "ano", hint: "Vyvozujeme ze stop — to, co autor neříká přímo." },
  { q: "Záměrné shrnutí každého odstavce zlepšuje celkové porozumění textu.", a: "ano", hint: "Průběžné shrnutí udržuje čtenáře v kontaktu s textem." },
  { q: "Příběh (literární text) a encyklopedický text se čtou stejnou strategií.", a: "ne", hint: "Různé texty vyžadují různé strategie čtení." },
  { q: "Pokud autor popisuje škodlivost plastů, jeho záměrem pravděpodobně je upozornit na problém.", a: "ano", hint: "Téma škodlivosti vede k záměru upozornit a motivovat ke změně." },
  { q: "Hlavní myšlenka se vždy skrývá v posledním odstavci textu.", a: "ne", hint: "Hlavní myšlenka může stát kdekoli — záleží na textu." },
  { q: "Klíčová slova textu o zimě jsou pravděpodobně: sníh, mráz, led, zima.", a: "ano", hint: "Klíčová slova vystihují téma — u zimy to jsou zimní pojmy." },
  { q: "Čím více slov v textu neznáme, tím méně šancí máme mu porozumět.", a: "ne", hint: "Kontext a strategie mohou pomoci i při neznalosti slov." },
  { q: "Shrnutí textu vlastními slovy je lepší ukázka porozumění než opisování.", a: "ano", hint: "Vlastní slova ukazují, že jsme obsah zpracovali, ne jen opsali." },
  { q: "Návod k sestavení nábytku je příkladem věcného (informačního) textu.", a: "ano", hint: "Návod popisuje postup — jde o praktický věcný text." },
  { q: "Pohádka je příkladem věcného (naučného) textu.", a: "ne", hint: "Pohádka je literární (umělecký) text — vymyšlený příběh." },
  { q: "Při čtení odborného textu pomáhá soustředit se na pojmy a jejich vysvětlení.", a: "ano", hint: "Odborné pojmy jsou stavební kameny odborného textu." },
  { q: "Pokud text nerozumíme, vždy je to chybou autora, ne čtenáře.", a: "ne", hint: "Porozumění je dílem obou — autora i čtenáře a jeho strategií." },
  { q: "Aktivní čtení zahrnuje předvídání, vyvozování, kladení otázek a shrnutí.", a: "ano", hint: "Aktivní čtenář si klade otázky a přemýšlí o textu." },
  { q: "Čtení jen nadpisu a obrázků bez textu je spolehlivá cesta k porozumění.", a: "ne", hint: "Nadpisy a obrázky pomáhají orientaci, ale ne plnému porozumění." },
  { q: "Odpověď na otázku 'Proč' v textu o slonech může být: 'Slon pije vodu chobotém, aby se ochladil.'", a: "ano", hint: "Proč = příčina/důvod — chladí se proto, že je mu horko." },
  { q: "Záměr autora zprávy (novinového článku) je většinou pobavit čtenáře.", a: "ne", hint: "Zpráva informuje o událostech — záměr je informovat, ne pobavit." },
  { q: "Dobrý čtenář si při čtení klade otázky jako: Co chce autor říct? Proč to píše?", a: "ano", hint: "Tyto otázky udržují čtenáře aktivního a zlepšují porozumění." },
  { q: "Text, který přečteme za trest, si zapamatujeme stejně dobře jako text, který nás zajímá.", a: "ne", hint: "Motivace a zájem výrazně ovlivňují porozumění a zapamatování." },
  { q: "Vizuální pomůcky (grafy, obrázky) mohou pomoci pochopit věcný text.", a: "ano", hint: "Ilustrace a grafy doplňují a vysvětlují obsah textu." },
  { q: "Pokud přečteme text dvakrát, vždy mu porozumíme na 100 %.", a: "ne", hint: "Dvakrát nestačí vždy — záleží na obtížnosti textu a strategiích čtenáře." },
  { q: "Čtenářská strategie 'předvídání' pomáhá lépe se soustředit na to, co přijde.", a: "ano", hint: "Předvídání udržuje zájem a připravuje čtenáře na obsah." },
  { q: "Věcný text obsahuje autorovy osobní pocity a hodnocení.", a: "ne", hint: "Věcný text je objektivní — pocity patří do literárního textu." },
  { q: "Rozlišovat hlavní myšlenku od detailů je důležitá čtenářská dovednost.", a: "ano", hint: "Kdo umí oddělit podstatné od nepodstatného, lépe porozumí textu." },
  { q: "Otázka 'Kde' v textu zjišťuje místo děje.", a: "ano", hint: "Kde = místo; kdo = postava; kdy = čas; proč = příčina." },
  { q: "Pokud neznáme žánr textu (pohádka, článek, návod), nelze zvolit správnou strategii.", a: "ne", hint: "Můžeme strategii přizpůsobit i bez znalosti žánru — pozorujeme text." },
  { q: "Inference (vyvozování) je čtenářská dovednost, která patří až na střední školu.", a: "ne", hint: "Vyvozování trénujeme od útlého věku — je součástí základní gramotnosti." },
  { q: "Čtení s porozuměním je základ pro úspěch ve všech školních předmětech.", a: "ano", hint: "Všechny předměty vyžadují čtení textů a porozumění jejich obsahu." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  return shuffle(pool).slice(0, 30).map(({ q, a, hint }) => ({
    question: q,
    correctAnswer: a,
    options: ["Ano", "Ne"],
    hints: [
      hint,
      "Porozumění = umím odpovědět na kdo/co/kde/kdy/proč.",
      "Hlavní myšlenka = bez ní text nedává smysl.",
      "Vyvozování = čtu mezi řádky, ze stop v textu.",
    ],
  }));
}

export const PLYNULECTENISPOROZUMENIMPRIMERENENAROCNYCHTEXTU: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-plynule-cteni-s-porozumenim-primerene-narocnych-textu",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-plynule-cteni-s-porozumenim-primerene-narocnych-textu",
    title: "Plynulé čtení s porozuměním přiměřeně náročných textů",
    studentTitle: "Čtení s porozuměním",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se číst s porozuměním a vyvozovat závěry z přečteného textu.",
    keywords: ["čtení", "porozumění", "hlavní myšlenka", "klíčové slovo", "vyvozování", "inference"],
    goals: [
      "Číst přiměřeně náročné texty s porozuměním",
      "Odpovídat na otázky kdo, co, kde, kdy, proč",
      "Vyvozovat závěry ze stop v textu",
    ],
    boundaries: ["Bez literární analýzy", "Bez textů nad 4. ročník"],
    gradeRange: [4, 4],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Porozumění: umím odpovědět na kdo/co/kde/kdy/proč; hlavní myšlenka = bez ní text nedává smysl",
      steps: [
        "Přečti text pomalu a soustředěně.",
        "Zastavuj se a ptej se: Co jsem právě přečetl(a)?",
        "Odpovídej na otázky kdo, co, kde, kdy, proč.",
        "Vyvozuj ze stop to, co není přímo napsáno.",
      ],
      commonMistake: "Záměna doslovné odpovědi a vyvozené odpovědi — ne vše je přímo v textu",
      example: "'Martin přišel domů mokrý.' → vyvozujeme: pravděpodobně pršelo",
    },
  },
];
