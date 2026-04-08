"use client";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FAQCandidate } from "@/types/api/admin";

interface FAQCandidateTableProps {
  candidates: FAQCandidate[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const STATUS_LABEL: Record<NonNullable<FAQCandidate["status"]>, string> = {
  pending: "대기",
  approved: "승인",
  rejected: "반려",
  registered: "등록됨",
};

const STATUS_CLASS: Record<NonNullable<FAQCandidate["status"]>, string> = {
  pending: "bg-muted text-muted-foreground border-border",
  approved: "bg-primary/10 text-primary border-primary/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  registered: "bg-green-50 text-green-700 border-green-200",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function FAQCandidateTable({
  candidates,
  onApprove,
  onReject,
}: FAQCandidateTableProps) {
  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>질문</TableHead>
              <TableHead className="w-24">출처</TableHead>
              <TableHead className="w-20">상태</TableHead>
              <TableHead className="w-28">생성일</TableHead>
              <TableHead className="w-28 text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  FAQ 후보가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              candidates.map((candidate) => (
                <TableRow key={candidate.candidateId}>
                  <TableCell className="max-w-90 truncate">
                    {candidate.question}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {candidate.source}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                        STATUS_CLASS[candidate.status ?? "pending"]
                      )}
                    >
                      {STATUS_LABEL[candidate.status ?? "pending"]}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(candidate.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {candidate.status === "pending" && (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onApprove(candidate.candidateId)}
                          className="rounded px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => onReject(candidate.candidateId)}
                          className="rounded px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                        >
                          반려
                        </button>
                      </div>
                    )}
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
