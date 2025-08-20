import React, { useState } from 'react';
import styled from 'styled-components';
import { WidgetProps } from '../../../shared/types';

const WidgetCard = styled.div`
  background: #2d2d2d;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #3e3e3e;
`;

const WidgetTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #cccccc;
  margin-bottom: 12px;
`;

const ShortcutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
`;

const ShortcutButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${props => {
    switch (props.variant) {
      case 'primary': return '#007acc';
      case 'danger': return '#cd3131';
      case 'secondary': 
      default: return '#404040';
    }
  }};
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'primary': return '#0099ff';
      case 'danger': return '#ff4444';
      case 'secondary':
      default: return '#555';
    }
  }};
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s ease;
  width: 100%;

  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'primary': return '#0088cc';
        case 'danger': return '#aa2828';
        case 'secondary':
        default: return '#505050';
      }
    }};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ShortcutIcon = styled.span`
  font-size: 14px;
  width: 16px;
  text-align: center;
`;

const ShortcutText = styled.span`
  flex: 1;
`;

const ShortcutKey = styled.span`
  background: #333;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-family: 'Monaco', 'Menlo', monospace;
  color: #999;
`;

const CategorySection = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryTitle = styled.h4`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #666;
  margin: 0 0 8px 0;
  font-weight: 600;
`;

interface CommandShortcut {
  id: string;
  name: string;
  icon: string;
  command: string;
  keybinding?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  category: string;
}

const shortcuts: CommandShortcut[] = [
  // Git Commands
  { id: 'git-status', name: 'Git Status', icon: '📊', command: 'git status', keybinding: 'Cmd+G S', category: 'Git' },
  { id: 'git-add', name: 'Stage All', icon: '➕', command: 'git add .', category: 'Git' },
  { id: 'git-commit', name: 'Commit', icon: '💾', command: 'git commit -m "', category: 'Git' },
  { id: 'git-push', name: 'Push', icon: '⬆️', command: 'git push', variant: 'primary', category: 'Git' },
  { id: 'git-pull', name: 'Pull', icon: '⬇️', command: 'git pull', variant: 'primary', category: 'Git' },

  // System Commands
  { id: 'ls-la', name: 'List All', icon: '📂', command: 'ls -la', keybinding: 'Cmd+L', category: 'System' },
  { id: 'pwd', name: 'Current Path', icon: '📍', command: 'pwd', category: 'System' },
  { id: 'clear', name: 'Clear', icon: '🗑️', command: 'clear', keybinding: 'Cmd+K', category: 'System' },
  { id: 'history', name: 'History', icon: '📜', command: 'history', category: 'System' },

  // Development
  { id: 'npm-install', name: 'NPM Install', icon: '📦', command: 'npm install', category: 'Development' },
  { id: 'npm-start', name: 'NPM Start', icon: '▶️', command: 'npm start', variant: 'primary', category: 'Development' },
  { id: 'npm-test', name: 'NPM Test', icon: '🧪', command: 'npm test', category: 'Development' },
  { id: 'npm-build', name: 'NPM Build', icon: '🔨', command: 'npm run build', category: 'Development' },

  // Dangerous Commands
  { id: 'kill-process', name: 'Kill Process', icon: '☠️', command: 'kill -9 ', variant: 'danger', category: 'System' },
  { id: 'rm-rf', name: 'Force Remove', icon: '💥', command: 'rm -rf ', variant: 'danger', category: 'System' },
];

export const CommandShortcutsWidget: React.FC<WidgetProps> = ({ config }) => {
  const [isRunning, setIsRunning] = useState<string | null>(null);

  const executeCommand = async (shortcut: CommandShortcut) => {
    setIsRunning(shortcut.id);
    
    try {
      // TODO: Integrate with terminal to execute command
      if (window.terminalAPI) {
        const activeTerminal = 'current'; // TODO: Get actual active terminal ID
        await window.terminalAPI.writeTerminal(activeTerminal, shortcut.command + '\n');
      } else {
        console.log(`Executing: ${shortcut.command}`);
      }
    } catch (error) {
      console.error('Failed to execute command:', error);
    } finally {
      setTimeout(() => setIsRunning(null), 500);
    }
  };

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((groups, shortcut) => {
    if (!groups[shortcut.category]) {
      groups[shortcut.category] = [];
    }
    groups[shortcut.category].push(shortcut);
    return groups;
  }, {} as Record<string, CommandShortcut[]>);

  return (
    <WidgetCard>
      <WidgetTitle>Quick Commands</WidgetTitle>
      
      {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
        <CategorySection key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          <ShortcutGrid>
            {categoryShortcuts.map(shortcut => (
              <ShortcutButton
                key={shortcut.id}
                variant={shortcut.variant}
                onClick={() => executeCommand(shortcut)}
                disabled={isRunning === shortcut.id}
                title={`Execute: ${shortcut.command}`}
              >
                <ShortcutIcon>
                  {isRunning === shortcut.id ? '⏳' : shortcut.icon}
                </ShortcutIcon>
                <ShortcutText>{shortcut.name}</ShortcutText>
                {shortcut.keybinding && (
                  <ShortcutKey>{shortcut.keybinding}</ShortcutKey>
                )}
              </ShortcutButton>
            ))}
          </ShortcutGrid>
        </CategorySection>
      ))}
    </WidgetCard>
  );
};