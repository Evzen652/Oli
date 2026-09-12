/**
 * Lint shody přísudku a číslovky v česky psaném obsahu úloh.
 *
 * Proč vznikl (2026-09-12): ruční kontrola dvou dávek oprav obsahu našla pět
 * chyb a tři z nich byly tahle jediná třída — číslo se dosadí proměnnou, ale
 * sloveso zůstane napevno:
 *
 *   „od 0 do 4 **je** 4 centimetry"         → jsou 4 centimetry
 *   „3 cm **má** 3krát víc milimetrů"       → přeformulovat, shoda nevyjde
 *   „Kolik decilitrů **mají** dva a půl l"  → má dva a půl litru
 *
 * Offline audit takovou vadu dosud hledal jen v `question`, a jen jako
 * „2–4 + genitiv plurálu". Obě moje chyby byly ve `explanation`, takže jím
 * prošly. Čtení očima tuhle třídu chyb najde, ale je to nejdražší možný
 * způsob — jeden lint ji najde ve všech tématech zdarma a hlídá i to,
 * co se dopíše potom.
 *
 * ── Návrhový kompromis ────────────────────────────────────────────────────
 * Lint je schválně **přesný na úkor úplnosti**. Pravidlo shody se spouští jen
 * nad podstatnými jmény z rejstříku `NOUNS`, protože jen u nich známe rod,
 * a tedy i správný tvar přísudku. Slovo mimo rejstřík projde bez povšimnutí.
 * Důvod je historický: dřívější verze gramatické kontroly vyrobila 22
 * falešných nálezů na správných tvarech („4 balení"), a falešný nález je
 * tady dražší než propuštěná chyba — obsah je zmrazený a „opravou"
 * správného tvaru se udělá škoda.
 */

import { NOUNS, genderOf, agree } from "./czechGrammar";

export type AgreementRule =
  /** 2–4 + genitiv plurálu: „3 dílů" místo „3 díly" */
  | "genitiv_po_2_4"
  /** přísudek nesouhlasí s počtem 2–4: „bylo 3 žáci", „je 4 centimetry" */
  | "shoda_prisudku"
  /** množný přísudek u „dva a půl": „mají dva a půl litru" */
  | "pul_s_mnoznym_cislem";

export interface AgreementFinding {
  rule: AgreementRule;
  /** Přesný nalezený úsek textu. */
  match: string;
  /** Co s tím — včetně správného tvaru, pokud ho umíme dopočítat. */
  detail: string;
}

// ── Pravidlo 1: 2–4 + genitiv plurálu ───────────────────────────────────────
// Převzato z původní kontroly v contentAudit.ts včetně jejích záplat:
// `\p{L}` s příznakem `u`, protože `\w` je v JS jen ASCII a na slově
// „balení" se zastavilo o „í"; a výjimka pro předložky, po nichž je
// genitiv správně („ze 3 bodů", „do 4 hodin").
const GENITIV_PO_2_4 = /(?<![\p{L}\p{N}])[234]\s+\p{L}+(?:ů|ek|en)(?![\p{L}])/gu;
const PREDLOZKA_PRED =
  /(?:^|[^\p{L}])(?:ze|z|do|od|u|bez|kolem|podle|vedle|okolo|během|kromě|místo)\s+$/iu;

/**
 * Koncovka -ek/-en sama o sobě genitiv plurálu neznamená: „kostek" ano,
 * ale „zbytek", „zlomek" a „řádek" jsou nominativy singuláru. Na tohle
 * pravidlo naletělo hned při prvním běhu nad vysvětleními — 27 nálezů na
 * správné větě „Výsledek: 3 zbytek 0" u dělení se zbytkem. Nominativy
 * bereme z rejstříku (tvar „one") a doplňujeme slova, která v rejstříku
 * nejsou.
 */
