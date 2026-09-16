/**
 * Přírodopis 6. ročník — Jedlé a jedovaté houby, pravidla sběru (select_one).
 *
 * Bezpečnostní téma. Jediné spolehlivé pravidlo: houbu, kterou bezpečně
 * neznám, netrhám a nejím. Mýty (stříbrná lžička, okousání slimákem, zničení
 * jedu vařením) se objevují jen jako vyvrácené distraktory.
 *
 * Chybový model:
 *  • za nejnebezpečnější houbu považuje nápadnou muchomůrku červenou,
 *  • věří lidovým testům jedovatosti (slimák, lžička, cibule, vaření),
 *  • splete muchomůrku zelenou se žampionem nebo holubinkou (bílé lupeny, pochva),
 *  • podcení příznaky otravy (počká, zůstane doma, zlepšení bere jako konec),
 *  • rozhodne správně „opatrně“, ale ze špatného důvodu (barva, stáří, jediný znak).
 *
 *  • L1 — jméno houby → jedlá / nejedlá (hořká) / jedovatá / smrtelně jedovatá.
 *  • L2 — modelová situace při sběru nebo po jídle → správný postup i důvod.
 *  • L3 — houba z popisu znaků, rozlišovací znak dvojice k záměně,
 *         rozhodující znak u nejistého případu, spojení znaku s nebezpečím.
 *
 * Generátor je deterministický: každá úroveň projde svou banku po řadě,
 * náhoda je jen v zamíchání nabídky (`buildChoiceTask`).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

interface Polozka {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

// ── L1: banka jmen ───────────────────────────────────────────────────────────
type Rod = "m" | "f";
interface Houba { jmeno: string; rod: Rod }

const H = {
  smrkovy: { jmeno: "hřib smrkový", rod: "m" },
  kremenac: { jmeno: "křemenáč osikový", rod: "m" },
  kozak: { jmeno: "kozák", rod: "m" },
  liska: { jmeno: "liška obecná", rod: "f" },
  bedla: { jmeno: "bedla vysoká", rod: "f" },
  zampion: { jmeno: "žampion", rod: "m" },
  vaclavka: { jmeno: "václavka obecná", rod: "f" },
  zelena: { jmeno: "muchomůrka zelená", rod: "f" },
  cervena: { jmeno: "muchomůrka červená", rod: "f" },
  tygrovana: { jmeno: "muchomůrka tygrovaná", rod: "f" },
  satan: { jmeno: "hřib satan", rod: "m" },
  zlucnik: { jmeno: "hřib žlučník", rod: "m" },
} satisfies Record<string, Houba>;

const velke = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Proč daná jedovatá nebo nejedlá houba není jedlá (šablona „Která je jedlá?“). */
const PROC_NEJEDLA: Record<string, string> = {
  [H.zelena.jmeno]: "Muchomůrka zelená je smrtelně jedovatá. Plete se s jedlými houbami, pozná se podle bílých lupenů a pochvy u spodku třeně.",
  [H.cervena.jmeno]: "Muchomůrka červená je jedovatá. Červený klobouk s bílými bradavkami je spíš varování než pozvánka do košíku.",
  [H.tygrovana.jmeno]: "Muchomůrka tygrovaná je jedovatá. Má prsten jako některé jedlé houby, proto se s nimi snadno splete.",
  [H.satan.jmeno]: "Hřib satan je jedovatý. Ne každá houba s rourkami je jedlá, satan má bělavý klobouk a červený baňatý třeň.",
  [H.zlucnik.jmeno]: "Hřib žlučník není jedlý. Je velmi hořký a jediný kousek zkazí celé jídlo.",
};

/** Proč houba není ta smrtelně jedovatá (šablony „smrtelně“ a „nejvíc otrav“). */
const PROC_NE_SMRTELNA: Record<string, string> = {
  [H.cervena.jmeno]: "Muchomůrka červená je jedovatá a hodně nápadná, ale nejvíc smrtelných otrav u nás způsobuje nenápadná muchomůrka zelená.",
  [H.tygrovana.jmeno]: "Muchomůrka tygrovaná je jedovatá, smrtelné otravy u nás ale způsobuje hlavně muchomůrka zelená.",
  [H.satan.jmeno]: "Hřib satan je jedovatý a způsobuje prudké zažívací potíže, smrtelné otravy ale u nás způsobuje hlavně muchomůrka zelená.",
  [H.zlucnik.jmeno]: "Hřib žlučník je nejedlý kvůli hořkosti, smrtelnou otravu ale nezpůsobuje.",
  [H.zampion.jmeno]: "Žampion je jedlý. Nebezpečný je jen tím, že se s ním plete smrtelně jedovatá muchomůrka zelená.",
  [H.bedla.jmeno]: "Bedla vysoká je jedlá. Houbaři ji ale musí dobře znát, protože se plete s jedovatými muchomůrkami.",
};

const KONTEXTY = [
  "Na výstavě hub leží vedle sebe několik vzorků.",
  "V atlasu hub si prohlížíš obrázky.",
  "Děda ti na vycházce ukazuje různé houby.",
  "Ve třídě visí plakát s houbami.",
  "V houbařské poradně leží na stole houby.",
  "Na kurzu pro mladé houbaře poznáváte houby.",
  "Babička ti ukazuje obrázky hub v kalendáři.",
  "Paní učitelka rozdala kartičky s houbami.",
];

const nazev = (h: Houba) => `„${h.jmeno}“`;

function smrtelna(i: number, d: [Houba, Houba]): Polozka {
  return {
    q: `${KONTEXTY[i % KONTEXTY.length]} Která z těchto hub je smrtelně jedovatá?`,
    correct: H.zelena.jmeno,
    distractors: [H.cervena, ...d].map((h) => ({ value: h.jmeno, why: PROC_NE_SMRTELNA[h.jmeno] })),
    hints: [
      `Rozděl si možnosti na jedlé, nejedlé a jedovaté. Kam patří ${nazev(d[0])} a kam ${nazev(d[1])}?`,
      `Smrtelné otravy způsobuje hlavně houba, kterou lidé spletou s jedlou, a zrádná bývá hlavně houba nenápadná. Posuď podle toho každou možnost, i ${nazev(d[1])}.`,
    ],
    explanation: "Smrtelně jedovatá je muchomůrka zelená. Je nenápadná, plete se se žampionem a u nás způsobuje nejvíc smrtelných otrav. Pozná se podle bílých lupenů, prstenu a pochvy u spodku třeně.",
  };
}

function nejvicOtrav(i: number, d: [Houba, Houba]): Polozka {
  return {
    q: `${KONTEXTY[i % KONTEXTY.length]} Která houba způsobuje u nás nejvíc smrtelných otrav?`,
    correct: H.zelena.jmeno,
    distractors: [H.cervena, ...d].map((h) => ({ value: h.jmeno, why: PROC_NE_SMRTELNA[h.jmeno] })),
    hints: [
      `Otrav je nejvíc u houby, kterou si lidé nejčastěji spletou s jedlou. Hodí se to na ${nazev(d[0])} nebo na ${nazev(d[1])}?`,
      `Nápadná houba lidi spíš varuje, nebezpečnější je ta, která vypadá obyčejně a podobá se žampionu. Zvaž podle toho i ${nazev(d[1])} a zbylé možnosti.`,
    ],
    explanation: "Nejvíc smrtelných otrav u nás způsobuje muchomůrka zelená. Vypadá nenápadně, lidé si ji pletou se žampionem a první příznaky otravy přicházejí až po mnoha hodinách.",
  };
}

