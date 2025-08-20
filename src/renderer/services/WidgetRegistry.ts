import { Widget, WidgetCategory } from '../../shared/types';
import { ClockWidget } from '../components/widgets/ClockWidget';
import { SystemMonitorWidget } from '../components/widgets/SystemMonitorWidget';
import { CommandShortcutsWidget } from '../components/widgets/CommandShortcutsWidget';
import { StylesWidget } from '../components/widgets/StylesWidget';
import { TestWidget } from '../components/widgets/TestWidget';

export class WidgetRegistry {
  private static instance: WidgetRegistry;
  private widgets: Map<string, Widget> = new Map();

  private constructor() {
    this.registerBuiltInWidgets();
  }

  public static getInstance(): WidgetRegistry {
    if (!WidgetRegistry.instance) {
      WidgetRegistry.instance = new WidgetRegistry();
    }
    return WidgetRegistry.instance;
  }

  private registerBuiltInWidgets(): void {
    this.register({
      id: 'clock',
      name: 'Clock',
      component: ClockWidget,
      icon: '🕐',
      description: 'Displays current time and date',
      category: 'time',
      configurable: false,
    });

    this.register({
      id: 'system-monitor',
      name: 'System Monitor',
      component: SystemMonitorWidget,
      icon: '📊',
      description: 'Shows CPU, memory usage and system uptime',
      category: 'system',
      configurable: true,
      defaultConfig: {
        updateInterval: 2000,
        showCpu: true,
        showMemory: true,
        showUptime: true,
      },
    });

    this.register({
      id: 'command-shortcuts',
      name: 'Command Shortcuts',
      component: CommandShortcutsWidget,
      icon: '⚡',
      description: 'Quick access to commonly used terminal commands',
      category: 'productivity',
      configurable: false,
    });

    this.register({
      id: 'styles-themes',
      name: 'Styles & Themes',
      component: StylesWidget,
      icon: '🎨',
      description: 'Customize terminal and application themes with preset and custom colors',
      category: 'customization',
      configurable: false,
    });

    this.register({
      id: 'test-widget',
      name: 'Test Widget',
      component: TestWidget,
      icon: '🧪',
      description: 'Test widget to verify store functionality',
      category: 'development',
      configurable: false,
    });
  }

  public register(widget: Widget): void {
    this.widgets.set(widget.id, widget);
  }

  public unregister(widgetId: string): boolean {
    return this.widgets.delete(widgetId);
  }

  public getWidget(widgetId: string): Widget | undefined {
    return this.widgets.get(widgetId);
  }

  public getAllWidgets(): Widget[] {
    return Array.from(this.widgets.values());
  }

  public getWidgetsByCategory(category: WidgetCategory): Widget[] {
    return this.getAllWidgets().filter(widget => widget.category === category);
  }

  public searchWidgets(query: string): Widget[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllWidgets().filter(widget => 
      widget.name.toLowerCase().includes(lowercaseQuery) ||
      widget.description?.toLowerCase().includes(lowercaseQuery)
    );
  }
}