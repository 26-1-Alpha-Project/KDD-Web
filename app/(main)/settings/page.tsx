"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { updateMyInfo } from "@/lib/api/services/user.service";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { user, refreshUser, isLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    setSavedMessage(null);
    try {
      await updateMyInfo({ name: name.trim() || undefined });
      await refreshUser();
      setSavedMessage("저장되었습니다.");
    } catch {
      setSavedMessage("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center border-b border-border bg-background px-4">
        <h1 className="text-[18px] font-semibold text-foreground">설정</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
          {/* 내 정보 섹션 */}
          <section className="rounded-xl border border-border p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">내 정보</h2>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                이메일
              </label>
              <p className="text-sm text-foreground">{user?.email ?? "-"}</p>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-xs font-medium text-muted-foreground"
              >
                이름
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSavedMessage(null);
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                사용자 유형
              </label>
              <p className="text-sm text-foreground">
                {user?.userType === "student"
                  ? "학생"
                  : user?.userType === "staff"
                    ? "교직원"
                    : "-"}
              </p>
            </div>

            {user?.userType === "student" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    학번
                  </label>
                  <p className="text-sm text-foreground">
                    {user.studentId ?? "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    학과
                  </label>
                  <p className="text-sm text-foreground">
                    {user.department ?? "-"}
                  </p>
                </div>
              </>
            )}

            {user?.userType === "staff" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  부서
                </label>
                <p className="text-sm text-foreground">
                  {user.staffDepartment ?? "-"}
                </p>
              </div>
            )}

            {savedMessage && (
              <p
                className={`text-xs ${
                  savedMessage.includes("실패")
                    ? "text-destructive"
                    : "text-primary"
                }`}
              >
                {savedMessage}
              </p>
            )}

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                "저장"
              )}
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
