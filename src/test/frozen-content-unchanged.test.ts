import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  fingerprintTopic,
  UNFROZEN_TOPIC_IDS,
  type TopicFingerprint,
} from "@/lib/contentSnapshot";
import { GRADE_2_TOPICS } from "@/content/grade-2";
import { GRADE_3_TOPICS } from "@/content/grade-3";
import { GRADE_4_TOPICS } from "@/content/grade-4";
import type { TopicMetadata } from "@/lib/types";

/**
 * Audit `frozen_content_unchanged`
 *
 * Zamkne otázku + správnou odpověď u všech aktivních témat 2.–4. ročníku
 * (bez informatiky, bez ID v `UNFROZEN_TOPIC_IDS`). Padne, pokud se jakýkoliv
 * pár (question, correctAnswer) zamčeného tématu změní.
 *
 * **Přegenerování snapshotu** (po ověřené autorské změně):
 *   UPDATE_FROZEN_SNAPSHOT=1 npx vitest run src/test/frozen-content-unchanged.test.ts
 *
 * Distraktory (options), nápovědy, vysvětlení a další forma se **smí**
 * měnit bez blokace — otisk je jen nad `question` + `correctAnswer`.
 */

const SNAPSHOT_PATH = resolve(__dirname, "fixtures/frozen-content.snapshot.json");
const UPDATE_MODE = process.env.UPDATE_FROZEN_SNAPSHOT === "1";

const ALL_TOPICS: TopicMetadata[] = [
  ...GRADE_2_TOPICS,
  ...GRADE_3_TOPICS,
  ...GRADE_4_TOPICS,
].filter((t) => t.subject !== "informatika");

type Snapshot = Record<string, TopicFingerprint>;

function loadSnapshot(): Snapshot {
  if (!existsSync(SNAPSHOT_PATH)) return {};
  return JSON.parse(readFileSync(SNAPSHOT_PATH, "utf-8")) as Snapshot;
}

function writeSnapshot(snap: Snapshot): void {
  const sorted: Snapshot = {};
  for (const key of Object.keys(snap).sort()) sorted[key] = snap[key];
  writeFileSync(SNAPSHOT_PATH, JSON.stringify(sorted, null, 2) + "\n", "utf-8");
}

describe("frozen_content_unchanged", () => {
  if (UPDATE_MODE) {
    it("regeneruje snapshot zamčeného obsahu (UPDATE_FROZEN_SNAPSHOT=1)", () => {
      const snap: Snapshot = {};
      for (const topic of ALL_TOPICS) {
        if (UNFROZEN_TOPIC_IDS.has(topic.id)) continue;
        snap[topic.id] = fingerprintTopic(topic);
      }
      writeSnapshot(snap);
      // eslint-disable-next-line no-console
      console.log(
        `✅ frozen-content.snapshot.json zapsán: ${Object.keys(snap).length} témat`,
      );
      expect(Object.keys(snap).length).toBeGreaterThan(50);
    });
    return;
  }

  it("otázky a klíče zamčených témat se nezměnily", () => {
    const snap = loadSnapshot();
    if (!Object.keys(snap).length) {
      throw new Error(
        "Snapshot je prázdný — nejdřív ho vygeneruj: " +
          "UPDATE_FROZEN_SNAPSHOT=1 npx vitest run src/test/frozen-content-unchanged.test.ts",
      );
    }
    const frozen = ALL_TOPICS.filter((t) => !UNFROZEN_TOPIC_IDS.has(t.id));
    const missing: string[] = [];
    const changed: string[] = [];

    for (const topic of frozen) {
      const cur = fingerprintTopic(topic);
      const exp = snap[topic.id];
      if (!exp) {
        missing.push(`  · ${topic.id}`);
        continue;
      }
      if (exp.hash !== cur.hash || exp.taskCount !== cur.taskCount) {
        changed.push(
          `  · ${topic.id} — hash ${exp.hash.slice(0, 8)} → ${cur.hash.slice(
            0,
            8,
          )} (${exp.taskCount} → ${cur.taskCount} úloh)`,
        );
      }
    }

    if (missing.length || changed.length) {
      const parts: string[] = [];
      if (changed.length) {
        parts.push(
          `Zamčený obsah se změnil (${changed.length}/${frozen.length}):\n${changed.join("\n")}`,
        );
      }
      if (missing.length) {
        parts.push(`Chybí snapshot pro:\n${missing.join("\n")}`);
      }
      parts.push(
        "\nPokud jsou změny záměrné, přidej dotčená ID do UNFROZEN_TOPIC_IDS " +
          "v src/lib/contentSnapshot.ts a/nebo přegeneruj snapshot:\n" +
          "  UPDATE_FROZEN_SNAPSHOT=1 npx vitest run src/test/frozen-content-unchanged.test.ts",
      );
      throw new Error(parts.join("\n\n"));
    }
  });
});
