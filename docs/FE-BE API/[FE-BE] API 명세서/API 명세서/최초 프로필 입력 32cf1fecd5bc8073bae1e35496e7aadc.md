# 최초 프로필 입력

백 진행상황: 완료
설명: 최초 로그인 혹은 최초 로그인 후 프로필 미입력 후 재진입 시, 최초 프로필을 입력한다.
API 그룹: Users
URL: /users/me/profile
METHOD: POST
인증 필요: Yes
기능명세서: 최초 로그인 시 정보 입력 (https://www.notion.so/319f1fecd5bc80e1b892d1fe965be9e6?pvs=21)
담당자: 장민주
프론트 연결 상태: 시작 전
API 명세서 업데이트: 2026년 4월 10일

> 인증 필요: `Authorization: Bearer <accessToken>`
> 

### 📥 요청(Request)

**Request Body (JSON) — 학생**

```json
{
  "name": string,
  "userType": "student",
  "studentId": string,
  "department": "software" | "ai",
  "grade": number,
  "admissionYear": number,
  "academicStatus": "enrolled" | "on_leave" | "returning",
  "additionalInfo": string
}

```

**Request Body (JSON) — 교직원**

```json
{
  "name": string,
  "userType": "staff",
  "staffDepartment": "student_support" | "academic_affairs" | "admissions" | "industry_cooperation" | "international_office" | "general_affairs" | "other",
  "jobDescription": string
}
```

### 📤 응답(Response)

**성공 (201 Created)**

> GET /users/me와 동일한 형태 (profileCompleted: true)
> 

**실패 (400)** — INVALID_INPUT

**실패 (401)** — UNAUTHORIZED

**실패 (409)** — PROFILE_ALREADY_COMPLETED

```json
{
  "error": "PROFILE_ALREADY_COMPLETED",
  "message": "이미 프로필이 입력된 사용자입니다."
}
```

**실패 (500)** — INTERNAL_SERVER_ERROR