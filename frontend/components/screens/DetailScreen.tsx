"use client";

import { useMemo } from "react";
import { useChoppaStore, generationCost } from "@/lib/store";
import { LIBRARY_SAMPLES } from "@/lib/data";
import { wave } from "@/lib/wave";
import WaveformBars from "@/components/WaveformBars";

export default function DetailScreen() {
  const s = useChoppaStore();
  const cost = generationCost(s.mode);
  const d = LIBRARY_SAMPLES[s.detailIdx] ?? LIBRARY_SAMPLES[0];
  const id = "d" + s.detailIdx;
  const on = s.playing?.id === id;

  const bars = useMemo(() => {
    const raw = wave(s.detailIdx + 11, 108, "loop");
    return raw.map((h, i) => ({
      h,
      colorClass: on && i < 44 ? "bg-accent" : i < 44 ? "bg-accent-dim" : "bg-[#3A3A41]",
    }));
  }, [s.detailIdx, on]);

  const playhead = on ? "0:0" + Math.min(9, Math.round(parseFloat(d.duration.slice(2)) * 0.4)) : "0:00";

  const tags = [
    d.instrument.toLowerCase(),
    d.key === "—" ? "no-key" : d.key.replace(" ", ""),
    d.bpm + "bpm",
    "royalty-free",
  ];

  const metaRows = [
    { k: "BPM", v: String(d.bpm) },
    { k: "KEY", v: d.key },
    { k: "INSTRUMENT", v: d.instrument },
    { k: "DURATION", v: d.duration },
    { k: "FORMAT", v: "WAV 24/48" },
    { k: "CREATED", v: "2026.08.09" },
    { k: "DOWNLOADS", v: String(d.downloads) },
  ];

  const related = LIBRARY_SAMPLES.filter((x) => x.id !== s.detailIdx).slice(0, 4);

  return (
    <main className="pb-[110px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6">
        <button
          onClick={() => s.setScreen("explore")}
          className="py-3.5 font-mono text-[11px] tracking-[0.14em] text-dim hover:text-fg"
        >
          ← LIBRARY
        </button>
        <span className="font-mono text-[10.5px] tracking-[0.14em] text-mut">
          CHP-{1000 + s.detailIdx} · @yj_beats · 2026.08.09
        </span>
      </div>

      <div className="flex flex-wrap items-start">
        <div className="min-w-[290px] flex-[999_1_560px] border-r border-line">
          {/* Prompt hero */}
          <div className="border-b border-line px-6 pb-[22px] pt-[26px]">
            <div className="mb-3.5 font-mono text-[10.5px] tracking-[0.2em] text-mut">ORIGINAL PROMPT</div>
            <p className="m-0 text-[clamp(22px,3.6vw,38px)] font-semibold leading-[1.18] tracking-[-0.035em]">
              {d.prompt}
            </p>
            <div className="mt-[18px] flex flex-wrap gap-3.5">
              {tags.map((t) => (
                <span key={t} className="font-mono text-[11px] tracking-[0.06em] text-dim">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Big waveform */}
          <div className="border-b border-line bg-panel px-6 py-[22px]">
            <div className="flex items-center gap-[clamp(14px,2.4vw,22px)]">
              <button
                onClick={() =>
                  s.play({ id, prompt: d.prompt, meta: d.bpm + " BPM · " + d.key + " · " + d.instrument, mini: wave(s.detailIdx + 3, 30, "loop") })
                }
                className="h-[clamp(52px,7vw,62px)] w-[clamp(52px,7vw,62px)] flex-none rounded-[18px] bg-accent text-lg text-white hover:bg-accent-hover"
              >
                {on ? "❙❙" : "▶"}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex h-[clamp(84px,12vw,112px)] items-center gap-[1.5px]">
                  {bars.map((b, i) => (
                    <div key={i} className={`min-h-[2px] flex-1 ${b.colorClass}`} style={{ height: `${b.h}%` }} />
                  ))}
                </div>
                <div className="mt-2.5 flex justify-between border-t border-line-faint pt-[7px] font-mono text-[10.5px] text-mut">
                  <span>0:00</span>
                  <span className="text-accent">{playhead}</span>
                  <span>{d.duration}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap border-b border-line">
            <button
              onClick={() => s.reuseFromDetail({ prompt: d.prompt, bpm: d.bpm, key: d.key === "—" ? "C min" : d.key, instrument: d.instrument })}
              className="m-3.5 ml-4 flex flex-[1_1_300px] items-center justify-between gap-3.5 rounded-2xl bg-accent px-[22px] py-[18px] text-white hover:bg-accent-hover"
            >
              <span className="text-[clamp(16px,2.4vw,21px)] font-bold tracking-[-0.03em]">Regenerate from this prompt</span>
              <span className="border border-white/45 px-2 py-1 font-mono text-[11.5px]">−{cost} CR</span>
            </button>
            <button
              onClick={s.openModal}
              className="m-3.5 flex-[1_1_150px] rounded-2xl border-l border-line px-[18px] py-5 font-mono text-xs tracking-[0.12em] text-fg hover:bg-[#16161A] hover:text-accent"
            >
              ↓ DOWNLOAD
            </button>
            <button className="flex-none border-l border-line px-[22px] py-5 text-[15px] text-dim hover:text-accent">♥</button>
          </div>

          <div>
            <div className="flex items-baseline justify-between px-6 pb-3 pt-5">
              <span className="font-mono text-[10.5px] tracking-[0.2em] text-mut">RELATED</span>
              <span className="font-mono text-[10.5px] text-mut">SAME KEY · ±6 BPM</span>
            </div>
            {related.map((x) => (
              <article
                key={x.id}
                onClick={() => s.openSample(x.id)}
                className="flex cursor-pointer items-center gap-3.5 border-t border-line px-6 py-[13px] hover:bg-[#16161A]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    s.play({ id: "s" + x.id, prompt: x.prompt, meta: x.bpm + " BPM · " + x.key + " · " + x.instrument, mini: wave(x.id + 3, 30, "loop") });
                  }}
                  className="h-7 w-7 flex-none rounded-[9px] border border-line-strong text-[10px] text-accent"
                >
                  ▶
                </button>
                <div className="min-w-0 flex-[1_1_160px] overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] text-[#E3E3E7]">
                  {x.prompt}
                </div>
                <WaveformBars bars={wave(x.id + 3, 22, "loop")} colorClass="bg-[#3A3A41]" className="h-6 w-[88px] flex-none" />
                <span className="flex-none font-mono text-[10.5px] tracking-[0.06em] text-mut">
                  {x.bpm} · {x.key} · {x.instrument}
                </span>
              </article>
            ))}
          </div>
        </div>

        <aside className="max-w-[320px] min-w-[220px] flex-[1_1_250px] self-stretch">
          <div className="px-5 pb-2 pt-5 font-mono text-[10.5px] tracking-[0.2em] text-mut">METADATA</div>
          {metaRows.map((m) => (
            <div key={m.k} className="flex items-baseline justify-between gap-3 border-t border-line-faint px-5 py-3">
              <span className="font-mono text-[11px] tracking-[0.1em] text-mut">{m.k}</span>
              <span className="text-right font-mono text-sm font-medium text-fg">{m.v}</span>
            </div>
          ))}
          <div className="mt-1.5 border-t border-line px-5 py-[18px]">
            <div className="text-[12.5px] leading-[1.55] text-dim">
              AI-generated audio. <span className="text-fg">Royalty-free</span> for any use, including commercial releases.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
