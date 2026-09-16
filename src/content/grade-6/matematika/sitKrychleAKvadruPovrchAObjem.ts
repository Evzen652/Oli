/**
 * Matematika 6. ročník — Krychle a kvádr: síť, povrch a objem.
 *
 * Stavba podle výpočetního vzoru `fyzika/mereniDelky.ts`, helpery výhradně
 * z `./_shared`. Žák jen VYBÍRÁ (select_one): výsledky bývají desetinná čísla
 * a číselné pole by zahodilo čárku. Všechny možnosti jedné úlohy mají stejnou
 * jednotku (cm², cm³, l, „krát“, počet stěn …).
 *
 *  • L1 — rozpoznání a přímý vzorec („Urči …“): počet stěn, hran a vrcholů
 *    kvádru, shodné stěny v síti, objem z celých hran, povrch krychle.
 *  • L2 — použití („Vypočítej …“, „Kolik …“): povrch kvádru s desetinnou
 *    hranou, objem s desetinnými hranami, převod cm³ → dm³ / l, síť popsaná
 *    slovy.
 *  • L3 — transfer a dva kroky (slovní úlohy): chybějící stěna, inverze
 *    (objem → výška, povrch krychle → hrana → objem), zvětšení hrany,
 *    slepené krychle, kostky v krabici a voda v akváriu.
 *
 * Každý distraktor je výsledek konkrétní chyby spočítaný z týchž čísel
 * (objem místo povrchu, každý pár stěn jen jednou, sečtené hrany,
 * 1 dm³ = 100 cm³, zvětšení objemu jako u obsahu …). Mocniny se nepíšou
 * (RVP je zavádí až v 8. ročníku): „2 · 2 · 2krát“.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { plural } from "@/lib/czechGrammar";
import { cis, rnd, pick, shuffle, buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

// ── Aritmetika a zápis ─────────────────────────────────────────────────────
/** Zaokrouhlí na 4 desetinná místa (odstraní šum plovoucí čárky). */
const r4 = (x: number): number => Math.round(x * 10000) / 10000;
/** Má číslo nejvýš dvě desetinná místa? */
const ciste = (x: number): boolean => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
/** Číselná hodnota možnosti („7 900 cm²“ → 7900, „2,5 l“ → 2.5). */
const hodnotaTextu = (s: string): number =>
  Number((s.match(/^\d{1,3}(?: \d{3})*(?:,\d+)?/)?.[0] ?? "NaN").replace(/ /g, "").replace(",", "."));
/** Počet desetinných míst v českém zápisu čísla. */
function mist(x: number): number {
  const t = cis(x);
  const i = t.indexOf(",");
  return i < 0 ? 0 : t.length - i - 1;
}
/** „2,5 · 1,2 = 3,00 = 3“: mezivýsledek s koncovými nulami ukáže i zkrácený tvar. */
function soucinText(x: number, y: number): string {
  const d = mist(x) + mist(y);
  const v = r4(x * y);
  if (d === 0 || mist(v) === d) return `${cis(x)} · ${cis(y)} = ${cis(v)}`;
  const n = Math.round(v * 10 ** d);
  const cela = Math.floor(n / 10 ** d);
  const des = String(n % 10 ** d).padStart(d, "0");
  return `${cis(x)} · ${cis(y)} = ${cis(cela)},${des} = ${cis(v)}`;
}

const objem = (a: number, b: number, c: number): number => r4(a * b * c);
const polovinaPovrchu = (a: number, b: number, c: number): number => r4(a * b + a * c + b * c);
const povrch = (a: number, b: number, c: number): number => r4(2 * (a * b + a * c + b * c));

const u = (x: number, jed: string): string => `${cis(x)} ${jed}`;
const krat = (x: number): string => `${cis(x)}krát`;
const steny = (n: number): string => `${n} ${plural(n, "stěna", "stěny", "stěn")}`;
const hrany = (n: number): string => `${n} ${plural(n, "hrana", "hrany", "hran")}`;
const vrcholy = (n: number): string => `${n} ${plural(n, "vrchol", "vrcholy", "vrcholů")}`;
const kostky = (n: number): string => `${cis(n)} ${plural(n, "kostka", "kostky", "kostek")}`;
const litry = (n: number): string => plural(n, "litr", "litry", "litrů");
const krychlicky = (n: number): string => `${cis(n)} ${plural(n, "krychlička", "krychličky", "krychliček")}`;

/** Tři různá celá čísla z intervalu, sestupně. */
function triRuzne(min: number, max: number): [number, number, number] {
  const v = new Set<number>();
  while (v.size < 3) v.add(rnd(min, max));
  const [a, b, c] = [...v].sort((p, q) => q - p);
  return [a, b, c];
}
/** Desetinné číslo s jedním desetinným místem (nenulovým) z intervalu ⟨min, max⟩. */
function des1(min: number, max: number): number {
  let n = rnd(min * 10, max * 10);
  while (n % 10 === 0) n = rnd(min * 10, max * 10);
  return n / 10;
}

const JMENA = ["Ema", "Tomáš", "Klára", "Petr", "Anna", "Jakub", "Lucie", "Marek", "Sofie", "Vojta"];

