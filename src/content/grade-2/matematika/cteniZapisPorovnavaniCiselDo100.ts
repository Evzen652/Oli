import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { plural } from "@/lib/czechGrammar";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Přepsáno 2026-09-11 (inventura obsahu): původní pevné banky měly 7/7/7 úloh,
// jednu nápovědu a žádnou zpětnou vazbu. Teď parametrický generátor, jehož
// nápovědy, vysvětlení i zpětná vazba počítají s čísly konkrétní úlohy.
//
// L1 rozpoznání — zápis z desítek a jednotek, kolik má číslo desítek/jednotek,
//                 největší/nejmenší ze čtyř čísel s různými desítkami.
// L2 aplikace   — zápis čísla podle slov, o 1 / o 10 větší či menší (i přes desítku),
//                 největší/nejmenší, když rozhodují jednotky.
// L3 transfer   — seřazení čtyř čísel, sestavení čísla ze dvou číslic,
//                 chybějící číslice v nerovnosti.

const rnd = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
const desA = (n: number) => `${n} ${plural(n, "desítku", "desítky", "desítek")}`;
const jedA = (n: number) => `${n} ${plural(n, "jednotku", "jednotky", "jednotek")}`;
const desN = (n: number) => `${n} ${plural(n, "desítka", "desítky", "desítek")}`;

