/**
 * Services Index
 * Central export point for all service layer components
 */

// Import services for internal use
import { configManager } from './core/ConfigManager.js';
import { performanceMonitor } from './core/PerformanceMonitor.js';
import { serviceManager } from './core/ServiceManager.js';
import { privacyManager } from './core/PrivacyManager.js';
import { pluginManager } from './plugins/PluginManager.js';
import { imageService } from './core/ImageService.js';
import { navigationService } from './core/NavigationService.js';
import { analyticsService } from './core/AnalyticsService.js';
import { locationService } from './core/LocationService.js';

// Re-export services for external use
export { imageService } from './core/ImageService.js';
export { navigationService } from './core/NavigationService.js';
export { analyticsService } from './core/AnalyticsService.js';
export { configManager } from './core/ConfigManager.js';
export { performanceMonitor } from './core/PerformanceMonitor.js';
export { serviceManager } from './core/ServiceManager.js';
export { privacyManager } from './core/PrivacyManager.js';
export { locationService } from './core/LocationService.js';

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
    enableNavigation = true,
    enableLocationTracking = true
  } = options;

  console.log('Initializing service layer with privacy compliance...');

  try {
    // Initialize configuration first
    await configManager.load({
      defaults: config.defaults || {},
      environment: config.environment || {},
      local: config.local || {},
      runtime: config.runtime || {}
    });

    // Initialize performance monitoring with privacy consent
    const monitoringEnabled = await performanceMonitor.initializeWithConsent();
    
    if (monitoringEnabled && enablePerformanceMonitoring) {
      // Enable all performance monitoring features
      performanceMonitor.trackWebVitals();
      performanceMonitor.monitorResources();
      performanceMonitor.monitorMemory();
      
      console.log('✅ Performance monitoring active (user consent granted)');
    } else {
      console.log('ℹ️ Performance monitoring disabled (no consent or disabled)');
    }

    // Register core services with service manager
    serviceManager
      .register('config', configManager, { singleton: true, lazy: false })
      .register('performance', performanceMonitor, { singleton: true, lazy: false })
      .register('privacy', privacyManager, { singleton: true, lazy: false });

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

    if (enableLocationTracking) {
      serviceManager.register('location', locationService, { 
        singleton: true, 
        dependencies: ['privacy'] 
      });
      
      // Initialize location tracking
      await locationService.initialize();
      
      // Track initial page visit
      locationService.trackVisit({
        page: window.location.pathname,
        title: document.title,
        type: 'initial_load'
      });
    }

    // Initialize plugins
    for (const plugin of plugins) {
      if (typeof plugin === 'object' && plugin.name) {
        await pluginManager.register(plugin.name, plugin, plugin.options || {});
        await pluginManager.initialize(plugin.name, plugin.initOptions || {});
      }
    }

    const services = {
      config: configManager,
      performance: performanceMonitor,
      privacy: privacyManager,
      plugins: pluginManager,
      serviceManager
    };

    if (enableImageOptimization) services.images = imageService;
    if (enableNavigation) services.navigation = navigationService;
    if (enableAnalytics) services.analytics = analyticsService;
    if (enableLocationTracking) services.location = locationService;

    // Make services globally available for development/debugging
    if (typeof window !== 'undefined') {
      window.services = services;
    }

    console.log('✅ Service layer initialized successfully');
    
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
