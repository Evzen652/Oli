import { describe, it, expect } from "vitest";
import { ZEMEPISNA_SIT } from "../zemepis/zemepisnaSit";
import type { PracticeTask } from "@/lib/types";

/**
 * Zeměpisná síť — rovnoběžky, poledníky, souřadnice (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta) — z generátoru neimportuje nic kromě tématu,
 * parametry úloh nečte. Znění otázky PARSUJE regexem a klíč počítá jinak:
 *  • souřadnice převede na znaménková čísla (sever a východ +, jih a západ −),
 *  • posun po poledníku = součet znaménkových šířek (generátor naopak počítá
 *    úsek k rovníku a zbytek za ním),
 *  • posun po délce = součet a normalizace do (−180, 180] přes
 *    ((x + 180) mod 360) − 180 (generátor větví na „přes nultý“ a „přes 180°“),
 *  • úhlová vzdálenost = |φ1 − φ2| bez větvení na stejnou a opačnou polokouli
 *    (generátor odečítá, nebo sčítá podle polokoulí),
 *  • „severněji“ porovná znaménkovou šířku, „blíž rovníku“ absolutní hodnotu,
 *  • polokoule určí podle znamének,
 *  • města porovná proti vlastní tabulce kvadrantů,
 *  • L1 proti ručně psané tabulce pojem → správná odpověď.
 * Výsledek si solver naformátuje VLASTNÍM formátovačem a porovná s klíčem.
 */
const topic = ZEMEPISNA_SIT[0];

// ── Vlastní formátovač (nezávislý na `sirka()` / `delka()` z generátoru) ────
const fmtS = (x: number): string =>
  x === 0 ? "0° (rovník)" : `${Math.abs(x)}° ${x < 0 ? "j. š." : "s. š."}`;
const fmtD = (x: number): string =>
  x === 0 ? "0° (nultý poledník)" : Math.abs(x) === 180 ? "180°" : `${Math.abs(x)}° ${x < 0 ? "z. d." : "v. d."}`;
const fmtPar = (f: number, l: number): string => `${fmtS(f)}, ${fmtD(l)}`;

/** Normalizace délky do (−180, 180]; 180 i −180 se zapisují jako „180°“. */
const norm = (x: number): number => (((x + 180) % 360) + 360) % 360 - 180;

// ── Parsování znění otázky ─────────────────────────────────────────────────
function lat(text: string): number | null {
  const m = text.match(/(\d+)° (s|j)\. š\./);
  if (m) return Number(m[1]) * (m[2] === "j" ? -1 : 1);
  return /0° \(rovník\)/.test(text) ? 0 : null;
}
function lon(text: string): number | null {
  const m = text.match(/(\d+)° (v|z)\. d\./);
  if (m) return Number(m[1]) * (m[2] === "z" ? -1 : 1);
  if (/0° \(nultý poledník\)/.test(text)) return 0;
  return /(?:^|[^\d])180°/.test(text) ? 180 : null;
}

// ── L1: ručně psaná tabulka pojem → správná odpověď ────────────────────────
const L1: [RegExp, string][] = [
  [/kružnice, která obíhá Zemi ze západu na východ/, "rovnoběžka"],
  [/půlkružnice na glóbu, která spojuje severní pól/, "poledník"],
  [/Která rovnoběžka má zeměpisnou šířku 0°/, "rovník"],
  [/Kudy prochází nultý/, "přes Greenwich u Londýna"],
  [/rozmezí stupňů se pohybuje zeměpisná šířka/, "od 0° do 90°"],
  [/rozmezí stupňů se pohybuje zeměpisná délka/, "od 0° do 180°"],
  [/Co udává zeměpisná šířka místa/, "úhlovou vzdálenost od rovníku"],
  [/Co udává zeměpisná délka místa/, "úhlovou vzdálenost od nultého poledníku"],
  [/místo se zeměpisnou šířkou 90° s\. š\./, "severní pól, tedy jen bod"],
  [/zeměpisnou šířku se zkratkou j\. š\./, "na jižní polokouli"],
  [/leží západně od nultého poledníku\. Jakou zkratku/, "z. d."],
  [/leží severně od rovníku\. Jakou zkratku/, "s. š."],
  [/Která rovnoběžka je na Zemi nejdelší/, "rovník"],
  [/liší délky jednotlivých poledníků/, "všechny jsou stejně dlouhé"],
  [/Kolik stupňů zeměpisné šířky je od rovníku k severnímu pólu/, "90°"],
  [/Jak se jmenuje poledník se zeměpisnou délkou 0°/, "nultý (základní) poledník"],
  [/V jakém pořadí se zapisují zeměpisné souřadnice/, "nejdřív šířka, potom délka"],
  [/Jak se mění délka rovnoběžek/, "postupně se zkracují"],
];

