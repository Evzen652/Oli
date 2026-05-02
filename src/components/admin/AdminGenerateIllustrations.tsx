import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon, Loader2, CheckCircle2, AlertTriangle, RefreshCw, Wand2, Zap, Pencil } from "lucide-react";
import { bumpImageVersion, fetchFreshBlob, useImageVersions } from "@/lib/imageVersions";
import { getTopicImageKey, getCategoryImageKey } from "@/lib/prvoukaVisuals";
import { getAllTopics } from "@/lib/contentRegistry";

// ── Static key list ───────────────────────────────────────────────────────────

const ALL_KEYS = [
  // Subject cards
  "subject-matematika", "subject-cestina", "subject-prvouka", "subject-prirodoveda", "subject-vlastiveda",
  // Matematika — okruhy
  "cat-math-cisla-a-operace", "cat-math-zlomky", "cat-math-geometrie",
  // Matematika — témata
  "topic-math-porovnavani-prirozenych-cisel", "topic-math-scitani-a-odcitani-do-100",
  "topic-math-nasobeni-a-deleni", "topic-math-zaokrouhlovani", "topic-math-razeni-cisel",
  "topic-math-porovnavani-zlomku", "topic-math-kraceni-zlomku", "topic-math-rozsireni-zlomku",
  "topic-math-scitani-zlomku", "topic-math-odcitani-zlomku", "topic-math-smisena-cisla",
  "topic-math-zlomek-z-cisla", "topic-math-nasobeni-zlomku-celym-cislem", "topic-math-geometricke-tvary",
  "topic-math-obvod", "topic-math-mereni-delky", "topic-math-zakladni-jednotky",
  "topic-math-prevody-jednotek", "topic-math-odhad-delek", "topic-math-jednotky-hmotnosti",
  "topic-math-slovni-ulohy-delky", "topic-math-objem-ml-l",
  // Čeština — okruhy
  "cat-cz-vyjmenovana-slova", "cat-cz-pravopis", "cat-cz-mluvnice", "cat-cz-diktat", "cat-cz-sloh",
  // Čeština — témata
  "topic-cz-vyjm-b", "topic-cz-vyjm-l", "topic-cz-vyjm-m", "topic-cz-vyjm-p",
  "topic-cz-vyjm-s", "topic-cz-vyjm-v", "topic-cz-vyjm-z",
  "topic-cz-parove-souhlasky", "topic-cz-tvrde-mekke", "topic-cz-velka-pismena",
  "topic-cz-slovni-druhy", "topic-cz-rod-cislo", "topic-cz-slovesa-urcovani",
  "topic-cz-zaklad-vety", "topic-cz-diktat", "topic-cz-sloh-vypraveni", "topic-cz-sloh-popis",
  // Prvouka — okruhy
  "cat-clovek-a-jeho-telo", "cat-priroda-kolem-nas", "cat-lide-a-spolecnost", "cat-orientace-v-prostoru-a-case",
  // Prvouka — témata
  "topic-lidske-telo", "topic-smysly", "topic-zdravi-a-hygiena",
  "topic-rostliny", "topic-zvirata", "topic-rocni-obdobi-a-pocasi",
  "topic-nase-zeme", "topic-rodina-a-spolecnost", "topic-rodina-a-pravidla-chovani",
  "topic-obec-a-mesto", "topic-ceska-republika", "topic-svetove-strany-a-mapa", "topic-cas-a-kalendar",
] as const;

type ImageKey = typeof ALL_KEYS[number];

// ── Default prompts (mirror of edge function IMAGE_KEYS descriptions) ─────────

const PROMPT_PREFIX = "Cute 3D rendered cartoon illustration of";
const PROMPT_SUFFIX = ", Pixar-style 3D rendering with soft volumetric shading, vibrant pastel colors, friendly rounded shapes, kid-friendly characters, white isolated background, no text, no logos, suitable for 8-year-old children, single centered subject, square composition";

