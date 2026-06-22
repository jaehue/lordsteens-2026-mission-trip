/**
 * 상태(status) → 색상 토큰 매핑. 목업 디자인의 st() 함수를 그대로 옮긴 것.
 * 완료 초록 · 진행중 파랑 · 확인필요 주황 · 위험/지연 빨강(코랄) · 대기/논의중/미확정 회색.
 */

export interface StatusStyle {
  bg: string;
  fg: string;
  dot: string;
}

const MAP: Record<string, StatusStyle> = {
  완료: { bg: "#E4F0E8", fg: "#2E7D52", dot: "#2E7D52" },
  진행중: { bg: "#E3ECF6", fg: "#2C6CA0", dot: "#2C6CA0" },
  확인필요: { bg: "#FAEAD2", fg: "#A86F16", dot: "#E6A23C" },
  위험: { bg: "#F8E2DD", fg: "#BB4E42", dot: "#D96C5F" },
  지연: { bg: "#F8E2DD", fg: "#BB4E42", dot: "#D96C5F" },
  대기: { bg: "#ECE8DF", fg: "#6B7280", dot: "#A8A29A" },
  논의중: { bg: "#ECE8DF", fg: "#6B7280", dot: "#A8A29A" },
  미확정: { bg: "#ECE8DF", fg: "#6B7280", dot: "#A8A29A" },
};

export const STATUSES = Object.keys(MAP);

export function statusStyle(status: string): StatusStyle {
  return MAP[status] ?? MAP["대기"];
}

/** 마감 임박으로 강조할 상태인지 */
export function isUrgent(status: string): boolean {
  return status === "위험" || status === "확인필요";
}

/** 자료 타입(PDF/DOC/SHEET) → 아이콘 색상 */
export function docTypeStyle(type: string): { bg: string; fg: string } {
  if (type === "PDF") return { bg: "#FBE9E5", fg: "#C0544A" };
  if (type === "DOC") return { bg: "#E3ECF6", fg: "#2C6CA0" };
  if (type === "SHEET") return { bg: "#E4F0E8", fg: "#2E7D52" };
  return { bg: "#ECE8DF", fg: "#6B7280" };
}
