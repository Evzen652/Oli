import { readFileSync, writeFileSync } from 'fs';

const file = 'src/content/grade-5/cjl/primaANeprimaRecUvod.ts';
let content = readFileSync(file, 'utf8');

// Nahrad vsechny vyskyty typografickych uvozovek bezpecnymi alternativami
// Vzor „text," nebo „text" kde " je ASCII 0x22 uvnitr double-quoted stringu

// Specificke opravy podle radku
const replacements = [
  ['„Pojď sem,“ rečla babička', 'dolni-uvoz. Pojd sem, horni-uvoz., rekla babicka'],
  ['„...“ nebo <<...>>', 'dolni...horni uvozovky'],
  ['„takto“', 'dolni-horni (takto)'],
  ['„Pss, nikomu to nev\xEDkej!“', 'dolni-uvoz. Pss, nikomu to nevikej! horni-uvoz.'],
];

// Jednodussi pristup - nahrad vsechny „...X" vzory kde X je ASCII "
// Najdi vsechny pozice kde je „ a nasleduje text a pak ASCII "
const result = content.replace(/„([^“\n]*)“/g, (match, inner) => {
  return 'dolni-uvoz.' + inner + 'horni-uvoz.';
});

// Pokud stale zbyvaji problemy s ASCII " uvnitr stringu, oprav je rucne
// Hledej vzory jako: "...„text," kde " za carkou je ASCII
const result2 = result.replace(/„([^"\n]*),"/g, (match, inner) => {
  return '„' + inner + ',“';
});

writeFileSync(file, result2, 'utf8');
console.log('Opraveno');

// Zkontroluj zda zbyvaji problemy
const check = readFileSync(file, 'utf8');
const lines = check.split('\n');
let issues = 0;
lines.forEach((line, i) => {
  if (line.includes('„')) {
    console.log('Stale problem L' + (i+1) + ':', line.trim().substring(0, 80));
    issues++;
  }
});
if (issues === 0) console.log('Vsechny problemy opraveny!');
