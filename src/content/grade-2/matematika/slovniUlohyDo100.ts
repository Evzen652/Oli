import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { plural, pad, isAre } from "@/lib/czechGrammar";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

/**
 * Přepsáno 2026-09-11 (inventura obsahu): původní banky měly jednu nápovědu
 * ve tvaru „35 − 12 = ?“, žádnou zpětnou vazbu a distraktory jen ±1 a +10.
 *
 * Teď parametrické šablony nad pevnými sadami čísel (celý obsah je konečný
 * a dá se vypsat a ověřit). Úrovně jsou disjunktní:
 *   L1 — jeden krok, obor do 30, jasné slovo „odletí / přiletí / dostane“.
 *   L2 — jeden krok, obor do 100 (přechody přes desítku), vztahy „o N víc /
 *        o N méně“ a „o kolik víc“ (svádí ke sčítání, ale je to rozdíl).
 *   L3 — dva kroky nebo nepřímo formulovaná úloha (inverze: „to je o 5 víc,
 *        než má Eva“, neznámý začátek).
 * Chybové možnosti = opačná operace, mezivýsledek, rozdíl místo počtu,
 * chyba o jednotku (přechod přes desítku) a o desítku.
 */

type Tvary = [string, string, string];
const PTAK: Tvary = ["pták", "ptáci", "ptáků"];
const CLOVEK: Tvary = ["člověk", "lidé", "lidí"];
const SAMOLEPKA: Tvary = ["samolepka", "samolepky", "samolepek"];
const kus = (n: number, t: Tvary) => `${n} ${plural(n, t[0], t[1], t[2])}`;
const dalsi = (n: number) => plural(n, "další", "další", "dalších");

interface Cand {
  v: number;
  why: string;
}

function uloha(
  question: string,
  key: number,
  cands: Cand[],
  hints: [string, string],
  explanation: string,
): PracticeTask {
  const seen = new Set<number>([key]);
  const d: Distractor[] = [];
  for (const c of cands) {
    if (c.v < 0 || seen.has(c.v)) continue;
    seen.add(c.v);
    d.push({ value: String(c.v), why: c.why });
    if (d.length === 3) break;
  }
  if (d.length < 3) throw new Error(`Málo distraktorů: ${question}`);
  return choice(question, String(key), d as [Distractor, Distractor, Distractor], { hints, explanation });
}

type Op = "+" | "−";

function presDesitku(a: number, op: Op, b: number): boolean {
  return op === "+" ? (a % 10) + (b % 10) >= 10 : a % 10 < b % 10;
}

/** Strategie výpočtu pro konkrétní příklad — neříká výsledek. */
function postup(a: number, op: Op, b: number): string {
  const au = a % 10;
  const bu = b % 10;
  const bt = b - bu;
  if (op === "+") {
    if (b < 10) {
      if (au + b > 10) return `Doplň ${a} nejdřív do nejbližší celé desítky a pak přidej, co ti z ${b} zbylo.`;
      if (au + b === 10) return `Všimni si, že ${au} a ${b} dají dohromady celou desítku.`;
      return `Stačí sečíst jednotky ${au} + ${b}, desítky zůstanou stejné.`;
    }
    if (bu === 0) return `Přičítáš celé desítky, jednotky čísla ${a} se nezmění.`;
    return `Přičti nejdřív desítky (${bt}), potom jednotky (${bu}).`;
  }
  if (b < 10) {
    if (au === 0) return `Uber ${b} z poslední desítky čísla ${a}. Co z té desítky zbude, přidej ke zbylým desítkám.`;
    if (au < b) return `Jdi přes desítku: nejdřív uber tolik, abys byl přesně na ${a - au}, pak uber zbytek.`;
    return `Stačí odečíst jednotky ${au} − ${b}, desítky zůstanou stejné.`;
  }
  if (bu === 0) return `Odečítáš celé desítky, jednotky čísla ${a} se nezmění.`;
  return `Odečti nejdřív desítky (${bt}), potom jednotky (${bu}) — přes desítku klidně po částech.`;
}

