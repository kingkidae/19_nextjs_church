"use client";

import Image from "next/image";
import { useState } from "react";
import { VIDEO_GROUPS, type Content } from "../_lib/church";

// Loads the YouTube iframe only after the viewer presses play.
export default function VideoPlayer({ videos }: { videos: Content["videos"] }) {
  const [current, setCurrent] = useState(videos[0]);
  const [playing, setPlaying] = useState(false);
  if (!current) return <p className="font-serif text-champagne/70">아직 등록된 예배 영상이 없습니다.</p>;

  return (
    <div className="grid h-full min-h-0 w-full items-center gap-[clamp(1rem,3vw,3rem)] lg:grid-cols-[1fr_minmax(15rem,22rem)]">
      <div className="relative mx-auto aspect-video w-full max-w-[calc((100svh-var(--nav-h)-15rem)*16/9)] overflow-hidden rounded-[clamp(8px,1vw,14px)] bg-mocha-night shadow-[0_40px_80px_-30px_rgb(20_14_8/0.9)] lg:max-w-[calc((100svh-var(--nav-h)-9rem)*16/9)]">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${current.youtube_id}?autoplay=1&rel=0`}
            title={current.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button onClick={() => setPlaying(true)} className="group absolute inset-0" aria-label={`${current.title} 재생`}>
            <Image
              src={`https://i.ytimg.com/vi/${current.youtube_id}/maxresdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-mocha-night/80 via-transparent" />
            <span className="absolute bottom-[6%] left-[5%] flex items-center gap-4 text-left">
              <span className="grid size-[clamp(2.75rem,7svh,4rem)] place-items-center rounded-full bg-amber text-mocha-night transition-transform duration-300 group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="ml-0.5 size-[40%]" aria-hidden>
                  <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
                </svg>
              </span>
              <span className="font-serif text-[clamp(1.1rem,3svh,1.75rem)] text-champagne">{current.title}</span>
            </span>
          </button>
        )}
      </div>

      <div className="grid gap-[2svh] sm:grid-cols-2 lg:grid-cols-1">
        {VIDEO_GROUPS.map((g) => (
          <div key={g}>
            <p className="mb-[0.8svh] text-[0.8rem] text-champagne/55">{g} 예배</p>
            <ul className="border-t border-champagne/15">
              {videos
                .filter((v) => v.grp === g)
                .map((v) => (
                  <li key={v.youtube_id} className="border-b border-champagne/15">
                    <button
                      onClick={() => {
                        setCurrent(v);
                        setPlaying(true);
                      }}
                      aria-current={v.youtube_id === current.youtube_id}
                      className="flex w-full items-center justify-between py-[clamp(0.45rem,1.4svh,0.9rem)] text-left font-serif text-[clamp(0.95rem,2.2svh,1.2rem)] text-champagne/75 transition-colors hover:text-champagne aria-[current=true]:text-amber"
                    >
                      {v.title}
                      {playing && v.youtube_id === current.youtube_id && <span className="text-xs">재생 중</span>}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
