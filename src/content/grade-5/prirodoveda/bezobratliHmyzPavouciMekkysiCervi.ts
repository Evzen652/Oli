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
  { question: "Na kolik částí je rozděleno tělo hmyzu?", correctAnswer: "3 části – hlava, hruď, zadeček", options: ["3 části – hlava, hruď, zadeček", "2 části – hlavohruď, zadeček", "4 části", "1 celek"], hints: ["Pavouk má jen 2 části těla."] },
  { question: "Kolik noh mají pavouci?", correctAnswer: "8 noh", options: ["8 noh", "6 noh", "10 noh", "4 nohy"], hints: ["Proto pavouci nejsou hmyz."] },
  { question: "Do jaké skupiny patří šnek zahradní?", correctAnswer: "Měkkýši", options: ["Měkkýši", "Hmyz", "Červi", "Pavoukovci"], hints: ["Má měkké tělo bez kostí."] },
  { question: "Co je charakteristické pro žížalu?", correctAnswer: "Protáhlé válcovité tělo bez noh, žije v půdě", options: ["Protáhlé válcovité tělo bez noh, žije v půdě", "Má 6 noh a létá", "Má tvrdý krunýř", "Je to druh hmyzu s měkkým tělem"], hints: ["Žížala kypří půdu."] },
  { question: "Jak se jmenuje tvrdý obal (vnější kostra) hmyzu?", correctAnswer: "Chitinový exoskelet – krunýř", options: ["Chitinový exoskelet – krunýř", "Kost", "Skořápka", "Kůže"], hints: ["Členovci mají vnější kostru místo vnitřní."] },
  { question: "Jak se hmyz množí?", correctAnswer: "Kladením vajíček – vajíčko → larva → kukla → dospělec", options: ["Kladením vajíček – vajíčko → larva → kukla → dospělec", "Živé mláďata jako savci", "Dělením těla na dvě části", "Výtrusy jako houby"], hints: ["Proměna hmyzu = metamorfóza."] },
  { question: "Jakou funkci mají tykadla hmyzu?", correctAnswer: "Vnímání dotyku, vůní a prostředí kolem", options: ["Vnímání dotyku, vůní a prostředí kolem", "Létání", "Trávení potravy", "Dýchání vzduchu"], hints: ["Tykadla = smyslové orgány hmyzu."] },
  { question: "Proč jsou pavouci užiteční?", correctAnswer: "Loví hmyz a pomáhají regulovat jeho populace", options: ["Loví hmyz a pomáhají regulovat jeho populace", "Opylují rostliny jako včely", "Produkují med a vosk", "Kypří půdu jako žížaly"], hints: ["Pavouk tkající pavučinu = past na mouchy."] },
  { question: "Který z těchto živočichů patří mezi měkkýše?", correctAnswer: "Slimák", options: ["Slimák", "Stonožka", "Mnohonožka", "Chrobák"], hints: ["Slimák je šnek bez ulity."] },
  { question: "Kde žijí mořští bezobratlí jako hvězdice a ježovka?", correctAnswer: "V mořích – patří mezi ostnokožce", options: ["V mořích – patří mezi ostnokožce", "V sladkovodních jezerech", "V půdě", "V tropických lesích na stromech"], hints: ["Ostnokožci mají ostny nebo jiné výrůstky."] },
  { question: "Co je larva hmyzu?", correctAnswer: "Vývojové stadium po vylíhnutí z vajíčka, před kuklou", options: ["Vývojové stadium po vylíhnutí z vajíčka, před kuklou", "Dospělý hmyz bez křídel", "Hmyz v zimním spánku", "Vejce připravené k vylíhnutí"], hints: ["Housenka = larva motýla."] },
  { question: "Jak přes zimu přežívá hmyz v mírném podnebí?", correctAnswer: "Hibernace – spánek , přezimování jako vajíčko, kukla nebo v úkrytu", options: ["Hibernace – spánek , přezimování jako vajíčko, kukla nebo v úkrytu", "Letí na jih jako stěhovaví ptáci", "Zrychluje metabolismus, aby se zahřál", "Umírá a přežívá jen jako vajíčko"], hints: ["Motýl monarcha migruje, ale většina hmyzu hibernuje nebo zimuje jako vajíčko."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Proč se hmyz řadí mezi členovce?", correctAnswer: "Má členěné tělo (hlava, hruď, zadeček), vnější kostru – exoskelet a členěné končetiny – stejný plán stavby jako pavouci a korýši", options: ["Má členěné tělo (hlava, hruď, zadeček), vnější kostru – exoskelet a členěné končetiny – stejný plán stavby jako pavouci a korýši", "Hmyz je příliš malý, aby byl klasifikován jinak", "Hmyz se řadí mezi členovce jen kvůli počtu noh", "Členovci = všechny malé organismy v přírodě"], hints: ["Členovci = arthropoda. Arthros = kloub, pous = noha."] },
  { question: "Jak se liší úplná a neúplná proměna hmyzu?", correctAnswer: "Úplná (motýl, brouk): vajíčko → larva → kukla → dospělec (4 stadia). Neúplná (kobylka, šváb): vajíčko → nymfa → dospělec – 3 stadia bez kukly .", options: ["Úplná (motýl, brouk): vajíčko → larva → kukla → dospělec (4 stadia). Neúplná (kobylka, šváb): vajíčko → nymfa → dospělec – 3 stadia bez kukly .", "Úplná proměna má méně stadií než neúplná", "Všechen hmyz prochází úplnou proměnou s kuklou", "Neúplná proměna má kuklu, úplná ne"], hints: ["Nymfa = nedospělá forma, podobná dospělci."] },
  { question: "Proč jsou včely klíčové pro zemědělství?", correctAnswer: "Opylují plodiny – přenášejí pyl z květu na květ, umožňují oplodnění a tvorbu plodů a semen", options: ["Opylují plodiny – přenášejí pyl z květu na květ, umožňují oplodnění a tvorbu plodů a semen", "Produkují med, který je výživnou složkou pro rostliny", "Loví škůdce a chrání rostliny před poškozením", "Zpracovávají mrtvou hmotu a vracejí živiny do půdy"], hints: ["Bez včel by nebyla jablka, třešně ani slunečnice."] },
  { question: "Jak pavouci loví kořist bez pohyblivých nohou jako hmyz?", correctAnswer: "Tvoří pavučiny z hedvábí – bílkoviny – kořist se chytí, pavouk ji otráví jedovatými chelicerami a stráví tekutými trávicími šťávami", options: ["Tvoří pavučiny z hedvábí – bílkoviny – kořist se chytí, pavouk ji otráví jedovatými chelicerami a stráví tekutými trávicími šťávami", "Pavouci loví kořist rychlým během díky 8 nohám", "Pavouci loví jen mrtvý hmyz – nemohou ulovit živý", "Pavouci tvoří pavučiny jen pro ochranu, ne pro lov"], hints: ["Chelicery = kusadla s jedovými žlázami."] },
  { question: "Proč jsou červi (žížaly) důležití pro zemědělce?", correctAnswer: "Kypří půdu, zlepšují její strukturu, aerují a rozkládají organiku – zvyšují plodnost půdy", options: ["Kypří půdu, zlepšují její strukturu, aerují a rozkládají organiku – zvyšují plodnost půdy", "Chrání kořeny rostlin před škůdci", "Produkují organická hnojiva přímo z nerostů", "Žížaly jsou zemědělcovým škůdcem – poškozují kořeny"], hints: ["Darwin věnoval 40 let výzkumu žížal a prohlásil je za nepostradatelné."] },
  { question: "Jak se liší pavouci od hmyzu v počtu tělesných částí?", correctAnswer: "Pavouci: 2 části (hlavohruď a zadeček). Hmyz: 3 části – hlava, hruď, zadeček . Pavouci: 8 noh. Hmyz: 6 noh.", options: ["Pavouci: 2 části (hlavohruď a zadeček). Hmyz: 3 části – hlava, hruď, zadeček . Pavouci: 8 noh. Hmyz: 6 noh.", "Pavouci: 3 části, hmyz: 2 části – opak", "Obě skupiny mají 3 části a liší se jen počtem noh", "Pavouci mají 3 části, protože jsou větší než hmyz"], hints: ["Jednoduché pravidlo: 6 noh = hmyz, 8 noh = pavouk."] },
  { question: "Proč jsou koráli (korálnatci) řazeni mezi bezobratlé živočichy, ačkoli vypadají jako kameny?", correctAnswer: "Korálové útesy tvoří malí živočichové – polypi s měkkými těly a vápenatými vnějšími schránkami – žijí v symbióze s řasami", options: ["Korálové útesy tvoří malí živočichové – polypi s měkkými těly a vápenatými vnějšími schránkami – žijí v symbióze s řasami", "Koráli jsou minerály vznikající chemickými procesy v mořské vodě", "Koráli jsou rostliny přizpůsobené životu pod vodou", "Koráli jsou houby filtrující vodu – bezobratlí nejsou"], hints: ["Polyp = malý mořský živočich budující korálový útes."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč by zmizení hmyzu mělo katastrofální dopad na Zemi?", correctAnswer: "Hmyz je základem potravních řetězců, opyluje 80 % rostlin, rozkládá organiku a je potravou pro ptáky, obojživelníky a savce. Bez hmyzu by se zhroutil ekosystém.", options: ["Hmyz je základem potravních řetězců, opyluje 80 % rostlin, rozkládá organiku a je potravou pro ptáky, obojživelníky a savce. Bez hmyzu by se zhroutil ekosystém.", "Zmizení hmyzu by bylo jen kosmetickou změnou – velcí savci by přežili.", "Hmyz je škůdcem zemědělství – bez něj by rostliny produkovaly více.", "Bez hmyzu by se příroda přizpůsobila do 10 let."], hints: ["Vědecké studie: světová biomasa hmyzu klesá o 2,5 % ročně."] },
  { question: "Jak vznikla pavučina evolučně jako lovecká strategie?", correctAnswer: "Pavuci vylučovali hedvábí původně pro ochranu vajíček. Postupně ho začali využívat i k zachycení kořisti – selekce upřednostnila jedince s efektivnějšími pastmi.", options: ["Pavuci vylučovali hedvábí původně pro ochranu vajíček. Postupně ho začali využívat i k zachycení kořisti – selekce upřednostnila jedince s efektivnějšími pastmi.", "Pavučiny jsou zabudované instinkty bez evolučního vývoje.", "Pavuci se naučili tkát pavučiny od jiných pavouků napodobováním.", "Pavučiny vznikly jako vedlejší produkt trávení – evoluce je pak využila k lovu."], hints: ["Přírodní výběr = lepší pavučina → více potravy → více potomků → šíření genu."] },
  { question: "Proč je chitinový exoskelet hmyzu výhodou i nevýhodou zároveň?", correctAnswer: "Výhoda: ochrana, pevnost, voděodolnost. Nevýhoda: neumožňuje kontinuální růst – hmyz musí svlékat – ekdyze a v té době je zranitelný.", options: ["Výhoda: ochrana, pevnost, voděodolnost. Nevýhoda: neumožňuje kontinuální růst – hmyz musí svlékat – ekdyze a v té době je zranitelný.", "Exoskelet je pouze výhoda – chrání hmyz bez nevýhod.", "Exoskelet je nevýhoda – je těžký a omezuje pohyb hmyzu.", "Chitin je toxický pro predátory – proto je výhoda i nevýhoda."], hints: ["Svlékání = nebezpečné, tělo je měkké – proto se hmyz schovává."] },
  { question: "Proč jsou měkkýši (sépie, chobotnice) řazeni mezi nejinteligentnější bezobratlé?", correctAnswer: "Mají velký mozek relativně k tělu, krátkodobou i dlouhodobou paměť, dokáží řešit problémy a komunikovat barvami přes chromatofory v kůži.", options: ["Mají velký mozek relativně k tělu, krátkodobou i dlouhodobou paměť, dokáží řešit problémy a komunikovat barvami přes chromatofory v kůži.", "Jsou největšími bezobratlými, proto jsou nejinteligentnější.", "Inteligence je u bezobratlých nemožná – mají příliš jednoduchý nervový systém.", "Chobotnice jsou inteligentní jen díky přizpůsobení na hluboký oceán."], hints: ["Chobotnice otevírá lahve, hraje si a rozpoznává lidi."] },
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
