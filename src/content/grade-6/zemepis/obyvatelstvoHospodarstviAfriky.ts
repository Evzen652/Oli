/**
 * Zeměpis 6. ročník — Afrika: obyvatelstvo, hospodářství, problémy kontinentu
 * (select_one).
 *
 * Celé téma emituje jen úlohy s možnostmi (žádné míchání typů). K obsahu nejsou
 * mapy ani obrázky: oblasti se pojmenovávají slovy (údolí Nilu, pobřeží
 * Guinejského zálivu, poušť Sahara, pás Sahel) a situace se popisují větami.
 *
 * Gradace:
 *  • L1 — zapamatování: krátká banka faktů (čím se lidé živí, co se těží, co se
 *    pěstuje na vývoz × pro vlastní potřebu, mladá populace, nejhustěji a
 *    nejřidčeji osídlené oblasti, kočovní pastevci, oáza, plantáž). Klíč
 *    „nerost / vývozní plodina / plodina pro domácí potřebu“ se u tří šablon
 *    losuje z tabulky, distraktory jsou z opačné skupiny.
 *  • L2 — použití: přírodní podmínky → život lidí a hospodářství (proč hustě
 *    osídlený Nil a Guinejský záliv, která plodina do které oblasti, proč se
 *    vyváží suroviny, jak žít v poušti, proč rostou města a co z toho plyne,
 *    kde hrozí sucho a hlad, proč kočují pastevci).
 *  • L3 — analýza a přenos: popis situace → příčina a řetěz důsledků
 *    (dezertifikace = přepásání + kácení + sucho, pád ceny jediné suroviny,
 *    dlouhodobé řešení sucha, nemoci z nekvalitní vody, chudoba navzdory
 *    nerostům, příčina × důsledek, monokultura, slumy). Znění je situační
 *    („Proč / Jak / Co se stane“), takže je disjunktní vůči L1.
 *
 * Chybový model (každý distraktor = konkrétní typická miskoncepce):
 *  • Afrika = celá poušť / všude stejně řídce osídlená;
 *  • záměna vývozních plodin (kakao, káva) s plodinami pro vlastní potřebu
 *    (proso, maniok) a vývozu surovin s vývozem hotových výrobků;
 *  • poušť se šíří sama větrem nebo horkem, člověk s tím nemá nic společného;
 *  • chudoba vysvětlená nechutí pracovat nebo tím, že Afrika nemá suroviny.
 *
 * Bezpečná fakta: žádné přesné číslo (počet obyvatel, délka Nilu), žádné
 * konkrétní země jako klíč. Rotace se nastavuje uvnitř gen(), modul nedrží
 * žádný stav mezi voláními.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import {
  pick,
  shuffle,
  losUlohy,
  ruzneUlohy,
  buildChoiceTask as choice,
  type Distractor,
} from "./_shared";

type Tvurce = () => PracticeTask | null;

/** Úloha nesmí obsahovat klíč ve znění otázky — jinak ji vylosujeme znovu. */
function hlidej(t: PracticeTask | null): PracticeTask | null {
  if (!t) return null;
  return t.question.includes(t.correctAnswer) ? null : t;
}

interface Fakt {
  q: string;
  key: string;
  d: [string, string][];
  hints: [string, string];
  explanation: string;
}

const fakt = (f: Fakt): PracticeTask | null =>
  hlidej(
    choice(
      f.q,
      f.key,
      f.d.map(([value, why]): Distractor => ({ value, why })),
      { hints: f.hints, explanation: f.explanation },
    ),
  );

const velke = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

// ── Tabulky pro šablony s losovaným klíčem ─────────────────────────────────

const NEROSTY = ["zlato", "diamanty", "ropa", "měď", "uhlí"];
const VYVOZNI = ["kakao", "káva", "bavlna", "čaj"];
const DOMACI = ["proso", "sorgo", "maniok"];
const MIRNE = ["brambory", "řepka", "žito", "ječmen"];

// ── L1: banka faktů ────────────────────────────────────────────────────────

const tezba = (): Fakt => {
  const key = pick(NEROSTY);
  const rostliny = shuffle([...VYVOZNI, ...DOMACI]).slice(0, 3);
  return {
    q: "Která z těchto věcí je v Africe nerostná surovina, kterou lidé získávají z podzemí?",
    key,
    d: rostliny.map((x): [string, string] => [
      x,
      `${velke(x)} je plodina: pěstuje se na poli nebo na plantáži, z podzemí se nezískává. Nerostná surovina pochází z hornin pod zemí.`,
    ]),
    hints: [
      "Rozlišuj, co se pěstuje na poli nebo na stromech, a co se získává z hornin pod zemí.",
      "Nerost je součást zemské kůry: kov, kámen nebo palivo, které se dobývá v dole nebo vrtem. Ostatní možnosti jsou z rostlinné výroby.",
    ],
    explanation:
      "Afrika je bohatá na nerostné suroviny — získává se zlato, diamanty, ropa, měď i uhlí. Kakao, káva, bavlna, čaj i proso rostou na polích a plantážích, takže to nejsou nerosty.",
  };
};

const vyvozniPlodina = (): Fakt => {
  const key = pick(VYVOZNI);
  return {
    q: "Co se v tropické Africe pěstuje hlavně na vývoz do jiných světadílů?",
    key,
    d: shuffle(MIRNE).slice(0, 3).map((x): [string, string] => [
      x,
      `${velke(x)}: to je plodina mírného pásu, v tropické Africe se na vývoz nepěstuje. Africké tropy dodávají do světa jiné plodiny.`,
    ]),
    hints: [
      "Uvědom si, jaké podnebí má tropická Afrika: celý rok teplo a hodně slunce, žádná zima.",
      "Vývozní plodiny potřebují teplo a hodně slunce, proto se pro světový trh pěstují hlavně v tropech a subtropech. Ostatní možnosti patří do mírného pásu.",
    ],
    explanation:
      "Kakao, káva, bavlna a čaj potřebují teplo a hodně slunce, proto se pro světový trh pěstují hlavně v tropech a subtropech, a Afrika je vyváží. Brambory, žito, ječmen a řepka patří do mírného pásu.",
  };
};

const domaciPlodina = (): Fakt => {
  const key = pick(DOMACI);
  return {
    q: "Kterou plodinu pěstují africké rodiny hlavně pro vlastní potřebu, ne na prodej?",
    key,
    d: shuffle(VYVOZNI).slice(0, 3).map((x): [string, string] => [
      x,
      `${velke(x)} se v Africe pěstuje hlavně na prodej do zahraničí, ne pro vlastní stůl rodiny.`,
    ]),
    hints: [
      "Ptej se, co si rodina může uvařit každý den a co se prodává do světa.",
      "Plodiny pro vlastní potřebu tvoří základ jídelníčku: kaše, placky a přílohy. Vývozní plodiny naopak rodinám hlavně přinášejí peníze.",
    ],
    explanation:
      "Proso, sorgo a maniok jsou základní potraviny — dělají se z nich kaše a placky. Kakao, káva, bavlna a čaj se pěstují hlavně na prodej do zahraničí.",
  };
};

