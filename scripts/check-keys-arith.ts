// Nezávislá kontrola klíčů u aritmetických úloh: klíč se NEPŘEBÍRÁ
// z generátoru, ale spočítá se znovu z textu zadání. Cílem je chytit
// případ, kdy generátor počítá špatně stejně v úloze i v klíči — to
// nezávislé čtení najde jen náhodou a brána vůbec.
//
//   IDS=g3-mat-zaokrouhlovani npx vite-node scripts/check-keys-arith.ts
//   IDS=<id1,id2> REPEATS=10 npx vite-node scripts/check-keys-arith.ts
//   npm run check:keys -- (bez IDS projde všechna témata matematiky)
//
// Exit 1 = neshoda. „nepokryto vzorem" NENÍ chyba, jen zadání, na které
// skript nezná vzor — ty musí projít očima (vypíše jejich seznam).
//
// Vzniklo 2026-09-12 při kontrole dávky g3mat-a. Čtyřikrát během jednoho
// dne se přitom ukázalo, že chybu má kontrola, ne obsah (trojčlenný výraz,
// součet jen zmíněných řádků, zpoždění spoje, trojmístné číslo nezačínající
// nulou). Každý takový případ je v kódu poznamenaný — kontrola se musí
// kontrolovat stejně jako obsah, jinak se „opraví" správný klíč.
import { getAllTopics } from "@/lib/contentRegistry";

const zadane = (process.env.IDS ?? "").split(",").filter(Boolean);
const ids = zadane.length > 0
  ? zadane
  : getAllTopics().filter((t) => t.subject === "matematika" && t.generator).map((t) => t.id);
const REPEATS = Number(process.env.REPEATS ?? 6);
const pocitadlo = { spatne: 0, ok: 0, nepokryto: 0 };


/** Vyhodnotí „429 + 335 − 174" zleva doprava, násobení a dělení dřív. */
function vyhodnot(vyraz: string): number | null {
  const tokeny = vyraz.match(/\d+|[+\-×*:÷]/g);
  if (!tokeny) return null;
  const cisla: number[] = [Number(tokeny[0])];
  const operatory: string[] = [];
  for (let i = 1; i < tokeny.length; i += 2) {
    const op = tokeny[i];
    const n = Number(tokeny[i + 1]);
    if (Number.isNaN(n)) return null;
    if (op === "×" || op === "*") cisla[cisla.length - 1] *= n;
    else if (op === ":" || op === "÷") {
      if (n === 0) return null;
      cisla[cisla.length - 1] /= n;
    } else {
      operatory.push(op);
      cisla.push(n);
    }
  }
  return cisla.reduce((acc, n, i) => (i === 0 ? n : operatory[i - 1] === "-" ? acc - n : acc + n), 0);
}

/**
 * „(12,6 : 1,5) · 5,7" → 47,88. Desetinná čárka, závorky, přednost operací.
 * Doplněno 2026-09-16 pro matematiku 6. ročníku — `vyhodnot` umí jen celá
 * čísla, takže 1 442 klíčů první dávky zůstalo „nepokryto vzorem".
 * Když výraz obsahuje cokoli dalšího, vrátí null (raději nepokryto než
 * falešná neshoda).
 */
function vyhodnotDes(vyraz: string): number | null {
  const s = vyraz.replace(/−/g, "-").replace(/\s+/g, "");
  const tok = s.match(/\d+(?:,\d+)?|[+\-·×*:÷()]/g);
  if (!tok || tok.join("") !== s) return null;
  let i = 0;
  const clen = (): number | null => {
    const t = tok[i++];
    if (t === "(") {
      const v = soucet();
      return tok[i++] === ")" ? v : null;
    }
    return t !== undefined && /^\d/.test(t) ? Number(t.replace(",", ".")) : null;
  };
  const soucin = (): number | null => {
    let v = clen();
    while (v !== null && /^[·×*:÷]$/.test(tok[i] ?? "")) {
      const op = tok[i++];
      const r = clen();
      if (r === null || (/[:÷]/.test(op) && r === 0)) return null;
      v = /[:÷]/.test(op) ? v / r : v * r;
    }
    return v;
  };
  const soucet = (): number | null => {
    let v = soucin();
    while (v !== null && /^[+-]$/.test(tok[i] ?? "")) {
      const op = tok[i++];
      const r = soucin();
      if (r === null) return null;
      v = op === "-" ? v - r : v + r;
    }
    return v;
  };
  const v = soucet();
  return v !== null && i === tok.length && Number.isFinite(v) ? Math.round(v * 1e6) / 1e6 : null;
}

