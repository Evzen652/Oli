/**
 * Nezávislý řešič tématu „Adresa, blahopřání, pozdrav z prázdnin" (2. r.).
 *
 * Generátor má kontrolu uvnitř sebe (`zkontroluj`), ta se ale dívá jen na tvar
 * úlohy — kolik je možností, jestli klíč nevyčnívá délkou, jestli nápověda
 * necituje klíč. **Jestli je klíč správně, neví.** To je past z
 * `CONTENT_AUTHORING.md` §1.1: klíč odvozený z téže logiky, která úlohu
 * složila, nic nedokazuje.
 *
 * Tenhle soubor proto úlohy řeší **vlastními pravidly**, napsanými z toho, jak
 * adresa a pohlednice fungují, ne z datových polí generátoru:
 *
 * - **tvar údaje v adrese** — vlastní regulární výrazy na jméno, ulici
 *   s číslem a řádek „PSČ město"; podle nich se pozná, čím kterou část adresy
 *   je, bez ohledu na to, jak si ji generátor pojmenoval;
 * - **pořadí řádků** — na první řádek patří jméno, které **není** jméno
 *   odesílatele uvedené v zadání;
 * - **žánr textu** — vlastní klasifikátor podle funkce (děkuje × zdraví
 *   z místa × přeje k příležitosti × předává cizí zprávu);
 * - **příležitost a oslovení** — vlastní tabulka, co která situace žádá
 *   a komu se vyká; každý distraktor musí aspoň jedno z pravidel porušit;
 * - **úplná adresa** — vlastní validátor tří řádků; projít smí jen klíč;
 * - **pohlednice** — vlastní tabulka tří údajů (kde jsem, co tam dělám,
 *   podpis) pro každou situaci;
 * - **přání × oznámení × žádost** — přání obsahuje přací formuli, nemluví
 *   o mně a na nic se neptá.
 *
 * ⚠️ `\b` v JavaScriptu je ASCII, takže `/\bpromiň\b/` se chytí i uvnitř
 * „Promiňte" (to stálo čas v sousedním tématu). Všechny výrazy níž proto mají
 * hranice vypsané explicitně přes `H` a `K`.
 *
 * Hlídač se ověřuje obráceně — spodní blok „obracena kontrola" cpe do každého
 * pravidla schválně vadný vstup a čeká odmítnutí. Bez toho by mohlo mlčet
 * pravidlo, které nikdy nic nezamítne.
 */
import { describe, it, expect } from "vitest";
import { ADRESA_BLAHOPRANI_POZDRAV } from "@/content/grade-2/cjl/adresaBlahopraniPozdrav";
import type { PracticeTask } from "@/lib/types";

const TEMA = ADRESA_BLAHOPRANI_POZDRAV[0];
const gen = (level: number) => TEMA.generator!(level) as PracticeTask[];

const L1 = gen(1), L2 = gen(2), L3 = gen(3);
const VSE = [...L1, ...L2, ...L3];

/**
 * **Obrácené ověření jedním příkazem:** `MUTACE=1 npx vitest run
 * src/test/adresa-blahoprani.test.ts` prohlásí za klíč první distraktor. Každé
 * měřítko obsahu níž pak MUSÍ spadnout — pravidlo, které i tak projde, nic
 * neměří a je k zahození.
 *
 * Proč takhle a ne ručně: v sousedním tématu se obrácené ověření udělalo jednou
 * rukou a výsledek zůstal jen ve zprávě ze session. Takhle ho může kdokoli
 * zopakovat po každé úpravě obsahu.
 */
const MUTACE = process.env.MUTACE === "1";
const klic = (t: PracticeTask) => (MUTACE ? (t.options ?? [])[0] !== t.correctAnswer ? (t.options ?? [])[0] : (t.options ?? [])[1] : t.correctAnswer);
const distraktory = (t: PracticeTask) => (t.options ?? []).filter((o) => o !== klic(t));

