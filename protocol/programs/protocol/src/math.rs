use crate::{constants::OPTION_PREMIUM_DIVISOR, error::ErrorCode};

pub fn locked_amount(supply: u64, lock_bps: u16) -> Result<u64, ErrorCode> {
    checked_mul_div(supply, lock_bps as u64, 10_000)
}

pub fn exercise_cost(strike_lamports: u64, quantity: u64, decimals: u8) -> Result<u64, ErrorCode> {
    let scale = 10_u64
        .checked_pow(decimals as u32)
        .ok_or(ErrorCode::ArithmeticError)?;
    checked_mul_div(strike_lamports, quantity, scale)
}

pub fn option_premium(strike_lamports: u64, quantity: u64, decimals: u8) -> Result<u64, ErrorCode> {
    let cost = exercise_cost(strike_lamports, quantity, decimals)?;
    cost.checked_div(OPTION_PREMIUM_DIVISOR as u64)
        .ok_or(ErrorCode::ArithmeticError)
}

pub fn proportional_share(pool: u64, position: u64, total: u64) -> Result<u64, ErrorCode> {
    if total == 0 {
        return Err(ErrorCode::ArithmeticError);
    }
    checked_mul_div(pool, position, total)
}

fn checked_mul_div(a: u64, b: u64, denominator: u64) -> Result<u64, ErrorCode> {
    if denominator == 0 {
        return Err(ErrorCode::ArithmeticError);
    }
    let value = (a as u128)
        .checked_mul(b as u128)
        .ok_or(ErrorCode::ArithmeticError)?
        .checked_div(denominator as u128)
        .ok_or(ErrorCode::ArithmeticError)?;
    u64::try_from(value).map_err(|_| ErrorCode::ArithmeticError)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn computes_lock_and_option_values_without_float_math() {
        assert_eq!(locked_amount(1_000_000_000, 200).unwrap(), 20_000_000);
        assert_eq!(
            exercise_cost(100_000_000, 10_000_000, 6).unwrap(),
            1_000_000_000
        );
        assert_eq!(
            option_premium(100_000_000, 10_000_000, 6).unwrap(),
            100_000_000
        );
    }

    #[test]
    fn computes_pro_rata_claims_and_rejects_zero_total() {
        assert_eq!(proportional_share(1_000, 3, 10).unwrap(), 300);
        assert!(proportional_share(1_000, 3, 0).is_err());
    }
}
