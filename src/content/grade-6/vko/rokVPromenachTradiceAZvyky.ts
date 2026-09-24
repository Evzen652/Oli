/**
 * Výchova k občanství 6. ročník — Rok v jeho proměnách: tradice a zvyky
 * (Vánoce, Velikonoce, Mikuláš, Masopust, Dušičky) — categorize.
 *
 * Svátky jsou podávány výhradně jako KULTURNÍ ZVYK ("podle tradice…", "lidé
 * si zvykli…"), nikdy jako náboženská pravda. Cíl je zařadit zvyk podle
 * FUNKCE a ÚČELU, ne jen podle ročního období.
 *
 *  • L1 — tři vzájemně jasně odlišné svátky (Vánoce, Velikonoce, Mikuláš),
 *    zvyk jako jedno slovo/sousloví (např. zdobení stromečku).
 *  • L2 — zvyk popsaný krátkou situací (1 věta), mezi 4 svátky — základní tři
 *    + méně frekventovaný Masopust nebo Dušičky (losováno).
 *  • L3 — zima (Mikuláš × Vánoce) a předjaří (Masopust × Velikonoce): zvyk
 *    popsaný opisem ÚČELU, povrchově připomíná ten druhý svátek ze stejného
 *    období. Řeší se POSTNÍM CYKLEM (Masopust PŘED postem, Velikonoce PO
 *    jeho konci) a typem koledování (obchůzka za odměnu podle chování ×
 *    zpívání doma o narození × pomlázka výměnou za vajíčka).
 *
 * Chybový model (errorModel ze zadání):
 *  1. zima → Mikuláš vs. Vánoce (obojí "prosinec, dárky")
 *  2. postní cyklus → Masopust (PŘED postem) vs. Velikonoce (KONEC postu)
 *  3. "jarní zvyk" zobecnění → Masopust (předjaří, půst ještě nezačal) vs.
 *     Velikonoce (jaro, půst skončil)
 *  4. koledování → tři různé podoby (mikulášská obchůzka za odměnu podle
 *     chování, vánoční zpívání doma o narození, velikonoční pomlázka za
 *     vajíčka) se pletou dohromady
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pickN, shuffle, buildCategorizeTask as cat } from "./_shared";

const VANOCE = "Vánoce";
const VELIKONOCE = "Velikonoce";
const MIKULAS = "Mikuláš";
const MASOPUST = "Masopust";
const DUSICKY = "Dušičky";

const RULE =
  "Zvyk zařaď podle FUNKCE a ÚČELU, ne jen podle ročního období: Vánoce = rodinná večeře a nadílka pod stromečkem 24. prosince, Mikuláš = obchůzka s odměnou podle chování na začátku prosince, Masopust = veselí a hodování PŘED postem, Velikonoce = oslava KONCE postu a příchodu jara, Dušičky = vzpomínka na zemřelé začátkem listopadu.";

type Zvyk = [string, string]; // [text zvyku, proč tam patří]

// ── L1 — tři jasně odlišné svátky, jedno slovo/sousloví ───────────────────

const JASNE_L1: Record<string, Zvyk[]> = {
  [VANOCE]: [
    ["zdobení vánočního stromečku", "vánoční výzdoba domácnosti"],
    ["štědrovečerní večeře s kaprem", "tradiční večeře 24. prosince"],
    ["dárky pod stromečkem od Ježíška", "nadílka na Štědrý večer"],
    ["vánoční cukroví", "tradiční pečivo o Vánocích"],
    ["betlém s figurkami", "vánoční výzdoba znázorňující narození"],
    ["adventní věnec se svíčkami", "odpočítávání dnů do Vánoc"],
  ],
  [VELIKONOCE]: [
    ["malování kraslic", "zdobení velikonočních vajíček"],
    ["pletení pomlázky z vrbových proutků", "výroba velikonoční pomlázky"],
    ["velikonoční beránek", "sladký symbol Velikonoc"],
    ["barvení vajíček", "velikonoční zvyk"],
    ["velikonoční zajíček", "symbol jara a Velikonoc"],
  ],
  [MIKULAS]: [
    ["nadílka od Mikuláše 5. prosince", "obchůzka s dárky na začátku prosince"],
    ["čert s řetězem", "postava z mikulášské obchůzky"],
    ["anděl s křídly", "postava z mikulášské obchůzky"],
    ["básnička za sladkost od Mikuláše", "odměna za básničku při obchůzce"],
    ["pytel s dárky i bramborou", "Mikuláš nese dárky i trest za zlobení"],
  ],
};

// ── L2 — zvyk jako krátká situace (1 věta), 4 svátky ───────────────────────

const L2_POOL: Record<string, Zvyk[]> = {
  [VANOCE]: [
    ["Rodina zasedne 24. prosince večer ke štědrovečerní večeři a po ní si pod ozdobeným stromkem rozdá dárky.", "štědrovečerní večeře a nadílka 24. prosince"],
    ["Děti zpívají u ozdobeného stromečku písně, které vyprávějí příběh o narození, a zpívá se jen v tomto jednom období roku.", "koledy o narození u stromečku"],
    ["Na stole vedle cukroví leží ozdobená jablka a ořechy, které rodina věší i na větve stromečku.", "vánoční výzdoba a pochoutky"],
    ["Po štědrovečerní večeři si rodina rozkrojí jablko napříč a podle tvaru jadérek hádá, co ji v novém roce čeká.", "štědrovečerní věštění po večeři"],
  ],
  [VELIKONOCE]: [
    ["Chlapci ráno chodí s upletenou pomlázkou od domu k domu a dívky jí jemně vyšlehají přes nohy, aby byly celý rok zdravé.", "pomlázka a přání zdraví"],
    ["Rodina barví vajíčka na tvrdo a zdobí je voskem, než je o svátcích vystaví na slavnostní stůl.", "barvení a zdobení vajíček"],
    ["Hospodyně za vyšlehání pomlázkou odmění chlapce malovaným vajíčkem nebo pentlí uvázanou na pomlázce.", "odměna za pomlázku"],
    ["Na Bílou sobotu si rodina peče tradiční velikonoční mazanec, který se podává o svátečním ránu.", "velikonoční mazanec"],
  ],
  [MIKULAS]: [
    ["Večer 5. prosince chodí po bytech tři postavy a dítě, které umí básničku, dostane za odměnu balíček se sladkostmi.", "obchůzka 5. prosince"],
    ["Dítě se před cizí postavou s řetězem trochu bojí, ale nakonec přednese básničku a dostane sladkou odměnu.", "obchůzka s odměnou za básničku"],
    ["Do bytu vstoupí tři postavy — jedna se zápisníkem, jedna okřídlená a jedna s řetězem — a ptají se dětí, jestli byly celý rok hodné.", "obchůzka tří postav"],
  ],
  [MASOPUST]: [
    ["Vesnicí prochází veselý průvod maskovaných postav a lidé pořádají bohaté hodování s pochoutkami z prasátka, ještě než začne půst.", "průvod masek a hodování před postem"],
    ["Lidé si nasadí škrabošky a veselí se posledními hody a koblihami, než na čtyřicet dní nastane půst.", "veselí a koblihy před postem"],
  ],
  [DUSICKY]: [
    ["Lidé začátkem listopadu navštěvují hroby svých zemřelých příbuzných, uklízí je a zapalují na nich svíčky.", "návštěva hrobů a svíčky za zemřelé"],
    ["Rodina si na hřbitově začátkem listopadu připomíná zemřelé příbuzné a pokládá na jejich hroby věnce.", "vzpomínka na zemřelé na hřbitově"],
  ],
};

// ── L3 — zima (Mikuláš × Vánoce) a předjaří (Masopust × Velikonoce) ────────
// Zvyk popsaný opisem ÚČELU; povrchově připomíná druhý svátek ze stejného
// období, ale patří do své skupiny podle FUNKCE (postní cyklus, typ koledy).

const L3_POOL: Record<string, Zvyk[]> = {
  [VANOCE]: [
    ["Večer, kdy na obloze zazáří první hvězda, usedá celá rodina ke slavnostní večeři a pak si pod ozdobeným stromkem nadělí dárky.", "je to rodinná večeře a nadílka 24. prosince, ne obchůzka za odměnu podle chování"],
    ["Rodina si u ozdobeného stromku zpívá tradiční písně, které vyprávějí příběh o narození, a zpívá se jen v tomto jednom zimním období.", "je to zpívání doma u stromečku o narození, ne obchůzka od domu k domu"],
    ["Poté, co všichni usednou k štědrovečerní tabuli, přijde na řadu rozbalování dárků pod ozdobeným stromkem.", "nadílka je součástí rodinné večeře 24. prosince, ne obchůzky za básničku"],
  ],
  [MIKULAS]: [
    ["Podvečer na začátku prosince obchází od domu k domu trojice postav; ta hodná dětem za básničku nadělí sladkost, ta postrašující je jen vyděsí řetězem.", "je to obchůzka za odměnu podle chování, ne rodinná večeře u stromečku"],
    ["Tři postavy večer obcházejí byty a dítě, které přednese básničku nebo zazpívá písničku, dostane za to sladkou odměnu, zlobivé je jen postrašeno.", "odměna závisí na tom, jak se dítě celý rok chovalo — to je obchůzka, ne rodinná nadílka"],
    ["Tři postavy, mezi nimi jedna se zápisníkem, kam si zaznamenávají, kdo byl v uplynulém roce hodný, obcházejí večer byty a hodným dětem dají za básničku sladkost.", "hodnocení chování a odměna za básničku patří k obchůzce, ne k rodinné večeři"],
  ],
  [MASOPUST]: [
    ["Vesnicí prochází veselý průvod maskovaných postav ještě předtím, než začne čtyřicetidenní půst, a průvodem končí zimní období hodování.", "je to veselí PŘED postem, ne oslava jeho konce"],
    ["Lidé se v maskách veselí a hodují naposledy před dlouhým jarním půstem, který začne hned druhý den ráno.", "je to poslední veselí před postem, ne po jeho skončení"],
    ["Průvod postav v maskách prochází vsí a lidé si užívají poslední veselí, koblihy a zabijačkové hody, než ráno začne dlouhý čtyřicetidenní půst.", "veselí a hodování patří před začátek postu, ne po jeho konci"],
  ],
  [VELIKONOCE]: [
    ["Po skončení dlouhého čtyřicetidenního půstu chodí chlapci ráno s pomlázkou popřát dívkám zdraví a doma na ně čekají barevně zdobená vajíčka.", "je to oslava KONCE postu a příchodu jara, ne veselí před ním"],
    ["Chlapci ráno přednesou u dveří krátkou říkanku a dívkám jemně vyšlehají nohy pomlázkou z vrbových proutků, začež dostanou od hospodyně malovaná vajíčka.", "odměnou jsou vajíčka za pomlázku PO skončení postu, ne sladkost za básničku"],
    ["Až skončí čtyřicetidenní půst, přijde jarní neděle, kdy si rodina k snídani upeče tradiční nadýchané pečivo a prohlíží si pestře pomalovaná vajíčka.", "sváteční pečivo a pomalovaná vajíčka patří k oslavě konce postu, ne k veselí před jeho začátkem"],
  ],
};

// ── Zadání a stavba úlohy ──────────────────────────────────────────────────

const ZADANI: Record<number, string> = {
  1: "Zařaď tři zvyky ke správnému svátku.",
  2: "Roztřiď zvyky do správných svátků.",
  3: "Zařaď zvyky; pozor, některé vypadají jinak, než kam patří.",
};

function uloha(level: number): PracticeTask {
  let groups: string[];
  let pool: Record<string, Zvyk[]>;

  if (level === 1) {
    groups = [VANOCE, VELIKONOCE, MIKULAS];
    pool = JASNE_L1;
  } else if (level === 2) {
    const extra = Math.random() < 0.5 ? MASOPUST : DUSICKY;
    groups = [VANOCE, VELIKONOCE, MIKULAS, extra];
    pool = L2_POOL;
  } else {
    groups = [VANOCE, MIKULAS, MASOPUST, VELIKONOCE];
    pool = L3_POOL;
  }

  const vyber: Record<string, Zvyk[]> = {};
  for (const g of groups) vyber[g] = pickN(pool[g], 1);

  const vse = shuffle(groups.flatMap((g) => vyber[g].map(([n, proc]) => ({ n, proc, g }))));
  const ukazka = vse.map((x) => `„${x.n}“`);

  return cat(
    ZADANI[level],
    groups.map((g) => ({ name: g, items: vyber[g].map(([n]) => n) })),
    {
      hints: [
        `U zvyků ${ukazka.join(", ")} zjisti, KDY se dělají a K ČEMU slouží — to tě dovede ke správnému svátku.`,
        level === 3
          ? `${RULE} Nerozhoduj podle ročního období (zima, předjaří), ale podle ÚČELU zvyku.`
          : RULE,
      ],
      explanation: `${RULE} ${vse.map((x) => `„${x.n}“: ${x.proc} (patří k svátku ${x.g}).`).join(" ")}`,
    },
  );
}

function gen(level: number): PracticeTask[] {
  const out = new Map<string, PracticeTask>();
  for (let i = 0; i < 200 && out.size < 24; i++) {
    const t = uloha(level);
    out.set(t.categories!.map((c) => c.items.join("+")).join("|"), t);
  }
  return [...out.values()];
}

// ── Topic ────────────────────────────────────────────────────────────────

export const ROK_V_PROMENACH_TRADICE_A_ZVYKY: TopicMetadata[] = [
  {
    id: "g6-vko-rok-v-promenach-tradice-a-zvyky-6",
    rvpNodeId:
      "g6-vko-clovek-ve-spolecnosti-rok-v-jeho-promenach-tradice-a-zvyky-behem-roku-vanoce-velikonoce-ad",
    displayName: "Tradice a zvyky během roku",
    title: "Rok v jeho proměnách — tradice a zvyky (Vánoce, Velikonoce, Mikuláš, Masopust, Dušičky)",
    studentTitle: "Svátky a zvyky během roku",
    subject: "vko",
    category: "Člověk ve společnosti",
    topic: "Rok v jeho proměnách",
    briefDescription: "Zařadíš lidové zvyky a symboly ke správnému svátku podle jejich smyslu.",
    keywords: [
      "Vánoce", "Velikonoce", "Mikuláš", "Masopust", "Dušičky",
      "lidový zvyk", "tradice", "svátek", "pomlázka", "koleda",
    ],
    goals: [
      "Rozpoznat lidový zvyk, symbol nebo činnost a zařadit ho ke správnému svátku.",
      "Rozlišit svátky podle FUNKCE a ÚČELU zvyku, ne jen podle ročního období.",
      "Nenechat se zmást tím, že dva svátky připadají na podobnou roční dobu (zima, předjaří).",
    ],
    boundaries: [
      "Svátky jsou podávány jako kulturní zvyk („podle tradice…“), ne jako náboženská pravda.",
      "Jen pět běžných svátků (Vánoce, Velikonoce, Mikuláš, Masopust, Dušičky), bez podrobné liturgie.",
      "Bez přesných hodin a míst konání — jen zvyk, období a smysl zvyku.",
    ],
    gradeRange: [6, 6],
    inputType: "categorize",
    defaultLevel: 1,
    sessionTaskCount: 3,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: RULE,
      steps: [
        "Nejdřív odhadni, do jaké roční doby zvyk patří.",
        "Pokud se dvě roční období pletou (zima, předjaří), rozhodni podle ÚČELU zvyku, ne podle data.",
        "Ověř, zda zvyk sedí k tomu, co se o daném svátku slaví nebo připomíná.",
      ],
      commonMistake:
        "Zařadit zvyk jen podle ročního období (zima = Mikuláš i Vánoce dohromady, předjaří/jaro = Masopust i Velikonoce dohromady), místo podle skutečného účelu zvyku.",
      example:
        "Obchůzka za básničku s odměnou podle chování = Mikuláš (začátek prosince). Rodinná večeře a nadílka pod stromečkem = Vánoce (24. prosince). Veselí a hodování PŘED postem = Masopust. Oslava KONCE postu a příchodu jara = Velikonoce.",
    },
  },
];