const DEFAULT_DESCS: Partial<Record<string, string>> = {
  "subject-matematika": "colorful 3D numbers 1, 2, 3 floating with plus and equals signs",
  "subject-cestina": "an open book with the letters A, B, C jumping out colorfully",
  "subject-prvouka": "a friendly tree with a sun, flowers, and a small animal in a meadow",
  "subject-prirodoveda": "a magnifying glass over leaves and a small ecosystem with plants and animals",
  "subject-vlastiveda": "a globe and a Czech Republic outline map with landmarks like Prague Castle",
  "cat-clovek-a-jeho-telo": "a happy child showing body parts like arms, legs, head",
  "cat-priroda-kolem-nas": "nature scene with trees, flowers, sun, birds, and a small pond",
  "cat-lide-a-spolecnost": "a friendly neighborhood with houses, people waving, a school, and a park",
  "cat-orientace-v-prostoru-a-case": "a compass, map, clock, and calendar together",
  "topic-lidske-telo": "a human body outline with labeled bones, muscles, and organs in a friendly style",
  "topic-smysly": "five senses - eye, ear, nose, tongue, hand touching - in a playful layout",
  "topic-zdravi-a-hygiena": "a child washing hands with soap, toothbrush, healthy food",
  "topic-rostliny": "various plants - a tree, flower, mushroom, and grass - with roots visible",
  "topic-zvirata": "friendly animals - dog, cat, deer, bird, butterfly, fish - together in nature",
  "topic-rocni-obdobi-a-pocasi": "four seasons - spring flowers, summer sun, autumn leaves, winter snow - in quadrants",
  "topic-nase-zeme": "Czech Republic map outline with Prague marked, Czech flag, and famous landmarks like Prague Castle",
  "topic-rodina-a-spolecnost": "a family and community together - parents with children, neighbors waving, people helping each other",
  "topic-rodina-a-pravidla-chovani": "a happy family - parents and children - holding hands, showing good manners, greeting neighbors",
  "topic-obec-a-mesto": "a small Czech town with a town hall, church, school, and park",
  "topic-ceska-republika": "Czech Republic landmarks - Prague Castle, Czech flag, map outline",
  "topic-svetove-strany-a-mapa": "a compass rose with N S E W directions and a simple treasure map",
  "topic-cas-a-kalendar": "a clock showing time, a calendar page, and day-night cycle",
  "cat-math-cisla-a-operace": "colorful numbers 1-9 with plus and minus signs, counting blocks",
  "cat-math-zlomky": "a pizza and a cake cut into equal slices showing fractions like 1/2 and 1/4",
  "cat-math-geometrie": "geometric shapes - square, triangle, circle, rectangle - with a ruler and protractor",
  "topic-math-porovnavani-prirozenych-cisel": "two groups of objects being compared with less-than and greater-than signs",
  "topic-math-scitani-a-odcitani-do-100": "a child counting on fingers with numbers and plus/minus signs floating around",
  "topic-math-nasobeni-a-deleni": "multiplication table grid with colorful numbers and a times symbol",
  "topic-math-zaokrouhlovani": "a number line with arrows showing rounding to nearest ten",
  "topic-math-razeni-cisel": "numbered cards being sorted from smallest to largest by a child",
  "topic-math-porovnavani-zlomku": "two fraction bars side by side being compared, one bigger than the other",
  "topic-math-kraceni-zlomku": "a fraction being simplified with arrows showing division of numerator and denominator",
  "topic-math-rozsireni-zlomku": "a fraction being expanded with arrows showing multiplication of numerator and denominator",
  "topic-math-scitani-zlomku": "two fraction pies being added together to make a larger portion",
  "topic-math-odcitani-zlomku": "a fraction pie with a slice being removed, subtraction symbol",
  "topic-math-smisena-cisla": "a whole number next to a fraction piece, like 2 and 1/3 of a pie",
  "topic-math-zlomek-z-cisla": "a group of 12 apples with 1/4 of them circled and highlighted",
  "topic-math-nasobeni-zlomku-celym-cislem": "a fraction piece being multiplied - showing 3 times 1/4 with three quarter-pieces",
  "topic-math-geometricke-tvary": "basic geometric shapes - square, triangle, circle, rectangle - with labels",
  "topic-math-obvod": "a rectangle with arrows around its perimeter showing measurement",
  "topic-math-mereni-delky": "a ruler measuring objects, a tape measure, and a child estimating length",
  "topic-math-zakladni-jednotky": "a ruler with millimeters, centimeters, and meters labeled, comparison arrows",
  "topic-math-prevody-jednotek": "arrows showing conversions between cm and m, mm and cm, with equal signs",
  "topic-math-odhad-delek": "a child guessing the length of a pencil and a book, with question marks",
  "topic-math-jednotky-hmotnosti": "a kitchen scale with weights labeled in grams and kilograms, apples being weighed",
  "topic-math-slovni-ulohy-delky": "a child measuring a ribbon with a ruler, cutting with scissors, numbers floating",
  "topic-math-objem-ml-l": "a measuring cup with milliliter markings, a water bottle labeled 1 liter",
  "cat-cz-vyjmenovana-slova": "Czech words with highlighted letters Y and I, a spelling book with a magnifying glass",
  "cat-cz-pravopis": "a notebook with Czech text, a pencil correcting spelling, checkmarks and crosses",
  "cat-cz-mluvnice": "sentence diagram with colorful parts of speech labels, a grammar tree",
  "cat-cz-diktat": "a child writing in a notebook from dictation, speech bubble with words",
  "cat-cz-sloh": "a child writing a creative essay with a pencil, story bubbles around",
  "topic-cz-vyjm-b": "the Czech letter B with words like 'být, bydlit' and a house icon",
  "topic-cz-vyjm-l": "the Czech letter L with words 'lyže, slyšet' and a ski icon",
  "topic-cz-vyjm-m": "the Czech letter M with words 'my, myslit' and a thinking bubble",
  "topic-cz-vyjm-p": "the Czech letter P with words 'pýcha, pytel' and a bag icon",
  "topic-cz-vyjm-s": "the Czech letter S with words 'syn, sýr' and a cheese icon",
  "topic-cz-vyjm-v": "the Czech letter V with words 'výt, zvyk' and a wolf icon",
  "topic-cz-vyjm-z": "the Czech letter Z with words 'jazyk, brzy' and a tongue icon",
  "topic-cz-parove-souhlasky": "letter pairs like D-T, B-P, Z-S shown side by side with a magnifying glass",
  "topic-cz-tvrde-mekke": "hard and soft consonants divided into two groups with happy/stern face icons",
  "topic-cz-velka-pismena": "a big capital letter A next to a small lowercase a, with city names",
  "topic-cz-slovni-druhy": "colorful word labels - noun, verb, adjective - pointing to words in a sentence",
  "topic-cz-rod-cislo": "masculine, feminine, neuter icons (he/she/it) with example Czech nouns",
  "topic-cz-slovesa-urcovani": "a verb conjugation table with person and tense markers",
  "topic-cz-zaklad-vety": "a simple sentence with subject underlined and predicate circled",
  "topic-cz-diktat": "a child writing missing letters into blank spaces in sentences",
  "topic-cz-sloh-vypraveni": "a child telling a story with a speech bubble showing characters and adventures",
  "topic-cz-sloh-popis": "a child describing an object - magnifying glass, descriptive words floating, paint palette",
};

