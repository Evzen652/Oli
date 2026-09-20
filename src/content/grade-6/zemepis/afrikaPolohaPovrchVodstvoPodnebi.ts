/**
 * Zeměpis 6. ročník — Afrika: poloha, povrch, vodstvo, podnebí (select_one).
 *
 * Celé téma emituje jen úlohy s možnostmi (žádné míchání typů). K obsahu nejsou
 * mapy ani obrázky, poloha se proto popisuje souřadnicemi nebo sousedstvím,
 * mapové značky slovy (řeka, pohoří, poušť).
 *
 * Gradace:
 *  • L1 — banka faktů, jednokrokové otázky „Který/Co/Kde…“: oceány a moře kolem
 *    Afriky, Suezská šíje, rovník a obratníky, Sahara, Nil, Kongo, jezera,
 *    pohoří, Kilimandžáro, málo členité pobřeží.
 *  • L2 — jedno pravidlo se použije na případ: souřadnice → polokoule a podnebný
 *    pás (rovníkový / subekvatoriální / tropický / subtropický, s `solutionSteps`), příčina horka
 *    u rovníku a pouští u obratníků, směr toku Nilu z pramene k ústí,
 *    Východoafrický příkop, Suezský průplav.
 *  • L3 — neznámé zadání, víc vztahů najednou (dva kroky, přenos): podnebí popsané
 *    slovy → souřadnice, let po poledníku a čáry zeměpisné sítě, které překříží,
 *    cesta po poledníku a pořadí pásů, posouzení chybného tvrzení, sníh u rovníku
 *    (nadmořská výška), proč je Namib u moře poušť, roční doby na jižní polokouli,
 *    proč Nil pouští neteče naprázdno. Znění L1 a L3 jsou disjunktní.
 *
 * Podnebné pásy jsou zjednodušené dělení ze školních učebnic (rovníkový do asi 5°,
 * subekvatoriální asi 5°–15°, tropický asi 15°–30°, subtropický dál). Obratníky
 * jsou jen čáry sítě uvnitř tropického pásu, ne hranice pásů; ve vylosovaných
 * bodech se hranice pásů nikdy neobjeví.
 *
 * Chybový model: rovník prochází severním pobřežím nebo Evropou, obratníky
 * prohozené (Raka × Kozoroha), Sahara = jen písek, horko = „nejblíž ke Slunci“,
 * pouště na rovníku, na rovníku prší málo, oceány a moře zaměněné (Rudé moře
 * oddělující Evropu, Tichý oceán u Afriky), Atlas na jihu.
 *
 * Bez přesných čísel (výška Kilimandžára, délka Nilu, pořadí nejdelších řek) —
 * ptáme se na řád, umístění a příčinu. Rotace šablon se nastavuje uvnitř gen(),
 * modul nedrží žádný stav mezi voláními.
 *
 * Navazuje na „Africké přírodní oblasti“ (vegetace, zvířata, lidé) — tady se
 * neptáme na deštný les, savanu jako ekosystém ani na hospodářství.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import {
  pick,
  rnd,
  cis,
  shuffle,
  sirka,
  delka,
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

// ── L1: banka faktů ────────────────────────────────────────────────────────

const BANKA_L1: Fakt[] = [
  {
    q: "Který oceán omývá Afriku na západě?",
    key: "Atlantský oceán",
    d: [
      ["Indický oceán", "Indický oceán omývá opačnou, východní stranu Afriky, u Somálska a Mosambiku."],
      ["Tichý oceán", "Tichý oceán je od Afriky oddělený celou Asií a Amerikami, k jejímu pobřeží nedosahuje."],
      ["Severní ledový oceán", "Ten obklopuje severní pól a od Afriky ho dělí celá Evropa."],
    ],
    hints: [
      "Postav si Afriku vedle Ameriky: oceán, který leží mezi nimi, omývá její západní pobřeží.",
      "Zkus si stranu světadílu, na které jsi, určit podle sousedů: na západě je za vodou Amerika, na východě Asie. Pak už rozhodni, který oceán leží mezi Afrikou a Amerikou.",
    ],
    explanation: "Západní pobřeží Afriky omývá Atlantský oceán, který ji odděluje od Ameriky. Východní pobřeží patří Indickému oceánu.",
  },
  {
    q: "Který oceán omývá Afriku na východě?",
    key: "Indický oceán",
    d: [
      ["Atlantský oceán", "Atlantský oceán omývá západní pobřeží Afriky, tedy opačnou stranu."],
      ["Tichý oceán", "Tichý oceán leží až za Asií a Austrálií, k Africe nedosahuje."],
      ["Severní ledový oceán", "Ten leží kolem severního pólu, daleko za Evropou."],
    ],
    hints: [
      "Východní pobřeží je obrácené k Asii a k Austrálii; hledej oceán, který leží mezi nimi a Afrikou.",
      "Nejdřív si zapamatuj, který oceán je na západě, pak škrtni všechny oceány, které Afriku vůbec neomývají — zbývá jeden. Východ Afriky je totiž od Asie oddělený teplým oceánem.",
    ],
    explanation: "Na východě omývá Afriku Indický oceán. Právě odsud plují lodě k Asii a k Austrálii.",
  },
  {
    q: "S jakým světadílem spojuje Afriku Suezská šíje?",
    key: "s Asií",
    d: [
      ["s Evropou", "S Evropou Afrika po souši nesousedí. Odděluje je Středozemní moře a úzký Gibraltarský průliv."],
      ["s Jižní Amerikou", "Mezi Afrikou a Jižní Amerikou leží celý Atlantský oceán, souš je nespojuje."],
      ["s Austrálií", "Od Austrálie odděluje Afriku Indický oceán, žádná šíje mezi nimi není."],
    ],
    hints: [
      "Šíje je úzký pruh souše mezi dvěma moři; zeptej se, na které straně Afriky leží.",
      "Suezská šíje leží na severovýchodě Afriky. Hledej světadíl, se kterým je Afrika tady spojená úzkým pruhem souše; na druhé straně tohoto pruhu leží Rudé moře.",
    ],
    explanation: "Suezská šíje je úzký pruh souše na severovýchodě Afriky. Spojuje ji s Asií — proto se Afrika a Asie dotýkají po souši.",
  },
  {
    q: "Které moře odděluje Afriku od Evropy?",
    key: "Středozemní moře",
    d: [
      ["Rudé moře", "Rudé moře leží na opačné, východní straně Afriky a odděluje ji od Asie."],
      ["Černé moře", "Černé moře leží mezi Evropou a Asií, Afriky se vůbec nedotýká."],
      ["Severní moře", "Severní moře leží v severní Evropě, daleko od Afriky."],
    ],
    hints: [
      "Najdi moře, které leží mezi severním pobřežím Afriky a jižním pobřežím Evropy.",
      "Název ti řekne, kde leží: moře uprostřed pevnin. Je to moře, které Afriku na severu odděluje od Evropy a s Atlantikem ho spojuje úzký Gibraltarský průliv.",
    ],
    explanation: "Afriku od Evropy odděluje Středozemní moře. Je uzavřené mezi třemi světadíly a s Atlantským oceánem se spojuje Gibraltarským průlivem.",
  },
  {
    q: "Které moře odděluje Afriku od Asie na severovýchodě?",
    key: "Rudé moře",
    d: [
      ["Středozemní moře", "Středozemní moře leží na severu a odděluje Afriku od Evropy."],
      ["Černé moře", "Černé moře leží mezi Evropou a Asií, Afrika k němu nedosahuje."],
      ["Severní moře", "Severní moře leží u severní Evropy, u Afriky není."],
    ],
    hints: [
      "Hledej moře, které leží mezi Afrikou a Arabským poloostrovem, tedy Asií.",
      "Nejdřív škrtni moře, která leží v Evropě nebo na severu Afriky. Zbývá moře, na jehož konci leží Suezská šíje a které vede k Indickému oceánu.",
    ],
    explanation: "Na severovýchodě odděluje Afriku od Asie Rudé moře. Na jeho severním konci leží Suezská šíje, kudy se oba světadíly dotýkají.",
  },
  {
    q: "Kterou částí Afriky prochází rovník?",
    key: "prostředkem světadílu, kde ji dělí na dvě části",
    d: [
      ["severním pobřežím u Středozemního moře", "U Středozemního moře jsme velmi daleko od rovníku, asi 35° s. š."],
      ["jižním cípem poblíž Mysu Dobré naděje", "Jižní cíp Afriky je na 34° j. š., od rovníku ho dělí velká vzdálenost."],
      ["nikde, celá Afrika leží severně od něj", "Rovník Afriku protíná: kus světadílu leží na severní a kus na jižní polokouli."],
    ],
    hints: [
      "Rovník je čára s nulovou zeměpisnou šířkou; zeptej se, na kterém místě mapy Afriky je 0°.",
      "Nejdřív si vzpomeň, kolik stupňů šířky mají oba okraje Afriky: u Středozemního moře asi 35° s. š. a na jihu asi 34° j. š. Nula leží mezi nimi.",
    ],
    explanation: "Rovník prochází středem Afriky (Gabon, Kongo, Uganda, Keňa, Somálsko) a dělí ji na severní a jižní část. Proto Afrika leží na obou polokoulích.",
  },
  {
    q: "Který obratník protíná sever Afriky, tedy Saharu?",
    key: "obratník Raka",
    d: [
      ["obratník Kozoroha", "Ten leží na 23,5° j. š. a protíná jih Afriky, ne sever."],
      ["rovník", "Rovník není obratník; má 0° a protíná Afriku uprostřed."],
      ["severní polární kruh", "Ten leží až na 66,5° s. š., hluboko za Afrikou, v Arktidě."],
    ],
    hints: [
      "Obratníky leží na 23,5° s. š. a 23,5° j. š. Rozhodni, na které straně rovníku je sever Afriky.",
      "Každý z obou obratníků má jméno podle souhvězdí. Severní protíná sever Afriky a v Sahaře leží na 23,5° s. š. — nezaměň ho s jižním.",
    ],
    explanation: "Severní obratník je obratník Raka (23,5° s. š.) a prochází Saharou. Jižní obratník Kozoroha protíná jih Afriky.",
  },
  {
    q: "Který obratník protíná jih Afriky?",
    key: "obratník Kozoroha",
    d: [
      ["obratník Raka", "Ten leží na 23,5° s. š. a protíná sever Afriky, tedy Saharu."],
      ["rovník", "Rovník je čára 0° uprostřed Afriky, obratník není."],
      ["jižní polární kruh", "Ten leží až na 66,5° j. š., v Antarktidě, daleko za jižním cípem Afriky."],
    ],
    hints: [
      "Obratníky mají shodnou zeměpisnou šířku 23,5°, liší se stranou rovníku. Rozhodni, na které straně je jih.",
      "Jižní obratník leží na 23,5° j. š. a v Africe vede zhruba přes poušť Namib a Botswanu. Nezaměň ho se severním, který vede Saharou.",
    ],
    explanation: "Jižní obratník je obratník Kozoroha (23,5° j. š.). V Africe protíná Namibii, Botswanu i jih Madagaskaru.",
  },
  {
    q: "Co je Sahara?",
    key: "největší horká poušť světa na severu Afriky",
    d: [
      ["poušť tvořená jen pískem, bez jediné hory a oázy", "Sahara má i skalnatá pohoří (Ahaggar), kamenité pláně a oázy s vodou. Písek zabírá jen část."],
      ["rozsáhlé pohoří na severozápadě Afriky", "Pohoří na severozápadě Afriky se jmenuje Atlas. Sahara leží jižně od něj a je to poušť."],
      ["úrodná nížina kolem řeky Nil", "Nížina kolem Nilu je úzký pruh zeleně v poušti. Sahara je poušť kolem něj."],
    ],
    hints: [
      "Rozmysli si, jaké podnebí je u severního obratníku, a jestli tam převládají řeky, hory, nebo poušť.",
      "Sahara leží u obratníku Raka. Rozhodni, jestli jde o rozsáhlou poušť, nebo o pohoří, a jestli je celá jedním typem povrchu.",
    ],
    explanation: "Sahara je největší horká poušť světa a leží na severu Afriky. Není jen písek: jsou v ní i skalnatá pohoří, kamenité pláně a oázy.",
  },
  {
    q: "Do kterého moře se vlévá řeka Nil?",
    key: "do Středozemního moře",
    d: [
      ["do Rudého moře", "Rudé moře leží východně od Nilu. Řeka teče na sever, ne k východu."],
      ["do Indického oceánu", "Indický oceán leží na východě. Nil teče na sever, opačným směrem."],
      ["do Atlantského oceánu", "Do Atlantiku se vlévají jiné africké řeky, třeba Kongo. Nil teče na sever."],
    ],
    hints: [
      "Zjisti, kterým směrem Nil teče: z rovníkové Afriky přes poušť.",
      "Řeka teče od pramene k ústí. Pramen je u rovníku a poušť je dál od něj, ústí tedy leží až za pouští. Podle toho poznáš, jestli končí v oceánu, nebo v moři.",
    ],
    explanation: "Nil teče z východní Afriky na sever přes Saharu a vlévá se do Středozemního moře. Tam vytváří širokou deltu.",
  },
  {
    q: "Ve které části Afriky teče řeka Kongo?",
    key: "na obou stranách rovníku, uprostřed světadílu",
    d: [
      ["na severu, přes střed Sahary", "Přes Saharu teče Nil. Kongo teče vlhkou oblastí u rovníku."],
      ["na jihu, kolem obratníku Kozoroha", "Kolem jižního obratníku jsou pouště a řídce osídlené plošiny; Kongo teče dál na sever."],
      ["na severozápadě, pod pohořím Atlas", "Pod pohořím Atlas na severozápadě teče jen několik menších řek. Kongo je uprostřed světadílu."],
    ],
    hints: [
      "Uvažuj, kde v Africe je nejvíc vody z dešťů, a tam ji hledej.",
      "Kongo je největší africká řeka podle množství vody. Vodu dodávají vydatné deště; zvaž, ve které části Afriky prší nejvíc.",
    ],
    explanation: "Kongo teče rovníkovou Afrikou, kde prší velmi často, a má proto stále hodně vody. Vlévá se do Atlantského oceánu.",
  },
  {
    q: "Ve které části Afriky leží Viktoriino jezero?",
    key: "na východě světadílu",
    d: [
      ["na severu, uprostřed Sahary", "Uprostřed Sahary jsou jen oázy a vyschlé pánve, žádné velké jezero."],
      ["na jihu, u Mysu Dobré naděje", "U jižního cípu žádné velké jezero není; leží tam pobřeží a hory."],
      ["na západě, u pobřeží Atlantiku", "Na západě jsou hlavně řeky ústící do Atlantiku, velké jezero tam není."],
    ],
    hints: [
      "Viktoriino jezero je největší jezero Afriky. Uvažuj, ve které části světadílu leží velká jezera kolem rovníku.",
      "Jezero leží u rovníku mezi dvěma větvemi velké propadliny. Rozhodni, na které straně světadílu se tyto propadliny táhnou: na západě, na východě, na severu, nebo na jihu.",
    ],
    explanation: "Viktoriino jezero leží na východě Afriky, přímo u rovníku. Je největší africké jezero a pramení z něj Bílý Nil.",
  },
  {
    q: "Kde leží pohoří Atlas?",
    key: "na severozápadě Afriky",
    d: [
      ["na jihu Afriky", "Na jihu Afriky jsou Drakensberky, Atlas tam není."],
      ["na východě Afriky", "Na východě jsou vysočiny a Východoafrický příkop, Atlas leží na opačné straně."],
      ["uprostřed rovníkové Afriky", "Uprostřed rovníkové Afriky je pánev řeky Kongo, nížina, ne velké pohoří."],
    ],
    hints: [
      "Atlas je pohoří, které odděluje pobřeží od Sahary; rozhodni, na které straně Sahary je pobřeží.",
      "Pohoří leží mezi Středozemním mořem a Saharou. Urči, na které světové straně světadílu je Středozemní moře, a pak zvaž, jestli je pohoří spíš u východního, nebo u západního okraje této strany.",
    ],
    explanation: "Atlas je pohoří na severozápadě Afriky, mezi Středozemním mořem a Saharou. Oddělují se v něm pobřežní úrodné kraje od pouště.",
  },
  {
    q: "Ve které části Afriky leží pohoří Drakensberky?",
    key: "na jihovýchodě Afriky",
    d: [
      ["na severozápadě Afriky", "Tam leží pohoří Atlas."],
      ["na severovýchodě Afriky", "Na severovýchodě je Etiopská vysočina."],
      ["na jihozápadě Afriky", "Na jihozápadě leží pobřežní poušť Namib. Drakensberky jsou na opačné straně."],
    ],
    hints: [
      "Jde o nejvyšší pohoří jižní Afriky; rozhodni, na které straně jihu leží.",
      "Hory stojí blízko Indického oceánu, ne u Sahary. Podle toho, na které straně Afriky je Indický oceán a kde je jih, složíš světovou stranu ze dvou částí.",
    ],
    explanation: "Drakensberky leží na jihovýchodě Afriky, v blízkosti pobřeží Indického oceánu. Je to nejvyšší pohoří jižní Afriky.",
  },
  {
    q: "Jak se jmenuje nejvyšší hora Afriky?",
    key: "Kilimandžáro",
    d: [
      ["Atlas", "Atlas je celé pohoří na severozápadě Afriky a je nižší než nejvyšší hora."],
      ["Mont Blanc", "Mont Blanc je nejvyšší hora Alp v Evropě, ne v Africe."],
      ["Mount Everest", "Mount Everest je nejvyšší hora světa, leží v Himálaji v Asii."],
    ],
    hints: [
      "Nejvyšší hora Afriky není součástí žádného velkého pohoří; je to osamělá sopka.",
      "Hledej horu ve východní Africe poblíž rovníku. Nezaměňuj ji s horami z jiných světadílů.",
    ],
    explanation: "Nejvyšší horou Afriky je Kilimandžáro, sopka ve východní Africe. I když leží skoro na rovníku, na vrcholu je sníh.",
  },
  {
    q: "Co je Nilská delta?",
    key: "úrodná rovina, kde se Nil před ústím větví",
    d: [
      ["poušť na západ od Nilu, kde nic neroste", "Poušť je suchá, kdežto delta je nejúrodnější část kolem Nilu."],
      ["jezero, ze kterého Nil pramení", "Nil pramení v jezerech a vrchovinách u rovníku. Delta leží u ústí, na druhém konci toku."],
      ["pohoří, které Nil obtéká na severu", "Delta je rovina, ne pohoří; leží u ústí Nilu do Středozemního moře."],
    ],
    hints: [
      "Delta je útvar u ústí řeky, ne u pramene. Zeptej se, co se děje s řekou těsně před mořem.",
      "Řeka u moře zpomaluje a ukládá naplavený kal, takže vznikne rovina. Hledej útvar, který je rovný, úrodný a leží u moře.",
    ],
    explanation: "Nilská delta je úrodná rovina u ústí Nilu do Středozemního moře. Řeka se tam rozdělí do několika ramen a ukládá naplavený kal.",
  },
  {
    q: "Jaké je pobřeží Afriky?",
    key: "málo členité, s malým počtem zálivů a poloostrovů",
    d: [
      ["velmi členité, samé zálivy a poloostrovy jako v Evropě", "Členité pobřeží má Evropa. Afrika je proti ní kompaktní, s hladkým pobřežím."],
      ["členité fjordy, které vytvořily ledovce", "Fjordy vznikly v chladných oblastech, kde ledovce hloubily údolí. Na africkém pobřeží žádné ledovce nebyly."],
      ["členité jen na východě, jinde bez jediného zálivu", "Zálivy má Afrika i na západě a na severu, jen jich je celkově málo."],
    ],
    hints: [
      "Porovnej Afriku s Evropou: která má víc zálivů a poloostrovů a která je více celistvá?",
      "Nakresli si obrys světadílu: je hladký, nebo rozcuchaný? Všimni si, že obrys je hladký, bez velkých zálivů a poloostrovů, a pobřeží je proto ve vztahu k rozloze světadílu krátké.",
    ],
    explanation: "Pobřeží Afriky je málo členité — má jen několik zálivů (třeba Guinejský) a poloostrovů. Světadíl tak vypadá kompaktně, na rozdíl od Evropy.",
  },
  {
    q: "Ve které části Afriky leží Etiopská vysočina?",
    key: "na severovýchodě Afriky",
    d: [
      ["na jihozápadě Afriky", "Na jihozápadě leží pobřežní poušť Namib, ne Etiopská vysočina."],
      ["na severozápadě Afriky", "Na severozápadě je pohoří Atlas."],
      ["na jihovýchodě Afriky", "Na jihovýchodě jsou Drakensberky."],
    ],
    hints: [
      "Vysočina je pojmenovaná podle země, ve které leží: Etiopie. Zeptej se, na které straně Afriky ta země leží.",
      "Vysočina leží vedle Rudého moře, které odděluje Afriku od Arabského poloostrova. Zeptej se, na které straně Afriky Rudé moře leží a jestli jsi blíž k severu, nebo k jihu.",
    ],
    explanation: "Etiopská vysočina leží na severovýchodě Afriky, poblíž Rudého moře. Odtud pramení Modrý Nil.",
  },
];

const faktL1 = (): PracticeTask | null => fakt(pick(BANKA_L1));

// ── L2: podnebné pásy Afriky ──────────────────────────────────────────────

/**
 * Čtyři podnebné pásy Afriky podle vzdálenosti od rovníku (zjednodušené dělení
 * ze školních učebnic): rovníkový do asi 5°, subekvatoriální (savany se
 * střídáním dešťů a sucha) asi 5°–15°, tropický (pouště) asi 15°–30° a za ním
 * subtropický. Obratníky (23,5°) leží uvnitř tropického pásu, nejsou jeho
 * hranicí. Hranice se ve vylosovaných bodech nikdy neobjeví — rozsahy jsou
 * 1–4°, 8–12°, 19–27° a 32–34°.
 */
