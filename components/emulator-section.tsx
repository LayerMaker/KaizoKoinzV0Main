"use client"

import React, { useEffect, useRef, useState } from "react"
import { useAccount } from "wagmi"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import Link from "next/link"
import { GamepadIcon as GameController, Trophy } from "lucide-react"

export default function EmulatorSection() {
  const emulatorRef = useRef<HTMLDivElement>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const { isConnected } = useAccount()
  const { open } = useWeb3Modal()

  // State for gamepad connection status
  const [gamepadConnected, setGamepadConnected] = useState(false)
  // State for audio initialization
  const [audioInitialized, setAudioInitialized] = useState(false)
  // State for loading status
  const [isLoading, setIsLoading] = useState(true)
  // State for error messages
  const [error, setError] = useState<string | null>(null)

  // Initialize audio context on user interaction
  const initializeAudio = () => {
    try {
      // Create a temporary audio context to initialize audio
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContext()
      
      // Create and play a silent sound to initialize audio
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      gainNode.gain.value = 0 // Silent
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.start(0)
      oscillator.stop(0.1)
      
      setAudioInitialized(true)
      return true
    } catch (error) {
      console.error("Failed to initialize audio:", error)
      return false
    }
  }

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

  // Load EmulatorJS
  useEffect(() => {
    if (!emulatorRef.current || !isConnected) return

    setIsLoading(true)
    setError(null)

    const loadEmulator = async () => {
      try {
        // Initialize audio on first user interaction
        if (!audioInitialized) {
          const success = initializeAudio()
          if (!success) {
            console.warn("Audio initialization failed. Game audio may not work properly.")
          }
        }

        // Configure EmulatorJS
        console.log("Configuring EmulatorJS...")
        
        // @ts-ignore - EmulatorJS uses global variables
        window.EJS_player = "#emulator"
        console.log("EJS_player set to:", window.EJS_player)
        
        // @ts-ignore - Use our secure API endpoint for the ROM
        window.EJS_gameUrl = "/api/roms/invictus"
        console.log("EJS_gameUrl set to:", window.EJS_gameUrl)
        
        // @ts-ignore
        window.EJS_core = "snes"
        console.log("EJS_core set to:", window.EJS_core)
        
        // @ts-ignore - Use local path to EmulatorJS data
        window.EJS_pathtodata = "/emulatorjs/EmulatorJS-main/data/"
        console.log("EJS_pathtodata set to:", window.EJS_pathtodata)
        
        // @ts-ignore
        window.EJS_gameID = "invictus"
        console.log("EJS_gameID set to:", window.EJS_gameID)
        
        // @ts-ignore - Enable gamepad support
        window.EJS_controller = true
        console.log("EJS_controller set to:", window.EJS_controller)
        
        // @ts-ignore - Set default controller mapping for standard SNES USB gamepads
        window.EJS_defaultControls = {
          0: { // Player 1
            0: { value: 2, label: "BUTTON_2" },       // A button
            1: { value: 3, label: "BUTTON_3" },       // B button
            2: { value: 1, label: "BUTTON_1" },       // X button
            3: { value: 4, label: "BUTTON_4" },       // Y button
            4: { value: "SELECT", label: "SELECT" },  // SELECT button
            5: { value: "START", label: "START" },    // START button
            6: { value: "LEFT_TOP_SHOULDER", label: "LEFT_TOP_SHOULDER" },  // L button
            7: { value: "RIGHT_TOP_SHOULDER", label: "RIGHT_TOP_SHOULDER" }, // R button
            8: { value: "LEFT_STICK_Y:-1", label: "LEFT_STICK Y:-1" },  // UP direction
            9: { value: "LEFT_STICK_Y:+1", label: "LEFT_STICK Y:+1" },  // DOWN direction
            10: { value: "LEFT_STICK_X:-1", label: "LEFT_STICK X:-1" }, // LEFT direction
            11: { value: "LEFT_STICK_X:+1", label: "LEFT_STICK X:+1" }  // RIGHT direction
          }
        }
        console.log("EJS_defaultControls set for standard SNES USB gamepad")
        
        // @ts-ignore - Set default volume
        window.EJS_volume = 0.8
        console.log("EJS_volume set to:", window.EJS_volume)
        
        // @ts-ignore - Disable cheats
        window.EJS_cheats = false
        console.log("EJS_cheats set to:", window.EJS_cheats)
        
        // @ts-ignore - Set up save state handling
        window.EJS_saveStateURL = "/api/save-states/save"
        console.log("EJS_saveStateURL set to:", window.EJS_saveStateURL)
        
        // @ts-ignore
        window.EJS_loadStateURL = "/api/save-states/load"
        console.log("EJS_loadStateURL set to:", window.EJS_loadStateURL)
        
        // @ts-ignore - Enable debug mode for more detailed logs
        window.EJS_DEBUG_XX = true

        // Set up event listeners for game state
        // @ts-ignore
        window.EJS_onGameStart = () => {
          console.log("Game started event triggered")
          setIsLoading(false)
        }

        // @ts-ignore
        window.EJS_onSaveState = (state: any) => {
          console.log("Game state saved event triggered", state)
          // In a real implementation, you would send the state to your server
        }

        // @ts-ignore
        window.EJS_onLoadState = (state: any) => {
          console.log("Game state loaded event triggered", state)
          // In a real implementation, you would validate the state
        }
        
        // Add error handler
        // @ts-ignore
        window.EJS_onError = (error: any) => {
          console.error("EmulatorJS error:", error)
          setError(`EmulatorJS error: ${error}`)
          setIsLoading(false)
        }

        // Load the EmulatorJS script
        console.log("Loading EmulatorJS script...")
        const script = document.createElement("script")
        script.src = "/emulatorjs/EmulatorJS-main/data/loader.js"
        script.onerror = (e) => {
          console.error("Failed to load EmulatorJS script:", e)
          setError("Failed to load the emulator script. Please refresh the page and try again.")
          setIsLoading(false)
        }
        script.onload = () => {
          console.log("EmulatorJS script loaded successfully")
        }
        document.body.appendChild(script)

        // Set up game completion detection
        // For now, we'll still use a mock button for demonstration
        // In a real implementation, you would listen for specific game events
        const setupGameCompletionDetection = () => {
          const completeGameBtn = document.createElement("button")
          completeGameBtn.textContent = "Simulate Game Completion"
          completeGameBtn.className = "absolute bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-md"
          completeGameBtn.onclick = () => {
            setGameCompleted(true)
            // In a real implementation, you would verify completion on the server
          }

          if (emulatorRef.current) {
            emulatorRef.current.appendChild(completeGameBtn)
          }
        }

        // Set up completion detection after the game has loaded
        setTimeout(setupGameCompletionDetection, 5000)
      } catch (error) {
        console.error("Error loading emulator:", error)
        setError("An error occurred while loading the emulator. Please refresh the page and try again.")
        setIsLoading(false)
      }
    }

    loadEmulator()

    return () => {
      // Cleanup function
      const script = document.querySelector('script[src="/emulatorjs/EmulatorJS-main/data/loader.js"]')
      if (script) {
        document.body.removeChild(script)
      }
    }
  }, [isConnected, audioInitialized])

  return (
    <section id="emulator" className="min-h-screen pt-20 pb-16 relative">
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

        <div className="max-w-4xl mx-auto bg-gray-900/80 p-4 rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
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
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 transition text-white"
                  >
                    Retry
                  </button>
                </div>
              )}

              <div ref={emulatorRef} id="emulator" className="aspect-video bg-black rounded-md"></div>

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
