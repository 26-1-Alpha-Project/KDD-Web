"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

// NOTE: Figma asset URLs expire in 7 days — replace with local assets before production
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
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-between w-100 h-161.5 py-8">
        {/* Top spacer */}
        <div className="h-4 w-full shrink-0" />

        {/* Slide content */}
        <div className="flex flex-1 items-center justify-center w-full">
          <div className="flex flex-col items-center gap-8">
            <div className="relative w-56 h-56 shrink-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-2xl font-bold text-[#0a0a0a] text-center leading-8">
              {slide.title}
            </p>
            <p className="text-base text-[#4a5565] text-center leading-6 max-w-[172px]">
              {slide.description}
            </p>
          </div>
        </div>

        {/* Bottom: dots + button + caption */}
        <div className="flex flex-col gap-6 w-full shrink-0">
          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`슬라이드 ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-[#004f9f]" : "w-2 bg-[#e5e7eb]"
                }`}
              />
            ))}
          </div>

          {/* Google login button + caption */}
          <div className="flex flex-col gap-3 w-full">
            <button className="flex items-center justify-center gap-3 w-full h-12 bg-white border border-black/15 rounded-2xl shadow-sm text-[#0a0a0a] text-[15px] font-medium cursor-pointer hover:bg-gray-50 transition-colors">
              <FcGoogle size={20} />
              Google로 계속하기
            </button>
            <p className="text-xs text-[#9ca3af] text-center">
              국민대학교 계정(@kookmin.ac.kr)으로 로그인하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
