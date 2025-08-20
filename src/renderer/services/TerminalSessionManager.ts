import { TerminalSession, SplitPane } from '../../shared/types';

export type TerminalLayout = SplitPane | TerminalSession;

export interface TerminalTab {
  id: string;
  title: string;
  layout: TerminalLayout;
  active: boolean;
  createdAt: Date;
}

export class TerminalSessionManager {
  private static instance: TerminalSessionManager;
  private sessions: Map<string, TerminalSession> = new Map();
  private tabs: Map<string, TerminalTab> = new Map();
  private activeTabId: string | null = null;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    // Create initial tab with single terminal
    this.createNewTab();
  }

  static getInstance(): TerminalSessionManager {
    if (!TerminalSessionManager.instance) {
      TerminalSessionManager.instance = new TerminalSessionManager();
    }
    return TerminalSessionManager.instance;
  }

  // Event handling
  addListener(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify(): void {
    this.listeners.forEach(callback => callback());
  }

  // Session management
  createSession(cwd: string = '/Users', title?: string): TerminalSession {
    const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const session: TerminalSession = {
      id,
      title: title || `Terminal ${this.sessions.size + 1}`,
      cwd,
      active: true,
      createdAt: new Date(),
    };

    this.sessions.set(id, session);
    this.notify();
    return session;
  }

  getSession(id: string): TerminalSession | undefined {
    return this.sessions.get(id);
  }

  getAllSessions(): TerminalSession[] {
    return Array.from(this.sessions.values());
  }

  removeSession(id: string): void {
    this.sessions.delete(id);
    this.notify();
  }

  updateSession(id: string, updates: Partial<TerminalSession>): void {
    const session = this.sessions.get(id);
    if (session) {
      Object.assign(session, updates);
      this.notify();
    }
  }

  // Tab management
  createNewTab(title?: string): TerminalTab {
    const tabId = `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const session = this.createSession('/Users', title);
    
    const tab: TerminalTab = {
      id: tabId,
      title: title || `Tab ${this.tabs.size + 1}`,
      layout: session,
      active: true,
      createdAt: new Date(),
    };

    // Set all other tabs to inactive
    this.tabs.forEach(existingTab => {
      existingTab.active = false;
    });

    this.tabs.set(tabId, tab);
    this.activeTabId = tabId;
    this.notify();
    return tab;
  }

  getTab(id: string): TerminalTab | undefined {
    return this.tabs.get(id);
  }

  getAllTabs(): TerminalTab[] {
    return Array.from(this.tabs.values());
  }

  setActiveTab(id: string): void {
    const tab = this.tabs.get(id);
    if (tab) {
      // Set all tabs to inactive
      this.tabs.forEach(existingTab => {
        existingTab.active = false;
      });
      
      tab.active = true;
      this.activeTabId = id;
      this.notify();
    }
  }

  getActiveTab(): TerminalTab | undefined {
    return this.activeTabId ? this.tabs.get(this.activeTabId) : undefined;
  }

  closeTab(id: string): void {
    const tab = this.tabs.get(id);
    if (tab) {
      // Remove all sessions in this tab's layout
      this.removeSessionsFromLayout(tab.layout);
      
      // Remove the tab
      this.tabs.delete(id);
      
      // If this was the active tab, activate another one
      if (this.activeTabId === id) {
        const remainingTabs = this.getAllTabs();
        if (remainingTabs.length > 0) {
          this.setActiveTab(remainingTabs[0].id);
        } else {
          // Create a new tab if none remain
          this.createNewTab();
        }
      }
      
      this.notify();
    }
  }

  private removeSessionsFromLayout(layout: TerminalLayout): void {
    if ('children' in layout) {
      // It's a SplitPane
      layout.children.forEach(child => {
        this.removeSessionsFromLayout(child);
      });
    } else {
      // It's a TerminalSession
      this.removeSession(layout.id);
    }
  }

  updateTabTitle(id: string, title: string): void {
    const tab = this.tabs.get(id);
    if (tab) {
      tab.title = title;
      this.notify();
    }
  }

  // Split pane management
  splitPane(tabId: string, sessionId: string, direction: 'horizontal' | 'vertical'): void {
    const tab = this.tabs.get(tabId);
    if (!tab) return;

    // Create a new session for the split
    const newSession = this.createSession();

    // Find and replace the session with a split pane
    const newLayout = this.replaceSesionWithSplit(tab.layout, sessionId, direction, newSession);
    
    // Create a new tab object to ensure React detects the change
    const updatedTab = {
      ...tab,
      layout: newLayout
    };
    
    this.tabs.set(tabId, updatedTab);
    this.notify();
  }

  private replaceSesionWithSplit(
    layout: TerminalLayout,
    sessionId: string,
    direction: 'horizontal' | 'vertical',
    newSession: TerminalSession
  ): TerminalLayout {
    if ('children' in layout) {
      // It's a SplitPane
      return {
        ...layout,
        children: layout.children.map(child =>
          this.replaceSesionWithSplit(child, sessionId, direction, newSession)
        ),
      };
    } else {
      // It's a TerminalSession
      if (layout.id === sessionId) {
        // Replace this session with a split pane containing the original and new session
        const splitId = `split-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return {
          id: splitId,
          direction,
          size: 50, // Equal split
          children: [layout, newSession],
        };
      }
      return layout;
    }
  }

  // Utility methods
  getSessionsInLayout(layout: TerminalLayout): TerminalSession[] {
    if ('children' in layout) {
      // It's a SplitPane
      return layout.children.flatMap(child => this.getSessionsInLayout(child));
    } else {
      // It's a TerminalSession
      return [layout];
    }
  }

  getSessionCount(): number {
    return this.sessions.size;
  }

  getTabCount(): number {
    return this.tabs.size;
  }
}