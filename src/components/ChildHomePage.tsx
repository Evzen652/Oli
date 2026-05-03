import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getTopicById } from "@/lib/contentRegistry";
import type { TopicMetadata, Grade } from "@/lib/types";
import { useT } from "@/lib/i18n";
import { useChildStats } from "@/hooks/useChildStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Link2 } from "lucide-react";
import { toast } from "sonner";
import { getReadableSkillName, getSkillIcon } from "@/lib/skillReadableName";

interface Assignment {
  id: string;
  skill_id: string;
  note: string | null;
  due_date: string | null;
  assigned_date: string;
  skillName: string;
  subject: string;
  topic?: TopicMetadata;
}

const SUBJECT_EMOJI: Record<string, string> = {
  matematika: "🔢",
  čeština: "📝",
  prvouka: "🌿",
};

// ── Pairing code ──────────────────────────────────────────────────────────────

function PairingCodeInput({ onPaired }: { onPaired: (childName: string, grade: number) => void }) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const char = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setErrorMsg("");
    setStatus("idle");
    if (char && index < 5) inputRefs.current[index + 1]?.focus();
    if (char && index === 5 && next.every(d => d)) submitCode(next.join(""));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const next = [...digits]; next[index - 1] = ""; setDigits(next);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    const next = [...digits];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    if (text.length === 6) { inputRefs.current[5]?.focus(); submitCode(text); }
    else if (text.length > 0) inputRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const submitCode = async (code: string) => {
    setStatus("loading");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setStatus("error"); setErrorMsg("Nejsi přihlášen/a"); return; }
      const { data, error } = await supabase
        .from("children").update({ child_user_id: user.id })
        .eq("pairing_code", code).gte("pairing_code_expires_at", new Date().toISOString())
        .is("child_user_id", null).select("name, grade").maybeSingle();
      if (error || !data) {
        setStatus("error"); setErrorMsg("Neplatný nebo expirovaný kód. Zkus to znovu.");
        setDigits(["", "", "", "", "", ""]); inputRefs.current[0]?.focus();
      } else {
        setStatus("success"); toast.success(`Propojeno! Ahoj, ${data.child_name}!`);
        onPaired(data.child_name, data.grade);
      }
    } catch { setStatus("error"); setErrorMsg("Něco se pokazilo. Zkus to znovu."); }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5">
      <CardContent className="p-6 space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Link2 className="h-5 w-5" />
          <h3 className="font-semibold text-base">Propoj se s rodičem</h3>
        </div>
        <p className="text-sm text-muted-foreground">Zadej 6místný kód, který ti dal rodič</p>
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input key={i} ref={el => { inputRefs.current[i] = el; }} type="text" inputMode="text"
              maxLength={1} value={digit} onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)} disabled={status === "loading" || status === "success"}
              className={`w-12 h-14 text-center text-2xl font-mono font-bold rounded-xl border-2 outline-none transition-all
                ${status === "error" ? "border-destructive bg-destructive/5" : ""}
                ${status === "success" ? "border-green-500 bg-green-50 text-green-700" : ""}
                ${status === "idle" || status === "loading" ? "border-input hover:border-primary focus:border-primary bg-background" : ""}`}
            />
          ))}
        </div>
        {status === "loading" && <p className="text-sm text-muted-foreground animate-pulse">Ověřuji kód...</p>}
        {status === "error" && <p className="text-sm text-destructive">{errorMsg}</p>}
        {status === "success" && <p className="text-sm text-green-600 font-medium">Propojeno!</p>}
      </CardContent>
    </Card>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface ChildHomePageProps {
  grade: Grade;
  onSelectTopic: (topic: TopicMetadata) => void;
  onBrowseTopics: () => void;
}

