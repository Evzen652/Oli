import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-12 (inventura obsahu): dřív 11/10/10 unikátních úloh, chybné
// možnosti bez zpětné vazby (31 nálezů) a nápovědy bez gradace (26 nálezů).
// Teď tři oddělené banky ručně psaných úloh; každá má vlastní dvojici nápověd,
// vysvětlení PROČ a konkrétní zpětnou vazbu u každé chybné možnosti:
//   L1 rozpoznání — pojmenovat část rostliny, barvivo, plyn, pyl
//   L2 aplikace — funkce částí, pojmy (fotosyntéza, opylení, klíčení) a určení
//      části u běžné zeleniny (mrkev, salát, rajče, květák)
//   L3 transfer — dvoukrokové úvahy, důsledky zásahu a inverze (co bez světla,
//      cesta vody, přeříznutý stonek, pořadí dějů, proč se vozí včely do sadu)

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
    q: "Která část drží rostlinu pevně v půdě?",
    a: "Kořen",
    emoji: "🌱",
    d: [
      ["Stonek", "Stonek roste nad zemí a nese listy i květy. V půdě rostlinu nedrží."],
      ["List", "List roste na stonku nad zemí a vyrábí potravu. Do půdy vůbec nesahá."],
      ["Květ", "Květ je nahoře a láká hmyz. S upevněním rostliny nemá nic společného."],
    ],
    h: [
      "Hledej část, která roste pod zemí a rozrůstá se do stran.",
      "Představ si, jak taháš plevel ze záhonu: nejvíc se brání ta část, která je schovaná pod povrchem a bere s sebou hlínu. Ostatní části rostliny jsou nad zemí.",
    ],
    e: "Kořen prorůstá půdou a upevňuje rostlinu, aby ji vítr ani déšť nevyvrátily. Zároveň z půdy nasává vodu.",
  },
  {
    q: "Která část rostliny vyrábí pro rostlinu potravu?",
    a: "List",
    emoji: "🍃",
    d: [
      ["Kořen", "Kořen je pod zemí ve tmě. Bez světla potravu vyrobit nedokáže."],
      ["Stonek", "Stonek rostlinu nese a vede v ní vodu, potravu ale nevyrábí."],
      ["Plod", "Plod chrání semena. Potravu ze slunečního světla nevyrábí."],
    ],
    h: [
      "Potrava vzniká tam, kde je rostlina nejvíc zelená a kde se nastavuje slunci.",
      "Rostlina si potravu vyrábí ze slunečního světla. K tomu potřebuje zelené barvivo, kterého má nejvíc v plochých částech obrácených ke slunci — ne pod zemí a ne v barevném květu.",
    ],
    e: "Potravu (cukr) vyrábí list. Má nejvíc zeleného barviva, kterým zachytí sluneční světlo, a z vody a vzduchu vytvoří cukr.",
  },
  {
    q: "Jak se jmenuje zelené barvivo v listech?",
    a: "Chlorofyl",
    emoji: "🟢",
    d: [
      ["Fotosyntéza", "Fotosyntéza je děj — výroba cukru ze světla. Není to název barviva."],
      ["Kyslík", "Kyslík je plyn, který při výrobě cukru vzniká. Barvu listům nedává."],
      ["Pyl", "Pyl je žlutý prášek na tyčinkách v květu, ne barvivo v listech."],
    ],
    h: [
      "Hledáš jméno látky, ne název děje ani plynu.",
      "Jedna možnost je název děje, při kterém rostlina vyrábí cukr, druhá je plyn a třetí prášek z květu. Zbývá jediné slovo, které označuje látku dávající rostlině barvu.",
    ],
    e: "Zelené barvivo v listech se jmenuje chlorofyl. Zachycuje sluneční světlo, a díky tomu může list vyrábět cukr.",
  },
  {
    q: "Kterou částí bere rostlina vodu z půdy?",
    a: "Kořenem",
    emoji: "💧",
    d: [
      ["Listem", "List je nahoře na vzduchu. Vodu z půdy nabírat nemůže."],
      ["Květem", "Květ láká hmyz svou barvou a vůní, vodu z půdy ale nenasává."],
      ["Plodem", "Plod chrání semena. Vodu z půdy nenabírá."],
    ],
    h: [
      "Voda je v půdě — hledej část, která do ní sahá.",
      "Rostlina nemá ústa. Vodu s rozpuštěnými živinami nasává tenkými vlásky té části, která roste dolů do země a bohatě se tam rozvětvuje.",
    ],
    e: "Vodu i minerální látky nasává rostlina kořenem. Odtud putují stonkem vzhůru až do listů.",
  },
  {
    q: "Která část rostliny láká barvou a vůní včely a motýly?",
    a: "Květ",
    emoji: "🌸",
    d: [
      ["Kořen", "Kořen je schovaný pod zemí. Hmyz ho nevidí ani necítí."],
      ["Stonek", "Stonek je zelený a bez vůně, hmyz jím nepřilákáš."],
      ["List", "List je zelený a sladce nevoní. Hmyz na něj kvůli šťávě nesedá."],
    ],
    h: [
      "Je to ta nejnápadnější část rostliny, kterou trháme do vázy.",
      "Hmyz hledá sladkou šťávu. Rostlina proto jednu svou část udělá barevnou a voňavou, aby ji včela našla už z dálky — a včela jí za to při návštěvě pomůže.",
    ],
    e: "Květ láká barvou a vůní včely a motýly. Ti při návštěvě přenesou pyl, a rostlina pak může mít semena.",
  },
  {
    q: "Ve které části rostliny probíhá fotosyntéza?",
    a: "V listech",
    emoji: "☀️",
    d: [
      ["V kořeni", "Kořen je ve tmě pod zemí a zelené barvivo nemá."],
      ["V květu", "Květ bývá barevný, ale výrobu cukru na starost nemá."],
      ["V plodu", "Plod obaluje a chrání semena, cukr ze světla v něm nevzniká."],
    ],
    h: [
      "Fotosyntéza potřebuje zelené barvivo — kde ho má rostlina nejvíc?",
      "Zelené barvivo zachytává sluneční paprsky. Najdeš ho v těch částech, které jsou ploché, zelené a obrácené ke slunci — ne pod zemí, ne v barevném květu a ne v plodu.",
    ],
    e: "Fotosyntéza probíhá hlavně v listech, protože právě v nich je nejvíc chlorofylu, který zachytí sluneční světlo.",
  },
  {
    q: "Ze které části rostliny vzniknou po opylení semena?",
    a: "Z květu",
    emoji: "🌷",
    d: [
      ["Z kořene", "Kořen je pod zemí, hmyz k němu nepřiletí a semena v něm nevznikají."],
      ["Z listu", "List vyrábí cukr. Semena se v něm nezakládají."],
      ["Ze stonku", "Stonek vede vodu a nese ostatní části, semena netvoří."],
    ],
    h: [
      "Semena se zakládají tam, kde předtím sedal hmyz s pylem.",
      "Opylení se odehraje na té barevné a vonící části rostliny. Právě v ní se po přenesení pylu semena založí a teprve kolem nich potom vyroste plod.",
    ],
    e: "Po opylení vzniknou semena z květu a kolem nich vyroste plod. Bez květu by rostlina žádná semena neměla.",
  },
  {
    q: "Která část rostliny obaluje a chrání semena?",
    a: "Plod",
    emoji: "🍎",
    d: [
      ["Kořen", "Kořen drží rostlinu v půdě a nasává vodu. Semena v sobě nemá."],
      ["List", "List vyrábí cukr. Semena neobaluje ani nechrání."],
      ["Stonek", "Stonek nese listy a květy. Žádná semena v něm uložená nejsou."],
    ],
    h: [
      "Jablko, švestka nebo šípek — jak se takové části rostliny říká jedním slovem?",
      "Rozkroj jablko nebo rajče: semínka jsou schovaná uvnitř dužnaté části. Ta část je chrání a zvířata ji ráda jedí, takže jim pomůže dostat se i jinam.",
    ],
    e: "Semena chrání plod — třeba jablko nebo šípek. Když plod dozraje, semena se z něj uvolní a mohou vyklíčit.",
  },
  {
    q: "Jakou barvu mají zdravé listy?",
    a: "Zelenou",
    emoji: "🌿",
    d: [
      ["Hnědou", "Hnědne až suchý, odumřelý list, ve kterém už žádné barvivo nepracuje."],
      ["Červenou", "Červené bývají jen některé okrasné odrůdy. Běžný zdravý list červený není."],
      ["Modrou", "Modré listy v přírodě nenajdeš. Modrá se objevuje spíš u květů, třeba u chrpy."],
    ],
    h: [
      "Podívej se v létě na trávu nebo na korunu stromu.",
      "Barvu určuje barvivo, kterým rostlina zachytává sluneční světlo. Teprve když ho na podzim nebo ve tmě ubývá, listy žloutnou a nakonec hnědnou.",
    ],
    e: "Zdravé listy jsou zelené díky chlorofylu. Jakmile ho ubude — na podzim nebo ve tmě — list nejdřív zežloutne a pak zhnědne.",
  },
  {
    q: "Která část rostliny nese listy a květy a drží je nahoře?",
    a: "Stonek",
    emoji: "🌾",
    d: [
      ["Kořen", "Kořen roste dolů do půdy. Listy ani květy nenese."],
      ["List", "List sám na rostlině visí a je nesený. Ostatní části nedrží."],
      ["Semeno", "Ze semene teprve nová rostlina vyroste. Samo nic nenese."],
    ],
    h: [
      "Hledej část, která spojuje to, co je v zemi, s tím, co je nahoře na vzduchu.",
      "Voda musí z půdy vystoupat až k listům. Rostlina proto má jednu pevnou svislou část, která tvoří cestu vzhůru a zároveň drží listy a květy nad zemí, aby na ně svítilo slunce.",
    ],
    e: "Stonek drží rostlinu vzpřímenou, nese listy, květy i plody a zároveň jím proudí voda z kořene vzhůru.",
  },
  {
    q: "Jak se říká stonku u stromu?",
    a: "Kmen",
    emoji: "🌳",
    d: [
      ["Koruna", "Koruna je celý shluk větví a listů nahoře, ne ta hlavní nosná část."],
      ["Větev", "Větev vyrůstá až z hlavní nosné části a je mnohem tenčí."],
      ["Kůra", "Kůra je jen ochranný obal zvenčí, ne celá nosná část stromu."],
    ],
    h: [
      "Je to ta silná dřevěná část, kterou objímáš, když se opřeš o strom.",
      "U bylin je tahle část měkká a tenká, u stromu je tlustá, tvrdá a pokrytá kůrou. Právě ona sama unese celou korunu s větvemi a listy.",
    ],
    e: "Stonku stromu se říká kmen. Je zdřevnatělý a pevný, takže unese těžkou korunu, a vede vodu od kořenů až k listům.",
  },
  {
    q: "Co zasadíme do země, aby z toho vyrostla nová rostlina?",
    a: "Semeno",
    emoji: "🌰",
    d: [
      ["Květ", "Utržený květ do země nezasazujeme, nová rostlina z něj nevyroste."],
      ["Plod", "Plod je jen obal. Nová rostlina vyroste z toho, co je uvnitř něj."],
      ["List", "Utržený list v zemi uhnije. Celá nová rostlina z něj nevyroste."],
    ],
    h: [
      "Je to malá tvrdá věc, kterou najdeš uvnitř jablka nebo v lusku hrachu.",
      "V té drobné tvrdé věci spí zárodek nové rostliny. Když dostane vodu a teplo, probudí se, vyroste kořínek dolů a první lísteček nahoru.",
    ],
    e: "Do země zasadíme semeno. Uvnitř je ukrytý zárodek, který po zalití vyklíčí a vyroste z něj nová rostlina.",
  },
  {
    q: "Který plyn uvolňuje rostlina do vzduchu, když na světle vyrábí cukr?",
    a: "Kyslík",
    emoji: "🌬️",
    d: [
      ["Oxid uhličitý", "Oxid uhličitý si rostlina naopak ze vzduchu bere, aby z něj cukr vyrobila."],
      ["Vodní pára", "Vodní pára se z listů odpařuje, ale při výrobě cukru nevzniká."],
      ["Dusík", "Dusíku je ve vzduchu nejvíc, rostlina ho ale při výrobě cukru neuvolňuje."],
    ],
    h: [
      "Je to plyn, který lidé i zvířata potřebují při každém nádechu.",
      "Rostlina si ze světla, vody a vzduchu vyrobí cukr. Přitom jí jeden plyn zbude a vypustí ho ven — a právě ten my při dýchání z ovzduší bereme.",
    ],
    e: "Při fotosyntéze rostlina vyrobí cukr a jako vedlejší produkt vypustí kyslík. Proto rostliny pomáhají udržovat vzduch, který dýcháme.",
  },
  {
    q: "Jak se jmenuje žlutý prášek, který včely přenášejí z květu na květ?",
    a: "Pyl",
    emoji: "🐝",
    d: [
      ["Med", "Med vyrobí až včely v úlu z nasbírané šťávy. V květu ho nenajdeš."],
      ["Nektar", "Nektar je sladká šťáva, kterou květ nabízí. Žádný prášek to není."],
      ["Semeno", "Semeno vznikne v květu až potom. Na tyčinkách ho nenajdeš."],
    ],
    h: [
      "Bez něj by v květu nevzniklo žádné semeno.",
      "Vzniká na tyčinkách uprostřed květu a snadno se přichytí na chlupatém tělíčku včely. Když včela sedne na další květ, část ho tam setře.",
    ],
    e: "Žlutý prášek z tyčinek se jmenuje pyl. Včela ho přenese na další květ, tím ho opylí, a v květu pak může vzniknout semeno.",
  },
];

