import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCurriculumTable } from "@/hooks/useCurriculumTable";
import { AdminLayout, useParentName, toSlug } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ChevronRight } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface Category {
  id: string;
  subject_id: string;
  name: string;
  slug: string;
  description: string | null;
  fun_fact: string | null;
  sort_order: number;
}

export default function AdminCategories() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const subjectName = useParentName("curriculum_subjects", subjectId);
  const { items, loading, add, update, remove } = useCurriculumTable<Category>(
    "curriculum_categories", "subject_id", subjectId
  );
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [funFact, setFunFact] = useState("");
  const navigate = useNavigate();
  const t = useT();
  const { toast } = useToast();

  const resetForm = () => { setShowForm(false); setEditId(null); setName(""); setDescription(""); setFunFact(""); };

  const startEdit = (c: Category) => {
    setEditId(c.id); setName(c.name); setDescription(c.description || ""); setFunFact(c.fun_fact || ""); setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      const data = {
        name: name.trim(), slug: toSlug(name.trim()),
        description: description || null, fun_fact: funFact || null, subject_id: subjectId,
        sort_order: editId ? undefined : items.length,
      };
      if (editId) await update(editId, data);
      else await add(data as any);
      resetForm();
    } catch {
      toast({ description: "Něco se pokazilo.", variant: "destructive" });
    }
  };

  return (
    <AdminLayout breadcrumbs={[
      { label: subjectName || "…", path: "/admin" },
      { label: "Okruhy" },
    ]}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Okruhy v předmětu „{subjectName || "…"}"</h2>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)} className="gap-1">
            <Plus className="h-4 w-4" /> Přidat okruh
          </Button>
        )}
      </div>

      {loading && <p className="text-muted-foreground text-center">{t("loading")}</p>}

      {showForm && (
        <Card className="border-2 border-dashed border-primary/30">
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1">
              <Label>Název okruhu</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="např. Zlomky" autoFocus />
            </div>
            <div className="space-y-1">
              <Label>Popis <span className="text-muted-foreground text-xs">(nepovinný)</span></Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Stručný popis, co okruh obsahuje" className="min-h-[60px]" />
            </div>
            <div className="space-y-1">
              <Label>Zajímavost <span className="text-muted-foreground text-xs">(nepovinná)</span></Label>
              <Textarea value={funFact} onChange={(e) => setFunFact(e.target.value)} placeholder="Věděl/a jsi, že…" className="min-h-[60px]" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!name.trim()}>
                {editId ? "Uložit" : "Přidat"}
              </Button>
              <Button variant="outline" onClick={resetForm}>Zrušit</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {items.length === 0 && !loading && <p className="text-muted-foreground text-center py-8">Zatím žádné okruhy.</p>}

      {items.map((c) => (
        <Card key={c.id} className="border hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate(`/admin/category/${c.id}`)}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{c.name}</p>
              {c.description && <p className="text-xs text-muted-foreground">{c.description}</p>}
              {c.fun_fact && <p className="text-xs text-muted-foreground italic">💡 {c.fun_fact}</p>}
            </div>
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => startEdit(c)}>
                <Pencil className="h-3 w-3" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Opravdu smazat „{c.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>Smaže se okruh i všechna jeho témata a podtémata.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Ne</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => remove(c.id)}>Ano, smazat</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ))}
    </AdminLayout>
  );
}
