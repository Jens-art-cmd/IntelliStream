export type PlanStatus = 'trialing' | 'active' | 'free';

export interface TrialInfo {
  status: PlanStatus;
  daysLeft: number | null;   // only set during trialing
  trialEndsAt: Date | null;
  isFullAccess: boolean;     // true for trialing + active paid plans
}

export function getTrialInfo(user: {
  plan: string;
  trial_ends_at?: string | null;
}): TrialInfo {
  // Paid plan → always full access
  if (['pro', 'starter', 'enterprise'].includes(user.plan)) {
    return { status: 'active', daysLeft: null, trialEndsAt: null, isFullAccess: true };
  }
  // Check active trial
  if (user.trial_ends_at) {
    const endsAt  = new Date(user.trial_ends_at);
    const daysLeft = Math.ceil((endsAt.getTime() - Date.now()) / 86_400_000);
    if (daysLeft > 0) {
      return { status: 'trialing', daysLeft, trialEndsAt: endsAt, isFullAccess: true };
    }
  }
  // Trial expired or no trial → free
  return { status: 'free', daysLeft: null, trialEndsAt: null, isFullAccess: false };
}
