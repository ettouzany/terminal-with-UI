import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { WidgetProps } from '../../../shared/types';

const WidgetContainer = styled.div`
  background: #2d2d2d;
  border-radius: 8px;
  padding: 16px;
  color: #ffffff;
  border: 1px solid #404040;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const WidgetTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RefreshButton = styled.button`
  background: #007acc;
  border: none;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background: #0088cc;
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

const SystemStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatCard = styled.div`
  background: #333;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #444;
`;

const StatLabel = styled.div`
  color: #999;
  font-size: 10px;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
`;

const StatBar = styled.div`
  width: 100%;
  height: 4px;
  background: #444;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
`;

const StatBarFill = styled.div<{ percentage: number; color?: string }>`
  width: ${props => props.percentage}%;
  height: 100%;
  background: ${props => props.color || '#007acc'};
  transition: width 0.3s ease;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  background: #333;
  border: 1px solid #555;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  min-width: 120px;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #007acc;
  }
`;

const SortButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? '#007acc' : '#444'};
  border: 1px solid ${props => props.active ? '#0099ff' : '#555'};
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#0088cc' : '#555'};
  }
`;

const ProcessList = styled.div`
  flex: 1;
  overflow-y: auto;
  border: 1px solid #444;
  border-radius: 4px;
  background: #333;
`;

const ProcessHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 40px;
  gap: 8px;
  padding: 8px 12px;
  background: #3a3a3a;
  font-size: 11px;
  font-weight: 600;
  color: #ccc;
  border-bottom: 1px solid #444;
  position: sticky;
  top: 0;
`;

const ProcessRow = styled.div<{ isSelected?: boolean }>`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 40px;
  gap: 8px;
  padding: 8px 12px;
  font-size: 11px;
  border-bottom: 1px solid #3a3a3a;
  background: ${props => props.isSelected ? '#444' : 'transparent'};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #444;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ProcessName = styled.div`
  color: #fff;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProcessStat = styled.div`
  color: #ccc;
  text-align: right;
`;

const KillButton = styled.button`
  background: #dc3545;
  border: none;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 10px;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
    background: #c82333;
  }
`;

const StatusMessage = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 11px;
  margin-bottom: 12px;
  background: ${props => {
    switch (props.type) {
      case 'success': return '#155724';
      case 'error': return '#721c24';
      case 'info': return '#0c5460';
      default: return '#333';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success': return '#d4edda';
      case 'error': return '#f8d7da';
      case 'info': return '#d1ecf1';
      default: return '#fff';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return '#c3e6cb';
      case 'error': return '#f5c6cb';
      case 'info': return '#bee5eb';
      default: return '#444';
    }
  }};
`;

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  user: string;
}

interface SystemInfo {
  cpuUsage: number;
  memoryUsage: number;
  totalMemory: number;
  usedMemory: number;
  processCount: number;
}

type SortField = 'name' | 'cpu' | 'memory' | 'pid';
type SortDirection = 'asc' | 'desc';

interface TaskManagerWidgetProps extends WidgetProps {
  widgetId?: string;
  onRemove?: () => void;
}

