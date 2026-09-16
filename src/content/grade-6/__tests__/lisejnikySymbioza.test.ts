import { describe, it, expect } from "vitest";
import { LISEJNIKY_SYMBIOZA } from "../prirodopis/lisejnikySymbioza";
import type { PracticeTask } from "@/lib/types";

/**
 * Lišejníky — symbióza, význam (select_one, faktický přírodopis).
 *
 * NEZÁVISLÝ SOLVER: klasifikátor klíčových slov nad textem otázky a možností,
 * bez pohledu na parametry generátoru ani na correctAnswer. Pro každou otázku
 * najde pravidlo, podle kterého vybere právě jednu možnost; ta se musí rovnat
 * klíči. U bioindikace si solver sám přečte ze zadání místo s malým výskytem
 * lišejníků a ověří, že klíč označuje znečištěnější vzduch právě tam.
 */
const topic = LISEJNIKY_SYMBIOZA[0];

type Pravidlo = { q: RegExp; ok: (o: string, q: string) => boolean };

const has = (o: string, ...re: RegExp[]) => re.every((r) => r.test(o));

/** Místo s „málo lišejníky“ přečtené přímo ze znění otázky. */
function mistoSMalo(q: string): string | null {
  const m = q.match(/\. (.+?) na nich skoro nebyly lišejníky/) ?? q.match(/zjistili, že (.+?) na kmenech stromů skoro nerostou/);
  return m ? m[1].toLowerCase() : null;
}

const PRAVIDLA: Pravidlo[] = [
  // ── L3 ──
  { q: /skoro nebyly lišejníky|skoro nerostou lišejníky/, ok: (o, q) => { const m = mistoSMalo(q); return !!m && o.includes(` ${m} `) && has(o, /znečištěn/) && !/obou/.test(o); } },
  { q: /odstranili z lišejníku/, ok: (o) => has(o, /zahyn/, /živin/) },
  { q: /růst samotnou/, ok: (o) => has(o, /chrán/, /houb/) },
  { q: /tmavé skříně/, ok: (o) => has(o, /světl/, /živin/) },
  { q: /Spolužák tvrdí/, ok: (o) => /^nemá/.test(o) && has(o, /zelené buňky/) },
  { q: /bez vláken houby/, ok: (o) => o === "řasa" },
  { q: /lávě/, ok: (o) => has(o, /houb/, /řas/, /vod/) },
  { q: /aby na holé skále přežil/, ok: (o) => has(o, /světl/) },
  { q: /Který vzorek by dokázal žít/, ok: (o) => /^B,/.test(o) && has(o, /živin/) },
  { q: /holou skálu.*jako první/, ok: (o) => o === "lišejníky" },
  { q: /dřív uchytí mech/, ok: (o) => has(o, /lišejník/, /půd/) },
  { q: /stáří/, ok: (o) => has(o, /pomal/) },
  { q: /přesadit/, ok: (o) => has(o, /pomal/) },
  // ── L2 ──
  { q: /pastvin/, ok: (o) => has(o, /pomal/) },
  { q: /z odlomeného kousku/, ok: (o) => has(o, /houba i řasa/) },
  { q: /leží zelené buňky řasy uvnitř/, ok: (o) => has(o, /chrán/) },
  { q: /Co v lišejníku zajišťuje houba/, ok: (o) => has(o, /vod/, /ochran|vyschn/) },
  { q: /síť vláken/, ok: (o) => has(o, /chrán/) },
  { q: /Čím houba .*pomáhá řase/, ok: (o) => has(o, /minerál/, /chrán/) },
  { q: /Co dostává houba.*od řasy/, ok: (o) => has(o, /živin|cukr/) },
  { q: /nemůže žít bez řasy/, ok: (o) => has(o, /fotosynt|živin/) },
  { q: /zelené buňky uvnitř/, ok: (o) => has(o, /fotosynt/) },
  { q: /průkopníci/, ok: (o) => has(o, /půd/, /holou|skál/) },
  { q: /na holém kameni, kde není půda/, ok: (o) => has(o, /houb/, /řas|sinic/) },
  { q: /vzniku půdy/, ok: (o) => has(o, /rozruš|zbytk/) },
  { q: /samotná řasa uschla/, ok: (o) => has(o, /houb/, /chrán/) },
  { q: /samotná houba .*nepřežije/, ok: (o) => has(o, /živin/, /řas|sinic/) },
  { q: /sucho i mráz/, ok: (o) => has(o, /houb/, /chrán/) },
  { q: /K čemu lidé využívají/, ok: (o) => has(o, /ovzduš/) },
  { q: /ukazatel čistoty/, ok: (o) => has(o, /citliv/) },
  // ── L1 ──
  { q: /jako první osídlí holé místo/, ok: (o) => o === "průkopníci" },
  { q: /Z jakých organismů/, ok: (o) => has(o, /houb/, /řas|sinic/) },
  { q: /vyrábí živiny fotosyntézou/, ok: (o) => has(o, /řas|sinic/) && !/houb/.test(o) },
  { q: /prospěch oba/, ok: (o) => has(o, /symbióz/) },
  { q: /Kde běžně/, ok: (o) => has(o, /kůř|kamen|skál|střech/) },
  { q: /šedé keříčky/, ok: (o) => has(o, /dutohlávk/) },
  { q: /žluté až oranžové/, ok: (o) => has(o, /terčovník/) },
  { q: /Jak rychle/, ok: (o) => has(o, /pomal/) },
  { q: /proti kašli/, ok: (o) => has(o, /pukléřk/) },
  { q: /šedé vousy/, ok: (o) => has(o, /provazovk/) },
  { q: /tělo houby/, ok: (o) => has(o, /vlák/) },
  { q: /nemá zelené barvivo/, ok: (o) => o === "houba" },
  { q: /^Co je lišejník/, ok: (o) => has(o, /soužití/, /houb/) },
  { q: /děj, při kterém/, ok: (o) => has(o, /fotosyntéz/) },
  { q: /místo řasy/, ok: (o) => has(o, /sinic/) },
];

