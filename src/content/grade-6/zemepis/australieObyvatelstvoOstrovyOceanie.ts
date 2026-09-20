/**
 * Zeměpis 6. ročník — Austrálie a Oceánie: obyvatelstvo, hospodářství, ostrovy (select_one).
 *
 * Celé téma emituje jen úlohy s možnostmi (žádné míchání typů). K obsahu nejsou
 * mapy ani obrázky, poloha se proto popisuje slovy (oceán, rovník, světadíl).
 *
 * Gradace:
 *  • L1 — banka faktů: Austrálie je stát i světadíl, Canberra, Aboriginci a
 *    přistěhovalci, angličtina, města u pobřeží, ovce, skot, železná ruda a uhlí,
 *    Nový Zéland (Wellington, Maorové), Oceánie a její tři oblasti, tři typy ostrovů.
 *  • L2 — příčina → důsledek: sucho ve vnitrozemí → řídké osídlení a velké
 *    farmy; sopečný ostrov × atol → půda a obživa; malý ostrov → dovoz a turismus.
 *  • L3 — přenos: poznej typ ostrova nebo oblast z popisu, rozhodni o návrhu
 *    (město, farma), vysvětli ohrožení atolu vzestupem hladiny, srovnej státy.
 *
 * Chybový model: největší město = hlavní město; osídlení uprostřed světadílu;
 * atol jako sopka; Nový Zéland jako část Austrálie; Maorové v Austrálii;
 * Aboriginci jako většina dnešních obyvatel.
 *
 * Rotace šablon se nastavuje uvnitř gen(), modul nedrží žádný stav.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import {
  shuffle,
  losUlohy,
  ruzneUlohy,
  buildChoiceTask as choice,
  type Distractor,
} from "./_shared";

type Tvurce = () => PracticeTask | null;

/** Úloha nesmí obsahovat klíč ve znění ani v nápovědě — jinak ji vylosujeme znovu. */
function hlidej(t: PracticeTask | null): PracticeTask | null {
  if (!t) return null;
  if (t.question.includes(t.correctAnswer)) return null;
  for (const h of t.hints ?? []) if (h.includes(t.correctAnswer)) return null;
  return t;
}

interface Fakt {
  q: string;
  key: string;
  d: [string, string][];
  hints: [string, string];
  explanation: string;
}

const f = (
  q: string,
  key: string,
  d: [string, string][],
  h0: string,
  h1: string,
  explanation: string,
): Fakt => ({ q, key, d, hints: [h0, h1], explanation });

const fakt = (x: Fakt): PracticeTask | null =>
  hlidej(
    choice(
      x.q,
      x.key,
      x.d.map(([value, why]): Distractor => ({ value, why })),
      { hints: x.hints, explanation: x.explanation },
    ),
  );

// ── L1: banka faktů ────────────────────────────────────────────────────────

