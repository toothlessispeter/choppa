"use client";

import { create } from "zustand";
import type { Format, GeneratedResult, Instrument, Mode, NowPlaying, Screen, SortOption } from "./types";

interface ChoppaState {
  screen: Screen;
  prompt: string;
  query: string;
  bpm: number;
  bpmMax: number;
  musicKey: string;
  mode: Mode;
  picked: Instrument[];
  sort: SortOption;
  busy: boolean;
  results: GeneratedResult[];
  credits: number;
  playing: NowPlaying | null;
  playerOpen: boolean;
  modal: boolean;
  format: Format;
  sendToDaw: boolean;
  detailIdx: number;
  stamp: string;

  // actions
  setScreen: (screen: Screen) => void;
  setPrompt: (prompt: string) => void;
  setQuery: (query: string) => void;
  setBpm: (bpm: number) => void;
  bpmDown: () => void;
  bpmUp: () => void;
  setBpmMax: (bpmMax: number) => void;
  setKey: (key: string) => void;
  setMode: (mode: Mode) => void;
  toggleInstrument: (instrument: Instrument) => void;
  setSort: (sort: SortOption) => void;
  toggleDaw: () => void;
  setFormat: (format: Format) => void;
  runGenerate: () => void;
  play: (item: NowPlaying) => void;
  closePlayer: () => void;
  openSample: (idx: number) => void;
  openModal: () => void;
  closeModal: () => void;
  confirmDownload: () => void;
  reuseFromDetail: (params: { prompt: string; bpm: number; key: string; instrument: Instrument }) => void;
}

/** Cost in credits per generation, based on output mode. */
export function generationCost(mode: Mode) {
  return mode === "LOOP" ? 4 : 2;
}

let generateTimer: ReturnType<typeof setTimeout> | null = null;

export const useChoppaStore = create<ChoppaState>((set, get) => ({
  screen: "generate",
  prompt: "",
  query: "",
  bpm: 128,
  bpmMax: 180,
  musicKey: "C min",
  mode: "LOOP",
  picked: ["SYNTH"],
  sort: "Newest",
  busy: false,
  results: [],
  credits: 240,
  playing: null,
  playerOpen: false,
  modal: false,
  format: "WAV",
  sendToDaw: true,
  detailIdx: 1,
  stamp: "",

  setScreen: (screen) => set({ screen }),
  setPrompt: (prompt) => set({ prompt }),
  setQuery: (query) => set({ query }),
  setBpm: (bpm) => set({ bpm }),
  bpmDown: () => set((s) => ({ bpm: Math.max(60, s.bpm - 5) })),
  bpmUp: () => set((s) => ({ bpm: Math.min(180, s.bpm + 5) })),
  setBpmMax: (bpmMax) => set({ bpmMax }),
  setKey: (musicKey) => set({ musicKey }),
  setMode: (mode) => set({ mode }),
  toggleInstrument: (instrument) =>
    set((s) => ({
      picked: s.picked.includes(instrument)
        ? s.picked.filter((x) => x !== instrument)
        : [...s.picked, instrument],
    })),
  setSort: (sort) => set({ sort }),
  toggleDaw: () => set((s) => ({ sendToDaw: !s.sendToDaw })),
  setFormat: (format) => set({ format }),

  /**
   * Kicks off a generation request. Today this simulates latency with a
   * timeout; swap the body of the timeout for a real call, e.g.:
   *
   *   const res = await fetch("/api/generate", { method: "POST", body: ... });
   *   const { jobId } = await res.json();
   *   // then subscribe to SSE/WebSocket progress at /api/generate/:jobId/stream
   */
  runGenerate: () => {
    if (get().busy) return;
    set({ busy: true, results: [] });
    if (generateTimer) clearTimeout(generateTimer);
    generateTimer = setTimeout(() => {
      const seed = Math.floor(Math.random() * 900) + 10;
      const cost = generationCost(get().mode);
      set((s) => ({
        busy: false,
        credits: Math.max(0, s.credits - cost),
        stamp: new Date().toTimeString().slice(0, 8),
        results: [
          { tag: "A", seed },
          { tag: "B", seed: seed + 37 },
        ],
      }));
    }, 2100);
  },

  play: (item) =>
    set((s) => ({
      playing: s.playing && s.playing.id === item.id ? null : item,
      playerOpen: true,
    })),

  closePlayer: () => set({ playerOpen: false, playing: null }),

  openSample: (idx) => set({ screen: "detail", detailIdx: idx }),

  openModal: () => set({ modal: true }),
  closeModal: () => set({ modal: false }),

  confirmDownload: () =>
    set((s) => ({
      modal: false,
      credits: Math.max(0, s.credits - FORMAT_COST_LOOKUP[s.format]),
    })),

  reuseFromDetail: ({ prompt, bpm, key, instrument }) => {
    set({ screen: "generate", prompt, bpm, musicKey: key, picked: [instrument] });
    get().runGenerate();
  },
}));

const FORMAT_COST_LOOKUP: Record<Format, number> = { WAV: 2, MP3: 1 };
