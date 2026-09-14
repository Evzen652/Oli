import { describe, it, expect } from "vitest";
import { ANTIKA_RECKO_KULTURA } from "../dejepis/antikaReckoKultura";
import type { PracticeTask } from "@/lib/types";

/**
 * Alexandr Veliký, helénismus, řecká kultura, mytologie — FAKTICKÝ vzor select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta): vlastní ručně psané tabulky, pole `correct`
 * z banky se NEPOUŽÍVÁ.
 *  • RECKY_BUH  — bůh → oblast (L1) a poznávací symbol (L2);
 *  • RIMSKE_JMENO — řecké jméno → římské (hlídá dvojici „také správně“);
 *  • OSOBY, MISTA, RADY, DIVADLO, VYPRAVA — znak v otázce → znak odpovědi;
 *  • RCENI — dnešní situace ↔ rčení ↔ přenesený význam;
 *  • HISTORIE / MYTUS — doložené × mýtické výroky;
 *  • PRICINY — otázka „proč“ / zařazení období → znak správné příčiny.
 * Pro každou úlohu solver najde PRÁVĚ JEDEN fakt a PRÁVĚ JEDNU přípustnou možnost.
 */
const topic = ANTIKA_RECKO_KULTURA[0];

interface Fakt {
  pojem: string;
  /** Všechny musí sedět na znění otázky. */
  otazka: RegExp[];
  /** Znak možnosti, kterou fakt připouští jako pravdivou. */
  moznost: RegExp;
}

// ── tabulky solveru ─────────────────────────────────────────────────────────
const RECKY_BUH: { jmeno: string; oblast: RegExp[]; symbol: RegExp[] }[] = [
  { jmeno: "Zeus", oblast: [/vládl ostatním bohům/, /pánem nebe/], symbol: [/blesk/, /orel/] },
  { jmeno: "Poseidón", oblast: [/připadlo moře/], symbol: [/trojzub/, /delfín/] },
  { jmeno: "Hádés", oblast: [/podsvětí, tedy říši mrtvých/], symbol: [/Kerberos/] },
  { jmeno: "Athéna", oblast: [/bohyní moudrosti/], symbol: [/přilb/, /sova/] },
  { jmeno: "Afrodita", oblast: [/lásku a krásu/], symbol: [/mořské pěny/, /lastuř/] },
  { jmeno: "Hermés", oblast: [/poslem bohů/], symbol: [/okřídlenými sandály/] },
  { jmeno: "Arés", oblast: [/bohem války/], symbol: [/^$/] },
  { jmeno: "Héfaistos", oblast: [/ohně a kovářství/], symbol: [/kovárn/, /kladiv/] },
  { jmeno: "Héra", oblast: [/královnou bohů a ochránkyní/], symbol: [/^$/] },
];
const RIMSKE_JMENO: Record<string, string> = {
  Zeus: "Jupiter", Poseidón: "Neptun", Hádés: "Pluto", Athéna: "Minerva", Afrodita: "Venuše",
  Hermés: "Merkur", Arés: "Mars", Héfaistos: "Vulkán", Héra: "Juno",
};

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const presne = (s: string) => new RegExp(`^${esc(s)}$`);

