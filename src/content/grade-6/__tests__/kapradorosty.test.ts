import { describe, it, expect } from "vitest";
import { KAPRADOROSTY } from "../prirodopis/kapradorosty";
import { klicUlohy } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Kapraďorosty — faktické select_one téma přírodopisu 6. ročníku.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta): pracuje jen se zněním otázky a možnostmi,
 * parametry ani banku generátoru nečte.
 *  1) tabulka zástupců (jméno → skupina) — u otázek na zařazení najde jméno ve
 *     znění, u výběru ze zástupců zařadí každou možnost a hledá jedinou vyhovující;
 *  2) klasifikátor klíčových slov pro popisy (článkovaný/přesleny → přeslička,
 *     drobné lístky + plazivá → plavuň, zpeřené/stočené/kupky → kapradina,
 *     bez kořenů → mech) — popis musí ukazovat na právě jednu skupinu;
 *  3) faktická pravidla — rozmnožování = výtrusy, žádný klíč netvrdí, že
 *     kapraďorost má květ nebo semeno;
 *  4) ostatní otázky: nezávisle sepsaný kmen správné odpovědi.
 * Každá úloha musí být rozpoznána právě jedním pravidlem.
 */
const topic = KAPRADOROSTY[0];
const low = (s: string) => s.toLowerCase();

// ── 1) Tabulka zástupců ─────────────────────────────────────────────────────
type Skupina = "kapradiny" | "přesličky" | "plavuně" | "mechy" | "trávy" | "jehličnany" | "kvetoucí";
const ZASTUPCI: [RegExp, Skupina][] = [
  [/hasivk/, "kapradiny"],
  [/osladič/, "kapradiny"],
  [/sleziník/, "kapradiny"],
  [/kapra(ď|d\S*) sam/, "kapradiny"],
  [/přeslič\S* (roln|lesn)/, "přesličky"],
  [/plavuň\S* vidlač/, "plavuně"],
  [/plavuník/, "plavuně"],
  [/rašeliník/, "mechy"],
  [/ploník/, "mechy"],
  [/pýr/, "trávy"],
  [/smrk/, "jehličnany"],
  [/jedl/, "jehličnany"],
  [/borůvk/, "kvetoucí"],
  [/pampeliš/, "kvetoucí"],
];
const KAPRADOROST: Skupina[] = ["kapradiny", "přesličky", "plavuně"];
const KMEN: Record<string, RegExp> = {
  kapradiny: /kapradin/,
  přesličky: /přeslič/,
  plavuně: /plavun/,
  mechy: /mech/,
};

function skupiny(text: string): Skupina[] {
  const t = low(text);
  return [...new Set(ZASTUPCI.filter(([r]) => r.test(t)).map(([, g]) => g))];
}
function jedinaSkupina(text: string): Skupina {
  const g = skupiny(text);
  expect(g, `zástupce nerozpoznán jednoznačně: ${text}`).toHaveLength(1);
  return g[0];
}

// ── 2) Klasifikátor popisu ─────────────────────────────────────────────────
function skupinaZPopisu(q: string): string {
  const t = low(q);
  const hit: string[] = [];
  if (/článkovan|přesleny|z článků|kruhy tenkých/.test(t)) hit.push("přesličky");
  if (/drobnými lístky/.test(t) && /plaziv/.test(t)) hit.push("plavuně");
  if (/zpeřen|stočen|kup(ky|ek)/.test(t)) hit.push("kapradiny");
  if (/nemá (však )?pravé kořeny|bez kořenů|bez cévních svazků/.test(t)) hit.push("mechy");
  if (/s kořeny a cévními svazky/.test(t) && /bez květů/.test(t) && /výtrus/.test(t)) hit.push("kapraďorost");
  expect(hit, `popis musí ukazovat na právě jednu skupinu: ${q}`).toHaveLength(1);
  return hit[0];
}
const kmenSkupiny = (g: string): RegExp => (g === "kapraďorost" ? /kapraďorost/ : KMEN[g]);

type Pravidlo = { name: string; test: (t: PracticeTask) => boolean; check: (t: PracticeTask) => void };
const re = (name: string, r: RegExp, kmen: RegExp): Pravidlo => ({
  name,
  test: (t) => r.test(t.question),
  check: (t) => expect(low(t.correctAnswer), `${name}: ${t.question}`).toMatch(kmen),
});

