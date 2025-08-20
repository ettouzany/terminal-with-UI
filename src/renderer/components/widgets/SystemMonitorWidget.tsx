import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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

const MetricContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Metric = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetricLabel = styled.span`
  font-size: 12px;
  color: #999;
`;

const MetricValue = styled.span`
  font-size: 12px;
  color: #ffffff;
  font-family: 'Monaco', 'Menlo', monospace;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #404040;
  border-radius: 2px;
  margin-top: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percent: number; color: string }>`
  width: ${props => props.percent}%;
  height: 100%;
  background: ${props => props.color};
  transition: width 0.3s ease;
`;

interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  uptime: string;
}

export const SystemMonitorWidget: React.FC = () => {
  const [stats, setStats] = useState<SystemStats>({
    cpuUsage: 0,
    memoryUsage: 0,
    uptime: '0s',
  });

  useEffect(() => {
    const updateStats = () => {
      const cpuUsage = Math.random() * 100;
      const memoryUsage = 30 + Math.random() * 40;
      const uptimeSeconds = Math.floor(Date.now() / 1000) % 86400;
      const hours = Math.floor(uptimeSeconds / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);
      const uptime = `${hours}h ${minutes}m`;

      setStats({
        cpuUsage: Math.round(cpuUsage),
        memoryUsage: Math.round(memoryUsage),
        uptime,
      });
    };

    updateStats();
    const timer = setInterval(updateStats, 2000);

    return () => clearInterval(timer);
  }, []);

  const getCpuColor = (usage: number) => {
    if (usage < 50) return '#0dbc79';
    if (usage < 80) return '#e5e510';
    return '#cd3131';
  };

  const getMemoryColor = (usage: number) => {
    if (usage < 60) return '#2472c8';
    if (usage < 85) return '#e5e510';
    return '#cd3131';
  };

  return (
    <WidgetCard>
      <WidgetTitle>System Monitor</WidgetTitle>
      <MetricContainer>
        <div>
          <Metric>
            <MetricLabel>CPU Usage</MetricLabel>
            <MetricValue>{stats.cpuUsage}%</MetricValue>
          </Metric>
          <ProgressBar>
            <ProgressFill 
              percent={stats.cpuUsage} 
              color={getCpuColor(stats.cpuUsage)}
            />
          </ProgressBar>
        </div>
        
        <div>
          <Metric>
            <MetricLabel>Memory Usage</MetricLabel>
            <MetricValue>{stats.memoryUsage}%</MetricValue>
          </Metric>
          <ProgressBar>
            <ProgressFill 
              percent={stats.memoryUsage} 
              color={getMemoryColor(stats.memoryUsage)}
            />
          </ProgressBar>
        </div>
        
        <Metric>
          <MetricLabel>Uptime</MetricLabel>
          <MetricValue>{stats.uptime}</MetricValue>
        </Metric>
      </MetricContainer>
    </WidgetCard>
  );
};