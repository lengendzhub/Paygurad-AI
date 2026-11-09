import { NextResponse } from "next/server";
import { getServerBounties, getServerBounty, saveServerBounty } from "@/lib/serverStore";
import { Bounty } from "@/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const bounty = getServerBounty(id);
    if (!bounty) {
      return NextResponse.json({ error: `Bounty ${id} not found` }, { status: 404 });
    }
    return NextResponse.json({ bounty });
  }

  return NextResponse.json({ bounties: getServerBounties() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, requirements, amount, escrowOrderId, id } = body;

    if (!title || !amount || !escrowOrderId) {
      return NextResponse.json(
        { error: "Missing required fields: title, amount, and escrowOrderId are required" },
        { status: 400 }
      );
    }

    const currentCount = getServerBounties().length;
    const bountyId = id || `BNT-${101 + currentCount}`;

    const newBounty: Bounty = {
      id: bountyId,
      title: String(title).trim(),
      description: String(description || "").trim(),
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      amount: String(amount).trim(),
      status: "FUNDED_IN_ESCROW",
      escrowOrderId: String(escrowOrderId).trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = saveServerBounty(newBounty);
    return NextResponse.json({ bounty: saved, ok: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create bounty" }, { status: 500 });
  }
}

