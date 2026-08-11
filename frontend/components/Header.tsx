"use client";

import { useChoppaStore } from "@/lib/store";
import type { Screen } from "@/lib/types";

export default function Header() {
  const screen = useChoppaStore((s) => s.screen);
  const setScreen = useChoppaStore((s) => s.setScreen);
  const query = useChoppaStore((s) => s.query);
  const setQuery = useChoppaStore((s) => s.setQuery);
  const credits = useChoppaStore((s) => s.credits);

  const tabs: { label: string; value: Screen }[] = [
    { label: "Generate", value: "generate" },
    { label: "Explore", value: "explore" },
  ];

  // "detail" screen highlights the Explore tab, matching where it's reached from.
  const activeTab: Screen = screen === "detail" ? "explore" : screen;

  return (
    <header className="sticky top-0 z-40 flex items-stretch border-b border-line bg-bg">
      <button
        onClick={() => setScreen("generate")}
        className="flex flex-none items-center gap-2.5 border-r border-line px-[18px]"
      >
        <span className="h-[15px] w-[15px] rounded-[5px] bg-accent" />
        <span className="text-[17px] font-bold tracking-[-0.045em]">CHOPPA</span>
      </button>

      <nav className="flex flex-none">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setScreen(t.value)}
            className={`border-r border-line px-[18px] font-mono text-[11px] uppercase tracking-[0.14em] hover:text-fg ${
              activeTab === t.value ? "bg-[#16161A] text-fg" : "bg-transparent text-mut"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="flex min-w-[130px] flex-1 basis-[200px] items-center gap-[9px] border-r border-line px-4 py-[11px]">
        <span className="flex-none font-mono text-[11px] text-mut">SEARCH /</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search prompts, tags, keys"
          className="w-full bg-transparent text-[13.5px] text-fg outline-none"
        />
      </div>

      <div className="flex flex-none items-center gap-2 border-r border-line px-3.5">
        <span className="font-mono text-[10.5px] tracking-[0.1em] text-mut">CREDITS</span>
        <span className="font-mono text-sm font-medium text-accent">{credits}</span>
      </div>

      <button
        onClick={() => setScreen("generate")}
        className="m-2 flex-none whitespace-nowrap rounded-[10px] bg-accent px-[26px] font-mono text-[11px] font-semibold tracking-[0.16em] text-white hover:bg-accent-hover"
      >
        ＋ GENERATE
      </button>

      <div className="flex flex-none items-center border-l border-line px-3.5">
        <div className="flex h-[26px] w-[26px] items-center justify-center border border-line-strong bg-line font-mono text-[10px] font-medium text-dim">
          YJ
        </div>
      </div>
    </header>
  );
}
