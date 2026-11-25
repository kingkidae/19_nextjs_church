import Link from "next/link";
import { DeleteCommentButton } from "../../_components/post-form";
import { boards, type Board } from "../../_lib/church";
import { createClient, formatDate } from "../../_lib/supabase";

export const metadata = { title: "소식·주보·댓글" };

export default async function Page() {
  const supabase = await createClient();
  const [posts, comments] = await Promise.all([
    supabase.from("posts").select("id, board, title, created_at").order("created_at", { ascending: false }).limit(40),
    supabase.from("comments").select("id, post_id, author_name, content, created_at, posts(board, title)").order("created_at", { ascending: false }).limit(30),
  ]);
  return (
    <div className="grid gap-10">
      {(Object.keys(boards) as Board[]).map((b) => {
        const list = (posts.data ?? []).filter((p) => p.board === b);
        return (
          <section key={b}>
            <div className="flex items-end justify-between border-b border-mocha/30 pb-2">
              <h2 className="font-serif text-2xl">{boards[b].label}</h2>
              <Link href={`/${b}/new`} className="rounded-full bg-mocha px-4 py-2 text-sm text-champagne hover:bg-amber hover:text-mocha-night">새 글 쓰기</Link>
            </div>
            {list.length === 0 ? (
              <p className="py-4 text-sm text-mocha/60">아직 글이 없습니다.</p>
            ) : (
              <ul>
                {list.map((p) => (
                  <li key={p.id} className="flex items-baseline gap-4 border-b border-mocha/15 py-2.5 text-sm">
                    <time className="w-24 shrink-0 tabular-nums text-mocha/60">{formatDate(p.created_at)}</time>
                    <Link href={`/${b}/${p.id}`} className="flex-1 truncate font-serif text-base hover:text-amber">{p.title}</Link>
                    <Link href={`/${b}/${p.id}/edit`} className="text-mocha/70 hover:text-amber">수정</Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
      <section>
        <h2 className="border-b border-mocha/30 pb-2 font-serif text-2xl">최근 댓글</h2>
        {(comments.data ?? []).length === 0 ? (
          <p className="py-4 text-sm text-mocha/60">아직 댓글이 없습니다.</p>
        ) : (
          <ul>
            {(comments.data ?? []).map((c) => {
              const post = c.posts as unknown as { board: Board; title: string } | null;
              return (
                <li key={c.id} className="border-b border-mocha/15 py-2.5 text-sm">
                  <div className="flex items-baseline gap-3 text-mocha/65">
                    <span className="font-medium text-mocha-deep">{c.author_name}</span>
                    <time>{formatDate(c.created_at)}</time>
                    {post && <Link href={`/${post.board}/${c.post_id}`} className="truncate hover:text-amber">{post.title}</Link>}
                    <DeleteCommentButton id={c.id} />
                  </div>
                  <p className="mt-1 line-clamp-2 whitespace-pre-wrap">{c.content}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
