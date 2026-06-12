"use client";

import IndustrySelector from "@/components/dashboard/IndustrySelector";

interface Industry {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

interface Props {
  industries: Industry[];
  initialSelected?: number[];
  maxIndustries?: number;
  isFullAccess?: boolean;
}

export default function OnboardingFlow({ industries, initialSelected = [], maxIndustries = 15, isFullAccess = true }: Props) {
  return (
    <IndustrySelector
      industries={industries}
      initialSelected={initialSelected}
      redirectTo="/dashboard/feed"
      saveLabel="Dashboard öffnen →"
      maxIndustries={maxIndustries}
      isFullAccess={isFullAccess}
    />
  );
}