type Pas = "eq" | "se" | "tr" | "sub";
const HR_EQ_SE = 5;
const HR_SE_TR = 15;
const HR_TR_SUB = 30;

const VSECHNY_PASY: Pas[] = ["eq", "se", "tr", "sub"];
const PAS_NAZEV: Record<Pas, string> = {
  eq: "rovníkový pás",
  se: "subekvatoriální pás",
  tr: "tropický pás",
  sub: "subtropický pás",
};
const PAS_V: Record<Pas, string> = {
  eq: "v rovníkovém pásu",
  se: "v subekvatoriálním pásu",
  tr: "v tropickém pásu",
  sub: "v subtropickém pásu",
};
/** Zjednodušené meze pásu ve stupních od rovníku (poslední pás nemá horní mez). */
const PAS_OD: Record<Pas, number> = { eq: 0, se: HR_EQ_SE, tr: HR_SE_TR, sub: HR_TR_SUB };
const PAS_DO: Record<Pas, number> = { eq: HR_EQ_SE, se: HR_SE_TR, tr: HR_TR_SUB, sub: 90 };
const MIRNY = "mírný pás";
const HRANICE_TXT = `rovníkový do asi ${HR_EQ_SE}°, subekvatoriální do asi ${HR_SE_TR}°, tropický do asi ${HR_TR_SUB}°, dál subtropický`;