function solve(t: PracticeTask): string[] | null {
  const p = PRAVIDLA.find((r) => r.q.test(t.question));
  if (!p) return null;
  return t.options!.filter((o) => p.ok(o, t.question));
}

const ZAKAZANY_KLIC = /rostlin|\bmech|parazit|cizopas|plís/;

describe("Lišejníky — metadata", () => {
  it("přírodopis g6, select_one, přesná RVP kategorie a téma", () => {
    expect(topic.id).toBe("g6-pri-lisejniky-symbioza-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.inputType).toBe("select_one");
    // category = RVP area, topic = RVP topic (podtéma je v rvpNodeId)
    expect(topic.category).toBe("Biologie hub");
    expect(topic.topic).toBe("Houby a lišejníky");
    expect(topic.rvpNodeId).toBe("g6-prirodopis-biologie-hub-houby-a-lisejniky-lisejniky-symbioza-vyznam");
  });
});

describe.each([1, 2, 3])("Lišejníky — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních otázek", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
  });

  it("4 různé možnosti, klíč mezi nimi, feedback u každého distraktoru", () => {
    for (const t of tasks) {
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

  it("NEZÁVISLÝ SOLVER: právě jedna možnost vyhovuje pravidlu a je to klíč", () => {
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

  it("klíč nevyčnívá tvarem ani délkou", () => {
    let nejdelsi = 0;
    for (const t of tasks) {
      const distr = t.options!.filter((o) => o !== t.correctAnswer);
      const prvni = (s: string) => s.split(/[\s,]/)[0];
      const slova = distr.map(prvni);
      if (slova.every((w) => w === slova[0])) expect(prvni(t.correctAnswer), t.question).toBe(slova[0]);
      if (t.correctAnswer.length > Math.max(...distr.map((d) => d.length)) + 3) nejdelsi++;
    }
    expect(nejdelsi / tasks.length).toBeLessThan(0.34);
  });

  it("deterministicky dost úloh při opakovaném volání", () => {
    for (let k = 0; k < 5; k++) {
      expect(new Set(topic.generator(level).map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    }
  });
});

describe("Lišejníky — gradace", () => {
  it("znění L1, L2 a L3 jsou disjunktní; L3 je popis případu", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l2 = new Set(topic.generator(2).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) {
      expect(l1.has(q)).toBe(false);
      expect(l2.has(q)).toBe(false);
      expect(q).toMatch(/^(Na výletě|Vědci|Tereza|Ondřej|Klára|Matěj|Eliška|Jakub)/);
    }
    for (const q of l2) expect(l1.has(q)).toBe(false);
  });
});
