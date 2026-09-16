/**
 * Přírodopis 6. ročník — Vznik Země, podmínky pro život (select_one).
 *
 * Faktické téma → tři disjunktní banky. Každá položka má vlastní znění,
 * vlastní dvojici nápověd a vlastní vysvětlení.
 *
 *  • L1 — zapamatování: příběh vzniku Země a prvního života, výčet podmínek.
 *  • L2 — použití: podmínka ↔ funkce. Každá položka banky dává DVĚ úlohy,
 *    šablona se ptá z obou stran (podmínka → k čemu je, funkce → která podmínka
 *    nebo situace ze života). Sezení bere prvních 6 úloh v pořadí banky, proto
 *    POOL_L2 drží obě strany téže dvojice daleko od sebe.
 *  • L3 — analýza a přenos, čtyři šablony se střídají rovnoměrně:
 *      (a) vymyšlená planeta nebo místo → která podmínka chybí,
 *      (b) skutečné planety (Venuše, Mars) jen kvalitativně,
 *      (c) úvaha nad pořadím (kyslík od sinic → ozon → souš),
 *      (d) „co by se stalo, kdyby…“.
 *
 * Chybový model (každý distraktor = jedna typická chyba šesťáka):
 *  • ozonová vrstva = zásoba kyslíku k dýchání;
 *  • časová zkratka: Země stará jako dinosauři, první život na souši,
 *    kyslík v ovzduší odjakživa;
 *  • stačí jakákoli voda (led, pára), „blíž ke Slunci = lépe“;
 *  • energii dává Měsíc nebo půda, atmosféra je „jen na dýchání“.
 *
 * Bez Millerova pokusu a chemických teorií vzniku života (nadstavba),
 * Venuše a Mars bez čísel, stáří Země vždy s „asi“ a jen v řádu miliard.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

interface Polozka {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

const OZON = "Dýcháme kyslík v ovzduší u povrchu. Ozonová vrstva je vysoko a chrání před UV zářením.";
const PRVNI_KYSLIK = "Na začátku v ovzduší kyslík skoro nebyl. Uvolnily ho až sinice fotosyntézou.";
const KAPALNA = "Život potřebuje vodu KAPALNOU. Ta je jen při vhodné teplotě, ne v mrazu ani ve velkém horku.";
const BLIZ = "Blíž ke Slunci je víc tepla, a když je ho moc, voda se vypaří. Víc slunce neznamená lepší podmínky pro život.";
const MESIC = "Měsíc sám nesvítí, jen odráží sluneční světlo. Energii a teplo dává Zemi Slunce.";
const JEN_DYCHANI = "Atmosféra neslouží jen k dýchání. Přes den brání přehřátí povrchu a v noci drží teplo.";

// ── L1 — ZAPAMATOVÁNÍ: příběh vzniku Země a výčet podmínek ──────────────────
export const POOL_L1: Polozka[] = [
  {
    q: "Z čeho podle vědců vznikla naše planeta?",
    correct: "Z oblaku prachu a plynu kolem Slunce",
    distractors: [
      { value: "Z kusu horniny, který se odtrhl od Měsíce", why: "Měsíc je menší než Země a Země z něj nevznikla. Obě tělesa vznikla z hmoty kolem mladého Slunce." },
      { value: "Z části Slunce, která se odtrhla a vychladla", why: "Země není kus Slunce. Vznikla z prachu a plynu, který kolem mladého Slunce obíhal." },
      { value: "Ze skály, která ve vesmíru byla odjakživa", why: "Země nebyla odjakživa. Vznikla asi před 4,6 miliardy let." },
    ],
    hints: [
      "Planety vznikly ze stejného materiálu, který zbyl kolem mladé hvězdy. Jak asi ten materiál vypadal?",
      "Kolem mladého Slunce obíhalo obrovské množství drobných zrníček a plynů. Postupně se shlukovaly do větších těles. Země nebyla ve vesmíru odjakživa.",
    ],
    explanation: "Země vznikla asi před 4,6 miliardy let z oblaku prachu a plynu, který obíhal kolem mladého Slunce. Zrníčka se shlukovala, až vznikla planeta.",
  },
  {
    q: "Asi jak stará je planeta Země?",
    correct: "Asi 4,6 miliardy let",
    distractors: [
      { value: "Asi 4,6 milionu let", why: "Milion je tisíckrát méně než miliarda. Země je stará miliardy let." },
      { value: "Asi 65 milionů let", why: "Asi před 65 miliony let vyhynuli dinosauři. Země je mnohem starší." },
      { value: "Asi 300 tisíc let", why: "Zhruba tak dlouho žije na Zemi dnešní člověk. Země je mnohem starší." },
    ],
    hints: [
      "Země je mnohem starší než lidé i dinosauři. Dinosauři vyhynuli před desítkami milionů let. Kolikrát víc asi uplynulo od vzniku Země?",
      "Porovnej řády: tisíce, miliony a miliardy. Dinosauři vyhynuli před desítkami milionů let a Země existovala dávno před nimi.",
    ],
    explanation: "Země je stará asi 4,6 miliardy let. Dinosauři vyhynuli asi před 65 miliony let a člověk je tu jen asi 300 tisíc let, takže Země je nesrovnatelně starší.",
  },
  {
    q: "Jak vypadala Země krátce po svém vzniku?",
    correct: "Byla rozžhavená, bez pevné kůry a bez oceánů",
    distractors: [
      { value: "Byla studená a celá pokrytá silným ledem", why: "Mladá Země byla naopak rozžhavená. Led se na ní objevil až mnohem později." },
      { value: "Byla zelená, pokrytá lesy a loukami", why: "Rostliny tehdy ještě nebyly. Život vznikl až později, a to ve vodě." },
      { value: "Byla zalitá oceánem, ve kterém plavaly ryby", why: "Oceány vznikly až po ochlazení Země a ryby se objevily o miliardy let později." },
    ],
    hints: [
      "Země vznikla ze srážek obrovského množství těles. Co se při takových srážkách děje s teplotou?",
      "Při srážkách se uvolnilo tolik tepla, že povrch byl roztavený. Voda se na takovém povrchu udržet nemohla a život ani rostliny tehdy nebyly.",
    ],
    explanation: "Mladá Země byla rozžhavená. Neměla pevnou kůru ani oceány, voda byla jen jako pára. Kůra a oceány vznikly až po ochlazení.",
  },
  {
    q: "Co se stalo s povrchem Země, když začala chladnout?",
    correct: "Vytvořila se na povrchu pevná kůra",
    distractors: [
      { value: "Vytvořila se kolem ní ozonová vrstva", why: "Ozonová vrstva vznikla až z kyslíku, který o miliardy let později uvolnily sinice." },
      { value: "Vyrostly na souši první stromy", why: "Mezi ochlazením Země a prvními rostlinami na souši uplynuly miliardy let." },
      { value: "Vypařila se všechna voda do vesmíru", why: "Při ochlazování se pára naopak srážela a padala jako déšť." },
    ],
    hints: [
      "Představ si roztavený kov, který chladne. Co se nejdřív stane s jeho povrchem?",
      "Roztavená hornina při chladnutí tuhne. Stromy ani ozon tehdy ještě nebyly, na ty si Země musela počkat miliardy let.",
    ],
    explanation: "Když Země chladla, roztavené horniny na povrchu ztuhly a vznikla pevná kůra. Z vodní páry pak spadl déšť a vznikly oceány.",
  },
  {
    q: "Odkud se na Zemi vzaly první oceány?",
    correct: "Z páry, která se srazila v déšť",
    distractors: [
      { value: "Z ledu, který roztál na pólech", why: "Na rozžhavené mladé Zemi žádný led nebyl. Oceány vznikly z vodní páry." },
      { value: "Z řek, které stékaly z hor", why: "Řeky potřebují déšť. Nejdřív se musela vodní pára srazit a spadnout." },
      { value: "Z pramenů pod pevnou kůrou", why: "Voda v pramenech pochází z deště, který prosákl do země. Oceány vznikly z vodní páry." },
    ],
    hints: [
      "Na rozžhavené Zemi mohla být voda jen v jednom skupenství. Co s ní udělalo ochlazení?",
      "Ve vzduchu mladé Země bylo hodně vodní páry. Když povrch chladl, pára měnila skupenství a vracela se k zemi. Led tehdy ještě nebyl.",
    ],
    explanation: "Mladá Země měla v ovzduší hodně vodní páry. Po ochlazení se pára srazila, dlouho pršelo a voda zaplnila prohlubně. Tak vznikly první oceány.",
  },
  {
    q: "Kde se objevily úplně první organismy?",
    correct: "Ve vodě prvních oceánů",
    distractors: [
      { value: "Na pevné souši mezi kameny", why: "Na souši tehdy chyběla ochrana před UV zářením. Život vznikl ve vodě." },
      { value: "Ve vzduchu nad sopkami", why: "Ve vzduchu organismy vzniknout nemohly. Potřebovaly vodu." },
      { value: "V hlubokém ledu na pólech", why: KAPALNA },
    ],
    hints: [
      "Organismy potřebují prostředí, ve kterém se rozpouštějí látky a které je chrání. Kde takové prostředí na mladé Zemi bylo?",
      "Na souši tehdy dopadalo škodlivé záření ze Slunce a nebyla tam ochrana. V moři se látky rozpouštěly a hloubka chránila před zářením. Led pro život nestačí.",
    ],
    explanation: "První organismy vznikly ve vodě prvních oceánů. Voda rozpouštěla látky a chránila je před UV zářením, které na souš dopadalo bez ochrany.",
  },
  {
    q: "Jaké byly úplně první organismy na Zemi?",
    correct: "Drobné jednobuněčné, podobné bakteriím",
    distractors: [
      { value: "Velké rostliny, podobné dnešním stromům", why: "Stromy jsou mnohobuněčné a žijí na souši. Objevily se až mnohem později." },
      { value: "Mnohobuněční živočichové, podobní rybám", why: "Ryby jsou složité mnohobuněčné organismy. Vznikly až po miliardách let vývoje." },
      { value: "Obří plazi, podobní pozdějším dinosaurům", why: "Dinosauři žili až v druhohorách, dávno po vzniku prvního života." },
    ],
    hints: [
      "Život začínal od toho nejjednoduššího. Z kolika buněk se asi první organismy skládaly?",
      "Složité organismy se vyvinuly až během miliard let. Úplně první byly tak malé, že bychom je viděli jen mikroskopem, a měly jedinou buňku.",
    ],
    explanation: "První organismy byly drobné a jednobuněčné, podobné dnešním bakteriím. Sinice, které uvolňují kyslík, se objevily později. Rostliny, ryby a plazi se vyvinuli mnohem později.",
  },
  {
    q: "Který plyn v ovzduší mladé Země skoro úplně chyběl?",
    correct: "Kyslík",
    distractors: [
      { value: "Oxid uhličitý", why: "Oxidu uhličitého bylo v ovzduší mladé Země naopak hodně, chrlily ho sopky." },
      { value: "Vodní pára", why: "Vodní páry bylo hodně. Právě z ní vznikly oceány." },
      { value: "Dusík", why: "Dusík uvolňovaly sopky a v ovzduší mladé Země ho bylo dost." },
    ],
    hints: [
      "Hledej plyn, který do ovzduší dodaly až organismy s fotosyntézou.",
      "Sopky chrlily páru a jiné plyny od začátku. Jeden plyn ale přibyl až díky sinicím, a my ho dnes potřebujeme k dýchání.",
    ],
    explanation: PRVNI_KYSLIK + " Oxid uhličitý, vodní páru a další sopečné plyny naopak ovzduší mladé Země obsahovalo hojně.",
  },
  {
    q: "Čeho bylo v ovzduší mladé Země velké množství?",
    correct: "Vodní páry a sopečných plynů",
    distractors: [
      { value: "Kyslíku a dusíku jako dnes", why: PRVNI_KYSLIK + " Ovzduší se během vývoje Země měnilo." },
      { value: "Pylu a výtrusů rostlin", why: "Rostliny tehdy ještě nebyly, takže ani pyl a výtrusy." },
      { value: "Ozonu, který chránil první život", why: "Ozon vzniká z kyslíku, a ten v ovzduší mladé Země skoro nebyl. Ozonová vrstva se vytvořila až mnohem později." },
    ],
    hints: [
      "Na mladé Zemi bylo mnoho sopek a povrch byl horký. Co asi stoupalo do vzduchu?",
      "Sopky chrlily plyny a z horkého povrchu stoupala pára. Organismy, které by do vzduchu něco přidaly, tehdy ještě nežily.",
    ],
    explanation: "Ovzduší mladé Země tvořila hlavně vodní pára a plyny ze sopek. Kyslík v něm skoro nebyl a rostliny ani jejich pyl ještě neexistovaly.",
  },
  {
    q: "Co z nabídky patří mezi podmínky pro život na Zemi?",
    correct: "Kapalná voda a vhodná teplota",
    distractors: [
      { value: "Světlo Měsíce a noční tma", why: MESIC },
      { value: "Led na pólech a sopečný popel", why: KAPALNA },
      { value: "Úplné sucho a stálý mráz", why: "V suchu a mrazu život, jak ho známe, strádá. Potřebuje vodu a vhodnou teplotu." },
    ],
    hints: [
      "Mysli na to, co potřebuje každá rostlina i zvíře, aby přežilo.",
      "Organismy potřebují vodu, ale ne zmrzlou, a nesmí být příliš horko ani zima. Měsíc sám nesvítí.",
    ],
    explanation: "Mezi podmínky pro život patří kapalná voda, vhodná teplota, atmosféra, energie ze Slunce a živiny. Led, mráz ani světlo Měsíce mezi ně nepatří.",
  },
  {
    q: "Co z nabídky mezi podmínky pro život na Zemi nepatří?",
    correct: "Svit Měsíce",
    distractors: [
      { value: "Kapalná voda", why: "Kapalná voda podmínkou pro život je. Rozpouštějí se v ní živiny a probíhají v ní děje v buňkách." },
      { value: "Vhodná teplota", why: "Vhodná teplota podmínkou pro život je. Při ní je voda kapalná a buňky nezmrznou." },
      { value: "Sluneční energie", why: "Energie ze Slunce podmínkou pro život je. Pohání fotosyntézu a ohřívá Zemi." },
    ],
    hints: [
      "Tři možnosti organismy potřebují. Hledej tu, bez které by se životu nic nestalo.",
      "Jedno z těles na obloze samo nesvítí a jen odráží cizí světlo. Energii k fotosyntéze ani teplo Zemi nedodává.",
    ],
    explanation: MESIC + " Kapalná voda, vhodná teplota a sluneční energie mezi podmínky pro život patří.",
  },
  {
    q: "Odkud získávají zelené rostliny energii k životu?",
    correct: "Ze světla Slunce",
    distractors: [
      { value: "Ze světla Měsíce", why: MESIC },
      { value: "Z tepla v půdě", why: "Půda dává rostlinám vodu a živiny. Energii pro fotosyntézu dává světlo." },
      { value: "Z kyslíku ve vzduchu", why: "Kyslík rostliny při fotosyntéze naopak uvolňují. Energii z něj nezískávají." },
    ],
    hints: [
      "Rostliny si vyrábějí živiny fotosyntézou. Co k ní potřebují a kde to berou?",
      "Fotosyntéza probíhá jen ve dne. Hledej těleso, které samo svítí, ne jen odráží cizí záři.",
    ],
    explanation: "Zelené rostliny získávají energii ze světla Slunce a využívají ji při fotosyntéze. Měsíc sám nesvítí a půda dává jen vodu a živiny.",
  },
  {
    q: "Která látka tvoří největší část těla většiny organismů?",
    correct: "Voda",
    distractors: [
      { value: "Tuky", why: "Tuky jsou zásoba energie. Tvoří jen menší část těla." },
      { value: "Bílkoviny", why: "Bílkoviny jsou důležité pro stavbu těla, ale je jich méně než nejčastější látky v buňkách." },
      { value: "Cukry", why: "Cukry slouží jako zdroj energie. V těle jich je mnohem méně." },
    ],
    hints: [
      "Okurka, meloun i lidské tělo mají něco společného. Co z nich vyteče, když je rozkrojíš nebo se pořežeš?",
      "Tato látka je v každé buňce a rozpouštějí se v ní živiny. Tuky, cukry a bílkoviny jsou v těle v menším množství.",
    ],
    explanation: "Většinu těla organismů tvoří voda. Je v každé buňce, rozpouštějí se v ní živiny a probíhají v ní životní děje.",
  },
  {
    q: "Jak se nazývá plynný obal Země?",
    correct: "Atmosféra",
    distractors: [
      { value: "Hydrosféra", why: "Hydrosféra je vodní obal Země, tedy oceány, řeky a jezera." },
      { value: "Litosféra", why: "Litosféra je kamenný obal Země, tedy zemská kůra a nejsvrchnější část pláště." },
      { value: "Biosféra", why: "Biosféra je část Země, ve které žijí organismy." },
    ],
    hints: [
      "Všechny možnosti končí stejně. Rozhodni podle první části slova.",
      "Hydro souvisí s vodou, lito s kamenem a bio se životem. Zbývá obal ze vzduchu, který dýcháme.",
    ],
    explanation: "Plynný obal Země se nazývá atmosféra (ovzduší). Hydrosféra je vodní obal, litosféra kamenný a biosféra je prostor, kde žijí organismy.",
  },
  {
    q: "Které organismy patří k nejstarším na Zemi?",
    correct: "Sinice a bakterie",
    distractors: [
      { value: "Houby a mechy", why: "Houby a mechy jsou mnohobuněčné a na souši se objevily mnohem později." },
      { value: "Hmyz a pavouci", why: "Hmyz a pavouci jsou složití živočichové. Na souš vylezli až po miliardách let." },
      { value: "Ryby a žáby", why: "Ryby a obojživelníci vznikli až v prvohorách, dávno po prvním životě." },
    ],
    hints: [
      "Nejstarší organismy byly jednobuněčné. Které skupiny z nabídky mají jen jednu buňku?",
      "Mechy, hmyz i ryby se skládají z mnoha buněk a potřebovaly dlouhý vývoj. Nejstarší organismy nemají ani buněčné jádro.",
    ],
    explanation: "Mezi nejstarší organismy patří jednobuněčné organismy bez jádra, nejdřív bakterie a o něco později sinice. Houby, mechy, hmyz i ryby vznikly mnohem později.",
  },
];

// ── L2 — POUŽITÍ: podmínka ↔ funkce, ptá se z obou stran ────────────────────
interface Strana {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  /** Vlastní vysvětlení, když se společné pro dvojici k této straně nehodí. */
  explanation?: string;
}
interface Par {
  /** podmínka → k čemu je */
  f: Strana;
  /** funkce → která podmínka */
  r: Strana;
  explanation: string;
}

