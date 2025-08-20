import { ThemeConfig } from '../../shared/types';

export type ThemeName = 'dark' | 'light' | 'retro' | 'cyberpunk' | 'minimal';

export interface ExtendedThemeConfig extends ThemeConfig {
  ui: {
    background: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    hover: string;
  };
}

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: ThemeName = 'dark';
  private themes: Map<ThemeName, ExtendedThemeConfig> = new Map();

  private constructor() {
    this.initializeThemes();
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  private initializeThemes(): void {
    // Dark Theme (Default)
    this.themes.set('dark', {
      name: 'Dark',
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        cursor: '#ffffff',
        selection: '#3e3e3e',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5',
      },
      ui: {
        background: '#1e1e1e',
        surface: '#2d2d2d',
        border: '#3e3e3e',
        text: '#cccccc',
        textSecondary: '#999999',
        accent: '#007acc',
        success: '#0dbc79',
        warning: '#e5e510',
        error: '#cd3131',
        hover: '#404040',
      }
    });

    // Light Theme
    this.themes.set('light', {
      name: 'Light',
      colors: {
        background: '#ffffff',
        foreground: '#000000',
        cursor: '#000000',
        selection: '#d4edff',
        black: '#000000',
        red: '#cd3131',
        green: '#00bc00',
        yellow: '#949800',
        blue: '#0451a5',
        magenta: '#bc05bc',
        cyan: '#0598bc',
        white: '#555555',
        brightBlack: '#666666',
        brightRed: '#cd3131',
        brightGreen: '#14ce14',
        brightYellow: '#b5ba00',
        brightBlue: '#0451a5',
        brightMagenta: '#bc05bc',
        brightCyan: '#0598bc',
        brightWhite: '#a5a5a5',
      },
      ui: {
        background: '#ffffff',
        surface: '#f8f8f8',
        border: '#e1e1e1',
        text: '#333333',
        textSecondary: '#666666',
        accent: '#0078d4',
        success: '#107c10',
        warning: '#797300',
        error: '#d13438',
        hover: '#f3f2f1',
      }
    });

    // Retro Theme
    this.themes.set('retro', {
      name: 'Retro',
      colors: {
        background: '#001100',
        foreground: '#00ff00',
        cursor: '#00ff00',
        selection: '#003300',
        black: '#001100',
        red: '#ff0000',
        green: '#00ff00',
        yellow: '#ffff00',
        blue: '#0000ff',
        magenta: '#ff00ff',
        cyan: '#00ffff',
        white: '#ffffff',
        brightBlack: '#555555',
        brightRed: '#ff5555',
        brightGreen: '#55ff55',
        brightYellow: '#ffff55',
        brightBlue: '#5555ff',
        brightMagenta: '#ff55ff',
        brightCyan: '#55ffff',
        brightWhite: '#ffffff',
      },
      ui: {
        background: '#001100',
        surface: '#002200',
        border: '#004400',
        text: '#00ff00',
        textSecondary: '#00aa00',
        accent: '#ffff00',
        success: '#00ff00',
        warning: '#ffff00',
        error: '#ff0000',
        hover: '#003300',
      }
    });

    // Cyberpunk Theme
    this.themes.set('cyberpunk', {
      name: 'Cyberpunk',
      colors: {
        background: '#0a0a0f',
        foreground: '#ff0080',
        cursor: '#ff0080',
        selection: '#2a0040',
        black: '#0a0a0f',
        red: '#ff0040',
        green: '#00ff80',
        yellow: '#ffff00',
        blue: '#0080ff',
        magenta: '#ff0080',
        cyan: '#00ffff',
        white: '#ffffff',
        brightBlack: '#404040',
        brightRed: '#ff4080',
        brightGreen: '#40ff80',
        brightYellow: '#ffff40',
        brightBlue: '#4080ff',
        brightMagenta: '#ff40ff',
        brightCyan: '#40ffff',
        brightWhite: '#ffffff',
      },
      ui: {
        background: '#0a0a0f',
        surface: '#1a0a2e',
        border: '#ff0080',
        text: '#ff0080',
        textSecondary: '#cc0066',
        accent: '#00ffff',
        success: '#00ff80',
        warning: '#ffff00',
        error: '#ff0040',
        hover: '#2a0040',
      }
    });

    // Minimal Theme
    this.themes.set('minimal', {
      name: 'Minimal',
      colors: {
        background: '#fafafa',
        foreground: '#383a42',
        cursor: '#383a42',
        selection: '#e5e5e6',
        black: '#383a42',
        red: '#e45649',
        green: '#50a14f',
        yellow: '#c18401',
        blue: '#4078f2',
        magenta: '#a626a4',
        cyan: '#0184bc',
        white: '#fafafa',
        brightBlack: '#4f525d',
        brightRed: '#e06c75',
        brightGreen: '#98c379',
        brightYellow: '#e5c07b',
        brightBlue: '#61afef',
        brightMagenta: '#c678dd',
        brightCyan: '#56b6c2',
        brightWhite: '#ffffff',
      },
      ui: {
        background: '#fafafa',
        surface: '#ffffff',
        border: '#e5e5e6',
        text: '#383a42',
        textSecondary: '#696c77',
        accent: '#4078f2',
        success: '#50a14f',
        warning: '#c18401',
        error: '#e45649',
        hover: '#f0f0f1',
      }
    });
  }

  public getCurrentTheme(): ExtendedThemeConfig {
    return this.themes.get(this.currentTheme)!;
  }

  public getCurrentThemeName(): ThemeName {
    return this.currentTheme;
  }

  public setTheme(themeName: ThemeName): void {
    if (this.themes.has(themeName)) {
      this.currentTheme = themeName;
      this.applyTheme();
      this.saveThemePreference();
    }
  }

  public getAllThemes(): Array<{ name: ThemeName; displayName: string }> {
    return Array.from(this.themes.entries()).map(([name, theme]) => ({
      name,
      displayName: theme.name
    }));
  }

  public nextTheme(): void {
    const themeNames = Array.from(this.themes.keys());
    const currentIndex = themeNames.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    this.setTheme(themeNames[nextIndex]);
  }

  private applyTheme(): void {
    const theme = this.getCurrentTheme();
    const root = document.documentElement;

    // Apply CSS custom properties
    root.style.setProperty('--theme-bg', theme.ui.background);
    root.style.setProperty('--theme-surface', theme.ui.surface);
    root.style.setProperty('--theme-border', theme.ui.border);
    root.style.setProperty('--theme-text', theme.ui.text);
    root.style.setProperty('--theme-text-secondary', theme.ui.textSecondary);
    root.style.setProperty('--theme-accent', theme.ui.accent);
    root.style.setProperty('--theme-success', theme.ui.success);
    root.style.setProperty('--theme-warning', theme.ui.warning);
    root.style.setProperty('--theme-error', theme.ui.error);
    root.style.setProperty('--theme-hover', theme.ui.hover);

    // Terminal colors
    root.style.setProperty('--terminal-bg', theme.colors.background);
    root.style.setProperty('--terminal-fg', theme.colors.foreground);
    root.style.setProperty('--terminal-cursor', theme.colors.cursor);

    // Dispatch custom event for components to react to theme changes
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { theme: this.currentTheme, config: theme } 
    }));
  }

  private saveThemePreference(): void {
    localStorage.setItem('terminal-theme', this.currentTheme);
  }

  public loadThemePreference(): void {
    const saved = localStorage.getItem('terminal-theme') as ThemeName;
    if (saved && this.themes.has(saved)) {
      this.currentTheme = saved;
      this.applyTheme();
    }
  }

  public registerCustomTheme(name: string, theme: ExtendedThemeConfig): void {
    this.themes.set(name as ThemeName, theme);
  }
}