const BANKA_L1: (Fakt | (() => Fakt))[] = [
  {
    q: "Čím se živí většina obyvatel Afriky na venkově?",
    key: "zemědělstvím a chovem dobytka",
    d: [
      ["prací v továrnách na automobily", "Velké továrny stojí jen v několika městech. Na venkově lidé žijí hlavně z toho, co vypěstují a odchovají."],
      ["těžbou ropy na volném moři", "Těžba ropy zaměstnává jen malou část lidí a probíhá na několika místech. Většina venkovanů hospodaří na půdě."],
      ["službami pro turisty ve velkých hotelech", "Turistika je důležitá jen v některých oblastech. Na venkově převažuje zemědělství."],
    ],
    hints: [
      "Ptej se, čím se živí lidé tam, kde nejsou velká města ani průmysl.",
      "Na venkově chybí továrny a většina rodin žije z toho, co získá přímo z okolní přírody. Škrtni všechno, co potřebuje velké město.",
    ],
    explanation: "Většina Afričanů na venkově pěstuje plodiny a chová dobytek. Průmysl, těžba i turistika zaměstnávají menší část lidí, hlavně ve městech.",
  },
  tezba,
  vyvozniPlodina,
  domaciPlodina,
  {
    q: "Jak se v Africe vyvíjí počet obyvatel?",
    key: "rychle roste a je hodně mladých lidí",
    d: [
      ["pomalu klesá a lidé rychle stárnou", "Tohle platí spíš pro část Evropy. V Africe se rodí hodně dětí a obyvatel přibývá rychle."],
      ["zůstává stejný, protože se rodí i umírá stejně", "Rodí se tam mnohem víc dětí, než lidí umírá, proto počet obyvatel rychle roste."],
      ["klesá, protože se lidé hromadně stěhují do Evropy", "Do zahraničí odchází jen malá část lidí. Počet obyvatel roste hlavně přirozeným přírůstkem."],
    ],
    hints: [
      "Porovnej to s Evropou: kolik dětí se tam rodí a jak dlouho lidé žijí.",
      "Rychlý přírůstek znamená, že se rodí mnohem víc lidí, než jich umírá. Rozhodni, jak to ovlivňuje složení obyvatel podle věku.",
    ],
    explanation: "Afrika má nejrychlejší přírůstek obyvatel na světě: rodí se hodně dětí a většinu lidí tvoří mladí. V Evropě je to naopak, obyvatelstvo tam stárne.",
  },
  {
    q: "Co znamená, že Afrika má mladé obyvatelstvo?",
    key: "velkou část lidí tvoří děti a mladí",
    d: [
      ["většinu lidí tvoří senioři nad 65 let", "Senioři tvoří v Africe malou část obyvatel. Mladé obyvatelstvo znamená opak."],
      ["lidé se tam dožívají nejvyššího věku na světě", "Střední délka života je v Africe naopak jedna z nižších. Slovo „mladé“ se týká složení podle věku."],
      ["děti tvoří jen malou část obyvatel", "Je to naopak: děti a mladí lidé jsou v Africe největší skupina."],
    ],
    hints: [
      "Slovo „mladé“ se neptá na stáří státu, ale na to, kolik je mezi obyvateli mladých lidí.",
      "Obyvatelstvo se skládá ze tří věkových skupin: děti, dospělí a senioři. U mladého obyvatelstva převládá ta nejmladší.",
    ],
    explanation: "Mladé obyvatelstvo znamená, že děti a mladí lidé tvoří velkou část všech obyvatel. V Africe je to důsledek vysoké porodnosti.",
  },
  {
    q: "Která oblast Afriky je osídlená nejřidčeji?",
    key: "poušť Sahara",
    d: [
      ["údolí řeky Nilu", "U Nilu je osídlení naopak nejhustší, řeka dává vodu a úrodnou půdu."],
      ["pobřeží Guinejského zálivu", "Vlhké pobřeží Guinejského zálivu patří k hustě osídleným oblastem."],
      ["okolí Viktoriina jezera", "U velkého jezera je dost vody a půdy, proto tam žije mnoho lidí."],
    ],
    hints: [
      "Ptej se, kde je nejhorší přístup k vodě a kde se skoro nedá pěstovat.",
      "Lidé se usazují tam, kde je voda a úrodná půda. Hledej oblast, která nemá ani jedno.",
    ],
    explanation: "Největší horká poušť světa je téměř neosídlená — chybí voda a úroda. Lidé žijí hlavně tam, kde je dost vláhy, tedy u řek, jezer a na vlhkém pobřeží.",
  },
  {
    q: "Která z těchto oblastí je v Africe osídlená nejhustěji?",
    key: "údolí a delta Nilu",
    d: [
      ["poušť Sahara", "Sahara je největší horká poušť světa a lidé v ní žijí jen ojediněle, hlavně v oázách."],
      ["poušť Kalahari", "Kalahari je suchá oblast, kde žije jen pár lidí na velké ploše."],
      ["deštný les v povodí Konga", "Voda tam sice je, ale hustý les a chudá půda dovolují osídlení jen řídké."],
    ],
    hints: [
      "Hustě lidé osidlují místa, kde je dost vody a úrodné půdy pro pole.",
      "Hledej místo, kde je voda, která se dá použít na zavlažování, a půda, na které se dobře pěstuje.",
    ],
    explanation: "Nejhustěji je v Africe osídlené údolí a delta Nilu — úzký pás úrodné půdy podél řeky uprostřed pouště. Pouště jako Sahara a Kalahari i hustý deštný les v Kongu jsou naopak řídce osídlené.",
  },
  {
    q: "Jak žijí tradiční pastevci v africké savaně a stepi?",
    key: "kočují se stády za pastvou a vodou",
    d: [
      ["usazují se na jednom místě a pěstují obilí", "Pastevci žijí hlavně z chovu zvířat a s nimi se stěhují za pastvou, obilí nepěstují."],
      ["žijí v oázách a starají se o datlovníky", "V oázách žijí hlavně zemědělci. Pastevci se stády kočují po savanách a stepích."],
      ["loví divokou zvěř v deštném lese", "Lovem se živí jiné skupiny lidí. Pastevci chovají stáda a vodí je za pastvou."],
    ],
    hints: [
      "Pastevec potřebuje pro stádo trávu a vodu. Ptej se, co dělá, když je v okolí vypase.",
      "Stádo spásá trávu tam, kde roste, a voda bývá jen na některých místech. Pastevec se proto podle nich musí řídit.",
    ],
    explanation: "Pastevci ve stepích a savanách žijí z chovu dobytka a stáda vodí za pastvou a vodou z místa na místo. Tomu se říká kočovný chov.",
  },
  {
    q: "Jak se nazývá zemědělství, při kterém rodina vypěstuje potraviny hlavně pro sebe?",
    key: "samozásobitelské",
    d: [
      ["tržní", "Tržní zemědělství pěstuje hlavně na prodej na trhu, ne pro vlastní stůl rodiny."],
      ["průmyslové", "Průmyslové zemědělství používá stroje a pěstuje na velkých plochách pro prodej."],
      ["vývozní", "Vývozní zemědělství pěstuje plodiny pro prodej do jiných zemí, ne pro vlastní stůl."],
    ],
    hints: [
      "Rozlož slovo: co si rodina vypěstuje, to sama sní — nic z toho neprodává.",
      "Ostatní pojmy popisují pěstování na prodej. Hledej ten, který se týká vlastní spotřeby rodiny.",
    ],
    explanation: "Při samozásobitelském zemědělství si rodina vypěstuje hlavně to, co sama sní. Plantáže a vývozní plodiny slouží k prodeji.",
  },
  {
    q: "Jak se nazývají velké farmy, na kterých se pěstuje jediná plodina na prodej?",
    key: "plantáže",
    d: [
      ["rodinné statky", "Rodinný statek je malé hospodářství, které živí hlavně jednu rodinu. Plantáž je velká a pěstuje na prodej."],
      ["sady a zahrady", "Sady a zahrady jsou menší plochy s ovocem a zeleninou. Nejde o velké farmy s jednou plodinou."],
      ["kolchozy", "Kolchoz je družstevní velkostatek, který znal hlavně bývalý Sovětský svaz. V Africe se pro velkou farmu na prodej používá jiný pojem."],
    ],
    hints: [
      "Hledej pojem pro velké zemědělské podniky, které pěstují stejnou plodinu na velké ploše.",
      "Rozhoduj podle dvou znaků: farma je velká a pěstuje se na ní jediná plodina na prodej.",
    ],
    explanation: "Plantáže jsou velké farmy, které pěstují jednu plodinu — třeba kakao, kávu nebo bavlnu — na prodej do zahraničí.",
  },
  {
    q: "Co africké země zpravidla vyvážejí do světa?",
    key: "nerostné suroviny a zemědělské plodiny",
    d: [
      ["automobily a elektroniku", "Auta a elektroniku vyrábí hlavně vyspělé průmyslové státy, ne většina afrických zemí."],
      ["letadla a těžké stroje", "Letadla a těžké stroje se v Africe vyrábějí velmi málo, tuto výrobu mají hlavně jiné části světa."],
      ["hotové oblečení a nábytek", "Většina afrických zemí vyváží suroviny. Hotové zboží spíš dováží."],
    ],
    hints: [
      "Přemýšlej, co Afrika vyrábí ve velkém množství: z půdy a z hornin.",
      "Průmysl je v Africe slabý. Vyvážet se proto dá hlavně to, co se získá z půdy a z podzemí.",
    ],
    explanation: "Africké země vyvážejí hlavně nerostné suroviny a zemědělské plodiny. Hotové výrobky, jako jsou auta a stroje, naopak většinou dovážejí.",
  },
  {
    q: "Co je oáza?",
    key: "místo v poušti, kde je voda a rostou rostliny",
    d: [
      ["vyschlé koryto řeky, kde teče voda jen po dešti", "To je popis suchého údolí, které se plní vodou jen po vzácných deštích. Oáza má vodu stále."],
      ["vysoká duna, kterou vítr přesouvá", "To je písečná duna. V oáze pramen zajišťuje vodu i zeleň."],
      ["kamenitá plošina bez vody a rostlin", "Kamenitá poušť je právě opakem: oáza je zelený ostrůvek s vodou."],
    ],
    hints: [
      "Představ si poušť a v ní jedno místo, které se od okolí zásadně liší.",
      "V poušti se voda vyskytuje jen výjimečně. Zaměř se na místo, kde je voda trvale a díky ní tam roste zeleň.",
    ],
    explanation: "Oáza je zelený ostrůvek v poušti u pramenů nebo studní. Roste tam zeleň, pěstují se plodiny a žijí tam lidé.",
  },
  {
    q: "Která africká nerostná surovina se používá hlavně jako palivo?",
    key: "ropa",
    d: [
      ["zlato", "Zlato je drahý kov, používá se na šperky a v elektronice. Jako palivo se nepoužívá."],
      ["diamanty", "Diamanty jsou drahé kameny na šperky a řezné nástroje. Jako palivo se nepoužívají."],
      ["měď", "Měď je kov na dráty a kabely. Jako palivo neslouží."],
    ],
    hints: [
      "Palivo je látka, která hoří a pohání motory nebo elektrárny. Zvaž, co z nabídky se k tomu hodí.",
      "U každé možnosti si řekni, k čemu se v praxi používá: na šperky, na dráty, nebo k pohonu strojů a aut.",
    ],
    explanation: "Ropa se vrtá z podzemí a zpracovává na benzin a naftu. Zlato, diamanty a měď jsou kovy a drahé kameny a jako palivo neslouží.",
  },
];

