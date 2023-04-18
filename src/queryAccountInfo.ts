import {
    LAMPORTS_PER_SOL,
    Connection,
    PublicKey,
} from "@solana/web3.js";

import { getTokenAccountsByOwner, calcAmountOut } from '../utils/utils';

import {
    TEST1_TEST2_LP_V4_POOL_KEY,
    RAYDIUM_LIQUIDITY_JSON,
    SOLANA_RPC, WALLET_ADDRESS, TEST_TOKEN1_MINT
} from '../constant';
const getTokenAccountInfo = async () => {
        const connection = new Connection(SOLANA_RPC);
        const publicKey = new PublicKey(WALLET_ADDRESS);
        const balance = await connection.getBalance(publicKey); // get SOL balance
        console.log('1. balance / LAMPORTS_PER_SOL', balance / LAMPORTS_PER_SOL)

        const tokenAccs = await getTokenAccountsByOwner(connection, publicKey as PublicKey); // get all token accounts
        console.log('2. tokenAccs',tokenAccs)

        let testToken1Address: PublicKey;
        tokenAccs.filter(acc => acc.accountInfo.mint.toBase58() === TEST_TOKEN1_MINT).map(async (acc) => {
            testToken1Address = acc.pubkey;
            const accBalance = await connection.getTokenAccountBalance(testToken1Address);
            const tokenBal = accBalance.value.uiAmount || 0;
            console.log('3. tokenBal',tokenBal)
        });
};

getTokenAccountInfo()