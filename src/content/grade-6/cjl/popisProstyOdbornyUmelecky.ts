/**
 * Čeština 6. ročník — Popis: prostý, odborný, nebo umělecký (select_one).
 *
 * Navazuje na grade-4/cjl (popis předmětu, osoby a pracovního postupu) a
 * grade-5/cjl (popis subjektivně zabarvený) — tam žák popis teprve tvořil
 * (vybíral části, řadil), tady ho čte a ROZLIŠUJE podle jazykových znaků.
 *
 *  • L1 — ROZPOZNÁNÍ DRUHU. Jediné znění otázky, banka 15 krátkých ukázek
 *    (5 na každý druh, řazeno střídavě, aby se klíč v sezení střídal). Options jsou vždy stejné čtyři nálepky (popis prostý /
 *    popis odborný / popis umělecký / vyprávění), klíč mezi prvními třemi
 *    rotuje — pevná škála (viz `_shared.ts`).
 *  • L2 — ZNAK → DRUH, tři šablony:
 *    (a) které slovní spojení z jinak obyčejné ukázky by se hodilo do
 *        odborného/uměleckého popisu,
 *    (b) která ze čtyř vět (prostá/odborná/umělecká/dějová) se hodí do
 *        odborného/uměleckého popisu daného předmětu,
 *    (c) 7 obsahově různých otázek na znaky druhů (čím se liší, který znak
 *        NEpatří, co mají společné, kam se který hodí).
 *  • L3 — PŘENOS A ANALÝZA, tři šablony:
 *    (a) komunikační situace → který ze čtyř úryvků se do ní hodí,
 *    (b) který ze čtyř vět v ukázce poruší jednotný styl (vetřelec),
 *    (c) dva popisy téhož předmětu vedle sebe (všechny tři dvojice druhů,
 *        strana A/B se střídá) — urči druh obou podle citovaného slova.
 *
 * Chybový model (viz errorModel ve specifikaci):
 *  1) umělecký (obrazný, živý) text v minulém čase zaměněný za vyprávění —
 *     rozhoduje děj (něco se STANE), ne čas slovesa;
 *  2) odborný popis zaměněný podle délky nebo jednoho čísla v textu — odborný
 *     dělají TERMÍNY, ne počet slov ani libovolné číslo;
 *  3) prostý popis s citovým hodnocením („roztomilý“) zaměněný za umělecký —
 *     umělecký musí mít OBRAZ (přirovnání, metaforu, personifikaci), ne jen
 *     hodnotící slovo;
 *  4) na L2 vybráno obsahově zajímavé, ale jazykově neutrální spojení místo
 *     skutečného jazykového znaku (termínu nebo obrazu).
 *
 * Nápovědy (hints) NIKDY nepoužívají slova „prostý/odborný/umělecký“ jako
 * verdikt — jen znaky (termín, přesné číslo, obraz, cit, děj, účel). Otázky
 * a explanation naopak druh pojmenovat smí, tam se nic neprozrazuje navíc.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

type Builder = () => PracticeTask | null;
type Druh = "prosty" | "odborny" | "umelecky";

const LABEL: Record<Druh, string> = {
  prosty: "popis prostý",
  odborny: "popis odborný",
  umelecky: "popis umělecký",
};
const VYPRAVENI = "vyprávění";

/**
 * Obecný dovětek `_shared.ts` ke druhé nápovědě („Dosaď každou možnost zpátky
 * do věty…“) tu nedává smysl — žádná věta s mezerou v tématu není, možnosti
 * jsou celé věty nebo nálepky druhů. Proto si druhou nápovědu skládáme sami a
 * případně ji prodloužíme jen touhle radou.
 */
const DOPLNEK_VYBER = "Nejdřív škrtni možnost, která zjevně nesedí, a pak porovnej zbylé.";

function vyber(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: [string, string]; explanation: string },
): PracticeTask | null {
  const task = buildChoiceTask(question, correct, distractors, parts);
  if (!task) return null;
  const [h0, h1] = parts.hints;
  task.hints = [h0, h1.length >= h0.length * 1.2 ? h1 : `${h1} ${DOPLNEK_VYBER}`];
  return task;
}

// ── L1 — banka 15 ukázek (5 na každý druh, řazeno střídavě) ─────────────────
interface UkazkaL1 {
  text: string;
  druh: Druh;
}

/**
 * Pořadí je záměrně střídavé (prostý / odborný / umělecký), aby sezení
 * o šesti úlohách nemělo pět stejných klíčů za sebou.
 */
const BANKA_L1: UkazkaL1[] = [
  { text: "Ztratil se hnědý pes. Má krátkou srst a bílou skvrnu na hrudi. Odpovídá na jméno Max.", druh: "prosty" },
  { text: "Horské kolo má hliníkový rám velikosti 17 palců, sedmirychlostní přehazovačku a kotoučové brzdy. Hmotnost kola je přibližně 12 kilogramů.", druh: "odborny" },
  { text: "Stará lípa rozpínala nad návsí svou zelenou náruč. Její srdčité listy šuměly jako tichý šepot.", druh: "umelecky" },
  { text: "Kolo je modré a má na nosiči černou brašnu. Na řídítkách visí zvonek. Jezdím na něm do školy.", druh: "prosty" },
  { text: "Německý ovčák dosahuje kohoutkové výšky 55 až 65 centimetrů. Srst je dvouvrstvá, s hustou podsadou.", druh: "odborny" },
  { text: "Babiččiny ruce byly jako staré, popraskané kořeny plné lásky. Když se usmála, celá kuchyně jako by se rozzářila.", druh: "umelecky" },
  { text: "Naše třída má hodně lavic a velkou tabuli. U okna stojí skříň na pomůcky. Na stěnách visí obrázky.", druh: "prosty" },
  { text: "Květenství kopretiny (úbor) tvoří bílé jazykovité a žluté trubkovité květy. Stonek dosahuje výšky 30 až 60 centimetrů.", druh: "odborny" },
  { text: "Rybník ležel jako zrcadlo mezi kopci a odrážel oblohu. Vodní hladina se chvěla, jako by dýchala. Kolem šumělo rákosí.", druh: "umelecky" },
  { text: "Batoh je zelený a má dvě přední kapsy. Na zádech má polstrované popruhy. Nosím ho každý den do školy.", druh: "prosty" },
  { text: "Tablet má úhlopříčku displeje 10,1 palce a rozlišení 1920 × 1200 pixelů. Kapacita baterie je 7000 miliampérhodin.", druh: "odborny" },
  { text: "Kopretina se choulila v trávě jako droboučké bílé slunce. Její okvětní lístky se chvěly v ranním vánku.", druh: "umelecky" },
  { text: "Ztratil se zelený batoh se dvěma předními kapsami a černými popruhy. Uvnitř byly sešity a penál.", druh: "prosty" },
  { text: "Listy lípy mají srdčitý tvar a pilovitý okraj. Květy jsou žlutobílé a vonné, plody jsou kulovité oříšky.", druh: "odborny" },
  { text: "Pes věrně hleděl svýma hnědýma očima, jako by v nich nosil celé své srdce. Ocasem radostně mával jako praporkem.", druh: "umelecky" },
];

