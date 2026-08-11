export type Screen = "generate" | "explore" | "detail";

export type Instrument = "BASS" | "SYNTH" | "GUITAR" | "DRUMS" | "PAD" | "FX";

export type Mode = "LOOP" | "ONE-SHOT";

export type SortOption = "Newest" | "Popular" | "Most downloaded";

export type Format = "WAV" | "MP3";

/** A sample in the community library (mock data / API response shape). */
export interface LibrarySample {
  id: number;
  prompt: string;
  instrument: Instrument;
  bpm: number;
  key: string; // musical key, e.g. "C min" — "—" when the sound is unpitched
  duration: string; // "0:04"
  downloads: number;
}

/** A single generated variation returned from a generate request. */
export interface GeneratedResult {
  tag: string; // "A" | "B" ...
  seed: number;
}

/** Now-playing state surfaced in the bottom transport bar. */
export interface NowPlaying {
  id: string;
  prompt: string;
  meta: string;
  mini: number[];
}
