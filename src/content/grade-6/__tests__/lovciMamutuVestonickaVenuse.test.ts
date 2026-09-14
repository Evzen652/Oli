import { describe, it, expect } from "vitest";
import { LOVCI_MAMUTU_VESTONICKA_VENUSE } from "../dejepis/lovciMamutuVestonickaVenuse";
import { klicUlohy } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Lovci mamutů, Věstonická venuše — faktické select_one téma.
 *
 * NEZÁVISLÝ FAKTOVÝ SOLVER (druhá cesta mimo banku):
 *  • FACTS — tabulka jistých faktů (pád uložený jako vlastní pole);
 *  • EPOCH_MARKERS — klasifikátor klíčových slov neolit/kovy vs. paleolit;
 *  • u otázek s polaritou NEMOHLI / NEBYL / VYVRÁTIL označí jako správnou jedinou
 *    možnost s neolitickým nebo kovovým markerem a všechny distraktory musí být
 *    paleolitické;
 *  • u faktových otázek porovná klíč s FACTS;
 *  • u úsudkových otázek porovná klíč s nezávisle sepsaným kmenem odpovědi.
 * Každá úloha musí být rozpoznána právě jedním pravidlem.
 */
const topic = LOVCI_MAMUTU_VESTONICKA_VENUSE[0];

const FACTS = {
  materialVenuse: { nom: "pálená hlína", gen: "pálené hlíny" },
  naleziste: { nom: "Dolní Věstonice", gen: "Dolních Věstonic" },
  pohori: { nom: "Pálava", ins: "Pálavou" },
  obdobiNalezu: "první polovině dvacátého století", // rok 1925
  epocha: { nom: "starší doba kamenná", gen: "starší doby kamenné" },
  nositel: { nom: "člověk dnešního typu" },
  muzeum: { nom: "Moravské muzeum v Brně", lok: "Moravském muzeu v Brně" },
  archeolog: { nom: "Karel Absolon" },
  starí: 25000,
};

const EPOCH_MARKERS = {
  neolitKovy: ["obil", "srp", "chov", "ovc", "hrn", "bronz", "želez", "tkan", "vesnic", "zrn"],
  paleolit: ["mamut", "pazour", "kost", "klů", "kly", "oštěp", "kůž", "kož", "sběr", "venuš", "paroh"],
};

const low = (s: string) => s.toLowerCase();
const maMarker = (s: string, m: string[]) => m.some((k) => low(s).includes(k));
const cislo = (s: string) => {
  const m = s.match(/\d[\d ]*/);
  return m ? Number(m[0].replace(/ /g, "")) : NaN;
};

type Pravidlo = { name: string; re: RegExp; check: (t: PracticeTask) => void };

const NEGACE = /NEMOHLI|NEMOHLA|NEBYL|NEBYLA|VYVRÁTIL/;

