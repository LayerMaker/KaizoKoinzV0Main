"use client"

import React, { useEffect, useRef, useState } from "react"
import { useAccount } from "wagmi"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import Link from "next/link"
import { GamepadIcon as GameController, Trophy } from "lucide-react"
import Script from "next/script"

export default function EmulatorSection() {
  const emulatorContainerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<HTMLDivElement>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const { isConnected: walletConnected } = useAccount()
  const { open } = useWeb3Modal()
  
  // We allow the emulator to work without wallet connection
  // but keep track of wallet status for reward functionality
  const hasWallet = walletConnected // Track actual wallet connection for rewards

  // State for gamepad connection status
  const [gamepadConnected, setGamepadConnected] = useState(false)
  // State for loading status
  const [isLoading, setIsLoading] = useState(true)
  // State for error messages
  const [error, setError] = useState<string | null>(null)
  // State to track if the game has started
  const [gameStarted, setGameStarted] = useState(false)
  // State to track if scripts are loaded
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

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

  // Set up EmulatorJS configuration globally - this matches how the standalone HTML file does it
  // We do this outside of any effects to ensure it's available immediately
  useEffect(() => {
    console.log("Setting up global EmulatorJS configuration")
    
    // Set up EmulatorJS configuration
    // @ts-ignore - EmulatorJS uses global variables
    window.EJS_player = '#game'
    // @ts-ignore
    window.EJS_pathtodata = "/emulatorjs/EmulatorJS-main/data/"
    // @ts-ignore
    window.EJS_gameUrl = '/api/roms/invictus'
    // @ts-ignore
    window.EJS_core = 'snes'
    // @ts-ignore
    window.EJS_gameID = 'invictus'
    // @ts-ignore
    window.EJS_controller = true
    // @ts-ignore
    window.EJS_volume = 0.8
    // @ts-ignore
    window.EJS_cheats = false
    // @ts-ignore
    window.EJS_DEBUG_XX = true // Enable debug mode
    // @ts-ignore
    window.EJS_saveStateURL = "/api/save-states/save"
    // @ts-ignore
    window.EJS_loadStateURL = "/api/save-states/load"

    console.log("EmulatorJS global configuration set")
    
    // Event handlers - set these up early
    // @ts-ignore
    window.EJS_onGameStart = function() {
      console.log("Game started!")
      setIsLoading(false)
      setGameStarted(true)
    }

    // @ts-ignore
    window.EJS_onError = function(error: string) {
      console.error("EmulatorJS error:", error)
      
      // Enhanced error logging
      console.error("EmulatorJS error details:", {
        error,
        gameUrl: window.EJS_gameUrl,
        pathToData: window.EJS_pathtodata,
        core: window.EJS_core,
        gameId: window.EJS_gameID
      })
      
      // Check if error is related to ROM loading
      if (error.includes('ROM') || error.includes('file') || error.includes('load')) {
        setError(`Error loading ROM: ${error}. Please check server logs for details.`)
      } else {
        setError(`Emulator error: ${error}`)
      }
      
      setIsLoading(false)
    }
    
    // Add global error handler for network issues
    const handleGlobalError = (e: ErrorEvent) => {
      if (e.message && (e.message.includes('network') || e.message.includes('fetch') || e.message.includes('load'))) {
        console.error("Caught network error:", e.message)
      }
    }
    
    window.addEventListener('error', handleGlobalError)
    
    // Test API endpoints directly - do this early to verify connectivity
    console.log("Testing API endpoints...")
    
    // Test ROM API
    fetch('/api/roms/invictus', { method: 'HEAD' })
      .then(response => {
        console.log("ROM API HEAD response:", response.status, response.statusText)
        return fetch('/api/roms/invictus')
      })
      .then(response => {
        console.log("ROM API GET response:", response.status, response.statusText)
        if (!response.ok) {
          throw new Error(`ROM API error: ${response.status} ${response.statusText}`)
        }
        return response.blob()
      })
      .then(blob => {
        console.log("ROM file loaded successfully, size:", blob.size)
      })
      .catch(error => {
        console.error("Error testing ROM API:", error)
      })
    
    // Test save state API
    fetch('/api/save-states/load')
      .then(response => {
        console.log("Save state API response:", response.status, response.statusText)
        return response.json()
      })
      .then(data => {
        console.log("Save state data:", data)
      })
      .catch(error => {
        console.error("Error testing save state API:", error)
      })
      
    return () => {
      // Clean up global event listeners
      window.removeEventListener('error', handleGlobalError)
      
      // Clean up global EmulatorJS variables
      // @ts-ignore
      delete window.EJS_player
      // @ts-ignore
      delete window.EJS_pathtodata
      // @ts-ignore
      delete window.EJS_gameUrl
      // @ts-ignore
      delete window.EJS_core
      // @ts-ignore
      delete window.EJS_gameID
      // @ts-ignore
      delete window.EJS_controller
      // @ts-ignore
      delete window.EJS_volume
      // @ts-ignore
      delete window.EJS_cheats
      // @ts-ignore
      delete window.EJS_DEBUG_XX
      // @ts-ignore
      delete window.EJS_saveStateURL
      // @ts-ignore
      delete window.EJS_loadStateURL
      // @ts-ignore
      delete window.EJS_onGameStart
      // @ts-ignore
      delete window.EJS_onError
    }
  }, []) // Empty dependency array ensures this runs once on mount
  
  // Initialize EmulatorJS after the DOM is ready and configuration is set
  useEffect(() => {
    if (!scriptsLoaded || !gameRef.current) return

    console.log("=== EMULATOR INITIALIZATION ===")
    console.log("Current URL:", window.location.href)
    console.log("Document readyState:", document.readyState)
    console.log("Game ref exists:", !!gameRef.current)
    console.log("Scripts loaded:", scriptsLoaded)
    console.log("EmulatorJS configuration:", {
      player: window.EJS_player,
      pathtodata: window.EJS_pathtodata,
      gameUrl: window.EJS_gameUrl,
      core: window.EJS_core,
      gameID: window.EJS_gameID
    })

    // Clear any previous emulator instance
    if (gameRef.current) {
      gameRef.current.innerHTML = ""
      console.log("Cleared previous emulator instance")
    }

    // Set up game completion detection (for testing)
    const setupCompletionButton = setTimeout(() => {
      if (!gameCompleted && emulatorContainerRef.current) {
        const completeGameBtn = document.createElement("button")
        completeGameBtn.textContent = "Simulate Game Completion"
        completeGameBtn.className = "absolute bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-md"
        completeGameBtn.onclick = () => {
          setGameCompleted(true)
        }
        
        // Add the button to the parent container
        emulatorContainerRef.current.appendChild(completeGameBtn)
        console.log("Added game completion button")
      }
    }, 5000)
    
    return () => {
      clearTimeout(setupCompletionButton)
    }
  }, [scriptsLoaded, gameCompleted])

  // Function to reload the emulator
  const reloadEmulator = () => {
    console.log("Reloading emulator")
    setIsLoading(true)
    setError(null)
    setGameStarted(false)
    
    // Re-initialize the emulator
    if (gameRef.current) {
      gameRef.current.innerHTML = ""
      
      // Re-trigger the emulator initialization
      const loaderScript = document.createElement('script')
      loaderScript.src = "/emulatorjs/EmulatorJS-main/data/loader.js"
      loaderScript.async = true
      document.body.appendChild(loaderScript)
    }
  }

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

        <div className="max-w-2xl mx-auto p-4">
          <div className="relative">
            {!hasWallet && (
              <div className="absolute top-4 left-4 z-20">
                <button
                  onClick={() => open()}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition text-white font-medium text-sm flex items-center gap-2"
                >
                  <span>Connect Wallet</span>
                  <span className="text-xs bg-red-500 px-2 py-0.5 rounded-full">For Rewards</span>
                </button>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-10">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-300">Loading game...</p>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-10">
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

            {/* Emulator Container - Using iframe to embed the working emulator.html */}
            <div 
              ref={emulatorContainerRef}
              className="relative w-full" 
              style={{ 
                maxWidth: "800px", 
                margin: "0 auto",
                border: "none",
                borderRadius: "0", /* Removed rounded corners completely */
                overflow: "hidden",
                boxShadow: "none"
              }}
            >
              <div 
                className="relative w-full" 
                style={{ 
                  height: "700px", /* Fixed height instead of percentage padding */
                  overflow: "hidden",
                  backgroundColor: "transparent"
                }}
              >
                {/* Using iframe to embed the working emulator.html */}
                <iframe
                  src="/emulator.html"
                  className="w-full h-full"
                  style={{ 
                    border: "none",
                    overflow: "hidden", /* Prevent scrollbars */
                    backgroundColor: "transparent" /* Ensure iframe background is transparent */
                  }}
                  scrolling="no" /* Explicitly disable scrolling */
                  sandbox="allow-scripts allow-same-origin"
                  frameBorder="0" /* Additional property to ensure no borders */
                  onLoad={() => {
                    console.log("Emulator iframe loaded")
                    setIsLoading(false)
                  }}
                  onError={() => {
                    console.error("Failed to load emulator iframe")
                    setError("Failed to load emulator. Please try again.")
                    setIsLoading(false)
                  }}
                />
                
                {/* Keep the original game div as a fallback, but hidden */}
                <div 
                  id="game" 
                  ref={gameRef}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ display: "none" }}
                ></div>
              </div>
            </div>

            {gamepadConnected && (
              <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs flex items-center">
                <GameController size={14} className="mr-1" />
                Controller Connected
              </div>
            )}

            {gameCompleted && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4">
                <Trophy size={64} className="text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Congratulations!</h3>
                {hasWallet ? (
                  <>
                    <p className="text-gray-300 mb-2 text-center max-w-md">
                      You've completed the game and unlocked your reward!
                    </p>
                    <Link
                      href="/claim"
                      className="px-6 py-3 rounded-md bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 transition text-white font-medium"
                    >
                      Claim Your Reward
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-gray-300 mb-2 text-center max-w-md">
                      You've completed the game! Connect your wallet to claim rewards.
                    </p>
                    <button
                      onClick={() => open()}
                      className="px-6 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition text-white font-medium"
                    >
                      Connect Wallet
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Use arrow keys to move, Z for A button, X for B button, Enter for Start
          </p>
          <p className="text-gray-400 text-sm mt-1">Connect a gamepad for the best experience</p>
          {!hasWallet && (
            <p className="text-cyan-400 text-sm mt-3 border border-cyan-500/30 p-2 rounded-md inline-block">
              Connect your wallet to earn rewards when you complete the game!
            </p>
          )}
        </div>
      </div>

      {/* Load EmulatorJS scripts - using Next.js Script component for proper loading sequence */}
      <Script
        id="emulatorjs-setup"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("EmulatorJS setup script loaded")
          setScriptsLoaded(true)
        }}
        onError={() => {
          console.error("Failed to load EmulatorJS setup script")
          setError("Failed to load emulator resources")
        }}
      >
        {`
          console.log("Initializing EmulatorJS setup");
        `}
      </Script>
      
      {/* Load the EmulatorJS loader script directly - this is key to matching the standalone HTML file */}
      <Script
        id="emulatorjs-loader"
        src="/emulatorjs/EmulatorJS-main/data/loader.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log("EmulatorJS loader script loaded successfully")
        }}
        onError={(e) => {
          console.error("Failed to load EmulatorJS loader script", e)
          setError("Failed to load emulator resources. Check console for details.")
          setIsLoading(false)
          
          // Try to fetch the loader script directly to see if it's accessible
          fetch("/emulatorjs/EmulatorJS-main/data/loader.js")
            .then(response => {
              console.log("Loader script fetch response:", response.status, response.statusText)
              if (!response.ok) {
                throw new Error(`Loader script fetch error: ${response.status} ${response.statusText}`)
              }
              return response.text()
            })
            .then(text => {
              console.log("Loader script content length:", text.length)
            })
            .catch(error => {
              console.error("Error fetching loader script:", error)
            })
        }}
      />
    </section>
  )
}
