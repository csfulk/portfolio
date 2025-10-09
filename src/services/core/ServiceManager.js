/**
 * Service Manager
 * Central service registry and dependency injection container
 */

class ServiceManager {
  constructor() {
    this.services = new Map();
    this.factories = new Map();
    this.instances = new Map();
    this.dependencies = new Map();
    this.lifecycle = {
      beforeCreate: new Map(),
      afterCreate: new Map(),
      beforeDestroy: new Map(),
      afterDestroy: new Map()
    };
    this.config = new Map();
  }

  /**
   * Register a service
   * @param {string} name - Service name
   * @param {Function|Class|Object} serviceOrFactory - Service constructor, factory, or instance
   * @param {Object} options - Service options
   */
  register(name, serviceOrFactory, options = {}) {
    const {
      singleton = true,
      lazy = true,
      dependencies = [],
      config = {},
      lifecycle = {}
    } = options;

    // Validate service name
    if (this.services.has(name)) {
      throw new Error(`Service '${name}' is already registered`);
    }

    const serviceDefinition = {
      name,
      serviceOrFactory,
      singleton,
      lazy,
      dependencies,
      config,
      lifecycle,
      status: 'registered'
    };

    this.services.set(name, serviceDefinition);
    this.dependencies.set(name, dependencies);
    this.config.set(name, config);

    // Register lifecycle hooks
    Object.entries(lifecycle).forEach(([phase, hooks]) => {
      if (this.lifecycle[phase]) {
        this.lifecycle[phase].set(name, Array.isArray(hooks) ? hooks : [hooks]);
      }
    });

    console.log(`Service '${name}' registered${singleton ? ' (singleton)' : ''}${lazy ? ' (lazy)' : ''}`);

    // If not lazy, create immediately
    if (!lazy) {
      this.get(name);
    }

    return this;
  }

  /**
   * Register a factory function
   * @param {string} name - Factory name
   * @param {Function} factory - Factory function
   * @param {Object} options - Factory options
   */
  registerFactory(name, factory, options = {}) {
    this.factories.set(name, { factory, options });
    console.log(`Factory '${name}' registered`);
    return this;
  }

  /**
   * Get service instance
   * @param {string} name - Service name
   * @returns {*} Service instance
   */
  get(name) {
    const serviceDefinition = this.services.get(name);
    if (!serviceDefinition) {
      throw new Error(`Service '${name}' not found. Available services: ${Array.from(this.services.keys()).join(', ')}`);
    }

    // Return existing singleton instance
    if (serviceDefinition.singleton && this.instances.has(name)) {
      return this.instances.get(name);
    }

    // Create new instance
    return this._createInstance(name, serviceDefinition);
  }

  /**
   * Check if service exists
   * @param {string} name - Service name
   * @returns {boolean} True if service exists
   */
  has(name) {
    return this.services.has(name);
  }

  /**
   * Get all service names
   * @returns {Array<string>} Array of service names
   */
  getServiceNames() {
    return Array.from(this.services.keys());
  }

  /**
   * Get service definition (without creating instance)
   * @param {string} name - Service name
   * @returns {Object|null} Service definition
   */
  getServiceDefinition(name) {
    return this.services.get(name) || null;
  }

  /**
   * Inject dependencies into a function or class
   * @param {Function} target - Target function or constructor
   * @param {Array} dependencyNames - Array of dependency names
   * @returns {Function} Wrapped function with dependencies injected
   */
  inject(target, dependencyNames = []) {
    return (...args) => {
      const dependencies = dependencyNames.map(name => this.get(name));
      
      if (target.prototype) {
        // Constructor function - use new
        return new target(...dependencies, ...args);
      } else {
        // Regular function
        return target(...dependencies, ...args);
      }
    };
  }

  /**
   * Create a child container with additional services
   * @param {Object} additionalServices - Additional services to register
   * @returns {ServiceManager} Child container
   */
  createChild(additionalServices = {}) {
    const child = new ServiceManager();
    
    // Copy parent services
    this.services.forEach((definition, name) => {
      child.services.set(name, { ...definition });
    });
    
    this.dependencies.forEach((deps, name) => {
      child.dependencies.set(name, [...deps]);
    });
    
    this.config.forEach((config, name) => {
      child.config.set(name, { ...config });
    });

    // Register additional services
    Object.entries(additionalServices).forEach(([name, service]) => {
      if (typeof service === 'function') {
        child.register(name, service);
      } else {
        child.register(name, service.service || service, service.options || {});
      }
    });

    return child;
  }

  /**
   * Resolve all dependencies for a service
   * @param {string} name - Service name
   * @returns {Array} Resolved dependencies
   */
  resolveDependencies(name) {
    const dependencies = this.dependencies.get(name) || [];
    const resolved = [];

    for (const depName of dependencies) {
      if (!this.services.has(depName)) {
        throw new Error(`Dependency '${depName}' not found for service '${name}'`);
      }
      
      resolved.push(this.get(depName));
    }

    return resolved;
  }

