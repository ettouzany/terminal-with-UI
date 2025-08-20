import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const WidgetContainer = styled.div`
  padding: 20px;
  background: #1e1e1e;
  border-radius: 8px;
  color: #ffffff;
  max-height: 600px;
  overflow-y: auto;
`;

const WidgetHeader = styled.h3`
  margin: 0 0 20px 0;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
`;

const Section = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #333;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

const ThemeCard = styled.div<{ isActive: boolean }>`
  padding: 12px;
  border: 2px solid ${props => props.isActive ? '#007acc' : '#333'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #2d2d2d;
  
  &:hover {
    border-color: ${props => props.isActive ? '#007acc' : '#555'};
    background: #333;
  }
`;

const ThemeName = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
  color: #ffffff;
`;

const ThemePreview = styled.div`
  height: 40px;
  border-radius: 4px;
  display: flex;
  padding: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 10px;
  line-height: 1.2;
`;

const TerminalPreview = styled.div<{ theme: any }>`
  background: ${props => props.theme.background};
  color: ${props => props.theme.foreground};
  width: 100%;
  border-radius: 3px;
  padding: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 10px;
  
  .prompt { color: ${props => props.theme.green}; }
  .command { color: ${props => props.theme.blue}; }
  .error { color: ${props => props.theme.red}; }
`;

const AppPreview = styled.div<{ theme: any }>`
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  width: 100%;
  border-radius: 3px;
  padding: 4px;
  font-size: 10px;
  border: 1px solid ${props => props.theme.border};
  
  .header { background: ${props => props.theme.header}; padding: 2px; margin-bottom: 2px; }
  .accent { color: ${props => props.theme.accent}; }
`;

const CustomSection = styled.div`
  margin-top: 16px;
`;

const ColorInput = styled.input`
  width: 40px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
`;

const ColorRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
`;

const ColorLabel = styled.label`
  color: #cccccc;
  font-size: 12px;
  min-width: 100px;
`;

const ResetButton = styled.button`
  background: #cd3131;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 12px;
  
  &:hover {
    background: #f14c4c;
  }
`;

const ApplyButton = styled.button`
  background: #0dbc79;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 8px;
  
  &:hover {
    background: #23d18b;
  }
`;

interface TerminalTheme {
  name: string;
  background: string;
  foreground: string;
  cursor: string;
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
}

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