const FAKTA: Fakt[] = [
  ...RECKY_BUH.map((b) => ({ pojem: `buh-oblast:${b.jmeno}`, otazka: b.oblast, moznost: presne(b.jmeno) })),
  ...RECKY_BUH.filter((b) => b.symbol[0].source !== "^$").map((b) => ({
    pojem: `buh-symbol:${b.jmeno}`, otazka: b.symbol, moznost: presne(b.jmeno),
  })),
  // OSOBY
  { pojem: "Alexandr = makedonský král", otazka: [/^Kdo byl Alexandr/], moznost: /^makedonský král$/i },
  { pojem: "učitel Alexandra", otazka: [/učitelem mladého Alexandra/], moznost: /^aristotel/i },
  { pojem: "Filip II.", otazka: [/otcem Alexandra Velikého/], moznost: /^filip ii\.$/i },
  { pojem: "Homér", otazka: [/Ilias a Odysseia\?/], moznost: /^homér$/i },
  // MÍSTA A STAVBY
  { pojem: "sídlo bohů", otazka: [/sídlili nejvyšší bohové/], moznost: /^olymp$/i },
  { pojem: "hry na počest Dia", otazka: [/na počest Dia\?/], moznost: /^olympijské hry$/i },
  { pojem: "chrám Athény", otazka: [/chrám bohyně Athény/], moznost: /^parthenón$/i },
  // ŘÁDY
  { pojem: "dórský", otazka: [/polštáři/], moznost: /^dórský/i },
  { pojem: "iónský", otazka: [/ulitu šneka/], moznost: /^iónský/i },
  { pojem: "korintský", otazka: [/akantu/], moznost: /^korintský/i },
  // DIVADLO
  { pojem: "divadlo", otazka: [/sedadla/, /pro sbor/], moznost: /^divadlo$/i },
  { pojem: "tragédie", otazka: [/končí smutně/], moznost: /^tragédie$/i },
  { pojem: "komedie", otazka: [/nahlas smějí/], moznost: /^komedie$/i },
  // VÝPRAVA
  { pojem: "Alexandrie v Egyptě", otazka: [/záplavy přinášely úrodné bahno/], moznost: /egypt/i },
  { pojem: "Perská říše", otazka: [/Dareia III\. a zmocnil/], moznost: /^perská/i },
  { pojem: "Indus", otazka: [/odmítli jít dál/], moznost: /^k indu$/i },
  { pojem: "Alexandrie", otazka: [/knihovnu/, /maják/], moznost: /^alexandrie$/i },
  // PŘÍČINY A OBDOBÍ
  { pojem: "šíření řečtiny", otazka: [/mluvilo řecky/], moznost: /usazoval.*Řeky/ },
  { pojem: "rozpad říše", otazka: [/rozpadla/], moznost: /nástupce/ },
  { pojem: "název helénismu", otazka: [/říká helénismus/], moznost: /řecká kultura.*mísila/ },
  { pojem: "helénismus × klasika", otazka: [/liší od doby klasického/], moznost: /králové velkých říší/ },
  { pojem: "zařazení období", otazka: [/250 př\. n\. l\./], moznost: /helénism/ },
  // KULTURA — TRANSFER (L3)
  { pojem: "Odysseus × Kyklop", otazka: [/Kyklopa/], moznost: /^poseidón$/i },
  { pojem: "atlas", otazka: [/nebeskou klenbu/], moznost: /^atlas$/i },
  { pojem: "sova na mincích", otazka: [/mince sovu/], moznost: /bohyni, která chránila/ },
  { pojem: "posvátný mír", otazka: [/posvátný mír/], moznost: /Diovi/ },
  { pojem: "správné použití rčení", otazka: [/použité správně/], moznost: /zlomky/ },
];

// RČENÍ: rčení → situace (znak v otázce) → přenesený význam
const RCENI: { rceni: RegExp; situace: RegExp; zVyznamu: RegExp; vyznam: RegExp }[] = [
  { rceni: /^achillova pata$/i, situace: /pravidelně propadnou/, zVyznamu: /znamená rčení Achillova pata/, vyznam: /^slabé místo jinak silného člověka$/i },
  { rceni: /^sisyfovská práce$/i, situace: /začíná pořád znovu/, zVyznamu: /rčení sisyfovská práce/, vyznam: /^marná, stále se opakující/i },
  { rceni: /^tantalova muka$/i, situace: /obchod je zamčený/, zVyznamu: /rčení Tantalova muka/, vyznam: /nedosažiteln/i },
  { rceni: /^pandořina skříňka$/i, situace: /vyrojí stížnosti/, zVyznamu: /otevře Pandořinu/, vyznam: /nečekaných potíží$/i },
];
for (const r of RCENI) {
  FAKTA.push({ pojem: `situace→${r.rceni.source}`, otazka: [r.situace], moznost: r.rceni });
  FAKTA.push({ pojem: `rčení→${r.rceni.source}`, otazka: [r.zVyznamu], moznost: r.vyznam });
}

