interface WaveformBarsProps {
  bars: number[]; // 0-100 heights
  colorClass?: string; // tailwind bg-* class applied to every bar
  className?: string;
}

/**
 * Renders a static bar-chart waveform preview from an array of 0-100 values.
 * For real decoded audio, prefer <AudioPlayer /> (WaveSurfer.js) instead —
 * this component is for lightweight previews (cards, mini players, hero).
 */
export default function WaveformBars({ bars, colorClass = "bg-line-strong", className = "" }: WaveformBarsProps) {
  return (
    <div className={`flex items-center gap-[1.5px] ${className}`}>
      {bars.map((h, i) => (
        <div
          key={i}
          className={`flex-1 min-h-[2px] rounded-[1px] ${colorClass}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}
