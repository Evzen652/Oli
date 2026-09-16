import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PAVOUKOVCI_PAVOUCI_STIRI_KLISTATA_TOPICS } from "../prirodopis/pavoukovciPavouciStiriKlistata";
import type { PracticeTask } from "@/lib/types";

/**
 * Pavoukovci — pavouci, štíři, klíšťata (faktický select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, vlastní tabulky, nic neimportuje z generátoru):
 *  (1) KLASIFIKÁTOR — z TEXTU otázky vytáhne znaky (páry nohou číslem nebo
 *      počet nohou, tykadla, křídla, klepeta, osten, hostitel/krev) a vlastními
 *      pravidly určí skupinu: 3 páry + tykadla → hmyz; 4 páry bez tykadel →
 *      pavoukovci; + klepeta a osten → štír; + hostitel → klíště (saje krev).
 *  (2) SKUPINY — samostatná mapa zástupce → skupina. U „Který z těchto
 *      živočichů…“ musí být pavoukovec právě jedna možnost.
 *  (3) CLAIMS — zbylá znění → vzor jediné správné možnosti.
 *  (4) ZDRAVÍ — klíč nesmí obsahovat škodlivou radu; každá škodlivá rada
 *      v distraktorech má vysvětlení.
 * Ve všech případech musí vyhovět PRÁVĚ jedna možnost a ta = correctAnswer.
 */
const topic = PAVOUKOVCI_PAVOUCI_STIRI_KLISTATA_TOPICS[0];

// ── (1) KLASIFIKÁTOR ────────────────────────────────────────────────────────
type Skupina = "hmyz" | "pavoukovci" | "štír" | "klíště" | "korýši" | "stonožkovci";

function znaky(q: string) {
  let pary: number | null = null;
  const mp = q.match(/(\d+) pár/);
  const mn = q.match(/(\d+) noh/);
  if (mp) pary = Number(mp[1]);
  else if (mn) pary = Number(mn[1]) / 2;
  const tykNeg = /(nemá|bez|žádná)[^.,]*tykad/.test(q);
  return {
    pary,
    tykadla: /tykadl/.test(q) && !tykNeg,
    kridla: /křídl/.test(q) && !/(ani|bez|nemá)[^.]*křídl/.test(q),
    klepeta: /klepet|klepít/.test(q),
    osten: /osten/.test(q),
    hostitel: /hostitel|krev/.test(q),
  };
}

function klasifikuj(q: string): Skupina {
  const z = znaky(q);
  if (z.pary === 3 && z.tykadla) return "hmyz";
  // 5–7 párů nohou s tykadly a bez křídel: korýši (rak 5, mokřice 7); stonožkovci mají desítky
  if (z.pary !== null && z.pary >= 5 && z.pary <= 7 && z.tykadla && !z.kridla) return "korýši";
  if (z.pary === 4 && !z.tykadla && !z.kridla) {
    if (z.klepeta && z.osten) return "štír";
    if (z.hostitel) return "klíště";
    return "pavoukovci";
  }
  throw new Error(`klasifikátor nerozhodl: ${q}`);
}

const ODPOVED: Record<Skupina, RegExp> = {
  hmyz: /hmyz/,
  pavoukovci: /pavoukovc/,
  "štír": /^štír$/,
  "klíště": /krev/,
  "korýši": /korýš/,
  stonožkovci: /stonožkovc/,
};

// ── (2) SKUPINY ─────────────────────────────────────────────────────────────
const SKUPINA: Record<string, Skupina> = {
  "křižák": "pavoukovci", "sklípkan": "pavoukovci", "vodouch": "pavoukovci", "sekáč": "pavoukovci",
  "štír": "pavoukovci", "klíště": "pavoukovci", "zákožka": "pavoukovci", "roztoč": "pavoukovci",
  mravenec: "hmyz", blecha: "hmyz", "komár": "hmyz", "štěnice": "hmyz", kudlanka: "hmyz", "koník": "hmyz",
  rak: "korýši",
  "stonožka": "stonožkovci",
};

