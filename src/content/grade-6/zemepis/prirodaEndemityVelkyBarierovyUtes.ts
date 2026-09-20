/**
 * Zeměpis 6. ročník — Austrálie a Oceánie: příroda, endemity, Velký bariérový útes
 * (select_one).
 *
 * Celé téma emituje jen úlohy s možnostmi (žádné míchání typů). K obsahu nejsou
 * mapy ani obrázky, poloha se proto popisuje slovy (pobřeží, oceán, polokoule).
 *
 * Gradace:
 *  • L1 — banka přímých faktů: co je endemit, kdo je (a kdo NENÍ) australský
 *    živočich, vačnatci a ptakopysk, emu, kde leží útes a co ho vytváří,
 *    poloha Austrálie, suché vnitrozemí.
 *  • L2 — jedno pravidlo se použije na případ, vždy příčina → následek:
 *    izolace → endemity; teplá mělká čistá voda se světlem → útes u tropického
 *    pobřeží; vlhko × sucho → prales × savana; znak zvířete → skupina.
 *  • L3 — nová situace: poznej zvíře či místo z popisu (jiné věty než v L1),
 *    vysvětli problém příčinou (bělení, splachy, dovezené druhy) a rozhodni
 *    o neznámém případu (ostrov, kde by mohl vzniknout útes). Znění L1 a L3
 *    jsou disjunktní — každá úroveň má vlastní banku.
 *
 * Chybový model: endemit = ohrožený / největší / jedovatý druh; lev, tygr,
 * medvěd jako „australská“ zvířata (a koala = medvěd); klokan snáší vejce,
 * ptakopysk má vak, emu létá; koráli jsou rostliny nebo kameny, útes u jižního
 * pobřeží, bělení z „málo slunce“ či „studené vody“, splachy prospívají.
 *
 * Přesná čísla (délka útesu, počet druhů, rozloha) se v klíči nevyskytují.
 * Rotace šablon se nastavuje uvnitř gen(), modul nedrží žádný stav.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import {
  pick,
  pickN,
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

const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

// ── zvířata: sdílené tabulky ───────────────────────────────────────────────

const AUS = ["klokan", "koala", "emu", "ptakopysk"] as const;

/** Zvířata z jiných světadílů + proč se do Austrálie nehodí. */
const CIZI: Record<string, string> = {
  lev: "Lev žije v Africe; v australské přírodě se nikdy nevyskytoval.",
  tygr: "Tygr žije v Asii. V Austrálii tygři ve volné přírodě nejsou.",
  "medvěd grizzly": "Grizzly je medvěd ze Severní Ameriky. Austrálie žádné medvědy nemá — koala jen vypadá jako medvídek.",
  slon: "Sloni žijí v Africe a v jižní a jihovýchodní Asii, do Austrálie se přirozeně nedostali.",
  zebra: "Zebra patří do africké savany. Australské savany mají jiná zvířata.",
  pštros: "Pštros je velký nelétavý pták z Afriky. Emu je jeho australský protějšek, ale pštros v Austrálii původně nežije.",
};

/** Australská zvířata jako distraktory v otázce „které NEŽIJE v Austrálii“. */
const AUS_WHY: Record<string, string> = {
  klokan: "Klokan je typický australský vačnatec, v Austrálii žije odedávna. Hledáš zvíře odjinud.",
  koala: "Koala je australský vačnatec žijící na eukalyptech. Do Austrálie patří, hledáš zvíře odjinud.",
  emu: "Emu je velký australský nelétavý pták. Do Austrálie patří, hledáš zvíře odjinud.",
  ptakopysk: "Ptakopysk žije v australských potocích a řekách. Do Austrálie patří, hledáš zvíře odjinud.",
};

// ── L1: banka faktů ────────────────────────────────────────────────────────

