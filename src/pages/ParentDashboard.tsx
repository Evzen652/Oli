import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useChildren, type Child } from "@/hooks/useChildren";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { LogOut, Plus, RefreshCw, Clock, Pencil, Check, X, Trash2, CheckCircle2, HelpCircle, Eye, ClipboardList, Activity, Target } from "lucide-react";
import { PaintedArrow } from "@/components/icons/PaintedArrow";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useT } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import type { Grade } from "@/lib/types";
import { ChildActivityBadge } from "@/components/ChildActivityBadge";
import { ChildActivityChart } from "@/components/ChildActivityChart";
import { FloatingStars } from "@/components/FloatingStars";
import { ChildMisconceptions } from "@/components/ChildMisconceptions";
import { AssignmentCreator } from "@/components/AssignmentCreator";
import { AssignmentList } from "@/components/AssignmentList";
import { ChildSessionLog } from "@/components/ChildSessionLog";
import { logoNoText } from "@/components/OliLogo";
import { BackButton } from "@/components/BackButton";
import { GradeSelectItems } from "@/components/GradeSelectItems";
import { cn } from "@/lib/utils";
import { ChildPinControl } from "@/components/parent/ChildPinControl";



import { pad as czPad } from "@/lib/czechGrammar";

function pluralDays(n: number) { return czPad(n, "DEN"); }

/**
 * Poznámky k učení — pole, které do 2026-09-04 nikam nevedlo.
 *
 * Rodič ho vyplnil při zakládání dítěte (placeholder „Např. ADHD, dyslexie…"),
 * hodnota se uložila do `children.learning_notes` — a tím to skončilo. Nikde se
 * nezobrazovala, editační formulář pro ni neměl pole (takže `editNotes` jen
 * recykloval starou hodnotu) a `grep` po `learning_notes` nenašel jediné místo,
 * které by ji četlo. Rodič psal do prázdna.
 *
 * Text pod polem proto říká na rovinu, že jde o poznámku pro rodiče —
 * dokud ji nečte ani AI hodnocení, nemá smysl budit dojem, že látku ovlivní.
 */
function LearningNotesField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-3 space-y-1.5">
      <Label className="text-xs text-muted-foreground">Poznámky k učení</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Např. ADHD, dyslexie…"
        className="min-h-[60px] text-sm rounded-xl"
      />
      <p className="text-caption text-muted-foreground">
        Poznámka jen pro vás — aplikace podle ní zatím cvičení nepřizpůsobuje.
      </p>
    </div>
  );
}

function LearningNotesDisplay({ notes, onEdit }: { notes: string | null; onEdit: () => void }) {
  if (!notes?.trim()) return null;
  return (
    <button
      type="button"
      onClick={onEdit}
      title="Upravit poznámky"
      className="mt-3 w-full text-left flex items-start gap-2 rounded-2xl border border-border bg-muted/30 px-4 py-2.5 hover:border-primary/40 hover:bg-muted/50 transition-colors"
    >
      <Pencil className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
      <span className="min-w-0">
        <span className="block text-caption font-bold uppercase tracking-wide text-muted-foreground">Poznámky k učení</span>
        <span className="block text-sm text-foreground leading-snug">{notes}</span>
      </span>
    </button>
  );
}







