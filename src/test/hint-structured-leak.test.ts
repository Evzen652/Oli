/**
 * Velká nápověda u strukturovaných typů smí rozebrat jednu kotvu, ne sadu.
 *
 * Proč to nechytí `check-hint-leak.ts`: ten porovnává nápovědu
 * s `correctAnswer`, jenže u `match_pairs`, `categorize` a `drag_order` je
 * `correctAnswer` jen technický marker („match" / „categorize" / „order").
 * Skutečné řešení leží v `pairs` / `categories` / `items`, takže tudy prošla
 * nápověda, která za svůj pevný konec přilepila souvislost **další** dvojice
 * nebo události — 696 z 1 000 úloh v 17 tématech (nalezeno 2026-09-13).
 * U `chronologie` na L3 se pořadí odvozuje právě ze souvislostí, takže každý
 * takový doplněk byl kus řešení.
 *
 * **Měřítko je konstrukční, ne heuristické.** Helpery v `grade-5/_shared.ts`
 * staví velkou nápovědu jako „jádro + pevná závěrečná věta", a `doplnVelkou`
 * za ni dorovnává délku. Co stojí za tou větou, musí být obecná strategie
 * z rejstříku — nic jiného tam vzniknout nemá. Tím se test vyhne hádání, co
 * je a co není únik: ptá se na tvar, který helper garantuje.
 *
 * Pozn.: jmenovat položky zadání samo o sobě únik NENÍ — třídění zvířat
 * v 3. ročníku úmyslně vypisuje znak ke každému zvířeti, a přesto nechává
 * dítěti celé rozhodnutí (znak → skupina). První verze tohohle testu na tom
 * spadla a hlásila 1 241 falešných nálezů.
 */
import { describe, it, expect } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";
import type { PracticeTask } from "@/lib/types";
import {
  RADY_HLAVNI_MESTA,
  RADY_SOUSEDE_A_EU,
} from "@/content/grade-5/vlastiveda/evropskeStatyAEuSousedniZemeCrPodrobne";

/** Pevné závěrečné věty, kterými helpery ukončují jádro velké nápovědy. */
const KONCE = [
  "Zbylé dvojice pak doplň vylučováním.", // parovani
  "Stejně rozhodni i u ostatních položek.", // trideni
  "Ostatní události zařaď před ni, nebo za ni.", // chronologie bez dat
];

/**
 * Obecné strategie, které za závěrečnou větou stát smějí. Drženo zvlášť od
 * `_shared.ts` schválně: kdyby se rejstřík rozšířil o větu, která prozrazuje,
 * test to má nahlásit, ne mlčky převzít.
 */
const POVOLENE_DOPLNKY = [
  "Nejdřív najdi úplně první a úplně poslední událost, zbylé pak zařaď mezi ně.",
  "Ptej se: co se muselo stát dřív, aby mohlo přijít to další?",
  "Když si nejsi jistý nebo jistá, zkus dvě události porovnat mezi sebou a teprve pak je zařaď do celé řady.",
  "Každá položka vlevo má právě jednu dvojici vpravo.",
  "Začni tou dvojicí, kterou znáš nejlíp, a zbytek vylučuj.",
  "U dvojice, kterou si nejsi jistý nebo jistá, se ptej, které slovo z popisu k položce vůbec sedí.",
  "U každé položky se ptej, podle jakého znaku do skupiny patří.",
  "Když si nejsi jistý nebo jistá, začni položkami, které znáš nejlíp.",
  "Znak, podle kterého třídíš, hledej na těle nebo na povrchu — ne v tom, kde se položka vyskytuje.",
  // Tématické rady jednoho tématu, které si velkou nápovědu dorovnává samo
  // (`odlisSadu`). Importované, ne opsané — ať je seznam na jednom místě.
  ...RADY_HLAVNI_MESTA,
  ...RADY_SOUSEDE_A_EU,
];

/** Vzorek na téma × úroveň — generátory losují, takže jeden běh nestačí. */
const OPAKOVANI = Number(process.env.LEAK_REPEATS ?? 3);

describe("ÚNIK V NÁPOVĚDĚ — strukturované typy", () => {
  it("za závěrečnou větou velké nápovědy stojí jen obecná strategie", () => {
    const nalezy: string[] = [];
    const podleTematu = new Map<string, number>();
    let zkontrolovano = 0;

    for (const topic of getAllTopics()) {
      if (!topic.generator) continue;
      for (let opak = 0; opak < OPAKOVANI; opak++) {
        for (const level of [1, 2, 3]) {
          let tasks: PracticeTask[] = [];
          try {
            tasks = topic.generator(level) ?? [];
          } catch {
            continue; // chybějící úroveň řeší jiné brány
          }
          for (const task of tasks) {
            const h1 = task.hints?.[1] ?? "";
            const konec = KONCE.find((k) => h1.includes(k));
            if (!konec) continue;
            zkontrolovano++;

            let zbytek = h1.slice(h1.indexOf(konec) + konec.length).trim();
            for (const s of POVOLENE_DOPLNKY) zbytek = zbytek.split(s).join(" ").trim();
            if (!zbytek) continue;

            podleTematu.set(topic.id, (podleTematu.get(topic.id) ?? 0) + 1);
            if (nalezy.length < 10) {
              nalezy.push(`[${topic.id}] L${level}\n     ZA ZÁVĚREM: ${zbytek}\n     CELÁ H1: ${h1}`);
            }
          }
        }
      }
    }

    // Kdyby se helpery přejmenovaly, test by mlčel — ať je vidět, že měří.
    expect(zkontrolovano, "žádná úloha s pevným koncem — změnily se helpery?").toBeGreaterThan(100);

    const celkem = [...podleTematu.values()].reduce((a, b) => a + b, 0);
    const prehled = [...podleTematu.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id, n]) => `  ${String(n).padStart(4)}×  ${id}`)
      .join("\n");

    expect(
      celkem,
      `Velká nápověda má za závěrečnou větou něco jiného než obecnou strategii ` +
        `(${celkem} úloh, ${podleTematu.size} témat) — pravděpodobně se do doplňků ` +
        `vrátil \`proc\` dalších prvků:\n\n${prehled}\n\nUkázky:\n\n${nalezy.join("\n\n")}`,
    ).toBe(0);
  });
});
