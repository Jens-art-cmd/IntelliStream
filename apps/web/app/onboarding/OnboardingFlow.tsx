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
}

export default function OnboardingFlow({ industries, initialSelected = [] }: Props) {
  return (
    <IndustrySelector
      industries={industries}
      initialSelected={initialSelected}
      redirectTo="/dashboard/feed"
      saveLabel="Dashboard öffnen →"
    />
  );
}
