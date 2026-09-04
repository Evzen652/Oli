// Patcher pro VICERADKOVY format:
//   correctAnswer: "...",
//   options: [
//     "...", ... (kazda na svem radku)
//   ],
import fs from "node:fs";
const [,, file, mode, jsonFile] = process.argv;
const APPLY = mode === "apply";
const raw = fs.readFileSync(file, "utf8");
const nl = raw.includes("\r\n") ? "\r\n" : "\n";
let L = raw.split(nl);
const T = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
const before = raw.split("question:").length - 1;
let ok = 0, fail = 0;
for (const [oldKey, key, dis] of T) {
  const needle = 'correctAnswer: "' + oldKey;
  const hits = [];
  L.forEach((l, i) => { if (l.trimStart().startsWith(needle)) hits.push(i); });
  if (hits.length === 0) { console.log("!! nenalezeno: " + oldKey.slice(0, 40)); fail++; continue; }
  if (hits.length > 1) { console.log("!! NEJEDNOZNACNE (" + hits.length + "x): " + oldKey.slice(0, 40)); fail++; continue; }
  const li = hits[0];
  const ind = L[li].slice(0, L[li].length - L[li].trimStart().length);
  // najdi radek `options: [` hned pod klicem
  let oi = -1;
  for (let k = li + 1; k < Math.min(li + 4, L.length); k++) if (L[k].includes("options: [")) { oi = k; break; }
  if (oi === -1) { console.log("!! options: " + oldKey.slice(0, 40)); fail++; continue; }
  // varianta: options na jednom radku (inline)
  if (L[oi].includes("]")) {
    const line = L[oi];
    const ob = line.indexOf("options: [");
    const oe1 = line.indexOf("]", ob);
    console.log("  radek " + (li + 1) + " <- " + oldKey.slice(0, 32) + " (inline opts)");
    if (APPLY) {
      L[li] = ind + 'correctAnswer: "' + key + '",';
      const opts = [dis[0], key, dis[1], dis[2]].map(o => '"' + o + '"').join(", ");
      L[oi] = line.slice(0, ob) + "options: [" + opts + line.slice(oe1);
    }
    ok++;
    continue;
  }
  let oe = -1;
  for (let k = oi + 1; k < Math.min(oi + 12, L.length); k++) if (L[k].trim().startsWith("]")) { oe = k; break; }
  if (oe === -1) { console.log("!! konec options: " + oldKey.slice(0, 40)); fail++; continue; }
  if (oe - oi - 1 !== 4) { console.log("!! nema 4 moznosti (" + (oe - oi - 1) + "): " + oldKey.slice(0, 40)); fail++; continue; }
  console.log("  radek " + (li + 1) + " <- " + oldKey.slice(0, 32));
  if (APPLY) {
    L[li] = ind + 'correctAnswer: "' + key + '",';
    const inner = ind + "  ";
    const neu = [dis[0], key, dis[1], dis[2]].map(o => inner + '"' + o + '",');
    L.splice(oi + 1, 4, ...neu);
  }
  ok++;
}
console.log((APPLY ? "APLIKOVANO " : "NASUCHO ") + ok + " ok, " + fail + " chyb");
if (fail > 0) throw new Error("NEAPLIKOVANO - oprav kotvy");
if (APPLY) {
  const out = L.join(nl);
  const after = out.split("question:").length - 1;
  if (after !== before) throw new Error("POCET ULOH SE ZMENIL: " + before + " -> " + after);
  fs.writeFileSync(file, out);
  console.log("uloh " + before + " (beze zmeny)");
}
