import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useChildren, type Child } from "@/hooks/useChildren";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { LogOut, Plus, RefreshCw, UserCheck, Clock, BarChart3, Pencil, Check, X, Trash2, History, ChevronDown, CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getTopicById } from "@/lib/contentRegistry";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useT } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import type { Grade } from "@/lib/types";
import { ChildActivityBadge } from "@/components/ChildActivityBadge";
import { ChildActivityChart } from "@/components/ChildActivityChart";
import { AssignmentCreator } from "@/components/AssignmentCreator";
import { AssignmentList } from "@/components/AssignmentList";
import { SelfPracticeList } from "@/components/SelfPracticeList";
import { OlyLogo } from "@/components/OlyLogo";

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function InlineHistory({ childId }: { childId: string }) {
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState<{ session_id: string; date: string; skill_id: string; total: number; correct: number; help_used: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const t = useT();

  const handleToggle = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && !loaded) {
      setLoading(true);
      supabase
        .from("session_logs")
        .select("session_id, skill_id, correct, help_used, created_at")
        .eq("child_id", childId)
        .order("created_at", { ascending: false })
        .limit(200)
        .then(({ data }) => {
          if (data) {
            const map = new Map<string, typeof sessions[0]>();
            for (const row of data) {
              let s = map.get(row.session_id);
              if (!s) {
                s = { session_id: row.session_id, date: row.created_at, skill_id: row.skill_id, total: 0, correct: 0, help_used: 0 };
                map.set(row.session_id, s);
              }
              s.total++;
              if (row.correct) s.correct++;
              if (row.help_used) s.help_used++;
            }
            setSessions(Array.from(map.values()));
          }
          setLoading(false);
          setLoaded(true);
        });
    }
  };

  return (
    <Collapsible open={open} onOpenChange={handleToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <History className="h-3.5 w-3.5" />
          {t("parent.history")}
          <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-3 rounded-lg border bg-card p-3 space-y-1">
          {loading && <p className="text-xs text-muted-foreground text-center py-3">Načítám…</p>}
          {!loading && sessions.length === 0 && loaded && <p className="text-xs text-muted-foreground text-center py-3">Žádná historie</p>}
          {sessions.slice(0, 15).map((s) => {
            const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
            const topic = getTopicById(s.skill_id);
            const name = topic?.title ?? s.skill_id.replace(/[-_]/g, " ");
            return (
              <div key={s.session_id} className="flex items-center gap-2 py-1.5 border-b last:border-0 text-xs">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{name}</p>
                  <p className="text-muted-foreground">{new Date(s.date).toLocaleDateString("cs-CZ", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <span className="flex items-center gap-0.5 text-green-600"><CheckCircle2 className="h-3 w-3" />{s.correct}</span>
                {s.help_used > 0 && <span className="flex items-center gap-0.5 text-amber-500"><HelpCircle className="h-3 w-3" />{s.help_used}</span>}
                {s.total - s.correct > 0 && <span className="flex items-center gap-0.5 text-red-500"><XCircle className="h-3 w-3" />{s.total - s.correct}</span>}
                <span className={`font-bold ${pct >= 80 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-red-500"}`}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function ParentDashboard() {
  const { children, loading, addChild, regenerateCode, updateChild, deleteChild } = useChildren();
  const { profile } = useProfile();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState<Grade>(3);
  const [newNotes, setNewNotes] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editGrade, setEditGrade] = useState<Grade>(3);
  const [editNotes, setEditNotes] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [assignmentRefresh, setAssignmentRefresh] = useState(0);
  // Deep-link prefill — z URL hash #assign-<skillCode> (např. z reportu)
  const [prefillSkillCode, setPrefillSkillCode] = useState<string | null>(null);
  const [prefillForChildId, setPrefillForChildId] = useState<string | null>(null);
  const navigate = useNavigate();
  const t = useT();
  const { toast } = useToast();
  const { role } = useUserRole();

  // Read URL hash on mount + při změně URL — #assign-<skillCode> nebo #assign-<childId>:<skillCode>
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#assign-(.+)$/);
      if (!match) return;
      const value = decodeURIComponent(match[1]);
      // Format může být "skillCode" nebo "childId:skillCode"
      if (value.includes(":")) {
        const [cid, skill] = value.split(":");
        setPrefillForChildId(cid);
        setPrefillSkillCode(skill);
      } else {
        setPrefillSkillCode(value);
      }
    };
    parseHash();
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, []);

  const consumePrefill = () => {
    setPrefillSkillCode(null);
    setPrefillForChildId(null);
    // Vyčistit hash z URL bez reloadu
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  const startEdit = (child: Child) => {
    setEditingId(child.id);
    setEditName(child.child_name);
    setEditGrade(child.grade as Grade);
    setEditNotes(child.learning_notes ?? "");
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim()) return;
    setEditLoading(true);
    try {
      await updateChild(editingId, { child_name: editName.trim(), grade: editGrade, learning_notes: editNotes.trim() || null });
      setEditingId(null);
      toast({ description: t("parent.toast_child_updated") });
    } catch {
      toast({ description: t("parent.toast_error"), variant: "destructive" });
    }
    setEditLoading(false);
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAddLoading(true);
    try {
      await addChild(newName.trim(), newGrade, newNotes.trim());
      setNewName("");
      setNewNotes("");
      setShowAdd(false);
      toast({ description: t("parent.toast_child_added") });
    } catch {
      toast({ description: t("parent.toast_error"), variant: "destructive" });
    }
    setAddLoading(false);
  };

  const isExpired = (c: Child) => !c.is_paired && new Date(c.pairing_code_expires_at) < new Date();

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const avatarColors = [
    "bg-gradient-to-br from-primary/80 to-primary",
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-emerald-500 to-emerald-600",
    "bg-gradient-to-br from-orange-500 to-orange-600",
  ];

  return (
    <div className="min-h-screen bg-background" style={role === "admin" ? { paddingTop: "2.5rem" } : undefined}>
      {role === "admin" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between text-sm shadow-md">
          <span className="font-medium">👁 Náhled rodičovského pohledu</span>
          <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => navigate("/admin")}>
            ← Zpět do Adminu
          </Button>
        </div>
      )}

      {/* Hero section */}
      <header className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/10 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-4">
            <OlyLogo size="sm" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                {profile?.display_name ? t("parent.greeting").replace("{name}", profile.display_name) : t("parent.title")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{t("parent.subtitle")}</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => supabase.auth.signOut()}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t("parent.sign_out")}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-4 space-y-5">
        {loading && <p className="text-muted-foreground text-center py-8">{t("loading")}</p>}

        {children.map((child, idx) => (
          <Card key={child.id} className="overflow-hidden border-2 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              {/* Child header with avatar */}
              <div className="flex items-center gap-4 p-5 pb-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white shadow-sm ${avatarColors[idx % avatarColors.length]}`}>
                  {getInitial(child.child_name)}
                </div>

                {editingId === child.id ? (
                  <div className="flex-1 space-y-2">
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8" />
                    <Select value={String(editGrade)} onValueChange={(v) => setEditGrade(Number(v) as Grade)}>
                      <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {GRADES.map((g) => <SelectItem key={g} value={String(g)}>{g}. {t("parent.grade_label")}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Např. ADHD, dyslexie, potřebuje více času…"
                      className="min-h-[60px] text-xs"
                    />
                    <div className="flex gap-1">
                      <Button size="sm" onClick={handleSaveEdit} disabled={editLoading || !editName.trim()} className="gap-1">
                        <Check className="h-3 w-3" /> {t("parent.save")}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="gap-1">
                        <X className="h-3 w-3" /> {t("parent.cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-foreground truncate">{child.child_name}</p>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0" onClick={() => startEdit(child)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive shrink-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("parent.delete_confirm_title")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("parent.delete_confirm_description").replace("{name}", child.child_name)}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("parent.delete_confirm_no")}</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={async () => {
                                try {
                                  await deleteChild(child.id);
                                  toast({ description: t("parent.toast_child_deleted") });
                                } catch {
                                  toast({ description: t("parent.toast_error"), variant: "destructive" });
                                }
                              }}
                            >
                              {t("parent.delete_confirm_yes")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <p className="text-sm text-muted-foreground">{child.grade}. {t("parent.grade_label")}</p>
                  </div>
                )}

                {child.is_paired ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 gap-1 shrink-0">
                    <UserCheck className="h-3 w-3" /> {t("parent.paired")}
                  </Badge>
                ) : isExpired(child) ? (
                  <Badge variant="destructive" className="gap-1 shrink-0">
                    <Clock className="h-3 w-3" /> {t("parent.code_expired")}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1 shrink-0">
                    <Clock className="h-3 w-3" /> {t("parent.not_paired")}
                  </Badge>
                )}
              </div>

              {/* Activity stats + chart for paired children */}
              {child.is_paired && (
                <div className="px-5 pb-4 space-y-4">
                  {/* PRIMARY ACTIONS — nahoře, jasně viditelné */}
                  <div className="grid grid-cols-2 gap-2">
                    <AssignmentCreator
                      childId={child.id}
                      childName={child.child_name}
                      onCreated={() => setAssignmentRefresh(r => r + 1)}
                      prefillSkillCode={
                        prefillSkillCode &&
                        (!prefillForChildId || prefillForChildId === child.id)
                          ? prefillSkillCode
                          : null
                      }
                      onPrefillConsumed={consumePrefill}
                    />
                    <Button
                      variant="outline"
                      size="default"
                      className="gap-2 h-10 border-2 border-blue-200 bg-blue-50/60 hover:bg-blue-50 text-blue-900 hover:text-blue-900 font-medium"
                      onClick={() => navigate(`/report?child=${child.id}`)}
                    >
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <span>Ukázat hodnocení</span>
                    </Button>
                  </div>

                  {/* Týdenní status — hero karta */}
                  <ChildActivityBadge childId={child.id} />

                  {/* Úkoly */}
                  <AssignmentList childId={child.id} refreshKey={assignmentRefresh} />

                  {/* Detaily aktivity (collapsible) */}
                  <ChildActivityChart childId={child.id} />
                  <SelfPracticeList childId={child.id} />
                </div>
              )}

              {!child.is_paired && (
                <div className="mx-5 mb-5 rounded-lg border-2 border-dashed bg-muted/30 p-4 space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">{t("parent.pairing_code_label")}</p>
                  <p className="text-3xl font-mono font-bold tracking-[0.3em] text-primary">
                    {child.pairing_code}
                  </p>
                  {isExpired(child) && (
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => regenerateCode(child.id)}>
                      <RefreshCw className="h-3 w-3" /> {t("parent.regenerate_code")}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {showAdd ? (
          <Card className="border-2 border-dashed">
            <CardContent className="p-5 space-y-3">
              <div className="space-y-2">
                <Label>{t("onboarding.step2.child_name")}</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Péťa" />
              </div>
              <div className="space-y-2">
                <Label>{t("onboarding.step2.grade")}</Label>
                <Select value={String(newGrade)} onValueChange={(v) => setNewGrade(Number(v) as Grade)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => <SelectItem key={g} value={String(g)}>{g}. {t("parent.grade_label")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Poznámky k učení</Label>
                <Textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Např. ADHD, dyslexie, potřebuje více času…"
                  className="min-h-[60px] text-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} disabled={!newName.trim() || addLoading} className="flex-1">
                  {addLoading ? t("auth.loading") : t("parent.add_child")}
                </Button>
                <Button variant="outline" onClick={() => setShowAdd(false)}>{t("topic.back")}</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button variant="outline" className="w-full gap-2 border-dashed border-2 h-14 text-base" onClick={() => setShowAdd(true)}>
            <Plus className="h-5 w-5" /> {t("parent.add_child")}
          </Button>
        )}
      </main>
    </div>
  );
}
