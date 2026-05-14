---
globs: ["lib/validations/**/*.ts", "hooks/use*Form*.ts"]
---

# 유효성 검사 규칙

## Zod v4
- `import { z } from "zod"` 패턴
- Zod v4 API 사용 (v3과 다름에 주의)
- 에러 메시지는 한국어

## 스키마 구조
- 검증 스키마: `lib/validations/` 디렉토리에 도메인별 파일
- 타입 정의: `types/` 디렉토리에 분리
- 스키마에서 타입 추론보다 별도 타입 정의 선호

## 에러 처리
- `safeParse()` 사용 (throw하는 `parse()` 금지)
- `extractErrors<T>()` 유틸리티로 필드별 에러 맵 변환
- 에러 타입: `Partial<Record<필드키, string>>`

## 폼 훅
- `useXxxForm` 네이밍
- 상태, 검증, 단계(step) 로직을 하나의 훅에 캡슐화
- 값 변경 시 해당 필드 에러만 클리어
