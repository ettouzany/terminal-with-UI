import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StatusBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
  background: #2d2d2d;
  border-top: 1px solid #3e3e3e;
  padding: 0 12px;
  font-size: 11px;
  color: #cccccc;
  font-family: 'Monaco', 'Menlo', monospace;
  user-select: none;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatusItem = styled.div<{ clickable?: boolean; color?: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.color || '#cccccc'};
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  padding: 2px 4px;
  border-radius: 3px;
  transition: background-color 0.15s ease;

  &:hover {
    background: ${props => props.clickable ? '#404040' : 'transparent'};
  }
`;

const StatusIcon = styled.span`
  font-size: 10px;
  width: 12px;
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 40px;
  height: 6px;
  background: #404040;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percent: number; color: string }>`
  width: ${props => props.percent}%;
  height: 100%;
  background: ${props => props.color};
  transition: width 0.3s ease;
`;

const BranchIcon = styled.span`
  font-size: 10px;
`;

interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  platform: string;
}

interface GitInfo {
  branch: string;
  status: 'clean' | 'dirty' | 'unknown';
  ahead: number;
  behind: number;
}

export const StatusBar: React.FC = () => {
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    disk: 0,
    uptime: '0s',
    platform: 'unknown'
  });

  const [gitInfo, setGitInfo] = useState<GitInfo>({
    branch: 'main',
    status: 'clean',
    ahead: 0,
    behind: 0
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPath, setCurrentPath] = useState('/Users');

  useEffect(() => {
    const updateSystemStats = () => {
      setSystemStats({
        cpu: 15 + Math.random() * 30,
        memory: 45 + Math.random() * 25,
        disk: 65,
        uptime: '2h 34m',
        platform: 'darwin' // Fixed for now, can be made dynamic later
      });
    };

    const updateGitInfo = () => {
      setGitInfo({
        branch: 'feature/terminal-improvements',
        status: Math.random() > 0.7 ? 'dirty' : 'clean',
        ahead: Math.floor(Math.random() * 3),
        behind: Math.floor(Math.random() * 2)
      });
    };

    const updateTime = () => {
      setCurrentTime(new Date());
    };

    const updateCurrentPath = async () => {
      try {
        if (window.terminalAPI) {
          const result = await window.terminalAPI.getCwd();
          if (result.success && result.cwd) {
            setCurrentPath(result.cwd);
          }
        }
      } catch (error) {
        console.warn('Failed to get current working directory for status bar');
      }
    };

    updateSystemStats();
    updateGitInfo();
    updateCurrentPath();

    const statsInterval = setInterval(updateSystemStats, 5000);
    const timeInterval = setInterval(updateTime, 1000);
    const pathInterval = setInterval(updateCurrentPath, 10000); // Update path every 10 seconds

    return () => {
      clearInterval(statsInterval);
      clearInterval(timeInterval);
      clearInterval(pathInterval);
    };
  }, []);

  const getCpuColor = (usage: number) => {
    if (usage < 30) return '#0dbc79';
    if (usage < 70) return '#e5e510';
    return '#cd3131';
  };

  const getMemoryColor = (usage: number) => {
    if (usage < 60) return '#2472c8';
    if (usage < 85) return '#e5e510';
    return '#cd3131';
  };

  const getGitStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return '#0dbc79';
      case 'dirty': return '#e5e510';
      default: return '#666';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleGitClick = () => {
    // TODO: Show git status popup or run git status command
    console.log('Git status clicked');
  };

  const handlePathClick = () => {
    // TODO: Show path history or file explorer
    console.log('Path clicked');
  };

  return (
    <StatusBarContainer>
      <LeftSection>
        <StatusItem clickable onClick={handlePathClick}>
          <StatusIcon>📁</StatusIcon>
          <span>{currentPath}</span>
        </StatusItem>

        <StatusItem clickable onClick={handleGitClick}>
          <BranchIcon>⎇</BranchIcon>
          <span style={{ color: getGitStatusColor(gitInfo.status) }}>
            {gitInfo.branch}
          </span>
          {gitInfo.status === 'dirty' && <span style={{ color: '#e5e510' }}>●</span>}
          {gitInfo.ahead > 0 && <span style={{ color: '#0dbc79' }}>↑{gitInfo.ahead}</span>}
          {gitInfo.behind > 0 && <span style={{ color: '#cd3131' }}>↓{gitInfo.behind}</span>}
        </StatusItem>
      </LeftSection>

      <RightSection>
        <StatusItem>
          <StatusIcon>⚡</StatusIcon>
          <span>CPU</span>
          <ProgressBar>
            <ProgressFill 
              percent={systemStats.cpu} 
              color={getCpuColor(systemStats.cpu)}
            />
          </ProgressBar>
          <span>{Math.round(systemStats.cpu)}%</span>
        </StatusItem>

        <StatusItem>
          <StatusIcon>💾</StatusIcon>
          <span>RAM</span>
          <ProgressBar>
            <ProgressFill 
              percent={systemStats.memory} 
              color={getMemoryColor(systemStats.memory)}
            />
          </ProgressBar>
          <span>{Math.round(systemStats.memory)}%</span>
        </StatusItem>

        <StatusItem>
          <StatusIcon>⏱️</StatusIcon>
          <span>{systemStats.uptime}</span>
        </StatusItem>

        <StatusItem>
          <StatusIcon>🕒</StatusIcon>
          <span>{formatTime(currentTime)}</span>
        </StatusItem>
      </RightSection>
    </StatusBarContainer>
  );
};