# Git 워크플로우 규칙

## 브랜치 네이밍

- 형식: `feature/<기능-설명>`, `hotfix/<수정-설명>`, `chore/<작업-설명>`
- 이슈 번호는 사용자가 명시적으로 알려준 경우에만 포함 (예: `feature/FE-12-login-page`)
- 이슈 번호를 모르면 임의로 붙이지 않는다 (예: `feature/chat-history-actions`)
- 다른 브랜치의 이슈 번호를 복사하지 않는다

## PR 브랜치 전략

- **모든 PR은 develop을 base(타겟)으로 한다** — 체인 PR 금지
- 여러 PR을 나눌 때 각 브랜치는 develop에서 독립 분기한다
- 브랜치 간 의존성(공유 타입/상수)이 있으면:
  1. 공유 타입만 담은 작은 PR을 먼저 올려 빠르게 머지하거나
  2. 각 브랜치에서 필요한 타입을 중복 정의 → 머지 시 충돌 해결로 통합
- 체인 PR(PR A → PR B → PR C)은 리베이스 전파 문제로 사용하지 않는다

## develop / main 직접 작업 금지 (절대)

- **`develop`, `main` 브랜치에 직접 commit·push 금지.** GitHub Ruleset이 막지만 Claude도 시도조차 하지 않는다
- **로컬에서도 `develop` checkout 상태로 코드 수정/커밋하지 않는다.** 변경 시작 전 항상 `feature/*` 또는 `hotfix/*` 브랜치로 분기
- 실수로 develop에 직접 commit한 상태로 발견되면:
  1. 새 `feature/*` 브랜치를 그 시점에서 생성하여 커밋을 옮긴다
  2. 로컬 `develop`을 `git reset --hard origin/develop`으로 되돌린다
  3. 새 브랜치를 push하고 PR 생성
- `git push origin develop` 명령은 **절대 실행하지 않는다** (ruleset이 거부함, 시도 자체가 워크플로우 위반)

## PR 머지

- **본인이 작성한 PR을 본인이 머지하지 않는다.** Ruleset이 승인 0개를 허용하더라도 다른 팀원의 리뷰/승인을 기다린다
- 사용자가 명시적으로 "PR 올리고 병합"을 함께 요청한 경우에 한해 본인 머지 가능. 이 경우에도 사용자에게 확인 후 진행
- 머지 방식은 **squash 권장** (linear history 유지). merge commit 방식 금지
- 머지 후 feature 브랜치는 자동 삭제 (`gh pr merge --delete-branch`)
- 머지 후 로컬 develop은 `git fetch && git reset --hard origin/develop`으로 동기화 (squash 특성상 로컬/원격 SHA가 분기되므로)

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

## PR 본문 수정 시

- 기존 PR 본문에 사용자가 추가한 이미지/스크린샷을 절대 삭제하지 않는다
- `gh pr edit --body` 사용 시, 먼저 기존 body를 `gh pr view --json body`로 읽고 이미지 태그를 보존한다
- 변경 사항/변경 이유 등 텍스트 섹션만 업데이트한다

## 스킬 자동 호출

- 커밋/푸시 요청 시: 직접 `git commit`하지 말고 반드시 `/commit` 스킬을 호출한다
- 새 기능 개발 요청 시 (개발해줘, 구현해줘, 만들어줘, 피그마 보고 구현 등): `/develop` 스킬을 호출한다
- 슬래시 커맨드를 사용자가 직접 입력하지 않아도, 키워드가 매칭되면 자동 호출해야 한다
- `/develop` 없이 직접 코드를 작성하면 planner/reviewer 파이프라인을 우회하게 되어 룰 위반이 발생한다

## 커밋

- 한국어 커밋 메시지 사용
- 접두사 필수: `feat:`, `fix:`, `refactor:`, `design:`, `style:`, `comment:`, `test:`, `chore:`, `init:`, `rename:`, `remove:`
- 논리적으로 분리 가능한 변경은 여러 커밋으로 분할
- `.env*` 파일이 포함되어 있으면 경고 후 제외