/** Chyby o jednotku a o desítku; zpětná vazba míří na konkrétní příklad. */
function blizke(key: number, a: number, op: Op, b: number): Cand[] {
  const expr = `${a} ${op} ${b}`;
  const pres = presDesitku(a, op, b);
  const jedn = pres
    ? `V příkladu ${expr} se přechází přes desítku a tam se snadno ujede o jedničku — počítej po částech.`
    : `Zkontroluj jednotky v příkladu ${expr}: ${a % 10} ${op} ${b % 10}.`;
  const des = pres
    ? `Při přechodu přes desítku ${op === "+" ? "jedna desítka přibude navíc" : "si jednu desítku musíš rozměnit"} — na to se snadno zapomene.`
    : b < 10
      ? `Počítáš jen s jednotkami, desítky čísla ${a} se měnit nemají.`
      : `Spočítej zvlášť desítky: ${Math.floor(a / 10)} ${op} ${Math.floor(b / 10)}.`;
  return [
    { v: key - 1, why: `Vyšlo ti o jedničku méně. ${jedn}` },
    { v: key + 10, why: `Vyšlo ti o desítku víc. ${des}` },
    { v: key + 1, why: `Vyšlo ti o jedničku víc. ${jedn}` },
    { v: key - 10, why: `Vyšlo ti o desítku méně. ${des}` },
  ];
}

// ── L1: jeden krok, obor do 30 ──────────────────────────────────────────────

function odleti(a: number, b: number): PracticeTask {
  const key = a - b;
  return uloha(
    `Na stromě sedí ${kus(a, PTAK)}. ${b} jich odletí. Kolik ptáků zbyde?`,
    key,
    [{ v: a + b, why: `${a} + ${b} by platilo, kdyby ptáci přilétali. Oni ale odletí, ubude jich — musíš odčítat.` }, ...blizke(key, a, "−", b)],
    [
      `Když ${kus(b, PTAK)} odletí, bude jich na stromě víc, nebo méně než ${a}?`,
      `Ptáků ubude, takže od ${a} odečítáš ${b}. ${postup(a, "−", b)}`,
    ],
    `Ptáci odletí, a proto jich na stromě ubude: ${a} − ${b} = ${key}. Zbyde jich ${key}.`,
  );
}

function prileti(a: number, b: number): PracticeTask {
  const key = a + b;
  return uloha(
    `Na stromě sedí ${kus(a, PTAK)}. Přiletí ${b} ${dalsi(b)}. Kolik ptáků tam je?`,
    key,
    [{ v: a - b, why: `${a} − ${b} by platilo, kdyby ptáci odlétali. Další ale přiletí, přibude jich — sčítej.` }, ...blizke(key, a, "+", b)],
    [
      `Přiletí ještě ${kus(b, PTAK)} — bude jich teď víc, nebo méně než ${a}?`,
      `Ptáků přibude, takže k ${a} přičítáš ${b}. ${postup(a, "+", b)}`,
    ],
    `Ptáci přiletěli, a proto jich přibylo: ${a} + ${b} = ${key}. Na stromě jich teď sedí ${key}.`,
  );
}

function lizatko(a: number, b: number): PracticeTask {
  const key = a - b;
  return uloha(
    `Máš ${a} Kč. Koupíš lízátko za ${b} Kč. Kolik Kč ti zbyde?`,
    key,
    [{ v: a + b, why: `${a} + ${b} Kč bys měl, kdybys peníze dostal. Za lízátko ale platíš, peníze ubývají.` }, ...blizke(key, a, "−", b)],
    [
      `Za lízátko zaplatíš ${b} Kč. Budeš mít potom víc, nebo méně než ${a} Kč?`,
      `Placením peníze ubývají, takže počítáš ${a} − ${b}. ${postup(a, "−", b)}`,
    ],
    `Za lízátko zaplatíš, peníze ubydou: ${a} − ${b} = ${key}. Zbyde ti ${key} Kč.`,
  );
}

