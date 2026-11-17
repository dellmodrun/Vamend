use anchor_lang::prelude::*;

use crate::{
    constants::{CONFIG_SEED, LAUNCH_SEED},
    error::ErrorCode,
    events::ViolationReported,
    state::{LaunchStatus, ProtectedLaunch, ProtocolConfig},
};

#[derive(Accounts)]
pub struct ReportViolation<'info> {
    pub oracle: Signer<'info>,
    #[account(seeds = [CONFIG_SEED], bump = config.bump)]
    pub config: Account<'info, ProtocolConfig>,
    #[account(mut, seeds = [LAUNCH_SEED, launch.mint.as_ref()], bump = launch.bump)]
    pub launch: Account<'info, ProtectedLaunch>,
}

pub fn handler(ctx: Context<ReportViolation>, evidence: [u8; 32]) -> Result<()> {
    require_keys_eq!(
        ctx.accounts.oracle.key(),
        ctx.accounts.config.violation_oracle,
        ErrorCode::Unauthorized
    );
    require!(
        ctx.accounts.launch.status == LaunchStatus::Active,
        ErrorCode::LaunchNotActive
    );
    require!(evidence != [0; 32], ErrorCode::InvalidOption);

    let now = Clock::get()?.unix_timestamp;
    require!(now < ctx.accounts.launch.expiry, ErrorCode::OptionExpired);
    let launch = &mut ctx.accounts.launch;
    launch.status = LaunchStatus::Forfeited;
    launch.violation_at = now;
    launch.violation_evidence = evidence;
    launch.forfeit_pool_tokens = launch.remaining_tokens;
    launch.forfeit_open_options = launch.open_option_tokens;
    emit!(ViolationReported {
        launch: launch.key(),
        oracle: ctx.accounts.oracle.key(),
        evidence,
        timestamp: now
    });
    Ok(())
}