export const PARY_L2: Par[] = [
  {
    f: {
      q: "K čemu je pro život na Zemi důležitá ozonová vrstva?",
      correct: "Pohlcuje většinu škodlivého UV záření",
      distractors: [
        { value: "Dodává organismům kyslík k dýchání", why: OZON },
        { value: "Zadržuje teplo, aby v noci nemrzlo", why: "Výkyvy teplot tlumí celá atmosféra. Ozonová vrstva zachytává část slunečního záření." },
        { value: "Dodává rostlinám světlo k fotosyntéze", why: "Světlo přichází ze Slunce. Ozonová vrstva ho nevyrábí, jen z něj zachytí škodlivou část." },
      ],
      hints: [
        "Ozonová vrstva je vysoko nad Zemí. Před čím ze Slunce by nás mohla chránit?",
        "Ze Slunce k nám přichází světlo, teplo a také neviditelné záření, které poškozuje kůži a buňky. Kyslík k dýchání bereme ze vzduchu u povrchu.",
      ],
    },
    r: {
      q: "Která podmínka chrání organismy na souši před škodlivým zářením ze Slunce?",
      correct: "Ozonová vrstva",
      distractors: [
        { value: "Kyslík v ovzduší", why: OZON },
        { value: "Kapalná voda", why: "Voda chrání jen organismy, které v ní žijí. Na souši chrání vrstva vysoko v ovzduší." },
        { value: "Vhodná teplota", why: "Teplota před zářením nechrání. Záření zachytí vrstva vysoko nad Zemí." },
      ],
      hints: [
        "Hledej něco, co je vysoko nad hlavou a funguje jako štít.",
        "Škodlivé UV záření se zachytí vysoko nad Zemí, daleko od vzduchu, který dýcháme. Hledej podmínku, která je tam nahoře, ne u povrchu.",
      ],
    },
    explanation: "Ozonová vrstva je vysoko v ovzduší a pohlcuje většinu škodlivého UV záření ze Slunce. Kyslík k dýchání je ve vzduchu u povrchu.",
  },
  {
    f: {
      q: "K čemu organismy potřebují kyslík v ovzduší?",
      correct: "Slouží většině organismů k dýchání",
      distractors: [
        { value: "Rostliny ho potřebují k fotosyntéze", why: "Při fotosyntéze rostliny kyslík uvolňují. Spotřebovávají při ní oxid uhličitý." },
        { value: "Chrání nás před škodlivým UV zářením", why: "Před UV zářením chrání ozonová vrstva vysoko nad Zemí. Kyslík u povrchu dýcháme." },
        { value: "Zadržuje teplo a brání nočnímu mrazu", why: "Výkyvy teplot tlumí atmosféra jako celek, ne samotný kyslík." },
      ],
      hints: [
        "Co děláš s každým nádechem a co přitom tělo ze vzduchu bere?",
        "Tento plyn potřebuje zvíře, člověk i rostlina, aby buňky získaly energii z potravy. Před zářením chrání jiná vrstva vysoko nad Zemí.",
      ],
    },
    r: {
      q: "Horolezci na nejvyšších horách světa nosí tlakové lahve, protože se jim tam špatně dýchá. Čeho dostávají s každým nádechem málo?",
      correct: "Kyslíku",
      distractors: [
        { value: "Ozonu", why: OZON },
        { value: "Oxidu uhličitého", why: "Oxid uhličitý při dýchání z těla odchází. K dýchání ho tělo nepotřebuje." },
        { value: "Vodní páry", why: "Vodní pára k dýchání neslouží. Horolezcům chybí plyn, který si tělo bere z každého nádechu." },
      ],
      hints: [
        "Který plyn si tělo bere z každého nádechu?",
        "Vysoko v horách je vzduch řídký, takže v jednom nádechu je méně plynu, který tělo potřebuje. Vrstva vysoko nad Zemí k dýchání neslouží a jiný plyn z těla při výdechu odchází.",
      ],
      explanation: "Vysoko v horách je vzduch řídký a v každém nádechu je méně kyslíku. Proto si horolezci berou lahve s kyslíkem. Ozonová vrstva k dýchání neslouží a oxid uhličitý při dýchání vydechujeme.",
    },
    explanation: "Většina organismů dýchá kyslík ze vzduchu (ryby kyslík rozpuštěný ve vodě). Při dýchání vydechují oxid uhličitý. Ozonová vrstva k dýchání neslouží.",
  },
  {
    f: {
      q: "K čemu slouží rostlinám a sinicím energie ze Slunce?",
      correct: "Umožňuje jim fotosyntézu a výrobu živin",
      distractors: [
        { value: "Umožňuje jim dýchat kyslík z ovzduší", why: "K dýchání slouží kyslík, ne sluneční energie. Energie ze Slunce pohání fotosyntézu." },
        { value: "Chrání je před škodlivým UV zářením", why: "UV záření přichází právě ze Slunce. Chrání před ním ozonová vrstva." },
        { value: "Dodává jim vodu a živiny z půdy", why: "Vodu a živiny berou rostliny z půdy kořeny. Slunce dává energii." },
      ],
      hints: [
        "Zelené organismy si umějí samy vyrobit potravu. Co k tomu ze Slunce potřebují?",
        "Rostliny a sinice mají chlorofyl, který zachytí světlo. Jeho energii použijí k výrobě cukrů z vody a oxidu uhličitého. Vodu a živiny berou jinde.",
      ],
      explanation: "Rostliny a sinice zachytí sluneční světlo chlorofylem a jeho energií vyrobí z vody a oxidu uhličitého cukry. Vodu a živiny jim Slunce nedodá, rostliny je berou kořeny z půdy. Kyslík při fotosyntéze naopak uvolňují.",
    },
    r: {
      q: "Pokojová rostlina stojí dlouho ve sklepě bez okna a bez lampy. Vodu i živiny v květináči má. Co jí chybí k výrobě potravy?",
      correct: "Světlo ze Slunce",
      distractors: [
        { value: "Kyslík ze vzduchu", why: "Vzduch je i ve sklepě a k výrobě potravy rostlina kyslík nepotřebuje. Chybí jí energie, která do sklepa nedopadá." },
        { value: "Hnojivo do květináče", why: "Živiny má rostlina podle zadání dost. Hnojivo nenahradí energii, kterou rostlina k výrobě potravy potřebuje." },
        { value: "Víc vody v konvi", why: "Vodu má rostlina podle zadání dost. Víc zalévání jí nepomůže." },
      ],
      hints: [
        "Co rostlina ve sklepě nedostává, i když ji zaléváš a hnojíš?",
        "Zelené listy vyrábějí potravu jen tehdy, když na ně dopadá energie z hvězdy naší soustavy. Do sklepa bez okna se nedostane.",
      ],
      explanation: "Rostliny vyrábějí potravu fotosyntézou a energii k ní berou ze slunečního světla. Ve sklepě bez okna světlo chybí, a tak rostlina chřadne, i když má vodu i živiny. Hnojivo ani zalévání světlo nenahradí.",
    },
    explanation: "Rostliny a sinice zachytí sluneční světlo chlorofylem a jeho energií vyrobí z vody a oxidu uhličitého cukry.",
  },
  {
    f: {
      q: "Co by se stalo s povrchem Země, kdyby přestala dostávat energii ze Slunce?",
      correct: "Postupně by vychladl a zamrzl",
      distractors: [
        { value: "Ohřál by se a voda by se vypařila", why: "Bez Slunce by se Země neohřívala, ale ochlazovala." },
        { value: "Nic, teplo by pak dodával Měsíc", why: MESIC },
        { value: "Zůstal by stejný díky ozonové vrstvě", why: "Ozonová vrstva teplo nevyrábí, jen pohlcuje UV záření." },
      ],
      hints: [
        "Co se stane s kamenem, který celý den leží ve stínu?",
        "Země sama skoro žádné teplo na povrch nedodává. Když přestane přicházet energie z hvězdy, teplo z povrchu uniká do vesmíru. Měsíc nehřeje.",
      ],
    },
    r: {
      q: "Co hlavně ohřívá povrch Země, takže na něm voda většinou nezamrzá?",
      correct: "Energie ze Slunce",
      distractors: [
        { value: "Teplo z nitra Země", why: "Teplo z nitra se projevuje hlavně u sopek a horkých pramenů. Povrch ohřívá hlavně Slunce." },
        { value: "Odražené světlo Měsíce", why: MESIC },
        { value: "Ozonová vrstva", why: "Ozonová vrstva teplo nevyrábí. Jen pohlcuje škodlivé UV záření." },
      ],
      hints: [
        "Proč je přes den tepleji než v noci?",
        "Teplota se mění podle toho, jestli svítí hvězda naší soustavy. Vrstva vysoko v ovzduší teplo nevyrábí a Měsíc nehřeje.",
      ],
    },
    explanation: "Povrch Země ohřívá hlavně energie ze Slunce. Bez ní by Země vychladla a voda zamrzla. Měsíc ani ozonová vrstva teplo nedodávají.",
  },
  {
    f: {
      q: "K čemu organismy potřebují kapalnou vodu?",
      correct: "Rozpouští živiny a roznáší je tělem",
      distractors: [
        { value: "Vyrábí v těle světlo pro fotosyntézu", why: "Voda světlo nevyrábí. Světlo přichází ze Slunce, voda v těle rozpouští a roznáší živiny." },
        { value: "Dodává jim energii místo Slunce", why: "Voda energii nedodává. Energie pro fotosyntézu přichází ze Slunce." },
        { value: "Dýchají ji místo kyslíku z ovzduší", why: "Organismy dýchají kyslík. Voda v těle rozpouští a roznáší živiny." },
      ],
      hints: [
        "Co se stane s cukrem, když ho nasypeš do čaje?",
        "Živiny se v těle musí dostat ke každé buňce. K tomu je potřeba tekutina, ve které se rozpustí a která proudí. Energii dává Slunce.",
      ],
    },
    r: {
      q: "Díky které podmínce se živiny v těle rozpustí a rozvedou k buňkám?",
      correct: "Kapalná voda",
      distractors: [
        { value: "Kyslík v ovzduší", why: "Kyslík slouží k dýchání. Živiny rozpouští a roznáší tekutina v těle." },
        { value: "Vodní pára", why: "Pára je plyn a živiny v ní nerozpustíš. " + KAPALNA },
        { value: "Voda ve formě ledu", why: "V ledu se živiny nerozpouštějí ani nepřenášejí. " + KAPALNA },
      ],
      hints: [
        "Živiny se rozpouštějí jen v tekutině. Které skupenství vody je tekuté?",
        "Pára je plyn a led je pevný. Rozpouštět a roznášet živiny dokáže jen to skupenství, které teče.",
      ],
    },
    explanation: "Kapalná voda rozpouští živiny a roznáší je po těle, u lidí třeba krví. Pára ani led to nedokážou.",
  },
  {
    f: {
      q: "Proč by bez kapalné vody nemohly fungovat buňky?",
      correct: "Probíhají v ní děje uvnitř buněk",
      distractors: [
        { value: "Jen ochlazuje tělo, když je horko", why: "Voda tělo ochlazuje, ale hlavně jsou v ní rozpuštěné látky a probíhají v ní děje v buňkách." },
        { value: "Buňky ji dýchají místo kyslíku", why: "Buňky dýchají kyslík. Voda je prostředí, ve kterém děje v buňce probíhají." },
        { value: "Slouží buňkám jen jako zásoba na sucho", why: "Voda není jen zásoba. Bez ní děje v buňce neprobíhají vůbec." },
      ],
      hints: [
        "Buňka je z velké části vyplněná tekutinou. K čemu jí asi je?",
        "Látky v buňce se musí potkávat a přeměňovat. To jde jen v tekutém prostředí, ne v suchu. Buňky dýchají plyn, ne tekutinu.",
      ],
    },
    r: {
      q: "Která podmínka tvoří prostředí, ve kterém probíhají děje uvnitř buněk?",
      correct: "Kapalná voda",
      distractors: [
        { value: "Atmosféra Země", why: "Atmosféra je plynný obal kolem planety, uvnitř buněk není." },
        { value: "Energie ze Slunce", why: "Energie ze Slunce pohání fotosyntézu, ale děje v buňce probíhají v tekutině." },
        { value: "Ozonová vrstva", why: "Ozonová vrstva je vysoko v ovzduší a pohlcuje UV záření. V buňkách není." },
      ],
      hints: [
        "Co je v buňce nejvíc a v čem se rozpouštějí její látky?",
        "Plynný obal Země i vrstva vysoko nad ní jsou mimo buňku. Sluneční energie buňku jen pohání. Hledej tekutinu, která buňku vyplňuje.",
      ],
    },
    explanation: "Buňky jsou z velké části tvořené vodou. Rozpouštějí se v ní látky a probíhají v ní všechny životní děje. Bez kapalné vody buňka nefunguje.",
  },
  {
    f: {
      q: "Jak atmosféra Země ovlivňuje teplotu na povrchu?",
      correct: "Brání velkým výkyvům mezi dnem a nocí",
      distractors: [
        { value: "Nijak, slouží jen organismům k dýchání", why: JEN_DYCHANI },
        { value: "Způsobuje, že v noci na Zemi vždy mrzne", why: "Atmosféra naopak v noci drží teplo. Bez ní by se povrch ochlazoval mnohem víc." },
        { value: "Sama vyrábí teplo podobně jako Slunce", why: "Atmosféra teplo nevyrábí, jen zadržuje teplo ze Slunce." },
      ],
      hints: [
        "Proč bývají za jasné noci bez mraků větší mrazy než za zatažené?",
        "Obal ze vzduchu funguje trochu jako peřina. Přes den tlumí sluneční paprsky a v noci nepustí všechno teplo pryč. Sám ale nehřeje.",
      ],
    },
    r: {
      q: "Která podmínka brání tomu, aby se povrch Země přes den přehřál a v noci úplně promrzl?",
      correct: "Atmosféra Země",
      distractors: [
        { value: "Ozonová vrstva", why: "Ozonová vrstva je jen tenká část ovzduší a pohlcuje UV záření. Výkyvy teplot tlumí celý plynný obal." },
        { value: "Kyslík v ovzduší", why: "Kyslík slouží k dýchání. Teplotu tlumí celý plynný obal Země." },
        { value: "Odražené světlo Měsíce", why: MESIC },
      ],
      hints: [
        "Měsíc nemá kolem sebe žádný vzduch. Přes den je tam obrovské horko a v noci obrovský mráz. Co tedy Měsíci chybí?",
        "Teplotu tlumí celý obal ze vzduchu, ne jen jeden jeho plyn nebo jedna tenká vrstva. Měsíc sám nesvítí ani nehřeje.",
      ],
    },
    explanation: "Atmosféra přes den tlumí sluneční paprsky a v noci drží teplo. Proto se teplota na Zemi mezi dnem a nocí nemění tak prudce jako na Měsíci.",
  },
  {
    f: {
      q: "Co se stane s většinou malých kamínků z vesmíru, když letí k Zemi?",
      correct: "Shoří v atmosféře, než dopadnou",
      distractors: [
        { value: "Zachytí je ozonová vrstva jako síť", why: "Ozonová vrstva pohlcuje UV záření, kamínky nezachytí. Ty shoří v celém plynném obalu." },
        { value: "Dopadnou všechny až na povrch", why: "Většina malých těles se ve vzduchu rozžhaví a shoří. Vidíme je jako padající hvězdy." },
        { value: "Přitáhne si je místo Země Měsíc", why: "Měsíc zachytí jen málo těles. Většina malých shoří ve vzduchu nad Zemí." },
      ],
      hints: [
        "Vzpomeň si na padající hvězdy. Co to vlastně je?",
        "Kamínek letí obrovskou rychlostí a naráží do vzduchu. Tím se rozžhaví jako jiskra. Ozonová vrstva kamínky nechytá.",
      ],
    },
    r: {
      q: "Která část Země chrání povrch před dopadem většiny malých těles z vesmíru?",
      correct: "Atmosféra Země",
      distractors: [
        { value: "Ozonová vrstva", why: "Ozonová vrstva pohlcuje UV záření, tělesa nezachytí. Ta shoří v celém plynném obalu." },
        { value: "Zemská kůra", why: "Kůra je pevný povrch, na který by tělesa dopadla. Chrání ho obal nad ní." },
        { value: "Kapalná voda", why: "Oceány zachytí jen tělesa, která do nich spadnou. Většina malých těles shoří dřív." },
      ],
      hints: [
        "Padající hvězdy vidíme vysoko na obloze. Čím tam tělesa letí?",
        "Malé těleso narazí velkou rychlostí do vzduchu, rozžhaví se a shoří dřív, než dopadne. Chrání tedy celý obal ze vzduchu, ne jen jedna jeho tenká vrstva.",
      ],
    },
    explanation: "Většina malých těles z vesmíru se v atmosféře rozžhaví a shoří. Vidíme je jako padající hvězdy. Atmosféra tak chrání povrch i organismy.",
  },
  {
    f: {
      q: "Proč je pro život důležité, že na většině Země není příliš horko ani příliš zima?",
      correct: "Voda tam zůstává kapalná",
      distractors: [
        { value: "Organismy pak nepotřebují vodu", why: "Organismy potřebují vodu vždy. Vhodná teplota zajistí, že voda je kapalná." },
        { value: "Rostliny pak nepotřebují světlo", why: "Rostliny potřebují světlo vždy. Vhodná teplota udržuje vodu kapalnou." },
        { value: "Stačí tam jakákoli voda, i led", why: KAPALNA },
      ],
      hints: [
        "Co se stane s vodou v louži, když mrzne, a co za velkého horka?",
        "Při mrazu voda ztuhne a za velkého horka se vypaří. Organismy vodu potřebují pořád, ale jen v tekutém skupenství.",
      ],
    },
    r: {
      q: "Která podmínka zajistí, že voda v jezeře nezamrzne ani se nevypaří?",
      correct: "Vhodná teplota",
      distractors: [
        { value: "Ozonová vrstva", why: "Ozonová vrstva pohlcuje UV záření, o skupenství vody nerozhoduje." },
        { value: "Kyslík v ovzduší", why: "Kyslík slouží k dýchání, zamrznutí vody neovlivní." },
        { value: "Živiny ve vodě", why: "Živiny slouží organismům k růstu. Jestli voda zamrzne, rozhoduje, jak je teplo." },
      ],
      hints: [
        "Zamrzání a vypařování závisí na jediné věci. Na čem?",
        "Voda mrzne při nule a při velkém horku se rychle vypařuje. Hledej podmínku, která drží teplo v rozmezí mezi tím.",
      ],
    },
    explanation: "Vhodná teplota udržuje vodu kapalnou. Při mrazu by zamrzla, při velkém horku by se vypařila a organismy by ji nemohly využít.",
  },
  {
    f: {
      q: "Co hrozí většině organismů, když teplota dlouho a hluboko klesne pod bod mrazu?",
      correct: "Voda v jejich buňkách zmrzne a poškodí je",
      distractors: [
        { value: "Nic, protože jim stačí kyslík a světlo", why: "Kyslík a světlo nestačí. Organismy potřebují i vhodnou teplotu, jinak voda v buňkách zmrzne." },
        { value: "Začnou rychleji růst a dělat fotosyntézu", why: "Za mrazu fotosyntéza skoro neprobíhá a organismy nerostou." },
        { value: "Přestanou potřebovat živiny i kapalnou vodu", why: "Organismy potřebují živiny i vodu stále. Mráz jim naopak škodí." },
      ],
      hints: [
        "Co se stane s lahví plnou vody, když ji zapomeneš v mrazáku?",
        "Buňky jsou z velké části z vody. Když voda ztuhne, zvětší svůj objem a buňka to nemusí vydržet. Mráz růst zpomaluje.",
      ],
    },
    r: {
      q: "Která podmínka chrání buňky před tím, aby zmrzly nebo se přehřály?",
      correct: "Vhodná teplota",
      distractors: [
        { value: "Oxid uhličitý", why: "Oxid uhličitý potřebují rostliny k fotosyntéze. Buňky před mrazem ani přehřátím nechrání." },
        { value: "Kyslík v ovzduší", why: "Kyslík slouží k dýchání. Před mrazem ani přehřátím buňky nechrání." },
        { value: "Ozonová vrstva", why: "Ozonová vrstva pohlcuje UV záření. O tom, jestli buňky zmrznou, nerozhoduje." },
      ],
      hints: [
        "Zmrznutí i přehřátí souvisí s jedinou veličinou, kterou měříš teploměrem.",
        "Plyny ve vzduchu ani vrstva vysoko nad Zemí buňky před mrazem nechrání. Rozhoduje, jestli prostředí není příliš studené ani příliš horké.",
      ],
    },
    explanation: "Vhodná teplota chrání buňky. Při mrazu by voda v nich zmrzla a buňky poškodila, při velkém horku by se přehřály.",
  },
  {
    f: {
      q: "K čemu rostlinám slouží živiny z půdy?",
      correct: "Potřebují je k růstu a stavbě těla",
      distractors: [
        { value: "Získávají z nich energii místo ze Slunce", why: "Energii pro fotosyntézu dává Slunce. Živiny slouží ke stavbě těla." },
        { value: "Dýchají je místo kyslíku", why: "Rostliny dýchají kyslík. Živiny z půdy potřebují ke stavbě těla." },
        { value: "Chrání se jimi před UV zářením", why: "Před UV zářením chrání ozonová vrstva. Živiny slouží k růstu." },
      ],
      hints: [
        "Proč zahradníci přidávají do půdy hnojivo?",
        "Hnojivo obsahuje látky, které rostlina nasaje kořeny spolu s vodou. Bez nich chřadne a špatně roste. Energii jí dává světlo.",
      ],
    },
    r: {
      q: "Co berou rostliny z půdy spolu s vodou, aby mohly růst?",
      correct: "Rozpuštěné živiny",
      distractors: [
        { value: "Energii ze Slunce", why: "Energii získávají rostliny listy ze světla, ne kořeny z půdy." },
        { value: "Oxid uhličitý", why: "Oxid uhličitý přijímají rostliny listy ze vzduchu, ne z půdy." },
        { value: "Teplo z nitra Země", why: "Teplo rostliny z půdy k růstu neberou. Kořeny přijímají vodu s rozpuštěnými látkami." },
      ],
      hints: [
        "Co obsahuje hnojivo, které zahradník rozpustí v konvi?",
        "Kořeny nasávají vodu a v ní jsou látky, bez kterých rostlina chřadne. Energii berou listy ze světla a plyn ze vzduchu.",
      ],
    },
    explanation: "Rostliny berou kořeny z půdy vodu s rozpuštěnými minerálními živinami. Bez nich nemohou růst, i když většinu hmoty těla vyrobí fotosyntézou z oxidu uhličitého a vody. Energii získávají ze Slunce.",
  },
  {
    f: {
      q: "K čemu rostliny potřebují oxid uhličitý ze vzduchu?",
      correct: "Vyrábějí z něj při fotosyntéze cukry",
      distractors: [
        { value: "Dýchají ho, protože kyslík nepotřebují", why: "Rostliny také dýchají kyslík. Oxid uhličitý spotřebují při fotosyntéze." },
        { value: "Chrání se jím před UV zářením", why: "Před UV zářením chrání ozonová vrstva. Oxid uhličitý rostliny využijí při fotosyntéze." },
        { value: "Mají z něj energii místo ze Slunce", why: "Energii dává rostlinám Slunce. Oxid uhličitý je surovina, ne zdroj energie." },
      ],
      hints: [
        "Zelené listy si samy vyrábějí potravu. Co k tomu ze vzduchu berou?",
        "Rozliš, jestli rostlina plyn potřebuje jako zdroj energie, k dýchání, nebo jako látku, ze které něco vyrobí. Rostliny také dýchají, ale jiný plyn.",
      ],
    },
    r: {
      q: "Který plyn ze vzduchu rostliny při fotosyntéze spotřebovávají?",
      correct: "Oxid uhličitý",
      distractors: [
        { value: "Kyslík", why: "Kyslík rostliny při fotosyntéze uvolňují, ne spotřebovávají." },
        { value: "Dusík", why: "Dusík tvoří většinu vzduchu, ale při fotosyntéze se nespotřebovává." },
        { value: "Vodní pára", why: "Vodu berou rostliny hlavně kořeny z půdy. Ze vzduchu při fotosyntéze berou jiný plyn." },
      ],
      hints: [
        "Který plyn my vydechujeme a rostliny ho naopak potřebují?",
        "Při fotosyntéze jeden plyn do rostliny vstupuje a druhý z ní odchází. Odcházející plyn dýcháme, vstupující vydechujeme.",
      ],
    },
    explanation: "Rostliny při fotosyntéze spotřebují oxid uhličitý a vodu a pomocí sluneční energie z nich vyrobí cukry. Uvolní přitom kyslík.",
  },
  {
    f: {
      q: "Jak sinice a první řasy postupně změnily ovzduší Země?",
      correct: "Uvolnily do něj fotosyntézou kyslík",
      distractors: [
        { value: "Odebraly z něj všechen kyslík", why: "Sinice kyslík nespotřebovaly, ale fotosyntézou vyráběly." },
        { value: "Vytvořily v něm vodní páru a mraky", why: "Vodní pára byla v ovzduší už od sopek. Sinice přidaly jiný plyn." },
        { value: "Naplnily ho sopečnými plyny", why: "Sopečné plyny chrlily sopky, ne organismy." },
      ],
      hints: [
        "Sinice a řasy mají chlorofyl. Co dělají na světle a který plyn při tom vzniká?",
        "Na mladé Zemi skoro chyběl plyn, který dnes dýcháme. Během stovek milionů let ho zelené organismy do vody a vzduchu postupně dodaly.",
      ],
    },
    r: {
      q: "Které organismy postupně naplnily ovzduší Země kyslíkem?",
      correct: "Sinice a řasy",
      distractors: [
        { value: "Houby a plísně", why: "Houby fotosyntézu nedělají a kyslík nevyrábějí." },
        { value: "Měňavky a nálevníci", why: "Měňavky a nálevníci nemají chlorofyl a kyslík nevyrábějí." },
        { value: "Ryby a obojživelníci", why: "Živočichové kyslík nevyrábějí, ale spotřebovávají. Navíc se objevili mnohem později." },
      ],
      hints: [
        "Kyslík vzniká při fotosyntéze. Které organismy z nabídky mají chlorofyl?",
        "Houby, měňavky ani živočichové fotosyntézu nedělají a kyslík spotřebovávají. Hledej drobné zelené organismy, které žily ve vodě velmi brzy.",
      ],
    },
    explanation: PRVNI_KYSLIK + " Později se přidaly řasy. Díky nim mohli vzniknout živočichové, kteří kyslík dýchají.",
  },
  {
    f: {
      q: "Jakou roli má sluneční teplo v koloběhu vody?",
      correct: "Vypařuje vodu, která pak znovu naprší",
      distractors: [
        { value: "Mění vodu v oceánech na led a sníh", why: "Teplo led naopak rozpouští. Ze Slunce voda nezamrzá." },
        { value: "Vyrábí v oceánech úplně novou vodu", why: "Slunce vodu nevyrábí. Voda na Zemi koluje stále dokola." },
        { value: "Nijak, déšť vzniká z ozonové vrstvy", why: "Ozonová vrstva pohlcuje UV záření, déšť z ní nevzniká. Mraky vznikají z vypařené vody." },
      ],
      hints: [
        "Co se děje s loužemi po dešti, když vysvitne slunce?",
        "Teplo mění vodu v páru, pára stoupá, ve výšce chladne a vzniknou mraky. Z nich pak prší. Voda přitom nevzniká nová, jen koluje.",
      ],
    },
    r: {
      q: "Co dodává energii k tomu, aby se voda z moří vypařovala a pak znovu pršela?",
      correct: "Energie ze Slunce",
      distractors: [
        { value: "Teplo z nitra Země", why: "Teplo z nitra ohřívá vodu jen u sopek a horkých pramenů. Vypařování na celé Zemi pohání Slunce." },
        { value: "Odražené světlo Měsíce", why: MESIC },
        { value: "Ozonová vrstva", why: "Ozonová vrstva pohlcuje UV záření. Vodu nevypařuje." },
      ],
      hints: [
        "Kdy louže vysychá rychleji: za slunečného, nebo zamračeného dne?",
        "Vypařování potřebuje teplo, a to po celé ploše moří, ne jen u sopek. Měsíc nehřeje a vrstva vysoko v ovzduší teplo nevyrábí.",
      ],
    },
    explanation: "Sluneční teplo vypařuje vodu z moří, řek i půdy. Pára ve výšce vytvoří mraky a z nich prší. Tak voda koluje dokola.",
  },
];

