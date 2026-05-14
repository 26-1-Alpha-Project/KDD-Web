"use client";

import type {
  StudentInfoData,
  Department,
  Grade,
  LeaveOfAbsence,
  ReturnPlan,
} from "@/types/profile";
import type { StudentInfoErrors } from "@/lib/validations/profile";
import {
  DEPARTMENT_OPTIONS,
  GRADE_OPTIONS,
  LEAVE_OF_ABSENCE_OPTIONS,
  RETURN_PLAN_OPTIONS,
} from "@/constants/profile";
import SelectField from "./SelectField";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";

interface StudentInfoStepProps {
  data: StudentInfoData;
  errors: StudentInfoErrors;
  onUpdate: <K extends keyof StudentInfoData>(
    field: K,
    value: StudentInfoData[K]
  ) => void;
}

export default function StudentInfoStep({
  data,
  errors,
  onUpdate,
}: StudentInfoStepProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-[28px] font-bold leading-9 text-foreground">
          학업 정보 입력
        </h1>
        <p className="text-[15px] leading-6 text-muted-foreground">
          AI가 더 정확한 답변을 제공할 수 있도록 도와주세요
        </p>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-5">
        <SelectField<Department | "">
          label="학과/학부"
          value={data.department}
          onChange={(v) => onUpdate("department", v as Department)}
          options={DEPARTMENT_OPTIONS}
          required
          error={errors.department}
        />

        <SelectField<Grade | "">
          label="학년"
          value={data.grade}
          onChange={(v) => onUpdate("grade", v as Grade)}
          options={GRADE_OPTIONS}
          required
          error={errors.grade}
        />

        <InputField
          label="입학년도"
          value={data.admissionYear}
          onChange={(v) => onUpdate("admissionYear", v)}
          placeholder="2021"
          required
          error={errors.admissionYear}
          hint="4자리 숫자로 입력해주세요 (예: 2021)"
        />

        <SelectField<LeaveOfAbsence | "">
          label="현재 휴학 중이신가요?"
          value={data.leaveOfAbsence}
          onChange={(v) => onUpdate("leaveOfAbsence", v as LeaveOfAbsence)}
          options={LEAVE_OF_ABSENCE_OPTIONS}
          required
          error={errors.leaveOfAbsence}
        />

        {data.leaveOfAbsence === "yes" && (
          <SelectField<ReturnPlan | "">
            label="복학 예정이신가요?"
            value={data.returnPlan}
            onChange={(v) => onUpdate("returnPlan", v as ReturnPlan)}
            options={RETURN_PLAN_OPTIONS}
            required
            error={errors.returnPlan}
          />
        )}

        <TextAreaField
          label="기타 추가 정보 (선택)"
          value={data.additionalInfo}
          onChange={(v) => onUpdate("additionalInfo", v)}
          placeholder="예: 복학 예정 학기, 교환학생 경험, 복수전공, 부전공 등 AI에게 알려주고 싶은 정보를 자유롭게 작성해주세요."
          helperText="이 정보는 AI가 맞춤형 답변을 제공하는데 활용됩니다"
        />
      </div>
    </div>
  );
}