const PRAVIDLA: Pravidlo[] = [
  {
    name: "zařazení zástupce",
    test: (t) => /^(Do které skupiny rostlin patří|Kam zařadíš) /.test(t.question),
    check: (t) => {
      const g = jedinaSkupina(t.question);
      const k = low(t.correctAnswer);
      // „Do které skupiny“ se ptá na skupinu kapraďorostů, „Kam zařadíš“ na velkou skupinu.
      const hledana = /^Do které skupiny/.test(t.question) || !KAPRADOROST.includes(g) ? KMEN[g] : /kapraďorost/;
      expect(k, t.question).toMatch(hledana);
      // giveaway: znění nesmí obsahovat kmen skupiny, na kterou se ptá
      expect(low(t.question), `giveaway: ${t.question}`).not.toMatch(hledana);
    },
  },
  {
    name: "výběr ze zástupců",
    test: (t) => /^(Která|Který) z těchto /.test(t.question),
    check: (t) => {
      const q = t.question;
      const vyhovuje = (g: Skupina): boolean =>
        /NENÍ kapraďorost/.test(q) ? !KAPRADOROST.includes(g)
          : /kupek na rubu listů/.test(q) ? g === "kapradiny"
            : KAPRADOROST.includes(g);
      const ok = t.options!.filter((o) => vyhovuje(jedinaSkupina(o)));
      expect(ok, `právě jedna vyhovující možnost: ${q}`).toHaveLength(1);
      expect(t.correctAnswer).toBe(ok[0]);
    },
  },
  {
    name: "rostlina z popisu",
    test: (t) => /Kam ji zařadíš\?|Co z toho plyne\?|Může to být kapraďorost\?|Jak to je\?|Proč nemá pravdu\?/.test(t.question),
    check: (t) => expect(low(t.correctAnswer), t.question).toMatch(kmenSkupiny(skupinaZPopisu(t.question))),
  },
  // L1
  re("rozmnožování", /Čím se rozmnožují kapraďorosty/, /výtrus/),
  re("nikdy nevytvoří", /nikdy nevytvoří/, /květ.*semen/),
  re("kde vznikají výtrusy", /V čem se tvoří výtrusy/, /výtrusnic/),
  re("stonek kapradin", /Jaký stonek mají kapradiny/, /oddenek/),
  re("výtrusnice kapradě", /výtrusnice u kapradě/, /rub/),
  re("šíření výtrusů", /dostanou daleko od mateřské/, /vítr/),
  re("výtrusnice přesličky", /Kde má výtrusnice přeslička/, /klas.*jarní/),
  re("výtrusnice plavuně", /Kde nese výtrusnice plavuň/, /klas/),
  re("kořeny vs mechy", /ale mechy ne\?/, /kořen/),
  re("vedení vody", /vede voda od kořene/, /cévní/),
  re("mladý list", /mladý list kapradiny/, /spirál/),
  re("listy plavuně", /Jaké listy má plavuň/, /drobn.*lístk/),
  // L2
  re("oddenek", /slouží kapradině podzemní oddenek/, /zásob/),
  re("drsné lodyhy", /Proč jsou lodyhy přesličky drsné/, /křemík/),
  re("výška", /výš než mechy/, /cévní/),
  re("kořeny k čemu", /K čemu kapradině slouží kořeny/, /sají vodu/),
  re("jarní lodyha", /jarní hnědá lodyha/, /klas.*výtrusnic/),
  re("letní lodyha", /letní zelená lodyha/, /fotosyntéz/),
  re("drhnutí", /drhnutí/, /křemík/),
  re("rozdíl lodyh", /rozdíl mezi jarní a letní/, /^jarní je hnědá s klasem/),
  re("stanoviště kapradě", /Kde v české přírodě nejčastěji roste kapraď/, /vlhk.*les/),
  re("ochrana plavuní", /nesmějí trhat/, /chráněn/),
  re("zahrádkáři", /zahrádkáře/, /oddenk/),
  re("stanoviště přesličky", /najdeš přesličku lesní/, /vlhk/),
  // L3
  re("uhlí z čeho", /Z čeho asi hlavně vzniklo černé uhlí/, /kapraďorost/),
  re("pravěcí příbuzní", /prozrazují zkameněliny/, /strom/),
  re("článkované kmeny", /Kterým dnešním rostlinám/, /přeslič/),
  re("bez květů v uhlí", /nenacházejí zkamenělé květy/, /nerostly/),
  re("vlhká místa", /na vlhkých místech, přestože/, /výtrus.*vlhk/),
  re("velké listy ve stínu", /velké rozložené listy/, /světl/),
  re("křemík", /hodně křemíku\. Jak/, /pevn/),
  re("pomalá obnova", /vyroste nová rostlina až za mnoho let/, /dlouho/),
];

function solve(t: PracticeTask): Pravidlo {
  const hit = PRAVIDLA.filter((p) => p.test(t));
  expect(hit.map((p) => p.name), `solver musí úlohu rozpoznat právě jedním pravidlem: ${t.question}`).toHaveLength(1);
  return hit[0];
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\d]+/gu, " ").trim();
const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");

