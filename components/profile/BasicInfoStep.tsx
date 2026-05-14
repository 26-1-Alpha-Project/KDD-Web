"use client";

import { FcGoogle } from "react-icons/fc";
import type { BasicInfoData, UserType } from "@/types/profile";
import type { BasicInfoErrors } from "@/lib/validations/profile";
import { USER_TYPE_OPTIONS } from "@/constants/profile";
import InputField from "./InputField";
import SelectField from "./SelectField";

interface BasicInfoStepProps {
  data: BasicInfoData;
  errors: BasicInfoErrors;
  onUpdate: <K extends keyof BasicInfoData>(
    field: K,
    value: BasicInfoData[K]
  ) => void;
}

export default function BasicInfoStep({
  data,
  errors,
  onUpdate,
}: BasicInfoStepProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent rounded-full w-fit">
          <FcGoogle className="size-3.5" />
          <span className="text-xs font-medium text-primary">
            Google 로그인 완료
          </span>
        </div>
        <h1 className="text-[28px] font-bold leading-9 text-foreground">
          기본 정보 입력
        </h1>
        <p className="text-[15px] leading-6 text-muted-foreground">
          맞춤형 답변을 위해 정보를 입력해주세요
        </p>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-5">
        <InputField
          label="이름"
          value={data.name}
          onChange={(v) => onUpdate("name", v)}
          required
          error={errors.name}
          helperText="Google 계정에서 자동 입력됨 (수정 가능)"
        />

        <InputField
          label="이메일"
          value={data.email}
          onChange={() => {}}
          disabled
          required
          error={errors.email}
          helperText="Google 계정에서 자동 입력됨 (변경 불가)"
        />

        <SelectField<UserType | "">
          label="사용자 유형"
          value={data.userType}
          onChange={(v) => onUpdate("userType", v as UserType)}
          options={USER_TYPE_OPTIONS}
          placeholder="선택해주세요"
          required
          error={errors.userType}
        />

        {data.userType === "student" && (
          <InputField
            label="학번"
            value={data.studentId}
            onChange={(v) => onUpdate("studentId", v)}
            placeholder="20213090"
            required
            error={errors.studentId}
            hint="8~10자리 숫자를 입력해주세요"
          />
        )}
      </div>
    </div>
  );
}
