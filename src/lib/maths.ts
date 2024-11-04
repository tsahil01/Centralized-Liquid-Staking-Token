import { getMint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_MINT } from "./accounts";

const initialApy = 4; // 4 percent

interface ApyResult {
    apy: number; // APY in percentage
    earnedAmount: number; // Amount earned in SOL
}

export async function getApy(investedAmount: number = 1): Promise<ApyResult> {
    const endpoint = process.env.NEXT_PUBLIC_RPC_URL || "";
    const connection = new Connection(endpoint, {
        commitment: "confirmed",
    });
    const mint = new PublicKey(TOKEN_MINT);
    const token = await getMint(connection, mint, "confirmed", TOKEN_2022_PROGRAM_ID);

    const totalSupply = token.supply; // lamports
    const totalSupplyInSol = Number(totalSupply) / 10 ** 9;

    if (totalSupplyInSol === 0) {
        return { apy: initialApy, earnedAmount: 0 };
    }

    const finalApy = initialApy + (totalSupplyInSol / (initialApy * initialApy));
    const finalApyPercentage = finalApy / 100; // Convert APY to decimal

    // Calculate earnings based on the invested amount and the final APY
    const earnedAmount = investedAmount * finalApyPercentage;

    console.log("APY: ", (finalApyPercentage * 100).toFixed(2) + '%');
    console.log("Earned Amount: ", earnedAmount.toFixed(2));

    return { apy: finalApyPercentage * 100, earnedAmount: earnedAmount };
}
