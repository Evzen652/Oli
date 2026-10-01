/**
 * Pozdrav, oslovení, omluva, prosba, vzkaz — 2. ročník.
 *
 * RVP uzel `g2-cjl-komunikacni-a-slohova-vychova-slohova-vychova-pozdrav-
 * osloveni-omluva-prosba-vzkaz`. Do 2026-10-01 nebyl naplněný; byl jedním
 * z pěti uzlů, které zbyly po opravě `rvpNodeId` (viz `PROJECT_STATUS.md` §6).
 *
 * **Sloh tady neznamená volný text.** `inputType: "essay"` v aplikaci
 * neexistuje a existovat nemá (`CLAUDE.md`); komunikační a slohová výchova se
 * dělá jako běžná cvičení s výběrem odpovědi. Dítě tedy neskládá vzkaz, ale
 * pozná, který ze čtyř vzkazů je použitelný — a to je dovednost, ne náhražka.
 *
 * Kalibrace úrovní:
 * - **L1 rozpoznání** — co ta věta vlastně dělá (pozdrav × omluva × prosba ×
 *   poděkování) a které slovo ve větě je oslovení. Čisté případy, bez kontextu.
 * - **L2 aplikace** — konkrétní situace a správný tvar: denní doba, vykání
 *   dospělému proti tykání kamarádovi, a vybrat tu funkci, kterou situace
 *   žádá (poděkovat, ne se omluvit).
 * - **L3 přenos** — posoudit celý krátký text, ne jednu větu: který vzkaz nese
 *   všechny tři údaje (kdo, co, kdy), která prosba je prosba a ne rozkaz,
 *   a která omluva vinu přijímá místo svádění na druhé. Dvoukrokové: nejdřív
 *   zjisti, co je potřeba, pak teprve porovnej čtyři možnosti.
 *
 * **Délka možností.** U každé úlohy se distraktory vybírají tak, aby byly
 * délkou blízko klíči — jinak se dá hádat podle toho, že klíč je nejdelší.
 * Hlídá to `zkontroluj()` níž, která úlohu při porušení shodí už při generování.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// ── Kritik uvnitř souboru ────────────────────────────────────────────────────
// Generátor a kontrola jsou oddělené: `zkontroluj` nezná záměr úlohy, jen se
// dívá na hotový výsledek. Padá hlasitě, protože vadná úloha se nemá dostat
// před dítě ani v dev náhledu.

/** Nejdelší možnost nesmí být o víc než tolik procent delší než nejkratší. */
const MAX_ROZPTYL_DELKY = 0.6;

/**
 * Srovná text na podobu, ve které se dá porovnávat únik: malá písmena, bez
 * interpunkce a uvozovek, jedna mezera mezi slovy. Česká sazba používá „ i “
 * a obě musí padnout — na tom se v projektu jedna kontrola nápověd už
 * neshodla (`SESSION_HANDOFF.md` §4).
 */
const bezInterpunkce = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,!?;:…„“"'’\-–—()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Měřit délku možností má smysl tam, kde jsou možnosti **odpovědi** — čtyři
 * věty, ze kterých dítě jednu volí, a kde „vyber tu nejdelší" je použitelná
 * strategie bez znalosti látky (`CONTENT_AUTHORING.md` §2.4).
 *
 * U úloh „které slovo ve větě je oslovení" to ale neplatí: možnosti jsou
 * slova **z té konkrétní věty** a jejich délku si autor nevybírá. Srovnávat je
 * by znamenalo vyhazovat správné distraktory (podmět, sloveso, předmět) za to,
 * že jsou shodou okolností krátké — tedy pokazit úlohu kvůli měřítku. Dvouleté
 * dítě navíc nehádá „nejdelší slovo ve větě"; tahle strategie dává smysl jen
 * nad sadou hotových odpovědí.
 *
 * Proto je ta kontrola u tohohle tvaru vypnutá **vědomě**, ne opomenutím.
 * Systémovou hádatelnost napříč tématem měří agregát v
 * `src/test/pozdrav-osloveni-omluva.test.ts` („klíč není nejdelší možnost
 * častěji, než by vyšla náhoda").
 */
interface Volby {
  meritDelku?: boolean;
}

function zkontroluj(t: PracticeTask, kde: string, volby: Volby = {}): PracticeTask {
  const o = t.options ?? [];
  if (o.length !== 4) throw new Error(`${kde}: možností je ${o.length}, mají být 4`);
  if (new Set(o).size !== 4) throw new Error(`${kde}: dvě možnosti jsou shodné`);
  if (!o.includes(t.correctAnswer)) throw new Error(`${kde}: klíč není mezi možnostmi`);
  if (!t.hints || t.hints.length < 2) throw new Error(`${kde}: chybí dvoustupňová nápověda`);
  if (t.hints[0] === t.hints[1]) throw new Error(`${kde}: obě nápovědy jsou stejné`);
  if (!t.explanation) throw new Error(`${kde}: chybí vysvětlení`);
  for (const m of o) {
    if (m === t.correctAnswer) continue;
    if (!t.optionFeedback?.[m]) throw new Error(`${kde}: distraktor „${m}“ nemá zpětnou vazbu`);
  }
  // Nápověda nesmí obsahovat klíč — to je únik, ne pomoc.
  //
  // ⚠️ Tahle kontrola tu nejdřív stála jako `h.includes(t.correctAnswer)`,
  // tedy přesná shoda. Pět úniků jí proto prošlo: nápověda nesla „Dobrou noc“
  // a klíč byl „Dobrou noc.“ — lišily se tečkou. Našel je až `audit:content`,
  // který text normalizuje. Kontrola, která se sama neověří, mlčí právě
  // o tom, co má hlídat.
  for (const h of t.hints) {
    if (bezInterpunkce(h).includes(bezInterpunkce(t.correctAnswer))) {
      throw new Error(`${kde}: nápověda prozrazuje klíč („${t.correctAnswer}“)`);
    }
  }
  if (volby.meritDelku !== false) {
    const delky = o.map((m) => m.length);
    const min = Math.min(...delky), max = Math.max(...delky);
    if (max > min * (1 + MAX_ROZPTYL_DELKY)) {
      throw new Error(`${kde}: možnosti se liší délkou ${min}–${max} znaků, dá se hádat`);
    }
  }
  return t;
}

function uloha(
  q: string,
  a: string,
  d: [string, string][],
  h: [string, string],
  e: string,
  emoji: string,
  volby: Volby = {},
): PracticeTask {
  if (d.length !== 3) throw new Error(`Úloha „${q}“ nemá tři chybné možnosti`);
  const wrong = d.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];
  const t = { ...choice(q, a, wrong, { hints: h, explanation: e }), emoji };
  return zkontroluj(t, q, volby);
}