const BANKA_L1: Fakt[] = [
  {
    q: "Co znamená slovo endemit?",
    key: "druh, který žije jen v jedné oblasti a jinde ne",
    d: [
      ["druh, kterému hrozí vyhynutí a je pod ochranou", "Endemit nemusí být ohrožený — endemitů je i mnoho běžných druhů. Slovo říká, KDE druh žije, ne kolik ho zbývá."],
      ["největší a nejsilnější druh v dané oblasti", "Velikost s pojmem nesouvisí. Endemit může být drobný hmyz i velké zvíře."],
      ["druh, který je pro člověka nebezpečný a jedovatý", "Jed s pojmem nesouvisí. Endemit se pozná podle výskytu, ne podle vlastností."],
    ],
    hints: [
      "Slovo endemit říká, kde druh žije — ne jak vypadá ani jak je početný.",
      "Představ si, že takový druh hledáš po celém světě: na kolika různých místech bys ho našel?",
    ],
    explanation: "Endemit je druh rostliny nebo živočicha, který žije jen v jedné určité oblasti — třeba jen v Austrálii — a jinde na světě se přirozeně nevyskytuje. S ohrožením, velikostí ani jedovatostí to nesouvisí.",
  },
  {
    q: "Čím je Austrálie?",
    key: "světadílem a zároveň samostatným státem",
    d: [
      ["světadílem, na kterém leží mnoho různých států", "Tak to je třeba v Africe nebo v Evropě. Austrálie je výjimka: celý světadíl je zároveň jeden stát."],
      ["největším ostrovem světa a částí Asie", "Největší ostrov světa je Grónsko. Austrálie se počítá jako samostatný, nejmenší světadíl, ne jako část Asie."],
      ["světadílem, který nepatří žádnému státu", "Takhle to platí pro Antarktidu. Austrálie má vlastní stát, který zabírá celý světadíl."],
    ],
    hints: [
      "Porovnej s Afrikou: tam je na jednom světadíle mnoho států. Platí to i tady?",
      "Austrálie je nejmenší světadíl. Zamysli se, kolik států se na takovém prostoru vejde a komu patří.",
    ],
    explanation: "Austrálie je zvláštní tím, že celý světadíl je zároveň jedním státem. V Africe, Evropě nebo Asii je na jednom světadíle mnoho států, v Antarktidě žádný.",
  },
  {
    q: "Na které polokouli podle zeměpisné šířky leží celá Austrálie?",
    key: "na jižní polokouli",
    d: [
      ["na severní polokouli, kde leží i Evropa", "Sever a jih určuje rovník. Austrálie leží celá jižně od něj, ne severně jako Evropa."],
      ["na obou polokoulích, protože ji protíná rovník", "Rovník Austrálií neprochází — vede severněji přes Indonésii. Celý světadíl je na jedné straně od rovníku."],
      ["na západní polokouli, kde leží Amerika", "Západní a východní polokouli dělí poledník, ne rovník; otázka se ptá na sever a jih. Austrálie navíc leží na východní polokouli."],
    ],
    hints: [
      "Rozhoduje rovník: na které jeho straně Austrálie leží?",
      "Zkratky s. š. a j. š. říkají, na které straně od rovníku místo leží. Vzpomeň si: je Austrálie nad rovníkem, nebo pod ním?",
    ],
    explanation: "Austrálie leží celá na jižní polokouli, tedy jižně od rovníku. Proto mají Australané v prosinci léto a v červenci zimu — opačně než my.",
  },
  {
    q: "Mezi kterými oceány leží Austrálie?",
    key: "mezi Indickým a Tichým oceánem",
    d: [
      ["mezi Atlantským a Tichým oceánem", "Atlantský oceán omývá Evropu, Afriku a Ameriku. K Austrálii nedosahuje."],
      ["mezi Atlantským a Indickým oceánem", "Atlantský oceán leží na druhé straně Afriky, dál od Austrálie než oceány, které ji obklopují."],
      ["mezi Severním ledovým a Tichým oceánem", "Severní ledový oceán leží u severního pólu, hodně daleko na sever od Austrálie."],
    ],
    hints: [
      "Rozmysli si polohu z velkého obrazu: na západ od Austrálie leží Afrika, na východ Amerika. Které oceány jsou mezi nimi?",
      "Ledový oceán vylučuj hned — Austrálie leží na jižní polokouli, daleko od pólů.",
    ],
    explanation: "Austrálie leží mezi Indickým oceánem na západě a Tichým oceánem na východě. Atlantik je na druhé straně Afriky a Severní ledový oceán kolem severního pólu.",
  },
  {
    q: "Kde leží Velký bariérový útes?",
    key: "u severovýchodního pobřeží Austrálie",
    d: [
      ["u jižního pobřeží Austrálie", "Na jihu je moře chladnější, koráli tam útes nevytvoří."],
      ["u západního pobřeží Austrálie", "Útes leží na opačné, východní straně světadílu, u pobřeží obráceného k Tichému oceánu."],
      ["daleko od pobřeží uprostřed Tichého oceánu", "Útes se drží blízko břehu, kde je moře mělké a světlé. Uprostřed oceánu je hluboko."],
    ],
    hints: [
      "Vzpomeň, jaké moře koráli potřebují (teplé), a hledej pobřeží, kde je tepleji.",
      "Austrálie leží na jižní polokouli, takže tepleji je na té straně, která je blíž rovníku. Útes stojí na straně obrácené k Tichému oceánu.",
    ],
    explanation: "Velký bariérový útes leží u severovýchodního pobřeží Austrálie. Je tam teplé mělké moře, které koráli potřebují. Jižní pobřeží je chladnější a od západního útes odděluje celý světadíl.",
  },
  {
    q: "V jakém moři leží Velký bariérový útes?",
    key: "v Korálovém moři",
    d: [
      ["v Karibském moři", "Karibské moře leží v Americe a korálů má také hodně, ale Velký bariérový útes je u Austrálie."],
      ["v Rudém moři", "Rudé moře leží mezi Afrikou a Asií. Má vlastní útesy, ale ne ten australský."],
      ["v Jávském moři", "Jávské moře leží u indonéských ostrovů severozápadně od Austrálie, ne u jejího východního pobřeží."],
    ],
    hints: [
      "Útes leží u východního pobřeží Austrálie; hledej moře, které tam k pevnině přiléhá z Tichého oceánu.",
      "Ostatní moře v nabídce jsou v jiných světadílech nebo jinde než u východního pobřeží Austrálie — vylučuj podle světadílu.",
    ],
    explanation: "Velký bariérový útes leží v Korálovém moři u severovýchodního pobřeží Austrálie. Karibské a Rudé moře mají vlastní útesy, ale leží v jiných částech světa.",
  },
  {
    q: "Co vytváří Velký bariérový útes?",
    key: "drobní živočichové zvaní korálové polypy",
    d: [
      ["řasy, které srůstají v pevnou stavbu", "Řasy nejsou živočichové. Útes staví živočichové, i když s drobnými řasami spolupracují."],
      ["sopečná činnost, při které tuhne láva", "Sopečné ostrovy existují, ale útes vznikl z živých tvorů, ne ze sopky."],
      ["kameny, které řeky přinášejí z pevniny", "Naplavené kameny tvoří nánosy a pláže. Útes je stavba z živých organismů."],
    ],
    hints: [
      "Rozhodni, jestli útes staví neživá příroda (sopka, řeka), nebo živé organismy — a jestli rostliny, nebo živočichové.",
      "Vzpomeň si na žahavce z přírodopisu: nezmar a medúza mají příbuzné, kteří žijí v moři v koloniích.",
    ],
    explanation: "Útes vytvářejí korálové polypy — drobní živočichové, kteří žijí v koloniích a kolem sebe budují vápenné schránky. Z odumřelých schránek roste za tisíce let obrovská pevná stavba.",
  },
  {
    q: "Jaké je vnitrozemí Austrálie?",
    key: "převážně suché, s pouštěmi a polopouštěmi",
    d: [
      ["vlhké, porostlé souvislým deštným pralesem", "Deštné pralesy rostou u vlhkého severovýchodního pobřeží. Uvnitř kontinentu je sucho."],
      ["chladné, pokryté ledem po celý rok", "Led je v Antarktidě. Austrálie je teplý světadíl a uvnitř je horko a sucho."],
      ["bažinaté, s mnoha jezery a řekami", "Řek a jezer je uvnitř Austrálie naopak málo a mnoho toků vysychá."],
    ],
    hints: [
      "Uvnitř velkého světadílu je daleko k moři, odkud přichází vlhký vzduch.",
      "Zamysli se, kolik srážek spadne tam, kam se oblaka od pobřeží vůbec nedostanou.",
    ],
    explanation: "Vnitrozemí Austrálie je z velké části suché: rozkládají se tam pouště a polopouště. Vlhký vzduch od moře se tak daleko nedostane, a proto tam prší jen málo.",
  },
  {
    q: "Který obydlený světadíl je nejsušší?",
    key: "Austrálie",
    d: [
      ["Afrika", "Afrika má největší horkou poušť světa, ale také rovníkové deštné pralesy a velké řeky. Jako celek není nejsušší."],
      ["Jižní Amerika", "Jižní Amerika má Amazonii, jednu z nejvlhčích oblastí světa."],
      ["Evropa", "Evropa má mírné podnebí s dostatkem srážek téměř v celé oblasti."],
    ],
    hints: [
      "Sucho hledej tam, kde je uvnitř světadílu daleko k moři a pouště zabírají velkou část plochy.",
      "Afrika má sice největší horkou poušť světa, ale také velké deštné pralesy; hledáš světadíl, který je jako celek suchý.",
    ],
    explanation: "Nejsušším obydleným světadílem je Austrálie: většinu území tvoří pouště, polopouště a suché savany. Antarktida je ještě sušší, ale nemá stálé obyvatele.",
  },
  {
    q: "Co platí o emu?",
    key: "je to velký pták, který neumí létat",
    d: [
      ["je to vačnatec, který skáče po zadních nohách", "Takhle se pohybuje klokan. Emu není savec, je to pták."],
      ["je to vejcorodý savec se zobákem", "Zobák a vejce má ptakopysk. Emu je pták s peřím, ne savec."],
      ["je to pták, který létá jen na krátké vzdálenosti", "Emu nevzlétne vůbec. Jeho křídla jsou malá a k letu neslouží, spoléhá na rychlý běh."],
    ],
    hints: [
      "Všimni si, do které velké skupiny zvířat emu patří — a co z toho plyne pro jeho křídla.",
      "Každé zvíře v nabídce má nějaký zvláštní znak; hledej to, které má peří a zároveň se pohybuje jiným způsobem než letem.",
    ],
    explanation: "Emu je velký nelétavý pták z australských savan. Má malá křídla, silné nohy a před nebezpečím rychle utíká. Vačnatec je klokan a vejcorodý savec ptakopysk.",
  },
  {
    q: "Jak se pohybuje klokan?",
    key: "skáče na silných zadních nohách",
    d: [
      ["šplhá po kmenech a větvích eukalyptů", "Takhle se pohybuje koala, ne klokan."],
      ["hbitě plave po řekách a potocích", "Plavat umí ptakopysk. Klokan je suchozemský savec."],
      ["rychle běhá po dvou nohách jako velký pták", "Takhle se rychle pohybuje emu. Klokan při rychlém pohybu skáče."],
    ],
    hints: [
      "Vzpomeň si, jak klokan vypadá: jaké má nohy — přední, nebo zadní silnější?",
      "Na rovině se klokan pohybuje způsobem, který není ani běh, ani šplhání. Přední nohy má malé.",
    ],
    explanation: "Klokan skáče na dlouhých silných zadních nohách a ocas mu pomáhá udržet rovnováhu. Šplhá koala, plave ptakopysk a běhá emu.",
  },
  {
    q: "Které tvrzení o koale je pravdivé?",
    key: "je to vačnatec, který nosí mládě ve vaku",
    d: [
      ["je to malý druh medvěda z Austrálie", "Medvěd to není. Koala je vačnatec; jen vypadá jako medvídek."],
      ["je to hlodavec podobný veverce", "Hlodavci mají velké řezáky a mláďata nenosí ve vaku. Koala k nim nepatří."],
      ["je to vejcorodý savec se zobákem", "Vejce a zobák má ptakopysk. Koala rodí malé mládě, které dorůstá ve vaku."],
    ],
    hints: [
      "Podívej se, čím se koala liší od medvědů: jaké mládě rodí a kde ho nosí?",
      "Škrtni skupiny, které rodí mláďata bez vaku (medvědi, hlodavci) nebo snášejí vejce. Zbyde jediná možnost.",
    ],
    explanation: "Koala je vačnatec: mládě se rodí velmi malé a dorůstá ve vaku matky. Medvěd ani hlodavec to není a vejce nesnáší.",
  },
  {
    q: "Čím se koala živí?",
    key: "listy eukalyptů",
    d: [
      ["bambusovými výhonky", "Bambus jí panda velká v Asii. Koala tu potravu nemá."],
      ["trávou z pouštních savan", "Tráva koale nestačí. Pase se v korunách stromů, ne na zemi."],
      ["hmyzem a drobnými plazy", "Koala je býložravec, na hmyz ani plazy neloví."],
    ],
    hints: [
      "Koala tráví většinu dne na stromech — potravu najde přímo nad hlavou.",
      "Její potrava je rostlinná, roste přímo v korunách stromů typických pro Austrálii a vůbec nemusí lovit.",
    ],
    explanation: "Koala se živí téměř výhradně listy eukalyptů. Proto žije na těchto stromech a bez nich by neměla co jíst.",
  },
  {
    q: "Kde žije ptakopysk?",
    key: "ve sladkých potocích a řekách",
    d: [
      ["v suché poušti daleko od vody", "Ptakopysk má plovací blány a loví ve vodě. V poušti by nepřežil."],
      ["v korunách eukalyptů", "Na stromech žije koala. Ptakopysk je vodní savec."],
      ["na korálovém útesu u pobřeží", "Ptakopysk žije ve sladké vodě, ne ve slaném moři u útesu."],
    ],
    hints: [
      "Ptakopysk má plovací blány a zobák; jeho tělo prozrazuje, kde loví potravu.",
      "Rozmysli si, jestli ptakopysk žije na stromech, v poušti, nebo ve vodě — a zda ve sladké, nebo slané.",
    ],
    explanation: "Ptakopysk žije ve sladkých potocích a řekách východní Austrálie. Loví pod vodou, doma je v noře na břehu.",
  },
  {
    q: "Čím je ptakopysk mezi savci výjimečný?",
    key: "snáší vejce, ale mláďata kojí mlékem",
    d: [
      ["nosí mláďata ve vaku jako klokan", "Vak má klokan a koala. Ptakopysk vak nemá; je to vejcorodý savec."],
      ["živí se listy eukalyptů jako koala", "Listy jí koala. Ptakopysk loví ve vodě drobné živočichy."],
      ["je to pták, který se naučil plavat", "Zobák je zavádějící. Ptakopysk má srst a kojí mláďata, tedy je savec."],
    ],
    hints: [
      "Vzpomeň, jak se u většiny savců rodí mláďata — ptakopysk se v tom od nich liší.",
      "Zaměř se na to, co ptakopysk dělá s vejci a co s mláďaty po vylíhnutí. Jedno je znak ptáků, druhé znak savců.",
    ],
    explanation: "Ptakopysk je vejcorodý savec: klade vejce jako pták, ale mláďata po vylíhnutí kojí mlékem. Má srst a patří tedy mezi savce.",
  },
];

