import { burnTokens } from "@/app/lib/burnTokens";
import { mintTokens } from "@/app/lib/mintTokens";
import { sendNativeTokens } from "@/app/lib/sendNativeTokens";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.json();

    const fromAddress = data.fromAddress;
    const toAddress = data.toAddress;
    const amount = data.amount;
    const type = "received_nativwe_sol";

    if (type === "received_native_sol") {
        const data = await mintTokens(fromAddress, amount);
        return NextResponse.json({
            message: "ok",
            data
        })
    } else {
        console.log("Burning tokens for", fromAddress);
        const burn = await burnTokens(amount);
        
        console.log("Sending native tokens to", fromAddress);
        const send = await sendNativeTokens(fromAddress, amount); // send native tokens like SOL

        return await NextResponse.json({
            message: "ok",
            burn,
            send
        })
    }
}
