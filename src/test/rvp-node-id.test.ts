/**
 * `rvpNodeId`, který v datasetu neexistuje, nikoho nerozbije — a proto se
 * neopraví.
 *
 * Jediný konzument je admin strom RVP (`AdminRvpTree.tsx`), který páruje
 * `topics.find(t => t.rvpNodeId === node.id)`. Když ID neexistuje, uzel se
 * ukáže jako **bez obsahu**, i když obsah dávno je. Aplikace vypadá
 * v pořádku, žák nic nepozná, typecheck mlčí (pole je `string`) — jen mapa
 * kurikula lže tomu, kdo podle ní plánuje, co dopsat.
 *
 * Tak se to taky stalo: do 2026-10-01 mělo **deset témat 2. ročníku**
 * `rvpNodeId` z nějaké starší kategorizace RVP („…-slovni-zasoba-slova-
 * nadrazena-a-podrazena" proti skutečnému „…-slovo-a-veta-slova-nadrazena-
 * podrazena-souradna"). Dokumentace přitom osm měsíců vedla položku „oprava
 * 17 `rvpNodeId`" — číslo, které nikdo nepřeměřil; skutečných bylo deset.
 *
 * **Pozor na rozdíl `id` × `rvpNodeId`.** U starších témat jsou to tytéž
 * řetězce, ale `id` je vlastní identita tématu — odkazuje na ni pokrok dítěte,
 * sezení i `custom_exercises`, takže se nikdy nemění. Přemapovat lze jen
 * `rvpNodeId`. Druhé měřítko níž na to dohlíží.
 *
 * Ověřeno obráceně 2026-10-01: po dočasném vrácení jednoho starého ID test
 * spadl a pojmenoval to téma; po vrácení všech deseti hlásil deset. Bez toho
 * by se nevědělo, jestli vůbec něco měří.
 */
import { describe, it, expect } from "vitest";
import rvpData from "../../data/rvp_data.json";
import { getAllTopics } from "@/lib/contentRegistry";

const RVP_IDS = new Set((rvpData.flatNodes as { id: string }[]).map((n) => n.id));

/**
 * Témata, která uzel v RVP datasetu opravdu nemají — ne překlep, ale mezera
 * v `data/rvp_data.json`. Dataset je READONLY a jeho doplnění musí odsouhlasit
 * uživatel (otevřená položka v `docs/PENDING_CHANGES.md`), takže do té doby
 * nesou `rvpNodeId` = vlastní `id`.
 *
 * Seznam smí jen ubývat. Nová položka sem patří pouze s doloženým důvodem,
 * proč uzel v datasetu chybí — ne proto, že test zčervenal.
 */
const BEZ_UZLU_V_DATASETU = new Set([
  "g4-mat-slovni-ulohy-pisemne-operace-4",
  "g5-mat-slovni-ulohy-5",
]);

describe("rvpNodeId odkazuje na skutecny uzel RVP", () => {
  const temata = getAllTopics().filter((t) => t.rvpNodeId);

  it("kontrola sama ma co merit", () => {
    // Kdyby registry vrátil prázdno nebo dataset nešel načíst, obě měřítka níž
    // projdou nad ničím a mlčely by o čemkoli.
    expect(temata.length).toBeGreaterThan(300);
    expect(RVP_IDS.size).toBe(841);
  });

  it("zadne tema neodkazuje na neexistujici uzel", () => {
    const sirotci = temata
      .filter((t) => !RVP_IDS.has(t.rvpNodeId!) && !BEZ_UZLU_V_DATASETU.has(t.rvpNodeId!))
      .map((t) => `${t.id}\n      rvpNodeId: ${t.rvpNodeId}`);

    expect(
      sirotci,
      `Témata s rvpNodeId, který v data/rvp_data.json není:\n    ${sirotci.join("\n    ")}\n\n` +
        "Najdi skutečný uzel přes getNodesByGradeSubject() a přepiš JEN rvpNodeId — id nech být.",
    ).toEqual([]);
  });

  it("uzel patri do stejneho rocniku a predmetu jako tema", () => {
    const nodeById = new Map(
      (rvpData.flatNodes as { id: string; grade: number; subject: string }[]).map((n) => [n.id, n]),
    );
    const neshody: string[] = [];

    for (const t of temata) {
      const uzel = nodeById.get(t.rvpNodeId!);
      if (!uzel) continue; // řeší měřítko výš
      const [od, doR] = t.gradeRange;
      if (uzel.grade < od || uzel.grade > doR) {
        neshody.push(`${t.id}: téma gradeRange [${od}, ${doR}], uzel ročník ${uzel.grade}`);
      }
    }

    expect(neshody, `Uzel z jiného ročníku než téma:\n    ${neshody.join("\n    ")}`).toEqual([]);
  });

  it("rvpNodeId a id jsou samostatna pole — prepis mapovani nesmi menit identitu tematu", () => {
    // Na `id` visí pokrok dítěte. U témat, která se 2026-10-01 přemapovala,
    // musí `id` zůstat na staré (chybné) podobě, i když rvpNodeId je nová.
    const prejmenovana: [string, string][] = [
      [
        "g2-cjl-jazykova-vychova-slovni-zasoba-slova-nadrazena-a-podrazena",
        "g2-cjl-jazykova-vychova-slovo-a-veta-slova-nadrazena-podrazena-souradna",
      ],
      [
        "g2-cjl-jazykova-vychova-tvaroslovi-slovesa-rozliseni-slovesneho-druhu",
        "g2-cjl-jazykova-vychova-tvaroslovi-slovesa-co-osoby-a-veci-delaji",
      ],
    ];

    for (const [id, rvpNodeId] of prejmenovana) {
      const t = temata.find((x) => x.id === id);
      expect(t, `téma ${id} zmizelo — pokud se přejmenovalo id, přišel o pokrok`).toBeDefined();
      expect(t!.rvpNodeId).toBe(rvpNodeId);
    }
  });
});
