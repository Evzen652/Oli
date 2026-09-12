import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

/**
 * Přepsáno 2026-09-12 (inventura obsahu, dávka g3cjl-a).
 *
 * Předtím: jeden pool sdílených úloh, u žádné z nich zpětná vazba k chybným
 * možnostem, malá nápověda společná pro 39 úloh a L3 jen o deseti položkách.
 *
 * Teď tři disjunktní banky podle kognitivní náročnosti:
 *   L1 — rozpoznání: význam mnohoznačného slova určí kontext věty.
 *   L2 — aplikace pojmu: bez kontextu rozhodnout, které slovo má víc významů.
 *   L3 — transfer: přenesený (obrazný) význam — ustálená spojení a věty,
 *        kde se jméno jedné věci půjčilo věci úplně jiné.
 *
 * Každá úloha má vlastní dvojici nápověd (malá odkazuje na konkrétní větu nebo
 * konkrétní možnosti), vysvětlení PROČ a zpětnou vazbu u každé chybné možnosti.
 */

// ── L1 · význam podle kontextu ──────────────────────────────────────────────

interface KontextItem {
  slovo: string;
  veta: string;
  /** Doplní větu „Ve větě se mluví …“ — musí být unikátní (jde do malé nápovědy). */
  oblast: string;
  /** Slovo ve větě, které o významu rozhoduje. */
  klic: string;
  spravne: string;
  chybne: [Distractor, Distractor, Distractor];
}

