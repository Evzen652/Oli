import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

/** Odstraní bílé/světlé pozadí z PNG — vrátí průhledné PNG bytes. */
async function dewhiteBackground(imageBytes: Uint8Array, threshold = 245): Promise<Uint8Array> {
  try {
    const img = await Image.decode(imageBytes);
    const fade = threshold - 35;
    for (let y = 1; y <= img.height; y++) {
      for (let x = 1; x <= img.width; x++) {
        const pixel = img.getPixelAt(x, y);
        const r = (pixel >> 24) & 0xff;
        const g = (pixel >> 16) & 0xff;
        const b = (pixel >> 8) & 0xff;
        const brightness = (r + g + b) / 3;
        let alpha = (pixel) & 0xff;
        if (brightness > threshold) { alpha = 0; }
        else if (brightness > fade) { alpha = Math.round((threshold - brightness) * (255 / (threshold - fade))); }
        img.setPixelAt(x, y, Image.rgbaToColor(r, g, b, alpha));
      }
    }
    return await img.encode(0); // 0 = PNG
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

// Styl shodný s landing page ilustracemi: Pixar 3D, dětský hrdina/maskot + edukační objekty,
// dekorativní 3D písmena/čísla povolena (ABC, 5, +, ×), ale FORBIDDEN je narrative text.
const SUFFIX = `.

STYLE: Cute 3D Pixar-style illustration, smooth rounded volumetric surfaces, soft cinematic shading, vibrant but soft pastel colors with one strong accent. Warm, welcoming, kid-friendly. Like a high-quality children's educational app icon.

CHARACTER (warm anchor — required): exactly ONE cute friendly 3D cartoon CHARACTER with a clear face and expressive eyes — either:
  (a) a cheerful CHILD (boy or girl, age 8-10, friendly smile, optional glasses), OR
  (b) a stylized cartoon CREATURE (chubby owl, fox, bear cub) with big round eyes.
Character is actively engaged with the educational concept (holding, pointing, looking curious). Character is medium-sized — visible but not dominant; concept objects share equal weight.

CONCEPT OBJECTS (the topic — required): 3D sculpted objects clearly representing the topic. Examples:
- multiplication: multiple identical groups (3 rows of 4 colorful cubes)
- division: one group splitting into equal piles
- addition/subtraction: stacked colorful blocks in columns
- fractions: 3D pie slices or stacked bars in different colors
- rounding: arrows pointing up/down
- geometry: large 3D geometric shapes (triangle, circle, square)
- symmetry: mirrored shapes along visible axis
- data/charts: 3D bar or pie chart shape
- logic puzzles: magic-square grid of colored cubes
- reading/letters: large stylized 3D-sculpted decorative letters (A B C) on/around a book
- writing: notebook with abstract scribble lines (NOT readable words)

DECORATIVE TYPOGRAPHY (limited):
- ALLOWED: large 3D-sculpted SINGLE letters or digits as standalone design elements (sparkly 3D 'A', 3D number '5'), max 1-3 characters, never forming a word
- ALLOWED: 3D-sculpted math operators (+, ×, ÷, =)
- FORBIDDEN: narrative text, sentences, paragraphs, gibberish word-like text, fake writing
- FORBIDDEN: writing on chalkboards/posters/papers/screens, books with text on covers
- FORBIDDEN: any attempt to render real words — AI consistently fails

BACKGROUND: pure solid white (#FFFFFF), no gradient, no tint, no shadow — must allow alpha transparency.

COMPOSITION: square 1:1, single warm centered composition. The topic must be instantly recognizable.`;

function p(desc: string) { return `Cute 3D Pixar-style illustration depicting ${desc}${SUFFIX}`; }
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
    const url = `https://image.pollinations.ai/prompt/${encoded}?negative_prompt=${negative}&width=1024&height=1024&model=flux&nologo=true&private=true&seed=${seed}`;
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

  // Gemini 2.5 Flash Image primárně (přes Lovable Gateway) — výrazně lepší kvalita,
  // nevytváří gibberish text, lépe drží edukační koncept.
  // Pollinations/Flux jako záloha pokud Gemini selže (rate limit, content policy).
  const chain = [
    ...(LOVABLE_API_KEY ? [{ name: "lovable-gemini", run: tryLovable }] : []),
    { name: "pollinations", run: tryPollinations },
  ];

  let lastError: Error | null = null;
  for (const provider of chain) {
    try {
      console.log(`[generate-prvouka] Trying ${provider.name}...`);
      return await provider.run();
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      console.warn(`[generate-prvouka] ${provider.name} failed:`, lastError.message);
    }
  }
  throw lastError ?? new Error("Všichni provideři selhali.");
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
