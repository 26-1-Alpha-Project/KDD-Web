"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfileForm } from "@/hooks/useProfileForm";
import StepIndicator from "@/components/profile/StepIndicator";
import ButtonPair from "@/components/profile/ButtonPair";
import BasicInfoStep from "@/components/profile/BasicInfoStep";
import StudentInfoStep from "@/components/profile/StudentInfoStep";
import StaffInfoStep from "@/components/profile/StaffInfoStep";

const slides = [
  {
    image: "/images/onboarding-chat.png",
    title: "대화형 질의응답",
    description: "자연어로 질문하면 AI가 즉시 답변해드립니다",
  },
  {
    image: "/images/onboarding-source.png",
    title: "정확한 출처 제공",
    description: "모든 답변에 원본 규정 문서 링크를 제공합니다",
  },
  {
    image: "/images/onboarding-trust.png",
    title: "신뢰도 표시",
    description: "답변의 신뢰도를 색상 배지로 구분해 표시합니다",
  },
];

import { MOCK_GOOGLE_USER } from "@/constants/mock";

export default function LoginPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"carousel" | "profile">("carousel");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [current, setCurrent] = useState(0);

  const {
    step,
    basicInfo,
    studentInfo,
    staffInfo,
    basicErrors,
    studentErrors,
    staffErrors,
    isStep1Filled,
    isStep2Filled,
    updateBasicInfo,
    updateStudentInfo,
    updateStaffInfo,
    validateStep2,
    goNext,
    goBack,
  } = useProfileForm(MOCK_GOOGLE_USER.name, MOCK_GOOGLE_USER.email);

  useEffect(() => {
    if (phase !== "carousel") return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [phase]);

  const handleGoogleLogin = () => {
    if (isLoggingIn) return;
    // TODO: Integrate real Google OAuth
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setPhase("profile");
    }, 1000);
  };

  const handleProfileBack = () => {
    if (step === 1) {
      setPhase("carousel");
    } else {
      goBack();
    }
  };

  const handleSubmit = () => {
    if (!validateStep2()) return;
    // TODO: Submit profile data to API
    router.push("/chat");
  };

  /* ─── Carousel phase ─── */
  if (phase === "carousel") {
    const slide = slides[current];
    return (
      <div className="min-h-dvh bg-background">
        <div className="flex flex-col items-center justify-between mx-auto max-w-100 min-h-dvh px-5 py-8">
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
                  sizes="224px"
                  className="object-contain"
                />
              </div>
              <p className="text-2xl font-bold text-foreground text-center leading-8">
                {slide.title}
              </p>
              <p className="text-base text-muted-foreground text-center leading-6 max-w-64">
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
                  onClick={() => !isLoggingIn && setCurrent(i)}
                  aria-label={`슬라이드 ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-8 bg-primary" : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>

            {/* Google login button + caption */}
            <div className="flex flex-col gap-3 w-full">
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className={`w-full h-12 rounded-2xl text-[15px] font-medium ${
                  isLoggingIn ? "opacity-70" : ""
                }`}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                    로그인 중...
                  </>
                ) : (
                  <>
                    <FcGoogle className="size-5" />
                    Google로 계속하기
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                국민대학교 계정(@kookmin.ac.kr)으로 로그인하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Profile setup phase ─── */
  return (
    <div className="min-h-dvh bg-background">
      <div className="flex flex-col mx-auto max-w-100 min-h-dvh px-5 py-8">
        {/* Progress bar */}
        <StepIndicator currentStep={step} totalSteps={2} />

        {/* Scrollable form content */}
        <div className="flex-1 overflow-y-auto py-6 -mx-1 px-1">
          {step === 1 && (
            <BasicInfoStep
              data={basicInfo}
              errors={basicErrors}
              onUpdate={updateBasicInfo}
            />
          )}

          {step === 2 && basicInfo.userType === "student" && (
            <StudentInfoStep
              data={studentInfo}
              errors={studentErrors}
              onUpdate={updateStudentInfo}
            />
          )}

          {step === 2 && basicInfo.userType === "staff" && (
            <StaffInfoStep
              data={staffInfo}
              errors={staffErrors}
              onUpdate={updateStaffInfo}
            />
          )}
        </div>

        {/* Bottom buttons */}
        <div className="shrink-0 pt-4">
          {step === 1 && (
            <ButtonPair
              onBack={handleProfileBack}
              onNext={goNext}
              nextDisabled={!isStep1Filled}
            />
          )}
          {step === 2 && (
            <ButtonPair
              onBack={handleProfileBack}
              onNext={handleSubmit}
              nextLabel="시작하기"
              nextDisabled={!isStep2Filled}
            />
          )}
        </div>
      </div>
    </div>
  );
}
