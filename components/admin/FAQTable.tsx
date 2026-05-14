"use client";

import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_FAQ_TOPICS } from "@/constants/mock-faq";
import type { FAQItem } from "@/types/api/faq";

function getTopicLabel(topic: string): string {
  return MOCK_FAQ_TOPICS.find((t) => t.topic === topic)?.label ?? topic;
}

interface FAQTableProps {
  faqs: FAQItem[];
  onDelete: (id: string) => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function FAQTable({ faqs, onDelete }: FAQTableProps) {
  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">토픽</TableHead>
              <TableHead>질문</TableHead>
              <TableHead className="w-28">등록일</TableHead>
              <TableHead className="w-16 text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  등록된 FAQ가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.faqId}>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      {getTopicLabel(faq.topic)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[400px] truncate">
                    {faq.question}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(faq.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => onDelete(faq.faqId)}
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      title="삭제"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