const faktL1 = (): PracticeTask | null => {
  const p = pick(BANKA_L1);
  return fakt(typeof p === "function" ? p() : p);
};

// ── L2: přírodní podmínky → život, hospodářství ────────────────────────────

const plodinaVlhke = (): Fakt => ({
  q: "Která plodina se nejlépe hodí do vlhkých tropů u Guinejského zálivu, kde je celý rok horko a často prší?",
  key: pick(["kakaovník", "banánovník"]),
  d: [
    ["datlovník", "Datlovník roste v oázách na poušti a vydrží sucho. Vlhké tropy nejsou jeho domov."],
    ["olivovník", "Olivovník patří k suchému středomořskému podnebí, ne do vlhkých tropů."],
    ["pšenice", "Pšenice potřebuje mírné podnebí s chladnějším obdobím, v horku a stálé vlhkosti se nevede."],
  ],
  hints: [
    "Rozhodni, jaké podnebí popisuje zadání: horko, hodně vody, žádná zima. Pak porovnej s tím, co která plodina potřebuje.",
    "Hledej plodinu, která miluje stálé teplo i vláhu. Plodiny suchých oblastí nebo mírného pásu takové podmínky nesnesou.",
  ],
  explanation: "Ve vlhkých tropech je celý rok horko a hodně srážek, což se daří kakaovníku i banánovníku. Datlovník patří do oáz, olivovník do suchého Středomoří a pšenice do mírného pásu.",
});

const plodinaSavana = (): Fakt => ({
  q: "Která plodina se nejlépe hodí do savany, kde je jen krátké období dešťů a dlouhé sucho?",
  key: pick(["proso", "sorgo"]),
  d: [
    ["kakaovník", "Kakaovník potřebuje stálou vláhu a horko po celý rok. Dlouhé sucho savany nevydrží."],
    ["čajovník", "Čajovník potřebuje hodně srážek po většinu roku, savana mu nestačí."],
    ["banánovník", "Banánovník potřebuje hodně vody celý rok a v dlouhém suchu by uschl."],
  ],
  hints: [
    "Rozhodni, kolik vody savana dává v průběhu roku, a hledej plodinu, která to vydrží.",
    "Savana má krátké deště a dlouhé sucho. Hodí se tam obilniny, které rychle dozrají a sucho snesou. Plodiny vlhkých tropů odpadají.",
  ],
  explanation: "V savaně zaprší jen v krátkém období, proto se daří obilninám odolným vůči suchu — prosu a sorgu. Kakaovník, čajovník i banánovník potřebují mnoho vody po celý rok.",
});

const plodinaOaza = (): Fakt => ({
  q: "Která plodina se hodí do oázy uprostřed pouště, kde je kolem pramene voda a horko?",
  key: "datlovník",
  d: [
    ["kakaovník", "Kakaovník potřebuje vlhké tropy s deštěm celý rok, v oáze by nepřežil."],
    ["kávovník", "Kávovník potřebuje dostatek srážek a mírnější polohu, v horkém suchu pouště se nevede."],
    ["čajovník", "Čajovník potřebuje hodně deště a vlhka. V poušti by mu chybělo vlhko."],
  ],
  hints: [
    "V oáze je voda jen z pramene, kolem je vyprahlá poušť. Hledej plodinu, která snese horko a přitom jí stačí pramen.",
    "Plodiny, které potřebují déšť celý rok, odpadají. Hledej strom, který roste v horku a dá se zavlažovat z pramene.",
  ],
  explanation: "Datlovník snáší horko a stačí mu zavlažování z pramene, proto je typický pro oázy. Kakaovník, kávovník i čajovník potřebují mnohem víc vláhy.",
});

