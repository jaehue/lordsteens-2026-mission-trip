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
사용자가 **openbrain**(`~/workspace/openbrain`, Obsidian 동기화 노트)에 선교 진행상황을 업데이트한다.
→ Claude 가 openbrain 을 읽고 이 사이트의 `content/dashboard/*.md` (및 `content/*.md`) 를 갱신해 반영한다.
→ commit/push 시 Vercel 재배포로 사이트에 반영 (정적 페이지는 재빌드 시 md 변경 반영, dev 에서는 즉시).

## 화면
홈 `/` · 팀별 현황 `/teams` · 할 일 `/tasks` · 일정 `/schedule` · 자료 `/resources` ·
명단 `/people`(시트) · 디자인 시스템 `/design-system`. 하단 5탭 고정(홈/팀별/할일/일정/자료).

## 규칙
- 완료 검증: 코드만 보고 판단 금지. dev 서버 + 스크린샷/데이터로 확인.
- push 는 명시적 요청 시에만.
