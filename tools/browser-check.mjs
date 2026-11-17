import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const root = path.resolve(import.meta.dirname, '..', '_site');
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const mime = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname).replace(/^\/Vamend/, '') || '/';
    let file = path.resolve(root, `.${pathname}`);
    if (!file.startsWith(root)) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const browser = await chromium.launch({ executablePath: edge, headless: true });
const page = await browser.newPage();
const failures = [];
page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));
page.on('console', message => { if (message.type() === 'error') failures.push(`console: ${message.text()}`); });

try {
  await page.goto(`http://127.0.0.1:${port}/Vamend/launch/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.VamendProtocol?.getState);
  const result = await page.evaluate(async () => ({
    title: document.title,
    mintInput: Boolean(document.querySelector('[data-mint-address]')),
    walletButtons: document.querySelectorAll('[data-wallet-provider]').length,
    state: await window.VamendProtocol.getState(),
    protocolBadge: document.querySelector('[data-protocol-status]')?.textContent,
  }));
  if (!result.title.includes('Vamend')) failures.push('title missing Vamend');
  if (!result.mintInput) failures.push('mint input missing');
  if (result.walletButtons !== 3) failures.push('wallet chooser is incomplete');
  if (result.state.cluster !== 'devnet') failures.push('network configuration did not load');
  if (result.protocolBadge === 'CHECKING') failures.push('protocol status did not resolve');
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('PASS: production bundle loaded in Edge with Solana Kit, wallet chooser and protected-mint registration UI.');
