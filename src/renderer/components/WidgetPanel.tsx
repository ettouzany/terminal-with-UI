import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WidgetManager } from '../services/WidgetManager';
import { WidgetRegistry } from '../services/WidgetRegistry';
import { WidgetInstance, Widget } from '../../shared/types';

const PanelContainer = styled.div`
  height: 100%;
  padding: 16px;
  background: #252526;
  overflow-y: auto;
`;

const PanelHeader = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #cccccc;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #3e3e3e;
`;

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const WidgetInstanceContainer = styled.div`
  position: relative;
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const WidgetTitle = styled.h4`
  font-size: 12px;
  color: #999;
  margin: 0;
  flex: 1;
`;

const WidgetActions = styled.div`
  display: flex;
  gap: 4px;
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
    color: #999;
    background: #404040;
  }
`;

export const WidgetPanel: React.FC = () => {
  const [instances, setInstances] = useState<WidgetInstance[]>([]);
  const widgetManager = WidgetManager.getInstance();
  const widgetRegistry = WidgetRegistry.getInstance();

  useEffect(() => {
    const loadInstances = () => {
      setInstances(widgetManager.getVisibleInstances());
    };

    loadInstances();
    const interval = setInterval(loadInstances, 1000);

    return () => clearInterval(interval);
  }, [widgetManager]);

  const handleRemoveWidget = (instanceId: string) => {
    widgetManager.removeInstance(instanceId);
    setInstances(widgetManager.getVisibleInstances());
  };

  const handleToggleVisibility = (instanceId: string) => {
    widgetManager.toggleInstanceVisibility(instanceId);
    setInstances(widgetManager.getVisibleInstances());
  };

  return (
    <PanelContainer>
      <PanelHeader>Widgets</PanelHeader>
      <WidgetContainer>
        {instances.map((instance) => {
          const widget = widgetManager.getWidgetForInstance(instance);
          if (!widget) return null;

          const WidgetComponent = widget.component;

          return (
            <WidgetInstanceContainer key={instance.id}>
              <WidgetHeader>
                <WidgetTitle>{widget.icon} {widget.name}</WidgetTitle>
                <WidgetActions>
                  <ActionButton
                    onClick={() => handleToggleVisibility(instance.id)}
                    title="Hide widget"
                  >
                    👁️
                  </ActionButton>
                  <ActionButton
                    onClick={() => handleRemoveWidget(instance.id)}
                    title="Remove widget"
                  >
                    ✕
                  </ActionButton>
                </WidgetActions>
              </WidgetHeader>
              <WidgetComponent
                config={instance.config}
                onConfigChange={(config: Record<string, any>) => {
                  widgetManager.updateInstanceConfig(instance.id, config);
                }}
              />
            </WidgetInstanceContainer>
          );
        })}
      </WidgetContainer>
    </PanelContainer>
  );
};