const KONTEXT: KontextItem[] = [
  {
    slovo: "koruna",
    veta: "Vítr rozhoupal korunu starého dubu.",
    oblast: "o starém dubu, tedy o stromu",
    klic: "rozhoupal",
    spravne: "vršek stromu s větvemi",
    chybne: [
      { value: "české peníze", why: "Ve větě se nic nekupuje ani neplatí — vítr rozhoupe jen něco, co roste vysoko." },
      { value: "ozdoba na hlavě krále", why: "Žádný král ani královna ve větě nevystupují; koruna tu patří dubu." },
      { value: "kořeny stromu pod zemí", why: "Kořeny jsou schované pod zemí a vítr je nerozhoupe." },
    ],
  },
  {
    slovo: "koruna",
    veta: "Za rohlík jsem zaplatil osm korun.",
    oblast: "o placení v obchodě",
    klic: "zaplatil",
    spravne: "české peníze",
    chybne: [
      { value: "ozdoba na hlavě krále", why: "Královskou ozdobou se v obchodě za rohlík neplatí." },
      { value: "vršek stromu s větvemi", why: "Ve větě žádný strom není — mluví se o tom, kolik rohlík stál." },
      { value: "papírový sáček na pečivo", why: "Sáček k pečivu v obchodě patří, ale zaplatit se jím nedá." },
    ],
  },
  {
    slovo: "list",
    veta: "Napsala vzkaz na čistý list papíru.",
    oblast: "o psaní vzkazu",
    klic: "Napsala",
    spravne: "arch papíru",
    chybne: [
      { value: "část rostliny, která roste na větvi", why: "Na lístek utržený z větve se vzkaz nepíše." },
      { value: "dopis poslaný poštou", why: "Poštu ve větě nikdo neposílá — teprve se píše vzkaz." },
      { value: "tužka, kterou se píše", why: "Tužkou se píše, ale ptáme se, NA CO se psalo." },
    ],
  },
  {
    slovo: "list",
    veta: "Na podzim spadl z javoru poslední list.",
    oblast: "o javoru na podzim",
    klic: "spadl",
    spravne: "část rostliny, která roste na větvi",
    chybne: [
      { value: "arch papíru", why: "Papír z javoru nepadá — ve větě je strom, ne sešit." },
      { value: "dopis poslaný poštou", why: "Dopis nosí pošťák, ne javor." },
      { value: "plod stromu, například žalud", why: "Plod je něco jiného; ptáme se na význam slova, které ve větě opravdu stojí." },
    ],
  },
  {
    slovo: "hlava",
    veta: "Po celém dni mě bolela hlava.",
    oblast: "o bolesti po dlouhém dni",
    klic: "bolela",
    spravne: "část těla nad krkem",
    chybne: [
      { value: "vedoucí celé skupiny", why: "Žádnou skupinu ve větě nikdo nevede — mluví se o bolesti." },
      { value: "horní část hřebíku", why: "Hřebík žádnou bolest necítí; ve větě jde o člověka." },
      { value: "hlávka česneku", why: "Česnek se ve větě nevaří ani nekrájí." },
    ],
  },
  {
    slovo: "hlava",
    veta: "Hlava naší výpravy rozdělila úkoly.",
    oblast: "o tom, kdo výpravě velí",
    klic: "rozdělila",
    spravne: "vedoucí celé skupiny",
    chybne: [
      { value: "část těla nad krkem", why: "Samotné tělo úkoly nerozdělí — musí to udělat člověk, který výpravu řídí." },
      { value: "horní část hřebíku", why: "Hřebík ve výpravě nikomu nic nerozdělí." },
      { value: "nejrychlejší člen výpravy", why: "Vést výpravu a být v ní nejrychlejší není totéž." },
    ],
  },
  {
    slovo: "zámek",
    veta: "Do dveří jsme dali nový zámek.",
    oblast: "o dveřích a zamykání",
    klic: "dveří",
    spravne: "zařízení, které se otvírá klíčem",
    chybne: [
      { value: "velká historická budova", why: "Budovu do dveří nikdo nedá — bývá to naopak." },
      { value: "klíč od bytu", why: "Klíč zámek jenom otvírá, sám zámkem není." },
      { value: "klika na dveřích", why: "Klikou se dveře otvírají, ale zamknout se jimi nedá." },
    ],
  },
  {
    slovo: "zámek",
    veta: "V neděli jsme si prohlédli starý zámek.",
    oblast: "o nedělní prohlídce",
    klic: "prohlédli",
    spravne: "velká historická budova",
    chybne: [
      { value: "zařízení, které se otvírá klíčem", why: "Prohlídka se nedělá kolem kousku kovu ve dveřích." },
      { value: "klíč od bytu", why: "Klíč si na výlet nikdo prohlížet nechodí." },
      { value: "obraz visící v muzeu", why: "Obrazy uvnitř být mohou, ale to slovo pojmenovává samotnou stavbu." },
    ],
  },
  {
    slovo: "kolo",
    veta: "Do školy jezdím každý den na kole.",
    oblast: "o cestě do školy",
    klic: "jezdím",
    spravne: "jízdní kolo",
    chybne: [
      { value: "část soutěže", why: "Ve větě se nesoutěží — někdo se každý den dopravuje do školy." },
      { value: "kružnice narýsovaná kružítkem", why: "Narýsovaný tvar tě do školy neodveze." },
      { value: "kolečko od auta", why: "Samotné kolečko od auta nikam nejede." },
    ],
  },
  {
    slovo: "kolo",
    veta: "Náš tým postoupil do druhého kola soutěže.",
    oblast: "o soutěži, ve které se postupuje dál",
    klic: "postoupil",
    spravne: "část soutěže",
    chybne: [
      { value: "jízdní kolo", why: "Na kole se dá k soutěži přijet, ale postoupit do něj nejde." },
      { value: "kružnice narýsovaná kružítkem", why: "Do narýsovaného tvaru tým nepostupuje." },
      { value: "vítězství v celé soutěži", why: "Postoupit dál znamená jít o krok vpřed, ne už vyhrát." },
    ],
  },
  {
    slovo: "oko",
    veta: "Do oka mi ve větru spadlo smítko.",
    oblast: "o smítku, které přineslo počasí",
    klic: "smítko",
    spravne: "orgán, kterým vidíme",
    chybne: [
      { value: "smyčka při pletení svetru", why: "Svetr ve větě nikdo neplete." },
      { value: "mastné kolečko na polévce", why: "Polévka se ve větě nevaří ani nejí." },
      { value: "brýle na čtení", why: "Brýle se nosí před očima, ale okem nejsou." },
    ],
  },
  {
    slovo: "pero",
    veta: "Podepsal se modrým perem.",
    oblast: "o podpisu",
    klic: "Podepsal",
    spravne: "psací potřeba",
    chybne: [
      { value: "jedno ptačí peříčko", why: "Peříčkem se dnes nikdo nepodepisuje." },
      { value: "pružina v posteli", why: "Pružinu z postele nikdo do ruky nebere." },
      { value: "guma na mazání", why: "Gumou se maže, ne podepisuje." },
    ],
  },
  {
    slovo: "pero",
    veta: "Papoušek při přeletu ztratil barevné pero.",
    oblast: "o papouškovi za letu",
    klic: "Papoušek",
    spravne: "jedno ptačí peříčko",
    chybne: [
      { value: "psací potřeba", why: "Papoušek propisku ani tužku neztratí." },
      { value: "pružina v posteli", why: "Pružina z postele za letu nevypadne." },
      { value: "celé ptačí křídlo", why: "Křídlo je celé, kdežto to, co papoušek ztratil, je jen jeho malinká část." },
    ],
  },
  {
    slovo: "jazyk",
    veta: "Po zmrzlině mě studil jazyk.",
    oblast: "o snědené zmrzlině",
    klic: "studil",
    spravne: "sval v ústech",
    chybne: [
      { value: "řeč, kterou mluvíme", why: "Řeč po zmrzlině studit nemůže — chlad cítí tělo." },
      { value: "kus kůže u boty", why: "Kůže u boty nic necítí." },
      { value: "plamen ohně", why: "Plamen hřeje, ale ve větě nikdo netopí." },
    ],
  },
  {
    slovo: "klíč",
    veta: "Zapomněl jsem doma klíč od bytu.",
    oblast: "o zapomenuté věci z domova",
    klic: "Zapomněl",
    spravne: "věc, kterou se odemyká",
    chybne: [
      { value: "zámek ve dveřích", why: "Zámek je to, CO se odemyká; ve větě jde o to, ČÍM se odemyká." },
      { value: "hejno letících ptáků", why: "Ptáci létají vysoko, ale doma se nezapomínají." },
      { value: "návod na vyluštění hádanky", why: "Návod nikoho do bytu nepustí; ve větě jde o obyčejnou věc z kapsy." },
    ],
  },
];

