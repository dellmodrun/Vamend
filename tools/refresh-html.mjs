import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ORIGIN = 'https://xxxhub.fun';
const root = path.resolve(import.meta.dirname, '..');
const site = path.join(root, 'site');
const manifest = JSON.parse(await readFile(path.join(root, 'mirror-manifest.json'), 'utf8'));
const routes = manifest.routes;

function targetFor(route) {
  const pathname = new URL(route, ORIGIN).pathname;
  return pathname === '/'
    ? path.join(site, 'index.html')
    : path.join(site, decodeURIComponent(pathname).replace(/^\/+/, ''), 'index.html');
}

for (let offset = 0; offset < routes.length; offset += 6) {
  await Promise.all(routes.slice(offset, offset + 6).map(async route => {
    const response = await fetch(ORIGIN + route, {
      headers: { 'user-agent': 'Mozilla/5.0 Chrome/144.0 Safari/537.36' },
    });
    if (!response.ok) throw new Error(`${route}: ${response.status}`);
    const target = targetFor(route);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, await response.text(), 'utf8');
    console.log(`html ${route}`);
  }));
}
