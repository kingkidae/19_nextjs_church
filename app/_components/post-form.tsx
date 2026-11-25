"use client";

import Link from "next/link";
import { useActionState } from "react";
import { addComment, deleteComment, deletePost, savePost } from "../_lib/post-actions";

export function PostForm({ board, id, title = "", content = "" }: { board: string; id?: number; title?: string; content?: string }) {
  const [state, action, pending] = useActionState(savePost, undefined);
  return (
    <form action={action} className="flex h-full min-h-0 flex-col gap-[2svh]">
      <input type="hidden" name="board" value={board} />
      {id && <input type="hidden" name="id" value={id} />}
      <label className="grid gap-1.5 text-sm">
        제목
        <input name="title" required maxLength={120} defaultValue={state?.values?.title ?? title} className="field font-serif text-[clamp(1rem,2.4svh,1.25rem)]" />
      </label>
      <label className="grid min-h-0 flex-1 grid-rows-[auto_1fr] gap-1.5 text-sm">
        내용
        <textarea name="content" required maxLength={20000} defaultValue={state?.values?.content ?? content} className="field min-h-[8rem] resize-none leading-relaxed" />
      </label>
      {state?.error && <p role="alert" className="text-sm text-amber">{state.error}</p>}
      <div className="flex items-center gap-3 text-sm">
        <Link href={id ? `/${board}/${id}` : `/${board}`} className="mr-auto underline-offset-4 hover:underline">취소</Link>
        <button disabled={pending} className="rounded-full bg-mocha px-6 py-2.5 text-champagne transition-colors hover:bg-amber hover:text-mocha-night disabled:opacity-60">
          {pending ? "저장하는 중…" : id ? "수정 완료" : "글 올리기"}
        </button>
      </div>
    </form>
  );
}

export function DeleteButton({ board, id }: { board: string; id: number }) {
  return (
    <form action={deletePost} onSubmit={(e) => !confirm("이 글을 삭제할까요? 삭제한 글은 되돌릴 수 없습니다.") && e.preventDefault()}>
      <input type="hidden" name="board" value={board} />
      <input type="hidden" name="id" value={id} />
      <button className="rounded-full bg-mocha/10 px-4 py-2 hover:bg-amber hover:text-mocha-night">삭제</button>
    </form>
  );
}

export function CommentForm({ postId }: { postId: number }) {
  const [state, action, pending] = useActionState(addComment, undefined);
  return (
    <form action={action} className="flex items-end gap-3">
      <input type="hidden" name="post_id" value={postId} />
      <label className="grid flex-1 gap-1 text-sm">
        <span className="sr-only">댓글</span>
        <textarea name="content" required maxLength={1000} rows={2} defaultValue={state?.values?.content} placeholder="댓글을 남겨 주세요" className="field resize-none text-[0.95rem] leading-relaxed placeholder:text-mocha/40" />
        {state?.error && <span role="alert" className="text-amber">{state.error}</span>}
      </label>
      <button disabled={pending} className="shrink-0 rounded-full bg-mocha px-5 py-2.5 text-sm text-champagne transition-colors hover:bg-amber hover:text-mocha-night disabled:opacity-60">
        {pending ? "남기는 중…" : "댓글 남기기"}
      </button>
    </form>
  );
}

export function DeleteCommentButton({ id }: { id: number }) {
  return (
    <form action={deleteComment} onSubmit={(e) => !confirm("이 댓글을 삭제할까요?") && e.preventDefault()} className="ml-auto">
      <input type="hidden" name="id" value={id} />
      <button className="text-[0.78rem] text-mocha/60 underline-offset-4 hover:text-amber hover:underline">삭제</button>
    </form>
  );
}