const L2: U[] = [
  {
    q: "Jaké dva úkoly plní kořen?",
    a: "Nasává vodu z půdy a upevňuje rostlinu",
    emoji: "🌱",
    d: [
      ["Vyrábí cukr a uvolňuje kyslík", "To je práce listu na světle. Kořen je ve tmě pod zemí."],
      ["Láká hmyz a tvoří semena", "To má na starost květ, ne podzemní část rostliny."],
      ["Chrání semena a roznáší je dál", "To je úkol plodu. Kořen žádná semena nemá."],
    ],
    h: [
      "Kořen roste pod zemí. Co odtud může brát a proč díky němu rostlina nespadne?",
      "Přemýšlej o dvou věcech zároveň: co rostlina z půdy potřebuje a proč ji vítr neporazí. Cukr ze světla vyrábí jiná část a hmyz láká zase jiná.",
    ],
    e: "Kořen má dva úkoly: drží rostlinu v půdě, aby ji vítr nevyvrátil, a nasává z půdy vodu i s minerálními látkami.",
  },
  {
    q: "Co dělá stonek?",
    a: "Vede vodu z kořene vzhůru a nese listy i květy",
    emoji: "🌾",
    d: [
      ["Vyrábí cukr ze slunečního světla", "Cukr vyrábějí listy, protože mají zelené barvivo."],
      ["Nasává vodu přímo z dešťových kapek", "Vodu bere rostlina z půdy kořenem, ne z deště stonkem."],
      ["Chrání semena schovaná uvnitř plodu", "Semena chrání plod. Stonek žádná semena nemá."],
    ],
    h: [
      "Představ si stonek jako trubku mezi zemí a vrškem rostliny.",
      "Rostlina musí dopravit vodu zdola nahoru a zároveň udržet své části nad zemí, aby na ně svítilo slunce. Hledej možnost, která popisuje obě tyhle věci najednou.",
    ],
    e: "Stonek je dopravní cesta i nosník. Vede vodu a živiny z kořene vzhůru a zároveň drží listy, květy a plody nad zemí.",
  },
  {
    q: "Proč jsou listy zelené?",
    a: "Mají v sobě chlorofyl, který zachycuje sluneční světlo",
    emoji: "🍃",
    d: [
      ["Protože v nich koluje zelená voda z půdy", "Voda z půdy je průhledná a barvu listům nedává."],
      ["Protože na nich celé léto sedá zelený hmyz", "Hmyz na listech jen odpočívá. Barvu jim nezpůsobí."],
      ["Protože jsou blíž slunci než ostatní části", "Blízkost slunce barvu nezpůsobí — zelené jsou i listy hluboko ve stínu."],
    ],
    h: [
      "Barvu způsobuje látka uvnitř listu, ne voda ani hmyz.",
      "Zelená barva není náhoda — souvisí s tím, co list dělá. Uvnitř listu je látka, která umí zachytit sluneční paprsky, a bez ní by list cukr nevyrobil.",
    ],
    e: "Listy jsou zelené díky chlorofylu. Ten zachycuje sluneční světlo, které rostlina potřebuje k výrobě cukru.",
  },
  {
    q: "Co je fotosyntéza?",
    a: "Výroba cukru v listu ze světla, vody a vzduchu",
    emoji: "☀️",
    d: [
      ["Nasávání vody kořenem z vlhké půdy", "To je přijímání vody, ne výroba potravy."],
      ["Rozkvétání poupat na jaře na zahradě", "Rozkvétání je otevření květu. S výrobou potravy nesouvisí."],
      ["Klíčení semene po zasetí do země", "Klíčení je začátek růstu ze semene, ne výroba potravy."],
    ],
    h: [
      "Foto znamená světlo. Co rostlina díky světlu v listu vytvoří?",
      "Rostlina nemá ústa, a přesto musí mít potravu. Vezme si tři věci — sluneční paprsky, vodu od kořene a plyn z ovzduší — a udělá z nich něco sladkého.",
    ],
    e: "Fotosyntéza je výroba cukru. List pomocí chlorofylu spojí sluneční světlo, vodu a oxid uhličitý ze vzduchu a vyrobí z nich cukr; přitom uvolní kyslík.",
  },
  {
    q: "K čemu rostlině slouží květ?",
    a: "Láká opylovače a po opylení v něm vznikají semena",
    emoji: "🌸",
    d: [
      ["Zachytává dešťovou vodu pro celou rostlinu", "Vodu bere rostlina kořenem z půdy, ne z deště."],
      ["Vyrábí místo listů cukr ze slunečního světla", "Cukr vyrábějí listy, které mají zelené barvivo."],
      ["Drží rostlinu pevně zakotvenou v půdě", "V půdě drží rostlinu kořen. Květ je nahoře nad zemí."],
    ],
    h: [
      "Zamysli se, proč jsou květy barevné a proč voní.",
      "Barva a vůně nejsou pro ozdobu — mají něco přilákat. A pak přemýšlej, co v téhle části rostliny vznikne poté, co ji navštíví včela.",
    ],
    e: "Květ svou barvou a vůní láká včely a motýly. Ti přenesou pyl, dojde k opylení a v květu pak vzniknou semena.",
  },
  {
    q: "Co je opylení?",
    a: "Přenesení pylu z jednoho květu na druhý",
    emoji: "🐝",
    d: [
      ["Rozkvetení poupěte časně na jaře", "Rozkvetení je jen otevření květu. Pyl se tím nepřenese."],
      ["Vyklíčení semene ve vlhké teplé půdě", "Klíčení je začátek růstu nové rostliny, ne přenos prášku z tyčinek."],
      ["Opadání okvětních lístků po odkvetení", "Opadání lístků přichází až potom. S přenosem z tyčinek to nesouvisí."],
    ],
    h: [
      "Pyl je žlutý prášek na tyčinkách. Co se s ním musí stát, aby vzniklo semeno?",
      "Samotné kvetení ani klíčení to není. Klíčové slovo je pohyb: něco se musí dostat z jedné rostliny na druhou a pomůže tomu hmyz nebo vítr.",
    ],
    e: "Opylení je přenesení pylu z tyčinek jednoho květu na pestík druhého. Postará se o to hmyz nebo vítr a teprve potom může vzniknout semeno.",
  },
  {
    q: "K čemu rostlině slouží plod?",
    a: "Chrání semena a pomáhá je roznést dál",
    emoji: "🍎",
    d: [
      ["Nasává pro rostlinu vodu z půdy", "Vodu z půdy nasává kořen, ne plod."],
      ["Vyrábí potravu pro kořen a stonek", "Potravu vyrábějí listy pomocí slunečního světla."],
      ["Láká hmyz, aby rostlinu opylil", "Hmyz láká květ. Plod vzniká až potom, co je rostlina opylená."],
    ],
    h: [
      "Rozkroj jablko: co je uvnitř a co to obaluje?",
      "Mysli na dvě věci najednou. První je ochrana toho, co je schované vevnitř. Druhá souvisí s tím, proč zvířata plody ráda jedí a kam se přitom dostanou.",
    ],
    e: "Plod semena chrání a zároveň pomáhá jejich šíření: zvíře plod sní a semena vyloučí jinde, javorové nažky odnese vítr.",
  },
  {
    q: "Odkud bere rostlina minerální látky?",
    a: "Z půdy — kořen je nasaje spolu s vodou",
    emoji: "🪨",
    d: [
      ["Ze vzduchu — listy je zachytí z větru", "Ze vzduchu bere list plyn, minerální látky v něm ale nejsou."],
      ["Ze slunce — přijdou spolu se světlem", "Světlo dodá energii. Žádné minerální látky v paprscích nejsou."],
      ["Z plodů rostlin, které rostou poblíž", "Rostlina se neživí cizími plody. Živiny bere ze země."],
    ],
    h: [
      "Minerální látky jsou rozpuštěné v půdní vodě.",
      "Jsou to drobné živiny promíchané ve vodě v zemi. Rostlina je proto nemůže brát ze vzduchu ani ze světla — musí je natáhnout tou částí, která sahá dolů.",
    ],
    e: "Minerální látky jsou rozpuštěné v půdní vodě. Kořen je nasaje spolu s vodou a stonek je dopraví až do listů.",
  },
  {
    q: "Co musí mít list, aby mohl dělat fotosyntézu?",
    a: "Světlo, vodu a oxid uhličitý",
    emoji: "🔆",
    d: [
      ["Tmu, chlad a suchou půdu", "Ve tmě fotosyntéza neprobíhá vůbec."],
      ["Jenom dešťovou vodu", "Voda sama nestačí. Bez slunce se cukr nevyrobí."],
      ["Jenom teplo a hlínu", "Teplo ani hlína nestačí. Chybí slunce a plyn z ovzduší."],
    ],
    h: [
      "Jmenuj tři dodavatele: slunce, kořen a ovzduší. Co od každého přijde?",
      "Rostlina potřebuje energii i suroviny. Energie přichází shora od slunce, jedna surovina zdola od kořene a druhá je plyn, který je všude kolem nás.",
    ],
    e: "Fotosyntéza má tři vstupy: světlo ze slunce, vodu od kořene a oxid uhličitý ze vzduchu. Z nich list vyrobí cukr a uvolní kyslík.",
  },
  {
    q: "Co je klíčení?",
    a: "Probuzení zárodku v semeni a začátek růstu rostliny",
    emoji: "🌱",
    d: [
      ["Přenesení pylu mezi dvěma květy na louce", "To je opylení, ne začátek růstu nové rostliny."],
      ["Výroba cukru v zelených listech na světle", "To je fotosyntéza. Se semenem nijak nesouvisí."],
      ["Opadávání listů ze stromů na podzim", "Opadávání listů je konec sezóny, ne začátek růstu."],
    ],
    h: [
      "Co se stane se semínkem fazole, které zaseješ a zaléváš?",
      "Ve fazoli spí drobná nová rostlina. Voda a teplo ji probudí a jako první vyroste kořínek dolů a lísteček nahoru. Není to ani opylení, ani výroba cukru.",
    ],
    e: "Klíčení je probuzení zárodku uvnitř semene. Když dostane vodu a teplo, vyroste z něj kořínek a první lístky — začíná nová rostlina.",
  },
  {
    q: "Mrkev, kterou jíme, je zesílená část rostliny. O kterou část jde?",
    a: "Kořen",
    emoji: "🥕",
    d: [
      ["Stonek", "Nať nad zemí je stonek s listy. Oranžová část ale roste pod zemí."],
      ["Plod", "Plod obaluje semena. Mrkev žádná semena uvnitř nemá."],
      ["Květ", "Květ mrkve je bílý okolík nahoře a ten se nejí."],
    ],
    h: [
      "Za co mrkev taháš, když ji sklízíš, a která její část do té chvíle byla v zemi?",
      "Rozděl mrkev na dvě části: zelená nať roste nad zemí, oranžová část pod zemí. Podzemní část, která nasává vodu a ukládá zásoby, má v rostlině své jméno.",
    ],
    e: "Oranžová mrkev je zesílený kořen, ve kterém má rostlina uložené zásoby. Nad zemí z ní vyrůstá nať — stonek s listy.",
  },
  {
    q: "Kterou část rostliny jíme u hlávkového salátu?",
    a: "Listy",
    emoji: "🥬",
    d: [
      ["Kořeny", "Kořeny salátu zůstávají v zemi a nejedí se."],
      ["Květy", "Salát vykvete, až když přeroste. Hlávka žádné květy nemá."],
      ["Plody", "Plod by musel obalovat semena. Hlávka salátu uvnitř žádná nemá."],
    ],
    h: [
      "Hlávka je natěsno složená z mnoha tenkých zelených plátů.",
      "Ty ploché zelené pláty jsou přesně ty části, kterými rostlina zachytává sluneční světlo a vyrábí cukr. U salátu jsou jen měkčí a nahloučené těsně u sebe.",
    ],
    e: "U hlávkového salátu jíme listy. Rostlina je má nahloučené do husté hlávky, ale jsou to tytéž části, kterými jiné rostliny zachytávají světlo.",
  },
  {
    q: "Podle čeho poznáme, že rajče je plod?",
    a: "Uvnitř má semínka",
    emoji: "🍅",
    d: [
      ["Roste na keři u země", "Na keři rostou i listy a květy. O plodu to nerozhodne."],
      ["Má červenou barvu", "Barva nerozhoduje — plody bývají i zelené nebo žluté."],
      ["Dá se jíst syrové", "Syrová se jí i mrkev, a ta plod není."],
    ],
    h: [
      "Vzpomeň si, co plod obaluje a chrání.",
      "O plodu nerozhoduje barva, chuť ani to, jestli ho kuchař řadí k zelenině. Rozhoduje jediná věc — co rostlina v téhle části schovává a chrání.",
    ],
    e: "Rajče je plod, protože v sobě chrání semínka. Právě to dělá plod plodem; barva ani chuť o tom nerozhodují.",
  },
  {
    q: "Kterou část rostliny jíme u květáku?",
    a: "Nerozvinuté květy",
    emoji: "🥦",
    d: [
      ["Zesílené kořeny", "Kořen květáku zůstává v zemi. Bílá růžice roste nad zemí."],
      ["Velké zelené listy", "Velké listy kolem růžice se zahazují. Jíme právě tu bílou růžici."],
      ["Plody se semeny", "Plod by musel mít uvnitř semena. Bílá růžice žádná nemá."],
    ],
    h: [
      "Bílá růžice je hustý shluk tisíců drobných pupenů, které se nestihly otevřít.",
      "Kdybys květák nechal na záhonu růst dál, růžice by se rozrostla do výšky a otevřela se do žlutých kvítků. Podle toho poznáš, co vlastně jíš.",
    ],
    e: "U květáku jíme nerozvinuté květy — hustou růžici poupat, která se ještě neotevřela. Kdyby zůstal na poli, rozkvetl by do žluta.",
  },
];

