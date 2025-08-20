import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Widget } from '../../shared/types';
import { WidgetRegistry } from '../services/WidgetRegistry';
import { WidgetManager } from '../services/WidgetManager';

const StoreOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1100;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const StoreContainer = styled.div`
  background: #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid #404040;
  width: 900px;
  max-width: 95vw;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const StoreHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #404040;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StoreTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  font-size: 16px;

  &:hover {
    background: #404040;
    color: #fff;
  }
`;

const StoreContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 200px;
  background: #333;
  border-right: 1px solid #404040;
  padding: 16px;
  overflow-y: auto;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CategoryItem = styled.button<{ isActive: boolean }>`
  background: ${props => props.isActive ? '#007acc' : 'transparent'};
  border: none;
  color: ${props => props.isActive ? '#ffffff' : '#cccccc'};
  padding: 8px 12px;
  border-radius: 6px;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => props.isActive ? '#007acc' : '#404040'};
  }
`;

const MainArea = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #404040;
  border: 1px solid #555;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  margin-bottom: 16px;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #007acc;
  }
`;

const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const WidgetCard = styled.div`
  background: #333;
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.15s ease;
  cursor: pointer;

  &:hover {
    border-color: #555;
    transform: translateY(-2px);
  }
`;

const WidgetCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const WidgetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WidgetIcon = styled.span`
  font-size: 20px;
`;

const WidgetName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const WidgetStatus = styled.span<{ installed: boolean }>`
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${props => props.installed ? '#0dbc79' : '#666'};
  color: white;
`;

const WidgetDescription = styled.p`
  font-size: 14px;
  color: #cccccc;
  margin: 8px 0;
  line-height: 1.4;
`;

const WidgetMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const WidgetCategory = styled.span`
  font-size: 12px;
  color: #999;
  text-transform: capitalize;
`;

const InstallButton = styled.button<{ installed: boolean }>`
  background: ${props => props.installed ? '#cd3131' : '#007acc'};
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => props.installed ? '#aa2828' : '#0088cc'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface StoreWidget extends Widget {
  author: string;
  version: string;
  downloads: number;
  rating: number;
  installed: boolean;
}

const categories = [
  { id: 'all', name: 'All Widgets', count: 14 },
  { id: 'productivity', name: 'Productivity', count: 4 },
  { id: 'system', name: 'System', count: 4 },
  { id: 'development', name: 'Development', count: 2 },
  { id: 'media', name: 'Media', count: 1 },
  { id: 'time', name: 'Time & Date', count: 1 },
  { id: 'entertainment', name: 'Entertainment', count: 2 },
];

