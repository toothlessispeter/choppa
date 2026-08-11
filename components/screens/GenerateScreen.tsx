"use client";

import { useMemo } from "react";
import { useChoppaStore, generationCost } from "@/lib/store";
import { EXAMPLE_PROMPTS, INSTRUMENTS, INSTRUMENT_LABEL_KO, KEYS, MODES } from "@/lib/data";
import { wave } from "@/lib/wave";
import WaveformBars from "@/components/WaveformBars";
import type { Format } from "@/lib/types";

const FORMATS: { label: Format; desc: string; cost: number }[] = [
  { label: "WAV", desc: "24-bit / 48kHz · lossless", cost: 2 },
  { label: "MP3", desc: "320kbps · for sketching", cost: 1 },
];

export default function GenerateScreen() {
  const s = useChoppaStore();
  const cost = generationCost(s.mode);

  const isPlayingId = (id: string) => s.playing?.id === id;

  // Player "unit" module — reflects either the latest generated result or an
  // empty/idle state before the first generation.
  const unit = useMemo(() => {
    const hasResult = s.results.length > 0;
    const inst = s.picked[0] || "SYNTH";
    const seed = hasResult ? s.results[0].seed : 42;
    const unitId = hasResult ? "r" + s.results[0].tag : "";
    const on = isPlayingId(unitId);

    const rawBars = wave(seed, 72, s.mode === "LOOP" ? "loop" : "oneshot");
    const bars = rawBars.map((h) => (hasResult ? h : Math.round(h * 0.35)));
    const barColorClass = hasResult ? (on ? "bg-accent" : "bg-accent-dim") : "bg-[#232329]";

    const fileName = hasResult
      ? (s.prompt.trim() ? s.prompt.trim().slice(0, 22).replace(/\s+/g, "_") : "untitled") +
        "." +
        s.format.toLowerCase()
      : "no_sample.wav";
    const time = hasResult
      ? (on ? "0:03" : "0:00") + " / " + (s.mode === "LOOP" ? "0:07" : "0:02")
      : "0:00 / 0:00";

    return {
      inst,
      instKo: INSTRUMENT_LABEL_KO[inst],
      file: fileName,
      time,
      bars,
      barColorClass,
      icon: on ? "❙❙" : "▶",
      progress: hasResult ? (on ? "42%" : "0%") : "0%",
      spec: (s.format === "WAV" ? "WAV · 24/48" : "MP3 · 320k") + (s.sendToDaw ? " · DAW" : ""),
      pct: s.busy ? "··%" : hasResult ? "100%" : "--%",
      pctColor: s.busy ? "text-dim" : hasResult ? "text-accent" : "text-mut",
      status: s.busy ? "RENDERING" : hasResult ? "DONE" : "READY",
      play: () =>
        hasResult &&
        s.play({
          id: unitId,
          prompt: s.prompt.trim() || "Untitled prompt",
          meta: s.bpm + " BPM · " + s.musicKey,
          mini: wave(seed, 30, "loop"),
        }),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.results, s.picked, s.mode, s.prompt, s.format, s.sendToDaw, s.busy, s.playing]);

  const busyBars = useMemo(
    () => Array.from({ length: 48 }, (_, i) => ({ h: 12 + ((i * 37) % 40), d: (i % 12) * 0.07 })),
    []
  );

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-[90px] pt-[34px]">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-3.5">
        <h1 className="m-0 text-[clamp(26px,4vw,40px)] font-bold leading-none tracking-[-0.05em]">
          CHOPPA<span className="text-accent">.</span>
        </h1>
        <p className="m-0 text-[13px] text-dim">
          Set a prompt, key and BPM — get DAW-ready WAV / MP3 samples in seconds.
        </p>
      </div>

      <div className="mt-[22px] rounded-2xl border border-line bg-surface p-[clamp(16px,2.4vw,26px)]">
        <div className="mb-[18px] flex items-center justify-between gap-3.5">
          <span className="label-eyebrow">SAMPLE GENERATOR — UNIT 01</span>
          <div className="flex gap-[5px]">
            <span className="h-[7px] w-[7px] rounded-full bg-accent" />
            <span className="h-[7px] w-[7px] rounded-full bg-line-strong" />
            <span className="h-[7px] w-[7px] rounded-full bg-line-strong" />
          </div>
        </div>

        {/* Prompt field */}
        <div className="rounded-[13px] border border-line bg-bg px-[18px] py-4">
          <div className="mb-3 text-center label-eyebrow">PROMPT</div>
          <textarea
            value={s.prompt}
            onChange={(e) => s.setPrompt(e.target.value)}
            rows={2}
            placeholder="e.g. dreamy lo-fi synth loop, tape saturated, slightly detuned"
            className="w-full resize-none bg-transparent font-mono text-[clamp(16px,2.3vw,22px)] leading-[1.4] tracking-[-0.01em] text-fg outline-none"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((ex) => (
            <button
              key={ex.label}
              onClick={() =>
                useChoppaStore.setState({ prompt: ex.label, picked: [ex.instrument], bpm: ex.bpm })
              }
              className="rounded-full border border-line bg-[#101013] px-[13px] py-2 text-[12.5px] text-dim hover:border-accent hover:text-fg"
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Param modules */}
        <div className="mt-3.5 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(228px,1fr))]">
          {/* Virtual instrument */}
          <div className="min-w-0 rounded-[13px] border border-line bg-panel p-[15px] sm:col-span-2">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[12.5px] text-dim">Virtual instrument</span>
              <span className="label-eyebrow">INSTRUMENT</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {INSTRUMENTS.map((t) => {
                const on = s.picked.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => s.toggleInstrument(t)}
                    className={`rounded-[10px] border px-1.5 py-3.5 font-mono text-xs tracking-[0.06em] hover:text-fg ${
                      on ? "border-accent bg-[#191527] text-fg" : "border-line bg-transparent text-mut"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key + mode */}
          <div className="flex min-w-0 flex-col rounded-[13px] border border-line bg-panel p-[15px]">
            <div className="mb-3 label-eyebrow">KEY</div>
            <select
              value={s.musicKey}
              onChange={(e) => s.setKey(e.target.value)}
              className="w-full rounded-[10px] border border-line-strong bg-bg px-3 py-[11px] font-mono text-[15px] font-medium text-fg outline-none"
            >
              {KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <div className="mt-3 flex gap-1.5">
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => s.setMode(m)}
                  className={`flex-1 rounded-full border py-2 font-mono text-[10.5px] tracking-[0.08em] ${
                    s.mode === m ? "border-accent bg-accent text-white" : "border-line-strong bg-transparent text-dim"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* BPM */}
          <div className="flex min-w-0 flex-col rounded-[13px] border border-line bg-panel p-[15px]">
            <div className="label-eyebrow">BPM</div>
            <div className="my-1.5 text-center font-mono text-[clamp(34px,5vw,44px)] font-medium leading-none tracking-[-0.04em] text-accent">
              {s.bpm}
            </div>
            <div className="mb-3 text-center label-eyebrow">BEATS / MIN</div>
            <div className="mt-auto flex gap-2">
              <button
                onClick={s.bpmDown}
                className="flex-1 rounded-[10px] border border-line-strong bg-bg py-2.5 font-mono text-xs font-medium text-[#E3E3E7] hover:border-accent"
              >
                −5
              </button>
              <button
                onClick={s.bpmUp}
                className="flex-1 rounded-[10px] border border-line-strong bg-bg py-2.5 font-mono text-xs font-medium text-[#E3E3E7] hover:border-accent"
              >
                +5
              </button>
            </div>
          </div>

          {/* Output options */}
          <div className="min-w-0 rounded-[13px] border border-line bg-panel p-[15px]">
            <div className="mb-3.5 flex items-baseline justify-between">
              <span className="text-[12.5px] text-dim">Output options</span>
              <span className="label-eyebrow">FORMAT</span>
            </div>
            <div className="mb-3 flex items-center justify-between gap-2.5">
              <span className="text-[12.5px] text-[#E3E3E7]">File format</span>
              <div className="flex overflow-hidden rounded-lg border border-line-strong">
                {FORMATS.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => s.setFormat(f.label)}
                    className={`px-2.5 py-1.5 font-mono text-[10.5px] tracking-[0.06em] ${
                      s.format === f.label ? "bg-accent text-white" : "bg-transparent text-mut"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2.5">
              <span className="text-[12.5px] text-[#E3E3E7]">Send to DAW</span>
              <button
                onClick={s.toggleDaw}
                className="flex w-[52px] rounded-full border border-line-strong bg-bg p-[5px]"
              >
                <span
                  className={`flex-1 rounded-full py-[2px] font-mono text-[9.5px] font-medium ${
                    s.sendToDaw ? "bg-accent text-white" : "text-mut"
                  }`}
                >
                  ON
                </span>
                <span
                  className={`flex-1 rounded-full py-[2px] font-mono text-[9.5px] font-medium ${
                    !s.sendToDaw ? "bg-line-strong text-fg" : "text-mut"
                  }`}
                >
                  OFF
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Generate row */}
        <div className="mt-3.5 flex flex-wrap gap-3">
          <button
            onClick={s.runGenerate}
            disabled={s.busy}
            className="flex flex-[1_1_320px] items-center justify-center gap-3.5 rounded-2xl bg-accent p-5 text-white hover:bg-accent-hover disabled:opacity-70"
          >
            <span className="text-[clamp(16px,2.4vw,20px)] font-bold tracking-[-0.02em]">
              {s.busy ? "GENERATING…" : "Generate"}
            </span>
            <span className="font-mono text-[11px] tracking-[0.14em] opacity-75">−{cost} CR</span>
          </button>
          <div className="flex min-w-[120px] flex-[0_1_150px] flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-panel p-3.5">
            <span className={`font-mono text-xl font-medium tracking-[-0.02em] ${unit.pctColor}`}>{unit.pct}</span>
            <span className="label-eyebrow">{unit.status}</span>
          </div>
        </div>

        {/* Player module */}
        <div className="mt-3 rounded-[13px] border border-line bg-panel p-[clamp(14px,2vw,20px)]">
          <div className="flex flex-wrap items-center gap-[clamp(12px,2vw,20px)]">
            <div className="flex h-[74px] w-[74px] flex-none flex-col items-center justify-center gap-0.5 rounded-full border border-line-strong bg-bg">
              <span className="text-[13px] font-semibold text-[#E3E3E7]">{unit.instKo}</span>
              <span className="font-mono text-[8.5px] tracking-[0.14em] text-mut">{unit.inst}</span>
            </div>
            <div className="min-w-[180px] flex-[1_1_320px]">
              <div className="mb-2.5 flex items-baseline justify-between gap-2.5">
                <span className="font-mono text-xs text-dim">{unit.file}</span>
                <span className="font-mono text-[11px] text-mut">{unit.time}</span>
              </div>
              <WaveformBars
                bars={unit.bars}
                colorClass={unit.barColorClass}
                className="h-16 rounded-[10px] border border-line bg-bg px-0.5"
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={unit.play}
                  className="h-[34px] w-[34px] flex-none rounded-full border border-line-strong bg-bg text-[11px] text-accent hover:border-accent"
                >
                  {unit.icon}
                </button>
                <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-line">
                  <div className="h-full bg-accent" style={{ width: unit.progress }} />
                </div>
              </div>
            </div>
            <div className="flex flex-[0_1_150px] flex-col gap-2">
              <button
                onClick={s.openModal}
                className="rounded-[11px] border border-accent bg-[#191527] py-3.5 text-[13.5px] font-semibold text-accent-soft-fg hover:bg-accent hover:text-white"
              >
                Export
              </button>
              <button
                onClick={s.runGenerate}
                className="rounded-[11px] border border-line-strong bg-transparent py-3.5 font-mono text-[11px] tracking-[0.1em] text-dim hover:border-[#63636C] hover:text-fg"
              >
                ↻ REGEN
              </button>
              <span className="text-center label-eyebrow">{unit.spec}</span>
            </div>
          </div>
        </div>

        {/* Busy / rendering state */}
        {s.busy && (
          <div className="relative mt-3 overflow-hidden rounded-[13px] border border-line bg-panel px-[18px] py-4">
            <div className="absolute left-0 top-0 h-px w-[18%] animate-chp-scan bg-accent" />
            <div className="mb-3.5 label-eyebrow">
              RENDERING · {s.bpm} BPM · {s.musicKey} · 2 VARIATIONS
            </div>
            <div className="flex h-11 items-center gap-0.5">
              {busyBars.map((b, i) => (
                <div
                  key={i}
                  className="flex-1 animate-chp-bar rounded-[1px] bg-[#2E2846]"
                  style={{ height: `${b.h}px`, animationDelay: `${b.d}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {s.results.length > 0 && (
          <div className="mt-3 grid gap-2.5">
            {s.results.map((r) => {
              const id = "r" + r.tag;
              const on = isPlayingId(id);
              const bars = wave(r.seed, 64, s.mode === "LOOP" ? "loop" : "oneshot");
              const label = s.prompt.trim() || "Untitled prompt";
              return (
                <div
                  key={r.tag}
                  className="flex flex-wrap animate-chp-in items-center gap-3.5 rounded-[13px] border border-line bg-panel p-3.5"
                >
                  <button
                    onClick={() =>
                      s.play({ id, prompt: label, meta: s.bpm + " BPM · " + s.musicKey + " · VAR " + r.tag, mini: wave(r.seed, 30, "loop") })
                    }
                    className="h-[38px] w-[38px] flex-none rounded-full border border-accent text-xs"
                    style={{ background: on ? "#8B5CF6" : "transparent", color: on ? "#FFFFFF" : "#8B5CF6" }}
                  >
                    {on ? "❙❙" : "▶"}
                  </button>
                  <WaveformBars
                    bars={bars}
                    colorClass={on ? "bg-accent" : "bg-accent-dim"}
                    className="h-10 min-w-[150px] flex-[1_1_220px]"
                  />
                  <span className="flex-none font-mono text-[11px] tracking-[0.06em] text-dim">
                    VAR {r.tag} · {s.bpm} BPM · {s.musicKey} · {s.mode === "LOOP" ? "0:07" : "0:02"}
                  </span>
                  <div className="flex flex-none gap-2">
                    {/* NOTE: in production, SAVE should persist this result to the
                        user's library via an API call, then route to its detail page. */}
                    <button
                      onClick={() => s.openSample(1)}
                      className="rounded-[10px] border border-line-strong px-3.5 py-2.5 font-mono text-[11px] tracking-[0.08em] text-dim hover:text-fg"
                    >
                      SAVE
                    </button>
                    <button
                      onClick={s.openModal}
                      className="rounded-[10px] bg-[#F5F5F7] px-3.5 py-2.5 font-mono text-[11px] font-semibold tracking-[0.08em] text-bg hover:bg-white"
                    >
                      ↓ {s.format}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="m-0 mt-4 flex items-center gap-3 rounded-[13px] border border-line bg-surface px-4 py-3.5 text-[12.5px] text-dim">
        <span className="flex-none rounded-full bg-[#191527] px-2.5 py-[5px] font-mono text-[10px] tracking-[0.12em] text-accent-soft-fg">
          NEXT
        </span>
        Per-instrument model training is next — genre-aware generation tuned to how each instrument is actually played.
      </p>
    </main>
  );
}