export function ChildHomePage({ grade, onSelectTopic, onBrowseTopics }: ChildHomePageProps) {
  const t = useT();
  const [childName, setChildName] = useState<string>("");
  const [childId, setChildId] = useState<string | null>(null);
  const [isPaired, setIsPaired] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const stats = useChildStats(childId);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let child: { id: string; name: string } | null = null;
      const { data: childByUser } = await supabase.from("children").select("id, child_name")
        .eq("child_user_id", user.id).maybeSingle();

      if (childByUser) { child = childByUser; setIsPaired(true); }
      else {
        const { data: childByParent } = await supabase.from("children").select("id, child_name")
          .eq("parent_user_id", user.id).limit(1).maybeSingle();
        if (childByParent) child = childByParent;
      }

      if (!child) { setLoading(false); return; }
      setChildName(child.child_name);
      setChildId(child.id);

      const { data: rawAssignments } = await supabase.from("parent_assignments")
        .select("id, skill_id, note, due_date, assigned_date").eq("child_id", child.id)
        .eq("status", "pending").order("due_date", { ascending: true, nullsFirst: false })
        .order("assigned_date", { ascending: true });

      if (!rawAssignments || rawAssignments.length === 0) { setAssignments([]); setLoading(false); return; }

      const skillIds = rawAssignments.map(a => a.skill_id);
      const topicMap: Record<string, TopicMetadata> = {};
      const needDbLookup: string[] = [];
      for (const sid of skillIds) {
        const topic = getTopicById(sid);
        if (topic) topicMap[sid] = topic; else needDbLookup.push(sid);
      }

      let dbNameMap: Record<string, { name: string }> = {};
      if (needDbLookup.length > 0) {
        const { data: skills } = await supabase.from("curriculum_skills")
          .select("code_skill_id, name, topic_id").in("code_skill_id", needDbLookup);
        if (skills) for (const sk of skills) dbNameMap[sk.code_skill_id] = { name: sk.name };
      }

      setAssignments(rawAssignments.map(a => {
        const topic = topicMap[a.skill_id];
        return {
          id: a.id, skill_id: a.skill_id, note: a.note, due_date: a.due_date,
          assigned_date: a.assigned_date,
          skillName: topic?.title ?? dbNameMap[a.skill_id]?.name ?? a.skill_id,
          subject: topic?.subject ?? "", topic,
        };
      }));
      setLoading(false);
    })();
  }, []);

  const handleStartAssignment = (assignment: Assignment) => {
    const topic = assignment.topic ?? getTopicById(assignment.skill_id);
    if (topic) onSelectTopic(topic);
  };

  const formatDueDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  const showStats = !stats.loading && stats.tasks > 0;

  return (
    <div className="min-h-screen bg-[#fdf8f2] px-3 py-4 sm:px-5 sm:py-5">
      <div className="w-full max-w-4xl mx-auto space-y-3">

        {/* ── Greeting bar ── */}
        <div className="bg-white rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3 shadow-sm border border-black/[0.06]">
          <div className="h-11 w-11 rounded-full bg-amber-100 flex items-center justify-center text-2xl shrink-0 shadow-sm">
            🦉
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-foreground leading-tight">
              Ahoj, {childName || "žáku"}!
            </h1>
            <p className="text-sm text-muted-foreground">Pojď si procvičit. Vyber, co tě baví.</p>
          </div>
          {showStats && (
            <div className="flex gap-2 flex-wrap">
              <StatPill emoji="🔥" main={`${stats.daysActive} dny`} sub="v řadě" cls="bg-orange-100 text-orange-800" />
              <StatPill emoji="✅" main={String(stats.tasks)} sub="úloh tento týden" cls="bg-emerald-100 text-emerald-800" />
              <StatPill emoji="⭐" main={`${stats.accuracy} %`} sub="úspěšnost" cls="bg-violet-100 text-violet-800" />
            </div>
          )}
        </div>

        {/* ── Pairing code ── */}
        {!isPaired && (
          <PairingCodeInput onPaired={(name, g) => { setChildName(name); setIsPaired(true); }} />
        )}

        {/* ── Main 3-column grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-[2.2fr_1.4fr_1.4fr] gap-3">

          {/* LEFT: Hero */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-400 p-6 flex flex-col text-white min-h-[300px]">
            {/* Sparkle decorations */}
            <span className="absolute top-6 right-14 text-white/25 text-2xl pointer-events-none select-none">✦</span>
            <span className="absolute top-28 right-5 text-white/20 text-lg pointer-events-none select-none">+</span>
            <span className="absolute bottom-24 left-8 text-white/20 text-base pointer-events-none select-none">+</span>
            <span className="absolute top-44 right-20 text-white/15 text-sm pointer-events-none select-none">✦</span>
            <span className="absolute bottom-14 right-10 text-white/15 text-xs pointer-events-none select-none">✦</span>

            <p className="text-[11px] font-bold tracking-[0.15em] text-white/60 flex items-center gap-1.5 mb-5">
              <span>✦</span> HLAVNÍ AKCE
            </p>
            <h2 className="font-display text-[2.4rem] font-extrabold leading-none mb-3">
              Procvičovat<br />samostatně
            </h2>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Vyber si předmět a téma —<br />Oli ti připraví cvičení na míru.
            </p>

            <div className="flex flex-wrap gap-2 mb-auto">
              {[
                { icon: "+", label: "Matematika" },
                { icon: "Aa", label: "Čeština" },
                { icon: "✓", label: "Prvouka" },
              ].map((s) => (
                <button key={s.label} onClick={onBrowseTopics}
                  className="flex items-center gap-1.5 rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/25 transition-colors">
                  <span className="text-xs opacity-75">{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>

            <button onClick={onBrowseTopics}
              className="mt-6 w-full rounded-2xl bg-white py-3.5 font-bold text-violet-700 hover:bg-white/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base shadow-md">
              Začít procvičovat <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* MIDDLE: Úkoly od rodiče */}
          <div className="bg-white rounded-2xl shadow-sm border border-black/[0.06] flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2">
              <span className="text-rose-500 text-base">❤️</span>
              <h2 className="font-bold text-foreground text-sm flex-1">Úkoly od rodiče</h2>
              {assignments.length > 0 && (
                <span className="rounded-full bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 leading-none">
                  {assignments.length}&nbsp;nové
                </span>
              )}
            </div>

            <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
              {assignments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Žádné úkoly 🎉</p>
              ) : (
                assignments.map((a) => {
                  const isOverdue = a.due_date && new Date(a.due_date + "T00:00:00") < new Date();
                  return (
                    <div key={a.id} className="rounded-xl border border-border/50 bg-secondary/20 p-3 space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-lg shrink-0">
                          {SUBJECT_EMOJI[a.subject] || "📋"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-foreground leading-tight">{a.skillName}</p>
                          {a.note && <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{a.note}</p>}
                          {a.due_date && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                <Calendar className="h-2.5 w-2.5" /> do {formatDueDate(a.due_date)}
                              </span>
                              {isOverdue && (
                                <span className="rounded-full bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5">naléhavé</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartAssignment(a)}
                        disabled={!a.topic}
                        className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50 text-white font-bold h-9 flex items-center justify-center gap-1.5 text-sm transition-all"
                      >
                        Začít <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Co jsi procvičoval */}
          <div className="bg-white rounded-2xl shadow-sm border border-black/[0.06] flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-border/40 flex items-start gap-2">
              <span className="text-blue-500 text-base mt-0.5">ℹ️</span>
              <div>
                <h2 className="font-bold text-foreground text-sm">Co jsi procvičoval</h2>
                <p className="text-[11px] text-muted-foreground">Posledních 7 dní</p>
              </div>
            </div>

            <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
              {stats.loading ? null : stats.skills.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Ještě nic — pojď začít! 🚀</p>
              ) : (
                stats.skills.map((s) => {
                  const sAcc = s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0;
                  let barColor = "bg-emerald-500";
                  let badgeText = "skvěle";
                  let badgeCls = "bg-emerald-100 text-emerald-700";
                  if (s.attempts < 2) { barColor = "bg-slate-400"; badgeText = "začínáš"; badgeCls = "bg-slate-100 text-slate-600"; }
                  else if (sAcc < 50) { barColor = "bg-amber-500"; badgeText = "trénovat"; badgeCls = "bg-amber-100 text-amber-700"; }
                  else if (sAcc < 80) { barColor = "bg-sky-500"; badgeText = "dobře"; badgeCls = "bg-sky-100 text-sky-700"; }

                  return (
                    <div key={s.skillId} className="flex items-center gap-2.5 py-2 border-b border-border/30 last:border-0">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-base shrink-0">
                        {getSkillIcon(s.skillId)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <p className="font-semibold text-xs text-foreground truncate leading-tight">
                            {getReadableSkillName(s.skillId)}
                          </p>
                          <span className={`text-[9px] font-bold rounded-full px-1.5 py-0.5 shrink-0 ${badgeCls}`}>
                            {badgeText}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${sAcc}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ── Tip dne ── */}
        <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm border border-black/[0.06]">
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-xl shrink-0">🦉</div>
          <div>
            <p className="text-[11px] font-bold text-orange-500 mb-0.5">Tip dne</p>
            <p className="font-semibold text-sm text-foreground">Chyba není problém — tak se učíš.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatPill({ emoji, main, sub, cls }: { emoji: string; main: string; sub: string; cls: string }) {
  return (
    <div className={`rounded-2xl px-3 py-2 flex items-center gap-2 ${cls}`}>
      <span className="text-base leading-none">{emoji}</span>
      <div>
        <p className="font-extrabold text-sm leading-tight tabular-nums">{main}</p>
        <p className="text-[10px] opacity-70 leading-tight">{sub}</p>
      </div>
    </div>
  );
}