function kulicky(a: number, b: number): PracticeTask {
  const key = a + b;
  return uloha(
    `Ema má ${pad(a, "KULIČKA")}. Dostane ještě ${pad(b, "KULIČKA")}. Kolik kuliček má teď?`,
    key,
    [{ v: a - b, why: `${a} − ${b} by platilo, kdyby Ema kuličky rozdávala. Ona je ale dostane, přibudou jí.` }, ...blizke(key, a, "+", b)],
    [
      `Ema dostane ještě ${pad(b, "KULIČKA")}. Bude jich mít víc, nebo méně než ${a}?`,
      `Když něco dostaneš, přibude ti to — k ${a} přičítáš ${b}. ${postup(a, "+", b)}`,
    ],
    `Kuličky Emě přibudou: ${a} + ${b} = ${key}. Teď jich má ${key}.`,
  );
}

function jablka(a: number, b: number): PracticeTask {
  const key = a - b;
  return uloha(
    `V míse ${isAre(a)} ${pad(a, "JABLKO")}. Děti jich snědí ${b}. Kolik jablek zbyde?`,
    key,
    [{ v: a + b, why: `${a} + ${b} by vyšlo, kdyby jablka přibyla. Snědená jablka ale z mísy zmizí.` }, ...blizke(key, a, "−", b)],
    [
      `Děti snědí ${pad(b, "JABLKO")}. Bude jich v míse víc, nebo méně než ${a}?`,
      `Snědená jablka ubudou, takže od ${a} odečítáš ${b}. ${postup(a, "−", b)}`,
    ],
    `Snědená jablka z mísy ubudou: ${a} − ${b} = ${key}. V míse jich zbyde ${key}.`,
  );
}

function pristoupi(a: number, b: number): PracticeTask {
  const key = a + b;
  return uloha(
    `V autobusu sedí ${kus(a, CLOVEK)}. Přistoupí ${b} ${dalsi(b)}. Kolik lidí jede teď?`,
    key,
    [{ v: a - b, why: `${a} − ${b} by platilo, kdyby lidé vystupovali. Kdo přistoupí, ten do autobusu přibude.` }, ...blizke(key, a, "+", b)],
    [
      `Na zastávce přistoupí ${kus(b, CLOVEK)}. Pojede jich víc, nebo méně než ${a}?`,
      `Přistoupit znamená přibýt, takže k ${a} přičítáš ${b}. ${postup(a, "+", b)}`,
    ],
    `Lidé přistoupili, cestujících přibylo: ${a} + ${b} = ${key}. Teď jich jede ${key}.`,
  );
}

// ── L2: jeden krok, obor do 100, vztahy „o N víc / méně“ ────────────────────

function knizka(a: number, b: number): PracticeTask {
  const key = a - b;
  return uloha(
    `Máš ${a} Kč. Koupíš knížku za ${b} Kč. Kolik Kč ti zbyde?`,
    key,
    [{ v: a + b, why: `Sečetl jsi ${a} + ${b}. Za knížku ale platíš, peníze ti ubydou — odčítej.` }, ...blizke(key, a, "−", b)],
    [
      `Knížka stojí ${b} Kč a ty máš ${a} Kč. Peníze ti přibudou, nebo ubudou?`,
      `Placením peníze ubývají: počítáš ${a} − ${b}. ${postup(a, "−", b)}`,
    ],
    `Za knížku zaplatíš ${b} Kč, peníze ubydou: ${a} − ${b} = ${key}. Zbyde ti ${key} Kč.`,
  );
}

