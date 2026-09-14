// Hledá úlohy, kde správná odpověď **vyčnívá tvarem**: všechny distraktory
// začínají týmž slovem a klíč jiným. Žák ji pak vybere jako „ten jiný kus“,
// aniž by o věci cokoli věděl.
//
//   npm run check:options
//   IDS=g6-fyz-elektricky-obvod-6 npm run check:options
//   REPEATS=12 npm run check:options
//
// Proč vznikl: tahle vada se v obsahové dávce fyziky 6. ročníku objevila
// **třikrát v jedné podobě** (binární otázka, kde klíč začínal „Ne“ a tři
// distraktory „Ano“) a při prvním strojovém průchodu se ukázalo, že má i tvary,
// které oko nechytí — distraktory „Protože…“ proti klíči „Zrnkem…“ nebo
// „Tím, jak…“ proti „Dobrodružstvím…“. Dvě z nich vyrobil týž člověk hodinu
// poté, co první tři ručně opravoval. Ruční průchod na tuhle třídu nestačí,
// protože se pozná až srovnáním všech čtyř možností vedle sebe.
//
// `CONTENT_AUTHORING` to má pod pravidlem „4 různé možnosti, právě 1 správná“
// a pod zákazem binárního Ano/Ne mimo L1; tenhle skript je jen jeho měřitelná
// část.
//
// PEVNÁ ŠKÁLA SE NEPOČÍTÁ. Když má celé téma jednu a tutéž čtveřici možností
// (typicky „věta jednoduchá / souvětí ze dvou / ze tří / ze čtyř vět“) a klíč
// mezi nimi jen rotuje, pak „ta jiná“ možnost nenapovídá nic — kdo ji vybere
// pokaždé, splete se ve většině úloh. První běh takhle nahlásil 22 úloh ze
// dvou témat o souvětí a všechny byly falešné. Skript proto nález zahodí,
// jakmile se tatáž nabídka objeví v tématu i s JINÝM klíčem.
//
// Nález NENÍ důkaz chyby. Někdy je odlišný začátek klíče věcně nutný — třeba
// u otázky „Které z nich…“, kde jsou možnosti výčtem. Skript proto
// **nekončí chybou**, jen vypíše, co posoudit.
import { getAllTopics } from "@/lib/contentRegistry";
import { pad } from "@/lib/czechGrammar";

const zadane = (process.env.IDS ?? "").split(",").filter(Boolean);
const REPEATS = Number(process.env.REPEATS ?? 6);

const temata = getAllTopics().filter(
  (t) => t.generator && (zadane.length === 0 || zadane.includes(t.id)),
);

/** První slovo možnosti, bez interpunkce a velikosti písmen. */
function prvni(s: string): string {
  return s
    .split(/[\s,—–:;]/)[0]
    .toLowerCase()
    .replace(/[.!?„“"']/g, "");
}

const nalezy = new Map<string, { id: string; lvl: number; q: string; klic: string; spolecne: string; nabidka: string }>();
/** téma + otisk nabídky → všechny klíče, které se u té nabídky vyskytly. */
const skaly = new Map<string, Set<string>>();

for (const t of temata) {
  for (const lvl of [1, 2, 3]) {
    for (let run = 0; run < REPEATS; run++) {
      let ulohy;
      try {
        ulohy = t.generator!(lvl);
      } catch {
        break; // téma nemusí mít všechny úrovně
      }
      for (const u of ulohy) {
        const o = u.options ?? [];
        const klic = String(u.correctAnswer);
        // Otisk nabídky bez ohledu na zamíchání → k rozpoznání pevné škály.
        const nabidka = `${t.id}|${[...o].sort().join("")}`;
        const videne = skaly.get(nabidka) ?? new Set<string>();
        videne.add(klic);
        skaly.set(nabidka, videne);
        const jine = o.filter((x) => x !== klic).map(prvni);
        // Jen plné čtyřmožnostní úlohy: u tří možností je shoda dvou začátků
        // ještě náhoda, u tří je to už vzorec.
        if (jine.length < 3) continue;
        // Jedno- a dvouznaková funkční slova („v“, „na“, „je“, „do“) se opakují
        // i v úplně zdravé nabídce a dítěti nenapovědí nic. Signál dávají až
        // slova od tří znaků — spojky („protože“, „aby“) a zájmena („tím“, „obě“).
        // Práh 4 znaky byl první pokus a vyfiltroval doložený nález „tím“ proti
        // „dobrodružstvím“, takže je nastavený na 3.
        if (jine[0].length < 3) continue;
        if (new Set(jine).size !== 1) continue;
        if (jine[0] === prvni(klic)) continue;
        nalezy.set(`${t.id}|${lvl}|${u.question}`, {
          id: t.id,
          lvl,
          q: u.question,
          klic,
          spolecne: jine[0],
          nabidka,
        });
      }
    }
  }
}

// Pevná škála: tatáž nabídka se v tématu objevila s víc klíči → cue nic neříká.
const skutecne = [...nalezy.values()].filter((n) => (skaly.get(n.nabidka)?.size ?? 1) === 1);
const zahozeno = nalezy.size - skutecne.length;

for (const n of skutecne) {
  console.log(`\n[${n.id}] L${n.lvl} · distraktory začínají „${n.spolecne}“`);
  console.log(`   Q:    ${n.q.slice(0, 90)}`);
  console.log(`   KLÍČ: ${n.klic.slice(0, 90)}`);
}

console.log(`
K posouzení: ${pad(skutecne.length, "ÚLOHA")}, kde klíč začíná jiným slovem než všechny distraktory.`
  + ` Jako pevná škála zahozeno: ${zahozeno}.`
  + ` Nález není důkaz chyby — u výčtových otázek bývá odlišný začátek v pořádku.`
  + ` (REPEATS=${REPEATS}, témat ${temata.length})`);
