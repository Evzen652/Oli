import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { plural, pad, isAre } from "@/lib/czechGrammar";
import { choice, pick, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (inventura obsahu): dřív měly všechny úlohy stejné dvě
// nápovědy a žádnou zpětnou vazbu k možnostem; distraktory byly výsledek ±5/10.
// Teď má každý typ příběhu vlastní chybový model (zapomenutý druhý krok,
// prohozená operace, sečtení místo násobení…) a nápovědy i vysvětlení počítají
// s čísly konkrétní úlohy. Úrovně jsou oddělené typy příběhů:
// L1 dva kroky se sčítáním a odčítáním (do 100, v pořadí děje) ·
// L2 násobení nebo dělení + sčítání/odčítání ·
// L3 transfer: počítání odzadu, porovnání „o … víc", tři operace, dělení zbytku.

interface Uloha {
  q: string;
  a: number;
  /** Zápis výpočtu pro zpětnou vazbu u náhradních distraktorů (±10). */
  calc: string;
  h0: string;
  h1: string;
  e: string;
  d: Distractor[];
}

const rnd = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const KRAT: Record<number, string> = { 2: "dvakrát", 3: "třikrát", 4: "čtyřikrát", 5: "pětkrát" };

// ── L1: dva kroky, sčítání a odčítání ──────────────────────────────────────

function autobus(): Uloha {
  const a = rnd(20, 60), b = rnd(3, 19), c = rnd(3, 19);
  const x = a - b + c;
  const cest = (n: number) => plural(n, "cestující", "cestující", "cestujících");
  const vystoupilo = plural(b, "vystoupil", "vystoupili", "vystoupilo");
  return {
    q: `V autobusu ${plural(a, "jel", "jeli", "jelo")} ${a} ${cest(a)}. Na zastávce jich ${b} ${vystoupilo} a ${c} ${plural(c, "nastoupil", "nastoupili", "nastoupilo")}. Kolik cestujících jede dál?`,
    a: x,
    calc: `${a} − ${b} + ${c}`,
    h0: `Nejdřív zjisti, kolik cestujících zůstalo, když jich z ${a} ${vystoupilo} ${b}. Nastupující (${c}) přidáš až potom.`,
    h1: `Nejdřív od ${a} odečti ${b}, protože ti, kdo vystoupili, už v autobusu nejsou. Potom k mezivýsledku přičti ${c}, protože tolik cestujících nastoupilo a v autobusu jich přibylo.`,
    e: `Nejdřív odečteme ty, kdo vystoupili: ${a} − ${b} = ${a - b}. Pak přičteme ty, kdo nastoupili: ${a - b} + ${c} = ${x}. Proto v autobusu teď ${plural(x, "jede", "jedou", "jede")} ${x} ${cest(x)}.`,
    d: [
      { value: String(a - b), why: `${a - b} je jen počet po vystoupení — zapomněl jsi přičíst ty, kdo nastoupili (${c}).` },
      { value: String(a - b - c), why: `Odečetl jsi i cestující, kteří nastoupili — ti v autobusu přibyli, takže se přičítají.` },
      { value: String(a + b + c), why: "Všechna čísla jsi sečetl. Cestující, kteří vystoupili, se ale odečítají." },
      { value: String(a + b - c), why: "Operace jsi prohodil: kdo vystoupil, toho odečteš a kdo nastoupil, toho přičteš." },
    ],
  };
}

function knihovna(): Uloha {
  const a = rnd(25, 70), b = rnd(5, 20), c = rnd(5, 25);
  const x = a + b - c;
  const knih = (n: number) => plural(n, "kniha", "knihy", "knih");
  return {
    q: `Na poličce ${plural(a, "stála", "stály", "stálo")} ${a} ${knih(a)}. ${plural(b, "Přibyla", "Přibyly", "Přibylo")} ${b} ${knih(b)} a děti si ${c} půjčily. Kolik knih zůstalo na poličce?`,
    a: x,
    calc: `${a} + ${b} − ${c}`,
    h0: `Nejdřív spočítej, kolik knih bylo na poličce, když k ${a} přibylo ${b}. Půjčené knihy (${c}) odečteš až potom.`,
    h1: `Nejdřív sečti ${a} a ${b} — tolik knih stálo na poličce, když nové knihy přibyly. Potom od mezivýsledku odečti ${c}, protože půjčené knihy si děti z poličky odnesly.`,
    e: `Nejdřív přičteme knihy, které přibyly: ${a} + ${b} = ${a + b}. Pak odečteme půjčené: ${a + b} − ${c} = ${x}. Na poličce teď stojí ${x} ${knih(x)}.`,
    d: [
      { value: String(a + b), why: `${a + b} je počet knih před půjčováním — ještě odečti ${c} půjčených.` },
      { value: String(a + b + c), why: "Půjčené knihy jsi přičetl, ale z poličky ubyly." },
      { value: String(a - b + c), why: "Operace jsi prohodil: knihy, které přibyly, se přičítají a půjčené se odečítají." },
      { value: String(a - b - c), why: "Knihy, které na poličku přibyly, jsi odečetl, ale ty se přičítají." },
    ],
  };
}

function penezenka(): Uloha {
  const a = rnd(50, 99), b = rnd(8, 30), c = rnd(10, 40);
  const x = a - b - c;
  return {
    q: `Eva měla ${a} Kč. Koupila sešit za ${b} Kč a pastelky za ${c} Kč. Kolik korun jí zbylo?`,
    a: x,
    calc: `${a} − ${b} − ${c}`,
    h0: `Eva měla ${a} Kč a platila dvakrát: za sešit ${b} Kč a za pastelky ${c} Kč.`,
    h1: `Můžeš odečítat postupně: od ${a} Kč odečti ${b} Kč a z toho, co zbude, odečti ještě ${c} Kč. Nebo nejdřív sečti obě ceny a teprve jejich součet odečti od ${a} Kč.`,
    e: `Od ${a} Kč odečteme cenu sešitu: ${a} − ${b} = ${a - b} Kč. Pak cenu pastelek: ${a - b} − ${c} = ${x} Kč. Každý nákup peníze ubral, proto oba odečítáme.`,
    d: [
      { value: String(a - b), why: `${a - b} Kč Evě zbylo jen po koupi sešitu — ještě odečti pastelky za ${c} Kč.` },
      { value: String(b + c), why: `${b + c} Kč je, kolik Eva utratila, ne kolik jí zbylo.` },
      { value: String(a - b + c), why: "Cenu pastelek jsi přičetl, ale za pastelky Eva platila, takže peníze ubyly." },
      { value: String(a - c), why: `Odečetl jsi jen pastelky — zapomněl jsi na sešit za ${b} Kč.` },
    ],
  };
}

function tulipany(): Uloha {
  const a = rnd(10, 50), b = rnd(3, 20), c = rnd(3, 20);
  const x = a + b + c;
  const tul = (n: number) => plural(n, "tulipán", "tulipány", "tulipánů");
  return {
    q: `Na zahradě ${plural(a, "kvetl", "kvetly", "kvetlo")} ${a} ${tul(a)}. Ráno ${plural(b, "rozkvetl", "rozkvetly", "rozkvetlo")} ${plural(b, "další", "další", "dalších")} ${b} a večer ještě ${c}. Kolik tulipánů teď kvete?`,
    a: x,
    calc: `${a} + ${b} + ${c}`,
    h0: `Tulipánů přibylo dvakrát: ráno ${b} a večer ${c}. Oboje připočítej k ${a}.`,
    h1: `Nejdřív k ${a} přičti ${b} (to jsou ranní tulipány). Potom k mezivýsledku přičti ${c} (večerní). Zkontroluj, že výsledek je větší než ${a}, protože tulipánů jen přibývalo.`,
    e: `${a} + ${b} = ${a + b} a ${a + b} + ${c} = ${x}. Oba dny tulipánů přibývalo, proto obě čísla přičítáme. Teď ${plural(x, "kvete", "kvetou", "kvete")} ${x} ${tul(x)}.`,
    d: [
      { value: String(a + b), why: `Zapomněl jsi na ${c} ${tul(c)}, které rozkvetly večer.` },
      { value: String(a + c), why: `Zapomněl jsi na ${b} ${tul(b)}, které rozkvetly ráno.` },
      { value: String(b + c), why: `To jsou jen nově rozkvetlé tulipány — přičti i ${a}, které kvetly od začátku.` },
    ],
  };
}

// ── L2: násobení / dělení + sčítání / odčítání ─────────────────────────────

const ZBOZI = [
  { tvary: ["rohlík", "rohlíky", "rohlíků"], cena: [2, 5], pocet: [4, 9] },
  { tvary: ["sešit", "sešity", "sešitů"], cena: [9, 19], pocet: [3, 6] },
  { tvary: ["lízátko", "lízátka", "lízátek"], cena: [4, 9], pocet: [3, 8] },
  { tvary: ["jogurt", "jogurty", "jogurtů"], cena: [11, 18], pocet: [2, 5] },
] as const;
const BANKOVKY = [
  { h: 50, sedm: "padesátikorunou", nom: "Padesátikoruna" },
  { h: 100, sedm: "stokorunou", nom: "Stokoruna" },
  { h: 200, sedm: "dvousetkorunou", nom: "Dvousetkoruna" },
];

function nakup(): Uloha {
  const z = pick([...ZBOZI]);
  const n = rnd(z.pocet[0], z.pocet[1]), p = rnd(z.cena[0], z.cena[1]);
  const cena = n * p;
  const bank = BANKOVKY.find((b) => b.h > cena)!;
  const x = bank.h - cena;
  const zb = plural(n, z.tvary[0], z.tvary[1], z.tvary[2]);
  return {
    q: `Maminka koupila ${n} ${zb} po ${p} Kč a platila ${bank.sedm}. Kolik korun jí prodavačka vrátila?`,
    a: x,
    calc: `${bank.h} − ${n} × ${p}`,
    h0: `Nejdřív zjisti cenu nákupu: ${n} ${zb} po ${p} Kč. ${bank.nom} má hodnotu ${bank.h} Kč.`,
    h1: `Nejdřív vynásob ${n} × ${p} — to je cena celého nákupu. Potom tuto cenu odečti od ${bank.h} Kč, protože tolik maminka prodavačce dala. Rozdíl je to, co jí vrátili.`,
    e: `Nákup stál ${n} × ${p} = ${cena} Kč. Maminka zaplatila ${bank.h} Kč, takže jí vrátili ${bank.h} − ${cena} = ${x} Kč.`,
    d: [
      { value: String(cena), why: `${cena} Kč stál celý nákup — to není, kolik vrátili. Odečti to ještě od ${bank.h} Kč.` },
      { value: String(bank.h - n - p), why: `Počet a cenu jsi sečetl (${n} + ${p}), ale cena nákupu je ${n} × ${p}.` },
      { value: String(bank.h - p), why: `Odečetl jsi cenu jen jednoho kusu — maminka jich koupila ${n}.` },
    ],
  };
}

function kino(): Uloha {
  const r = rnd(4, 9), m = rnd(6, 12);
  const celkem = r * m;
  const o = rnd(5, celkem - 3);
  const x = celkem - o;
  const rady = plural(r, "řada", "řady", "řad");
  return {
    q: `V kinosále ${isAre(r)} ${r} ${rady} po ${m} sedadlech. Diváci obsadili ${o} ${plural(o, "sedadlo", "sedadla", "sedadel")}. Kolik sedadel zůstalo volných?`,
    a: x,
    calc: `${r} × ${m} − ${o}`,
    h0: `Kolik sedadel má celý sál, když ${isAre(r)} v něm ${r} ${rady} a v každé ${m} sedadel? Obsazená (${o}) řeš až potom.`,
    h1: `Nejdřív vynásob počet řad a počet sedadel v jedné řadě (${r} × ${m}) — to jsou všechna sedadla. Potom od toho odečti ${o} ${plural(o, "obsazené", "obsazená", "obsazených")}, zbudou volná sedadla.`,
    e: `Celý sál má ${r} × ${m} = ${celkem} sedadel. Obsazených je ${o}, takže volných zůstalo ${celkem} − ${o} = ${x}.`,
    d: [
      { value: String(celkem), why: `${celkem} je počet všech sedadel v sále — ještě odečti obsazená.` },
      { value: String(celkem + o), why: "Obsazená sedadla jsi přičetl, ale ta volná nejsou — odečítají se." },
      { value: String((r - 1) * m - o), why: `Počítal jsi o jednu řadu méně: v sále ${isAre(r)} ${r} ${rady}, ne ${r - 1}.` },
      { value: String(r * (m - 1) - o), why: `Počítal jsi v každé řadě o jedno sedadlo méně: v řadě je ${m} sedadel.` },
    ],
  };
}

function pastelky(): Uloha {
  const s = rnd(2, 9), q = rnd(3, 9), d = rnd(2, 6);
  const c = s * q;
  const x = q + d;
  const past = (n: number) => plural(n, "pastelka", "pastelky", "pastelek");
  return {
    q: `Učitelka rozdělila ${c} pastelek rovným dílem do ${s} krabiček. Do jedné přidala ${d}. Kolik pastelek v ní je?`,
    a: x,
    calc: `${c} ÷ ${s} + ${d}`,
    h0: `Kolik pastelek připadne do jedné krabičky, když ${c} rozdělíš do ${s} stejných hromádek? Přidané (${d}) započítej až potom.`,
    h1: `Nejdřív vyděl ${c} ÷ ${s} — tolik pastelek je v každé krabičce. Potom k tomu přičti ${d}, protože do té jedné krabičky ještě přibyly. Ostatní krabičky tě nezajímají.`,
    e: `V každé krabičce ${isAre(q)} ${c} ÷ ${s} = ${q} ${past(q)} (zkouška: ${s} × ${q} = ${c}). Do jedné pak přibyly další, takže v ní ${isAre(x)} ${q} + ${d} = ${x} ${past(x)}.`,
    d: [
      { value: String(q), why: `${q} je počet pastelek v krabičce před přidáním — ještě přičti ${d}.` },
      { value: String(q - d), why: "Přidané pastelky jsi odečetl, ale do krabičky přibyly." },
      { value: String(x + 1), why: `Zkontroluj dělení: ${s} × ${q + 1} = ${s * (q + 1)}, ne ${c}.` },
      { value: String(c + d), why: `Přičetl jsi ${d} ke všem ${c} pastelkám — ptáme se ale jen na jednu krabičku.` },
    ],
  };
}

function sesity(): Uloha {
  const n = rnd(3, 8), p = rnd(6, 15), q = rnd(10, 35);
  const cena = n * p;
  const x = cena + q;
  return {
    q: `Jana si koupila ${n} ${plural(n, "sešit", "sešity", "sešitů")} po ${p} Kč a jedno pravítko za ${q} Kč. Kolik korun zaplatila celkem?`,
    a: x,
    calc: `${n} × ${p} + ${q}`,
    h0: `Nejdřív spočítej, kolik stály sešity: ${n} ${plural(n, "kus", "kusy", "kusů")} po ${p} Kč. Pravítko za ${q} Kč přidáš potom.`,
    h1: `Nejdřív vynásob ${n} × ${p} — to je cena všech sešitů. Potom přičti ${q} Kč za pravítko. Pravítko je jen jedno, proto jeho cenu nenásobíš.`,
    e: `Sešity stály ${n} × ${p} = ${cena} Kč. S pravítkem dohromady ${cena} + ${q} = ${x} Kč.`,
    d: [
      { value: String(cena), why: `${cena} Kč stály jen sešity — přičti ještě pravítko za ${q} Kč.` },
      { value: String(n + p + q), why: `Všechna čísla jsi sečetl. Cena ${p} Kč platí pro každý z ${n} sešitů, proto se násobí.` },
      { value: String(n * (p + q)), why: `Pravítko jsi započítal ${n}krát, ale Jana koupila jen jedno.` },
      { value: String(p + q), why: `To je cena jednoho sešitu a pravítka — sešitů je ale ${n}.` },
    ],
  };
}

function kulicky(): Uloha {
  const a = rnd(3, 12), k = rnd(2, 5);
  const j = k * a;
  const x = a + j;
  const kul = (n: number) => plural(n, "kuličku", "kuličky", "kuliček");
  return {
    q: `Tomáš má ${a} ${kul(a)}. Jirka jich má ${KRAT[k]} víc než Tomáš. Kolik kuliček mají oba chlapci dohromady?`,
    a: x,
    calc: `${a} + ${k} × ${a}`,
    h0: `Nejdřív zjisti, kolik kuliček má Jirka: ${KRAT[k]} víc než Tomášových ${a}.`,
    h1: `„${cap(KRAT[k])} víc" znamená vynásobit, takže nejdřív spočítej ${k} × ${a} — tolik kuliček má Jirka. Potom přičti Tomášovy kuličky, protože se ptáme na oba chlapce dohromady.`,
    e: `Jirka má ${KRAT[k]} víc, tedy ${k} × ${a} = ${j} ${kul(j)}. Oba dohromady mají ${a} + ${j} = ${x} ${kul(x)}.`,
    d: [
      { value: String(j), why: `${j} kuliček má jen Jirka — přičti ještě Tomášovy.` },
      { value: String(2 * a + k), why: `„${cap(KRAT[k])} víc" neznamená „o ${k} víc" — tady se násobí.` },
      { value: String(j - a), why: "To je, o kolik má Jirka víc než Tomáš, ne kolik mají dohromady." },
      { value: String(a + k), why: `Sečetl jsi ${a} a ${k}, ale „${KRAT[k]} víc" znamená násobit.` },
    ],
  };
}

// ── L3: transfer — odzadu, porovnání, tři operace, dělení zbytku ──────────

function odzadu(): Uloha | null {
  const start = rnd(15, 60), b = rnd(5, 20), c = rnd(5, 20);
  if (b === c) return null;
  const r = start + b - c;
  if (r < 5) return null;
  const bon = (n: number) => plural(n, "bonbon", "bonbony", "bonbonů");
  return {
    // r ≥ 5, takže „zbylo jich" je vždy ve tvaru pro 5 a víc.
    q: `Petr přisypal do sklenice ${b} ${bon(b)} a ${c} snědl. Zbylo jich ${r}. Kolik bonbonů bylo ve sklenici původně?`,
    a: start,
    calc: `${r} + ${c} − ${b}`,
    h0: `Počítej odzadu: začni od čísla ${r} (tolik je ve sklenici teď) a vracej, co Petr udělal — ${c} snědl, ${b} přisypal.`,
    h1: `Vracej kroky v opačném pořadí a s opačnou operací. Snědené bonbony (${c}) do sklenice v duchu vrať — přičti je. Přisypané (${b}) tam na začátku ještě nebyly — odečti je. Nakonec udělej zkoušku popředu.`,
    e: `Kdyby Petr bonbony nesnědl, bylo by jich ${r} + ${c} = ${r + c}. Kdyby žádné nepřisypal, bylo by jich ${r + c} − ${b} = ${start}. Zkouška: ${start} + ${b} − ${c} = ${r}.`,
    d: [
      { value: String(r + b - c), why: "Operace jsi nevrátil: když počítáš odzadu, přisypané bonbony odečítáš a snědené přičítáš." },
      { value: String(r + c), why: `Vrátil jsi jen snědené bonbony — ještě odečti ${b} přisypaných.` },
      { value: String(r - b - c), why: `Snědené bonbony na začátku ve sklenici ještě byly, takže ${c} se přičítá, ne odečítá.` },
      { value: String(r + b + c), why: `Přisypané bonbony do sklenice přibyly, takže na začátku jich bylo méně — ${b} se odečítá.` },
    ],
  };
}

function babicka(): Uloha {
  const s = rnd(3, 6), q = rnd(3, 9), z = rnd(1, s - 1);
  const rozdala = s * q;
  const x = rozdala + z;
  const jab = (n: number) => plural(n, "jablko", "jablka", "jablek");
  const vnoucat = plural(s, "vnouče", "vnoučata", "vnoučat");
  const zbyla = plural(z, "jablko, které zbylo", "jablka, která zbyla", "jablka, která zbyla");
  return {
    q: `Babička rozdělila jablka mezi ${s} ${vnoucat}. Každé dostalo ${q} ${jab(q)} a ${z} jí ${plural(z, "zbylo", "zbyla", "zbylo")}. Kolik jablek měla babička?`,
    a: x,
    calc: `${s} × ${q} + ${z}`,
    h0: `Nejdřív spočítej, kolik jablek babička rozdala: ${s}krát po ${q}. Zbylá jablka (${z}) přidáš potom.`,
    h1: `Nejdřív vynásob ${s} × ${q} — tolik jablek dostala vnoučata dohromady. Potom přičti ${z}, protože i ${zbyla}, babička na začátku měla. Počítáš vlastně odzadu.`,
    e: `Vnoučata dostala dohromady ${s} × ${q} = ${rozdala} ${jab(rozdala)}. Když přičteme i ${zbyla}, babička měla ${rozdala} + ${z} = ${x} ${jab(x)}.`,
    d: [
      { value: String(rozdala), why: "Zapomněl jsi na jablka, která babičce zbyla — i ta na začátku měla." },
      { value: String(rozdala - z), why: "Zbylá jablka se neodečítají — babička je na začátku také měla, takže se přičítají." },
      { value: String(s + q + z), why: "Čísla jsi jen sečetl. Každé vnouče dostalo stejně, proto se počet vnoučat a počet jablek pro jedno vnouče násobí." },
      { value: String(s * (q + z)), why: "Zbylá jablka jsi započítal každému vnoučeti — zbyla ale jen jednou." },
    ],
  };
}

function sberPapiru(): Uloha {
  const a = rnd(120, 380), b = rnd(15, 95);
  const x = 2 * a + b;
  return {
    q: `Třída 3.A nasbírala ${a} kg papíru, třída 3.B o ${b} kg víc. Kolik kilogramů nasbíraly obě třídy dohromady?`,
    a: x,
    calc: `${a} + ${a} + ${b}`,
    h0: `Nejdřív zjisti, kolik nasbírala třída 3.B: o ${b} kg víc než ${a} kg.`,
    h1: `Nejdřív k ${a} přičti ${b} — to je sběr třídy 3.B. Potom k výsledku přičti ještě ${a} kg třídy 3.A, protože se ptáme na obě třídy dohromady.`,
    e: `Třída 3.B nasbírala ${a} + ${b} = ${a + b} kg. Obě třídy dohromady ${a} + ${a + b} = ${x} kg.`,
    d: [
      { value: String(a + b), why: `${a + b} kg nasbírala jen třída 3.B — přičti ještě třídu 3.A.` },
      { value: String(2 * a - b), why: `„O ${b} kg víc" znamená přičíst, ne odečíst.` },
      { value: String(2 * a + 2 * b), why: `Rozdíl ${b} kg jsi přičetl dvakrát — navíc ho má jen třída 3.B.` },
    ],
  };
}

const DVE_NOHY = [
  { ak: ["slepici", "slepice", "slepic"], gen: "slepic", mn: "slepice" },
  { ak: ["kachnu", "kachny", "kachen"], gen: "kachen", mn: "kachny" },
  { ak: ["husu", "husy", "hus"], gen: "hus", mn: "husy" },
] as const;
const CTYRI_NOHY = [
  { ak: ["králíka", "králíky", "králíků"], gen: "králíků", mn: "králíci" },
  { ak: ["kozu", "kozy", "koz"], gen: "koz", mn: "kozy" },
  { ak: ["ovci", "ovce", "ovcí"], gen: "ovcí", mn: "ovce" },
] as const;

function nohy(): Uloha {
  const p = pick([...DVE_NOHY]), c = pick([...CTYRI_NOHY]);
  const a = rnd(3, 9), k = rnd(2, 8);
  const x = 2 * a + 4 * k;
  return {
    q: `Na statku chovají ${a} ${plural(a, p.ak[0], p.ak[1], p.ak[2])} a ${k} ${plural(k, c.ak[0], c.ak[1], c.ak[2])}. Kolik nohou mají všechna tato zvířata dohromady?`,
    a: x,
    calc: `${a} × 2 + ${k} × 4`,
    h0: `Spočítej zvlášť nohy ${a} ${p.gen} (každá má dvě) a nohy ${k} ${c.gen} (každé zvíře má čtyři).`,
    h1: `Nejdřív spočítej ${a}krát dvě nohy (${p.mn}), potom ${k}krát čtyři nohy (${c.mn}) a nakonec oba výsledky sečti. Pozor, neptáme se na počet zvířat, ale na počet nohou.`,
    e: `Nohy ${p.gen}: ${a} × 2 = ${2 * a}. Nohy ${c.gen}: ${k} × 4 = ${4 * k}. Dohromady ${2 * a} + ${4 * k} = ${x} nohou.`,
    d: [
      { value: String(a + k), why: `${a + k} je počet zvířat, ne počet nohou.` },
      { value: String(4 * (a + k)), why: `Počítal jsi všem zvířatům čtyři nohy, ale ${p.mn} mají jen dvě.` },
      { value: String(2 * (a + k)), why: `Počítal jsi všem zvířatům dvě nohy, ale ${c.mn} mají čtyři.` },
    ],
  };
}

function cteni(): Uloha {
  const d = rnd(4, 10), i = rnd(1, 4), j = rnd(2, 9);
  const p = d * i, zbyva = d * j, s = p + zbyva;
  const str = (n: number) => plural(n, "stranu", "strany", "stran");
  const dni = (n: number) => plural(n, "den", "dny", "dní");
  return {
    q: `Kniha má ${pad(s, "STRANA")}. Jana přečetla ${p} a teď čte ${d} ${str(d)} denně. Za kolik dní knihu dočte?`,
    a: j,
    calc: `(${s} − ${p}) ÷ ${d}`,
    h0: `Nejdřív zjisti, kolik stran Janě ještě zbývá: kniha má ${s}, přečetla ${p}. Pak teprve počítej po ${d} stranách.`,
    h1: `Nejdřív od ${s} odečti ${p} — to je nepřečtený zbytek. Potom zbytek vyděl číslem ${d}, protože každý den ubude ${d} ${plural(d, "strana", "strany", "stran")}. Vyjde počet dní.`,
    e: `Zbývá ${s} − ${p} = ${zbyva} stran. Po ${d} stranách denně to je ${zbyva} ÷ ${d} = ${j} ${dni(j)}. Zkouška: ${j} × ${d} = ${zbyva}.`,
    d: [
      { value: String(s / d), why: `Počítal jsi celou knihu — Jana už ale ${p} ${str(p)} přečetla.` },
      { value: String(j + 1), why: `Zkouška: za ${j + 1} ${dni(j + 1)} přečte ${d * (j + 1)} ${str(d * (j + 1))}, ale zbývá jen ${zbyva}.` },
      { value: String(j - 1), why: `Zkouška: za ${j - 1} ${dni(j - 1)} přečte jen ${d * (j - 1)} ${str(d * (j - 1))}, zbývá ale ${zbyva}.` },
      { value: String(zbyva), why: `${zbyva} je počet zbývajících stran, ne dní — ještě ho vyděl číslem ${d}.` },
    ],
  };
}

function autobusVylet(): Uloha {
  const d = rnd(12, 60), k = rnd(2, 4);
  const x = 2 * d * k;
  return {
    q: `Město je ${d} km od vesnice. Autobus tam a zpátky jezdí ${KRAT[k]} denně. Kolik kilometrů za den ujede?`,
    a: x,
    calc: `(${d} + ${d}) × ${k}`,
    h0: `Autobus jede ${KRAT[k]} tam a zpátky. Kolik kilometrů má jedna cesta tam a zpátky, když do města je ${d} km?`,
    h1: `Nejdřív sečti ${d} km tam a ${d} km zpátky — to je jedna cesta tam a zpátky. Potom tento výsledek vynásob číslem ${k}, protože autobus jede ${KRAT[k]} za den.`,
    e: `Jedna cesta tam a zpátky měří ${d} + ${d} = ${2 * d} km. Autobus ji jede ${KRAT[k]}, takže ${2 * d} × ${k} = ${x} km.`,
    d: [
      { value: String(d * k), why: "Počítal jsi jen cestu tam — autobus jede pokaždé i zpátky." },
      { value: String(2 * d), why: `To je jedna cesta tam a zpátky — autobus ji ale jede ${KRAT[k]}.` },
      { value: String(2 * d + k), why: `„${cap(KRAT[k])}" znamená násobit, ne přičíst ${k}.` },
    ],
  };
}

// ── Sestavení úlohy ────────────────────────────────────────────────────────

function sestav(u: Uloha | null): PracticeTask | null {
  if (!u || !Number.isInteger(u.a) || u.a <= 0) return null;
  const ans = String(u.a);
  // Klíč nesmí stát v zadání (dítě by ho jen opsalo).
  if (new RegExp(`(^|[^\\d])${ans}([^\\d]|$)`).test(u.q)) return null;
  const nahradni: Distractor[] = [
    { value: String(u.a + 10), why: `Přepočítej ${u.calc}: vyšlo ti o 10 víc — pozor na přechod přes desítku.` },
    { value: String(u.a - 10), why: `Přepočítej ${u.calc}: vyšlo ti o 10 méně — pozor na přechod přes desítku.` },
  ];
  const videno = new Set([ans]);
  const out: Distractor[] = [];
  for (const k of [...u.d, ...nahradni]) {
    const v = Number(k.value);
    if (!Number.isInteger(v) || v <= 0 || videno.has(k.value)) continue;
    videno.add(k.value);
    out.push(k);
    if (out.length === 3) break;
  }
  if (out.length < 3) return null;
  return choice(u.q, ans, out as [Distractor, Distractor, Distractor], {
    hints: [u.h0, u.h1],
    explanation: u.e,
  });
}

const SABLONY: Record<number, (() => Uloha | null)[]> = {
  1: [autobus, knihovna, penezenka, tulipany],
  2: [nakup, kino, pastelky, sesity, kulicky],
  3: [odzadu, babicka, sberPapiru, nohy, cteni, autobusVylet],
};

function gen(level: number): PracticeTask[] {
  const sablony = SABLONY[level] ?? SABLONY[1];
  const out: PracticeTask[] = [];
  const videno = new Set<string>();
  for (let i = 0; i < 400 && out.length < 30; i++) {
    const t = sestav(sablony[i % sablony.length]());
    if (!t || videno.has(t.question)) continue;
    videno.add(t.question);
    out.push(t);
  }
  return out;
}

export const SLOVNIULOHYSEDVEMAOPERACEMI: TopicMetadata[] = [
  {
    id: "g3-mat-slovni-ulohy-dve-operace",
    rvpNodeId: "g3-matematika-nestandardni-aplikacni-ulohy-a-problemy-slovni-a-logicke-ulohy-slovni-ulohy-se-dvema-a-vice-pocetnimi-operacemi",
    title: "Slovní úlohy se dvěma a více početními operacemi",
    studentTitle: "Příběhy s čísly",
    subject: "matematika",
    category: "Nestandardní aplikační úlohy a problémy",
    topic: "Slovní a logické úlohy",
    briefDescription: "Vyřešíš příběhové úlohy ve dvou krocích.",
    keywords: ["slovní úloha", "dva kroky", "sčítání", "odčítání", "násobení", "praktická matematika"],
    goals: [
      "Rozdělit slovní úlohu na dílčí kroky.",
      "Zapsat postup řešení (co počítám nejdřív, co potom).",
      "Ověřit výsledek v kontextu úlohy.",
    ],
    boundaries: ["Max 2–3 operace.", "Čísla do 1000."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Přečti úlohu dvakrát. Podtrhni čísla a klíčová slova (přidali, odebrali, koupili…). Řeš krok za krokem.",
      steps: [
        "Přečti celou úlohu.",
        "Najdi všechna čísla a co znamenají.",
        "Urči, co počítáš nejdřív (1. krok).",
        "Z výsledku 1. kroku spočítej 2. krok.",
        "Zkontroluj: dává výsledek smysl?",
      ],
      commonMistake: "Přeskočení prvního kroku a rovnou počítání jen jedné operace.",
      example: "Bylo 20 žáků. Přišlo 5 a pak 3 odešli. Krok 1: 20+5=25. Krok 2: 25−3=22.",
    },
  },
];