const nsd = (a: number, b: number): number => (b === 0 ? a : nsd(b, a % b));
const desMist = (x: string) => (x.split(",")[1] ?? "").length;

/** Prvočíselný rozklad pokusným dělením — jiná cesta než generátor. */
function rozklad(n: number): number[] {
  const out: number[] = [];
  for (let d = 2; n > 1; ) {
    if (n % d === 0) {
      out.push(d);
      n /= d;
    } else d++;
  }
  return out;
}
const jePrvocislo = (n: number) => n > 1 && rozklad(n).length === 1;

/**
 * Úlohy, u kterých se klíč nedá spočítat ze zadání samotného, jen vybrat
 * z nabídky („Které z čísel je dělitelné 5?"). Vrací všechny možnosti, které
 * podmínku splňují — správně je, když je to právě jedna a rovná se klíči.
 */
function vyhovujiciMoznosti(q: string, options: string[]): string[] | null {
  const cisti = sloucCisla(q);
  const num = (o: string) => Number(sloucCisla(o).replace(/\s/g, ""));
  if (!options.length || !options.every((o) => /^\d[\d\s]*$/.test(o.trim()))) return null;
  const podm = (f: (n: number) => boolean) => options.filter((o) => f(num(o)));
  let m: RegExpMatchArray | null;
  if ((m = cisti.match(/dělitelné číslem (\d+), ale není dělitelné číslem (\d+)/))) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    return podm((n) => n % a === 0 && n % b !== 0);
  }
  if ((m = cisti.match(/(?:je dělitelné číslem|je násobkem čísla) (\d+)/))) {
    const k = Number(m[1]);
    return podm((n) => n % k === 0);
  }
  if ((m = cisti.match(/(?:patří mezi dělitele|je dělitelem) čísla (\d+)/))) {
    const k = Number(m[1]);
    return podm((n) => n !== 0 && k % n === 0);
  }
  if ((m = cisti.match(/rozklad na součin prvočísel ([\d ·]+)\.\s*Kterým z nabízených čísel je dělitelné/))) {
    const p = m[1].split("·").reduce((acc, x) => acc * Number(x.trim()), 1);
    return podm((n) => p % n === 0);
  }
  if (/Které z (?:těchto|nabízených) čísel je prvočíslo\?/.test(cisti)) return podm(jePrvocislo);
  if (/Které z (?:těchto|nabízených) čísel je číslo složené\?/.test(cisti)) return podm((n) => n > 1 && !jePrvocislo(n));
  return null;
}

type Vysledek = { ok: number; spatne: string[]; nepokryto: string[] };

// ── Zeměpis (2026-09-19) ──────────────────────────────────────────────────
// Měřítko, časová pásma a souřadnice se počítají stejně mechanicky jako
// aritmetika, jen výsledek nese jednotku nebo světovou stranu. Proto je
// výsledek text, ne číslo — „2 cm" a „2 km" jsou dvě různé odpovědi.

/** „27,5" → 27.5 · „1 000 000" → 1000000 */
const cz = (s: string): number => Number(s.replace(/\s/g, "").replace(",", "."));
/** 4.5 → „4,5" · 15 → „15" (bez oddělovače tisíců, klíče ho u výsledků nemají) */
const fmt = (n: number): string => String(Math.round(n * 1e6) / 1e6).replace(".", ",");

/**
 * Vzdálenost ve skutečnosti z centimetrů na mapě.
 *
 * Jednotku (metry, nebo kilometry) si bere z klíče — „1 200 m" i „1,2 km" je
 * táž vzdálenost a kontrola má hlídat číslo, ne to, jak ho autor zapsal.
 * Kdyby se jednotka hádala pevným prahem, hlásila by kontrola neshodu tam,
 * kde je obsah v pořádku (osm takových falešných neshod na první běh).
 */