const L3: U[] = [
  {
    q: "Pokojová rostlina stojí několik týdnů v temném rohu. Co se s ní stane?",
    a: "Nedokáže vyrobit potravu, zežloutne a slábne",
    emoji: "🥀",
    d: [
      ["Poroste rychleji, protože šetří síly", "Ve tmě rostlina síly nešetří — chybí jí potrava, a proto slábne."],
      ["Přestane kořenem nasávat vodu", "Vodu nasává dál. Potíž je v tom, že bez slunce nevyrobí cukr."],
      ["Nic se nestane, stačí jí zálivka", "Zálivka nestačí. Bez slunečních paprsků nemá z čeho potravu vyrobit."],
    ],
    h: [
      "Světlo je jeden ze tří vstupů fotosyntézy. Co se stane, když chybí?",
      "Vodu i vzduch má rostlina dál, chybí jí jen třetí vstup. Bez něj list cukr nevyrobí, ubývá zelené barvivo a rostlina nemá z čeho žít.",
    ],
    e: "Bez světla nemůže list dělat fotosyntézu. Rostlina nemá potravu, chlorofyl se rozpadá, listy žloutnou a rostlina nakonec uhyne.",
  },
  {
    q: "Zasadíš fazoli do hlíny, zaléváš ji a je teplo. Co se stane jako první?",
    a: "Vyklíčí — vyroste kořínek a první lístky",
    emoji: "🌱",
    d: [
      ["Rovnou se z ní stane rozvitý květ", "Kvést může až vyrostlá rostlina, ne samotné semeno."],
      ["Hned vytvoří plod s novými semeny", "Plod vzniká až po kvetení a opylení, tedy úplně na konci."],
      ["Rozpustí se ve vodě a úplně zmizí", "Semeno se ve vodě nerozpouští. Voda ho naopak probudí."],
    ],
    h: [
      "Semeno vypadá neživě, ale uvnitř na vodu a teplo čeká zárodek.",
      "Seřaď si děje v životě rostliny podle času. Úplně na začátku je probuzení semene a první růst; kvetení i plody přijdou až mnohem později.",
    ],
    e: "Semeno nejdřív vyklíčí: vyroste kořínek dolů a první lístky nahoru. Teprve když rostlina vyroste, může kvést, být opylena a mít plody.",
  },
  {
    q: "Jak se voda z hlíny dostane až k listům na vrcholku rostliny?",
    a: "Kořen ji nasaje a stonek ji vede vzhůru",
    emoji: "💧",
    d: [
      ["List ji nasaje rovnou ze vzduchu", "Ze vzduchu bere list plyn, ne vodu pro celou rostlinu."],
      ["Květ ji nachytá z deště a pošle dolů", "Květ vodu nesbírá a cesta vody vede zdola nahoru, ne obráceně."],
      ["Plod ji vyrobí a rozvede po rostlině", "Plod vodu nevyrábí. Voda pochází ze země."],
    ],
    h: [
      "Na téhle cestě spolupracují dvě části: jedna vodu bere, druhá ji dopraví.",
      "Voda putuje zdola nahoru a musí urazit celou výšku rostliny. Začíná tam, kde je jí v zemi dost, a končí tam, kde se spotřebuje při výrobě cukru. Zbývá vymyslet, co je mezi tím.",
    ],
    e: "Voda putuje zdola nahoru: kořen ji nasaje z půdy i s minerálními látkami a stonek ji jako trubka vede až do listů.",
  },
  {
    q: "Proč rostliny pomáhají lidem a zvířatům dýchat?",
    a: "Při výrobě cukru vypouštějí do vzduchu kyslík",
    emoji: "🌬️",
    d: [
      ["Spotřebují ze vzduchu všechen kyslík", "To by dýchání naopak ztížilo. Rostlina tenhle plyn uvolňuje."],
      ["Z půdy vyrábějí čistou vodu k pití", "Vodu rostlina nevyrábí, jen ji z půdy bere."],
      ["Lákají hmyz, který pak čistí vzduch", "Hmyz vzduch nečistí. Pomáhá rostlinám s opylením."],
    ],
    h: [
      "Když rostlina na světle vyrábí cukr, jeden plyn jí zbyde a pustí ho ven.",
      "Zamysli se, co potřebuješ při každém nádechu. Rostlina tuhle látku sama nespotřebuje — naopak jí zbývá, když na slunci tvoří potravu, a uniká z listů do okolí.",
    ],
    e: "Při fotosyntéze rostlina vyrobí cukr a jako vedlejší produkt uvolní kyslík. Právě ten lidé i zvířata potřebují k dýchání.",
  },
  {
    q: "Co by se stalo, kdyby včely a další hmyz přestali navštěvovat květy?",
    a: "Nevznikla by semena ani plody",
    emoji: "🐝",
    d: [
      ["Rostliny by rostly rychleji", "Růst na hmyzu nezávisí. Chyběl by až pozdější krok."],
      ["Kořeny by přestaly nasávat vodu", "Nasávání vody z půdy s návštěvami hmyzu nesouvisí."],
      ["Listy by přestaly být zelené", "Barvu listů určuje světlo a barvivo, ne hmyz."],
    ],
    h: [
      "K čemu hmyz v květu pomůže a co z toho teprve potom vznikne?",
      "Hmyz roznáší pyl. Bez toho přenosu nedojde k opylení a v květu se nezaloží to, z čeho by mohla vyrůst další rostlina — a chybět bude i to, co to obaluje.",
    ],
    e: "Bez opylení by z květů nevznikla semena a bez semen ani plody. Proto jsou opylovači důležití pro přírodu i pro naši úrodu.",
  },
  {
    q: "Semeno javoru má křidélka. K čemu jsou rostlině dobrá?",
    a: "Vítr s nimi odnese semeno dál od stromu",
    emoji: "🍁",
    d: [
      ["Přitahují včely k opylení květu", "Opylení proběhlo dřív. Hotové semeno už opylovače nepotřebuje."],
      ["Vyrábějí cukr místo zelených listů", "Křidélka nejsou zelená a cukr vyrábět neumějí."],
      ["Nasávají pro semeno vodu ze vzduchu", "Vodu bere rostlina kořenem z půdy, ne křidélky ze vzduchu."],
    ],
    h: [
      "Křidélka se ve vzduchu roztočí jako vrtulka. Co to se semenem udělá?",
      "Zamysli se, proč by nová rostlinka neměla vyklíčit hned pod mateřským stromem. Ve stínu koruny a mezi jeho kořeny by neměla dost světla ani místa.",
    ],
    e: "Křidélka roztočí vítr a odnese semeno daleko od mateřského stromu. Nová rostlinka tak vyroste tam, kde má víc světla i prostoru.",
  },
  {
    q: "Která věta o částech rostliny je správná?",
    a: "Cukr vyrábí list, vodu z půdy bere kořen",
    emoji: "🧠",
    d: [
      ["Cukr vyrábí kořen, vodu z půdy bere list", "Je to obráceně — kořen je ve tmě a cukr vyrobit nedokáže."],
      ["Cukr i vodu si obstará sám květ", "Květ láká opylovače. Cukr ani vodu pro rostlinu neobstarává."],
      ["Cukr vyrábí plod, vodu bere list ze vzduchu", "Obě části jsou prohozené: cukr dělá list a vodu bere kořen ze země."],
    ],
    h: [
      "Vzpomeň si, kde je zelené barvivo a která část sahá do hlíny.",
      "Projdi každou větu po dvou krocích: nejdřív ověř, kdo dělá cukr, potom kdo bere vodu. Stačí, aby jeden z těch dvou údajů neseděl, a celá věta je špatně.",
    ],
    e: "Cukr vyrábí list — má chlorofyl a je na světle. Kořen cukr nevyrábí, zato nasává z půdy vodu a minerální látky. Nejčastější chyba je prohodit úkoly listu a kořene.",
  },
  {
    q: "Proč rostlině prospěje, když zvíře sní její šťavnatý plod?",
    a: "Semena vyloučí jinde, kde mohou vyklíčit",
    emoji: "🦔",
    d: [
      ["Zvíře tím semena zničí a rostlin nepřibude", "Tvrdá semena projdou trávením nepoškozená. Rostlině to prospěje."],
      ["Zvíře tím přenese pyl mezi dvěma květy", "Pyl mezi květy přenáší hmyz, ne zvíře, které sní plod."],
      ["Zvíře tím rostlině dodá světlo na cukr", "Světlo dává jen slunce. Zvíře ho rostlině dodat nemůže."],
    ],
    h: [
      "Co se stane se semínky, která zvíře spolkne i s dužinou?",
      "Zvíře se po jídle přemístí někam jinam. Semínka z plodu jsou tvrdá a projdou trávením bez úhony — a pak se dostanou na zem daleko od původní rostliny.",
    ],
    e: "Zvíře sní dužnatý plod, odejde jinam a tvrdá semena vyloučí i s hnojivem. Semena tak vyklíčí daleko od mateřské rostliny a nekonkurují jí.",
  },
  {
    q: "Pokojová rostlina na parapetu se všemi listy naklání ke sklu. Proč?",
    a: "Roste za světlem, které potřebuje k fotosyntéze",
    emoji: "🪟",
    d: [
      ["Utíká před vodou, které má v květináči moc", "Přebytek vody v květináči rostlina nakláněním nevyřeší."],
      ["U okna hledá víc oxidu uhličitého k pití", "Oxidu uhličitého je v místnosti všude stejně a nepije se."],
      ["Snaží se dostat co nejblíž ke svému kořeni", "Kořen je dole v květináči. Naklánět se k němu nahoře nelze."],
    ],
    h: [
      "Čeho je u okna víc než v rohu místnosti?",
      "Rostlina se nehýbe rychle, ale roste tam, kde má nejlepší podmínky. Zjisti, který ze tří vstupů fotosyntézy je u okna ve větším množství než uvnitř pokoje.",
    ],
    e: "Rostlina roste směrem ke světlu, protože ho potřebuje k fotosyntéze. Proto se listy natáčejí k oknu, kde je ho nejvíc.",
  },
  {
    q: "V jakém pořadí jdou za sebou děje v životě rostliny?",
    a: "Klíčení, růst, kvetení, opylení, plod se semeny",
    emoji: "🔄",
    d: [
      ["Kvetení, klíčení, opylení, růst, plod", "Klíčení musí být první — rostlina nejdřív vzejde ze semene."],
      ["Opylení, klíčení, plod, kvetení, růst", "Opylení nemůže být první, potřebuje už rozvinutý květ."],
      ["Plod, kvetení, klíčení, opylení, růst", "Plod je až výsledek celé cesty, nemůže stát na začátku."],
    ],
    h: [
      "Začni tím, co udělá zaseté semínko, a skonči novými semeny.",
      "Zkontroluj dvě věci. Za prvé: rostlina musí nejdřív vzejít a vyrůst, než může kvést. Za druhé: semena mohou vzniknout až potom, co hmyz přenese pyl.",
    ],
    e: "Rostlina nejdřív vyklíčí, vyroste a pak vykvete. Květ je opylen a teprve potom vznikne plod s novými semeny — a koloběh může začít znovu.",
  },
  {
    q: "Zahradník přeřízl u pokojové rostliny stonek. Co se stane s listy nad řezem?",
    a: "Uvadnou, protože k nim přestane proudit voda",
    emoji: "✂️",
    d: [
      ["Zezelenají víc, protože ušetří sílu", "Přerušením cesty vody rostlina sílu nešetří, naopak strádá."],
      ["Nic se nezmění, vodu berou ze vzduchu", "Ze vzduchu si listy vodu nenaberou. Voda pochází z půdy."],
      ["Začnou samy nasávat vodu kořínky", "Listy žádné kořínky nemají a vodu z půdy nasát nedokážou."],
    ],
    h: [
      "Kudy voda k listům putovala a co se stane, když je cesta přerušená?",
      "Do horní části rostliny se voda nedostane jinudy než stonkem. Zamysli se, jak dlouho vydrží listy, které nemají odkud brát vodu, a přitom se z nich voda dál odpařuje.",
    ],
    e: "Stonek je jediná cesta vody z kořene k listům. Když ji přerušíš, listům nad řezem přestane voda přitékat, a proto brzy uvadnou.",
  },
  {
    q: "Tráva pod prknem, které týden leželo na trávníku, je žlutá. Proč?",
    a: "Neměla světlo, a tak v ní ubylo zeleného barviva",
    emoji: "🟨",
    d: [
      ["Prkno ji shora spálilo velkým horkem", "Prkno naopak stínilo a chladilo. O spálení nejde."],
      ["Nedostala se k ní ranní rosa ani déšť", "Půda pod prknem zůstala vlhká. Rozhodlo něco jiného."],
      ["Její kořeny prkno svou váhou rozdrtilo", "Kořeny zůstaly v půdě celé. Zežloutly nadzemní části."],
    ],
    h: [
      "Co prkno trávě zaclonilo a co jí kvůli tomu chybělo?",
      "Barvivo v listech vzniká a udrží se jen tam, kam dopadají sluneční paprsky. Pod prknem žádné nebyly, a tráva tak přišla o to, co jí barvu dává.",
    ],
    e: "Bez slunce se v trávě rozpadl chlorofyl a nový nevznikl, proto zežloutla. Když prkno odklidíš, za pár dní se zelená barva vrátí.",
  },
  {
    q: "Proč sadaři vozí do kvetoucích sadů úly se včelami?",
    a: "Včely opylí květy, a proto se urodí víc jablek",
    emoji: "🍏",
    d: [
      ["Včely v sadu hubí škůdce na listech", "Škůdce včely neloví. Sbírají nektar a pyl."],
      ["Včely dodávají stromům vodu z úlu", "Vodu stromům dodává půda přes kořeny, ne včely."],
      ["Včely uklidí ze stromů odkvetlé květy", "Odkvetlé okvětní lístky opadají samy. Včely neuklízejí."],
    ],
    h: [
      "Bez čeho by z květu nikdy nevznikl plod?",
      "Jablko je plod a plod vznikne jen z květu, do kterého se dostal pyl z jiného květu. Zamysli se, kdo tenhle přenos v sadu zvládne nejrychleji, když kvetou tisíce stromů naráz.",
    ],
    e: "Včely přenášejí pyl z květu na květ. Čím víc květů je opyleno, tím víc se z nich vyvine jablek — proto sadaři úly do sadu přivezou právě v době květu.",
  },
];

