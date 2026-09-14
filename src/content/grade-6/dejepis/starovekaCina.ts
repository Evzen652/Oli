/**
 * Dějepis 6. ročník — Starověká Čína: dynastie, Velká čínská zeď, vynálezy (select_one).
 *
 * Faktické téma → tři disjunktní banky (POOL_L1/L2/L3), každá položka má vlastní
 * znění, vlastní dvojici nápověd a vlastní vysvětlení.
 *
 * Chybový model (každý distraktor = jedna typická chyba):
 *  • záměna dynastií Čchin × Chan (sjednocení a zeď × papír a Hedvábná stezka);
 *  • přenos z Mezopotámie a Egypta — Nil, Eufrat, papyrus, hliněné tabulky, faraon;
 *  • anachronismus — střelný prach, knihtisk, papír za prvního císaře, cihlová zeď s věžemi (Ming, 15.–16. stol.);
 *  • záměna účelu — zeď jako protipovodňová hráz nebo hranice s Indií.
 *
 *  • L1 — zapamatování: přímá otázka → jeden pojem.
 *  • L2 — použití: jev ↔ dynastie, pořadí událostí, dvojice, tvrzení, století
 *    (dynastie jako možnosti jen 2×; distraktory z čínského kontextu, ne sady z L1).
 *  • L3 — analýza: příčina, důsledek, relační chronologie, anachronismus.
 *
 * Sporné údaje se nepoužívají jako klíč: přesné datace Šang a Čou, kompas,
 * porcelán, střelný prach (ten jen jako distraktor-anachronismus), mýtus
 * „zeď je vidět z vesmíru“. Jediný pevný letopočet: 221 př. n. l.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, type Distractor } from "./_shared";
import { ruzneUlohy } from "../fyzika/_shared";

interface Polozka {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

const EGYPT = "To patří starověkému Egyptu, ne Číně.";
const MEZO = "To patří Mezopotámii, ne Číně.";
const DYN = (d: string) => `Dynastie ${d}`;

// ── L1 — ZAPAMATOVÁNÍ: přímá otázka → pojem ─────────────────────────────────
export const POOL_L1: Polozka[] = [
  {
    q: "U které řeky vznikly první čínské státy?",
    correct: "Chuang-che",
    distractors: [
      { value: "Nil", why: `${EGYPT} Nil protéká severovýchodní Afrikou.` },
      { value: "Eufrat a Tigris", why: `${MEZO} Mezi Eufratem a Tigridem leží Mezopotámie v Přední Asii.` },
      { value: "Ganga", why: "Ganga protéká Indií. První čínské státy vznikly u řeky na severu Číny." },
    ],
    hints: [
      "Vyřaď nejdřív řeky, které tečou v Africe, v Přední Asii nebo v Indii.",
      "Hledáš řeku na severu dnešní Číny. Nese tolik jemné žluté půdy, že podle její barvy dostala druhé, české jméno. Ostatní řeky v nabídce patří k jiným starověkým civilizacím.",
    ],
    explanation: "Čínská civilizace vznikla u řeky Chuang-che, které se česky říká Žlutá řeka. Nese úrodné žluté bahno, a tak se kolem ní dalo pěstovat obilí a proso. Nil patří Egyptu, Eufrat a Tigris Mezopotámii, Ganga Indii.",
  },
  {
    q: "Kdo se stal prvním císařem sjednocené Číny?",
    correct: "Čchin Š'-chuang-ti",
    distractors: [
      { value: "Konfucius", why: "Konfucius byl učitel a myslitel. Nikdy nevládl a žil dřív, než vznikla sjednocená říše." },
      { value: "Cchaj Lun", why: "Cchaj Lun byl úředník, který zdokonalil výrobu papíru. Císařem nebyl." },
      { value: "Faraon Tutanchamon", why: `${EGYPT} Tutanchamon byl egyptský faraon.` },
    ],
    hints: [
      "Hledáš vládce, ne učitele ani vynálezce. Který z nich zemi opravdu ovládl?",
      "Myslitel a úředník v nabídce nikdy nevládli a jeden z vládců patří jiné zemi v Africe. První čínský císař nesl ve jméně název svého rodu, podle kterého se jmenuje i celá dynastie.",
    ],
    explanation: "Prvním císařem byl Čchin Š'-chuang-ti z rodu Čchin. Roku 221 př. n. l. sjednotil soupeřící státy do jedné říše. Konfucius byl učitel, Cchaj Lun úředník a Tutanchamon egyptský faraon.",
  },
  {
    q: "Z čeho se vyrábělo hedvábí?",
    correct: "Z kokonů housenky bource morušového",
    distractors: [
      { value: "Z vláken ze stonků lnu", why: "Ze lnu se tkalo plátno, například v Egyptě. Hedvábí vzniká z vláken, která spřádá housenka." },
      { value: "Z vlny ovcí a koz", why: "Z vlny se dělají teplé látky. Hedvábí má původ u drobné housenky, ne u zvířat na pastvě." },
      { value: "Z vláken z kůry moruše a bambusu", why: "Z rozvlákněné kůry se vyráběl papír. Listy moruše jen jedí housenky, které hedvábná vlákna spřádají." },
    ],
    hints: [
      "Hedvábí nevzniká z rostliny ani ze srsti. Vzpomeň si, které drobné zvíře spřádá tenké vlákno.",
      "Housenka jistého motýla se před proměnou zabalí do obalu z jediného dlouhého vlákna. Číňané ty obaly vařili a vlákno odmotávali. Rostlinná vlákna a srst tedy vyřaď.",
    ],
    explanation: "Hedvábí se vyrábí z vláken, která spřádá housenka bource morušového do svého kokonu. Kokony se povaří a vlákno se odmotá. Kůra se používala na papír a len na plátno.",
  },
  {
    q: "Před čím měla Velká čínská zeď zemi chránit?",
    correct: "Před kočovníky ze severu",
    distractors: [
      { value: "Před záplavami Žluté řeky", why: "Proti záplavám se stavěly hráze u řeky. Zeď vede přes hory a stepi na severu, daleko od koryta." },
      { value: "Před vojsky z Indie", why: "Indie leží na jihozápadě za horami. Zeď se táhne podél severní hranice Číny." },
      { value: "Před piráty z moře", why: "Zeď nevede podél pobřeží, ale vnitrozemím na severu. Chránila před jezdci ze stepí." },
    ],
    hints: [
      "Zjisti, kudy zeď vede. Leží u moře, u řeky, nebo na severní hranici?",
      "Zeď se táhne horami a stepmi podél severního okraje Číny, daleko od moře, od řeky i od Indie. Zamysli se, jací lidé v severních stepích žili a jak se tam živili.",
    ],
    explanation: "Velká čínská zeď měla bránit nájezdům kočovníků ze severních stepí. Kočovníci na koních přepadali čínské vesnice, a proto vládci stavěli a spojovali valy na severní hranici.",
  },
  {
    q: "Jaký materiál k psaní vynalezli Číňané?",
    correct: "Papír",
    distractors: [
      { value: "Papyrus", why: `${EGYPT} Papyrus se vyráběl ze stonků rostliny u Nilu.` },
      { value: "Pergamen", why: "Pergamen se vyráběl ze zvířecí kůže a rozšířil se v jiných zemích, ne v Číně." },
      { value: "Hliněné tabulky", why: `${MEZO} Do hliněných tabulek se vtlačovalo klínové písmo.` },
    ],
    hints: [
      "Pozor na podobně znějící slova. Který materiál vznikl právě v Číně, ne v Egyptě nebo v Mezopotámii?",
      "Jeden materiál z nabídky se dělal z rostliny u Nilu, jeden ze zvířecí kůže a jeden z hlíny. Čínský vynález se vyráběl z rozvlákněné kůry, konopí a hadrů a používáme ho dodnes.",
    ],
    explanation: "Číňané vynalezli papír. Vyráběl se z rozvlákněné kůry, konopí a hadrů a byl lehčí než bambus a levnější než hedvábí. Papyrus patří Egyptu a hliněné tabulky Mezopotámii.",
  },
  {
    q: "Jak se jmenovala obchodní cesta, po které putovalo čínské zboží na západ?",
    correct: "Hedvábná stezka",
    distractors: [
      { value: "Jantarová stezka", why: "Jantarová stezka vedla Evropou od Baltského moře na jih. S Čínou neměla nic společného." },
      { value: "Kadidlová stezka", why: "Kadidlová stezka vedla Arábií, kudy se vozilo vonné kadidlo. Čínské zboží šlo jinudy." },
      { value: "Via Appia", why: "Via Appia byla římská silnice v Itálii. Čínské zboží putovalo přes Střední Asii." },
    ],
    hints: [
      "Každá taková cesta se jmenuje podle zboží, které se po ní nejvíc vozilo. Co Čína vyvážela?",
      "Jantar se vozil od Baltu a kadidlo z Arábie. Nejslavnější čínské zboží byla drahá lesklá látka, za kterou kupci na západě platili zlatem, a podle ní dostala jméno i cesta.",
    ],
    explanation: "Cesta se jmenovala Hedvábná stezka, podle nejcennějšího čínského zboží. Vedla přes Střední Asii až ke Středozemnímu moři. Jantarová a Kadidlová stezka patří Evropě a Arábii.",
  },
  {
    q: "Na čem se dochovaly nejstarší čínské nápisy?",
    correct: "Na věštebných kostech",
    distractors: [
      { value: "Na hliněných tabulkách", why: `${MEZO} Do hliněných tabulek psali Sumerové klínovým písmem.` },
      { value: "Na papyrových svitcích", why: `${EGYPT} Na papyrus psali egyptští písaři.` },
      { value: "Na papírových knihách", why: "Papír Číňané zdokonalili až mnohem později, za dynastie Chan. Nejstarší nápisy jsou starší." },
    ],
    hints: [
      "Nejstarší nápisy jsou starší než papír. Na co mohli lidé psát ještě dřív?",
      "Věštci se ptali předků a bohů na budoucnost. Materiál ze zvířat zahřívali, dokud nepraskl, a otázku do něj pak vyryli. Hlína a papyrus patří jiným civilizacím, papír je mladší.",
    ],
    explanation: "Nejstarší čínské nápisy jsou na věštebných kostech a želvích krunýřích z doby dynastie Šang. Věštci je zahřívali, podle prasklin vykládali odpověď předků a bohů a otázku pak do kosti vyryli. Hliněné tabulky patří Mezopotámii, papyrus Egyptu.",
  },
  {
    q: "Kdo byl Konfucius?",
    correct: "Učitel a myslitel",
    distractors: [
      { value: "První císař Číny", why: "Prvním císařem byl Čchin Š'-chuang-ti. Konfucius nikdy nevládl a žil dřív." },
      { value: "Vynálezce papíru", why: "Výrobu papíru zdokonalil úředník Cchaj Lun, mnohem později než žil Konfucius." },
      { value: "Velitel stavby zdi", why: "Spojování zdi nechal provést první císař. Konfucius vojsko ani stavby nevedl." },
    ],
    hints: [
      "Konfucius je známý svými slovy a radami, ne stavbou ani vládou. Čím se tedy zabýval?",
      "Jeho žáci si zapisovali, co říkal o úctě k rodičům, o poslušnosti a o dobrém vládnutí. Takový člověk nevede vojsko, nevynalézá materiály a nesedí na trůnu.",
    ],
    explanation: "Konfucius byl učitel a myslitel z doby dynastie Čou. Učil úctě k rodičům a předkům, poslušnosti a spravedlivé vládě. Jeho učení ovlivňovalo Čínu celá staletí.",
  },
  {
    q: "Co našli archeologové u hrobu prvního čínského císaře?",
    correct: "Tisíce hliněných vojáků",
    distractors: [
      { value: "Obrovskou pyramidu z kamene", why: `${EGYPT} Kamenné pyramidy stavěli faraoni jako své hrobky.` },
      { value: "Zlatou pohřební masku", why: `${EGYPT} Zlatou maskou je proslulý hrob faraona Tutanchamona.` },
      { value: "Hliněné tabulky se zákony", why: `${MEZO} Zákony se tesaly a psaly v Babylonii, například Chammurapiho zákoník.` },
    ],
    hints: [
      "Vyřaď nálezy, které znáš z Egypta a z Mezopotámie.",
      "Pyramida a zlatá maska patří egyptským faraonům a zákony na tabulkách Babylonii. Čínský císař si přál mít i po smrti ochranu. Kdo panovníka obvykle chrání?",
    ],
    explanation: "U hrobu prvního císaře Čchin Š'-chuang-tiho našli archeologové tisíce vojáků z pálené hlíny v životní velikosti. Říká se jim terakotová armáda a měli císaře chránit i po smrti.",
  },
  {
    q: "Jak se jmenuje stavba dlouhá tisíce kilometrů na severní hranici říše prvního císaře?",
    correct: "Velká zeď",
    distractors: [
      { value: "Hadriánův val", why: "Hadriánův val postavili Římané v Británii, daleko od Číny a mnohem později." },
      { value: "Babylonské hradby", why: `${MEZO} Hradby chránily město Babylon, ne hranici celé říše.` },
      { value: "Limes Romanus", why: "Limes Romanus byla opevněná hranice Římské říše v Evropě, ne v Číně." },
    ],
    hints: [
      "Vzpomeň si, kde která stavba stojí. Hledáš stavbu v Číně, ne v Římské říši ani v Mezopotámii.",
      "Val v Británii a limes postavili Římané na hranicích své říše a hradby chránily jedno město v Mezopotámii. Čínská stavba se táhne přes hory a stepi a vládci ji během staletí prodlužovali a opravovali.",
    ],
    explanation: "Severní hranici říše bránila Velká zeď, u nás známá jako Velká čínská zeď. První císař spojil starší valy do jedné dlouhé linie proti kočovníkům. Hadriánův val a Limes Romanus patří Římanům, hradby Babylonu Mezopotámii.",
  },
  {
    q: "Kterou vzácnou látku vyráběli Číňané a kupci ze západu za ni platili zlatem?",
    correct: "Hedvábí",
    distractors: [
      { value: "Bavlnu", why: "Bavlna se pěstovala hlavně v Indii. Nejdražší čínskou látkou bylo něco jiného." },
      { value: "Len", why: `${EGYPT} Lněné plátno nosili hlavně Egypťané.` },
      { value: "Ovčí vlnu", why: "Vlnu uměli zpracovat v mnoha zemích, a tak by za ni nikdo neplatil zlatem. Vzácná byla látka, jejíž výrobu znali jen Číňané." },
    ],
    hints: [
      "Vzácné je to, co umí vyrobit jen jedna země. Kterou z látek neuměl vyrobit nikdo jiný?",
      "Bavlnu, len i vlnu znali v mnoha zemích. Čínská látka byla lehká a lesklá a vlákno na ni spřádala housenka. Její výrobu Číňané dlouho tajili, proto byla tak drahá.",
    ],
    explanation: "Číňané vyráběli hedvábí, lehkou lesklou látku z vláken bource morušového. Výrobu dlouho tajili, a proto kupci ze západu platili za hedvábí zlatem.",
  },
  {
    q: "Jak se jmenoval čínský úředník, který zdokonalil výrobu papíru?",
    correct: "Cchaj Lun",
    distractors: [
      { value: "Konfucius", why: "Konfucius byl učitel a myslitel. S výrobou papíru nemá nic společného a žil mnohem dřív." },
      { value: "Čchin Š'-chuang-ti", why: "Čchin Š'-chuang-ti byl první císař. Sjednotil říši, papír ale zdokonalil až pozdější úředník." },
      { value: "Champollion", why: `Champollion byl francouzský vědec, který rozluštil egyptské hieroglyfy. Čínský papír s ním nesouvisí.` },
    ],
    hints: [
      "Hledáš úředníka, ne učitele, císaře ani vědce z Evropy.",
      "Jeden muž v nabídce vládl, jeden učil a jeden luštil písmo o mnoho staletí později ve Francii. Zbude dvorní úředník z doby dynastie Chan, který zlepšil postup výroby z kůry a hadrů.",
    ],
    explanation: "Výrobu papíru zdokonalil úředník Cchaj Lun kolem roku 105 n. l., za dynastie Chan. Konfucius byl myslitel, Čchin Š'-chuang-ti první císař a Champollion rozluštil hieroglyfy.",
  },
  {
    q: "Jaký titul měl panovník, který vládl celé sjednocené Číně?",
    correct: "Císař",
    distractors: [
      { value: "Faraon", why: `${EGYPT} Faraon byl titul egyptského panovníka.` },
      { value: "Rádža", why: "Rádža byl titul vládců v Indii. Čínský panovník sjednocené říše nesl jiný titul." },
      { value: "Konzul", why: "Konzul byl nejvyšší úředník Římské republiky, ne čínský panovník." },
    ],
    hints: [
      "Vyřaď tituly, které používaly jiné země: Egypt, Indie a Řím.",
      "Faraon patří Egyptu, rádža Indii a konzul Římu. Vládce, který spojil soupeřící čínské státy v jednu říši, přijal nový titul, který stojí výš než král.",
    ],
    explanation: "Vládce sjednocené Číny nesl titul císař. Poprvé ho přijal Čchin Š'-chuang-ti, když roku 221 př. n. l. spojil soupeřící státy. Faraon patří Egyptu, rádža Indii a konzul Římu.",
  },
  {
    q: "Čím Číňané psali své znaky?",
    correct: "Štětcem a tuší",
    distractors: [
      { value: "Rákosovým rydlem do hlíny", why: `${MEZO} Rydlem se vtlačovalo klínové písmo do měkké hlíny.` },
      { value: "Husím brkem a inkoustem", why: "Husím brkem se psalo ve středověké Evropě. Číňané používali jiný nástroj." },
      { value: "Dlátem do kamenných desek", why: "Tesat do kamene se dá, ale na běžné psaní je to pomalé. Čínské znaky se malovaly." },
    ],
    hints: [
      "Čínské znaky mají tahy různé tloušťky, jako by byly malované. Jaký nástroj takové tahy udělá?",
      "Rydlo do hlíny patří Mezopotámii, brk středověké Evropě a dláto kameníkům. Čínský písař tahy nevtlačoval ani netesal. Namáčel měkký nástroj z chlupů do černé barvy.",
    ],
    explanation: "Číňané psali znaky štětcem namočeným v tuši, proto mají jejich tahy různou tloušťku. Rydlo do hlíny používali v Mezopotámii a husí brk ve středověké Evropě.",
  },
  {
    q: "Jak se jmenoval čínský myslitel, který učil úctě k rodičům a předkům?",
    correct: "Konfucius",
    distractors: [
      { value: "Buddha", why: "Buddha učil v Indii, jak se zbavit utrpení. Čínský myslitel úcty k předkům se jmenoval jinak." },
      { value: "Sókratés", why: "Sókratés byl řecký filozof z Athén, ne čínský myslitel." },
      { value: "Cchaj Lun", why: "Cchaj Lun byl úředník, který zdokonalil papír. Učitelem mravů nebyl." },
    ],
    hints: [
      "Vyřaď myslitele z jiných zemí a muže, který nic neučil.",
      "Jeden myslitel z nabídky učil v Indii a jeden v Řecku. Třetí muž byl úředník, který zlepšil jeden vynález. Čínský učitel žil za dynastie Čou a jeho žáci sepsali jeho výroky.",
    ],
    explanation: "Úctě k rodičům a předkům učil Konfucius. Žil v době dynastie Čou a jeho učení o pořádku ve státě a v rodině ovlivňovalo Čínu po staletí. Buddha učil v Indii a Sókratés v Řecku.",
  },
];

// ── L2 — POUŽITÍ: přiřazení jevu k dynastii, pořadí, dvojice, popis → pojem ──
// Formáty se střídají (dynastie jen 2×): událost ↔ dynastie, seřazení, dvojice,
// tvrzení, století. Distraktory jsou z čínského kontextu (záměna Čchin × Chan,
// před × po sjednocení), ne opakování sad z L1.
const CHAN_PO = "Chanové vládli až po Čchinech;";
export const POOL_L2: Polozka[] = [
  {
    q: "„Císař nařídil, aby se v celé říši používaly stejné míry, váhy, peníze a písmo.“ Za které dynastie se to stalo?",
    correct: DYN("Čchin"),
    distractors: [
      { value: DYN("Chan"), why: `${CHAN_PO} sjednocení mír, vah a písma provedl první císař z rodu Čchin.` },
      { value: DYN("Čou"), why: "Na konci vlády dynastie Čou se země rozpadla na soupeřící státy a každý měl vlastní míry. Sjednocení přišlo až s prvním císařem." },
      { value: DYN("Šang"), why: "Šangové vládli mnohem dřív a jen části severní Číny. Celou říši sjednotil až první císař." },
    ],
    hints: [
      "Sjednotit míry a písmo v celé říši mohl jen ten, kdo celou říši ovládl. Kdo to byl poprvé?",
      "Dokud byla Čína rozdělená na soupeřící státy, měl každý stát své míry a peníze. Změnu nařídil vládce, který státy spojil a jako první přijal titul císaře. Jeho rod dal jméno dynastii.",
    ],
    explanation: "Míry, váhy, peníze a písmo sjednotil první císař Čchin Š'-chuang-ti z dynastie Čchin. Po roce 221 př. n. l. chtěl, aby celá říše fungovala podle jednoho pořádku.",
  },
  {
    q: "„Věštci zahřívali kosti a želví krunýře, až praskly. Podle prasklin vykládali odpověď předků a bohů a otázku pak do kosti vyryli.“ Ze které dynastie tyto nejstarší nápisy pocházejí?",
    correct: DYN("Šang"),
    distractors: [
      { value: DYN("Čou"), why: "Dynastie Čou vládla až po této dynastii. Nejstarší nápisy na kostech jsou starší." },
      { value: DYN("Chan"), why: "Za Chanů už Číňané psali na papír a hedvábí. Věštebné kosti jsou o mnoho staletí starší." },
      { value: DYN("Čchin"), why: "Za Čchinů se písmo sjednocovalo, ale nejstarší nápisy vznikly dávno předtím." },
    ],
    hints: [
      "Jde o nejstarší čínské nápisy. Která ze čtyř dynastií je nejstarší?",
      "Seřaď si dynastie v duchu od nejstarší: nejdřív rod, za kterého se věštilo z kostí, pak rod, za kterého žil Konfucius, pak první císař a nakonec rod Hedvábné stezky.",
    ],
    explanation: "Věštebné kosti s nejstarším čínským písmem pocházejí z doby dynastie Šang, nejstarší doložené čínské dynastie. Věštci se pomocí nich ptali předků a bohů na úrodu, válku nebo počasí.",
  },
  {
    q: "Které tvrzení o Hedvábné stezce je správné?",
    correct: "Obchod po ní začal za dynastie Chan",
    distractors: [
      { value: "Obchod po ní začal za prvního císaře Čchin", why: "Čchinové vládli jen krátce a soustředili se na sjednocení říše. Cesty na západ otevřela až dynastie Chan, která přišla po nich." },
      { value: "Hedvábí se po ní vozilo ze západu do Číny", why: "Je to obráceně. Hedvábí vyráběli Číňané a vozili ho na západ, kde za ně kupci platili zlatem." },
      { value: "Vedla podél Žluté řeky k moři na východě", why: "Stezka vedla z Číny na západ přes pouště a hory Střední Asie, ne k moři na východě." },
    ],
    hints: [
      "U každého tvrzení se ptej, kdo hedvábí vyráběl a kterým směrem žili kupci, kteří za něj platili.",
      "Kupci, kteří hedvábí kupovali, žili daleko na západě, třeba v Římské říši. Obchod na tak dlouhé cestě potřeboval velkou a klidnou říši, která vydržela dlouho. Vzpomeň si, jak dlouho vládl rod prvního císaře.",
    ],
    explanation: "Obchod po Hedvábné stezce začal za dynastie Chan, která po krátké vládě Čchinů udržela velkou a klidnou říši. Hedvábí putovalo z Číny přes Střední Asii na západ až do Římské říše.",
  },
  {
    q: "Konfucius žil za dynastie Čou, která vládla před prvním císařem. Co se za této dynastie stalo?",
    correct: "Země se rozpadla na soupeřící státy",
    distractors: [
      { value: "Úředník Cchaj Lun zdokonalil papír", why: "Cchaj Lun žil až za dynastie Chan, dlouho po prvním císaři. Do doby před sjednocením nepatří." },
      { value: "Starší valy se spojily do jedné zdi", why: "Valy spojil až první císař, když ovládl celou říši. Dřív si každý stát stavěl svůj val." },
      { value: "Říše začala psát jednotným písmem", why: "Písmo sjednotil až první císař po roce 221 př. n. l. Předtím měl každý stát své znaky." },
    ],
    hints: [
      "Zadání říká, že dynastie vládla před prvním císařem. Které možnosti se tedy musely stát až za něj nebo po něm?",
      "Vyřaď všechno, co provedl sám první císař, a všechno, co přišlo až po něm. Zbude jev, který sjednocení předcházel a který první císař svým tažením ukončil.",
    ],
    explanation: "Za dynastie Čou žil Konfucius. V pozdější části její vlády se Čína rozpadla na soupeřící státy, které spolu dlouho válčily. Spojil je až první císař z rodu Čchin roku 221 př. n. l.",
  },
  {
    q: "Co z nabídky nechal provést první císař z dynastie Čchin?",
    correct: "Propojit starší valy na severu do jedné zdi",
    distractors: [
      { value: "Zdokonalit výrobu papíru z kůry a hadrů", why: "Výrobu papíru zdokonalil úředník Cchaj Lun až za dynastie Chan, dlouho po smrti prvního císaře." },
      { value: "Vypravit karavany s hedvábím do Říma", why: "Obchod po Hedvábné stezce začal až za dynastie Chan, která nastoupila po Čchinech." },
      { value: "Postavit cihlovou zeď se strážními věžemi", why: "Zeď z cihel a kamene s věžemi, kterou známe z fotek, postavili až za dynastie Ming, o více než tisíc let později. Za prvního císaře se stavělo většinou z udusané (pěchované) hlíny." },
    ],
    hints: [
      "Dvě možnosti svádějí k záměně rodů Čchin a Chan. Který z nich vládl jen krátce a sjednotil říši?",
      "U každé možnosti se ptej, jestli ji znáš z doby prvního císaře, nebo až z pozdějších dynastií. U zdi si navíc vzpomeň, jestli podoba z fotek je starověká, nebo pozdější přestavba.",
    ],
    explanation: "První císař z dynastie Čchin dal po sjednocení říše propojit starší valy bývalých států na severu do jedné linie proti kočovníkům. Zeď byla tehdy většinou z udusané hlíny. Papír a obchod s Římem patří až dynastii Chan.",
  },
  {
    q: "Která možnost řadí události starověké Číny správně od nejstarší po nejmladší?",
    correct: "Věštebné kosti → Konfucius → sjednocení říše → papír Cchaj Luna",
    distractors: [
      { value: "Věštebné kosti → sjednocení říše → Konfucius → papír Cchaj Luna", why: "Konfucius žil za dynastie Čou, tedy ještě před sjednocením říše prvním císařem." },
      { value: "Konfucius → věštebné kosti → sjednocení říše → papír Cchaj Luna", why: "Věštebné kosti jsou z doby dynastie Šang, starší než Konfucius, který žil až za Čou." },
      { value: "Věštebné kosti → Konfucius → papír Cchaj Luna → sjednocení říše", why: "Cchaj Lun zdokonalil papír za dynastie Chan, která nastoupila až po sjednocení říše." },
    ],
    hints: [
      "Ke každé události si přiřaď dynastii a teprve potom dynastie seřaď.",
      "Nejdřív urči, které události patří k dynastiím před prvním císařem a která až po něm. Pak u dvou starších rozhodni, ve které době se ještě věštilo a ve které už žil slavný učitel.",
    ],
    explanation: "Věštebné kosti pocházejí z doby dynastie Šang. Za dynastie Čou žil Konfucius. Roku 221 př. n. l. sjednotil říši první císař z rodu Čchin a papír zdokonalil Cchaj Lun až za dynastie Chan, kolem roku 105 n. l.",
  },
  {
    q: "Který člověk je správně přiřazený k dynastii, za které žil?",
    correct: "Konfucius – dynastie Čou",
    distractors: [
      { value: "Konfucius – dynastie Chan", why: "Za dynastie Chan se Konfuciovo učení šířilo po celé říši, ale sám Konfucius žil mnohem dřív, za dynastie Čou." },
      { value: "Cchaj Lun – dynastie Čchin", why: "Čchin a Chan znějí podobně. Cchaj Lun ale zdokonalil papír až za dynastie Chan, kolem roku 105 n. l." },
      { value: "První císař – dynastie Chan", why: "První císař pocházel z rodu Čchin, podle kterého se dynastie jmenuje. Chanové vládli až po něm." },
    ],
    hints: [
      "U každého člověka rozhodni, jestli žil před sjednocením říše, nebo až po něm.",
      "Pozor na podobně znějící rody Čchin a Chan: jeden patří sjednotiteli říše, druhý jeho nástupcům. Učitel mravů žil v době, kdy ještě žádný císař nevládl.",
    ],
    explanation: "Konfucius žil za dynastie Čou, v době před sjednocením. Cchaj Lun patří k dynastii Chan a první císař k rodu Čchin. Za Chanů se Konfuciovo učení stalo učením státu.",
  },
  {
    q: "Který nález nebo událost je správně přiřazená k dynastii?",
    correct: "Terakotová armáda – dynastie Čchin",
    distractors: [
      { value: "Věštebné kosti – dynastie Čou", why: "Nejstarší nápisy na věštebných kostech pocházejí z doby dynastie Šang, která vládla před Čou." },
      { value: "Hedvábná stezka – dynastie Čchin", why: "Obchod po Hedvábné stezce začal až za dynastie Chan. Čchinové vládli jen krátce." },
      { value: "Sjednocení písma – dynastie Chan", why: "Písmo sjednotil první císař z dynastie Čchin. Chanové už jednotné písmo převzali." },
    ],
    hints: [
      "U každé dvojice se ptej, jestli ten nález nebo událost znáš z doby prvního císaře, nebo z jiné dynastie.",
      "Rozlišuj, co udělal sjednotitel říše, co bylo před ním a co až po něm. Nejstarší nápisy jsou starší než Konfucius a obchod se západem potřeboval dlouhou a klidnou vládu.",
    ],
    explanation: "Terakotová armáda hlídá hrob prvního císaře z dynastie Čchin. Věštebné kosti patří dynastii Šang, sjednocení písma dynastii Čchin a Hedvábná stezka dynastii Chan.",
  },
  {
    q: "„U hrobu vládce stojí v podzemních jámách tisíce vojáků v životní velikosti a každý má jinou tvář.“ Jak se tento nález nazývá a z čeho jsou vojáci?",
    correct: "Terakotová armáda z pálené hlíny",
    distractors: [
      { value: "Bronzová armáda z odlévaného kovu", why: "V hrobě se sice našly i bronzové vozy s koňmi, ale tisíce vojáků jsou z pálené hlíny." },
      { value: "Kamenná armáda z tesaného kamene", why: "Z kamene tesali velké sochy například Egypťané. Čínští vojáci se modelovali z hlíny a pálili v pecích." },
      { value: "Dřevěná armáda z vyřezávaného dřeva", why: "Dřevo by se v zemi za dva tisíce let rozpadlo. Vojáci jsou z pálené hlíny, a proto se zachovali." },
    ],
    hints: [
      "Z jakého materiálu vojáci jsou a jak se ten materiál odborně nazývá?",
      "Vzpomeň si, co archeologové našli u hrobu prvního císaře. Kov se odlévá, kámen tesá a dřevo vyřezává. Který materiál se hodí na tisíce soch, které vydržely v zemi přes dva tisíce let?",
    ],
    explanation: "Nález se nazývá terakotová armáda. Terakota je pálená hlína: vojáky modelovali z hlíny, pálili v pecích a malovali. Stojí u hrobu prvního císaře a měli ho chránit i po smrti.",
  },
  {
    q: "„Z rozvlákněné kůry, konopí a starých hadrů se vyráběly tenké listy, na které se dalo psát.“ Kdo a za které dynastie výrobu tohoto materiálu zdokonalil?",
    correct: "Cchaj Lun za dynastie Chan",
    distractors: [
      { value: "Cchaj Lun za dynastie Čchin", why: "Cchaj Lun je správně, dynastie ne. Čchin a Chan znějí podobně, papír ale zdokonalil až za dynastie Chan, po prvním císaři." },
      { value: "První císař za dynastie Čchin", why: "První císař sjednotil říši, míry a písmo. Papír se k psaní za jeho vlády ještě nepoužíval." },
      { value: "Konfucius za dynastie Čou", why: "Konfucius byl učitel a myslitel. Za jeho doby se psalo na bambusové destičky a hedvábí." },
    ],
    hints: [
      "Nejdřív urči, jaký materiál popis líčí. Pak si vzpomeň, kdo ho zlepšil.",
      "Muž, kterého hledáš, nebyl vládce ani učitel, ale dvorní úředník. Pozor na dvě podobně znějící dynastie: jedna patří sjednotiteli říše, druhá rodu, který vládl po něm.",
    ],
    explanation: "Popis odpovídá papíru. Jeho výrobu zdokonalil úředník Cchaj Lun kolem roku 105 n. l., za dynastie Chan. První císař z rodu Čchin vládl o víc než tři sta let dřív a Konfucius ještě dřív.",
  },
  {
    q: "Které tvrzení o spojení starších valů do jedné dlouhé zdi je správné?",
    correct: "Spojil je první císař a zeď vedla po severní hranici",
    distractors: [
      { value: "Spojil je první císař a zeď vedla mezi bývalými státy", why: "Císař valy spojil, ale ne uvnitř říše. Valy mezi bývalými státy dal naopak zbourat a spojená zeď chránila severní hranici." },
      { value: "Spojili je až Chanové a zeď vedla po severní hranici", why: "Zeď opravdu vedla po severní hranici a Chanové ji později prodlužovali. Starší valy ale do jedné linie spojil už první císař z rodu Čchin." },
      { value: "Spojili je až Chanové a zeď vedla mezi bývalými státy", why: "Obě části jsou chybně. Valy spojil první císař z rodu Čchin a zeď vedla po severní hranici, ne uvnitř říše." },
    ],
    hints: [
      "Rozhodni zvlášť dvě věci: kdo mohl valy různých států spojit a kde měla zeď smysl.",
      "Spojit valy bývalých států mohl jen ten, kdo ty státy jako první ovládl. A zvaž, jestli po sjednocení dávalo smysl bránit jeden kraj říše před druhým.",
    ],
    explanation: "Starší valy spojil první císař z dynastie Čchin, když sjednotil říši. Zeď vedla po severní hranici proti kočovníkům. Valy mezi bývalými státy uvnitř říše dal zbourat, protože už nebyly potřeba.",
  },
  {
    q: "Kterou plodinu pěstovali první rolníci na úrodné žluté půdě u řeky Chuang-che nejvíc?",
    correct: "Proso",
    distractors: [
      { value: "Rýži", why: "Rýže se pěstovala hlavně na teplém a vlhkém jihu Číny. Na sušším severu u Chuang-che se dařilo jiné obilnině." },
      { value: "Kukuřici", why: "Kukuřice pochází z Ameriky a do Číny se dostala až v novověku." },
      { value: "Bavlnu", why: "Bavlna se pěstuje na látky, ne jako hlavní jídlo. Ve starověku se pěstovala hlavně v Indii." },
    ],
    hints: [
      "Na suchém a chladnějším severu Číny se daří jiným plodinám než na teplém a vlhkém jihu.",
      "Vyřaď plodinu, která pochází z Ameriky, a plodinu, ze které se dělají látky. Ze zbylých dvou obilnin jedna potřebuje zatopená pole v teple, druhá snese suchou půdu.",
    ],
    explanation: "Na severu u Chuang-che pěstovali první rolníci hlavně proso, obilninu, která snese sucho i chlad. Rýže se pěstovala na teplém jihu, kukuřice přišla z Ameriky až v novověku a bavlna sloužila na látky.",
  },
  {
    q: "První císař sjednotil Čínu roku 221 př. n. l. Ve kterém století to bylo?",
    correct: "Ve 3. století př. n. l.",
    distractors: [
      { value: "Ve 2. století př. n. l.", why: "Do 2. století př. n. l. patří roky 200 až 101. Rok 221 je o kus starší, patří ještě do 3. století." },
      { value: "Ve 22. století př. n. l.", why: "Století nepoznáš z prvních dvou číslic roku. 22. století př. n. l. zahrnuje roky 2200 až 2101." },
      { value: "Ve 3. století n. l.", why: "Století je správně, ale sjednocení proběhlo před naším letopočtem. Označení př. n. l. se musí zachovat." },
    ],
    hints: [
      "Roky 1 až 100 tvoří 1. století, roky 101 až 200 tvoří 2. století. Stejně to platí i před naším letopočtem.",
      "Urči, do které stovky let rok 221 patří, a použij pravidlo z první nápovědy. Nakonec zkontroluj, jestli ti zůstalo správné označení letopočtu.",
    ],
    explanation: "Roky 300 až 201 př. n. l. tvoří 3. století před naším letopočtem a rok 221 mezi ně patří. Označení př. n. l. zůstává, protože sjednocení se stalo před naším letopočtem.",
  },
];

// ── L3 — ANALÝZA: příčina, důsledek, chronologie, anachronismus ────────────
export const POOL_L3: Polozka[] = [
  {
    q: "Proč sjednocení písma pomohlo udržet obrovskou čínskou říši pohromadě?",
    correct: "Protože úředníci z různých krajů rozuměli psaným rozkazům",
    distractors: [
      { value: "Protože od té doby všichni lidé mluvili stejným nářečím", why: "Sjednotilo se písmo, ne mluvená řeč. Lidé dál mluvili různými nářečími, ale psané znaky četli stejně." },
      { value: "Protože se písmo od té doby učilo každé dítě v říši", why: "Psát uměla jen malá část lidí, hlavně úředníci. Povinná škola pro všechny děti ve starověku nebyla." },
      { value: "Protože nové písmo nedokázali přečíst nepřátelé říše", why: "Písmo nebylo tajná šifra. Mělo sloužit tomu, aby si rozuměli lidé uvnitř říše." },
    ],
    hints: [
      "Kdo v obrovské říši potřeboval číst zprávy a nařízení z hlavního města?",
      "Zeptej se, kdo s písmem denně pracoval a jaký problém vznikl, když se říše spojila z mnoha států s vlastními zvyky. Pozor, mluvená řeč a písmo nejsou totéž.",
    ],
    explanation: "Jednotné písmo znamenalo, že úředník v kterémkoli kraji přečetl rozkaz z hlavního města, i když se tam mluvilo jiným nářečím. Díky tomu se dala velká říše řídit z jednoho místa.",
  },
  {
    q: "Proč Číňané dlouho přísně tajili, jak se vyrábí hedvábí?",
    correct: "Protože drahou látku mohli se ziskem prodávat jen oni",
    distractors: [
      { value: "Protože hedvábí směli nosit jen vojáci v boji", why: "Hedvábí nosili hlavně bohatí lidé a dvůr, ne vojáci. Tajemství mělo jiný důvod." },
      { value: "Protože jeho výrobu zakazovalo čínské náboženství", why: "Náboženství výrobu nezakazovalo, Číňané hedvábí vyráběli ve velkém. Jen nechtěli, aby to uměl někdo jiný." },
      { value: "Protože bourec žil jen v zahradě císařského paláce", why: "Bource chovaly tisíce rodin na venkově. Tajila se výroba, aby ji neznali cizinci." },
    ],
    hints: [
      "Kdo vydělá víc: ten, kdo jako jediný umí zboží vyrobit, nebo ten, koho brzy všichni napodobí?",
      "Kupci ze západu platili za hedvábí zlatem, protože ho jinde nikdo vyrobit neuměl. Kdyby se postup rozšířil, cena by klesla. Přemýšlej, co by Čína ztratila, kdyby tajemství prozradila.",
    ],
    explanation: "Hedvábí uměli vyrábět jen Číňané, a proto se prodávalo velmi draze. Tajemství výroby přinášelo zemi bohatství z obchodu po Hedvábné stezce. Podle pozdějších vyprávění hrozily za vyzrazení tvrdé tresty.",
  },
  {
    q: "Kočovníci ze severu pronikali do Číny i poté, co první císař spojil starší valy do jedné zdi. Co to vysvětluje nejlépe?",
    correct: "Tak dlouhou zeď nešlo všude uhlídat silnou posádkou",
    distractors: [
      { value: "Kočovníci tehdy útočili hlavně z lodí od moře", why: "Kočovníci ze stepí jezdili na koních, lodě neměli. Přicházeli po souši přes severní hranici." },
      { value: "Zeď oddělovala kraje uvnitř říše, ne hranici", why: "Valy mezi bývalými státy uvnitř říše dal císař naopak zbourat. Spojená zeď stála na severní hranici." },
      { value: "Hned po smrti prvního císaře zeď celou zbourali", why: "Zeď nikdo nezboural, pozdější dynastie ji naopak opravovaly a prodlužovaly. Potíž byla v její délce." },
    ],
    hints: [
      "Zamysli se, jak dlouhá zeď byla a co všechno obrana potřebuje, aby opravdu fungovala.",
      "Zeď sama o sobě nikoho nezastaví, pokud ji někdo nebrání. Porovnej její délku s tím, co obrana potřebuje, a u ostatních možností ověř, co tvrdí o tom, odkud a jak kočovníci přicházeli.",
    ],
    explanation: "Zeď měřila tisíce kilometrů a nešlo ji všude hlídat silnou posádkou. Rychlí jezdci proto hledali slabá místa, kde zeď prorazili nebo obešli. Pozdější dynastie ji proto stále opravovaly a prodlužovaly.",
  },
  {
    q: "Proč sjednocení měr, vah a peněz usnadnilo obchod v celé říši?",
    correct: "Protože kupci z různých krajů počítali stejnými jednotkami",
    distractors: [
      { value: "Protože se od té doby obchodovalo jen směnou zboží", why: "Naopak, jednotné peníze směnu zboží za zboží nahrazovaly. Obchod byl díky nim snazší." },
      { value: "Protože kupci od té doby nemuseli platit žádné daně", why: "Daně se v říši platily dál. Jednotné míry a peníze je nezrušily." },
      { value: "Protože kupci směli prodávat jen v hlavním městě", why: "Žádný takový zákaz nevznikl. Jednotné míry naopak umožnily obchod po celé říši." },
    ],
    hints: [
      "Představ si kupce, který prodává obilí v jiném kraji, kde se měří jinou nádobou. Co je pro něj těžké?",
      "Když má každý kraj jiné váhy a jiné mince, musí se kupci neustále dohadovat a přepočítávat a snadno se ošálí. Co se změní, když všude platí stejná míra a stejné peníze?",
    ],
    explanation: "Jednotné míry, váhy a peníze znamenaly, že kupec z jednoho kraje přesně věděl, kolik dostane a kolik zaplatí v jiném kraji. Obchod byl rychlejší a spravedlivější.",
  },
  {
    q: "Starý pramen popisuje zeď prvního císaře jako val většinou z udusané (pěchované) hlíny. Co z toho vyplývá o zdi z cihel a kamene se strážními věžemi, kterou známe z fotek?",
    correct: "Je mladší, postavili ji o víc než tisíc let později",
    distractors: [
      { value: "Je to přesně ta zeď, kterou postavil první císař", why: "Zeď prvního císaře byla většinou z udusané hlíny, bez cihlových hradeb a věží. Podobu z cihel a kamene dostala až za dynastie Ming, o více než tisíc let později." },
      { value: "Je ještě starší a postavili ji už vládci z rodu Šang", why: "Šangové vládli dávno před prvním císařem a takovou zeď nestavěli. Cihlová a kamenná podoba je mladší, ne starší." },
      { value: "Je to jen nová napodobenina z minulého století", why: "Cihlové a kamenné úseky jsou staré stovky let, postavili je za dynastie Ming hlavně v 16. století. Nejsou to moderní kulisy." },
    ],
    hints: [
      "Porovnej materiál z pramene s tím, co vidíš na fotkách. Může to být stejná stavba ze stejné doby?",
      "Když byla původní zeď hlavně z hlíny, musel zeď z cihel s věžemi postavit někdo jiný a jindy. Hlína se časem rozpadá, a tak pozdější vládci zeď přestavovali. Byli to vládci před prvním císařem, nebo po něm?",
    ],
    explanation: "Zeď prvního císaře byla většinou z udusané hlíny, bez dnešních cihlových hradeb a věží. Podobu z cihel a kamene se strážními věžemi dostala až za dynastie Ming, o více než tisíc let později (hlavně v 15. a 16. století). To, co známe z fotek, tedy není starověké.",
  },
  {
    q: "Ve výčtu věcí z doby prvního císaře se objevil jeden omyl. Který údaj do jeho doby nepatří?",
    correct: "Knihy psané na papíře",
    distractors: [
      { value: "Hliněné vojsko u jeho hrobu", why: "Terakotová armáda hlídá hrob prvního císaře. Do jeho doby patří." },
      { value: "Jednotné míry, váhy a peníze", why: "Míry, váhy a peníze sjednotil právě první císař. Údaj patří." },
      { value: "Valy na severu spojené do zdi", why: "Starší valy spojil do jedné zdi právě první císař. Údaj patří." },
    ],
    hints: [
      "U každého údaje se zeptej, jestli nepředpokládá něco, co vzniklo až za pozdější dynastie.",
      "Najdi údaj, ve kterém se skrývá materiál k psaní. Zjisti, za které dynastie se ten materiál k psaní začal používat, a porovnej to s rodem prvního císaře. Na co se psalo předtím?",
    ],
    explanation: "Papír zdokonalil Cchaj Lun až za dynastie Chan, kolem roku 105 n. l., tedy víc než tři sta let po sjednocení. Za prvního císaře se psalo na bambusové destičky a hedvábí, a takové byly i knihy, které dal spálit. Hliněné vojsko, jednotné míry a spojená zeď do jeho doby patří.",
  },
  {
    q: "Spolužák sepsal starověké čínské vynálezy, ale jeden údaj tam nepatří. Který?",
    correct: "Knihtisk pohyblivými literami",
    distractors: [
      { value: "Papír z kůry, konopí a hadrů", why: "Papír zdokonalil Cchaj Lun ve starověku, za dynastie Chan. Údaj patří." },
      { value: "Hedvábí z kokonů bource", why: "Hedvábí Číňané vyráběli a vyváželi už ve starověku. Údaj patří." },
      { value: "Písmo na věštebných kostech", why: "Věštebné kosti jsou z doby dynastie Šang, tedy z hlubokého starověku. Údaj patří." },
    ],
    hints: [
      "U každého údaje se ptej, jestli ho znáš z doby prvních čínských dynastií, nebo z mnohem pozdějších staletí.",
      "Tisknout knihy dá smysl až tehdy, když je dost levného materiálu k psaní a hodně čtenářů. Tři údaje z nabídky dokládají prameny ze starověku, čtvrtý přišel o mnoho staletí později.",
    ],
    explanation: "Knihtisk pohyblivými literami vynalezli Číňané až ve středověku. Papír, hedvábí i nápisy na věštebných kostech jsou ze starověku.",
  },
  {
    q: "Učitel napsal na tabuli čínské vynálezy a řekl, že jen jeden z nich nepatří do středověku, ale už do starověku. Který to je?",
    correct: "Papír z rozvlákněné kůry",
    distractors: [
      { value: "Střelný prach do ohňostrojů", why: "Střelný prach vznikl až ve středověku. Do starověku nepatří." },
      { value: "Knihtisk pohyblivými literami", why: "Knihtisk pohyblivými literami vznikl až ve středověku, dlouho po dynastii Chan." },
      { value: "Tištěné papírové peníze", why: "Papírové peníze se v Číně tiskly až ve středověku. Předpokládají papír i tisk." },
    ],
    hints: [
      "Některé vynálezy potřebují jiný vynález jako předpoklad. Který musel přijít jako první?",
      "Tištěné peníze i tištěné knihy nejdou vyrobit bez materiálu, na který se tiskne. Ten tedy musel vzniknout dřív. Směs do ohňostrojů se objevuje až ve středověkých pramenech.",
    ],
    explanation: "Do starověku patří papír, který zdokonalil Cchaj Lun kolem roku 105 n. l. Střelný prach, knihtisk a papírové peníze jsou středověké vynálezy. Peníze a knihtisk navíc papír potřebují.",
  },
  {
    q: "Konfucius žil za dynastie Čou, první císař pocházel z rodu Čchin. Co z toho vyplývá o jejich době?",
    correct: "Konfucius žil dřív, než vládl první císař",
    distractors: [
      { value: "Konfucius žil až po smrti prvního císaře", why: "Dynastie Čou vládla před dynastií Čchin, ne po ní. Konfucius byl tedy starší." },
      { value: "Konfucius vychovával prvního císaře jako učitel", why: "Mezi Konfuciem a prvním císařem uplynulo přes dvě stě let. Setkat se nemohli." },
      { value: "Konfucius a první císař žili ve stejné době", why: "Dynastie Čou a Čchin po sobě následovaly, nevládly současně. Konfucius zemřel dávno předtím, než se první císař narodil." },
    ],
    hints: [
      "Otázka se neptá na letopočty, ale na pořadí dynastií. Která z obou jmenovaných vládla dřív?",
      "První císař ukončil dobu soupeřících států, která patřila ke konci jedné dlouhé dynastie. Pokud tahle dynastie vládla před jeho rodem, pak i každý, kdo za ní žil, je starší než on.",
    ],
    explanation: "Dynastie Čou vládla před dynastií Čchin. Konfucius, který žil za Čou, proto žil dřív než první císař. Mezi nimi uplynulo přes dvě stě let.",
  },
  {
    q: "Cchaj Lun zdokonalil papír za dynastie Chan. Co z toho vyplývá o době, kdy se to stalo?",
    correct: "Stalo se to až po smrti prvního císaře",
    distractors: [
      { value: "Stalo se to ještě za vlády prvního císaře", why: "První císař pocházel z rodu Čchin. Dynastie Chan se chopila vlády až po pádu jeho rodu, tedy po jeho smrti." },
      { value: "Stalo se to v době soupeřících států", why: "Soupeřící státy patří ke konci dynastie Čou, ještě před sjednocením. Dynastie Chan vládla až po Čchinech." },
      { value: "Stalo se to dřív, než žil Konfucius", why: "Konfucius žil za dynastie Čou, která vládla dávno před dynastií Chan. Cchaj Lun je mnohem mladší." },
    ],
    hints: [
      "Rozhoduje pořadí dynastií. Vládl rod Chan před rodem, který sjednotil říši, nebo po něm?",
      "Seřaď si čtyři dynastie od nejstarší a najdi, kde stojí rod sjednotitele říše a kde rod Chan. Pak zvaž, jestli mohl vládnout rod Chan zároveň se sjednotitelem z jiného rodu.",
    ],
    explanation: "Dynastie Chan nastoupila až po pádu rodu Čchin, ke kterému patřil první císař. Cchaj Lun proto papír zdokonalil až dlouho po jeho smrti, kolem roku 105 n. l.",
  },
  {
    q: "Který údaj platí zároveň pro starověkou Čínu i pro starověký Egypt?",
    correct: "Obě vznikly u velké řeky a stavěly hráze a kanály",
    distractors: [
      { value: "Obě psaly na papyrus vyráběný z rostliny u řeky", why: "Na papyrus psali jen Egypťané. Číňané psali na kosti, bambus, hedvábí a později na papír." },
      { value: "Obě stavěly pyramidy jako hrobky svých vládců", why: "Kamenné pyramidy stavěli Egypťané. Hrob čínského císaře hlídá hliněná armáda." },
      { value: "Obě uctívaly svého vládce pod titulem faraon", why: "Faraon byl titul egyptského vládce. V Číně vládl král a později císař." },
    ],
    hints: [
      "Hledej, co měly obě civilizace společné kvůli přírodě, ve které vznikly.",
      "Papyrus, pyramidy i titul faraon patří jen jedné z obou zemí. Obě ale vznikly v krajině, kde se lidé museli naučit pracovat s velkou vodou, která přinášela úrodu i povodně.",
    ],
    explanation: "Čína i Egypt vznikly u velké řeky (Chuang-che a Nil). Obě musely organizovat stavbu hrází a zavlažovacích kanálů, a proto v obou vznikl silný stát. Papyrus, pyramidy a faraon patří jen Egyptu.",
  },
  {
    q: "Který údaj správně popisuje rozdíl mezi starověkou Čínou a Egyptem?",
    correct: "Čína vynalezla papír, Egypt psal na papyrus",
    distractors: [
      { value: "Čína psala na papyrus, Egypt vynalezl papír", why: "Je to obráceně. Papyrus je egyptský materiál, papír zdokonalili Číňané." },
      { value: "Čína ležela u Nilu, Egypt u Žluté řeky", why: "Je to obráceně. Egypt ležel u Nilu, Čína u Žluté řeky." },
      { value: "Čína neměla písmo, Egypt psal hieroglyfy", why: "Čína písmo měla, nejstarší nápisy jsou na věštebných kostech z doby Šang." },
    ],
    hints: [
      "Pozor na možnosti, kde jsou správné pojmy prohozené mezi obě země.",
      "U každé možnosti si ověř obě poloviny zvlášť: patří první údaj opravdu Číně a druhý Egyptu? Jen jedna možnost má obě poloviny ve správné zemi.",
    ],
    explanation: "Číňané vynalezli papír, zatímco Egypťané psali na papyrus z rostliny rostoucí u Nilu. Obě země měly vlastní písmo: Čína znaky, Egypt hieroglyfy.",
  },
  {
    q: "Proč vznikly první čínské státy právě u velké řeky na severu Číny?",
    correct: "Protože úrodné bahno z řeky dávalo dobrou úrodu prosa",
    distractors: [
      { value: "Protože řeka chránila zemi před kočovníky ze severu", why: "Řeka lidi před nájezdníky neochránila, proto se později stavěla zeď. Důvodem osídlení byla úroda." },
      { value: "Protože po řece vedla Hedvábná stezka do Říma", why: "Hedvábná stezka vznikla mnohem později a vedla po souši přes Střední Asii." },
      { value: "Protože se u řeky dalo těžit hodně zlata a stříbra", why: "Bohatství prvních států nepocházelo ze zlata, ale z úrody na polích u řeky." },
    ],
    hints: [
      "Z čeho žila většina lidí v prvních státech? Co k tomu potřebovali?",
      "Rolníci potřebovali vodu a úrodnou půdu. Velká řeka při povodních nanášela na pole jemnou žlutou půdu. Stejný důvod vedl ke vzniku států i u Nilu nebo u Eufratu.",
    ],
    explanation: "Řeka Chuang-che nanášela úrodné žluté bahno, takže se tu dobře pěstovalo proso a obilí. Nadbytek jídla uživil více lidí a ke stavbě hrází bylo potřeba organizace, a tak vznikly první státy.",
  },
  {
    q: "Proč byl papír pro čínské úředníky důležitý vynález?",
    correct: "Protože byl levnější než hedvábí a lehčí než bambus",
    distractors: [
      { value: "Protože vydržel déle než nápisy tesané do kamene", why: "Papír nevydrží déle než kámen. Jeho výhoda byla cena a lehkost." },
      { value: "Protože na něj směl psát jen sám císař a jeho rodina", why: "Na papír psali hlavně úředníci. Nebyl vyhrazený císaři." },
      { value: "Protože se jím od té doby platily daně místo obilí", why: "Daně se platily obilím a dalším zbožím, papír nebyl platidlo." },
    ],
    hints: [
      "Na co psali Číňané před papírem a co bylo na těch materiálech nepraktické?",
      "Úřad potřeboval hodně zápisů: seznamy daní, rozkazy, zákony. Porovnej, co bylo nepraktické na bambusových destičkách a co na hedvábí, a pak se zeptej, co musel nový materiál splnit.",
    ],
    explanation: "Před papírem se psalo na těžké bambusové destičky nebo na drahé hedvábí. Papír byl lehký i levný, takže úředníci mohli psát a posílat mnohem víc zápisů a rozkazů.",
  },
  {
    q: "Kronika uvádí, že první císař dal spálit knihy učenců, kteří chválili staré časy. Co z toho vyplývá?",
    correct: "Císař nesnesl odpor a chtěl ovládat i myšlení lidí",
    distractors: [
      { value: "Císař chtěl získat víc papíru na úřední zápisy", why: "Papír za prvního císaře ještě nebyl rozšířený a pálení knih nemělo materiál ušetřit. Šlo o potlačení nesouhlasu." },
      { value: "Císař nesnášel psaní a zakázal písmo úplně", why: "Císař písmo naopak sjednotil a úřad ho potřeboval. Pálil jen knihy, které se mu nelíbily." },
      { value: "Císař chtěl uvolnit místo v knihovnách pro nové knihy", why: "Místo v knihovnách nebylo důvodem. Knihy chválící staré časy zpochybňovaly jeho novou vládu." },
    ],
    hints: [
      "Všimni si, čí knihy se pálily: učenců, kteří chválili staré časy. Co si o nové vládě asi mysleli?",
      "Zeptej se, co knihy chválící staré časy nepřímo říkaly o nové vládě. Pak zvaž, proč by vládci vadilo, že je lidé dál čtou, a co tím chtěl získat.",
    ],
    explanation: "Učenci, kteří chválili staré časy, nepřímo kritizovali nového vládce. Pálení jejich knih ukazuje, že první císař vládl tvrdě a chtěl umlčet každý nesouhlas, i v myšlenkách.",
  },
];

// ── Generátor ───────────────────────────────────────────────────────────────
const vytvor = (p: Polozka): PracticeTask =>
  choice(p.q, p.correct, p.distractors, { hints: p.hints, explanation: p.explanation });

/** Deterministicky projde celou banku úrovně — každá položka dá jednu úlohu. */
function zBanky(pool: Polozka[]): PracticeTask[] {
  let i = 0;
  return ruzneUlohy(() => vytvor(pool[i++ % pool.length]), pool.length, pool.length);
}

