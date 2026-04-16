/** 백엔드 PageResponse<T>와 1:1 대응 */
export interface PageResponse<T> {
  data: T[];
  totalCount: number;
  page: number; // 0-based (백엔드 기준)
  pageSize: number;
  totalPages: number;
}

/** 기존 PaginatedResponse 별칭 (하위 호환) */
export type PaginatedResponse<T> = PageResponse<T>;

/** 백엔드 ErrorResponse와 1:1 대응 */
export interface ErrorResponse {
  error: string; // 에러 코드 (예: "SESSION_NOT_FOUND")
  message: string; // 사용자 표시용 메시지
}

/** 백엔드 MessageResponse와 1:1 대응 */
export interface MessageResponse {
  message: string;
}
