import Link from "next/link";
import ScreenHeader from "@/components/ScreenHeader";
import WeekChecklist from "@/components/WeekChecklist";
import StatusBadge from "@/components/StatusBadge";
import {
  getOverview,
  getTasks,
  taskStats,
} from "@/lib/dashboard";
import { isUrgent } from "@/lib/status";

export const revalidate = 300;

export default function HomePage() {
  const overview = getOverview();
  const tasks = getTasks();
  const stats = taskStats(tasks);
  const activeTasks = tasks.filter((t) => t.status !== "완료");
  const urgent = tasks.filter((t) => isUrgent(t.status)).slice(0, 4);

  return (
    <>
      <ScreenHeader title="홈" width="wide" />

      <div className="mx-auto w-full max-w-[480px] animate-fade-up px-4 lg:max-w-5xl">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#356458_0%,#2A4F45_100%)] p-6 text-[#FBF7EE]">
          <div className="absolute -top-7 -right-7 h-32 w-32 rounded-full bg-[rgba(230,162,60,0.16)]" />
          <div className="relative">
            <span className="text-[11.5px] font-bold tracking-wide text-[#E6C88A]">
              {overview.church}
            </span>
            <div className="mt-1.5 text-[26px] font-extrabold tracking-tight">
              {overview.title}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[14px] font-semibold text-[#E8E2D2]">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E6A23C"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="3" y="4.5" width="18" height="17" rx="3" />
                <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
              </svg>
              {overview.dateLabel} · {overview.dateSub}
            </div>
            <div className="my-3.5 h-px bg-[rgba(251,247,238,0.18)]" />
            <span className="text-[11.5px] font-bold text-[#E6C88A]">
              현재 단계
            </span>
            <div className="mt-1 text-[13.5px] leading-relaxed font-semibold text-[#FBF7EE]">
              {overview.currentStage}
            </div>
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-1 gap-3.5 lg:mt-4 lg:grid-cols-3 lg:gap-4 lg:items-start">
          {/* Column 1 */}
          <div className="flex flex-col gap-3.5 lg:gap-4">
            {/* 남은 할일 */}
            <div className="flex items-center gap-[18px] rounded-[18px] border border-[#EFEAE0] bg-white p-[18px] shadow-[0_1px_2px_rgba(47,93,80,0.04)]">
              <div className="flex shrink-0 flex-col items-center leading-none">
                <span className="text-[44px] font-extrabold tracking-tight text-[#2F5D50]">
                  {stats.remaining}
                </span>
                <span className="mt-1.5 text-[11px] font-bold text-[#9A958A]">
                  남은 할일
                </span>
              </div>
              <div className="flex-1">
                <div className="mb-0.5 text-[13.5px] font-bold text-[#3A3833]">
                  지금 챙겨야 할 준비 항목이에요
                </div>
                <div className="mb-2.5 text-[12px] leading-snug text-[#6B7280]">
                  {overview.intro}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8E2DD] px-2.5 py-1 text-[11.5px] font-bold text-[#BB4E42]">
                    마감 임박 {stats.urgent}건
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F0E8] px-2.5 py-1 text-[11.5px] font-bold text-[#2E7D52]">
                    완료 {stats.done}개
                  </span>
                </div>
              </div>
            </div>

            {/* 이번 주 핵심 */}
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[14px] font-extrabold text-[#23211E]">
                  이번 주 핵심
                </span>
                <span className="rounded-full bg-[#FAEEDA] px-2 py-0.5 text-[11px] font-bold text-[#B0703A]">
                  {overview.weekDeadline}
                </span>
              </div>
              <WeekChecklist items={overview.thisWeek} />
            </Card>
          </div>

          {/* Column 2: 출발 전 담당 현황 */}
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[14px] font-extrabold text-[#23211E]">
                출발 전 담당 현황
              </span>
              <Link
                href="/tasks"
                className="flex items-center gap-0.5 text-[12px] font-bold text-[#2F5D50]"
              >
                전체 보기 ›
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {activeTasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[#F7F4EC] p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-extrabold text-[#23211E]">
                      {task.title}
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-[#6B7280]">
                      {task.owner} · {task.due}
                    </div>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          </Card>

          {/* Column 3 */}
          <div className="flex flex-col gap-3.5 lg:gap-4">
            {/* 출발 안내 */}
            <Card>
              <span className="text-[14px] font-extrabold text-[#23211E]">
                출발 안내
              </span>
              <div className="mt-3 rounded-xl bg-[#F7F4EC] p-3 text-[12px] leading-relaxed text-[#4B4944]">
                {overview.intro}
              </div>
              <div className="mt-2 rounded-xl bg-[#EAF0EC] p-3 text-[12px] font-bold leading-relaxed text-[#2F5D50]">
                김다안 학생은 조규섭 선생님 차량으로 오기로 했습니다.
              </div>
            </Card>

            {/* 임박 할 일 */}
            <Card>
              <span className="text-[14px] font-extrabold text-[#23211E]">
                임박 할 일
              </span>
              <div className="mt-3 flex flex-col gap-2.5">
                {urgent.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-bold text-[#23211E]">
                        {t.title}
                      </div>
                      <div className="mt-px text-[11px] text-[#9A958A]">
                        {t.team} · {t.due}
                      </div>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* CTA (모바일) */}
        <div className="mt-4 flex gap-2.5 lg:hidden">
          <Link
            href="/teams"
            className="flex-1 rounded-[13px] bg-[#2F5D50] py-3.5 text-center text-[13.5px] font-bold text-[#FBF7EE]"
          >
            팀별 현황 보기
          </Link>
          <Link
            href="/tasks"
            className="flex-1 rounded-[13px] border-[1.5px] border-[#D8E4DD] bg-white py-3.5 text-center text-[13.5px] font-bold text-[#2F5D50]"
          >
            전체 할 일 보기
          </Link>
        </div>
      </div>
    </>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] border border-[#EFEAE0] bg-white p-[18px] shadow-[0_1px_2px_rgba(47,93,80,0.04)]">
      {children}
    </div>
  );
}
