import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { plural } from "@/lib/czechGrammar";
import { fmt, rnd, shuffle } from "./_mat";

// Slovní úlohy s písemnými operacemi — 4. ročník (2026-09-30).
//
// 4. a 5. ročník neměly žádné slovní úlohy (2. a 3. ano); písemné operace byly
// čistý dril „a + b = ?". Dítě ale musí z příběhu nejdřív poznat, CO počítat.
// Úrovně: L1 jeden krok, sčítání nebo odčítání (vybrat operaci) · L2 jeden krok,
// násobení nebo dělení · L3 dva kroky / přenos (autobusy se zaokrouhlují nahoru,
// počítání odzadu, „o … víc").
//
// Distraktory jsou typické chyby a každá nese vysvětlení: prohozená operace,
// zapomenutý přenos, odčítání menší číslice od větší, neposunutý mezisoučet,
// zapomenutý druhý krok, useknutý zbytek. Počty jsou vždy aspoň 5, takže
// podstatné jméno stojí ve 2. pádě množného čísla („přišlo 1 245 diváků").

interface Chyba { v: number; why: string }
interface Uloha {
  q: string;
  a: number;
  h0: string;
  h1: string;
  steps: string[];
  e: string;
  d: Chyba[];
}

/**
 * Sčítání bez přenosu: v každém řádu se napíše jen jednotka součtu a desítka
 * se „zapomene". V nejvyšším řádu dítě napíše celý součet (5 707 + 5 329 →
 * 10 026, ne 26) — tak ta chyba na papíře opravdu vypadá.
 */
function bezPrenosu(a: number, b: number): number {
  let out = 0;
  for (let rad = 1; a > 0 || b > 0; rad *= 10, a = Math.floor(a / 10), b = Math.floor(b / 10)) {
    const s = (a % 10) + (b % 10);
    out += (a < 10 && b < 10 ? s : s % 10) * rad;
  }
  return out;
}

/** Odčítání „menší číslici od větší" v každém řádu (typická chyba při výpůjčce). */
function mensiOdVetsi(a: number, b: number): number {
  let out = 0;
  for (let rad = 1; a > 0 || b > 0; rad *= 10, a = Math.floor(a / 10), b = Math.floor(b / 10)) {
    out += Math.abs((a % 10) - (b % 10)) * rad;
  }
  return out;
}

/** Násobení dvojciferným činitelem s neposunutým druhým mezisoučtem. */
const neposunuty = (n: number, k: number) => n * (k % 10) + n * Math.floor(k / 10);

const PRENOS = "Při sčítání pod sebou se zapomněl přenos: když součet v řádu přesáhne 9, desítka se přičte k vyššímu řádu.";
const VYPUJCKA = "V některém řádu se odečetla menší číslice od větší. Když je nahoře menší číslice, musíš si půjčit 1 z vyššího řádu.";

// ── L1: jeden krok, sčítání nebo odčítání ──────────────────────────────────

function mesto(): Uloha {
  const a = rnd(8000, 60000), b = rnd(250, 4800);
  const x = a + b;
  const obyv = (n: number) => plural(n, "obyvatel", "obyvatelé", "obyvatel");
  return {
    q: `Město mělo před pěti lety ${fmt(a)} ${obyv(a)}. Od té doby jich ${plural(b, "přibyl", "přibyli", "přibylo")} ${fmt(b)}. Kolik obyvatel má město teď?`,
    a: x,
    h0: "Obyvatel od té doby přibylo, nebo ubylo? Podle toho vyber početní operaci.",
    h1: `Obyvatel přibylo, takže je teď víc než ${fmt(a)}. Sečti ${fmt(a)} a ${fmt(b)} pod sebou, jednotky pod jednotky, a nezapomeň na přenos do vyššího řádu.`,
    steps: [`Obyvatel přibylo → sčítám.`, `${fmt(a)} + ${fmt(b)} = ${fmt(x)}`],
    e: `Obyvatel přibylo, proto sčítáme: ${fmt(a)} + ${fmt(b)} = ${fmt(x)}. Město má teď ${fmt(x)} ${obyv(x)}.`,
    d: [
      { v: a - b, why: "Obyvatel přibylo, ne ubylo. Když něčeho přibude, sčítáme." },
      { v: bezPrenosu(a, b), why: PRENOS },
      { v: x + 1000, why: "Výsledek je o 1 000 větší. Zkontroluj řád tisíců, přenos se přičetl dvakrát nebo do špatného řádu." },
    ],
  };
}

