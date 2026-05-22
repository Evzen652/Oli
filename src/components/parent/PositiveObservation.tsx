/**
 * PositiveObservation — prominentně zobrazuje pozitivní pozorování z AI reportu.
 *
 * Pravidla AI promptu:
 * - MUSÍ být konkrétní fakt (číslo, jméno topicu, akce) — NE "skvělá práce!"
 * - Pokud žádné pozitivum → neutrální fakt (procvičuje pravidelně, ...)
 * - NIKDY nelže — pozitivum musí být ověřitelné z dat
 */

interface PositiveObservationProps {
  /** Konkrétní pozitivní pozorování z Gemini reportu. */
  text: string;
  /** Jméno dítěte pro personalizaci (volitelné). */
  childName?: string;
  className?: string;
}

export function PositiveObservation({
  text,
  childName,
  className = "",
}: PositiveObservationProps) {
  if (!text?.trim()) return null;

  return (
    <div
      className={`rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4 ${className}`}
      role="region"
      aria-label="Pozitivní pozorování"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xl" aria-hidden>🎉</span>
        <div>
          {childName && (
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1">
              {childName}
            </p>
          )}
          <p className="text-sm font-medium text-emerald-900 leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