const BANKA_L2: (Fakt | (() => Fakt))[] = [
  {
    q: "Proč se v údolí Nilu žije nejhustěji, i když okolo je poušť?",
    key: "Řeka dává vodu na zavlažování, kolem ní je úrodná půda.",
    d: [
      ["Okolo řeky je chladnější podnebí než jinde v Africe.", "Podnebí je tam horké a suché, jako v okolní poušti. Lidé se tam stahují kvůli vodě a půdě."],
      ["Právě tam se nejvíc těží diamanty a zlato.", "Těžba nerostů se týká jiných oblastí a nevysvětluje, proč je hustota lidí největší podél řeky."],
      ["Poušť kolem řeky je úrodná a stačí ji jen zorat.", "Poušť úrodná není. Plodiny se daří jen v úzkém pásu, který řeka zavlažuje."],
    ],
    hints: [
      "Zeptej se, co lidé potřebují k pěstování jídla a odkud se to dá v poušti získat.",
      "Řeka protéká pouští jako pás života. Zamysli se, co z ní mohou pole využít.",
    ],
    explanation: "Nil protéká pouští a dodává vodu na zavlažování; dříve pole hnojilo i úrodné bahno z pravidelných povodní. Kolem něj proto vznikl pás hustého osídlení uprostřed pouště.",
  },
  {
    q: "Proč je pobřeží Guinejského zálivu jednou z nejhustěji osídlených oblastí Afriky?",
    key: "Je tam dost vody a tepla, daří se plodinám a jsou tu přístavy.",
    d: [
      ["Většinu území tam zabírají pouště, lidé žijí jen u moře.", "U Guinejského zálivu jsou vlhké tropy, ne pouště. Poušť Sahara leží dál na sever."],
      ["Podnebí je tam mírné se čtyřmi ročními dobami.", "Je tam celý rok horko a hodně srážek, žádné čtyři roční doby tam nejsou."],
      ["Žijí tam hlavně kočovní pastevci s velkými stády.", "Kočovná stáda potřebují rozlehlé pastviny a v hustě osídleném vlhkém pobřeží je nenajdou."],
    ],
    hints: [
      "Hustě osídlené bývá místo s dobrými možnostmi k obživě. Zvaž, jaké podnebí u Guinejského zálivu panuje.",
      "Vlhké tropy mají hodně srážek a teplo po celý rok. Ptej se, jak to ovlivňuje pěstování a bydlení.",
    ],
    explanation: "Vlhké tropy u Guinejského zálivu mají hodně vody a teplo po celý rok, daří se tam třeba kakaovníku a banánovníku a vznikla tam velká přístavní města. Proto je oblast hustě osídlená.",
  },
  plodinaVlhke,
  plodinaSavana,
  plodinaOaza,
  {
    q: "Proč mnoho afrických zemí vyváží suroviny a dováží hotové výrobky?",
    key: "Chybí jim továrny, které by suroviny zpracovaly na výrobky.",
    d: [
      ["Suroviny se prodají dráž než hotové výrobky, proto je vyvážejí.", "Je to obráceně: z hotových výrobků je zisk vyšší. Surovina je levnější a zisk ze zpracování zůstává jinde."],
      ["Hotové výrobky se v tropech vyrábět nedají, je tam moc horko.", "Podnebí výrobě nebrání, továrny stojí i v horkých zemích jiných světadílů."],
      ["Výrobky vyrobené v Africe by se nikde na světě neprodaly.", "Problém není v tom, že by se neprodaly. Chybí továrny a peníze na jejich stavbu."],
    ],
    hints: [
      "Rozlišuj, co se prodává (surovina, výrobek) a kdo z toho má větší zisk.",
      "Surovina je jen začátek: aby z ní vznikl výrobek, je potřeba továrna. Zaměř se na to, co v zemi chybí, aby se to dělalo doma.",
    ],
    explanation: "Africe často chybí průmysl, který by suroviny zpracoval. Suroviny proto vyvážejí levné a nezpracované, dražší hotové výrobky pak musí dovážet.",
  },
  {
    q: "Jak lidé v poušti Sahara získávají vodu a obživu?",
    key: "Usazují se v oázách u pramenů a studní, část kočuje.",
    d: [
      ["Pěstují rýži na rozlehlých zaplavených polích mezi dunami.", "Rýže potřebuje spoustu vody. V poušti je voda jen na několika místech, ne na rozlehlých polích."],
      ["Chovají velká stáda skotu, která se pasou přímo na dunách.", "Na písečných dunách žádná tráva neroste. V poušti se chovají hlavně kozy a velbloudi."],
      ["Berou vodu z moře a pijí ji přímo, bez úpravy.", "Mořská voda je slaná a k pití nevhodná. Lidé v poušti čerpají vodu z pramenů a studní."],
    ],
    hints: [
      "Zeptej se, kde je v poušti voda a jak se lidé k ní dostanou nebo za ní vydají.",
      "Poušť má vodu jen na několika místech. Jedni se tam usadí, druzí ji hledají cestováním.",
    ],
    explanation: "V poušti je voda jen v oázách u pramenů a studní. Tam se usazují lidé a pěstují plodiny; část lidí kočuje se zvířaty od jednoho zdroje k druhému.",
  },
  {
    q: "Proč africká města rostou tak rychle?",
    key: "Lidé odcházejí z vesnic za prací a školami a rodí se hodně dětí.",
    d: [
      ["Lidé se stěhují z měst na venkov, kde je víc práce i škol.", "Je to naopak: na venkově je práce i škol méně, a proto lidé míří do měst."],
      ["Do měst se hromadně stěhují pracovníci z Evropy a Ameriky.", "Přistěhovalci ze zahraničí tvoří jen malou část. Většina lidí přichází z vlastních vesnic."],
      ["Města získala nová území, ale počet obyvatel zůstává stejný.", "Počet obyvatel měst roste velmi rychle, není pravda, že by zůstával stejný. Zvyšuje ho přírůstek i příliv lidí z venkova."],
    ],
    hints: [
      "Ptej se, co dělá města přitažlivá pro lidi z venkova a jak se mění počet lidí v rodinách.",
      "Rychlý růst má dva zdroje: lidé přicházejí zvenčí a lidé se ve městě rodí. Zvaž, které možnosti tyto dva zdroje zachycují.",
    ],
    explanation: "Města rostou dvěma způsoby: z vesnic do nich míří lidé za prací a školami a přirozeným přírůstkem přibývají další obyvatelé.",
  },
  {
    q: "Co přináší městům to, že rostou rychleji, než se stačí stavět domy?",
    key: "Vznikají chudinské čtvrti (slumy) a chybí bydlení i pitná voda.",
    d: [
      ["Ceny bytů klesají, protože jich je víc než zájemců.", "Když lidé přibývají rychleji než domy, bytů je málo a ceny nejdou dolů."],
      ["Města zbohatnou a všude přibude kanalizace i zeleň.", "Rychlý růst bývá rychlejší než výstavba kanalizace a vodovodů. Bohatství nepřibývá tak rychle jako lidé."],
      ["Všichni noví obyvatelé najdou stálou práci v nových továrnách.", "Práce nestačí pro všechny, proto se mnoho lidí živí příležitostně a bydlí v provizorních domech."],
    ],
    hints: [
      "Porovnej rychlost, s jakou přibývají lidé, s rychlostí, s jakou se staví domy a vodovody.",
      "Když lidí přibývá rychleji než bytů, hledají si bydlení, kde se dá. Zvaž, co to znamená pro kvalitu bydlení a vody.",
    ],
    explanation: "Když lidé přicházejí rychleji, než se staví domy, vznikají chudinské čtvrti — slumy. Chybí v nich bydlení, pitná voda a kanalizace.",
  },
  {
    q: "Která z těchto oblastí Afriky je typická opakovaným suchem a hladem?",
    key: "pás Sahel na jižním okraji Sahary",
    d: [
      ["deštný les v povodí řeky Konga", "V deštném lese prší po celý rok a vody je dost. Sucho tam nehrozí."],
      ["úrodná delta řeky Nilu", "Delta Nilu má stálý zdroj vody z řeky, proto tam hlad ze sucha nehrozí tak často jako v Sahelu."],
      ["pobřeží Guinejského zálivu", "Pobřeží Guinejského zálivu má srážek hodně, a proto tam sucho hrozí jen výjimečně."],
    ],
    hints: [
      "Hledej oblast, kde deště bývají vzácné a nepravidelné, ne tam, kde je stálý zdroj vody.",
      "Neúroda a hlad se opakují tam, kde jsou srážky nejnejistější. Zvaž, kde zemědělec nemůže na déšť spoléhat.",
    ],
    explanation: "Sahel je pás na jižním okraji Sahary, kde prší málo a nepravidelně. Když deště selžou, pole nic neurodí a hrozí hlad. Podobně bývá postižený i Africký roh na východě kontinentu.",
  },
  {
    q: "Proč se v Africe ve velkém pěstují kakaovníky a kávovníky, například na plantážích?",
    key: "Sklizeň se prodává do zahraničí a přináší peníze.",
    d: [
      ["Kakao a káva jsou hlavní potraviny, kterými se Afričané sytí.", "Základem stravy jsou kaše a placky z prosa, sorga nebo manioku. Kakao a káva se převážně prodávají."],
      ["Mají uživit místní vesnici, ve které rostou.", "Kakao a káva nejsou základní potraviny, rodiny se jimi nenasytí. Pěstují se hlavně kvůli prodeji."],
      ["Stát je pěstuje, aby nemusel dovážet potraviny.", "Kakao ani káva dovoz potravin nenahradí. Slouží k prodeji do zahraničí."],
    ],
    hints: [
      "Vzpomeň, z čeho se skládá běžný jídelníček afrických rodin, a porovnej to s kakaem a kávou.",
      "Zamysli se, kdo kakao a kávu ve velkém spotřebovává: rodiny, které je pěstují, nebo lidé v jiných částech světa?",
    ],
    explanation: "Kakao a káva se pěstují hlavně na prodej, na plantážích i na menších rodinných farmách. Vyvážejí se do zahraničí a přinášejí peníze pěstitelům i státu.",
  },
  {
    q: "Proč pastevci v savaně a stepi často kočují se stády?",
    key: "Pastva a voda na jednom místě po čase dojdou.",
    d: [
      ["Chtějí být blíž velkým městům, kde prodají mléko a maso.", "Města jsou pro prodej užitečná, ale stádo se přesouvá kvůli pastvě a vodě, ne kvůli trhům."],
      ["Každou zimu musí před sněhem na jih.", "Sníh se v savaně a stepi nevyskytuje. Přesuny se řídí pastvou a vodou."],
      ["Hledají nová místa, kde by mohli založit pole a pěstovat obilí.", "Pastevci žijí hlavně z chovu zvířat, pole neobdělávají. Přesuny se řídí pastvou a vodou."],
    ],
    hints: [
      "Zeptej se, co se stane s trávou a vodou, když stádo dlouho zůstává na téže pastvině.",
      "Zásoby trávy i vody kolem stáda jsou omezené. Hledej odpověď, která vysvětlí, proč se stádo přesouvá.",
    ],
    explanation: "Stádo spase trávu a spotřebuje vodu, takže se pastevci musejí přesunout za novou pastvou. Proto vedou kočovný způsob života.",
  },
  {
    q: "Proč z vysoké porodnosti vyplývá, že v Africe převládají děti a mladí lidé?",
    key: "Rodí se víc lidí, než jich umírá, a mladých tak přibývá nejvíc.",
    d: [
      ["Lidé se v Africe dožívají nejvyššího věku na světě.", "Střední délka života je v Africe naopak nižší než v Evropě. Mladé obyvatelstvo vzniká vysokou porodností."],
      ["Do Afriky se stěhuje hodně mladých lidí z Evropy.", "Přistěhovalců je málo, obyvatel přibývá hlavně narozením dětí."],
      ["Starší lidé z Afriky odcházejí do Evropy, a tak tam zůstávají jen mladí.", "Do zahraničí odchází jen malá část lidí. Věkové složení určuje hlavně to, že narozených je víc než zemřelých."],
    ],
    hints: [
      "Přemýšlej, která věková skupina se rozroste nejvíc, když se rodí hodně dětí.",
      "Porovnej, kolik lidí přibude narozením a kolik ubude úmrtím. Z toho poznáš, která věková skupina převládne.",
    ],
    explanation: "V Africe se rodí víc lidí, než jich umírá, a rodiny bývají větší. Proto obyvatel rychle přibývá a nejmladší věkové skupiny jsou nejpočetnější.",
  },
  {
    q: "Proč je půda v tropickém deštném lese pro zemědělství horší, než by se čekalo?",
    key: "Prudké deště vyplavují živiny a vrstva úrodné půdy je tenká.",
    d: [
      ["Je tam málo srážek a půda se rychle vysuší.", "V deštném lese prší po celý rok, srážek je naopak nadbytek."],
      ["V lese žijí zvířata, která veškerou úrodu spasou.", "Zvířata nejsou příčinou. Slabá půda vzniká vyplavováním živin a tenkou vrstvou úrodné půdy."],
      ["Je tam příliš chladno na to, aby plodiny rostly.", "Deštný les je horký po celý rok. Chlad tam nehrozí."],
    ],
    hints: [
      "Zeptej se, co dělá voda s půdou, když padá v obrovském množství každý den.",
      "Hodně deště nemusí znamenat úrodnou půdu. Rozhodni, jestli voda živiny v půdě udrží, nebo je odplaví.",
    ],
    explanation: "V deštném lese silné deště vyplavují živiny z půdy a vrstva úrodné půdy je tenká. Proto se po vykácení lesa pole rychle vyčerpají.",
  },
];