function tachometr(): Uloha {
  const a = rnd(12000, 85000), ujel = rnd(640, 3900);
  const c = a + ujel;
  return {
    q: `Před dovolenou ukazoval tachometr v autě ${fmt(a)} km. Po návratu ukazoval ${fmt(c)} km. Kolik kilometrů auto o dovolené ujelo?`,
    a: ujel,
    h0: "Hledáš, o kolik se číslo na tachometru zvětšilo. Jakou operací zjistíš rozdíl dvou čísel?",
    h1: `Rozdíl zjistíš odčítáním: od většího čísla ${fmt(c)} odečti menší ${fmt(a)}. Počítej pod sebou a pozor na půjčování z vyššího řádu.`,
    steps: [`Ujetá vzdálenost = stav po návratu − stav před dovolenou.`, `${fmt(c)} − ${fmt(a)} = ${fmt(ujel)}`],
    e: `Tachometr ukazuje všechny kilometry, které auto kdy ujelo. O dovolené přibyl rozdíl obou stavů: ${fmt(c)} − ${fmt(a)} = ${fmt(ujel)} km.`,
    d: [
      { v: a + c, why: "Oba stavy tachometru se sečetly. Ujetou vzdálenost ale ukáže rozdíl, tedy odčítání." },
      { v: mensiOdVetsi(c, a), why: VYPUJCKA },
      { v: c, why: `${fmt(c)} km je stav tachometru po návratu, ne vzdálenost ujetá o dovolené.` },
    ],
  };
}

function sporeni(): Uloha {
  const cena = rnd(80, 290) * 100, ma = rnd(1200, cena - 900);
  const x = cena - ma;
  return {
    q: `Rodina šetří na nové kolo za ${fmt(cena)} Kč. Zatím má našetřeno ${fmt(ma)} Kč. Kolik korun jí ještě chybí?`,
    a: x,
    h0: `Kolo stojí ${fmt(cena)} Kč a část peněz už rodina má. Hledáš zbytek do celé ceny.`,
    h1: `Chybějící částku zjistíš odčítáním: od ceny kola ${fmt(cena)} Kč odečti to, co už je našetřeno (${fmt(ma)} Kč). Počítej pod sebou a u nul si půjčuj z vyššího řádu.`,
    steps: [`Chybí = cena − našetřeno.`, `${fmt(cena)} − ${fmt(ma)} = ${fmt(x)}`],
    e: `Chybí rozdíl mezi cenou a našetřenou částkou: ${fmt(cena)} − ${fmt(ma)} = ${fmt(x)} Kč. Zkouška: ${fmt(ma)} + ${fmt(x)} = ${fmt(cena)}.`,
    d: [
      { v: cena + ma, why: "Cena a úspory se sečetly. Kolik chybí, zjistíš odečtením úspor od ceny." },
      { v: mensiOdVetsi(cena, ma), why: VYPUJCKA },
      { v: x + 100, why: "Výsledek je o 100 větší. U nul v ceně je potřeba půjčovat z vyššího řádu, zkontroluj řád stovek." },
    ],
  };
}

function stadion(): Uloha {
  const a = rnd(3200, 18000), b = rnd(900, 6500);
  const x = a + b;
  const div = (n: number) => plural(n, "divák", "diváci", "diváků");
  return {
    q: `Na fotbalovém zápase ${plural(a, "seděl", "seděli", "sedělo")} na tribuně ${fmt(a)} ${div(a)} a ${fmt(b)} ${div(b)} ${plural(b, "stál", "stáli", "stálo")} u zábradlí. Kolik diváků bylo na zápase celkem?`,
    a: x,
    h0: "Diváci na tribuně a diváci u zábradlí jsou dvě skupiny. Jak zjistíš, kolik jich je dohromady?",
    h1: `Obě skupiny sečti: ${fmt(a)} + ${fmt(b)}. Čísla napiš pod sebe tak, aby jednotky byly pod jednotkami, a pozor na přenos.`,
    steps: [`Celkem = na tribuně + u zábradlí.`, `${fmt(a)} + ${fmt(b)} = ${fmt(x)}`],
    e: `Dohromady je to součet obou skupin: ${fmt(a)} + ${fmt(b)} = ${fmt(x)} ${div(x)}.`,
    d: [
      { v: a - b, why: "„Celkem“ znamená obě skupiny dohromady, tedy sčítání, ne rozdíl." },
      { v: bezPrenosu(a, b), why: PRENOS },
      { v: x - 1000, why: "Výsledek je o 1 000 menší. V řádu tisíců chybí přenos ze stovek." },
    ],
  };
}

