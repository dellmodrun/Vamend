import { execFileSync, spawnSync } from 'node:child_process';

const PROJECT_REF = 'snwthyespgghvvlktyyu';
const BUCKET = 'vamend-config';
const OBJECT_PATH = 'ca.json';
const input = String(process.argv[2] || '').trim();
const value = input.toLowerCase() === 'tba' ? 'tba' : /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(input) ? input : '';
if (!value) {
  console.error('Usage: npm run update:ca -- <Solana address|tba>');
  process.exit(1);
}

const credentialReader = String.raw`
$type=[Windows.Security.Credentials.PasswordVault,Windows.Security.Credentials,ContentType=WindowsRuntime]
$vault=[Windows.Security.Credentials.PasswordVault]::new()
try { $credential=$vault.Retrieve('Vamend CA updater vault','vamend') }
catch { $credential=$vault.Retrieve('Pindeck CA updater vault','pindeck') }
$credential.RetrievePassword()
[Console]::Out.Write($credential.Password)`;

let serviceKey = '';
if (process.platform === 'win32') {
  const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', '-'], { input: credentialReader, encoding: 'utf8', windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
  if (result.status === 0) serviceKey = result.stdout.trim();
}
if (!serviceKey) {
  const args = ['--yes', 'supabase@latest', 'projects', 'api-keys', '--project-ref', PROJECT_REF, '--output', 'json'];
  const options = { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] };
  const raw = process.platform === 'win32'
    ? execFileSync(process.env.ComSpec || 'cmd.exe', ['/d', '/c', `npx ${args.join(' ')}`], options)
    : execFileSync('npx', args, options);
  const keys = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1));
  serviceKey = keys.find(key => key.id === 'service_role')?.api_key || '';
}
if (!serviceKey) throw new Error('Supabase service role key is unavailable.');

const bucketResponse = await fetch(`https://${PROJECT_REF}.supabase.co/storage/v1/bucket`, {
  method: 'POST',
  headers: {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
    'content-type': 'application/json'
  },
  body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true, file_size_limit: 102400, allowed_mime_types: ['application/json'] })
});
if (!bucketResponse.ok && bucketResponse.status !== 409) throw new Error(`Supabase bucket setup failed: ${bucketResponse.status} ${await bucketResponse.text()}`);

const response = await fetch(`https://${PROJECT_REF}.supabase.co/storage/v1/object/${BUCKET}/${OBJECT_PATH}`, {
  method: 'POST',
  headers: {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
    'content-type': 'application/json',
    'cache-control': 'no-store',
    'x-upsert': 'true'
  },
  body: JSON.stringify({ contract_address: value, updated_at: new Date().toISOString() })
});
if (!response.ok) throw new Error(`Supabase config update failed: ${response.status} ${await response.text()}`);
console.log(`Vamend CA updated: ${value}`);