const BANKA_L1: Fakt[] = [
  f(
    "Co je Austrálie?",
    "stát i světadíl zároveň",
    [
      ["jen světadíl, ale žádný stát", "Austrálie je světadíl, ale zároveň i samostatný stát se svou vládou a hlavním městem."],
      ["jen stát, ale žádný světadíl", "Austrálie je stát, ale zároveň je to nejmenší světadíl."],
      ["obří ostrov, který patří k Asii", "K Asii Austrálie nepatří. Je to samostatný světadíl, od Asie ji odděluje moře."],
    ],
    "Vzpomeň si, kolik má svět světadílů a zda je na seznamu i Austrálie.",
    "Zkus si vybavit dvě věci: jestli má Austrálie vlastní vládu a hlavní město, a jestli se počítá mezi světadíly. Pak vyber možnost, která odpovídá oběma zjištěním.",
    "Austrálie je zvláštní tím, že jeden celek je zároveň světadílem i státem. Žádný jiný světadíl netvoří jediný stát.",
  ),
  f(
    "Které město je hlavním městem Austrálie?",
    "Canberra",
    [
      ["Sydney", "Sydney je jedno z největších měst, ale hlavní není. Velké město ještě nemusí být hlavní."],
      ["Melbourne", "Melbourne je také jedno z největších měst, hlavním městem se nestalo."],
      ["Perth", "Perth leží na západním pobřeží a hlavním městem není."],
    ],
    "Hlavní město nemusí být největší. Vzpomeň si, proč se muselo postavit nové.",
    "Dvě největší města se nemohla dohodnout, které z nich bude hlavní, a proto vzniklo město zcela nové jako kompromis. Hledej proto jméno, které není mezi dvěma největšími.",
    "Hlavním městem Austrálie je Canberra. Byla postavena jako kompromis mezi Sydney a Melbourne, které o prvenství soupeřily.",
  ),
  f(
    "Jak se nazývají původní obyvatelé Austrálie?",
    "Aboriginci",
    [
      ["Maorové", "Maorové jsou původní obyvatelé Nového Zélandu, ne Austrálie."],
      ["Inuité", "Inuité žijí v Arktidě, ne v Austrálii."],
      ["Indiáni", "Indiáni jsou původní obyvatelé Ameriky."],
    ],
    "Vybírej podle světadílu: každý světadíl má své původní obyvatele.",
    "Zúž výběr podle toho, kde která skupina původně žila. Tři ze čtyř skupin žijí úplně jinde než v Austrálii.",
    "Původními obyvateli Austrálie jsou Aboriginci. Žijí tam desítky tisíc let, mnohem déle než přistěhovalci z Evropy.",
  ),
  f(
    "Kdo tvoří většinu dnešních obyvatel Austrálie?",
    "potomci přistěhovalců, hlavně z Evropy",
    [
      ["Aboriginci, původní obyvatelé světadílu", "Aboriginci jsou původní obyvatelé, ale dnes tvoří jen menší část obyvatel."],
      ["Maorové, kteří přišli z Nového Zélandu", "Maorové žijí hlavně na Novém Zélandu, ne v Austrálii."],
      ["potomci přistěhovalců, hlavně z Ameriky", "Do Austrálie se stěhovali hlavně Evropané, zejména Britové, ne Američané."],
    ],
    "Připomeň si, odkud se do Austrálie stěhovali lidé po objevení světadílu.",
    "Původní obyvatelé jsou dnes v menšině. Většina lidí má předky, kteří se přistěhovali v posledních staletích z jiných světadílů.",
    "Většinu dnešních Australanů tvoří potomci přistěhovalců, hlavně z Evropy. Aboriginci jsou původní obyvatelé, ale dnes jsou menšinou.",
  ),
  f(
    "Který jazyk je v Austrálii nejběžnější, dorozumíš se jím skoro všude?",
    "angličtina",
    [
      ["aboriginština", "Aboriginci mají mnoho vlastních jazyků, ale většina Australanů jimi nemluví."],
      ["španělština", "Španělsky se mluví hlavně v Jižní Americe, ne v Austrálii."],
      ["maorština", "Maorština je jazyk původních obyvatel Nového Zélandu."],
    ],
    "Vzpomeň si, ze které evropské země do Austrálie přišli první osadníci.",
    "První osadníci přišli z Velké Británie a jejich jazyk se v zemi rozšířil nejvíc. Ostatní jazyky ve výběru patří jiným místům.",
    "Nejběžnějším jazykem Austrálie je angličtina, kterou tam přinesli britští osadníci. Zákonem stanovený úřední jazyk Austrálie nemá.",
  ),
  f(
    "Kde leží největší australská města, například Sydney a Melbourne?",
    "poblíž oceánského pobřeží",
    [
      ["uprostřed světadílu v poušti", "Střed Austrálie je poušť bez vody. Velká města tam nejsou."],
      ["vysoko v horách ve vnitrozemí", "Velká města nestojí v horách ve vnitrozemí, ale u moře."],
      ["u jezer uprostřed světadílu", "Jezera uprostřed Austrálie bývají vyschlá nebo slaná, velká města tam nestojí."],
    ],
    "Rozmysli si, kde je víc vody a kam mohou přijet lodě.",
    "Lidé se usazují tam, kde je dost vody a kde se dá obchodovat. Vzpomeň si, kde je v Austrálii vlhčí podnebí.",
    "Největší města Austrálie leží u pobřeží. Tam prší více a jsou tam přístavy, zatímco ve vnitrozemí je poušť.",
  ),
  f(
    "Co získávají Australané ve velkém z chovu ovcí?",
    "vlnu",
    [
      ["hedvábí", "Hedvábí dávají housenky bource morušového, ne ovce."],
      ["kaučuk", "Kaučuk se získává ze stromů v tropech."],
      ["bavlnu", "Bavlna je rostlina, kdežto ovce dávají materiál ze srsti."],
    ],
    "Ovce mají hustou srst, kterou lidé pravidelně stříhají.",
    "Zamysli se, z čeho se vyrábějí teplé svetry, a vyber materiál, který vzniká právě ze zvířecí srsti.",
    "Austrálie patří mezi největší světové producenty vlny. Na velkých farmách se chovají obrovská stáda ovcí.",
  ),
  f(
    "Které zvíře se v Austrálii chová na velkých pastvinách hlavně kvůli hovězímu masu?",
    "kráva",
    [
      ["lama", "Lamy se chovají v Andách v Jižní Americe."],
      ["kůň", "Koně se chovají na jízdu a práci, ne hlavně na maso."],
      ["sob", "Sob žije v chladných oblastech severu, ne v Austrálii."],
    ],
    "Hovězí maso pochází ze zvířete, které dává také mléko.",
    "Vyber hospodářské zvíře, ze kterého se vyrábí hovězí maso a které se chová na rozlehlých travnatých plochách.",
    "V Austrálii se na velkých farmách chová dobytek, hlavně krávy kvůli hovězímu masu.",
  ),
  f(
    "Které suroviny se v Austrálii těží nejvíc?",
    "železná ruda a uhlí",
    [
      ["kaučuk a kakao", "Kaučuk a kakao jsou tropické plodiny, netěží se v dolech."],
      ["mramor a žula", "Mramor a žula se sice lámou, ale k hlavním vývozním surovinám nepatří."],
      ["zlato a diamanty", "Zlato a diamanty se sice těží, ale nejvíc se těží a vyváží jiné suroviny."],
    ],
    "Australské doly vyvážejí suroviny pro hutě a elektrárny.",
    "Hledej dvě suroviny, které se těží v dolech a používají se na výrobu oceli a energie. Plodiny z tropů do dolů nepatří.",
    "Austrálie těží ve velkém železnou rudu a uhlí a vyváží je do celého světa.",
  ),
  f(
    "Které ostrovy tvoří hlavní část Nového Zélandu?",
    "Severní a Jižní ostrov",
    [
      ["Severní ostrov a Tasmánie", "Tasmánie je ostrov u Austrálie, ne součást Nového Zélandu."],
      ["Jižní ostrov a Nová Guinea", "Nová Guinea je ostrov mnohem severněji, u rovníku."],
      ["Severní ostrov a Fidži", "Fidži je samostatný stát v tropech, není součástí Nového Zélandu."],
    ],
    "Ostrovy se jmenují podle světové strany, na které leží.",
    "Stát má dva hlavní ostrovy. Jejich jména odpovídají dvěma světovým stranám a nepřipomínají jiné státy.",
    "Nový Zéland tvoří dva hlavní ostrovy, Severní a Jižní. Leží daleko od Austrálie a je to samostatný stát.",
  ),
  f(
    "Které město je hlavním městem Nového Zélandu?",
    "Wellington",
    [
      ["Auckland", "Auckland je největší město, ne hlavní."],
      ["Sydney", "Sydney leží v Austrálii, ne na Novém Zélandu."],
      ["Canberra", "Canberra je hlavní město Austrálie."],
    ],
    "Nový Zéland je samostatný stát, který má vlastní hlavní město.",
    "Dvě z nabízených měst leží v Austrálii. Ze zbylých dvou vyber to, které není největším městem.",
    "Hlavním městem Nového Zélandu je Wellington. Největším městem je Auckland.",
  ),
  f(
    "Jak se nazývají původní obyvatelé Nového Zélandu?",
    "Maorové",
    [
      ["Aboriginci", "Aboriginci jsou původní obyvatelé Austrálie, ne Nového Zélandu."],
      ["Inuité", "Inuité žijí v Arktidě."],
      ["Sámové", "Sámové žijí na severu Evropy."],
    ],
    "Nový Zéland má vlastní původní obyvatele, jiné než Austrálie.",
    "Dvě skupiny ve výběru žijí ve studených oblastech severu. Vyber tu, která patří k tichomořským ostrovům, ne k Austrálii.",
    "Původními obyvateli Nového Zélandu jsou Maorové. Žijí tam dodnes a jejich jazyk a kultura jsou součástí státu.",
  ),
  f(
    "Co je Oceánie?",
    "tisíce ostrovů roztroušených v Tichém oceánu",
    [
      ["jen samotný světadíl Austrálie", "Oceánie zahrnuje i tisíce dalších ostrovů, nejen Austrálii."],
      ["souostroví uprostřed Atlantského oceánu", "Oceánie leží v Tichém oceánu, ne v Atlantském."],
      ["pás ostrovů kolem Antarktidy", "Ostrovy kolem Antarktidy k Oceánii nepatří."],
    ],
    "V názvu se skrývá slovo oceán. Uvažuj, jaký oceán ostrovy tvoří.",
    "Oceánie není jeden velký kus souše, ale rozsáhlá oblast. Rozmysli, jestli jde o jediný ostrov, nebo o velmi mnoho ostrovů.",
    "Oceánie je oblast tisíců ostrovů v Tichém oceánu. Patří k ní Nový Zéland, Nová Guinea i drobné ostrůvky.",
  ),
  f(
    "Které tři oblasti tvoří Oceánii?",
    "Melanésie, Mikronésie a Polynésie",
    [
      ["Melanésie, Malajsie a Polynésie", "Malajsie k oblastem Oceánie nepatří, leží v Asii."],
      ["Mikronésie, Polynésie a Austrálie", "Austrálie je zvláštní světadíl, tři oblasti Oceánie tvoří jiné skupiny ostrovů."],
      ["Melanésie, Mikronésie a Indonésie", "Indonésie je asijský stát a třetí oblastí Oceánie není. Do Oceánie patří jen její východní část na Nové Guineji, jako oblast se ale nepočítá."],
    ],
    "Vzpomeň si, které skupiny ostrovů leží v Tichém oceánu a které názvy patří do Asie nebo k jiným celkům.",
    "Názvy tří oblastí Oceánie odkazují na vzhled ostrovů. Hledej trojici, ve které je každý název oblastí Oceánie, ne asijským státem nebo světadílem.",
    "Oceánie se dělí na Melanésii (černé ostrovy), Mikronésii (malé ostrovy) a Polynésii (mnoho ostrovů). Názvy vycházejí z řeckých slov.",
  ),
  f(
    "Jak se nazývá ostrov, který vyrostl ze ztuhlé lávy z hlubin Země?",
    "sopečný ostrov",
    [
      ["korálový atol", "Atol tvoří korály, ne láva."],
      ["pevninský ostrov", "Pevninský ostrov je kus světadílu oddělený mořem."],
      ["ledový ostrov", "Ledový ostrov se mezi tři typy ostrovů Oceánie nepočítá."],
    ],
    "Název typu prozrazuje, z čeho ostrov vznikl.",
    "Z čeho ostrov vznikl a jak je vysoký? Porovnej to s ostrovy z korálů a s ostrovy, které jsou kusem světadílu.",
    "Sopečný ostrov vznikl z lávy vyvržené sopkou z mořského dna. Bývá hornatý a má úrodnou půdu.",
  ),
  f(
    "Co je korálový atol?",
    "prstenec nízkých ostrůvků kolem laguny",
    [
      ["vysoká sopka s kráterem uprostřed moře", "To je sopečný ostrov, ne atol."],
      ["kus pevniny oddělený od světadílu mořem", "To je pevninský ostrov, atol je z korálů."],
      ["skalnatý ostrov s vysokými horami a řekami", "Atol je nízký a řeky na něm nejsou."],
    ],
    "Atol vzniká z korálů, které se v teplém moři usadily kolem starého ostrova.",
    "Atol nemá hory ani řeky. Jak vysoko nad hladinou asi leží, když ho postavili drobní živočichové v moři?",
    "Korálový atol je prstenec nízkých korálových ostrůvků kolem mělké laguny, sotva vyčnívající nad hladinu.",
  ),
  f(
    "Co je pevninský ostrov?",
    "kus světadílu oddělený mořem",
    [
      ["nízký prstenec z korálů kolem laguny", "To je korálový atol."],
      ["vyhaslá sopka vyčnívající z moře", "To je sopečný ostrov."],
      ["plovoucí ledová kra u pólu", "Ledová kra ostrovem v Oceánii není."],
    ],
    "Předpona pevnin- napovídá, k čemu ostrov dříve patřil.",
    "Pomoz si tím, že ostrov býval spojen se souší a moře jej odřízlo. Ostatní tvary vznikly jinak.",
    "Pevninský ostrov je část světadílu oddělená mořem. Žijí tam podobné druhy jako na pevnině.",
  ),
  f(
    "Kde leží ostrovy Oceánie?",
    "v Tichém oceánu",
    [
      ["v Atlantském oceánu", "Atlantský oceán leží mezi Amerikou a Evropou s Afrikou."],
      ["v Indickém oceánu", "Indický oceán leží u Indie a východní Afriky."],
      ["v Severním ledovém oceánu", "Severní ledový oceán leží kolem severního pólu."],
    ],
    "Zvol oceán, který je největší a leží mezi Asií a Amerikou.",
    "Přímo v názvu oblasti je slovo oceán. Připomeň si, který oceán je nejrozlehlejší a odděluje Ameriku od Asie.",
    "Ostrovy Oceánie leží v Tichém oceánu.",
  ),
];