// ── L3 — ANALÝZA A PŘENOS: čtyři šablony ────────────────────────────────────

/** (a) vymyšlená planeta nebo místo → která podmínka chybí */
export const POOL_L3_PLANETA: Polozka[] = [
  {
    q: "Vědci popisují vymyšlenou planetu. Má husté ovzduší s kyslíkem a svítí na ni hvězda podobná Slunci, ale teplota tam stále drží pod −60 °C a voda je jen jako led. Která podmínka pro život, jak ho známe, tam nejvíc chybí?",
    correct: "Kapalná voda díky vhodné teplotě",
    distractors: [
      { value: "Světlo a energie z blízké hvězdy", why: "Světlo tam podle popisu je, hvězda svítí. Chybí voda v kapalném stavu, protože je tam mráz." },
      { value: "Ovzduší s dostatkem kyslíku k dýchání", why: "Ovzduší s kyslíkem tam podle popisu je. Problém je mráz." },
      { value: "Žádná, protože voda tam přece je", why: KAPALNA },
    ],
    hints: [
      "Projdi popis podmínku po podmínce. Co tam je a co je tam v nesprávném stavu?",
      "Světlo i ovzduší planeta má. Voda tam je, ale při takovém mrazu je pevná. Zamysli se, jestli organismům stačí led.",
    ],
    explanation: "Planeta má světlo i ovzduší, ale při stálém mrazu je voda jen jako led. Život potřebuje vodu kapalnou, a k tomu chybí vhodná teplota.",
  },
  {
    q: "Vymyšlená planeta putuje vesmírem daleko od všech hvězd. Díky teplu ze svého nitra má pod ledem kapalnou vodu a ovzduší jí nechybí, ale stále je na ní úplná tma. Co tam chybí rostlinám a sinicím?",
    correct: "Světlo jako zdroj energie k fotosyntéze",
    distractors: [
      { value: "Kapalná voda k rozpouštění živin", why: "Kapalnou vodu planeta podle popisu má." },
      { value: "Ovzduší, které tlumí výkyvy teplot", why: "Ovzduší planetě podle popisu nechybí." },
      { value: "Ozonová vrstva, která chrání před UV", why: "Bez hvězdy tam žádné UV záření nedopadá, takže ochrana před ním tu nerozhoduje. Rostlinám chybí něco jiného." },
    ],
    hints: [
      "Rostliny a sinice si vyrábějí živiny samy. Co k tomu potřebují a co planeta nemá?",
      "Voda i ovzduší na planetě jsou. Fotosyntéza ale běží jen tehdy, když na organismus něco dopadá z hvězdy. Kde není hvězda, není ani UV záření.",
    ],
    explanation: "Planeta má vodu i ovzduší, ale je na ní stálá tma. Rostliny a sinice potřebují k fotosyntéze světlo, a to jim tam chybí.",
  },
  {
    q: "Vymyšlená planeta má kapalnou vodu, vhodnou teplotu i světlo z hvězdy. V jejím ovzduší ale vůbec není kyslík. Jaký život by tam mohl existovat spíš?",
    correct: "Jednobuněčné organismy, které kyslík nedýchají",
    distractors: [
      { value: "Ryby a žáby, které dýchají kyslík", why: "Ryby i žáby kyslík potřebují, a ten na planetě není ani ve vzduchu, ani ve vodě." },
      { value: "Lesy a savci podobní těm na dnešní Zemi", why: "Savci dýchají kyslík. Na dnešní Zemi jsou až díky kyslíku, který před nimi uvolnily sinice." },
      { value: "Žádný, bez kyslíku život vzniknout nemůže", why: "První organismy na Zemi vznikly v době, kdy kyslík v ovzduší skoro nebyl." },
    ],
    hints: [
      "Vzpomeň si, jaké bylo ovzduší na mladé Zemi, když vznikl první život.",
      "Na mladé Zemi kyslík skoro chyběl, a přesto tam život vznikl. Živočichové, kteří kyslík dýchají, přišli až mnohem později.",
    ],
    explanation: "Na mladé Zemi kyslík skoro nebyl, a přesto vznikly drobné jednobuněčné organismy, které ho nedýchaly. Na takové planetě by tedy spíš mohly žít ony, ne ryby ani savci.",
  },
  {
    q: "Na vymyšlené planetě je vhodná teplota, svítí tam hvězda a je tam ovzduší. Voda se tam ale nevyskytuje vůbec, ani jako led, ani jako pára. Proč tam život, jak ho známe, nevznikne?",
    correct: "Chybí voda, v níž probíhají děje v buňkách",
    distractors: [
      { value: "Chybí světlo, které dává energii", why: "Hvězda tam podle popisu svítí." },
      { value: "Chybí ovzduší, které tlumí výkyvy", why: "Ovzduší tam podle popisu je." },
      { value: "Chybí jen led, kapalná voda není nutná", why: KAPALNA },
    ],
    hints: [
      "Porovnej popis se seznamem podmínek pro život. Která v popisu úplně chybí?",
      "Teplota, světlo i ovzduší jsou v pořádku. Rozhoduje látka, která tvoří většinu těla organismů. Pozor, led ani pára ji nenahradí.",
    ],
    explanation: "Planeta má teplotu, světlo i ovzduší, ale nemá žádnou vodu. Bez kapalné vody se nerozpouštějí živiny a v buňkách neprobíhají životní děje.",
  },
];

