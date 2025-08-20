import { TerminalAPI } from '../../main/preload';

declare global {
  interface Window {
    terminalAPI: TerminalAPI;
  }
}

export {};