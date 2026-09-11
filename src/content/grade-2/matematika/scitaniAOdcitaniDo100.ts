import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { plural } from "@/lib/czechGrammar";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Přepsáno 2026-09-11 (inventura obsahu): původní pevné banky měly 9/10/7 úloh,
// jednu nápovědu a žádnou zpětnou vazbu. Teď parametrický generátor, jehož
// nápovědy, vysvětlení i zpětná vazba počítají s čísly konkrétní úlohy.
//
// L1 rozpoznání — bez přechodu desítky: dvojmístné ± jednomístné, celé desítky.
// L2 aplikace   — s přechodem desítky (± jednomístné) a dvojmístné ± dvojmístné bez přechodu.
// L3 transfer   — dvojmístné ± dvojmístné s přechodem a chybějící číslo (inverze).
//
// Distraktory = chybový model: zapomenutý přechod přes desítku, „menší od většího"
// u jednotek, přičtené jen desítky/jen jednotky, záměna operace, o jednu vedle.

const M = "−"; // U+2212, stejně jako zbytek matematiky 2. ročníku

const rnd = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
const desA = (n: number) => `${n} ${plural(n, "desítku", "desítky", "desítek")}`;
const jedA = (n: number) => `${n} ${plural(n, "jednotku", "jednotky", "jednotek")}`;

interface Built {
  q: string;
  ans: number;
  cands: { v: number; why: string }[];
  h0: string;
  h1: string;
  expl: string;
}

/** Vybere 3 různé platné distraktory (0–100, ≠ klíč) a zkontroluje, že nápověda klíč neprozradí. */
function finish(b: Built): PracticeTask | null {
  const ans = String(b.ans);
  const seen = new Set([ans]);
  const ds: Distractor[] = [];
  for (const c of b.cands) {
    const v = String(c.v);
    if (seen.has(v) || !Number.isInteger(c.v) || c.v < 0 || c.v > 100) continue;
    seen.add(v);
    ds.push({ value: v, why: c.why });
    if (ds.length === 3) break;
  }
  if (ds.length < 3) return null;
  const leak = new RegExp(`(^|[^\\d])${ans}([^\\d]|$)`);
  if (leak.test(b.h0) || leak.test(b.h1)) return null;
  return choice(b.q, ans, ds as [Distractor, Distractor, Distractor], { hints: [b.h0, b.h1], explanation: b.expl });
}

/** Typická chyba nahoře, ostatní v náhodném pořadí — ať se střídá, které tři dítě uvidí. */
const typicke = (prvni: Built["cands"], ostatni: Built["cands"]) => [...prvni, ...shuffle(ostatni)];

// ── L1: bez přechodu desítky ─────────────────────────────────────────────────

function plusJednomistneBez(): Built {
  const at = rnd(1, 8), au = rnd(0, 8);
  const a = at * 10 + au, b = rnd(1, 9 - au), c = a + b;
  return {
    q: `${a} + ${b} = ?`,
    ans: c,
    cands: typicke([], [
      { v: c - 1, why: `Při počítání po jedné jsi nejspíš započítal i číslo ${a}. Začni počítat až od čísla, které je hned za ním.` },
      { v: c + 1, why: `O jednu víc — jako bys přičetl ${b + 1}, a ne ${b}.` },
      { v: c + 10, why: `Přidal jsi navíc celou desítku, ale jednotky ${au} + ${b} desítku nepřekročí.` },
      { v: a - b, why: `To je ${a} ${M} ${b}. Odečetl jsi, ale v příkladu je plus.` },
    ]),
    h0: `Číslo ${a} má ${desA(at)} a ${jedA(au)}. Které z nich se po přičtení ${b} změní?`,
    h1: `Počet desítek zůstane stejný (${at}). Sečti jen jednotky ${au} + ${b} a výsledek napiš za desítky. Jednotek bude méně než deset, takže přes desítku nepřecházíš.`,
    expl: `Desítky se nemění (${at}), sčítáme jen jednotky: ${au} + ${b} = ${au + b}. Proto ${a} + ${b} = ${c}.`,
  };
}

