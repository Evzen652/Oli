import { describe, it, expect } from "vitest";
import { MAPOVE_ZNACKY_ORIENTACE } from "../zemepis/mapoveZnackyOrientace";
import type { PracticeTask } from "@/lib/types";

/**
 * Mapové značky, orientace na mapě — FAKTICKÝ + ÚSUDKOVÝ vzor select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta) — z generátoru nebere žádná data, jen text úlohy:
 *  • posuny na mapě („o 3 cm nahoru a o 3 cm doleva“, „šikmo doprava dolů“)
 *    se sečtou jako vektor a znaménka se převedou vlastní tabulkou osmi směrů;
 *  • inverze: směr ze zadání se otočí o 180° (úhlová aritmetika, ne tabulka opaků);
 *  • úseky cesty („2 km na sever“) se sečtou jako vektory;
 *  • Slunce: úhel pohledu = 180° − poloha Slunce vůči tělu, dotaz se přičte;
 *  • vrstevnice: husté = prudký, řídké = mírný; tok: z hnědé do zelené části;
 *  • legenda a pojmy (L1): klasifikátor klíčových slov otázka → klíč.
 */
const topic = MAPOVE_ZNACKY_ORIENTACE[0];

// Vlastní tabulka: úhel (po směru hodinových ručiček od severu) → názvy.
const NAZVY: Record<number, { na: string; adv: string; k: string }> = {
  0: { na: "na sever", adv: "severně", k: "k severu" },
  45: { na: "na severovýchod", adv: "severovýchodně", k: "k severovýchodu" },
  90: { na: "na východ", adv: "východně", k: "k východu" },
  135: { na: "na jihovýchod", adv: "jihovýchodně", k: "k jihovýchodu" },
  180: { na: "na jih", adv: "jižně", k: "k jihu" },
  225: { na: "na jihozápad", adv: "jihozápadně", k: "k jihozápadu" },
  270: { na: "na západ", adv: "západně", k: "k západu" },
  315: { na: "na severozápad", adv: "severozápadně", k: "k severozápadu" },
};
const norm = (u: number) => ((u % 360) + 360) % 360;
const uhelZNazvu = (slovo: string): number => {
  const hit = Object.entries(NAZVY).find(([, n]) => n.na === slovo || n.na === `na ${slovo}` || n.adv === slovo);
  expect(hit, `neznámý směr „${slovo}“`).toBeDefined();
  return +hit![0];
};
/** Vektor (x doprava, y nahoru) → úhel; šikmé směry musí mít obě složky stejně velké. */
function uhelZVektoru(x: number, y: number): number {
  expect(x !== 0 || y !== 0, "nulový posun").toBe(true);
  if (x !== 0 && y !== 0) expect(Math.abs(x), "šikmý posun s různě dlouhými složkami je nejednoznačný").toBe(Math.abs(y));
  return norm(Math.round((Math.atan2(x, y) * 180) / Math.PI));
}
const vektorZUhlu = (u: number): [number, number] => [
  Math.round(Math.sin((u * Math.PI) / 180)),
  Math.round(Math.cos((u * Math.PI) / 180)),
];

const SLUNCE_REL: Record<string, number> = {
  "přímo před sebou": 0, "po pravé ruce": 90, "přímo za zády": 180, "po levé ruce": 270,
};
const CAST: Record<string, [number, number]> = {
  "horní části": [0, 1], "dolní části": [0, -1], "levé části": [-1, 0], "pravé části": [1, 0],
  "pravém horním rohu": [1, 1], "levém horním rohu": [-1, 1], "pravém dolním rohu": [1, -1], "levém dolním rohu": [-1, -1],
};

/** L1 — klasifikátor klíčových slov: otázka → regex správné odpovědi. */
const L1: [RegExp, RegExp][] = [
  [/modrou plnou čarou/, /^vodní tok/],
  [/modře vybarvenou plochou/, /^vodní plocha/],
  [/turistické mapě vyznačeno zeleně/, /^les$/],
  [/zelená barva na obecně zeměpisné/, /^nížiny/],
  [/hnědá barva na obecně zeměpisné/, /^hory/],
  [/Co je na mapě vrstevnice/, /stejnou nadmořskou výškou/],
  [/černý trojúhelník/, /^vrchol/],
  [/vysvětluje, co znamenají/, /^legenda$/],
  [/magnetické střelky/, /buzola|kompas/],
  [/otočíš tak, aby její sever/, /^zorientovat/],
  [/Kde je na mapě obvykle sever/, /horního/],
  [/na mapě dole/, /^jih$/],
  [/na mapě vpravo/, /^východ$/],
  [/na mapě vlevo/, /^západ$/],
  [/vedlejší, ne hlavní/, /^(severo|jiho)(východ|západ)$/],
  [/Slunce v poledne\?/, /^na jihu$/],
  [/ráno vychází/, /na východě$/],
  [/přerušovaná čára mezi dvěma barvami/, /^hranici/],
  [/silná červená čára/, /silnici$/],
  [/hustě u sebe\?/, /^prudký svah$/],
];