/**
 * (b) skutečné planety, jen kvalitativně.
 * Každá položka míří na jinou podmínku (teplo v ovzduší, UV, mráz, souhrn),
 * aby se odpověď nedala uhodnout podle vzoru „vždy kapalná voda“.
 */
export const POOL_L3_SOUSTAVA: Polozka[] = [
  {
    q: "Venuše je blíž ke Slunci než Země. Merkur je Slunci ještě blíž, a přesto je na povrchu Venuše větší horko. Čím to je?",
    correct: "Husté ovzduší tam zadržuje teplo",
    distractors: [
      { value: "Venuše je větší, a proto víc hřeje", why: "Venuše je větší než Merkur, ale velikost planety teplo nevyrábí. Rozhoduje, jak planeta teplo udrží." },
      { value: "Venuše sama svítí jako malá hvězda", why: "Venuše sama nesvítí, jen odráží sluneční světlo stejně jako Měsíc." },
      { value: "Merkur chladí jeho ozonová vrstva", why: "Merkur žádnou ozonovou vrstvu nemá a ozon planetu nechladí. Merkur skoro nemá ovzduší, takže teplo z něj uniká." },
    ],
    hints: [
      "Merkur je Slunci blíž, takže samotná vzdálenost to nevysvětlí. Co má Venuše kolem sebe a Merkuru chybí?",
      "Vzpomeň si, proč bývá za zatažené noci tepleji než za jasné. Když planetu obaluje velmi hustá vrstva plynů, funguje jako silná peřina.",
    ],
    explanation: "Merkur je Slunci blíž, ale skoro nemá ovzduší, takže teplo z něj uniká. Venuše má velmi husté ovzduší, které teplo zadržuje jako skleník. Proto je tam obrovské horko a voda se na povrchu neudrží kapalná.",
  },
  {
    q: "Mars je od Slunce dál než Země a jeho velmi řídké ovzduší nemá ozonovou vrstvu. Co by na jeho povrchu organismy nejvíc ohrožovalo?",
    correct: "Škodlivé UV záření ze Slunce",
    distractors: [
      { value: "Velké horko z blízkého Slunce", why: "Mars je od Slunce dál než Země, horko tam nehrozí. Je tam naopak zima." },
      { value: "Přebytek kyslíku v ovzduší", why: "V řídkém ovzduší Marsu je kyslíku velmi málo." },
      { value: "Příliš husté a dusivé ovzduší", why: "Ovzduší Marsu je naopak velmi řídké." },
    ],
    hints: [
      "Zadání říká, co Marsu chybí. Před čím ta věc chrání organismy na Zemi?",
      "Na Zemi zachytí tenký štít vysoko v ovzduší neviditelné paprsky, které poškozují kůži a buňky. Mars je daleko, takže horko nehrozí, a kyslíku má v ovzduší velmi málo.",
    ],
    explanation: "Mars nemá ozonovou vrstvu a jeho řídké ovzduší škodlivé UV záření ze Slunce skoro nezadrží. To by poškozovalo buňky organismů na povrchu. Horko tam nehrozí, protože Mars je dál od Slunce, a kyslíku je v jeho ovzduší velmi málo.",
  },
  {
    q: "Na Marsu jsou na pólech ledové čepičky. Proč z nich netečou řeky jako z ledovců na Zemi?",
    correct: "Je tam mráz, led tedy neroztaje",
    distractors: [
      { value: "Je tam horko, voda se hned vypaří", why: "Mars je od Slunce dál než Země, horko tam není. Led neroztaje, protože je tam mráz." },
      { value: "Slunce na Mars vůbec nesvítí", why: "Slunce na Mars svítí, jen slaběji než na Zemi. Led přesto neroztaje, protože je tam mráz." },
      { value: "Voda z nich hned zmizí v oceánech", why: "Mars žádné oceány nemá. Z čepiček netečou řeky, protože led v mrazu neroztaje." },
    ],
    hints: [
      "Mars je od Slunce dál než Země. Co to znamená pro teplotu na jeho povrchu?",
      "Řídký obal ze vzduchu neudrží teplo, podobně jako tenká deka. Zamysli se, co se v takových podmínkách děje s ledem.",
    ],
    explanation: "Mars je dál od Slunce než Země a jeho řídké ovzduší teplo neudrží. Je tam proto mráz a led na pólech neroztaje v kapalnou vodu. Bez kapalné vody nemohou téct řeky a život, jak ho známe, tam nemá podmínky.",
  },
  {
    q: "Proč je na Zemi kapalná voda, a na Venuši ani na Marsu ne?",
    correct: "Země má vhodnou vzdálenost i ovzduší",
    distractors: [
      { value: "Země je ze všech planet nejblíž Slunci", why: "Venuše je Slunci blíž než Země a je tam takové horko, že se voda vypaří. " + BLIZ },
      { value: "Země je ze všech planet nejdál od Slunce", why: "Mars je od Slunce dál než Země, a voda tam zamrzá." },
      { value: "Země má jako jediná planeta pevný povrch", why: "Pevný povrch mají i Venuše a Mars. Rozhoduje teplota, a ta závisí na vzdálenosti od Slunce i na ovzduší." },
    ],
    hints: [
      "Venuše je blíž ke Slunci a Mars dál. Kde je Země mezi nimi, a jaký obal ze vzduchu tyto tři planety mají?",
      "Na Venuši hustý obal ze vzduchu drží příliš mnoho tepla, na Marsu řídký obal neudrží skoro žádné. Zamysli se, proč se Zemi nestalo ani jedno.",
    ],
    explanation: "Země je od Slunce ve vhodné vzdálenosti a její ovzduší drží přiměřené teplo. Venuše je blíž a její husté ovzduší ji přehřívá, Mars je dál a jeho řídké ovzduší teplo neudrží. Proto je kapalná voda jen na Zemi.",
  },
];

