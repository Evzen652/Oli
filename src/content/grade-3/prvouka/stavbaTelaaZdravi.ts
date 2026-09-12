import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-12 (inventura obsahu): dřív 10/10/10 unikátních úloh, chybné
// možnosti bez zpětné vazby (30 nálezů) a nápovědy bez gradace (21 nálezů).
// Teď tři oddělené banky ručně psaných úloh; každá má vlastní dvojici nápověd,
// vysvětlení PROČ a konkrétní zpětnou vazbu u každé chybné možnosti:
//   L1 rozpoznání — co která kost chrání, co dělá který orgán, základní
//      zásady zdraví (spánek, pohyb, čištění zubů)
//   L2 aplikace — funkce kostry, svalů a orgánů a důvody zdravých návyků
//   L3 transfer — dvoukrokové řetězce (pohyb, kyslík, živiny), inverze
//      (prohozené role orgánů) a důsledky nedostatku spánku či pohybu

type D = [string, string];
type U = { q: string; a: string; emoji: string; d: [D, D, D]; h: [string, string]; e: string };

function uloha(u: U): PracticeTask {
  const t = choice(u.q, u.a, u.d.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor], {
    hints: u.h,
    explanation: u.e,
  });
  return { ...t, emoji: u.emoji };
}

const L1: U[] = [
  {
    q: "Co chrání lebka?",
    a: "Mozek",
    emoji: "🧠",
    d: [
      ["Srdce", "Srdce je v hrudníku a chrání ho žebra, ne kost na hlavě."],
      ["Plíce", "Plíce leží v hrudníku pod žebry, v hlavě je nenajdeš."],
      ["Ledviny", "Ledviny jsou vzadu v dolní části zad, daleko od hlavy."],
    ],
    h: [
      "Lebka je kostěná schránka na hlavě. Co je v hlavě nejdůležitější?",
      "Kostěná přilba na hlavě kryje orgán, který řídí myšlení, smysly i pohyb. Ostatní nabízené orgány najdeš mnohem níž — v hrudníku nebo v zádech.",
    ],
    e: "Lebka je pevná kostěná schránka, která chrání mozek před nárazem. Proto se na kolo navíc nasazuje ještě přilba.",
  },
  {
    q: "Co chrání žebra?",
    a: "Srdce a plíce",
    emoji: "🫁",
    d: [
      ["Mozek a mícha", "Mozek chrání lebka a míchu páteř, žebra s nimi nemají co dělat."],
      ["Žaludek a střeva", "Žaludek a střeva leží v břiše pod žebry, klec je nekryje."],
      ["Kolena a lokty", "Klouby na končetinách žádná kost hrudníku nechrání."],
    ],
    h: [
      "Žebra tvoří klec kolem hrudníku. Které dva orgány v hrudníku leží?",
      "Sáhni si na hrudník a nahmatej pruhy kostí. Uvnitř téhle klece pracuje pumpa, která rozhání krev, a nafukují se měchy, kterými dýcháš.",
    ],
    e: "Žebra tvoří pevnou klec kolem hrudníku. Chrání srdce a plíce, aby je náraz nepoškodil.",
  },
  {
    q: "Který orgán přečerpává krev po celém těle?",
    a: "Srdce",
    emoji: "❤️",
    d: [
      ["Plíce", "Plíce vyměňují plyny při dýchání, krev ale neroztlačují."],
      ["Mozek", "Mozek tělo řídí, krev nikam nepumpuje."],
      ["Ledviny", "Ledviny krev čistí, ale rozvádět ji po těle neumějí."],
    ],
    h: [
      "Je to sval velký asi jako tvá pěst a nikdy si neodpočine.",
      "Přilož si dlaň na levou stranu hrudníku a ucítíš pravidelné údery. Tenhle orgán se celý život stahuje a uvolňuje, aby krev dorazila až do prstů na nohou.",
    ],
    e: "Srdce je svalová pumpa. Stahem vhání krev do cév a rozvádí ji s kyslíkem a živinami do celého těla.",
  },
  {
    q: "Kterým orgánem dýcháme?",
    a: "Plícemi",
    emoji: "💨",
    d: [
      ["Ledvinami", "Ledviny čistí krev, vzduch do nich nevede žádná cesta."],
      ["Žaludkem", "Do žaludku jde jícnem jídlo, ne nadechnutý vzduch."],
      ["Srdcem", "Srdce pohání krev, vzduch nenasává ani nevypouští."],
    ],
    h: [
      "Když se nadechneš, hrudník se zvedne. Co se v něm nafouklo?",
      "Vzduch projde nosem a průdušnicí až do dvou měkkých měchů v hrudníku. Tam se z něj odebere kyslík a zpátky se vydechne oxid uhličitý.",
    ],
    e: "Dýcháme plícemi. Vzduch do nich proudí průdušnicí, plíce z něj odeberou kyslík a předají ho krvi.",
  },
  {
    q: "Který orgán čistí krev a tvoří moč?",
    a: "Ledviny",
    emoji: "🫘",
    d: [
      ["Plíce", "Plíce pracují se vzduchem, odpadní látky z krve nefiltrují."],
      ["Srdce", "Srdce krev jen rozvádí, žádné odpadní látky z ní nebere."],
      ["Mozek", "Mozek tělo řídí, filtrovat krev neumí."],
    ],
    h: [
      "Jsou dvě, leží vzadu v dolní části zad a mají tvar fazole.",
      "Tenhle párový orgán funguje jako filtr. Vytáhne z krve nepotřebné látky i přebytečnou vodu a pošle je dál do močového měchýře.",
    ],
    e: "Ledviny filtrují krev. Z odpadních látek a přebytečné vody tvoří moč, která odchází přes močový měchýř ven z těla.",
  },
  {
    q: "Která kost drží tělo vzpřímené a chrání míchu?",
    a: "Páteř",
    emoji: "🦴",
    d: [
      ["Lebka", "Lebka chrání mozek na hlavě, mícha jí neprochází."],
      ["Žebra", "Žebra kryjí srdce a plíce v hrudníku, míchu ne."],
      ["Kyčelní kost", "Kyčelní kost spojuje nohu s trupem, míchu nechrání."],
    ],
    h: [
      "Je složená z mnoha obratlů a táhne se od krku až k pánvi.",
      "Ohni se dopředu a nahmatej v zádech řadu tvrdých hrbolků pod kůží. Ty kosti jsou poskládané na sebe jako korálky a uvnitř jimi prochází svazek nervů.",
    ],
    e: "Páteř je sloupec obratlů. Drží tělo vzpřímené a uvnitř chrání míchu — svazek nervů mezi mozkem a zbytkem těla.",
  },
  {
    q: "Čím jsou svaly připojené ke kostem?",
    a: "Šlachami",
    emoji: "💪",
    d: [
      ["Cévami", "Cévami proudí krev. Sval ke kosti nepřipoutají."],
      ["Nervy", "Nervy vedou signály z mozku, ale nic v těle nedrží."],
      ["Kůží", "Kůže je vnější obal těla, uvnitř nic nepřipevňuje."],
    ],
    h: [
      "Jsou to pevná bílá vlákna a to nejznámější z nich cítíš vzadu nad patou.",
      "Sval by se ke kosti sám nepřichytil. Potřebuje pevné lanko, které přenese jeho stah na kost — díky němu se ti při chůzi zvedne pata.",
    ],
    e: "Svaly jsou ke kostem připojené šlachami. Když se sval stáhne, šlacha zatáhne za kost a končetina se pohne.",
  },
  {
    q: "Kolik hodin spánku denně potřebuje dítě ve věku 8 až 9 let?",
    a: "9 až 11 hodin",
    emoji: "😴",
    d: [
      ["4 až 5 hodin", "Tolik spánku nestačí ani dospělému, natož rostoucímu dítěti."],
      ["6 až 7 hodin", "To je pořád méně, než rostoucí tělo ke zotavení potřebuje."],
      ["14 až 15 hodin", "Tolik prospí kojenec. Školák tolik spánku nepotřebuje."],
    ],
    h: [
      "Školák potřebuje víc spánku než dospělý, který spí zhruba osm hodin.",
      "Dospělému stačí kolem osmi hodin. Dítě, které roste a hodně se učí, potřebuje o něco víc — ale zdaleka ne tolik jako miminko, které prospí většinu dne.",
    ],
    e: "Dítě ve věku 8 až 9 let potřebuje 9 až 11 hodin spánku. Během spánku se tělo zotavuje, roste a mozek si ukládá, co se přes den naučil.",
  },
  {
    q: "Jak dlouho by se děti měly každý den hýbat?",
    a: "Alespoň 60 minut",
    emoji: "🏃",
    d: [
      ["Zhruba 5 minut", "Pět chvilek rozcvičky je málo, na zdraví to nestačí."],
      ["Zhruba 15 minut", "Čtvrthodina je pořád málo. Doporučení je výrazně delší."],
      ["Celý den bez přestávky", "Tělo potřebuje i odpočinek. Nepřetržitý pohyb zdravý není."],
    ],
    h: [
      "Doporučení mluví o víc než hodině pohybu denně, ale rozhodně ne o celém dni.",
      "Počítá se všechno dohromady: cesta do školy pěšky, tělocvik, hraní venku i jízda na kole. Sečteno by toho mělo být víc než hodina, rozložená do celého dne.",
    ],
    e: "Děti by se měly hýbat alespoň 60 minut denně. Nemusí to být najednou — počítá se chůze do školy, tělocvik i hraní venku.",
  },
  {
    q: "Který orgán rozmělní snědené jídlo na kaši?",
    a: "Žaludek",
    emoji: "🍽️",
    d: [
      ["Plíce", "Plíce zpracovávají vzduch, s jídlem nepřijdou do styku."],
      ["Srdce", "Srdce pohání krev, jídlo netráví."],
      ["Mozek", "Mozek tělo řídí, jídlo ale nerozkládá."],
    ],
    h: [
      "Je to vak pod žebry, do kterého jídlo spadne hned po polknutí.",
      "Sousto sjede jícnem dolů do svalnatého vaku plného kyselé šťávy. Tam se rozmělní, aby živiny mohly později projít do krve.",
    ],
    e: "Žaludek je svalnatý vak. Jídlo se v něm smíchá s trávicí šťávou a rozloží se na kaši; živiny se pak vstřebávají ve střevech.",
  },
  {
    q: "Jak často bychom si měli čistit zuby?",
    a: "Dvakrát denně",
    emoji: "🪥",
    d: [
      ["Jednou týdně", "Za týden by se na zubech usadil povlak a vznikl kaz."],
      ["Jen když bolí zub", "Když zub bolí, kaz už je hotový. Čistit se má předem."],
      ["Pětkrát za hodinu", "Tak časté drhnutí by dráždilo dásně a poškodilo sklovinu."],
    ],
    h: [
      "Zubní povlak se tvoří celý den i celou noc.",
      "Zbytky jídla se na zubech usazují ráno i večer. Zubaři proto radí čistit zuby na začátku a na konci dne — hlavně ten večerní je důležitý, aby povlak nepůsobil přes noc.",
    ],
    e: "Zuby si čistíme dvakrát denně — ráno a večer. Večerní čištění je nejdůležitější, protože přes noc se tvoří méně slin, které by zuby chránily.",
  },
  {
    q: "Který orgán je největší a tvoří vnější obal celého těla?",
    a: "Kůže",
    emoji: "🖐️",
    d: [
      ["Sval", "Svalů máme v těle spoustu, ale vnější obal netvoří."],
      ["Kost", "Kosti tvoří vnitřní kostru, ne vnější obal."],
      ["Plíce", "Plíce jsou schované v hrudníku, na povrchu je nenajdeš."],
    ],
    h: [
      "Je na celém tvém povrchu a cítíš jí teplo, chlad i dotek.",
      "Tenhle orgán obaluje tělo odshora až dolů. Chrání ho před špínou a bakteriemi, drží uvnitř vodu a pomáhá udržet stálou teplotu.",
    ],
    e: "Kůže je největší orgán těla. Chrání vnitřek před poškozením i bakteriemi, vnímá dotek a pomáhá udržovat tělesnou teplotu.",
  },
  {
    q: "Co rozváží po těle kyslík a živiny?",
    a: "Krev",
    emoji: "🩸",
    d: [
      ["Vzduch", "Vzduch zůstane v plicích. Dál po těle ho nic nerozvádí."],
      ["Sliny", "Sliny pomáhají trávit jídlo v ústech, po těle nekolují."],
      ["Moč", "Moč je odpad, který z těla odchází. Nic po těle neroznáší."],
    ],
    h: [
      "Je červená, proudí cévami a objeví se, když se řízneš.",
      "Tahle červená tekutina proudí trubičkami po celém těle. Kyslík si vyzvedne v plicích, živiny ve střevech a rozveze je až do konečků prstů.",
    ],
    e: "Krev rozváží po těle kyslík z plic a živiny ze střev a odnáší odpadní látky. Pohání ji srdce.",
  },
  {
    q: "Který smysl sídlí v uchu?",
    a: "Sluch",
    emoji: "👂",
    d: [
      ["Zrak", "Zrakem vnímáme očima, ne ušima."],
      ["Čich", "Čich sídlí v nose, tam vnímáme vůně a pachy."],
      ["Chuť", "Chuť vnímáme jazykem v ústech."],
    ],
    h: [
      "Ucho zachytává zvuky. Jak se ten smysl jmenuje?",
      "Zvuk rozechvěje bubínek v uchu a nerv pošle signál do mozku. Ostatní tři nabízené smysly patří k oku, k nosu a k jazyku.",
    ],
    e: "V uchu sídlí sluch. Zvuk rozechvěje ušní bubínek, nerv přenese signál do mozku a my slyšíme.",
  },
];

