import { chromium } from '../../onemod/node_modules/playwright/index.mjs';
import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ORIGIN = 'https://xxxhub.fun';
const root = path.resolve(import.meta.dirname, '..');
const site = path.join(root, 'site');
const apiCache = path.join(root, 'api-cache');
const routeSeeds = [
  '/', '/cashtags', '/funders', '/larp', '/communities', '/communities/new',
  '/explore', '/leaderboard', '/settings',
];
const routeQueue = [...routeSeeds];
const queuedRoutes = new Set(routeSeeds);
const visitedRoutes = new Set();
const savedAssets = new Set();
const pending = new Set();
const externalMap = new Map();
const cacheManifest = {};
const failures = [];
const MAX_ROUTES = 250;

await rm(site, { recursive: true, force: true });
await rm(apiCache, { recursive: true, force: true });
await mkdir(site, { recursive: true });
await mkdir(apiCache, { recursive: true });

function safeRelative(pathname) {
  const decoded = decodeURIComponent(pathname).replace(/^\/+/, '');
  const normalized = path.normalize(decoded);
  if (!normalized || normalized === '.') return '';
  if (normalized.startsWith('..') || path.isAbsolute(normalized)) return null;
  return normalized;
}

function pageTarget(route) {
  const pathname = new URL(route, ORIGIN).pathname;
  if (pathname === '/') return path.join(site, 'index.html');
  const relative = safeRelative(pathname);
  return relative === null ? null : path.join(site, relative, 'index.html');
}

function staticTarget(url) {
  const parsed = new URL(url);
  if (parsed.origin === ORIGIN) {
    const relative = safeRelative(parsed.pathname);
    if (relative === null || !relative) return null;
    return { target: path.join(site, relative), publicPath: '/' + relative.replaceAll('\\', '/') };
  }
  const relative = safeRelative(parsed.pathname) || 'index';
  const publicPath = `/external/${parsed.hostname}/${relative.replaceAll('\\', '/')}`;
  return { target: path.join(site, publicPath.slice(1)), publicPath };
}

function cacheKey(url) {
  const parsed = new URL(url);
  return parsed.pathname + parsed.search;
}

function addRoute(candidate) {
  try {
    const url = new URL(candidate, ORIGIN);
    if (url.origin !== ORIGIN) return;
    const pathname = decodeURIComponent(url.pathname).replace(/\/$/, '') || '/';
    if (/^\/(?:_next|api|media)(?:\/|$)/.test(pathname)) return;
    if (/\.[a-z0-9]{2,8}$/i.test(pathname)) return;
    if (queuedRoutes.has(pathname) || visitedRoutes.has(pathname) || queuedRoutes.size >= MAX_ROUTES) return;
    queuedRoutes.add(pathname);
    routeQueue.push(pathname);
  } catch {}
}

async function saveResponse(response) {
  const request = response.request();
  if (request.method() !== 'GET' || response.status() < 200 || response.status() >= 300) return;
  const url = response.url();
  let parsed;
  try { parsed = new URL(url); } catch { return; }
  if (!['http:', 'https:'].includes(parsed.protocol)) return;
  const type = request.resourceType();
  const isStatic = ['script', 'stylesheet', 'image', 'media', 'font'].includes(type);
  const isData = parsed.origin === ORIGIN && ['fetch', 'xhr'].includes(type);

  // Third-party chart widgets own and lazy-load a large application of their
  // own. Keep those embeds remote, but package external images/media/fonts
  // that are part of xxxhub's visible content.
  if (parsed.origin !== ORIGIN && !['image', 'media', 'font'].includes(type)) return;

  if (isStatic) {
    const mapped = staticTarget(url);
    if (!mapped || savedAssets.has(mapped.target)) return;
    savedAssets.add(mapped.target);
    try {
      const body = await response.body();
      await mkdir(path.dirname(mapped.target), { recursive: true });
      await writeFile(mapped.target, body);
      if (parsed.origin !== ORIGIN) externalMap.set(url, mapped.publicPath);
    } catch (error) {
      savedAssets.delete(mapped.target);
      failures.push({ url, error: String(error?.message || error) });
    }
    return;
  }

  if (isData) {
    const key = cacheKey(url);
    if (cacheManifest[key]) return;
    try {
      const body = await response.body();
      const filename = createHash('sha256').update(key).digest('hex') + '.bin';
      await writeFile(path.join(apiCache, filename), body);
      cacheManifest[key] = {
        filename,
        contentType: response.headers()['content-type'] || 'application/octet-stream',
        status: response.status(),
      };
    } catch (error) {
      const message = String(error?.message || error);
      if (!/No resource with given identifier|navigated away from/i.test(message)) {
        failures.push({ url, error: message });
      }
    }
  }
}

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });

while (routeQueue.length && visitedRoutes.size < MAX_ROUTES) {
  const route = routeQueue.shift();
  if (visitedRoutes.has(route)) continue;
  visitedRoutes.add(route);
  const page = await context.newPage();
  page.on('response', response => {
    const job = saveResponse(response).finally(() => pending.delete(job));
    pending.add(job);
  });
  try {
    const response = await page.goto(ORIGIN + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (!response || response.status() >= 400) {
      failures.push({ route, error: `document ${response?.status() || 'unavailable'}` });
      await page.close();
      continue;
    }
    const sourceHtml = await response.text();
    await page.waitForTimeout(route === '/' ? 3500 : 1800);
    await page.evaluate(async () => {
      for (let i = 0; i < 5; i++) {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, 350));
      }
      window.scrollTo(0, 0);
    });
    const hrefs = await page.locator('a[href]').evaluateAll(links => links.map(link => link.href));
    hrefs.forEach(addRoute);
    let html = sourceHtml;
    for (const [remote, local] of externalMap) html = html.replaceAll(remote, local);
    const target = pageTarget(route);
    if (target) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, html, 'utf8');
    }
    await Promise.allSettled([...pending]);
    console.log(`page ${visitedRoutes.size}/${queuedRoutes.size} ${route}`);
  } catch (error) {
    failures.push({ route, error: String(error?.message || error) });
    console.warn(`failed ${route}: ${error.message}`);
  } finally {
    await page.close();
  }
}

await Promise.all([...pending]);
await browser.close();
await writeFile(path.join(apiCache, 'manifest.json'), JSON.stringify(cacheManifest, null, 2));
await writeFile(path.join(root, 'mirror-manifest.json'), JSON.stringify({
  origin: ORIGIN,
  mirroredAt: new Date().toISOString(),
  routes: [...visitedRoutes],
  assets: savedAssets.size,
  cachedRequests: Object.keys(cacheManifest).length,
  failures,
}, null, 2));
console.log(`Mirror complete: ${visitedRoutes.size} routes, ${savedAssets.size} assets, ${Object.keys(cacheManifest).length} cached requests.`);
