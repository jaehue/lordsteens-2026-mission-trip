import ScreenHeader from "@/components/ScreenHeader";
import TasksView from "@/components/TasksView";
import { getTasks, TASK_CHIPS } from "@/lib/dashboard";

export default function TasksPage() {
  return (
    <>
      <ScreenHeader title="할 일" />
      <TasksView tasks={getTasks()} chips={TASK_CHIPS} />
    </>
  );
}
