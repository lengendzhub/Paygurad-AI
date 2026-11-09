import { NextResponse } from "next/server";
import { captureEscrowOrder } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const { orderID } = await req.json();
    const captureData = await captureEscrowOrder(orderID);
    return NextResponse.json(captureData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

