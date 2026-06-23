import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

/**
 * 프론트매터의 날짜 값을 표시용 문자열로 정규화한다.
 *
 * `date: 2026-06-23` 처럼 따옴표 없이 쓰면 YAML 이 Date 객체로 파싱하고,
 * 그대로 String() 하면 "Tue Jun 23 2026 09:00:00 GMT+0900 …" 처럼 지저분하게
 * 나온다. Date 객체는 `2026.06.23` 형태로 정규화하고, 이미 문자열인 값("6/23",
 * "준비중" 등)은 그대로 둔다.
 *
 * YAML date-only 는 UTC 자정으로 파싱되므로 utc 기준으로 포맷해 타임존 밀림을 막는다.
 */
export function formatDate(value: unknown): string {
  if (value instanceof Date) {
    const d = dayjs.utc(value);
    if (d.isValid()) return d.format("YYYY.MM.DD");
  }
  return String(value ?? "");
}
