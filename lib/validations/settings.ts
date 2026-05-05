import { z } from "zod";
import { extractErrors } from "@/lib/validations/profile";

export { extractErrors };

export const nameSchema = z
  .string()
  .min(1, "이름을 입력하세요")
  .max(50, "이름은 50자 이내로 입력하세요")
  .regex(/^[가-힣a-zA-Z\s]+$/, "이름은 한글, 영문, 공백만 사용할 수 있습니다");

/** 학생 설정 폼 스키마 */
export const studentSettingsSchema = z.object({
  name: nameSchema,
  studentId: z
    .string()
    .regex(/^\d{8,10}$/, "학번은 8~10자리 숫자로 입력해주세요")
    .optional()
    .or(z.literal("")),
  department: z.enum(["software", "ai"], {
    message: "학과/학부를 선택해주세요",
  }),
  grade: z.number({ error: "학년을 선택해주세요" }).int().min(1).max(10),
  admissionYear: z
    .number({ error: "입학년도를 입력해주세요" })
    .int()
    .min(2000, "올바른 입학년도를 입력해주세요")
    .max(new Date().getFullYear(), "올바른 입학년도를 입력해주세요"),
  academicStatus: z.enum(["enrolled", "on_leave", "returning"], {
    message: "재학 상태를 선택해주세요",
  }),
  additionalInfo: z.string().optional(),
});

/** 교직원 설정 폼 스키마 */
export const staffSettingsSchema = z.object({
  name: nameSchema,
  staffDepartment: z.enum(
    [
      "student_support",
      "academic_affairs",
      "admissions",
      "industry_cooperation",
      "international_office",
      "general_affairs",
      "other",
    ],
    { message: "소속 부서를 선택해주세요" }
  ),
  jobDescription: z.string().optional(),
});

export type StudentSettingsErrors = Partial<
  Record<
    | "name"
    | "studentId"
    | "department"
    | "grade"
    | "admissionYear"
    | "academicStatus"
    | "additionalInfo",
    string
  >
>;

export type StaffSettingsErrors = Partial<
  Record<"name" | "staffDepartment" | "jobDescription", string>
>;

/** 이름 input에서 즉시 특수문자 제거 */
export function sanitizeName(value: string): string {
  return value.replace(/[^가-힣a-zA-Z\s]/g, "");
}