/** Který z těchto živočichů je typický pro Austrálii? (klíč = australský druh) */
function typicky(): PracticeTask | null {
  const key = pick([...AUS]);
  const cizi = pickN(Object.keys(CIZI), 3);
  const stem = pick([
    "Který z těchto živočichů je typický pro Austrálii?",
    "Který z těchto živočichů žije v Austrálii jako původní druh?",
  ]);
  return hlidej(
    choice(
      stem,
      key,
      cizi.map((c): Distractor => ({ value: c, why: CIZI[c] })),
      {
        hints: [
          "Vylučuj zvířata, která znáš z Afriky, Asie nebo Ameriky — hledáš druh, který jinde v přírodě nepotkáš.",
          "Australská zvířata se vyvíjela odděleně od zbytku světa, proto jsou tak zvláštní. Zvířata ze savan Afriky nebo z asijských džunglí sem nepatří.",
        ],
        explanation: `Typicky australský je ${key}. Zvířata jako ${cizi.join(", ")} v Austrálii původně nežijí — žijí v Africe, Asii nebo Severní Americe.`,
      },
    ),
  );
}

/** Který z těchto živočichů v Austrálii NEŽIJE? (klíč = cizí druh) */
function neni(): PracticeTask | null {
  const key = pick(Object.keys(CIZI));
  const aus = pickN([...AUS], 3);
  return hlidej(
    choice(
      "Který z těchto živočichů v australské přírodě původně nežije?",
      key,
      aus.map((a): Distractor => ({ value: a, why: AUS_WHY[a] })),
      {
        hints: [
          "Tři zvířata z nabídky jsou pro Austrálii typická. Hledáš to, které do ní nepatří.",
          "Zvířata, která znáš z Afriky, Asie nebo Ameriky, mezi australská nepatří; škrtni ta, která jsou pro Austrálii typická, a zbude zvíře odjinud.",
        ],
        explanation: `${cap(key)} v Austrálii původně nežije. ${CIZI[key]} Klokan, koala, emu a ptakopysk jsou naopak typicky australští živočichové.`,
      },
    ),
  );
}

/** Který z těchto živočichů je vačnatec? (klíč = klokan / koala) */
function vacnatec(): PracticeTask | null {
  const key = pick(["klokan", "koala"]);
  // pštros je pták, ne savec — jako „cizí savec“ se do této úlohy nehodí
  const cizi = pick(Object.keys(CIZI).filter((c) => c !== "pštros"));
  return hlidej(
    choice(
      "Který z těchto živočichů je vačnatec?",
      key,
      [
        { value: "ptakopysk", why: "Ptakopysk je vejcorodý savec: klade vejce a vak nemá." },
        { value: "emu", why: "Emu je pták, ne savec. Vak nemá, klade vejce." },
        { value: cizi, why: `${cap(cizi)} je savec, který rodí živé mládě bez vaku.` },
      ],
      {
        hints: [
          "Vačnatec nosí nejmenší mládě v kožním záhybu na břiše. Které zvíře z nabídky je savec a takový záhyb má?",
          "Ptáky (peří, vejce) škrtni hned; pak škrtni savce, kteří rodí mláďata bez vaku, nebo ty, kteří snášejí vejce.",
        ],
        explanation: `Vačnatec je ${key}: mládě se rodí drobné a dorůstá ve vaku na matčině břiše. Ptakopysk klade vejce, emu je pták a ostatní savci rodí větší mláďata bez vaku.`,
      },
    ),
  );
}

const L1_TVURCI: Tvurce[] = [...BANKA_L1.map((f) => () => fakt(f)), typicky, neni, vacnatec];
const tvurceL1 = (): PracticeTask | null => pick(L1_TVURCI)();

// ── L2: příčina → následek ─────────────────────────────────────────────────

