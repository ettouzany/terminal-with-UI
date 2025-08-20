import { TerminalSession, TabInfo } from '../../shared/types';

export class TerminalManager {
  private static instance: TerminalManager;
  private sessions: Map<string, TerminalSession> = new Map();
  private activeSessionId: string | null = null;
  private sessionCounter = 0;

  private constructor() {}

  public static getInstance(): TerminalManager {
    if (!TerminalManager.instance) {
      TerminalManager.instance = new TerminalManager();
    }
    return TerminalManager.instance;
  }

  public createSession(title?: string, cwd?: string): TerminalSession {
    this.sessionCounter++;
    const session: TerminalSession = {
      id: `terminal-${this.sessionCounter}-${Date.now()}`,
      title: title || `Terminal ${this.sessionCounter}`,
      cwd: cwd || process.cwd(),
      active: false,
      createdAt: new Date(),
    };

    this.sessions.set(session.id, session);
    
    if (!this.activeSessionId) {
      this.setActiveSession(session.id);
    }

    return session;
  }

  public removeSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    this.sessions.delete(sessionId);

    if (this.activeSessionId === sessionId) {
      const remainingSessions = Array.from(this.sessions.keys());
      this.activeSessionId = remainingSessions.length > 0 ? remainingSessions[0] : null;
      
      if (this.activeSessionId) {
        this.setActiveSession(this.activeSessionId);
      }
    }

    return true;
  }

  public getSession(sessionId: string): TerminalSession | undefined {
    return this.sessions.get(sessionId);
  }

  public getAllSessions(): TerminalSession[] {
    return Array.from(this.sessions.values());
  }

  public getActiveSession(): TerminalSession | null {
    return this.activeSessionId ? this.sessions.get(this.activeSessionId) || null : null;
  }

  public setActiveSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    // Deactivate all sessions
    this.sessions.forEach(s => s.active = false);
    
    // Activate the selected session
    session.active = true;
    this.activeSessionId = sessionId;

    return true;
  }

  public updateSessionTitle(sessionId: string, title: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.title = title;
    this.sessions.set(sessionId, session);
    return true;
  }

  public getTabsInfo(): TabInfo[] {
    return this.getAllSessions().map(session => ({
      id: session.id,
      title: session.title,
      path: session.cwd,
      active: session.active,
      modified: false, // TODO: Track if terminal has unsaved output
    }));
  }

  public moveTab(fromIndex: number, toIndex: number): void {
    const sessions = this.getAllSessions();
    if (fromIndex < 0 || fromIndex >= sessions.length || toIndex < 0 || toIndex >= sessions.length) {
      return;
    }

    const sessionIds = sessions.map(s => s.id);
    const [movedId] = sessionIds.splice(fromIndex, 1);
    sessionIds.splice(toIndex, 0, movedId);

    // This is a simple implementation - in a real app, you'd want to maintain order
    // For now, we'll just update the active session if it was moved
  }
}