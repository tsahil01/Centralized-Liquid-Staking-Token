"use server"

import { getMint } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_MINT } from "./accounts";

const initialApy = 4; // 4 percent

export async function getApy() {
    const connection = new Connection("https://devnet.helius-rpc.com/?api-key=5ee90506-9542-4e79-aa66-a9280837284a", {
        commitment: "confirmed",
    });
    const mint = new PublicKey(TOKEN_MINT);
    const token = await getMint(connection, mint);

    const totalSupply = token.supply; //  lamports
    const totalSupplyInSol = Number(totalSupply) / 10 ** 9;

    if (totalSupplyInSol! > 0) {
        return initialApy;
    }
    const finalApy = totalSupplyInSol / (totalSupplyInSol * initialApy) + initialApy / totalSupplyInSol;

    return BigInt(finalApy);
}
