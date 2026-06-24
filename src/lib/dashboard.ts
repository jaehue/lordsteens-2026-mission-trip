import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { formatDate } from "./date";

/**
 * 대시보드의 "준비현황" 콘텐츠는 content/dashboard/*.md 의 YAML frontmatter 로 관리한다.
 * (참가자 명단만 Google Sheet, 나머지는 모두 md)
 * 사용자가 openbrain 에 진행상황을 업데이트하면 이 md 들을 갱신해 사이트에 반영한다.
 *
 * 이 모듈은 각 md 를 읽어 타입드 객체로 돌려주고, 목업 support.js 의 renderVals() 가
 * 하던 파생값 계산(남은 할일 수·필터·정렬 등)을 서버에서 수행한다.
 */

const DIR = path.join(process.cwd(), "content", "dashboard");

function read(name: string): Record<string, unknown> {
  const file = path.join(DIR, `${name}.md`);
  if (!fs.existsSync(file)) return {};
  return matter(fs.readFileSync(file, "utf8")).data as Record<string, unknown>;
}

// ── overview ────────────────────────────────────────────
export interface Overview {
  title: string;
  church: string;
  dateLabel: string;
  dateSub: string;
  currentStage: string;
  stageShort: string;
  weekDeadline: string;
  intro: string;
  thisWeek: string[];
}

export function getOverview(): Overview {
  const d = read("overview");
  return {
    title: String(d.title ?? "단기선교"),
    church: String(d.church ?? ""),
    dateLabel: String(d.dateLabel ?? ""),
    dateSub: String(d.dateSub ?? ""),
    currentStage: String(d.currentStage ?? ""),
    stageShort: String(d.stageShort ?? ""),
    weekDeadline: String(d.weekDeadline ?? ""),
    intro: String(d.intro ?? ""),
    thisWeek: (d.thisWeek as string[]) ?? [],
  };
}

// ── teams (TF) ──────────────────────────────────────────
export interface Team {
  name: string;
  emoji: string;
  key: string;
  status: string;
  members: string[];
  headcount: string;
  /** 본부 관점 현재 상태 한 줄 (openbrain "현재 상태" 원문) */
  state: string;
  /** 논의된 내용 (openbrain "진행된 내용 / 주요 방향" 원문) */
  direction: string[];
  /** 확인 필요 (openbrain "본부가 확인할 것 / 확인 필요사항" 원문, 임의 축소 금지) */
  checks: string[];
}

export function getTeams(): Team[] {
  const d = read("teams");
  return ((d.teams as Partial<Team>[]) ?? []).map((t) => ({
    name: String(t.name ?? ""),
    emoji: String(t.emoji ?? "📌"),
    key: String(t.key ?? t.name ?? ""),
    status: String(t.status ?? "대기"),
    members: t.members ?? [],
    headcount: String(t.headcount ?? ""),
    state: String(t.state ?? ""),
    direction: t.direction ?? [],
    checks: t.checks ?? [],
  }));
}

/** 팀별 현황 필터칩 라벨 (전체 + 각 팀 key) */
export function teamChips(teams: Team[]): string[] {
  return ["전체", ...teams.map((t) => t.key)];
}

// ── tasks (할 일) ───────────────────────────────────────
export interface Task {
  team: string;
  title: string;
  owner: string;
  due: string;
  status: string;
  memo: string;
}

export function getTasks(): Task[] {
  const d = read("tasks");
  return ((d.tasks as Partial<Task>[]) ?? []).map((t) => ({
    team: String(t.team ?? ""),
    title: String(t.title ?? ""),
    owner: String(t.owner ?? ""),
    due: formatDate(t.due),
    status: String(t.status ?? "대기"),
    memo: String(t.memo ?? ""),
  }));
}

export interface TaskStats {
  remaining: number;
  urgent: number;
  done: number;
}

export function taskStats(tasks: Task[]): TaskStats {
  return {
    remaining: tasks.filter((t) => t.status !== "완료").length,
    urgent: tasks.filter((t) => t.status === "위험" || t.status === "확인필요")
      .length,
    done: tasks.filter((t) => t.status === "완료").length,
  };
}

/** 할 일 필터칩 라벨 */
export const TASK_CHIPS = [
  "전체",
  "본부",
  "조리",
  "현장봉사",
  "마을잔치",
  "예배&나눔",
  "행정&안전",
  "완료",
];

// ── schedule (일정) ─────────────────────────────────────
export interface ScheduleItem {
  time: string;
  title: string;
  place: string;
  team: string;
  status: string;
  note: string;
}
export interface ScheduleDay {
  dayNum: string;
  dow: string;
  label: string;
  sub: string;
  items: ScheduleItem[];
}

export function getSchedule(): ScheduleDay[] {
  const d = read("schedule");
  return ((d.days as Partial<ScheduleDay>[]) ?? []).map((day) => ({
    dayNum: String(day.dayNum ?? ""),
    dow: String(day.dow ?? ""),
    label: String(day.label ?? ""),
    sub: String(day.sub ?? ""),
    items: (day.items as ScheduleItem[]) ?? [],
  }));
}

// ── updates (최근 업데이트) ─────────────────────────────
export interface Update {
  date: string;
  title: string;
  content: string;
}

export function getUpdates(): Update[] {
  const d = read("updates");
  return ((d.updates as Update[]) ?? []).map((u) => ({
    date: formatDate(u.date),
    title: String(u.title ?? ""),
    content: String(u.content ?? ""),
  }));
}

// ── resources (자료) ────────────────────────────────────
export interface DocItem {
  name: string;
  type: string;
  date: string;
  pinned: boolean;
  ready: boolean;
  slug?: string;
  href?: string;
}

/**
 * 자료 날짜 문자열을 정렬용 숫자(YYYYMMDD)로 파싱한다.
 * "2026.06.23"(Date 정규화) / "6/23"(M/D, 연도 없으면 2026 가정) 지원.
 * "준비중" 등 파싱 불가는 null → 목록 맨 아래로.
 */
function docDateKey(date: string): number | null {
  let m = date.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})$/);
  if (m) return +m[1] * 10000 + +m[2] * 100 + +m[3];
  m = date.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (m) return 2026 * 10000 + +m[1] * 100 + +m[2];
  return null;
}

export function getResources(): DocItem[] {
  const d = read("resources");
  const docs = ((d.docs as Partial<DocItem>[]) ?? []).map((doc) => ({
    name: String(doc.name ?? ""),
    type: String(doc.type ?? "DOC"),
    date: formatDate(doc.date),
    pinned: Boolean(doc.pinned),
    ready: Boolean(doc.ready),
    slug: doc.slug ? String(doc.slug) : undefined,
    href: doc.href ? String(doc.href) : undefined,
  }));
  // 최신순(날짜 내림차순). 파싱 불가 날짜는 맨 아래, 동일 날짜는 기존 순서 유지(안정 정렬).
  return docs
    .map((doc, i) => ({ doc, i, key: docDateKey(doc.date) }))
    .sort((a, b) => {
      if (a.key === null && b.key === null) return a.i - b.i;
      if (a.key === null) return 1;
      if (b.key === null) return -1;
      return b.key - a.key || a.i - b.i;
    })
    .map((x) => x.doc);
}

/** ready 인 자료의 최종 링크 (내부 문서 slug → /resources/<slug>, 아니면 href) */
export function docLink(doc: DocItem): string | undefined {
  if (!doc.ready) return undefined;
  if (doc.slug) return `/resources/${encodeURIComponent(doc.slug)}`;
  return doc.href;
}
