"use client";

import { useState } from "react";
import type { Task } from "@/lib/dashboard";
import { isUrgent } from "@/lib/status";
import Chips from "./Chips";
import StatusBadge from "./StatusBadge";

export default function TasksView({
  tasks,
  chips,
}: {
  tasks: Task[];
  chips: string[];
}) {
  const [filter, setFilter] = useState("전체");

  const visible = tasks
    .filter((t) => {
      if (filter === "전체") return true;
      if (filter === "완료") return t.status === "완료";
      return t.team === filter;
    })
    .sort(
      (a, b) => (a.status === "완료" ? 1 : 0) - (b.status === "완료" ? 1 : 0),
    );

  return (
    <div className="mx-auto w-full max-w-[480px] animate-fade-up px-4">
      <Chips items={chips} active={filter} onSelect={setFilter} />

      <div className="flex flex-col gap-2.5">
        {visible.map((t, i) => {
          const done = t.status === "완료";
          const urgent = isUrgent(t.status);
          return (
            <div
              key={i}
              className="rounded-2xl border bg-white px-[15px] py-3.5 shadow-[0_1px_2px_rgba(47,93,80,0.04)]"
              style={{
                borderColor: t.status === "위험" ? "#EFD3CC" : "#EFEAE0",
                opacity: done ? 0.6 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-md bg-[#EAF0EC] px-1.5 py-0.5 text-[10.5px] font-bold text-[#2F5D50]">
                    {t.team}
                  </span>
                  <div
                    className="mt-1.5 text-[14.5px] leading-snug font-bold text-[#23211E]"
                    style={{ textDecoration: done ? "line-through" : "none" }}
                  >
                    {t.title}
                  </div>
                </div>
                <StatusBadge status={t.status} />
              </div>

              <div className="mt-2.5 flex items-center gap-3 text-[12px] text-[#6B7280]">
                <span className="flex items-center gap-1">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#A8A29A"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="8" r="3.4" />
                    <path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6" />
                  </svg>
                  {t.owner}
                </span>
                <span
                  className="flex items-center gap-1"
                  style={{
                    color: urgent ? "#BB4E42" : "#6B7280",
                    fontWeight: urgent ? 700 : 500,
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <rect x="3" y="4.5" width="18" height="17" rx="3" />
                    <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
                  </svg>
                  {t.due}
                  {urgent ? " · 임박" : ""}
                </span>
              </div>

              {t.memo && (
                <div className="mt-2.5 flex gap-1.5 rounded-lg bg-[#F7F4EC] px-2.5 py-2 text-[12px] leading-snug text-[#6B5E50]">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B7AE9C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="mt-0.5 shrink-0"
                  >
                    <path d="M4 5h16M4 10h16M4 15h10" />
                  </svg>
                  <span>{t.memo}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
