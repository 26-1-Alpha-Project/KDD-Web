#!/bin/bash
# Stop hook: 작업 완료 전 자동 검증
# Claude가 "끝났습니다" 하기 전에 빌드/lint를 확인

cd "$CLAUDE_PROJECT_DIR" || exit 0

# 변경된 파일이 있는지 확인
CHANGED=$(git diff --name-only 2>/dev/null)
if [ -z "$CHANGED" ]; then
  exit 0
fi

# .ts/.tsx 파일이 변경된 경우에만 lint 실행
if echo "$CHANGED" | grep -qE '\.(ts|tsx)$'; then
  LINT_OUTPUT=$(npm run lint 2>&1)
  LINT_EXIT=$?

  if [ $LINT_EXIT -ne 0 ]; then
    echo "lint 오류가 있습니다. 작업을 완료하기 전에 수정하세요:"
    echo "$LINT_OUTPUT" | tail -20
    exit 1
  fi
fi

exit 0
