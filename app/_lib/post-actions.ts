"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { boards, type Board } from "./church";
import { POSTS_TAG } from "./content";
import { createClient } from "./supabase";
import { fail, type FormState } from "./form-state";

function read(form: FormData) {
  const board = String(form.get("board")) as Board;
  const title = String(form.get("title") ?? "").trim();
  const content = String(form.get("content") ?? "").trim();
  if (!(board in boards)) return { error: "잘못된 게시판입니다." } as const;
  if (!title || title.length > 120) return { error: "제목을 120자 이내로 입력해 주세요." } as const;
  if (!content || content.length > 20000) return { error: "내용을 입력해 주세요. (최대 20,000자)" } as const;
  return { board, title, content } as const;
}

// RLS in supabase/schema.sql is the real gate; these checks only give friendly messages.
export async function savePost(_: FormState, form: FormData): Promise<FormState> {
  const input = read(form);
  if (!("title" in input)) return fail(form, input.error);
  const id = Number(form.get("id")) || null;

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return fail(form, "로그인 후 작성할 수 있습니다.");

  const { title, content, board } = input;
  const { data, error } = id
    ? await supabase.from("posts").update({ title, content }).eq("id", id).select("id").single()
    : await supabase.from("posts").insert({ board, title, content }).select("id").single();
  if (error || !data) return fail(form, "저장하지 못했습니다. 작성 권한을 확인해 주세요.");
  updateTag(POSTS_TAG); // sitemap
  redirect(`/${board}/${data.id}`);
}

export async function deletePost(form: FormData) {
  const board = String(form.get("board")) as Board;
  const id = Number(form.get("id"));
  if (!(board in boards) || !id) redirect("/");
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  updateTag(POSTS_TAG);
  redirect(`/${board}`);
}

export async function addComment(_: FormState, form: FormData): Promise<FormState> {
  const postId = Number(form.get("post_id"));
  const content = String(form.get("content") ?? "").trim();
  if (!Number.isInteger(postId) || postId < 1) return fail(form, "잘못된 요청입니다.");
  if (!content || content.length > 1000) return fail(form, "댓글을 1,000자 이내로 입력해 주세요.");

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return fail(form, "로그인 후 댓글을 남길 수 있습니다.");
  const { error } = await supabase.from("comments").insert({ post_id: postId, content });
  if (error) return fail(form, "댓글을 남기지 못했습니다. 잠시 후 다시 시도해 주세요.");
  refresh();
  return { notice: "댓글을 남겼습니다." };
}

export async function deleteComment(form: FormData) {
  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id < 1) return;
  const supabase = await createClient();
  await supabase.from("comments").delete().eq("id", id); // RLS: admin only
  refresh();
}