function jedla(i: number, key: Houba, d: [Houba, Houba, Houba]): Polozka {
  return {
    q: `${KONTEXTY[i % KONTEXTY.length]} Která z těchto hub je jedlá?`,
    correct: key.jmeno,
    distractors: d.map((h) => ({ value: h.jmeno, why: PROC_NEJEDLA[h.jmeno] })),
    hints: [
      `U každé možnosti si vybav, jestli ji houbaři nosí domů. Víš, kam patří ${nazev(d[0])} a kam ${nazev(d[2])}?`,
      `Vybav si, které skupiny hub mají jedovaté nebo nejedlé zástupce a proč nestačí poznat jen rod. Posuď tak i ${nazev(d[1])} a ${nazev(d[2])}.`,
    ],
    explanation: `${velke(key.jmeno)} je jedlá houba, kterou houbaři běžně sbírají. Ostatní možnosti jsou jedovaté nebo nejedlé. Sbírat se ale smí jen houba, kterou bezpečně znáš.`,
  };
}

function doKosiku(i: number, key: Houba, d: [Houba, Houba, Houba]): Polozka {
  return {
    q: `${KONTEXTY[i % KONTEXTY.length]} Kterou z těchto hub do košíku nedáš, protože je jedovatá?`,
    correct: key.jmeno,
    distractors: d.map((h) => ({
      value: h.jmeno,
      why: `${velke(h.jmeno)} je jedlá houba. Houbař, který ji bezpečně pozná, ji do košíku dát může.`,
    })),
    hints: [
      `Která z možností se v atlasech objevuje s výstrahou? Zkus si to vybavit u každé, třeba u ${nazev(d[0])} a ${nazev(d[1])}.`,
      `Rozděl možnosti na houby z košíku a houby, které znáš z varování. Pak posuď i ${nazev(d[1])} a ${nazev(d[2])}.`,
    ],
    explanation: `${velke(key.jmeno)} je jedovatá houba, proto do košíku nepatří. Ostatní tři houby jsou jedlé, sbírá je ale jen ten, kdo je bezpečně pozná.`,
  };
}

function horka(i: number, d: [Houba, Houba, Houba]): Polozka {
  return {
    q: `${KONTEXTY[i % KONTEXTY.length]} Kterou z těchto hub houbaři nesbírají, protože je velmi hořká?`,
    correct: H.zlucnik.jmeno,
    distractors: d.map((h) => ({
      value: h.jmeno,
      why: `${velke(h.jmeno)} je jedlá houba a hořká není. Houbař, který ji bezpečně pozná, ji sbírat může.`,
    })),
    hints: [
      `Tři možnosti houbaři běžně nosí domů. Víš, jestli mezi ně patří ${nazev(d[0])}?`,
      `Hořká houba není jedovatá, ale jediný kousek zkazí celé jídlo. Vybav si, o které z možností to platí, a posuď ${nazev(d[1])} i ${nazev(d[2])}.`,
    ],
    explanation: "Hřib žlučník je nejedlý, protože je velmi hořký a zkazí celé jídlo. Jedovatý není. Ostatní tři houby jsou jedlé, sbírá je ale jen ten, kdo je bezpečně pozná.",
  };
}

const POOL_L1: Polozka[] = [
  smrtelna(0, [H.bedla, H.zampion]),
  jedla(0, H.smrkovy, [H.zlucnik, H.satan, H.cervena]),
  doKosiku(0, H.tygrovana, [H.zampion, H.bedla, H.vaclavka]),
  nejvicOtrav(0, [H.tygrovana, H.satan]),
  jedla(1, H.kremenac, [H.zlucnik, H.satan, H.tygrovana]),
  horka(0, [H.smrkovy, H.kozak, H.kremenac]),
  jedla(2, H.kozak, [H.zlucnik, H.satan, H.zelena]),
  doKosiku(1, H.cervena, [H.liska, H.bedla, H.kremenac]),
  smrtelna(1, [H.zlucnik, H.bedla]),
  jedla(3, H.liska, [H.cervena, H.tygrovana, H.satan]),
  doKosiku(2, H.satan, [H.smrkovy, H.kremenac, H.kozak]),
  horka(1, [H.kozak, H.smrkovy, H.kremenac]),
  jedla(4, H.bedla, [H.satan, H.zelena, H.tygrovana]),
  doKosiku(3, H.zelena, [H.zampion, H.kozak, H.kremenac]),
  jedla(5, H.zampion, [H.zelena, H.tygrovana, H.zlucnik]),
  jedla(6, H.vaclavka, [H.tygrovana, H.zelena, H.satan]),
  doKosiku(4, H.tygrovana, [H.zampion, H.smrkovy, H.vaclavka]),
  doKosiku(5, H.satan, [H.smrkovy, H.liska, H.zampion]),
  horka(2, [H.kremenac, H.kozak, H.smrkovy]),
  jedla(7, H.liska, [H.tygrovana, H.zlucnik, H.zelena]),
];