// ── L2: příčina → důsledek ─────────────────────────────────────────────────

const BANKA_L2: Fakt[] = [
  f(
    "Proč žije většina Australanů při pobřeží?",
    "Vnitrozemí je suché a pouštní, lidé se drží blízko vody a přístavů.",
    [
      ["Vnitrozemí je zaplavené řekami a jezery, takže se tam bydlet nedá.", "Ve vnitrozemí je naopak nedostatek vody, ne její nadbytek."],
      ["Pobřeží leží blízko hor, kde je vzduch čistší a zdravější.", "Lidé se u pobřeží usazují kvůli vodě a přístavům, ne kvůli horskému vzduchu."],
      ["Pobřeží je jediné místo, kde stát povolil stavět města.", "Žádný takový zákaz neexistuje. Rozhodují přírodní podmínky."],
    ],
    "Uvažuj, kde je v Austrálii dost vody a jak se do ní dostanou lodě.",
    "Střed světadílu je velmi suchý a vzdálený od moře. Pomoz si otázkou, kde by se ti bydlelo pohodlněji: tam, kde prší, nebo v poušti.",
    "Většina Australanů žije u pobřeží, protože vnitrozemí je poušť a polopoušť. U moře prší a jsou tam přístavy.",
  ),
  f(
    "Proč jsou farmy s ovcemi ve vnitrozemí Austrálie obrovské a leží daleko od sebe?",
    "Půda je chudá a suchá, jedno zvíře potřebuje velkou plochu pastvy.",
    [
      ["Půda je tak úrodná, že stačí pár zvířat, aby se uživila.", "Ve vnitrozemí je půda suchá a tráva řídká, ne úrodná."],
      ["Ovce se musí každý den stěhovat k moři pro vodu.", "Ovce si vodu berou z vrtů a nádrží na farmě, k moři se nestěhují."],
      ["Ovce jsou plaché a nesnesou blízkost jiné farmy.", "Ovce blízké sousedy snesou. Odstup dělá řídká tráva, ne plachost."],
    ],
    "Zvaž, kolik trávy vyroste v suché krajině a kolik jí ovce potřebují.",
    "Když je tráva řídká, zvířatům jedno malé pole nestačí. Uvaž, co z toho plyne pro velikost farmy a její vzdálenost od sousedů.",
    "Ve vnitrozemí je málo srážek a tráva je řídká. Aby se stádo uživilo, potřebuje velkou plochu, proto jsou farmy obrovské a daleko od sebe.",
  ),
  f(
    "Děti z farem ve vnitrozemí se učí přes rádio nebo internet a lékař k nim létá letadlem. Proč?",
    "Škola i město jsou tak daleko, že se tam nedá dojet každý den.",
    [
      ["Děti z farem se učí doma, protože musí rodičům pomáhat s prací.", "Práce na farmě rozhodující není. Kdyby škola byla blízko, děti by do ní chodily."],
      ["Děti z farem jsou často nemocné, a proto nechodí do školy.", "Děti nechodí do školy proto, že je daleko, ne pro nemoc."],
      ["Letadla jsou v Austrálii mnohem levnější než auta, vlaky a kola.", "Letadlo je naopak drahé. Používá se tam, kde jiná cesta není."],
    ],
    "Zvaž, jak dlouho by dítě cestovalo do nejbližší školy, kdyby sousedé bydleli daleko.",
    "Osamělé farmy leží velmi daleko od měst. Rozhodni, co lidé použijí místo každodenní cesty za učitelem nebo lékařem.",
    "Farmy leží od sebe i od měst na velké vzdálenosti. Proto se děti učí na dálku a lékař přiletí letadlem.",
  ),
  f(
    "V nitru Austrálie je málo vody. Co z toho plyne pro počet lidí?",
    "Žije tam jen málo lidí, osídlení je velmi řídké.",
    [
      ["Nejvíc lidí žije právě uprostřed světadílu, protože je tam nejvíc místa.", "Volné místo samo nestačí, lidé potřebují vodu a živobytí."],
      ["Lidé se rovnoměrně rozprostřou po celém světadílu.", "Osídlení v Austrálii rozhodně není rovnoměrné. Většina lidí žije u pobřeží."],
      ["Osídlení je stejně husté jako u moře.", "U moře je osídlení mnohem hustší než ve vnitrozemí."],
    ],
    "Zvaž, co lidé pro život nutně potřebují a jestli to ve vnitrozemí najdou.",
    "Bez vody se nedá pěstovat ani chovat zvířata. Uvaž, kolik lidí se v takové krajině uživí ve srovnání s pobřežím.",
    "Ve vnitrozemí je sucho, proto tam žije málo lidí. Osídlení je řídké, na rozdíl od pobřeží.",
  ),
  f(
    "Které tvrzení vysvětluje, proč jsou půdy na sopečných ostrovech Oceánie úrodné?",
    "Sopečná hornina v půdě obsahuje živiny a hory zachytávají deště.",
    [
      ["Sopečný ostrov je celý z jemného písku, který dokonale drží vodu.", "Sopečný ostrov nevznikl z písku, ale z lávy a popela."],
      ["Na sopečných ostrovech neprší, proto rostlinám neškodí plísně.", "Na sopečných ostrovech naopak často prší, hory zachytávají vlhký vzduch."],
      ["Sopečné ostrovy leží vždy nejblíž rovníku, takže je na nich nejtepleji.", "Teplo samo úrodnost nedělá. Rozhoduje půda z horniny a dostatek vody."],
    ],
    "Zamysli se, z čeho se skládá sopečná půda a jaké látky do půdy vnáší.",
    "Vysoké hory zastavují vlhký vzduch od moře, který vypadává jako déšť. Porovnej to s tím, co ostrov získává z lávy a popela.",
    "Hornina ze sopky se rozpadá na úrodnou půdu a hory zachycují deště. Proto se na sopečných ostrovech dobře pěstují plodiny.",
  ),
  f(
    "Proč se na korálovém atolu daří hlavně kokosovým palmám a jiných plodin je málo?",
    "Atol má tenkou písčitou půdu z korálů a sladké vody je málo.",
    [
      ["Atol je celý pokrytý ledem, který půdu spaluje mrazem.", "Atoly leží v teplém moři, led tam není."],
      ["Atol leží vysoko v horách, kde je příliš chladno.", "Atol je nízký a sotva vyčnívá nad hladinu, horami není."],
      ["Atol je tvořen tvrdou lávou, kterou kořeny neprorostou.", "Povrch atolu tvoří korálový vápenec, který vyrostl kolem potopené sopky. Tvrdá láva na povrchu není."],
    ],
    "Vzpomeň si, z čeho se atol skládá, a zda tam může vzniknout hluboká úrodná půda.",
    "Nízký prstenec z korálů nemá hory ani řeky. Rozhodni, jaké zásoby vody a živin z toho plynou pro rostliny.",
    "Na atolu je půda tenká, písčitá a chudá a sladké vody je málo. Kokosové palmy to snesou, většina jiných plodin ne.",
  ),
  f(
    "Malý ostrov uprostřed oceánu si sám většinu zboží nevyrobí. Co z toho plyne?",
    "Zboží musí dovážet lodí nebo letadlem a bývá dražší.",
    [
      ["Nepotřebuje žádné zboží, vystačí si s tím, co vyroste na ostrově.", "Obyvatelé ostrova zboží potřebují, i když jsou daleko od světadílů."],
      ["Zboží dováží po souši ze sousedního světadílu.", "Mezi ostrovem a světadílem je moře, po souši se tam dojet nedá."],
      ["Zboží může kupovat jen od sousedního ostrova, dál plout nesmí.", "Takový zákaz neexistuje, lodě pluly po celém oceánu."],
    ],
    "Zvaž, jak se dostane zboží přes moře.",
    "Na malém ostrově chybí továrny i suroviny. Uvaž, po čem se zboží z jiných míst na ostrov přepravuje a co to udělá s jeho cenou.",
    "Malé ostrovní státy si většinu zboží nevyrobí, proto ho dovážejí lodí nebo letadlem. Přeprava přes oceán ceny zvyšuje.",
  ),
  f(
    "Malý ostrovní stát v Oceánii nemá žádné nerostné suroviny. Co z toho plyne pro zdroje jeho příjmů?",
    "Turismus a rybolov v okolních vodách.",
    [
      ["Těžba železné rudy a uhlí.", "Bez nerostných surovin se těžit nedá."],
      ["Velké obilné farmy na písčité půdě.", "Na písčité půdě obilí nevyroste, farmy tam nejsou."],
      ["Výroba automobilů a strojů pro export.", "Bez surovin a velkých továren se auta vyrábět nedají."],
    ],
    "Zvaž, co malý ostrov nabízí bez surovin: moře a krásnou přírodu.",
    "Vyluč ty možnosti, které potřebují doly nebo velké továrny. Zbývají činnosti, které využívají moře.",
    "Ostrovní stát bez surovin se živí hlavně turismem a rybolovem. Moře a pláže má k dispozici zdarma.",
  ),
  f(
    "Proč se ve velké části australského vnitrozemí chovají spíš ovce a skot, než aby se pěstovalo obilí?",
    "Sucho dovolí jen řídkou trávu, která stačí na pastvu, ne na pole.",
    [
      ["Obilí se tam pěstovat nesmí, protože je pro zvířata jedovaté.", "Obilí není jedovaté, jde o nedostatek vody."],
      ["Na polích by se zvířata ztrácela a farmáři by je nemohli najít.", "Zvířata se hlídají i na polích, problém je sucho."],
      ["Půda je tak bažinatá, že se do ní zabořují pluhy i traktory.", "Vnitrozemí je suché, ne bažinaté."],
    ],
    "Uvaž, co potřebují plodiny na poli a co stačí zvířatům.",
    "Pole potřebují pravidelnou vláhu, pastva vystačí i s řídkou trávou. Rozhodni podle množství srážek.",
    "Ve vnitrozemí je sucho a nedostatek vody znemožňuje pole. Řídká tráva ale pro pastvu ovcí a skotu stačí.",
  ),
  f(
    "Proč se na Novém Zélandu daří chovu ovcí na travnatých svazích?",
    "Vlhké mírné podnebí drží trávu zelenou většinu roku.",
    [
      ["Je tam poušť, ve které ovce najdou dostatek stínu i vody.", "Nový Zéland pouštní není, podnebí je vlhké a mírné."],
      ["Ovce se živí hlavně korály a mořskými řasami z pobřeží.", "Ovce se krmí trávou, ne korály."],
      ["Tráva roste pod sněhem, který leží na pastvinách po celý rok.", "Sníh leží jen v horách, ne po celý rok na pastvinách."],
    ],
    "Vzpomeň si, co ovce jedí a jaké podnebí to potřebuje.",
    "Ovce se živí travou. Vzpomeň si, v jakém podnebném pásu Nový Zéland leží a kolik tam prší.",
    "Na Novém Zélandu je mírné a vlhké podnebí, tráva roste skoro celý rok. Chov ovcí se tam proto daří.",
  ),
  f(
    "Proč je na malých korálových ostrovech největším problémem pitná voda?",
    "Nízký ostrov nemá řeky ani prameny a spoléhá hlavně na dešťovou vodu a malé zásoby podzemní vody.",
    [
      ["Ostrov je celý ze soli, proto je voda v něm vždy nepitná.", "Ostrov není ze soli, ale z korálového vápence."],
      ["Řeky tam sice jsou, ale tečou v hloubce pod mořským dnem.", "Na atolu žádné řeky nejsou ani pod mořem."],
      ["Voda se každý den odpaří kvůli horké sopce uprostřed ostrova.", "Atoly nemají sopky, jsou z korálů."],
    ],
    "Zvaž, odkud se bere sladká voda na nízkém ostrově bez hor.",
    "Řeky vznikají na horách. Jak by se voda dostala na plochý ostrov bez nich? Vezmi v úvahu, co doplňuje zásoby.",
    "Na atolu chybí hory, tedy i řeky a prameny. Lidé sbírají hlavně dešťovou vodu do nádrží a čerpají malé zásoby podzemní vody.",
  ),
  f(
    "Proč stojí osady na vysokých sopečných ostrovech hlavně v úzkých pásech u pobřeží?",
    "Střed ostrova tvoří strmé hory, rovná půda a přístavy jsou jen u moře.",
    [
      ["Uprostřed ostrova stále teče žhavá láva, která zaplavuje všechna údolí.", "Na většině sopečných ostrovů je sopka nečinná nebo dávno vyhaslá, žhavá láva údolí nezaplavuje."],
      ["Uprostřed ostrova leží hustý prales plný jedovatých zvířat, který lidé nechtějí kácet.", "Prales a zvířata jsou menší překážka než strmé svahy. Rozhoduje, že v horách je málo rovného místa."],
      ["Pobřeží je jediné místo ostrova, kde neprší a nehrozí povodně.", "Prší i na pobřeží, deště přinášejí hory."],
    ],
    "Zvaž, co je na strmém svahu špatné pro stavbu domů, polí i cest.",
    "Porovnej střed hornatého ostrova a jeho okraj: kde je víc vyrovnaného místa a odkud se dá vyplout na moře?",
    "Střed sopečného ostrova tvoří strmé hory. Rovná půda a přístavy jsou jen u pobřeží, proto se tam lidé usazují.",
  ),
  f(
    "Proč lidé na korálových atolech pěstují kokosové palmy?",
    "Palma roste i v písčité půdě a dává plody, mléko i dřevo.",
    [
      ["Palma potřebuje čerstvou vodu z ledovců a hlubokou úrodnou půdu.", "Na atolech ledovce nejsou. Palma snese slanou vodu."],
      ["Palma dává vlnu a hedvábí na oblečení pro obyvatele ostrova.", "Vlnu dávají ovce, palma dává plody a dřevo."],
      ["Palma roste jen na sopečné lávě a v písčité půdě nepřežije.", "Palmy rostou i na písčitém korálovém ostrově."],
    ],
    "Zvaž, co palma potřebuje k životu a zda to na atolu najde.",
    "Na atolu je půda písčitá a vody málo. Vyber tvrzení, které vysvětluje, proč právě palma tam přežije.",
    "Kokosová palma se vyrovná s písčitou půdou. Poskytuje plody, mléko i dřevo, proto je pro lidi na atolech důležitá.",
  ),
  f(
    "Ostrov v Oceánii má teplé moře, bílé pláže a korálový útes. Co z toho plyne pro obživu obyvatel?",
    "Mohou se živit ubytováním a službami pro turisty.",
    [
      ["Mohou se živit těžbou uhlí a rudy v hlubokých dolech.", "Bez dolů a nerostů se těžit nedá."],
      ["Mohou se živit chovem ovcí a lam na rozlehlých pastvinách.", "Na ostrově kolem pláží pro ovce pastviny nejsou."],
      ["Mohou se živit provozem lyžařských středisek na horských svazích.", "V teplém moři sníh není."],
    ],
    "Uvaž, proč lidé jezdí na dovolenou k teplému moři.",
    "Bílé pláže a útes jsou cenné pro návštěvníky. Vyber činnost, která z toho těží.",
    "Teplé moře, pláže a útes lákají turisty. Obyvatelé ostrova z toho žijí, jako průvodci nebo majitelé ubytování.",
  ),
  f(
    "Nový důl na železnou rudu vznikl v pustině daleko od měst. Co z toho plyne pro dopravu rudy?",
    "Ruda se vozí vlakem či nákladními vozy k přístavu na pobřeží.",
    [
      ["Ruda se nechá ležet v poušti, protože ji nikdo nepotřebuje.", "Ruda se těží proto, aby se prodala a vyvezla."],
      ["Ruda se převeze letadly přímo do Evropy, kde ji čekají hutě.", "Letadlem by se náklad nevyplatil, ruda je těžká."],
      ["Ruda se pošle po velké řece rovnou do moře a tam ji naloží.", "V suchých oblastech, kde se ruda těží, žádná splavná řeka k moři neteče."],
    ],
    "Ruda je těžká a vyváží se lodí, takže potřebuje přepravu k moři.",
    "Zvaž, který dopravní prostředek unese velké množství těžkého nákladu na dlouhou vzdálenost po souši.",
    "Doly leží daleko od pobřeží, proto se ruda vozí vlaky nebo nákladními vozy do přístavu. Odtud ji lodě vyvezou.",
  ),
];