// HISTORIE × MÝTUS
const HISTORIE = [/porazil perského krále Dareia/, /zemřel roku 323 př\. n\. l\. v Babylonu/, /založil v Egyptě město Alexandrii/, /postavili bohyni Athéně/, /pořádali v Olympii hry/];
const MYTUS = [/Héraklés/, /Prométheus/, /Perseus/, /Orfeus/, /synem boha Dia/, /darovala Athéňanům/];
const ANACHRONISMUS = /Caesar|římskými legiemi/;
FAKTA.push({ pojem: "doložená historie", otazka: [/(doloženou událost|doložená historie), a ne/], moznost: /__HISTORIE__/ });
FAKTA.push({ pojem: "mýtus", otazka: [/jde o mýtus/], moznost: /__MYTUS__/ });

function pripousti(f: Fakt, o: string): boolean {
  if (f.moznost.source === "__HISTORIE__") return HISTORIE.some((r) => r.test(o)) && !ANACHRONISMUS.test(o);
  if (f.moznost.source === "__MYTUS__") return MYTUS.some((r) => r.test(o));
  return f.moznost.test(o);
}

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function vyres(t: PracticeTask): { fakt: Fakt; klic: string } {
  const fakty = FAKTA.filter((f) => f.otazka.every((r) => r.test(t.question)));
  expect(fakty.map((f) => f.pojem), `solver: nejednoznačný/žádný fakt pro: ${t.question}`).toHaveLength(1);
  const fakt = fakty[0];
  const ok = t.options!.filter((o) => pripousti(fakt, o));
  expect(ok, `solver (${fakt.pojem}): nepřipouští právě 1 možnost v: ${t.question}`).toHaveLength(1);
  return { fakt, klic: ok[0] };
}

const LEVELS = [1, 2, 3] as const;
const tasksBy = Object.fromEntries(LEVELS.map((l) => [l, topic.generator(l)])) as Record<number, PracticeTask[]>;
const all = LEVELS.flatMap((l) => tasksBy[l]);

describe("Antika Řecko — metadata", () => {
  it("(9) dějepis g6, select_one, factual, RVP uzel, přesný category/topic", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.contentType).toBe("factual");
    expect(topic.category).toBe("Starověk");
    expect(topic.topic).toBe("Antika - Řecko");
    expect(topic.topic.includes("-")).toBe(true);
    expect(topic.studentTitle).toBe("Alexandr Veliký a řečtí bohové");
    expect(topic.rvpNodeId).toBe("g6-dejepis-starovek-antika-recko-alexandr-veliky-helenismus-recka-kultura-mytologie");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(LEVELS)("Antika Řecko — úroveň %i", (level) => {
  const tasks = tasksBy[level];

  it("(4) ≥12 unikátních úloh, deterministicky", () => {
    expect(new Set(tasks.map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    const znovu = topic.generator(level).map((t) => t.question).sort();
    expect(znovu).toEqual(tasks.map((t) => t.question).sort());
  });

  it("(3)(6)(7)(8) 4 unikátní možnosti, feedback bez klíče, explanation s „protože“", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options).toContain(t.correctAnswer);
      expect(t.optionFeedback?.[t.correctAnswer], t.question).toBeUndefined();
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        const fb = t.optionFeedback?.[d];
        expect(fb, `chybí feedback "${d}" v: ${t.question}`).toBeTruthy();
        expect(norm(fb!).includes(norm(t.correctAnswer)), `feedback prozrazuje klíč: ${fb}`).toBe(false);
      }
      expect(/protože/i.test(t.explanation ?? ""), `explanation bez „protože“: ${t.question}`).toBe(true);
      expect(t.hints, t.question).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
    }
  });

  it("(1)(2) nezávislý solver dojde ke stejnému klíči", () => {
    for (const t of tasks) {
      const { fakt, klic } = vyres(t);
      expect(t.correctAnswer, `${fakt.pojem}: ${t.question}`).toBe(klic);
    }
  });

  it("(2) žádná dvojice řecké + římské jméno téhož boha; římské jméno klíče jen u otázky na řecké jméno", () => {
    for (const t of tasks) {
      for (const a of t.options!) {
        const rim = RIMSKE_JMENO[a];
        if (rim) {
          const obe = t.options!.includes(rim);
          if (obe) {
            // dvojice je přípustná jen tehdy, když otázka výslovně chce řecké jméno a klíčem je řecké
            expect(/řeck/i.test(t.question), `řecké i římské jméno bez „řecký“ v otázce: ${t.question}`).toBe(true);
            expect(t.correctAnswer, t.question).toBe(a);
          }
        }
      }
      const rimKlice = RIMSKE_JMENO[t.correctAnswer];
      if (rimKlice && t.options!.includes(rimKlice)) expect(/řeck/i.test(t.question)).toBe(true);
      expect(Object.values(RIMSKE_JMENO)).not.toContain(t.correctAnswer);
    }
  });

  it("(3) klíč není ve znění otázky (ani kmen Olymp) ani v nápovědách", () => {
    for (const t of tasks) {
      const k = norm(t.correctAnswer);
      expect(norm(t.question).includes(k), `giveaway v otázce: ${t.question}`).toBe(false);
      if (k === "olymp") expect(/olymp/i.test(t.question)).toBe(false);
      for (const h of t.hints ?? []) {
        expect(norm(h).includes(k), `nápověda prozrazuje „${t.correctAnswer}“: ${h}`).toBe(false);
        if (k === "olymp") expect(/olymp/i.test(h), h).toBe(false);
      }
    }
  });

  it("(5) klíč nevyčnívá počátečním slovem", () => {
    const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (jine[0].length >= 3 && new Set(jine).size === 1) {
        expect(prvni(t.correctAnswer), `klíč vyčnívá začátkem: ${t.question}`).toBe(jine[0]);
      }
    }
  });
});

