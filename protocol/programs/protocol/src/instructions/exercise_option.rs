use anchor_lang::{prelude::*, system_program};
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked};

use crate::{
    constants::{LAUNCH_SEED, MAX_TOKEN_DECIMALS, OPTION_SEED, VAULT_SEED},
    error::ErrorCode,
    events::OptionExercised,
    math::exercise_cost,
    state::{LaunchStatus, OptionPosition, ProtectedLaunch},
};

#[derive(Accounts)]
pub struct ExerciseOption<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: Constrained to the developer stored in the launch account.
    #[account(mut, address = launch.developer)]
    pub developer: UncheckedAccount<'info>,
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
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ExerciseOption>, quantity: u64) -> Result<()> {
    require!(
        ctx.accounts.launch.status == LaunchStatus::Active,
        ErrorCode::LaunchNotActive
    );
    require!(
        Clock::get()?.unix_timestamp < ctx.accounts.launch.expiry,
        ErrorCode::OptionExpired
    );
    require!(
        quantity > 0 && ctx.accounts.mint.decimals <= MAX_TOKEN_DECIMALS,
        ErrorCode::InvalidOption
    );

    let unexercised = ctx
        .accounts
        .position
        .quantity
        .checked_sub(ctx.accounts.position.exercised_tokens)
        .ok_or(ErrorCode::ArithmeticError)?;
    require!(
        quantity <= unexercised && quantity <= ctx.accounts.launch.remaining_tokens,
        ErrorCode::InsufficientInventory
    );

    let exercise_cost = exercise_cost(
        ctx.accounts.position.strike_lamports,
        quantity,
        ctx.accounts.mint.decimals,
    )?;
    require!(exercise_cost > 0, ErrorCode::InvalidOption);

    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.key(),
            system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.developer.to_account_info(),
            },
        ),
        exercise_cost,
    )?;

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
        quantity,
        ctx.accounts.mint.decimals,
    )?;

    ctx.accounts.position.exercised_tokens = ctx
        .accounts
        .position
        .exercised_tokens
        .checked_add(quantity)
        .ok_or(ErrorCode::ArithmeticError)?;
    ctx.accounts.launch.open_option_tokens = ctx
        .accounts
        .launch
        .open_option_tokens
        .checked_sub(quantity)
        .ok_or(ErrorCode::ArithmeticError)?;
    ctx.accounts.launch.remaining_tokens = ctx
        .accounts
        .launch
        .remaining_tokens
        .checked_sub(quantity)
        .ok_or(ErrorCode::ArithmeticError)?;
    emit!(OptionExercised {
        launch: ctx.accounts.launch.key(),
        buyer: ctx.accounts.buyer.key(),
        quantity,
        exercise_lamports: exercise_cost,
    });
    Ok(())
}
