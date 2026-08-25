import { SelectItem } from "@/components/ui/select";
import { isGradeAvailable } from "@/lib/contentAvailability";
import type { Grade } from "@/lib/types";

const ALL_GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface Props {
  /** Slovo za číslem — „třída" nebo „ročník" podle kontextu věty. */
  label?: string;
}

/**
 * Položky výběru ročníku pro rodičovskou část.
 *
 * Nález UX auditu 2026-08-25: rodičovské výběry nabízely 1.–9. třídu
 * natvrdo, takže rodič mohl dítěti nastavit sedmičku — a dětská aplikace
 * pak na stejný ročník odpověděla „brzy". Rodič nastavil něco, co nemohlo
 * fungovat, a chybu uviděl až u dítěte.
 *
 * Zdroj pravdy je `isGradeAvailable` (`ACTIVE_GRADES` v `contentAvailability`),
 * stejný, jaký používá dětský onboarding — odemčení ročníku se tak propíše
 * na obě strany naráz. Nedostupné ročníky zůstávají vidět, aby rodič poznal,
 * že se na nich pracuje, ale nejdou vybrat.
 */
export function GradeSelectItems({ label = "třída" }: Props) {
  return (
    <>
      {ALL_GRADES.map((g) => {
        const available = isGradeAvailable(g);
        return (
          <SelectItem key={g} value={String(g)} disabled={!available}>
            {g}. {label}{available ? "" : " — připravujeme"}
          </SelectItem>
        );
      })}
    </>
  );
}
