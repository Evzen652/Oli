import { describe, it, expect } from "vitest";
import { STEHOVANI_NARODU_PAD_ZAPADORIMSKE_RISE } from "../dejepis/stehovaniNaroduPadZapadorimskeRise";
import type { PracticeTask } from "@/lib/types";

/**
 * Stěhování národů a pád Západořímské říše — faktický select_one vzor 2. stupně.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, vlastní tabulky, bez importu bank generátoru):
 *  1. PŘEPOČET — z textu otázky vytáhne letopočty; století = floor((r − 1) / 100) + 1,
 *     rozdíl = pozdější − dřívější. Klíč musí sedět a žádný distraktor nesmí mít stejnou hodnotu.
 *  2. RANK — tabulka letopočtů událostí; „nejdříve / jako poslední / nejdříve po / až po“.
 *  3. OBDOBÍ — rok → starověk (≤ 476) / středověk (< 1500).
 *  4. KLASIFIKÁTOR — popis situace → příčina podle klíčových slov; klíč → příčina podle
 *     klíčových slov; musí se shodnout. Výroky → příčina × důsledek.
 *  5. CLAIMS — zbylé faktické otázky: znění → vzor správné odpovědi; vyhovět smí právě 1 možnost.
 */
const topic = STEHOVANI_NARODU_PAD_ZAPADORIMSKE_RISE[0];

// ── 1. přepočet ────────────────────────────────────────────────────────────
const stoleti = (r: number) => Math.floor((r - 1) / 100) + 1;
const roky = (s: string) => [...s.matchAll(/\b(\d{3,4})\b/g)].map((m) => Number(m[1]));

// ── 2. rank-tabulka (rok n. l.) ───────────────────────────────────────────
const UDALOSTI: [RegExp, number][] = [
  [/povolil křesťanství/, 313],
  [/Hunové vpadli/, 375],
  [/říše se rozdělila/i, 395],
  [/Vandalové vyplenili/, 455],
  [/sesadil posledního císaře/, 476],
  [/Odoakar vládl Itálii/, 480],
];
const rokUdalosti = (o: string) => {
  const hit = UDALOSTI.filter(([re]) => re.test(o));
  return hit.length === 1 ? hit[0][1] : NaN;
};

// ── 4. klasifikátor příčin ────────────────────────────────────────────────
type Pricina = "rozdeleni" | "kmeny" | "zoldneri" | "dane" | "trun" | "hranice";
const SITUACE_KW: [RegExp, Pricina][] = [
  [/Ravenn|do Konstantinopole/, "rozdeleni"],
  [/Gótů s rodinami|přejít Dunaj/, "kmeny"],
  [/Řím platil/, "zoldneri"],
  [/obilí|úrody/, "dane"],
  [/vystřídalo/, "trun"],
  [/Rýna a horního Dunaje/, "hranice"],
];
const MOZNOST_KW: [RegExp, Pricina][] = [
  [/^Rozdělení/, "rozdeleni"],
  [/kmenů/, "kmeny"],
  [/žold/, "zoldneri"],
  [/daně/, "dane"],
  [/trůn/, "trun"],
  [/dlouhé hranice/, "hranice"],
];
const klasifikuj = (s: string, kw: [RegExp, Pricina][]) => [...new Set(kw.filter(([re]) => re.test(s)).map(([, p]) => p))];

/** Výrok → příčina (před 476) / důsledek (po 476). */
const PRED_476 = /najat|dlouhé|střídali|Hunové vytlačili/;
const PO_476 = /království|zůstala sama|středověk/;

