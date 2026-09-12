// Nezávislá kontrola klíčů u témat s tabulkou, jízdním řádem nebo diagramem.
// Klíč se NEPŘEBÍRÁ z generátoru: skript si z textu zadání přečte řádky
// tabulky i otázku, odpověď spočítá znovu a porovná.
//
//   npx vite-node scripts/check-keys-tables.ts
//   EXTRA_IDS=g4-mat-tabulky-diagramy-4 npx vite-node scripts/check-keys-tables.ts
//
// Umí: hodnotu řádku, součet zmíněných i všech řádků, rozdíl, maximum,
// minimum, diagram s měřítkem kroužku, čas na zastávce (i se zpožděním),
// dobu jízdy v minutách, doplnění do cíle.
//
// NEumí (a musí tedy projít očima): správný TVAR slova u otázek „Kterých
// zvířat je nejvíc?" — kontroluje jen, že klíč patří k řádku s maximem,
// ne že je „tučňáků" správně vyskloňované. A složené dvoukrokové otázky
// („o kolik víc A a B dohromady než C a D dohromady") hlásí jako nepokryté.
import { getAllTopics } from "@/lib/contentRegistry";

type Radek = { label: string; hodnota: number | null; cas: number | null };

const naMinuty = (s: string): number | null => {
  const m = s.match(/^(\d{1,2}):(\d{2})$/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

const zMinut = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;

/**
 * Klíč může být „v úterý" (předložka navíc proti štítku „Úterý"), ale taky
 * „Na kole" (předložka je součástí štítku). Proto se zkouší obojí.
 */
function sedneNaStitek(klic: string, label: string): boolean {
  const varianty = [klic.trim(), klic.replace(/^(?:ve|v|na|do|od|za|k|ke|o)\s+/i, "").trim()];
  return varianty.some((v) => spolecnyZaklad(v, label) >= Math.min(4, label.length));
}

/** Společný začátek dvou slov (kvůli skloňování: „tučňáků" ~ „Tučňáci"). */
function spolecnyZaklad(a: string, b: string): number {
  const x = a.toLowerCase(), y = b.toLowerCase();
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i++;
  return i;
}

function parse(question: string): { radky: Radek[]; otazka: string; skala: number } {
  const lines = question.split("\n").map((l) => l.trim()).filter(Boolean);
  const radky: Radek[] = [];
  let otazka = "";
  for (const line of lines) {
    const m = line.match(/^•\s*(.+?):\s*(.+)$/);
    if (m) {
      const raw = m[2].trim();
      const krouzky = (raw.match(/●/g) ?? []).length;
      radky.push({
        label: m[1].trim(),
        hodnota: krouzky > 0 ? krouzky : /^\d+$/.test(raw) ? Number(raw) : null,
        cas: naMinuty(raw),
      });
    } else if (!line.startsWith("Tabulka") && !line.startsWith("Jízdní řád") && !line.startsWith("Diagram")) {
      otazka = line;
    }
  }
  const skalaM = question.match(/znamená\s+(\d+)\s/);
  const jeden = /znamená\s+(jednoho|jednu|jeden|jedno)\s/.test(question);
  return { radky, otazka, skala: skalaM ? Number(skalaM[1]) : jeden ? 1 : 1 };
}

/** Řádky, na které otázka ukazuje, v pořadí, v jakém jsou v otázce zmíněné. */
function zminene(otazka: string, radky: Radek[]): Radek[] {
  const slova = otazka.split(/[^\p{L}\p{N}.]+/u).filter((w) => w.length >= 3);
  const nalezy: { r: Radek; pozice: number }[] = [];
  for (const r of radky) {
    let nejlepsi = -1;
    slova.forEach((w, i) => {
      if (spolecnyZaklad(w, r.label) >= Math.min(4, r.label.length) && nejlepsi === -1) nejlepsi = i;
    });
    if (nejlepsi >= 0) nalezy.push({ r, pozice: nejlepsi });
  }
  return nalezy.sort((a, b) => a.pozice - b.pozice).map((x) => x.r);
}

const zadane = (process.env.EXTRA_IDS ?? process.env.IDS ?? "").split(",").filter(Boolean);
/** Bez IDS: témata, jejichž zadání obsahuje tabulku, jízdní řád nebo diagram. */
const ids = zadane.length > 0 ? zadane : getAllTopics()
  .filter((t) => t.generator && (t.generator(1) ?? []).some((x) => /^(Tabulka|Jízdní řád|Diagram)/m.test(x.question)))
  .map((t) => t.id);
const REPEATS = Number(process.env.REPEATS ?? 8);
const celkem = { ok: 0, spatne: 0, nepokryto: 0 };

for (const id of ids) {
  const t = getAllTopics().find((x) => x.id === id);
  if (!t?.generator) { console.log(`NENALEZENO ${id}`); continue; }
  let ok = 0;
  const spatne: string[] = [];
  const nepokryto: string[] = [];
  const videno = new Set<string>();

  for (const level of [1, 2, 3]) for (let r = 0; r < REPEATS; r++) for (const task of t.generator(level) ?? []) {
    if (videno.has(task.question)) continue;
    videno.add(task.question);
    const { radky, otazka, skala } = parse(task.question);
    const klic = String(task.correctAnswer).trim();
    const cisloKlice = Number(klic.replace(/[^\d]/g, ""));
    const cil = zminene(otazka, radky);
    const hodnoty = radky.map((x) => (x.hodnota ?? 0) * skala);
    const zkontroluj = (ocekavano: string | number, popis: string) => {
      if (String(ocekavano) === klic || String(ocekavano) === String(cisloKlice)) ok++;
      else spatne.push(`L${level} ${popis}: klíč „${klic}", spočítáno „${ocekavano}" · ${otazka}`);
    };

    if (radky.length === 0 || !otazka) {
      nepokryto.push(`L${level} bez rozpoznané tabulky: ${task.question.slice(0, 60)}`);
    } else if (/V kolik hodin/i.test(otazka)) {
      const zpozdeni = Number(otazka.match(/zpoždění\s+(\d+)/)?.[1] ?? task.question.match(/zpoždění\s+(\d+)/)?.[1] ?? 0);
      if (cil.length === 1 && cil[0].cas !== null) zkontroluj(`v ${zMinut(cil[0].cas + zpozdeni)}`, "čas na zastávce");
      else nepokryto.push(`L${level} ${otazka}`);
    } else if (/Kolik minut/i.test(otazka)) {
      if (cil.length === 2 && cil[0].cas !== null && cil[1].cas !== null) {
        const d = Math.abs(cil[1].cas - cil[0].cas);
        if (klic === `${d} minut` || cisloKlice === d) ok++;
        else spatne.push(`L${level} doba jízdy: klíč „${klic}", spočítáno ${d} minut · ${otazka}`);
      } else nepokryto.push(`L${level} ${otazka}`);
    } else if (/chybělo|chybí/i.test(otazka)) {
      // „Chtěla za leden a únor dohromady 100 knih. Kolik chybělo?"
      const cil2 = cil.map((x) => (x.hodnota ?? 0) * skala);
      const meta = [...otazka.matchAll(/(\d+)/g)].map((m) => Number(m[1])).pop();
      if (meta !== undefined && cil2.length >= 1) zkontroluj(meta - cil2.reduce((a, b) => a + b, 0), "doplnění do cíle");
      else nepokryto.push(`L${level} ${otazka}`);
    } else if (/dohromady.*než|než.*dohromady/i.test(otazka)) {
      nepokryto.push(`L${level} ${otazka}`); // složené dvoukrokové — na oči
    } else if (/celkem|dohromady|za všechny/i.test(otazka)) {
      // Součet JEN zmíněných řádků; když otázka nejmenuje žádný, tak všech.
      const scitance = cil.length >= 2 ? cil.map((x) => (x.hodnota ?? 0) * skala) : hodnoty;
      zkontroluj(scitance.reduce((a, b) => a + b, 0), "součet");
    } else if (/O kolik/i.test(otazka)) {
      // „V zoo přibyli 3 další lvi" — úloha mění hodnotu řádku, než se ptá.
      if (/přibyl|ubyl|přijelo|odešl|přidal/i.test(task.question)) nepokryto.push(`L${level} ${otazka}`);
      else if (cil.length === 2) zkontroluj(Math.abs((cil[0].hodnota ?? 0) * skala - (cil[1].hodnota ?? 0) * skala), "rozdíl");
      else nepokryto.push(`L${level} ${otazka}`);
    } else if (/nejvíc|nejvyšší|nejvíce/i.test(otazka)) {
      const max = radky[hodnoty.indexOf(Math.max(...hodnoty))];
      if (sedneNaStitek(klic, max.label)) ok++;
      else spatne.push(`L${level} maximum: klíč „${klic}", maximum má řádek „${max.label}" · ${otazka}`);
    } else if (/nejmenší|nejméně|nejnižší/i.test(otazka)) {
      const min = radky[hodnoty.indexOf(Math.min(...hodnoty))];
      if (sedneNaStitek(klic, min.label)) ok++;
      else spatne.push(`L${level} minimum: klíč „${klic}", minimum má řádek „${min.label}" · ${otazka}`);
    } else if (cil.length === 1) {
      zkontroluj((cil[0].hodnota ?? 0) * skala, "hodnota řádku");
    } else {
      nepokryto.push(`L${level} ${otazka}`);
    }
  }

  console.log(`\n=== ${id} ===`);
  celkem.ok += ok;
  celkem.spatne += spatne.length;
  celkem.nepokryto += nepokryto.length;
  console.log(`  ověřeno přepočtem: ${ok} · NESHODA: ${spatne.length} · nepokryto: ${nepokryto.length}`);
  for (const s of spatne.slice(0, 25)) console.log(`  ✗ ${s}`);
  if (spatne.length > 25) console.log(`  ✗ … a dalších ${spatne.length - 25}`);
  for (const s of [...new Set(nepokryto)].slice(0, 10)) console.log(`  … ${s}`);
}

console.log(
  `
SHRNUTÍ: ověřeno ${celkem.ok} klíčů · neshod ${celkem.spatne} · nepokryto ${celkem.nepokryto}`,
);
if (celkem.spatne > 0) process.exit(1);
console.log("Všechny pokryté klíče souhlasí s nezávislým přepočtem.");