const PRAVIDLA: Pravidlo[] = [
  {
    name: "polarita (nemohli / vyvrátil)",
    re: NEGACE,
    check: (t) => {
      const neo = t.options!.filter((o) => maMarker(o, EPOCH_MARKERS.neolitKovy));
      expect(neo, `právě jedna neolitická/kovová možnost: ${t.question}`).toHaveLength(1);
      expect(t.correctAnswer, t.question).toBe(neo[0]);
      for (const o of t.options!.filter((x) => x !== t.correctAnswer)) {
        expect(maMarker(o, EPOCH_MARKERS.paleolit), `distraktor bez paleolitického markeru: ${o}`).toBe(true);
      }
    },
  },
  // ── faktové otázky proti FACTS ──
  { name: "materiál", re: /Z jakého materiálu je vyrobena/, check: (t) => expect(t.correctAnswer).toContain(FACTS.materialVenuse.gen) },
  { name: "pohoří", re: /Pod kterým pohořím/, check: (t) => expect(t.correctAnswer).toContain(FACTS.pohori.ins) },
  { name: "období nálezu", re: /Ve kterém období archeologové/, check: (t) => expect(t.correctAnswer).toContain(FACTS.obdobiNalezu) },
  { name: "epocha", re: /Do kterého období pravěku/, check: (t) => expect(t.correctAnswer).toContain(FACTS.epocha.gen) },
  {
    name: "stáří",
    re: /přibližné stáří/,
    check: (t) => {
      expect(t.correctAnswer).toMatch(/^(asi|kolem) /);
      expect(cislo(t.correctAnswer)).toBe(FACTS.starí);
    },
  },
  { name: "nositel", re: /Který druh člověka/, check: (t) => expect(t.correctAnswer).toContain(FACTS.nositel.nom) },
  { name: "muzeum", re: /ve kterém muzeu/i, check: (t) => expect(t.correctAnswer).toContain(FACTS.muzeum.lok) },
  { name: "Pavlov", re: /naleziště Pavlov/, check: (t) => expect(t.correctAnswer).toContain(FACTS.naleziste.gen) },
  { name: "archeolog", re: /Který archeolog/, check: (t) => expect(t.correctAnswer).toContain(FACTS.archeolog.nom) },
  // ── otázky s jednoznačnou odpovědí (nezávislý kmen) ──
  { name: "další kořist", re: /lovili kromě mamutů/, check: (t) => expect(low(t.correctAnswer)).toMatch(/sob.*kon/) },
  { name: "co je venuše", re: /^Co je Věstonická venuše\?$/, check: (t) => expect(low(t.correctAnswer)).toMatch(/soška žen/) },
  { name: "čepele", re: /štípali ostré čepele/, check: (t) => expect(low(t.correctAnswer)).toContain("pazour") },
  { name: "pohřeb", re: /pohřební zvyk/, check: (t) => expect(low(t.correctAnswer)).toContain("okr") },
  { name: "podnebí", re: /podnebí panovalo/, check: (t) => expect(low(t.correctAnswer)).toMatch(/chladn|ledov/) },
  { name: "obživa", re: /Jak se živili/, check: (t) => expect(low(t.correctAnswer)).toMatch(/lov.*sběr/) },
  { name: "kruh kostí", re: /kruh velkých mamutích kostí/, check: (t) => expect(low(t.correctAnswer)).toContain("obydlí") },
  { name: "jehla", re: /s ouškem na tupém konci/, check: (t) => expect(low(t.correctAnswer)).toMatch(/šív|šit/) },
  { name: "porcování", re: /kosti se zářezy\. Co s čepelemi/, check: (t) => expect(low(t.correctAnswer)).toMatch(/maso|kůž/) },
  { name: "oděv", re: /teplý oděv/, check: (t) => expect(low(t.correctAnswer)).toMatch(/kůž|kožeš/) },
  { name: "okr v hrobě", re: /kostru pokrývalo červené barvivo/, check: (t) => expect(low(t.correctAnswer)).toContain("obřad") },
  { name: "otisky tkanin", re: /otisky provázků, sítí a tkanin/, check: (t) => expect(low(t.correctAnswer)).toMatch(/vlákn.*rostlin/) },
  { name: "místo tábořiště", re: /Proč si lovci vybrali/, check: (t) => expect(low(t.correctAnswer)).toMatch(/stáda/) },
  { name: "otisk prstu", re: /otisk lidského prstu/, check: (t) => expect(low(t.correctAnswer)).toMatch(/ručně/) },
  { name: "figurky", re: /figurek zvířat/, check: (t) => expect(low(t.correctAnswer)).toMatch(/vypálit/) },
  { name: "lov mamuta", re: /silnější a těžší než člověk/, check: (t) => expect(low(t.correctAnswer)).toMatch(/skupin/) },
  { name: "vrstva", re: /Jak tuto vrstvu nejlépe určit/, check: (t) => expect(t.correctAnswer).toContain(FACTS.epocha.gen) },
  { name: "ozdoby", re: /provrtané zvířecí zuby/, check: (t) => expect(low(t.correctAnswer)).toContain("ozdob") },
  { name: "dějiny techniky", re: /dějiny techniky/, check: (t) => expect(low(t.correctAnswer)).toMatch(/před prvními hrnci/) },
  { name: "ne portrét", re: /nezobrazuje podobu/, check: (t) => expect(low(t.correctAnswer)).toMatch(/plodnost/) },
  { name: "písmo", re: /písemný pramen/, check: (t) => expect(low(t.correctAnswer)).toMatch(/písmo vzniklo až/) },
  { name: "mnoho mamutů", re: /velkého množství mamutů/, check: (t) => expect(low(t.correctAnswer)).toMatch(/skupiny.*generac/) },
  { name: "oteplení", re: /mamuti vyhynuli a krajina zarostla/, check: (t) => expect(low(t.correctAnswer)).toMatch(/menší zvěř/) },
  {
    name: "pyramidy",
    re: /egyptských pyramid/,
    check: (t) => {
      expect(t.correctAnswer).toMatch(/^venuše .*asi/);
      const n = cislo(t.correctAnswer);
      // venuše asi 25 000 let, pyramidy asi 4 500 let → rozdíl řádu 10^4
      expect(Math.abs(n - (FACTS.starí - 4500))).toBeLessThanOrEqual(2500);
    },
  },
  { name: "rekonstrukce", re: /rekonstrukce obydlí/, check: (t) => expect(low(t.correctAnswer)).toMatch(/shnil|rozlož/) },
  { name: "dochování", re: /dochovaly desítky tisíc let/, check: (t) => expect(low(t.correctAnswer)).toMatch(/nehnije/) },
  { name: "pazourek z dálky", re: /nosil se z velké dálky/, check: (t) => expect(low(t.correctAnswer)).toMatch(/vyměňov/) },
  { name: "neandertálec", re: /nemohl vytvořit neandertálec/, check: (t) => expect(low(t.correctAnswer)).toMatch(/vymřeli dřív/) },
  { name: "bez trámů", re: /nestavěli obydlí z trámů/, check: (t) => expect(low(t.correctAnswer)).toMatch(/dřeva .*málo/) },
];

