use anchor_lang::prelude::*;

use crate::{
    constants::CONFIG_SEED, error::ErrorCode, events::ConfigUpdated, state::ProtocolConfig,
};

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [CONFIG_SEED],
        bump = config.bump,
        has_one = authority @ ErrorCode::Unauthorized
    )]
    pub config: Account<'info, ProtocolConfig>,
}

pub fn handler(
    ctx: Context<UpdateConfig>,
    new_authority: Option<Pubkey>,
    new_violation_oracle: Option<Pubkey>,
    paused: Option<bool>,
) -> Result<()> {
    let config = &mut ctx.accounts.config;
    if let Some(authority) = new_authority {
        require!(authority != Pubkey::default(), ErrorCode::InvalidAuthority);
        config.authority = authority;
    }
    if let Some(oracle) = new_violation_oracle {
        require!(oracle != Pubkey::default(), ErrorCode::InvalidAuthority);
        config.violation_oracle = oracle;
    }
    if let Some(value) = paused {
        config.paused = value;
    }

    emit!(ConfigUpdated {
        authority: config.authority,
        violation_oracle: config.violation_oracle,
        paused: config.paused,
    });
    Ok(())
}