// ─────────────────────────────────────────────────────────────────────────────
// L1a — co ta věta dělá
// ─────────────────────────────────────────────────────────────────────────────
// Čtyři funkce, každá se pozná podle znaku, který jde do zpětné vazby. Věty
// jsou držené v podobné délce (10–20 znaků), aby se daly porovnávat na první
// pohled a aby klíč nevyčníval. `cue` je slovo, kterým ta věta prozradí svou
// funkci — z něj se skládá nápověda, takže je unikátní pro každou úlohu.

type Funkce = "pozdrav" | "omluva" | "prosba" | "podekovani";

const NAZEV: Record<Funkce, string> = {
  pozdrav: "pozdrav",
  omluva: "omluva",
  prosba: "prosba",
  podekovani: "poděkování",
};

const ZNAK: Record<Funkce, string> = {
  pozdrav: "pozdravem někoho vítáme nebo se s ním loučíme",
  omluva: "omluvou říkáme, že nás mrzí, co jsme udělali",
  prosba: "prosbou někoho o něco žádáme a necháváme mu volbu",
  podekovani: "poděkováním oceníme, co pro nás někdo udělal",
};

interface Veta {
  t: string;
  f: Funkce;
  /** Slovo, které funkci věty prozradí — jde do malé nápovědy. */
  cue: string;
}

const VETY: Veta[] = [
  { t: "Dobré ráno!", f: "pozdrav", cue: "Dobré ráno" },
  { t: "Dobrý den.", f: "pozdrav", cue: "Dobrý den" },
  { t: "Na shledanou.", f: "pozdrav", cue: "Na shledanou" },
  { t: "Dobrou noc.", f: "pozdrav", cue: "Dobrou noc" },
  { t: "Vítej u nás.", f: "pozdrav", cue: "Vítej" },
  { t: "Promiň mi to.", f: "omluva", cue: "Promiň" },
  { t: "Omlouvám se.", f: "omluva", cue: "Omlouvám se" },
  { t: "Odpusť mi to.", f: "omluva", cue: "Odpusť" },
  { t: "Je mi to líto.", f: "omluva", cue: "líto" },
  { t: "Už to neudělám.", f: "omluva", cue: "neudělám" },
  { t: "Prosím, pomoz mi.", f: "prosba", cue: "Prosím" },
  { t: "Půjčíš mi to?", f: "prosba", cue: "Půjčíš" },
  { t: "Můžu si sednout?", f: "prosba", cue: "Můžu" },
  { t: "Podáš mi tu tašku?", f: "prosba", cue: "Podáš" },
  { t: "Děkuju ti.", f: "podekovani", cue: "Děkuju" },
  { t: "Mockrát děkuji.", f: "podekovani", cue: "děkuji" },
  { t: "Díky za pomoc.", f: "podekovani", cue: "Díky" },
  { t: "Děkuji za dárek.", f: "podekovani", cue: "Děkuji" },
];

/**
 * Ke klíči dohledá tři distraktory — každý jiné funkce a délkou co nejblíž
 * klíči. Výběr je deterministický (řadí podle rozdílu délky, při shodě podle
 * textu), takže generátor vydá pokaždé tutéž sadu a úlohy jsou spočitatelné.
 */
function blizkeDelkou(klic: Veta): Veta[] {
  const ostatni: Funkce[] = (["pozdrav", "omluva", "prosba", "podekovani"] as Funkce[]).filter(
    (f) => f !== klic.f,
  );
  return ostatni.map((f) => {
    const kandidati = VETY.filter((v) => v.f === f);
    return [...kandidati].sort((a, b) => {
      const da = Math.abs(a.t.length - klic.t.length), db = Math.abs(b.t.length - klic.t.length);
      return da - db || a.t.localeCompare(b.t, "cs");
    })[0];
  });
}

function funkceTask(klic: Veta, emoji: string): PracticeTask {
  const distraktory = blizkeDelkou(klic);
  return uloha(
    `Která věta je ${NAZEV[klic.f]}?`,
    klic.t,
    distraktory.map((v) => [v.t, `„${v.t}“ je ${NAZEV[v.f]} — ${ZNAK[v.f]}.`]) as [string, string][],
    // Nápověda NESMÍ ukázat na klíč jeho vlastním slovem: u vět jako
    // „Dobrou noc.“ je to vodítko totožné s odpovědí, jen bez tečky. Navádí se
    // proto vylučováním — jmenují se distraktory, nikdy klíč. Unikátní to je
    // samo, protože každá úloha má jinou trojici distraktorů.
    [
      `Vyřaď „${distraktory[0].t}“ — ${ZNAK[distraktory[0].f]}, takže to ${NAZEV[klic.f]} není. Zbývají tři možnosti.`,
      `Vyřaď i „${distraktory[1].t}“ a „${distraktory[2].t}“ — první je ${NAZEV[distraktory[1].f]}, druhá ${NAZEV[distraktory[2].f]}. Ze zbylé věty si přečti, kdy bys ji řekl: ${ZNAK[klic.f]}.`,
    ],
    `Je to ${NAZEV[klic.f]}, protože ${ZNAK[klic.f]}. Poznáš to podle slova „${klic.cue}“.`,
    emoji,
  );
}

const EMOJI_FUNKCE = ["👋", "🙇", "🙏", "💛", "🌞", "😔", "🤝", "🎁", "🌙", "✋", "💬", "🧡", "🫱", "😊", "🌼", "🙌", "🤗", "✨"];

