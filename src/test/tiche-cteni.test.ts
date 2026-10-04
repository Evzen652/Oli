/**
 * Nezávislá kontrola tématu „Tiché čtení a porozumění obsahu" (2. ročník).
 *
 * Princip Generator→Critic (`docs/CONTENT_AUTHORING.md`): tenhle soubor
 * **nezná** datové struktury z `ticheCteniPorozumeni.ts`. Importuje hotové
 * úlohy a řeší je znovu, z vlastní tabulky a vlastních pravidel.
 *
 * Dvě části, které je dobré nezaměňovat:
 *
 * 1. **Vlastní tabulka klíčů** (`KLICE`) je *druhé autorství*. Přečetl jsem
 *    pět textů a napsal, co z nich na kterou otázku plyne. Kdyby obsah
 *    přiřadil ke klíči jinou možnost, tabulka se s ním rozejde. Že o klíči
 *    rozhoduje opravdu ona, dokazuje obrácený běh (`MUTACE=1`).
 * 2. **Pravidla, která nejsou tabulka.** Ta jsou nezávislá doopravdy:
 *    - pořadí událostí řeší vlastní řešitel přes značky vět v textu;
 *    - tvar odpovědi musí sedět na tázací slovo („Kde?" → předložka a místo),
 *      a to **u všech čtyř možností**, ne jen u klíče — jinak by se klíč
 *      poznal podle tvaru, aniž by dítě četlo;
 *    - žádná možnost nesmí být doslovná věta z textu;
 *    - nadpis nad textem nesmí nést odpověď.
 *
 * ```bash
 * MUTACE=1 npx vitest run src/test/tiche-cteni.test.ts
 * ```
 *
 * `MUTACE=1` prohlásí za klíč distraktor — abecedně prvního, ne „první
 * v poli": generátor možnosti míchá, takže varianta s indexem dávala pokaždé
 * jiný počet padlých testů a nedokazovala nic (viz `vypraveni-osnova.test.ts`).
 * Měřítka správnosti klíče pak musí spadnout; co zůstane zelené, o správnosti
 * klíče nic netvrdí.
 */
import { describe, it, expect } from "vitest";
import type { PracticeTask } from "@/lib/types";
import { TICHE_CTENI_POROZUMENI } from "@/content/grade-2/cjl/ticheCteniPorozumeni";

// ─────────────────────────────────────────────────────────────────────────────
// Hranice slova v češtině
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️ `\b` v JavaScriptu je ASCII. U slov jako „přidala" nebo „pláštěnky" se
// chová jinak, než člověk čeká, a hledání značek by tiše selhalo. Hranice
// proto píšu výčtem znaků, které kolem slova smí stát.

const H = String.raw`(^|[\s„(])`;
const K = String.raw`([\s.,?!"“)]|$)`;
const obsahujeSlovo = (text: string, slovo: string) => new RegExp(`${H}${slovo}${K}`, "i").test(text);

