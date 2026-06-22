import Link from "next/link";
import { notFound } from "next/navigation";
import ScreenHeader from "@/components/ScreenHeader";
import Markdown from "@/components/Markdown";
import { getDoc, getSlugs } from "@/lib/content";

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export default async function ResourceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDoc(decodeURIComponent(slug));
  if (!doc) notFound();

  return (
    <>
      <ScreenHeader title="자료" />
      <div className="mx-auto w-full max-w-[680px] animate-fade-up px-4">
        <Link
          href="/resources"
          className="mb-3 inline-flex items-center gap-1 text-[12.5px] font-bold text-[#2F5D50]"
        >
          ‹ 자료 목록
        </Link>
        <article className="rounded-2xl border border-[#EFEAE0] bg-white p-5 shadow-[0_1px_2px_rgba(47,93,80,0.04)] sm:p-7">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-md bg-[#EAF0EC] px-2 py-0.5 text-[11px] font-bold text-[#2F5D50]">
              {doc.category}
            </span>
            {doc.date && (
              <span className="text-[11.5px] font-semibold text-[#9A958A]">
                {doc.date}
              </span>
            )}
          </div>
          <h1 className="mb-3 text-[20px] font-extrabold tracking-tight text-[#23211E]">
            {doc.title}
          </h1>
          <Markdown>{doc.body}</Markdown>
        </article>
      </div>
    </>
  );
}