export const TaskManagerWidget: React.FC<TaskManagerWidgetProps> = ({ 
  widgetId, 
  onRemove, 
  config, 
  onConfigChange 
}) => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    cpuUsage: 0,
    memoryUsage: 0,
    totalMemory: 0,
    usedMemory: 0,
    processCount: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('cpu');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Mock data generation (in real implementation, this would call system APIs)
  const generateMockProcesses = useCallback((): Process[] => {
    const processNames = [
      'Chrome', 'VS Code', 'Terminal', 'Finder', 'Safari', 'Slack', 'Discord',
      'Node.js', 'Python', 'Electron', 'Firefox', 'Spotify', 'Docker', 
      'Activity Monitor', 'System Preferences', 'Mail', 'Calendar', 'Notes'
    ];

    return processNames.map((name, index) => ({
      pid: 1000 + index + Math.floor(Math.random() * 9000),
      name: `${name}${Math.random() > 0.7 ? ` Helper` : ''}`,
      cpu: Math.random() * 100,
      memory: Math.random() * 2048,
      user: Math.random() > 0.5 ? 'user' : 'root'
    }));
  }, []);

  const generateMockSystemInfo = useCallback((): SystemInfo => ({
    cpuUsage: Math.random() * 100,
    memoryUsage: 60 + Math.random() * 30,
    totalMemory: 16384,
    usedMemory: 9830 + Math.random() * 2000,
    processCount: processes.length
  }), [processes.length]);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newProcesses = generateMockProcesses();
      const newSystemInfo = generateMockSystemInfo();
      
      setProcesses(newProcesses);
      setSystemInfo(newSystemInfo);
      
      setStatusMessage({
        text: `Refreshed ${newProcesses.length} processes`,
        type: 'success'
      });
      
      // Clear status message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      setStatusMessage({
        text: 'Failed to refresh process data',
        type: 'error'
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [generateMockProcesses, generateMockSystemInfo]);

  // Initial load and periodic refresh
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [refreshData]);

  const filteredAndSortedProcesses = React.useMemo(() => {
    let filtered = processes.filter(process =>
      process.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [processes, searchTerm, sortField, sortDirection]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }, [sortField]);

  const handleKillProcess = useCallback(async (pid: number, name: string) => {
    try {
      setStatusMessage({
        text: `Terminating ${name} (${pid})...`,
        type: 'info'
      });

      // Simulate kill process delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove process from list
      setProcesses(prev => prev.filter(p => p.pid !== pid));
      
      setStatusMessage({
        text: `Successfully terminated ${name} (${pid})`,
        type: 'success'
      });

      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      setStatusMessage({
        text: `Failed to terminate ${name} (${pid})`,
        type: 'error'
      });
    }
  }, []);

  const getCpuColor = (usage: number) => {
    if (usage > 80) return '#dc3545';
    if (usage > 60) return '#ffc107';
    return '#28a745';
  };

  const getMemoryColor = (usage: number) => {
    if (usage > 80) return '#dc3545';
    if (usage > 60) return '#ffc107';
    return '#007acc';
  };

  return (
    <WidgetContainer>
      <WidgetHeader>
        <WidgetTitle>⚡ Task Manager</WidgetTitle>
        <RefreshButton onClick={refreshData} disabled={isRefreshing}>
          {isRefreshing ? '🔄' : '↻'} Refresh
        </RefreshButton>
      </WidgetHeader>

      <SystemStats>
        <StatCard>
          <StatLabel>CPU Usage</StatLabel>
          <StatValue>{systemInfo.cpuUsage.toFixed(1)}%</StatValue>
          <StatBar>
            <StatBarFill 
              percentage={systemInfo.cpuUsage} 
              color={getCpuColor(systemInfo.cpuUsage)}
            />
          </StatBar>
        </StatCard>
        <StatCard>
          <StatLabel>Memory</StatLabel>
          <StatValue>{(systemInfo.usedMemory / 1024).toFixed(1)} GB</StatValue>
          <StatBar>
            <StatBarFill 
              percentage={systemInfo.memoryUsage} 
              color={getMemoryColor(systemInfo.memoryUsage)}
            />
          </StatBar>
        </StatCard>
      </SystemStats>

      {statusMessage && (
        <StatusMessage type={statusMessage.type}>
          {statusMessage.text}
        </StatusMessage>
      )}

      <FilterControls>
        <SearchInput
          type="text"
          placeholder="Search processes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SortButton
          active={sortField === 'cpu'}
          onClick={() => handleSort('cpu')}
        >
          CPU {sortField === 'cpu' && (sortDirection === 'desc' ? '↓' : '↑')}
        </SortButton>
        <SortButton
          active={sortField === 'memory'}
          onClick={() => handleSort('memory')}
        >
          RAM {sortField === 'memory' && (sortDirection === 'desc' ? '↓' : '↑')}
        </SortButton>
      </FilterControls>

      <ProcessList>
        <ProcessHeader>
          <div>Process Name</div>
          <div style={{ textAlign: 'right' }}>CPU %</div>
          <div style={{ textAlign: 'right' }}>Memory MB</div>
          <div style={{ textAlign: 'right' }}>PID</div>
          <div></div>
        </ProcessHeader>
        
        {filteredAndSortedProcesses.map(process => (
          <ProcessRow
            key={process.pid}
            isSelected={selectedPid === process.pid}
            onClick={() => setSelectedPid(process.pid)}
          >
            <ProcessName title={process.name}>
              {process.name}
            </ProcessName>
            <ProcessStat style={{ color: getCpuColor(process.cpu) }}>
              {process.cpu.toFixed(1)}%
            </ProcessStat>
            <ProcessStat>
              {process.memory.toFixed(0)} MB
            </ProcessStat>
            <ProcessStat>
              {process.pid}
            </ProcessStat>
            <KillButton
              onClick={(e) => {
                e.stopPropagation();
                handleKillProcess(process.pid, process.name);
              }}
              title={`Kill ${process.name}`}
            >
              ✕
            </KillButton>
          </ProcessRow>
        ))}
        
        {filteredAndSortedProcesses.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
            {searchTerm ? 'No processes found matching your search.' : 'No processes available.'}
          </div>
        )}
      </ProcessList>
    </WidgetContainer>
  );
};