// ── L2 (D): vlastní tabulka kvadrantů měst (zapsaná nezávisle na generátoru) ─
const KVADRANT: Record<string, string> = {
  Praha: "SV", Tokio: "SV", Peking: "SV", Dillí: "SV",
  "New York": "SZ", "Los Angeles": "SZ",
  Sydney: "JV", "Kapské Město": "JV", Jakarta: "JV", Nairobi: "JV",
  "Rio de Janeiro": "JZ", "Buenos Aires": "JZ", Lima: "JZ",
};
const kvadrant = (f: number, l: number): string => `${f < 0 ? "J" : "S"}${l < 0 ? "Z" : "V"}`;

// ── L2 (C): lodě ───────────────────────────────────────────────────────────
const LODE = ["Albatros", "Delfín", "Racek", "Tuleň"];
function pozice(q: string): Map<string, [number, number]> {
  const kde = LODE.map((n) => ({ n, i: q.indexOf(`${n}: `) })).filter((x) => x.i >= 0).sort((a, b) => a.i - b.i);
  const konec = q.indexOf("Která loď");
  const out = new Map<string, [number, number]>();
  kde.forEach((x, k) => {
    const seg = q.slice(x.i, k + 1 < kde.length ? kde[k + 1].i : konec);
    out.set(x.n, [lat(seg) ?? NaN, lon(seg) ?? NaN]);
  });
  return out;
}