function genL1a(): PracticeTask[] {
  return VETY.map((v, i) => funkceTask(v, EMOJI_FUNKCE[i % EMOJI_FUNKCE.length]));
}

// ─────────────────────────────────────────────────────────────────────────────
// L1b — které slovo ve větě je oslovení
// ─────────────────────────────────────────────────────────────────────────────
// Oslovení je v 2. ročníku hlavně o tom, koho ve větě oslovujeme (a že se
// odděluje čárkou). Distraktory jsou další slova z téže věty — tedy blízké
// chyby, ne náhodná slova: podmět, sloveso, předmět.

interface Osloveni {
  veta: string;
  klic: string;
  /** [slovo, proč to oslovení není] */
  chyby: [string, string][];
  emoji: string;
}

const OSLOVENI: Osloveni[] = [
  {
    veta: "Babičko, pojď se podívat na můj obrázek.",
    klic: "Babičko",
    chyby: [
      ["obrázek", "To je věc, o které mluvíme. Oslovujeme člověka, ne obrázek."],
      ["pojď", "To říká, co má babička udělat. Oslovení je ten, komu to říkáme."],
      ["podívat", "To je další slovo o tom, co se má dělat, ne o tom, koho oslovujeme."],
    ],
    emoji: "👵",
  },
  {
    veta: "Petře, půjčíš mi prosím tu gumu?",
    klic: "Petře",
    chyby: [
      ["gumu", "To je věc, o kterou prosíme. Oslovujeme člověka."],
      ["půjčíš", "To říká, co má Petr udělat, ne koho oslovujeme."],
      ["prosím", "To je zdvořilé slovo v prosbě, ale neříká, komu je věta určená."],
    ],
    emoji: "✏️",
  },
  {
    veta: "Pane učiteli, nerozumím té úloze.",
    klic: "Pane učiteli",
    chyby: [
      ["úloze", "To je věc, o které mluvíme. Oslovujeme člověka."],
      ["nerozumím", "To říká, co se děje se mnou, ne koho oslovuji."],
      ["té úloze", "To je taky věc, jen se dvěma slovy. Oslovení je člověk."],
    ],
    emoji: "🧑‍🏫",
  },
  {
    veta: "Mami, můžu jít na hřiště za Terezou?",
    klic: "Mami",
    chyby: [
      ["hřiště", "To je místo, kam chci jít, ne ten, koho oslovuji."],
      ["Terezou", "Tereza je ve větě zmíněná, ale nemluvím na ni. Mluvím na mámu."],
      ["můžu", "To je slovo prosby, neříká, komu je věta určená."],
    ],
    emoji: "👩",
  },
  {
    veta: "Honzíku, nezapomeň si doma čepici.",
    klic: "Honzíku",
    chyby: [
      ["čepici", "To je věc, o které mluvíme. Oslovujeme člověka."],
      ["nezapomeň", "To říká, co má Honzík udělat, ne koho oslovujeme."],
      ["doma", "To říká, kde se to má stát, ne komu je věta určená."],
    ],
    emoji: "🧢",
  },
  {
    veta: "Paní prodavačko, kolik stojí ten rohlík?",
    klic: "Paní prodavačko",
    chyby: [
      ["rohlík", "To je věc, na kterou se ptám, ne ten, koho oslovuji."],
      ["kolik", "To je slovo otázky, neříká, komu je věta určená."],
      ["ten rohlík", "To je taky věc, jen se dvěma slovy. Oslovení je člověk."],
    ],
    emoji: "🥖",
  },
  {
    veta: "Terezko, podrž mi prosím ty dveře.",
    klic: "Terezko",
    chyby: [
      ["dveře", "To je věc, o kterou prosíme. Oslovujeme člověka."],
      ["podrž", "To říká, co má Terezka udělat, ne koho oslovujeme."],
      ["prosím", "To je zdvořilé slovo v prosbě, neříká, komu je věta určená."],
    ],
    emoji: "🚪",
  },
  {
    veta: "Tati, rozbil jsem ti ten hrnek.",
    klic: "Tati",
    chyby: [
      ["hrnek", "To je věc, která se rozbila, ne ten, koho oslovuji."],
      ["rozbil", "To říká, co se stalo, ne komu to říkám."],
      ["jsem", "To je část slova o tom, co se stalo, ne oslovení."],
    ],
    emoji: "☕",
  },
  {
    veta: "Kamarádi, počkejte na mě u branky!",
    klic: "Kamarádi",
    chyby: [
      ["branky", "To je místo, kde mají počkat, ne ti, koho oslovuji."],
      ["počkejte", "To říká, co mají kamarádi udělat, ne koho oslovujeme."],
      ["u branky", "To je taky místo, jen se dvěma slovy. Oslovení je člověk."],
    ],
    emoji: "⚽",
  },
  {
    veta: "Dědo, vyprávěj mi tu pohádku o vodníkovi.",
    klic: "Dědo",
    chyby: [
      ["pohádku", "To je věc, o kterou prosím, ne ten, koho oslovuji."],
      ["vyprávěj", "To říká, co má děda udělat, ne koho oslovujeme."],
      ["vodníkovi", "Vodník je v pohádce, ale nemluvím na něj. Mluvím na dědu."],
    ],
    emoji: "🧙",
  },
  {
    veta: "Sestřičko, nech mi taky kousek toho dortu.",
    klic: "Sestřičko",
    chyby: [
      ["dortu", "To je věc, o kterou prosím, ne ta, koho oslovuji."],
      ["kousek", "To říká, kolik toho chci, ne komu to říkám."],
      ["nech", "To říká, co má sestřička udělat, ne koho oslovujeme."],
    ],
    emoji: "🍰",
  },
  {
    veta: "Pane řidiči, zastavíte u nádraží?",
    klic: "Pane řidiči",
    chyby: [
      ["nádraží", "To je místo, kde má zastavit, ne ten, koho oslovuji."],
      ["zastavíte", "To říká, co má řidič udělat, ne koho oslovujeme."],
      ["u nádraží", "To je taky místo, jen se dvěma slovy. Oslovení je člověk."],
    ],
    emoji: "🚌",
  },
  {
    veta: "Aničko, přečteš mi ten vzkaz od mamky?",
    klic: "Aničko",
    chyby: [
      ["vzkaz", "To je věc, o kterou prosím, ne ta, koho oslovuji."],
      ["přečteš", "To říká, co má Anička udělat, ne koho oslovujeme."],
      ["od mamky", "Mamka vzkaz napsala, ale nemluvím na ni. Mluvím na Aničku."],
    ],
    emoji: "📄",
  },
];