const TEENS = ["deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct"];
const TENS = ["", "", "dvacet", "třicet", "čtyřicet", "padesát", "šedesát", "sedmdesát", "osmdesát", "devadesát"];
const UNITS = ["", "jedna", "dva", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět"];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
/** Číslo 10–99 slovy. */
function slovy(n: number): string {
  if (n < 20) return TEENS[n - 10];
  const t = Math.floor(n / 10), u = n % 10;
  return u ? `${TENS[t]} ${UNITS[u]}` : TENS[t];
}

interface Built {
  q: string;
  ans: number | string;
  cands: { v: number | string; why: string }[];
  h0: string;
  h1: string;
  expl: string;
}

/**
 * Vybere 3 různé distraktory (≠ klíč) a ověří, že nápověda klíč neprozradí —
 * ledaže je klíč přímo ve znění otázky (výběr z vypsaných čísel).
 * Čísla nad 100 jsou povolená: „407" místo 47 je typická chyba zápisu.
 */
function finish(b: Built): PracticeTask | null {
  const ans = String(b.ans);
  const seen = new Set([ans]);
  const ds: Distractor[] = [];
  for (const c of b.cands) {
    const v = String(c.v);
    if (seen.has(v)) continue;
    if (typeof c.v === "number" && (!Number.isInteger(c.v) || c.v < 0 || c.v > 999)) continue;
    seen.add(v);
    ds.push({ value: v, why: c.why });
    if (ds.length === 3) break;
  }
  if (ds.length < 3) return null;
  const esc = ans.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const leak = new RegExp(`(^|[^\\d])${esc}([^\\d]|$)`);
  // Výjimka jen pro klíč, který v otázce stojí jako samostatné číslo („…: 45, 72, 28, 54?"),
  // ne jako součást zápisu typu „4□".
  const vOtazce = b.q.split(/[\s,:?]+/).includes(ans);
  if (!vOtazce && (leak.test(b.h0) || leak.test(b.h1))) return null;
  return choice(b.q, ans, ds as [Distractor, Distractor, Distractor], { hints: [b.h0, b.h1], explanation: b.expl });
}

// ── L1 ───────────────────────────────────────────────────────────────────────

function zDesitekAJednotek(): Built {
  const t = rnd(1, 9), u = rnd(1, 9), n = t * 10 + u;
  const swap = u * 10 + t;
  const prvni = u !== t ? [{ v: swap, why: `Přehodil jsi desítky a jednotky. Číslo ${swap} má ${desA(u)} a ${jedA(t)}.` }] : [];
  return {
    q: `Které číslo má ${desA(t)} a ${jedA(u)}?`,
    ans: n,
    cands: [...prvni, ...shuffle([
      { v: t * 100 + u, why: `Napsal jsi ${t * 10} a za to ${u}. Dvojmístné číslo má ale jen dvě číslice — desítky a jednotky.` },
      { v: t * 10, why: `Číslo ${t * 10} má jen desítky, jednotky jsi vynechal.` },
      { v: t + u, why: `Sečetl jsi ${t} + ${u}. Desítky a jednotky se nesčítají, každá číslice má své místo.` },
    ])],
    h0: `Která číslice v čísle ukazuje desítky a která jednotky? Potřebuješ ${desA(t)} a ${jedA(u)}.`,
    h1: `Počet desítek se píše na první místo, počet jednotek hned za něj. Projdi možnosti a u každé si řekni, kolik má desítek a kolik jednotek. Přesně ${desA(t)} a ${jedA(u)} má jen jedna z nich.`,
    expl: `Na místo desítek patří ${t}, na místo jednotek ${u}. ${desN(t)} a ${u} ${plural(u, "jednotka", "jednotky", "jednotek")} dávají číslo ${n}.`,
  };
}

function kolikDesitekJednotek(): Built {
  let t = rnd(1, 9), u = rnd(0, 9);
  while (u === t) u = rnd(0, 9);
  const n = t * 10 + u;
  if (Math.random() < 0.5) {
    return {
      q: `Kolik desítek má číslo ${n}?`,
      ans: t,
      cands: shuffle([
        { v: u, why: `${u} je počet jednotek — ta číslice stojí na druhém místě.` },
        { v: t * 10, why: `${t * 10} je hodnota všech desítek dohromady. Ptáme se, kolik desítek číslo má.` },
        { v: n, why: `${n} je celé číslo, ne počet jeho desítek.` },
        { v: t + 1, why: `O jednu desítku víc. Podívej se znovu na první číslici čísla ${n}.` },
      ]),
      h0: `Číslo ${n} rozlož na desítky a jednotky. Která jeho číslice ukazuje desítky?`,
      h1: `U dvojmístného čísla stojí desítky na prvním místě a jednotky na druhém. Podívej se na první číslici čísla ${n} — ta řekne, kolik celých desítek číslo obsahuje.`,
      expl: `Číslo ${n} je ${t * 10} + ${u}. Na prvním místě stojí ${t}, proto má ${desA(t)}.`,
    };
  }
  return {
    q: `Kolik jednotek má číslo ${n}?`,
    ans: u,
    cands: shuffle([
      { v: t, why: `${t} je počet desítek — ta číslice stojí na prvním místě.` },
      { v: n, why: `${n} je celé číslo, ne počet jeho jednotek navíc k desítkám.` },
      { v: u + 1, why: `O jednu víc. Podívej se znovu na druhou číslici čísla ${n}.` },
      ...(u > 0 ? [{ v: u - 1, why: `O jednu méně. Podívej se znovu na druhou číslici čísla ${n}.` }] : []),
    ]),
    h0: `Číslo ${n} rozlož na desítky a jednotky. Která jeho číslice ukazuje jednotky?`,
    h1: `U dvojmístného čísla stojí desítky na prvním místě a jednotky na druhém. Podívej se na druhou číslici čísla ${n} — ta řekne, kolik jednotek je navíc k celým desítkám.`,
    expl: `Číslo ${n} je ${t * 10} + ${u}. Na druhém místě stojí ${u}, proto má ${jedA(u)}.`,
  };
}

/** Největší/nejmenší ze čtyř čísel s různými desítkami; dvě mají prohozené číslice. */
function porovnejRuzneDesitky(): Built {
  const cifry = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [a, b, d, e] = cifry;
  const x = a * 10 + b, y = b * 10 + a, z = d * 10 + rnd(0, 9), w = e * 10 + rnd(0, 9);
  const nums = shuffle([x, y, z, w]);
  const max = Math.random() < 0.5;
  const ans = max ? Math.max(...nums) : Math.min(...nums);
  const list = nums.join(", ");
  const rev = (v: number) => (v % 10) * 10 + Math.floor(v / 10);
  return {
    q: `Které číslo je ${max ? "největší" : "nejmenší"}: ${list}?`,
    ans,
    cands: nums.filter((v) => v !== ans).map((v) => ({
      v,
      why: rev(v) === ans
        ? `${v} má stejné číslice jako jiné číslo v zadání, jen v opačném pořadí. Rozhoduje číslice na místě desítek.`
        : max
          ? `${v} má jen ${desA(Math.floor(v / 10))}. Najdi číslo, které má desítek víc.`
          : `${v} má ${desA(Math.floor(v / 10))}. Najdi číslo, které má desítek méně.`,
    })),
    h0: `Porovnej desítky čísel ${list}. Které z nich má desítek ${max ? "nejvíc" : "nejméně"}?`,
    h1: `Podívej se jen na první číslice: ${nums.map((v) => Math.floor(v / 10)).join(", ")}. Vyber ${max ? "největší" : "nejmenší"} z nich — k ní patří hledané číslo. Pozor na dvě čísla se stejnými číslicemi v jiném pořadí.`,
    expl: `Rozhodují desítky: ${ans} má ${desA(Math.floor(ans / 10))}, ${max ? "víc" : "méně"} než ostatní čísla. Proto je ${max ? "největší" : "nejmenší"}.`,
  };
}

// ── L2 ───────────────────────────────────────────────────────────────────────

function zeSlov(): Built {
  const t = rnd(2, 9), u = rnd(1, 9), n = t * 10 + u, swap = u * 10 + t;
  const soused = t < 9 ? n + 10 : n - 10;
  return {
    q: `Zapiš číslicemi: ${slovy(n)}`,
    ans: n,
    cands: [
      { v: t * 100 + u, why: `Napsal jsi „${TENS[t]}“ jako ${t * 10} a za to ${u}. Dvojmístné číslo má ale jen dvě číslice — desítky a jednotky.` },
      ...shuffle([
        ...(u !== t ? [{ v: swap, why: `${swap} se čte „${slovy(swap)}“ — přehodil jsi desítky a jednotky.` }] : []),
        { v: soused, why: `${soused} se čte „${slovy(soused)}“. Slovo „${TENS[t]}“ znamená ${desA(t)}.` },
        { v: t * 10, why: `${t * 10} je jen „${TENS[t]}“ — jednotky „${UNITS[u]}“ chybí.` },
      ]),
    ],
    h0: `„${cap(TENS[t])}“ říká počet desítek a „${UNITS[u]}“ počet jednotek. Kolik je čeho?`,
    h1: `Nejdřív napiš číslici za „${TENS[t]}“ — kolik desítek to je? Hned za ni napiš číslici za „${UNITS[u]}“. Vznikne dvojmístné číslo, žádnou nulu mezi číslice nepiš.`,
    expl: `„${cap(TENS[t])}“ znamená ${desA(t)}, proto na místo desítek píšeme ${t}. „${cap(UNITS[u])}“ znamená ${jedA(u)}, proto na místo jednotek píšeme ${u}. Dohromady ${n}.`,
  };
}

function oJednuODesitku(): Built {
  const typ = rnd(0, 3);
  if (typ === 0) {
    const t = rnd(1, 8), n = t * 10 + 9, c = n + 1;
    return {
      q: `Které číslo je o 1 větší než ${n}?`,
      ans: c,
      cands: [
        { v: t * 10, why: `Jednotky jsi změnil na nulu, ale desítku jsi nepřidal. Po devíti jednotkách začíná nová desítka.` },
        ...shuffle([
          { v: t * 100 + 10, why: `Napsal jsi ${t} a za to 10. Deset jednotek ale tvoří novou desítku, na místo jednotek se 10 nevejde.` },
          { v: n - 1, why: `${n - 1} je o 1 menší, ne větší.` },
          { v: n + 10, why: `Přidal jsi celou desítku, a ne jednu jednotku.` },
        ]),
      ],
      h0: `Číslo ${n} má na místě jednotek devítku. Co se stane, když přidáš ještě jednu jednotku?`,
      h1: `Devět jednotek a jedna další je deset jednotek, a to je jedna celá desítka. Desítek tedy bude o jednu víc než v čísle ${n} a na místě jednotek zůstane nula.`,
      expl: `${n} + 1: devět jednotek a jedna jednotka tvoří novou desítku. Místo ${desA(t)} tak číslo má ${desA(t + 1)} a žádnou jednotku: ${c}.`,
    };
  }
  if (typ === 1) {
    const t = rnd(2, 9), n = t * 10, c = n - 1;
    return {
      q: `Které číslo je o 1 menší než ${n}?`,
      ans: c,
      cands: [
        { v: n + 9, why: `Jednotky jsi změnil na devítku, ale desítku jsi neubral. Jednotku sis musel vzít z jedné desítky.` },
        ...shuffle([
          { v: n + 1, why: `${n + 1} je o 1 větší, ne menší.` },
          { v: n - 10, why: `Ubral jsi celou desítku, a ne jednu jednotku.` },
          { v: n - 2, why: `${n - 2} je o 2 menší — ubral jsi o jednu víc.` },
        ]),
      ],
      h0: `Číslo ${n} nemá žádné jednotky. Odkud vezmeš jednotku, kterou máš ubrat?`,
      h1: `Rozměň jednu desítku čísla ${n} na deset jednotek a jednu z nich uber. Desítek bude o jednu méně než teď a jednotek zůstane devět.`,
      expl: `${n} ${"−"} 1: jednu desítku rozměníme na deset jednotek a jednu ubereme. Číslo pak má ${desA(t - 1)} a devět jednotek: ${c}.`,
    };
  }
  const plus = typ === 2;
  const n = plus ? rnd(10, 89) : rnd(20, 99);
  const t = Math.floor(n / 10), u = n % 10, c = plus ? n + 10 : n - 10;
  const sg = plus ? 1 : -1;
  return {
    q: `Které číslo je o 10 ${plus ? "větší" : "menší"} než ${n}?`,
    ans: c,
    cands: shuffle([
      { v: n + sg, why: `${plus ? "Přidal" : "Ubral"} jsi jednu jednotku, a ne jednu desítku.` },
      { v: n - sg * 10, why: `Tohle číslo je o 10 ${plus ? "menší" : "větší"}, ne ${plus ? "větší" : "menší"}.` },
      { v: n + sg * 11, why: `${plus ? "Přidal" : "Ubral"} jsi desítku a navíc ještě jednu jednotku.` },
      { v: n + sg * 20, why: `${plus ? "Přidal" : "Ubral"} jsi dvě desítky, stačí jedna.` },
    ]),
    h0: `Která číslice čísla ${n} se změní, když ${plus ? "přidáš" : "ubereš"} jednu desítku?`,
    h1: `Jednotky zůstanou stejné (${u}). Desítek bude o jednu ${plus ? "víc" : "méně"} než v čísle ${n}. Zapiš číslo s novým počtem desítek a se stejnými jednotkami.`,
    expl: `O 10 ${plus ? "větší" : "menší"} znamená o jednu desítku ${plus ? "víc" : "méně"}. Jednotky zůstanou ${u} a desítek bude ${t + sg} místo ${t}: ${c}.`,
  };
}

/** Největší/nejmenší, když tři čísla mají stejné desítky; čtvrté je past s „velkou" číslicí jednotek. */
function porovnejJednotky(): Built {
  const t = rnd(2, 8), max = Math.random() < 0.5;
  const pool = max ? [0, 1, 2, 3, 4, 5, 6, 7] : [2, 3, 4, 5, 6, 7, 8, 9];
  const us = shuffle(pool).slice(0, 3);
  const trapU = max ? rnd(Math.max(...us) + 1, 9) : rnd(0, Math.min(...us) - 1);
  const trap = max ? (t - 1) * 10 + trapU : (t + 1) * 10 + trapU;
  const same = us.map((u) => t * 10 + u);
  const nums = shuffle([...same, trap]);
  const ans = max ? Math.max(...same) : Math.min(...same);
  const list = nums.join(", ");
  return {
    q: `Které číslo je ${max ? "největší" : "nejmenší"}: ${list}?`,
    ans,
    cands: nums.filter((v) => v !== ans).map((v) => ({
      v,
      why: v === trap
        ? max
          ? `${v} má na místě jednotek velkou číslici ${trapU}, ale jen ${desA(t - 1)}. Desítky rozhodují dřív než jednotky.`
          : `${v} má na místě jednotek jen ${trapU}, ale ${desA(t + 1)} — víc než ostatní čísla. Desítky rozhodují dřív než jednotky.`
        : max
          ? `${v} má také ${desA(t)}, ale jen ${jedA(v % 10)}. Najdi číslo se stejnými desítkami a víc jednotkami.`
          : `${v} má také ${desA(t)}, ale ${jedA(v % 10)}. Najdi číslo se stejnými desítkami a méně jednotkami.`,
    })),
    h0: `Tři z čísel ${list} mají stejný počet desítek. Podle čeho mezi nimi rozhodneš?`,
    h1: `Nejdřív porovnej desítky všech čísel ${list} — číslo s ${max ? "menším" : "větším"} počtem desítek nemůže být ${max ? "největší" : "nejmenší"}. U čísel se stejnými desítkami pak rozhodnou jednotky.`,
    expl: `Nejdřív desítky: ${trap} má ${max ? "méně" : "víc"} desítek, proto nevyhraje. Zbylá čísla mají ${desA(t)} a rozhodnou jednotky: ${ans} jich má ${max ? "nejvíc" : "nejméně"}.`,
  };
}

// ── L3 ───────────────────────────────────────────────────────────────────────

function serad(): Built | null {
  const cifry = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [a, b, d] = cifry;
  let c = rnd(0, 9);
  while (c === b) c = rnd(0, 9);
  const x = a * 10 + b, y = b * 10 + a, z = a * 10 + c, w = d * 10 + rnd(0, 9);
  const nums = [x, y, z, w];
  if (new Set(nums).size !== 4) return null;
  const asc = Math.random() < 0.5;
  const cmp = (p: number, q: number) => (asc ? p - q : q - p);
  const sorted = [...nums].sort(cmp);
  let qOrder = shuffle(nums);
  for (let i = 0; i < 10 && (qOrder.join() === sorted.join() || qOrder.join() === [...sorted].reverse().join()); i++) qOrder = shuffle(nums);
  if (qOrder.join() === sorted.join() || qOrder.join() === [...sorted].reverse().join()) return null;
  const s = (arr: number[]) => arr.join(", ");
  const prohod = (p: number, q: number) => sorted.map((v) => (v === p ? q : v === q ? p : v));
  const proc = (p: number, q: number) => {
    const [driv, pozdeji] = sorted.indexOf(p) < sorted.indexOf(q) ? [p, q] : [q, p];
    return `${driv} je ${asc ? "menší" : "větší"} než ${pozdeji}, proto musí stát před ním.`;
  };
  const podleJednotek = [...nums].sort((p, q) => cmp(p % 10, q % 10) || cmp(p, q));
  const list = qOrder.join(", ");
  const smer = asc ? "od nejmenšího" : "od největšího";
  return {
    q: `Seřaď ${smer}: ${list}`,
    ans: s(sorted),
    cands: [
      ...shuffle([
        { v: s(prohod(x, y)), why: proc(x, y) },
        { v: s(prohod(x, z)), why: proc(x, z) },
      ]),
      ...shuffle([
        { v: s([...sorted].reverse()), why: `Seřadil jsi čísla ${asc ? "od největšího" : "od nejmenšího"}. Úloha chce začít ${asc ? "nejmenším" : "největším"}.` },
        { v: s(podleJednotek), why: `Řadil jsi podle jednotek (druhé číslice). Nejdřív ale rozhodují desítky.` },
      ]),
    ],
    h0: `Najdi mezi čísly ${list} nejdřív to ${asc ? "nejmenší" : "největší"}. Rozhodují desítky.`,
    h1: `Porovnej první číslice (desítky) všech čísel ${list}. Když mají dvě čísla stejné desítky, rozhodnou jednotky. Pozor na čísla se stejnými číslicemi v jiném pořadí.`,
    expl: `Nejdřív rozhodují desítky, u stejných desítek jednotky: ${sorted.join(asc ? " < " : " > ")}.`,
  };
}

function sestavZCislic(): Built {
  const [a, b] = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const hi = Math.max(a, b), lo = Math.min(a, b), max = Math.random() < 0.5;
  const ans = max ? hi * 10 + lo : lo * 10 + hi;
  const opak = max ? hi : lo;
  const druhe = max ? lo : hi;
  return {
    q: `Sestav z číslic ${a} a ${b} ${max ? "největší" : "nejmenší"} dvojmístné číslo. Každou použij jednou.`,
    ans,
    cands: [
      { v: max ? lo * 10 + hi : hi * 10 + lo, why: `Tohle je ${max ? "nejmenší" : "největší"} číslo z číslic ${a} a ${b}. Pro ${max ? "největší" : "nejmenší"} číslo patří na místo desítek ${max ? "větší" : "menší"} číslice.` },
      ...shuffle([
        { v: opak * 11, why: `Číslici ${opak} jsi použil dvakrát. Každou číslici můžeš použít jen jednou.` },
        { v: a + b, why: `Sečetl jsi číslice ${a} + ${b}. Máš z nich ale sestavit dvojmístné číslo.` },
        { v: druhe * 11, why: `Číslici ${druhe} jsi použil dvakrát a druhou vůbec. Každou číslici použij právě jednou.` },
      ]),
    ],
    h0: `Chceš co ${max ? "největší" : "nejmenší"} číslo. Kterou z číslic ${a} a ${b} dáš na místo desítek?`,
    h1: `Místo desítek má větší váhu než místo jednotek. Proto na místo desítek dej ${max ? "větší" : "menší"} z číslic ${a} a ${b} a tu druhou napiš na místo jednotek.`,
    expl: `Desítky mají větší váhu než jednotky. Pro ${max ? "největší" : "nejmenší"} číslo dáme na místo desítek ${max ? hi : lo} a na místo jednotek ${max ? lo : hi}: ${ans}.`,
  };
}

function cisliceVNerovnosti(): Built {
  const max = Math.random() < 0.5;
  const t = rnd(1, 9);
  if (max) {
    const u = rnd(2, 9), n = t * 10 + u, c = u - 1;
    return {
      q: `Jakou největší číslici můžeš napsat do □? ${t}□ < ${n}`,
      ans: c,
      cands: [
        { v: u, why: `S číslicí ${u} vznikne ${n}, a ${n} < ${n} neplatí — čísla by se rovnala.` },
        ...shuffle([
          ...(u < 9 ? [{ v: u + 1, why: `S číslicí ${u + 1} vznikne ${n + 1}, a to je větší než ${n}.` }] : []),
          ...(u + 1 < 9 ? [{ v: 9, why: `S devítkou vznikne ${t * 10 + 9}, a to je větší než ${n}.` }] : []),
          ...(u >= 2 ? [{ v: u - 2, why: `Číslo ${t * 10 + u - 2} je sice menší než ${n}, ale ${u - 2} není největší číslice, která vyhovuje.` }] : []),
          ...(u - 2 > 0 ? [{ v: 0, why: `Číslo ${t * 10} je sice menší než ${n}, ale hledáš největší vhodnou číslici, ne nejmenší.` }] : []),
        ]),
      ],
      h0: `Číslo se čtverečkem má stejné desítky jako ${n}. Jaké jednotky musí mít, aby bylo menší než ${n}?`,
      h1: `Zkoušej za □ číslice od devítky dolů a pokaždé porovnej vzniklé číslo s ${n}. Jakmile poprvé vyjde číslo menší než ${n}, máš největší vhodnou číslici. Pozor, rovnost nestačí.`,
      expl: `Desítky jsou stejné, rozhodují jednotky. Aby platilo ${t}□ < ${n}, musí být jednotky menší než ${u}. Největší taková číslice je ${c}: ${t * 10 + c} < ${n}.`,
    };
  }
  const u = rnd(0, 7), n = t * 10 + u, c = u + 1;
  return {
    q: `Jakou nejmenší číslici můžeš napsat do □? ${t}□ > ${n}`,
    ans: c,
    cands: [
      { v: u, why: `S číslicí ${u} vznikne ${n}, a ${n} > ${n} neplatí — čísla by se rovnala.` },
      ...shuffle([
        ...(u >= 1 ? [{ v: u - 1, why: `S číslicí ${u - 1} vznikne ${n - 1}, a to je menší než ${n}.` }] : []),
        ...(u - 1 > 0 ? [{ v: 0, why: `S nulou vznikne ${t * 10}, a to je menší než ${n}.` }] : []),
        { v: u + 2, why: `Číslo ${n + 2} je sice větší než ${n}, ale ${u + 2} není nejmenší číslice, která vyhovuje.` },
        ...(u + 2 < 9 ? [{ v: 9, why: `Číslo ${t * 10 + 9} je sice větší než ${n}, ale hledáš nejmenší vhodnou číslici, ne největší.` }] : []),
      ]),
    ],
    h0: `Číslo se čtverečkem má stejné desítky jako ${n}. Jaké jednotky musí mít, aby bylo větší než ${n}?`,
    h1: `Zkoušej za □ číslice od nuly nahoru a pokaždé porovnej vzniklé číslo s ${n}. Jakmile poprvé vyjde číslo větší než ${n}, máš nejmenší vhodnou číslici. Pozor, rovnost nestačí.`,
    expl: `Desítky jsou stejné, rozhodují jednotky. Aby platilo ${t}□ > ${n}, musí být jednotky větší než ${u}. Nejmenší taková číslice je ${c}: ${t * 10 + c} > ${n}.`,
  };
}

// ── generátor ────────────────────────────────────────────────────────────────

function naplnit(out: PracticeTask[], seen: Set<string>, make: () => Built | null, n: number) {
  let added = 0;
  for (let attempt = 0; added < n && attempt < 300; attempt++) {
    const b = make();
    if (!b || seen.has(b.q)) continue;
    const t = finish(b);
    if (!t) continue;
    seen.add(b.q);
    out.push(t);
    added++;
  }
}

function gen(level: number): PracticeTask[] {
  const out: PracticeTask[] = [];
  const seen = new Set<string>();
  if (level === 1) {
    naplnit(out, seen, zDesitekAJednotek, 5);
    naplnit(out, seen, kolikDesitekJednotek, 5);
    naplnit(out, seen, porovnejRuzneDesitky, 5);
  } else if (level === 2) {
    naplnit(out, seen, zeSlov, 5);
    naplnit(out, seen, oJednuODesitku, 5);
    naplnit(out, seen, porovnejJednotky, 5);
  } else {
    naplnit(out, seen, serad, 5);
    naplnit(out, seen, sestavZCislic, 5);
    naplnit(out, seen, cisliceVNerovnosti, 5);
  }
  return shuffle(out);
}

export const CTENIZAPISPOROVNAVANICISELDO100: TopicMetadata[] = [
  {
    id: "g2-mat-cteni-zapis-100",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-ciselny-obor-0-100-cteni-zapis-a-porovnavani-cisel-do-100",
    title: "Čtení, zápis a porovnávání čísel do 100",
    studentTitle: "Co je víc?",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–100",
    briefDescription: "Porovnáš čísla do 100 a najdeš větší nebo menší.",
    keywords: ["porovnávání", "větší", "menší", "čísla do 100", "čtení čísel"],
    goals: [
      "Přečíst a zapsat čísla do 100.",
      "Porovnat tři čísla a určit největší.",
      "Určit číslo o 1 nebo 10 větší/menší.",
    ],
    boundaries: ["Pouze čísla 0–100.", "Bez záporných čísel."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Srovnej nejdřív desítky — větší desítka = větší číslo.",
      steps: [
        "Podívej se na cifru desítek.",
        "Větší cifra desítek = větší číslo.",
        "Pokud jsou desítky stejné, srovnej jedničky.",
      ],
      commonMistake: "34 vs 43 — 43 je větší, protože má víc desítek (4 > 3).",
      example: "34 nebo 43? Desítky: 3 < 4 → 43 je větší.",
    },
  },
];
