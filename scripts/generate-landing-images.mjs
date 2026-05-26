/**
 * Generuje ilustrace pro landing page s GARANTOVANĚ TRANSPARENTNÍM pozadím.
 *
 * Pipeline:
 *  1. Vygeneruje obrázek přes Pollinations (free, dobrá kvalita)
 *  2. Dewhite lokálně přes sharp (flood-fill z okrajů, threshold 230)
 *  3. Uploaduje transparentní PNG přímo do Supabase storage
 *
 * Spusť: node scripts/generate-landing-images.mjs
 */

import sharp from "sharp";

const SUPABASE_URL = "https://uusaczibimqvaazpaopy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_33yUDPztgleFHYtChSvGKQ_rMlyktGV";
const BUCKET = "prvouka-images";

const PROMPT_PREFIX = "Cute 3D Pixar-style educational illustration for children's learning app, showing";
const PROMPT_SUFFIX = ". Single centered composition, smooth rounded volumetric 3D surfaces, soft cinematic shading, vibrant pastel colors with one strong accent. Clean pure solid white background. Modern professional 3D render quality, warm welcoming children's educational app aesthetic. Square format.";

const NEGATIVE = [
  "text", "letters", "words", "watermark", "signature", "logo",
  "blurry", "low quality", "deformed", "ugly", "extra fingers",
  "colored background", "gradient background", "tinted background",
].join(", ");

// ── Obrázky k vygenerování ──────────────────────────────────────────────────
const IMAGES = [
  {
    key: "landing-rodic-propojeni",
    desc: "školák a rodič sedí společně u tabletu, propojené srdce mezi nimi, vzdělávání doma",
  },
  {
    key: "landing-vstup-bez-barier",
    desc: "školák drží tablet s aplikací, čísla ročníků 1 až 9 barevně vznášejí se kolem, radostný start",
  },
  {
    key: "landing-samostatne-spolecne",
    desc: "dítě procvičuje na tabletu, vedle rodič s telefonem sleduje pokrok, propojená rodina doma",
  },
  {
    key: "landing-zlomky",
    desc: "barevný 3D kruh rozdělený na čtyři stejné výseče v různých barvách, vedle něj velký symbol zlomku jedna polovina a jedna čtvrtina jako velká barevná čísla, jasná matematická vizualizace zlomků bez jídla",
  },
];

