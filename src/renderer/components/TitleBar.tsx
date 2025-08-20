import React from 'react';
import styled from 'styled-components';

const TitleBarContainer = styled.div`
  height: 32px;
  background: #2d2d2d;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #3e3e3e;
  -webkit-app-region: drag;
  user-select: none;
`;

const Title = styled.h1`
  font-size: 14px;
  font-weight: 500;
  color: #cccccc;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
  -webkit-app-region: no-drag;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  transition: background-color 0.2s;

  &:hover {
    background: #404040;
  }
`;

interface TitleBarProps {
  onToggleWidgets: () => void;
  onOpenStore?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({ onToggleWidgets, onOpenStore }) => {
  return (
    <TitleBarContainer>
      <Title>Widget Terminal</Title>
      <Controls>
        {onOpenStore && (
          <ControlButton onClick={onOpenStore}>
            🏪 Store
          </ControlButton>
        )}
        <ControlButton onClick={onToggleWidgets}>
          Widgets
        </ControlButton>
      </Controls>
    </TitleBarContainer>
  );
};