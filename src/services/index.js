/**
 * Services Index
 * Central export point for all service layer components
 */

// Core Services
export { imageService } from './core/ImageService.js';
export { navigationService } from './core/NavigationService.js';
export { analyticsService } from './core/AnalyticsService.js';
export { configManager } from './core/ConfigManager.js';
export { performanceMonitor } from './core/PerformanceMonitor.js';
export { serviceManager } from './core/ServiceManager.js';

// Plugin System
export { pluginManager, PluginManager } from './plugins/PluginManager.js';
export { analyticsPlugin } from './plugins/analyticsPlugin.js';

// Service Classes (for custom instances)
export { ImageService } from './core/ImageService.js';
export { NavigationService } from './core/NavigationService.js';
export { AnalyticsService } from './core/AnalyticsService.js';
export { ConfigManager } from './core/ConfigManager.js';
export { PerformanceMonitor } from './core/PerformanceMonitor.js';
export { ServiceManager } from './core/ServiceManager.js';

/**
 * Initialize all core services
 * @param {Object} options - Initialization options
 * @returns {Object} Initialized services
 */
export async function initializeServices(options = {}) {
  const {
    config = {},
    plugins = [],
    enableAnalytics = true,
    enablePerformanceMonitoring = true,
    enableImageOptimization = true,
    enableNavigation = true
  } = options;

  console.log('Initializing service layer...');

  try {
    // Initialize configuration first
    await configManager.load({
      defaults: config.defaults || {},
      environment: config.environment || {},
      local: config.local || {},
      runtime: config.runtime || {}
    });

    // Register core services with service manager
    serviceManager
      .register('config', configManager, { singleton: true, lazy: false })
      .register('performance', performanceMonitor, { singleton: true, lazy: false });

    if (enableImageOptimization) {
      serviceManager.register('images', imageService, { 
        singleton: true, 
        dependencies: ['config', 'performance'] 
      });
    }

    if (enableNavigation) {
      serviceManager.register('navigation', navigationService, { 
        singleton: true, 
        dependencies: ['config'] 
      });
    }

    if (enableAnalytics) {
      serviceManager.register('analytics', analyticsService, { 
        singleton: true, 
        dependencies: ['config', 'performance'] 
      });
    }

    // Initialize plugins
    for (const plugin of plugins) {
      if (typeof plugin === 'object' && plugin.name) {
        await pluginManager.register(plugin.name, plugin, plugin.options || {});
        await pluginManager.initialize(plugin.name, plugin.initOptions || {});
      }
    }

    // Start performance monitoring
    if (enablePerformanceMonitoring) {
      performanceMonitor.trackWebVitals();
      performanceMonitor.monitorResources();
      performanceMonitor.monitorMemory();
    }

    const services = {
      config: configManager,
      performance: performanceMonitor,
      plugins: pluginManager,
      serviceManager
    };

    if (enableImageOptimization) services.images = imageService;
    if (enableNavigation) services.navigation = navigationService;
    if (enableAnalytics) services.analytics = analyticsService;

    console.log('Service layer initialized successfully');
    
    return services;

  } catch (error) {
    console.error('Service layer initialization failed:', error);
    throw error;
  }
}

/**
 * Destroy all services
 */
export async function destroyServices() {
  console.log('Destroying service layer...');

  try {
    await pluginManager.destroyAll();
    await serviceManager.destroyAll();
    performanceMonitor.destroy();
    
    console.log('Service layer destroyed');
  } catch (error) {
    console.error('Service layer destruction failed:', error);
  }
}
