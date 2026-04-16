"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      router.replace("/login");
      return;
    }

    // 팝업으로 열린 경우: postMessage로 code를 부모 창에 전달하고 팝업 닫기
    if (window.opener) {
      window.opener.postMessage(
        { type: "GOOGLE_OAUTH_CODE", code },
        window.location.origin
      );
      window.close();
      return;
    }

    // 직접 접근한 경우: /login으로 리다이렉트
    router.replace("/login");
  }, [router, searchParams]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">로그인 중...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-background">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