function zeSkutecnychCm(cm: number, klic?: string): string {
  const m = cm / 100;
  const km = klic ? /\bkm\b/.test(klic) : m >= 1000;
  return km ? `${fmt(m / 1000)} km` : `${fmt(m)} m`;
}

const CISLOVKY: Record<string, number> = { jeden: 1, jednu: 1, dva: 2, dvě: 2, tři: 3, čtyři: 4, pět: 5 };

const sirkaStr = (d: number): string =>
  d === 0 ? "0° (rovník)" : `${fmt(Math.abs(d))}° ${d < 0 ? "j. š." : "s. š."}`;
const delkaStr = (d: number): string =>
  d === 0 ? "0° (nultý poledník)" : Math.abs(d) === 180 ? "180°" : `${fmt(Math.abs(d))}° ${d < 0 ? "z. d." : "v. d."}`;

/** Zeměpisné délky ze zadání, se znaménkem: západní záporně. */
function delky(q: string): number[] {
  return [...q.matchAll(/(\d+(?:,\d+)?)°\s*(v|z)\.\s*d\./g)].map((m) => cz(m[1]) * (m[2] === "z" ? -1 : 1));
}
/** Zeměpisné šířky ze zadání, se znaménkem: jižní záporně. */
function sirky(q: string): number[] {
  return [...q.matchAll(/(\d+(?:,\d+)?)°\s*(s|j)\.\s*š\./g)].map((m) => cz(m[1]) * (m[2] === "j" ? -1 : 1));
}
/** Čas „18:00" v minutách od půlnoci. */
function casy(q: string): number[] {
  return [...q.matchAll(/(\d{1,2}):(\d{2})/g)].map((m) => Number(m[1]) * 60 + Number(m[2]));
}
const casStr = (minut: number): string => {
  const c = (((minut % 1440) + 1440) % 1440);
  return `${Math.floor(c / 60)}:${String(c % 60).padStart(2, "0")}`;
};

/**
 * Zeměpisné úlohy s vypočitatelným klíčem. Vrací klíč jako text, nebo null,
 * když vzor nezná. Rozlišení „mapa → skutečnost" a „skutečnost → mapa" stojí
 * na jednotce zadané délky: centimetry jsou na mapě, metry a kilometry ve
 * skutečnosti.
 */
