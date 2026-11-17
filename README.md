# Vamend

Vampire protection for memecoins.

Vamend groups every same-name token on one comparison page and makes developer commitments visible: locked supply, option coverage, early sales and protection status.

## Commands

```powershell
npm run check
npm run build:pages
npm run update:ca -- tba
```

The GitHub Pages workflow publishes `_site` to `https://dellmodrun.github.io/Vamend/`.

## Protocol status

The repository contains the Anchor protocol and a Solana Kit browser client. The frontend is configured for Solana Mainnet, while transaction submission remains disabled until the verified Mainnet Program ID is deployed and added to `vamend-site/network.json`.

```powershell
npm ci
npm run build:pages
npm run check
npm run test:browser
```

See `protocol/README.md` for the implemented instructions, test status and remaining Mainnet gates. Program keypairs are stored outside the repository and must never be committed.
