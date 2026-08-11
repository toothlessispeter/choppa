"use client";

import { useChoppaStore } from "@/lib/store";
import { FORMAT_COST } from "@/lib/data";
import type { Format } from "@/lib/types";

const FORMATS: { label: Format; desc: string }[] = [
  { label: "WAV", desc: "24-bit / 48kHz · lossless" },
  { label: "MP3", desc: "320kbps · for sketching" },
];

export default function DownloadModal() {
  const s = useChoppaStore();
  if (!s.modal) return null;

  const balanceAfter = Math.max(0, s.credits - FORMAT_COST[s.format]);

  return (
    <div
      onClick={s.closeModal}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-[22px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] animate-chp-in overflow-hidden rounded-[18px] border border-line-strong bg-panel"
      >
        <div className="flex items-center justify-between border-b border-line px-[18px] py-[15px]">
          <span className="font-mono text-[11px] tracking-[0.18em] text-dim">EXPORT</span>
          <button onClick={s.closeModal} className="text-[13px] text-mut hover:text-fg">
            ✕
          </button>
        </div>

        {FORMATS.map((f) => {
          const active = s.format === f.label;
          return (
            <button
              key={f.label}
              onClick={() => s.setFormat(f.label)}
              className={`flex w-full items-center justify-between gap-3 border-b border-line px-[18px] py-4 text-left hover:bg-[#16161A] ${
                active ? "bg-[#16161A]" : "bg-transparent"
              }`}
            >
              <span>
                <span className={`block font-mono text-[15px] tracking-[0.04em] ${active ? "text-fg" : "text-dim"}`}>
                  {active ? "◼" : "◻"} {f.label}
                </span>
                <span className="mt-1 block text-xs text-dim">{f.desc}</span>
              </span>
              <span className={`font-mono text-xs ${active ? "text-accent" : "text-mut"}`}>−{FORMAT_COST[f.label]} CR</span>
            </button>
          );
        })}

        <div className="flex items-baseline justify-between border-b border-line px-[18px] py-3.5">
          <span className="font-mono text-[11px] tracking-[0.1em] text-mut">BALANCE AFTER</span>
          <span className="font-mono text-base font-medium text-accent">{balanceAfter} CR</span>
        </div>

        <div className="flex">
          <button
            onClick={s.closeModal}
            className="flex-[0_1_120px] border-r border-line py-[15px] font-mono text-[11.5px] tracking-[0.12em] text-dim hover:text-fg"
          >
            CANCEL
          </button>
          <button
            onClick={s.confirmDownload}
            className="flex-1 bg-accent py-[15px] font-mono text-[11.5px] font-bold tracking-[0.14em] text-white hover:bg-accent-hover"
          >
            CONFIRM DOWNLOAD
          </button>
        </div>
      </div>
    </div>
  );
}