const faktL2 = (): PracticeTask | null => {
  const p = pick(BANKA_L2);
  return fakt(typeof p === "function" ? p() : p);
};

// ── L3: popis situace → příčina a řetěz důsledků ───────────────────────────

const BANKA_L3: Fakt[] = [
  {
    q: "Pastevci dlouhodobě nechávají stáda spásat trávu na okraji Sahary. Deště jsou vzácné a půda se postupně vysušuje a zpustne. Který jev to popisuje a proč vzniká?",
    key: "Dezertifikace: přepásání, kácení dřevin a sucho ničí půdní kryt.",
    d: [
      ["Vítr na okraji pouště nanáší písek a nedá se tomu nijak zabránit.", "Vítr písek přenáší, ale příčinou není on sám. Půdu ničí lidská činnost spolu se suchem a s tím se dá bojovat."],
      ["Půda zpustne jen proto, že je v Africe horko.", "Horko samo půdu nezničí. Ke zpustnutí vede přepásání, kácení a sucho dohromady."],
      ["Mořská voda při povodních zasolí půdu a nic na ní neroste.", "Na okraji Sahary jde o vyprahlost půdy, ne o zasolení mořskou vodou."],
    ],
    hints: [
      "Rozlišuj, co tu působí přirozeně (déšť, vítr) a co dělají lidé a zvířata.",
      "Když rostliny zmizí, ztrácí půda kořeny, stín i vláhu. Rozhodni, zda jev vzniká sám, nebo ho člověk urychluje.",
    ],
    explanation: "Popisuje se dezertifikace — degradace půdy, kdy se krajina vysušuje, ztrácí vegetaci a začíná se podobat poušti. Vzniká sčítáním tří příčin: stáda vypásají trávu, lidé kácejí dřeviny a je málo dešťů. Vítr samotný poušť nezpůsobuje, jen odnáší už obnaženou půdu.",
  },
  {
    q: "Africká země získává většinu příjmů z vývozu jediné rudy. Na světovém trhu její cena prudce klesne. Co se pravděpodobně stane doma?",
    key: "Příjmy státu klesnou a v dolech i v podnicích kolem nich ubyde práce.",
    d: [
      ["Příjmy zůstanou stejné, protože země prostě vyveze víc rudy.", "Za nižší cenu dostane země méně peněz i při větším množství. Příjmy proto klesnou."],
      ["Příjmy stoupnou, protože lacinější ruda se lépe prodává.", "Země vydělává na ceně, ne jen na množství. Při nižší ceně jí peněz ubude."],
      ["Nic se nestane, cena na světovém trhu se do příjmů státu nepromítne.", "Země prodává rudu za světovou cenu. Když klesne, klesnou i příjmy."],
    ],
    hints: [
      "Spočítej si příjem jako množství krát cena. Co se stane, když klesne cena?",
      "Stát, který má jediný zdroj příjmů, nemá čím pokles vyrovnat. Zvaž, jak se to projeví na práci a rozpočtu.",
    ],
    explanation: "Země závislá na vývozu jediné suroviny je zranitelná: když cena klesne, klesnou příjmy státu i mzdy. Doly a navazující podniky pak propouštějí a lidé ztrácejí práci.",
  },
  {
    q: "Studna ve vesnici v suché savaně vyschla a lidé nemají čím zalévat pole. Které opatření pomůže z dlouhodobého hlediska nejvíc?",
    key: "Vyhloubit hlubší studnu a šetřit vodou při zavlažování.",
    d: [
      ["Jen rozdávat potravinovou pomoc.", "Pomoc zažene hlad jen na čas. Bez vody se pole neobnoví a problém se vrátí."],
      ["Zvětšit stáda, aby se vesnice uživila mlékem a masem.", "Větší stáda vypasou i poslední trávu a půdu ještě víc poničí."],
      ["Vykácet okolní keře a získat tak místo na další pole.", "Bez keřů a stromů půda vysychá rychleji a pole se stanou ještě méně úrodná."],
    ],
    hints: [
      "Rozlišuj pomoc na chvíli a řešení, které odstraní příčinu nedostatku vody.",
      "Dlouhodobé řešení zajistí stálý zdroj vody a zároveň s vodou šetří. Ptej se, které opatření řeší příčinu, a ne jen následek.",
    ],
    explanation: "Trvalé řešení potřebuje stálý zdroj vody a šetrné zavlažování, aby se voda i půda nevyčerpaly. Jen rozdávat jídlo pomůže na chvíli, větší stáda a kácení keřů půdu naopak ničí.",
  },
  {
    q: "Na okraji rychle rostoucího města bez kanalizace bydlí tisíce lidí a pitnou vodu berou z jedné znečištěné studny. Jaký problém hrozí a proč?",
    key: "Nemoci z nekvalitní vody, protože se odpad mísí s pitnou vodou.",
    d: [
      ["Hrozí hlavně nemoci z horka a komárů, s vodou to nesouvisí.", "Horko i komáři škodí, ale střevní nemoci se šíří právě znečištěnou pitnou vodou."],
      ["Problém vyřeší déšť, který studnu propláchne a znečištění odplaví.", "Déšť odpad naopak splaví ke studni. Čistou pitnou vodu nezajistí."],
      ["Nic nehrozí, v horku se všechny nečistoty ve vodě samy zničí.", "Teplo bakterie nezničí, často se v něm množí ještě rychleji."],
    ],
    hints: [
      "Ptej se, co se stane, když se do studny dostane odpad z domů, kde není kanalizace.",
      "Kanalizace odvádí odpad pryč od pitné vody. Když chybí, mísí se oba dohromady. Zvaž, co to znamená pro zdraví lidí.",
    ],
    explanation: "Bez kanalizace se odpadní voda dostane do studny s pitnou vodou a šíří se z ní nemoci. U rychle rostoucích měst je proto čistá voda velký úkol.",
  },
  {
    q: "Afrika má velké zásoby nerostů, a přesto v mnoha zemích žije většina lidí v chudobě. Jak to lze vysvětlit?",
    key: "Suroviny se vyvážejí bez zpracování a domácí průmysl je slabý.",
    d: [
      ["Lidé tam nechtějí pracovat, a proto se doly zavírají.", "Chudobu nezpůsobuje nechuť pracovat. Zisk ze zpracování zůstává v zahraničí a doma chybí průmysl."],
      ["Těžba je tak drahá, že se suroviny vůbec nevyvážejí.", "Suroviny se vyvážejí ve velkém. Problémem je, že se vyvážejí nezpracované za nízkou cenu."],
      ["Z nerostů se hned vyrobí drahé zboží, které se nikomu neprodá.", "Afrika nerosty většinou nezpracovává, drahé zboží se z nich vyrábí jinde."],
    ],
    hints: [
      "Rozlišuj, kdo z nerostů vydělá: ten, kdo je vytěží, nebo ten, kdo z nich vyrobí hotové zboží?",
      "Nerost je jen začátek a hotový výrobek je mnohem dražší. Zvaž, co zůstane zemi, která vyváží jen surovinu.",
    ],
    explanation: "Africké země často vyvážejí nerosty nezpracované a levně, zatímco největší zisk z hotových výrobků zůstává v zahraničí. K chudobě přispívá i slabý průmysl a nestabilita.",
  },
  {
    q: "V jednom africkém kraji se stalo pět věcí (v nahodilém pořadí): lidé odešli do města, byla neúroda, dlouho nepršelo, vzrostly ceny jídla a vyschla pole. Který sled odpovídá skutečnému řetězci od příčiny k důsledkům?",
    key: "nepršelo → vyschla pole → neúroda → vzrostly ceny jídla → lidé odešli do města",
    d: [
      ["vyschla pole → nepršelo → neúroda → lidé odešli do města → vzrostly ceny jídla", "Pole nemohla vyschnout dřív, než přestalo pršet. Lidé také odcházejí až poté, co jídlo zdražilo."],
      ["lidé odešli do města → nepršelo → vyschla pole → neúroda → vzrostly ceny jídla", "Odchod do města je až důsledek. Lidé odcházejí proto, že doma nemají z čeho žít."],
      ["nepršelo → neúroda → vyschla pole → lidé odešli do města → vzrostly ceny jídla", "Neúroda přišla až po vyschnutí polí. A ceny jídla vzrostly dřív, než lidé odešli."],
    ],
    hints: [
      "Najdi událost, kterou žádná jiná ze zadání nevysvětluje. Ta je na začátku řetězce.",
      "U každé události se ptej: co se muselo stát dřív, aby mohla nastat? Řetěz vede od počasí přes pole a jídlo až k lidem.",
    ],
    explanation: "Řetěz je: nepršelo → vyschla pole → neúroda → vzrostly ceny jídla → lidé odešli do města. Příčinou celého řetězce je sucho, ostatní události jsou jeho důsledky.",
  },
  {
    q: "Po třech suchých letech opustili vesnici mladí lidé a odešli do velkoměsta za prací. Co to způsobí ve městě?",
    key: "Přibude lidí hledajících práci a bydlení a vznikají chudinské čtvrti.",
    d: [
      ["Uvolní se byty a práce bude víc než uchazečů.", "Příchozích je hodně a bytů i práce nestačí. Volných míst tedy nebude víc."],
      ["Město se vylidní, protože do něj nikdo nechce jít.", "Právě do města lidé jdou, protože na vesnici nemají obživu."],
      ["Město zbohatne, protože noví obyvatelé zaplatí drahé nájmy.", "Noví lidé jsou většinou chudí a na drahé nájmy nemají. Bydlí v provizorních domech."],
    ],
    hints: [
      "Ptej se, co lidé po příchodu do města potřebují a kolik toho město stačí nabídnout.",
      "Když přijde velký počet lidí najednou, bydlení i práce se rozdělí na víc lidí, než pro které jsou určeny.",
    ],
    explanation: "Sucho vyhání lidi z vesnic. Ve městě pak roste poptávka po práci a bydlení, kterou město nestačí splnit, a vznikají chudinské čtvrti.",
  },
  {
    q: "Kraj v Guinejském zálivu pěstuje téměř výhradně kakao na vývoz. Co rolníkům hrozí, když cena kakaa na světovém trhu klesne?",
    key: "Přijdou o většinu příjmů, protože jiný zdroj obživy nemají.",
    d: [
      ["Nic, kakao mohou snadno sníst místo obilí a brambor.", "Kakao není základní potravina, nasytí jen málo. Bez prodeje by rodiny neměly z čeho žít."],
      ["Snadno přejdou na jinou plodinu a nic neztratí.", "Změna plodiny trvá roky a stojí peníze. Kakaovník nese až po několika letech."],
      ["Vydělají stejně, protože kakao se vždy prodá za stejnou cenu.", "Cena kakaa kolísá podle světového trhu. Když klesne, klesnou i příjmy."],
    ],
    hints: [
      "Zvaž, co se stane s rodinou, která má jediný zdroj příjmů, když ten najednou zlevní.",
      "Pěstování jedné plodiny pro prodej zvyšuje riziko. Rozhodni, co rolník udělá, když nemá čím ztrátu nahradit.",
    ],
    explanation: "Kraj, který pěstuje jedinou plodinu na prodej, je zranitelný. Když cena klesne, rolníci přijdou o většinu příjmů a nemají čím ztrátu nahradit.",
  },
  {
    q: "Popis oblasti: celý rok horko a časté deště, pěstování kakaovníků (na plantážích i menších farmách), velká přístavní města a hustě osídlená krajina. O kterou oblast Afriky jde?",
    key: "pobřeží Guinejského zálivu",
    d: [
      ["deštný les v povodí Konga", "V povodí Konga je také horko a vlhko, ale jde o řídce osídlený vnitrozemský les bez velkých přístavů u moře."],
      ["údolí Nilu", "U Nilu je hustě osídleno, ale prší tam velmi málo a pěstuje se díky zavlažování."],
      ["suchý pás Sahel", "Sahel je suchý a plantáže kakaovníků tam nerostou."],
    ],
    hints: [
      "Z popisu si vypiš podnebí, plodiny a polohu. Potom porovnej, kde je vlhko celý rok a zároveň hustě osídleno.",
      "Kombinace více znaků najednou vylučuje oblasti, kde chybí voda, i oblasti, které jsou vlhké, ale mají málo lidí nebo nemají moře.",
    ],
    explanation: "Vlhké horko, pěstování kakaovníků a velká přístavní města patří k pobřeží Guinejského zálivu. Sahel je suchý, u Nilu se pěstuje díky zavlažování a deštný les v Kongu je řídce osídlený.",
  },
  {
    q: "Popis oblasti: pás na jižním okraji Sahary, krátké deště jen v létě, jinak sucho, časté neúrody, pastevci a přepásané pastviny. O kterou oblast jde?",
    key: "Sahel",
    d: [
      ["údolí Nilu", "U Nilu je stálý zdroj vody a úrodná půda, neúrody tam nejsou tak časté."],
      ["deštný les v povodí Konga", "V deštném lese prší celý rok, o krátkých deštích nemůže být řeč."],
      ["pobřeží Guinejského zálivu", "Pobřeží Guinejského zálivu je vlhké a srážek má dostatek."],
    ],
    hints: [
      "Z popisu si vypiš množství srážek a polohu vůči poušti. Potom to porovnej s vlhčími oblastmi.",
      "Krátké deště, časté neúrody a přepásané pastviny ukazují na oblast na hranici pouště, kde jsou srážky nejnejistější.",
    ],
    explanation: "Krátké deště, časté neúrody a pastevci na okraji pouště jsou typické pro Sahel. Vlhké oblasti jako deštný les nebo Guinejský záliv takové potíže nemají.",
  },
  {
    q: "Vesničané kolem osady vykácejí všechny stromy na dřevo. Po několika letech je kraj vyprahlý a půdu odnáší vítr i déšť. Proč se to stalo?",
    key: "Bez kořenů a stínu půda vysychá a nic ji nedrží pohromadě.",
    d: [
      ["Stromy vysály z půdy vodu a po pokácení už žádná nezbyla.", "Stromy vodu drží a její část vracejí do krajiny. Po pokácení půda vysychá, protože ztratila stín a kořeny."],
      ["Suchá půda je v Africe přirozená, kácení na ni nemělo vliv.", "Kácení vliv má. Bez vegetace se půda rychle poničí, i tam, kde bývala úrodná."],
      ["Za změnu může jedině horko, vítr s kácením nesouvisí.", "Vítr odnáší půdu, kterou kácení obnažilo. Bez stromů by ji udržely kořeny."],
    ],
    hints: [
      "Zeptej se, co dělají kořeny stromů s půdou a co dělají koruny se sluncem a větrem.",
      "Strom půdu drží a zastiňuje. Zvaž, co se stane, když zmizí obojí.",
    ],
    explanation: "Stromy drží půdu kořeny a chrání ji stínem. Po vykácení se půda vysuší a vítr i déšť ji odnesou. Je to jedna z cest, jak krajina zpustne a začne se podobat poušti.",
  },
  {
    q: "Vesnice na okraji pouště chce zabránit vysychání a zpustnutí okolní krajiny. Které opatření je nejlepší?",
    key: "Sázet stromy a keře, omezit přepásání a šetřit vodou.",
    d: [
      ["Vykácet zbylé keře a uvolnit místo pro další pole.", "Bez keřů půdu nic nedrží. Půda by vysychala ještě rychleji."],
      ["Pěstovat plodiny, které potřebují hodně vody, bez zavlažování.", "Bez vody uschnou a půda zůstane obnažená."],
      ["Počkat, až první déšť krajinu sám zachrání.", "Jeden déšť krajinu neobnoví. Zpustnutí lze zpomalit jen ochranou a obnovou půdního krytu."],
    ],
    hints: [
      "Hledej opatření, které půdu chrání a zároveň nezvyšuje spotřebu vody.",
      "Půdu drží vegetace. Zvaž, které možnosti vegetaci přidávají a které ji ničí nebo stěžují.",
    ],
    explanation: "Vysychání krajiny zpomalí stromy a keře, které drží půdu, menší počet zvířat na pastvinách a šetření vodou. Kácení, plodiny náročné na vodu i čekání na déšť problém nevyřeší.",
  },
  {
    q: "Země A žije z vývozu ropy a potraviny dováží. Země B pěstuje několik plodin, těží dvě jiné suroviny než ropu a má i výrobu. Cena ropy na světovém trhu klesne. Která země je zranitelnější?",
    key: "Země A, protože má jediný zdroj příjmů.",
    d: [
      ["Země B, protože potřebuje víc surovin na výrobu.", "Země B má příjmy z několika zdrojů, takže pokles ceny ropy ji zasáhne mnohem méně."],
      ["Obě stejně, protože ceny všech surovin klesají společně.", "Klesla jen cena ropy. Země B ropu nevyváží, proto ji pokles zasáhne méně."],
      ["Žádná, protože ropa se prodává za stálou cenu.", "Cena ropy kolísá podle světového trhu. Zadání říká, že klesla."],
    ],
    hints: [
      "Porovnej, na kolika zdrojích příjmů každá země stojí.",
      "Čím víc různých zdrojů příjmů, tím míň záleží na ceně jedné suroviny. Rozhodni, která země je na jedné ceně závislejší.",
    ],
    explanation: "Země A závisí na jediné surovině, proto pokles ceny ropy zasáhne celý její rozpočet. Země B má víc zdrojů příjmů a ropu nevyváží, takže ji pokles ceny ropy zasáhne mnohem méně.",
  },
  {
    q: "Na okraji velkého města stojí husté chatrče z plechu a prken bez kanalizace, s jednou studnou pro celou čtvrť. Co je to za typ osídlení a proč vzniklo?",
    key: "Slum; vznikl, protože do města přišlo víc lidí, než stačí bydlení.",
    d: [
      ["Předměstí s vilami; vzniklo pro bohaté obyvatele blízko centra.", "Vily mají kanalizaci i vodovod. Husté plechové chatrče bez služeb jsou chudinská čtvrť, ne bohaté předměstí."],
      ["Tábor nomádů; vznikl, protože pastevci kočují za pastvou.", "Nomádi bydlí ve stanech nebo chýších a kočují po savanách a stepích, ne na okraji velkého města."],
      ["Slum; vznikl, protože místní lidé nechtějí pracovat a stavět pořádné domy.", "Typ je správný, příčina ne: lidé nestaví chatrče z lenosti, ale protože bydlení nestačí a nemají na lepší peníze."],
    ],
    hints: [
      "Z popisu vyčti, co v čtvrti chybí (kanalizace, voda) a z čeho jsou domy postaveny.",
      "Obě části odpovědi musí sedět: jak se takové osídlení jmenuje a co mohlo přivést do města tolik lidí najednou.",
    ],
    explanation: "Husté chatrče bez kanalizace a s minimem vody jsou slum. Vzniká tam, kam do města přijde víc lidí, než se stačí postavit domů.",
  },
];

