
import { Connection, PublicKey,} from "@solana/web3.js";

import { LiquidityPoolKeys, Liquidity, TokenAmount, Token, Percent, TOKEN_PROGRAM_ID, SPL_ACCOUNT_LAYOUT,  TokenAccount } from "@raydium-io/raydium-sdk";

/**
 * getTokenAccountsByOwner(): get all token account address by querying one owner's address
 */
export async function getTokenAccountsByOwner(
    connection: Connection,
    owner: PublicKey,
) {
    const tokenResp = await connection.getTokenAccountsByOwner(
        owner,
        {
            programId: TOKEN_PROGRAM_ID
        },
    );

    const accounts: TokenAccount[] = [];

    for (const { pubkey, account } of tokenResp.value) {
        accounts.push({
            pubkey,
            accountInfo:SPL_ACCOUNT_LAYOUT.decode(account.data)
        });
    }

    return accounts;
}

/**
 * swapInDirection: used to determine the direction of the swap
 * Eg: TEST1_TEST2_LP_V4_POOL_KEY is using TOKEN1 as quote token, TOKEN2 as base token
 * If the swapInDirection is true, currencyIn is TOKEN1 and currencyOut is TOKEN2
 * vice versa
 */
export async function calcAmountOut(connection: Connection, poolKeys: LiquidityPoolKeys, rawAmountIn: number, swapInDirection: boolean) {
    const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys });

    console.log('poolInfo', poolInfo)
    let currencyInMint = poolKeys.baseMint;
    let currencyInDecimals = poolInfo.baseDecimals;
    let currencyOutMint = poolKeys.quoteMint;
    let currencyOutDecimals = poolInfo.quoteDecimals;

    if (!swapInDirection) {
        currencyInMint = poolKeys.quoteMint;
        currencyInDecimals = poolInfo.quoteDecimals;
        currencyOutMint = poolKeys.baseMint;
        currencyOutDecimals = poolInfo.baseDecimals;
    }

    const currencyIn = new Token(currencyInMint, currencyInDecimals);
    const amountIn = new TokenAmount(currencyIn, rawAmountIn, false);
    const currencyOut = new Token(currencyOutMint, currencyOutDecimals);
    const slippage = new Percent(5, 100); // 5% slippage

    const {
        amountOut,
        minAmountOut,
        currentPrice,
        executionPrice,
        priceImpact,
        fee,
    } = Liquidity.computeAmountOut({ poolKeys, poolInfo, amountIn, currencyOut, slippage, });

    return {
        amountIn,
        amountOut,
        minAmountOut,
        currentPrice,
        executionPrice,
        priceImpact,
        fee,
    };
}