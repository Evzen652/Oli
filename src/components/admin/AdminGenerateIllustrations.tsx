import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon, Loader2, CheckCircle2, AlertTriangle, RefreshCw, Wand2, Zap, Pencil, Sparkles, Check, X } from "lucide-react";
import { bumpImageVersion, fetchFreshBlob, useImageVersions } from "@/lib/imageVersions";
import { getTopicImageKey, getCategoryImageKey } from "@/lib/prvoukaVisuals";
import { getAllTopics } from "@/lib/contentRegistry";
import { getDisplayCategory, getDisplayTitle, getDisplayTopic } from "@/lib/displayNames";

// ── Key generation from ALL_TOPICS ───────────────────────────────────────────

/** Převede libovolný string na slug: lowercase, bez diakritiky, pomlčky místo mezer/speciálních znaků */
function toSlug(s: string): string {
  return s
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Generuje ilustrační klíče ze všech topics v ALL_TOPICS (včetně grade-N). */
function buildTopicIllustrationKeys(topics: ReturnType<typeof getAllTopics>): string[] {
  const subjKeys = new Set<string>();
  const catKeys = new Set<string>();
  const topicKeys = new Set<string>();

  for (const t of topics) {
    const subjSlug = toSlug(t.subject);
    const catSlug = toSlug(t.category);
    const topicSlug = toSlug(t.topic);

    subjKeys.add(`subject-${subjSlug}`);

    // Prefer legacy imageKey (from prvoukaVisuals) — this is the key the UI actually loads.
    // Only fall back to slug-based key if no legacy key is defined.
    const legacyCatKey = getCategoryImageKey(t.subject, t.category);
    catKeys.add(legacyCatKey ?? `cat-${subjSlug}-${catSlug}`);

    const legacyTopicKey = getTopicImageKey(t.subject, t.topic);
    topicKeys.add(legacyTopicKey ?? `topic-${subjSlug}-${catSlug}-${topicSlug}`);
  }

  return [...subjKeys, ...catKeys, ...topicKeys];
}

/**
 * Sestaví mapu: ilustrační klíč → TopicMetadata.
 * Umožňuje getAutoDesc() vytáhnout konkrétní popis pro grade-N topics.
 */
function buildKeyToTopicMap(topics: ReturnType<typeof getAllTopics>): Map<string, ReturnType<typeof getAllTopics>[number]> {
  const map = new Map<string, ReturnType<typeof getAllTopics>[number]>();
  for (const t of topics) {
    const subjSlug = toSlug(t.subject);
    const catSlug = toSlug(t.category);
    const topicSlug = toSlug(t.topic);
    // Use the same key the UI uses: legacy if defined, slug-based otherwise
    const legacyTopicKey = getTopicImageKey(t.subject, t.topic);
    const topicKey = legacyTopicKey ?? `topic-${subjSlug}-${catSlug}-${topicSlug}`;
    map.set(topicKey, t);
    // kategorie → použij první topic v kategorii (stačí pro popis)
    const legacyCatKey = getCategoryImageKey(t.subject, t.category);
    const catKey = legacyCatKey ?? `cat-${subjSlug}-${catSlug}`;
    if (!map.has(catKey)) map.set(catKey, t);
  }
  return map;
}

/**
 * Sestaví mapu cat-key → seznam všech topics pod touto kategorií.
 * Umožňuje agregovat briefDescription všech podtémat pro bohatší prompt.
 */
function buildCategoryToTopicsMap(topics: ReturnType<typeof getAllTopics>): Map<string, ReturnType<typeof getAllTopics>> {
  const map = new Map<string, ReturnType<typeof getAllTopics>>();
  for (const t of topics) {
    const subjSlug = toSlug(t.subject);
    const catSlug = toSlug(t.category);
    const legacyCatKey = getCategoryImageKey(t.subject, t.category);
    const catKey = legacyCatKey ?? `cat-${subjSlug}-${catSlug}`;
    if (!map.has(catKey)) map.set(catKey, []);
    map.get(catKey)!.push(t);
  }
  return map;
}

/**
 * Sestaví mapu subject-key → seznam všech topics v předmětu.
 */
function buildSubjectToTopicsMap(topics: ReturnType<typeof getAllTopics>): Map<string, ReturnType<typeof getAllTopics>> {
  const map = new Map<string, ReturnType<typeof getAllTopics>>();
  for (const t of topics) {
    const subjSlug = toSlug(t.subject);
    const subjKey = `subject-${subjSlug}`;
    if (!map.has(subjKey)) map.set(subjKey, []);
    map.get(subjKey)!.push(t);
  }
  return map;
}

const KEY_TO_TOPIC_MAP = buildKeyToTopicMap(getAllTopics());
const CAT_TO_TOPICS_MAP = buildCategoryToTopicsMap(getAllTopics());
const SUBJ_TO_TOPICS_MAP = buildSubjectToTopicsMap(getAllTopics());

/**
 * Vrátí lidsky čitelný název pro ilustrační klíč — dětský jako v UI.
 * Pro `subject-X` vrací název předmětu, pro `cat-X-Y` dětský okruh, pro `topic-X-Y-Z` studentTitle.
 * Slouží pro adminský panel ilustrací, aby uživatel věděl, co ke klíči patří.
 */
function getHumanLabel(key: string): string | null {
  // Topic podtéma — máme přímý TopicMetadata
  if (key.startsWith("topic-")) {
    const meta = KEY_TO_TOPIC_MAP.get(key);
    if (meta) return getDisplayTitle(meta);
  }
  // Kategorie — najdi první topic v této kategorii a vezmi z něj jméno + grade
  if (key.startsWith("cat-")) {
    const topics = CAT_TO_TOPICS_MAP.get(key);
    if (topics && topics.length > 0) {
      const t = topics[0];
      return getDisplayCategory(t.category, t.gradeRange[0]);
    }
  }
  // Předmět
  if (key.startsWith("subject-")) {
    const topics = SUBJ_TO_TOPICS_MAP.get(key);
    if (topics && topics.length > 0) {
      const subjectName = topics[0].subject;
      return subjectName.charAt(0).toUpperCase() + subjectName.slice(1);
    }
  }
  return null;
}

/**
 * Vrátí čitelný "drobečkový" kontext pro klíč — předmět › okruh › téma (pro topic key).
 * Pro cat key: předmět › okruh. Pro subject key: prázdný.
 */
function getHumanBreadcrumb(key: string): string | null {
  if (key.startsWith("topic-")) {
    const meta = KEY_TO_TOPIC_MAP.get(key);
    if (meta) {
      const subj = meta.subject.charAt(0).toUpperCase() + meta.subject.slice(1);
      const cat = getDisplayCategory(meta.category, meta.gradeRange[0]);
      const topic = getDisplayTopic(meta.topic, meta.gradeRange[0]);
      return `${subj} › ${cat} › ${topic}`;
    }
  }
  if (key.startsWith("cat-")) {
    const topics = CAT_TO_TOPICS_MAP.get(key);
    if (topics && topics.length > 0) {
      const t = topics[0];
      return t.subject.charAt(0).toUpperCase() + t.subject.slice(1);
    }
  }
  return null;
}

// ── Static key list ───────────────────────────────────────────────────────────
// Prázdné — všechny klíče se generují dynamicky z getAllTopics() (buildTopicIllustrationKeys)
// a z DB tabulek (dynamicSubjectKeys, dynamicCategoryKeys, dynamicTopicKeys).
// Legacy klíče odstraněny — odpovídají deaktivovaným legacy topics.

const ALL_KEYS: string[] = [];

// ── Default prompts (mirror of edge function IMAGE_KEYS descriptions) ─────────

// PŘÍSNĚ POZITIVNÍ POPIS — bez negací. AI image modely extraktují slova z negace
// ("no owls" → vygeneruje sovu, "no text" → přidá text). Popisuj jen co tam JE.
// Negace patří jen do separátního negative_prompt pole (Pollinations má, Gemini ne).
//
// PROMPT_PREFIX záměrně NEnutí dítě do každé scény. Jednotlivé popisy
// v DEFAULT_DESCS/OVERRIDES rozhodují samy, jestli dítě/postava patří do scény
// (např. "topic-clovek-a-jeho-telo" → dítě má smysl; "topic-math-trojuhelnik" →
// jen geometrický útvar, žádná postava).
const PROMPT_PREFIX = "Cute 3D Pixar-style educational illustration for children's learning app, showing";
const PROMPT_SUFFIX = ". Single centered composition, smooth rounded volumetric 3D surfaces, soft cinematic shading, vibrant pastel colors with one strong accent. Clean pure solid white background. Modern professional 3D render quality, warm welcoming children's educational app aesthetic. Square format.";

const DISPLAY_PREFIX = "Vzdělávací 3D ilustrace —";
const DISPLAY_SUFFIX = "— moderní 3D styl pro 9–11leté, objekty a symboly oboru, pastelové barvy, bílé pozadí, bez textu";

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
  // 4. ročník — Geometrie v rovině a v prostoru
  "topic-matematika-geometrie-v-rovine-a-v-prostoru-rovinne-utvary": "tři druhy trojúhelníků vedle sebe — rovnostranný se třemi stejnými stranami, rovnoramenný se dvěma stejnými stranami a různostranný se třemi různými stranami, každý s popiskem",
  "topic-matematika-geometrie-v-rovine-a-v-prostoru-soumernost": "motýl s vyznačenou osou souměrnosti uprostřed, vlevo a vpravo zrcadlově shodná křídla, jednoduchá přerušovaná svislá osa",
  "topic-matematika-geometrie-v-rovine-a-v-prostoru-obvod-a-obsah": "čtverec a obdélník s vyznačenými šipkami kolem obvodu a vybarvenou plochou uvnitř, jednoduché míry u stran",
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

/** Vrátí popis pro jakýkoli klíč — pro dynamické položky z DB nebo TopicMetadata sestaví výchozí. */
function getAutoDesc(
  key: string,
  dbSubjects: { name: string; slug: string }[],
  dbCategories: { name: string; slug: string; description: string | null }[] = [],
  dbTopics: { name: string; slug: string; description: string | null }[] = [],
): string {
  const known = getDefaultDesc(key);
  if (known) return known;

  // POZN: Popisy jsou ČISTĚ POZITIVNÍ — žádné "no characters", "no people", "no animals".
  // AI image modely extraktují nouns z negace. Vše negativní → jen do negative_prompt pole.
  if (key.startsWith("subject-")) {
    const subjTopics = SUBJ_TO_TOPICS_MAP.get(key);
    if (subjTopics && subjTopics.length > 0) {
      const subjectName = subjTopics[0].subject;
      const categories = [...new Set(subjTopics.map((t) => t.category))].slice(0, 4).join(" and ");
      return `colorful 3D objects representing the school subject ${subjectName} (covering ${categories})`;
    }
    const slug = key.slice("subject-".length);
    const subject = dbSubjects.find((s) => s.slug === slug);
    if (subject) {
      return `colorful 3D objects representing the school subject ${subject.name}`;
    }
  }
  if (key.startsWith("cat-")) {
    const catTopics = CAT_TO_TOPICS_MAP.get(key);
    if (catTopics && catTopics.length > 0) {
      const catName = catTopics[0].category;
      const titles = catTopics.map((t) => t.title).slice(0, 3).join(" and ");
      return `3D objects representing ${catName} — including ${titles}`;
    }
    const parts = key.slice("cat-".length).split("-");
    const catSlug = parts.length > 1 ? parts.slice(1).join("-") : parts[0];
    const cat = dbCategories.find((c) => c.slug === catSlug);
    if (cat) {
      const base = cat.description || `the area ${cat.name}`;
      return `colorful 3D objects representing ${base}`;
    }
  }
  if (key.startsWith("topic-")) {
    const meta = KEY_TO_TOPIC_MAP.get(key);
    if (meta) {
      const brief = meta.briefDescription || meta.title;
      return `colorful 3D objects showing ${meta.title.toLowerCase()} — ${brief}`;
    }
    const parts = key.slice("topic-".length).split("-");
    const topSlug = parts.length > 2 ? parts.slice(2).join("-") : parts[parts.length - 1];
    const topic = dbTopics.find((t) => t.slug === topSlug);
    if (topic) {
      const base = topic.description || `the topic ${topic.name}`;
      return `colorful 3D objects showing ${base}`;
    }
  }
  return "";
}

// ── Filter helpers ────────────────────────────────────────────────────────────

function keyToSubject(key: string): string {
  // Legacy prefix shortcuts (hardcoded mapy)
  if (key === "subject-matematika" || key.startsWith("cat-math-") || key.startsWith("topic-math-")) return "matematika";
  if (key === "subject-cestina" || key.startsWith("cat-cz-") || key.startsWith("topic-cz-")) return "čeština";
  if (key === "subject-prirodoveda" || key.startsWith("topic-pr-")) return "přírodověda";
  if (key === "subject-vlastiveda" || key.startsWith("topic-vl-")) return "vlastivěda";
  // Dynamic subjects — subject-{slug} → slug
  if (key.startsWith("subject-")) return key.slice("subject-".length);
  // Dynamic categories — cat-{subject_slug}-{category_slug} → subject_slug
  if (key.startsWith("cat-")) {
    const rest = key.slice("cat-".length);
    const firstDash = rest.indexOf("-");
    return firstDash > 0 ? rest.slice(0, firstDash) : rest;
  }
  // Dynamic topics — topic-{subject_slug}-{category_slug}-{topic_slug} → subject_slug
  if (key.startsWith("topic-")) {
    const rest = key.slice("topic-".length);
    const firstDash = rest.indexOf("-");
    return firstDash > 0 ? rest.slice(0, firstDash) : rest;
  }
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
    // Legacy: imageKey z TOPIC_VISUALS_BY_SUBJECT (pokud existuje)
    const topicKey = getTopicImageKey(t.subject, t.topic);
    const catKey = getCategoryImageKey(t.subject, t.category);
    // Slug-based klíče pro všechna témata (grade-N topics)
    const subjSlug = toSlug(t.subject);
    const catSlug = toSlug(t.category);
    const topSlug = toSlug(t.topic);
    const slugTopicKey = `topic-${subjSlug}-${catSlug}-${topSlug}`;
    const slugCatKey = `cat-${subjSlug}-${catSlug}`;
    const slugSubjKey = `subject-${subjSlug}`;

    for (let g = t.gradeRange[0]; g <= t.gradeRange[1]; g++) {
      addKey(topicKey, g);
      addKey(catKey, g);
      addKey(slugTopicKey, g);
      addKey(slugCatKey, g);
      addKey(slugSubjKey, g);
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

// Dynamicky z aktivních topics — přidej nový ročník → automaticky se zobrazí nový předmět
function buildActiveSubjects(topics: ReturnType<typeof getAllTopics>): { value: string; label: string }[] {
  const seen = new Map<string, string>(); // slug → display name
  for (const t of topics) {
    const slug = toSlug(t.subject);
    if (!seen.has(slug)) seen.set(slug, t.subject);
  }
  return [...seen.entries()].map(([slug, name]) => ({
    value: slug,
    label: name.charAt(0).toUpperCase() + name.slice(1),
  }));
}

const SUBJECTS = buildActiveSubjects(getAllTopics());

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

  // ── Vlastní ilustrace ────────────────────────────────────────────────────────
  const [customKey, setCustomKey] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customGenerating, setCustomGenerating] = useState(false);
  const [customPreviewUrl, setCustomPreviewUrl] = useState<string | null>(null);
  const [customSaved, setCustomSaved] = useState(false);

  const versioned = useImageVersions();
  const gradeMap = useMemo(() => buildGradeMap(getAllTopics()), []);
  const codeTopicKeys = useMemo(() => buildTopicIllustrationKeys(getAllTopics()), []);

  // ── Dynamic DB hierarchy ─────────────────────────────────────────────────────
  const [dbSubjects, setDbSubjects] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [dbCategoriesState, setDbCategoriesState] = useState<{ id: string; name: string; slug: string; subject_id: string; description: string | null }[]>([]);
  const [dbTopicsState, setDbTopicsState] = useState<{ id: string; name: string; slug: string; category_id: string; description: string | null }[]>([]);

  // Klíče pro dynamické subjekty (ty, které nejsou v statickém ALL_KEYS)
  const dynamicSubjectKeys = useMemo(
    () =>
      dbSubjects
        .map((s) => `subject-${s.slug}`)
        .filter((k) => !ALL_KEYS.includes(k as (typeof ALL_KEYS)[number])),
    [dbSubjects]
  );

  // Dynamic category klíče: cat-{subject_slug}-{category_slug}
  const dynamicCategoryKeys = useMemo(() => {
    const subjBySlug = Object.fromEntries(dbSubjects.map((s) => [s.id, s.slug]));
    return dbCategoriesState
      .map((c) => `cat-${subjBySlug[c.subject_id]}-${c.slug}`)
      .filter((k) => !ALL_KEYS.includes(k as (typeof ALL_KEYS)[number]) && !k.includes("undefined"));
  }, [dbSubjects, dbCategoriesState]);

  // Dynamic topic klíče: topic-{subject_slug}-{category_slug}-{topic_slug}
  const dynamicTopicKeys = useMemo(() => {
    const subjBySlug = Object.fromEntries(dbSubjects.map((s) => [s.id, s.slug]));
    const catSubject = Object.fromEntries(dbCategoriesState.map((c) => [c.id, { slug: c.slug, subject_id: c.subject_id }]));
    return dbTopicsState
      .map((t) => {
        const cat = catSubject[t.category_id];
        if (!cat) return null;
        const subjSlug = subjBySlug[cat.subject_id];
        return `topic-${subjSlug}-${cat.slug}-${t.slug}`;
      })
      .filter((k): k is string => !!k && !ALL_KEYS.includes(k as (typeof ALL_KEYS)[number]));
  }, [dbSubjects, dbCategoriesState, dbTopicsState]);

  // Finální seznam všech klíčů — statické + DB dynamické + code-based (grade-N topics)
  const allKeys = useMemo(() => {
    const seen = new Set<string>(ALL_KEYS);
    const extra: string[] = [];
    for (const k of [...dynamicSubjectKeys, ...dynamicCategoryKeys, ...dynamicTopicKeys, ...codeTopicKeys]) {
      if (!seen.has(k)) { seen.add(k); extra.push(k); }
    }
    return [...ALL_KEYS, ...extra];
  }, [dynamicSubjectKeys, dynamicCategoryKeys, dynamicTopicKeys, codeTopicKeys]);

  // Filtrování předmětů — statické + dynamické subjekty
  const subjectFilterList = useMemo(
    () => [
      ...SUBJECTS,
      ...dbSubjects
        .filter((s) => !ALL_KEYS.includes(`subject-${s.slug}` as (typeof ALL_KEYS)[number]))
        .map((s) => ({ value: s.slug, label: s.name })),
    ],
    [dbSubjects]
  );

  // ── Logo state ───────────────────────────────────────────────────────────────
  const DEFAULT_LOGO_PROMPT = "a friendly chubby little owl mascot with big expressive round eyes, warm amber and orange feathers, wearing a small graduation cap tilted to one side, sitting upright with wings slightly open in a welcoming pose, smiling warmly";
  const [logoPrompt, setLogoPrompt] = useState(DEFAULT_LOGO_PROMPT);
  const [logoGenerating, setLogoGenerating] = useState(false);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoTextPreviewUrl, setLogoTextPreviewUrl] = useState<string | null>(null);
  const [logoSaving, setLogoSaving] = useState(false);

  const loadImages = async () => {
    // Načteme celou DB hierarchii pro dynamické klíče (subjects + categories + topics)
    const [subjRes, catRes, topRes] = await Promise.all([
      supabase.from("curriculum_subjects").select("id, name, slug").order("sort_order", { ascending: true }),
      supabase.from("curriculum_categories").select("id, name, slug, subject_id, description").order("sort_order", { ascending: true }),
      supabase.from("curriculum_topics").select("id, name, slug, category_id, description").order("sort_order", { ascending: true }),
    ]);
    const dbSubj = subjRes.data ?? [];
    const dbCat = catRes.data ?? [];
    const dbTop = topRes.data ?? [];
    setDbSubjects(dbSubj);
    setDbCategoriesState(dbCat);
    setDbTopicsState(dbTop);

    // Hierarchické mapování pro klíče
    const subjBySlug = Object.fromEntries(dbSubj.map((s) => [s.id, s.slug]));
    const catData = Object.fromEntries(dbCat.map((c) => [c.id, { slug: c.slug, subject_id: c.subject_id }]));

    const dynSubjKeys = dbSubj
      .map((s) => `subject-${s.slug}`)
      .filter((k) => !ALL_KEYS.includes(k as (typeof ALL_KEYS)[number]));

    const dynCatKeys = dbCat
      .map((c) => `cat-${subjBySlug[c.subject_id]}-${c.slug}`)
      .filter((k) => !ALL_KEYS.includes(k as (typeof ALL_KEYS)[number]) && !k.includes("undefined"));

    const dynTopKeys = dbTop
      .map((t) => {
        const cat = catData[t.category_id];
        if (!cat) return null;
        return `topic-${subjBySlug[cat.subject_id]}-${cat.slug}-${t.slug}`;
      })
      .filter((k): k is string => !!k);

    // Přidej code-based klíče (grade-N topics) — ty nejsou v DB ani v ALL_KEYS
    const codeKeys = buildTopicIllustrationKeys(getAllTopics());
    const seenKeys = new Set<string>(ALL_KEYS);
    const allKeysNow: string[] = [...ALL_KEYS];
    for (const k of [...dynSubjKeys, ...dynCatKeys, ...dynTopKeys, ...codeKeys]) {
      if (!seenKeys.has(k)) { seenKeys.add(k); allKeysNow.push(k); }
    }

    // Zkontroluj skutečnou existenci obrázků — HEAD na public URL každého klíče paralelně
    // (storage.list() vrací prázdno pro klienty s anon/publishable key)
    const checkResults = await Promise.all(
      allKeysNow.map(async (key) => {
        const url = supabase.storage.from("prvouka-images").getPublicUrl(`${key}.png`).data.publicUrl;
        try {
          const res = await fetch(url, { method: "HEAD", cache: "no-store" });
          return { key, exists: res.ok };
        } catch {
          return { key, exists: false };
        }
      })
    );
    const missing = new Set(checkResults.filter((r) => !r.exists).map((r) => r.key));
    setMissingKeys(missing);
    setAllImages(
      allKeysNow.map((key) => ({
        key,
        url: supabase.storage.from("prvouka-images").getPublicUrl(`${key}.png`).data.publicUrl,
      }))
    );
  };

  useEffect(() => {
    if (open && allImages.length === 0) { loadImages(); }
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

  /**
   * Pro grade-N klíče (KEY_TO_TOPIC_MAP) sestaví wrapped prompt z getAutoDesc().
   * Edge function tyhle klíče nezná, takže musíme posílat customPrompt.
   */
  /**
   * Odstraní z popisu konstrukce, které lákají AI rendrovat literální text/čísla.
   * AI vidí "1 000 000" a snaží se to namalovat jako digity — vyhneme se tomu.
   */
  const sanitizeForImagePrompt = (desc: string): string => {
    return desc
      // "0–1 000 000", "1 000 000", "100 000" — velká čísla → "very large numbers"
      .replace(/\d[\d\s,. –\-]{2,}\d/g, "very large quantities")
      // Samostatné víceciferné číslo → "numerical quantities"
      .replace(/\b\d{2,}\b/g, "numerical quantities")
      // Math symbols v textu (např. "<, >, =", "+, −, ×, ÷") → "comparison concepts"
      .replace(/symboly?\s+[<>=+\-−×÷,\s"']+/gi, "comparison concepts")
      .replace(/symbols?\s+[<>=+\-−×÷,\s"']+/gi, "comparison concepts")
      // Konkrétní math operátory v citacích → odstranit
      .replace(/[<>=]\s*[<>=]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const buildAutoCustomPrompts = (keys: string[]): Record<string, string> => {
    const out: Record<string, string> = {};
    for (const key of keys) {
      // Posílej custom prompt jen pro grade-N klíče (které jsou v KEY_TO_TOPIC_MAP)
      // nebo pro subject-{slug} který je z aktivních topics
      const meta = KEY_TO_TOPIC_MAP.get(key);
      const isCodeKey = !!meta || codeTopicKeys.includes(key);
      if (!isCodeKey) continue;
      const desc = getAutoDesc(key, dbSubjects, dbCategoriesState, dbTopicsState);
      const cleaned = sanitizeForImagePrompt(desc);
      if (cleaned) {
        out[key] = `${PROMPT_PREFIX} ${cleaned}${PROMPT_SUFFIX}`;
      }
    }
    return out;
  };

  const handleRegenerate = async (key: string, customPrompt?: string) => {
    setRegenerating(key);
    const body: Record<string, unknown> = { keys: [key], force: true };
    if (customPrompt) {
      body.customPrompts = { [key]: customPrompt };
    } else {
      const auto = buildAutoCustomPrompts([key]);
      if (auto[key]) body.customPrompts = auto;
    }
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

  const handleGenerateCustom = async () => {
    const key = toSlug(customKey);
    const desc = customDesc.trim();
    if (!key || !desc) return;
    setCustomGenerating(true);
    setCustomPreviewUrl(null);
    setCustomSaved(false);
    const fullPrompt = `${PROMPT_PREFIX} ${desc}${PROMPT_SUFFIX}`;
    const { data, error } = await supabase.functions.invoke("generate-prvouka-images", {
      body: { keys: [key], force: true, customPrompts: { [key]: fullPrompt } },
    });
    const perKeyError = (data?.errors as Record<string, string> | undefined)?.[key];
    if (error || perKeyError) {
      toast({ description: `Chyba: ${perKeyError ?? error?.message ?? "neznámá"}`, variant: "destructive" });
    } else {
      bumpImageVersion(key);
      const v = Date.now();
      const url = supabase.storage.from("prvouka-images").getPublicUrl(`${key}.png`).data.publicUrl;
      setCustomPreviewUrl(`${url}?v=${v}`);
      setCustomSaved(true);
      toast({ description: `✓ Ilustrace "${key}" uložena` });

      // Zaregistruj do DB — abychom ho viděli v admin panelu napříč zařízeními.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existing } = await (supabase as any)
        .from("custom_illustrations")
        .select("generations")
        .eq("key", key)
        .maybeSingle();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbErr } = await (supabase as any)
        .from("custom_illustrations")
        .upsert({
          key,
          description: desc,
          full_prompt: fullPrompt,
          generations: ((existing as { generations?: number } | null)?.generations ?? 0) + 1,
        }, { onConflict: "key" });
      if (dbErr) {
        console.warn(`[custom_illustrations] zápis selhal: ${dbErr.message}`);
      } else {
        // Refresh seznamu vlastních ilustrací
        loadCustomList();
      }
    }
    setCustomGenerating(false);
  };

  // ── Seznam vlastních ilustrací (z DB) ────────────────────────────────────────
  const [customList, setCustomList] = useState<Array<{ key: string; description: string; updated_at: string; generations: number }>>([]);
  const [customListLoading, setCustomListLoading] = useState(false);

  const loadCustomList = useCallback(async () => {
    setCustomListLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("custom_illustrations")
      .select("key, description, updated_at, generations")
      .order("updated_at", { ascending: false });
    if (error) {
      console.warn(`[custom_illustrations] load chyba: ${error.message}`);
    } else if (data) {
      setCustomList(data as typeof customList);
    }
    setCustomListLoading(false);
  }, []);

  useEffect(() => {
    if (open) loadCustomList();
  }, [open, loadCustomList]);

  const handleDeleteCustom = async (key: string) => {
    if (!window.confirm(`Smazat vlastní ilustraci "${key}"?\n(Soubor ${key}.png ve storage zůstane — smaž ho ručně v Supabase Studio pokud chceš.)`)) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("custom_illustrations")
      .delete()
      .eq("key", key);
    if (error) {
      toast({ description: `Chyba: ${error.message}`, variant: "destructive" });
    } else {
      toast({ description: `✓ Vlastní ilustrace "${key}" odstraněna z registru` });
      loadCustomList();
    }
  };

  const handleRegenerateCustom = (key: string, description: string) => {
    setCustomKey(key);
    setCustomDesc(description);
    setCustomPreviewUrl(null);
    setCustomSaved(false);
    // Scroll na sekci vlastní ilustrace
    document.querySelector("[data-section=\"custom-illustrace\"]")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        const autoPrompts = buildAutoCustomPrompts(chunk);
        const body: Record<string, unknown> = { keys: chunk, force };
        if (Object.keys(autoPrompts).length > 0) body.customPrompts = autoPrompts;
        const { data, error } = await supabase.functions.invoke("generate-prvouka-images", {
          body,
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

  const buildLogoWithText = async (sourceUrl: string): Promise<string> => {
    const resp = await fetch(sourceUrl);
    const blob = await resp.blob();
    const bmp = await createImageBitmap(blob);

    // Canvas: 2:1 poměr — levá polovina sova, pravá polovina text
    const H = 1024;
    const W = 2048;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Bílé pozadí
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Sova — 85 % výšky, vycentrovaná v levé polovině
    const owlSize = Math.round(H * 0.85);
    const owlX = Math.round((W / 2 - owlSize) / 2);
    const owlY = Math.round((H - owlSize) / 2);
    ctx.drawImage(bmp, owlX, owlY, owlSize, owlSize);

    // Text "Oli" — pravá polovina, vycentrovaný
    const fontSize = Math.round(H * 0.46);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const tx = W * 0.62;
    const ty = H / 2;

    // Stín
    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = Math.round(fontSize * 0.08);
    ctx.shadowOffsetX = Math.round(fontSize * 0.04);
    ctx.shadowOffsetY = Math.round(fontSize * 0.05);

    // Obrys (stroke) pro 3D dojem
    ctx.font = `900 ${fontSize}px 'Nunito', 'Poppins', 'Fredoka One', system-ui, sans-serif`;
    ctx.strokeStyle = "#c2410c";
    ctx.lineWidth = Math.round(fontSize * 0.06);
    ctx.lineJoin = "round";
    ctx.strokeText("Oli", tx, ty);

    // Výplň
    ctx.fillStyle = "#F97316";
    ctx.fillText("Oli", tx, ty);

    // Reset stínu
    ctx.shadowColor = "transparent";

    // Vrátíme data URL přímo — nepotřebujeme upload pro náhled
    return canvas.toDataURL("image/png");
  };

  // Uloží data URL blob do storage přes admin JWT (obchází RLS)
  const uploadLogoBlob = async (dataUrl: string, key: string): Promise<void> => {
    const base64 = dataUrl.split(",")[1];
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: "image/png" });
    const { data: { session } } = await supabase.auth.getSession();
    const jwt = session?.access_token;
    if (!jwt) throw new Error("Nejsi přihlášen");
    const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/prvouka-images/${key}.png`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
        "Content-Type": "image/png",
        "x-upsert": "true",
      },
      body: blob,
    });
    if (!resp.ok) {
      const msg = await resp.text().catch(() => resp.statusText);
      throw new Error(msg);
    }
  };

  const handleGenerateLogo = async () => {
    setLogoGenerating(true);
    setLogoPreviewUrl(null);
    setLogoTextPreviewUrl(null);

    const noTextPrompt = `${PROMPT_PREFIX} ${logoPrompt.trim()}${PROMPT_SUFFIX}`;
    const { data, error } = await supabase.functions.invoke("generate-prvouka-images", {
      body: { keys: ["app-logo-preview"], force: true, customPrompts: { "app-logo-preview": noTextPrompt } },
    });

    if (error || data?.errors?.["app-logo-preview"]) {
      toast({ description: `Chyba: ${data?.errors?.["app-logo-preview"] ?? error?.message}`, variant: "destructive" });
      setLogoGenerating(false);
      return;
    }

    const v = Date.now();
    const storageUrl = supabase.storage.from("prvouka-images").getPublicUrl("app-logo-preview.png").data.publicUrl;
    const previewUrl = `${storageUrl}?v=${v}`;
    setLogoPreviewUrl(previewUrl);

    // Verze s textem — canvas overlay, data URL (bez uploadu)
    try {
      const dataUrl = await buildLogoWithText(previewUrl);
      setLogoTextPreviewUrl(dataUrl);
    } catch (e) {
      toast({ description: `Chyba při sestavování verze s textem: ${e instanceof Error ? e.message : e}`, variant: "destructive" });
    }

    setLogoGenerating(false);
  };

  const handleConfirmLogo = async () => {
    if (!logoPreviewUrl || !logoTextPreviewUrl) return;
    setLogoSaving(true);

    try {
      // Bez textu — stáhnout preview ze storage a nahrát jako app-logo
      const previewResp = await fetch(logoPreviewUrl);
      if (!previewResp.ok) throw new Error("Nelze načíst náhled bez textu");
      const previewBlob = await previewResp.blob();
      const noTextDataUrl = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(previewBlob);
      });

      await Promise.all([
        uploadLogoBlob(noTextDataUrl, "app-logo"),
        uploadLogoBlob(logoTextPreviewUrl, "app-logo-text"),
      ]);

      bumpImageVersion("app-logo");
      bumpImageVersion("app-logo-text");
      setLogoPreviewUrl(null);
      setLogoTextPreviewUrl(null);
      toast({ description: "✓ Obě verze loga uloženy" });
    } catch (e) {
      toast({ description: `Chyba: ${e instanceof Error ? e.message : e}`, variant: "destructive" });
    }

    setLogoSaving(false);
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
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Wand2 className="h-4 w-4 text-primary" />
            Prompt pro ilustraci
            <span className="font-mono font-normal text-muted-foreground">{promptDialog?.key}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground mb-1.5">Popis obrázku (co má zobrazovat):</p>
            <Textarea
              rows={4}
              value={promptDialog?.desc ?? ""}
              onChange={(e) => setPromptDialog((prev) => prev ? { ...prev, desc: e.target.value } : null)}
              placeholder="Popiš, co má obrázek zobrazovat — v češtině nebo angličtině…"
              className="resize-none text-sm"
              autoFocus
            />
          </div>
          {/* Náhled výsledného promptu */}
          {promptDialog?.desc.trim() && (
            <div className="rounded-lg bg-muted/50 border border-border/60 p-3 space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Výsledný prompt (anglicky):</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed break-words">
                <span className="text-muted-foreground/60">{PROMPT_PREFIX} </span>
                <span className="text-foreground font-medium">{promptDialog.desc.trim()}</span>
                <span className="text-muted-foreground/60">{PROMPT_SUFFIX.slice(0, 60)}…</span>
              </p>
            </div>
          )}
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
            Generovat
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
              {allKeys.length - missingKeys.size} / {allKeys.length} vygenerováno
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* ── Vlastní ilustrace ── */}
        <div data-section="custom-illustrace" className="mt-5 rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Vlastní ilustrace</h3>
            <span className="text-xs text-muted-foreground ml-1">— pro landing page a jiné potřeby</span>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground mb-1">Klíč (diakritika a mezery se automaticky převedou na slug):</p>
              <input
                type="text"
                value={customKey}
                onChange={(e) => { setCustomKey(e.target.value); setCustomPreviewUrl(null); setCustomSaved(false); }}
                placeholder="např. landing rodič propojení → landing-rodic-propojeni"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {customKey.trim() && (
                <p className="text-[11px] text-muted-foreground mt-1">→ uloží se jako <code className="bg-muted px-1 rounded">{toSlug(customKey)}</code></p>
              )}
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground mb-1">Popis (co má obrázek zobrazovat):</p>
              <Textarea
                rows={3}
                value={customDesc}
                onChange={(e) => { setCustomDesc(e.target.value); setCustomPreviewUrl(null); setCustomSaved(false); }}
                placeholder="např. školák 9-10 let s tátou u počítače, procvičují společně příklady, teplá rodinná atmosféra"
                className="resize-none text-sm"
              />
            </div>
            {customDesc.trim() && (
              <div className="rounded-lg bg-muted/50 border border-border/60 p-2.5 space-y-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Výsledný prompt:</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed break-words">
                  <span className="text-muted-foreground/60">{PROMPT_PREFIX} </span>
                  <span className="text-foreground font-medium">{customDesc.trim()}</span>
                  <span className="text-muted-foreground/60">{PROMPT_SUFFIX.slice(0, 50)}…</span>
                </p>
              </div>
            )}
          </div>
          {customPreviewUrl && (
            <div className="flex items-center gap-4">
              <img src={customPreviewUrl} alt="náhled" className="h-24 w-24 object-contain rounded-xl border border-border/60 bg-white mix-blend-multiply shrink-0" />
              <div className="space-y-1">
                {customSaved && <p className="text-xs text-emerald-600 font-medium">✓ Uloženo jako <code className="bg-muted px-1 rounded text-[11px]">{toSlug(customKey)}</code></p>}
                <p className="text-[11px] text-muted-foreground">Klíč použij v kódu: <code className="bg-muted px-1 rounded">{`si("${toSlug(customKey)}")`}</code></p>
              </div>
            </div>
          )}
          <Button
            size="sm"
            disabled={customGenerating || !customKey.trim() || !customDesc.trim()}
            onClick={handleGenerateCustom}
            className="gap-1.5 w-full"
          >
            {customGenerating
              ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generuji…</>
              : <><Wand2 className="h-3.5 w-3.5" /> Generovat a uložit</>}
          </Button>

          {/* ── Seznam vlastních ilustrací (z DB) ── */}
          {customList.length > 0 && (
            <div className="pt-4 border-t border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-foreground">
                  Uložené vlastní ilustrace ({customList.length})
                </h4>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-[11px]"
                  onClick={loadCustomList}
                  disabled={customListLoading}
                >
                  <RefreshCw className={`h-3 w-3 ${customListLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {customList.map((it) => {
                  const url = supabase.storage.from("prvouka-images").getPublicUrl(`${it.key}.png`).data.publicUrl;
                  return (
                    <div key={it.key} className="rounded-xl border border-border/60 bg-card p-2 space-y-1.5">
                      <img
                        src={versioned(url, it.key)}
                        alt={it.key}
                        className="w-full aspect-square object-contain rounded-lg bg-white"
                        loading="lazy"
                      />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-mono text-foreground break-all" title={it.key}>{it.key}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2" title={it.description}>{it.description}</p>
                        <p className="text-[9px] text-muted-foreground/70">
                          {new Date(it.updated_at).toLocaleDateString("cs-CZ")} · {it.generations}× generováno
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-1.5 text-[10px] gap-1 flex-1"
                          onClick={() => handleRegenerateCustom(it.key, it.description)}
                          title="Upravit a přegenerovat"
                        >
                          <Pencil className="h-2.5 w-2.5" /> Upravit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-1.5 text-[10px] gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteCustom(it.key)}
                          title="Smazat z registru (soubor ve storage zůstává)"
                        >
                          <X className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Logo sekce — dočasně skrytá (logo je hotové) ── */}
        <div className="hidden mt-5 rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Logo aplikace</h3>
          </div>

          {!logoPreviewUrl && !logoTextPreviewUrl ? (
            <>
              <Textarea
                rows={3}
                value={logoPrompt}
                onChange={(e) => setLogoPrompt(e.target.value)}
                className="resize-none text-xs"
                placeholder="Popiš, jak má logo vypadat…"
              />
              <p className="text-[10px] text-muted-foreground italic">
                Bude obaleno: „{PROMPT_PREFIX} … {PROMPT_SUFFIX.slice(0, 40)}…"
              </p>
              <Button
                size="sm"
                disabled={logoGenerating || !logoPrompt.trim()}
                onClick={handleGenerateLogo}
                className="gap-1.5 w-full"
              >
                {logoGenerating
                  ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generuji náhled…</>
                  : <><Wand2 className="h-3.5 w-3.5" /> Generovat náhled</>}
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {logoPreviewUrl && (
                  <div className="text-center space-y-1">
                    <img src={logoPreviewUrl} alt="Bez textu" className="h-24 w-24 mx-auto object-contain rounded-xl border border-border/60 bg-white mix-blend-multiply" />
                    <p className="text-[10px] text-muted-foreground font-medium">Bez textu</p>
                  </div>
                )}
                {logoTextPreviewUrl && (
                  <div className="text-center space-y-1">
                    <img src={logoTextPreviewUrl} alt="S textem Oli" className="h-24 w-24 mx-auto object-contain rounded-xl border border-border/60 bg-white mix-blend-multiply" />
                    <p className="text-[10px] text-muted-foreground font-medium">S textem „Oli"</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Zkontroluj oba náhledy a potvrď, nebo vygeneruj znovu.</p>
              <div className="flex gap-2">
                <Button size="sm" disabled={logoSaving} onClick={handleConfirmLogo} className="gap-1.5 flex-1">
                  {logoSaving
                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Ukládám…</>
                    : <><Check className="h-3.5 w-3.5" /> Potvrdit a uložit obě</>}
                </Button>
                <Button size="sm" variant="outline" disabled={logoSaving}
                  onClick={() => { setLogoPreviewUrl(null); setLogoTextPreviewUrl(null); }}
                  className="gap-1.5"
                >
                  <X className="h-3.5 w-3.5" /> Zkusit znovu
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Filters ── */}
        <div className="mt-5 space-y-2">
          {/* Ročník */}
          <div className="flex flex-wrap gap-1.5">
            {chip(filterGrade === "all", () => setFilterGrade("all"), "Všechny ročníky")}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
              <React.Fragment key={g}>
                {chip(filterGrade === g, () => setFilterGrade(filterGrade === g ? "all" : g), `${g}.`)}
              </React.Fragment>
            ))}
          </div>
          {/* Předmět */}
          <div className="flex flex-wrap gap-1.5">
            {chip(filterSubject === "all", () => setFilterSubject("all"), "Všechny předměty")}
            {subjectFilterList.map(({ value, label }) => (
              <React.Fragment key={value}>
                {chip(
                  filterSubject === value,
                  () => setFilterSubject(filterSubject === value ? "all" : value),
                  label
                )}
              </React.Fragment>
            ))}
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
                    className="w-full aspect-square object-contain rounded-xl"
                    loading="lazy"
                    onError={() => setMissingKeys((prev) => new Set([...prev, key]))}
                  />
                )}
                {/* Lidský název (dětský) + breadcrumb + slug pro tech ref */}
                {(() => {
                  const label = getHumanLabel(key);
                  const breadcrumb = getHumanBreadcrumb(key);
                  const typeLabel = key.startsWith("subject-") ? "Předmět" : key.startsWith("cat-") ? "Okruh" : key.startsWith("topic-") ? "Téma" : "";
                  return (
                    <div className="mt-2 space-y-0.5">
                      {label ? (
                        <>
                          <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2" title={label}>
                            {label}
                          </p>
                          {breadcrumb && (
                            <p className="text-[10px] text-muted-foreground leading-tight line-clamp-1" title={breadcrumb}>
                              {typeLabel && <span className="font-medium">{typeLabel}: </span>}{breadcrumb}
                            </p>
                          )}
                          {!breadcrumb && typeLabel && (
                            <p className="text-[10px] text-muted-foreground leading-tight">{typeLabel}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2 font-mono" title={key}>{key}</p>
                      )}
                      <p className="text-[9px] text-muted-foreground/60 font-mono leading-tight line-clamp-1 pt-0.5" title={key}>
                        {key}
                      </p>
                    </div>
                  );
                })()}
                <div className="mt-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      // Neznámý klíč (dynamický subjekt) → nejdřív zobraz prompt
                      const isDynamic = !getDefaultDesc(key) && key.startsWith("subject-");
                      if (isDynamic) {
                        setPromptDialog({ key, desc: getAutoDesc(key, dbSubjects, dbCategoriesState, dbTopicsState) });
                      } else {
                        handleRegenerate(key);
                      }
                    }}
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
                    onClick={() => setPromptDialog({ key, desc: getAutoDesc(key, dbSubjects, dbCategoriesState, dbTopicsState) })}
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
