/**
 * Deterministický otisk (question | correctAnswer) obsahu tématu.
 *
 * Slouží jako "freeze" mechanismus: ověřený obsah (aritmetika, faktografie,
 * ověřené české klíče) nesmí být tichým způsobem změněn. Pokud se otázka
 * nebo správná odpověď u zamčeného tématu změní, audit `frozen_content_unchanged`
 * padne.
 *
 * Otisk zahrnuje POUZE `question` a `correctAnswer` — distraktory (options),
 * nápovědy, vysvětlení a další forma se smí měnit bez blokace (proto lze
 * doplnit chybějící úroveň, opravit velikost písmen v možnostech atd.).
 *
 * Generátor je běhán s **patched Math.random** (LCG s pevným seedem),
 * aby výsledek nezávisel na náhodě uvnitř shuffle. Pro témata, jejichž
 * pool obsahuje více položek než `slice(0, N)`, deterministický seed
 * garantuje stabilní podmnožinu — což je přesně to, co snapshot ověřuje.
 */

import { createHash } from "node:crypto";
import type { TopicMetadata, PracticeTask } from "./types";

/**
 * Topic ID, která jsou aktivně opravována — snapshot je pro ně VYNECHÁN.
 * Po dokončení fixu se ID odsud odebere a snapshot pro dané téma se
 * přegeneruje: `UPDATE_FROZEN_SNAPSHOT=1 npx vitest run src/test/frozen-content-unchanged.test.ts`.
 */
export const UNFROZEN_TOPIC_IDS: ReadonlySet<string> = new Set<string>([
  // P1 — oprava neexistujících slov („zdal", „spochodovala", double prefix)
  // P0 — sjednocení case klíče s options
  "g4-cjl-jazykova-vychova-stavba-slova-pravopis-predpon-vy-vy-s-z-vz",
  // P2 — dedup možností přes buildUniqueOptions (L2 vždy měla dupe, L3 často)
  "g4-mat-zlomek-cast-celku-4",
  // P2 — řazení: unikátní vstupní čísla (duplicity → shodné distraktory)
  "g3-mat-cisla-do-1000",
  // P0 — klíč "ano"/"ne" sjednocen na "Ano"/"Ne" (options literal)
  "g4-cjl-komunikacni-a-slohova-vychova-cteni-manipulativni-komunikace-v-reklame",
  "g4-cjl-komunikacni-a-slohova-vychova-cteni-plynule-cteni-s-porozumenim-primerene-narocnych-textu",
  // PED-1 — možnosti = sporný grafém (y/ý/i/í), ne celá chybná slova
  "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-pravopis-tvrdych-a-mekkych-souhlasek-i-y-po-souhlaskach",
  "g3-cjl-vyjmenovana-slova",
  "g3-cjl-slova-pribuzna-vyjmenovana",
  // PED-2 — kalibrace L1<L2<L3: disjunktní řady a nová inverze na L3
  "g3-mat-nasobilka-6-10",
  // PED-3 — naplnit L3 + disjunktní L1/L2/L3
  "g3-mat-kruznice-kruh",
  "g3-mat-rysovani-usecky",
  "g4-mat-magicke-ctverce-ciselne-rady-4",
  "g2-mat-mereni-delky",
  "g2-mat-jednotky",
  "g2-mat-nasobilka-2345",
  "g2-mat-mereni-casu",
  "g2-mat-bod-primka-usecka",
  "g2-mat-slovni-ulohy-100",
  "g3-cjl-spojovani-vet-spojkami",
  "g3-cjl-slovesa-osoba-cislo-cas",
  "g3-cjl-velka-pismena",
  "g3-cjl-veta-jednoducha-souveti",
  "g3-cjl-jazykova-vychova-nauka-o-slove-vyznam-slova-slova-jednoznacna-a-mnohoznacna",
  "g4-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-psani-soukromeho-dopisu",
  // Kolo 2 P0 opravy (2026-07-09)
  "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-zena-ruze-pisen-kost-mesto-more-kure",
  "g4-cjl-jazykova-vychova-tvaroslovi-vzory-podstatnych-jmen-pan-hrad-muz-stroj-predseda-soudce",
  "g3-cjl-podstatna-jmena-rod-cislo-pad",
  // Systémové dluhy Balík 1B (2026-07-10) — rozšíření z 3 na 8 textů, disjunktní L1/L2/L3
  "g3-cjl-plynule-cteni-porozumeni",
  // Systémové dluhy Balík 1C (2026-07-10) — parametrizace z rozsahu čísel místo pevného seznamu
  "g2-mat-tabulky",
  "g3-mat-tabulky-diagramy",
  "g4-mat-tabulky-diagramy-4",
  // Systémové dluhy Balík 2A (2026-07-10) — doplnění L3 (+L2 u 2 topics) u čtenářských/
  // literárních témat čeština 3.–4. tř., vyloučených z TIER_EXCEPTIONS
  "g3-cjl-vers-rym-prirovnani",
  "g3-cjl-proza-verse",
  "g3-cjl-pohadka-povidka-basen-bajka",
  "g3-cjl-vyhledavani-informaci",
  "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-encyklopedie-slovnik-periodika",
  "g4-cjl-literarni-vychova-prace-s-textem-hlavni-postavy-a-jejich-charakteristika",
  "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-pohadka-povest-bajka-povidka",
  "g4-cjl-komunikacni-a-slohova-vychova-cteni-rozliseni-podstatnych-a-okrajovych-informaci",
  "g4-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-klicovych-slov-a-hlavni-myslenky",
]);

export interface TopicFingerprint {
  hash: string;
  taskCount: number;
}

/** Deterministický LCG (mulberry32 varianta) — bez závislosti na sdíleném stavu. */
function seededRandom(seed = 0x9E3779B9): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

/** Nahradí Math.random deterministickým generátorem po dobu volání fn. */
function withDeterministicRandom<T>(fn: () => T): T {
  const orig = Math.random;
  Math.random = seededRandom();
  try {
    return fn();
  } finally {
    Math.random = orig;
  }
}

function normalizeTask(task: PracticeTask): string {
  const q = (task.question ?? "").trim();
  const a = (task.correctAnswer ?? "").trim();
  return `${q}\t${a}`;
}

/**
 * Vypočte otisk tématu: setřídí (question|correctAnswer) páry ze všech
 * úrovní generátoru → SHA1 hex.
 */
export function fingerprintTopic(topic: TopicMetadata): TopicFingerprint {
  return withDeterministicRandom(() => {
    const rows: string[] = [];
    for (const level of [1, 2, 3] as const) {
      let tasks: PracticeTask[] = [];
      try {
        const res = topic.generator(level);
        tasks = Array.isArray(res) ? res : [];
      } catch {
        tasks = [];
      }
      for (const t of tasks) rows.push(normalizeTask(t));
    }
    const uniq = [...new Set(rows)].sort();
    return {
      hash: createHash("sha1").update(uniq.join("\n")).digest("hex"),
      taskCount: uniq.length,
    };
  });
}