/** (c) úvaha nad pořadím */
export const POOL_L3_PORADI: Polozka[] = [
  {
    q: "Proč mohly organismy vylézt z vody na souš až po vzniku ozonové vrstvy?",
    correct: "Předtím by je na souši poškodilo UV záření",
    distractors: [
      { value: "Předtím byla celá souš pokrytá silným ledem", why: "Souš nebyla celá pod ledem, byla tam i jezera a řeky. Na souši ale chyběla ochrana před UV zářením ze Slunce." },
      { value: "Předtím nesvítilo Slunce na souš dost silně", why: "Slunce svítilo i předtím. Právě jeho škodlivé záření bez ochrany souš ohrožovalo." },
      { value: "Předtím nebyla na souši žádná kapalná voda", why: "Na souši byla jezera i řeky. Chyběla ochrana před zářením ze Slunce." },
    ],
    hints: [
      "K čemu ozonová vrstva slouží? Spoj to s tím, proč organismy do té doby zůstávaly ve vodě.",
      "Voda chrání organismy před částí slunečního záření. Na souši tuhle ochranu zajistila až vrstva vysoko v ovzduší. Slunce svítilo i dřív.",
    ],
    explanation: "Ozonová vrstva pohlcuje UV záření. Dokud nebyla, voda chránila organismy, ale na souši by je záření poškodilo. Proto souš osídlily až po jejím vzniku.",
  },
  {
    q: "Proč první organismy nemohly dýchat kyslík z ovzduší?",
    correct: "V ovzduší tehdy kyslík skoro nebyl",
    distractors: [
      { value: "Kyslík tehdy celý pohltila ozonová vrstva", why: OZON + " Ozon navíc vznikl až z kyslíku od sinic." },
      { value: "Kyslík tehdy byl jen v hlubokých oceánech", why: "Ani ve vodě tehdy kyslík skoro nebyl. Uvolnily ho až sinice." },
      { value: "V ovzduší ho bylo tolik, že je otrávil", why: PRVNI_KYSLIK },
    ],
    hints: [
      "Kdo do ovzduší kyslík dodal a kdy se objevil?",
      "Organismy, které kyslík vyrábějí fotosyntézou, se objevily až během vývoje života. Do té doby ho nebylo ve vzduchu ani ve vodě. Ozon vznikl později.",
    ],
    explanation: PRVNI_KYSLIK + " První organismy proto kyslík dýchat nemohly a žily bez něj.",
  },
  {
    q: "Proč musely nejdřív žít sinice, a teprve potom mohli vzniknout živočichové, kteří dýchají kyslík?",
    correct: "Sinice nejdřív uvolnily kyslík do ovzduší",
    distractors: [
      { value: "Sinice nejdřív pohltily všechno UV záření", why: "UV záření pohlcuje ozonová vrstva, ne sinice. Sinice uvolňovaly kyslík." },
      { value: "Sinice nejdřív ochladily rozžhavenou Zemi", why: "Země se ochladila sama, ještě před vznikem života." },
      { value: "Sinice nejdřív vytvořily první oceány", why: "Oceány vznikly z vodní páry ještě před vznikem života." },
    ],
    hints: [
      "Co živočichové potřebují k dýchání a kdo to na Zemi začal vyrábět?",
      "Sinice dělají fotosyntézu. Spoj, co při ní vzniká, s tím, co živočichové dýchají. Oceány i pevná kůra tu byly dřív než sinice.",
    ],
    explanation: "Živočichové dýchají kyslík. Ten do vody a ovzduší postupně uvolnily sinice fotosyntézou. Bez nich by živočichové neměli co dýchat.",
  },
  {
    q: "Ozon vzniká vysoko v ovzduší z kyslíku. Proč se ozonová vrstva nemohla vytvořit hned po vzniku Země?",
    correct: "V ovzduší ještě nebyl kyslík od sinic",
    distractors: [
      { value: "Země byla ještě příliš daleko od Slunce", why: "Vzdálenost Země od Slunce se podstatně neměnila. Chyběla látka, ze které ozon vzniká." },
      { value: "Na Zemi ještě nebyla žádná pevná souš", why: "Souš na vznik ozonu vliv nemá. Chyběla látka, ze které ozon vzniká." },
      { value: "Slunce ještě nevyzařovalo UV záření", why: "Slunce vyzařovalo i tehdy. Chyběla látka, ze které ozon vzniká." },
    ],
    hints: [
      "V zadání je napsáno, z čeho ozon vzniká. Bylo toho na mladé Zemi dost?",
      "Spoj dva kroky: ozon potřebuje určitý plyn a ten plyn dodaly až organismy s fotosyntézou. Vzdálenost od Slunce se neměnila.",
    ],
    explanation: "Ozon vzniká z kyslíku. Kyslík do ovzduší postupně uvolnily až sinice, takže ozonová vrstva se vytvořila až po nich.",
  },
];

