import { NextResponse } from "next/server";
import { createEscrowOrder } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const { amount, title } = await req.json();
    const order = await createEscrowOrder(amount, title);
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