const faktL3 = (): PracticeTask | null => fakt(pick(BANKA_L3));

// ── Skladba sezení ─────────────────────────────────────────────────────────

/**
 * Sezení = PRVNÍCH `sessionTaskCount` úloh poolu. Úlohy, které se řeší týmž
 * vylučováním (dvě o počtu lidí, dvě o osídlení, tři o dezertifikaci, tři o
 * závislosti na jediné surovině…), proto smí v úvodní šestici stát jen jednou;
 * zbytek poolu zůstává úplný.
 */
type Skupiny = [RegExp, string][];

const skupinaPodle = (tabulka: Skupiny) => (t: PracticeTask): string | null =>
  tabulka.find(([r]) => r.test(t.question))?.[1] ?? null;

function omezSezeni(
  pool: PracticeTask[],
  kolik: number,
  skupina: (t: PracticeTask) => string | null,
): PracticeTask[] {
  const pouzito = new Set<string>();
  const sezeni: PracticeTask[] = [];
  const zbytek: PracticeTask[] = [];
  for (const t of pool) {
    const g = skupina(t);
    if (sezeni.length < kolik && (!g || !pouzito.has(g))) {
      if (g) pouzito.add(g);
      sezeni.push(t);
    } else {
      zbytek.push(t);
    }
  }
  return [...sezeni, ...zbytek];
}

