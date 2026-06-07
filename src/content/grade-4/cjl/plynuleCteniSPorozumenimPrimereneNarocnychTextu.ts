import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface TFItem { q: string; a: "ano" | "ne"; hint: string; e: string }

// Level 1: zakladni ctenarske strategie
const POOL_L1: TFItem[] = [
  { q: "Kdyz nerozumim slovu, mam vzdy prestat cist.", a: "ne", hint: "Zkusime odhadnout vyznam z kontextu nebo pokracovat dale.", e: "Když narazíš na neznámé slovo, nemusíš hned přestat. Často jeho význam poznáš z okolních vět, nebo se vyjasní, až budeš číst dál. Přestat číst by tě připravilo o zbytek textu." },
  { q: "Hlavní myšlenka textu je nejdůležitější sdělení, které chce autor předat.", a: "ano", hint: "Hlavní myšlenka drží celý text pohromadě.", e: "Hlavní myšlenka je to nejdůležitější, co nám autor chce říct, a drží celý text pohromadě. Ostatní věty ji jen doplňují podrobnostmi a příklady." },
  { q: "Přečíst text rychle bez zastavení zaručuje jeho porozumění.", a: "ne", hint: "Rychlé čtení neznamená porozumění — potřebujeme přemýšlet.", e: "Rychlost a porozumění nejsou totéž. Můžeš text přelétnout očima a stejně nevědět, o čem byl. Aby ses obsahu opravdu chytil, musíš se u čtení zastavovat a přemýšlet." },
  { q: "Kontext jsou okolní věty, které pomáhají pochopit neznámé slovo.", a: "ano", hint: "Kontext = okolí slova, ze kterého odhadujeme jeho význam.", e: "Kontext je okolí slova — věty kolem něj. Právě z nich často odhadneš, co neznámé slovo znamená, aniž bys hledal ve slovníku." },
  { q: "Otázka 'Proč' pomáhá zjistit příčinu nebo důvod děje v textu.", a: "ano", hint: "Proč = příčina, kde = místo, kdo = postava, kdy = čas.", e: "Otázka 'proč' se vždy ptá po příčině nebo důvodu — proč se něco stalo. Tím se liší od otázek kde (místo), kdo (postava) a kdy (čas)." },
  { q: "Když přečteme nadpis, víme vždy celý obsah textu.", a: "ne", hint: "Nadpis naznačuje téma, ale obsah textu je mnohem bohatší.", e: "Nadpis ti napoví téma a připraví tě na to, o čem text bude, ale neprozradí všechno. Skutečný obsah je v textu mnohem bohatší než pár slov nadpisu." },
  { q: "Porozumění textu znamená, že dokážeme odpovědět na otázky kdo, co, kde, kdy, proč.", a: "ano", hint: "Tyto otázky pokrývají základní složky porozumění.", e: "Otázky kdo, co, kde, kdy a proč pokrývají základní složky každého textu. Když na ně umíš odpovědět, je to dobrý důkaz, že jsi textu porozuměl." },
  { q: "Literární text (pohádka, povídka) vždy podává objektivní fakta.", a: "ne", hint: "Literární text vyjadřuje příběhy a pocity, ne nutně fakta.", e: "Pohádky a povídky vyprávějí příběhy a zachycují pocity — bývají vymyšlené. Objektivní, ověřená fakta najdeš spíš ve věcném textu, jako je encyklopedie nebo zpráva." },
  { q: "Věcný text (encyklopedie, zpráva) podává informace a fakta.", a: "ano", hint: "Věcný = informační text = zaměřen na fakta, ne na příběh.", e: "Věcný text je zaměřený na informace a ověřená fakta, ne na vymyšlený příběh. Proto encyklopedie nebo zpráva slouží k poučení, ne k pobavení příběhem." },
  { q: "Po přečtení odstavce je dobré shrnout, co jsme přečetli, vlastními slovy.", a: "ano", hint: "Shrnutí je ověření porozumění.", e: "Shrnutí odstavce vlastními slovy je rychlá kontrola, jestli jsi obsah opravdu pochopil. Pokud ho dokážeš převyprávět, rozumíš mu; pokud ne, vyplatí se odstavec přečíst znovu." },
  { q: "Inference (vyvozování) znamená opisovat text doslova.", a: "ne", hint: "Vyvozování = odhadujeme to, co není přímo napsáno, ze stop v textu.", e: "Vyvozování není doslovné opisování — naopak odhaduješ to, co v textu přímo napsané NENÍ, podle stop, které ti autor zanechal. Je to čtení mezi řádky." },
  { q: "'Martin přišel domů mokrý.' — z toho vyvozujeme, že pravděpodobně pršelo.", a: "ano", hint: "Mokrý = stopa; pršelo nebo dostal se do vody — vyvozujeme.", e: "Že Martin přišel mokrý, je stopa. Z ní vyvodíš nejpravděpodobnější vysvětlení — že venku pršelo. Text to neříká přímo, ale ty si to domyslíš ze stopy." },
  { q: "Klíčová slova jsou ta, která nejlépe vystihují téma textu.", a: "ano", hint: "Klíčová slova se zpravidla opakují a shrnují téma.", e: "Klíčová slova nejlépe vystihují, o čem text je — proto se v něm často opakují. Když je vypíšeš, máš v ruce shrnutí tématu." },
  { q: "Číst text podruhé nemá žádný smysl.", a: "ne", hint: "Opakované čtení pomáhá odhalit to, čemu jsme neporozuměli poprvé.", e: "Podruhé čteš text už s představou, o čem je, a všimneš si toho, co ti poprvé uniklo. Opakované čtení je proto běžná a užitečná strategie, ne ztráta času." },
  { q: "Otázka 'Kdo' v textu zjišťuje postavy nebo aktéry textu.", a: "ano", hint: "Kdo = postava, aktér, původce děje.", e: "Otázka 'kdo' se ptá po postavách — kdo v textu jedná nebo o kom se mluví. Liší se od otázky 'kde' (místo) nebo 'kdy' (čas)." },
  { q: "Přeskočení těžkých slov v textu je nejlepší strategie čtení s porozuměním.", a: "ne", hint: "Lépe odhadnout z kontextu nebo vyhledat ve slovníku.", e: "Přeskakování těžkých slov ti může nechat mezery v porozumění. Lepší je odhadnout jejich význam z okolních vět, nebo si je vyhledat ve slovníku." },
  { q: "Zastavení se a přemýšlení o obsahu (stop-and-think) zlepšuje porozumění.", a: "ano", hint: "Aktivní čtení = zastavíme se a ověřujeme, co jsme pochopili.", e: "Když se při čtení zastavíš a přemýšlíš, co jsi právě přečetl, čteš aktivně a obsah si lépe zpracuješ. To je mnohem účinnější než číst bez přemýšlení." },
  { q: "Předvídání v textu znamená odhadovat, co se stane dál, na základě stop.", a: "ano", hint: "Předvídání je aktivní čtenářská strategie.", e: "Předvídání znamená, že podle dosavadních stop odhadneš, co přijde dál. Drží tě to u textu v pozoru a porovnáváš svůj odhad s tím, co se opravdu stane." },
  { q: "Délka textu určuje, jak dobře mu porozumíme.", a: "ne", hint: "Porozumění závisí na naší strategii, ne na délce textu.", e: "Dlouhý text nemusí být těžší na pochopení než krátký. O porozumění rozhoduje hlavně to, jak text čteš a jakou strategii zvolíš, ne jeho délka." },
  { q: "Záměr autora textu je to, co chce autor říct nebo čeho textem dosáhnout.", a: "ano", hint: "Záměr = proč autor text napsal.", e: "Záměr autora je důvod, proč text vznikl — co tím chtěl říct nebo způsobit (poučit, pobavit, varovat). Když ho odhalíš, lépe pochopíš celý text." },
  { q: "Každé slovo v textu je stejně důležité a musíme si je zapamatovat.", a: "ne", hint: "Soustředíme se na klíčová slova a hlavní myšlenku.", e: "Není potřeba pamatovat si každé slovo — to ani nejde. Soustřeď se na klíčová slova a hlavní myšlenku, ostatní jsou jen doplňující podrobnosti." },
  { q: "Čtenářská strategie je záměrný přístup k textu (předvídání, vyvozování, shrnutí).", a: "ano", hint: "Strategie = plánovaný způsob, jak číst a porozumět.", e: "Čtenářská strategie je promyšlený postup, jak k textu přistoupit — třeba předvídat, vyvozovat nebo shrnovat. Není to náhoda, ale záměrný způsob, jak textu porozumět." },
  { q: "Pokud přečteme text rychle, automaticky mu porozumíme lépe.", a: "ne", hint: "Rychlost čtení a porozumění spolu nesouvisejí přímo.", e: "Rychlé čtení samo o sobě porozumění nezaručí — můžeš text rychle přečíst a nic si z něj nezapamatovat. Důležitější je číst pozorně a přemýšlet o obsahu." },
  { q: "Odpověď na otázku může být v textu přímo napsána nebo ji musíme vyvodit.", a: "ano", hint: "Buď hledáme doslova, nebo vyvozujeme ze stop.", e: "Některé odpovědi najdeš v textu doslova napsané, jiné nikoli — ty musíš vyvodit ze stop. Dobrý čtenář pozná, kdy hledat přímo a kdy domýšlet." },
  { q: "Při čtení s porozuměním je vhodné číst pomalu a soustředěně.", a: "ano", hint: "Soustředěné čtení umožňuje zpracovat obsah textu.", e: "Pomalé a soustředěné čtení ti dá čas obsah zpracovat a promyslet. Když spěcháš, podstatné věci ti snadno utečou." },
  { q: "Pokud text nerozumíme hned, není důvod ho číst znovu.", a: "ne", hint: "Opakované čtení je běžná a účinná strategie porozumění.", e: "Když napoprvé nerozumíš, je čtení znovu právě tou správnou cestou. Podruhé si všimneš souvislostí, které ti poprvé unikly — proto se opakované čtení vyplatí." },
  { q: "Hlavní myšlenka textu je vždy v první větě prvního odstavce.", a: "ne", hint: "Hlavní myšlenka může být kdekoli — na začátku, uprostřed i na konci.", e: "Hlavní myšlenka nemá pevné místo — někdy stojí na začátku, jindy uprostřed nebo až na konci. Proto ji nelze hledat jen v první větě, musíš ji vyhledat v celém textu." },
  { q: "Vyvozování záměru autora pomáhá pochopit, proč text vznikl.", a: "ano", hint: "Autor psal s určitým cílem — vyvozujeme, jakým.", e: "Autor psal text s nějakým cílem. Když ze stop vyvodíš jeho záměr, pochopíš, proč text vznikl, a lépe rozumíš celému sdělení." },
  { q: "Shrnutí textu jednou větou ukazuje, zda jsme mu skutečně porozuměli.", a: "ano", hint: "Kdo umí shrnout, ten rozumí obsahu i hlavní myšlence.", e: "Kdo dokáže shrnout text do jediné věty, musel pochytit jeho hlavní myšlenku. Shrnutí je proto spolehlivý důkaz porozumění." },
  { q: "Odborný (naučný) text poznáme podle toho, že obsahuje fakta a odborné pojmy.", a: "ano", hint: "Odborný text je věcný, objektivní a používá terminologii.", e: "Odborný text se pozná podle ověřených faktů a odborných pojmů a podává je věcně a objektivně. Tím se liší od příběhu, který vypráví a vyjadřuje pocity." },
];

