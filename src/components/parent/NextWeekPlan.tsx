/**
 * NextWeekPlan — sekce "Příští týden — doporučený plán" v rodičovském reportu.
 *
 * Zobrazuje 1–3 doporučené akce pro nadcházející týden, každou s:
 * - názvem tématu (displayName)
 * - důvodem (1 věta)
 * - CTA tlačítkem "Zadat ..."
 *
 * Data pochází z Gemini structured output: `next_week_plan` pole.
 */

import { Button } from "@/components/ui/button";
import { getReadableSkillName } from "@/lib/skillReadableName";

export interface NextWeekPlanItem {
  topic_id: string;
  reason: string;
  /** "repeat" = opakování existujícího tématu, "new" = nové téma */
  type?: "repeat" | "new";
}

interface NextWeekPlanProps {
  items: NextWeekPlanItem[];
  childName?: string;
  /** Callback když rodič klikne "Zadat téma" */
  onAssign?: (topicId: string, type: "repeat" | "new") => void;
  className?: string;
}

export function NextWeekPlan({
  items,
  childName,
  onAssign,
  className = "",
}: NextWeekPlanProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-5 ${className}`}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-violet-900">
          📅 Příští týden — doporučený plán
        </h2>
        {childName && (
          <p className="text-sm text-violet-700 mt-0.5">
            Pro {childName}
          </p>
        )}
      </div>

      <ol className="space-y-3">
        {items.map((item, idx) => {
          const topicLabel = getReadableSkillName(item.topic_id, { includeTopic: false });
          const isRepeat = item.type === "repeat";

          return (
            <li key={`${item.topic_id}-${idx}`} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-violet-900 truncate">
                  {topicLabel}
                </p>
                <p className="text-xs text-violet-700 mt-0.5 leading-relaxed">
                  → {item.reason}
                </p>
              </div>
              {onAssign && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAssign(item.topic_id, item.type ?? "new")}
                  className="flex-shrink-0 text-xs border-violet-300 text-violet-700 hover:bg-violet-100 hover:border-violet-400"
                >
                  {isRepeat ? "Zadat opakování »" : "Zadat nové téma »"}
                </Button>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