/** Nezávislý solver: vrací regex nebo přesný řetězec správné odpovědi. */
function solve(t: PracticeTask): string | RegExp {
  const q = t.question;
  let m: RegExpMatchArray | null;

  // L2 — posun prstu v centimetrech
  if (/posuneš prst/.test(q)) {
    let x = 0, y = 0;
    for (const p of q.matchAll(/o (\d+) cm (nahoru|dolů|doleva|doprava)/g)) {
      const n = +p[1];
      if (p[2] === "nahoru") y += n; else if (p[2] === "dolů") y -= n;
      else if (p[2] === "doprava") x += n; else x -= n;
    }
    return NAZVY[uhelZVektoru(x, y)].na;
  }
  // L2 — cesta mezi značkami
  if ((m = q.match(/vede na mapě (přímo|šikmo) (doprava|doleva|nahoru|dolů)(?: (nahoru|dolů))?\./))) {
    let x = 0, y = 0;
    for (const w of [m[2], m[3]]) {
      if (w === "nahoru") y = 1; if (w === "dolů") y = -1;
      if (w === "doprava") x = 1; if (w === "doleva") x = -1;
    }
    expect(m[1] === "šikmo", `šikmo/přímo nesedí: ${q}`).toBe(x !== 0 && y !== 0);
    return NAZVY[uhelZVektoru(x, y)].na;
  }
  // L2 — obce na opačných březích potoka; zadání musí říct i to, že leží
  // přímo proti sobě, jinak z něj plyne jen jedna složka směru (regex to hlídá)
  if ((m = q.match(/Obec \S+ leží (\S+) od potoka, obec \S+ přímo naproti ní (\S+) od něj\./))) {
    const u1 = uhelZNazvu(m[1]), u2 = uhelZNazvu(m[2]);
    expect(norm(u1 - u2), "obce nejsou na opačných březích").toBe(180);
    return NAZVY[u1].na;
  }
  // L3 — inverze
  if ((m = q.match(/^\S+ leží (\S+) od .+?\. Kde leží .+ vzhledem k/))) {
    return NAZVY[norm(uhelZNazvu(m[1]) + 180)].adv;
  }
  // L3 — úseky cesty
  if (/km na /.test(q)) {
    let x = 0, y = 0;
    for (const p of q.matchAll(/(\d+) km na (\S+?)(?=[ ,.])/g)) {
      const [vx, vy] = vektorZUhlu(uhelZNazvu(p[2]));
      x += +p[1] * vx; y += +p[1] * vy;
    }
    // Zrušené úseky → zbyde hlavní strana; jinak šikmo se stejnými složkami.
    return NAZVY[uhelZVektoru(x, y)].adv;
  }
  // L3 — polední Slunce
  if ((m = q.match(/Slunce máš (.+?)\. (.+)$/))) {
    const rel = SLUNCE_REL[m[1]];
    expect(rel, `neznámá poloha Slunce: ${m[1]}`).toBeDefined();
    const pohled = norm(180 - rel);
    const d = m[2];
    const dotaz = /čelem vzad/.test(d) ? 180 : /pravá ruka/.test(d) ? 90 : /levá ruka/.test(d) ? 270 : /díváš\?$/.test(d) ? 0 : NaN;
    expect(Number.isNaN(dotaz), `neznámý dotaz: ${d}`).toBe(false);
    return NAZVY[norm(pohled + dotaz)].na;
  }
  // L3 — vrstevnice
  if ((m = q.match(/na (\S+) svahu hustě u sebe, na (\S+) svahu daleko od sebe/))) {
    const [husty, ridky] = [m[1], m[2]];
    if (/mírnější|nejmírnější/.test(q)) return `po ${ridky} svahu, vrstevnice jsou tam řidší`;
    if (/prudší|nejstrmější/.test(q)) return `na ${husty} svahu, vrstevnice jsou tam hustší`;
    throw new Error(`vrstevnice: neznámý dotaz ${q}`);
  }
  // L3 — směr toku z barev
  if ((m = q.match(/V (.+?) mapy je území vybarvené tmavě hnědě, v (.+?) zeleně\./))) {
    const hory = CAST[m[1]], niz = CAST[m[2]];
    expect(hory && niz, `neznámá část mapy: ${m[1]} / ${m[2]}`).toBeTruthy();
    expect(hory[0] + niz[0], "hory a nížina nejsou naproti sobě").toBe(0);
    expect(hory[1] + niz[1], "hory a nížina nejsou naproti sobě").toBe(0);
    return NAZVY[uhelZVektoru(niz[0] - hory[0], niz[1] - hory[1])].k;
  }
  // L1 — klasifikátor
  const hit = L1.find(([r]) => r.test(q));
  if (hit) return hit[1];
  throw new Error(`solver nezná úlohu: ${q}`);
}