/** (d) co by se stalo, kdyby… */
export const POOL_L3_KDYBY: Polozka[] = [
  {
    q: "Co by se nejspíš stalo, kdyby Země přišla o celou atmosféru?",
    correct: "Přes den by bylo horko a v noci mráz",
    distractors: [
      { value: "Na celé Zemi by bylo stále stejně teplo", why: "Bez atmosféry by se teplo nedrželo. Přes den by se povrch rozpálil a v noci promrzl, teplota by se tedy měnila víc, ne méně." },
      { value: "Slunce by přestalo povrch Země ohřívat", why: "Slunce by Zemi dál ohřívalo, jen by teplo v noci rychle unikalo." },
      { value: "Na povrch by dopadalo méně UV záření", why: "Naopak. Bez atmosféry by zmizela i ozonová vrstva a UV záření by dopadalo víc." },
    ],
    hints: [
      "Vzpomeň si, co atmosféra dělá s teplotou, ne jen s dýcháním.",
      "Podívej se na těleso, které žádný obal ze vzduchu nemá, a zjisti, jak se tam mění teplota mezi dnem a nocí. Ozonová vrstva je součástí ovzduší.",
    ],
    explanation: "Atmosféra tlumí výkyvy teplot. Bez ní by se povrch přes den rozpálil a v noci promrzl jako na Měsíci. Zmizela by i ozonová vrstva a kyslík k dýchání.",
  },
  {
    q: "Co by se nejspíš stalo, kdyby Země obíhala Slunce mnohem dál, zhruba jako Mars?",
    correct: "Většina vody by zamrzla na led",
    distractors: [
      { value: "Oceány by se horkem vypařily", why: "Dál od Slunce je méně tepla, ne víc. Voda by zamrzala." },
      { value: "Nic by se nezměnilo, stačí světlo", why: "Změnilo by se hodně. Dál od Slunce by bylo mnohem chladněji." },
      { value: "Přibylo by světla pro fotosyntézu", why: "Dál od Slunce by světla i tepla ubylo." },
    ],
    hints: [
      "Čím dál od ohně sedíš, tím je ti… Co to znamená pro planetu?",
      "Menší vzdálenost znamená více tepla, větší vzdálenost méně. Zamysli se, co udělá s vodou velký chlad.",
    ],
    explanation: "Dál od Slunce by na Zemi dopadalo méně tepla. Bylo by tam chladno jako na Marsu a většina vody by zamrzla. Chyběla by kapalná voda.",
  },
  {
    q: "Představ si, že by Země obíhala Slunce mnohem blíž, zhruba jako Venuše. Co by se nejspíš stalo s oceány?",
    correct: "Velkým horkem by se vypařily",
    distractors: [
      { value: "Zamrzly by na silný led", why: "Blíž ke Slunci je tepleji, ne chladněji." },
      { value: "Zůstaly by stejné jako dnes", why: "Blíž ke Slunci by bylo mnohem větší horko a voda by se neudržela kapalná." },
      { value: "Díky většímu teplu by se rozrostly", why: BLIZ },
    ],
    hints: [
      "Co se stane s vodou v hrnci, když ho postavíš blíž k ohni?",
      "Bližší planeta dostává víc tepla. Zamysli se, co se stane s kapalnou vodou, když je tepla příliš mnoho.",
    ],
    explanation: "Blíž ke Slunci by bylo obrovské horko jako na Venuši. Voda by se vypařila a kapalná voda pro život by chyběla.",
  },
  {
    q: "Co by hrozilo organismům na souši, kdyby se ozonová vrstva hodně zeslabila?",
    correct: "Víc by je poškozovalo UV záření",
    distractors: [
      { value: "Měly by méně kyslíku k dýchání", why: OZON },
      { value: "V noci by na souši silně mrzlo", why: "Ozonová vrstva teplotu u povrchu v noci skoro neovlivňuje. Chrání před UV zářením ze Slunce." },
      { value: "Rostliny by neměly světlo k fotosyntéze", why: "Světla by na povrch dopadalo stejně, spíš víc. Přibylo by ale i škodlivého záření." },
    ],
    hints: [
      "Nejdřív si vzpomeň, co ozonová vrstva zachytává. Pak domysli, co se stane, když zeslábne.",
      "Kyslík k dýchání je ve vzduchu u povrchu, ne ve vrstvě vysoko nad Zemí. Zeslabená vrstva by propustila víc něčeho, co přichází ze Slunce.",
    ],
    explanation: "Ozonová vrstva pohlcuje UV záření. Kdyby zeslábla, na souš by ho dopadalo víc a poškozovalo by kůži a buňky organismů.",
  },
  {
    q: "Co by se stalo s rostlinami, kdyby Slunce na dlouhou dobu zakryl hustý prach, třeba po výbuchu obří sopky?",
    correct: "Neměly by dost světla k fotosyntéze",
    distractors: [
      { value: "Neměly by dost vody v půdě", why: "Prach vodu z půdy nebere. Rostlinám by chybělo světlo." },
      { value: "Víc by je poškozovalo UV záření", why: "Prach by UV záření spíš zachytil. Rostlinám by chybělo světlo." },
      { value: "Rostly by rychleji díky teplu z prachu", why: "Prach teplo nevyrábí a zastíněná Země by se ochladila." },
    ],
    hints: [
      "Co prach ve vzduchu zastaví, když se valí mezi Sluncem a zemí?",
      "Hustý prach funguje jako závěs. Rostliny potřebují k výrobě živin energii, kterou dostávají ze Slunce. Voda v půdě se nemění.",
    ],
    explanation: "Hustý prach by zastínil Slunce. Rostliny by neměly dost světla k fotosyntéze, chřadly by a chyběla by potrava i pro živočichy.",
  },
];