// ── L3: přenos a analýza ───────────────────────────────────────────────────

/** Rozlišení tří typů ostrovů z popisu. Distraktory jsou zbylé dva typy + říční ostrov. */
const TYP_ATOL = "korálový atol";
const TYP_SOPKA = "sopečný ostrov";
const TYP_PEVNINA = "pevninský ostrov";
const TYP_RICNI = "říční ostrov";

const WHY_TYP: Record<string, string> = {
  [TYP_ATOL]: "Atol je nízký prstenec z korálů kolem mělké laguny, bez hor a řek. Popis na něj nesedí.",
  [TYP_SOPKA]: "Sopečný ostrov je hornatý, má kráter a úrodnou půdu. Popis na něj nesedí.",
  [TYP_PEVNINA]: "Pevninský ostrov je kus světadílu oddělený mořem, s podobnou přírodou. Popis na něj nesedí.",
  [TYP_RICNI]: "Říční ostrov leží v řece, mezi tři hlavní typy ostrovů Oceánie nepatří.",
};

const typ = (
  q: string,
  key: string,
  h0: string,
  h1: string,
  explanation: string,
): Fakt =>
  f(
    q,
    key,
    [TYP_ATOL, TYP_SOPKA, TYP_PEVNINA, TYP_RICNI]
      .filter((t) => t !== key)
      .map((t): [string, string] => [t, WHY_TYP[t]]),
    h0,
    h1,
    explanation,
  );

