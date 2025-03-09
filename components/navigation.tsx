"use client"

import { useState } from "react"
import Link from "next/link"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount } from "wagmi"
import { Menu, X } from "lucide-react"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyan-500/20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
        >
          CRYPTO RETRO
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#emulator" className="text-gray-300 hover:text-cyan-400 transition">
            Play
          </Link>
          <Link href="#roadmap" className="text-gray-300 hover:text-cyan-400 transition">
            Roadmap
          </Link>
          <Link href="#about" className="text-gray-300 hover:text-cyan-400 transition">
            About
          </Link>

          <button
            onClick={() => open()}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition text-white font-medium"
          >
            {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>

        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-cyan-500/20">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="#emulator" className="text-gray-300 hover:text-cyan-400 transition py-2" onClick={toggleMenu}>
              Play
            </Link>
            <Link href="#roadmap" className="text-gray-300 hover:text-cyan-400 transition py-2" onClick={toggleMenu}>
              Roadmap
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-cyan-400 transition py-2" onClick={toggleMenu}>
              About
            </Link>

            <button
              onClick={() => {
                open()
                toggleMenu()
              }}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition text-white font-medium"
            >
              {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
