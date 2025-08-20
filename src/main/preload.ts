import { contextBridge, ipcRenderer } from 'electron';

export interface TerminalAPI {
  createTerminal: (terminalId: string, cwd?: string) => Promise<{ success: boolean; error?: string }>;
  writeTerminal: (terminalId: string, data: string) => Promise<{ success: boolean; error?: string }>;
  resizeTerminal: (terminalId: string, cols: number, rows: number) => Promise<{ success: boolean; error?: string }>;
  closeTerminal: (terminalId: string) => Promise<{ success: boolean; error?: string }>;
  getCwd: () => Promise<{ success: boolean; cwd?: string; error?: string }>;
  getHomeDir: () => Promise<{ success: boolean; homeDir?: string; error?: string }>;
  onTerminalData: (callback: (terminalId: string, data: string) => void) => void;
  onTerminalExit: (callback: (terminalId: string) => void) => void;
}

const terminalAPI: TerminalAPI = {
  createTerminal: (terminalId: string, cwd?: string) => ipcRenderer.invoke('create-terminal', terminalId, cwd),
  writeTerminal: (terminalId: string, data: string) => ipcRenderer.invoke('write-terminal', terminalId, data),
  resizeTerminal: (terminalId: string, cols: number, rows: number) => ipcRenderer.invoke('resize-terminal', terminalId, cols, rows),
  closeTerminal: (terminalId: string) => ipcRenderer.invoke('close-terminal', terminalId),
  getCwd: () => ipcRenderer.invoke('get-cwd'),
  getHomeDir: () => ipcRenderer.invoke('get-home-dir'),
  onTerminalData: (callback: (terminalId: string, data: string) => void) => {
    ipcRenderer.on('terminal-data', (event, terminalId, data) => callback(terminalId, data));
  },
  onTerminalExit: (callback: (terminalId: string) => void) => {
    ipcRenderer.on('terminal-exit', (event, terminalId) => callback(terminalId));
  },
};

contextBridge.exposeInMainWorld('terminalAPI', terminalAPI);

declare global {
  interface Window {
    terminalAPI: TerminalAPI;
  }
}