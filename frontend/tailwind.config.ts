import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#08080A", // page background
        surface: "#0E0E12", // generator shell / callouts
        panel: "#101013", // module cards
        line: "#1E1E22", // default hairline border
        "line-strong": "#2C2C32", // inputs, stronger borders
        "line-faint": "#191A1D", // sub dividers
        fg: "#F5F5F7", // primary text
        dim: "#9A9AA4", // secondary text
        mut: "#63636C", // muted labels / eyebrows
        accent: "#8B5CF6", // brand violet
        "accent-hover": "#A78BFA",
        "accent-soft": "#191527", // active pill bg
        "accent-soft-fg": "#C4B5FD",
        "accent-dim": "#4A3E7A", // inactive waveform fill
      },
      fontFamily: {
        sans: ["var(--font-instrument-sans)", "Helvetica", "Arial", "sans-serif"],
        mono: ["var(--font-spline-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "chp-bar": {
          "0%, 100%": { transform: "scaleY(.25)" },
          "50%": { transform: "scaleY(1)" },
        },
        "chp-scan": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(400%)" },
        },
        "chp-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "chp-bar": "chp-bar 1.05s ease-in-out infinite",
        "chp-scan": "chp-scan 1.4s linear infinite",
        "chp-in": "chp-in .35s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