/** Proč `wrong` na tuhle konkrétní ukázku nesedí. */
function whyNotDruhL1(wrong: Druh | "vypraveni", item: UkazkaL1): string {
  if (wrong === "vypraveni") {
    return "Vyprávění má děj: něco se stane a pak se to změní. V ukázce nic neproběhne, jen se popisuje, jak věc vypadá nebo jaká je — a to je popis.";
  }
  if (wrong === "prosty") {
    return item.druh === "odborny"
      ? "V ukázce jsou odborné termíny a údaje změřené v jednotkách (centimetry, kilogramy, palce) — to je víc než hlavní znaky, které stačí na pouhé poznání věci."
      : "V ukázce je obrazné pojmenování (přirovnání nebo slovo, které dělá z věci živou bytost) a citové zabarvení — to jde dál než jen běžná slova a hlavní znaky.";
  }
  if (wrong === "odborny") {
    return item.druh === "prosty"
      ? "Ukázka nemá odborné termíny ani údaje změřené v jednotkách (centimetry, kilogramy). Obyčejné spočítání věcí z popisu odborný nedělá — jsou tu jen běžná slova, podle kterých věc poznáš."
      : "Ukázka nepoužívá odborné termíny ani měřené, neosobní údaje — má obrazné pojmenování a cit, to je jiný znak.";
  }
  // wrong === "umelecky"
  return item.druh === "prosty"
    ? "V ukázce chybí přirovnání nebo slovo, které by věci dávalo lidskou vlastnost — jsou tam jen běžná slova a hlavní znaky."
    : "V ukázce chybí obrazné pojmenování nebo citové zabarvení — má naopak přesné, věcné údaje bez hodnocení.";
}

function taskL1(item: UkazkaL1): PracticeTask | null {
  const ostatni: (Druh | "vypraveni")[] = [
    ...(["prosty", "odborny", "umelecky"] as Druh[]).filter((d) => d !== item.druh),
    "vypraveni",
  ];
  const distractors: Distractor[] = ostatni.map((d) => ({
    value: d === "vypraveni" ? VYPRAVENI : LABEL[d],
    why: whyNotDruhL1(d, item),
  }));
  return vyber(
    `Jaký druh popisu je tato ukázka? „${item.text}“`,
    LABEL[item.druh],
    distractors,
    {
      hints: [
        "Přečti si ukázku větu po větě a všímej si slov navíc: je v ní speciální (technický) výraz nebo údaj změřený v jednotkách, obrazné přirovnání a cit, nebo jen obyčejná slova?",
        "Zeptej se postupně: Děje se v textu něco (má to děj)? Jsou v něm technické výrazy a údaje v jednotkách jako centimetry, kilogramy nebo palce? (Obyčejné spočítání věcí, třeba „dvě kapsy“, se nepočítá.) Je v něm přirovnání nebo slovo, které věci dává lidskou vlastnost? Nebo jsou tam jen běžná slova, podle kterých věc poznáš?",
      ],
      explanation:
        item.druh === "prosty"
          ? `Ukázka používá jen běžná slova a hlavní znaky, podle kterých věc poznáš — nemá odborné termíny, měřené údaje ani obrazná pojmenování. Proto je to ${LABEL.prosty}.`
          : item.druh === "odborny"
            ? `Ukázka používá odborné termíny a údaje změřené v jednotkách, je věcná a bez citového hodnocení. Proto je to ${LABEL.odborny}.`
            : `Ukázka používá obrazné pojmenování (přirovnání, metaforu nebo personifikaci) a citové zabarvení. Proto je to ${LABEL.umelecky}.`,
    },
  );
}

function poolL1(): Builder[] {
  return BANKA_L1.map((item) => () => taskL1(item));
}

// ── L2 (a) — které slovní spojení by se hodilo do odborného/uměleckého popisu ─
interface ZnakItem {
  text: string;
  klic: string;
  distraktory: [string, string, string];
  /** Krátké vysvětlení méně známého termínu (do explanation). */
  glosa?: string;
}

const ZNAK_ODBORNY: ZnakItem[] = [
  {
    text: "Horské kolo má sedmirychlostní přehazovačku. Rám má tmavě modrou barvu. Na řídítkách je připevněný zvonek. Kolo se dobře ovládá v zatáčkách.",
    klic: "sedmirychlostní přehazovačku",
    distraktory: ["tmavě modrou barvu", "připevněný zvonek", "dobře ovládá v zatáčkách"],
    glosa: "Přehazovačka je součástka, která přesouvá řetěz mezi ozubenými kolečky, a tím řadí rychlosti.",
  },
  {
    text: "Německý ovčák dosahuje kohoutkové výšky 55 až 65 centimetrů. Má husté hnědočerné zbarvení. Nejraději si hraje na zahradě s míčkem. Pán ho každý den venčí v parku za domem.",
    klic: "kohoutkové výšky 55 až 65 centimetrů",
    distraktory: ["husté hnědočerné zbarvení", "hraje na zahradě s míčkem", "každý den venčí v parku za domem"],
    glosa: "Kohoutková výška je výška psa měřená k nejvyššímu bodu hřbetu za krkem (kohoutku).",
  },
  {
    text: "Květenství kopretiny (úbor) tvoří bílé jazykovité a žluté trubkovité květy. Babička ji pěstuje na zahradě u plotu. Děti z kopretin rády pletou věnečky do vlasů. Lidé ji často trhají do kytic na stůl.",
    klic: "bílé jazykovité a žluté trubkovité květy",
    distraktory: ["pěstuje na zahradě u plotu", "rády pletou věnečky do vlasů", "často trhají do kytic na stůl"],
    glosa: "Úbor je květenství kopretiny: bílé „lístky“ na okraji jsou jazykovité květy, žlutý střed tvoří drobné trubkovité květy.",
  },
  {
    text: "Tablet má displej o úhlopříčce 10,1 palce. Kryt má stříbrnou barvu a zaoblené rohy. Vejde se do každého školního batohu. Hodí se na čtení i na hry.",
    klic: "displej o úhlopříčce 10,1 palce",
    distraktory: ["stříbrnou barvu a zaoblené rohy", "do každého školního batohu", "na čtení i na hry"],
  },
  {
    text: "Listy lípy mají srdčitý tvar a pilovitý okraj. Roste uprostřed návsi u kapličky. V létě voní jejími květy celé okolí. Lidé si pod ní rádi sedají do příjemného stínu.",
    klic: "srdčitý tvar a pilovitý okraj",
    distraktory: ["uprostřed návsi u kapličky", "voní jejími květy celé okolí", "rádi sedají do příjemného stínu"],
    glosa: "Pilovitý okraj listu má drobné zoubky jako pila.",
  },
];

