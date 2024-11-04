import { getApy } from "@/lib/maths";
import { NextResponse } from "next/server";

export async function GET() {
    const apy = await getApy();
    console.log(apy);

    return NextResponse.json({
        apy
    })
}