import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          background: '#1e1e1e', 
          color: 'white', 
          fontFamily: 'Monaco, monospace',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1>Something went wrong</h1>
          <p>Error: {this.state.error?.message}</p>
          <p>Check the console for more details</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Direct import instead of lazy loading
import { App } from './App-working';

const LoadingFallback = () => (
  <div style={{ 
    padding: '20px', 
    background: '#1e1e1e', 
    color: 'white', 
    fontFamily: 'Monaco, monospace',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <h1>Widget Terminal</h1>
    <p>Loading application...</p>
  </div>
);

try {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} catch (error) {
  console.error('Failed to initialize React app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; background: #1e1e1e; color: white; font-family: Monaco, monospace;">
      <h1>Failed to initialize</h1>
      <p>Error: ${error}</p>
    </div>
  `;
}