function osloveniTask(o: Osloveni): PracticeTask {
  // Nápovědy nesmějí citovat začátek věty — tam totiž oslovení stojí, takže
  // by to byl doslovný klíč. První verze tohle měla a shodila ji `zkontroluj`.
  // Navádí se proto odzadu: jedním konkrétním chybným slovem a zbytkem věty
  // za čárkou.
  const zbytek = o.veta.slice(o.veta.indexOf(",") + 1).trim();
  return uloha(
    `Věta: „${o.veta}“ Které slovo je oslovení?`,
    o.klic,
    o.chyby,
    [
      `Slovo „${o.chyby[0][0]}“ není nikdo, koho bys oslovoval. Hledáš ve větě toho, komu ji říkáš.`,
      `Oslovení se odděluje čárkou. Přečti si větu bez té části před čárkou — zbude „${zbytek}“ A teď už není poznat, komu to říkáš. Právě to odpadlé slovo je oslovení.`,
    ],
    `Oslovení se odděluje čárkou a je to ten, komu větu říkáš. Slovo „${o.chyby[0][0]}“ ani „${o.chyby[1][0]}“ to není — obě mluví o tom, co se děje nebo o čem je ve větě řeč.`,
    o.emoji,
    // Možnosti jsou slova z dané věty — délku si autor nevybírá, viz `Volby`.
    { meritDelku: false },
  );
}

function genL1(): PracticeTask[] {
  return [...genL1a(), ...OSLOVENI.map(osloveniTask)];
}

// ─────────────────────────────────────────────────────────────────────────────
// L2 — správný tvar pro konkrétní situaci
// ─────────────────────────────────────────────────────────────────────────────
// Tři druhy chyb, které dítě v tomhle věku dělá doopravdy:
//   DOBA  — pozdrav mimo denní dobu („Dobrou noc“ ráno)
//   TYKANI — tykání dospělému, kterému se vyká (a naopak vykání kamarádovi)
//   FUNKCE — zdvořilá věta, ale jiná, než situace žádá (omluva místo díků)

interface Situace {
  /** Co se děje — zadání. */
  kdy: string;
  klic: string;
  doba?: [string, string];
  tykani?: [string, string];
  funkce: [string, string];
  /** Druhá chyba ve funkci — u situací, které nemají chybu v denní době. */
  funkce2?: [string, string];
  /** Unikátní vodítko do malé nápovědy. */
  cue: string;
  emoji: string;
}

