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

## 주의사항
- 논리적으로 분리 가능한 변경은 여러 커밋으로 분할
- `.env*` 파일이 포함되어 있으면 경고 후 제외
- `console.log`가 남아있으면 사용자에게 알림
