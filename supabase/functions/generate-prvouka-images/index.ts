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

/**
 * SYSTÉM ILUSTRACÍ
 * edu() — 3D symboly, žádné dítě (cat-*, subject-*)
 * kid() — dítě v akci (topic-*)
 * Krátký prompt = model ho lépe sleduje. Max 3 objekty.
 */
function edu(objects: string): string {
  return `NO TEXT NO WORDS NO LETTERS. 3D Pixar icon: ${objects}. White background, smooth glossy rounded 3D shapes, soft pastel colors, centered.`;
}
function kid(activity: string): string {
  return `NO TEXT NO WORDS NO LETTERS. 3D Pixar: cheerful child age 8-10 ${activity}. White background, smooth rounded 3D shapes, soft pastel colors.`;
}
const scene = kid;
const concept = edu;
const icon = edu;

// All keys to generate images for
const IMAGE_KEYS: Record<string, string> = {
  // ── UI ilustrace ──────────────────────────────────────────
  "ui-child-desk": kid("sitting at a school desk with a pencil and notebook"),
  "ui-focus-target": kid("pointing at a glowing golden star target"),

  // ── SUBJECTS ──────────────────────────────────────────────
  "subject-matematika": edu("colorful abacus beads, plus sign, counting cubes"),
  "subject-cestina": edu("speech bubble, fountain pen, colorful letter A"),
  "subject-prvouka": edu("bright sun, green tree, small butterfly"),
  "subject-prirodoveda": edu("magnifying glass over a green leaf"),
  "subject-vlastiveda": edu("map shape of Czech Republic, small castle, flag"),

  // ── PRVOUKA: Categories ───────────────────────────────────
  "cat-clovek-a-jeho-telo": kid("with glowing colorful organs visible inside — heart, lungs, brain — like an x-ray illustration"),
  "cat-priroda-kolem-nas": kid("sitting in a sunny meadow with a tall tree, blooming flowers and a butterfly nearby"),
  "cat-lide-a-spolecnost": kid("waving in a cheerful neighborhood with small colorful houses and a school behind them"),
  "cat-orientace-v-prostoru-a-case": kid("holding a large compass and looking at a round clock floating beside them"),

  // ── PRVOUKA: Topics ───────────────────────────────────────
  "topic-lidske-telo": kid("with colorful glowing organs visible: heart, lungs, brain"),
  "topic-smysly": edu("eye, ear, nose, lips, hand — five sense symbols in a circle"),
  "topic-zdravi-a-hygiena": kid("washing hands with big soap bubbles, toothbrush nearby"),
  "topic-rostliny": edu("sunflower showing roots, stem, leaves, flower head"),
  "topic-zvirata": edu("dog, cat, bird, butterfly — four friendly animal icons"),
  "topic-rocni-obdobi-a-pocasi": edu("four season symbols: cherry blossom, sun, falling leaf, snowflake"),
  "topic-nase-zeme": edu("Czech Republic map shape, castle, red-white-blue flag"),
  "topic-rodina-a-spolecnost": kid("waving alongside two smaller child figures and two adult figures"),
  "topic-rodina-a-pravidla-chovani": kid("holding a door open, smiling"),
  "topic-obec-a-mesto": edu("town hall, church tower, school building — small town trio"),
  "topic-ceska-republika": edu("Prague Castle silhouette, Charles Bridge arch, Czech flag"),
  "topic-svetove-strany-a-mapa": edu("large compass rose with four bold directional arrows"),
  "topic-cas-a-kalendar": edu("analog clock showing nine o'clock, calendar page with circled day"),

  // ── MATEMATIKA: Categories ────────────────────────────────
  "cat-math-cisla-a-operace": kid("stacking colorful numbered 3D blocks with a big plus and equals symbol floating nearby"),
  "cat-math-zlomky": kid("slicing a colorful round cake into equal pieces with a happy expression"),
  "cat-math-geometrie": kid("juggling colorful 3D shapes — sphere, cube, cone, cylinder"),

  // ── MATEMATIKA: Topics ────────────────────────────────────
  "topic-math-porovnavani-prirozenych-cisel": edu("large pile of balls vs small pile, bold arrow between them"),
  "topic-math-scitani-a-odcitani-do-100": edu("two groups of colored cubes with plus arrow between them"),
  "topic-math-nasobeni-a-deleni": edu("grid of colorful stars, multiplication symbol"),
  "topic-math-zaokrouhlovani": edu("curved arrow bouncing on a number line to a round mark"),
  "topic-math-razeni-cisel": edu("five colorful blocks arranged shortest to tallest"),
  "topic-math-porovnavani-zlomku": edu("two bars: left three-quarters yellow, right one-half blue"),
  "topic-math-kraceni-zlomku": edu("rectangle in eight sections → same rectangle in two sections, arrow"),
  "topic-math-rozsireni-zlomku": edu("circle in three parts one colored → same circle in nine parts three colored"),
  "topic-math-scitani-zlomku": edu("two pie slices with plus symbol between them"),
  "topic-math-odcitani-zlomku": edu("pie chart with one slice being lifted away, minus symbol"),
  "topic-math-smisena-cisla": edu("two whole colored circles next to one half-colored circle"),
  "topic-math-zlomek-z-cisla": edu("twelve apples in rows, three highlighted bright red"),
  "topic-math-nasobeni-zlomku-celym-cislem": edu("three quarter-pie pieces in a row combining into one"),
  "topic-math-geometricke-tvary": edu("square, triangle, circle, pentagon — bold geometric shapes"),
  "topic-math-obvod": edu("rectangle with dotted line tracing its perimeter"),
  "topic-math-mereni-delky": edu("yellow ruler next to a pencil"),
  "topic-math-zakladni-jednotky": edu("three rulers of dramatically different lengths"),
  "topic-math-prevody-jednotek": edu("two measuring tapes connected by double-headed arrow"),
  "topic-math-odhad-delek": edu("hand hovering over a shoe with dotted measurement lines"),
  "topic-math-jednotky-hmotnosti": edu("balance scale with apple on one side, weight on other"),
  "topic-math-slovni-ulohy-delky": edu("ribbon being cut by scissors, ruler measuring it"),
  "topic-math-objem-ml-l": edu("measuring jug with colored liquid, large water bottle"),

  // ── ČEŠTINA: Categories ───────────────────────────────────
  "cat-cz-vyjmenovana-slova": kid("holding a large glowing magnifying glass with a curious expression"),
  "cat-cz-pravopis": kid("giving a thumbs up next to a big green checkmark floating in the air"),
  "cat-cz-mluvnice": kid("with three colorful speech bubbles of different shapes floating around them"),
  "cat-cz-diktat": kid("listening carefully with hand to ear, focused expression"),
  "cat-cestina-literarni-vychova": kid("wearing a golden crown, with a tiny dragon and glowing castle floating beside them"),
  "cat-cz-sloh": kid("gesturing enthusiastically as colorful speech bubbles and stars float upward around them"),

  // ── VLASTIVĚDA: Categories ────────────────────────────────
  "cat-vlastiveda-misto-kde-zijeme": kid("holding a glowing 3D house model with colorful trees and a small church floating around it"),
  "cat-vlastiveda-lide-kolem-nas": kid("in the middle of a circle of cheerful colorful 3D people of different heights, all smiling"),
  "cat-vlastiveda-lide-a-cas": kid("holding a large hourglass with golden sand, a round clock and crescent moon floating nearby"),

  // ── ČEŠTINA: Topics ───────────────────────────────────────
  "topic-cz-vyjm-b": edu("glowing letter B with house, bicycle, bee around it"),
  "topic-cz-vyjm-l": edu("glowing letter L with ski, fox, linden leaf around it"),
  "topic-cz-vyjm-m": edu("glowing letter M with soap bubble, bear, thought cloud around it"),
  "topic-cz-vyjm-p": edu("glowing letter P with bag, dog, sand around it"),
  "topic-cz-vyjm-s": edu("glowing letter S with cheese wedge, owl, salt shaker around it"),
  "topic-cz-vyjm-v": edu("glowing letter V with wolf, tower, willow tree around it"),
  "topic-cz-vyjm-z": edu("glowing letter Z with tongue, castle, bell around it"),
  "topic-cz-parove-souhlasky": edu("two pairs of colorful 3D letter blocks — soft blue pair, warm orange pair"),
  "topic-cz-tvrde-mekke": edu("two groups of letter blocks separated by dividing line — blue group, orange group"),
  "topic-cz-velka-pismena": edu("large capital letter A with a small crown above it, lowercase a beside"),
  "topic-cz-slovni-druhy": edu("round bubble, square bubble, star bubble — three different speech bubble shapes"),
  "topic-cz-rod-cislo": edu("three silhouette shapes: tall blue, smaller pink, round yellow"),
  "topic-cz-slovesa-urcovani": edu("colorful grid of six cells in two rows, each cell different color"),
  "topic-cz-zaklad-vety": edu("horizontal line with blue underlined segment and red circled segment"),
  "topic-cz-diktat": kid("holding a pencil, ready to write, looking focused"),
  "topic-cz-sloh-vypraveni": kid("gesturing excitedly with speech bubble showing castle and dragon"),
  "topic-cz-sloh-popis": edu("magnifying glass over a red apple with descriptive arrows"),
};

