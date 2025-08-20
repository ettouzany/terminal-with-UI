import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as os from 'os';
import * as pty from 'node-pty';

class TerminalApp {
  private mainWindow: BrowserWindow | null = null;
  private terminals: Map<string, pty.IPty> = new Map();

  constructor() {
    this.setupApp();
  }

  private setupApp(): void {
    app.whenReady().then(() => {
      this.createWindow();
      this.setupIPC();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      titleBarStyle: 'hiddenInset',
      vibrancy: 'under-window',
      visualEffectState: 'active',
    });

    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
    }
  }

  private setupIPC(): void {
    ipcMain.handle('create-terminal', (event, terminalId: string) => {
      const shell = os.platform() === 'win32' ? 'powershell.exe' : process.env.SHELL || '/bin/bash';
      
      const terminal = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.cwd(),
        env: process.env as { [key: string]: string },
      });

      this.terminals.set(terminalId, terminal);

      terminal.onData((data) => {
        this.mainWindow?.webContents.send('terminal-data', terminalId, data);
      });

      terminal.onExit(() => {
        this.terminals.delete(terminalId);
        this.mainWindow?.webContents.send('terminal-exit', terminalId);
      });

      return { success: true };
    });

    ipcMain.handle('write-terminal', (event, terminalId: string, data: string) => {
      const terminal = this.terminals.get(terminalId);
      if (terminal) {
        terminal.write(data);
        return { success: true };
      }
      return { success: false, error: 'Terminal not found' };
    });

    ipcMain.handle('resize-terminal', (event, terminalId: string, cols: number, rows: number) => {
      const terminal = this.terminals.get(terminalId);
      if (terminal) {
        terminal.resize(cols, rows);
        return { success: true };
      }
      return { success: false, error: 'Terminal not found' };
    });

    ipcMain.handle('close-terminal', (event, terminalId: string) => {
      const terminal = this.terminals.get(terminalId);
      if (terminal) {
        terminal.kill();
        this.terminals.delete(terminalId);
        return { success: true };
      }
      return { success: false, error: 'Terminal not found' };
    });
  }
}

new TerminalApp();