import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** 콘텐츠 마크다운을 .prose 스타일로 렌더링 (서버 컴포넌트) */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