function knihovna(): Uloha {
  const a = rnd(6000, 25000), b = rnd(350, 2900);
  const x = a - b;
  const knih = (n: number) => plural(n, "kniha", "knihy", "knih");
  return {
    q: `Školní knihovna měla ${fmt(a)} ${knih(a)}. Při úklidu vyřadila ${fmt(b)} starých a poškozených knih. Kolik knih jí zůstalo?`,
    a: x,
    h0: "Vyřazené knihy z knihovny odešly. Knih je teď víc, nebo méně než na začátku?",
    h1: `Knih ubylo, proto od ${fmt(a)} odečti ${fmt(b)}. Počítej pod sebou; když je nahoře menší číslice, půjč si 1 z vyššího řádu.`,
    steps: [`Knih ubylo → odčítám.`, `${fmt(a)} − ${fmt(b)} = ${fmt(x)}`],
    e: `Vyřazené knihy ubyly, proto odčítáme: ${fmt(a)} − ${fmt(b)} = ${fmt(x)}. Zkouška: ${fmt(x)} + ${fmt(b)} = ${fmt(a)}.`,
    d: [
      { v: a + b, why: "Vyřazené knihy z knihovny odešly, takže se odečítají, ne přičítají." },
      { v: mensiOdVetsi(a, b), why: VYPUJCKA },
      { v: x + 10, why: "Výsledek je o 10 větší. V řádu desítek chybí výpůjčka: když si půjčíš z desítek, ubude jich o jednu." },
    ],
  };
}

// ── L2: jeden krok, násobení nebo dělení ───────────────────────────────────

function sesity(): Uloha {
  const k = rnd(12, 48), n = rnd(15, 40);
  const x = k * n;
  return {
    q: `Škola objednala ${k} ${plural(k, "balík", "balíky", "balíků")} sešitů. V každém balíku je ${n} ${plural(n, "sešit", "sešity", "sešitů")}. Kolik sešitů škola dostane?`,
    a: x,
    h0: `Všechny balíky jsou stejné. Kolikrát se opakuje ${n} sešitů?`,
    h1: `${k}krát po ${n} sešitech je násobení ${n} · ${k}. Při násobení dvojciferným číslem napiš druhý mezisoučet o jedno místo doleva, protože násobíš desítkami.`,
    steps: [`${k} balíků po ${n} → násobím.`, `${n} · ${k % 10} = ${n * (k % 10)}`, `${n} · ${Math.floor(k / 10)}0 = ${n * Math.floor(k / 10) * 10}`, `${n * (k % 10)} + ${n * Math.floor(k / 10) * 10} = ${fmt(x)}`],
    e: `${k} stejných balíků po ${n} sešitech: ${n} · ${k} = ${fmt(x)} sešitů.`,
    d: [
      { v: k + n, why: "Počet balíků a počet sešitů v balíku se sečetly. Stejné skupiny se ale násobí." },
      { v: neposunuty(n, k), why: "Druhý mezisoučet se nepsal o místo doleva. Násobíš desítkami, proto patří o řád výš." },
      { v: x - n, why: `To je jen ${k - 1} balíků, jeden balík se nezapočítal.` },
    ],
  };
}

function zoo(): Uloha {
  const c = rnd(45, 160), k = rnd(18, 32);
  const x = c * k;
  return {
    q: `Vstupenka do zoo stojí ${c} Kč. Třída koupila ${k} ${plural(k, "vstupenku", "vstupenky", "vstupenek")}. Kolik korun zaplatila?`,
    a: x,
    h0: `Každá vstupenka stojí stejně, ${c} Kč. Kolikrát se ta cena platí?`,
    h1: `Cenu jedné vstupenky vynásob počtem vstupenek: ${c} · ${k}. Nejdřív násob jednotkami, pak desítkami a druhý mezisoučet posuň o místo doleva.`,
    steps: [`${k} vstupenek po ${c} Kč → násobím.`, `${c} · ${k} = ${fmt(x)}`],
    e: `Za ${k} vstupenek po ${c} Kč zaplatí třída ${c} · ${k} = ${fmt(x)} Kč.`,
    d: [
      { v: c + k, why: "Cena a počet vstupenek se sečetly. Když se stejná cena platí mnohokrát, násobí se." },
      { v: neposunuty(c, k), why: "Druhý mezisoučet se nepsal o místo doleva. Násobíš desítkami, proto patří o řád výš." },
      { v: x + c, why: `To je cena ${k + 1} vstupenek, o jednu víc.` },
    ],
  };
}