// Level 2: slozitejsi ctenarske strategie
const POOL_L2: TFItem[] = [
  { q: "Text o slonech říkající 'Slon je největší suchozemské zvíře.' je detail, ne hlavní myšlenka.", a: "ne", hint: "Tato informace je klíčová pro pochopení tématu — jde o hlavní myšlenku.", e: "Že je slon největší suchozemské zvíře, je nosná informace, kolem které se text točí — to je hlavní myšlenka, ne pouhý detail. Detailem by byla třeba barva jeho kůže." },
  { q: "Text o slonech říkající 'Slon má šedou kůži.' je detail, ne hlavní myšlenka.", a: "ano", hint: "Barva kůže je doplňující detail, ne nosná myšlenka textu.", e: "Barva sloní kůže je drobná podrobnost, která text jen doplňuje — proto jde o detail, ne o hlavní myšlenku. Hlavní myšlenka by řekla, o čem text především je." },
  { q: "Čtenářská strategie předvídání nám říká, co se stalo v minulosti.", a: "ne", hint: "Předvídání se týká budoucnosti — odhadujeme, co přijde dál.", e: "Předvídání se dívá dopředu — odhaduješ, co teprve přijde. To, co se už stalo, není předvídání, ale shrnutí nebo zopakování přečteného." },
  { q: "Inference znamená, že vyvozujeme informace, které nejsou přímo v textu.", a: "ano", hint: "Vyvozujeme ze stop — to, co autor neříká přímo.", e: "Inference neboli vyvozování znamená domýšlet ze stop to, co autor přímo nenapsal. Čteš tak mezi řádky a doplňuješ chybějící informace." },
  { q: "Záměrné shrnutí každého odstavce zlepšuje celkové porozumění textu.", a: "ano", hint: "Průběžné shrnutí udržuje čtenáře v kontaktu s textem.", e: "Když si po každém odstavci shrneš, co jsi přečetl, udržuješ kontakt s textem a snáz poskládáš celý obsah dohromady. Průběžné shrnování proto porozumění zlepšuje." },
  { q: "Příběh (literární text) a encyklopedický text se čtou stejnou strategií.", a: "ne", hint: "Různé texty vyžadují různé strategie čtení.", e: "Příběh sleduješ kvůli ději a postavám, encyklopedii čteš kvůli faktům a pojmům — každý vyžaduje jiný přístup. Stejnou strategií je tedy číst nelze." },
  { q: "Pokud autor popisuje škodlivost plastů, jeho záměrem pravděpodobně je upozornit na problém.", a: "ano", hint: "Téma škodlivosti vede k záměru upozornit a motivovat ke změně.", e: "Když autor zdůrazňuje, jak jsou plasty škodlivé, nejspíš chce čtenáře varovat a přimět ho ke změně. To je jeho záměr, který vyvodíš z toho, co a jak píše." },
  { q: "Hlavní myšlenka se vždy skrývá v posledním odstavci textu.", a: "ne", hint: "Hlavní myšlenka může stát kdekoli — záleží na textu.", e: "Hlavní myšlenka nemá pevné místo — někdy je hned na začátku, jindy uprostřed či na konci. Hledat ji jen v posledním odstavci by tě mohlo svést." },
  { q: "Klíčová slova textu o zimě jsou pravděpodobně: sníh, mráz, led, zima.", a: "ano", hint: "Klíčová slova vystihují téma — u zimy to jsou zimní pojmy.", e: "Klíčová slova vystihují téma a v textu se opakují. U textu o zimě to budou právě zimní pojmy jako sníh, mráz a led — z nich poznáš, o čem text je." },
  { q: "Čím více slov v textu neznáme, tím méně šancí máme mu porozumět.", a: "ne", hint: "Kontext a strategie mohou pomoci i při neznalosti slov.", e: "I když některá slova neznáš, můžeš jejich význam odhadnout z kontextu a textu porozumět. Neznalost pár slov tě tedy o porozumění automaticky nepřipraví." },
  { q: "Shrnutí textu vlastními slovy je lepší ukázka porozumění než opisování.", a: "ano", hint: "Vlastní slova ukazují, že jsme obsah zpracovali, ne jen opsali.", e: "Když text převyprávíš vlastními slovy, dokazuješ, že jsi obsahu opravdu porozuměl. Opsat věty doslova zvládneš i bez pochopení, proto je shrnutí lepší důkaz." },
  { q: "Návod k sestavení nábytku je příkladem věcného (informačního) textu.", a: "ano", hint: "Návod popisuje postup — jde o praktický věcný text.", e: "Návod popisuje krok za krokem, jak něco udělat, a podává praktické informace — proto je to věcný text. Nevypráví příběh ani nevyjadřuje pocity." },
  { q: "Pohádka je příkladem věcného (naučného) textu.", a: "ne", hint: "Pohádka je literární (umělecký) text — vymyšlený příběh.", e: "Pohádka je vymyšlený příběh s postavami a dějem, tedy literární (umělecký) text. Věcný text naopak podává ověřená fakta, ne smyšlený příběh." },
  { q: "Při čtení odborného textu pomáhá soustředit se na pojmy a jejich vysvětlení.", a: "ano", hint: "Odborné pojmy jsou stavební kameny odborného textu.", e: "Odborné pojmy jsou stavební kameny naučného textu — když pochopíš je a jejich vysvětlení, pochopíš celý text. Proto se na ně vyplatí soustředit." },
  { q: "Pokud text nerozumíme, vždy je to chybou autora, ne čtenáře.", a: "ne", hint: "Porozumění je dílem obou — autora i čtenáře a jeho strategií.", e: "Porozumění vzniká spoluprací autora a čtenáře. Někdy text píše autor nejasně, ale jindy pomůže, když čtenář zvolí lepší strategii — vina není vždy jen na jedné straně." },
  { q: "Aktivní čtení zahrnuje předvídání, vyvozování, kladení otázek a shrnutí.", a: "ano", hint: "Aktivní čtenář si klade otázky a přemýšlí o textu.", e: "Aktivní čtenář s textem pracuje — předvídá, vyvozuje, ptá se a shrnuje. Právě tyto činnosti dohromady tvoří aktivní čtení a vedou k lepšímu porozumění." },
  { q: "Čtení jen nadpisu a obrázků bez textu je spolehlivá cesta k porozumění.", a: "ne", hint: "Nadpisy a obrázky pomáhají orientaci, ale ne plnému porozumění.", e: "Nadpis a obrázky ti pomohou zorientovat se, ale samy o sobě obsah neprozradí. Plnému porozumění se přiblížíš jen tehdy, když si přečteš celý text." },
  { q: "Odpověď na otázku 'Proč' v textu o slonech může být: 'Slon pije vodu chobotém, aby se ochladil.'", a: "ano", hint: "Proč = příčina/důvod — chladí se proto, že je mu horko.", e: "Otázka 'proč' se ptá po důvodu. Slovo 'aby se ochladil' ten důvod přímo udává, proto je to platná odpověď na otázku proč." },
  { q: "Záměr autora zprávy (novinového článku) je většinou pobavit čtenáře.", a: "ne", hint: "Zpráva informuje o událostech — záměr je informovat, ne pobavit.", e: "Novinová zpráva má hlavně informovat o tom, co se stalo. Pobavit chce spíš vtip nebo příběh, kdežto záměrem zprávy je předat čtenáři fakta." },
  { q: "Dobrý čtenář si při čtení klade otázky jako: Co chce autor říct? Proč to píše?", a: "ano", hint: "Tyto otázky udržují čtenáře aktivního a zlepšují porozumění.", e: "Když si při čtení kladeš otázky po smyslu a záměru, čteš aktivně a hlouběji přemýšlíš o textu. Právě tak pracuje dobrý čtenář a lépe porozumí." },
  { q: "Text, který přečteme za trest, si zapamatujeme stejně dobře jako text, který nás zajímá.", a: "ne", hint: "Motivace a zájem výrazně ovlivňují porozumění a zapamatování.", e: "Co tě baví, to si zapamatuješ snáz, protože tomu věnuješ víc pozornosti. Text čtený nerad nebo za trest se ti do paměti vryje hůř — zájem hraje velkou roli." },
  { q: "Vizuální pomůcky (grafy, obrázky) mohou pomoci pochopit věcný text.", a: "ano", hint: "Ilustrace a grafy doplňují a vysvětlují obsah textu.", e: "Grafy a obrázky ukazují obsah názorně a doplňují to, co je v textu napsané slovy. Proto ti při čtení věcného textu mohou pomoci pochopit, o co jde." },
  { q: "Pokud přečteme text dvakrát, vždy mu porozumíme na 100 %.", a: "ne", hint: "Dvakrát nestačí vždy — záleží na obtížnosti textu a strategiích čtenáře.", e: "Dvojí čtení sice pomáhá, ale stoprocentní porozumění nezaručuje. U těžkého textu může být potřeba číst víckrát nebo zvolit lepší strategii." },
  { q: "Čtenářská strategie 'předvídání' pomáhá lépe se soustředit na to, co přijde.", a: "ano", hint: "Předvídání udržuje zájem a připravuje čtenáře na obsah.", e: "Když odhaduješ, co přijde dál, jsi zvědavý a připravený na pokračování — a tím se líp soustředíš. Proto předvídání udržuje pozornost a pomáhá porozumění." },
  { q: "Věcný text obsahuje autorovy osobní pocity a hodnocení.", a: "ne", hint: "Věcný text je objektivní — pocity patří do literárního textu.", e: "Věcný text podává fakta objektivně, bez autorových pocitů a osobního hodnocení. Pocity a dojmy najdeš spíš v literárním textu, jako je báseň nebo povídka." },
  { q: "Rozlišovat hlavní myšlenku od detailů je důležitá čtenářská dovednost.", a: "ano", hint: "Kdo umí oddělit podstatné od nepodstatného, lépe porozumí textu.", e: "Když umíš oddělit hlavní myšlenku od pouhých detailů, soustředíš se na podstatné a textu lépe porozumíš. Je to proto důležitá čtenářská dovednost." },
  { q: "Otázka 'Kde' v textu zjišťuje místo děje.", a: "ano", hint: "Kde = místo; kdo = postava; kdy = čas; proč = příčina.", e: "Otázka 'kde' se vždy ptá po místě — kde se děj odehrává. Tím se liší od otázky kdo (postava), kdy (čas) a proč (příčina)." },
  { q: "Pokud neznáme žánr textu (pohádka, článek, návod), nelze zvolit správnou strategii.", a: "ne", hint: "Můžeme strategii přizpůsobit i bez znalosti žánru — pozorujeme text.", e: "I bez jistoty, o jaký žánr jde, si všímáš toho, jak text vypadá, a strategii přizpůsobíš. Znalost žánru pomáhá, ale není podmínkou pro čtení s porozuměním." },
  { q: "Inference (vyvozování) je čtenářská dovednost, která patří až na střední školu.", a: "ne", hint: "Vyvozování trénujeme od útlého věku — je součástí základní gramotnosti.", e: "Vyvozovat ze stop se učíme už od malička — i ty to děláš, když si domyslíš, že někdo přišel mokrý kvůli dešti. Není to dovednost jen pro starší žáky." },
  { q: "Čtení s porozuměním je základ pro úspěch ve všech školních předmětech.", a: "ano", hint: "Všechny předměty vyžadují čtení textů a porozumění jejich obsahu.", e: "Ať se učíš matematiku, přírodovědu nebo dějepis, všude musíš číst zadání a texty a rozumět jim. Proto je čtení s porozuměním základ úspěchu ve všech předmětech." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  return shuffle(pool).slice(0, 30).map(({ q, a, hint, e }) => ({
    question: q,
    correctAnswer: a,
    options: ["Ano", "Ne"],
    hints: [
      hint,
      "Porozumění = umím odpovědět na kdo/co/kde/kdy/proč.",
      "Hlavní myšlenka = bez ní text nedává smysl.",
      "Vyvozování = čtu mezi řádky, ze stop v textu.",
    ],
    explanation: e,
  }));
}

export const PLYNULECTENISPOROZUMENIMPRIMERENENAROCNYCHTEXTU: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-plynule-cteni-s-porozumenim-primerene-narocnych-textu",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-plynule-cteni-s-porozumenim-primerene-narocnych-textu",
    displayName: "Čtení s porozuměním",
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
    recommendedNext: ["g4-cjl-komunikacni-a-slohova-vychova-cteni-rozliseni-podstatnych-a-okrajovych-informaci"],
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
