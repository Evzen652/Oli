import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const rvp = JSON.parse(readFileSync('data/rvp_data.json', 'utf8'));
const g5 = rvp.flatNodes.filter(n => n.grade === 5);

const bySubject = {};
g5.forEach(n => {
  if (!bySubject[n.subject]) bySubject[n.subject] = [];
  bySubject[n.subject].push(n);
});

const subjectOrder = ['matematika', 'cjl', 'vlastiveda', 'prirodoveda', 'informatika'];
const subjectCounts = { matematika: 12, cjl: 22, vlastiveda: 13, prirodoveda: 16, informatika: 10 };
const subjectLabels = {
  matematika: 'Matematika', cjl: 'Český jazyk', vlastiveda: 'Vlastivěda',
  prirodoveda: 'Přírodověda', informatika: 'Informatika'
};

// STATUS.md
let status = `# Grade 5 — STATUS

> Mapa všech 73 podtémat 5. ročníku z RVP datasetu.
> Stav: [ ] skelet · [~] rozpracováno · [x] hotovo

`;

subjectOrder.forEach(s => {
  status += `## ${subjectLabels[s]} (${subjectCounts[s]})\n\n`;
  let lastArea = '';
  (bySubject[s] || []).forEach(n => {
    if (n.labels.area !== lastArea) {
      status += `### ${n.labels.area}\n\n`;
      lastArea = n.labels.area;
    }
    status += `- [ ] **${n.labels.subtopic}** \`${n.id}\`\n`;
  });
  status += '\n';
});

status += `_Generováno z data/rvp_data.json (verze 1.0.0). Source: RVP ZV ČR._\n`;
writeFileSync('src/content/grade-5/STATUS.md', status, 'utf8');
console.log('STATUS.md OK');

// README.md
const readme = `# Grade 5 — Obsah pro 5. rocnik ZS

Predmety: Matematika (12), Cestina (22), Vlastiveda (13), Prirodoveda (16), Informatika (10) = 73 topics.

## Pravidla (stejna jako grade-4)

briefDescription: max 12 slov, 2. osoba. NIKDY "Zak...".
studentTitle: 1-3 slova, detsky.

Slovnik 5. rocniku (10-11 let): lze pouzivat "desetinne cislo", "zaporne cislo", "prumer",
"pridavne jmeno", "zpusob slovesny" — zaci tato slova znaji z vyuky.
`;
writeFileSync('src/content/grade-5/README.md', readme, 'utf8');
console.log('README.md OK');

console.log('Infrastruktura grade-5 OK');
