import { useEffect, useRef } from "react";

/**
 * Hlídač časového limitu sezení. **Nic nevykresluje.**
 *
 * Do 2026-09-04 vykresloval dítěti odpočet s progress barem, který poslední
 * minutu svítil červeně. Odstraněno ze dvou důvodů:
 *
 *  - Ubíhající čas je pro dítě tlak, ne informace — limit stejně nešlo
 *    ovlivnit ani prodloužit, takže odpočet nenabízel žádnou akci.
 *  - Odpočet byl navíc schovaný za `!isStudentView`, což je *každé* dítě.
 *    Viděl ho tedy jen rodič/admin v náhledu sezení, tedy nikdo, komu limit
 *    reálně běží.
 *
 * Místo odpočtu přijde jedna klidná hláška `warnSeconds` před koncem
 * (`onWarning`) a po vypršení jiná koncová obrazovka (`onTimeExpired`).
 */
interface SessionTimerProps {
  startTime: number;
  maxSeconds: number;
  isActive: boolean;
  onTimeExpired: () => void;
  /**
   * Zavolá se jednou, `warnSeconds` před vypršením limitu. Dostane `startTime`
   * sezení, aby si volající mohl hlášku svázat s konkrétním sezením, aniž by
   * musel předávat nestabilní callback (ten by při každém renderu restartoval
   * interval a odpočet by se nikdy nedopočítal).
   */
  onWarning?: (startTime: number) => void;
  /** Kolik sekund před koncem upozornit. Výchozí 60. */
  warnSeconds?: number;
}

export function SessionTimer({
  startTime, maxSeconds, isActive, onTimeExpired, onWarning, warnSeconds = 60,
}: SessionTimerProps) {
  // Ref, ne state: upozornění má padnout právě jednou za sezení a nemá
  // restartovat interval.
  const warnedForRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      if (onWarning && warnedForRef.current !== startTime && elapsed >= maxSeconds - warnSeconds) {
        warnedForRef.current = startTime;
        onWarning(startTime);
      }
      if (elapsed >= maxSeconds) {
        onTimeExpired();
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, maxSeconds, isActive, onTimeExpired, onWarning, warnSeconds]);

  return null;
}
