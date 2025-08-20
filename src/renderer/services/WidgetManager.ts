import { WidgetInstance, Widget } from '../../shared/types';
import { WidgetRegistry } from './WidgetRegistry';

export class WidgetManager {
  private static instance: WidgetManager;
  private instances: Map<string, WidgetInstance> = new Map();
  private registry: WidgetRegistry;

  private constructor() {
    this.registry = WidgetRegistry.getInstance();
    this.loadDefaultWidgets();
  }

  public static getInstance(): WidgetManager {
    if (!WidgetManager.instance) {
      WidgetManager.instance = new WidgetManager();
    }
    return WidgetManager.instance;
  }

  private loadDefaultWidgets(): void {
    this.createInstance('clock', { x: 0, y: 0 }, { width: 250, height: 120 });
    this.createInstance('system-monitor', { x: 0, y: 140 }, { width: 250, height: 180 });
  }

  public createInstance(
    widgetId: string,
    position: { x: number; y: number },
    size: { width: number; height: number },
    config?: Record<string, any>
  ): WidgetInstance | null {
    const widget = this.registry.getWidget(widgetId);
    if (!widget) {
      console.error(`Widget with id "${widgetId}" not found`);
      return null;
    }

    const instance: WidgetInstance = {
      id: `${widgetId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      widgetId,
      position,
      size,
      config: config || widget.defaultConfig || {},
      visible: true,
    };

    this.instances.set(instance.id, instance);
    return instance;
  }

  public removeInstance(instanceId: string): boolean {
    return this.instances.delete(instanceId);
  }

  public getInstance(instanceId: string): WidgetInstance | undefined {
    return this.instances.get(instanceId);
  }

  public getAllInstances(): WidgetInstance[] {
    return Array.from(this.instances.values());
  }

  public getVisibleInstances(): WidgetInstance[] {
    return this.getAllInstances().filter(instance => instance.visible);
  }

  public updateInstanceConfig(instanceId: string, config: Record<string, any>): boolean {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      return false;
    }

    instance.config = { ...instance.config, ...config };
    this.instances.set(instanceId, instance);
    return true;
  }

  public updateInstancePosition(instanceId: string, position: { x: number; y: number }): boolean {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      return false;
    }

    instance.position = position;
    this.instances.set(instanceId, instance);
    return true;
  }

  public updateInstanceSize(instanceId: string, size: { width: number; height: number }): boolean {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      return false;
    }

    instance.size = size;
    this.instances.set(instanceId, instance);
    return true;
  }

  public toggleInstanceVisibility(instanceId: string): boolean {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      return false;
    }

    instance.visible = !instance.visible;
    this.instances.set(instanceId, instance);
    return true;
  }

  public getWidgetForInstance(instance: WidgetInstance): Widget | undefined {
    return this.registry.getWidget(instance.widgetId);
  }

  public saveToLocalStorage(): void {
    const instances = this.getAllInstances();
    localStorage.setItem('widget-instances', JSON.stringify(instances));
  }

  public loadFromLocalStorage(): void {
    const stored = localStorage.getItem('widget-instances');
    if (stored) {
      try {
        const instances: WidgetInstance[] = JSON.parse(stored);
        this.instances.clear();
        instances.forEach(instance => {
          this.instances.set(instance.id, instance);
        });
      } catch (error) {
        console.error('Failed to load widget instances from localStorage:', error);
      }
    }
  }
}