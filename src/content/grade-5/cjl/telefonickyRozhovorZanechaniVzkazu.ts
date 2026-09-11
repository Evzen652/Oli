import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby a vzkazy se nedaly porovnat. Teď: L1 pravidla telefonování
// a tísňová čísla · L2 vybrat úplný vzkaz (kdo volal, co chtěl, podpis a čas)
// · L3 jak se zachovat v nečekaných situacích u telefonu.

const L1: PracticeTask[] = [
  choice("Jak začneš hovor, když někomu voláš?", "pozdravím a řeknu, kdo volá", [
    { value: "hned řeknu, co chci, bez pozdravu", why: "Bez pozdravu a představení je to nezdvořilé a druhý neví, kdo volá." },
    { value: "mlčím, dokud se druhý nezeptá", why: "Volající má začít mluvit jako první." },
    { value: "zeptám se, kdo tam je, a zavěsím", why: "Tím hovor jen přerušíš." },
  ], {
    hints: ["Co uslyší člověk, který zvedne telefon, jako první?", "Druhý tě nevidí, a tak musíš říct, kdo jsi — a nejdřív pozdravit."],
    explanation: "Volající nejdřív pozdraví a představí se, teprve pak řekne, co potřebuje.",
  }),
  choice("Co řekneš, když doma zvedneš zvonící telefon?", "pozdravím a představím se", [
    { value: "řeknu jen „No?“", why: "Takové přijetí hovoru je neslušné." },
    { value: "mlčím, dokud nepromluví volající", why: "Volající neví, jestli se dovolal." },
    { value: "hned zavěsím", why: "Tím hovor ukončíš dřív, než začal." },
  ], {
    hints: ["Jak volající pozná, že se dovolal správně?", "Stačí říct třeba „Dobrý den, u Novákových, Eva.“ — volající hned ví, kam volá."],
    explanation: "Když přijímáš hovor, pozdravíš a představíš se.",
  }),
  choice("Jak se na konci hovoru rozloučíš?", "poděkuji a rozloučím se", [
    { value: "prostě zavěsím bez slova", why: "Bez rozloučení je to nezdvořilé." },
    { value: "řeknu, ať už nevolá", why: "To je neslušné." },
    { value: "nechám telefon ležet a odejdu", why: "Hovor by zůstal viset." },
  ], {
    hints: ["Jak se loučíš s někým, s kým jsi mluvil nebo mluvila tváří v tvář?", "U telefonu platí stejná zdvořilost: poděkovat a pozdravit na rozloučenou."],
    explanation: "Hovor končí poděkováním a rozloučením.",
  }),
  choice("Co musí obsahovat vzkaz pro maminku o tom, že jí někdo volal?", "kdo volal, co chtěl a kdy", [
    { value: "jen jméno volajícího", why: "Maminka by nevěděla, co volající chtěl." },
    { value: "jen „někdo volal“", why: "Maminka by nevěděla kdo ani proč." },
    { value: "celý rozhovor slovo od slova", why: "Vzkaz má být stručný." },
  ], {
    hints: ["Na co se tě maminka zeptá, když si vzkaz přečte?", "Maminka potřebuje vědět, kdo to byl, co potřeboval a kdy to bylo, aby mohla zareagovat."],
    explanation: "Dobrý vzkaz říká, kdo volal, co chtěl a kdy.",
  }),
  choice("Kam dáš vzkaz, aby ho maminka určitě našla?", "na viditelné místo, třeba na lednici", [
    { value: "do šuplíku mezi ponožky", why: "Tam ho maminka nenajde." },
    { value: "do koše", why: "Tam vzkaz nepatří." },
    { value: "do své aktovky", why: "Tam ho maminka neuvidí." },
  ], {
    hints: ["Kde se maminka určitě podívá, až přijde domů?", "Vzkaz musí být tam, kde ho maminka uvidí bez hledání."],
    explanation: "Vzkaz patří na viditelné místo, kde ho adresát hned najde.",
  }),
  choice("Proč je dobré mluvit do telefonu zřetelně?", "druhý mě nevidí a musí mi rozumět", [
    { value: "aby byl hovor dražší", why: "Zřetelnost cenu neovlivní." },
    { value: "aby mě slyšeli sousedé", why: "Nejde o hlasitost pro sousedy." },
    { value: "telefon jinak nefunguje", why: "Telefon funguje, ale druhý by ti nerozuměl." },
  ], {
    hints: ["Co u telefonu chybí oproti rozhovoru tváří v tvář?", "Tvůj obličej ani ruce u telefonu vidět nejsou — posluchač pozná všechno jen z tvého hlasu."],
    explanation: "U telefonu se nedá ukázat ani odezírat, proto je důležité mluvit zřetelně.",
  }),
  choice("Neznámý člověk se do telefonu ptá, jestli jsi doma sám nebo sama. Co uděláš?", "neprozradím to a řeknu, že rodiče teď nemůžou k telefonu", [
    { value: "řeknu mu, že jsem doma úplně sám nebo sama", why: "Cizímu člověku to neprozrazuj." },
    { value: "řeknu mu naši adresu, ať se zastaví", why: "Adresu cizím lidem neříkej." },
    { value: "pozvu ho na návštěvu, když je milý", why: "Cizího člověka nezvi." },
  ], {
    hints: ["Proč by to asi cizí člověk chtěl vědět?", "Cizím lidem neříkej, že jsi doma bez dospělých, ani adresu; stačí říct, že rodiče nemůžou k telefonu."],
    explanation: "Cizím lidem neprozrazuj, že jsi doma sám nebo sama; řekni, že rodiče teď nemůžou k telefonu.",
  }),
  choice("Které číslo zavoláš, když hoří?", "150", [
    { value: "155", why: "155 je záchranná služba." },
    { value: "158", why: "158 je policie." },
    { value: "156", why: "156 je městská policie." },
  ], {
    hints: ["Tísňová čísla začínají 15. Které patří hasičům?", "Hasiči mají číslo, které končí nulou."],
    explanation: "Hasiči mají číslo 150; funguje i jednotné evropské číslo 112.",
  }),
  choice("Jaké číslo má zdravotnická záchranná služba?", "155", [
    { value: "150", why: "150 jsou hasiči." },
    { value: "158", why: "158 je policie." },
    { value: "156", why: "156 je městská policie." },
  ], {
    hints: ["Tísňová čísla začínají 15. Které patří záchrance?", "Záchranka má číslo, které končí pětkou."],
    explanation: "Zdravotnická záchranná služba má číslo 155.",
  }),
  choice("Jaké číslo má policie?", "158", [
    { value: "150", why: "150 jsou hasiči." },
    { value: "155", why: "155 je záchranná služba." },
    { value: "156", why: "156 je městská policie, ne státní policie." },
  ], {
    hints: ["Tísňová čísla začínají 15. Které patří policii?", "Policie má číslo, které končí osmičkou."],
    explanation: "Policie České republiky má číslo 158.",
  }),
  choice("Co řekneš operátorovi, když voláš záchranku?", "co se stalo, kde to je a kdo volá", [
    { value: "jen své jméno a zavěsím", why: "Operátor potřebuje vědět, co se stalo a kde." },
    { value: "jen „pomoc“ a zavěsím", why: "Záchranka by nevěděla, kam jet." },
    { value: "jen to, co se stalo, bez adresy", why: "Bez místa nemůže záchranka přijet." },
  ], {
    hints: ["Co potřebuje záchranka vědět, aby mohla přijet?", "Operátor potřebuje vědět, jakou pomoc poslat, kam přesně jet a na koho se obrátit. Hovor neukončuj sám nebo sama."],
    explanation: "Záchrance řekneš, co se stalo, kde to je a kdo volá.",
  }),
  choice("Kdy je vhodné zavolat kamarádovi?", "přes den, ne pozdě večer", [
    { value: "pozdě v noci, kdy všichni spí", why: "V noci se volá jen v nouzi." },
    { value: "během vyučování", why: "Ve škole se telefonovat nemá." },
    { value: "v neděli v šest ráno", why: "Tak brzy se nevolá." },
  ], {
    hints: ["Kdy by tě telefon rušil?", "Volat se hodí v době, kdy druhý nespí a nemá povinnosti — zhruba mezi ránem a večerem."],
    explanation: "Kamarádům voláme přes den, ne v noci ani ve škole.",
  }),
  choice("Proč máš nechat operátora záchranky zavěsit jako prvního?", "může se ještě na něco zeptat", [
    { value: "je to jen zvyk", why: "Má to důvod — operátor se může doptat." },
    { value: "jinak se hovor zpoplatní", why: "Tísňové volání je zdarma." },
    { value: "protože je to vedoucí", why: "Nejde o postavení, ale o informace." },
  ], {
    hints: ["Co když operátorovi po tvé odpovědi pořád něco chybí?", "Operátor může radit, co dělat do příjezdu záchranky, nebo se doptat na cestu."],
    explanation: "Operátor se může doptat nebo poradit; proto hovor ukončí on.",
  }),
];

