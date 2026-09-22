import { describe, it, expect } from "vitest";
import { POVEST_REGIONALNI_HISTORICKA } from "../cjl/povestRegionalniHistoricka";
import type { PracticeTask } from "@/lib/types";

/**
 * Pověst (regionální, historická) — čeština 6. ročník (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, nečte parametry generátoru):
 *  1. Žánr ukázky (L1a/L1c): keyword klasifikátor s pevnou prioritou (báje →
 *     bajka → pohádkové formulace → jinak pověst), přesně podle popisu v
 *     zadání tématu (solverCheck bod 1). Nezávislý na poli `zanr` v datech
 *     generátoru.
 *  2. Druh pověsti (L2a): keyword klasifikátor (historické jméno/událost →
 *     historická; obrat „se říká“/„zvaný“ bez historické osoby → místní).
 *  3. L2b slovo místa: nezávislá tabulka MISTNI (misto/postava/kouzelnyPrvek/
 *     casoveUrceni) opsaná ručně ze zadání — ověří, že klíč = misto a že
 *     všechny tři distraktory jsou právě ty ostatní tři pole, a že všechna
 *     čtyři slova se v ukázce opravdu vyskytují.
 *  4. L3a jádro pravdy: nezávislá tabulka skutečné/smyšlené prvky pro obě
 *     varianty otázky (normální i obrácená).
 */
const topic = POVEST_REGIONALNI_HISTORICKA[0];

// ── 1. Nezávislý klasifikátor žánru (báje → bajka → pohádka → jinak pověst) ──

const BAJE_MARKERS = ["zeus", "prométheus", "olymp", "héraklés", "ikaros", "eurystheus", "boh"];
const BAJKA_MARKERS = ["liška", "mravenec", "cvrček", "vrána", "zajíc", "želva"];
const POHADKA_PHRASES = ["byl jednou", "byla jednou", "bylo jednou", "za devatero horami", "za horami"];

function classifyZanr(text: string): "pohádka" | "pověst" | "bajka" | "báje" {
  const t = text.toLowerCase();
  if (BAJE_MARKERS.some((m) => t.includes(m))) return "báje";
  if (BAJKA_MARKERS.some((m) => t.includes(m))) return "bajka";
  if (POHADKA_PHRASES.some((m) => t.includes(m))) return "pohádka";
  return "pověst";
}

describe("Pověst (regionální, historická) — metadata", () => {
  it("čeština g6, select_one, Literární výchova / Lidová slovesnost", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-povest-regionalni-historicka-6");
    expect(topic.category).toBe("Literární výchova");
    expect(topic.topic).toBe("Lidová slovesnost");
  });
});

describe("NEZÁVISLÝ SOLVER 1: žánr ukázky (L1a) sedí s keyword klasifikátorem", () => {
  it("úlohy 'Který žánr to je?' — klíč odpovídá nezávislému klasifikátoru", () => {
    const l1 = topic.generator(1);
    const ukazky = l1.filter((t) => t.question.includes("Který žánr to je?"));
    expect(ukazky.length).toBeGreaterThan(0);
    for (const t of ukazky) {
      const m = t.question.match(/Přečti si text: „(.+)“ Který žánr to je\?/u);
      expect(m, `nerozpoznaný formát: ${t.question}`).not.toBeNull();
      expect(classifyZanr(m![1]), `klasifikátor nesouhlasí: ${t.question}`).toBe(t.correctAnswer);
    }
  });

  it("úlohy 'Do kterého žánru tahle postava patří?' — klíč odpovídá klasifikátoru", () => {
    const l1 = topic.generator(1);
    const postavy = l1.filter((t) => t.question.includes("Do kterého žánru tahle postava patří?"));
    expect(postavy.length).toBeGreaterThan(0);
    for (const t of postavy) {
      const m = t.question.match(/Přečti si text: „(.+)“ Do kterého žánru tahle postava patří\?/u);
      expect(m, `nerozpoznaný formát: ${t.question}`).not.toBeNull();
      expect(classifyZanr(m![1]), `klasifikátor nesouhlasí: ${t.question}`).toBe(t.correctAnswer);
    }
  });
});

