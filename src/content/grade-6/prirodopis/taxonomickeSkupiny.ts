/**
 * Přírodopis 6. ročník — Třídění organismů, taxonomické skupiny (select_one).
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • obrácený směr posloupnosti (druh jako nejširší, „pod“ ↔ „nad“),
 *  • záměna sousedních kategorií a přeskočení kategorie (rod ↔ druh),
 *  • třídění podle vzhledu a prostředí (netopýr je pták, velryba ryba, houba rostlina),
 *  • příbuznost podle podobnosti, ne podle nejužší společné skupiny.
 *
 *  • L1 — zapamatování: soused v posloupnosti, nejširší/nejužší kategorie, hlavní skupina organismu.
 *  • L2 — použití: kategorie údaje v zařazení, stejný řád a jiná čeleď, dvojice se společnou kategorií.
 *  • L3 — analýza a přenos: co plyne ze společné kategorie, kdo je komu nejblíž příbuzný,
 *         zařazení podle popisu znaků, počty druhů v širší a užší skupině.
 *
 * Zařazení zástupců je tvrdě zapsané v tabulce ZASTUPCI (české názvy, bez latiny).
 * Zajícovci × hlodavci se nikdy nepárují — rozdíl je jen fakt v datech, ne chyták.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pluralWithNumber } from "@/lib/czechGrammar";
import {
  buildChoiceTask as choice,
  losUlohy,
  ruzneUlohy,
  pick,
  pickN,
  shuffle,
  type Distractor,
} from "./_shared";

// ── Kategorie a jejich tvary ────────────────────────────────────────────────
const KAT = ["říše", "kmen", "třída", "řád", "čeleď", "rod", "druh"] as const;

interface Tvary { acc: string; gen: string; loc: string; genPl: string; zen: boolean }
const TVARY: Tvary[] = [
  { acc: "říši", gen: "říše", loc: "říši", genPl: "říší", zen: true },
  { acc: "kmen", gen: "kmene", loc: "kmeni", genPl: "kmenů", zen: false },
  { acc: "třídu", gen: "třídy", loc: "třídě", genPl: "tříd", zen: true },
  { acc: "řád", gen: "řádu", loc: "řádu", genPl: "řádů", zen: false },
  { acc: "čeleď", gen: "čeledi", loc: "čeledi", genPl: "čeledí", zen: true },
  { acc: "rod", gen: "rodu", loc: "rodu", genPl: "rodů", zen: false },
  { acc: "druh", gen: "druhu", loc: "druhu", genPl: "druhů", zen: false },
];
const spolecn = (r: number) => (TVARY[r].zen ? "společnou" : "společný");
const stejn = (r: number) => (TVARY[r].zen ? "stejné" : "stejného");
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const druhu = (n: number) => pluralWithNumber(n, "druh", "druhy", "druhů");
const mist = (n: number) => pluralWithNumber(n, "místo", "místa", "míst");

/** „a, b, c a d“ */
const seznam = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} a ${xs[xs.length - 1]}`);

// ── Zástupci (říše živočichové) ─────────────────────────────────────────────
interface Zastupce {
  nom: string;
  gen: string;
  zen: boolean;
  /** kmen, třída, řád, čeleď, rod */
  sys: [string, string, string, string, string];
}
const z = (nom: string, gen: string, zen: boolean, sys: Zastupce["sys"]): Zastupce => ({ nom, gen, zen, sys });

const ZASTUPCI: Zastupce[] = [
  z("vlk obecný", "vlka obecného", false, ["strunatci", "savci", "šelmy", "psovití", "vlk"]),
  z("liška obecná", "lišky obecné", true, ["strunatci", "savci", "šelmy", "psovití", "liška"]),
  z("kočka divoká", "kočky divoké", true, ["strunatci", "savci", "šelmy", "kočkovití", "kočka"]),
  z("rys ostrovid", "rysa ostrovida", false, ["strunatci", "savci", "šelmy", "kočkovití", "rys"]),
  z("kuna lesní", "kuny lesní", true, ["strunatci", "savci", "šelmy", "lasicovití", "kuna"]),
  // Jediná dvojice se společným rodem — shoda rodu je vidět z českého jména.
  z("kuna skalní", "kuny skalní", true, ["strunatci", "savci", "šelmy", "lasicovití", "kuna"]),
  z("jezevec lesní", "jezevce lesního", false, ["strunatci", "savci", "šelmy", "lasicovití", "jezevec"]),
  z("zajíc polní", "zajíce polního", false, ["strunatci", "savci", "zajícovci", "zajícovití", "zajíc"]),
  z("králík divoký", "králíka divokého", false, ["strunatci", "savci", "zajícovci", "zajícovití", "králík"]),
  z("veverka obecná", "veverky obecné", true, ["strunatci", "savci", "hlodavci", "veverkovití", "veverka"]),
  z("myš domácí", "myši domácí", true, ["strunatci", "savci", "hlodavci", "myšovití", "myš"]),
  z("kapr obecný", "kapra obecného", false, ["strunatci", "ryby", "máloostní", "kaprovití", "kapr"]),
  z("štika obecná", "štiky obecné", true, ["strunatci", "ryby", "štikotvární", "štikovití", "štika"]),
  z("okoun říční", "okouna říčního", false, ["strunatci", "ryby", "ostnoploutví", "okounovití", "okoun"]),
  z("skokan hnědý", "skokana hnědého", false, ["strunatci", "obojživelníci", "žáby", "skokanovití", "skokan"]),
  z("ropucha obecná", "ropuchy obecné", true, ["strunatci", "obojživelníci", "žáby", "ropuchovití", "ropucha"]),
  z("kachna divoká", "kachny divoké", true, ["strunatci", "ptáci", "vrubozobí", "kachnovití", "kachna"]),
  z("sýkora koňadra", "sýkory koňadry", true, ["strunatci", "ptáci", "pěvci", "sýkorovití", "sýkora"]),
  z("vrabec domácí", "vrabce domácího", false, ["strunatci", "ptáci", "pěvci", "vrabcovití", "vrabec"]),
  z("včela medonosná", "včely medonosné", true, ["členovci", "hmyz", "blanokřídlí", "včelovití", "včela"]),
  z("čmelák zemní", "čmeláka zemního", false, ["členovci", "hmyz", "blanokřídlí", "včelovití", "čmelák"]),
  z("mravenec lesní", "mravence lesního", false, ["členovci", "hmyz", "blanokřídlí", "mravencovití", "mravenec"]),
  z("babočka paví oko", "babočky paví oko", true, ["členovci", "hmyz", "motýli", "babočkovití", "babočka"]),
  z("křižák obecný", "křižáka obecného", false, ["členovci", "pavoukovci", "pavouci", "křižákovití", "křižák"]),
];

/** Údaj zástupce v kategorii r (0 říše … 6 druh). */
const hodnota = (a: Zastupce, r: number): string => (r === 0 ? "živočichové" : r === 6 ? a.nom : a.sys[r - 1]);
const retez = (a: Zastupce) => KAT.map((_, r) => hodnota(a, r));

/** Nejhlubší společná kategorie (0 = jen říše … 5 = rod). */
function hloubka(a: Zastupce, b: Zastupce): number {
  let d = 0;
  for (let i = 0; i < 5; i++) {
    if (a.sys[i] !== b.sys[i]) break;
    d = i + 1;
  }
  return d;
}

/** Zajícovci × hlodavci — dříve jedna skupina, proto se spolu nepárují. */
const past = (a: Zastupce, b: Zastupce) => {
  const r = new Set([a.sys[2], b.sys[2]]);
  return r.has("zajícovci") && r.has("hlodavci");
};
const smiPar = (a: Zastupce, b: Zastupce) => a !== b && !past(a, b);

// ═══════════════════════════ L1 — zapamatování ═══════════════════════════

// (a) soused v posloupnosti
function l1Soused(): PracticeTask | null {
  const x = 1 + Math.floor(Math.random() * 5);
  const pod = Math.random() < 0.5;
  const s = pod ? 1 : -1;
  const key = x + s;
  const X = KAT[x];
  const smer = pod ? "pod" : "nad";
  const kand: [number, string][] = [
    [x - s, `Tohle je opačný směr – nahoře je nejširší skupina (říše), dole nejužší (druh). ${cap(smer)} kategorií „${X}“ hledáš skupinu ${pod ? "užší" : "širší"}.`],
    [x + 2 * s, `Jednu kategorii jsi přeskočil. „${KAT[x + 2 * s] ?? ""}“ leží o dvě místa ${pod ? "níž" : "výš"}, hned ${smer} „${X}“ je ještě jiná.`],
    [x - 2 * s, `Tahle kategorie leží o dvě místa ${pod ? "výš" : "níž"} – je to opačný směr, a ještě s přeskočením.`],
  ];
  for (const i of [0, 6, 1, 5, 2, 4, 3]) {
    kand.push([i, `Kategorie „${KAT[i]}“ neleží hned vedle kategorie „${X}“, je od ní o ${mist(Math.abs(i - x))} ${i < x ? "výš" : "níž"}.`]);
  }
  const d: Distractor[] = kand
    .filter(([i]) => i >= 0 && i <= 6 && i !== x && i !== key)
    .map(([i, why]) => ({ value: KAT[i], why }));
  return choice(
    `Která kategorie leží v žebříčku třídění hned ${smer} kategorií „${X}“?`,
    KAT[key],
    d,
    {
      hints: [
        `Najdi v posloupnosti kategorií od největší skupiny po nejmenší kategorii „${X}“. ${cap(smer)} ní leží skupina ${pod ? "užší" : "širší"} – která?`,
        `Kategorie „${X}“ je v posloupnosti sedmi kategorií na ${x + 1}. místě. Hledaná kategorie je o jedno místo ${pod ? "níž, tedy na " + (x + 2) : "výš, tedy na " + x}. místě. ${cap(smer)} znamená ${pod ? "užší" : "širší"} skupinu.`,
      ],
      explanation: `Kategorie jdou od nejširší po nejužší: říše > kmen > třída > řád > čeleď > rod > druh. Hned ${smer} kategorií „${X}“ je proto „${KAT[key]}“.`,
    },
  );
}

// (b) nejširší / nejužší ze čtyř
function l1Krajni(): PracticeTask | null {
  const idx = pickN([0, 1, 2, 3, 4, 5, 6], 4);
  const sir = Math.random() < 0.5;
  const key = sir ? Math.min(...idx) : Math.max(...idx);
  const opak = sir ? Math.max(...idx) : Math.min(...idx);
  const org = pick(ZASTUPCI);
  const chybi = [0, 1, 2, 3, 4, 5, 6].filter((i) => !idx.includes(i)).map((i) => `„${KAT[i]}“`);
  const d: Distractor[] = idx
    .filter((i) => i !== key)
    .map((i) => ({
      value: KAT[i],
      why:
        i === opak
          ? `Tohle je opačný směr – „${KAT[i]}“ je z nabízených kategorií ${sir ? "nejužší" : "nejširší"}. Nahoře je nejširší skupina (říše), dole nejužší (druh).`
          : `Kategorie „${KAT[i]}“ je ${sir ? "širší" : "užší"} než některé nabízené, ale ${sir ? "nad" : "pod"} ní leží ještě jiná z nabídky.`,
    }));
  return choice(
    `Zařazení ${org.gen} do systému má sedm kategorií. Která z těchto čtyř je ${sir ? "nejširší" : "nejužší"}?`,
    KAT[key],
    d,
    {
      hints: [
        `V nabídce chybí ${seznam(chybi)}. Ze zbylých čtyř kategorií vyber tu, do které u ${org.gen} patří ${sir ? "nejvíc" : "nejméně"} dalších organismů.`,
        `Čím širší skupina, tím víc organismů zahrnuje. Posloupnost začíná skupinou, kam patří třeba všichni živočichové, a končí skupinou jedinců, kteří se spolu přirozeně kříží a mají plodné potomky. U ${org.gen} projdi nabídnuté kategorie ${sir ? "odshora a vezmi tu nejvyšší" : "odspodu a vezmi tu nejnižší"}.`,
      ],
      explanation: `Kategorie jdou od nejširší po nejužší: říše > kmen > třída > řád > čeleď > rod > druh. Z nabízených leží ${sir ? "nejvýš" : "nejníž"} „${KAT[key]}“, proto je ${sir ? "nejširší" : "nejužší"}.`,
    },
  );
}

// (c) hlavní skupina organismu
interface SkupinaUloha { org: string; key: string; d: [string, string][]; h: [string, string]; exp: string }
const PROC_HOUBY = "Houby nemají chlorofyl a nedělají fotosyntézu, tvoří samostatnou říši.";
const SKUPINY: SkupinaUloha[] = [
  {
    org: "hřib smrkový", key: "houby",
    d: [
      ["rostliny", `Hřib roste ze země jako rostlina, ale nemá listy ani chlorofyl. ${PROC_HOUBY}`],
      ["živočichové", "Hřib se nepohybuje a nemá orgány živočichů. Živiny získává podhoubím, které žije v soužití s kořeny smrku."],
      ["bakterie", "Bakterie jsou jednobuněčné a pouhým okem je nevidíš. Hřib je velká mnohobuněčná plodnice."],
    ],
    h: ["Má hřib smrkový zelené listy? Umí si sám vyrobit potravu ze světla?", "Organismus bez chlorofylu, který živiny získává podhoubím v soužití s kořeny stromů, nepatří mezi rostliny ani mezi živočichy."],
    exp: "Hřib nemá chlorofyl, živiny získává podhoubím, které žije v soužití (mykorhize) s kořeny smrku, a nad zem vyrůstá jen jeho plodnice. Proto patří mezi houby, ne mezi rostliny.",
  },
  {
    org: "bedla vysoká", key: "houby",
    d: [
      ["rostliny", `Bedla roste na louce mezi trávou, ale nedělá fotosyntézu. ${PROC_HOUBY}`],
      ["živočichové", "Bedla se nehýbe, nemá ústa ani trávicí soustavu. Živiny nasává z okolí podhoubím."],
      ["prvoci", "Prvoci jsou jednobuněční a žijí hlavně ve vodě. Bedla je velká mnohobuněčná plodnice."],
    ],
    h: ["Čím se bedla vysoká živí, když nemá zelené listy?", "Plodnice na louce je jen malá část organismu. Pod zemí je spleť vláken, která rozkládá odumřelé zbytky. Kdo takhle žije?"],
    exp: "Bedla je plodnice organismu, který nemá chlorofyl a živí se rozkladem. Takové organismy tvoří samostatnou říši hub.",
  },
  {
    org: "muchomůrka zelená", key: "houby",
    d: [
      ["rostliny", `Muchomůrka má zelenavý klobouk, ale ten zelený odstín není chlorofyl. ${PROC_HOUBY}`],
      ["bakterie", "Jedovaté látky tvoří i některé bakterie, ale muchomůrka je velká mnohobuněčná plodnice."],
      ["živočichové", "Muchomůrka se nepohybuje a potravu nepolyká. Živiny získává podhoubím v půdě."],
    ],
    h: ["Zelenavá barva klobouku muchomůrky zelené neznamená, že dělá fotosyntézu. Jak se tedy živí?", "Rozhoduje způsob výživy, ne barva: kdo nemá chlorofyl a živiny získává podhoubím (u muchomůrky v soužití s kořeny stromů), nepatří mezi rostliny."],
    exp: "Muchomůrka zelená (smrtelně jedovatá) je plodnice houby. Nemá chlorofyl a živiny získává podhoubím, které žije v soužití s kořeny stromů (dubů, buků), proto patří mezi houby.",
  },
  {
    org: "kvasinka pivní", key: "houby",
    d: [
      ["bakterie", "Kvasinka je drobná a jednobuněčná jako bakterie, ale její buňka má jádro. Patří k houbám."],
      ["rostliny", `Kvasinka nemá chlorofyl a světlo k životu nepotřebuje. ${PROC_HOUBY}`],
      ["prvoci", "Kvasinka se nepohybuje a nepřijímá potravu jako prvok. Množí se pučením a živí se cukry z okolí."],
    ],
    h: ["Kvasinka pivní je jednobuněčná. Má ale její buňka jádro, nebo ne?", "Jednobuněčnost nerozhoduje. Rozhoduje, jestli má buňka jádro, jestli má chlorofyl a jak se organismus živí."],
    exp: "Kvasinky jsou jednobuněčné houby: jejich buňka má jádro, nemají chlorofyl a živí se cukry. Díky nim kyne těsto a kvasí pivo.",
  },
  {
    org: "plíseň hlavičková", key: "houby",
    d: [
      ["rostliny", `Plíseň roste na chlebu jako povlak, ale nedělá fotosyntézu. ${PROC_HOUBY}`],
      ["bakterie", "Plíseň také kazí potraviny jako bakterie, ale tvoří vlákna a výtrusy. Je to houba."],
      ["živočichové", "Plíseň se nepohybuje a potravu nepolyká. Rozrůstá se vlákny, která rozkládají potravinu."],
    ],
    h: ["Z čeho se skládá chlupatý povlak, který plíseň hlavičková vytvoří na starém chlebu?", "Vlákna, která prorůstají potravinou a tvoří výtrusy, jsou znakem organismů bez chlorofylu, které se živí rozkladem."],
    exp: "Plíseň hlavičková tvoří vlákna podhoubí a výtrusy a živí se rozkladem potravin. Je to houba.",
  },
  {
    org: "mech ploník", key: "rostliny",
    d: [
      ["houby", "Mech roste ve stínu a vlhku jako houby, ale je zelený a dělá fotosyntézu. Houby chlorofyl nemají."],
      ["živočichové", "Mech se nepohybuje a potravu nepřijímá. Vyrábí si ji sám ze světla, vody a oxidu uhličitého."],
      ["bakterie", "Mech je mnohobuněčný a jeho buňky mají jádro. Bakterie jsou jednobuněčné a jádro nemají."],
    ],
    h: ["Jakou barvu má mech ploník a co mu ta barva umožňuje?", "Zelená barva pochází z chlorofylu. Organismy, které si díky němu vyrábějí potravu ze světla, patří do jedné říše."],
    exp: "Mech je zelený, má chlorofyl a dělá fotosyntézu. Patří proto mezi rostliny, i když nemá pravé kořeny.",
  },
  {
    org: "přeslička rolní", key: "rostliny",
    d: [
      ["houby", "Přeslička se rozmnožuje výtrusy jako houby, ale je zelená a dělá fotosyntézu."],
      ["živočichové", "Přeslička nemá žádné orgány k pohybu ani k lovu. Potravu si vyrábí sama ze světla."],
      ["prvoci", "Prvoci jsou jednobuněční. Přeslička je mnohobuněčná a má stonek i kořeny."],
    ],
    h: ["Přeslička rolní se množí výtrusy. Je to ale důvod, proč ji nepočítat k zeleným organismům s fotosyntézou?", "Výtrusy mají houby i některé zelené organismy. Rozhoduje chlorofyl a fotosyntéza."],
    exp: "Přeslička je zelená, má chlorofyl a dělá fotosyntézu. Výtrusy tvoří i jiné výtrusné rostliny, třeba kapradiny.",
  },
  {
    org: "rosnatka okrouhlolistá", key: "rostliny",
    d: [
      ["živočichové", "Rosnatka chytá hmyz, ale má zelené listy a dělá fotosyntézu. Hmyzem si jen doplňuje živiny."],
      ["houby", "Rosnatka roste v rašeliništi, ale má chlorofyl. Houby chlorofyl nemají."],
      ["prvoci", "Prvoci jsou jednobuněční. Rosnatka je mnohobuněčná a má listy, stonek i kořeny."],
    ],
    h: ["Rosnatka okrouhlolistá chytá hmyz na lepkavé chloupky. Jakou barvu mají její listy?", "Lov kořisti nerozhoduje. Organismus se zelenými listy a fotosyntézou si hmyzem jen doplňuje dusík, který v chudé půdě chybí."],
    exp: "Rosnatka je masožravá rostlina: má chlorofyl a dělá fotosyntézu, hmyzem si jen doplňuje živiny z chudé půdy.",
  },
  {
    org: "trepka velká", key: "prvoci",
    d: [
      ["houby", "Trepka se aktivně pohybuje brvami a potravu pohlcuje. Houby se nepohybují a potravu nepohlcují, živiny vstřebávají z okolí."],
      ["bakterie", "Trepka je jednobuněčná jako bakterie, ale její buňka má jádro a je mnohem složitější."],
      ["rostliny", "Trepka nemá chlorofyl a potravu (hlavně bakterie) pohlcuje. Fotosyntézu nedělá."],
    ],
    h: ["Z kolika buněk se skládá tělo trepky velké? Má její buňka jádro?", "Pohyb a přijímání potravy nerozhoduje. Jednobuněčné organismy s jádrem, které se živí jako živočichové, tvoří v učebnici samostatnou skupinu."],
    exp: "Trepka je jediná buňka s jádrem, která se pohybuje brvami a pohlcuje potravu. Učebnice ji řadí mezi jednobuněčné organismy – prvoky.",
  },
  {
    org: "měňavka velká", key: "prvoci",
    d: [
      ["rostliny", "Měňavka nemá chlorofyl a fotosyntézu nedělá, potravu obtéká panožkami a pohlcuje. Rostliny chlorofyl mají."],
      ["bakterie", "Měňavka je jednobuněčná, ale její buňka má jádro a je mnohem větší než bakterie."],
      ["houby", "Měňavka se aktivně pohybuje panožkami a pohlcuje potravu. Houby se nepohybují."],
    ],
    h: ["Měňavka velká mění tvar a vysouvá panožky. Kolik buněk tvoří celé její tělo?", "Rozhoduje stavba těla: jediná buňka s jádrem, která se pohybuje a pohlcuje potravu, patří do jiné skupiny než mnohobuněční živočichové."],
    exp: "Měňavka je jediná buňka s jádrem, pohybuje se panožkami a potravu obtéká. Patří mezi jednobuněčné organismy – prvoky.",
  },
  {
    org: "sinice", key: "bakterie",
    d: [
      ["rostliny", "Sinice jsou modrozelené a dělají fotosyntézu jako rostliny, ale jejich buňky nemají jádro. Patří k bakteriím."],
      ["prvoci", "Sinice mají jednoduché buňky (často spojené do vláken nebo kolonií), ale bez jádra. Prvoci jádro mají."],
      ["houby", "Sinice mají barviva a dělají fotosyntézu. Houby chlorofyl nemají."],
    ],
    h: ["Sinice dělají fotosyntézu. Má ale jejich buňka jádro?", "Fotosyntéza nerozhoduje. Rozhoduje stavba buňky: organismy, jejichž buňky nemají jádro, tvoří samostatnou skupinu."],
    exp: "Sinice dělají fotosyntézu, ale jejich buňka nemá jádro. Proto patří mezi bakterie, ne mezi rostliny.",
  },
  {
    org: "nezmar zelený", key: "živočichové",
    d: [
      ["rostliny", "Nezmar je přisedlý a zelený (v těle má drobné řasy), ale loví kořist žahavými buňkami. Je to živočich."],
      ["prvoci", "Nezmar je mnohobuněčný a má žahavé buňky i chapadla. Prvoci jsou jednobuněční."],
      ["houby", "Nezmar se živí lovem, ne rozkladem, a umí se pomalu přemisťovat. Houby to nedokážou."],
    ],
    h: ["Nezmar zelený sedí přichycený ve vodě. Co dělá svými chapadly?", "Zelená barva nezmara pochází z řas, které v něm žijí. Rozhoduje, že loví kořist žahavými buňkami a je mnohobuněčný."],
    exp: "Nezmar je mnohobuněčný, chapadly se žahavými buňkami loví drobné korýše. Patří mezi živočichy (žahavce).",
  },
  {
    org: "houba mycí z mořského dna", key: "živočichové",
    d: [
      ["houby", "Jmenuje se houba, ale je to přisedlý mořský živočich, který filtruje potravu z vody."],
      ["rostliny", "Mořská houba sedí na dně jako rostlina, ale nemá chlorofyl a potravu filtruje z vody."],
      ["prvoci", "Mořská houba je mnohobuněčná, její tělo tvoří mnoho spolupracujících buněk."],
    ],
    h: ["Mořská houba mycí nasává vodu póry. Co z té vody získává?", "Jméno nerozhoduje. Mnohobuněčný organismus, který přijímá potravu (filtruje ji z vody), je živočich, i když se nepohybuje."],
    exp: "Mořské houby jsou přisedlí mnohobuněční živočichové: filtrují z vody drobnou potravu. S houbami (hřiby) mají společné jen jméno.",
  },
  {
    org: "sasanka koňská z mořského pobřeží", key: "živočichové",
    d: [
      ["rostliny", "Stejné jméno má i jarní kytka, ale sasanka koňská je mořský živočich s chapadly, který loví kořist."],
      ["houby", "Sasanka koňská se živí lovem, ne rozkladem. Houby kořist neloví."],
      ["prvoci", "Sasanka koňská je mnohobuněčná a má chapadla se žahavými buňkami. Prvoci jsou jednobuněční."],
    ],
    h: ["Sasanka koňská z moře vypadá jako květ. Co ale dělá svými „okvětními lístky“?", "Jméno připomíná jarní kytku, rozhoduje ale výživa: chapadla se žahavými buňkami chytají kořist."],
    exp: "Mořská sasanka je žahavec: mnohobuněčný živočich, který chapadly se žahavými buňkami loví drobné živočichy.",
  },
];
function l1Skupina(): PracticeTask | null {
  const u = pick(SKUPINY);
  return choice(
    `Do které hlavní skupiny organismů patří ${u.org}?`,
    u.key,
    u.d.map(([value, why]) => ({ value, why })),
    { hints: u.h, explanation: u.exp },
  );
}

// ═══════════════════════════ L2 — použití ═══════════════════════════

// (a) kategorie údaje v zařazení
function l2Kategorie(): PracticeTask | null {
  const org = pick(ZASTUPCI);
  const r = 1 + Math.floor(Math.random() * 5);
  const ch = retez(org);
  const v = ch[r];
  const why = (i: number) =>
    i === 6 && r === 5
      ? `Kategorie „druh“ je u ${org.gen} obsazená údajem „${ch[6]}“. Druh se píše dvěma slovy, rod jedním.`
      : `Kategorie „${KAT[i]}“ je u ${org.gen} obsazená údajem „${ch[i]}“, který stojí o ${mist(Math.abs(i - r))} ${i < r ? "před" : "za"} údajem „${v}“.`;
  const poradi = [r - 1, r + 1, r - 2, r + 2, 0, 6].filter((i) => i >= 0 && i <= 6 && i !== r);
  return choice(
    `Zařazení ${org.gen} do systému, postupně od nejširší skupiny k nejužší: ${ch.join(", ")}. Do které kategorie patří údaj „${v}“?`,
    KAT[r],
    [...new Set(poradi)].map((i) => ({ value: KAT[i], why: why(i) })),
    {
      hints: [
        `V zařazení ${org.gen} spočítej, na kolikátém místě stojí údaj „${v}“.`,
        `Zařazení ${org.gen} se píše ve stejném sledu sedmi kategorií jako u každého organismu: první údaj patří říši, poslední druhu a kategorie mezi nimi jdou v pevném sledu. Která z nich patří na místo, kde stojí „${v}“?`,
      ],
      explanation: `Zařazení se píše vždy od říše po druh: říše > kmen > třída > řád > čeleď > rod > druh. Údaj „${v}“ stojí na ${r + 1}. místě, a to patří kategorii „${KAT[r]}“.`,
    },
  );
}

// (b) stejný řád, jiná čeleď
const RADY_S_VICE_CELEDMI = ["šelmy", "pěvci", "blanokřídlí"];
function l2StejnyRad(): PracticeTask | null {
  const R = pick(ZASTUPCI.filter((a) => RADY_S_VICE_CELEDMI.includes(a.sys[2])));
  const [, , rad, celed] = R.sys;
  const ost = ZASTUPCI.filter((a) => smiPar(a, R));
  const klice = ost.filter((a) => hloubka(a, R) === 3);
  if (!klice.length) return null;
  const K = pick(klice);
  const stejnaCeled = ost.filter((a) => hloubka(a, R) >= 4);
  const trida = ost.filter((a) => hloubka(a, R) === 2);
  const kmen = ost.filter((a) => hloubka(a, R) === 1);
  const jinyKmen = ost.filter((a) => hloubka(a, R) === 0);
  const skupiny: { a: Zastupce; why: string }[] = [];
  const nom = cap(R.nom);
  if (stejnaCeled.length) {
    const D = pick(stejnaCeled);
    skupiny.push({ a: D, why: `${cap(D.nom)} je sice ve stejném řádu (${rad}), ale i ve stejné čeledi (${celed}) jako ${R.nom}. Hledáš jinou čeleď.` });
  }
  const dalsi = shuffle([
    trida.length ? (() => { const D = pick(trida); return { a: D, why: `${cap(D.nom)} a ${R.nom} mají společnou jen třídu (${D.sys[1]}). ${cap(D.nom)} patří do řádu ${D.sys[2]}, ne do řádu ${rad}.` }; })() : null,
    kmen.length ? (() => { const D = pick(kmen); return { a: D, why: `${cap(D.nom)} a ${R.nom} mají společný jen kmen (${D.sys[0]}). ${cap(D.nom)} je ze třídy ${D.sys[1]}, do řádu ${rad} tedy patřit nemůže.` }; })() : null,
    jinyKmen.length ? (() => { const D = pick(jinyKmen); return { a: D, why: `${cap(D.nom)} a ${R.nom} nemají společný ani kmen (${D.sys[0]} × ${R.sys[0]}), natož řád.` }; })() : null,
  ].filter((x): x is { a: Zastupce; why: string } => x !== null));
  skupiny.push(...dalsi);
  const vybrane = skupiny.slice(0, 3);
  const nejdal = vybrane[vybrane.length - 1]?.a;
  if (vybrane.length < 3 || !nejdal) return null;
  const pastCeled = stejnaCeled.length ? vybrane[0].a : null;
  return choice(
    `${nom} patří do řádu ${rad} a do čeledi ${celed}. Který z těchto živočichů patří do stejného řádu, ale do jiné čeledi?`,
    K.nom,
    vybrane.map((x) => ({ value: x.a.nom, why: x.why })),
    {
      hints: [
        `U každé možnosti si nejdřív ověř, jestli patří do řádu ${rad}. Kdo do něj nepatří, odpadá – začni třeba u možnosti ${nejdal.nom}.`,
        `Stejný řád a jiná čeleď znamená, že se zařazení obou živočichů shoduje až po řád a rozejde se teprve u čeledi. Kdo patří do stejné čeledi (${celed}) jako ${R.nom}, nevyhovuje.${pastCeled ? ` Možnost ${pastCeled.nom} si proto prověř zvlášť pečlivě.` : ` Porovnej proto u každé možnosti řád i čeleď.`}`,
      ],
      explanation: `${cap(K.nom)} patří do stejného řádu (${K.sys[2]}) jako ${R.nom}, ale do čeledi ${K.sys[3]}, ne do čeledi ${celed}. Ostatní možnosti buď patří i do stejné čeledi, nebo se od ${R.gen} liší už v řádu či v ještě širší kategorii.`,
    },
  );
}

// (c) dvojice se společnou kategorií r1, ale ne r1+1
function vsechnyPary(): [Zastupce, Zastupce][] {
  const out: [Zastupce, Zastupce][] = [];
  for (let i = 0; i < ZASTUPCI.length; i++) {
    for (let j = i + 1; j < ZASTUPCI.length; j++) {
      if (smiPar(ZASTUPCI[i], ZASTUPCI[j])) out.push([ZASTUPCI[i], ZASTUPCI[j]]);
    }
  }
  return out;
}
const PARY = vsechnyPary();
const parText = ([a, b]: [Zastupce, Zastupce]) => `${a.nom} a ${b.nom}`;

function l2Dvojice(): PracticeTask | null {
  const r1 = 1 + Math.floor(Math.random() * 4);
  const r2 = r1 + 1;
  const klicove = PARY.filter((p) => hloubka(p[0], p[1]) === r1);
  const hlubsi = PARY.filter((p) => hloubka(p[0], p[1]) > r1);
  const mensi = PARY.filter((p) => hloubka(p[0], p[1]) < r1);
  const K = pick(klicove);
  const orient = (p: [Zastupce, Zastupce]): [Zastupce, Zastupce] => (Math.random() < 0.5 ? p : [p[1], p[0]]);
  const key = orient(K);
  const distr: [Zastupce, Zastupce][] = [];
  if (hlubsi.length) distr.push(orient(pick(hlubsi)));
  distr.push(...pickN(mensi, 3 - distr.length).map(orient));
  // Tři distraktory se stejným prvním živočichem a klíč s jiným = klíč pozná
  // dítě podle tvaru, ne podle zařazení (check:options, 16. 9.). Losuj znovu.
  const prvni = (p: [Zastupce, Zastupce]) => p[0].nom.split(" ")[0];
  if (distr.length === 3 && distr.every((p) => prvni(p) === prvni(distr[0])) && prvni(key) !== prvni(distr[0])) return null;
  const d: Distractor[] = distr.map((p) => {
    const h = hloubka(p[0], p[1]);
    return h > r1
      ? { value: parText(p), why: `${cap(parText(p))} mají ${spolecn(r2)} i ${TVARY[r2].acc} (${hodnota(p[0], r2)}), takže podmínku „ale ne ${TVARY[r2].acc}“ nesplňují.` }
      : { value: parText(p), why: `${cap(parText(p))} nemají ${spolecn(r1)} ${TVARY[r1].acc} (${hodnota(p[0], r1)} × ${hodnota(p[1], r1)}), jejich zařazení se rozejde už dřív.` };
  });
  // Řády, čeledi a rody zpaměti 6. ročník neumí → od r1 ≥ 2 je zadání uvádí.
  const zvirata = shuffle([...new Set([key, ...distr].flat())]);
  const zarazeni = r1 >= 2
    ? `Zařazení (řád, čeleď, rod): ${zvirata.map((a) => `${a.nom} – ${a.sys[2]}, ${a.sys[3]}, ${a.sys[4]}`).join("; ")}. `
    : "";
  return choice(
    `${zarazeni}Která dvojice živočichů má ${spolecn(r1)} ${TVARY[r1].acc}, ale ne ${TVARY[r2].acc}?`,
    parText(key),
    d,
    {
      hints: [
        `U každé dvojice porovnávej zařazení obou živočichů od kmene dolů a zjisti, u které kategorie se rozejdou. Začni třeba dvojicí ${parText(distr[0])}.`,
        `Hledáš dvojici, jejíž zařazení se shoduje ještě v kategorii „${KAT[r1]}“, ale rozejde se hned v kategorii „${KAT[r2]}“. Dvojice, která se rozejde dřív nebo později, nevyhovuje – prověř tak třeba dvojici ${parText(distr[distr.length - 1])}.`,
      ],
      explanation: `${cap(parText(key))} mají ${spolecn(r1)} ${TVARY[r1].acc} (${hodnota(key[0], r1)}), ale ${TVARY[r2].acc} už ne: ${hodnota(key[0], r2)} × ${hodnota(key[1], r2)}. Ostatní dvojice mají buď ${spolecn(r2)} i ${TVARY[r2].acc}, nebo se rozejdou už dřív.`,
    },
  );
}

// ═══════════════════════════ L3 — analýza a přenos ═══════════════════════════

// (a) co jistě plyne ze společné kategorie
function l3Jiste(): PracticeTask | null {
  const s = 1 + Math.floor(Math.random() * 5);
  const p = pick(PARY.filter((x) => hloubka(x[0], x[1]) === s));
  const [A, B] = Math.random() < 0.5 ? p : [p[1], p[0]];
  const sirsi = Array.from({ length: s }, (_, i) => s - 1 - i); // od nejbližší širší
  const uzsi = s + 1;
  const W1 = sirsi[0];
  const W2 = sirsi[Math.min(1, sirsi.length - 1)];
  const key = `Mají ${spolecn(W1)} i ${seznam(sirsi.map((i) => TVARY[i].acc))}.`;
  const jedn = (r: number) => (TVARY[r].zen ? "jedné" : "jednoho");
  const jen1 = (r: number) => (TVARY[r].zen ? "jen jedna" : "jen jeden");
  // Příklad pro danou úroveň s: jiná dvojice se společnou kategorií s, která se rozejde v kategorii uzsi.
  const vzory = PARY.filter((x) => hloubka(x[0], x[1]) === s && x !== p);
  const vzor = vzory.length ? pick(vzory) : null;
  const priklad = !vzor
    ? ""
    : s === 5
      ? ` Třeba ${vzor[0].nom} a ${vzor[1].nom} mají společný rod, ale jsou to dva různé druhy.`
      : ` Třeba ${vzor[0].nom} a ${vzor[1].nom} mají ${spolecn(s)} ${TVARY[s].acc} (${hodnota(vzor[0], s)}), ale v kategorii „${KAT[uzsi]}“ se liší (${hodnota(vzor[0], uzsi)} × ${hodnota(vzor[1], uzsi)}).`;
  const d: Distractor[] = [
    {
      value: `Mají ${spolecn(uzsi)} i ${TVARY[uzsi].acc}, protože do ${jedn(s)} ${TVARY[s].gen} patří ${jen1(uzsi)} ${KAT[uzsi]}.`,
      why: `Do ${jedn(s)} ${TVARY[s].gen} obvykle patří víc skupin „${KAT[uzsi]}“.${priklad} Užší kategorie se ze společné širší nedá odvodit.`,
    },
    {
      value: `Mají ${spolecn(s)} jen ${TVARY[s].acc}; o jejich ${TVARY[W1].loc} nic nevíme.`,
      why: `Každá skupina „${KAT[s]}“ leží celá uvnitř jediné skupiny „${KAT[W1]}“. Když mají ${spolecn(s)} ${TVARY[s].acc}, mají společné i všechny širší kategorie.`,
    },
    {
      value: `Mají ${spolecn(s)} ${TVARY[s].acc}, ale mohou patřit do různých ${TVARY[W2].genPl}.`,
      why: `Jedna skupina „${KAT[s]}“ se nikdy nerozdělí mezi dvě různé skupiny „${KAT[W2]}“. Širší kategorie mají proto oba živočichové jistě stejné.`,
    },
  ];
  return choice(
    `${cap(A.nom)} a ${B.nom} patří do ${stejn(s)} ${TVARY[s].gen}. Co z toho o nich jistě víme?`,
    key,
    d,
    {
      hints: [
        `Najdi v systému kategorii „${KAT[s]}“, ve které se ${A.nom} a ${B.nom} potkávají. Co z toho plyne pro kategorie nad ní a co pro kategorie pod ní?`,
        `Každá užší skupina leží celá uvnitř jedné širší – jako když je každý byt celý v jednom domě a každý dům celý v jedné ulici. Jedna širší skupina ale obvykle zahrnuje víc užších. Ze společné kategorie „${KAT[s]}“ u dvojice ${A.nom} a ${B.nom} tedy něco jistě plyne jen jedním směrem.`,
      ],
      explanation: `Každá skupina „${KAT[s]}“ leží celá uvnitř jediné skupiny každé širší kategorie. Kdo má ${spolecn(s)} ${TVARY[s].acc}, má proto společné i všechny širší kategorie. Užší kategorie („${KAT[uzsi]}“) společná být nemusí: ${s === 5 ? `${A.nom} a ${B.nom} jsou dva různé druhy` : `u kategorie „${KAT[uzsi]}“ se ${A.nom} a ${B.nom} rozcházejí (${hodnota(A, uzsi)} × ${hodnota(B, uzsi)})`}.`,
    },
  );
}

// (b) nejbližší příbuzný
const hodnotaText = (a: Zastupce, d: number) => `${KAT[d]} ${hodnota(a, d)}`;
function l3Pribuzny(): PracticeTask | null {
  const A = pick(ZASTUPCI);
  const ost = ZASTUPCI.filter((b) => smiPar(A, b));
  // Nejvýš společný řád (kd ≤ 3): čeledi a rody zpaměti 6. ročník neumí.
  const kandidati = ost.filter((b) => hloubka(A, b) >= 2 && hloubka(A, b) <= 3);
  if (!kandidati.length) return null;
  const K = pick(kandidati);
  const kd = hloubka(A, K);
  const nizsi = ost.filter((b) => hloubka(A, b) < kd);
  const vyber: Zastupce[] = [];
  for (let d = kd - 1; d >= 0 && vyber.length < 3; d--) {
    const s = nizsi.filter((b) => hloubka(A, b) === d);
    if (s.length) vyber.push(pick(s));
  }
  for (const b of shuffle(nizsi)) if (vyber.length < 3 && !vyber.includes(b)) vyber.push(b);
  if (vyber.length < 3) return null;
  const d: Distractor[] = vyber.map((D) => {
    const h = hloubka(A, D);
    return {
      value: D.nom,
      why: `Nejužší skupina, kterou mají ${A.nom} a ${D.nom} společnou, je ${hodnotaText(A, h)}. U dvojice ${A.nom} a ${K.nom} je to ${hodnotaText(A, kd)}, a ta skupina je užší. ${h === kd - 1 ? "Podobný vzhled nebo prostředí o příbuznosti nerozhoduje." : ""}`.trim(),
    };
  });
  const past1 = vyber[0];
  const nejdal = vyber[vyber.length - 1];
  return choice(
    `Se kterým z těchto živočichů je ${A.nom} nejblíž příbuzn${A.zen ? "á" : "ý"}?`,
    K.nom,
    d,
    {
      hints: [
        `Porovnej zařazení ${A.gen} s každou z možností a zjisti, u které kategorie se jejich zařazení rozejde. Třeba s možností ${nejdal.nom} se rozejde hodně brzy.`,
        `Příbuznost neurčuje vzhled, velikost ani prostředí, ale to, jak hluboko v systému mají dva organismy ještě společnou skupinu. Čím užší ta společná skupina, tím bližší příbuzní. U možnosti ${past1.nom} se zařazení shoduje se zařazením ${A.gen} ještě v kategorii „${KAT[hloubka(A, past1)]}“, ale v kategorii „${KAT[hloubka(A, past1) + 1]}“ už ne. Najdi možnost, která se shoduje ještě déle.`,
      ],
      explanation: `Příbuznost poznáš podle nejužší společné skupiny. ${cap(A.nom)} a ${K.nom} mají společnou i kategorii „${KAT[kd]}“ (${hodnota(A, kd)}). S ostatními možnostmi se zařazení ${A.gen} rozejde dřív, výš v systému.`,
    },
  );
}

// (c) zařazení podle popisu znaků
interface ZnakUloha { popis: string; key: string; d: [string, string][]; h: [string, string] }
const ZNAKY: ZnakUloha[] = [
  {
    popis: "létá v noci, tělo mu kryje srst a mláďata kojí mlékem", key: "savci",
    d: [
      ["ptáci", "Létání nerozhoduje – netopýr létá, a přesto má srst a kojí mláďata. Ptáci mají peří a mláďata nekojí."],
      ["hmyz", "Hmyz má šest nohou a tělo kryté kutikulou, srst ani mléko nemá."],
      ["plazi", "Plazi mají suchou šupinatou kůži a mláďata nekojí."],
    ],
    h: ["Který z uvedených znaků má jen jedna třída obratlovců – létání, nebo kojení?", "Létat umějí ptáci, hmyz i netopýři, takže létání o třídě nerozhoduje. Rozhodují znaky stavby těla: čím je kryté tělo a jak se krmí mláďata."],
  },
  {
    popis: "žije celý život v moři, dýchá plícemi, rodí živá mláďata a kojí je", key: "savci",
    d: [
      ["ryby", "Život ve vodě nerozhoduje – ryby dýchají žábrami a nekojí. Velryba i delfín dýchají plícemi a kojí, jsou to savci."],
      ["obojživelníci", "Obojživelníci většinou kladou vajíčka do vody a jejich larvy dýchají žábrami. Mláďata nekojí."],
      ["plazi", "Plazi mláďata nekojí a většinou kladou vejce."],
    ],
    h: ["Moře je jen prostředí. Který znak v popisu mluví o tom, jak se krmí mláďata?", "Třídu neurčuje, kde živočich žije, ale jak dýchá a jak se starají o mláďata. Plíce a kojení dohromady mají jen jedni obratlovci."],
  },
  {
    popis: "nelétá, obratně plave v ledovém moři, tělo mu kryje peří a má zobák", key: "ptáci",
    d: [
      ["ryby", "Plavání nerozhoduje – ryby mají šupiny a žábry. Tučňák má peří, je to pták, i když nelétá."],
      ["savci", "Savci mají srst a mláďata kojí, peří nemají."],
      ["obojživelníci", "Obojživelníci mají holou vlhkou kůži, peří nemají."],
    ],
    h: ["Popisovaný živočich nelétá. Je to ale důvod ho vyřadit z třídy, kterou poznáš podle krytí těla?", "Létání ani plavání o třídě nerozhoduje. Rozhoduje, čím je kryté tělo."],
  },
  {
    popis: "má peří, bezzubý zobák a klade vejce s pevnou vápenitou skořápkou", key: "ptáci",
    d: [
      ["plazi", "Plazi také kladou vejce, ale jejich tělo kryjí šupiny, ne peří."],
      ["savci", "Peří mají jen ptáci. Savci mají srst a mláďata kojí."],
      ["obojživelníci", "Obojživelníci kladou měkká vajíčka do vody a peří nemají."],
    ],
    h: ["Vejce klade víc tříd obratlovců. Který znak z popisu mají jen jedni z nich?", "Hledej znak, který se nevyskytuje u žádné jiné třídy – třeba to, čím je kryté tělo."],
  },
  {
    popis: "žije ve vodě, dýchá žábrami, tělo kryjí šupiny a pohybuje se pomocí ploutví", key: "ryby",
    d: [
      ["obojživelníci", "Žábrami dýchají hlavně larvy obojživelníků. Obojživelníci ale nemají šupiny ani ploutve s paprsky."],
      ["savci", "Delfín má ploutve a žije ve vodě, ale dýchá plícemi. Žábry savci nemají."],
      ["plazi", "Plazi mají šupiny, ale dýchají plícemi, ne žábrami."],
    ],
    h: ["Kterou kombinaci znaků – šupiny, žábry, ploutve – nemá celá žádná jiná třída?", "Šupiny mají i plazi, ploutve i delfíni. Rozhoduje, čím živočich dýchá po celý život."],
  },
  {
    popis: "má holou vlhkou kůži a jeho larvy žijí ve vodě a dýchají žábrami", key: "obojživelníci",
    d: [
      ["ryby", "Žábry mají obvykle jen larvy, dospělci dýchají plícemi a kůží. Ryby mají šupiny a žábry celý život."],
      ["plazi", "Plazi mají suchou kůži se šupinami a jejich mláďata nemají žábry."],
      ["hmyz", "Larvy má i hmyz, ale hmyz má šest nohou a článkované tělo s vnější kostrou, ne holou vlhkou kůži obratlovce."],
    ],
    h: ["Kteří obratlovci žijí první část života ve vodě a pak na souši?", "Které z nabízených tříd mají v některé fázi života žábry? A která z nich má holou kůži bez šupin?"],
  },
  {
    popis: "má suchou kůži pokrytou šupinami, dýchá jen plícemi a vejce klade na souši", key: "plazi",
    d: [
      ["ryby", "Šupiny mají i ryby, ale ty dýchají žábrami a vejce kladou do vody."],
      ["obojživelníci", "Obojživelníci mají holou vlhkou kůži a vajíčka kladou do vody."],
      ["ptáci", "Ptáci kladou vejce na souši, ale tělo jim kryje peří."],
    ],
    h: ["Šupiny mají dvě třídy obratlovců. Který další znak z popisu je od sebe odliší?", "Rozhoduje, čím živočich se šupinami dýchá: žábrami, nebo plícemi."],
  },
  {
    popis: "má šest nohou, dvě tykadla a tělo rozdělené na hlavu, hruď a zadeček", key: "hmyz",
    d: [
      ["pavoukovci", "Pavoukovci mají osm nohou a nemají tykadla."],
      ["korýši", "Korýši mají dva páry tykadel a víc než šest nohou."],
      ["stonožky", "Stonožky mají mnoho článků těla a na každém pár nohou, ne jen šest nohou."],
    ],
    h: ["Spočítej nohy popisovaného živočicha. Která třída členovců má právě tolik?", "Členovce rozlišíš podle počtu nohou a tykadel a podle toho, z kolika částí je tělo."],
  },
  {
    popis: "má osm nohou, žádná tykadla a tělo složené ze dvou částí", key: "pavoukovci",
    d: [
      ["hmyz", "Pavouk není hmyz – hmyz má šest nohou, tykadla a tělo ze tří částí."],
      ["korýši", "Korýši mají tykadla (dva páry) a většinou žijí ve vodě."],
      ["stonožky", "Stonožky mají mnoho článků a mnoho nohou, také mají tykadla."],
    ],
    h: ["Kolik nohou má popisovaný živočich a má tykadla?", "Porovnej počet nohou a tykadel s každou nabízenou třídou členovců a vyřaď ty, které nesedí."],
  },
  {
    popis: "má dva páry tykadel, pevný krunýř a ve vodě dýchá žábrami", key: "korýši",
    d: [
      ["ryby", "Žábry mají i ryby, ale ryby jsou obratlovci s vnitřní kostrou a tykadla nemají."],
      ["hmyz", "Hmyz má jen jeden pár tykadel a šest nohou."],
      ["pavoukovci", "Pavoukovci nemají tykadla vůbec."],
    ],
    h: ["Kolik párů tykadel má popisovaný živočich? Který členovec dýchá ve vodě žábrami?", "Žábry nejsou jen u ryb. Zjisti, kolik párů tykadel mají jednotlivé nabízené třídy, a vyřaď ty, které tykadla nemají vůbec."],
  },
  {
    popis: "klade vejce, přesto má srst a mláďata krmí mlékem", key: "savci",
    d: [
      ["ptáci", "Kladení vajec nerozhoduje. Ptakopysk klade vejce, ale má srst a krmí mláďata mlékem – je to savec."],
      ["plazi", "Plazi kladou vejce, ale mají šupiny a mláďata mlékem nekrmí."],
      ["obojživelníci", "Obojživelníci mají holou kůži a mléko netvoří."],
    ],
    h: ["Vejce klade víc tříd. Který znak z popisu mají jen jedni obratlovci?", "Srst a mléčné žlázy rozhodují víc než kladení vajec – tak je to u australského ptakopyska."],
  },
  {
    popis: "má dlouhé tělo bez nohou, suchou šupinatou kůži a dýchá plícemi", key: "plazi",
    d: [
      ["ryby", "Ryby mají šupiny, ale dýchají žábrami a mají ploutve."],
      ["obojživelníci", "Obojživelníci mají holou vlhkou kůži, ne šupinatou. Slepýš i had mají kůži suchou."],
      ["savci", "Savci mají srst a mláďata kojí."],
    ],
    h: ["Chybějící nohy o třídě nerozhodují. Čím je kryté tělo a čím živočich dýchá?", "Had i slepýš nemají nohy. Suchá kůže se šupinami a dýchání plícemi ukazují na jednu třídu obratlovců."],
  },
  {
    popis: "má mnoho článků těla, na každém článku jeden pár nohou a na prvním jedové drápky", key: "stonožky",
    d: [
      ["hmyz", "Hmyz má jen šest nohou a tělo ze tří částí."],
      ["pavoukovci", "Pavoukovci mají osm nohou a tělo ze dvou částí."],
      ["korýši", "Korýši mají dva páry tykadel a pevný krunýř, většinou žijí ve vodě."],
    ],
    h: ["Kolik nohou má popisovaný živočich? Je jich šest, osm, nebo mnohem víc?", "Porovnej počet nohou s každou nabízenou třídou: kolik jich má hmyz a kolik pavoukovci? Která třída má nohy na každém článku těla?"],
  },
];
/** Rozlišovací znaky třídy (věta do vysvětlení) a 4. pád pro „zařadíš mezi …“. */
const TRIDA: Record<string, { znak: string; acc: string }> = {
  savci: { znak: "Srst nebo kojení mláďat mlékem mají ze všech živočichů jen savci.", acc: "savce" },
  ptáci: { znak: "Peří mají ze všech živočichů jen ptáci.", acc: "ptáky" },
  ryby: { znak: "Žábry po celý život spolu se šupinami a ploutvemi mají ryby.", acc: "ryby" },
  "obojživelníci": { znak: "Holou vlhkou kůži a larvy dýchající žábrami mají obojživelníci.", acc: "obojživelníky" },
  plazi: { znak: "Suchou šupinatou kůži a dýchání jen plícemi mají plazi.", acc: "plazy" },
  hmyz: { znak: "Šest nohou, jeden pár tykadel a tělo ze tří částí má hmyz.", acc: "hmyz" },
  pavoukovci: { znak: "Osm nohou a žádná tykadla mají pavoukovci.", acc: "pavoukovce" },
  "korýši": { znak: "Dva páry tykadel, pevný krunýř a dýchání žábrami mají korýši.", acc: "korýše" },
  stonožky: { znak: "Mnoho článků s párem nohou na každém z nich mají stonožky.", acc: "stonožky" },
};

function l3Znaky(): PracticeTask | null {
  const u = pick(ZNAKY);
  return choice(
    `Popis neznámého živočicha: ${u.popis}. Do které třídy ho zařadíš?`,
    u.key,
    u.d.map(([value, why]) => ({ value, why })),
    {
      hints: u.h,
      explanation: `Třídu určují znaky stavby těla, ne prostředí ani způsob pohybu. ${TRIDA[u.key].znak} Popsaného živočicha proto zařadíš mezi ${TRIDA[u.key].acc}.`,
    },
  );
}

// (d) počty druhů v užší a širší skupině (inverze)
const PARY_KAT: [number, number][] = [[5, 4], [5, 3], [4, 3], [4, 2], [3, 2]]; // [užší, širší]
/** Opačný směr (počet v širší skupině je daný) jen u skupin, které mívají málo druhů. */
const PARY_KAT_ZPET: [number, number][] = [[5, 4], [5, 3], [4, 3]];
const SKUP = ["živočichů", "rostlin", "hub"];
function l3Pocet(): PracticeTask | null {
  const dopredu = Math.random() < 0.5;
  const [lo, hi] = pick(dopredu ? PARY_KAT : PARY_KAT_ZPET);
  const n = 3 + Math.floor(Math.random() * 13);
  const grp = pick(SKUP);
  const L = KAT[lo], H = KAT[hi];
  const lz = TVARY[lo].zen, hz = TVARY[hi].zen;
  const N = druhu(n);
  if (dopredu) {
    return choice(
      `${lz ? "Určitá" : "Určitý"} ${L} ${grp} zahrnuje ${N}. Co jistě víme o počtu druhů v ${hz ? "celé" : "celém"} ${TVARY[hi].loc}, do ${hz ? "které" : "kterého"} ${lz ? "tato" : "tento"} ${L} patří?`,
      `${N} nebo víc`,
      [
        { value: `méně než ${N}`, why: `Tohle je opačný směr. ${cap(H)} je širší skupina a obsahuje celou skupinu „${L}“ i se všemi jejími druhy, méně jich mít nemůže.` },
        { value: `přesně ${N}`, why: `Přesně tolik by to bylo, jen kdyby ${H} obsahoval${hz ? "a" : ""} jedin${lz ? "ou" : "ý"} ${L}. To jistě nevíme – ${H} může zahrnovat i další skupiny „${L}“ s dalšími druhy.` },
        { value: `nejvýš ${N}`, why: `„Nejvýš“ platí pro užší skupinu uvnitř širší, tady je to naopak. Širší skupina (${H}) má druhů aspoň tolik jako skupina „${L}“, kterou obsahuje.` },
      ],
      {
        hints: [
          `Skupina „${H}“ obsahuje celou skupinu „${L}“ ${grp} i se všemi druhy, které k ní patří. Může jich tedy mít méně, než kolik jich je ve skupině „${L}“ (${n})?`,
          `Širší skupina „${H}“ může kromě této skupiny „${L}“ ${grp} obsahovat i další. Rozmysli si, jestli počet jejích druhů může klesnout pod ${n}, nebo jestli může jen zůstat stejný či vzrůst.`,
        ],
        explanation: `${cap(H)} je širší skupina než ${L} a obsahuje ${lz ? "ji celou" : "ho celý"}. Má tedy všechny druhy této skupiny „${L}“ (${N}) a k tomu možná další z jiných skupin „${L}“. Jistě proto víme jen: ${N} nebo víc.`,
      },
    );
  }
  return choice(
    `${hz ? "Určitá" : "Určitý"} ${H} ${grp} zahrnuje ${N}. Co jistě víme o počtu druhů v ${lz ? "jedné" : "jednom"} ${TVARY[lo].loc} z ${hz ? "této" : "tohoto"} ${TVARY[hi].gen}?`,
    `nejvýš ${N}`,
    [
      { value: `${N} nebo víc`, why: `Tohle je opačný směr. ${cap(L)} je užší skupina uvnitř skupiny „${H}“, víc druhů než celá širší skupina mít nemůže.` },
      { value: `víc než ${N}`, why: `Užší skupina leží celá uvnitř širší. Nemůže tedy mít víc druhů, než kolik jich má celá skupina „${H}“.` },
      { value: `přesně ${N}`, why: `Přesně tolik by to bylo, jen kdyby ${H} měl${hz ? "a" : ""} jedin${lz ? "ou" : "ý"} ${L}. To jistě nevíme – když se ${H} dělí na víc skupin „${L}“, má každá z nich méně druhů.` },
    ],
    {
      hints: [
        `Skupina „${L}“ leží celá uvnitř skupiny „${H}“ ${grp}, která má ${N}. Může mít užší skupina víc druhů než celá skupina, ve které leží?`,
        `Jedna skupina „${H}“ ${grp} se obvykle dělí na víc skupin „${L}“. Druhy se mezi ně mohou rozdělit, nebo výjimečně patřit všechny do jediné. Co z toho jistě plyne pro horní hranici, když je jich celkem ${n}?`,
      ],
      explanation: `${cap(L)} leží ${lz ? "celá" : "celý"} uvnitř skupiny „${H}“, takže druhů nemůže mít víc než ona. Pokud se ${H} dělí na víc skupin „${L}“, má každá z nich méně. Jistě tedy víme jen: nejvýš ${N}.`,
    },
  );
}

// ═══════════════════════════ generátor ═══════════════════════════

function gen(level: number): PracticeTask[] {
  const sablony =
    level <= 1 ? [l1Soused, l1Krajni, l1Skupina]
    : level === 2 ? [l2Kategorie, l2StejnyRad, l2Dvojice]
    : [l3Jiste, l3Pribuzny, l3Znaky, l3Pocet];
  // Rotace šablon a paměť nápověd se nastavují při každém volání (žádný stav modulu).
  // Každá nápověda smí v sadě padnout jen jednou; když šablona po 40 pokusech
  // nic nového nedá (vyčerpaná banka), rotace ji přeskočí.
  let k = 0;
  let neuspech = 0;
  const napovedy = new Set<string>();
  const tvor = (): PracticeTask | null => {
    const t = sablony[k % sablony.length]();
    const h = t?.hints ?? [];
    if (!t || h.some((x) => napovedy.has(x))) {
      if (++neuspech > 40) {
        neuspech = 0;
        k++;
      }
      return null;
    }
    h.forEach((x) => napovedy.add(x));
    neuspech = 0;
    k++;
    return t;
  };
  return ruzneUlohy(() => losUlohy(tvor));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const TAXONOMICKE_SKUPINY: TopicMetadata[] = [
  {
    id: "g6-pri-taxonomicke-skupiny-6",
    rvpNodeId: "g6-prirodopis-obecna-biologie-vznik-a-vyvoj-zivota-trideni-organismu-taxonomicke-skupiny",
    displayName: "Taxonomické skupiny",
    title: "Třídění organismů - taxonomické skupiny",
    studentTitle: "Jak třídíme živé organismy",
    subject: "prirodopis",
    category: "Obecná biologie",
    topic: "Vznik a vývoj života",
    briefDescription: "Seřaď skupiny od říše po druh a poznej, kdo je komu příbuzný.",
    keywords: [
      "třídění organismů", "taxonomie", "systém", "říše", "kmen", "třída", "řád",
      "čeleď", "rod", "druh", "příbuznost", "zařazení",
    ],
    goals: [
      "Znát sled kategorií říše > kmen > třída > řád > čeleď > rod > druh.",
      "Určit, do které kategorie patří údaj v zařazení organismu.",
      "Posoudit příbuznost dvou organismů podle nejužší společné skupiny.",
      "Zařadit živočicha do třídy podle znaků stavby těla.",
    ],
    boundaries: [
      "Jen základní kategorie (bez podkmenů, nadtříd a poddruhů).",
      "Zástupci s českými názvy, latinské názvy se nevyžadují.",
      "Prvoky a bakterie bere jako samostatné skupiny, viry do systému nezařazuje.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Kategorie jdou od nejširší po nejužší: říše > kmen > třída > řád > čeleď > rod > druh. Čím užší skupinu mají dva organismy společnou, tím jsou si příbuznější.",
      steps: [
        "Seřaď si kategorie od říše po druh.",
        "U zařazení organismu přiřaď každý údaj kategorii podle jeho místa.",
        "U dvou organismů najdi nejužší skupinu, do které patří oba.",
      ],
      commonMistake: "Obrátit sled (druh jako nejširší skupina) nebo třídit podle vzhledu a prostředí – netopýr je savec, i když létá.",
      example: "Vlk obecný a liška obecná patří do stejné čeledi (psovití), vlk a rys jen do stejného řádu (šelmy). Vlk je proto bližší lišce.",
    },
  },
];