interface Vzkaz { komu: string; kdo: string; co: string; kdoMa: string; podpis: string; cas: string }
const VZKAZY: Vzkaz[] = [
  { komu: "Mami", kdo: "paní Nováková", co: "máš jí zavolat zpátky", kdoMa: "maminka", podpis: "Petr", cas: "16:30" },
  { komu: "Tati", kdo: "děda", co: "přijede v sobotu vlakem v deset", kdoMa: "tatínek", podpis: "Eva", cas: "15:10" },
  { komu: "Mami", kdo: "trenér", co: "zítřejší trénink se ruší", kdoMa: "maminka", podpis: "Jakub", cas: "17:00" },
  { komu: "Tati", kdo: "pan doktor", co: "máš přijít ve čtvrtek v osm", kdoMa: "tatínek", podpis: "Lenka", cas: "11:45" },
  { komu: "Mami", kdo: "soused", co: "má u sebe tvůj balík", kdoMa: "maminka", podpis: "Tom", cas: "14:20" },
  { komu: "Babi", kdo: "teta Jana", co: "oslava bude v neděli ve tři", kdoMa: "babička", podpis: "Ema", cas: "18:05" },
  { komu: "Mami", kdo: "paní učitelka", co: "výlet začíná zítra v osm u školy", kdoMa: "maminka", podpis: "Ondra", cas: "13:50" },
  { komu: "Tati", kdo: "strýc Karel", co: "vrátí ti vrtačku v pondělí", kdoMa: "tatínek", podpis: "Anna", cas: "16:00" },
  { komu: "Mami", kdo: "knihovna", co: "rezervovaná kniha je připravená", kdoMa: "maminka", podpis: "Šimon", cas: "12:30" },
  { komu: "Tati", kdo: "pan Veselý z práce", co: "porada bude až v úterý", kdoMa: "tatínek", podpis: "Klára", cas: "19:15" },
  { komu: "Mami", kdo: "kadeřnice", co: "tvůj termín se posouvá na pátek", kdoMa: "maminka", podpis: "Vojta", cas: "10:40" },
  { komu: "Babi", kdo: "pan Černý", co: "přiveze dříví ve středu", kdoMa: "babička", podpis: "Marek", cas: "17:30" },
  { komu: "Tati", kdo: "paní ze školy", co: "máš podepsat přihlášku na tábor", kdoMa: "tatínek", podpis: "Nela", cas: "14:00" },
];

