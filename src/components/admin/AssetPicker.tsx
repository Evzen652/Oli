import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon, Sparkles, Loader2, Check, Search, X } from "lucide-react";

interface Asset {
  id: string;
  url: string;
  alt_text: string;
  generation_prompt: string | null;
  tags: string[];
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface Props {
  /** Volitelný skill_id pro filter assets per podtéma */
  skillId?: string;
  /** Když uživatel vybere asset, zavolá se s ID + URL */
  onSelect?: (asset: { id: string; url: string; alt_text: string }) => void;
  /** Render trigger button vlastní (default: outline button "Vybrat obrázek") */
  trigger?: React.ReactNode;
}

/**
 * AssetPicker — admin sheet pro browse/generate/select obrázků z exercise_assets knihovny.
 *
 * Tři módy:
 *   • Browse: grid existujících obrázků (filtr podle tagu / skill / status)
 *   • Generate: prompt input → volá generate-image edge fn → automaticky
 *     se přidá do knihovny (status=pending)
 *   • Select: kliknutí na obrázek → onSelect callback + close sheet
 *
 * Status workflow stejně jako u custom_exercises: AI generuje pending,
 * admin schvaluje, žák vidí jen approved.
 */
export function AssetPicker({ skillId, onSelect, trigger }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"approved" | "pending" | "all">("approved");

  // Generate mode
  const [genPrompt, setGenPrompt] = useState("");
  const [genTags, setGenTags] = useState("");
  const [generating, setGenerating] = useState(false);

  const fetchAssets = async () => {
    setLoading(true);
    let q = (supabase as any)
      .from("exercise_assets")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(60);
    if (skillId) q = q.eq("skill_id", skillId);
    if (statusFilter !== "all") q = q.eq("status", statusFilter);
    if (search.trim()) {
      // Hledej v alt_text NEBO tags
      q = q.or(`alt_text.ilike.%${search.trim()}%,tags.cs.{${search.trim()}}`);
    }
    const { data } = await q;
    setAssets(((data as Asset[] | null) ?? []));
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, statusFilter, skillId]);

  const handleGenerate = async () => {
    if (!genPrompt.trim()) return;
    setGenerating(true);
    try {
      const tags = genTags.split(",").map((t) => t.trim()).filter(Boolean);
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: {
          prompt: genPrompt.trim(),
          skill_id: skillId,
          tags,
          alt_text: genPrompt.trim().slice(0, 100),
        },
      });
      if (error) throw error;
      toast({ description: "Obrázek vygenerován ✓ (status: pending — schvalte v knihovně)" });
      setGenPrompt("");
      setGenTags("");
      // Re-fetch — nový asset se objeví na začátku
      setStatusFilter("pending");
      await fetchAssets();
      // Pokud je callback, hned vyber nový asset
      if (data?.url && data?.asset_id && onSelect) {
        onSelect({ id: data.asset_id, url: data.url, alt_text: genPrompt.trim().slice(0, 100) });
        setOpen(false);
      }
    } catch (e: any) {
      toast({
        description: e?.message ?? "Generování selhalo. Zkontrolujte LOVABLE_API_KEY nebo OPENAI_API_KEY v Supabase secrets.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async (id: string) => {
    const { error } = await (supabase as any)
      .from("exercise_assets")
      .update({ status: "approved" })
      .eq("id", id);
    if (error) {
      toast({ description: "Schválení selhalo.", variant: "destructive" });
      return;
    }
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a)));
    toast({ description: "Obrázek schválen ✓" });
  };

  const handleReject = async (id: string) => {
    const { error } = await (supabase as any)
      .from("exercise_assets")
      .update({ status: "rejected" })
      .eq("id", id);
    if (error) {
      toast({ description: "Odmítnutí selhalo.", variant: "destructive" });
      return;
    }
    setAssets((prev) => prev.filter((a) => a.id !== id));
    toast({ description: "Obrázek odmítnut" });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
            <ImageIcon className="h-3.5 w-3.5" />
            Vybrat obrázek
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0 bg-background">
        <SheetHeader className="p-5 pb-3 border-b border-border bg-card">
          <SheetTitle className="font-display flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Knihovna obrázků
          </SheetTitle>
        </SheetHeader>

        {/* Generate mode */}
        <div className="border-b border-border bg-muted/30 p-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Vygenerovat AI obrázek
          </p>
          <Textarea
            value={genPrompt}
            onChange={(e) => setGenPrompt(e.target.value)}
            placeholder="Popis: 'rostlina s kořenem, stonkem, listy a květem na bílém pozadí, dětský styl'"
            rows={2}
            className="resize-none rounded-xl border-border bg-card text-sm"
          />
          <div className="flex gap-2">
            <Input
              value={genTags}
              onChange={(e) => setGenTags(e.target.value)}
              placeholder="tagy oddělené čárkou: prvouka, rostlina, biologie"
              className="flex-1 rounded-xl text-sm"
            />
            <Button
              onClick={handleGenerate}
              disabled={!genPrompt.trim() || generating}
              className="rounded-xl gap-1.5 shadow-soft-2"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? "Generuji…" : "Vygenerovat"}
            </Button>
          </div>
        </div>

        {/* Browse: search + status filter */}
        <div className="border-b border-border p-4 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") fetchAssets(); }}
              placeholder="Hledat alt text / tag…"
              className="pl-9 h-9 rounded-xl text-sm"
            />
          </div>
          <div className="flex gap-1.5">
            {(["approved", "pending", "all"] as const).map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(s)}
                className="h-7 px-3 text-xs rounded-full"
              >
                {s === "approved" ? "Schválené" : s === "pending" ? "Čekající" : "Všechny"}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Žádné obrázky. Vygenerujte první přes pole nahoře.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {assets.map((a) => (
                <div key={a.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (a.status !== "approved") {
                        toast({ description: "Asset musí být schválený, aby ho šlo použít." });
                        return;
                      }
                      onSelect?.({ id: a.id, url: a.url, alt_text: a.alt_text });
                      setOpen(false);
                    }}
                    className="block w-full aspect-square overflow-hidden bg-muted hover:opacity-90 transition-opacity"
                    title={a.alt_text}
                  >
                    <img src={a.url} alt={a.alt_text} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                  <div className="p-2 space-y-1.5">
                    <p className="text-[11px] text-foreground/80 line-clamp-2 leading-tight" title={a.alt_text}>
                      {a.alt_text}
                    </p>
                    {a.status === "pending" && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(a.id)}
                          className="flex-1 h-7 text-[11px] gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Check className="h-3 w-3" /> Schválit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReject(a.id)}
                          className="h-7 px-2 text-[11px] rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    {a.status === "approved" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                        <Check className="h-2.5 w-2.5" /> Schváleno
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
