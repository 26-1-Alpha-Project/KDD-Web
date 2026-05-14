"use client";

import { useState, useCallback } from "react";
import type {
  ProfileFormData,
  BasicInfoData,
  StudentInfoData,
  StaffInfoData,
} from "@/types/profile";
import {
  basicInfoSchema,
  studentInfoSchema,
  staffInfoSchema,
  extractErrors,
  type BasicInfoErrors,
  type StudentInfoErrors,
  type StaffInfoErrors,
} from "@/lib/validations/profile";

const INITIAL_BASIC_INFO: BasicInfoData = {
  name: "",
  email: "",
  userType: "",
  studentId: "",
};

const INITIAL_STUDENT_INFO: StudentInfoData = {
  department: "",
  grade: "",
  admissionYear: "",
  leaveOfAbsence: "",
  returnPlan: "",
  additionalInfo: "",
};

const INITIAL_STAFF_INFO: StaffInfoData = {
  staffDepartment: "",
  jobDescription: "",
};

export function useProfileForm(initialName = "", initialEmail = "") {
  const [step, setStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    ...INITIAL_BASIC_INFO,
    name: initialName,
    email: initialEmail,
  });
  const [studentInfo, setStudentInfo] =
    useState<StudentInfoData>(INITIAL_STUDENT_INFO);
  const [staffInfo, setStaffInfo] = useState<StaffInfoData>(INITIAL_STAFF_INFO);

  const [basicErrors, setBasicErrors] = useState<BasicInfoErrors>({});
  const [studentErrors, setStudentErrors] = useState<StudentInfoErrors>({});
  const [staffErrors, setStaffErrors] = useState<StaffInfoErrors>({});

  const updateBasicInfo = useCallback(
    <K extends keyof BasicInfoData>(field: K, value: BasicInfoData[K]) => {
      setBasicInfo((prev) => ({ ...prev, [field]: value }));
      // Clear field error on change
      setBasicErrors((prev) => {
        if (prev[field as keyof BasicInfoErrors]) {
          const next = { ...prev };
          delete next[field as keyof BasicInfoErrors];
          return next;
        }
        return prev;
      });
    },
    []
  );

  const updateStudentInfo = useCallback(
    <K extends keyof StudentInfoData>(field: K, value: StudentInfoData[K]) => {
      setStudentInfo((prev) => {
        const next = { ...prev, [field]: value };
        if (field === "leaveOfAbsence" && value !== "yes") {
          next.returnPlan = "";
        }
        return next;
      });
      setStudentErrors((prev) => {
        if (prev[field as keyof StudentInfoErrors]) {
          const next = { ...prev };
          delete next[field as keyof StudentInfoErrors];
          return next;
        }
        return prev;
      });
    },
    []
  );

  const updateStaffInfo = useCallback(
    <K extends keyof StaffInfoData>(field: K, value: StaffInfoData[K]) => {
      setStaffInfo((prev) => ({ ...prev, [field]: value }));
      setStaffErrors((prev) => {
        if (prev[field as keyof StaffInfoErrors]) {
          const next = { ...prev };
          delete next[field as keyof StaffInfoErrors];
          return next;
        }
        return prev;
      });
    },
    []
  );

  const validateStep1 = useCallback((): boolean => {
    const result = basicInfoSchema.safeParse(basicInfo);
    const errors = extractErrors<BasicInfoErrors>(result);
    setBasicErrors(errors);
    return result.success;
  }, [basicInfo]);

  const validateStep2 = useCallback((): boolean => {
    if (basicInfo.userType === "student") {
      const result = studentInfoSchema.safeParse(studentInfo);
      const errors = extractErrors<StudentInfoErrors>(result);
      setStudentErrors(errors);
      return result.success;
    }
    if (basicInfo.userType === "staff") {
      const result = staffInfoSchema.safeParse(staffInfo);
      const errors = extractErrors<StaffInfoErrors>(result);
      setStaffErrors(errors);
      return result.success;
    }
    return false;
  }, [basicInfo.userType, studentInfo, staffInfo]);

  // Lightweight checks for disabling buttons (no error messages)
  const isStep1Filled = (() => {
    const { name, email, userType, studentId } = basicInfo;
    if (!name.trim() || !email.trim() || !userType) return false;
    if (userType === "student" && !studentId.trim()) return false;
    return true;
  })();

  const isStep2Filled = (() => {
    if (basicInfo.userType === "student") {
      const { department, grade, admissionYear, leaveOfAbsence, returnPlan } = studentInfo;
      if (!department || !grade || !admissionYear.trim() || !leaveOfAbsence) return false;
      if (leaveOfAbsence === "yes" && !returnPlan) return false;
      return true;
    }
    if (basicInfo.userType === "staff") {
      return !!staffInfo.staffDepartment;
    }
    return false;
  })();

  const goNext = useCallback(() => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  }, [step, validateStep1]);

  const goBack = useCallback(() => {
    if (step === 2) setStep(1);
  }, [step]);

  const getFormData = useCallback((): ProfileFormData => {
    return { basicInfo, studentInfo, staffInfo };
  }, [basicInfo, studentInfo, staffInfo]);

  return {
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
    validateStep1,
    validateStep2,
    goNext,
    goBack,
    getFormData,
  };
}