const ZNAK_UMELECKY: ZnakItem[] = [
  {
    text: "Stará lípa rozpínala nad návsí svou zelenou náruč. Má srdčité listy a voňavé žlutobílé květy. Na návsi stojí už přes sto let. Lidé pod ní v létě hledají stín.",
    klic: "rozpínala nad návsí svou zelenou náruč",
    distraktory: ["srdčité listy a voňavé žlutobílé květy", "stojí už přes sto let", "v létě hledají stín"],
  },
  {
    text: "Babiččiny ruce byly jako staré, popraskané kořeny plné lásky. Má šedivé vlasy a laskavé oči. Ráda nosí modrou zástěru s puntíky. V neděli peče výborné tvarohové koláče.",
    klic: "byly jako staré, popraskané kořeny plné lásky",
    distraktory: ["šedivé vlasy a laskavé oči", "modrou zástěru s puntíky", "peče výborné tvarohové koláče"],
  },
  {
    text: "Rybník ležel jako zrcadlo mezi kopci a odrážel oblohu. Po celém břehu roste vysoké husté rákosí. Voda v něm je čistá a studená. Rybáři v něm každý podzim chytají kapry.",
    klic: "ležel jako zrcadlo mezi kopci",
    distraktory: ["roste vysoké husté rákosí", "čistá a studená", "každý podzim chytají kapry"],
  },
  {
    text: "Kopretina se choulila v trávě jako droboučké bílé slunce. Má bílé okvětní lístky a žlutý střed. Roste na louce za naším domem. V létě kvete spolu s vlčími máky.",
    klic: "choulila v trávě jako droboučké bílé slunce",
    distraktory: ["bílé okvětní lístky a žlutý střed", "na louce za naším domem", "kvete spolu s vlčími máky"],
  },
  {
    text: "Pes věrně hleděl svýma hnědýma očima, jako by v nich nosil celé své srdce. Má krátkou hnědou srst. Nejraději aportuje gumový míček. V noci spí na dece u dveří.",
    klic: "jako by v nich nosil celé své srdce",
    distraktory: ["krátkou hnědou srst", "aportuje gumový míček", "spí na dece u dveří"],
  },
];

function whyNeutral(target: "odborny" | "umelecky", klic: string): string {
  return target === "odborny"
    ? `Tohle spojení je jen běžný, jazykově neutrální detail — mohl by stát v jakémkoli popisu, i prostém. Do odborného popisu patří spíš odborný výraz nebo měřený údaj jako „${klic}“.`
    : `Tohle spojení jen popisuje běžný, věcný fakt — mohlo by stát v jakémkoli popisu. Do uměleckého popisu patří spíš obrazné pojmenování jako „${klic}“, které věc s něčím přirovnává nebo jí dává vlastnost živé bytosti.`;
}

function taskZnak(item: ZnakItem, target: "odborny" | "umelecky"): PracticeTask | null {
  const distractors: Distractor[] = item.distraktory.map((d) => ({ value: d, why: whyNeutral(target, item.klic) }));
  const zaklad = `Spojení „${item.klic}“ je ${target === "odborny" ? "odborný výraz nebo měřený údaj" : "obrazné pojmenování"} — právě to patří do popisu ${target === "odborny" ? "odborného" : "uměleckého"}. Ostatní spojení jsou obyčejné detaily, které by stály v jakémkoli popisu.`;
  return vyber(
    `Ukázka „${item.text}“ je skoro celá napsaná obyčejně. Které slovní spojení z ní by se nejlépe hodilo do ${target === "odborny" ? "odborného" : "uměleckého"} popisu?`,
    item.klic,
    distractors,
    {
      hints: [
        target === "odborny"
          ? "Přečti si ukázku větu po větě a hledej speciální technický výraz nebo údaj změřený v jednotkách, ne jen zajímavý detail."
          : "Přečti si ukázku větu po větě a hledej slovo nebo spojení, které věc s něčím přirovnává, nebo jí dává lidskou vlastnost.",
        target === "odborny"
          ? "Ostatní spojení jsou jen běžné detaily, které by mohly stát v jakémkoli popisu — nemají speciální výraz ani měřený údaj. Hledáš to jedno spojení, které by v obyčejné řeči nikdo nepoužil."
          : "Ostatní spojení jen věcně popisují běžný fakt. Hledáš to jedno spojení, které věc s něčím srovnává nebo jí přisuzuje vlastnost, kterou má jen živá bytost.",
      ],
      explanation: item.glosa ? `${zaklad} ${item.glosa}` : zaklad,
    },
  );
}

// ── L2 (b) — která věta se hodí do odborného/uměleckého popisu předmětu ─────
interface Ctverice {
  predmet: string; // 2. pád: „do odborného popisu ___“
  predmetLok: string; // 6. pád: „věty o ___“
  predmetNom: string; // 1. pád: „jak ___ vypadá“
  prosta: string;
  odborna: string;
  umelecka: string;
  dejova: string;
  /** Doslovné výřezy z vět — rozhodující slovo pro každý druh. */
  citP: string;
  termin: string;
  obraz: string;
  glosa?: string;
}

const CTVERICE: Ctverice[] = [
  {
    predmet: "kopretiny",
    predmetLok: "kopretině",
    predmetNom: "kopretina",
    prosta: "Kopretina je bílý kvítek, který roste na loukách.",
    odborna: "Květenství kopretiny (úbor) tvoří bílé jazykovité a žluté trubkovité květy.",
    umelecka: "Kopretina se usmívala do slunce jako droboučká bílá hvězda.",
    dejova: "Anička natrhala na louce kytici kopretin a pak ji odnesla domů.",
    citP: "bílý kvítek",
    termin: "úbor",
    obraz: "jako droboučká bílá hvězda",
    glosa: "Úbor je květenství kopretiny: bílé „lístky“ na okraji jsou jazykovité květy, žlutý střed tvoří trubkovité květy.",
  },
  {
    predmet: "lípy",
    predmetLok: "lípě",
    predmetNom: "lípa",
    prosta: "Lípa je vysoký strom, který roste u návsi.",
    odborna: "Listy lípy mají srdčitý tvar a pilovitý okraj, květy jsou žlutobílé.",
    umelecka: "Lípa rozpínala nad návsí svou zelenou náruč a šuměla jako tichý šepot.",
    dejova: "Kluci vylezli na starou lípu a pak se schovali v jejích větvích před deštěm.",
    citP: "vysoký strom",
    termin: "pilovitý okraj",
    obraz: "zelenou náruč",
  },
  {
    predmet: "psa",
    predmetLok: "psovi",
    predmetNom: "pes",
    prosta: "Pes je hnědý, má krátkou srst a bílou skvrnu na hrudi.",
    odborna: "Německý ovčák dosahuje kohoutkové výšky 55 až 65 centimetrů.",
    umelecka: "Pes věrně hleděl svýma hnědýma očima, jako by v nich nosil celé své srdce.",
    dejova: "Pes se rozeběhl přes louku a pak s radostným štěkotem skočil do rybníka.",
    citP: "bílou skvrnu na hrudi",
    termin: "kohoutkové výšky",
    obraz: "nosil celé své srdce",
  },
  {
    predmet: "kola",
    predmetLok: "kole",
    predmetNom: "kolo",
    prosta: "Kolo je modré, má černé sedlo a zvonek.",
    odborna: "Horské kolo má hliníkový rám velikosti 17 palců a sedmirychlostní přehazovačku.",
    umelecka: "Staré kolo odpočívalo opřené o plot, unavené z dlouhé cesty.",
    dejova: "Petr nasedl na kolo a pak se rozjel prudce z kopce k rybníku.",
    citP: "černé sedlo",
    termin: "sedmirychlostní přehazovačku",
    obraz: "unavené z dlouhé cesty",
  },
  {
    predmet: "rybníka",
    predmetLok: "rybníku",
    predmetNom: "rybník",
    prosta: "Rybník je velký a je kolem něj rákosí.",
    odborna: "Rybník má rozlohu přibližně dva hektary a hloubku okolo tří metrů.",
    umelecka: "Rybník ležel jako zrcadlo mezi kopci a odrážel oblohu.",
    dejova: "Kluci se rozběhli k rybníku a pak skočili po hlavě do vody.",
    citP: "je velký",
    termin: "dva hektary",
    obraz: "jako zrcadlo",
  },
];