// ── (3) CLAIMS ──────────────────────────────────────────────────────────────
const PAVOUK_NOHOU = 8;
const CLAIMS: [RegExp, (o: string) => boolean][] = [
  // L1
  [/^Kolik párů nohou má pavouk/, (o) => o.startsWith(`${PAVOUK_NOHOU / 2} pár`)],
  [/^Kolik nohou má dospělé klíště/, (o) => o.startsWith(`${PAVOUK_NOHOU} noh`)],
  [/Ze kterých částí se skládá tělo pavouka/, (o) => /hlavohru/.test(o)],
  [/Který útvar pavouk na těle nemá/, (o) => /tykad/.test(o)],
  [/Který útvar mají pavoukovci, ale hmyz ne/, (o) => /hlavohru/.test(o)],
  [/vlákno na pavučinu/, (o) => /snovac/.test(o)],
  [/ochromí svou kořist/, (o) => /klepít/.test(o) && /jed/.test(o)],
  [/Kde má štír jedový osten/, (o) => /zadeč/.test(o)],
  [/Čím se živí klíště/, (o) => /krv/.test(o)],
  [/Kterou nemoc může přenášet klíště|šíří přisátím klíštěte/, (o) => /encefalit|borelió/.test(o)],
  [/Mezi které organismy patří klíště/, (o) => /pavoukovc/.test(o)],
  // L2
  [/Po návratu z lesa chceš mít jistotu/, (o) => /celé tělo/.test(o)],
  [/Jak ho správně odstraníš/, (o) => /pinzet/.test(o)],
  [/oblečení sníží riziko/, (o) => /dlouhé/.test(o) && /světl/.test(o) && /ponož/.test(o)],
  [/nechat očkovat/, (o) => /encefalit/.test(o) && !/borel/.test(o)],
  [/zapíšeš do kalendáře datum/, (o) => /do kdy/.test(o) && /sledovat/.test(o)],
  [/Proč ho nemáme zabíjet/, (o) => /^loví/.test(o)],
  [/tvrdí, že je to velký hmyz/, (o) => /nohou/.test(o) && /tykad/.test(o)],
  [/klíště je malý brouček/, (o) => /noh/.test(o)],
  [/zůstala na kůži malá ranka/, (o) => /dezinfik/.test(o) && /sleduj/.test(o)],
  [/Kde hledáš klíště nejpečlivěji/, (o) => /podkolen|třísl/.test(o)],
  [/Pod kamenem žije/, () => false], // řeší klasifikátor; sem se nesmí dostat
  [/Co kromě vhodného oblečení pomůže/, (o) => /repelent/.test(o)],
  [/odlišíš od brouka/, (o) => /tykad/.test(o)],
  [/roztoče z prachu/, (o) => /pavoukovc/.test(o)],
  [/alergikovi/, (o) => /^prát/.test(o) && /teplot/.test(o)],
  // L3
  [/zvětšuje červený kruh/, (o) => /lékař/.test(o)],
  [/klíště utrhlo/, (o) => /dezinfik/.test(o) && /sleduj/.test(o)],
  [/potřít olejem/, (o) => /zárodk/.test(o)],
  [/nepotřebuje zuby/, (o) => /mimo tělo/.test(o)],
  [/Vodouch stříbřitý žije pod hladinou/, (o) => /vzduch/.test(o)],
  [/chyběly snovací bradavky/, (o) => /vlákn/.test(o)],
  [/dostala horečku/, (o) => /lékař/.test(o)],
  [/co nejdřív\?$/, (o) => /riziko/.test(o) && /menší/.test(o)],
  [/^Larva klíštěte/, (o) => /nemá tykad/.test(o) && /4 pár/.test(o)],
  [/nemocné myši/, (o) => /nasál\S* krev/.test(o)],
];