// ── Background removal: detekuje barvu pozadí z rohů, pak flood-fill ────────
// Funguje na JAKOUKOLIV solidní barvu pozadí (bílá, žlutá, modrá, ...), ne jen bílou.
async function dewhite(inputBuffer, colorTolerance = 35, fadeTolerance = 70) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: W, height: H } = info;
  const px = new Uint8Array(data);
  const CHANNELS = 4;

  const idx = (x, y) => (y * W + x) * CHANNELS;
  const rgb = (x, y) => {
    const i = idx(x, y);
    return [px[i], px[i + 1], px[i + 2]];
  };

  // ─── 1. Vzorkuj barvu pozadí ze čtyř rohů ────────────────────────────────
  const SAMPLE = 12; // vzdálenost od rohu
  const corners = [
    rgb(SAMPLE, SAMPLE),
    rgb(W - SAMPLE - 1, SAMPLE),
    rgb(SAMPLE, H - SAMPLE - 1),
    rgb(W - SAMPLE - 1, H - SAMPLE - 1),
  ];
  // Median per channel — robustní vůči outliers
  const [bgR, bgG, bgB] = [0, 1, 2].map((ch) => {
    const sorted = corners.map((c) => c[ch]).sort((a, b) => a - b);
    return Math.round((sorted[1] + sorted[2]) / 2);
  });
  console.log(`  🎨 Pozadí detekováno: rgb(${bgR}, ${bgG}, ${bgB})`);

  // Vzdálenost od barvy pozadí (Euclidean)
  const dist = (x, y) => {
    const i = idx(x, y);
    const dr = px[i]     - bgR;
    const dg = px[i + 1] - bgG;
    const db = px[i + 2] - bgB;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  // ─── 2. Flood-fill z celého obvodu ───────────────────────────────────────
  const visited = new Uint8Array(W * H);
  const stack = [];

  for (let x = 0; x < W; x++) {
    if (dist(x, 0)     < fadeTolerance) stack.push(x);
    if (dist(x, H - 1) < fadeTolerance) stack.push((H - 1) * W + x);
  }
  for (let y = 1; y < H - 1; y++) {
    if (dist(0, y)     < fadeTolerance) stack.push(y * W);
    if (dist(W - 1, y) < fadeTolerance) stack.push(y * W + (W - 1));
  }

  while (stack.length > 0) {
    const pos = stack.pop();
    if (visited[pos]) continue;
    const x = pos % W;
    const y = Math.floor(pos / W);
    if (dist(x, y) >= fadeTolerance) continue;
    visited[pos] = 1;
    if (x + 1 < W)  stack.push(pos + 1);
    if (x - 1 >= 0) stack.push(pos - 1);
    if (y + 1 < H)  stack.push(pos + W);
    if (y - 1 >= 0) stack.push(pos - W);
  }

  // ─── 3. Aplikuj alpha podle vzdálenosti od barvy pozadí ──────────────────
  let killed = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const pos = y * W + x;
      if (!visited[pos]) continue;
      const d = dist(x, y);
      const i = idx(x, y);
      if (d <= colorTolerance) {
        px[i + 3] = 0;
        killed++;
      } else if (d < fadeTolerance) {
        // Hladký přechod od plné průhlednosti k plné neprůhlednosti
        px[i + 3] = Math.round(255 * (d - colorTolerance) / (fadeTolerance - colorTolerance));
      }
    }
  }
  console.log(`  ✨ Odstraněno ${killed.toLocaleString("cs")} pixelů pozadí`);

  return sharp(Buffer.from(px), { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toBuffer();
}

// ── Fetch obrázek z Pollinations ────────────────────────────────────────────
async function fetchFromPollinations(desc) {
  const prompt = encodeURIComponent(`${PROMPT_PREFIX} ${desc}${PROMPT_SUFFIX}`);
  const negative = encodeURIComponent(NEGATIVE);
  const seed = Math.floor(Math.random() * 999999);
  const url = `https://image.pollinations.ai/prompt/${prompt}?negative_prompt=${negative}&width=1024&height=1024&model=flux&nologo=true&private=true&seed=${seed}`;
  console.log("  📡 Stahuji z Pollinations…");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pollinations ${res.status}: ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
}

// ── Upload přes edge funkci (má service role klíč, obchází RLS) ─────────────
async function uploadToSupabase(key, pngBuffer) {
  const base64 = pngBuffer.toString("base64");
  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-prvouka-images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ action: "save-image", key, base64, contentType: "image/png" }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    throw new Error(`Upload selhal: ${data.error ?? res.statusText}`);
  }
  return data.url ?? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${key}.png`;
}

// ── Hlavní pipeline ──────────────────────────────────────────────────────────
async function processImage(key, desc) {
  console.log(`\n⏳ ${key}`);
  try {
    const raw = await fetchFromPollinations(desc);
    console.log("  ✂️  Odstraňuji bílé pozadí (sharp flood-fill)…");
    const transparent = await dewhite(raw);
    console.log("  ☁️  Uploaduji transparentní PNG…");
    const publicUrl = await uploadToSupabase(key, transparent);
    console.log(`  ✅ Hotovo: ${publicUrl}`);
    return true;
  } catch (e) {
    console.error(`  ❌ Chyba: ${e.message}`);
    return false;
  }
}

async function main() {
  // CLI filter: node script.mjs zlomky  → vygeneruje jen klíče obsahující "zlomky"
  const filter = process.argv[2];
  const list = filter ? IMAGES.filter((img) => img.key.includes(filter)) : IMAGES;

  if (filter && list.length === 0) {
    console.error(`❌ Žádný obrázek nesedí na filtr "${filter}". Dostupné klíče:`);
    IMAGES.forEach((img) => console.error(`  - ${img.key}`));
    process.exit(1);
  }

  console.log(`🎨 Generování ${filter ? `(filtr: "${filter}")` : "všech"} landing page ilustrací s transparentním pozadím\n`);
  let ok = 0;
  for (const { key, desc } of list) {
    const success = await processImage(key, desc);
    if (success) ok++;
  }
  console.log(`\n✨ ${ok}/${list.length} vygenerováno s transparentním pozadím`);
}

main().catch(console.error);
