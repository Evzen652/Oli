import { describe, it, expect } from "vitest";
import { HYDROSFERA_VODA_NA_ZEMI } from "../zemepis/hydrosferaVodaNaZemi";
import type { PracticeTask } from "@/lib/types";

/**
 * Hydrosféra — FAKTICKÝ + ÚSUDKOVÝ vzor select_one.
 *
 * NEZÁVISLÝ SOLVER (druhá cesta) — z generátoru nebere žádná data:
 *  1. Ze znění otázky vytáhne ZNAK (bez odtoku, začátek toku, konec toku,
 *     hranice mezi povodími, póry a pukliny, zamrzlá voda, mezi Evropou
 *     a Amerikou…) a v TABULCE ZNAK → POJEM, sepsané zde nezávisle na
 *     generátoru, si dohledá, jak má klíč vypadat.
 *  2. Úloha s pravým/levým přítokem se neřeší tabulkou, ale vlastní úhlovou
 *     aritmetikou: směr po proudu → otočení o 90° doprava → světová strana
 *     pravého břehu; ta se porovná se stranou, odkud přitéká potok.
 *  3. Otázky „co NEplatí" se řeší vlastním seznamem NEPRAVDIVÝCH tvrzení
 *     (podzemní řeky a jezera; hromadění soli v jezeře s odtokem).
 * Dál test hlídá formální invarianty (4 možnosti, právě 1 správná, feedback
 * u každého distraktoru, klíč mimo znění, dvě unikátní nápovědy bez klíče,
 * klíč nevyčnívá délkou ani prvním slovem), gradaci, ≥ 12 úloh na úroveň,
 * determinismus a zákaz sporných čísel (počet oceánů, délka řeky v km).
 */
const topic = HYDROSFERA_VODA_NA_ZEMI[0];

// ── 1) Vlastní tabulka POJMŮ (co má být klíčem) ──────────────────────────
const POJEM: Record<string, RegExp> = {
  // rozložení vody
  podilSlane: /^asi 97 %$/,
  podilPovrchu: /^asi 71 %$/,
  zasobaSladke: /^v ledovcích a ledových štítech$/,
  zasobaLedu: /^v Antarktidě$/,
  oceanNejvetsi: /^Tichý oceán$/,
  oceanEvropaAmerika: /^Atlantský oceán$/,
  pohonKolobehu: /^výpar a srážky$/,
  defKolobeh: /^pořád se vrací zpátky/,
  // části toku a povodí
  zacatekToku: /^pramen$/,
  konecToku: /^ústí$/,
  mensiTok: /^přítok$/,
  defPovodi: /^území, ze kterého všechna voda stéká/,
  defRozvodi: /^hranice mezi dvěma povodími/,
  defJezero: /^přirozená vodní nádrž/,
  defLedovec: /^velké množství ledu/,
  defPodzemni: /^voda, která vyplňuje póry a pukliny/,
  nejdelsiRekaCR: /^Vltava$/,
  nejhlubsiJezero: /^Bajkal$/,
  vsakovani: /^vsakování$/,
  // příčiny a důsledky
  vyparNechaSul: /sůl zůstane v moři/,
  bezodtokeSlane: /^Voda z něj odchází jen výparem/,
  bezodtokeSlane3: /^Slaná, protože voda odchází jen výparem/,
  horniTok: /^Teče tam prudce z kopce/,
  dolniTok: /^Teče tam pomalu po rovině/,
  dolniTokZPopisu: /^Na dolním toku/,
  stranaPritoku: /^Přitéká po naší pravé ruce, když se díváme po proudu/,
  doplneniStudny: /^Ze srážek, které se vsáknou do země/,
  vyverPramene: /narazí na nepropustnou vrstvu/,
  rozsahPovodi: /^Všechna místa, odkud voda stéká/,
  kudyRozvodi: /^Po hřebenech a vyvýšeninách/,
  odtokOdnasi: /^Odtékající voda rozpuštěné soli/,
  osudDeste: /^Část se vsákne, část odteče/,
  rustReky: /^Cestou se do ní vlily přítoky/,
  rovnovahaOceanu: /stejné množství vody zase vypaří/,
  rychlyOdtok: /^Voda odteče rychleji/,
  poklesHladiny: /^Klesne, protože voda z krajiny rychle odteče/,
  zmensovaniJezera: /^Bude se zmenšovat a hladina klesne/,
  vodaNadJilem: /^V písku nad jílem/,
  tajiciSnih: /^Na jaře v jeho povodí taje sníh/,
  pramenZPopisu: /^pramen, tedy místo/,
  rozvodiZPopisu: /^rozvodí mezi dvěma povodími$/,
  vhodnyPozemek: /vrstva štěrku nad nepropustným jílem/,
  pokusSklenice: /^V jedné bílý slaný povlak/,
  znecisteniStudni: /^Hnojivo se vsákne se srážkami/,
};

