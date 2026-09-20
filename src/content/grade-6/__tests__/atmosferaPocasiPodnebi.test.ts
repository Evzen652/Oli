import { describe, it, expect } from "vitest";
import { ATMOSFERA_POCASI_PODNEBI } from "../zemepis/atmosferaPocasiPodnebi";
import { pocetUnikatnich } from "@/lib/taskIdentity";
import type { PracticeTask } from "@/lib/types";

/**
 * Atmosféra — počasí, podnebí, podnebné pásy (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta): všechna čísla i pojmy se berou ZE ZNĚNÍ
 * OTÁZKY, ne z parametrů generátoru.
 *  • výška — z textu se vytáhnou obě nadmořské výšky a výchozí teplota a klíč
 *    se spočítá jedním vzorcem se znaménkem: t + (h_výchozí − h_cíl)/100 · 0,6.
 *    Generátor naopak počítá pokles zvlášť a směr rozhoduje větví.
 *  • inverze — z rozdílu teplot se dopočítá výška vrcholu.
 *  • amplituda — vytáhnou se VŠECHNY měsíční průměry včetně záporných a ověří
 *    se max − min (generátor bere červenec a leden podle názvu měsíce).
 *  • podnebný pás — vlastní rank-tabulka podle |zeměpisné šířky| plus tvrzení,
 *    že se nikdy nevylosuje šířka ve sporném pásmu 23,5–40° a 60–66,5°.
 *  • popis na L3 — klasifikátor z čísel v popisu (teploty a roční srážky),
 *    ne z klíčových frází generátoru.
 *  • počasí × podnebí — klasifikátor podle slov „dlouhodobý / průměrný / za rok“.
 *  • fakta — vlastní tabulka.
 */
const topic = ATMOSFERA_POCASI_PODNEBI[0];

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

function withSeed<T>(seed: number, fn: () => T): T {
  const orig = Math.random;
  Math.random = seeded(seed);
  try {
    return fn();
  } finally {
    Math.random = orig;
  }
}

const PRAVIDLO = "Teplota vzduchu klesá průměrně o 0,6 °C na každých 100 m nadmořské výšky.";

/** Číslo z českého zápisu: „−16“ → −16, „1 400“ → 1400, „13,8“ → 13,8. */
const num = (s: string): number => Number(s.replace(/[\s ]/g, "").replace("−", "-").replace(",", "."));

/** Všechny teploty v textu, v pořadí výskytu. */
const teploty = (s: string): number[] => [...s.matchAll(/(−?\d+(?:,\d+)?) °C/g)].map((m) => num(m[1]));
/** Všechny nadmořské výšky (metry, ne milimetry). */
const vysky = (s: string): number[] => [...s.matchAll(/(\d[\d\s ]*) m(?![ma-z])/g)].map((m) => num(m[1]));
/** Roční úhrn srážek v mm. */
const srazky = (s: string): number[] => [...s.matchAll(/(\d[\d\s ]*) mm/g)].map((m) => num(m[1]));

const blizko = (a: number, b: number) => Math.abs(a - b) < 0.05;

// Klíč je 1. pád — „Čím se měří teplota vzduchu?“. Akuzativ ve znění otázky
// („teplotu vzduchu“) je negramatický, zvratné pasivum žádá podmět.
const PRISTROJ: Record<string, string> = {
  "teplota vzduchu": "teploměrem",
  "množství spadlých srážek": "srážkoměrem",
  "tlak vzduchu": "tlakoměrem",
};
const JEDNOTKA: Record<string, string> = {
  "množství spadlých srážek": "v milimetrech (mm)",
  "tlak vzduchu": "v hektopascalech (hPa)",
};
const FAKTA: Record<string, string> = {
  "Který plyn je v atmosféře nejhojnější?": "dusík",
  "Který plyn je v atmosféře druhý nejhojnější?": "kyslík",
  "Ve které vrstvě atmosféry se odehrává počasí?": "v troposféře",
  "Která rovnoběžka tvoří hranici tropického podnebného pásu?": "obratník na 23,5°",
  "Která rovnoběžka tvoří hranici polárního podnebného pásu?": "polární kruh na 66,5°",
  "Jak dlouhé období se sleduje, aby se dalo určit podnebí místa?": "nejméně třicet let",
};

/** Rank-tabulka pásů podle |zeměpisné šířky|; sporné pásmo vrací null. */
function pasPodleSirky(abs: number): string | null {
  if (abs <= 23.5) return "tropickém";
  if (abs >= 40 && abs <= 60) return "mírném";
  if (abs >= 66.5) return "polárním";
  return null;
}

