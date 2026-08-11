"use client";

import { useChoppaStore } from "@/lib/store";

export default function TransportBar() {
  const s = useChoppaStore();
  if (!s.playerOpen || !s.playing) return null;
  const nowPlaying = s.playing;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center border-t border-line-strong bg-panel">
      <button
        onClick={() => s.play(nowPlaying)}
        className="h-14 w-14 flex-none border-r border-line text-sm text-accent hover:bg-[#16161A]"
      >
        {s.playing ? "❙❙" : "▶"}
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-3.5 overflow-hidden px-4">
        <span className="min-w-[60px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-[#E3E3E7]">
          {nowPlaying.prompt}
        </span>
        <span className="flex-none font-mono text-[10.5px] tracking-[0.08em] text-mut">{nowPlaying.meta}</span>
      </div>
      <button
        onClick={s.openModal}
        className="h-14 flex-none border-l border-line px-[18px] font-mono text-[11px] tracking-[0.1em] text-dim hover:text-accent"
      >
        ↓ SAVE
      </button>
      <button
        onClick={s.closePlayer}
        className="h-14 w-[46px] flex-none border-l border-line text-[13px] text-mut hover:text-fg"
      >
        ✕
      </button>
    </div>
  );
}
