import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const slide = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const ProgressContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 900;
  pointer-events: none;
`;

const LinearProgress = styled.div`
  height: 2px;
  background: #333;
  overflow: hidden;
  position: relative;
`;

const LinearBar = styled.div<{ progress: number; indeterminate?: boolean }>`
  height: 100%;
  background: linear-gradient(90deg, #007acc, #0099ff);
  transition: width 0.3s ease;
  width: ${props => props.indeterminate ? '30%' : `${props.progress}%`};
  animation: ${props => props.indeterminate ? slide : 'none'} 2s infinite;
`;

const NotificationArea = styled.div`
  position: fixed;
  top: 60px;
  right: 20px;
  z-index: 950;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
`;

const ProgressNotification = styled.div<{ type: 'info' | 'success' | 'warning' | 'error' }>`
  background: #2d2d2d;
  border: 1px solid #404040;
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success': return '#0dbc79';
      case 'warning': return '#e5e510';
      case 'error': return '#cd3131';
      default: return '#007acc';
    }
  }};
  border-radius: 6px;
  padding: 12px 16px;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  pointer-events: all;
  animation: slideInRight 0.3s ease-out;

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const NotificationIcon = styled.span`
  font-size: 16px;
`;

const NotificationTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #cccccc;
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  font-size: 12px;

  &:hover {
    color: #999;
    background: #404040;
  }
`;

const NotificationContent = styled.div`
  color: #999;
  font-size: 12px;
  line-height: 1.4;
`;

const InlineSpinner = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #007acc;
  font-size: 12px;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #333;
  border-top: 2px solid #007acc;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Dots = styled.div`
  display: inline-flex;
  gap: 2px;
`;

const Dot = styled.div<{ delay: number }>`
  width: 4px;
  height: 4px;
  background: #007acc;
  border-radius: 50%;
  animation: ${pulse} 1.4s infinite;
  animation-delay: ${props => props.delay}s;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #404040;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #007acc, #0099ff);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
  border-radius: 3px;
`;

export interface ProgressTask {
  id: string;
  title: string;
  description?: string;
  progress?: number;
  type: 'info' | 'success' | 'warning' | 'error';
  indeterminate?: boolean;
  persistent?: boolean;
}

interface ProgressIndicatorsProps {
  globalProgress?: number;
  globalIndeterminate?: boolean;
  tasks?: ProgressTask[];
  onTaskClose?: (taskId: string) => void;
}

export const ProgressIndicators: React.FC<ProgressIndicatorsProps> = ({
  globalProgress,
  globalIndeterminate = false,
  tasks = [],
  onTaskClose
}) => {
  const [visibleTasks, setVisibleTasks] = useState<ProgressTask[]>([]);

  useEffect(() => {
    setVisibleTasks(tasks);
    
    // Auto-remove completed non-persistent tasks
    const timer = setTimeout(() => {
      setVisibleTasks(prev => 
        prev.filter(task => 
          task.persistent || 
          task.type === 'error' || 
          (task.progress !== undefined && task.progress < 100)
        )
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [tasks]);

  const handleTaskClose = (taskId: string) => {
    setVisibleTasks(prev => prev.filter(task => task.id !== taskId));
    onTaskClose?.(taskId);
  };

  const getTaskIcon = (type: string, progress?: number) => {
    if (progress === 100) return '✅';
    
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '🔄';
    }
  };

  return (
    <>
      {/* Global Progress Bar */}
      {(globalProgress !== undefined || globalIndeterminate) && (
        <ProgressContainer>
          <LinearProgress>
            <LinearBar 
              progress={globalProgress || 0} 
              indeterminate={globalIndeterminate}
            />
          </LinearProgress>
        </ProgressContainer>
      )}

      {/* Task Notifications */}
      <NotificationArea>
        {visibleTasks.map(task => (
          <ProgressNotification key={task.id} type={task.type}>
            <NotificationHeader>
              <NotificationIcon>
                {task.indeterminate ? (
                  <InlineSpinner>
                    <Spinner />
                  </InlineSpinner>
                ) : (
                  getTaskIcon(task.type, task.progress)
                )}
              </NotificationIcon>
              <NotificationTitle>{task.title}</NotificationTitle>
              <CloseButton onClick={() => handleTaskClose(task.id)}>
                ✕
              </CloseButton>
            </NotificationHeader>
            
            {task.description && (
              <NotificationContent>{task.description}</NotificationContent>
            )}
            
            {task.progress !== undefined && !task.indeterminate && (
              <ProgressBar>
                <ProgressFill progress={task.progress} />
              </ProgressBar>
            )}
            
            {task.indeterminate && (
              <InlineSpinner>
                <Dots>
                  <Dot delay={0} />
                  <Dot delay={0.2} />
                  <Dot delay={0.4} />
                </Dots>
                <span>Processing...</span>
              </InlineSpinner>
            )}
          </ProgressNotification>
        ))}
      </NotificationArea>
    </>
  );
};

// Hook for managing progress tasks
export const useProgressManager = () => {
  const [tasks, setTasks] = useState<ProgressTask[]>([]);

  const addTask = (task: Omit<ProgressTask, 'id'>) => {
    const newTask: ProgressTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setTasks(prev => [...prev, newTask]);
    return newTask.id;
  };

  const updateTask = (id: string, updates: Partial<ProgressTask>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const completeTask = (id: string, type: 'success' | 'error' = 'success') => {
    updateTask(id, { progress: 100, type, indeterminate: false });
  };

  return {
    tasks,
    addTask,
    updateTask,
    removeTask,
    completeTask
  };
};