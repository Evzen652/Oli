import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { isAre, pad } from "@/lib/czechGrammar";
import { ciselnaUloha, fmt, pick, rnd, sada } from "./_mat";

// Přepsáno 2026-09-12 (inventura obsahu). Předchozí verze měla nápovědy ze
// šablon, které nesly jen část dat úlohy (jen stranu čtverce, jen počet v řadě),
// takže se malá nápověda opakovala až 20× a u inverzních úloh L3 byl klíč
// podřetězcem zadání („5 cm" v „25 cm²").
//
// Teď každá úloha nese vlastní nápovědy složené ze VŠECH svých čísel, takže se
// neopakují, a `overeno()` zahodí každou instanci, kde by klíč prosákl do
// nápovědy nebo do znění otázky.
//
// L1 rozpoznání vzorce (počet čtverečků v síti, obsah obdélníku a čtverce)
// · L2 aplikace na složený obrazec (vystřižený roh, dvě části, přírůstek)
// · L3 transfer a inverze (převody jednotek obsahu, strana z obsahu, dva kroky).

const JEDN = ["cm", "dm", "m"];

// ── Pojistka proti prozrazení ────────────────────────────────────────────────
// Stejná hranice čísla jako v detektoru prozrazení (supabase/_shared/hintLeakage).

