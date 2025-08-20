# Widget Terminal

A modern, customizable terminal application built with Electron, React, and TypeScript. Features a full terminal emulator with an extensible widget system for enhanced productivity.

![Widget Terminal Screenshot](https://via.placeholder.com/800x500/1e1e1e/ffffff?text=Widget+Terminal)

## ✨ Features

- **Full Terminal Emulator** - Complete shell integration with xterm.js
- **Customizable Widgets** - Extensible widget system with real-time updates
- **Modern UI** - Clean, dark theme with responsive design
- **Cross-Platform** - Runs on macOS, Windows, and Linux
- **TypeScript** - Full type safety and excellent developer experience
- **Hot Reload** - Fast development with webpack dev server

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd widget-terminal

# Install dependencies
npm install

# Rebuild native modules for Electron
npx electron-rebuild

# Start the application
npm start
```

### Development

```bash
# Start development mode with hot reload
npm run dev

# Build for production
npm run build

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

## 🧩 Built-in Widgets

### Clock Widget
- Real-time clock with date display
- 24-hour format
- Clean, monospace styling

### System Monitor Widget
- Live CPU usage with color-coded indicators
- Memory usage tracking
- System uptime display
- Auto-refreshing metrics

## 🔧 Architecture

### Project Structure

```
src/
├── main/                   # Electron main process
│   ├── main.ts            # Main application entry
│   ├── preload.ts         # Preload script for secure IPC
│   └── tsconfig.json      # TypeScript config for main
├── renderer/              # React UI components
│   ├── components/        # React components
│   │   ├── widgets/       # Widget implementations
│   │   ├── Terminal.tsx   # Terminal emulator
│   │   ├── TitleBar.tsx   # Custom title bar
│   │   └── WidgetPanel.tsx # Widget sidebar
│   ├── services/          # Business logic
│   │   ├── WidgetManager.ts   # Widget lifecycle management
│   │   └── WidgetRegistry.ts  # Widget registration system
│   ├── styles/            # Global styles
│   └── types/             # Type definitions
└── shared/                # Shared types and utilities
    └── types.ts           # Common type definitions
```

### Key Technologies

- **Electron 25+** - Desktop app framework
- **React 18** - UI library with hooks
- **TypeScript 5** - Type safety and tooling
- **Styled Components** - CSS-in-JS styling
- **xterm.js** - Terminal emulator
- **node-pty** - Shell process management
- **Webpack 5** - Module bundling

## 🎨 Creating Custom Widgets

### 1. Define Your Widget Component

```typescript
import React from 'react';
import { WidgetProps } from '../../shared/types';

export const MyCustomWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
  return (
    <div>
      <h3>My Custom Widget</h3>
      <p>Widget content goes here</p>
    </div>
  );
};
```

### 2. Register Your Widget

```typescript
import { WidgetRegistry } from '../services/WidgetRegistry';
import { MyCustomWidget } from '../components/widgets/MyCustomWidget';

const registry = WidgetRegistry.getInstance();

registry.register({
  id: 'my-custom-widget',
  name: 'My Custom Widget',
  component: MyCustomWidget,
  icon: '🎯',
  description: 'A custom widget for specific functionality',
  category: 'custom',
  configurable: true,
  defaultConfig: {
    setting1: 'default value',
    setting2: 42
  }
});
```

### 3. Widget Interface

```typescript
interface Widget {
  id: string;                                    // Unique identifier
  name: string;                                  // Display name
  component: React.ComponentType<WidgetProps>;  // React component
  icon?: string;                                 // Display icon (emoji/unicode)
  description?: string;                          // Widget description
  category: WidgetCategory;                      // Widget category
  configurable?: boolean;                        // Can be configured
  defaultConfig?: Record<string, any>;          // Default configuration
}
```

## 🛠️ Configuration

### Terminal Settings

The terminal can be customized through the `AppConfig` interface:

```typescript
terminal: {
  fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
  fontSize: 14,
  lineHeight: 1.2,
  cursorBlink: true,
  scrollback: 1000
}
```

### Widget Management

Widgets are managed through the `WidgetManager` singleton:

- **Create instances** with custom positioning and sizing
- **Update configurations** in real-time
- **Toggle visibility** on demand
- **Persist state** to localStorage

## 📦 Building for Distribution

```bash
# Build production version
npm run build

# The built files will be in:
# - build/main.js (Electron main process)
# - build/renderer/ (React app)
```

For creating distributable packages, consider adding:
- [electron-builder](https://www.electron.build/) for packaging
- Code signing for security
- Auto-updater integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-widget`)
3. Commit your changes (`git commit -m 'Add amazing widget'`)
4. Push to the branch (`git push origin feature/amazing-widget`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new widgets
- Update documentation for new features
- Maintain consistent code style

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Native module compilation errors:**
```bash
npm rebuild
# or
npx electron-rebuild
```

**Widget not appearing:**
- Check widget registration in `WidgetRegistry`
- Verify widget component exports
- Check browser console for errors

**Terminal not working:**
- Ensure `node-pty` is properly compiled
- Check shell permissions
- Verify preload script is loaded

## 🚧 Roadmap

- [ ] Theme system with multiple color schemes
- [ ] Plugin marketplace for community widgets
- [ ] Multi-tab terminal support
- [ ] SSH connection management
- [ ] Workspace persistence
- [ ] Performance monitoring tools
- [ ] Git integration widgets
- [ ] Docker container management

## 💡 Widget Ideas

- **File Explorer** - Navigate filesystem
- **Git Status** - Repository information
- **Docker Monitor** - Container status
- **Weather** - Current weather conditions
- **Calendar** - Upcoming events
- **Notes** - Quick note-taking
- **Process Monitor** - Running processes
- **Network Monitor** - Connection status

---

Built with ❤️ using Electron, React, and TypeScript