function spocitejZemepis(zadani: string, klic?: string): string | null {
  // „1 100 m" je jedno číslo, ne 1 a 100 — mezera mezi číslicemi je oddělovač tisíců.
  const q = sloucCisla(zadani);
  const meritka = [...q.matchAll(/1\s*:\s*(\d[\d\s]*)/g)].map((m) => cz(m[1]));

  // „Co znamená měřítko mapy 1 : 50 000?" → „1 cm na mapě = 500 m ve skutečnosti"
  if (meritka.length === 1 && /Co (tento zápis říká|znamená)/.test(q) && !/\d+(,\d+)?\s*cm na mapě měří/.test(q)) {
    return `1 cm na mapě = ${zeSkutecnychCm(meritka[0], klic)} ve skutečnosti`;
  }

  // Dvě měřítka: tentýž úsek na druhé mapě. „1 : A měří d cm → kolik cm na 1 : B"
  const naMape = q.match(/(\d+(?:,\d+)?)\s*cm/);
  if (meritka.length === 2 && naMape) {
    return `${fmt((cz(naMape[1]) * meritka[0]) / meritka[1])} cm`;
  }

  if (meritka.length === 1) {
    // Mapa → skutečnost: v zadání je délka v centimetrech.
    if (naMape && /(ve skutečnosti|skutečná vzdálenost|skutečnosti\?)/.test(q)) {
      return zeSkutecnychCm(cz(naMape[1]) * meritka[0], klic);
    }
    // Skutečnost → mapa: v zadání je délka v metrech nebo kilometrech.
    const vePrirode = q.match(/(\d+(?:,\d+)?)\s*(km|m)\b/);
    if (vePrirode && /na mapě/.test(q)) {
      const cm = cz(vePrirode[1]) * (vePrirode[2] === "km" ? 100000 : 100);
      return `${fmt(cm / meritka[0])} cm`;
    }
  }

  // ── Časová pásma (15° = 1 hodina, na východ je později) ──
  if (/časov\w+ rozdíl\s+(\d+)\s*hodin/.test(q) && /[Kk]olik stupňů zeměpisné délky/.test(q)) {
    return `${fmt(Number(q.match(/časov\w+ rozdíl\s+(\d+)/)![1]) * 15)}°`;
  }
  const lon = delky(q);
  const t = casy(q);
  const let_ = q.match(/poletí\s+(\d+)\s*hodin/);
  if (lon.length === 2 && t.length === 1) {
    const posun = ((lon[1] - lon[0]) / 15) * 60;
    // Let: k času odletu se přičte doba letu i posun pásem.
    return casStr(t[0] + posun + (let_ ? Number(let_[1]) * 60 : 0));
  }
  if (lon.length === 1 && t.length === 2 && /[Nn]a jaké zeměpisné délce/.test(q)) {
    let rozdil = (t[1] - t[0]) / 60;
    if (rozdil > 12) rozdil -= 24;
    if (rozdil < -12) rozdil += 24;
    let cil = lon[0] + rozdil * 15;
    if (cil > 180) cil -= 360;
    if (cil < -180) cil += 360;
    return delkaStr(cil);
  }

  // ── Zeměpisná síť ──
  // „Dvě místa leží na stejném poledníku … 24° s. š., druhé 13° j. š. Kolik stupňů…"
  const lat = sirky(q);
  if (lat.length === 2 && /[Kk]olik stupňů/.test(q)) return `${fmt(Math.abs(lat[0] - lat[1]))}°`;

  // „Letadlo startuje z bodu 19° s. š., 66° v. d. … na jih. Urazí 64° zeměpisné šířky."
  // Po poledníku se mění šířka, po rovnoběžce délka — první verze téhle kontroly
  // uměla jen poledník a nahlásila 20 falešných neshod na správných klíčích.
  const urazi = q.match(/Urazí\D*(\d+)°/);
  if (urazi && lat.length === 1 && lon.length === 1) {
    const smer = /na (jih|západ)/.test(q) ? -1 : 1;
    const o = smer * Number(urazi[1]);
    if (/rovnoběžce/.test(q)) {
      let cil = lon[0] + o;
      if (cil > 180) cil -= 360;
      if (cil < -180) cil += 360;
      return `${sirkaStr(lat[0])}, ${delkaStr(cil)}`;
    }
    return `${sirkaStr(lat[0] + o)}, ${delkaStr(lon[0])}`;
  }

  // „Poledníky po 10°. Bod leží na 30° v. d. a posune se na západ o dva poledníky."
  const posunO = q.match(/nakresleny po\s+(\d+)°.*?posune se na\s+(\w+)\s+o\s+(\w+)\s+(poledník\w*|rovnoběžk\w*)/s);
  if (posunO) {
    const krok = Number(posunO[1]);
    const pocet = CISLOVKY[posunO[3]] ?? Number(posunO[3]);
    const smer = /západ|jih/.test(posunO[2]) ? -1 : 1;
    if (pocet) {
      return posunO[4].startsWith("poledník")
        ? delkaStr(lon[0] + smer * krok * pocet)
        : sirkaStr(lat[0] + smer * krok * pocet);
    }
  }

  // „Bod leží 59° jižně od rovníku a 15° západně od nultého poledníku."
  const slovy = q.match(/(\d+)°\s*(sever|již)\S*\s+od rovníku a\s+(\d+)°\s*(východ|západ)\S*\s+od (?:nultého poledníku|Greenwiche)/);
  if (slovy) {
    return `${sirkaStr(Number(slovy[1]) * (slovy[2] === "již" ? -1 : 1))}, ${delkaStr(Number(slovy[3]) * (slovy[4] === "západ" ? -1 : 1))}`;
  }

  return null;
}

/** „5 897" → „5897": mezera mezi číslicemi je oddělovač tisíců, ne konec čísla. */
function sloucCisla(s: string): string {
  return s.replace(/(\d)\p{White_Space}+(?=\d)/gu, "$1");
}

