---
globs: ["**/*.sh", ".claude/hooks/**"]
---

# Shell Script 작성 규칙

## 방어적 코딩

- `cd` 실패 시 반드시 `exit 1` (exit 0으로 성공 처리 금지)
- 파일 경로 비교 시 `basename` 사용 금지 — 전체 경로 또는 상대 경로로 비교
- `git diff --name-only`는 unstaged만 포함 — staged(`--cached`)와 untracked(`ls-files --others`)도 필요하면 함께 사용
- 변수가 빈 문자열일 수 있는 경우 반드시 `[ -z "$VAR" ]` 체크

## git 명령 사용 시

- `git diff` 결과를 파싱할 때 `--name-only`의 기본 범위를 정확히 인지
- 파일 존재 여부 확인: `git ls-files --full-name` 사용
- 에러 출력 무시: `2>/dev/null` 사용

## hook 스크립트

- stdin으로 JSON 입력이 올 수 있음 — `jq`로 파싱
- stdout 출력은 Claude에게 피드백으로 전달됨
- exit 0 = 성공, exit 1 = 실패 (Claude에게 수정 요구), exit 2 = 도구 호출 차단
