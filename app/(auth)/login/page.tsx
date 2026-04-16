"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { useProfileForm } from "@/hooks/useProfileForm";
import StepIndicator from "@/components/profile/StepIndicator";
import ButtonPair from "@/components/profile/ButtonPair";
import BasicInfoStep from "@/components/profile/BasicInfoStep";
import StudentInfoStep from "@/components/profile/StudentInfoStep";
import StaffInfoStep from "@/components/profile/StaffInfoStep";
import { authManager } from "@/lib/api/auth";
import { googleLogin } from "@/lib/api/services/auth.service";
import { getMyInfo, createProfile } from "@/lib/api/services/user.service";
import { ApiError, ERROR_MESSAGES } from "@/lib/api/errors";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const GOOGLE_REDIRECT_URI =
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ??
  "http://localhost:3000/auth/callback";

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7일

function setAuthCookies(role: string | null, profileCompleted: boolean): void {
  const roleValue = role ?? "";
  document.cookie = `user_role=${roleValue}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; samesite=strict`;
  document.cookie = `profile_completed=${profileCompleted}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; samesite=strict`;
}

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

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");

  const [phase, setPhase] = useState<"carousel" | "profile">(
    stepParam === "profile" ? "profile" : "carousel"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
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
  } = useProfileForm();

  useEffect(() => {
    if (phase !== "carousel") return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [phase]);

  // 팝업에서 postMessage로 전달되는 OAuth code 수신
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "GOOGLE_OAUTH_CODE") return;

      const code = event.data.code as string;
      if (!code) return;

      try {
        setLoginError(null);
        const response = await googleLogin(code);
        authManager.setToken(response.accessToken);
        const me = await getMyInfo();
        setAuthCookies(me.role, me.profileCompleted);

        if (!response.isProfileCompleted) {
          setPhase("profile");
        } else {
          router.replace("/chat");
        }
      } catch (error) {
        if (error instanceof ApiError) {
          setLoginError(
            ERROR_MESSAGES[error.code] ?? error.message
          );
        } else {
          setLoginError("로그인 중 오류가 발생했습니다.");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      // mock 모드: 직접 프로필 단계로 이동
      setPhase("profile");
      return;
    }

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "email profile",
    });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    const popup = window.open(authUrl, "_blank", "popup,width=500,height=600");

    if (!popup) {
      // 팝업 차단된 경우: 전체 페이지 리다이렉트로 fallback
      window.location.href = authUrl;
    }
  };

  const handleProfileBack = () => {
    if (step === 1) {
      setPhase("carousel");
    } else {
      goBack();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setIsSubmitting(true);
    setLoginError(null);
    try {
      const profileData = buildProfileData();
      await createProfile(profileData);
      setAuthCookies(null, true);
      router.push("/chat");
    } catch (error) {
      if (error instanceof ApiError) {
        setLoginError(ERROR_MESSAGES[error.code] ?? error.message);
      } else {
        setLoginError("프로필 저장 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildProfileData = () => {
    const base = {
      name: basicInfo.name,
      userType: basicInfo.userType,
    };

    if (basicInfo.userType === "student") {
      return {
        ...base,
        studentId: basicInfo.studentId,
        department: studentInfo.department,
        grade: studentInfo.grade ? Number(studentInfo.grade) : undefined,
        admissionYear: studentInfo.admissionYear
          ? Number(studentInfo.admissionYear)
          : undefined,
        academicStatus:
          studentInfo.leaveOfAbsence === "yes" ? "on_leave" : "enrolled",
        additionalInfo: studentInfo.additionalInfo || undefined,
      };
    }

    return {
      ...base,
      staffDepartment: staffInfo.staffDepartment,
      jobDescription: staffInfo.jobDescription || undefined,
    };
  };

  /* ─── Carousel phase ─── */
  if (phase === "carousel") {
    return (
      <div className="min-h-dvh bg-background">
        <div className="flex flex-col items-center justify-between mx-auto max-w-100 min-h-dvh px-5 py-8">
          {/* Top spacer */}
          <div className="h-4 w-full shrink-0" />

          {/* Slide content */}
          <div className="flex flex-1 items-center justify-center w-full">
            <div className="flex flex-col items-center gap-8">
              {/* 모든 이미지를 한 번에 렌더링 — CSS로 현재 슬라이드만 표시 */}
              <div className="relative w-56 h-56 shrink-0">
                {slides.map((slide, i) => (
                  <Image
                    key={slide.image}
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="224px"
                    priority={i === 0}
                    className={`object-contain transition-opacity duration-500 ${
                      i === current ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
              <p className="text-2xl font-bold text-foreground text-center leading-8">
                {slides[current].title}
              </p>
              <p className="text-base text-muted-foreground text-center leading-6 max-w-64">
                {slides[current].description}
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
                className="w-full h-12 rounded-2xl text-[15px] font-medium"
              >
                <FcGoogle className="size-5" />
                Google로 계속하기
              </Button>
              {loginError && (
                <p className="text-xs text-destructive text-center">
                  {loginError}
                </p>
              )}
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

        {/* Error message */}
        {loginError && (
          <p className="text-xs text-destructive text-center shrink-0">
            {loginError}
          </p>
        )}

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
              nextLabel={isSubmitting ? "저장 중..." : "시작하기"}
              nextDisabled={!isStep2Filled || isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-background" />
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
