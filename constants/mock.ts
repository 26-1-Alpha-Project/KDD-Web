// TODO: 실제 API 연동 시 제거

export const MOCK_GOOGLE_USER = {
  name: "홍길동",
  email: "honggildong@kookmin.ac.kr",
} as const;

export const MOCK_SUGGESTIONS = [
  "이번 학기 휴학 신청 언제까지야?",
  "수강신청 방법 알려줘",
  "장학금 종류 알려줘",
  "졸업 요건 알려줘",
] as const;

export const MOCK_CHAT_HISTORY = [
  { id: "1", title: "새 대화" },
  { id: "2", title: "1학기 휴학 신청 기간" },
  { id: "3", title: "수강신청 일정 문의" },
  { id: "4", title: "성적 이의신청 기간 문의" },
  { id: "5", title: "장학금 종류 알려줘" },
  { id: "6", title: "타 대학 학점 인정 문의" },
  { id: "7", title: "복수전공 신청 조건" },
  { id: "8", title: "조기졸업 가능 여부" },
] as const;
