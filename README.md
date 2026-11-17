# xxxhub.fun local frontend

Complete local frontend mirror captured from `https://xxxhub.fun/`.

## Run

```powershell
npm start
```

Open `http://127.0.0.1:4317/`.

The package contains mirrored pages, Next.js chunks, fonts, images, media and cached public GET responses. The local server serves the packaged copy first and proxies only a missing or live runtime request to the original site.

## Refresh the mirror

```powershell
npm run mirror
npm run check
```
