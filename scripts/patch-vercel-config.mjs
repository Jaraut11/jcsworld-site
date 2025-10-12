import fs from 'node:fs';
import path from 'node:path';

const cfgPath = path.resolve('.vercel/output/config.json');
if (!fs.existsSync(cfgPath)) {
  console.error('patch-vercel-config: config.json not found at', cfgPath);
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
json.routes = json.routes || [];

// Ensure /api/* goes to _render
const hasApiRule = json.routes.some(r => r.src === '^/api/.*$' && r.dest === '_render');
if (!hasApiRule) {
  json.routes.unshift({ src: '^/api/.*$', dest: '_render' });
}

// Remove "status: 404" from the final catch-all so the server runs
json.routes = json.routes.map(r => {
  if (r.src === '^/.*$' && r.dest === '_render' && r.status === 404) {
    return { src: r.src, dest: r.dest };
  }
  return r;
});

fs.writeFileSync(cfgPath, JSON.stringify(json, null, 2));
console.log('patch-vercel-config: patched', cfgPath);
