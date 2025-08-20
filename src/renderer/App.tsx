import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Terminal } from './components/Terminal';
import { WidgetPanel } from './components/WidgetPanel';
import { TitleBar } from './components/TitleBar';

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

  const toggleWidgetPanel = useCallback(() => {
    setIsWidgetPanelOpen(prev => !prev);
  }, []);

  return (
    <AppContainer>
      <TitleBar onToggleWidgets={toggleWidgetPanel} />
      <MainContent>
        <TerminalContainer>
          <Terminal />
        </TerminalContainer>
        <SidePanel isOpen={isWidgetPanelOpen}>
          <WidgetPanel />
        </SidePanel>
      </MainContent>
    </AppContainer>
  );
};