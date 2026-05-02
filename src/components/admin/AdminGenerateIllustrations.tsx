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

const DISPLAY_PREFIX = "Roztomilá 3D cartoon ilustrace —";
const DISPLAY_SUFFIX = "— Pixar styl, pastelové barvy, zaoblené tvary, bílé pozadí, bez textu";

const DEFAULT_DESCS: Partial<Record<string, string>> = {
  // Předměty
  "subject-matematika": "barevná 3D čísla 1, 2, 3 vznášející se s plusem a rovnítkem",
  "subject-cestina": "otevřená kniha s písmeny A, B, C vyskakujícími barevně ven",
  "subject-prvouka": "přátelský strom se sluncem, květinami a malým zvířátkem na louce",
  "subject-prirodoveda": "lupa nad listy a malý ekosystém s rostlinami a zvířaty",
  "subject-vlastiveda": "globus a obrys mapy České republiky s Pražským hradem",
  // Prvouka — okruhy
  "cat-clovek-a-jeho-telo": "šťastné dítě ukazující části těla — ruce, nohy, hlavu",
  "cat-priroda-kolem-nas": "přírodní scenérie se stromy, květinami, sluncem, ptáky a rybníčkem",
  "cat-lide-a-spolecnost": "přátelská čtvrť s domy, mávajícími lidmi, školou a parkem",
  "cat-orientace-v-prostoru-a-case": "kompas, mapa, hodiny a kalendář dohromady",
  // Prvouka — témata
  "topic-lidske-telo": "obrys lidského těla s přátelsky popsanými kostmi, svaly a orgány",
  "topic-smysly": "pět smyslů — oko, ucho, nos, jazyk, ruka — hravě rozmístěné",
  "topic-zdravi-a-hygiena": "dítě si myje ruce s mýdlem, zubní kartáček, zdravé jídlo",
  "topic-rostliny": "různé rostliny — strom, květina, houba, tráva — s viditelnými kořeny",
  "topic-zvirata": "přátelská zvířata — pes, kočka, jelen, pták, motýl, ryba — v přírodě",
  "topic-rocni-obdobi-a-pocasi": "čtyři roční období — jarní květiny, letní slunce, podzimní listí, zimní sníh — ve čtyřech polích",
  "topic-nase-zeme": "obrys mapy ČR s Prahou, českou vlajkou a Pražským hradem",
  "topic-rodina-a-spolecnost": "rodina a komunita — rodiče s dětmi, mávající sousedé, lidé si pomáhají",
  "topic-rodina-a-pravidla-chovani": "šťastná rodina — rodiče a děti — drží se za ruce, zdraví sousedy, chovají se slušně",
  "topic-obec-a-mesto": "malé české městečko s radnicí, kostelem, školou a parkem",
  "topic-ceska-republika": "symboly ČR — Pražský hrad, česká vlajka, obrys mapy",
  "topic-svetove-strany-a-mapa": "větrná růžice se směry S V J Z a jednoduchá mapa s pokladem",
  "topic-cas-a-kalendar": "hodiny ukazující čas, stránka kalendáře a střídání dne a noci",
  // Matematika — okruhy
  "cat-math-cisla-a-operace": "barevná čísla 1–9 s plusem, mínusem a počítacími kostkami",
  "cat-math-zlomky": "pizza a dort rozkrojené na stejné díly ukazující zlomky ½ a ¼",
  "cat-math-geometrie": "geometrické tvary — čtverec, trojúhelník, kruh, obdélník — s pravítkem a úhloměrem",
  // Matematika — témata
  "topic-math-porovnavani-prirozenych-cisel": "dvě skupiny předmětů porovnávané znaménky menší a větší",
  "topic-math-scitani-a-odcitani-do-100": "dítě počítá na prstech, kolem létají čísla a znaménka plus a mínus",
  "topic-math-nasobeni-a-deleni": "násobilka s barevnými čísly a znaménkem krát",
  "topic-math-zaokrouhlovani": "číselná osa se šipkami ukazujícími zaokrouhlení na desítky",
  "topic-math-razeni-cisel": "dítě řadí číselné kartičky od nejmenšího k největšímu",
  "topic-math-porovnavani-zlomku": "dva zlomkové pruhy vedle sebe, jeden je větší než druhý",
  "topic-math-kraceni-zlomku": "zlomek se zjednodušuje, šipky ukazují dělení čitatele a jmenovatele",
  "topic-math-rozsireni-zlomku": "zlomek se rozšiřuje, šipky ukazují násobení čitatele a jmenovatele",
  "topic-math-scitani-zlomku": "dva zlomkové koláče se sčítají a tvoří větší část",
  "topic-math-odcitani-zlomku": "z koláče se odebírá výseč, znaménko mínus",
  "topic-math-smisena-cisla": "celé číslo vedle zlomku — třeba 2 a třetina koláče",
  "topic-math-zlomek-z-cisla": "skupina 12 jablek, čtvrtina z nich je zakroužkovaná a zvýrazněná",
  "topic-math-nasobeni-zlomku-celym-cislem": "zlomek vynásobený celým číslem — tři čtvrtiny znázorněné třemi výsečemi",
  "topic-math-geometricke-tvary": "základní geometrické tvary — čtverec, trojúhelník, kruh, obdélník — s popisky",
  "topic-math-obvod": "obdélník se šipkami kolem obvodu s mírami",
  "topic-math-mereni-delky": "pravítko měřící předměty, svinovací metr, dítě odhaduje délku",
  "topic-math-zakladni-jednotky": "pravítko s milimetry, centimetry a metry, porovnávací šipky",
  "topic-math-prevody-jednotek": "šipky ukazující převody cm↔m, mm↔cm s rovnítky",
  "topic-math-odhad-delek": "dítě odhaduje délku tužky a knihy, kolem otazníky",
  "topic-math-jednotky-hmotnosti": "kuchyňská váha s gramovými a kilogramovými závažími, vážená jablka",
  "topic-math-slovni-ulohy-delky": "dítě měří stužku pravítkem, stříhá nůžkami, kolem létají čísla",
  "topic-math-objem-ml-l": "odměrný kelímek s mililitrovými stupnicemi, láhev s označením 1 litr",
  // Čeština — okruhy
  "cat-cz-vyjmenovana-slova": "česká slova se zvýrazněnými písmeny Y a I, pravopisná knížka s lupou",
  "cat-cz-pravopis": "sešit s českým textem, tužka opravuje pravopis, fajfky a křížky",
  "cat-cz-mluvnice": "schéma věty s barevně popsanými slovními druhy, mluvnický strom",
  "cat-cz-diktat": "dítě píše do sešitu diktát, bublina se slovy",
  "cat-cz-sloh": "dítě píše slohovou práci s tužkou, kolem bubliny s příběhem",
  // Čeština — témata
  "topic-cz-vyjm-b": "písmeno B s vyjmenovanými slovy jako být, bydlet a ikonkou domu",
  "topic-cz-vyjm-l": "písmeno L s vyjmenovanými slovy lyže, slyšet a ikonkou lyží",
  "topic-cz-vyjm-m": "písmeno M s vyjmenovanými slovy my, myslet a myšlenková bublina",
  "topic-cz-vyjm-p": "písmeno P s vyjmenovanými slovy pýcha, pytel a ikonkou pytle",
  "topic-cz-vyjm-s": "písmeno S s vyjmenovanými slovy syn, sýr a ikonkou sýra",
  "topic-cz-vyjm-v": "písmeno V s vyjmenovanými slovy výt, zvyk a ikonkou vlka",
  "topic-cz-vyjm-z": "písmeno Z s vyjmenovanými slovy jazyk, brzy a ikonkou jazyka",
  "topic-cz-parove-souhlasky": "dvojice písmen D-T, B-P, Z-S vedle sebe s lupou",
  "topic-cz-tvrde-mekke": "tvrdé a měkké souhlásky rozdělené do dvou skupin s ikonkami",
  "topic-cz-velka-pismena": "velké písmeno A vedle malého a, kolem názvy měst",
  "topic-cz-slovni-druhy": "barevné štítky — podstatné jméno, sloveso, přídavné jméno — ve větě",
  "topic-cz-rod-cislo": "ikonky mužského, ženského a středního rodu s příklady českých podstatných jmen",
  "topic-cz-slovesa-urcovani": "tabulka časování sloves s osobou a časem",
  "topic-cz-zaklad-vety": "jednoduchá věta s podtrženým podmětem a zakroužkovaným přísudkem",
  "topic-cz-diktat": "dítě doplňuje chybějící písmena do mezer ve větách",
  "topic-cz-sloh-vypraveni": "dítě vypráví příběh, bublina s postavičkami a dobrodružstvím",
  "topic-cz-sloh-popis": "dítě popisuje předmět — lupa, kolem létají popisná slova, paleta barev",
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

  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number } | null>(null);

  const runBatch = async (keys: string[], force: boolean) => {
    if (keys.length === 0) return;
    setRunning(true);
    setBatchResult(null);
    setBatchProgress({ done: 0, total: keys.length });

    const CHUNK = 3;
    const allOk: string[] = [];
    const allFailed: { key: string; reason: string }[] = [];

    for (let i = 0; i < keys.length; i += CHUNK) {
      const chunk = keys.slice(i, i + CHUNK);
      try {
        const { data, error } = await supabase.functions.invoke("generate-prvouka-images", {
          body: { keys: chunk, force },
        });
        if (error) {
          chunk.forEach((key) => allFailed.push({ key, reason: error.message }));
        } else {
          const ok = Object.keys((data?.results ?? {}) as Record<string, string>);
          const failed = Object.entries((data?.errors ?? {}) as Record<string, string>).map(
            ([key, reason]) => ({ key, reason })
          );
          allOk.push(...ok);
          allFailed.push(...failed);
          ok.forEach((key) => {
            bumpImageVersion(key);
            setMissingKeys((prev) => { const n = new Set(prev); n.delete(key); return n; });
            const storageUrl = supabase.storage.from("prvouka-images").getPublicUrl(`${key}.png`).data.publicUrl;
            fetchFreshBlob(key, storageUrl);
          });
        }
      } catch (e) {
        chunk.forEach((key) => allFailed.push({ key, reason: e instanceof Error ? e.message : "Chyba" }));
      }
      setBatchProgress({ done: Math.min(i + CHUNK, keys.length), total: keys.length });
    }

    setBatchResult({ ok: allOk, failed: allFailed });
    setBatchProgress(null);
    setRunning(false);
    toast({ description: `Hotovo: ${allOk.length} / ${keys.length}` });
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
          <p className="text-xs text-muted-foreground italic px-1">{DISPLAY_PREFIX}</p>
          <Textarea
            rows={5}
            value={promptDialog?.desc ?? ""}
            onChange={(e) => setPromptDialog((prev) => prev ? { ...prev, desc: e.target.value } : null)}
            placeholder="Popiš, co má obrázek zobrazovat…"
            className="resize-none text-sm"
          />
          <p className="text-xs text-muted-foreground italic px-1">{DISPLAY_SUFFIX}</p>
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
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">
                  {batchProgress
                    ? `Generuji… ${batchProgress.done} / ${batchProgress.total}`
                    : "Generuji…"}
                </p>
                {batchProgress && (
                  <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${(batchProgress.done / batchProgress.total) * 100}%` }}
                    />
                  </div>
                )}
              </div>
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
