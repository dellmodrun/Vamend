# Vamend Protocol

Anchor program for Vamend's Solana supply-lock and option settlement system.

## Current status

This is a pre-audit development release. It is suitable for local and Devnet testing, not for holding production funds on Mainnet.

Implemented on chain:

- deterministic same-name market groups;
- registration of an existing SPL or Token-2022 mint;
- exact 2%–10% supply lock in a program-controlled token vault;
- fixed-strike option purchases with a 10% premium;
- exercise before expiry with token and SOL settlement;
- oracle-attested developer violation with evidence hash;
- pro-rata forfeiture claims with deterministic final-claim rounding;
- expiry settlement, pause control, oracle rotation and authority rotation;
- events for indexers and user interfaces.

Still required before Mainnet:

- full LiteSVM integration coverage for every instruction and adversarial path;
- production indexer and an independently operated violation-proof pipeline;
- premium buyback execution design and DEX integration;
- external security audit and remediation;
- Mainnet-only program identity and a multisig upgrade authority;
- monitored RPC, incident response and public security policy.

## Network separation

The committed Program ID is the Devnet identity. A Mainnet build must use a separate Program ID, deploy authority and configuration. Program keypairs are never committed to this repository.

## Build and test

```sh
anchor build
cargo test -p protocol --lib
```

Generated client artifacts are written to `target/idl/protocol.json` and `target/types/protocol.ts` during a build.
