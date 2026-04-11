import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle, Trash2 } from "lucide-react";
import { useT } from "@/lib/i18n";
import { getTopicById } from "@/lib/contentRegistry";

interface Assignment {
  id: string;
  skill_id: string;
  assigned_date: string;
  due_date: string | null;
  status: string;
  note: string | null;
}

interface Props {
  childId: string;
  refreshKey?: number;
}

function formatCzDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()}.${d.getMonth() + 1}.`;
}

export function AssignmentList({ childId, refreshKey }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useT();

  const fetchAssignments = async () => {
    const { data } = await supabase
      .from("parent_assignments")
      .select("id, skill_id, assigned_date, due_date, status, note")
      .eq("child_id", childId)
      .order("assigned_date", { ascending: false })
      .limit(20);
    setAssignments((data as Assignment[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAssignments(); }, [childId, refreshKey]);

  const handleDelete = async (id: string) => {
    await supabase.from("parent_assignments").delete().eq("id", id);
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  if (loading) return null;
  if (assignments.length === 0) return null;

  const statusIcon = (s: string) => {
    if (s === "completed") return <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />;
    if (s === "skipped") return <XCircle className="h-3.5 w-3.5 text-muted-foreground" />;
    return <Clock className="h-3.5 w-3.5 text-orange-500" />;
  };

  const statusLabel = (s: string) => {
    if (s === "completed") return t("assign.status_done");
    if (s === "skipped") return t("assign.status_skipped");
    return t("assign.status_pending");
  };

  const statusVariant = (s: string): "default" | "secondary" | "destructive" | "outline" => {
    if (s === "completed") return "default";
    if (s === "skipped") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">{t("assign.list_title")}</p>
      <div className="space-y-2">
        {assignments.map(a => (
          <div key={a.id} className="rounded-lg border bg-card px-4 py-3 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              {statusIcon(a.status)}
              <span className="flex-1 truncate font-medium text-foreground">
                {getTopicById(a.skill_id)?.title ?? a.skill_id}
              </span>
              <Badge variant={statusVariant(a.status)} className="text-xs gap-1">
                {statusLabel(a.status)}
              </Badge>
              {a.status === "pending" && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => handleDelete(a.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground pl-6">
              Zadáno: {formatCzDate(a.assigned_date)}
              {a.due_date ? ` · Do: ${formatCzDate(a.due_date)}` : " · Bez termínu"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
