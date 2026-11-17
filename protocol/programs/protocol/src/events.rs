use anchor_lang::prelude::*;

#[event]
pub struct MarketCreated {
    pub market: Pubkey,
    pub payer: Pubkey,
}

#[event]
pub struct LaunchRegistered {
    pub launch: Pubkey,
    pub market: Pubkey,
    pub mint: Pubkey,
    pub developer: Pubkey,
    pub amount: u64,
    pub lock_bps: u16,
    pub expiry: i64,
}

#[event]
pub struct OptionPurchased {
    pub launch: Pubkey,
    pub buyer: Pubkey,
    pub strike_lamports: u64,
    pub quantity: u64,
    pub premium_lamports: u64,
}

#[event]
pub struct OptionExercised {
    pub launch: Pubkey,
    pub buyer: Pubkey,
    pub quantity: u64,
    pub exercise_lamports: u64,
}

#[event]
pub struct ViolationReported {
    pub launch: Pubkey,
    pub oracle: Pubkey,
    pub evidence: [u8; 32],
    pub timestamp: i64,
}

#[event]
pub struct ForfeitureClaimed {
    pub launch: Pubkey,
    pub buyer: Pubkey,
    pub amount: u64,
}

#[event]
pub struct LaunchSettled {
    pub launch: Pubkey,
    pub returned_tokens: u64,
}

#[event]
pub struct ConfigUpdated {
    pub authority: Pubkey,
    pub violation_oracle: Pubkey,
    pub paused: bool,
}