// ── 2) Vlastní tabulka ZNAK → POJEM (pořadí: specifičtější dřív) ─────────
const ZNAK: [RegExp, keyof typeof POJEM][] = [
  // L1 — rozložení vody a oceány
  [/veškeré vody na Zemi je slaná/, "podilSlane"],
  [/zemského povrchu pokrývá voda/, "podilPovrchu"],
  [/největší část sladké vody/, "zasobaSladke"],
  [/největší zásoba ledu/, "zasobaLedu"],
  [/oceán je ze všech největší/, "oceanNejvetsi"],
  [/odděluje Evropu od Severní Ameriky/, "oceanEvropaAmerika"],
  [/pohánějí koloběh vody/, "pohonKolobehu"],
  [/voda na Zemi koluje/, "defKolobeh"],
  // L1 — pojmy
  [/místo, kde vodní tok začíná/, "zacatekToku"],
  [/místo, kde se řeka vlévá/, "konecToku"],
  [/menší vodní tok, který se vlévá/, "mensiTok"],
  [/^Co je povodí řeky/, "defPovodi"],
  [/^Co je rozvodí/, "defRozvodi"],
  [/^Co je jezero/, "defJezero"],
  [/^Co je ledovec/, "defLedovec"],
  [/^Co je podzemní voda/, "defPodzemni"],
  // L1 — zástupci a rozpoznání z popsané situace (jiný střih než definice)
  [/řeka je v Česku nejdelší/, "nejdelsiRekaCR"],
  [/jezero je na Zemi nejhlubší/, "nejhlubsiJezero"],
  [/mizí do půdy/, "vsakovani"],
  // L2 — jev → příčina
  [/Proč není ten déšť slaný/, "vyparNechaSul"],
  [/ze kterého nevytéká žádná řeka/, "bezodtokeSlane"],
  [/zařezává hluboko do skály/, "horniTok"],
  [/ukládá v korytě písek a bahno/, "dolniTok"],
  [/pozná pravý přítok/, "stranaPritoku"],
  [/doplňuje voda ve studni/, "doplneniStudny"],
  [/vyvěrá právě v určitém místě/, "vyverPramene"],
  [/patří do povodí Labe/, "rozsahPovodi"],
  [/vede rozvodí mezi dvěma povodími/, "kudyRozvodi"],
  [/sůl nehromadí/, "odtokOdnasi"],
  [/deštěm, který spadne na louku/, "osudDeste"],
  [/víc vody než u pramene/, "rustReky"],
  [/oceán nepřeteče/, "rovnovahaOceanu"],
  // L3 — situace
  [/pouštní pánvi.*nevytéká/s, "bezodtokeSlane3"],
  [/vykáceli les/, "rychlyOdtok"],
  [/vysušili mokřady/, "poklesHladiny"],
  [/na závlahy polí/, "zmensovaniJezera"],
  [/vrstva písku a pod ní vrstva jílu/, "vodaNadJilem"],
  [/na jaře prudce zvedne/, "tajiciSnih"],
  [/ze skály vytéká čistá voda/, "pramenZPopisu"],
  [/k Severnímu moři a na druhou/, "rozvodiZPopisu"],
  [/pozemek pro novou studnu/, "vhodnyPozemek"],
  [/Dvě sklenice/, "pokusSklenice"],
  [/ostrovy uprostřed koryta/, "dolniTokZPopisu"],
  [/silně hnojit pole/, "znecisteniStudni"],
];

// ── 3) Vlastní seznam NEPRAVDIVÝCH tvrzení (pro otázky „co NEplatí") ─────
/** [kontext v otázce, znak tvrzení, které v tom kontextu NEPLATÍ] */
const NEPRAVDA: [RegExp, RegExp][] = [
  // Jezero s odtokem je průtočné: rozpuštěné látky odcházejí s vodou pryč,
  // hromadit se mohou jen tam, kde odtok chybí.
  [/jezeře, ze kterého vytéká řeka/, /hromadí|slanou/],
  // Podzemní voda vyplňuje póry a pukliny; souvislé toky a nádrže pod
  // povrchem jsou vzácná výjimka v krasu, ne běžný stav.
  [/o podzemní vodě/, /podzemních řekách|řekách a jezerech/],
];

