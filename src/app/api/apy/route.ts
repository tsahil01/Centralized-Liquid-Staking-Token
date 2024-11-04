import { getApy } from "@/lib/maths";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const amount = searchParams.get('amount');

    console.log("Amount:", amount);

    const apy = await getApy(Number(amount));
    console.log(apy);

    return NextResponse.json({ apy });
}
