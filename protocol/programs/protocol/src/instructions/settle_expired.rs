use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked};

use crate::{
    constants::{LAUNCH_SEED, VAULT_SEED},
    error::ErrorCode,
    events::LaunchSettled,
    state::{LaunchStatus, ProtectedLaunch},
};

#[derive(Accounts)]
pub struct SettleExpired<'info> {
    #[account(mut, address = launch.developer)]
    pub developer: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut, seeds = [LAUNCH_SEED, mint.key().as_ref()], bump = launch.bump, has_one = mint)]
    pub launch: Account<'info, ProtectedLaunch>,
    #[account(
        mut,
        seeds = [VAULT_SEED, launch.key().as_ref()],
        bump = launch.vault_bump,
        token::mint = mint,
        token::authority = launch,
        token::token_program = token_program
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,
    #[account(mut, token::mint = mint, token::authority = developer, token::token_program = token_program)]
    pub developer_tokens: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}

pub fn handler(ctx: Context<SettleExpired>) -> Result<()> {
    require!(
        ctx.accounts.launch.status == LaunchStatus::Active,
        ErrorCode::LaunchNotActive
    );
    require!(
        Clock::get()?.unix_timestamp >= ctx.accounts.launch.expiry,
        ErrorCode::LaunchNotExpired
    );

    let amount = ctx.accounts.launch.remaining_tokens;
    if amount > 0 {
        let mint_key = ctx.accounts.mint.key();
        let bump = [ctx.accounts.launch.bump];
        let signer_seeds: &[&[&[u8]]] = &[&[LAUNCH_SEED, mint_key.as_ref(), &bump]];
        token_interface::transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.key(),
                TransferChecked {
                    mint: ctx.accounts.mint.to_account_info(),
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.developer_tokens.to_account_info(),
                    authority: ctx.accounts.launch.to_account_info(),
                },
            )
            .with_signer(signer_seeds),
            amount,
            ctx.accounts.mint.decimals,
        )?;
    }

    ctx.accounts.launch.remaining_tokens = 0;
    ctx.accounts.launch.open_option_tokens = 0;
    ctx.accounts.launch.status = LaunchStatus::Expired;
    emit!(LaunchSettled {
        launch: ctx.accounts.launch.key(),
        returned_tokens: amount
    });
    Ok(())
}