describe("Pověst — L1 banka žánrů obsahuje všechny čtyři druhy", () => {
  it("aspoň 2 pohádka, 2 bajka, 2 báje a 4 pověst v L1a bance", () => {
    const l1 = topic.generator(1);
    const ukazky = l1.filter((t) => t.question.includes("Který žánr to je?"));
    const kolik = (z: string) => ukazky.filter((t) => t.correctAnswer === z).length;
    expect(kolik("pohádka")).toBeGreaterThanOrEqual(2);
    expect(kolik("bajka")).toBeGreaterThanOrEqual(2);
    expect(kolik("báje")).toBeGreaterThanOrEqual(2);
    expect(kolik("pověst")).toBeGreaterThanOrEqual(4);
  });
});

// ── 2. Nezávislý klasifikátor druhu pověsti (místní × historická) ───────────

const HIST_MARKERS = [
  "kníže", "král", "kněžna", "přemysl", "libuše", "václav", "karel iv.",
  "husit", "bivoj", "horymír", "bruncvík", "otakar", "kazi",
  "dalibor", "žižka", "oldřich",
];
const MISTNI_MARKERS = ["říká", "říkají", "zvaný", "zvaná"];

function classifyDruh(text: string): "místní" | "historická" | null {
  const t = text.toLowerCase();
  const hist = HIST_MARKERS.some((m) => t.includes(m));
  const mistni = MISTNI_MARKERS.some((m) => t.includes(m));
  if (hist && !mistni) return "historická";
  if (mistni && !hist) return "místní";
  return null;
}

describe("NEZÁVISLÝ SOLVER 2: druh pověsti (L2a) sedí s keyword klasifikátorem", () => {
  it("místní i historické ukázky se jednoznačně klasifikují a sedí s klíčem", () => {
    const l2 = topic.generator(2);
    const druhy = l2.filter((t) => t.question.includes("Jaký druh vyprávění to je?"));
    expect(druhy.length).toBeGreaterThan(0);
    for (const t of druhy) {
      const m = t.question.match(/Přečti si text: „(.+)“ Jaký druh vyprávění to je\?/u);
      expect(m, `nerozpoznaný formát: ${t.question}`).not.toBeNull();
      const vysledek = classifyDruh(m![1]);
      expect(vysledek, `nejednoznačné: ${m![1]}`).not.toBeNull();
      const ocekavano = vysledek === "místní" ? "místní pověst" : "historická pověst";
      expect(t.correctAnswer, t.question).toBe(ocekavano);
    }
  });
});

// ── 3. Nezávislá tabulka MISTNI pro L2b (slovo ukazující na místní pověst) ──

interface MistniOcekavani {
  misto: string;
  postava: string;
  /** Tvar nabízený jako možnost — vždy 1. pád. */
  kouzelnyPrvek: string;
  /** Tvar, ve kterém kouzelný prvek stojí v ukázce (možnost je v 1. pádě). */
  kouzelnyPrvekVTextu: string;
  casoveUrceni: string;
}

// Opsáno ručně ze zadání (banka místních ukázek), nečte pole generátoru.
const MISTNI_TABULKA: MistniOcekavani[] = [
  { misto: "Čertova skála", postava: "čert", kouzelnyPrvek: "kouzelný pytel", kouzelnyPrvekVTextu: "kouzelném pytli", casoveUrceni: "za jedinou noc" },
  { misto: "Panenská studánka", postava: "vodník", kouzelnyPrvek: "podvodní říše", kouzelnyPrvekVTextu: "podvodní říše", casoveUrceni: "kdysi dávno" },
  { misto: "Kamenný mnich", postava: "kouzelník", kouzelnyPrvek: "kouzelná hůl", kouzelnyPrvekVTextu: "kouzelnou holí", casoveUrceni: "před staletími" },
  { misto: "Bezedné", postava: "vodní víla", kouzelnyPrvek: "začarovaný poklad", kouzelnyPrvekVTextu: "začarovaný poklad", casoveUrceni: "odedávna" },
  { misto: "Čertův mlýn", postava: "čert", kouzelnyPrvek: "čertovské kladivo", kouzelnyPrvekVTextu: "čertovským kladivem", casoveUrceni: "za jednu jedinou noc" },
  { misto: "Loupežnická jeskyně", postava: "loupežník", kouzelnyPrvek: "začarovaný drak", kouzelnyPrvekVTextu: "začarovaný drak", casoveUrceni: "kdysi" },
  { misto: "Obří kámen", postava: "obr", kouzelnyPrvek: "kouzelná síla", kouzelnyPrvekVTextu: "kouzelnou silou", casoveUrceni: "kdysi dávno" },
  { misto: "Skřítkův kámen", postava: "skřítek", kouzelnyPrvek: "začarovaný poklad", kouzelnyPrvekVTextu: "začarovaný poklad", casoveUrceni: "dodnes" },
];