interface Bod {
  st: number;
  lon: number;
  jih: boolean;
}

/** Bod uvnitř Afriky (na souši) v daném pásu; hranice pásů se nikdy netrefí. */
function bod(pas: Pas, jih = Math.random() < 0.5): Bod {
  switch (pas) {
    case "eq":
      return { st: rnd(1, 4), lon: rnd(15, 35), jih };
    case "se":
      return { st: rnd(8, 12), lon: jih ? rnd(15, 33) : rnd(5, 35), jih };
    case "tr":
      return { st: rnd(19, 27), lon: jih ? rnd(16, 24) : rnd(5, 30), jih };
    default:
      return jih ? { st: rnd(32, 33), lon: rnd(19, 27), jih } : { st: rnd(34, 36), lon: rnd(8, 10), jih };
  }
}

const souradniceTxt = (b: Bod) => `${sirka(b.jih ? -b.st : b.st)}, ${delka(b.lon)}`;

/** Vysvětlení, proč pás nesedí, pro zadanou zeměpisnou šířku (ve stupních od rovníku). */
function proc(pas: Pas | "mirny", st: number): string {
  const s = cis(st);
  if (pas === "mirny") {
    return "Mírný pás leží mnohem dál od rovníku, v Africe se skoro nevyskytuje; je to pás, ve kterém leží Česko.";
  }
  const nazev = PAS_NAZEV[pas].replace(/^./, (c) => c.toUpperCase());
  return st < PAS_OD[pas]
    ? `${nazev} začíná až asi ${cis(PAS_OD[pas])}° od rovníku, ${s}° je míň — místo leží blíž k rovníku.`
    : `${nazev} končí asi ${cis(PAS_DO[pas])}° od rovníku, ${s}° je víc — místo leží dál od rovníku.`;
}

const pasZeSirky = (st: number): Pas => VSECHNY_PASY.find((p) => st < PAS_DO[p]) ?? "sub";
/** Sousední pás — nejpravděpodobnější záměna. */
const soused = (p: Pas, st: number): Pas => {
  const i = VSECHNY_PASY.indexOf(p);
  if (i === 0) return "se";
  if (i === 3) return "tr";
  return st < (PAS_OD[p] + PAS_DO[p]) / 2 ? VSECHNY_PASY[i - 1] : VSECHNY_PASY[i + 1];
};

function kroky(b: Bod, pas: Pas): string[] {
  const s = sirka(b.jih ? -b.st : b.st);
  const stC = cis(b.st);
  const porovnani =
    pas === "eq"
      ? `${stC}° je míň než ${cis(HR_EQ_SE)}° → rovníkový pás.`
      : pas === "sub"
        ? `${stC}° je víc než ${cis(HR_TR_SUB)}° → subtropický pás.`
        : `${stC}° je víc než ${cis(PAS_OD[pas])}° a míň než ${cis(PAS_DO[pas])}° → ${PAS_NAZEV[pas]}.`;
  return [
    `Šířka místa je ${s}, takže místo je ${stC}° od rovníku (${b.jih ? "jižně" : "severně"}).`,
    `Hranice pásů (zjednodušeně): ${HRANICE_TXT}.`,
    porovnani,
  ];
}

const HINT_PASY = `Zjednodušeně: do asi ${HR_EQ_SE}° od rovníku je pás rovníkový, do ${HR_SE_TR}° subekvatoriální, do ${HR_TR_SUB}° tropický a dál subtropický.`;

/** L2a: souřadnice → podnebný pás. Zeměpisná délka je jen rušivý údaj. */
function pasZeSouradnic(pas: Pas): PracticeTask | null {
  const b = bod(pas);
  const key = PAS_NAZEV[pas];
  const ostatni = shuffle(VSECHNY_PASY.filter((p) => p !== pas));
  const ds: Distractor[] = [
    { value: MIRNY, why: proc("mirny", b.st) },
    ...ostatni.map((p) => ({ value: PAS_NAZEV[p], why: proc(p, b.st) })),
  ];
  return hlidej(
    choice(
      `Místo v Africe má souřadnice ${souradniceTxt(b)} — jaký podnebný pás tam převládá?`,
      key,
      ds,
      {
        hints: [
          "Nejdřív zjisti, jak daleko od rovníku místo leží: rozhoduje zeměpisná šířka, délka ne.",
          `${HINT_PASY} Porovnej s tím šířku místa; sever nebo jih na pásu nic nemění.`,
        ],
        explanation: `Podnebný pás určuje vzdálenost od rovníku, tedy zeměpisná šířka. Místo leží ${cis(b.st)}° od rovníku, takže patří do pásu „${key}“. Zeměpisná délka ${delka(b.lon)} říká jen, jak daleko na východ či západ místo leží.`,
        solutionSteps: kroky(b, pas),
      },
    ),
  );
}

