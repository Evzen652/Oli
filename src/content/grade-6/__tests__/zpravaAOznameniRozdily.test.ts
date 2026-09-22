import { describe, it, expect } from "vitest";
import { ZPRAVA_A_OZNAMENI_ROZDILY } from "../cjl/zpravaAOznameniRozdily";
import type { PracticeTask } from "@/lib/types";

/**
 * Zpráva a oznámení, rozdíly — čeština 6. ročník (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, nečte parametry generátoru):
 *  1. Žánr ukázky (L1a): klasifikátor podle uzavřeného seznamu slovesných
 *     signálů — minulý čas (proběhl, konal se, vybrali, minulý…) vs. budoucí
 *     čas / výzva (koná se, bude, přijďte, sraz…). Testuje se i na L3b (obě
 *     věty smíšeného textu) a L3c (situace — má stejné časové signály).
 *  2. L2a chybějící údaj: nezávislá tabulka věta → očekávaný chybějící údaj,
 *     napsaná ručně čtením textu (ne převzatá z `detail` pole generátoru).
 *  3. L3a převod: nezávislá tabulka datum/místo pro každou položku; klíč musí
 *     obsahovat stejné datum i místo jako oznámení a sloveso z minulého
 *     seznamu, každý distraktor musí porušit aspoň jednu podmínku.
 */
const topic = ZPRAVA_A_OZNAMENI_ROZDILY[0];

// ── 1. Klasifikátor času děje (minulý × budoucí) ────────────────────────────

const PAST_MARKERS = [
  "proběhl", "proběhla", "proběhlo", "vybrali", "jeli", "jela", "jelo", "užili", "stihli",
  "konal", "konala", "konalo", "zvítězil", "zvítězila", "skončil", "skončila", "sešel", "sešla",
  "vyrobily", "přivítala", "byly", "byla", "byl", "bylo", "navštívili", "sklidili", "přihlásilo",
  "ocenila", "tekla", "vydařil", "minulý", "minulou", "minulé", "odevzdala", "včera", "vrátili",
  "vrátila", "uskutečnil", "uskutečnila", "uskutečnilo", "probíhal", "probíhala",
  "loňský", "loňská", "loňské", "loňskou", "vynesl", "vyhrála",
];
const FUTURE_MARKERS = [
  "koná", "pojede", "uskuteční", "otevře", "příští", "příštího", "bude", "přijďte",
  "vyzvedněte", "proběhne", "zásobte", "přineste", "sraz",
];

// JS \b nerozumí českým znakům s diakritikou (nejsou \w) — hranici slova proto
// hlídáme vlastním lookaroundem přes \p{L}\p{N}, ne přes \b.
function pocetShod(text: string, seznam: string[]): number {
  return seznam.filter((slovo) => new RegExp(`(?<![\\p{L}\\p{N}_])${slovo}(?![\\p{L}\\p{N}_])`, "iu").test(text)).length;
}

/** Vrátí "zpráva" (minulý čas převažuje), "oznámení" (budoucí převažuje), nebo null (nejednoznačné). */
function klasifikujCas(text: string): "zpráva" | "oznámení" | null {
  const p = pocetShod(text, PAST_MARKERS);
  const f = pocetShod(text, FUTURE_MARKERS);
  if (p > 0 && f === 0) return "zpráva";
  if (f > 0 && p === 0) return "oznámení";
  return null;
}

describe("Zpráva a oznámení — metadata", () => {
  it("čeština g6, select_one, Komunikační a slohová výchova / Slohová výchova", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-zprava-a-oznameni-rozdily-6");
    expect(topic.category).toBe("Komunikační a slohová výchova");
    expect(topic.topic).toBe("Slohová výchova");
  });
});

// Nezávislé signály pro vypravování (1. osoba + prožitek/napětí) a inzerát
// (nabídka/poptávka) — uzavřený seznam, nečte pole `zanr` generátoru.
const INZERAT_MARKERS = ["prodám", "koupím", "vyměním", "nabízím", "hledám"];
const VYPRAVOVANI_MARKERS = [
  "jsem", "jsme", "mi", "srdce", "najednou", "těšil", "třásla", "zašeptal", "bušilo", "opatrně",
];

function klasifikujUtvar(text: string): "zpráva" | "oznámení" | "vypravování" | "inzerát" | null {
  if (pocetShod(text, INZERAT_MARKERS) > 0) return "inzerát";
  if (pocetShod(text, VYPRAVOVANI_MARKERS) >= 2) return "vypravování";
  return klasifikujCas(text);
}

