import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { TerminalSessionManager, TerminalTab } from '../services/TerminalSessionManager';

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  background: var(--app-header, #2d2d2d);
  border-bottom: 1px solid var(--app-border, #404040);
  padding: 0;
  gap: 0;
  overflow-x: auto;
  min-height: 36px;
  
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--app-header, #2d2d2d);
  }
  
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 3px;
  }
`;

const Tab = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  min-width: 120px;
  max-width: 200px;
  background: ${props => props.isActive ? 'var(--app-bg, #1e1e1e)' : 'var(--app-header, #2d2d2d)'};
  border-right: 1px solid var(--app-border, #404040);
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.isActive ? 'var(--app-bg, #1e1e1e)' : '#333'};
  }
  
  ${props => props.isActive && `
    border-bottom: 2px solid var(--app-accent, #007acc);
  `}
`;

const TabTitle = styled.span`
  color: var(--app-text, #ffffff);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const TabCloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 2px 4px;
  margin-left: 8px;
  border-radius: 3px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  
  &:hover {
    background: #404040;
    color: #fff;
  }
`;

const NewTabButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #333;
    color: #fff;
  }
`;

const TabControls = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
  border-left: 1px solid #404040;
  gap: 4px;
`;

const SplitButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 6px 8px;
  font-size: 12px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #404040;
    color: #fff;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface TerminalTabsProps {
  onTabChange?: (tabId: string) => void;
  onSplit?: (direction: 'horizontal' | 'vertical') => void;
}

export const TerminalTabs: React.FC<TerminalTabsProps> = ({ onTabChange, onSplit }) => {
  const [tabs, setTabs] = useState<TerminalTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  
  const sessionManager = TerminalSessionManager.getInstance();

  // Subscribe to session manager updates
  useEffect(() => {
    const updateTabs = () => {
      setTabs(sessionManager.getAllTabs());
      const activeTab = sessionManager.getActiveTab();
      setActiveTabId(activeTab?.id || null);
    };

    updateTabs(); // Initial load
    return sessionManager.addListener(updateTabs);
  }, [sessionManager]);

  const handleTabClick = useCallback((tabId: string) => {
    sessionManager.setActiveTab(tabId);
    onTabChange?.(tabId);
  }, [sessionManager, onTabChange]);

  const handleTabClose = useCallback((e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    sessionManager.closeTab(tabId);
  }, [sessionManager]);

  const handleNewTab = useCallback(() => {
    const newTab = sessionManager.createNewTab();
    onTabChange?.(newTab.id);
  }, [sessionManager, onTabChange]);

  const handleSplitHorizontal = useCallback(() => {
    const activeTab = sessionManager.getActiveTab();
    if (activeTab) {
      // Find the first terminal session in the active tab's layout to split
      const sessions = sessionManager.getSessionsInLayout(activeTab.layout);
      if (sessions.length > 0) {
        sessionManager.splitPane(activeTab.id, sessions[0].id, 'horizontal');
        onSplit?.('horizontal');
      }
    }
  }, [sessionManager, onSplit]);

  const handleSplitVertical = useCallback(() => {
    const activeTab = sessionManager.getActiveTab();
    if (activeTab) {
      // Find the first terminal session in the active tab's layout to split
      const sessions = sessionManager.getSessionsInLayout(activeTab.layout);
      if (sessions.length > 0) {
        sessionManager.splitPane(activeTab.id, sessions[0].id, 'vertical');
        onSplit?.('vertical');
      }
    }
  }, [sessionManager, onSplit]);

  const canSplit = tabs.length > 0;

  return (
    <TabsContainer>
      {tabs.map(tab => (
        <Tab
          key={tab.id}
          isActive={tab.id === activeTabId}
          onClick={() => handleTabClick(tab.id)}
        >
          <TabTitle title={tab.title}>
            {tab.title}
          </TabTitle>
          {tabs.length > 1 && (
            <TabCloseButton
              onClick={(e) => handleTabClose(e, tab.id)}
              title="Close tab"
            >
              ×
            </TabCloseButton>
          )}
        </Tab>
      ))}
      
      <NewTabButton
        onClick={handleNewTab}
        title="New tab (Cmd+T)"
      >
        +
      </NewTabButton>
      
      <TabControls>
        <SplitButton
          onClick={handleSplitHorizontal}
          disabled={!canSplit}
          title="Split horizontally"
        >
          ⬌ Split
        </SplitButton>
        <SplitButton
          onClick={handleSplitVertical}
          disabled={!canSplit}
          title="Split vertically"
        >
          ⬍ Split
        </SplitButton>
      </TabControls>
    </TabsContainer>
  );
};