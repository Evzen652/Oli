// Kotvi na TEXT OTAZKY (musi byt jednoznacny). Zvlada vsechny formaty:
//  A) vse na jednom radku  B) klic i options na vlastnich radcich  C) klic na radku, options inline
import fs from "node:fs";
const [,, file, mode, jsonFile] = process.argv;
const APPLY = mode === "apply";
const raw = fs.readFileSync(file, "utf8");
const nl = raw.includes("\r\n") ? "\r\n" : "\n";
let L = raw.split(nl);
const T = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
const before = raw.split(/\bq(?:uestion)?: "/).length - 1;
let ok = 0, fail = 0;
for (const [question, key, dis] of T) {
  const hits = [];
  L.forEach((l, i) => { if (l.includes('q: "' + question + '"') || l.includes('question: "' + question + '"')) hits.push(i); });
  if (hits.length !== 1) { console.log("!! " + (hits.length === 0 ? "nenalezeno" : "NEJEDNOZNACNE") + ": " + question.slice(0, 45)); fail++; continue; }
  const qi = hits[0];
  const optsStr = [dis[0], key, dis[1], dis[2]].map(o => '"' + o + '"').join(", ");
  // A) vse na jednom radku
  const line = L[qi];
  const cmA = line.match(/ (a|correctAnswer): "/), omA = line.match(/(opts|options): \[/);
  if (cmA && omA) {
    const ca = line.indexOf(cmA[0]), ob = line.indexOf(omA[0], ca), oe = line.indexOf("]", ob);
    if (oe === -1) { console.log("!! opts: " + question.slice(0, 45)); fail++; continue; }
    console.log("  radek " + (qi + 1) + " <- " + question.slice(0, 40) + " [1r]");
    if (APPLY) L[qi] = line.slice(0, ca) + " " + cmA[1] + ': "' + key + '", ' + omA[1] + ": [" + optsStr + line.slice(oe);
    ok++; continue;
  }
  // B/C) klic na dalsim radku
  let ki = -1;
  for (let k = qi + 1; k < Math.min(qi + 4, L.length); k++) if (/^\s*(a|correctAnswer): "/.test(L[k])) { ki = k; break; }
  if (ki === -1) { console.log("!! klic: " + question.slice(0, 45)); fail++; continue; }
  const ind = L[ki].slice(0, L[ki].length - L[ki].trimStart().length);
  const kw = L[ki].trimStart().split(":")[0];
  let oi = -1;
  for (let k = ki + 1; k < Math.min(ki + 4, L.length); k++) if (/(opts|options): \[/.test(L[k])) { oi = k; break; }
  if (oi === -1) { console.log("!! options: " + question.slice(0, 45)); fail++; continue; }
  const ow = L[oi].trimStart().split(":")[0];
  if (L[oi].includes("]")) { // C) inline
    const ob = L[oi].indexOf(ow + ": ["), oe = L[oi].indexOf("]", ob);
    console.log("  radek " + (qi + 1) + " <- " + question.slice(0, 40) + " [inline]");
    if (APPLY) { L[ki] = ind + kw + ': "' + key + '",'; L[oi] = L[oi].slice(0, ob) + ow + ": [" + optsStr + L[oi].slice(oe); }
    ok++; continue;
  }
  let oe = -1;
  for (let k = oi + 1; k < Math.min(oi + 12, L.length); k++) if (L[k].trim().startsWith("]")) { oe = k; break; }
  if (oe === -1 || oe - oi - 1 !== 4) { console.log("!! nema 4 moznosti: " + question.slice(0, 45)); fail++; continue; }
  console.log("  radek " + (qi + 1) + " <- " + question.slice(0, 40) + " [vicer.]");
  if (APPLY) {
    L[ki] = ind + kw + ': "' + key + '",';
    L.splice(oi + 1, 4, ...[dis[0], key, dis[1], dis[2]].map(o => ind + "  \"" + o + "\","));
  }
  ok++;
}
console.log((APPLY ? "APLIKOVANO " : "NASUCHO ") + ok + " ok, " + fail + " chyb");
if (fail > 0) throw new Error("NEAPLIKOVANO - oprav kotvy");
if (APPLY) {
  const out = L.join(nl);
  const after = out.split(/\bq(?:uestion)?: "/).length - 1;
  if (after !== before) throw new Error("POCET ULOH SE ZMENIL: " + before + " -> " + after);
  fs.writeFileSync(file, out);
  console.log("uloh " + before + " (beze zmeny)");
}
