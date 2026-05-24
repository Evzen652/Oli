import { getAnonProgressSummary } from "@/lib/anonMigration";
import { Loader2 } from "lucide-react";

interface Props {
  onConfirm: () => void;
  onSkip: () => void;
  loading?: boolean;
}

/**
 * Dialog zobrazený po přihlášení/registraci pokud má uživatel anonymní pokrok.
 * Nabízí přenést pokrok do nově propojeného účtu, nebo začít od začátku.
 */
export function AnonMigrationDialog({ onConfirm, onSkip, loading }: Props) {
  const summary = getAnonProgressSummary();
  if (!summary) return null;

  const taskWord =
    summary.completedCount === 1
      ? "úkol"
      : summary.completedCount < 5
        ? "úkoly"
        : "úkolů";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
        <div className="text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-lg font-bold text-gray-900">
            Máš splněno {summary.completedCount} {taskWord}!
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Chceš si přenést svůj dosavadní pokrok do nového účtu?
          </p>
        </div>

        <div className="bg-violet-50 rounded-xl p-3 text-sm text-violet-700 text-center">
          Ročník: <strong>{summary.grade}. třída</strong>
          {" · "}
          Splněno: <strong>{summary.completedCount} témat</strong>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full bg-violet-600 text-white rounded-xl py-3 font-semibold
                       hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed
                       transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Přenáším pokrok…
              </>
            ) : (
              <>Přenést pokrok →</>
            )}
          </button>
          <button
            type="button"
            onClick={onSkip}
            disabled={loading}
            className="w-full text-gray-400 text-sm hover:text-gray-600 py-2
                       disabled:opacity-60"
          >
            Ne, začít od začátku
          </button>
        </div>
      </div>
    </div>
  );
}
