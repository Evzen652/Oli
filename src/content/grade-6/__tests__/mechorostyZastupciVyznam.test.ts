import { describe, it, expect, vi, afterEach } from "vitest";
import { MECHOROSTY_ZASTUPCI_VYZNAM } from "../prirodopis/mechorostyZastupciVyznam";
import type { PracticeTask } from "@/lib/types";

/**
 * Mechorosty — zástupci, význam (select_one, faktický přírodopis).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, bez pohledu na banku ani na correctAnswer):
 *  • L3 určování zástupce: klasifikátor znaků ze ZNĚNÍ otázky
 *    (chlupatá čepička / tuhá lodyžka → ploník; bělavý / nasákne / odumírá →
 *    rašeliník; zkroucené / zkadeřené lístky → měřík; plochá stélka bez
 *    lodyžky → porostnice). Výsledek musí být mezi možnostmi a rovnat se klíči.
 *  • Ostatní úlohy: mapa „klíčové slovo otázky → očekávaný pojem v možnosti“.
 *    Pravidlu musí vyhovět právě jedna možnost a ta je klíčem.
 */
const topic = MECHOROSTY_ZASTUPCI_VYZNAM[0];

const ZASTUPCI = ["ploník", "rašeliník", "měřík", "porostnice"];

/** Klasifikátor znaků popisu → zástupce (null, když popis není určovací). */
function urciZastupce(q: string): string | null {
  const hit: string[] = [];
  if (/chlupat|nejvyšší/.test(q)) hit.push("ploník");
  if (/bělav|nasák|odumír|odumřel|mokřadech/.test(q)) hit.push("rašeliník");
  if (/zkrouc|zkadeř|vlnit|svrašt/.test(q)) hit.push("měřík");
  if (/plochá|plochý|lodyžku ani lístky|bez lodyžky|játrovka/.test(q)) hit.push("porostnice");
  return hit.length === 1 ? hit[0] : null;
}

type Pravidlo = { q: RegExp; ok: (o: string) => boolean };
const has = (o: string, ...re: RegExp[]) => re.every((r) => r.test(o));

const PRAVIDLA: Pravidlo[] = [
  // ── L3 ──
  { q: /dlouhé stopce/, ok: (o) => has(o, /vítr/, /výtrus/) },
  { q: /prázdných buněk/, ok: (o) => has(o, /nasákne/, /mnohonásob/) },
  { q: /vysává stromu šťávu/, ok: (o) => has(o, /přichycen/, /fotosyntéz/) },
  { q: /ukazuje vždy na sever/, ok: (o) => has(o, /vlhko a stín/) },
  { q: /nové tobolky/, ok: (o) => has(o, /doplaval/) },
  { q: /řadíme k mechorostům/, ok: (o) => has(o, /výtrus/, /oplození/) },
  { q: /poušti/, ok: (o) => has(o, /mlha|déšť/) },
  { q: /vyvrtali/, ok: (o) => has(o, /bez vzduchu/) },
  { q: /Který z nich je mech/, ok: (o) => has(o, /lodyžk/, /lístk/) },
  { q: /pravé kořeny a cévy jako/, ok: (o) => has(o, /z půdy/, /výš/) },
  // ── L2 ──
  { q: /těžký a mokrý/, ok: (o) => has(o, /zadržuje/) },
  { q: /borůvky/, ok: (o) => has(o, /rašeliník/) },
  { q: /Proč mechy rostou hlavně na vlhkých/, ok: (o) => has(o, /oplození/) },
  { q: /holé skále/, ok: (o) => has(o, /půd/) },
  { q: /odvodnit horské rašeliniště/, ok: (o) => has(o, /zadržuje vodu/, /pomalu/) },
  { q: /splavovat/, ok: (o) => has(o, /zadrží/) },
  { q: /úkrytem/, ok: (o) => has(o, /vlhko/) },
  { q: /zábaly/, ok: (o) => has(o, /rašelin/) },
  { q: /zaléval/, ok: (o) => has(o, /lístky/) },
  { q: /nádobku na tenké stopce/, ok: (o) => has(o, /tobolk/, /výtrus/) },
  { q: /pod stromy, ale na slunném/, ok: (o) => has(o, /vlhč/) },
  { q: /přívalovém/, ok: (o) => has(o, /nasákne/, /pomalu/) },
  { q: /crčela/, ok: (o) => has(o, /prázdné buňky/) },
  { q: /střeše nebo na zdi/, ok: (o) => has(o, /vlákn/, /dešt/) },
  { q: /parapetu a nezalévat/, ok: (o) => has(o, /vyschne/) },
  { q: /betlém/, ok: (o) => has(o, /drží vodu/) },
  // ── L1 ──
  { q: /přichytí/, ok: (o) => has(o, /vlákn/) && !/kořen/.test(o) },
  { q: /rozmnožují/, ok: (o) => o === "výtrusy" },
  { q: /dozrávají výtrusy/, ok: (o) => o === "tobolka" },
  { q: /Jaká hnědá hmota/, ok: (o) => o === "rašelina" },
  { q: /Kde nejčastěji roste měřík/, ok: (o) => has(o, /vlhk/, /les/) },
  { q: /Do které skupiny/, ok: (o) => o === "rostliny" },
  { q: /získává cukry/, ok: (o) => has(o, /fotosyntéz/) },
  { q: /přijímá vodu/, ok: (o) => has(o, /povrch/) },
  { q: /k oplození/, ok: (o) => o === "vodu" },
  { q: /Kde mechy nejčastěji/, ok: (o) => has(o, /vlhk/, /stinn/) },
  { q: /Kolik vody/, ok: (o) => has(o, /mnohonásob/) },
  { q: /tělo ploníku/, ok: (o) => has(o, /lodyžk/, /lístk/) && !/kořen/.test(o) },
];