// ── 5. faktická tvrzení ───────────────────────────────────────────────────
const CLAIMS: [RegExp, RegExp][] = [
  [/Kterého roku zanikla Západořímská říše\?/, /^476$/],
  [/Kterého roku se římská říše rozdělila/, /^395$/],
  [/Kolem kterého roku vpadli Hunové/, /^375$/],
  [/kočovníci vpadli z východu/, /^Hunové$/],
  [/germánský vůdce sesadil/, /^Odoakar$/],
  [/poslední západořímský císař\?/, /^Romulus Augustulus$/],
  [/hlavním městem východní části/, /^Konstantinopol$/],
  [/říkat Východořímské říši/, /^Byzantská/],
  [/vůdce Hunů/, /^Attila$/],
  [/nazývali barbary/, /latinsky/],
  [/ničení cizího majetku/, /^Vandalové$/],
  [/Po smrti kterého císaře/, /^Theodosius I\.$/],
  [/Odkud přišli Hunové/, /asijských/],
  [/přesun kmenů v Evropě/, /^stěhování národů$/],
  [/na útěku před Huny začaly/, /^germánské/],
  [/Co udělaly germánské kmeny/, /hranice/],
  [/plynulo z rozdělení říše/, /každý svého císaře/],
  [/změnilo v Itálii/, /nevládl žádný římský císař/],
  [/Kterou dobu rok 476/, /^Končí starověk, začíná středověk$/],
  [/nezaniklo celé římské impérium/, /východní část/],
  [/by se říše roku 395 nerozdělila/, /pomoc z východu/],
  [/obyvatel Konstantinopole/, /vládne římský císař/],
  [/tichý konec/, /odznaky/],
  [/jezdci z východu/, /^Konec 4\. století, jezdci byli Hunové$/],
  [/nového už nikdo nezvolil/, /konec starověku/],
  [/Punské války/, /vyhrál/],
];

function solve(t: PracticeTask): { kind: string; ok: boolean; why: string } | null {
  const q = t.question;
  const opts = t.options!;
  const distr = opts.filter((o) => o !== t.correctAnswer);

  if (/Ve kterém století/.test(q)) {
    const r = roky(q)[0];
    const exp = `${stoleti(r)}. století`;
    return { kind: "stoleti", ok: t.correctAnswer === exp && !distr.includes(exp), why: `${r} → ${exp}` };
  }
  if (/Kolik let/.test(q)) {
    const [a, b] = roky(q);
    const exp = Math.max(a, b) - Math.min(a, b);
    const num = (s: string) => parseInt(s, 10);
    return { kind: "rozdil", ok: num(t.correctAnswer) === exp && distr.every((d) => num(d) !== exp), why: `${a}, ${b} → ${exp}` };
  }
  if (/proběhla nejdříve\?|proběhla jako poslední\?|nejdříve po vpádu Hunů|až po sesazení/.test(q)) {
    const ys = opts.map(rokUdalosti);
    if (ys.some(Number.isNaN)) return { kind: "rank", ok: false, why: `neznámá událost v ${opts.join(" / ")}` };
    let exp: number;
    if (/nejdříve\?/.test(q)) exp = Math.min(...ys);
    else if (/jako poslední/.test(q)) exp = Math.max(...ys);
    else if (/po vpádu Hunů/.test(q)) exp = Math.min(...ys.filter((y) => y > 375));
    else exp = Math.min(...ys.filter((y) => y > 476));
    const kandidati = opts.filter((o) => rokUdalosti(o) === exp);
    return { kind: "rank", ok: kandidati.length === 1 && kandidati[0] === t.correctAnswer, why: `rok ${exp}` };
  }
  const obd = q.match(/Rok (\d+) n\. l\. patří/);
  if (obd) {
    const r = Number(obd[1]);
    const exp = r <= 476 ? "starověk" : r < 1500 ? "středověk" : "novověk";
    return { kind: "obdobi", ok: t.correctAnswer === exp, why: `${r} → ${exp}` };
  }
  if (/Popis situace/.test(q)) {
    const sit = klasifikuj(q, SITUACE_KW);
    const klic = klasifikuj(t.correctAnswer, MOZNOST_KW);
    const distrOk = distr.every((d) => !klasifikuj(d, MOZNOST_KW).includes(sit[0]));
    return { kind: "pricina", ok: sit.length === 1 && klic.length === 1 && sit[0] === klic[0] && distrOk, why: `situace ${sit} × klíč ${klic}` };
  }
  if (/DŮSLEDEK|PŘÍČINU/.test(q)) {
    const re = /DŮSLEDEK/.test(q) ? PO_476 : PRED_476;
    const druhy = /DŮSLEDEK/.test(q) ? PRED_476 : PO_476;
    const shoda = opts.filter((o) => re.test(o) && !druhy.test(o));
    return { kind: "pricina-dusledek", ok: shoda.length === 1 && shoda[0] === t.correctAnswer, why: shoda.join(" / ") };
  }
  const claim = CLAIMS.find(([re]) => re.test(q));
  if (claim) {
    const shoda = opts.filter((o) => claim[1].test(o));
    return { kind: "claim", ok: shoda.length === 1 && shoda[0] === t.correctAnswer, why: shoda.join(" / ") };
  }
  return null;
}