function kontextUloha(it: KontextItem): PracticeTask {
  return choice(
    `Co znamená slovo „${it.slovo}“ ve větě „${it.veta}“?`,
    it.spravne,
    it.chybne,
    {
      hints: [
        `Ve větě se mluví ${it.oblast}. Který z nabízených významů tam patří?`,
        `Rozhoduje věta kolem, ne slovo samo. Nejvíc napoví „${it.klic}“ — zkus u každé možnosti říct, jestli k němu sedí. Ostatní významy to slovo taky má, jenom se hodí do jiných vět.`,
      ],
      explanation: `Ve větě se mluví ${it.oblast}, a proto tu má slovo „${it.slovo}“ význam „${it.spravne}“. V jiné větě může totéž slovo znamenat něco úplně jiného — tomu se říká mnohoznačnost.`,
    },
  );
}

// ── L2 · jednoznačné × mnohoznačné bez kontextu ─────────────────────────────

interface MnohoSlovo { slovo: string; v1: string; v2: string }
interface JednoSlovo { slovo: string; proc: string }

const M: Record<string, MnohoSlovo> = {
  koruna: { slovo: "koruna", v1: "ozdobu na hlavě krále", v2: "české peníze" },
  list: { slovo: "list", v1: "lístek na větvi", v2: "arch papíru" },
  hlava: { slovo: "hlava", v1: "část těla nad krkem", v2: "vedoucího celé skupiny" },
  zámek: { slovo: "zámek", v1: "starou budovu, kam se jezdí na výlet", v2: "zařízení ve dveřích" },
  kolo: { slovo: "kolo", v1: "dopravní prostředek, na kterém se šlape", v2: "část soutěže" },
  oko: { slovo: "oko", v1: "orgán, kterým vidíme", v2: "smyčku na upleteném svetru" },
  pero: { slovo: "pero", v1: "psací potřebu", v2: "ptačí peříčko" },
  jazyk: { slovo: "jazyk", v1: "sval v ústech", v2: "řeč, kterou mluvíme" },
  klíč: { slovo: "klíč", v1: "věc, kterou se odemyká", v2: "hejno letících ptáků" },
  raketa: { slovo: "raketa", v1: "tenisovou pálku", v2: "stroj, který letí do vesmíru" },
  myš: { slovo: "myš", v1: "malé zvířátko z pole", v2: "věc, kterou se ovládá počítač" },
  vlna: { slovo: "vlna", v1: "vodu zvednutou na moři", v2: "přízi na svetr" },
  ucho: { slovo: "ucho", v1: "orgán, kterým slyšíme", v2: "držadlo hrnku" },
  zub: { slovo: "zub", v1: "kousek kosti v puse", v2: "ostrý výstupek na pile" },
  nos: { slovo: "nos", v1: "část obličeje", v2: "špičatou příď lodi" },
};

