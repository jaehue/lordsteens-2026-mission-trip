"use client";

import { useState } from "react";
import type { Team } from "@/lib/dashboard";
import Chips from "./Chips";
import StatusBadge from "./StatusBadge";

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#B7B1A4"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 transition-transform duration-200"
      style={{ transform: open ? "rotate(180deg)" : "none" }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function TeamsView({
  teams,
  chips,
}: {
  teams: Team[];
  chips: string[];
}) {
  const [filter, setFilter] = useState("전체");
  const [expanded, setExpanded] = useState<string | null>("조리팀");

  const visible = teams.filter((t) => filter === "전체" || t.key === filter);

  // 필터칩으로 특정 팀을 고르면 그 팀을 자동으로 펼친다
  function handleSelect(key: string) {
    setFilter(key);
    const team = teams.find((t) => t.key === key);
    if (team) setExpanded(team.name);
  }

  return (
    <div className="mx-auto w-full max-w-[480px] animate-fade-up px-4">
      <Chips items={chips} active={filter} onSelect={handleSelect} />

      <div className="flex flex-col gap-3">
        {visible.map((t) => {
          const open = expanded === t.name;
          return (
            <div
              key={t.name}
              className="overflow-hidden rounded-2xl border border-[#EFEAE0] bg-white shadow-[0_1px_2px_rgba(47,93,80,0.04)]"
            >
              <button
                type="button"
                onClick={() => setExpanded(open ? null : t.name)}
                className="flex w-full items-center gap-3 p-[15px] text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF0EC] text-[17px]">
                  {t.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-extrabold text-[#23211E]">
                      {t.name}
                    </span>
                    <StatusBadge status={t.status} />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E6A23C"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                    <span className="text-[12.5px] font-bold text-[#2F5D50]">
                      남은 액션 {t.next.length}개
                    </span>
                  </div>
                </div>
                <Caret open={open} />
              </button>

              {open && (
                <div className="px-[15px] pb-4">
                  <div className="mb-3 rounded-xl bg-[#F7F4EC] px-[13px] py-[11px]">
                    <span className="text-[11px] font-bold text-[#9A958A]">
                      현재 방향
                    </span>
                    <div className="mt-1.5 flex flex-col gap-0.5">
                      {t.direction.map((d, i) => (
                        <div
                          key={i}
                          className="text-[13px] leading-snug font-semibold text-[#3A3833]"
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>

                  <ListBlock
                    color="#2E7D52"
                    label="확정된 것"
                    items={t.confirmed}
                    icon="check"
                  />
                  <ListBlock
                    color="#E6A23C"
                    labelColor="#B0703A"
                    label="미확정 · 확인 필요"
                    items={t.pending}
                    icon="alert"
                  />

                  <div className="rounded-xl bg-[#2F5D50] px-[13px] py-3">
                    <div className="mb-2 flex items-center gap-1.5">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#E6A23C"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h13M13 6l6 6-6 6" />
                      </svg>
                      <span className="text-[12px] font-extrabold text-[#E6C88A]">
                        다음 액션
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {t.next.map((x, i) => (
                        <div
                          key={i}
                          className="flex gap-2 text-[13px] leading-snug font-semibold text-[#FBF7EE]"
                        >
                          <span className="text-[#E6A23C]">·</span>
                          <span>{x}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListBlock({
  color,
  labelColor,
  label,
  items,
  icon,
}: {
  color: string;
  labelColor?: string;
  label: string;
  items: string[];
  icon: "check" | "alert";
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-3">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span
          className="h-[7px] w-[7px] rounded-full"
          style={{ background: color }}
        />
        <span
          className="text-[12px] font-extrabold"
          style={{ color: labelColor ?? color }}
        >
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((x, i) => (
          <div
            key={i}
            className="flex gap-2 text-[13px] leading-snug text-[#3A3833]"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0"
            >
              {icon === "check" ? (
                <path d="M5 12.5l4.5 4.5L19 6.5" />
              ) : (
                <>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4.5M12 16h.01" />
                </>
              )}
            </svg>
            <span>{x}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
