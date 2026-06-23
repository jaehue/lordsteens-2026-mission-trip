import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { formatDate } from "./date";

/**
 * 회의록 · 공지사항 · 운영계획 같은 "글" 콘텐츠는 프로젝트 내 마크다운 파일로 관리한다.
 *   content/<slug>.md
 * frontmatter:
 *   title    : 제목 (필수)
 *   category : 공지 | 회의록 | 계획   (기본: 공지)
 *   date     : YYYY-MM-DD
 *   summary  : 목록에 보일 한 줄 요약
 *   pinned   : true 면 목록 상단 고정
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Doc {
  slug: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  pinned: boolean;
  body: string;
}

function readAll(): Doc[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        category: String(data.category ?? "공지"),
        date: formatDate(data.date),
        summary: String(data.summary ?? ""),
        pinned: Boolean(data.pinned ?? false),
        body: content,
      };
    });
}

/** 고정글 우선, 그다음 날짜 내림차순 */
export function getDocs(): Doc[] {
  return readAll().sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
}

export function getDoc(slug: string): Doc | undefined {
  return readAll().find((d) => d.slug === slug);
}

export function getSlugs(): string[] {
  return readAll().map((d) => d.slug);
}
