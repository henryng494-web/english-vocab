"use client";

import { FreeTierGate } from "@/components/paywall/FreeTierGate";
import { ReviewScreen } from "@/components/review/ReviewScreen";

export default function LearnPage() {
  return (
    <FreeTierGate action="review">
      <ReviewScreen />
    </FreeTierGate>
  );
}
