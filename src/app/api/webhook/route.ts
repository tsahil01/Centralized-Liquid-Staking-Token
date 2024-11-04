/* eslint-disable @typescript-eslint/no-unused-vars */
import { OWNER_PUBLIC_KEY, TOKEN_MINT } from "@/lib/accounts";
import { burnTokens } from "@/lib/burnTokens";
import { getApy } from "@/lib/maths";
import { mintTokens } from "@/lib/mintTokens";
import { sendNativeTokens } from "@/lib/sendNativeTokens";
import { PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = (await req.json());
        console.log("Data: ", data);
        let fromAddress = "";
        let amount = 0;
        const typeInput = data[0].type;
        console.log("Type: ", typeInput);

        if (typeInput === "TRANSFER") {
            amount = Number(data[0].nativeTransfers[0].amount);
            console.log("Amount: ", amount);

            fromAddress = data[0].nativeTransfers[0].fromUserAccount;
            console.log("From: ", fromAddress);

            if (fromAddress === new PublicKey(OWNER_PUBLIC_KEY).toString()) {
                console.log("Owner transfer");
                return NextResponse.json({
                    message: "Owner transfer",
                    data
                });
            } else {
                console.log("User transfer");
            }
        } else if (data[0].type == "TOKENTRANSFER") {

            fromAddress = data[0].from;
            console.log("From: ", fromAddress);
            amount = Number(data[0].amount);
            console.log("Amount: ", amount);
        }

        const apy = await getApy(amount);
        const earnedAmount = apy.earnedAmount;

        if (typeInput === "TRANSFER") {
            const newAmount = amount - earnedAmount;
            console.log("newAmount: ", newAmount);

            const mintData = await mintTokens(fromAddress, newAmount);
            return NextResponse.json({
                message: "ok",
                data: mintData,
                apy,
                sol: amount,
                token: newAmount
            });
        } else if (typeInput === "TOKENTRANSFER") {
            console.log("Burning tokens for", fromAddress);
            const burn = await burnTokens(amount);

            console.log("Sending native tokens to", fromAddress);

            const newAmount = amount + earnedAmount;
            console.log("New amount: ", newAmount);
            const send = await sendNativeTokens(fromAddress, newAmount);

            return NextResponse.json({
                message: "ok",
                burn,
                send,
                apy,
                sol: newAmount,
                token: amount
            });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({
            message: "An error occurred",
            error: error
        });
    }
}
