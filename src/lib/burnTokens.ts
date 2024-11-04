import { burn, getAssociatedTokenAddress, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { OWNER_PRIVATE_KEY, TOKEN_MINT } from "./accounts";
import bs58 from "bs58";

export async function burnTokens(amount: number | bigint) {
    const connection = new Connection("https://devnet.helius-rpc.com/?api-key=5ee90506-9542-4e79-aa66-a9280837284a", {
        commitment: "confirmed",
    });

    const secretKeyBytes = bs58.decode(OWNER_PRIVATE_KEY);
    const owner = Keypair.fromSecretKey(secretKeyBytes);

    const mint = new PublicKey(TOKEN_MINT);

    const ownerTokenAccount = await getAssociatedTokenAddress(
        mint,
        owner.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
    );

    console.log("Owner token account: ", ownerTokenAccount.toBase58());

    try {
        // Ensure amount is a valid BigInt
        const validAmount = BigInt(Math.floor(Number(amount))); // Convert amount to BigInt

        // Attempt to burn tokens
        const burning = await burn(
            connection,
            owner,
            ownerTokenAccount,
            mint,
            owner.publicKey,
            validAmount,
            [],
            undefined,
            TOKEN_2022_PROGRAM_ID
        );

        console.log("Burned: ", burning);
        return {
            success: true,
            message: "Tokens burned successfully",
        };
    } catch (error) {
        console.error("Error burning tokens: ", error);
        return {
            success: false,
            message: "Error burning tokens",
        };
    }
}