function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("Kapraďorosty — metadata", () => {
  it("přírodopis g6, select_one, přesné RVP zařazení", () => {
    expect(topic.id).toBe("g6-pri-kapradorosty-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.rvpNodeId).toBe("g6-prirodopis-biologie-rostlin-nizsi-rostliny-kapradorosty-kapradiny-preslicky-plavune");
    expect(topic.category).toBe("Biologie rostlin");
    expect(topic.topic).toBe("Nižší rostliny");
    expect(topic.title).toBe("Kapraďorosty - kapradiny, přesličky, plavuně");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Kapraďorosty — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh a determinismus při stejném seedu", () => {
    expect(new Set(tasks.map(klicUlohy)).size).toBeGreaterThanOrEqual(12);
    const puvodni = Math.random;
    try {
      Math.random = seeded(7);
      const a = topic.generator(level).map((t) => [t.question, t.options]);
      Math.random = seeded(7);
      const b = topic.generator(level).map((t) => [t.question, t.options]);
      expect(b).toEqual(a);
    } finally {
      Math.random = puvodni;
    }
  });

  it("4 různé možnosti, klíč právě jednou, feedback u každého distraktoru", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer), t.question).toHaveLength(1);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}"`).toBeTruthy();
      }
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("SOLVER: klíč souhlasí s nezávislou cestou", () => {
    for (const t of tasks) solve(t).check(t);
  });

  it("fakta: rozmnožování výtrusy; žádný klíč nepřisuzuje kapraďorostům květ ani semeno", () => {
    for (const t of tasks) {
      const k = low(t.correctAnswer);
      if (/rozmnožuj/.test(low(t.question)) && /^Čím/.test(t.question)) expect(k).toMatch(/výtrus/);
      if (/květ|semen/.test(k)) expect(`${low(t.question)} ${k}`, t.question).toMatch(/nikdy|ani semen/);
    }
  });

  it("délka: klíč je nejdelší možností nejvýš ve 40 % úloh", () => {
    const nejdelsi = tasks.filter((t) => t.options!.every((o) => o === t.correctAnswer || o.length < t.correctAnswer.length));
    expect(nejdelsi.length / tasks.length, nejdelsi.map((t) => t.correctAnswer).join(" | ")).toBeLessThanOrEqual(0.4);
  });

  it("klíč nevyčnívá prvním slovem", () => {
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (jine[0].length >= 2 && new Set(jine).size === 1) {
        expect(prvni(t.correctAnswer), t.question).toBe(jine[0]);
      }
    }
  });

  it("leak: klíč není ve znění otázky ani v nápovědách; nápovědy unikátní", () => {
    const videne = new Set<string>();
    for (const t of tasks) {
      expect(low(t.question), t.question).not.toContain(low(t.correctAnswer));
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints!) {
        expect(low(h), `hint leak: ${t.question}`).not.toContain(low(t.correctAnswer));
      }
      // velká nápověda je vlastní, o pětinu delší a bez přilepené obecné strategie
      expect(t.hints![1], t.question).not.toMatch(/Vylučuj možnosti, které odporují|Nejdřív škrtni možnost/);
      // pojmová past: mechorosty nepatří mezi nižší rostliny
      expect(t.hints!.join(" "), t.question).not.toMatch(/nižší/);
      expect(videne.has(t.hints![0]), `duplicitní nápověda: ${t.hints![0]}`).toBe(false);
      videne.add(t.hints![0]);
    }
  });

  it("velká nápověda je aspoň o pětinu delší než malá", () => {
    const vse = [tasks, ...[1, 2, 3, 4, 5].map(() => topic.generator(level))].flat();
    const kratke = vse
      .filter((t) => t.hints![1].length < t.hints![0].length * 1.2)
      .map((t) => `${t.hints![0].length}/${t.hints![1].length}: ${t.question}`);
    expect([...new Set(kratke)]).toEqual([]);
  });

  it("čeština: žádné lomítkové rodové tvary", () => {
    for (const t of tasks) {
      const texty = [t.question, ...t.options!, ...(t.hints ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(s, s).not.toMatch(/\p{L}\/\p{L}/u);
    }
  });
});

describe("Kapraďorosty — gradace", () => {
  it("L1 a L3 se zněním nepřekrývají; L3 obsahuje poznávání z popisu", () => {
    const l1 = topic.generator(1), l3 = topic.generator(3);
    const q1 = new Set(l1.map((t) => norm(t.question)));
    expect(l3.filter((t) => q1.has(norm(t.question)))).toHaveLength(0);
    expect(l3.filter((t) => solve(t).name === "rostlina z popisu").length).toBeGreaterThanOrEqual(6);
  });

  it("šablony se v sadě šesti úloh střídají (žádná dvakrát po sobě)", () => {
    // L3: šablony (a) i (b) řeší totéž pravidlo „rostlina z popisu“, proto jen L1 a L2.
    for (const level of [1, 2]) {
      const sada = topic.generator(level).slice(0, 6).map((t) => solve(t).name);
      for (let i = 1; i < sada.length; i++) {
        if (sada[i] === sada[i - 1]) expect.fail(`L${level}: pravidlo „${sada[i]}“ dvakrát po sobě`);
      }
    }
  });
});