const SKUPINY_L1: Skupiny = [
  [/Jak se v Africe vyvíjí počet obyvatel|Co znamená, že Afrika má mladé obyvatelstvo/, "populace"],
  [/osídlená nejřidčeji|osídlená nejhustěji/, "osidleni"],
  [/nerostná surovina/, "nerosty"],
  [/pěstuje hlavně na vývoz|pro vlastní potřebu|zemědělství, při kterém|velké farmy|vyvážejí do světa/, "plodiny"],
];

const SKUPINY_L2: Skupiny = [
  [/údolí Nilu|Guinejského zálivu jednou/, "osidleni"],
  [/Která plodina/, "plodina"],
  [/africká města rostou|Co přináší městům/, "mesta"],
  [/v poušti Sahara|pastevci v savaně/, "zivot"],
  [/vysoké porodnosti vyplývá/, "populace"],
];

const SKUPINY_L3: Skupiny = [
  [/spásat trávu|vykácejí všechny stromy|zabránit vysychání/, "dezertifikace"],
  [/jediné rudy|kakao na vývoz|Země A žije/, "jedna-surovina"],
  [/bez kanalizace|velkoměsta|chatrče z plechu/, "mesta"],
  [/^Popis oblasti/, "popis"],
];

// ── Generátor ──────────────────────────────────────────────────────────────