const BANKA_L2: Fakt[] = [
  {
    q: "Austrálie je už dlouho oddělená od ostatních světadílů. Co to způsobilo?",
    key: "vznikly tam druhy, které jinde nežijí",
    d: [
      ["zvířata odjinud se tam volně stěhovala", "Právě naopak: moře je zastavilo. Kdyby mohla volně přicházet, byla by fauna podobná jako jinde."],
      ["všechna původní zvířata brzy vyhynula", "V odloučení se druhy uchovaly a vyvíjely dál — proto jsou dnes zvláštní."],
      ["žijí tam stejné druhy jako v Africe", "Volnému míšení druhů bránil oceán. Proto jsou australské druhy odlišné od afrických."],
    ],
    hints: [
      "Zamysli se, jak se budou vyvíjet zvířata, která se nemohou stěhovat ani křížit se zvířaty z okolí.",
      "Odloučení znamená, že nové druhy z okolí nepřicházejí a staré se dál mění pod vlivem prostředí.",
    ],
    explanation: "Oddělením od jiných světadílů se zvířata nemohla stěhovat ani mísit. Vyvíjela se samostatně, a tak vznikly endemity — druhy, které jinde nežijí (třeba koala, ptakopysk a emu).",
  },
  {
    q: "Proč najdeme klokana rudého, koalu a ptakopyska v přírodě jen v Austrálii?",
    key: "byla oddělená a druhy se vyvíjely samy",
    d: [
      ["jinde je pro ně příliš chladno", "Teplých míst je na Zemi hodně; podnebí to nevysvětluje. Rozhoduje odloučení, ne teplota."],
      ["jinde je člověk vyhubil dřív než v Austrálii", "Vyhubení by nevysvětlilo, proč se tam vyvinuly právě tyto druhy. Příčinou je izolace."],
      ["jen tam roste dost trávy a listí, jinde ne", "Tráva a listí rostou po celém světě. Potrava rozhodnutí neurčuje."],
    ],
    hints: [
      "Zvířata samy oceán nepřeplavou. Co to znamená pro druhy na odděleném světadíle?",
      "Vyber vysvětlení, které počítá s tím, že se druhy nemohly šířit do jiných světadílů.",
    ],
    explanation: "Klokan rudý, koala i ptakopysk vznikli tam, kde se vyvíjeli — v izolované Austrálii. Ostatní světadíly nebyly propojené, a druhy se proto nerozšířily jinam a jinde nevznikly.",
  },
  {
    q: "Proč leží Velký bariérový útes u tropického pobřeží, a ne u jižního?",
    key: "koráli žijí v teplé, čisté a mělké vodě",
    d: [
      ["v chladné vodě koráli rostou nejrychleji", "Koráli teplo potřebují. V chladné vodě útesy nevznikají."],
      ["koráli potřebují úplnou tmu a velkou hloubku", "Naopak: potřebují světlo, které dosáhne mělkého dna."],
      ["koráli potřebují sladkou vodu z velkých řek", "Sladká a kalná voda koralům škodí. Potřebují čisté slané moře."],
    ],
    hints: [
      "Vzpomeň, co potřebuje každý živý tvor k životu: teplo, světlo, vhodné prostředí — a co z toho je u koralů zvláštní.",
      "Porovnej podmínky u tropického a u jižního pobřeží: kde je teplejší, jasnější a mělčí moře?",
    ],
    explanation: "Koráli přežijí jen v teplé, čisté a mělké slané vodě, kam dosáhne světlo. Taková voda je u tropického pobřeží; na jihu je moře chladnější, a útes tam proto nevzniká.",
  },
  {
    q: "Kolem ústí velkých řek koráli neprospívají. Který důvod je správný?",
    key: "kalná sladká voda jim ubírá světlo",
    d: [
      ["řeky jsou příliš studené", "Teplota vody z řek není hlavní důvod. Koralům vadí kal a sladká voda."],
      ["sladká voda koraly rozpustí", "Koraly voda nerozpouští, ale sladká voda jim nesvědčí a kal zakrývá světlo."],
      ["řeky přinášejí kamení, které koraly rozdrtí", "Kamení se z řek usazuje jako naplavenina. Hlavní potíž je kal a sladká voda."],
    ],
    hints: [
      "Pomysli, čím se řeka liší od moře — a co s sebou unáší.",
      "Řeka nese s sebou nejen vodu, ale i naplaveninu. Které z podmínek pro život koralů se tím zhorší?",
    ],
    explanation: "Řeky přinášejí sladkou vodu a kal. Kalná voda zakrývá světlo a sladká voda koralům škodí. Proto je útes nejzdravější tam, kde je moře slané a průzračné.",
  },
  {
    q: "Koráli nerostou ve velké hloubce moře. Jaký je hlavní důvod?",
    key: "hluboko se nedostane sluneční světlo",
    d: [
      ["hluboko je voda příliš studená", "Chlad je jen vedlejší důvod. Hlavní je, že hluboko chybí světlo, které koráli potřebují."],
      ["hluboko je příliš velký tlak vody", "Tlak není hlavní překážka. Rozhoduje světlo, které do hloubky nedosáhne."],
      ["hluboko není dost drobné potravy", "Potrava je vedlejší. Koráli žijí ve spolupráci s řasami, které potřebují světlo."],
    ],
    hints: [
      "Které přírodní podmínky mizí, čím hlouběji se potápíš?",
      "Čím hlouběji se potápíš, tím víc se mění to, co shora dopadá na hladinu a proniká do moře.",
    ],
    explanation: "Koráli potřebují světlo, které pronikne jen do mělké vody. Hluboko je tma, a proto útesy rostou jen blízko hladiny.",
  },
  {
    q: "Proč rostou deštné pralesy na severovýchodním pobřeží, ale ne ve vnitrozemí?",
    key: "k pobřeží přichází od moře vlhký vzduch s dešti",
    d: [
      ["stromům stačí teplo, vodu k růstu nepotřebují", "Stromy vodu potřebují vždy. Prales roste tam, kde prší dost."],
      ["ve vnitrozemí je stejně vlhko, jen chybí půda", "Ve vnitrozemí prší málo. Rozhoduje voda, ne půda."],
      ["u pobřeží je chladněji, a stromy proto rostou rychleji", "Pobřeží je teplé, ne chladné. Prales potřebuje vlhko a teplo."],
    ],
    hints: [
      "Deštný prales potřebuje hodně deště. Odkud se bere voda pro srážky?",
      "Vzduch od moře nese vodní páru. Co se s ní děje, když vane na pevninu, a jak daleko se dostane?",
    ],
    explanation: "Vlhký vzduch přichází od moře a na pobřeží se z něj vysráží hodně deště, takže tam roste prales. Do vnitrozemí se vlhkost nedostane a je tam sucho.",
  },
  {
    q: "V jaké krajině žije klokan rudý?",
    key: "v suchém vnitrozemí a na savanách",
    d: [
      ["v ledovcových údolích na jihu", "Ledovce v Austrálii nejsou. Klokan rudý je zvíře teplé a suché krajiny."],
      ["na korálových ostrovech u pobřeží", "Korálové ostrovy jsou malé a klokan se na nich nepase. Je to prostředí koralů."],
      ["v bažinách na březích velkých řek", "Klokan rudý žije v suché otevřené krajině, bažiny mu nevyhovují."],
    ],
    hints: [
      "Nejdřív si představ prostředí, které každá možnost popisuje (led, moře, bažina, otevřená krajina), a zvaž, jestli by v něm klokan mohl skákat.",
      "Klokan rudý se pase v otevřené krajině, kde je málo vody a hodně volného prostoru. Hledej takovou krajinu.",
    ],
    explanation: "Klokan rudý snáší sucho a potřebuje otevřenou krajinu, proto žije ve vnitrozemí a na savanách. Prales a útes jsou vlhká prostředí a ledovce v Austrálii nejsou.",
  },
  {
    q: "Zvíře nosí mládě ve vaku na břiše. Do které skupiny savců patří?",
    key: "vačnatci",
    d: [
      ["vejcorodí savci", "Vejcorodí savci snášejí vejce a vak nemají. Vak je znak vačnatců."],
      ["šelmy", "Šelmy jsou dravci, kteří lovem získávají maso. Vak není jejich znak."],
      ["hlodavci", "Hlodavci mají velké řezáky a mláďata nosí v hnízdě, ne ve vaku."],
    ],
    hints: [
      "Rozhodni podle jediného znaku, který zadání uvádí: kde zvíře nosí mládě.",
      "Skupiny savců se dělí podle způsobu, jak se rodí a nosí mláďata — jinak než u šelem a hlodavců.",
    ],
    explanation: "Savci s vakem na břiše jsou vačnatci — klokan a koala. Mládě se rodí drobné a dorůstá ve vaku matky. Šelmy ani hlodavci vak nemají.",
  },
  {
    q: "Zvíře je pokryté srstí, kojí mláďata a přitom klade vejce. Do které skupiny savců patří?",
    key: "vejcorodí savci",
    d: [
      ["vačnatci", "Vačnatci rodí drobná živá mláďata a nosí je ve vaku, vejce nesnášejí."],
      ["šelmy", "Šelmy vejce nesnášejí, rodí živá mláďata."],
      ["hlodavci", "Hlodavci rodí živá mláďata a vejce nesnášejí."],
    ],
    hints: [
      "Zaměř se na neobvyklý znak: většina savců ho nemá, ale tohle zvíře ano.",
      "Ze znaků v zadání vyber ten, který je pro savce zvláštní, a vyluč skupiny, které ho nemají.",
    ],
    explanation: "Savec, který klade vejce, je vejcorodý — v Austrálii je to hlavně ptakopysk (vejce klade ještě ježura). Ostatní skupiny savců rodí živá mláďata.",
  },
  {
    q: "Koala žije jen na eukalyptech a živí se jejich listy. Co se stane, když les zmizí?",
    key: "koala přijde o domov i potravu",
    d: [
      ["přejde na trávu a nic se nezmění", "Koala má úzce zaměřenou potravu, tráva jí nestačí."],
      ["bude okusovat kůru jiných stromů", "Koala kůru nejí. Její trávení je přizpůsobené jen listům eukalyptů."],
      ["zvykne si na bambus jako panda", "Bambus je potrava pandy. Koala je zvyklá jen na listy eukalyptů a jinou stravu nezvládne."],
    ],
    hints: [
      "Vezmi si dvě věci, které na eukalyptech koala hledá. Co z toho jí les dává?",
      "Zvíře, které se živí jen jednou rostlinou, nemá kam přejít, když rostlina zmizí.",
    ],
    explanation: "Koala je pevně vázaná na eukalypty: živí se jejich listy a žije v korunách. Kdyby zmizel les, přišla by o obojí a nemá kam přejít.",
  },
  {
    q: "Ve vnitrozemí Austrálie spadne za rok velmi málo srážek. Co z toho plyne?",
    key: "vznikají tam pouště a polopouště",
    d: [
      ["rostou tam husté deštné pralesy", "Prales potřebuje hodně deště. Málo srážek znamená suchou krajinu."],
      ["vznikají tam rozsáhlé bažiny a jezera", "Bažiny potřebují hodně vody. Při nedostatku srážek vysychají."],
      ["přibývají tam ledovce a sněhová pole", "Ve vnitrozemí led ani sněhová pole nevznikají, je tam sucho a teplo. Málo srážek znamená sucho, ne led."],
    ],
    hints: [
      "Krajina se řídí tím, kolik vody dostane. Co vyroste tam, kde je jí velmi málo?",
      "Porovnej to s pobřežím: jak se liší rostliny tam, kde prší hodně, od těch, kde skoro neprší?",
    ],
    explanation: "Při nedostatku srážek vznikají pouště a polopouště, kde rostou jen řídké trávy a keře. Bažiny, prales i ledovce potřebují víc vody.",
  },
  {
    q: "Emu má silné dlouhé nohy a malá křídla. Jak se zachrání před nepřítelem?",
    key: "rychle uteče po rovině",
    d: [
      ["vzlétne a přeletí přes savanu", "Malá křídla k letu nestačí. Emu létat neumí."],
      ["vyšplhá na eukalypt jako koala", "Šplhat emu neumí. Chrání se rychlým během."],
      ["skáče na zadních nohách jako klokan", "Skákat je typické pro klokana. Emu utíká krokem a klusem."],
    ],
    hints: [
      "Podívej se na stavbu jeho těla: co dovolují nohy a co malá křídla?",
      "Vyluč pohyby, které tělo emu neumožní (let, šplhání), a zbylý zvol podle silných nohou.",
    ],
    explanation: "Emu má silné nohy a křídla malá, proto neumí létat. Před nepřítelem uteče rychlým během po rovině.",
  },
  {
    q: "Ptakopysk snáší vejce, přesto ho řadíme mezi savce. Podle čeho?",
    key: "má srst a kojí mláďata",
    d: [
      ["žije ve vodě a umí plavat", "Ve vodě žijí i ryby a ptáci. Život ve vodě savce nedefinuje."],
      ["má zobák podobný ptačímu", "Zobák má i pták. Savce určuje srst a kojení mlékem."],
      ["má čtyři končetiny a ocas", "Končetiny a ocas mají i plazi a ptáci. Savce určuje srst a kojení mlékem."],
    ],
    hints: [
      "Hledej znaky, které mají všichni savci — a které pták nikdy nemá.",
      "Jedním znakem je pokrytí těla, druhým to, čím matka mláďata krmí.",
    ],
    explanation: "Všichni savci mají srst a kojí mláďata mlékem — to platí i pro ptakopyska. Vejce a zobák má i pták; u ptakopyska jsou to zvláštnosti, o zařazení mezi savce rozhodují srst a kojení.",
  },
  {
    q: "Jak vzniká korálový útes?",
    key: "vápenité schránky odumřelých polypů",
    d: [
      ["láva se pod vodou zastaví a ztuhne", "Tak vznikají sopečné ostrovy. Útes nenarostl ze sopky."],
      ["moře naplaví písek a kameny z pouště", "Naplavený písek tvoří pláže a mělčiny, ne pevnou stavbu z živých organismů."],
      ["z lasturek a mušlí naplavených na mělčinu", "Mušle se naplaví na břeh, ale pevný útes z nich nevznikne. Stavbu tvoří vápenité schránky polypů."],
    ],
    hints: [
      "Útes je živá stavba: přemýšlej, co po sobě zanechávají živí tvorové, když odumřou.",
      "Zbytky těl, které po sobě zanechají tisíce generací, se hromadí na jednom místě. Z čeho se skládá to, co po nich zůstane?",
    ],
    explanation: "Polypi si kolem těla budují vápenité schránky. Když odumřou, schránky zůstanou a další generace na nich staví dál — za tisíce let vznikne pevný útes.",
  },
];
const tvurceL2 = (): PracticeTask | null => fakt(pick(BANKA_L2));