// ── (4) ZDRAVÍ ──────────────────────────────────────────────────────────────
const ZAKAZANO_V_KLICI = /olej|másl|prsty|antibiotik|očkov\S* proti (lymesk|borel)|i borel|nesleduj|necháš/;
const SKODLIVA_RADA = /olej|másl|prsty|antibiotik|borel|sirk|vyšťour|vymačk/;

type Verdict = { kind: string; expected: string };

const KLASIF_ZNENI = /(Kam patří\?|kam patří\.|Kam ho zařadíš\?|Který je to\?|Jak se živí\?|O jaké živočichy jde\?)$/;

function solve(t: PracticeTask): Verdict {
  const q = t.question;
  const opts = t.options!;
  const one = (kind: string, hit: string[]): Verdict => {
    expect(hit, `${kind}: právě jedna možnost v "${q}"`).toHaveLength(1);
    return { kind, expected: hit[0] };
  };

  if (KLASIF_ZNENI.test(q) && znaky(q).pary !== null) {
    const s = klasifikuj(q);
    return one(`klasifikátor → ${s}`, opts.filter((o) => ODPOVED[s].test(o)));
  }
  if (/^Který (z těchto živočichů|živočich z nabídky)/.test(q)) {
    for (const o of opts) {
      expect(SKUPINA[o.split(" ")[0]], `neznámý zástupce „${o}“`).toBeDefined();
    }
    return one("tabulka skupin", opts.filter((o) => SKUPINA[o.split(" ")[0]] === "pavoukovci"));
  }
  const cl = CLAIMS.filter(([re]) => re.test(q));
  expect(cl.length, `CLAIMS pro "${q}"`).toBe(1);
  return one("tvrzení", opts.filter(cl[0][1]));
}

const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");

function rvpLabels(id: string): { area: string; topic: string } {
  const data = JSON.parse(readFileSync(join(process.cwd(), "data", "rvp_data.json"), "utf8"));
  let found: { area: string; topic: string } | null = null;
  const walk = (n: unknown) => {
    if (found || !n || typeof n !== "object") return;
    const o = n as Record<string, unknown>;
    if (o.id === id && o.labels) found = o.labels as { area: string; topic: string };
    for (const v of Object.values(o)) walk(v);
  };
  walk(data);
  expect(found, `RVP uzel ${id}`).not.toBeNull();
  return found!;
}

