import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FAQSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function FAQSearch({ value, onChange }: FAQSearchProps) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="질문 검색..."
        className="pl-9"
      />
    </div>
  );
}
