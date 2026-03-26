---
name: review-pr
description: PR 코드 리뷰를 수행한다. PR 리뷰, 코드 리뷰, 변경사항 검토, PR 확인, 리뷰해줘, PR 봐줘 등을 언급할 때 반드시 사용.
argument-hint: "[PR 번호 (선택)]"
---

# PR 코드 리뷰

현재 브랜치 또는 지정된 PR의 변경사항을 프로젝트 규칙 기준으로 리뷰한다.

## 인자

- PR 번호 있음: `/review-pr 42` → `gh pr diff 42` 사용
- PR 번호 없음: 현재 브랜치의 `git diff develop...HEAD` 사용

## 단계

1. 변경사항 수집
   - PR 번호: `gh pr view $ARGUMENTS` + `gh pr diff $ARGUMENTS`
   - 없으면: `git diff --stat develop...HEAD` + `git diff develop...HEAD`
2. `.claude/rules/` 규칙 파일 읽기
3. 변경된 각 파일 검토:
   - 컴포넌트 규칙 준수
   - 스타일링 규칙 준수
   - TypeScript 규칙 준수
   - `components/ui/` 직접 수정 여부
   - `console.log` 잔류 여부
   - 하드코딩 색상 여부
4. 결과를 심각도별로 분류

## 출력 형식

```
## PR 코드 리뷰

### [필수 수정]
- 파일:줄번호 — 설명

### [권장]
- 파일:줄번호 — 설명

### [참고]
- 잘된 부분, 긍정적 피드백

### 요약
전체 평가 한 줄
```