/** Klasifikátor popisu podnebí na L3 — jen z čísel v textu. */
function klasifikujPopis(popis: string): string {
  const t = teploty(popis);
  const mm = srazky(popis)[0];
  const tMax = Math.max(...t);
  const tMin = Math.min(...t);
  if (tMax < 0) return "polární pás, podnebí věčného mrazu";
  if (tMax - tMin <= 5 && mm >= 1000) return "tropický pás, stále vlhké podnebí";
  if (mm < 100 && tMax >= 30) return "tropický pás, pouštní podnebí";
  if (tMax - tMin >= 25) return "mírný pás, vnitrozemské podnebí";
  return "mírný pás, přímořské podnebí";
}

/** Počasí × podnebí podle slovníkových znaků, ne podle banky generátoru. */
const jePodnebiUdaj = (s: string): boolean => /dlouhodob|průměrn|za rok|za třicet let/.test(s);

/** 6. pád měsíce — klíč tabulkové úlohy; mapa je vlastní, ne z generátoru. */
const V_MESICI: Record<string, string> = {
  leden: "v lednu",
  duben: "v dubnu",
  červenec: "v červenci",
  říjen: "v říjnu",
};

type Druh = "vyska" | "inverze" | "amplituda" | "mesic" | "pas" | "srazky" | "vnitrozemi" | "popis" | "rozliseni" | "fakt";
type Vysledek = { kind: Druh; ok: boolean; detail?: string };

