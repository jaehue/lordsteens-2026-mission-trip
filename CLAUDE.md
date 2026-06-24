# 2026 괴산 단기선교 준비 현황판

주님의교회 청소년부 **2026 괴산 단기선교(8.6 목–8.8 토, 2박 3일)** 준비 현황 대시보드.
claude.ai/design 목업 `괴산 단기선교 준비현황판.dc.html` 을 실제 앱으로 구현한 것.

## 스택
Next.js 16 (App Router) · React 19 · Tailwind v4 · gray-matter · googleapis · react-markdown.
Vercel 배포 대상. 반응형(모바일↔데스크톱 자동).

## 데이터 아키텍처
- **참가자 명단 = Google Sheet** (서비스 계정, 읽기 전용). `src/lib/sheets.ts` + `src/lib/data.ts`.
  - `.env.local`: `GOOGLE_SHEET_ID` / `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY` (레포 밖, git 미추적).
- **나머지 준비현황 콘텐츠 = 마크다운**.
  - `content/dashboard/*.md` (YAML frontmatter): `overview` · `teams`(TF) · `tasks` · `schedule` · `updates` · `resources`. 로더는 `src/lib/dashboard.ts`.
  - `content/*.md` (prose, gray-matter): 운영계획 · 회의록 · 공지 → 자료 상세(`/resources/<slug>`). 로더는 `src/lib/content.ts`.
- 상태→색상 토큰: `src/lib/status.ts` (완료/진행중/확인필요/위험/지연/대기/논의중/미확정).

## 운영 워크플로우 (중요)
사용자가 괴산 단기선교 관련 새 내용을 올리면 다음을 **항상 함께 수행**한다.

1. 새 내용을 **openbrain**(`~/workspace/openbrain`, Obsidian 동기화 노트)에 기록한다.
2. openbrain 및 사용자가 올린 최신 내용을 근거로 이 사이트의 `content/dashboard/*.md` 및 `content/*.md`를 갱신한다.
3. 단순히 회의록/새 문서만 추가하지 말고, 전체 상태를 보고 기존 md를 최신 상태로 **재조정(reconcile)** 한다.
   - `content/dashboard/overview.md`: 현재 단계, 이번 주 핵심
   - `content/dashboard/teams.md`: TF별 상태/방향/확인사항
   - `content/dashboard/tasks.md`: 할 일/담당/상태
   - `content/dashboard/schedule.md`: 일정 변경
   - `content/dashboard/updates.md`: 최근 업데이트
   - `content/dashboard/resources.md`: 자료 목록
   - `content/*.md`: 운영계획, 회의록, 체크리스트 등 상세 문서
4. `content/AGENTS.md`의 규칙을 따른다: 추측 금지, 격상 금지, 누락 금지, 출처 추적.
5. commit/push 시 Vercel 재배포로 사이트에 반영한다. push는 사용자 명시 요청 시에만 한다.

## 자료 운영 원칙 (투명성 + 단일 종합본)
목적: **전체 팀원이 준비 과정을 투명하게 보게 한다.** 다만 모두가 회의록을 하나하나 읽긴 번거로우므로, 핵심 흐름은 두 갈래로 유지한다.
- **회의록(보존·투명성):** 회의/논의가 있을 때마다 `content/<날짜>-회의록.md`로 그날 원문을 등록한다(예: `0618-회의록.md`, `0621-회의록.md`). 지나간 기록은 고치지 않고 그대로 남긴다.
- **최종 운영 계획(단일 종합본):** `content/운영계획.md` **한 문서**에 모든 회의록·논의·확정 사항을 종합한 **최신 상태**를 항상 유지한다. 새 회의록을 등록하면 반드시 이 문서도 재조정해 "지금까지의 모든 것의 최종 상태"가 되게 한다. `date`/`summary`도 최신 반영일로 갱신한다.
- 새 내용이 들어오면: ① 날짜별 회의록 등록 → ② 최종 운영 계획 재조정 → ③ `content/dashboard/*.md`(overview·teams·tasks·updates 등) 동기화. 셋을 항상 함께 한다.

## 화면
홈 `/` · 팀별 현황 `/teams` · 할 일 `/tasks` · 일정 `/schedule` · 자료 `/resources` ·
명단 `/people`(시트) · 디자인 시스템 `/design-system`. 하단 5탭 고정(홈/팀별/할일/일정/자료).

## 규칙
- 완료 검증: 코드만 보고 판단 금지. dev 서버 + 스크린샷/데이터로 확인.
- push 는 명시적 요청 시에만.
