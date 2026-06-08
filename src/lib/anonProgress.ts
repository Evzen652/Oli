/**
 * Anonymní mód: ukládání pokroku v denních úkolech do localStorage.
 * Při změně dne nebo ročníku se vygenerují nové úkoly.
 */

import { getDailyTasksForGrade, getTodayDateString } from "./anonDailyTasks";

const STORAGE_KEY = "oli_anon_progress";

export interface AnonTaskProgress {
  topicId: string;
  completed: boolean;
  score?: number; // 0..1
}

export interface AnonDailyProgress {
  date: string;   // YYYY-MM-DD
  grade: number;
  tasks: AnonTaskProgress[];
}

function readProgress(): AnonDailyProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AnonDailyProgress;
    if (!parsed?.date || !Array.isArray(parsed?.tasks)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeProgress(p: AnonDailyProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // localStorage full / disabled — degrade silently
  }
}

/**
 * Vrátí pokrok pro dnešní den + daný ročník.
 * Pokud uložený progress je z jiného dne nebo s jiným ročníkem, vygeneruje nový.
 */
export function getTodayProgress(grade: number): AnonDailyProgress {
  const today = getTodayDateString();
  const saved = readProgress();
  const dailyTopics = getDailyTasksForGrade(grade);

  if (saved && saved.date === today && saved.grade === grade) {
    // Cílový počet úkolů se mohl zvětšit (např. 3 → 4) — doplň nové úkoly,
    // ale zachovej dosavadní pokrok u už rozpracovaných.
    if (saved.tasks.length < dailyTopics.length) {
      const existingIds = new Set(saved.tasks.map((t) => t.topicId));
      for (const t of dailyTopics) {
        if (saved.tasks.length >= dailyTopics.length) break;
        if (!existingIds.has(t.id)) {
          saved.tasks.push({ topicId: t.id, completed: false });
          existingIds.add(t.id);
        }
      }
      writeProgress(saved);
    }
    return saved;
  }

  const fresh: AnonDailyProgress = {
    date: today,
    grade,
    tasks: dailyTopics.map((t) => ({ topicId: t.id, completed: false })),
  };
  writeProgress(fresh);
  return fresh;
}

/** Označí daný topic jako splněný a uloží jeho skóre. */
export function markTaskCompleted(topicId: string, score: number): void {
  const progress = readProgress();
  if (!progress) return;
  const task = progress.tasks.find((t) => t.topicId === topicId);
  if (!task) return;
  task.completed = true;
  task.score = Math.max(0, Math.min(1, score));
  writeProgress(progress);
}

/** True pokud jsou všechny dnešní úkoly splněné. */
export function allTasksCompleted(): boolean {
  const progress = readProgress();
  if (!progress || progress.tasks.length === 0) return false;
  return progress.tasks.every((t) => t.completed);
}

/** Pomocná: vymaže progress (např. po registraci, viz Krok C). */
export function clearAnonProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
