import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useT } from "@/lib/i18n";

interface Props {
  open: boolean;
  topicTitle: string;
  onRecover: () => void;
  onDiscard: () => void;
}

export function SessionRecoveryDialog({ open, topicTitle, onRecover, onDiscard }: Props) {
  const t = useT();
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("recovery.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("recovery.description").replace("{topic}", topicTitle)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDiscard}>{t("recovery.discard")}</AlertDialogCancel>
          <AlertDialogAction onClick={onRecover}>{t("recovery.resume")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
