import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppTheme {
  name: string;
  background: string;
  text: string;
  border: string;
  header: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

interface ThemeContextType {
  currentTheme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  applyTheme: (themeName: string) => void;
}

const defaultTheme: AppTheme = {
  name: 'Default Dark',
  background: '#1e1e1e',
  text: '#ffffff',
  border: '#333333',
  header: '#2d2d2d',
  accent: '#007acc',
  success: '#0dbc79',
  warning: '#e5e510',
  error: '#cd3131',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('app-theme-config');
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  const setTheme = (theme: AppTheme) => {
    setCurrentTheme(theme);
    localStorage.setItem('app-theme', theme.name);
    localStorage.setItem('app-theme-config', JSON.stringify(theme));
    applyCSSVariables(theme);
  };

  const applyCSSVariables = (theme: AppTheme) => {
    const root = document.documentElement;
    root.style.setProperty('--app-bg', theme.background);
    root.style.setProperty('--app-text', theme.text);
    root.style.setProperty('--app-border', theme.border);
    root.style.setProperty('--app-header', theme.header);
    root.style.setProperty('--app-accent', theme.accent);
    root.style.setProperty('--app-success', theme.success);
    root.style.setProperty('--app-warning', theme.warning);
    root.style.setProperty('--app-error', theme.error);
  };

  const applyTheme = (themeName: string) => {
    const appThemes: AppTheme[] = [
      {
        name: 'Default Dark',
        background: '#1e1e1e',
        text: '#ffffff',
        border: '#333333',
        header: '#2d2d2d',
        accent: '#007acc',
        success: '#0dbc79',
        warning: '#e5e510',
        error: '#cd3131',
      },
      {
        name: 'Monokai',
        background: '#272822',
        text: '#f8f8f2',
        border: '#49483e',
        header: '#3e3d32',
        accent: '#a6e22e',
        success: '#a6e22e',
        warning: '#f4bf75',
        error: '#f92672',
      },
      {
        name: 'Dracula',
        background: '#282a36',
        text: '#f8f8f2',
        border: '#44475a',
        header: '#44475a',
        accent: '#bd93f9',
        success: '#50fa7b',
        warning: '#f1fa8c',
        error: '#ff5555',
      },
      {
        name: 'Light Mode',
        background: '#ffffff',
        text: '#000000',
        border: '#e0e0e0',
        header: '#f5f5f5',
        accent: '#0078d4',
        success: '#107c10',
        warning: '#ff8c00',
        error: '#d13438',
      },
    ];

    const theme = appThemes.find(t => t.name === themeName);
    if (theme) {
      setTheme(theme);
    }
  };

  useEffect(() => {
    applyCSSVariables(currentTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};