function bedny(): Uloha {
  const d = rnd(4, 9), q = rnd(105, 480);
  const n = d * q;
  const jab = (m: number) => plural(m, "jablko", "jablka", "jablek");
  return {
    q: `Sadař natrhal ${fmt(n)} ${jab(n)} a rozdělí je rovným dílem do ${d} ${plural(d, "bedny", "beden", "beden")}. Kolik jablek bude v každé bedně?`,
    a: q,
    h0: `Všechna jablka se rozdělí na ${d} stejných částí. Kterou operací zjistíš velikost jedné části?`,
    h1: `Rozdělit na stejné díly znamená dělit: ${fmt(n)} : ${d}. Děl pod sebou od nejvyššího řádu a u každého řádu si zapiš, kolik zbylo.`,
    steps: [`Rozděluji rovným dílem → dělím.`, `${fmt(n)} : ${d} = ${q}`, `Zkouška: ${q} · ${d} = ${fmt(n)}`],
    e: `Rozdělení na ${d} stejných dílů je dělení: ${fmt(n)} : ${d} = ${q}. Zkouška násobením: ${q} · ${d} = ${fmt(n)}.`,
    d: [
      { v: n - d, why: `Od počtu jablek se odečetl počet beden. Rozdělit rovným dílem ale znamená dělit.` },
      { v: n * d, why: "Násobením by jablek přibylo. Při rozdělování do beden se dělí." },
      { v: q + 10, why: `Výsledek je o 10 větší. Zkouška to prozradí: ${q + 10} · ${d} = ${fmt((q + 10) * d)}, a to není ${fmt(n)}.` },
    ],
  };
}

function cyklista(): Uloha {
  const n = rnd(46, 95), d = rnd(5, 9);
  const x = n * d;
  return {
    q: `Cyklista ujede každý den ${n} km. Kolik kilometrů ujede za ${d} ${plural(d, "den", "dny", "dní")}?`,
    a: x,
    h0: `Každý den ujede stejně, ${n} km. Kolikrát se to opakuje?`,
    h1: `${d} dní po ${n} km je násobení ${n} · ${d}. Vynásob nejdřív jednotky a přenos přičti k desítkám.`,
    steps: [`${d} dní po ${n} km → násobím.`, `${n} · ${d} = ${x}`],
    e: `Za ${d} dní ujede ${d}krát ${n} km: ${n} · ${d} = ${x} km.`,
    d: [
      { v: n + d, why: "Kilometry za den a počet dní se sečetly. Když se stejná vzdálenost opakuje, násobí se." },
      { v: (n % 10) * d % 10 + Math.floor(n / 10) * d * 10, why: "Z násobení jednotek se nepřenesly desítky do vyššího řádu." },
      { v: x - n, why: `To je vzdálenost za ${d - 1} dní, jeden den chybí.` },
    ],
  };
}

function kniha(): Uloha {
  const d = rnd(12, 25) , dny = rnd(6, 9);
  const n = d * dny;
  return {
    q: `Kniha má ${n} stran. Petra přečte každý den ${d} stran. Za kolik dní knihu dočte?`,
    a: dny,
    h0: `Každý den ubude ${d} stran. Kolikrát se ${d} vejde do ${n}?`,
    h1: `Kolikrát se číslo vejde do jiného, zjistíš dělením: ${n} : ${d}. Výsledek ověř násobením.`,
    steps: [`Kolikrát se ${d} vejde do ${n} → dělím.`, `${n} : ${d} = ${dny}`, `Zkouška: ${dny} · ${d} = ${n}`],
    e: `Hledáme, kolikrát se ${d} stran vejde do ${n} stran: ${n} : ${d} = ${dny} dní. Zkouška: ${dny} · ${d} = ${n}.`,
    d: [
      { v: n - d, why: `${n - d} stran zbude po prvním dni. Otázka se ale ptá na počet dní.` },
      { v: dny + 1, why: `Zkouška: ${dny + 1} · ${d} = ${(dny + 1) * d}, to je víc stran, než kniha má.` },
      { v: dny - 1, why: `Zkouška: ${dny - 1} · ${d} = ${(dny - 1) * d}, kniha by nebyla dočtená.` },
    ],
  };
}

