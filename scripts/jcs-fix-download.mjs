import fs from 'fs';
const p = 'src/pages/index.astro';
let s = fs.readFileSync(p, 'utf8');
const targetHref = '/pdf/jcs-2025-compliance-calendar.pdf';
const rxBlock = /<a\b[\s\S]*?>[\s\S]*?Free\s*Download:\s*2025\s*GST[\s\S]*?<\/a>/i;
const m = s.match(rxBlock);
if (m) {
  let a = m[0];
  a = a.replace(/\bhref="[^"]*"/i, `href="${targetHref}"`);
  if (!/href="/i.test(a)) a = a.replace(/<a\b/i, `<a href="${targetHref}"`);
  if (!/\bdownload\b/i.test(a)) a = a.replace(/<a\b/i, '<a download');
  s = s.replace(rxBlock, a);
  fs.writeFileSync(p, s);
  console.log('Download CTA patched ->', targetHref);
} else {
  console.log('Could not find the Free Download CTA; no changes.');
}