// ── L2: situace při sběru a po jídle ─────────────────────────────────────────
// Část distraktorů je „opatrná“, ale se špatným důvodem — nestačí vybrat
// nejopatrnější možnost, je potřeba znát pravidlo.
const POOL_L2: Polozka[] = [
  {
    q: "Na houbařské vycházce najdeš pěknou houbu, kterou vůbec neznáš. Co uděláš?",
    correct: "Nechám ji stát, neznámou houbu nesbírám",
    distractors: [
      { value: "Utrhnu ji a doma kousek ochutnám", why: "Ochutnávání neznámé houby je nebezpečné. Jedovaté houby často chutnají úplně obyčejně a nic neprozradí." },
      { value: "Nechám ji, hezké houby bývají jedovaté", why: "Vzhled o jedovatosti nerozhoduje, smrtelně jedovatá muchomůrka zelená vypadá nenápadně. Houbu necháš proto, že ji neznáš." },
      { value: "Seberu ji a povařím se stříbrnou lžičkou", why: "Test se stříbrnou lžičkou nefunguje. Lžička nezčerná ani v nejjedovatější houbě." },
    ],
    hints: [
      "Připomeň si jediné spolehlivé pravidlo houbaře: co udělat s houbou, kterou bezpečně neznáš?",
      "Žádný domácí test jedovatosti neexistuje a ochutnání může být osudné. Rozhodni se tedy už v lese, ne až doma v kuchyni.",
    ],
    explanation: "Houbu, kterou bezpečně neznáš, netrháš a nejíš. Žádná zkouška (lžička, slimák, chuť) jedovatost spolehlivě neodhalí a vzhled také ne, a proto neznámá houba zůstane v lese.",
  },
  {
    q: "Pod smrkem roste mladá houbička. Klobouk ještě nemá rozevřený a její znaky nejdou rozeznat pouhým okem ani s atlasem v ruce. Co s ní?",
    correct: "Nechám ji růst, takovou houbu bezpečně nepoznám",
    distractors: [
      { value: "Nechám ji, mladé houby jsou vždycky jedovaté", why: "Mladé houby nejsou jedovatější než dospělé. Necháš ji proto, že na ní ještě nejsou vidět rozlišovací znaky." },
      { value: "Vezmu ji a doma ochutnám kousek syrové dužniny", why: "Syrové houby z lesa se nejedí a ochutnávat neznámou houbu je nebezpečné." },
      { value: "Seberu ji, doma ji určím z atlasu i bez znaků", why: "Na nevyvinuté houbě ještě nejsou vidět rozlišovací znaky, takže ji spolehlivě neurčíš ani s atlasem." },
    ],
    hints: [
      "Co potřebuješ na houbě vidět, abys ji bezpečně poznal? Má tahle houbička ty znaky už vyvinuté?",
      "Porovnej, co bys na houbě potřeboval vidět, s tím, co vidíš teď.",
    ],
    explanation: "Mladé nevyvinuté houby se nesbírají. Ještě na nich nejsou vidět znaky, podle kterých se jedlá houba odliší od jedovaté, a mladá muchomůrka se dá snadno splést.",
  },
  {
    q: "Najdeš velkou starou houbu. Je rozměklá, nasáklá vodou a uvnitř červivá. Co uděláš?",
    correct: "Nechám ji v lese, stará a červivá houba se nesbírá",
    distractors: [
      { value: "Seberu ji a červivá místa doma vykrojím", why: "Stará rozměklá houba se už rozkládá a může způsobit otravu, i když je jinak jedlá. Vykrojení nepomůže." },
      { value: "Nechám ji, červi žerou jen jedovaté houby", why: "Červi žerou jedlé i jedovaté houby. Houbu necháš proto, že je stará a už se rozkládá." },
      { value: "Utrhnu ji, dlouhým vařením se všechno zničí", why: "Vařením se nezničí jed ani látky z rozkladu. Stará houba do hrnce nepatří." },
    ],
    hints: [
      "Rozmysli si, co se děje s houbou, která je stará a nasáklá vodou. Je to pořád čerstvá potravina?",
      "Uvaž, jestli se stará houba dá bezpečně jíst, i když by stejný druh v čerstvém stavu byl jedlý.",
    ],
    explanation: "Staré, rozmoklé a červivé houby se nesbírají. V houbě už probíhá rozklad a i jedlý druh může způsobit otravu. Ani vaření, ani vykrojení to nespraví.",
  },
  {
    q: "Chystáš se na houby. Do čeho budeš nasbírané houby dávat?",
    correct: "Do proutěného košíku, kde houby dýchají",
    distractors: [
      { value: "Do igelitové tašky, aby nic nevypadlo", why: "V igelitu se houby zapaří a rychle kazí. I jedlá houba se tak může stát škodlivou." },
      { value: "Do uzavřené plastové krabičky", why: "V uzavřené krabičce se houby nevětrají, zapaří se a kazí. Patří do vzdušného košíku." },
      { value: "Do batohu pod svetr, ať jsou v teple", why: "Teplo a zapaření houbám škodí, rychle se kazí. Houby potřebují vzduch, ne teplo." },
    ],
    hints: [
      "Představ si, co se stane s houbou, která je dlouho zavřená bez vzduchu a v teple.",
      "Houby se v teple a bez vzduchu zapaří a začnou se kazit. Hledej nádobu, ve které k nim proudí vzduch a nemačkají se.",
    ],
    explanation: "Houby se nosí v košíku. Proudí k nim vzduch, nemačkají se a nezapaří se. V igelitu nebo v uzavřené krabičce se rychle kazí a mohou způsobit zažívací potíže.",
  },
  {
    q: "Našel jsi hřib, který dobře znáš. Jak ho ze země dostaneš, aby podhoubí zůstalo co nejméně poškozené?",
    correct: "Šetrně ho vyjmu a okolí nerozhrabávám",
    distractors: [
      { value: "Rozhrabu hrabanku, ať vidím celé podhoubí", why: "Rozhrabáváním se podhoubí trhá a vysychá. Z poškozeného podhoubí pak houby nerostou." },
      { value: "Vytrhnu ho i s kusem půdy a mechu", why: "Vytržením i s půdou se podhoubí poškodí a v lese zůstane rozrytá díra." },
      { value: "Rozkopu zem, ať najdu i další houby", why: "Rozkopáváním ničíš podhoubí, ze kterého další houby teprve vyrostou." },
    ],
    hints: [
      "Podhoubí je ta část houby, která žije pod zemí. Co mu nejvíc uškodí?",
      "Plodnice, kterou sbíráš, je jen malá část houby. Podhoubí v půdě žije dál, pokud ho nerozrušíš a neodkryješ.",
    ],
    explanation: "Houbu vyjmi opatrně a hrabanku kolem nerozhrabávej. Podhoubí v půdě tak zůstane nepoškozené a houby z něj porostou i příště.",
  },
  {
    q: "Kamarád v lese utrhne houbu a chce si z ní hned kousnout syrovou. Co mu řekneš?",
    correct: "Nejez ji, syrové houby z lesa se nejedí",
    distractors: [
      { value: "Nejez ji, jedovaté houby jsou vždycky hořké", why: "Jedovaté houby hořké být nemusí, muchomůrka zelená hořká není. Kamarád ji nemá jíst proto, že je syrová a z lesa." },
      { value: "Kousni si, když ji okousal slimák", why: "Slimák snese jiné látky než člověk. Okousání nic neprozradí." },
      { value: "Kousni si jen trochu, to neuškodí", why: "I malé množství jedovaté houby může být smrtelné. Syrové houby z lesa se nejedí vůbec." },
    ],
    hints: [
      "Jde o dvě věci zároveň: houba je syrová a z lesa. Co z toho plyne pro kamaráda?",
      "Rozmysli si, jestli jde lesní houbu bezpečně jíst bez tepelné úpravy a jestli se jedovatost dá poznat chutí.",
    ],
    explanation: "Syrové houby z lesa se nejedí, řada z nich je syrová jedovatá. Neznámé houby se neochutnávají, i malý kousek může být smrtelný, a jedovatá houba se chutí prozradit nemusí.",
  },
  {
    q: "Rodina měla k obědu houbovou smaženici. Za několik hodin je tátovi zle, zvrací a má průjem. Co je správné?",
    correct: "Zavolat záchranku (155) a schovat zbytky hub",
    distractors: [
      { value: "Počkat do rána, jestli to samo přejde", why: "Při otravě houbami rozhoduje čas. Čekáním se jed dál vstřebává." },
      { value: "Zavolat záchranku, zbytky jídla hned vyhodit", why: "Záchranka je správně, ale zbytky hub se nevyhazují. Lékaři podle nich poznají, o jaký jed jde." },
      { value: "Jít k lékaři, jen když přijde horečka", why: "Horečka při otravě houbami přijít nemusí. K lékaři se jde hned při podezření." },
    ],
    hints: [
      "Potíže začaly po jídle z hub. Kdo jediný může poznat, jestli jde o otravu?",
      "Při podezření na otravu houbami se jedná hned, ne až při zhoršení. Lékař navíc potřebuje vědět, co bylo v jídle.",
    ],
    explanation: "Při podezření na otravu houbami se hned volá záchranná služba (155) nebo se jde k lékaři. Zbytky hub nebo jídla se schovají, aby lékaři poznali, o jaký jed jde.",
  },
  {
    q: "Babička radí: „Houby vař se stříbrnou lžičkou. Když lžička nezčerná, jsou jedlé.“ Co na to řekneš?",
    correct: "Nevěřím tomu, jed se takhle poznat nedá",
    distractors: [
      { value: "Věřím jí, stříbro jed v houbě odhalí", why: "Stříbro na jed muchomůrky nereaguje. Lžička v jedovaté houbě nezčerná." },
      { value: "Nevěřím, spolehlivější je zkouška s cibulí", why: "Ani cibule jed neodhalí. Je to stejný mýtus jako lžička." },
      { value: "Máš pravdu a jed se ještě vařením zničí", why: "Jed muchomůrky zelené vařením nezmizí. Lžička ho neodhalí." },
    ],
    hints: [
      "Existuje vůbec domácí zkouška, podle které se jedovatá houba pozná?",
      "Jedovaté látky v houbách nemění barvu kovu ani zeleniny a vaření je nezničí. Jedlost se pozná jen podle znalosti druhu.",
    ],
    explanation: "Test se stříbrnou lžičkou je mýtus, stejně jako zkouška s cibulí. Jed muchomůrky zelené stříbro nezbarví a vařením nezmizí. Jedlou houbu pozná jen ten, kdo ji bezpečně zná.",
  },
  {
    q: "Najdeš houbu, kterou někde okousal slimák. Jak to posoudíš?",
    correct: "Okousání nic neznamená, zvířata snesou jiné látky",
    distractors: [
      { value: "Slimák ji jedl, takže i člověku bude chutnat", why: "Slimáci žerou i houby, které jsou pro člověka jedovaté. Podle nich jedlost nepoznáš." },
      { value: "Okousaná houba je bezpečná, jen se déle vaří", why: "Okousání bezpečnost nedokazuje a vaření jed nezničí." },
      { value: "Zvířata jedovaté houby poznají, můžu ji sníst", why: "Zvířata nepoznají, co je jedovaté pro člověka. Snesou jiné látky než my." },
    ],
    hints: [
      "Mají slimák a člověk stejné tělo a snesou stejné látky?",
      "Vzpomeň si, jestli člověk a zvíře snesou stejnou potravu. Co z toho plyne pro houbu se stopami po zubech?",
    ],
    explanation: "Okousání slimákem ani jiným zvířetem jedlost nedokazuje. Zvířata snesou jiné látky než člověk a žerou i houby, které jsou pro nás jedovaté.",
  },
  {
    q: "Pěkné hřiby rostou těsně u frekventované silnice. Co s nimi?",
    correct: "Nechám je být, u silnice hromadí škodliviny",
    distractors: [
      { value: "Nasbírám je, stačí je doma pořádně omýt", why: "Škodliviny z výfuků houby nasají do sebe. Omytím je neodstraníš." },
      { value: "Vezmu je, škodliviny se vařením zničí", why: "Těžké kovy a další škodliviny se vařením nezničí." },
      { value: "Nechám je, u silnice rostou jen jedovaté hřiby", why: "U silnice rostou stejné druhy jako jinde. Problém jsou škodliviny z aut, které houby nasávají." },
    ],
    hints: [
      "Co se u rušné silnice dostává do půdy a do všeho, co v ní roste?",
      "Uvaž, co houby dělají s látkami, které jsou v půdě a ve vzduchu kolem nich.",
    ],
    explanation: "U silnic se houby nesbírají. Houby hromadí škodlivé látky z výfuků a z půdy a ty nejde odstranit omytím ani vařením.",
  },
  {
    q: "Jdete s třídou naučnou stezkou v národní přírodní rezervaci a u stezky rostou houby. Co uděláš?",
    correct: "Nesbírám je, v rezervaci nechávám přírodu v klidu",
    distractors: [
      { value: "Nasbírám jen pár, trocha přírodě neuškodí", why: "V rezervaci platí přísná pravidla. Kdyby si každý vzal jen trochu, zbylo by málo." },
      { value: "Utrhnu je, když stezku nikdo nehlídá", why: "Pravidla rezervace platí, i když se nikdo nedívá." },
      { value: "Nesbírám je, v rezervaci rostou jen jedovaté houby", why: "V rezervaci rostou jedlé i jedovaté houby. Nesbírá se tam proto, že je příroda přísně chráněná." },
    ],
    hints: [
      "Proč vůbec vznikají přírodní rezervace? Co v nich návštěvník smí?",
      "V přísně chráněném území platí přísnější pravidla než v běžném lese. Zamysli se, co z toho plyne pro sběr.",
    ],
    explanation: "V národních přírodních rezervacích a v nejpřísněji chráněných částech přírody se houby nesbírají. Příroda tam má zůstat bez zásahu člověka a pravidla platí bez ohledu na to, jestli se někdo dívá.",
  },
  {
    q: "Nevíš jistě, jestli je jedna houba v košíku jedlá. Kamarád radí: „Doma ji dlouho povař, jed zmizí.“ Co uděláš?",
    correct: "Vyhodím ji, nejistou houbu nejím",
    distractors: [
      { value: "Povařím ji, vařením se jed zničí", why: "Jed muchomůrky zelené vařením nezmizí. Nejistá houba se nejí vůbec." },
      { value: "Usuším ji, sušením jed vyprchá", why: "Sušení jed nezničí. Jedovatá houba zůstane jedovatá i usušená." },
      { value: "Naložím ji do octa, ten jed zničí", why: "Ocet jed v houbě nezničí. Nejistá houba se nejí vůbec." },
    ],
    hints: [
      "Existuje kuchyňská úprava, která z jedovaté houby udělá jedlou?",
      "Nejnebezpečnější houbové jedy vydrží vaření, sušení i nakládání. Jistotu dává jen bezpečná znalost druhu.",
    ],
    explanation: "Houbu, kterou bezpečně neznáš, nejíš. Vaření, sušení ani ocet jed spolehlivě nezničí, jed muchomůrky zelené vydrží i vysokou teplotu.",
  },
  {
    q: "Soused tvrdí, že jedovatou houbu pozná podle toho, že na řezu zmodrá. Co mu odpovíš?",
    correct: "Nesouhlasím, modrají i některé jedlé houby",
    distractors: [
      { value: "Souhlasím, co nezmodrá, je vždycky jedlé", why: "Muchomůrka zelená na řezu nemodrá, a přesto je smrtelně jedovatá." },
      { value: "Souhlasím, jed poznáš podle barvy dužniny", why: "Barva dužniny o jedlosti sama nerozhoduje. Modrají jedlé i jedovaté houby." },
      { value: "Nesouhlasím, jedovaté houby na řezu zčernají", why: "Zčernání jedovatost neprozradí stejně jako zmodrání. Barva dužniny o jedlosti nerozhoduje." },
    ],
    hints: [
      "Stačí jediný znak, třeba barva na řezu, k rozhodnutí o jedlosti?",
      "Modrání pomáhá určit některé hřiby, ale samo o jedlosti nerozhoduje. Vzpomeň si, jestli nemodrající houba může být jedovatá.",
    ],
    explanation: "Modrání dužniny jedovatost neprozradí. Na řezu modrají i jedlé houby a smrtelně jedovatá muchomůrka zelená naopak nemodrá vůbec. Jinou barvou dužniny se jed neprozradí také.",
  },
  {
    q: "Sestře je po obědě z hub zle a rodiče ji vezou do nemocnice. Co s sebou mají vzít?",
    correct: "Zbytky hub nebo jídla pro lékaře",
    distractors: [
      { value: "Nic, zbytky jídla hned vyhodí", why: "Zbytky hub pomohou lékařům zjistit, o jaký jed jde. Nevyhazují se." },
      { value: "Jen mléko, ať ho po cestě pije", why: "Mléko otravu houbami neléčí. Lékař potřebuje vědět, co sestra jedla." },
      { value: "Stříbrnou lžičku na zkoušku jedu", why: "Lžička jed neodhalí. Lékaři určí jed podle zbytků hub." },
    ],
    hints: [
      "Podle čeho lékaři zjistí, jakou houbou se sestra otrávila?",
      "Léčba otravy záleží na tom, jaký jed v jídle byl. Zamysli se, jak to lékaři zjistí, když u oběda nebyli.",
    ],
    explanation: "Do nemocnice se berou zbytky hub nebo jídla, případně i očištěné odřezky. Lékaři podle nich určí, o jakou houbu jde, a zvolí správnou léčbu.",
  },
  {
    q: "Po jídle z hub ti bylo zle, ale potom se to zlepšilo. Co je správné?",
    correct: "Jít hned k lékaři, zlepšení může klamat",
    distractors: [
      { value: "Zůstat doma, zlepšení znamená konec", why: "U otravy muchomůrkou zelenou přichází zdánlivé zlepšení, zatímco jed dál poškozuje játra." },
      { value: "Počkat, jestli se potíže zase vrátí", why: "Čekáním se ztrácí čas na léčbu. K lékaři se jde hned." },
      { value: "Vyzvracet se a jít normálně do školy", why: "Zvracení jed z těla nedostane celý. Lékař musí zjistit, o jakou otravu jde." },
    ],
    hints: [
      "Znamená zlepšení vždycky, že nebezpečí pominulo?",
      "U nejnebezpečnější houbové otravy přichází po prvních potížích zdánlivé zlepšení. Jed mezitím dál škodí játrům.",
    ],
    explanation: "Při otravě muchomůrkou zelenou se stav po prvních potížích zdánlivě zlepší, ale jed dál ničí játra. Proto se při podezření jde k lékaři hned, i když se ti ulevilo.",
  },
];

