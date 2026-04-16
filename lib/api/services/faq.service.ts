import { apiClient } from '@/lib/api/client';
import { delay } from '@/lib/api/mock';
import type {
  FAQListRequest,
  FAQListResponse,
  FAQDetailResponse,
  FAQTopicsResponse,
  FAQVoteRequest,
} from '@/types/api/faq';
import { MOCK_FAQ_ITEMS, MOCK_FAQ_TOPICS } from '@/constants/mock-faq';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function getFAQList(params?: FAQListRequest): Promise<FAQListResponse> {
  if (USE_MOCK) {
    await delay(300);
    return {
      data: MOCK_FAQ_ITEMS,
      totalCount: MOCK_FAQ_ITEMS.length,
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
      totalPages: Math.ceil(MOCK_FAQ_ITEMS.length / (params?.pageSize ?? 10)),
    };
  }
  return apiClient.get<FAQListResponse>('/faqs', {
    params: {
      topic: params?.topic,
      page: params?.page,
      pageSize: params?.pageSize,
    },
  });
}

export async function getFAQDetail(faqId: number): Promise<FAQDetailResponse> {
  if (USE_MOCK) {
    await delay(200);
    const found = MOCK_FAQ_ITEMS.find((f) => f.faqId === String(faqId));
    if (found) {
      return {
        faqId: found.faqId,
        question: found.question,
        answer: found.answer,
        topic: found.topic,
        createdAt: found.createdAt,
      };
    }
    return {
      faqId: String(faqId),
      question: '질문을 찾을 수 없습니다',
      answer: '',
      topic: 'etc',
      createdAt: new Date().toISOString(),
    };
  }
  return apiClient.get<FAQDetailResponse>(`/faqs/${faqId}`);
}

export async function getTopics(): Promise<FAQTopicsResponse> {
  if (USE_MOCK) {
    await delay(200);
    return { topics: MOCK_FAQ_TOPICS };
  }
  return apiClient.get<FAQTopicsResponse>('/faqs/topics');
}

export async function voteFAQ(faqId: string, data: FAQVoteRequest): Promise<void> {
  if (USE_MOCK) {
    await delay(200);
    return;
  }
  await apiClient.post<void>(`/faqs/${faqId}/vote`, data);
}
