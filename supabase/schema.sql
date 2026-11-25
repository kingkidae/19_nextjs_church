-- Run once in Supabase Dashboard > SQL Editor.

create table if not exists public.posts (
  id bigint generated always as identity primary key,
  board text not null check (board in ('news', 'bulletin')),
  title text not null check (char_length(title) between 1 and 120),
  content text not null check (char_length(content) between 1 and 20000),
  author_id uuid not null default auth.uid() references auth.users on delete cascade,
  author_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_board_created_idx on public.posts (board, created_at desc);

-- Author fields come from the session, never from the client.
create or replace function public.posts_stamp() returns trigger
language plpgsql security definer set search_path = '' as $$
declare u auth.users;
begin
  if tg_op = 'INSERT' then
    select * into u from auth.users where id = auth.uid();
    new.author_id := auth.uid();
    new.author_name := coalesce(
      u.raw_user_meta_data ->> 'name',
      u.raw_user_meta_data ->> 'full_name',
      split_part(u.email, '@', 1)
    );
    new.created_at := now();
  else
    new.author_id := old.author_id;
    new.author_name := old.author_name;
    new.created_at := old.created_at;
    new.board := old.board;
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists posts_stamp on public.posts;
create trigger posts_stamp before insert or update on public.posts
for each row execute function public.posts_stamp();

-- New Supabase projects don't auto-grant table access to the API roles.
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;

alter table public.posts enable row level security;

drop policy if exists "posts are public" on public.posts;
create policy "posts are public" on public.posts for select using (true);

-- 교회 소식: any signed-in member. 교회 주보: admins only.
drop policy if exists "members write" on public.posts;
create policy "members write" on public.posts for insert to authenticated
with check (
  board = 'news'
  or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "authors edit" on public.posts;
create policy "authors edit" on public.posts for update to authenticated
using (author_id = auth.uid() or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "authors delete" on public.posts;
create policy "authors delete" on public.posts for delete to authenticated
using (author_id = auth.uid() or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Make someone an admin (they must sign out and in again):
-- update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email = 'pastor@example.com';

-- ───────────── 회원 프로필 + 아바타 ─────────────

create table if not exists public.profiles (
  id uuid primary key default auth.uid() references auth.users on delete cascade,
  name text not null check (char_length(name) between 1 and 30),
  phone text check (phone is null or phone ~ '^[0-9+() -]{7,20}$'),
  birthday date check (birthday is null or birthday between '1900-01-01' and current_date),
  address text check (address is null or char_length(address) <= 200),
  avatar_url text,
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
alter table public.profiles enable row level security;

-- 개인정보라서 본인만 보고 고칠 수 있다.
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- 아바타 사진 보관함: 누구나 볼 수 있고, 본인 폴더(<user id>/)에만 올릴 수 있다. 5MB, 이미지만.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "avatar read own" on storage.objects;
create policy "avatar read own" on storage.objects for select to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatar upload own" on storage.objects;
create policy "avatar upload own" on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatar replace own" on storage.objects;
create policy "avatar replace own" on storage.objects for update to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatar delete own" on storage.objects;
create policy "avatar delete own" on storage.objects for delete to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ───────────── 역할: 일반 사용자(읽기) / 로그인 사용자(읽기+댓글) / 관리자(전체 CRUD) ─────────────

create or replace function public.is_admin() returns boolean
language sql stable as $$ select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false) $$;

-- 게시글: 쓰기·수정·삭제는 관리자만 (교회 소식도 관리자 전용으로 변경)
drop policy if exists "members write" on public.posts;
drop policy if exists "authors edit" on public.posts;
drop policy if exists "authors delete" on public.posts;
drop policy if exists "admin write posts" on public.posts;
create policy "admin write posts" on public.posts for insert to authenticated with check (public.is_admin());
drop policy if exists "admin edit posts" on public.posts;
create policy "admin edit posts" on public.posts for update to authenticated using (public.is_admin());
drop policy if exists "admin delete posts" on public.posts;
create policy "admin delete posts" on public.posts for delete to authenticated using (public.is_admin());

-- 댓글: 누구나 읽기, 로그인 사용자 쓰기, 삭제는 관리자만
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.posts on delete cascade,
  content text not null check (char_length(content) between 1 and 1000),
  author_id uuid not null default auth.uid() references auth.users on delete cascade,
  author_name text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments (post_id, created_at);

create or replace function public.comments_stamp() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.author_id := auth.uid();
  new.author_name := coalesce(
    (select p.name from public.profiles p where p.id = auth.uid()),
    (select coalesce(u.raw_user_meta_data ->> 'name', u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1)) from auth.users u where u.id = auth.uid())
  );
  new.created_at := now();
  return new;
end $$;
drop trigger if exists comments_stamp on public.comments;
create trigger comments_stamp before insert on public.comments for each row execute function public.comments_stamp();

grant select on public.comments to anon, authenticated;
grant insert, delete on public.comments to authenticated;
alter table public.comments enable row level security;
drop policy if exists "comments are public" on public.comments;
create policy "comments are public" on public.comments for select using (true);
drop policy if exists "members comment" on public.comments;
create policy "members comment" on public.comments for insert to authenticated with check (auth.uid() is not null);
drop policy if exists "admin delete comments" on public.comments;
create policy "admin delete comments" on public.comments for delete to authenticated using (public.is_admin());

-- 사이트 내용: 교회 정보·표어·소개 문구 (key별 JSON)
create table if not exists public.site_settings (
  key text primary key check (key in ('church', 'theme', 'about')),
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- 예배 시간
create table if not exists public.worship_times (
  id bigint generated always as identity primary key,
  grp text not null check (grp in ('주일 예배', '주중 예배', '주일학교')),
  name text not null check (char_length(name) between 1 and 40),
  ampm text not null check (ampm in ('오전', '오후')),
  time text not null check (time ~ '^([1-9]|1[0-2]):[0-5][0-9]$'),
  sort int not null default 0
);

-- 온라인 예배 영상
create table if not exists public.videos (
  id bigint generated always as identity primary key,
  youtube_id text not null check (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  title text not null check (char_length(title) between 1 and 60),
  grp text not null check (grp in ('주일', '주중')),
  sort int not null default 0
);

grant select on public.site_settings, public.worship_times, public.videos to anon, authenticated;
grant insert, update, delete on public.site_settings, public.worship_times, public.videos to authenticated;
alter table public.site_settings enable row level security;
alter table public.worship_times enable row level security;
alter table public.videos enable row level security;
do $$ declare t text; begin
  foreach t in array array['site_settings', 'worship_times', 'videos'] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format('create policy "admin write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- 회원 목록과 관리자 지정 (관리자만 호출 가능)
create or replace function public.admin_members()
returns table (id uuid, email text, name text, phone text, is_admin boolean, created_at timestamptz, last_sign_in_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'admin only' using errcode = '42501'; end if;
  return query
    select u.id, u.email::text, coalesce(p.name, u.raw_user_meta_data ->> 'name', u.raw_user_meta_data ->> 'full_name'),
           p.phone, coalesce(u.raw_app_meta_data ->> 'role', '') = 'admin', u.created_at, u.last_sign_in_at
    from auth.users u left join public.profiles p on p.id = u.id
    order by u.created_at;
end $$;

create or replace function public.admin_set_role(target uuid, make_admin boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'admin only' using errcode = '42501'; end if;
  if target = auth.uid() and not make_admin then raise exception 'cannot remove own admin role'; end if;
  update auth.users
     set raw_app_meta_data = case when make_admin then raw_app_meta_data || '{"role":"admin"}'
                                  else raw_app_meta_data - 'role' end
   where id = target;
end $$;

revoke execute on function public.admin_members() from public, anon;
revoke execute on function public.admin_set_role(uuid, boolean) from public, anon;
grant execute on function public.admin_members() to authenticated;
grant execute on function public.admin_set_role(uuid, boolean) to authenticated;

-- ───────────── SNS 링크 (화면 오른쪽 고정 아이콘) ─────────────
alter table public.site_settings drop constraint if exists site_settings_key_check;
alter table public.site_settings add constraint site_settings_key_check check (key in ('church', 'theme', 'about', 'social'));
