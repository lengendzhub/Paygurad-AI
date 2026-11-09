import { NextResponse } from "next/server";
import { captureEscrowOrder } from "@/lib/paypal";
import { saveServerBounty, getServerBounties } from "@/lib/serverStore";
import { Bounty } from "@/types";

export async function POST(req: Request) {
  try {
    const { orderID, title, description, requirements, amount, bountyId } = await req.json();

    if (!orderID) {
      return NextResponse.json({ error: "Missing required orderID" }, { status: 400 });
    }

    const captureData = await captureEscrowOrder(orderID);

    // Verify PayPal order status is actually COMPLETED
    if (!captureData || captureData.status !== "COMPLETED") {
      return NextResponse.json(
        {
          error: `PayPal escrow capture rejected: order status is ${captureData?.status || "UNKNOWN"} instead of COMPLETED`,
          captureData,
        },
        { status: 400 }
      );
    }

    // If bounty details are provided, persist the verified bounty in the server store
    let serverBounty: Bounty | undefined;
    if (title && amount) {
      const currentCount = getServerBounties().length;
      const assignedId = bountyId || `BNT-${101 + currentCount}`;

      serverBounty = saveServerBounty({
        id: assignedId,
        title: String(title).trim(),
        description: String(description || "").trim(),
        requirements: Array.isArray(requirements) ? requirements : [requirements],
        amount: String(amount).trim(),
        status: "FUNDED_IN_ESCROW",
        escrowOrderId: captureData.id || orderID,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      ok: true,
      captureData,
      bounty: serverBounty,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to capture escrow order" }, { status: 500 });
  }
}