describe("Antika Řecko — napříč tématem", () => {
  it("(5) délka klíče: poměr k průměru distraktorů ≤ 1,3; klíč nejdelší v menšině", () => {
    let pomery = 0;
    let nejdelsi = 0;
    let vyrazne = 0;
    for (const t of all) {
      const d = t.options!.filter((o) => o !== t.correctAnswer);
      pomery += t.correctAnswer.length / (d.reduce((s, o) => s + o.length, 0) / d.length);
      const s = [...t.options!].sort((a, b) => b.length - a.length);
      if (s[0] === t.correctAnswer && s[0].length > s[1].length) nejdelsi++;
      if (s[0] === t.correctAnswer && s[0].length >= s[1].length * 1.25) vyrazne++;
    }
    expect(pomery / all.length).toBeLessThanOrEqual(1.3);
    expect(nejdelsi / all.length, `klíč nejdelší v ${nejdelsi}/${all.length}`).toBeLessThanOrEqual(0.4);
    expect(vyrazne / all.length, `klíč výrazně nejdelší v ${vyrazne}/${all.length}`).toBeLessThanOrEqual(0.1);
    for (const l of LEVELS) {
      const n = tasksBy[l].filter((t) => {
        const s = [...t.options!].sort((a, b) => b.length - a.length);
        return s[0] === t.correctAnswer && s[0].length > s[1].length;
      }).length;
      expect(n / tasksBy[l].length, `L${l}: klíč nejdelší v ${n}/${tasksBy[l].length}`).toBeLessThanOrEqual(0.4);
    }
  });

  it("(4) znění L1, L2 a L3 jsou disjunktní; L1 bez „proč“", () => {
    const q = LEVELS.map((l) => new Set(tasksBy[l].map((t) => t.question)));
    for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) {
      expect([...q[a]].filter((x) => q[b].has(x)), `L${a + 1} ∩ L${b + 1}`).toHaveLength(0);
    }
    for (const x of q[0]) expect(/(^|\s)proč(\s|$)/i.test(x), x).toBe(false);
  });

  it("(8) všechny úlohy mají options (téma nemíchá typy)", () => {
    for (const t of all) expect(t.options?.length, t.question).toBe(4);
  });

  it("(7) nápovědy jsou unikátní napříč úlohami", () => {
    expect(new Set(all.map((t) => t.hints![0])).size).toBe(all.length);
    expect(new Set(all.map((t) => t.hints![1])).size).toBe(all.length);
  });

  it("(9) žádné rodové lomítkové tvary", () => {
    for (const t of all) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(/\b\p{L}+\/\p{L}+\b/u.test(s), `lomítkový tvar: ${s}`).toBe(false);
    }
  });
});
