import { burnTokens } from "@/lib/burnTokens";
import { getApy } from "@/lib/maths";
import { mintTokens } from "@/lib/mintTokens";
import { sendNativeTokens } from "@/lib/sendNativeTokens";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.json();

    const fromAddress = data.fromAddress;
    const toAddress = data.toAddress;
    const amount = BigInt(data.amount);
    const type = "received_native_sol";

    const apy = await getApy();

    if (type === "received_native_sol") {

        const newAmount = amount + BigInt(apy) * amount;

        const data = await mintTokens(fromAddress, newAmount);
        return NextResponse.json({
            message: "ok",
            data
        })
    } else {
        console.log("Burning tokens for", fromAddress);
        const burn = await burnTokens(amount);

        console.log("Sending native tokens to", fromAddress);
        const newAmount = amount - BigInt(apy) * amount;
        const send = await sendNativeTokens(fromAddress, newAmount); // send native tokens like SOL

        return await NextResponse.json({
            message: "ok",
            burn,
            send
        })
    }
}