describe("Stěhování národů — metadata", () => {
  it("dějepis g6, select_one, Starověk / Antika - Řím", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Starověk");
    expect(topic.topic).toBe("Antika - Řím");
    expect(topic.rvpNodeId).toBe("g6-dejepis-starovek-antika-rim-stehovani-narodu-pad-zapadorimske-rise-476");
    expect(topic.studentTitle).toBe("Jak padla Západořímská říše");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Stěhování národů — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 různých úloh, deterministicky (celá banka)", () => {
    const klic = (t: PracticeTask) => `${t.question}|${t.correctAnswer}`;
    expect(new Set(tasks.map(klic)).size).toBeGreaterThanOrEqual(12);
    expect(new Set(topic.generator(level).map(klic))).toEqual(new Set(tasks.map(klic)));
  });

  it("4 různé možnosti, právě 1 správná, klíč není ve znění otázky", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer)).toHaveLength(1);
      expect(t.question.includes(t.correctAnswer), `giveaway: ${t.question}`).toBe(false);
    }
  });

  it("chybový model: každý distraktor má feedback, správná ne", () => {
    for (const t of tasks) {
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
    }
  });

  it("dvě unikátní nápovědy, neprozrazují klíč", () => {
    const vsechny = tasks.flatMap((t) => t.hints ?? []);
    expect(new Set(vsechny).size).toBe(vsechny.length);
    for (const t of tasks) {
      expect(t.hints, t.question).toHaveLength(2);
      for (const h of t.hints!) {
        expect(h.includes(t.correctAnswer), `hint leak: ${t.question}`).toBe(false);
        const cislo = t.correctAnswer.match(/^\d+/);
        if (cislo) expect(roky(h).includes(Number(cislo[0])), `hint prozrazuje číslo: ${h}`).toBe(false);
      }
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s druhou cestou", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(s, `solver nerozpoznal úlohu: ${t.question}`).not.toBeNull();
      expect(s!.ok, `${s!.kind}: ${t.question} → klíč „${t.correctAnswer}“ (${s!.why})`).toBe(true);
    }
  });
});

describe("Stěhování národů — gradace", () => {
  const q = (l: number) => topic.generator(l).map((t) => t.question);

  it("znění otázek L1, L2 a L3 jsou disjunktní", () => {
    const [l1, l2, l3] = [new Set(q(1)), new Set(q(2)), new Set(q(3))];
    expect([...l3].filter((x) => l1.has(x) || l2.has(x))).toHaveLength(0);
    expect([...l2].filter((x) => l1.has(x))).toHaveLength(0);
  });

  it("L2 obsahuje výpočet i chronologii, L3 jen situace a výroky", () => {
    expect(q(2).some((x) => /Ve kterém století/.test(x))).toBe(true);
    expect(q(2).some((x) => /Kolik let/.test(x))).toBe(true);
    expect(q(2).some((x) => /nejdříve|jako poslední/.test(x))).toBe(true);
    expect(q(3).filter((x) => /Popis situace/.test(x)).length).toBeGreaterThanOrEqual(6);
    expect(q(3).some((x) => /^Kterého roku|^Jak se jmenoval/.test(x))).toBe(false);
  });
});