function gen(level: number): PracticeTask[] {
  const tvurce: Tvurce = level === 1 ? faktL1 : level === 2 ? faktL2 : faktL3;
  const skupiny = level === 1 ? SKUPINY_L1 : level === 2 ? SKUPINY_L2 : SKUPINY_L3;
  return omezSezeni(ruzneUlohy(() => losUlohy(tvurce), 30), 6, skupinaPodle(skupiny));
}

// ── Topic ──────────────────────────────────────────────────────────────────
export const OBYVATELSTVO_HOSPODARSTVI_AFRIKY: TopicMetadata[] = [
  {
    id: "g6-zem-obyvatelstvo-hospodarstvi-afriky-6",
    rvpNodeId: "g6-zemepis-regiony-sveta-afrika-obyvatelstvo-a-hospodarstvi-afriky-problemy-kontinentu",
    displayName: "Obyvatelstvo a hospodářství Afriky",
    title: "Obyvatelstvo a hospodářství Afriky, problémy kontinentu",
    studentTitle: "Jak se v Africe žije a čím se tam živí",
    subject: "zemepis",
    category: "Regiony světa",
    topic: "Afrika",
    briefDescription: "Jak podnebí, půda a voda určují život lidí, farmy, doly i problémy Afriky.",
    keywords: [
      "Afrika", "obyvatelstvo", "zemědělství", "pastevci", "plantáže", "vývoz surovin",
      "dezertifikace", "sucho", "Sahel", "oáza", "růst měst", "slum", "údolí Nilu",
      "Guinejský záliv",
    ],
    goals: [
      "Popsat, čím se lidé v Africe živí, které suroviny a plodiny se těží a pěstují.",
      "Vysvětlit, jak podnebí, půda a voda ovlivňují rozložení obyvatel a hospodářství.",
      "Rozpoznat příčiny a důsledky hlavních problémů: sucho, dezertifikace, chudoba, růst měst.",
      "Odlišit plodiny pro vlastní potřebu od vývozních a nerosty od plodin.",
    ],
    boundaries: [
      "Žádná přesná čísla (počet obyvatel, HDP, délka Nilu) ani konkrétní státy jako klíč — jen oblasti a typy krajiny.",
      "Dezertifikace je vysvětlena třemi příčinami (přepásání, kácení, sucho), ne samotným větrem ani horkem.",
      "Chudoba se nevysvětluje povahou lidí, ale vývozem nezpracovaných surovin, slabým průmyslem a závislostí na jedné surovině.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Sleduj řetěz: přírodní podmínky (voda, půda, podnebí) rozhodují o obživě lidí a ta o tom, kde se žije a co se vyváží.",
      steps: [
        "Nejdřív rozhodni, o jaké podnebí a krajinu se jedná (poušť, savana, vlhké tropy, oáza, údolí řeky).",
        "Zeptej se, co se tam dá pěstovat nebo těžit a kolik lidí se tam uživí.",
        "U problémů rozliš příčinu (sucho, přepásání, kácení, jediná surovina) a důsledek (neúroda, hlad, chudoba, slumy).",
      ],
      commonMistake: "Myslet si, že Afrika je celá poušť nebo že se poušť šíří sama větrem; nebo zaměnit vývozní plodiny s plodinami pro vlastní potřebu.",
      example: "Vesnice u okraje Sahary: stáda vypásají trávu, lidé kácejí keře a málo prší. Půda se vysušuje, ztrácí vegetaci a zpustne — je to dezertifikace, kterou způsobuje spolupráce lidí a sucha, ne vítr sám.",
    },
  },
];