describe("NEZÁVISLÝ SOLVER 1: bance L1 ukázek nemá žádná remízu", () => {
  it("každá ukázka v bance má jednoznačné skóre podle klasifikátoru", () => {
    // Načteme skutečné vygenerované L1 úlohy s otázkou ve formátu ukázky.
    const l1 = topic.generator(1);
    const ukazky = l1.filter((t) => t.question.startsWith("Jaký útvar tahle ukázka představuje?"));
    expect(ukazky.length).toBeGreaterThan(0);
    for (const t of ukazky) {
      const vysledek = klasifikujUtvar(t.question);
      expect(vysledek, `nejednoznačné nebo chybějící skóre: ${t.question}`).not.toBeNull();
      expect(vysledek, `klasifikátor nesouhlasí s klíčem: ${t.question}`).toBe(t.correctAnswer);
    }
  });

  it("věcné ukázky (zpráva/oznámení) jednoznačně rozliší i samotný klasifikátor času", () => {
    const l1 = topic.generator(1);
    const ukazky = l1.filter(
      (t) => t.question.startsWith("Jaký útvar tahle ukázka představuje?") && (t.correctAnswer === "zpráva" || t.correctAnswer === "oznámení"),
    );
    for (const t of ukazky) {
      const vysledek = klasifikujCas(t.question);
      expect(vysledek, `nejednoznačné nebo chybějící skóre: ${t.question}`).not.toBeNull();
      expect(vysledek, `klasifikátor nesouhlasí s klíčem: ${t.question}`).toBe(t.correctAnswer);
    }
  });
});

describe.each([1, 2, 3])("Zpráva a oznámení — úlohy level %i", (level) => {
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
        expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
      }
    }
  });

  it("správná odpověď se nevyskytuje ve znění otázky", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), `correctAnswer v otázce: ${t.question}`).toBe(false);
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
});

