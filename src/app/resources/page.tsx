import Link from "next/link";
import ScreenHeader from "@/components/ScreenHeader";
import { getResources, docLink, type DocItem } from "@/lib/dashboard";
import { docTypeStyle } from "@/lib/status";

function FileIcon({ type, size = 20 }: { type: string; size?: number }) {
  const c = docTypeStyle(type);
  const box = size + 22;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl"
      style={{ width: box, height: box, background: c.bg }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={c.fg}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2.5H7A2 2 0 0 0 5 4.5v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5z" />
        <path d="M14 2.5v5h5" />
      </svg>
    </div>
  );
}

/** ready 면 링크로, 아니면 div 로 감싼다 */
function MaybeLink({
  doc,
  className,
  children,
}: {
  doc: DocItem;
  className: string;
  children: React.ReactNode;
}) {
  const href = docLink(doc);
  if (href)
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  return <div className={className}>{children}</div>;
}

export default function ResourcesPage() {
  const docs = getResources();
  const pinned = docs.filter((d) => d.pinned);

  return (
    <>
      <ScreenHeader title="자료" />
      <div className="mx-auto w-full max-w-[480px] animate-fade-up px-4">
        {/* 고정 자료 */}
        <div className="mt-1 mb-2.5 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#E6A23C">
            <path d="M12 2l2.4 6.9H22l-6 4.6 2.3 7.1-6.3-4.4-6.3 4.4L8 13.5l-6-4.6h7.6z" />
          </svg>
          <span className="text-[13px] font-extrabold text-[#23211E]">
            고정 자료
          </span>
        </div>
        <div className="mb-5 flex flex-col gap-2">
          {pinned.map((d) => (
            <MaybeLink
              key={d.name}
              doc={d}
              className="flex items-center gap-3.5 rounded-2xl border-[1.5px] border-[#E7DFCB] bg-white p-3.5 shadow-[0_1px_3px_rgba(47,93,80,0.05)]"
            >
              <FileIcon type={d.type} />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold text-[#23211E]">
                  {d.name}
                </div>
                <div className="mt-0.5 text-[11.5px] text-[#9A958A]">
                  {d.type} · 업데이트 {d.date}
                </div>
              </div>
              <svg
                width="9"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                stroke="#C5BFB0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 1l6 6-6 6" />
              </svg>
            </MaybeLink>
          ))}
        </div>

        {/* 전체 자료 */}
        <div className="mx-0.5 mt-1 mb-2.5 text-[13px] font-extrabold text-[#23211E]">
          전체 자료
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#EFEAE0] bg-white shadow-[0_1px_2px_rgba(47,93,80,0.04)]">
          {docs.map((d, i) => {
            const c = docTypeStyle(d.type);
            return (
              <MaybeLink
                key={d.name}
                doc={d}
                className={`flex items-center gap-3.5 p-3.5 ${
                  i > 0 ? "border-t border-[#F1ECE2]" : ""
                }`}
              >
                <FileIcon type={d.type} size={19} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-bold text-[#23211E]">
                    {d.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#9A958A]">
                    <span className="font-bold" style={{ color: c.fg }}>
                      {d.type}
                    </span>
                    · {d.date}
                  </div>
                </div>
                <span
                  className="rounded-full px-2 py-1 text-[10.5px] font-bold whitespace-nowrap"
                  style={{
                    background: d.ready ? "#EAF0EC" : "#ECE8DF",
                    color: d.ready ? "#2F5D50" : "#9A958A",
                  }}
                >
                  {d.ready ? "열기" : "준비중"}
                </span>
              </MaybeLink>
            );
          })}
        </div>
      </div>
    </>
  );
}
