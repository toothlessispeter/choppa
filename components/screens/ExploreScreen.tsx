"use client";

import { useMemo } from "react";
import { useChoppaStore } from "@/lib/store";
import { INSTRUMENTS, KEYS, LIBRARY_SAMPLES, MODES, SORT_OPTIONS } from "@/lib/data";
import { wave } from "@/lib/wave";
import WaveformBars from "@/components/WaveformBars";

export default function ExploreScreen() {
  const s = useChoppaStore();

  const filtered = useMemo(() => {
    const q = s.query.trim().toLowerCase();
    return LIBRARY_SAMPLES.filter((x) => x.bpm <= s.bpmMax)
      .filter((x) => !s.picked.length || s.picked.includes(x.instrument))
      .filter((x) => !q || (x.prompt + x.instrument + x.key).toLowerCase().includes(q))
      .sort((a, b) => {
        if (s.sort === "Most downloaded") return b.downloads - a.downloads;
        if (s.sort === "Popular") return (b.downloads % 700) - (a.downloads % 700);
        return a.id - b.id;
      });
  }, [s.bpmMax, s.picked, s.query, s.sort]);

  const filterLabel = (s.picked.length ? s.picked.join("/") : "ALL") + " · ≤" + s.bpmMax + "BPM · " + s.sort;

  return (
    <main className="flex flex-wrap items-start pb-[110px]">
      {/* Filters */}
      <aside className="max-w-[250px] min-w-[190px] flex-[1_1_210px] self-stretch border-r border-line">
        <div className="border-b border-line p-[18px]">
          <div className="mb-[11px] label-eyebrow">INSTRUMENT</div>
          <div className="flex flex-col">
            {INSTRUMENTS.map((t) => {
              const on = s.picked.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => s.toggleInstrument(t)}
                  className={`flex items-center gap-2.5 py-1.5 text-left text-[13px] hover:text-fg ${
                    on ? "text-fg" : "text-mut"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 flex-none rounded-[3px] border ${
                      on ? "border-accent bg-accent" : "border-[#3A3A41] bg-transparent"
                    }`}
                  />
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-b border-line p-[18px]">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="label-eyebrow">BPM ≤</span>
            <span className="font-mono text-[15px] font-medium text-accent">{s.bpmMax}</span>
          </div>
          <input
            type="range"
            min={60}
            max={180}
            value={s.bpmMax}
            onChange={(e) => s.setBpmMax(+e.target.value)}
            className="w-full"
          />
        </div>

        <div className="border-b border-line p-[18px]">
          <div className="mb-2.5 label-eyebrow">KEY</div>
          <select
            value={s.musicKey}
            onChange={(e) => s.setKey(e.target.value)}
            className="w-full border-b border-line-strong bg-transparent py-1.5 font-mono text-base font-medium text-fg outline-none"
          >
            {KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="border-b border-line p-[18px]">
          <div className="mb-2 label-eyebrow">SORT</div>
          <div className="flex flex-col">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => s.setSort(opt)}
                className={`py-1.5 text-left text-[13px] hover:text-fg ${s.sort === opt ? "text-accent" : "text-mut"}`}
              >
                {s.sort === opt ? "▸" : " "} {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="p-[18px]">
          <div className="mb-3 text-[13px] leading-[1.5] text-dim">
            Nothing here sounds right? Write a prompt and make your own.
          </div>
          <button
            onClick={() => s.setScreen("generate")}
            className="w-full rounded-[11px] border border-accent bg-transparent py-3 font-mono text-[11px] font-semibold tracking-[0.14em] text-accent hover:bg-accent hover:text-white"
          >
            ＋ GENERATE
          </button>
        </div>
      </aside>

      {/* Grid */}
      <section className="min-w-[290px] flex-[999_1_520px]">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-6 pb-4 pt-5">
          <div>
            <div className="mb-2 font-mono text-[10.5px] tracking-[0.2em] text-mut">01 / LIBRARY</div>
            <h1 className="m-0 text-[clamp(26px,4.4vw,42px)] font-bold leading-none tracking-[-0.045em]">EXPLORE</h1>
          </div>
          <div className="flex items-end gap-4">
            <div className="text-right font-mono text-[11px] leading-[1.6] text-mut">
              {String(filtered.length).padStart(2, "0")} SAMPLES
              <br />
              {filterLabel}
            </div>
            <div className="flex gap-0.5 rounded-[11px] border border-line-strong p-0.5">
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => s.setMode(m)}
                  className={`rounded-lg px-3.5 py-2 font-mono text-[10.5px] tracking-[0.1em] ${
                    s.mode === m ? "bg-accent text-white" : "bg-transparent text-dim"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(268px,1fr))]">
          {filtered.map((x) => {
            const id = "s" + x.id;
            const on = s.playing?.id === id;
            const bars = wave(x.id + 3, 44, x.duration === "0:03" || x.duration === "0:05" ? "oneshot" : "loop");
            const downloads = x.downloads >= 1000 ? (x.downloads / 1000).toFixed(1) + "k" : String(x.downloads);
            return (
              <article
                key={x.id}
                onClick={() => s.openSample(x.id)}
                className={`cursor-pointer border-b border-r border-line px-4 pb-[13px] pt-[15px] hover:bg-[#16161A] ${
                  on ? "bg-[#16161A]" : "bg-transparent"
                }`}
              >
                <div className="mb-[11px] flex items-center justify-between font-mono text-[10px] tracking-[0.1em] text-mut">
                  <span>
                    {String(x.id + 1).padStart(3, "0")} · {x.instrument}
                  </span>
                  <span>{x.duration}</span>
                </div>
                <div className="mb-3 flex items-center gap-[11px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      s.play({ id, prompt: x.prompt, meta: x.bpm + " BPM · " + x.key + " · " + x.instrument, mini: wave(x.id + 3, 30, "loop") });
                    }}
                    className={`h-[30px] w-[30px] flex-none rounded-[10px] border text-[11px] ${
                      on ? "border-accent bg-accent text-white" : "border-line-strong bg-transparent text-accent"
                    }`}
                  >
                    {on ? "❙❙" : "▶"}
                  </button>
                  <WaveformBars bars={bars} colorClass={on ? "bg-accent" : "bg-[#3A3A41]"} className="h-[34px] flex-1" />
                </div>
                <div className="h-[39px] overflow-hidden text-[13.5px] leading-[1.42] text-[#E3E3E7]">{x.prompt}</div>
                <div className="mt-3 flex items-center justify-between border-t border-line-faint pt-2.5">
                  <span className="font-mono text-[11px] tracking-[0.06em] text-dim">
                    {x.bpm} BPM · {x.key}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      s.openModal();
                    }}
                    className="p-0 font-mono text-[11px] tracking-[0.08em] text-mut hover:text-accent"
                  >
                    ↓ {downloads}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