function taskCtverice(item: Ctverice, target: "odborny" | "umelecky"): PracticeTask | null {
  const correct = target === "odborny" ? item.odborna : item.umelecka;
  const other = target === "odborny" ? item.umelecka : item.odborna;
  const whyOther =
    target === "odborny"
      ? `Tahle věta používá obrazné pojmenování („${item.obraz}“) — to je znak uměleckého popisu, ne odborného, kde má být text věcný a bez obraznosti.`
      : `Tahle věta obsahuje odborný výraz nebo měřený údaj („${item.termin}“) a je neosobní — to je znak odborného popisu, ne uměleckého.`;
  const distractors: Distractor[] = [
    {
      value: item.prosta,
      why: `Tahle věta má jen běžná slova a žádný odborný termín ani obrazné pojmenování — patřila by spíš do prostého popisu ${item.predmet}.`,
    },
    { value: other, why: whyOther },
    {
      value: item.dejova,
      why: `Tahle věta vypráví, co se postupně dělo (má děj) — to patří do vyprávění, ne do popisu ${item.predmet}.`,
    },
  ];
  const expl =
    target === "odborny"
      ? `Věta „${correct}“ obsahuje odborný výraz nebo měřený údaj („${item.termin}“), je věcná a bez citu — proto se hodí do odborného popisu ${item.predmet}.${item.glosa ? ` ${item.glosa}` : ""}`
      : `Věta „${correct}“ používá obrazné pojmenování („${item.obraz}“) a je citově zabarvená — proto se hodí do uměleckého popisu ${item.predmet}.`;
  return vyber(
    `Která věta by se hodila do ${target === "odborny" ? "odborného" : "uměleckého"} popisu ${item.predmet}?`,
    correct,
    distractors,
    {
      hints: [
        `Přečti si všechny čtyři věty o ${item.predmetLok} a všimni si, čím se od sebe liší: má věta děj, jen běžná slova, speciální výraz nebo měřený údaj, nebo obrazné pojmenování?`,
        target === "odborny"
          ? `Hledej větu, která má v sobě speciální (technický) výraz nebo údaj změřený v jednotkách a nic přitom nevypráví ani nehodnotí.`
          : `Hledej větu, která věc k něčemu přirovnává nebo jí dává vlastnost živé bytosti, a zároveň nic nevypráví.`,
      ],
      explanation: expl,
    },
  );
}

