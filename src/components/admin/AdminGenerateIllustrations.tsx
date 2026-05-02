import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon, Loader2, Play, CheckCircle2, AlertTriangle } from "lucide-react";

/**
 * AdminGenerateIllustrations — admin tlačítko pro hromadné generování
 * 3D-rendered ilustrací napříč subjects / categories / topics.
 *
 * Volá edge fn `generate-prvouka-images` která:
 *  1) Pošle prompty do Lovable AI Gateway (gemini-2.5-flash-image)
 *  2) Uloží PNG do Supabase storage bucketu `prvouka-images`
 *  3) Aplikace pak přes getPrvoukaCategoryImageUrl / getPrvoukaTopicImageUrl
 *     zobrazí storage URL místo emoji fallbacku.
 *
 * Defaultně generuje VŠECHNY chybějící klíče (~70). Trvá ~2 minuty
 * (2s rate limit per image). User může přerušit.
 *
 * Pokud user chce regenerovat jen konkrétní set → ručně select klíče
 * a volat per-batch.
 */

// Kategorie klíčů pro UI (uživatel vidí, co se bude generovat)
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
      "topic-cz-vyjm-b",
      "topic-cz-vyjm-l",
      "topic-cz-vyjm-m",
      "topic-cz-vyjm-p",
      "topic-cz-vyjm-s",
      "topic-cz-vyjm-v",
      "topic-cz-vyjm-z",
      "topic-cz-parove-souhlasky",
      "topic-cz-tvrde-mekke",
      "topic-cz-velka-pismena",
      "topic-cz-slovni-druhy",
      "topic-cz-rod-cislo",
      "topic-cz-slovesa-urcovani",
      "topic-cz-zaklad-vety",
      "topic-cz-diktat",
      "topic-cz-sloh-vypraveni",
      "topic-cz-sloh-popis",
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
      "topic-lidske-telo",
      "topic-smysly",
      "topic-zdravi-a-hygiena",
      "topic-rostliny",
      "topic-zvirata",
      "topic-rocni-obdobi-a-pocasi",
      "topic-nase-zeme",
      "topic-rodina-a-spolecnost",
      "topic-rodina-a-pravidla-chovani",
      "topic-obec-a-mesto",
      "topic-ceska-republika",
      "topic-svetove-strany-a-mapa",
      "topic-cas-a-kalendar",
    ],
  },
];

const ALL_KEYS = KEY_GROUPS.flatMap((g) => g.keys);

interface Props {
  trigger?: React.ReactNode;
}

export function AdminGenerateIllustrations({ trigger }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(
    new Set(KEY_GROUPS.map((g) => g.label)),
  );
  const [results, setResults] = useState<{ ok: string[]; failed: { key: string; reason: string }[] } | null>(null);

  const toggleGroup = (label: string) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const selectedKeys = KEY_GROUPS
    .filter((g) => selectedGroups.has(g.label))
    .flatMap((g) => g.keys);

  const handleGenerate = async () => {
    if (selectedKeys.length === 0) {
      toast({ description: "Vyber alespoň jednu skupinu k vygenerování.", variant: "destructive" });
      return;
    }
    setRunning(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-prvouka-images", {
        body: { keys: selectedKeys },
      });

      if (error) {
        toast({
          description: `Chyba: ${error.message ?? "neznámá"}`,
          variant: "destructive",
        });
        return;
      }

      const ok = Object.keys((data?.results ?? {}) as Record<string, string>);
      const failedEntries = Object.entries((data?.errors ?? {}) as Record<string, string>);
      setResults({
        ok,
        failed: failedEntries.map(([key, reason]) => ({ key, reason })),
      });
      toast({
        description: `Hotovo. Vygenerováno ${ok.length} z ${selectedKeys.length}.`,
      });
    } catch (e) {
      toast({
        description: e instanceof Error ? e.message : "Něco se pokazilo.",
        variant: "destructive",
      });
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
            Generovat 3D ilustrace
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* INTRO */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-5 space-y-2 text-sm">
              <p className="font-semibold text-foreground">
                AI vygeneruje konzistentní 3D-rendered ilustrace pro vybrané kategorie.
              </p>
              <ul className="text-muted-foreground list-disc list-inside space-y-1 ml-2">
                <li>Styl: Pixar-like 3D, soft pastel barvy, friendly characters, white background.</li>
                <li>Generuje: Gemini 2.5 Flash Image (přes Lovable AI Gateway).</li>
                <li>Ukládá: Supabase storage bucket <code className="text-xs bg-muted px-1 rounded">prvouka-images</code>.</li>
                <li>Trvá ~2 sekundy per ilustrace + rate limit. Celý balík ~3 minuty.</li>
              </ul>
              <p className="text-xs text-muted-foreground italic mt-2">
                Pozn: po vygenerování stačí refresh stránky — aplikace automaticky
                načte nové URL z Supabase storage.
              </p>
            </CardContent>
          </Card>

          {/* GROUPS — multiselect */}
          {!running && !results && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Co vygenerovat
              </p>
              {KEY_GROUPS.map((group) => {
                const isSelected = selectedGroups.has(group.label);
                return (
                  <button
                    key={group.label}
                    type="button"
                    onClick={() => toggleGroup(group.label)}
                    className={`w-full rounded-2xl border-2 p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border/60 bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" aria-hidden>{group.emoji}</span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {group.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {group.keys.length} ilustrací
                          </p>
                        </div>
                      </div>
                      <div
                        className={`grid h-5 w-5 place-items-center rounded border-2 ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/40"
                        }`}
                      >
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
          )}

          {/* RUN BUTTON */}
          {!running && !results && (
            <Button
              onClick={handleGenerate}
              disabled={selectedKeys.length === 0}
              className="w-full gap-2 h-11"
              size="lg"
            >
              <Play className="h-4 w-4" />
              Spustit generování ({selectedKeys.length})
            </Button>
          )}

          {/* PROGRESS */}
          {running && (
            <Card>
              <CardContent className="p-5 space-y-3 text-center">
                <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Generuji {selectedKeys.length} ilustrací… (může trvat několik minut)
                </p>
                <Progress value={50} className="h-2 animate-pulse" />
                <p className="text-xs text-muted-foreground italic">
                  Edge fn pošle dávku do AI gateway. UI se obnoví po dokončení.
                </p>
              </CardContent>
            </Card>
          )}

          {/* RESULTS */}
          {results && !running && (
            <>
              <Card
                className={
                  results.failed.length === 0
                    ? "border-2 border-emerald-300 bg-emerald-50/50"
                    : "border-2 border-amber-300 bg-amber-50/50"
                }
              >
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center gap-3">
                    {results.failed.length === 0 ? (
                      <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="h-7 w-7 text-amber-600" />
                    )}
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {results.ok.length} hotovo
                      </p>
                      {results.failed.length > 0 && (
                        <p className="text-sm text-amber-700">
                          {results.failed.length} selhalo
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {results.ok.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Vygenerované klíče ({results.ok.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {results.ok.map((key) => (
                      <Badge
                        key={key}
                        variant="outline"
                        className="rounded-full bg-emerald-50 border-emerald-300 text-emerald-700 text-[10px] font-mono"
                      >
                        {key}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {results.failed.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Selhalo ({results.failed.length})
                  </p>
                  <div className="space-y-1">
                    {results.failed.map(({ key, reason }) => (
                      <div
                        key={key}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs"
                      >
                        <code className="font-mono text-rose-700">{key}</code>
                        <p className="text-muted-foreground italic mt-0.5">→ {reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={() => setResults(null)} variant="outline" className="w-full">
                Spustit znovu
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
