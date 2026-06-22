import { getTasks, taskStats } from "@/lib/dashboard";

/**
 * 각 화면 상단 헤더: 화면 제목 + "남은 할일 N개" 배지.
 * 남은 할일 수는 tasks.md 에서 서버에서 계산한다.
 */
export default function ScreenHeader({
  title,
  width = "narrow",
}: {
  title: string;
  width?: "narrow" | "wide";
}) {
  const { remaining } = taskStats(getTasks());
  const max = width === "wide" ? "max-w-5xl" : "max-w-[480px]";

  return (
    <div className={`mx-auto w-full ${max} px-4 pt-6 pb-2`}>
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-extrabold tracking-tight text-[#23211E]">
          {title}
        </h1>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8E4DD] bg-[#EAF0EC] px-2.5 py-1.5 text-[11px] font-bold text-[#2F5D50]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E6A23C]" />
          남은 할일 {remaining}개
        </span>
      </div>
    </div>
  );
}
