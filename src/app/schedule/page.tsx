import ScreenHeader from "@/components/ScreenHeader";
import StatusBadge from "@/components/StatusBadge";
import { getSchedule } from "@/lib/dashboard";
import { statusStyle } from "@/lib/status";

export default function SchedulePage() {
  const days = getSchedule();

  return (
    <>
      <ScreenHeader title="일정" />
      <div className="mx-auto flex w-full max-w-[480px] animate-fade-up flex-col gap-5 px-4">
        {days.map((day) => (
          <section key={day.dayNum}>
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#2F5D50] text-[#FBF7EE]">
                <span className="text-[17px] leading-none font-extrabold">
                  {day.dayNum}
                </span>
                <span className="mt-0.5 text-[10px] font-bold text-[#E6C88A]">
                  {day.dow}
                </span>
              </div>
              <div>
                <div className="text-[15px] font-extrabold text-[#23211E]">
                  {day.label}
                </div>
                <div className="text-[11.5px] font-semibold text-[#9A958A]">
                  {day.sub}
                </div>
              </div>
            </div>

            <div className="flex flex-col pl-1.5">
              {day.items.map((it, i) => {
                const dot = statusStyle(it.status).dot;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex w-[46px] shrink-0 flex-col items-center">
                      <span className="mt-px text-[12px] font-extrabold text-[#2F5D50]">
                        {it.time}
                      </span>
                      <span
                        className="mt-1.5 h-[11px] w-[11px] rounded-full bg-[#FAF7F0]"
                        style={{ border: `2.5px solid ${dot}` }}
                      />
                      {i < day.items.length - 1 && (
                        <span className="my-0.5 min-h-3.5 w-0.5 flex-1 bg-[#E6DFD0]" />
                      )}
                    </div>
                    <div className="mb-2.5 flex-1 rounded-[13px] border border-[#EFEAE0] bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(47,93,80,0.04)]">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[14px] font-bold text-[#23211E]">
                          {it.title}
                        </span>
                        <StatusBadge status={it.status} size="xs" />
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2.5 text-[11.5px] text-[#6B7280]">
                        <span className="flex items-center gap-1">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#A8A29A"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
                            <circle cx="12" cy="10" r="2.4" />
                          </svg>
                          {it.place}
                        </span>
                        <span className="inline-block rounded-md bg-[#EAF0EC] px-1.5 py-px font-bold text-[#2F5D50]">
                          {it.team}
                        </span>
                      </div>
                      {it.note && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11.5px] font-semibold text-[#B0703A]">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#E6A23C"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          >
                            <path d="M12 3l9 16H3z" />
                            <path d="M12 10v4M12 17h.01" />
                          </svg>
                          {it.note}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
