import EmulatorSection from "@/components/emulator-section"
import RoadmapSection from "@/components/roadmap-section"
import Navigation from "@/components/navigation"
import WalletProvider from "@/components/wallet-provider"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Web3 Gaming Experience",
  description: "Play retro games and earn crypto rewards",
}

export default function Home() {
  return (
    <WalletProvider>
      <main className="min-h-screen bg-black text-white overflow-hidden">
        <Navigation />
        <EmulatorSection />
        <RoadmapSection />
      </main>
    </WalletProvider>
  )
}

