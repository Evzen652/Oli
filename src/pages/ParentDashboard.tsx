import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useChildren, isPaired, type Child } from "@/hooks/useChildren";
import { useProfile } from "@/hooks/useProfile";
import { useChildStats } from "@/hooks/useChildStats";
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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LogOut, Plus, RefreshCw, UserCheck, Clock, BarChart3, Pencil, Trash2, History, ClipboardList, ChevronDown, Settings, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useT } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import type { Grade } from "@/lib/types";
import { ChildActivityChart } from "@/components/ChildActivityChart";
import { AssignmentCreator } from "@/components/AssignmentCreator";
import { AssignmentList } from "@/components/AssignmentList";
import { SelfPracticeList } from "@/components/SelfPracticeList";
import { OlyLogo } from "@/components/OlyLogo";

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// ── Status Card ──────────────────────────────────
function ChildStatusCard({ child }: { child: Child }) {
  const stats = useChildStats(child.id);
  const t = useT();

  if (stats.loading) {
    return <div className="h-20 animate-pulse bg-muted rounded-xl" />;
  }

  if (stats.tasks === 0) {
    return (
      <Card className="border-2 border-dashed rounded-xl bg-muted/20">
        <CardContent className="p-5 text-center">
          <p className="text-muted-foreground">{t("parent.stats_no_activity")}</p>
        </CardContent>
      </Card>
    );
  }

  const statusColor = stats.accuracy >= 80
    ? "from-green-50 to-emerald-50 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-800"
    : stats.accuracy >= 50
    ? "from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-800"
    : "from-red-50 to-rose-50 border-red-200 dark:from-red-950/30 dark:to-rose-950/30 dark:border-red-800";

  const statusEmoji = stats.accuracy >= 80 ? "🌟" : stats.accuracy >= 50 ? "💪" : "🌱";
  const statusText = stats.accuracy >= 80
    ? t("parent.summary_great")
    : stats.accuracy >= 50
    ? t("parent.summary_good")
    : t("parent.summary_weak");

  const TrendIcon = stats.accuracy >= 80 ? TrendingUp : stats.accuracy >= 50 ? Minus : TrendingDown;

  return (
    <Card className={`border-2 rounded-xl bg-gradient-to-r ${statusColor}`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{statusEmoji}</span>
              <p className="font-semibold text-foreground">{statusText}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("parent.summary_sentence")
                .replace("{tasks}", String(stats.tasks))
                .replace("{sessions}", String(stats.sessions))}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <TrendIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-3xl font-bold text-foreground">{stats.accuracy}%</span>
            </div>
            <p className="text-xs text-muted-foreground">{t("parent.stats_accuracy")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Edit Child Dialog ──────────────────────────────────
function EditChildDialog({ child, onSave }: { child: Child; onSave: (updates: { name?: string; grade?: number; learning_notes?: string | null }) => Promise<void> }) {
  const [name, setName] = useState(child.child_name);
  const [grade, setGrade] = useState<Grade>(child.grade as Grade);
  const [notes, setNotes] = useState(child.learning_notes ?? "");
  const [saving, setSaving] = useState(false);
  const t = useT();

  const handleSave = async () => {
    setSaving(true);
    await onSave({ child_name: name.trim(), grade, learning_notes: notes.trim() || null });
    setSaving(false);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("parent.edit_child")} — {child.child_name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>{t("onboarding.step2.child_name")}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>{t("onboarding.step2.grade")}</Label>
          <Select value={String(grade)} onValueChange={(v) => setGrade(Number(v) as Grade)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {GRADES.map((g) => <SelectItem key={g} value={String(g)}>{g}. {t("parent.grade_label")}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Poznamky k uceni</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Napr. potrebuje vice casu, ADHD..." className="min-h-[80px]" />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">{t("parent.cancel")}</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>{t("parent.save")}</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

// ── Child Panel (content for selected tab) ──────────────────
function ChildPanel({ child, onUpdate, onDelete, onRegenerate, assignmentRefresh, onAssignmentCreated }: {
  child: Child;
  onUpdate: (id: string, u: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRegenerate: (id: string) => Promise<void>;
  assignmentRefresh: number;
  onAssignmentCreated: () => void;
}) {
  const navigate = useNavigate();
  const t = useT();
  const { toast } = useToast();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="space-y-5">
      {/* Status card — visual summary */}
      <ChildStatusCard child={child} />

      {/* Main action buttons — prominent */}
      <div className="grid grid-cols-2 gap-3">
        <AssignmentCreator childId={child.id} childName={child.child_name} onCreated={onAssignmentCreated} />
        <Button variant="outline" className="gap-2 h-11" onClick={() => navigate(`/report?child=${child.id}`)}>
          <BarChart3 className="h-4 w-4" />
          {t("parent.report")}
        </Button>
      </div>

      {/* Activity chart */}
      {isPaired(child) && (
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">{t("parent.chart_title")}</h3>
            <ChildActivityChart childId={child.id} />
          </CardContent>
        </Card>
      )}

      {/* Assignments */}
      <Card className="rounded-xl">
        <CardContent className="p-5">
          <AssignmentList childId={child.id} refreshKey={assignmentRefresh} />
        </CardContent>
      </Card>

      {/* Self practice */}
      {isPaired(child) && (
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <SelfPracticeList childId={child.id} />
          </CardContent>
        </Card>
      )}

      {/* History link */}
      <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={() => navigate(`/session-history/${child.id}`)}>
        <History className="h-4 w-4" />
        {t("parent.history")}
      </Button>

      {/* Settings — collapsible at bottom */}
      <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full gap-2 text-muted-foreground justify-between">
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Nastaveni ditete
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${settingsOpen ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="rounded-xl mt-2">
            <CardContent className="p-5 space-y-4">
              {/* Pairing status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Stav propojeni</span>
                {isPaired(child) ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                    <UserCheck className="h-3 w-3" /> {t("parent.paired")}
                  </Badge>
                ) : (
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-mono font-bold tracking-[0.3em] text-primary">
                      {child.pairing_code || "—"}
                    </p>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => onRegenerate(child.id)}>
                      <RefreshCw className="h-3 w-3" /> {t("parent.regenerate_code")}
                    </Button>
                  </div>
                )}
              </div>

              {/* Edit + Delete */}
              <div className="flex gap-2 pt-2 border-t">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Pencil className="h-3.5 w-3.5" /> {t("parent.edit_child")}
                    </Button>
                  </DialogTrigger>
                  <EditChildDialog
                    child={child}
                    onSave={async (updates) => {
                      await onUpdate(child.id, updates);
                      toast({ description: t("parent.toast_child_updated") });
                    }}
                  />
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" /> {t("parent.delete_child")}
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
                          await onDelete(child.id);
                          toast({ description: t("parent.toast_child_deleted") });
                        }}
                      >
                        {t("parent.delete_confirm_yes")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────
export default function ParentDashboard() {
  const { children, loading, addChild, regenerateCode, updateChild, deleteChild } = useChildren();
  const { profile } = useProfile();
  const [activeChildIdx, setActiveChildIdx] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState<Grade>(3);
  const [newNotes, setNewNotes] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [assignmentRefresh, setAssignmentRefresh] = useState(0);
  const navigate = useNavigate();
  const t = useT();
  const { toast } = useToast();
  const { role } = useUserRole();

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

  const avatarColors = [
    "bg-gradient-to-br from-primary/80 to-primary",
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-emerald-500 to-emerald-600",
    "bg-gradient-to-br from-orange-500 to-orange-600",
  ];

  const activeChild = children[activeChildIdx] ?? null;

  return (
    <div className="min-h-screen bg-background" style={role === "admin" ? { paddingTop: "2.5rem" } : undefined}>
      {role === "admin" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between text-sm shadow-md">
          <span className="font-medium">👁 Nahled rodicovskeho pohledu</span>
          <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => navigate("/admin")}>
            ← Zpet do Adminu
          </Button>
        </div>
      )}

      {/* Header */}
      <header className="border-b bg-gradient-to-br from-primary/5 via-background to-accent/10 px-4 py-6">
        <div className="mx-auto max-w-2xl flex items-center gap-4">
          <OlyLogo size="sm" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {profile?.display_name ? t("parent.greeting").replace("{name}", profile.display_name) : t("parent.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">{t("parent.subtitle")}</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => supabase.auth.signOut()}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-4 space-y-5">
        {loading && <div className="h-40 animate-pulse bg-muted rounded-xl" />}

        {/* Child tabs */}
        {children.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {children.map((child, idx) => (
              <button
                key={child.id}
                onClick={() => setActiveChildIdx(idx)}
                className={`
                  flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap
                  ${idx === activeChildIdx
                    ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                    : "bg-card border-2 hover:border-primary/30 text-foreground"
                  }
                `}
              >
                <div className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold
                  ${idx === activeChildIdx ? "bg-primary-foreground/20 text-primary-foreground" : `${avatarColors[idx % avatarColors.length]} text-white`}
                `}>
                  {child.child_name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm leading-tight">{child.child_name}</p>
                  <p className={`text-xs leading-tight ${idx === activeChildIdx ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {child.grade}. {t("parent.grade_label")}
                  </p>
                </div>
              </button>
            ))}
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-dashed text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">Pridat</span>
            </button>
          </div>
        )}

        {/* Active child panel */}
        {activeChild && (
          <ChildPanel
            child={activeChild}
            onUpdate={updateChild}
            onDelete={async (id) => {
              await deleteChild(id);
              setActiveChildIdx(0);
            }}
            onRegenerate={regenerateCode}
            assignmentRefresh={assignmentRefresh}
            onAssignmentCreated={() => setAssignmentRefresh(r => r + 1)}
          />
        )}

        {/* Add child form (when no children or button clicked) */}
        {(showAdd || children.length === 0) && (
          <Card className="border-2 border-dashed rounded-xl">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">{t("parent.add_child")}</h3>
              <div className="space-y-2">
                <Label>{t("onboarding.step2.child_name")}</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Peta" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>{t("onboarding.step2.grade")}</Label>
                <Select value={String(newGrade)} onValueChange={(v) => setNewGrade(Number(v) as Grade)}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => <SelectItem key={g} value={String(g)}>{g}. {t("parent.grade_label")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Poznamky k uceni (nepovinne)</Label>
                <Textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Napr. potrebuje vice casu..." className="min-h-[70px]" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} disabled={!newName.trim() || addLoading} className="flex-1 h-11">
                  {addLoading ? "Pridavam..." : t("parent.add_child")}
                </Button>
                {children.length > 0 && (
                  <Button variant="outline" className="h-11" onClick={() => setShowAdd(false)}>Zrusit</Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