function knihovna(a: number, b: number): PracticeTask {
  const key = a + b;
  const knih = (n: number) => plural(n, "kniha", "knihy", "knih");
  return uloha(
    `V knihovně ${isAre(a)} ${a} ${knih(a)}. Přibude ${b} nových. Kolik knih tam bude?`,
    key,
    [{ v: a - b, why: `Odečetl jsi ${a} − ${b}. Nové knihy ale do knihovny přibudou — sčítej.` }, ...blizke(key, a, "+", b)],
    [
      `Do knihovny přibude ${b} nových knih. Bude jich víc, nebo méně než ${a}?`,
      `Knihy přibývají, takže k ${a} přičítáš ${b}. ${postup(a, "+", b)}`,
    ],
    `Nové knihy k těm starým přibudou: ${a} + ${b} = ${key}. V knihovně jich bude ${key}.`,
  );
}

function oViceSamolepek(a: number, b: number): PracticeTask {
  const key = a + b;
  return uloha(
    `Anna má ${kus(a, SAMOLEPKA)}. Petr má o ${b} víc. Kolik samolepek má Petr?`,
    key,
    [
      { v: a - b, why: `${a} − ${b} by měl Petr, kdyby měl o ${b} méně. „O ${b} víc“ znamená přičíst.` },
      { v: b, why: `${b} je jen rozdíl mezi Petrem a Annou, ne počet Petrových samolepek.` },
      ...blizke(key, a, "+", b),
    ],
    [
      `Má Petr víc samolepek než Anna, nebo méně? Anna jich má ${a}.`,
      `„O ${b} víc“ znamená: vezmi Annin počet ${a} a přidej ${b}. ${postup(a, "+", b)}`,
    ],
    `Petr má o ${b} víc než Anna, a proto k jejímu počtu přičteme: ${a} + ${b} = ${key}. Petr má ${kus(key, SAMOLEPKA)}.`,
  );
}

function oMeneKulicek(a: number, b: number): PracticeTask {
  const key = a - b;
  return uloha(
    `Kryštof má ${pad(a, "KULIČKA")}. Eva má o ${b} méně. Kolik kuliček má Eva?`,
    key,
    [
      { v: a + b, why: `${a} + ${b} by měla Eva, kdyby měla o ${b} víc. „O ${b} méně“ znamená odečíst.` },
      { v: b, why: `${b} je jen rozdíl mezi Kryštofem a Evou, ne počet Eviných kuliček.` },
      ...blizke(key, a, "−", b),
    ],
    [
      `Má Eva víc kuliček než Kryštof, nebo méně? Kryštof jich má ${a}.`,
      `„O ${b} méně“ znamená: vezmi Kryštofův počet ${a} a uber ${b}. ${postup(a, "−", b)}`,
    ],
    `Eva má o ${b} méně než Kryštof, a proto od jeho počtu odečteme: ${a} − ${b} = ${key}. Eva má ${pad(key, "KULIČKA")}.`,
  );
}

function volnaMista(a: number, b: number): PracticeTask {
  const key = a - b;
  return uloha(
    `Autobus má ${a} ${plural(a, "místo", "místa", "míst")}. Sedí v něm ${kus(b, CLOVEK)}. Kolik míst je volných?`,
    key,
    [
      { v: a + b, why: `Sečetl jsi místa a lidi, to nedává smysl. Obsazená místa od všech míst odečti.` },
      { v: b, why: `Obsazených míst je ${b} — lidé na nich sedí. Otázka se ptá na volná místa.` },
      ...blizke(key, a, "−", b),
    ],
    [
      `Lidí je ${b} a každý sedí na jednom místě. Kolik míst ze všech ${a} zbývá?`,
      `Volná místa = všechna místa bez obsazených, tedy ${a} − ${b}. ${postup(a, "−", b)}`,
    ],
    `Každý z cestujících zabírá jedno místo, obsazených je ${b}. Volných je ${a} − ${b} = ${key}.`,
  );
}

function oKolikVic(a: number, b: number): PracticeTask {
  const key = a - b;
  return uloha(
    `Pavel má ${a} Kč, Jana má ${b} Kč. O kolik korun má Pavel víc?`,
    key,
    [{ v: a + b, why: `Sečetl jsi, kolik mají dohromady. „O kolik víc“ se ptá na rozdíl — odčítej.` }, ...blizke(key, a, "−", b)],
    [
      `Porovnej ${a} Kč a ${b} Kč. Kolik korun by musela Jana dostat, aby měla stejně?`,
      `Rozdíl zjistíš odčítáním: ${a} − ${b}. ${postup(a, "−", b)}`,
    ],
    `„O kolik víc“ = rozdíl, proto odčítáme: ${a} − ${b} = ${key}. Zkouška: ${b} + ${key} = ${a}.`,
  );
}