// ── Generátor ───────────────────────────────────────────────────────────────
const vytvor = (p: Polozka): PracticeTask | null =>
  choice(p.q, p.correct, p.distractors, { hints: p.hints, explanation: p.explanation });

/**
 * L2: každá dvojice dá dvě položky — z obou stran. Sezení bere prvních 6 úloh
 * v pořadí banky, proto obě strany téže dvojice nesmí stát blízko sebe:
 * f sudých dvojic → r lichých → f lichých → r sudých (odstup ≥ 7).
 */
const strana = (s: Strana, p: Par): Polozka => ({
  q: s.q,
  correct: s.correct,
  distractors: s.distractors,
  hints: s.hints,
  explanation: s.explanation ?? p.explanation,
});
const sude = PARY_L2.filter((_, i) => i % 2 === 0);
const liche = PARY_L2.filter((_, i) => i % 2 === 1);
const POOL_L2: Polozka[] = [
  ...sude.map((p) => strana(p.f, p)),
  ...liche.map((p) => strana(p.r, p)),
  ...liche.map((p) => strana(p.f, p)),
  ...sude.map((p) => strana(p.r, p)),
];

/** L3: šablony (a)–(d) proložené, aby se střídaly rovnoměrně. */
function prolozit(banky: Polozka[][]): Polozka[] {
  const out: Polozka[] = [];
  const max = Math.max(...banky.map((b) => b.length));
  for (let i = 0; i < max; i++) for (const b of banky) if (b[i]) out.push(b[i]);
  return out;
}
const vyber = <T,>(pole: T[], poradi: number[]): T[] => poradi.map((i) => pole[i]);
// Pořadí volené tak, aby v prvních šesti úlohách mířila každá na jinou podmínku
// (UV záření ze „souše“ a z „ozon zeslábne“ až na konec).
const POOL_L3: Polozka[] = prolozit([
  POOL_L3_PLANETA,
  POOL_L3_SOUSTAVA,
  vyber(POOL_L3_PORADI, [1, 2, 3, 0]),
  vyber(POOL_L3_KDYBY, [0, 4, 1, 2, 3]),
]);