// ── Úhlová aritmetika pro stranu přítoku (bez tabulky opaků) ─────────────
const AZIMUT: Record<string, number> = { sever: 0, východ: 90, jih: 180, západ: 270 };
const norm = (u: number) => ((u % 360) + 360) % 360;
const stranaZeSlova = (s: string): number => {
  const hit = Object.entries(AZIMUT).find(([n]) => s.startsWith(n.slice(0, 4)));
  expect(hit, `neznámá světová strana „${s}"`).toBeDefined();
  return hit![1];
};

/** Nezávislý solver: vrátí regex, kterému musí odpovídat právě jedna možnost. */
function solve(t: PracticeTask): RegExp {
  const q = t.question;

  // (a) „Které tvrzení … NEplatí?" — vlastní seznam nepravd.
  if (/NEplatí/.test(q)) {
    const rule = NEPRAVDA.find(([kontext]) => kontext.test(q));
    expect(rule, `solver nezná kontext otázky NEplatí: ${q}`).toBeDefined();
    return rule![1];
  }

  // (b) Pravý/levý přítok z popsaných směrů — spočítáno, ne dohledáno.
  const m = q.match(/teče od (\S+) k (\S+) a potok do ní přitéká ze (\S+) strany/);
  if (m) {
    const odkud = stranaZeSlova(m[1]);
    const kam = stranaZeSlova(m[2]);
    expect(norm(odkud - kam), `řeka neteče přímo: ${q}`).toBe(180);
    // Po proudu se díváme směrem `kam`; pravá ruka je o 90° po směru hodin.
    const pravaRuka = norm(kam + 90);
    const odkudPritok = stranaZeSlova(m[3]);
    if (odkudPritok === pravaRuka) return /^O pravý/;
    if (odkudPritok === norm(pravaRuka + 180)) return /^O levý/;
    throw new Error(`přítok nepřitéká kolmo k toku: ${q}`);
  }

  // (c) Znak z otázky → pojem z vlastní tabulky.
  const hit = ZNAK.find(([r]) => r.test(q));
  expect(hit, `solver nezná úlohu: ${q}`).toBeDefined();
  return POJEM[hit![1]];
}

const wholeWord = (text: string, s: string) =>
  new RegExp(`(^|[^\\p{L}])${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\p{L}]|$)`, "iu").test(text);
const prvniSlovo = (s: string) => s.trim().split(/\s+/)[0].toLowerCase();

describe("Hydrosféra — metadata", () => {
  it("zeměpis g6, select_one, kategorie a téma dle RVP", () => {
    expect(topic.subject).toBe("zemepis");
    expect(topic.id).toBe("g6-zem-hydrosfera-voda-na-zemi-6");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.category).toBe("Přírodní obraz Země");
    expect(topic.topic).toBe("Krajinné sféry");
    expect(topic.rvpNodeId).toBe(
      "g6-zemepis-prirodni-obraz-zeme-krajinne-sfery-hydrosfera-oceany-reky-jezera-podzemni-voda",
    );
    expect(topic.briefDescription!.split(/\s+/).length).toBeLessThanOrEqual(14);
  });
});

