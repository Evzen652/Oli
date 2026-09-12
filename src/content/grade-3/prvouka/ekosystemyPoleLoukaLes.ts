import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (inventura obsahu): dřív 11/8/9 unikátních úloh, L3 z jediné
// úlohy + doplňků, chybné možnosti bez zpětné vazby, nápovědy bez gradace.
// Teď tři oddělené banky ručně psaných úloh, každá s vlastními nápovědami,
// vysvětlením PROČ a zpětnou vazbou u každé chybné možnosti:
//   L1 rozpoznání — kde organismus žije / který organismus do prostředí patří
//   L2 aplikace — trojice organismů jednoho prostředí, býložravec/masožravec/
//      všežravec, producent/rozkladač, rozdíl louka × pole
//   L3 transfer — potravní řetězce (pořadí, chybějící článek) a důsledky změn

type D = [string, string];
type U = { q: string; a: string; d: [D, D, D]; h: [string, string]; e: string };

function uloha(u: U): PracticeTask {
  return choice(u.q, u.a, u.d.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor], {
    hints: u.h,
    explanation: u.e,
  });
}

const L1: U[] = [
  {
    q: "Kde žije veverka?",
    a: "V lese",
    d: [
      ["Na louce", "Louka je travnatá plocha bez stromů. Veverka potřebuje kmeny, po kterých šplhá, a koruny, kde si staví hnízdo."],
      ["Na poli", "Na poli roste obilí nebo řepka, ne stromy se šiškami a oříšky, kterými se veverka živí."],
      ["V rybníku", "Veverka neplave pod vodou ani nemá žábry — je to savec, který šplhá po stromech."],
    ],
    h: [
      "Veverka šplhá po kmenech a sbírá šišky a oříšky. Kde najde nejvíc stromů?",
      "Louka a pole jsou otevřené plochy, rybník je voda. Hnízdo si veverka staví vysoko v koruně stromu, takže hledej prostředí, kde stromy rostou hustě vedle sebe.",
    ],
    e: "Veverka žije v lese: šplhá po stromech, hnízdo má v koruně a živí se šiškami, oříšky a žaludy, které tam najde.",
  },
  {
    q: "Kde žije kapr?",
    a: "V rybníku",
    d: [
      ["Na louce", "Na louce roste tráva, ale není tam voda, ve které by ryba mohla plavat a dýchat."],
      ["V lese", "Les je suchozemské prostředí se stromy. Kapr je ryba a bez vody by zahynul."],
      ["Na poli", "Pole je orná půda s obilím. Ryba potřebuje vodu, na poli by se udusila."],
    ],
    h: [
      "Kapr je ryba. Co ryba nutně potřebuje, aby mohla dýchat a plavat?",
      "Ryby dýchají žábrami, a proto musí být pořád ve vodě. Ze čtyř nabídnutých prostředí vyber to jediné, kde je voda i v létě.",
    ],
    e: "Kapr je ryba — dýchá žábrami, a proto žije ve vodě. Ze čtyř prostředí je vodní jen rybník.",
  },
  {
    q: "Kde se pěstuje pšenice?",
    a: "Na poli",
    d: [
      ["V lese", "V lese je pod stromy stín a pšenici tam nikdo nezasévá."],
      ["Na louce", "Louka roste sama — tráva a byliny se tam neosévají. Obilí musí člověk zasít na zoranou půdu."],
      ["V rybníku", "Pšenice je suchozemská rostlina, ve vodě by zahnila."],
    ],
    h: [
      "Pšenici zaseje zemědělec a v létě ji sklidí kombajnem. Kde to dělá?",
      "Hledej prostředí, které člověk každý rok oře, oseje a sklidí. Louka roste sama od sebe, les dává stín a v rybníku je voda.",
    ],
    e: "Pšenici pěstuje člověk na poli: půdu zorá, zaseje zrna a v létě úrodu sklidí. Louka ani les se takhle neosévají.",
  },
  {
    q: "Který pták hnízdí na zemi mezi obilím na poli?",
    a: "Koroptev",
    d: [
      ["Datel", "Datel žije v lese a hnízdo si tesá do kmene stromu, ne na zemi v obilí."],
      ["Volavka", "Volavka žije u vody a loví ryby a žáby, hnízdí na stromech u rybníků."],
      ["Kachna divoká", "Kachna divoká žije na rybnících a řekách, na poli v obilí nehnízdí."],
    ],
    h: [
      "Hledej hnědého ptáka, který v obilí téměř splyne s hlínou a klasy.",
      "Datel tesá do stromů, volavka i kachna potřebují vodu. Zbývá pták, který nelétá rád vysoko a vejce snáší do jamky v zemi mezi klasy.",
    ],
    e: "Koroptev je polní pták: hnízdí na zemi v obilí nebo na mezích a hnědé peří ji v poli dobře maskuje.",
  },
  {
    q: "Kde žije kobylka?",
    a: "Na louce",
    d: [
      ["V rybníku", "Kobylka je hmyz, který skáče po stéblech. Ve vodě by se utopila."],
      ["V hustém lese", "V hustém lese je stín a málo trávy, kterou kobylka potřebuje k životu."],
      ["V noře pod zemí", "V noře pod zemí žije krtek nebo myš. Kobylka skáče v trávě na slunci."],
    ],
    h: [
      "Kobylka skáče po stéblech trávy a na slunci cvrlíká. Kde je hodně trávy i slunce?",
      "Hledej otevřené prostředí, kde roste vysoká tráva a pestré byliny a nikdo ho neoře. Stín pod stromy ani voda kobylce nesvědčí.",
    ],
    e: "Kobylka žije na louce: skáče po stéblech, živí se trávou a byliny jí dávají úkryt. Na slunné louce je jí nejlépe.",
  },
  {
    q: "Která rostlina roste na hladině rybníka?",
    a: "Leknín",
    d: [
      ["Pampeliška", "Pampeliška roste na louce a v trávníku, ve vodě by uhnila."],
      ["Borůvka", "Borůvka je nízký keřík v lese pod stromy, ne vodní rostlina."],
      ["Chrpa", "Chrpa je modrá květina, která roste mezi obilím na poli."],
    ],
    h: [
      "Hledej rostlinu, jejíž velké kulaté listy plavou na vodě.",
      "Každá z nabídnutých rostlin patří do jiného prostředí: jedna na louku, jedna do lesa, jedna na pole. Na vodu patří ta, na jejíchž listech v pohádkách sedávají žáby.",
    ],
    e: "Leknín je vodní rostlina: kořeny má v bahně na dně a listy s květy mu plavou na hladině rybníka.",
  },
  {
    q: "Která rostlina roste v lese pod stromy a má modré plody?",
    a: "Borůvka",
    d: [
      ["Chrpa", "Chrpa je modrá, ale modrý je její květ a roste na poli mezi obilím, ne v lese."],
      ["Leknín", "Leknín roste na hladině rybníka a plody k jídlu nemá."],
      ["Jetel", "Jetel roste na louce a má červené nebo bílé květy, ne modré plody."],
    ],
    h: [
      "V létě se do lesa chodí s hrnkem sbírat drobné modré kuličky. Na čem rostou?",
      "Pozor na záměnu: modrý květ není totéž co modrý plod. Hledej nízký keřík, který roste ve stínu pod stromy a jehož plody si lidé dávají do koláčů.",
    ],
    e: "Borůvka je nízký lesní keřík. Roste ve stínu pod stromy a v létě má modré plody, které jedí lidé i ptáci.",
  },
  {
    q: "Co najdeš v lese jako měkký zelený koberec na kamenech a pařezech?",
    a: "Mech",
    d: [
      ["Pšenici", "Pšenice je obilí, které se pěstuje na poli, ne na kamenech v lese."],
      ["Leknín", "Leknín plave na hladině rybníka, na kamenech v lese neroste."],
      ["Chrpu", "Chrpa je modrá květina z pole, měkký koberec netvoří."],
    ],
    h: [
      "Hledej rostlinu, která nemá květy a na vlhkých stinných místech tvoří měkký polštář.",
      "Vzpomeň si na procházku lesem: na pařezech a kamenech roste něco zeleného, měkkého na dotek, co nasákne vodou jako houba. Obilí ani květiny to nejsou.",
    ],
    e: "Mech roste v lese na vlhkých a stinných místech — na kamenech, pařezech i kmenech. Zadržuje vodu a malým živočichům dává úkryt.",
  },
  {
    q: "Který pták dlouho stojí u vody a loví ryby a žáby?",
    a: "Volavka",
    d: [
      ["Koroptev", "Koroptev žije na poli a sbírá semena a hmyz, ryby neloví."],
      ["Sýkora", "Sýkora žije v lese a na zahradách a živí se hmyzem a semínky, ne rybami."],
      ["Skřivan", "Skřivan žije na poli a zpívá vysoko nad ním, u vody ryby neloví."],
    ],
    h: [
      "Hledej velkého ptáka s dlouhýma nohama a dlouhým ostrým zobákem.",
      "Dlouhé nohy mu dovolí stát v mělké vodě a ostrý zobák bleskově chytí rybu. Ptáci ze seznamu, kteří žijí na poli nebo v lese, takové nohy ani zobák nemají.",
    ],
    e: "Volavka žije u rybníků a řek. Na dlouhých nohách stojí v mělké vodě a ostrým zobákem loví ryby a žáby.",
  },
  {
    q: "Který savec žije v lese a samec má na hlavě parohy?",
    a: "Jelen",
    d: [
      ["Vydra", "Vydra žije u vody a parohy nemá."],
      ["Krtek", "Krtek žije pod zemí na loukách a zahradách a parohy nemá."],
      ["Ježek", "Ježek má místo srsti bodliny, parohy nemá."],
    ],
    h: [
      "Parohy jsou kostěné výrůstky, které samec každý rok shodí a narostou mu nové.",
      "Tři ze čtyř nabídnutých zvířat jsou malá a na hlavě žádné výrůstky nemají. Hledej velké lesní zvíře, kterému se na podzim v lese říká „král lesa“.",
    ],
    e: "Jelen je velký lesní savec. Samec má parohy, které každý rok na jaře shodí a do podzimu mu narostou nové.",
  },
  {
    q: "Kde žije vydra?",
    a: "U řeky nebo rybníka",
    d: [
      ["Na poli v obilí", "V obilí žije koroptev nebo bažant. Vydra loví ryby, a proto potřebuje vodu."],
      ["Na louce v trávě", "V trávě na louce žije kobylka. Vydra je plavec a bez vody by neměla co jíst."],
      ["V koruně stromu", "V koruně stromu žije veverka. Vydra nešplhá, ale plave."],
    ],
    h: [
      "Vydra je výborný plavec a živí se hlavně rybami. Kde je jí nejlíp?",
      "Zamysli se, kde vydra najde ryby, a kde si tedy vyhrabe noru. Vchod do nory mívá často pod hladinou v břehu, aby ho nikdo neviděl.",
    ],
    e: "Vydra žije u tekoucí i stojaté vody. Plave a loví ryby, raky a žáby a noru si hrabe v břehu.",
  },
  {
    q: "Která rostlina roste jako plevel mezi obilím a má modré květy?",
    a: "Chrpa",
    d: [
      ["Zvonek", "Zvonek je také modrý, ale roste na loukách a stráních, ne mezi obilím."],
      ["Pampeliška", "Pampeliška má žluté květy a roste hlavně na loukách."],
      ["Leknín", "Leknín roste na rybníce a má bílé nebo růžové květy."],
    ],
    h: [
      "Hledej modrou květinu, kterou zemědělec na poli nechce, protože roste mezi klasy.",
      "Pozor, dvě možnosti mají modrou barvu. Jedna ale roste na loukách, druhá se schovává přímo mezi stébly obilí — rozhoduje tedy místo, kde roste.",
    ],
    e: "Chrpa roste mezi obilím na poli. Zemědělci ji berou jako plevel, a proto je dnes vzácnější než dřív.",
  },
  {
    q: "Který živočich žije na louce pod zemí a vyhrnuje hromádky hlíny?",
    a: "Krtek",
    d: [
      ["Veverka", "Veverka žije v lese na stromech, pod zemí chodby nehrabe."],
      ["Kapr", "Kapr je ryba z rybníka, na louce by nepřežil."],
      ["Datel", "Datel tesá díry do stromů v lese, hlínu nevyhrnuje."],
    ],
    h: [
      "Na louce občas uvidíš čerstvé kopečky hlíny. Kdo je pod zemí vyrobil?",
      "Hledej zvíře s lopatovitými předními tlapkami, které si pod trávou hrabe dlouhé chodby a přebytečnou hlínu vytlačí nahoru.",
    ],
    e: "Krtek žije pod zemí na loukách a zahradách. Hrabe chodby a vyhrnutá hlína vytvoří na povrchu krtince. Živí se žížalami.",
  },
  {
    q: "Ve kterém prostředí roste nejvíc stromů?",
    a: "Les",
    d: [
      ["Louka", "Na louce roste tráva a byliny, stromy tam bývají jen výjimečně."],
      ["Pole", "Pole osévá člověk obilím nebo zeleninou, stromy by mu tam překážely."],
      ["Rybník", "Rybník je vodní plocha, stromy rostou nanejvýš na jeho břehu."],
    ],
    h: [
      "Vzpomeň si, kde je v létě stín, chladno a voní to jehličím.",
      "Louka je travnatá, pole je oseté a rybník je voda. Hledej prostředí, kde stromy stojí hustě vedle sebe a pod nimi rostou houby a mech.",
    ],
    e: "Les je prostředí, kde roste mnoho stromů hustě vedle sebe. Proto je v něm stín a vlhko a daří se houbám, mechu i borůvkám.",
  },
];