/** Odpovědi, které nejsou jedno číslo — dělení se zbytkem, porovnání, řazení. */
function spocitejText(q: string, klic?: string): string | null {
  const zemepis = spocitejZemepis(q, klic);
  if (zemepis !== null) return zemepis;

  const cisti = sloucCisla(q.replace(/−/g, "-"));

  // „35 ÷ 5 = ? (může být zbytek)" → klíč ve tvaru „7 zbytek 0"
  // Dělení, kde odpověď může mít zbytek. Klíč se píše „842 zb. 3" i
  // „7 zbytek 0", a v zadání nemusí být nic, co by zbytek ohlašovalo —
  // pozná se až podle toho, že dělení není beze zbytku.
  const deleni = cisti.match(/(\d+)\s*[:÷]\s*(\d+)\s*=\s*\?/);
  if (deleni) {
    const [a, b] = [Number(deleni[1]), Number(deleni[2])];
    if (b !== 0 && (a % b !== 0 || /zbytek|zb\./.test(cisti))) return `${Math.floor(a / b)} zbytek ${a % b}`;
  }

  const dvoji = cisti.match(/[Zz]aokrouhli\s+(?:číslo\s+)?(\d+)\s+na\s+desítky i na stovky/);
  if (dvoji) {
    const n = Number(dvoji[1]);
    return `${Math.round(n / 10) * 10} a ${Math.round(n / 100) * 100}`;
  }

  const porovnej = cisti.match(/Porovnej čísla\s+(\d+)\s+a\s+(\d+)/);
  if (porovnej) {
    const [a, b] = [Number(porovnej[1]), Number(porovnej[2])];
    return `${a} ${a < b ? "<" : a > b ? ">" : "="} ${b}`;
  }

  const seradPo = cisti.match(/Seřaď čísla od nejmenšího po největší:\s*([\d,\s]+)/);
  if (seradPo) return seradPo[1].split(",").map((x) => Number(x)).sort((x, y) => x - y).join(", ");
  const seradOd = cisti.match(/Seřaď čísla od největšího po nejmenší:\s*([\d,\s]+)/);
  if (seradOd) return seradOd[1].split(",").map((x) => Number(x)).sort((x, y) => y - x).join(", ");

  const rozloz = cisti.match(/rozklad čísla (\d+) na součin prvočísel/);
  if (rozloz) return rozklad(Number(rozloz[1])).join(" · ");

  const chybi = cisti.match(/Které číslo chybí\?\s*(\d+|___)\s*([+-])\s*(\d+|___)\s*=\s*(\d+)/);
  if (chybi) {
    const [l, op, r, res] = [chybi[1], chybi[2], chybi[3], Number(chybi[4])];
    if (l === "___") return String(op === "+" ? res - Number(r) : res + Number(r));
    if (r === "___") return String(op === "+" ? res - Number(l) : Number(l) - res);
  }
  return null;
}

