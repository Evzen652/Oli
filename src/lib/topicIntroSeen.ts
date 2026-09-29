/**
 * Výklad tématu („Co je dobré vědět") při PRVNÍM vstupu do tématu.
 *
 * Proč: appka po výběru tématu jde rovnou na úlohy a výklad byl jen za
 * tlačítkem, které se samo nikdy neotevřelo. Dítě, které látku ještě nezná,
 * tak začínalo tipováním. Rozhodnuto 2026-09-29: ukázat výklad jednou, pak ho
 * nechat za tlačítkem (princip „čím méně času v systému, tím lépe" platí pro
 * každý další vstup).
 *
 * Proč `localStorage`, a ne databáze: aplikace nikde neeviduje „tohle téma
 * dítě už cvičilo" tak, aby se to dalo přečíst bez síťového dotazu na startu
 * sezení. Cena: na druhém zařízení se výklad ukáže ještě jednou — neškodné.
 *
 * Klíčováno vlastníkem (ID přihlášeného uživatele, jinak „anon"), aby
 * sourozenci na jednom tabletu neviděli výklad „za sebe".
 */
import { readLocal, writeLocal } from "@/lib/safeStorage";

export const TOPIC_INTRO_KEY = "oli_topic_intro_seen";

/** vlastník → ID témat, u kterých už výklad viděl */
type SeenMap = Record<string, string[]>;

function readSeen(): SeenMap {
  const raw = readLocal(TOPIC_INTRO_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Zabere první vstup: vrátí `true` právě tehdy, když výklad tohohle tématu
 * vlastník ještě neviděl A zápis „viděno" se podařil.
 *
 * Když úložiště zápis odmítne (Safari v anonymním režimu), vrací `false`:
 * bez paměti by se výklad otevíral při každém vstupu, a to je horší než
 * nechat ho za tlačítkem.
 */
export function claimTopicIntro(owner: string, topicId: string): boolean {
  const seen = readSeen();
  const list = Array.isArray(seen[owner]) ? seen[owner] : [];
  if (list.includes(topicId)) return false;
  seen[owner] = [...list, topicId];
  return writeLocal(TOPIC_INTRO_KEY, JSON.stringify(seen));
}