const SITUACE: Situace[] = [
  {
    kdy: "Ráno přijdeš do školy a potkáš paní učitelku. Co jí řekneš?",
    klic: "Dobré ráno, paní učitelko.",
    doba: ["Dobrou noc, paní učitelko.", "„Dobrou noc“ se říká, když se jde spát. Ráno ne."],
    tykani: ["Ahoj, dobré ráno, Jano.", "Paní učitelce vykáme a oslovujeme ji „paní učitelko“, ne jménem."],
    funkce: ["Děkuji vám, paní učitelko.", "Poděkování je zdvořilé, ale nic ti zatím neudělala. Nejdřív se zdraví."],
    cue: "ráno",
    emoji: "🌞",
  },
  {
    kdy: "Večer jdeš od babičky domů. Co jí řekneš na rozloučení?",
    klic: "Dobrou noc, babičko.",
    doba: ["Dobré ráno, babičko.", "„Dobré ráno“ patří k ránu. Ty odcházíš večer."],
    tykani: ["Dobrou noc, paní babičko.", "Babičce se v rodině tyká a říká se jí „babičko“, ne „paní babičko“."],
    funkce: ["Promiň mi to, babičko.", "Omluva se hodí, když tě něco mrzí. Ty se jen loučíš."],
    cue: "večer",
    emoji: "🌙",
  },
  {
    kdy: "Kamarád ti půjčil pastelku. Co mu řekneš?",
    klic: "Děkuju ti za pastelku.",
    funkce2: ["Prosím tě o tu pastelku.", "Prosba by platila předtím, než ti ji půjčil. Teď už ji máš."],
    tykani: ["Děkuji vám za pastelku.", "Kamarádovi tykáme, takže „ti“, ne „vám“."],
    funkce: ["Promiň mi tu pastelku.", "Omluva by platila, kdybys ji zlomil. On ti ji ale půjčil."],
    cue: "půjčil",
    emoji: "🖍️",
  },
  {
    kdy: "Omylem jsi srazil kamarádovi penál na zem. Co mu řekneš?",
    klic: "Promiň, zvednu ti ho.",
    funkce2: ["Prosím tě, zvedni ho.", "Prosba to neřeší — penál jsi srazil ty, tak ho zvedni sám."],
    tykani: ["Promiňte, zvednu vám ho.", "Kamarádovi tykáme, takže „ti“, ne „vám“."],
    funkce: ["Děkuju, zvednu ti ho.", "Poděkování sem nepatří — nic ti neudělal, to ty jsi mu penál srazil."],
    cue: "srazil",
    emoji: "✏️",
  },
  {
    kdy: "Chceš se v jídelně posadit vedle Terezky. Co jí řekneš?",
    klic: "Můžu si sednout vedle tebe?",
    funkce2: ["Promiň, že si sedám k tobě.", "Omluva nemá důvod. Nejdřív se zeptej, jestli můžeš."],
    tykani: ["Můžu si sednout vedle vás?", "Terezka je kamarádka, té se tyká: „vedle tebe“."],
    funkce: ["Sednu si vedle tebe.", "To už není prosba, ale oznámení. Prosba nechává Terezce volbu."],
    cue: "sednout",
    emoji: "🍽️",
  },
  {
    kdy: "Po obědě odcházíš z jídelny a potkáš paní kuchařku. Co jí řekneš?",
    klic: "Děkuji vám za oběd.",
    funkce2: ["Promiňte mi ten oběd.", "Omluva nemá důvod — oběd jsi nezkazil, dostal jsi ho."],
    tykani: ["Děkuju ti za oběd.", "Paní kuchařce vykáme, takže „vám“, ne „ti“."],
    funkce: ["Dobré ráno, paní kuchařko.", "Tohle je pozdrav, a navíc ranní. Po obědě se hodí poděkovat."],
    cue: "oběd",
    emoji: "🍲",
  },
  {
    kdy: "Ve tramvaji chceš projít k východu. Co řekneš pánovi, který stojí v cestě?",
    klic: "Promiňte, můžu projít?",
    funkce2: ["Běžte mi prosím z cesty.", "To je rozkaz s přilepeným „prosím“. Slušnější je omluvit se a zeptat se."],
    tykani: ["Promiň, můžu projít?", "Cizímu dospělému vykáme: „promiňte“, ne „promiň“."],
    funkce: ["Děkuji, můžu projít?", "Poděkovat můžeš až potom, co ti udělá místo."],
    cue: "projít",
    emoji: "🚋",
  },
  {
    kdy: "Zapomněl jsi vrátit knížku do knihovny. Co řekneš paní knihovnici?",
    klic: "Omlouvám se, zapomněl jsem ji.",
    funkce2: ["Prosím vás, zapomněl jsem ji.", "„Prosím vás“ samo nic neřeší. Zapomnětlivost se omlouvá."],
    tykani: ["Omlouvám se ti, zapomněl jsem ji.", "Paní knihovnici vykáme — tady se „ti“ nehodí."],
    funkce: ["Děkuji vám, zapomněl jsem ji.", "Poděkování sem nepatří. Zapomnětlivost se omlouvá."],
    cue: "zapomněl",
    emoji: "📚",
  },
  {
    kdy: "Dopoledne přijdeš k sousedovi na návštěvu. Co mu řekneš ve dveřích?",
    klic: "Dobrý den, pane Novák.",
    doba: ["Dobrou noc, pane Novák.", "„Dobrou noc“ patří k večeru. Ty přicházíš dopoledne."],
    tykani: ["Ahoj, pane Novák.", "„Ahoj“ patří kamarádům. Sousedovi se vyká a zdraví se „dobrý den“."],
    funkce: ["Na shledanou, pane Novák.", "„Na shledanou“ se říká při odchodu, ne když přijdeš."],
    cue: "dopoledne",
    emoji: "🚪",
  },
  {
    kdy: "Spolužačka ti pomohla najít ztracenou čepici. Co jí řekneš?",
    klic: "Moc ti děkuju za pomoc.",
    funkce2: ["Moc tě prosím o pomoc.", "Prosba by platila předtím. Čepici už jsi našel."],
    tykani: ["Moc vám děkuju za pomoc.", "Spolužačce tykáme, takže „ti“, ne „vám“."],
    funkce: ["Moc se ti omlouvám za pomoc.", "Omluva nemá důvod. Pomohla ti, za to se děkuje."],
    cue: "čepici",
    emoji: "🧢",
  },
  {
    kdy: "Potřebuješ, aby ti paní učitelka zopakovala zadání. Co jí řekneš?",
    klic: "Zopakujete to ještě jednou?",
    funkce2: ["Zopakujte to ještě jednou!", "To je rozkaz. Paní učitelku o zopakování prosíme."],
    tykani: ["Zopakuješ to ještě jednou?", "Paní učitelce vykáme: „zopakujete“, ne „zopakuješ“."],
    // Původně tu stál ještě tvar „Zopakuju to ještě jednou." (o sobě). Všechny
    // čtyři možnosti pak byly tvary jednoho slovesa a úloha měřila jen vykání,
    // ne volbu toho, co se v situaci říká — upozornil na to nezávislý test.
    funkce: ["Děkuji vám za to zadání.", "Poděkování sem nepatří. Nejdřív potřebuješ, aby ti zadání zopakovala."],
    cue: "zadání",
    emoji: "🧑‍🏫",
  },
  {
    kdy: "Odcházíš z obchodu, kde ti paní poradila. Co jí řekneš?",
    klic: "Děkuji a na shledanou.",
    funkce2: ["Dobrý den a na shledanou.", "„Dobrý den“ patří k příchodu. Ty odcházíš a chceš poděkovat."],
    tykani: ["Děkuju ti a ahoj.", "Prodavačce vykáme, takže „děkuji“ a „na shledanou“."],
    funkce: ["Promiňte a na shledanou.", "Omluva nemá důvod — poradila ti, za to se děkuje."],
    cue: "poradila",
    emoji: "🛒",
  },
  {
    kdy: "Přišel jsi na trénink o deset minut pozdě. Co řekneš trenérovi?",
    klic: "Promiňte, že jdu pozdě.",
    funkce2: ["Prosím vás, jdu pozdě.", "Prosba to není — za zpoždění se omlouvá."],
    tykani: ["Promiň, že jdu pozdě.", "Trenérovi se vyká, pokud ti neřekl jinak: „promiňte“."],
    funkce: ["Děkuji, že jdu pozdě.", "Děkovat za vlastní zpoždění nejde. Pozdní příchod se omlouvá."],
    cue: "pozdě",
    emoji: "⏰",
  },
];

function situaceTask(s: Situace): PracticeTask {
  const chyby: [string, string][] = [s.funkce];
  if (s.doba) chyby.push(s.doba);
  if (s.tykani) chyby.push(s.tykani);
  if (s.funkce2) chyby.push(s.funkce2);
  if (chyby.length !== 3) {
    throw new Error(`Situace „${s.kdy}“ má ${chyby.length} chybných možností, mají být 3`);
  }
  return uloha(
    s.kdy,
    s.klic,
    chyby,
    [
      `Vrať se k tomu, co se v situaci děje — rozhoduje slovo „${s.cue}“. Co se v takové chvíli říká?`,
      `Postupně vylučuj. Nejdřív se zbav vět, které do téhle chvíle vůbec nepatří. Pak se podívej, komu mluvíš: dospělému, kterého neznáš blízko, vykáme; kamarádovi a rodině tykáme.`,
    ],
    `Situaci rozhoduje slovo „${s.cue}“ — podle něj poznáš, jestli se zdraví, děkuje, omlouvá nebo prosí. Druhá věc je, komu mluvíš: podle toho vybereš tykání, nebo vykání.`,
    s.emoji,
  );
}

