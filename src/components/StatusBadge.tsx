import { statusStyle } from "@/lib/status";

/** 상태 배지 (점 + 라벨). 목업의 status pill 과 동일. */
export default function StatusBadge({
  status,
  size = "sm",
}: {
  status: string;
  size?: "xs" | "sm";
}) {
  const c = statusStyle(status);
  const pad = size === "xs" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[10.5px]";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full font-bold whitespace-nowrap ${pad}`}
      style={{ background: c.bg, color: c.fg }}
    >
      <span
        className="h-[5px] w-[5px] rounded-full"
        style={{ background: c.dot }}
      />
      {status}
    </span>
  );
}