const J: Record<string, JednoSlovo> = {
  žirafa: { slovo: "žirafa", proc: "pojmenovává jen jedno zvíře s dlouhým krkem" },
  mrkev: { slovo: "mrkev", proc: "pojmenovává jen jednu oranžovou zeleninu" },
  tramvaj: { slovo: "tramvaj", proc: "pojmenovává jen jeden dopravní prostředek na kolejích" },
  svetr: { slovo: "svetr", proc: "pojmenovává jen jeden kus teplého oblečení" },
  deštník: { slovo: "deštník", proc: "pojmenovává jen jednu věc, která chrání před deštěm" },
  pastelka: { slovo: "pastelka", proc: "pojmenovává jen jednu věc na vybarvování" },
  hrnec: { slovo: "hrnec", proc: "pojmenovává jen jednu nádobu na vaření" },
  vidlička: { slovo: "vidlička", proc: "pojmenovává jen jeden příbor" },
  mravenec: { slovo: "mravenec", proc: "pojmenovává jen jeden drobný hmyz" },
  kaktus: { slovo: "kaktus", proc: "pojmenovává jen jednu rostlinu s bodlinami" },
  vrtulník: { slovo: "vrtulník", proc: "pojmenovává jen jeden létající stroj s vrtulí" },
  jahoda: { slovo: "jahoda", proc: "pojmenovává jen jedno červené ovoce" },
  sešit: { slovo: "sešit", proc: "pojmenovává jen jednu věc na psaní ve škole" },
  lednice: { slovo: "lednice", proc: "pojmenovává jen jeden chladicí spotřebič" },
  sněhulák: { slovo: "sněhulák", proc: "pojmenovává jen jednu postavu ze sněhu" },
  koloběžka: { slovo: "koloběžka", proc: "pojmenovává jen jednu věc s řídítky a stupátkem" },
};

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** L2a — najdi mnohoznačné slovo mezi jednoznačnými. */
const HLEDEJ_MNOHO: [MnohoSlovo, JednoSlovo, JednoSlovo, JednoSlovo][] = [
  [M.koruna, J.žirafa, J.mrkev, J.tramvaj],
  [M.list, J.svetr, J.deštník, J.pastelka],
  [M.kolo, J.hrnec, J.vidlička, J.mravenec],
  [M.oko, J.kaktus, J.vrtulník, J.jahoda],
  [M.raketa, J.sešit, J.lednice, J.sněhulák],
  [M.myš, J.žirafa, J.pastelka, J.hrnec],
  [M.vlna, J.mrkev, J.vidlička, J.kaktus],
  [M.ucho, J.tramvaj, J.deštník, J.vrtulník],
];

/** L2b — najdi jednoznačné slovo mezi mnohoznačnými. */
const HLEDEJ_JEDNO: [JednoSlovo, MnohoSlovo, MnohoSlovo, MnohoSlovo][] = [
  [J.žirafa, M.koruna, M.list, M.hlava],
  [J.tramvaj, M.zámek, M.kolo, M.oko],
  [J.vidlička, M.pero, M.jazyk, M.klíč],
  [J.kaktus, M.raketa, M.myš, M.vlna],
  [J.sešit, M.ucho, M.zub, M.nos],
  [J.deštník, M.koruna, M.kolo, M.jazyk],
  [J.jahoda, M.list, M.oko, M.zub],
  [J.koloběžka, M.hlava, M.klíč, M.nos],
];