// ── L3: dva kroky, přenos ──────────────────────────────────────────────────

function autobusy(): Uloha {
  const m = pickM(), z = rnd(90, 260), u = rnd(6, 14);
  const lidi = z + u;
  const x = Math.ceil(lidi / m);
  if (lidi % m === 0) return autobusy();
  return {
    q: `Na školní výlet jede ${z} žáků a ${u} učitelů. Do jednoho autobusu se vejde ${m} lidí. Kolik autobusů musí škola objednat?`,
    a: x,
    h0: "Autobusem jedou žáci i učitelé. Kolik lidí jede celkem a kolik jich odveze jeden autobus?",
    h1: `Nejdřív sečti žáky a učitele: ${z} + ${u}. Pak tento počet vyděl ${m}. Když dělení nevyjde beze zbytku, zbylí lidé potřebují ještě jeden autobus.`,
    steps: [`Lidí celkem: ${z} + ${u} = ${lidi}`, `${lidi} : ${m} = ${Math.floor(lidi / m)}, zbytek ${lidi % m}`, `Zbytek potřebuje další autobus → ${x}`],
    e: `Jede ${z} + ${u} = ${lidi} lidí. ${lidi} : ${m} = ${Math.floor(lidi / m)} a zbytek ${lidi % m}. Na ${lidi % m} zbylých lidí je potřeba ještě jeden autobus, proto ${x}.`,
    d: [
      { v: Math.floor(lidi / m), why: `S tímhle počtem autobusů by ${lidi % m} lidí zůstalo stát na parkovišti. Zbytek potřebuje další autobus.` },
      ...(Math.ceil(z / m) !== x ? [{ v: Math.ceil(z / m), why: "Započítali se jen žáci. Autobusem jedou i učitelé." }] : []),
      { v: x + 1, why: `S tolika autobusy by jeden jel prázdný. Pro ${lidi} lidí stačí ${x}.` },
      { v: lidi, why: `${lidi} je počet lidí, ne autobusů. Ještě je potřeba zjistit, kolikrát se do toho vejde ${m}.` },
    ],
  };
}
function pickM() { return [40, 45, 48, 50, 52][rnd(0, 4)]; }

function kino(): Uloha {
  const r = rnd(12, 24), s = rnd(15, 28);
  const mist = r * s, p = rnd(Math.floor(mist * 0.4), mist - 20);
  const x = mist - p;
  return {
    q: `Kinosál má ${r} řad a v každé řadě je ${s} sedadel. Na představení se prodalo ${p} vstupenek. Kolik míst zůstalo volných?`,
    a: x,
    h0: "Nejdřív potřebuješ vědět, kolik míst má celý sál. Teprve potom zjistíš, kolik jich je volných.",
    h1: `Počet míst v sále: ${r} řad po ${s} sedadlech, tedy ${s} · ${r}. Od tohoto počtu pak odečti ${p} prodaných vstupenek.`,
    steps: [`Míst v sále: ${s} · ${r} = ${mist}`, `Volná místa: ${mist} − ${p} = ${x}`],
    e: `Sál má ${s} · ${r} = ${mist} míst. Prodaných je ${p}, volných zůstalo ${mist} − ${p} = ${x}.`,
    d: [
      { v: mist, why: `${mist} je počet všech míst v sále. Ještě odečti ${p} prodaných.` },
      { v: mist + p, why: "Prodané vstupenky se přičetly. Prodaná místa ale nejsou volná, odečítají se." },
      { v: p, why: `${p} je počet prodaných vstupenek, tedy obsazených míst. Otázka se ptá na volná místa.` },
    ],
  };
}

