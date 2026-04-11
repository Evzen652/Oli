import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useT } from "@/lib/i18n";
import { ArrowLeft, CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import { getTopicById } from "@/lib/contentRegistry";
import { getTopicIllustrationUrl, getPrvoukaTopicEmoji } from "@/lib/prvoukaVisuals";

interface SessionSummary {
  session_id: string;
  date: string;
  skill_id: string;
  total: number;
  correct: number;
  wrong: number;
  help_used: number;
}

export default function SessionHistory() {
  const { childId } = useParams<{ childId: string }>();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [skillNames, setSkillNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const t = useT();

  useEffect(() => {
    if (!childId) return;
    (async () => {
      const [logsRes, skillsRes] = await Promise.all([
        supabase
          .from("session_logs")
          .select("session_id, skill_id, correct, help_used, created_at")
          .eq("child_id", childId)
          .order("created_at", { ascending: false })
          .limit(500),
        supabase
          .from("curriculum_skills")
          .select("code_skill_id, name"),
      ]);

      // Build skill name map
      const nameMap: Record<string, string> = {};
      for (const s of skillsRes.data ?? []) {
        nameMap[s.code_skill_id] = s.name;
      }
      setSkillNames(nameMap);

      const data = logsRes.data;
      if (logsRes.error || !data) {
        setLoading(false);
        return;
      }

      // Group by session_id
      const map = new Map<string, SessionSummary>();
      for (const row of data) {
        let s = map.get(row.session_id);
        if (!s) {
          s = {
            session_id: row.session_id,
            date: row.created_at,
            skill_id: row.skill_id,
            total: 0,
            correct: 0,
            wrong: 0,
            help_used: 0,
          };
          map.set(row.session_id, s);
        }
        s.total++;
        if (row.correct) s.correct++;
        else s.wrong++;
        if (row.help_used) s.help_used++;
      }

      setSessions(Array.from(map.values()));
      setLoading(false);
    })();
  }, [childId]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displaySkillName = (id: string) => {
    return skillNames[id] || id.replace(/[-_]/g, " ").replace(/^./, (c) => c.toUpperCase());
  };

  const getIllustration = (skillId: string) => {
    const topic = getTopicById(skillId);
    if (!topic) return { url: null, emoji: "📚" };
    const url = getTopicIllustrationUrl({ subject: topic.subject, category: topic.category, topic: topic.topic });
    const emoji = getPrvoukaTopicEmoji(topic.subject, topic.category, topic.topic) ?? "📚";
    return { url, emoji };
  };

  const pctColor = (pct: number) => {
    if (pct >= 80) return "text-green-600";
    if (pct >= 50) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/parent")} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> {t("report.back")}
          </Button>
          <h1 className="text-xl font-semibold text-foreground">{t("history.title")}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-4 space-y-3">
        {loading && <p className="text-muted-foreground text-center py-8">{t("loading")}</p>}

        {!loading && sessions.length === 0 && (
          <p className="text-muted-foreground text-center py-8">{t("history.no_data")}</p>
        )}

        {sessions.map((s) => {
          const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
          const independent = s.correct - s.help_used;
          const { url: illustrationUrl, emoji } = getIllustration(s.skill_id);
          return (
            <Card key={s.session_id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  {/* Illustration */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {illustrationUrl ? (
                      <img
                        src={illustrationUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.classList.add("text-2xl");
                          e.currentTarget.parentElement!.textContent = emoji;
                        }}
                      />
                    ) : (
                      <span className="text-2xl">{emoji}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">{t("history.focus_label")}</p>
                        <p className="font-medium text-foreground">{displaySkillName(s.skill_id)}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("history.practiced_at")} {formatDate(s.date)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-2xl font-bold ${pctColor(pct)}`}>{pct} %</p>
                        <p className="text-xs text-muted-foreground">
                          {s.correct} z {s.total} správně
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm pt-1">
                      {independent > 0 && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {independent} sám/sama
                        </span>
                      )}
                      {s.help_used > 0 && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <HelpCircle className="h-3.5 w-3.5" />
                          {s.help_used} s nápovědou
                        </span>
                      )}
                      {s.wrong > 0 && (
                        <span className="flex items-center gap-1 text-red-600">
                          <XCircle className="h-3.5 w-3.5" />
                          {s.wrong} špatně
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </main>
    </div>
  );
}
