export interface AdminDocument {
  id: number;
  title: string;
  categoryId: number;
  categoryName: string;
  status: "uploaded" | "processing" | "completed" | "failed" | "reprocessing";
  source: "SW" | "KMU";
  createdAt: string;
}

export interface AdminStatistics {
  users: {
    totalUsers: number;
    byUserType: { student: number; staff: number };
    byDepartment: Record<string, number>;
    byGrade: Record<string, number>;
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

/** 관리자 문서 목록 요청 파라미터 */
export interface AdminDocumentListRequest {
  page?: number;
  pageSize?: number;
}

/** 관리자 문서 목록 응답 */
export interface AdminDocumentListPageResponse {
  data: AdminDocument[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 관리자 통계 응답 */
export type AdminStatisticsResponse = AdminStatistics;

/** FAQ 후보 목록 요청 파라미터 */
export interface FAQCandidateListRequest {
  page?: number;
  pageSize?: number;
}

/** FAQ 후보 목록 응답 */
export interface FAQCandidateListResponse {
  data: FAQCandidate[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 문서 응답 (업로드 후 반환) */
export interface DocumentResponse {
  id: number;
  title: string;
  categoryId: number;
  categoryName: string;
  status: string;
  source: string;
  originalFilename: string;
  fileSize: number;
  createdAt: string;
}
