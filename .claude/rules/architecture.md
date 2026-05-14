---
globs: ["**/*.ts", "**/*.tsx"]
---

# 아키텍처 제약

## 의존 방향 (위에서 아래로만 허용)

```text
app/ (페이지)
  ↓
components/ (UI 컴포넌트)
  ↓
hooks/ (커스텀 훅)
  ↓
lib/ (유틸리티, API 호출)
  ↓
types/, constants/ (타입, 상수)
```

- 하위 레이어가 상위 레이어를 import하면 안 된다
- 예: `lib/`에서 `components/`를 import 금지
- 예: `types/`에서 `hooks/`를 import 금지
- `components/`끼리는 같은 기능 디렉토리 내에서만 import 허용

## 새 파일 생성 시 체크리스트

1. 이 기능이 이미 `lib/`, `hooks/`, `components/`에 존재하는지 먼저 검색
2. 비슷한 유틸이 있으면 새로 만들지 말고 기존 것을 확장
3. 새 파일의 위치가 위 레이어 구조에 맞는지 확인
4. 공통 유틸(`cn`, `extractErrors` 등)은 반드시 기존 것을 재사용