function genL2(): PracticeTask[] {
  return SITUACE.map(situaceTask);
}

// ─────────────────────────────────────────────────────────────────────────────
// L3 — posoudit celý krátký text
// ─────────────────────────────────────────────────────────────────────────────

// (a) VZKAZ — úplnost. Dvoukrokové: z telefonátu si vytáhni tři údaje
//     (kdo, co, kdy), teprve pak porovnej čtyři vzkazy. Distraktory nejsou
//     nesmyslné — každý je slušně napsaný vzkaz, jen v něm jeden údaj chybí.

interface Vzkaz {
  /** Co se stalo — zdroj údajů. */
  zdroj: string;
  /**
   * Co ten konkrétní vzkaz musí nést. Není to pokaždé „kdo, co, kdy": u zápasu
   * rozhoduje i MÍSTO. Dokud tu stála pevná trojice, nápověda i vysvětlení
   * tvrdily tři údaje, zatímco zpětná vazba u distraktoru hlásila „chybí, kde" —
   * text sliboval něco jiného, než úloha měřila. Našlo se to až v prohlížeči.
   */
  potreba: string;
  klic: string;
  chyby: [string, string][];
  emoji: string;
}

const VZKAZY: Vzkaz[] = [
  {
    zdroj: "Mamka není doma. Volal pan Novák, že schůzka bude ve čtvrtek v pět hodin. Který vzkaz je úplný?",
    potreba: "kdo volal, co vzkazoval a kdy to platí",
    klic: "Mami, volal pan Novák. Schůzka je ve čtvrtek v pět.",
    chyby: [
      ["Mami, volal pan Novák. Schůzka bude někdy odpoledne.", "Chybí, kdy přesně. „Někdy odpoledne“ mamce neřekne, že je to ve čtvrtek v pět."],
      ["Mami, volal nějaký pán. Schůzka je ve čtvrtek v pět.", "Chybí, kdo volal. „Nějaký pán“ mamce nepomůže — byl to pan Novák."],
      ["Mami, volal pan Novák. Mám ti vzkázat, že volal.", "Chybí to hlavní — co vzkazoval. Zbyla jen zpráva, že telefonoval."],
    ],
    emoji: "📞",
  },
  {
    zdroj: "Tvůj brácha je venku. Volala teta Jana, že přijede v sobotu ráno. Který vzkaz je úplný?",
    potreba: "kdo volal, že přijede a kdy to bude",
    klic: "Ondro, volala teta Jana. Přijede v sobotu ráno.",
    chyby: [
      ["Ondro, volala teta Jana. Přijede k nám na návštěvu.", "Chybí, kdy přijede. Bez sobotního rána to brácha nestihne připravit."],
      ["Ondro, volala nějaká teta. Přijede v sobotu ráno.", "Chybí, která teta. Tet může být víc, proto patří do vzkazu jméno."],
      ["Ondro, v sobotu ráno nám volala teta Jana.", "Tohle říká, kdy volala, ne že přijede. Vzkaz se tím úplně změnil."],
    ],
    emoji: "🚗",
  },
  {
    zdroj: "Taťka spí. Volala paní učitelka, že výlet se posouvá na pátek. Který vzkaz je úplný?",
    potreba: "kdo volal, co se mění a na kdy",
    klic: "Tati, volala paní učitelka. Výlet se posouvá na pátek.",
    chyby: [
      ["Tati, volala paní učitelka. Výlet se nám zase posouvá.", "Chybí, na kdy. Bez pátku taťka neví, co si má zapsat."],
      ["Tati, volali nám ze školy. Výlet se posouvá na pátek.", "Chybí, kdo volal. „Ze školy“ je mlhavé — volala paní učitelka."],
      ["Tati, volala paní učitelka a chce, abys jí zavolal.", "Vzkaz se tím mění. Paní učitelka hlásila posunutý výlet."],
    ],
    emoji: "🎒",
  },
  {
    zdroj: "Sestra je u kamarádky. Volal trenér, že zápas začíná v devět u školy. Který vzkaz je úplný?",
    potreba: "kdo volal, kdy zápas začíná a kde se hraje",
    klic: "Evo, volal trenér. Zápas začíná v devět u školy.",
    chyby: [
      ["Evo, volal trenér. Zápas vám začíná už v devět.", "Chybí, kde. Bez „u školy“ nebude Eva vědět, kam má jít."],
      ["Evo, volal trenér. Zápas se hraje dole u školy.", "Chybí, kdy. Bez devíti hodin může Eva přijít pozdě."],
      ["Evo, volal někdo z oddílu. Zápas je v devět u školy.", "Chybí, kdo volal. Patří tam trenér, ne „někdo z oddílu“."],
    ],
    emoji: "⚽",
  },
  {
    zdroj: "Babička je na zahradě. Volal doktor, že výsledky si může vyzvednout ve středu. Který vzkaz je úplný?",
    potreba: "kdo volal, co si má babička vyzvednout a kdy",
    klic: "Babi, volal doktor. Výsledky si vyzvedneš ve středu.",
    chyby: [
      ["Babi, volal doktor. Výsledky už si můžeš vyzvednout.", "Chybí, kdy. Bez středy babička nebude vědět, kdy tam jít."],
      ["Babi, volali nám z ordinace. Výsledky jsou ve středu.", "Chybí, kdo volal. Patří tam doktor, ne „někdo z ordinace“."],
      ["Babi, volal doktor a máš se u něj ve středu zastavit.", "Vzkaz se mění — doktor hlásil hotové výsledky, ne návštěvu."],
    ],
    emoji: "🩺",
  },
];

