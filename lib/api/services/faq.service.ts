import { delay } from '@/lib/api/mock';
import type {
  FAQListRequest,
  FAQListResponse,
  FAQDetailResponse,
  FAQTopicsResponse,
  FAQVoteRequest,
} from '@/types/api/faq';
import { MOCK_FAQ_ITEMS, MOCK_FAQ_TOPICS } from '@/constants/mock-faq';

// ── 백엔드 미구현 (FAQ 컨트롤러 없음) ─────────────────────────────
// /faqs/* 엔드포인트는 백엔드에 구현되어 있지 않으므로 USE_MOCK 값과 무관하게
// 항상 mock 데이터를 반환한다. 백엔드 구현 후 USE_MOCK 분기를 복원한다.

export async function getFAQList(params?: FAQListRequest): Promise<FAQListResponse> {
  await delay(300);
  let items = [...MOCK_FAQ_ITEMS];
  if (params?.topic && params.topic !== 'all') {
    items = items.filter((f) => f.topic === params.topic);
  }
  if (params?.sort === 'popular') {
    items = [...items].sort((a, b) => b.helpful - a.helpful);
  } else {
    // newest (기본)
    items = [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return {
    data: items,
    totalCount: items.length,
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    totalPages: Math.ceil(items.length / (params?.pageSize ?? 10)),
  };
}

export async function getFAQDetail(faqId: number): Promise<FAQDetailResponse> {
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

export async function getTopics(): Promise<FAQTopicsResponse> {
  await delay(200);
  return { topics: MOCK_FAQ_TOPICS };
}

export async function voteFAQ(_faqId: string, _data: FAQVoteRequest): Promise<void> {
  await delay(200);
}