/** Vrátí očekávaný klíč, nebo null, když solver úlohu nepozná. */
function solve(t: PracticeTask): string | null {
  const q = t.question;

  // L1 — tabulka pojmů
  const p = L1.find(([re]) => re.test(q));
  if (p) return p[1];

  // L3 (A–C) — let po poledníku nebo po rovnoběžce
  let m: RegExpMatchArray | null;
  if ((m = q.match(/letí stále po (témže poledníku|téže rovnoběžce) na (sever|jih|východ|západ)/))) {
    const d = Number(q.match(/Urazí přitom (\d+)°/)![1]);
    const f0 = lat(q)!, l0 = lon(q)!;
    if (m[1] === "témže poledníku") {
      const f1 = f0 + (m[2] === "sever" ? d : -d);
      if (Math.abs(f1) > 90) return `MIMO ROZSAH (${f1})`;
      return fmtPar(f1, l0);
    }
    return fmtPar(f0, norm(l0 + (m[2] === "východ" ? d : -d)));
  }

  // L3 (C) — přelet poledníku 180°; znění je schválně jiné než u ostatních letů
  if ((m = q.match(/Letí po rovnoběžce .*? stále na (východ|západ)/))) {
    const d = Number(q.match(/urazí (\d+)° zeměpisné délky/)![1]);
    return fmtPar(lat(q)!, norm(lon(q)! + (m[1] === "východ" ? d : -d)));
  }

  // L2 (E) — krok po síti s pevným rozestupem
  if ((m = q.match(/Na glóbu jsou (rovnoběžky|poledníky) nakresleny po (\d+)°/))) {
    const sirkova = m[1] === "rovnoběžky";
    const krok = Number(m[2]);
    const sm = q.match(/posune se na (sever|jih|východ|západ) o (dvě|dva|tři|čtyři) /)!;
    const kolik: Record<string, number> = { dvě: 2, dva: 2, tři: 3, čtyři: 4 };
    const dir = sm[1] === "sever" || sm[1] === "východ" ? 1 : -1;
    const start = sirkova ? lat(q)! : lon(q)!;
    const cil = start + dir * kolik[sm[2]] * krok;
    return sirkova ? fmtS(cil) : fmtD(cil);
  }

  // L3 (D) — úhlová vzdálenost dvou míst na témže poledníku
  if (/Kolik stupňů zeměpisné šířky je mezi nimi/.test(q)) {
    const sirky = [...q.matchAll(/(\d+)° (s|j)\. š\./g)].map((x) => Number(x[1]) * (x[2] === "j" ? -1 : 1));
    return `${Math.abs(sirky[0] - sirky[1])}°`;
  }

  // L3 (E) — zápis z kombinovaného popisu
  if (/od Greenwiche/.test(q)) {
    const f = Number(q.match(/na rovnoběžce (\d+)°/)![1]) * (/na jižní polokouli/.test(q) ? -1 : 1);
    const g = q.match(/(\d+)° (východně|západně) od Greenwiche/)!;
    return fmtPar(f, Number(g[1]) * (g[2] === "západně" ? -1 : 1));
  }
  if (/O bodu víme tři věci/.test(q)) {
    const f = Number(q.match(/na rovnoběžce (\d+)°/)![1]) * (/na jižní a/.test(q) ? -1 : 1);
    const l = Number(q.match(/na poledníku (\d+)°/)![1]) * (/a západní polokouli/.test(q) ? -1 : 1);
    return fmtPar(f, l);
  }

  // L2 (C) — lodě
  if (/Čtyři lodě hlásí svou polohu/.test(q)) {
    const poz = [...pozice(q).entries()];
    const skore = /nejseverněji/.test(q) ? (x: [number, number]) => x[0] : (x: [number, number]) => -Math.abs(x[0]);
    const nej = Math.max(...poz.map(([, x]) => skore(x)));
    const vitez = poz.filter(([, x]) => skore(x) === nej);
    return vitez.length === 1 ? vitez[0][0] : `NEJEDNOZNAČNÉ (${vitez.length})`;
  }

  // L2 (B) — polokoule ze zápisu
  if (/Na kterých dvou polokoulích leží/.test(q)) {
    const f = lat(q)!, l = lon(q)!;
    return `na ${f < 0 ? "jižní" : "severní"} a ${l < 0 ? "západní" : "východní"} polokouli`;
  }

  // L2 (D) — město podle polokoulí
  if (/Které z těchto měst leží přibližně na/.test(q)) {
    const k = kvadrant(lat(q)!, lon(q)!);
    const sedi = t.options!.filter((o) => KVADRANT[o] === k);
    return sedi.length === 1 ? sedi[0] : `NEJEDNOZNAČNÉ (${sedi.length})`;
  }

  // L2 (A) — slovní popis → zápis
  if (/Který zápis jeho zeměpisných souřadnic je správný/.test(q)) {
    const a = q.match(/(\d+)° (severně|jižně) od rovníku/);
    const b = q.match(/(\d+)° (východně|západně) od nultého poledníku/);
    const f = a ? Number(a[1]) * (a[2] === "jižně" ? -1 : 1) : 0;
    const l = b ? Number(b[1]) * (b[2] === "západně" ? -1 : 1) : 0;
    return fmtPar(f, l);
  }
  return null;
}

