#!/bin/bash
# PostToolUse hook: Edit 후 삭제된 export/파라미터/인터페이스 속성을 감지

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# git에서 추적 중인 파일만 검사 (전체 경로로 비교)
REL_PATH=$(git -C "$(dirname "$FILE_PATH")" ls-files --full-name "$(basename "$FILE_PATH")" 2>/dev/null)
if [ -z "$REL_PATH" ]; then
  exit 0
fi

if ! git diff --name-only 2>/dev/null | grep -qF "$REL_PATH"; then
  exit 0
fi

DIFF=$(git diff "$FILE_PATH" 2>/dev/null)

REMOVED_EXPORTS=$(echo "$DIFF" | grep '^-' | grep -v '^---' | grep -E 'export (function|const|interface|type) ' | head -5)
REMOVED_PROPS=$(echo "$DIFF" | grep '^-' | grep -v '^---' | grep -E '^\-\s+\w+[\?]?\s*:' | head -5)

if [ -n "$REMOVED_EXPORTS" ]; then
  echo "export가 삭제되었습니다. 다른 파일에서 import하고 있지 않은지 확인하세요:"
  echo "$REMOVED_EXPORTS"
fi

if [ -n "$REMOVED_PROPS" ]; then
  echo "interface/type 속성이 삭제되었습니다. 기존 사용처에 영향이 없는지 확인하세요:"
  echo "$REMOVED_PROPS"
fi

exit 0
