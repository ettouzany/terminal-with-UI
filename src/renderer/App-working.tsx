import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Terminal } from './components/Terminal';
import { TitleBar } from './components/TitleBar';
import { StatusBar } from './components/StatusBar';
import { WidgetPanel } from './components/WidgetPanel';
import { WidgetStore } from './components/WidgetStore';
import { TerminalTabs } from './components/TerminalTabs';
import { TerminalLayout } from './components/TerminalLayout';
import { TerminalSessionManager, TerminalTab } from './services/TerminalSessionManager';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--app-bg, #1e1e1e);
  color: var(--app-text, #ffffff);
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
  min-width: ${props => props.isOpen ? '250px' : '0px'};
  max-width: ${props => props.isOpen ? '400px' : '0px'};
  transition: width 0.3s ease;
  border-left: 1px solid #333;
  background: #252526;
  overflow: hidden;
  flex-shrink: 0;
  
  @media (max-width: 1200px) {
    width: ${props => props.isOpen ? '280px' : '0px'};
    min-width: ${props => props.isOpen ? '240px' : '0px'};
  }
  
  @media (max-width: 1000px) {
    width: ${props => props.isOpen ? '250px' : '0px'};
    min-width: ${props => props.isOpen ? '200px' : '0px'};
  }
  
  @media (max-width: 800px) {
    position: fixed;
    top: 40px;
    right: 0;
    bottom: 0;
    width: ${props => props.isOpen ? '280px' : '0px'};
    min-width: ${props => props.isOpen ? '280px' : '0px'};
    z-index: 1000;
    box-shadow: ${props => props.isOpen ? '-4px 0 12px rgba(0, 0, 0, 0.3)' : 'none'};
    border-left: ${props => props.isOpen ? '1px solid #444' : 'none'};
  }
`;

const MobileBackdrop = styled.div<{ isVisible: boolean }>`
  display: none;
  
  @media (max-width: 800px) {
    display: ${props => props.isVisible ? 'block' : 'none'};
    position: fixed;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    backdrop-filter: blur(2px);
  }
`;

export const App: React.FC = () => {
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(true);
  const [isWidgetStoreOpen, setIsWidgetStoreOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TerminalTab | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [layoutKey, setLayoutKey] = useState(0); // Force re-render key
  
  const sessionManager = TerminalSessionManager.getInstance();

  const toggleWidgetPanel = useCallback(() => {
    setIsWidgetPanelOpen(prev => !prev);
  }, []);

  const openWidgetStore = useCallback(() => {
    setIsWidgetStoreOpen(true);
  }, []);

  const closeWidgetStore = useCallback(() => {
    setIsWidgetStoreOpen(false);
  }, []);

  // Terminal management
  useEffect(() => {
    const updateActiveTab = () => {
      const activeTab = sessionManager.getActiveTab();
      setActiveTab(activeTab || null);
      setLayoutKey(prev => prev + 1); // Force re-render
      
      // Set the first session in the active tab as active session
      if (activeTab) {
        const sessions = sessionManager.getSessionsInLayout(activeTab.layout);
        if (sessions.length > 0) {
          setActiveSessionId(sessions[0].id);
        }
      }
    };

    updateActiveTab(); // Initial load
    return sessionManager.addListener(updateActiveTab);
  }, [sessionManager]);

  const handleTabChange = useCallback((tabId: string) => {
    const tab = sessionManager.getTab(tabId);
    if (tab) {
      setActiveTab(tab);
      const sessions = sessionManager.getSessionsInLayout(tab.layout);
      if (sessions.length > 0) {
        setActiveSessionId(sessions[0].id);
      }
    }
  }, [sessionManager]);

  const handleSessionClick = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  const handleSplit = useCallback((direction: 'horizontal' | 'vertical') => {
    // Split handling is managed by the TerminalLayout component
    console.log(`Split ${direction}`);
  }, []);

  return (
    <AppContainer>
      <TitleBar 
        onToggleWidgets={toggleWidgetPanel} 
        onOpenStore={openWidgetStore}
      />
      <MainContent>
        <TerminalContainer>
          <TerminalTabs
            onTabChange={handleTabChange}
            onSplit={handleSplit}
          />
          {activeTab && (
            <TerminalLayout
              key={layoutKey}
              layout={activeTab.layout}
              activeSessionId={activeSessionId}
              onSessionClick={handleSessionClick}
            />
          )}
        </TerminalContainer>
        <SidePanel isOpen={isWidgetPanelOpen}>
          <WidgetPanel />
        </SidePanel>
      </MainContent>
      <StatusBar />
      
      {/* Mobile backdrop for widget panel */}
      <MobileBackdrop 
        isVisible={isWidgetPanelOpen} 
        onClick={toggleWidgetPanel}
      />
      
      <WidgetStore 
        isOpen={isWidgetStoreOpen} 
        onClose={closeWidgetStore} 
      />
    </AppContainer>
  );
};