function vzkazUloha(v: Vzkaz): PracticeTask {
  const cely = `${v.komu}, volal ${v.kdo}: ${v.co}. ${v.podpis}, ${v.cas}`;
  return choice(`Který vzkaz je nejlepší? (Volal ${v.kdo}, ${v.co}.)`, cely, [
    { value: `${v.komu}, někdo ti volal a něco chtěl, zavolej mu. ${v.podpis}, ${v.cas}`, why: "Chybí, kdo volal a co chtěl." },
    { value: `${v.komu}, volal ${v.kdo}, ale nevím proč. ${v.podpis}, ${v.cas}`, why: "Chybí, co volající chtěl nebo co se má udělat." },
    { value: `${v.komu}, volal ${v.kdo}: ${v.co}.`, why: "Chybí podpis a čas — nevíš, kdo vzkaz psal a kdy to bylo." },
  ], {
    hints: [
      `Co všechno musí ${v.kdoMa} poznat ze vzkazu o tom, že volal ${v.kdo}?`,
      "Dobrý vzkaz říká, kdo volal a co chtěl nebo co se má udělat, a je podepsaný i s časem, aby bylo jasné, kdy to bylo.",
    ],
    explanation: `Úplný vzkaz: ${cely} — je v něm kdo volal, co chtěl, podpis i čas.`,
  });
}