export { POOL_L2, POOL_L3 };

/** Deterministicky projde celou banku úrovně — každá položka dá jednu úlohu. */
function zBanky(pool: Polozka[]): PracticeTask[] {
  // Rotace žije jen uvnitř volání — modul nemá stav.
  let i = 0;
  return ruzneUlohy(() => losUlohy(() => vytvor(pool[i++ % pool.length])), pool.length, pool.length);
}

function gen(level: number): PracticeTask[] {
  if (level <= 1) return zBanky(POOL_L1);
  if (level === 2) return zBanky(POOL_L2);
  return zBanky(POOL_L3);
}

// ── Topic ───────────────────────────────────────────────────────────────────
export const VZNIK_ZEME_PODMINKY_PRO_ZIVOT: TopicMetadata[] = [
  {
    id: "g6-pri-vznik-zeme-podminky-pro-zivot-6",
    rvpNodeId: "g6-prirodopis-obecna-biologie-vznik-a-vyvoj-zivota-vznik-zeme-podminky-pro-zivot",
    displayName: "Jak vznikla Země a co potřebuje život",
    title: "Vznik Země, podmínky pro život",
    studentTitle: "Jak vznikla Země a co potřebuje život",
    subject: "prirodopis",
    // Stejný zápis jako sesterské téma „Třídění organismů“ — sdílí klíč
    // v topicInsight.ts („prirodopis::Obecná biologie::Vznik a vývoj života“)
    // i dětský název v displayNames.ts.
    category: "Obecná biologie",
    topic: "Vznik a vývoj života",
    briefDescription: "Proč je na Zemi život a co k němu organismy potřebují",
    keywords: [
      "vznik Země", "podmínky pro život", "kapalná voda", "teplota", "atmosféra",
      "kyslík", "ozonová vrstva", "UV záření", "Slunce", "fotosyntéza", "sinice",
      "Venuše", "Mars",
    ],
    goals: [
      "Popsat zjednodušeně, jak vznikla Země a kde a jaký vznikl první život.",
      "Přiřadit podmínku pro život (kapalná voda, vhodná teplota, atmosféra, ozonová vrstva, energie ze Slunce, u většiny organismů i kyslík k dýchání) k tomu, k čemu ji organismy potřebují.",
      "Rozhodnout u neznámého místa nebo planety, která podmínka pro život chybí a co to způsobí.",
    ],
    boundaries: [
      "Stáří Země jen v řádu (asi 4,6 miliardy let), žádné další přesné datace.",
      "Venuše a Mars jen kvalitativně, bez čísel.",
      "Bez chemických teorií vzniku života (Millerův pokus) — nadstavba.",
      "Pořadí geologických ér patří sesterskému tématu.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Život potřebuje kapalnou vodu, vhodnou teplotu, atmosféru, ochranu před UV zářením a energii ze Slunce. Většina organismů navíc dýchá kyslík. U každé podmínky si řekni, k čemu slouží.",
      steps: [
        "Projdi podmínky pro život jednu po druhé.",
        "U každé si řekni, k čemu ji organismy potřebují (dýchání, fotosyntéza, ochrana před UV, stálá teplota).",
        "U neznámého místa zjisti, která podmínka chybí, a domysli, co to způsobí.",
      ],
      commonMistake: "Myslet si, že ozonová vrstva dodává kyslík k dýchání, nebo že pro život stačí jakákoli voda, i led.",
      example: "Na planetě s ledem a mrazem pod −60 °C chybí kapalná voda, i když je tam světlo i ovzduší.",
    },
  },
];
