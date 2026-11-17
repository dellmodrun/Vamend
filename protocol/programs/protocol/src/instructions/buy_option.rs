use anchor_lang::{prelude::*, system_program};
use anchor_spl::token_interface::Mint;

use crate::{
    constants::{CONFIG_SEED, LAUNCH_SEED, MAX_TOKEN_DECIMALS, OPTION_SEED},
    error::ErrorCode,
    events::OptionPurchased,
    math::option_premium,
    state::{LaunchStatus, OptionPosition, ProtectedLaunch, ProtocolConfig},
};

#[derive(Accounts)]
#[instruction(strike_lamports: u64)]
pub struct BuyOption<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(seeds = [CONFIG_SEED], bump = config.bump)]
    pub config: Account<'info, ProtocolConfig>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut, seeds = [LAUNCH_SEED, mint.key().as_ref()], bump = launch.bump, has_one = mint)]
    pub launch: Account<'info, ProtectedLaunch>,
    #[account(
        init_if_needed,
        payer = buyer,
        space = 8 + OptionPosition::INIT_SPACE,
        seeds = [OPTION_SEED, launch.key().as_ref(), buyer.key().as_ref(), &strike_lamports.to_le_bytes()],
        bump
    )]
    pub position: Account<'info, OptionPosition>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<BuyOption>, strike_lamports: u64, quantity: u64) -> Result<()> {
    require!(!ctx.accounts.config.paused, ErrorCode::ProtocolPaused);
    require!(
        ctx.accounts.launch.status == LaunchStatus::Active,
        ErrorCode::LaunchNotActive
    );
    require!(
        Clock::get()?.unix_timestamp < ctx.accounts.launch.expiry,
        ErrorCode::OptionExpired
    );
    require!(
        strike_lamports > 0 && quantity > 0,
        ErrorCode::InvalidOption
    );
    require!(
        ctx.accounts.mint.decimals <= MAX_TOKEN_DECIMALS,
        ErrorCode::UnsupportedDecimals
    );

    let available = ctx
        .accounts
        .launch
        .remaining_tokens
        .checked_sub(ctx.accounts.launch.open_option_tokens)
        .ok_or(ErrorCode::ArithmeticError)?;
    require!(quantity <= available, ErrorCode::InsufficientInventory);

    let premium = option_premium(strike_lamports, quantity, ctx.accounts.mint.decimals)?;
    require!(premium > 0, ErrorCode::InvalidOption);

    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.key(),
            system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.launch.to_account_info(),
            },
        ),
        premium,
    )?;

    let launch = &mut ctx.accounts.launch;
    launch.open_option_tokens = launch
        .open_option_tokens
        .checked_add(quantity)
        .ok_or(ErrorCode::ArithmeticError)?;
    launch.premium_lamports = launch
        .premium_lamports
        .checked_add(premium)
        .ok_or(ErrorCode::ArithmeticError)?;

    let position = &mut ctx.accounts.position;
    if position.buyer == Pubkey::default() {
        position.launch = launch.key();
        position.buyer = ctx.accounts.buyer.key();
        position.strike_lamports = strike_lamports;
        position.quantity = 0;
        position.premium_paid = 0;
        position.exercised_tokens = 0;
        position.claimed_forfeiture = false;
        position.bump = ctx.bumps.position;
    }
    require!(
        position.launch == launch.key() && position.buyer == ctx.accounts.buyer.key(),
        ErrorCode::InvalidPosition
    );
    position.quantity = position
        .quantity
        .checked_add(quantity)
        .ok_or(ErrorCode::ArithmeticError)?;
    position.premium_paid = position
        .premium_paid
        .checked_add(premium)
        .ok_or(ErrorCode::ArithmeticError)?;
    emit!(OptionPurchased {
        launch: launch.key(),
        buyer: ctx.accounts.buyer.key(),
        strike_lamports,
        quantity,
        premium_lamports: premium,
    });
    Ok(())
}
