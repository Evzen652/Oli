import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCurriculumTable } from "@/hooks/useCurriculumTable";
import { AdminLayout, toSlug } from "@/components/AdminLayout";
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

interface Topic {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

interface AncestorInfo {
  categoryName: string;
  subjectName: string;
  subjectId: string;
}

function useAncestors(categoryId: string | undefined) {
  const [info, setInfo] = useState<AncestorInfo | null>(null);
  useEffect(() => {
    if (!categoryId) return;
    (supabase as any)
      .from("curriculum_categories")
      .select("name, subject_id, curriculum_subjects(name)")
      .eq("id", categoryId)
      .single()
      .then(({ data }: any) => {
        if (data) {
          setInfo({
            categoryName: data.name,
            subjectName: data.curriculum_subjects?.name || "…",
            subjectId: data.subject_id,
          });
        }
      });
  }, [categoryId]);
  return info;
}

export default function AdminTopics() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const ancestors = useAncestors(categoryId);
  const { items, loading, add, update, remove } = useCurriculumTable<Topic>(
    "curriculum_topics", "category_id", categoryId
  );
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const t = useT();
  const { toast } = useToast();

  const resetForm = () => { setShowForm(false); setEditId(null); setName(""); setDescription(""); };

  const startEdit = (item: Topic) => {
    setEditId(item.id); setName(item.name); setDescription(item.description || ""); setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      const data = {
        name: name.trim(), slug: toSlug(name.trim()),
        description: description || null, category_id: categoryId,
        sort_order: editId ? undefined : items.length,
      };
      if (editId) await update(editId, data);
      else await add(data as any);
      resetForm();
    } catch { toast({ description: "Něco se pokazilo.", variant: "destructive" }); }
  };

  return (
    <AdminLayout breadcrumbs={[
      { label: ancestors?.subjectName || "…", path: "/admin" },
      { label: ancestors?.categoryName || "…", path: ancestors ? `/admin/subject/${ancestors.subjectId}` : undefined },
      { label: "Témata" },
    ]}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Témata v okruhu „{ancestors?.categoryName || "…"}"</h2>
        {!showForm && <Button size="sm" onClick={() => setShowForm(true)} className="gap-1"><Plus className="h-4 w-4" /> Přidat téma</Button>}
      </div>

      {loading && <p className="text-muted-foreground text-center">{t("loading")}</p>}

      {showForm && (
        <Card className="border-2 border-dashed border-primary/30">
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1">
              <Label>Název tématu</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="např. Sčítání a odčítání" autoFocus />
            </div>
            <div className="space-y-1">
              <Label>Popis <span className="text-muted-foreground text-xs">(nepovinný)</span></Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Co se v tomto tématu procvičuje" className="min-h-[60px]" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!name.trim()}>{editId ? "Uložit" : "Přidat"}</Button>
              <Button variant="outline" onClick={resetForm}>Zrušit</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {items.length === 0 && !loading && <p className="text-muted-foreground text-center py-8">Zatím žádná témata.</p>}

      {items.map((item) => (
        <Card key={item.id} className="border hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate(`/admin/topic/${item.id}`)}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{item.name}</p>
              {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
            </div>
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => startEdit(item)}><Pencil className="h-3 w-3" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive"><Trash2 className="h-3 w-3" /></Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Opravdu smazat „{item.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>Smaže se téma i všechna jeho podtémata.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Ne</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => remove(item.id)}>Ano, smazat</AlertDialogAction>
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
