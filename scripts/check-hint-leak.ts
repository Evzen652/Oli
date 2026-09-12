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
import { getAllTopics } from "@/lib/contentRegistry";

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

for (const id of ids) {
  const t = getAllTopics().find((x) => x.id === id);
  if (!t?.generator) continue;
  const videno = new Set<string>();
  for (const lvl of [1, 2, 3]) for (const task of t.generator(lvl) ?? []) {
    if (videno.has(task.question)) continue;
    videno.add(task.question);
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
      console.log(`\n[${id}] L${lvl} · překryv ${Math.round(pokryti * 100)} %`);
      console.log(`   Q:   ${task.question.slice(0, 80)}`);
      console.log(`   KEY: ${task.correctAnswer}`);
      console.log(`   H0:  ${h0}`);
    }
  }
}

console.log(`
K posouzení: ${nalezu} nápověd. Nález není důkaz chyby — každý posuď ručně.`);