// ── L3: znaky, záměny, rozhodnutí, nebezpečí ─────────────────────────────────
const F_ZELENA_ZAMPION = { value: "žampion", why: "Žampion má lupeny růžové až hnědé, ne bílé, a u spodku třeně nemá pochvu." };
const F_ZELENA_HOLUBINKA = { value: "holubinka", why: "Holubinka má sice bílé lupeny, ale nemá prsten ani pochvu." };

const POOL_L3: Polozka[] = [
  // (a) popis znaků → houba
  {
    q: "Houba má nazelenalý klobouk a bílé lupeny, na třeni prsten a třeň vyrůstá z blanité pochvy. O kterou houbu jde?",
    correct: "muchomůrka zelená",
    distractors: [
      F_ZELENA_ZAMPION,
      F_ZELENA_HOLUBINKA,
      { value: "muchomůrka tygrovaná", why: "Tygrovaná má také bílé lupeny, prsten i pochvu, ale klobouk hnědavý se světlými skvrnami, ne nazelenalý." },
    ],
    hints: [
      "Najdi znak, který mají jen některé houby: čím končí dole třeň?",
      "Třeň v pochvě mají muchomůrky. Mezi nimi pak rozhodne barva klobouku.",
    ],
    explanation: "Bílé lupeny, prsten a pochva u spodku třeně jsou znaky muchomůrek. Nazelenalý klobouk k nim patří u muchomůrky zelené, nejnebezpečnější houby naší přírody.",
  },
  {
    q: "Houba má nazelenalý klobouk, bílé lupeny a hladký bílý třeň, na kterém není prsten. Třeň se láme křehce jako křída a dole není ztluštělý ani ukrytý v obalu. O kterou houbu jde?",
    correct: "holubinka",
    distractors: [
      { value: "muchomůrka zelená", why: "Muchomůrka zelená má také nazelenalý klobouk a bílé lupeny, ale na třeni prsten a dole pochvu. Její třeň se nedrolí jako křída." },
      { value: "žampion", why: "Žampion má na třeni prsten a lupeny růžové až hnědé, ne bílé." },
      { value: "muchomůrka tygrovaná", why: "Tygrovaná má bílé lupeny, ale hnědavý skvrnitý klobouk, prsten a pochvu." },
    ],
    hints: [
      "Popis říká i to, co houba nemá. Které znaky muchomůrek tu chybí?",
      "Všimni si, jak se třeň láme. Který z těch znaků má jen jedna skupina hub z nabídky?",
    ],
    explanation: "Křehký třeň, který se láme jako křída, a bílé lupeny mají holubinky. Chybějící prsten a pochva je odliší od muchomůrky zelené, se kterou se nazelenalé holubinky pletou. Proto je sbírají jen zkušení houbaři.",
  },
  {
    q: "Po vydatném dešti našel houbař houbu s červeným kloboukem, na kterém nejsou žádné bradavky. Má bílé lupeny, na třeni prsten a dole hlízu se zbytky obalu v kroužcích. Kamarád tvrdí, že je to holubinka. O kterou houbu jde?",
    correct: "muchomůrka červená",
    distractors: [
      { value: "holubinka", why: "Holubinka může mít červený klobouk a bílé lupeny, ale nemá prsten ani hlízu se zbytky obalu." },
      { value: "muchomůrka zelená", why: "Zelená má také bílé lupeny, prsten a zbytky obalu dole, ale klobouk nazelenalý, ne červený." },
      { value: "muchomůrka tygrovaná", why: "Tygrovaná má bílé lupeny, prsten i zbytky obalu, ale klobouk hnědavý, ne červený." },
    ],
    hints: [
      "Chybějící bradavky nejsou rozhodující. Které další znaky z popisu mají jen některé houby s bílými lupeny?",
      "Bradavky jsou zbytky obalu mladé houby a déšť je může smýt. Hledej, kde jinde na houbě po obalu zůstala stopa.",
    ],
    explanation: "Bílé lupeny, prsten a hlíza se zbytky obalu v kroužcích prozrazují muchomůrku, červený klobouk muchomůrku červenou. Bradavky smyl déšť. Holubinka prsten ani hlízu nemá. Muchomůrka červená je jedovatá, smrtelné otravy ale způsobuje zřídka, na rozdíl od muchomůrky zelené.",
  },
  {
    q: "Houba má bělavě šedý klobouk a pod ním rourky s červenými ústími. Třeň je baňatý a červený se síťkou, dužnina na řezu jen slabě modrá a starší plodnice páchne. Co je to?",
    correct: "hřib satan",
    distractors: [
      { value: "hřib smrkový", why: "Smrkový má rourky a baňatý třeň se síťkou, ale síťka je světlá, třeň není červený a dužnina nemodrá." },
      { value: "hřib žlučník", why: "Žlučník má rourky a síťku, ale ta je tmavá, dužnina je hořká a nemodrá." },
      { value: "kozák", why: "Kozák má rourky, ale štíhlý třeň s tmavými šupinkami a žádnou červenou síťku." },
    ],
    hints: [
      "Všechny možnosti mají rourky. Který znak z popisu mezi nimi vyčnívá?",
      "Bělavý klobouk, červený třeň se síťkou a zápach jsou dohromady znaky jednoho jedovatého hřibu. Modrání samo o jedlosti nerozhoduje.",
    ],
    explanation: "Bělavě šedý klobouk, rourky s červenými ústími, baňatý červený třeň se síťkou a zápach starších plodnic jsou znaky hřibu satanu. Je jedovatý. Modrání samo o jedlosti nerozhoduje, modrají i jedlé hřiby.",
  },
  {
    q: "Celá houba je vaječně žlutá až oranžová a místo lupenů má na spodu klobouku rozvětvené tupé lišty. Roste ve skupinách v lese. Kterou houbu popisuje?",
    correct: "liška obecná",
    distractors: [
      { value: "václavka obecná", why: "Václavka je žlutohnědá a roste v trsech, ale má pravé lupeny a prsten, ne lišty." },
      { value: "křemenáč osikový", why: "Křemenáč má oranžový klobouk, ale pod ním rourky, ne lišty." },
      { value: "muchomůrka červená", why: "Muchomůrka červená má oranžově červený klobouk, ale bílé lupeny, bradavky a prsten." },
    ],
    hints: [
      "Podívej se na spodek klobouku: lupeny, rourky, nebo něco jiného?",
      "Tupé rozvětvené lišty místo lupenů má u nás jen málo hub. Připoj k tomu žlutou barvu celé plodnice.",
    ],
    explanation: "Tupé rozvětvené lišty místo lupenů a žlutá barva celé plodnice jsou znaky lišky obecné. Je to jedlá houba, sbírá ji ale jen ten, kdo ji bezpečně pozná.",
  },
  {
    q: "Velký šupinatý klobouk připomíná slunečník. Třeň má hnědou hadovitou kresbu a posuvný prsten, dole je jen ztluštělý a bez pochvy. O kterou houbu jde?",
    correct: "bedla vysoká",
    distractors: [
      { value: "muchomůrka zelená", why: "Zelená má prsten, ale pevně přirostlý, hladký nazelenalý klobouk a pochvu u spodku třeně." },
      { value: "muchomůrka tygrovaná", why: "Tygrovaná má skvrnitý klobouk a prsten, ale také pochvu a třeň bez hadovité kresby." },
      { value: "žampion", why: "Žampion má prsten, ale malý hladký klobouk a růžové až hnědé lupeny." },
    ],
    hints: [
      "Který znak z popisu nemají muchomůrky: jaký je prsten a co je dole na třeni?",
      "Muchomůrky mají prsten pevný a třeň v pochvě. Houba s posuvným prstenem a hadovitou kresbou na třeni mezi ně nepatří.",
    ],
    explanation: "Posuvný prsten, hadovitá kresba na třeni, velký šupinatý klobouk a spodek bez pochvy jsou znaky bedly vysoké. Právě chybějící pochva ji odliší od muchomůrek.",
  },
  {
    q: "Houba má bílý klobouk, lupeny růžové, u starších plodnic čokoládově hnědé, na třeni prsten, ale pochva u spodku chybí. Jak se jmenuje?",
    correct: "žampion",
    distractors: [
      { value: "muchomůrka zelená", why: "Zelená může být bledá a má prsten, ale lupeny zůstávají bílé a u spodku třeně je pochva." },
      { value: "bedla vysoká", why: "Bedla má prsten, ale velký šupinatý klobouk, světlé lupeny a hadovitou kresbu na třeni." },
      { value: "muchomůrka tygrovaná", why: "Tygrovaná má prsten, ale bílé lupeny, skvrnitý hnědavý klobouk a pochvu." },
    ],
    hints: [
      "Které dva znaky z popisu odliší tuto houbu od muchomůrek s prstenem?",
      "Muchomůrky mají lupeny stále bílé a třeň v pochvě. Tady se lupeny barví a pochva chybí.",
    ],
    explanation: "Růžové až hnědé lupeny, prsten a třeň bez pochvy má žampion. Barva lupenů a chybějící pochva ho odliší od smrtelně jedovaté muchomůrky zelené.",
  },
  {
    q: "Hnědá houba má pod kloboukem rourky, které jsou nejdřív bělavé a pak růžovějí. Třeň pokrývá tmavá síťka. Co je to?",
    correct: "hřib žlučník",
    distractors: [
      { value: "hřib smrkový", why: "Smrkový má rourky a síťku, ale rourky žloutnou až zelenají a síťka je světlá." },
      { value: "hřib satan", why: "Satan má rourky a síťku, ale červený třeň a bělavý klobouk." },
      { value: "kozák", why: "Kozák má hnědý klobouk a rourky, ale na třeni tmavé šupinky, ne síťku." },
    ],
    hints: [
      "Všechny možnosti mají rourky. Který znak z popisu mají jen některé z nich?",
      "Hnědý klobouk má víc hřibů. Rozhodni podle toho, jak se mění barva rourek a jakou barvu má síťka.",
    ],
    explanation: "Růžovějící rourky a tmavá síťka na třeni jsou znaky hřibu žlučníku. Není jedovatý, ale je nejedlý, protože je velmi hořký a zhořkne celé jídlo. Hořkost ale houbař nezjišťuje jazykem, žlučník pozná podle rourek a síťky.",
  },
  {
    q: "Houba roste v trsech na pařezech. Klobouk je medově hnědý s drobnými šupinkami, lupeny bělavé a na třeni je prsten. Kterou houbu popisuje?",
    correct: "václavka obecná",
    distractors: [
      { value: "muchomůrka tygrovaná", why: "Tygrovaná má bělavé lupeny a prsten, ale neroste v trsech na dřevě a má pochvu." },
      { value: "bedla vysoká", why: "Bedla má šupinatý klobouk a prsten, ale roste jednotlivě na zemi a je mnohem větší." },
      { value: "žampion", why: "Žampion má prsten, ale roste na zemi, ne na pařezech, a lupeny má růžové až hnědé." },
    ],
    hints: [
      "Kde a jak houba roste? Který znak z popisu mají jen houby rostoucí na dřevě?",
      "Na pařezech v trsech roste jen málo hub s prstenem. Připoj k tomu medovou barvu klobouku.",
    ],
    explanation: "Trsy na pařezech, medově hnědý šupinatý klobouk, bělavé lupeny a prsten má václavka. Je jedlá jen dobře tepelně upravená.",
  },
  {
    q: "Houba s rourkami roste pod břízami. Klobouk je hnědý a štíhlý třeň je posetý tmavými šupinkami. O kterou houbu jde?",
    correct: "kozák",
    distractors: [
      { value: "hřib smrkový", why: "Smrkový má hnědý klobouk a rourky, ale baňatý třeň se světlou síťkou, ne šupinky." },
      { value: "hřib žlučník", why: "Žlučník má hnědý klobouk a rourky, ale na třeni tmavou síťku a je hořký." },
      { value: "křemenáč osikový", why: "Křemenáč má také šupinky na třeni a rourky, ale jeho klobouk je oranžový." },
    ],
    hints: [
      "Co je na třeni: síťka, nebo šupinky? A pod jakým stromem houba roste?",
      "Šupinky na třeni mají dvě houby s rourkami. Rozhodne barva klobouku a strom, se kterým houba žije.",
    ],
    explanation: "Hnědý klobouk, rourky, štíhlý třeň s tmavými šupinkami a růst pod břízami jsou znaky kozáka. Křemenáč má šupinky také, ale klobouk oranžový.",
  },
  // (b) dvojice k záměně → rozhodující znak
  {
    q: "Houbař váhá, jestli drží žampion, nebo muchomůrku zelenou. Který znak mu rozhodne nejspolehlivěji?",
    correct: "Barva lupenů a pochva u spodku třeně",
    distractors: [
      { value: "Velikost a tvar klobouku", why: "Klobouk mají obě houby podobný. Rozhodují lupeny a spodek třeně." },
      { value: "Prsten na třeni pod kloboukem", why: "Prsten mají obě houby, takže je neodliší." },
      { value: "Chuť a vůně syrové dužniny", why: "Chuť není bezpečný znak a houba se nikdy neochutnává. Jed muchomůrky se chutí neprozradí." },
    ],
    hints: [
      "Který znak mají obě houby stejný, a proto nerozhoduje?",
      "Najdi znak, ve kterém se dvojice liší, ne ten, který mají obě. Projdi houbu postupně odshora dolů.",
    ],
    explanation: "Žampion má lupeny růžové až hnědé a třeň bez pochvy. Muchomůrka zelená má lupeny bílé a spodek třeně v pochvě. Proto se houba vždy trhá celá i se spodkem.",
  },
  {
    q: "Hřib smrkový a hřib žlučník vypadají podobně. Podle čeho je zkušený houbař rozliší?",
    correct: "Podle růžovějících rourek a tmavé síťky",
    distractors: [
      { value: "Podle velikosti a barvy klobouku", why: "Klobouk mají obě houby hnědý a podobně velký. Neliší se tak spolehlivě." },
      { value: "Podle toho, jestli rourky modrají", why: "Ani jeden z nich na řezu výrazně nemodrá, takže je to neodliší." },
      { value: "Podle toho, jestli ho okousal slimák", why: "Okousání nic neznamená. Zvířata snesou jiné látky než člověk." },
    ],
    hints: [
      "Oba hřiby mají hnědý klobouk. Kde jinde na houbě hledat rozdíl?",
      "Ke každé možnosti si polož otázku: liší se v tom ty dva hřiby opravdu? A je to znak, který houbař bezpečně vidí?",
    ],
    explanation: "Hřib žlučník má rourky, které růžovějí, a tmavou síťku na třeni. Hřib smrkový má rourky bělavé až zelenavé a síťku světlou. Hořkost žlučníku se nezkouší, rozhodují rourky a síťka.",
  },
  {
    q: "Bedla vysoká se dá splést s jedovatými muchomůrkami. Který znak ji bezpečně odliší?",
    correct: "Posuvný prsten a třeň bez pochvy",
    distractors: [
      { value: "Bílé lupeny pod velkým kloboukem", why: "Bílé lupeny mají bedla i muchomůrky, takže je neodliší." },
      { value: "Pevný prsten přirostlý k třeni", why: "Pevný prsten mají právě muchomůrky. Bedla má prsten posuvný." },
      { value: "Skvrny a šupinky na klobouku", why: "Skvrny nebo bradavky mají i muchomůrky. Snadno se zamění za šupiny." },
    ],
    hints: [
      "Který znak mají bedla i muchomůrky společný, a proto nerozhoduje?",
      "U každé možnosti si ověř, jestli ten znak mají jen bedly, nebo i muchomůrky.",
    ],
    explanation: "Bedla vysoká má prsten, který jde po třeni posouvat, a spodek třeně bez pochvy. Muchomůrky mají prsten pevný a třeň vyrůstá z pochvy.",
  },
  {
    q: "Proč je nebezpečné utrhnout houbu s bílými lupeny těsně nad zemí, bez spodku třeně?",
    correct: "V zemi zůstane pochva, podle které se pozná muchomůrka",
    distractors: [
      { value: "V košíku se houba bez spodku rychleji zkazí", why: "O zkažení tu nejde. Hlavní problém je, že nevidíš rozlišovací znak." },
      { value: "Bez spodku třeně houba ztratí svou vůni", why: "Vůně s bezpečností nesouvisí. Důležitý je znak, který zůstal v zemi." },
      { value: "Podhoubí se poškodí a jed přejde do klobouku", why: "Jed se z podhoubí do klobouku nepřesouvá. Problém je chybějící znak." },
    ],
    hints: [
      "Který rozlišovací znak se nachází úplně dole u třeně?",
      "Bílé lupeny mají i smrtelně jedovaté muchomůrky. Vzpomeň si, podle čeho se muchomůrky poznají.",
    ],
    explanation: "Muchomůrky mají spodek třeně v pochvě, která bývá schovaná v zemi. Kdo houbu utrhne nad zemí, tento znak neuvidí a může muchomůrku zelenou splést se žampionem.",
  },
  // (c) nejistý případ → rozhodnutí i s rozhodujícím znakem
  {
    q: "Houba má bílé lupeny a u spodku třeně něco jako kalíšek. Kamarád tvrdí, že je to žampion. Jak rozhodneš?",
    correct: "Nesbírat, bílé lupeny a pochva ukazují na muchomůrku",
    distractors: [
      { value: "Sebrat ji, kamarád houby určitě zná", why: "Rozhodují znaky, ne jistota kamaráda. Bílé lupeny a pochva ukazují na muchomůrku." },
      { value: "Nesbírat, bílé houby jsou vždycky jedovaté", why: "Bílé bývají i jedlé houby, třeba žampion. Rozhodují bílé lupeny a pochva, ne barva houby." },
      { value: "Nesbírat, kalíšek znamená, že je houba stará", why: "Kalíšek u spodku třeně není znak stáří. Je to pochva, typický znak muchomůrek." },
    ],
    hints: [
      "Porovnej znaky z popisu s tím, jak vypadá žampion. Sedí barva lupenů?",
      "Vybav si, které znaky žampion nikdy nemá, a porovnej je s tím, co vidíš na této houbě.",
    ],
    explanation: "Bílé lupeny a pochva u spodku třeně jsou varovné znaky muchomůrek. Žampion má lupeny růžové až hnědé a pochvu nemá. Houba se proto nesbírá, ať tvrdí kdokoli cokoli.",
  },
  {
    q: "Houba má bělavě šedý klobouk, pod ním rourky s červenými ústími, baňatý červený třeň a dužnina na řezu slabě modrá. Kamarád říká: „Houby s rourkami jsou všechny jedlé.“ Co uděláš?",
    correct: "Nesbírám, klobouk a třeň odpovídají hřibu satanovi",
    distractors: [
      { value: "Seberu ji, houby s rourkami jsou všechny jedlé", why: "Mezi houbami s rourkami jsou i jedovaté a nejedlé, například hřib satan." },
      { value: "Nesbírám, každá houba, která na řezu modrá, je jedovatá", why: "Modrají i jedlé hřiby. Rozhoduje celá kombinace znaků: bělavý klobouk a červený baňatý třeň." },
      { value: "Nesbírám, hřiby s červeným třeněm jsou smrtelně jedovaté", why: "Červený třeň mají i jedlé hřiby a satan smrtelné otravy způsobuje jen výjimečně. Rozhoduje celá kombinace znaků." },
    ],
    hints: [
      "Platí opravdu, že každá houba s rourkami je jedlá? A stačí k rozhodnutí jediný znak?",
      "Rozhoduje celá kombinace znaků, ne jeden z nich. Porovnej ji se znaky hřibů, které znáš.",
    ],
    explanation: "Tvrzení, že všechny houby s rourkami jsou jedlé, je mýtus. Bělavě šedý klobouk, rourky s červenými ústími a baňatý červený třeň jsou dohromady znaky jedovatého hřibu satanu. Samotné modrání ani červený třeň nerozhodují, mají je i jedlé hřiby, třeba kovář. Satan způsobuje prudké zažívací potíže, smrtelný bývá jen výjimečně.",
  },
  {
    q: "Malá bílá kulovitá houba vypadá jako mladá pýchavka, ale mohlo by to být i vajíčko mladé muchomůrky. Co spolehlivě ukáže rozdíl?",
    correct: "Podélný řez: uvnitř je vidět obrys lupenů",
    distractors: [
      { value: "Barva povrchu: mladá muchomůrka by byla zelená", why: "Mladá muchomůrka je v obalu bílá, i když má později zelený klobouk. Barva povrchu nic neprozradí." },
      { value: "Vůně: mladá muchomůrka by nepříjemně páchla", why: "Zápach jed spolehlivě neprozradí. Rozdíl je uvnitř houby." },
      { value: "Velikost: vajíčko muchomůrky je vždy menší", why: "Obě mladé houby mohou být stejně velké. Rozdíl je uvnitř houby." },
    ],
    hints: [
      "Zvenku vypadají obě mladé houby stejně. Kde by se mohl rozdíl skrývat?",
      "Uvaž, co je uvnitř obalu mladé muchomůrky a co uvnitř pýchavky. Který postup to ukáže?",
    ],
    explanation: "Mladá muchomůrka má uvnitř obalu už založený klobouk, lupeny i třeň a na podélném řezu je vidět jejich obrys. Mladá pýchavka je uvnitř celá stejnorodě bílá. Houba s obrysem uvnitř se nesbírá, a když si nejsi jistý, nesbírej ji vůbec.",
  },
  {
    q: "Houbař najde houbu s bílými lupeny a prstenem, ale třeň utrhl těsně nad zemí, takže spodek nevidí. Jak má rozhodnout?",
    correct: "Nesbírat ji, bez spodku nevyloučí muchomůrku",
    distractors: [
      { value: "Sebrat ji, bez pochvy je to jistě žampion", why: "Pochva mohla zůstat v zemi. Bez spodku třeně to nepoznáš." },
      { value: "Nesbírat ji, houby s prstenem jsou všechny jedovaté", why: "Prsten mají i jedlé houby, třeba bedla nebo žampion. Houba se nesbírá kvůli chybějícímu spodku třeně." },
      { value: "Nesbírat ji, utržená houba se rychle zkazí", why: "O zkažení tu nejde. Houba se nesbírá, protože bez spodku třeně nejde ověřit pochvu." },
    ],
    hints: [
      "Který rozhodující znak houbař kvůli utržení nevidí?",
      "Bílé lupeny a prsten mají muchomůrky. Poslední znak, který by je potvrdil nebo vyloučil, je u spodku třeně.",
    ],
    explanation: "Bílé lupeny a prsten mají i smrtelně jedovaté muchomůrky. Bez spodku třeně nejde ověřit, jestli tam byla pochva, takže houba se nesbírá.",
  },
  // (d) znak ↔ nebezpečí
  {
    q: "Co dělá otravu muchomůrkou zelenou tak nebezpečnou?",
    correct: "Potíže přijdou až po hodinách, jed už je v těle",
    distractors: [
      { value: "Potíže přijdou hned, ale jsou jen slabé", why: "U této otravy přicházejí potíže se zpožděním, často po mnoha hodinách." },
      { value: "Jed škodí jen dětem, dospělým ne", why: "Jed je nebezpečný pro děti i dospělé." },
      { value: "Jed škodí jen v houbě snědené syrové", why: "Jed nezmizí ani vařením. Škodí i v uvařené houbě." },
    ],
    hints: [
      "Kdy se objeví první potíže a co se s jedem mezitím děje?",
      "U nejnebezpečnější otravy houbami rozhoduje čas. Uvaž, kdy člověk vůbec pozná, že je otrávený.",
    ],
    explanation: "Muchomůrka zelená je tak nebezpečná, protože první příznaky přicházejí až po mnoha hodinách. Jed je už vstřebaný a ničí játra, vařením se přitom nezničí.",
  },
  {
    q: "Jedovatá houba s nápadnými znaky se v košíku houbaře objeví jen zřídka. Proč?",
    correct: "Nápadné znaky varují, s jedlou ji nikdo nesplete",
    distractors: [
      { value: "Nápadné jedovaté houby rostou jen vzácně", why: "Například muchomůrka červená je v našich lesích běžná. Do košíku se nedostane, protože si ji nikdo s jedlou houbou nesplete." },
      { value: "Nápadné houby obsahují jen slabý jed", why: "Síla jedu s nápadností nesouvisí. Rozhoduje, jestli si houbu někdo splete s jedlou." },
      { value: "Nápadné houby sežerou zvířata dřív než lidé", why: "Zvířata jedovaté houby nevyhledávají ani nepoznají. Důvod je v tom, jak houbu vidí houbař." },
    ],
    hints: [
      "Jak se jedovatá houba do košíku vůbec dostane? Co musí houbař udělat špatně?",
      "Otrava obvykle začíná záměnou. Zvaž, jak snadno se dá splést houba, kterou pozná každý už z dálky.",
    ],
    explanation: "Jedovatá houba se do košíku dostane hlavně záměnou s jedlou. Nápadnou houbu, třeba muchomůrku červenou, si téměř nikdo nesplete. Proto smrtelné otravy u nás způsobuje hlavně nenápadná muchomůrka zelená, která se plete se žampionem.",
  },
  {
    q: "Poznáš jedovatou houbu podle chuti nebo zápachu?",
    correct: "Ne, jedovaté houby nemusí chutnat ani páchnout zle",
    distractors: [
      { value: "Ano, jedovaté houby bývají hořké", why: "Muchomůrka zelená hořká není a hořký hřib žlučník jedovatý není. Hořkost jed neprozradí." },
      { value: "Ano, jedovaté houby nepříjemně páchnou", why: "Jedovaté houby páchnout nemusí. Zápach jed spolehlivě neprozradí." },
      { value: "Jen podle zápachu, chuť nic neprozradí", why: "Ani zápach není spolehlivý. Jedovatou houbu pozná jen ten, kdo bezpečně zná její znaky." },
    ],
    hints: [
      "Je chuť nebo vůně houby opravdu spojená s tím, jestli je jedovatá?",
      "Vzpomeň si na hořký hřib žlučník a na nejjedovatější houbu našich lesů. Sedí u nich chuť k jedovatosti?",
    ],
    explanation: "Chuť ani zápach jedovatost spolehlivě neprozradí. Jedovaté houby nemusí chutnat ani páchnout zle a hořký hřib žlučník jedovatý není. Proto se houby neochutnávají a poznávají se jen podle znaků.",
  },
];