const L2: U[] = [
  {
    q: "K čemu slouží kostra?",
    a: "Dává tělu tvar, chrání orgány a umožňuje pohyb",
    emoji: "🦴",
    d: [
      ["Rozvádí po těle krev a kyslík", "Krev rozvádí srdce s cévami, ne kosti."],
      ["Tráví jídlo a bere z něj živiny", "Trávení má na starost žaludek a střeva."],
      ["Řídí myšlení a přijímá signály", "Řízení a myšlení zajišťuje mozek."],
    ],
    h: [
      "Zamysli se, co by se s tělem stalo, kdyby v něm žádné kosti nebyly.",
      "Kostra plní víc úkolů najednou. Jeden je opora, aby se tělo nesesunulo, druhý je krytí měkkých vnitřností a třetí souvisí s tím, že kosti jsou v kloubech pohyblivé.",
    ],
    e: "Kostra dává tělu tvar a oporu, kryje měkké orgány (lebka mozek, žebra srdce a plíce) a spolu se svaly umožňuje pohyb.",
  },
  {
    q: "K čemu slouží svaly?",
    a: "Stahují se a uvolňují, a tím hýbou kostmi",
    emoji: "💪",
    d: [
      ["Rozvádějí krev do celého těla", "Krev rozvádí srdce a cévy, ne svalstvo."],
      ["Vyrábějí v těle novou krev", "Krev se tvoří v kostní dřeni uvnitř kostí."],
      ["Chrání mozek před tvrdým nárazem", "Mozek chrání lebka, měkký sval by náraz neudržel."],
    ],
    h: [
      "Zatni biceps na paži a sleduj, co se s ním stane.",
      "Sval umí jen jedno: zkrátit se a pak se zase natáhnout. Když se zkrátí, zatáhne přes šlachu za kost a ta se v kloubu pohne.",
    ],
    e: "Sval se umí stáhnout a zase uvolnit. Stah přenese šlacha na kost, kost se v kloubu pohne — tak vzniká každý pohyb.",
  },
  {
    q: "Co dělá srdce?",
    a: "Přečerpává krev a posílá ji do celého těla",
    emoji: "❤️",
    d: [
      ["Nasává vzduch a odebírá z něj kyslík", "Vzduch nasávají plíce, ne tenhle orgán."],
      ["Čistí krev a tvoří z odpadu moč", "Filtrování krve zvládnou jen ledviny."],
      ["Řídí myšlení, smysly a pohyby těla", "Řízení a myšlení má na starost mozek."],
    ],
    h: [
      "Je to dutý sval, který se celý život pravidelně stahuje.",
      "Představ si pumpu, která nikdy nepřestane pracovat. Při každém stahu vystřelí tekutinu do trubiček a rozešle ji až do konečků prstů.",
    ],
    e: "Srdce je svalová pumpa. Stahem vytlačí krev do tepen a rozvede ji s kyslíkem a živinami do celého těla.",
  },
  {
    q: "Co se děje v plicích?",
    a: "Z nadechnutého vzduchu se bere kyslík a vydechuje oxid uhličitý",
    emoji: "🫁",
    d: [
      ["Ze snědeného jídla se berou živiny pro celé tělo", "Živiny z jídla vstřebávají střeva, ne tenhle orgán."],
      ["Z krve se odfiltrují odpadní látky a vzniká moč", "Filtrování krve a tvorbu moči mají na starost ledviny."],
      ["Vytváří se nová krev pro celé tělo", "Krev vzniká v kostní dřeni uvnitř kostí."],
    ],
    h: [
      "Co se při nádechu do těla dostane a co při výdechu odejde ven?",
      "V plicích se potkávají dvě věci: vzduch v drobných váčcích a krev v tenkých cévkách. Mezi nimi proběhne výměna — jeden plyn jde do krve a druhý z krve ven.",
    ],
    e: "V plicích krev přebírá z nadechnutého vzduchu kyslík a odevzdává oxid uhličitý, který vydechneme. Proto se dýchání nesmí zastavit.",
  },
  {
    q: "Co dělá mozek?",
    a: "Řídí tělo, myšlení, pohyby i smysly",
    emoji: "🧠",
    d: [
      ["Rozvádí po těle krev a živiny", "Rozvod krve zajišťuje srdce spolu s cévami."],
      ["Vyměňuje kyslík za oxid uhličitý", "Výměna plynů probíhá v plicích při dýchání."],
      ["Rozkládá snědené jídlo na živiny", "Rozklad jídla probíhá v žaludku a ve střevech."],
    ],
    h: [
      "Sídlí v lebce a nervy ho spojují s celým tělem.",
      "Všechno, co vidíš, slyšíš a cítíš, se sbíhá na jednom místě. Odtud pak putují povely zpátky do svalů. Je to velitelství celého těla.",
    ],
    e: "Mozek je řídicí středisko. Zpracuje signály ze smyslů, rozhoduje, přemýšlí a nervy posílá povely svalům.",
  },
  {
    q: "Co dělají ledviny?",
    a: "Čistí krev a z odpadních látek tvoří moč",
    emoji: "🫘",
    d: [
      ["Rozvádějí krev do celého těla", "Rozvod krve zajišťuje srdce, ne tenhle párový orgán."],
      ["Vyměňují v krvi plyny při dýchání", "Výměna plynů probíhá v plicích."],
      ["Rozmělňují snědené jídlo na kaši", "Jídlo rozmělňuje žaludek trávicí šťávou."],
    ],
    h: [
      "Jsou dvě, mají tvar fazole a pracují jako filtr.",
      "Do těchto orgánů přitéká krev plná nepotřebných látek. Ty se odtud dostanou i s přebytečnou vodou do měchýře a potom z těla ven.",
    ],
    e: "Ledviny filtrují krev. Nepotřebné látky a přebytečnou vodu z ní odvedou jako moč, takže se v těle nehromadí.",
  },
  {
    q: "Co jsou šlachy?",
    a: "Pevná vlákna, která spojují svaly s kostmi",
    emoji: "🦵",
    d: [
      ["Trubičky, kterými proudí po těle krev", "To jsou cévy — tepny a žíly."],
      ["Vlákna, která vedou signály z mozku", "To jsou nervy, ty nic nedrží pohromadě."],
      ["Měkké polštářky mezi obratli páteře", "To jsou meziobratlové ploténky, tlumí otřesy."],
    ],
    h: [
      "Bez nich by se stah svalu vůbec nepřenesl na kost.",
      "Sval se ke kosti přichytit sám nedokáže. Potřebuje pevné bílé lanko na svém konci — to nejsilnější v těle cítíš vzadu nad patou.",
    ],
    e: "Šlachy jsou pevná vlákna mezi svalem a kostí. Když se sval stáhne, šlacha přenese tah na kost a ta se pohne.",
  },
  {
    q: "Proč si myjeme ruce před jídlem?",
    a: "Na rukou ulpí bakterie a viry, které bychom snědli",
    emoji: "🧼",
    d: [
      ["Aby ruce hezky voněly po mýdle", "Vůně je jen příjemný doplněk, důvod je jiný."],
      ["Aby nám jídlo lépe chutnalo", "Chuť jídla se umytím rukou nezmění."],
      ["Abychom měli hladší kůži na dlaních", "Mytí kůži nezjemní, chrání nás před nemocí."],
    ],
    h: [
      "Zamysli se, čeho se ruce během dne dotknou a co na nich zůstane.",
      "Klika, mobil, peníze i zábradlí jsou plné drobných původců nemocí. Rukama si je pak zaneseš přímo do úst, a proto je mytí před jídlem tak důležité.",
    ],
    e: "Na rukou ulpí bakterie a viry z předmětů, kterých se dotýkáme. Mýdlo a voda je smyjí, takže se nedostanou do úst a nezpůsobí nemoc.",
  },
  {
    q: "Co patří do vyvážené stravy?",
    a: "Zelenina, ovoce, bílkoviny, obiloviny a dost pití",
    emoji: "🥗",
    d: [
      ["Hlavně sladkosti a slazené nápoje", "Cukr dodá jen rychlou energii, ostatní živiny chybí."],
      ["Jenom maso a nic jiného k tomu", "Samotné maso nedodá vitamíny ani vlákninu."],
      ["Jenom ovoce po celý den", "Samotné ovoce nedodá bílkoviny ani dost energie."],
    ],
    h: [
      "Zdravý talíř má mít víc barev a víc skupin potravin.",
      "Každá skupina potravin dodá tělu něco jiného: jedna energii, druhá stavební látky pro svaly, další vitamíny a vlákninu. Proto talíř nesmí být složený jen z jedné z nich.",
    ],
    e: "Vyvážená strava obsahuje zeleninu, ovoce, bílkoviny (maso, ryby, luštěniny), obiloviny a dostatek tekutin. Každá skupina dodává tělu jiné potřebné látky.",
  },
  {
    q: "K čemu slouží očkování?",
    a: "Naučí tělo nemoc poznat, ještě než ji potká",
    emoji: "💉",
    d: [
      ["Vyléčí nemoc, kterou už člověk má", "Očkuje se předem. Na probíhající nemoc to lék není."],
      ["Zvýší tělesnou teplotu proti bakteriím", "Zvýšit teplotu není cíl, horečka je jen průvodní jev."],
      ["Nahradí zdravou stravu a dost pohybu", "Stravu ani pohyb žádná injekce nenahradí."],
    ],
    h: [
      "Proč se očkuje v době, kdy je člověk úplně zdravý?",
      "Očkovací látka ukáže obranným buňkám neškodnou napodobeninu původce nemoci. Tělo si ji zapamatuje, a když na skutečnou nemoc narazí, umí ji zastavit hned.",
    ],
    e: "Očkování natrénuje obranu těla předem. Tělo si zapamatuje, jak nemoc vypadá, a při skutečném setkání ji porazí dřív, než stihne vypuknout.",
  },
  {
    q: "Proč je pro tělo důležitý spánek?",
    a: "Tělo se během něj zotavuje, roste a mozek si třídí zážitky",
    emoji: "🌙",
    d: [
      ["Tělo během spánku úplně vypne a nic se v něm neděje", "Ve spánku tělo pracuje dál — opravuje se a ukládá si vzpomínky."],
      ["Spánek jen zkrátí čekání do dalšího dne", "Není to jen mezera v čase, probíhá při něm důležitá práce."],
      ["Ve spánku tělo spotřebuje zbytky jídla", "Trávení běží i přes den. Spánek slouží k něčemu jinému."],
    ],
    h: [
      "Proč se po probdělé noci hůř soustředíš a míň si pamatuješ?",
      "Ve spánku se navenek neděje nic, ale uvnitř běží důležitá práce. Svaly a kosti se opravují a rostou a hlava si srovnává, co se přes den naučila.",
    ],
    e: "Ve spánku se tělo opravuje a roste a mozek si třídí a ukládá naučené. Bez dostatku spánku se hůř soustředíš a snáz onemocníš.",
  },
  {
    q: "Proč se při nemoci měří teplota?",
    a: "Zvýšená teplota ukazuje, že tělo bojuje s nákazou",
    emoji: "🌡️",
    d: [
      ["Teploměr prozradí, kolik jsme toho snědli", "O snědeném jídle teploměr nic neříká."],
      ["Podle teploty se pozná únava po sportu", "Po sportu se tělo zahřeje, ale horečka to není."],
      ["Teploměr ukáže, jak dobře vidíme a slyšíme", "Zrak ani sluch s tělesnou teplotou nesouvisí."],
    ],
    h: [
      "Co se v těle děje, když do něj proniknou bakterie nebo viry?",
      "Tělo se proti původcům nemoci brání a při té obraně se zahřeje. Teploměr proto slouží jako signál, jestli obrana zrovna běží — ne jako měřič únavy nebo hladu.",
    ],
    e: "Zvýšená teplota patří k obraně těla: v teple se bakterie a viry hůř množí. Teploměr proto ukáže, jestli tělo právě s nemocí bojuje.",
  },
  {
    q: "Proč se na kole nosí přilba?",
    a: "Chrání lebku a mozek při pádu",
    emoji: "🚴",
    d: [
      ["Chrání srdce před nárazem", "Srdce je v hrudníku, přilba na hlavě ho nekryje."],
      ["Zlepšuje dýchání při jízdě", "Dýchání přilba nijak neusnadňuje."],
      ["Zpevňuje páteř a celá záda", "Páteř je v zádech, přilba na ni nedosáhne."],
    ],
    h: [
      "Která část těla je při nehodě na kole nejzranitelnější?",
      "Kost na hlavě je sice pevná, ale prudký náraz o asfalt neustojí. A pod ní leží orgán, který se sám neopraví. Přilba náraz rozloží a ztlumí.",
    ],
    e: "Přilba tlumí náraz a chrání lebku i mozek. Poranění mozku se hojí velmi špatně, proto se v přilbě jezdí vždycky.",
  },
];