const L2: U[] = [
  {
    q: "Která trojice organismů žije na louce?",
    a: "kobylka, kopretina, zvonek",
    d: [
      ["kobylka, leknín, zvonek", "Leknín do trojice nepatří — roste na hladině rybníka, ne na louce."],
      ["kopretina, datel, zvonek", "Datel do trojice nepatří — žije v lese a tesá do stromů."],
      ["pšenice, koroptev, chrpa", "Tahle trojice žije celá na poli, ne na louce."],
    ],
    h: [
      "Zkontroluj každý organismus v trojici zvlášť — stačí jeden, který na louku nepatří.",
      "U každé možnosti si řekni, kde žije první, druhý a třetí organismus. Správná trojice je ta, kde všechny tři patří na travnatou louku; jinde se vždy schová aspoň jeden z lesa, vody nebo pole.",
    ],
    e: "Kobylka skáče v trávě, kopretina i zvonek jsou luční květiny — všechny tři žijí na louce. V ostatních trojicích je organismus z jiného prostředí.",
  },
  {
    q: "Která trojice organismů žije v lese?",
    a: "veverka, borůvka, datel",
    d: [
      ["veverka, borůvka, kapr", "Kapr do trojice nepatří — je to ryba z rybníka."],
      ["jelen, chrpa, datel", "Chrpa do trojice nepatří — roste na poli mezi obilím."],
      ["krtek, kopretina, cvrček", "Tahle trojice žije na louce, ne v lese."],
    ],
    h: [
      "Projdi trojice člen po členu a hledej ten, který do lesa nepatří.",
      "Lesní organismy potřebují stromy, stín nebo lesní půdu. Stačí v trojici jeden organismus z vody, z pole nebo z louky a celá možnost je špatně.",
    ],
    e: "Veverka šplhá po stromech, borůvka roste ve stínu pod nimi a datel tesá do kmenů — všichni tři patří do lesa.",
  },
  {
    q: "Která trojice organismů žije v rybníku nebo u něj?",
    a: "kapr, leknín, rákos",
    d: [
      ["kapr, leknín, koroptev", "Koroptev do trojice nepatří — hnízdí na poli v obilí."],
      ["štika, borůvka, rákos", "Borůvka do trojice nepatří — roste v lese pod stromy."],
      ["veverka, mech, sova", "Tahle trojice žije v lese, ne u vody."],
    ],
    h: [
      "U každého organismu se zeptej: potřebuje ke svému životu vodu?",
      "Ryby žijí přímo ve vodě, některé rostliny plavou na hladině a jiné rostou v mělké vodě u břehu. Když je v trojici organismus z pole nebo z lesa, možnost vyřaď.",
    ],
    e: "Kapr plave ve vodě, leknín na hladině a rákos roste v mělké vodě u břehu — všichni tři patří k rybníku.",
  },
  {
    q: "Která trojice organismů žije na poli?",
    a: "kukuřice, bažant, vlčí mák",
    d: [
      ["kukuřice, bažant, leknín", "Leknín do trojice nepatří — roste na hladině rybníka."],
      ["pšenice, jelen, chrpa", "Jelen do trojice nepatří — je to velký lesní savec."],
      ["štika, vydra, volavka", "Tahle trojice žije u vody, ne na poli."],
    ],
    h: [
      "Pole osévá člověk. Hledej trojici, kde je plodina a k ní organismy, které se v ní skrývají.",
      "Na poli roste to, co tam člověk zasel, a mezi tím plevele; skrývají se tam i ptáci hnízdící na zemi. Zkontroluj všechny tři členy — jediný lesní nebo vodní organismus možnost vyřadí.",
    ],
    e: "Kukuřici zasel zemědělec, bažant se schovává v porostu a vlčí mák roste jako plevel mezi plodinami — všichni tři patří na pole.",
  },
  {
    q: "Srnec se pase na trávě a okusuje listy a výhonky. Jaký je to živočich podle potravy?",
    a: "Býložravec",
    d: [
      ["Masožravec", "Masožravec loví jiné živočichy. Srnec nikoho neloví, jí jen rostliny."],
      ["Všežravec", "Všežravec jí rostliny i živočichy. Srnec živočichy nejí."],
      ["Rozkladač", "Rozkladač rozkládá odumřelé zbytky. Srnec jí čerstvé rostliny."],
    ],
    h: [
      "Podívej se, co srnec jí: jsou to rostliny, nebo zvířata?",
      "Rozlišuj podle jídelníčku: kdo jí jen rostliny, kdo jen maso a kdo obojí. Tráva, listy i výhonky jsou všechno části rostlin.",
    ],
    e: "Srnec jí jen rostliny — trávu, listy a výhonky. Živočich, který se živí jen rostlinami, je býložravec.",
  },
  {
    q: "Sova v noci loví myši a drobné ptáky. Jaká je podle potravy?",
    a: "Masožravec",
    d: [
      ["Býložravec", "Býložravec jí rostliny. Sova rostliny nejí, loví zvířata."],
      ["Všežravec", "Všežravec jí rostliny i živočichy. Sova se živí jen ulovenými zvířaty."],
      ["Producent", "Producent si sám vyrábí potravu ze světla — to umí rostliny, ne sova."],
    ],
    h: [
      "Myš i drobný pták jsou živočichové. Co to říká o sovím jídelníčku?",
      "Zeptej se, jestli sova jí i nějaké rostliny. Pokud ne a všechno, co jí, musí ulovit, víš, do které skupiny podle potravy patří.",
    ],
    e: "Sova se živí jen živočichy, které uloví — myšmi a drobnými ptáky. Kdo jí jen jiné živočichy, je masožravec.",
  },
  {
    q: "Divoké prase jí žaludy a kořínky, ale i žížaly a myši. Jaké je podle potravy?",
    a: "Všežravec",
    d: [
      ["Býložravec", "Žaludy a kořínky jsou rostliny, ale prase jí i žížaly a myši — tedy nejen rostliny."],
      ["Masožravec", "Žížaly a myši jsou živočichové, ale prase jí i žaludy a kořínky — tedy nejen maso."],
      ["Rozkladač", "Rozkladač rozkládá odumřelé zbytky. Prase jí čerstvou potravu."],
    ],
    h: [
      "Rozděl potravu divokého prasete na dvě hromádky: rostliny a živočichy.",
      "Žaludy a kořínky patří na jednu hromádku, žížaly a myši na druhou. Když živočich jí z obou hromádek, nepatří ani mezi býložravce, ani mezi masožravce.",
    ],
    e: "Divoké prase jí rostliny (žaludy, kořínky) i živočichy (žížaly, myši). Kdo jí obojí, je všežravec.",
  },
  {
    q: "Na podzim v lese opadá listí a do jara skoro zmizí. Kdo ho rozloží na hlínu?",
    a: "Houby, žížaly a bakterie v půdě",
    d: [
      ["Veverky, které listí odnášejí", "Veverky sbírají šišky a oříšky, listí neodnášejí a nerozkládají."],
      ["Vítr, který listí odfoukne", "Vítr listí jen přesune jinam, na hlínu ho nepromění."],
      ["Srnci, kteří suché listí sežerou", "Srnci jedí čerstvé listy a výhonky, suché opadané listí nerozkládají."],
    ],
    h: [
      "Hledej organismy, které pracují přímo v půdě a živí se odumřelými zbytky.",
      "Opadané listí se nepřesune jinam, ale postupně se rozpadne na úrodnou hlínu. Takovou práci dělají drobné organismy v zemi — říká se jim rozkladači.",
    ],
    e: "Opadané listí rozkládají houby, žížaly a bakterie v půdě. Jsou to rozkladači: z odumřelých zbytků udělají hlínu, ze které rostliny znovu berou živiny.",
  },
  {
    q: "Který organismus si v lese vyrábí potravu sám ze světla, vody a vzduchu?",
    a: "Buk",
    d: [
      ["Hřib", "Hřib je houba. Houby nemají zelené listy a potravu ze světla neumí vyrobit."],
      ["Srnec", "Srnec potravu nevyrábí, jí rostliny."],
      ["Datel", "Datel potravu nevyrábí, loví hmyz ve dřevě."],
    ],
    h: [
      "Potravu ze světla umí vyrobit jen organismy se zelenými listy.",
      "Zvířata musí potravu sníst nebo ulovit a houby ji berou z odumřelých zbytků. Hledej v nabídce ten jediný organismus, který má zelené listy — takovému organismu se říká producent.",
    ],
    e: "Buk je strom. Zelenými listy zachytí světlo a z vody a vzduchu si vyrobí potravu — je to producent. Hřib, srnec ani datel to neumí.",
  },
  {
    q: "Který z těchto živočichů patří mezi rozkladače?",
    a: "Žížala",
    d: [
      ["Kobylka", "Kobylka jí čerstvou trávu, odumřelé zbytky nerozkládá."],
      ["Liška", "Liška loví myši a další zvířata — je to lovec, ne rozkladač."],
      ["Veverka", "Veverka jí semena a oříšky, odumřelé listí nerozkládá."],
    ],
    h: [
      "Rozkladač se živí odumřelými zbytky rostlin a zvířat a mění je na hlínu.",
      "Vzpomeň si, kdo žije v půdě, zatahuje do ní opadané listí a po dešti vylézá na povrch. Ostatní živočichové ze seznamu jedí čerstvou potravu.",
    ],
    e: "Žížala zatahuje do půdy opadané listí a tráví ho — mění odumřelé zbytky na úrodnou hlínu. Proto patří mezi rozkladače.",
  },
  {
    q: "Proč na poli roste většinou jen jedna plodina?",
    a: "Zasel ji tam člověk, který ji chce sklidit",
    d: [
      ["Jiné rostliny tam vůbec nemohou růst", "Mohou — mezi obilím rostou plevele jako chrpa nebo mák, zemědělec je jen odstraňuje."],
      ["Tak to v přírodě vzniklo samo od sebe", "Pole samo nevzniklo. Samo od sebe roste louka nebo les, pole zakládá člověk."],
      ["Zvířata sežrala všechny ostatní rostliny", "Zvířata na poli nevybírají, co tam poroste. O plodině rozhoduje člověk."],
    ],
    h: [
      "Zamysli se, kdo o poli rozhoduje: příroda, nebo zemědělec?",
      "Louka a les rostou samy a je v nich mnoho druhů rostlin. Pole se každý rok oře a oseje — rozmysli, proč tam pak roste hlavně jeden druh.",
    ],
    e: "Pole je prostředí, které vytvořil člověk. Zaseje jednu plodinu, třeba pšenici, a plevele odstraňuje, aby měl co největší úrodu.",
  },
  {
    q: "Čím se louka liší od pole?",
    a: "Louka roste sama, pole oseje člověk",
    d: [
      ["Louka i pole vznikly samy od sebe", "Pole samo nevzniká — zemědělec ho oře a oseje."],
      ["Na louce roste jen jedna rostlina", "Je to naopak: louka má mnoho druhů trav a bylin, pole většinou jednu plodinu."],
      ["Pole je vždy mokré, louka suchá", "Vlhkost s tím nesouvisí. Rozdíl je v tom, kdo prostředí vytvořil."],
    ],
    h: [
      "Zamysli se, co musí zemědělec udělat na poli a co na louce ne.",
      "Na louce roste mnoho druhů trav a květin, které tam nikdo nezasel; louka se jen jednou dvakrát do roka poseče. Na poli každé jaro oře traktor a do země se sejí zrna.",
    ],
    e: "Louku tvoří trávy a byliny, které rostou samy, člověk ji jen poseče. Pole člověk zorá a oseje jednou plodinou, kterou pak sklidí.",
  },
  {
    q: "Jak se jmenuje místo v přírodě, kde spolu žijí rostliny a živočichové a navzájem se potřebují?",
    a: "Ekosystém",
    d: [
      ["Potravní řetězec", "Potravní řetězec je jen pořadí, kdo koho jí. Ekosystém je celé společenství i s prostředím."],
      ["Počasí", "Počasí popisuje déšť, slunce a vítr, ne společenství rostlin a živočichů."],
      ["Zahrádka", "Zahrádku zakládá člověk pro sebe; hledáme obecný název pro les, louku, pole i rybník."],
    ],
    h: [
      "Hledej jeden společný název, který se hodí na les, louku, pole i rybník.",
      "Pozor, jedna možnost popisuje jen to, kdo koho jí. Hledáš širší pojem: celé místo s rostlinami, živočichy, vodou, půdou a vzduchem, které k sobě patří.",
    ],
    e: "Ekosystém je místo, kde spolu žijí rostliny a živočichové a potřebují se navzájem — například les, louka, pole nebo rybník.",
  },
];

