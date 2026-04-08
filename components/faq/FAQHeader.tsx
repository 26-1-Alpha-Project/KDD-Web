import { HelpCircle, Clock, RefreshCw } from "lucide-react";

interface FAQHeaderProps {
  totalCount: number;
  newCount: number;
}

export function FAQHeader({ totalCount, newCount }: FAQHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="size-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">자주 묻는 질문</h1>
        {newCount > 0 && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
            +{newCount} NEW
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span>총 {totalCount}개 질문</span>
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" />
          마지막 업데이트: 1시간 전
        </span>
        <span className="flex items-center gap-1">
          <RefreshCw className="size-3.5" />
          다음 AI 업데이트: 2시간 59분 후
        </span>
      </div>
    </div>
  );
}
