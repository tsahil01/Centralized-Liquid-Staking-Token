import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { OWNER_PRIVATE_KEY } from "./accounts";
import bs58 from "bs58";

export async function sendNativeTokens(fromAddress: string, amount: number | bigint) {
    // send native tokens like SOL

    const secretKeyBytes = bs58.decode(OWNER_PRIVATE_KEY);
    const owner = Keypair.fromSecretKey(secretKeyBytes);

    const connection = new Connection("https://devnet.helius-rpc.com/?api-key=5ee90506-9542-4e79-aa66-a9280837284a", {
        commitment: "confirmed",
    });

    try {
        const userPublicKey = new PublicKey(fromAddress);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: owner.publicKey,
                toPubkey: userPublicKey,
                lamports: amount,
            })
        );

        const signature = await connection.sendTransaction(transaction, [owner]);
        await connection.confirmTransaction(signature, "confirmed");
        console.log("Transaction confirmed", signature);

        return {
            status: "ok",
            signature,
        }
    } catch (error) {
        console.error("Error sending native tokens", error);
        return {
            status: "error",
            error,
        }
    }
}