/** L2b: souřadnice → polokoule + pás (dvě rozhodnutí naráz). */
function polokouleAPas(pas: Pas, jih = Math.random() < 0.5): PracticeTask | null {
  const b = bod(pas, jih);
  const pol = (j: boolean) => (j ? "na jižní polokouli" : "na severní polokouli");
  const opt = (j: boolean, p: Pas) => `${pol(j)}, ${PAS_V[p]}`;
  const key = opt(jih, pas);
  const jinyPas = soused(pas, b.st);
  const dalsiPas = shuffle(VSECHNY_PASY.filter((p) => p !== pas && p !== jinyPas))[0];
  const polTxt = jih ? "j. š., tedy jižní šířka" : "s. š., tedy severní šířka";
  const spravna = jih ? "jižní" : "severní";
  const opacna = jih ? "severní" : "jižní";
  const chybaPol = `Za číslem je ${polTxt} — místo je na ${spravna} polokouli, ne na ${opacna}.`;
  return hlidej(
    choice(
      `Místo v Africe má souřadnice ${souradniceTxt(b)} — na které polokouli a v jakém pásu leží?`,
      key,
      [
        { value: opt(!jih, pas), why: `${chybaPol} Pás jsi určil správně.` },
        { value: opt(jih, jinyPas), why: `Polokouli máš správně, ale pás ne. ${proc(jinyPas, b.st)}` },
        { value: opt(!jih, jinyPas), why: `Chyby jsou dvě: ${chybaPol} A pás také nesedí. ${proc(jinyPas, b.st)}` },
        { value: opt(jih, dalsiPas), why: `Polokouli máš správně, ale pás ne. ${proc(dalsiPas, b.st)}` },
      ],
      {
        hints: [
          "Řeš dvě věci zvlášť: polokouli určují písmena za číslem, pás určuje velikost čísla.",
          `Písmena s. š. znamenají severní, j. š. jižní polokouli. Pak šířku porovnej s hranicemi pásů. ${HINT_PASY}`,
        ],
        explanation: `Písmena za číslem určují polokouli (${polTxt}) a vzdálenost od rovníku (${cis(b.st)}°) určuje pás „${PAS_NAZEV[pas]}“. Zeměpisná délka ${delka(b.lon)} do toho nezasahuje.`,
        solutionSteps: [
          `Písmena za číslem: ${sirka(jih ? -b.st : b.st)} → ${spravna} polokoule.`,
          ...kroky(b, pas).slice(1),
        ],
      },
    ),
  );
}

/** L2c: směr toku Nilu z polohy pramene a ústí. */
function nilSmer(): PracticeTask | null {
  const s0 = 2;
  const s1 = 31;
  return hlidej(
    choice(
      `Řeka Nil pramení asi na ${sirka(-s0)} a ústí na ${sirka(s1)} — kterým směrem teče?`,
      "na sever, do Středozemního moře",
      [
        { value: "na jih, do Indického oceánu", why: "Jih by znamenal, že ústí leží na větší jižní šířce než pramen. Tady je ústí na severu." },
        { value: "na východ, do Rudého moře", why: "Rudé moře leží východně, ale ústí je od pramene dál na sever než na východ. Šířka se mění z jižní na severní." },
        { value: "na západ, do Atlantského oceánu", why: "Do Atlantiku se vlévají řeky západní Afriky, třeba Kongo. Nil ústí u Středozemního moře." },
      ],
      {
        hints: [
          "Porovnej zeměpisnou šířku pramene a ústí: kterým směrem se šířka mění?",
          "Jižní šířka je menší než 0°, severní je větší. Když šířka roste od pramene k ústí, řeka teče k severnímu pólu; když klesá, k jižnímu.",
        ],
        explanation: "Pramen leží těsně jižně od rovníku a ústí u severního pobřeží. Nil proto teče na sever přes celou Saharu a vlévá se do Středozemního moře.",
      },
    ),
  );
}

// ── L2d: použití pravidla (příčiny) ────────────────────────────────────────

const BANKA_L2: Fakt[] = [
  {
    q: "Proč je v okolí rovníku celoročně horko a vlhko?",
    key: "Slunce tam stojí celý rok vysoko a hodně vody se vypařuje.",
    d: [
      ["Rovník je ke Slunci nejblíž, a proto tam nikdy nebývá chladno.", "Vzdálenost od Slunce je pro všechna místa na Zemi prakticky stejná. Horko dělá výška Slunce nad obzorem, ne blízkost."],
      ["Sklon osy tam způsobuje léto po celý rok a větry ze Sahary.", "Sklon zemské osy střídá roční doby a nejvíc se projevuje ve vyšších šířkách. U rovníku je horko celoročně proto, že Slunce stojí po celý rok vysoko."],
      ["Ze Sahary tam vane horký vítr, který přináší i vydatný déšť.", "Vítr ze Sahary je suchý a déšť nepřináší. U rovníku prší proto, že se ohřátý vzduch zvedá a tvoří mraky."],
    ],
    hints: [
      "Rozhodni, jak vysoko stojí Slunce nad obzorem u rovníku a jak dopadají jeho paprsky.",
      "Čím výš je Slunce nad obzorem, tím víc tepla dopadne na jednotku plochy. Přemýšlej i o tom, co horko dělá s vodou z lesů, řek a vlhké půdy.",
    ],
    explanation: "U rovníku stojí Slunce po celý rok vysoko nad obzorem, paprsky dopadají téměř kolmo a země se silně ohřívá. Z lesů, řek i moře se vypařuje hodně vody, vzduch stoupá a tvoří mraky — proto tam prší velmi často, většinou odpoledne.",
  },
  {
    q: "Proč leží největší pouště Afriky v okolí obratníků?",
    key: "Suchý vzduch tam klesá, mraky nevznikají a téměř neprší.",
    d: [
      ["Leží nejblíž ke Slunci, a proto z nich všechna voda vyschne.", "Slunci je každé místo na Zemi prakticky stejně blízko. Pouště vznikají tam, kde vzduch klesá a mraky nevznikají."],
      ["Vane tam stálý vítr od moře, který mraky rychle odfoukne.", "Vítr od moře vlhkost naopak přináší. Poušť vzniká tam, kde suchý vzduch klesá k zemi."],
      ["Jsou to místa s nejméně řekami, a proto tam neprší.", "Řeky déšť nedělají, déšť vzniká z mraků. Řek je tam málo právě proto, že mraky nevznikají."],
    ],
    hints: [
      "Přemýšlej o pohybu vzduchu: co se děje s vlhkostí ve vzduchu, který stoupá, a co u vzduchu, který klesá?",
      "Vzduch, který stoupá, se ochlazuje a tvoří mraky. Zamysli se, co by se dělo ve vzduchu, který se pohybuje opačným směrem, a jestli z něj může vzniknout déšť.",
    ],
    explanation: "U obratníků vzduch klesá k zemi, ohřívá se a vysušuje se. Mraky tam vznikají jen výjimečně, a proto tam téměř neprší. Tak vznikla Sahara u obratníku Raka. Podobně leží u obratníku Kozoroha Namib, kde sucho ještě zesiluje studený Benguelský proud u pobřeží.",
  },
  {
    q: "Která velká řeka teče přes Saharu a v jejím údolí je pás zeleně a polí?",
    key: "Nil",
    d: [
      ["Kongo", "Kongo teče deštným lesem u rovníku, ne přes poušť."],
      ["Niger", "Niger teče v západní Africe a k poušti se jen přibližuje, neprotéká ji."],
      ["Zambezi", "Zambezi teče na jihu Afriky a poušť neprotéká."],
    ],
    hints: [
      "Hledej řeku, která pramení daleko od pouště a přitéká do ní z místa, kde prší.",
      "Řeka v poušti nemůže mít pramen v poušti. Vzpomeň si, která africká řeka teče od rovníku směrem na sever.",
    ],
    explanation: "Přes Saharu teče Nil. Vodu dostává z deštivých oblastí u rovníku, proto v poušti nevyschne a její údolí je zelené a úrodné.",
  },
  {
    q: "Proč má řeka Kongo vody dost po celý rok a nikdy nevyschne?",
    key: "Teče rovníkovou oblastí, kde prší velmi často a voda se doplňuje.",
    d: [
      ["Pramení v ledovcích na Kilimandžáru a v létě z nich taje voda.", "Kongo na Kilimandžáru nepramení; ledovec tam je jen malý. Vodu dodávají deště."],
      ["Teče pouští, kde se koryto po každé bouři doplní z oáz.", "Kongo pouští neteče. Vodu má z deště, který padá v jeho povodí velmi často."],
      ["Do moře se vlévá tak pomalu, že se voda v korytě zdrží celý rok.", "Rychlost toku množství vody neurčuje. Rozhoduje, kolik vody do řeky dopadne v podobě deště."],
    ],
    hints: [
      "Zeptej se, kolik vody do řeky přibude a odkud — ne, jak rychle teče.",
      "Kongo teče územím, kterým prochází rovník. Zamysli se nad tím, jak často tam prší, a co to dělá s vodou v korytě.",
    ],
    explanation: "Kongo teče rovníkovou Afrikou, kde prší velmi často. Řeka se stále doplňuje vodou z dešťů, takže nikdy nevyschne a je jednou z nejvodnatějších řek světa.",
  },
  {
    q: "Obří zlom zemské kůry v Africe, u kterého vznikly sopky a dlouhá úzká jezera Tanganika a Malawi, se jmenuje…",
    key: "Východoafrický příkop",
    d: [
      ["pohoří Drakensberky", "Drakensberky jsou pohoří na jihovýchodě Afriky, ne zlom zemské kůry, u kterého leží úzká jezera."],
      ["pohoří Atlas", "Atlas je pohoří na severozápadě Afriky, daleko od jezer Tanganika a Malawi."],
      ["pánev řeky Kongo", "Pánev Konga je rozlehlá nížina uprostřed rovníkové Afriky, ne zlom zemské kůry."],
    ],
    hints: [
      "Hledej útvar, který je propadlinou v zemské kůře, ne pohořím ani nížinou kolem řeky.",
      "Kolem zlomu, kde se kůra láme a jedna část se vzdaluje od druhé, vznikají sopky a dlouhá úzká jezera. Ptej se, který útvar to je.",
    ],
    explanation: "Východoafrický příkop je obří zlom, kde se zemská kůra láme a rozestupuje. V jeho blízkosti vznikly sopky (například Kilimandžáro) a podél něj leží dlouhá úzká jezera, například Tanganika a Malawi.",
  },
  {
    q: "Loď z Evropy pluje do Indického oceánu a nechce obeplouvat celou Afriku. Kudy může cestu zkrátit?",
    key: "Průplavem přes Suezskou šíji ze Středozemního do Rudého moře.",
    d: [
      ["Gibraltarským průlivem, který vede přímo do Indického oceánu.", "Gibraltarský průliv vede z Atlantiku do Středozemního moře, ne do Indického oceánu."],
      ["Po řece Nil přes Saharu až k východnímu pobřeží Afriky.", "Nil teče na sever do Středozemního moře a nedostane se k Indickému oceánu."],
      ["Přes Viktoriino jezero, které spojuje oba oceány.", "Viktoriino jezero leží uprostřed světadílu a s oceány je nespojuje."],
    ],
    hints: [
      "Hledej místo, kde se Afrika a Asie dotýkají úzkým pruhem souše; tam se dá vést průplav.",
      "Loď potřebuje spojení mezi Středozemním mořem a mořem, které vede do Indického oceánu. Přemýšlej, kde se Afrika dotýká Asie.",
    ],
    explanation: "Suezský průplav prorývá Suezskou šíji a spojuje Středozemní a Rudé moře. Lodě z Evropy tak nemusejí obeplouvat celou Afriku.",
  },
  {
    q: "Jaký podnebný pás mají severní pobřeží u Středozemního moře a nejjižnější cíp Afriky?",
    key: "subtropický pás",
    d: [
      ["rovníkový pás", "Rovníkový pás leží kolem rovníku. Obě místa jsou od něj velmi daleko."],
      ["tropický pás", "Tropický pás leží blíž k rovníku, zhruba mezi 15° a 30° šířky, kde jsou pouště. Obě místa leží od rovníku ještě dál."],
      ["mírný pás", "Mírný pás leží ještě dál od rovníku, u nás; Afrika k němu nedosahuje."],
    ],
    hints: [
      "Oba kraje leží na opačných koncích Afriky, každý od rovníku hodně daleko (přes 30° šířky). Rozhoduj podle vzdálenosti od rovníku.",
      "Pásy jdou od rovníku ven v pořadí: rovníkový, subekvatoriální, tropický a dál další pás. Hledej ten, který následuje až za pásem pouští.",
    ],
    explanation: "Sever i nejjižnější cíp leží asi 35° od rovníku, tedy dál než asi 30°. To je subtropický pás s horkými suchými léty a mírnou zimou.",
  },
  {
    q: "Jaký pás navazuje na rovníkový pás Afriky na sever i na jih?",
    key: "subekvatoriální pás",
    d: [
      ["tropický pás", "Tropický pás s pouštěmi leží až za ním, kolem obratníků. Hned u rovníkového pásu ještě není."],
      ["subtropický pás", "Subtropický pás leží ještě dál, zhruba za 30° šířky, u pobřeží Středozemního moře a u jižního cípu."],
      ["mírný pás", "Mírný pás leží ještě dál, v Africe se skoro nevyskytuje."],
    ],
    hints: [
      "Pásy se za rovníkovým řadí ve směru od rovníku k pólům; hledej první z nich, hned za rovníkovým.",
      "V tomto pásu už neprší celý rok: střídá se období dešťů a období sucha a rostou tam savany. Poušť je až dál od rovníku.",
    ],
    explanation: "Za rovníkovým pásem následuje na sever i na jih subekvatoriální pás (zhruba do 15° od rovníku). Střídá se v něm období dešťů a sucha, rostou tam savany. Pouště jsou až za ním, v tropickém pásu.",
  },
  {
    q: "Afrika má málo členité pobřeží, jen málo zálivů a poloostrovů. Co z toho plyne?",
    key: "Přírodních přístavů je málo a vnitrozemí leží daleko od moře.",
    d: [
      ["Moře zasahuje hluboko do světadílu, takže je vlhko skoro všude.", "Členité pobřeží by moře do vnitrozemí zavedlo. Afrika ho má hladké, proto je rozlehlé vnitrozemí od moře daleko."],
      ["Světadíl je rozdělený na několik oddělených ostrovů.", "Afrika je souvislý světadíl; málo členité pobřeží znamená právě opak, celistvý tvar."],
      ["Na pobřeží vznikly rozlehlé fjordy, které chrání lodě před vlnami.", "Fjordy vznikly v chladných krajích po ledovcích. V Africe žádné ledovce na pobřeží nebyly."],
    ],
    hints: [
      "Přemýšlej, co dělá zátoka nebo poloostrov: dává lodím útočiště a přibližuje moře k vnitrozemí.",
      "Když je pobřeží hladké, nemá skoro žádné zálivy a moře nezasahuje do světadílu. Rozhodni, co z toho plyne pro přístavy a pro vzdálenost vnitrozemí od moře.",
    ],
    explanation: "U málo členitého pobřeží je málo zálivů, ve kterých by loď mohla přistát. Světadíl je celistvý a velké vnitrozemí leží daleko od moře.",
  },
];

