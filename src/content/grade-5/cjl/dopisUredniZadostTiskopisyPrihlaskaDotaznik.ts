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
    question: "Co patří do hlavičky (záhlaví) úředního dopisu?",
    correctAnswer: "adresa odesílatele i adresáta",
    options: ["adresa odesílatele i adresáta", "jen datum napsání dopisu", "jen podpis odesílatele", "jen vlastní text dopisu"],
    hints: ["Záhlaví má hned na začátku odpovědět na dvě otázky. Které to jsou?"],
    explanation: "Ze záhlaví musí být na první pohled jasné, kdo dopis píše a komu je určen. Datum i podpis se doplňují, ale samy o sobě záhlaví netvoří.",
  },
  {
    question: "Co je 'Věc:' v úředním dopisu?",
    correctAnswer: "stručné označení tématu",
    options: [
      "zdvořilostní pozdrav",
      "stručné označení tématu",
      "podpis odesílatele",
      "datum napsání dopisu",
    ],
    hints: ["Úředník dostane denně desítky dopisů. Co mu na jednom řádku napoví, o co jde, ještě než ho začne číst?"],
    explanation: "Za 'Věc:' se píše několikaslovné shrnutí — třeba 'Žádost o uvolnění z výuky'. Adresát tak hned ví, komu dopis předat a jak ho vyřídit.",
  },
  {
    question: "Jak se správně zahajuje úřední dopis?",
    correctAnswer: "Vážený pane / Vážená paní",
    options: ["Ahoj, pane Nováku,", "Dobrý den, příteli,", "Vážený pane / Vážená paní", "Zdravím tě, kamaráde,"],
    hints: ["Úřední dopis je formální — jak bys zdvořile oslovil cizího dospělého, ne jako kamaráda?"],
    explanation: "Formální oslovení začíná slovem 'Vážený' a připojuje se k němu titul nebo funkce. Tykání i přátelské pozdravy do úředního dopisu nepatří.",
  },
  {
    question: "Co musí obsahovat závěr úředního dopisu?",
    correctAnswer: "zdvořilý pozdrav a podpis",
    options: ["jen datum napsání", "jen otisk razítka", "jen telefonní číslo", "zdvořilý pozdrav a podpis"],
    hints: ["Čím dopis uzavřeš, aby bylo jasné, že končí, a zároveň kdo za ním stojí?"],
    explanation: "Závěr tvoří fráze 'S pozdravem' nebo 'S úctou' a pod ní podpis. Bez podpisu není zřejmé, kdo dopis odeslal, a dopis nelze vyřídit.",
  },
  {
    question: "Co je to žádost?",
    correctAnswer: "úřední dopis s prosbou",
    options: ["úřední dopis s prosbou", "neformální e-mail příteli", "pozvánka na oslavu", "dopis jen s pozdravem"],
    hints: ["Píšeš, protože po druhé straně něco chceš. Komu takový dopis posíláš a jakým tónem?"],
    explanation: "V žádosti se obracíme na úřad nebo instituci s konkrétní prosbou — o povolení, výjimku, informaci. Proto má formální podobu a odůvodnění.",
  },
  {
    question: "Co musí obsahovat přihláška?",
    correctAnswer: "osobní údaje a co, kam, kdy",
    options: [
      "jen podpis žadatele",
      "osobní údaje a co, kam, kdy",
      "jen datum podání",
      "jen zdvořilý pozdrav",
    ],
    hints: ["Přemýšlej, co všechno potřebuje vědět ten, kdo přihlášku dostane, aby poznal, kdo se hlásí a na co se hlásí."],
    explanation: "Z přihlášky musí být zřejmé, kdo se hlásí a k čemu. Samotný podpis nebo datum organizátorovi nestačí — nevěděl by, koho zapsat.",
  },
  {
    question: "Kde se uvádí datum v úředním dopisu?",
    correctAnswer: "v záhlaví pod adresou",
    options: ["hned za označením Věc:", "v závěru za podpisem", "v záhlaví pod adresou", "datum se neuvádí"],
    hints: ["Datum bývá v horní části dopisu, blízko údajů o tom, kdo dopis píše — zkus si vybavit, kde přesně to bývá napsané."],
    explanation: "Datum patří do horní části dopisu, obvykle pod adresu odesílatele: 'V Praze dne 1. 6. 2026'. Podle něj se počítají lhůty pro vyřízení.",
  },
  {
    question: "Jaký tón (styl) má úřední dopis?",
    correctAnswer: "formální a zdvořilý",
    options: ["neformální a přátelský", "humorný a hravý", "odborný s termíny", "formální a zdvořilý"],
    hints: ["Píšeš někomu, koho neznáš a kdo o tvé věci rozhoduje. Jak bys s ním mluvil?"],
    explanation: "Úřední dopis zachovává odstup a zdvořilost, používá spisovná slova a vyká. Vtipy ani slang by působily nemístně.",
  },
  {
    question: "Jak se podepisujeme v úředním dopisu?",
    correctAnswer: "jménem a příjmením",
    options: ["jménem a příjmením", "vlastní přezdívkou", "jen iniciálami", "podpis není nutný"],
    hints: ["Adresát tě nezná. Co mu musí podpis prozradit, aby věděl, s kým jedná?"],
    explanation: "Podepisujeme se celým jménem, ideálně vlastnoručně. Přezdívka ani iniciály by adresátovi neumožnily zjistit, kdo dopis poslal.",
  },
  {
    question: "Jak se správně píše adresa na obálce úředního dopisu?",
    correctAnswer: "Vážený pan Jan Novák, adresa",
    options: [
      "Ahoj, pane Novák!",
      "Vážený pan Jan Novák, adresa",
      "Pane Novák!",
      "Dobrý den, pane!",
    ],
    hints: ["Na obálku nepatří pozdrav. Co tam musí být, aby dopis vůbec došel?"],
    explanation: "Na obálce se uvádí zdvořilé oslovení v 1. pádu, celé jméno a úplná adresa. Pozdrav ani zvolání sem nepatří — obálku čte pošta, ne adresát.",
  },
  {
    question: "Co je dotazník?",
    correctAnswer: "formulář s otázkami",
    options: ["žádost o práci", "přihláška do školy", "formulář s otázkami", "pozvánka na akci"],
    hints: ["Nic nevysvětluješ ani o nic nežádáš — jen odpovídáš. Do čeho?"],
    explanation: "Dotazník obsahuje připravené otázky a volná místa na odpovědi. Slouží ke sběru údajů, ne k prosbě jako žádost.",
  },
  {
    question: "Proč se žádost píše formálně?",
    correctAnswer: "čte ji úřad, který rozhoduje",
    options: ["přikazuje to zákon", "neformální žádost je zakázaná", "formální text je vždy kratší", "čte ji úřad, který rozhoduje"],
    hints: ["Kdo tvou žádost otevře a co s ní bude dělat? Jak to ovlivní tón, který zvolíš?"],
    explanation: "Žádost čte úředník, který o ní rozhoduje. Formální styl vyjadřuje respekt a zvyšuje šanci na kladné vyřízení. Zákon jazyk dopisu nepředepisuje.",
  },
  {
    question: "Co uvádíme v těle (obsahu) žádosti?",
    correctAnswer: "důvod, prosbu a poděkování",
    options: ["důvod, prosbu a poděkování", "jen zdvořilý pozdrav", "jen jméno žadatele", "seznam přátel a známých"],
    hints: ["Tři věci: proč píšeš, co přesně chceš a čím to slušně uzavřeš."],
    explanation: "Adresát potřebuje vědět, proč žádáš a o co konkrétně. Poděkování za vyřízení pak žádost zdvořile uzavírá.",
  },
  {
    question: "Co je tiskopis?",
    correctAnswer: "předtištěný formulář",
    options: [
      "ručně psaný dopis",
      "předtištěný formulář",
      "otisk úředního razítka",
      "zvláštní druh obálky",
    ],
    hints: ["Nemusíš vymýšlet, co napsat — je to připravené a ty jen doplňuješ. Co to je?"],
    explanation: "Tiskopis má předem vytištěné rubriky a prázdná políčka, do kterých se doplňují údaje. Ušetří práci a zaručí, že nic nechybí.",
  },
  {
    question: "Jaké osobní údaje se nejčastěji uvádějí v přihlášce?",
    correctAnswer: "jméno, datum narození, adresa",
    options: ["jen jméno a příjmení", "jen adresa bydliště", "jméno, datum narození, adresa", "jen číslo pojišťovny"],
    hints: ["Podle čeho se dá jeden konkrétní člověk spolehlivě odlišit od jiného se stejným jménem?"],
    explanation: "Přihláška potřebuje údaje, které člověka jednoznačně určí — jméno, datum narození a adresu. Samotné jméno by u dvou stejných jmen nestačilo.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "V žádosti o uvolnění z výuky napíšeme:",
    correctAnswer: "důvod a konkrétní termíny",
    options: ["jen podpis rodiče", "jen datum napsání", "seznam spolužáků", "důvod a konkrétní termíny"],
    hints: ["Ředitel musí rozhodnout. Co potřebuje vědět kromě toho, že žák nepřijde?"],
    explanation: "Bez uvedení dnů a důvodu nemůže škola žádost posoudit ani absenci zaevidovat. Obojí proto musí být uvedeno přesně.",
  },
  {
    question: "Jaký je správný zdvořilostní závěr žádosti?",
    correctAnswer: "S pozdravem, S úctou",
    options: ["S pozdravem, S úctou", "Čau, měj se!", "Zdravím všechny!", "Tak zatím, ahoj!"],
    hints: ["Tři z těch možností bys napsal kamarádovi. Která zbývá pro úřad?"],
    explanation: "Ustálené formální závěry jsou 'S pozdravem' a 'S úctou'. Přátelské rozloučení by narušilo úřední ráz celého dopisu.",
  },
  {
    question: "Přihláška na tábor musí obsahovat:",
    correctAnswer: "údaje dítěte, termín, kontakt",
    options: [
      "jen jméno dítěte",
      "údaje dítěte, termín, kontakt",
      "jen podpis rodiče",
      "jen termín tábora",
    ],
    hints: ["Organizátor musí vědět, koho zapsat, na kdy a komu zavolat, kdyby se něco stalo."],
    explanation: "Přihláška slouží k tomu, aby organizátor mohl dítě zařadit na správný turnus a v případě potřeby se spojit s rodiči. Jediný údaj k tomu nestačí.",
  },
  {
    question: "V úředním dopisu NESMÍME používat:",
    correctAnswer: "slang a emotikony",
    options: ["datum napsání", "vlastní jméno", "slang a emotikony", "formální pozdrav"],
    hints: ["Tři z těch prvků v úředním dopisu být musí. Který tam nepatří nikdy?"],
    explanation: "Nespisovné výrazy, zkratky z chatu a emotikony narušují formální ráz dopisu a snižují jeho vážnost. Ostatní tři prvky jsou naopak povinné.",
  },
  {
    question: "Jak napíšeme oslovení, když neznáme jméno adresáta?",
    correctAnswer: "oslovíme funkci nebo instituci",
    options: ["napíšeme Ahoj všichni", "napíšeme Dobrý den, neznámý", "oslovení úplně vynecháme", "oslovíme funkci nebo instituci"],
    hints: ["Jméno neznáš, ale víš, komu píšeš — škole, úřadu, řediteli. Co z toho použiješ?"],
    explanation: "Když jméno neznáme, oslovíme funkci ('Vážený pane řediteli') nebo instituci ('Vážené vedení školy'). Vynechat oslovení by bylo nezdvořilé.",
  },
  {
    question: "Co je 'příloha' u dopisu?",
    correctAnswer: "dokument připojený k dopisu",
    options: ["dokument připojený k dopisu", "otisk poštovního razítka", "seznam všech adresátů", "datum odeslání dopisu"],
    hints: ["Posíláš spolu s dopisem ještě něco navíc. Jak se tomu říká?"],
    explanation: "Příloha je doklad odeslaný spolu s dopisem — kopie vysvědčení, potvrzení, životopis. V dopisu se přílohy vypisují, aby adresát poznal, co má dorazit.",
  },
  {
    question: "Žádost o brigádu musí obsahovat:",
    correctAnswer: "kontakt, o co žádám a proč",
    options: [
      "jen jméno žadatele",
      "kontakt, o co žádám a proč",
      "jen podpis a datum",
      "seznam přátel a známých",
    ],
    hints: ["Zaměstnavatel musí vědět, o jakou práci ti jde, proč zrovna tobě ji dát a jak se ti ozvat."],
    explanation: "Bez kontaktu tě zaměstnavatel nemůže oslovit, bez uvedení práce neví, kam tě zařadit, a bez zdůvodnění nemá důvod vybrat právě tebe.",
  },
  {
    question: "Na obálce se adresa adresáta píše:",
    correctAnswer: "doprostřed nebo vpravo",
    options: ["vlevo nahoru", "na zadní stranu", "doprostřed nebo vpravo", "nezáleží na místě"],
    hints: ["Vlevo nahoře už je adresa odesílatele. Kam tedy zbývá napsat příjemce?"],
    explanation: "Adresa příjemce patří na přední stranu doprostřed nebo do pravé dolní části. Vlevo nahoře je odesílatel a zadní strana zůstává volná.",
  },
  {
    question: "Proč v žádosti uvádíme důvod?",
    correctAnswer: "aby adresát mohl rozhodnout",
    options: ["aby byl text delší", "důvod se vůbec neuvádí", "aby dopis vypadal lépe", "aby adresát mohl rozhodnout"],
    hints: ["Představ si úředníka, který dostane jen 'Žádám o uvolnění'. Co mu chybí?"],
    explanation: "Bez důvodu nemá adresát podle čeho posoudit, jestli žádosti vyhovět. Odůvodnění je tedy věcná nutnost, ne jen formalita.",
  },
  {
    question: "Co je správná struktura úředního dopisu?",
    correctAnswer: "záhlaví, Věc, oslovení, text, závěr",
    options: ["záhlaví, Věc, oslovení, text, závěr", "text, podpis, záhlaví", "podpis, záhlaví, text", "závěr, oslovení, záhlaví"],
    hints: ["Přemýšlej, co logicky přijde jako první (kdo komu píše) a co jako úplně poslední (kdo dopis napsal)."],
    explanation: "Dopis začíná údaji o odesílateli a adresátovi, pokračuje označením tématu a oslovením, pak přijde vlastní sdělení a nakonec zdvořilý závěr s podpisem.",
  },
  {
    question: "Co uvádíme v záhlaví na levé straně?",
    correctAnswer: "adresa odesílatele",
    options: [
      "adresa adresáta",
      "adresa odesílatele",
      "datum napsání",
      "označení Věc:",
    ],
    hints: ["Levý horní roh patří tomu, kdo dopis posílá, nebo tomu, kdo ho dostane?"],
    explanation: "Vlevo nahoře stojí údaje o odesílateli, tedy o tom, kdo dopis píše. Adresát se uvádí napravo nebo níže.",
  },
  {
    question: "Co uvádíme v záhlaví na pravé nebo spodní straně?",
    correctAnswer: "adresa adresáta",
    options: ["adresa odesílatele", "datum napsání", "adresa adresáta", "označení Věc:"],
    hints: ["Je to opačná strana, než kde stojí ten, kdo dopis píše."],
    explanation: "Napravo nebo pod adresou odesílatele se uvádí, komu je dopis určen. Toto rozmístění je u úředních dopisů ustálené.",
  },
  {
    question: "Jak se správně píše datum v českém dopisu?",
    correctAnswer: "V Praze dne 1. 6. 2026",
    options: ["1.6.2026 Praha", "dne 1. 6.", "datum se neuvádí", "V Praze dne 1. 6. 2026"],
    hints: ["Kromě dne patří k datu v dopisu ještě jeden údaj. Jaký, a jak se to celé uvozuje?"],
    explanation: "V českém dopisu se uvádí místo i celé datum ve tvaru 'V Praze dne 1. 6. 2026'. Bez roku by nebylo možné určit lhůtu vyřízení.",
  },
  {
    question: "Co je průvodní dopis?",
    correctAnswer: "krátký úvod k dokumentu",
    options: ["krátký úvod k dokumentu", "pozdravný dopis příteli", "pohlednice z dovolené", "dopis bez adresy"],
    hints: ["Posíláš životopis. Co k němu přiložíš, aby příjemce věděl, proč mu chodí?"],
    explanation: "Průvodní dopis vysvětluje, co posíláš a proč, a doprovází hlavní dokument. Sám o sobě obvykle nic nevyřizuje.",
  },
  {
    question: "Jak se liší žádost od přihlášky?",
    correctAnswer: "žádost prosí, přihláška hlásí",
    options: [
      "přihláška prosí, žádost hlásí",
      "žádost prosí, přihláška hlásí",
      "přihláška je vždy delší",
      "obojí znamená totéž",
    ],
    hints: ["U jednoho z těch dokumentů může adresát odmítnout, u druhého jen zapisuje. Který je který?"],
    explanation: "V žádosti o něco prosíme a adresát rozhoduje, zda vyhoví. Přihláškou oznamujeme, že se hlásíme, a adresát nás zpravidla jen zaeviduje.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co je vykání a proč ho používáme v úředním dopisu?",
    correctAnswer: "zdvořilé oslovení dospělého",
    options: ["nářeční forma češtiny", "způsob psaní e-mailů", "zdvořilé oslovení dospělého", "forma záporné věty"],
    hints: ["Čím se liší 'Prosím Vás' od 'Prosím tě' a co tím dáváš adresátovi najevo?"],
    explanation: "Vykáním oslovujeme dospělé a cizí osoby zájmenem 'vy' a vyjadřujeme tím úctu a odstup. Tykání by v úředním dopisu působilo nemístně důvěrně.",
  },
  {
    question: "Jak zní správné oslovení v dopisu starostovi?",
    correctAnswer: "Vážený pane starosto,",
    options: ["Ahoj, starosto,", "Pane starosta!", "Dobrý den, pane,", "Vážený pane starosto,"],
    hints: ["Přemýšlej, jak zdvořile oslovit muže ve veřejné funkci — jaký přívlastek se v úředních dopisech používá, a v jakém pádě se jeho funkce skloňuje?"],
    explanation: "Oslovení stojí v 5. pádu: 'pane starosto', ne 'pane starosta'. Ke jménu funkce se navíc připojuje zdvořilostní 'Vážený'.",
  },
  {
    question: "Jak zakončit žádost profesionálně?",
    correctAnswer: "Děkuji za vyřízení. S úctou",
    options: ["Děkuji za vyřízení. S úctou", "Čau a měj se hezky!", "Nashle, ať to vyjde!", "Prosím pozdravujte doma."],
    hints: ["Dvě části: poděkování za to, že se tím adresát bude zabývat, a formální rozloučení."],
    explanation: "Profesionální závěr spojuje poděkování za vyřízení s formální frází 'S úctou' a podpisem. Ostatní varianty patří do soukromé korespondence.",
  },
  {
    question: "Co se nesmí zapomenout uvést v žádosti o omluvení z výuky?",
    correctAnswer: "jméno, třída, termín, důvod",
    options: [
      "jen podpis rodiče",
      "jméno, třída, termín, důvod",
      "jen den absence",
      "jen jméno rodiče",
    ],
    hints: ["Škola má stovky žáků. Co všechno potřebuje vědět, aby absenci správně zapsala a uznala?"],
    explanation: "Bez jména a třídy škola nepozná, o kterého žáka jde, bez termínu neví, co zapsat, a bez důvodu nemůže absenci uznat. Podpis rodiče je nutný navíc, ne místo toho.",
  },
  {
    question: "Ve formálním e-mailu řediteli školy NESMÍME napsat:",
    correctAnswer: "Hej, chci se zeptat jestli... 😊",
    options: [
      "Vážený pane řediteli, rád bych se informoval...",
      "S úctou, Jana Nováková",
      "Hej, chci se zeptat jestli... 😊",
      "Předmět: Žádost o informaci",
    ],
    hints: ["Tři z těch formulací bys v úředním e-mailu čekal. Která do něj nepatří ani náhodou?"],
    explanation: "Neformální oslovení, chybějící interpunkce a emotikon do úředního e-mailu nepatří. Ostatní tři možnosti jsou naopak jeho běžnou součástí.",
  },
  {
    question: "Proč musí žádost obsahovat konkrétní termíny a data?",
    correctAnswer: "aby adresát věděl, o co jde",
    options: ["aby byl text delší", "vyžaduje to zákon", "kvůli lepší úpravě", "aby adresát věděl, o co jde"],
    hints: ["Žádost 'o uvolnění někdy příští týden' se vyřídit nedá. Proč?"],
    explanation: "Neurčitá žádost se nedá posoudit ani zaevidovat — adresát neví, o jaké dny jde. Konkrétní termín proto rozhoduje o tom, zda lze žádosti vyhovět.",
  },
  {
    question: "Co je životopis a jaký typ dokumentu to je?",
    correctAnswer: "přehled osobních a pracovních údajů",
    options: ["přehled osobních a pracovních údajů", "úřední dopis s prosbou", "formulář s otázkami", "pohlednice z dovolené"],
    hints: ["Nikoho v něm o nic nežádáš ani neodpovídáš na otázky. Co v něm tedy je?"],
    explanation: "Životopis přehledně shrnuje, kdo jsi, co jsi vystudoval a co umíš. K žádosti se přikládá jako příloha — sám o sobě žádostí není.",
  },
  {
    question: "Kam v žádosti patří odůvodnění?",
    correctAnswer: "do textu před prosbu",
    options: [
      "do záhlaví nad oslovení",
      "do textu před prosbu",
      "až za podpis",
      "do označení Věc:",
    ],
    hints: ["Adresát má nejdřív pochopit situaci, a teprve pak se dozvědět, co po něm chceš. V jakém pořadí to napíšeš?"],
    explanation: "Nejdřív vysvětlíš situaci a teprve pak formuluješ prosbu — adresát tak čte prosbu už s pochopením souvislostí. Za podpisem už text nepokračuje.",
  },
  {
    question: "Proč je v úředním dopisu důležité označení 'Věc:'?",
    correctAnswer: "adresát hned pozná téma",
    options: ["je to zbytečný prvek", "nahrazuje pozdrav", "adresát hned pozná téma", "nahrazuje podpis"],
    hints: ["Na úřadě se dopisy třídí podle agendy dřív, než je někdo přečte celé. Co jim to umožní?"],
    explanation: "Jediný řádek za 'Věc:' umožní dopis zařadit a předat správnému úředníkovi. Oslovení ani podpis přitom nenahrazuje — ty zůstávají povinné.",
  },
  {
    question: "Jak se vyjádříme zdvořile v žádosti o snížení školného?",
    correctAnswer: "Dovoluji si vás požádat o snížení...",
    options: ["Chci snížení školného!", "Potřebuju míň platit.", "Prosím, snižte mi to.", "Dovoluji si vás požádat o snížení..."],
    hints: ["Adresát není povinen vyhovět. Která formulace to bere v úvahu a která zní jako příkaz?"],
    explanation: "Obrat 'Dovoluji si Vás požádat' ponechává rozhodnutí na adresátovi a působí zdvořile. Přímý požadavek ani hovorová prosba do úředního dopisu nepatří.",
  },
  {
    question: "Jaký je rozdíl mezi tiskopisem a volnou žádostí?",
    correctAnswer: "tiskopis má hotová políčka",
    options: ["tiskopis má hotová políčka", "volná žádost má hotová políčka", "tiskopis nemá podpis", "volná žádost nemá strukturu"],
    hints: ["Jeden z těch dokumentů má už předem připravená políčka k vyplnění, druhý musíš napsat celý sám od začátku svými slovy."],
    explanation: "Tiskopis je předtištěný formulář, kde jen doplňuješ údaje. Volnou žádost píšeš celou sám, ale i ona má pevnou strukturu a podpis.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const DOPISUREDNIZADOSTTISKOPISYPRIHLASKADOTAZNIK: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-uredni-zadost-tiskopisy-prihlaska-dotaznik",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-uredni-zadost-tiskopisy-prihlaska-dotaznik",
    title: "Dopis úřední (žádost, přihláška, dotazník)",
    studentTitle: "Úřední dopis",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se napsat úřední dopis nebo žádost.",
    keywords: ["úřední dopis", "žádost", "přihláška", "tiskopis", "formální psaní"],
    goals: [
      "Poznat strukturu úředního dopisu",
      "Napsat jednoduchou žádost nebo přihlášku",
      "Používat správný formální styl",
    ],
    boundaries: [
      "Neprobíráme složité právní dokumenty",
      "Bez podrobného práva a administrativy",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Úřední dopis má pevnou strukturu: záhlaví (kdo a komu) → Věc: (téma) → oslovení → text → závěr → podpis. Vždy piš formálně a zdvořile.",
      steps: [
        "Napiš záhlaví: svou adresu a adresu příjemce.",
        "Uveď Věc: (krátce téma).",
        "Oslov adresáta: Vážený pane / Vážená paní + titul.",
        "Vysvětli důvod, požádej konkrétně.",
        "Zakonči: S úctou / S pozdravem + podpis.",
      ],
      commonMistake: "Žáci zapomenou na oslovení nebo závěrečný zdvořilostní pozdrav. Bez nich dopis působí neúplně.",
      example: "Vážený pane řediteli, dovoluji si Vás požádat o... S úctou, Jana Nováková.",
    },
  },
];