const terminalThemes: TerminalTheme[] = [
  {
    name: 'Default Dark',
    background: '#000000',
    foreground: '#ffffff',
    cursor: '#ffffff',
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
  {
    name: 'Monokai',
    background: '#272822',
    foreground: '#f8f8f2',
    cursor: '#f8f8f0',
    black: '#272822',
    red: '#f92672',
    green: '#a6e22e',
    yellow: '#f4bf75',
    blue: '#66d9ef',
    magenta: '#ae81ff',
    cyan: '#a1efe4',
    white: '#f8f8f2',
    brightBlack: '#75715e',
    brightRed: '#f92672',
    brightGreen: '#a6e22e',
    brightYellow: '#f4bf75',
    brightBlue: '#66d9ef',
    brightMagenta: '#ae81ff',
    brightCyan: '#a1efe4',
    brightWhite: '#f9f8f5',
  },
  {
    name: 'Dracula',
    background: '#282a36',
    foreground: '#f8f8f2',
    cursor: '#f8f8f0',
    black: '#000000',
    red: '#ff5555',
    green: '#50fa7b',
    yellow: '#f1fa8c',
    blue: '#bd93f9',
    magenta: '#ff79c6',
    cyan: '#8be9fd',
    white: '#bfbfbf',
    brightBlack: '#4d4d4d',
    brightRed: '#ff6e67',
    brightGreen: '#5af78e',
    brightYellow: '#f4f99d',
    brightBlue: '#caa9fa',
    brightMagenta: '#ff92d0',
    brightCyan: '#9aedfe',
    brightWhite: '#e6e6e6',
  },
  {
    name: 'Solarized Dark',
    background: '#002b36',
    foreground: '#839496',
    cursor: '#93a1a1',
    black: '#073642',
    red: '#dc322f',
    green: '#859900',
    yellow: '#b58900',
    blue: '#268bd2',
    magenta: '#d33682',
    cyan: '#2aa198',
    white: '#eee8d5',
    brightBlack: '#002b36',
    brightRed: '#cb4b16',
    brightGreen: '#586e75',
    brightYellow: '#657b83',
    brightBlue: '#839496',
    brightMagenta: '#6c71c4',
    brightCyan: '#93a1a1',
    brightWhite: '#fdf6e3',
  },
  {
    name: 'One Dark',
    background: '#282c34',
    foreground: '#abb2bf',
    cursor: '#528bff',
    black: '#282c34',
    red: '#e06c75',
    green: '#98c379',
    yellow: '#e5c07b',
    blue: '#61afef',
    magenta: '#c678dd',
    cyan: '#56b6c2',
    white: '#abb2bf',
    brightBlack: '#5a6374',
    brightRed: '#e06c75',
    brightGreen: '#98c379',
    brightYellow: '#e5c07b',
    brightBlue: '#61afef',
    brightMagenta: '#c678dd',
    brightCyan: '#56b6c2',
    brightWhite: '#ffffff',
  },
];

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

export const StylesWidget: React.FC = () => {
  const [activeTerminalTheme, setActiveTerminalTheme] = useState('Default Dark');
  const [activeAppTheme, setActiveAppTheme] = useState('Default Dark');
  const [customTerminalTheme, setCustomTerminalTheme] = useState<TerminalTheme>(terminalThemes[0]);
  const [customAppTheme, setCustomAppTheme] = useState<AppTheme>(appThemes[0]);

  useEffect(() => {
    // Load saved themes from localStorage
    const savedTerminalTheme = localStorage.getItem('terminal-theme');
    const savedAppTheme = localStorage.getItem('app-theme');
    
    if (savedTerminalTheme) {
      setActiveTerminalTheme(savedTerminalTheme);
    }
    if (savedAppTheme) {
      setActiveAppTheme(savedAppTheme);
    }
  }, []);

  const applyTerminalTheme = (themeName: string) => {
    const theme = terminalThemes.find(t => t.name === themeName);
    if (theme) {
      setActiveTerminalTheme(themeName);
      localStorage.setItem('terminal-theme', themeName);
      localStorage.setItem('terminal-theme-config', JSON.stringify(theme));
      
      // Trigger terminal theme update event
      window.dispatchEvent(new CustomEvent('terminal-theme-change', { detail: theme }));
    }
  };

  const applyAppTheme = (themeName: string) => {
    const theme = appThemes.find(t => t.name === themeName);
    if (theme) {
      setActiveAppTheme(themeName);
      localStorage.setItem('app-theme', themeName);
      localStorage.setItem('app-theme-config', JSON.stringify(theme));
      
      // Apply CSS custom properties for app theme
      const root = document.documentElement;
      root.style.setProperty('--app-bg', theme.background);
      root.style.setProperty('--app-text', theme.text);
      root.style.setProperty('--app-border', theme.border);
      root.style.setProperty('--app-header', theme.header);
      root.style.setProperty('--app-accent', theme.accent);
      root.style.setProperty('--app-success', theme.success);
      root.style.setProperty('--app-warning', theme.warning);
      root.style.setProperty('--app-error', theme.error);
    }
  };

  const applyCustomTerminalTheme = () => {
    setActiveTerminalTheme('Custom');
    localStorage.setItem('terminal-theme', 'Custom');
    localStorage.setItem('terminal-theme-config', JSON.stringify(customTerminalTheme));
    window.dispatchEvent(new CustomEvent('terminal-theme-change', { detail: customTerminalTheme }));
  };

  const resetToDefaults = () => {
    setActiveTerminalTheme('Default Dark');
    setActiveAppTheme('Default Dark');
    applyTerminalTheme('Default Dark');
    applyAppTheme('Default Dark');
  };

  const updateCustomTerminalColor = (property: keyof TerminalTheme, value: string) => {
    setCustomTerminalTheme(prev => ({ ...prev, [property]: value }));
  };

  return (
    <WidgetContainer>
      <WidgetHeader>
        🎨 Styles & Themes
      </WidgetHeader>

      <Section>
        <SectionTitle>Terminal Themes</SectionTitle>
        <ThemeGrid>
          {terminalThemes.map((theme) => (
            <ThemeCard
              key={theme.name}
              isActive={activeTerminalTheme === theme.name}
              onClick={() => applyTerminalTheme(theme.name)}
            >
              <ThemeName>{theme.name}</ThemeName>
              <ThemePreview>
                <TerminalPreview theme={theme}>
                  <span className="prompt">$</span> <span className="command">ls -la</span><br/>
                  <span className="error">Permission denied</span>
                </TerminalPreview>
              </ThemePreview>
            </ThemeCard>
          ))}
        </ThemeGrid>

        <CustomSection>
          <SectionTitle>Custom Terminal Theme</SectionTitle>
          <ColorRow>
            <ColorInput
              type="color"
              value={customTerminalTheme.background}
              onChange={(e) => updateCustomTerminalColor('background', e.target.value)}
            />
            <ColorLabel>Background</ColorLabel>
          </ColorRow>
          <ColorRow>
            <ColorInput
              type="color"
              value={customTerminalTheme.foreground}
              onChange={(e) => updateCustomTerminalColor('foreground', e.target.value)}
            />
            <ColorLabel>Text</ColorLabel>
          </ColorRow>
          <ColorRow>
            <ColorInput
              type="color"
              value={customTerminalTheme.red}
              onChange={(e) => updateCustomTerminalColor('red', e.target.value)}
            />
            <ColorLabel>Red</ColorLabel>
          </ColorRow>
          <ColorRow>
            <ColorInput
              type="color"
              value={customTerminalTheme.green}
              onChange={(e) => updateCustomTerminalColor('green', e.target.value)}
            />
            <ColorLabel>Green</ColorLabel>
          </ColorRow>
          <ColorRow>
            <ColorInput
              type="color"
              value={customTerminalTheme.blue}
              onChange={(e) => updateCustomTerminalColor('blue', e.target.value)}
            />
            <ColorLabel>Blue</ColorLabel>
          </ColorRow>
          <ApplyButton onClick={applyCustomTerminalTheme}>
            Apply Custom Theme
          </ApplyButton>
        </CustomSection>
      </Section>

      <Section>
        <SectionTitle>Application Themes</SectionTitle>
        <ThemeGrid>
          {appThemes.map((theme) => (
            <ThemeCard
              key={theme.name}
              isActive={activeAppTheme === theme.name}
              onClick={() => applyAppTheme(theme.name)}
            >
              <ThemeName>{theme.name}</ThemeName>
              <ThemePreview>
                <AppPreview theme={theme}>
                  <div className="header">Header</div>
                  <span className="accent">Accent text</span><br/>
                  Normal text
                </AppPreview>
              </ThemePreview>
            </ThemeCard>
          ))}
        </ThemeGrid>
      </Section>

      <ResetButton onClick={resetToDefaults}>
        Reset to Defaults
      </ResetButton>
    </WidgetContainer>
  );
};