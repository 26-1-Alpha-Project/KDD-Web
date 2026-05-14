/** 백엔드 GoogleLoginRequest와 1:1 대응 */
export interface GoogleLoginRequest {
  code: string;
}

/** 백엔드 LoginResponse와 1:1 대응 */
export interface LoginResponse {
  accessToken: string;
  isProfileCompleted: boolean;
}

/** 백엔드 RefreshResponse와 1:1 대응 */
export interface RefreshResponse {
  accessToken: string;
}

/** 백엔드 LogoutResponse와 1:1 대응 */
export interface LogoutResponse {
  message: string;
}
