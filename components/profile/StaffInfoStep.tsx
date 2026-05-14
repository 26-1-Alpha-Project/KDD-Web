"use client";

import type { StaffInfoData, StaffDepartment } from "@/types/profile";
import type { StaffInfoErrors } from "@/lib/validations/profile";
import { STAFF_DEPARTMENT_OPTIONS } from "@/constants/profile";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";

interface StaffInfoStepProps {
  data: StaffInfoData;
  errors: StaffInfoErrors;
  onUpdate: <K extends keyof StaffInfoData>(
    field: K,
    value: StaffInfoData[K]
  ) => void;
}

export default function StaffInfoStep({
  data,
  errors,
  onUpdate,
}: StaffInfoStepProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-[28px] font-bold leading-9 text-foreground">
          업무 정보 입력
        </h1>
        <p className="text-[15px] leading-6 text-muted-foreground">
          AI가 더 정확한 답변을 제공할 수 있도록 도와주세요
        </p>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-5">
        <SelectField<StaffDepartment | "">
          label="소속 부서"
          value={data.staffDepartment}
          onChange={(v) => onUpdate("staffDepartment", v as StaffDepartment)}
          options={STAFF_DEPARTMENT_OPTIONS}
          required
          error={errors.staffDepartment}
        />

        <TextAreaField
          label="담당 업무 (선택)"
          value={data.jobDescription}
          onChange={(v) => onUpdate("jobDescription", v)}
          placeholder="예: 장학금 업무, 수강신청 관리 등"
        />
      </div>
    </div>
  );
}
