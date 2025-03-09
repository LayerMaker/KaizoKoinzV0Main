"use client"

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react"
import { WagmiConfig } from "wagmi"
import { arbitrum, mainnet, optimism, polygon } from "wagmi/chains"
import { type ReactNode, useEffect, useState } from "react"

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "YOUR_PROJECT_ID"

// 2. Create wagmiConfig
const chains = [mainnet, polygon, optimism, arbitrum]
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata: {
    name: "Crypto Retro",
    description: "Play retro games and earn crypto rewards",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  },
})

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return <WagmiConfig config={wagmiConfig}>{mounted && children}</WagmiConfig>
}
