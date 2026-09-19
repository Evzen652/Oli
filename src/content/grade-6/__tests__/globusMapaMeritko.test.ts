import { describe, it, expect } from "vitest";
import { GLOBUS_MAPA_MERITKO } from "../zemepis/globusMapaMeritko";
import type { PracticeTask } from "@/lib/types";

/**
 * Glóbus a mapa, měřítko, druhy map — výpočetní select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta) — parametry generátoru neimportuje, čte jen
 * znění otázky:
 *  • čísla parsuje regexem (měřítko, délky s jednotkami, rychlost),
 *  • vše převádí na centimetry tabulkou {cm: 1, m: 100, km: 100 000}
 *    (generátor naopak dělí postupně 100 a 1 000),
 *  • klíč spočítá a naformátuje do jednotky, kterou mají možnosti.
 * Faktické úlohy ověřuje klasifikátor: druh měřítka podle jmenovatele,
 * nejpodrobnější = nejmenší jmenovatel, druh mapy podle klíčových slov,
 * účel mapy podle tabulky rozsahů jmenovatele.
 */
const topic = GLOBUS_MAPA_MERITKO[0];

const NA_CM: Record<string, number> = { cm: 1, m: 100, km: 100000 };
const num = (s: string) => Number(s.replace(/\s/g, "").replace(",", "."));

function meritka(q: string): number[] {
  return [...q.matchAll(/1 : (\d{1,3}(?: \d{3})*)/g)].map((m) => num(m[1]));
}
function delky(q: string): { cm: number; jedn: string }[] {
  const bezRychlosti = q.replace(/rychlostí \d+ km za hodinu/, "");
  return [...bezRychlosti.matchAll(/(\d+(?: \d{3})*(?:,\d+)?) ?(cm|km|m)(?![\p{L}])/gu)].map((m) => ({
    cm: num(m[1]) * NA_CM[m[2]],
    jedn: m[2],
  }));
}
function fmt(x: number): string {
  const [cele, des] = String(Math.round(x * 1000) / 1000).split(".");
  const sep = cele.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return des ? `${sep},${des}` : sep;
}
const jednotkaMoznosti = (t: PracticeTask) => t.correctAnswer.split(" ").pop()!;
function vJednotce(cm: number, jedn: string): string {
  return `${fmt(cm / NA_CM[jedn])} ${jedn}`;
}
const hodinTvar = (h: number) =>
  !Number.isInteger(h) ? "hodiny" : h === 1 ? "hodina" : h >= 2 && h <= 4 ? "hodiny" : "hodin";

type Druh = "velké" | "střední" | "malé";
const trida = (n: number): Druh => (n <= 200000 ? "velké" : n <= 1000000 ? "střední" : "malé");

/** Tabulka účelů: klíčové slovo situace → přípustný rozsah jmenovatele. */
const UCELY: [RegExp, number, number][] = [
  [/pěší výlet/, 20000, 100000],
  [/Evropu/, 5000000, 100000000],
  [/ulici a číslo domu/, 1, 10000],
  [/autem přes celou republiku/, 200000, 1000000],
  [/všech světadílů/, 20000000, 1e9],
  [/na kole po okolí/, 50000, 200000],
  [/orientačním běhu/, 1, 25000],
  [/celou Asii/, 5000000, 100000000],
];

/** Klasifikátor druhu mapy podle obsahu. */
function druhMapy(q: string): string {
  if (/hranice|stát je/.test(q)) return "tematická mapa – politická";
  if (/teplot|srážk|podnebn/.test(q)) return "tematická mapa – podnebná";
  if (/pěší cesty|chaty/.test(q)) return "tematická mapa – turistická";
  if (/hornin/.test(q)) return "tematická mapa – geologická";
  if (/kolik lidí žije/.test(q)) return "tematická mapa – obyvatelstvo";
  if (/doly|továrny/.test(q)) return "tematická mapa – hospodářská";
  if (/výšk|nížin|pohoří/.test(q)) return "obecně zeměpisná mapa";
  return "?";
}

/** Tabulka glóbus × mapa: znak otázky → kmen, který musí mít klíč. */
const GLOBUS: [RegExp, RegExp][] = [
  [/popis glóbu/, /kulový model.*nezkresluje/],
  [/platí o mapě/, /zmenšený a zjednodušený.*rovině/],
  [/Proč mapa světa zkresluje/, /nejde přenést do roviny/],
  [/Grónsko/, /Grónsko je menší/],
  [/víc hodí glóbus/, /skutečné tvary/],
  [/na túru/, /nezobrazí podrobnosti/],
  [/výrok o glóbu a mapě/, /věrně zachycuje tvary/],
  [/zkreslení nejmenší/, /malého území/],
  [/liší glóbus od mapy/, /Glóbus je kulový model, mapa je obraz v rovině/],
  [/zjednodušená/, /vybrané jevy/],
];

