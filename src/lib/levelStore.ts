/**
 * Kde žije úroveň obtížnosti tématu (L1–L3) mezi sezeními.
 *
 * Přihlášené dítě: tabulka `student_skill_level` (DB). Anonymní dítě ve
 * zkušební verzi: `localStorage`. Dřív se úroveň anonymním dětem neukládala
 * vůbec (`if (!user) return;`) — každé sezení začínalo na L1, obsah L2/L3 se
 * k nim nedostal a shrnutí jim přitom slibovalo „příště něco těžšího".
 *
 * Paměťová mezivrstva (`pamet`) řeší závod u „Procvičit znovu": konec sezení
 * ukládá do DB na pozadí a nové sezení by si jinak mohlo přečíst starou
 * úroveň dřív, než zápis doběhne.
 */
import { supabase } from "@/integrations/supabase/client";
import { readLocal, writeLocal } from "@/lib/safeStorage";
import type { SkillLevelState } from "@/lib/levelProgression";

export const ANON_LEVELS_KEY = "oli_anon_levels";

const pamet = new Map<string, SkillLevelState>();

const vychozi = (level: number): SkillLevelState => ({ level, consecutiveGood: 0, consecutiveBad: 0, lastScore: 0 });

async function vlastnik(): Promise<string | null> {
  try {
    // getSession čte lokální relaci — bez síťového dotazu (na rozdíl od getUser).
    const { data } = await supabase.auth.getSession();
    return data.session?.user.id ?? null;
  } catch {
    return null;
  }
}

function anonVse(): Record<string, SkillLevelState> {
  const raw = readLocal(ANON_LEVELS_KEY);
  if (!raw) return {};
  try {
    const p = JSON.parse(raw);
    return p && typeof p === "object" && !Array.isArray(p) ? p : {};
  } catch {
    return {};
  }
}

function platny(x: unknown): x is SkillLevelState {
  const s = x as SkillLevelState;
  return !!s && [s.level, s.consecutiveGood, s.consecutiveBad].every(Number.isFinite) && s.level >= 1 && s.level <= 3;
}

/**
 * Stav úrovně tématu na začátku sezení a jeho vlastník (ID uživatele, nebo
 * `null` = anonymní dítě). Vlastníka si sezení drží, aby ho konec sezení
 * nemusel zjišťovat znovu (a asynchronně). Nikdy nevyhodí výjimku.
 */
export async function loadLevelState(topicId: string, defaultLevel = 1): Promise<{ state: SkillLevelState; owner: string | null }> {
  const owner = await vlastnik();
  const cache = pamet.get(`${owner ?? "anon"}|${topicId}`);
  if (cache) return { state: cache, owner };
  if (!owner) {
    const s = anonVse()[topicId];
    return { state: platny(s) ? s : vychozi(defaultLevel), owner };
  }
  try {
    const { getSkillLevel } = await import("@/lib/supabase/skillLevel");
    return { state: (await getSkillLevel(owner, topicId)) ?? vychozi(defaultLevel), owner };
  } catch {
    return { state: vychozi(defaultLevel), owner };
  }
}

/**
 * Uloží stav po sezení. Paměť a `localStorage` SYNCHRONNĚ — „Procvičit znovu"
 * hned potom už čte novou úroveň. DB na pozadí (fire-and-forget, neblokuje UI).
 */
export function saveLevelState(topicId: string, state: SkillLevelState, owner: string | null): void {
  pamet.set(`${owner ?? "anon"}|${topicId}`, state);
  if (!owner) {
    const vse = anonVse();
    vse[topicId] = state;
    writeLocal(ANON_LEVELS_KEY, JSON.stringify(vse));
    return;
  }
  void import("@/lib/supabase/skillLevel")
    .then(({ upsertSkillLevel }) => upsertSkillLevel(owner, topicId, state))
    .catch((err) => console.warn("[levelStore] uložení úrovně selhalo:", err));
}

/** Platné anonymní úrovně podle tématu (pro přenos do účtu při propojení). */
export function readAnonLevels(): Record<string, SkillLevelState> {
  return Object.fromEntries(Object.entries(anonVse()).filter(([, s]) => platny(s)));
}

/** Kolik témat má anonymní dítě na vyšší než první úrovni. */
export function anonHigherLevelCount(): number {
  return Object.values(readAnonLevels()).filter((s) => s.level >= 2).length;
}

/** Jen pro testy: vyprázdní paměťovou mezivrstvu. */
export function __resetLevelMemory(): void {
  pamet.clear();
}
