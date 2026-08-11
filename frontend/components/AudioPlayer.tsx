"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

interface AudioPlayerProps {
  /** URL of the generated/community sample (S3 presigned URL, etc). */
  audioUrl: string;
  /** Native BPM the file was rendered at. */
  bpm?: number;
  /** Target BPM to preview-match against, e.g. while browsing at a project tempo. */
  targetBpm?: number;
  className?: string;
}

/**
 * Real WaveSurfer.js player for actual audio files, once the generation
 * backend returns a playable URL. Drop this in wherever the design's mock
 * <WaveformBars /> preview needs to become a real, scrubbable player —
 * e.g. the sample detail page once `detail.audioUrl` exists.
 */
export default function AudioPlayer({ audioUrl, bpm, targetBpm, className = "" }: AudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#3A3A41",
      progressColor: "#8B5CF6",
      cursorColor: "#8B5CF6",
      height: 64,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
    });

    ws.load(audioUrl);
    ws.on("ready", () => setDuration(ws.getDuration()));
    ws.on("finish", () => setIsPlaying(false));

    wsRef.current = ws;
    return () => ws.destroy();
  }, [audioUrl]);

  useEffect(() => {
    if (wsRef.current && bpm && targetBpm) {
      wsRef.current.setPlaybackRate(targetBpm / bpm, true);
    }
  }, [bpm, targetBpm]);

  const togglePlay = () => {
    wsRef.current?.playPause();
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className={`flex items-center gap-3 rounded-xl border border-line bg-panel p-3 ${className}`}>
      <button
        onClick={togglePlay}
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-line-strong bg-bg text-accent hover:border-accent"
      >
        {isPlaying ? "❙❙" : "▶"}
      </button>
      <div ref={containerRef} className="flex-1" />
      <span className="w-12 flex-none text-right font-mono text-xs text-mut">{duration.toFixed(1)}s</span>
    </div>
  );
}