const srovnej = (s: string) =>
  s.toLowerCase().replace(/[.,!?;:…„“"'’\-–—()]/g, " ").replace(/\s+/g, " ").trim();

const naVety = (text: string) => text.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);

// ─────────────────────────────────────────────────────────────────────────────
// Vlastní tabulka — druhé autorství, ne odvození
// ─────────────────────────────────────────────────────────────────────────────

interface Ocekavani {
  /** Nadpis nad textem; podle něj se úloha přiřadí k textu. */
  nadpis: string;
  /** Otázka → odpověď, kterou jsem z textu vyčetl sám. */
  klice: Record<string, string>;
  /**
   * Značka pro každou možnost úlohy na pořadí a číslo věty textu, ke které
   * ta možnost patří. Tohle **není** opis z obsahu — je to moje čtení textu.
   */
  poradiZnacky: Record<string, number>;
}

const KLICE: Ocekavani[] = [
  {
    nadpis: "Cesta do školy",
    klice: {
      "Co si Lenka ráno vzala?": "rukavice",
      "Kde Lenka rukavici našla?": "u plotu",
      "Která ruka Lenku studila?": "levá ruka",
      "Proč měla Lenka ve škole studenou ruku?": "Jednu rukavici cestou ztratila.",
      "Co se stalo jako poslední?": "Lenka rukavici našla.",
      "Co Lenka odpoledne našla?": "ztracenou rukavici",
      "Které tvrzení podle textu platí?": "Lenka přišla do školy s jednou rukavicí.",
      "Co se z textu nedozvíš?": "Jakou barvu rukavice měly.",
      "Jak se Lenka odpoledne nejspíš cítila?": "Ulevilo se jí.",
    },
    poradiZnacky: { oblékla: 2, ztratila: 3, studená: 4, našla: 5 },
  },
  {
    nadpis: "Ptačí budka",
    klice: {
      "Z čeho dědeček budku vyrobil?": "ze dřeva",
      "Kam dědeček budku pověsil?": "na starou jabloň",
      "Odkud Tomáš sýkorky pozoroval?": "z okna",
      "Proč Tomáš sýkorky pozoroval z okna?": "Nesměl je vyrušit.",
      "Co se stalo jako první?": "Dědeček vyrobil budku.",
      "Co dědeček pověsil na jabloň?": "hotovou budku",
      "Které tvrzení podle textu platí?": "V budce bydlely sýkorky.",
      "Co se z textu nedozvíš?": "Kolik sýkorek v budce bylo.",
      "Proč sýkorky Tomáš nerušil?": "Aby z budky neulétly.",
    },
    poradiZnacky: { vyrobil: 1, visela: 2, nastěhovaly: 3, pozoroval: 4 },
  },
  {
    nadpis: "Oběd u babičky",
    klice: {
      "Co babička uvařila?": "bramborovou polévku",
      "Kdy děti jely k babičce?": "v neděli",
      "Kdo si polévku přidal?": "jenom Káťa",
      "Proč si Matěj dal chleba?": "Polévku jíst nechtěl.",
      "Co se stalo jako první?": "Děti jely k babičce.",
      "Místo čeho si dal Matěj chleba?": "místo polévky",
      "Které tvrzení podle textu platí?": "Káti polévka chutnala.",
      "Co se z textu nedozvíš?": "Kolik je babičce let.",
      "Podle čeho poznáš, že Káti polévka chutnala?": "Přidala si dvakrát.",
    },
    poradiZnacky: { jely: 1, uvařila: 2, přidala: 3, chleba: 5 },
  },
  {
    nadpis: "Adamův dárek",
    klice: {
      "Co Adam dostal k narozeninám?": "kolo",
      "Co se Adamovi stalo na kopci?": "spadl mu řetěz",
      "Kdo řetěz opravil?": "tatínek",
      "Proč musel Adam kolo tlačit?": "Spadl mu řetěz.",
      "Co se stalo jako poslední?": "Tatínek řetěz opravil.",
      "Na čem si Adam hned vyjel?": "na novém kole",
      "Které tvrzení podle textu platí?": "Kolo bylo večer zase v pořádku.",
      "Co se z textu nedozvíš?": "Kolik je Adamovi let.",
      "Jak se Adam na kopci nejspíš cítil?": "Mrzelo ho to.",
    },
    poradiZnacky: { dostal: 1, vyjel: 2, spadl: 3, opravil: 5 },
  },
  {
    nadpis: "Školní výlet",
    klice: {
      "Kam třída jela na výlet?": "do lesa",
      "Kdo rozdal pláštěnky?": "paní učitelka",
      "Pod jaký strom se děti schovaly?": "pod velký buk",
      "Proč se děti schovaly pod buk?": "Začalo totiž pršet.",
      "Co se stalo jako první?": "Třída jela do lesa.",
      "Koho text myslí slovem „třída“?": "děti ze třídy",
      "Které tvrzení podle textu platí?": "Pláštěnky dětem úplně nepomohly.",
      "Co se z textu nedozvíš?": "Jak dlouho pršelo.",
      "Co děti doma nejspíš udělaly?": "Převlékly se do suchého.",
    },
    poradiZnacky: { jela: 1, déšť: 2, schovaly: 3, pláštěnky: 4 },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Obrácené ověření
// ─────────────────────────────────────────────────────────────────────────────

const MUTACE = process.env.MUTACE === "1";

/** Abecedně první distraktor — deterministicky, nezávisle na zamíchání. */
const klic = (t: PracticeTask): string =>
  MUTACE ? [...(t.options ?? [])].filter((o) => o !== t.correctAnswer).sort()[0] : t.correctAnswer;

const distraktory = (t: PracticeTask) => (t.options ?? []).filter((o) => o !== klic(t));

// ─────────────────────────────────────────────────────────────────────────────
// Úlohy a skupiny
// ─────────────────────────────────────────────────────────────────────────────

const TEMA = TICHE_CTENI_POROZUMENI[0];
const L1 = TEMA.generator!(1);
const L2 = TEMA.generator!(2);
const L3 = TEMA.generator!(3);
const VSE = [...L1, ...L2, ...L3];

function pasaz(t: PracticeTask): { nadpis: string; vety: string[] } {
  if (!t.visual || t.visual.kind !== "text_passage") throw new Error(`Úloha „${t.question}“ nemá čtený text`);
  return { nadpis: t.visual.title ?? "", vety: t.visual.paragraphs.flatMap(naVety) };
}

function ocekavani(t: PracticeTask): Ocekavani {
  const nadpis = pasaz(t).nadpis;
  const o = KLICE.find((x) => x.nadpis === nadpis);
  if (!o) throw new Error(`Text „${nadpis}“ v mojí tabulce není`);
  return o;
}

const PROC = L2.filter((t) => /^Proč /.test(t.question));
const PORADI = L2.filter((t) => /^Co se stalo jako /.test(t.question));
const ODKAZ = L2.filter((t) => !PROC.includes(t) && !PORADI.includes(t));
const PLATI = L3.filter((t) => t.question === "Které tvrzení podle textu platí?");
const NEDOZVIS = L3.filter((t) => t.question === "Co se z textu nedozvíš?");
const VYVOD = L3.filter((t) => !PLATI.includes(t) && !NEDOZVIS.includes(t));

// ⚠️ Přesné počty nejsou ozdoba: v tématu o osnově měl jeden filtr špatnou
// kotvu, skupina matchovala nula úloh a oba její testy prošly nad prázdnou
// množinou. Odhalil to až tenhle počet.
describe("skupiny úloh mají čekaný počet (jinak by test měřil prázdno)", () => {
  it("počty podle návrhu tématu", () => {
    expect({
      L1: L1.length,
      PROC: PROC.length,
      PORADI: PORADI.length,
      ODKAZ: ODKAZ.length,
      PLATI: PLATI.length,
      NEDOZVIS: NEDOZVIS.length,
      VYVOD: VYVOD.length,
    }).toEqual({ L1: 15, PROC: 5, PORADI: 5, ODKAZ: 5, PLATI: 5, NEDOZVIS: 5, VYVOD: 5 });
  });

  it("každá úroveň má aspoň dvanáct unikátních úloh (CONTENT_AUTHORING)", () => {
    for (const [jmeno, u] of [["L1", L1], ["L2", L2], ["L3", L3]] as const) {
      const unikatni = new Set(u.map((t) => `${pasaz(t).nadpis}|${t.question}`));
      expect(unikatni.size, `${jmeno}`).toBeGreaterThanOrEqual(12);
    }
  });

  it("čte se na pěti různých textech, ne na jednom (rotace textů)", () => {
    const texty = new Set(VSE.map((t) => pasaz(t).nadpis));
    expect(texty.size).toBe(5);
    expect([...texty].sort()).toEqual(KLICE.map((k) => k.nadpis).sort());
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Klíče proti vlastní tabulce
// ─────────────────────────────────────────────────────────────────────────────

describe("klíč se shoduje s tím, co jsem z textu vyčetl sám", () => {
  it("každá otázka je v mojí tabulce a klíč sedí", () => {
    for (const t of VSE) {
      const o = ocekavani(t);
      const cekany = o.klice[t.question];
      expect(cekany, `otázka „${t.question}“ u textu „${o.nadpis}“ v mojí tabulce není`).toBeTruthy();
      expect(klic(t), `„${o.nadpis}“ → „${t.question}“`).toBe(cekany);
    }
  });

  it("moje tabulka nemá řádek navíc — každá otázka v ní se v obsahu opravdu vyskytne", () => {
    for (const o of KLICE) {
      for (const q of Object.keys(o.klice)) {
        const je = VSE.some((t) => t.question === q && pasaz(t).nadpis === o.nadpis);
        expect(je, `„${o.nadpis}“ → „${q}“ je v tabulce, ale v obsahu ne`).toBe(true);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Vlastní řešitel pořadí — tohle není tabulka klíčů, ale pravidlo
// ─────────────────────────────────────────────────────────────────────────────

describe("pořadí událostí řeším sám, podle značek vět", () => {
  /** Ke které větě textu ta možnost patří. */
  function vetaMoznosti(moznost: string, znacky: Record<string, number>): number {
    const nalezene = Object.entries(znacky).filter(([z]) => obsahujeSlovo(moznost, z));
    if (nalezene.length !== 1) {
      throw new Error(`„${moznost}“ odpovídá ${nalezene.length} značkám — řešitel by hádal`);
    }
    return nalezene[0][1];
  }

  it("každá možnost sedne právě na jednu větu textu", () => {
    for (const t of PORADI) {
      const z = ocekavani(t).poradiZnacky;
      for (const m of t.options ?? []) expect(() => vetaMoznosti(m, z)).not.toThrow();
    }
  });

  it("klíčem je možnost z nejranější věty u „jako první“ a z nejpozdější u „jako poslední“", () => {
    for (const t of PORADI) {
      const o = ocekavani(t);
      const indexy = (t.options ?? []).map((m) => [m, vetaMoznosti(m, o.poradiZnacky)] as const);
      const prvni = /jako první/.test(t.question);
      const hledany = prvni
        ? indexy.reduce((a, b) => (b[1] < a[1] ? b : a))
        : indexy.reduce((a, b) => (b[1] > a[1] ? b : a));
      expect(klic(t), `„${o.nadpis}“ → „${t.question}“`).toBe(hledany[0]);
    }
  });

  it("žádné dvě možnosti nepatří ke stejné větě — jinak by byly dvě správně", () => {
    for (const t of PORADI) {
      const z = ocekavani(t).poradiZnacky;
      const indexy = (t.options ?? []).map((m) => vetaMoznosti(m, z));
      expect(new Set(indexy).size, `„${t.question}“ u „${ocekavani(t).nadpis}“`).toBe(indexy.length);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tvar odpovědi musí sedět na tázací slovo — a to u všech možností
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ⚠️ Pravidlo platí pro **všechny čtyři možnosti**, ne jen pro klíč. Kdyby
 * jen klíč odpovídal na „Kde?" předložkovým určením místa a distraktory ne,
 * dítě by správnou možnost poznalo podle tvaru a text by nemuselo číst
 * vůbec. Tohle je ta hranice.
 */
describe("tvar odpovědi odpovídá tázacímu slovu", () => {
  const PREDLOZKY_MISTO = ["v", "ve", "u", "na", "pod", "za", "před", "z", "ze", "do", "k", "ke"];
  /** Slova, která označují člověka, i když nezačínají velkým písmenem. */
  const OSOBY = ["tatínek", "maminka", "babička", "dědeček", "učitelka", "kuchařka", "řidič", "opravář", "děti"];

  const prvniSlovo = (s: string) => s.trim().split(/\s+/)[0].toLowerCase().replace(/[.,!?]$/, "");
  const maVelkePismeno = (s: string) => s.split(/\s+/).some((w) => /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/.test(w));
  const jeOsoba = (s: string) => maVelkePismeno(s) || OSOBY.some((o) => obsahujeSlovo(s, o));

  it("„Kde / Kam / Odkud / Pod jaký“ — každá možnost je předložkové určení místa", () => {
    for (const t of VSE) {
      if (!/^(Kde|Kam|Odkud|Pod jaký)\b/.test(t.question)) continue;
      for (const m of t.options ?? []) {
        expect(PREDLOZKY_MISTO, `„${t.question}“ → možnost „${m}“ nezačíná předložkou`).toContain(prvniSlovo(m));
      }
    }
  });

  it("„Kdy“ — každá možnost je určení času s předložkou", () => {
    for (const t of VSE) {
      if (!/^Kdy\b/.test(t.question)) continue;
      for (const m of t.options ?? []) {
        expect(["v", "ve", "po", "před"], `„${t.question}“ → „${m}“`).toContain(prvniSlovo(m));
      }
    }
  });

  it("„Kdo“ — každá možnost pojmenovává člověka", () => {
    for (const t of VSE) {
      if (!/^Kdo\b/.test(t.question)) continue;
      for (const m of t.options ?? []) {
        expect(jeOsoba(m), `„${t.question}“ → „${m}“ nepojmenovává člověka`).toBe(true);
      }
    }
  });

  it("„Proč“ — každá možnost je celá věta zakončená tečkou", () => {
    for (const t of VSE) {
      if (!/^Proč\b/.test(t.question)) continue;
      for (const m of t.options ?? []) {
        expect(m.endsWith("."), `„${t.question}“ → „${m}“ není celá věta`).toBe(true);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Co dělá z úlohy čtení s porozuměním, a ne hledání shody
// ─────────────────────────────────────────────────────────────────────────────

describe("úloha měří porozumění, ne hledání shodného řádku", () => {
  /**
   * Text odpověď nese — to je jeho smysl. Pravidlo „obrázek nenese odpověď"
   * se proto obrací: hlídá se, aby žádná možnost nebyla doslovná věta z textu.
   * Jinak by dítě očima našlo stejně vypadající řádek a nemuselo rozumět.
   */
  it("žádná možnost není doslovná věta z textu", () => {
    for (const t of VSE) {
      const vety = new Set(pasaz(t).vety.map(srovnej));
      for (const m of t.options ?? []) {
        expect(vety.has(srovnej(m)), `„${t.question}“ → „${m}“ je věta z textu`).toBe(false);
      }
    }
  });

  it("nadpis nad textem nenese odpověď — čte se dřív než otázka", () => {
    for (const t of VSE) {
      const { nadpis } = pasaz(t);
      expect(srovnej(nadpis).includes(srovnej(t.correctAnswer)), `nadpis „${nadpis}“ nese klíč`).toBe(false);
    }
  });

  it("text má pět vět — tolik druhák potichu udrží v hlavě", () => {
    for (const t of VSE) expect(pasaz(t).vety, `text „${pasaz(t).nadpis}“`).toHaveLength(5);
  });

  /**
   * Zpětná vazba u spousty distraktorů tvrdí „… se v textu nikde nepíše".
   * To je slib dítěti, a dá se ověřit: kdyby ta věc v textu byla, zpětná
   * vazba by lhala a dítě by právem nevěřilo ani zbytku.
   *
   * ⚠️ Dvakrát jsem na tomhle pravidle udělal chybu a oba nálezy byly moje,
   * ne obsahu:
   * - Porovnával jsem **poslední slovo možnosti**, jenže u „houbovou
   *   polévku" je to „polévku" — a ta v textu samozřejmě je, i když zpětná
   *   vazba mluví o houbách. Správné slovo je to, o kterém mluví **vazba**,
   *   a ta má vždycky tvar „<Slovo> se v textu nikde nepíše."
   * - Shodu jsem pak hledal podmínkou „jedno slovo je začátkem druhého".
   *   Jenže čeština koncovku **vyměňuje**, ne jen přidává: „škola" × „školy"
   *   takhle neprojde ani jedním směrem. Ověřil jsem si to obráceně —
   *   podstrčil jsem do obsahu lživou vazbu „Škola se v textu nikde
   *   nepíše." a test **prošel**. Teprve pak jsem pravidlo přepsal na
   *   společný začátek délky aspoň čtyř znaků s podobnou délkou slov.
   *
   * Na derivaci (odvozené slovo, ne tvar téhož) i tohle pravidlo krátké je:
   * „opravář" a „opravil" mají společných pět znaků a stejnou délku. Je to
   * jediný takový pár v tématu, takže ho nesu jmenovitě — výjimka, kterou je
   * vidět, je lepší než pravidlo, které kvůli ní nehlídá nic.
   */
  it("zpětná vazba nelže, když tvrdí, že se něco v textu nepíše", () => {
    /** Odvozená slova, ne tvary téhož — shodný začátek je tu náhoda. */
    const RUZNA_SLOVA = new Set(["opravář|opravil"]);

    const spolecnyZacatek = (a: string, b: string) => {
      let i = 0;
      while (i < a.length && i < b.length && a[i] === b[i]) i++;
      return i;
    };
    const ohnutyTvar = (a: string, b: string) =>
      !RUZNA_SLOVA.has(`${b}|${a}`) &&
      !RUZNA_SLOVA.has(`${a}|${b}`) &&
      spolecnyZacatek(a, b) >= 4 &&
      Math.abs(a.length - b.length) <= 3;

    for (const t of VSE) {
      const slovaTextu = pasaz(t)
        .vety.join(" ")
        .split(/\s+/)
        .map((w) => w.toLowerCase().replace(/[.,!?„“]/g, ""));
      for (const [moznost, vazba] of Object.entries(t.optionFeedback ?? {})) {
        if (!/nikde nepíše|nikde nepíšou/.test(vazba)) continue;
        const tvrzene = vazba.split(/\s+/)[0].toLowerCase();
        if (tvrzene.length < 4) continue;
        const nalezeno = slovaTextu.find((w) => ohnutyTvar(w, tvrzene));
        expect(
          nalezeno,
          `„${moznost}“ má vazbu „${vazba}“, jenže text „${pasaz(t).nadpis}“ nese „${nalezeno}“`,
        ).toBeUndefined();
      }
    }
  });

  it("u otázky „co se z textu nedozvíš“ klíč opravdu v textu není", () => {
    for (const t of NEDOZVIS) {
      // Klíč je vždy otázka na údaj, který text neuvádí (věk, barva, počet,
      // doba). Ověřuju to zhruba, ale nezávisle: podstatné slovo klíče se
      // v textu nesmí vyskytnout, zatímco u distraktorů se vyskytnout musí.
      const text = pasaz(t).vety.join(" ");
      const UDAJE = ["barvu", "kolik", "dlouho"];
      expect(UDAJE.some((u) => obsahujeSlovo(klic(t), u)), `klíč „${klic(t)}“ se neptá na chybějící údaj`).toBe(true);
      for (const u of UDAJE) {
        expect(obsahujeSlovo(text, u), `text „${pasaz(t).nadpis}“ ten údaj přece jen uvádí`).toBe(false);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Strukturní kontroly
// ─────────────────────────────────────────────────────────────────────────────
// Berou `t.correctAnswer` přímo, ne přes `klic()`: o správnosti klíče nic
// netvrdí, takže pod `MUTACE=1` mají zůstat zelené.

describe("struktura každé úlohy", () => {
  it("čtyři různé možnosti a klíč mezi nimi", () => {
    for (const t of VSE) {
      expect(t.options, `„${t.question}“`).toHaveLength(4);
      expect(new Set(t.options).size, `„${t.question}“`).toBe(4);
      expect(t.options).toContain(t.correctAnswer);
    }
  });

  it("každý distraktor má zpětnou vazbu a klíč žádnou", () => {
    for (const t of VSE) {
      for (const m of t.options ?? []) {
        if (m === t.correctAnswer) expect(t.optionFeedback?.[m], `„${t.question}“`).toBeUndefined();
        else expect(t.optionFeedback?.[m], `„${t.question}“ → „${m}“`).toBeTruthy();
      }
    }
  });

  it("dvě různé nápovědy, velká aspoň o pětinu delší (audit hint_progression)", () => {
    for (const t of VSE) {
      expect(t.hints, `„${t.question}“`).toHaveLength(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      expect(t.hints![1].length, `„${t.question}“`).toBeGreaterThanOrEqual(t.hints![0].length * 1.2);
    }
  });

  it("žádné dvě úlohy nesdílejí nápovědu — každá navádí ke své otázce", () => {
    const vsechny = VSE.flatMap((t) => t.hints ?? []);
    expect(new Set(vsechny).size, `${vsechny.length} nápověd, z toho unikátních ${new Set(vsechny).size}`).toBe(
      vsechny.length,
    );
  });

  it("žádná nápověda neprozrazuje klíč ani bez interpunkce", () => {
    for (const t of VSE) {
      for (const h of t.hints ?? []) {
        expect(srovnej(h).includes(srovnej(t.correctAnswer)), `„${t.question}“: nápověda nese klíč`).toBe(false);
      }
    }
  });

  it("vysvětlení má každá úloha", () => {
    for (const t of VSE) expect(t.explanation, `„${t.question}“`).toBeTruthy();
  });

  it("zadání se vejde do dvanácti slov (audit sentence_complexity pro 2. ročník)", () => {
    for (const t of VSE) {
      expect(t.question.trim().split(/\s+/).length, `„${t.question}“`).toBeLessThanOrEqual(12);
    }
  });

  it("možnosti se neliší délkou tak, aby se dalo hádat podle ní", () => {
    for (const t of VSE) {
      const d = (t.options ?? []).map((m) => m.length);
      const min = Math.min(...d), max = Math.max(...d);
      expect(max / min, `„${t.question}“: ${min}–${max} znaků`).toBeLessThanOrEqual(1.6);
    }
  });

  it("klíč je striktně nejdelší možnost nejvýš u pětiny úloh", () => {
    let nejdelsi = 0;
    for (const t of VSE) {
      const ostatni = (t.options ?? []).filter((o) => o !== t.correctAnswer);
      if (ostatni.every((o) => t.correctAnswer.length > o.length)) nejdelsi++;
    }
    expect(nejdelsi / VSE.length, `klíč je nejdelší u ${nejdelsi} z ${VSE.length} úloh`).toBeLessThan(0.3);
  });

  it("v textech není dvojí mezera ani mezera před interpunkcí", () => {
    for (const t of VSE) {
      const texty = [t.question, ...(t.options ?? []), ...(t.hints ?? []), t.explanation ?? "", ...pasaz(t).vety];
      for (const s of texty) {
        expect(/ {2}/.test(s), `„${s}“ má dvojí mezeru`).toBe(false);
        expect(/\s[.,!?]/.test(s), `„${s}“ má mezeru před interpunkcí`).toBe(false);
      }
    }
  });
});

describe("metadata tématu", () => {
  it("míří na existující uzel RVP a `id` se rovná `rvpNodeId`", () => {
    expect(TEMA.id).toBe("g2-cjl-komunikacni-a-slohova-vychova-cteni-s-porozumenim-tiche-cteni-a-porozumeni-obsahu");
    expect(TEMA.rvpNodeId).toBe(TEMA.id);
  });

  it("čtení není volný text — žádný essay", () => {
    expect(TEMA.inputType).toBe("select_one");
  });

  it("hranice tématu říkají, že se čte potichu a co patří jinam", () => {
    const h = TEMA.boundaries.join(" ");
    expect(h).toMatch(/potichu/);
    expect(h).toMatch(/Vyznej se v textu/);
  });

  it("úrovně nevracejí totéž (kontrakt obtížnosti)", () => {
    expect(new Set([L1[0].question, L2[0].question, L3[0].question]).size).toBeGreaterThan(1);
    const otazky = (u: PracticeTask[]) => new Set(u.map((t) => t.question));
    expect([...otazky(L1)].some((q) => otazky(L3).has(q))).toBe(false);
  });
});
