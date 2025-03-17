"use client"

import React, { useEffect, useRef, useState } from "react"
import { useAccount } from "wagmi"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import Link from "next/link"
import { GamepadIcon as GameController, Trophy } from "lucide-react"

export default function EmulatorSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const { isConnected: walletConnected } = useAccount()
  const { open } = useWeb3Modal()
  
  // For testing purposes, we'll bypass the wallet connection requirement
  // In production, this should be removed and use walletConnected instead
  const [bypassWalletForTesting] = useState(true) // Temporarily set to true for testing
  const isConnected = walletConnected || bypassWalletForTesting

  // State for gamepad connection status
  const [gamepadConnected, setGamepadConnected] = useState(false)
  // State for loading status
  const [isLoading, setIsLoading] = useState(true)
  // State for error messages
  const [error, setError] = useState<string | null>(null)
  // State to track if the game has started
  const [gameStarted, setGameStarted] = useState(false)

  // Handle gamepad connection/disconnection events
  useEffect(() => {
    const handleGamepadConnected = (event: GamepadEvent) => {
      console.log("Gamepad connected:", event.gamepad)
      setGamepadConnected(true)
    }

    const handleGamepadDisconnected = (event: GamepadEvent) => {
      console.log("Gamepad disconnected:", event.gamepad)
      setGamepadConnected(false)
    }

    window.addEventListener("gamepadconnected", handleGamepadConnected)
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected)

    // Check if a gamepad is already connected
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : []
    for (const gamepad of gamepads) {
      if (gamepad) {
        setGamepadConnected(true)
        break
      }
    }

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnected)
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected)
    }
  }, [])

  // Handle messages from the iframe
  useEffect(() => {
    if (!isConnected) return
    
    setIsLoading(true)
    setError(null)
    
    const handleMessage = (event: MessageEvent) => {
      console.log("Message received from iframe:", event.data);
      
      if (event.data.type === 'gameStarted') {
        console.log("Game started event received from iframe")
        setIsLoading(false)
        setGameStarted(true)
      } else if (event.data.type === 'emulatorError') {
        console.error("Emulator error event received from iframe:", event.data.error)
        setError(`Error loading game: ${event.data.error}`)
        setIsLoading(false)
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    // Send a message to the iframe to check if it's loaded
    const checkIframeLoaded = setInterval(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        console.log("Sending ping to iframe");
        iframeRef.current.contentWindow.postMessage({ type: 'ping' }, '*');
      }
    }, 2000);
    
    // Set up game completion detection
    const setupCompletionButton = setTimeout(() => {
      if (!gameCompleted) {
        const completeGameBtn = document.createElement("button")
        completeGameBtn.textContent = "Simulate Game Completion"
        completeGameBtn.className = "absolute bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-md"
        completeGameBtn.onclick = () => {
          setGameCompleted(true)
        }
        
        // Add the button to the parent container, not the iframe
        const container = document.querySelector('.game-content')
        if (container) {
          container.appendChild(completeGameBtn)
        }
      }
    }, 5000)
    
    return () => {
      window.removeEventListener('message', handleMessage)
      clearTimeout(setupCompletionButton)
      clearInterval(checkIframeLoaded)
    }
  }, [isConnected, gameCompleted])

  // Function to reload the iframe
  const reloadEmulator = () => {
    if (iframeRef.current) {
      console.log("Reloading emulator iframe");
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
        }
      }, 100);
    }
    setIsLoading(true);
    setError(null);
  };

  return (
    <section id="emulator-section" className="min-h-screen pt-20 pb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Play & Earn
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Complete the game to unlock exclusive crypto rewards
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-gray-900/80 p-4 rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
          {!isConnected ? (
            <div className="aspect-video flex flex-col items-center justify-center gap-4 bg-black/60 rounded-md p-8">
              <GameController size={64} className="text-cyan-400" />
              <h3 className="text-2xl font-bold text-white">Connect Your Wallet to Play</h3>
              <p className="text-gray-400 mb-4 text-center">Connect your wallet to access the game and earn rewards</p>
              <button
                onClick={() => open()}
                className="px-6 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition text-white font-medium"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 rounded-md z-10">
                  <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-300">Loading game...</p>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 rounded-md z-10">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-red-500 text-4xl">!</span>
                  </div>
                  <p className="text-gray-300 text-center max-w-md">{error}</p>
                  <button
                    onClick={reloadEmulator}
                    className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 transition text-white"
                  >
                    Retry
                  </button>
                </div>
              )}

              <div className="box_gplay" style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div className="game-content" style={{ maxHeight: "600px", position: "relative" }}>
                  <iframe 
                    ref={iframeRef}
                    src="/emulator.html" 
                    style={{ 
                      width: "100%", 
                      height: "600px", 
                      border: "none",
                      backgroundColor: "#000"
                    }}
                    title="SNES Emulator"
                    allow="autoplay; fullscreen"
                    onLoad={() => {
                      console.log("Iframe loaded");
                      // We'll keep the loading state until we get the gameStarted message
                    }}
                  ></iframe>
                </div>
              </div>

              {gamepadConnected && (
                <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs flex items-center">
                  <GameController size={14} className="mr-1" />
                  Controller Connected
                </div>
              )}

              {gameCompleted && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 rounded-md">
                  <Trophy size={64} className="text-yellow-400" />
                  <h3 className="text-2xl font-bold text-white">Congratulations!</h3>
                  <p className="text-gray-300 mb-2 text-center max-w-md">
                    You've completed the game and unlocked your reward!
                  </p>
                  <Link
                    href="/claim"
                    className="px-6 py-3 rounded-md bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 transition text-white font-medium"
                  >
                    Claim Your Reward
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Use arrow keys to move, Z for A button, X for B button, Enter for Start
          </p>
          <p className="text-gray-400 text-sm mt-1">Connect a gamepad for the best experience</p>
        </div>
      </div>
    </section>
  )
}