function vzkazTask(v: Vzkaz): PracticeTask {
  return uloha(
    v.zdroj,
    v.klic,
    v.chyby,
    [
      `Nejdřív si z toho, co se stalo, vypiš tři věci: ${v.potreba}. Pak teprve čti vzkazy.`,
      `Dobrý vzkaz nese všechny tři údaje. U každé možnosti si odškrtni ${v.potreba} — u tří možností jeden údaj schází nebo je nahrazený něčím mlhavým.`,
    ],
    `Tenhle vzkaz musí nést tři údaje: ${v.potreba}. Když jeden chybí, ten, komu vzkaz patří, podle něj nemůže nic udělat.`,
    v.emoji,
  );
}

// (b) PROSBA × ROZKAZ — nová dovednost: rozlišit, jestli věta nechává druhému
//     volbu. Past: rozkaz, do kterého se přilepilo „prosím“, zůstává rozkazem.

interface Prosba {
  kdy: string;
  klic: string;
  chyby: [string, string][];
  emoji: string;
}

const PROSBY: Prosba[] = [
  {
    kdy: "Chceš si od kamaráda půjčit pastelku. Která věta je prosba?",
    klic: "Půjčil bys mi tu pastelku?",
    chyby: [
      ["Dej mi tu pastelku, prosím.", "Slovo „prosím“ to nespraví — „dej“ je pořád rozkaz. Kamarád nemá na výběr."],
      ["Potřebuju tu pastelku hned.", "To je oznámení, co potřebuješ ty. Kamaráda se to vůbec neptá."],
      ["Tu pastelku si teď beru.", "Tím mu nic neříkáš, jen si ji vezmeš. To není ani prosba."],
    ],
    emoji: "🖍️",
  },
  {
    kdy: "Chceš, aby ti sestra podržela dveře. Která věta je prosba?",
    klic: "Podržela bys mi ty dveře?",
    chyby: [
      ["Podrž mi ty dveře, prosím.", "„Prosím“ je slušné, ale „podrž“ je rozkaz. Sestra nemá volbu."],
      ["Musíš mi podržet ty dveře.", "„Musíš“ nedává na výběr vůbec. To není prosba, ale příkaz."],
      ["Ty dveře mi někdo podrží.", "To je oznámení do vzduchu. Nikoho konkrétně to neprosí."],
    ],
    emoji: "🚪",
  },
  {
    kdy: "Chceš, aby ti taťka pomohl s úkolem. Která věta je prosba?",
    klic: "Pomohl bys mi s tím úkolem?",
    chyby: [
      ["Pomoz mi s tím úkolem, prosím.", "„Prosím“ to nemění — „pomoz“ zůstává rozkaz."],
      ["Ten úkol za mě musíš udělat.", "To není prosba, ale příkaz. A navíc po taťkovi chceš, aby to udělal za tebe."],
      ["Ten úkol nezvládnu sám.", "Tím říkáš, jak ti je. O pomoc to ale neprosí."],
    ],
    emoji: "📘",
  },
  {
    kdy: "Chceš, aby ti spolužák uvolnil místo v řadě. Která věta je prosba?",
    klic: "Pustil bys mě prosím dopředu?",
    chyby: [
      ["Uhni mi z cesty, prosím.", "„Uhni“ je rozkaz, i když přidáš „prosím“. Spolužák nemá volbu."],
      ["Tady stojím já, ne ty.", "To je hádka o místo, ne prosba."],
      ["Chci stát na tvém místě.", "Tím říkáš, co chceš ty. Spolužáka se to neptá."],
    ],
    emoji: "🧍",
  },
  {
    kdy: "Chceš, aby ti babička přečetla dopis. Která věta je prosba?",
    klic: "Přečetla bys mi ten dopis?",
    chyby: [
      ["Přečti mi ten dopis, prosím.", "„Prosím“ nestačí — „přečti“ je rozkaz."],
      ["Ten dopis mi musíš přečíst.", "„Musíš“ nedává babičce na výběr. To je příkaz."],
      ["Tomu dopisu vůbec nerozumím.", "To říká, jak ti je. O přečtení to ale neprosí."],
    ],
    emoji: "✉️",
  },
];

// (c) OMLUVA — nová dovednost: poznat, že omluva přijímá vinu. Distraktory
//     jsou tři způsoby, jak se omluvě vyhnout: svést to na druhého, na smůlu,
//     a vymáhat odpuštění.

interface Omluva {
  kdy: string;
  klic: string;
  chyby: [string, string][];
  emoji: string;
}

