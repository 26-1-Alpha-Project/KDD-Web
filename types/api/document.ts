// ─── 기존 프론트엔드 타입 (하위 호환) ───

export interface Document {
  documentId: string;
  title: string;
  category: string;
  categoryPath?: string;
  department?: string;
  updatedAt: string;
  fileSize?: string;
  viewCount?: number;
  excerpt?: string;
  refCount?: number;
}

export interface DocumentDetail extends Document {
  content?: string;
  fileUrl?: string;
  pages?: number;
}

export interface CategoryNode {
  categoryId: string;
  name: string;
  documentCount?: number;
  children?: CategoryNode[];
}

export interface PopularDocument {
  documentId: string;
  title: string;
  category: string;
  viewCount?: number;
  referenceCount?: number;
  popularityScore?: number;
  updatedAt: string;
}

// ─── 백엔드 DTO 대응 타입 ───

/** 백엔드 DocumentListResponse 대응 (관리자용) */
export interface AdminDocumentListResponse {
  id: number;
  title: string;
  categoryId: number;
  categoryName: string;
  status: "uploaded" | "processing" | "completed" | "failed" | "reprocessing";
  source: string;
  createdAt: string;
}

/** 백엔드 DocumentDetailResponse 대응 */
export interface DocumentDetailResponse {
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

/** 백엔드 DocumentStatusResponse 대응 */
export interface DocumentStatusResponse {
  documentId: number;
  status: "uploaded" | "processing" | "completed" | "failed" | "reprocessing";
  createdAt: string;
}

/** 백엔드 DocumentReprocessResponse 대응 */
export interface DocumentReprocessResponse {
  documentId: number;
  status: string;
}

/** 백엔드 DocumentByCategoryResponse 대응 */
export interface DocumentByCategoryResponse {
  documentId: number;
  title: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

/** 백엔드 CategoryTreeResponse 대응 (재귀 트리 구조) */
export interface CategoryTreeResponse {
  categoryId: number;
  name: string;
  children: CategoryTreeResponse[];
}

/** 백엔드 DocumentUploadRequest 대응 */
export interface DocumentUploadRequest {
  title?: string;
  categoryId: number;
  source: string;
}

/** 백엔드 DocumentCategoryUpdateRequest 대응 */
export interface DocumentCategoryUpdateRequest {
  categoryId: number;
}
