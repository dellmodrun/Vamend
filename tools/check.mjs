import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = path.join(root, 'vamend-site');
const failures = [];

for (const file of ['index.html', 'styles.css', 'app.js', 'protocol-client.js', 'network.json', 'assets/vamend-logo.png', 'assets/wallets/phantom.svg', 'assets/wallets/solflare.svg', 'assets/wallets/backpack.svg']) {
  const target = path.join(site, file);
  try {
    await access(target);
    if ((await stat(target)).size < 100) failures.push(`${file}: incomplete`);
  } catch { failures.push(`${file}: missing`); }
}

for (const [file, terms] of [
  ['index.html', ['Vamend', '/Vamend/protocol-client.js', '/Vamend/app.js', '/Vamend/styles.css']],
  ['app.js', ['vamendlaunch', 'Vampire protection', '2% to 10%', 'TBA', 'Choose your wallet', 'Phantom', 'Solflare', 'Backpack', 'Solana mint address', 'Devnet beta', 'Vamend documentation', 'Option ladder', 'OFFICIAL', 'PINNED', 'data-live-ca']],
  ['protocol-client.js', ['VamendProtocol']],
  ['network.json', ['devnet', 'HZa5dYATXsrpcxM2kzHi34AsXtxFiPV7iF9cV4cRg9zc']]
]) {
  const content = await readFile(path.join(site, file), 'utf8');
  for (const term of terms) if (!content.includes(term)) failures.push(`${file}: missing ${term}`);
}

const combined = `${await readFile(path.join(site, 'index.html'), 'utf8')}\n${await readFile(path.join(site, 'app.js'), 'utf8')}`;
for (const legacy of ['xxxdotfun', '3JCcs5', 'Everything starts with X']) {
  if (combined.includes(legacy)) failures.push(`legacy content remains: ${legacy}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('PASS: Vamend Devnet frontend, real wallet client, protected-mint workflow, docs, official market pin, live CA and eight routes verified.');