  /**
   * Check for circular dependencies
   * @param {string} name - Service name to check
   * @param {Set} visited - Already visited services
   * @returns {boolean} True if circular dependency detected
   */
  hasCircularDependency(name, visited = new Set()) {
    if (visited.has(name)) {
      return true;
    }

    visited.add(name);
    const dependencies = this.dependencies.get(name) || [];

    for (const depName of dependencies) {
      if (this.hasCircularDependency(depName, new Set(visited))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get dependency graph
   * @returns {Object} Dependency graph representation
   */
  getDependencyGraph() {
    const graph = {};
    
    this.dependencies.forEach((deps, name) => {
      graph[name] = deps;
    });

    return graph;
  }

  /**
   * Destroy service instance
   * @param {string} name - Service name
   */
  async destroy(name) {
    const instance = this.instances.get(name);
    if (!instance) {
      console.warn(`Service '${name}' instance not found for destruction`);
      return;
    }

    try {
      // Run before destroy hooks
      await this._runLifecycleHooks('beforeDestroy', name, instance);

      // Call destroy method if it exists
      if (instance && typeof instance.destroy === 'function') {
        await instance.destroy();
      }

      // Remove instance
      this.instances.delete(name);

      // Run after destroy hooks
      await this._runLifecycleHooks('afterDestroy', name, instance);

      console.log(`Service '${name}' destroyed`);

    } catch (error) {
      console.error(`Error destroying service '${name}':`, error);
      throw error;
    }
  }

  /**
   * Destroy all service instances
   */
  async destroyAll() {
    const instances = Array.from(this.instances.keys());
    
    for (const name of instances) {
      try {
        await this.destroy(name);
      } catch (error) {
        console.error(`Failed to destroy service '${name}':`, error);
      }
    }

    this.instances.clear();
    console.log('All service instances destroyed');
  }

  /**
   * Reset the service manager
   */
  reset() {
    this.destroyAll();
    this.services.clear();
    this.factories.clear();
    this.dependencies.clear();
    this.config.clear();
    
    Object.values(this.lifecycle).forEach(hooks => hooks.clear());
    
    console.log('Service manager reset');
  }

  /**
   * Get service status information
   * @returns {Object} Service status information
   */
  getStatus() {
    const services = Array.from(this.services.entries()).map(([name, definition]) => ({
      name,
      status: definition.status,
      singleton: definition.singleton,
      lazy: definition.lazy,
      dependencies: this.dependencies.get(name) || [],
      hasInstance: this.instances.has(name),
      hasCircularDeps: this.hasCircularDependency(name)
    }));

    return {
      totalServices: this.services.size,
      activeInstances: this.instances.size,
      factories: this.factories.size,
      services
    };
  }

  /**
   * Create service instance
   * @private
   */
  async _createInstance(name, serviceDefinition) {
    try {
      serviceDefinition.status = 'creating';

      // Check for circular dependencies
      if (this.hasCircularDependency(name)) {
        throw new Error(`Circular dependency detected for service '${name}'`);
      }

      // Resolve dependencies
      const dependencies = this.resolveDependencies(name);
      const config = this.config.get(name) || {};

      let instance;

      // Run before create hooks
      await this._runLifecycleHooks('beforeCreate', name, null);

      // Create instance based on type
      const { serviceOrFactory } = serviceDefinition;

      if (typeof serviceOrFactory === 'function') {
        // Check if it's a class constructor or factory function
        if (serviceOrFactory.prototype && serviceOrFactory.prototype.constructor === serviceOrFactory) {
          // It's a class constructor
          instance = new serviceOrFactory(config, ...dependencies);
        } else {
          // It's a factory function
          instance = serviceOrFactory(config, ...dependencies);
        }
      } else if (typeof serviceOrFactory === 'object') {
        // It's already an instance
        instance = serviceOrFactory;
      } else {
        throw new Error(`Invalid service type for '${name}'. Must be function, class, or object.`);
      }

      // Handle async initialization
      if (instance && typeof instance.initialize === 'function') {
        await instance.initialize();
      }

      // Store instance if singleton
      if (serviceDefinition.singleton) {
        this.instances.set(name, instance);
      }

      serviceDefinition.status = 'created';

      // Run after create hooks
      await this._runLifecycleHooks('afterCreate', name, instance);

      console.log(`Service '${name}' created successfully`);
      
      return instance;

    } catch (error) {
      serviceDefinition.status = 'error';
      console.error(`Failed to create service '${name}':`, error);
      throw error;
    }
  }

  /**
   * Run lifecycle hooks
   * @private
   */
  async _runLifecycleHooks(phase, serviceName, instance) {
    const hooks = this.lifecycle[phase]?.get(serviceName) || [];
    
    for (const hook of hooks) {
      try {
        await hook(instance, serviceName, this);
      } catch (error) {
        console.error(`Lifecycle hook '${phase}' failed for service '${serviceName}':`, error);
      }
    }
  }
}

// Create default service manager instance
export const serviceManager = new ServiceManager();

// Export class for creating custom instances
export { ServiceManager };

export default serviceManager;