export default function ParentDashboard() {
  const { children, loading, addChild, regenerateCode, updateChild, deleteChild, refetch } = useChildren();
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
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [newAssignment, setNewAssignment] = useState<{ childId: string; skillId: string } | null>(null);
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
      const created = await addChild(newName.trim(), newGrade, newNotes.trim());
      // Přepnout na právě přidané dítě. Bez toho by rodič po přidání DRUHÉHO
      // dítěte viděl pořád to první — přepínač se zrovna objevil a nové dítě
      // by zůstalo schované, což vypadá, jako by se přidání nepovedlo.
      if (created?.id) setSelectedChildId(created.id);
      setNewName("");
      setNewNotes("");
      setShowAdd(false);
      toast({ description: t("parent.toast_child_added") });
    } catch {
      toast({ description: t("parent.toast_error"), variant: "destructive" });
    }
    setAddLoading(false);
  };

  const isExpired = (c: Child) => !c.is_paired && !!c.pairing_code_expires_at && new Date(c.pairing_code_expires_at) < new Date();

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  /** Plynulé sjetí na sekci — rychlá navigace z přehledu (bod c). */
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /**
   * Přepínač dětí (UX audit 2026-08-25).
   *
   * Dashboard renderoval sekce 3–6 uvnitř `children.map()`, takže se pro
   * KAŽDÉ dítě opakovaly celé: 1 dítě ≈ 2 100 px svislého scrollu, 3 děti
   * (plán „Rodinný") ≈ 6 000 px, a to bez jediné kotvy nebo tabu.
   * Od druhého dítěte se proto zobrazuje jen jedno naráz.
   * S jedním dítětem se nic nemění — přepínač by byl zbytečný.
   */
  const activeChildId = children.length > 1
    ? (children.some((c) => c.id === selectedChildId) ? selectedChildId : children[0]?.id ?? null)
    : null;

  const avatarColors = [
    "bg-gradient-to-br from-violet-500 to-violet-700",
    "bg-gradient-to-br from-emerald-500 to-emerald-700",
    "bg-gradient-to-br from-rose-500 to-rose-700",
    "bg-gradient-to-br from-amber-500 to-amber-700",
    "bg-gradient-to-br from-sky-500 to-sky-700",
  ];


  return (
    <div className="min-h-screen bg-[#fdf8f2]" style={role === "admin" ? { paddingTop: "2.5rem" } : undefined}>
      {role === "admin" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur text-primary-foreground px-5 py-2.5 flex items-center justify-between text-sm shadow-soft-2">
          <span className="font-medium inline-flex items-center gap-2"><Eye className="h-3.5 w-3.5" />Náhled rodičovského pohledu</span>
          <BackButton to="/admin" label="Zpět do Adminu" size="sm" />
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-10 space-y-5">


        {/* ── Greeting bar ── */}
        <div className="bg-card rounded-3xl px-6 py-5 flex flex-wrap items-center gap-4 shadow-e1 border border-border">
          <img src={logoNoText} alt="Oli" className="h-14 w-14 object-contain shrink-0" />
          {/* Bez vysvětlujícího odstavce. Stálo tu „Zde vidíte přehled
              procvičování vašeho dítěte — co zadáváte, jak mu to jde a na které
              chyby se vyplatí zaměřit", tedy výčet tří sekcí, které jsou hned
              pod tím vypsané a nadepsané. Rodič to čte při každé návštěvě
              a nikdy se z toho nedozví nic nového. */}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-xl sm:text-2xl text-foreground leading-tight">
              {t("parent.greeting")}
            </h1>
          </div>
          {(
            <>
              <Button variant="outline" size="sm" className="gap-1.5 rounded-full hidden sm:inline-flex" onClick={() => supabase.auth.signOut()}>
                <LogOut className="h-3.5 w-3.5" />{t("parent.sign_out")}
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden rounded-full" onClick={() => supabase.auth.signOut()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {loading && <p className="text-muted-foreground text-center py-8">{t("loading")}</p>}

        {/* ── Přepínač dětí — až od druhého dítěte ── */}
        {children.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 rounded-full border bg-card p-1.5 shadow-e1 w-fit">
            {children.map((child, idx) => {
              const active = child.id === activeChildId;
              return (
                <button
                  key={child.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedChildId(child.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <span className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-caption font-bold text-white",
                    avatarColors[idx % avatarColors.length],
                  )}>
                    {getInitial(child.child_name)}
                  </span>
                  {child.child_name}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Karta pro každé dítě — zobrazuje se jen aktivní ── */}
        {children.map((child, idx) => (
          activeChildId && child.id !== activeChildId ? null : (
          <div key={child.id} className="flex flex-col gap-5">


            {/* Jednosloupcový layout */}
            {child.is_paired ? (
              <>
              {/* Hero — přehled dítěte. Bílá karta s tenkým oranžovým akcentem,
                  ne plná oranžová plocha: bílý text na brandOrange měl kontrast
                  2,8:1 (WCAG fail) a působil „příliš oranžově". Barvu nese jen
                  horní proužek a ikony statistik. */}
              <div className="rounded-3xl border border-border bg-card shadow-e1 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary/40" />
                <div className="relative p-6 sm:p-7">
                  {/* Táž dekorace jako na hlavní kartě dítěte — rodič má poznat,
                      že je to stejná aplikace, kterou používá jeho dítě. */}
                  <FloatingStars />
                  {/* `relative z-10`: absolutně pozicované hvězdičky by se jinak
                      vykreslily NAD statickým obsahem karty a plavaly by přes text. */}
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <p className="text-caption font-bold tracking-[0.15em] text-muted-foreground">PŘEHLED DÍTĚTE</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <ChildPinControl child={child} onChanged={refetch} tone="icon" />
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground" onClick={() => startEdit(child)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("parent.delete_confirm_title")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("parent.delete_confirm_description").replace("{name}", child.child_name)}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("parent.delete_confirm_no")}</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async () => {
                              try { await deleteChild(child.id); toast({ description: t("parent.toast_child_deleted") }); }
                              catch { toast({ description: t("parent.toast_error"), variant: "destructive" }); }
                            }}>{t("parent.delete_confirm_yes")}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {editingId === child.id ? (
                    <>
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(); if (e.key === "Escape") setEditingId(null); }}
                        className="font-bold text-3xl leading-tight text-foreground bg-background border border-input rounded-xl px-3 py-1 w-full max-w-xs outline-none focus:ring-2 focus:ring-ring mt-1 mb-2"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <Select value={String(editGrade)} onValueChange={(v) => setEditGrade(Number(v) as Grade)}>
                          <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                          <SelectContent><GradeSelectItems /></SelectContent>
                        </Select>
                      </div>
                      <LearningNotesField value={editNotes} onChange={setEditNotes} />
                      <div className="flex items-center gap-2 mb-5 mt-3">
                        <Button size="sm" onClick={handleSaveEdit} disabled={editLoading || !editName.trim()} className="h-8 gap-1 rounded-full"><Check className="h-3 w-3" /> Uložit</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-8 gap-1 rounded-full"><X className="h-3 w-3" /> Zrušit</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="relative z-10 font-bold text-3xl leading-tight text-foreground mt-1">{child.child_name}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <p className="text-muted-foreground text-sm">{child.grade}. ročník · aktivní</p>
                        <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success-muted px-2.5 py-0.5 text-caption font-semibold text-success">
                          <CheckCircle2 className="h-3 w-3" />{t("parent.paired")}
                        </span>
                      </div>
                      <LearningNotesDisplay notes={child.learning_notes} onEdit={() => startEdit(child)} />
                    </>
                  )}

                  {/* Statistiky. Odstup drží tenhle obal, ne `mb-5` na řádku
                      s ročníkem — ten se totiž renderuje jen v jedné ze dvou
                      větví (čtení vs. editace) a poznámky mezi nimi jsou
                      volitelné. Když se odstup věší na sourozence, zmizí
                      pokaždé, když ten sourozenec zrovna není. */}
                  <div className="relative z-10 mt-5">
                    <ChildActivityBadge childId={child.id} compact />
                  </div>

                  {/* Denní rozpad těch tří čísel nad ním. Patří sem, ne do
                      „Samostatného procvičování" — graf počítá VŠECHNU aktivitu
                      včetně zadaných úkolů, takže pod tím nadpisem by tvrdil
                      něco jiného, než ukazuje. Vždy sbalený, ať přehled zůstane
                      krátký; detail si rozklikne, kdo ho chce. */}
                  {child.is_paired && (
                    <div className="mt-4">
                      <ChildActivityChart childId={child.id} />
                    </div>
                  )}

                  {/* Rychlá navigace do sekcí + hlavní akce. Bod (c): z přehledu
                      se rodič proklikne na všechny části stránky. */}
                  <div className="relative z-10 mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Kotvící pilulky nesou ikonu a tón CÍLOVÉ sekce — tytéž,
                        jaké má hlavička, na kterou skáčou (`ClipboardList`
                        primary, `Activity` success, `Target` warning). Nic
                        nového se nevymýšlí, jen se ta barva opakuje o dva
                        scrolly dřív, takže rodič pozná cíl dřív, než dočte text.

                        `bg-muted` místo `bg-card`: bílá zůstává plochou karty
                        a tlačítko se z ní zvedne jako objekt. Není to výjimka —
                        „Celá historie" i „Podrobné hodnocení" o pár řádků níž
                        tak vypadají odjakživa; bílé byly jen tyhle tři.
                        Navíc díky tomu může být hover SVĚTLEJŠÍ než klid
                        (accent #FFF3EA vs muted #F2F0EA), což na bílé nešlo.

                        `LIFT` (viz `ui/button.tsx`) je jediný pohyb povolený
                        v aplikaci; tyhle pilulky ho jako jediné neměly. */}
                    <div className="flex flex-wrap gap-2 flex-1">
                      <button type="button" onClick={() => scrollToSection("ukoly")} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3.5 py-1.5 text-sm font-semibold text-foreground shadow-e1 hover:border-primary/50 hover:bg-accent hover:shadow-e2 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] transition-all duration-150">
                        <ClipboardList className="h-3.5 w-3.5 text-primary" />
                        Zadané úkoly <PaintedArrow direction="down" className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button type="button" onClick={() => scrollToSection("procvicovani")} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3.5 py-1.5 text-sm font-semibold text-foreground shadow-e1 hover:border-primary/50 hover:bg-accent hover:shadow-e2 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] transition-all duration-150">
                        <Activity className="h-3.5 w-3.5 text-success" />
                        Procvičování <PaintedArrow direction="down" className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button type="button" onClick={() => scrollToSection("zamerit")} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3.5 py-1.5 text-sm font-semibold text-foreground shadow-e1 hover:border-primary/50 hover:bg-accent hover:shadow-e2 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] transition-all duration-150">
                        <Target className="h-3.5 w-3.5 text-warning" />
                        Na co se zaměřit <PaintedArrow direction="down" className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                    {editingId !== child.id && (
                      <div className="shrink-0 w-full sm:w-auto">
                        <AssignmentCreator
                          childId={child.id}
                          childName={child.child_name}
                          grade={child.grade as Grade}
                          onCreated={(skillId) => {
                            setAssignmentRefresh(r => r + 1);
                            setNewAssignment({ childId: child.id, skillId });
                            setTimeout(() => setNewAssignment(null), 60000);
                          }}
                          prefillSkillCode={prefillSkillCode && (!prefillForChildId || prefillForChildId === child.id) ? prefillSkillCode : null}
                          onPrefillConsumed={consumePrefill}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Zadané úkoly — full width */}
              <div id="ukoly" className="scroll-mt-6 bg-card rounded-3xl shadow-e1 border border-border flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary shrink-0"><ClipboardList className="h-4 w-4" /></span>
                    <h2 className="font-bold text-base text-foreground">Zadané úkoly</h2>
                  </div>
                  {/* Bez podtitulku. „Témata, která jste zadali k procvičení
                      (Tonda)." pod nadpisem „Zadané úkoly" je týž údaj podruhé,
                      a jméno dítěte nese celá karta. Nad prázdným seznamem to
                      byla dokonce třetí formulace — pod tím stojí „Zatím jste
                      nic nezadali" i návod, jak úkol zadat.
                      Podtitulek u „Samostatné procvičování" naopak zůstává:
                      ten vymezuje pojem (bez vašeho zadání), neopakuje fakt. */}
                </div>
                <div className="p-4">
                  <AssignmentList
                    childId={child.id}
                    childName={child.child_name}
                    refreshKey={assignmentRefresh}
                    highlightSkillId={newAssignment?.childId === child.id ? newAssignment.skillId : null}
                  />
                </div>
              </div>

              {/* Samostatné procvičování — full width */}
              <div id="procvicovani" className="scroll-mt-6 bg-card rounded-3xl shadow-e1 border border-border flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-border/60">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-success/10 text-success shrink-0"><Activity className="h-4 w-4" /></span>
                    <h2 className="flex-1 font-bold text-base text-foreground">Samostatné procvičování</h2>
                    {child.is_paired && (
                      <button
                        className="h-8 rounded-xl bg-muted border border-border text-foreground font-semibold flex items-center gap-1.5 px-3 hover:bg-muted/80 active:scale-[0.98] transition-all text-xs shrink-0"
                        onClick={() => navigate(`/session-history/${child.id}`)}
                      >
                        Celá historie
                        <PaintedArrow className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Co {child.child_name} procvičoval/a sám/a, bez vašeho zadání.</p>
                </div>
                <div className="px-4 pb-4">
                  <ChildSessionLog
                    childId={child.id}
                    childName={child.child_name}
                    grade={child.grade}
                  />
                </div>
              </div>

              {/* Na co se zaměřit — full width */}
              <div id="zamerit" className="scroll-mt-6 bg-card rounded-3xl shadow-e1 border border-border flex flex-col overflow-hidden">
                {/* Tlačítko na vlastní řádek do `sm` — jinak jako `shrink-0`
                    nechá podtitulku ani ne sto pixelů a ta se vysází do úzkého
                    sloupce. Ikona zůstává u nadpisu. */}
                <div className="px-5 py-4 border-b border-border/60 flex flex-col items-start gap-2.5 sm:flex-row sm:items-center">
                  <div className="flex flex-1 min-w-0 items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-warning/10 text-warning shrink-0"><Target className="h-4 w-4" /></span>
                    <div className="min-w-0">
                      <h2 className="font-bold text-base text-foreground">Na co se zaměřit</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Opakující se chyby z posledních cvičení, na které stojí za to reagovat.</p>
                    </div>
                  </div>
                  <button
                    className="h-8 rounded-xl bg-muted border border-border text-foreground font-semibold flex items-center gap-1.5 px-3 hover:bg-muted/80 active:scale-[0.98] transition-all text-xs shrink-0"
                    onClick={() => navigate(`/report?child=${child.id}`)}
                  >
                    Podrobné hodnocení
                    <PaintedArrow className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="p-4">
                  <ChildMisconceptions childId={child.id} childName={child.child_name} />
                </div>
              </div>
              </>
            ) : (
              /* Nepropojené dítě — jednoduchá karta */
              <div className="bg-card rounded-3xl shadow-e1 border border-border p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white shrink-0 ${avatarColors[idx % avatarColors.length]}`}>
                    {getInitial(editingId === child.id ? editName : child.child_name)}
                  </div>
                  {editingId === child.id ? (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(); if (e.key === "Escape") setEditingId(null); }}
                          className="h-8 w-36 font-bold text-base"
                        />
                        <Select value={String(editGrade)} onValueChange={(v) => setEditGrade(Number(v) as Grade)}>
                          <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
                          <SelectContent><GradeSelectItems /></SelectContent>
                        </Select>
                        <Button size="sm" onClick={handleSaveEdit} disabled={editLoading || !editName.trim()} className="h-8 gap-1"><Check className="h-3 w-3" /> Uložit</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-8"><X className="h-3 w-3" /></Button>
                      </div>
                      <LearningNotesField value={editNotes} onChange={setEditNotes} />
                    </div>
                  ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-lg text-foreground">{child.child_name}</span>
                    <span className="text-sm text-muted-foreground">· {child.grade}. {t("parent.grade_label")}</span>
                    {isExpired(child)
                      ? <Badge variant="danger" className="gap-1"><Clock className="h-3 w-3" />{t("parent.code_expired")}</Badge>
                      : <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" />{t("parent.not_paired")}</Badge>}
                    {<Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground" onClick={() => startEdit(child)}><Pencil className="h-3 w-3" /></Button>}
                    {(
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-destructive hover:bg-destructive-muted"><Trash2 className="h-3 w-3" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("parent.delete_confirm_title")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("parent.delete_confirm_description").replace("{name}", child.child_name)}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("parent.delete_confirm_no")}</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async () => {
                              try { await deleteChild(child.id); toast({ description: t("parent.toast_child_deleted") }); }
                              catch { toast({ description: t("parent.toast_error"), variant: "destructive" }); }
                            }}>{t("parent.delete_confirm_yes")}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  )}
                </div>
                {editingId !== child.id && (
                  <LearningNotesDisplay notes={child.learning_notes} onEdit={() => startEdit(child)} />
                )}
                <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-center">
                  <p className="text-caption font-bold uppercase tracking-[0.16em] text-amber-700">{t("parent.pairing_code_label")}</p>
                  <div className="mt-3 flex items-center justify-center gap-3">
                    {(child.pairing_code ?? "").split("").map((ch, i) => (
                      <span key={i} className="font-bold text-3xl text-primary tabular-nums">{ch}</span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-warning">Zadej kód v aplikaci na zařízení dítěte. Kód platí 48 hodin.</p>
                  {isExpired(child) && (
                    <Button variant="warning" size="sm" className="mt-3 gap-1 rounded-full" onClick={() => regenerateCode(child.id)}>
                      <RefreshCw className="h-3 w-3" />{t("parent.regenerate_code")}
                    </Button>
                  )}
                </div>
                {(
                  <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-violet-200 bg-violet-50/50 p-4 text-center">
                    <ChildPinControl child={child} onChanged={refetch} />
                    <p className="text-xs text-muted-foreground max-w-xs">{t("parent.pin.hint_unpaired")}</p>
                  </div>
                )}
                <div className="flex items-start gap-3 rounded-2xl bg-muted/40 p-4 border border-border">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary shrink-0"><HelpCircle className="h-4 w-4" /></span>
                  <div>
                    <p className="text-sm font-semibold">Jak propojit?</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Otevři Oli na tabletu nebo telefonu, který používá {child.child_name}, a zadej kód výše.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          )
        ))}

        {/* ── Přidat dítě ── */}
        {showAdd ? (
          <div className="bg-card rounded-3xl border-2 border-dashed border-border shadow-e1 p-6 space-y-4">
            <div className="space-y-2"><Label>{t("onboarding.step2.child_name")}</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Péťa" className="rounded-xl" /></div>
            <div className="space-y-2">
              <Label>{t("onboarding.step2.grade")}</Label>
              <Select value={String(newGrade)} onValueChange={(v) => setNewGrade(Number(v) as Grade)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent><GradeSelectItems label={t("parent.grade_label")} /></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Poznámky k učení</Label><Textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Např. ADHD, dyslexie…" className="min-h-[60px] text-xs rounded-xl" /></div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!newName.trim() || addLoading} className="flex-1 rounded-xl">{addLoading ? t("auth.loading") : t("parent.add_child")}</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)} className="rounded-xl">{t("topic.back")}</Button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAdd(true)} className="w-full rounded-3xl border-2 border-dashed border-border bg-card/60 hover:bg-card hover:border-primary/40 transition-all py-10 px-4 text-center group">
            <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform"><Plus className="h-5 w-5" /></span>
            <p className="mt-3 font-bold text-foreground">{t("parent.add_child")}</p>
            <p className="mt-1 text-sm text-muted-foreground">Každé dítě má vlastní profil, kód a pokrok.</p>
          </button>
        )}

      </main>
    </div>
  );
}
