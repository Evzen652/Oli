import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Najdi všechny content soubory
const files = execSync('find src/content/grade-4 src/content/grade-5 -name "*.ts" -not -name "index.ts" -not -name "TEMPLATE.ts" -not -name "displayNames.ts" -not -name "*.test.ts"')
  .toString().trim().split('\n').filter(Boolean);

let totalFixed = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  const orig = content;

  // Nahraď závorky v options[] hodnotách (string literály uvnitř options: [...])
  // Hledá vzor: "text (obsah)" nebo "text (obsah) více" → "text – obsah" nebo "text – obsah více"
  content = content.replace(/(options:\s*\[[\s\S]*?\])/g, (optBlock) => {
    return optBlock.replace(/"([^"]*)\(([^")]*)\)([^"]*)"/g, (m, before, inner, after) => {
      const fixed = (before.trimEnd() + ' – ' + inner.trim() + (after.trim() ? ' ' + after.trim() : '')).replace(/\s+/g, ' ').trim();
      return `"${fixed}"`;
    });
  });

  if (content !== orig) {
    writeFileSync(file, content, 'utf8');
    totalFixed++;
  }
});

console.log(`Opraveno souborů: ${totalFixed}`);