function hledejMnoho([m, d1, d2, d3]: [MnohoSlovo, JednoSlovo, JednoSlovo, JednoSlovo]): PracticeTask {
  return choice(
    "Které z těchto slov je mnohoznačné (má víc různých významů)?",
    m.slovo,
    [
      { value: d1.slovo, why: `„${cap(d1.slovo)}“ ${d1.proc} — druhý význam nemá.` },
      { value: d2.slovo, why: `„${cap(d2.slovo)}“ ${d2.proc} — druhý význam nemá.` },
      { value: d3.slovo, why: `„${cap(d3.slovo)}“ ${d3.proc} — druhý význam nemá.` },
    ],
    {
      hints: [
        `U slov „${d1.slovo}“ a „${d2.slovo}“ druhý význam nevymyslíš. Jedna možnost je ale jiná — u které ti napadnou dva?`,
        `Mnohoznačné slovo se dá použít ve dvou úplně jiných větách a pokaždé znamená něco jiného. Slovo jako „${d3.slovo}“ pojmenovává vždycky jen jednu věc, takže druhou větu s jiným významem s ním nesložíš.`,
      ],
      explanation: `Toto slovo může znamenat ${m.v1} i ${m.v2} — má tedy víc různých významů, a proto je mnohoznačné. Zbylé tři možnosti pojmenovávají pokaždé jen jednu jedinou věc.`,
    },
  );
}

function hledejJedno([j, d1, d2, d3]: [JednoSlovo, MnohoSlovo, MnohoSlovo, MnohoSlovo]): PracticeTask {
  return choice(
    "Které z těchto slov je jednoznačné (má jen jeden význam)?",
    j.slovo,
    [
      { value: d1.slovo, why: `„${cap(d1.slovo)}“ má víc významů: ${d1.v1} i ${d1.v2}.` },
      { value: d2.slovo, why: `„${cap(d2.slovo)}“ má víc významů: ${d2.v1} i ${d2.v2}.` },
      { value: d3.slovo, why: `„${cap(d3.slovo)}“ má víc významů: ${d3.v1} i ${d3.v2}.` },
    ],
    {
      hints: [
        `Tři možnosti mají dva významy — třeba „${d1.slovo}“ a „${d2.slovo}“. Hledej tu čtvrtou.`,
        `Zkus u každé možnosti složit dvě věty, ve kterých to slovo znamená pokaždé něco jiného. U „${d3.slovo}“ to půjde snadno; u jedné možnosti to nepůjde vůbec, a právě ta je hledaná.`,
      ],
      explanation: `Toto slovo ${j.proc}, a proto je jednoznačné. Zbylá tři slova se dají použít ve dvou různých významech, takže jsou mnohoznačná.`,
    },
  );
}

// ── L3 · přenesený význam ───────────────────────────────────────────────────

interface IdiomItem {
  fraze: string;
  /** Doplní větu „Zkus si vzpomenout, …“ (unikátní, jde do malé nápovědy). */
  naco: string;
  /** Co v tom spojení NEhledat doslova. */
  doslova: string;
  spravne: string;
  chybne: [Distractor, Distractor, Distractor];
}

