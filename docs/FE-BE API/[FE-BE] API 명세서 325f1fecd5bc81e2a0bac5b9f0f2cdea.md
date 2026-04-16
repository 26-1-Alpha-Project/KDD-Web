# [FE-BE] API 명세서

날짜: 2026년 4월 12일 오전 1:19
담당자: 장민주, 상진 이
파트: 백엔드

<aside>

# **⭐필독 사항⭐**

### 인증 헤더

인증 필요 API는 아래 헤더를 포함해야 한다:

`Authorization: Bearer <accessToken>`

### 에러 응답 포맷 (통일)

모든 에러 응답은 아래 형태를 따른다:

```json
{
  "error": "ERROR_CODE",
  "message": "사용자에게 보여줄 메시지"
}
```

### 응답 포맷 (통일)

모든 API 성공 응답은 래퍼 없이 DTO를 직접 반환한다.

```json
// ✅ 올바른 예
{
  "accessToken": "...",
  "isProfileCompleted": true
}

// ❌ 잘못된 예
{
  "success": true,
  "data": {
    "accessToken": "...",
    "isProfileCompleted": true
  }
}
```

### 공통 에러

각 API에 해당하는 에러를 한 줄로 표기한다. 아래 JSON을 그대로 사용하면 된다.
**특수 에러**는 공통 JSON과 포맷이 다르므로, 해당 API에서 별도 JSON으로 정의한다.

### 공통 에러 코드 요약

| HTTP 코드 | error | 발생 조건 |
| --- | --- | --- |
| 400 | INVALID_INPUT | 필수 파라미터 누락 또는 유효하지 않은 값 |
| 401 | UNAUTHORIZED | Access Token 없음/만료/무효 |
| 403 | FORBIDDEN | 관리자 권한 필요 (Admin API) |
| 404 | {RESOURCE}_NOT_FOUND | 요청한 리소스가 존재하지 않음 |
| 500 | INTERNAL_SERVER_ERROR | 서버 내부 오류 |

**400 Bad Request**

```json
{
  "error": "INVALID_INPUT",
  "message": "유효하지 않은 입력값입니다."
}
```

**401 Unauthorized**

```json
{
  "error": "UNAUTHORIZED",
  "message": "인증이 필요합니다."
}
```

**403 Forbidden**

```json
{
  "error": "FORBIDDEN",
  "message": "관리자 권한이 필요합니다."
}
```

**404 Not Found**

```json
{
  "error": "{RESOURCE}_NOT_FOUND",
  "message": "존재하지 않는 {리소스}입니다."
}
```

> 
> 
> 
> 리소스별 에러 코드:
> SESSION_NOT_FOUND — “채팅 세션”
> DOCUMENT_NOT_FOUND — “문서”
> FAQ_NOT_FOUND — “FAQ”
> CANDIDATE_NOT_FOUND — “FAQ 후보”
> MESSAGE_NOT_FOUND — “채팅 메시지”
> USER_NOT_FOUND — "사용자"
> 

**500 Internal Server Error**

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "서버 내부 오류가 발생했습니다."
}
```

### 페이지네이션 (통일)

목록 조회 API는 아래 형태를 따른다:

```json
{
  "data": [...],
  "totalCount": number,
  "page": number,
  "pageSize": number,
  "totalPages": number
}
```

---

## 인증 프로세스 개요

```json
[로그인]
1. 사용자 → Google 로그인 → Authorization Code 받음
2. 클라이언트 → 서버: POST /auth/google (code 전달)
3. 서버 → Google: code로 사용자 정보 조회
4. 서버: Access Token(JWT, 30분) + Refresh Token(14일) 생성
5. 서버: Refresh Token을 PostgreSQL (auth_sessions 테이블)에 저장
6. 서버 → 클라이언트:
   - Body: { accessToken, isProfileCompleted }
   - Set-Cookie: refreshToken (HttpOnly)

[신규 사용자 프로필 입력]
7. 프론트: isProfileCompleted === false → 프로필 입력 페이지로 이동
8. 클라이언트 → 서버: POST /users/me/profile (프로필 정보 전달)
9. 서버: profileCompleted = true로 변경
10. 프론트: 메인 페이지로 이동

[프로필 입력 중 이탈 후 재접속]
11. 재접속 → POST /auth/google → { isProfileCompleted: false }
12. 프론트: isProfileCompleted === false → 프로필 입력 페이지로 이동

[API 호출]
15. 클라이언트 → 서버: API 요청 (Authorization: Bearer <accessToken>)
16. 서버: JWT 서명 검증 → 응답 (DB/Redis 조회 없이 토큰 자체로 검증)

[만료 직전 재발급 — Silent Refresh]
17. 클라이언트: JWT payload의 exp를 디코딩하여 만료 시간 감시
18. 만료 5분 전 → 백그라운드에서 POST /auth/refresh 호출 (Cookie 자동 포함)
19. 서버: Cookie의 Refresh Token vs PostgreSQL (auth_sessions) 저장값 대조
20. 일치 → 새 Access Token 발급 + Refresh Token Rotation
21. 클라이언트: 새 토큰으로 교체, 사용자는 끊김 없이 계속 이용

[로그아웃]
22. 서버: PostgreSQL auth_sessions에서 Refresh Token 폐기(revoke) → 재발급 불가
```

**토큰 정책**

| 항목 | 값 |
| --- | --- |
| Access Token 형식 | JWT |
| Access Token 만료 | 30분 |
| Access Token 저장 | 클라이언트 메모리 |
| Access Token 검증 | 서명 검증 (stateless) |
| Refresh Token 만료 | 14일 |
| Refresh Token 저장 | HttpOnly Cookie + PostgreSQL |
| Refresh Token 검증 | PostgreSQL 대조 (stateful) |
| 재발급 방식 | 만료 직전 자동 재발급 (Silent Refresh) |
</aside>

[API 명세서 ](%5BFE-BE%5D%20API%20%EB%AA%85%EC%84%B8%EC%84%9C/API%20%EB%AA%85%EC%84%B8%EC%84%9C%20325f1fecd5bc8188980af22cb0127511.csv)