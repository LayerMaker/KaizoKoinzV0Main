// Type declarations for external modules
declare module 'wagmi' {
  export function useAccount(): {
    isConnected: boolean;
    address?: string;
  };
}

declare module '@web3modal/wagmi/react' {
  export function useWeb3Modal(): {
    open: () => void;
  };
}

// Type declarations for EmulatorJS global variables
interface Window {
  EJS_player?: string;
  EJS_gameUrl?: string;
  EJS_core?: string;
  EJS_pathtodata?: string;
  EJS_gameID?: string | number;
  EJS_controller?: boolean;
  EJS_volume?: number;
  EJS_cheats?: boolean;
  EJS_saveStateURL?: string;
  EJS_loadStateURL?: string;
  EJS_onGameStart?: () => void;
  EJS_onSaveState?: (state: any) => void;
  EJS_onLoadState?: (state: any) => void;
  AudioContext?: any;
  webkitAudioContext?: any;
}

// Type declaration for GamepadEvent
interface GamepadEvent extends Event {
  readonly gamepad: Gamepad;
}
