"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import Link from "next/link"
import { ArrowLeft, Check, Loader2 } from "lucide-react"

export default function ClaimPage() {
  const { isConnected, address } = useAccount()
  const { open } = useWeb3Modal()
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)

  const handleClaim = async () => {
    if (!isConnected) {
      open()
      return
    }

    setClaiming(true)

    // Simulate token claim process
    setTimeout(() => {
      setClaiming(false)
      setClaimed(true)
    }, 2000)

    // In a real implementation, you would:
    // 1. Call a smart contract to verify game completion
    // 2. Transfer tokens to the user's wallet
    // 3. Update UI based on transaction status
  }

  return (
    <main className="min-h-screen bg-black text-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>

        <div className="max-w-lg mx-auto bg-gray-900/80 p-8 rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
          <h1 className="text-3xl font-bold mb-6 text-center">Claim Your Reward</h1>

          {!isConnected ? (
            <div className="text-center">
              <p className="text-gray-300 mb-6">Connect your wallet to claim your reward tokens</p>
              <button
                onClick={() => open()}
                className="w-full px-6 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition text-white font-medium"
              >
                Connect Wallet
              </button>
            </div>
          ) : claimed ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Tokens Claimed!</h2>
              <p className="text-gray-300 mb-6">Congratulations! 1000 RETRO tokens have been sent to your wallet.</p>
              <div className="p-4 bg-gray-800 rounded-md mb-6">
                <p className="text-sm text-gray-400 mb-1">Transaction Hash:</p>
                <p className="text-cyan-400 break-all">0x1234...5678</p>
              </div>
              <Link
                href="/"
                className="inline-block w-full px-6 py-3 rounded-md bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-400 hover:to-cyan-500 transition text-white font-medium"
              >
                Return Home
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-300 mb-6">You've completed the game and earned 1000 RETRO tokens!</p>
              <div className="p-4 bg-gray-800 rounded-md mb-6">
                <p className="text-sm text-gray-400 mb-1">Connected Wallet:</p>
                <p className="text-cyan-400">{address}</p>
              </div>
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full px-6 py-3 rounded-md bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 transition text-white font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {claiming ? (
                  <span className="flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Claiming...
                  </span>
                ) : (
                  "Claim Tokens"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

