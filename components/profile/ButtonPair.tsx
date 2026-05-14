"use client";

import { Button } from "@/components/ui/button";

interface ButtonPairProps {
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
}

export default function ButtonPair({
  onBack,
  onNext,
  backLabel = "이전",
  nextLabel = "다음",
  nextDisabled = false,
}: ButtonPairProps) {
  return (
    <div className="flex gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="flex-1 h-12 rounded-xl text-base font-medium"
      >
        {backLabel}
      </Button>
      <Button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="flex-1 h-12 rounded-xl text-base font-medium"
      >
        {nextLabel}
      </Button>
    </div>
  );
}