describe("Pavoukovci — metadata", () => {
  it("přírodopis g6, select_one, category/topic znak po znaku podle RVP", () => {
    expect(topic.id).toBe("g6-pri-pavoukovci-pavouci-stiri-klistata-6");
    expect(topic.subject).toBe("prirodopis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Biologie živočichů");
    expect(topic.topic).toBe("Bezobratlí - členovci (úvod)");
    const labels = rvpLabels(topic.rvpNodeId!);
    expect(topic.category).toBe(labels.area);
    expect(topic.topic).toBe(labels.topic);
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Pavoukovci — level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh, jen select_one se 4 různými možnostmi", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    for (const t of tasks) {
      expect(t.options, t.question).toBeDefined();
      expect(t.items, t.question).toBeUndefined();
      expect(t.categories, t.question).toBeUndefined();
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer), t.question).toHaveLength(1);
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("chybový model: každý distraktor má feedback, správná ne", () => {
    for (const t of tasks) {
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
      expect(t.optionFeedback![t.correctAnswer]).toBeUndefined();
    }
  });

  it("NEZÁVISLÝ SOLVER: klíč souhlasí s druhou cestou (právě 1 správná)", () => {
    for (const t of tasks) {
      const v = solve(t);
      expect(t.correctAnswer, `${v.kind}: ${t.question}`).toBe(v.expected);
    }
  });

  it("zdraví: klíč neradí nic škodlivého, škodlivé distraktory mají vysvětlení", () => {
    for (const t of tasks) {
      expect(ZAKAZANO_V_KLICI.test(t.correctAnswer), `škodlivý klíč: ${t.correctAnswer}`).toBe(false);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer && SKODLIVA_RADA.test(o))) {
        expect((t.optionFeedback![d] ?? "").length, `škodlivá rada bez vysvětlení: ${d}`).toBeGreaterThan(20);
      }
    }
  });

  it("klíč není ve znění ani v nápovědách; nápovědy unikátní a různé", () => {
    const h0 = new Set<string>();
    const h1 = new Set<string>();
    for (const t of tasks) {
      const key = t.correctAnswer.toLowerCase();
      expect(t.question.toLowerCase().includes(key), `giveaway: ${t.question}`).toBe(false);
      expect(t.hints!.length).toBe(2);
      for (const h of t.hints!) expect(h.toLowerCase().includes(key), `hint leak: ${h}`).toBe(false);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      expect(h0.has(t.hints![0]), `opakovaná malá nápověda: ${t.hints![0]}`).toBe(false);
      expect(h1.has(t.hints![1]), `opakovaná velká nápověda: ${t.hints![1]}`).toBe(false);
      h0.add(t.hints![0]);
      h1.add(t.hints![1]);
    }
  });

  it("klíč nevyčnívá délkou ani prvním slovem", () => {
    let nejdelsi = 0;
    let poradi = 0;
    for (const t of tasks) {
      const podleDelky = [...t.options!].sort((a, b) => b.length - a.length);
      poradi += podleDelky.indexOf(t.correctAnswer);
      if (podleDelky[0] === t.correctAnswer && podleDelky[0].length >= 1.25 * podleDelky[1].length) nejdelsi++;
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      const vycniva = jine[0].length >= 3 && new Set(jine).size === 1 && jine[0] !== prvni(t.correctAnswer);
      expect(vycniva, `klíč vyčnívá prvním slovem: ${t.question}`).toBe(false);
    }
    expect(nejdelsi, "klíč je výrazně nejdelší příliš často").toBeLessThanOrEqual(2);
    // průměrné pořadí délky (0 = nejdelší, 3 = nejkratší) nesmí být u samého kraje
    expect(poradi / tasks.length, "klíč je systematicky nejdelší").toBeGreaterThan(0.5);
  });

  it("determinismus: dvě volání dají stejnou banku otázek", () => {
    const a = new Set(topic.generator(level).map((t) => `${t.question}|${t.correctAnswer}`));
    const b = new Set(topic.generator(level).map((t) => `${t.question}|${t.correctAnswer}`));
    expect([...a].sort()).toEqual([...b].sort());
  });
});

describe("Pavoukovci — gradace a pravidla úrovní", () => {
  it("znění L1, L2 a L3 jsou disjunktní", () => {
    const q = [1, 2, 3].map((l) => new Set(topic.generator(l).map((t) => t.question)));
    expect([...q[0]].filter((x) => q[2].has(x))).toHaveLength(0);
    expect([...q[0]].filter((x) => q[1].has(x))).toHaveLength(0);
    expect([...q[1]].filter((x) => q[2].has(x))).toHaveLength(0);
  });

  it("L1 = jedna věta s jedním faktem", () => {
    for (const t of topic.generator(1)) {
      expect((t.question.match(/[.?!]/g) ?? []).length, t.question).toBe(1);
    }
  });

  it("L1 nemoci: druhá nemoc od klíštěte se mezi distraktory neobjeví", () => {
    for (const t of topic.generator(1)) {
      if (!/nemoc/i.test(t.question)) continue;
      const jine = t.options!.filter((o) => o !== t.correctAnswer).join(" ");
      if (/encefalit/.test(t.correctAnswer)) expect(/borel/.test(jine), t.question).toBe(false);
      if (/borel/.test(t.correctAnswer)) expect(/encefalit/.test(jine), t.question).toBe(false);
    }
  });

  it("L3 = scénář, popis nebo úvaha (ne holá otázka na fakt)", () => {
    for (const t of topic.generator(3)) {
      const vet = (t.question.match(/[.?!]/g) ?? []).length;
      expect(vet >= 2 || /^(Proč|Co lze|Jak se může)/.test(t.question), t.question).toBe(true);
    }
  });
});