/** Spočítá výsledek ze zadání, nebo vrátí null, když vzor nezná. */
function spocitej(q: string): number | null {
  const cisti = sloucCisla(q.replace(/−/g, "-"));

  const zaokr = (n: number, jednotka: string) =>
    Math.round(n / (jednotka === "desítky" ? 10 : jednotka === "stovky" ? 100 : 1000)) *
    (jednotka === "desítky" ? 10 : jednotka === "stovky" ? 100 : 1000);

  // „Zaokrouhli číslo 989 na desítky." (i varianta „na desítky i na stovky"
  // se řeší zvlášť v hlavní smyčce, protože klíč je „590 a 600")
  const zaokrouhli = cisti.match(/[Zz]aokrouhli\s+(?:číslo\s+)?(\d+)\s+na\s+(desítky|stovky|tisíce)(?!\s+i)/);
  if (zaokrouhli) return zaokr(Number(zaokrouhli[1]), zaokrouhli[2]);

  // „Odhadni součet 645 + 123: obě čísla zaokrouhli na stovky a pak počítej."
  const odhad = cisti.match(/Odhadni\s+(součet|rozdíl)\s+(\d+)\s*([+\-])\s*(\d+).*?zaokrouhli na (desítky|stovky)/);
  if (odhad) {
    const a = zaokr(Number(odhad[2]), odhad[5]);
    const b = zaokr(Number(odhad[4]), odhad[5]);
    return odhad[3] === "-" ? a - b : a + b;
  }

  // L3 transfery: rozměnění, přenos přes desítky, celé desítky, sestavení čísla
  const desetikoruny = cisti.match(/Kolik desetikorun dostaneš, když\s+(\d+)\s*Kč/);
  if (desetikoruny) return Number(desetikoruny[1]) / 10;

  const celeDesitky = cisti.match(/Kolik celých desítek obsahuje číslo\s+(\d+)/);
  if (celeDesitky) return Math.floor(Number(celeDesitky[1]) / 10);

  const celeStovky = cisti.match(/Kolik celých stovek obsahuje číslo\s+(\d+)/);
  if (celeStovky) return Math.floor(Number(celeStovky[1]) / 100);

  // „Jaké číslo má 5 stovek, 16 desítek a 8 jednotek?" — přenos přes desítku
  const jakeCislo = cisti.match(/Jaké číslo má\s+(\d+)\s+stov\S*,?\s*(\d+)\s+desít\S*\s*a\s*(\d+)\s+jednot/);
  if (jakeCislo) return Number(jakeCislo[1]) * 100 + Number(jakeCislo[2]) * 10 + Number(jakeCislo[3]);

  // „Z číslic 9, 7 a 5 sestav nejmenší/největší trojmístné číslo."
  const sestav = cisti.match(/Z číslic\s+([\d,\s a]+?)\s+sestav\s+(nejmenší|největší)/);
  if (sestav) {
    const cislice = (sestav[1].match(/\d/g) ?? []).map(Number).sort((x, y) => (sestav[2] === "nejmenší" ? x - y : y - x));
    // Trojmístné číslo nezačíná nulou: „z 4, 8, 0" je nejmenší 408, ne 048.
    // (Klíč to měl správně, spletl se skript — čtvrtá sebestřelba dneška.)
    if (sestav[2] === "nejmenší" && cislice[0] === 0) {
      const prvniNenula = cislice.findIndex((c) => c !== 0);
      if (prvniNenula > 0) [cislice[0], cislice[prvniNenula]] = [cislice[prvniNenula], cislice[0]];
    }
    return Number(cislice.join(""));
  }

  // Obvody: trojúhelník ze tří stran, čtverec ze strany, obdélník z rozměrů
  const trojuhelnik = cisti.match(/strany\s+(\d+)\s*\w*,\s*(\d+)\s*\w*\s+a\s+(\d+)/);
  if (trojuhelnik && /obvod/i.test(cisti)) {
    return Number(trojuhelnik[1]) + Number(trojuhelnik[2]) + Number(trojuhelnik[3]);
  }
  const ctverec = cisti.match(/[ČčS]tverec má stranu\s+(\d+)/);
  if (ctverec && /obvod/i.test(cisti)) return 4 * Number(ctverec[1]);
  const obdelnik = cisti.match(/dlouh[áý]\s+(\d+)\s*\w*\s+a\s+širok[áý]\s+(\d+)/);
  if (obdelnik && /obvod/i.test(cisti)) return 2 * (Number(obdelnik[1]) + Number(obdelnik[2]));
  const obdelnikStrany = cisti.match(/[Oo]bdélník má strany\s+(\d+)\s*\w*\s+a\s+(\d+)/);
  if (obdelnikStrany && /obvod/i.test(cisti)) return 2 * (Number(obdelnikStrany[1]) + Number(obdelnikStrany[2]));

  // „Které číslo je o 10 menší než 109?"
  const oKolik = cisti.match(/Které číslo je o\s+(\d+)\s+(menší|větší) než\s+(\d+)/);
  if (oKolik) {
    const [d, směr, n] = [Number(oKolik[1]), oKolik[2], Number(oKolik[3])];
    return směr === "menší" ? n - d : n + d;
  }

  // „Která číslice v čísle 731 stojí na místě jednotek?"
  const cislice = cisti.match(/Která číslice v čísle\s+(\d+)\s+stojí na místě\s+(jednotek|desítek|stovek)/);
  if (cislice) {
    const n = cislice[1];
    const pozice = cislice[2] === "jednotek" ? 1 : cislice[2] === "desítek" ? 2 : 3;
    return Number(n[n.length - pozice]);
  }

  // „Zapiš číslem: 6 stovek, 3 desítky a 5 jednotek." (i varianta bez desítek)
  if (/Zapiš číslem/.test(cisti) && /\d/.test(cisti)) {
    const st = Number(cisti.match(/(\d+)\s+stov/)?.[1] ?? 0);
    const de = Number(cisti.match(/(\d+)\s+desít/)?.[1] ?? 0);
    const je = Number(cisti.match(/(\d+)\s+jednot/)?.[1] ?? 0);
    return st * 100 + de * 10 + je;
  }

  // Celý výraz před „= ?", vyhodnocený se správnou předností operátorů.
  // První verze tohohle skriptu brala regexem jen dvojici čísel, takže
  // u „429 + 335 − 174 = ?" spočítala 335 − 174 a nahlásila 23 falešných
  // neshod na správných klíčích. Tři takové sebestřelby za jeden den:
  // kontrola se musí kontrolovat stejně jako obsah.
  const vyraz = cisti.match(/((?:\d+\s*[+\-×*:÷]\s*)+\d+)\s*=\s*\?/);
  if (vyraz) return vyhodnot(vyraz[1]);

  const kolikJe = cisti.match(/[Kk]olik je\s+((?:\d+\s*[+\-×*:÷]\s*)+\d+)/);
  if (kolikJe) return vyhodnot(kolikJe[1]);

  // ── 6. ročník (2026-09-16) ──
  // „Kolik je 6,8 : 4?" · „Vypočítej výraz bez závorek: 6,3 + 5,1 : 3" · „Kolik vyjde (12,6 : 1,5) · 5,7?"
  const desVyraz = cisti.match(/(?:[Kk]olik je|[Kk]olik vyjde|Vypočítej (?:součin|podíl|výraz[^:]*:))\s*([\d,\s+\-−·×*:÷()]+?)\s*[?.]?\s*$/);
  if (desVyraz) {
    const v = vyhodnotDes(desVyraz[1]);
    if (v !== null) return v;
  }

  // „Kolik desetinných míst má součin 0,9 · 5,5?" — před odstraněním koncových nul
  const mista = cisti.match(/Kolik desetinných míst má součin\s+(\d+(?:,\d+)?)\s*·\s*(\d+(?:,\d+)?)/);
  if (mista) return desMist(mista[1]) + desMist(mista[2]);

  // „…aby oba podíly byly stejné: 14,4 : 0,3 = ? : 3."
  const podil = cisti.match(/podíly byly stejné:\s*([\d,?]+)\s*:\s*([\d,?]+)\s*=\s*([\d,?]+)\s*:\s*([\d,?]+)/);
  if (podil) {
    const c = podil.slice(1, 5).map((x) => (x === "?" ? null : Number(x.replace(",", "."))));
    if (c.filter((x) => x === null).length === 1) {
      const [a, b, x, y] = c;
      const r = a === null ? (b! * x!) / y! : b === null ? (a * y!) / x! : x === null ? (a * y!) / b : (b * x) / a;
      return Math.round(r * 1e6) / 1e6;
    }
  }

  // „Urči nejmenší společný násobek čísel 6 a 20." · „…trojice čísel 18, 30 a 45"
  const spolecny = cisti.match(/(nejmenší společný násobek|největší společný dělitel)(?: trojice)? čísel ([\d, a]+?)\s*[.?]/);
  if (spolecny) {
    const cisla = (spolecny[2].match(/\d+/g) ?? []).map(Number);
    if (cisla.length >= 2) {
      return spolecny[1].startsWith("největší")
        ? cisla.reduce(nsd)
        : cisla.reduce((a, b) => (a * b) / nsd(a, b));
    }
  }

  // „Jaký je největší prvočinitel čísla 333…"
  const prvocinitel = cisti.match(/největší prvočinitel čísla (\d+)/);
  if (prvocinitel) return Math.max(...rozklad(Number(prvocinitel[1])));

  // „Kterou nejmenší číslici musíš dosadit za hvězdičku v pětimístném čísle 51 *14, aby bylo dělitelné číslem 9?"
  // (zde bez sloucCisla — mezera kolem hvězdičky je součást zápisu)
  const hvezda = q.match(/Kterou (nejmenší|největší) číslici .*?dosadit za hvězdičku .*?čísle ([\d\s*]+?), aby bylo dělitelné číslem (\d+)/);
  if (hvezda) {
    const vzor = hvezda[2].replace(/\s/g, "");
    const k = Number(hvezda[3]);
    const vyhovi = [...Array(10).keys()].filter((c) => !(c === 0 && vzor.startsWith("*")) && Number(vzor.replace("*", String(c))) % k === 0);
    if (vyhovi.length) return hvezda[1] === "nejmenší" ? vyhovi[0] : vyhovi[vyhovi.length - 1];
  }

  return null;
}

