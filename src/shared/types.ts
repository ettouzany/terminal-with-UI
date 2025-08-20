export interface Widget {
  id: string;
  name: string;
  component: React.ComponentType<WidgetProps>;
  icon?: string;
  description?: string;
  category: WidgetCategory;
  configurable?: boolean;
  defaultConfig?: Record<string, any>;
}

export interface WidgetProps {
  config?: Record<string, any>;
  onConfigChange?: (config: Record<string, any>) => void;
}

export type WidgetCategory = 
  | 'system' 
  | 'time' 
  | 'productivity' 
  | 'monitoring' 
  | 'development' 
  | 'media'
  | 'entertainment'
  | 'customization'
  | 'custom';

export interface WidgetInstance {
  id: string;
  widgetId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
  visible: boolean;
}

export interface TerminalSession {
  id: string;
  title: string;
  cwd: string;
  active: boolean;
  createdAt: Date;
}

export interface ThemeConfig {
  name: string;
  colors: {
    background: string;
    foreground: string;
    cursor: string;
    selection: string;
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    brightBlack: string;
    brightRed: string;
    brightGreen: string;
    brightYellow: string;
    brightBlue: string;
    brightMagenta: string;
    brightCyan: string;
    brightWhite: string;
  };
}

export interface Command {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  keybinding?: string;
  action: () => void | Promise<void>;
}

export interface TabInfo {
  id: string;
  title: string;
  path: string;
  active: boolean;
  modified: boolean;
}

export interface SplitPane {
  id: string;
  direction: 'horizontal' | 'vertical';
  size: number;
  children: (SplitPane | TerminalSession)[];
}

export interface AppConfig {
  theme: ThemeConfig;
  widgets: WidgetInstance[];
  terminal: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    cursorBlink: boolean;
    scrollback: number;
  };
  layout: {
    showWidgetPanel: boolean;
    widgetPanelWidth: number;
    splitLayout: SplitPane | null;
  };
  commandPalette: {
    maxResults: number;
    fuzzySearch: boolean;
  };
}