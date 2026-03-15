import Link from "next/link";

import { Button } from "@/components/ui";

// 랜딩 / 온보딩 페이지
// 유저플로우: START → (기존 이용자 여부) → 로그인 / 회원가입
// 신규 유저: 서비스 소개(온보딩) → 회원가입 → 프로필 설정 → /chat
// 기존 유저: 로그인 → /chat
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <h1 className="typo-heading-2 text-text-primary">
          소융대 AI RAG 에이전트
        </h1>
        <p className="typo-paragraph text-text-secondary">
          디자인 가이드 반영 상태를 확인하려면 아래 페이지로 이동하세요.
        </p>
        <div className="max-w-xs">
          <Link href="/design-guide">
            <Button size="md" variant="primary">
              디자인 가이드 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
