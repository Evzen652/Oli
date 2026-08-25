import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { form } from "@/lib/czechGrammar";
import { useT } from "@/lib/i18n";

interface Props {
  open: boolean;
  /** Kolik úloh má dítě hotových. */
  done: number;
  /** Kolik úloh sezení celkem má. */
  total: number;
  /** Zůstat ve cvičení (zavřít dialog). */
  onStay: () => void;
  /** Opustit cvičení — záloha zůstává, práce se neztratí. */
  onLeave: () => void;
}

/**
 * Potvrzení před odchodem z rozdělaného cvičení.
 *
 * Nález UX auditu 2026-08-25: v hlavičce byly ČTYŘI prvky (logo, Zpět,
 * Odhlásit se, ✕), které okamžitě zabily sezení bez jediného dialogu —
 * u anonymního dítěte bylo logo dokonce jediný klikací prvek v hlavičce
 * a zároveň ten destruktivní. Osm z deseti rozpracovaných úloh zmizelo
 * jedním kliknutím.
 *
 * Dialog neslibuje nic, co by aplikace neuměla: záloha sezení (TTL 2 h)
 * v `useSessionPersistence` existovala už dřív, jen ji `handleReset`
 * pokaždé smazal. Teď odchod zálohu nechá a `SessionRecoveryDialog`
 * ji při návratu nabídne.
 */
export function ExitSessionDialog({ open, done, total, onStay, onLeave }: Props) {
  const t = useT();
  // „z {total} úloh" — po předložce „z" je 2. pád: 1 → úlohy, jinak úloh.
  const noun = total === 1 ? "úlohy" : form(5, "ÚLOHA");
  const description = t("exit.description")
    .replace("{done}", String(done))
    .replace("{total}", String(total))
    .replace("{noun}", noun);

  return (
    <AlertDialog open={open} onOpenChange={(next) => { if (!next) onStay(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("exit.title")}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Odchod je vedlejší volba — hlavní tlačítko drží dítě u práce. */}
          <AlertDialogCancel onClick={onLeave}>{t("exit.leave")}</AlertDialogCancel>
          <AlertDialogAction onClick={onStay}>{t("exit.stay")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
