import fs from 'fs';

const p = 'src/pages/api/lead.ts';
let s = fs.readFileSync(p, 'utf8');

const declRx = /const\s+ALLOWED_ORIGINS\s*=\s*new\s*Set\(\s*\[([\s\S]*?)\]\s*\)/m;
const m = s.match(declRx);

if (!m) {
  console.log('ALLOWED_ORIGINS declaration not found; no changes made.');
  process.exit(0);
}

const inside = m[1];
const literals = Array.from(inside.matchAll(/(['"])(.*?)\1/g)).map(x => x[2]);

const want = [
  'http://localhost:4321',
  'http://localhost:4000'
];

const set = new Set(literals);
for (const v of want) set.add(v);

const items = Array.from(set).map(v => `'${v}'`).join(',\n  ');

const replaced = m[0].replace(inside, `\n  ${items}\n`);
s = s.replace(declRx, replaced);
fs.writeFileSync(p, s);

console.log('CORS updated. Allowed origins now include:');
console.log(Array.from(set).join(', '));
