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

const TimeDisplay = styled.div`
  font-size: 24px;
  font-weight: 300;
  color: #ffffff;
  font-family: 'Monaco', 'Menlo', monospace;
  text-align: center;
`;

const DateDisplay = styled.div`
  font-size: 14px;
  color: #999;
  text-align: center;
  margin-top: 8px;
`;

export const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <WidgetCard>
      <WidgetTitle>Clock</WidgetTitle>
      <TimeDisplay>{timeString}</TimeDisplay>
      <DateDisplay>{dateString}</DateDisplay>
    </WidgetCard>
  );
};