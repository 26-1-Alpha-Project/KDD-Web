---
name: develop
description: 기능 개발을 Plan → Implement → Review 에이전트 체이닝으로 체계적으로 수행한다. 기능 개발, 기능 구현, 개발해줘, 만들어줘, 피그마 보고 구현해줘 등을 언급할 때 사용. 단순 수정이 아닌 새로운 기능이나 페이지를 만들 때 특히 유용.
argument-hint: "[기능 설명 또는 Figma URL]"
---

# 멀티 에이전트 개발 파이프라인

3개의 독립 에이전트가 순서대로 실행된다. 각 에이전트는 자체 컨텍스트에서 동작하여 역할이 분리된다.

## Pipeline

```text
@planner → 사용자 승인 → @implementer → @code-reviewer
```

## Stage 1: Plan (@planner 에이전트)

`@planner`를 스폰하여 다음을 수행:
- 요구사항 분석
- 기존 코드베이스 탐색 (재사용 가능한 컴포넌트/훅/유틸/타입)
- 구현 계획서 작성 (생성/수정할 파일, 재사용할 코드, 구현 순서)

### API 호출이 포함되는 기능이면 반드시 포함

기능이 백엔드 API를 호출한다면 planner는 계획서에 아래 항목을 **명시적으로** 포함해야 한다.

1. 사용하는 엔드포인트의 **노션 원본 명세** 경로 (`.claude/docs/api-info/*.md`)
2. **요약 명세** 섹션 (`.claude/docs/api-{도메인}.md`)
3. 연결할 **백엔드 Controller/DTO 파일 경로** (`d:/GIthub/kdd-api/src/...`)
4. 프론트 요청 경로는 `/api/backend/*` 또는 `apiClient`/서비스 함수 경유임을 확인
5. 응답 필드 중 **프론트가 "그대로 사용해야 하는 값"** (예: `fileUrl`) 식별

근거 없이 URL을 조합하거나 필드명을 추측하지 않는다. `.claude/rules/api.md`의 "API 기능 구현 전 체크리스트"를 따른다.

planner의 프롬프트에 사용자의 원본 요청을 그대로 전달한다.
Figma URL이 포함된 경우 planner에게도 전달한다.

planner가 계획서를 반환하면 **사용자에게 보여주고 승인을 받는다**.
승인 없이 다음 단계로 넘어가지 않는다.

## Stage 2: Implement (@implementer 에이전트)

사용자가 계획을 승인하면 `@implementer`를 스폰:
- planner의 계획서 전문을 프롬프트에 포함
- 사용자의 원본 요청도 함께 전달
- Figma URL이 있으면 디자인 컨텍스트를 참조하라고 지시

implementer는 계획서 범위 내에서만 코드를 작성한다.

## Stage 3: Review (@code-reviewer 에이전트)

implementer가 완료되면 `@code-reviewer`를 스폰:
- `git diff`로 변경사항 리뷰
- 프로젝트 규칙 준수 확인
- [필수 수정] / [권장] / [참고] 분류

## 리뷰 결과 처리

- [필수 수정] 항목이 있으면: 해당 내용을 수정하고, 다시 `@code-reviewer` 실행
- [권장] 항목만 있으면: 사용자에게 보여주고 수정 여부 확인
- [참고] 만 있으면: 사용자에게 결과 보고 후 완료

## 단순 수정에는 사용하지 않는다

다음은 파이프라인 없이 바로 작업:
- 텍스트/스타일 수정
- 원인이 명확한 버그 수정
- 기존 컴포넌트에 작은 prop 추가
