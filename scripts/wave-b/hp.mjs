import fs from "node:fs";
const p = process.argv[2];
const raw = fs.readFileSync(p, "utf8");
const nl = raw.includes("\r\n") ? "\r\n" : "\n";
const L = raw.split(nl);
let fixed = 0;
for (let i = 0; i < L.length; i++) {
  if (!L[i].includes("hints: [") || L[i].includes("hints: hints ??")) continue;
  // sesbírej řádky s řetězci až po uzavírací ]
  const items = [];
  let j = i + 1;
  while (j < L.length && !L[j].trim().startsWith("]")) { items.push(j); j++; }
  if (items.length !== 2) continue;
  const txt = (k) => { const m = L[k].match(/"([\s\S]*)",?\s*$/); return m ? m[1] : ""; };
  const a = txt(items[0]), b = txt(items[1]);
  if (!a || !b) continue;
  if (b.length >= a.length * 1.2) continue;
  // prohodit
  const tmp = L[items[0]].replace(a, "\u0000");
  L[items[0]] = L[items[0]].replace(a, b);
  L[items[1]] = L[items[1]].replace(b, a);
  console.log(`  prohozeno (${a.length} -> ${b.length}) na radku ${items[0] + 1}`);
  fixed++;
}
if (process.argv[3] === "apply") { fs.writeFileSync(p, L.join(nl)); }
console.log((process.argv[3] === "apply" ? "APLIKOVANO " : "NASUCHO ") + fixed);
