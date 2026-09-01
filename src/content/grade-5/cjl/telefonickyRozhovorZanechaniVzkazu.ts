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
    question: "Jak správně začneme telefonický hovor?",
    correctAnswer: "představíme se a řekneme, komu voláme",
    options: ["představíme se a řekneme, komu voláme", "rovnou řekneme, co chceme", "počkáme, až nás přepojí", "řekneme jen svoje číslo"],
    hints: ["Ten druhý tě nevidí a neví, kdo volá. Co se musí dozvědět jako první?"],
    explanation: "Na začátku hovoru se představíš a řekneš, koho sháníš — jinak druhá strana neví, s kým mluví ani komu hovor předat.",
  },
  {
    question: "Co musí zanechaný vzkaz obsahovat?",
    correctAnswer: "kdo, kdy, proč a co dál",
    options: [
      "jen jméno volajícího",
      "kdo, kdy, proč a co dál",
      "jen čas hovoru",
      "jen telefonní číslo",
    ],
    hints: ["Vzkaz čte někdo, kdo u telefonu nebyl. Co všechno se musí dozvědět?"],
    explanation: "Úplný vzkaz říká, kdo volal, kdy, o co šlo a co má příjemce udělat. Jediný z těch údajů by mu k reakci nestačil.",
  },
  {
    question: "Jak správně ukončíme telefonický hovor?",
    correctAnswer: "rozloučíme se a počkáme",
    options: ["prostě přestaneme mluvit", "zavěsíme bez rozloučení", "rozloučíme se a počkáme", "necháme telefon ležet"],
    hints: ["Co by si druhá strana pomyslela, kdyby hovor najednou zmlkl?"],
    explanation: "Hovor se uzavře pozdravem a teprve pak se zavěsí — nejlépe až po druhé straně, aby se nestalo, že ještě něco chtěla dodat.",
  },
  {
    question: "Jaký tón používáme při telefonátu s úřadem?",
    correctAnswer: "formální a zdvořilý",
    options: ["přátelský a uvolněný", "stručný bez pozdravu", "rychlý a nervózní", "formální a zdvořilý"],
    hints: ["Mluvíš s někým, koho neznáš a kdo je v práci. Jak bys s ním jednal?"],
    explanation: "S institucí se mluví stejně zdvořile jako v úředním dopise — s pozdravem, vykáním a bez hovorových výrazů.",
  },
  {
    question: "Proč zanecháváme vzkaz, když volaný není dostupný?",
    correctAnswer: "aby věděl, kdo volal",
    options: ["aby věděl, kdo volal", "je to naše povinnost", "vzkaz není nutný", "jen kvůli zdvořilosti"],
    hints: ["Volaný uvidí jen zmeškaný hovor. Co mu z toho nebude jasné?"],
    explanation: "Bez vzkazu se volaný dozví jen to, že mu někdo volal, ale ne kdo a proč. Vzkaz mu umožní reagovat, aniž by musel hádat.",
  },
  {
    question: "Jak začneme vzkaz na záznamník?",
    correctAnswer: "Dobrý den, tady Jana Nováková",
    options: [
      "Hej, jsem to já.",
      "Dobrý den, tady Jana Nováková",
      "Jen rychle…",
      "Kde jste?",
    ],
    hints: ["Záznamník si nepamatuje, kdo mu volá. Čím tedy vzkaz začneš?"],
    explanation: "Vzkaz na záznamník začíná stejně jako živý hovor — pozdravem a představením. Bez jména příjemce netuší, kdo mu volal.",
  },
  {
    question: "Jaký je rozdíl mezi telefonátem příteli a do nemocnice?",
    correctAnswer: "příteli volně, do nemocnice formálně",
    options: ["příteli formálně, do nemocnice volně", "do nemocnice se netelefonuje", "příteli volně, do nemocnice formálně", "obojí je úplně stejné"],
    hints: ["Rozhoduje to, s kým mluvíš. Kdo z těch dvou je pro tebe cizí instituce?"],
    explanation: "S kamarádem si můžeš tykat a mluvit uvolněně, s institucí zachováváš vykání a zdvořilé formulace. Rozhoduje adresát, ne téma hovoru.",
  },
  {
    question: "Co uděláme, pokud jsme zavolali na špatné číslo?",
    correctAnswer: "omluvíme se a zavěsíme",
    options: ["zavěsíme bez omluvy", "pokračujeme v rozhovoru", "vyptáváme se na jméno", "omluvíme se a zavěsíme"],
    hints: ["Někoho jsi vyrušil omylem. Co se v takové situaci patří?"],
    explanation: "Krátká omluva stačí — 'Omlouvám se, spletl jsem si číslo.' Vyptávat se cizího člověka na jeho údaje se nepatří.",
  },
  {
    question: "Co uděláme, když nám volá neznámé číslo?",
    correctAnswer: "Dobrý den, kdo volá, prosím?",
    options: ["Dobrý den, kdo volá, prosím?", "Okamžitě zavěsíme.", "Hned sdělíme svou adresu.", "Přijmeme hovor mlčky."],
    hints: ["Nevíš, kdo je na druhé straně. Co zjistíš dřív, než cokoli prozradíš?"],
    explanation: "Zdvořilá otázka na totožnost volajícího je běžná a bezpečná. Své osobní údaje neznámému člověku nesdělujeme.",
  },
  {
    question: "Co ve vzkazu nesmí chybět, aby šlo zavolat zpět?",
    correctAnswer: "kontakt pro zpětné volání",
    options: [
      "jen naše jméno",
      "kontakt pro zpětné volání",
      "jen čas hovoru",
      "jméno našeho psa",
    ],
    hints: ["Příjemce chce reagovat. Co k tomu nutně potřebuje?"],
    explanation: "Bez telefonního čísla nebo e-mailu se příjemce nemá jak ozvat, i kdyby chtěl. Kontakt je proto ve vzkazu nejdůležitější údaj.",
  },
  {
    question: "Jak se představíme na začátku formálního telefonátu?",
    correctAnswer: "Dobrý den, jmenuji se…",
    options: ["Čau, jsem Honza.", "Víte, kdo jsem?", "Dobrý den, jmenuji se…", "Hej, posloucháte?"],
    hints: ["Formální hovor začíná dvěma věcmi. Pozdravem a čím ještě?"],
    explanation: "Ve formálním hovoru se představíš celým jménem a hned uvedeš, čeho se hovor týká. Zkrácené jméno patří jen mezi známé.",
  },
  {
    question: "Kdy je vhodné zavolat?",
    correctAnswer: "v obvyklou denní dobu",
    options: ["kdykoli, i v noci", "jen ráno před osmou", "jen o víkendu", "v obvyklou denní dobu"],
    hints: ["Kdy bys sám nerad zvedal telefon?"],
    explanation: "Volá se v době, kdy člověk běžně bdí a je zastižitelný. Noční ani velmi časný hovor se hodí jen v naléhavé situaci.",
  },
  {
    question: "Co je hlasová schránka (záznamník)?",
    correctAnswer: "zaznamená vzkaz místo nás",
    options: ["zaznamená vzkaz místo nás", "seznam telefonních čísel", "způsob přepojení hovoru", "zvláštní druh telefonu"],
    hints: ["Nezvedneš telefon, a přesto se později dozvíš, co ti chtěli. Jak to?"],
    explanation: "Záznamník nahraje, co volající řekne, když hovor nikdo nepřijme. Vzkaz si pak vyslechneš, až budeš mít čas.",
  },
  {
    question: "Jak zdvořile požádáme o přepojení?",
    correctAnswer: "Mohl byste mě prosím přepojit?",
    options: [
      "Přepoj mě hned!",
      "Mohl byste mě prosím přepojit?",
      "Dej mi dalšího.",
      "Chci jiné číslo.",
    ],
    hints: ["Žádáš o službu někoho, koho neznáš. Jak takovou prosbu zformuluješ?"],
    explanation: "Zdvořilá prosba používá podmiňovací způsob a slovo 'prosím'. Rozkaz by ve formálním hovoru působil hrubě.",
  },
  {
    question: "Co zapíšeme do písemného vzkazu pro kolegu?",
    correctAnswer: "jméno, čas, obsah, kontakt",
    options: ["jen jméno volajícího", "jen čas hovoru", "jméno, čas, obsah, kontakt", "jen obsah vzkazu"],
    hints: ["Kolega u telefonu nebyl. Co všechno musí ze vzkazu vyčíst?"],
    explanation: "Písemný vzkaz musí obsahovat všechny čtyři údaje, jinak si kolega nedokáže hovor zařadit ani na něj odpovědět.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Který vzkaz pro rodiče je úplný?",
    correctAnswer: "Volala paní Nováková, prosí o zavolání",
    options: ["Někdo dnes ráno volal.", "Máme tu nějaký vzkaz.", "Zavolej někomu zpátky.", "Volala paní Nováková, prosí o zavolání"],
    hints: ["Porovnej možnosti: ze které se rodiče dozvědí, kdo volal i co se od nich čeká?"],
    explanation: "Úplný vzkaz uvádí jméno volajícího a to, co má příjemce udělat. Zbylé možnosti neříkají ani jedno, takže se podle nich nedá zařídit nic.",
  },
  {
    question: "Telefonuješ do knihovny. Jak se správně zeptáš na otevírací dobu?",
    correctAnswer: "Dobrý den, jaká je otevírací doba?",
    options: ["Dobrý den, jaká je otevírací doba?", "Kdy máte otevřeno?", "Máte teď otevřeno?", "Hej, jaké máte časy?"],
    hints: ["Formální otázka má tři části: pozdrav, zdvořilou formulaci a konkrétní dotaz. Která možnost je má všechny?"],
    explanation: "Zdvořilý dotaz začíná pozdravem a ptá se konkrétně. Otázka bez pozdravu působí odměřeně a hovorová varianta do instituce nepatří.",
  },
  {
    question: "Co řekneš hned po pozdravu?",
    correctAnswer: "kdo jste a proč voláte",
    options: [
      "rovnou svůj požadavek",
      "kdo jste a proč voláte",
      "počkáte, až se zeptají",
      "své telefonní číslo",
    ],
    hints: ["Druhá strana potřebuje vědět dvě věci naráz. Které to jsou?"],
    explanation: "Po pozdravu následuje představení a důvod hovoru. Teprve když druhá strana ví, s kým mluví a o co jde, může reagovat.",
  },
  {
    question: "Při telefonátu špatně slyšíš. Co řekneš?",
    correctAnswer: "Promiňte, mohl byste to zopakovat?",
    options: ["Jen mlčky přikývnete.", "Zavěsíte bez omluvy.", "Promiňte, mohl byste to zopakovat?", "Začnete hlasitě křičet."],
    hints: ["Nerozuměl jsi. Je lepší se přiznat, nebo dělat, že rozumíš?"],
    explanation: "Požádat o zopakování je běžná a slušná součást hovoru. Mlčení by vedlo k nedorozumění a křik by situaci nezlepšil.",
  },
  {
    question: "Co řekneš na záznamník jako první?",
    correctAnswer: "jméno a čas volání",
    options: ["jen důvod hovoru", "jen zpětný kontakt", "pozdrav bez jména", "jméno a čas volání"],
    hints: ["Vzkaz si příjemce poslechne třeba za dva dny. Co proto musí zaznít hned na začátku?"],
    explanation: "Na začátku vzkazu musí být jasné, kdo a kdy volal. Teprve pak dává smysl důvod hovoru i kontakt.",
  },
  {
    question: "Jak zní přirozené ukončení formálního hovoru?",
    correctAnswer: "Na shledanou, hezký den.",
    options: ["Na shledanou, hezký den.", "Tak zatím, čau.", "Pá pá, měj se.", "Tak teda."],
    hints: ["Tři možnosti bys řekl kamarádovi. Která zbývá pro úřad nebo firmu?"],
    explanation: "Formální rozloučení tvoří pozdrav a případně přání hezkého dne. Hovorové varianty patří jen mezi známé.",
  },
  {
    question: "Proč si vzkaz zapíšeme hned po hovoru?",
    correctAnswer: "abychom nezapomněli podrobnosti",
    options: [
      "protože to nařizuje zákon",
      "abychom nezapomněli podrobnosti",
      "abychom měli víc práce",
      "zapisovat není potřeba",
    ],
    hints: ["Vzpomeneš si na přesné číslo a čas ještě za hodinu?"],
    explanation: "Čísla, jména a časy z hlavy rychle vyprchají. Zápis hned po hovoru je jediný způsob, jak je předat přesně.",
  },
  {
    question: "Jak dlouhý má být vzkaz na záznamníku?",
    correctAnswer: "stručný, jen podstatné",
    options: ["co nejdelší a podrobný", "bez jména a kontaktu", "stručný, jen podstatné", "vzkaz se nenechává"],
    hints: ["Záznamník má omezený čas a příjemce si vzkaz poslechne ve spěchu. Co z toho plyne?"],
    explanation: "Vzkaz má obsahovat jméno, čas, důvod a kontakt — a nic navíc. Dlouhé vyprávění se do záznamu často ani nevejde.",
  },
  {
    question: "Při formálním telefonátu nikdy neřekneme:",
    correctAnswer: "čau, hele, fakt?",
    options: ["Dobrý den.", "Chtěl jsem se zeptat.", "Na shledanou.", "čau, hele, fakt?"],
    hints: ["Tři možnosti bys ve formálním hovoru čekal. Která tam nepatří?"],
    explanation: "Hovorové výrazy narušují formální ráz hovoru. Ostatní tři formulace jsou naopak jeho běžnou součástí.",
  },
  {
    question: "Nejsi si jistý, zda jsi správně porozuměl. Co uděláš?",
    correctAnswer: "zopakujeme, co jsme slyšeli",
    options: ["zopakujeme, co jsme slyšeli", "předpokládáme, že je to tak", "zavěsíme a zavoláme znovu", "zeptáme se někoho jiného"],
    hints: ["Jak si ověříš, že jsi rozuměl správně, aniž bys hovor přerušil?"],
    explanation: "Když shrneš vlastními slovy, co jsi pochopil, druhá strana to buď potvrdí, nebo opraví. Nedorozumění se tak odhalí hned.",
  },
  {
    question: "Jak se liší SMS od telefonního vzkazu?",
    correctAnswer: "psaná forma, stejný obsah",
    options: [
      "psaná forma, méně obsahu",
      "psaná forma, stejný obsah",
      "SMS vzkazem vůbec není",
      "SMS je vždy lepší",
    ],
    hints: ["Změní se způsob předání. Změní se i to, co musí vzkaz obsahovat?"],
    explanation: "SMS je psaná, ale musí obsahovat totéž co mluvený vzkaz — kdo píše, o co jde a kontakt. Forma se mění, obsah ne.",
  },
  {
    question: "Jak je vhodné telefonovat ve veřejné dopravě?",
    correctAnswer: "stručně a tlumeně",
    options: ["hlasitě a podrobně", "vůbec nezvedat telefon", "stručně a tlumeně", "zapnout hlasitý odposlech"],
    hints: ["Kolem tebe sedí cizí lidé. Co z toho plyne pro hlasitost i délku hovoru?"],
    explanation: "V dopravě se mluví krátce a potichu, případně se domluví zavolání později. Hlasitý hovor obtěžuje ostatní cestující.",
  },
  {
    question: "Co je dobrým zvykem před formálním telefonátem?",
    correctAnswer: "připravit si klíčové body",
    options: ["volat úplně bez přípravy", "mít u sebe kamaráda", "volat vždy jen z domova", "připravit si klíčové body"],
    hints: ["Co ti pomůže, abys během hovoru na nic nezapomněl?"],
    explanation: "Několik poznámek předem zajistí, že hovor bude přehledný a nic důležitého nevynecháš. Bez přípravy se snadno ztratíš.",
  },
  {
    question: "Jak napíšeš vzkaz, když nevíš přesně, co volající chtěl?",
    correctAnswer: "co víme a prosbu o zavolání",
    options: ["co víme a prosbu o zavolání", "domyslíme si zbytek", "nevzkážeme raději nic", "napíšeme jen čas hovoru"],
    hints: ["Neúplná informace je pořád lepší než žádná. Co k ní ale musíš přidat?"],
    explanation: "Zapíšeš, co víš, a doplníš, ať se příjemce ozve zpět. Domýšlet si obsah by mohlo vést k nedorozumění.",
  },
  {
    question: "Jak si ověříš telefonní číslo, které ti někdo diktuje?",
    correctAnswer: "zopakuji ho nahlas zpátky",
    options: [
      "zapíšu si ho potichu",
      "zopakuji ho nahlas zpátky",
      "zeptám se na jméno",
      "poprosím o e-mail",
    ],
    hints: ["Jak druhá strana pozná, že sis číslo zapsal správně?"],
    explanation: "Když číslo přečteš nahlas zpátky, volající hned uslyší případnou chybu a opraví ji. Tichý zápis nikdo nezkontroluje.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jak správně zahájíš hovor s ordinací lékaře?",
    correctAnswer: "Dobrý den, rád bych se objednal.",
    options: ["Ahoj, potřebuju doktora.", "Máte volné místo?", "Dobrý den, rád bych se objednal.", "Hej, potřebuju pomoc."],
    hints: ["Ordinace je instituce. Co musí zaznít kromě toho, co chceš?"],
    explanation: "Hovor s ordinací začíná pozdravem, představením a zdvořile formulovaným požadavkem. Tykání ani strohý dotaz se sem nehodí.",
  },
  {
    question: "Jak se omluvíš, když voláš v nevhodnou dobu?",
    correctAnswer: "Omlouvám se, že volám takhle pozdě.",
    options: ["Promiňte a hned mluvíme dál.", "Dobu volání nezmiňujeme.", "Zavěsíme bez omluvy.", "Omlouvám se, že volám takhle pozdě."],
    hints: ["Víš, že jsi vyrušil. Přiznáš to, nebo to přejdeš mlčením?"],
    explanation: "Vyrušil jsi mimo obvyklou dobu, takže se to sluší pojmenovat a omluvit. Přejít to mlčky by působilo bezohledně.",
  },
  {
    question: "Co zapíšeš do vzkazu o informační schůzce ve škole?",
    correctAnswer: "datum, kdo, čas, zpráva, kontakt",
    options: ["datum, kdo, čas, zpráva, kontakt", "jen název školy", "jen datum schůzky", "jen telefonní číslo"],
    hints: ["Rodiče musí vědět, kdy schůzka je, kdo volal a jak se doptat. Která možnost to pokrývá?"],
    explanation: "Vzkaz o schůzce musí obsahovat všechny údaje najednou, aby rodiče věděli, kam a kdy přijít a na koho se obrátit s dotazem.",
  },
  {
    question: "Jak přijmeš pracovní telefonát od neznámé firmy?",
    correctAnswer: "Dobrý den, u telefonu Nováková.",
    options: [
      "Kdo volá a odkud?",
      "Dobrý den, u telefonu Nováková.",
      "Haló, co chcete?",
      "Počkejte chvilku.",
    ],
    hints: ["I když nevíš, kdo volá, začínáš ty. Čím?"],
    explanation: "Při přijetí hovoru se představíš, aby volající věděl, s kým mluví. Strohé 'Haló' ani protiotázka nejsou vhodným začátkem.",
  },
  {
    question: "Co řekneš nejdřív při volání na tísňovou linku?",
    correctAnswer: "kde jsme a co se stalo",
    options: ["svoje jméno a věk", "svoje telefonní číslo", "kde jsme a co se stalo", "dnešní datum a čas"],
    hints: ["Záchranáři musí vyjet co nejrychleji. Co k tomu potřebují ze všeho nejdřív?"],
    explanation: "Bez místa a popisu situace nemůže dispečink poslat pomoc. Ostatní údaje se doplní až potom.",
  },
  {
    question: "Co chybí ve vzkazu 'Volala Jana, zavolejte zpět.'?",
    correctAnswer: "čas volání a telefon",
    options: ["jméno volající osoby", "prosba o zavolání", "pozdrav na začátku", "čas volání a telefon"],
    hints: ["Projdi si, co ve vzkazu je. Které dva povinné údaje tam nenajdeš?"],
    explanation: "Jméno i prosba o zavolání ve vzkazu jsou, ale chybí kdy Jana volala a na jaké číslo se má příjemce ozvat. Bez čísla nelze zavolat zpět.",
  },
  {
    question: "Proč je důležité mluvit pomalu a jasně?",
    correctAnswer: "aby si druhý stihl zapsat",
    options: ["aby si druhý stihl zapsat", "kvůli lepšímu signálu", "aby hovor trval déle", "je to jen zvyk"],
    hints: ["Druhá strana si často píše poznámky. Co jí rychlá řeč znemožní?"],
    explanation: "Při telefonu se nedá odezírat ze rtů, takže rychlá nebo nezřetelná řeč vede k chybám. Pomalé tempo dá druhé straně čas zapisovat.",
  },
  {
    question: "Co uděláš, když sdělujeme přesné číslo nebo adresu?",
    correctAnswer: "zopakujeme a necháme potvrdit",
    options: [
      "řekneme je jen jednou",
      "zopakujeme a necháme potvrdit",
      "pošleme raději e-mail",
      "nadiktujeme je rychle",
    ],
    hints: ["Jediné přeslechnuté číslo znehodnotí celý údaj. Jak se tomu vyhneš?"],
    explanation: "Zopakování údaje a jeho potvrzení druhou stranou odhalí chybu hned. U čísel a adres je to nejspolehlivější pojistka.",
  },
  {
    question: "Jak řekneš, že musíš hovor přerušit?",
    correctAnswer: "Promiňte, mohu vám zavolat zpět?",
    options: ["Musím jít. Nashle.", "Zavěsíme bez omluvy.", "Promiňte, mohu vám zavolat zpět?", "Mlčky odložíme telefon."],
    hints: ["Nestačí jen odejít. Co druhé straně nabídneš, aby o nic nepřišla?"],
    explanation: "K omluvě patří i nabídka, že se ozveš znovu — druhá strana tak ví, že hovor není odbytý. Bez ní působí přerušení nezdvořile.",
  },
  {
    question: "Co znamená zavolat zpět?",
    correctAnswer: "voláme tomu, kdo volal nám",
    options: ["voláme na jiné číslo", "přepojíme hovor dál", "necháme si zavolat", "voláme tomu, kdo volal nám"],
    hints: ["Slovo 'zpět' napovídá směr. Kdo se ozval jako první?"],
    explanation: "Zpětné zavolání znamená, že se ozveš tomu, kdo se tě pokoušel zastihnout. Proto ve vzkazu nikdy nesmí chybět kontakt.",
  },
  {
    question: "Proč se u tísňového volání nemá zavěsit jako první?",
    correctAnswer: "operátor se může ještě ptát",
    options: ["operátor se může ještě ptát", "hovor je tím dražší", "je to zakázané zákonem", "číslo by se zablokovalo"],
    hints: ["Dispečink potřebuje upřesnit místo nebo stav zraněného. Co když už nebudeš na lince?"],
    explanation: "Operátor často doplňuje otázky nebo radí, co dělat do příjezdu pomoci. Proto se čeká, až hovor ukončí on.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const TELEFONICKYROZHOVORZANECHANIVZKAZU: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-telefonicky-rozhovor-zanechani-vzkazu",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-telefonicky-rozhovor-zanechani-vzkazu",
    title: "Telefonický rozhovor, zanechání vzkazu",
    studentTitle: "Telefonování a vzkazy",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se správně telefonovat a zanechat vzkaz.",
    keywords: ["telefonování", "vzkaz", "hovor", "formální komunikace", "záznamník"],
    goals: [
      "Správně zahájit a ukončit telefonický hovor",
      "Zanechat kompletní a srozumitelný vzkaz",
      "Rozlišit formální a neformální telefonát",
    ],
    boundaries: [
      "Neprobíráme technické aspekty telefonování",
      "Bez složité analýzy komunikačních stylů",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Formální telefonát: Dobrý den, jmenuji se... Volám ohledně... Kompletní vzkaz: kdo volal + kdy + proč + kontakt pro zpětné zavolání.",
      steps: [
        "Začni: Dobrý den + představení.",
        "Uveď předmět hovoru.",
        "Mluv jasně a pomalu.",
        "Při zanechání vzkazu: kdo + kdy + proč + kontakt.",
        "Zakonči: Na shledanou / Hezký den.",
      ],
      commonMistake: "Žáci zapomenou zanechat kontakt pro zpětné zavolání nebo nesdělí čas hovoru.",
      example: "Dobrý den, tady Tomáš Novák, volám ve 14 hodin kvůli dohodnuté schůzce. Prosím, zavolejte mi zpět na 777 000 000.",
    },
  },
];
