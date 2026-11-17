use anchor_lang::prelude::*;

use crate::{constants::CONFIG_SEED, error::ErrorCode, state::ProtocolConfig};

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + ProtocolConfig::INIT_SPACE,
        seeds = [CONFIG_SEED],
        bump
    )]
    pub config: Account<'info, ProtocolConfig>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeConfig>, violation_oracle: Pubkey) -> Result<()> {
    require!(
        violation_oracle != Pubkey::default(),
        ErrorCode::InvalidAuthority
    );
    let config = &mut ctx.accounts.config;
    config.authority = ctx.accounts.authority.key();
    config.violation_oracle = violation_oracle;
    config.paused = false;
    config.bump = ctx.bumps.config;
    Ok(())
}
