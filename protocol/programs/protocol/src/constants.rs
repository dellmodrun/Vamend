pub const CONFIG_SEED: &[u8] = b"config";
pub const MARKET_SEED: &[u8] = b"market";
pub const LAUNCH_SEED: &[u8] = b"launch";
pub const VAULT_SEED: &[u8] = b"vault";
pub const OPTION_SEED: &[u8] = b"option";

pub const MIN_LOCK_BPS: u16 = 200;
pub const MAX_LOCK_BPS: u16 = 1_000;
pub const MIN_EXPIRY_SECONDS: i64 = 86_400;
pub const MAX_EXPIRY_SECONDS: i64 = 31_536_000;
pub const MAX_NAME_BYTES: usize = 32;
pub const MAX_TOKEN_DECIMALS: u8 = 12;
pub const OPTION_PREMIUM_DIVISOR: u128 = 10;