const faktL2 = (): PracticeTask | null => fakt(pick(BANKA_L2));

// ── L3: přenos ─────────────────────────────────────────────────────────────

/** L3a: podnebí popsané slovy → souřadnice místa. */
const POPISY: Record<Pas, string[]> = {
  eq: [
    "celoročně horko, skoro každé odpoledne prudký liják a žádné suché období",
    "po celý rok stejně teplo, vlhký vzduch a deště v každém měsíci",
    "vedro po celý rok, časté bouřky a vlhko i v nejsušším měsíci",
  ],
  se: [
    "celoročně horko, ale střídají se dvě období: několik měsíců sucha a pak deště",
    "teploty stále vysoké; půl roku téměř neprší a pak přicházejí vydatné deště",
  ],
  tr: [
    "ve dne žár, v noci citelné ochlazení a srážky jen výjimečně, často několik let bez deště",
    "extrémní sucho, skoro bezoblačné nebe, přes den vedro a déšť jen občas",
  ],
  sub: [
    "léta horká, zimy chladnější, ale ne mrazivé, teploty se během roku znatelně mění",
    "v zimě citelně chladněji, v létě horko, teploty se během roku znatelně mění",
  ],
};

/** Souřadnice mimo Afriku: střední Evropa (hranice Afriky je asi 37° s. š.). */
const mimoAfriku = () => `${sirka(rnd(46, 52))}, ${delka(rnd(5, 25))}`;

const FEEDBACK_POPIS: Record<Pas | "out", string> = {
  eq: "Blízko rovníku je celoročně horko a vlhko, prší velmi často a suché období tam nebývá.",
  se: "V subekvatoriálním pásu je stále horko, ale střídá se období sucha a období dešťů.",
  tr: "V tropickém pásu je většinou sucho a leží tam pouště; srážky jsou jen výjimečné.",
  sub: "V subtropickém pásu jsou léta horká, zimy chladnější a mírné a teploty se přes rok znatelně mění.",
  out: "Tak daleko od rovníku Afrika nesahá — to už je střední Evropa s mírným podnebím.",
};

function popisSouradnice(pas: Pas): PracticeTask | null {
  const popis = pick(POPISY[pas]);
  const klic = souradniceTxt(bod(pas));
  // Dva sousední nebo vzdálenější pásy a bod mimo Afriku (z pásů jsou jen dva, aby zbylo místo na Evropu).
  const ds: Distractor[] = [
    ...shuffle(VSECHNY_PASY.filter((x) => x !== pas))
      .slice(0, 2)
      .map((p) => ({ value: souradniceTxt(bod(p)), why: FEEDBACK_POPIS[p] })),
    { value: mimoAfriku(), why: FEEDBACK_POPIS.out },
  ];
  return hlidej(
    choice(
      `Expedice zapsala o jednom místě v Africe: „${popis}“. Které souřadnice tomu místu nejspíš odpovídají?`,
      klic,
      ds,
      {
        hints: [
          "Zaměř se na to, jak se během roku mění teplota a srážky, a k tomu přiřaď vzdálenost od rovníku.",
          "Nejprve zjisti, jestli popis mluví o celoročním vedru s deštěm, o střídání sucha a dešťů, o trvalém suchu, nebo o citelné zimě. Podle toho odhadni, jak daleko od rovníku místo leží; délka údaj o pásu neurčuje.",
        ],
        explanation: `${FEEDBACK_POPIS[pas]} Takové podnebí patří do pásu „${PAS_NAZEV[pas]}“, a místo tedy leží ${pas === "eq" ? "jen několik stupňů" : pas === "se" ? "asi 5° až 15°" : pas === "tr" ? "asi 15° až 30°" : "víc než asi 30°"} od rovníku. Zeměpisná délka o pásu nerozhoduje.`,
      },
    ),
  );
}

/** L3b: let po jednom poledníku a čáry zeměpisné sítě, které překříží. */
interface Cara {
  lat: number;
  nazev: string;
  poloha: string;
}
const HR_OBRATNIK = 23.5;
const CARY: Cara[] = [
  { lat: -HR_OBRATNIK, nazev: "obratník Kozoroha", poloha: `${cis(HR_OBRATNIK)}° j. š.` },
  { lat: 0, nazev: "rovník", poloha: "0°" },
  { lat: HR_OBRATNIK, nazev: "obratník Raka", poloha: `${cis(HR_OBRATNIK)}° s. š.` },
];
/** Šířky letu: mezi 37° s. š. a 35° j. š., mimo hranice čar (aspoň 2° od nich). */
const LATS = [-33, -29, -26, -16, -11, -5, -3, 4, 7, 13, 19, 27, 30, 33];