function minusJednomistneBez(): Built {
  const at = rnd(1, 9), au = rnd(1, 9);
  const a = at * 10 + au, b = rnd(1, au), c = a - b;
  return {
    q: `${a} ${M} ${b} = ?`,
    ans: c,
    cands: typicke([], [
      { v: c + 1, why: `Při odpočítávání po jedné jsi nejspíš započítal i číslo ${a}. Začni až od čísla, které je hned před ním.` },
      { v: c - 1, why: `O jednu méně — jako bys odečetl ${b + 1}, a ne ${b}.` },
      { v: c - 10, why: `Ubral jsi navíc celou desítku. Jednotek je ${au}, na odečtení ${b} jich stačí, desítky zůstávají.` },
      { v: a + b, why: `To je ${a} + ${b}. Sečetl jsi, ale v příkladu je minus.` },
    ]),
    h0: `Číslo ${a} má ${desA(at)} a ${jedA(au)}. Které z nich se po odečtení ${b} změní?`,
    h1: `Počet desítek zůstane stejný (${at}). Odečti jen jednotky ${au} ${M} ${b} a výsledek napiš za desítky. Jednotek je dost, takže desítku rozměňovat nemusíš.`,
    expl: `Desítky se nemění (${at}), odečítáme jen jednotky: ${au} ${M} ${b} = ${au - b}. Proto ${a} ${M} ${b} = ${c}.`,
  };
}

function celeDesitky(): Built {
  if (Math.random() < 0.5) {
    const at = rnd(1, 8), bt = rnd(1, 9 - at);
    const a = at * 10, b = bt * 10, k = at + bt, c = k * 10;
    return {
      q: `${a} + ${b} = ?`,
      ans: c,
      cands: typicke([{ v: k, why: `Zapomněl jsi na nulu. Sečetl jsi počty desítek, ale výsledek musíš zapsat jako desítky, tedy s nulou na konci.` }], [
        { v: c + 10, why: `O desítku víc — sečti znovu počty desítek ${at} + ${bt}.` },
        { v: c - 10, why: `O desítku méně — sečti znovu počty desítek ${at} + ${bt}.` },
        { v: a - b, why: `To je ${a} ${M} ${b}. Odečetl jsi, ale v příkladu je plus.` },
      ]),
      h0: `Číslo ${a} má ${desA(at)}, číslo ${b} má ${desA(bt)}. Kolik desítek mají dohromady?`,
      h1: `Sečti jen počty desítek: ${at} + ${bt}. To číslo napiš a přidej za něj nulu, protože žádné jednotky tu nejsou. Počítáš vlastně jako s malými čísly.`,
      expl: `Sčítáme desítky: ${at} + ${bt} = ${k}. Výsledek má ${desA(k)} a žádnou jednotku, proto ${a} + ${b} = ${c}.`,
    };
  }
  const at = rnd(2, 9), bt = rnd(1, at - 1);
  const a = at * 10, b = bt * 10, k = at - bt, c = k * 10;
  return {
    q: `${a} ${M} ${b} = ?`,
    ans: c,
    cands: typicke([{ v: k, why: `Zapomněl jsi na nulu. Odečetl jsi počty desítek, ale výsledek musíš zapsat jako desítky, tedy s nulou na konci.` }], [
      { v: c + 10, why: `O desítku víc — odečti znovu počty desítek ${at} ${M} ${bt}.` },
      { v: c - 10, why: `O desítku méně — odečti znovu počty desítek ${at} ${M} ${bt}.` },
      { v: a + b, why: `To je ${a} + ${b}. Sečetl jsi, ale v příkladu je minus.` },
    ]),
    h0: `Číslo ${a} má ${desA(at)}, číslo ${b} má ${desA(bt)}. Kolik desítek zbude?`,
    h1: `Odečti jen počty desítek: ${at} ${M} ${bt}. To číslo napiš a přidej za něj nulu, protože žádné jednotky tu nejsou. Počítáš vlastně jako s malými čísly.`,
    expl: `Odečítáme desítky: ${at} ${M} ${bt} = ${k}. Výsledek má ${desA(k)} a žádnou jednotku, proto ${a} ${M} ${b} = ${c}.`,
  };
}

// ── L2: přechod přes desítku, dvojmístné bez přechodu ────────────────────────

