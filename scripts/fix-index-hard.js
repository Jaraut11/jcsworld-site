const fs = require('fs');
const p = 'src/pages/index.astro';
let s = fs.readFileSync(p, 'utf8');

// Find the FIRST <Base ...> and the LAST </Base>
const start = s.indexOf('<Base ');
const end = s.lastIndexOf('</Base>');
if (start === -1 || end === -1) {
  console.error('Could not find <Base> block in index.astro');
  process.exit(1);
}

// Keep only the Base-wrapped content
let body = s.slice(start, end + '</Base>'.length);

// Strip any stray front-matter separators/imports that may have leaked inside
body = body
  .replace(/^\s*---\s*$/mg, '')
  .replace(/^import .*$/mg, '');

// Build a clean file: ONE front-matter block + body + one WhatsAppButton
const front = [
  '---',
  "import Base from '../layouts/Base.astro';",
  "import WhatsAppButton from '../components/WhatsAppButton.astro';",
  '---'
].join('\n');

const out = `${front}\n${body}\n\n<!-- WhatsApp CTA -->\n<WhatsAppButton />\n`;
fs.writeFileSync(p, out);
console.log('✔ Rebuilt src/pages/index.astro with a single front-matter + Base wrapper');
