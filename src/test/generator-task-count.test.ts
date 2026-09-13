/**
 * Úloha, která nevznikne, projde každým auditem.
 *
 * `audit:content`, `audit:agreement`, `check:keys` i kontroly nápověd posuzují
 * to, co generátor **vydal**. Když se úloha cestou ztratí, nemají co hlásit —
 * a `runOfflineAudit` proto zůstane zelený i nad tématem, které dítěti nabídne
 * pět úloh místo dvanácti.
 *
 * Zmizet je snadné: `ciselnaUloha` odmítne distraktor shodný s klíčem, a když
 * jich po odečtení duplicit nezbyde dost, úloha se z pole vytratí. Nikdo si toho
 * nevšimne, protože v aplikaci se nic nerozbije — sezení jen dřív dojde.
 *
 * `CONTENT_AUTHORING.md` požaduje **≥ 12 unikátních úloh na téma × úroveň**.
 * Do 2026-09-13 to nekontroloval nikdo; tenhle test je ta chybějící brána
 * a je v bodu 2 plánu [`GRADE_6_COMPLETION_PLAN.md`](../../docs/GRADE_6_COMPLETION_PLAN.md).
 *
 * **Kalibrace 2026-09-13** — 687 dvojic téma × úroveň, žádná výjimka, žádná
 * prázdná položka v poli. Rozdělení počtu unikátních úloh:
 *
 * | úloh | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20+ |
 * |---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
 * | dvojic | 48 | 296 | 62 | 29 | 24 | 8 | 7 | 6 | 207 |
 *
 * Minimum v celém obsahu je tedy přesně 12 a 48 dvojic na té hraně stojí. Práh
 * není vycucaný a jakýkoli propad se projeví hned.
 *
 * ⚠️ **Co tenhle test nezměří:** jestli generátor zahodil úlohu a přesto jich
 * dvanáct vydal. Pooly jsou privátní uvnitř každého souboru, zvenčí na jejich
 * velikost není vidět. Chytí se tím pád pod požadované minimum, ne každá ztráta.
 */
import { describe, it, expect } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";
import type { PracticeTask } from "@/lib/types";
import { klicUlohy, pocetUnikatnich } from "@/lib/taskIdentity";

/** Kolik unikátních úloh musí téma × úroveň nabídnout (CONTENT_AUTHORING). */
const MINIMUM = 12;

/** Generátory losují, takže jeden běh nedokazuje, že to platí vždy. */
const OPAKOVANI = Number(process.env.COUNT_REPEATS ?? 3);

describe("identita ulohy — overeni na vymyslenem vstupu", () => {
  const zaklad: PracticeTask = { question: "Seřaď úseky.", correctAnswer: "order" };

  it("dve strukturovane ulohy se stejnou otazkou jsou dve ruzne ulohy", () => {
    // Přesně ten případ, na kterém dřívější sonda uklouzla a hlásila „1 úloha".
    const a: PracticeTask = { ...zaklad, items: ["Pravěk", "Antika"] };
    const b: PracticeTask = { ...zaklad, items: ["Antika", "Středověk"] };
    expect(klicUlohy(a)).not.toBe(klicUlohy(b));
    expect(pocetUnikatnich([a, b])).toBe(2);
  });

  it("tataz uloha s jinou napovedou je porad tataz uloha", () => {
    const a: PracticeTask = { ...zaklad, items: ["Pravěk"], hints: ["Zkus to.", "Pomůcka A"] };
    const b: PracticeTask = { ...zaklad, items: ["Pravěk"], hints: ["Zkus to.", "Pomůcka B"] };
    expect(pocetUnikatnich([a, b])).toBe(1);
  });

  it("jine moznosti u stejne otazky jsou jina uloha", () => {
    const a: PracticeTask = { question: "Kolik je 2 + 2?", correctAnswer: "4", options: ["4", "5"] };
    const b: PracticeTask = { question: "Kolik je 2 + 2?", correctAnswer: "4", options: ["4", "6"] };
    expect(pocetUnikatnich([a, b])).toBe(2);
  });

  it("prazdne polozky se nepocitaji", () => {
    expect(pocetUnikatnich([zaklad, null, undefined])).toBe(1);
  });
});

describe("POCET ULOH — generátor nesmí tiše ztrácet", () => {
  /** Pro každé téma × úroveň nejmenší počet unikátních úloh přes všechny běhy. */
  function nejhorsiBehy(): {
    pod: string[];
    prazdne: string[];
    vyjimky: string[];
    dvojic: number;
  } {
    const pod: string[] = [];
    const prazdne: string[] = [];
    const vyjimky: string[] = [];
    let dvojic = 0;

    for (const topic of getAllTopics()) {
      if (!topic.generator) continue;
      for (const level of [1, 2, 3]) {
        let nejmene = Number.MAX_SAFE_INTEGER;
        let nejmeneZ = 0;
        let spadlo = false;

        for (let opak = 0; opak < OPAKOVANI; opak++) {
          let tasks: PracticeTask[];
          try {
            tasks = topic.generator(level) ?? [];
          } catch (e) {
            vyjimky.push(`[${topic.id}] L${level} — ${(e as Error).message}`);
            spadlo = true;
            break;
          }
          const dir = tasks.filter((t) => !t).length;
          if (dir > 0) prazdne.push(`[${topic.id}] L${level} — ${dir}× prázdná položka v poli`);

          const u = pocetUnikatnich(tasks);
          if (u < nejmene) {
            nejmene = u;
            nejmeneZ = tasks.filter(Boolean).length;
          }
        }
        if (spadlo) continue;

        dvojic++;
        if (nejmene < MINIMUM) {
          pod.push(
            `[${topic.id}] L${level} — ${nejmene} unikátních ` +
              `(z ${nejmeneZ} vrácených, potřeba ${MINIMUM})`,
          );
        }
      }
    }
    return { pod, prazdne, vyjimky, dvojic };
  }

  const vysledek = nejhorsiBehy();

  it("meri se dost temat na to, aby nula neco znamenala", () => {
    expect(
      vysledek.dvojic,
      "Zkontrolovalo se skoro nic — nejspíš se změnil registr nebo podpis generátoru.",
    ).toBeGreaterThan(500);
  });

  it(`kazde tema x uroven nabidne aspon ${MINIMUM} ruznych uloh`, () => {
    expect(
      vysledek.pod.length,
      `Téma nabídne míň než ${MINIMUM} různých úloh, takže sezení dřív dojde ` +
        `a dítě dostane totéž podruhé. Nejčastější příčina: distraktor vyšel ` +
        `shodně s klíčem, úloha se zahodila a nikde to není vidět ` +
        `(${vysledek.pod.length} dvojic):\n\n${vysledek.pod.slice(0, 20).join("\n")}`,
    ).toBe(0);
  });

  it("generator nevraci prazdne polozky", () => {
    expect(
      vysledek.prazdne.length,
      `V poli úloh je \`null\` nebo \`undefined\`. Do UI se to dostane jako ` +
        `prázdná úloha nebo pád; správně se má neúspěšný pokus o sestavení ` +
        `přeskočit už v generátoru:\n\n${vysledek.prazdne.slice(0, 20).join("\n")}`,
    ).toBe(0);
  });

  it("zadny generator nespadne", () => {
    expect(
      vysledek.vyjimky.length,
      `Generátor vyhodil výjimku — téma pro dítě prostě nebude:\n\n` +
        vysledek.vyjimky.slice(0, 20).join("\n"),
    ).toBe(0);
  });
});