// ── Vlastní jazykové nástroje ────────────────────────────────────────────────

/** Hranice slova vypsaná ručně — `\b` česká písmena neumí. */
const H = String.raw`(^|[\s„(])`;
const K = String.raw`([\s.,?!"“)]|$)`;

const VELKE = "A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ";
const MALE = "a-záčďéěíňóřšťúůýž";

/** „Eva Horáková" — dvě slova s velkým začátkem. Jen příjmení neprojde. */
const JE_JMENO = new RegExp(`^[${VELKE}][${MALE}]+ [${VELKE}][${MALE}]+$`);
/** „Krátká 25" — název ulice a za ním číslo domu. */
const JE_ULICE = new RegExp(`^[${VELKE}][${MALE}]+ \\d+$`);
/** „390 01 Tábor" — pětimístné PSČ ve dvou skupinách a za ním město. */
const JE_RADEK_MESTA = new RegExp(`^\\d{3} \\d{2} [${VELKE}][${MALE}]+$`);
/** „390 01" samo o sobě. */
const JE_PSC = /^\d{3} \d{2}$/;
/** „Tábor" — jedno slovo s velkým začátkem. */
const JE_MESTO = new RegExp(`^[${VELKE}][${MALE}]+$`);

/** Rozdělí adresu na řádky tak, jak je zapsaná v jedné možnosti. */
const radky = (s: string) => s.split(", ");

/** Adresa je úplná a ve správném pořadí: jméno, ulice s číslem, PSČ a město. */
function jeUplnaAdresa(s: string): boolean {
  const r = radky(s);
  return r.length === 3 && JE_JMENO.test(r[0]) && JE_ULICE.test(r[1]) && JE_RADEK_MESTA.test(r[2]);
}

/**
 * Žánr textu podle toho, co text **dělá** — ne podle slov, která do něj autor
 * vložil jako vodítko. Pořadí pravidel je součástí definice: děkování se pozná
 * první, protože „děkuji za dárek" by se dalo číst i jako přání.
 */
function zanrTextu(s: string): string {
  if (new RegExp(`${H}(děkuj\\w*|Děkuj\\w*|díky|Díky)${K}`).test(s)) return "poděkování";
  const zdravi = /^(Zdravím|Zdravíme|Posíláme)/.test(s);
  const misto = new RegExp(`${H}(hor|moře|tábora)${K}`).test(s);
  if (zdravi && misto) return "pozdrav z prázdnin";
  if (/nejlepší|Hodně zdraví|Krásné Vánoce|gratul/.test(s)) return "blahopřání";
  return "vzkaz";
}

const VYKACI = new RegExp(`${H}(vám|Vám|vás|vaše|přejeme|máte|dáte)${K}`);
const TYKACI = new RegExp(`${H}(ti|tě|tvůj|tvoje|jsi|máš|přeju|vezmeš|koupíš)${K}`);
/**
 * Věta mluví o mně, ne o adresátovi.
 *
 * „nás" tady vědomě **není**: přání „ať máš z nás pořád radost" mluví o nás,
 * ale přeje dědečkovi — pravidlo by shodilo správný klíč. Místo toho takovou
 * větu odmítne pravidlo o příležitosti, pokud o příležitosti nemluví.
 */
const O_MNE = new RegExp(`${H}(já|jsem|jdeme|mi|mě)${K}`);
/** Přací formule — věta něco přeje, místo aby oznamovala nebo žádala. */
const JE_PRACI = new RegExp(`${H}(ať|přeju|přeji|gratuluji)${K}`);

