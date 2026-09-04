/**
 * Vazba sezení ↔ úkol od rodiče.
 *
 * PROČ TENHLE SOUBOR EXISTUJE
 * ---------------------------
 * Úkol (`parent_assignments`) a sezení (`session_logs`) spojoval jen `skill_id`.
 * Z toho plynuly dvě chování, která rodiče mátla:
 *
 *  1. **Skóre úkolu nebylo zmrazené.** Rodičovský seznam bral „poslední sezení
 *     na tom skill_id" — takže když si dítě téma o týden později procvičilo
 *     znovu a šlo mu to hůř, zpětně si tím přepsalo známku u splněného úkolu.
 *  2. **Historie se přepisovala.** „Samostatné procvičování" vyhazovalo každé
 *     sezení, jehož téma bylo *někdy* zadáno. Rodič zadal téma → tím zmizelo
 *     i deset starších samostatných sezení, která se zadáním nesouvisela.
 *
 * MODEL
 * -----
 * Každý úkol má **okno**: od dne zadání (`assigned_date`) do okamžiku splnění.
 * Sezení patří k úkolu právě tehdy, když padne do tohoto okna. Cokoli mimo okno
 * je samostatné procvičování — včetně sezení *před* zadáním a *po* splnění.
 *
 * Skóre úkolu = sezení, které ho splnilo (poslední sezení v okně). Zmrazené.
 *
 * BEZ MIGRACE
 * -----------
 * Čas splnění se nečte z vlastního sloupce (ten by vyžadoval deploy migrace),
 * ale z `updated_at` — ten se u úkolu mění právě při přepnutí na „completed"
 * (klient ho posílá explicitně, viz `useSessionDispatch.markAssignmentCompleted`).
 * U historických řádků bez `updated_at` se degraduje na `created_at`, případně
 * na den zadání: okno pak vyjde prázdné a sezení se zařadí mezi samostatná.
 * Degradace tedy vede k „ukázat víc v historii", ne k tichému skrytí dat.
 */

/** Stavy, ve kterých je úkol uzavřený a jeho okno se tím zavírá. */
const TERMINAL_STATUSES = new Set(["completed", "skipped"]);

/** Řádek `parent_assignments` v rozsahu, který k určení okna stačí. */
export interface AssignmentRowLike {
  skill_id: string;
  assigned_date: string;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/** Řádek `session_logs` v rozsahu, který k určení sezení stačí. */
export interface SessionLogLike {
  session_id: string;
  created_at?: string | null;
}

export interface AssignmentWindow {
  skillId: string;
  /** Den zadání ve tvaru `YYYY-MM-DD` (dolní mez okna, včetně). */
  assignedDate: string;
  /** Čas splnění v ms, nebo `null` u dosud otevřeného úkolu (okno bez horní meze). */
  completedAtMs: number | null;
}

/** `Date` → `YYYY-MM-DD` v **místním** čase (ne UTC — viz `localDayKey`). */
function toLocalDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Den ISO časového razítka podle **místní** zóny.
 *
 * Záměrně ne `toISOString().slice(0, 10)`: v ČR (UTC+1/+2) by procvičování
 * v 0:30 spadlo do UTC ještě do předchozího dne a den zadání by ho pak
 * vyřadil z okna úkolu.
 */
export function localDayKey(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return null;
  return toLocalDayKey(new Date(ms));
}

/** Bezpečný `Date.parse` — nevalidní / chybějící vstup vrací `null`, ne `NaN`. */
function parseMs(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? null : ms;
}

/** Půlnoc daného `YYYY-MM-DD` v místním čase (v ms). */
function startOfLocalDayMs(dayKey: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dayKey);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 0, 0, 0, 0).getTime();
}

/** Převede řádek úkolu na časové okno, ve kterém k němu sezení patří. */
export function toAssignmentWindow(row: AssignmentRowLike): AssignmentWindow {
  const assignedDate = (row.assigned_date ?? "").slice(0, 10);
  const isTerminal = TERMINAL_STATUSES.has(row.status ?? "");
  const completedAtMs = isTerminal
    ? parseMs(row.updated_at) ?? parseMs(row.created_at) ?? startOfLocalDayMs(assignedDate)
    : null;
  return { skillId: row.skill_id, assignedDate, completedAtMs };
}

/** Seskupí okna podle `skill_id` — jedno téma může být zadáno opakovaně. */
export function buildAssignmentWindows(rows: AssignmentRowLike[]): Map<string, AssignmentWindow[]> {
  const map = new Map<string, AssignmentWindow[]>();
  for (const row of rows) {
    if (!row?.skill_id) continue;
    const w = toAssignmentWindow(row);
    const list = map.get(w.skillId);
    if (list) list.push(w);
    else map.set(w.skillId, [w]);
  }
  return map;
}

/** Padá sezení do okna konkrétního úkolu? */
export function isInWindow(w: AssignmentWindow, sessionIso: string | null | undefined): boolean {
  const day = localDayKey(sessionIso);
  if (!day || !w.assignedDate) return false;
  if (day < w.assignedDate) return false;
  if (w.completedAtMs === null) return true;
  const ms = parseMs(sessionIso);
  return ms !== null && ms <= w.completedAtMs;
}

/**
 * Vzniklo sezení proto, že téma bylo zadané rodičem?
 *
 * `false` znamená samostatné procvičování — včetně sezení na zadaném tématu,
 * které proběhlo dřív, než rodič úkol zadal, nebo až po jeho splnění.
 */
export function isAssignedSession(
  skillId: string,
  sessionIso: string | null | undefined,
  windows: Map<string, AssignmentWindow[]>,
): boolean {
  const list = windows.get(skillId);
  if (!list) return false;
  return list.some((w) => isInWindow(w, sessionIso));
}

/**
 * Které sezení daný úkol splnilo.
 *
 * Poslední sezení, které padlo do okna úkolu. Vrací `null`, když takové není —
 * pak se u úkolu nemá zobrazit žádné skóre (dřív se sáhlo po libovolném
 * posledním sezení na tom tématu, což byl přesně ten přepisovaný výsledek).
 *
 * `graceMs` kryje závod se zápisem logů: `session_logs` se ukládají
 * fire-and-forget, takže poslední řádek může dorazit o kousek později než
 * update úkolu.
 */
export function pickCompletingSessionId(
  logs: SessionLogLike[],
  window: AssignmentWindow,
  graceMs = 120_000,
): string | null {
  const lowerMs = startOfLocalDayMs(window.assignedDate);
  const upperMs = window.completedAtMs === null ? null : window.completedAtMs + graceMs;

  let bestMs = -Infinity;
  let bestId: string | null = null;
  for (const log of logs) {
    const ms = parseMs(log.created_at);
    if (ms === null) continue;
    if (lowerMs !== null && ms < lowerMs) continue;
    if (upperMs !== null && ms > upperMs) continue;
    if (ms > bestMs) {
      bestMs = ms;
      bestId = log.session_id;
    }
  }
  return bestId;
}