/** Vrátí očekávaný klíč, nebo null, když úlohu nepozná. */
function solve(t: PracticeTask): string | null {
  const q = t.question;
  const n = meritka(q);
  const d = delky(q);
  let m: RegExpMatchArray | null;

  // L3 (d) — čas
  if ((m = q.match(/rychlostí (\d+) km za hodinu/))) {
    const skutKm = (d[0].cm * n[0]) / NA_CM.km;
    const h = skutKm / Number(m[1]);
    return `${fmt(h)} ${hodinTvar(h)}`;
  }
  // L3 (b) — rozdíl dvou map
  if (/O kolik centimetrů je na mapě A delší/.test(q)) {
    const skut = d[0].cm;
    return vJednotce(skut / n[0] - skut / n[1], "cm");
  }
  // L3 (a) — inverze
  if (/V jakém měřítku je mapa/.test(q)) {
    const nn = d[0].cm / d[1].cm;
    return `1 : ${nn.toLocaleString("cs-CZ").replace(/\s/g, " ")}`;
  }
  // L3 (b) — podrobnost / největší území
  if (/liší se jen měřítkem/.test(q)) {
    const ns = t.options!.map((o) => num(o.replace("1 : ", "")));
    const cil = /nejvíc podrobností/.test(q) ? Math.min(...ns) : Math.max(...ns);
    return t.options![ns.indexOf(cil)];
  }
  // L3 (c) — účel
  const ucel = UCELY.find(([re]) => re.test(q));
  if (ucel) {
    const vyhovuje = t.options!.filter((o) => {
      const x = num(o.replace("mapa v měřítku 1 : ", ""));
      return x >= ucel[1] && x <= ucel[2];
    });
    return vyhovuje.length === 1 ? vyhovuje[0] : `NEJEDNOZNAČNÉ (${vyhovuje.length})`;
  }
  // L2 (c) — tentýž úsek na dvou mapách (přes skutečnou délku v cm)
  if (/Tentýž úsek/.test(q)) {
    return vJednotce((d[0].cm * n[0]) / n[1], "cm");
  }
  // L1 (c) — význam měřítka
  if (/Co znamená měřítko mapy|Co tento zápis říká/.test(q)) {
    const cm = n[0];
    const vzd = cm < 100000 ? `${fmt(cm / 100)} m` : `${fmt(cm / 100000)} km`;
    return `1 cm na mapě = ${vzd} ve skutečnosti`;
  }
  // L1 (b) — druh podle měřítka
  if (/Do jaké skupiny podle měřítka/.test(q)) {
    const tr = trida(n[0]);
    return t.options!.find((o) => o.startsWith(`${tr} měřítko`) && (tr === "střední" || (tr === "velké" ? /podrobná/ : /přehledná/).test(o))) ?? "?";
  }
  // L1 (b) — druh podle obsahu
  if (/O jaký druh mapy jde/.test(q)) return druhMapy(q);
  // L1 (a) — glóbus × mapa
  const g = GLOBUS.find(([re]) => re.test(q));
  if (g) {
    const hit = t.options!.filter((o) => g[1].test(o));
    return hit.length === 1 ? hit[0] : `NEJEDNOZNAČNÉ (${hit.length})`;
  }
  // L2 — mapa ↔ skutečnost
  if (n.length === 1 && d.length === 1) {
    const jedn = jednotkaMoznosti(t);
    if (d[0].jedn === "cm") return vJednotce(d[0].cm * n[0], jedn);
    return vJednotce(d[0].cm / n[0], jedn);
  }
  return null;
}

// Výpočetní úlohy poznáme podle tázací věty o délce nebo měřítku. Samotné
// „ve skutečnosti?“ nestačí — tak se ptá i faktická L1 úloha o Grónsku, která
// nic nepočítá a solutionSteps mít nemá.
const VYPOCETNI = /rychlostí|O kolik centimetrů|V jakém měřítku|jejich skutečná vzdálenost|Jak dlouh[áý] je ve skutečnosti\?|Kolik měří ve skutečnosti|na mapě v měřítku[^?]*\?$|do mapy v měřítku/;

