import { getMint } from "@solana/spl-token";
import {Connection, PublicKey} from "@solana/web3.js";
import {SOLANA_RPC} from "../constant";

const checkToken = async (tokenMintAddress : string) => {
    const connection = new Connection(SOLANA_RPC);

    const mintAccountPublicKey = new PublicKey(tokenMintAddress)

    let mintAccount = await getMint(connection, mintAccountPublicKey);

    console.log(mintAccount);
}

checkToken("")