// ── L3: přenos ─────────────────────────────────────────────────────────────

interface PopisZvirete {
  popisy: string[];
  d: [string, string][];
  hints: [string, string];
  explanation: string;
}

/** Popis znaků → které zvíře to je. Znění nikdy nezopakuje otázky z L1. */
const POPISY: Record<string, PopisZvirete> = {
  klokan: {
    popisy: [
      "Popis zvířete: býložravý savec, který přes den odpočívá ve stínu a večer se pase; před nebezpečím uskáče na silných zadních nohách a samice nosí mládě v kožním záhybu na břiše. Které zvíře to je?",
      "Popis zvířete: savec s dlouhým silným ocasem, kterým se při rychlých skocích vyrovnává; mládě po narození dorůstá v kapse na břiše matky. Které zvíře to je?",
      "Popis zvířete: samec se v boji o samici vzpřímí a zápasí s protivníkem předníma nohama; po rovinách vnitrozemí se přesouvá ve skocích a mládě nosí v kapse. Které zvíře to je?",
    ],
    d: [
      ["koala", "Koala mládě také nosí ve vaku, ale žije na stromech a po rovinách neskáče."],
      ["emu", "Emu je pták, který po rovině běhá. Vak ani skoky nemá."],
      ["ptakopysk", "Ptakopysk žije ve vodě, vejce snáší a vak nemá."],
      ["dingo", "Dingo je australský divoký pes; vak nemá a neskáče."],
    ],
    hints: [
      "Ze zadání vyber dva nejvýraznější znaky (jak se zvíře pohybuje a kde nosí mládě). Pak škrtni možnosti, které některý z nich nemají.",
      "Vak mají dva známí australští savci; rozliší je to, zda se pohybují po zemi ve skocích, nebo šplhají po větvích.",
    ],
    explanation: "Popis patří klokanovi: vačnatec, který se po zemi pohybuje skoky na silných zadních nohách. Koala je také vačnatec, ale šplhá po stromech; emu a ptakopysk vak nemají.",
  },
  koala: {
    popisy: [
      "Popis zvířete: šedý chlupatý savec, který většinu dne prospí v koruně stromu, v noci okusuje aromatické listy a mládě nosí ve vaku. Které zvíře to je?",
      "Popis zvířete: pomalý savec s ostrými drápy k šplhání a hustým kožichem; živí se téměř výhradně listy eukalyptů a k zemi slézá jen zřídka. Které zvíře to je?",
      "Popis zvířete: kulatá hlava, velké chlupaté uši a vzhled plyšového medvídka; mládě dorůstá ve vaku matky a pak ho matka nosí na zádech. Které zvíře to je?",
    ],
    d: [
      ["klokan", "Klokan má také vak, ale skáče po zemi a na stromy nešplhá."],
      ["ptakopysk", "Ptakopysk je vodní savec, snáší vejce a vak nemá."],
      ["medvěd grizzly", "Medvěd vypadá podobně, ale mládě nenosí ve vaku a v Austrálii nežije."],
      ["dingo", "Dingo je divoký pes, který loví na zemi; vak nemá a na stromy neleze."],
    ],
    hints: [
      "Ze zadání vyber dva nejvýraznější znaky (kde zvíře tráví čas a jak nosí mládě). Pak škrtni možnosti, které některý z nich nemají.",
      "Vak mají dva známí australští savci; rozliší je to, zda se pohybují po zemi ve skocích, nebo šplhají po větvích.",
    ],
    explanation: "Popis patří koale: vačnatec žijící na eukalyptech. Klokan má vak, ale skáče po zemi; ptakopysk vak nemá; medvěd sice vypadá podobně, ale v Austrálii nežije.",
  },
  emu: {
    popisy: [
      "Popis zvířete: velký pták s dlouhýma nohama a drobnými křídly; nevzlétne, ale po australských savanách dokáže rychle utíkat před nepřítelem. Který živočich to je?",
      "Popis zvířete: ptačí obr pokrytý hrubým peřím, který žije v suchém vnitrozemí Austrálie a snáší velká tmavě zelená vejce; jeho křídla neslouží k letu. Který živočich to je?",
      "Popis zvířete: pták, který se v Austrálii pase na travnatých pláních, dlouhými kroky překonává velké vzdálenosti a před nepřítelem nevzlétne. Který živočich to je?",
    ],
    d: [
      ["klokan", "Klokan je savec, ne pták. Skáče, ale nemá peří ani vejce."],
      ["koala", "Koala je savec, žije na stromech a peří nemá."],
      ["pštros", "Pštros je také velký nelétavý pták, ale žije v Africe. Zadání mluví o Austrálii."],
      ["ptakopysk", "Ptakopysk má zobák a snáší vejce, ale je to savec se srstí. Peří ani křídla nemá."],
    ],
    hints: [
      "Rozliš, jestli popis mluví o savci, nebo o ptáku, a pak zjisti, jestli zvíře létá. Hledej to, co splňuje obojí.",
      "Vyhledej v popisu údaj o místě: zvíře žije v Austrálii, což vylučuje nelétavé ptáky z jiných světadílů.",
    ],
    explanation: "Popis patří emu — velkému nelétavému ptáku z Austrálie. Klokan a koala jsou savci; pštros je také nelétavý pták, ale žije v Africe.",
  },
  ptakopysk: {
    popisy: [
      "Popis zvířete: savec s hustou srstí, plochým zobákem a plovacími blánami mezi prsty, který loví ve sladkých tocích a přitom snáší vejce. Které zvíře to je?",
      "Popis zvířete: loví ve vodě drobné živočichy pod hladinou, samice v noře na břehu snáší vejce a vylíhlá mláďata kojí mlékem. Které zvíře to je?",
      "Popis zvířete: zvláštní savec připomínající mix bobra a kachny — plochý ocas, zobák a plovací blány; mláďata se líhnou z vajec. Které zvíře to je?",
    ],
    d: [
      ["koala", "Koala je vačnatec, který vejce nesnáší a žije na stromech."],
      ["klokan", "Klokan je suchozemský vačnatec; mládě nosí ve vaku, vejce nesnáší."],
      ["vydra", "Vydra je vodní savec, ale rodí živá mláďata a zobák nemá."],
      ["emu", "Emu snáší vejce, ale je to pták s peřím, ne savec se srstí a plovacími blánami."],
    ],
    hints: [
      "Prohlédni, jestli popis obsahuje protiklad: znak savců a znak, který savci většinou nemají.",
      "Vylučuj zvířata, která nemají ptačí znak (zobák, vejce). Pozor na vodní savce: ptačí znak nemají, protože rodí živá mláďata.",
    ],
    explanation: "Popis patří ptakopyskovi: vodní savec se srstí a zobákem, který klade vejce. Koala a klokan vejce nesnášejí; vydra je vodní savec, ale rodí živá mláďata.",
  },
};