const NOMINATIV_SG = new Set<string>([
  ...Object.values(NOUNS).map((forms) => forms[0].toLowerCase()),
  "zbytek", "dílek", "kousek", "sloupek", "balíček", "domek", "kamen",
  "kámen", "týden", "přebytek", "začátek", "sešitek", "obrázek",
]);

/**
 * V zápisu výsledku („6 ÷ 2 = 3 zbytek 0", „= 4 díly") číslo neřídí slovo
 * za sebou — je to podíl, ne počet. Pravidlo se za rovnítkem nespouští.
 */
const ZA_ROVNITKEM = /[=:]\s*$/;

// ── Pravidlo 2: shoda přísudku s počtem 2–4 ─────────────────────────────────
/** Slovesa, u nichž shodu umíme spočítat: spona a „být" v minulém čase. */
const PRISUDKY = ["je", "jsou", "byl", "byla", "bylo", "byly", "byli"] as const;

/** Předložky — po nich následující slovo NENÍ podmět (pád je nepřímý). */
const PREDLOZKY = new Set([
  "v", "ve", "na", "do", "od", "u", "z", "ze", "k", "ke", "s", "se", "o",
  "po", "při", "pro", "za", "nad", "pod", "mezi", "před", "bez", "kolem",
  "podle", "vedle", "okolo", "během", "kromě", "místo",
]);

/**
 * Slova, která ve větě nemohou být podmětem — spojky, částice, příslovce.
 * Slouží jen k tomu, aby prefix „takže číslo na konci rovnou udává…"
 * nevypadal jako podmět a pravidlo se kvůli němu nevypnulo.
 */
const NEPODMET = new Set([
  "a", "i", "ale", "nebo", "takže", "proto", "tedy", "protože", "když",
  "aby", "že", "jen", "už", "ještě", "pak", "potom", "nejdřív", "teď",
  "dohromady", "celkem", "přesně", "klidně", "vlastně", "právě", "zbývá",
  "kolik", "tolik", "to", "toho", "tam", "sem", "však", "totiž", "asi",
  "opravdu", "taky", "také", "zase", "znovu", "navíc", "prostě",
]);

/** Obrácený index: nominativ plurálu („žáci", „centimetry") → klíče v NOUNS. */
const FEW_FORM_TO_KEYS: Map<string, string[]> = (() => {
  const map = new Map<string, string[]>();
  for (const [key, forms] of Object.entries(NOUNS)) {
    const few = forms[1].toLowerCase();
    map.set(few, [...(map.get(few) ?? []), key]);
  }
  return map;
})();

/** Správný tvar přísudku pro počet 2–4 a dané slovo; null = nevíme. */
function spravnyPrisudek(verb: string, keys: string[], n: number): string | null {
  const tvary = new Set<string | null>(
    keys.map((key) => {
      if (verb === "je" || verb === "jsou") return genderOf(key, n) ? "jsou" : null;
      return agree(n, key, "bylo");
    }),
  );
  if (tvary.size !== 1) return null; // rody se rozcházejí → radši mlč
  const [tvar] = [...tvary];
  return tvar;
}

/** Stojí v úseku textu před přísudkem něco, co může být podmět? */
function maJinyPodmet(prefix: string): boolean {
  const tokeny = prefix.split(/[^\p{L}]+/u).filter(Boolean);
  return tokeny.some((tok, i) => {
    const slovo = tok.toLowerCase();
    if (slovo.length < 3 || NEPODMET.has(slovo) || PREDLOZKY.has(slovo)) return false;
    const pred = tokeny[i - 1]?.toLowerCase();
    // „ve třídě bylo…" je příslovečné určení, ne podmět — pravidlo platí dál.
    return !(pred && PREDLOZKY.has(pred));
  });
}

// ── Pravidlo 3: „dva a půl" s množným přísudkem ─────────────────────────────
// Po číslovce s „půl" řídí spojení genitiv singuláru, přísudek zůstává
// v jednotném čísle: „dva a půl litru **má**", ne „mají".
const PUL_PRED = /(?:jsou|mají|byly|byli|byla)\s+(?:\d+|dva|dvě|tři|čtyři)\s+a\s+půl/giu;
const PUL_ZA = /(?:\d+|dva|dvě|tři|čtyři)\s+a\s+půl\s+\p{L}+\s+(?:jsou|mají)/giu;