const maska = (a: number, b: number): number => {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return CARY.reduce((m, c, i) => (c.lat > lo && c.lat < hi ? m | (1 << i) : m), 0);
};

function seznamCar(m: number): string {
  const jmena = CARY.filter((_, i) => m & (1 << i)).map((c) => c.nazev);
  if (jmena.length === 1) return `Překřížilo jen ${jmena[0]}`;
  if (jmena.length === 2) return `Překřížilo ${jmena[0]} i ${jmena[1]}`;
  return `Překřížilo ${jmena[0]}, ${jmena[1]} i ${jmena[2]}`;
}

function bity(m: number): number {
  return (m & 1) + ((m >> 1) & 1) + ((m >> 2) & 1);
}

function letadlo(): PracticeTask | null {
  const a = pick(LATS);
  const b = pick(LATS);
  if (Math.abs(a - b) < 6) return null;
  const klic = maska(a, b);
  if (klic === 0) return null;
  const sA = sirka(a);
  const sB = sirka(b);
  const nazvy = (m: number) => CARY.filter((_, i) => m & (1 << i));

  const kandidati = [1, 2, 3, 4, 5, 6, 7].filter((m) => m !== klic);
  const vzdalenost = (m: number) => bity(m ^ klic);
  const serazene = [
    ...shuffle(kandidati.filter((m) => vzdalenost(m) === 1)),
    ...shuffle(kandidati.filter((m) => vzdalenost(m) > 1)),
  ].slice(0, 3);

  const ds: Distractor[] = serazene.map((m) => {
    const chybi = CARY.filter((_, i) => klic & (1 << i) && !(m & (1 << i)));
    const navic = CARY.filter((_, i) => m & (1 << i) && !(klic & (1 << i)));
    const cast: string[] = [];
    for (const c of chybi) {
      cast.push(`Mezi ${sA} a ${sB} leží čára „${c.nazev}“ (${c.poloha}), takže ji let překříží.`);
    }
    for (const c of navic) {
      cast.push(`Čára „${c.nazev}“ (${c.poloha}) leží mimo úsek od ${sA} do ${sB}, let ji tedy nepřekříží.`);
    }
    return { value: seznamCar(m), why: cast.join(" ") };
  });

  const vyhodnoceni = CARY.map(
    (c, i) => `${c.nazev} (${c.poloha}): ${klic & (1 << i) ? "leží mezi začátkem a koncem letu" : "neleží mezi začátkem a koncem letu"}`,
  );

  return hlidej(
    choice(
      `Letadlo vzlétlo na ${sA} a přistálo na ${sB} (celou cestu letělo po jednom poledníku). Které čáry zeměpisné sítě při letu překřížilo?`,
      seznamCar(klic),
      ds,
      {
        hints: [
          "Vypiš si zeměpisné šířky tří významných čar a zkontroluj, které z nich leží mezi začátkem a koncem letu.",
          `Rovník má 0°, oba obratníky ${cis(HR_OBRATNIK)}° (jižní na jihu, severní na severu). Úsek letu vymezují dvě zadané šířky — vše mezi nimi letadlo překříží, vše mimo ne.`,
        ],
        explanation: `Úsek letu vymezují šířky ${sA} a ${sB}, a letadlo proto překříží ty z čar (obratník Kozoroha ${cis(HR_OBRATNIK)}° j. š., rovník 0°, obratník Raka ${cis(HR_OBRATNIK)}° s. š.), jejichž šířka leží mezi nimi: ${nazvy(klic).map((c) => c.nazev).join(", ")}.`,
        solutionSteps: [
          `Úsek letu: od ${sA} do ${sB}`,
          `Šířky čar: obratník Kozoroha ${cis(HR_OBRATNIK)}° j. š., rovník 0°, obratník Raka ${cis(HR_OBRATNIK)}° s. š.`,
          `Zkontroluj každou čáru: ${vyhodnoceni.join("; ")}.`,
        ],
      },
    ),
  );
}

/** L3c: chybná tvrzení a příčiny — banka. */
interface Tvrzeni {
  tv: string;
  key: string;
  d: [string, string][];
  hints: [string, string];
  explanation: string;
}

const tvrzeni = (t: Tvrzeni): PracticeTask | null =>
  hlidej(
    choice(
      `Žák napsal do sešitu: „${t.tv}“ V čem je jeho chyba?`,
      t.key,
      t.d.map(([value, why]): Distractor => ({ value, why })),
      { hints: t.hints, explanation: t.explanation },
    ),
  );

const BANKA_TVRZENI: Tvrzeni[] = [
  {
    tv: "Afrika je horká, protože je ze všech světadílů nejblíž ke Slunci.",
    key: "Vzdálenost od Slunce nerozhoduje; horko dělá vysoké Slunce nad tropy.",
    d: [
      ["Afrika leží na jižní polokouli, a proto je v ní celý rok léto.", "Afrika leží na obou polokoulích, rovník ji dělí na dvě části. Roční doby se navíc střídají na každé polokouli."],
      ["Horko je jen na Sahaře, zbytek Afriky je chladný jako Evropa.", "Velká část Afriky leží mezi obratníky a je horká. Chladněji bývá jen ve vysokých horách."],
      ["Slunce svítí na Afriku déle než na ostatní světadíly, protože se kolem ní otáčí.", "Slunce se kolem žádného světadílu neotáčí. Rozhoduje výška Slunce nad obzorem, ne délka osvětlení."],
    ],
    hints: [
      "Rozmysli, jestli se vzdálenost od Slunce mezi světadíly nějak výrazně liší, a co doopravdy určuje teplo.",
      "Země je od Slunce všude prakticky stejně daleko. Zeptej se místo toho, pod jakým úhlem paprsky dopadají v tropech a co to znamená pro ohřev země.",
    ],
    explanation: "Vzdálenost od Slunce je pro všechny světadíly prakticky stejná. Afrika je horká, protože její velká část leží mezi obratníky, kde Slunce stojí po celý rok vysoko a paprsky dopadají téměř kolmo.",
  },
  {
    tv: "Na rovníku prší málo, protože je tam nejteplejší a voda se rychle odpaří.",
    key: "Voda stoupá, tvoří mraky a padá jako déšť, proto tam prší hodně.",
    d: [
      ["Na rovníku vůbec neprší, protože tam vane suchý vítr od Sahary.", "Na rovníku prší velmi často. Suchý vítr vane spíš u obratníku, kde poušť vzniká."],
      ["Na rovníku je nejchladněji ze všech míst na Zemi, a proto tam prší nejvíc.", "U rovníku je naopak nejteplejší. Prší tam proto, že se ohřátý vlhký vzduch zvedá a tvoří mraky."],
      ["Voda se sice odpaří, ale nad rovníkem se pak sráží až na sníh a led.", "Sníh vzniká jen ve velké výšce a v mrazu. U rovníku prší, sníh leží jen na několika nejvyšších horách."],
    ],
    hints: [
      "Vzpomeň si, co se děje s vodní párou ve vzduchu, který se ohřívá a stoupá.",
      "Voda z lesů, řek i moře jde nahoru, kde se ochlazuje. Zamysli se, co se stane s párou v chladné výšce a proč to zamezí, aby voda zmizela.",
    ],
    explanation: "Voda, která se u rovníku vypaří, nezmizí. Vzduch stoupá, ochlazuje se a pára se sráží na mraky, ze kterých padá déšť. Proto je u rovníku vlhko a prší velmi často.",
  },
  {
    tv: "Největší pouště leží u rovníku, protože je tam nejvíc slunečního záření.",
    key: "Pouště leží u obratníků, kde vzduch klesá; u rovníku stoupá a prší.",
    d: [
      ["Pouště leží u rovníku, ale zeleň tam mizí, protože lidé kácejí les.", "Deštný les u rovníku vzniká přirozeně, poušť tam není, protože prší."],
      ["Největší pouště jsou u pobřeží, protože moře vysušuje vzduch.", "Moře vzduch naopak zvlhčuje. Pouště vznikají tam, kde klesá suchý vzduch."],
      ["Pouště vznikají jen tam, kde je málo slunečního záření a bývá zima.", "Poušť je suchá, ne nutně studená. Sahara patří k nejžhavějším místům světa."],
    ],
    hints: [
      "Neptej se, kde je nejvíc záření, ale kde je málo srážek, a hledej, jak se vzduch pohybuje.",
      "U rovníku vzduch stoupá a tvoří mraky, u obratníků klesá a vysušuje se. Rozhodni, kde tedy pouště spíš vznikají.",
    ],
    explanation: "Pouště nevznikají tam, kde je nejvíc záření, ale tam, kde je málo srážek. U rovníku vzduch stoupá a prší, u obratníků klesá suchý vzduch — proto tam leží Sahara i Namib.",
  },
  {
    tv: "Místo na 12° s. š. leží v rovníkovém pásu, protože je to blízko rovníku.",
    key: "Rovníkový pás sahá jen asi 5° od rovníku; 12° už je pás subekvatoriální.",
    d: [
      ["Chyba je v polokouli: 12° s. š. je jižní šířka, a proto místo do rovníkového pásu nepatří.", "Zkratka s. š. znamená severní šířku, místo tedy leží na severní polokouli. Chyba je jinde: v tom, jak daleko od rovníku rovníkový pás sahá."],
      ["Místo leží v tropickém pásu, protože tropický pás začíná hned za rovníkem.", "Za rovníkovým pásem následuje nejdřív subekvatoriální pás; tropický pás začíná až asi 15° od rovníku."],
      ["Rovníkový pás se určuje podle zeměpisné délky, ne podle šířky.", "Pásy určuje vzdálenost od rovníku, tedy zeměpisná šířka. Zeměpisná délka pás neurčuje."],
    ],
    hints: [
      "Zjisti, kolik stupňů od rovníku místo leží, a porovnej to s hranicemi pásů.",
      "Zjednodušeně: rovníkový pás končí asi 5° od rovníku a další pás sahá zhruba do 15°. Rozhodni, kam patří 12°.",
    ],
    explanation: "Pás určuje vzdálenost od rovníku. Místo na 12° s. š. je od rovníku dál než asi 5°, proto už neleží v rovníkovém pásu, ale v subekvatoriálním, kde se střídá období dešťů a sucha.",
  },
];