function solve(t: PracticeTask): string[] | null {
  const z = urciZastupce(t.question);
  if (z && t.options!.every((o) => ZASTUPCI.includes(o))) return t.options!.filter((o) => o === z);
  const p = PRAVIDLA.find((r) => r.q.test(t.question));
  if (!p) return null;
  return t.options!.filter((o) => p.ok(o));
}

const ZAKAZANY_KLIC = /kořen|semen|květ|houba/;

describe("Mechorosty — metadata", () => {
  it("přírodopis g6, select_one, přesná RVP kategorie a téma", () => {
    expect(topic.id).toBe("g6-pri-mechorosty-zastupci-vyznam-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Biologie rostlin");
    expect(topic.topic).toBe("Nižší rostliny");
    expect(topic.rvpNodeId).toBe("g6-prirodopis-biologie-rostlin-nizsi-rostliny-mechorosty-zastupci-vyznam");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Mechorosty — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních otázek", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
  });

  it("select_one: 4 různé možnosti, klíč mezi nimi, feedback u každého distraktoru", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toBeDefined();
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options).toContain(t.correctAnswer);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("NEZÁVISLÝ SOLVER: právě jedna možnost vyhovuje a je to klíč", () => {
    for (const t of tasks) {
      const s = solve(t);
      expect(s, `solver nerozpoznal úlohu: ${t.question}`).not.toBeNull();
      expect(s, `${t.question} → ${t.options!.join(" | ")}`).toEqual([t.correctAnswer]);
    }
  });

  it("klíč není zakázaná nepravda a nezazní v otázce ani v nápovědě", () => {
    for (const t of tasks) {
      expect(ZAKAZANY_KLIC.test(t.correctAnswer), t.correctAnswer).toBe(false);
      expect(t.question.includes(t.correctAnswer), t.question).toBe(false);
      expect(t.hints!.length).toBe(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) expect(h.includes(t.correctAnswer), `hint leak: ${h}`).toBe(false);
    }
  });

  it("nápovědy se liší napříč úlohami", () => {
    const podleOtazky = new Map<string, string>();
    for (const t of tasks) podleOtazky.set(t.question, t.hints![0]);
    expect(new Set(podleOtazky.values()).size).toBe(podleOtazky.size);
  });

  it("klíč nevyčnívá délkou ani tvarem", () => {
    let klic = 0;
    let distr = 0;
    for (const t of tasks) {
      const ds = t.options!.filter((o) => o !== t.correctAnswer);
      klic += t.correctAnswer.length;
      distr += ds.reduce((a, d) => a + d.length, 0) / ds.length;
      const prvni = (s: string) => s.split(/[\s,]/)[0];
      const slova = ds.map(prvni);
      if (slova.every((w) => w === slova[0])) expect(prvni(t.correctAnswer), t.question).toBe(slova[0]);
    }
    expect(klic / tasks.length).toBeLessThanOrEqual(1.3 * (distr / tasks.length));
  });
});

describe("Mechorosty — gradace a determinismus", () => {
  afterEach(() => vi.restoreAllMocks());

  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l2 = new Set(topic.generator(2).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) {
      expect(l1.has(q)).toBe(false);
      expect(l2.has(q)).toBe(false);
    }
    for (const q of l2) expect(l1.has(q)).toBe(false);
  });

  it("L3 obsahuje určování zástupce z popisu i úvahové úlohy", () => {
    const l3 = topic.generator(3);
    expect(l3.some((t) => ZASTUPCI.includes(t.correctAnswer))).toBe(true);
    expect(l3.some((t) => !ZASTUPCI.includes(t.correctAnswer))).toBe(true);
  });

  it.each([1, 2, 3])("level %i: stejný seed → stejný výstup", (level) => {
    const seeded = () => {
      let s = 42;
      return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
      };
    };
    vi.spyOn(Math, "random").mockImplementation(seeded());
    const a = topic.generator(level);
    vi.restoreAllMocks();
    vi.spyOn(Math, "random").mockImplementation(seeded());
    const b = topic.generator(level);
    expect(b).toEqual(a);
  });
});
