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
  { question: "Kolik noh má hmyz?", correctAnswer: "6 noh", options: ["6 noh", "4 nohy", "8 noh", "10 noh"], hints: ["Hmyz se liší od pavouků počtem noh."] },
  { question: "Na kolik částí je rozděleno tělo hmyzu?", correctAnswer: "3 části – hlava, hruď, zadeček", options: ["2 části – hlavohruď, zadeček", "3 části – hlava, hruď, zadeček", "4 části", "1 celek"], hints: ["Pavouk má jen 2 části těla."] },
  { question: "Kolik noh mají pavouci?", correctAnswer: "8 noh", options: ["6 noh", "10 noh", "8 noh", "4 nohy"], hints: ["Proto pavouci nejsou hmyz."] },
  { question: "Do jaké skupiny patří šnek zahradní?", correctAnswer: "Měkkýši", options: ["Hmyz", "Červi", "Pavoukovci", "Měkkýši"], hints: ["Má měkké tělo bez kostí."] },
  { question: "Co je charakteristické pro žížalu?", correctAnswer: "Protáhlé válcovité tělo bez noh, žije v půdě", options: ["Protáhlé válcovité tělo bez noh, žije v půdě", "Má 6 noh a létá", "Má tvrdý krunýř", "Je to druh hmyzu s měkkým tělem"], hints: ["Žížala kypří půdu."] },
  { question: "Jak se jmenuje tvrdý obal (vnější kostra) hmyzu?", correctAnswer: "Chitinový exoskelet – krunýř", options: ["Kost jako u obratlovců", "Chitinový exoskelet – krunýř", "Skořápka jako u vajec", "Kůže jako u savců"], hints: ["Členovci mají vnější kostru místo vnitřní."] },
  { question: "Jak se hmyz množí?", correctAnswer: "Kladením vajíček – vajíčko → larva → kukla → dospělec", options: ["Rodí živá mláďata, podobně jako savci", "Množí se dělením celého těla na dvě části", "Kladením vajíček – vajíčko → larva → kukla → dospělec", "Množí se výtrusy, podobně jako houby"], hints: ["Proměna hmyzu = metamorfóza."] },
  { question: "Jakou funkci mají tykadla hmyzu?", correctAnswer: "Vnímání dotyku, vůní a prostředí kolem", options: ["Pomáhají hmyzu při létání", "Trávení přijaté potravy", "Dýchání vzduchu do plic", "Vnímání dotyku, vůní a prostředí kolem"], hints: ["Tykadla = smyslové orgány hmyzu."] },
  { question: "Proč jsou pavouci užiteční?", correctAnswer: "Loví hmyz a pomáhají regulovat jeho populace", options: ["Loví hmyz a pomáhají regulovat jeho populace", "Opylují rostliny jako včely", "Produkují med a vosk", "Kypří půdu jako žížaly"], hints: ["Pavouk tkající pavučinu = past na mouchy."] },
  { question: "Který z těchto živočichů patří mezi měkkýše?", correctAnswer: "Slimák", options: ["Stonožka", "Slimák", "Mnohonožka", "Chrobák"], hints: ["Tento měkkýš je vlastně šnek, ale bez ulity na zádech."] },
  { question: "Kde žijí mořští bezobratlí jako hvězdice a ježovka?", correctAnswer: "V mořích – patří mezi ostnokožce", options: ["V sladkovodních jezerech", "V půdě", "V mořích – patří mezi ostnokožce", "V tropických lesích na stromech"], hints: ["Ostnokožci mají ostny nebo jiné výrůstky."] },
  { question: "Co je larva hmyzu?", correctAnswer: "Vývojové stadium po vylíhnutí z vajíčka, před kuklou", options: ["Dospělý hmyz bez křídel", "Hmyz v zimním spánku", "Vejce připravené k vylíhnutí", "Vývojové stadium po vylíhnutí z vajíčka, před kuklou"], hints: ["Housenka = larva motýla."] },
  { question: "Jak přes zimu přežívá hmyz v mírném podnebí?", correctAnswer: "Hibernace – spánek , přezimování jako vajíčko, kukla nebo v úkrytu", options: ["Hibernace – spánek , přezimování jako vajíčko, kukla nebo v úkrytu", "Letí na jih jako stěhovaví ptáci", "Zrychluje metabolismus, aby se zahřál", "Umírá a přežívá jen jako vajíčko"], hints: ["Motýl monarcha migruje, ale většina hmyzu přes zimu upadá do klidového stavu v některém raném stadiu vývoje."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Proč se hmyz řadí mezi členovce?", correctAnswer: "Má členěné tělo (hlava, hruď, zadeček), vnější kostru – exoskelet a členěné končetiny – stejný plán stavby jako pavouci a korýši", options: ["Hmyz je prostě příliš malý na to, aby byl klasifikován úplně jinak", "Má členěné tělo (hlava, hruď, zadeček), vnější kostru – exoskelet a členěné končetiny – stejný plán stavby jako pavouci a korýši", "Hmyz se řadí mezi členovce jenom kvůli přesnému počtu jeho nohou", "Členovci jsou prostě všechny malé organismy vyskytující se v přírodě"], hints: ["Členovci = arthropoda. Arthros = kloub, pous = noha."] },
  { question: "Jak se liší úplná a neúplná proměna hmyzu?", correctAnswer: "Úplná (motýl, brouk): vajíčko → larva → kukla → dospělec (4 stadia). Neúplná (kobylka, šváb): vajíčko → nymfa → dospělec – 3 stadia bez kukly .", options: ["Úplná proměna má podle některých méně vývojových stadií než ta neúplná", "Naprosto všechen hmyz bez jediné výjimky prochází úplnou proměnou s kuklou", "Úplná (motýl, brouk): vajíčko → larva → kukla → dospělec (4 stadia). Neúplná (kobylka, šváb): vajíčko → nymfa → dospělec – 3 stadia bez kukly .", "Neúplná proměna má na rozdíl od úplné vlastní vývojové stadium kukly"], hints: ["Nymfa = nedospělá forma, podobná dospělci."] },
  { question: "Proč jsou včely klíčové pro zemědělství?", correctAnswer: "Opylují plodiny – přenášejí pyl z květu na květ, umožňují oplodnění a tvorbu plodů a semen", options: ["Produkují med, který je výživnou složkou pro rostliny", "Loví škůdce a chrání rostliny před poškozením", "Zpracovávají mrtvou hmotu a vracejí živiny do půdy", "Opylují plodiny – přenášejí pyl z květu na květ, umožňují oplodnění a tvorbu plodů a semen"], hints: ["Bez včel by nebyla jablka, třešně ani slunečnice."] },
  { question: "Jak pavouci loví kořist bez pohyblivých nohou jako hmyz?", correctAnswer: "Tvoří pavučiny z hedvábí – bílkoviny – kořist se chytí, pavouk ji otráví jedovatými chelicerami a stráví tekutými trávicími šťávami", options: ["Tvoří pavučiny z hedvábí – bílkoviny – kořist se chytí, pavouk ji otráví jedovatými chelicerami a stráví tekutými trávicími šťávami", "Pavouci loví kořist tak, že ji rychle uběhají díky osmi silným nohám", "Pavouci loví jen již mrtvý hmyz a živou kořist vůbec ulovit nedokážou", "Pavouci tvoří pavučiny jenom pro ochranu vajíček, nikdy ne pro lov"], hints: ["Chelicery = kusadla s jedovými žlázami."] },
  { question: "Proč jsou červi (žížaly) důležití pro zemědělce?", correctAnswer: "Kypří půdu, zlepšují její strukturu, aerují a rozkládají organiku – zvyšují plodnost půdy", options: ["Chrání kořeny rostlin před škůdci", "Kypří půdu, zlepšují její strukturu, aerují a rozkládají organiku – zvyšují plodnost půdy", "Produkují organická hnojiva přímo z nerostů", "Žížaly jsou zemědělcovým škůdcem – poškozují kořeny"], hints: ["Darwin věnoval 40 let výzkumu žížal a prohlásil je za nepostradatelné."] },
  { question: "Jak se liší pavouci od hmyzu v počtu tělesných částí?", correctAnswer: "Pavouci: 2 části (hlavohruď a zadeček). Hmyz: 3 části – hlava, hruď, zadeček . Pavouci: 8 noh. Hmyz: 6 noh.", options: ["Pavouci mají tři části těla, hmyz jen dvě — je to přesně naopak", "Obě skupiny mají shodně tři části a liší se jen počtem nohou", "Pavouci: 2 části (hlavohruď a zadeček). Hmyz: 3 části – hlava, hruď, zadeček . Pavouci: 8 noh. Hmyz: 6 noh.", "Pavouci mají tři části těla proto, že jsou celkově větší než hmyz"], hints: ["Jednoduché pravidlo: 6 noh = hmyz, 8 noh = pavouk."] },
  { question: "Proč jsou koráli (korálnatci) řazeni mezi bezobratlé živočichy, ačkoli vypadají jako kameny?", correctAnswer: "Korálové útesy tvoří malí živočichové – polypi s měkkými těly a vápenatými vnějšími schránkami – žijí v symbióze s řasami", options: ["Koráli jsou minerály vznikající chemickými procesy v mořské vodě", "Koráli jsou rostliny přizpůsobené životu pod vodou", "Koráli jsou houby filtrující vodu – bezobratlí nejsou", "Korálové útesy tvoří malí živočichové – polypi s měkkými těly a vápenatými vnějšími schránkami – žijí v symbióze s řasami"], hints: ["Polyp = malý mořský živočich budující korálový útes."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč by zmizení hmyzu mělo katastrofální dopad na Zemi?", correctAnswer: "Hmyz je základem potravních řetězců, opyluje 80 % rostlin, rozkládá organiku a je potravou pro ptáky, obojživelníky a savce. Bez hmyzu by se zhroutil ekosystém.", options: ["Hmyz je základem potravních řetězců, opyluje 80 % rostlin, rozkládá organiku a je potravou pro ptáky, obojživelníky a savce. Bez hmyzu by se zhroutil ekosystém.", "Zmizení hmyzu by bylo jen drobnou kosmetickou změnou, velcí savci by v klidu přežili", "Hmyz je prý jen škůdcem zemědělství, bez něj by rostliny naopak produkovaly víc", "Příroda by se prý bez hmyzu snadno přizpůsobila novým podmínkám během deseti let"], hints: ["Vědecké studie: světová biomasa hmyzu klesá o 2,5 % ročně."] },
  { question: "Jak vznikla pavučina evolučně jako lovecká strategie?", correctAnswer: "Pavuci vylučovali hedvábí původně pro ochranu vajíček. Postupně ho začali využívat i k zachycení kořisti – selekce upřednostnila jedince s efektivnějšími pastmi.", options: ["Pavučiny jsou prý čistě zabudované instinkty, bez jakéhokoli evolučního vývoje", "Pavuci vylučovali hedvábí původně pro ochranu vajíček. Postupně ho začali využívat i k zachycení kořisti – selekce upřednostnila jedince s efektivnějšími pastmi.", "Pavouci se naučili tkát pavučiny pozorováním a napodobováním starších pavouků kolem sebe", "Pavučiny vznikly původně jen jako vedlejší produkt trávení, evoluce je pak druhotně využila k lovu"], hints: ["Přírodní výběr = lepší pavučina → více potravy → více potomků → šíření genu."] },
  { question: "Proč je chitinový exoskelet hmyzu výhodou i nevýhodou zároveň?", correctAnswer: "Výhoda: ochrana, pevnost, voděodolnost. Nevýhoda: neumožňuje kontinuální růst – hmyz musí svlékat – ekdyze a v té době je zranitelný.", options: ["Exoskelet je podle některých pouze výhoda, chrání hmyz úplně bez nevýhod", "Exoskelet je podle některých jen nevýhoda, je těžký a omezuje pohyb hmyzu", "Výhoda: ochrana, pevnost, voděodolnost. Nevýhoda: neumožňuje kontinuální růst – hmyz musí svlékat – ekdyze a v té době je zranitelný.", "Chitin je prý toxický pro predátory, a proto je jen výhoda i nevýhoda zároveň"], hints: ["Svlékání = nebezpečné, tělo je měkké – proto se hmyz schovává."] },
  { question: "Proč jsou měkkýši (sépie, chobotnice) řazeni mezi nejinteligentnější bezobratlé?", correctAnswer: "Mají velký mozek relativně k tělu, krátkodobou i dlouhodobou paměť, dokáží řešit problémy a komunikovat barvami přes chromatofory v kůži.", options: ["Jsou největšími bezobratlými, proto jsou nejinteligentnější.", "Inteligence je u bezobratlých nemožná – mají příliš jednoduchý nervový systém.", "Chobotnice jsou inteligentní jen díky přizpůsobení na hluboký oceán.", "Mají velký mozek relativně k tělu, krátkodobou i dlouhodobou paměť, dokáží řešit problémy a komunikovat barvami přes chromatofory v kůži."], hints: ["Chobotnice otevírá lahve, hraje si a rozpoznává lidi."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const BEZOBRATLIHMYZPAVOUCIMEKKYSICERVI: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-bezobratli-hmyz-pavouci-mekkysi-cervi",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-bezobratli-hmyz-pavouci-mekkysi-cervi",
    title: "Bezobratlí - hmyz, pavouci, měkkýši, červi",
    studentTitle: "Bezobratlí",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Třídění organismů",
    briefDescription: "Poznáš skupiny bezobratlých živočichů a jejich znaky.",
    keywords: ["bezobratlí", "hmyz", "pavouci", "měkkýši", "červi", "exoskelet", "larva", "metamorfóza"],
    goals: ["Rozlišit hmyz, pavouky, měkkýše a červy podle základních znaků", "Popsat proměnu hmyzu", "Vysvětlit ekologický význam bezobratlých"],
    boundaries: ["Neprobírá fylogenetiku bezobratlých", "Neprobírá mořské bezobratlé do hloubky"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Hmyz: 6 noh, 3 části. Pavouk: 8 noh, 2 části. Měkkýši: měkké tělo. Červi: válcovité tělo bez noh.",
      steps: [
        "1. Hmyz: hlava + hruď + zadeček, 6 noh, tykadla.",
        "2. Pavouci: hlavohruď + zadeček, 8 noh, žádná tykadla.",
        "3. Měkkýši: šnek, slimák, mušle – měkké tělo.",
        "4. Červi: žížala – válcovité tělo bez noh.",
      ],
      commonMistake: "Pavouk NENÍ hmyz – má 8 noh a 2 části těla, ne 6 noh a 3 části.",
      example: "Motýl = hmyz (6 noh). Křižák = pavouk (8 noh). Šnek = měkkýš.",
    },
  },
];