const TYPY_L3: Fakt[] = [
  typ(
    "Popis místa: nízký prstenec ostrůvků kolem mělké laguny, jen pár metrů nad hladinou, žádné řeky, lidé loví ryby a sklízejí kokosy. O jaký typ ostrova jde?",
    TYP_ATOL,
    "Porovnej výšku ostrova nad mořem a tvar souše s typy ostrovů, které znáš.",
    "Všimni si dvou znaků: chybí hory i řeky a souš tvoří kruh kolem mělkého moře. Který typ ostrova tyto znaky splňuje?",
    "Nízký prstenec kolem laguny bez hor a řek je korálový atol. Kokosové palmy a ryby jsou typická obživa na atolech.",
  ),
  typ(
    "Popis místa: ostrov z bílého písku a vápence, uprostřed klidná mělká voda, nejvyšší místo sotva vyčnívá nad vlny, sladkou vodu zachycují dešťové nádrže. Jaký typ ostrova to je?",
    TYP_ATOL,
    "Zaměř se na to, z čeho je ostrov a jak vysoko sahá nad hladinu.",
    "Bez hor nemůže být ani řek a lidé pijí dešťovou vodu. Přiřaď k těmto znakům typ ostrova, který je nízký a leží kolem mělkého moře.",
    "Plochý ostrov z vápence kolem laguny bez hor a řek je korálový atol. Lidé tam využívají dešťovou vodu.",
  ),
  typ(
    "Popis místa: rybářská vesnice stojí na úzkém pruhu země sotva nad hladinou, kolem ní není žádná hora ani řeka, pitná voda pochází z deště. Který typ ostrova to nejspíš je?",
    TYP_ATOL,
    "Ptej se, co všechno na ostrově chybí, a co z toho vyplývá o jeho výšce.",
    "Ostrov bez hor a řek je plochý a nízký. Porovnej to se třemi typy ostrovů a vyber ten, který je nejnižší.",
    "Úzký pruh země sotva nad hladinou, bez hor a řek, je typický pro korálový atol.",
  ),
  typ(
    "Popis místa: strmé zelené hory vyčnívají z moře, uprostřed je kráter, tmavá půda je úrodná a stékají z ní potoky. Jaký typ ostrova to je?",
    TYP_SOPKA,
    "Hledej znaky, podle kterých se dá místo spojit s hlubinami Země.",
    "Kráter a vysoké hory ukazují na horninu z hloubi Země, která vyzdvihla souš z moře. Vyber typ, který má tyto znaky.",
    "Kráter, vysoké hory a úrodná půda jsou znaky sopečného ostrova.",
  ),
  typ(
    "Popis místa: ostrov vyrostl z mořského dna ze ztuhlé lávy, jeho vysoká hora zachytává mraky a na svazích se pěstují banány a taro. O jaký typ ostrova jde?",
    TYP_SOPKA,
    "Všimni si, z čeho ostrov vznikl a jak je vysoký.",
    "Vzpomeň si, jak vzniká každý ze tří typů: z korálů, oddělením od světadílu, nebo z materiálu z hlubin Země. Vyber typ, který sedí na popis.",
    "Ostrov ze ztuhlé lávy s vysokou horou je sopečný. Úrodná sopečná půda umožňuje pěstovat banány i taro.",
  ),
  typ(
    "Popis místa: ostrov leží těsně u pobřeží světadílu, od kterého ho dělí úzký mělký průliv, rostou na něm stejné stromy a žijí stejná zvířata jako na pevnině. Jaký typ ostrova to je?",
    TYP_PEVNINA,
    "Porovnej přírodu na ostrově a na pevnině a přemýšlej, proč jsou stejné.",
    "Když je příroda stejná a ostrov leží kousek od břehu, bývaly obě souše kdysi spojené. Který typ ostrova takto vzniká?",
    "Ostrov podobné přírody těsně u světadílu býval jeho součástí. Je to pevninský ostrov.",
  ),
  typ(
    "Popis místa: velký ostrov leží kousek od jižního pobřeží světadílu, mělký průliv mezi nimi je hluboký jen pár desítek metrů a podloží ostrova i pevniny tvoří stejné horniny. Jaký typ ostrova to je?",
    TYP_PEVNINA,
    "Stejné horniny na obou březích průlivu naznačují společný původ. Jaký?",
    "Vyber typ, který vznikl oddělením od větší souše, ne růstem korálů nebo sopky.",
    "Ostrov oddělený od světadílu stoupajícím mořem je pevninský ostrov.",
  ),
  f(
    "Popis ostrova: velký hornatý ostrov těsně u rovníku, o který se dělí dva státy, ve vnitrozemí žijí izolované kmeny. Který ostrov to je?",
    "Nová Guinea",
    [
      ["Tasmánie", "Tasmánie leží u jihu Austrálie, ne u rovníku, a patří jednomu státu."],
      ["Tahiti", "Tahiti je malý ostrov daleko na východě, nedělí se o něj dva státy."],
      ["Severní ostrov Nového Zélandu", "Nový Zéland leží daleko od rovníku a patří jednomu státu."],
    ],
    "Sleduj dva znaky: poloha u rovníku a rozdělení mezi dva státy.",
    "Vyluč ostrovy, které leží daleko od rovníku nebo patří jen jednomu státu. Zbude ostrov ze skupiny největších ostrovů Oceánie.",
    "Nová Guinea je největší ostrov Oceánie a leží u rovníku. Dělí se o ni dva státy a ve vnitrozemí žijí izolované kmeny.",
  ),
];