function getDefaultDesc(key: string): string {
  return DEFAULT_DESCS[key] ?? "";
}

// ── Filter helpers ────────────────────────────────────────────────────────────

function keyToSubject(key: string): string {
  if (key === "subject-matematika" || key.startsWith("cat-math-") || key.startsWith("topic-math-")) return "matematika";
  if (key === "subject-cestina" || key.startsWith("cat-cz-") || key.startsWith("topic-cz-")) return "čeština";
  if (key === "subject-prirodoveda" || key.startsWith("topic-pr-")) return "přírodověda";
  if (key === "subject-vlastiveda" || key.startsWith("topic-vl-")) return "vlastivěda";
  return "prvouka";
}

function keyToType(key: string): "subject" | "category" | "topic" {
  if (key.startsWith("subject-")) return "subject";
  if (key.startsWith("cat-")) return "category";
  return "topic";
}

function buildGradeMap(topics: ReturnType<typeof getAllTopics>): Record<string, number[]> {
  const map: Record<string, Set<number>> = {};
  const addKey = (k: string | null, g: number) => {
    if (!k) return;
    if (!map[k]) map[k] = new Set();
    map[k].add(g);
  };
  for (const t of topics) {
    const topicKey = getTopicImageKey(t.subject, t.topic);
    const catKey = getCategoryImageKey(t.subject, t.category);
    for (let g = t.gradeRange[0]; g <= t.gradeRange[1]; g++) {
      addKey(topicKey, g);
      addKey(catKey, g);
    }
  }
  return Object.fromEntries(
    Object.entries(map).map(([k, s]) => [k, [...s].sort((a, b) => a - b)])
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface StorageImage { key: string; url: string }
interface BatchResult { ok: string[]; failed: { key: string; reason: string }[] }

// ── Constants ─────────────────────────────────────────────────────────────────

const SUBJECTS = [
  { value: "matematika", label: "Matematika" },
  { value: "čeština", label: "Čeština" },
  { value: "prvouka", label: "Prvouka" },
  { value: "přírodověda", label: "Přírodověda" },
  { value: "vlastivěda", label: "Vlastivěda" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function AdminGenerateIllustrations({ trigger }: { trigger?: React.ReactNode }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [filterGrade, setFilterGrade] = useState<number | "all">("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "subject" | "category" | "topic">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "done" | "missing">("all");

  const [allImages, setAllImages] = useState<StorageImage[]>([]);
  const [missingKeys, setMissingKeys] = useState<Set<string>>(new Set());
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
  const [promptDialog, setPromptDialog] = useState<{ key: string; desc: string } | null>(null);

  const versioned = useImageVersions();
  const gradeMap = useMemo(() => buildGradeMap(getAllTopics()), []);

  const loadImages = () => {
    setMissingKeys(new Set());
    setAllImages(
      ALL_KEYS.map((key) => ({
        key,
        url: supabase.storage.from("prvouka-images").getPublicUrl(`${key}.png`).data.publicUrl,
      }))
    );
  };

  useEffect(() => {
    if (open && allImages.length === 0) loadImages();
  }, [open]);

  const filteredImages = useMemo(() => {
    return allImages.filter(({ key }) => {
      if (filterStatus === "done" && missingKeys.has(key)) return false;
      if (filterStatus === "missing" && !missingKeys.has(key)) return false;
      if (filterSubject !== "all" && keyToSubject(key) !== filterSubject) return false;
      if (filterType !== "all" && keyToType(key) !== filterType) return false;
      if (filterGrade !== "all" && keyToType(key) !== "subject") {
        const grades = gradeMap[key] ?? [];
        if (!grades.includes(filterGrade as number)) return false;
      }
      return true;
    });
  }, [allImages, filterStatus, filterSubject, filterType, filterGrade, missingKeys, gradeMap]);

  const missingFiltered = useMemo(
    () => filteredImages.filter(({ key }) => missingKeys.has(key)),
    [filteredImages, missingKeys]
  );

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleRegenerate = async (key: string, customPrompt?: string) => {
    setRegenerating(key);
    const body: Record<string, unknown> = { keys: [key], force: true };
    if (customPrompt) body.customPrompts = { [key]: customPrompt };
    const { data, error } = await supabase.functions.invoke("generate-prvouka-images", { body });
    const perKeyError = (data?.errors as Record<string, string> | undefined)?.[key];
    if (error || perKeyError) {
      toast({ description: `Chyba: ${perKeyError ?? error?.message ?? "neznámá"}`, variant: "destructive" });
    } else {
      bumpImageVersion(key);
      setMissingKeys((prev) => { const n = new Set(prev); n.delete(key); return n; });
      toast({ description: `✓ ${key} uložen` });
      const storageUrl = supabase.storage.from("prvouka-images").getPublicUrl(`${key}.png`).data.publicUrl;
      fetchFreshBlob(key, storageUrl);
    }
    setRegenerating(null);
  };

  const runBatch = async (keys: string[], force: boolean) => {
    if (keys.length === 0) return;
    setRunning(true);
    setBatchResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-prvouka-images", {
        body: { keys, force },
      });
      if (error) {
        toast({ description: `Chyba: ${error.message}`, variant: "destructive" });
        return;
      }
      const ok = Object.keys((data?.results ?? {}) as Record<string, string>);
      const failed = Object.entries((data?.errors ?? {}) as Record<string, string>).map(
        ([key, reason]) => ({ key, reason })
      );
      setBatchResult({ ok, failed });
      ok.forEach((key) => {
        bumpImageVersion(key);
        setMissingKeys((prev) => { const n = new Set(prev); n.delete(key); return n; });
        const storageUrl = supabase.storage.from("prvouka-images").getPublicUrl(`${key}.png`).data.publicUrl;
        fetchFreshBlob(key, storageUrl);
      });
      toast({ description: `Hotovo: ${ok.length} / ${keys.length}` });
    } catch (e) {
      toast({ description: e instanceof Error ? e.message : "Chyba", variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  const handleGenerateMissing = () => runBatch(missingFiltered.map((i) => i.key), false);

  const handleRegenerateAll = () => {
    if (!window.confirm(`Přegenerovat ${filteredImages.length} ilustrací? Existující obrázky budou přepsány.`)) return;
    runBatch(filteredImages.map((i) => i.key), true);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const chip = (active: boolean, onClick: () => void, label: string) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/70"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
    {/* Prompt editor dialog */}
    <Dialog open={!!promptDialog} onOpenChange={(o) => { if (!o) setPromptDialog(null); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">{promptDialog?.key}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground italic px-1">{PROMPT_PREFIX} …</p>
          <Textarea
            rows={5}
            value={promptDialog?.desc ?? ""}
            onChange={(e) => setPromptDialog((prev) => prev ? { ...prev, desc: e.target.value } : null)}
            placeholder="Popiš, co má obrázek zobrazovat (anglicky nebo česky)"
            className="resize-none text-sm"
          />
          <p className="text-xs text-muted-foreground italic px-1 leading-relaxed">… {PROMPT_SUFFIX.slice(2)}</p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setPromptDialog(null)}>Zrušit</Button>
          <Button
            disabled={!promptDialog?.desc.trim() || !!regenerating}
            onClick={() => {
              if (!promptDialog) return;
              const fullPrompt = `${PROMPT_PREFIX} ${promptDialog.desc.trim()}${PROMPT_SUFFIX}`;
              setPromptDialog(null);
              handleRegenerate(promptDialog.key, fullPrompt);
            }}
            className="gap-1.5"
          >
            {regenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
            Regenerovat s tímto popisem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Ilustrace
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            3D ilustrace
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {ALL_KEYS.length - missingKeys.size} / {ALL_KEYS.length} vygenerováno
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* ── Filters ── */}
        <div className="mt-5 space-y-2">
          {/* Ročník */}
          <div className="flex flex-wrap gap-1.5">
            {chip(filterGrade === "all", () => setFilterGrade("all"), "Všechny ročníky")}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) =>
              chip(filterGrade === g, () => setFilterGrade(filterGrade === g ? "all" : g), `${g}.`)
            )}
          </div>
          {/* Předmět */}
          <div className="flex flex-wrap gap-1.5">
            {chip(filterSubject === "all", () => setFilterSubject("all"), "Všechny předměty")}
            {SUBJECTS.map(({ value, label }) =>
              chip(
                filterSubject === value,
                () => setFilterSubject(filterSubject === value ? "all" : value),
                label
              )
            )}
          </div>
          {/* Typ */}
          <div className="flex flex-wrap gap-1.5">
            {chip(filterType === "all", () => setFilterType("all"), "Vše")}
            {chip(filterType === "subject", () => setFilterType(filterType === "subject" ? "all" : "subject"), "Karta předmětu")}
            {chip(filterType === "category", () => setFilterType(filterType === "category" ? "all" : "category"), "Okruh")}
            {chip(filterType === "topic", () => setFilterType(filterType === "topic" ? "all" : "topic"), "Téma")}
          </div>
          {/* Status */}
          <div className="flex flex-wrap gap-1.5">
            {chip(filterStatus === "all", () => setFilterStatus("all"), "Vše")}
            {chip(filterStatus === "done", () => setFilterStatus(filterStatus === "done" ? "all" : "done"), "✓ Hotové")}
            {chip(filterStatus === "missing", () => setFilterStatus(filterStatus === "missing" ? "all" : "missing"), "○ Chybějící")}
          </div>
        </div>

        {/* ── Batch actions ── */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground mr-auto">{filteredImages.length} zobrazeno</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { setBatchResult(null); loadImages(); }}
            className="gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Obnovit
          </Button>
          <Button
            size="sm"
            disabled={running || missingFiltered.length === 0}
            onClick={handleGenerateMissing}
            className="gap-1.5"
          >
            {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
            Generovat chybějící ({missingFiltered.length})
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={running || filteredImages.length === 0}
            onClick={handleRegenerateAll}
            className="gap-1.5"
          >
            <Zap className="h-3.5 w-3.5" />
            Přegenerovat ({filteredImages.length})
          </Button>
        </div>

        {/* Running indicator */}
        {running && (
          <Card className="mt-3">
            <CardContent className="p-4 flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
              <p className="text-sm text-muted-foreground">Generuji… (může trvat několik minut)</p>
            </CardContent>
          </Card>
        )}

        {/* Batch result */}
        {batchResult && !running && (
          <Card className={`mt-3 border-2 ${batchResult.failed.length === 0 ? "border-emerald-300 bg-emerald-50/50" : "border-amber-300 bg-amber-50/50"}`}>
            <CardContent className="p-3 flex items-center gap-3">
              {batchResult.failed.length === 0
                ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                : <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />}
              <span className="text-sm font-semibold">{batchResult.ok.length} hotovo</span>
              {batchResult.failed.length > 0 && (
                <span className="text-xs text-amber-700">{batchResult.failed.length} selhalo</span>
              )}
              <button
                type="button"
                onClick={() => setBatchResult(null)}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </CardContent>
          </Card>
        )}

        {/* ── Image grid ── */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {filteredImages.map(({ key, url }) => {
            const isMissing = missingKeys.has(key);
            return (
              <div
                key={key}
                className={`rounded-2xl border-2 p-3 text-center transition-all ${
                  isMissing
                    ? "border-dashed border-border/40 bg-muted/30 opacity-50"
                    : "border-border/60 bg-card hover:border-primary/40"
                }`}
              >
                {isMissing ? (
                  <div className="w-full aspect-square rounded-xl bg-muted flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                ) : (
                  <img
                    src={versioned(url, key)}
                    alt={key}
                    className="w-full aspect-square object-contain rounded-xl mix-blend-multiply"
                    loading="lazy"
                    onError={() => setMissingKeys((prev) => new Set([...prev, key]))}
                  />
                )}
                <p className="mt-2 text-[10px] text-muted-foreground font-mono leading-tight line-clamp-2">{key}</p>
                <div className="mt-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleRegenerate(key)}
                    disabled={!!regenerating || running}
                    title="Regenerovat"
                    className="flex-1 flex items-center justify-center gap-1 rounded-full border border-border/60 bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 transition-all disabled:opacity-40"
                  >
                    {regenerating === key
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <RefreshCw className="h-3 w-3" />}
                    {regenerating === key ? "…" : "Znovu"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromptDialog({ key, desc: getDefaultDesc(key) })}
                    disabled={!!regenerating || running}
                    title="Upravit prompt"
                    className="flex items-center justify-center rounded-full border border-border/60 bg-muted px-2 py-1 text-muted-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all disabled:opacity-40"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
    </>
  );
}
