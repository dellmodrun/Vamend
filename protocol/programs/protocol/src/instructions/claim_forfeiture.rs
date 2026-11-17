use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked};

use crate::{
    constants::{LAUNCH_SEED, OPTION_SEED, VAULT_SEED},
    error::ErrorCode,
    events::ForfeitureClaimed,
    math::proportional_share,
    state::{LaunchStatus, OptionPosition, ProtectedLaunch},
};

#[derive(Accounts)]
pub struct ClaimForfeiture<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut, seeds = [LAUNCH_SEED, mint.key().as_ref()], bump = launch.bump, has_one = mint)]
    pub launch: Account<'info, ProtectedLaunch>,
    #[account(
        mut,
        seeds = [OPTION_SEED, launch.key().as_ref(), buyer.key().as_ref(), &position.strike_lamports.to_le_bytes()],
        bump = position.bump,
        has_one = launch,
        has_one = buyer
    )]
    pub position: Account<'info, OptionPosition>,
    #[account(
        mut,
        seeds = [VAULT_SEED, launch.key().as_ref()],
        bump = launch.vault_bump,
        token::mint = mint,
        token::authority = launch,
        token::token_program = token_program
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,
    #[account(mut, token::mint = mint, token::authority = buyer, token::token_program = token_program)]
    pub buyer_tokens: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}

pub fn handler(ctx: Context<ClaimForfeiture>) -> Result<()> {
    require!(
        ctx.accounts.launch.status == LaunchStatus::Forfeited,
        ErrorCode::LaunchNotForfeited
    );
    require!(
        !ctx.accounts.position.claimed_forfeiture,
        ErrorCode::AlreadyClaimed
    );

    let unexercised = ctx
        .accounts
        .position
        .quantity
        .checked_sub(ctx.accounts.position.exercised_tokens)
        .ok_or(ErrorCode::ArithmeticError)?;
    require!(
        unexercised > 0 && ctx.accounts.launch.forfeit_open_options > 0,
        ErrorCode::InvalidOption
    );
    let claimed_options_after = ctx
        .accounts
        .launch
        .forfeit_claimed_options
        .checked_add(unexercised)
        .ok_or(ErrorCode::ArithmeticError)?;
    require!(
        claimed_options_after <= ctx.accounts.launch.forfeit_open_options,
        ErrorCode::InvalidOption
    );
    let claim = if claimed_options_after == ctx.accounts.launch.forfeit_open_options {
        ctx.accounts.launch.remaining_tokens
    } else {
        proportional_share(
            ctx.accounts.launch.forfeit_pool_tokens,
            unexercised,
            ctx.accounts.launch.forfeit_open_options,
        )?
    };
    require!(
        claim > 0 && claim <= ctx.accounts.launch.remaining_tokens,
        ErrorCode::InsufficientInventory
    );

    let mint_key = ctx.accounts.mint.key();
    let bump = [ctx.accounts.launch.bump];
    let signer_seeds: &[&[&[u8]]] = &[&[LAUNCH_SEED, mint_key.as_ref(), &bump]];
    token_interface::transfer_checked(
        CpiContext::new(
            ctx.accounts.token_program.key(),
            TransferChecked {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.buyer_tokens.to_account_info(),
                authority: ctx.accounts.launch.to_account_info(),
            },
        )
        .with_signer(signer_seeds),
        claim,
        ctx.accounts.mint.decimals,
    )?;

    ctx.accounts.position.claimed_forfeiture = true;
    ctx.accounts.launch.remaining_tokens = ctx
        .accounts
        .launch
        .remaining_tokens
        .checked_sub(claim)
        .ok_or(ErrorCode::ArithmeticError)?;
    ctx.accounts.launch.forfeit_claimed_tokens = ctx
        .accounts
        .launch
        .forfeit_claimed_tokens
        .checked_add(claim)
        .ok_or(ErrorCode::ArithmeticError)?;
    ctx.accounts.launch.forfeit_claimed_options = claimed_options_after;
    emit!(ForfeitureClaimed {
        launch: ctx.accounts.launch.key(),
        buyer: ctx.accounts.buyer.key(),
        amount: claim
    });
    Ok(())
}
