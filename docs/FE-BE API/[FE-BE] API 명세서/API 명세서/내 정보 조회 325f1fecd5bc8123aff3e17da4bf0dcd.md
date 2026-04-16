# 내 정보 조회

백 진행상황: 완료
설명: 현재 로그인한 사용자 정보를 조회한다.
API 그룹: Users
URL: /users/me
METHOD: GET
인증 필요: Yes
기능명세서: 사용자 정보 조회 (https://www.notion.so/328f1fecd5bc80e49d1fe972626405e9?pvs=21)
담당자: 장민주
프론트 연결 상태: 시작 전
API 명세서 업데이트: 2026년 4월 10일

> 인증 필요: `Authorization: Bearer <accessToken>`
> 

### 📥 요청(Request)

> 별도 Request Body 없음
> 

### 📤 응답(Response)

**성공 (200 OK)**

json

```json
{
  "userId": number,
  "email": string,
  "name": string,
  "role": "user" | "admin",
  "profileCompleted": boolean,
  "userType": "student" | "staff",
  "studentId": string | null,
  "department": "software" | "ai" | null,
  "grade": number | null,
  "admissionYear": number | null,
	"academicStatus": "enrolled" | "on_leave" | "returning" | null,
  "additionalInfo": string | null,
  "staffDepartment": "student_support" | "academic_affairs" | "admissions" | "industry_cooperation" | "international_office" | "general_affairs" | "other" | null,
  "jobDescription": string | null
}
```

**실패 (401)** — UNAUTHORIZED

**실패 (500)** — INTERNAL_SERVER_ERROR

### 📜 상세 설명

| 키 | 설명 |
| --- | --- |
| userId | 사용자 고유 ID |
| email | Google 계정 이메일 (OAuth에서 자동 수집) |
| name | 사용자 이름 (OAuth에서 자동 수집, 이후 수정 가능) |
| role | 사용자 역할: user(일반) / admin(관리자) |
| profileCompleted | 프로필 입력 완료 여부 (false면 프로필 입력 페이지로 이동) |
| userType | 사용자 유형: student(학생) / staff(교직원) |
| studentId | 학번 — userType=student일 때 |
| department | 학과: software(소프트웨어) / ai(AI) — userType=student일 때 |
| grade | 학년 (정수) — userType=student일 때 |
| admissionYear | 입학년도 (정수, 예: 2023) — userType=student일 때 |
| academicStatus | 학적 상태: ENROLLED(재학) / ON_LEAVE(휴학) / RETURNING(복학예정) — userType=student일 때 |
| additionalInfo | 추가 정보 — userType=student일 때 |
| staffDepartment | 소속 부서 — userType=staff일 때 |
| jobDescription | 담당 업무 — userType=staff일 때 |
- 프론트는 로그인 후 이 API를 호출하여 `profileCompleted`를 확인한다
- `profileCompleted === false`이면 프로필 입력 페이지로 이동시킨다
- `userType`에 따라 student 관련 필드 또는 staff 관련 필드가 채워진다