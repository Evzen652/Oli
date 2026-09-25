#!/usr/bin/env node
/**
 * Ořez průhledné kresby na obsah + zmenšení na rozumné rozlišení.
 *
 * Proč to existuje: Gemini vrací kresbu na celém plátně (1408×768), takže po
 * vyříznutí pozadí zbývá kolem objektu široký průhledný okraj. `object-contain`
 * ten okraj počítá do obrázku — dlaždice pak vykreslí objekt výrazně menší než
 * sousední kresbu, která okraj nemá. A 1,5 MB PNG za ikonu vysokou 64 px je
 * plýtvání, které `ILLUSTRATION_STYLE.md` §5/§6 výslovně zakazuje
 * („3× zobrazovaná velikost stačí").
 *
 * Ořez se počítá z ALFY, ne z jasu — vstup už musí mít vyříznuté pozadí
 * (`fix-landing-alpha.ps1`). Práh `--alpha` je nízký schválně: akvarelový
 * nádech na kraji tahu je součást kresby, ne pozadí.
 *
 * Použití:
 *   node scripts/crop-illustration.mjs --in <soubor.png> [--out <soubor.png>]
 *                                      --max <px> [--alpha 24] [--dry]
 *
 *   --max    delší hrana výsledku v px (nezvětšuje, jen zmenšuje)
 *   --out    výchozí = přepsat vstup
 *   --dry    jen vypíše, co by udělal
 */
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}

const inPath = arg("in");
const outPath = arg("out", inPath);
const maxEdge = Number(arg("max", 0));
const alphaThr = Number(arg("alpha", 24));
const dry = process.argv.includes("--dry");

if (!inPath || !maxEdge) {
  console.error("Chybí --in nebo --max. Nápověda je v hlavičce souboru.");
  process.exit(1);
}

const { data, info } = await sharp(inPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

let minX = W, minY = H, maxX = -1, maxY = -1;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (data[(y * W + x) * C + 3] > alphaThr) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
if (maxX < 0) {
  console.error(`${inPath}: žádný pixel nad prahem alfy ${alphaThr} — nic k ořezu.`);
  process.exit(1);
}

const cw = maxX - minX + 1;
const ch = maxY - minY + 1;
const scale = Math.min(1, maxEdge / Math.max(cw, ch));
const tw = Math.round(cw * scale);
const th = Math.round(ch * scale);
const before = fs.statSync(inPath).size;

console.log(
  `${path.basename(inPath)}: ${W}×${H} → ořez ${cw}×${ch} @(${minX},${minY}) → ${tw}×${th}`
);
if (dry) process.exit(0);

const buf = await sharp(inPath)
  .extract({ left: minX, top: minY, width: cw, height: ch })
  .resize(tw, th, { fit: "fill" })
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();
fs.writeFileSync(outPath, buf);

const after = fs.statSync(outPath).size;
console.log(
  `  ${(before / 1024).toFixed(0)} kB → ${(after / 1024).toFixed(0)} kB` +
    ` (${(100 * (1 - after / before)).toFixed(0)} % dolů)`
);
