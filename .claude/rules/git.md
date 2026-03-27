---
globs: ["**/*"]
---

# Git 워크플로우 규칙

## 브랜치 네이밍

- 형식: `feature/<기능-설명>`, `hotfix/<수정-설명>`, `chore/<작업-설명>`
- 이슈 번호는 사용자가 명시적으로 알려준 경우에만 포함 (예: `feature/FE-12-login-page`)
- 이슈 번호를 모르면 임의로 붙이지 않는다 (예: `feature/chat-history-actions`)
- 다른 브랜치의 이슈 번호를 복사하지 않는다

## PR 생성

- PR 본문은 반드시 **조직 PR 템플릿** 양식을 사용한다
- 자체 양식(Summary, Test plan 등)으로 작성하지 않는다
- 템플릿 양식:
  1. **📌 PR 유형** — 체크박스 (feat, fix, refactor, style, docs, ai, chore, test)
  2. **🔗 관련 이슈** — 이슈 번호 또는 "없음"
  3. **📋 작업 내용** — 변경 사항 + 변경 이유
  4. **🖼️ 스크린샷** — UI 변경 시 Before/After
  5. **✅ 체크리스트** — 동작 확인, 영향도 검토, console.log 제거, 문서 업데이트, 리뷰 요청
  6. **💬 리뷰어에게 전할 말** — 구현 참고사항
- 기존 PR 본문 참조: `gh pr view <번호> --json body`

## 커밋

- 한국어 커밋 메시지 사용
- 접두사 필수: `feat:`, `fix:`, `refactor:`, `design:`, `style:`, `comment:`, `test:`, `chore:`, `init:`, `rename:`, `remove:`
- 논리적으로 분리 가능한 변경은 여러 커밋으로 분할
- `.env*` 파일이 포함되어 있으면 경고 후 제외