describe("NEZÁVISLÝ SOLVER 3: L2b slovo místa sedí s ručně opsanou tabulkou", () => {
  it("klíč je jméno místa, distraktory jsou přesně postava/kouzelnyPrvek/casoveUrceni, vše se v textu vyskytuje", () => {
    const l2 = topic.generator(2);
    const slova = l2.filter((t) => t.question.includes("ukazuje, že jde o místní pověst?"));
    expect(slova.length).toBeGreaterThan(0);
    let overeno = 0;
    for (const t of slova) {
      const m = t.question.match(/Přečti si text: „(.+)“ Které slovo/u);
      expect(m, `nerozpoznaný formát: ${t.question}`).not.toBeNull();
      const text = m![1];
      const textLower = text.toLowerCase();
      const item = MISTNI_TABULKA.find((mi) => text.includes(mi.misto));
      expect(item, `místo z tabulky nenalezeno v textu: ${text}`).toBeDefined();
      const it_ = item!;
      // Case-insensitive: postava/casoveUrceni se v textu můžou objevit na
      // začátku věty s velkým písmenem, i když je pole zapsané s malým.
      expect(textLower.includes(it_.postava.toLowerCase()), `postava chybí v textu: ${it_.postava}`).toBe(true);
      expect(textLower.includes(it_.kouzelnyPrvekVTextu.toLowerCase()), `kouzelný prvek chybí v textu: ${it_.kouzelnyPrvekVTextu}`).toBe(true);
      expect(textLower.includes(it_.casoveUrceni.toLowerCase()), `časové určení chybí v textu: ${it_.casoveUrceni}`).toBe(true);
      expect(t.correctAnswer, t.question).toBe(it_.misto);
      const distraktory = t.options!.filter((o) => o !== t.correctAnswer);
      expect(new Set(distraktory)).toEqual(new Set([it_.postava, it_.kouzelnyPrvek, it_.casoveUrceni]));
      overeno++;
    }
    expect(overeno).toBe(8);
  });
});

// ── 4. Nezávislá tabulka L3a jádro pravdy × smyšlený prvek ───────────────────

const L3A_NORMAL_TABULKA: Record<string, { skutecny: string; smyslene: string[] }> = {
  "Zvíkov": {
    skutecny: "Hrad Zvíkov stojí nad soutokem Vltavy a Otavy.",
    smyslene: ["V hradu žije rarášek.", "Rarášek v noci přesouvá nábytek.", "Kdo přespí ve věži Markomance, toho stihne neštěstí."],
  },
  "kníže a ves": {
    skutecny: "Kníže na tomto místě založil ves.",
    smyslene: ["Knížeti podala vodu víla.", "Knížecí kůň promluvil lidským hlasem.", "Voda ze studánky uzdraví každou nemoc."],
  },
  "rytíři v hoře": {
    skutecny: "Hora Blaník leží ve středních Čechách.",
    smyslene: ["V hoře Blaník spí rytíři.", "Hora se otevře, až bude zemi nejhůř.", "Rytíři vyjedou zemi na pomoc."],
  },
  "obležení hradu": {
    skutecny: "Hrad na kopci obléhalo nepřátelské vojsko.",
    smyslene: ["Obráncům pomáhal neviditelný skřítek.", "Šípy nepřátel se ve vzduchu zastavovaly.", "Zásoby chleba se každé ráno samy doplnily."],
  },
};

