import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Terminal } from './components/Terminal';
import { TitleBar } from './components/TitleBar';
import { StatusBar } from './components/StatusBar';
import { WidgetPanel } from './components/WidgetPanel';
import { WidgetStore } from './components/WidgetStore';

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

  const toggleWidgetPanel = useCallback(() => {
    setIsWidgetPanelOpen(prev => !prev);
  }, []);

  const openWidgetStore = useCallback(() => {
    setIsWidgetStoreOpen(true);
  }, []);

  const closeWidgetStore = useCallback(() => {
    setIsWidgetStoreOpen(false);
  }, []);

  return (
    <AppContainer>
      <TitleBar 
        onToggleWidgets={toggleWidgetPanel} 
        onOpenStore={openWidgetStore}
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