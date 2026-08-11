import type { Instrument, LibrarySample, Mode, SortOption } from "./types";

export const KEYS = [
  "C min", "C maj", "C# min", "D min", "D maj", "Eb min", "E min", "E maj",
  "F min", "F maj", "F# min", "G min", "G maj", "Ab min", "A min", "A maj",
  "Bb min", "B min",
];

export const INSTRUMENTS: Instrument[] = ["BASS", "SYNTH", "GUITAR", "DRUMS", "PAD", "FX"];

export const INSTRUMENT_LABEL_KO: Record<Instrument, string> = {
  BASS: "Bass",
  SYNTH: "Synth",
  GUITAR: "Guitar",
  DRUMS: "Drums",
  PAD: "Pad",
  FX: "FX",
};

export const MODES: Mode[] = ["LOOP", "ONE-SHOT"];

export const SORT_OPTIONS: SortOption[] = ["Newest", "Popular", "Most downloaded"];

export const EXAMPLE_PROMPTS: { label: string; instrument: Instrument; bpm: number }[] = [
  { label: "Heavy distorted 808 bass", instrument: "BASS", bpm: 140 },
  { label: "Dreamy lo-fi synth chords", instrument: "SYNTH", bpm: 82 },
  { label: "Shoegaze guitar riff", instrument: "GUITAR", bpm: 96 },
];

export const FORMAT_COST: Record<"WAV" | "MP3", number> = { WAV: 2, MP3: 1 };

/** Mock community library — replace with a real API fetch (e.g. GET /api/samples). */
export const LIBRARY_SAMPLES: LibrarySample[] = [
  { id: 0, prompt: "Deep sub-heavy 808 bass with light distortion", instrument: "BASS", bpm: 140, key: "C min", duration: "0:04", downloads: 1284 },
  { id: 1, prompt: "Dreamy lo-fi synth chords, tape saturated", instrument: "SYNTH", bpm: 82, key: "F maj", duration: "0:11", downloads: 942 },
  { id: 2, prompt: "Shoegaze guitar riff drowned in reverb, 8 bars", instrument: "GUITAR", bpm: 96, key: "E min", duration: "0:20", downloads: 761 },
  { id: 3, prompt: "Vintage drum machine break with a light swing", instrument: "DRUMS", bpm: 92, key: "—", duration: "0:10", downloads: 2103 },
  { id: 4, prompt: "Warm analog pad, slowly opening filter", instrument: "PAD", bpm: 74, key: "A min", duration: "0:16", downloads: 508 },
  { id: 5, prompt: "Metallic impact FX, long reverse reverb tail", instrument: "FX", bpm: 120, key: "—", duration: "0:03", downloads: 377 },
  { id: 6, prompt: "Plucked synth arpeggio, dotted 1/8 delay", instrument: "SYNTH", bpm: 128, key: "G min", duration: "0:07", downloads: 1655 },
  { id: 7, prompt: "Funky slap bass groove, played live", instrument: "BASS", bpm: 108, key: "Bb min", duration: "0:09", downloads: 690 },
  { id: 8, prompt: "Tokyo city-pop electric guitar backing", instrument: "GUITAR", bpm: 112, key: "D maj", duration: "0:14", downloads: 431 },
  { id: 9, prompt: "Tight trap hi-hat rolls in triplets", instrument: "DRUMS", bpm: 146, key: "—", duration: "0:05", downloads: 1877 },
  { id: 10, prompt: "Cold ambient texture, granular delay", instrument: "PAD", bpm: 68, key: "C# min", duration: "0:24", downloads: 289 },
  { id: 11, prompt: "Jazz piano loop over lo-fi vinyl crackle", instrument: "SYNTH", bpm: 88, key: "Eb min", duration: "0:12", downloads: 1122 },
];