const IDIOMY: IdiomItem[] = [
  {
    fraze: "mít zlaté ruce",
    naco: "co se o někom říká, když doma všechno spraví",
    doslova: "opravdové zlato",
    spravne: "být moc šikovný a umět spravit skoro všechno",
    chybne: [
      { value: "nosit na rukou zlaté prsteny", why: "To by bylo čtení slovo od slova — spojení ale chválí dovednost, ne šperky." },
      { value: "být bohatý", why: "Bohatství a šikovnost nejsou totéž; tady se chválí to, co člověk umí." },
      { value: "mít ruce ušpiněné od barvy", why: "Špinavé ruce mívá i ten, komu se práce vůbec nedaří." },
    ],
  },
  {
    fraze: "mít hlavu v oblacích",
    naco: "co se říká o někom, kdo se zasní a neposlouchá",
    doslova: "skutečné mraky",
    spravne: "být zasněný a nedávat pozor",
    chybne: [
      { value: "stát na vysoké hoře", why: "Kde člověk stojí, to spojení neřeší — mluví o pozornosti." },
      { value: "být hodně vysoký", why: "Výška s tím nemá nic společného; jde o to, kam se toulají myšlenky." },
      { value: "mít spoustu dobrých nápadů", why: "Nápady jsou něco jiného než nepozornost, a tohle spojení chválou není." },
    ],
  },
  {
    fraze: "být jedno velké ucho",
    naco: "co se říká o někom, kdo nechce přijít o jediné slovo",
    doslova: "opravdové ucho",
    spravne: "napjatě a pozorně poslouchat",
    chybne: [
      { value: "mít nápadně velké uši", why: "Jak kdo vypadá, to spojení nepopisuje." },
      { value: "být nedoslýchavý", why: "Je to naopak: ten člověk slyší všechno, protože dává velký pozor." },
      { value: "pořád o někom mluvit", why: "Mluvení a poslouchání jsou opačné činnosti." },
    ],
  },
  {
    fraze: "mít srdce z kamene",
    naco: "co se říká o někom, komu nikoho není líto",
    doslova: "skutečný kámen",
    spravne: "nikoho nelitovat a nemít soucit",
    chybne: [
      { value: "nosit na krku kamínek ve tvaru srdce", why: "Šperk s tím nemá co dělat — spojení mluví o povaze." },
      { value: "být velmi silný a zdravý", why: "Síla ani zdraví to nejsou; jde o to, co člověk cítí k druhým." },
      { value: "být hodně statečný", why: "Statečnost je chvála, tohle spojení ale nikoho nechválí." },
    ],
  },
  {
    fraze: "mít tvrdou hlavu",
    naco: "co se říká o někom, kdo si nikdy nedá říct",
    doslova: "tvrdost kostí",
    spravne: "nenechat si od nikoho poradit",
    chybne: [
      { value: "mít pevnou lebku", why: "O tělo tady vůbec nejde — spojení mluví o chování." },
      { value: "špatně se učit", why: "Učení to není; i chytrý člověk si může stát tvrdě za svým." },
      { value: "často narážet hlavou", why: "To by bylo čtení slovo od slova a nic by nevysvětlilo." },
    ],
  },
  {
    fraze: "cítit se jako ryba ve vodě",
    naco: "co se říká o někom, komu je někde moc dobře",
    doslova: "opravdová voda",
    spravne: "být někde úplně spokojený",
    chybne: [
      { value: "umět výborně plavat", why: "Plavání je jen obrázek, ze kterého spojení vzniklo; říká se i o někom na suchu." },
      { value: "být promoklý až na kůži", why: "Mokro s tím nemá nic společného." },
      { value: "být zticha jako ryba", why: "To je jiné ustálené spojení — tohle mluví o spokojenosti, ne o mlčení." },
    ],
  },
  {
    fraze: "spadl mu kámen ze srdce",
    naco: "co člověk cítí, když se špatná zpráva nakonec nepotvrdí",
    doslova: "skutečný kámen",
    spravne: "hodně se mu ulevilo",
    chybne: [
      { value: "něco těžkého mu upadlo na zem", why: "To by bylo čtení slovo od slova — žádný kámen ve hře není." },
      { value: "hrozně se lekl", why: "Je to naopak: strach teprve skončil." },
      { value: "rozzlobil se", why: "Zlost to není; tohle spojení popisuje úlevu." },
    ],
  },
  {
    fraze: "jde mu to od ruky",
    naco: "co se říká o někom, komu práce ubývá pod rukama",
    doslova: "pohyb ruky",
    spravne: "pracuje rychle a snadno",
    chybne: [
      { value: "něco mu z ruky vypadlo", why: "Nic nepadá — spojení hodnotí, jak se práce daří." },
      { value: "pracuje jen levou rukou", why: "Která ruka to dělá, není důležité." },
      { value: "práci odmítá", why: "Je to naopak: práce mu jde pěkně od ruky." },
    ],
  },
  {
    fraze: "otočit list",
    naco: "co člověk udělá, když chce začít úplně nanovo",
    doslova: "papír v knize",
    spravne: "začít znovu a jinak",
    chybne: [
      { value: "přetočit stránku v knize", why: "Přesně z tohohle obrázku spojení vzniklo, ale dnes znamená něco jiného." },
      { value: "utrhnout list ze stromu", why: "Strom s tím nemá nic společného." },
      { value: "všechno vzdát", why: "Vzdát to je opak — tohle spojení mluví o novém začátku." },
    ],
  },
  {
    fraze: "mít oči i vzadu",
    naco: "co se říká o dospělém, kterému nic neunikne",
    doslova: "počet očí",
    spravne: "všimnout si úplně všeho",
    chybne: [
      { value: "mít víc než dvě oči", why: "To by bylo čtení slovo od slova; nikdo takový není." },
      { value: "umět se dívat přes rameno", why: "Otočit hlavu umí každý — spojení mluví o pozornosti." },
      { value: "nosit brýle", why: "Brýle s tím nemají nic společného." },
    ],
  },
];

