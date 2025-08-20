import { Command } from '../../shared/types';

export class CommandRegistry {
  private static instance: CommandRegistry;
  private commands: Map<string, Command> = new Map();

  private constructor() {
    this.registerBuiltInCommands();
  }

  public static getInstance(): CommandRegistry {
    if (!CommandRegistry.instance) {
      CommandRegistry.instance = new CommandRegistry();
    }
    return CommandRegistry.instance;
  }

  private registerBuiltInCommands(): void {
    this.register({
      id: 'terminal.new',
      name: 'New Terminal',
      description: 'Create a new terminal tab',
      category: 'Terminal',
      icon: '➕',
      keybinding: 'Cmd+T',
      action: () => {
        // TODO: Implement new terminal creation
        console.log('Creating new terminal...');
      }
    });

    this.register({
      id: 'terminal.split-horizontal',
      name: 'Split Terminal Horizontally',
      description: 'Split the current terminal horizontally',
      category: 'Terminal',
      icon: '⬌',
      keybinding: 'Cmd+Shift+\\',
      action: () => {
        console.log('Splitting terminal horizontally...');
      }
    });

    this.register({
      id: 'terminal.split-vertical',
      name: 'Split Terminal Vertically',
      description: 'Split the current terminal vertically',
      category: 'Terminal',
      icon: '⬍',
      keybinding: 'Cmd+\\',
      action: () => {
        console.log('Splitting terminal vertically...');
      }
    });

    this.register({
      id: 'widget.toggle-panel',
      name: 'Toggle Widget Panel',
      description: 'Show or hide the widget panel',
      category: 'Widgets',
      icon: '🎛️',
      keybinding: 'Cmd+B',
      action: () => {
        console.log('Toggling widget panel...');
      }
    });

    this.register({
      id: 'theme.toggle',
      name: 'Toggle Theme',
      description: 'Switch between light and dark theme',
      category: 'Appearance',
      icon: '🌓',
      keybinding: 'Cmd+Shift+T',
      action: () => {
        console.log('Toggling theme...');
      }
    });

    this.register({
      id: 'file.open',
      name: 'Open File',
      description: 'Open a file for preview',
      category: 'File',
      icon: '📁',
      keybinding: 'Cmd+O',
      action: () => {
        console.log('Opening file...');
      }
    });

    this.register({
      id: 'terminal.clear',
      name: 'Clear Terminal',
      description: 'Clear the current terminal output',
      category: 'Terminal',
      icon: '🗑️',
      keybinding: 'Cmd+K',
      action: () => {
        console.log('Clearing terminal...');
      }
    });

    this.register({
      id: 'shortcuts.show',
      name: 'Show Keyboard Shortcuts',
      description: 'Display all available keyboard shortcuts',
      category: 'Help',
      icon: '⌨️',
      keybinding: 'Cmd+?',
      action: () => {
        console.log('Showing shortcuts...');
      }
    });
  }

  public register(command: Command): void {
    this.commands.set(command.id, command);
  }

  public unregister(commandId: string): boolean {
    return this.commands.delete(commandId);
  }

  public getCommand(commandId: string): Command | undefined {
    return this.commands.get(commandId);
  }

  public getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  public getCommandsByCategory(category: string): Command[] {
    return this.getAllCommands().filter(cmd => cmd.category === category);
  }

  public searchCommands(query: string): Command[] {
    if (!query.trim()) {
      return this.getAllCommands();
    }

    const lowercaseQuery = query.toLowerCase();
    const commands = this.getAllCommands();

    return commands
      .map(command => ({
        command,
        score: this.calculateFuzzyScore(command, lowercaseQuery)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.command)
      .slice(0, 10);
  }

  private calculateFuzzyScore(command: Command, query: string): number {
    const searchText = `${command.name} ${command.description} ${command.category}`.toLowerCase();
    
    if (searchText.includes(query)) {
      const nameScore = command.name.toLowerCase().includes(query) ? 100 : 0;
      const exactMatch = command.name.toLowerCase() === query ? 200 : 0;
      const startsWith = command.name.toLowerCase().startsWith(query) ? 150 : 0;
      
      return exactMatch || startsWith || nameScore || 50;
    }

    let score = 0;
    let queryIndex = 0;
    
    for (let i = 0; i < searchText.length && queryIndex < query.length; i++) {
      if (searchText[i] === query[queryIndex]) {
        score += 1;
        queryIndex++;
      }
    }
    
    return queryIndex === query.length ? score : 0;
  }

  public executeCommand(commandId: string): void {
    const command = this.getCommand(commandId);
    if (command) {
      try {
        command.action();
      } catch (error) {
        console.error(`Error executing command ${commandId}:`, error);
      }
    }
  }
}