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
  // kotva MUSI stat hned za `correctAnswer: "` — jinak se trefi distraktor jine ulohy
  const needle = 'correctAnswer: "' + oldKey;
  const hits = [];
  L.forEach((l, i) => { if (l.includes(needle)) hits.push(i); });
  if (hits.length === 0) { console.log("!! nenalezeno: " + oldKey.slice(0, 40)); fail++; continue; }
  if (hits.length > 1) { console.log("!! NEJEDNOZNACNE (" + hits.length + "x): " + oldKey.slice(0, 40)); fail++; continue; }
  const li = hits[0];
  const line = L[li];
  const ca = line.indexOf("correctAnswer:");
  const ob = line.indexOf("options: [", ca);
  const oe = ob === -1 ? -1 : line.indexOf("]", ob);
  if (oe === -1) { console.log("!! options: " + oldKey.slice(0, 40)); fail++; continue; }
  const opts = [dis[0], key, dis[1], dis[2]].map(o => '"' + o + '"').join(", ");
  console.log("  radek " + (li + 1) + " <- " + oldKey.slice(0, 32));
  if (APPLY) L[li] = line.slice(0, ca) + 'correctAnswer: "' + key + '", options: [' + opts + line.slice(oe);
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