/** Tři oblasti Oceánie z popisu; čtvrtý distraktor je Indonésie. */
const OBLASTI = ["Melanésie", "Mikronésie", "Polynésie"];
const WHY_OBLAST: Record<string, string> = {
  Melanésie: "Melanésie leží nejblíž Austrálii a patří k ní Nová Guinea a hornaté ostrovy s pralesy. Popis to není.",
  Mikronésie: "Mikronésie jsou drobné ostrůvky a atoly severně od rovníku. Popis to není.",
  Polynésie: "Polynésie je obří trojúhelník ostrovů na východě Oceánie. Popis to není.",
  Indonésie: "Indonésie je asijský stát. Do Oceánie patří jen její východní část na Nové Guineji, jako oblast Oceánie se ale nepočítá.",
};

const oblast = (q: string, key: string, h0: string, h1: string, explanation: string): Fakt =>
  f(
    q,
    key,
    [...OBLASTI.filter((o) => o !== key), "Indonésie"].map((o): [string, string] => [o, WHY_OBLAST[o]]),
    h0,
    h1,
    explanation,
  );

const OBLASTI_L3: Fakt[] = [
  oblast(
    "Popis oblasti: největší ostrov Oceánie (Nová Guinea) a další hornaté ostrovy s deštnými pralesy, hned severně a severovýchodně od Austrálie. Do které oblasti Oceánie patří?",
    "Melanésie",
    "Rozděl si tři oblasti podle vzdálenosti od Austrálie.",
    "Hledej oblast, která leží nejblíž k Austrálii. Ostatní dvě oblasti leží dál v oceánu.",
    "Největší hornaté ostrovy severně od Austrálie tvoří Melanésii. Patří sem i Nová Guinea.",
  ),
  oblast(
    "Popis oblasti: tisíce drobných ostrůvků a atolů roztroušených na rozlehlé ploše oceánu, převážně severně od rovníku a východně od Filipín. Do které oblasti Oceánie patří?",
    "Mikronésie",
    "Sleduj velikost ostrovů a jejich polohu vůči rovníku.",
    "Tisíce drobných ostrůvků a atolů znamenají nejmenší ostrovy Oceánie. Porovnej, která z oblastí je má, a předpona v názvu napovídá velikost.",
    "Drobné ostrůvky a atoly severně od rovníku patří do Mikronésie.",
  ),
  oblast(
    "Popis oblasti: obrovský trojúhelník ostrovů, jehož vrcholy leží u Havaje, Nového Zélandu a Velikonočního ostrova, největší část východní Oceánie. Do které oblasti Oceánie patří?",
    "Polynésie",
    "Dívej se na polohu vůči celé Oceánii, ne na velikost jednotlivých ostrovů.",
    "Popis říká, že oblast zabírá východ a má tvar velkého trojúhelníku. Vyber oblast s takovým rozsahem, a ne tu, která leží u Austrálie.",
    "Obří tichomořský trojúhelník ostrovů od Havaje po Nový Zéland je Polynésie.",
  ),
  f(
    "Popis státu: dva velké hornaté ostrovy v mírném pásu jihozápadního Tichého oceánu, vlhké mírné podnebí, mnoho ovcí, původní obyvatelé Maorové. O který stát jde?",
    "Nový Zéland",
    [
      ["Austrálie", "Austrálie je světadíl a stát se suchým vnitrozemím a původními Aboriginci."],
      ["Papua-Nová Guinea", "Papua-Nová Guinea leží u rovníku, ne v mírném pásu, a Maory tam nenajdeš."],
      ["Fidži", "Fidži je tropické, s horkým vlhkým podnebím. Nemá mírné podnebí ani chov ovcí a původními obyvateli nejsou Maorové."],
    ],
    "Znak Maorové a dva hlavní ostrovy patří jedinému státu.",
    "Stát se vlhkým mírným podnebím má trávu pro ovce. Vyluč ty, které leží u rovníku, a ten, který má suché vnitrozemí.",
    "Dva velké ostrovy, mírné podnebí, ovce a Maorové označují Nový Zéland.",
  ),
];

