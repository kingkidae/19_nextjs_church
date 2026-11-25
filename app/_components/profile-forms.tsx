"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { saveProfile, uploadAvatar } from "../_lib/profile-actions";
import type { Profile } from "../_lib/supabase";

export function AvatarForm({ url, name }: { url: string | null; name: string }) {
  const [state, action, pending] = useActionState(uploadAvatar, undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const [badFile, setBadFile] = useState<string | null>(null);
  const src = preview ?? url;

  return (
    <form action={action} className="flex flex-col items-center gap-[2svh] lg:items-start">
      <div className="arch relative aspect-[3/4] h-[clamp(9rem,34svh,22rem)] overflow-hidden bg-mocha-night ring-1 ring-champagne/20">
        {src ? (
          <Image src={src} alt={`${name}님 프로필 사진`} fill sizes="18rem" unoptimized={src.startsWith("blob:")} className="object-cover" />
        ) : (
          <span aria-hidden className="absolute inset-0 grid place-items-center font-serif text-[clamp(3rem,12svh,6rem)] text-champagne/40">
            {name.slice(0, 1)}
          </span>
        )}
        {pending && <span className="absolute inset-0 grid place-items-center bg-mocha-night/60 text-sm">올리는 중…</span>}
      </div>
      <label className="cursor-pointer rounded-full border border-champagne/40 px-5 py-2 text-sm transition-colors hover:border-amber hover:text-amber has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber">
        사진 바꾸기
        <input
          type="file"
          name="avatar"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            // same checks as the server, so a bad file never shows a broken preview
            const bad = !/^image\/(jpeg|png|webp|gif)$/.test(f.type)
              ? "JPG, PNG, WEBP, GIF 사진만 올릴 수 있습니다."
              : f.size > 5 * 1024 * 1024
                ? "사진은 5MB 이하만 올릴 수 있습니다."
                : null;
            setBadFile(bad);
            if (bad) return void (e.target.value = "");
            setPreview(URL.createObjectURL(f));
            e.target.form?.requestSubmit();
          }}
        />
      </label>
      <p role="status" className="min-h-5 text-sm">
        {badFile ? (
          <span className="text-amber">{badFile}</span>
        ) : state?.error ? (
          <span className="text-amber">{state.error}</span>
        ) : (
          <span className="text-champagne/70">{state?.notice ?? "JPG, PNG, WEBP, GIF · 5MB까지"}</span>
        )}
      </p>
    </form>
  );
}

export function ProfileForm({ profile, fallbackName, email, welcome, next }: { profile: Profile | null; fallbackName: string; email: string; welcome: boolean; next: string }) {
  const [state, action, pending] = useActionState(saveProfile, undefined);
  return (
    <form action={action} className="grid gap-[1.8svh]">
      {welcome && (
        <>
          <input type="hidden" name="welcome" value="1" />
          <input type="hidden" name="next" value={next} />
        </>
      )}
      <label className="grid gap-1.5 text-sm">
        이메일
        <input value={email} readOnly className="field-dark opacity-60" />
      </label>
      <label className="grid gap-1.5 text-sm">
        이름 <span className="sr-only">(필수)</span>
        <input name="name" required maxLength={30} defaultValue={state?.values?.name ?? profile?.name ?? fallbackName} autoComplete="name" className="field-dark" />
      </label>
      <div className="grid gap-[1.8svh] sm:grid-cols-2 sm:gap-4">
        <label className="grid gap-1.5 text-sm">
          휴대폰
          <input name="phone" type="tel" inputMode="tel" maxLength={20} placeholder="010-0000-0000" defaultValue={state?.values?.phone ?? profile?.phone ?? ""} autoComplete="tel" className="field-dark placeholder:text-champagne/30" />
        </label>
        <label className="grid gap-1.5 text-sm">
          생년월일
          <input name="birthday" type="date" min="1900-01-01" defaultValue={state?.values?.birthday ?? profile?.birthday ?? ""} autoComplete="bday" className="field-dark [color-scheme:dark]" />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        주소
        <input name="address" maxLength={200} defaultValue={state?.values?.address ?? profile?.address ?? ""} autoComplete="street-address" className="field-dark" />
      </label>
      <div className="flex flex-wrap items-center gap-4 pt-[0.5svh]">
        <button disabled={pending} className="rounded-full bg-amber px-7 py-3 text-sm font-medium text-mocha-night transition-colors hover:bg-champagne disabled:opacity-60">
          {pending ? "저장하는 중…" : welcome ? "저장하고 시작하기" : "저장하기"}
        </button>
        <p role="status" className={state?.error ? "text-sm text-amber" : "text-sm text-champagne/75"}>
          {state?.error ?? state?.notice}
        </p>
      </div>
    </form>
  );
}