function popisZvirete(): PracticeTask | null {
  const jmeno = pick(Object.keys(POPISY));
  const p = POPISY[jmeno];
  return hlidej(
    choice(
      pick(p.popisy),
      jmeno,
      pickN(p.d, 3).map(([value, why]): Distractor => ({ value, why })),
      { hints: p.hints, explanation: p.explanation },
    ),
  );
}

/** Tři zápisy popisu útesu — klíč je pojem, distraktory blízká pobřežní prostředí. */
const POPISY_UTESU = [
  "Popis místa: v teplém mělkém moři u tropického pobřeží se z vápenných schránek drobných živočichů vytvořila dlouhá pevná stavba, která sahá až k hladině. Co to je?",
  "Popis místa: voda je průzračná a hřeje jako v létě, dno leží jen pár metrů pod hladinou a je porostlé pestrobarevnou vápencovou stavbou plnou ryb. Co to je?",
  "Popis místa: vápencová stavba, kterou po tisíce let vrství kolonie drobných živočichů, chrání pobřeží před vlnami a leží v tropickém moři. Co to je?",
];

const utesZPopisu = (): PracticeTask | null =>
  hlidej(
    choice(
      pick(POPISY_UTESU),
      "korálový útes",
      [
        { value: "sopečný ostrov", why: "Sopečný ostrov vzniká z ochlazené lávy, ne z vápenných schránek živočichů." },
        { value: "mangrovový les", why: "Mangrovy jsou lesy stromů v mělčinách u tropického pobřeží. Popis mluví o vápencové stavbě z živočichů." },
        { value: "písečná pláž", why: "Pláž tvoří nahromaděný písek. Popis mluví o pevné vápencové stavbě z živočichů." },
      ],
      {
        hints: [
          "Vyber z popisu dva znaky — z čeho se stavba skládá a v jakém prostředí je. Pak škrtni možnosti, které je nemají.",
          "Vápenné schránky drobných živočichů nejsou ani písek, ani láva. Podmínky (teplo, mělčina) říkají, v jakém moři to je.",
        ],
        explanation: "Popis patří korálovému útesu: vápencová stavba z drobných živočichů (polypů), která roste v teplém mělkém tropickém moři. Sopečný ostrov, mangrovy a pláž jsou jiná pobřežní prostředí.",
      },
    ),
  );