const matches = (o: string, exp: string | RegExp) => (typeof exp === "string" ? o === exp : exp.test(o));
const wholeWord = (text: string, s: string) =>
  new RegExp(`(^|[^\\p{L}])${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\p{L}]|$)`, "iu").test(text);

describe("Mapové značky — metadata", () => {
  it("zeměpis g6, select_one, kategorie a téma dle RVP", () => {
    expect(topic.subject).toBe("zemepis");
    expect(topic.id).toBe("g6-zem-mapove-znacky-orientace-6");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Geografické informace, zdroje dat, kartografie");
    expect(topic.topic).toBe("Mapa a glóbus");
    expect(topic.rvpNodeId).toBe("g6-zemepis-geograficke-informace-zdroje-dat-kartogr-mapa-a-globus-mapove-znacky-orientace-na-mape");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Mapové značky — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥ 12 unikátních úloh", () => {
    expect(new Set(tasks.map((t) => `${t.question}|${t.correctAnswer}`)).size).toBeGreaterThanOrEqual(12);
  });

  it("4 různé možnosti, klíč mezi nimi", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toBeDefined();
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options, t.question).toContain(t.correctAnswer);
    }
  });

  it("nezávislý solver: právě jedna možnost je správná a je to klíč", () => {
    for (const t of tasks) {
      const exp = solve(t);
      const spravne = t.options!.filter((o) => matches(o, exp));
      expect(spravne, `${t.question}\n→ ${String(exp)}\n${t.options!.join(" | ")}`).toEqual([t.correctAnswer]);
    }
  });

  it("chybový model: feedback u každého distraktoru, u klíče ne", () => {
    for (const t of tasks) {
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback?.[t.correctAnswer]).toBeUndefined();
    }
  });

  it("klíč není ve znění, nápověda ho neprozrazuje, dvě různé nápovědy", () => {
    for (const t of tasks) {
      expect(wholeWord(t.question, t.correctAnswer), `giveaway: ${t.question}`).toBe(false);
      expect(t.hints!.length).toBe(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) expect(h.includes(t.correctAnswer), `hint leak: ${h}`).toBe(false);
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("úloha jde vyřešit bez obrázku", () => {
    for (const t of tasks) {
      const texty = [t.question, ...(t.hints ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(s, t.question).not.toMatch(/na obrázku|podívej se na mapu/i);
    }
  });

  it("klíč není systematicky výrazně nejdelší možnost", () => {
    const nejdelsi = tasks.filter((t) => {
      const ostatni = t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length);
      return t.correctAnswer.length >= 1.25 * Math.max(...ostatni);
    }).length;
    expect(nejdelsi / tasks.length).toBeLessThan(0.35);
  });
});

describe("Mapové značky — gradace a determinismus", () => {
  it("otázky L1 a L3 jsou disjunktní, L2 se s L1 nepřekrývá", () => {
    const q = (l: number) => new Set(topic.generator(l).map((t) => t.question));
    const [l1, l2, l3] = [q(1), q(2), q(3)];
    expect([...l1].filter((x) => l3.has(x))).toEqual([]);
    expect([...l1].filter((x) => l2.has(x))).toEqual([]);
  });

  it("L1 banka má ≥ 14 různých faktů", () => {
    expect(new Set(topic.generator(1).map((t) => t.question)).size).toBeGreaterThanOrEqual(14);
  });

  it("stejný seed → stejné úlohy i po posunu globálního stavu", () => {
    const seeded = (seed: number) => {
      let a = seed >>> 0;
      return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let x = a;
        x = Math.imul(x ^ (x >>> 15), x | 1);
        x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
      };
    };
    const otisk = () => {
      const puvodni = Math.random;
      Math.random = seeded(12345);
      try {
        return JSON.stringify([1, 2, 3].map((l) => topic.generator(l).map((t) => [t.question, t.correctAnswer])));
      } finally {
        Math.random = puvodni;
      }
    };
    const a = otisk();
    topic.generator(2);
    expect(otisk()).toBe(a);
  });
});
