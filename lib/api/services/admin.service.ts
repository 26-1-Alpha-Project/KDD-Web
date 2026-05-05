import { apiClient } from '@/lib/api/client';
import { delay } from '@/lib/api/mock';
import type {
  AdminDocumentListRequest,
  AdminDocumentListPageResponse,
  AdminStatisticsResponse,
  FAQCandidateListRequest,
  FAQCandidateListResponse,
  DocumentResponse,
} from '@/types/api/admin';
import type { FAQListRequest, FAQListResponse } from '@/types/api/faq';
import { MOCK_ADMIN_DOCUMENTS, MOCK_ADMIN_STATISTICS, MOCK_FAQ_CANDIDATES } from '@/constants/mock-admin';
import { MOCK_FAQ_ITEMS } from '@/constants/mock-faq';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function getAdminDocuments(
  params?: AdminDocumentListRequest
): Promise<AdminDocumentListPageResponse> {
  if (USE_MOCK) {
    await delay(400);
    return {
      data: MOCK_ADMIN_DOCUMENTS,
      totalCount: MOCK_ADMIN_DOCUMENTS.length,
      page: params?.page ?? 0,
      pageSize: params?.pageSize ?? 20,
      totalPages: Math.ceil(MOCK_ADMIN_DOCUMENTS.length / (params?.pageSize ?? 20)),
    };
  }
  return apiClient.get<AdminDocumentListPageResponse>('/admin/documents', {
    params: {
      page: params?.page,
      size: params?.pageSize,
    },
  });
}

export async function deleteDocument(fileId: number): Promise<void> {
  if (USE_MOCK) {
    await delay(300);
    return;
  }
  await apiClient.delete<void>(`/admin/documents/${fileId}`);
}

export async function reprocessDocument(fileId: number): Promise<void> {
  if (USE_MOCK) {
    await delay(300);
    return;
  }
  await apiClient.post<void>(`/admin/documents/${fileId}/reprocess`);
}

export async function uploadDocument(data: FormData): Promise<DocumentResponse> {
  if (USE_MOCK) {
    await delay(800);
    return {
      id: Date.now(),
      title: (data.get('title') as string | null) ?? '업로드된 문서',
      categoryId: Number(data.get('categoryId')) || 1,
      categoryName: '기타',
      status: 'uploaded',
      source: 'SW',
      originalFilename: 'document.pdf',
      fileSize: 0,
      createdAt: new Date().toISOString(),
    };
  }
  return apiClient.postFormData<DocumentResponse>('/admin/documents', data);
}

export async function updateDocumentCategory(
  fileId: number,
  categoryId: number
): Promise<DocumentResponse> {
  if (USE_MOCK) {
    await delay(300);
    return {
      id: fileId,
      title: '문서',
      categoryId,
      categoryName: '기타',
      status: 'completed',
      source: 'SW',
      originalFilename: 'document.pdf',
      fileSize: 0,
      createdAt: new Date().toISOString(),
    };
  }
  return apiClient.patch<DocumentResponse>(`/admin/documents/${fileId}/category`, { categoryId });
}

// ── 백엔드 미구현 엔드포인트 (항상 mock 반환) ─────────────────────
// 아래 함수들은 백엔드(/admin/statistics, /admin/faqs/*)에 컨트롤러가 없어
// USE_MOCK 값과 무관하게 mock 데이터를 반환한다.
// 백엔드 구현 후 USE_MOCK 분기를 복원하고 apiClient 호출을 활성화한다.

export async function getStatistics(): Promise<AdminStatisticsResponse> {
  await delay(400);
  return MOCK_ADMIN_STATISTICS;
}

export async function getFAQCandidates(
  params?: FAQCandidateListRequest
): Promise<FAQCandidateListResponse> {
  await delay(400);
  return {
    data: MOCK_FAQ_CANDIDATES,
    totalCount: MOCK_FAQ_CANDIDATES.length,
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    totalPages: Math.ceil(MOCK_FAQ_CANDIDATES.length / (params?.pageSize ?? 10)),
  };
}

export async function approveCandidate(_candidateId: string): Promise<void> {
  await delay(300);
}

export async function rejectCandidate(_candidateId: string): Promise<void> {
  await delay(300);
}

export async function getAdminFAQList(params?: FAQListRequest): Promise<FAQListResponse> {
  await delay(400);
  return {
    data: MOCK_FAQ_ITEMS,
    totalCount: MOCK_FAQ_ITEMS.length,
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    totalPages: Math.ceil(MOCK_FAQ_ITEMS.length / (params?.pageSize ?? 10)),
  };
}

export async function deleteAdminFAQ(_faqId: string): Promise<void> {
  await delay(300);
}
