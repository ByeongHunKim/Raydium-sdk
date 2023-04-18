import fetch from 'isomorphic-fetch';
import {
    TradeV2
} from "@raydium-io/raydium-sdk";

import {
    SOLANA_RPC,
    WALLET_ADDRESS,
    PRIVATE_KEY,
} from '../constant';


import { getTokenAccountsByOwner, calcAmountOut } from '../utils/utils';
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
const makePoolTransaction = async () => {

    const connection = new Connection(SOLANA_RPC);
    const publicKey = new PublicKey(WALLET_ADDRESS);
    const key = Buffer.from(PRIVATE_KEY)
    const signer = Keypair.fromSecretKey(key);
    const tokenAcc = await getTokenAccountsByOwner(connection, publicKey); // get all token accounts
    console.log('tokenAcc', tokenAcc)

    /**
     * swapInfo 파라미터는 ComputeAmountOutRouteLayout 타입의 객체를 필요로 하는걸로 이해했는데, 실제코드에서 너무 많이 꼬여있어서 이해가 안되었다
     */
    try {
        const { innerTransactions } = await TradeV2.makeSwapInstructionSimple({
            connection,
            swapInfo: ,
            ownerInfo: {
                wallet: publicKey,
                tokenAccounts: tokenAcc,
                associatedOnly: true
            },
            checkTransaction: true,
            computeBudgetConfig: {units: 400000, microLamports: 25000}
        })
        console.log('innerTransactions', innerTransactions)

    } catch (err: any) {
        console.error('tx failed => ', err);
    }

    // todo make swap transaction

}
makePoolTransaction()