interface WidgetStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WidgetStore: React.FC<WidgetStoreProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableWidgets, setAvailableWidgets] = useState<StoreWidget[]>([]);
  const [installedWidgets, setInstalledWidgets] = useState<Set<string>>(new Set());
  
  const widgetRegistry = WidgetRegistry.getInstance();
  const widgetManager = WidgetManager.getInstance();

  useEffect(() => {
    // Load available widgets from "marketplace"
    const mockMarketplaceWidgets: StoreWidget[] = [
      {
        id: 'task-manager',
        name: 'Task Manager',
        icon: '⚡',
        description: 'Monitor system processes, CPU and memory usage with process management controls',
        category: 'system',
        component: () => null, // Will be loaded dynamically
        author: 'Terminal Team',
        version: '1.0.0',
        downloads: 1342,
        rating: 4.8,
        installed: false,
      },
      {
        id: 'video-background',
        name: 'Video Background',
        icon: '🎥',
        description: 'Add video backgrounds behind your terminal with full playback controls',
        category: 'media',
        component: () => null, // Will be loaded dynamically
        author: 'Terminal Team',
        version: '1.0.0',
        downloads: 856,
        rating: 4.7,
        installed: false,
      },
      {
        id: 'file-browser',
        name: 'File Browser',
        icon: '📁',
        description: 'Browse and navigate your file system with an intuitive interface',
        category: 'productivity',
        component: () => null, // Will be loaded dynamically
        author: 'Terminal Team',
        version: '1.0.0',
        downloads: 1250,
        rating: 4.8,
        installed: false,
      },
      {
        id: 'git-status',
        name: 'Git Status',
        icon: '🔀',
        description: 'Monitor git repository status, branches, and commit history',
        category: 'development',
        component: () => null,
        author: 'DevTools Inc',
        version: '2.1.0',
        downloads: 2100,
        rating: 4.9,
        installed: false,
      },
      {
        id: 'cpu-monitor',
        name: 'CPU Monitor',
        icon: '⚡',
        description: 'Advanced CPU monitoring with core-level metrics and history',
        category: 'system',
        component: () => null,
        author: 'SysAdmin Tools',
        version: '1.5.2',
        downloads: 890,
        rating: 4.6,
        installed: false,
      },
      {
        id: 'weather',
        name: 'Weather Widget',
        icon: '🌤️',
        description: 'Current weather conditions and 5-day forecast',
        category: 'productivity',
        component: () => null,
        author: 'WeatherCorp',
        version: '3.0.1',
        downloads: 3200,
        rating: 4.7,
        installed: false,
      },
      {
        id: 'todo-list',
        name: 'Todo List',
        icon: '✅',
        description: 'Simple and elegant task management right in your terminal',
        category: 'productivity',
        component: () => null,
        author: 'Productivity Plus',
        version: '1.2.0',
        downloads: 1800,
        rating: 4.5,
        installed: false,
      },
      {
        id: 'docker-stats',
        name: 'Docker Stats',
        icon: '🐳',
        description: 'Monitor Docker containers, images, and resource usage',
        category: 'development',
        component: () => null,
        author: 'Container Tools',
        version: '2.0.0',
        downloads: 750,
        rating: 4.8,
        installed: false,
      },
      {
        id: 'network-monitor',
        name: 'Network Monitor',
        icon: '📡',
        description: 'Real-time network bandwidth and connection monitoring',
        category: 'system',
        component: () => null,
        author: 'NetTools',
        version: '1.3.1',
        downloads: 640,
        rating: 4.4,
        installed: false,
      },
      {
        id: 'music-player',
        name: 'Music Player',
        icon: '🎵',
        description: 'Lightweight music player with playlist support',
        category: 'entertainment',
        component: () => null,
        author: 'AudioStream',
        version: '2.2.0',
        downloads: 1100,
        rating: 4.3,
        installed: false,
      },
    ];

    // Check which widgets are already installed
    const currentWidgets = widgetRegistry.getAllWidgets();
    const installedIds = new Set(currentWidgets.map(w => w.id));
    
    const widgetsWithInstallStatus = mockMarketplaceWidgets.map(widget => ({
      ...widget,
      installed: installedIds.has(widget.id)
    }));

    setAvailableWidgets(widgetsWithInstallStatus);
    setInstalledWidgets(installedIds);
  }, [widgetRegistry]);

  const filteredWidgets = availableWidgets.filter(widget => {
    const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
    const matchesSearch = widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInstallWidget = async (widget: StoreWidget) => {
    try {
      if (widget.installed) {
        // Uninstall widget
        widgetRegistry.unregister(widget.id);
        setInstalledWidgets(prev => {
          const newSet = new Set(prev);
          newSet.delete(widget.id);
          return newSet;
        });
      } else {
        // Install widget - in real implementation, this would load the widget dynamically
        if (widget.id === 'task-manager') {
          // Import and register the task manager widget
          const { TaskManagerWidget } = await import('./widgets/TaskManagerWidget');
          widgetRegistry.register({
            ...widget,
            component: TaskManagerWidget,
          });
          
          // Auto-create an instance
          widgetManager.createInstance(widget.id, { x: 300, y: 100 }, { width: 320, height: 450 });
        } else if (widget.id === 'video-background') {
          // Import and register the video background widget
          const { VideoBackgroundWidget } = await import('./widgets/VideoBackgroundWidget');
          widgetRegistry.register({
            ...widget,
            component: VideoBackgroundWidget,
          });
          
          // Auto-create an instance
          widgetManager.createInstance(widget.id, { x: 0, y: 500 }, { width: 280, height: 400 });
        } else if (widget.id === 'file-browser') {
          // Import and register the file browser widget
          const { FileBrowserWidget } = await import('./widgets/FileBrowserWidget');
          widgetRegistry.register({
            ...widget,
            component: FileBrowserWidget,
          });
          
          // Auto-create an instance
          widgetManager.createInstance(widget.id, { x: 0, y: 500 }, { width: 280, height: 400 });
        }
        
        setInstalledWidgets(prev => new Set([...prev, widget.id]));
      }

      // Update the widget list
      setAvailableWidgets(prev => prev.map(w => 
        w.id === widget.id ? { ...w, installed: !w.installed } : w
      ));
    } catch (error) {
      console.error('Failed to install/uninstall widget:', error);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <StoreOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <StoreContainer>
        <StoreHeader>
          <StoreTitle>
            🏪 Widget Store
          </StoreTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </StoreHeader>

        <StoreContent>
          <Sidebar>
            <CategoryList>
              {categories.map(category => (
                <CategoryItem
                  key={category.id}
                  isActive={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.count})
                </CategoryItem>
              ))}
            </CategoryList>
          </Sidebar>

          <MainArea>
            <SearchBar
              type="text"
              placeholder="Search widgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <WidgetGrid>
              {filteredWidgets.map(widget => (
                <WidgetCard key={widget.id}>
                  <WidgetCardHeader>
                    <WidgetInfo>
                      <WidgetIcon>{widget.icon}</WidgetIcon>
                      <WidgetName>{widget.name}</WidgetName>
                    </WidgetInfo>
                    <WidgetStatus installed={widget.installed}>
                      {widget.installed ? 'Installed' : 'Available'}
                    </WidgetStatus>
                  </WidgetCardHeader>

                  <WidgetDescription>{widget.description}</WidgetDescription>

                  <WidgetMeta>
                    <WidgetCategory>{widget.category}</WidgetCategory>
                    <InstallButton
                      installed={widget.installed}
                      onClick={() => handleInstallWidget(widget)}
                    >
                      {widget.installed ? 'Uninstall' : 'Install'}
                    </InstallButton>
                  </WidgetMeta>
                </WidgetCard>
              ))}
            </WidgetGrid>
          </MainArea>
        </StoreContent>
      </StoreContainer>
    </StoreOverlay>
  );
};