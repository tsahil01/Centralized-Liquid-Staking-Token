import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { OWNER_PRIVATE_KEY } from "./accounts";
import bs58 from "bs58";

export async function sendNativeTokens(fromAddress: string, amount: number) {
    // Send native tokens like SOL

    const secretKeyBytes = bs58.decode(OWNER_PRIVATE_KEY);
    const owner = Keypair.fromSecretKey(secretKeyBytes);
    const endpoint = process.env.NEXT_PUBLIC_RPC_URL || "";

    const connection = new Connection(endpoint, {
        commitment: "confirmed",
    });

    try {
        const userPublicKey = new PublicKey(fromAddress);

        const amt = amount / LAMPORTS_PER_SOL;
        const finalAmt =  Math.floor(amt * LAMPORTS_PER_SOL);
        
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: owner.publicKey,
                toPubkey: userPublicKey,
                lamports: finalAmt,
            })
        );

        const signature = await connection.sendTransaction(transaction, [owner]);
        await connection.confirmTransaction(signature, "confirmed");
        console.log("Transaction confirmed", signature);

        return {
            status: "ok",
            signature,
        };
    } catch (error) {
        console.error("Error sending native tokens", error);
        return {
            status: "error",
            error,
        };
    }
}
