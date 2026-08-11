/**
 * Deterministic pseudo-waveform generator used for preview bars before a
 * sample has real decoded peak data attached to it.
 *
 * Swap `wave()` calls for real peaks once the backend returns them (e.g. via
 * WaveSurfer's `ws.exportPeaks()` after loading the actual audio file — see
 * components/AudioPlayer.tsx for a real WaveSurfer.js integration).
 */
function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function wave(seed: number, n: number, shape: "loop" | "oneshot"): number[] {
  const r = rng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const env =
      shape === "oneshot"
        ? Math.pow(1 - t, 1.9)
        : 0.55 + 0.45 * Math.sin(t * Math.PI * 4.2);
    const v = (0.28 + 0.72 * r()) * env;
    out.push(Math.max(4, Math.round(v * 100)));
  }
  return out;
}
