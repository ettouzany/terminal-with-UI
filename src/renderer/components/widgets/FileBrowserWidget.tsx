import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WidgetProps } from '../../../shared/types';

const WidgetCard = styled.div`
  background: #2d2d2d;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #3e3e3e;
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const WidgetTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #cccccc;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PathBar = styled.div`
  background: #404040;
  border-radius: 4px;
  padding: 6px 10px;
  margin-bottom: 8px;
  font-size: 11px;
  font-family: 'Monaco', 'Menlo', monospace;
  color: #cccccc;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PathSegment = styled.button`
  background: none;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 11px;
  font-family: inherit;

  &:hover {
    background: #555;
  }
`;

const FileList = styled.div`
  flex: 1;
  overflow-y: auto;
  border: 1px solid #404040;
  border-radius: 4px;
  background: #1e1e1e;
`;

const FileItem = styled.div<{ isDirectory?: boolean; isSelected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 12px;
  color: ${props => props.isDirectory ? '#66d9ef' : '#cccccc'};
  background: ${props => props.isSelected ? '#404040' : 'transparent'};
  border-bottom: 1px solid #333;

  &:hover {
    background: #333;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const FileIcon = styled.span`
  margin-right: 8px;
  width: 16px;
  text-align: center;
  font-size: 12px;
`;

const FileName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileSize = styled.span`
  color: #666;
  font-size: 10px;
  margin-left: 8px;
  font-family: 'Monaco', 'Menlo', monospace;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background: #404040;
  border: 1px solid #555;
  color: #cccccc;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  flex: 1;

  &:hover {
    background: #505050;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface FileSystemItem {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  path: string;
  modified?: Date;
}

export const FileBrowserWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
  const [currentPath, setCurrentPath] = useState('/Users');
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock file system data - in real implementation, this would use fs API
  const generateMockFiles = (path: string): FileSystemItem[] => {
    const baseName = path.split('/').pop() || 'root';
    
    const mockData: Record<string, FileSystemItem[]> = {
      '/Users': [
        { name: 'macmini', type: 'directory', path: '/Users/macmini' },
        { name: 'Shared', type: 'directory', path: '/Users/Shared' },
        { name: 'Guest', type: 'directory', path: '/Users/Guest' },
      ],
      '/Users/macmini': [
        { name: 'Desktop', type: 'directory', path: '/Users/macmini/Desktop' },
        { name: 'Documents', type: 'directory', path: '/Users/macmini/Documents' },
        { name: 'Downloads', type: 'directory', path: '/Users/macmini/Downloads' },
        { name: 'Pictures', type: 'directory', path: '/Users/macmini/Pictures' },
        { name: '.bashrc', type: 'file', size: 1024, path: '/Users/macmini/.bashrc' },
        { name: '.gitconfig', type: 'file', size: 512, path: '/Users/macmini/.gitconfig' },
      ],
      '/Users/macmini/Desktop': [
        { name: 'new_terminal', type: 'directory', path: '/Users/macmini/Desktop/new_terminal' },
        { name: 'project.txt', type: 'file', size: 2048, path: '/Users/macmini/Desktop/project.txt' },
        { name: 'notes.md', type: 'file', size: 1536, path: '/Users/macmini/Desktop/notes.md' },
      ],
    };

    return mockData[path] || [
      { name: '..', type: 'directory', path: getParentPath(path) },
      { name: 'example.txt', type: 'file', size: 1024, path: `${path}/example.txt` },
      { name: 'subfolder', type: 'directory', path: `${path}/subfolder` },
    ];
  };

  const getParentPath = (path: string): string => {
    if (path === '/') return '/';
    const segments = path.split('/').filter(Boolean);
    segments.pop();
    return '/' + segments.join('/');
  };

  const loadDirectory = async (path: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const files = generateMockFiles(path);
      setItems(files);
      setCurrentPath(path);
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to load directory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDirectory(currentPath);
  }, []);

  const handleItemClick = (item: FileSystemItem) => {
    setSelectedItem(item.name);
    if (item.type === 'directory') {
      loadDirectory(item.path);
    }
  };

  const handlePathSegmentClick = (segmentPath: string) => {
    loadDirectory(segmentPath);
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(size < 10 ? 1 : 0)}${units[unitIndex]}`;
  };

  const getFileIcon = (item: FileSystemItem): string => {
    if (item.type === 'directory') {
      return item.name === '..' ? '↩️' : '📁';
    }
    
    const ext = item.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': case 'ts': case 'tsx': case 'jsx': return '📄';
      case 'json': return '⚙️';
      case 'md': case 'txt': return '📝';
      case 'png': case 'jpg': case 'jpeg': case 'gif': return '🖼️';
      case 'zip': case 'tar': case 'gz': return '📦';
      default: return '📄';
    }
  };

  const pathSegments = currentPath.split('/').filter(Boolean);
  const fullSegments = ['/', ...pathSegments];

  const handleOpenInTerminal = () => {
    if (selectedItem) {
      const item = items.find(i => i.name === selectedItem);
      if (item) {
        // TODO: Integrate with terminal to cd to directory or open file
        console.log('Opening in terminal:', item.path);
      }
    }
  };

  const handleRefresh = () => {
    loadDirectory(currentPath);
  };

  const handleGoUp = () => {
    const parentPath = getParentPath(currentPath);
    if (parentPath !== currentPath) {
      loadDirectory(parentPath);
    }
  };

  return (
    <WidgetCard>
      <WidgetTitle>
        📁 File Browser
        <ActionButton onClick={handleRefresh} disabled={loading}>
          {loading ? '⏳' : '🔄'}
        </ActionButton>
      </WidgetTitle>
      
      <PathBar>
        {fullSegments.map((segment, index) => {
          const segmentPath = index === 0 ? '/' : '/' + fullSegments.slice(1, index + 1).join('/');
          return (
            <React.Fragment key={index}>
              <PathSegment onClick={() => handlePathSegmentClick(segmentPath)}>
                {segment === '/' ? '🏠' : segment}
              </PathSegment>
              {index < fullSegments.length - 1 && <span>/</span>}
            </React.Fragment>
          );
        })}
      </PathBar>

      <FileList>
        {loading ? (
          <FileItem>
            <FileIcon>⏳</FileIcon>
            <FileName>Loading...</FileName>
          </FileItem>
        ) : (
          items.map((item) => (
            <FileItem
              key={item.name}
              isDirectory={item.type === 'directory'}
              isSelected={selectedItem === item.name}
              onClick={() => handleItemClick(item)}
            >
              <FileIcon>{getFileIcon(item)}</FileIcon>
              <FileName>{item.name}</FileName>
              {item.size && <FileSize>{formatFileSize(item.size)}</FileSize>}
            </FileItem>
          ))
        )}
      </FileList>

      <ActionButtons>
        <ActionButton onClick={handleGoUp} disabled={currentPath === '/'}>
          ⬆️ Up
        </ActionButton>
        <ActionButton 
          onClick={handleOpenInTerminal} 
          disabled={!selectedItem}
        >
          📺 Terminal
        </ActionButton>
      </ActionButtons>
    </WidgetCard>
  );
};