import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

/**
 * Odstraní bílé/světlé pozadí z PNG — vrátí průhledné PNG bytes.
 *
 * Strategie:
 *  1. Flood-fill z okrajů obrázku (8 seed bodů) — pouze pozadí propojené s krajem
 *     se odstraní. Chrání bílé části UVNITŘ objektu (oči, papír v ruce).
 *  2. Threshold 230 (agresivnější než 245) — chytá i off-white od Gemini/Flux.
 *  3. Měkké okraje s anti-aliasem (fade zóna 50 stupňů).
 */
async function dewhiteBackground(imageBytes: Uint8Array, threshold = 230): Promise<Uint8Array> {
  try {
    const img = await Image.decode(imageBytes);
    const W = img.width;
    const H = img.height;
    const fade = threshold - 50; // 180 — pixely tmavší než 180 zůstanou plně neprůhledné

    // Pomocná funkce: brightness pixelu na 1-indexovaných souřadnicích
    const brightnessAt = (x: number, y: number): number => {
      const pixel = img.getPixelAt(x, y);
      const r = (pixel >> 24) & 0xff;
      const g = (pixel >> 16) & 0xff;
      const b = (pixel >> 8) & 0xff;
      return (r + g + b) / 3;
    };

    // ─── FLOOD-FILL z okrajů ──────────────────────────────────────────────
    // Seed body: CELÝ obvod obrázku — každý pixel na 4 stranách.
    // Robustnější než jen 8 bodů: zachytí pozadí i když jsou rohy zakryté objektem nebo stínem.
    const visited = new Uint8Array(W * H); // 0 = ne, 1 = pozadí (transparentní)
    const stack: number[] = [];
    const pushSeed = (x: number, y: number) => {
      if (brightnessAt(x, y) > fade) {
        stack.push((y - 1) * W + (x - 1));
      }
    };
    // Top + bottom row
    for (let x = 1; x <= W; x++) {
      pushSeed(x, 1);
      pushSeed(x, H);
    }
    // Left + right column (bez rohů — ty jsou už přidané)
    for (let y = 2; y < H; y++) {
      pushSeed(1, y);
      pushSeed(W, y);
    }

    while (stack.length > 0) {
      const idx = stack.pop()!;
      if (visited[idx]) continue;
      const px = (idx % W) + 1;
      const py = Math.floor(idx / W) + 1;
      if (px < 1 || px > W || py < 1 || py > H) continue;
      if (brightnessAt(px, py) <= fade) continue;
      visited[idx] = 1;
      if (px < W) stack.push(idx + 1);
      if (px > 1) stack.push(idx - 1);
      if (py < H) stack.push(idx + W);
      if (py > 1) stack.push(idx - W);
    }

    // ─── Aplikuj alpha jen na pixely označené flood-fillem ─────────────────
    for (let y = 1; y <= H; y++) {
      for (let x = 1; x <= W; x++) {
        const idx = (y - 1) * W + (x - 1);
        if (!visited[idx]) continue; // pixel uvnitř objektu — nech být
        const pixel = img.getPixelAt(x, y);
        const r = (pixel >> 24) & 0xff;
        const g = (pixel >> 16) & 0xff;
        const b = (pixel >> 8) & 0xff;
        const brightness = (r + g + b) / 3;
        let alpha = pixel & 0xff;
        if (brightness > threshold) {
          alpha = 0;
        } else if (brightness > fade) {
          // Anti-alias okraj: hladký přechod od plné průhlednosti k plné neprůhlednosti
          alpha = Math.round(255 * (threshold - brightness) / (threshold - fade));
          alpha = Math.max(0, Math.min(255, alpha));
        }
        img.setPixelAt(x, y, Image.rgbaToColor(r, g, b, alpha));
      }
    }
    return await img.encode(0); // PNG
  } catch (e) {
    console.warn("dewhiteBackground failed, using original:", e);
    return imageBytes;
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// PŘÍSNĚ POZITIVNÍ POPIS — bez negací. AI extrahuje noun z "no X" a přidá ho do obrázku.
// Popisuj POUZE co tam má být. Co nemá být tam → jen v separátním negative_prompt poli.
const SUFFIX = `. Single centered composition, smooth rounded volumetric 3D surfaces, soft cinematic shading, vibrant pastel colors with one strong accent. Clean pure solid white background. Modern professional 3D render quality, warm welcoming children's educational app aesthetic. Square format.`;

function p(desc: string) { return `Cute 3D Pixar-style illustration. A cheerful smiling human child (boy or girl, age 8 to 10, big expressive eyes, optional glasses, modern casual colorful clothes) engaged with ${desc}${SUFFIX}`; }
const concept = p;
const scene = p;

// All keys to generate images for
const IMAGE_KEYS: Record<string, string> = {
  // ── UI ilustrace ──────────────────────────────────────────
  "ui-child-desk": scene("a happy smiling child sitting at a wooden school desk, open notebook and pencil on the desk, bright colorful classroom background with a chalkboard"),
  "ui-focus-target": scene("a friendly cheerful owl teacher pointing at a glowing golden star target on a board, encouraging smile, colorful classroom setting"),

  // ── SUBJECTS ──────────────────────────────────────────────
  "subject-matematika": concept("colorful 3D abacus with bright red and blue beads, plus sign and equals sign shapes, counting blocks stacked"),
  "subject-cestina": concept("open book with colorful alphabet letters flying out of the pages, fountain pen beside it"),
  "subject-prvouka": scene("a friendly owl sitting on a tree branch with sun, flowers, and a small butterfly nearby"),
  "subject-prirodoveda": concept("large magnifying glass over a detailed green leaf showing veins and cells"),
  "subject-vlastiveda": concept("a stylized map shape of Czech Republic with a small castle silhouette and a flag on top"),

  // ── PRVOUKA: Categories ───────────────────────────────────
  "cat-clovek-a-jeho-telo": scene("a cheerful child with arms outstretched, glowing heart and lungs visible inside the body"),
  "cat-priroda-kolem-nas": scene("lush nature scene with a tall tree, blooming flowers, bright sun, birds, and a small pond"),
  "cat-lide-a-spolecnost": scene("a colorful neighborhood with houses, a school building, and people waving to each other"),
  "cat-orientace-v-prostoru-a-case": concept("a large compass rose with four directional arrows, an analog clock face, and a calendar page"),

  // ── PRVOUKA: Topics ───────────────────────────────────────
  "topic-lidske-telo": scene("a transparent human body outline with colorful glowing organs: heart, lungs, stomach, brain"),
  "topic-smysly": concept("five sense icons arranged in a circle: eye, ear, nose, lips, hand — each a different bright color"),
  "topic-zdravi-a-hygiena": scene("a child washing hands with large soap bubbles, a toothbrush, a red apple, and a glass of water"),
  "topic-rostliny": concept("a large sunflower plant showing roots underground, green stem, leaves, and yellow flower head"),
  "topic-zvirata": scene("six friendly animals together: dog, cat, deer, bird, butterfly, fish — in a colorful meadow"),
  "topic-rocni-obdobi-a-pocasi": concept("four quadrants each showing a season: pink cherry blossom, bright sun, orange falling leaves, white snowflake"),
  "topic-nase-zeme": concept("a stylized outline of Czech Republic as a colorful map shape with a small castle and red-white-blue flag"),
  "topic-rodina-a-spolecnost": scene("a warm family scene with parents, two children, and grandparents all smiling together"),
  "topic-rodina-a-pravidla-chovani": scene("two children greeting an elderly neighbor, one holding a door open, friendly smiles"),
  "topic-obec-a-mesto": scene("a charming small town with a town hall, church tower, school, and green park"),
  "topic-ceska-republika": concept("Prague Castle silhouette on a hill with Charles Bridge arches below and a small Czech flag"),
  "topic-svetove-strany-a-mapa": concept("a large ornate compass rose with four bold directional arrows pointing North South East West"),
  "topic-cas-a-kalendar": concept("a large analog clock face showing nine o'clock, next to a calendar page with a day circled"),

  // ── MATEMATIKA: Categories ────────────────────────────────
  "cat-math-cisla-a-operace": concept("colorful 3D digit blocks stacked with a plus sign and equals sign between them, bright and bold"),
  "cat-math-zlomky": concept("a large circle split into four equal colored sections — red, blue, yellow, green — one section slightly pulled out"),
  "cat-math-geometrie": concept("four bold geometric shapes: red circle, blue square, yellow triangle, green rectangle — arranged in a square layout"),

  // ── MATEMATIKA: Topics ────────────────────────────────────
  "topic-math-porovnavani-prirozenych-cisel": concept("two piles of colorful balls, one large pile and one small pile, with a bold arrow pointing from large to small"),
  "topic-math-scitani-a-odcitani-do-100": concept("two groups of colored counting cubes being pushed together with a plus arrow between them"),
  "topic-math-nasobeni-a-deleni": concept("four rows of three colorful stars arranged in a grid, a multiplication symbol between two groups"),
  "topic-math-zaokrouhlovani": concept("a curved arrow bouncing from a midpoint on a number line to the nearest larger round mark"),
  "topic-math-razeni-cisel": concept("five colorful blocks of different heights arranged from shortest to tallest in a row"),
  "topic-math-porovnavani-zlomku": concept("two bars side by side: left bar three-quarters filled in yellow, right bar one-half filled in blue"),
  "topic-math-kraceni-zlomku": concept("a large rectangle divided into eight equal sections with four highlighted, arrow pointing to same rectangle divided in two with one highlighted"),
  "topic-math-rozsireni-zlomku": concept("a circle split in three with one colored section, arrow pointing to same circle split in nine with three colored sections"),
  "topic-math-scitani-zlomku": concept("two pie charts side by side — one showing one-quarter slice, one showing two-quarter slices — with a plus symbol between them"),
  "topic-math-odcitani-zlomku": concept("a pie chart with three-quarters colored, one slice being lifted away, minus symbol visible"),
  "topic-math-smisena-cisla": concept("two whole colored circles next to one half-colored circle, arranged in a clean row"),
  "topic-math-zlomek-z-cisla": concept("twelve apples arranged in three rows of four, three apples highlighted in bright red while the rest are green"),
  "topic-math-nasobeni-zlomku-celym-cislem": concept("three identical quarter-pie pieces in a row, separated by plus symbols, combining into one three-quarter pie"),
  "topic-math-geometricke-tvary": concept("bold flat geometric shapes with measurement marks: a square with equal side marks, triangle, circle, pentagon"),
  "topic-math-obvod": concept("a rectangle with a dotted line tracing around its full perimeter, small arrows on each side"),

  // ── MATEMATIKA: Měření ────────────────────────────────────
  "topic-math-mereni-delky": concept("a bright yellow ruler measuring a pencil lying beside it, centimeter marks clearly visible"),
  "topic-math-zakladni-jednotky": concept("three rulers of dramatically different lengths arranged from tiny to very long, stacked vertically"),
  "topic-math-prevody-jednotek": concept("two measuring tapes of different scales connected by a bold double-headed arrow"),
  "topic-math-odhad-delek": concept("a hand with a question mark above it hovering over a shoe, both items have dotted measurement lines"),
  "topic-math-jednotky-hmotnosti": concept("a balance scale perfectly level with a small apple on one side and a weight on the other"),
  "topic-math-slovni-ulohy-delky": concept("a colorful ribbon being cut by scissors, a ruler measuring the piece being cut"),
  "topic-math-objem-ml-l": concept("a tall measuring jug with colored liquid showing a fill line, next to a large water bottle"),

  // ── ČEŠTINA: Categories ───────────────────────────────────
  "cat-cz-vyjmenovana-slova": concept("a large magnifying glass focusing on a single letter Y on an open book page"),
  "cat-cz-pravopis": concept("a notebook page with a bold red pencil drawing a checkmark and an X, correction marks"),
  "cat-cz-mluvnice": concept("three colorful speech bubbles connected by arrows in a tree structure, each a different color"),
  "cat-cz-diktat": concept("a notebook with a line of text that has a blank gap, with a pencil filling in the missing space"),

  // ── ČEŠTINA: Topics ───────────────────────────────────────
  "topic-cz-vyjm-b": concept("a large bold letter B glowing in the center, surrounded by a house, a bicycle, and a bee icon"),
  "topic-cz-vyjm-l": concept("a large bold letter L glowing in the center, surrounded by a ski, a fox, and a linden leaf icon"),
  "topic-cz-vyjm-m": concept("a large bold letter M glowing in the center, surrounded by a soap bubble, a bear, and a thought cloud icon"),
  "topic-cz-vyjm-p": concept("a large bold letter P glowing in the center, surrounded by a bag, a dog, and a sand icon"),
  "topic-cz-vyjm-s": concept("a large bold letter S glowing in the center, surrounded by a cheese wedge, an owl, and a salt shaker icon"),
  "topic-cz-vyjm-v": concept("a large bold letter V glowing in the center, surrounded by a wolf, a tower, and a willow tree icon"),
  "topic-cz-vyjm-z": concept("a large bold letter Z glowing in the center, surrounded by a tongue, a castle, and a bell icon"),
  "topic-cz-parove-souhlasky": concept("two pairs of colorful letter-shaped 3D blocks side by side, one pair soft blue and one pair warm orange"),
  "topic-cz-tvrde-mekke": concept("two groups of colorful letter-shaped blocks separated by a dividing line: hard group in blue, soft group in orange"),
  "topic-cz-velka-pismena": concept("a large ornate capital letter A next to a small lowercase a, crown above the capital letter"),
  "topic-cz-slovni-druhy": concept("three colorful speech bubbles in different shapes: round, square, and star — each a different vivid color representing different word types"),
  "topic-cz-rod-cislo": concept("three distinct silhouette shapes: tall blue, smaller pink, and round yellow — each with a small symbol above"),
  "topic-cz-slovesa-urcovani": concept("a colorful grid of six cells arranged in two rows and three columns, each cell a different color"),
  "topic-cz-zaklad-vety": concept("a horizontal line with two distinct colorful segments: one bold underlined segment in blue, one circled segment in red"),
  "topic-cz-diktat": concept("a notebook page with three dotted blank lines in the middle of a sentence, a pencil hovering above ready to write"),

  // ── ČEŠTINA: Sloh ─────────────────────────────────────────
  "cat-cz-sloh": scene("a child sitting at a desk writing in a notebook, colorful story bubbles with a dragon and castle floating above"),
  "topic-cz-sloh-vypraveni": scene("a child excitedly telling a story with a large speech bubble showing a castle, dragon, and hero"),
  "topic-cz-sloh-popis": concept("a large magnifying glass over a red apple, with descriptive arrows pointing to its color, shape, and texture"),
};

/**
 * Generuje obrázek přes preferovaný provider.
 *
 * Priorita podle env IMAGE_PROVIDER:
 *   "lovable"      → Lovable Gateway prefer, Gemini direct fallback
 *   "gemini"       → Gemini direct prefer, Lovable fallback
 *   (nenastaveno)  → default: Lovable prefer (využít předplacený kredit),
 *                    Gemini fallback
 *
 * Vrací { base64, contentType } nebo throws Error.
 */
async function generateImage(prompt: string): Promise<{ base64: string; contentType: string }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

  const tryPollinations = async () => {
    const encoded = encodeURIComponent(prompt);
    const negative = encodeURIComponent([
      // FORBIDDEN: animals (jsou tu výhradně děti)
      "animal", "animals", "owl", "fox", "bear", "cat", "dog", "rabbit", "bird",
      "creature", "mascot animal", "animal character", "cartoon animal",
      "anthropomorphic animal", "stuffed toy",
      // FORBIDDEN: narrative text (gibberish, paragraphs)
      "gibberish text", "fake text", "nonsense letters", "blurry text",
      "handwriting on paper", "writing on chalkboard", "writing on whiteboard",
      "writing on signs", "text on book covers", "text on screens",
      "paragraphs", "sentences", "captions", "labels", "watermark", "logo", "signature",
      "math problems written out", "homework with text",
      // Background artifacts (we want pure white)
      "colored background", "tinted background", "gradient background",
      "wood texture", "table surface", "floor", "wall", "scenery", "environment",
      // Quality
      "blurry", "low quality", "deformed face", "ugly", "extra fingers", "extra limbs",
    ].join(", "));
    const seed = Math.floor(Math.random() * 999999);
    // private=true → nezveřejňovat v public feedu
    // (enhance ponecháváme default — Pollinations LLM může pomoct enrichovat Pixar styl)
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&model=flux&seed=${seed}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Pollinations error ${resp.status}`);
    const bytes = new Uint8Array(await resp.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return { base64: btoa(binary), contentType: "image/jpeg" };
  };

  const tryLovable = async () => {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });
    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`Lovable error ${resp.status}: ${t.slice(0, 200)}`);
    }
    const data = await resp.json();
    const dataUrl: string | undefined = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!dataUrl?.startsWith("data:image/")) throw new Error("No image in Lovable response");
    const base64 = dataUrl.split(",")[1];
    const mimeMatch = dataUrl.match(/data:(image\/\w+);/);
    return { base64, contentType: mimeMatch?.[1] ?? "image/png" };
  };

  // Imagen 3 (Google API) — stabilní model pro image generation, jiný endpoint než generateContent.
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  const tryGeminiDirect = async () => {
    // Imagen 3 via Google Generative Language API — predict endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`;
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: "1:1" },
      }),
    });
    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`Imagen3 error ${resp.status}: ${t.slice(0, 300)}`);
    }
    const data = await resp.json();
    const b64 = data.predictions?.[0]?.bytesBase64Encoded;
    const mime = data.predictions?.[0]?.mimeType ?? "image/png";
    if (!b64) throw new Error("No image in Imagen3 response: " + JSON.stringify(data).slice(0, 200));
    return { base64: b64, contentType: mime };
  };

  // Priorita: Gemini direct (kvalita, instruction-following) → Lovable Gemini (záloha) → Pollinations (last resort).
  const chain = [
    ...(GEMINI_API_KEY ? [{ name: "gemini-direct", run: tryGeminiDirect }] : []),
    ...(LOVABLE_API_KEY ? [{ name: "lovable-gemini", run: tryLovable }] : []),
    { name: "pollinations", run: tryPollinations },
  ];

  const errors: string[] = [];
  for (const provider of chain) {
    try {
      console.log(`[generate-prvouka] Trying ${provider.name}...`);
      return await provider.run();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${provider.name}: ${msg}`);
      console.warn(`[generate-prvouka] ${provider.name} failed:`, msg);
    }
  }
  throw new Error(`Všichni provideri selhali — ${errors.join(" | ")}`);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));

    // ── save-image action: uloží base64 obrázek přímo do storage (service role) ──
    if (body.action === "save-image") {
      const { key, base64, contentType = "image/png" } = body;
      if (!key || !base64) {
        return new Response(JSON.stringify({ error: "Missing key or base64" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const bytes = decode(base64);
      const { error: uploadErr } = await supabase.storage
        .from("prvouka-images")
        .upload(`${key}.png`, bytes, { contentType, upsert: true });
      if (uploadErr) {
        return new Response(JSON.stringify({ error: uploadErr.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: urlData } = supabase.storage.from("prvouka-images").getPublicUrl(`${key}.png`);
      return new Response(JSON.stringify({ url: urlData.publicUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const requestedKeys: string[] = body.keys ?? Object.keys(IMAGE_KEYS);
    const force: boolean = body.force === true;
    const customPrompts: Record<string, string> = body.customPrompts ?? {};

    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    const pref = Deno.env.get("IMAGE_PROVIDER") ?? "lovable";
    const primary = pref === "gemini"
      ? (geminiKey ? "gemini-direct" : (lovableKey ? "lovable-gateway (fallback)" : "none"))
      : (lovableKey ? "lovable-gateway" : (geminiKey ? "gemini-direct (fallback)" : "none"));
    console.log(`[generate-prvouka-images] Preference: ${pref}, Primary: ${primary}`);

    // Ensure bucket exists (auto-create if missing)
    const { error: bucketError } = await supabase.storage.createBucket("prvouka-images", {
      public: true,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    });
    if (bucketError && !bucketError.message.includes("already exists")) {
      console.warn("Bucket create warning:", bucketError.message);
    }

    const results: Record<string, string> = {};
    const errors: Record<string, string> = {};

    for (const key of requestedKeys) {
      let prompt = customPrompts[key] ?? IMAGE_KEYS[key];

      // Dynamický subjekt (subject-{slug}) — vygeneruj výchozí prompt z DB
      if (!prompt && key.startsWith("subject-")) {
        const slug = key.slice("subject-".length);
        const { data: subjectRow } = await supabase
          .from("curriculum_subjects")
          .select("name")
          .eq("slug", slug)
          .maybeSingle();
        if (subjectRow?.name) {
          prompt = p(
            `school textbook for the subject "${subjectRow.name}" with relevant educational icons and colorful symbols floating around it, cheerful academic theme`
          );
          console.log(`[generate-prvouka] Dynamic subject prompt for ${key}: ${prompt.slice(0, 80)}…`);
        }
      }

      // Dynamic category (cat-{subject_slug}-{category_slug}) → prompt z DB description
      if (!prompt && key.startsWith("cat-")) {
        const rest = key.slice("cat-".length);
        const firstDash = rest.indexOf("-");
        if (firstDash > 0) {
          const subjectSlug = rest.slice(0, firstDash);
          const categorySlug = rest.slice(firstDash + 1);
          // JOIN s subject přes subject_id
          const { data: subj } = await supabase
            .from("curriculum_subjects")
            .select("id, name")
            .eq("slug", subjectSlug)
            .maybeSingle();
          if (subj?.id) {
            const { data: cat } = await supabase
              .from("curriculum_categories")
              .select("name, description")
              .eq("subject_id", subj.id)
              .eq("slug", categorySlug)
              .maybeSingle();
            if (cat?.name) {
              const base = cat.description || `topic area "${cat.name}" in subject ${subj.name}`;
              prompt = p(`${base}, visually rich illustration of symbols and elements from this area`);
              console.log(`[generate-prvouka] Dynamic category prompt for ${key}`);
            }
          }
        }
      }

      // Dynamic topic (topic-{subject_slug}-{category_slug}-{topic_slug}) → prompt z DB
      if (!prompt && key.startsWith("topic-")) {
        const rest = key.slice("topic-".length);
        const firstDash = rest.indexOf("-");
        if (firstDash > 0) {
          const subjectSlug = rest.slice(0, firstDash);
          const remaining = rest.slice(firstDash + 1);
          // Najdi všechna témata pod tímto subjektem a hledej match na "cat-slug-topic-slug"
          const { data: subj } = await supabase
            .from("curriculum_subjects")
            .select("id")
            .eq("slug", subjectSlug)
            .maybeSingle();
          if (subj?.id) {
            const { data: cats } = await supabase
              .from("curriculum_categories")
              .select("id, slug")
              .eq("subject_id", subj.id);
            for (const cat of cats ?? []) {
              if (remaining.startsWith(cat.slug + "-")) {
                const topicSlug = remaining.slice(cat.slug.length + 1);
                const { data: top } = await supabase
                  .from("curriculum_topics")
                  .select("name, description")
                  .eq("category_id", cat.id)
                  .eq("slug", topicSlug)
                  .maybeSingle();
                if (top?.name) {
                  const base = top.description || `specific topic "${top.name}"`;
                  prompt = p(`${base}, concrete visual scene from this topic`);
                  console.log(`[generate-prvouka] Dynamic topic prompt for ${key}`);
                  break;
                }
              }
            }
          }
        }
      }

      if (!prompt) {
        errors[key] = "Unknown key";
        continue;
      }

      try {
        // Skip pokud obrázek už existuje v storage (a není force)
        const { data: existing } = force ? { data: null } : await supabase.storage
          .from("prvouka-images")
          .list("", { search: `${key}.png` });
        if (!force && existing && existing.length > 0) {
          const { data: publicUrlData } = supabase.storage
            .from("prvouka-images")
            .getPublicUrl(`${key}.png`);
          results[key] = publicUrlData.publicUrl;
          console.log(`⏭ ${key} already exists, skipping`);
          continue;
        }

        console.log(`Generating image for: ${key}`);

        const { base64 } = await generateImage(prompt);
        const rawBytes = decode(base64);

        // Odstraní bílé pozadí → průhledné PNG
        const imageBytes = await dewhiteBackground(rawBytes);

        // Always save as .png — imageUrl() in prvoukaVisuals defaults to .png
        const filePath = `${key}.png`;
        const { error: uploadError } = await supabase.storage
          .from("prvouka-images")
          .upload(filePath, imageBytes, {
            contentType: "image/png",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload error for ${key}:`, uploadError);
          errors[key] = `Upload error: ${uploadError.message}`;
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("prvouka-images")
          .getPublicUrl(filePath);

        results[key] = publicUrlData.publicUrl;
        console.log(`✓ ${key} -> ${publicUrlData.publicUrl}`);

        // Krátká pauza mezi requesty
        await new Promise((r) => setTimeout(r, 500));
      } catch (e) {
        console.error(`Error for ${key}:`, e);
        errors[key] = e instanceof Error ? e.message : "Unknown error";
      }
    }

    return new Response(
      JSON.stringify({ results, errors }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("Function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
