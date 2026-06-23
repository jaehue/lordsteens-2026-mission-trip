import Link from "next/link";
import ScreenHeader from "@/components/ScreenHeader";
import { getPeople, isSheetConfigured, type PersonRow } from "@/lib/data";

export const revalidate = 300;

function countBy(rows: PersonRow[], pick: (r: PersonRow) => string) {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = pick(r).trim();
    if (!k) continue;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

function isYes(v: string) {
  return /^(o|y|예|yes|true|1|참석|미귀가)$/i.test(v.trim());
}

/** 구분을 교역자 / 교사 / 학생 3가지로만 정규화한다. 팀장·스탭 등은 교사로 묶는다. */
const ROLE_ORDER = ["교역자", "교사", "학생"];
function role(r: PersonRow): string {
  const v = (r.구분 || "").trim();
  if (v === "교역자") return "교역자";
  if (v === "학생") return "학생";
  return "교사";
}

export default async function PeoplePage() {
  const configured = isSheetConfigured();
  const people = configured ? await getPeople() : [];

  const byType = countBy(people, role);
  const partial = people.filter((r) => isYes(r.부분참석)).length;
  const staySat = people.filter((r) => isYes(r.토요미귀가)).length;

  // 섬김조별 그룹
  const groups = new Map<string, PersonRow[]>();
  for (const r of people) {
    const g = (r.섬김조 || "미배정").trim() || "미배정";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(r);
  }

  return (
    <>
      <ScreenHeader title="참가자 명단" />
      <div className="mx-auto w-full max-w-[480px] animate-fade-up px-4">
        {!configured || people.length === 0 ? (
          <div className="rounded-2xl border border-[#EFEAE0] bg-white p-6 text-center shadow-[0_1px_2px_rgba(47,93,80,0.04)]">
            <div className="text-[15px] font-extrabold text-[#23211E]">
              명단을 불러올 수 없어요
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[#6B7280]">
              참가자 명단은 Google Sheet(서비스 계정, 읽기 전용)에서 가져옵니다.
              <br />
              {configured
                ? "‘명단’ 탭에 데이터가 있는지 확인해 주세요."
                : "환경변수(GOOGLE_SHEET_ID / 서비스 계정)가 아직 설정되지 않았습니다."}
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-[13px] bg-[#2F5D50] px-5 py-2.5 text-[13px] font-bold text-[#FBF7EE]"
            >
              홈으로
            </Link>
          </div>
        ) : (
          <>
            {/* 헤드카운트 */}
            <div className="rounded-[18px] border border-[#EFEAE0] bg-white p-[18px] shadow-[0_1px_2px_rgba(47,93,80,0.04)]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[40px] font-extrabold tracking-tight text-[#2F5D50]">
                  {people.length}
                </span>
                <span className="text-[16px] font-bold text-[#9A958A]">명</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[...byType.entries()]
                  .sort(
                    (a, b) => ROLE_ORDER.indexOf(a[0]) - ROLE_ORDER.indexOf(b[0]),
                  )
                  .map(([k, v]) => (
                  <span
                    key={k}
                    className="rounded-full bg-[#EAF0EC] px-2.5 py-1 text-[11.5px] font-bold text-[#2F5D50]"
                  >
                    {k} {v}
                  </span>
                ))}
                {partial > 0 && (
                  <span className="rounded-full bg-[#FAEEDA] px-2.5 py-1 text-[11.5px] font-bold text-[#B0703A]">
                    부분참석 {partial}
                  </span>
                )}
                {staySat > 0 && (
                  <span className="rounded-full bg-[#F8E2DD] px-2.5 py-1 text-[11.5px] font-bold text-[#BB4E42]">
                    토요 미귀가 {staySat}
                  </span>
                )}
              </div>
            </div>

            {/* 섬김조별 */}
            <div className="mt-4 flex flex-col gap-3">
              {[...groups.entries()].map(([g, members]) => (
                <div
                  key={g}
                  className="rounded-2xl border border-[#EFEAE0] bg-white p-[15px] shadow-[0_1px_2px_rgba(47,93,80,0.04)]"
                >
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[14px] font-extrabold text-[#23211E]">
                      {g}
                    </span>
                    <span className="text-[11.5px] font-bold text-[#9A958A]">
                      {members.length}명
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {members.map((m, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-[#F7F4EC] px-2.5 py-1 text-[12.5px] font-semibold text-[#3A3833]"
                      >
                        {m.이름}
                        {role(m) === "학생" && m.학년 ? (
                          <span className="ml-1 text-[10.5px] text-[#9A958A]">
                            {m.학년}
                          </span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
