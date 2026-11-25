import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { boards, type Board } from "../_lib/church";
import { createClient, formatDate, getUser, isAdmin, supabaseReady, type Post } from "../_lib/supabase";
import { CommentForm, DeleteButton, DeleteCommentButton, PostForm } from "./post-form";

async function Comments({ postId, admin }: { postId: number; admin: boolean }) {
  const supabase = await createClient();
  const { data } = await supabase.from("comments").select("id, author_name, content, created_at").eq("post_id", postId).order("created_at");
  const list = data ?? [];
  return (
    <section aria-label="댓글" className="mt-[4svh] border-t border-mocha/20 pt-[2.4svh]">
      <h3 className="mb-[1.4svh] font-serif text-[clamp(1rem,2.3svh,1.2rem)]">댓글 {list.length}</h3>
      {list.length === 0 ? (
        <p className="text-sm text-mocha/60">아직 댓글이 없습니다.</p>
      ) : (
        <ol className="space-y-[1.6svh]">
          {list.map((c) => (
            <li key={c.id} className="rounded-xl bg-mocha/[0.06] px-4 py-3">
              <div className="flex items-baseline gap-3 text-[0.8rem] text-mocha/65">
                <span className="font-medium text-mocha-deep">{c.author_name}</span>
                <time dateTime={c.created_at}>{formatDate(c.created_at)}</time>
                {admin && <DeleteCommentButton id={c.id} />}
              </div>
              <p className="mt-1 text-[0.95rem] leading-relaxed whitespace-pre-wrap">{c.content}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

const PER_PAGE = 7;

function Shell({ board, children, aside }: { board: Board; children: React.ReactNode; aside?: React.ReactNode }) {
  const b = boards[board];
  return (
    <main className="screen bg-champagne text-mocha-deep">
      <div className="grid h-full min-h-0 gap-[clamp(1.25rem,4vw,4.5rem)] lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.6fr)]">
        <aside className="flex min-h-0 items-start gap-5 lg:flex-col lg:justify-between">
          <div>
            <h1 className="font-serif text-[clamp(1.9rem,6.5svh,4rem)] leading-[1.1]">
              <Link href={`/${board}`}>{b.label}</Link>
            </h1>
            <p className="mt-[1.6svh] hidden max-w-[34ch] text-[clamp(0.85rem,1.9svh,1rem)] leading-relaxed text-mocha/80 sm:block">{b.intro}</p>
            <div className="mt-[2.4svh]">{aside}</div>
          </div>
          <div className="arch relative hidden aspect-[3/4] w-[min(100%,15rem,30svh)] overflow-hidden lg:block">
            <Image src={b.image} alt="" fill sizes="15rem" className="object-cover sepia-[.35]" />
          </div>
        </aside>
        <div className="min-h-0">{children}</div>
      </div>
    </main>
  );
}

export function SetupNotice() {
  return (
    <div className="rounded-xl border border-mocha/25 p-6 text-sm leading-relaxed">
      <p className="font-serif text-lg">게시판을 쓰려면 Supabase 연결이 필요합니다.</p>
      <p className="mt-2 text-mocha/80">
        프로젝트 루트의 <code>.env.example</code>을 <code>.env.local</code>로 복사해 키를 넣고, <code>supabase/schema.sql</code>을 Supabase SQL Editor에서 실행한 뒤 서버를 다시 시작하세요.
      </p>
    </div>
  );
}

async function WriteLink({ board }: { board: Board }) {
  const user = await getUser();
  if (!supabaseReady || !isAdmin(user)) return null;
  return (
    <Link href={`/${board}/new`} className="inline-block rounded-full bg-mocha px-5 py-2.5 text-sm text-champagne transition-colors hover:bg-amber hover:text-mocha-night">
      글쓰기
    </Link>
  );
}

async function List({ board, searchParams }: { board: Board; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!supabaseReady) return <SetupNotice />;
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const supabase = await createClient();
  const { data, count, error } = await supabase
    .from("posts")
    .select("id, title, author_name, created_at", { count: "exact" })
    .eq("board", board)
    .order("created_at", { ascending: false })
    .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
  if (error) return <p className="text-sm">글을 불러오지 못했습니다. schema.sql을 실행했는지 확인해 주세요.</p>;
  const pages = Math.max(1, Math.ceil((count ?? 0) / PER_PAGE));

  return (
    <div className="flex h-full flex-col">
      {data.length === 0 ? (
        <p className="border-y border-mocha/20 py-[6svh] text-center font-serif text-[clamp(1rem,2.4svh,1.25rem)] text-mocha/70">아직 올라온 글이 없습니다.</p>
      ) : (
        <ol className="border-t border-mocha/30">
          {data.map((p) => (
            <li key={p.id} className="border-b border-mocha/15">
              <Link href={`/${board}/${p.id}`} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 px-1 py-[clamp(0.6rem,1.9svh,1.1rem)] transition-colors hover:bg-mocha/[0.06] sm:grid-cols-[6.5rem_1fr_auto]">
                <time className="hidden text-[0.8rem] tabular-nums text-mocha/60 sm:block">{formatDate(p.created_at)}</time>
                <span className="truncate font-serif text-[clamp(0.95rem,2.3svh,1.2rem)]">{p.title}</span>
                <span className="text-[0.8rem] text-mocha/60">{p.author_name}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
      {pages > 1 && (
        <nav aria-label="페이지" className="mt-auto flex justify-center gap-1 pt-[2svh] text-sm">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link key={n} href={`/${board}?page=${n}`} aria-current={n === page ? "page" : undefined} className="grid size-9 place-items-center rounded-full aria-[current=page]:bg-mocha aria-[current=page]:text-champagne hover:bg-mocha/10">
              {n}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

const Loading = () => <p className="py-10 text-center text-sm text-mocha/60">불러오는 중…</p>;

export function BoardIndex({ board, searchParams }: { board: Board; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <Shell board={board} aside={<Suspense><WriteLink board={board} /></Suspense>}>
      <Suspense fallback={<Loading />}>
        <List board={board} searchParams={searchParams} />
      </Suspense>
    </Shell>
  );
}

async function getPost(board: Board, params: Promise<{ id: string }>) {
  const id = Number((await params).id);
  if (!supabaseReady || !Number.isInteger(id)) notFound();
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("board", board).eq("id", id).maybeSingle<Post>();
  if (!data) notFound();
  return data;
}

async function Detail({ board, params }: { board: Board; params: Promise<{ id: string }> }) {
  const [post, user] = await Promise.all([getPost(board, params), getUser()]);
  const canEdit = isAdmin(user);
  return (
    <article className="flex h-full min-h-0 flex-col">
      <header className="border-b border-mocha/30 pb-[2svh]">
        <h2 className="font-serif text-[clamp(1.35rem,4svh,2.4rem)] leading-snug">{post.title}</h2>
        <p className="mt-2 text-[0.85rem] text-mocha/65">
          {post.author_name}, <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
        </p>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-[2.5svh] pr-2">
        <div className="text-[clamp(0.92rem,2svh,1.05rem)] leading-[1.85] whitespace-pre-wrap">{post.content}</div>
        <Comments postId={post.id} admin={canEdit} />
      </div>
      <div className="border-t border-mocha/20 py-[1.6svh]">
        {user ? (
          <CommentForm postId={post.id} />
        ) : (
          <p className="text-sm text-mocha/75">
            <Link href={`/login?next=/${board}/${post.id}`} className="underline underline-offset-4 hover:text-amber">로그인</Link>하면 댓글을 남길 수 있습니다.
          </p>
        )}
      </div>
      <footer className="flex items-center gap-3 border-t border-mocha/20 pt-[1.6svh] text-sm">
        <Link href={`/${board}`} className="mr-auto underline-offset-4 hover:underline">목록으로</Link>
        {canEdit && (
          <>
            <Link href={`/${board}/${post.id}/edit`} className="rounded-full border border-mocha/40 px-4 py-2 hover:border-mocha">수정</Link>
            <DeleteButton board={board} id={post.id} />
          </>
        )}
      </footer>
    </article>
  );
}

export function BoardDetail({ board, params }: { board: Board; params: Promise<{ id: string }> }) {
  return (
    <Shell board={board}>
      <Suspense fallback={<Loading />}>
        <Detail board={board} params={params} />
      </Suspense>
    </Shell>
  );
}

async function Editor({ board, params }: { board: Board; params?: Promise<{ id: string }> }) {
  if (!supabaseReady) return <SetupNotice />;
  const user = await getUser();
  const self = params ? `/${board}/${(await params).id}/edit` : `/${board}/new`;
  if (!user) redirect(`/login?next=${self}`);
  if (!isAdmin(user)) redirect(`/${board}`); // writing and editing posts is admin-only
  if (!params) return <PostForm board={board} />;
  const post = await getPost(board, params);
  return <PostForm board={board} id={post.id} title={post.title} content={post.content} />;
}

export function BoardEditor({ board, params }: { board: Board; params?: Promise<{ id: string }> }) {
  return (
    <Shell board={board}>
      <Suspense fallback={<Loading />}>
        <Editor board={board} params={params} />
      </Suspense>
    </Shell>
  );
}