const tvrzeniL3 = (): PracticeTask | null => tvrzeni(pick(BANKA_TVRZENI));

/** L3d: jednotlivé případy s příčinou. */
const BANKA_L3: Fakt[] = [
  {
    q: "Fotograf stojí na 3° j. š., tedy hned u rovníku, a fotí vrchol hory ve východní Africe pokrytý sněhem. Čím to je?",
    key: "S výškou přibývá chladu, a tak sníh leží i u rovníku.",
    d: [
      ["V okolí rovníku sněží po celý rok stejně husto jako v polárních krajích.", "U rovníku je horko a prší, sníh leží jen na několika nejvyšších vrcholech."],
      ["Sníh sem každoročně přivane vítr od jižního pólu přes Indický oceán.", "Sníh nevzniká v dálce a nepřivane se. Vzniká ve výšce, kde je dostatečný mráz."],
      ["Slunce u rovníku nesvítí kolmo, a proto tam je na horách i dole stále zima.", "U rovníku svítí Slunce vysoko nad obzorem a je tam horko. Zima je až ve velké nadmořské výšce."],
    ],
    hints: [
      "Blízko rovníku je dole horko. Zamysli se, co se s teplotou děje, když stoupáš do vyšších poloh.",
      "Neptej se, jak silně svítí Slunce, ale jak vysoko nad mořem hora stojí. Čím výš stoupáš, tím víc chladu a méně tepla.",
    ],
    explanation: "Na vysokých horách je chladněji než na úpatí, i když Slunce svítí vysoko. Proto je na nejvyšší hoře Afriky i u rovníku sníh, zatímco pod ní je horko a vlhko.",
  },
  {
    q: "Studentka se diví: poušť Namib leží těsně u Atlantského oceánu, a přesto v ní skoro neprší. Čím to je?",
    key: "Leží u obratníku, kde vzduch klesá, a studený Benguelský proud mraky nepřináší.",
    d: [
      ["Moře je u pobřeží příliš slané, a proto se z něj nevytvářejí mraky.", "Slanost mraky nebrání: voda se odpařuje i ze slaného moře. Sucho Namibu dělá poloha u obratníku a studený proud."],
      ["Namib leží na rovníku, kde je nejvíc záření, a voda se tam hned odpaří.", "Namib leží u obratníku Kozoroha (asi 23,5° j. š.), ne na rovníku. Na rovníku vzduch stoupá a prší."],
      ["Atlantik je u Namibu teplý a vlhkost z něj se hned odpaří.", "U pobřeží Namibu je oceán naopak studený (Benguelský proud). Nad studenou vodou mraky prakticky nevznikají."],
    ],
    hints: [
      "Namib je poušť, přestože leží u moře. Zjisti, u které významné čáry leží a jaké je moře u jeho pobřeží.",
      "Poušť vzniká tam, kde vzduch klesá a chybí mraky. U pobřeží Namibu k tomu přispívá i oceán: proud tam je studený, a vzduch nad ním se proto neohřívá tak, aby vznikaly mraky.",
    ],
    explanation: "Namib leží u obratníku Kozoroha, kde klesá suchý vzduch. K tomu přispívá studený Benguelský proud, který ochlazuje vzduch nad mořem, takže se tvoří jen málo mraků. Pobřeží proto zůstává téměř bez deště, přestože je hned u oceánu.",
  },
  {
    q: "Rodina z Česka letí na Vánoce do města na 34° j. š. na jihu Afriky. Jaké roční období tam bude?",
    key: "Léto, protože jižní polokoule má roční doby opačné než Česko.",
    d: [
      ["Zima s mrazy, protože město leží daleko od rovníku a v prosinci je zima všude.", "Vzdálenost od rovníku sama nerozhoduje: na jižní polokouli jsou roční doby opačné než u nás a v prosinci tam začíná léto."],
      ["Stejné počasí jako doma, protože roční doby jsou na celé Zemi ve stejnou dobu stejné.", "Na severní a jižní polokouli se roční doby střídají opačně: když je u nás zima, je na jihu léto."],
      ["Celoroční vedro a denní lijáky, protože celá Afrika leží v rovníkovém pásu.", "V rovníkovém pásu leží jen malá část Afriky kolem rovníku. Město na 34° j. š. je od rovníku daleko a roční doby tam jsou."],
    ],
    hints: [
      "Zjisti, na které polokouli místo leží, a zeptej se, jestli se tam období střídají stejně jako u nás.",
      "Písmena j. š. znamenají jižní polokouli. Zvaž, jaké období je u nás v prosinci, a pak jak se období střídají na jižní polokouli vůči severní.",
    ],
    explanation: "Šířka 34° j. š. je jižní šířka, město tedy leží na jižní polokouli. Tam jsou roční doby opačné než na severní: když je v Česku v prosinci zima, je na jihu Afriky léto.",
  },
  {
    q: "Studentka zjistila, že velká část území Afriky patří k nejteplejším místům světa. Které zdůvodnění je správné?",
    key: "Většina území leží mezi obratníky, kde po celý rok stojí Slunce vysoko.",
    d: [
      ["Afrika je ze všech světadílů nejblíž ke Slunci, a proto tam mrzne jen výjimečně.", "Vzdálenost od Slunce se mezi světadíly téměř neliší. Rozhoduje výška Slunce nad obzorem."],
      ["Afriku obklopují jen teplé oceány, které ji celou ohřívají i uprostřed světadílu.", "Oceán Afriku ohřívá jen u pobřeží. Horko dělá výška Slunce a poloha v tropech."],
      ["Většinu Afriky pokrývají pouště, které se rozpalují hlavně kvůli písku.", "Většinu Afriky pouště nepokrývají a poušť není horká kvůli písku, ale kvůli suchému vzduchu a Slunci."],
    ],
    hints: [
      "Zamysli se, jak leží Afrika vůči rovníku a obratníkům a jak vysoko tam stojí Slunce.",
      "Porovnej velikost oblasti mezi obratníky s celou plochou světadílu. Čím víc území leží v pásu s vysokým Sluncem, tím větší část je horká.",
    ],
    explanation: "Afrika je rozlehlá a rovník ji protíná uprostřed. Většina jejího území leží mezi obratníky, kde Slunce po celý rok stojí vysoko, a proto je většina světadílu horká.",
  },
  {
    q: "Nil pramení v oblastech blízko rovníku a pak teče stovky kilometrů pouští na severu, a přesto se do moře dostane. Čím to je?",
    key: "Pramení u rovníku, kde hodně prší, a přináší víc vody, než poušť vypaří.",
    d: [
      ["V poušti pravidelně po celý rok silně prší a deště řeku stále doplňují.", "V poušti prší minimálně; vodu přináší řeka zvenčí, z deštivých oblastí u pramenů."],
      ["Řeku v poušti doplňuje voda z moře, která proudí zpět do jejího koryta.", "Nil teče od pramenů k moři, ne opačně. Moře do koryta vodu nepřivádí."],
      ["Vodu Nilu v poušti doplňují ledovce, které leží na horách uprostřed Sahary.", "V Sahaře je horko a ledovce tam nejsou. Voda pochází z dešťů v oblastech pramenů."],
    ],
    hints: [
      "Zeptej se, odkud se voda v řece bere a jestli poušť sama nějakou přidává.",
      "Poušť řece vodu ubírá, protože se odpařuje a vsakuje. Přemýšlej, jak velký přísun musí přijít zvenčí, aby řeka přesto dotekla k moři.",
    ],
    explanation: "Nil pramení v deštivých oblastech u rovníku a v horách východní Afriky. Přináší tolik vody, že ji poušť nestačí vysušit, a řeka proto vytváří v Sahaře úrodný pruh a dotéká až do Středozemního moře.",
  },
];

const faktL3 = (): PracticeTask | null => fakt(pick(BANKA_L3));

/** L3e: cesta po jednom poledníku — který pás leží uprostřed mezi začátkem a koncem. */
const CESTA_SIRKY: Record<Pas, number[]> = { eq: [2, 3], se: [9, 11], tr: [20, 24, 26], sub: [32, 33] };
const CESTA_DVOJICE: [number, number][] = [[0, 2], [2, 0], [1, 3], [3, 1]];
const kratky = (p: Pas) => PAS_NAZEV[p];

