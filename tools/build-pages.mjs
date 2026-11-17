import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'site');
const output = path.join(root, '_site');
const base = '/Vamend';
const textExtensions = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt', '.xml']);
const pathRoots = [
  '_next', 'media', 'external', 'c', 'cashtags', 'check', 'coin',
  'communities', 'explore', 'funders', 'larp', 'launch', 'leaderboard',
  'settings', 'favicon.ico', 'icon.svg', 'icon.png', 'apple-icon.png'
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

async function rewriteTree(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewriteTree(target);
      continue;
    }
    if (!textExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    let content = await readFile(target, 'utf8');
    for (const rootName of pathRoots) {
      content = content.replaceAll(`/${rootName}`, `${base}/${rootName}`);
    }
    if (entry.name.endsWith('.html')) {
      content = content
        .replaceAll('href="/"', `href="${base}/"`)
        .replaceAll('action="/"', `action="${base}/"`)
        .replaceAll('\\"href\\":\\"/\\"', `\\"href\\":\\"${base}/\\"`);
    }
    await writeFile(target, content);
  }
}

await rewriteTree(output);
await writeFile(path.join(output, '.nojekyll'), '');
await writeFile(path.join(output, '404.html'), await readFile(path.join(output, 'index.html')));
console.log(`GitHub Pages bundle created at ${output}`);
