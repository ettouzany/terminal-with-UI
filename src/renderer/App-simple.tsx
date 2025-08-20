import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #1e1e1e;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Monaco', 'Menlo', monospace;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1rem;
  opacity: 0.8;
`;

export const App: React.FC = () => {
  return (
    <Container>
      <Title>Widget Terminal</Title>
      <Message>Application is loading...</Message>
      <Message>Check console for any errors</Message>
    </Container>
  );
};