/**
 * Fallback prompt pro dynamické klíče z DB.
 * Parsuje slug a generuje edu() prompt ze slov klíče.
 */
function autoPrompt(key: string): string {
  // Odstraní prefix (cat-, topic-, subject-) a první slug (subject)
  const parts = key.split('-');
  const prefix = parts[0]; // cat, topic, subject
  // Vezme poslední 2-3 části jako popis
  const words = parts.slice(prefix === 'topic' ? 2 : 1).join(' ');
  if (prefix === 'cat' || prefix === 'subject') {
    return edu(`symbolic 3D objects representing "${words}" for Czech elementary school`);
  }
  return kid(`learning about "${words}"`);
}

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
async function generateImage(prompt: string): Promise<{ base64: string; contentType: string; provider: string; providerErrors?: string[] }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const HF_TOKEN = Deno.env.get("HF_TOKEN");

  // Hugging Face FLUX.1-schnell — nový router endpoint (router.huggingface.co)
  const tryHuggingFace = async () => {
    if (!HF_TOKEN) throw new Error("HF_TOKEN not set");
    // HF router — klasický inference formát s inputs.
    // DŮLEŽITÉ: bez seedu vrací FLUX.1-schnell pro stejný prompt deterministicky
    // identický obrázek → regenerace by nic nezměnila. Náhodný seed vynutí novou variantu.
    const hfSeed = Math.floor(Math.random() * 2147483647);
    const resp = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt, parameters: { seed: hfSeed, negative_prompt: "text, letters, words, writing, labels, captions, watermark, logo, gibberish, blurry" } }),
      },
    );
    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`HuggingFace error ${resp.status}: ${t.slice(0, 200)}`);
    }
    // Odpověď je binární PNG/JPEG
    const bytes = new Uint8Array(await resp.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return { base64: btoa(binary), contentType: resp.headers.get("content-type") ?? "image/png" };
  };

  const POLLINATIONS_TOKEN = Deno.env.get("POLLINATIONS_TOKEN");
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
    // Vysoká entropie seedu (čas + random) — aby každé volání bylo jiné URL.
    const seed = (Date.now() % 1000000) * 1000 + Math.floor(Math.random() * 1000);
    // private=true → nezveřejňovat v public feedu
    // nofeed=true + safe=false → obejít agregátní cache feedu, vynutit čerstvou generaci
    // (enhance ponecháváme default — Pollinations LLM může pomoct enrichovat Pixar styl)
    // gen.pollinations.ai = paid endpoint, token jako ?key=
    const keyParam = POLLINATIONS_TOKEN ? `&key=${POLLINATIONS_TOKEN}` : "";
    // negative_prompt se skutečně posílá — předtím byl definován ale nikdy použit
    // negative_prompt jako samostatný param — krátký, bez speciálních znaků
    const negShort = encodeURIComponent("text, letters, words, writing, labels, watermark, sign");
    const url = `https://gen.pollinations.ai/image/${encoded}?width=512&height=512&model=flux&seed=${seed}&nologo=true&private=true${keyParam}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      const errBody = await resp.text().catch(() => "");
      throw new Error(`Pollinations error ${resp.status}: ${errBody.slice(0, 200)}`);
    }
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

  // Gemini 2.0 Flash — nativní image generation přes generateContent + responseModalities.
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  const tryGeminiDirect = async () => {
    // gemini-2.0-flash má nativní image output od 2026; v1beta endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
      }),
    });
    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`GeminiFlash error ${resp.status}: ${t.slice(0, 300)}`);
    }
    const data = await resp.json();
    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData);
    if (!imagePart?.inlineData?.data) {
      throw new Error("No image in GeminiFlash response: " + JSON.stringify(data).slice(0, 200));
    }
    return { base64: imagePart.inlineData.data, contentType: imagePart.inlineData.mimeType ?? "image/png" };
  };

  // Priorita: Pollinations (nejlepší kvalita, s tokenem) → HuggingFace (záloha) → Gemini → Lovable
  const chain = [
    { name: "pollinations", run: tryPollinations },
    ...(HF_TOKEN ? [{ name: "huggingface", run: tryHuggingFace }] : []),
    ...(GEMINI_API_KEY ? [{ name: "gemini-direct", run: tryGeminiDirect }] : []),
    ...(LOVABLE_API_KEY ? [{ name: "lovable-gemini", run: tryLovable }] : []),
  ];

  const errors: string[] = [];
  for (const provider of chain) {
    try {
      console.log(`[generate-prvouka] Trying ${provider.name}...`);
      const result = await provider.run();
      console.log(`[generate-prvouka] OK: ${provider.name}`);
      return { ...result, provider: provider.name, providerErrors: errors };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${provider.name}: ${msg}`);
      console.warn(`[generate-prvouka] FAIL ${provider.name}:`, msg);
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
    const providers: Record<string, string> = {}; // diagnostika: který provider obrázek vygeneroval

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
        prompt = autoPrompt(key);
        console.log(`[generate-prvouka] Auto-prompt for unknown key ${key}: ${prompt.slice(0, 60)}…`);
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

        const { base64, provider, providerErrors: pErrs } = await generateImage(prompt);
        const rawBytes = decode(base64);

        // Odstraní bílé pozadí → průhledné PNG
        const imageBytes = await dewhiteBackground(rawBytes);
        providers[key] = provider + (pErrs?.length ? ` [tried: ${pErrs.join(" | ")}]` : "");

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
      JSON.stringify({ results, errors, providers }),
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
