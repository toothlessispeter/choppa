"use client";

import { useChoppaStore } from "@/lib/store";
import Header from "@/components/Header";
import GenerateScreen from "@/components/screens/GenerateScreen";
import ExploreScreen from "@/components/screens/ExploreScreen";
import DetailScreen from "@/components/screens/DetailScreen";
import TransportBar from "@/components/TransportBar";
import DownloadModal from "@/components/DownloadModal";

export default function Page() {
  const screen = useChoppaStore((s) => s.screen);

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      {screen === "generate" && <GenerateScreen />}
      {screen === "explore" && <ExploreScreen />}
      {screen === "detail" && <DetailScreen />}
      <TransportBar />
      <DownloadModal />
    </div>
  );
}
