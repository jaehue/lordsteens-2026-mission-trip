/**
 * 시드 CSV → Google Sheet 업로드 스크립트 (1회성)
 *
 * 인증: gcloud Application Default Credentials (ADC)
 *   gcloud auth application-default login \
 *     --scopes=https://www.googleapis.com/auth/spreadsheets,https://www.googleapis.com/auth/cloud-platform
 *
 * 실행:
 *   node seed/upload.mjs <SPREADSHEET_ID>
 *
 * 동작: seed/*.csv 를 각 탭(파일명=탭명)으로 업로드. 탭 없으면 생성, 있으면 내용 교체.
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { google } from "googleapis";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SPREADSHEET_ID = process.argv[2];
if (!SPREADSHEET_ID) {
  console.error("사용법: node seed/upload.mjs <SPREADSHEET_ID>");
  process.exit(1);
}

// 파일명(확장자 제외) → 탭 이름. data.ts 의 TABS 와 일치해야 함.
const TAB_ORDER = ["일정", "명단", "섬김조", "TF배정", "체크리스트", "예산"];

/** RFC4180 최소 구현: 따옴표/이스케이프 처리 */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c === "\r") {
      // skip
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  // 완전히 빈 행 제거
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  // 현재 스프레드시트의 탭 목록
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existing = new Map(
    meta.data.sheets.map((s) => [
      s.properties.title,
      s.properties.sheetId,
    ]),
  );

  // 업로드할 CSV 수집
  const files = readdirSync(__dirname)
    .filter((f) => f.endsWith(".csv"))
    .map((f) => ({ tab: f.replace(/\.csv$/, ""), path: join(__dirname, f) }));

  // 없는 탭 생성
  const toAdd = files
    .filter((f) => !existing.has(f.tab))
    .map((f) => ({ addSheet: { properties: { title: f.tab } } }));
  if (toAdd.length) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests: toAdd },
    });
    console.log(`탭 생성: ${toAdd.map((r) => r.addSheet.properties.title).join(", ")}`);
  }

  // 각 탭에 데이터 기록 (clear → update)
  for (const f of files) {
    const values = parseCSV(readFileSync(f.path, "utf8"));
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: f.tab,
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${f.tab}!A1`,
      valueInputOption: "RAW",
      requestBody: { values },
    });
    console.log(`업로드: ${f.tab} (${values.length}행 × ${values[0]?.length ?? 0}열)`);
  }

  // 기본 "시트1"/"Sheet1" 이 비어 있고 우리가 안 쓰면 정리 안내만
  console.log("\n완료. 스프레드시트 탭:", TAB_ORDER.join(", "));
}

main().catch((e) => {
  console.error("실패:", e?.errors ?? e?.message ?? e);
  process.exit(1);
});
