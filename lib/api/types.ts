/**
 * API 공통 타입 re-export
 *
 * types/api/ 하위 모든 타입을 이 파일에서 re-export하여
 * 서비스 계층에서 일관된 import 경로를 제공한다.
 */

export type * from '@/types/api/common';
export type * from '@/types/api/auth';
export type * from '@/types/api/user';
export type * from '@/types/api/chat';
export type * from '@/types/api/document';
export type * from '@/types/api/faq';
export type * from '@/types/api/admin';