describe.each([1, 2, 3])("Hydrosféra — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥ 12 unikátních úloh", () => {
    expect(new Set(tasks.map((t) => `${t.question}|${t.correctAnswer}`)).size).toBeGreaterThanOrEqual(12);
  });

  it("4 různé možnosti, klíč mezi nimi, žádné solutionSteps", () => {
    for (const t of tasks) {
      expect(t.options, t.question).toBeDefined();
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options, t.question).toContain(t.correctAnswer);
      expect(t.solutionSteps, t.question).toBeUndefined();
    }
  });

  it("nezávislý solver: právě jedna možnost je správná a je to klíč", () => {
    for (const t of tasks) {
      const exp = solve(t);
      const spravne = t.options!.filter((o) => exp.test(o));
      expect(spravne, `${t.question}\n→ ${String(exp)}\n${t.options!.join(" | ")}`).toEqual([t.correctAnswer]);
    }
  });

  it("chybový model: feedback u každého distraktoru, u klíče ne", () => {
    for (const t of tasks) {
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback?.[d], `chybí feedback „${d}": ${t.question}`).toBeTruthy();
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

  it("úloha jde vyřešit bez mapy a bez obrázku", () => {
    for (const t of tasks) {
      const texty = [t.question, ...(t.hints ?? []), t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
      for (const s of texty) expect(s, t.question).not.toMatch(/na obrázku|podívej se na mapu/i);
    }
  });

  it("klíč nevyčnívá délkou", () => {
    const delsi = (t: PracticeTask) =>
      t.correctAnswer.length >= 1.25 * Math.max(...t.options!.filter((o) => o !== t.correctAnswer).map((o) => o.length));
    expect(tasks.filter(delsi).length / tasks.length).toBeLessThan(0.35);
    const prumer = (f: (t: PracticeTask) => number) => tasks.reduce((s, t) => s + f(t), 0) / tasks.length;
    const avgKlic = prumer((t) => t.correctAnswer.length);
    const avgDistraktor = prumer(
      (t) => t.options!.filter((o) => o !== t.correctAnswer).reduce((s, o) => s + o.length, 0) / 3,
    );
    expect(avgKlic).toBeLessThanOrEqual(avgDistraktor * 1.15);
  });

  it("klíč nevyčnívá tvarem: sdílí-li distraktory první slovo, sdílí ho i klíč", () => {
    for (const t of tasks) {
      const ds = t.options!.filter((o) => o !== t.correctAnswer).map(prvniSlovo);
      if (new Set(ds).size === 1) {
        expect(prvniSlovo(t.correctAnswer), `check:options — ${t.question}`).toBe(ds[0]);
      }
    }
  });

  it("žádná sporná čísla v klíči (počet oceánů, délka řeky v km)", () => {
    for (const t of tasks) {
      expect(t.correctAnswer, t.question).not.toMatch(/\d+\s*(km|kilometrů)\b/);
      expect(t.question, "počet oceánů je sporný (Jižní oceán)").not.toMatch(/kolik\D{0,20}oceán/i);
    }
  });
});

describe("Hydrosféra — gradace a determinismus", () => {
  it("otázky L1, L2 a L3 jsou navzájem disjunktní", () => {
    const q = (l: number) => new Set(topic.generator(l).map((t) => t.question));
    const [l1, l2, l3] = [q(1), q(2), q(3)];
    expect([...l1].filter((x) => l3.has(x))).toEqual([]);
    expect([...l1].filter((x) => l2.has(x))).toEqual([]);
    expect([...l2].filter((x) => l3.has(x))).toEqual([]);
  });

  it("L1 banka má ≥ 14 různých faktů, L2 i L3 ≥ 12 různých situací", () => {
    expect(new Set(topic.generator(1).map((t) => t.question)).size).toBeGreaterThanOrEqual(14);
    expect(new Set(topic.generator(2).map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
    expect(new Set(topic.generator(3).map((t) => t.question)).size).toBeGreaterThanOrEqual(12);
  });

  it("L3 je situační, L1 definiční (znění se nepřekrývá tvarem)", () => {
    for (const t of topic.generator(1)) {
      expect(t.question, "L1 má být krátká faktická otázka").not.toMatch(/Po vykácení|začali brát|vysušili/);
    }
    const l3 = topic.generator(3);
    const situacni = l3.filter((t) => /\. /.test(t.question) || /NEplatí/.test(t.question)).length;
    expect(situacni / l3.length).toBeGreaterThan(0.6);
  });

  it("v jednom sezení (6 po sobě) nejsou víc než dvě definice pojmu u toku", () => {
    // Žák si stěžoval, že mu sezení vyšlo jako čtyři definice ze stejné
    // čtveřice pojmů (pramen, ústí, povodí, rozvodí). Rotace bere položky
    // banky po sobě, takže o skladbě sezení rozhoduje POŘADÍ v bance.
    const tasks = topic.generator(1);
    const POJMOVA = /^Jak se nazývá|^Co je povodí|^Co je rozvodí/;
    const n = tasks.length;
    for (let s = 0; s < n; s++) {
      const okno = Array.from({ length: 6 }, (_, k) => tasks[(s + k) % n]);
      const pocet = okno.filter((t) => POJMOVA.test(t.question)).length;
      expect(pocet, okno.map((t) => t.question).join(" | ")).toBeLessThanOrEqual(2);
    }
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
