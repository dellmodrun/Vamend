use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked};

use crate::{
    constants::{
        CONFIG_SEED, LAUNCH_SEED, MARKET_SEED, MAX_EXPIRY_SECONDS, MAX_LOCK_BPS,
        MIN_EXPIRY_SECONDS, MIN_LOCK_BPS, VAULT_SEED,
    },
    error::ErrorCode,
    events::LaunchRegistered,
    math::locked_amount,
    state::{LaunchStatus, MarketGroup, ProtectedLaunch, ProtocolConfig},
};

#[derive(Accounts)]
#[instruction(canonical_name: String)]
pub struct RegisterLaunch<'info> {
    #[account(mut)]
    pub developer: Signer<'info>,
    #[account(seeds = [CONFIG_SEED], bump = config.bump)]
    pub config: Account<'info, ProtocolConfig>,
    #[account(mut, seeds = [MARKET_SEED, canonical_name.as_bytes()], bump = market.bump)]
    pub market: Account<'info, MarketGroup>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        init,
        payer = developer,
        space = 8 + ProtectedLaunch::INIT_SPACE,
        seeds = [LAUNCH_SEED, mint.key().as_ref()],
        bump
    )]
    pub launch: Account<'info, ProtectedLaunch>,
    #[account(
        init,
        payer = developer,
        token::mint = mint,
        token::authority = launch,
        token::token_program = token_program,
        seeds = [VAULT_SEED, launch.key().as_ref()],
        bump
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = mint,
        token::authority = developer,
        token::token_program = token_program
    )]
    pub developer_tokens: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<RegisterLaunch>,
    canonical_name: String,
    lock_bps: u16,
    amount: u64,
    expiry: i64,
) -> Result<()> {
    require!(!ctx.accounts.config.paused, ErrorCode::ProtocolPaused);
    require!(
        ctx.accounts.market.canonical_name == canonical_name,
        ErrorCode::InvalidCanonicalName
    );
    require!(
        (MIN_LOCK_BPS..=MAX_LOCK_BPS).contains(&lock_bps),
        ErrorCode::InvalidLockBps
    );

    let now = Clock::get()?.unix_timestamp;
    let duration = expiry.checked_sub(now).ok_or(ErrorCode::ArithmeticError)?;
    require!(
        (MIN_EXPIRY_SECONDS..=MAX_EXPIRY_SECONDS).contains(&duration),
        ErrorCode::InvalidExpiry
    );

    let expected = locked_amount(ctx.accounts.mint.supply, lock_bps)?;
    require!(
        expected > 0 && expected == amount,
        ErrorCode::InvalidLockAmount
    );

    token_interface::transfer_checked(
        CpiContext::new(
            ctx.accounts.token_program.key(),
            TransferChecked {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.developer_tokens.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.developer.to_account_info(),
            },
        ),
        amount,
        ctx.accounts.mint.decimals,
    )?;

    let launch = &mut ctx.accounts.launch;
    launch.market = ctx.accounts.market.key();
    launch.mint = ctx.accounts.mint.key();
    launch.developer = ctx.accounts.developer.key();
    launch.vault = ctx.accounts.vault.key();
    launch.deposited_tokens = amount;
    launch.remaining_tokens = amount;
    launch.open_option_tokens = 0;
    launch.premium_lamports = 0;
    launch.expiry = expiry;
    launch.violation_at = 0;
    launch.forfeit_pool_tokens = 0;
    launch.forfeit_open_options = 0;
    launch.forfeit_claimed_tokens = 0;
    launch.forfeit_claimed_options = 0;
    launch.violation_evidence = [0; 32];
    launch.lock_bps = lock_bps;
    launch.status = LaunchStatus::Active;
    launch.bump = ctx.bumps.launch;
    launch.vault_bump = ctx.bumps.vault;
    ctx.accounts.market.launch_count = ctx
        .accounts
        .market
        .launch_count
        .checked_add(1)
        .ok_or(ErrorCode::ArithmeticError)?;
    emit!(LaunchRegistered {
        launch: launch.key(),
        market: launch.market,
        mint: launch.mint,
        developer: launch.developer,
        amount,
        lock_bps,
        expiry,
    });
    Ok(())
}
