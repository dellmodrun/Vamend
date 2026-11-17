use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct ProtocolConfig {
    pub authority: Pubkey,
    pub violation_oracle: Pubkey,
    pub paused: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct MarketGroup {
    #[max_len(32)]
    pub canonical_name: String,
    pub launch_count: u32,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct ProtectedLaunch {
    pub market: Pubkey,
    pub mint: Pubkey,
    pub developer: Pubkey,
    pub vault: Pubkey,
    pub deposited_tokens: u64,
    pub remaining_tokens: u64,
    pub open_option_tokens: u64,
    pub premium_lamports: u64,
    pub expiry: i64,
    pub violation_at: i64,
    pub forfeit_pool_tokens: u64,
    pub forfeit_open_options: u64,
    pub forfeit_claimed_tokens: u64,
    pub forfeit_claimed_options: u64,
    pub violation_evidence: [u8; 32],
    pub lock_bps: u16,
    pub status: LaunchStatus,
    pub bump: u8,
    pub vault_bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct OptionPosition {
    pub launch: Pubkey,
    pub buyer: Pubkey,
    pub strike_lamports: u64,
    pub quantity: u64,
    pub premium_paid: u64,
    pub exercised_tokens: u64,
    pub claimed_forfeiture: bool,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, InitSpace, PartialEq, Eq)]
pub enum LaunchStatus {
    Active,
    Forfeited,
    Expired,
}