const L3: U[] = [
  {
    q: "Šipka znamená „je potravou pro“. Který potravní řetězec z louky je seřazený správně?",
    a: "tráva → kobylka → žába → čáp",
    d: [
      ["čáp → žába → kobylka → tráva", "Řetězec je obráceně. Na začátku musí být rostlina, protože ta nikoho nejí."],
      ["kobylka → tráva → žába → čáp", "Tráva kobylku nejí. Řetězec musí začínat rostlinou."],
      ["tráva → žába → kobylka → čáp", "Žába trávu nejí a kobylka žábu neuloví — tyhle dva články jsou prohozené."],
    ],
    h: [
      "Začni tím, kdo nikoho nejí a potravu si vyrobí sám.",
      "Postupuj krok za krokem: kdo jí trávu? Kdo pak loví toho, kdo jí trávu? A kdo loví jeho? U každé šipky se zeptej, jestli ten vpravo opravdu jí toho vlevo.",
    ],
    e: "Kobylka jí trávu, žába loví kobylky a čáp loví žáby. Řetězec proto začíná rostlinou a končí největším lovcem.",
  },
  {
    q: "Šipka znamená „je potravou pro“. Který potravní řetězec z lesa je seřazený správně?",
    a: "list → housenka → sýkora → jestřáb",
    d: [
      ["jestřáb → sýkora → housenka → list", "Řetězec je obráceně. List nikoho nejí, a proto stojí na začátku."],
      ["housenka → list → sýkora → jestřáb", "List housenku nejí — je to naopak. Na začátku musí být rostlina."],
      ["list → sýkora → housenka → jestřáb", "Sýkora listy nejí a housenka sýkoru neuloví — tyhle dva články jsou prohozené."],
    ],
    h: [
      "Který člen řetězce je rostlina? Ten patří na začátek.",
      "Pak hledej, kdo tu rostlinu okusuje, kdo loví toho okusovače a kdo je nakonec největší lovec. U každé šipky ověř, že ten vpravo jí toho vlevo.",
    ],
    e: "Housenka okusuje listy, sýkora loví housenky a jestřáb loví sýkory. Proto řetězec začíná listem a končí dravcem.",
  },
  {
    q: "Doplň chybějící článek potravního řetězce: tráva → ? → liška",
    a: "zajíc",
    d: [
      ["pampeliška", "Pampeliška je rostlina — trávu nejí a patřila by na začátek řetězce."],
      ["vlk", "Vlk trávu nejí, loví jiná zvířata. Na místo otazníku patří ten, kdo trávu jí."],
      ["hřib", "Hřib je houba. Trávu nejí a liška se houbami neživí."],
    ],
    h: [
      "Na místo otazníku patří někdo, kdo jí trávu a sám může být kořistí lišky.",
      "Ověř obě šipky zvlášť: první říká, že tvůj organismus jí trávu, druhá, že ho uloví liška. Rostlina ani lovec ani houba obě podmínky nesplní.",
    ],
    e: "Zajíc jí trávu a liška loví zajíce, takže sedí na obou stranách otazníku. Jiná rostlina by trávu nejedla a vlk ani houba se trávou neživí.",
  },
  {
    q: "Doplň chybějící článek potravního řetězce: list → housenka → ? → jestřáb",
    a: "sýkora",
    d: [
      ["srnec", "Srnec housenky nejí, okusuje listy a trávu."],
      ["buk", "Buk je strom, tedy rostlina — patří na začátek řetězce, ne doprostřed."],
      ["liška", "Liška housenky nesbírá a jestřáb lišku neuloví — je na něj moc velká."],
    ],
    h: [
      "Hledej živočicha, který jí housenky a jestřáb ho dokáže ulovit.",
      "Musí platit obě šipky: tvůj živočich sbírá housenky a zároveň je dost malý na to, aby ho jestřáb chytil. Zkus každou možnost dosadit a obě šipky přečíst nahlas.",
    ],
    e: "Sýkora sbírá housenky na listech a jestřáb loví drobné ptáky, jako je sýkora. Obě šipky proto platí jen pro ni.",
  },
  {
    q: "Na louce platí řetězec tráva → kobylka → žába → čáp. Zmizí všechny kobylky. Komu ubude potravy nejdřív?",
    a: "Žábám, které kobylky loví",
    d: [
      ["Čápům, kteří loví žáby", "Čáp to pocítí také, ale až později, až ubude žab. Nejdřív přijde o potravu ten, kdo kobylky jí přímo."],
      ["Trávě, kterou kobylky jedí", "Tráva potravu nepotřebuje, vyrábí si ji sama. Bez kobylek ji naopak nikdo neokusuje."],
      ["Všem najednou stejně", "Změna se šíří řetězcem postupně — nejdřív ji pocítí nejbližší článek."],
    ],
    h: [
      "Najdi v řetězci článek, který stojí hned za kobylkou.",
      "Kdo kobylky přímo jí, přijde o potravu okamžitě. Kdo jí až toho lovce kobylek, to pocítí o krok později. A kdo stojí před kobylkou, ten potravu nijak neztratí.",
    ],
    e: "Kobylky jsou potravou žab. Když kobylky zmizí, žáby přijdou o potravu jako první; čápi to pocítí až potom, když ubude žab.",
  },
  {
    q: "Na louce zmizely všechny kobylky. Co se nejspíš stane s trávou?",
    a: "Přibude jí, protože ji nikdo neokusuje",
    d: [
      ["Uschne, protože jí kobylky nosily vodu", "Kobylky trávě vodu nenosí. Vodu tráva bere kořeny z půdy."],
      ["Nic, tráva a kobylky spolu nesouvisí", "Souvisí — kobylky trávu jedí, takže když zmizí, trávy zůstane víc."],
      ["Také zmizí, protože bez kobylek neroste", "Tráva kobylky k růstu nepotřebuje, vyrábí si potravu sama ze světla."],
    ],
    h: [
      "Vzpomeň si, co kobylka s trávou dělá, když na louce žije.",
      "Když zmizí ten, kdo trávu jí, zeptej se: kdo ji teď okusuje? Tráva ke svému růstu kobylku nepotřebuje — vodu bere z půdy a potravu si vyrábí sama.",
    ],
    e: "Kobylky trávu jedí. Když zmizí, nikdo ji neokusuje, a trávy proto přibude. Tráva kobylky k životu nepotřebuje.",
  },
  {
    q: "Zemědělec postříkal pole jedem proti hmyzu. Proč pak může ubýt i koroptví?",
    a: "Mláďata koroptví se živí hmyzem, který zmizel",
    d: [
      ["Koroptve jedí jed místo semen", "Koroptve jed cíleně nejedí. Škodí jim hlavně to, že zmizí jejich potrava."],
      ["Postřik zničí všechno obilí", "Postřik proti hmyzu obilí nezničí — ničí hmyz."],
      ["Koroptve se hmyzu bojí a odletí", "Koroptve se hmyzu nebojí, naopak ho jedí."],
    ],
    h: [
      "Zamysli se, co mladé koroptve v prvních týdnech života jedí.",
      "Postřik zabije hmyz. Pak se zeptej, komu ten hmyz sloužil jako potrava — a co se stane s tím, kdo najednou nemá co jíst.",
    ],
    e: "Mladé koroptve se živí hlavně hmyzem. Když postřik hmyz zničí, mláďata nemají co jíst, a koroptví proto ubývá.",
  },
  {
    q: "Rybník v létě úplně vyschl. Co se stane s kaprem, leknínem a vydrou?",
    a: "Kapr a leknín zahynou, vydra odejde k jiné vodě",
    d: [
      ["Všichni tři se přestěhují na louku", "Kapr ani leknín se přestěhovat nemůžou a na louce by nepřežili."],
      ["Kapr a leknín počkají do deště", "Kapr bez vody nedýchá a leknín bez vody uschne — tak dlouho nevydrží."],
      ["Vydra zahyne, kapr přežije v bahně", "Je to naopak: vydra umí přejít po souši jinam, kapr bez vody zahyne."],
    ],
    h: [
      "U každého ze tří obyvatel se zeptej: dokáže bez vody přežít, nebo odejít jinam?",
      "Ryba dýchá žábrami jen ve vodě a rostlina má kořeny v bahně, takže ani jedna nemůže odejít. Savec, který umí chodit po souši, si může najít jiný rybník nebo řeku.",
    ],
    e: "Kapr bez vody nedýchá a leknín bez vody uschne. Vydra je savec — dojde po souši k jiné řece nebo rybníku.",
  },
  {
    q: "Proč by les bez hub, žížal a bakterií brzy zavalilo listí?",
    a: "Nikdo by opadané listí nerozložil na hlínu",
    d: [
      ["Houby a žížaly listí sbírají a odnášejí", "Neodnášejí ho — rozkládají ho přímo na místě na hlínu."],
      ["Bez hub by stromy shazovaly víc listí", "Kolik listí strom shodí, na houbách nezávisí."],
      ["Houby sežerou listí ještě na stromech", "Houby nerostou v korunách, rozkládají až opadané listí na zemi."],
    ],
    h: [
      "Vzpomeň si, co houby, žížaly a bakterie dělají s odumřelými zbytky.",
      "Každý podzim spadne v lese obrovské množství listí. Když zjara skoro zmizí, někdo ho musel přeměnit na hlínu. Představ si, že tihle pracovníci chybí.",
    ],
    e: "Houby, žížaly a bakterie jsou rozkladači — mění opadané listí na hlínu. Bez nich by se listí rok co rok hromadilo a stromy by neměly živiny.",
  },
  {
    q: "Proč stojí na začátku každého potravního řetězce rostlina?",
    a: "Jen rostlina si umí vyrobit potravu sama",
    d: [
      ["Protože je vždy největší", "Velikost nerozhoduje — tráva je menší než kobylka, a přesto je na začátku."],
      ["Protože ji jedí úplně všichni živočichové", "Masožravci rostliny nejedí. Rozhoduje, že rostlina nikoho jíst nemusí."],
      ["Protože se nemůže pohybovat", "Nepohybují se i houby, a na začátku nejsou. Rozhoduje, jak rostlina získá potravu."],
    ],
    h: [
      "Zeptej se, odkud bere potravu první článek řetězce, když nikoho nejí.",
      "Každý živočich musí svou potravu sníst — rostlinu nebo jiného živočicha. Řetězec proto musí začít tím, kdo potravu nikomu nebere a zvládne ji vyrobit ze světla, vody a vzduchu.",
    ],
    e: "Rostlina je producent: potravu si vyrobí ze světla, vody a vzduchu. Všichni ostatní v řetězci ji musí sníst, a proto rostlina stojí na začátku.",
  },
  {
    q: "V lese přibylo lišek. Co se nejspíš stane s počtem myší?",
    a: "Ubude jich, protože je lišky loví",
    d: [
      ["Přibude jich, protože lišky vyženou sovy", "Lišky sovy nevyhánějí. Víc lovců myší znamená méně myší."],
      ["Nezmění se, lišky myši nejí", "Lišky myši loví — myši jsou jejich častá potrava."],
      ["Ubude jich, protože lišky sní jejich semena", "Výsledek sedí, ale důvod ne: lišky semena nejedí, ubývá myší, protože je lišky loví."],
    ],
    h: [
      "Vzpomeň si, co lišky nejčastěji loví.",
      "Když přibude lovců, co se stane s jejich kořistí? Pozor, jedna možnost má správný výsledek, ale špatné vysvětlení — zkontroluj i důvod.",
    ],
    e: "Myši jsou potravou lišek. Když lišek přibude, uloví víc myší, a myší proto ubude.",
  },
  {
    q: "Veverka na podzim zakope žaludy a některé zapomene. Co z toho má les?",
    a: "Ze zapomenutých žaludů vyrostou nové duby",
    d: [
      ["Ze žaludů vyrostou v zemi houby", "Houby ze žaludů nevyrůstají. Žalud je semeno dubu."],
      ["Nic, žaludy se v zemi ztratí", "Neztratí — žalud je semeno a v zemi může vyklíčit."],
      ["Veverka tím les ničí", "Naopak, veverka tím pomáhá stromům dostat se na nová místa."],
    ],
    h: [
      "Žalud je semeno. Co se se semenem stane, když zůstane v zemi?",
      "Veverka zakope žaludy na různých místech lesa a na některé zapomene. Semeno v hlíně má vodu i teplo — představ si, co z něj za několik let vyroste.",
    ],
    e: "Žalud je semeno dubu. Zapomenutý žalud v zemi vyklíčí a vyroste z něj nový dub — veverka tak pomáhá les rozšiřovat.",
  },
  {
    q: "Proč má kobylka zelenou barvu jako tráva?",
    a: "V trávě ji ptáci a žáby hůř uvidí",
    d: [
      ["Aby ji čáp snadno našel", "Je to naopak — zelená barva ji před čápem schová."],
      ["Protože jí trávu a tím zezelená", "Barvu nemá z jídla, s ní se narodí."],
      ["Aby si vyráběla potravu ze světla", "Potravu ze světla umí jen rostliny, kobylka ji musí sníst."],
    ],
    h: [
      "Zamysli se, kdo kobylky loví a jak je hledá.",
      "Lovci hledají kořist očima. Představ si zelenou kobylku na zeleném stéble — jak snadno ji uvidíš? Barva, která splývá s okolím, pomáhá přežít.",
    ],
    e: "Zelená kobylka v zelené trávě splývá s okolím, takže ji ptáci a žáby hůř najdou. Takové barvě se říká ochranné zbarvení.",
  },
];

