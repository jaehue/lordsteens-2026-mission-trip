import ScreenHeader from "@/components/ScreenHeader";
import TasksView from "@/components/TasksView";
import { getTasks, TASK_CHIPS } from "@/lib/dashboard";

export default function TasksPage() {
  return (
    <>
      <ScreenHeader title="괴산 선교 출발 전 담당 업무" />
      <div className="mx-auto w-full max-w-[480px] px-4">
        <section className="rounded-2xl border border-[#EFEAE0] bg-white px-4 py-3.5 text-[13px] leading-relaxed text-[#4B4944] shadow-[0_1px_2px_rgba(47,93,80,0.04)]">
          <p>
            담당하신 분들은 <strong className="font-extrabold text-[#23211E]">출발 전 완료 여부와 확인 내용을 본부팀 시트에 남겨주세요.</strong>
          </p>
          <p className="mt-1.5">담당자가 비어 있는 항목은 오늘 중으로 담당자를 정해야 합니다.</p>
          <p className="mt-2.5 rounded-lg bg-[#EAF0EC] px-2.5 py-2 font-bold text-[#2F5D50]">
            김다안 학생은 조규섭 선생님 차량으로 오기로 했습니다.
          </p>
        </section>
      </div>
      <TasksView tasks={getTasks()} chips={TASK_CHIPS} />
    </>
  );
}
