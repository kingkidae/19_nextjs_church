import Link from "next/link";
import { createClient } from "../_lib/supabase";

export default async function Page() {
  const supabase = await createClient();
  const count = async (table: string, board?: string) => {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (board) q = q.eq("board", board);
    return (await q).count ?? 0;
  };
  const [members, news, bulletin, comments, worship, videos] = await Promise.all([
    supabase.rpc("admin_members").then((r) => r.data?.length ?? 0),
    count("posts", "news"),
    count("posts", "bulletin"),
    count("comments"),
    count("worship_times"),
    count("videos"),
  ]);
  const rows = [
    { href: "/admin/members", label: "회원", value: `${members}명` },
    { href: "/admin/posts", label: "교회 소식", value: `글 ${news}개` },
    { href: "/admin/posts", label: "교회 주보", value: `글 ${bulletin}개` },
    { href: "/admin/posts", label: "댓글", value: `${comments}개` },
    { href: "/admin/worship", label: "예배 시간", value: `${worship}개` },
    { href: "/admin/videos", label: "온라인 예배 영상", value: `${videos}개` },
    { href: "/admin/info", label: "교회 정보·오시는 길", value: "고치기" },
    { href: "/admin/about", label: "표어·교회 소개", value: "고치기" },
  ];
  return (
    <div>
      <h1 className="font-serif text-[clamp(1.6rem,4.5svh,2.6rem)]">관리자 대시보드</h1>
      <p className="mt-2 text-sm text-mocha/75">여기서 고친 내용은 저장하는 즉시 사이트에 반영됩니다.</p>
      <ul className="mt-6 border-t border-mocha/25">
        {rows.map((r) => (
          <li key={r.label} className="border-b border-mocha/15">
            <Link href={r.href} className="flex items-baseline justify-between px-1 py-3.5 hover:bg-mocha/[0.06]">
              <span className="font-serif text-lg">{r.label}</span>
              <span className="text-sm tabular-nums text-mocha/70">{r.value}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