/** Rozhodnutí, návrhy a srovnání. */
const ROZHODNUTI_L3: Fakt[] = [
  f(
    "Rozhodni: na ostrově je nízký prstenec z bílého písku a vápence kolem mělké laguny, nejvyšší místo sotva vyčnívá nad vlny. Odkud tam lidé nejspíš berou pitnou vodu?",
    "z dešťových nádrží a malých studní",
    [
      ["z horských potoků a pramenů", "Potoky a prameny vznikají v horách. Nízký ostrov žádné hory nemá."],
      ["z velké řeky, která ústí do laguny", "Řeky vznikají na horách. Na nízkém prstenci žádná neteče."],
      ["z moře, které se před pitím jen převaří", "Převařením se sůl z mořské vody neodstraní. Pitná voda musí být sladká."],
    ],
    "Nejdřív urči, o jaký typ ostrova jde. Pak si vzpomeň, co na takovém ostrově chybí a odkud tedy sladká voda přichází.",
    "Sladká voda přichází z nebe nebo ze země. Které zdroje má nízký ostrov bez hor k dispozici?",
    "Popis odpovídá korálovému atolu. Bez hor tam nejsou řeky ani prameny, proto lidé zachytávají dešťovou vodu do nádrží a čerpají z malých studní.",
  ),
  f(
    "Rozhodni: ostrov vyrostl z mořského dna ze ztuhlé lávy, jeho vysoká hora zachytává mraky a často tam prší. Co budou obyvatelé na svazích nejspíš pěstovat?",
    "banány, taro a další plodiny",
    [
      ["jen kokosové palmy, jiné plodiny tam nerostou", "Kokosové palmy jsou typické pro atoly. Sopečná půda je úrodná a hodí se pro mnoho plodin."],
      ["pšenici na rozlehlých polích", "Hornatý ostrov nemá místo na rozlehlá pole."],
      ["chovat ovce na suché stepi", "Na sopečném ostrově prší, suchá step tam není."],
    ],
    "Nejdřív urči, o jaký typ ostrova jde. Pak se zeptej, jaká je tam půda a kolik vody.",
    "Z lávy vzniká půda bohatá na živiny a hory zachytávají déšť. Které plodiny se hodí do vlhka a na dobrou půdu?",
    "Popis odpovídá sopečnému ostrovu. Sopečná půda je úrodná a hory zachycují deště, proto se tam daří banánům, taru i dalším plodinám.",
  ),
  f(
    "Rozhodni: investor chce v Austrálii postavit nové velké přístavní město. Které místo je nejvhodnější?",
    "úrodné pobřeží se zátokou pro lodě a dostatkem deště",
    [
      ["suché pobřeží se zátokou, kde skoro neprší", "Zátoka je, ale bez vody na pití a na pole by město nemělo z čeho žít."],
      ["pobřeží se strmými útesy a pravidelným deštěm, ale bez zátoky", "Bez zátoky loď nemá kde kotvit, přístav by se tu postavit nedal."],
      ["místo u vyschlého koryta uprostřed světadílu, kde po dešti zbude voda", "Voda tam je jen občas a moře je daleko, město by nemělo přístav."],
    ],
    "Město potřebuje pitnou vodu i spojení, kterým se zboží dostane ke světu. Zkontroluj obojí u každé možnosti.",
    "Připomeň si, kde v Austrálii žije většina obyvatel a proč. Vyber místo, které se s těmito znaky shoduje.",
    "Velké město potřebuje vodu a přístav pro obchod. Obojí nabízí úrodné pobřeží, ve vnitrozemí není ani jedno.",
  ),
  f(
    "Rozhodni: farmář chce v Austrálii založit velkou farmu s ovcemi. Které místo je nejvhodnější?",
    "rozlehlá travnatá krajina s občasnými dešti",
    [
      ["písečná poušť bez trávy a bez jediného pramene", "Ovce se v poušti nenají, tráva tam neroste."],
      ["pozemek u velkého přístavního města, kde je půda drahá a málo místa", "Ovce potřebují velké plochy pastvy, které u přístavního města nejsou."],
      ["tropický prales na severu s hustou vegetací bez otevřených pastvin", "V hustém pralese není otevřená tráva pro velká stáda."],
    ],
    "Ovce se živí trávou a potřebují dost místa. Které místo obojí nabízí?",
    "Vyluč místa bez trávy a ta, kde je málo prostoru. Zbývá krajina, kde vyroste pastva.",
    "Ovce potřebují travnaté pastviny a velkou plochu. Nabízí je rozlehlá travnatá krajina s občasnými dešti.",
  ),
  f(
    "Hladina oceánu stoupá o několik desítek centimetrů. Který z těchto ostrovů je nejvíc ohrožený zatopením?",
    "nízký korálový atol",
    [
      ["vysoký sopečný ostrov s horami", "Vysoké hory zůstanou i při stoupající hladině nad vodou."],
      ["velký pevninský ostrov s rozsáhlým vnitrozemím", "Velký ostrov má i vysoká místa, zatopená bude jen část pobřeží."],
      ["sopečný ostrov s dosud činnou sopkou", "Sopka ostrov ohrožuje lávou, ne zatopením. Její hory zůstanou nad hladinou."],
    ],
    "Rozhodni, který ostrov leží nejblíž hladině moře.",
    "Zvedne-li se voda o desítky centimetrů, zaplaví nejdřív nejnižší místa. Vyber ostrov, který nemá žádná vyšší místa.",
    "Atol leží jen několik metrů nad hladinou, proto ho zvedající se voda ohrožuje nejdřív. Vysoké ostrovy mají kam ustoupit.",
  ),
  f(
    "Vysvětli: proč vzestup hladiny oceánu ohrožuje státy na atolech víc než Austrálii?",
    "Jejich půda leží jen kousek nad hladinou, není kam ustoupit.",
    [
      ["Austrálie leží celá vysoko nad mořem, takže se jí voda nedotkne.", "Austrálie je nejplošší světadíl. Rozhodující je její rozloha: lidé mají kam ustoupit."],
      ["Atoly stojí na měkké lávě, kterou voda odplaví.", "Atoly tvoří korálový vápenec, ne měkká láva."],
      ["Na atolech voda stoupá výrazně rychleji než u břehů světadílů.", "Rychlost vzestupu se místně liší, ale rozhodující je výška a rozloha země: atol leží jen kousek nad hladinou a nemá kam ustoupit."],
    ],
    "Porovnej, jak vysoko leží země u atolu a u velkého světadílu.",
    "Zamysli se, kam se mohou obyvatelé stáhnout, když voda stoupne, a jak velké území mají.",
    "Atoly leží těsně nad hladinou a jsou malé, lidé nemají kam ustoupit. Austrálie je rozlehlá a většina její země leží desítky až stovky metrů nad mořem, ustoupit se dá do vnitrozemí.",
  ),
  f(
    "Srovnání: Austrálie a malý atolový stát. Který výrok o jejich obživě je správný?",
    "Austrálie těží rudu a chová dobytek, atol žije z rybolovu a kokosů.",
    [
      ["Obě země žijí hlavně z těžby uhlí a železné rudy pro vývoz.", "Atol nemá doly ani suroviny. Těží jen Austrálie."],
      ["Atolový stát vyváží vlnu a maso, Austrálie kokosové ořechy.", "Vlnu a maso vyváží Austrálie, atol na velká stáda nemá půdu."],
      ["Austrálie žije jen z rybolovu, atolový stát z velkých farem.", "Austrálie má rozsáhlé doly a farmy, atol farmy postavit nemůže."],
    ],
    "Připomeň si, čím se živí velký stát se surovinami a čím malý ostrov bez nich.",
    "Ke každé zemi si zapiš dva zdroje obživy a porovnej s možnostmi. Kde by atol vzal doly nebo velké pastviny?",
    "Austrálie má doly a pastviny, atol jen moře a kokosové palmy. Proto se živí rybolovem a kokosy.",
  ),
  f(
    "Srovnání: který stát musí dovážet větší část zboží, které potřebuje: Austrálie, nebo malý atolový stát?",
    "Atolový stát, protože si sám vyrobí a vypěstuje málo.",
    [
      ["Austrálie, protože nemá téměř žádné vlastní suroviny.", "Austrálie má hodně vlastních surovin a potravin. Zboží také dováží, ale atolový stát dováží nepoměrně větší část."],
      ["Oba stejně, protože oba státy leží u velkého oceánu.", "Poloha u oceánu nerozhoduje, ale to, co si stát vyrobí sám."],
      ["Austrálie, protože všechna její města leží u moře.", "Města u moře dovoz nezvyšují. Australané si suroviny a potraviny zajistí většinou sami."],
    ],
    "Porovnej, co si každý stát dokáže vyrobit a vypěstovat sám.",
    "Stát s doly, farmami a továrnami se uživí sám mnohem víc. Vyber ten, kterému by bez dovozu hrozil nedostatek.",
    "Atol má málo půdy i surovin, proto dováží většinu toho, co potřebuje. Austrálie si potravin a surovin zajistí mnohem víc sama.",
  ),
  f(
    "Popis krajiny: rozlehlá polopoušť, farmy s dobytkem leží desítky kilometrů od sebe, školu i lékaře nahrazuje rádio a letadlo. Co z popisu vyplývá o osídlení?",
    "je řídké, protože sucho nedovolí uživit mnoho lidí",
    [
      ["je husté, protože je tam dost místa pro velká města", "Velká města potřebují vodu a přístavy, ne jen místo."],
      ["je stejné jako u pobřeží, protože všude jsou farmy", "Farmy jsou daleko od sebe, osídlení je proto mnohem řidší než u moře."],
      ["je nejhustší kolem farem, protože tam žije většina Australanů", "Většina Australanů žije ve městech u pobřeží, ne na farmách."],
    ],
    "Všimni si, jak daleko jsou od sebe farmy, a ptej se proč.",
    "Velké vzdálenosti mezi farmami znamenají málo lidí na velké ploše. Hledej příčinu v podnebí.",
    "Polopoušť uživí jen málo lidí, farmy jsou daleko od sebe a služby se řeší na dálku. Osídlení je tedy řídké.",
  ),
  f(
    "Ostrovní stát chce zakázat ničení korálového útesu kolem svých pláží. Který důvod je pro obživu obyvatel nejdůležitější?",
    "Útes přitahuje turisty a dává úkryt rybám, které se loví.",
    [
      ["Útes se dá rozbít a prodávat jako stavební kámen.", "Rozbitím útesu by ostrov přišel o turisty i ryby, tedy o hlavní zdroje příjmu."],
      ["Útes tlumí vlny, takže se za ním dá bez obav stavět.", "Útes sice tlumí vlny, ale obživu lidem dávají turisté a ryby, ne stavba."],
      ["Útes dává ostrovu sladkou vodu k pití.", "Útes je z vápence a sladkou vodu nedává."],
    ],
    "Uvaž, z čeho lidé na atolech žijí, a co k tomu útes přispívá.",
    "Vyluč tvrzení, která o útesu tvrdí něco, co korály nedělají. Zbývá důvod týkající se zdrojů obživy.",
    "Zdravý útes láká turisty a poskytuje domov rybám, takže chrání dva hlavní zdroje příjmů ostrovů.",
  ),
  f(
    "Plán obživy: stát na malých ostrovech nemá suroviny, jen málo půdy a k nejbližšímu světadílu vede tisíce kilometrů moře. Který plán je nejrealističtější?",
    "turismus a rybolov, zbytek zboží dovézt",
    [
      ["těžba uhlí a železné rudy na vývoz", "Bez nerostů se těžit nedá."],
      ["velké obilné farmy, z nichž se vyváží pšenice", "Na malých ostrovech nemá obilí dost půdy ani vody."],
      ["výroba aut a strojů pro celý světadíl", "Bez surovin a s drahou dopravou by se továrna nevyplatila."],
    ],
    "Vyber činnost, kterou lze provozovat i bez surovin a bez velké půdy.",
    "Zvaž, co ostrov má: moře, pláže a teplo. Které z plánů právě tyto zdroje využívají?",
    "Malé ostrovy bez surovin žijí z turismu a rybolovu, zbytek zboží dovážejí lodí nebo letadlem.",
  ),
  f(
    "Popis oblasti: přístavy plné lodí, vysoké budovy, pravidelný déšť a nejhustší osídlení světadílu. Která část Austrálie to je?",
    "pobřežní pás u moře",
    [
      ["vnitrozemská polopoušť", "V polopoušti je sucho a osídlení řídké."],
      ["farmářská krajina daleko od moře", "Farmy jsou od sebe daleko a osídlení je řídké, přístavy tam nejsou."],
      ["velký národní park s divokou přírodou a bez měst", "Národní park slouží ochraně přírody, velká města s přístavy v něm nestojí."],
    ],
    "Přístavy potřebují moře. Kde v Austrálii leží?",
    "Hustě osídlená místa mají dost vody a spojení s obchodem. Vyluč ta, která leží daleko od moře.",
    "Přístavy, deště a velká města najdeš v pobřežním pásu. Vnitrozemí je řídce osídlené.",
  ),
];

