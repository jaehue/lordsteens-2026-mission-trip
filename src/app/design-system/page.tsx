import StatusBadge from "@/components/StatusBadge";
import { STATUSES } from "@/lib/status";

const COLORS: { name: string; hex: string; light?: boolean }[] = [
  { name: "Background", hex: "#FAF7F0", light: true },
  { name: "Primary · 딥그린", hex: "#2F5D50" },
  { name: "Accent · 머스타드", hex: "#E6A23C" },
  { name: "Warning · 코랄", hex: "#D96C5F" },
  { name: "Card", hex: "#FFFFFF", light: true },
  { name: "Text · 차콜", hex: "#222222" },
  { name: "Muted Text", hex: "#6B7280" },
  { name: "Tint · 그린톤", hex: "#EAF0EC", light: true },
];

function Divider() {
  return <div className="my-6 h-px bg-[#F0EBE0]" />;
}

export default function DesignSystemPage() {
  return (
    <div className="mx-auto w-full max-w-[880px] animate-fade-up px-4 pt-6">
      <div className="rounded-[18px] border border-[#E6DFD0] bg-white p-7 shadow-[0_22px_60px_-30px_rgba(38,52,46,0.35)] sm:p-9">
        <div className="text-[11.5px] font-bold tracking-wider text-[#E6A23C] uppercase">
          Design System
        </div>
        <h1 className="mt-1 text-[23px] font-extrabold tracking-tight text-[#23211E]">
          디자인 시스템 간단 정리
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#6B7280]">
          따뜻하고 단정한, 신뢰감 있는 교회 선교 준비 현황판을 위한 기본
          규칙입니다.
        </p>

        <Divider />

        {/* 컬러 */}
        <div className="mb-3.5 text-[14px] font-extrabold text-[#2F5D50]">
          컬러
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLORS.map((c) => (
            <div key={c.name}>
              <div
                className="h-[62px] rounded-xl"
                style={{
                  background: c.hex,
                  border: c.light ? "1px solid #ECE5D6" : "none",
                }}
              />
              <div className="mt-1.5 text-[12px] font-bold text-[#23211E]">
                {c.name}
              </div>
              <div className="text-[11px] text-[#9A958A]">{c.hex}</div>
            </div>
          ))}
        </div>

        <Divider />

        <div className="grid gap-7 sm:grid-cols-2">
          {/* 폰트 */}
          <div>
            <div className="mb-3.5 text-[14px] font-extrabold text-[#2F5D50]">
              폰트 · Pretendard
            </div>
            <div className="text-[30px] font-extrabold tracking-tight text-[#23211E]">
              준비 현황 한눈에
            </div>
            <div className="mt-2 text-[18px] font-bold text-[#3A3833]">
              팀별 다음 액션 Bold 700
            </div>
            <div className="mt-2 text-[14px] font-medium text-[#3A3833]">
              본문 텍스트는 읽기 편한 굵기 Medium 500
            </div>
            <div className="mt-2 text-[12px] font-semibold text-[#6B7280]">
              보조 정보 · 날짜 · 메모 Muted 12px
            </div>
          </div>

          {/* 상태 배지 */}
          <div>
            <div className="mb-3.5 text-[14px] font-extrabold text-[#2F5D50]">
              상태 배지
            </div>
            <div className="flex flex-wrap gap-2.5">
              {STATUSES.map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-[#9A958A]">
              완료 초록 · 진행중 파랑 · 확인필요 주황 · 위험/지연 빨강 ·
              대기/논의중/미확정 회색
            </p>
          </div>
        </div>

        <Divider />

        <div className="grid items-start gap-7 sm:grid-cols-2">
          {/* 버튼 + 카드 */}
          <div>
            <div className="mb-3.5 text-[14px] font-extrabold text-[#2F5D50]">
              버튼
            </div>
            <div className="flex items-center gap-2.5">
              <span className="rounded-[13px] bg-[#2F5D50] px-5 py-3 text-[13.5px] font-bold text-[#FBF7EE]">
                Primary
              </span>
              <span className="rounded-[13px] border-[1.5px] border-[#D8E4DD] bg-white px-5 py-3 text-[13.5px] font-bold text-[#2F5D50]">
                Secondary
              </span>
              <span className="rounded-full border border-[#E6E0D4] bg-white px-3.5 py-2 text-[12.5px] font-bold text-[#5B5750]">
                필터 칩
              </span>
            </div>
            <div className="mt-5 mb-3.5 text-[14px] font-extrabold text-[#2F5D50]">
              카드
            </div>
            <div className="rounded-2xl border border-[#EFEAE0] bg-white p-4 shadow-[0_1px_2px_rgba(47,93,80,0.04)]">
              <div className="text-[14px] font-extrabold text-[#23211E]">
                카드 제목
              </div>
              <div className="mt-1.5 text-[12.5px] leading-relaxed text-[#6B7280]">
                흰 배경 · 16px 라운드 · 1px 헤어라인 보더 · 아주 옅은 그림자
              </div>
            </div>
          </div>

          {/* 하단 탭 설명 */}
          <div>
            <div className="mb-3.5 text-[14px] font-extrabold text-[#2F5D50]">
              하단 탭
            </div>
            <p className="text-[11.5px] leading-relaxed text-[#9A958A]">
              활성 탭은 딥그린 + 굵은 라인, 비활성은 옅은 회색. 5개 메뉴
              고정(홈 · 팀별 현황 · 할 일 · 일정 · 자료). 모바일은 하단 고정,
              데스크톱에서는 중앙 정렬되어 동일하게 동작합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
