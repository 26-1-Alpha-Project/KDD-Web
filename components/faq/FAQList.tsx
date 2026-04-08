import { FAQItem } from "@/components/faq/FAQItem";
import type { FAQItem as FAQItemType } from "@/types/api/faq";

interface FAQListProps {
  faqs: FAQItemType[];
  openFaqId: string | null;
  onToggleFaq: (faqId: string) => void;
  feedbacks: Record<string, "up" | "down" | null>;
  onFeedback: (faqId: string, type: "up" | "down") => void;
}

export function FAQList({
  faqs,
  openFaqId,
  onToggleFaq,
  feedbacks,
  onFeedback,
}: FAQListProps) {
  if (faqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">검색 결과가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-background">
      {faqs.map((faq) => (
        <FAQItem
          key={faq.faqId}
          faq={faq}
          isOpen={openFaqId === faq.faqId}
          onToggle={() => onToggleFaq(faq.faqId)}
          feedback={feedbacks[faq.faqId] ?? null}
          onFeedback={onFeedback}
        />
      ))}
    </div>
  );
}