// ── L3: dva kroky nebo nepřímo formulovaná úloha ────────────────────────────

function dvaNakupy(a: number, b: number, c: number): PracticeTask {
  const key = a - b - c;
  return uloha(
    `Máš ${a} Kč. Koupíš sešit za ${b} Kč a pero za ${c} Kč. Kolik Kč ti zbyde?`,
    key,
    [
      { v: a - b, why: `Odečetl jsi jen sešit. Zaplatit musíš i pero za ${c} Kč.` },
      { v: b + c, why: `Tolik utratíš. Otázka se ale ptá, kolik ti zbyde z ${a} Kč.` },
      { v: a - b + c, why: `Cenu pera jsi přičetl. I za pero ale platíš, peníze ubývají.` },
      ...blizke(key, a - b, "−", c),
    ],
    [
      `Sešit stojí ${b} Kč a pero ${c} Kč. Kolik utratíš celkem?`,
      `Nejdřív sečti ${b} + ${c}, to je celá útrata. Tu pak odečti od ${a} Kč, které máš.`,
    ],
    `Za sešit a pero zaplatíš ${b} + ${c} = ${b + c} Kč. Zbyde ti ${a} − ${b + c} = ${key} Kč.`,
  );
}

function vystoupiNastoupi(a: number, b: number, c: number): PracticeTask {
  const key = a - b + c;
  return uloha(
    `V autobusu jede ${kus(a, CLOVEK)}. Na zastávce ${kus(b, CLOVEK)} vystoupí a ${kus(c, CLOVEK)} nastoupí. Kolik lidí jede dál?`,
    key,
    [
      { v: a - b - c, why: `Odečetl jsi i ty, kdo nastoupili. Nastupující do autobusu přibudou.` },
      { v: a - b, why: `Zapomněl jsi na nastupující (${c}). Ti do autobusu ještě přibudou.` },
      { v: a + b - c, why: `Prohodil jsi to: vystupující ubývají, nastupující přibývají.` },
      ...blizke(key, a - b, "+", c),
    ],
    [
      `Kdo vystoupí, ubude; kdo nastoupí, přibude. Začni od ${a}.`,
      `Nejdřív od ${a} odečti ${b} vystupujících, pak k výsledku přičti ${c} nastupujících.`,
    ],
    `Po vystoupení: ${a} − ${b} = ${a - b}. Po nastoupení: ${a - b} + ${c} = ${key}. Dál jich jede ${key}.`,
  );
}

function neprimaVic(a: number, b: number): PracticeTask {
  const key = a - b;
  return uloha(
    `Petr má ${pad(a, "KULIČKA")}. To je o ${b} víc, než má Eva. Kolik kuliček má Eva?`,
    key,
    [
      { v: a + b, why: `Slovo „víc“ tě svedlo ke sčítání. Víc má Petr — Eva má tedy méně než ${a}.` },
      { v: b, why: `${b} je jen rozdíl mezi Petrem a Evou, ne počet Eviných kuliček.` },
      ...blizke(key, a, "−", b),
    ],
    [
      `Kdo má víc kuliček — Petr se svými ${a}, nebo Eva?`,
      `Petr má o ${b} víc, takže Eva má o ${b} méně než Petr. Od ${a} tedy odečti ${b}. ${postup(a, "−", b)}`,
    ],
    `Když má Petr o ${b} víc než Eva, má Eva o ${b} méně: ${a} − ${b} = ${key}. Zkouška: ${key} + ${b} = ${a}.`,
  );
}