function lampy(): Uloha {
  const k = rnd(3, 6), c = rnd(24, 89) * 10 + 9;
  const cena = k * c, platba = Math.ceil((cena + 1) / 1000) * 1000;
  const x = platba - cena;
  return {
    q: `Tatínek koupil ${k} ${plural(k, "stejnou lampu", "stejné lampy", "stejných lamp")} po ${c} Kč. Zaplatil ${fmt(platba)} Kč. Kolik korun mu vrátili?`,
    a: x,
    h0: "Vrátí se rozdíl mezi zaplacenou částkou a cenou nákupu. Znáš už cenu celého nákupu?",
    h1: `Nejdřív spočítej, kolik stojí všechny lampy: ${c} · ${k}. Pak tuto cenu odečti od ${fmt(platba)} Kč.`,
    steps: [`Cena nákupu: ${c} · ${k} = ${fmt(cena)}`, `Vráceno: ${fmt(platba)} − ${fmt(cena)} = ${fmt(x)}`],
    e: `${k} ${plural(k, "lampa", "lampy", "lamp")} po ${c} Kč stojí ${c} · ${k} = ${fmt(cena)} Kč. Z ${fmt(platba)} Kč se vrací ${fmt(platba)} − ${fmt(cena)} = ${fmt(x)} Kč.`,
    d: [
      { v: cena, why: `${fmt(cena)} Kč je cena nákupu. Otázka se ptá, kolik se vrátilo z ${fmt(platba)} Kč.` },
      { v: platba - c, why: "Odečetla se cena jen jedné lampy. Tatínek jich koupil víc." },
      { v: mensiOdVetsi(platba, cena), why: VYPUJCKA },
    ],
  };
}

function brambory(): Uloha {
  const p = rnd(120, 480), q = rnd(90, 360), z = rnd(150, 900);
  const x = p + q + z;
  return {
    q: `Farmář prodal ráno ${p} kg brambor a odpoledne ${q} kg. Ve skladu mu zbylo ${z} kg. Kolik kilogramů brambor měl na začátku?`,
    a: x,
    h0: "Počítej odzadu: brambory, které prodal, i ty, které zbyly, měl farmář na začátku všechny ve skladu.",
    h1: `Na začátku měl farmář to, co prodal ráno (${p} kg), co prodal odpoledne (${q} kg), i to, co mu zbylo (${z} kg). Všechny tři části sečti.`,
    steps: [`Na začátku = prodáno ráno + prodáno odpoledne + zbylo.`, `${p} + ${q} + ${z} = ${fmt(x)}`],
    e: `Všechny brambory byly na začátku ve skladu: ${p} + ${q} + ${z} = ${fmt(x)} kg. Zkouška: ${fmt(x)} − ${p} − ${q} = ${z}.`,
    d: [
      { v: p + q, why: `${p + q} kg farmář prodal. Na začátku měl ještě i těch ${z} kg, které zbyly.` },
      { v: z - q > 0 ? z + p - q : z + p, why: z - q > 0 ? "Odpolední prodej se odečetl. Když počítáš odzadu, prodané brambory se přičítají." : `Zapomněl se odpolední prodej ${q} kg.` },
      { v: p + z, why: `Chybí odpolední prodej ${q} kg.` },
    ],
  };
}

function usporyOVic(): Uloha {
  const a = rnd(850, 3900), b = rnd(250, 1800);
  const bratr = a + b, x = a + bratr;
  return {
    q: `Jana má našetřeno ${fmt(a)} Kč. Její bratr má o ${fmt(b)} Kč víc. Kolik korun mají našetřeno dohromady?`,
    a: x,
    h0: "Nejdřív zjisti, kolik má bratr. Až potom můžeš sečíst peníze obou.",
    h1: `„O ${fmt(b)} Kč víc" znamená, že bratr má ${fmt(a)} + ${fmt(b)} Kč. Tuto částku pak přičti k Janiným ${fmt(a)} Kč.`,
    steps: [`Bratr: ${fmt(a)} + ${fmt(b)} = ${fmt(bratr)}`, `Dohromady: ${fmt(a)} + ${fmt(bratr)} = ${fmt(x)}`],
    e: `Bratr má ${fmt(a)} + ${fmt(b)} = ${fmt(bratr)} Kč. Dohromady mají ${fmt(a)} + ${fmt(bratr)} = ${fmt(x)} Kč.`,
    d: [
      { v: bratr, why: `${fmt(bratr)} Kč má jen bratr. Otázka se ptá na oba dohromady.` },
      { v: a + a, why: `Počítalo se, jako by bratr měl stejně jako Jana. Má ale o ${fmt(b)} Kč víc.` },
      { v: b < a ? a + (a - b) : x + 1000, why: b < a ? "„O … víc“ se přečetlo jako „o … míň“. Bratr má víc než Jana." : "Výsledek je o 1 000 větší, v řádu tisíců je chyba." },
    ],
  };
}

