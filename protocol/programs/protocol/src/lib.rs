pub mod constants;
pub mod error;
pub mod events;
pub mod instructions;
pub mod math;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("HZa5dYATXsrpcxM2kzHi34AsXtxFiPV7iF9cV4cRg9zc");

#[program]
pub mod protocol {
    use super::*;

    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        violation_oracle: Pubkey,
    ) -> Result<()> {
        instructions::initialize_config::handler(ctx, violation_oracle)
    }

    pub fn create_market(ctx: Context<CreateMarket>, canonical_name: String) -> Result<()> {
        instructions::create_market::handler(ctx, canonical_name)
    }

    pub fn register_launch(
        ctx: Context<RegisterLaunch>,
        canonical_name: String,
        lock_bps: u16,
        amount: u64,
        expiry: i64,
    ) -> Result<()> {
        instructions::register_launch::handler(ctx, canonical_name, lock_bps, amount, expiry)
    }

    pub fn buy_option(ctx: Context<BuyOption>, strike_lamports: u64, quantity: u64) -> Result<()> {
        instructions::buy_option::handler(ctx, strike_lamports, quantity)
    }

    pub fn exercise_option(ctx: Context<ExerciseOption>, quantity: u64) -> Result<()> {
        instructions::exercise_option::handler(ctx, quantity)
    }

    pub fn report_violation(ctx: Context<ReportViolation>, evidence: [u8; 32]) -> Result<()> {
        instructions::report_violation::handler(ctx, evidence)
    }

    pub fn claim_forfeiture(ctx: Context<ClaimForfeiture>) -> Result<()> {
        instructions::claim_forfeiture::handler(ctx)
    }

    pub fn settle_expired(ctx: Context<SettleExpired>) -> Result<()> {
        instructions::settle_expired::handler(ctx)
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        new_authority: Option<Pubkey>,
        new_violation_oracle: Option<Pubkey>,
        paused: Option<bool>,
    ) -> Result<()> {
        instructions::update_config::handler(ctx, new_authority, new_violation_oracle, paused)
    }
}
