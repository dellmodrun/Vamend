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
const caResponseTimes = [];
page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));
page.on('console', message => { if (message.type() === 'error') failures.push(`console: ${message.text()}`); });
page.on('response', response => { if (response.url().includes('/vamend-config/ca.json')) caResponseTimes.push(Date.now()); });

try {
  const targetUrl = process.env.VAMEND_BROWSER_URL || `http://127.0.0.1:${port}/Vamend/launch/`;
  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.VamendProtocol?.getState);
  if (process.env.VAMEND_EXPECT_CA) {
    await page.waitForFunction(expected => document.querySelector('[data-live-ca]')?.textContent === `${expected.slice(0, 4)}…${expected.slice(-4)}`, process.env.VAMEND_EXPECT_CA);
  }
  await page.waitForTimeout(2200);
  const result = await page.evaluate(async () => {
    const copyButton = document.querySelector('[data-copy-ca]');
    return {
      title: document.title,
      mintInput: Boolean(document.querySelector('[data-mint-address]')),
      walletButtons: document.querySelectorAll('[data-wallet-provider]').length,
      state: await window.VamendProtocol.getState(),
      protocolBadge: document.querySelector('[data-protocol-status]')?.textContent,
      ca: document.querySelector('[data-live-ca]')?.textContent,
      copyEnabled: Boolean(copyButton && !copyButton.disabled),
    };
  });
  result.caPolls = caResponseTimes.length;
  result.caPollIntervalsMs = caResponseTimes.slice(1).map((time, index) => time - caResponseTimes[index]);
  if (!result.title.includes('Vamend')) failures.push('title missing Vamend');
  if (!result.mintInput) failures.push('mint input missing');
  if (result.walletButtons !== 3) failures.push('wallet chooser is incomplete');
  if (result.state.cluster !== 'mainnet') failures.push('Mainnet network configuration did not load');
  if (result.protocolBadge === 'CHECKING') failures.push('protocol status did not resolve');
  if (process.env.VAMEND_BROWSER_URL && result.caPolls < 2) failures.push('live CA polling was not observed');
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
