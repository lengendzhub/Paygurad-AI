import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Bounty, BountyStatus, ActivityItem, VerificationResult } from "@/types";

interface PayGuardStore {
  bounties: Bounty[];
  activity: ActivityItem[];
  hasDismissedTour: boolean;
  addBounty: (payload: {
    title: string;
    description: string;
    requirements: string[];
    amount: string;
    escrowOrderId: string;
  }) => Bounty;
  getBounty: (id: string) => Bounty | undefined;
  updateBountyStatus: (id: string, status: BountyStatus, patch?: Partial<Bounty>) => void;
  recordVerification: (
    id: string,
    audit: VerificationResult,
    payoutBatchId?: string,
    payoutStatus?: string,
    freelancerEmail?: string
  ) => void;
  dismissTour: () => void;
  clearAllData: () => void;
}

export const usePayGuardStore = create<PayGuardStore>()(
  persist(
    (set, get) => ({
      bounties: [],
      activity: [],
      hasDismissedTour: false,

      addBounty: (payload) => {
        const timestamp = new Date().toISOString();
        const count = get().bounties.length + 1;
        const newId = `BNT-${String(count).padStart(4, "0")}`;

        const newBounty: Bounty = {
          id: newId,
          title: payload.title.trim(),
          description: payload.description.trim(),
          requirements: payload.requirements.filter((r) => r.trim().length > 0),
          amount: parseFloat(payload.amount).toFixed(2),
          status: "FUNDED_IN_ESCROW",
          escrowOrderId: payload.escrowOrderId,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        const newActivity: ActivityItem = {
          id: `ACT-${Date.now()}-1`,
          type: "ESCROW_LOCKED",
          bountyId: newId,
          title: "Escrow Locked",
          description: `Locked $${newBounty.amount} USD via PayPal Orders v2`,
          timestamp,
        };

        set((state) => ({
          bounties: [newBounty, ...state.bounties],
          activity: [newActivity, ...state.activity],
        }));

        return newBounty;
      },

      getBounty: (id) => {
        return get().bounties.find((b) => b.id === id);
      },

      updateBountyStatus: (id, status, patch = {}) => {
        const timestamp = new Date().toISOString();
        set((state) => ({
          bounties: state.bounties.map((b) =>
            b.id === id ? { ...b, ...patch, status, updatedAt: timestamp } : b
          ),
        }));
      },

      recordVerification: (id, audit, payoutBatchId, payoutStatus, freelancerEmail) => {
        const timestamp = new Date().toISOString();
        const bounty = get().bounties.find((b) => b.id === id);
        if (!bounty) return;

        const nextStatus: BountyStatus = audit.approved
          ? "RELEASED_BY_AI"
          : "REJECTED_NEEDS_WORK";

        const activityItems: ActivityItem[] = [
          {
            id: `ACT-${Date.now()}-audit`,
            type: audit.approved ? "AI_AUDIT_PASSED" : "AI_AUDIT_REJECTED",
            bountyId: id,
            title: audit.approved ? "Verification Passed" : "Verification Rejected",
            description: `Gemini scored deliverable ${audit.score}/100`,
            timestamp,
          },
        ];

        if (audit.approved && payoutBatchId) {
          activityItems.push({
            id: `ACT-${Date.now()}-payout`,
            type: "PAYOUT_DISBURSED",
            bountyId: id,
            title: "Payout Disbursed",
            description: `Transferred $${bounty.amount} to ${freelancerEmail || "freelancer"} via PayPal Payouts v1`,
            timestamp,
          });
        }

        set((state) => ({
          bounties: state.bounties.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: nextStatus,
                  audit,
                  payoutBatchId: payoutBatchId || b.payoutBatchId,
                  payoutStatus: payoutStatus || b.payoutStatus,
                  freelancerEmail: freelancerEmail || b.freelancerEmail,
                  updatedAt: timestamp,
                }
              : b
          ),
          activity: [...activityItems, ...state.activity],
        }));
      },

      dismissTour: () => set({ hasDismissedTour: true }),

      clearAllData: () =>
        set({
          bounties: [],
          activity: [],
          hasDismissedTour: false,
        }),
    }),
    {
      name: "payguard_store_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

