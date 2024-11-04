import { getMint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_MINT } from "./accounts";

const initialApy = 4; // 4 percent

export async function getApy() {
    const connection = new Connection("https://devnet.helius-rpc.com/?api-key=5ee90506-9542-4e79-aa66-a9280837284a", {
        commitment: "confirmed",
    });
    const mint = new PublicKey(TOKEN_MINT);
    const token = await getMint(connection, mint, "confirmed", TOKEN_2022_PROGRAM_ID);

    const totalSupply = token.supply; //  lamports
    // console.log("Total supply in lamports: ", totalSupply);
    const totalSupplyInSol = Number(totalSupply) / 10 ** 9;

    if (totalSupplyInSol === 0) {
        return initialApy;
    }
    const finalApy = initialApy + ((totalSupplyInSol) / (initialApy * initialApy))
    // console.log("APY: ", finalApy);
    const finalApyPercentage = finalApy.toFixed(2);
    console.log("APY: ", finalApyPercentage);

    return finalApyPercentage;
}