describe("Zpráva a oznámení — L1 a L3 jsou textově disjunktní", () => {
  it("L1 a L3 otázky se nepřekrývají", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje v L1: ${q}`).toBe(false);
  });
});

describe("Zpráva a oznámení — L1 banka: ≥6 zpráv a ≥6 oznámení", () => {
  it("bance genre-ukázek (L1a) má aspoň 6 zpráv a 6 oznámení", () => {
    const l1 = topic.generator(1);
    const ukazky = l1.filter((t) => t.question.startsWith("Jaký útvar tahle ukázka představuje?"));
    const zpravy = ukazky.filter((t) => t.correctAnswer === "zpráva").length;
    const oznameni = ukazky.filter((t) => t.correctAnswer === "oznámení").length;
    expect(zpravy).toBeGreaterThanOrEqual(6);
    expect(oznameni).toBeGreaterThanOrEqual(6);
    expect(ukazky.filter((t) => t.correctAnswer === "vypravování").length).toBeGreaterThanOrEqual(3);
    expect(ukazky.filter((t) => t.correctAnswer === "inzerát").length).toBeGreaterThanOrEqual(3);
  });

  it("klíč se v prvních šesti úlohách L1 střídá (aspoň 3 různé odpovědi)", () => {
    const prvni = topic.generator(1).slice(0, 6).map((t) => t.correctAnswer);
    expect(new Set(prvni).size).toBeGreaterThanOrEqual(3);
  });
});

// ── 2. NEZÁVISLÝ SOLVER: L2a chybějící údaj (nezávislá tabulka) ─────────────

// Napsáno ručně čtením zadání — nepoužívá `detail` pole z generátoru.
const L2A_CHYBI: Record<string, "kdy" | "kde" | "kdo" | "co"> = {
  "V tělocvičně se koná turnaj ve florbale mezi šestými třídami. Pořádá ho školní sportovní kroužek.": "kdy",
  "Ve čtvrtek 8. října se koná sběr starého papíru. Balíky svažte a přineste. Pořádá školní parlament.": "kde",
  "V pátek 16. října v 7:30 je sraz na výlet na zámek Kost před hlavní budovou školy.": "kdo",
  "Přijďte v sobotu 14. listopadu od 9 hodin na školní hřiště. Zve rodičovské sdružení.": "co",
  "Nový kroužek deskových her se otevírá v učebně dějepisu. Přihlásit se můžete u pana učitele Krále.": "kdy",
  "V pondělí 5. října od 14 hodin bude beseda se spisovatelem. Pořádá ji paní knihovnice.": "kde",
  "Ve čtvrtek 12. listopadu v 9 hodin se v kulturním domě hraje představení Pyšná princezna.": "kdo",
  "Přijďte od 1. do 5. října do sborovny. Přihlášky vydává paní učitelka Nováková.": "co",
  "Ve středu 21. října od 13 hodin proběhne školní recitační soutěž. Pořádá ji paní učitelka Malá.": "kde",
  "V úterý 3. listopadu od 7 do 8 hodin před školou proběhne sběr starého papíru.": "kdo",
  "V sobotu 7. listopadu v 8 hodin ráno je sraz na vlakovém nádraží. Pořádá turistický kroužek.": "co",
  "V hudebně se schází nový pěvecký sbor. Vede ho paní učitelka Dvořáková.": "kdy",
  "V pátek 11. prosince od 15 hodin se koná vánoční jarmark. Pořádá ho žákovský parlament.": "kde",
};
const L2A_LABEL: Record<"kdy" | "kde" | "kdo" | "co", string> = {
  kdy: "kdy se akce koná",
  kde: "kde se akce koná",
  kdo: "kdo akci pořádá",
  co: "co se vlastně koná",
};

describe("NEZÁVISLÝ SOLVER 2: L2a chybějící údaj sedí s ručně napsanou tabulkou", () => {
  it("klíč generátoru odpovídá nezávisle napsané tabulce pro všech 13 položek", () => {
    const l2 = topic.generator(2);
    const l2aUlohy = l2.filter((t) => t.question.startsWith("V oznámení chybí jeden důležitý údaj."));
    let overeno = 0;
    for (const t of l2aUlohy) {
      const m = t.question.match(/„(.+)“ Který údaj v oznámení chybí/u);
      expect(m, `nerozpoznaný formát L2a: ${t.question}`).not.toBeNull();
      const text = m![1];
      const ocekavano = L2A_CHYBI[text];
      expect(ocekavano, `text ukázky není v nezávislé tabulce: ${text}`).toBeDefined();
      expect(t.correctAnswer, `L2a klíč nesedí pro: ${text}`).toBe(L2A_LABEL[ocekavano]);
      overeno++;
    }
    expect(overeno).toBe(13);
  });
});

// ── 3. NEZÁVISLÝ SOLVER: L3a převod (datum + místo + minulé sloveso) ────────

interface L3aOcekavani {
  datum: string;
  misto: string;
}
const L3A_TABULKA: Record<string, L3aOcekavani> = {
  "turnaj ve vybíjené": { datum: "10. října", misto: "tělocvičně" },
  "výlet na zámek": { datum: "16. října", misto: "zámek" },
  "sběr papíru": { datum: "8. října", misto: "školou" },
  "divadelní představení": { datum: "16. listopadu", misto: "kulturním domě" },
  "recitační soutěž": { datum: "21. října", misto: "aule" },
  "školní jarmark": { datum: "5. prosince", misto: "hřišti" },
  "zápis do kroužků": { datum: "5. října", misto: "sborovně" },
  "přerušení vody": { datum: "9. října", misto: "obci" },
};

function jePlatnaZpravaVeta(veta: string, oc: L3aOcekavani): boolean {
  return veta.includes(oc.datum) && veta.includes(oc.misto) && pocetShod(veta, PAST_MARKERS) > 0;
}

describe("NEZÁVISLÝ SOLVER 3: L3a převod — datum, místo a minulý čas", () => {
  it("klíč má stejné datum a místo jako oznámení a sloveso v minulém čase; distraktory porušují aspoň jednu podmínku", () => {
    const l3 = topic.generator(3);
    const prevody = l3.filter((t) => t.question.startsWith("Akce z oznámení „"));
    expect(prevody.length).toBe(8);
    let overeno = 0;
    for (const t of prevody) {
      const tema = Object.keys(L3A_TABULKA).find((k) => t.hints?.some((h) => h.includes(`„${k}“`)));
      expect(tema, `téma nenalezeno v nápovědě: ${t.question}`).toBeDefined();
      const oc = L3A_TABULKA[tema!];
      expect(jePlatnaZpravaVeta(t.correctAnswer, oc), `klíč neplní podmínky: ${t.correctAnswer}`).toBe(true);
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(jePlatnaZpravaVeta(d, oc), `distraktor by neměl splňovat všechny podmínky: ${d}`).toBe(false);
      }
      overeno++;
    }
    expect(overeno).toBe(8);
  });
});

// ── 4. NEZÁVISLÝ SOLVER: L3b smíšený text — klasifikátor na obou větách ─────

// Nezávisle přepsané dvojice vět (zpráva × oznámení) podle tématu, čtené ze
// zadání, ne z pole `SMISENE` generátoru — sestavení konkatenovaného textu je
// nespolehlivé rozdělit regexem zpátky na věty (datum typu „14.“ vypadá jako
// konec věty), proto se místo dělení textu ověřuje přímo přítomnost obou
// přesných vět a jejich klasifikace.
const SMISENE_PARY: Record<string, { zprava: string; oznameni: string }> = {
  "sběr papíru": { zprava: "Minulý týden jsme vybrali přes 300 kilogramů papíru.", oznameni: "Další sběr proběhne 14. listopadu." },
  "školní jarmark": { oznameni: "V sobotu 5. prosince se koná vánoční jarmark.", zprava: "Loňský jarmark vynesl přes deset tisíc korun." },
  "turnaj ve vybíjené": { zprava: "V úterý se konal turnaj ve vybíjené a zvítězila 6. B.", oznameni: "Příští turnaj proběhne v listopadu." },
  "školní výlet": { oznameni: "Příští pátek pojede 6. A na výlet na zámek Kost.", zprava: "Minulý výlet do zoo absolvovalo 45 žáků." },
  "školní knihovna": { zprava: "Školní knihovna minulý měsíc přivítala pět set nových čtenářů.", oznameni: "Od příštího týdne bude otevřená i ve středu." },
  "kroužek deskových her": { oznameni: "Nový kroužek deskových her se otevře od pondělí.", zprava: "Loňský kroužek navštěvovalo přes dvacet dětí." },
  "divadelní představení": { zprava: "Šesťáci navštívili minulý týden divadelní představení.", oznameni: "Další představení pro sedmé třídy proběhne v prosinci." },
  "recitační soutěž": { oznameni: "Školní recitační soutěž se bude konat příští středu.", zprava: "Loňskou soutěž vyhrála Tereza Nováková." },
};

describe("NEZÁVISLÝ SOLVER 4: L3b smíšený text — přiřazení sedí s klasifikátorem", () => {
  it("obě věty smíšeného textu se klasifikují opačně a klíč odpovídá jejich pořadí v otázce", () => {
    const l3 = topic.generator(3);
    const smisene = l3.filter((t) => t.question.startsWith("Přečti si text o tématu"));
    expect(smisene.length).toBe(8);
    let overeno = 0;
    for (const t of smisene) {
      const temaM = t.question.match(/^Přečti si text o tématu „(.+?)“:/u);
      expect(temaM, `téma nerozpoznáno: ${t.question}`).not.toBeNull();
      const par = SMISENE_PARY[temaM![1]];
      expect(par, `téma není v nezávislé tabulce: ${temaM![1]}`).toBeDefined();

      // Klasifikátor nezávisle potvrzuje, že jedna věta je zpráva a druhá oznámení.
      expect(klasifikujCas(par.zprava), `věta by měla vyjít jako zpráva: ${par.zprava}`).toBe("zpráva");
      expect(klasifikujCas(par.oznameni), `věta by měla vyjít jako oznámení: ${par.oznameni}`).toBe("oznámení");

      // Pořadí v otázce určuje očekávaný klíč.
      const zpravaFirst = t.question.includes(`„${par.zprava} ${par.oznameni}“`);
      const oznameniFirst = t.question.includes(`„${par.oznameni} ${par.zprava}“`);
      expect(zpravaFirst || oznameniFirst, `ani jedno pořadí vět nesedí v otázce: ${t.question}`).toBe(true);
      const ocekavano = zpravaFirst ? "První věta je zpráva, druhá oznámení." : "První věta je oznámení, druhá zpráva.";
      expect(t.correctAnswer, t.question).toBe(ocekavano);
      overeno++;
    }
    expect(overeno).toBe(8);
  });
});

// ── 5. NEZÁVISLÝ SOLVER: L3c situace — prefix útvaru sedí s klasifikátorem ──

describe("NEZÁVISLÝ SOLVER 5: L3c situace — útvar odpovídá klasifikátoru situace", () => {
  it("situace se jednoznačně klasifikuje a klíč začíná odpovídajícím útvarem", () => {
    const l3 = topic.generator(3);
    const situace = l3.filter((t) => t.question.endsWith("Jaký útvar zvolí a proč?"));
    expect(situace.length).toBe(8);
    for (const t of situace) {
      const popis = t.question.replace(/ Jaký útvar zvolí a proč\?$/u, "");
      const vysledek = klasifikujCas(popis);
      expect(vysledek, `situace nejednoznačná: ${popis}`).not.toBeNull();
      const ocekavanyPrefix = vysledek === "zpráva" ? "Zprávu," : "Oznámení,";
      expect(t.correctAnswer.startsWith(ocekavanyPrefix), `${t.correctAnswer} nezačíná „${ocekavanyPrefix}“`).toBe(true);
    }
  });
});
