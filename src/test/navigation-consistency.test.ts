import { describe, it, expect } from "vitest";
import type { TopicMetadata } from "@/lib/types";
import type { SubjectNav } from "@/content/navigation";
import { GRADE_2_TOPICS } from "@/content/grade-2";
import { GRADE_3_TOPICS } from "@/content/grade-3";
import { GRADE_4_TOPICS } from "@/content/grade-4";
import { GRADE_5_TOPICS } from "@/content/grade-5";
import { GRADE2_NAVIGATION } from "@/content/grade-2/navigation";
import { GRADE3_NAVIGATION } from "@/content/grade-3/navigation";
import { GRADE4_NAVIGATION } from "@/content/grade-4/navigation";
import { GRADE5_NAVIGATION } from "@/content/grade-5/navigation";

/**
 * Konzistence display navigace „předmět → okruh → téma" napříč ročníky.
 *
 * Záruky, které test vynucuje:
 *  1. Každé topicId v navigaci odkazuje na existující cvičení daného ročníku.
 *  2. Žádné cvičení není ve dvou okruzích zároveň (žádné duplikáty).
 *  3. Pro každý předmět, který MÁ okruhovou navigaci, je každé jeho cvičení
 *     zařazeno do právě jednoho okruhu (žádní sirotci).
 *  4. ID okruhů jsou v rámci předmětu unikátní.
 *
 * Předměty bez navigace (např. informatika) zůstávají ploché a do kontroly
 * „žádní sirotci" nevstupují — to je v pořádku.
 */

const GRADES: Array<{ grade: number; topics: TopicMetadata[]; nav: SubjectNav[] }> = [
  { grade: 2, topics: GRADE_2_TOPICS, nav: GRADE2_NAVIGATION as SubjectNav[] },
  { grade: 3, topics: GRADE_3_TOPICS, nav: GRADE3_NAVIGATION as SubjectNav[] },
  { grade: 4, topics: GRADE_4_TOPICS, nav: GRADE4_NAVIGATION as SubjectNav[] },
  { grade: 5, topics: GRADE_5_TOPICS, nav: GRADE5_NAVIGATION as SubjectNav[] },
];

describe.each(GRADES)("grade-$grade navigace", ({ topics, nav }) => {
  const idsInGrade = new Set(topics.map((t) => t.id));

  it.each(nav)("předmět '$subject': topicIds existují a nejsou duplicitní", (subjectNav) => {
    const seen = new Set<string>();
    for (const okruh of subjectNav.okruhy) {
      for (const id of okruh.topicIds) {
        expect(idsInGrade.has(id), `neexistující topicId '${id}' v okruhu '${okruh.id}'`).toBe(true);
        expect(seen.has(id), `duplicitní topicId '${id}' (je ve více okruzích)`).toBe(false);
        seen.add(id);
      }
    }
  });

  it.each(nav)("předmět '$subject': každé cvičení je v právě jednom okruhu", (subjectNav) => {
    const covered = new Set(subjectNav.okruhy.flatMap((o) => o.topicIds));
    const subjectTopicIds = topics
      .filter((t) => t.subject === subjectNav.subject)
      .map((t) => t.id);
    const orphans = subjectTopicIds.filter((id) => !covered.has(id));
    expect(orphans, `cvičení mimo okruhy: ${orphans.join(", ")}`).toEqual([]);
  });

  it.each(nav)("předmět '$subject': okruh id jsou unikátní", (subjectNav) => {
    const ids = subjectNav.okruhy.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
