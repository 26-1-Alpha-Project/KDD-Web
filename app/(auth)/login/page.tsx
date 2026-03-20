"use client";

import { useState, useEffect } from "react";

// NOTE: Figma asset URLs expire in 7 days — replace with local assets before production
const GOOGLE_ICON =
  "https://www.figma.com/api/mcp/asset/9e1de1c6-6fa0-4429-b13f-2bb030d02a33";

const slides = [
  {
    image:
      "https://www.figma.com/api/mcp/asset/90651a75-0e03-4dac-ae9a-98d4581d552e",
    title: "대화형 질의응답",
    description: "자연어로 질문하면 AI가 즉시 답변해드립니다",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/b8fb8ec2-4b36-4990-8175-9d0114a1237b",
    title: "정확한 출처 제공",
    description: "모든 답변에 원본 규정 문서 링크를 제공합니다",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/abd1ade9-6004-4bdb-861a-e7b3af56338c",
    title: "신뢰도 표시",
    description: "답변의 신뢰도를 색상 배지로 구분해 표시합니다",
  },
];

export default function LoginPage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div>
      <h1>로그인</h1>
    </div>
  );
}