function plusJednomistneSPrechodem(): Built {
  const at = rnd(1, 8), au = rnd(2, 9);
  const a = at * 10 + au, b = rnd(11 - au, 9), c = a + b;
  const fill = 10 - au, ten = (at + 1) * 10, rest = b - fill;
  return {
    q: `${a} + ${b} = ?`,
    ans: c,
    cands: typicke([{ v: c - 10, why: `Zapomněl jsi na přechod přes desítku: ${au} + ${b} je víc než deset, takže přibude jedna desítka.` }], [
      { v: c - 1, why: `O jednu méně — zkontroluj, kolik ti po doplnění do ${ten} ještě zbývá přičíst.` },
      { v: c + 1, why: `O jednu víc — zkontroluj, kolik ti po doplnění do ${ten} ještě zbývá přičíst.` },
      { v: c + 10, why: `O desítku víc. Při přechodu přes desítku přibude jen jedna desítka, ne dvě.` },
      { v: a - b, why: `To je ${a} ${M} ${b}. Odečetl jsi, ale v příkladu je plus.` },
    ]),
    h0: `Kolik chybí od ${a} do nejbližší celé desítky? Podle toho si rozlož číslo ${b}.`,
    h1: `Nejdřív doplň ${a} do celé desítky: přičti ${fill} a jsi na ${ten}. Z čísla ${b} ti pak zbývá přičíst ještě ${rest}. Přičti je k ${ten}.`,
    expl: `${a} + ${fill} = ${ten} a ${ten} + ${rest} = ${c}. Jednotky ${au} + ${b} přesáhly deset, proto přibyla jedna desítka.`,
  };
}

function minusJednomistneSPrechodem(): Built {
  const at = rnd(2, 9), au = rnd(1, 8);
  const a = at * 10 + au, b = rnd(au + 1, 9), c = a - b;
  const ten = at * 10, rest = b - au;
  return {
    q: `${a} ${M} ${b} = ?`,
    ans: c,
    cands: typicke([{ v: at * 10 + (b - au), why: `Odečetl jsi menší číslici od větší (${b} ${M} ${au}) a desítky nechal. Jednotek je ale jen ${au}, méně než ${b} — musíš přejít přes desítku.` }], [
      { v: c + 10, why: `Zapomněl jsi, že při přechodu přes desítku jedna desítka ubude.` },
      { v: c + 1, why: `O jednu víc — zkontroluj, kolik ti po odečtení do ${ten} ještě zbývá odečíst.` },
      { v: c - 1, why: `O jednu méně — zkontroluj, kolik ti po odečtení do ${ten} ještě zbývá odečíst.` },
      { v: a + b, why: `To je ${a} + ${b}. Sečetl jsi, ale v příkladu je minus.` },
    ]),
    h0: `Kolik musíš od ${a} odečíst, abys byl na celé desítce? Podle toho si rozlož ${b}.`,
    h1: `Nejdřív odečti ${au} a jsi na ${ten}. Z čísla ${b} ti pak zbývá odečíst ještě ${rest}. Odečti je od ${ten} — tím přejdeš do nižší desítky.`,
    expl: `${a} ${M} ${au} = ${ten} a ${ten} ${M} ${rest} = ${c}. Jednotek (${au}) bylo méně než ${b}, proto jsme přešli přes desítku a jedna desítka ubyla.`,
  };
}