function idiomUloha(it: IdiomItem): PracticeTask {
  return choice(
    `Co znamená spojení „${it.fraze}“?`,
    it.spravne,
    it.chybne,
    {
      hints: [
        `Spojení „${it.fraze}“ se nemyslí doslova. Zkus si vzpomenout, ${it.naco}.`,
        `Přenesený význam se nedá přečíst slovo od slova — ${it.doslova} v tom spojení vůbec nehledej. Zeptej se radši, jakého člověka nebo jakou situaci lidé takhle popisují, a vyber možnost, která to vystihuje.`,
      ],
      explanation: `Spojení „${it.fraze}“ má přenesený (obrazný) význam. Slova v něm nepopisují skutečnou věc — vznikla z obrázku, který si každý představí, a dnes znamenají „${it.spravne}“.`,
    },
  );
}

interface PrenesenyItem {
  slovo: string;
  /** „Tři věty mluví o …“ — unikátní, jde do malé nápovědy. */
  oblast: string;
  spravna: string;
  /** Proč tu jde o přenesený význam (do vysvětlení). */
  proc: string;
  doslovne: [Distractor, Distractor, Distractor];
}

const PRENESENE: PrenesenyItem[] = [
  {
    slovo: "ucho",
    oblast: "opravdovém uchu na hlavě",
    spravna: "Hrnek na kakao má odražené ucho.",
    proc: "držadlo hrnku odstává stejně jako ucho na hlavě, a tak dostalo stejné jméno",
    doslovne: [
      { value: "Petrovi kouká za uchem tužka.", why: "Tady jde o skutečné ucho na Petrově hlavě." },
      { value: "Do ucha mi v lese vlétl komár.", why: "Komár vlétl do opravdového ucha — nic přeneseného." },
      { value: "Po nemoci ho bolelo levé ucho.", why: "Bolet může jen skutečná část těla." },
    ],
  },
  {
    slovo: "noha",
    oblast: "opravdové noze člověka nebo zvířete",
    spravna: "U kuchyňského stolu se uvolnila jedna noha.",
    proc: "podpěra stolu stojí na zemi a nese váhu jako noha, a tak se jí tak začalo říkat",
    doslovne: [
      { value: "Po pádu z kola ho bolela noha.", why: "Bolí ho opravdová noha — o přenesený význam tu nejde." },
      { value: "Zvedl nohu vysoko nad překážku.", why: "Nohu zvedá člověk, takže jde o skutečnou část těla." },
      { value: "Kotě má na každé noze bílou ponožku.", why: "Popisuje se srst na skutečných nohou kotěte." },
    ],
  },
  {
    slovo: "zub",
    oblast: "opravdovém zubu v puse",
    spravna: "Na staré pile chybí jeden zub.",
    proc: "ostré výstupky na pile vypadají jako zuby, a proto se jim tak říká",
    doslovne: [
      { value: "Včera mi vypadl mléčný zub.", why: "Mléčný zub je opravdový zub z pusy." },
      { value: "U zubaře mi spravili zub.", why: "Zubař spravuje skutečné zuby." },
      { value: "Tygr v zoo vycenil ostré zuby.", why: "Tygr má opravdový chrup — nic obrazného." },
    ],
  },
  {
    slovo: "oko",
    oblast: "opravdovém oku, kterým se vidí",
    spravna: "Babičce se na pleteném svetru spustilo oko.",
    proc: "smyčka z příze má kulatý tvar jako oko, a tak se jí začalo říkat stejně",
    doslovne: [
      { value: "Do oka mi spadla řasa.", why: "Řasa spadla do opravdového oka." },
      { value: "Zavřel oči a hned usnul.", why: "Zavírají se skutečné oči — nic přeneseného." },
      { value: "Sova má obrovské oči.", why: "Popisuje se, jak sova doopravdy vypadá." },
    ],
  },
  {
    slovo: "nos",
    oblast: "opravdovém nosu na obličeji",
    spravna: "Nos lodi prorazil velkou vlnu.",
    proc: "špičatá příď lodi vybíhá dopředu jako nos, a tak se jí tak říká",
    doslovne: [
      { value: "Na mraze mě zebe nos.", why: "Zebe skutečný nos na obličeji." },
      { value: "Utřel si nos do kapesníku.", why: "Kapesník se používá na opravdový nos." },
      { value: "Pes má moc citlivý nos.", why: "Popisuje se skutečný čich psa." },
    ],
  },
  {
    slovo: "jazyk",
    oblast: "opravdovém jazyku v ústech",
    spravna: "Jazyk u boty se mi zkroutil pod tkaničkou.",
    proc: "kus kůže pod tkaničkou má podobný tvar jako jazyk, a tak převzal jeho jméno",
    doslovne: [
      { value: "Po zmrzlině mě studil jazyk.", why: "Chlad cítí skutečný jazyk v ústech." },
      { value: "Vyplázl na mě jazyk.", why: "Plazí se opravdový jazyk — nic obrazného." },
      { value: "Kočka si jazykem čistí kožich.", why: "Kočka používá svůj skutečný jazyk." },
    ],
  },
];

