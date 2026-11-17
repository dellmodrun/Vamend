import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ORIGIN = 'https://xxxhub.fun';
const root = path.resolve(import.meta.dirname, '..');
const site = path.join(root, 'site');
const apiCache = path.join(root, 'api-cache');
const port = Number(process.env.PORT || 4317);
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.bin': 'application/octet-stream',
};

function safeTarget(pathname) {
  const relative = decodeURIComponent(pathname).replace(/^\/+/, '');
  const target = path.resolve(site, relative);
  return target === site || target.startsWith(site + path.sep) ? target : null;
}

async function cachedResponse(key) {
  try {
    const manifest = JSON.parse(await readFile(path.join(apiCache, 'manifest.json'), 'utf8'));
    const item = manifest[key];
    if (!item) return null;
    return { ...item, body: await readFile(path.join(apiCache, item.filename)) };
  } catch { return null; }
}

async function proxy(req, res, url) {
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const headers = { ...req.headers, host: new URL(ORIGIN).host };
    delete headers.connection;
    delete headers['content-length'];
    if (headers.origin) headers.origin = ORIGIN;
    if (headers.referer) headers.referer = ORIGIN + '/';
    const upstream = await fetch(ORIGIN + url.pathname + url.search, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
      redirect: 'manual',
    });
    const body = Buffer.from(await upstream.arrayBuffer());
    const responseHeaders = {
      'content-type': upstream.headers.get('content-type') || 'application/octet-stream',
      'cache-control': 'no-store',
    };
    const location = upstream.headers.get('location');
    if (location) responseHeaders.location = location.startsWith(ORIGIN) ? location.slice(ORIGIN.length) || '/' : location;
    res.writeHead(upstream.status, responseHeaders);
    res.end(body);
  } catch (error) {
    res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(`Original site request failed: ${error.message}`);
  }
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  const key = url.pathname + url.search;
  if (req.method === 'GET') {
    const cached = await cachedResponse(key);
    if (cached) {
      res.writeHead(cached.status || 200, { 'content-type': cached.contentType, 'cache-control': 'no-cache' });
      return res.end(cached.body);
    }
  }

  let target = safeTarget(url.pathname === '/' ? '/index.html' : url.pathname);
  if (target) {
    try {
      const info = await stat(target);
      if (info.isDirectory()) target = path.join(target, 'index.html');
      const body = await readFile(target);
      res.writeHead(200, { 'content-type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-cache' });
      return res.end(body);
    } catch {}
    if (!path.extname(target)) {
      try {
        const body = await readFile(path.join(target, 'index.html'));
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' });
        return res.end(body);
      } catch {}
    }
  }
  return proxy(req, res, url);
}).listen(port, '127.0.0.1', () => {
  console.log(`xxxhub local frontend: http://127.0.0.1:${port}/`);
});