const SABLONY: Record<1 | 2 | 3, (() => Uloha)[]> = {
  1: [mesto, tachometr, sporeni, stadion, knihovna],
  2: [sesity, zoo, bedny, cyklista, kniha],
  3: [autobusy, kino, lampy, brambory, usporyOVic],
};

function sestav(u: Uloha): PracticeTask | null {
  const key = fmt(u.a);
  // Klíč nesmí stát v zadání jako samostatné číslo („1 245" se čte celé).
  const cislaVZadani: string[] = u.q.match(/\d{1,3}(?:[\u00a0 ]\d{3})*/g) ?? [];
  if (cislaVZadani.includes(key)) return null;
  const seen = new Set([key]);
  const vybrane: { value: string; why: string }[] = [];
  for (const c of u.d) {
    if (!Number.isFinite(c.v) || c.v < 0 || !Number.isInteger(c.v)) continue;
    const v = fmt(c.v);
    if (seen.has(v)) continue;
    seen.add(v);
    vybrane.push({ value: v, why: c.why });
  }
  if (vybrane.length < 3) return null;
  const optionFeedback: Record<string, string> = {};
  for (const c of vybrane.slice(0, 3)) optionFeedback[c.value] = c.why;
  return {
    question: u.q,
    correctAnswer: key,
    options: shuffle([key, ...vybrane.slice(0, 3).map((c) => c.value)]),
    optionFeedback,
    hints: [u.h0, u.h1],
    solutionSteps: u.steps,
    explanation: u.e,
  };
}

function gen(level: number): PracticeTask[] {
  const lv = (level <= 1 ? 1 : level >= 3 ? 3 : 2) as 1 | 2 | 3;
  const sablony = SABLONY[lv];
  const out = new Map<string, PracticeTask>();
  // Stejný počet úloh z každé šablony, ať sezení nestřídá jen dvě.
  for (let i = 0; i < 400 && out.size < 30; i++) {
    const t = sestav(sablony[i % sablony.length]());
    if (t && !out.has(t.question)) out.set(t.question, t);
  }
  return shuffle([...out.values()]);
}

export const SLOVNI_ULOHY_PISEMNE_OPERACE: TopicMetadata[] = [
  {
    id: "g4-mat-slovni-ulohy-pisemne-operace-4",
    // RVP dataset nemá pro 4. ročník uzel se slovními úlohami (má ho 2. a 3.);
    // `rvp_data.json` je jen ke čtení. Úlohy aplikují písemné operace, proto
    // se téma řadí k jejich okruhu. `rvpNodeId` = vlastní ID, dokud uzel v datasetu\n    // nevznikne — nepředstírá, že existuje. Viz docs/PENDING_CHANGES.md (2026-09-30 D).
    rvpNodeId: "g4-mat-slovni-ulohy-pisemne-operace-4",
    title: "Slovní úlohy s písemnými operacemi",
    studentTitle: "Příběhy s velkými čísly",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Písemné početní operace",
    briefDescription: "Z příběhu poznáš, co počítat, a spočítáš to pod sebou.",
    keywords: ["slovní úlohy", "písemné sčítání", "písemné odčítání", "násobení", "dělení", "příběh"],
    goals: [
      "Z příběhu poznat, kterou početní operaci použít.",
      "Řešit jednokrokové a dvoukrokové slovní úlohy s čísly do milionu.",
      "Ověřit výsledek zkouškou a posoudit, jestli dává smysl.",
    ],
    boundaries: ["Čísla do 100 000.", "Násobení nejvýš dvojciferným činitelem, dělení jednociferným dělitelem."],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Nejdřív si řekni, co se v příběhu děje: něčeho přibývá (sčítáš), ubývá (odčítáš), opakuje se stejné množství (násobíš), nebo se dělí na stejné díly (dělíš).",
      steps: [
        "Přečti si úlohu a najdi, na co se ptá.",
        "Rozhodni, kterou operací se k odpovědi dostaneš. Někdy jsou potřeba dva kroky.",
        "Spočítej to pod sebou.",
        "Zkontroluj, jestli výsledek dává smysl (autobusů nemůže být 2,5, ubylo-li, musí být méně).",
      ],
      commonMistake: "Vzít všechna čísla z úlohy a sečíst je. Operaci určuje příběh, ne to, že v úloze stojí dvě čísla.",
      example: "V knihovně bylo 8 450 knih, 620 vyřadili. Knih ubylo → odčítám: 8 450 − 620 = 7 830.",
    },
  },
];
