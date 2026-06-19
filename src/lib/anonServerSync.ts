/**
 * Fáze 3 (Možnost B) — klientský most na serverové anon úložiště.
 *
 * Drží náhodný `anon_token` v localStorage a přes edge funkci `anon-progress`
 * zrcadlí pokrok/trial na server (dual-write). localStorage zůstává zdrojem
 * pravdy — serverové volání je fire-and-forget, nikdy neblokuje UI ani nesmí
 * shodit session při výpadku.
 */

import { supabase } from "@/integrations/supabase/client";

const TOKEN_KEY = "oli_anon_token";

/** Vrátí (a při první potřebě vytvoří) anonymní token z localStorage. */
export function getAnonToken(): string {
  let t: string | null = null;
  try {
    t = localStorage.getItem(TOKEN_KEY);
    if (!t) {
      t = crypto.randomUUID();
      localStorage.setItem(TOKEN_KEY, t);
    }
  } catch {
    // localStorage nedostupné — vrať efemérní token (server-sync se prostě neuloží)
    t = t ?? crypto.randomUUID();
  }
  return t;
}

/** Token jen pokud existuje (nevytváří nový). Pro adopci/pozvánky. */
export function peekAnonToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

async function call(action: string, extra: Record<string, unknown> = {}): Promise<unknown> {
  try {
    const token = getAnonToken();
    const { data } = await supabase.functions.invoke("anon-progress", {
      body: { action, token, ...extra },
    });
    return data;
  } catch {
    return null; // fire-and-forget
  }
}

/** Zaznamená start trialu na server (idempotentní — neresetuje started_at). */
export function serverStartTrial(grade: number): void {
  void call("start-trial", { grade });
}

/** Zrcadlí splněný úkol na server. */
export function serverRecordTask(topicId: string, grade: number, score: number): void {
  void call("record", { topicId, grade, score });
}