const bezInterpunkce = (s: string) => s.replace(/(?<!\d)[.,](?!\d)/g, " ").replace(/[;:!?"'„“()×]/g, " ");

function obsahujeCislo(text: string, cislo: string): boolean {
  return new RegExp(`(^|[^\\d.,])${cislo.replace(".", "\\.")}([^\\d.,]|$)`).test(bezInterpunkce(text));
}

/** Číselné jádro klíče — jen tvary, které detektor prozrazení hlídá (číslo, číslo s jednotkou). */
function jadro(key: string): string | null {
  if (/^-?\d+(?:[.,]\d+)?$/.test(key)) return key;
  return key.match(/^(-?\d+(?:[.,]\d+)?)\s+\p{L}[\p{L}\s/²³°]*$/u)?.[1] ?? null;
}

/** Pustí dál jen úlohu, jejíž klíč není ve znění otázky ani v nápovědách. */
function overeno(t: PracticeTask | null): PracticeTask | null {
  if (!t) return null;
  const key = String(t.correctAnswer);
  if (t.question.toLowerCase().includes(key.toLowerCase())) return null;
  const cislo = jadro(key);
  if (cislo && !obsahujeCislo(t.question, cislo) && (t.hints ?? []).some((h) => obsahujeCislo(h, cislo))) return null;
  return t;
}

// ── L1 · rozpoznání vzorce ───────────────────────────────────────────────────

function sit(): PracticeTask | null {
  const r = rnd(2, 9), s = rnd(3, 12);
  if (r === s) return null;
  return overeno(ciselnaUloha(
    `Obdélník ve čtvercové síti má ${pad(r, "ŘÁDEK")} a v každém řádku ${pad(s, "ČTVEREČEK")}. Kolik čtverečků zabírá celkem?`,
    r * s,
    [
      { value: r + s, why: `Počet řádků a počet čtverečků v řádku se sečetl. Každý řádek ale přidá celých ${pad(s, "ČTVEREČEK")}, ne jeden.` },
      { value: 2 * (r + s), why: "Takhle vyjde obvod, tedy délka čáry kolem obrazce. Obsah je počet čtverečků uvnitř, i těch prostředních." },
      { value: r * s - s, why: `Jeden řádek vypadl z počítání — řádků je ${r}, ne ${r - 1}.` },
      { value: r * s + s, why: `Jeden řádek se připočítal navíc — řádků je ${r}, ne ${r + 1}.` },
    ],
    [
      `Ve čtvercové síti ${isAre(r)} ${pad(r, "ŘÁDEK")} a každý z nich pokrývá stejný počet čtverečků — ${pad(s, "ČTVEREČEK")}. Sčítat řádky jeden po druhém by trvalo dlouho. Která operace to zkrátí?`,
      `Obsah ve čtvercové síti je počet všech čtverečků, které obrazec pokrývá. Když jsou řádky stejně dlouhé, nemusíš je sčítat jeden po druhém: stačí vzít počet čtverečků v jednom řádku a tolikrát ho zopakovat, kolik je řádků, tedy vynásobit. Přesně takhle se počítá i obsah obdélníku — délka × šířka.`,
    ],
    [
      `Jeden řádek pokrývá ${pad(s, "ČTVEREČEK")}, celkem ${isAre(r)} ${pad(r, "ŘÁDEK")}.`,
      `Opakované sčítání nahradí násobení: ${r} × ${s} = ${r * s}.`,
      `Obrazec zabírá ${pad(r * s, "ČTVEREČEK")}.`,
    ],
  ));
}

function obdelnik(): PracticeTask | null {
  const a = rnd(3, 15), b = rnd(2, 12), u = pick(JEDN);
  if (a === b) return null;
  const S = (n: number) => `${fmt(n)} ${u}²`;
  return overeno(ciselnaUloha(
    `Obdélník má strany ${a} ${u} a ${b} ${u}. Jaký má obsah?`,
    S(a * b),
    [
      { value: S(2 * (a + b)), why: `${fmt(2 * (a + b))} je obvod — délka čáry kolem obdélníku. Obsah je plocha uvnitř, a ta se počítá násobením stran.` },
      { value: S(a + b), why: `Strany se sečetly. Součet ${a} + ${b} říká, jak jsou dlouhé dohromady, ne kolik čtverečků obdélník pokryje.` },
      { value: `${fmt(a * b)} ${u}`, why: `Číslo je spočítané správně, ale jednotka ne: počítají se čtverečky ${u} × ${u}, takže obsah patří do ${u}², ne do ${u}.` },
      { value: S(a * (b + 1)), why: `Zkouška: ${a} × ${b} = ${a * b}, kdežto ${a} × ${b + 1} = ${a * (b + 1)}.` },
    ],
    [
      `Podél strany ${a} ${u} leží v jedné řadě čtverečky 1 ${u} × 1 ${u}. Kolik takových řad nad sebou vytvoří strana ${b} ${u} — a jak z toho dostaneš počet všech čtverečků?`,
      `Obsah obdélníku = délka × šířka. Pokrýt obdélník ${a} ${u} × ${b} ${u} čtverečky o straně 1 ${u} znamená složit několik stejně dlouhých řad nad sebe, a proto se rozměry násobí, ne sčítají. Výsledek patří do čtverečních jednotek (${u}²), protože počítáš čtverečky, ne délku. Součet stran by dal obvod — to je délka okraje, ne plocha uvnitř.`,
    ],
    [
      `Jedna řada podél strany ${a} ${u} má ${pad(a, "ČTVEREČEK")}.`,
      `Takových řad je tolik, kolik měří druhá strana: ${b}.`,
      `${a} × ${b} = ${a * b}, obsah je tedy ${S(a * b)}.`,
    ],
  ));
}

function ctverec(): PracticeTask | null {
  const a = rnd(3, 15), u = pick(JEDN);
  const S = (n: number) => `${fmt(n)} ${u}²`;
  return overeno(ciselnaUloha(
    `Čtverec má stranu ${a} ${u}. Jaký má obsah?`,
    S(a * a),
    [
      { value: S(4 * a), why: `${fmt(4 * a)} je obvod čtverce (4 × strana), tedy délka celého okraje. Obsah je plocha uvnitř.` },
      { value: S(2 * a), why: `Strana se vynásobila dvěma. Čtverec se stranou ${a} ${u} má ale ${a} řad po ${a} čtverečcích, ne dvě řady.` },
      { value: `${fmt(a * a)} ${u}`, why: `Číslo je správně, jednotka ne: obsah se měří ve čtverečních jednotkách ${u}², protože se počítají čtverečky 1 ${u} × 1 ${u}.` },
      { value: S((a + 1) * (a + 1)), why: `To je obsah čtverce se stranou ${a + 1} ${u}. Zadaná strana měří ${a} ${u}.` },
    ],
    [
      `Čtverec se stranou ${a} ${u} si v duchu rozděl na čtverečky 1 ${u} × 1 ${u}. Kolik jich je v jedné řadě a kolik takových řad nad sebou vznikne, když jsou všechny strany stejně dlouhé?`,
      `Čtverec má všechny strany stejné, takže obsah = strana × strana a obě čísla jsou ${a}. Výsledek patří do ${u}², protože se počítají čtverečky, ne délka. Pozor na záměnu s obvodem: ten je 4 × strana a udává délku okraje, ne plochu uvnitř.`,
    ],
    [
      `Čtverec se stranou ${a} ${u} má ${a} řad po ${a} čtverečcích.`,
      `${a} × ${a} = ${a * a}`,
      `Obsah je ${S(a * a)}.`,
    ],
  ));
}

// ── L2 · aplikace na složený obrazec ─────────────────────────────────────────

function vystrizeny(): PracticeTask | null {
  const a = rnd(6, 15), b = rnd(5, 12), c = rnd(2, Math.min(a, b) - 2);
  const S = (n: number) => `${fmt(n)} cm²`;
  const v = a * b - c * c;
  return overeno(ciselnaUloha(
    `Z obdélníku ${a} cm × ${b} cm vystřihneme v rohu čtverec se stranou ${c} cm. Jaký obsah má zbytek?`,
    S(v),
    [
      { value: S(a * b), why: `${fmt(a * b)} cm² je obsah celého obdélníku před vystřižením. Vystřižený čtverec se od něj musí odečíst.` },
      { value: S(a * b + c * c), why: "Obsah čtverce se přičetl. Vystřižením ale plocha ubude, takže se odečítá." },
      { value: S(a * b - 4 * c), why: `Odečetl se obvod čtverce (4 × ${c} = ${4 * c}). Ubyla ale plocha, tedy obsah ${c} × ${c}.` },
      { value: S(a * b - c), why: `Odečetla se jen délka strany ${c} cm. Z obdélníku ale zmizel celý čtvereček ${c} cm × ${c} cm.` },
    ],
    [
      `Spočítej si dvě plochy zvlášť: celý obdélník ${a} cm × ${b} cm a vystřižený čtverec se stranou ${c} cm. Co se s druhou z nich stane, když se z obrazce vystřihne?`,
      `Obsah složeného obrazce se počítá po částech. Nejdřív obsah celého obdélníku ${a} cm × ${b} cm (délka × šířka), pak obsah vystřiženého čtverce (strana × strana, obě ${c} cm). Protože čtverec z obrazce zmizel, jeho obsah od obsahu obdélníku odečti. Odečítá se plocha, kterou čtverec zabíral, ne délka jeho strany ani jeho obvod.`,
    ],
    [
      `Celý obdélník: ${a} × ${b} = ${a * b}`,
      `Vystřižený čtverec: ${c} × ${c} = ${c * c}`,
      `Zbytek: ${a * b} − ${c * c} = ${v}, tedy ${S(v)}.`,
    ],
  ));
}

function dvaObdelniky(): PracticeTask | null {
  const a = rnd(3, 10), b = rnd(2, 8), c = rnd(2, 8), d = rnd(2, 8);
  if (a * b === c * d) return null;
  const S = (n: number) => `${fmt(n)} cm²`;
  const v = a * b + c * d;
  return overeno(ciselnaUloha(
    `Obrazec se skládá ze dvou obdélníků, které se dotýkají: první má strany ${a} cm a ${b} cm, druhý ${c} cm a ${d} cm. Jaký je obsah celého obrazce?`,
    S(v),
    [
      { value: S((a + c) * (b + d)), why: "Rozměry obou obdélníků se sečetly a teprve pak vynásobily, jako by šlo o jeden velký obdélník. Takový obdélník ale obrazec netvoří." },
      { value: S(a + b + c + d), why: `Sečetly se všechny čtyři rozměry. Součet ${a} + ${b} + ${c} + ${d} mluví o délkách stran, ne o ploše.` },
      { value: S(a * b), why: `To je obsah jen prvního obdélníku. Druhý (${c} cm × ${d} cm) je potřeba přičíst.` },
      { value: S(c * d), why: `To je obsah jen druhého obdélníku. První (${a} cm × ${b} cm) je potřeba přičíst.` },
    ],
    [
      `Obrazec rozděl na dvě části a každou spočítej zvlášť: obdélník ${a} cm × ${b} cm a obdélník ${c} cm × ${d} cm. Co pak uděláš s oběma výsledky?`,
      `Obsah složeného obrazce = součet obsahů jeho částí. Spočítej obsah prvního obdélníku (${a} cm × ${b} cm) a obsah druhého (${c} cm × ${d} cm), každý jako délka × šířka, a teprve tyhle dva obsahy sečti. Sčítat rozměry a až pak násobit nejde — vznikl by obdélník, který v obrazci vůbec není.`,
    ],
    [
      `První obdélník: ${a} × ${b} = ${a * b}`,
      `Druhý obdélník: ${c} × ${d} = ${c * d}`,
      `Obsahy se sečtou: ${a * b} + ${c * d} = ${v}, tedy ${S(v)}.`,
    ],
  ));
}

function prirustek(): PracticeTask | null {
  const a = rnd(4, 12), b = rnd(2, 9), c = rnd(2, 6);
  if (a === b || b === c) return null;
  const S = (n: number) => `${fmt(n)} cm²`;
  return overeno(ciselnaUloha(
    `Obdélník má strany ${a} cm a ${b} cm. Stranu dlouhou ${a} cm prodloužíme o ${c} cm, druhá strana zůstane stejná. O kolik se zvětší obsah?`,
    S(b * c),
    [
      { value: S((a + c) * b), why: `${fmt((a + c) * b)} cm² je obsah celého zvětšeného obdélníku. Otázka se ptá jen na to, o kolik obsah narostl.` },
      { value: S(a * b), why: `${fmt(a * b)} cm² je obsah původního obdélníku. Přírůstek je ta část, která k němu teprve přibyla.` },
      { value: S(a * c), why: `Přidaných ${c} cm se vynásobilo prodlužovanou stranou. Nový pruh je ale dlouhý tolik, kolik měří strana, která se nezměnila.` },
      { value: S(c), why: `${c} cm je jen délka, o kterou se strana prodloužila. Přírůstek obsahu je celý pruh, ne jeho šířka.` },
    ],
    [
      `Prodloužením o ${c} cm přibude k obdélníku ${a} cm × ${b} cm nový pruh. Jak je ten pruh široký a která strana obdélníku zůstala beze změny?`,
      `Přírůstek je sám obdélník: jedna jeho strana je přidaných ${c} cm, druhá je ta strana, která se nezměnila. Jeho obsah spočítáš jako délka × šířka. Nemusíš tedy počítat obsah nového obdélníku a odečítat od něj starý — obojí vyjde stejně, ale přes přidaný pruh je to na jeden krok.`,
    ],
    [
      `Přidaný pruh je obdélník: jedna strana ${c} cm, druhá ${b} cm.`,
      `${b} × ${c} = ${b * c}`,
      `Obsah se zvětší o ${S(b * c)}. (Kontrola: ${(a + c) * b} − ${a * b} = ${b * c}.)`,
    ],
  ));
}

// ── L3 · transfer a inverze ──────────────────────────────────────────────────

interface Prevod {
  velka: string;
  mala: string;
  /** Kolik menších jednotek je ve větší. */
  f: number;
  malaGen: string;
  velkaGen: string;
  /** 2. pád j. č. větší jednotky do nápovědy. */
  velka2: string;
  /** Převodní číslo u DÉLKY — typická chyba. */
  delkove: number;
  pravidlo: string;
}

const PREVODY: Prevod[] = [
  {
    velka: "m²", mala: "dm²", f: 100, malaGen: "čtverečních decimetrů", velkaGen: "čtverečních metrů",
    velka2: "jednoho čtverečního metru", delkove: 10,
    pravidlo: "Čtverec se stranou 1 m má stranu dlouhou 10 dm, takže se do něj vejde deset řad po deseti čtverečcích 1 dm × 1 dm.",
  },
  {
    velka: "dm²", mala: "cm²", f: 100, malaGen: "čtverečních centimetrů", velkaGen: "čtverečních decimetrů",
    velka2: "jednoho čtverečního decimetru", delkove: 10,
    pravidlo: "Čtverec se stranou 1 dm má stranu dlouhou 10 cm, takže se do něj vejde deset řad po deseti čtverečcích 1 cm × 1 cm.",
  },
  {
    velka: "m²", mala: "cm²", f: 10000, malaGen: "čtverečních centimetrů", velkaGen: "čtverečních metrů",
    velka2: "jednoho čtverečního metru", delkove: 100,
    pravidlo: "Čtverec se stranou 1 m má stranu dlouhou 100 cm, takže se do něj vejde sto řad po stu čtverečcích 1 cm × 1 cm.",
  },
  {
    velka: "ha", mala: "m²", f: 10000, malaGen: "čtverečních metrů", velkaGen: "hektarů",
    velka2: "jednoho hektaru", delkove: 100,
    pravidlo: "Hektar je čtverec se stranou 100 m, takže se do něj vejde sto řad po stu čtverečcích 1 m × 1 m.",
  },
  {
    velka: "km²", mala: "ha", f: 100, malaGen: "hektarů", velkaGen: "čtverečních kilometrů",
    velka2: "jednoho čtverečního kilometru", delkove: 10,
    pravidlo: "Čtverec se stranou 1 km má stranu dlouhou 1000 m, a to je deset hektarových čtverců vedle sebe, takže se do něj vejde deset řad po deseti hektarech.",
  },
];

function prevodNaMensi(): PracticeTask | null {
  const p = pick(PREVODY);
  const x = rnd(2, 40);
  return overeno(ciselnaUloha(
    `Kolik ${p.malaGen} je ${fmt(x)} ${p.velka}?`,
    `${fmt(x * p.f)} ${p.mala}`,
    [
      { value: `${fmt(x * p.delkove)} ${p.mala}`, why: `Převádělo se jako délka (${p.delkove}× místo ${fmt(p.f)}×). U obsahu je převodní číslo druhou mocninou toho délkového.` },
      { value: `${fmt(x)} ${p.mala}`, why: "Jednotka se jen přepsala a číslo zůstalo. Menší jednotka se ale do stejné plochy vejde vícekrát, takže číslo musí vzrůst." },
      { value: `${fmt(x * p.f * 10)} ${p.mala}`, why: `Převodní číslo je o řád větší, než má být: do ${p.velka2} se vejde ${fmt(p.f)} ${p.mala}, ne ${fmt(p.f * 10)}.` },
    ],
    [
      `Nejdřív si ujasni, kolik ${p.malaGen} se vejde do ${p.velka2}. Tím číslem pak ${fmt(x)} ${p.velka} vynásob — na menší jednotku vyjde vždycky číslo větší.`,
      `${p.pravidlo} Převodní číslo u obsahu je proto druhou mocninou toho, které platí pro délku. Když převádíš na menší jednotku, počet dílků roste, takže se násobí; opačným směrem, na větší jednotku, se stejným číslem dělí.`,
    ],
    [
      `Do ${p.velka2} se vejde ${fmt(p.f)} ${p.mala}.`,
      `Na menší jednotku se násobí: ${fmt(x)} × ${fmt(p.f)} = ${fmt(x * p.f)}.`,
      `Výsledek: ${fmt(x * p.f)} ${p.mala}.`,
    ],
  ));
}

function prevodNaVetsi(): PracticeTask | null {
  const p = pick(PREVODY);
  const k = rnd(2, 40);
  const y = k * p.f;
  return overeno(ciselnaUloha(
    `Kolik ${p.velkaGen} je ${fmt(y)} ${p.mala}?`,
    `${fmt(k)} ${p.velka}`,
    [
      { value: `${fmt(k * p.delkove)} ${p.velka}`, why: `Dělilo se jako u délky (${p.delkove}× místo ${fmt(p.f)}×). U obsahu se dělí druhou mocninou délkového převodního čísla.` },
      { value: `${fmt(y)} ${p.velka}`, why: "Jednotka se jen přepsala a číslo zůstalo. Větší jednotka se do stejné plochy vejde méněkrát, takže číslo musí klesnout." },
      { value: `${fmt(k * 10)} ${p.velka}`, why: `Dělilo se číslem o řád menším: do ${p.velka2} se vejde ${fmt(p.f)} ${p.mala}, ne ${fmt(p.f / 10)}.` },
    ],
    [
      `Nejdřív si ujasni, kolik ${p.malaGen} se vejde do ${p.velka2}. Tím číslem pak ${fmt(y)} ${p.mala} vyděl — na větší jednotku vyjde vždycky číslo menší.`,
      `${p.pravidlo} Převodní číslo u obsahu je proto druhou mocninou toho, které platí pro délku. Když převádíš na větší jednotku, vejde se jich do plochy méně, takže se dělí; opačným směrem, na menší jednotku, by se stejným číslem násobilo.`,
    ],
    [
      `Do ${p.velka2} se vejde ${fmt(p.f)} ${p.mala}.`,
      `Na větší jednotku se dělí: ${fmt(y)} : ${fmt(p.f)} = ${fmt(k)}.`,
      `Výsledek: ${fmt(k)} ${p.velka}.`,
    ],
  ));
}

function dvaKroky(): PracticeTask | null {
  const a = rnd(2, 9), b = rnd(2, 9);
  if (a === b) return null;
  const S = a * b;
  return overeno(ciselnaUloha(
    `Obdélník má strany ${a} dm a ${b} dm. Kolik čtverečních centimetrů měří jeho obsah?`,
    `${fmt(S * 100)} cm²`,
    [
      { value: `${fmt(S)} cm²`, why: `${fmt(S)} je obsah ve čtverečních decimetrech. Zbývá ho ještě převést na čtvereční centimetry.` },
      { value: `${fmt(S * 10)} cm²`, why: "Převádělo se jako délka (10× místo 100×). Do jednoho čtverečního decimetru se vejde deset řad po deseti čtverečcích." },
      { value: `${fmt(2 * (a + b) * 100)} cm²`, why: `Místo obsahu se počítal obvod (2 × (${a} + ${b}) = ${2 * (a + b)}) a ten se pak převedl. Obsah vzniká násobením stran.` },
    ],
    [
      `Úloha má dva kroky. Nejdřív spočítej obsah ze stran ${a} dm a ${b} dm — v jakých jednotkách ti vyjde? Teprve ten výsledek převeď na čtvereční centimetry.`,
      `Obsah obdélníku ${a} dm × ${b} dm vyjde ve čtverečních decimetrech, protože jsou v nich zadané obě strany. Čtvereční decimetr je čtverec 1 dm × 1 dm, a ten má stranu dlouhou 10 cm — vejde se do něj deset řad po deseti čtverečcích 1 cm × 1 cm. Druhý krok je proto násobení stem, ne deseti.`,
    ],
    [
      `Obsah: ${a} × ${b} = ${S}, tedy ${fmt(S)} dm².`,
      `1 dm² = 100 cm², na menší jednotku se násobí.`,
      `${fmt(S)} × 100 = ${fmt(S * 100)}, obsah je ${fmt(S * 100)} cm².`,
    ],
  ));
}

function stranaCtverce(): PracticeTask | null {
  const s = rnd(3, 12);
  return overeno(ciselnaUloha(
    `Čtverec má obsah ${s * s} cm². Jak dlouhá je jeho strana?`,
    `${s} cm`,
    [
      { value: `${s * s} cm`, why: `${s * s} je obsah, ne délka strany. Strana je číslo, které dá po vynásobení samo sebou právě ${s * s}.` },
      { value: `${2 * s} cm`, why: `Zkouška: ${2 * s} × ${2 * s} = ${4 * s * s}, a to není ${s * s}.` },
      { value: `${s + 1} cm`, why: `Zkouška: ${s + 1} × ${s + 1} = ${(s + 1) * (s + 1)}, a to není ${s * s}.` },
      { value: `${s * s - 1} cm`, why: `Zkouška: ${s * s - 1} × ${s * s - 1} je mnohem víc než ${s * s}.` },
    ],
    [
      `Obsah ${s * s} cm² vznikl tak, že se strana vynásobila sama sebou. Hledáš tedy číslo, které tenhle součin dá — zkus projít násobilku stejných činitelů.`,
      `Obsah čtverce = strana × strana, takže tady jde o opačný postup než obvykle: ze součinu hledáš činitel. Projdi násobilku stejných činitelů po řadě a najdi ten, jehož součin je ${s * s}. Dělení čtyřmi by vedlo k obvodu, ne k obsahu, a dělení dvěma neodpovídá ničemu — obsah nevznikl sčítáním, ale násobením.`,
    ],
    [
      `Obsah čtverce = strana × strana.`,
      `Hledá se číslo, které vynásobené samo sebou dá ${s * s}.`,
      `${s} × ${s} = ${s * s}, strana měří ${s} cm.`,
    ],
  ));
}

function druhaStrana(): PracticeTask | null {
  const a = rnd(3, 15), b = rnd(3, 15);
  if (a === b) return null;
  const S = a * b;
  return overeno(ciselnaUloha(
    `Obdélník má obsah ${S} cm² a jedna jeho strana měří ${a} cm. Jak dlouhá je druhá strana?`,
    `${b} cm`,
    [
      { value: `${S - a} cm`, why: `Strana se od obsahu odečetla. Obsah ${S} cm² ale vznikl násobením, takže se z něj zpátky dostaneš dělením.` },
      { value: `${S} cm`, why: `${S} je celý obsah. Aby z něj vyšla druhá strana, musí se ještě vydělit známou stranou ${a} cm.` },
      { value: `${b + 1} cm`, why: `Zkouška: ${a} × ${b + 1} = ${a * (b + 1)}, a to není ${S}.` },
      { value: `${b + 2} cm`, why: `Zkouška: ${a} × ${b + 2} = ${a * (b + 2)}, a to není ${S}.` },
    ],
    [
      `Obsah ${S} cm² vznikl vynásobením obou stran a jednu z nich (${a} cm) znáš. Kterou operací se od součinu vrátíš k druhému činiteli?`,
      `Obsah obdélníku = délka × šířka. Když znáš obsah a jednu stranu, druhou najdeš dělením: obsah ${S} cm² vyděl známou stranou. Odečítání by tu nefungovalo, protože obsah nevznikl sčítáním — k opačné operaci k násobení patří dělení. Zkoušku uděláš tak, že obě strany zase vynásobíš a musí ti vyjít zadaný obsah.`,
    ],
    [
      `Obsah = délka × šířka, takže druhá strana = obsah : známá strana.`,
      `${S} : ${a} = ${b}`,
      `Zkouška: ${a} × ${b} = ${S} ✓`,
    ],
  ));
}

function gen(level: number): PracticeTask[] {
  if (level === 1) {
    const t = [sit, obdelnik, ctverec];
    return sada(30, (i) => t[i % 3]());
  }
  if (level === 2) {
    const t = [vystrizeny, dvaObdelniky, prirustek];
    return sada(30, (i) => t[i % 3]());
  }
  const t = [prevodNaMensi, prevodNaVetsi, dvaKroky, stranaCtverce, druhaStrana];
  return sada(30, (i) => t[i % 5]());
}

export const OBSAHOBRAZCEVECTVERCOVESITIJEDNOTKYOBSAHU: TopicMetadata[] = [
  {
    id: "g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-obsah-obrazce-ve-ctvercove-siti-jednotky-obsahu",
    rvpNodeId: "g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-obsah-obrazce-ve-ctvercove-siti-jednotky-obsahu",
    title: "Obsah obrazce ve čtvercové síti, jednotky obsahu",
    studentTitle: "Obsah tvaru",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Konstrukce a obsah",
    briefDescription: "Zjistíš obsah obrazce ve čtvercové síti a jednotky obsahu.",
    keywords: ["obsah", "čtvercová síť", "plocha", "cm²", "m²", "km²", "převody jednotek"],
    goals: [
      "Zjistit obsah obrazce ve čtvercové síti počítáním čtverečků",
      "Vypočítat obsah obdélníku a čtverce",
      "Znát jednotky obsahu: cm², m², km²",
      "Převádět mezi jednotkami obsahu",
    ],
    boundaries: ["Bez obsahu trojúhelníku vzorcem", "Bez obsahu kruhu"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Obsah = počet čtverečků ve čtvercové síti. Pro obdélník: obsah = délka × šířka. Jednotky: 1 m² = 10 000 cm², 1 km² = 1 000 000 m².",
      steps: [
        "Spočítej, kolik čtverečků obrazec pokrývá.",
        "Každý čtvereček má obsah = 1 jednotka² (cm², m², ...).",
        "Pro obdélník: obsah = délka × šířka.",
        "Nezapomeň na správnou jednotku (cm², m², km²).",
      ],
      commonMistake: "Chyba: záměna obvodu (délka okraje) a obsahu (plocha uvnitř). Obsah je v čtvercových jednotkách (cm²).",
      example: "Obdélník 4 × 3 čtverečky: obsah = 4 × 3 = 12 čtverečků = 12 cm² (pokud je 1 čtvereček = 1 cm²).",
    },
  },
];
