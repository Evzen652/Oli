import { readFileSync } from 'fs';
const c = readFileSync('src/content/grade-5/prirodoveda/potravniRetezecVztahyVEkosystemu.ts', 'utf8');
const BACKSLASH = '\x5C';
const QUOTE = '\x22';
let count = 0;
for (let i = 0; i < c.length - 1; i++) {
  if (c[i] === BACKSLASH && c[i+1] === QUOTE) {
    count++;
    if (count <= 3) console.log('Pozice', i, ':', JSON.stringify(c.substring(i-5, i+15)));
  }
}
console.log('Celkem backslash+quote:', count);
