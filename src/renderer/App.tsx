import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Terminal } from './components/Terminal';
import { WidgetPanel } from './components/WidgetPanel';
import { TitleBar } from './components/TitleBar';
import { CommandPalette } from './components/CommandPalette';
import { TabBar } from './components/TabBar';
import { StatusBar } from './components/StatusBar';
import { DragDropOverlay } from './components/DragDropOverlay';
import { ProgressIndicators, useProgressManager } from './components/ProgressIndicators';
import { TerminalManager } from './services/TerminalManager';
import { ThemeManager } from './services/ThemeManager';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1e1e1e;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const TerminalContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SidePanel = styled.div<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '300px' : '0px'};
  transition: width 0.3s ease;
  border-left: 1px solid #333;
  background: #252526;
  overflow: hidden;
`;

export const App: React.FC = () => {
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [tabs, setTabs] = useState(() => {
    const terminalManager = TerminalManager.getInstance();
    terminalManager.createSession('Terminal 1');
    return terminalManager.getTabsInfo();
  });
  
  const progressManager = useProgressManager();
  const terminalManager = TerminalManager.getInstance();
  const themeManager = ThemeManager.getInstance();

  const toggleWidgetPanel = useCallback(() => {
    setIsWidgetPanelOpen(prev => !prev);
  }, []);

  const toggleCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(prev => !prev);
  }, []);

  const handleNewTab = useCallback(() => {
    const session = terminalManager.createSession();
    setTabs(terminalManager.getTabsInfo());
    
    progressManager.addTask({
      title: 'Creating new terminal',
      description: `Terminal "${session.title}" created`,
      type: 'success',
      progress: 100
    });
  }, [terminalManager, progressManager]);

  const handleTabSelect = useCallback((tabId: string) => {
    terminalManager.setActiveSession(tabId);
    setTabs(terminalManager.getTabsInfo());
  }, [terminalManager]);

  const handleTabClose = useCallback((tabId: string) => {
    if (tabs.length > 1) {
      terminalManager.removeSession(tabId);
      setTabs(terminalManager.getTabsInfo());
    }
  }, [terminalManager, tabs.length]);

  const handleTabMove = useCallback((fromIndex: number, toIndex: number) => {
    terminalManager.moveTab(fromIndex, toIndex);
    setTabs(terminalManager.getTabsInfo());
  }, [terminalManager]);

  const handleFileDrop = useCallback((files: FileList) => {
    const filePaths = Array.from(files).map(file => file.path || file.name);
    const pathString = filePaths.map(path => `"${path}"`).join(' ');
    
    progressManager.addTask({
      title: 'Files dropped',
      description: `Added ${files.length} file path(s) to terminal`,
      type: 'success',
      progress: 100
    });

    // TODO: Insert file paths into active terminal
    console.log('Dropped files:', pathString);
  }, [progressManager]);

  const handleTextDrop = useCallback((text: string) => {
    progressManager.addTask({
      title: 'Text dropped',
      description: 'Added text to terminal',
      type: 'success',
      progress: 100
    });

    // TODO: Insert text into active terminal
    console.log('Dropped text:', text);
  }, [progressManager]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        toggleCommandPalette();
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        handleNewTab();
      }

      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        themeManager.nextTheme();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette, handleNewTab, themeManager]);

  useEffect(() => {
    themeManager.loadThemePreference();
  }, [themeManager]);

  return (
    <AppContainer>
      <TitleBar onToggleWidgets={toggleWidgetPanel} />
      <TabBar
        tabs={tabs}
        onTabSelect={handleTabSelect}
        onTabClose={handleTabClose}
        onNewTab={handleNewTab}
        onTabMove={handleTabMove}
      />
      <MainContent>
        <TerminalContainer>
          <Terminal />
        </TerminalContainer>
        <SidePanel isOpen={isWidgetPanelOpen}>
          <WidgetPanel />
        </SidePanel>
      </MainContent>
      <StatusBar />
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
      
      <DragDropOverlay
        onFileDrop={handleFileDrop}
        onTextDrop={handleTextDrop}
      />
      
      <ProgressIndicators
        tasks={progressManager.tasks}
        onTaskClose={progressManager.removeTask}
      />
    </AppContainer>
  );
};