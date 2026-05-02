import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PROMPT_PREFIX = "Cute 3D rendered cartoon illustration of";
const PROMPT_SUFFIX = ", Pixar-style 3D rendering with soft volumetric shading, vibrant pastel colors, friendly rounded shapes, kid-friendly characters, white isolated background, no text, no logos, suitable for 8-year-old children, single centered subject, square composition";

function p(desc: string) { return `${PROMPT_PREFIX} ${desc}${PROMPT_SUFFIX}`; }

// All keys to generate images for
const IMAGE_KEYS: Record<string, string> = {
  // ── SUBJECTS (top-level předmět karty) ────────────────────
  "subject-matematika": p("colorful 3D numbers 1, 2, 3 floating with plus and equals signs"),
  "subject-cestina": p("an open book with the letters A, B, C jumping out colorfully"),
  "subject-prvouka": p("a friendly tree with a sun, flowers, and a small animal in a meadow"),
  "subject-prirodoveda": p("a magnifying glass over leaves and a small ecosystem with plants and animals"),
  "subject-vlastiveda": p("a globe and a Czech Republic outline map with landmarks like Prague Castle"),

  // ── PRVOUKA: Categories ───────────────────────────────────
  "cat-clovek-a-jeho-telo": p("a happy child showing body parts like arms, legs, head"),
  "cat-priroda-kolem-nas": p("nature scene with trees, flowers, sun, birds, and a small pond"),
  "cat-lide-a-spolecnost": p("a friendly neighborhood with houses, people waving, a school, and a park"),
  "cat-orientace-v-prostoru-a-case": p("a compass, map, clock, and calendar together"),
  // ── PRVOUKA: Topics ───────────────────────────────────────
  "topic-lidske-telo": p("a human body outline with labeled bones, muscles, and organs in a friendly style"),
  "topic-smysly": p("five senses - eye, ear, nose, tongue, hand touching - in a playful layout"),
  "topic-zdravi-a-hygiena": p("a child washing hands with soap, toothbrush, healthy food"),
  "topic-rostliny": p("various plants - a tree, flower, mushroom, and grass - with roots visible"),
  "topic-zvirata": p("friendly animals - dog, cat, deer, bird, butterfly, fish - together in nature"),
  "topic-rocni-obdobi-a-pocasi": p("four seasons - spring flowers, summer sun, autumn leaves, winter snow - in quadrants"),
  "topic-nase-zeme": p("Czech Republic map outline with Prague marked, Czech flag, and famous landmarks like Prague Castle"),
  "topic-rodina-a-spolecnost": p("a family and community together - parents with children, neighbors waving, people helping each other"),
  "topic-rodina-a-pravidla-chovani": p("a happy family - parents and children - holding hands, showing good manners, greeting neighbors"),
  "topic-obec-a-mesto": p("a small Czech town with a town hall, church, school, and park"),
  "topic-ceska-republika": p("Czech Republic landmarks - Prague Castle, Czech flag, map outline"),
  "topic-svetove-strany-a-mapa": p("a compass rose with N S E W directions and a simple treasure map"),
  "topic-cas-a-kalendar": p("a clock showing time, a calendar page, and day-night cycle"),

  // ── MATEMATIKA: Categories ────────────────────────────────
  "cat-math-cisla-a-operace": p("colorful numbers 1-9 with plus and minus signs, counting blocks"),
  "cat-math-zlomky": p("a pizza and a cake cut into equal slices showing fractions like 1/2 and 1/4"),
  "cat-math-geometrie": p("geometric shapes - square, triangle, circle, rectangle - with a ruler and protractor"),

  // ── MATEMATIKA: Topics ────────────────────────────────────
  "topic-math-porovnavani-prirozenych-cisel": p("two groups of objects being compared with less-than and greater-than signs"),
  "topic-math-scitani-a-odcitani-do-100": p("a child counting on fingers with numbers and plus/minus signs floating around"),
  "topic-math-nasobeni-a-deleni": p("multiplication table grid with colorful numbers and a times symbol"),
  "topic-math-zaokrouhlovani": p("a number line with arrows showing rounding to nearest ten"),
  "topic-math-razeni-cisel": p("numbered cards being sorted from smallest to largest by a child"),
  "topic-math-porovnavani-zlomku": p("two fraction bars side by side being compared, one bigger than the other"),
  "topic-math-kraceni-zlomku": p("a fraction being simplified with arrows showing division of numerator and denominator"),
  "topic-math-rozsireni-zlomku": p("a fraction being expanded with arrows showing multiplication of numerator and denominator"),
  "topic-math-scitani-zlomku": p("two fraction pies being added together to make a larger portion"),
  "topic-math-odcitani-zlomku": p("a fraction pie with a slice being removed, subtraction symbol"),
  "topic-math-smisena-cisla": p("a whole number next to a fraction piece, like 2 and 1/3 of a pie"),
  "topic-math-zlomek-z-cisla": p("a group of 12 apples with 1/4 of them circled and highlighted"),
  "topic-math-nasobeni-zlomku-celym-cislem": p("a fraction piece being multiplied - showing 3 times 1/4 with three quarter-pieces"),
  "topic-math-geometricke-tvary": p("basic geometric shapes - square, triangle, circle, rectangle - with labels"),
  "topic-math-obvod": p("a rectangle with arrows around its perimeter showing measurement"),

  // ── MATEMATIKA: Měření ────────────────────────────────────
  "topic-math-mereni-delky": p("a ruler measuring objects, a tape measure, and a child estimating length"),
  "topic-math-zakladni-jednotky": p("a ruler with millimeters, centimeters, and meters labeled, comparison arrows"),
  "topic-math-prevody-jednotek": p("arrows showing conversions between cm and m, mm and cm, with equal signs"),
  "topic-math-odhad-delek": p("a child guessing the length of a pencil and a book, with question marks"),
  "topic-math-jednotky-hmotnosti": p("a kitchen scale with weights labeled in grams and kilograms, apples being weighed"),
  "topic-math-slovni-ulohy-delky": p("a child measuring a ribbon with a ruler, cutting with scissors, numbers floating"),
  "topic-math-objem-ml-l": p("a measuring cup with milliliter markings, a water bottle labeled 1 liter"),

  // ── ČEŠTINA: Categories ───────────────────────────────────
  "cat-cz-vyjmenovana-slova": p("Czech words with highlighted letters Y and I, a spelling book with a magnifying glass"),
  "cat-cz-pravopis": p("a notebook with Czech text, a pencil correcting spelling, checkmarks and crosses"),
  "cat-cz-mluvnice": p("sentence diagram with colorful parts of speech labels, a grammar tree"),
  "cat-cz-diktat": p("a child writing in a notebook from dictation, speech bubble with words"),

  // ── ČEŠTINA: Topics ───────────────────────────────────────
  "topic-cz-vyjm-b": p("the Czech letter B with words like 'být, bydlit' and a house icon"),
  "topic-cz-vyjm-l": p("the Czech letter L with words 'lyže, slyšet' and a ski icon"),
  "topic-cz-vyjm-m": p("the Czech letter M with words 'my, myslit' and a thinking bubble"),
  "topic-cz-vyjm-p": p("the Czech letter P with words 'pýcha, pytel' and a bag icon"),
  "topic-cz-vyjm-s": p("the Czech letter S with words 'syn, sýr' and a cheese icon"),
  "topic-cz-vyjm-v": p("the Czech letter V with words 'výt, zvyk' and a wolf icon"),
  "topic-cz-vyjm-z": p("the Czech letter Z with words 'jazyk, brzy' and a tongue icon"),
  "topic-cz-parove-souhlasky": p("letter pairs like D-T, B-P, Z-S shown side by side with a magnifying glass"),
  "topic-cz-tvrde-mekke": p("hard and soft consonants divided into two groups with happy/stern face icons"),
  "topic-cz-velka-pismena": p("a big capital letter A next to a small lowercase a, with city names"),
  "topic-cz-slovni-druhy": p("colorful word labels - noun, verb, adjective - pointing to words in a sentence"),
  "topic-cz-rod-cislo": p("masculine, feminine, neuter icons (he/she/it) with example Czech nouns"),
  "topic-cz-slovesa-urcovani": p("a verb conjugation table with person and tense markers"),
  "topic-cz-zaklad-vety": p("a simple sentence with subject underlined and predicate circled"),
  "topic-cz-diktat": p("a child writing missing letters into blank spaces in sentences"),

  // ── ČEŠTINA: Sloh ─────────────────────────────────────────
  "cat-cz-sloh": p("a child writing a creative essay with a pencil, story bubbles around"),
  "topic-cz-sloh-vypraveni": p("a child telling a story with a speech bubble showing characters and adventures"),
  "topic-cz-sloh-popis": p("a child describing an object - magnifying glass, descriptive words floating, paint palette"),
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const requestedKeys: string[] = body.keys ?? Object.keys(IMAGE_KEYS);

    const results: Record<string, string> = {};
    const errors: Record<string, string> = {};

    for (const key of requestedKeys) {
      const prompt = IMAGE_KEYS[key];
      if (!prompt) {
        errors[key] = "Unknown key";
        continue;
      }

      try {
        console.log(`Generating image for: ${key}`);

        const aiResponse = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image",
              messages: [{ role: "user", content: prompt }],
              modalities: ["image", "text"],
            }),
          }
        );

        if (!aiResponse.ok) {
          const errText = await aiResponse.text();
          console.error(`AI error for ${key}:`, aiResponse.status, errText);
          errors[key] = `AI error: ${aiResponse.status}`;
          continue;
        }

        const aiData = await aiResponse.json();
        const imageUrl =
          aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageUrl || !imageUrl.startsWith("data:image/")) {
          errors[key] = "No image in AI response";
          continue;
        }

        // Extract base64 data
        const base64Data = imageUrl.split(",")[1];
        const imageBytes = decode(base64Data);

        // Determine content type
        const mimeMatch = imageUrl.match(/data:(image\/\w+);/);
        const contentType = mimeMatch?.[1] ?? "image/png";
        const ext = contentType.split("/")[1] ?? "png";

        // Upload to storage
        const filePath = `${key}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("prvouka-images")
          .upload(filePath, imageBytes, {
            contentType,
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

        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 2000));
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
