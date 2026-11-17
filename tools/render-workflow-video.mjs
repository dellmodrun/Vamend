import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'media', 'vamend-workflow-storyboard.html');
const desktop = path.resolve(root, '..', '..');
const output = path.join(desktop, 'Vamend-workflow-1080p.mp4');
const preview = path.join(desktop, 'Vamend-workflow-preview.jpg');
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fps = 30;
const duration = 28;
await mkdir(path.dirname(output), { recursive: true });

const browser = await chromium.launch({ executablePath: edge, headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(source).href);
await page.waitForFunction(() => window.ready === true);
const canvas = page.locator('#film');

if (process.argv.includes('--preview')) {
  await page.evaluate(() => window.render(8.6));
  await canvas.screenshot({ path: preview, type: 'jpeg', quality: 94 });
  await browser.close();
  console.log(`Preview written to ${preview}`);
  process.exit(0);
}

const ffmpeg = spawn('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-f', 'image2pipe', '-vcodec', 'mjpeg', '-framerate', String(fps), '-i', '-',
  '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output,
], { stdio: ['pipe', 'inherit', 'inherit'] });

const frames = duration * fps;
for (let frame = 0; frame < frames; frame += 1) {
  await page.evaluate(time => window.render(time), frame / fps);
  const jpeg = await canvas.screenshot({ type: 'jpeg', quality: 92 });
  if (!ffmpeg.stdin.write(jpeg)) await once(ffmpeg.stdin, 'drain');
  if (frame % 90 === 0) console.log(`Rendered ${frame}/${frames} frames`);
}
ffmpeg.stdin.end();
const [code] = await once(ffmpeg, 'exit');
await browser.close();
if (code !== 0) throw new Error(`ffmpeg exited with code ${code}`);
console.log(`Video written to ${output}`);