const OMLUVY: Omluva[] = [
  {
    kdy: "Rozbil jsi kamarádovi hrneček. Která věta je opravdová omluva?",
    klic: "Promiň, rozbil jsem ti ho. Koupím ti nový.",
    chyby: [
      ["Promiň, ale tys do mě strčil. Za to nemůžu.", "Tahle věta vinu posílá zpátky kamarádovi. Omluva začíná tím, co jsi udělal ty."],
      ["Promiň, rozbilo se to samo. Nikdo za to nemůže.", "Hrneček se sám nerozbil. Omluva nic nesvádí na náhodu."],
      ["Promiň, tak už se nezlob. Je to za námi.", "Tahle věta po kamarádovi žádá, aby přestal. Omluva odpuštění nevymáhá."],
    ],
    emoji: "☕",
  },
  {
    kdy: "Zapomněl jsi vrátit spolužačce knihu. Která věta je opravdová omluva?",
    klic: "Omlouvám se, zapomněl jsem ji. Přinesu ji zítra.",
    chyby: [
      ["Omlouvám se, ale tys mi to nepřipomněla.", "Připomínat to není její práce. Omluva nehází vinu na druhého."],
      ["Omlouvám se, ta kniha se někam zatoulala.", "Kniha se nezatoulala sama. Omluva nic nesvádí na náhodu."],
      ["Omlouvám se, a teď už to prosím neřeš.", "Tahle věta spolužačce zakazuje mluvit. Omluva nic nezakazuje."],
    ],
    emoji: "📕",
  },
  {
    kdy: "Přišel jsi pozdě na schůzku s kamarádkou. Která věta je opravdová omluva?",
    klic: "Promiň, že jdu pozdě. Vyšel jsem moc pozdě.",
    chyby: [
      ["Promiň, ale tys mi napsala špatný čas.", "Tím vinu posíláš kamarádce. Omluva začíná u tebe."],
      ["Promiň, autobus mi prostě ujel před nosem.", "Autobus ujel, protože jsi vyšel pozdě. Omluva nesvádí na náhodu."],
      ["Promiň, vždyť to bylo jen pár minut.", "Tahle věta zdržení zmenšuje. Omluva ho nezlehčuje."],
    ],
    emoji: "⏰",
  },
  {
    kdy: "Ve hře jsi se na kamaráda zlobil a křičel na něj. Která věta je opravdová omluva?",
    klic: "Promiň, že jsem na tebe křičel. Nebylo to fér.",
    chyby: [
      ["Promiň, ale ty jsi hrál úplně špatně.", "Tím vinu posíláš kamarádovi. Omluva začíná u toho, co jsi udělal ty."],
      ["Promiň, jenom mě to prostě moc vzalo.", "Vztek je vysvětlení, ne omluva. Křičel jsi ty."],
      ["Promiň, a teď mi na to podej ruku.", "Tahle věta po kamarádovi něco žádá. Omluva smíření nevymáhá."],
    ],
    emoji: "🎲",
  },
  {
    kdy: "Pošlapal jsi sousedce záhonek s květinami. Která věta je opravdová omluva?",
    klic: "Omlouvám se, pošlapal jsem vám ho. Pomůžu to spravit.",
    chyby: [
      ["Omlouvám se, ale nebyl tam vůbec žádný plot.", "Plot tam být nemusí. Omluva nehází vinu na sousedku."],
      ["Omlouvám se, ty květiny tam samy vlezly do cesty.", "Květiny stály na záhonku. Omluva nesvádí nic na ně."],
      ["Omlouvám se, snad to nebyla zas taková škoda.", "Tahle věta škodu zmenšuje. Omluva ji nezlehčuje."],
    ],
    emoji: "🌷",
  },
];

function prosbaTask(p: Prosba): PracticeTask {
  return uloha(
    p.kdy,
    p.klic,
    p.chyby,
    [
      `Prosba nechává druhému volbu — může říct i ne. Zkus u každé možnosti, jestli se dá odpovědět „bohužel nemůžu“.`,
      `Pozor na past: když se k rozkazu přilepí „prosím“, rozkaz z toho prosba nebude. Hledej větu, která se opravdu ptá, ne která přikazuje nebo jen říká, co chceš ty.`,
    ],
    `Prosba se ptá a nechává druhému volbu. Rozkaz přikazuje, i když k němu přidáš „prosím“ — a oznámení o tom, co chceš ty, se druhého vůbec neptá.`,
    p.emoji,
  );
}

function omluvaTask(o: Omluva): PracticeTask {
  return uloha(
    o.kdy,
    o.klic,
    o.chyby,
    [
      `Všechny čtyři možnosti začínají omluvným slovem. Rozhoduje tedy to, co stojí za ním.`,
      `Opravdová omluva přijme, co jsi udělal ty, a nabídne, jak to spravit. Vyřaď věty, které vinu posílají druhému, svádějí ji na náhodu, nebo po druhém něco žádají.`,
    ],
    `Omluva přijímá vinu za to, co jsi udělal ty, a nabízí nápravu. Jakmile začne obviňovat druhého, svádět to na náhodu nebo škodu zlehčovat, přestává to být omluva.`,
    o.emoji,
  );
}

function genL3(): PracticeTask[] {
  return [
    ...VZKAZY.map(vzkazTask),
    ...PROSBY.map(prosbaTask),
    ...OMLUVY.map(omluvaTask),
  ];
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(genL1());
  if (level === 2) return shuffle(genL2());
  return shuffle(genL3());
}

export const POZDRAV_OSLOVENI_OMLUVA: TopicMetadata[] = [
  {
    id: "g2-cjl-komunikacni-a-slohova-vychova-slohova-vychova-pozdrav-osloveni-omluva-prosba-vzkaz",
    rvpNodeId: "g2-cjl-komunikacni-a-slohova-vychova-slohova-vychova-pozdrav-osloveni-omluva-prosba-vzkaz",
    title: "Pozdrav, oslovení, omluva, prosba, vzkaz",
    studentTitle: "Jak to říct",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se, co kdy říct — pozdravit, poprosit, omluvit se a předat vzkaz.",
    keywords: ["pozdrav", "oslovení", "omluva", "prosba", "poděkování", "vzkaz", "vykání"],
    goals: [
      "Poznat, co věta dělá — zdraví, prosí, omlouvá se, nebo děkuje.",
      "Najít ve větě oslovení.",
      "Vybrat správný tvar podle situace a podle toho, komu mluvím.",
      "Posoudit, jestli vzkaz nese všechny potřebné údaje.",
    ],
    boundaries: [
      "Dítě vybírá z možností, nic nepíše — sloh jako volný text v aplikaci není.",
      "Vykání jen u dospělých, které dítě nezná blízko.",
      "Bez psaní dopisu a adresy — to je samostatné téma.",
    ],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Nejdřív zjisti, co situace žádá (pozdrav, prosba, omluva, díky). Pak komu mluvíš — dospělému vykáme, kamarádovi tykáme.",
      steps: [
        "Přečti si, co se v situaci děje.",
        "Rozhodni, co se v takové chvíli říká.",
        "Podívej se, komu mluvíš — tykání, nebo vykání.",
        "U vzkazu si odškrtni tři údaje, které ten druhý potřebuje — vždycky kdo volal, a pak co a kdy, u schůzky i kde.",
      ],
      commonMistake: "Přilepit „prosím“ k rozkazu a myslet si, že je to prosba.",
      example: "„Půjčil bys mi pastelku?“ je prosba — kamarád může říct i ne. „Dej mi ji, prosím.“ je rozkaz.",
    },
  },
];