const L3: PracticeTask[] = [
  choice("Omylem ses dovolal nebo dovolala na špatné číslo. Co řekneš?", "omluvím se za omyl a rozloučím se", [
    { value: "hned zavěsím bez slova", why: "Bez omluvy je to neslušné." },
    { value: "zeptám se, kdo tam je, a povídám si", why: "Zdržuješ cizího člověka." },
    { value: "řeknu, ať mi dá správné číslo", why: "Druhý tvé správné číslo nezná." },
  ], {
    hints: ["Kdo za omyl může a co se v takové chvíli říká?", "Stačí krátce říct, že ses spletl nebo spletla, omluvit se a pozdravit."],
    explanation: "Při omylu se krátce omluvíme a rozloučíme.",
  }),
  choice("Někdo volá tatínkovi, který zrovna spí. Co řekneš?", "řeknu, že teď nemůže, a nabídnu vzkaz", [
    { value: "hned ho vzbudím a podám mu telefon", why: "Tatínek odpočívá; budit ho kvůli běžnému hovoru není nutné — stačí vyřídit vzkaz." },
    { value: "řeknu, že tady žádný tatínek nebydlí", why: "To není pravda a volající by zbytečně hledal jinde." },
    { value: "zavěsím bez vysvětlení", why: "Volající by nevěděl, co se děje." },
  ], {
    hints: ["Jak můžeš pomoct volajícímu i tatínkovi?", "Nemusíš nikoho budit — zapiš si, kdo volá a co chce, a tatínkovi to později předej."],
    explanation: "Řekneme, že teď nemůže k telefonu, a nabídneme vyřízení vzkazu.",
  }),
  choice("V hlasové schránce je vzkaz: „Ahoj, tady Honza, zavolej.“ Co v něm chybí?", "proč máš zavolat", [
    { value: "kdo volal", why: "Honza se představil." },
    { value: "pozdrav", why: "Honza pozdravil." },
    { value: "nic, je úplný", why: "Nevíš, proč máš volat." },
  ], {
    hints: ["Víš po poslechu, o co Honzovi jde?", "Dobrý vzkaz řekne i důvod — pak se můžeš připravit, než zavoláš zpátky."],
    explanation: "Vzkazu chybí důvod, proč máš volat.",
  }),
  choice("Proč do telefonu nikomu neříkáš heslo nebo kód od karty?", "mohl by ho zneužít", [
    { value: "heslo se tím změní", why: "Heslo se samo nezmění, ale mohl by ho zneužít někdo cizí." },
    { value: "telefon by se rozbil", why: "Nejde o telefon." },
    { value: "je to jen zdvořilost", why: "Jde o bezpečnost." },
  ], {
    hints: ["Kdo by mohl s tvým heslem něco udělat?", "Podvodníci se často vydávají za banku nebo školu; skutečná instituce heslo po telefonu nechce."],
    explanation: "Hesla a kódy neříkáme nikomu — mohly by se zneužít.",
  }),
  choice("Voláš do knihovny prodloužit výpůjčku. Co řekneš jako první?", "pozdravím a řeknu své jméno", [
    { value: "hned diktuji názvy knih", why: "Nejdřív pozdrav a představení." },
    { value: "zeptám se, kolik je hodin", why: "To s výpůjčkou nesouvisí." },
    { value: "řeknu, že volám omylem", why: "Voláš záměrně." },
  ], {
    hints: ["Jak začíná každý slušný hovor?", "Knihovnice potřebuje vědět, kdo volá; teprve pak řekneš, o co jde."],
    explanation: "Nejdřív pozdrav a představení, pak prosba o prodloužení.",
  }),
  choice("Babička upadla a nemůže vstát. Voláš záchranku. Co řekneš nejdřív?", "co se stalo a kde to je", [
    { value: "jak se jmenuje naše kočka", why: "To záchranka nepotřebuje." },
    { value: "že zavolám později", why: "Pomoc je potřeba hned." },
    { value: "jaké bylo včera počasí", why: "To s nehodou nesouvisí." },
  ], {
    hints: ["Co záchranka potřebuje vědět, aby mohla vyjet?", "Nejdůležitější je, jakou pomoc potřebuješ a kam mají přijet."],
    explanation: "Záchrance řekneme, co se stalo a kde; pak odpovídáme na otázky operátora.",
  }),
  choice("Proč se při telefonování nejí ani nežvýká?", "je to slyšet a druhému se špatně rozumí", [
    { value: "telefon by se ušpinil", why: "Hlavní důvod je srozumitelnost a zdvořilost." },
    { value: "jídlo by vystydlo", why: "Nejde o jídlo." },
    { value: "je to zakázané zákonem", why: "Zákon to nezakazuje, jen je to nezdvořilé." },
  ], {
    hints: ["Jak zní hlas, když někdo mluví s plnou pusou?", "Mlaskání je v telefonu slyšet ještě víc a slova jsou nesrozumitelná."],
    explanation: "Jídlo při hovoru je slyšet, je nezdvořilé a zhoršuje srozumitelnost.",
  }),
  choice("Kdy je lepší poslat zprávu než volat?", "když druhý nemůže mluvit, třeba je ve škole", [
    { value: "když je něco velmi naléhavé", why: "Naléhavé věci se řeší hovorem." },
    { value: "když potřebuji rychlou pomoc", why: "Rychlou pomoc zajistí hovor." },
    { value: "když volám záchranku", why: "Záchrance se volá." },
  ], {
    hints: ["Kdy by zvonění telefonu druhého rušilo?", "Zprávu si druhý přečte, až bude moct; hovor ho vyruší hned."],
    explanation: "Zprávu posíláme, když druhý nemůže mluvit a věc nespěchá.",
  }),
  choice("Který vzkaz na záznamník je zdvořilý?", "Dobrý den, tady Eva Malá, prosím, zavolejte mi zpět. Děkuji.", [
    { value: "Ahoj, tady Eva, zavolej hned, jinak se naštvu, jo?", why: "Výhrůžka a tykání dospělému není zdvořilé." },
    { value: "Tady někdo, kdo potřebuje zavolat. Rychle!", why: "Chybí jméno a slušnost." },
    { value: "Eva. Zavolejte. Hned. Je to důležité, víte?", why: "Chybí pozdrav a poděkování, zní to příkře." },
  ], {
    hints: ["Který vzkaz obsahuje pozdrav, jméno, prosbu i poděkování?", "Zdvořilý vzkaz dospělému: pozdrav, představení, prosba, poděkování."],
    explanation: "Zdvořilý vzkaz má pozdrav, jméno, prosbu a poděkování.",
  }),
  choice("Volá cizí člověk a chce mluvit s Pavlem, který u vás nebydlí. Co řekneš?", "že má asi špatné číslo", [
    { value: "že Pavel přijde za hodinu", why: "To není pravda." },
    { value: "naši adresu, ať se přijde podívat", why: "Adresu cizím neříkej." },
    { value: "nic a začnu si povídat", why: "Stačí upozornit na omyl." },
  ], {
    hints: ["Kdo se tu spletl?", "Stačí zdvořile upozornit na omyl, nic dalšího o sobě neprozrazuj."],
    explanation: "Zdvořile řekneme, že má asi špatné číslo.",
  }),
  choice("Proč je dobré si před důležitým hovorem napsat, co chceš říct?", "nic důležitého nezapomenu", [
    { value: "hovor bude delší", why: "Poznámky hovor naopak zkrátí." },
    { value: "je to povinné", why: "Není to povinné, jen užitečné." },
    { value: "druhý to uslyší", why: "Poznámky slouží tobě." },
  ], {
    hints: ["Stalo se ti, že jsi po zavěšení zjistil nebo zjistila, že jsi na něco zapomněl nebo zapomněla?", "S poznámkami se neztratíš ani v nervozitě a řekneš všechno, co potřebuješ."],
    explanation: "Poznámky pomohou nezapomenout nic důležitého.",
  }),
  choice("Jak ukončíš hovor s paní učitelkou?", "poděkuji a řeknu na shledanou", [
    { value: "řeknu čau", why: "Čau se hodí ke kamarádům, ne k učitelce." },
    { value: "prostě zavěsím", why: "Bez rozloučení je to nezdvořilé." },
    { value: "řeknu „tak jo, zatím“", why: "Je to příliš hovorové." },
  ], {
    hints: ["Jak se loučíš s dospělým, kterému vykáš?", "K dospělým se hodí poděkování a spisovný pozdrav."],
    explanation: "S učitelkou se loučíme poděkováním a pozdravem Na shledanou.",
  }),
  choice("Zvoní telefon z neznámého čísla a rodiče nejsou doma. Co je rozumné?", "nic o sobě neprozradit a nabídnout vzkaz", [
    { value: "říct, že jsem doma sám nebo sama", why: "To cizímu neprozrazuj." },
    { value: "říct heslo od wifi", why: "Hesla nikomu neříkej." },
    { value: "domluvit si s neznámým schůzku", why: "S cizími lidmi se nedomlouvej." },
  ], {
    hints: ["Co bys neměl nebo neměla cizímu člověku říkat?", "Stačí zjistit, kdo volá, a nabídnout, že vyřídíš vzkaz; o sobě nic neprozrazuj."],
    explanation: "Cizím lidem nic o sobě neříkáme; nabídneme jen vyřízení vzkazu.",
  }),
];

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1);
  if (level === 2) return shuffle(VZKAZY.map(vzkazUloha));
  return shuffle(L3);
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
