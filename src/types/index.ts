export type BountyStatus =
  | "FUNDED_IN_ESCROW"
  | "SUBMITTED"
  | "VERIFYING"
  | "RELEASED_BY_AI"
  | "REJECTED_NEEDS_WORK";

export interface CriterionResult {
  criterion: string;
  passed: boolean;
  reason: string;
}

export interface VerificationResult {
  approved: boolean;
  score: number;
  summary: string;
  criteriaChecklist: CriterionResult[];
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  amount: string;
  status: BountyStatus;
  escrowOrderId: string;
  freelancerEmail?: string;
  submissionText?: string;
  createdAt: string;
  updatedAt: string;
  payoutBatchId?: string;
  payoutStatus?: string;
  audit?: VerificationResult;
}

export interface ActivityItem {
  id: string;
  type:
    | "BOUNTY_CREATED"
    | "ESCROW_LOCKED"
    | "WORK_SUBMITTED"
    | "AI_AUDIT_PASSED"
    | "AI_AUDIT_REJECTED"
    | "PAYOUT_DISBURSED";
  bountyId: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface PayoutReceipt {
  payoutBatchId: string;
  batchStatus: string;
  amount: string;
  receiver: string;
  timestamp: string;
}

