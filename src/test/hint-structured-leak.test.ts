/**
 * Únik řešení v nápovědě u strukturovaných typů.
 *
 * Proč to nechytí `check-hint-leak.ts`: ten porovnává nápovědu
 * s `correctAnswer`, jenže u `match_pairs`, `categorize`, `drag_order`
 * a `timeline` je `correctAnswer` jen technický marker („match" / „categorize" /
 * „order"). Skutečné řešení leží v `pairs` / `categories` / `items` /
 * `timelineEvents`, takže tudy prošla nápověda, která za svůj pevný konec
 * přilepila souvislost **další** dvojice nebo události — 696 z 1 000 úloh
 * v 17 tématech (nalezeno 2026-09-13). U `chronologie` na L3 se pořadí odvozuje
 * právě ze souvislostí, takže každý takový doplněk byl kus řešení.
 *
 * Měřítka samotná jsou v [`@/lib/hintLeakStructured`](../lib/hintLeakStructured.ts)
 * jako čisté funkce. Tenhle soubor je používá dvakrát:
 *
 *  1. **Na vymyšleném vstupu** — každé měřítko dostane únik, který má chytit,
 *     i čistý protipříklad. Bez toho by „0 nálezů" nad obsahem nic neznamenalo:
 *     `check:hints` hlásil vždy „0 nápověd" i pod vypsanými nálezy, protože se
 *     nezvyšovalo počítadlo. Tahle část je trvalá náhrada za ruční ověření.
 *  2. **Nad celým obsahem** — a každý běh si hlídá, kolik úloh vůbec prošlo
 *     měřítkem, aby se „nic jsem nenašel" nedalo splést s „neměl jsem co měřit".
 *
 * **Kalibrace 2026-09-13** (12 714 úloh, po opravě kořene úniku). Obsah končí
 * u všech tří měřítek přesně o krok pod prahem, takže prahy nejsou vycucané:
 *
 * | měřítko | zkontrolováno | rozdělení nálezů | práh |
 * |---|---:|---|---|
 * | pořadí (`items`) | 563 | 0× 332, 1× 225, **2× 6**, 3+ nikdy | ≥ 3 |
 * | přiřazení (`categories`) | 146 | 0× 141, **1× 5**, 2+ nikdy | > 1 |
 * | dvojice (`pairs`) | 499 | 0× 466, **1× 33**, 2+ nikdy | > 1 |
 *
 * Pozn.: jmenovat položky zadání samo o sobě únik NENÍ — třídění zvířat
 * v 3. ročníku úmyslně vypisuje znak ke každému zvířeti, a přesto nechává
 * dítěti celé rozhodnutí (znak → skupina). První verze tohohle testu na tom
 * spadla a hlásila 1 241 falešných nálezů.
 */
import { describe, it, expect } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";
import type { PracticeTask } from "@/lib/types";
import {
  nejdelsiBehVPoradi,
  prirazeniVeVete,
  dvojiceVeVete,
  PRAH_KOTVY,
} from "@/lib/hintLeakStructured";
import {
  RADY_HLAVNI_MESTA,
  RADY_SOUSEDE_A_EU,
} from "@/content/grade-5/vlastiveda/evropskeStatyAEuSousedniZemeCrPodrobne";