describe("Zeměpisná síť — metadata", () => {
  it("zeměpis g6, select_one, správné zařazení", () => {
    expect(topic.id).toBe("g6-zem-zemepisna-sit-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Geografické informace, zdroje dat, kartografie");
    expect(topic.topic).toBe("Mapa a glóbus");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Zeměpisná síť — úroveň %i", (level) => {
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

  it("chybový model: feedback pro každý distraktor, klíč bez feedbacku", () => {
    for (const t of tasks) {
      for (const o of t.options!.filter((x) => x !== t.correctAnswer)) {
        expect(t.optionFeedback?.[o], `chybí feedback „${o}“ v ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
    }
  });

  it("dvě nápovědy, ani jedna neprozrazuje klíč; vysvětlení existuje", () => {
    for (const t of tasks) {
      expect(t.hints, t.question).toHaveLength(2);
      for (const h of t.hints!) expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
      expect(t.hints![0], t.question).not.toBe(t.hints![1]);
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("klíč se nevyskytuje ve znění otázky", () => {
    for (const t of tasks) {
      // U výběru ze jmenovaných položek (lodě) jsou ve znění všechny čtyři
      // možnosti — klíč pak nevyčnívá a kontrola se dělá obráceně.
      if (t.options!.every((o) => t.question.includes(o))) continue;
      expect(t.question, "klíč ve znění otázky").not.toContain(t.correctAnswer);
    }
  });

  it("klíč je v platném rozsahu: šířka do 90°, délka do 180°", () => {
    for (const t of tasks) {
      for (const x of [...t.correctAnswer.matchAll(/(\d+)° (?:s|j)\. š\./g)]) {
        expect(Number(x[1]), t.correctAnswer).toBeLessThanOrEqual(90);
      }
      for (const x of [...t.correctAnswer.matchAll(/(\d+)° (?:v|z)\. d\./g)]) {
        expect(Number(x[1]), t.correctAnswer).toBeLessThan(180);
      }
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(s, `solver nerozpoznal: ${t.question}`).not.toBeNull();
      expect(t.correctAnswer, t.question).toBe(s);
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
      let a = 987654321;
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

describe("Zeměpisná síť — gradace a pokrytí", () => {
  it("L2 a L3 mají solutionSteps, L1 je pojmová (bez souřadnic)", () => {
    for (const level of [2, 3]) {
      for (const t of topic.generator(level)) {
        expect(t.solutionSteps?.length, `chybí solutionSteps: ${t.question}`).toBeGreaterThan(0);
      }
    }
    for (const t of topic.generator(1)) {
      expect(t.question, "L1 nemá obsahovat dvojici souřadnic").not.toMatch(/š\.,\s*\d+°/);
    }
  });

  it("znění L1 a L3 jsou disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    for (const t of topic.generator(3)) expect(l1.has(t.question), t.question).toBe(false);
  });

  it("L2 obsahuje všech pět šablon", () => {
    const qs = topic.generator(2).map((t) => t.question);
    expect(qs.some((q) => /Který zápis jeho zeměpisných souřadnic/.test(q))).toBe(true);
    expect(qs.some((q) => /Na kterých dvou polokoulích/.test(q))).toBe(true);
    expect(qs.some((q) => /Čtyři lodě hlásí/.test(q))).toBe(true);
    expect(qs.some((q) => /Které z těchto měst/.test(q))).toBe(true);
    expect(qs.some((q) => /Na glóbu jsou (rovnoběžky|poledníky) nakresleny po/.test(q))).toBe(true);
  });

  it("L3 obsahuje všech šest šablon včetně přeletu poledníku 180°", () => {
    const qs = topic.generator(3).map((t) => t.question);
    expect(qs.some((q) => /po témže poledníku/.test(q))).toBe(true);
    expect(qs.some((q) => /po téže rovnoběžce/.test(q))).toBe(true);
    expect(qs.some((q) => /Kolik stupňů zeměpisné šířky je mezi nimi/.test(q))).toBe(true);
    expect(qs.some((q) => /od Greenwiche/.test(q))).toBe(true);
    expect(qs.some((q) => /O bodu víme tři věci/.test(q))).toBe(true);
    // přelet přes 180°: start nad 150° délky a cíl na opačné polokouli
    const pres180 = topic.generator(3).filter((t) => {
      const m = t.question.match(/(\d+)° (v|z)\. d\./);
      return !!m && Number(m[1]) >= 150 && /Letí po rovnoběžce/.test(t.question);
    });
    expect(pres180.length).toBeGreaterThan(0);
  });

  it("prvních šest úloh sezení nezopakuje tutéž šablonu (L3) a v L2 nanejvýš jednou", () => {
    // Sezení bere `renderable.slice(0, sessionTaskCount)` — proto se hlídá,
    // kolik různých tvarů žák v jednom sezení uvidí.
    const tvar = (q: string): string =>
      q.replace(/\d+/g, "#").replace(/(sever|jih|východ|západ)\w*/g, "S").replace(/(s|j)\. š\.|(v|z)\. d\./g, "X");
    const tvaryL3 = new Set(topic.generator(3).slice(0, 6).map((t) => tvar(t.question)));
    expect(tvaryL3.size, "L3 prvních šest").toBe(6);
    const tvaryL2 = new Set(topic.generator(2).slice(0, 6).map((t) => tvar(t.question)));
    expect(tvaryL2.size, "L2 prvních šest").toBeGreaterThanOrEqual(5);
  });

  it("lodě hlásí polohu z moře: |šířka| do 55°, žádné vnitrozemí Antarktidy", () => {
    for (const t of topic.generator(2)) {
      if (!/Čtyři lodě hlásí/.test(t.question)) continue;
      for (const m of t.question.matchAll(/(\d+)° (s|j)\. š\./g)) {
        expect(Number(m[1]), t.question).toBeLessThanOrEqual(55);
      }
    }
  });

  it("bez map a obrázků — úloha jde vyřešit ze slov", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        expect(t.question, t.question).not.toMatch(/na obrázku|podívej se na mapu|na mapě níže/i);
      }
    }
  });
});