function gen(level: number): PracticeTask[] {
  const bank = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(bank).map(uloha);
}

export const STAVBAROSTLIN: TopicMetadata[] = [
  {
    id: "g3-prvouka-rozmanitost-prirody-rostliny-a-zivocichove-stavba-rostlin-koren-stonek-list-kvet-plod",
    title: "Stavba rostlin",
    studentTitle: "Části rostliny",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Rostliny a živočichové",
    briefDescription: "Znáš části rostliny a jejich funkce.",
    illustrationDesc:
      "velká kvetoucí rostlina s kořenem, stonkem, listy, květem a plodem — každá část je vidět, vedle stojí dítě s prstem namířeným na květ",
    keywords: [
      "kořen",
      "stonek",
      "kmen",
      "list",
      "květ",
      "plod",
      "semeno",
      "chlorofyl",
      "fotosyntéza",
      "opylení",
      "klíčení",
      "části rostliny",
      "stavba rostliny",
      "kyslík",
      "minerální látky",
    ],
    goals: [
      "Pojmenovat základní části rostliny: kořen, stonek, list, květ, plod, semeno.",
      "Vysvětlit funkci každé části rostliny.",
      "Popsat fotosyntézu jako výrobu cukru ze světla, vody a CO₂.",
      "Vysvětlit, co je opylení a proč je důležité.",
      "Popsat klíčení semene.",
    ],
    boundaries: [
      "Základní pojmy pro 3. třídu — bez buněčné biologie ani chemických rovnic.",
      "Fotosyntéza jen jako jednoduchá představa (světlo + voda + CO₂ → cukr + kyslík), bez stechiometrie.",
      "Opylení jen základně — bez podrobné botanické anatomie.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Rostlina má 6 hlavních částí: kořen (přijímá vodu z půdy), stonek (vede vodu nahoru), list (vyrábí potravu fotosyntézou), květ (opylení → semena), plod (chrání semena), semeno (klíčení).",
      steps: [
        "Kořen — pod zemí, nasává vodu a minerální látky, upevňuje rostlinu.",
        "Stonek — vede vodu a živiny z kořene do listů.",
        "List — zelený díky chlorofylu, dělá fotosyntézu (světlo + voda + CO₂ → cukr + kyslík).",
        "Květ — přitahuje hmyz, po opylení vznikají semena.",
        "Plod — chrání semena a pomáhá jejich šíření.",
        "Semeno — zárodek nové rostliny, klíčí, když dostane vodu a teplo.",
      ],
      commonMistake:
        "Záměna: fotosyntéza probíhá v LISTECH (ne v kořeni). Kořen přijímá vodu, ale nevyrábí cukr. Chlorofyl je v listech, ne v plodech.",
      example:
        "Jabloň: kořen nasaje vodu → stonek ji dovede do listů → listy fotosyntézou vyrobí cukr → květ přitáhne včelu → opylení → vznikne jablko (plod) se semeny uvnitř.",
    },
  },
];