/** Porovnávání textů: sjednotí mezery a uvozovky, diakritiku nechá být. */
const norm = (s: string) =>
  s.toLowerCase().replace(/[„“"']/g, " ").replace(/\s+/g, " ").trim();

/** Pevné závěrečné věty, kterými helpery ukončují jádro velké nápovědy. */
const KONCE = [
  "Zbylé dvojice pak doplň vylučováním.", // parovani
  "Stejně rozhodni i u ostatních položek.", // trideni
  "Ostatní události zařaď před ni, nebo za ni.", // chronologie bez dat
];

/**
 * Obecné strategie, které za závěrečnou větou stát smějí. Drženo zvlášť od
 * `_shared.ts` schválně: kdyby se rejstřík rozšířil o větu, která prozrazuje,
 * test to má nahlásit, ne mlčky převzít.
 */
const POVOLENE_DOPLNKY = [
  "Nejdřív najdi úplně první a úplně poslední událost, zbylé pak zařaď mezi ně.",
  "Ptej se: co se muselo stát dřív, aby mohlo přijít to další?",
  "Když si nejsi jistý nebo jistá, zkus dvě události porovnat mezi sebou a teprve pak je zařaď do celé řady.",
  "Každá položka vlevo má právě jednu dvojici vpravo.",
  "Začni tou dvojicí, kterou znáš nejlíp, a zbytek vylučuj.",
  "U dvojice, kterou si nejsi jistý nebo jistá, se ptej, které slovo z popisu k položce vůbec sedí.",
  "U každé položky se ptej, podle jakého znaku do skupiny patří.",
  "Když si nejsi jistý nebo jistá, začni položkami, které znáš nejlíp.",
  "Znak, podle kterého třídíš, hledej na těle nebo na povrchu — ne v tom, kde se položka vyskytuje.",
  // Tématické rady jednoho tématu, které si velkou nápovědu dorovnává samo
  // (`odlisSadu`). Importované, ne opsané — ať je seznam na jednom místě.
  ...RADY_HLAVNI_MESTA,
  ...RADY_SOUSEDE_A_EU,
];

/** Vzorek na téma × úroveň — generátory losují, takže jeden běh nestačí. */
const OPAKOVANI = Number(process.env.LEAK_REPEATS ?? 3);

/** Projde generátory všech témat a zavolá `kontrola` na každou unikátní úlohu. */
function proKazdouUlohu(
  kontrola: (task: PracticeTask, topicId: string, level: number) => void,
  opakovani = 1,
): void {
  for (const topic of getAllTopics()) {
    if (!topic.generator) continue;
    for (let opak = 0; opak < opakovani; opak++) {
      for (const level of [1, 2, 3]) {
        let tasks: PracticeTask[] = [];
        try {
          tasks = topic.generator(level) ?? [];
        } catch {
          continue; // chybějící úroveň řeší jiné brány
        }
        const videno = new Set<string>();
        for (const task of tasks) {
          const klic = `${task.question}|${task.hints?.[1] ?? ""}`;
          if (videno.has(klic)) continue;
          videno.add(klic);
          kontrola(task, topic.id, level);
        }
      }
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 1. Měřítka na vymyšleném vstupu — ověření, že vůbec měří
// ════════════════════════════════════════════════════════════════════════════

describe("meritka — overeni na vymyslenem vstupu", () => {
  const dvojice = [
    { left: "Francie", right: "Paříž" },
    { left: "Itálie", right: "Řím" },
    { left: "Polsko", right: "Varšava" },
  ];

  it("dvojice: dve spojene v jedne vete jsou nalez", () => {
    const h = "Francie má Paříž a Itálie má Řím, zbytek dopočítej.";
    expect(dvojiceVeVete(h, dvojice)).toHaveLength(2);
  });

  it("dvojice: jedna kotva nalez neni", () => {
    const h = "Začni Francií — její hlavní město je Paříž. Zbylé dvojice doplň vylučováním.";
    expect(dvojiceVeVete(h, dvojice)).toHaveLength(1);
  });

  it("dvojice: vyjmenovat prave strany bez prirazeni neni nalez", () => {
    // Reálný případ ze 4. ročníku: nápověda dá rozlišovací znak obou možností,
    // ale přiřazení nechá na dítěti — a to je právě cíl úlohy.
    const h = "Hlavní města jsou Paříž, Řím a Varšava. Přiřaď je podle toho, co o zemích víš.";
    expect(dvojiceVeVete(h, dvojice)).toEqual([]);
  });

  it("dvojice: skloneny tvar se pozna", () => {
    // Bez kmenů by „v Paříži" u „Paříž" neprošlo a únik by zůstal neviditelný.
    const h = "Ve Francii se jezdí do Paříže. V Itálii do Říma.";
    expect(dvojiceVeVete(h, dvojice)).toHaveLength(2);
  });

  const poradi = ["Pravěk", "Starověk", "Středověk", "Novověk"];

  it("poradi: tri prvky ve spravnem poradi jsou nalez", () => {
    const h = "Nejdřív byl Pravěk, po něm Starověk a pak Středověk.";
    expect(nejdelsiBehVPoradi(h, poradi)).toEqual(["Pravěk", "Starověk", "Středověk"]);
  });

  it("poradi: dva prvky jsou kotva, ne nalez", () => {
    const h = "Rozmysli si, jestli byl Pravěk dřív než Starověk.";
    expect(nejdelsiBehVPoradi(h, poradi)).toHaveLength(2);
  });

  it("poradi: prvky ve spatnem poradi resení nedavaji", () => {
    // Jmenuje tři, ale pozpátku — pořadí z toho nevyčteš.
    const h = "Novověk? Středověk? Starověk? Seřaď je sám.";
    expect(nejdelsiBehVPoradi(h, poradi).length).toBeLessThan(3);
  });

  it("poradi: obecna strategie bez jmen neni nalez", () => {
    const h = "Nejdřív najdi úplně první a úplně poslední událost, zbylé pak zařaď mezi ně.";
    expect(nejdelsiBehVPoradi(h, poradi)).toEqual([]);
  });

  const skupiny = [
    { name: "Savci", items: ["kočka", "netopýr"] },
    { name: "Ptáci", items: ["vlaštovka", "sova"] },
  ];

  it("kategorie: dve prirazeni v jedne vete jsou nalez", () => {
    const h = "Kočka patří mezi savce. Vlaštovka je ptáci, protože má peří.";
    // Druhá věta obsahuje „vlaštovka" i „ptáci", první „kočka" i „savci".
    expect(prirazeniVeVete(h, skupiny)).toHaveLength(2);
  });

  it("kategorie: jedna kotva nalez neni", () => {
    const h = "Kočka patří mezi savce. U ostatních se ptej, podle jakého znaku do skupiny patří.";
    expect(prirazeniVeVete(h, skupiny)).toHaveLength(1);
  });

  it("kategorie: jmenovat polozky bez skupiny neni nalez", () => {
    // Přesně případ třídění zvířat ve 3. ročníku: znak ke každé položce,
    // rozhodnutí na dítěti.
    const h = "Kočka má srst, vlaštovka má peří, netopýr kojí mláďata, sova má zobák.";
    expect(prirazeniVeVete(h, skupiny)).toEqual([]);
  });

  it("kategorie: jmenovat skupiny bez polozek neni nalez", () => {
    const h = "Savci kojí mláďata, ptáci snášejí vejce.";
    expect(prirazeniVeVete(h, skupiny)).toEqual([]);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. Měřítka nad celým obsahem
// ════════════════════════════════════════════════════════════════════════════

describe("ÚNIK V NÁPOVĚDĚ — strukturované typy", () => {
  /**
   * Konstrukční měřítko pro helpery 5. ročníku: velká nápověda je „jádro +
   * pevná závěrečná věta" a `doplnVelkou` za ni dorovnává délku. Co stojí za tou
   * větou, musí být obecná strategie z rejstříku — nic jiného tam vzniknout nemá.
   * Tím se test vyhne hádání, co je a co není únik: ptá se na tvar, který helper
   * garantuje.
   */
  it("za zaverecnou vetou velke napovedy stoji jen obecna strategie", () => {
    const nalezy: string[] = [];
    const podleTematu = new Map<string, number>();
    let zkontrolovano = 0;

    proKazdouUlohu((task, topicId, level) => {
      const h1 = task.hints?.[1] ?? "";
      const konec = KONCE.find((k) => h1.includes(k));
      if (!konec) return;
      zkontrolovano++;

      let zbytek = h1.slice(h1.indexOf(konec) + konec.length).trim();
      for (const s of POVOLENE_DOPLNKY) zbytek = zbytek.split(s).join(" ").trim();
      if (!zbytek) return;

      podleTematu.set(topicId, (podleTematu.get(topicId) ?? 0) + 1);
      if (nalezy.length < 10) {
        nalezy.push(`[${topicId}] L${level}\n     ZA ZÁVĚREM: ${zbytek}\n     CELÁ H1: ${h1}`);
      }
    }, OPAKOVANI);

    // Kdyby se helpery přejmenovaly, test by mlčel — ať je vidět, že měří.
    expect(zkontrolovano, "žádná úloha s pevným koncem — změnily se helpery?").toBeGreaterThan(100);

    const celkem = [...podleTematu.values()].reduce((a, b) => a + b, 0);
    const prehled = [...podleTematu.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id, n]) => `  ${String(n).padStart(4)}×  ${id}`)
      .join("\n");

    expect(
      celkem,
      `Velká nápověda má za závěrečnou větou něco jiného než obecnou strategii ` +
        `(${celkem} úloh, ${podleTematu.size} témat) — pravděpodobně se do doplňků ` +
        `vrátil \`proc\` dalších prvků:\n\n${prehled}\n\nUkázky:\n\n${nalezy.join("\n\n")}`,
    ).toBe(0);
  });

  /**
   * Ručně psané nápovědy u `match_pairs`. Chytilo 2026-09-13 dvě témata
   * 4. ročníku, kde nápověda přiřadila tři rostliny ze čtyř („Brambory se sázejí
   * jako hlízy, tulipány jako cibulky…") a všechny čtyři lovce potravního řetězce.
   */
  it("velka napoveda nejmenuje vic nez jednu pravou stranu dvojice", () => {
    const nalezy: string[] = [];
    let zkontrolovano = 0;

    proKazdouUlohu((task, topicId, level) => {
      if (!task.pairs?.length) return;
      const velka = task.hints?.[1] ?? "";
      if (!norm(velka)) return;
      zkontrolovano++;

      const jinde = `${task.question} ${task.hints?.[0] ?? ""}`;
      const prozrazene = dvojiceVeVete(velka, task.pairs);
      if (prozrazene.length > PRAH_KOTVY) {
        nalezy.push(
          `[${topicId}] L${level} · jmenuje ${prozrazene.length} z ${task.pairs.length} pravých stran: ` +
            `${prozrazene.map((x) => `„${x}"`).join(", ")}\n     H1: ${velka}`,
        );
      }
    });

    expect(zkontrolovano, "žádná úloha s dvojicemi — změnil se tvar dat?").toBeGreaterThan(50);
    expect(
      nalezy.length,
      `Velká nápověda jmenuje víc než jednu pravou stranu, takže zbytek jde ` +
        `dopočítat vylučováním (${nalezy.length} úloh):\n\n${nalezy.slice(0, 10).join("\n\n")}`,
    ).toBe(0);
  });

  /**
   * `drag_order` a `timeline`. Názvy položek dítě vidí (přetahuje je), takže
   * únik není jejich výskyt, ale pořadí. Dvě položky v pořadí jsou kotva —
   * a taky přesně to, kam dnes obsah dosahuje (6 úloh z 563). Tři už dávají
   * dva ze zbývajících rozhodovacích kroků.
   */
  it("velka napoveda nejmenuje tri a vic polozek ve spravnem poradi", () => {
    const nalezy: string[] = [];
    let zkontrolovano = 0;

    proKazdouUlohu((task, topicId, level) => {
      const poradi = task.items ?? task.timelineEvents?.map((e) => e.label);
      if (!poradi?.length) return;
      const velka = task.hints?.[1] ?? "";
      if (!norm(velka)) return;
      zkontrolovano++;

      const beh = nejdelsiBehVPoradi(velka, poradi);
      if (beh.length > PRAH_KOTVY + 1) {
        nalezy.push(
          `[${topicId}] L${level} · ${beh.length} z ${poradi.length} položek ve správném pořadí: ` +
            `${beh.join(" → ")}\n     H1: ${velka}`,
        );
      }
    });

    expect(zkontrolovano, "žádná úloha s pořadím — změnil se tvar dat?").toBeGreaterThan(50);
    expect(
      nalezy.length,
      `Velká nápověda jmenuje tři a víc položek v tom pořadí, v jakém mají být — ` +
        `to už není kotva, to je kus řešení (${nalezy.length} úloh):\n\n` +
        nalezy.slice(0, 10).join("\n\n"),
    ).toBe(0);
  });

  /**
   * `categorize`. Názvy skupin bývají v zadání (jsou to cílové přihrádky), takže
   * je nelze vyloučit jako pravé strany dvojic — měří se spojení položky se
   * skupinou v jedné větě. Jmenovat položky bez skupiny je v pořádku: přesně to
   * dělá třídění zvířat ve 3. ročníku, kde rozhodnutí zůstává na dítěti.
   */
  it("velka napoveda neprozradi vic nez jedno zarazeni do skupiny", () => {
    const nalezy: string[] = [];
    let zkontrolovano = 0;

    proKazdouUlohu((task, topicId, level) => {
      if (!task.categories?.length) return;
      const velka = task.hints?.[1] ?? "";
      if (!norm(velka)) return;
      zkontrolovano++;

      const prozrazena = prirazeniVeVete(velka, task.categories);
      if (prozrazena.length > PRAH_KOTVY) {
        const polozek = task.categories.reduce((n, c) => n + c.items.length, 0);
        nalezy.push(
          `[${topicId}] L${level} · prozrazuje ${prozrazena.length} z ${polozek} zařazení: ` +
            `${prozrazena.join(", ")}\n     H1: ${velka}`,
        );
      }
    });

    expect(zkontrolovano, "žádná úloha s tříděním — změnil se tvar dat?").toBeGreaterThan(30);
    expect(
      nalezy.length,
      `Velká nápověda říká u víc než jedné položky, do které skupiny patří — ` +
        `zbytek pak jde u malé sady dopočítat vylučováním (${nalezy.length} úloh):\n\n` +
        nalezy.slice(0, 10).join("\n\n"),
    ).toBe(0);
  });
});