const L3: U[] = [
  {
    q: "Kopneš do míče. V jakém pořadí to v těle proběhne?",
    a: "Mozek dá povel, nerv ho přenese, sval se stáhne, kost se pohne",
    emoji: "⚽",
    d: [
      ["Sval se stáhne a teprve potom dá mozek povel", "Sval se sám nerozhodne — povel přichází první z hlavy."],
      ["Kost se pohne a teprve pak se stáhne sval", "Kost se sama nehýbe, do pohybu ji uvede až tah svalu."],
      ["Nerv pohne kostí a až nakonec dá mozek povel", "Nerv jen přenáší signál, kostí nehýbe a povel je vždy první."],
    ],
    h: [
      "Kdo v těle o pohybu rozhoduje a kdo jen plní rozkaz?",
      "Seřaď čtyři kroky podle toho, kdo co umí. Rozhodnutí vzniká v hlavě, signál musí někudy dojet, potom se něco zkrátí a to teprve zatáhne za tvrdou část.",
    ],
    e: "Pohyb vzniká shora dolů: mozek vydá povel, nerv ho přenese ke svalu, sval se stáhne a přes šlachu pohne kostí — a míč odletí.",
  },
  {
    q: "Která věta o orgánech je správná?",
    a: "Srdce krev přečerpává, ledviny ji čistí",
    emoji: "🧠",
    d: [
      ["Srdce krev čistí, ledviny ji přečerpávají", "Je to obráceně — pumpa je srdce a filtr jsou ledviny."],
      ["Plíce krev čistí a srdce ji vyrábí", "Plíce vyměňují plyny a krev se tvoří v kostní dřeni."],
      ["Mozek krev přečerpává a žaludek ji čistí", "Mozek tělo řídí a žaludek tráví; s krví to nedělají."],
    ],
    h: [
      "Přiřaď každému orgánu jeho jediný hlavní úkol a teprve pak větu ověř.",
      "Každá věta obsahuje dvě tvrzení. Ověř je zvlášť: kdo tekutinu pohání dopředu a kdo z ní odstraňuje odpad. Stačí, aby jedno tvrzení neplatilo, a celá věta padá.",
    ],
    e: "Srdce je pumpa — krev rozvádí. Ledviny jsou filtr — zbavují krev odpadních látek. Nejčastější chyba je tyhle dvě role prohodit.",
  },
  {
    q: "Jak se kyslík ze vzduchu dostane až ke svalům?",
    a: "Plíce ho předají krvi a srdce krev rozvede po těle",
    emoji: "💨",
    d: [
      ["Žaludek ho vytráví z jídla a pošle do svalů", "Kyslík v jídle není, přichází z nadechnutého vzduchu."],
      ["Ledviny ho odfiltrují z moči a vrátí ho zpět", "Ledviny odvádějí odpad, kyslík z moči nezískávají."],
      ["Nervy ho přenesou z hrudníku rovnou do svalů", "Nervy vedou jen signály, žádné látky nepřenášejí."],
    ],
    h: [
      "Cesta má dva kroky: nejdřív předání, potom rozvoz.",
      "Vzduch se dostane jen do hrudníku, dál už ne. Tam se kyslík musí přeložit do tekutiny, která teče po celém těle — a tu tekutinu musí něco pohánět.",
    ],
    e: "V plicích přejde kyslík ze vzduchu do krve. Srdce pak krev rozešle tepnami do celého těla, takže kyslík dorazí i do pracujícího svalu.",
  },
  {
    q: "Dítě chodí spát pozdě a spí jen pět hodin. Jak se to na něm projeví?",
    a: "Bude unavené, hůř se soustředí a tělo se hůř zotaví",
    emoji: "😪",
    d: [
      ["Bude svěží, protože ušetřilo spoustu času", "Ušetřený čas tělu nepomůže, chybí mu doba na obnovu."],
      ["Nic se nezmění, chybějící spánek nahradí jídlem", "Jídlo spánek nahradit nedokáže, každé plní jiný úkol."],
      ["Poroste rychleji, protože je déle vzhůru", "Tělo roste hlavně ve spánku, ne když je vzhůru."],
    ],
    h: [
      "Kdy se tělo opravuje a kdy si hlava třídí, co se přes den naučila?",
      "Spánek není ztracený čas — právě během něj probíhá obnova svalů a ukládání vzpomínek. Když ho je málo, oba tyhle úkoly zůstanou nedodělané a ráno je to znát.",
    ],
    e: "Pět hodin spánku školákovi nestačí. Tělo se nestihne zotavit a mozek uložit naučené, takže je dítě unavené a hůř se soustředí.",
  },
  {
    q: "Míč tě udeří do hrudníku, ale srdci ani plicím se nic nestane. Co je ochránilo?",
    a: "Žebra, která kolem nich tvoří pevnou klec",
    emoji: "🛡️",
    d: [
      ["Lebka, která kryje horní část těla", "Lebka je na hlavě, hrudník vůbec nekryje."],
      ["Páteř, která vede po přední straně", "Páteř je vzadu v zádech, ne vpředu na hrudi."],
      ["Břišní svaly, které náraz zachytí", "Břišní svaly jsou níž a hrudník nechrání."],
    ],
    h: [
      "Nahmatej si přes tričko pruhy kostí napříč hrudníkem.",
      "Kolem hrudníku je kostěná ochrana poskládaná z několika oblouků. Náraz roznesou do stran, takže se k měkkým orgánům uvnitř nedostane.",
    ],
    e: "Hrudník chrání žebra — oblouky kostí, které kolem srdce a plic tvoří pevnou klec a rozloží náraz do stran.",
  },
  {
    q: "Po dlouhém běhu ti buší srdce a rychle dýcháš. Proč?",
    a: "Svaly potřebují víc kyslíku, tak ho tělo rychleji dopravuje",
    emoji: "🏃",
    d: [
      ["Tělo se snaží rychleji strávit oběd", "Trávení s během ani s rychlým dechem nesouvisí."],
      ["Tělo se tak zbavuje přebytečné vody", "Přebytečné vody se tělo zbavuje potem a močí."],
      ["Srdce se zahřívá, aby nenastydlo", "Srdce se takhle nezahřívá, jde o zásobení svalů."],
    ],
    h: [
      "Co pracující svaly spotřebovávají nejvíc a odkud to k nim musí přijít?",
      "Při běhu odvedou svaly mnohem víc práce než v klidu. Potřebnou látku k nim dováží krev a nabírá se v hrudníku — proto obě tahle místa zrychlí.",
    ],
    e: "Pracující svaly spotřebují víc kyslíku. Plíce proto nabírají vzduch rychleji a srdce zrychlí, aby krev s kyslíkem stihla ke svalům dorazit.",
  },
  {
    q: "Proč jíme z více skupin potravin, a ne jen z jedné?",
    a: "Každá skupina dodá tělu jiné potřebné látky",
    emoji: "🍎",
    d: [
      ["Aby jídlo vypadalo pestřeji na talíři", "Vzhled není důvod, jde o to, co tělo dostane."],
      ["Aby se jídlo snáze a rychleji vařilo", "Rychlost vaření se zdravím nesouvisí."],
      ["Protože jednu skupinu tělo vůbec nestráví", "Tělo stráví každou skupinu, jen sama o sobě nestačí."],
    ],
    h: [
      "Zamysli se, co by tělu chybělo, kdybys jedl celý týden jen rohlíky.",
      "Tělo potřebuje energii na pohyb, stavební látky na svaly a růst a k tomu vitamíny a vlákninu. Žádná jediná potravina to všechno naráz nedodá.",
    ],
    e: "Každá skupina potravin dodá něco jiného: obiloviny energii, maso a luštěniny stavební látky, ovoce a zelenina vitamíny a vlákninu. Proto musí být talíř pestrý.",
  },
  {
    q: "Proč sportovci dbají nejen na trénink, ale i na spánek a jídlo?",
    a: "Tělo se zpevňuje a obnovuje hlavně při odpočinku a z živin",
    emoji: "🏅",
    d: [
      ["Aby se jim po zápase lépe usínalo", "To je jen důsledek, ne důvod, proč na to dbají."],
      ["Protože tréninky se tím dají vynechat", "Spánek ani jídlo samotný trénink nenahradí."],
      ["Aby jim rychleji rostly vlasy a nehty", "Vlasy ani nehty nejsou cílem sportovní přípravy."],
    ],
    h: [
      "Kdy sval doopravdy zesílí — během dřiny, nebo až potom?",
      "Trénink sval nejdřív unaví a naruší. Aby zesílil, potřebuje čas na opravu a materiál, ze kterého se opraví. Obojí sportovec dostane až mimo hřiště.",
    ],
    e: "Při tréninku se svaly zatíží, ale zesílí až potom — během spánku a z živin v jídle. Bez odpočinku a stravy by se tělo jen vyčerpávalo.",
  },
  {
    q: "Při pádu si narazíš koleno a nemůžeš nohu ohnout. Které spolupracující části k ohnutí potřebuješ?",
    a: "Sval a kost spojené šlachou",
    emoji: "🦵",
    d: [
      ["Plíce a srdce v hrudníku", "Ty zásobují tělo kyslíkem, ohyb kolena nezpůsobí."],
      ["Žaludek a střeva v břiše", "Ty zpracovávají jídlo, s pohybem nohy nesouvisí."],
      ["Ledviny a močový měchýř", "Ty odvádějí odpadní látky, na pohyb vliv nemají."],
    ],
    h: [
      "Co se musí zkrátit a za co to musí zatáhnout, aby se kloub ohnul?",
      "Pohyb v kloubu vzniká tahem. Něco měkkého se stáhne, přes pevné lanko zatáhne za tvrdou část a ta se v kloubu otočí. Vnitřní orgány s tím nemají co dělat.",
    ],
    e: "Každý pohyb v kloubu vznikne tak, že se sval stáhne a šlacha přenese jeho tah na kost. Bez téhle trojice se koleno neohne.",
  },
  {
    q: "Kamarád v lavici má rýmu a kašle. Co uděláš, abys nemoc nechytil?",
    a: "Umyješ si ruce a nebudeš si sahat na obličej",
    emoji: "🤧",
    d: [
      ["Budeš pít víc slazených nápojů", "Sladké nápoje před nákazou nechrání, spíš škodí zubům."],
      ["Necháš okna celý den zavřená", "V nevětrané třídě se nákaza šíří naopak snáz."],
      ["Vyměníš si s ním lahev s pitím", "Společná lahev nákazu přenáší přímo do úst."],
    ],
    h: [
      "Kudy se kapénky z kašle nejčastěji dostanou do tvého těla?",
      "Původci rýmy se z kapének usadí na klice, na lavici i na tvých prstech. Do těla se dostanou přes ústa, nos a oči, takže stačí přerušit cestu mezi rukama a hlavou.",
    ],
    e: "Nákaza se přenáší kapénkami a dotykem. Umyté ruce a nesahání na obličej přeruší cestu původce do těla; pomáhá i větrání třídy.",
  },
  {
    q: "Proč mají lidé, kteří se málo hýbou, slabší srdce?",
    a: "Je to sval a bez zátěže slábne jako každý jiný",
    emoji: "🫀",
    d: [
      ["Protože se jim bez pohybu netvoří krev", "Krev se tvoří v kostní dřeni bez ohledu na pohyb."],
      ["Protože jim bez pohybu přestane bít", "Bije stále, jde jen o to, jak je silné."],
      ["Protože se jim bez pohybu nedostane jídlo", "Jídlo tělo přijímá bez ohledu na to, kolik se hýbe."],
    ],
    h: [
      "Co se stane s každým svalem, který dlouho nic nedělá?",
      "Ruka v sádře za pár týdnů zeslábne, protože nepracuje. Teď si vzpomeň, z jaké tkáně je orgán, který pohání krev — a platí pro něj úplně totéž.",
    ],
    e: "Srdce je svalová pumpa. Pravidelný pohyb ho zatíží, a proto zesílí; při sedavém životě naopak slábne stejně jako každý nepoužívaný sval.",
  },
  {
    q: "Proč je rána do hlavy nebezpečnější než stejně silná rána do paže?",
    a: "V hlavě je mozek, který řídí celé tělo a špatně se hojí",
    emoji: "⛑️",
    d: [
      ["V hlavě je mnohem víc kostí než v paži", "Počet kostí o nebezpečí zranění nerozhoduje."],
      ["Hlava je blíž k srdci než ruka nebo noha", "Vzdálenost od srdce o vážnosti zranění nerozhoduje."],
      ["V hlavě jsou uložené plíce a žaludek", "Plíce i žaludek leží v trupu, ne v hlavě."],
    ],
    h: [
      "Co je uvnitř lebky a co by se stalo, kdyby to přestalo pracovat?",
      "Pohmožděný sval na paži se během několika týdnů obnoví. Orgán schovaný pod kostí na hlavě se ale opravuje jen velmi těžko — a přitom na něm závisí všechno ostatní.",
    ],
    e: "V lebce je mozek, který řídí celé tělo. Na rozdíl od svalu se poškozený mozek hojí velmi obtížně, proto se hlava chrání přilbou.",
  },
  {
    q: "Sníš k obědu rohlík se sýrem. Jak se živiny ze sýra dostanou do svalu na noze?",
    a: "Žaludek a střeva je předají krvi a srdce ji rozvede",
    emoji: "🧀",
    d: [
      ["Nervy je přenesou z břicha rovnou do svalu", "Nervy vedou jen signály, žádné látky nepřenášejí."],
      ["Plíce je vydechnou a znovu vdechnou do svalu", "Plícemi prochází vzduch, ne živiny ze snědeného jídla."],
      ["Ledviny je odfiltrují z moči a pošlou je zpět", "Ledviny odvádějí odpad, živiny do svalů neposílají."],
    ],
    h: [
      "Cesta má dvě zastávky: nejdřív rozklad jídla, potom rozvoz po těle.",
      "Sousto se musí nejdřív rozložit na drobné látky, jinak by se nikam nedostalo. Ty pak projdou stěnou střeva do tekutiny, kterou po těle rozhání pumpa v hrudníku.",
    ],
    e: "Žaludek jídlo rozmělní, střeva z něj vstřebají živiny do krve a srdce krev rozvede po těle — tak se živiny dostanou až do svalu na noze.",
  },
];

