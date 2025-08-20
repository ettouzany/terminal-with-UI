import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background: #1e1e1e;
  color: white;
  text-align: center;
`;

export const TestWidget: React.FC = () => {
  return (
    <Container>
      <h3>🎨 Test Widget</h3>
      <p>This is a test widget to verify the store works.</p>
    </Container>
  );
};