/**
 * Projde jeden text a vrátí nálezy shody. Bez vedlejších efektů a bez sítě —
 * jde použít v auditu, v testu i ve skriptu nad celým obsahem.
 */
export function checkCzechAgreement(text: string): AgreementFinding[] {
  if (!text) return [];
  const findings: AgreementFinding[] = [];

  for (const m of text.match(GENITIV_PO_2_4) ?? []) {
    const at = text.indexOf(m);
    if (PREDLOZKA_PRED.test(text.slice(0, at))) continue;
    if (ZA_ROVNITKEM.test(text.slice(0, at))) continue;
    const slovo = m.replace(/^[234]\s+/, "").toLowerCase();
    if (NOMINATIV_SG.has(slovo)) continue;
    findings.push({
      rule: "genitiv_po_2_4",
      match: m,
      detail: `Po číslovce 2–4 patří nominativ plurálu, ne genitiv: "${m}" — použij plural() nebo pad() z czechGrammar.ts`,
    });
  }

  const prisudekRe = new RegExp(
    `(?<![\\p{L}])(${PRISUDKY.join("|")})\\s+([234])\\s+(\\p{L}{3,})`,
    "giu",
  );
  for (const m of text.matchAll(prisudekRe)) {
    const [cely, verbRaw, cisloRaw, slovoRaw] = m;
    const keys = FEW_FORM_TO_KEYS.get(slovoRaw.toLowerCase());
    if (!keys) continue; // slovo mimo rejstřík — rod neznáme, radši mlčíme
    const verb = verbRaw.toLowerCase();
    const n = Number(cisloRaw);
    const spravne = spravnyPrisudek(verb, keys, n);
    if (!spravne || spravne === verb) continue;
    const start = m.index ?? 0;
    const hranice = [".", "!", "?", ";", ":", ",", "—", "–", "(", ")"].map((sep) =>
      text.lastIndexOf(sep, start),
    );
    const prefix = text.slice(Math.max(...hranice) + 1, start);
    if (maJinyPodmet(prefix)) continue; // „Výsledek je 3 centimetry" — podmět je v j. č.
    findings.push({
      rule: "shoda_prisudku",
      match: cely,
      detail: `Přísudek nesouhlasí s počtem ${n}: "${cely}" → "${spravne} ${n} ${slovoRaw}" (agree() / isAre() z czechGrammar.ts)`,
    });
  }

  for (const re of [PUL_PRED, PUL_ZA]) {
    for (const m of text.matchAll(re)) {
      findings.push({
        rule: "pul_s_mnoznym_cislem",
        match: m[0],
        detail: `Po číslovce s „půl" zůstává přísudek v jednotném čísle: "${m[0]}" (má / je, ne mají / jsou)`,
      });
    }
  }

  return findings;
}

/** Textová pole jedné úlohy, která má smysl lintovat. */
export function agreementFields(task: {
  question?: string;
  explanation?: string;
  solutionSteps?: string[];
  hints?: string[];
  optionFeedback?: Record<string, string>;
}): { label: string; text: string }[] {
  const out: { label: string; text: string }[] = [];
  if (task.question) out.push({ label: "otázka", text: task.question });
  if (task.explanation) out.push({ label: "vysvětlení", text: task.explanation });
  task.solutionSteps?.forEach((s, i) => out.push({ label: `postup ${i + 1}`, text: s }));
  task.hints?.forEach((h, i) => out.push({ label: `nápověda ${i + 1}`, text: h }));
  for (const [opt, fb] of Object.entries(task.optionFeedback ?? {})) {
    if (fb) out.push({ label: `zpětná vazba (${opt})`, text: String(fb) });
  }
  return out;
}
