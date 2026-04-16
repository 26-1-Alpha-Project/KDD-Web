# Google OAuth 로그인 / 회원가입

백 진행상황: 완료
설명: Google OAuth 인증 코드를 이용하여 로그인 또는 회원가입을 처리하고 JWT를 발급한다.
로그인 성공 시 신규 사용자 여부를 나타내는 isNewUser 값을 함께 반환한다.
API 그룹: Auth
URL: /auth/google
METHOD: POST
인증 필요: No
기능명세서: 구글 로그인 (OAuth2) (https://www.notion.so/OAuth2-319f1fecd5bc800b83a3fccc1adb1808?pvs=21)
담당자: 장민주
프론트 연결 상태: 시작 전
API 명세서 업데이트: 2026년 4월 1일

`POST` 

### 📥 요청(Request)

- **Request Body (JSON)**

```json
{
	"code": string
}
```

### 📤 응답(Response)

- **성공 (200 OK)**

```json
{
	"accessToken": string,
	"isProfileCompleted": boolean
}
```

> `Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Path=/auth; Max-Age=1209600`
> 

**실패 (401)** — INVALID_AUTH_CODE

```json
{
  "error": "INVALID_AUTH_CODE",
  "message": "유효하지 않은 Google 인증 코드입니다."
}
```

**실패 (403)** — UNAUTHORIZED_DOMAIN

```json
{
  "error": "UNAUTHORIZED_DOMAIN",
  "message": "허용되지 않은 이메일 도메인입니다."
}
```

**실패 (403)** — UNVERIFIED_EMAIL

```json
{
  "error": "UNVERIFIED_EMAIL",
  "message": "이메일 인증이 완료되지 않았습니다."
}
```

**실패 (403)** — ACCOUNT_DEACTIVATED

```json
{
  "error": "ACCOUNT_DEACTIVATED",
  "message": "비활성화된 계정입니다."
}
```

**실패 (500)** — INTERNAL_SERVER_ERROR

### 📜 상세 설명

| 키 | 설명 |
| --- | --- |
| code | Google OAuth Authorization Code |
| accessToken | JWT Access Token (만료: 30분) |
| isProfileCompleted | 프로필 완성 여부 (false: 프로필 입력 필요, true: 홈으로 이동) |
- Refresh Token은 Body가 아닌 **HttpOnly Cookie**로 전달 (JS 접근 불가)
- 서버는 동시에 Refresh Token을 **PostgreSQL (auth_sessions  테이블)에 저장**
- 미등록 사용자는 자동 회원가입 처리 (email, name을 Google에서 수집)

---