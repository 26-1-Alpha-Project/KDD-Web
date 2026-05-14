# Auth API 명세서

백엔드 기준 URL prefix: `/auth`
프론트 프록시 경로: `/api/backend/auth/*`

## refreshToken 쿠키 특성
- HttpOnly, Secure(prod), SameSite=Strict, **Path=/auth**
- 브라우저가 `/auth/*` 경로 요청 시에만 자동 포함
- 프론트 프록시(`/api/backend/auth/*`)를 통하면 쿠키가 `localhost:3000`에 저장됨

---

## POST /auth/google — Google OAuth 로그인/회원가입

**인증**: 불필요

### 요청
```json
{ "code": "string" }
```

### 성공 응답 (200)
```json
{
  "accessToken": "string",
  "isProfileCompleted": true
}
```
- `Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Path=/auth; Max-Age=1209600`

### 에러 응답
| 코드 | error | message |
|------|-------|---------|
| 401 | INVALID_AUTH_CODE | 유효하지 않은 Google 인증 코드입니다. |
| 403 | UNAUTHORIZED_DOMAIN | 허용되지 않은 이메일 도메인입니다. |
| 403 | UNVERIFIED_EMAIL | 이메일 인증이 완료되지 않았습니다. |
| 403 | ACCOUNT_DEACTIVATED | 비활성화된 계정입니다. |
| 500 | INTERNAL_SERVER_ERROR | 서버 내부 오류가 발생했습니다. |

### 상세
- 미등록 사용자는 자동 회원가입 (email, name Google에서 수집)
- Access Token 만료: 30분
- Refresh Token은 PostgreSQL auth_sessions 테이블에 저장

---

## POST /auth/refresh — 토큰 재발급

**인증**: refreshToken 쿠키 (자동 포함)

### 요청
별도 Body 없음. refreshToken은 HttpOnly Cookie로 자동 전송.

### 성공 응답 (200)
```json
{ "accessToken": "string" }
```
- Refresh Token Rotation 적용: 새 refreshToken이 Set-Cookie로 재설정
- 기존 토큰은 DB에서 무효화 (revoked_at 설정)

### 에러 응답
| 코드 | error | message |
|------|-------|---------|
| 401 | INVALID_REFRESH_TOKEN | 유효하지 않거나 만료된 Refresh Token입니다. |
| 500 | INTERNAL_SERVER_ERROR | 서버 내부 오류가 발생했습니다. |

### 상세
- 클라이언트는 Access Token 만료 5분 전에 백그라운드 호출
- SHA-256 해싱 후 auth_sessions.refresh_token_hash와 대조

---

## POST /auth/logout — 로그아웃

**인증**: Bearer accessToken

### 요청
별도 Body 없음.

### 성공 응답 (200)
```json
{ "message": "로그아웃되었습니다." }
```
- `Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/auth; Max-Age=0`

### 에러 응답
| 코드 | error | message |
|------|-------|---------|
| 401 | UNAUTHORIZED | 인증이 필요합니다. |
| 500 | INTERNAL_SERVER_ERROR | 서버 내부 오류가 발생했습니다. |

### 상세
- 서버에서 auth_sessions 해당 세션 무효화 (revoked_at 설정)
- Set-Cookie로 refreshToken 쿠키 제거 (Max-Age=0)
- 클라이언트: 메모리 Access Token 삭제 + /login 이동

---

## 백엔드 DTO (Java records)

```java
// GoogleLoginRequest
record GoogleLoginRequest(String code) {}

// LoginResponse
record LoginResponse(String accessToken, boolean isProfileCompleted) {}

// RefreshResponse
record RefreshResponse(String accessToken) {}

// LogoutResponse
record LogoutResponse(String message) {}

// ErrorResponse (공통)
record ErrorResponse(String error, String message) {}
```
