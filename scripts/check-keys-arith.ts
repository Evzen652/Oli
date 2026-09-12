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

type Vysledek = { ok: number; spatne: string[]; nepokryto: string[] };

/** „5 897" → „5897": mezera mezi číslicemi je oddělovač tisíců, ne konec čísla. */
function sloucCisla(s: string): string {
  return s.replace(/(\d)\p{White_Space}+(?=\d)/gu, "$1");
}

/** Odpovědi, které nejsou jedno číslo — dělení se zbytkem, porovnání, řazení. */
function spocitejText(q: string): string | null {
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
        const textem = spocitejText(task.question);
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
        const klic = Number(String(task.correctAnswer).replace(/[^\d-]/g, ""));
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
