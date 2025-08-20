import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Terminal } from './Terminal';
import { TerminalSessionManager, TerminalLayout as TerminalLayoutType } from '../services/TerminalSessionManager';
import { TerminalSession, SplitPane } from '../../shared/types';

const LayoutContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
`;

const SplitContainer = styled.div<{ direction: 'horizontal' | 'vertical' }>`
  display: flex;
  flex: 1;
  flex-direction: ${props => props.direction === 'horizontal' ? 'row' : 'column'};
  overflow: hidden;
`;

const PaneContainer = styled.div<{ size: number; isResizing?: boolean }>`
  flex: ${props => props.size};
  display: flex;
  flex-direction: column;
  min-width: ${props => props.isResizing ? '100px' : '200px'};
  min-height: ${props => props.isResizing ? '50px' : '100px'};
  overflow: hidden;
  position: relative;
`;

const ResizeHandle = styled.div<{ direction: 'horizontal' | 'vertical' }>`
  ${props => props.direction === 'horizontal' ? `
    width: 4px;
    cursor: ew-resize;
    background: #404040;
    
    &:hover {
      background: #007acc;
    }
  ` : `
    height: 4px;
    cursor: ns-resize;
    background: #404040;
    
    &:hover {
      background: #007acc;
    }
  `}
  
  transition: background-color 0.2s ease;
  z-index: 10;
  
  &:active {
    background: #007acc;
  }
`;

const TerminalContainer = styled.div<{ isActive: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 2px solid ${props => props.isActive ? '#007acc' : 'transparent'};
  transition: border-color 0.2s ease;
  position: relative;
  overflow: hidden;
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #333;
  padding: 4px 8px;
  border-bottom: 1px solid #404040;
  font-size: 11px;
  color: #ccc;
  min-height: 24px;
`;

const TerminalTitle = styled.span`
  font-weight: 500;
`;

const TerminalActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${TerminalContainer}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 10px;
  
  &:hover {
    background: #404040;
    color: #fff;
  }
`;

interface TerminalLayoutProps {
  layout: TerminalLayoutType;
  activeSessionId?: string;
  onSessionClick?: (sessionId: string) => void;
}

export const TerminalLayout: React.FC<TerminalLayoutProps> = ({ 
  layout, 
  activeSessionId, 
  onSessionClick 
}) => {
  const [resizing, setResizing] = useState<string | null>(null);
  const sessionManager = TerminalSessionManager.getInstance();

  const renderLayout = useCallback((layout: TerminalLayoutType): React.ReactNode => {
    if ('children' in layout) {
      // It's a SplitPane
      return renderSplitPane(layout);
    } else {
      // It's a TerminalSession
      return renderTerminalSession(layout);
    }
  }, [activeSessionId, onSessionClick]);

  const renderSplitPane = (splitPane: SplitPane): React.ReactNode => {
    return (
      <SplitContainer 
        direction={splitPane.direction} 
        data-split-container 
        data-split-id={splitPane.id}
      >
        {splitPane.children.map((child, index) => (
          <React.Fragment key={'id' in child ? child.id : `child-${index}`}>
            <PaneContainer 
              size={100 / splitPane.children.length} 
              isResizing={resizing !== null}
              data-pane
            >
              {renderLayout(child)}
            </PaneContainer>
            {index < splitPane.children.length - 1 && (
              <ResizeHandle 
                direction={splitPane.direction}
                onMouseDown={(e) => handleResizeStart(e, splitPane, index)}
              />
            )}
          </React.Fragment>
        ))}
      </SplitContainer>
    );
  };

  const renderTerminalSession = (session: TerminalSession): React.ReactNode => {
    const isActive = session.id === activeSessionId;
    
    return (
      <TerminalContainer 
        isActive={isActive}
        onClick={() => onSessionClick?.(session.id)}
      >
        <TerminalHeader>
          <TerminalTitle>{session.title}</TerminalTitle>
          <TerminalActions>
            <ActionButton
              onClick={(e) => handleSplitHorizontal(e, session.id)}
              title="Split horizontally"
            >
              ⬌
            </ActionButton>
            <ActionButton
              onClick={(e) => handleSplitVertical(e, session.id)}
              title="Split vertically"
            >
              ⬍
            </ActionButton>
            <ActionButton
              onClick={(e) => handleCloseSession(e, session.id)}
              title="Close terminal"
            >
              ×
            </ActionButton>
          </TerminalActions>
        </TerminalHeader>
        <Terminal sessionId={session.id} />
      </TerminalContainer>
    );
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    splitPane: SplitPane,
    handleIndex: number
  ) => {
    e.preventDefault();
    setResizing(`${splitPane.id}-${handleIndex}`);
    
    const startPos = splitPane.direction === 'horizontal' ? e.clientX : e.clientY;
    const container = (e.target as HTMLElement).closest('[data-split-container]') as HTMLElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const containerSize = splitPane.direction === 'horizontal' ? containerRect.width : containerRect.height;
    
    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = splitPane.direction === 'horizontal' ? e.clientX : e.clientY;
      const containerStart = splitPane.direction === 'horizontal' ? containerRect.left : containerRect.top;
      const relativePos = currentPos - containerStart;
      const percentage = (relativePos / containerSize) * 100;
      
      // Update the split pane sizes
      updateSplitPaneSizes(splitPane.id, handleIndex, percentage);
    };

    const handleMouseUp = () => {
      setResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const updateSplitPaneSizes = (splitPaneId: string, handleIndex: number, percentage: number) => {
    // This would need to be passed up to the session manager to update the layout
    // For now, we'll implement basic resize by updating the DOM directly
    const container = document.querySelector(`[data-split-id="${splitPaneId}"]`) as HTMLElement;
    if (!container) return;
    
    const panes = container.querySelectorAll('[data-pane]');
    if (panes.length >= 2 && handleIndex < panes.length - 1) {
      const leftPane = panes[handleIndex] as HTMLElement;
      const rightPane = panes[handleIndex + 1] as HTMLElement;
      
      // Constrain percentage between 10% and 90%
      const constrainedPercentage = Math.max(10, Math.min(90, percentage));
      const remainingPercentage = 100 - constrainedPercentage;
      
      leftPane.style.flex = `${constrainedPercentage}`;
      rightPane.style.flex = `${remainingPercentage}`;
    }
  };

  const handleSplitHorizontal = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const activeTab = sessionManager.getActiveTab();
    if (activeTab) {
      sessionManager.splitPane(activeTab.id, sessionId, 'horizontal');
    }
  };

  const handleSplitVertical = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const activeTab = sessionManager.getActiveTab();
    if (activeTab) {
      sessionManager.splitPane(activeTab.id, sessionId, 'vertical');
    }
  };

  const handleCloseSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    // TODO: Implement session close logic with layout update
    sessionManager.removeSession(sessionId);
  };

  return (
    <LayoutContainer>
      {renderLayout(layout)}
    </LayoutContainer>
  );
};