function dvojmistneBez(): Built {
  if (Math.random() < 0.5) {
    const at = rnd(1, 8), bt = rnd(1, 9 - at), au = rnd(1, 8), bu = rnd(1, 9 - au);
    const a = at * 10 + au, b = bt * 10 + bu, c = a + b;
    return {
      q: `${a} + ${b} = ?`,
      ans: c,
      cands: typicke([
        { v: a + bt * 10, why: `Přičetl jsi jen desítky čísla ${b}, jednotky ${bu} jsi vynechal.` },
        { v: a + bu, why: `Přičetl jsi jen jednotky čísla ${b}, desítky (${bt * 10}) jsi vynechal.` },
      ], [
        { v: c + 1, why: `O jednu víc — sečti znovu jednotky ${au} + ${bu}.` },
        { v: c - 1, why: `O jednu méně — sečti znovu jednotky ${au} + ${bu}.` },
        { v: c + 10, why: `O desítku víc — sečti znovu desítky ${at} + ${bt}.` },
      ]),
      h0: `Rozlož ${b} na desítky a jednotky. Co z toho přičteš k ${a} nejdřív?`,
      h1: `${b} je ${bt * 10} + ${bu}. Přičti k ${a} nejdřív ${bt * 10} (změní se jen desítky), potom ${bu} (změní se jen jednotky). Jednotky ${au} + ${bu} desítku nepřekročí.`,
      expl: `Desítky: ${at} + ${bt} = ${at + bt}, jednotky: ${au} + ${bu} = ${au + bu}. Dohromady ${a} + ${b} = ${c}.`,
    };
  }
  const at = rnd(2, 9), bt = rnd(1, at - 1), au = rnd(2, 9), bu = rnd(1, au);
  const a = at * 10 + au, b = bt * 10 + bu, c = a - b;
  return {
    q: `${a} ${M} ${b} = ?`,
    ans: c,
    cands: typicke([
      { v: a - bt * 10, why: `Odečetl jsi jen desítky čísla ${b}, jednotky ${bu} jsi vynechal.` },
      { v: a - bu, why: `Odečetl jsi jen jednotky čísla ${b}, desítky (${bt * 10}) jsi vynechal.` },
    ], [
      { v: c + 1, why: `O jednu víc — odečti znovu jednotky ${au} ${M} ${bu}.` },
      { v: c - 1, why: `O jednu méně — odečti znovu jednotky ${au} ${M} ${bu}.` },
      { v: a + b, why: `To je ${a} + ${b}. Sečetl jsi, ale v příkladu je minus.` },
    ]),
    h0: `Rozlož ${b} na desítky a jednotky. Co z toho odečteš od ${a} nejdřív?`,
    h1: `${b} je ${bt * 10} + ${bu}. Odečti od ${a} nejdřív ${bt * 10} (změní se jen desítky), potom ${bu} (změní se jen jednotky). Jednotek je dost, přes desítku nepřecházíš.`,
    expl: `Desítky: ${at} ${M} ${bt} = ${at - bt}, jednotky: ${au} ${M} ${bu} = ${au - bu}. Dohromady ${a} ${M} ${b} = ${c}.`,
  };
}

// ── L3: dvojmístné s přechodem, chybějící číslo ──────────────────────────────

function dvojmistneSPrechodem(): Built {
  if (Math.random() < 0.5) {
    const at = rnd(1, 7), bt = rnd(1, 8 - at), au = rnd(2, 9), bu = rnd(11 - au, 9);
    const a = at * 10 + au, b = bt * 10 + bu, c = a + b;
    const step1 = a + bt * 10, fill = 10 - au, ten = step1 + fill, rest = bu - fill;
    return {
      q: `${a} + ${b} = ?`,
      ans: c,
      cands: typicke([{ v: c - 10, why: `Zapomněl jsi na přechod přes desítku: jednotky ${au} + ${bu} dají víc než deset, takže přibude jedna desítka.` }], [
        { v: step1, why: `Přičetl jsi jen desítky čísla ${b}, jednotky ${bu} chybí.` },
        { v: c + 1, why: `O jednu víc — zkontroluj jednotky ${au} + ${bu}.` },
        { v: c - 1, why: `O jednu méně — zkontroluj jednotky ${au} + ${bu}.` },
        { v: c + 10, why: `O desítku víc. Při přechodu přes desítku přibude jen jedna desítka.` },
      ]),
      h0: `Rozlož ${b} na desítky a jednotky. Přičítej je k ${a} po částech.`,
      h1: `Nejdřív přičti desítky: ${a} + ${bt * 10} je ${step1}. Pak přičti ${bu}: doplň ${step1} do ${ten} a přidej zbývající ${rest}.`,
      expl: `${a} + ${bt * 10} = ${step1}, ${step1} + ${fill} = ${ten}, ${ten} + ${rest} = ${c}. Jednotky ${au} + ${bu} přesáhly deset, proto přibyla desítka navíc.`,
    };
  }
  const at = rnd(3, 9), bt = rnd(1, at - 2), au = rnd(1, 8), bu = rnd(au + 1, 9);
  const a = at * 10 + au, b = bt * 10 + bu, c = a - b;
  const step1 = a - bt * 10, ten = step1 - au, rest = bu - au;
  return {
    q: `${a} ${M} ${b} = ?`,
    ans: c,
    cands: typicke([{ v: (at - bt) * 10 + (bu - au), why: `Odečetl jsi u jednotek menší číslici od větší (${bu} ${M} ${au}). Jednotek je ale jen ${au}, méně než ${bu} — musíš přejít přes desítku.` }], [
      { v: c + 10, why: `Zapomněl jsi, že při přechodu přes desítku jedna desítka ubude.` },
      { v: step1, why: `Odečetl jsi jen desítky čísla ${b}, jednotky ${bu} chybí.` },
      { v: c + 1, why: `O jednu víc — zkontroluj, kolik odečítáš po celé desítce ${ten}.` },
      { v: c - 1, why: `O jednu méně — zkontroluj, kolik odečítáš po celé desítce ${ten}.` },
    ]),
    h0: `Rozlož ${b} na desítky a jednotky. Odečítej je od ${a} po částech.`,
    h1: `Nejdřív odečti desítky: ${a} ${M} ${bt * 10} je ${step1}. Pak odečti ${bu}: nejdřív ${au} na celou desítku ${ten}, potom ještě ${rest}.`,
    expl: `${a} ${M} ${bt * 10} = ${step1}, ${step1} ${M} ${au} = ${ten}, ${ten} ${M} ${rest} = ${c}. Jednotek (${au}) bylo méně než ${bu}, proto jsme přešli přes desítku.`,
  };
}

