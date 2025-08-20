import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { TabInfo } from '../../shared/types';

const TabBarContainer = styled.div`
  display: flex;
  background: #2d2d2d;
  border-bottom: 1px solid #3e3e3e;
  padding: 0 8px;
  min-height: 36px;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    height: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 1px;
  }
`;

const Tab = styled.div<{ isActive: boolean; isDragging?: boolean }>`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  margin: 4px 2px;
  background: ${props => props.isActive ? '#404040' : 'transparent'};
  border: 1px solid ${props => props.isActive ? '#555' : 'transparent'};
  border-radius: 6px;
  cursor: pointer;
  min-width: 120px;
  max-width: 200px;
  position: relative;
  transition: all 0.15s ease;
  opacity: ${props => props.isDragging ? 0.5 : 1};
  user-select: none;

  &:hover {
    background: ${props => props.isActive ? '#404040' : '#333'};
  }
`;

const TabTitle = styled.span`
  color: ${props => props.color || '#cccccc'};
  font-size: 12px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
`;

const TabPath = styled.span`
  color: #666;
  font-size: 10px;
  margin-left: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  margin-left: 4px;
  transition: all 0.15s ease;

  &:hover {
    background: #555;
    color: #fff;
  }
`;

const NewTabButton = styled.button`
  background: none;
  border: 1px solid #555;
  color: #cccccc;
  cursor: pointer;
  padding: 6px 12px;
  margin: 4px 8px 4px 4px;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease;
  min-width: auto;

  &:hover {
    background: #333;
    border-color: #666;
  }
`;

const ModifiedIndicator = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffa500;
  margin-right: 4px;
`;

interface TabBarProps {
  tabs: TabInfo[];
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
  onTabMove?: (fromIndex: number, toIndex: number) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  onTabSelect,
  onTabClose,
  onNewTab,
  onTabMove
}) => {
  const [draggedTab, setDraggedTab] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleTabClick = (tabId: string) => {
    onTabSelect(tabId);
  };

  const handleCloseClick = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClose(tabId);
  };

  const handleDragStart = useCallback((e: React.DragEvent, tabId: string, index: number) => {
    setDraggedTab(tabId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tabId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedTab && onTabMove) {
      const draggedIndex = tabs.findIndex(tab => tab.id === draggedTab);
      if (draggedIndex !== -1 && draggedIndex !== dropIndex) {
        onTabMove(draggedIndex, dropIndex);
      }
    }
    
    setDraggedTab(null);
    setDragOverIndex(null);
  }, [draggedTab, tabs, onTabMove]);

  const handleDragEnd = useCallback(() => {
    setDraggedTab(null);
    setDragOverIndex(null);
  }, []);

  const getTabDisplayPath = (path: string): string => {
    const parts = path.split('/');
    return parts[parts.length - 1] || path;
  };

  return (
    <TabBarContainer>
      {tabs.map((tab, index) => (
        <Tab
          key={tab.id}
          isActive={tab.active}
          isDragging={draggedTab === tab.id}
          onClick={() => handleTabClick(tab.id)}
          draggable
          onDragStart={(e) => handleDragStart(e, tab.id, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
        >
          {tab.modified && <ModifiedIndicator />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <TabTitle>{tab.title}</TabTitle>
            <TabPath>{getTabDisplayPath(tab.path)}</TabPath>
          </div>
          <CloseButton
            onClick={(e) => handleCloseClick(e, tab.id)}
            title="Close tab"
          >
            ✕
          </CloseButton>
        </Tab>
      ))}
      
      <NewTabButton onClick={onNewTab} title="New terminal (Cmd+T)">
        <span>+</span>
        <span>New</span>
      </NewTabButton>
    </TabBarContainer>
  );
};