// ── Kontrola hotové úlohy ──────────────────────────────────────────────────
/** Obsahuje text klíč jako samostatné číslo (krátký klíč) nebo podřetězec (delší)? */
function obsahuje(text: string, klic: string): boolean {
  if (klic.length >= 3) return text.includes(klic);
  const esc = klic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![\\d,])${esc}(?![\\d]|,\\d)`).test(text);
}

// Číslo s jednotkou ze zadání. Oproti sdílenému `dveNapovedy` zná i holé „m“
// (bazén, pokoj, pískoviště): bez něj se vypisovalo „75 m³; 10; 5“. Zná i
// „48 litrů“ vypsané slovem.
const CISLO_SE_JEDNOTKOU = /(?<![\d,])\d{1,3}(?: \d{3})*(?:,\d+)?(?!\d|,\d)(?:\s?(?:cm²|dm²|m²|mm²|cm³|dm³|m³|mm³|mm|cm|dm|km|m|kg|g|litrů|litry|litr|l|ml|Kč|%)(?![\p{L}\d²³]))?/gu;
const STRATEGIE: { text: string; uzZaznelo: RegExp }[] = [
  { text: "Nakonec si výsledek ověř zkouškou.", uzZaznelo: /zkouš/i },
  { text: "Porovnej výsledek s odhadem: dává takové číslo smysl?", uzZaznelo: /odhad/i },
  { text: "Zkontroluj, na co přesně se otázka ptá, než vybereš odpověď.", uzZaznelo: /na co se (otázka )?ptá/i },
];

/**
 * Dvě nápovědy (malá = první krok + čísla ze zadání, velká = zbylé kroky).
 * Výčet čísel vynechá jen token, který se klíči rovná i s jednotkou: zásobník
 * 40 × 25 × 60 cm s klíčem 60 l tak vypíše všechny tři rozměry.
 * `pocitani` = úloha na počet stěn/hran/vrcholů: rozměry jsou jen kulisa,
 * výčet čísel ani obecná rada o zkoušce a odhadu tam nepatří.
 */
function napovedy(question: string, correct: string, hints: string[], pocitani: boolean): string[] {
  const [prvni, ...zbytek] = hints.map((h) => h.replace(/^Krok \d+:\s*/, ""));
  const cisla = pocitani
    ? []
    : [...new Set((question.match(CISLO_SE_JEDNOTKOU) ?? []).map((z) => z.trim()))].filter((z) => z !== correct);
  const h0 = cisla.length ? `${prvni} Čísla ze zadání: ${cisla.join("; ")}.` : prvni;
  let h1 = zbytek.join(" ") || prvni;
  if (!pocitani) {
    for (const s of STRATEGIE) {
      if (h1.length >= h0.length * 1.2) break;
      if (!s.uzZaznelo.test(h1)) h1 = `${h1} ${s.text}`;
    }
  }
  return [h0, h1];
}

/**
 * Úloha se čtyřmi možnostmi, nebo `null` (pak `losUlohy` táhne znovu), když
 * distraktory splynou, zadání nebo nápověda obsahují klíč, nebo jsou obě
 * nápovědy stejné. `pocitani` viz `napovedy()`.
 */
function uloha(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: string[]; solutionSteps: string[]; explanation: string },
  pocitani = false,
): PracticeTask | null {
  if (obsahuje(question, correct)) return null;
  const t = buildChoiceTask(question, correct, distractors, parts);
  if (!t) return null;
  t.hints = napovedy(question, correct, parts.hints, pocitani);
  const h = t.hints;
  if (h.length < 2 || h[0] === h[1] || h.some((x) => obsahuje(x, correct))) return null;
  return t;
}

// ── Generátor ──────────────────────────────────────────────────────────────
type Tvurce = () => PracticeTask | null;

/**
 * Opakuje jedno náhodné pořadí prvků dokola. Typy úloh se tak v krátké sérii
 * neopakují (dřív šly náhodně a L3 dala dvakrát po sobě krabici bez víka).
 */
function rotace<T>(items: T[]): () => T {
  const poradi = shuffle(items);
  let i = 0;
  return () => poradi[i++ % poradi.length];
}

/** Rotace šablon: každý tah zvolí šablonu jednou, opakované pokusy zůstanou u ní. */
function gen(level: number): PracticeTask[] {
  const dalsi = level === 1 ? rotaceL1() : level === 2 ? rotace<Tvurce>([l2Povrch, l2Objem, l2Prevod, l2Sit]) : rotaceL3();
  return ruzneUlohy(() => losUlohy(dalsi()));
}

// ── L1 — rozpoznání a přímý vzorec ─────────────────────────────────────────
type DruhPrvku = "stěny" | "hrany" | "vrcholy" | "shodné";

function rotaceL1(): () => Tvurce {
  const druh = rotace<DruhPrvku>(["stěny", "hrany", "vrcholy", "shodné"]);
  const objemTyp = rotace<Tvurce>([l1ObjemKvadru, l1ObjemKrychle]);
  const typ = rotace<() => Tvurce>([
    () => { const d = druh(); return () => l1Prvky(d); },
    () => objemTyp(),
    () => l1PovrchKrychle,
  ]);
  return () => typ()();
}

function l1Prvky(druh: DruhPrvku): PracticeTask | null {
  const [a, b, c] = triRuzne(2, 12);
  const rozmery = `${a} cm × ${b} cm × ${c} cm`;

  if (druh === "stěny") {
    return uloha(
      `Urči, kolik stěn má kvádr s rozměry ${rozmery}.`,
      steny(6),
      [
        { value: steny(4), why: "Spočítal jsi jen boční stěny. Kvádr má navíc dno a víko, v síti jsou to další dva obdélníky." },
        { value: steny(8), why: "Tolik má kvádr vrcholů (rohů). Stěna je rovná plocha, v síti je to každý obdélník zvlášť." },
        { value: steny(12), why: "Tolik má kvádr hran. Hrany jsou úsečky, ve kterých se stýkají dvě stěny, stěny jsou plochy mezi nimi." },
      ],
      {
        hints: [
          "Krok 1: Představ si krabici tvaru kvádru a její síť. Každý obdélník v síti je jedna stěna.",
          "Krok 2: Spočítej dno a víko a pak boční stěny: vpředu, vzadu, vlevo a vpravo. Ověř si to na krabičce: dotkni se postupně každé její plochy a počítej.",
        ],
        solutionSteps: [
          "Dno a víko: dvě stěny.",
          "Boční stěny (přední, zadní, levá, pravá): čtyři stěny.",
          "Dohromady 2 + 4 = 6 stěn, síť kvádru tvoří šest obdélníků.",
        ],
        explanation: "Stěny kvádru jsou obdélníky, které ho ze všech stran ohraničují: dno, víko a čtyři boční stěny. Rozměry kvádru na jejich počtu nic nemění, proto má každý kvádr šest stěn.",
      },
      true,
    );
  }

  if (druh === "hrany") {
    return uloha(
      `Urči, kolik hran má kvádr s rozměry ${rozmery}.`,
      hrany(12),
      [
        { value: hrany(6), why: "Tolik má kvádr stěn. Hrana je úsečka, ve které se stýkají dvě stěny." },
        { value: hrany(8), why: "Tolik má kvádr vrcholů. Hrany jsou úsečky, které vrcholy spojují, a je jich víc." },
        { value: hrany(4), why: "Spočítal jsi jen hrany jedné stěny. Kvádr má hrany u dna, u víka a ještě svislé hrany mezi nimi." },
      ],
      {
        hints: [
          "Krok 1: Hrana je úsečka, ve které se stýkají dvě stěny. Začni hranami, které ohraničují dno.",
          "Krok 2: K hranám dna přičti hrany víka a nakonec svislé hrany, které spojují rohy dna s rohy víka. Ověř si to na krabičce: přejeď prstem po každé hraně a počítej.",
        ],
        solutionSteps: [
          "Dno je obdélník se čtyřmi hranami, víko také: 4 + 4 = 8 hran.",
          "Svislé hrany spojují čtyři rohy dna se čtyřmi rohy víka: 4 hrany.",
          "Dohromady 8 + 4 = 12 hran.",
        ],
        explanation: "Každý kvádr má hrany dna, hrany víka a svislé hrany mezi nimi, po čtyřech z každého druhu. Rozměry kvádru na počtu hran nic nemění, proto má kvádr dvanáct hran.",
      },
      true,
    );
  }

  if (druh === "vrcholy") {
    return uloha(
      `Urči, kolik vrcholů má kvádr s rozměry ${rozmery}.`,
      vrcholy(8),
      [
        { value: vrcholy(4), why: "Spočítal jsi jen rohy dna. Stejně rohů má i víko." },
        { value: vrcholy(6), why: "Tolik má kvádr stěn. Vrchol je roh, ve kterém se potkávají tři hrany." },
        { value: vrcholy(12), why: "Tolik má kvádr hran. Vrcholy jsou body na koncích hran, každý patří třem hranám najednou." },
      ],
      {
        hints: [
          "Krok 1: Vrchol je roh tělesa, ve kterém se potkávají tři hrany. Spočítej nejdřív rohy dna.",
          "Krok 2: Stejný počet rohů má víko a jiné rohy kvádr nemá. Oba počty sečti. Ověř si to na krabičce: dotkni se postupně každého rohu a počítej.",
        ],
        solutionSteps: [
          "Dno je obdélník se čtyřmi rohy.",
          "Víko má také čtyři rohy.",
          "Dohromady 4 + 4 = 8 vrcholů.",
        ],
        explanation: "Všechny vrcholy kvádru leží buď u dna, nebo u víka a každý z těchto obdélníků má čtyři rohy. Kvádr má proto osm vrcholů, ať jsou jeho rozměry jakékoli.",
      },
      true,
    );
  }

  const [[x, y], z] = pick([[[a, b], c], [[a, c], b], [[b, c], a]] as [[number, number], number][]);
  return uloha(
    `Urči, kolik stěn v síti kvádru s rozměry ${rozmery} má tvar obdélníku ${x} cm × ${y} cm.`,
    steny(2),
    [
      { value: steny(1), why: "Každá stěna kvádru má naproti sobě stejně velkou stěnu (dno a víko, přední a zadní, levá a pravá)." },
      { value: steny(4), why: "Čtyři stejné stěny by měl jen kvádr se dvěma stejnými rozměry. Tady jsou všechny tři rozměry různé." },
      { value: steny(6), why: "Šest shodných stěn má jen krychle. Kvádr s různými rozměry má tři různé druhy obdélníků." },
    ],
    {
      hints: [
        `Krok 1: Obdélník ${x} cm × ${y} cm tvoří dvě různé hrany kvádru. Najdi stěnu, která tyto dvě hrany obsahuje.`,
        `Krok 2: Každá stěna kvádru má naproti sobě stejnou stěnu. Rozměr ${z} cm v tomto obdélníku není, takže stěny s ním sem nepatří. Ověř si to na krabičce: dno a víko, přední a zadní, levá a pravá stěna tvoří shodné dvojice.`,
      ],
      solutionSteps: [
        `Síť kvádru tvoří tři dvojice obdélníků: ${a} × ${b}, ${a} × ${c} a ${b} × ${c} (v cm).`,
        `Obdélník ${x} cm × ${y} cm je jedna z těchto dvojic: jedna stěna a stěna naproti ní.`,
        "Hledané stěny jsou tedy dvě: jedna stěna a stěna naproti ní.",
      ],
      explanation: `Stěny kvádru jsou po dvojicích shodné: dno s víkem, přední se zadní a levá s pravou. Protože jsou všechny tři rozměry různé, má tvar ${x} cm × ${y} cm jen jedna dvojice, tedy dvě stěny.`,
    },
    true,
  );
}

function l1ObjemKvadru(): PracticeTask | null {
  const a = rnd(2, 12), b = rnd(2, 12), c = rnd(2, 12);
  if (a === b && b === c) return null;
  const V = objem(a, b, c);
  const ab = a * b;
  return uloha(
    `Urči objem kvádru s rozměry ${a} cm, ${b} cm a ${c} cm.`,
    u(V, "cm³"),
    shuffle([
      { value: u(povrch(a, b, c), "cm³"), why: "Tohle je povrch, tedy součet obsahů všech šesti stěn. Objem říká, kolik se do tělesa vejde, a spočítá se násobením tří rozměrů." },
      { value: u(a + b + c, "cm³"), why: "Sečetl jsi délky hran. Objem vznikne násobením tří rozměrů: délka · šířka · výška." },
      { value: u(ab, "cm³"), why: `Tohle je obsah jedné stěny (${a} · ${b}), tedy jen jedna vrstva krychliček. Vrstvy je potřeba ještě vynásobit výškou.` },
      { value: u(4 * (a + b + c), "cm³"), why: "Tohle je součet délek všech dvanácti hran. Objem vznikne násobením tří rozměrů." },
    ]),
    {
      hints: [
        `Krok 1: Objem udává, kolik krychliček s hranou 1 cm se vejde dovnitř. Do spodní vrstvy se jich vejde ${a} · ${b}.`,
        `Krok 2: Vrstev je tolik, kolik centimetrů měří výška ${c} cm. Počet krychliček v jedné vrstvě vynásob počtem vrstev.`,
      ],
      solutionSteps: [
        "Objem kvádru: V = a · b · c",
        `Jedna vrstva: ${a} · ${b} = ${krychlicky(ab)}`,
        `${ab} · ${c} = ${cis(V)}, tedy V = ${u(V, "cm³")}`,
      ],
      explanation: `Objem kvádru je součin jeho tří rozměrů. Do jedné vrstvy se vejde ${a} · ${b} = ${ab} centimetrových krychliček a vrstev je ${c}, proto V = ${a} · ${b} · ${c} = ${u(V, "cm³")}.`,
    },
  );
}

function l1ObjemKrychle(): PracticeTask | null {
  const a = pick([2, 3, 4, 5, 7, 8, 9, 10, 11, 12]);
  const V = objem(a, a, a);
  return uloha(
    `Urči objem krychle s hranou ${a} cm.`,
    u(V, "cm³"),
    shuffle([
      { value: u(6 * a * a, "cm³"), why: "Tohle je povrch krychle, tedy součet obsahů šesti čtverců. Objem se počítá násobením: hrana · hrana · hrana." },
      { value: u(3 * a, "cm³"), why: "Sečetl jsi tři hrany. Objem vznikne jejich násobením: hrana · hrana · hrana." },
      { value: u(a * a, "cm³"), why: `Tohle je obsah jedné stěny (${a} · ${a}), tedy jen jedna vrstva krychliček. Vrstev je tolik, kolik měří hrana.` },
      { value: u(12 * a, "cm³"), why: "Tohle je součet délek všech dvanácti hran. Objem vznikne násobením tří rozměrů." },
    ]),
    {
      hints: [
        `Krok 1: Objem udává, kolik krychliček s hranou 1 cm se vejde dovnitř. Do spodní vrstvy se jich vejde ${a} · ${a}.`,
        `Krok 2: Vrstev je tolik, kolik centimetrů měří hrana. Počet krychliček v jedné vrstvě vynásob počtem vrstev.`,
      ],
      solutionSteps: [
        "Objem krychle: V = a · a · a",
        `Jedna vrstva: ${a} · ${a} = ${krychlicky(a * a)}`,
        `${a * a} · ${a} = ${cis(V)}, tedy V = ${u(V, "cm³")}`,
      ],
      explanation: `Krychle je kvádr se třemi stejnými rozměry, proto je její objem hrana · hrana · hrana. Jedna vrstva má ${a * a} centimetrových krychliček a vrstev je ${a}: V = ${u(V, "cm³")}.`,
    },
  );
}

function l1PovrchKrychle(): PracticeTask | null {
  // Hrana 6 dává stejné číslo pro povrch i objem, hrana 4 slévá tři distraktory.
  const a = pick([2, 3, 5, 7, 8, 9, 10, 11, 12]);
  const S = 6 * a * a;
  return uloha(
    `Urči povrch krychle s hranou ${a} cm.`,
    u(S, "cm²"),
    shuffle([
      { value: u(a * a * a, "cm²"), why: "Tohle je objem krychle (hrana · hrana · hrana), tedy kolik se do ní vejde. Povrch je součet obsahů všech čtverců sítě." },
      { value: u(4 * a * a, "cm²"), why: "Spočítal jsi jen čtyři boční stěny. Síť krychle má navíc dno a víko." },
      { value: u(24 * a, "cm²"), why: `Sečetl jsi obvody čtverců (${4 * a} cm u každého), ne jejich obsahy. Obsah čtverce je hrana · hrana.` },
      { value: u(a * a, "cm²"), why: "Tohle je obsah jen jednoho čtverce. Povrch krychle tvoří všechny čtverce její sítě." },
    ]),
    {
      hints: [
        `Krok 1: Síť krychle tvoří shodné čtverce. Spočítej, kolik jich je, a urči obsah jednoho: ${a} · ${a}.`,
        "Krok 2: Povrch je součet obsahů všech čtverců sítě. Obsah jednoho čtverce proto vynásob jejich počtem.",
      ],
      solutionSteps: [
        `Obsah jedné stěny: ${a} · ${a} = ${a * a} cm²`,
        "Síť krychle má 6 shodných čtverců.",
        `S = 6 · ${a * a} = ${u(S, "cm²")}`,
      ],
      explanation: `Povrch je součet obsahů všech stěn. Síť krychle tvoří šest shodných čtverců o obsahu ${a} · ${a} = ${a * a} cm², proto S = 6 · ${a} · ${a} = ${u(S, "cm²")}.`,
    },
  );
}

// ── L2 — použití ────────────────────────────────────────────────────────────

/** Dvě celé hrany a jedna desetinná, desetinná na náhodné pozici. */
function rozmeryJednaDesetinna(): [number, number, number] {
  const [p, q] = triRuzne(2, 12);
  const d = des1(1, 9);
  const v = shuffle([p, q, d]);
  return [v[0], v[1], v[2]];
}

function l2Povrch(): PracticeTask | null {
  const [a, b, c] = rozmeryJednaDesetinna();
  const S = povrch(a, b, c);
  const ab = r4(a * b), ac = r4(a * c), bc = r4(b * c);
  const pul = polovinaPovrchu(a, b, c);
  return uloha(
    `Vypočítej povrch kvádru s délkou ${u(a, "cm")}, šířkou ${u(b, "cm")} a výškou ${u(c, "cm")}.`,
    u(S, "cm²"),
    shuffle([
      { value: u(objem(a, b, c), "cm²"), why: "Vynásobil jsi tři rozměry, to je objem. Povrch je součet obsahů všech šesti stěn sítě." },
      { value: u(pul, "cm²"), why: "Spočítal jsi každý pár stěn jen jednou. V síti kvádru je každý obdélník dvakrát (dno a víko, přední a zadní, levá a pravá)." },
      { value: u(r4(2 * (ac + bc)), "cm²"), why: "Spočítal jsi jen čtyři boční stěny. Chybí dno a víko, obdélníky s rozměry délka × šířka." },
      { value: u(r4(4 * (a + b + c)), "cm²"), why: "Sečetl jsi délky všech dvanácti hran. Povrch vznikne sečtením obsahů stěn, ne délek." },
    ]),
    {
      hints: [
        `Krok 1: Síť kvádru tvoří tři dvojice shodných obdélníků: ${cis(a)} × ${cis(b)}, ${cis(a)} × ${cis(c)} a ${cis(b)} × ${cis(c)}. Spočítej obsah každého druhu.`,
        "Krok 2: Každý obsah započítej dvakrát, protože každá stěna má naproti sobě stejnou. Všechno sečti a hlídej desetinná místa v součinech.",
      ],
      solutionSteps: [
        `Dno a víko: ${soucinText(a, b)} cm²`,
        `Přední a zadní stěna: ${soucinText(a, c)} cm²`,
        `Levá a pravá stěna: ${soucinText(b, c)} cm²`,
        `S = 2 · (${cis(ab)} + ${cis(ac)} + ${cis(bc)}) = 2 · ${cis(pul)} = ${u(S, "cm²")}`,
      ],
      explanation: `Povrch je součet obsahů všech šesti stěn. Stěny jsou po dvou shodné, proto sečteme obsahy tří různých stěn (${cis(pul)} cm²) a součet zdvojnásobíme: S = ${u(S, "cm²")}.`,
    },
  );
}

function l2Objem(): PracticeTask | null {
  const x = des1(1, 9), y = des1(1, 9), z = rnd(2, 12);
  const [a, b, c] = shuffle([x, y, z]);
  const V = objem(a, b, c);
  if (!ciste(V)) return null;
  const ab = r4(a * b);
  return uloha(
    `Vypočítej objem kvádru s rozměry ${u(a, "cm")}, ${u(b, "cm")} a ${u(c, "cm")}.`,
    u(V, "cm³"),
    shuffle([
      { value: u(povrch(a, b, c), "cm³"), why: "Sečetl jsi obsahy stěn, to je povrch. Objem vznikne násobením tří rozměrů." },
      { value: u(r4(V * 10), "cm³"), why: "V součinu jsi oddělil méně desetinných míst, než mají rozměry dohromady. Dva rozměry mají po jednom desetinném místě, v součinu jsou tedy dvě." },
      { value: u(r4(a + b + c), "cm³"), why: "Sečetl jsi délky hran. Objem vznikne násobením tří rozměrů: délka · šířka · výška." },
      { value: u(ab, "cm³"), why: `Tohle je obsah jedné stěny (${cis(a)} · ${cis(b)}). Ještě ho musíš vynásobit třetím rozměrem.` },
    ]),
    {
      hints: [
        `Krok 1: Objem kvádru je součin tří rozměrů. Nejdřív vynásob dva z nich: ${cis(a)} · ${cis(b)}.`,
        `Krok 2: Výsledek vynásob třetím rozměrem ${cis(c)}. V součinu odděl tolik desetinných míst, kolik jich mají všichni činitelé dohromady.`,
      ],
      solutionSteps: [
        `${soucinText(a, b)}`,
        `${soucinText(ab, c)}`,
        `V = ${u(V, "cm³")}`,
      ],
      explanation: `Objem kvádru je součin délky, šířky a výšky. Desetinná čísla násobíme jako přirozená a čárku umístíme podle počtu desetinných míst všech činitelů: ${cis(a)} · ${cis(b)} · ${cis(c)} = ${u(V, "cm³")}.`,
    },
  );
}

function l2Prevod(): PracticeTask | null {
  const ROZ = [10, 15, 20, 25, 30, 35, 40, 45, 50, 60];
  const a = pick(ROZ), b = pick(ROZ), c = pick(ROZ);
  const V = a * b * c;
  if (V % 100 !== 0 || V < 1000) return null;
  const litryVysledek = r4(V / 1000);
  const vLitrech = Math.random() < 0.5;
  const jed = vLitrech ? "l" : "dm³";
  const S = povrch(a, b, c);
  const kontext = pick(["nádoby", "nádrže", "zásobníku"]);
  const question = vLitrech
    ? `Kolik litrů vody se vejde do ${kontext} tvaru kvádru s vnitřními rozměry ${a} cm, ${b} cm a ${c} cm?`
    : `Vypočítej objem krabice tvaru kvádru s rozměry ${a} cm, ${b} cm a ${c} cm a vyjádři ho v dm³.`;
  const pool: Distractor[] = [
    { value: u(r4(V / 100), jed), why: "Převedl jsi, jako by 1 dm³ bylo 100 cm³. Krychle 1 dm³ má hranu 10 cm, tedy objem 10 · 10 · 10 cm³ = 1 000 cm³." },
    { value: u(r4(V / 10), jed), why: "Převedl jsi jako délku (1 dm = 10 cm). U objemu se násobí tři rozměry, proto je 1 dm³ = 10 · 10 · 10 cm³." },
    { value: u(r4(V / 10000), jed), why: "Dělil jsi 10 000. Krychle 1 dm³ má hranu 10 cm, takže obsahuje 10 · 10 · 10 cm³, ne víc." },
  ];
  if (ciste(S / 1000)) {
    pool.push({ value: u(r4(S / 1000), jed), why: "Spočítal jsi povrch (součet obsahů stěn), ne objem. Kolik se do tělesa vejde, udává objem: součin tří rozměrů." });
  }
  return uloha(question, u(litryVysledek, jed), shuffle(pool), {
    hints: [
      `Krok 1: Nejdřív spočítej objem v cm³ jako součin rozměrů: ${a} · ${b} · ${c}.`,
      "Krok 2: Pak objem převeď. Platí 1 l = 1 dm³ a 1 dm³ je krychle s hranou 10 cm; spočítej, kolik cm³ má, a objem tím číslem vyděl.",
    ],
    solutionSteps: [
      `V = ${a} · ${b} · ${c} = ${u(V, "cm³")}`,
      "1 dm³ = 10 · 10 · 10 cm³ = 1 000 cm³ a 1 l = 1 dm³",
      `${cis(V)} : 1 000 = ${cis(litryVysledek)}, tedy V = ${u(litryVysledek, "dm³")} = ${u(litryVysledek, "l")}`,
    ],
    explanation: `Objem v cm³ je součin rozměrů: ${u(V, "cm³")}. Krychle s hranou 1 dm = 10 cm má objem 10 · 10 · 10 = 1 000 cm³, proto objem vydělíme 1 000 a dostaneme ${u(litryVysledek, jed)}${vLitrech ? " (1 dm³ je 1 litr)" : ""}.`,
  });
}

function l2Sit(): PracticeTask | null {
  const [p, q] = triRuzne(2, 12);
  const d = des1(1, 9);
  const [a, b, c] = shuffle([p, q, d]);
  const obd = shuffle([
    [a, b],
    [a, c],
    [b, c],
  ]).map((x) => shuffle(x));
  const popis = `Síť kvádru se skládá ze dvou obdélníků ${u(obd[0][0], "cm")} × ${u(obd[0][1], "cm")}, dvou obdélníků ${u(obd[1][0], "cm")} × ${u(obd[1][1], "cm")} a dvou obdélníků ${u(obd[2][0], "cm")} × ${u(obd[2][1], "cm")}.`;
  const S = povrch(a, b, c), V = objem(a, b, c), pul = polovinaPovrchu(a, b, c);
  const [x1, y1] = obd[0], [x2, y2] = obd[1], [x3, y3] = obd[2];
  const hrany3 = `${cis(a)} cm, ${cis(b)} cm a ${cis(c)} cm`;

  if (Math.random() < 0.5) {
    return uloha(
      `${popis} Kolik cm² papíru má tato síť?`,
      u(S, "cm²"),
      shuffle([
        { value: u(pul, "cm²"), why: "Spočítal jsi každý druh obdélníku jen jednou. V síti je každý obdélník dvakrát." },
        { value: u(V, "cm²"), why: "Vynásobil jsi tři hrany kvádru, to je objem. Papír na síť je součet obsahů všech šesti obdélníků." },
        { value: u(r4(8 * (a + b + c)), "cm²"), why: "Sečetl jsi obvody obdélníků, ne jejich obsahy. Obsah obdélníku je délka · šířka." },
        { value: u(r4(2 * (x1 * y1 + x2 * y2)), "cm²"), why: "Vynechal jsi jednu dvojici obdélníků. Síť kvádru má šest stěn, tři dvojice." },
      ]),
      {
        hints: [
          `Krok 1: Spočítej obsah každého druhu obdélníku zvlášť: ${cis(x1)} · ${cis(y1)}, ${cis(x2)} · ${cis(y2)} a ${cis(x3)} · ${cis(y3)}.`,
          "Krok 2: Každý obdélník je v síti dvakrát. Obsahy tří druhů sečti a součet zdvojnásob.",
        ],
        solutionSteps: [
          `${soucinText(x1, y1)} cm²`,
          `${soucinText(x2, y2)} cm²`,
          `${soucinText(x3, y3)} cm²`,
          `S = 2 · (${cis(r4(x1 * y1))} + ${cis(r4(x2 * y2))} + ${cis(r4(x3 * y3))}) = 2 · ${cis(pul)} = ${u(S, "cm²")}`,
        ],
        explanation: `Papír na síť je součet obsahů všech šesti obdélníků, tedy povrch kvádru. Obdélníky jsou po dvou shodné, proto sečteme tři různé obsahy (${cis(pul)} cm²) a zdvojnásobíme: ${u(S, "cm²")}.`,
      },
    );
  }

  return uloha(
    `${popis} Jaký objem má kvádr složený z této sítě?`,
    u(V, "cm³"),
    shuffle([
      { value: u(S, "cm³"), why: "Sečetl jsi obsahy všech obdélníků sítě, to je povrch. Objem je součin tří hran kvádru." },
      { value: u(pul, "cm³"), why: "Sečetl jsi obsahy tří různých stěn. Objem se nesčítá z ploch, je to součin tří hran." },
      { value: u(r4(a + b + c), "cm³"), why: "Sečetl jsi délky tří hran. Objem vznikne jejich násobením." },
      { value: u(r4(V * 10), "cm³"), why: "V součinu jsi zapomněl oddělit desetinné místo. Jedna hrana je desetinné číslo, takže součin má také desetinné místo." },
    ]),
    {
      hints: [
        "Krok 1: Zjisti z obdélníků tři hrany kvádru. Každá hrana se v rozměrech obdélníků objeví dvakrát.",
        "Krok 2: Objem je součin tří různých hran: délka · šířka · výška. Obsahy obdélníků nesčítej a u desetinné hrany hlídej čárku.",
      ],
      solutionSteps: [
        `Rozměry obdélníků se opakují, hrany kvádru jsou ${hrany3}.`,
        `${soucinText(a, b)}`,
        `V = ${soucinText(r4(a * b), c)} cm³`,
      ],
      explanation: `Každý obdélník sítě má dva rozměry, které jsou hranami kvádru; různé hrany jsou jen tři: ${hrany3}. Objem je jejich součin: ${u(V, "cm³")}.`,
    },
  );
}

// ── L3 — transfer a dva kroky ───────────────────────────────────────────────
/** Sedm různých typů: v šestiúlohové sérii se žádný nezopakuje. */
function rotaceL3(): () => Tvurce {
  return rotace<Tvurce>([
    l3ChybiStena,
    l3Vyska,
    l3KrychleZPovrchu,
    l3Zvetseni,
    l3Slepeni,
    l3Kostky,
    l3Voda,
  ]);
}

interface StenovaUloha {
  question: string;
  jed: "cm" | "m";
  /** Kolik stěn velikosti dna chybí (1 = bez víka / podlahy, 2 = jen plášť). */
  chybi: 1 | 2;
  a: number;
  b: number;
  h: number;
  /** Feedback, když žák počítá všech šest stěn. */
  vseFb: string;
  /** Feedback, když žák vynechá o jednu stěnu víc (u 5 stěn) / přidá dno (u pláště). */
  jinaFb: string;
  /** Co žák vypisuje ve škrtání. */
  skrtni: string;
  objemCo: string;
}

function stenovaUloha(): StenovaUloha {
  const jm = pick(JMENA);
  const druh = pick(["akvarium", "krabice", "pokoj", "bazen", "piskoviste"] as const);
  if (druh === "akvarium") {
    const a = pick([40, 50, 60, 70, 80]), b = pick([25, 30, 35, 40]), h = pick([30, 35, 40, 45, 50]);
    return {
      question: `${jm} si nechává vyrobit akvárium tvaru kvádru bez víka. Dno má rozměry ${a} cm × ${b} cm a výška je ${h} cm. Kolik cm² skla bude potřeba?`,
      jed: "cm", chybi: 1, a, b, h,
      vseFb: `Počítal jsi všech šest stěn. Akvárium nemá víko, v síti tedy chybí jedna stěna ${a} cm × ${b} cm.`,
      jinaFb: "Vynechal jsi i dno. Akvárium nemá jen víko, dno mít musí, jinak by voda vytekla.",
      skrtni: "víko",
      objemCo: "kolik vody se do akvária vejde",
    };
  }
  if (druh === "krabice") {
    const a = pick([28, 30, 32, 34, 36]), b = pick([16, 18, 20, 22]), h = pick([10, 11, 12, 13, 14]);
    return {
      question: `${jm} lepí z kartonu krabici od bot bez víka. Dno má rozměry ${a} cm × ${b} cm a krabice je vysoká ${h} cm. Kolik cm² kartonu spotřebuje? Chlopně na slepení nepočítej.`,
      jed: "cm", chybi: 1, a, b, h,
      vseFb: `Počítal jsi všech šest stěn. Krabice je bez víka, v síti tedy chybí jedna stěna ${a} cm × ${b} cm.`,
      jinaFb: "Vynechal jsi i dno. Krabice nemá jen víko, dno mít musí.",
      skrtni: "víko",
      objemCo: "kolik se do krabice vejde",
    };
  }
  if (druh === "pokoj") {
    const a = pick([3.5, 4, 4.5, 5, 6]), b = pick([3, 3.5, 4]), h = pick([2.5, 2.6, 2.8, 3]);
    return {
      question: `${jm} maluje pokoj tvaru kvádru. Natírá čtyři stěny i strop, podlahu ne. Podlaha má rozměry ${u(a, "m")} × ${u(b, "m")} a pokoj je vysoký ${u(h, "m")}. Kolik m² natře? Okna a dveře nepočítej.`,
      jed: "m", chybi: 1, a, b, h,
      vseFb: "Započítal jsi i podlahu, ta se ale nenatírá. Ze šesti stěn kvádru jedna odpadá.",
      jinaFb: "Vynechal jsi i strop. Natírá se všechno kromě podlahy.",
      skrtni: "podlahu",
      objemCo: "kolik vzduchu je v pokoji",
    };
  }
  if (druh === "bazen") {
    const a = pick([6, 8, 10, 12, 15]), b = pick([3, 4, 5, 6]), h = pick([1.2, 1.5, 1.8, 2]);
    return {
      question: `Bazén tvaru kvádru je dlouhý ${u(a, "m")}, široký ${u(b, "m")} a hluboký ${u(h, "m")}. ${jm} obkládá jeho dno i stěny dlaždicemi. Kolik m² obkladu je potřeba?`,
      jed: "m", chybi: 1, a, b, h,
      vseFb: "Počítal jsi i stěnu nahoře. Bazén je shora otevřený, obkládá se jen dno a boční stěny.",
      jinaFb: "Vynechal jsi dno, to se ale obkládá také.",
      skrtni: "horní stěnu (hladinu)",
      objemCo: "kolik vody se do bazénu vejde",
    };
  }
  const a = pick([1.5, 2, 2.5, 3]), b = pick([1, 1.5, 2]), h = pick([0.2, 0.3, 0.4, 0.5]);
  return {
    question: `Pískoviště tvaru kvádru nemá dno ani víko, jen čtyři boční stěny z prken. ${jm} ho staví dlouhé ${u(a, "m")}, široké ${u(b, "m")} a vysoké ${u(h, "m")}. Kolik m² prken spotřebuje?`,
    jed: "m", chybi: 2, a, b, h,
    vseFb: "Počítal jsi všech šest stěn kvádru. Pískoviště ale nemá dno ani víko, jen boční stěny.",
    jinaFb: "Přidal jsi i dno. Pískoviště stojí přímo na zemi a dno nemá.",
    skrtni: "dno i víko",
    objemCo: "kolik písku se do pískoviště vejde",
  };
}

function l3ChybiStena(): PracticeTask | null {
  const t = stenovaUloha();
  const { a, b, h, jed } = t;
  const ab = r4(a * b), ah = r4(a * h), bh = r4(b * h);
  const plast = r4(2 * ah + 2 * bh);
  const vse = r4(2 * ab + plast);
  const klic = r4(vse - t.chybi * ab);
  const plocha = `${jed}²`;
  const pool: Distractor[] = [
    { value: u(vse, plocha), why: t.vseFb },
    { value: u(r4(klic - ab), plocha), why: t.jinaFb },
    {
      value: u(r4((2 - t.chybi) * ab + ah + bh), plocha),
      why: "Boční stěny jsi započítal každou jen jednou. Naproti každé boční stěně stojí stejně velká stěna.",
    },
    {
      value: u(objem(a, b, h), plocha),
      why: `Vynásobil jsi tři rozměry, to je objem (${t.objemCo}). Plocha je součet obsahů stěn.`,
    },
  ];
  if (t.chybi === 2) pool[1] = { value: u(r4(plast + ab), plocha), why: t.jinaFb };
  if (pool.some((d) => !ciste(hodnotaTextu(d.value)))) return null;
  return uloha(t.question, u(klic, plocha), shuffle(pool), {
    hints: [
      `Krok 1: Vypiš všechny stěny kvádru: dvě ${cis(a)} × ${cis(b)}, dvě ${cis(a)} × ${cis(h)} a dvě ${cis(b)} × ${cis(h)} (v ${jed}). Pak škrtni ${t.skrtni}.`,
      `Krok 2: Obsahy stěn, které zůstaly, spočítej a sečti. Škrtnutá stěna má stejné rozměry jako dno, tedy ${cis(a)} × ${cis(b)}.`,
    ],
    solutionSteps: [
      `Dno a víko: ${soucinText(a, b)} ${plocha} každé`,
      `Přední a zadní stěna: ${soucinText(a, h)} ${plocha} každá`,
      `Levá a pravá stěna: ${soucinText(b, h)} ${plocha} každá`,
      t.chybi === 2
        ? `Bez dna a víka: 2 · ${cis(ah)} + 2 · ${cis(bh)} = ${u(klic, plocha)}`
        : `Pět stěn: ${cis(ab)} + 2 · ${cis(ah)} + 2 · ${cis(bh)} = ${u(klic, plocha)}`,
    ],
    explanation: t.chybi === 2
      ? `Úplná síť kvádru má šest stěn. Tady chybí dno i víko, zbývají čtyři boční stěny po dvou shodné: 2 · ${cis(ah)} + 2 · ${cis(bh)} = ${u(klic, plocha)}.`
      : `Úplná síť kvádru má šest stěn (${u(vse, plocha)}). Tady jedna stěna o rozměrech ${cis(a)} × ${cis(b)} chybí, proto ji odečteme: ${cis(vse)} − ${cis(ab)} = ${u(klic, plocha)}.`,
  });
}

/** Inverze: povrch krychle → hrana → objem. */
function l3KrychleZPovrchu(): PracticeTask | null {
  const jm = pick(JMENA);
  const a = pick([4, 5, 7, 8, 9, 10, 11, 12]);
  const S = 6 * a * a, V = a * a * a, st = a * a;
  const question = Math.random() < 0.5
    ? `${jm} balí dárek do krabičky tvaru krychle. Na polepení všech jejích stěn spotřebuje přesně ${u(S, "cm²")} papíru. Jaký objem má krabička?`
    : `Kostka tvaru krychle má povrch ${u(S, "cm²")}. ${jm} chce zjistit, kolik místa zabírá. Jaký objem má kostka?`;
  return uloha(
    question,
    u(V, "cm³"),
    shuffle([
      { value: u(st, "cm³"), why: `Tohle je obsah jedné stěny (${cis(S)} : 6), ne objem. Z obsahu stěny ještě zjisti hranu a tu vynásob třikrát sebou.` },
      { value: u(S, "cm³"), why: "Opsal jsi povrch. Povrch je plocha stěn, objem udává, kolik se do tělesa vejde." },
      { value: u(3 * a, "cm³"), why: "Hranu jsi našel správně, ale tři hrany jsi sečetl. Objem krychle je hrana · hrana · hrana." },
      { value: u(st * st * st, "cm³"), why: `Obsah stěny (${cis(st)}) jsi považoval za hranu. Hrana je číslo, které vynásobené samo sebou dá obsah stěny.` },
    ]),
    {
      hints: [
        `Krok 1: Povrch krychle tvoří šest shodných čtverců. Vyděl povrch ${cis(S)} cm² šesti a dostaneš obsah jednoho čtverce.`,
        "Krok 2: Hledej číslo, které vynásobené samo sebou dá obsah čtverce; zkoušej po řadě malá čísla. To je hrana. Objem je pak hrana · hrana · hrana.",
      ],
      solutionSteps: [
        `Obsah jedné stěny: ${cis(S)} : 6 = ${u(st, "cm²")}`,
        `Hrana: ${a} · ${a} = ${st}, tedy hrana měří ${a} cm`,
        `V = ${a} · ${a} · ${a} = ${u(V, "cm³")}`,
      ],
      explanation: `Z povrchu zjistíme obsah jedné stěny (${cis(S)} : 6 = ${cis(st)} cm²), z něj hranu (${a} cm, protože ${a} · ${a} = ${st}) a teprve z hrany objem: ${a} · ${a} · ${a} = ${u(V, "cm³")}.`,
    },
  );
}

/** Inverze: objem a dno → výška (akvárium v litrech, krabice, bazén). */
function l3Vyska(): PracticeTask | null {
  const jm = pick(JMENA);
  const druh = pick(["krabice", "bazen", "akvarium"] as const);

  if (druh === "akvarium") {
    const a = pick([40, 50, 60, 80]), b = pick([20, 25, 30, 40]), c = pick([20, 25, 30, 35, 40, 45, 50]);
    const V = a * b * c;
    if (V % 1000 !== 0) return null;
    const L = V / 1000;
    const pool: Distractor[] = [
      { value: u(r4(c / 10), "cm"), why: "Počítal jsi, jako by 1 litr byl 100 cm³. Litr je 1 dm³, tedy krychle 10 × 10 × 10 cm, a to je 1 000 cm³." },
      { value: u(r4(c / 100), "cm"), why: "Počítal jsi, jako by 1 litr byl 10 cm³. Litr je 1 dm³ = 10 · 10 · 10 cm³." },
      { value: u(r4(b * c), "cm"), why: `Objem jsi vydělil jen délkou dna ${a} cm. Výška = objem : obsah dna, a obsah dna je ${a} · ${b}.` },
      { value: u(r4(c / 2), "cm"), why: "Objem jsi vydělil obsahem dna i víka dohromady. Objem je obsah jedné podstavy krát výška." },
    ].filter((d) => ciste(hodnotaTextu(d.value)));
    return uloha(
      `Akvárium tvaru kvádru má dno ${a} cm × ${b} cm a vejde se do něj ${cis(L)} ${litry(L)} vody. Jak vysoké je akvárium?`,
      u(c, "cm"),
      shuffle(pool),
      {
        hints: [
          `Krok 1: Litry převeď na cm³: 1 l = 1 dm³ a 1 dm³ je krychle s hranou 10 cm. Obsah dna je ${a} · ${b}.`,
          "Krok 2: Objem je obsah dna krát výška, takže výšku dostaneš, když objem v cm³ vydělíš obsahem dna.",
        ],
        solutionSteps: [
          `${cis(L)} l = ${cis(L)} dm³ = ${cis(L)} · 1 000 cm³ = ${u(V, "cm³")}`,
          `Obsah dna: ${a} · ${b} = ${u(a * b, "cm²")}`,
          `Výška: ${cis(V)} : ${cis(a * b)} = ${u(c, "cm")}`,
          `Zkouška: ${a} · ${b} · ${c} = ${u(V, "cm³")}`,
        ],
        explanation: `Objem kvádru je obsah dna krát výška, proto výška = objem : obsah dna. Nejdřív ale musí být objem ve stejných jednotkách jako rozměry: ${cis(L)} l = ${u(V, "cm³")}. Pak ${cis(V)} : ${cis(a * b)} = ${u(c, "cm")}.`,
      },
    );
  }

  const bazen = druh === "bazen";
  const jed = bazen ? "m" : "cm";
  const a = bazen ? pick([5, 6, 8, 10, 12]) : pick([24, 28, 30, 32, 36]);
  const b = bazen ? pick([3, 4, 5, 6]) : pick([15, 16, 18, 20]);
  const c = bazen ? pick([1, 1.2, 1.5, 2, 2.5]) : pick([10, 12, 14, 15, 25]);
  const V = objem(a, b, c);
  const question = bazen
    ? `Bazén tvaru kvádru pojme, když je plný až po okraj, ${u(V, "m³")} vody. Je dlouhý ${a} m a široký ${b} m. Jak je bazén hluboký?`
    : `${jm} má krabici tvaru kvádru s objemem ${u(V, "cm³")}. Dno krabice má rozměry ${a} cm × ${b} cm. Jak vysoká je krabice?`;
  const pool: Distractor[] = [
    { value: u(r4(V / a), jed), why: `Objem jsi vydělil jen délkou ${a} ${jed}. Výška = objem : obsah dna, a obsah dna je ${a} · ${b}.` },
    { value: u(r4(V / b), jed), why: `Objem jsi vydělil jen šířkou ${b} ${jed}. Výška = objem : obsah dna, a obsah dna je ${a} · ${b}.` },
    { value: u(r4(V / (a + b)), jed), why: `Rozměry dna jsi sečetl. Obsah dna vznikne násobením: ${a} · ${b}.` },
    { value: u(r4(c / 2), jed), why: "Objem jsi vydělil obsahem dna i víka dohromady. Objem je obsah jedné podstavy krát výška." },
  ].filter((d) => ciste(hodnotaTextu(d.value)));
  return uloha(question, u(c, jed), shuffle(pool), {
    hints: [
      `Krok 1: Objem kvádru je obsah dna krát výška. Spočítej obsah dna: ${a} · ${b}.`,
      "Krok 2: Výšku dostaneš opačnou operací: objem vyděl obsahem dna. Výsledek ověř zkouškou násobením.",
    ],
    solutionSteps: [
      `Obsah dna: ${a} · ${b} = ${u(a * b, `${jed}²`)}`,
      `Výška: ${cis(V)} : ${cis(a * b)} = ${u(c, jed)}`,
      `Zkouška: ${cis(a * b)} · ${cis(c)} = ${u(V, `${jed}³`)}`,
    ],
    explanation: `Protože V = obsah dna · výška, najdeme výšku dělením: ${cis(V)} : ${cis(a * b)} = ${u(c, jed)}. Dělíme obsahem dna, ne jednotlivými rozměry.`,
  });
}

const KRAT_SLOVY: Record<number, string> = { 2: "dvakrát", 3: "třikrát", 4: "čtyřikrát", 5: "pětkrát", 10: "desetkrát" };

function l3Zvetseni(): PracticeTask | null {
  const k = pick([2, 3, 4, 5, 10]);
  const naObjem = Math.random() < 0.5;
  const a = rnd(1, 6);
  const jm = pick(JMENA);
  const velicina = naObjem ? "objem" : "povrch";
  const question = Math.random() < 0.5
    ? `${jm} má kostku tvaru krychle s hranou ${a} cm. Pak vyrobí větší krychli s hranou ${k * a} cm. Kolikrát větší ${velicina} má větší krychle?`
    : `Hrana krychle měřila ${a} cm. Pak se zvětšila ${KRAT_SLOVY[k]}. Kolikrát se zvětšil ${velicina} krychle?`;
  const b = k * a;

  if (naObjem) {
    const V1 = a * a * a, V2 = b * b * b;
    return uloha(
      question,
      krat(k * k * k),
      shuffle([
        { value: krat(k), why: "Takhle se zvětšila jen hrana. U krychle se prodlouží všechny tři rozměry, a objem je jejich součin." },
        { value: krat(k * k), why: `${k} · ${k} je zvětšení obsahu jedné stěny, která má dva rozměry. Objem má tři rozměry a každý se zvětšil stejně.` },
        { value: krat(3 * k), why: `Zvětšení tří rozměrů jsi sečetl (${k} + ${k} + ${k}). Objem je součin rozměrů, proto se zvětšení násobí.` },
        { value: krat(6 * k * k), why: "Zvětšení jedné stěny jsi ještě vynásobil počtem stěn. Počet stěn se ale nemění; objem závisí jen na třech rozměrech." },
      ]),
      {
        hints: [
          `Krok 1: Spočítej objem menší krychle (hrana ${a} cm) a objem krychle, jejíž hrana je ${KRAT_SLOVY[k]} delší.`,
          "Krok 2: Větší objem vyděl menším. Objem závisí na třech rozměrech a každý z nich se zvětšil stejně, zvětšení se proto násobí.",
        ],
        solutionSteps: [
          `Původní objem: ${a} · ${a} · ${a} = ${u(V1, "cm³")}`,
          `Nový objem: ${b} · ${b} · ${b} = ${u(V2, "cm³")}`,
          `${cis(V2)} : ${cis(V1)} = ${cis(V2 / V1)}, tedy ${k} · ${k} · ${k}krát`,
        ],
        explanation: `Když se hrana zvětší ${KRAT_SLOVY[k]}, zvětší se ${KRAT_SLOVY[k]} délka, šířka i výška. Objem je jejich součin, proto vzroste ${k} · ${k} · ${k}krát, tedy ${krat(k * k * k)}.`,
      },
    );
  }

  const S1 = 6 * a * a, S2 = 6 * b * b;
  return uloha(
    question,
    krat(k * k),
    shuffle([
      { value: krat(k), why: "Takhle se zvětšila jen hrana. Každá stěna je čtverec a zvětšily se oba jeho rozměry." },
      { value: krat(k * k * k), why: "Takhle se zvětší objem, který má tři rozměry. Stěna má jen dva rozměry." },
      { value: krat(2 * k), why: `Zvětšení dvou rozměrů stěny jsi sečetl (${k} + ${k}). Obsah je součin rozměrů, proto se zvětšení násobí.` },
      { value: krat(6 * k), why: "Zvětšení hrany jsi vynásobil počtem stěn. Stěn je pořád šest a každá se zvětšila stejně, podle obou svých rozměrů." },
    ]),
    {
      hints: [
        `Krok 1: Spočítej povrch menší krychle (hrana ${a} cm) a povrch krychle, jejíž hrana je ${KRAT_SLOVY[k]} delší.`,
        "Krok 2: Větší povrch vyděl menším. Obsah stěny závisí na dvou rozměrech a každý z nich se zvětšil stejně, zvětšení se proto násobí.",
      ],
      solutionSteps: [
        `Původní povrch: 6 · ${a} · ${a} = ${u(S1, "cm²")}`,
        `Nový povrch: 6 · ${b} · ${b} = ${u(S2, "cm²")}`,
        `${cis(S2)} : ${cis(S1)} = ${cis(S2 / S1)}, tedy ${k} · ${k}krát`,
      ],
      explanation: `Každá stěna je čtverec, jehož obě strany se zvětšily ${KRAT_SLOVY[k]}, takže se obsah stěny zvětší ${k} · ${k}krát. Stěn je pořád šest, proto se tolikrát zvětší i povrch: ${krat(k * k)}.`,
    },
  );
}

function l3Slepeni(): PracticeTask | null {
  const n = pick([2, 2, 3]);
  const a = rnd(2, 12);
  const jm = pick(JMENA);
  const st = a * a;
  const klic = (4 * n + 2) * st;
  const slovo = n === 2 ? "dvě" : "tři";
  const spoju = n - 1;
  return uloha(
    `${jm} slepí ${slovo} stejné kostky tvaru krychle s hranou ${a} cm do řady, vždy celou stěnou k sobě. Jaký povrch má vzniklý kvádr?`,
    u(klic, "cm²"),
    shuffle([
      { value: u(6 * n * st, "cm²"), why: "Sečetl jsi povrchy všech kostek. Slepené stěny jsou uvnitř kvádru, na povrchu nejsou vidět." },
      { value: u((6 * n - spoju) * st, "cm²"), why: "U každého slepení jsi odečetl jen jednu stěnu. Slepují se ale dvě stěny, z každé kostky jedna." },
      { value: u(n * a * a * a, "cm²"), why: "Tohle je objem kvádru (součet objemů kostek). Povrch je součet obsahů stěn, které jsou vidět." },
      { value: u(6 * st, "cm²"), why: "Tohle je povrch jedné kostky. Kvádr je delší, a proto má větší povrch." },
    ]),
    {
      hints: [
        `Krok 1: Urči rozměry vzniklého kvádru: kostky leží v řadě, takže délku tvoří hrany všech kostek; šířka i výška zůstávají ${a} cm.`,
        "Krok 2: Spočítej povrch tohoto kvádru jako součet obsahů jeho stěn. Nebo od povrchů všech kostek odečti stěny, které jsou slepené a nejsou vidět.",
      ],
      solutionSteps: [
        `Kvádr má rozměry ${n * a} cm × ${a} cm × ${a} cm.`,
        `Povrchy kostek: ${n} · 6 · ${st} = ${u(6 * n * st, "cm²")}`,
        `${spoju === 1 ? "Jedno slepení skryje" : "Dvě slepení skryjí"} ${2 * spoju} ${plural(2 * spoju, "stěnu", "stěny", "stěn")}: ${cis(6 * n * st)} − ${2 * spoju} · ${st} = ${u(klic, "cm²")}`,
      ],
      explanation: `Každá kostka má šest stěn, ale při každém slepení zmizí z povrchu dvě stěny (jedna z každé kostky). Z celkových ${steny(6 * n)} tak zbude ${steny(4 * n + 2)} po ${st} cm², tedy ${u(klic, "cm²")}.`,
    },
  );
}

/** Kolik kostek s hranou 2 cm se vejde do krabice / je ve zdi. */
function l3Kostky(): PracticeTask | null {
  const jm = pick(JMENA);
  const a = pick([10, 12, 14, 16, 18, 20, 24]), b = pick([4, 6, 8, 10, 12]), c = pick([6, 8, 10, 12, 16]);
  const vrstva = (a / 2) * (b / 2);
  const klic = vrstva * (c / 2);
  const abc = a * b * c;
  const zed = Math.random() < 0.5;
  const question = zed
    ? `${jm} staví ze stavebnicových kostek s hranou 2 cm plnou zeď tvaru kvádru. Zeď je dlouhá ${a} cm, vysoká ${c} cm a silná ${b} cm. Kolik kostek potřebuje?`
    : `${jm} skládá do krabice tvaru kvádru s vnitřními rozměry ${a} cm × ${b} cm × ${c} cm kostky s hranou 2 cm. Kolik kostek se do krabice vejde?`;
  const pool: Distractor[] = [
    { value: kostky(abc), why: "Počítal jsi kostky s hranou 1 cm. Tyto kostky jsou dvakrát delší, širší i vyšší." },
    { value: kostky(abc / 2), why: "Počet centimetrových krychliček jsi vydělil dvěma jen jednou. Kostka je větší ve všech třech směrech, zabere místo 2 · 2 · 2 malých krychliček." },
    { value: kostky(vrstva), why: `Spočítal jsi jen jednu vrstvu kostek. Vrstev je tolik, kolikrát se 2 cm vejdou do rozměru ${c} cm.` },
  ];
  if (abc % 6 === 0) {
    pool.push({ value: kostky(abc / 6), why: "Dělil jsi 2 + 2 + 2. Místo, které kostka zabere, je součin jejích rozměrů: 2 · 2 · 2." });
  }
  return uloha(question, kostky(klic), shuffle(pool), {
    hints: [
      `Krok 1: Zjisti, kolik kostek s hranou 2 cm se vejde podél každého rozměru: ${a} : 2, ${b} : 2 a ${c} : 2.`,
      "Krok 2: Počet kostek v jedné vrstvě je součin prvních dvou počtů a vrstev je tolik, kolik vychází ve třetím směru. Počty vynásob.",
    ],
    solutionSteps: [
      `Počty kostek podél rozměrů: ${a} : 2 = ${a / 2}, ${b} : 2 = ${b / 2} a ${c} : 2 = ${c / 2}.`,
      `Jedna vrstva: ${a / 2} · ${b / 2} = ${kostky(vrstva)}`,
      `Všechny vrstvy: ${cis(vrstva)} · ${c / 2} = ${cis(klic)}`,
    ],
    explanation: `Kostka s hranou 2 cm se do každého rozměru vejde polovičním počtem, než kolik centimetrů rozměr měří. Počet kostek je součin těchto tří počtů: ${a / 2} · ${b / 2} · ${c / 2} = ${kostky(klic)}.`,
  });
}

/** Voda v akváriu do dané výšky, v litrech. */
function l3Voda(): PracticeTask | null {
  const jm = pick(JMENA);
  const a = pick([40, 50, 60, 80, 100]), b = pick([25, 30, 40, 50]);
  const H = pick([30, 35, 40, 45, 50, 60]);
  const h = pick([15, 20, 25, 30, 35, 40, 45, 50].filter((x) => x < H && 2 * x !== H));
  const dno = a * b;
  const V = dno * h;
  if (V % 100 !== 0) return null;
  const klic = r4(V / 1000);
  const pool: Distractor[] = [
    { value: u(r4((dno * H) / 1000), "l"), why: `Počítal jsi s celou výškou akvária ${H} cm. Voda ale sahá jen do výšky ${h} cm.` },
    { value: u(r4((dno * (H - h)) / 1000), "l"), why: "Spočítal jsi prázdnou část akvária nad hladinou. Voda je pod hladinou." },
    { value: u(r4(V / 100), "l"), why: "Převedl jsi, jako by 1 litr byl 100 cm³. Litr je 1 dm³, tedy 10 · 10 · 10 cm³." },
    { value: u(r4(V / 10000), "l"), why: "Dělil jsi 10 000. Litr je 1 dm³, krychle s hranou 10 cm, a ta má 10 · 10 · 10 cm³." },
  ].filter((d) => ciste(hodnotaTextu(d.value)));
  return uloha(
    `Akvárium tvaru kvádru má dno ${a} cm × ${b} cm a je vysoké ${H} cm. ${jm} do něj nalije vodu do výšky ${h} cm. Kolik litrů vody v akváriu je?`,
    u(klic, "l"),
    shuffle(pool),
    {
      hints: [
        `Krok 1: Voda má tvar kvádru se stejným dnem ${a} cm × ${b} cm, ale s výškou hladiny ${h} cm. Spočítej její objem v cm³.`,
        "Krok 2: Objem převeď na litry: 1 l = 1 dm³ a 1 dm³ je krychle s hranou 10 cm. Spočítej, kolik cm³ má, a objem vody tím číslem vyděl.",
      ],
      solutionSteps: [
        `Objem vody: ${a} · ${b} · ${h} = ${u(V, "cm³")}`,
        "1 l = 1 dm³ = 10 · 10 · 10 cm³ = 1 000 cm³",
        `${cis(V)} : 1 000 = ${cis(klic)}, tedy ${u(klic, "l")}`,
      ],
      explanation: `Voda vyplní kvádr s dnem akvária a výškou ${h} cm (celková výška ${H} cm sem nepatří). Její objem je ${u(V, "cm³")} a protože litr je 1 000 cm³, je v akváriu ${u(klic, "l")} vody.`,
    },
  );
}

// ── Topic ────────────────────────────────────────────────────────────────
export const SIT_KRYCHLE_A_KVADRU_POVRCH_A_OBJEM: TopicMetadata[] = [
  {
    id: "g6-mat-sit-krychle-a-kvadru-povrch-a-objem-6",
    rvpNodeId: "g6-matematika-geometrie-v-rovine-a-v-prostoru-krychle-a-kvadr-sit-krychle-a-kvadru-povrch-a-objem",
    displayName: "Síť krychle a kvádru, povrch a objem",
    title: "Síť krychle a kvádru, povrch a objem",
    studentTitle: "Krychle a kvádr: síť, povrch a objem",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Krychle a kvádr",
    briefDescription: "Spočítáš, kolik papíru krabice potřebuje a kolik se do ní vejde.",
    keywords: [
      "krychle", "kvádr", "síť kvádru", "síť krychle", "povrch", "objem",
      "stěna", "hrana", "vrchol", "krychlový centimetr", "litr", "převod jednotek objemu",
      "slovní úloha",
    ],
    goals: [
      "Popsat síť krychle a kvádru a určit počet stěn, hran a vrcholů.",
      "Vypočítat povrch krychle a kvádru jako součet obsahů všech stěn.",
      "Vypočítat objem krychle a kvádru a převést cm³ na dm³ a litry.",
      "Použít povrch a objem ve slovní úloze: chybějící stěna, výpočet hrany, zvětšení tělesa.",
    ],
    boundaries: [
      "Rozměry jsou celá čísla nebo desetinná čísla s jedním desetinným místem, výsledky nejvýš se dvěma.",
      "Bez mocnin: zvětšení se zapisuje jako 2 · 2 · 2krát.",
      "Bez zlomků, procent a záporných čísel; povrch a objem jen krychle a kvádru.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    prerequisites: ["g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-obsah-obrazce-ve-ctvercove-siti-jednotky-obsahu"],
    generator: gen,
    helpTemplate: {
      hint: "Povrch je součet obsahů všech stěn sítě (cm²). Objem je součin tří rozměrů (cm³): kolik krychliček 1 cm se vejde do jedné vrstvy a kolik je vrstev.",
      steps: [
        "Vypiš stěny sítě: kvádr má tři dvojice shodných obdélníků, krychle šest shodných čtverců.",
        "Povrch: sečti obsahy stěn, které těleso opravdu má.",
        "Objem: vynásob délku, šířku a výšku.",
        "Převod: 1 l = 1 dm³ = 1 000 cm³.",
      ],
      commonMistake: "Záměna povrchu a objemu, započtení každé dvojice stěn jen jednou nebo převod 1 dm³ = 100 cm³.",
      example: "Kvádr 6 cm × 4 cm × 2,5 cm: S = 2 · (24 + 15 + 10) = 98 cm², V = 6 · 4 · 2,5 = 60 cm³.",
    },
  },
];