/** Chybí sčítanec, menšitel nebo menšenec — úlohu je nutné obrátit (inverze). */
function chybejiciCislo(): Built | null {
  const typ = rnd(0, 2);
  if (typ === 0) {
    // ___ + b = s   → x = s − b (odčítání s přechodem)
    const xt = rnd(1, 7), bt = rnd(1, 8 - xt), xu = rnd(2, 9), bu = rnd(11 - xu, 9);
    const x = xt * 10 + xu, b = bt * 10 + bu, s = x + b;
    if (x === b) return null;
    const su = s % 10;
    const zk = (v: number) => (v + b > 100 ? `Zkouška nesedí: ${v} + ${b} dá víc než 100.` : `Zkouška: ${v} + ${b} = ${v + b}, a ne ${s}.`);
    return {
      q: `Které číslo chybí? ___ + ${b} = ${s}`,
      ans: x,
      cands: typicke([{ v: s + b, why: `Sečetl jsi ${s} + ${b}. Chybějící číslo musí být menší než ${s}, proto je potřeba odčítat.` }], [
        { v: (Math.floor(s / 10) - bt) * 10 + (bu - su), why: `U jednotek jsi odečetl menší číslici od větší. ${zk((Math.floor(s / 10) - bt) * 10 + (bu - su))}` },
        { v: x + 10, why: `Při odčítání přes desítku jsi zapomněl ubrat desítku. ${zk(x + 10)}` },
        { v: x + 1, why: `O jednu vedle. ${zk(x + 1)}` },
        { v: x - 1, why: `O jednu vedle. ${zk(x - 1)}` },
      ]),
      h0: `Které číslo po přičtení ${b} dá ${s}? Zkus úlohu obrátit na odčítání.`,
      h1: `Chybějící číslo zjistíš jako ${s} ${M} ${b}. Odečti nejdřív desítky (${bt * 10}), potom jednotky (${bu}) přes celou desítku. Nakonec udělej zkoušku sčítáním.`,
      expl: `Když ___ + ${b} = ${s}, pak chybějící číslo je ${s} ${M} ${b} = ${x}. Zkouška: ${x} + ${b} = ${s}.`,
    };
  }
  if (typ === 1) {
    // s − ___ = d   → x = s − d
    const xt = rnd(1, 7), dt = rnd(1, 8 - xt), xu = rnd(2, 9), du = rnd(11 - xu, 9);
    const x = xt * 10 + xu, d = dt * 10 + du, s = x + d;
    if (x === d) return null;
    const su = s % 10;
    const zk = (v: number) => `Zkouška: ${s} ${M} ${v} = ${s - v}, a ne ${d}.`;
    return {
      q: `Které číslo chybí? ${s} ${M} ___ = ${d}`,
      ans: x,
      cands: typicke([{ v: s + d, why: `Sečetl jsi ${s} + ${d}. Od ${s} ale nemůžeš odečíst víc, než kolik máš.` }], [
        { v: (Math.floor(s / 10) - dt) * 10 + (du - su), why: `U jednotek jsi odečetl menší číslici od větší. ${zk((Math.floor(s / 10) - dt) * 10 + (du - su))}` },
        { v: x + 10, why: `Při odčítání přes desítku jsi zapomněl ubrat desítku. ${zk(x + 10)}` },
        { v: x + 1, why: `O jednu vedle. ${zk(x + 1)}` },
        { v: x - 1, why: `O jednu vedle. ${zk(x - 1)}` },
      ]),
      h0: `Kolik musíš od ${s} odebrat, aby zbylo ${d}?`,
      h1: `Hledáš, o kolik je ${s} víc než ${d}: vypočítej ${s} ${M} ${d}. Jde to přes desítku, tak odečítej po částech. Zkouškou ověř, že ${s} ${M} tvoje číslo dá ${d}.`,
      expl: `Od ${s} odebereme tolik, o kolik je ${s} větší než ${d}: ${s} ${M} ${d} = ${x}. Zkouška: ${s} ${M} ${x} = ${d}.`,
    };
  }
  // ___ − b = d   → x = d + b (sčítání s přechodem)
  const dt = rnd(1, 7), bt = rnd(1, 8 - dt), du = rnd(2, 9), bu = rnd(11 - du, 9);
  const d = dt * 10 + du, b = bt * 10 + bu, x = d + b;
  if (d === b) return null;
  const zk = (v: number) => `Zkouška: ${v} ${M} ${b} = ${v - b}, a ne ${d}.`;
  return {
    q: `Které číslo chybí? ___ ${M} ${b} = ${d}`,
    ans: x,
    cands: typicke([{ v: Math.abs(d - b), why: `Odečetl jsi menší číslo od většího (${Math.max(d, b)} ${M} ${Math.min(d, b)}). Když od hledaného čísla odečteš ${b} a zbude ${d}, musí být hledané číslo větší než obě — sčítej.` }], [
      { v: x - 10, why: `Zapomněl jsi na přechod přes desítku, jedna desítka chybí. ${zk(x - 10)}` },
      { v: x + 1, why: `O jednu vedle. ${zk(x + 1)}` },
      { v: x - 1, why: `O jednu vedle. ${zk(x - 1)}` },
      { v: x + 10, why: `O desítku víc. ${zk(x + 10)}` },
    ]),
    h0: `Od kterého čísla odečteš ${b} a zbude ${d}? Zkus úlohu obrátit na sčítání.`,
    h1: `Hledané číslo je o ${b} větší než ${d}, takže sečti ${d} + ${b}: nejdřív desítky, pak jednotky přes celou desítku. Nakonec udělej zkoušku odčítáním.`,
    expl: `Když od hledaného čísla odečteme ${b} a zbude ${d}, muselo být ${d} + ${b} = ${x}. Zkouška: ${x} ${M} ${b} = ${d}.`,
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
    naplnit(out, seen, plusJednomistneBez, 5);
    naplnit(out, seen, minusJednomistneBez, 5);
    naplnit(out, seen, celeDesitky, 5);
  } else if (level === 2) {
    naplnit(out, seen, plusJednomistneSPrechodem, 5);
    naplnit(out, seen, minusJednomistneSPrechodem, 5);
    naplnit(out, seen, dvojmistneBez, 5);
  } else {
    naplnit(out, seen, dvojmistneSPrechodem, 8);
    naplnit(out, seen, chybejiciCislo, 7);
  }
  return shuffle(out);
}