// ── L2 (c) — co platí o znacích jednotlivých druhů (7 různých otázek) ───────
interface ZnakOtazka {
  otazka: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

const ZNAKY_OTAZKY: ZnakOtazka[] = [
  {
    otazka: "Čím se odborný popis liší od prostého?",
    correct: "Odborný má termíny a měřené údaje; prostý jen běžná slova.",
    distractors: [
      {
        value: "Odborný popis je jen mnohem delší; prostý mívá vždy jen jednu větu.",
        why: "Délka sama o sobě o druhu popisu nerozhoduje — i krátký text může být plný termínů a dlouhý může zůstat pořád jen prostý. Rozhoduje slovní zásoba, ne počet slov.",
      },
      {
        value: "Odborný popis používá přirovnání a citové výrazy; prostý je bez nich.",
        why: "Přirovnání a citové zabarvení jsou naopak znakem uměleckého popisu. Odborný popis je věcný a bez citového hodnocení.",
      },
      {
        value: "Odborný je vždy v minulém čase; prostý v přítomném čase.",
        why: "Gramatický čas o druhu popisu nerozhoduje — odborný i prostý popis bývají většinou v přítomném čase. Rozhoduje slovní zásoba: termíny a měřené údaje, nebo jen běžná slova.",
      },
    ],
    hints: [
      "Popřemýšlej, čím se od sebe oba texty liší: slovní zásobou (obyčejná slova × speciální výrazy), přesností údajů, nebo délkou?",
      "Zkus si představit oba texty vedle sebe: kde by stál údaj v centimetrech nebo speciální technický výraz, a kde jen běžné slovo? Délka věty ani čas slovesa o tom nic neříkají.",
    ],
    explanation: "Odborný popis poznáš podle odborných termínů a měřených, neosobních údajů. Prostý popis vystačí s běžnými slovy a hlavními znaky. Délka ani čas slovesa o druhu nerozhodují.",
  },
  {
    otazka: "Čím se umělecký popis liší od prostého?",
    correct: "Umělecký má obrazná pojmenování a cit; prostý jen věcně popisuje.",
    distractors: [
      {
        value: "Umělecký popis má vždy nejvíc slov; prostý je nejkratší.",
        why: "Délka sama o sobě o druhu popisu nerozhoduje. Rozhoduje, jestli text obrazně pojmenovává a vyjadřuje cit, nebo jen věcně popisuje hlavní znaky.",
      },
      {
        value: "Umělecký popis obsahuje přesné termíny a míry; prostý ne.",
        why: "Přesné termíny a míry jsou naopak znakem odborného popisu. Umělecký popis místo nich používá obrazná pojmenování a cit.",
      },
      {
        value: "Umělecký vypráví, co se s věcí stalo; prostý jen jak vypadá.",
        why: "Děj (co se postupně stalo) patří do vyprávění, ne do popisu. Umělecký popis pořád jen popisuje, jak věc vypadá nebo jaká je — jen obrazně a s citem.",
      },
    ],
    hints: [
      "Popřemýšlej, čím se od sebe oba texty liší: obrazností, citem, nebo tím, že jeden z nich vypráví děj?",
      "Zkus si představit oba texty vedle sebe: kde by stálo přirovnání nebo slovo vyjadřující cit, a kde jen holý, věcný popis? Délka věty o tom nic neříká a děj nemá ani jeden z nich.",
    ],
    explanation: "Umělecký popis používá obrazná pojmenování (přirovnání, metaforu, personifikaci) a citové zabarvení. Prostý popis jen věcně vyjmenuje hlavní znaky. Děj nemá ani jeden — ten patří do vyprávění.",
  },
  {
    otazka: "Čím se umělecký popis liší od odborného?",
    correct: "Umělecký je obrazný a citový; odborný věcný, přesný a neosobní.",
    distractors: [
      {
        value: "Umělecký popis je vždycky jen delší než odborný.",
        why: "Délka sama o sobě o druhu popisu nerozhoduje. Rozhoduje, jestli text obrazně pojmenovává a vyjadřuje cit, nebo přesně a neosobně popisuje.",
      },
      {
        value: "Umělecký obsahuje přesné míry a termíny, odborný ne.",
        why: "Je to obráceně: přesné míry a termíny patří k odbornému popisu. Umělecký popis místo nich používá obrazná pojmenování a cit.",
      },
      {
        value: "Umělecký je v minulém čase, odborný v přítomném čase.",
        why: "Gramatický čas o druhu popisu nerozhoduje. Rozhoduje slovní zásoba: obrazná pojmenování a cit, nebo termíny a přesné, neosobní údaje.",
      },
    ],
    hints: [
      "Oba texty mají v sobě jazyk navíc oproti běžné řeči, ale jiného druhu. Popřemýšlej, jakého.",
      "Jeden z nich přidává přesná čísla v jednotkách a speciální výrazy, druhý obrazy a cit. Zkus u každého najít, který z těch dvou prostředků používá. Délka ani čas slovesa nerozhodují.",
    ],
    explanation: "Umělecký popis je obrazný a citově zabarvený. Odborný popis je věcný, přesný (termíny, měřené údaje) a bez citového hodnocení.",
  },
  {
    otazka: "Který znak NEpatří k odbornému popisu?",
    correct: "přirovnání a citově zabarvená slova",
    distractors: [
      {
        value: "odborné termíny, třeba „přehazovačka“",
        why: "Odborné termíny jsou hlavním znakem odborného popisu — tenhle znak k němu patří.",
      },
      {
        value: "údaje změřené v centimetrech nebo kilogramech",
        why: "Měřené údaje v jednotkách jsou typické právě pro odborný popis — tenhle znak k němu patří.",
      },
      {
        value: "věcný, neosobní tón bez hodnocení",
        why: "Odborný popis je věcný a neosobní, pisatel v něm nehodnotí — tenhle znak k němu patří.",
      },
    ],
    hints: [
      "Představ si heslo v encyklopedii. Které z nabízených věcí v něm obvykle najdeš?",
      "Tři možnosti popisují, co encyklopedie opravdu dělá: pojmenuje věc přesně, změří ji a nehodnotí. Hledáš tu jednu, kterou by pisatel encyklopedie nepoužil.",
    ],
    explanation: "Přirovnání a citově zabarvená slova patří k uměleckému popisu. Odborný popis naopak používá termíny, měřené údaje a věcný, neosobní tón.",
  },
  {
    otazka: "Který znak NEpatří k uměleckému popisu?",
    correct: "údaje změřené v centimetrech a kilogramech",
    distractors: [
      {
        value: "přirovnání, třeba „jako zrcadlo“",
        why: "Přirovnání je typický obraz uměleckého popisu — tenhle znak k němu patří.",
      },
      {
        value: "slova, která věci dávají lidskou vlastnost",
        why: "Personifikace (věc se „usmívá“, „odpočívá“) je obrazné pojmenování, typické pro umělecký popis — tenhle znak k němu patří.",
      },
      {
        value: "citově zabarvená slova",
        why: "Citové zabarvení je znakem uměleckého popisu — pisatel v něm dává najevo, co cítí. Tenhle znak k němu patří.",
      },
    ],
    hints: [
      "Představ si úryvek z povídky, který popisuje starou lípu. Které z nabízených věcí v něm obvykle najdeš?",
      "Tři možnosti vytvářejí v textu obraz a náladu. Hledáš tu jednu, která obraz ani náladu nevytvoří.",
    ],
    explanation: "Údaje změřené v jednotkách patří do odborného popisu. Umělecký popis místo nich používá přirovnání, personifikaci a citově zabarvená slova.",
  },
  {
    otazka: "Co mají odborný a prostý popis společné?",
    correct: "Oba jsou věcné a nepoužívají obrazná pojmenování.",
    distractors: [
      {
        value: "Oba používají odborné termíny a měřené údaje.",
        why: "Termíny a měřené údaje má jen odborný popis. Prostý vystačí s běžnými slovy, kterým rozumí každý.",
      },
      {
        value: "Oba vyprávějí, co se s věcí postupně stalo.",
        why: "Děj nemá žádný popis — to je znak vyprávění. Odborný i prostý popis říkají, jak věc vypadá.",
      },
      {
        value: "Oba dávají najevo, co pisatel k věci cítí.",
        why: "Citové zabarvení je znakem uměleckého popisu. Odborný i prostý popis jsou věcné, cit v nich nehraje roli.",
      },
    ],
    hints: [
      "Vzpomeň si, co dělá každý z těch dvou textů: jeden pojmenovává přesně, druhý obyčejnými slovy. V čem se ale shodují?",
      "Vyřaď možnosti, které platí jen pro jeden z obou textů, a možnosti, které neplatí ani pro jeden. Zbude vlastnost, kterou mají oba.",
    ],
    explanation: "Odborný i prostý popis jsou věcné: říkají, jak věc vypadá, bez přirovnání a citu. Liší se jen slovní zásobou — odborný má termíny a měřené údaje, prostý běžná slova.",
  },
  {
    otazka: "Do kterého textu se nejlíp hodí odborný popis?",
    correct: "do hesla v učebnici přírodopisu",
    distractors: [
      {
        value: "do inzerátu na ztraceného psa",
        why: "Čtenář inzerátu potřebuje psa rychle poznat podle viditelných znaků. Tam se hodí prostý popis — termínům a mírám by nepomohly.",
      },
      {
        value: "do básně o jarní louce",
        why: "Báseň má vyvolat obraz a náladu. Tam se hodí umělecký popis s přirovnáními, ne suché termíny.",
      },
      {
        value: "do pohádky o staré lípě",
        why: "Pohádka pracuje s obrazem a citem — hodí se do ní umělecký popis, ne měřené údaje.",
      },
    ],
    hints: [
      "U každého textu se zeptej, co od něj čtenář čeká: přesné informace, rychlé poznání věci, nebo obraz a náladu?",
      "Text s termíny slouží k učení a přesnému určení věci. Hledáš text, jehož čtenář chce vědět, jak se věc správně jmenuje a jaké má míry.",
    ],
    explanation: "Odborný popis patří do učebnic, encyklopedií a atlasů — čtenář tam chce přesné termíny a měřené údaje. Inzerát potřebuje prostý popis, báseň a pohádka umělecký.",
  },
];

function taskZnakOtazka(item: ZnakOtazka): PracticeTask | null {
  return vyber(item.otazka, item.correct, item.distractors, { hints: item.hints, explanation: item.explanation });
}

function poolL2(): Builder[] {
  const a: Builder[] = [
    ...ZNAK_ODBORNY.map((item) => () => taskZnak(item, "odborny")),
    ...ZNAK_UMELECKY.map((item) => () => taskZnak(item, "umelecky")),
  ];
  const b: Builder[] = CTVERICE.flatMap((item) => [
    () => taskCtverice(item, "odborny"),
    () => taskCtverice(item, "umelecky"),
  ]);
  const c: Builder[] = ZNAKY_OTAZKY.map((item) => () => taskZnakOtazka(item));
  const out: Builder[] = [];
  const n = Math.max(a.length, b.length, c.length);
  for (let i = 0; i < n; i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
    if (i < c.length) out.push(c[i]);
  }
  return out;
}

// ── L3 (a) — komunikační situace → který ze čtyř úryvků se hodí ─────────────
type Jiny = "postup" | "vypraveni";
interface SituaceItem {
  situace: string;
  spravnyDruh: Druh;
  /** Co čtenář v té situaci potřebuje — PROČ se hodí právě tenhle druh. */
  proc: string;
  prosty: string;
  odborny: string;
  umelecky: string;
  jiny: string;
  jinyDruh: Jiny;
}

const SITUACE: SituaceItem[] = [
  {
    situace: "heslo o kole do žákovské encyklopedie techniky",
    spravnyDruh: "odborny",
    proc: "Čtenář encyklopedie chce přesné informace: jak se části kola správně jmenují a jaké mají parametry.",
    prosty: "Kolo je modré a jezdí se na něm do školy.",
    odborny: "Horské kolo má hliníkový rám, sedmirychlostní přehazovačku a kotoučové brzdy.",
    umelecky: "Staré kolo odpočívalo opřené o plot, unavené z dlouhé cesty.",
    jiny: "Nejprve nahustíme pneumatiky, pak zkontrolujeme brzdy a nakonec promažeme řetěz.",
    jinyDruh: "postup",
  },
  {
    situace: "inzerát na ztraceného psa ve školním časopise",
    spravnyDruh: "prosty",
    proc: "Čtenář inzerátu potřebuje psa rychle poznat na ulici podle viditelných znaků — kohoutková výška ani hmotnost mu nepomůžou a obraz ani cit psa nenajdou.",
    prosty: "Ztratil se hnědý pes s bílou skvrnou na hrudi. Odpovídá na jméno Max.",
    odborny: "Německý ovčák dosahuje kohoutkové výšky 55 až 65 centimetrů a hmotnosti 22 až 40 kilogramů.",
    umelecky: "Pes věrně hleděl svýma hnědýma očima, jako by v nich nosil celé své srdce.",
    jiny: "Pes se ráno vytrhl z vodítka, přeběhl přes silnici a pak zmizel v lese.",
    jinyDruh: "vypraveni",
  },
  {
    situace: "úryvek do povídky o staré lípě pro literární soutěž",
    spravnyDruh: "umelecky",
    proc: "Porota literární soutěže čeká, že text vyvolá obraz a náladu — to dokážou přirovnání a cit, ne holé znaky ani měřené údaje.",
    prosty: "Lípa je vysoký strom, který roste na návsi.",
    odborny: "Listy lípy mají srdčitý tvar a pilovitý okraj, květy jsou žlutobílé a vonné.",
    umelecky: "Stará lípa rozpínala nad návsí svou zelenou náruč a šuměla jako tichý šepot.",
    jiny: "Nejprve vykopeme jamku, zasadíme sazenici a pořádně ji zalijeme.",
    jinyDruh: "postup",
  },
  {
    situace: "popis kopretiny do přírodopisného atlasu",
    spravnyDruh: "odborny",
    proc: "Atlas slouží k přesnému určení rostliny, proto potřebuje botanické termíny a míry, ne obecná slova nebo obrazy.",
    prosty: "Kopretina je bílý kvítek, který roste na louce.",
    odborny: "Květenství kopretiny (úbor) tvoří bílé jazykovité a žluté trubkovité květy, stonek dosahuje výšky 30 až 60 centimetrů.",
    umelecky: "Kopretina se choulila v trávě jako droboučké bílé slunce.",
    jiny: "Anička natrhala na louce kytici kopretin a pak ji odnesla domů.",
    jinyDruh: "vypraveni",
  },
  {
    situace: "inzerát na ztracený batoh ve školním časopise",
    spravnyDruh: "prosty",
    proc: "Kdo batoh najde, musí ho poznat podle toho, co je vidět (barva, kapsy, popruhy) — objem v litrech na první pohled nezjistí.",
    prosty: "Ztratil se zelený batoh se dvěma předními kapsami a černými popruhy.",
    odborny: "Batoh má objem 22 litrů, polstrovaná záda a nastavitelné hrudní popruhy.",
    umelecky: "Batoh ležel opuštěný na lavičce, jako by čekal na svého ztraceného pána.",
    jiny: "Nejdřív rozepneme horní kapsu, pak vyndáme sešity a nakonec zavřeme zip.",
    jinyDruh: "postup",
  },
  {
    situace: "úryvek do povídky o rybníku pro literární soutěž",
    spravnyDruh: "umelecky",
    proc: "Porota literární soutěže čeká, že si čtenář rybník představí a něco při tom ucítí — rozloha v hektarech ani holé „je velký“ to nedokážou.",
    prosty: "Rybník je velký a je kolem něj rákosí.",
    odborny: "Rybník má rozlohu přibližně dva hektary a hloubku okolo tří metrů.",
    umelecky: "Rybník ležel jako zrcadlo mezi kopci a odrážel oblohu.",
    jiny: "Kluci se rozběhli k rybníku a pak skočili po hlavě do vody.",
    jinyDruh: "vypraveni",
  },
];

function whySituace(wrong: "prosty" | "odborny" | "umelecky" | Jiny, item: SituaceItem): string {
  if (wrong === "postup") {
    return `Tohle popisuje POSTUP — co udělat krok za krokem, ne jak věc vypadá. Do situace „${item.situace}“ se nehodí.`;
  }
  if (wrong === "vypraveni") {
    return `Tohle má DĚJ — něco se postupně stalo. Do situace „${item.situace}“ je potřeba popsat, jak věc vypadá, ne vyprávět příběh.`;
  }
  const co =
    wrong === "prosty"
      ? "Tohle jsou jen běžná slova a hlavní znaky."
      : wrong === "odborny"
        ? "Tohle je text s odbornými termíny a měřenými údaji."
        : "Tohle je obrazné, citově zabarvené vyjádření.";
  return `${co} ${item.proc}`;
}

function taskSituace(item: SituaceItem): PracticeTask | null {
  const correct = item[item.spravnyDruh];
  const ostatniDruhy = (["prosty", "odborny", "umelecky"] as Druh[]).filter((d) => d !== item.spravnyDruh);
  const distractors: Distractor[] = [
    ...ostatniDruhy.map((d) => ({ value: item[d], why: whySituace(d, item) })),
    { value: item.jiny, why: whySituace(item.jinyDruh, item) },
  ];
  return vyber(
    `Vybíráš text pro tuhle situaci: ${item.situace}. Který ze čtyř úryvků se do ní nejlíp hodí?`,
    correct,
    distractors,
    {
      hints: [
        "U každého úryvku se zeptej: má v sobě děj (něco se stane), popisuje jen krok za krokem postup, nebo popisuje, jaká věc je nebo vypadá?",
        "Až vyřadíš úryvky s dějem a s postupem, zbydou popisy. Rozhodni podle toho, co čtenář v té situaci potřebuje: přesné technické údaje, obyčejná slova, podle kterých věc pozná každý, nebo obraz a cit.",
      ],
      explanation: `Do situace „${item.situace}“ se nejlíp hodí ${LABEL[item.spravnyDruh]}. ${item.proc}`,
    },
  );
}

// ── L3 (b) — která věta poruší jednotný styl ukázky (vetřelec) ─────────────
interface StylItem {
  target: "odborny" | "umelecky";
  /** Krátké pojmenování předmětu ukázky, jen do otázky ("o kole", "o psovi"…). */
  referent: string;
  vety: [string, string, string, string];
  vetrelecIdx: 0 | 1 | 2 | 3;
  duvod: string; // proč vetřelec styl poruší (obrazná / hovorová / dějová)
}

const STYL: StylItem[] = [
  {
    target: "odborny",
    referent: "o kole",
    vety: [
      "Horské kolo má hliníkový rám velikosti 17 palců.",
      "Sedmirychlostní přehazovačka umožňuje snadné řazení do kopce.",
      "Kolo se prohánělo lesem jako veselý žlutý pták.",
      "Kotoučové brzdy zajišťují spolehlivé zastavení i za deště.",
    ],
    vetrelecIdx: 2,
    duvod: "je obrazná (přirovnání ke ptákovi) a citově laděná — do věcného, neosobního textu s termíny nepatří",
  },
  {
    target: "odborny",
    referent: "o psovi",
    vety: [
      "Německý ovčák dosahuje kohoutkové výšky 55 až 65 centimetrů.",
      "Jeho srst je dvouvrstvá, s hustou podsadou.",
      "Pes běhal po dvorku, jako by chtěl obejmout celý svět.",
      "Hmotnost dospělého psa se pohybuje mezi 22 a 40 kilogramy.",
    ],
    vetrelecIdx: 2,
    duvod: "je obrazná a citově laděná — do věcného, neosobního textu s termíny nepatří",
  },
  {
    target: "odborny",
    referent: "o kopretině",
    vety: [
      "Květenství kopretiny (úbor) tvoří bílé jazykovité a žluté trubkovité květy.",
      "Stonek dosahuje výšky 30 až 60 centimetrů.",
      "Kopretina se usmívala do slunce jako droboučká bílá hvězda.",
      "Listy jsou úzké a mírně zubaté.",
    ],
    vetrelecIdx: 2,
    duvod: "je obrazná (přirovnání ke hvězdě) — do věcného, neosobního textu s termíny nepatří",
  },
  {
    target: "odborny",
    referent: "o tabletu",
    vety: [
      "Tablet má úhlopříčku displeje 10,1 palce.",
      "Kapacita baterie je 7000 miliampérhodin.",
      "Hmotnost zařízení činí 460 gramů.",
      "Ten tablet je fakt super, hlavně na hry.",
    ],
    vetrelecIdx: 3,
    duvod: "je hovorová (slova „fakt super“) — do odborného, spisovného a neosobního textu nepatří",
  },
  {
    target: "umelecky",
    referent: "o lípě",
    vety: [
      "Stará lípa rozpínala nad návsí svou zelenou náruč.",
      "Její srdčité listy šuměly jako tichý šepot.",
      "Ve stínu jejích větví se schovávalo celé léto.",
      "Lípa má výšku asi patnáct metrů a je fakt stará.",
    ],
    vetrelecIdx: 3,
    duvod: "je hovorová (slovo „fakt“) a místo obrazu uvádí holý číselný údaj — do obrazného, citového textu nepatří",
  },
  {
    target: "umelecky",
    referent: "o babičce",
    vety: [
      "Babiččiny ruce byly jako staré, popraskané kořeny plné lásky.",
      "Když se usmála, celá kuchyně jako by se rozzářila.",
      "Její oči zářily laskavostí jako dvě hřejivé svíčky.",
      "Pak se najednou zvedla a šla uvařit oběd.",
    ],
    vetrelecIdx: 3,
    duvod: "má děj („pak se zvedla a šla“) — to je vyprávění, ne popis, jaká babička je",
  },
  {
    target: "umelecky",
    referent: "o rybníku",
    vety: [
      "Rybník ležel jako zrcadlo mezi kopci a odrážel oblohu.",
      "Vodní hladina se chvěla, jako by dýchala.",
      "Kolem dokola šumělo rákosí a šeptalo si tajemství.",
      "Najednou do vody skočila žába a hladina se rozvlnila.",
    ],
    vetrelecIdx: 3,
    duvod: "má děj („najednou skočila žába“) — to je vyprávění, ne popis, jaký rybník je",
  },
  {
    target: "umelecky",
    referent: "o kopretině",
    vety: [
      "Kopretina se choulila v trávě jako droboučké bílé slunce.",
      "Její okvětní lístky se chvěly v ranním vánku.",
      "Voněla létem a sluncem.",
      "Ta kopretina je fakt hezká, viď?",
    ],
    vetrelecIdx: 3,
    duvod: "je hovorová (slovo „fakt“ a otázka „viď?“) — do souvislého, básnického popisu nepatří",
  },
];

function whyFitsStyle(target: "odborny" | "umelecky", sentence: string): string {
  return target === "odborny"
    ? `Věta „${sentence}“ zůstává věcná, bez citového zabarvení a bez obraznosti — do odborného popisu patří. Hledáš tu jednu větu, která se od tohohle stylu odchyluje.`
    : `Věta „${sentence}“ je obrazná nebo citově laděná — do uměleckého popisu patří. Hledáš tu jednu větu, která se od tohohle stylu odchyluje (mluví jinak, nebo má děj).`;
}

/**
 * Otázka záměrně NEcituje všechny čtyři věty (ty jsou v `options`, žák je
 * uvidí jako možnosti) — jinak by `correctAnswer` (vetřelec) byl doslovně
 * obsažený ve znění otázky.
 */
function taskStyl(item: StylItem): PracticeTask | null {
  const vetrelec = item.vety[item.vetrelecIdx];
  const distraktoryVety = item.vety.filter((_, i) => i !== item.vetrelecIdx);
  const distractors: Distractor[] = distraktoryVety.map((v) => ({ value: v, why: whyFitsStyle(item.target, v) }));
  return vyber(
    `Tři z nabízených vět ${item.referent} tvoří jednotný ${item.target === "odborny" ? "odborný" : "umělecký"} popis, jedna z vět styl poruší. Která to je?`,
    vetrelec,
    distractors,
    {
      hints: [
        "Přečti si všechny čtyři nabízené věty zvlášť a všímej si, jestli mluví pořád stejně — nebo jestli se v jedné z nich objeví děj, hovorové slovo nebo úplně jiná slovní zásoba.",
        item.target === "odborny"
          ? "Ostatní tři věty mají technický výraz nebo měřený údaj a jsou neosobní. Hledej tu jednu, která místo toho obrazně přirovnává, hodnotí citem, nebo mluví hovorově."
          : "Ostatní tři věty obrazně pojmenovávají nebo jsou citově laděné. Hledej tu jednu, která místo toho mluví hovorově, nebo v ní najednou něco proběhne (má děj).",
      ],
      explanation: `Věta „${vetrelec}“ ${item.duvod}. Ostatní tři věty zůstávají ve stejném stylu.`,
    },
  );
}

// ── L3 (c) — dva popisy téhož předmětu vedle sebe: urči oba druhy ───────────
/**
 * Dvojice ze všech tří kombinací (prostý×odborný, prostý×umělecký,
 * odborný×umělecký), strana A/B se střídá. Všechny čtyři možnosti citují stejná
 * rozhodující slova a liší se jen přiřazeným druhem — žák musí u OBOU textů
 * poznat, čím ten výřez je (běžné slovo, termín/měřený údaj, obraz).
 * Distraktory: druhy prohozené; A správně + B třetí druh; A třetí druh + B správně.
 */
const ADJ: Record<Druh, string> = { prosty: "prostý", odborny: "odborný", umelecky: "umělecký" };
const ZNAK_DRUHU: Record<Druh, string> = {
  prosty: "jen běžné pojmenování, podle kterého věc pozná každý",
  odborny: "odborný termín nebo měřený údaj",
  umelecky: "obrazné pojmenování",
};
const CHYBI: Record<Druh, string> = {
  prosty: "prostý popis vystačí s běžnými slovy, tenhle text má ale něco navíc",
  odborny: "odborný popis potřebuje termín nebo měřený údaj a ten tu chybí",
  umelecky: "umělecký popis potřebuje obraz (přirovnání, metaforu, personifikaci) a ten tu chybí",
};

interface SrovnaniItem {
  c: Ctverice;
  aDruh: Druh;
  bDruh: Druh;
}

function textDruhu(c: Ctverice, d: Druh): string {
  return d === "prosty" ? c.prosta : d === "odborny" ? c.odborna : c.umelecka;
}
function citDruhu(c: Ctverice, d: Druh): string {
  return d === "prosty" ? c.citP : d === "odborny" ? c.termin : c.obraz;
}

const DVOJICE: [Druh, Druh][] = [
  ["prosty", "umelecky"],
  ["odborny", "umelecky"],
  ["prosty", "odborny"],
];

const SROVNANI: SrovnaniItem[] = CTVERICE.flatMap((c, ci) =>
  DVOJICE.map(([x, y], di) => ((ci + di) % 2 === 0 ? { c, aDruh: x, bDruh: y } : { c, aDruh: y, bDruh: x })),
);

function taskSrovnani(item: SrovnaniItem): PracticeTask | null {
  const { c, aDruh: X, bDruh: Y } = item;
  const Z = (["prosty", "odborny", "umelecky"] as Druh[]).find((d) => d !== X && d !== Y)!;
  const citA = citDruhu(c, X);
  const citB = citDruhu(c, Y);
  const volba = (a: Druh, b: Druh) => `A je ${ADJ[a]} popis („${citA}“), B je ${ADJ[b]} popis („${citB}“).`;
  const spravne = `V A: „${citA}“ je ${ZNAK_DRUHU[X]}, proto je A ${ADJ[X]} popis. V B: „${citB}“ je ${ZNAK_DRUHU[Y]}, proto je B ${ADJ[Y]} popis.`;
  const correct = volba(X, Y);
  const distractors: Distractor[] = [
    { value: volba(Y, X), why: `Druhy jsou prohozené. ${spravne}` },
    { value: volba(X, Z), why: `A je určený správně, B ne: ${CHYBI[Z]}. „${citB}“ je ${ZNAK_DRUHU[Y]}, proto je B ${ADJ[Y]} popis.` },
    { value: volba(Z, Y), why: `B je určený správně, A ne: ${CHYBI[Z]}. „${citA}“ je ${ZNAK_DRUHU[X]}, proto je A ${ADJ[X]} popis.` },
  ];
  return vyber(
    `Popis A: „${textDruhu(c, X)}“ Popis B: „${textDruhu(c, Y)}“ Co platí o rozdílu mezi popisem A a popisem B?`,
    correct,
    distractors,
    {
      hints: [
        "Přečti si zvlášť popis A a zvlášť popis B. U každého urči, jestli má speciální výraz nebo měřený údaj, obraz a cit, nebo jen běžná slova.",
        "Všechny možnosti citují stejná slova — liší se jen tím, jaký druh k nim přiřazují. Rozhodni zvlášť o slově z A a zvlášť o slově z B: je to běžné slovo, speciální výraz s mírou, nebo obraz? Délka věty ani čas slovesa nerozhodují.",
      ],
      explanation: (X === "odborny" || Y === "odborny") && c.glosa ? `${spravne} ${c.glosa}` : spravne,
    },
  );
}

function poolL3(): Builder[] {
  const a: Builder[] = SITUACE.map((item) => () => taskSituace(item));
  const b: Builder[] = STYL.map((item) => () => taskStyl(item));
  const c: Builder[] = SROVNANI.map((item) => () => taskSrovnani(item));
  const out: Builder[] = [];
  const n = Math.max(a.length, b.length, c.length);
  for (let i = 0; i < n; i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
    if (i < c.length) out.push(c[i]);
  }
  return out;
}

/** Rotace po bance se nastaví při každém volání — žádný stav mezi voláními. */
function gen(level: number): PracticeTask[] {
  const pool = level <= 1 ? poolL1() : level === 2 ? poolL2() : poolL3();
  let i = 0;
  const dalsi = () => pool[i++ % pool.length]();
  return ruzneUlohy(() => losUlohy(dalsi), 24, pool.length * 3);
}

// ── Topic ────────────────────────────────────────────────────────────────────
export const POPIS_PROSTY_ODBORNY_UMELECKY: TopicMetadata[] = [
  {
    id: "g6-cjl-popis-prosty-odborny-umelecky-6",
    rvpNodeId: "g6-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-prosty-odborny-umelecky",
    displayName: "Popis: prostý, odborný, umělecký",
    title: "Popis prostý, odborný, umělecký",
    studentTitle: "Popis: prostý, odborný, nebo umělecký?",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Poznáš, jestli je popis prostý, odborný, nebo umělecký.",
    keywords: ["popis", "prostý popis", "odborný popis", "umělecký popis", "sloh", "slohová výchova", "popis předmětu"],
    goals: [
      "Rozlišit prostý, odborný a umělecký popis podle jazykových znaků.",
      "Najít ve textu konkrétní znak (termín, přesný údaj, obrazné pojmenování), který druh popisu prozrazuje.",
      "Přiřadit druh popisu ke komunikační situaci, pro kterou je určený.",
    ],
    boundaries: [
      "Navazuje na popis předmětu, osoby a pracovního postupu ze 4. ročníku a subjektivně zabarvený popis z 5. ročníku — tady žák popis jen ČTE a rozlišuje, netvoří ho.",
      "Žádné psaní vlastního textu (inputType 'essay' v aplikaci neexistuje) — jen výběr z možností.",
      "Bez popisu pracovního postupu jako samostatného tématu — objevuje se jen jako distraktor (látka 4.–5. ročníku).",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Prostý popis = běžná slova a hlavní znaky. Odborný popis = odborné termíny a měřené, neosobní údaje (centimetry, kilogramy) — obyčejné spočítání věcí nestačí. Umělecký popis = obrazné pojmenování (přirovnání, metafora) a cit.",
      steps: [
        "Přečti si text a hledej slova navíc oproti běžné řeči: technický výraz, měřený údaj, nebo obrazné pojmenování.",
        "Zjisti, jestli v textu něco PROBĚHNE (děj) — pak nejde o popis, ale o vyprávění.",
        "Podle nalezeného znaku rozhodni: jen běžná slova = prostý, termíny a měřené údaje = odborný, obraz a cit = umělecký.",
      ],
      commonMistake: "Obrazný text v minulém čase považovaný za vyprávění, i když se v něm nic neděje; popis s jedním číslem nebo hodnotícím slovem mylně považovaný za odborný nebo umělecký.",
      example: "„Stará lípa rozpínala nad návsí svou zelenou náruč.“ — obrazné pojmenování (personifikace, metafora) = umělecký popis. „Listy lípy mají srdčitý tvar.“ — přesný, věcný údaj = odborný popis.",
    },
  },
];
