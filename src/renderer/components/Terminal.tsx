import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import styled from 'styled-components';
import 'xterm/css/xterm.css';

const TerminalContainer = styled.div`
  flex: 1;
  padding: 16px;
  background: #1e1e1e;
  position: relative;
`;

const TerminalWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #000000;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

export const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [terminalId] = useState(() => `terminal-${Date.now()}`);

  useEffect(() => {
    if (!terminalRef.current) return;

    const xterm = new XTerm({
      fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      theme: {
        background: '#000000',
        foreground: '#ffffff',
        cursor: '#ffffff',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5',
      },
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      tabStopWidth: 4,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    xterm.loadAddon(fitAddon);
    xterm.loadAddon(webLinksAddon);

    xterm.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    xterm.onData((data) => {
      if (window.terminalAPI) {
        window.terminalAPI.writeTerminal(terminalId, data);
      }
    });

    if (window.terminalAPI) {
      window.terminalAPI.createTerminal(terminalId);
      
      window.terminalAPI.onTerminalData((id, data) => {
        if (id === terminalId && xtermRef.current) {
          xtermRef.current.write(data);
        }
      });

      window.terminalAPI.onTerminalExit((id) => {
        if (id === terminalId && xtermRef.current) {
          xtermRef.current.write('\r\n\r\n[Terminal session ended]\r\n');
        }
      });
    }

    const handleResize = () => {
      if (fitAddonRef.current && xtermRef.current) {
        fitAddonRef.current.fit();
        const { cols, rows } = xtermRef.current;
        if (window.terminalAPI) {
          window.terminalAPI.resizeTerminal(terminalId, cols, rows);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.terminalAPI) {
        window.terminalAPI.closeTerminal(terminalId);
      }
      if (xtermRef.current) {
        xtermRef.current.dispose();
      }
    };
  }, [terminalId]);


  return (
    <TerminalContainer>
      <TerminalWrapper>
        <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />
      </TerminalWrapper>
    </TerminalContainer>
  );
};