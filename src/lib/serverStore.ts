import { Bounty, BountyStatus, ActivityItem } from "@/types";

export const INITIAL_SERVER_BOUNTIES: Bounty[] = [
  {
    id: "BNT-101",
    title: "Write a Python Luhn Credit Card Validator Function",
    description:
      "Implement a robust credit card validator adhering to the Luhn checksum algorithm without external dependencies.",
    requirements: [
      "1. Define a Python function named validate_card(number_str).",
      "2. Implement the Luhn checksum algorithm without external libraries.",
      "3. Include at least 2 assert test cases demonstrating valid and invalid numbers.",
    ],
    amount: "25.00",
    status: "FUNDED_IN_ESCROW",
    escrowOrderId: "PAYPAL_SANDBOX_ESCROW_89231",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "BNT-102",
    title: "Draft a SaaS Refund Policy Summary (Under 80 Words)",
    description:
      "Draft a concise customer-facing refund summary stating a 14-day window and PayPal settlement rails.",
    requirements: [
      "1. Must state a 14-day full refund window.",
      "2. Must mention that payments are processed via PayPal.",
      "3. Total word count must be strictly under 80 words.",
    ],
    amount: "15.00",
    status: "FUNDED_IN_ESCROW",
    escrowOrderId: "PAYPAL_SANDBOX_ESCROW_77412",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

export const INITIAL_SERVER_ACTIVITY: ActivityItem[] = [
  {
    id: "ACT-INIT-1",
    type: "ESCROW_LOCKED",
    bountyId: "BNT-101",
    title: "Escrow Locked",
    description: "Locked $25.00 USD via PayPal Orders v2",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "ACT-INIT-2",
    type: "ESCROW_LOCKED",
    bountyId: "BNT-102",
    title: "Escrow Locked",
    description: "Locked $15.00 USD via PayPal Orders v2",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

interface ServerState {
  bounties: Bounty[];
  activity: ActivityItem[];
}

declare global {
  // eslint-disable-next-line no-var
  var __payguardServerStore: ServerState | undefined;
}

if (!globalThis.__payguardServerStore) {
  globalThis.__payguardServerStore = {
    bounties: [...INITIAL_SERVER_BOUNTIES],
    activity: [...INITIAL_SERVER_ACTIVITY],
  };
}

const store = globalThis.__payguardServerStore;

export function getServerBounties(): Bounty[] {
  return store.bounties;
}

export function getServerBounty(id: string): Bounty | undefined {
  return store.bounties.find((b) => b.id.toLowerCase() === id.toLowerCase());
}

export function saveServerBounty(bounty: Bounty): Bounty {
  const index = store.bounties.findIndex((b) => b.id.toLowerCase() === bounty.id.toLowerCase());
  if (index >= 0) {
    store.bounties[index] = {
      ...store.bounties[index],
      ...bounty,
      updatedAt: new Date().toISOString(),
    };
    return store.bounties[index];
  } else {
    store.bounties.unshift(bounty);
    store.activity.unshift({
      id: `ACT-${Date.now()}`,
      type: "ESCROW_LOCKED",
      bountyId: bounty.id,
      title: "Escrow Locked",
      description: `Locked $${bounty.amount} USD via PayPal Orders v2`,
      timestamp: new Date().toISOString(),
    });
    return bounty;
  }
}

export function updateServerBountyStatus(
  id: string,
  status: BountyStatus,
  patch: Partial<Bounty> = {}
): Bounty | undefined {
  const bounty = getServerBounty(id);
  if (!bounty) return undefined;

  Object.assign(bounty, patch, {
    status,
    updatedAt: new Date().toISOString(),
  });

  return bounty;
}

export function isBountyAlreadyPaid(id: string): boolean {
  const bounty = getServerBounty(id);
  return bounty?.status === "RELEASED_BY_AI";
}

