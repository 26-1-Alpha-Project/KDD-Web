/** 백엔드 UserResponse와 1:1 대응 */
export interface UserResponse {
  userId: number;
  email: string;
  name: string;
  role: string | null; // "user" | "admin"
  profileCompleted: boolean;
  userType: string | null; // "student" | "staff"

  // 학생 전용
  studentId: string | null;
  department: string | null;
  grade: number | null;
  admissionYear: number | null;
  academicStatus: string | null;
  additionalInfo: string | null;

  // 교직원 전용
  staffDepartment: string | null;
  jobDescription: string | null;
}

/** 백엔드 CreateProfileRequest와 1:1 대응 */
export interface CreateProfileRequest {
  name: string;
  userType: string; // "student" | "staff"

  // 학생 전용
  studentId?: string;
  department?: string;
  grade?: number;
  admissionYear?: number;
  academicStatus?: string;
  additionalInfo?: string;

  // 교직원 전용
  staffDepartment?: string;
  jobDescription?: string;
}

/** 백엔드 UpdateProfileRequest와 1:1 대응 */
export interface UpdateProfileRequest {
  name?: string;

  // 학생 전용
  studentId?: string;
  department?: string;
  grade?: number;
  admissionYear?: number;
  academicStatus?: string;
  additionalInfo?: string;

  // 교직원 전용
  staffDepartment?: string;
  jobDescription?: string;
}

/** 내 정보 수정 요청 (UpdateProfileRequest와 동일) */
export type UpdateUserRequest = UpdateProfileRequest;