const bezInterpunkce = (s: string) =>
  s.toLowerCase().replace(/[.,!?;:…„“"'’\-–—()]/g, " ").replace(/\s+/g, " ").trim();

// ── Rozdělení úloh podle tvaru zadání ────────────────────────────────────────
// Rozpoznává se podle textu otázky. Kdyby se zadání přepsalo, přestane některá
// skupina existovat — a přesné počty níž to shodí, místo aby kontrola tiše
// měřila prázdnou množinu.

const L1A = L1.filter((t) => /^V adrese /.test(t.question));
const L1B = L1.filter((t) => /^Který text je /.test(t.question));
const L2A = L2.filter((t) => /^Dopis posílá /.test(t.question));
const L2B = L2.filter((t) => !/^Dopis posílá /.test(t.question));
const L3A = L3.filter((t) => /^Která adresa je napsaná/.test(t.question));
const L3B = L3.filter((t) => /Který text se dá poslat\?$/.test(t.question));
// ⚠️ Kotva nesmí být `^Které blahopřání`: zadání začíná situací („Kamarádka
// Anička má narozeniny. Které blahopřání…"). S tou kotvou matchovala skupina
// nula úloh a **oba** testy L3c prošly nad prázdnou množinou — chytil to až
// přesný počet výš. Přesně proto tam ten počet je.
const L3C = L3.filter((t) => /Které blahopřání opravdu přeje/.test(t.question));

describe("kontrola ma co merit", () => {
  it("kazda skupina uloh existuje a ma ocekavany pocet", () => {
    expect(L1A, "L1 údaje v adrese").toHaveLength(20);
    expect(L1B, "L1 žánr textu").toHaveLength(12);
    expect(L2A, "L2 pořadí řádků").toHaveLength(15);
    expect(L2B, "L2 blahopřání k příležitosti").toHaveLength(6);
    expect(L3A, "L3 úplná adresa").toHaveLength(4);
    expect(L3B, "L3 pohlednice").toHaveLength(4);
    expect(L3C, "L3 přání × oznámení").toHaveLength(4);
    expect(L1A.length + L1B.length).toBe(L1.length);
    expect(L3A.length + L3B.length + L3C.length).toBe(L3.length);
  });

  it("kazda uroven nabidne aspon 12 unikatnich uloh", () => {
    for (const [lvl, t] of [[1, L1], [2, L2], [3, L3]] as const) {
      const klice = new Set(t.map((x) => `${x.question}|${(x.options ?? []).join("/")}`));
      expect(klice.size, `L${lvl} má jen ${klice.size} unikátních úloh`).toBeGreaterThanOrEqual(12);
    }
  });
});

describe("tvar a dokumentace", () => {
  it("vsechny ulohy nesou kompletni dokumentaci", () => {
    for (const t of VSE) {
      expect(t.options, t.question).toHaveLength(4);
      expect(new Set(t.options).size, t.question).toBe(4);
      expect(t.options, t.question).toContain(t.correctAnswer);
      expect(t.hints?.length, t.question).toBeGreaterThanOrEqual(2);
      expect(t.hints?.[0]).not.toBe(t.hints?.[1]);
      expect(t.explanation, t.question).toBeTruthy();
      for (const d of distraktory(t)) {
        expect(t.optionFeedback?.[d], `${t.question} → „${d}"`).toBeTruthy();
      }
    }
  });

  it("zadna napoveda neprozradi klic", () => {
    for (const t of VSE) {
      for (const h of t.hints ?? []) {
        expect(
          bezInterpunkce(h).includes(bezInterpunkce(t.correctAnswer)),
          `„${t.question}" → nápověda cituje klíč`,
        ).toBe(false);
      }
    }
  });

  it("klic neni nejdelsi moznost casteji, nez by vysla nahoda", () => {
    // Měří se **výhradně** délka: jestli strategie „vyber nejdelší" funguje.
    // Shoda délek se proto nepočítá — když je klíč stejně dlouhý jako jiná
    // možnost, tahle strategie odpověď neurčí, takže to vada není.
    let nejdelsi = 0;
    for (const t of VSE) {
      const ostatni = (t.options ?? []).filter((o) => o !== t.correctAnswer);
      if (ostatni.every((o) => t.correctAnswer.length > o.length)) nejdelsi++;
    }
    // Náhoda dá 25 %. Práh je 45 %: u L3 nese úplná odpověď víc informace než
    // neúplná, takže nula to být nemůže — nesmí z toho ale být strategie.
    const podil = nejdelsi / VSE.length;
    expect(podil, `klíč je nejdelší u ${nejdelsi} z ${VSE.length} úloh`).toBeLessThan(0.45);
  });
});

describe("L1a — co je ktery udaj v adrese", () => {
  it("klic odpovida tvaru citovaneho udaje a adresa sama je spravne napsana", () => {
    const NALEPKA: Record<string, string> = {
      jmeno: "jméno toho, komu píšeš",
      ulice: "ulice a číslo domu",
      psc: "směrovací číslo pošty",
      mesto: "jméno města, kam to jde",
    };
    for (const t of L1A) {
      const m = t.question.match(/^V adrese „(.+)“ je část „(.+)“\. Co to je\?$/);
      expect(m, `zadání nemá očekávaný tvar: ${t.question}`).toBeTruthy();
      const [, adresa, datum] = m!;

      // Adresa v zadání musí být sama napsaná správně — kdyby ne, učilo by
      // téma dítě špatný vzor i v úloze, která se na vzor neptá.
      expect(jeUplnaAdresa(adresa), `adresa v zadání je vadná: ${adresa}`).toBe(true);

      // Citovaný údaj se v adrese musí opravdu vyskytovat.
      expect(adresa.includes(datum), `„${datum}" v adrese „${adresa}" není`).toBe(true);

      const ocekavano =
        JE_PSC.test(datum) ? NALEPKA.psc
        : JE_ULICE.test(datum) ? NALEPKA.ulice
        : JE_JMENO.test(datum) ? NALEPKA.jmeno
        : JE_MESTO.test(datum) ? NALEPKA.mesto
        : "nerozpoznáno";
      expect(klic(t), `„${datum}" → špatná nálepka`).toBe(ocekavano);

      // Distraktory musí být právě ty tři zbylé nálepky, ne náhodná slova.
      const zbyle = Object.values(NALEPKA).filter((n) => n !== ocekavano);
      expect(distraktory(t).slice().sort()).toEqual(zbyle.slice().sort());
    }
  });
});

describe("L1b — co je to za text", () => {
  it("klic ma zadany zanr a zadny distraktor ho nema", () => {
    for (const t of L1B) {
      const zanr = t.question.match(/^Který text je (.+)\?$/)![1];
      expect(zanrTextu(klic(t)), `klíč „${klic(t)}"`).toBe(zanr);
      for (const d of distraktory(t)) {
        expect(zanrTextu(d), `distraktor „${d}" je taky ${zanr}`).not.toBe(zanr);
      }
    }
  });

  it("v kazde ulohe jsou zastoupene vsechny ctyri zanry", () => {
    for (const t of L1B) {
      const zanry = new Set((t.options ?? []).map(zanrTextu));
      expect(zanry.size, `„${t.question}" nabízí jen ${zanry.size} žánry`).toBe(4);
    }
  });
});

describe("L2a — co patri na ktery radek obalky", () => {
  it("klic ma tvar spravneho radku a na prvni radek nepatri odesilatel", () => {
    for (const t of L2A) {
      const m = t.question.match(/^Dopis posílá (.+?)\. Který údaj patří (.+)\?$/);
      expect(m, `zadání nemá očekávaný tvar: ${t.question}`).toBeTruthy();
      const [, odesilatel, kam] = m!;
      const o = t.options ?? [];

      // Odesílatel ze zadání musí být mezi možnostmi — jinak úloha vůbec
      // neměří tu chybu, kvůli které tam je.
      expect(o, `odesílatel „${odesilatel}" chybí mezi možnostmi`).toContain(odesilatel);
      expect(klic(t), "klíč je odesílatel").not.toBe(odesilatel);

      if (/nejvýš/.test(kam)) {
        expect(JE_JMENO.test(klic(t)), `nahoru: „${klic(t)}"`).toBe(true);
        // Dvě jména proti sobě — proto nestačí poznat, že nahoru patří člověk.
        expect(o.filter((x) => JE_JMENO.test(x))).toHaveLength(2);
      } else if (/prostřední/.test(kam)) {
        expect(JE_ULICE.test(klic(t)), `doprostřed: „${klic(t)}"`).toBe(true);
      } else {
        expect(JE_RADEK_MESTA.test(klic(t)), `dolů: „${klic(t)}"`).toBe(true);
      }

      // Možnosti pokrývají všechny tři řádky plus odesílatele.
      expect(o.filter((x) => JE_ULICE.test(x))).toHaveLength(1);
      expect(o.filter((x) => JE_RADEK_MESTA.test(x))).toHaveLength(1);
    }
  });
});

describe("L2b — blahoprani k prilezitosti", () => {
  /** Co která situace žádá a komu se vyká — vlastní tabulka, ne pole generátoru. */
  const SITUACE: [RegExp, RegExp, boolean][] = [
    [/Babička má narozeniny/, /narozenin/, false],
    [/Paní učitelka má svátek/, /svátek|svátku/, true],
    [/Kamarád Marek má narozeniny/, /narozenin/, false],
    [/Dědeček je nemocný/, /zdravý|zdraví/, false],
    [/Eliška vyhrála/, /výhře|výhru/, false],
    [/Maminka má svátek/, /svátek|svátku/, false],
  ];

  const pravidla = (veta: string, prilezitost: RegExp, vyka: boolean) => ({
    prilezitost: prilezitost.test(veta),
    osloveni: vyka ? !TYKACI.test(veta) : !VYKACI.test(veta),
    oAdresatovi: !O_MNE.test(veta),
  });

  it("kazda situace je v tabulce a klic projde vsemi tremi pravidly", () => {
    expect(L2B).toHaveLength(SITUACE.length);
    for (const t of L2B) {
      const radek = SITUACE.find(([q]) => q.test(t.question));
      expect(radek, `situace „${t.question}" není v tabulce`).toBeTruthy();
      const [, prilezitost, vyka] = radek!;
      const p = pravidla(klic(t), prilezitost, vyka);
      expect(p.prilezitost, `klíč nemluví o té příležitosti: „${klic(t)}"`).toBe(true);
      expect(p.osloveni, `klíč má špatné oslovení: „${klic(t)}"`).toBe(true);
      expect(p.oAdresatovi, `klíč mluví o mně: „${klic(t)}"`).toBe(true);
    }
  });

  it("kazdy distraktor porusi aspon jedno pravidlo", () => {
    for (const t of L2B) {
      const [, prilezitost, vyka] = SITUACE.find(([q]) => q.test(t.question))!;
      for (const d of distraktory(t)) {
        const p = pravidla(d, prilezitost, vyka);
        expect(
          p.prilezitost && p.osloveni && p.oAdresatovi,
          `distraktor „${d}" neporušuje žádné pravidlo — je taky správně`,
        ).toBe(false);
      }
    }
  });

  it("vsechny ctyri moznosti maji totez osloveni, takze samo nic neprozrazuje", () => {
    // Doložení tvrzení, kvůli kterému se nápověda smí o distraktoru zmínit:
    // začátek věty před čárkou je u všech čtyř možností shodný, takže nenese
    // žádnou informaci o tom, která je správná. `audit:content` na něj přesto
    // hlásil `hint_leak` (dvojslovný začátek klíče v nápovědě) — tenhle test
    // je ten přepočet. Kdyby někdo oslovení u jedné možnosti změnil, začne
    // nést informaci a tohle padne.
    for (const t of L2B) {
      const prefixy = new Set((t.options ?? []).map((o) => o.slice(0, o.indexOf(","))));
      expect(prefixy.size, `„${t.question}" → oslovení se liší: ${[...prefixy].join(" / ")}`).toBe(1);
    }
  });

  it("mezi distraktory jsou zastoupene vsechny tri druhy chyb", () => {
    const porusene = new Set<string>();
    for (const t of L2B) {
      const [, prilezitost, vyka] = SITUACE.find(([q]) => q.test(t.question))!;
      for (const d of distraktory(t)) {
        const p = pravidla(d, prilezitost, vyka);
        if (!p.prilezitost) porusene.add("příležitost");
        if (!p.osloveni) porusene.add("oslovení");
        if (!p.oAdresatovi) porusene.add("mluví o mně");
      }
    }
    expect([...porusene].sort()).toEqual(["mluví o mně", "oslovení", "příležitost"]);
  });
});

describe("L3a — ktera adresa je napsana cela a spravne", () => {
  it("vlastnim validatorem projde jen klic", () => {
    for (const t of L3A) {
      const projdou = (t.options ?? []).filter(jeUplnaAdresa);
      expect(projdou, `„${t.question}" → projde ${projdou.length} možností`).toHaveLength(1);
      expect(projdou[0]).toBe(klic(t));
    }
  });
});

describe("L3b — ktera pohlednice se da poslat", () => {
  /** Tři údaje, které pohlednice musí nést, pro každou situaci vlastní. */
  const PODPIS = new RegExp(`(Tvůj|Tvoje) [${VELKE}][${MALE}]+\\.?$`);
  const POHLED: [RegExp, RegExp, RegExp][] = [
    [/u moře/, /od moře/, /koupeme/],
    [/v horách/, /z hor/, /sáňkách/],
    [/na táboře/, /z tábora/, /pádlovat/],
    [/u dědy/, /z vesnice/, /krmit/],
  ];

  const uplna = (veta: string, misto: RegExp, cinnost: RegExp) =>
    misto.test(veta) && cinnost.test(veta) && PODPIS.test(veta);

  it("vsechny tri udaje nese jen klic", () => {
    expect(L3B).toHaveLength(POHLED.length);
    for (const t of L3B) {
      const radek = POHLED.find(([q]) => q.test(t.question));
      expect(radek, `situace „${t.question}" není v tabulce`).toBeTruthy();
      const [, misto, cinnost] = radek!;
      const projdou = (t.options ?? []).filter((o) => uplna(o, misto, cinnost));
      expect(projdou, `„${t.question}" → projde ${projdou.length} možností`).toHaveLength(1);
      expect(projdou[0]).toBe(klic(t));
    }
  });

  it("kazdemu distraktoru chybi prave jeden ze tri udaju", () => {
    for (const t of L3B) {
      const [, misto, cinnost] = POHLED.find(([q]) => q.test(t.question))!;
      const chybejici = distraktory(t).map((d) =>
        [misto.test(d), cinnost.test(d), PODPIS.test(d)].filter((x) => !x).length,
      );
      expect(chybejici, `distraktory v „${t.question}"`).toEqual([1, 1, 1]);
    }
  });
});

describe("L3c — prani, ne oznameni ani zadost", () => {
  const jePrani = (v: string) => JE_PRACI.test(v) && !O_MNE.test(v) && !v.includes("?");

  it("prani je jen jedno a je to klic", () => {
    for (const t of L3C) {
      const projdou = (t.options ?? []).filter(jePrani);
      expect(projdou, `„${t.question}" → projde ${projdou.length} možností`).toHaveLength(1);
      expect(projdou[0]).toBe(klic(t));
    }
  });

  it("mezi distraktory je veta o mne, zadost i pouhe oznameni", () => {
    for (const t of L3C) {
      const d = distraktory(t);
      expect(d.filter((x) => O_MNE.test(x)).length, `o mně v „${t.question}"`).toBeGreaterThanOrEqual(1);
      expect(d.filter((x) => x.includes("?")).length, `žádost v „${t.question}"`).toBeGreaterThanOrEqual(1);
      expect(
        d.filter((x) => !JE_PRACI.test(x) && !x.includes("?")).length,
        `oznámení v „${t.question}"`,
      ).toBeGreaterThanOrEqual(1);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Obrácená kontrola
// ─────────────────────────────────────────────────────────────────────────────
// Pravidlo, které nikdy nic nezamítne, prochází vždycky a nic neměří. Každé
// z nich tu proto dostane schválně vadný vstup a musí ho odmítnout.

describe("obracena kontrola — pravidla musi umet zamitnout", () => {
  it("tvary udaju v adrese", () => {
    expect(JE_JMENO.test("Eva Horáková")).toBe(true);
    expect(JE_JMENO.test("Horáková")).toBe(false);
    expect(JE_JMENO.test("Krátká 25")).toBe(false);
    expect(JE_ULICE.test("Krátká 25")).toBe(true);
    expect(JE_ULICE.test("Krátká")).toBe(false);
    expect(JE_RADEK_MESTA.test("390 01 Tábor")).toBe(true);
    expect(JE_RADEK_MESTA.test("Tábor 390 01")).toBe(false);
    expect(JE_RADEK_MESTA.test("Tábor")).toBe(false);
  });

  it("validator uplne adresy", () => {
    expect(jeUplnaAdresa("Eva Horáková, Krátká 25, 390 01 Tábor")).toBe(true);
    expect(jeUplnaAdresa("Krátká 25, Eva Horáková, 390 01 Tábor")).toBe(false);
    expect(jeUplnaAdresa("Eva Horáková, Krátká, 390 01 Tábor")).toBe(false);
    expect(jeUplnaAdresa("Eva Horáková, Krátká 25, Tábor")).toBe(false);
    expect(jeUplnaAdresa("Horáková, Krátká 25, 390 01 Tábor")).toBe(false);
  });

  it("klasifikator zanru rozlisi vsechny ctyri", () => {
    expect(zanrTextu("Díky za to, že jsi mi pomohl.")).toBe("poděkování");
    expect(zanrTextu("Zdravíme z hor, je tu plno sněhu.")).toBe("pozdrav z prázdnin");
    expect(zanrTextu("Všechno nejlepší k narozeninám!")).toBe("blahopřání");
    expect(zanrTextu("Volal dědeček, přijede ve čtvrtek.")).toBe("vzkaz");
    // Pozdrav bez místa není pozdrav z prázdnin — jen pozdrav.
    expect(zanrTextu("Zdravíme tě a máme se dobře.")).not.toBe("pozdrav z prázdnin");
  });

  it("tykani a vykani se nechyti uvnitr jineho slova", () => {
    expect(VYKACI.test("přeji vám krásný svátek")).toBe(true);
    expect(TYKACI.test("přeju ti krásný svátek")).toBe(true);
    // „vám" nesmí vyskočit z „Vánoce", „ti" z „tiše", „mě" z „měsíc".
    expect(VYKACI.test("přeju ti veselé Vánoce")).toBe(false);
    expect(TYKACI.test("tiše jsme odešli")).toBe(false);
    expect(O_MNE.test("za měsíc přijede")).toBe(false);
    expect(O_MNE.test("já jsem dostal jedničku")).toBe(true);
  });

  it("prani se odlisi od oznameni a od zadosti", () => {
    const jePrani = (v: string) => JE_PRACI.test(v) && !O_MNE.test(v) && !v.includes("?");
    expect(jePrani("Dědo, ať tě nic nebolí a ať máš z nás pořád radost.")).toBe(true);
    expect(jePrani("Dědo, dneska je tvůj den a je ti sedmdesát let.")).toBe(false);
    expect(jePrani("Dědo, všechno nejlepší, a vezmeš mě pak na zmrzlinu?")).toBe(false);
    expect(jePrani("Dědo, já jsem dneska dostal ve škole dvě jedničky.")).toBe(false);
  });
});
