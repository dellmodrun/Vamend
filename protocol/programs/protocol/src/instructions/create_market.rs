use anchor_lang::prelude::*;

use crate::{
    constants::{MARKET_SEED, MAX_NAME_BYTES},
    error::ErrorCode,
    events::MarketCreated,
    state::MarketGroup,
};

#[derive(Accounts)]
#[instruction(canonical_name: String)]
pub struct CreateMarket<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = 8 + MarketGroup::INIT_SPACE,
        seeds = [MARKET_SEED, canonical_name.as_bytes()],
        bump
    )]
    pub market: Account<'info, MarketGroup>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateMarket>, canonical_name: String) -> Result<()> {
    validate_canonical_name(&canonical_name)?;

    let market = &mut ctx.accounts.market;
    market.canonical_name = canonical_name;
    market.launch_count = 0;
    market.bump = ctx.bumps.market;
    emit!(MarketCreated {
        market: market.key(),
        payer: ctx.accounts.payer.key()
    });
    Ok(())
}

fn validate_canonical_name(name: &str) -> Result<()> {
    let bytes = name.as_bytes();
    require!(
        !bytes.is_empty() && bytes.len() <= MAX_NAME_BYTES,
        ErrorCode::InvalidCanonicalName
    );
    require!(
        bytes.first() != Some(&b' ') && bytes.last() != Some(&b' '),
        ErrorCode::InvalidCanonicalName
    );
    require!(
        bytes.iter().all(|byte| byte.is_ascii_lowercase()
            || byte.is_ascii_digit()
            || matches!(byte, b' ' | b'-' | b'_')),
        ErrorCode::InvalidCanonicalName
    );
    Ok(())
}