function cesta(): PracticeTask | null {
  const [i, j] = pick(CESTA_DVOJICE);
  const stred = VSECHNY_PASY[(i + j) / 2];
  const prvni = VSECHNY_PASY[i];
  const posledni = VSECHNY_PASY[j];
  const mimo = VSECHNY_PASY.find((_, k) => k !== i && k !== j && k !== (i + j) / 2)!;
  const jih = Math.random() < 0.5;
  const la = pick(CESTA_SIRKY[prvni]);
  const lb = pick(CESTA_SIRKY[posledni]);
  const sA = sirka(jih ? -la : la);
  const sB = sirka(jih ? -lb : lb);

  return hlidej(
    choice(
      `Karavana putovala po jednom poledníku od ${sA} do ${sB} — který podnebný pás leží mezi pásem na začátku a pásem na konci cesty?`,
      kratky(stred),
      [
        { value: kratky(prvni), why: `Pás „${kratky(prvni)}“ leží na začátku cesty (${sA}), ne mezi začátkem a koncem.` },
        { value: kratky(posledni), why: `Pás „${kratky(posledni)}“ leží na konci cesty (${sB}), ne mezi začátkem a koncem.` },
        { value: kratky(mimo), why: `Pás „${kratky(mimo)}“ leží mimo úsek od ${sA} do ${sB}, na trase vůbec není.` },
      ],
      {
        hints: [
          "Zjisti pro obě šířky, do kterého pásu patří, a pak si představ, kterým pásem se jde z jednoho místa do druhého.",
          `${HINT_PASY} Pásy se řadí za sebou podle vzdálenosti od rovníku a žádný nelze přeskočit.`,
        ],
        explanation: `Šířka ${la}° leží v pásu „${kratky(prvni)}“ a ${lb}° v pásu „${kratky(posledni)}“. Pásy jdou od rovníku ven jeden za druhým, takže mezi nimi karavana prošla pásem „${kratky(stred)}“.`,
        solutionSteps: [
          `Hranice pásů (zjednodušeně): ${HRANICE_TXT}.`,
          `Šířka ${la}° patří do pásu „${kratky(prvni)}“ a ${lb}° do pásu „${kratky(posledni)}“.`,
          `Mezi těmito dvěma pásy leží podle pořadí od rovníku pás „${kratky(stred)}“.`,
        ],
      },
    ),
  );
}

const cestaL3 = (): PracticeTask | null => cesta();
const bankaL3 = (): PracticeTask | null => {
  const r = Math.random();
  return r < 0.4 ? tvrzeniL3() : r < 0.8 ? faktL3() : losUlohy(cestaL3);
};

// ── Skladba sezení ─────────────────────────────────────────────────────────

/**
 * Sezení = PRVNÍCH `sessionTaskCount` úloh poolu (`generateMockBatch` pool jen
 * ořízne). Zamíchat celý pool nestačí: dvojice blízkých úloh se sejde v jedné
 * šestici a druhá se pak řeší vyloučením. Výlučnost se proto hlídá v úvodní
 * šestici — zbytek poolu zůstává úplný, ať se při dalším sezení dostane na vše.
 */
type Skupiny = [RegExp, string][];

const skupinaPodle = (tabulka: Skupiny) => (t: PracticeTask): string | null =>
  tabulka.find(([r]) => r.test(t.question))?.[1] ?? null;

/** Úlohy ze stejné skupiny nad limit odsune za hranici sezení (pořadí jinak zachová). */
function omezSezeni(
  pool: PracticeTask[],
  kolik: number,
  skupina: (t: PracticeTask) => string | null,
  limity: Record<string, number> = {},
): PracticeTask[] {
  const pouzito = new Map<string, number>();
  const sezeni: PracticeTask[] = [];
  const zbytek: PracticeTask[] = [];
  for (const t of pool) {
    const g = skupina(t);
    const max = g ? (limity[g] ?? 1) : Infinity;
    if (sezeni.length < kolik && (!g || (pouzito.get(g) ?? 0) < max)) {
      if (g) pouzito.set(g, (pouzito.get(g) ?? 0) + 1);
      sezeni.push(t);
    } else {
      zbytek.push(t);
    }
  }
  return [...sezeni, ...zbytek];
}

const SKUPINY_L1: Skupiny = [
  // obě klíče jsou moře kolem Afriky, druhá se pak řeší vyloučením
  [/^Který oceán omývá/, "oceany"],
  [/^Které moře|Suezská šíje/, "sousedi"],
  // dvakrát „který obratník“ se stejnou trojicí distraktorů
  [/^Který obratník/, "obratniky"],
  // čtyři otázky „kde leží pohoří / vysočina“ se stejnou skladbou
  [/pohoří Atlas|Drakensberky|Etiopská vysočina/, "poloha_hor"],
  [/řeka Kongo|Viktoriino jezero/, "poloha_vody"],
  [/řeka Nil|Nilská delta/, "nil"],
];

const SKUPINY_L2: Skupiny = [
  [/Kongo|Proč je v okolí rovníku|Proč leží největší pouště/, "priciny"],
  [/pobřeží u Středozemního moře|navazuje na rovníkový pás/, "pasy"],
  [/přes Saharu a v jejím údolí|Řeka Nil/, "nil"],
];

const SKUPINY_L3: Skupiny = [
  // dvě tvrzení se stejnou stavbou (výrok → chyba) nejvýš dvakrát
  [/^Žák napsal/, "tvrzeni"],
];

// ── Generátor ──────────────────────────────────────────────────────────────

const PASY: Pas[] = VSECHNY_PASY;

function gen(level: number): PracticeTask[] {
  if (level === 1) {
    return omezSezeni(ruzneUlohy(() => losUlohy(faktL1)), 6, skupinaPodle(SKUPINY_L1));
  }

  if (level === 2) {
    // Do sezení jdou právě dvě souřadnicové úlohy (pás a polokoule + pás),
    // každá z jiného pásu; zbylé úlohy jsou příčiny a použití poznatků.
    const [p0, p1, p2] = shuffle(PASY);
    const doSezeni = [
      losUlohy(() => pasZeSouradnic(p0)),
      losUlohy(() => polokouleAPas(p1)),
    ];
    const zaloha = [
      losUlohy(() => pasZeSouradnic(p1)),
      losUlohy(() => pasZeSouradnic(p2)),
      losUlohy(() => polokouleAPas(p0)),
      losUlohy(() => polokouleAPas(p2)),
    ];
    const nil = losUlohy(nilSmer);
    const fakta = omezSezeni(
      shuffle([nil, ...ruzneUlohy(() => losUlohy(faktL2), 24)]),
      4,
      skupinaPodle(SKUPINY_L2),
      { priciny: 2 },
    );
    return [
      ...shuffle([...doSezeni, ...fakta.slice(0, 4)]),
      ...shuffle([...fakta.slice(4), ...zaloha]),
    ];
  }

  // L3
  const [p0, p1, p2] = shuffle(PASY);
  const popisy = [p0, p1, p2].map((p) => losUlohy(() => popisSouradnice(p)));
  const lety = ruzneUlohy(() => losUlohy(letadlo), 4, 200);
  const banka = omezSezeni(ruzneUlohy(() => losUlohy(bankaL3), 24), 3, skupinaPodle(SKUPINY_L3), {
    tvrzeni: 2,
  });
  return [
    ...shuffle([popisy[0], lety[0], ...banka.slice(0, 3), popisy[1]]),
    ...shuffle([...banka.slice(3), ...popisy.slice(2), ...lety.slice(1)]),
  ];
}

// ── Topic ──────────────────────────────────────────────────────────────────
export const AFRIKA_POLOHA_POVRCH_VODSTVO_PODNEBI: TopicMetadata[] = [
  {
    id: "g6-zem-afrika-poloha-povrch-vodstvo-podnebi-6",
    rvpNodeId: "g6-zemepis-regiony-sveta-afrika-afrika-poloha-povrch-vodstvo-podnebi",
    displayName: "Poloha a podnebí Afriky",
    title: "Afrika - poloha, povrch, vodstvo, podnebí",
    studentTitle: "Kde leží Afrika a proč je tam horko",
    subject: "zemepis",
    category: "Regiony světa",
    topic: "Afrika",
    briefDescription: "Poloha Afriky, její hory, řeky a jezera a proč je v ní horko.",
    keywords: [
      "Afrika", "rovník", "obratník Raka", "obratník Kozoroha", "Sahara", "Nil", "Kongo",
      "Viktoriino jezero", "Atlas", "Kilimandžáro", "Východoafrický příkop", "rovníkový pás",
      "subekvatoriální pás", "tropický pás", "subtropický pás", "Suezská šíje",
    ],
    goals: [
      "Určit polohu Afriky vůči rovníku, obratníkům, oceánům a sousedním světadílům.",
      "Pojmenovat a umístit hlavní povrchové útvary, řeky a jezera Afriky.",
      "Podle souřadnic rozhodnout, ve kterém podnebném pásu místo leží.",
      "Vysvětlit příčinu, proč je u rovníku horko a vlhko a u obratníků leží pouště.",
    ],
    boundaries: [
      "Rovník 0°, obratníky 23,5° s. š. a j. š.; pásy (zjednodušeně): rovníkový do asi 5° od rovníku, subekvatoriální do asi 15°, tropický do asi 30°, dál subtropický.",
      "Přesná čísla (výška Kilimandžára, délka Nilu, pořadí nejdelších řek) se v klíči nepoužívají — jen umístění, řád a příčina.",
      "Vegetace, zvířata a hospodářství patří do tématu Africké přírodní oblasti — zde se neptáme.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Afriku protíná rovník uprostřed a obratníky na severu i na jihu. Podnebný pás určuje vzdálenost od rovníku (zjednodušeně): rovníkový do asi 5°, subekvatoriální do asi 15°, tropický do asi 30°, dál subtropický.",
      steps: [
        "U souřadnic nejdřív podle písmen za číslem urči polokouli (s. š. = severní, j. š. = jižní).",
        "Velikost šířky porovnej s hranicemi pásů: do asi 5° rovníkový, do 15° subekvatoriální, do 30° tropický, dál subtropický.",
        "U příčin si připomeň: u rovníku Slunce stojí vysoko a vzduch stoupá (déšť), u obratníků klesá (poušť).",
      ],
      commonMistake: "Myslet si, že horko v Africe dělá blízkost ke Slunci, nebo že pouště leží na rovníku; správně je to výška Slunce a klesající vzduch u obratníků.",
      example: "Místo na 3° s. š. je od rovníku jen 3°, a to je míň než 5°, tedy leží v rovníkovém pásu na severní polokouli.",
    },
  },
];
