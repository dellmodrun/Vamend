import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = path.join(root, 'site');
const manifest = JSON.parse(await readFile(path.join(root, 'mirror-manifest.json'), 'utf8'));
const requiredRoutes = ['/', '/cashtags', '/funders', '/larp', '/communities', '/explore'];
const failures = [];

for (const route of requiredRoutes) {
  const file = route === '/' ? path.join(site, 'index.html') : path.join(site, route.slice(1), 'index.html');
  try {
    const html = await readFile(file, 'utf8');
    if (html.length < 1000 || !/<html/i.test(html)) failures.push(`${route}: incomplete HTML`);
  } catch { failures.push(`${route}: missing`); }
}
for (const file of ['_next/static/chunks/1thkdmcj61cf_.css', '_next/static/chunks/310vm2bl3xxpt.js']) {
  try { if ((await stat(path.join(site, file))).size < 100) failures.push(`${file}: incomplete`); }
  catch { failures.push(`${file}: missing`); }
}
try { await access(path.join(root, 'api-cache', 'manifest.json')); } catch { failures.push('API cache manifest missing'); }

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`PASS: ${manifest.routes.length} routes, ${manifest.assets} assets and ${manifest.cachedRequests} public data responses packaged.`);