// ── Generátor ──────────────────────────────────────────────────────────────

/**
 * Pytlík: vydává prvky v náhodném pořadí, ale každý právě jednou, než se
 * naplní znovu. Drží se uvnitř gen(), takže modul zůstává bez stavu.
 */
function pytlik<T>(prvky: T[]): () => T {
  let zbytek: T[] = [];
  return () => {
    if (zbytek.length === 0) zbytek = shuffle(prvky);
    return zbytek.pop()!;
  };
}

function gen(level: number): PracticeTask[] {
  const zBanky = (banka: Fakt[]): Tvurce => {
    const los = pytlik(banka);
    return () => fakt(los());
  };
  const sablony: Tvurce[] =
    level === 1
      ? Array(6).fill(zBanky(BANKA_L1))
      : level === 2
        ? Array(6).fill(zBanky(BANKA_L2))
        : (() => {
            const typy = zBanky(TYPY_L3);
            const oblasti = zBanky(OBLASTI_L3);
            const rozhodnuti = zBanky(ROZHODNUTI_L3);
            return [typy, rozhodnuti, oblasti, rozhodnuti, typy, rozhodnuti];
          })();
  let i = 0;
  const genLx = () => losUlohy(sablony[i++ % sablony.length]);
  return ruzneUlohy(() => losUlohy(genLx));
}

// ── Topic ──────────────────────────────────────────────────────────────────
export const AUSTRALIE_OBYVATELSTVO_OSTROVY_OCEANIE: TopicMetadata[] = [
  {
    id: "g6-zem-australie-obyvatelstvo-ostrovy-oceanie-6",
    rvpNodeId: "g6-zemepis-regiony-sveta-australie-a-oceanie-obyvatelstvo-a-hospodarstvi-ostrovy-oceanie",
    displayName: "Lidé v Austrálii a na ostrovech Oceánie",
    title: "Obyvatelstvo a hospodářství; ostrovy Oceánie",
    studentTitle: "Kdo žije v Austrálii a na ostrovech Oceánie",
    subject: "zemepis",
    category: "Regiony světa",
    topic: "Austrálie a Oceánie",
    briefDescription: "Kde žijí lidé v Austrálii, čím se živí a jaké ostrovy tvoří Oceánii.",
    keywords: [
      "Austrálie", "Oceánie", "Canberra", "Aboriginci", "Nový Zéland", "Maorové",
      "Melanésie", "Mikronésie", "Polynésie", "korálový atol", "sopečný ostrov", "pevninský ostrov",
    ],
    goals: [
      "Vysvětlit, proč žije většina Australanů při pobřeží a čím se živí (chov, těžba, služby).",
      "Rozlišit tři typy ostrovů a tři oblasti Oceánie podle polohy a možností obživy.",
      "Odvodit z popisu místa jeho typ a z něj možnosti obživy obyvatel.",
    ],
    boundaries: [
      "Bez map a obrázků — poloha jen slovy (oceán, rovník, světadíl, světová strana).",
      "Bez přesných čísel obyvatel, HDP ani výšek; politická fakta jen stálá.",
      "Sporné či měnící se údaje se nepoužívají jako klíč.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "V Austrálii žije většina lidí u pobřeží, protože vnitrozemí je suché. Ostrovy Oceánie jsou tří typů: sopečné, korálové atoly a pevninské.",
      steps: [
        "Urči, o jakou oblast nebo typ ostrova jde (poloha, výška, voda).",
        "Z polohy a podnebí odvoď, kolik je tam vody a půdy.",
        "Z toho vyvoď, čím se lidé živí a co musejí dovážet.",
      ],
      commonMistake: "Považovat největší město za hlavní, hledat největší osídlení uprostřed světadílu a zaměňovat atol se sopkou.",
      example: "Nízký ostrov bez hor a řek je korálový atol, obživou bývá rybolov a kokosové palmy.",
    },
  },
];
