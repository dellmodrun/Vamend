import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'vamend-site');
const output = path.join(root, '_site');
const routes = ['markets', 'protection', 'compare', 'developers', 'learn'];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const shell = await readFile(path.join(source, 'index.html'), 'utf8');
for (const route of routes) {
  const directory = path.join(output, route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), shell);
}

await writeFile(path.join(output, '404.html'), shell);
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`Vamend GitHub Pages bundle created at ${output}`);