function gen(level: number): PracticeTask[] {
  if (level <= 1) return zBanky(POOL_L1);
  if (level === 2) return zBanky(POOL_L2);
  return zBanky(POOL_L3);
}

// ── Topic ───────────────────────────────────────────────────────────────────
export const STAROVEKA_CINA: TopicMetadata[] = [
  {
    id: "g6-dej-staroveka-cina-6",
    rvpNodeId: "g6-dejepis-starovek-staroveka-indie-a-cina-staroveka-cina-dynastie-velka-cinska-zed-vynalezy",
    displayName: "Starověká Čína",
    title: "Starověká Čína - dynastie, Velká čínská zeď, vynálezy",
    studentTitle: "Starověká Čína: císaři, zeď a vynálezy",
    subject: "dejepis",
    category: "Starověk",
    topic: "Starověká Indie a Čína",
    briefDescription: "Poznáš čínské dynastie, Velkou čínskou zeď a vynálezy jako papír a hedvábí.",
    keywords: [
      "Čína", "starověká Čína", "Chuang-che", "Žlutá řeka", "dynastie", "Šang", "Čou", "Čchin", "Chan",
      "první císař", "Čchin Š'-chuang-ti", "Velká čínská zeď", "terakotová armáda", "Konfucius",
      "papír", "Cchaj Lun", "hedvábí", "Hedvábná stezka", "věštebné kosti",
    ],
    goals: [
      "Přiřadit jev starověké Číny (vynález, stavbu, reformu) ke správné dynastii.",
      "Vysvětlit, proč vznikla Velká čínská zeď a proč bylo důležité sjednocení písma, mír a peněz.",
      "Odlišit starověké čínské vynálezy od pozdějších a od reálií Egypta a Mezopotámie.",
    ],
    boundaries: [
      "Jen nesporná fakta z učebnic 6. ročníku; datace Šang a Čou se nepoužívají jako klíč.",
      "Jediný pevný letopočet je sjednocení říše 221 př. n. l.; papír jen „kolem roku 105 n. l.“.",
      "Kompas, porcelán a střelný prach nejsou klíčem ke starověkému vynálezu; mýtus o zdi viditelné z vesmíru se nepoužívá.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Pořadí dynastií: Šang (věštebné kosti) → Čou (Konfucius) → Čchin (první císař, sjednocení, zeď) → Chan (Hedvábná stezka, papír).",
      steps: [
        "Najdi v zadání poznávací znak (kosti, Konfucius, první císař, papír, stezka).",
        "Přiřaď ho k dynastii podle pořadí Šang, Čou, Čchin, Chan.",
        "Zkontroluj, jestli možnost nepatří Egyptu, Mezopotámii nebo středověku.",
      ],
      commonMistake: "Splést si dynastie Čchin a Chan, nebo považovat dnešní kamennou zeď a střelný prach za starověké.",
      example: "Sjednocení písma provedl první císař z dynastie Čchin, papír zdokonalil Cchaj Lun až za dynastie Chan.",
    },
  },
];
