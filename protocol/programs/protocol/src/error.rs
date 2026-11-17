use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("The signer is not authorized for this action")]
    Unauthorized,
    #[msg("An authority or oracle address cannot be the default address")]
    InvalidAuthority,
    #[msg("The protocol is paused")]
    ProtocolPaused,
    #[msg("The canonical market name is invalid")]
    InvalidCanonicalName,
    #[msg("The lock must be between 2% and 10% of total supply")]
    InvalidLockBps,
    #[msg("The deposited amount must exactly match the declared supply lock")]
    InvalidLockAmount,
    #[msg("The expiry is outside the supported range")]
    InvalidExpiry,
    #[msg("The token decimals exceed the supported maximum")]
    UnsupportedDecimals,
    #[msg("The option quantity or strike is invalid")]
    InvalidOption,
    #[msg("The launch does not have enough unreserved locked tokens")]
    InsufficientInventory,
    #[msg("The launch is not active")]
    LaunchNotActive,
    #[msg("The option has expired")]
    OptionExpired,
    #[msg("The launch has not expired")]
    LaunchNotExpired,
    #[msg("The launch was not forfeited")]
    LaunchNotForfeited,
    #[msg("This forfeiture position has already been claimed")]
    AlreadyClaimed,
    #[msg("The option position does not belong to this buyer and launch")]
    InvalidPosition,
    #[msg("Arithmetic overflow or loss of precision")]
    ArithmeticError,
}
