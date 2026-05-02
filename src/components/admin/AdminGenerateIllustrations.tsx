import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon, Loader2, Play, CheckCircle2, AlertTriangle, RefreshCw, LayoutGrid, Wand2 } from "lucide-react";

const KEY_GROUPS: { label: string; emoji: string; keys: string[] }[] = [
  {
    label: "Předměty",
    emoji: "📚",
    keys: ["subject-matematika", "subject-cestina", "subject-prvouka", "subject-prirodoveda", "subject-vlastiveda"],
  },
  {
    label: "Matematika — okruhy",
    emoji: "🔢",
    keys: ["cat-math-cisla-a-operace", "cat-math-zlomky", "cat-math-geometrie"],
  },
  {
    label: "Matematika — témata",
    emoji: "✖️",
    keys: [
      "topic-math-porovnavani-prirozenych-cisel",
      "topic-math-scitani-a-odcitani-do-100",
      "topic-math-nasobeni-a-deleni",
      "topic-math-zaokrouhlovani",
      "topic-math-razeni-cisel",
      "topic-math-porovnavani-zlomku",
      "topic-math-kraceni-zlomku",
      "topic-math-rozsireni-zlomku",
      "topic-math-scitani-zlomku",
      "topic-math-odcitani-zlomku",
      "topic-math-smisena-cisla",
      "topic-math-zlomek-z-cisla",
      "topic-math-nasobeni-zlomku-celym-cislem",
      "topic-math-geometricke-tvary",
      "topic-math-obvod",
      "topic-math-mereni-delky",
      "topic-math-zakladni-jednotky",
      "topic-math-prevody-jednotek",
      "topic-math-odhad-delek",
      "topic-math-jednotky-hmotnosti",
      "topic-math-slovni-ulohy-delky",
      "topic-math-objem-ml-l",
    ],
  },
  {
    label: "Čeština — okruhy",
    emoji: "📝",
    keys: ["cat-cz-vyjmenovana-slova", "cat-cz-pravopis", "cat-cz-mluvnice", "cat-cz-diktat", "cat-cz-sloh"],
  },
  {
    label: "Čeština — témata",
    emoji: "📖",
    keys: [
      "topic-cz-vyjm-b", "topic-cz-vyjm-l", "topic-cz-vyjm-m", "topic-cz-vyjm-p",
      "topic-cz-vyjm-s", "topic-cz-vyjm-v", "topic-cz-vyjm-z",
      "topic-cz-parove-souhlasky", "topic-cz-tvrde-mekke", "topic-cz-velka-pismena",
      "topic-cz-slovni-druhy", "topic-cz-rod-cislo", "topic-cz-slovesa-urcovani",
      "topic-cz-zaklad-vety", "topic-cz-diktat", "topic-cz-sloh-vypraveni", "topic-cz-sloh-popis",
    ],
  },
  {
    label: "Prvouka — okruhy",
    emoji: "🌍",
    keys: ["cat-clovek-a-jeho-telo", "cat-priroda-kolem-nas", "cat-lide-a-spolecnost", "cat-orientace-v-prostoru-a-case"],
  },
  {
    label: "Prvouka — témata",
    emoji: "🌱",
    keys: [
      "topic-lidske-telo", "topic-smysly", "topic-zdravi-a-hygiena",
      "topic-rostliny", "topic-zvirata", "topic-rocni-obdobi-a-pocasi",
      "topic-nase-zeme", "topic-rodina-a-spolecnost", "topic-rodina-a-pravidla-chovani",
      "topic-obec-a-mesto", "topic-ceska-republika", "topic-svetove-strany-a-mapa", "topic-cas-a-kalendar",
    ],
  },
];

const ALL_KEYS = KEY_GROUPS.flatMap((g) => g.keys);

interface StorageImage { key: string; url: string }