export const SCITANIAODCITANIDO100: TopicMetadata[] = [
  {
    id: "g2-mat-scitani-odcitani-100",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-ciselny-obor-0-100-scitani-a-odcitani-do-100-bez-i-s-prechodem-desitky",
    title: "Sčítání a odčítání do 100 (bez i s přechodem desítky)",
    studentTitle: "Plus a minus do 100",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–100",
    briefDescription: "Sčítáš a odčítáš čísla do 100.",
    keywords: ["sčítání", "odčítání", "do 100", "plus", "mínus", "počítání"],
    goals: [
      "Sčítat a odčítat čísla do 100 bez přechodu přes desítku.",
      "Sčítat a odčítat čísla do 100 s přechodem přes desítku.",
      "Rychle počítat v oboru do 100.",
    ],
    boundaries: ["Pouze čísla do 100.", "Nezahrnuje násobení ani dělení."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Počítej po desítkách, pak doplň jedničky.",
      steps: [
        "Rozlož číslo na desítky a jednotky (např. 27 = 20 + 7).",
        "Přičítej nebo odečítej desítky jako první.",
        "Pak přičítej nebo odečítej jedničky.",
      ],
      commonMistake: "Zapomenutí přechodu přes desítku — zkontroluj výsledek.",
      example: "27 + 6: 27 + 3 = 30, pak 30 + 3 = 33.",
    },
  },
];
