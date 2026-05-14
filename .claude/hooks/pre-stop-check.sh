#!/bin/bash
# Stop hook: 작업 완료 전 자동 검증

cd "$CLAUDE_PROJECT_DIR" || exit 1

# staged + unstaged + untracked 모두 포함하여 변경 파일 확인
CHANGED=$(git diff --name-only HEAD 2>/dev/null; git diff --name-only --cached 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null)
CHANGED=$(echo "$CHANGED" | sort -u)

if [ -z "$CHANGED" ]; then
  exit 0
fi

# 변경된 .ts/.tsx 파일만 추출
TS_CHANGED=$(echo "$CHANGED" | grep -E '\.(ts|tsx)$' || true)
if [ -n "$TS_CHANGED" ]; then
  LINT_OUTPUT=$(echo "$TS_CHANGED" | xargs npx eslint --max-warnings=0 2>&1)
  LINT_EXIT=$?

  if [ $LINT_EXIT -ne 0 ]; then
    echo "lint 오류가 있습니다. 작업을 완료하기 전에 수정하세요:"
    echo "$LINT_OUTPUT" | tail -20
    exit 1
  fi
fi

exit 0
