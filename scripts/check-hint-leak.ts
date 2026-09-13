// Hledá malou nápovědu (hints[0]), která odpověď neprozrazuje slovem, ale
// obsahem — tedy případ, kdy dítě může úlohu vyřešit bez porozumění.
//
// Brána 0 hlídá DOSLOVNÝ výskyt klíče v nápovědě. Tohle hlídá překryv
// obsahových slov: u klíče „Posadit ho, naklonit hlavu mírně dopředu
// a stisknout měkkou část nosu" prošla nápověda „Hlavu nakláníme dopředu,
// ne dozadu, a nos jemně stiskneme" — doslovná shoda tam není žádná.
//
//   npm run check:hints            (všechna témata)
//   IDS=g2-prv-prvni-pomoc npm run check:hints
//
// Nález NENÍ důkaz chyby: nápověda typu „Porovnej dva fakty: kratší cesta
// nemá chodník, delší ho má" má vysoký překryv, a přesto je to legitimní
// strategie (rozhodnutí zůstává na dítěti). Proto skript **nekončí chybou** —
// vypíše seznam k posouzení. Otázky (s „?") se nehlásí vůbec: nápověda
// v otázce navádí, netvrdí.
//
// Vzniklo 2026-09-12 při kontrole dávky g2prv-b, kde takové nápovědy byly
// čtyři — mezi nimi u první pomoci a u cesty do školy.
//
// 2026-09-13: skript uměl porovnávat jen s `correctAnswer`, takže o typech
// `match_pairs`, `categorize`, `drag_order` a `timeline` **mlčel** — u nich je
// `correctAnswer` jen marker („match" / „categorize" / „order") a skutečné
// řešení leží v `pairs` / `categories` / `items`. Tudy prošel únik v 5. ročníku
// (696 z 1 000 úloh v 17 tématech). Měřítka pro ně jsou v
// `src/lib/hintLeakStructured.ts` a blokující verzi má
// `src/test/hint-structured-leak.test.ts`; tady se jen vypisují, ať jde report
// číst celý na jednom místě.
import { getAllTopics } from "@/lib/contentRegistry";
import { pad } from "@/lib/czechGrammar";
import {
  dvojiceVeVete,
  nejdelsiBehVPoradi,
  prirazeniVeVete,
  PRAH_KOTVY,
} from "@/lib/hintLeakStructured";

/**
 * Jednotky a slova, která o porozumění nic neříkají. Bez nich hlásil skript
 * 100 % překryv u klíčů jako „3 h 45 min": jediné obsahové slovo klíče bylo
 * „min" a nápověda „…Čísla ze zadání: 225 min." ho triviálně obsahovala.
 * To je šum, ne nález.
 */
const JEDNOTKY = new Set(["min","minut","hod","hodin","sek","sekun","cm","mm","kmh","kilom","metr","metru","gram","litr","stup","korun","rok","let","den","dnu","kus","krat"]);
const STOP = new Set(["a","i","se","si","je","to","na","do","ho","mu","ji","že","co","by","ne","ale","nebo","když","aby","pak","už","jen","ve","v","z","ze","k","ke","s","o","po","za","při","pro","the"]);
const slova = (s: string) => (s.toLowerCase().match(/\p{L}{3,}/gu) ?? []).filter((w) => !STOP.has(w)).map((w) => w.slice(0, 5));

const zadane = (process.env.IDS ?? "").split(",").filter(Boolean);
const ids = zadane.length > 0 ? zadane : getAllTopics().filter((t) => t.generator).map((t) => t.id);
let nalezu = 0;
let strukturovanych = 0;

for (const id of ids) {
  const t = getAllTopics().find((x) => x.id === id);
  if (!t?.generator) continue;
  // Dvě různá síta schválně. Překryv s klíčem stačí posoudit jednou na znění
  // otázky — u textových úloh je otázka různá, takže se tím sjednotí varianty
  // téhož. U strukturovaných typů je ale otázka **pořád stejná** („Seřaď pět
  // úseků pravěku…") a mění se jen položky s nápovědou; kdyby se dedup dělal
  // taky podle otázky, projela by se jedna úloha z tématu a zbytek by zmizel.
  // Na tomhle skript 13. 9. tiše prošel kolem úniku, který blokující test našel.
  const videnaOtazka = new Set<string>();
  const videnaNapoveda = new Set<string>();
  for (const lvl of [1, 2, 3]) for (const task of t.generator(lvl) ?? []) {
    // ── Strukturované typy: řešení není v `correctAnswer` ──────────────
    const h1 = task.hints?.[1] ?? "";
    if (h1 && !videnaNapoveda.has(`${task.question}|${h1}`)) {
      videnaNapoveda.add(`${task.question}|${h1}`);
      const vypis = (co: string, polozky: string[]) => {
        strukturovanych++;
        console.log(`
[${id}] L${lvl} · ${co}`);
        console.log(`   H1:  ${h1}`);
        console.log(`   →    ${polozky.join(" · ")}`);
      };
      const poradi = task.items ?? task.timelineEvents?.map((e) => e.label);
      if (task.pairs?.length) {
        const x = dvojiceVeVete(h1, task.pairs);
        if (x.length > PRAH_KOTVY) vypis(`spojuje ${x.length} z ${task.pairs.length} dvojic`, x);
      }
      if (poradi?.length) {
        const x = nejdelsiBehVPoradi(h1, poradi);
        if (x.length > PRAH_KOTVY + 1) vypis(`${x.length} z ${poradi.length} položek ve správném pořadí`, x);
      }
      if (task.categories?.length) {
        const x = prirazeniVeVete(h1, task.categories);
        if (x.length > PRAH_KOTVY) vypis(`prozrazuje ${x.length} zařazení`, x);
      }
    }

    if (videnaOtazka.has(task.question)) continue;
    videnaOtazka.add(task.question);

    const h0 = task.hints?.[0];
    if (!h0) continue;
    // Slova, která už stojí v zadání, se nepočítají: nápověda smí zadání
    // citovat. Bez toho hlásil skript 6 falešných nálezů u spojek, kde
    // nápověda cituje výchozí větu („Ve větě „Zaspal jsem…" najdi…").
    const vZadani = new Set(slova(task.question));
    const klic = slova(String(task.correctAnswer))
      .filter((w) => !JEDNOTKY.has(w) && !vZadani.has(w));
    // Klíč z jednoho slova nebo jen z čísel a jednotek posuzovat nejde.
    if (klic.length < 2) continue;
    const vH0 = new Set(slova(h0));
    const pokryti = klic.filter((w) => vH0.has(w)).length / klic.length;
    const jeOtazka = /\?/.test(h0);
    if (pokryti >= 0.6 && !jeOtazka) {
      nalezu++;
      console.log(`\n[${id}] L${lvl} · překryv ${Math.round(pokryti * 100)} %`);
      console.log(`   Q:   ${task.question.slice(0, 80)}`);
      console.log(`   KEY: ${task.correctAnswer}`);
      console.log(`   H0:  ${h0}`);
    }
  }
}

console.log(`
K posouzení: ${pad(nalezu, "NÁPOVĚDA")} podle překryvu s klíčem`
  + ` a ${pad(strukturovanych, "NÁPOVĚDA")} u strukturovaných typů.`
  + ` Nález není důkaz chyby — každou posuď ručně.`);
