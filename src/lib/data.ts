import { readTab, isSheetConfigured, type SheetRow } from "./sheets";

export { isSheetConfigured };

/**
 * Google Sheet 의 탭 이름. 시트의 각 시트(탭) 이름을 이 값과 정확히 일치시켜야 한다.
 * (셋업 가이드 / 시드 CSV 의 파일명과도 일치)
 */
export const TABS = {
  schedule: "일정",
  people: "명단",
  teams: "섬김조",
  tf: "TF배정",
  checklist: "체크리스트",
  budget: "예산",
} as const;

// ── 일정 ────────────────────────────────────────────────
export interface ScheduleRow {
  일자: string;
  시간대: string;
  시간: string;
  프로그램: string;
  장소: string;
  담당: string;
  비고: string;
}
export async function getSchedule(): Promise<ScheduleRow[]> {
  return (await readTab(TABS.schedule)) as unknown as ScheduleRow[];
}

// ── 명단 ────────────────────────────────────────────────
export interface PersonRow {
  이름: string;
  구분: string; // 교역자 / 교사 / 학생 (팀장·스탭 등은 화면에서 교사로 묶음)
  학년: string;
  성별: string;
  섬김조: string;
  TF: string;
  조리팀: string;
  부분참석: string;
  토요미귀가: string;
  비고: string;
}
export async function getPeople(): Promise<PersonRow[]> {
  return (await readTab(TABS.people)) as unknown as PersonRow[];
}

// ── 섬김조 ──────────────────────────────────────────────
export interface TeamRow {
  조: string;
  교사: string;
  학생: string;
  인원: string;
  비고: string;
}
export async function getTeams(): Promise<TeamRow[]> {
  return (await readTab(TABS.teams)) as unknown as TeamRow[];
}

// ── TF 배정 ─────────────────────────────────────────────
export interface TfRow {
  이름: string;
  "1순위": string;
  "2순위": string;
  최종배정: string;
}
export async function getTf(): Promise<TfRow[]> {
  return (await readTab(TABS.tf)) as unknown as TfRow[];
}

// ── 체크리스트 ──────────────────────────────────────────
export interface ChecklistRow {
  번호: string;
  항목: string;
  내용: string;
  담당: string;
  기한: string;
  상태: string; // 미시작 / 진행중 / 완료
}
export async function getChecklist(): Promise<ChecklistRow[]> {
  return (await readTab(TABS.checklist)) as unknown as ChecklistRow[];
}

// ── 예산 ────────────────────────────────────────────────
export interface BudgetRow {
  분류: string;
  항목: string;
  단가: string;
  수량: string;
  금액: string;
  비고: string;
}
export async function getBudget(): Promise<BudgetRow[]> {
  return (await readTab(TABS.budget)) as unknown as BudgetRow[];
}

/** "15,000" / "15000원" 같은 문자열에서 숫자만 추출 */
export function parseAmount(value: string | undefined): number {
  if (!value) return 0;
  const n = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function formatKRW(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

/** 데이터 행 한 묶음에서 일정/체크리스트 진행률 등 요약 통계 */
export function checklistProgress(rows: ChecklistRow[]) {
  const total = rows.length;
  const done = rows.filter((r) => /완료/.test(r.상태)).length;
  const inProgress = rows.filter((r) => /진행/.test(r.상태)).length;
  const notStarted = total - done - inProgress;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, inProgress, notStarted, pct };
}

export type { SheetRow };