// ── Generátor ───────────────────────────────────────────────────────────────
const vytvor = (p: Polozka): PracticeTask | null =>
  choice(p.q, p.correct, p.distractors, { hints: p.hints, explanation: p.explanation });

/** Deterministicky projde celou banku úrovně — každá položka dá jednu úlohu. */
function zBanky(pool: Polozka[]): PracticeTask[] {
  let i = 0;
  return ruzneUlohy(() => losUlohy(() => vytvor(pool[i++ % pool.length])), pool.length, pool.length);
}

function gen(level: number): PracticeTask[] {
  if (level <= 1) return zBanky(POOL_L1);
  if (level === 2) return zBanky(POOL_L2);
  return zBanky(POOL_L3);
}

// ── Topic ───────────────────────────────────────────────────────────────────
export const JEDLE_A_JEDOVATE_HOUBY: TopicMetadata[] = [
  {
    id: "g6-pri-jedle-a-jedovate-houby-6",
    rvpNodeId: "g6-prirodopis-biologie-hub-houby-a-lisejniky-jedle-a-jedovate-houby-pravidla-sberu",
    displayName: "Jedlé a jedovaté houby",
    title: "Jedlé a jedovaté houby, pravidla sběru",
    studentTitle: "Jedlé a jedovaté houby",
    subject: "prirodopis",
    category: "Biologie hub",
    topic: "Houby a lišejníky",
    briefDescription: "Poznáš nebezpečné houby a víš, jak je sbírat bezpečně.",
    keywords: [
      "houby", "jedlé houby", "jedovaté houby", "muchomůrka zelená", "muchomůrka červená",
      "hřib satan", "hřib žlučník", "žampion", "bedla", "sběr hub", "otrava houbami", "pochva", "lupeny",
    ],
    goals: [
      "Rozlišit běžné jedlé, nejedlé a jedovaté houby naší přírody.",
      "Použít pravidla sběru hub a správně jednat při podezření na otravu.",
      "Poznat houbu z popisu znaků a odlišit dvojice, které se pletou.",
    ],
    boundaries: [
      "Jen houby, na kterých se shodují učebnice 6. ročníku; bez latinských názvů.",
      "Mýty (lžička, slimák, vaření) jen jako vyvrácené distraktory.",
      "Žádná rada k ochutnávání; při podezření na otravu vždy hned záchranka (155) nebo lékař.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Houbu, kterou bezpečně neznáš, netrháš a nejíš. Muchomůrky poznáš podle bílých lupenů, prstenu a pochvy u spodku třeně.",
      steps: [
        "Podívej se pod klobouk: lupeny (a jakou mají barvu), rourky, nebo lišty?",
        "Zkontroluj třeň: prsten, síťku, šupinky a hlavně pochvu u spodku.",
        "Když si nejsi jistý, houbu nesbírej. Při potížích po jídle hned volej záchranku (155) nebo jdi k lékaři a vezmi zbytky hub.",
      ],
      commonMistake: "Myslet si, že nejnebezpečnější je nápadná muchomůrka červená, nebo věřit mýtům o stříbrné lžičce a okousání slimákem.",
      example: "Bílé lupeny + prsten + pochva = muchomůrka, houbu nesbírám. Žampion má lupeny růžové až hnědé a pochvu nemá.",
    },
  },
];
