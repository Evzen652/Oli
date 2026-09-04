import fs from "node:fs";
const p = process.argv[2];
let s = fs.readFileSync(p, "utf8");
const F = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
for (const [a, b] of F) { const n = s.split(a).length - 1; if (n) { s = s.split(a).join(b); console.log("  " + n + "x: " + a.slice(0, 50)); } else console.log("  !! nenalezeno: " + a.slice(0, 50)); }
fs.writeFileSync(p, s);
