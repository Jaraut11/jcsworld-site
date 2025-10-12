const fs = require('fs');
const p = 'src/pages/index.astro';
let s = fs.readFileSync(p, 'utf8');

// collect all import lines in the file
let imports = Array.from(new Set(s.match(/^import .*$/mg) || []));

// ensure Base import exists
if (!imports.some(l => l.includes("../layouts/Base.astro"))) {
  imports.unshift("import Base from '../layouts/Base.astro';");
}

// build a clean single front-matter
const front = ['---', ...imports, '---'].join('\n');

// strip *all* stray '---' in the body
let body = s.replace(/^---[\s\S]*?---\s*/m, ''); // remove the first front-matter (whatever it was)
body = body.replace(/^\s*---\s*$/mg, '');        // remove any leftover separators

// keep only content up to the *first* </Base> (drop the duplicates you had after)
const closeIdx = body.indexOf('</Base>');
if (closeIdx !== -1) body = body.slice(0, closeIdx + 7) + '\n';

// also nuke any accidental import lines that slipped into the body
body = body.replace(/^import .*$/mg, '');

// write back
fs.writeFileSync(p, front + '\n' + body);
console.log('✔ Fixed front-matter and trimmed extra blocks in', p);
