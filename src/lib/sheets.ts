import { google } from "googleapis";

/**
 * Google Sheet 를 "읽기 전용" 데이터베이스로 사용하는 연동 레이어.
 *
 * 환경변수 (Vercel / .env.local):
 *  - GOOGLE_SHEET_ID                : 시트 문서 ID (URL 의 /d/<ID>/edit 부분)
 *  - GOOGLE_SERVICE_ACCOUNT_EMAIL   : 서비스 계정 이메일 (시트에 "뷰어"로 공유)
 *  - GOOGLE_PRIVATE_KEY             : 서비스 계정 비공개 키 (\n 은 그대로 두면 됨)
 *
 * 환경변수가 없으면 throw 하지 않고 "미설정" 상태로 동작한다.
 * (시트를 아직 안 만든 첫 배포에서도 사이트가 안내 문구와 함께 떠야 하므로)
 */

export function isSheetConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEET_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY,
  );
}

function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Vercel 환경변수에 키를 넣으면 줄바꿈이 \n 문자열로 저장되는 경우가 많아 복원한다.
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return google.sheets({ version: "v4", auth });
}

/** 한 행을 헤더 키로 매핑한 객체 */
export type SheetRow = Record<string, string>;

/**
 * 탭(시트 이름) 전체를 읽어 첫 행을 헤더로 사용,
 * 나머지 행을 { 헤더: 값 } 객체 배열로 반환한다.
 * 빈 행은 건너뛴다. 설정/탭 누락/네트워크 오류 시 빈 배열을 반환한다(throw 안 함).
 */
export async function readTab(tab: string): Promise<SheetRow[]> {
  if (!isSheetConfigured()) return [];

  try {
    const sheets = getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: tab,
      valueRenderOption: "FORMATTED_VALUE",
    });

    const values = res.data.values;
    if (!values || values.length < 2) return [];

    const headers = (values[0] as string[]).map((h) => String(h ?? "").trim());

    return values
      .slice(1)
      .map((row) => {
        const obj: SheetRow = {};
        headers.forEach((h, i) => {
          if (!h) return;
          obj[h] = String((row as string[])[i] ?? "").trim();
        });
        return obj;
      })
      .filter((obj) => Object.values(obj).some((v) => v !== ""));
  } catch (err) {
    console.error(`[sheets] "${tab}" 탭 읽기 실패:`, err);
    return [];
  }
}
