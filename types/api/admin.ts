export interface AdminDocument {
  id: number;
  title: string;
  size?: string;
  categoryId: number;
  categoryName: string;
  status: "uploaded" | "processing" | "completed" | "failed" | "reprocessing";
  source: "SW" | "KMU";
  createdAt: string;
}

export interface AdminStatistics {
  users: {
    totalUsers: number;
    byUserType: { type: string; count: number }[];
    byDepartment: { department: string; count: number }[];
    byGrade: { grade: string; count: number }[];
  };
  overview: {
    totalQuestions: number;
    totalDocuments: number;
    totalSessions: number;
    totalUsers: number;
  };
  categories: {
    category: string;
    questionCount: number;
    percentage: number;
  }[];
}

export interface FAQCandidate {
  candidateId: string;
  question: string;
  draftAnswer?: string;
  frequency: number;
  topic: string;
  createdAt: string;
  /** 프론트 전용 — API 응답에 없음, 승인/반려 상태를 로컬에서 관리 */
  status?: "pending" | "approved" | "rejected" | "registered";
  /** 프론트 전용 — API 응답에 없음 */
  source?: string;
}