export function AdminGenerateIllustrations({ trigger }: { trigger?: React.ReactNode }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"generate" | "preview">("generate");

  // Generate tab state
  const [running, setRunning] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set(KEY_GROUPS.map((g) => g.label)));
  const [results, setResults] = useState<{ ok: string[]; failed: { key: string; reason: string }[] } | null>(null);

  // Preview tab state
  const [previewImages, setPreviewImages] = useState<StorageImage[]>([]);
  const [missingKeys, setMissingKeys] = useState<Set<string>>(new Set());
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "done" | "missing">("all");
  const [filterGroup, setFilterGroup] = useState<string>("all");

  // key → group label lookup
  const KEY_TO_GROUP = Object.fromEntries(KEY_GROUPS.flatMap((g) => g.keys.map((k) => [k, g.label])));

  const filteredImages = previewImages.filter(({ key }) => {
    if (filterStatus === "done" && missingKeys.has(key)) return false;
    if (filterStatus === "missing" && !missingKeys.has(key)) return false;
    if (filterGroup !== "all" && KEY_TO_GROUP[key] !== filterGroup) return false;
    return true;
  });

  const selectedKeys = KEY_GROUPS.filter((g) => selectedGroups.has(g.label)).flatMap((g) => g.keys);

  const loadPreview = () => {
    // Sestavíme URL pro všechny known keys — img.onError označní chybějící
    setPreviewImages(
      ALL_KEYS.map((key) => ({
        key,
        url: supabase.storage.from("prvouka-images").getPublicUrl(`${key}.png`).data.publicUrl,
      })),
    );
  };

  useEffect(() => {
    if (open && view === "preview" && previewImages.length === 0) loadPreview();
  }, [open, view]);

  const handleRegenerate = async (key: string) => {
    setRegenerating(key);
    await supabase.storage.from("prvouka-images").remove([`${key}.png`]);
    const { error } = await supabase.functions.invoke("generate-prvouka-images", { body: { keys: [key] } });
    if (error) {
      toast({ description: `Chyba: ${error.message}`, variant: "destructive" });
    } else {
      toast({ description: `✓ ${key} regenerován` });
      await loadPreview();
    }
    setRegenerating(null);
  };

  const handleGenerate = async () => {
    if (selectedKeys.length === 0) return;
    setRunning(true);
    setResults(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-prvouka-images", { body: { keys: selectedKeys } });
      if (error) {
        toast({ description: `Chyba: ${error.message ?? "neznámá"}`, variant: "destructive" });
        return;
      }
      const ok = Object.keys((data?.results ?? {}) as Record<string, string>);
      const failedEntries = Object.entries((data?.errors ?? {}) as Record<string, string>);
      setResults({ ok, failed: failedEntries.map(([key, reason]) => ({ key, reason })) });
      toast({ description: `Hotovo. Vygenerováno ${ok.length} z ${selectedKeys.length}.` });
    } catch (e) {
      toast({ description: e instanceof Error ? e.message : "Něco se pokazilo.", variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Generovat ilustrace
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            3D ilustrace
          </SheetTitle>
        </SheetHeader>

        {/* Tab switcher */}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => setView("generate")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              view === "generate" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Wand2 className="h-3.5 w-3.5" />
            Generovat
          </button>
          <button
            type="button"
            onClick={() => setView("preview")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              view === "preview" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Náhled & správa
            {previewImages.length > 0 && (
              <span className="ml-1 rounded-full bg-white/20 px-1.5 text-xs">{previewImages.length}</span>
            )}
          </button>
        </div>

        {/* ── GENERATE VIEW ── */}
        {view === "generate" && (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              Vygeneruje Pixar-style 3D ilustrace přes AI a uloží je do Supabase storage. Existující obrázky se přeskočí.
            </p>

            {!running && !results && (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Co vygenerovat</p>
                  {KEY_GROUPS.map((group) => {
                    const isSelected = selectedGroups.has(group.label);
                    return (
                      <button
                        key={group.label}
                        type="button"
                        onClick={() =>
                          setSelectedGroups((prev) => {
                            const next = new Set(prev);
                            if (next.has(group.label)) next.delete(group.label);
                            else next.add(group.label);
                            return next;
                          })
                        }
                        className={`w-full rounded-2xl border-2 p-3.5 text-left transition-all ${
                          isSelected ? "border-primary bg-primary/5" : "border-border/60 bg-card hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl" aria-hidden>{group.emoji}</span>
                            <div>
                              <p className="text-sm font-semibold">{group.label}</p>
                              <p className="text-xs text-muted-foreground">{group.keys.length} ilustrací</p>
                            </div>
                          </div>
                          <div className={`grid h-5 w-5 place-items-center rounded border-2 ${isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
                            {isSelected && <CheckCircle2 className="h-3 w-3" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  <p className="text-xs text-muted-foreground italic pt-1">
                    Celkem vybráno: {selectedKeys.length} / {ALL_KEYS.length}
                  </p>
                </div>
                <Button onClick={handleGenerate} disabled={selectedKeys.length === 0} className="w-full gap-2 h-11" size="lg">
                  <Play className="h-4 w-4" />
                  Spustit generování ({selectedKeys.length})
                </Button>
              </>
            )}

            {running && (
              <Card>
                <CardContent className="p-5 space-y-3 text-center">
                  <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Generuji {selectedKeys.length} ilustrací… (může trvat několik minut)
                  </p>
                </CardContent>
              </Card>
            )}

            {results && !running && (
              <>
                <Card className={results.failed.length === 0 ? "border-2 border-emerald-300 bg-emerald-50/50" : "border-2 border-amber-300 bg-amber-50/50"}>
                  <CardContent className="p-5 flex items-center gap-3">
                    {results.failed.length === 0
                      ? <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                      : <AlertTriangle className="h-7 w-7 text-amber-600" />}
                    <div>
                      <p className="text-2xl font-bold">{results.ok.length} hotovo</p>
                      {results.failed.length > 0 && <p className="text-sm text-amber-700">{results.failed.length} selhalo</p>}
                    </div>
                  </CardContent>
                </Card>
                {results.failed.length > 0 && (
                  <div className="space-y-1">
                    {results.failed.map(({ key, reason }) => (
                      <div key={key} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs">
                        <code className="font-mono text-rose-700">{key}</code>
                        <p className="text-muted-foreground italic mt-0.5">→ {reason}</p>
                      </div>
                    ))}
                  </div>
                )}
                <Button onClick={() => setResults(null)} variant="outline" className="w-full">Spustit znovu</Button>
              </>
            )}
          </div>
        )}

        {/* ── PREVIEW VIEW ── */}
        {view === "preview" && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {ALL_KEYS.length - missingKeys.size} / {ALL_KEYS.length} vygenerováno
              </p>
              <Button variant="ghost" size="sm" onClick={() => { setMissingKeys(new Set()); loadPreview(); }} className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                Obnovit
              </Button>
            </div>

            {/* Status filter */}
            <div className="flex flex-wrap gap-1.5">
              {(["all", "done", "missing"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilterStatus(s)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    filterStatus === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {s === "all" ? "Vše" : s === "done" ? "✓ Hotové" : "○ Chybějící"}
                </button>
              ))}
            </div>

            {/* Group filter */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setFilterGroup("all")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  filterGroup === "all" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                Všechny skupiny
              </button>
              {KEY_GROUPS.map((g) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setFilterGroup(filterGroup === g.label ? "all" : g.label)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    filterGroup === g.label ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {g.emoji} {g.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">{filteredImages.length} zobrazeno</p>

            <div className="grid grid-cols-3 gap-3">
              {filteredImages.map(({ key, url }) => {
                const isMissing = missingKeys.has(key);
                return (
                  <div
                    key={key}
                    className={`rounded-2xl border-2 p-3 text-center transition-all ${
                      isMissing ? "border-dashed border-border/40 bg-muted/30 opacity-50" : "border-border/60 bg-card hover:border-primary/40"
                    }`}
                  >
                    {isMissing ? (
                      <div className="w-full aspect-square rounded-xl bg-muted flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    ) : (
                      <img
                        src={url}
                        alt={key}
                        className="w-full aspect-square object-contain rounded-xl mix-blend-multiply"
                        loading="lazy"
                        onError={() => setMissingKeys((prev) => new Set([...prev, key]))}
                      />
                    )}
                    <p className="mt-2 text-[10px] text-muted-foreground font-mono leading-tight line-clamp-2">{key}</p>
                    <button
                      type="button"
                      onClick={() => handleRegenerate(key)}
                      disabled={!!regenerating}
                      title="Regenerovat"
                      className="mt-2 flex items-center justify-center gap-1 w-full rounded-full border border-border/60 bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 transition-all disabled:opacity-40"
                    >
                      {regenerating === key ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                      {regenerating === key ? "…" : "Regenerovat"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