const L3A_REVERSE_TABULKA: Record<string, { smysleny: string; skutecne: string[] }> = {
  "Bruncvíkův meč": {
    smysleny: "Meč v pilíři se sám vysune a porazí nepřátele.",
    skutecne: ["Karlův most je v Praze.", "Most dal postavit Karel IV.", "Karlův most stojí dodnes."],
  },
  "Horymír a Šemík": {
    smysleny: "Kůň Šemík promluvil lidským hlasem.",
    skutecne: ["Vyšehrad je v Praze.", "Vyšehrad stojí na skále nad Vltavou.", "Ves Neumětely leží u Berouna."],
  },
  "Bruncvík a lev": {
    smysleny: "Bruncvík zachránil lva před devítihlavou saní.",
    skutecne: ["Česko má ve státním znaku lva.", "Socha Bruncvíka stojí u Karlova mostu.", "Lev je i na českých mincích."],
  },
};

/** Každá možnost L3a musí být tvrzení, které se opírá o text ukázky (klíčová slova z něj). */
function opiraSeOText(moznost: string, text: string): boolean {
  const slova = moznost.toLowerCase().replace(/[.,]/g, "").split(/\s+/).filter((w) => w.length >= 5);
  const t = text.toLowerCase();
  return slova.some((w) => t.includes(w.slice(0, 5)));
}

describe("NEZÁVISLÝ SOLVER 4: L3a jádro pravdy — klíč a distraktory sedí s ručně opsanou tabulkou", () => {
  it("normální směr: klíč = skutečný prvek, distraktory = smyšlené prvky", () => {
    const l3 = topic.generator(3);
    const normal = l3.filter((t) => t.question.includes("může být historicky nebo zeměpisně skutečný?"));
    expect(normal.length).toBe(4);
    for (const t of normal) {
      const tema = Object.keys(L3A_NORMAL_TABULKA).find((k) => L3A_NORMAL_TABULKA[k].skutecny === t.correctAnswer);
      expect(tema, `klíč nenalezen v tabulce: ${t.correctAnswer}`).toBeDefined();
      const oc = L3A_NORMAL_TABULKA[tema!];
      const distraktory = t.options!.filter((o) => o !== t.correctAnswer);
      expect(new Set(distraktory)).toEqual(new Set(oc.smyslene));
      const text = t.question.match(/„(.+)“/u)![1];
      for (const o of t.options!) expect(opiraSeOText(o, text), `možnost mimo ukázku: ${o}`).toBe(true);
    }
  });

  it("obrácený směr: klíč = smyšlený prvek, distraktory = skutečné prvky", () => {
    const l3 = topic.generator(3);
    const reverse = l3.filter((t) => t.question.includes("je jistě smyšlený?"));
    expect(reverse.length).toBe(3);
    for (const t of reverse) {
      const tema = Object.keys(L3A_REVERSE_TABULKA).find((k) => L3A_REVERSE_TABULKA[k].smysleny === t.correctAnswer);
      expect(tema, `klíč nenalezen v tabulce: ${t.correctAnswer}`).toBeDefined();
      const oc = L3A_REVERSE_TABULKA[tema!];
      const distraktory = t.options!.filter((o) => o !== t.correctAnswer);
      expect(new Set(distraktory)).toEqual(new Set(oc.skutecne));
      const text = t.question.match(/„(.+)“/u)![1];
      for (const o of t.options!) expect(opiraSeOText(o, text), `možnost mimo ukázku: ${o}`).toBe(true);
    }
  });
});

// ── 5. Obecné invarianty na všech úrovních ───────────────────────────────────

