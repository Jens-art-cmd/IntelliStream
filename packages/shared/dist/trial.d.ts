export type PlanStatus = 'trialing' | 'active' | 'free';
export interface TrialInfo {
    status: PlanStatus;
    daysLeft: number | null;
    trialEndsAt: Date | null;
    isFullAccess: boolean;
}
export declare function getTrialInfo(user: {
    plan: string;
    trial_ends_at?: string | null;
}): TrialInfo;