describe("Glóbus a mapa — metadata", () => {
  it("zeměpis g6, select_one, správné zařazení", () => {
    expect(topic.id).toBe("g6-zem-globus-mapa-meritko-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Geografické informace, zdroje dat, kartografie");
    expect(topic.topic).toBe("Mapa a glóbus");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Glóbus a mapa — úroveň %i", (level) => {
  const tasks = topic.generator(level);

  it("≥ 12 unikátních otázek", () => {
    expect(new Set(tasks.map((t) => `${t.question}|${t.correctAnswer}`)).size).toBeGreaterThanOrEqual(12);
  });

  it("přesně 4 různé možnosti, právě jedna je klíč", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer), t.question).toHaveLength(1);
    }
  });

  it("chybový model: feedback pro každý distraktor", () => {
    for (const t of tasks) {
      for (const o of t.options!.filter((x) => x !== t.correctAnswer)) {
        expect(t.optionFeedback?.[o], `chybí feedback „${o}“ v ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
    }
  });

  it("nápovědy dvě, neprozrazují klíč; vysvětlení existuje", () => {
    for (const t of tasks) {
      expect(t.hints, t.question).toHaveLength(2);
      for (const h of t.hints!) expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
      expect(t.explanation, t.question).toBeTruthy();
      expect(t.question, "klíč ve znění otázky").not.toContain(t.correctAnswer);
    }
  });

  // `dve()` ze `_shared.ts` dolepí k druhé nápovědě cizí strategickou větu,
  // když není aspoň 1,2krát delší než první. U měřítka to radilo vylučovat
  // podle „polohy nebo podnebí“ (u převodu cm→km nesmysl) nebo kontrolovat
  // „vzdálenost“ tam, kde se počítají hodiny. Nápovědy proto musí stačit samy.
  it("druhá nápověda je soběstačná — nedolepí se cizí strategická věta", () => {
    const CIZI = ["Vylučuj možnosti", "Nejdřív škrtni", "nesmyslně velká", "Dej pozor na jednotky"];
    for (const t of tasks) {
      for (const veta of CIZI) {
        expect(t.hints![1], `${t.question}
→ ${t.hints![1]}`).not.toContain(veta);
      }
      expect(t.hints![1].length, t.question).toBeGreaterThanOrEqual(t.hints![0].length * 1.2);
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(s, `solver nerozpoznal: ${t.question}`).not.toBeNull();
      expect(t.correctAnswer, t.question).toBe(s);
    }
  });

  it("výpočetní úlohy: solutionSteps, stejná jednotka, klíč nejvýš s jedním desetinným místem", () => {
    for (const t of tasks) {
      if (!VYPOCETNI.test(t.question)) continue;
      expect(t.solutionSteps?.length, `chybí solutionSteps: ${t.question}`).toBeGreaterThan(0);
      if (/^1 : /.test(t.correctAnswer)) continue;
      const jedn = jednotkaMoznosti(t);
      for (const o of t.options!) expect(o.split(" ").pop(), `${o} v ${t.question}`).toBe(jedn.startsWith("hodin") ? o.split(" ").pop() : jedn);
      const cislo = t.correctAnswer.split(" ")[0];
      expect(cislo, t.question).toMatch(/^\d+(,\d)?$/);
    }
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const nejdelsi = tasks.filter((t) => {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length);
      return t.correctAnswer.length > Math.max(...jine);
    }).length;
    expect(nejdelsi / tasks.length).toBeLessThan(0.5);
  });

  it("determinismus: stejný seed → stejné úlohy", () => {
    const seeded = () => {
      let a = 12345;
      return () => {
        a = (a * 1103515245 + 12345) % 2147483648;
        return a / 2147483648;
      };
    };
    const puvodni = Math.random;
    try {
      Math.random = seeded();
      const x = JSON.stringify(topic.generator(level).map((t) => [t.question, t.correctAnswer]));
      Math.random = seeded();
      const y = JSON.stringify(topic.generator(level).map((t) => [t.question, t.correctAnswer]));
      expect(x).toBe(y);
    } finally {
      Math.random = puvodni;
    }
  });
});

describe("Glóbus a mapa — gradace", () => {
  it("znění L1 a L3 jsou disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    for (const t of topic.generator(3)) expect(l1.has(t.question), t.question).toBe(false);
  });

  it("L3 obsahuje všechny čtyři šablony", () => {
    const qs = topic.generator(3).map((t) => t.question);
    expect(qs.some((q) => /V jakém měřítku/.test(q))).toBe(true);
    expect(qs.some((q) => /O kolik centimetrů|liší se jen měřítkem/.test(q))).toBe(true);
    expect(qs.some((q) => /Jakou mapu si vezmeš|Jaká mapa/.test(q))).toBe(true);
    expect(qs.some((q) => /rychlostí/.test(q))).toBe(true);
  });

  it("L2 obsahuje oba směry převodu", () => {
    const qs = topic.generator(2).map((t) => t.question);
    expect(qs.some((q) => /\d cm\./.test(q))).toBe(true);
    expect(qs.some((q) => /v měřítku 1 : [\d ]+\?$/.test(q))).toBe(true);
  });
});
