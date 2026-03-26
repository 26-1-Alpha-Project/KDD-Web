---
name: commit
description: 변경사항을 분석하여 프로젝트 커밋 컨벤션에 맞는 커밋을 생성한다. 커밋, commit, 변경사항 저장, 코드 저장, 작업 완료, 커밋해줘, 커밋 해줘 등을 언급할 때 반드시 사용.
---

# 커밋 생성

변경사항을 분석하고 프로젝트 컨벤션에 맞는 커밋을 생성한다.

## 단계

1. `git status`로 변경 파일 확인
2. `git diff --staged`와 `git diff`로 변경 내용 분석
3. 스테이징되지 않은 변경이 있으면 사용자에게 확인 후 `git add`
4. `git log --oneline -5`로 최근 커밋 스타일 참조
5. 변경 내용에 맞는 접두사 결정:
   - 새 기능: `feat:`
   - 버그 수정: `fix:`
   - 리팩토링: `refactor:`
   - UI 디자인 변경: `design:`
   - 코드 포맷팅 (로직 변경 없음): `style:`
   - 주석 추가/변경: `comment:`
   - 테스트: `test:`
   - 빌드/설정/기타: `chore:`
   - 프로젝트 초기 생성: `init:`
   - 파일/폴더 이름 수정 및 이동: `rename:`
   - 파일 삭제: `remove:`
6. `npm run lint` 실행하여 린트 통과 확인
7. 한국어 커밋 메시지로 커밋 생성

## 커밋 메시지 형식

```text
접두사: 간결한 한국어 설명

(선택) 본문 — 변경 이유나 상세 내용

Co-Authored-By: Claude <noreply@anthropic.com>
```

## 예시

```text
feat: 채팅 검색 모달 구현
fix: 사이드바 모바일 오버레이 닫힘 버그 수정
refactor: 더미 데이터를 constants로 분리
design: 채팅 입력창 반응형 패딩 조절
chore: Claude Code 하네스 엔지니어링 설정 추가
rename: ChatBox를 ChatInput으로 변경
```

## 기존 PR 업데이트 + CodeRabbit 리뷰 처리

커밋 + 푸시 후, 현재 브랜치에 열린 PR이 있는지 확인한다:

1. `gh pr list --head <현재브랜치> --state open --json number,title`로 확인
2. 열린 PR이 없으면: 아무것도 하지 않음
3. 열린 PR이 있으면 아래 순서로 처리:

### 3-1. CodeRabbit 리뷰 확인 및 처리

1. `gh api repos/{owner}/{repo}/pulls/{number}/comments`로 CodeRabbit 코멘트 확인
2. 미처리된 CodeRabbit 리뷰가 있으면 각 코멘트를 판단:
   - **Major** (보안, 로직 결함, 권한 범위): 코드 수정 → 추가 커밋 → 푸시
   - **Minor** (lint 경고, 코드 펜스 태그 등): 코드 수정 → 추가 커밋 → 푸시
   - **Nitpick/지엽적** (스타일 선호도): 무시
   - **이미 삭제된 파일**: 무시
3. 수정한 경우 커밋 메시지: `fix: CodeRabbit 리뷰 반영`

### 3-2. PR 본문 업데이트

1. `git diff develop...HEAD --stat`과 `git log develop..HEAD --oneline`으로 전체 변경 범위 재분석
2. PR 본문의 **변경 사항**, **변경 이유** 섹션을 현재 전체 커밋 내용에 맞게 업데이트
3. `gh pr edit <번호> --body`로 반영
4. 조직 PR 템플릿 형식 유지 (PR 유형, 관련 이슈, 작업 내용, 스크린샷, 체크리스트, 리뷰어 메모)

## 주의사항

- 논리적으로 분리 가능한 변경은 여러 커밋으로 분할
- `.env*` 파일이 포함되어 있으면 경고 후 제외
- `console.log`가 남아있으면 사용자에게 알림