function gen(level: number): PracticeTask[] {
  const bank = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(bank).map(uloha);
}

export const STAVBATELAAZDRAV: TopicMetadata[] = [
  {
    id: "g3-prvouka-clovek-a-jeho-zdravi-lidske-telo-stavba-lidskeho-tela-kostra-svaly-uvod-zdravi-a-nemoc",
    title: "Stavba lidského těla, zdraví",
    studentTitle: "Naše tělo a zdraví",
    subject: "prvouka",
    category: "Člověk a jeho zdraví",
    topic: "Lidské tělo",
    briefDescription: "Poznáš základní části lidského těla a jak pečovat o zdraví.",
    illustrationDesc:
      "dítě ukazuje na průhledný model lidského těla se srdcem, plícemi a mozkem, vedle stojí kostra a na stole leží ovoce a zelenina",
    keywords: [
      "kostra",
      "svaly",
      "lebka",
      "páteř",
      "žebra",
      "šlachy",
      "srdce",
      "plíce",
      "mozek",
      "žaludek",
      "ledviny",
      "orgány",
      "zdraví",
      "vyvážená strava",
      "pohyb",
      "spánek",
      "hygiena",
      "mytí rukou",
      "očkování",
      "stavba těla",
    ],
    goals: [
      "Pojmenovat základní části kostry a vysvětlit jejich funkci.",
      "Popsat, jak fungují svaly a šlachy.",
      "Vysvětlit funkci hlavních orgánů: srdce, plíce, mozek, žaludek, ledviny.",
      "Vyjmenovat zásady zdravého životního stylu: strava, pohyb, spánek, hygiena.",
      "Vysvětlit, proč se očkujeme.",
    ],
    boundaries: [
      "Základní pojmy pro 3. třídu — bez anatomie na úrovni buněk ani chemie.",
      "Orgány jen v základní funkci — bez detailního popisu oběhové či trávicí soustavy.",
      "Hygiena a zdraví prakticky — bez detailní mikrobiologie.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Kostra = opora + ochrana. Svaly + šlachy = pohyb. Hlavní orgány: srdce (pumpa krve), plíce (dýchání), mozek (velení), žaludek (trávení), ledviny (čištění krve). Zdraví: pohyb 60 min, spánek 9–11 h, vyvážená strava, mytí rukou, očkování.",
      steps: [
        "Kostra — dává tělu tvar, chrání orgány (lebka → mozek, žebra → srdce + plíce, páteř → mícha).",
        "Svaly — přirostlé ke kostem přes šlachy; stahují se a uvolňují → pohyb.",
        "Srdce — svalová pumpa, přečerpává krev do celého těla.",
        "Plíce — výměna kyslíku (dovnitř) za oxid uhličitý (ven) při dýchání.",
        "Mozek — řídí tělo, myšlení, smysly i pohyby.",
        "Žaludek — rozkládá potravu, aby ji tělo mohlo vstřebat.",
        "Ledviny — filtrují krev, odstraňují odpadní látky jako moč.",
        "Zdraví: vyvážená strava, pohyb ≥ 60 min/den, spánek 9–11 h, mytí rukou, čištění zubů, očkování.",
      ],
      commonMistake:
        "Záměna funkcí orgánů: ledviny čistí krev (ne srdce), srdce pumpa krev (ne mozek). Šlachy spojují svaly s kostmi — nejsou to cévy ani nervy.",
      example:
        "Kopneš míč: mozek dá povel → nervy přenesou signál → sval stehna se stáhne → šlacha zatáhne kost → noha se pohne → míč odletí. Srdce mezitím pumpuje krev se kyslíkem do svalu.",
    },
  },
];