function neprimaMene(a: number, b: number): PracticeTask {
  const key = a + b;
  return uloha(
    `Eva má ${a} Kč. To je o ${b} Kč méně, než má Tom. Kolik Kč má Tom?`,
    key,
    [
      { v: a - b, why: `Slovo „méně“ tě svedlo k odčítání. Méně má Eva, Tom má víc než ${a} Kč.` },
      { v: b, why: `${b} Kč je jen rozdíl mezi Evou a Tomem, ne Tomovy peníze.` },
      ...blizke(key, a, "+", b),
    ],
    [
      `Kdo má víc peněz — Eva se svými ${a} Kč, nebo Tom?`,
      `Eva má o ${b} Kč méně než Tom, takže Tom má o ${b} Kč víc než Eva. K ${a} přičti ${b}. ${postup(a, "+", b)}`,
    ],
    `Když má Eva o ${b} Kč méně než Tom, má Tom o ${b} Kč víc: ${a} + ${b} = ${key}. Zkouška: ${key} − ${b} = ${a}.`,
  );
}

function dohromady(a: number, b: number): PracticeTask {
  const petr = a + b;
  const key = a + petr;
  return uloha(
    `Anna má ${kus(a, SAMOLEPKA)}. Petr má o ${b} víc. Kolik samolepek mají dohromady?`,
    key,
    [
      { v: petr, why: `Tolik samolepek má jen Petr. Otázka se ptá, kolik mají oba dohromady.` },
      { v: a + (a - b), why: `Petr má o ${b} víc než Anna, ne méně. Jeho počet je větší než ${a}.` },
      { v: a + b + b, why: `Přičetl jsi rozdíl ${b} dvakrát. Annin počet ${a} je potřeba sečíst s Petrovým.` },
      ...blizke(key, a, "+", petr),
    ],
    [
      `Nejdřív zjisti, kolik samolepek má Petr. Anna jich má ${a}.`,
      `Petr má ${a} + ${b}, to je první krok. Ve druhém kroku sečti Petrův počet s Anniným počtem ${a} — ptáme se na oba dohromady.`,
    ],
    `Petr má ${a} + ${b} = ${kus(petr, SAMOLEPKA)}. Dohromady: ${a} + ${petr} = ${key}.`,
  );
}

function neznamyZacatek(b: number, c: number): PracticeTask {
  const key = c - b;
  return uloha(
    `Tom dostal od babičky ${b} Kč. Teď má ${c} Kč. Kolik Kč měl předtím?`,
    key,
    [
      { v: c + b, why: `Sečetl jsi. Tom ale peníze dostal — předtím jich měl méně než teď.` },
      { v: b, why: `${b} Kč dostal od babičky. Otázka se ptá, kolik měl, než je dostal.` },
      ...blizke(key, c, "−", b),
    ],
    [
      `Měl Tom předtím víc, nebo méně než ${c} Kč?`,
      `Babička mu ${b} Kč přidala. Abys zjistil, kolik měl dřív, těch ${b} Kč od ${c} zase odeber. ${postup(c, "−", b)}`,
    ],
    `Teď má ${c} Kč a z toho ${b} Kč je od babičky: ${c} − ${b} = ${key}. Zkouška: ${key} + ${b} = ${c}.`,
  );
}

type Dvojice = [number, number];
type Trojice = [number, number, number];

function level1(): PracticeTask[] {
  const t: PracticeTask[] = [];
  ([[12, 5], [15, 7], [14, 6]] as Dvojice[]).forEach(([a, b]) => t.push(odleti(a, b)));
  ([[8, 5], [9, 4], [7, 6]] as Dvojice[]).forEach(([a, b]) => t.push(prileti(a, b)));
  ([[20, 8], [16, 9], [18, 5]] as Dvojice[]).forEach(([a, b]) => t.push(lizatko(a, b)));
  ([[9, 6], [14, 5], [8, 7]] as Dvojice[]).forEach(([a, b]) => t.push(kulicky(a, b)));
  ([[11, 3], [17, 8], [13, 6]] as Dvojice[]).forEach(([a, b]) => t.push(jablka(a, b)));
  ([[9, 8], [12, 6]] as Dvojice[]).forEach(([a, b]) => t.push(pristoupi(a, b)));
  return t;
}

