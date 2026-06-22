"use client";

import { useState } from "react";

/** 이번 주 핵심 체크리스트. 체크는 임시(클라이언트) 상태 — 실제 확정은 md 갱신으로 반영. */
export default function WeekChecklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  return (
    <div className="flex flex-col gap-0.5">
      {items.map((text, i) => {
        const on = !!checked[i];
        return (
          <button
            key={i}
            type="button"
            onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
            className="flex w-full items-center gap-3 py-2 text-left"
          >
            <span
              className="flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-[7px] border-2"
              style={{
                borderColor: on ? "#2F5D50" : "#CFC8B8",
                background: on ? "#2F5D50" : "#FFFFFF",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: on ? 1 : 0 }}
              >
                <path d="M5 12.5l4.5 4.5L19 6.5" />
              </svg>
            </span>
            <span
              className="text-[13.5px] font-semibold"
              style={{
                color: on ? "#9A958A" : "#3A3833",
                textDecoration: on ? "line-through" : "none",
              }}
            >
              {text}
            </span>
          </button>
        );
      })}
    </div>
  );
}
