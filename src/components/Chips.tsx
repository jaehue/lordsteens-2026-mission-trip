/** 가로 스크롤 필터칩 줄. 활성 칩은 딥그린, 비활성은 흰 배경. (클라이언트 부모가 제어) */
export default function Chips({
  items,
  active,
  onSelect,
}: {
  items: string[];
  active: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pt-1 pb-3">
      {items.map((label) => {
        const on = active === label;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelect(label)}
            className="shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold whitespace-nowrap transition-colors"
            style={{
              background: on ? "#2F5D50" : "#FFFFFF",
              color: on ? "#FBF7EE" : "#5B5750",
              borderColor: on ? "#2F5D50" : "#E6E0D4",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