const BANKA_L3: Fakt[] = [
  {
    q: "Popis oblasti: rozlehlá rovina s červenou půdou, řídkými keři a suchou trávou; deště jsou vzácné a řeky vysychají. Kde to v Austrálii je?",
    key: "ve vnitrozemí kontinentu",
    d: [
      ["na vlhkém severovýchodním pobřeží", "Pobřeží u Korálového moře je vlhké, roste tam prales. Popis mluví o suché krajině."],
      ["na korálových ostrovech u pobřeží", "Korálové ostrovy jsou malé mořské útvary, ne rozlehlá pevninská rovina."],
      ["v ledovcových horách na jihu", "V Austrálii ledovce nejsou. Popis je horký a suchý."],
    ],
    hints: [
      "Z popisu vyber, kolik je tam vody. Suchou krajinu hledej tam, kam nedosáhne vlhký vzduch od moře.",
      "Rozliš pobřeží (vlhký vzduch od moře) a střed kontinentu (daleko od moře).",
    ],
    explanation: "Rozlehlá suchá rovina s řídkou vegetací je pro vnitrozemí Austrálie typická. Vlhký vzduch od moře se tak daleko nedostane a prší jen málo.",
  },
  {
    q: "Popis oblasti: teplý, stále vlhký kraj s hustým pralesem, popínavými rostlinami a častými prudkými dešti. Kde v Austrálii ho najdeš?",
    key: "na severovýchodním pobřeží",
    d: [
      ["v suchém vnitrozemí kontinentu", "Ve vnitrozemí prší málo a prales tam neroste."],
      ["uprostřed písečné pouště", "V poušti je sucho. Popis mluví o stálém vlhku a hustém pralese."],
      ["na náhorní plošině bez řek", "Plošina bez řek je suchá. Prales potřebuje hodně vody."],
    ],
    hints: [
      "Z popisu vyber, kolik prší a odkud se bere voda pro takový prales.",
      "Vlhký vzduch přichází od moře a cestou se vysráží. Kde ho je nejvíc a kde už se nedostane?",
    ],
    explanation: "Deštné pralesy rostou na vlhkém severovýchodním pobřeží, kam přichází vlhký vzduch od moře. Vnitrozemí je suché.",
  },
  {
    q: "Zpráva: v posledních letech koráli na jedné části útesu blednou a hynou. Vědci to spojují se změnou podmínek v moři. Která změna to nejspíš vysvětluje?",
    key: "voda v moři se dlouhodobě oteplila",
    d: [
      ["voda v moři se dlouhodobě ochladila", "Koráli chlad neuloží; bělení vzniká při přehřátí, ne při ochlazení."],
      ["k mělkému dnu proniká málo slunce", "Koráli potřebují světlo, ale bělení nevzniká jeho nedostatkem, nýbrž přehřátím vody."],
      ["mořská voda ztratila všechnu sůl", "Slanost se za pár let neztratí. Bělení způsobuje oteplení."],
    ],
    hints: [
      "Které změně prostředí koráli nesnášejí? Zvaž teplotu vody, světlo a slanost a u každé se ptej, jestli by ji koráli přežili.",
      "Koráli jsou citliví na teplotu. Přemýšlej, jestli jim vadí přehřátí, nebo ochlazení.",
    ],
    explanation: "Když se moře příliš oteplí, koráli se stresují, přijdou o barvu a zbělají; může jim hrozit i uhynutí. Příčinou je oteplení, ne chlad nebo nedostatek světla.",
  },
  {
    q: "Zpráva potápěčů: útes, který dřív zářil barvami, je bílý a mnoho korálů hyne, přitom se kolem něj v posledních letech změnila teplota vody. Co se stalo?",
    key: "voda v moři se dlouhodobě oteplila",
    d: [
      ["voda v moři se dlouhodobě ochladila", "Bělení nevzniká z chladu. Koráli zbělají, když je moře příliš teplé."],
      ["k mělkému dnu proniká málo slunce", "Bělení nevzniká nedostatkem slunce, ale přehřátím vody."],
      ["mořská voda ztratila všechnu sůl", "Slanost se za pár let neztratí. Bělení vzniká oteplením."],
    ],
    hints: [
      "Zaměř se na údaj ze zprávy, který se změnil: na teplotu vody. Rozhodni, zda šlo o oteplení, nebo ochlazení.",
      "Koráli žijí na horní hranici tolerovaného tepla. Přemýšlej, co by je zkazilo víc — trochu tepleji, nebo trochu chladněji.",
    ],
    explanation: "Koráli žijí v teplé vodě, ale dlouhodobé oteplení je stresuje, ztrácejí barvu a mohou uhynout. Chlad, málo světla ani ztráta soli bělení nevysvětlují.",
  },
  {
    q: "Případ: po silných deštích spláchly řeky z polí do moře bahno a hnojiva. Jak to může poškodit nedaleký útes?",
    key: "kalná voda ubírá světlo a hnojiva rozmnoží řasy",
    d: [
      ["živiny z půdy koraly nakrmí, a útes proto rychleji poroste", "Živiny nakrmí hlavně řasy, které koraly zastíní. Útes tím trpí."],
      ["bahno útes ochrání před vlnami a oteplením", "Bahno útes zakryje a zastíní. Před vlnami ho chrání sám tvar útesu."],
      ["sladká voda moře jen zředí a koralům nijak neublíží", "Sladká voda koralům škodí a nese s sebou kal i hnojiva."],
    ],
    hints: [
      "Rozlož splachy na jednotlivé složky (bahno, hnojivo) a u každé se ptej, co to udělá se světlem a s vodou.",
      "Koráli potřebují průzračnou vodu. Které složky splachů ji zkalí a co přinesou řasám?",
    ],
    explanation: "Splachy z polí zkalí vodu, takže ke koralům proniká méně světla, a hnojiva rozmnoží řasy, které koraly zastíní a připraví o kyslík. Útes tím trpí.",
  },
  {
    q: "Případ: úrodná půda s hnojivy z pobřežních plantáží se po bouři dostala do moře u útesu. Co tím útesu hrozí?",
    key: "kalná voda ubírá světlo a hnojiva rozmnoží řasy",
    d: [
      ["živiny z půdy koraly nakrmí, a útes proto rychleji poroste", "Živiny nakrmí hlavně řasy, které koraly zastíní. Útes tím trpí."],
      ["bahno útes ochrání před vlnami a oteplením", "Bahno útes zakryje a zastíní. Před vlnami ho chrání sám tvar útesu."],
      ["sladká voda moře jen zředí a koralům nijak neublíží", "Sladká voda koralům škodí a nese s sebou kal i hnojiva."],
    ],
    hints: [
      "Zeptej se, co půda z plantáží nese s sebou (hlína, živiny) a jak to změní vodu.",
      "Koráli potřebují průzračnou vodu. Které složky splachů ji zkalí a co přinesou řasám?",
    ],
    explanation: "Půda z plantáží zkalí vodu, takže ke koralům proniká méně světla, a hnojiva rozmnoží řasy, které koraly zastíní. Útes tím trpí.",
  },
  {
    q: "Případ: na australský ostrov byli dovezeni králíci a divoké kočky. Původní druhy začaly mizet. Proč?",
    key: "původní druhy se s nimi nevyvíjely a neuměly se bránit",
    d: [
      ["dovezená zvířata jsou vždy větší a silnější", "Velikost nerozhoduje: i malé kočky ohrožují původní druhy. Příčinou je to, že se původní druhy nevyvíjely s novými."],
      ["původní druhy se odstěhovaly a jinde dál žijí", "Málokterý druh se jen tak odstěhuje. Ty, které se před nově příchozími neumějí bránit, prostě hynou."],
      ["křížením s nimi původní druhy zanikly", "Původní zvířata se s králíky a kočkami nekříží. Zanikají proto, že se před nimi neumějí bránit."],
    ],
    hints: [
      "Zamysli se, jak se zvířata na izolovaném ostrově vyvíjela a s jakými nepřáteli se dosud nesetkala.",
      "Když se druh nikdy nepotkal s určitým predátorem nebo konkurentem, nemá se čím ani kam bránit. Co z toho plyne pro nově příchozí zvířata?",
    ],
    explanation: "Původní druhy se vyvíjely bez těchto predátorů a konkurentů, takže neumějí utéct ani se bránit. Dovezená zvířata je proto snadno vytlačí nebo sežerou — a to i tehdy, když nejsou větší ani silnější.",
  },
  {
    q: "Případ: do Austrálie byly kdysi dovezeny divoké kočky a lišky. Malí vačnatci z jejich blízkosti mizí. Jak to vysvětlíš?",
    key: "původní druhy se s nimi nevyvíjely a neuměly se bránit",
    d: [
      ["dovezená zvířata jsou vždy větší a silnější", "Velikost nerozhoduje: i malé kočky ohrožují původní druhy. Příčinou je to, že se původní druhy nevyvíjely s novými."],
      ["původní druhy se odstěhovaly a jinde dál žijí", "Málokterý druh se jen tak odstěhuje. Ty, které se před nově příchozími neumějí bránit, prostě hynou."],
      ["křížením s nimi původní druhy zanikly", "Vačnatci se s kočkami ani liškami nekříží. Zanikají proto, že se před nimi neumějí bránit."],
    ],
    hints: [
      "Zvaž, jestli se malí vačnatci s takovými predátory někdy setkali a jestli se před nimi mohli naučit chránit.",
      "Když se druh nikdy nepotkal s určitým predátorem, nemá se čím ani kam bránit. Co z toho plyne pro nově příchozí zvířata?",
    ],
    explanation: "Původní vačnatci se vyvíjeli bez takových šelem, takže se neumějí bránit ani ukrýt. Dovezené kočky a lišky je proto ničí, i když nejsou větší.",
  },
  {
    q: "Úkol: navrhni, co nejvíce pomůže Velkému bariérovému útesu do budoucna.",
    key: "omezit splachy z pevniny a bránit oteplování moře",
    d: [
      ["sbírat koraly a prodávat je jako suvenýry", "Sběr koralů útes ničí a zhoršuje jeho stav. Chránit ho znamená koraly nechat."],
      ["přivézt k útesu zvířata z jiných světadílů", "Nová zvířata z cizích míst dělají škodu — stejně jako dovezené kočky a králíci."],
      ["z moře odstranit všechny řasy, aby nebylo kalno", "Řasy jsou součástí prostředí útesu. Problém dělají splachy z pevniny a oteplování."],
    ],
    hints: [
      "Připomeň si, co útesu škodí (kal, hnojiva, oteplení), a hledej krok, který tuhle příčinu odstraňuje.",
      "Dobré opatření řeší příčinu, ne následek, a nepřidává do prostředí nic cizího.",
    ],
    explanation: "Útesu pomůže, když se omezí splachy z pevniny (kal a hnojiva) a zpomalí oteplování moře. Sbírání koralů ani vypouštění cizích druhů mu nepomůže — naopak.",
  },
  {
    q: "Případ: na ostrově daleko od pevniny, kam se lidé dostali teprve nedávno, objevili vědci dosud neznámý druh. Proč pravděpodobně nežije nikde jinde?",
    key: "ostrov byl dlouho oddělený a druh se tam vyvíjel sám",
    d: [
      ["všechny ostrovní druhy jsou ohrožené a jinde už vyhynuly", "Vzácnost s izolací nesouvisí: endemit nemusí být ohrožený. Vysvětlení hledej v odloučení."],
      ["ostrovní druhy jsou vždy jedovaté, proto se jinde nešíří", "Jed s tím nesouvisí. Druh se nešíří proto, že vznikl v odloučení."],
      ["na ostrovech je vždy tepleji než na pevnině", "Teplota vznik nového druhu nevysvětlí. Rozhoduje dlouhé odloučení od okolí."],
    ],
    hints: [
      "Představ si ostrov daleko od pevniny: nové druhy se na něj téměř nedostanou a ty tam žijící se dál mění. Co z toho plyne?",
      "Vysvětlení hledej v poloze ostrova, ne ve vlastnostech druhu.",
    ],
    explanation: "Na dlouho izolovaném ostrově se druhy vyvíjejí odděleně od zbytku světa, a proto mohou být endemity. Vlastnost druhu (jed, ohrožení) ani teplota to nevysvětlují.",
  },
  {
    q: "Případ: na vzdáleném tichomořském ostrově roste rostlina, kterou jinde na světě nikdo nenašel. Čím to vysvětlíš?",
    key: "ostrov byl dlouho oddělený a druh se tam vyvíjel sám",
    d: [
      ["všechny ostrovní druhy jsou ohrožené a jinde už vyhynuly", "Vzácnost s izolací nesouvisí: endemit nemusí být ohrožený. Vysvětlení hledej v odloučení."],
      ["ostrovní druhy jsou vždy jedovaté, proto se jinde nešíří", "Jed s tím nesouvisí. Druh se nešíří proto, že vznikl v odloučení."],
      ["na ostrovech je vždy tepleji než na pevnině", "Teplota vznik nového druhu nevysvětlí. Rozhoduje dlouhé odloučení od okolí."],
    ],
    hints: [
      "Zamysli se, co znamená vzdálenost od pevniny pro rostliny: jak se semena a druhy šíří a jak se tam mění.",
      "Vysvětlení hledej v poloze ostrova, ne ve vlastnostech druhu.",
    ],
    explanation: "Vzdálený ostrov je izolovaný, takže tam druh vznikl a vyvíjel se sám. Proto ho jinde nenajdeme — je to endemit. Jed, ohrožení ani teplota to nevysvětlují.",
  },
  {
    q: "Úkol: vědci chtějí založit nový umělý útes z korálových polypů. Které místo vyberou?",
    key: "teplé mělké moře u tropického pobřeží",
    d: [
      ["teplé, ale kalné moře u ústí velké řeky", "Voda je sice teplá, ale kal zastíní světlo a sladká voda koralům škodí."],
      ["čisté mělké moře daleko od rovníku, kde je chladno", "Mělko a čistě, ale v chladu koráli nepřežijí. Potřebují teplo."],
      ["teplé a čisté moře, ale hluboko pod hladinou", "Teplo a čistota nestačí. Hluboko je tma a koráli potřebují světlo."],
    ],
    hints: [
      "Sepiš si podmínky, které koráli potřebují (teplota, hloubka, čistota vody), a u každého místa ověř, kolik jich splňuje.",
      "Každé místo splňuje jen část podmínek. Hledej to, které splňuje všechny najednou.",
    ],
    explanation: "Nový útes vznikne v teplém mělkém moři u tropického pobřeží: jen tam se sejde teplo, světlo a čistá slaná voda. Ostatní místa splňují jen část podmínek — kalné ústí řeky zakryje světlo, chladné moře je příliš studené a hluboká voda je tmavá.",
  },
  {
    q: "Úkol: potápěči hledají nově vzniklý útes. V jakém prostředí ho nejspíš najdou?",
    key: "průzračná mělká laguna kolem tropického ostrova",
    d: [
      ["průzračná hluboká voda daleko od břehu", "Průzračná voda nestačí. Hluboko se světlo nedostane až ke dnu."],
      ["mělká zátoka se studenou vodou u polárního kruhu", "Světla je tam dost, ale v ledové vodě koráli nerostou. Potřebují teplé moře."],
      ["teplá zátoka u ústí řeky plná bahna", "Teplo je dobré, ale kal zastíní světlo a sladká voda koralům škodí."],
    ],
    hints: [
      "Které z prostředí nabízí zároveň teplo, světlo a čistou slanou vodu? Vyber to, kde se to všechno sejde.",
      "U každého místa najdi, která podmínka mu chybí (světlo, teplo, čistota). Správné místo nemá chybějící žádnou.",
    ],
    explanation: "Útes vznikne v průzračné mělké laguně kolem tropického ostrova: je tam teplo, světlo a čistá slaná voda. Hluboká voda, studená zátoka i kalné ústí řeky vždy některou podmínku nesplňují.",
  },
];

