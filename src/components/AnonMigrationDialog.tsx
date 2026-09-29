import { getAnonProgressSummary } from "@/lib/anonMigration";
import { anonHigherLevelCount } from "@/lib/levelStore";
import { pad } from "@/lib/czechGrammar";
import { Loader2 } from "lucide-react";
import { PaintedArrow } from "@/components/icons/PaintedArrow";

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
  // Přenáší se i dosažená úroveň témat. Dřív dialog bez splněného denního
  // úkolu vrátil `null` a dítě, které procvičovalo jiné téma, o úroveň přišlo.
  const vyssiUroven = anonHigherLevelCount();
  if (!summary && vyssiUroven === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
        <div className="text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-lg font-bold text-foreground">
            {summary ? `Máš splněno ${pad(summary.completedCount, "ÚKOL")}!` : "Máš za sebou kus práce!"}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            Chceš si přenést svůj dosavadní pokrok do nového účtu?
          </p>
        </div>

        {/* „Splněno: 1 témat" dřív — ruční skloňování. Popisek s dvojtečkou
            a samotné číslo se shodě vyhne. */}
        <div className="bg-violet-50 rounded-xl p-3 text-sm text-violet-700 text-center space-y-0.5">
          {summary && (
            <p>
              Ročník: <strong>{summary.grade}. třída</strong>
              {" · "}
              Splněné úkoly: <strong>{summary.completedCount}</strong>
            </p>
          )}
          {vyssiUroven > 0 && (
            <p>Témata na vyšší úrovni: <strong>{vyssiUroven}</strong></p>
          )}
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
              <>Přenést pokrok <PaintedArrow className="h-4 w-4" /></>
            )}
          </button>
          <button
            type="button"
            onClick={onSkip}
            disabled={loading}
            className="w-full text-muted-foreground text-sm hover:text-foreground-soft py-2
                       disabled:opacity-60"
          >
            Ne, začít od začátku
          </button>
        </div>
      </div>
    </div>
  );
}