function solve(t: PracticeTask): Vysledek | null {
  const q = t.question;
  const key = t.correctAnswer;
  let m: RegExpMatchArray | null;

  // ── inverze výšky (obsahuje také pravidlo, proto před výpočtem teploty) ──
  if (/V jaké nadmořské výšce leží vrchol\?$/.test(q)) {
    expect(q, "pravidlo musí být v zadání").toContain(PRAVIDLO);
    const bez = q.replace(PRAVIDLO, "");
    const [dolni] = vysky(bez);
    const [tDolni, tHorni] = teploty(bez);
    const exp = dolni + ((tDolni - tHorni) / 0.6) * 100;
    return { kind: "inverze", ok: blizko(num(key.replace(" m", "")), exp), detail: `čekám ${exp} m` };
  }

  // ── teplota podle nadmořské výšky ──
  if (q.includes(PRAVIDLO)) {
    const bez = q.replace(PRAVIDLO, "");
    const [hOd, hDo] = vysky(bez);
    const [tOd] = teploty(bez);
    const exp = tOd + ((hOd - hDo) / 100) * 0.6;
    return { kind: "vyska", ok: blizko(num(key.replace(" °C", "")), exp), detail: `čekám ${exp} °C` };
  }

  // ── roční teplotní amplituda ──
  if (/Jaká je roční teplotní amplituda/.test(q)) {
    const t2 = teploty(q);
    const exp = Math.max(...t2) - Math.min(...t2);
    return { kind: "amplituda", ok: blizko(num(key.replace(" °C", "")), exp), detail: `čekám ${exp} °C` };
  }

  // ── dopočet chybějícího měsíce z amplitudy ──
  if (/Jaká je průměrná teplota nejchladnějšího měsíce\?$/.test(q)) {
    const amp = num(q.match(/amplituda jednoho místa je (−?\d+(?:,\d+)?) °C/)![1]);
    const max = num(q.match(/nejteplejšího měsíce je (−?\d+(?:,\d+)?) °C/)![1]);
    const exp = max - amp;
    return { kind: "mesic", ok: blizko(num(key.replace(" °C", "")), exp), detail: `čekám ${exp} °C` };
  }

  // ── odečet nejdeštivějšího měsíce z klimatické tabulky ──
  if (/Ve kterém z uvedených měsíců spadne nejvíc srážek\?$/.test(q)) {
    const radky = [...q.matchAll(/(leden|duben|červenec|říjen) (−?\d+) °C a (\d+) mm/g)]
      .map((r) => ({ mesic: r[1], t: num(r[2]), mm: num(r[3]) }));
    expect(radky.length, `tabulka musí mít čtyři měsíce: ${q}`).toBe(4);
    const max = Math.max(...radky.map((r) => r.mm));
    const nej = radky.filter((r) => r.mm === max);
    expect(nej.length, `srážkové maximum musí být jediné: ${q}`).toBe(1);
    const exp = V_MESICI[nej[0].mesic];
    return { kind: "srazky", ok: key === exp, detail: `čekám „${exp}“` };
  }

  // ── podnebný pás ze zeměpisné šířky ──
  if (/^Ve kterém podnebném pásu a na které polokouli leží místo se souřadnicemi /.test(q)) {
    const s = q.match(/(\d+)° ([sj])\. š\./)!;
    expect(q, "musí být i zeměpisná délka").toMatch(/\d+° [vz]\. d\.|0° \(nultý poledník\)/);
    const abs = +s[1];
    const pas = pasPodleSirky(abs);
    expect(pas, `sporné pásmo (${abs}°) se nesmí losovat: ${q}`).not.toBeNull();
    const exp = `v ${pas} pásu na ${s[2] === "s" ? "severní" : "jižní"} polokouli`;
    return { kind: "pas", ok: key === exp, detail: `čekám „${exp}“` };
  }

  // ── dvě místa na stejné rovnoběžce ──
  if (/Co z těchto údajů vyplývá\?$/.test(q)) {
    // Leden je v zadání ten studený a červenec ten teplý měsíc, což platí jen
    // na severní polokouli — jižní šířka by odporovala učivu o prohozených
    // ročních dobách.
    expect(q, `roční chod je severní, šířka tedy musí být s. š.: ${q}`).toMatch(/\d+° s\. š\./);
    const [aL, aC, bL, bC] = teploty(q);
    const ampA = aC - aL;
    const ampB = bC - bL;
    expect(ampA === ampB, `amplitudy se musí lišit: ${q}`).toBe(false);
    const exp = ampA > ampB
      ? "Město A leží ve vnitrozemí, město B blízko moře."
      : "Město B leží ve vnitrozemí, město A blízko moře.";
    return { kind: "vnitrozemi", ok: key === exp, detail: `A=${ampA}, B=${ampB}` };
  }

  // ── typ podnebí z popisu ──
  if ((m = q.match(/^Podnebí jednoho místa je popsané takto: (.+) Do jakého podnebného pásu místo patří a o jaký typ podnebí jde\?$/))) {
    const exp = klasifikujPopis(m[1]);
    return { kind: "popis", ok: key === exp, detail: `čekám „${exp}“` };
  }

  // ── počasí × podnebí ──
  if ((m = q.match(/^Který z údajů popisuje (podnebí, a ne počasí|počasí, a ne podnebí)\?$/))) {
    const chcemePodnebi = m[1].startsWith("podnebí");
    const ostatni = t.options!.filter((o) => o !== key);
    const ok = jePodnebiUdaj(key) === chcemePodnebi && ostatni.every((o) => jePodnebiUdaj(o) !== chcemePodnebi);
    return { kind: "rozliseni", ok, detail: `klíč je ${jePodnebiUdaj(key) ? "podnebí" : "počasí"}` };
  }

  // ── fakta ──
  if (FAKTA[q]) return { kind: "fakt", ok: key === FAKTA[q], detail: `čekám „${FAKTA[q]}“` };
  if ((m = q.match(/^Čím se měří (.+)\?$/))) {
    return { kind: "fakt", ok: key === PRISTROJ[m[1]], detail: `čekám „${PRISTROJ[m[1]]}“` };
  }
  if ((m = q.match(/^V jakých jednotkách se udává (.+)\?$/))) {
    return { kind: "fakt", ok: key === JEDNOTKA[m[1]], detail: `čekám „${JEDNOTKA[m[1]]}“` };
  }
  return null;
}

const levels = [1, 2, 3] as const;
const vzorky = Object.fromEntries(
  levels.map((l) => [l, [11, 22, 33, 44, 55].flatMap((s) => withSeed(s, () => topic.generator(l)))]),
) as Record<1 | 2 | 3, PracticeTask[]>;

const VYPOCETNI: Druh[] = ["vyska", "inverze", "amplituda", "mesic", "pas"];