function solve(t: PracticeTask): Pravidlo {
  const hit = PRAVIDLA.filter((p) => p.re.test(t.question));
  expect(hit.map((p) => p.name), `solver musí úlohu rozpoznat právě jedním pravidlem: ${t.question}`).toHaveLength(1);
  return hit[0];
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\d]+/gu, " ").trim();
const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");

describe("Lovci mamutů — metadata", () => {
  it("dějepis g6, select_one, Pravěk › Pravěk na našem území", () => {
    expect(topic.subject).toBe("dejepis");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.rvpNodeId).toBe("g6-dejepis-pravek-pravek-na-nasem-uzemi-lovci-mamutu-vestonicka-venuse");
    expect(topic.category).toBe("Pravěk");
    expect(topic.topic).toBe("Pravěk na našem území");
    expect(topic.briefDescription.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Lovci mamutů — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh, deterministicky", () => {
    expect(new Set(tasks.map(klicUlohy)).size).toBeGreaterThanOrEqual(12);
    expect(topic.generator(level).map((t) => t.options)).toEqual(tasks.map((t) => t.options));
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

  it("FAKTOVÝ SOLVER: klíč souhlasí s nezávislou cestou", () => {
    for (const t of tasks) solve(t).check(t);
  });

  it("stáří: číslo v klíči řádu 10^4 s asi/kolem; nikdy „našeho letopočtu“ jako klíč", () => {
    for (const t of tasks) {
      expect(t.correctAnswer).not.toContain("našeho letopočtu");
      if (/\d/.test(t.correctAnswer) && /let\b/.test(t.correctAnswer)) {
        const n = cislo(t.correctAnswer.replace(/^\D+/, ""));
        expect(n, t.correctAnswer).toBeGreaterThanOrEqual(10_000);
        expect(n, t.correctAnswer).toBeLessThan(100_000);
        expect(t.correctAnswer).toMatch(/\b(asi|kolem)\b/);
      }
    }
  });

  it("délka: průměrný klíč nejvýš 1,2× průměru distraktorů", () => {
    let k = 0, d = 0, nd = 0;
    for (const t of tasks) {
      k += t.correctAnswer.length;
      for (const o of t.options!.filter((x) => x !== t.correctAnswer)) { d += o.length; nd++; }
    }
    expect(k / tasks.length).toBeLessThanOrEqual(1.2 * (d / nd));
  });

  it("klíč nevyčnívá prvním slovem", () => {
    for (const t of tasks) {
      const jine = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (jine[0].length >= 3 && new Set(jine).size === 1) {
        expect(prvni(t.correctAnswer), t.question).toBe(jine[0]);
      }
    }
  });

  it("leak: klíč není ve znění otázky ani v nápovědách; nápovědy unikátní", () => {
    const videne = new Set<string>();
    for (const t of tasks) {
      expect(low(t.question), t.question).not.toContain(low(t.correctAnswer));
      expect(t.hints, t.question).toHaveLength(2);
      for (const h of t.hints!) {
        expect(low(h), `hint leak: ${t.question}`).not.toContain(low(t.correctAnswer));
        expect(videne.has(h), `duplicitní nápověda: ${h}`).toBe(false);
        videne.add(h);
      }
    }
  });

  it("čeština: žádné lomítkové rodové tvary", () => {
    for (const t of tasks) {
      const texty = [t.question, ...t.options!, ...(t.hints ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(s, s).not.toMatch(/\p{L}\/\p{L}/u);
    }
  });
});

describe("Lovci mamutů — gradace", () => {
  it("L1 a L3 se znění ani klíčem nepřekrývají; L2 a L3 obsahují úsudkové formy", () => {
    const l1 = topic.generator(1), l2 = topic.generator(2), l3 = topic.generator(3);
    const q1 = new Set(l1.map((t) => norm(t.question)));
    expect(l3.filter((t) => q1.has(norm(t.question)))).toHaveLength(0);
    const k1 = new Set(l1.map((t) => norm(t.correctAnswer)));
    expect(l3.filter((t) => k1.has(norm(t.correctAnswer)))).toHaveLength(0);
    expect(l1.every((t) => /^(Kter|Jak|Kde|Co je|Z jak|Do kter|Pod kter|Ve kter)/.test(t.question))).toBe(true);
    expect(l2.every((t) => /^(Archeolog|Lovec|Na |Tábořiště)/.test(t.question))).toBe(true);
    expect(l3.every((t) => /^(Proč|Který nález by VYVRÁTIL|Co z toho)/.test(t.question))).toBe(true);
  });
});
