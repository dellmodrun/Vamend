import {
  AccountRole,
  address,
  createClient,
  getProgramDerivedAddress,
} from '@solana/kit';
import { solanaRpc } from '@solana/kit-plugin-rpc';
import { walletSigner } from '@solana/kit-plugin-wallet';

const SYSTEM_PROGRAM = address('11111111111111111111111111111111');
const SEEDS = {
  config: bytes('config'),
  market: bytes('market'),
  launch: bytes('launch'),
  vault: bytes('vault'),
};
const DISCRIMINATORS = {
  createMarket: Uint8Array.from([103, 226, 97, 235, 200, 188, 251, 254]),
  registerLaunch: Uint8Array.from([114, 114, 67, 23, 41, 70, 0, 225]),
};

let runtime;
let runtimePromise;
const listeners = new Set();

function bytes(value) {
  return new TextEncoder().encode(value);
}

function concat(...parts) {
  const length = parts.reduce((total, part) => total + part.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

function u16(value) {
  const output = new Uint8Array(2);
  new DataView(output.buffer).setUint16(0, value, true);
  return output;
}

function u32(value) {
  const output = new Uint8Array(4);
  new DataView(output.buffer).setUint32(0, value, true);
  return output;
}

function u64(value) {
  const output = new Uint8Array(8);
  new DataView(output.buffer).setBigUint64(0, BigInt(value), true);
  return output;
}

function i64(value) {
  const output = new Uint8Array(8);
  new DataView(output.buffer).setBigInt64(0, BigInt(value), true);
  return output;
}

function anchorString(value) {
  const encoded = bytes(value);
  return concat(u32(encoded.length), encoded);
}

function signerMeta(signer, writable = false) {
  return {
    address: signer.address,
    role: writable ? AccountRole.WRITABLE_SIGNER : AccountRole.READONLY_SIGNER,
    signer,
  };
}

function accountMeta(accountAddress, writable = false) {
  return {
    address: address(String(accountAddress)),
    role: writable ? AccountRole.WRITABLE : AccountRole.READONLY,
  };
}

async function loadNetwork() {
  const base = location.pathname.startsWith('/Vamend') ? '/Vamend' : '';
  const response = await fetch(`${base}/network.json`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to load the verified Vamend network configuration.');
  const config = await response.json();
  if (config.cluster !== 'mainnet') throw new Error('The production Vamend client only supports Solana Mainnet.');
  return config;
}

async function init() {
  if (runtime) return runtime;
  if (!runtimePromise) {
    runtimePromise = (async () => {
      const config = await loadNetwork();
      const chain = 'solana:mainnet';
      const client = createClient()
        .use(walletSigner({ chain, storageKey: `vamend:${config.cluster}:wallet` }))
        .use(solanaRpc({ rpcUrl: config.rpc_url, skipPreflight: false }));
      client.wallet.subscribe(() => {
        for (const listener of listeners) listener(getWalletState(client, config));
      });
      await client.wallet.whenReady();
      const programAddress = config.program_id ? address(config.program_id) : null;
      runtime = { client, config, programAddress };
      return runtime;
    })();
  }
  return runtimePromise;
}

function getWalletState(client, config) {
  const state = client.wallet.getState();
  return {
    address: state.connected?.account.address || '',
    status: state.status,
    wallet: state.connected?.wallet.name || '',
    cluster: config.cluster,
  };
}

export async function getState() {
  const { client, config } = await init();
  return getWalletState(client, config);
}

export function subscribe(listener) {
  listeners.add(listener);
  init().then(({ client, config }) => listener(getWalletState(client, config))).catch(() => {});
  return () => listeners.delete(listener);
}

export async function listWallets() {
  const { client } = await init();
  return client.wallet.getState().wallets.map(wallet => ({ name: wallet.name, icon: wallet.icon }));
}

export async function connect(preferredName) {
  const { client, config } = await init();
  const target = client.wallet.getState().wallets.find(wallet => wallet.name.toLowerCase().includes(preferredName.toLowerCase()));
  if (!target) throw new Error(`${preferredName} was not detected. Install or unlock the official wallet extension.`);
  await client.wallet.connect(target);
  return getWalletState(client, config);
}

export async function disconnect() {
  const { client, config } = await init();
  await client.wallet.disconnect();
  return getWalletState(client, config);
}

export async function protocolStatus() {
  const { client, config, programAddress } = await init();
  if (!programAddress) {
    return {
      cluster: config.cluster,
      deployed: false,
      programId: '',
      status: config.status,
      transactionsEnabled: false,
    };
  }
  const account = await client.rpc.getAccountInfo(programAddress, { encoding: 'base64' }).send();
  const deployed = Boolean(account.value);
  return {
    cluster: config.cluster,
    deployed,
    programId: programAddress,
    status: config.status,
    transactionsEnabled: deployed && config.transactions_enabled === true,
  };
}

export async function registerExistingMint({ canonicalName, mintAddress, lockBps, expiryDays }) {
  const { client, config, programAddress } = await init();
  if (config.cluster !== 'mainnet') throw new Error('Vamend registration is configured for Solana Mainnet only.');
  if (!programAddress || config.transactions_enabled !== true) {
    throw new Error('The verified Vamend Mainnet program is awaiting deployment. No wallet request was sent.');
  }
  const connected = client.wallet.getState().connected;
  if (!connected) throw new Error('Connect a Solana wallet first.');
  const signer = connected.signer;
  const developer = connected.account.address;
  const name = String(canonicalName || '').trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9 _-]{0,30}[a-z0-9]$|^[a-z0-9]$/.test(name)) throw new Error('Canonical name must use lowercase letters, numbers, spaces, hyphens or underscores.');
  const bps = Number(lockBps);
  if (!Number.isInteger(bps) || bps < 200 || bps > 1000) throw new Error('Supply lock must be between 2% and 10%.');
  const days = Number(expiryDays);
  if (![7, 14, 30, 90].includes(days)) throw new Error('Choose a supported option expiry.');

  const mint = address(String(mintAddress).trim());
  const mintResponse = await client.rpc.getAccountInfo(mint, { encoding: 'jsonParsed' }).send();
  const mintAccount = mintResponse.value;
  if (!mintAccount) throw new Error('Mint account was not found on the selected network.');
  const parsed = mintAccount.data?.parsed?.info;
  if (!parsed?.supply) throw new Error('This address is not a supported SPL token mint.');
  const tokenProgram = address(String(mintAccount.owner));
  const amount = (BigInt(parsed.supply) * BigInt(bps)) / 10_000n;
  if (amount <= 0n) throw new Error('The calculated lock amount is zero.');

  const tokenAccounts = await client.rpc.getTokenAccountsByOwner(
    address(developer),
    { mint },
    { encoding: 'jsonParsed' },
  ).send();
  const source = tokenAccounts.value.find(item => BigInt(item.account.data?.parsed?.info?.tokenAmount?.amount || 0) >= amount);
  if (!source) throw new Error('The connected wallet does not hold enough tokens for this supply lock.');

  const [configPda] = await getProgramDerivedAddress({ programAddress, seeds: [SEEDS.config] });
  const [marketPda] = await getProgramDerivedAddress({ programAddress, seeds: [SEEDS.market, bytes(name)] });
  const [launchPda] = await getProgramDerivedAddress({ programAddress, seeds: [SEEDS.launch, addressBytes(mint)] });
  const [vaultPda] = await getProgramDerivedAddress({ programAddress, seeds: [SEEDS.vault, addressBytes(launchPda)] });
  const marketAccount = await client.rpc.getAccountInfo(marketPda, { encoding: 'base64' }).send();
  const instructions = [];
  if (!marketAccount.value) {
    instructions.push({
      programAddress,
      accounts: [signerMeta(signer, true), accountMeta(marketPda, true), accountMeta(SYSTEM_PROGRAM)],
      data: concat(DISCRIMINATORS.createMarket, anchorString(name)),
    });
  }

  const expiry = BigInt(Math.floor(Date.now() / 1000) + days * 86_400);
  instructions.push({
    programAddress,
    accounts: [
      signerMeta(signer, true),
      accountMeta(configPda),
      accountMeta(marketPda, true),
      accountMeta(mint),
      accountMeta(launchPda, true),
      accountMeta(vaultPda, true),
      accountMeta(source.pubkey, true),
      accountMeta(tokenProgram),
      accountMeta(SYSTEM_PROGRAM),
    ],
    data: concat(DISCRIMINATORS.registerLaunch, anchorString(name), u16(bps), u64(amount), i64(expiry)),
  });

  const result = await client.sendTransaction(instructions);
  if (result.kind && result.kind !== 'successful') throw new Error('The wallet transaction did not complete.');
  return {
    signature: result.context?.signature || '',
    launch: String(launchPda),
    market: String(marketPda),
    amount: amount.toString(),
    cluster: config.cluster,
  };
}

function addressBytes(value) {
  // Kit addresses are base58 strings; the codec is exported by Kit without a legacy web3 dependency.
  // Dynamic import is avoided so this client remains a single auditable bundle.
  return base58Decode(String(value));
}

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function base58Decode(input) {
  const bytesOut = [0];
  for (const char of input) {
    const value = ALPHABET.indexOf(char);
    if (value < 0) throw new Error('Invalid Solana address.');
    let carry = value;
    for (let index = 0; index < bytesOut.length; index += 1) {
      carry += bytesOut[index] * 58;
      bytesOut[index] = carry & 255;
      carry >>= 8;
    }
    while (carry > 0) {
      bytesOut.push(carry & 255);
      carry >>= 8;
    }
  }
  for (let index = 0; input[index] === '1' && index < input.length - 1; index += 1) bytesOut.push(0);
  return Uint8Array.from(bytesOut.reverse());
}
