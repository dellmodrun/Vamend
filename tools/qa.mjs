import { chromium } from '../../onemod/node_modules/playwright/index.mjs';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const failures = [];
const badResponses = [];
const pageErrors = [];
page.on('requestfailed', request => failures.push(`${request.url()} :: ${request.failure()?.errorText}`));
page.on('response', response => { if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`); });
page.on('pageerror', error => pageErrors.push(error.message));
const results = [];
for (const route of ['/', '/cashtags', '/funders', '/larp', '/communities', '/explore']) {
  await page.goto('http://127.0.0.1:4317' + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1200);
  results.push({ route, title: await page.title(), textLength: (await page.locator('body').innerText()).length });
  if (route === '/') await page.screenshot({ path: fileURLToPath(new URL('../qa-home.png', import.meta.url)), fullPage: true });
}
const report = { results, failures: [...new Set(failures)], badResponses: [...new Set(badResponses)], pageErrors: [...new Set(pageErrors)] };
await writeFile(new URL('../qa-report.json', import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