for (const id of ids) {
  const t = getAllTopics().find((x) => x.id === id);
  if (!t?.generator) {
    console.log(`NENALEZENO ${id}`);
    continue;
  }
  const v: Vysledek = { ok: 0, spatne: [], nepokryto: [] };
  const videno = new Set<string>();
  for (const level of [1, 2, 3]) {
    for (let r = 0; r < REPEATS; r++) {
      for (const task of t.generator(level) ?? []) {
        if (videno.has(task.question)) continue;
        videno.add(task.question);
        const vyhovi = task.options ? vyhovujiciMoznosti(task.question, task.options.map(String)) : null;
        if (vyhovi !== null) {
          if (vyhovi.length === 1 && vyhovi[0] === String(task.correctAnswer)) v.ok++;
          else v.spatne.push(`L${level} „${task.question}" → klíč „${task.correctAnswer}", podmínku splňuje: ${vyhovi.join(" | ") || "nic"}`);
          continue;
        }
        const textem = spocitejText(task.question, String(task.correctAnswer));
        if (textem !== null) {
          const klicT = sloucCisla(String(task.correctAnswer).trim())
            .replace(/\s+/g, " ")
            .replace(/\bzb\./g, "zbytek");
          if (klicT === textem) v.ok++;
          else v.spatne.push(`L${level} „${task.question}" → klíč „${task.correctAnswer}", spočítáno „${textem}"`);
          continue;
        }
        const ocekavano = spocitej(task.question);
        if (ocekavano === null) {
          v.nepokryto.push(`L${level} ${task.question.replace(/\n/g, " ⏎ ").slice(0, 70)}`);
          continue;
        }
        // Desetinný klíč („2,35 m") se čte jako první číslo; celočíselný postaru,
        // aby se u starších ročníků nezměnilo, co se porovnává.
        const klicS = sloucCisla(String(task.correctAnswer));
        const klic = /\d,\d/.test(klicS)
          ? Number(klicS.match(/-?\d+,\d+/)![0].replace(",", "."))
          : Number(klicS.replace(/[^\d-]/g, ""));
        if (klic === ocekavano) v.ok++;
        else v.spatne.push(`L${level} „${task.question}" → klíč ${task.correctAnswer}, spočítáno ${ocekavano}`);
      }
    }
  }
  console.log(`\n=== ${id} ===`);
  pocitadlo.ok += v.ok;
  pocitadlo.spatne += v.spatne.length;
  pocitadlo.nepokryto += v.nepokryto.length;
  console.log(`  ověřeno výpočtem: ${v.ok} · NESHODA: ${v.spatne.length} · nepokryto vzorem: ${v.nepokryto.length}`);
  for (const s of v.spatne) console.log(`  ✗ ${s}`);
  const ukazka = v.nepokryto.slice(0, 6);
  for (const s of ukazka) console.log(`  … ${s}`);
  if (v.nepokryto.length > ukazka.length) console.log(`  … a dalších ${v.nepokryto.length - ukazka.length}`);
}

console.log(
  `
SHRNUTÍ: ověřeno ${pocitadlo.ok} klíčů · neshod ${pocitadlo.spatne} · nepokryto vzorem ${pocitadlo.nepokryto}`,
);
if (pocitadlo.spatne > 0) process.exit(1);
console.log("Všechny pokryté klíče souhlasí s nezávislým přepočtem.");
