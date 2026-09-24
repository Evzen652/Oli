/**
 * Výchova k občanství 6. ročník — Majetek a peníze: hospodaření v rodině,
 * kapesné, šetření, plánování (select_one).
 *
 * Čistě pojmové téma bez čísel, cen a bank (zakázáno pravidly VKO): žák
 * rozpoznává a používá pojmy příjem, výdaj, rozpočet, spoření, kapesné,
 * potřeba × přání, plánovaný × impulzivní nákup — a aplikuje je na popsanou
 * situaci z běžného života, ne na výpočet s konkrétní částkou.
 *
 * Stavba podle zlatého vzoru `dejepis/periodizaceLetopocet.ts` a
 * `prirodopis/bakterie.ts`: disjunktní banky POOL_L1 / POOL_L2 / POOL_L3,
 * helpery výhradně z `./_shared`. Rotace bankou se nastaví na začátku gen(),
 * generátor nemá stav mezi voláními.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • příjem × výdaj podle perspektivy (čí rozpočet se sleduje);
 *  • přání označené za potřebu kvůli tlaku vrstevníků nebo módě;
 *  • plánovaný × impulzivní nákup posuzovaný podle rychlosti platby u
 *    pokladny nebo délky strávené v obchodě místo podle procesu rozhodování
 *    (srovnávání, čekání, zvážení potřeby);
 *  • spoření/rozpočet zaměněné za utrácení nebo za pouhý seznam přání.
 *
 *  • L1 — přímé rozpoznání definice pojmu nebo jednoznačného příkladu.
 *  • L2 — aplikace na situaci z rodinného života, kde se rozlišují dva
 *    blízké pojmy podle popsaného chování, bez pojmenování v zadání.
 *  • L3 — analýza a přenos: rozhodnutí podle kombinace znaků (ne jednoho
 *    povrchového rysu), posouzení dopadu návyku na budoucí možnost nákupu.
 *
 * Fakta jen obecné pojmy z učebnic VKO 6. ročníku (Fraus, SPN, Nová škola).
 * Žádné konkrétní částky, ceny, značky, banky ani investiční rady.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

interface Polozka {
  q: string;
  key: string;
  d: [Distractor, Distractor, Distractor];
  hints: [string, string];
  explanation: string;
}

// ── L1 — přímé rozpoznání ────────────────────────────────────────────────
const POOL_L1: Polozka[] = [
  {
    q: "Co znamená slovo „rozpočet“ v hospodaření rodiny?",
    key: "plán, kolik peněz rodina vydělá a kolik z nich může utratit",
    d: [
      { value: "seznam věcí, které by si rodina ráda v budoucnu postupně pořídila a koupila", why: "Seznam přání není totéž co rozpočet. Rozpočet plánuje peníze — kolik jich rodina vydělá a kolik může utratit, ne jen to, co by si chtěla koupit." },
      { value: "peníze, které rodina vydělá za jeden měsíc", why: "To je jen příjem, jedna část rozpočtu. Rozpočet zahrnuje i to, kolik z těch peněz může rodina utratit." },
      { value: "kniha, kam si rodina lepí staré účtenky", why: "Účtenky jsou jen doklad o zaplacení, ne plán hospodaření. Rozpočet je plán příjmů a výdajů." },
    ],
    hints: [
      "Přemýšlej, proč je pro rodinu užitečné mít dopředu jasno v příjmech a výdajích, než peníze utratí.",
      "Rozpočet není jen seznam přání ani doklad o útratě. Je to plán: kolik peněz do rodiny přijde a kolik z nich může odejít na jednotlivé věci.",
    ],
    explanation: "Rodinný rozpočet je plán hospodaření: kolik peněz rodina za dané období vydělá (příjmy) a kolik z nich může utratit na bydlení, jídlo a další výdaje.",
  },
  {
    q: "Co znamená slovo „kapesné“?",
    key: "pravidelná menší částka peněz, kterou dítě dostává a smí s ní samo hospodařit",
    d: [
      { value: "jednorázový dárek k narozeninám nebo svátku", why: "Dárek k narozeninám přijde jen jednou za rok. Kapesné dítě dostává pravidelně, třeba každý týden nebo měsíc." },
      { value: "peníze, které si dítě samo vydělá prací", why: "Vlastní výdělek si dítě vydělá prací. Kapesné dostává od rodičů, aniž by za něj muselo pracovat." },
      { value: "peníze, které si celá rodina společně dlouhodobě odkládá na dovolenou", why: "To popisuje spoření celé rodiny na společný cíl, ne pravidelnou částku pro dítě." },
    ],
    hints: [
      "Přemýšlej, jak často a od koho tuhle částku dítě dostává.",
      "Kapesné se od jednorázového dárku liší tím, že přichází pravidelně, a od výdělku tím, že za něj dítě nemusí pracovat — dostává ho od rodičů, aby se učilo s penězi hospodařit.",
    ],
    explanation: "Kapesné je pravidelná menší částka, kterou dítě dostává od rodičů a se kterou samo hospodaří. Učí se tak plánovat vlastní útratu.",
  },
  {
    q: "Co znamená „spořit“ v hospodaření s penězi?",
    key: "odkládat část peněz stranou na pozdější použití",
    d: [
      { value: "utratit všechny peníze hned, jakmile je dostaneš", why: "To je pravý opak spoření. Spořit znamená peníze si nechat, ne je hned utratit." },
      { value: "půjčit si peníze od kamaráda nebo rodiny", why: "Půjčka znamená peníze si vzít a později vracet, ne je odkládat stranou z vlastních příjmů." },
      { value: "spočítat, kolik peněz rodina za měsíc vydělá", why: "To je jen zjištění výše příjmu. Spoření znamená peníze aktivně odkládat na později." },
    ],
    hints: [
      "Přemýšlej, jestli spoření znamená peníze utratit, nebo si je nechat.",
      "Spořit neznamená ani utrácet, ani si půjčovat, ani jen počítat příjmy — znamená to část peněz vědomě odložit stranou a nechat si je na později.",
    ],
    explanation: "Spoření znamená odkládat část peněz stranou, aby byly k dispozici později, třeba na dražší věc nebo pro jistotu.",
  },
  {
    q: "Co je typický příklad výdaje v rodinném rozpočtu?",
    key: "platba za nájem bytu",
    d: [
      { value: "výplata, kterou rodič dostane za práci", why: "Výplata je příjem, peníze do rodiny přibývají. Výdaj je naopak platba, při které peníze z rozpočtu odcházejí, třeba za nájem." },
      { value: "peníze, které rodina odloží na spoření", why: "Odložené peníze na spoření pořád rodině patří, jen čekají na pozdější použití. Výdaj peníze z rozpočtu skutečně odčerpá, jako platba za nájem." },
      { value: "seznam toho, co rodina potřebuje koupit", why: "Seznam potřeb je jen plán, ne skutečná platba. Výdaj je konkrétní odchod peněz z rozpočtu, třeba za nájem." },
    ],
    hints: [
      "Přemýšlej, jestli u této položky peníze rodině přibývají, nebo naopak odcházejí.",
      "Výdaj poznáš podle toho, že peníze z rodinného rozpočtu skutečně odejdou pryč, ne že jen čekají na později nebo jsou teprve v plánu.",
    ],
    explanation: "Výdaj je platba, při které peníze z rodinného rozpočtu odcházejí, například za nájem, jídlo nebo energie.",
  },
  {
    q: "Co je typický příklad příjmu v rodinném rozpočtu?",
    key: "výplata, kterou rodič dostane za odvedenou práci",
    d: [
      { value: "platba za elektřinu, vodu a další podobné pravidelné účty", why: "Platba za energie je výdaj, peníze při ní odcházejí. Příjem naopak peníze do rodiny přináší, třeba výplata." },
      { value: "nákup nové pračky do domácnosti", why: "Koupě pračky je výdaj. Příjem jsou peníze, které do rodiny přicházejí, ne odcházejí." },
      { value: "peníze odložené na dovolenou", why: "Odložené peníze jsou spoření, ne nová částka, která do rodiny přišla. Příjem je peníze, které rodina teprve získá, třeba výplatou." },
    ],
    hints: [
      "Přemýšlej, jestli u této položky peníze do rodiny přicházejí, nebo z ní odcházejí.",
      "Příjem poznáš podle toho, že peníze do rodinného rozpočtu skutečně přibudou, nejčastěji jako výplata za práci.",
    ],
    explanation: "Příjem jsou peníze, které do rodinného rozpočtu přibydou, nejčastěji jako výplata za práci.",
  },
  {
    q: "Který z těchto nákupů je spíš potřeba než přání?",
    key: "jídlo na celý týden pro rodinu",
    d: [
      { value: "nejnovější hra na počítač", why: "Bez nové počítačové hry se dá běžně žít, jde jen o chtěnou věc, tedy přání. Jídlo je nezbytné pro přežití, to je potřeba." },
      { value: "drahé sportovní boty se známým logem", why: "Značka na botách jejich funkci nemění, jde spíš o chtěnou věc, přání. Jídlo je naopak nezbytné, to je potřeba." },
      { value: "výlet do zábavního parku", why: "Výlet do zábavního parku je příjemný zážitek, ale ne nezbytnost, jde o přání. Jídlo pro rodinu potřeba je." },
    ],
    hints: [
      "Ptej se, bez čeho z nabízených věcí by rodina nemohla fungovat vůbec.",
      "Potřeba je věc nezbytná pro běžný život, jako jídlo, bydlení nebo oblečení. Ostatní nabízené věci jsou příjemné, ale rodina se bez nich obejde.",
    ],
    explanation: "Jídlo patří mezi základní potřeby — bez něj se nedá žít. Hra, značkové boty i výlet jsou příjemné věci, ale nezbytné nejsou, jde o přání.",
  },
  {
    q: "Který z těchto nákupů je spíš přání než potřeba?",
    key: "nejnovější model chytrého telefonu, i když starý ještě funguje",
    d: [
      { value: "zimní bunda, protože stará už dítěti nesedí", why: "Bunda, která dítěti sedí a chrání ho v zimě, je nezbytná, tedy potřeba. Nový telefon, i když starý funguje, je jen přání." },
      { value: "jídlo pro celou rodinu na týden", why: "Jídlo je základní potřeba, bez které se nedá žít. Nový telefon navzdory funkčnímu starému je přání." },
      { value: "učebnice, které dítě potřebuje do školy", why: "Učebnice do školy jsou nezbytné pro učení, jde o potřebu. Nový telefon, když starý ještě funguje, je přání." },
    ],
    hints: [
      "Ptej se, jestli bez téhle věci dítě opravdu nemůže fungovat, nebo jestli by mu jen dobře posloužilo to, co už má.",
      "Přání je věc, kterou chceme, i když to, co máme, ještě dobře slouží. Ostatní možnosti popisují věci, které se opravdu musí nahradit nebo bez kterých se nedá být.",
    ],
    explanation: "Nový telefon, i když starý ještě funguje, je přání — chtěná věc, ne nezbytnost. Bunda, která nesedí, jídlo a učebnice jsou skutečné potřeby.",
  },
  {
    q: "Co znamená „plánovaný nákup“?",
    key: "promyšlené rozhodnutí, kterému předchází srovnávání nebo čekání kvůli rozhodování",
    d: [
      { value: "nákup, který proběhne co nejrychleji u pokladny", why: "Rychlost placení u pokladny o ničem nerozhoduje. Plánovaný nákup poznáš podle toho, co mu předcházelo — srovnávání a rozmyšlení." },
      { value: "nákup podle toho, co se právě zalíbí v obchodě", why: "Rozhodnutí podle toho, co se právě zalíbí, je typické pro impulzivní nákup. Plánovaný nákup předchází srovnávání nebo čekání spojené s rozhodováním." },
      { value: "nákup, který nikdo předem nepromýšlel", why: "To popisuje pravý opak — nákup bez rozmyslu je impulzivní. Plánovaný nákup je naopak promyšlený předem." },
    ],
    hints: [
      "Přemýšlej, co se odehraje PŘED tím, než se nákup uskuteční — a jestli to souviselo se samotným rozhodováním, ne jen s tím, že peníze teprve scházely.",
      "Plánovaný nákup poznáš podle toho, co mu předchází: srovnávání možností nebo čekání spojené s rozhodováním, třeba na slevu — ne podle rychlosti placení a ne podle pouhého čekání, než se nashromáždí dost peněz.",
    ],
    explanation: "Plánovaný nákup je promyšlené rozhodnutí, kterému předchází srovnávání nebo čekání spojené se samotným rozhodováním, třeba čekání na slevu — ne rychlost platby, a ne pouhé čekání, než člověk našetří dost peněz.",
  },
  {
    q: "Co znamená „impulzivní nákup“?",
    key: "rozhodnutí koupit něco bez rozmyslu, pod vlivem okamžité chuti nebo nálady",
    d: [
      { value: "nákup po dlouhém srovnávání různých obchodů", why: "Dlouhé srovnávání je znak plánovaného nákupu. Impulzivní nákup je naopak rozhodnutí bez rozmyslu." },
      { value: "nákup, na který rodina předem šetřila", why: "Předchozí šetření ukazuje na plánovaný nákup. Impulzivní nákup vzniká bez rozmyslu, na počkání." },
      { value: "nákup naplánovaný předem v rodinném rozpočtu", why: "Zahrnutí do rozpočtu předem je znak plánovaného nákupu. Impulzivní nákup se naopak stane bez rozmyslu." },
    ],
    hints: [
      "Přemýšlej, jestli tomuhle nákupu předchází rozmýšlení, nebo se stane spíš na počkání.",
      "Impulzivní nákup poznáš podle toho, že se rozhodnutí koupit něco stane rychle a bez rozmyslu, obvykle kvůli okamžité chuti nebo náladě, ne podle toho, kolik věc stojí.",
    ],
    explanation: "Impulzivní nákup je rozhodnutí koupit něco bez rozmyslu, pod vlivem okamžité chuti nebo nálady — na rozdíl od plánovaného nákupu, kterému předchází srovnávání nebo čekání.",
  },
  {
    q: "Petr dostává každý týden od rodičů menší částku peněz, se kterou smí sám hospodařit podle svého uvážení. Jak se tomu říká?",
    key: "kapesné",
    d: [
      { value: "výdaj", why: "Výdaj je platba, při které peníze z rozpočtu odcházejí. Pravidelná částka, kterou dítě dostává na vlastní hospodaření, se nazývá kapesné." },
      { value: "spoření", why: "Spoření znamená peníze odkládat stranou. Tady jde o pravidelnou částku, kterou Petr dostává, to je kapesné." },
      { value: "rozpočet", why: "Rozpočet je plán hospodaření celé rodiny, ne pravidelná částka pro jedno dítě. Ta se nazývá kapesné." },
    ],
    hints: [
      "Přemýšlej, jak se nazývá pravidelná menší částka, kterou dítě dostává na vlastní hospodaření.",
      "Slovo, které hledáš, popisuje peníze, které dítě dostává od rodičů pravidelně a smí s nimi samo nakládat.",
    ],
    explanation: "Pravidelná menší částka, kterou dítě dostává a smí s ní samo hospodařit, se nazývá kapesné.",
  },
  {
    q: "Co dělá člověk, když spoří?",
    key: "odkládá si část peněz stranou na pozdější použití",
    d: [
      { value: "utrácí všechny peníze hned, jak je dostane", why: "To je opak spoření. Kdo spoří, peníze si naopak nechává na později." },
      { value: "půjčuje si peníze od kamaráda", why: "Půjčka je peníze si vzít a vracet, ne peníze odkládat z vlastních příjmů." },
      { value: "sestavuje si dopředu podrobný seznam všech plánovaných výdajů", why: "To je spíš sestavování rozpočtu. Spoření znamená peníze fyzicky odložit stranou, ne jen naplánovat, na co je utratí." },
    ],
    hints: [
      "Přemýšlej, jestli spoření znamená peníze používat hned, nebo je nechat na později.",
      "Kdo spoří, aktivně si nechává část peněz stranou — nepůjčuje si je, neutrácí je hned a nejde jen o plán na papíře.",
    ],
    explanation: "Kdo spoří, odkládá si část peněz stranou, aby je měl k dispozici později.",
  },
  {
    q: "Co patří mezi rodinné výdaje?",
    key: "placení účtu za vodu a elektřinu",
    d: [
      { value: "peníze, které rodič vydělá v práci", why: "Vydělané peníze jsou příjem, přibývají do rodiny. Výdaj je platba, při které peníze naopak odcházejí, třeba za vodu a elektřinu." },
      { value: "peníze uspořené na společném účtu", why: "Uspořené peníze rodině pořád patří. Výdaj je platba, kterou peníze z rozpočtu skutečně opustí, jako platba za energie." },
      { value: "peníze, které dítě dostane jako dárek", why: "Dárek je pro dítě příjem, peníze mu přibydou. Výdaj je platba, při které peníze z rozpočtu odcházejí." },
    ],
    hints: [
      "Přemýšlej, u které z možností peníze z rodinného rozpočtu skutečně odejdou pryč.",
      "Výdaj poznáš podle toho, že rodina za něco zaplatí a peníze jí z rozpočtu ubudou, na rozdíl od výdělku, úspor nebo dárku, kdy peníze naopak přibývají nebo zůstávají.",
    ],
    explanation: "Platba za vodu a elektřinu je výdaj — peníze při ní z rodinného rozpočtu odcházejí. Výdělek, úspory i dárek naopak peníze přidávají nebo je nechávají rodině.",
  },
  {
    q: "Co je hlavním účelem rodinného rozpočtu?",
    key: "naplánovat, kolik peněz rodina vydělá a kolik z nich může utratit",
    d: [
      { value: "spočítat, kolik má rodina přátel a známých", why: "Počet přátel s hospodařením s penězi nesouvisí. Rozpočet plánuje peníze — příjmy a výdaje." },
      { value: "rozhodnout, jaké oblečení je zrovna v módě", why: "Móda se týká vkusu, ne plánování peněz. Rozpočet plánuje, kolik peněz rodina má a na co je použije." },
      { value: "zjistit, kolik peněz vydělávají sousedé", why: "Příjmy sousedů rodinný rozpočet neřeší. Ten plánuje vlastní peníze rodiny — kolik jich vydělá a kolik utratí." },
    ],
    hints: [
      "Přemýšlej, k čemu rodině pomůže mít dopředu jasno ve svých příjmech a výdajích.",
      "Rozpočet slouží k tomu, aby rodina věděla o svých příjmech a uměla si mezi jednotlivé výdaje rozdělit, co vydělá — nemá nic společného s módou, přáteli nebo sousedy.",
    ],
    explanation: "Rodinný rozpočet slouží k naplánování hospodaření: kolik peněz rodina za dané období vydělá a kolik z nich může utratit na jednotlivé potřeby.",
  },
  {
    q: "Proč je pro dítě užitečné dostávat kapesné?",
    key: "učí se díky němu samo hospodařit s penězi",
    d: [
      { value: "aby mělo víc peněz než jeho kamarádi", why: "Kapesné neslouží k porovnávání s kamarády. Jeho smyslem je, aby se dítě naučilo samo s penězi hospodařit." },
      { value: "aby za něj rodiče nemuseli nic platit", why: "Rodiče kapesným neplatí nezbytné výdaje rodiny, to zůstává na nich. Kapesné dítěti pomáhá naučit se hospodařit." },
      { value: "aby mohlo peníze kdykoliv utrácet bez rozmyslu", why: "Kapesné naopak učí přemýšlet, na co peníze použít, ne utrácet bez rozmyslu. Jeho smyslem je naučit se hospodařit." },
    ],
    hints: [
      "Přemýšlej, co se dítě díky pravidelné částce, se kterou samo nakládá, postupně naučí.",
      "Kapesné dává dítěti možnost samo si rozhodovat, kdy peníze utratí a kdy si je nechá — a přesně tím se učí s penězi hospodařit.",
    ],
    explanation: "Kapesné dává dítěti možnost samostatně rozhodovat o menší částce peněz, a tím se učí hospodařit — plánovat útratu i spoření.",
  },
  {
    q: "Anička na jaře dostala od babičky peníze k narozeninám a hned je celé utratila za sladkosti. O jaký nákup šlo?",
    key: "impulzivní nákup",
    d: [
      { value: "plánovaný nákup", why: "Plánovanému nákupu předchází srovnávání nebo čekání. Anička peníze utratila hned, bez rozmyslu, to je impulzivní nákup." },
      { value: "spoření", why: "Spoření znamená peníze si nechat na později. Anička je naopak hned utratila, to je impulzivní nákup." },
      { value: "výdaj rodičů", why: "Peníze byly Aniččiny vlastní, od babičky, ne výdaj rodičů. Způsob, jakým je hned utratila, je impulzivní nákup." },
    ],
    hints: [
      "Přemýšlej, jestli Anička svůj nákup nějak dopředu promýšlela, nebo se rozhodla hned.",
      "Anička neplánovala ani nesrovnávala, peníze utratila hned po tom, co je dostala — bez rozmyslu, pod vlivem okamžité chuti na sladké.",
    ],
    explanation: "Anička peníze utratila hned, bez srovnávání nebo rozmyslu, což je impulzivní nákup.",
  },
  {
    q: "Co znamená, když rodina „šetří na dovolenou“?",
    key: "postupně odkládá peníze stranou, aby na dovolenou měla dost",
    d: [
      { value: "utrácí na dovolenou víc peněz, než má", why: "Utrácet víc, než rodina má, je opak šetření. Šetřit znamená peníze postupně odkládat stranou." },
      { value: "půjčuje si peníze na dovolenou od příbuzných", why: "Půjčka je jiný způsob, jak dovolenou zaplatit — peníze si rodina vezme a musí je vracet. Šetření znamená vlastní peníze postupně odkládat." },
      { value: "pečlivě počítá a promýšlí, kolik ta vysněná dovolená bude nakonec stát", why: "Zjištění ceny dovolené je jen první krok. Šetřit znamená peníze na ni skutečně postupně odkládat stranou." },
    ],
    hints: [
      "Přemýšlej, co rodina musí dělat měsíc po měsíci, aby na dovolenou nakonec měla dost peněz.",
      "Šetřit na něco znamená pravidelně odkládat část peněz stranou, dokud jich není dost — nejde jen o spočítání ceny nebo o půjčku.",
    ],
    explanation: "Šetřit na dovolenou znamená postupně odkládat část peněz stranou, dokud rodina nemá dost na zaplacení.",
  },
];

// ── L2 — aplikace na situaci z rodinného života ──────────────────────────
const POOL_L2: Polozka[] = [
  {
    q: "Tomáš potřebuje nové boty do školy, protože mu staré prokoukly na palci a v dešti mu do nich teče. Je tenhle nákup nezbytnost, nebo jen přání?",
    key: "potřeba",
    d: [
      { value: "přání", why: "Přání je něco, co chceme, i když to nutně nepotřebujeme. Tomášovi ale staré boty prokoukly a promokají, jde o nezbytnost, tedy potřebu." },
      { value: "výdaj", why: "Výdaj jen popisuje, že peníze z rozpočtu ubudou, neřekne, jestli jde o nezbytnost, nebo jen o chtění. Tady jde o potřebu." },
      { value: "kapesné", why: "Kapesné je pravidelná částka pro dítě, ne kategorie nákupu. Tenhle nákup je potřeba." },
    ],
    hints: [
      "Přemýšlej, jestli by Tomáš mohl v suchu a bez bolesti chodit dál ve starých botách.",
      "Věc nezbytnou pro běžný život poznáš podle toho, že se bez ní opravdu nedá fungovat. Staré boty už neplní svůj účel — promokají a tlačí.",
    ],
    explanation: "Boty, které už neplní svou funkci a promokají, jsou nezbytnost. Jde tedy o potřebu, ne o přání.",
  },
  {
    q: "Ema chce mít nejnovější bezdrátová sluchátka, protože je má skoro celá třída a bez nich si připadá trapně. Do jaké kategorie tahle touha patří?",
    key: "přání",
    d: [
      { value: "potřeba", why: "Bez sluchátek se dá běžně fungovat, i když si to Ema kvůli spolužákům tak nepřipadá. Jde o přání, ne o nezbytnost." },
      { value: "výdaj", why: "Výdaj jen popisuje, že by peníze z rozpočtu odešly, neřeší, jestli jde o nezbytnost, nebo chtěnou věc. Tady jde o přání." },
      { value: "spoření", why: "Spoření znamená peníze odkládat stranou, ne to, co si Ema přeje koupit. Její touha po sluchátkách je přání." },
    ],
    hints: [
      "Přemýšlej, jestli by Ema bez sluchátek nemohla normálně fungovat, nebo jí jen chybí pocit, že zapadá mezi kamarády.",
      "Věc, kterou chceme mít, i když ji nezbytně nepotřebujeme, zůstává jen chtěná — tlak kamarádů z ní nezbytnost nedělá.",
    ],
    explanation: "Sluchátka nejsou pro běžný život nezbytná, i když si to Ema kvůli spolužákům může myslet. Jde o přání.",
  },
  {
    q: "Babička dala vnukovi Filipovi k narozeninám peníze. Z pohledu Filipova hospodaření jde o…",
    key: "příjem",
    d: [
      { value: "výdaj", why: "Z babiččina pohledu šlo o výdaj, ale otázka se ptá na Filipovo hospodaření. Jemu peníze naopak přibyly, jde o příjem." },
      { value: "spoření", why: "Spoření by znamenalo, že si Filip peníze sám odkládá stranou. Tady jde jen o to, že mu peníze přibyly — o příjem." },
      { value: "rozpočet", why: "Rozpočet je celý plán hospodaření, ne jedna položka peněz. Dárek od babičky je pro Filipa příjem." },
    ],
    hints: [
      "Přemýšlej, čí pohled je v otázce důležitý a jestli u něj peníze přibývají, nebo ubývají.",
      "Otázka se ptá na Filipa, ne na babičku — jemu peníze přibyly, ať už jde o výplatu za práci, nebo o dárek od příbuzného.",
    ],
    explanation: "Z Filipova pohledu mu peníze přibyly, a to je příjem — bez ohledu na to, že pro babičku šlo o výdaj.",
  },
  {
    q: "Maminka zaplatila v obchodě za týdenní nákup potravin pro celou rodinu. Z pohledu rodinného rozpočtu jde o…",
    key: "výdaj",
    d: [
      { value: "příjem", why: "Příjem by znamenal, že rodině peníze přibudou. Placením za potraviny peníze naopak z rozpočtu odcházejí, jde o výdaj." },
      { value: "kapesné", why: "Kapesné je pravidelná částka pro dítě, ne nákup potravin pro celou rodinu. Tahle platba je výdaj." },
      { value: "spoření", why: "Spoření znamená peníze si nechávat stranou. Placení za potraviny naopak peníze z rozpočtu odčerpá, jde o výdaj." },
    ],
    hints: [
      "Přemýšlej, jestli maminčino placení peníze rodině přidává, nebo ubírá.",
      "Když rodina za něco zaplatí a peníze jí z rozpočtu odejdou pryč, patří tahle platba vždy do stejné kategorie — bez ohledu na to, co konkrétně kupuje.",
    ],
    explanation: "Placení za potraviny je výdaj: peníze při něm z rodinného rozpočtu odcházejí.",
  },
  {
    q: "Rodina si na začátku měsíce napsala, kolik peněz vydělá a kolik z nich může utratit za bydlení, jídlo a další věci. Jak se tomuhle plánu říká?",
    key: "rozpočet",
    d: [
      { value: "spoření", why: "Spoření znamená peníze odkládat stranou. Tady jde o celkový plán hospodaření s penězi, o rozpočet." },
      { value: "kapesné", why: "Kapesné je pravidelná částka pro jedno dítě, ne plán celé rodiny. Tomuhle plánu se říká rozpočet." },
      { value: "příjem", why: "Příjem je jen jedna část plánu — peníze, které rodina vydělá. Celý plán se nazývá rozpočet." },
    ],
    hints: [
      "Přemýšlej, jak se nazývá plán, ve kterém si rodina rozdělí peníze na jednotlivé výdaje dopředu.",
      "Hledané slovo popisuje celkový plán hospodaření rodiny — kolik peněz vydělá a jak si je rozdělí na jednotlivé výdaje.",
    ],
    explanation: "Plán, ve kterém si rodina předem rozdělí své příjmy na jednotlivé výdaje, se nazývá rozpočet.",
  },
  {
    q: "Adam dostává kapesné a část z něj pravidelně dává stranou do kasičky, aby si za pár měsíců mohl koupit dražší kolo. Jak se tomuhle jednání říká?",
    key: "spoření",
    d: [
      { value: "utrácení", why: "Utrácet znamená peníze hned používat. Adam si je naopak odkládá stranou, to je spoření." },
      { value: "kapesné", why: "Kapesné je peníze, které Adam dostává, ne to, co s nimi dělá. Jeho jednání se nazývá spoření." },
      { value: "rozpočet", why: "Rozpočet je plán celého hospodaření rodiny, ne to, že si jednotlivec odkládá peníze stranou. Adamovo jednání je spoření." },
    ],
    hints: [
      "Přemýšlej, co Adam s částí kapesného dělá — utrácí ji hned, nebo si ji nechává na později?",
      "Adam si peníze vědomě odkládá stranou na pozdější, dražší nákup, místo aby je hned utratil.",
    ],
    explanation: "Adam část kapesného pravidelně odkládá stranou na pozdější nákup, to je spoření.",
  },
  {
    q: "Petr si už dva týdny dopředu rozmýšlí, jestli si koupí nový batoh, porovnává ceny v obchodech a čeká, jestli nebude zlevněný. Jak se tomuhle způsobu nákupu říká?",
    key: "plánovaný nákup",
    d: [
      { value: "impulzivní nákup", why: "Impulzivní nákup je rozhodnutí bez rozmyslu. Petr naopak dlouho srovnává a čeká, jde o plánovaný nákup." },
      { value: "přání", why: "Otázka se neptá, jestli batoh je potřeba, nebo přání, ale jakým způsobem Petr nakupuje. Podle srovnávání a čekání jde o plánovaný nákup." },
      { value: "spoření", why: "Spoření by znamenalo, že si Petr peníze teprve odkládá stranou. Tady jde o způsob, jakým se rozhoduje o nákupu — o plánovaný nákup." },
    ],
    hints: [
      "Přemýšlej, co všechno Petr dělá ještě předtím, než si batoh koupí.",
      "Srovnávání cen a čekání na slevu jsou typické znaky rozmyšleného nákupu, ne rychlého rozhodnutí.",
    ],
    explanation: "Petr před nákupem srovnává ceny a čeká na slevu, to jsou znaky plánovaného nákupu.",
  },
  {
    q: "Viktorka uviděla v obchodě barevnou gumu na basketbal a hned si ji koupila, aniž by o tom předem přemýšlela. Jak se tomuhle způsobu nákupu říká?",
    key: "impulzivní nákup",
    d: [
      { value: "plánovaný nákup", why: "Plánovanému nákupu předchází srovnávání nebo čekání. Viktorka se rozhodla hned, bez přemýšlení, to je impulzivní nákup." },
      { value: "potřeba", why: "Otázka se neptá, jestli je guma potřeba, nebo přání, ale jak Viktorka nakupovala. Podle rychlého rozhodnutí bez přemýšlení jde o impulzivní nákup." },
      { value: "výdaj", why: "Výdaj jen popisuje, že peníze z rozpočtu odejdou, neříká nic o způsobu rozhodování. Tady jde o impulzivní nákup." },
    ],
    hints: [
      "Přemýšlej, kolik času uplynulo mezi tím, co Viktorka gumu uviděla, a tím, co si ji koupila.",
      "Rozhodnutí, které padne hned, bez srovnávání nebo přemýšlení, patří k rychlému nakupování bez rozmyslu.",
    ],
    explanation: "Viktorka se rozhodla koupit gumu hned, bez rozmyslu, což je impulzivní nákup.",
  },
  {
    q: "Rodina musí každý měsíc zaplatit nájem za byt, jinak by v něm nemohla dál bydlet. Do jaké kategorie tahle platba patří?",
    key: "potřeba",
    d: [
      { value: "přání", why: "Přání je něco chtěného, ale ne nezbytného. Bydlení je pro rodinu nezbytné, jde o potřebu." },
      { value: "spoření", why: "Spoření znamená peníze si odkládat stranou. Placení nájmu je naopak nezbytný výdaj, potřeba." },
      { value: "kapesné", why: "Kapesné je pravidelná částka pro dítě, ne platba za bydlení celé rodiny. Nájem je potřeba." },
    ],
    hints: [
      "Přemýšlej, co by se stalo, kdyby rodina nájem nezaplatila.",
      "Věc nezbytnou pro fungování rodiny poznáš podle toho, že bez ní by rodina přišla o bydlení — přesně jako u nezaplaceného nájmu.",
    ],
    explanation: "Placení nájmu je nezbytné pro to, aby rodina měla kde bydlet, jde tedy o potřebu.",
  },
  {
    q: "David by si moc přál mít nejnovější model počítačové hry, i když tu starou verzi ještě pořádně nedohrál. Do jaké kategorie tahle touha patří?",
    key: "přání",
    d: [
      { value: "potřeba", why: "Bez nové hry se dá běžně fungovat, obzvlášť když starou David ještě nedohrál. Jde o přání, ne o nezbytnost." },
      { value: "výdaj", why: "Výdaj jen popisuje, že by peníze z rozpočtu odešly, neřeší, jestli jde o nezbytnost. Tady jde o přání." },
      { value: "rozpočet", why: "Rozpočet je plán hospodaření celé rodiny, ne Davidova touha po hře. Jde o přání." },
    ],
    hints: [
      "Přemýšlej, jestli David novou hru nezbytně potřebuje, nebo si ji jen přeje mít.",
      "Věc, kterou chceme, i když to, co už máme, ještě dobře funguje, zůstává jen chtěná — přesně jako Davidova nedohraná stará hra.",
    ],
    explanation: "David starou hru ještě nedohrál, takže novou verzi nezbytně nepotřebuje — jde o přání.",
  },
  {
    q: "Rodiče si sepsali, kolik peněz měsíčně vydělají a na co všechno je rozdělí — bydlení, jídlo, spoření i zábavu. Jak se tomuhle plánu říká?",
    key: "rozpočet",
    d: [
      { value: "spoření", why: "Spoření je jen jedna z položek v plánu, ne celý plán. Celému plánu se říká rozpočet." },
      { value: "kapesné", why: "Kapesné je částka pro dítě, ne plán hospodaření celé rodiny. Tenhle plán je rozpočet." },
      { value: "výdaj", why: "Výdaj je jedna konkrétní platba, ne celý plán, jak si rodiče rozdělí peníze. Celému plánu se říká rozpočet." },
    ],
    hints: [
      "Přemýšlej, jak se nazývá plán, který zahrnuje všechny položky najednou — bydlení, jídlo, spoření i zábavu.",
      "Hledané slovo popisuje celkový plán, ve kterém rodiče rozdělí své peníze na všechny oblasti hospodaření.",
    ],
    explanation: "Plán, který zahrnuje všechny příjmy i výdaje rodiny najednou, se nazývá rozpočet.",
  },
  {
    q: "Bára si každý měsíc odkládá část svého kapesného stranou, protože chce příští léto jet na tábor s kamarády. Jak se tomuhle jednání říká?",
    key: "spoření",
    d: [
      { value: "kapesné", why: "Kapesné jsou peníze, které Bára dostává, ne to, co s částí z nich dělá. Její jednání je spoření." },
      { value: "impulzivní nákup", why: "Impulzivní nákup je rychlé rozhodnutí bez rozmyslu. Bára naopak dlouhodobě a promyšleně odkládá peníze stranou, to je spoření." },
      { value: "výdaj", why: "Výdaj by znamenal, že peníze z rozpočtu odcházejí pryč. Bára si je naopak nechává, to je spoření." },
    ],
    hints: [
      "Přemýšlej, co Bára s částí kapesného dělá — utrácí ji, nebo si ji nechává na později?",
      "Bára vědomě odkládá peníze stranou na budoucí cíl (tábor), místo aby je hned utratila.",
    ],
    explanation: "Bára si část kapesného pravidelně odkládá stranou na budoucí cíl, to je spoření.",
  },
  {
    q: "Starší bratr si o víkendech přivydělává hlídáním sousedových dětí. Peníze, které takhle dostane, jsou pro něj…",
    key: "příjem",
    d: [
      { value: "výdaj", why: "Výdaj by znamenal, že mu peníze ubývají. Za hlídání dětí mu naopak peníze přibývají, jde o příjem." },
      { value: "kapesné", why: "Kapesné dostává od rodičů bez práce navíc. Tady si peníze sám vydělal prací, jde o příjem." },
      { value: "spoření", why: "Spoření znamená peníze si odkládat stranou. Tady jde teprve o to, že mu peníze přibyly za práci — o příjem." },
    ],
    hints: [
      "Přemýšlej, jestli bratrovi za hlídání peníze přibývají, nebo ubývají.",
      "Peníze, které někdo získá za odvedenou práci, mu vždy přibudou — ať už jde o výplatu od zaměstnavatele, nebo o přivýdělek od sousedů.",
    ],
    explanation: "Peníze, které bratr dostane za hlídání dětí, jsou pro něj příjem — vydělal si je vlastní prací.",
  },
  {
    q: "Rodina zaplatila opravu pračky, která se pokazila. Z pohledu rodinného rozpočtu jde o…",
    key: "výdaj",
    d: [
      { value: "příjem", why: "Příjem by znamenal, že rodině peníze přibudou. Placením za opravu naopak peníze z rozpočtu odcházejí, jde o výdaj." },
      { value: "spoření", why: "Spoření znamená peníze si nechávat stranou. Placení za opravu naopak peníze z rozpočtu odčerpá, jde o výdaj." },
      { value: "rozpočet", why: "Rozpočet je celý plán hospodaření, ne jedna konkrétní platba. Placení za opravu je výdaj." },
    ],
    hints: [
      "Přemýšlej, jestli placení za opravu rodině peníze přidává, nebo ubírá.",
      "Neplánovaná platba, při které peníze z rozpočtu odejdou pryč, patří do stejné kategorie jako nájem nebo účty — i když šlo o nutnou opravu.",
    ],
    explanation: "Placení za opravu pračky je výdaj: peníze při něm z rodinného rozpočtu odcházejí.",
  },
  {
    q: "Standa šel s kamarádem kolem stánku se zmrzlinou, ucítil vůni a hned si koupil kopeček, i když si to předtím vůbec neplánoval. Jak se tomuhle způsobu nákupu říká?",
    key: "impulzivní nákup",
    d: [
      { value: "plánovaný nákup", why: "Plánovaný nákup si člověk dopředu rozmyslí a srovná možnosti. Standa se rozhodl hned na místě podle vůně, to je impulzivní nákup." },
      { value: "potřeba", why: "Otázka se neptá, jestli je zmrzlina potřeba, ale jak Standa nakupoval. Podle rychlého rozhodnutí jde o impulzivní nákup." },
      { value: "kapesné", why: "Kapesné jsou peníze, které Standa má k dispozici, ne způsob, jakým se rozhodl je utratit. Jde o impulzivní nákup." },
    ],
    hints: [
      "Přemýšlej, jestli si Standa koupi zmrzliny dopředu plánoval, nebo se rozhodl na místě.",
      "Rychlé rozhodnutí podle okamžité chuti, bez předchozího plánu, je typické pro nákup bez rozmyslu.",
    ],
    explanation: "Standa se rozhodl koupit zmrzlinu na místě podle vůně, bez předchozího plánu, to je impulzivní nákup.",
  },
];

// ── L3 — analýza a přenos ────────────────────────────────────────────────
const POOL_L3: Polozka[] = [
  {
    q: "Jakub si dva týdny dopředu srovnával ceny bot na internetu, počkal na výprodej, a pak u pokladny zaplatil kartou za pár vteřin. I když platba proběhla rychle, jak se tomuhle nákupu říká?",
    key: "plánovaný nákup",
    d: [
      { value: "impulzivní nákup", why: "Rychlost placení u pokladny o ničem nerozhoduje — impulzivní nákup poznáš podle toho, že mu nepředchází žádné srovnávání ani čekání. Jakub ale dlouho srovnával ceny a čekal na výprodej, proto jde o plánovaný nákup." },
      { value: "přání", why: "Otázka se neptá, jestli boty jsou potřeba, nebo přání, ale jakým způsobem Jakub nakupoval. Podle srovnávání a čekání jde o plánovaný nákup." },
      { value: "spoření", why: "Spoření by znamenalo, že si Jakub peníze teprve odkládá stranou. On už ale nakupuje, a to promyšleně po srovnání — jde o plánovaný nákup." },
    ],
    hints: [
      "Přemýšlej, co všechno Jakub dělal ještě předtím, než u pokladny zaplatil — a jestli na tom něco mění to, jak rychle proběhla samotná platba.",
      "Rozmyšlený nákup se pozná podle přípravy před koupí (srovnávání, čekání), ne podle toho, jak dlouho trvá platba u pokladny.",
    ],
    explanation: "Rozhodující pro plánovaný nákup je to, co mu předcházelo — srovnávání cen a čekání na výprodej, ne rychlost samotné platby u pokladny.",
  },
  {
    q: "Nikola strávila v obchodě půl hodiny, ale celou dobu jen chodila mezi regály a nakonec sáhla po první barevné mikině, která ji zaujala, aniž by ji s něčím srovnávala nebo zvažovala, jestli ji opravdu potřebuje. Jak se tomuhle nákupu říká?",
    key: "impulzivní nákup",
    d: [
      { value: "plánovaný nákup", why: "Dlouhá doba strávená v obchodě sama o sobě neznamená rozmyšlený nákup. Nikola nic nesrovnávala ani nezvažovala potřebu, rozhodla se podle toho, co ji zaujalo — to je impulzivní nákup." },
      { value: "potřeba", why: "Otázka se neptá, jestli mikina je potřeba, nebo přání, ale jak Nikola nakupovala. Podle chybějícího srovnávání jde o impulzivní nákup." },
      { value: "výdaj", why: "Výdaj jen popisuje, že peníze z rozpočtu odejdou, neříká nic o způsobu rozhodování. Tady jde o impulzivní nákup." },
    ],
    hints: [
      "Přemýšlej, jestli délka strávená v obchodě sama o sobě znamená, že Nikola nákup promýšlela.",
      "Rozhoduje to, jestli Nikola srovnávala možnosti a zvažovala potřebu, ne to, kolik času v obchodě strávila — a to nedělala.",
    ],
    explanation: "I když Nikola byla v obchodě dlouho, o koupi nic nesrovnávala ani nezvažovala, rozhodla se podle toho, co ji náhle zaujalo. To je impulzivní nákup.",
  },
  {
    q: "Matěj utratí celé kapesné hned, jakmile ho dostane. Jeho sestra Tereza si z každého kapesného malou část odloží stranou do kasičky. Za tři měsíce si oba přejí koupit stejně drahou stavebnici. Kdo si ji podle popsaného chování pravděpodobně bude moct dovolit dřív?",
    key: "Tereza, protože pravidelně odkládá část peněz stranou.",
    d: [
      { value: "Matěj, protože jeho kapesné je jistě vyšší.", why: "V příběhu není nikde řečeno, že by Matěj dostával víc peněz. Rozdíl je v tom, že Tereza si část kapesného pravidelně odkládá, a tak si na stavebnici naspoří rychleji." },
      { value: "Oba stejně, protože kapesné dostávají ve stejné výši.", why: "I kdyby dostávali stejně, záleží na tom, co s penězi dělají. Tereza si část odkládá stranou, Matěj vše hned utratí — proto si stavebnici naspoří dřív ona." },
      { value: "Matěj, protože nakupuje impulzivně a impulzivní nákupy vyjdou levněji.", why: "Impulzivní nákup neznamená nižší cenu, jen rychlé rozhodnutí bez rozmyslu. Na dražší věc pomáhá naspořit odkládání peněz, ne způsob nakupování." },
    ],
    hints: [
      "Přemýšlej, kdo z obou sourozenců bude mít po třech měsících víc peněz stranou — ne kdo dostává víc kapesného.",
      "Rozhoduje, co každý ze sourozenců dělá se svými penězi měsíc po měsíci: pravidelné odkládání části peněz umožňuje naspořit i na dražší věc.",
    ],
    explanation: "Tereza si každý měsíc odkládá část kapesného stranou, zatímco Matěj vše hned utrácí. Za tři měsíce proto bude mít Tereza naspořeno víc a na stavebnici dosáhne dřív.",
  },
  {
    q: "Maminka si o víkendu přivydělala hlídáním sousedových dětí a tyhle peníze dala synovi Kryštofovi jako dárek k narozeninám. Z pohledu maminčina hospodaření šlo o výdaj — peníze jí z rozpočtu odešly. Čím bude tahle stejná platba pro Kryštofa?",
    key: "příjmem, protože jemu peníze přibyly",
    d: [
      { value: "také výdajem, protože jde o jednu a tutéž platbu", why: "Jedna a tatáž platba může být z pohledu jednoho člověka výdaj a z pohledu druhého příjem zároveň — rozhoduje, čí rozpočet zrovna sledujeme. Kryštofovi peníze přibyly, pro něj je to příjem." },
      { value: "kapesné, protože jde o peníze pro dítě", why: "Kapesné je pravidelná menší částka, kterou dítě dostává na vlastní hospodaření. Tady jde o jednorázový dárek k narozeninám, ne o kapesné — pro Kryštofa je to příjem." },
      { value: "spoření, protože maminka peníze pro syna dala stranou", why: "Spoření znamená, že si někdo sám odkládá peníze stranou na později. Maminka mu je rovnou dala, neuložila je stranou na později — Kryštofovi jen přibyly, je to příjem, ne spoření." },
    ],
    hints: [
      "Nezaměňuj se — otázka se ptá na Kryštofovo hospodaření, ne na maminčino, i když jde o tutéž platbu.",
      "Stejná platba může být pro jednoho výdaj a pro druhého příjem zároveň — rozhoduje, čí rozpočet zrovna sledujeme, ne to, kolikrát se peníze v příběhu zmíní.",
    ],
    explanation: "Stejná platba je z pohledu maminky výdaj, protože jí peníze z rozpočtu odešly. Z pohledu Kryštofa ale peníze přibyly, takže pro něj jde o příjem — jedna platba může být pro dva lidi zároveň dvě různé věci.",
  },
  {
    q: "Vojtovi propadává bota a v zimě by mu v ní promokala noha. V obchodě si ale vybírá rovnou nejdražší model se spoustou funkcí, které nikdy nevyužije, přestože levnější boty by mu udělaly stejnou službu. Co je z tohohle příběhu jeho skutečná potřeba?",
    key: "mít nepromokavé, funkční boty",
    d: [
      { value: "koupit si rovnou nejdražší model bot", why: "Koupě nejdražšího modelu s nadbytečnými funkcemi je navíc přání. Vojtova skutečná potřeba je mít funkční, nepromokavé boty, ne konkrétně ten nejdražší kus." },
      { value: "nechat si staré boty, ať ještě vydrží", why: "Staré boty už neplní svůj účel, propouštějí vodu. Potřebou je mít funkční boty, ne šetřit na starých, které už neslouží." },
      { value: "mít boty stejné značky jako kamarádi", why: "Značka souvisí spíš s přáním zapadnout mezi vrstevníky, ne s nezbytností mít suché nohy. Potřebou je funkční obuv." },
    ],
    hints: [
      "Rozliš, co Vojta v příběhu opravdu potřebuje, a co je navíc jen jeho chtění, které s potřebou souvisí, ale není totéž.",
      "Skutečná potřeba je jen ta část rozhodnutí, bez které by Vojta měl promočené nohy — ne konkrétní drahý model, který si k tomu navíc přeje.",
    ],
    explanation: "Vojtova skutečná potřeba je mít funkční, nepromokavé boty. Výběr rovnou nejdražšího modelu s funkcemi navíc je už přání, které se s potřebou jen spojilo.",
  },
  {
    q: "Rodina si na začátku měsíce naplánovala rozpočet, kolik utratí za jídlo, bydlení a zábavu. Uprostřed měsíce si ale rodiče třikrát impulzivně koupili drahé věci, které v plánu nebyly. Co se pravděpodobně stane s penězi na zbytek měsíce?",
    key: "Na plánované výdaje, třeba na jídlo, může nakonec zbýt míň peněz, než rodina počítala.",
    d: [
      { value: "Nic, impulzivní nákupy se do rozpočtu nezapočítávají.", why: "I neplánovaný nákup peníze z rozpočtu ubere, jen se s ním předem nepočítalo — proto na ostatní výdaje může zbýt míň." },
      { value: "Rodině peníze naopak přibudou, protože si koupili nové věci.", why: "Nákup peníze ubírá, nepřidává je, ať je plánovaný, nebo impulzivní." },
      { value: "Rozpočet se automaticky zvětší o částku, kterou utratili navíc.", why: "Rozpočet sám od sebe nenarůstá. Když se utratí víc, než se plánovalo, chybí to jinde." },
    ],
    hints: [
      "Přemýšlej, odkud by se vzaly peníze na tři nečekané nákupy, když je rodina v plánu neměla.",
      "Peníze v rozpočtu jsou omezené — co se utratí navíc na jedné věci, chybí jinde, na výdajích, se kterými rodina počítala.",
    ],
    explanation: "Impulzivní nákupy nebyly v plánu, přesto z rozpočtu ubraly peníze. Proto na plánované výdaje, jako je jídlo, může nakonec zbýt méně, než rodina počítala.",
  },
  {
    q: "Teta půjčila rodině peníze na opravu auta a rodina jí je za dva měsíce vrátila zpátky celé. Jak vrácení půjčky ovlivní rodinný rozpočet v měsíci, kdy peníze vrací?",
    key: "je to výdaj, protože v tom měsíci peníze z rozpočtu odejdou",
    d: [
      { value: "je to příjem, protože rodina peníze od tety předtím dostala", why: "Přijetí půjčky bylo příjmem v jiném, dřívějším měsíci. Otázka se ptá na měsíc, kdy rodina peníze vrací — tehdy peníze naopak odcházejí, je to výdaj." },
      { value: "je to spoření, protože se vrací naspořené peníze", why: "Nejde o peníze, které si rodina sama odkládala, ale o splátku dluhu tetě. V měsíci vrácení jde o výdaj." },
      { value: "rozpočet to nijak neovlivní, protože se jen vrací to, co si rodina půjčila", why: "Peníze skutečně z rodinného rozpočtu v tom měsíci odejdou, i když jde jen o splátku dluhu. To je výdaj, rozpočet to ovlivní." },
    ],
    hints: [
      "Rozliš dva různé měsíce v příběhu — kdy si rodina peníze půjčila a kdy je vrací — a ptej se, co se děje s penězi v tom druhém.",
      "V měsíci, kdy rodina peníze vrací, jí z rozpočtu skutečně odcházejí, i když jde jen o splacení dluhu — proto je to výdaj.",
    ],
    explanation: "V měsíci vrácení půjčky peníze z rodinného rozpočtu skutečně odejdou, i když šlo jen o splátku dluhu tetě. Proto jde o výdaj.",
  },
  {
    q: "O víkendu jel Radek s rodiči nakupovat oblečení do školy, které si předem naplánovali. U pokladny ale uviděl na poličce sladkost a bez přemýšlení ji přidal do košíku. Co z popsaného nákupu bylo impulzivní?",
    key: "přidání sladkosti do košíku u pokladny",
    d: [
      { value: "koupě oblečení do školy", why: "Oblečení do školy byl předem naplánovaný nákup s rodiči, ne rozhodnutí na poslední chvíli. Impulzivní byla jen sladkost, kterou Radek přidal bez přemýšlení." },
      { value: "celý nákup v obchodě", why: "Většina nákupu, oblečení, byla naplánovaná předem. Impulzivní byla jen ta jedna maličkost navíc, sladkost u pokladny." },
      { value: "výběr obchodu, kam rodina šla", why: "Výběr obchodu není samotný nákup ani rozhodnutí věc koupit. Impulzivní byla sladkost přidaná bez rozmyslu u pokladny." },
    ],
    hints: [
      "Rozliš v příběhu dvě různé věci, které si Radek koupil, a u každé z nich se ptej, jestli jí předcházelo přemýšlení.",
      "Impulzivní bylo jen to rozhodnutí, které padlo bez rozmyslu na poslední chvíli — ne ta část nákupu, která byla domluvená předem.",
    ],
    explanation: "Oblečení do školy si rodina naplánovala předem, to je plánovaný nákup. Sladkost u pokladny si ale Radek přidal bez přemýšlení, to je ta impulzivní část nákupu.",
  },
  {
    q: "Emil je zvyklý každý týden utratit celé kapesné do posledního haléře. Když se mu porouchá oblíbená hra a bude ji potřebovat opravit za částku vyšší, než je jedno kapesné, jak snadno na to bude mít peníze?",
    key: "Těžko, protože nemá žádnou rezervu z předchozích týdnů.",
    d: [
      { value: "Snadno, celé příští kapesné mu na opravu stačí.", why: "Příští kapesné pokryje jen běžný týden, ne mimořádný výdaj navíc, který je dražší než jedno kapesné. Bez rezervy z předchozích týdnů na opravu peníze chybí." },
      { value: "Snadno, protože impulzivní nákupy peníze šetří.", why: "Impulzivní nákupy peníze nešetří, jen se při nich peníze rychle utrácejí bez rozmyslu. Emilovi bude na opravu peněz chybět." },
      { value: "Stejně snadno jako jeho kamarádce, která si peníze odkládá.", why: "Kamarádka, která si část kapesného pravidelně odkládá, bude mít na mimořádný výdaj rezervu. Emil bez rezervy na tom bude hůř." },
    ],
    hints: [
      "Přemýšlej, co Emilovi zbývá z předchozích týdnů, když si celé kapesné vždy hned utratí.",
      "Mimořádný výdaj, který je dražší než jedno kapesné, se dá snadno zaplatit jen z rezervy, kterou si člověk dřív odložil — a tu Emil nemá.",
    ],
    explanation: "Protože Emil vždy utratí celé kapesné hned, nemá žádnou rezervu z předchozích týdnů. Na mimořádný výdaj dražší než jedno kapesné mu bude peněz chybět.",
  },
  {
    q: "Rodina sestavila rozpočet a naplánovala si v něm i částku na spoření. Uprostřed měsíce si ale koupili nový gril, který v rozpočtu nebyl, a museli proto částku na spoření snížit. Co se v tomto příběhu stalo se spořením?",
    key: "Kvůli neplánovanému výdaji na gril bylo míň peněz na spoření, než se plánovalo.",
    d: [
      { value: "Spoření se vůbec nezměnilo, protože nákup grilu spadá do úplně jiné kategorie výdajů.", why: "Peníze v rozpočtu jsou omezené — když se víc utratí na jedné položce, jako je gril, zbyde míň na jinou, jako je spoření." },
      { value: "Rodina si díky grilu naspořila víc, protože gril byl výhodná koupě.", why: "Koupě grilu peníze z rozpočtu ubírá, nezvyšuje částku na spoření." },
      { value: "Rozpočet na spoření se automaticky doplní příští měsíc.", why: "Nic se automaticky nedoplňuje — chybějící peníze na spoření se vrátí, jen pokud si rodina příště naplánuje méně jiných výdajů." },
    ],
    hints: [
      "Přemýšlej, odkud by se vzaly peníze na neplánovaný gril, když v rozpočtu na něj místo nebylo.",
      "Peníze v rozpočtu jsou omezené — co se navíc utratí na jedné položce, chybí na jiné, se kterou rodina počítala, třeba na spoření.",
    ],
    explanation: "Neplánovaný nákup grilu vzal peníze z rozpočtu, které měly jít na spoření. Proto rodina mohla ušetřit méně, než původně plánovala.",
  },
  {
    q: "Rodičům se porouchala pračka a bez ní nemůžou prát oblečení pro celou rodinu. V obchodě ale zvažují rovnou koupi nejdražšího modelu s funkcemi, které nikdy nevyužijí. Co je z tohohle příběhu skutečná potřeba rodiny?",
    key: "mít funkční pračku",
    d: [
      { value: "koupit nejdražší model s funkcemi navíc", why: "Nejdražší model s nadbytečnými funkcemi je navíc přání. Skutečnou potřebou je mít pračku, která funguje, ne konkrétně ten nejdražší kus." },
      { value: "nechat si starou nefunkční pračku", why: "Nefunkční pračka už neplní svůj účel. Potřebou je mít pračku, která opravdu pere." },
      { value: "ušetřit si peníze a prát natrvalo ručně", why: "Otázka se ptá na potřebu rodiny v této situaci, a tou je funkční pračka pro celou domácnost, ne trvalé ruční praní." },
    ],
    hints: [
      "Rozliš, co rodina v příběhu opravdu potřebuje, a co je navíc jen jejich chtění, které s potřebou souvisí, ale není totéž.",
      "Skutečná potřeba je jen ta část rozhodnutí, bez které by rodina neměla čím prát — ne konkrétní drahý model s funkcemi navíc.",
    ],
    explanation: "Rodina skutečně potřebuje pračku, která funguje. Zvažovaný nejdražší model s nadbytečnými funkcemi je už přání, které se s potřebou jen spojilo.",
  },
  {
    q: "Standa čekal tři týdny, než si mohl koupit novou helmu na kolo — ne proto, že by ceny srovnával, ale protože do té doby neměl dost kapesného. Jakmile měl dost peněz, koupil první helmu, kterou v obchodě uviděl. Jak se tomuhle nákupu říká?",
    key: "impulzivní nákup",
    d: [
      { value: "plánovaný nákup", why: "Dlouhé čekání samo o sobě neznamená plánovaný nákup — rozhoduje, jestli žák srovnával a zvažoval možnosti. Standa čekal jen kvůli penězům a pak koupil první helmu, kterou uviděl, to je impulzivní nákup." },
      { value: "spoření", why: "Čekání na dostatek peněz není totéž co spoření. O spoření by šlo, kdyby si Standa peníze cíleně odkládal stranou. Způsob, jakým nakonec nakoupil, je impulzivní." },
      { value: "potřeba", why: "Otázka se ptá na způsob nákupu, ne na to, jestli helmu potřebuje. Podle chybějícího srovnávání jde o impulzivní nákup." },
    ],
    hints: [
      "Přemýšlej, PROČ Standa čekal — kvůli srovnávání možností, nebo kvůli něčemu jinému — a jak se pak nakonec rozhodl.",
      "Dlouhé čekání ještě neznamená rozmyšlený nákup. Rozhoduje, jestli žák možnosti srovnával, a Standa nakonec koupil první helmu, kterou uviděl, bez srovnávání.",
    ],
    explanation: "Standa nečekal kvůli srovnávání, ale kvůli nedostatku peněz, a nakonec koupil první helmu bez rozmýšlení. To je impulzivní nákup, i když mu předcházelo dlouhé čekání.",
  },
];

// ── Generátor ────────────────────────────────────────────────────────────
function uloha(p: Polozka): PracticeTask | null {
  return choice(p.q, p.key, p.d, { hints: p.hints, explanation: p.explanation });
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  // Rotace bankou se nastaví tady, ne na úrovni modulu: dvě volání gen()
  // se stejným seedem tak dají stejné úlohy.
  let i = 0;
  return ruzneUlohy(() => losUlohy(() => uloha(pool[i++ % pool.length])));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const MAJETEK_A_PENIZE_HOSPODARENI_V_RODINE: TopicMetadata[] = [
  {
    id: "g6-vko-majetek-a-penize-hospodareni-v-rodine-6",
    rvpNodeId: "g6-vko-stat-a-hospodarstvi-majetek-a-penize-hospodareni-v-rodine-kapesne-setreni-planovani",
    displayName: "Hospodaření s penězi v rodině",
    title: "Majetek a peníze — hospodaření v rodině, kapesné, šetření, plánování",
    studentTitle: "Kapesné a rodinný rozpočet",
    subject: "vko",
    category: "Stát a hospodářství",
    topic: "Majetek a peníze",
    briefDescription: "Naučíš se rozeznat příjem, výdaj, potřebu, přání a promyšlený nákup.",
    keywords: [
      "příjem", "výdaj", "rozpočet", "spoření", "kapesné",
      "potřeba", "přání", "plánovaný nákup", "impulzivní nákup", "hospodaření", "peníze",
    ],
    goals: [
      "Rozlišit příjem a výdaj v rodinném rozpočtu.",
      "Rozeznat potřebu od přání v konkrétní situaci.",
      "Posoudit, jestli je nákup plánovaný, nebo impulzivní, a jaký to má důsledek.",
    ],
    boundaries: [
      "Žádné konkrétní částky, ceny, značky ani banky.",
      "Jen obecné pojmy hospodaření v rodině, ne investiční rady.",
      "Bez hodnocení, jaké rodinné uspořádání nebo styl utrácení je „lepší“.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Potřeba je nezbytnost (jídlo, bydlení), přání je jen chtěné. Příjem peníze přidává, výdaj ubírá. Plánovaný nákup předchází srovnávání a čekání, impulzivní vzniká bez rozmyslu.",
      steps: [
        "Zjisti, jestli věc je pro rodinu nezbytná (potřeba), nebo jen chtěná (přání).",
        "Rozmysli si, jestli peníze do rozpočtu přibývají (příjem), nebo z něj ubývají (výdaj).",
        "U nákupu se ptej, jestli mu předcházelo srovnávání a čekání, nebo šlo o rychlé rozhodnutí bez rozmyslu.",
      ],
      commonMistake: "Myslet si, že přání je totéž co potřeba, protože to má kamarád, nebo že rychlé zaplacení u pokladny automaticky znamená impulzivní nákup.",
      example: "Nové boty, když staré propouštějí vodu, jsou potřeba. Nejnovější model telefonu jen proto, že ho má spolužák, je přání.",
    },
  },
];