function prenesenyUloha(it: PrenesenyItem): PracticeTask {
  return choice(
    `Ve které větě je slovo „${it.slovo}“ použité v přeneseném významu?`,
    it.spravna,
    it.doslovne,
    {
      hints: [
        `Tři věty mluví o ${it.oblast} doopravdy. Hledej tu jedinou, kde to slovo pojmenovává něco úplně jiného.`,
        `Přenesený význam vzniká tak, že se jméno jedné věci půjčí věci jiné, která ji něčím připomíná. Projdi věty jednu po druhé a u každé si řekni, jestli se mluví o ${it.oblast} doopravdy, nebo o věci, která tak jenom vypadá.`,
      ],
      explanation: `V téhle větě se nemluví o ${it.oblast}: ${it.proc}. Právě takhle přenesený význam vzniká — ostatní tři věty popisují skutečnou věc.`,
    },
  );
}

// ── Generátor ───────────────────────────────────────────────────────────────

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(KONTEXT.map(kontextUloha));
  if (level === 2) return shuffle([...HLEDEJ_MNOHO.map(hledejMnoho), ...HLEDEJ_JEDNO.map(hledejJedno)]);
  return shuffle([...IDIOMY.map(idiomUloha), ...PRENESENE.map(prenesenyUloha)]);
}

export const SLOVAJEDNOZNACNAMNOHO: TopicMetadata[] = [
  {
    id: "g3-cjl-jazykova-vychova-nauka-o-slove-vyznam-slova-slova-jednoznacna-a-mnohoznacna",
    rvpNodeId: "g3-cjl-jazykova-vychova-nauka-o-slove-vyznam-slova-slova-jednoznacna-a-mnohoznacna",
    title: "Slova jednoznačná a mnohoznačná",
    studentTitle: "Jedno slovo, víc významů",
    illustrationDesc: "velký nápis KORUNA uprostřed, od něj šipky ke třem obrázkům — královská koruna, mince a strom s korunou, veselé kreslené provedení",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slově",
    briefDescription: "Poznáš, že jedno slovo může mít více různých významů.",
    keywords: ["jednoznačná slova", "mnohoznačná slova", "polysémie", "kontext", "význam slov"],
    goals: [
      "Rozlišit jednoznačná a mnohoznačná slova.",
      "Určit správný význam slova podle věty.",
      "Uvést příklady různých významů mnohoznačného slova.",
    ],
    boundaries: ["Základní příklady z každodenního jazyka", "Bez homonym (stejný tvar, jiný původ)"],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Mnohoznačné slovo: „koruna“ = na hlavě krále / peníze / horní část stromu. Vždy hledej kontext věty.",
      steps: [
        "Přečti si celou větu, ne jen samotné slovo.",
        "Podle kontextu (co se ve větě děje) urči, jaký význam se zde myslí.",
      ],
      commonMistake: "Žáci si vyberou první (nejčastější) význam bez ohledu na větu.",
      example: "„List papíru“ = arch papíru. „List stromu“ = zelená část rostliny. Stejné slovo, jiný kontext!",
    },
  },
];