describe.each([1, 2, 3])("Pověst — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    const keys = new Set(tasks.map((t) => `${t.question}|${t.correctAnswer}`));
    expect(keys.size).toBeGreaterThanOrEqual(12);
  });

  it("4 různé možnosti, správná je mezi nimi", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
    }
  });

  it("chybový model: každý distraktor má feedback, správná ne", () => {
    for (const t of tasks) {
      for (const key of Object.keys(t.optionFeedback!)) {
        expect(t.options, `feedback klíč mimo options: ${key}`).toContain(key);
        expect(key).not.toBe(t.correctAnswer);
      }
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
    }
  });

  it("nápověda neprozrazuje výsledek (2 unikátní nápovědy)", () => {
    for (const t of tasks) {
      expect(t.hints?.length, t.question).toBeGreaterThanOrEqual(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints ?? []) {
        if (t.correctAnswer.length >= 3) {
          expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
        }
      }
    }
  });

  it("každá úloha má vysvětlení", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const nejdelsiJeKlic = tasks.filter((t) => {
      const maxLen = Math.max(...t.options!.map((o) => o.length));
      return t.correctAnswer.length === maxLen;
    }).length;
    expect(nejdelsiJeKlic / tasks.length, "klíč = nejdelší možnost příliš často").toBeLessThan(0.8);
  });

  it("klíč nevyčnívá tvarem (3 distraktory nezačínají stejným slovem odlišným od klíče)", () => {
    const prvni = (s: string) => s.split(/[\s,—–:;]/)[0].toLowerCase().replace(/[.!?„“"']/g, "");
    let vyjimka = 0;
    for (const t of tasks) {
      const distraktory = t.options!.filter((o) => o !== t.correctAnswer).map(prvni);
      if (distraktory.length < 3) continue;
      if (new Set(distraktory).size === 1 && distraktory[0].length >= 3 && distraktory[0] !== prvni(t.correctAnswer)) {
        vyjimka++;
      }
    }
    expect(vyjimka, "klíč vyčnívá tvarem u některé úlohy").toBe(0);
  });
});

describe("Pověst — L1 a L3 jsou textově disjunktní", () => {
  it("L1 a L3 otázky se nepřekrývají", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje v L1: ${q}`).toBe(false);
  });
});

describe("Pověst — zadání neprozrazuje nálepku, kterou má žák určit", () => {
  const URCOVACI = [
    "Který žánr to je?",
    "Do kterého žánru tahle postava patří?",
    "Jaký druh vyprávění to je?",
  ];
  it("ukázka u určování žánru/druhu neobsahuje žádnou ze svých možností", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        if (!URCOVACI.some((q) => t.question.includes(q))) continue;
        const ukazka = t.question.match(/„(.+)“/u)![1].toLowerCase();
        for (const o of t.options!) {
          // „místní pověst“ / „historická pověst“ rozpadni na nosné slovo
          const nalepka = o.replace(/^(místní|historická) /u, "");
          expect(ukazka.includes(nalepka.toLowerCase()), `únik nálepky „${nalepka}“ v ukázce: ${t.question}`).toBe(false);
        }
      }
    }
  });
});

describe("Pověst — jazyk a nápovědy", () => {
  it("žádná nápověda nenese sdílený dovětek o dosazování do věty", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        for (const h of t.hints ?? []) expect(h, t.question).not.toContain("Dosaď každou možnost");
      }
    }
  });
  it("přenos skloňuje místo po předložce „o“ (6. pád), bez uvozovek", () => {
    const qs = topic.generator(3).map((t) => t.question).filter((q) => q.startsWith("Chceš vymyslet"));
    expect(qs.length).toBe(4);
    for (const q of qs) expect(q).toMatch(/— o (lese za školou|rybníku za vsí|kopci u hřiště|starém dubu na návsi)\./u);
  });
});

describe("Pověst — jedno sezení nemíchá dvě úlohy nad toutéž ukázkou", () => {
  it("prvních 6 úloh každé úrovně má 6 různých ukázek", () => {
    for (const level of [1, 2, 3]) {
      const sezeni = topic.generator(level).slice(0, 6);
      const ukazky = sezeni
        .map((t) => t.question.match(/„(.+)“/u)?.[1])
        .filter((u): u is string => Boolean(u));
      expect(new Set(ukazky).size, `L${level}: stejná ukázka dvakrát v sezení`).toBe(ukazky.length);
    }
  });
});

describe("Pověst — determinismus", () => {
  it("dvě volání gen(level) vrátí stejné množiny otázek (žádný stav mezi voláními)", () => {
    for (const level of [1, 2, 3]) {
      const a = topic.generator(level).map((t) => t.question).sort();
      const b = topic.generator(level).map((t) => t.question).sort();
      expect(a).toEqual(b);
    }
  });
});