const L3_TVURCI: Tvurce[] = [
  popisZvirete,
  popisZvirete,
  popisZvirete,
  utesZPopisu,
  ...BANKA_L3.map((f) => () => fakt(f)),
];
const tvurceL3 = (): PracticeTask | null => pick(L3_TVURCI)();

// ── Skladba sezení ─────────────────────────────────────────────────────────

/**
 * Sezení = PRVNÍCH `sessionTaskCount` úloh poolu. Zamíchat celý pool nestačí:
 * dvě otázky řešitelné týmž vyloučením (dvě zvířecí, dvě o útesu) by se mohly
 * sejít v jedné šestici. Výlučnost se proto hlídá v úvodní šestici, zbytek
 * poolu zůstává úplný.
 */
type Skupiny = [RegExp, string][];

const skupinaPodle = (tabulka: Skupiny) => (t: PracticeTask): string | null =>
  tabulka.find(([r]) => r.test(t.question))?.[1] ?? null;

function omezSezeni(
  pool: PracticeTask[],
  kolik: number,
  skupina: (t: PracticeTask) => string | string[] | null,
  limity: Record<string, number> = {},
): PracticeTask[] {
  const pouzito = new Map<string, number>();
  const sezeni: PracticeTask[] = [];
  const zbytek: PracticeTask[] = [];
  for (const t of pool) {
    const g = skupina(t);
    const gs = g === null ? [] : Array.isArray(g) ? g : [g];
    const vejde = gs.every((x) => (pouzito.get(x) ?? 0) < (limity[x] ?? 1));
    if (sezeni.length < kolik && vejde) {
      for (const x of gs) pouzito.set(x, (pouzito.get(x) ?? 0) + 1);
      sezeni.push(t);
    } else {
      zbytek.push(t);
    }
  }
  return [...sezeni, ...zbytek];
}

const SKUPINY_L1: Skupiny = [
  // obě šablony „který z těchto živočichů“ — táž rodina odpovědí
  [/^Který z těchto živočichů/, "seznam"],
  [/^Co platí o emu|^Jak se pohybuje klokan|^Které tvrzení o koale|^Čím se koala|^Kde žije ptakopysk|^Čím je ptakopysk/, "zvire"],
  [/Velký bariérový útes/, "utes"],
  [/^Jaké je vnitrozemí|^Který obydlený světadíl|^Na které polokouli|^Mezi kterými oceány|^Čím je Austrálie/, "poloha"],
];

const SKUPINY_L2: Skupiny = [
  [/útes|Koráli|korálový|koráli/i, "utes"],
  [/oddělená od ostatních|jen v Austrálii/, "izolace"],
  [/ve vaku|klade vejce/, "skupina"],
  [/pralesy|klokan rudý|vnitrozemí Austrálie spadne/, "klima"],
  [/Koala žije jen|Emu má silné|Ptakopysk snáší/, "zvire"],
];

const SKUPINY_L3: Skupiny = [
  [/^Popis zvířete/, "zvire"],
  [/^Popis místa|útes|Velkému bariérovému|korálů|koráli/i, "utes"],
  [/ostrov|dovezeny|dovezeni/i, "ostrov"],
  [/^Popis oblasti/, "oblast"],
];

/**
 * L3: mimo tematické skupiny se hlídá i shodný klíč. Dvojice úloh se stejnou
 * správnou odpovědí (dva popisy klokana, dvě bělení, dvě splachy …) jsou pro
 * žáka táž úloha podruhé — v jednom sezení smí být nejvýš jedna z nich.
 */
const skupinaL3 = (t: PracticeTask): string[] => {
  const g = skupinaPodle(SKUPINY_L3)(t);
  const klic = `klic:${t.correctAnswer}`;
  return g ? [g, klic] : [klic];
};
function gen(level: number): PracticeTask[] {
  const tvurce: Tvurce = level === 1 ? tvurceL1 : level === 2 ? tvurceL2 : tvurceL3;
  const skupina =
    level === 3 ? skupinaL3 : skupinaPodle(level === 1 ? SKUPINY_L1 : SKUPINY_L2);
  const limity: Record<string, number> =
    level === 1 ? { zvire: 2, utes: 2, poloha: 2 } : level === 2 ? { utes: 2, zvire: 2, klima: 2 } : { zvire: 2, utes: 2 };
  return omezSezeni(ruzneUlohy(() => losUlohy(tvurce)), 6, skupina, limity);
}

// ── Topic ──────────────────────────────────────────────────────────────────
export const PRIRODA_ENDEMITY_VELKY_BARIEROVY_UTES: TopicMetadata[] = [
  {
    id: "g6-zem-priroda-endemity-velky-barierovy-utes-6",
    rvpNodeId: "g6-zemepis-regiony-sveta-australie-a-oceanie-priroda-endemity-velky-barierovy-utes",
    displayName: "Příroda Austrálie",
    title: "Příroda - endemity, Velký bariérový útes",
    studentTitle: "Klokani, koaly a útes plný korálů",
    subject: "zemepis",
    category: "Regiony světa",
    topic: "Austrálie a Oceánie",
    briefDescription: "Zvířata jen z Austrálie, jak vzniká korálový útes a čím mu hrozí.",
    keywords: [
      "Austrálie", "endemit", "klokan", "koala", "ptakopysk", "emu", "vačnatec",
      "Velký bariérový útes", "korálový polyp", "bělení korálů", "izolace", "Korálové moře",
    ],
    goals: [
      "Vysvětlit, že izolace Austrálie vedla ke vzniku druhů, které jinde nežijí (endemitů).",
      "Rozpoznat typické australské živočichy a zařadit je (vačnatec, vejcorodý savec, nelétavý pták).",
      "Popsat polohu Velkého bariérového útesu a podmínky, které koráli potřebují.",
      "Vysvětlit příčinami problémy útesu (oteplení, splachy) a ohrožení původních druhů dovezenými zvířaty.",
    ],
    boundaries: [
      "Žádná přesná čísla (délka útesu, počet druhů, rozloha) — klíč používá jen kvalitativní údaje.",
      "Ptakopysk je vejcorodý savec, klokan a koala jsou vačnatci, emu je nelétavý pták — jiné zařazení je chyba.",
      "Bělení korálů způsobuje oteplení moře, ne nedostatek slunce ani chlad.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Austrálie byla dlouho oddělená od ostatních světadílů, proto se tam vyvinuly endemity. Koráli potřebují teplou, čistou a mělkou mořskou vodu.",
      steps: [
        "U zvířat si vyber nejvýraznější znak (vak, vejce, křídla, voda) a přiřaď ho skupině.",
        "U útesu se ptej, jaké podmínky koráli potřebují (teplo, světlo, čistá slaná voda).",
        "U problémů hledej příčinu: co se změnilo — teplota, čistota vody, nebo se objevil nový druh?",
      ],
      commonMistake: "Považovat koalu za medvěda, ptakopyska za vačnatce nebo bělení korálů za následek chladu či nedostatku slunce.",
      example: "Koala je vačnatec: mládě nosí ve vaku a živí se listy eukalyptů. Medvěd to není, i když tak vypadá.",
    },
  },
];