describe("Atmosféra, počasí a podnebí — metadata", () => {
  it("zeměpis g6, select_one, RVP zápis", () => {
    expect(topic.id).toBe("g6-zem-atmosfera-pocasi-podnebi-6");
    expect(topic.subject).toBe("zemepis");
    expect(topic.inputType).toBe("select_one");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.category).toBe("Přírodní obraz Země");
    expect(topic.topic).toBe("Krajinné sféry");
    expect(topic.rvpNodeId).toBe("g6-zemepis-prirodni-obraz-zeme-krajinne-sfery-atmosfera-pocasi-podnebi-podnebne-pasy");
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each(levels)("Atmosféra, počasí a podnebí — L%i", (level) => {
  const tasks = vzorky[level];

  it("nezávislý solver potvrdí každý klíč", () => {
    for (const t of tasks) {
      const r = solve(t);
      expect(r, `solver nerozpoznal: ${t.question}`).not.toBeNull();
      expect(r!.ok, `${t.question} → ${t.correctAnswer} (${r!.detail ?? ""})`).toBe(true);
    }
  });

  it("4 různé možnosti, právě 1 správná, feedback ke každému distraktoru", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options!.filter((o) => o === t.correctAnswer).length).toBe(1);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}“: ${t.question}`).toBeTruthy();
      }
    }
  });

  it("stejná jednotka ve všech možnostech", () => {
    for (const t of tasks) {
      const kind = solve(t)!.kind;
      if (kind === "vyska" || kind === "amplituda" || kind === "mesic") {
        for (const o of t.options!) expect(o, t.question).toMatch(/ °C$/);
      }
      if (kind === "inverze") {
        for (const o of t.options!) expect(o, t.question).toMatch(/ m$/);
      }
      if (kind === "srazky") {
        for (const o of t.options!) expect(o, t.question).toMatch(/^v /);
      }
    }
  });

  it("klíč není ve znění, nápovědy jsou dvě, různé a neprozrazují", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), t.question).toBe(false);
      expect(t.hints!.length).toBe(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      expect(t.hints![1].length).toBeGreaterThanOrEqual(t.hints![0].length * 1.2);
      for (const h of t.hints!) {
        expect(h.includes(t.correctAnswer), `hint leak: ${t.question}`).toBe(false);
        // pravidlo 0,6 °C/100 m smí být jen v zadání, nápověda na něj jen odkazuje
        expect(h, `hint opakuje pravidlo: ${t.question}`).not.toMatch(/0,6/);
        // číselný klíč (teplota, výška): jeho hodnota nesmí být v nápovědě
        const cislo = t.correctAnswer.match(/^(−?[\d\s ]+(?:,\d+)?) (?:°C|m)$/)?.[1];
        // Hledá se samostatné číslo, ne libovolná posloupnost číslic: klíč
        // „10 °C“ není prozrazený tím, že nápověda mluví o 100 m.
        if (cislo) {
          const esc = cislo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          expect(h, `hint obsahuje ${cislo}: ${t.question}`).not.toMatch(
            new RegExp(`(^|[^\\d,])${esc}([^\\d,]|$)`),
          );
        }
      }
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("výpočetní úlohy mají solutionSteps s mezivýsledkem", () => {
    for (const t of tasks) {
      if (VYPOCETNI.includes(solve(t)!.kind)) {
        expect(t.solutionSteps!.length, t.question).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("výškové úlohy mají pravidlo v zadání, rozdíl výšek je násobek 100 m", () => {
    for (const t of tasks) {
      const kind = solve(t)!.kind;
      if (kind !== "vyska" && kind !== "inverze") continue;
      expect(t.question).toContain(PRAVIDLO);
      const v = vysky(t.question.replace(PRAVIDLO, ""));
      if (kind === "vyska") expect(Math.abs(v[0] - v[1]) % 100, t.question).toBe(0);
      const klic = num(t.correctAnswer.replace(/ (?:°C|m)$/, ""));
      expect(Math.round(klic * 10) / 10, t.question).toBe(klic);
    }
  });

  it("čtyřměsíční roční chod je klimaticky konzistentní", () => {
    for (const t of tasks) {
      const m = t.question.match(
        /leden (−?\d+) °C, duben (−?\d+) °C, červenec (−?\d+) °C, říjen (−?\d+) °C/,
      );
      if (!m) continue;
      const [leden, duben, cervenec, rijen] = m.slice(1).map(num);
      // Přechodné měsíce musí ležet mezi zimou a létem, jinak roční chod
      // nepatří žádnému skutečnému místu.
      for (const mesic of [duben, rijen]) {
        expect(mesic, t.question).toBeGreaterThan(leden);
        expect(mesic, t.question).toBeLessThan(cervenec);
      }
      expect(Math.abs(rijen - duben), t.question).toBeGreaterThanOrEqual(2);
      expect(Math.abs(rijen - duben), t.question).toBeLessThanOrEqual(6);
      // Teplejší podzim než jaro je znak zpoždění za mořem, tedy malé
      // amplitudy. Vnitrozemský chod (velká amplituda) má naopak duben
      // o kousek teplejší než říjen — Moskva 6,8 × 5,6 °C, Irkutsk 3,2 × 2,3.
      if (cervenec - leden > 28) expect(duben, t.question).toBeGreaterThan(rijen);
      else expect(rijen, t.question).toBeGreaterThan(duben);
    }
  });

  it("žádná mapa ani obrázek v zadání", () => {
    for (const t of tasks) expect(t.question).not.toMatch(/mapě|mapu|mapa|obrázk/);
  });

  it("≥ 12 různých úloh na jedno volání generátoru", () => {
    const jedno = withSeed(7, () => topic.generator(level));
    expect(pocetUnikatnich(jedno)).toBeGreaterThanOrEqual(12);
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const nejdelsi = tasks.filter((t) => {
      const ostatni = t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length);
      return t.correctAnswer.length > Math.max(...ostatni);
    }).length;
    expect(nejdelsi / tasks.length).toBeLessThan(0.5);
  });
});

describe("Atmosféra, počasí a podnebí — jazyk a fakta", () => {
  const vse = [...vzorky[1], ...vzorky[2], ...vzorky[3]];
  const texty = (t: PracticeTask): string[] => [
    t.question,
    t.explanation ?? "",
    ...(t.hints ?? []),
    ...Object.values(t.optionFeedback ?? {}),
    ...(t.solutionSteps ?? []),
  ];

  it("zvratné pasivum má podmět v 1. pádě, ne ve 4.", () => {
    for (const t of vse) {
      for (const s of texty(t)) {
        // „rychlost“ a „množství“ mají 1. a 4. pád shodný, chyba je vidět
        // jen na teplotě: „Čím se měří teplotu vzduchu?“
        expect(s, `4. pád po zvratném pasivu: ${t.question}`).not.toMatch(/se (měří|udává) teplotu/);
      }
    }
  });

  // 78 / 21 / ~1 % platí pro SUCHÝ vzduch. Vodní pára u povrchu kolísá zhruba
  // 0–4 % a běžně je jí víc než argonu, takže do zbytkového procenta nepatří.
  it("vodní pára se nepočítá do necelého procenta vzduchu", () => {
    const SPATNE = [
      /i na vodní páru, připadá/,
      /vodní páry je ve vzduchu jen zlomek procenta/i,
      /Vodní páry je ve vzduchu málo/,
      /Vodní pára ve vzduchu je, ale málo/,
      /Zbylé dvě možnosti tvoří dohromady necelé/,
      /těch je ve vzduchu dohromady necelé/,
    ];
    for (const t of vse) {
      for (const s of texty(t)) {
        for (const re of SPATNE) {
          expect(re.test(s), `vodní pára ve zbytkovém procentu: ${s}`).toBe(false);
        }
      }
    }
  });

  it("kritérium pouště je 250 mm, ne desítky milimetrů", () => {
    for (const t of vse) {
      for (const s of texty(t)) {
        if (/V pouštích spadne/.test(s)) expect(s, t.question).toContain("250 mm");
      }
    }
  });

  it("polární kritérium mluví o podnebí, ne o pásu za polárním kruhem", () => {
    for (const t of vse) {
      for (const s of texty(t)) {
        expect(s, `10 °C přisouzeno celému polárnímu pásu: ${t.question}`).not.toMatch(
          /V polárním pásu nepřesáhne/,
        );
      }
    }
  });

  it("nápověda u dopočtu měsíce neprozradí znaménko a znaménko nerozhoduje samo", () => {
    for (const t of vzorky[3]) {
      if (solve(t)!.kind !== "mesic") continue;
      for (const h of t.hints!) {
        expect(h, `nápověda hodnotí výsledek: ${t.question}`).not.toMatch(/vyjde záporn|bude záporn/);
      }
      const klic = num(t.correctAnswer.replace(" °C", ""));
      const stejneZnamenko = t.options!.filter(
        (o) => Math.sign(num(o.replace(" °C", ""))) === Math.sign(klic),
      ).length;
      expect(stejneZnamenko, `znaménko určí klíč samo: ${t.question}`).toBeGreaterThanOrEqual(2);
    }
  });

  it("dvojice měst na rovnoběžce je klimaticky možná", () => {
    for (const t of vzorky[3]) {
      if (solve(t)!.kind !== "vnitrozemi") continue;
      const lat = +t.question.match(/(\d+)° s\. š\./)![1];
      const [aLeden, , bLeden, bCervenec] = teploty(t.question);
      expect(lat, t.question).toBeGreaterThanOrEqual(46);
      expect(lat, t.question).toBeLessThanOrEqual(54);
      // Krutá kontinentální zima je reálná až od vyšších šířek.
      if (lat < 48) expect(aLeden, t.question).toBeGreaterThanOrEqual(-18);
      // Ani nejmírnější pobřeží těchto šířek nemá leden nad 5 °C ani
      // červenec nad 19 °C.
      expect(bLeden, t.question).toBeLessThanOrEqual(5);
      expect(bCervenec, t.question).toBeLessThanOrEqual(19);
    }
  });

  it("obratníková nápověda neprozrazuje jméno rovnoběžky", () => {
    for (const t of vzorky[1]) {
      if (!/hranici tropického podnebného pásu/.test(t.question)) continue;
      for (const h of t.hints!) {
        expect(h, `etymologie v nápovědě: ${t.question}`).not.toMatch(/obratník|obrací|Raka|Kozoroh/);
      }
    }
  });
});

describe("Atmosféra, počasí a podnebí — gradace a determinismus", () => {
  it("L1 je jen pojem nebo jednotka, bez výpočtu", () => {
    for (const t of vzorky[1]) {
      expect(["fakt", "rozliseni"], t.question).toContain(solve(t)!.kind);
      expect(t.question, t.question).not.toContain(PRAVIDLO);
    }
  });

  it("L2 používá pravidlo na konkrétní čísla ze zadání", () => {
    for (const t of vzorky[2]) {
      expect(["pas", "amplituda", "vyska", "srazky"], t.question).toContain(solve(t)!.kind);
    }
  });

  // Sezení má šest úloh. Dřív z nich byly tři amplitudové, dvě z nich navíc
  // se shodným zadáním i shodným výsledkem — po druhé úloze už dítě jen
  // mechanicky odečítalo totéž číslo.
  it("sezení šesti úloh L2 nezahltí amplituda", () => {
    for (const seed of [11, 22, 33, 44, 55, 7, 99]) {
      const sezeni = withSeed(seed, () => topic.generator(2)).slice(0, topic.sessionTaskCount ?? 6);
      const amp = sezeni.filter((t) => solve(t)!.kind === "amplituda");
      expect(amp.length, `amplituda ${amp.length}× v sezení (seed ${seed})`).toBeLessThanOrEqual(2);
      // Dvě amplitudové úlohy v jednom sezení se musí lišit vstupním formátem
      // (dvě teploty × tabulka čtyř měsíců) i výsledkem.
      const format = (t: PracticeTask) => (/duben/.test(t.question) ? "ctyri" : "dva");
      expect(new Set(amp.map(format)).size, `dvakrát stejný formát (seed ${seed})`).toBe(amp.length);
      expect(new Set(amp.map((t) => t.correctAnswer)).size, `dvakrát stejný výsledek (seed ${seed})`).toBe(amp.length);
    }
  });

  it("L3 je přenos nebo inverze, žádná šablona z L2", () => {
    for (const t of vzorky[3]) {
      expect(["popis", "vnitrozemi", "inverze", "mesic"], t.question).toContain(solve(t)!.kind);
    }
  });

  it("znění otázek L1 a L3 je disjunktní", () => {
    const l1 = new Set(vzorky[1].map((t) => t.question));
    expect(vzorky[3].filter((t) => l1.has(t.question))).toEqual([]);
    const l3 = new Set(vzorky[3].map((t) => t.question));
    expect(vzorky[1].filter((t) => l3.has(t.question))).toEqual([]);
  });

  it("každá úroveň střídá všechny své šablony", () => {
    const druhy = (l: 1 | 2 | 3) => new Set(vzorky[l].map((t) => solve(t)!.kind));
    expect(druhy(1).size).toBeGreaterThanOrEqual(2);
    expect(druhy(2).size).toBeGreaterThanOrEqual(4);
    expect(druhy(3).size).toBeGreaterThanOrEqual(4);
  });

  it("gen() je deterministický a bez stavu modulu", () => {
    const otisk = () => JSON.stringify(levels.map((l) => topic.generator(l).map((t) => [t.question, t.correctAnswer])));
    const a = withSeed(123, otisk);
    Math.random(); Math.random();
    const b = withSeed(123, otisk);
    expect(b).toBe(a);
  });
});
