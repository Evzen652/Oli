/**
 * Vygeneruje jeden obrázek na základě argumentů.
 * Použití: node scripts/generate-one-image.mjs <key> "<popis>"
 */

import sharp from "sharp";

const SUPABASE_URL = "https://uusaczibimqvaazpaopy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_33yUDPztgleFHYtChSvGKQ_rMlyktGV";

const PROMPT_PREFIX = "Cute 3D Pixar-style educational illustration for children's learning app, showing";
const PROMPT_SUFFIX = ". Single centered composition, smooth rounded volumetric 3D surfaces, soft cinematic shading, vibrant pastel colors with one strong accent. Clean pure solid white background. Modern professional 3D render quality, warm welcoming children's educational app aesthetic. Square format.";

const NEGATIVE = "text, letters, words, watermark, signature, logo, blurry, low quality, deformed, ugly, extra fingers, colored background, gradient background, tinted background";

async function dewhite(inputBuffer, threshold = 230) {
  const { data, info } = await sharp(inputBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const px = new Uint8Array(data);
  const fade = threshold - 60;
  const idx = (x, y) => (y * W + x) * 4;
  const brightness = (x, y) => { const i = idx(x, y); return (px[i] + px[i + 1] + px[i + 2]) / 3; };
  const visited = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) {
    if (brightness(x, 0) > fade) stack.push(x);
    if (brightness(x, H - 1) > fade) stack.push((H - 1) * W + x);
  }
  for (let y = 1; y < H - 1; y++) {
    if (brightness(0, y) > fade) stack.push(y * W);
    if (brightness(W - 1, y) > fade) stack.push(y * W + (W - 1));
  }
  while (stack.length > 0) {
    const pos = stack.pop();
    if (visited[pos]) continue;
    const x = pos % W; const y = Math.floor(pos / W);
    if (brightness(x, y) <= fade) continue;
    visited[pos] = 1;
    if (x + 1 < W) stack.push(pos + 1);
    if (x - 1 >= 0) stack.push(pos - 1);
    if (y + 1 < H) stack.push(pos + W);
    if (y - 1 >= 0) stack.push(pos - W);
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const pos = y * W + x;
      if (!visited[pos]) continue;
      const b = brightness(x, y);
      const i = idx(x, y);
      if (b >= threshold) px[i + 3] = 0;
      else if (b > fade) px[i + 3] = Math.round(255 * (threshold - b) / (threshold - fade));
    }
  }
  return sharp(Buffer.from(px), { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
}

async function main() {
  const [key, desc] = process.argv.slice(2);
  if (!key || !desc) {
    console.error("Použití: node scripts/generate-one-image.mjs <key> \"<popis>\"");
    process.exit(1);
  }
  console.log(`⏳ ${key}\n   Popis: ${desc}\n`);

  const prompt = encodeURIComponent(`${PROMPT_PREFIX} ${desc}${PROMPT_SUFFIX}`);
  const negative = encodeURIComponent(NEGATIVE);
  const seed = Math.floor(Math.random() * 999999);
  const url = `https://image.pollinations.ai/prompt/${prompt}?negative_prompt=${negative}&width=1024&height=1024&model=flux&nologo=true&private=true&seed=${seed}`;

  console.log("📡 Stahuji…");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pollinations ${res.status}`);
  const raw = Buffer.from(await res.arrayBuffer());

  console.log("✂️  Odstraňuji bílé pozadí…");
  const transparent = await dewhite(raw);

  console.log("☁️  Uploaduji…");
  const base64 = transparent.toString("base64");
  const upRes = await fetch(`${SUPABASE_URL}/functions/v1/generate-prvouka-images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ action: "save-image", key, base64, contentType: "image/png" }),
  });
  const data = await upRes.json().catch(() => ({}));
  if (!upRes.ok || data.error) throw new Error(`Upload: ${data.error ?? upRes.statusText}`);
  console.log(`✅ Hotovo: ${data.url}`);
}

main().catch((e) => { console.error("❌", e.message); process.exit(1); });
