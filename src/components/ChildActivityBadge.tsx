import { useChildStats } from "@/hooks/useChildStats";
import { useT } from "@/lib/i18n";

interface Props {
  childId: string;
}

export function ChildActivityBadge({ childId }: Props) {
  const { sessions, tasks, accuracy, loading } = useChildStats(childId);
  const t = useT();

  if (loading) return null;

  if (tasks === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-muted bg-muted/20 p-4 text-center">
        <p className="text-sm text-muted-foreground italic">
          {t("parent.summary_no_activity")}
        </p>
      </div>
    );
  }

  const verdictInfo =
    accuracy >= 80
      ? { text: "Jde mu/jí to skvěle!", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800" }
      : accuracy >= 50
      ? { text: "Zlepšuje se, ještě trénovat.", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800" }
      : { text: "Potřebuje víc procvičovat.", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" };

  return (
    <div className={`rounded-xl border p-4 space-y-1 ${verdictInfo.bg}`}>
      <p className="text-sm text-foreground">
        Tento týden: <strong>{tasks} úloh</strong> v <strong>{sessions} {sessions === 1 ? "sezení" : "sezeních"}</strong>
        {" · "}úspěšnost <strong>{accuracy} %</strong>
      </p>
      <p className={`text-sm font-semibold ${verdictInfo.color}`}>
        {verdictInfo.text}
      </p>
    </div>
  );
}