function level2(): PracticeTask[] {
  const t: PracticeTask[] = [];
  ([[50, 27], [64, 38], [90, 46], [73, 26]] as Dvojice[]).forEach(([a, b]) => t.push(knizka(a, b)));
  ([[46, 27], [38, 45], [57, 36]] as Dvojice[]).forEach(([a, b]) => t.push(knihovna(a, b)));
  ([[34, 18], [27, 15], [45, 28]] as Dvojice[]).forEach(([a, b]) => t.push(oViceSamolepek(a, b)));
  ([[52, 17], [61, 24], [40, 13]] as Dvojice[]).forEach(([a, b]) => t.push(oMeneKulicek(a, b)));
  ([[48, 29], [56, 37], [60, 22]] as Dvojice[]).forEach(([a, b]) => t.push(volnaMista(a, b)));
  ([[85, 47], [72, 39], [63, 28]] as Dvojice[]).forEach(([a, b]) => t.push(oKolikVic(a, b)));
  return t;
}

function level3(): PracticeTask[] {
  const t: PracticeTask[] = [];
  ([[80, 25, 18], [60, 19, 24], [95, 38, 27], [70, 26, 15]] as Trojice[]).forEach(([a, b, c]) => t.push(dvaNakupy(a, b, c)));
  ([[34, 12, 9], [45, 18, 26], [52, 27, 15], [28, 9, 17]] as Trojice[]).forEach(([a, b, c]) => t.push(vystoupiNastoupi(a, b, c)));
  ([[43, 16], [60, 24], [35, 18]] as Dvojice[]).forEach(([a, b]) => t.push(neprimaVic(a, b)));
  ([[38, 17], [46, 25], [29, 34]] as Dvojice[]).forEach(([a, b]) => t.push(neprimaMene(a, b)));
  ([[23, 6], [31, 8], [18, 9], [26, 12]] as Dvojice[]).forEach(([a, b]) => t.push(dohromady(a, b)));
  ([[25, 61], [18, 50], [37, 82]] as Dvojice[]).forEach(([b, c]) => t.push(neznamyZacatek(b, c)));
  return t;
}

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? level1() : level === 2 ? level2() : level3());
}

export const SLOVNIULOHYDO100: TopicMetadata[] = [
  {
    id: "g2-mat-slovni-ulohy-100",
    rvpNodeId:
      "g2-matematika-nestandardni-aplikacni-ulohy-a-problemy-slovni-ulohy-slovni-ulohy-se-vsemi-typy-operaci-do-100",
    title: "Slovní úlohy se všemi typy operací do 100",
    studentTitle: "Příběhy s čísly",
    subject: "matematika",
    category: "Nestandardní aplikační úlohy a problémy",
    topic: "Slovní úlohy",
    briefDescription: "Řešíš krátké příklady ze života do 100.",
    keywords: ["slovní úloha", "příklad", "počítání", "sčítání", "odčítání", "Kč"],
    goals: [
      "Pochopit zadání krátké slovní úlohy.",
      "Vybrat správnou operaci (sčítání nebo odčítání).",
      "Spočítat výsledek v oboru do 100.",
    ],
    boundaries: ["Pouze sčítání a odčítání.", "Čísla do 100."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Přečti, co přibývá nebo ubývá — to ti řekne, zda sčítat nebo odčítat.",
      steps: [
        "Přečti otázku.",
        "Přibývá? → Sčítej. Ubývá? → Odčítej.",
        "Spočítej a zkontroluj.",
      ],
      commonMistake: "Záměna sčítání a odčítání — slova 'zbyde', 'odletí', 'prohraješ' = odčítání.",
      example: "Máš 35 Kč, koupíš bonbóny za 12 Kč. Zbyde: 35 − 12 = 23 Kč.",
    },
  },
];
