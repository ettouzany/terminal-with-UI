import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Command } from '../../shared/types';
import { CommandRegistry } from '../services/CommandRegistry';

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
`;

const PaletteContainer = styled.div`
  background: #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid #404040;
  width: 600px;
  max-width: 90vw;
  max-height: 70vh;
  overflow: hidden;
  animation: slideIn 0.2s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 20px 24px;
  background: transparent;
  border: none;
  font-size: 18px;
  color: #ffffff;
  border-bottom: 1px solid #404040;
  outline: none;

  &::placeholder {
    color: #666;
  }
`;

const ResultsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const ResultItem = styled.div<{ isSelected: boolean }>`
  padding: 12px 24px;
  cursor: pointer;
  background: ${props => props.isSelected ? '#404040' : 'transparent'};
  border-left: 3px solid ${props => props.isSelected ? '#007acc' : 'transparent'};
  transition: all 0.15s ease;

  &:hover {
    background: #404040;
  }
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
`;

const ResultIcon = styled.span`
  font-size: 16px;
  width: 20px;
  text-align: center;
`;

const ResultName = styled.span`
  color: #ffffff;
  font-weight: 500;
  font-size: 14px;
  flex: 1;
`;

const ResultKeybinding = styled.span`
  color: #666;
  font-size: 12px;
  background: #333;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
`;

const ResultDescription = styled.div`
  color: #999;
  font-size: 12px;
  margin-left: 32px;
`;

const CategoryHeader = styled.div`
  padding: 8px 24px;
  background: #333;
  color: #999;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const NoResults = styled.div`
  padding: 40px 24px;
  text-align: center;
  color: #666;
  font-size: 14px;
`;

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Command[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandRegistry = CommandRegistry.getInstance();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setResults(commandRegistry.getAllCommands().slice(0, 8));
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, commandRegistry]);

  useEffect(() => {
    const searchResults = commandRegistry.searchCommands(query);
    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, commandRegistry]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          executeCommand(results[selectedIndex]);
        }
        break;
    }
  }, [isOpen, results, selectedIndex, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const executeCommand = (command: Command) => {
    commandRegistry.executeCommand(command.id);
    onClose();
  };

  const groupedResults = results.reduce((groups, command) => {
    const category = command.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(command);
    return groups;
  }, {} as Record<string, Command[]>);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <PaletteContainer>
        <SearchInput
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command or search..."
        />
        
        <ResultsList>
          {results.length === 0 ? (
            <NoResults>
              {query ? 'No commands found' : 'Start typing to search commands...'}
            </NoResults>
          ) : (
            Object.entries(groupedResults).map(([category, commands]) => (
              <div key={category}>
                <CategoryHeader>{category}</CategoryHeader>
                {commands.map((command, index) => {
                  const globalIndex = results.indexOf(command);
                  return (
                    <ResultItem
                      key={command.id}
                      isSelected={globalIndex === selectedIndex}
                      onClick={() => executeCommand(command)}
                    >
                      <ResultHeader>
                        <ResultIcon>{command.icon || '⚡'}</ResultIcon>
                        <ResultName>{command.name}</ResultName>
                        {command.keybinding && (
                          <ResultKeybinding>{command.keybinding}</ResultKeybinding>
                        )}
                      </ResultHeader>
                      <ResultDescription>{command.description}</ResultDescription>
                    </ResultItem>
                  );
                })}
              </div>
            ))
          )}
        </ResultsList>
      </PaletteContainer>
    </Overlay>
  );
};