function gen(level: number): PracticeTask[] {
  const bank = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(bank).map(uloha);
}

export const EKOSYSTEMYPOLLOUKAES: TopicMetadata[] = [
  {
    id: "g3-prvouka-rozmanitost-prirody-ekosystemy-pole-louka-les-voda-jednoduche-ekosystemy",
    title: "Ekosystémy: pole, louka, les, voda",
    studentTitle: "Příroda kolem nás",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Ekosystémy",
    briefDescription: "Poznáš různá přírodní prostředí a jejich obyvatele.",
    illustrationDesc:
      "dítě stojí na okraji lesa s výhledem na louku, rybník a pole, v ruce drží lupu a pozoruje kobylku na stéblu trávy",
    keywords: [
      "ekosystém",
      "louka",
      "les",
      "pole",
      "rybník",
      "voda",
      "kobylka",
      "motýl",
      "krtok",
      "pampeliška",
      "jetel",
      "čáp",
      "srnec",
      "veverka",
      "sova",
      "liška",
      "houby",
      "mech",
      "borůvky",
      "bažant",
      "koroptev",
      "obilniny",
      "mák",
      "chrpa",
      "vydra",
      "kapr",
      "rákos",
      "leknín",
      "volavka",
      "producent",
      "konzument",
      "rozkladač",
      "potravní řetězec",
    ],
    goals: [
      "Pojmenovat alespoň 3 typické organismy louky, lesa, pole a vody.",
      "Vysvětlit, co je producent, konzument a rozkladač.",
      "Sestavit jednoduchý potravní řetězec (tráva → kobylka → ježek → liška).",
      "Přiřadit zvíře ke správnému ekosystému.",
    ],
    boundaries: [
      "Jednoduchá příroda pro 3. třídu — bez složitých ekologických modelů.",
      "Potravní řetězec jen na 3–4 článcích, bez energetických pyramid.",
      "Bez latinských názvů.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Louka: kobylka, motýl, pampeliška, čáp. Les: srnec, veverka, sova, houby, mech, borůvky. Pole: bažant, koroptev, obilniny, chrpa. Voda: vydra, kapr, leknín, volavka.",
      steps: [
        "Zamysli se, kde dané zvíře nebo rostlinu vídáme.",
        "Louka = travnatá plocha s bylinkami. Les = stromy, stín, houby.",
        "Pole = orná půda s obilím a zeleninou. Voda/rybník = mokré prostředí.",
        "Potravní řetězec: začíná rostlinou (producent), pokračuje živočichy (konzumenti).",
      ],
      commonMistake:
        "Čáp loví na loukách, ne v lese. Volavka stojí u vody, ne na poli. Kobylka žije na louce, ne na poli.",
      example:
        "Potravní řetězec louky: tráva → kobylka → ježek → liška. Tráva je producent, ostatní jsou konzumenti.",
    },
  },
];
